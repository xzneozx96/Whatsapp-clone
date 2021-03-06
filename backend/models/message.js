const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    files: [
      {
        path: {
          type: String,
          required: true,
        },
        fileType: {
          type: String,
          required: true,
        },
        fileName: {
          type: String,
          required: true,
        },
      },
    ],
    sent: {
      type: Boolean,
      default: true,
    },
    replyTo: {
      type: String,
      ref: "message", // define ref to the same schema
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", MessageSchema);
