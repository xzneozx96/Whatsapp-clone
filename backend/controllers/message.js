const Conversation = require("../models/conversation");
const Message = require("../models/message");

// send new message
const newMessage = async (req, res) => {
  try {
    // create new message
    const { conversationId, senderId, message } = req.body;

    const new_msg = new Message({
      conversationId,
      senderId,
      message,
    });

    await new_msg.save();

    // update latestMsg field from the Cwhere this new_msg belongs to
    await Conversation.findByIdAndUpdate(conversationId, {
      latestMsg: new_msg.message,
    });

    res.status(201).json({
      new_msg,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Message has not been sent due to internal server error. Please try again later !",
    });
  }
};

// get all messasges from a conversation
const conversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation_messages = await Message.find({
      conversationId,
    });

    res.status(200).json({
      conversation_messages,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Internal server error. Please try again later !",
    });
  }
};

module.exports = {
  newMessage,
  conversationMessages,
};
