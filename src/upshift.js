// upshift - Copyright (C) 2011 Benbuck Nason

//console.log("upshift.js");

var upshift = {
	get: function(url) {
		var uris = new Array;
		var items = parseUri(url);
		var uri = '';

		if (items.protocol) {
			uri += items.protocol + ':';
			if (/^(?:(?![^:@]+:[^:@\/]*@)[^:\/?#.]+:)?\/\//.test(items.source)) uri += '//';
		}

		if (items.authority) {
			if (items.userInfo) {
				if (items.user) uri += items.user;
				if (items.userInfo.indexOf(':') > -1) uri += ':';
				if (items.password) uri += items.password;
				uri += '@';
			}

			if (items.host) {
				var re = /.+\.(.+\..+)/
				if (re.test(items.host)) {
					uris.push(uri + items.host.replace(re, '$1'));
					if ((items.host.substr(0, 4) != 'www.') && ((items.protocol == 'http') || (items.protocol == 'https')))
						uris.push(uri + items.host.replace(re, 'www.$1'));
				}

				uri += items.host;
				uris.push(uri + '/');
			}

			if (items.port) {
				uri += ':' + items.port;
				uris.push(uri + '/');
			}
		}

		if (items.relative) {
			if (items.path) {
				if (uri[uri.length - 1] != '/')
					uri += '/';

				if (items.directory) {
					var directories = items.directory.split('/');
					for (var d in directories) {
						if (directories[d] != '') {
							uri += directories[d] + '/';
							uris.push(uri);
						}
					}
				}

				if (items.file) {
					uri += items.file;
					uris.push(uri);
				}
			}

			if (items.query) {
				var params = items.query.split('&');
				for (var p = 0; p < params.length; ++p) {
					if (p)
						uri += '&' + params[p];
					else
						uri += '?' + params[p];
					if (params[p] != '')
						uris.push(uri);
				}
			}

			if (items.anchor) {
				uri += '#' + items.anchor;
				uris.push(uri);
			}
		}

		uris.pop();
		uris.reverse();
		return uris;
	}
};
