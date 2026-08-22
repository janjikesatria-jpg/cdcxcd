import React, { useState, useEffect } from 'react';
import { ArrowRight, Flame } from 'lucide-react';

interface PromoCountdownSectionProps {
  onCtaClick?: () => void;
}

export const PromoCountdownSection: React.FC<PromoCountdownSectionProps> = ({ onCtaClick }) => {
  // Compute promo date range (e.g. today till +2 days or current monthly cycle)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 11,
    minutes: 43,
    seconds: 58,
  });

  const [promoDateText, setPromoDateText] = useState('20 - 25 Bulan Ini');

  useEffect(() => {
    // Set dynamic promo period date
    const now = new Date();
    const startDay = Math.max(1, now.getDate() - 1);
    const endDay = Math.min(31, now.getDate() + 2);
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const monthName = monthNames[now.getMonth()];
    setPromoDateText(`${startDay} - ${endDay} ${monthName} ${now.getFullYear()}`);

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return { days: 0, hours: 14, minutes: 30, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const format2 = (n: number) => String(n).padStart(2, '0');

  return (
    <section className="w-full py-5 px-4 text-center">
      <div className="max-w-[540px] mx-auto space-y-4">
        {/* Promo Header Title & Badge */}
        <div className="space-y-1">
          <h3 className="text-[20px] sm:text-[23px] font-extrabold text-[#111111] uppercase tracking-tight">
            Penawaran Spesial
          </h3>
          <div className="inline-flex items-center gap-1.5 bg-[#E60000] text-white px-3.5 py-1 rounded-full text-xs sm:text-sm font-black tracking-wider uppercase shadow-sm">
            <span>PROMO TERBATAS</span>
            <span>🔥</span>
          </div>
          <div className="text-xl text-gray-500 font-bold">↓</div>
        </div>

        {/* Promo Stack Graphic Image */}
        <div className="pt-1 flex justify-center">
          <div className="w-full max-w-[440px] overflow-hidden rounded-2xl shadow-xl border border-gray-200/90 bg-white">
            <img
              src="https://cdn.scalev.id/business_files/G9OHpJO4ubVsnL44vOzgWlk0/1761056230446-rt.webp"
              alt="Promo Paket Hemat Ebook PDKT"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Red Countdown Timer Box (Exact CSS replication) */}
        <div className="flex justify-center w-full pt-2">
          <div className="w-full max-w-[520px] bg-[#EE0000] text-white rounded-2xl p-4 text-center shadow-xl border border-red-400/40">
            <div className="font-bold text-xs sm:text-sm tracking-wide mb-2.5 opacity-95">
              Periode Promo: {promoDateText}
            </div>
            
            <div className="flex items-center justify-center gap-2 sm:gap-2.5">
              {/* Unit Hari */}
              <div className="w-[58px] sm:w-[64px] aspect-square flex flex-col items-center justify-center p-1.5 bg-gradient-to-b from-white/25 to-white/10 border border-white/35 rounded-xl shadow-inner">
                <div className="text-[22px] sm:text-[25px] font-black leading-none tracking-tight">
                  {format2(timeLeft.days)}
                </div>
                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider opacity-90 mt-1">
                  Hari
                </div>
              </div>

              <div className="text-lg sm:text-xl font-bold opacity-60">:</div>

              {/* Unit Jam */}
              <div className="w-[58px] sm:w-[64px] aspect-square flex flex-col items-center justify-center p-1.5 bg-gradient-to-b from-white/25 to-white/10 border border-white/35 rounded-xl shadow-inner">
                <div className="text-[22px] sm:text-[25px] font-black leading-none tracking-tight">
                  {format2(timeLeft.hours)}
                </div>
                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider opacity-90 mt-1">
                  Jam
                </div>
              </div>

              <div className="text-lg sm:text-xl font-bold opacity-60">:</div>

              {/* Unit Menit */}
              <div className="w-[58px] sm:w-[64px] aspect-square flex flex-col items-center justify-center p-1.5 bg-gradient-to-b from-white/25 to-white/10 border border-white/35 rounded-xl shadow-inner">
                <div className="text-[22px] sm:text-[25px] font-black leading-none tracking-tight">
                  {format2(timeLeft.minutes)}
                </div>
                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider opacity-90 mt-1">
                  Menit
                </div>
              </div>

              <div className="text-lg sm:text-xl font-bold opacity-60">:</div>

              {/* Unit Detik */}
              <div className="w-[58px] sm:w-[64px] aspect-square flex flex-col items-center justify-center p-1.5 bg-gradient-to-b from-white/25 to-white/10 border border-white/35 rounded-xl shadow-inner">
                <div className="text-[22px] sm:text-[25px] font-black leading-none tracking-tight text-yellow-200">
                  {format2(timeLeft.seconds)}
                </div>
                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider opacity-90 mt-1 text-yellow-200">
                  Detik
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Urgency Subtext */}
        <div className="text-[14px] sm:text-[15px] text-gray-800 leading-snug pt-1">
          <p>
            Harga akan kembali normal <strong className="text-red-600 font-extrabold">SELAMANYA</strong>
          </p>
          <p>setelah promo berakhir!</p>
        </div>

        {/* Action Button */}
        {onCtaClick && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onCtaClick}
              className="w-full bg-[#00A344] hover:bg-[#008f3c] active:scale-[0.99] text-white font-black text-[16px] sm:text-[17px] py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" />
              <span>Klaim Promo Diskon Sekarang!</span>
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="w-full pt-3">
          <hr className="border-t border-gray-200" />
        </div>
      </div>
    </section>
  );
};
