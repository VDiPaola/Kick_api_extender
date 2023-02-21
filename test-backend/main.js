const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Handle incoming connections
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Handle incoming messages
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);

    // Echo the message back to the client
    ws.send(`You said: ${message}`);
  });

  // Handle disconnections
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
