const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const PORT = process.env.PORT || 8080;
const router = require("./router");

const app = express();
app.use(router);

const server = http.createServer(app);

const io = socketio(server);
io.on("connect", socket => {
  console.log(`received 'connect' request from ${socket.id}`);

  socket.on("join", ({ name, room }, callback) => {
    callback();
  });

  socket.on("disconnect", () => {
    console.log("received 'disconnect' request from socket");
  });
});

server.listen(PORT, () => console.log(`server is listening on port ${PORT}`));
