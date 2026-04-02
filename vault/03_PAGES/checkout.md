---
file: checkout
page: Checkout + Ordine
routes: /api/checkout, /ordine/successo, /ordine/annullato
status: todo
depends_on: [[business_rules]], [[palette]], [[typography]], [[stripe_flow]]
codex_priority: 1
---

# Checkout & Ordine

---

## Flusso completo

```
[Scheda Opera] → BuyButton click
    → POST /api/checkout
        → Optimistic lock DB (reserved)
        → Crea Stripe Session
        → Restituisce { url }
    → redirect(url) su Stripe Hosted Checkout
        → Utente paga
    → Stripe webhook POST /api/webhook/stripe
        → checkout.session.completed
            → Transazione: crea Order + imposta sold
            → Invia email conferma
    → Stripe redirect → /ordine/successo?session_id=xxx
```

---

## API Route: POST /api/checkout

```typescript
// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sanityClient } from '@/lib/sanity/client'
import { groq } from 'next-sanity'

export async function POST(req: NextRequest) {
  const { artworkId } = await req.json()

  // 1. Fetch opera da Sanity
  const artwork = await sanityClient.fetch(groq`
    *[_type == "artwork" && _id == $id][0] {
      _id, title, price, status, "imageUrl": images[0].asset->url
    }
  `, { id: artworkId })

  if (!artwork) {
    return NextResponse.json({ error: 'Opera non trovata' }, { status: 404 })
  }

  // 2. Optimistic lock — aggiorna status atomicamente
  const updated = await prisma.$executeRaw`
    UPDATE "Artwork"
    SET status = 'reserved', "reservedUntil" = NOW() + INTERVAL '20 minutes'
    WHERE "sanityId" = ${artworkId}
      AND status = 'available'
  `

  if (updated === 0) {
    return NextResponse.json(
      { error: 'Opera non più disponibile' },
      { status: 409 }
    )
  }

  try {
    // 3. Crea Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'eur',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: artwork.title,
              images: [artwork.imageUrl],
              description: 'Opera originale — pezzo unico',
            },
            unit_amount: artwork.price * 100, // centesimi
          },
          quantity: 1,
        },
      ],
      shipping_address_collection: {
        allowed_countries: ['IT'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 2500, currency: 'eur' },
            display_name: 'Spedizione assicurata in Italia',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
      ],
      payment_method_types: ['card'],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/ordine/successo?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/opere/${artwork.slug}?cancelled=true`,
      metadata: { artworkId, artworkTitle: artwork.title },
    })

    // 4. Salva pending checkout
    await prisma.pendingCheckout.create({
      data: { artworkSanityId: artworkId, stripeSessionId: session.id }
    })

    return NextResponse.json({ url: session.url })

  } catch (error) {
    // Rollback riserva se Stripe fallisce
    await prisma.$executeRaw`
      UPDATE "Artwork"
      SET status = 'available', "reservedUntil" = NULL
      WHERE "sanityId" = ${artworkId}
    `
    return NextResponse.json({ error: 'Errore checkout' }, { status: 500 })
  }
}
```

---

## API Route: POST /api/webhook/stripe

```typescript
// app/api/webhook/stripe/route.ts
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmation } from '@/lib/resend'
import { sanityWriteClient } from '@/lib/sanity/client'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.CheckoutSession
    const artworkId = session.metadata?.artworkId

    // Transazione atomica
    await prisma.$transaction(async (tx) => {
      // Crea ordine
      const order = await tx.order.create({
        data: {
          stripeSessionId: session.id,
          artworkSanityId: artworkId,
          artworkTitle: session.metadata?.artworkTitle,
          amountTotal: session.amount_total! / 100,
          currency: 'EUR',
          customerEmail: session.customer_details?.email,
          customerName: session.customer_details?.name,
          shippingAddress: session.shipping_details?.address,
          status: 'paid',
        }
      })

      // Imposta opera come sold su Prisma
      await tx.artwork.updateMany({
        where: { sanityId: artworkId },
        data: { status: 'sold', reservedUntil: null }
      })

      return order
    })

    // Aggiorna anche Sanity (status sold)
    await sanityWriteClient
      .patch(artworkId)
      .set({ status: 'sold' })
      .commit()

    // Invia email conferma
    await sendOrderConfirmation({
      to: session.customer_details?.email!,
      artworkTitle: session.metadata?.artworkTitle!,
      amount: session.amount_total! / 100,
    })
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.CheckoutSession
    const artworkId = session.metadata?.artworkId

    // Libera riserva
    await prisma.artwork.updateMany({
      where: { sanityId: artworkId, status: 'reserved' },
      data: { status: 'available', reservedUntil: null }
    })
    await sanityWriteClient
      .patch(artworkId)
      .set({ status: 'available' })
      .commit()
  }

  return NextResponse.json({ received: true })
}

// IMPORTANTE: disabilitare body parser per i webhook
export const config = { api: { bodyParser: false } }
```

---

## Pagina: /ordine/successo

```tsx
// app/(site)/ordine/successo/page.tsx

export default async function OrderSuccessPage({
  searchParams: { session_id }
}: { searchParams: { session_id: string } }) {

  // Fetch dettagli sessione per mostrare riepilogo
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items']
  })

  return (
    <main className="min-h-screen flex items-center justify-center py-24">
      <div className="max-w-[560px] mx-auto px-6 text-center space-y-8">
        
        {/* Icona successo */}
        <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mx-auto">
          <CheckIcon className="w-8 h-8 text-accent" />
        </div>

        <div>
          <h1 className="font-display text-display-sm text-text-primary">
            Grazie per il tuo acquisto
          </h1>
          <p className="mt-4 font-body text-body-lg text-text-secondary">
            Hai acquisito <strong>{session.line_items?.data[0]?.description}</strong>.
            Riceverai una email di conferma a {session.customer_details?.email}.
          </p>
        </div>

        <div className="p-6 bg-surface border border-border text-left space-y-3">
          <p className="font-body text-body-sm text-text-muted">Numero ordine</p>
          <p className="font-mono text-body text-text-primary">{session.id.slice(-8).toUpperCase()}</p>
        </div>

        <p className="font-body text-body-sm text-text-secondary">
          L'artista ti contatterà per organizzare la spedizione entro 3–5 giorni lavorativi.
        </p>

        <a href="/galleria" className="inline-block btn-secondary">
          Continua a esplorare
        </a>
      </div>
    </main>
  )
}
```

---

## Pagina: /ordine/annullato

```tsx
// Pagina semplice — redirect alla scheda opera con messaggio
// La URL di annullamento di Stripe include già il ?cancelled=true
// La scheda opera mostra un toast se ?cancelled=true è presente

// Creare comunque la pagina come fallback:
export default function OrderCancelledPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="font-display text-display-sm text-text-primary">
          Acquisto annullato
        </h1>
        <p className="font-body text-body-lg text-text-secondary">
          Il tuo pagamento non è stato completato. L'opera è di nuovo disponibile.
        </p>
        <a href="/galleria" className="inline-block btn-primary">
          Torna alla galleria
        </a>
      </div>
    </main>
  )
}
```

---

## Cron Job: release-reservations

```typescript
// app/api/cron/release-reservations/route.ts
// Configurare in vercel.json: { "crons": [{ "path": "/api/cron/release-reservations", "schedule": "*/5 * * * *" }] }

export async function GET(req: NextRequest) {
  // Verifica token sicurezza
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const expired = await prisma.artwork.findMany({
    where: {
      status: 'reserved',
      reservedUntil: { lt: new Date() }
    }
  })

  for (const artwork of expired) {
    await prisma.artwork.update({
      where: { id: artwork.id },
      data: { status: 'available', reservedUntil: null }
    })
    await sanityWriteClient
      .patch(artwork.sanityId)
      .set({ status: 'available' })
      .commit()
  }

  return NextResponse.json({ released: expired.length })
}
```

---

## Note per Codex

- Il webhook Stripe richiede `export const runtime = 'nodejs'` — non funziona con edge runtime
- Testare webhook in locale con Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhook/stripe`
- `sanityWriteClient` usa il token con permessi `editor` — non usare il client pubblico
- Aggiungere idempotency check nel webhook: se l'ordine esiste già per quella session_id, non riprocessare
