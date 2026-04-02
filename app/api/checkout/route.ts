import { NextResponse } from 'next/server';
import { artworks } from '@/lib/mock-data';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { artworkId?: string };
    const artwork = artworks.find((entry) => entry.id === body.artworkId);

    if (!artwork) {
      return NextResponse.json({ message: 'Opera non trovata.' }, { status: 404 });
    }

    if (artwork.status !== 'available') {
      return NextResponse.json({ message: 'Opera non più disponibile.' }, { status: 409 });
    }

    return NextResponse.json({ url: `/ordine/successo?artwork=${artwork.slug}` });
  } catch {
    return NextResponse.json({ message: 'Richiesta non valida.' }, { status: 400 });
  }
}
