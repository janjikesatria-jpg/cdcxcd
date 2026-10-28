import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Lock, Sparkles } from 'lucide-react';

export const ScalevCheckoutSection: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(680);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const resizeIframe = (height: number) => {
      setIframeHeight(height);
      if (iframe) {
        iframe.style.height = `${height}px`;
      }
    };

    const isUrl = (string: unknown) => {
      if (typeof string !== 'string') return false;
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    };

    const isJSONObject = (string: unknown) => {
      if (typeof string !== 'string') return false;
      try {
        const parsed = JSON.parse(string);
        return typeof parsed === 'object' && parsed !== null;
      } catch (e) {
        return false;
      }
    };

    const isIframeSameOrigin = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        return Boolean(doc);
      } catch (e) {
        return false;
      }
    };

    const handleMessage = (e: MessageEvent) => {
      if (e.origin === 'https://pria-seratus-persen.myscalev.com') {
        if (isUrl(e.data)) {
          window.location.href = e.data;
        }
        if (isJSONObject(e.data) && !isIframeSameOrigin()) {
          const message = JSON.parse(e.data);
          if (message.type === 'resize' && message.height) {
            resizeIframe(Number(message.height));
            setIsLoading(false);
          }
        }
      }
    };

    window.addEventListener('message', handleMessage, false);

    let observer: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (iframe && iframe.src) {
              iframe.src = iframe.src;
            }
            observer?.disconnect();
          }
        });
      });
      observer.observe(iframe);
    }

    return () => {
      window.removeEventListener('message', handleMessage, false);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <section id="order-section" className="w-full py-6 px-3 sm:px-4 bg-[#F7F8FA] scroll-mt-4">
      <div className="w-full max-w-[540px] mx-auto space-y-4">
        {/* Header Title */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 text-[11px] font-extrabold uppercase px-3 py-1 rounded-full border border-red-200">
            <Sparkles className="w-3.5 h-3.5 text-red-600" /> Formulir Pemesanan Resmi
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
            Amankan Akses Ebook &amp; 3 Bonus Lo
          </h2>
          <p className="text-xs text-gray-500 max-w-[420px] mx-auto">
            Silakan lengkapi formulir di bawah ini untuk menyelesaikan pembayaran dan mendapatkan akses instan.
          </p>
        </div>

        {/* Scalev Iframe Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden relative min-h-[500px]">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10 space-y-2">
              <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-gray-600">Memuat formulir pemesanan Scalev...</p>
            </div>
          )}

          <iframe
            id="myiframe"
            ref={iframeRef}
            src="https://pria-seratus-persen.myscalev.com/landing-page-baru"
            width="100%"
            style={{
              height: `${iframeHeight}px`,
              border: 0,
              minHeight: '520px',
              display: 'block',
              transition: 'height 0.2s ease',
            }}
            title="Formulir Checkout Scalev"
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pt-1">
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-emerald-500" /> Transaksi Enkripsi 256-bit
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Garansi Akses Instan
          </span>
        </div>
      </div>
    </section>
  );
};
