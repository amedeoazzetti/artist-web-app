---
file: sanity_schema
status: todo
depends_on: [[business_rules]], [[tech_stack]]
---

# Sanity Schema — CMS

## Collezioni

1. `artwork` — Opera d'arte
2. `artistProfile` — Profilo artista (singleton)
3. `homepageSections` — Sezioni homepage (singleton)
4. `shippingPolicy` — Politica spedizioni (singleton)

---

## Schema: artwork

```typescript
// sanity/schemas/artwork.ts
import { defineField, defineType } from 'sanity'

export const artwork = defineType({
  name: 'artwork',
  title: 'Opera',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug URL',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'status',
      title: 'Stato',
      type: 'string',
      options: {
        list: [
          { title: 'Disponibile', value: 'available' },
          { title: 'Prenotata', value: 'reserved' },
          { title: 'Venduta', value: 'sold' },
        ],
        layout: 'radio'
      },
      initialValue: 'available',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'price',
      title: 'Prezzo (€, IVA inclusa)',
      type: 'number',
      validation: Rule => Rule.required().positive().integer()
    }),
    defineField({
      name: 'images',
      title: 'Immagini',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: Rule => Rule.required().min(1)
    }),
    defineField({
      name: 'technique',
      title: 'Tecnica',
      type: 'string',
      options: {
        list: [
          'Olio su tela',
          'Acrilico su tela',
          'Acquerello su carta',
          'Tecnica mista',
          'Pastello',
          'Scultura',
          'Altro'
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'year',
      title: 'Anno',
      type: 'number',
      validation: Rule => Rule.required().min(1900).max(new Date().getFullYear())
    }),
    defineField({
      name: 'width',
      title: 'Larghezza (cm)',
      type: 'number',
      validation: Rule => Rule.required().positive()
    }),
    defineField({
      name: 'height',
      title: 'Altezza (cm)',
      type: 'number',
      validation: Rule => Rule.required().positive()
    }),
    defineField({
      name: 'depth',
      title: 'Profondità (cm) — solo per sculture',
      type: 'number'
    }),
    defineField({
      name: 'description',
      title: 'Descrizione / Storytelling',
      type: 'array',
      of: [{ type: 'block' }]   // Portable Text
    }),
    defineField({
      name: 'certificate',
      title: 'Certificato di autenticità incluso',
      type: 'boolean',
      initialValue: true
    }),
    defineField({
      name: 'featured',
      title: 'In evidenza in homepage',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title (opzionale)',
      type: 'string',
      description: 'Se vuoto, usa il titolo opera'
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.max(160)
    }),
  ],
  preview: {
    select: {
      title: 'title',
      status: 'status',
      price: 'price',
      media: 'images.0'
    },
    prepare({ title, status, price, media }) {
      const statusEmoji = { available: '🟢', reserved: '🟡', sold: '🔴' }
      return {
        title: `${statusEmoji[status] ?? ''} ${title}`,
        subtitle: `€${price?.toLocaleString('it-IT') ?? '—'}`,
        media
      }
    }
  },
  orderings: [
    { title: 'Anno (recente)', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] },
    { title: 'Prezzo (alto)', name: 'priceDesc', by: [{ field: 'price', direction: 'desc' }] },
  ]
})
```

---

## Schema: artistProfile (singleton)

```typescript
// sanity/schemas/artistProfile.ts

export const artistProfile = defineType({
  name: 'artistProfile',
  title: 'Profilo Artista',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nome', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'tagline', title: 'Tagline (sotto nome in hero)', type: 'string' }),
    defineField({ name: 'heroImage', title: 'Immagine Hero Homepage', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'portrait', title: 'Foto ritratto (sezione bio)', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'statement', title: 'Statement breve (homepage)', type: 'text', rows: 3 }),
    defineField({ name: 'bioExcerpt', title: 'Bio breve (homepage)', type: 'text', rows: 4, description: 'Max 150 parole' }),
    defineField({ name: 'bioFull', title: 'Bio completa (pagina /bio)', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'timeline',
      title: 'Timeline / Percorso',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'year', title: 'Anno', type: 'number' },
          { name: 'event', title: 'Evento', type: 'string' }
        ],
        preview: { select: { title: 'year', subtitle: 'event' } }
      }]
    }),
    defineField({ name: 'instagramUrl', title: 'URL Instagram', type: 'url' }),
    defineField({ name: 'email', title: 'Email contatto', type: 'string' }),
    defineField({ name: 'studioCity', title: 'Città studio', type: 'string' }),
  ]
})
```

---

## Configurazione Sanity (sanity.config.ts)

```typescript
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { artwork } from './schemas/artwork'
import { artistProfile } from './schemas/artistProfile'

export default defineConfig({
  name: 'artist-webapp',
  title: 'Gestione Sito Artista',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenuti')
          .items([
            S.documentTypeListItem('artwork').title('Opere'),
            S.divider(),
            S.listItem()
              .title('Profilo Artista')
              .child(S.document().schemaType('artistProfile').documentId('artistProfile')),
          ])
    }),
    visionTool(),
  ],
  schema: { types: [artwork, artistProfile] },
})
```

---

## Note per Codex

- Lo status dell'opera va aggiornato via Sanity Write Client dal webhook Stripe — non solo su Postgres
- Usare `sanity.config.ts` con singleton per `artistProfile` (un solo documento)
- Le immagini Sanity vanno sempre servite via `urlFor()` da `@sanity/image-url` — mai URL diretti
- Configurare CORS in Sanity dashboard per il dominio di produzione
