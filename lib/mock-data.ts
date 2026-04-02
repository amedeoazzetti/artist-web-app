import type { Artwork } from '@/types/artwork';

export const artworks: Artwork[] = [
  {
    id: 'a1',
    slug: 'luce-del-lago',
    title: 'Luce del Lago',
    technique: 'Olio su tela',
    year: 2025,
    price: 1800,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    description: 'Un paesaggio denso di luce e stratificazioni cromatiche.'
  },
  {
    id: 'a2',
    slug: 'materia-e-silenzio',
    title: 'Materia e Silenzio',
    technique: 'Tecnica mista',
    year: 2024,
    price: 2200,
    status: 'reserved',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
    description: 'Texture materiche e segni minimali in dialogo.'
  },
  {
    id: 'a3',
    slug: 'orizzonte-calmo',
    title: 'Orizzonte Calmo',
    technique: 'Acrilico su tela',
    year: 2023,
    price: 1600,
    status: 'sold',
    image: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?auto=format&fit=crop&w=1200&q=80',
    description: 'Composizione equilibrata, con palette tenue e sospesa.'
  }
];
