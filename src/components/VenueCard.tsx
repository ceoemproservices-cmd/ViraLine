import { MapPin, Star } from 'lucide-react';
import { Venue } from '../types';

interface Props {
  venue: Venue;
  onSelect?: (venue: Venue) => void;
}

export default function VenueCard({ venue, onSelect }: Props) {
  return (
    <div
      onClick={() => onSelect?.(venue)}
      className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden hover:shadow-md hover:border-orange-300 transition-all duration-200 cursor-pointer"
    >
      <div className="relative h-32 bg-gradient-to-br from-stone-100 to-stone-200 overflow-hidden">
        {venue.photo && (
          <img
            src={venue.photo}
            alt={venue.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
      </div>

      <div className="p-3">
        <h3 className="font-bold text-sm text-stone-900 line-clamp-2">{venue.name}</h3>

        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-stone-800">{Number(venue.rating ?? 0).toFixed(1)}</span>
            <span className="text-xs text-stone-400">({Number(venue.reviewCount ?? 0).toLocaleString()})</span>
          </div>
        </div>

        <div className="flex items-start gap-1 mt-2">
          <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-stone-600 line-clamp-2">{venue.address}</p>
        </div>

        {venue.isOpen !== undefined && (
          <div className="mt-2 pt-2 border-t border-stone-100">
            <span className={`text-xs font-medium ${venue.isOpen ? 'text-green-600' : 'text-stone-500'}`}>
              {venue.isOpen ? '🟢 Open now' : '⚫ Closed'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}