// upshift - Copyright (C) 2011 Benbuck Nason

//console.log("background.ts");

// duplicated in popup.ts
var upshift = {
  get: function (url: string) {
    // console.log("upshift " + url);
    var urls = new Array();
    var parsedUrl = new URL(url);
    var tempUrl = "";

    if (parsedUrl.protocol) {
      tempUrl += parsedUrl.protocol + "//";
    }

    if (parsedUrl.username) {
      tempUrl += parsedUrl.username;
      if (parsedUrl.password) {
        tempUrl += ":" + parsedUrl.password;
      }
      tempUrl += "@";
    }

    if (parsedUrl.hostname) {
      var re = /.+\.(.+\..+)/;
      if (re.test(parsedUrl.hostname)) {
        urls.push(tempUrl + parsedUrl.hostname.replace(re, "$1"));
        if (
          parsedUrl.hostname.substr(0, 4) != "www." &&
          (parsedUrl.protocol == "http" || parsedUrl.protocol == "https")
        ) {
          urls.push(tempUrl + parsedUrl.hostname.replace(re, "www.$1"));
        }
      }

      tempUrl += parsedUrl.hostname;
      urls.push(tempUrl + "/");
    }

    if (parsedUrl.port) {
      tempUrl += ":" + parsedUrl.port;
      urls.push(tempUrl + "/");
    }

    if (parsedUrl.pathname) {
      var subpaths = parsedUrl.pathname.split("/");
      for (var s in subpaths) {
        if (subpaths[s] != "") {
          tempUrl += "/" + subpaths[s];
          urls.push(tempUrl);
        }
      }
    }

    if (parsedUrl.search) {
      var params = parsedUrl.search.split("&");
      for (var p = 0; p < params.length; ++p) {
        if (p) {
          tempUrl += "&" + params[p];
        } else {
          tempUrl += params[p];
        }
        if (params[p] != "") {
          urls.push(tempUrl);
        }
      }
    }

    if (parsedUrl.hash) {
      tempUrl += parsedUrl.hash;
      urls.push(tempUrl);
    }

    urls.pop();
    urls.reverse();
    // console.log("upshift: " + urls);
    return urls;
  },
};

function updateIcon(tabId: number) {
  // console.log("updateIcon: " + tabId);
  // chrome.action.setIcon({ tabId: tabId });
  chrome.action.enable(tabId);
}

chrome.tabs.onActivated.addListener(function (activeInfo) {
  // console.log("onSelectionChanged: " + activeInfo.tabId);
  updateIcon(activeInfo.tabId);
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs: chrome.tabs.Tab[]) {
  // console.log("getSelected: " + tab.id);
  if (tabs.length > 0) {
    var tab = tabs[0];
    if (typeof tab.id !== "undefined") {
      updateIcon(tab.id);
    }
  }
});

chrome.tabs.onUpdated.addListener(function (tabId: number) {
  // console.log("onUpdated: " + tabId);
  updateIcon(tabId);
});

chrome.commands.onCommand.addListener(function (command) {
  // console.log('Command:', command);
  if (command == "upshift_one_level") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs: chrome.tabs.Tab[]) {
      if (tabs.length > 0) {
        var tab = tabs[0];
        if (typeof tab.id !== "undefined" && typeof tab.url !== "undefined") {
          chrome.action.disable(tab.id);
          var uris = upshift.get(tab.url);
          // console.log("upshifting to " + uris[0]);
          chrome.tabs.update(tab.id, { url: uris[0] });
        }
      }
    });
  }
});
