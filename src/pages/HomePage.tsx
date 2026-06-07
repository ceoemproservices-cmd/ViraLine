import { useState, useMemo, useEffect } from 'react';
import { MapPin, Compass, Loader2, Radio, Download } from 'lucide-react';
import { venues, FALLBACK_NEARBY } from '../data/venues';
import type { Category, NearbyVenue } from '../data/types';
import CategoryBar from '../components/CategoryBar';
import MapView from '../components/MapView';
import VenueCard from '../components/VenueCard';
import TrendingTonight from '../components/TrendingTonight';
import NearbyVenueCard from '../components/NearbyVenueCard';

interface LatLng { lat: number; lng: number }

const DEFAULT_CENTER: LatLng = { lat: 40.758, lng: -73.9855 };
const WEBHOOK_URL = 'https://jozmwswvkccfjyllgubt.supabase.co/functions/v1/webhook-proxy';

async function fetchNearbyFromWebhook(lat: number, lng: number): Promise<NearbyVenue[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latitude: lat,
        longitude: lng,
        category: 'restaurant',
        radius: '1500',
      }),
      signal: controller.signal,
    });

    if (!res.ok) throw new Error(`Webhook responded with ${res.status}`);

    const data = await res.json();
    if (Array.isArray(data)) return data as NearbyVenue[];
    if (Array.isArray(data?.results)) return data.results as NearbyVenue[];
    if (Array.isArray(data?.venues)) return data.venues as NearbyVenue[];
    return [];
  } finally {
    clearTimeout(timer);
  }
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [center, setCenter] = useState<LatLng>(DEFAULT_CENTER);
  const [locationLabel, setLocationLabel] = useState('Times Square');

  const [nearbyVenues, setNearbyVenues] = useState<NearbyVenue[]>([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: LatLng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(coords);

        // Reverse geocode for label
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`,
          { headers: { 'Accept-Language': 'en' } }
        )
          .then((r) => r.json())
          .then((data) => {
            const label =
              data.address?.neighbourhood ||
              data.address?.suburb ||
              data.address?.city_district ||
              data.address?.city ||
              'Your Location';
            setLocationLabel(label);
          })
          .catch(() => setLocationLabel('Your Location'));

        // Fetch from webhook, fall back to sample data on any failure
        setNearbyLoading(true);
        setUsingFallback(false);
        fetchNearbyFromWebhook(coords.lat, coords.lng)
          .then((results) => {
            setNearbyVenues(results.length > 0 ? results : FALLBACK_NEARBY);
            if (results.length === 0) setUsingFallback(true);
            setNearbyLoading(false);
          })
          .catch((err: unknown) => {
            console.warn('Webhook unavailable, using sample data:', err);
            setNearbyVenues(FALLBACK_NEARBY);
            setUsingFallback(true);
            setNearbyLoading(false);
          });
      },
      () => {
        // Permission denied or unavailable — keep defaults
      },
      { timeout: 8000 }
    );
  }, []);

  const filteredVenues = useMemo(() => {
    let result = venues;

    if (activeCategory) {
      result = result.filter((v) => v.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.address.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => b.trendingScore - a.trendingScore);
  }, [activeCategory, searchQuery]);

  const trendingTonight = useMemo(
    () => venues.filter((v) => v.isOpen).sort((a, b) => b.trendingScore - a.trendingScore).slice(0, 3),
    []
  );

  const topTen = filteredVenues.slice(0, 10);

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-lg border-b border-sand-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-warm-500 to-coral-500 flex items-center justify-center shadow-sm">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-sand-900 tracking-tight">ViraLine</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-sand-500">
            <MapPin className="w-4 h-4 text-coral-500" />
            <span className="font-medium text-sand-700">{locationLabel}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {/* Search & Categories */}
        <CategoryBar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Map */}
        <MapView venues={topTen} center={center} />

        {/* Nearby Venues from Webhook */}
        {(nearbyLoading || nearbyVenues.length > 0) && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-warm-500 flex items-center justify-center">
                <Radio className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-sand-900">Nearby Restaurants</h2>
                  {usingFallback && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sand-100 text-sand-500 border border-sand-200">
                      Sample
                    </span>
                  )}
                </div>
                <p className="text-xs text-sand-500">
                  {usingFallback ? 'Live data unavailable — showing sample venues' : 'Live results around your location'}
                </p>
              </div>
            </div>

            {nearbyLoading && (
              <div className="flex items-center justify-center gap-3 py-10 text-sand-500">
                <Loader2 className="w-5 h-5 animate-spin text-warm-500" />
                <span className="text-sm">Fetching venues near you...</span>
              </div>
            )}

            {!nearbyLoading && nearbyVenues.length > 0 && (
              <div className="space-y-3">
                {nearbyVenues.map((venue, i) => (
                  <NearbyVenueCard key={`nearby-${i}`} venue={venue} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Trending Tonight */}
        {!activeCategory && !searchQuery && (
          <TrendingTonight venues={trendingTonight} />
        )}

        {/* Top 10 List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-sand-900">
              {activeCategory || searchQuery ? 'Results' : 'Top 10 Trending'}
            </h2>
            <span className="text-sm text-sand-500">{topTen.length} venues</span>
          </div>

          <div className="space-y-3">
            {topTen.map((venue, i) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                rank={!activeCategory && !searchQuery ? i + 1 : undefined}
              />
            ))}
          </div>

          {topTen.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sand-500 text-sm">No venues found matching your search.</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-sand-200 mt-8">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-sand-400">ViraLine &mdash; Discover What's Trending Near You</span>
          <a
            href="/viraline-project.zip"
            download="viraline-project.zip"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sand-100 hover:bg-sand-200 border border-sand-200 hover:border-sand-300 text-sand-700 hover:text-sand-900 text-xs font-medium transition-all duration-150 group"
          >
            <Download className="w-3.5 h-3.5 text-warm-500 group-hover:translate-y-0.5 transition-transform duration-150" />
            Download Source Code
          </a>
        </div>
      </footer>
    </div>
  );
}
