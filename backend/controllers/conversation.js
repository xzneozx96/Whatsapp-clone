const Conversation = require("../models/conversation");

// create new conversation
const newConversation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    const new_conversation = new Conversation({
      members: [senderId, receiverId],
    });

    await new_conversation.save();

    res.status(201).json({
      new_conversation,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
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
      members: { $in: [userId] },
    });

    res.status(200).json({
      my_conversations,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "No conversations found due to internal server error. Please try again later !",
    });
  }
};

module.exports = {
  newConversation,
  myConversations,
};
