import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Compass } from 'lucide-react';

export default function SplashPage() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 2200);
    const navTimer = setTimeout(() => navigate('/home'), 2800);
    return () => {
      clearTimeout(timer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-warm-700 via-coral-600 to-warm-800 transition-opacity duration-600 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="animate-pulse mb-8">
        <div className="relative">
          <Compass className="w-20 h-20 text-warm-100" strokeWidth={1.5} />
          <MapPin className="w-8 h-8 text-coral-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[70%]" />
        </div>
      </div>

      <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-3">
        ViraLine
      </h1>

      <p className="text-warm-200 text-lg md:text-xl font-medium tracking-wide">
        Discover What's Trending Near You
      </p>

      <div className="mt-12 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-warm-200 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
