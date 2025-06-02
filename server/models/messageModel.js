import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: String,
    senderId: String,
    text: String,
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Messagemodel", messageSchema);

export default Message;
