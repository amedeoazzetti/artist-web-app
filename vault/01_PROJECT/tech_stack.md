---
file: tech_stack
status: definitivo
depends_on: [[brief]]
---

# Tech Stack — Definitivo

## Frontend
| Tecnologia | Versione | Note |
|---|---|---|
| Next.js | 15 (App Router) | `create-next-app` con TypeScript |
| TypeScript | 5.x | strict mode ON |
| Tailwind CSS | 4.x | con CSS variables per design tokens |
| Sanity Client | `next-sanity` | per fetch dati CMS |

## Backend / API
| Tecnologia | Versione | Note |
|---|---|---|
| Next.js API Routes | — | dentro `/app/api/` |
| Prisma ORM | 5.x | per ordini e stato pagamenti |
| PostgreSQL | 16 | via Neon (serverless) o Supabase |
| Stripe | `stripe` + `@stripe/stripe-js` | Checkout hosted |
| Resend | latest | email transazionali |

## CMS
| Tecnologia | Note |
|---|---|
| Sanity v3 | studio embedded in `/studio` o separato |
| GROQ | query language Sanity |

## Auth
| Tecnologia | Nota |
|---|---|
| Clerk | Solo per area admin — nessun account per acquirenti pubblici |

## Deploy
| Servizio | Uso |
|---|---|
| Vercel | Frontend Next.js — piano Hobby ok per MVP |
| Neon | PostgreSQL serverless — free tier ok per MVP |
| Sanity Cloud | CMS — free tier ok fino a 3 utenti |
| Stripe | account live (commissione 1.5% + 0.25€ per carta EU) |

---

## Struttura cartelle progetto

```
/
├── app/
│   ├── (site)/                  # layout pubblico
│   │   ├── page.tsx             # Home
│   │   ├── galleria/
│   │   │   └── page.tsx         # Galleria
│   │   ├── opere/
│   │   │   └── [slug]/
│   │   │       └── page.tsx     # Scheda opera
│   │   ├── bio/
│   │   ├── commissioni/
│   │   ├── contatti/
│   │   └── ordine/
│   │       ├── successo/
│   │       └── annullato/
│   ├── api/
│   │   ├── checkout/
│   │   │   └── route.ts         # Crea Stripe session
│   │   └── webhook/
│   │       └── stripe/
│   │           └── route.ts     # Webhook Stripe
│   └── studio/                  # Sanity Studio (opzionale)
├── components/
│   ├── artwork/
│   ├── layout/
│   └── ui/
├── lib/
│   ├── sanity/
│   │   ├── client.ts
│   │   ├── queries.ts
│   │   └── image.ts
│   ├── stripe.ts
│   ├── prisma.ts
│   └── resend.ts
├── prisma/
│   └── schema.prisma
├── sanity/
│   ├── schemas/
│   └── sanity.config.ts
└── types/
    ├── artwork.ts
    └── order.ts
```

---

## Variabili d'ambiente richieste

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Database
DATABASE_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@dominio.it

# App
NEXT_PUBLIC_SITE_URL=https://dominio.it
```
