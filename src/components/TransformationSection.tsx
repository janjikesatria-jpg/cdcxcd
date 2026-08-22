import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface TransformationSectionProps {
  onCtaClick: () => void;
}

export const TransformationSection: React.FC<TransformationSectionProps> = ({ onCtaClick }) => {
  const benefits = [
    'Cewek kepikiran lo tanpa sadar',
    'Mulai nyari alasan buat deket sama lo',
    'Dan pelan-pelan… ngejar lo duluan',
  ];

  return (
    <section className="w-full py-4 px-4">
      <div className="max-w-[540px] mx-auto space-y-4">
        {/* Heading */}
        <div className="text-[17px] sm:text-[19px] text-[#111111] leading-snug">
          <p className="font-normal text-gray-800">Mulai Sekarang, Posisi Lo di Mata Cewek</p>
          <p className="font-extrabold text-[#111111] text-[20px] sm:text-[22px]">
            Akan Berubah Total 🔥
          </p>
        </div>

        {/* Benefits List */}
        <div className="space-y-3 pt-1">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-3 text-left">
              <CheckCircle2 className="w-5 h-5 text-[#00A344] fill-[#00A344]/15 shrink-0 mt-0.5" />
              <span className="text-[15px] sm:text-[16px] text-gray-800 font-medium leading-tight">
                {benefit}
              </span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-3">
          <button
            type="button"
            onClick={onCtaClick}
            className="w-full bg-[#00A344] hover:bg-[#008f3c] active:scale-[0.99] text-white font-bold text-[16px] sm:text-[17px] py-3.5 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
            <span>Dapatkan Ebooknya Sekarang!</span>
          </button>
        </div>
      </div>
    </section>
  );
};
