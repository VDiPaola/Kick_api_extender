//executes function in main 'world'
export async function execScript(tabId, func, args=[]) {
    const [{result}] = await chrome.scripting.executeScript({
      func,
      args,
      target: {
        tabId: tabId ??
          (await getCurrentTab()).id
      },
      world: 'MAIN',
    });
    return result;
}

//gets current tab
export async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}
