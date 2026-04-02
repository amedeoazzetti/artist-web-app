---
file: motion
status: definitivo
depends_on: [[palette]]
---

# Motion & Animazioni

> Il sito è pensato per fascia alta: le animazioni devono essere sottili,
> mai distrattive. La regola d'oro è: se noti l'animazione, è troppo.

---

## Principi

1. **Sottile e funzionale** — le transizioni aiutano la lettura, non la intrattenere
2. **Veloce** — durate brevi (150–400ms), mai oltre 600ms per UI
3. **Easing naturale** — preferire `ease-out` per elementi che entrano, `ease-in` per uscite
4. **Respect reduced motion** — sempre wrappare in `@media (prefers-reduced-motion: no-preference)`

---

## Durate standard

| Token | Durata | Uso |
|---|---|---|
| `duration-fast` | 150ms | Hover stati, focus |
| `duration-base` | 250ms | Transizioni UI standard |
| `duration-slow` | 400ms | Apertura modal, slide-in |
| `duration-page` | 600ms | Transizioni di pagina |

---

## Transizioni componenti

### Hover immagine (card galleria)
```css
.artwork-card img {
  transition: transform 400ms ease-out, filter 400ms ease-out;
}
.artwork-card:hover img {
  transform: scale(1.03);
  filter: brightness(1.05);
}
```

### Hover bottone CTA
```css
.btn-primary {
  transition: background-color 150ms ease-out, 
              color 150ms ease-out,
              transform 150ms ease-out;
}
.btn-primary:hover {
  transform: translateY(-1px);
}
.btn-primary:active {
  transform: translateY(0);
}
```

### Fade-in elementi (scroll reveal)
```tsx
// Usare Framer Motion solo per animazioni scroll
// Installare: npm install framer-motion

'use client'
import { motion } from 'framer-motion'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' }
}

// Uso
<motion.div {...fadeInUp}>
  <ArtworkCard ... />
</motion.div>
```

### Stagger griglia galleria
```tsx
const containerVariants = {
  animate: { transition: { staggerChildren: 0.08 } }
}

const itemVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
}
```

### Transizione pagina (Next.js App Router)
```tsx
// In layout.tsx — wrapper per transizioni tra pagine
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.4 }}
>
  {children}
</motion.div>
```

---

## Loading states

### Skeleton card galleria
```tsx
// Usare Tailwind animate-pulse
<div className="aspect-[3/4] bg-surface animate-pulse rounded-sm" />
<div className="mt-3 h-5 bg-surface animate-pulse rounded-sm w-3/4" />
<div className="mt-2 h-4 bg-surface animate-pulse rounded-sm w-1/3" />
```

---

## Cose da NON fare

- ❌ Nessun parallax pesante sulle immagini
- ❌ Nessuna animazione di testo lettera per lettera (troppo lento)
- ❌ Nessun bounce o elastic easing
- ❌ Nessun autoplay video in background
- ❌ Nessun loader spinner visibile — usare skeleton

---

## Note per Codex

- Installa `framer-motion` solo se serve scroll-reveal o stagger — non per semplici hover
- I semplici hover e transizioni UI vanno fatti con classi Tailwind `transition-*`
- Wrap tutte le animazioni non-hover in `AnimatePresence` se devono gestire mount/unmount
