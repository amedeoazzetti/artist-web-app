---
file: buy_button
component: BuyButton
path: components/artwork/BuyButton.tsx
status: todo
depends_on: [[palette]], [[typography]], [[business_rules]], [[checkout]]
---

# Componente: BuyButton

## Uso
CTA di acquisto sulla scheda opera. Gestisce tutti gli stati possibili dell'opera e chiama `/api/checkout`.

---

## Props

```typescript
interface BuyButtonProps {
  artwork: {
    id: string        // Sanity _id
    title: string
    price: number
    status: 'available' | 'reserved' | 'sold'
  }
}
```

---

## Stati del bottone

| Status opera | Aspetto | Comportamento |
|---|---|---|
| `available` | Bottone primario attivo | Chiama checkout, redirect Stripe |
| `reserved` | Bottone disabilitato, testo "Prenotata" | Non cliccabile |
| `sold` | Bottone ghost, testo "Venduta" | Non cliccabile |
| Loading | Spinner + "Preparazione..." | Non cliccabile |
| Error 409 | Alert "Opera non più disponibile" | Suggerisce reload |
| Error 500 | Alert "Errore, riprova" | Cliccabile di nuovo |

---

## JSX completo

```tsx
'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type ButtonState = 'idle' | 'loading' | 'error_unavailable' | 'error_generic'

export function BuyButton({ artwork }: BuyButtonProps) {
  const [state, setState] = useState<ButtonState>('idle')
  const { id, title, price, status } = artwork

  const handleBuy = async () => {
    if (state === 'loading') return
    setState('loading')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artworkId: id }),
      })

      if (res.status === 409) {
        setState('error_unavailable')
        return
      }

      if (!res.ok) {
        setState('error_generic')
        return
      }

      const { url } = await res.json()
      window.location.href = url  // redirect a Stripe Checkout

    } catch {
      setState('error_generic')
    }
  }

  // Opera non disponibile
  if (status === 'sold') {
    return (
      <div className="w-full py-4 border border-border text-center">
        <span className="font-body text-body text-text-muted">Opera venduta</span>
      </div>
    )
  }

  if (status === 'reserved') {
    return (
      <div className="w-full py-4 border border-border text-center bg-surface">
        <span className="font-body text-body text-text-secondary">
          Prenotata — disponibile a breve
        </span>
      </div>
    )
  }

  // Errore: opera non più disponibile (race condition)
  if (state === 'error_unavailable') {
    return (
      <div className="space-y-3">
        <div className="w-full py-4 bg-[var(--color-accent-light)] border border-[var(--color-accent)] text-center">
          <span className="font-body text-body text-text-primary">
            Quest'opera è appena stata prenotata da un altro acquirente.
          </span>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="w-full py-3 font-body text-body-sm text-accent underline"
        >
          Aggiorna la pagina
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleBuy}
        disabled={state === 'loading'}
        className={cn(
          "w-full py-4 font-body text-body font-medium transition-all duration-150",
          "bg-text-primary text-background",
          "hover:bg-accent disabled:opacity-60 disabled:cursor-not-allowed",
          state === 'loading' && "opacity-60"
        )}
      >
        {state === 'loading' ? (
          <span className="flex items-center justify-center gap-2">
            <SpinnerIcon className="w-4 h-4 animate-spin" />
            Preparazione acquisto...
          </span>
        ) : (
          `Acquista — €${price.toLocaleString('it-IT')}`
        )}
      </button>

      {state === 'error_generic' && (
        <p className="font-body text-body-sm text-[var(--color-error)] text-center">
          Si è verificato un errore. Riprova tra qualche secondo.
        </p>
      )}

      <p className="font-body text-caption text-text-muted text-center">
        Verrai reindirizzato al pagamento sicuro Stripe
      </p>
    </div>
  )
}
```

---

## SpinnerIcon (inline)

```tsx
function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  )
}
```

---

## Note per Codex

- Componente `'use client'` obbligatorio (usa `useState`)
- `window.location.href = url` è intenzionale per il redirect Stripe — non usare `router.push`
- Non gestire lo stato `status` dell'opera localmente dopo l'acquisto — la pagina si ricarica su successo/annullamento
- Il messaggio di errore 409 è UX critica — l'utente deve capire subito che l'opera è andata
