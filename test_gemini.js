const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function test() {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: "Say hello in one word",
        });
        
        console.log("Response type:", typeof response);
        console.log("Response keys:", Object.keys(response));
        console.log("Text type:", typeof response.text);
        console.log("Text value:", response.text);
        
        if (typeof response.text === 'function') {
            console.log("Text is a function, calling it...");
            const textResult = await response.text();
            console.log("Text result:", textResult);
        } else {
            console.log("Text is a property, value:", response.text);
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}

test();
