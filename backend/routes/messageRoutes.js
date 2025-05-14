import express from "express";
import { sendMessage, getMessage } from "../controllers/messageControllers.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/",verifyToken,sendMessage);
router.get("/:convoId",verifyToken,getMessage);

export default router;