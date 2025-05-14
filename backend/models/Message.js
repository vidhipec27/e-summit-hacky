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
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("messages", schema);
export default Message;
