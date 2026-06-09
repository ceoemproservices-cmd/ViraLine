import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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

let _map: L.Map | null = null;
let _userMarker: L.Marker | null = null;
let _lastLocation: Location | null = null;

function applyLocationToMap(location: Location) {
  _lastLocation = location;
  if (!_map) return;
  _map.setView([location.lat, location.lng], 14, { animate: false });
  _map.invalidateSize();
  _userMarker?.remove();
  _userMarker = L.marker([location.lat, location.lng], {
    icon: createUserIcon(),
    zIndexOffset: 1000,
  })
    .addTo(_map)
    .bindPopup('<strong>You are here</strong>');
}

interface Props {
  location: Location | null;
  venues: Venue[];
  onVenueSelect?: (venue: Venue) => void;
}

export default function MapView({ location, venues, onVenueSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Layer[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    if (_map) {
      _map.remove();
      _map = null;
      _userMarker = null;
    }

    const map = L.map(containerRef.current, {
      center: [51.5074, -0.1278],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.control.attribution({ position: 'bottomleft', prefix: '© <a href="https://openstreetmap.org">OpenStreetMap</a>' }).addTo(map);

    _map = map;

    requestAnimationFrame(() => {
      map.invalidateSize();
      if (_lastLocation) {
        map.setView([_lastLocation.lat, _lastLocation.lng], 14, { animate: false });
        if (!_userMarker) {
          _userMarker = L.marker([_lastLocation.lat, _lastLocation.lng], {
            icon: createUserIcon(),
            zIndexOffset: 1000,
          })
            .addTo(map)
            .bindPopup('<strong>You are here</strong>');
        }
      }
    });

    return () => {
      map.remove();
      if (_map === map) {
        _map = null;
        _userMarker = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!location) return;
    applyLocationToMap(location);
  }, [location]);

  useEffect(() => {
    if (!_map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    venues.forEach((venue) => {
      const marker = L.marker([venue.lat, venue.lng], {
        icon: createVenueIcon(venue.category, venue.isOpen),
      })
        .addTo(_map!)
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
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-stone-50/60 to-transparent pointer-events-none" />
    </div>
  );
}