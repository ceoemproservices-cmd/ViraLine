import { useState, useEffect } from 'react';
import { Category, Location, Venue } from '../types';

export const WEBHOOK_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/quick-service`;

console.log('[ViraLine] VITE_SUPABASE_URL =', import.meta.env.VITE_SUPABASE_URL);
console.log('[ViraLine] WEBHOOK_URL =', WEBHOOK_URL);

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface VenueState {
  venues: Venue[];
  loading: boolean;
  error: string | null;
}

async function fetchFromWebhook(
  url: string,
  payload: { latitude: number; longitude: number; radius: number; category: Category; localTime: string; timezone: string }
): Promise<Omit<Venue, 'distance'>[]> {
  console.log('[ViraLine] fetch → POST', url, payload);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'Apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(payload),
  });
  console.log('[ViraLine] response status =', res.status, res.statusText);
  if (!res.ok) {
    const text = await res.text();
    console.error('[ViraLine] error body =', text);
    throw new Error(`Webhook responded ${res.status}`);
  }
  const data = await res.json();
  console.log('[ViraLine] response data =', data);
  return data;
}

function buildPayload(location: Location, category: Category) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  return { latitude: location.lat, longitude: location.lng, radius: 1500, category, localTime, timezone };
}

export function useVenues(category: Category, location: Location | null): VenueState {
  const [state, setState] = useState<VenueState>({ venues: [], loading: true, error: null });

  useEffect(() => {
    console.log('[ViraLine] useVenues effect — category:', category, 'location:', location);
    setState({ venues: [], loading: true, error: null });

    if (!WEBHOOK_URL || !location) {
      console.warn('[ViraLine] useVenues: early exit — WEBHOOK_URL:', WEBHOOK_URL, 'location:', location);
      return;
    }

    let cancelled = false;

    fetchFromWebhook(WEBHOOK_URL, buildPayload(location, category))
      .then((data) => {
        if (cancelled) return;
        const withDistance = data.map((v) => ({
          ...v,
          distance: haversineDistance(location.lat, location.lng, v.lat, v.lng),
        }));
        setState({ venues: withDistance, loading: false, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('[ViraLine] useVenues fetch failed:', err);
        setState({ venues: [], loading: false, error: err.message });
      });

    return () => { cancelled = true; };
  }, [category, location]);

  return state;
}

export function useTrendingVenues(location: Location | null): VenueState {
  const [state, setState] = useState<VenueState>({ venues: [], loading: true, error: null });

  useEffect(() => {
    console.log('[ViraLine] useTrendingVenues effect — location:', location);
    setState({ venues: [], loading: true, error: null });

    if (!WEBHOOK_URL || !location) {
      console.warn('[ViraLine] useTrendingVenues: early exit — WEBHOOK_URL:', WEBHOOK_URL, 'location:', location);
      return;
    }

    let cancelled = false;

    fetchFromWebhook(WEBHOOK_URL, buildPayload(location, 'restaurants'))
      .then((data) => {
        if (cancelled) return;
        const trending = data
          .filter((v) => v.trending)
          .map((v) => ({
            ...v,
            distance: haversineDistance(location.lat, location.lng, v.lat, v.lng),
          }))
          .slice(0, 5);
        setState({ venues: trending, loading: false, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('[ViraLine] useTrendingVenues fetch failed:', err);
        setState({ venues: [], loading: false, error: err.message });
      });

    return () => { cancelled = true; };
  }, [location]);

  return state;
}