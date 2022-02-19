const socketIO = require("socket.io");

const socketServer = (server) => {
  const io = socketIO(server);

  io.on("connection", (socket) => {
    // "join" is the name of the event that will be fired on the front-end every time a user visit our app. The server is simple listening to this "join" event
    socket.on("join", async (user) => {
      console.log("New user has joined", user, socket.id);

      io.to(socket.id).emit("typing", user);
    });
  });
};

module.exports = socketServer;
