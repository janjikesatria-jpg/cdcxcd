import React, { useState } from 'react';
import { Star, MessageSquareQuote, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      img: 'https://cdn.scalev.id/uploads/1769781827/XqsWhidaizowSRyAfrd0Rw/1769781826880-1760969094383-1.webp',
      caption: 'Dulu jutek, sekarang senyum duluan tiap liat gue',
      author: 'Member CMW - Bukti Chat 1',
    },
    {
      img: 'https://cdn.scalev.id/uploads/1769781835/LlvX7MX35OFZNgN7L7saFg/1769781835746-1760969110824-3.webp',
      caption: 'Dulu dicuekin, sekarang malah dicariin',
      author: 'Member CMW - Bukti Chat 2',
    },
    {
      img: 'https://cdn.scalev.id/uploads/1769781845/xVTZG9KyJJiNxCAbkt5a2Q/1769781844941-1760969102263-2.webp',
      caption: 'Dulu cuma liat story, sekarang nyari perhatian',
      author: 'Member CMW - Bukti Chat 3',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [modalImg, setModalImg] = useState<string | null>(null);

  return (
    <section className="w-full py-5 px-4">
      <div className="max-w-[540px] mx-auto space-y-4">
        {/* Section Heading */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h3 className="text-[19px] sm:text-[21px] font-extrabold text-[#111111] leading-snug">
            💬 Mereka Yang Sudah
          </h3>
          <p className="text-[18px] sm:text-[20px] font-extrabold text-[#111111]">
            Merasakan Manfaatnya ↓
          </p>
        </div>

        {/* Featured Quotes */}
        <div className="grid grid-cols-1 gap-2.5 pt-1">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                activeIndex === idx
                  ? 'bg-amber-50/80 border-amber-300 text-amber-950 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-700'
              }`}
            >
              <div className="flex items-start gap-2">
                <MessageSquareQuote className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="italic font-semibold">&ldquo;{item.caption}&rdquo;</span>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial Images Carousel & Stack */}
        <div className="pt-2 space-y-3">
          <div className="relative overflow-hidden rounded-2xl border border-gray-300/80 bg-black/5 shadow-md group">
            <img
              src={testimonials[activeIndex].img}
              alt={testimonials[activeIndex].caption}
              className="w-full h-auto object-contain cursor-zoom-in max-h-[520px] mx-auto"
              onClick={() => setModalImg(testimonials[activeIndex].img)}
              loading="lazy"
            />
            
            {/* Quick Zoom Button */}
            <button
              onClick={() => setModalImg(testimonials[activeIndex].img)}
              className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-xs transition"
              title="Perbesar Bukti Chat"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Navigation Arrows */}
            <button
              onClick={() =>
                setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition"
              aria-label="Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition"
              aria-label="Selanjutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 pt-1">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  activeIndex === idx ? 'w-7 bg-red-600' : 'w-2.5 bg-gray-300'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* All 3 Screenshots Stacked view */}
          <div className="pt-2 space-y-3">
            <p className="text-xs text-center text-gray-500 font-medium">
              Ketuk gambar di bawah untuk melihat bukti lainnya:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {testimonials.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`overflow-hidden rounded-lg border cursor-pointer transition-all ${
                    activeIndex === idx
                      ? 'ring-2 ring-red-500 border-red-500 scale-[1.02]'
                      : 'border-gray-200 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={item.img}
                    alt={item.caption}
                    className="w-full h-24 object-cover object-top"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lightbox Modal */}
        {modalImg && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setModalImg(null)}
          >
            <div className="relative max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setModalImg(null)}
                className="absolute -top-10 right-0 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={modalImg}
                alt="Bukti Chat PDKT Membesar"
                className="max-w-full max-h-[85vh] rounded-lg object-contain"
              />
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="w-full pt-4">
          <hr className="border-t border-gray-200" />
        </div>
      </div>
    </section>
  );
};
