import React from 'react';
import { Gift, Sparkles, CheckCircle2 } from 'lucide-react';

export const BonusesSection: React.FC = () => {
  const bonuses = [
    {
      title: '🎁 Bonus 1: Killer Opening Blueprint',
      value: 'Rp 199.000',
      description: 'Cara mulai kenalan yang bikin cewek tertarik, tanpa lo keliatan butuh.',
    },
    {
      title: '🎁 Bonus 2: Anti-Ilfeel System',
      value: 'Rp 149.000',
      description: 'Biar lo gak bikin cewek ilfeel dan tetap keliatan menarik di matanya.',
    },
    {
      title: '🎁 Bonus 3: Commitment Trigger Playbook',
      value: 'Rp 119.000',
      description: 'Bikin cewek makin terikat secara emosional sampai takut kehilangan lo.',
    },
  ];

  return (
    <section className="w-full py-5 px-4">
      <div className="max-w-[540px] mx-auto space-y-4">
        {/* Section Heading */}
        <div className="text-center space-y-2 bg-gradient-to-r from-red-600 to-rose-600 text-white p-4 rounded-2xl shadow-md">
          <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5" /> Khusus Pembeli Hari Ini
          </div>
          <h3 className="text-[17px] sm:text-[19px] font-extrabold leading-snug">
            Kabar baik! Khusus lo yang membeli HARI INI akan dapat bonus Spesial..
          </h3>
        </div>

        {/* Bonus Stack Graphic Mockup */}
        <div className="pt-1">
          <div className="overflow-hidden rounded-2xl shadow-lg border border-red-200/90 bg-white">
            <img
              src="https://cdn.scalev.id/uploads/1771747760/fFnZedvPzhgU3W4VL4QDdA/1771747759141-feefe.webp"
              alt="Bonus Eksklusif Ebook CMW"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Bonus Items Breakdown */}
        <div className="space-y-3.5 pt-2">
          {bonuses.map((bonus, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl border border-red-200/80 shadow-xs space-y-1.5 relative overflow-hidden"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4 className="text-[15px] sm:text-[16px] font-extrabold text-[#111111] flex items-center gap-1.5">
                  <span>{bonus.title}</span>
                </h4>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-gray-400 line-through">
                    {bonus.value}
                  </span>
                  <span className="text-[11px] font-black text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    GRATIS
                  </span>
                </div>
              </div>
              <p className="text-[14px] text-gray-700 leading-relaxed font-normal">
                {bonus.description}
              </p>
            </div>
          ))}
        </div>

        {/* Total Bonus Callout */}
        <div className="bg-amber-50 border border-amber-300/80 rounded-xl p-3.5 text-center text-amber-950 space-y-1">
          <p className="text-xs font-semibold text-amber-800">
            TOTAL NILAI BONUS: <span className="line-through">Rp 467.000</span>
          </p>
          <p className="text-sm font-extrabold text-red-700 flex items-center justify-center gap-1">
            <Gift className="w-4 h-4 text-red-600" />
            100% GRATIS Masuk Dalam Paket Pembelianmu!
          </p>
        </div>

        {/* Divider */}
        <div className="w-full pt-4">
          <hr className="border-t border-gray-200" />
        </div>
      </div>
    </section>
  );
};
