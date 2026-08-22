import React from 'react';

export const MindsetSection: React.FC = () => {
  return (
    <section className="w-full py-4 px-4">
      <div className="max-w-[540px] mx-auto space-y-4">
        {/* Mindset Box */}
        <div className="bg-white border-l-4 border-red-600 p-5 rounded-r-2xl shadow-sm border-y border-r border-gray-200/80 space-y-3">
          <p className="text-[16px] text-gray-800 leading-relaxed">
            😔 Kalau selama ini lo capek...<br />
            udah usaha, udah baik, tapi cewek tetep gak milih lo.
          </p>
          <p className="text-[16px] text-gray-800 leading-relaxed font-medium">
            Mungkin bukan usaha lo yang kurang.<br />
            <span className="text-red-600 font-extrabold">Tapi cara lo yang salah.</span>
          </p>
          <div className="pt-1">
            <p className="text-[16px] text-gray-900 font-bold">
              Jangan lewatin kesempatan ini ⚠️<br />
              Saatnya <span className="text-red-600 font-extrabold text-[17px]">Ganti Cara Main Lo!</span>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full pt-3">
          <hr className="border-t border-gray-200" />
        </div>
      </div>
    </section>
  );
};
