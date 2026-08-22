import React, { useState, useEffect } from 'react';
import { Flame, Users } from 'lucide-react';

export const TopNotification: React.FC = () => {
  const [visitorCount, setVisitorCount] = useState(138);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.min(Math.max(prev + delta, 120), 185);
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#DF0E03] text-white py-2 px-3 text-center text-xs sm:text-sm font-medium sticky top-0 z-40 shadow-sm flex items-center justify-center gap-2">
      <Flame className="w-4 h-4 text-yellow-300 animate-pulse shrink-0" />
      <span>
        <strong>PROMO SPESIAL HARI INI:</strong> Diskon 50% + 3 Bonus Eksklusif
      </span>
      <span className="hidden sm:inline-flex items-center gap-1 bg-black/25 px-2 py-0.5 rounded-full text-[11px] font-semibold text-yellow-200">
        <Users className="w-3 h-3" /> {visitorCount} Pria sedang membaca
      </span>
    </div>
  );
};
