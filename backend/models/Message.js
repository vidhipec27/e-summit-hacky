import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: String, 
      required: true,
    },
    receiver: {
      type: String, 
      required: true,
    },
    senderName: {
      type: String,
      required: false,
    },
    receiverName: {
      type: String,
      required: false
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("messages", schema);
export default Message;
