import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    members: Array,
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chating", chatSchema);

export default Chat;
