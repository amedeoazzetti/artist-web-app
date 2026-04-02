'use client';

import { useState } from 'react';
import type { Artwork } from '@/types/artwork';

interface BuyButtonProps {
  artwork: Artwork;
}

export function BuyButton({ artwork }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (artwork.status === 'sold') {
    return <p className="rounded border border-border bg-surface p-4 text-text-secondary">Opera venduta</p>;
  }

  if (artwork.status === 'reserved') {
    return <p className="rounded border border-border bg-surface p-4 text-text-secondary">Prenotata — disponibile a breve</p>;
  }

  const handleCheckout = async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artworkId: artwork.id })
      });
      const body = (await response.json()) as { url?: string; message?: string };
      if (!response.ok) {
        setError(body.message ?? 'Errore durante il checkout.');
        return;
      }
      if (body.url) {
        window.location.href = body.url;
      }
    } catch {
      setError('Errore di rete. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        className="rounded bg-accent px-6 py-3 text-sm text-background disabled:opacity-60"
        disabled={loading}
        onClick={() => void handleCheckout()}
        type="button"
      >
        {loading ? 'Preparazione acquisto...' : `Acquista ora — € ${artwork.price.toLocaleString('it-IT')}`}
      </button>
      {error ? <p className="text-sm text-error">{error}</p> : null}
    </div>
  );
}
