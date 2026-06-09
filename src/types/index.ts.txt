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
  category: Category;
  photo: string;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  priceLevel: 0 | 1 | 2 | 3 | 4;
  distance: number;
  lat: number;
  lng: number;
  address: string;
  trending: boolean;
}