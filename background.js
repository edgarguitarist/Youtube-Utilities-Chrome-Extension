chrome.runtime.onInstalled.addListener(({ reason, version }) => {
  let url = chrome.runtime.getURL("index.html");
  chrome.tabs.create({ url });
});
