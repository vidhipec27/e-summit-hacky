import Conversation from "../models/Conversation.js";

export const getConversation= async (req, res) => {
  try {
    const senderEmail = req.user.emailid; // Extracted from JWT
    const receiverEmail = req.body.receiverEmail; // Sent from frontend

    // Check if a conversation already exists
    let conversation = await Conversation.findOne({
      members: { $all: [senderEmail, receiverEmail] },
    });

    if (!conversation) {
      conversation = new Conversation({
        members: [senderEmail, receiverEmail],
      });
      await conversation.save();
    }

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getAllConvos= async (req, res) => {
  try {
    const userEmail = req.user.emailid;
    const conversations = await Conversation.find({
      members: { $in: [userEmail] },
    });

    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


