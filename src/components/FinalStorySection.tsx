import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface FinalStorySectionProps {
  onCtaClick: () => void;
}

export const FinalStorySection: React.FC<FinalStorySectionProps> = ({ onCtaClick }) => {
  return (
    <section className="w-full py-5 px-4">
      <div className="max-w-[540px] mx-auto space-y-4">
        {/* Story Box */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-sm space-y-3.5 text-[15px] sm:text-[16px] text-gray-800 leading-relaxed">
          <p className="font-bold text-[17px] text-gray-900">
            😔 Bayangin…
          </p>

          <p>
            <span className="text-[#E60000] font-semibold">
              Lo coba deketin cewek yang lo suka.
            </span><br />
            Lo chat dia, lo ajak ngobrol dia, lo coba bikin dia suka sama lo.
          </p>

          <p>
            Tapi ujung-ujungnya dia cuma ngasih respon{' '}
            <span className="text-[#E60000] font-semibold">
              dingin... kayak lo gak pernah dianggap ada 💔
            </span>
          </p>

          <p>
            Ebook <strong>Cara Memikat Wanita Tanpa Mengejar</strong> ini bukan tentang rayuan murahan, tapi panduan rahasia buat{' '}
            <span className="text-[#E60000] font-bold">mainin psikologis cewek.</span>
          </p>

          <p>
            Biar mereka yang ngerasa <u>penasaran</u>, <u>nyaman</u>, dan mulai{' '}
            <u className="font-semibold text-red-600">ngejar lo duluan 🔥</u>
          </p>

          <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl">
            <p className="text-gray-900 font-medium">
              Investasi <strong className="text-red-600 font-extrabold text-[17px]">Rp 99.000</strong> ini gak ada artinya dibanding rasa nyesek tiap kali lo liat cewek yang lo suka malah jalan sama cowok lain.
            </p>
            <p className="text-[#E60000] font-bold text-[15px] pt-1">
              Cuma karena lo belum tau caranya.
            </p>
          </div>
        </div>

        {/* Big Final Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onCtaClick}
            className="w-full bg-[#00A344] hover:bg-[#008f3c] active:scale-[0.99] text-white font-black text-[17px] sm:text-[18px] py-4 px-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer animate-pulse hover:animate-none"
          >
            <ArrowRight className="w-6 h-6" />
            <span>Dapatkan Ebooknya Sekarang!</span>
          </button>
        </div>

        {/* Security & Instant Delivery Badges */}
        <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-gray-500 font-medium pt-2">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>Akses Instant 24 Jam</span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Format PDF Mudah Dibaca</span>
          </div>
        </div>
      </div>
    </section>
  );
};
