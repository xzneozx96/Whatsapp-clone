const http = require("http");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();

const config = require("./config");
const verifyJWT = require("./middleware/verifyJWT");
const fileUpload = require("./middleware/fileUpload");

const PORT = config.serverPort;

// register routes
const authRoutes = require("./routes/auth");
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
app.use(express.urlencoded({ extended: true }));

// built-in middleware to handle json data submitted via the url
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// multer middleware
app.use(fileUpload.filesUpload.array("files"));

// set "uploads" as static folder that contains the static files we want to serve the client
app.use("/uploads", express.static(__dirname + "/uploads"));

// routes registration
app.use("/api/auth", authRoutes);

// app.use(verifyJWT);
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
    myServer.listen(PORT);

    console.log("Database has been connected ! Server listening on port 3500");
    return Promise.resolve("Database connected");
  })
  .catch((err) => {
    console.log("Connecting to DB has failed", err);
    return Promise.reject("Internal Server Error");
  });
