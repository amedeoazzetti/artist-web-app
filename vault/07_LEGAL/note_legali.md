---
file: note_legali
status: bozza
note: Far revisionare da un avvocato prima del go-live
---

# Note Legali — Obblighi Italia

> ⚠️ Questo file raccoglie i requisiti legali da soddisfare.
> Non sostituisce una consulenza legale. Far revisionare tutto prima del lancio.

---

## Dati obbligatori del venditore (art. 12 D.Lgs. 70/2003)

Il sito deve riportare in modo chiaro (tipicamente nel footer e nelle pagine legali):

- [ ] Nome e cognome o ragione sociale
- [ ] Partita IVA o Codice Fiscale
- [ ] Indirizzo sede legale / studio
- [ ] Email di contatto
- [ ] Numero REA (se impresa)

---

## E-commerce obblighi (D.Lgs. 206/2005 — Codice del Consumo)

### Informazioni precontrattuali (da mostrare PRIMA del pagamento)
- [ ] Caratteristiche del bene (opera, tecnica, dimensioni)
- [ ] Prezzo totale IVA inclusa
- [ ] Costi di spedizione
- [ ] Modalità di pagamento
- [ ] Informativa sul diritto di recesso (o sua esclusione con motivazione)
- [ ] Durata del contratto
- [ ] Informazioni sul venditore

### Diritto di recesso
Per questo progetto si raccomanda di **escludere il recesso** citando:
> "Art. 59, comma 1, lett. c) D.Lgs. 206/2005 — beni confezionati su misura o chiaramente personalizzati, ovvero che per loro natura non possono essere rispediti o rischiano di deteriorarsi o alterarsi rapidamente"

L'esclusione deve essere:
1. Comunicata esplicitamente prima dell'acquisto (pagina termini + checkout)
2. Confermata dall'utente (checkbox "Ho letto e accetto i termini" nel checkout)

> ⚠️ Stripe Checkout non ha checkbox nativi — valutare se aggiungere un passaggio intermedio prima del redirect a Stripe (pagina di riepilogo con checkbox + redirect)

---

## GDPR (Reg. UE 2016/679)

- [ ] Privacy Policy completa e aggiornata
- [ ] Cookie Policy + banner con consenso
- [ ] Registro trattamenti (obbligatorio per attività commerciale)
- [ ] DPA (Data Processing Agreement) con Stripe, Vercel, Sanity, Resend, Neon
- [ ] Politica di conservazione dati documentata
- [ ] Procedura per richieste di esercizio diritti (cancellazione, portabilità, ecc.)

### Cookie banner
- Cookie tecnici necessari: nessun consenso richiesto
- Analytics (se usati): consenso richiesto
- Stripe usa cookie tecnici per il pagamento: necessari, no consenso

---

## IVA e fatturazione

- [ ] Chiarire con commercialista il regime fiscale dell'artista
- [ ] Decidere se emettere fattura per ogni vendita (obbligatorio sopra certi importi o su richiesta)
- [ ] Valutare se applicare IVA ordinaria (22%) o regime agevolato per beni artistici (10%)
- [ ] Conservare documentazione ordini per 10 anni (obbligo fiscale)

---

## ODR — Online Dispute Resolution

Obbligatorio per e-commerce B2C in UE: inserire link alla piattaforma ODR nella homepage e nelle condizioni di vendita:
```
https://ec.europa.eu/consumers/odr
```

---

## Checklist pre-lancio legale

- [ ] Termini di vendita redatti e revisionati da legale
- [ ] Privacy Policy GDPR-compliant
- [ ] Cookie Policy + banner funzionante
- [ ] Dati venditore visibili nel footer
- [ ] Link ODR presente
- [ ] Checkbox accettazione termini nel flow di acquisto
- [ ] DPA firmati con i fornitori principali
- [ ] Consulenza su IVA opere d'arte
