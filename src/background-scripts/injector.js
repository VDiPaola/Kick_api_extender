function customWebsocket({a,b,c}){
  const originalWebSocket = WebSocket;

  WebSocket = function(url, protocols) {
    const socket = new originalWebSocket(url, protocols);
  
    socket.addEventListener('message', (event) => {
      console.log('WebSocket message received:', event.data);
      //chrome.runtime.sendMessage({ type: 'websocketMessage', data: event.data });
    });
  
    return socket;
  };
}


export default class Injector{
  static onMessage(message){
    switch(message){
      case "customWebsocket":
        return customWebsocket;
    }
    
  }
}
