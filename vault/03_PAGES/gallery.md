---
file: gallery
page: Galleria / Shop
route: /galleria
status: todo
depends_on: [[palette]], [[typography]], [[spacing_layout]], [[motion]], [[artwork_card]]
codex_priority: 2
---

# Pagina Galleria — `/galleria`

## Obiettivo
Catalogo completo delle opere. Permette di filtrare e navigare. Il layout è pulito e lascia parlare le immagini.

---

## Struttura

### 1. Header pagina
```tsx
<section className="pt-32 pb-12">
  <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
    <h1 className="font-display text-display-md text-text-primary">Galleria</h1>
    <p className="mt-3 font-body text-body-lg text-text-secondary">
      {totalCount} opere originali
    </p>
  </div>
</section>
```

---

### 2. Filtri

```tsx
// Filtri disponibili (URL search params per SEO e sharing)
// ?tecnica=olio&stato=available&anno=2024

interface FilterBarProps {
  techniques: string[]    // ['Olio su tela', 'Acquerello', ...]
  years: number[]         // [2024, 2023, 2022, ...]
  currentFilters: {
    tecnica?: string
    stato?: 'available' | 'sold' | 'all'
    anno?: string
  }
}

// JSX structure:
<div className="border-y border-border py-4">
  <div className="max-w-[1280px] mx-auto px-6 lg:px-20 flex flex-wrap gap-3 items-center">
    
    {/* Filtro disponibilità */}
    <FilterChip
      label="Disponibili"
      active={stato === 'available'}
      onClick={() => updateFilter('stato', 'available')}
    />
    <FilterChip
      label="Tutte"
      active={!stato || stato === 'all'}
      onClick={() => removeFilter('stato')}
    />

    {/* Divider */}
    <div className="h-4 w-px bg-border mx-1" />

    {/* Filtro tecnica */}
    {techniques.map(t => (
      <FilterChip
        key={t}
        label={t}
        active={tecnica === t}
        onClick={() => updateFilter('tecnica', t)}
      />
    ))}

    {/* Contatore risultati */}
    <span className="ml-auto font-body text-body-sm text-text-muted">
      {filteredCount} opere
    </span>
  </div>
</div>

// FilterChip component:
function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 font-body text-body-sm border transition-colors duration-150",
        active
          ? "bg-text-primary text-background border-text-primary"
          : "bg-transparent text-text-secondary border-border hover:border-text-secondary"
      )}
    >
      {label}
    </button>
  )
}
```

---

### 3. Griglia opere

```tsx
// I filtri aggiornano i search params → la Server Component ricarica con i nuovi dati

<motion.div
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
  variants={containerVariants}
  initial="initial"
  animate="animate"
>
  {artworks.map((artwork, i) => (
    <motion.div key={artwork._id} variants={itemVariants} custom={i}>
      <ArtworkCard artwork={artwork} />
    </motion.div>
  ))}
</motion.div>

// Empty state:
{artworks.length === 0 && (
  <div className="py-24 text-center">
    <p className="font-display text-display-sm text-text-muted">
      Nessuna opera trovata
    </p>
    <button onClick={clearFilters} className="mt-6 btn-secondary">
      Rimuovi filtri
    </button>
  </div>
)}
```

---

## Query Sanity

```typescript
export const galleryQuery = groq`
  *[_type == "artwork" 
    && ($tecnica == null || technique == $tecnica)
    && ($stato == null || $stato == "all" || status == $stato)
    && ($anno == null || year == $anno)
  ] | order(_createdAt desc) {
    _id,
    title,
    slug,
    price,
    status,
    "mainImage": images[0],
    technique,
    year,
    width,
    height
  }
`
```

---

## Gestione search params (Server Component)

```typescript
// app/(site)/galleria/page.tsx

interface Props {
  searchParams: {
    tecnica?: string
    stato?: string
    anno?: string
  }
}

export default async function GalleryPage({ searchParams }: Props) {
  const artworks = await sanityFetch({
    query: galleryQuery,
    params: {
      tecnica: searchParams.tecnica ?? null,
      stato: searchParams.stato ?? null,
      anno: searchParams.anno ? parseInt(searchParams.anno) : null,
    }
  })
  // ...
}
```

---

## Metadata SEO

```typescript
export const metadata: Metadata = {
  title: 'Galleria — Opere originali di [Nome Artista]',
  description: 'Esplora il catalogo completo di opere originali. Pittura, scultura, pezzi unici disponibili con spedizione in Italia.',
}
```

---

## Note per Codex

- I filtri aggiornano i URL search params con `router.push` (client component) — la griglia è server component
- Crea un componente client `FilterBar` separato che usa `useRouter` e `useSearchParams`
- La griglia principale rimane Server Component e legge i searchParams dalla prop
- Usare `loading.tsx` con skeleton per il loading state della griglia
