import { Flame } from 'lucide-react';
import { Venue } from '../types';
import VenueCard from './VenueCard';

interface Props {
  venues: Venue[];
}

export default function TrendingSection({ venues }: Props) {
  if (venues.length === 0) return null;

  return (
    <div className="pt-4 pb-2">
      <div className="flex items-center gap-2 px-4 mb-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center">
          <Flame className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-base font-bold text-stone-900">Trending Tonight</h2>
        <span className="ml-auto text-xs text-orange-500 font-semibold uppercase tracking-wide">
          Hot right now
        </span>
      </div>
      <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide pb-1">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} compact />
        ))}
      </div>
    </div>
  );
}