import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { initialMessage } from "./context.js";
import Entre from "../../models/entre.js";
import Investor from "../../models/investor.js";

dotenv.config();

const generateId = () => Math.random().toString(36).slice(2, 15);

const buildSystemPromptEntre = (user) => ({
    id: generateId(),
    role: "user",
    content:
      `You are an AI assistant on EntreConnect, designed to support entrepreneurs with practical startup advice, investor readiness, networking strategies, and platform usage.\n` +
      `The current user is an entrepreneur. Here's their profile context:\n` +
      `- Name: ${user.username}\n` +
      `- Startup stage: ${user.startupStage}\n` +
      `- Experience: ${user.experience}\n` +
      `- Team size: ${user.teamSize}\n` +
      `- Average investor rating: ${user.averageRating}\n` +
      `- Pitch video uploaded: ${user.videopath ? "Yes" : "No"}\n\n` +
  
      `Instructions:\n` +
      `- Tailor responses to startup founders — focus on helping them connect with investors, improve their pitch, find collaborators, and grow effectively.\n` +
      `- Offer guidance relevant to their startup stage and experience level.\n` +
      `- Avoid emojis, special characters, markdown, or formatting.\n` +
      `- Keep responses clear, concise, and under 100 words unless more detail is requested.\n` +
      `- Always use plain, professional language.\n`
  });
  

  const buildSystemPromptInvestor = (user) => ({
    id: generateId(),
    role: "user",
    content:
      `You are an AI assistant on EntreConnect, supporting investors who are exploring startups, evaluating opportunities, and looking to connect with promising founders.\n` +
      `The current user is an investor. Here's their profile context:\n` +
      `- Name: ${user.username}\n` +
      `- Domain of interest: ${user.domain}\n` +
      `- Years of experience: ${user.experience}\n` +
      `- Open to funding: ${user.willFund}\n` +
      `- Areas of expertise: ${user.expertise}\n\n` +
  
      `Instructions:\n` +
      `- Tailor responses to investors — focus on helping them discover credible startups, assess founder potential, and navigate platform tools.\n` +
      `- You may assist with sourcing startup leads, reviewing pitch strategies, understanding sectors, or connecting with entrepreneurs.\n` +
      `- Do not use emojis or special characters.\n` +
      `- Do not use markdown or bold formatting.\n` +
      `- Keep replies under 100 words unless explicitly asked for more detail.\n` +
      `- Always use plain, professional language.\n`
  });
  
  

const buildGoogleGenAIPrompt1 = (messages, user, role) => [
    role === "investor" ? buildSystemPromptInvestor(user) : buildSystemPromptEntre(user),
    { id: generateId(), role: initialMessage.role, content: initialMessage.content },
    ...messages.map((message) => ({
        id: message.id || generateId(),
        role: message.role,
        content: message.content,
    })),
];

const buildGoogleGenAIPrompt = (messages) => [
    // role === "investor" ? buildSystemPromptInvestor(user) : buildSystemPromptEntre(user),
    { id: generateId(), role: initialMessage.role, content: initialMessage.content },
    ...messages.map((message) => ({
        id: message.id || generateId(),
        role: message.role,
        content: message.content,
    })),
];

let user;

const getUserDetails = async (emailid, role) => {
    if (user)
        return user;

    try {
        if (role === "investor")
            user = await Investor.findOne({emailid});
        else
            user = await Entre.findOne({emailid});

        return user;
    } catch (error) {
        console.log("error in getting user details for chatbot");
    }
}

const getResponse = async (req, res) => {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }
        const { messages, role } = req.body;
        const emailid = req.user.emailid;
        const currUser = await getUserDetails(emailid, role); 

        // console.log("this is the curr user ->", currUser);

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const conversation = buildGoogleGenAIPrompt1(messages, currUser, role);

        const result = await model.generateContent({
            contents: conversation.map(({ role, content }) => ({
                role,
                parts: [{ text: content }],
            })),
        });

        const responseText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
        console.log(responseText);

        res.json({ response: responseText });

    } catch (error) {
        console.error("Error in chatbot API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default getResponse;
