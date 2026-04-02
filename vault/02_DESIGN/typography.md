---
file: typography
status: da_validare_con_artista
depends_on: [[palette]]
---

# Tipografia

---

## Font scelti

| Ruolo | Font | Fonte | Carattere |
|---|---|---|---|
| Display / Titoli | `Cormorant Garamond` | Google Fonts | Serif elegante, alta-x ridotta, molto letterario |
| Body / UI | `DM Sans` | Google Fonts | Sans-serif moderna, leggibile, neutrale |
| Prezzi / Numeri | `DM Mono` | Google Fonts | Monospaced per prezzi e codici ordine |

### Import (layout.tsx)

```typescript
import { Cormorant_Garamond, DM_Sans, DM_Mono } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
})
```

---

## Scala tipografica

| Token | Font | Size | Weight | Line Height | Uso |
|---|---|---|---|---|---|
| `text-display-xl` | Display | 72px / 4.5rem | 300 | 1.0 | Hero principale |
| `text-display-lg` | Display | 56px / 3.5rem | 300 | 1.1 | Titoli sezione hero |
| `text-display-md` | Display | 40px / 2.5rem | 400 | 1.2 | Titoli pagina |
| `text-display-sm` | Display | 28px / 1.75rem | 400 | 1.3 | Titolo opera (scheda) |
| `text-heading` | Body | 20px / 1.25rem | 500 | 1.4 | Sottotitoli UI |
| `text-body-lg` | Body | 18px / 1.125rem | 400 | 1.7 | Descrizioni lunghe |
| `text-body` | Body | 16px / 1rem | 400 | 1.6 | Testo standard |
| `text-body-sm` | Body | 14px / 0.875rem | 400 | 1.5 | Meta, caption, label |
| `text-caption` | Body | 12px / 0.75rem | 400 | 1.4 | Note legali, fine print |
| `text-price` | Mono | 24px / 1.5rem | 400 | 1.0 | Prezzi opere |
| `text-price-sm` | Mono | 18px / 1.125rem | 400 | 1.0 | Prezzi secondari |

---

## Implementazione Tailwind

```typescript
// tailwind.config.ts
fontSize: {
  'display-xl': ['4.5rem', { lineHeight: '1.0', fontWeight: '300' }],
  'display-lg': ['3.5rem', { lineHeight: '1.1', fontWeight: '300' }],
  'display-md': ['2.5rem', { lineHeight: '1.2', fontWeight: '400' }],
  'display-sm': ['1.75rem', { lineHeight: '1.3', fontWeight: '400' }],
  'heading':    ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
  'body-lg':    ['1.125rem',{ lineHeight: '1.7' }],
  'body':       ['1rem',    { lineHeight: '1.6' }],
  'body-sm':    ['0.875rem',{ lineHeight: '1.5' }],
  'caption':    ['0.75rem', { lineHeight: '1.4' }],
  'price':      ['1.5rem',  { lineHeight: '1.0', fontFamily: 'var(--font-mono)' }],
},
fontFamily: {
  display: ['var(--font-display)', 'Georgia', 'serif'],
  body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
  mono:    ['var(--font-mono)', 'monospace'],
},
```

---

## Regole d'uso

1. **Titoli opere** → sempre `font-display` (Cormorant Garamond)
2. **Testo narrativo / bio** → `font-display` per atmosfera, `font-body` per leggibilità lunga
3. **UI elements** (nav, bottoni, label, form) → sempre `font-body`
4. **Prezzi** → sempre `font-mono text-price`
5. **Tracking lettere:** titoli display usano `tracking-tight` o `tracking-normal`, mai `tracking-wide`
6. **Mai** usare bold su `font-display` per titoli grandi — il `font-weight: 300` è parte dell'eleganza

---

## Note per Codex

- Applica `font-display` ai tag `h1`, `h2`, `h3` relativi a opere e sezioni hero
- Applica `font-body` a tutti gli elementi UI, form, navigazione
- I prezzi vanno sempre renderizzati come `<span className="font-mono text-price text-text-primary">`
- Non usare Tailwind default `font-serif` o `font-sans` — usa sempre i token custom
