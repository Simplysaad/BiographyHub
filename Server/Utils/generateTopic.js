const { GoogleGenAI, Type } = require("@google/genai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const systemInstruction =
    "respond with a single response, straight to the point, nothing more";
async function generateTopic() {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents:
            "Return a single topic on either of these categories: artificial intelligence, technology, digital marketing or productivity",
        config: {
            systemInstruction
        }
    });
    return response.text;
}

module.exports = generateTopic;


// Here are the main Gemini models available with the API right now:

// 1. *Gemini 2.5 Pro* (`gemini-2.5-pro`)
// 2. *Gemini 2.5 Flash* (`gemini-2.5-flash`)
// 3. *Gemini 2.5 Flash-Lite Preview* (`gemini-2.5-flash-lite-preview-06-17`)
// 4. *Gemini 2.5 Flash Native Audio* (`gemini-2.5-flash-preview-native-audio-dialog`, `gemini-2.5-flash-exp-native-audio-thinking-dialog`)
// 5. *Gemini 2.5 Flash Preview TTS* (`gemini-2.5-flash-preview-tts`)
// 6. *Gemini 2.5 Pro Preview TTS* (`gemini-2.5-pro-preview-tts`)
// 7. *Gemini 2.0 Flash* (`gemini-2.0-flash`)
// 8. *Gemini 2.0 Flash Preview Image Generation* (`gemini-2.0-flash-preview-image-generation`)
// 9. *Gemini 2.0 Flash-Lite* (`gemini-2.0-flash-lite`)
// 10. *Gemini 1.5 Flash* (`gemini-1.5-flash`)
// 11. *Gemini 1.5 Flash-8B* (`gemini-1.5-flash-8b`)
// 12. *Gemini 1.5 Pro* (`gemini-1.5-pro`)
// 13. *Gemini Embedding* (`gemini-embedding-001`)

// There are also special models for images, audio, and video. Want details on what each model is best for?