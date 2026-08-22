import React from 'react';
import { CheckBadgeIcon } from './CheckBadgeIcon';

export const ModulesSection: React.FC = () => {
  const modules = [
    {
      title: 'Formula Gelombang Emosional',
      description: 'Rahasia psikologi yang bikin cewek terobsesi sama lo tanpa sadar.',
    },
    {
      title: 'Teknik Online & Offline',
      description: 'Bikin lo menarik di chat dan pas ketemu langsung.',
    },
    {
      title: 'Mindset High Value Male',
      description: 'Biar lo gak lagi takut ditolak, karena sekarang lo yang punya kendali.',
    },
    {
      title: 'Blueprint Aura Tenang',
      description: 'Bikin cewek ngerasa nyaman, penasaran, dan susah lupain lo.',
    },
    {
      title: 'Program 7 Hari Aktivasi Daya Tarik',
      description: 'Ritual harian buat ubah energi lo jadi magnet yang memikat cewek.',
    },
  ];

  return (
    <section className="w-full py-5 px-4">
      <div className="max-w-[540px] mx-auto space-y-5">
        {/* Section Heading */}
        <div className="text-center space-y-1">
          <h3 className="text-[18px] sm:text-[20px] font-bold text-[#333333] leading-snug">
            Kenapa Ebook ini Pilihan Terbaik?
          </h3>
          <p className="text-[17px] sm:text-[19px] font-bold text-[#111111]">
            Ini yang Akan Lo Dapatkan ↓
          </p>
        </div>

        {/* Modules List */}
        <div className="space-y-4 pt-1">
          {modules.map((mod, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl border border-gray-200/90 shadow-sm flex items-start gap-3.5 hover:border-green-500/50 transition-colors"
            >
              <div className="shrink-0 mt-0.5">
                <CheckBadgeIcon className="w-6 h-6 text-[#00A344]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[16px] font-bold text-[#111111] leading-tight">
                  {mod.title}
                </h4>
                <p className="text-[14px] sm:text-[15px] text-gray-700 leading-relaxed font-normal">
                  {mod.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full pt-4">
          <hr className="border-t border-gray-200" />
        </div>
      </div>
    </section>
  );
};
