import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  CheckCircle2,
  Copy,
  Download,
  Upload,
  ArrowRight,
  ShieldCheck,
  Lock,
  Clock,
  FileText,
  Gift,
  Check,
  ExternalLink,
  MessageCircle,
  AlertCircle,
  Sparkles,
  HelpCircle,
  RefreshCw,
  Eye,
  FileCheck,
  Smartphone
} from 'lucide-react';

interface OrderFormState {
  fullName: string;
  email: string;
}

const QRIS_PAYLOAD =
  '00020101021126630014ID.DANA.WWW01189360091510265856650215ID10265856658410303UMI51430014ID.OR.GPN.WWW0115ID10265856658410203UMI5204581253033605405990005802ID5909Ahli PDKT6007JAKARTA61051234562070703A016304147B';

const NMID = 'ID1026585665841';
const MERCHANT_NAME = 'Ahli PDKT';
const PRICE = 99000;

export const PRODUCT_LINKS = {
  mainEbook: 'https://cdn.scalev.com/uploads/1768134235/7Fu91umJMuiyPN2Gr7Lk9A/Ebook-kuasai-pikiran-new-pdf_copy.pdf',
  bonus1DailyPractice: 'https://cdn.scalev.com/uploads/1768134235/qjfmIFr6OMMoVDAFhzz9Dw/PANDUAN-PRAKTIK-HARIAN-KUASAI-PIKIRANNYA_copy.pdf',
  bonus2ChatScripts: 'https://cdn.scalev.com/uploads/1768134235/3c_4mchT0dVgH334Ka39kQ/BONUS-25-chat-siap-copy-paste-kuasai-pikirannya_copy.pdf',
  bonus3ChecklistOverthinking: 'https://cdn.scalev.com/uploads/1768134235/19pLTgFO6P3E88zVsVBIxg/Malam-Hari-dan-checklist-yang-Bikin-Dia-Overthinking-Sendirian_copy.pdf',
};

export const QrisCheckoutSection: React.FC = () => {
  // Steps: 1 = Form, 2 = Pay QRIS, 3 = Upload Proof, 4 = Download PDF
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<OrderFormState>({
    fullName: '',
    email: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<OrderFormState>>({});

  // QR Code Image Data URL
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Payment proof upload state
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string>('');
  const [senderNote, setSenderNote] = useState<string>('');
  const [isSubmittingProof, setIsSubmittingProof] = useState<boolean>(false);
  const [aiStatusMessage, setAiStatusMessage] = useState<string>('');
  const [proofError, setProofError] = useState<string>('');
  const [aiVerificationResult, setAiVerificationResult] = useState<{
    isValid: boolean;
    detectedMerchant?: string | null;
    detectedAmount?: string | null;
    detectedStatus?: string | null;
    rejectionReason?: string | null;
    analysisSummary?: string | null;
  } | null>(null);

  // Copy status indicators
  const [copiedNominal, setCopiedNominal] = useState<boolean>(false);
  const [copiedNmid, setCopiedNmid] = useState<boolean>(false);

  // 15-Minute Countdown Timer for payment
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);

  // Generate QR Code on mount
  useEffect(() => {
    QRCode.toDataURL(
      QRIS_PAYLOAD,
      {
        width: 340,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, []);

  // Timer countdown
  useEffect(() => {
    if (currentStep !== 2) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStep]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string, type: 'nominal' | 'nmid') => {
    navigator.clipboard.writeText(text);
    if (type === 'nominal') {
      setCopiedNominal(true);
      setTimeout(() => setCopiedNominal(false), 2000);
    } else {
      setCopiedNmid(true);
      setTimeout(() => setCopiedNmid(false), 2000);
    }
  };

  // Step 1: Form Validation & Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Partial<OrderFormState> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Nama lengkap wajib diisi';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Format email tidak valid';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setCurrentStep(2);

    // Track GTM dataLayer Begin Checkout
    if (typeof window !== 'undefined') {
      const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({
        event: 'begin_checkout',
        ecommerce: {
          currency: 'IDR',
          value: PRICE,
          items: [
            {
              item_id: 'CMW-EBOOK-01',
              item_name: 'Ebook Kuasai Pikirannya, Trigger Gairahnya',
              item_category: 'Ebook Digital',
              price: PRICE,
              quantity: 1,
            },
          ],
        },
      });
    }

    // Track Meta Pixel InitiateCheckout
    if (typeof window !== 'undefined' && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
      try {
        (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', 'InitiateCheckout', {
          value: PRICE,
          currency: 'IDR',
          content_name: 'Ebook Kuasai Pikirannya, Trigger Gairahnya',
        });
      } catch (err) {
        console.error(err);
      }
    }

    // Scroll smoothly to checkout section top
    const el = document.getElementById('order-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Handle proof file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setProofError('Ukuran file maksimal 10 MB');
        return;
      }
      setProofError('');
      setProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 3: Submit Payment Proof with AI Verification
  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofFile || !proofPreview) {
      setProofError('Silakan pilih/unggah foto atau screenshot bukti pembayaran terlebih dahulu.');
      return;
    }

    setIsSubmittingProof(true);
    setProofError('');
    setAiStatusMessage('Sistem AI sedang menganalisis keaslian struk pembayaran...');

    const transactionId = `ORD-${Date.now()}`;

    try {
      const response = await fetch('/api/verify-proof', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: proofPreview,
          mimeType: proofFile.type || 'image/jpeg',
          customerName: formData.fullName,
          customerEmail: formData.email,
          expectedAmount: PRICE,
          transactionId,
        }),
      });

      const data = await response.json();
      setIsSubmittingProof(false);
      setAiStatusMessage('');

      if (data.isValid) {
        setAiVerificationResult(data);
        setCurrentStep(4);

        // Track GTM (Google Tag Manager) Conversion Events
        if (typeof window !== 'undefined') {
          const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
          w.dataLayer = w.dataLayer || [];

          // 1. Standard GA4 & GTM Ecommerce Purchase Event
          w.dataLayer.push({
            event: 'purchase',
            event_name: 'purchase',
            transaction_id: transactionId,
            value: PRICE,
            currency: 'IDR',
            ecommerce: {
              transaction_id: transactionId,
              value: PRICE,
              currency: 'IDR',
              items: [
                {
                  item_id: 'CMW-EBOOK-01',
                  item_name: 'Ebook Kuasai Pikirannya, Trigger Gairahnya',
                  item_category: 'Ebook Digital',
                  price: PRICE,
                  quantity: 1,
                },
              ],
            },
            customer_data: {
              name: formData.fullName,
              email: formData.email,
            },
          });

          // 2. Custom Conversion Event (for Google Ads & GTM Custom Event Triggers)
          w.dataLayer.push({
            event: 'conversion',
            event_category: 'Ecommerce',
            event_action: 'Success Payment',
            event_label: 'QRIS Ahli PDKT',
            transaction_id: transactionId,
            value: PRICE,
            currency: 'IDR',
          });

          // 3. Custom payment_success event
          w.dataLayer.push({
            event: 'payment_success',
            transaction_id: transactionId,
            payment_method: 'QRIS',
            merchant: MERCHANT_NAME,
            amount: PRICE,
            customer_name: formData.fullName,
            customer_email: formData.email,
          });
        }

        // Track Meta Pixel Purchase
        if (typeof window !== 'undefined' && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
          try {
            (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', 'Purchase', {
              value: PRICE,
              currency: 'IDR',
              content_name: 'Ebook Kuasai Pikirannya, Trigger Gairahnya',
            });
          } catch (err) {
            console.error(err);
          }
        }

        const el = document.getElementById('order-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // AI rejected the image
        setProofError(
          data.rejectionReason ||
            'Sistem AI mendeteksi gambar yang diunggah bukan struk bukti pembayaran yang valid. Mohon unggah screenshot transaksi resmi dari m-Banking atau E-Wallet Anda.'
        );
      }
    } catch (err) {
      setIsSubmittingProof(false);
      setAiStatusMessage('');
      setProofError(
        'Terjadi kendala saat memproses verifikasi. Silakan pastikan gambar struk terlihat jelas dan coba unggah kembali.'
      );
    }
  };

  // Download QRIS Image
  const handleDownloadQris = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 840;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header bar text
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('QRIS', 35, 60);

    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = '#444444';
    ctx.fillText('QR Code Standar Pembayaran Nasional', 35, 82);

    // GPN on right
    ctx.fillStyle = '#D92D20';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('GPN', 490, 65);

    // Merchant Info
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(MERCHANT_NAME, canvas.width / 2, 175);

    ctx.font = '22px sans-serif';
    ctx.fillStyle = '#222222';
    ctx.fillText(`NMID : ${NMID}`, canvas.width / 2, 220);

    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#555555';
    ctx.fillText('A01', canvas.width / 2, 255);

    // Red left chevron
    ctx.fillStyle = '#D92D20';
    ctx.beginPath();
    ctx.moveTo(0, 310);
    ctx.lineTo(110, 420);
    ctx.lineTo(0, 530);
    ctx.closePath();
    ctx.fill();

    // Draw QR code image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, 130, 280, 340, 340);

      // Slogan under QR
      ctx.textAlign = 'center';
      ctx.fillStyle = '#222222';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('SATU QRIS UNTUK SEMUA', canvas.width / 2, 665);

      ctx.fillStyle = '#666666';
      ctx.font = '16px sans-serif';
      ctx.fillText('Cek aplikasi penyelenggara di: www.aspi-qris.id', canvas.width / 2, 695);

      // Footer print
      ctx.textAlign = 'left';
      ctx.fillStyle = '#444444';
      ctx.font = '15px sans-serif';
      ctx.fillText('Dicetak oleh: 93600915', 35, 785);
      ctx.fillText('Versi cetak: 1.0.09.10.26', 35, 810);

      // Trigger download
      const link = document.createElement('a');
      link.download = `QRIS-Ahli-PDKT-${NMID}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = qrDataUrl;
  };

  return (
    <section id="order-section" className="w-full py-6 px-3 sm:px-4 bg-[#F7F8FA] scroll-mt-4">
      <div className="w-full max-w-[500px] mx-auto space-y-4">
        
        {/* Step Progress Tracker */}
        <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between text-xs font-semibold">
            {[
              { num: 1, label: '1. Isi Form' },
              { num: 2, label: '2. Bayar QRIS' },
              { num: 3, label: '3. Kirim Bukti' },
              { num: 4, label: '4. Download PDF' },
            ].map((step, idx) => {
              const isActive = currentStep === step.num;
              const isPassed = currentStep > step.num;
              return (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      isActive
                        ? 'bg-red-600 text-white shadow-md ring-2 ring-red-100 scale-105'
                        : isPassed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.num}
                  </div>
                  <span
                    className={`text-[10.5px] mt-1 text-center font-bold truncate max-w-[75px] ${
                      isActive ? 'text-red-600' : isPassed ? 'text-emerald-700' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            STEP 1: FORMULIR PEMESANAN (ISI FORM)
        ======================================================== */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 space-y-4">
            {/* Header info */}
            <div className="text-center space-y-1">
              <span className="inline-block bg-red-50 text-red-600 text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-red-200">
                Langkah 1 Dari 4: Isi Formulir
              </span>
              <h2 className="text-lg sm:text-xl font-black text-gray-900 leading-tight">
                Amankan Akses Ebook &amp; 3 Bonus Lo
              </h2>
              <p className="text-xs text-gray-500">
                Isi data di bawah ini untuk menerima tautan akses langsung setelah pembayaran QRIS.
              </p>
            </div>

            {/* Order Summary Pill */}
            <div className="bg-neutral-50 rounded-xl p-3.5 border border-gray-200/80 space-y-2">
              <div className="flex justify-between items-start text-xs">
                <div>
                  <p className="font-extrabold text-gray-900">Ebook "Kuasai Pikirannya, Trigger Gairahnya"</p>
                  <p className="text-[11px] text-gray-500">+ 3 Bonus Spesial (Cheatsheet, 25+ Script, Checklist)</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] line-through text-gray-400 block">Rp 249.000</span>
                  <span className="font-black text-red-600 text-sm">Rp 99.000</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11.5px] text-emerald-800 font-bold bg-emerald-50/70 p-2 rounded-lg">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Metode: QRIS (Semua Bank &amp; E-Wallet)
                </span>
                <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded">Instan</span>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Alex Pratama"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    formErrors.fullName ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-100'
                  }`}
                />
                {formErrors.fullName && (
                  <p className="text-[11px] text-red-500 mt-1">{formErrors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Alamat Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Contoh: alex@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    formErrors.email ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-100'
                  }`}
                />
                {formErrors.email && (
                  <p className="text-[11px] text-red-500 mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* CTA Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 text-sm sm:text-base transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>Lanjut ke Pembayaran QRIS (Rp 99.000)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-center gap-3 text-[11px] text-gray-400 pt-1">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-500" /> Data Aman &amp; Terlindungi
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> QRIS Standar Nasional
              </span>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 2: PEMBAYARAN VIA QRIS (BAYAR)
        ======================================================== */}
        {currentStep === 2 && (
          <div className="space-y-4">
            {/* Urgency countdown bar */}
            <div className="bg-amber-500 text-white rounded-xl py-2 px-3.5 flex items-center justify-between text-xs font-bold shadow-sm">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 animate-pulse" /> Selesaikan Pembayaran Dalam:
              </span>
              <span className="bg-black/25 px-2 py-0.5 rounded font-mono font-black text-sm">
                {formatTimer(timeLeft)}
              </span>
            </div>

            {/* Visual QRIS Card - Authentic Representation of User's Image */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden relative">
              {/* Top Banner: QRIS & GPN Logo Header */}
              <div className="p-4 sm:p-5 pb-2 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-start gap-2">
                  <div className="text-left">
                    <div className="flex items-baseline gap-1">
                      <span className="font-black text-xl tracking-tight text-black">QRIS</span>
                    </div>
                    <p className="text-[9.5px] font-bold text-gray-600 leading-tight">
                      QR Code Standar<br />Pembayaran Nasional
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <div className="text-right">
                    <span className="text-red-600 font-black text-lg tracking-wider">GPN</span>
                  </div>
                </div>
              </div>

              {/* Merchant Details */}
              <div className="text-center pt-3 pb-1 px-4 space-y-0.5">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {MERCHANT_NAME}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-gray-700 tracking-wide">
                  NMID : {NMID}
                </p>
                <p className="text-xs font-bold text-gray-500">
                  A01
                </p>
              </div>

              {/* Center QR Code Container with Red Decorative Left Chevron */}
              <div className="relative py-2 px-6 flex items-center justify-center">
                {/* Red chevron on left border */}
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0"
                  style={{
                    borderTop: '45px solid transparent',
                    borderBottom: '45px solid transparent',
                    borderLeft: '45px solid #DC2626',
                  }}
                />

                {/* QR Code Canvas/Image */}
                <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm relative z-10">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="QRIS Ahli PDKT"
                      className="w-56 h-56 sm:w-64 sm:h-64 object-contain mx-auto"
                    />
                  ) : (
                    <div className="w-56 h-56 flex items-center justify-center bg-gray-50 text-xs text-gray-400">
                      Memuat barcode QRIS...
                    </div>
                  )}
                </div>
              </div>

              {/* Slogan under QR */}
              <div className="text-center pt-1 pb-3 px-4 space-y-0.5">
                <p className="text-xs font-extrabold uppercase tracking-widest text-gray-800">
                  SATU QRIS UNTUK SEMUA
                </p>
                <p className="text-[10px] text-gray-500">
                  Cek aplikasi penyelenggara di: www.aspi-qris.id
                </p>
              </div>

              {/* Footer details: Print code & 3 Steps */}
              <div className="bg-gray-50/90 border-t border-gray-200 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between text-[10px] text-gray-500 gap-2">
                <div className="space-y-0.5 text-left">
                  <p>Dicetak oleh: <span className="font-bold text-gray-700">93600915</span></p>
                  <p>Versi cetak: <span className="font-bold text-gray-700">1.0.09.10.26</span></p>
                </div>

                <div className="flex items-center gap-1.5 bg-red-600 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold">
                  <span>Cara Bayar:</span>
                  <span>1. Buka App</span>
                  <span>→</span>
                  <span>2. Scan</span>
                  <span>→</span>
                  <span>3. Bayar</span>
                </div>
              </div>
            </div>

            {/* Payment Summary & Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-600">Total Tagihan:</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-red-600">Rp 99.000</span>
                  <button
                    onClick={() => handleCopy('99000', 'nominal')}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    title="Salin Nominal"
                  >
                    {copiedNominal ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 font-bold">NMID Merchant:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-gray-800">{NMID}</span>
                  <button
                    onClick={() => handleCopy(NMID, 'nmid')}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    title="Salin NMID"
                  >
                    {copiedNmid ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleDownloadQris}
                  className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-red-400" />
                  <span>Unduh Gambar QRIS</span>
                </button>

                <button
                  onClick={() => setCurrentStep(3)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-black py-2.5 px-3 rounded-xl shadow-md shadow-red-600/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Saya Sudah Bayar →</span>
                </button>
              </div>

              <button
                onClick={() => setCurrentStep(1)}
                className="w-full text-center text-xs text-gray-400 hover:text-gray-600 pt-1"
              >
                ← Ubah data diri / pemesan
              </button>
            </div>

            {/* Instruction Checklist */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-950 space-y-2">
              <p className="font-bold flex items-center gap-1.5 text-amber-900">
                <Smartphone className="w-4 h-4 text-amber-600" /> Panduan Pembayaran via Aplikasi:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-gray-700 text-[11.5px]">
                <li>Buka aplikasi m-Banking (BCA, Mandiri, BRI, BNI) atau E-Wallet (GoPay, DANA, OVO, ShopeePay).</li>
                <li>Pilih menu <b>Scan / Bayar QRIS</b>.</li>
                <li>Arahkan kamera ke barcode di atas, atau klik <b>Unduh Gambar QRIS</b> lalu upload dari galeri HP lo.</li>
                <li>Pastikan nama merchant tertera: <b>Ahli PDKT</b>.</li>
                <li>Ketik nominal <b>Rp 99.000</b> lalu konfirmasi pembayaran.</li>
                <li>Simpan screenshot struk/bukti bayar lalu klik tombol <b>Saya Sudah Bayar</b> di atas.</li>
              </ol>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 3: KIRIM BUKTI PEMBAYARAN
        ======================================================== */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 space-y-4">
            <div className="text-center space-y-1">
              <span className="inline-block bg-amber-50 text-amber-700 text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-amber-200">
                Langkah 3 Dari 4: Kirim Bukti
              </span>
              <h2 className="text-lg sm:text-xl font-black text-gray-900 leading-tight">
                Upload Bukti Pembayaran QRIS
              </h2>
              <p className="text-xs text-gray-500">
                Upload screenshot struk bukti transfer dari m-Banking atau e-wallet lo untuk membuka link download PDF.
              </p>
            </div>

            {/* Customer Summary Card */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-xs space-y-1">
              <div className="flex justify-between text-gray-600">
                <span>Pemesan:</span>
                <span className="font-bold text-gray-900">{formData.fullName || 'Member Ahli PDKT'}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Email:</span>
                <span className="font-mono text-gray-900">{formData.email || '-'}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total Dibayar:</span>
                <span className="font-black text-red-600">Rp 99.000</span>
              </div>
            </div>

            {/* Proof Upload Area */}
            <form onSubmit={handleSubmitProof} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Foto / Screenshot Bukti Transfer <span className="text-red-500">*</span>
                </label>

                {proofPreview ? (
                  <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500 bg-emerald-50/30 p-3 space-y-2 text-center">
                    <img
                      src={proofPreview}
                      alt="Preview Bukti Pembayaran"
                      className="max-h-48 mx-auto object-contain rounded-lg shadow-sm border border-gray-200"
                    />
                    <div className="flex items-center justify-between text-xs px-2">
                      <span className="text-emerald-700 font-bold truncate max-w-[200px]">
                        {proofFile?.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setProofFile(null);
                          setProofPreview('');
                        }}
                        className="text-red-500 hover:text-red-700 font-bold text-xs"
                      >
                        Ganti Foto
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-300 hover:border-red-500 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-gray-50 hover:bg-red-50/20">
                    <Upload className="w-8 h-8 text-gray-400 mb-2 group-hover:text-red-500" />
                    <span className="text-xs font-bold text-gray-700">
                      Klik untuk Upload Screenshot Bukti
                    </span>
                    <span className="text-[11px] text-gray-400 mt-0.5">
                      Format JPG, PNG, atau WEBP (Maks 10 MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}

                {proofError && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3.5 space-y-1.5 text-left">
                    <div className="flex items-center gap-2 text-red-700 font-bold text-xs">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Verifikasi Gagal: Bukti Belum Terkonfirmasi</span>
                    </div>
                    <p className="text-xs text-red-600 leading-relaxed font-medium">
                      {proofError}
                    </p>
                    <div className="text-[11px] text-gray-600 bg-white/80 p-2 rounded-lg border border-red-100 space-y-0.5">
                      <p className="font-bold text-gray-700">Tips agar struk lolos verifikasi:</p>
                      <p>• Pastikan nama merchant: <b>Ahli PDKT</b> atau <b>ID1026585665841</b></p>
                      <p>• Nominal transfer sebesar <b>Rp 99.000</b></p>
                      <p>• Status transaksi menyatakan <b>Berhasil / Selesai</b></p>
                      <p>• Tulisan pada struk terlihat jelas dan tidak buram/terpotong</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Optional note */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Nama Akun Pengirim / Catatan <span className="text-gray-400 font-normal">(Opsional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Transfer dari BCA a.n Alex"
                  value={senderNote}
                  onChange={(e) => setSenderNote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs outline-none focus:border-red-600"
                />
              </div>

              {/* AI Verification Loading State */}
              {isSubmittingProof && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-3 text-blue-900 text-xs font-semibold">
                  <RefreshCw className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-blue-800">Sistem AI Sedang Memindai Struk...</p>
                    <p className="text-[11px] text-blue-600 font-normal">
                      Mengecek nama merchant Ahli PDKT, nominal Rp 99.000, dan validitas transaksi.
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmittingProof}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-sm sm:text-base transition-all active:scale-[0.99] cursor-pointer disabled:opacity-75"
              >
                {isSubmittingProof ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Bukti Pembayaran...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verifikasi Bukti &amp; Buka Link Download PDF</span>
                  </>
                )}
              </button>
            </form>


            <div className="flex justify-between items-center text-xs text-gray-400 pt-1">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="hover:text-gray-600"
              >
                ← Kembali ke Barcode QRIS
              </button>
              <span className="flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verifikasi Otomatis
              </span>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 4: HALAMAN DOWNLOAD LINK PDF EBOOK & 3 BONUS
        ======================================================== */}
        {currentStep === 4 && (
          <div className="bg-white rounded-2xl border-2 border-emerald-500 shadow-xl p-4 sm:p-6 space-y-5">
            {/* Success Celebration Header */}
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bukti Transfer Lolos Verifikasi AI</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                Selamat, {formData.fullName || 'Bro'}! Akses Lo Sudah Terbuka
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed max-w-[380px] mx-auto">
                Struk pembayaran lo sah dan terverifikasi untuk <b>Ahli PDKT</b>. Silakan unduh Ebook Utama dan seluruh bonus di bawah ini:
              </p>
            </div>

            {/* List of Downloadable PDFs with Real CDN Links */}
            <div className="space-y-3">
              {/* Main Ebook */}
              <div className="bg-neutral-900 text-white rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-md border border-neutral-800">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-red-600 text-white text-[9.5px] font-black uppercase px-2 py-0.5 rounded">
                      EBOOK UTAMA
                    </span>
                    <span className="text-[11px] text-gray-400">PDF • 160+ Hal</span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    Kuasai Pikirannya, Trigger Gairahnya
                  </h4>
                  <p className="text-[11px] text-gray-300">
                    Blueprint psikologi komunikasi &amp; daya tarik pria sejati
                  </p>
                </div>

                <a
                  href={PRODUCT_LINKS.mainEbook}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="Ebook-kuasai-pikiran-new-pdf.pdf"
                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md transition-all active:scale-95 whitespace-nowrap cursor-pointer no-underline"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>

              {/* Bonus 1 */}
              <div className="bg-amber-50/80 rounded-xl p-3 border border-amber-200 flex items-center justify-between gap-3">
                <div className="space-y-0.5 flex-1">
                  <span className="text-amber-800 text-[10px] font-extrabold uppercase">
                    BONUS #1
                  </span>
                  <h5 className="text-xs font-bold text-gray-900 leading-tight">
                    Panduan Praktik Harian Kuasai Pikirannya
                  </h5>
                  <p className="text-[11px] text-gray-600">
                    Checklist &amp; habit eksekusi harian pembentukan karakter pria bernilai tinggi
                  </p>
                </div>
                <a
                  href={PRODUCT_LINKS.bonus1DailyPractice}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="PANDUAN-PRAKTIK-HARIAN-KUASAI-PIKIRANNYA.pdf"
                  className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1 shadow-sm transition-all active:scale-95 whitespace-nowrap cursor-pointer no-underline"
                >
                  <Download className="w-3 h-3 text-amber-400" />
                  <span>Unduh</span>
                </a>
              </div>

              {/* Bonus 2 */}
              <div className="bg-blue-50/80 rounded-xl p-3 border border-blue-200 flex items-center justify-between gap-3">
                <div className="space-y-0.5 flex-1">
                  <span className="text-blue-800 text-[10px] font-extrabold uppercase">
                    BONUS #2
                  </span>
                  <h5 className="text-xs font-bold text-gray-900 leading-tight">
                    25+ Chat Siap Copy-Paste Kuasai Pikirannya
                  </h5>
                  <p className="text-[11px] text-gray-600">
                    Template chat pembuka, playful tease, hingga closing date
                  </p>
                </div>
                <a
                  href={PRODUCT_LINKS.bonus2ChatScripts}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="BONUS-25-chat-siap-copy-paste-kuasai-pikirannya.pdf"
                  className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1 shadow-sm transition-all active:scale-95 whitespace-nowrap cursor-pointer no-underline"
                >
                  <Download className="w-3 h-3 text-blue-400" />
                  <span>Unduh</span>
                </a>
              </div>

              {/* Bonus 3 */}
              <div className="bg-emerald-50/80 rounded-xl p-3 border border-emerald-200 flex items-center justify-between gap-3">
                <div className="space-y-0.5 flex-1">
                  <span className="text-emerald-800 text-[10px] font-extrabold uppercase">
                    BONUS #3
                  </span>
                  <h5 className="text-xs font-bold text-gray-900 leading-tight">
                    Malam Hari &amp; Checklist yang Bikin Dia Overthinking Sendirian
                  </h5>
                  <p className="text-[11px] text-gray-600">
                    Blueprint trigger psikologis yang membuat cewek penasaran dan mikirin lo
                  </p>
                </div>
                <a
                  href={PRODUCT_LINKS.bonus3ChecklistOverthinking}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="Malam-Hari-dan-checklist-yang-Bikin-Dia-Overthinking-Sendirian.pdf"
                  className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1 shadow-sm transition-all active:scale-95 whitespace-nowrap cursor-pointer no-underline"
                >
                  <Download className="w-3 h-3 text-emerald-400" />
                  <span>Unduh</span>
                </a>
              </div>
            </div>

            {/* Download All in One Bundle Action */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  const links = [
                    PRODUCT_LINKS.mainEbook,
                    PRODUCT_LINKS.bonus1DailyPractice,
                    PRODUCT_LINKS.bonus2ChatScripts,
                    PRODUCT_LINKS.bonus3ChecklistOverthinking,
                  ];
                  links.forEach((link, idx) => {
                    setTimeout(() => {
                      window.open(link, '_blank');
                    }, idx * 300);
                  });
                }}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black py-3 px-4 rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Buka &amp; Download Semua 4 File PDF Sekaligus</span>
              </button>
            </div>

            {/* Information Notice */}
            <div className="bg-gray-50 rounded-xl p-3 text-[11.5px] text-gray-500 space-y-1 border border-gray-200">
              <p className="font-bold text-gray-700">Pemberitahuan Penting:</p>
              <p>• File PDF dapat dibuka langsung di smartphone (Android/iOS) atau PC.</p>
              <p>• Salinan link unduh juga telah dicadangkan ke email <b>{formData.email || 'lo'}</b>.</p>
              <p>• Butuh bantuan atau kendala file? Hubungi support kami di <span className="text-gray-800 font-bold">info@infopdkt.id</span>.</p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
