import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const port = 3000;

// Enable JSON body parser with generous limit for image base64
app.use(express.json({ limit: '20mb' }));

// Shared server-side Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface OrderRecord {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  date: string;
  status: 'VERIFIED' | 'REJECTED';
  aiSummary?: string;
  telegramNotified: boolean;
}

// Telegram credentials helper (reads from env or telegram-config.json)
function getTelegramConfig(): { botToken: string; chatId: string } {
  let botToken = process.env.TELEGRAM_BOT_TOKEN || '';
  let chatId = process.env.TELEGRAM_CHAT_ID || '';

  const configPath = path.resolve('telegram-config.json');
  if (fs.existsSync(configPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      if (data.botToken) botToken = data.botToken;
      if (data.chatId) chatId = data.chatId;
    } catch (err) {
      console.error('Error reading telegram-config.json:', err);
    }
  }
  return { botToken, chatId };
}

function saveTelegramConfig(botToken: string, chatId: string) {
  process.env.TELEGRAM_BOT_TOKEN = botToken;
  process.env.TELEGRAM_CHAT_ID = chatId;
  const configPath = path.resolve('telegram-config.json');
  fs.writeFileSync(configPath, JSON.stringify({ botToken, chatId }, null, 2), 'utf-8');
}

// Order persistence helper
function saveOrder(order: OrderRecord) {
  try {
    const ordersFile = path.resolve('orders.json');
    let orders: OrderRecord[] = [];
    if (fs.existsSync(ordersFile)) {
      orders = JSON.parse(fs.readFileSync(ordersFile, 'utf-8'));
    }
    orders.unshift(order);
    fs.writeFileSync(ordersFile, JSON.stringify(orders.slice(0, 500), null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save order to orders.json:', err);
  }
}

// Send Telegram notification with optional photo proof
async function sendTelegramNotification({
  customerName,
  customerEmail,
  expectedAmount,
  transactionId,
  analysisSummary,
  detectedMerchant,
  detectedAmount,
  imageBase64,
  mimeType,
}: {
  customerName: string;
  customerEmail: string;
  expectedAmount: number;
  transactionId: string;
  analysisSummary?: string;
  detectedMerchant?: string;
  detectedAmount?: string;
  imageBase64?: string;
  mimeType?: string;
}): Promise<boolean> {
  const { botToken, chatId } = getTelegramConfig();

  if (!botToken || !chatId) {
    console.log('[Telegram Notification] Bot Token atau Chat ID belum diset.');
    return false;
  }

  const nowWib = new Date().toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const formattedAmount = Number(expectedAmount || 99000).toLocaleString('id-ID');

  const caption = 
`🎉 <b>PESANAN BARU BERHASIL DIVERIFIKASI!</b> 🎉

👤 <b>Nama Pembeli:</b> ${customerName || '-'}
📧 <b>Email:</b> ${customerEmail || '-'}
💰 <b>Nominal:</b> Rp ${formattedAmount}
🆔 <b>ID Transaksi:</b> <code>${transactionId}</code>
🏦 <b>Metode:</b> QRIS Ahli PDKT (NMID: ID1026585665841)
🤖 <b>Status AI:</b> VALID & SUKSES
🔍 <b>Merchant Terdeteksi:</b> ${detectedMerchant || 'Ahli PDKT'}
💵 <b>Nominal Struk:</b> ${detectedAmount || 'Rp ' + formattedAmount}
📝 <b>Ringkasan AI:</b> ${analysisSummary || 'Bukti pembayaran valid'}
⏰ <b>Waktu:</b> ${nowWib} WIB

✅ <i>Link download 4 file PDF sudah otomatis dibuka untuk pembeli.</i>`;

  try {
    // If screenshot image exists, send as photo with caption
    if (imageBase64) {
      try {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(cleanBase64, 'base64');
        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('caption', caption);
        formData.append('parse_mode', 'HTML');
        formData.append('photo', new Blob([buffer], { type: mimeType || 'image/jpeg' }), 'struk-qris.jpg');

        const photoRes = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
          method: 'POST',
          body: formData,
        });

        const photoJson = (await photoRes.json()) as { ok: boolean; description?: string };
        if (photoJson.ok) {
          console.log('[Telegram Notification] Foto struk dan detail berhasil dikirim ke Telegram!');
          return true;
        }
        console.warn('[Telegram Notification] sendPhoto gagal, mencoba sendMessage:', photoJson.description);
      } catch (photoErr) {
        console.warn('[Telegram Notification] Error sendPhoto:', photoErr);
      }
    }

    // Text message fallback
    const textRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: caption,
        parse_mode: 'HTML',
      }),
    });
    const textJson = (await textRes.json()) as { ok: boolean; description?: string };
    if (textJson.ok) {
      console.log('[Telegram Notification] Pesan teks berhasil terkirim ke Telegram!');
      return true;
    } else {
      console.error('[Telegram Notification] Gagal mengirim ke Telegram:', textJson.description);
      return false;
    }
  } catch (err) {
    console.error('[Telegram Notification] Gagal kirim Telegram:', err);
    return false;
  }
}

// API endpoint to verify payment proof screenshot via Gemini Vision
app.post('/api/verify-proof', async (req, res) => {
  try {
    const {
      imageBase64,
      mimeType,
      customerName,
      customerEmail,
      expectedAmount = 99000,
      transactionId,
    } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        isValid: false,
        rejectionReason: 'Tidak ada data gambar yang diterima.',
      });
    }

    // Strip prefix if client sent data URL (e.g. data:image/jpeg;base64,...)
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const cleanMime = mimeType || 'image/jpeg';

    const verificationPrompt = `
Anda adalah sistem inspeksi bukti pembayaran otomatis untuk toko online "Ahli PDKT" (Indonesia).
Tugas Anda: Analisis gambar yang diunggah secara objektif dan tentukan apakah gambar ini adalah BUKTI PEMBAYARAN / STRUK TRANSFER / STRUK QRIS YANG SAH ATAU BUKAN.

Kriteria Verifikasi:
1. Jenis Gambar:
   - HARUS berupa bukti transaksi perbankan / dompet digital asli (misal: BCA Mobile, Mandiri Livin, BRImo, BNI Mobile, DANA, GoPay, OVO, ShopeePay, LinkAja, atau bukti pembayaran QRIS).
   - JIKA gambar adalah foto acak (meme, selfie, pemandangan, gambar hitam/putih kosong, foto hewan, screenshot sosmed biasa, struk belanjaan supermarket, atau gambar tidak relevan), MAKA "isValid": false.

2. Penerima / Merchant:
   - Harus menuju ke "Ahli PDKT", atau terdapat kode NMID "ID1026585665841", atau QRIS DANA / GPN dengan nama serupa.
   - Jika struk QRIS menampilkan nama merchant lain yang sama sekali berbeda, tolak ("isValid": false).

3. Status Pembayaran:
   - Harus menyatakan "Berhasil", "Sukses", "Transaksi Berhasil", "Selesai", atau "Paid".
   - Jika status masih "Pending", "Menunggu", "Gagal", atau "Dibatalkan", tolak ("isValid": false).

4. Nominal Pembayaran:
   - Nominal yang diharapkan adalah sekitar Rp 99.000 (toleransi Rp 99.000 - Rp 99.999 jika ada kode unik).
   - Jika nominal jauh berbeda (misal Rp 1.000, Rp 10.000, atau Rp 500.000 ke tempat lain), tolak ("isValid": false).

Pelanggan yang memesan: "${customerName || 'Customer'}"

Format output WAJIB JSON:
- isValid: boolean (true hanya jika gambar terbukti adalah struk pembayaran yang sah dan sesuai)
- confidence: "HIGH" | "MEDIUM" | "LOW"
- detectedMerchant: string nama merchant yang terbaca pada struk (atau null jika tidak ada)
- detectedAmount: string nominal yang terbaca pada struk (atau null jika tidak ada)
- detectedStatus: string status transaksi yang terbaca (atau null jika tidak ada)
- rejectionReason: string penjelasan dalam bahasa Indonesia yang ramah jika tidak valid (atau null jika valid)
- analysisSummary: string ringkasan singkat dalam bahasa Indonesia
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: cleanMime,
              data: cleanBase64,
            },
          },
          {
            text: verificationPrompt,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: { type: Type.BOOLEAN },
            confidence: { type: Type.STRING },
            detectedMerchant: { type: Type.STRING },
            detectedAmount: { type: Type.STRING },
            detectedStatus: { type: Type.STRING },
            rejectionReason: { type: Type.STRING },
            analysisSummary: { type: Type.STRING },
          },
          required: ['isValid', 'confidence', 'analysisSummary'],
        },
      },
    });

    const resultText = response.text || '{}';
    let parsedResult: any;
    try {
      parsedResult = JSON.parse(resultText);
    } catch {
      parsedResult = {
        isValid: false,
        rejectionReason: 'Format respons sistem tidak dapat dibaca.',
        analysisSummary: 'Gagal menganalisis gambar.',
      };
    }

    const actualTxId = transactionId || `ORD-${Date.now()}`;

    // If valid, send real-time notification to Telegram and save order
    if (parsedResult.isValid) {
      const telegramNotified = await sendTelegramNotification({
        customerName: customerName || 'Pembeli',
        customerEmail: customerEmail || '-',
        expectedAmount,
        transactionId: actualTxId,
        analysisSummary: parsedResult.analysisSummary,
        detectedMerchant: parsedResult.detectedMerchant,
        detectedAmount: parsedResult.detectedAmount,
        imageBase64: cleanBase64,
        mimeType: cleanMime,
      });

      saveOrder({
        id: actualTxId,
        customerName: customerName || 'Pembeli',
        customerEmail: customerEmail || '-',
        amount: expectedAmount,
        date: new Date().toISOString(),
        status: 'VERIFIED',
        aiSummary: parsedResult.analysisSummary,
        telegramNotified,
      });
    }

    return res.json(parsedResult);
  } catch (error: any) {
    console.error('Error during proof verification:', error);
    return res.status(500).json({
      isValid: false,
      rejectionReason: 'Terjadi kendala saat memeriksa bukti pembayaran. Silakan pastikan gambar struk jelas dan coba unggah kembali.',
      error: error?.message,
    });
  }
});

// Telegram status endpoint
app.get('/api/telegram/status', (_req, res) => {
  const { botToken, chatId } = getTelegramConfig();
  const isConfigured = Boolean(botToken && chatId);
  return res.json({
    isConfigured,
    botToken: botToken || '',
    chatId: chatId || '',
    maskedBotToken: botToken
      ? `${botToken.substring(0, 7)}...${botToken.substring(botToken.length - 4)}`
      : null,
    maskedChatId: chatId ? `${chatId.substring(0, 3)}***` : null,
  });
});

// Telegram auto-detect chat ID from getUpdates
app.post('/api/telegram/auto-detect', async (req, res) => {
  const currentConfig = getTelegramConfig();
  const botToken = (req.body.botToken || currentConfig.botToken || '').trim();

  if (!botToken) {
    return res.status(400).json({
      success: false,
      error: 'Bot Token belum diisi.',
    });
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
    const data = (await response.json()) as any;
    if (!data.ok) {
      return res.status(400).json({
        success: false,
        error: data.description || 'Gagal menghubungi Telegram API.',
      });
    }

    const updates = data.result || [];
    if (updates.length === 0) {
      return res.json({
        success: false,
        found: false,
        message: 'Belum ada pesan yang masuk. Buka t.me/ihsnfkribot di Telegram lalu klik START/Mulai, lalu coba lagi.',
      });
    }

    // Find the latest message or chat
    const lastUpdate = [...updates].reverse().find(
      (u: any) => u.message?.chat?.id || u.channel_post?.chat?.id || u.my_chat_member?.chat?.id
    );

    const chat =
      lastUpdate?.message?.chat ||
      lastUpdate?.channel_post?.chat ||
      lastUpdate?.my_chat_member?.chat;

    if (!chat || !chat.id) {
      return res.json({
        success: false,
        found: false,
        message: 'Belum terdeteksi chat ID. Pastikan sudah klik tombol START di bot Anda.',
      });
    }

    const detectedChatId = String(chat.id);
    const senderName = [chat.first_name, chat.last_name].filter(Boolean).join(' ') || chat.title || chat.username || 'User';

    // Auto save to config
    saveTelegramConfig(botToken, detectedChatId);

    return res.json({
      success: true,
      found: true,
      chatId: detectedChatId,
      senderName,
      username: chat.username || '',
      message: `Berhasil terhubung dengan ${senderName} (Chat ID: ${detectedChatId})! Konfigurasi otomatis disimpan.`,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Telegram config save endpoint
app.post('/api/telegram/config', (req, res) => {
  const { botToken, chatId } = req.body;
  if (!botToken || !chatId) {
    return res.status(400).json({ error: 'Bot Token dan Chat ID wajib diisi.' });
  }
  saveTelegramConfig(String(botToken).trim(), String(chatId).trim());
  return res.json({ success: true, message: 'Konfigurasi Telegram berhasil disimpan!' });
});

// Telegram test message endpoint
app.post('/api/telegram/test', async (req, res) => {
  const currentConfig = getTelegramConfig();
  const botToken = (req.body.botToken || currentConfig.botToken || '').trim();
  const chatId = (req.body.chatId || currentConfig.chatId || '').trim();

  if (!botToken || !chatId) {
    return res.status(400).json({
      success: false,
      error: 'Bot Token dan Chat ID belum diisi. Masukkan data bot Telegram Anda.',
    });
  }

  try {
    const testMsg =
      `🔔 <b>TES KONEKSI BOT TELEGRAM - AHLI PDKT</b>\n\n` +
      `✅ <b>Koneksi Berhasil!</b>\n` +
      `Bot ini sudah siap menerima notifikasi otomatis setiap kali ada pembeli yang sukses membayar QRIS Rp 99.000.\n\n` +
      `Detail nama, email, nominal, dan foto bukti transfer akan otomatis terkirim ke chat ini.`;

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: testMsg,
        parse_mode: 'HTML',
      }),
    });

    const data = (await response.json()) as { ok: boolean; description?: string };
    if (data.ok) {
      return res.json({ success: true, message: 'Pesan tes berhasil dikirim ke Telegram Anda!' });
    } else {
      return res.status(400).json({
        success: false,
        error: data.description || 'Gagal mengirim pesan ke Telegram. Periksa token atau chat ID.',
      });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// View orders list endpoint
app.get('/api/orders', (_req, res) => {
  const ordersFile = path.resolve('orders.json');
  if (fs.existsSync(ordersFile)) {
    try {
      const orders = JSON.parse(fs.readFileSync(ordersFile, 'utf-8'));
      return res.json({ orders });
    } catch {
      return res.json({ orders: [] });
    }
  }
  return res.json({ orders: [] });
});

// Endpoint to directly download the standalone HTML file
app.get('/download-html', (_req, res) => {
  const filePath = path.resolve('public/landing-page.html');
  if (fs.existsSync(filePath)) {
    res.download(filePath, 'landing-page-ahli-pdkt.html');
  } else {
    res.status(404).send('File HTML tidak ditemukan.');
  }
});

// Setup Vite middleware or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve('dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
