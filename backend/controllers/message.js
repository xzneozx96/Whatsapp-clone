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

    return res.status(201).json({
      new_msg,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
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

    return res.status(200).json({
      conversation_messages,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      msg: "Internal server error. Please try again later !",
    });
  }
};

const conversationPaginatedMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const page = +req.query.page || 1; // if the query page does not exist, user will be redirected to page 1

    const messages_per_page = 30; // number of messasges returned on pagination

    // find all messages that that belong to a conversation
    // number of messages that belong to a conversation
    const total_messages = await Message.find({
      conversationId,
    }).countDocuments();

    const paginated_messages = await Message.find({
      conversationId,
    })
      .sort({ $natural: -1 }) // fetch latest messages
      .skip((page - 1) * messages_per_page) // ignore items from previous page
      .limit(messages_per_page); // ignore items from next page

    return res.status(200).json({
      conversation_messages: paginated_messages,
      pagination: {
        currentPage: page,
        hasNextPage: messages_per_page * page < total_messages,
        hasPrevpage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        lastPage: Math.ceil(total_messages / messages_per_page),
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Internal Server Error. Fetcching paginated messages failed !",
    });
  }
};

const fileUpload = (req, res) => {
  if (req.file) {
    return res.status(200).json({
      url: req.file.filename,
    });
  }

  return res.status(500).json({
    success: false,
    msg: "No file selected",
  });
};

module.exports = {
  newMessage,
  conversationMessages,
  conversationPaginatedMessages,
  fileUpload,
};
