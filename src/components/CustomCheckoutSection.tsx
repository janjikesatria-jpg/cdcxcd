import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Lock,
  Zap,
  CheckCircle2,
  QrCode,
  Building2,
  Wallet,
  ArrowRight,
  Sparkles,
  Gift,
  Clock
} from 'lucide-react';
import { OrderData } from '../types';

interface CustomCheckoutSectionProps {
  onOrderSuccess: (order: OrderData) => void;
}

export const CustomCheckoutSection: React.FC<CustomCheckoutSectionProps> = ({ onOrderSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bca' | 'mandiri' | 'bri' | 'gopay' | 'dana'>('qris');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const price = 99000;
  const normalPrice = 199000;
  const discount = normalPrice - price;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      errs.name = 'Nama lengkap wajib diisi';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Nomor WhatsApp wajib diisi';
    } else if (formData.phone.trim().length < 9) {
      errs.phone = 'Nomor WhatsApp minimal 9 digit (contoh: 08123456789)';
    }
    if (!formData.email.trim()) {
      errs.email = 'Alamat email wajib diisi';
    } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
      errs.email = 'Format email tidak valid';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Trigger Meta Pixel Purchase / InitiateCheckout event
    if (typeof window !== 'undefined' && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', 'Purchase', {
        value: price,
        currency: 'IDR',
        content_name: 'Ebook Kuasai Pikirannya, Trigger Gairahnya',
      });
    }

    setTimeout(() => {
      const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      const newOrder: OrderData = {
        orderId,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        paymentMethod,
        amount: price,
        createdAt: new Date().toISOString(),
      };

      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    }, 600);
  };

  return (
    <section id="order-section" className="w-full py-8 px-3.5 sm:px-5 bg-gradient-to-b from-gray-50 via-white to-gray-50 scroll-mt-4">
      <div className="max-w-[540px] mx-auto space-y-5">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-neutral-900 via-[#1A1A1A] to-neutral-900 text-white rounded-2xl p-5 shadow-xl border border-neutral-800 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-red-600/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-neutral-950 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2.5 shadow-md">
            <Zap className="w-3.5 h-3.5 fill-current" /> FORMULIR PEMESANAN RESMI
          </div>

          <h2 className="text-[20px] sm:text-[23px] font-black leading-tight text-white">
            Kuasai Mindset &amp; Trigger Gairahnya Sekarang
          </h2>
          
          <p className="text-neutral-300 text-xs sm:text-[13px] mt-1 font-normal flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Akses otomatis dikirim langsung ke WhatsApp &amp; Email lo
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Ringkasan Pesanan</span>
            <span className="bg-red-50 text-red-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-red-200">
              Hemat Rp {discount.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-start text-sm">
              <div>
                <h4 className="font-bold text-gray-900 leading-snug">Ebook "Kuasai Pikirannya, Trigger Gairahnya"</h4>
                <p className="text-xs text-gray-500 mt-0.5">Panduan Lengkap + 3 Bonus Spesial</p>
              </div>
              <span className="font-black text-gray-900 text-base">Rp {price.toLocaleString('id-ID')}</span>
            </div>

            <div className="bg-neutral-50 rounded-xl p-3 space-y-1.5 text-xs text-gray-600 border border-neutral-100">
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <Gift className="w-3.5 h-3.5" /> <span>Termasuk 3 Bonus Senilai Rp 299.000 (GRATIS):</span>
              </div>
              <ul className="space-y-1 pl-5 list-disc text-gray-600 text-[11.5px]">
                <li>Bonus 1: Cheatsheet Mindset Pria Dominan</li>
                <li>Bonus 2: 25+ Script Chat Pemicu Emosi &amp; Ketertarikan</li>
                <li>Bonus 3: Checklist Evaluasi Sinyal Cewek</li>
              </ul>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex justify-between items-baseline">
            <span className="text-sm font-extrabold text-gray-800">Total Investasi</span>
            <div className="text-right">
              <span className="text-xs text-gray-400 line-through mr-1.5">Rp {normalPrice.toLocaleString('id-ID')}</span>
              <span className="text-xl sm:text-2xl font-black text-red-600">Rp {price.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Input Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-4 sm:p-5 space-y-4">
          <div className="border-b border-gray-100 pb-2.5">
            <h3 className="font-extrabold text-gray-900 text-[15px] sm:text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-black flex items-center justify-center">1</span>
              Isi Data Penerima Akses Ebook
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Pastikan No. WhatsApp &amp; Email aktif untuk pengiriman akses</p>
          </div>

          {/* Name Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Budi Santoso"
                className={`w-full pl-10 pr-3.5 py-3 bg-gray-50 border ${
                  errors.name ? 'border-red-500 bg-red-50/50' : 'border-gray-300 focus:border-red-600 focus:bg-white'
                } rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors`}
              />
            </div>
            {errors.name && <p className="text-[11px] text-red-600 font-medium pl-1">{errors.name}</p>}
          </div>

          {/* WhatsApp Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">
              No. WhatsApp Aktif <span className="text-red-500">*</span> <span className="text-[11px] text-emerald-600 font-medium">(Link Ebook dikirim ke sini)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9+]/g, '') })}
                placeholder="Contoh: 081234567890"
                className={`w-full pl-10 pr-3.5 py-3 bg-gray-50 border ${
                  errors.phone ? 'border-red-500 bg-red-50/50' : 'border-gray-300 focus:border-red-600 focus:bg-white'
                } rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors`}
              />
            </div>
            {errors.phone && <p className="text-[11px] text-red-600 font-medium pl-1">{errors.phone}</p>}
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block">
              Alamat Email <span className="text-red-500">*</span> <span className="text-[11px] text-gray-400 font-normal">(Cadangan pengiriman PDF)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Contoh: budi@gmail.com"
                className={`w-full pl-10 pr-3.5 py-3 bg-gray-50 border ${
                  errors.email ? 'border-red-500 bg-red-50/50' : 'border-gray-300 focus:border-red-600 focus:bg-white'
                } rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors`}
              />
            </div>
            {errors.email && <p className="text-[11px] text-red-600 font-medium pl-1">{errors.email}</p>}
          </div>

          {/* Payment Method Selector */}
          <div className="pt-2 space-y-2.5">
            <div className="border-b border-gray-100 pb-2">
              <h3 className="font-extrabold text-gray-900 text-[15px] sm:text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-black flex items-center justify-center">2</span>
                Pilih Metode Pembayaran
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-2.5 pt-1">
              {/* QRIS */}
              <label
                onClick={() => setPaymentMethod('qris')}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'qris'
                    ? 'border-red-600 bg-red-50/50 shadow-sm ring-1 ring-red-600'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${paymentMethod === 'qris' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-gray-900">QRIS Instan (Otomatis)</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        Paling Cepat
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Scan via GoPay, BCA, OVO, ShopeePay, DANA &amp; M-Banking</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'qris'}
                  onChange={() => setPaymentMethod('qris')}
                  className="w-4 h-4 text-red-600 focus:ring-red-500"
                />
              </label>

              {/* Transfer Bank BCA */}
              <label
                onClick={() => setPaymentMethod('bca')}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'bca'
                    ? 'border-red-600 bg-red-50/50 shadow-sm ring-1 ring-red-600'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${paymentMethod === 'bca' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-900">Transfer Bank BCA</span>
                    <p className="text-xs text-gray-500">Verifikasi cepat / Rekening Resmi</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bca'}
                  onChange={() => setPaymentMethod('bca')}
                  className="w-4 h-4 text-red-600 focus:ring-red-500"
                />
              </label>

              {/* Transfer Bank Mandiri / BRI */}
              <label
                onClick={() => setPaymentMethod('mandiri')}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'mandiri'
                    ? 'border-red-600 bg-red-50/50 shadow-sm ring-1 ring-red-600'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${paymentMethod === 'mandiri' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-900">Transfer Bank Mandiri / BRI / BNI</span>
                    <p className="text-xs text-gray-500">ATM, Mobile Banking &amp; Internet Banking</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'mandiri'}
                  onChange={() => setPaymentMethod('mandiri')}
                  className="w-4 h-4 text-red-600 focus:ring-red-500"
                />
              </label>

              {/* E-Wallet DANA / GoPay */}
              <label
                onClick={() => setPaymentMethod('gopay')}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'gopay'
                    ? 'border-red-600 bg-red-50/50 shadow-sm ring-1 ring-red-600'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${paymentMethod === 'gopay' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-900">E-Wallet (GoPay / DANA / ShopeePay)</span>
                    <p className="text-xs text-gray-500">Pembayaran langsung via aplikasi e-wallet</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'gopay'}
                  onChange={() => setPaymentMethod('gopay')}
                  className="w-4 h-4 text-red-600 focus:ring-red-500"
                />
              </label>
            </div>
          </div>

          {/* Privacy & Guarantee Notice */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="font-bold">Privasi 100% Aman &amp; Terjaga:</strong> Tidak ada yang tahu lo membeli buku ini. Nama transaksi &amp; pengiriman paket digital bersifat rahasia.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#00A344] to-[#008f3c] hover:from-[#008f3c] hover:to-[#007a33] active:scale-[0.99] text-white font-black text-[16px] sm:text-[18px] py-4 px-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Memproses Pesanan Lo...
              </span>
            ) : (
              <>
                <span>AMBIL PROMO &amp; BAYAR SEKARANG</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Trust Guarantees */}
          <div className="flex items-center justify-center gap-4 text-[11px] text-gray-500 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" /> Transaksi Aman
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Akses Instan
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-gray-600" /> Enkripsi SSL 256-Bit
            </span>
          </div>
        </form>

      </div>
    </section>
  );
};
