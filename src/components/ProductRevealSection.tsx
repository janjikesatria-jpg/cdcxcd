import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ProductRevealSectionProps {
  onCtaClick: () => void;
}

export const ProductRevealSection: React.FC<ProductRevealSectionProps> = ({ onCtaClick }) => {
  return (
    <section className="w-full py-5 px-4 text-center">
      <div className="max-w-[540px] mx-auto space-y-4">
        {/* Lead Intro */}
        <p className="text-[17px] text-gray-700 font-medium tracking-wide">
          Kenalin...
        </p>

        {/* Big Red Title */}
        <div className="space-y-0.5">
          <h2 className="text-[26px] sm:text-[30px] font-black text-[#E60000] tracking-tight uppercase leading-tight">
            Cara Memikat Wanita
          </h2>
          <h3 className="text-[32px] sm:text-[38px] font-black text-[#E60000] tracking-tight uppercase leading-none">
            Tanpa Mengejar
          </h3>
        </div>

        {/* Down Arrow */}
        <div className="text-xl text-gray-600 font-bold">⇣</div>

        {/* Yellow Highlight Badge */}
        <div>
          <span className="inline-block bg-[#FFFF00] text-[#222222] text-[13px] sm:text-[14px] font-semibold italic px-3.5 py-1 rounded shadow-sm border border-yellow-400/40">
            Seni Bikin Cewek Terobsesi Tanpa Sadar
          </span>
        </div>

        {/* Ebook Cover Mockup */}
        <div className="pt-2 flex justify-center">
          <div className="w-full max-w-[400px] overflow-hidden rounded-2xl shadow-xl border border-gray-200/90 bg-white">
            <img
              src="https://cdn.scalev.id/uploads/1769770531/9C8PwWpivz5zBb0y9dsHVw/1769770531487-ERE.webp"
              alt="Ebook Cara Memikat Wanita Tanpa Mengejar - E-Book Mockup"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Core Value Proposition */}
        <div className="pt-2 px-2">
          <p className="text-[15px] sm:text-[16px] text-gray-800 leading-relaxed font-normal">
            Blueprint <strong className="text-black font-extrabold">PSIKOLOGIS</strong> yang bantu lo ngerti cara mikir cewek, biar lo gak lagi ngejar. Tapi mereka yang ngejar lo duluan.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onCtaClick}
            className="w-full bg-[#00A344] hover:bg-[#008f3c] active:scale-[0.99] text-white font-bold text-[16px] sm:text-[17px] py-3.5 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
            <span>Dapatkan Ebooknya Sekarang!</span>
          </button>
        </div>

        {/* Divider */}
        <div className="w-full pt-4">
          <hr className="border-t border-gray-200" />
        </div>
      </div>
    </section>
  );
};
