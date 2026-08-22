import React from 'react';

interface HeroSectionProps {
  onCtaClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  return (
    <section className="w-full pt-6 pb-4 px-4 text-center">
      <div className="max-w-[540px] mx-auto space-y-3">
        {/* Main Headline */}
        <div className="space-y-1">
          <h1 className="text-[22px] sm:text-[26px] md:text-[28px] font-extrabold text-[#111111] leading-snug tracking-tight">
            Lo Capek Ngejar Cewek
          </h1>
          <h2 className="text-[22px] sm:text-[26px] md:text-[28px] font-extrabold text-[#111111] leading-snug tracking-tight">
            Tapi Ujungnya Dia Pilih Cowok Lain?
          </h2>
        </div>

        {/* Down Arrow */}
        <div className="text-xl sm:text-2xl text-[#333333] font-bold py-0.5 animate-bounce">
          ⇣
        </div>

        {/* Subtitle / Hook */}
        <div className="text-[15px] sm:text-[16px] text-[#333333] font-medium leading-relaxed">
          <p>Temukan Rahasia Psikologis Yang Bikin</p>
          <p>
            Cewek{' '}
            <span className="text-[#E60000] font-bold">
              Tertarik &amp; Deketin Lo Duluan! 😎
            </span>
          </p>
        </div>

        {/* Hero Image */}
        <div className="pt-2">
          <div className="overflow-hidden rounded-xl shadow-md border border-gray-200/80 bg-white">
            <img
              src="https://cdn.scalev.id/business_files/1AOdcfjyl4bEj-e5yq7Z0A9N/1760783891787-IMG_20251018_173641.webp"
              alt="Bukti Chat PDKT Berhasil"
              className="w-full h-auto object-cover"
              loading="eager"
            />
          </div>
        </div>

        {/* Caption */}
        <p className="text-[13px] sm:text-[14px] text-gray-700 italic font-medium pt-1">
          &ldquo;Dulu dingin, sekarang nyariin lo duluan❤️&rdquo;
        </p>

        {/* Divider */}
        <div className="w-full pt-4">
          <hr className="border-t border-gray-200" />
        </div>
      </div>
    </section>
  );
};
