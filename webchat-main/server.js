const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

// Store connected clients
const clients = [];

server.on('connection', socket => {
    // Add new client to the clients array
    clients.push(socket);

    socket.on('message', message => {
        // Broadcast the message to all connected clients except the sender
        clients.forEach(client => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    socket.on('close', () => {
        // Remove client from clients array on close
        clients.splice(clients.indexOf(socket), 1);
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
