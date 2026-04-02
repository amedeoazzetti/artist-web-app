import { ArtworkCard } from '@/components/artwork/artwork-card';
import { artworks } from '@/lib/mock-data';

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[70vh] border-b border-border py-16 lg:py-24">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-20">
          <p className="text-sm text-text-secondary">Collezione originale</p>
          <h1 className="mt-3 max-w-3xl font-display text-6xl text-text-primary">Arte contemporanea italiana, pezzi unici.</h1>
          <p className="mt-6 max-w-[720px] text-text-secondary">
            Opere originali selezionate, checkout sicuro con Stripe e spedizione assicurata in tutta Italia.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-20">
          <h2 className="mb-8 font-display text-4xl">Opere in evidenza</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {artworks.map((artwork) => (
              <ArtworkCard artwork={artwork} key={artwork.id} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
