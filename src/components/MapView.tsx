import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Location, Venue } from '../types';

interface Props {
  location: Location | null;
  venues: Venue[];
  onVenueSelect?: (venue: Venue) => void;
}

export default function MapView({ location }: Props) {
  const [gpsTimedOut, setGpsTimedOut] = useState(false);

  useEffect(() => {
    if (location) return;
    const t = setTimeout(() => setGpsTimedOut(true), 8000);
    return () => clearTimeout(t);
  }, [location]);

  return (
    <div className="relative flex-shrink-0 border-b border-stone-200" style={{ height: '260px' }}>
      {location ? (
        <iframe
          key={`${location.lat},${location.lng}`}
          title="Map"
          width="100%"
          height="100%"
          style={{ border: 0, display: 'block' }}
          loading="lazy"
          allowFullScreen
          src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=14&output=embed`}
        />
      ) : (
        <div className="w-full h-full bg-stone-100 flex flex-col items-center justify-center gap-2">
          {!gpsTimedOut ? (
            <>
              <div className="w-10 h-10 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
              <span className="text-sm font-medium text-stone-500">Locating you…</span>
            </>
          ) : (
            <>
              <MapPin className="w-6 h-6 text-stone-400" />
              <span className="text-sm font-medium text-stone-400">Enable location for better results</span>
            </>
          )}
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-stone-50/60 to-transparent pointer-events-none" />
    </div>
  );
}