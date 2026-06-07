import { Flame } from 'lucide-react';
import type { Venue } from '../data/types';
import VenueCard from './VenueCard';

interface TrendingTonightProps {
  venues: Venue[];
}

export default function TrendingTonight({ venues }: TrendingTonightProps) {
  if (venues.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-coral-500 flex items-center justify-center">
          <Flame className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-sand-900">Trending Tonight</h2>
          <p className="text-xs text-sand-500">The hottest spots right now</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {venues.map((venue, i) => (
          <VenueCard key={venue.id} venue={venue} rank={i + 1} isTrending />
        ))}
      </div>
    </section>
  );
}
