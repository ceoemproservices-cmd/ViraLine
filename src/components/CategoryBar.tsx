import { Search, UtensilsCrossed, Moon, Wine, Coffee, Landmark } from 'lucide-react';
import type { Category } from '../data/types';

interface CategoryBarProps {
  activeCategory: Category | null;
  onCategoryChange: (cat: Category | null) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const CATEGORIES: { key: Category; label: string; icon: typeof UtensilsCrossed; color: string }[] = [
  { key: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed, color: 'bg-warm-500' },
  { key: 'nightlife', label: 'Nightlife', icon: Moon, color: 'bg-night-500' },
  { key: 'bars', label: 'Bars', icon: Wine, color: 'bg-coral-500' },
  { key: 'cafes', label: 'Cafes', icon: Coffee, color: 'bg-sand-600' },
  { key: 'attractions', label: 'Attractions', icon: Landmark, color: 'bg-warm-700' },
];

export default function CategoryBar({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: CategoryBarProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sand-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search venues, places, experiences..."
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-sand-200 rounded-2xl text-sm text-sand-800 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-warm-400 focus:border-transparent transition-shadow shadow-sm"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onCategoryChange(null)}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            activeCategory === null
              ? 'bg-warm-600 text-white shadow-md'
              : 'bg-white text-sand-600 border border-sand-200 hover:bg-sand-100'
          }`}
        >
          All
        </button>
        {CATEGORIES.map(({ key, label, icon: Icon, color }) => (
          <button
            key={key}
            onClick={() => onCategoryChange(activeCategory === key ? null : key)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeCategory === key
                ? `${color} text-white shadow-md`
                : 'bg-white text-sand-600 border border-sand-200 hover:bg-sand-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
