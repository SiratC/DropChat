const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Allow frontend requests

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow all frontend connections
        methods: ["GET", "POST"]
    }
});

// WebSocket Events
io.on("connection", function(socket){
    console.log("A user connected");

    socket.on("newuser", function(username){
        socket.broadcast.emit("update", username + " has entered the chat.");
    });

    socket.on("exituser", function(username){  
        socket.broadcast.emit("update", username + " has left the chat.");
    });

    socket.on("chat", function(message){
        socket.broadcast.emit("chat", message);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

