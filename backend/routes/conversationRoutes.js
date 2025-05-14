import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getAllConvos, getConversation } from "../controllers/conversationContr.js";

const router = express.Router();

router.post("/",verifyToken,getConversation);
router.get("/",verifyToken,getAllConvos);

export default router;
