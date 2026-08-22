import React, { useState } from 'react';
import { TopNotification } from './components/TopNotification';
import { HeroSection } from './components/HeroSection';
import { TransformationSection } from './components/TransformationSection';
import { PainPointsSection } from './components/PainPointsSection';
import { ProductRevealSection } from './components/ProductRevealSection';
import { ModulesSection } from './components/ModulesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { BonusesSection } from './components/BonusesSection';
import { MindsetSection } from './components/MindsetSection';
import { PromoCountdownSection } from './components/PromoCountdownSection';
import { FinalStorySection } from './components/FinalStorySection';
import { FaqSection } from './components/FaqSection';
import { CustomCheckoutSection } from './components/CustomCheckoutSection';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { StickyBottomBar } from './components/StickyBottomBar';
import { FooterSection } from './components/FooterSection';
import { OrderData } from './types';

export default function App() {
  const [completedOrder, setCompletedOrder] = useState<OrderData | null>(null);

  const scrollToOrderSection = () => {
    if (typeof window !== 'undefined' && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', 'InitiateCheckout', {
        value: 99000,
        currency: 'IDR',
      });
    }
    const el = document.getElementById('order-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOrderSuccess = (order: OrderData) => {
    setCompletedOrder(order);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#222222] font-['Poppins',sans-serif] flex flex-col items-center">
      {/* Top Banner Notice */}
      <TopNotification />

      {/* Main Container - Single column mobile-first sales letter layout */}
      <main className="w-full max-w-[560px] bg-white shadow-sm flex flex-col flex-1 pb-16">
        {/* 1. Hero Section */}
        <HeroSection onCtaClick={scrollToOrderSection} />

        {/* 2. Transformation Section */}
        <TransformationSection onCtaClick={scrollToOrderSection} />

        {/* 3. Pain Points & Contrast Story */}
        <PainPointsSection />

        {/* 4. Product Reveal */}
        <ProductRevealSection onCtaClick={scrollToOrderSection} />

        {/* 5. Modules / What You Get */}
        <ModulesSection />

        {/* 6. Testimonials & Social Proof */}
        <TestimonialsSection />

        {/* 7. Special Bonus Package */}
        <BonusesSection />

        {/* 8. Mindset Reflection */}
        <MindsetSection />

        {/* 9. Promo Countdown Timer */}
        <PromoCountdownSection onCtaClick={scrollToOrderSection} />

        {/* 10. Final Reality Story & Closing CTA */}
        <FinalStorySection onCtaClick={scrollToOrderSection} />

        {/* 11. FAQ Section */}
        <FaqSection onCtaClick={scrollToOrderSection} />

        {/* 12. Custom Sleek Checkout Form Section */}
        <CustomCheckoutSection onOrderSuccess={handleOrderSuccess} />

        {/* 13. Footer Section */}
        <FooterSection />
      </main>

      {/* Sticky Bottom Bar for instant purchase */}
      <StickyBottomBar onCtaClick={scrollToOrderSection} />

      {/* Interactive Order Completion / Payment Modal */}
      {completedOrder && (
        <OrderSuccessModal
          order={completedOrder}
          onClose={() => setCompletedOrder(null)}
        />
      )}
    </div>
  );
}

