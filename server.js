const express = require("express");
const app = express();
const { Server } = require("socket.io");
const port = process.env.PORT || 3001;
const cors = require("cors");
const http = require("http");

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
    socket.broadcast.emit("broadcast", data);
  });
  socket.on("join_self", (data) => {
    socket.join(`${data.email}`);
    console.log("joined", data.email);
  });
  socket.on("send_request", (data) => {
    io.to(`${data.receiver?.email}`).emit("receive_request", data);
    console.log("sent request", data.receiver?.email);
  });
});

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
