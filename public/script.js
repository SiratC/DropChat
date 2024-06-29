const socket = io();

// Handle new user joining
const username = prompt('Enter your username:');
socket.emit('join', username);

document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('chat-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

socket.on('message', ({ username, message }) => {
    addMessageToChatBox(username, message, 'other');
});

socket.on('user-connected', (username) => {
    addMessageToChatBox('', `${username} connected`, 'notification');
});

socket.on('user-disconnected', (username) => {
    addMessageToChatBox('', `${username} disconnected`, 'notification');
});

function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    if (message !== '') {
        addMessageToChatBox('You', message, 'user');
        socket.emit('message', message);
        chatInput.value = '';
    }
}

function addMessageToChatBox(username, message, type) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', type === 'user' ? 'user' : 'other');
    messageElement.innerHTML = type === 'notification' ? `<em>${message}</em>` : `<strong>${username}:</strong> ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
