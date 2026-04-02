---
file: home
page: Home
route: /
status: todo
depends_on: [[palette]], [[typography]], [[spacing_layout]], [[motion]], [[artwork_card]], [[trust_badges]]
codex_priority: 1
---

# Pagina Home — `/`

## Obiettivo
Prima impressione dell'artista. Deve comunicare estetica, autorevolezza e invitare alla scoperta delle opere. Non è una landing page di vendita aggressiva — è un ingresso in uno spazio culturale.

---

## Struttura sezioni (dall'alto)

### 1. Nav
→ Vedi [[nav]] — sticky, trasparente su hero, opaco su scroll

### 2. Hero — Fullscreen
```tsx
// app/(site)/page.tsx → sezione Hero

// Layout: immagine fullscreen con overlay gradiente + testo in basso a sinistra
// Immagine: da Sanity (heroImage del documento artistProfile)
// Testo: nome artista + tagline

interface HeroProps {
  artistName: string       // es. "Marta Ferrini"
  tagline: string          // es. "Pittura su tela — Milano"
  heroImage: SanityImage
  ctaLabel: string         // es. "Scopri le opere"
  ctaHref: string          // "/galleria"
}

// JSX structure:
<section className="relative min-h-screen flex items-end pb-16 lg:pb-24">
  {/* Background image */}
  <div className="absolute inset-0">
    <Image
      src={urlFor(heroImage).width(1920).url()}
      alt={artistName}
      fill
      className="object-cover"
      priority
    />
    {/* Gradiente overlay bottom */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
  </div>

  {/* Testo hero */}
  <div className="relative max-w-[1280px] mx-auto px-6 lg:px-20 w-full">
    <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{duration:0.7}}>
      <h1 className="font-display text-display-xl text-white tracking-tight">
        {artistName}
      </h1>
      <p className="mt-3 font-body text-body-lg text-white/70">
        {tagline}
      </p>
      <a href={ctaHref} className="mt-8 inline-block btn-primary">
        {ctaLabel}
      </a>
    </motion.div>
  </div>
</section>
```

---

### 3. Opere in Evidenza
```tsx
// Titolo sezione + griglia 3 opere (featured: true in Sanity)
// Query Sanity: opere con featured=true AND status='available', max 3

interface FeaturedSectionProps {
  artworks: Artwork[]  // max 3, solo available
}

// JSX structure:
<section className="py-24">
  <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
    {/* Header sezione */}
    <div className="flex items-end justify-between mb-12">
      <h2 className="font-display text-display-md text-text-primary">
        Opere recenti
      </h2>
      <a href="/galleria" className="font-body text-body-sm text-accent hover:underline">
        Vedi tutte →
      </a>
    </div>

    {/* Griglia */}
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
      variants={containerVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      {artworks.map(artwork => (
        <motion.div key={artwork._id} variants={itemVariants}>
          <ArtworkCard artwork={artwork} />
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>
```

---

### 4. Citazione / Statement artistico
```tsx
// Testo breve dell'artista — da Sanity (artistProfile.statement)
// Layout: testo centrato, grande, font display

<section className="py-24 bg-surface">
  <div className="max-w-[720px] mx-auto px-6 text-center">
    <blockquote className="font-display text-display-sm text-text-primary italic leading-relaxed">
      "{statement}"
    </blockquote>
    <cite className="mt-6 block font-body text-body-sm text-text-muted not-italic">
      — {artistName}
    </cite>
  </div>
</section>
```

---

### 5. Trust Badges
→ Vedi [[trust_badges]] — "opera unica", "pagamento sicuro", "spedizione Italia"

---

### 6. Sezione Bio (breve)
```tsx
// Preview della bio con link a pagina completa
// Layout: testo a sinistra, foto a destra (o viceversa)

<section className="py-24">
  <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      <div>
        <p className="font-body text-body-sm text-accent uppercase tracking-widest mb-4">
          L'artista
        </p>
        <h2 className="font-display text-display-md text-text-primary mb-6">
          {artistName}
        </h2>
        <p className="font-body text-body-lg text-text-secondary leading-relaxed">
          {bioExcerpt} {/* max 150 parole da Sanity */}
        </p>
        <a href="/bio" className="mt-8 inline-block btn-secondary">
          Scopri di più
        </a>
      </div>
      <div className="aspect-[4/5] relative overflow-hidden">
        <Image src={artistPortrait} alt={artistName} fill className="object-cover" />
      </div>
    </div>
  </div>
</section>
```

---

### 7. Footer
→ Vedi [[footer]]

---

## Query Sanity per questa pagina

```typescript
// lib/sanity/queries.ts

export const homePageQuery = groq`{
  "artistProfile": *[_type == "artistProfile"][0] {
    name,
    tagline,
    heroImage,
    statement,
    bioExcerpt,
    portrait
  },
  "featuredArtworks": *[_type == "artwork" && featured == true && status == "available"] | order(_createdAt desc) [0...3] {
    _id,
    title,
    slug,
    price,
    status,
    "mainImage": images[0],
    technique,
    year
  }
}`
```

---

## Metadata SEO

```typescript
export const metadata: Metadata = {
  title: 'Nome Artista — Opere d\'arte originali',
  description: 'Acquista opere originali di [nome artista]. Pittura su tela, pezzi unici con spedizione in tutta Italia.',
  openGraph: {
    images: [{ url: heroImageUrl }]
  }
}
```

---

## Note per Codex

- Questa è una Server Component — fetch dati direttamente con `sanityFetch`
- Il hero deve usare `priority` su Next/Image per LCP ottimale
- Le animazioni Framer Motion richiedono `'use client'` — creare componenti client separati per le sezioni animate
- Non mettere `'use client'` sulla page.tsx principale
