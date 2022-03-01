const mongoose = require("mongoose");
const Message = require("./message");
const User = require("./user");

const Schema = mongoose.Schema;

const ConversationSchema = new Schema(
  {
    members: [
      {
        type: String,
        required: true,
        ref: User,
      },
    ],
    latestMsg: {
      type: String,
      ref: Message,
    },
    hasMsg: {
      type: Boolean,
      default: false,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("conversation", ConversationSchema);
