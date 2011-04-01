(function(window, undefined) {

var document = window.document,
	head = document.getElementsByTagName('head')[0];

var loader = function() {
	return (this instanceof loader) ? this.init() : new loader();
};

loader.prototype = {
	init: function() {
		var self = this;

		self.loadedScript = {};
		self.loadedCSS = {};
		self.basePath = (function (e) {
			if (e.nodeName.toLowerCase() == 'script') {
				var span = document.createElement('span');
				span.innerHTML = '<a href="' + e.getAttribute('src') + '" />';
				return span.firstChild.href.replace(/[^\/]+$/, '');
			}
			return arguments.callee(e.lastChild);
		})(document);

		return self;
	},
	script: function(src) {
		var self = this;

		src = /^(http|\/)/.test(src) ? src : self.basePath + src;

		if (self.loadedScript[src]) {
			return self;
		}

		document.write('<script src="' + src + '"></script>');
		self.loadedScript[src] = true;

		return self;
	},
	css: function(href, media) {
		var self = this;

		href = /^(http|\/)/.test(href) ? href : self.basePath + href;

		if (self.loadedCSS[href]) {
			return self;
		}

		var link = document.createElement('link');
		media = media || 'all';
		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = href;
		link.media = media;
		head.appendChild(link);
		self.loadedCSS[href] = true;

		return self;
	},
	ready: function(fn) {
		var self = this;

		loader._fn = fn;
		document.write('<script>loader._fn()</script>');
	}
};

window.loader = loader;

})(window);
