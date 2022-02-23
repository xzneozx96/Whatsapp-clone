const mongoose = require("mongoose");
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
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("conversation", ConversationSchema);
