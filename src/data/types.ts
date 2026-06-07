export type Category = 'restaurants' | 'nightlife' | 'bars' | 'cafes' | 'attractions';

// Shape returned by the external webhook — fields may come in multiple naming styles
export interface NearbyVenue {
  name: string;
  address?: string;
  formatted_address?: string;
  vicinity?: string;
  rating?: number;
  isOpen?: boolean;
  open_now?: boolean;
  opening_hours?: { open_now?: boolean };
  priceLevel?: number;
  price_level?: number;
  lat?: number;
  lng?: number;
  geometry?: { location?: { lat?: number; lng?: number } };
}

export interface Venue {
  id: string;
  name: string;
  category: Category;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  priceLevel: 1 | 2 | 3 | 4;
  distance: number;
  lat: number;
  lng: number;
  photo: string;
  address: string;
  trendingScore: number;
}
