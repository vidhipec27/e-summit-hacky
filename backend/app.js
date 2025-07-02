import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { connectDb } from "./db.js";
import { verifyToken } from "./middleware/verifyToken.js";
import { initializeSocket } from "./socket.js";
import { addFeedback } from "./controllers/entreControllers.js";
import { createClient } from 'redis';

dotenv.config(); 

const app = express();
const server = createServer(app); 
initializeSocket(server); 

app.use(cors());
app.use(express.json());

const client = createClient( {url: process.env.REDIS_URL});
await client.connect();
const DEFAULT_EXPIRATION = 3600 //setting expiration time for redis cache as one hour
console.log("redis client connected!");

export { client };

import authRoutes from "./routes/authRoutes.js";
import searchRoutes from "./routes/searchRoute.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import aiFeedbackRoute from "./routes/aiFeedbackRoute.js"

app.use("/auth", authRoutes);
app.use("/search", searchRoutes);
app.use("/api", chatbotRoutes);
app.use("/api/conversations", verifyToken, conversationRoutes);
app.use("/api/messages", verifyToken, messageRoutes);
app.use("/addFeedback/:emailid",verifyToken, addFeedback);
app.use("/feedback",aiFeedbackRoute);

const PORT = process.env.PORT || 5050;
server.listen(PORT, async () => {
  await connectDb();
  console.log(`🚀 Server running on port ${PORT}`);
});
