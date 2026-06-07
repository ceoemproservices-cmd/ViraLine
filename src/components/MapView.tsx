import { useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import type { Venue } from '../data/types';

interface LatLng { lat: number; lng: number }

interface MapViewProps {
  venues: Venue[];
  center?: LatLng;
  onVenueClick?: (venue: Venue) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  restaurants: '#d4832f',
  nightlife: '#526085',
  bars: '#ff5733',
  cafes: '#a39885',
  attractions: '#6c371d',
};

const mapContainerStyle = { width: '100%', height: '100%' };
const DEFAULT_CENTER: LatLng = { lat: 40.758, lng: -73.9855 };

const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#f5f1e8' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6c371d' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e8' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#d4e8f0' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e0ddd5' }] },
];

export default function MapView({ venues, center, onVenueClick }: MapViewProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const mapRef = useRef<google.maps.Map | null>(null);

  // Pan without remounting when center changes
  useEffect(() => {
    if (mapRef.current && center) {
      mapRef.current.panTo(center);
    }
  }, [center]);

  if (!apiKey) {
    return (
      <div className="w-full h-[300px] md:h-[400px] bg-gradient-to-br from-warm-100 to-sand-200 rounded-2xl flex items-center justify-center border border-sand-200 overflow-hidden">
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-warm-200 flex items-center justify-center">
            <svg className="w-8 h-8 text-warm-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <p className="text-sand-700 font-medium text-sm">Map View</p>
          <p className="text-sand-500 text-xs mt-1">{venues.length} venues in the area</p>
          <div className="mt-4 grid grid-cols-3 gap-2 max-w-xs mx-auto">
            {venues.slice(0, 6).map((v) => (
              <button
                key={v.id}
                onClick={() => onVenueClick?.(v)}
                className="p-2 rounded-lg bg-white/80 border border-sand-200 text-xs text-sand-700 hover:bg-warm-50 transition-colors truncate"
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden border border-sand-200 shadow-sm">
      <LoadScript
        googleMapsApiKey={apiKey}
        loadingElement={
          <div className="w-full h-full bg-sand-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto border-3 border-warm-400 border-t-transparent rounded-full animate-spin" />
              <p className="mt-3 text-sm text-sand-500">Loading map...</p>
            </div>
          </div>
        }
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center ?? DEFAULT_CENTER}
          zoom={14}
          options={{
            gestureHandling: 'greedy',
            disableDefaultUI: true,
            styles: MAP_STYLES,
          }}
          onLoad={(map) => { mapRef.current = map; }}
        >
          {venues.map((venue) => (
            <Marker
              key={venue.id}
              position={{ lat: venue.lat, lng: venue.lng }}
              onClick={() => onVenueClick?.(venue)}
              icon={{
                path: 0,
                fillColor: CATEGORY_COLORS[venue.category] || '#d4832f',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
                scale: 8,
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
