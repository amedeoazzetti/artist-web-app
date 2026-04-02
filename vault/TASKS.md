# TASKS.md — Sequenza di sviluppo

> Dai questi task a Codex **uno alla volta**, nell'ordine indicato.
> Non passare al task successivo finché il precedente non è verificato e funzionante.
> Ogni task include il prompt esatto da incollare in Codex.

---

## FASE 1 — Setup e fondamenta

### TASK 01 — Setup progetto Next.js
```
Leggi AGENTS.md.

Crea il progetto Next.js 15 con App Router e TypeScript strict mode.
Installa e configura: Tailwind CSS 4, next/font con Cormorant Garamond +
DM Sans + DM Mono da Google Fonts, la struttura cartelle descritta in AGENTS.md.

Crea globals.css con tutte le CSS variables del design system.
Crea tailwind.config.ts con tutti i token di colore, font e tipografia
descritti in vault/02_DESIGN/palette.md e vault/02_DESIGN/typography.md.

Crea lib/utils.ts con il helper cn() (clsx + tailwind-merge).

Non creare ancora pagine o componenti — solo la base configurata e funzionante.
```

---

### TASK 02 — Schema Prisma e database
```
Leggi AGENTS.md e vault/06_BACKEND/prisma_schema.md.

Installa Prisma e configura la connessione PostgreSQL via DATABASE_URL.
Crea prisma/schema.prisma con i modelli Artwork, PendingCheckout e Order
esattamente come specificato nel file di riferimento.

Crea lib/prisma.ts con il singleton pattern.
Crea il file .env.example con tutte le variabili d'ambiente necessarie.

Non eseguire migrate — solo creare i file.
```

---

### TASK 03 — Schema e client Sanity
```
Leggi AGENTS.md e vault/06_BACKEND/sanity_schema.md.

Installa next-sanity e @sanity/image-url.
Crea i file:
- sanity/schemas/artwork.ts
- sanity/schemas/artistProfile.ts
- sanity/sanity.config.ts
- lib/sanity/client.ts (con sanityFetch per Server Components)
- lib/sanity/queries.ts (con homePageQuery, galleryQuery, artworkDetailQuery)
- lib/sanity/image.ts (con la funzione urlFor)

Configura il singleton per artistProfile nello structure tool.
```

---

### TASK 04 — Configurazione Stripe e Resend
```
Leggi AGENTS.md.

Installa stripe e @stripe/stripe-js.
Crea lib/stripe.ts con l'istanza Stripe singleton.

Installa resend.
Crea lib/resend.ts con l'istanza Resend e la funzione
sendOrderConfirmation({ to, artworkTitle, amount }).

Crea types/artwork.ts e types/order.ts con le interfacce TypeScript
necessarie per tutto il progetto.
```

---

## FASE 2 — Componenti UI base

### TASK 05 — Componenti UI primitivi
```
Leggi AGENTS.md e vault/02_DESIGN/palette.md.

Crea i seguenti componenti in components/ui/:
- StatusBadge.tsx (available/reserved/sold)
- FilterChip.tsx (per i filtri galleria)
- InputField.tsx (label + input con stile design system)
- SelectField.tsx (label + select con stile design system)
- TextareaField.tsx (label + textarea con stile design system)

Ogni componente usa esclusivamente i token del design system.
Nessuna libreria UI esterna. Nessun tag <form>.
```

---

### TASK 06 — Nav e Footer
```
Leggi AGENTS.md e vault/05_COMPONENTS/nav.md.

Crea components/layout/Nav.tsx:
- sticky, trasparente su hero homepage, opaco dopo 80px di scroll
- hamburger menu mobile con overlay
- usa usePathname per link attivo

Crea components/layout/Footer.tsx:
- 3 colonne: brand, navigazione, link legali
- copyright dinamico con new Date().getFullYear()

Crea app/(site)/layout.tsx che include Nav e Footer attorno a {children}.
Sulla homepage (pathname === '/') passa transparent={true} a Nav.
```

---

### TASK 07 — ArtworkCard e skeleton
```
Leggi AGENTS.md, vault/05_COMPONENTS/artwork_card.md,
vault/02_DESIGN/typography.md e vault/02_DESIGN/motion.md.

Crea components/artwork/ArtworkCard.tsx con:
- immagine con aspect-ratio 3/4, hover scale
- titolo font-display, tecnica e anno in text-muted
- prezzo in font-mono solo se available
- StatusBadge overlay per reserved/sold
- tutto il componente è un Link verso /opere/[slug]

Crea components/artwork/ArtworkCardSkeleton.tsx con animate-pulse.
```

---

### TASK 08 — BuyButton
```
Leggi AGENTS.md, vault/05_COMPONENTS/buy_button.md
e vault/01_PROJECT/business_rules.md.

Crea components/artwork/BuyButton.tsx con la gestione completa di:
- stato idle: bottone acquisto con prezzo
- stato loading: spinner + testo "Preparazione acquisto..."
- stato error_unavailable (409): messaggio opera prenotata + link reload
- stato error_generic: messaggio errore generico
- opera reserved: box disabilitato "Prenotata — disponibile a breve"
- opera sold: box disabilitato "Opera venduta"

Il bottone chiama POST /api/checkout e fa window.location.href = url
sul successo (non router.push).
```

---

## FASE 3 — Backend

### TASK 09 — API Checkout
```
Leggi AGENTS.md, vault/03_PAGES/checkout.md
e vault/01_PROJECT/business_rules.md.

Crea app/api/checkout/route.ts che:
1. Riceve { artworkId } in POST
2. Fetch opera da Sanity
3. Optimistic lock atomico con prisma.$executeRaw (WHERE status='available')
4. Se updated === 0 → restituisce 409
5. Crea Stripe Checkout session con spedizione fissa 25€, solo Italia
6. Salva PendingCheckout su DB
7. In caso di errore Stripe → rollback status a available
8. Restituisce { url }
```

---

### TASK 10 — Webhook Stripe e cron
```
Leggi AGENTS.md, vault/03_PAGES/checkout.md
e vault/01_PROJECT/business_rules.md.

Crea app/api/webhook/stripe/route.ts che gestisce:
- checkout.session.completed → transazione prisma: crea Order + imposta sold
  + aggiorna Sanity + invia email con Resend
- checkout.session.expired → ripristina available su Prisma e Sanity
Aggiungere idempotency check: se l'ordine esiste già per quella session_id, skip.
Usare export const runtime = 'nodejs'.

Crea app/api/cron/release-reservations/route.ts che:
- Verifica Authorization header con CRON_SECRET
- Libera le riserve scadute su Prisma e Sanity
- Restituisce { released: N }

Crea vercel.json con il cron job ogni 5 minuti.
```

---

## FASE 4 — Pagine

### TASK 11 — Pagina Home
```
Leggi AGENTS.md e vault/03_PAGES/home.md.
Dipendenze già create: ArtworkCard, Nav (trasparente), TrustBadges.

Crea app/(site)/page.tsx con le sezioni:
1. Hero fullscreen con immagine Sanity, overlay gradiente, nome artista, CTA
2. Opere in evidenza: griglia 3 opere featured=true AND status=available
3. Statement artistico (blockquote centrato)
4. Sezione bio preview con foto e link a /bio

Usa homePageQuery da lib/sanity/queries.ts.
Hero con next/image priority=true per LCP.
Animazioni Framer Motion in componenti client separati.
```

---

### TASK 12 — Pagina Galleria
```
Leggi AGENTS.md e vault/03_PAGES/gallery.md.

Crea app/(site)/galleria/page.tsx con:
- Header con contatore opere
- FilterBar (componente client) che aggiorna URL search params
- Griglia opere con skeleton loading
- Empty state se nessuna opera trovata

Crea components/artwork/FilterBar.tsx come componente client
con useRouter e useSearchParams.

La griglia legge searchParams dalla prop di page.tsx (Server Component)
e usa galleryQuery con i parametri filtro.
```

---

### TASK 13 — Scheda Opera
```
Leggi AGENTS.md e vault/03_PAGES/artwork_detail.md.

Crea app/(site)/opere/[slug]/page.tsx con:
- Layout 2 colonne desktop: galleria immagini | info + CTA
- ArtworkImageGallery con thumbnails e selezione immagine attiva
- ArtworkInfo con tutte le specifiche tecniche
- BuyButton integrato
- Badge fiducia (certificato, spedizione, Stripe, imballaggio)
- generateStaticParams per tutte le opere
- generateMetadata dinamici con Open Graph
- Schema.org Product come script JSON-LD
```

---

### TASK 14 — Pagine ordine
```
Leggi AGENTS.md e vault/03_PAGES/checkout.md.

Crea app/(site)/ordine/successo/page.tsx:
- Fetch Stripe session con session_id dalla searchParam
- Mostra icona check, titolo ringraziamento, opera acquistata,
  email conferma, numero ordine (ultime 8 cifre session_id)
- CTA "Continua a esplorare" verso /galleria

Crea app/(site)/ordine/annullato/page.tsx:
- Messaggio semplice con CTA verso /galleria
```

---

### TASK 15 — Pagine secondarie
```
Leggi AGENTS.md e vault/03_PAGES/bio_commissions_contact.md.

Crea app/(site)/bio/page.tsx con:
- Hero con foto artista
- Bio lunga via PortableText con portableTextComponents custom
- Timeline percorso
- CTA finale verso galleria e commissioni

Crea app/(site)/commissioni/page.tsx con:
- Form commissione (componente client) con tutti i campi specificati
- Validazione con zod + react-hook-form
- API route POST /api/commission che invia email con Resend

Crea app/(site)/contatti/page.tsx minimale con email, Instagram, città studio.
```

---

### TASK 16 — Pagine legali e cookie banner
```
Leggi AGENTS.md e vault/03_PAGES/legal.md.

Crea le pagine con il layout LegalPageLayout condiviso:
- app/(site)/privacy/page.tsx
- app/(site)/cookie/page.tsx
- app/(site)/termini/page.tsx
- app/(site)/spedizioni/page.tsx

Ogni pagina ha struttura e sezioni come da vault/03_PAGES/legal.md
con il CSS .prose-legal per la tipografia.

Crea components/ui/CookieBanner.tsx come componente client
che mostra il banner se non c'è il cookie cookie_consent.
Aggiungilo al layout principale.
```

---

## FASE 5 — SEO e finalizzazione

### TASK 17 — SEO, sitemap e schema.org
```
Leggi AGENTS.md.

Crea app/sitemap.ts che genera la sitemap dinamica:
- pagine statiche (home, galleria, bio, commissioni, contatti)
- pagine opere dinamiche prese da Sanity

Crea app/robots.ts.

Aggiungi a app/layout.tsx i metadata globali (titolo template,
description, Open Graph default, favicon).

Aggiungi schema.org Artist JSON-LD alla pagina /bio.
Il schema.org Product è già nel TASK 13 sulla scheda opera.
```

---

### TASK 18 — Revisione finale e ottimizzazioni
```
Leggi AGENTS.md.

Fai una revisione dell'intero progetto e:
1. Verifica che tutti i componenti usino solo i token del design system
   (nessun colore Tailwind default)
2. Verifica che tutte le page.tsx siano Server Components
   (nessun 'use client' dove non serve)
3. Verifica che ogni next/image abbia il prop sizes corretto
4. Verifica che il webhook Stripe abbia l'idempotency check
5. Verifica che il cron job abbia il controllo CRON_SECRET
6. Aggiungi i metadata mancanti su ogni pagina
7. Verifica la presenza di aria-label su tutti i bottoni icon-only
```

---

## Note operative

**Tra un task e l'altro**, prima di procedere al successivo:
- Il codice TypeScript non deve avere errori (`tsc --noEmit`)
- Il progetto deve avere `npm run dev` funzionante
- Aggiorna `vault/08_PROGRESS/log.md` con cosa è stato completato

**Se Codex fa qualcosa di sbagliato** rispetto alle specifiche (colori diversi,
architettura diversa, librerie non previste), usa questo prompt di correzione:
```
Questo non rispetta le specifiche in AGENTS.md.
Leggi di nuovo [file specifico] e correggi [cosa è sbagliato].
```
