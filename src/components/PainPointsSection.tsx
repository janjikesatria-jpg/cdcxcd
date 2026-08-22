import React from 'react';
import { XCircle } from 'lucide-react';

export const PainPointsSection: React.FC = () => {
  const painPoints = [
    'Lo sering di ghosting cewek?',
    'Dia cuek, dia milih cowok lain?',
    'Cewek gak pernah milih lo?',
  ];

  return (
    <section className="w-full py-5 px-4">
      <div className="max-w-[540px] mx-auto space-y-4">
        {/* Pain Image */}
        <div className="overflow-hidden rounded-xl shadow-md border border-gray-200/80 bg-white">
          <img
            src="https://cdn.scalev.id/uploads/1769762181/pN5UP5IgKiTYmUgjwg1RoA/1769762181131-yyu.webp"
            alt="Ilustrasi Galau Deketin Cewek"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>

        {/* Heading */}
        <div className="pt-2">
          <h2 className="text-[19px] sm:text-[21px] font-extrabold text-[#111111] flex items-center gap-1.5">
            <span>💔 Lo Mau Deketin Cewek, Tapi…</span>
          </h2>
        </div>

        {/* Pain Points List */}
        <div className="space-y-2.5">
          {painPoints.map((point, idx) => (
            <div key={idx} className="flex items-center gap-3 text-left">
              <XCircle className="w-5 h-5 text-[#DF0E03] fill-[#DF0E03]/15 shrink-0" />
              <span className="text-[15px] sm:text-[16px] text-gray-800 font-medium">
                {point}
              </span>
            </div>
          ))}
        </div>

        {/* Story / Contrast Paragraph */}
        <div className="text-[15px] sm:text-[16px] text-gray-800 leading-relaxed space-y-3 pt-3 bg-white/60 p-4 rounded-xl border border-gray-200/70">
          <p>Sementara di luar sana...</p>
          <p>Ada cowok biasa aja, gak ganteng, gak kaya.</p>
          <p>
            Tapi anehnya...<br />
            Cewek-cewek malah <u className="decoration-red-500 font-semibold">ngantri deketin dia</u>.
          </p>
          <p>
            Rahasianya?<br />
            Bukan di wajah. Bukan di duit.
          </p>
          <p>
            Tapi di cara dia...<br />
            <strong className="text-[#111111] text-[16px] sm:text-[17px] font-extrabold text-red-600">
              Mainin Psikologi Wanita 🎯
            </strong>
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
