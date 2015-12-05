// upshift - Copyright (C) 2011 Benbuck Nason

if (window == top) {
	window.addEventListener('keyup', function (keyEvent) {
		//console.log("keyup");
		if (keyEvent.altKey && (keyEvent.keyIdentifier == "Up") && !keyEvent.ctrlKey && !keyEvent.shiftKey && !keyEvent.metaKey)
			chrome.extension.sendMessage({upshiftCount: 1});
	});
}
