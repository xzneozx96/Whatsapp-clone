const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
  unwantedMessages: {
    type: Array,
    default: [],
  },
  unseenConversation: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("user", UserSchema);
