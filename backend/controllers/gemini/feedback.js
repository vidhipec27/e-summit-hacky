import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
//import { initialMessage } from "./context.js";

dotenv.config();

const generateId = () => Math.random().toString(36).slice(2, 15);

const initialMessage = {
  role: "user",
  content: "You are an experienced startup mentor. Provide critical yet constructive feedback on startup pitches. Include strengths, weaknesses, and suggestions for improvement."
};

const buildGoogleGenAIPrompt = (messages) => [
    { id: generateId(), role: initialMessage.role, content: initialMessage.content },
    ...messages.map((message) => ({
        id: message.id || generateId(),
        role: message.role,
        content: message.content,
    })),
];

const getFeedback = async (req, res) => {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }
        console.log(req.body);
        const { messages } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const conversation = buildGoogleGenAIPrompt(messages);

        const result = await model.generateContent({
            contents: conversation.map(({ role, content }) => ({
                role,
                parts: [{ text: content }],
            })),
        });
        //console.log("let's log! ",result.response.candidates);
        //const responseText = result?.response?.candidates?.[0]?.content?.parts?.map(p => p.text).join("\n") || "No response";
        const responseText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text|| "No response"
        console.log(responseText);
        res.json({ response: responseText });

    } catch (error) {
        console.error("Error in chatbot API:", error);
        res.status(500).json({ error: error.message });
    }
};

export default getFeedback;
