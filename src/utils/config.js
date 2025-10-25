const config = {
    bot: {
        name: "WhatsApp Bot AI",
        prefix: "!",
        adminNumbers: ["6281284565941@c.us"], // Format: ["6281234567890@c.us"]
    },
    features: {
        autoReply: true,
        aiChat: true,
        groupManagement: true,
        mediaSupport: true,
        broadcast: true,
    },
    keywords: {
        "!help": "📋 *Daftar Perintah Bot*\n\n" +
                "• !help - Menampilkan bantuan\n" +
                "• !ai [pesan] - Chat dengan AI\n" +
                "• !sticker - Ubah gambar jadi stiker\n" +
                "• !broadcast [pesan] - Kirim pengumuman (Admin only)\n" +
                "• !info - Informasi bot\n" +
                "• !menu - Menampilkan menu utama",
        
        "!menu": "🤖 *Menu Bot WhatsApp*\n\n" +
                "1️⃣ Chat dengan AI - gunakan !ai [pertanyaan]\n" +
                "2️⃣ Buat Stiker - kirim gambar + caption !sticker\n" +
                "3️⃣ Info Bot - ketik !info\n" +
                "4️⃣ Bantuan - ketik !help",
        
        "!info": "ℹ️ *Informasi Bot*\n\n" +
                "🤖 Nama: WhatsApp Panel Rzky\n" +
                "⚡ Powered by: Doa Ibu\n" +
                "📦 Framework: Node.js\n" +
                "🚀 Status: Online",
    },
    welcomeMessage: "👋 Halo! Selamat datang di grup ini! 🎉\n\nJangan lupa baca deskripsi grup ya. Ketik !help untuk melihat fitur bot.",
    
    dashboard: {
        port: 5000,
        enabled: true,
    },
};

module.exports = config;
