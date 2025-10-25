const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function chatWithAI(message, conversationHistory = []) {
    try {
        const prompt = conversationHistory.length > 0 
            ? `Konteks percakapan sebelumnya:\n${conversationHistory.join('\n')}\n\nPesan baru: ${message}`
            : message;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: prompt,
        });

        return response.text || "Maaf, saya tidak dapat memproses permintaan Anda.";
    } catch (error) {
        console.error("Error in Gemini AI:", error);
        return "Maaf, terjadi kesalahan saat memproses permintaan Anda.";
    }
}

async function analyzeImageWithAI(imageBase64, mimeType = "image/jpeg") {
    try {
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

        return response.text || "Tidak dapat menganalisis gambar.";
    } catch (error) {
        console.error("Error analyzing image:", error);
        return "Maaf, terjadi kesalahan saat menganalisis gambar.";
    }
}

module.exports = {
    chatWithAI,
    analyzeImageWithAI,
};
