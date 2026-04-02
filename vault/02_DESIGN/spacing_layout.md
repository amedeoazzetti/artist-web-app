---
file: spacing_layout
status: definitivo
depends_on: [[typography]]
---

# Spacing & Layout

---

## Grid principale

```
Max width contenuto:  1280px  (mx-auto)
Max width testo:       720px  (per bio, descrizioni lunghe)
Padding laterale:       24px mobile / 48px tablet / 80px desktop
Gutter griglia:         24px mobile / 32px desktop
```

---

## Breakpoint

| Nome | Valore | Tailwind |
|---|---|---|
| mobile | < 768px | default |
| tablet | 768px | `md:` |
| desktop | 1024px | `lg:` |
| wide | 1280px | `xl:` |

---

## Griglia galleria

```
Mobile:   1 colonna
Tablet:   2 colonne
Desktop:  3 colonne
Wide:     4 colonne (solo se molte opere)
Gap:      24px (mobile) / 32px (desktop)
```

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
```

---

## Spacing tokens (verticale)

| Token Tailwind | px | Uso tipico |
|---|---|---|
| `space-y-2` | 8px | Spacing interno componenti |
| `space-y-4` | 16px | Tra label e campo |
| `space-y-6` | 24px | Tra sezioni componente |
| `space-y-8` | 32px | Tra blocchi di contenuto |
| `space-y-12` | 48px | Sezioni interne pagina |
| `space-y-16` | 64px | Sezioni pagina desktop |
| `space-y-24` | 96px | Sezioni pagina hero |
| `space-y-32` | 128px | Respiro massimo hero |

---

## Layout pattern — Sezione standard

```tsx
<section className="py-16 lg:py-24">
  <div className="max-w-[1280px] mx-auto px-6 lg:px-20">
    {/* contenuto */}
  </div>
</section>
```

## Layout pattern — Testo lungo (bio, policy)

```tsx
<div className="max-w-[720px] mx-auto px-6">
  {/* testo */}
</div>
```

## Layout pattern — Hero fullwidth

```tsx
<section className="relative min-h-screen flex items-end pb-16 lg:pb-24">
  {/* immagine come background assoluto */}
  <div className="relative max-w-[1280px] mx-auto px-6 lg:px-20 w-full">
    {/* contenuto hero */}
  </div>
</section>
```

---

## Aspect ratio immagini

| Contesto | Ratio | Nota |
|---|---|---|
| Card galleria | `aspect-[3/4]` | Portrait, tipico per opere |
| Hero scheda opera | `aspect-[4/3]` o `aspect-square` | A seconda dell'opera |
| Thumbnail | `aspect-square` | Griglia uniforme |
| Hero homepage | fullscreen / `min-h-screen` | Immagine di sfondo |

---

## Note per Codex

- Usa sempre il pattern `max-w-[1280px] mx-auto px-6 lg:px-20` per i wrapper di pagina
- Non usare `container` di Tailwind — usa il pattern custom sopra
- Le sezioni hero hanno sempre `py-24 lg:py-32`
- Nessun elemento UI deve toccare i bordi laterali del viewport — padding minimo `px-6`
