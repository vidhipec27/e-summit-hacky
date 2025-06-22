import express, { Router } from "express";
import getFeedback from "../controllers/gemini/feedback.js";

const router=express.Router();

router.post("/getFeedbackOnTranscript",getFeedback);

export default router;