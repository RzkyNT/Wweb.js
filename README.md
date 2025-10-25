# 🤖 WhatsApp Bot with Gemini AI

Bot WhatsApp multifungsi yang dibangun dengan whatsapp-web.js dan terintegrasi dengan Gemini AI.

## ✨ Fitur

- 🤖 **AI Chat** - Chat cerdas menggunakan Gemini AI
- 💬 **Auto Reply** - Respons otomatis berdasarkan kata kunci
- 👥 **Group Management** - Welcome message dan manajemen grup
- 🖼️ **Media Support** - Kirim dan terima media (gambar, dokumen)
- 🎨 **Sticker Maker** - Buat stiker dari gambar
- 📢 **Broadcast** - Kirim pengumuman ke semua kontak/grup
- 📊 **Dashboard** - Monitor aktivitas bot secara real-time

## 🚀 Cara Menggunakan

1. **Jalankan Bot**
   ```bash
   node index.js
   ```

2. **Scan QR Code**
   - QR code akan muncul di terminal
   - Scan dengan WhatsApp Anda (Linked Devices)

3. **Akses Dashboard**
   - Buka browser: http://localhost:5000
   - Monitor aktivitas bot secara real-time

## ⌨️ Perintah Bot

| Perintah | Deskripsi |
|----------|-----------|
| `!help` | Menampilkan daftar bantuan |
| `!menu` | Menampilkan menu utama |
| `!ai [pesan]` | Chat dengan AI |
| `!sticker` | Buat stiker dari gambar |
| `!broadcast [pesan]` | Kirim pengumuman (Admin only) |
| `!info` | Informasi bot |
| `!ping` | Cek status bot |
| `ai: [pertanyaan]` | Alternative AI command |

## 🎯 Contoh Penggunaan

- **Chat dengan AI**: `!ai Apa itu kecerdasan buatan?`
- **Buat Stiker**: Kirim gambar dengan caption `!sticker`
- **Analisis Gambar**: Kirim gambar dengan caption `analisis`
- **Broadcast**: `!broadcast Halo semua, ada pengumuman penting!`

## ⚙️ Konfigurasi

Edit file `src/utils/config.js` untuk mengubah:
- Nama bot
- Prefix command
- Admin numbers (untuk broadcast)
- Welcome message
- Dan lainnya

## 📝 Environment Variables

- `GEMINI_API_KEY` - API key dari Google Gemini
- `DASHBOARD_ENABLED` - Enable/disable dashboard (default: true)

## 🔧 Teknologi

- **whatsapp-web.js** - WhatsApp Web API
- **Gemini AI** - Google's Generative AI
- **Express.js** - Dashboard web server
- **Node.js** - Runtime environment

## 📊 Struktur Proyek

```
├── src/
│   ├── bot.js              # WhatsApp bot utama
│   ├── dashboard.js        # Dashboard server
│   ├── handlers/
│   │   ├── messageHandler.js
│   │   └── groupHandler.js
│   ├── services/
│   │   └── gemini.js       # Integrasi Gemini AI
│   └── utils/
│       ├── config.js       # Konfigurasi bot
│       └── logger.js       # Logging system
├── public/                 # Dashboard UI
├── assets/                 # Media assets
└── index.js               # Entry point
```

## 🛡️ Keamanan

- API keys disimpan dengan aman di environment variables
- Authentication menggunakan LocalAuth dari whatsapp-web.js
- Admin verification untuk fitur broadcast

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buka issue di repository ini.

---

Dibuat dengan ❤️ menggunakan Node.js dan Gemini AI
