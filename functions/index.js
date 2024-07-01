const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const socketio = require("socket.io");

admin.initializeApp();
const app = express();
const server = require("http").server(app);
const io = socketio(server);

// Socket.io event listeners 
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("chat", (message) => {
    console.log("Message:", message);
    io.emit("chat", message); // Broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Export the app as a Firebase HTTP function
// exports.app = functions.https.onRequest(app);
