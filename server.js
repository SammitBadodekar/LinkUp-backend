const express = require("express");
const app = express();
const { Server } = require("socket.io");
const port = process.env.PORT || 3001;
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const UserModel = require("./models/UserModel");

const allowedOrigins = [
  "http://localhost:3000",
  "https://linkup-chat.vercel.app",
];

const server = http.createServer(app);
app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,PUT,POST,DELETE",
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: "GET,PUT,POST,DELETE",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("send_message", (data) => {
    console.log(data);
    if (data?.to === "Chat Lounge") {
      socket.broadcast.emit("broadcast", data);
    } else {
      io.to(`${data.to}`).emit("receive_message", data);
    }
  });
  socket.on("join_self", (data) => {
    socket.join(`${data.email}`);
    console.log("joined", data.email);
  });
  socket.on("send_request", (data) => {
    io.to(`${data.receiver?.email}`).emit("receive_request", data);
  });
});

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

mongoose.connect(process.env.MONGO_URI);

app.get("/getAllUsers", (req, res) => {
  UserModel.find({}, { name: 1, email: 1, image: 1 })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.send(error);
    });
});
