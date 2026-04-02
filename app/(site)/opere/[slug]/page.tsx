import { notFound } from 'next/navigation';
import { BuyButton } from '@/components/artwork/buy-button';
import { artworks } from '@/lib/mock-data';

interface ArtworkDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArtworkDetailPage({ params }: ArtworkDetailPageProps) {
  const { slug } = await params;
  const artwork = artworks.find((entry) => entry.slug === slug);

  if (!artwork) {
    notFound();
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-6 lg:grid-cols-2 lg:px-20">
        <div className="aspect-[4/3] overflow-hidden rounded-lg bg-surface">
          <img alt={artwork.title} className="h-full w-full object-cover" src={artwork.image} />
        </div>
        <div className="space-y-6">
          <h1 className="font-display text-5xl">{artwork.title}</h1>
          <p className="text-text-secondary">{artwork.technique} · {artwork.year}</p>
          <p className="font-mono text-2xl">€ {artwork.price.toLocaleString('it-IT')}</p>
          <p className="max-w-[720px] text-text-secondary">{artwork.description}</p>
          <BuyButton artwork={artwork} />
        </div>
      </div>
    </section>
  );
}
