import React from 'react';
import { ShieldCheck, Mail, Instagram } from 'lucide-react';

export const FooterSection: React.FC = () => {
  return (
    <footer className="w-full bg-[#1e2329] text-gray-400 py-8 px-4 text-center text-xs sm:text-sm border-t border-gray-800 space-y-4">
      <div className="max-w-[540px] mx-auto space-y-3">
        <div className="text-white font-extrabold text-base tracking-wider uppercase">
          AHLI PDKT OFFICIAL
        </div>
        <p className="text-gray-400 text-xs leading-relaxed max-w-[440px] mx-auto">
          Program edukasi dan blueprint psikologi komunikasi modern pria untuk meningkatkan daya tarik natural dalam hubungan dan percakapan.
        </p>

        <div className="flex items-center justify-center gap-4 text-xs text-gray-300 pt-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-green-400" /> Transaksi 100% Aman
          </span>
          <span className="flex items-center gap-1">
            <Mail className="w-4 h-4 text-blue-400" /> info@infopdkt.id
          </span>
        </div>

        <div className="text-[11px] text-gray-500 pt-2 border-t border-gray-800/80 space-y-1">
          <p>© {new Date().getFullYear()} Ahli PDKT (Cara Memikat Wanita Tanpa Mengejar). All rights reserved.</p>
          <p className="text-[10px] text-gray-600">
            Disclaimer: Hasil setiap individu dapat bervariasi tergantung pada dedikasi dan praktek masing-masing.
          </p>
        </div>
      </div>
    </footer>
  );
};
