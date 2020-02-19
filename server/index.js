const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const { addUser, removeUser, getUser, getUsersInroom } = require("./users");

const PORT = process.env.PORT || 8080;
const router = require("./router");

const app = express();
app.use(router);

const server = http.createServer(app);

const io = socketio(server);
io.on("connect", socket => {
  console.log(`received 'connect' request from ${socket.id}`);

  socket.on("join", ({ name, room }, callback) => {
    const { user, error } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.emit("message", { user: "admin", text: `${user.name}, welcome to the room ${user.room}` });
    socket.broadcast.to(user.room).emit("message", { user: "admin", text: `${user.name} has joined the room` });

    socket.join(user.room);
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", { user: user.name, text: message });
    callback();
  });

  socket.on("disconnect", () => {
    console.log("received 'disconnect' request from socket");
  });
});

server.listen(PORT, () => console.log(`server is listening on port ${PORT}`));
