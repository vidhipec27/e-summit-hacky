import express, { Router } from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import getResponse from "../controllers/gemini/chatbot.js";

const router = express.Router();

router.post("/gemini", verifyToken, getResponse);

export default router;