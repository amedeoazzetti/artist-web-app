---
file: artwork_detail
page: Scheda Opera
route: /opere/[slug]
status: todo
depends_on: [[palette]], [[typography]], [[spacing_layout]], [[motion]], [[buy_button]], [[image_zoom]], [[business_rules]]
codex_priority: 1
---

# Scheda Opera — `/opere/[slug]`

## Obiettivo
La pagina più importante del sito. Deve vendere l'opera attraverso immagini di qualità, storytelling e fiducia. Il pulsante di acquisto è la CTA principale.

---

## Struttura layout (desktop: 2 colonne)

```
[ Galleria immagini  ]  [ Info opera + CTA ]
[    (col sinistra)  ]  [ (col destra)      ]
```

---

### Layout principale

```tsx
// app/(site)/opere/[slug]/page.tsx

<div className="max-w-[1280px] mx-auto px-6 lg:px-20 py-12 lg:py-20">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
    
    {/* Colonna sinistra: immagini */}
    <ArtworkImageGallery images={artwork.images} title={artwork.title} />
    
    {/* Colonna destra: info + CTA (sticky su desktop) */}
    <div className="lg:sticky lg:top-24 lg:self-start">
      <ArtworkInfo artwork={artwork} />
    </div>
  </div>

  {/* Sezione descrizione lunga — fullwidth sotto */}
  <div className="mt-20 max-w-[720px]">
    <ArtworkDescription content={artwork.description} />
  </div>
</div>
```

---

### Componente: ArtworkImageGallery

```tsx
interface ArtworkImageGalleryProps {
  images: SanityImage[]
  title: string
}

// JSX:
<div className="space-y-3">
  {/* Immagine principale con zoom */}
  <ImageZoom
    src={urlFor(images[0]).width(1200).url()}
    alt={title}
    className="aspect-[4/5] w-full object-cover cursor-zoom-in"
  />
  
  {/* Thumbnails */}
  {images.length > 1 && (
    <div className="grid grid-cols-4 gap-3">
      {images.map((img, i) => (
        <button
          key={i}
          onClick={() => setActiveImage(i)}
          className={cn(
            "aspect-square overflow-hidden border-2 transition-colors",
            activeImage === i ? "border-text-primary" : "border-transparent"
          )}
        >
          <Image src={urlFor(img).width(200).url()} alt="" fill className="object-cover" />
        </button>
      ))}
    </div>
  )}
</div>
```

---

### Componente: ArtworkInfo

```tsx
interface ArtworkInfoProps {
  artwork: {
    title: string
    year: number
    technique: string
    width: number        // cm
    height: number       // cm
    depth?: number       // cm (per sculture)
    price: number        // EUR, intero
    status: 'available' | 'reserved' | 'sold'
    description: PortableTextBlock[]
    certificate: boolean // certificato autenticità incluso
  }
}

// JSX:
<div className="space-y-8">
  
  {/* Titolo e anno */}
  <div>
    <h1 className="font-display text-display-sm text-text-primary">
      {title}
    </h1>
    <p className="mt-2 font-body text-body-sm text-text-muted">
      {year} — {technique}
    </p>
  </div>

  {/* Prezzo */}
  <div>
    <span className="font-mono text-price text-text-primary">
      €{price.toLocaleString('it-IT')}
    </span>
    <span className="ml-2 font-body text-body-sm text-text-muted">IVA inclusa</span>
  </div>

  {/* CTA */}
  <BuyButton artwork={{ id, title, price, status }} />

  {/* Specifiche tecniche */}
  <dl className="grid grid-cols-2 gap-4 py-6 border-y border-border">
    <div>
      <dt className="font-body text-body-sm text-text-muted">Dimensioni</dt>
      <dd className="mt-1 font-body text-body text-text-primary">
        {width} × {height}{depth ? ` × ${depth}` : ''} cm
      </dd>
    </div>
    <div>
      <dt className="font-body text-body-sm text-text-muted">Tecnica</dt>
      <dd className="mt-1 font-body text-body text-text-primary">{technique}</dd>
    </div>
    <div>
      <dt className="font-body text-body-sm text-text-muted">Anno</dt>
      <dd className="mt-1 font-body text-body text-text-primary">{year}</dd>
    </div>
    <div>
      <dt className="font-body text-body-sm text-text-muted">Pezzo</dt>
      <dd className="mt-1 font-body text-body text-text-primary">Unico, originale</dd>
    </div>
  </dl>

  {/* Badge fiducia */}
  <ul className="space-y-3">
    {certificate && (
      <li className="flex items-center gap-3 font-body text-body-sm text-text-secondary">
        <CheckIcon className="w-4 h-4 text-accent flex-shrink-0" />
        Certificato di autenticità incluso
      </li>
    )}
    <li className="flex items-center gap-3 font-body text-body-sm text-text-secondary">
      <CheckIcon className="w-4 h-4 text-accent flex-shrink-0" />
      Spedizione assicurata in Italia — 25€
    </li>
    <li className="flex items-center gap-3 font-body text-body-sm text-text-secondary">
      <CheckIcon className="w-4 h-4 text-accent flex-shrink-0" />
      Pagamento sicuro via Stripe
    </li>
    <li className="flex items-center gap-3 font-body text-body-sm text-text-secondary">
      <CheckIcon className="w-4 h-4 text-accent flex-shrink-0" />
      Imballaggio professionale
    </li>
  </ul>
</div>
```

---

## Query Sanity

```typescript
export const artworkDetailQuery = groq`
  *[_type == "artwork" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    price,
    status,
    images,
    technique,
    year,
    width,
    height,
    depth,
    description,
    certificate,
    seoTitle,
    seoDescription,
    "mainImageUrl": images[0].asset->url
  }
`
```

---

## Metadata SEO dinamici

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const artwork = await sanityFetch({ query: artworkDetailQuery, params })
  return {
    title: artwork.seoTitle ?? `${artwork.title} — [Nome Artista]`,
    description: artwork.seoDescription,
    openGraph: {
      images: [{ url: artwork.mainImageUrl }],
      type: 'website',
    },
  }
}
```

---

## generateStaticParams

```typescript
export async function generateStaticParams() {
  const slugs = await sanityFetch({ query: groq`*[_type == "artwork"].slug.current` })
  return slugs.map((slug: string) => ({ slug }))
}
```

---

## Note per Codex

- `ArtworkImageGallery` e `BuyButton` sono client components (`'use client'`)
- `ArtworkInfo` può essere server component se non ha interattività
- Lo stato dell'opera viene passato come prop a `BuyButton` — il componente non fa fetch
- Aggiungere `<script type="application/ld+json">` con schema.org `Product` per SEO
- Revalidare la pagina via webhook Sanity quando lo status opera cambia
