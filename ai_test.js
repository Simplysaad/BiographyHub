const OpenAI = require("openai");
const dotenv = require("dotenv");
dotenv.config();

// const client = new OpenAI({
//     baseURL: "https://router.huggingface.co/v1/chat/completions';",
//     apiKey: process.env.HF_TOKEN
// });

const { InferenceClient } = require("@huggingface/inference");
const client = new InferenceClient(process.env.HF_TOKEN);

async function generateEssay(prompt) {
    // const response = await client.chat.completions.create({
    const response = await client.chatCompletion({
        model: "deepseek-ai/DeepSeek-V3-0324",
        messages: [
            {
                role: "system",
                content:
                    "Write a detailed, engaging, and well-structured historical article about the requested topic or individual. Start with a captivating introduction, provide key background and context, highlight major events or achievements, and discuss their significance. Use clear language, include interesting facts, and aim for a word count between 1,000 and 2,000 words. Make the content informative, easy to read, and enjoyable for a general audience."
            },
            {
                role: "system",
                content:
                    "don't iclude any unnecessary formatting, don't include the thought process in your response,  just write the exact response to what you're asked"
            },
            { role: "user", content: prompt }
        ]
    });

    console.log(response.choices[0].message);
}
async function generateSummary(prompt) {
    const response = await client.chat.completions.create({
        model: "meta-llama/Llama-2-70b-chat-hf",
        messages: [
            {
                role: "system",
                content:
                    "For the prompt, write a highly engaging summary that sparks curiosity and excitement, making readers eager to dive into the full article. Use captivating language and tease key points to incite a strong desire for more."
            },
            { role: "user", content: prompt }
        ]
    });

    console.log(response.choices[0].message);
}

async function go() {
    let essay = await generateEssay("adolf hitler");
    let summary; //= await generateSummary(essay);
    console.log(essay, summary);
}

go();

// meta-llama/Llama-2-70b-chat-hf
// mistralai/Mixtral-8x7B-Instruct-v0.1
// google/gemma-7b-it
// deepseek-ai/DeepSeek-V3-0324
// tiiuae/falcon-180B-chat
