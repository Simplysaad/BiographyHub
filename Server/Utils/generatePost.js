const { GoogleGenAI, Type } = require("@google/genai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const systemInstruction =
    "Write a captivating, original article on the supplied topic using a lively, human-like style. Return your response as valid JSON with these fields: `title` (irresistible and clickable), `description` (Twitter/X-friendly, punchy, and encourages engagement or clicking the link), `category` (one of: artificial intelligence, technology, digital marketing, or productivity), `content` (rich HTML article), and `keywords` (an array of relevant SEO terms). Make the article so engaging that readers feel compelled to finish and share it. The description should tease, spark curiosity, and fit naturally on Twitter/X with a bit of FOMO or intrigue to nudge people to click or follow to read more.";

async function generatePost(prompt) {
    let contents = `Write a captivating article on the topic: ${prompt}. Follow the system instruction to format the result as JSON with an engaging title, a Twitter-friendly description, relevant category, keywords, and the article body in HTML.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
            systemInstruction
        }
    });
    console.log("generated post", response.text);

    let cleanText = response.text.replace(/```json|```|\*/g, "")
    let formatJson = JSON.parse(cleanText);
    return formatJson;
}

module.exports = generatePost;


