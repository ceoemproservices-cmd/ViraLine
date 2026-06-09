import { useState, useCallback } from 'react';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import MapView from './components/MapView';
import CategoryFilter from './components/CategoryFilter';
import TrendingSection from './components/TrendingSection';
import VenueList from './components/VenueList';
import { useGeolocation } from './hooks/useGeolocation';
import { useVenues, useTrendingVenues } from './hooks/useVenues';
import { Category, Venue } from './types';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('restaurants');

  const { location } = useGeolocation();
  const { venues, loading } = useVenues(activeCategory, location);
  const { venues: trending } = useTrendingVenues(location);

  const handleVenueSelect = useCallback((_venue: Venue) => {
  }, []);

  if (!splashDone) {
    return <SplashScreen onComplete={() => setSplashDone(true)} />;
  }

  return (
    <div className="h-screen flex flex-col bg-stone-50 overflow-hidden">
      <Header />
      <MapView location={location} venues={venues} onVenueSelect={handleVenueSelect} />
      <div className="flex-1 overflow-y-auto">
        <TrendingSection venues={trending} />
        <div className="border-t border-stone-100 mt-2 pt-1">
          <div className="flex items-center gap-2 px-4 pt-3 pb-0">
            <h2 className="text-base font-bold text-stone-900">
              Nearby {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
            </h2>
            {!loading && (
              <span className="ml-auto text-xs text-stone-400 font-medium">
                {venues.length} found
              </span>
            )}
          </div>
          <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
          <VenueList venues={venues} loading={loading} />
        </div>
      </div>
    </div>
  );
}