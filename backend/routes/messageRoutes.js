import express from "express";
import Message from "../models/Message.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Send a message
router.post("/", verifyToken, async (req, res) => {
  try {
    const senderEmail = req.user.email; // Extracted from JWT
    const { receiverEmail, text, conversationId } = req.body;

    const newMessage = new Message({
      sender: senderEmail,
      receiver: receiverEmail,
      text,
      conversationId,
    });

    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get messages from a conversation
router.get("/:conversationId", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
