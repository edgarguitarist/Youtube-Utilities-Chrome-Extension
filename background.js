chrome.runtime.onInstalled.addListener(({ reason, version }) => {
  console.log("onInstalled", reason, version)
  if (reason === "install") {
    chrome.storage.sync.set({ version });
    let url = chrome.runtime.getURL("index.html");
    chrome.tabs.create({ url });
  }
});
