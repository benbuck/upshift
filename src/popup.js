// upshift - Copyright (C) 2011 Benbuck Nason

//console.log("popup.js");

var spanCount;

function init() {
	//console.log("init");
	spanCount = 0;
	chrome.tabs.getSelected(null, function(tab) {
		//console.log("get: " + tab.url);
		buildPopup(tab);

		// for testing:
		//buildPopup({url: "http://usr:pwd@abc.test.co.uk:81/dir/dir.2/dir.3/index.htm?q1=0&&test1&test2=value#top", id: 0});
		//buildPopup({url: "http://www.google.com/search?q=arrow+button+icon&hl=en&safe=off&biw=1680&bih=959&tbs=itp:clipart,isz:l&tbm=isch&source=lnt&sa=X&ei=CYq_TZHoMoXfiALctpGLAw&ved=0CAoQpwUoAQ", id: 0});
	});
}

function addUriElement(uri, tab) {
	var span = document.createElement('span');
	//console.log("span: " + span);
	span.className = (spanCount % 2) ? "odd" : "even";
	span.appendChild(document.createTextNode(uri));
	span.addEventListener('click', function(event) {
		var newUri = event.currentTarget.innerText;
		//console.log("new URI: " + newUri);
		if (event.shiftKey) // shift means open in new window
			chrome.windows.create({'url': newUri});
		else if (event.ctrlKey || (event.button == 1)) // ctrl or middle click means open in new tab
			chrome.tabs.create({'url': newUri});
		else // open in current tab
			chrome.tabs.update(tab.id, {'url': newUri});
		window.close();
	});
	document.body.appendChild(span);
	++spanCount;
}

function addSeparatorElement() {
	var div = document.createElement('div');
	div.className = "separator";
	document.body.appendChild(div);
}

function addEmptyElement() {
	var span = document.createElement('span');
	span.className = "empty";
	span.appendChild(document.createTextNode("Nowhere to go"));
	document.body.appendChild(span);
}

function buildPopup(tab) {
	// parse tab url and add entries in popup for each level up
	var uris = upshift.get(tab.url);
	for (var uri = 0; uri < uris.length; ++uri)
		addUriElement(uris[uri], tab);

	// search history for same host and add entries in popup
	if (chrome.history) {
		var uri = parseUri(tab.url);
		var host = uri["host"];
		//console.log("history host: " + host);
		chrome.history.search({text: host, startTime: 0}, function(results) {
			var historyCount = 0;

			// sort the results by most recently visited
			results = results.sort(function(a, b) { return a.lastVisitTime < b.lastVisitTime; });
			for (var result = 0; result < results.length; ++result) {
				var resultUrl = results[result].url;
				//console.log("result url: " + resultUrl);

				// check if it's the url of the tab
				if (resultUrl != tab.url) {
					// check if already in non-history items
					var idx = uris.indexOf(resultUrl);
					console.log("idx: " + idx);
					if (idx == -1) {
						var resultUri = parseUri(resultUrl);
						var resultHost = resultUri["host"];

						// check that the host matches (avoid fuzzy matches)
						if (resultHost == host) {
							if (!historyCount && uris.length)
								addSeparatorElement();

							addUriElement(resultUrl, tab);
							++historyCount;
							if (historyCount >= 10)
								break;
						}
					}
				}
			}

			if (!uris.length && !historyCount)
				addEmptyElement();
		});
	}
}

document.addEventListener('DOMContentLoaded', init());
