import { Venue } from '../types';
import VenueCard from './VenueCard';
import { MapPin, Search } from 'lucide-react';

interface Props {
  venues: Venue[];
  loading: boolean;
  discovering?: boolean;
}

const SKELETON_COUNT = 3;

export default function VenueList({ venues, loading, discovering }: Props) {
  if (loading) {
    if (discovering) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4 gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-orange-200" />
            <div className="absolute inset-0 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <div>
            <p className="text-stone-700 font-semibold">Discovering venues near you...</p>
            <p className="text-stone-400 text-sm mt-1">Finding the best spots in your area</p>
          </div>
        </div>
      );
    }

    return (
      <div className="px-4 pb-6 flex flex-col gap-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-stone-100 animate-pulse">
            <div className="h-40 bg-stone-100" />
            <div className="p-3 flex flex-col gap-2">
              <div className="h-4 bg-stone-100 rounded-full w-2/3" />
              <div className="h-3 bg-stone-100 rounded-full w-1/2" />
              <div className="h-9 bg-stone-100 rounded-xl mt-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (venues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8 text-orange-300" />
        </div>
        <p className="text-stone-600 font-medium">No venues found nearby</p>
        <p className="text-stone-400 text-sm mt-1">Try a different category</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-8 flex flex-col gap-3">
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
}