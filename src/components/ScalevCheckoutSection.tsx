import React, { useEffect, useRef, useState } from 'react';
import {
  Lock,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Gift,
  Clock,
  Sparkles,
  Loader2
} from 'lucide-react';

export const ScalevCheckoutSection: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(750);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      // Scalev sends messages from this origin
      if (
        e.origin === 'https://pria-seratus-persen.myscalev.com' ||
        e.origin.includes('myscalev.com') ||
        e.origin.includes('scalev.id') ||
        e.origin.includes('scalev.com')
      ) {
        // 1. Redirect if data is a valid URL
        if (typeof e.data === 'string') {
          try {
            const parsedUrl = new URL(e.data);
            if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
              window.location.href = e.data;
              return;
            }
          } catch (_) {
            // not a direct URL string
          }

          // 2. Parse JSON message for height resize
          try {
            const message = JSON.parse(e.data);
            if (message && message.type === 'resize' && typeof message.height === 'number') {
              setIframeHeight(Math.max(message.height + 20, 500));
              setIsLoading(false);
            }
          } catch (_) {
            // not json
          }
        }
      }
    };

    window.addEventListener('message', handleMessage, false);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <section id="order-section" className="w-full py-8 px-3.5 sm:px-5 bg-gradient-to-b from-neutral-50 via-white to-neutral-100 scroll-mt-4">
      <div className="max-w-[540px] mx-auto space-y-4">
        
        {/* Premium Header Ribbon */}
        <div className="bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white rounded-2xl p-5 shadow-xl border border-neutral-800 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-red-600/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-neutral-950 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2.5 shadow-md">
            <Zap className="w-3.5 h-3.5 fill-current" /> FORMULIR PEMESANAN RESMI
          </div>

          <h2 className="text-[20px] sm:text-[23px] font-black leading-tight text-white">
            Selesaikan Pemesanan Ebook Lo di Bawah Ini
          </h2>
          
          <p className="text-neutral-300 text-xs sm:text-[13px] mt-1 font-normal flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Akses otomatis dikirim langsung ke WhatsApp &amp; Email lo
          </p>
        </div>

        {/* Order Value & Special Bonus Highlights */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Paket yang Lo Dapatkan:</span>
            <span className="bg-red-50 text-red-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-red-200">
              Promo Rp 99.000
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-start text-sm">
              <span className="font-bold text-gray-900 leading-snug">Ebook "Kuasai Pikirannya, Trigger Gairahnya"</span>
              <span className="font-black text-red-600 text-base">Rp 99.000</span>
            </div>

            <div className="bg-amber-50/70 rounded-xl p-3 space-y-1.5 text-xs text-amber-950 border border-amber-200/70">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                <Gift className="w-4 h-4 text-amber-600" /> <span>Termasuk 3 Bonus Spesial Gratis (Senilai Rp 299.000):</span>
              </div>
              <ul className="space-y-1 pl-5 list-disc text-gray-700 text-[11.5px]">
                <li>Cheatsheet Mindset Pria Dominan</li>
                <li>25+ Script Chat Pemicu Emosi &amp; Ketertarikan</li>
                <li>Checklist Evaluasi Sinyal Cewek</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Seamless Scalev Iframe Embed Container */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-md overflow-hidden relative transition-all">
          {/* Top Bar for the form */}
          <div className="bg-neutral-900 px-4 py-2.5 flex items-center justify-between border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-gray-200">Sistem Checkout Otomatis Scalev</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-400">
              <Lock className="w-3 h-3 text-emerald-400" /> 256-Bit SSL Secured
            </div>
          </div>

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="py-16 px-6 flex flex-col items-center justify-center text-center space-y-3 bg-white">
              <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
              <div>
                <p className="text-sm font-bold text-gray-800">Memuat Formulir Checkout...</p>
                <p className="text-xs text-gray-400 mt-0.5">Menghubungkan ke sistem pembayaran aman Scalev</p>
              </div>
            </div>
          )}

          {/* Real Scalev Iframe */}
          <iframe
            id="myiframe"
            ref={iframeRef}
            src="https://pria-seratus-persen.myscalev.com/landing-page-baru"
            width="100%"
            frameBorder="0"
            scrolling="no"
            title="Formulir Pemesanan Scalev"
            onLoad={() => setIsLoading(false)}
            style={{
              height: `${iframeHeight}px`,
              minHeight: '520px',
              border: 'none',
              display: 'block',
              width: '100%',
              transition: 'height 0.25s ease-out',
            }}
          />
        </div>

        {/* Security & Verification Guarantees */}
        <div className="flex items-center justify-center gap-4 text-[11.5px] text-gray-500 pt-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Transaksi 100% Aman
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-blue-600" /> Verifikasi Otomatis
          </span>
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-gray-600" /> Privasi Terjaga
          </span>
        </div>
      </div>
    </section>
  );
};
