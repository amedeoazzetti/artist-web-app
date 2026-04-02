---
file: prisma_schema
status: todo
depends_on: [[business_rules]], [[tech_stack]]
---

# Prisma Schema — Database Ordini

## Schema completo (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Mirror locale dello status opera — fonte di verità per i lock
model Artwork {
  id              String    @id @default(cuid())
  sanityId        String    @unique  // _id di Sanity
  status          ArtworkStatus @default(AVAILABLE)
  reservedUntil   DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  orders          Order[]
  pendingCheckouts PendingCheckout[]

  @@index([status])
  @@index([reservedUntil])
}

enum ArtworkStatus {
  AVAILABLE
  RESERVED
  SOLD
}

// Checkout in corso — collega Stripe session a opera
model PendingCheckout {
  id              String   @id @default(cuid())
  artworkId       String
  artwork         Artwork  @relation(fields: [artworkId], references: [id])
  stripeSessionId String   @unique
  createdAt       DateTime @default(now())
  expiresAt       DateTime // now() + 20 min

  @@index([stripeSessionId])
  @@index([expiresAt])
}

// Ordini completati
model Order {
  id              String      @id @default(cuid())
  stripeSessionId String      @unique
  artworkId       String
  artwork         Artwork     @relation(fields: [artworkId], references: [id])
  artworkTitle    String
  amountSubtotal  Int         // centesimi (prezzo opera)
  amountShipping  Int         // centesimi (spedizione, es. 2500)
  amountTotal     Int         // centesimi (totale)
  currency        String      @default("EUR")
  customerEmail   String
  customerName    String?
  shippingName    String?
  shippingLine1   String?
  shippingLine2   String?
  shippingCity    String?
  shippingPostal  String?
  shippingCountry String?     @default("IT")
  status          OrderStatus @default(PAID)
  shippingTracking String?    // numero tracking spedizione (aggiunto manualmente)
  shippedAt       DateTime?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([customerEmail])
  @@index([status])
  @@index([createdAt])
}

enum OrderStatus {
  PAID        // pagato, in attesa di spedizione
  SHIPPED     // spedito
  DELIVERED   // consegnato (opzionale)
  REFUNDED    // rimborsato (gestione manuale)
}
```

---

## Migrations

```bash
# Primo setup
npx prisma migrate dev --name init

# Dopo modifiche allo schema
npx prisma migrate dev --name describe_change

# In produzione
npx prisma migrate deploy
```

---

## lib/prisma.ts (singleton pattern)

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## Query utili (admin / debug)

```typescript
// Tutte le opere disponibili
const available = await prisma.artwork.findMany({
  where: { status: 'AVAILABLE' }
})

// Riserve scadute (da liberare)
const expiredReservations = await prisma.artwork.findMany({
  where: {
    status: 'RESERVED',
    reservedUntil: { lt: new Date() }
  }
})

// Ultimi 10 ordini
const recentOrders = await prisma.order.findMany({
  orderBy: { createdAt: 'desc' },
  take: 10,
  include: { artwork: true }
})

// Fatturato totale
const revenue = await prisma.order.aggregate({
  where: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } },
  _sum: { amountTotal: true }
})
// revenue._sum.amountTotal / 100 → EUR
```

---

## Note per Codex

- Il DB Prisma è il **sistema di lock** — Sanity è solo la fonte dei contenuti editoriali
- Lo status su Prisma e su Sanity devono rimanere sincronizzati — aggiornarli entrambi nel webhook
- Usare sempre `prisma.$executeRaw` per l'optimistic lock (non `prisma.artwork.update`) — vedi [[business_rules]]
- I prezzi sono salvati in **centesimi** su Prisma/Stripe, in **EUR interi** su Sanity — convertire sempre
- `amountSubtotal` e `amountShipping` si ottengono dalla Stripe session: `session.amount_subtotal` e `session.shipping_cost?.amount_total`
