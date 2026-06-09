import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import { Location, Venue } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
  restaurants: '#f97316',
  nightlife: '#a855f7',
  bars: '#3b82f6',
  cafes: '#92400e',
  attractions: '#10b981',
  worship: '#6366f1',
};

function createVenueIcon(category: string, isOpen: boolean): L.DivIcon {
  const color = CATEGORY_COLORS[category] ?? '#f97316';
  const opacity = isOpen ? '1' : '0.5';
  return L.divIcon({
    className: '',
    html: `
      <div style="width:34px;height:40px;position:relative;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.35));opacity:${opacity};">
        <svg viewBox="0 0 34 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 0C7.6 0 0 7.6 0 17c0 11.9 17 23 17 23S34 28.9 34 17C34 7.6 26.4 0 17 0z" fill="${color}"/>
          <circle cx="17" cy="17" r="7" fill="white"/>
        </svg>
      </div>
    `,
    iconSize: [34, 40],
    iconAnchor: [17, 40],
    popupAnchor: [0, -42],
  });
}

function createUserIcon(): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `
      <div style="width:20px;height:20px;position:relative;">
        <div style="width:20px;height:20px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 0 0 3px rgba(59,130,246,0.35),0 2px 8px rgba(0,0,0,0.3);"></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

interface Props {
  location: Location | null;
  venues: Venue[];
  onVenueSelect?: (venue: Venue) => void;
}

export default function MapView({ location, venues, onVenueSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const markersRef = useRef<L.Layer[]>([]);
  const seededLocationRef = useRef<Location | null>(null);
  const [gpsTimedOut, setGpsTimedOut] = useState(false);

  useEffect(() => {
    if (location) return;
    const t = setTimeout(() => setGpsTimedOut(true), 8000);
    return () => clearTimeout(t);
  }, [location]);

  useEffect(() => {
    if (!location && !gpsTimedOut) return;
    if (!containerRef.current) return;

    const center: L.LatLngExpression = location
      ? [location.lat, location.lng]
      : [51.5074, -0.1278];

    if (
      seededLocationRef.current &&
      location &&
      seededLocationRef.current.lat === location.lat &&
      seededLocationRef.current.lng === location.lng
    ) {
      return;
    }

    if (mapRef.current) {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      userMarkerRef.current = null;
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(containerRef.current, {
      center,
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.control.attribution({ position: 'bottomleft', prefix: '© <a href="https://openstreetmap.org">OpenStreetMap</a>' }).addTo(map);

    if (location) {
      userMarkerRef.current = L.marker([location.lat, location.lng], {
        icon: createUserIcon(),
        zIndexOffset: 1000,
      })
        .addTo(map)
        .bindPopup('<strong>You are here</strong>');
    }

    mapRef.current = map;
    seededLocationRef.current = location;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      userMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
      seededLocationRef.current = null;
    };
  }, [!!location, gpsTimedOut]);

  useEffect(() => {
    if (!location || !mapRef.current) return;
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([location.lat, location.lng]);
    } else {
      userMarkerRef.current = L.marker([location.lat, location.lng], {
        icon: createUserIcon(),
        zIndexOffset: 1000,
      })
        .addTo(mapRef.current)
        .bindPopup('<strong>You are here</strong>');
    }
  }, [location]);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    venues.forEach((venue) => {
      const marker = L.marker([venue.lat, venue.lng], {
        icon: createVenueIcon(venue.category, venue.isOpen),
      })
        .addTo(mapRef.current!)
        .bindPopup(
          `<div style="min-width:160px">
            <strong style="font-size:14px">${venue.name}</strong>
            <div style="font-size:12px;color:#78716c;margin-top:2px">${venue.address}</div>
            <div style="display:flex;align-items:center;gap:6px;margin-top:6px">
              <span style="font-weight:600">⭐ ${venue.rating.toFixed(1)}</span>
              <span style="color:${venue.isOpen ? '#10b981' : '#ef4444'};font-weight:600">${venue.isOpen ? 'Open' : 'Closed'}</span>
            </div>
          </div>`
        );

      marker.on('click', () => onVenueSelect?.(venue));
      markersRef.current.push(marker);
    });
  }, [venues, onVenueSelect]);

  return (
    <div className="relative flex-shrink-0 border-b border-stone-200" style={{ height: '260px' }}>
      <div ref={containerRef} className="w-full h-full" />

      {!location && !gpsTimedOut && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100/90 backdrop-blur-sm gap-2">
          <div className="w-10 h-10 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
          <span className="text-sm font-medium text-stone-500">Locating you…</span>
        </div>
      )}

      {!location && gpsTimedOut && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-100/90 backdrop-blur-sm gap-2 pointer-events-none">
          <MapPin className="w-6 h-6 text-stone-400" />
          <span className="text-sm font-medium text-stone-400">Enable location for better results</span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-stone-50/60 to-transparent pointer-events-none" />
    </div>
  );
}