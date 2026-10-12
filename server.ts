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

// API endpoint to verify payment proof screenshot via Gemini Vision
app.post('/api/verify-proof', async (req, res) => {
  try {
    const { imageBase64, mimeType, customerName, expectedAmount = 99000 } = req.body;

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
    let parsedResult;
    try {
      parsedResult = JSON.parse(resultText);
    } catch {
      parsedResult = {
        isValid: false,
        rejectionReason: 'Format respons sistem tidak dapat dibaca.',
        analysisSummary: 'Gagal menganalisis gambar.',
      };
    }

    return res.json(parsedResult);
  } catch (error: any) {
    console.error('Error during proof verification:', error);
    return res.status(500).json({
      isValid: false,
      rejectionReason: 'Terjadi kendala saat memeriksa bukti pembayaran. Silakan coba lagi atau kirim bukti via WhatsApp Admin.',
      error: error?.message,
    });
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
