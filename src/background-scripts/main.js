chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    if (data.type === "token"){
        chrome.cookies.get({name:"XSRF-TOKEN", url:"https://kick.com"})
        .then(token=>{
            chrome.tabs.sendMessage(sender.tab.id, {type:"token", message:token?.value})
        })
    }else if (data.type === "websocket"){
    // Attach to the current tab
    let tabId = sender.tab.id
        chrome.debugger.attach({ tabId: tabId }, '1.0', () => {
            // Enable the Network domain
            chrome.debugger.sendCommand({ tabId: tabId }, 'Network.enable', {}, () => {
                // Listen for WebSocket frames
                chrome.debugger.onEvent.addListener((debuggeeId, method, params) => {
                    if (method === 'Network.webSocketFrameReceived') {
                    // Handle incoming WebSocket frame
                    console.log('Received WebSocket frame:', params.response.payloadData);
                    let frame = JSON.parse(params.response.payloadData)
                    let event = frame.event
                    let data = JSON.parse(frame.data)
                    console.log(event)
                    console.log(data)
                    } else if (method === 'Network.webSocketFrameSent') {
                    // Handle outgoing WebSocket frame
                    //console.log('Sent WebSocket frame:', params.response.payloadData);
                    }
                });
            });
        });
    
    }
    else{
        return true;
    }
    
});
//{"event":"App\Events\FollowersUpdated","data":"{"followersCount":2,"channel_id":1106831,"username":null,"created_at":1676943288,"followed":true}","channel":"channel.1106831"}
//{"event":"App\Events\FollowersUpdatedForChannelOwner","data":"{"followersCount":2,"channel_id":1106831,"username":"enzonik","created_at":1676943176,"followed":true}","channel":"private-channel.1106831"}

    // Attach to the current tab
// chrome.debugger.attach({ tabId: tabId }, '1.0', () => {
//     // Enable the Network domain
//     chrome.debugger.sendCommand({ tabId: tabId }, 'Network.enable', {}, () => {
//       // Listen for WebSocket frames
//       chrome.debugger.onEvent.addListener((debuggeeId, method, params) => {
//         if (method === 'Network.webSocketFrameReceived') {
//           // Get the response data for the WebSocket frame
//           chrome.debugger.sendCommand({ tabId: tabId }, 'Network.getResponseBody', { requestId: params.response.requestId }, (response) => {
//             if (response && response.body) {
//               // Handle incoming WebSocket frame
//               console.log('Received WebSocket frame:', response.body);
//             }
//           });
//         } else if (method === 'Network.webSocketFrameSent') {
//           // Get the response data for the WebSocket frame
//           chrome.debugger.sendCommand({ tabId: tabId }, 'Network.getResponseBody', { requestId: params.response.requestId }, (response) => {
//             if (response && response.body) {
//               // Handle outgoing WebSocket frame
//               console.log('Sent WebSocket frame:', response.body);
//             }
//           });
//         }
//       });
//     });
//   });
  