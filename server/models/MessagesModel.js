import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: false,
  },
  content: {
    type: String,
    required: function () {
      return this.messageType === "text";
    },
  },
  messageType: {
    type: String, // or your specific type
    enum: ["text", "file"],
    required: true,
  },
  fileUrl: {
    type: String,
    required: function () {
      return this.messageType === "file";
    },
  },
  Timestamp: {
    type: Date,
    default: Date.now,
    // required: false,
  },
});

const Message = mongoose.model("Messages", messageSchema);

export default Message;
