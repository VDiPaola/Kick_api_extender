const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

const connections = {}
let kickSocket = null
const websocketConfig = {
  wsKey: null,
  wsCluster: null
}

// Handle incoming connections
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Handle incoming messages
  ws.on('message', (response) => {
    response = JSON.parse(response)
    console.log(`Websocket Received message`);

    if (response.message == "initialise_connection"){
      const channelId = response.data.channelId
      websocketConfig.wsCluster = response.data.wsCluster
      websocketConfig.wsKey = response.data.wsKey
      kickSocket = new WebSocket(`wss://ws-${response.data.wsCluster}.pusher.com/app/${response.data.wsKey}?protocol=7&client=js&version=7.4.0&flash=false`);
      kickSocket.on('error', console.error);
      kickSocket.on('open', (event) => {
        console.log('WebSocket connection established.');
      });
      kickSocket.on('message', (kickResponse) => {
        console.log("KickSocket recieved message: ")
        kickResponse = JSON.parse(kickResponse)
        console.log(kickResponse)
        if (kickResponse.event == "pusher:connection_established"){
          let parsedData = JSON.parse(kickResponse.data)
          let socketId = parsedData.socket_id
          ws.send(JSON.stringify({message:"websocket_auth", data:{socketId, channelName:"private-channel." + channelId}}))
        }
      });
  
      kickSocket.on('close', (event) => {
        console.log('WebSocket connection closed.');
      });
    }else if (response.message = "websocket_auth" && kickSocket) {
      kickSocket.send(JSON.stringify( {
        event:"pusher:subscribe",
        data:{auth:response.data.auth,channel:response.data.channelName}
    
      }))
    }
  });

  // Handle disconnections
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
