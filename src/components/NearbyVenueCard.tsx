import { Star, MapPin, Navigation, Clock } from 'lucide-react';
import type { NearbyVenue } from '../data/types';

function resolveAddress(v: NearbyVenue): string {
  return v.address ?? v.vicinity ?? v.formatted_address ?? '';
}

function resolveIsOpen(v: NearbyVenue): boolean | null {
  if (v.isOpen !== undefined) return v.isOpen;
  if (v.open_now !== undefined) return v.open_now;
  if (v.opening_hours?.open_now !== undefined) return v.opening_hours.open_now;
  return null;
}

function resolvePriceLevel(v: NearbyVenue): number | null {
  if (v.priceLevel !== undefined) return v.priceLevel;
  if (v.price_level !== undefined) return v.price_level;
  return null;
}

function resolveLatLng(v: NearbyVenue): { lat: number; lng: number } | null {
  if (v.lat !== undefined && v.lng !== undefined) return { lat: v.lat, lng: v.lng };
  const loc = v.geometry?.location;
  if (loc?.lat !== undefined && loc?.lng !== undefined) return { lat: loc.lat, lng: loc.lng };
  return null;
}

function PriceLevel({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4].map((i) => (
        <span key={i} className={`text-xs font-bold ${i <= level ? 'text-warm-500' : 'text-sand-300'}`}>
          $
        </span>
      ))}
    </div>
  );
}

export default function NearbyVenueCard({ venue }: { venue: NearbyVenue }) {
  const address = resolveAddress(venue);
  const isOpen = resolveIsOpen(venue);
  const priceLevel = resolvePriceLevel(venue);
  const coords = resolveLatLng(venue);

  const directionsUrl = coords
    ? `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name + ' ' + address)}`;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-sand-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      <div className="flex">
        {/* Accent stripe */}
        <div className="w-1.5 flex-shrink-0 bg-gradient-to-b from-warm-400 to-coral-500 rounded-l-2xl" />

        <div className="flex-1 p-3 md:p-4 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="font-semibold text-sand-900 text-sm md:text-base truncate">
              {venue.name}
            </h3>

            {address && (
              <p className="flex items-center gap-1 text-xs text-sand-500 mt-0.5 truncate">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                {address}
              </p>
            )}

            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {venue.rating !== undefined && (
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-warm-500 fill-warm-500" />
                  <span className="text-sm font-semibold text-sand-800">{venue.rating}</span>
                </div>
              )}

              {isOpen !== null && (
                <span className={`inline-flex items-center gap-1 text-xs font-medium ${isOpen ? 'text-emerald-600' : 'text-red-500'}`}>
                  <Clock className="w-3 h-3" />
                  {isOpen ? 'Open' : 'Closed'}
                </span>
              )}

              {priceLevel !== null && <PriceLevel level={priceLevel} />}
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
