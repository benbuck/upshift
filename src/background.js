// upshift - Copyright (C) 2011 Benbuck Nason

//console.log("background.js");

function updateIcon(tabId) {
	//console.log("updateIcon: " + tabId);
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

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
	//console.log("onUpdated: " + tabId);
	updateIcon(tabId);
});

chrome.commands.onCommand.addListener(function(command) {
	//console.log('Command:', command);
	if (command == "upshift_one_level") {
		chrome.tabs.getSelected(null, function(tab) {
			chrome.pageAction.hide(tab.id);
			var uris = upshift.get(tab.url);
			//console.log("upshifting to " + uris[0]);
			chrome.tabs.update(tab.id, {'url': uris[0]});
		});
	}
});
