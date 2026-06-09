import { UtensilsCrossed, Music2, Wine, Coffee, Camera, Building2 } from 'lucide-react';
import { Category } from '../types';

const CATEGORIES: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: 'restaurants', label: 'Restaurants', icon: <UtensilsCrossed className="w-4 h-4" /> },
  { id: 'nightlife', label: 'Nightlife', icon: <Music2 className="w-4 h-4" /> },
  { id: 'bars', label: 'Bars', icon: <Wine className="w-4 h-4" /> },
  { id: 'cafes', label: 'Cafes', icon: <Coffee className="w-4 h-4" /> },
  { id: 'attractions', label: 'Attractions', icon: <Camera className="w-4 h-4" /> },
  { id: 'worship', label: 'Worship', icon: <Building2 className="w-4 h-4" /> },
];

interface Props {
  active: Category;
  onChange: (c: Category) => void;
}

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="px-4 py-3">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 border ${
              active === cat.id
                ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200'
                : 'bg-white text-stone-600 border-stone-200 hover:border-orange-300 hover:text-orange-600'
            }`}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}