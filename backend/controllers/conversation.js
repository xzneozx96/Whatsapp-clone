const Conversation = require("../models/conversation");
const User = require("../models/user");

// create new conversation
const newConversation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    const sender = await User.findOne({ _id: senderId }, "_id, username");
    const receiver = await User.findOne({ _id: receiverId }, "_id, username");

    const new_conversation = new Conversation({
      members: [
        { username: sender.username, userId: sender._id.toString() },
        { username: receiver.username, userId: receiver._id.toString() },
      ],
    });

    await new_conversation.save();

    return res.status(201).json({
      new_conversation,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      msg: "Message has not been sent due to internal server error. Please try again later !",
    });
  }
};

// get all conversations of a user
const myConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    const my_conversations = await Conversation.find({
      // "members._id": { $in: [userId] },
      members: { $elemMatch: { userId: userId } },
    });

    return res.status(200).json({
      my_conversations,
    });
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({
      success: false,
      msg: "No conversations found due to internal server error. Please try again later !",
    });
  }
};

const getSingleConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);

    return res.status(200).json({
      conversation,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "No conversations found due to internal server error. Please try again later !",
    });
  }
};

module.exports = {
  newConversation,
  myConversations,
  getSingleConversation,
};
