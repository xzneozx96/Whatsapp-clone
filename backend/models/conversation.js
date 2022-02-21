const mongoose = require("mongoose");

var MemberSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
});

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
      default: [],
    },
    latestMsg: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("conversation", ConversationSchema);
