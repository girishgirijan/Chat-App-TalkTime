const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const socket = require("socket.io");

const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

//User routes
app.use("/api/auth", userRoutes);

//Message routes
app.use("/api/messages", messageRoutes);

//Connecting to moongose
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected successfully!");
  })
  .catch((err) => {
    console.log(err.message);
  });

//Connecting to server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server connected on port  ${process.env.PORT}`);
});

//Socket

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});
