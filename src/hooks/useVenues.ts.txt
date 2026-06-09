import { useState, useEffect } from 'react';
import { Category, Location, Venue } from '../types';

const WEBHOOK_URL = '';

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const MOCK_VENUES: Omit<Venue, 'distance'>[] = [
  {
    id: '1',
    name: 'Hawksmoor Borough',
    category: 'restaurants',
    photo: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.8,
    reviewCount: 2341,
    isOpen: true,
    priceLevel: 3,
    lat: 51.5045,
    lng: -0.0864,
    address: '16 Winchester Walk, London SE1',
    trending: true,
  },
  {
    id: '2',
    name: 'Dishoom Covent Garden',
    category: 'restaurants',
    photo: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.7,
    reviewCount: 5812,
    isOpen: true,
    priceLevel: 2,
    lat: 51.5116,
    lng: -0.1231,
    address: "12 Upper St Martin's Lane, London WC2",
    trending: true,
  },
  {
    id: '3',
    name: 'The Ledbury',
    category: 'restaurants',
    photo: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.9,
    reviewCount: 1204,
    isOpen: false,
    priceLevel: 4,
    lat: 51.5188,
    lng: -0.2062,
    address: '127 Ledbury Road, Notting Hill W11',
    trending: false,
  },
  {
    id: '4',
    name: 'Nine Lives Bar',
    category: 'bars',
    photo: 'https://images.pexels.com/photos/1267696/pexels-photo-1267696.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.5,
    reviewCount: 876,
    isOpen: true,
    priceLevel: 2,
    lat: 51.5021,
    lng: -0.0895,
    address: '8 Holyrood Street, London SE1',
    trending: true,
  },
  {
    id: '5',
    name: 'Callooh Callay',
    category: 'bars',
    photo: 'https://images.pexels.com/photos/3407777/pexels-photo-3407777.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.3,
    reviewCount: 1423,
    isOpen: true,
    priceLevel: 2,
    lat: 51.5233,
    lng: -0.0776,
    address: '65 Rivington Street, Shoreditch EC2',
    trending: false,
  },
  {
    id: '6',
    name: 'Monmouth Coffee',
    category: 'cafes',
    photo: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.6,
    reviewCount: 3210,
    isOpen: true,
    priceLevel: 1,
    lat: 51.5056,
    lng: -0.0947,
    address: '2 Park Street, Borough Market SE1',
    trending: false,
  },
  {
    id: '7',
    name: 'The Attendant Fitzrovia',
    category: 'cafes',
    photo: 'https://images.pexels.com/photos/1813466/pexels-photo-1813466.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.4,
    reviewCount: 987,
    isOpen: true,
    priceLevel: 1,
    lat: 51.5181,
    lng: -0.1397,
    address: '27A Foley Street, Fitzrovia W1W',
    trending: false,
  },
  {
    id: '8',
    name: 'XOYO',
    category: 'nightlife',
    photo: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.2,
    reviewCount: 2098,
    isOpen: true,
    priceLevel: 3,
    lat: 51.5246,
    lng: -0.0801,
    address: '32-37 Cowper Street, Shoreditch EC2',
    trending: true,
  },
  {
    id: '9',
    name: 'Fabric London',
    category: 'nightlife',
    photo: 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.4,
    reviewCount: 4521,
    isOpen: false,
    priceLevel: 3,
    lat: 51.5199,
    lng: -0.1018,
    address: '77A Charterhouse Street, Clerkenwell EC1',
    trending: false,
  },
  {
    id: '10',
    name: 'Tower of London',
    category: 'attractions',
    photo: 'https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.6,
    reviewCount: 78432,
    isOpen: true,
    priceLevel: 2,
    lat: 51.5081,
    lng: -0.0759,
    address: 'Tower Hill, London EC3N',
    trending: false,
  },
  {
    id: '11',
    name: 'Borough Market',
    category: 'attractions',
    photo: 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.7,
    reviewCount: 56120,
    isOpen: true,
    priceLevel: 0,
    lat: 51.5055,
    lng: -0.0905,
    address: '8 Southwark Street, London SE1',
    trending: true,
  },
  {
    id: '12',
    name: 'Southwark Cathedral',
    category: 'worship',
    photo: 'https://images.pexels.com/photos/161132/pexels-photo-161132.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.8,
    reviewCount: 12034,
    isOpen: true,
    priceLevel: 0,
    lat: 51.5059,
    lng: -0.0899,
    address: 'London Bridge, London SE1',
    trending: false,
  },
  {
    id: '13',
    name: "St Paul's Cathedral",
    category: 'worship',
    photo: 'https://images.pexels.com/photos/1105592/pexels-photo-1105592.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.7,
    reviewCount: 34209,
    isOpen: true,
    priceLevel: 2,
    lat: 51.5138,
    lng: -0.0984,
    address: "St. Paul's Churchyard, London EC4",
    trending: false,
  },
];

interface VenueState {
  venues: Venue[];
  loading: boolean;
  error: string | null;
}

export function useVenues(category: Category, location: Location | null): VenueState {
  const [state, setState] = useState<VenueState>({ venues: [], loading: true, error: null });

  useEffect(() => {
    setState((s) => ({ ...s, loading: true }));

    const fetchVenues = async () => {
      if (WEBHOOK_URL && location) {
        try {
          const res = await fetch(`${WEBHOOK_URL}?category=${category}&lat=${location.lat}&lng=${location.lng}`);
          if (!res.ok) throw new Error('Webhook error');
          const data: Omit<Venue, 'distance'>[] = await res.json();
          const withDistance = data.map((v) => ({
            ...v,
            distance: haversineDistance(location.lat, location.lng, v.lat, v.lng),
          }));
          setState({ venues: withDistance, loading: false, error: null });
          return;
        } catch {
          // fall through to mock data
        }
      }

      await new Promise((r) => setTimeout(r, 600));

      const refLat = location?.lat ?? 51.5074;
      const refLng = location?.lng ?? -0.1278;

      const filtered = MOCK_VENUES.filter((v) => v.category === category)
        .map((v) => ({
          ...v,
          distance: haversineDistance(refLat, refLng, v.lat, v.lng),
        }))
        .sort((a, b) => a.distance - b.distance);

      setState({ venues: filtered, loading: false, error: null });
    };

    fetchVenues();
  }, [category, location]);

  return state;
}

export function useTrendingVenues(location: Location | null): VenueState {
  const [state, setState] = useState<VenueState>({ venues: [], loading: true, error: null });

  useEffect(() => {
    const refLat = location?.lat ?? 51.5074;
    const refLng = location?.lng ?? -0.1278;

    const trending = MOCK_VENUES.filter((v) => v.trending)
      .map((v) => ({
        ...v,
        distance: haversineDistance(refLat, refLng, v.lat, v.lng),
      }))
      .slice(0, 5);

    setState({ venues: trending, loading: false, error: null });
  }, [location]);

  return state;
}