import { useState, useEffect } from 'react';
import { Category, Location, Venue } from '../types';

export const WEBHOOK_URL = 'https://booted-feminine-staff.ngrok-free.dev/webhook-test/09c8962b-ed67-4c01-b740-33bccb02c625';

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
  payload: { lat: number; lng: number; category: Category; localTime: string; timezone: string }
): Promise<Omit<Venue, 'distance'>[]> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  return res.json();
}

function buildPayload(location: Location, category: Category) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  return { lat: location.lat, lng: location.lng, category, localTime, timezone };
}

export function useVenues(category: Category, location: Location | null): VenueState {
  const [state, setState] = useState<VenueState>({ venues: [], loading: true, error: null });

  useEffect(() => {
    setState({ venues: [], loading: true, error: null });

    if (!WEBHOOK_URL || !location) return;

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
        setState({ venues: [], loading: false, error: err.message });
      });

    return () => { cancelled = true; };
  }, [category, location]);

  return state;
}

export function useTrendingVenues(location: Location | null): VenueState {
  const [state, setState] = useState<VenueState>({ venues: [], loading: true, error: null });

  useEffect(() => {
    setState({ venues: [], loading: true, error: null });

    if (!WEBHOOK_URL || !location) return;

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
        setState({ venues: [], loading: false, error: err.message });
      });

    return () => { cancelled = true; };
  }, [location]);

  return state;
}