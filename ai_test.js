// // To run this code you need to install the following dependencies:
// // npm install @google/genai mime
// // npm install -D @types/node

// const { GoogleGenAI, Type } = require("@google/genai");

// require("dotenv").config();

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// const systemInstruction =
//     "Write a captivating article on the given topic in a natural, engaging tone, and return the result as actual JSON with four fields: *title* (string), *description* (string for Twitter), *content* (HTML format), and *keywords* (comma-separated string). Make the article so interesting that readers want to finish it, the description intriguing enough for Twitter, and the title irresistible.";

// async function main() {
//     const response = await ai.models.generateContent({
//         model: "gemini-2.5-pro",
//         contents:
//             "How AI code assistants are revolutionizing the way we program",
//         config: {
//             systemInstruction
//         }
//     });
//     console.log(response.text);
// }

// main();

