import React, { useState } from 'react';
import {
  CheckCircle,
  Copy,
  Check,
  MessageCircle,
  ShieldCheck,
  X,
  QrCode,
  Building2,
  Wallet,
  Sparkles,
  Download
} from 'lucide-react';
import { OrderData } from '../types';

interface OrderSuccessModalProps {
  order: OrderData;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getPaymentDetails = () => {
    switch (order.paymentMethod) {
      case 'bca':
        return {
          title: 'Bank Central Asia (BCA)',
          accountNumber: '8410294821',
          accountName: 'KUASAI PIKIRANNYA / OFFICIAL',
          instructions: 'Transfer via BCA Mobile / KlikBCA / ATM BCA.',
        };
      case 'mandiri':
        return {
          title: 'Bank Mandiri',
          accountNumber: '1370019284721',
          accountName: 'KUASAI PIKIRANNYA / OFFICIAL',
          instructions: 'Transfer via Livin Mandiri / ATM Mandiri.',
        };
      case 'gopay':
      case 'dana':
        return {
          title: 'E-Wallet (GoPay / DANA)',
          accountNumber: '081234567890',
          accountName: 'KUASAI PIKIRANNYA / OFFICIAL',
          instructions: 'Transfer saldo e-wallet ke nomor di atas atau scan QRIS.',
        };
      case 'qris':
      default:
        return {
          title: 'QRIS Instan (Semua Bank & E-Wallet)',
          accountNumber: 'NMID: ID10200392841',
          accountName: 'KUASAI PIKIRANNYA OFFICIAL',
          instructions: 'Buka BCA Mobile, GoPay, OVO, ShopeePay, DANA, Livin, atau BRImo, lalu scan QRIS di bawah.',
        };
    }
  };

  const paymentInfo = getPaymentDetails();

  const waMessage = encodeURIComponent(
    `Halo Admin, saya mau konfirmasi pembayaran Ebook *Kuasai Pikirannya, Trigger Gairahnya*:\n\n` +
      `• No Order: *${order.orderId}*\n` +
      `• Nama: *${order.name}*\n` +
      `• No WA: *${order.phone}*\n` +
      `• Email: *${order.email}*\n` +
      `• Total: *Rp ${order.amount.toLocaleString('id-ID')}*\n` +
      `• Metode: *${paymentInfo.title}*\n\n` +
      `Mohon verifikasi dan kirimkan akses Ebook + 3 Bonusnya ya min. Terima kasih!`
  );

  // WhatsApp link (standard customer service format)
  const waUrl = `https://wa.me/6285871239999?text=${waMessage}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3.5 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-[500px] w-full shadow-2xl overflow-hidden border border-gray-100 my-auto relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Celebration Header */}
        <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-black text-white p-6 text-center relative">
          <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 ring-4 ring-emerald-500/30">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <span className="bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 text-[11px] font-black uppercase px-3 py-0.5 rounded-full">
            Pesanan Berhasil Dibuat
          </span>
          <h3 className="text-xl font-black mt-2 text-white">Satu Langkah Lagi Menuju Akses Ebook</h3>
          <p className="text-xs text-gray-300 mt-1">
            Order ID: <strong className="text-white font-mono">{order.orderId}</strong>
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Amount Box */}
          <div className="bg-red-50 border border-red-200/90 rounded-2xl p-4 text-center">
            <span className="text-xs font-bold text-gray-600 block uppercase tracking-wider">Total Pembayaran</span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-3xl font-black text-red-600">
                Rp {order.amount.toLocaleString('id-ID')}
              </span>
              <button
                onClick={() => copyToClipboard(order.amount.toString(), 'amount')}
                className="bg-white border border-red-200 text-red-600 p-1.5 rounded-lg hover:bg-red-100 transition-colors text-xs font-bold flex items-center gap-1"
                title="Salin nominal"
              >
                {copiedField === 'amount' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">Transfer tepat sesuai nominal di atas</p>
          </div>

          {/* Payment Method Details */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                {order.paymentMethod === 'qris' ? (
                  <QrCode className="w-4 h-4 text-red-600" />
                ) : order.paymentMethod === 'gopay' || order.paymentMethod === 'dana' ? (
                  <Wallet className="w-4 h-4 text-red-600" />
                ) : (
                  <Building2 className="w-4 h-4 text-red-600" />
                )}
                {paymentInfo.title}
              </span>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Otomatis
              </span>
            </div>

            {order.paymentMethod === 'qris' ? (
              <div className="text-center py-2 space-y-2">
                <div className="bg-white p-3 rounded-xl border border-gray-300 inline-block shadow-sm">
                  {/* Generated QR Code Representation */}
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://pria-seratus-persen.myscalev.com/p/e-book-kuasai-pikirannya-trigger-gairahnya"
                    alt="QRIS Pembayaran Ebook"
                    className="w-40 h-40 mx-auto rounded"
                  />
                  <span className="text-[10px] font-bold text-gray-400 block mt-1 tracking-widest">NMID: ID10200392841</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Scan QR di atas menggunakan aplikasi <strong>BCA, GoPay, OVO, ShopeePay, DANA, Livin Mandiri, atau BRImo</strong>.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-200">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Nomor Rekening / Tujuan:</span>
                    <span className="text-base font-black font-mono text-gray-900">{paymentInfo.accountNumber}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(paymentInfo.accountNumber, 'account')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    {copiedField === 'account' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        <span>Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin No. Rek</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-xs text-gray-600 px-1">
                  <p>Atas Nama: <strong className="text-gray-900">{paymentInfo.accountName}</strong></p>
                </div>
              </div>
            )}
          </div>

          {/* User Confirmation Summary */}
          <div className="bg-neutral-50 rounded-xl p-3 text-xs text-gray-600 space-y-1 border border-neutral-200">
            <div className="flex justify-between">
              <span className="text-gray-400">Penerima:</span>
              <span className="font-bold text-gray-800">{order.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">WhatsApp:</span>
              <span className="font-bold text-gray-800 font-mono">{order.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Email:</span>
              <span className="font-bold text-gray-800">{order.email}</span>
            </div>
          </div>

          {/* Action Button: WhatsApp Confirmation */}
          <div className="space-y-2 pt-1">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#00A344] hover:bg-[#008f3c] active:scale-[0.99] text-white font-extrabold text-sm sm:text-base py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 text-center"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Konfirmasi Pembayaran via WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="w-full text-center text-xs text-gray-500 hover:text-gray-800 py-2 font-medium"
            >
              Tutup &amp; Saya Akan Transfer Nanti
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
