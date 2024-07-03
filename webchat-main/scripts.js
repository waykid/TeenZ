let currentUser = 1;
const socket = new WebSocket('ws://localhost:8080');

socket.onopen = function() {
    console.log('Connected to WebSocket server');
};

socket.onmessage = function(event) {
    if (typeof event.data === 'string') {
        try {
            const messageData = JSON.parse(event.data);
            displayMessage(messageData.user, messageData.text);
        } catch (error) {
            console.error('Error parsing JSON message:', error);
        }
    } else if (event.data instanceof Blob) {
        // Handle Blob data (if needed)
        console.log('Received Blob data:', event.data);
        const reader = new FileReader();
        reader.onload = function() {
            try {
                const messageText = JSON.parse(reader.result);
                displayMessage(messageText.user, messageText.text);
            } catch (error) {
                console.error('Error parsing Blob data:', error);
            }
        };
        reader.readAsText(event.data);
    } else {
        console.warn('Unsupported message type:', event.data);
    }
};

socket.onclose = function(event) {
    console.log('WebSocket closed:', event);
    // Perform cleanup or reconnection logic if needed
};



socket.onerror = function(error) {
    console.error('WebSocket Error:', error);
};

function toggleUser() {
    currentUser = currentUser === 1 ? 2 : 1;
    alert(`Switched to User ${currentUser}`);
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();

    if (messageText !== '') {
        const messageData = { user: `User ${currentUser}`, text: messageText };
        
        // Send the message via WebSocket
        socket.send(JSON.stringify(messageData));
        
        // Clear the message input field
        messageInput.value = '';
    }
}



function displayMessage(user, text) {
    const chatMessages = document.getElementById('chat-messages');
    
    // Check if the last displayed message is from the same user to prevent duplicates
    const lastMessage = chatMessages.lastElementChild;
    if (lastMessage && lastMessage.querySelector('.user').textContent === `${user}:`) {
        // Append to the existing message instead of creating a new one
        const textElement = document.createElement('span');
        textElement.classList.add('text');
        textElement.textContent = ` ${text}`;

        lastMessage.appendChild(textElement);
    } else {
        // Create a new message element
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');

        const userElement = document.createElement('span');
        userElement.classList.add('user');
        userElement.textContent = `${user}:`;

        const textElement = document.createElement('span');
        textElement.classList.add('text');
        textElement.textContent = ` ${text}`;

        messageElement.appendChild(userElement);
        messageElement.appendChild(textElement);

        chatMessages.appendChild(messageElement);
    }

    // Scroll to the bottom of the chat window
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


function enterKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
        return false; // Prevent the default form submission
    }
    return true;
}
