---
file: bio_commissions_contact
pages: Bio, Commissioni, Contatti
routes: /bio, /commissioni, /contatti
status: todo
depends_on: [[palette]], [[typography]], [[spacing_layout]]
codex_priority: 3
---

# Pagine Secondarie

---

## Pagina Bio — `/bio`

### Obiettivo
Presentare l'artista con profondità. Costruisce fiducia e connessione emotiva.

### Struttura

```tsx
// app/(site)/bio/page.tsx

// 1. Hero bio: foto grande + nome
<section className="relative h-[60vh] flex items-end pb-12">
  <Image src={artistPortrait} fill className="object-cover object-top" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
  <div className="relative max-w-[1280px] mx-auto px-6 lg:px-20 w-full">
    <h1 className="font-display text-display-lg text-white">{artistName}</h1>
  </div>
</section>

// 2. Bio lunga (Portable Text da Sanity)
<section className="py-24">
  <div className="max-w-[720px] mx-auto px-6">
    <PortableText value={bio} components={portableTextComponents} />
  </div>
</section>

// 3. Timeline (opzionale) — anni chiave, mostre, premi
// Se presente in Sanity come array di { year, event }
<section className="py-12 bg-surface">
  <div className="max-w-[720px] mx-auto px-6">
    <h2 className="font-display text-display-sm text-text-primary mb-12">Percorso</h2>
    {timeline.map(({ year, event }) => (
      <div key={year} className="flex gap-8 py-4 border-b border-border">
        <span className="font-mono text-body-sm text-accent w-12 flex-shrink-0">{year}</span>
        <span className="font-body text-body text-text-secondary">{event}</span>
      </div>
    ))}
  </div>
</section>

// 4. CTA finale
<section className="py-24 text-center">
  <h2 className="font-display text-display-sm text-text-primary">
    Interessato a un'opera?
  </h2>
  <div className="mt-8 flex gap-4 justify-center">
    <a href="/galleria" className="btn-primary">Esplora la galleria</a>
    <a href="/commissioni" className="btn-secondary">Richiedi una commissione</a>
  </div>
</section>
```

### Portable Text components
```typescript
const portableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-body text-body-lg text-text-secondary leading-relaxed mb-6">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="font-display text-display-sm text-text-primary mt-12 mb-4">
        {children}
      </h2>
    ),
  }
}
```

---

## Pagina Commissioni — `/commissioni`

### Obiettivo
Raccogliere richieste di opere su commessa. Il form deve essere semplice e qualificante.

### Struttura

```tsx
// 1. Intro
<section className="pt-32 pb-16">
  <div className="max-w-[720px] mx-auto px-6">
    <h1 className="font-display text-display-md text-text-primary">
      Commissioni private
    </h1>
    <p className="mt-6 font-body text-body-lg text-text-secondary leading-relaxed">
      Ogni commissione è un dialogo. Raccontami la tua idea — il soggetto,
      lo spazio dove verrà esposta, le emozioni che vuoi evocare.
    </p>
  </div>
</section>

// 2. Form commissione
interface CommissionFormData {
  name: string
  email: string
  phone?: string
  subject: string           // es. "Ritratto", "Paesaggio", "Astratto"
  dimensions: string        // testo libero: "circa 80x100 cm"
  budget: string            // fascia: "500-1000€", "1000-3000€", "3000+"
  description: string       // testo libero, max 1000 caratteri
  deadline?: string         // data orientativa
}

// JSX form (NO tag <form> — usare onSubmit su div o gestire con state):
<div className="max-w-[640px] mx-auto px-6 py-16 space-y-6">

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <InputField label="Nome e cognome *" name="name" required />
    <InputField label="Email *" name="email" type="email" required />
  </div>

  <InputField label="Telefono (opzionale)" name="phone" type="tel" />

  <SelectField
    label="Tipo di soggetto *"
    name="subject"
    options={['Ritratto', 'Paesaggio', 'Natura morta', 'Astratto', 'Altro']}
    required
  />

  <InputField label="Dimensioni indicative" name="dimensions" placeholder="es. 80 × 100 cm" />

  <SelectField
    label="Budget orientativo *"
    name="budget"
    options={['500 – 1.000 €', '1.000 – 3.000 €', '3.000 – 6.000 €', 'Oltre 6.000 €']}
    required
  />

  <TextareaField
    label="Descrivi la tua idea *"
    name="description"
    placeholder="Soggetto, contesto, emozioni, riferimenti..."
    rows={6}
    maxLength={1000}
    required
  />

  <InputField label="Data desiderata (se presente)" name="deadline" type="date" />

  <button type="button" onClick={handleSubmit} className="w-full btn-primary py-4">
    Invia richiesta
  </button>

  <p className="font-body text-caption text-text-muted text-center">
    Rispondo entro 2 giorni lavorativi.
    Le commissioni sono realizzate con diritto d'autore riservato all'artista.
  </p>
</div>
```

### API Route per commissioni
```typescript
// app/api/commission/route.ts
// Riceve i dati del form e:
// 1. Invia email all'artista (Resend) con tutti i dettagli
// 2. Invia email di conferma all'utente
// 3. (opzionale) Salva su DB per archivio

export async function POST(req: NextRequest) {
  const data: CommissionFormData = await req.json()
  
  // Validazione base
  if (!data.name || !data.email || !data.description) {
    return NextResponse.json({ error: 'Campi obbligatori mancanti' }, { status: 400 })
  }

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: process.env.ARTIST_EMAIL!,
    subject: `Nuova richiesta commissione — ${data.name}`,
    // template HTML con tutti i dati
  })

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: data.email,
    subject: 'Richiesta ricevuta — ti rispondo presto',
    // template conferma
  })

  return NextResponse.json({ success: true })
}
```

---

## Pagina Contatti — `/contatti`

### Struttura semplice

```tsx
// app/(site)/contatti/page.tsx

<main className="py-32">
  <div className="max-w-[720px] mx-auto px-6">
    <h1 className="font-display text-display-md text-text-primary">Contatti</h1>

    <div className="mt-12 space-y-8">

      {/* Email */}
      <div>
        <p className="font-body text-body-sm text-text-muted uppercase tracking-widest mb-2">Email</p>
        <a
          href="mailto:studio@nomeartista.it"
          className="font-body text-body-lg text-text-primary hover:text-accent transition-colors"
        >
          studio@nomeartista.it
        </a>
      </div>

      {/* Instagram */}
      <div>
        <p className="font-body text-body-sm text-text-muted uppercase tracking-widest mb-2">Instagram</p>
        <a
          href="https://instagram.com/handle"
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-body-lg text-text-primary hover:text-accent transition-colors"
        >
          @handle
        </a>
      </div>

      {/* Location */}
      <div>
        <p className="font-body text-body-sm text-text-muted uppercase tracking-widest mb-2">Studio</p>
        <p className="font-body text-body-lg text-text-primary">Milano, Italia</p>
      </div>
    </div>

    {/* Form contatto rapido (opzionale) */}
    <div className="mt-20 pt-12 border-t border-border">
      <h2 className="font-display text-display-sm text-text-primary mb-8">
        Mandami un messaggio
      </h2>
      {/* Form semplice: nome, email, messaggio */}
    </div>
  </div>
</main>
```

---

## Note per Codex

- Il form commissioni gestisce lo state con `useState` — componente client
- Validazione lato client con `zod` + `react-hook-form` (installare se non presente)
- Gestire stato loading e success/error feedback inline nel form
- I campi devono avere `aria-label` o `htmlFor` corretti per accessibilità
