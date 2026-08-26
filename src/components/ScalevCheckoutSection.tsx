import React, { useEffect, useRef } from 'react';

export const ScalevCheckoutSection: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    function resizeIframe(height: number) {
      if (iframe) {
        iframe.style.height = height + 'px';
      }
    }

    function isUrl(string: string) {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    }

    function isJSONObject(string: string) {
      try {
        const parsed = JSON.parse(string);
        return typeof parsed === 'object' && parsed !== null;
      } catch (e) {
        return false;
      }
    }

    function isIframeSameOrigin() {
      try {
        const doc = iframe?.contentDocument || iframe?.contentWindow?.document;
        return !!doc;
      } catch (e) {
        return false;
      }
    }

    const handleMessage = (e: MessageEvent) => {
      if (e.origin === 'https://pria-seratus-persen.myscalev.com') {
        if (typeof e.data === 'string' && isUrl(e.data)) {
          window.location.href = e.data;
        }
        if (typeof e.data === 'string' && isJSONObject(e.data) && !isIframeSameOrigin()) {
          const message = JSON.parse(e.data);
          if (message.type === 'resize' && typeof message.height === 'number') {
            resizeIframe(message.height);
          }
        }
      }
    };

    window.addEventListener('message', handleMessage, false);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (iframe) {
            iframe.src = iframe.src;
          }
          observer.disconnect();
        }
      });
    });

    observer.observe(iframe);

    return () => {
      window.removeEventListener('message', handleMessage);
      observer.disconnect();
    };
  }, []);

  return (
    <section id="order-section" className="w-full flex justify-center py-6 px-3 sm:px-4 scroll-mt-4">
      <div className="w-full max-w-[480px] mx-auto flex flex-col items-center">
        {/* CTA Heading & Subtext */}
        <div className="w-full text-center mb-4 space-y-1.5 px-2">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
            Isi Data Lo & Ambil Akses Ebook Sekarang!
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-normal">
            Lengkapi formulir pemesanan di bawah ini. Akses link download &amp; 3 bonus spesial langsung dikirim otomatis ke WhatsApp &amp; Email lo.
          </p>
        </div>

        <iframe
          id="myiframe"
          ref={iframeRef}
          width="100%"
          frameBorder="0"
          scrolling="no"
          src="https://pria-seratus-persen.myscalev.com/landing-page-baru"
          title="Scalev Form"
          style={{ minHeight: '500px', display: 'block', border: 'none', width: '100%' }}
        />
      </div>
    </section>
  );
};

