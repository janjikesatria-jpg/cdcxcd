import React, { useState, useEffect } from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  X,
  Bell,
  Key,
  Shield,
  HelpCircle,
  ExternalLink,
  Smartphone,
  RefreshCw
} from 'lucide-react';

interface TelegramSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelegramSettingsModal: React.FC<TelegramSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [botToken, setBotToken] = useState<string>('');
  const [chatId, setChatId] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [maskedToken, setMaskedToken] = useState<string | null>(null);
  const [maskedChatId, setMaskedChatId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showGuide, setShowGuide] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen]);

  const loadStatus = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/telegram/status');
      const data = await res.json();
      setIsConfigured(data.isConfigured);
      setMaskedToken(data.maskedBotToken);
      setMaskedChatId(data.maskedChatId);
      if (data.botToken && !botToken) {
        setBotToken(data.botToken);
      }
      if (data.chatId && !chatId) {
        setChatId(data.chatId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoDetect = async () => {
    try {
      setIsDetecting(true);
      setStatusMsg(null);
      const res = await fetch('/api/telegram/auto-detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken: botToken.trim() || undefined }),
      });
      const data = await res.json();
      if (data.success && data.found) {
        setChatId(data.chatId);
        setStatusMsg({
          text: `🎉 ${data.message}`,
          type: 'success',
        });
        loadStatus();
      } else {
        setStatusMsg({
          text: data.message || data.error || 'Chat ID belum terdeteksi. Silakan buka t.me/ihsnfkribot lalu klik START.',
          type: 'error',
        });
      }
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Gagal menghubungi server.', type: 'error' });
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!botToken.trim() || !chatId.trim()) {
      setStatusMsg({ text: 'Bot Token dan Chat ID wajib diisi!', type: 'error' });
      return;
    }

    try {
      setIsLoading(true);
      setStatusMsg(null);
      const res = await fetch('/api/telegram/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken: botToken.trim(), chatId: chatId.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMsg({ text: '✅ Konfigurasi Telegram berhasil disimpan!', type: 'success' });
        loadStatus();
      } else {
        setStatusMsg({ text: data.error || 'Gagal menyimpan konfigurasi.', type: 'error' });
      }
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Terjadi kesalahan jaringan.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = async () => {
    try {
      setIsTesting(true);
      setStatusMsg(null);
      const res = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: botToken.trim() || undefined,
          chatId: chatId.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({
          text: '🎉 Pesan tes berhasil terkirim! Buka aplikasi Telegram di HP Anda sekarang.',
          type: 'success',
        });
      } else {
        setStatusMsg({
          text: `❌ Gagal: ${data.error}. Pastikan Anda sudah klik 'START' di bot Telegram Anda.`,
          type: 'error',
        });
      }
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Koneksi gagal.', type: 'error' });
    } finally {
      setIsTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white p-4 px-5 rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                Notifikasi Bot Telegram (Admin)
              </h3>
              <p className="text-[11px] text-gray-300">
                Laporan pesanan QRIS &amp; foto struk otomatis masuk ke Telegram Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs sm:text-sm text-gray-700">
          {/* Status Banner */}
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              isConfigured
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            {isConfigured ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5 flex-1">
              <p className="font-bold text-xs uppercase tracking-wider">
                Status: {isConfigured ? '🟢 AKTIF & TERHUBUNG' : '🟠 MENUNGGU CHAT ID'}
              </p>
              <p className="text-[11.5px] leading-relaxed">
                {isConfigured
                  ? `Bot Telegram siap! Setiap ada pembayaran QRIS Rp 99.000 sukses, foto struk dan data pembeli otomatis dikirim ke Chat ID (${maskedChatId}).`
                  : 'Bot token sudah diset. Anda hanya perlu membuka bot Anda di Telegram dan klik tombol START, lalu klik "Deteksi Chat ID Otomatis".'}
              </p>
            </div>
          </div>

          {/* Quick Action Box: Open Bot in Telegram */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="text-left w-full sm:w-auto">
              <div className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-blue-600" />
                Langkah 1: Aktifkan Bot di Telegram Anda
              </div>
              <div className="text-[11px] text-blue-700">
                Buka <code className="bg-blue-100 px-1 py-0.5 rounded font-mono font-bold">@ihsnfkribot</code> lalu klik tombol <b>START</b>
              </div>
            </div>
            <a
              href="https://t.me/ihsnfkribot"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 shrink-0 transition"
            >
              <span>Buka t.me/ihsnfkribot</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Status Message from Action */}
          {statusMsg && (
            <div
              className={`p-3 rounded-xl border text-xs font-semibold ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-red-50 border-red-300 text-red-800'
              }`}
            >
              {statusMsg.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                1. Bot Token Telegram
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Token dari @BotFather"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-800">
                  2. Chat ID Telegram Anda
                </label>
                <button
                  type="button"
                  onClick={handleAutoDetect}
                  disabled={isDetecting}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  title="Ambil chat ID setelah Anda klik START di Telegram"
                >
                  <RefreshCw className={`w-3 h-3 ${isDetecting ? 'animate-spin' : ''}`} />
                  <span>{isDetecting ? 'Mendeteksi...' : '⚡ Ambil Chat ID Otomatis'}</span>
                </button>
              </div>
              <input
                type="text"
                placeholder="Klik 'Ambil Chat ID Otomatis' atau masukkan ID manual"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <p className="text-[10.5px] text-gray-500 mt-1">
                Atau cari bot <span className="font-mono font-semibold">@userinfobot</span> di Telegram &gt; kirim pesan &gt; salin angka ID Anda.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-3 rounded-xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                <span>Simpan Pengaturan</span>
              </button>

              <button
                type="button"
                onClick={handleTest}
                disabled={isTesting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Kirim Tes Pesan</span>
              </button>
            </div>
          </form>

          {/* Quick Guide Accordion */}
          <div className="border border-gray-200 rounded-xl p-3 bg-gray-50/70 space-y-2">
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="w-full flex items-center justify-between text-left font-bold text-xs text-gray-800 cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                Cara Buat Bot Telegram Gratis (1 Menit):
              </span>
              <span className="text-gray-500 font-normal text-xs">{showGuide ? 'Tutup ▲' : 'Buka ▼'}</span>
            </button>

            {showGuide && (
              <div className="pt-2 text-[11px] text-gray-600 space-y-2 border-t border-gray-200/80 leading-relaxed">
                <div>
                  <b className="text-gray-800">Langkah 1: Dapatkan Bot Token</b>
                  <p>Buka Telegram &gt; Cari akun <span className="font-mono bg-white px-1 border rounded">@BotFather</span> &gt; Ketik <code className="text-blue-600">/newbot</code> &gt; Beri nama bot toko Anda &gt; Copy <b>HTTP API Token</b> yang diberikan.</p>
                </div>
                <div>
                  <b className="text-gray-800">Langkah 2: Aktifkan Bot Anda</b>
                  <p>Cari nama bot yang baru saja Anda buat di Telegram &gt; Tekan tombol <b>START</b> agar bot diizinkan mengirim pesan ke Anda.</p>
                </div>
                <div>
                  <b className="text-gray-800">Langkah 3: Dapatkan Chat ID Anda</b>
                  <p>Cari bot <span className="font-mono bg-white px-1 border rounded">@userinfobot</span> di Telegram &gt; Tekan <b>START</b> &gt; Copy angka di bagian <b>Id</b> (misal: 987654321).</p>
                </div>
                <p className="text-emerald-700 font-semibold pt-1">
                  💡 Tempel token dan Chat ID di form atas, lalu klik "Simpan" &amp; "Kirim Tes Pesan". Selesai!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 rounded-b-2xl px-5">
          <span>Kredensial disimpan aman di server</span>
          <button
            onClick={onClose}
            className="text-gray-700 hover:text-black font-semibold cursor-pointer underline"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
