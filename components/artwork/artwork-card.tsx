import Link from 'next/link';
import type { Artwork } from '@/types/artwork';
import { StatusBadge } from '@/components/ui/status-badge';

interface ArtworkCardProps {
  artwork: Artwork;
}

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <Link className="group space-y-3" href={`/opere/${artwork.slug}`}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-surface">
        <img alt={artwork.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={artwork.image} />
        {artwork.status !== 'available' ? (
          <div className="absolute left-3 top-3">
            <StatusBadge status={artwork.status} />
          </div>
        ) : null}
      </div>
      <div>
        <h3 className="font-display text-2xl text-text-primary">{artwork.title}</h3>
        <p className="text-sm text-text-muted">
          {artwork.technique} · {artwork.year}
        </p>
        {artwork.status === 'available' ? (
          <p className="mt-2 font-mono text-xl text-text-primary">€ {artwork.price.toLocaleString('it-IT')}</p>
        ) : null}
      </div>
    </Link>
  );
}
