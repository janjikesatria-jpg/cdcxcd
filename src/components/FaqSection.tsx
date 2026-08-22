import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';

interface FaqSectionProps {
  onCtaClick?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onCtaClick }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Dalam format apa ebook ini dikirimkan?',
      a: 'Ebook dalam format digital (PDF) berkualitas tinggi yang sangat nyaman dibaca di smartphone (Android/iPhone), laptop, maupun tablet kapan saja.',
    },
    {
      q: 'Kapan dan bagaimana saya menerima ebooknya?',
      a: 'Akses instan 24 jam! Begitu pembayaran Anda terverifikasi (otomatis via QRIS / Bank Transfer), link download akan langsung tampil di layar konfirmasi dan otomatis dikirimkan ke WhatsApp & Email Anda.',
    },
    {
      q: 'Apakah cara ini cocok untuk pria yang pemalu / susah ngobrol?',
      a: 'Sangat cocok! Ebook ini dirancang khusus dengan langkah-langkah psikologis bertahap dan contoh kata-kata konkret, sehingga lo gak perlu bingung mau ngetik apa pas chat atau ngobrol langsung.',
    },
    {
      q: 'Bagaimana jika saya masih belum paham isi materinya?',
      a: 'Materi ditulis dengan bahasa yang santai, lugas, tanpa basa-basi teori rumit, dan dilengkapi dengan contoh kasus nyata yang langsung bisa lo praktekkan hari ini juga.',
    },
  ];

  return (
    <section className="w-full py-5 px-4">
      <div className="max-w-[540px] mx-auto space-y-4">
        {/* Heading */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1 text-red-600 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" /> FAQ
          </div>
          <h3 className="text-[19px] sm:text-[21px] font-extrabold text-[#111111]">
            Pertanyaan Yang Sering Diajukan
          </h3>
        </div>

        {/* Accordions */}
        <div className="space-y-2.5 pt-1">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 font-semibold text-[15px] sm:text-[16px] text-gray-900 cursor-pointer hover:bg-gray-50"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-red-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-[14px] sm:text-[15px] text-gray-700 leading-relaxed border-t border-gray-100 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        {onCtaClick && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onCtaClick}
              className="w-full bg-[#00A344] hover:bg-[#008f3c] active:scale-[0.99] text-white font-extrabold text-[16px] sm:text-[17px] py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" />
              <span>Dapatkan Ebooknya Sekarang!</span>
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
