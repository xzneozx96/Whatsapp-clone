const Conversation = require("../models/conversation");

const socketIO = require("socket.io");

const socketServer = (server) => {
  const io = socketIO(server);

  // the below Map object is used to keep track of online & offline users
  let users = new Map();
  let userSockets = new Map();

  io.on("connection", (socket) => {
    // handle when a user connects
    // "join" is the name of the event that will be fired on the front-end every time a user visit our app. The server is simple listening to this "join" event
    socket.on("join", async (userId) => {
      // 1. keep track of online users
      let current_sockets = [];

      if (users.has(userId)) {
        // newly joint user has already joint on other device => add new device by adding new socketId to sockets array, then update the Map object
        const existing_user = users.get(userId);
        existing_user.sockets = [...existing_user.sockets, socket.id];

        users.set(userId, existing_user);

        current_sockets = [...existing_user.sockets, socket.id];

        userSockets.set(socket.id, userId);
      } else {
        // this user has just joint
        // we create an array of sockets so that users can have multiple sockets connected (join from multiple devices) so that when new message arrives, the user will get notified on all devices
        users.set(userId, { userId, sockets: [socket.id] });

        current_sockets.push(socket.id);

        userSockets.set(socket.id, userId);
      }

      // 2. keep track of online friends (people who user is chatting with)
      let online_friends = []; // friends that are online - extracted from the list of chatters

      let chatters = await getChatters(userId); // list of friends that current user has been chatting with

      // notify this user's friend that he/she is now online
      for (let i = 0; i < chatters.length; i++) {
        if (users.has(chatters[i]._id.toString())) {
          const chatter = users.get(chatters[i]._id.toString());

          chatter.sockets.forEach((socketId) => {
            io.to(socketId).emit("online", userId);
          });

          online_friends.push(chatter.userId);
        }
      }

      current_sockets.forEach((socketId) => {
        io.to(socketId).emit("friends", online_friends);
      });
    });

    // handle when user is sending and receiving messages
    socket.on(
      "sendMsg",
      async ({
        _id,
        conversationId,
        senderId,
        receiverId,
        message,
        createdAt,
      }) => {
        const friend = users.get(receiverId);

        friend?.sockets.forEach((socketId) => {
          io.to(socketId).emit("receiveMsg", {
            _id,
            conversationId,
            senderId,
            receiverId,
            message,
            createdAt,
          });
        });
      }
    );

    // handle when a friend is typing
    socket.on("meTyping", (typing_sender) => {
      const receiver = users.get(typing_sender.receiverId);

      if (receiver) {
        receiver.sockets.forEach((socketId) => {
          io.to(socketId).emit("friendTyping", typing_sender);
        });
      }
    });

    // handle when a user leaves
    socket.on("disconnect", async () => {
      // we don't know which user has disconnect, we only know the socket.id

      // remove the active user from users array
      if (userSockets.has(socket.id)) {
        // find user that has just disconnected from the socket.id
        const disconnected_user = users.get(userSockets.get(socket.id));

        // check if this user has disconnected from all devices or not
        if (disconnected_user.sockets.length > 1) {
          // this user has NOT disconnected from all devices
          disconnected_user.sockets = disconnected_user.sockets.filter(
            (socketId) => {
              // remove the socket id of the recent disconnected user from the list of all sockets (userSockets Map)
              userSockets.delete(socket.id);

              return socketId !== socket.id;
            }
          );

          // update the users Map
          users.set(disconnected_user.userId, disconnected_user);
        } else {
          // this user HAS disconnected on all devices
          let chatters = await getChatters(disconnected_user.userId); // list of friends that current user has been chatting with

          // notify this user's friend that he/she is now offline
          for (let i = 0; i < chatters.length; i++) {
            if (users.has(chatters[i]._id.toString())) {
              const chatter = users.get(chatters[i]._id.toString());

              chatter.sockets.forEach((socketId) => {
                io.to(socketId).emit("offline", disconnected_user.userId);
              });
            }
          }

          // update userSockets Map
          userSockets.delete(socket.id);

          // delete the disconnected_user from users Map
          users.delete(disconnected_user.userId);
        }
      }
    });
  });
};

async function getChatters(userId) {
  const my_conversations = await Conversation.find({
    members: { $in: userId },
  }).populate("members", "username");

  return my_conversations.map((conversation) =>
    conversation.members.find((member) => member._id.toString() !== userId)
  );
}

module.exports = socketServer;
