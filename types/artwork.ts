export type ArtworkStatus = 'available' | 'reserved' | 'sold';

export interface Artwork {
  id: string;
  slug: string;
  title: string;
  technique: string;
  year: number;
  price: number;
  status: ArtworkStatus;
  image: string;
  description: string;
}
