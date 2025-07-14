const { GoogleGenAI, Type } = require("@google/genai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const systemInstruction =
    "Write a captivating article on the given topic in a natural, engaging tone, and return the result as actual JSON with four fields: *title* (string), *description* (string for Twitter), *category* (artificial intelligence, technology, digital marketing or productivity), *content* (HTML format), and *keywords* (array of string). Make the article so interesting that readers want to finish it, the description intriguing enough for Twitter, and the title irresistible.";

async function generatePost(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction
        }
    });

    let cleanText = response.text.replace(/```json|```/g, "");
    let formatJson = JSON.parse(cleanText);
    return formatJson;
}

module.exports = generatePost;
