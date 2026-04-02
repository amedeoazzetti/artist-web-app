# 🎨 Artist Web App — Vault Index

> Vault principale del progetto. Ogni file è un prompt autonomo per Codex.
> Aggiorna sempre `status` e `08_PROGRESS/log.md` dopo ogni sessione.

---

## 🗺 Mappa del Vault

### 01 — Progetto
- [[01_PROJECT/brief]] — Chi è l'artista, obiettivi, pubblico target
- [[01_PROJECT/tech_stack]] — Stack definitivo, versioni, configurazione
- [[01_PROJECT/business_rules]] — Regole di business critiche (anti-doppia vendita, riserva, legale)

### 02 — Design System
- [[02_DESIGN/palette]] — Colori ufficiali con HEX, HSL, variabili CSS
- [[02_DESIGN/typography]] — Font, scale tipografica, regole d'uso
- [[02_DESIGN/spacing_layout]] — Grid, spacing tokens, breakpoint
- [[02_DESIGN/motion]] — Transizioni, animazioni, principi UX

### 03 — Pagine
- [[03_PAGES/home]] — Hero + opere in evidenza
- [[03_PAGES/gallery]] — Shop/Galleria con filtri
- [[03_PAGES/artwork_detail]] — Scheda opera singola
- [[03_PAGES/checkout]] — Redirect Stripe + stato ordine
- [[03_PAGES/bio]] — Biografia artista
- [[03_PAGES/commissions]] — Commissioni personalizzate
- [[03_PAGES/contact]] — Contatti
- [[03_PAGES/legal]] — Privacy, cookie, termini, spedizioni, recesso

### 04 — Prompt Master
- [[04_PROMPTS/codex_system]] — System prompt da incollare ad ogni sessione Codex
- [[04_PROMPTS/session_template]] — Template sessione di lavoro

### 05 — Componenti
- [[05_COMPONENTS/artwork_card]] — Card opera (griglia galleria)
- [[05_COMPONENTS/artwork_hero]] — Hero scheda opera
- [[05_COMPONENTS/buy_button]] — CTA acquisto con logica stato
- [[05_COMPONENTS/image_zoom]] — Viewer immagine HD
- [[05_COMPONENTS/nav]] — Navigazione principale
- [[05_COMPONENTS/footer]] — Footer
- [[05_COMPONENTS/trust_badges]] — Badge fiducia

### 06 — Backend
- [[06_BACKEND/sanity_schema]] — Schema CMS Sanity completo
- [[06_BACKEND/prisma_schema]] — Schema DB ordini PostgreSQL
- [[06_BACKEND/stripe_flow]] — Flusso Stripe Checkout + webhook
- [[06_BACKEND/api_routes]] — Route API Next.js

### 07 — Legale
- [[07_LEGAL/note_legali]] — Obblighi legali Italia, recesso, IVA

### 08 — Progress
- [[08_PROGRESS/log]] — Changelog e decisioni

---

## 📊 Stato Generale

| Area | Status |
|---|---|
| Design System | 🟡 da validare con artista |
| CMS Schema | 🔴 todo |
| Pagine | 🔴 todo |
| Backend | 🔴 todo |
| Deploy | 🔴 todo |

---

## ⚡ Quick Start per Codex

1. Leggi sempre [[04_PROMPTS/codex_system]] come primo messaggio
2. Allega il file della feature su cui lavori
3. Allega i `depends_on` dichiarati nel frontmatter
4. Non inventare colori, font o componenti — sono tutti definiti nel vault
