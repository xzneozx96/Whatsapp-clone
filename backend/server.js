const express = require("express");
const app = express();
const cors = require("cors");
const config = require("./config");
const http = require("http");
const mongoose = require("mongoose");

const PORT = config.serverPort;

// register routes
const conversationRoutes = require("./routes/conversation");
const messageRoutes = require("./routes/message");

// middlewares registration

// cross origin resource sharing
const corsOptions = {
  origin: config.appDomain,
  credentials: true, //access-control-allow-credentials:true
};
app.use(cors(corsOptions));

// built-in middleware to handle url-encoded data - also called form data so to say
app.use(express.urlencoded({ extended: false }));

// built-in middleware to handle json data submitted via the url
app.use(express.json());

// routes registration
// routes
app.use("/api/conversation", conversationRoutes);
app.use("/api/message", messageRoutes);

// connecting to MongoAtlas via Mongoose
mongoose
  .connect(config.dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // set up socket server
    const myServer = http.createServer(app);

    const socketServer = require("./socket");
    socketServer(myServer);
    console.log("Database has been connected ! Server listening on port 3500");
    myServer.listen(PORT);
  })
  .catch((err) => {
    console.log("Connecting to DB has failed", err);
  });
