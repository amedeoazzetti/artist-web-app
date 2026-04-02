---
file: nav_footer
components: Nav, Footer
paths: components/layout/Nav.tsx, components/layout/Footer.tsx
status: todo
depends_on: [[palette]], [[typography]], [[spacing_layout]]
---

# Componenti Layout: Nav & Footer

---

## Nav

### Comportamento
- Desktop: link orizzontali a destra, logo/nome a sinistra
- Mobile: hamburger menu con overlay
- Su homepage hero: trasparente con testo bianco
- Dopo scroll (> 80px): sfondo `--color-background` con border-bottom, testo normale
- Sticky in cima (`position: sticky; top: 0; z-index: 50`)

### Props
```typescript
interface NavProps {
  transparent?: boolean   // true solo su homepage hero
}
```

### JSX
```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/galleria', label: 'Galleria' },
  { href: '/commissioni', label: 'Commissioni' },
  { href: '/bio', label: 'L\'artista' },
  { href: '/contatti', label: 'Contatti' },
]

export function Nav({ transparent = false }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (!transparent) return
    const handler = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [transparent])

  const isTransparent = transparent && !scrolled

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isTransparent
          ? "bg-transparent border-transparent"
          : "bg-background border-b border-border"
      )}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20 h-16 flex items-center justify-between">

        {/* Logo / Nome artista */}
        <Link
          href="/"
          className={cn(
            "font-display text-heading transition-colors",
            isTransparent ? "text-white" : "text-text-primary"
          )}
        >
          Nome Artista
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "font-body text-body-sm transition-colors duration-150",
                isTransparent
                  ? "text-white/80 hover:text-white"
                  : "text-text-secondary hover:text-text-primary",
                pathname === href && !isTransparent && "text-text-primary underline underline-offset-4"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <MenuIcon
            className={cn("w-5 h-5", isTransparent ? "text-white" : "text-text-primary")}
            open={menuOpen}
          />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="md:hidden absolute inset-x-0 top-16 bg-background border-b border-border py-6 px-6">
          <nav className="flex flex-col gap-5">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-body text-body text-text-primary"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
```

---

## Footer

### Struttura
```tsx
// components/layout/Footer.tsx

export function Footer() {
  return (
    <footer className="border-t border-border py-12 mt-24">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-20">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

          {/* Col 1: Brand */}
          <div>
            <p className="font-display text-heading text-text-primary">Nome Artista</p>
            <p className="mt-2 font-body text-body-sm text-text-muted">
              Pittura originale — Milano, Italia
            </p>
          </div>

          {/* Col 2: Link */}
          <div>
            <p className="font-body text-body-sm text-text-muted uppercase tracking-widest mb-4">
              Naviga
            </p>
            <nav className="space-y-2">
              {[
                { href: '/galleria', label: 'Galleria' },
                { href: '/commissioni', label: 'Commissioni' },
                { href: '/bio', label: "L'artista" },
                { href: '/contatti', label: 'Contatti' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="block font-body text-body-sm text-text-secondary hover:text-text-primary transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3: Legal + Social */}
          <div>
            <p className="font-body text-body-sm text-text-muted uppercase tracking-widest mb-4">
              Legale
            </p>
            <nav className="space-y-2">
              {[
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/cookie', label: 'Cookie Policy' },
                { href: '/termini', label: 'Termini di vendita' },
                { href: '/spedizioni', label: 'Spedizioni' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="block font-body text-body-sm text-text-secondary hover:text-text-primary transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row gap-3 justify-between">
          <p className="font-body text-caption text-text-muted">
            © {new Date().getFullYear()} Nome Artista — P.IVA [numero]
          </p>
          <p className="font-body text-caption text-text-muted">
            Pagamenti sicuri via Stripe · Spedizioni assicurate in Italia
          </p>
        </div>
      </div>
    </footer>
  )
}
```

---

## Note per Codex

- `Nav` è `'use client'` per scroll e menu mobile
- `Footer` può essere Server Component (nessuna interattività)
- Il layout `app/(site)/layout.tsx` deve includere `<Nav>` e `<Footer>` wrappati attorno a `{children}`
- Sulla homepage, passare `transparent={true}` alla Nav — configurabile tramite `usePathname()`
