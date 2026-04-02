---
file: session_template
type: template
usage: Copia e compila per ogni nuova sessione di lavoro con Codex
---

# Template Sessione Codex

## Come usare questo template

1. Copia il blocco "Messaggio 1" e incollalo come primo messaggio a Codex
2. Allega i file `.md` indicati in `FILE DA ALLEGARE`
3. Copia il blocco "Messaggio 2" come secondo messaggio con la richiesta specifica

---

## Messaggio 1 — System Context

```
[INCOLLA QUI IL CONTENUTO DI 04_PROMPTS/codex_system.md]
```

---

## Messaggio 2 — Task specifico

```
## Task di questa sessione

Feature: [nome della feature, es. "ArtworkCard component"]
File di riferimento: [nome del file .md allegato, es. "05_COMPONENTS/artwork_card.md"]
Dipendenze allegate: [lista dei file depends_on allegati]

## Obiettivo
[Descrivi cosa vuoi ottenere in questa sessione — max 3 righe]

## Output atteso
- [ ] File/i da creare: [percorso]
- [ ] File/i da modificare: [percorso]
- [ ] Funzionalità implementate: [lista]

## Vincoli specifici
[Eventuali vincoli aggiuntivi non coperti dal system prompt]

## Domande / punti aperti
[Dubbi da chiarire prima di iniziare a scrivere codice]
```

---

## Checklist fine sessione

Dopo ogni sessione con Codex:
- [ ] Il codice generato compila senza errori TypeScript
- [ ] Il design usa solo i token del design system (no classi Tailwind default per colori)
- [ ] I componenti client hanno `'use client'` in cima
- [ ] Le Server Components non hanno hook React
- [ ] Aggiornato `status` nel file `.md` della feature
- [ ] Aggiornato `08_PROGRESS/log.md` con cosa è stato fatto
- [ ] Testato su mobile (responsive)

---

## Esempi di sessioni tipiche

### Sessione: creare ArtworkCard
```
Feature: ArtworkCard component
File di riferimento: 05_COMPONENTS/artwork_card.md
Dipendenze allegate: 02_DESIGN/palette.md, 02_DESIGN/typography.md, 02_DESIGN/motion.md

Obiettivo: Creare il componente card opera da usare nella galleria e nella home.
Output atteso:
- components/artwork/ArtworkCard.tsx
- types/artwork.ts (se non esiste)
```

### Sessione: implementare checkout flow
```
Feature: Checkout Stripe
File di riferimento: 03_PAGES/checkout.md
Dipendenze allegate: 01_PROJECT/business_rules.md, 06_BACKEND/stripe_flow.md

Obiettivo: Implementare /api/checkout e /api/webhook/stripe completi.
Output atteso:
- app/api/checkout/route.ts
- app/api/webhook/stripe/route.ts
```
