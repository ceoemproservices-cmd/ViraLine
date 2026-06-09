import { Star, Navigation, DollarSign } from 'lucide-react';
import { Venue } from '../types';

function formatDistance(m: number): string {
  if (m < 1000) return `${Math.round(m)}m`;
  return `${(m / 1000).toFixed(1)}km`;
}

function formatPrice(level: number): string {
  if (level === 0) return 'Free';
  return '$'.repeat(level);
}

function getDirectionsUrl(lat: number, lng: number, name: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_name=${encodeURIComponent(name)}`;
}

interface Props {
  venue: Venue;
  compact?: boolean;
}

export default function VenueCard({ venue, compact = false }: Props) {
  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md hover:border-orange-100 transition-all duration-200 ${compact ? 'w-52 flex-shrink-0' : 'w-full'}`}>
      <div className="relative overflow-hidden" style={{ height: compact ? '120px' : '160px' }}>
        <img
          src={venue.photo}
          alt={venue.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold ${venue.isOpen ? 'bg-emerald-500 text-white' : 'bg-stone-800/80 text-stone-200'}`}>
          {venue.isOpen ? 'Open' : 'Closed'}
        </span>
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
          <Navigation className="w-3 h-3" />
          {formatDistance(venue.distance)}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-stone-900 text-sm leading-tight line-clamp-1">{venue.name}</h3>
        {!compact && (
          <p className="text-stone-400 text-xs mt-0.5 line-clamp-1">{venue.address}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold text-stone-800">{venue.rating.toFixed(1)}</span>
            {!compact && (
              <span className="text-xs text-stone-400">({venue.reviewCount.toLocaleString()})</span>
            )}
          </div>
          {venue.priceLevel > 0 ? (
            <div className="flex items-center gap-0.5">
              <DollarSign className="w-3 h-3 text-stone-400" />
              <span className="text-xs font-medium text-stone-500">{formatPrice(venue.priceLevel)}</span>
            </div>
          ) : (
            <span className="text-xs font-medium text-emerald-600">Free</span>
          )}
        </div>
        {!compact && (
          <a href={getDirectionsUrl(venue.lat, venue.lng, venue.name)} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-semibold transition-colors duration-150">
            <Navigation className="w-3.5 h-3.5" />
            Get Directions
          </a>
        )}
      </div>
    </div>
  );
}