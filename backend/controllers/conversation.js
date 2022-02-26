const Conversation = require("../models/conversation");
const User = require("../models/user");

// create new conversation
const newConversation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    // if there has already a conversation whose members includes both sender and receiver, we will not create a new one and simple the duplicated conversation
    const duplicated_conversation = await Conversation.findOne({
      members: [senderId, receiverId],
    });

    if (duplicated_conversation) {
      return res.status(201).json({
        new_conversation: duplicated_conversation,
      });
    }

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
    })
      .sort({ $natural: -1 })
      .populate("members", "username");

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

const searchUsers = async (req, res) => {
  try {
    const { searchName } = req.body;

    let users;

    if (searchName.length === 0) {
      users = await User.find({}).limit(5).select("username");
    } else {
      users = await User.find({
        username: { $regex: searchName, $options: "i" },
      }).select("username");
    }

    return res.status(200).json({
      users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "No users found due to internal server error. Please try again later !",
    });
  }
};

module.exports = {
  newConversation,
  myConversations,
  getSingleConversation,
  searchUsers,
};
