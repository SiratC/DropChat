(function(){
    const app = document.querySelector(".app");
    const socket = io();

    let uname;

    // Function to join chatroom
    function joinChatroom() {
        let username = app.querySelector(".join-screen #username").value;
        if(username.length == 0){
            return;
        }
        socket.emit("newuser", username);
        uname = username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    }

    app.querySelector(".join-screen #join-user").addEventListener("click", function(){
        joinChatroom();
    });

    app.querySelector(".join-screen #username").addEventListener("keydown", function(event){
        if(event.key === "Enter"){
            joinChatroom();
        }
    });

    // Function to send message
    function sendMessage() {
        let message = app.querySelector(".chat-screen #message-input").value;
        if(message.length == 0){
            return;
        }
        renderMessage("my", {
            username: uname,
            text: message
        });
        socket.emit("chat", {
            username: uname,
            text: message
        });
        app.querySelector(".chat-screen #message-input").value = "";
    }

    app.querySelector(".chat-screen #send-message").addEventListener("click", function(){
        sendMessage();
    });

    app.querySelector(".chat-screen #message-input").addEventListener("keydown", function(event){
        if(event.key === "Enter"){
            sendMessage();
        }
    });

    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function(){
        socket.emit("exituser", uname);
        window.location.href = window.location.href;
    });

    socket.on("update", function(update){
        renderMessage("update", update);
    });
    socket.on("chat", function(message){
        renderMessage("other", message);
    });

    function renderMessage(type, message){
        let messageContainer = app.querySelector(".chat-screen .messages");
        if(type == "my"){
            let n = document.createElement("div");
            n.setAttribute("class", "message my-message");
            n.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(n);

        } else if(type == "other"){
            let n = document.createElement("div");
            n.setAttribute("class", "message other-message");
            n.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(n);
        } else if(type == "update"){
            let n = document.createElement("div");
            n.setAttribute("class", "update");
            n.innerText = message;
            messageContainer.appendChild(n);    
        }
        // Scroll till end
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }

    // Dark/Light Mode Toggle
    const toggleModeButton = document.getElementById('darkmode-lightmode');
    toggleModeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
})();
