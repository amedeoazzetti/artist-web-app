---
file: log
last_updated: 2025-01
---

# Progress Log

> Aggiorna questo file dopo ogni sessione di lavoro.
> Formato: `## YYYY-MM-DD — Descrizione`

---

## Legenda stati

| Emoji | Significato |
|---|---|
| ✅ | Completato e testato |
| 🚧 | In lavorazione |
| 🔴 | Bloccato / problema aperto |
| 💡 | Decisione presa / nota importante |
| ❓ | Da chiarire con artista o cliente |

---

## Backlog / Roadmap

### Fase 1 — MVP
- [ ] Setup progetto Next.js + Tailwind + TypeScript
- [ ] Configurazione Sanity + schema artwork + artistProfile
- [ ] Setup Prisma + migrations + connessione Neon
- [ ] Design system: CSS variables + font + tailwind.config
- [ ] Componenti base: ArtworkCard, BuyButton, Nav, Footer, StatusBadge
- [ ] Pagina Home
- [ ] Pagina Galleria con filtri
- [ ] Scheda Opera
- [ ] API checkout + webhook Stripe
- [ ] Pagine ordine (successo / annullato)
- [ ] Cron job release-reservations
- [ ] Email transazionali (Resend)
- [ ] Pagine bio, commissioni, contatti
- [ ] Pagine legali (da far revisionare)
- [ ] SEO: metadata, sitemap, robots, schema.org
- [ ] Deploy Vercel + Neon
- [ ] Test end-to-end checkout con carta test Stripe
- [ ] Cookie banner

### Fase 2 — Post MVP
- [ ] Analytics (Plausible — privacy-first)
- [ ] Newsletter (Resend audience o Mailchimp)
- [ ] Pannello admin ordini (semplice, protetto da Clerk)
- [ ] Notifica spedizione manuale dall'admin
- [ ] Versione inglese (i18n)
- [ ] Ottimizzazione immagini avanzata (AVIF)

---

## Log sessioni

<!-- Inserisci qui le note di ogni sessione -->

### 2025-01-XX — Setup iniziale vault
- 💡 Vault Obsidian creato con struttura completa
- 💡 Stack definitivo: Next.js 15 + Sanity + Stripe + Prisma + Neon + Vercel
- 💡 Decisione: recesso escluso per opere uniche (art. 59 D.Lgs. 206/2005)
- 💡 Decisione: spedizione fissa 25€ assicurata solo Italia
- ❓ Validare palette colori con artista
- ❓ Confermare font (Cormorant Garamond + DM Sans) con artista
- ❓ Raccogliere email artista, P.IVA, indirizzo studio per pagine legali
- ❓ Definire fascia prezzi reale opere
- ❓ Decidere se lo studio Sanity è embedded (`/studio`) o separato

---

## Decisioni architetturali

| Data | Decisione | Motivazione |
|---|---|---|
| 2025-01 | Stripe Checkout hosted (non Elements) | Meno codice, PCI compliance gestita da Stripe, più veloce da implementare |
| 2025-01 | Nessun account utente per acquirenti | Riduce friction checkout, opere uniche non richiedono storico ordini |
| 2025-01 | Sanity + Prisma (doppio storage status) | Sanity per contenuti editoriali, Prisma per lock transazionali e ordini |
| 2025-01 | Plausible per analytics (fase 2) | Privacy-first, no consenso cookie per analytics aggregati |

---

## Contatti progetto

| Ruolo | Nome | Email |
|---|---|---|
| Artista / Cliente | [da inserire] | [da inserire] |
| Developer | [tuo nome] | [tua email] |
| Legale (revisione termini) | [da trovare] | — |
