---
file: business_rules
status: definitivo
depends_on: [[brief]], [[tech_stack]]
---

# Regole di Business — Critiche

> ⚠️ Queste regole devono essere implementate esattamente come descritte.
> Non semplificare, non ottimizzare a meno che non sia indicato.

---

## 1. Ciclo di vita di un'opera

```
available → reserved → sold
     ↑           |
     └───────────┘  (se reservedUntil scade senza pagamento)
```

### Stati
| Stato | Significato | Acquistabile | Visibile |
|---|---|---|---|
| `available` | Opera disponibile | ✅ | ✅ |
| `reserved` | In checkout attivo | ❌ | ✅ (con badge "Prenotata") |
| `sold` | Venduta | ❌ | ✅ (archivio, senza prezzo) |

### Regola reservedUntil
- Quando si crea una Stripe session, l'opera viene messa in `reserved`
- `reservedUntil = now() + 20 minuti`
- Un cron job (o controllo on-demand) resetta a `available` le opere con `reservedUntil < now()` e stato `reserved`
- **Implementazione cron:** Vercel Cron Job ogni 5 minuti su `/api/cron/release-reservations`

---

## 2. Anti-doppia vendita — Logica transazionale

### Flusso corretto (implementare ESATTAMENTE così)

```typescript
// In /api/checkout/route.ts
// Step 1: Optimistic lock atomico su Postgres
const updated = await prisma.$executeRaw`
  UPDATE "Artwork"
  SET status = 'reserved', "reservedUntil" = NOW() + INTERVAL '20 minutes'
  WHERE id = ${artworkId}
    AND status = 'available'
`;

// Se nessuna riga aggiornata → opera non disponibile
if (updated === 0) {
  return NextResponse.json(
    { error: 'Opera non più disponibile' },
    { status: 409 }
  );
}

// Step 2: Solo dopo il lock, crea la Stripe session
const session = await stripe.checkout.sessions.create({ ... });

// Step 3: Salva il link session→artwork su DB
await prisma.pendingCheckout.create({
  data: { artworkId, stripeSessionId: session.id }
});
```

### Webhook Stripe (checkout.session.completed)

```typescript
// In /api/webhook/stripe/route.ts
// Transazione atomica: crea ordine + imposta sold
await prisma.$transaction([
  prisma.order.create({ data: { ... } }),
  prisma.artwork.update({
    where: { id: artworkId },
    data: { status: 'sold', reservedUntil: null }
  })
]);
```

### Webhook Stripe (checkout.session.expired)

```typescript
// Libera la riserva se la session scade senza pagamento
await prisma.artwork.updateMany({
  where: {
    status: 'reserved',
    pendingCheckouts: { some: { stripeSessionId: event.data.object.id } }
  },
  data: { status: 'available', reservedUntil: null }
});
```

---

## 3. Spedizione — Regole

- **Solo Italia** (Stripe Checkout: `shipping_address_collection: { allowed_countries: ['IT'] }`)
- **Costo spedizione:** fisso 25€ (incluso assicurazione opera)
- Spedizione con corriere tracciato (DHL / BRT — da definire con artista)
- Imballaggio professionale incluso nel prezzo spedizione

### Come aggiungere spedizione in Stripe
```typescript
shipping_options: [
  {
    shipping_rate_data: {
      type: 'fixed_amount',
      fixed_amount: { amount: 2500, currency: 'eur' },
      display_name: 'Spedizione assicurata in Italia',
      delivery_estimate: {
        minimum: { unit: 'business_day', value: 3 },
        maximum: { unit: 'business_day', value: 7 }
      }
    }
  }
]
```

---

## 4. IVA e pricing

- L'artista è soggetto IVA? → **Da verificare con commercialista**
- Prezzi mostrati sul sito: **IVA inclusa** (indicare "IVA inclusa" vicino al prezzo)
- In Stripe: il prezzo impostato è il totale finale (artista gestisce IVA lato suo)

---

## 5. Diritto di recesso (Italia)

Per legge (D.Lgs. 206/2005, art. 59), il diritto di recesso di 14 giorni **può essere escluso** per:
- Opere d'arte su commissione personalizzata
- Beni che per loro natura non possono essere rispediti o rischiano di deteriorarsi

**Decisione raccomandata:**
- Opere standard del catalogo: **recesso escluso** (opera unica, non riproducibile)
- Commissioni: **recesso escluso** (fatto su misura)
- Questo va dichiarato esplicitamente in fase di checkout e nelle condizioni di vendita

> ⚠️ Far revisionare le condizioni di vendita da un legale prima del lancio.

---

## 6. Email transazionali (Resend)

| Evento | Destinatario | Template |
|---|---|---|
| Ordine completato | Acquirente | `order-confirmation` |
| Ordine completato | Artista (admin) | `new-order-admin` |
| Commissione ricevuta | Artista (admin) | `new-commission-admin` |
| Spedizione avvenuta | Acquirente | `shipping-notification` (manuale da admin) |
