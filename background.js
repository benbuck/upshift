// upshift - Copyright (C) 2011 Benbuck Nason

function updateIcon(tabId) {
	//console.log("get: " + tab.url);
	chrome.pageAction.show(tabId);
}

chrome.tabs.onSelectionChanged.addListener(function(tabId) {
	//console.log("onSelectionChanged: " + tabId);
	updateIcon(tabId);
});

chrome.tabs.getSelected(null, function(tab) {
	//console.log("getSelected: " + tab.id);
	updateIcon(tab.id);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	//console.log("onUpdated: " + tabId);
	updateIcon(tabId);
});

chrome.extension.onMessage.addListener(function(msg) {
	//console.log("onMessage: " + msg);
	if (msg.upshiftCount) {
		chrome.tabs.getSelected(null, function(tab) {
			chrome.pageAction.hide(tab.id);
			var uris = upshift.get(tab.url);
			var upshiftCount = (msg.upshiftCount < uris.length) ? msg.upshiftCount : uris.length - 1;
			//console.log("upshifting " + upshiftCount + " to " + uris[upshiftCount]);
			chrome.tabs.update(tab.id, {'url': uris[upshiftCount]});
		});
	}
});
