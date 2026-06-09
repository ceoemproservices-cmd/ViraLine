import { MapPin, Search } from 'lucide-react';

interface Props {
  onSearchClick?: () => void;
}

export default function Header({ onSearchClick }: Props) {
  return (
    <header className="flex-shrink-0 bg-white border-b border-stone-100 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-sm">
          <MapPin className="w-4 h-4 text-white" strokeWidth={2} />
        </div>
        <span className="text-xl font-bold text-stone-900">
          Vira<span className="text-orange-500">Line</span>
        </span>
      </div>

      <button
        onClick={onSearchClick}
        className="flex items-center gap-2 bg-stone-100 hover:bg-orange-50 hover:border-orange-200 border border-transparent rounded-full px-4 py-2 text-stone-500 hover:text-orange-600 transition-all duration-200 text-sm font-medium"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Search places</span>
      </button>
    </header>
  );
}