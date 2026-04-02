import { ArtworkCard } from '@/components/artwork/artwork-card';
import { artworks } from '@/lib/mock-data';

export default function GalleryPage() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-20">
        <h1 className="font-display text-5xl text-text-primary">Galleria</h1>
        <p className="mt-2 text-text-secondary">{artworks.length} opere</p>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {artworks.map((artwork) => (
            <ArtworkCard artwork={artwork} key={artwork.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
