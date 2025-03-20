import express, { Router } from "express";
import getResponse from "../controllers/gemini/chatbot.js";

const router = express.Router();

router.post("/gemini", getResponse);

export default router;