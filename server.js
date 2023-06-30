const express = require("express");
const app = express();
const { Server } = require("socket.io");
const port = process.env.PORT || 3001;
const cors = require("cors");
const http = require("http");

const server = http.createServer(app);
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,PUT,POST,DELETE",
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

const io = new Server(server);

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
