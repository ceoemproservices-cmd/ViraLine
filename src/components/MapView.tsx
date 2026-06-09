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

export default function MapView({ location, venues, onVenueSelect }: P