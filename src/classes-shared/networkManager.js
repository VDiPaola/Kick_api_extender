import { Token } from "../content-scripts/classes/Helpers";
const API = window.location.origin + "/"
export class NetworkManager{

    static async buildOptions(body={}, method="POST", hasBearer=true, contentType="application/json"){
        const token = await Token.get();
        const options = 
            {
                "headers": {
                    "Accept": "application/json, text/plain, */*",
                    "content-type":contentType,
                    "Authorization": "Bearer " + token,
                    "X-XSRF-TOKEN": token,
                   "x-amz-acl": "public-read",

                },
                "body": typeof(body) == "string" ? body : JSON.stringify(body),
                "method": method,
                "mode": "cors",
                "credentials": "include"
            };
        if (!hasBearer) {
            delete options.headers["Authorization"];
        }
       return options;
    }

    //basic get
    static REQUEST(endpoint, option={}){
        return new Promise((resolve,reject)=>{
            fetch(API + endpoint, option)
            .then(res => res.json())
            .then(res => resolve(res))
            .catch(err => reject(err));
        })
    }

    //gets id of user by the given username
    static getUserId = (username) => {
        return this.REQUEST(`api/v1/channels/${username}`);
    }

    //gets the id of current logged in user
    static getCurrentUserId = ()  => {
        return this.REQUEST("api/v1/user");
    }

    //gets the auth token needed for websockets
    static getWebsocketAuth = async (socketId, channelName) => {
        const options = await this.buildOptions(`socket_id=${socketId}&channel_name=${channelName}`,"POST", true,"application/x-www-form-urlencoded");
        return this.REQUEST("broadcasting/auth", options);
    }

}