---
file: legal
pages: Privacy, Cookie, Termini di vendita, Spedizioni, Recesso
routes: /privacy, /cookie, /termini, /spedizioni
status: bozza_da_revisionare_legale
depends_on: [[business_rules]]
---

# Pagine Legali

> ⚠️ Queste sono bozze di struttura. Il contenuto legale definitivo
> deve essere redatto o revisionato da un avvocato.
> Far controllare prima del go-live.

---

## Layout comune pagine legali

```tsx
// Tutte le pagine legali condividono questo layout
function LegalPageLayout({ title, lastUpdated, children }) {
  return (
    <main className="py-32">
      <div className="max-w-[720px] mx-auto px-6">
        <p className="font-body text-body-sm text-text-muted uppercase tracking-widest mb-4">
          Informazioni legali
        </p>
        <h1 className="font-display text-display-md text-text-primary">{title}</h1>
        <p className="mt-3 font-body text-body-sm text-text-muted">
          Ultimo aggiornamento: {lastUpdated}
        </p>
        <div className="mt-12 prose-legal">
          {children}
        </div>
      </div>
    </main>
  )
}
```

### CSS prose legale (globals.css)
```css
.prose-legal h2 {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--color-text-primary);
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}
.prose-legal p {
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
}
.prose-legal ul {
  list-style: disc;
  padding-left: 1.5rem;
  color: var(--color-text-secondary);
}
```

---

## Struttura: Termini di Vendita — `/termini`

Sezioni obbligatorie per il D.Lgs. 206/2005 (Codice del Consumo):

1. **Venditore** — dati completi (nome/ragione sociale, P.IVA, indirizzo, email)
2. **Oggetto** — vendita opere d'arte originali, pezzi unici
3. **Prezzi** — IVA inclusa, valuta EUR
4. **Ordine e conferma** — processo di acquisto, when il contratto è concluso
5. **Pagamento** — Stripe, metodi accettati, sicurezza
6. **Spedizione** — solo Italia, tempi, corriere, costi
7. **Diritto di recesso** — **escluso** per opere uniche d'arte (art. 59 lett. c)
8. **Garanzie legali** — conformità del prodotto
9. **Risoluzione controversie** — foro competente, ODR europeo
10. **Dati personali** — rimando a Privacy Policy

### Nota critica sul recesso
```
In base all'art. 59, comma 1, lett. c) del D.Lgs. 206/2005,
il diritto di recesso è escluso per i contratti di fornitura
di beni confezionati su misura o chiaramente personalizzati
e per le opere d'arte la cui consegna comporta rischio di
deterioramento o alterazione.

Il consumatore è informato di questa esclusione prima della
conclusione del contratto (durante il checkout).
```

---

## Struttura: Privacy Policy — `/privacy`

Conforme al GDPR (Reg. UE 2016/679):

1. **Titolare del trattamento** — dati completi artista
2. **Dati raccolti** — email, nome, indirizzo (solo per ordini), IP (log tecnici)
3. **Finalità** — evasione ordini, comunicazioni commerciali (con consenso), obblighi legali
4. **Base giuridica** — contratto (ordini), consenso (newsletter), legge (fatturazione)
5. **Conservazione** — ordini: 10 anni (obbligo fiscale), newsletter: fino a revoca
6. **Destinatari** — Stripe (pagamenti), Resend (email), Vercel (hosting), Sanity (CMS)
7. **Diritti dell'interessato** — accesso, rettifica, cancellazione, portabilità
8. **Cookie** — rimando a Cookie Policy
9. **Contatto DPO/Titolare** — email dedicata

---

## Struttura: Cookie Policy — `/cookie`

1. **Cosa sono i cookie**
2. **Cookie tecnici necessari** (nessun consenso richiesto)
   - Stripe session cookie
   - Preferenze UI
3. **Cookie analitici** (con consenso)
   - Se si usa Vercel Analytics o Plausible
   - **Raccomandazione:** usare Plausible (privacy-first, no consenso necessario per analytics aggregati)
4. **Cookie di terze parti** — Stripe
5. **Come disabilitare i cookie**
6. **Cookie banner** — implementare con gestione consenso

### Cookie Banner Component
```tsx
// components/ui/CookieBanner.tsx
// Mostrare solo se non c'è consenso in localStorage-equivalent (usare cookie stesso)
// Bottoni: "Accetta tutti" | "Solo necessari"
// Dopo scelta: nascondere e salvare preferenza

'use client'
export function CookieBanner() {
  const [visible, setVisible] = useState(false)
  
  useEffect(() => {
    const consent = document.cookie.includes('cookie_consent=')
    if (!consent) setVisible(true)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-6 bg-text-primary text-background">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
        <p className="font-body text-body-sm">
          Usiamo cookie tecnici per il funzionamento del sito e Stripe per i pagamenti.{' '}
          <a href="/cookie" className="underline">Scopri di più</a>
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button onClick={() => accept('necessary')} className="btn-ghost-white text-sm">
            Solo necessari
          </button>
          <button onClick={() => accept('all')} className="btn-white text-sm">
            Accetta
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

## Struttura: Spedizioni — `/spedizioni`

1. **Zone di consegna** — solo Italia (incluse isole)
2. **Corriere** — [da definire con artista] tracciato + assicurato
3. **Tempi** — 3–7 giorni lavorativi dalla conferma pagamento
4. **Costo** — 25€ fisso, assicurazione inclusa
5. **Imballaggio** — professionale, cura massima per opere
6. **Problemi consegna** — cosa fare in caso di danni, contatti

---

## Footer link legali

Il footer deve sempre includere:
```tsx
<nav className="flex flex-wrap gap-4">
  <a href="/privacy">Privacy Policy</a>
  <a href="/cookie">Cookie Policy</a>
  <a href="/termini">Termini di vendita</a>
  <a href="/spedizioni">Spedizioni</a>
</nav>
<p>P.IVA [numero] — [Nome] — [email]</p>
```
