//gets current tab
async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

(async () => {
    let enableButton = document.getElementById("enabledButton");
    enableButton.addEventListener("click",(event)=>{
        if (enableButton.innerHTML.toLowerCase()[0] == "e") {
            chrome.runtime.sendMessage({ type: 'websocket' });
            enableButton.innerHTML = "Disable"
        }else{
            enableButton.innerHTML = "Enable"
        }
        
    })
})()