// upshift - Copyright (C) 2011 Benbuck Nason

// console.log("popup.ts");

// duplicated in background.ts
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

var spanCount: number;

function init() {
  // console.log("init");
  spanCount = 0;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // console.log("get: " + JSON.stringify(tabs));
    if (tabs.length > 0) {
      buildPopup(tabs[0]);
    }

    // for testing:
    // var url = "http://usr:pwd@abc.test.co.uk:81/dir/dir.2/dir.3/index.htm?q1=0&&test1&test2=value#top";
    // var url = "http://www.google.com/search?q=arrow+button+icon&hl=en&safe=off&biw=1680&bih=959&tbs=itp:clipart,isz:l&tbm=isch&source=lnt&sa=X&ei=CYq_TZHoMoXfiALctpGLAw&ved=0CAoQpwUoAQ";
    // var urls = upshift.get(url);
    // for (var u = 0; u < urls.length; ++u) {
    //   addUriElement(urls[u], tabs[0]);
    // }
  });
}

function addUriElement(uri: string, tab: chrome.tabs.Tab) {
  var span = document.createElement("span");
  // console.log("span: " + span);
  span.className = spanCount % 2 ? "odd" : "even";
  span.appendChild(document.createTextNode(uri));
  span.addEventListener("click", function (event) {
    var element = event.currentTarget as HTMLElement;
    var newUri = element.innerText;
    // console.log("new URI: " + newUri);
    if (event.shiftKey) {
      // shift means open in new window
      chrome.windows.create({ url: newUri });
    } else if (event.ctrlKey || event.button == 1) {
      // ctrl or middle click means open in new tab
      chrome.tabs.create({ url: newUri });
      // open in current tab
    } else if (tab.id !== undefined) {
      chrome.tabs.update(tab.id, { url: newUri });
    }
    window.close();
  });
  document.body.appendChild(span);
  ++spanCount;
}

function addSeparatorElement() {
  var div = document.createElement("div");
  div.className = "separator";
  document.body.appendChild(div);
}

function buildPopup(tab: chrome.tabs.Tab) {
  if (tab.url === undefined) {
    return;
  }

  var urls = upshift.get(tab.url);
  if (!urls.length) {
    addUriElement(tab.url, tab);
  }

  // parse tab url and add entries in popup for each level up
  for (var u = 0; u < urls.length; ++u) {
    addUriElement(urls[u], tab);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});
