const express = require("express");
const app = express();
const { Server } = require("socket.io");
const port = process.env.PORT || 3001;
const cors = require("cors");
const http = require("http");

const server = http.createServer(app);
server.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,PUT,POST,DELETE",
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: "GET,PUT,POST,DELETE",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(socket?.id);

  socket.on("send_message", (data) => {
    console.log(data);
    socket.broadcast.emit("broadcast", data);
  });
});

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
