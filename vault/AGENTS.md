# AGENTS.md — Artist Web App

> Questo file viene letto automaticamente da Codex prima di ogni task.
> Contiene tutto il contesto necessario per lavorare su questo progetto.

---

## Progetto

Web app e-commerce per un'artista privata italiana. Vende opere d'arte originali
uniche. Mercato: solo Italia, fascia medio/alta. Nessun account utente per gli
acquirenti — checkout diretto via Stripe.

---

## Stack — NON derogare

- **Next.js 15** — App Router, TypeScript strict mode
- **Tailwind CSS 4** — con CSS variables custom (vedi Design System)
- **Sanity v3** — CMS per opere e profilo artista
- **Stripe Checkout** — hosted, nessun Elements custom
- **Prisma + PostgreSQL** — ordini e lock anti-doppia vendita (Neon serverless)
- **Resend** — email transazionali
- **Vercel** — deploy

---

## Design System — REGOLE ASSOLUTE

### Colori
Usare SOLO questi token. Mai classi Tailwind default per colori (`bg-white`, `text-black`, `border-gray-*`).

```css
--color-background: #FAFAF8
--color-surface:    #F4F3EF
--color-border:     #E2E0D8
--color-text-primary:   #1A1917
--color-text-secondary: #6B6860
--color-text-muted:     #9C9A93
--color-accent:         #8B6914
--color-accent-light:   #F5E6C3
--color-error:          #9B1D1D
--color-success:        #1D5C2E
```

Classi Tailwind mappate: `bg-background`, `bg-surface`, `text-text-primary`,
`text-text-secondary`, `text-text-muted`, `text-accent`, `border-border`.

### Font
- Titoli opere / hero: `font-display` (Cormorant Garamond)
- UI, nav, form, bottoni: `font-body` (DM Sans)
- Prezzi: `font-mono` (DM Mono)
- Mai usare `font-serif`, `font-sans`, `font-mono` default di Tailwind

### Layout
- Max width: `max-w-[1280px] mx-auto px-6 lg:px-20`
- Sezioni: `py-16 lg:py-24`
- Griglia opere: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8`
- Testo lungo: `max-w-[720px] mx-auto`

---

## Architettura Next.js

- `page.tsx` sono **Server Components** — nessun `'use client'` di default
- Isolare interattività in componenti client separati
- Fetch Sanity dentro Server Components con `sanityFetch`
- API Routes in `app/api/` con `NextRequest` / `NextResponse`
- Mai `getServerSideProps` o `getStaticProps`

---

## Regole di business CRITICHE

### Anti-doppia vendita (implementare ESATTAMENTE così)
Quando un utente avvia il checkout:
1. `UPDATE artwork SET status='reserved', reservedUntil=NOW()+20min WHERE status='available'` — query atomica
2. Se `updated === 0` → rispondere `409 Conflict` ("Opera non più disponibile")
3. Solo dopo il lock → creare la Stripe session
4. Webhook `checkout.session.completed` → transazione atomica: crea ordine + imposta `sold`
5. Webhook `checkout.session.expired` → ripristina `available`
6. Cron ogni 5 min → libera riserve scadute

### Stato opera
- `available` → acquistabile
- `reserved` → in checkout attivo (max 20 min)
- `sold` → venduta, visibile in archivio ma non acquistabile

### Stripe
- Valuta: EUR
- Solo Italia: `shipping_address_collection: { allowed_countries: ['IT'] }`
- Spedizione fissa 25€ assicurata
- Prezzi in centesimi su Stripe, interi EUR su Sanity

---

## Struttura cartelle

```
app/
  (site)/              # layout pubblico
    page.tsx           # Home
    galleria/page.tsx
    opere/[slug]/page.tsx
    bio/page.tsx
    commissioni/page.tsx
    contatti/page.tsx
    ordine/successo/page.tsx
    ordine/annullato/page.tsx
  api/
    checkout/route.ts
    webhook/stripe/route.ts
    cron/release-reservations/route.ts
components/
  artwork/             # ArtworkCard, BuyButton, ArtworkImageGallery
  layout/              # Nav, Footer
  ui/                  # StatusBadge, FilterChip, InputField, ecc.
lib/
  sanity/client.ts
  sanity/queries.ts
  sanity/image.ts
  stripe.ts
  prisma.ts
  resend.ts
  utils.ts             # cn() helper
types/
  artwork.ts
  order.ts
prisma/schema.prisma
sanity/schemas/
vault/                 # File .md — specifiche del progetto
```

---

## Convenzioni codice

- Nomi componenti: PascalCase
- Nomi file: kebab-case (`artwork-card.tsx`)
- Tipi TypeScript: sempre espliciti, mai `any`
- Props: sempre un'`interface` chiamata `[Component]Props`
- Query GROQ: solo in `lib/sanity/queries.ts`, mai inline
- `try/catch` su tutte le chiamate esterne (Stripe, Resend, Sanity write)
- Prezzi: `price.toLocaleString('it-IT')` per la visualizzazione

## Cose da NON fare

- ❌ Colori o font non presenti nel design system
- ❌ Tag `<form>` HTML — usare `onClick` + `useState`
- ❌ `localStorage` o `sessionStorage`
- ❌ Librerie UI esterne (Shadcn, MUI, Chakra) — UI custom con Tailwind
- ❌ `getServerSideProps` / `getStaticProps`
- ❌ CSS inline `style={{}}` — solo classi Tailwind o variabili CSS

---

## Dove trovare le specifiche dettagliate

Per ogni task, leggi il file `.md` corrispondente nella cartella `vault/`:

| Area | File |
|---|---|
| Regole business complete | `vault/01_PROJECT/business_rules.md` |
| Palette + Tailwind config | `vault/02_DESIGN/palette.md` |
| Tipografia + font import | `vault/02_DESIGN/typography.md` |
| Spacing e layout pattern | `vault/02_DESIGN/spacing_layout.md` |
| Animazioni Framer Motion | `vault/02_DESIGN/motion.md` |
| Pagina Home | `vault/03_PAGES/home.md` |
| Pagina Galleria | `vault/03_PAGES/gallery.md` |
| Scheda Opera | `vault/03_PAGES/artwork_detail.md` |
| Checkout + webhook + cron | `vault/03_PAGES/checkout.md` |
| Bio, Commissioni, Contatti | `vault/03_PAGES/bio_commissions_contact.md` |
| Pagine legali | `vault/03_PAGES/legal.md` |
| ArtworkCard | `vault/05_COMPONENTS/artwork_card.md` |
| BuyButton | `vault/05_COMPONENTS/buy_button.md` |
| Nav + Footer | `vault/05_COMPONENTS/nav.md` |
| Schema Sanity | `vault/06_BACKEND/sanity_schema.md` |
| Schema Prisma | `vault/06_BACKEND/prisma_schema.md` |
| Note legali Italia | `vault/07_LEGAL/note_legali.md` |
