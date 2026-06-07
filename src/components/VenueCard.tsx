import { Star, MapPin, Navigation, Clock } from 'lucide-react';
import type { Venue } from '../data/types';

interface VenueCardProps {
  venue: Venue;
  rank?: number;
  isTrending?: boolean;
}

function PriceLevel({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`text-xs font-bold ${i <= level ? 'text-warm-500' : 'text-sand-300'}`}
        >
          $
        </span>
      ))}
    </div>
  );
}

function RatingStars({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3;

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i <= full
                ? 'text-warm-500 fill-warm-500'
                : i === full + 1 && hasHalf
                  ? 'text-warm-400 fill-warm-300'
                  : 'text-sand-300'
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-sand-800">{rating}</span>
      <span className="text-xs text-sand-500">({reviewCount})</span>
    </div>
  );
}

export default function VenueCard({ venue, rank, isTrending }: VenueCardProps) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`;

  return (
    <div
      className={`group bg-white rounded-2xl shadow-sm border border-sand-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
        isTrending ? 'ring-2 ring-coral-400' : ''
      }`}
    >
      <div className="flex">
        <div className="relative w-28 h-28 md:w-36 md:h-36 flex-shrink-0 overflow-hidden">
          <img
            src={venue.photo}
            alt={venue.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {rank && (
            <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-coral-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
              {rank}
            </div>
          )}
          {isTrending && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-coral-500 text-white text-[10px] font-bold uppercase tracking-wider">
              Hot
            </div>
          )}
        </div>

        <div className="flex-1 p-3 md:p-4 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="font-semibold text-sand-900 text-sm md:text-base truncate">
              {venue.name}
            </h3>

            <div className="mt-1">
              <RatingStars rating={venue.rating} reviewCount={venue.reviewCount} />
            </div>

            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium ${
                  venue.isOpen ? 'text-emerald-600' : 'text-red-500'
                }`}
              >
                <Clock className="w-3 h-3" />
                {venue.isOpen ? 'Open' : 'Closed'}
              </span>
              <PriceLevel level={venue.priceLevel} />
              <span className="inline-flex items-center gap-0.5 text-xs text-sand-600">
                <MapPin className="w-3 h-3" />
                {venue.distance} mi
              </span>
            </div>
          </div>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-coral-500 text-white text-xs font-semibold hover:bg-coral-600 active:bg-coral-700 transition-colors w-fit"
          >
            <Navigation className="w-3 h-3" />
            Get Directions
          </a>
        </div>
      </div>
    </div>
  );
}
