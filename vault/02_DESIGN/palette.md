---
file: palette
status: da_validare_con_artista
depends_on: [[brief]]
---

# Palette Colori

> ⚠️ Validare con l'artista prima di implementare.
> Questa è una palette di partenza per fascia medio/alta italiana.

---

## Palette Base

| Nome Token | HEX | HSL | Uso |
|---|---|---|---|
| `--color-background` | `#FAFAF8` | `60 11% 98%` | Sfondo principale |
| `--color-surface` | `#F4F3EF` | `50 13% 95%` | Card, sezioni alternate |
| `--color-border` | `#E2E0D8` | `50 13% 88%` | Bordi sottili |
| `--color-text-primary` | `#1A1917` | `30 6% 10%` | Titoli, testo principale |
| `--color-text-secondary` | `#6B6860` | `36 5% 40%` | Testo secondario, meta |
| `--color-text-muted` | `#9C9A93` | `40 4% 59%` | Placeholder, caption |
| `--color-accent` | `#8B6914` | `38 73% 31%` | CTA, link, evidenza (oro scuro) |
| `--color-accent-light` | `#F5E6C3` | `40 72% 86%` | Hover accent, badge |
| `--color-error` | `#9B1D1D` | `0 69% 36%` | Errori, sold badge |
| `--color-success` | `#1D5C2E` | `138 51% 24%` | Conferma ordine |

## Semantici / Stati Opera

| Nome | Colore | Uso |
|---|---|---|
| `--color-badge-available` | `#1D5C2E` | Badge "Disponibile" |
| `--color-badge-reserved` | `#8B4A14` | Badge "Prenotata" |
| `--color-badge-sold` | `#4A4A48` | Badge "Venduta" |

---

## Implementazione CSS (globals.css)

```css
:root {
  --color-background: #FAFAF8;
  --color-surface: #F4F3EF;
  --color-border: #E2E0D8;
  --color-text-primary: #1A1917;
  --color-text-secondary: #6B6860;
  --color-text-muted: #9C9A93;
  --color-accent: #8B6914;
  --color-accent-light: #F5E6C3;
  --color-error: #9B1D1D;
  --color-success: #1D5C2E;
}
```

## Implementazione Tailwind (tailwind.config.ts)

```typescript
theme: {
  extend: {
    colors: {
      background: 'var(--color-background)',
      surface: 'var(--color-surface)',
      border: 'var(--color-border)',
      accent: {
        DEFAULT: 'var(--color-accent)',
        light: 'var(--color-accent-light)',
      },
      text: {
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        muted: 'var(--color-text-muted)',
      }
    }
  }
}
```

---

## Regole d'uso

1. **Mai** usare nero puro `#000000` — usare `--color-text-primary`
2. **Mai** usare bianco puro `#FFFFFF` — usare `--color-background`
3. L'accent oro va usato con parsimonia: solo CTA primarie, link attivi, dettagli prezzo
4. Il resto dell'interfaccia è neutro — le opere devono essere il focus visivo
5. Nessun colore vivace o saturato nell'UI — l'arte porta il colore

---

## Note per Codex

Quando generi componenti, usa **esclusivamente** le variabili CSS o le classi Tailwind mappate sopra.
Non usare classi come `bg-white`, `text-black`, `border-gray-200` — usa i token del design system.
