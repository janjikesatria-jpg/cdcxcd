import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

export const ScalevCheckoutSection: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(750);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Forward UTM params and fbclid from parent window into iframe URL if available
    if (typeof window !== 'undefined' && iframeRef.current) {
      try {
        const currentSearch = window.location.search;
        if (currentSearch) {
          const baseUrl = 'https://pria-seratus-persen.myscalev.com/landing-page-baru';
          iframeRef.current.src = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${currentSearch.replace(/^\?/, '')}`;
        }
      } catch (err) {
        console.error('Error forwarding query params:', err);
      }
    }

    const handleMessage = (e: MessageEvent) => {
      // Check origin
      const isScalevOrigin =
        e.origin === 'https://pria-seratus-persen.myscalev.com' ||
        e.origin.includes('myscalev.com') ||
        e.origin.includes('scalev.id') ||
        e.origin.includes('scalev.com');

      if (!isScalevOrigin && typeof e.data !== 'string' && typeof e.data !== 'object') {
        return;
      }

      const fbqTrack = (eventName: string, params?: Record<string, unknown>) => {
        if (typeof window !== 'undefined' && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
          try {
            (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', eventName, params || {});
          } catch (err) {
            console.error('Meta Pixel track error:', err);
          }
        }
      };

      // 1. Handle String data
      if (typeof e.data === 'string') {
        // Redirect if data is a valid URL
        try {
          const parsedUrl = new URL(e.data);
          if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
            // Track Purchase before redirecting
            fbqTrack('Purchase', {
              value: 99000,
              currency: 'IDR',
              content_name: 'Ebook Kuasai Pikirannya, Trigger Gairahnya',
            });
            window.location.href = e.data;
            return;
          }
        } catch (_) {
          // not a direct URL string
        }

        // Parse JSON message
        try {
          const msg = JSON.parse(e.data);
          processScalevMessage(msg);
        } catch (_) {
          // not json
        }
      } else if (typeof e.data === 'object' && e.data !== null) {
        // Handle Object data directly
        processScalevMessage(e.data);
      }

      function processScalevMessage(message: any) {
        if (!message) return;

        // Auto-resize
        if (message.type === 'resize' && typeof message.height === 'number') {
          setIframeHeight(Math.max(message.height + 20, 500));
          setIsLoading(false);
        }

        // Scalev Event Dispatches (e.g. InitiateCheckout, AddToCart, Purchase, Lead)
        if (message.event || message.type === 'scalev_event' || message.type === 'event') {
          const evt = message.event || message.eventName || message.name;
          const params = message.params || message.data || {
            value: 99000,
            currency: 'IDR',
            content_name: 'Ebook Kuasai Pikirannya, Trigger Gairahnya',
          };

          if (evt) {
            fbqTrack(evt, params);
          }
        }

        // Handle Scalev order created / submitted
        if (message.type === 'order_created' || message.action === 'checkout_completed') {
          fbqTrack('Purchase', {
            value: 99000,
            currency: 'IDR',
            content_name: 'Ebook Kuasai Pikirannya, Trigger Gairahnya',
          });
        }
      }
    };

    window.addEventListener('message', handleMessage, false);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <section id="order-section" className="w-full py-4 px-2 sm:px-4 scroll-mt-4">
      <div className="max-w-[540px] mx-auto">
        {/* Pure Form Iframe Container */}
        <div className="w-full overflow-hidden relative">
          {/* Loading Skeleton */}
          {isLoading && (
            <div className="py-16 px-6 flex flex-col items-center justify-center text-center space-y-3 bg-white rounded-xl border border-gray-100">
              <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
              <p className="text-sm font-medium text-gray-600">Memuat formulir pemesanan...</p>
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
            title="Formulir Pemesanan"
            onLoad={() => setIsLoading(false)}
            style={{
              height: `${iframeHeight}px`,
              minHeight: '480px',
              border: 'none',
              display: 'block',
              width: '100%',
              transition: 'height 0.2s ease-out',
            }}
          />
        </div>
      </div>
    </section>
  );
};
