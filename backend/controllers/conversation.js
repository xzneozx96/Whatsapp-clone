const Conversation = require("../models/conversation");
const mongoose = require("mongoose");

// create new conversation
const newConversation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    const new_conversation = new Conversation({
      members: [senderId, receiverId],
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
      members: { $in: userId },
    }).populate("members", "username");

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
    const conversation = await Conversation.findById(conversationId).populate(
      "members",
      "username"
    );

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
