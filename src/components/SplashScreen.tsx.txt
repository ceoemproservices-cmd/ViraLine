import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 600);
    const t2 = setTimeout(() => setPhase('out'), 2400);
    const t3 = setTimeout(onComplete, 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${
        phase === 'out' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ background: 'linear-gradient(135deg, #c2410c 0%, #ea580c 40%, #f97316 70%, #fb923c 100%)' }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5" />
        <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-white/5" />
      </div>

      <div
        className={`relative flex flex-col items-center gap-5 transition-all duration-700 ${
          phase === 'in' ? 'opacity-0 translate-y-6 scale-95' : 'opacity-100 translate-y-0 scale-100'
        }`}
      >
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl border border-white/30">
            <MapPin className="w-12 h-12 text-white" strokeWidth={1.5} />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-300 border-2 border-orange-500 animate-pulse" />
        </div>

        <div className="text-center">
          <h1 className="text-5xl font-bold text-white tracking-tight drop-shadow-lg">
            Vira<span className="text-amber-300">Line</span>
          </h1>
          <p className="mt-2 text-white/85 text-lg font-medium tracking-wide">
            Discover What's Trending Near You
          </p>
        </div>

        <div className="w-48 h-1 rounded-full bg-white/30 overflow-hidden mt-4">
          <div
            className={`h-full rounded-full bg-amber-300 transition-all ease-out ${
              phase === 'in' ? 'w-0 duration-100' : phase === 'hold' ? 'w-3/4 duration-[1600ms]' : 'w-full duration-300'
            }`}
          />
        </div>
      </div>

      <p className="absolute bottom-8 text-white/50 text-sm font-medium tracking-widest uppercase">
        Explore · Discover · Experience
      </p>
    </div>
  );
}