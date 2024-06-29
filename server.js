const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path'); // Include path module

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Store connected users
let users = [];

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle new user connection
    socket.on('join', (username) => {
        const user = {
            id: socket.id,
            username: username
        };
        users.push(user);
        io.emit('user-connected', username);
    });

    // Handle chat messages
    socket.on('message', (msg) => {
        io.emit('message', { username: findUsername(socket.id), message: msg });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const username = findUsername(socket.id);
        if (username) {
            users = users.filter(user => user.id !== socket.id);
            io.emit('user-disconnected', username);
            console.log(`${username} disconnected`);
        }
    });

    // Function to find username by socket id
    function findUsername(socketId) {
        const user = users.find(user => user.id === socketId);
        return user ? user.username : null;
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
