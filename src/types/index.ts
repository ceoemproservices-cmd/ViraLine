export type Category =
  | 'restaurants'
  | 'nightlife'
  | 'bars'
  | 'cafes'
  | 'attractions'
  | 'worship';

export interface Location {
  lat: number;
  lng: number;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  priceLevel: number;
  isOpen: boolean;
  trending: boolean;
  lat: number;
  lng: number;
  photo?: string;
  distance: number;
  category?: Category;
  waitTime?: number;
}