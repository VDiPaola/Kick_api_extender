import { NetworkManager } from "../classes-shared/networkManager";
import {Logger} from './classes/Logger'

export class KickPlus{
    static userData=null;
    static isLoggedIn=false;

    static async onWindowLoad (){
        //get user
        this.userData = await NetworkManager.getCurrentUserId();
        
        //make sure they are logged in
        if (this.userData?.username) {
            this.isLoggedIn = true;

            chrome.runtime.onMessage.addListener(async (data) => {
                if (data.type == "send_websocket_info"){
                    //create websocket with backend
                    const socket = new WebSocket("ws://localhost:8080")
                    socket.addEventListener('open', (_) => {
                        Logger.log('WebSocket connection established.')
                        socket.send(JSON.stringify({message:"initialise_connection", data:{
                            wsCluster:data.message.wsCluster, 
                            wsKey:data.message.wsKey, 
                            channelId:this.userData.streamer_channel.id, 
                            username:this.userData.username}}))
                    });
                    socket.addEventListener("message", (event)=>{
                        event = JSON.parse(event.data)
                        if (event.message == "websocket_auth"){
                            //get websocket auth token for specified channel
                            NetworkManager.getWebsocketAuth(event.data.socketId, event.data.channelName)
                            .then(response => {
                                //send auth to backend
                                socket.send(JSON.stringify({message:"websocket_auth", data:{auth:response?.auth, channelName:event.data.channelName}}) )
                                Logger.log("Enabling Overlays", true)
                            })
                            .catch(err => Logger.error("Couldnt get websocket authentication", err, true))
                            .finally(()=>{
                                socket.close()
                            })
                            
                        }
                    })
                    socket.addEventListener("close", (_)=>{
                        Logger.log("Websocket connection closed.")
                    })
                }
            })
            chrome.runtime.sendMessage({ type: 'request_websocket_info' });
        }
    }
}

window.addEventListener("load", KickPlus.onWindowLoad)




