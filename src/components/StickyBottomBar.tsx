import React, { useState, useEffect } from 'react';
import { ArrowRight, Flame } from 'lucide-react';

interface StickyBottomBarProps {
  onCtaClick: () => void;
}

export const StickyBottomBar: React.FC<StickyBottomBarProps> = ({ onCtaClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <aside aria-label="Aksi Cepat Pesan Ebook" className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 py-2.5 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] animate-fade-in">
      <div className="max-w-[540px] mx-auto flex items-center justify-between gap-3">
        <div className="text-left">
          <div className="flex items-center gap-1 text-red-600 text-[11px] font-extrabold uppercase">
            <Flame className="w-3.5 h-3.5 fill-red-600" /> Diskon 50% Hari Ini
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[17px] sm:text-[19px] font-black text-gray-900 leading-tight">
              Rp 99.000
            </span>
            <span className="text-xs text-gray-400 line-through">
              Rp 199.000
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onCtaClick}
          className="bg-[#00A344] hover:bg-[#008f3c] active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <span>Pesan Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
