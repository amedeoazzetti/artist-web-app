---
file: artwork_card
component: ArtworkCard
path: components/artwork/ArtworkCard.tsx
status: todo
depends_on: [[palette]], [[typography]], [[motion]]
---

# Componente: ArtworkCard

## Uso
Card dell'opera nella griglia galleria e nella sezione "Opere in evidenza" della home.

---

## Props

```typescript
// types/artwork.ts
export interface Artwork {
  _id: string
  title: string
  slug: { current: string }
  price: number                          // EUR intero
  status: 'available' | 'reserved' | 'sold'
  mainImage: SanityImage
  technique: string
  year: number
  width?: number
  height?: number
}

interface ArtworkCardProps {
  artwork: Artwork
  priority?: boolean    // true per le prime 3 card (LCP optimization)
}
```

---

## JSX completo

```tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/image'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { cn } from '@/lib/utils'

export function ArtworkCard({ artwork, priority = false }: ArtworkCardProps) {
  const { title, slug, price, status, mainImage, technique, year } = artwork
  const href = `/opere/${slug.current}`
  const isAvailable = status === 'available'

  return (
    <Link href={href} className="group block">
      
      {/* Immagine */}
      <div className="relative aspect-[3/4] overflow-hidden bg-surface">
        <Image
          src={urlFor(mainImage).width(600).height(800).url()}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={cn(
            "object-cover transition-transform duration-500 ease-out",
            "group-hover:scale-[1.03]"
          )}
          priority={priority}
        />
        
        {/* Badge status (solo se non available) */}
        {status !== 'available' && (
          <div className="absolute top-3 left-3">
            <StatusBadge status={status} />
          </div>
        )}
      </div>

      {/* Info opera */}
      <div className="mt-4 space-y-1">
        <h3 className="font-display text-display-sm text-text-primary group-hover:text-accent transition-colors duration-150">
          {title}
        </h3>
        <p className="font-body text-body-sm text-text-muted">
          {year} — {technique}
        </p>
        <div className="flex items-center justify-between mt-2">
          {isAvailable ? (
            <span className="font-mono text-price-sm text-text-primary">
              €{price.toLocaleString('it-IT')}
            </span>
          ) : (
            <span className="font-body text-body-sm text-text-muted">
              {status === 'sold' ? 'Venduta' : 'Prenotata'}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
```

---

## Componente dipendente: StatusBadge

```tsx
// components/ui/StatusBadge.tsx

interface StatusBadgeProps {
  status: 'reserved' | 'sold'
}

const badgeConfig = {
  reserved: {
    label: 'Prenotata',
    className: 'bg-[#8B4A14] text-[#F5E6C3]'
  },
  sold: {
    label: 'Venduta',
    className: 'bg-[#4A4A48] text-[#E2E0D8]'
  }
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = badgeConfig[status]
  return (
    <span className={cn(
      "inline-block px-2.5 py-1 font-body text-caption uppercase tracking-wider",
      config.className
    )}>
      {config.label}
    </span>
  )
}
```

---

## Skeleton (loading state)

```tsx
// components/artwork/ArtworkCardSkeleton.tsx

export function ArtworkCardSkeleton() {
  return (
    <div>
      <div className="aspect-[3/4] bg-surface animate-pulse" />
      <div className="mt-4 space-y-2">
        <div className="h-6 bg-surface animate-pulse w-4/5" />
        <div className="h-4 bg-surface animate-pulse w-2/5" />
        <div className="h-5 bg-surface animate-pulse w-1/4 mt-2" />
      </div>
    </div>
  )
}
```

---

## Note per Codex

- Il componente è `'use client'` per il hover effect — altrimenti potrebbe restare server
- Usare `urlFor(...).width(600).height(800)` per ottimizzare il formato dell'immagine Sanity
- `sizes` prop su `next/image` è obbligatoria per performance con `fill`
- Il link wrappa tutto il componente — nessun bottone nested
- I prezzi usano `toLocaleString('it-IT')` per formattare in italiano (es. "1.250")
