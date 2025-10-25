const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function chatWithAI(message, conversationHistory = []) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return "❌ API key Gemini belum dikonfigurasi. Silakan hubungi administrator.";
        }

        const prompt = conversationHistory.length > 0 
            ? `Konteks percakapan sebelumnya:\n${conversationHistory.join('\n')}\n\nPesan baru: ${message}`
            : message;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: prompt,
        });

        if (response && response.text) {
            const textType = typeof response.text;
            console.log(`[Gemini Debug] Response text type: ${textType}`);
            
            if (textType === 'string') {
                return response.text;
            } else if (textType === 'function') {
                return await response.text();
            }
        }
        
        return "Maaf, saya tidak dapat memproses permintaan Anda.";
    } catch (error) {
        console.error("Error in Gemini AI:", error);
        if (error.message && error.message.includes('API key')) {
            return "❌ Terjadi masalah dengan API key Gemini. Silakan periksa konfigurasi.";
        }
        return "Maaf, terjadi kesalahan saat memproses permintaan Anda. Error: " + error.message;
    }
}

async function analyzeImageWithAI(imageBase64, mimeType = "image/jpeg") {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return "❌ API key Gemini belum dikonfigurasi. Silakan hubungi administrator.";
        }

        const contents = [
            {
                inlineData: {
                    data: imageBase64,
                    mimeType: mimeType,
                },
            },
            "Analisis gambar ini secara detail dan jelaskan apa yang kamu lihat dalam bahasa Indonesia.",
        ];

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: contents,
        });

        if (response && response.text) {
            const textType = typeof response.text;
            console.log(`[Gemini Image Debug] Response text type: ${textType}`);
            
            if (textType === 'string') {
                return response.text;
            } else if (textType === 'function') {
                return await response.text();
            }
        }

        return "Tidak dapat menganalisis gambar.";
    } catch (error) {
        console.error("Error analyzing image:", error);
        if (error.message && error.message.includes('API key')) {
            return "❌ Terjadi masalah dengan API key Gemini. Silakan periksa konfigurasi.";
        }
        return "Maaf, terjadi kesalahan saat menganalisis gambar. Error: " + error.message;
    }
}

module.exports = {
    chatWithAI,
    analyzeImageWithAI,
};
