import { waitForElement, onElementObserved,onCustomElementObserved } from "./classes/Helpers";

import { NetworkManager } from "../classes-shared/networkManager";


export class KickPlus{
    static userData=null;
    static isLoggedIn=false;

    static async onWindowLoad (){
        //get user
        this.userData = await NetworkManager.getCurrentUserId();
        
        chrome.runtime.sendMessage({ type: 'websocket' });
        //make sure they are logged in
        if (this.userData?.username) {
            this.isLoggedIn = true;

            console.log(this.userData)
        }
    }
}

window.addEventListener("load", KickPlus.onWindowLoad)