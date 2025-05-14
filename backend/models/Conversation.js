import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    members: {
      type: [String], // Array of user emails
      required: true,
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("conversations", schema);
export default Conversation;
