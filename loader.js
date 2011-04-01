(function(window, undefined) {

var document = window.document,
	head = document.getElementsByTagName('head')[0]
	isIE = Boolean(document.all)
	loadedScript = {},
	loadedCSS = {},
	uid = 0;

var loader = function() {
	return (this instanceof loader) ? this.init() : new loader();
};

loader.script = function(src) {
	return loader().script(src);
};

loader.css = function(href, media) {
	return loader().css(href, media);
};

loader.prototype = {
	init: function() {
		var self = this;

		self.readyFuncName = '__loader_ready_' + uid++;
		self.basePath = (function (e) {
			if (e.nodeName.toLowerCase() == 'script') {
				var span = document.createElement('span');
				span.innerHTML = '<a href="' + e.getAttribute('src') + '" />';
				return span.firstChild.href.replace(/[^\/]+$/, '');
			}
			return arguments.callee(e.lastChild);
		})(document);

		if (isIE) {
			self.allScriptCount = 0;
			self.loadedScriptCount = 0;
			self.onready = function() {};
			window[self.readyFuncName] = function(script) {
				if (script.readyState === 'complete') { 
					self.loadedScriptCount++;
					if (self.allScriptCount === self.loadedScriptCount) {
						self.onready();
					}
				} 
			}
		}

		return self;
	},
	script: function(src) {
		var self = this;

		src = /^(http|\/)/.test(src) ? src : self.basePath + src;

		if (loadedScript[src]) {
			return self;
		}

		var onreadyAttr = '';
		if (isIE) {
			self.allScriptCount++;
			onreadyAttr = 'onreadystatechange="' + self.readyFuncName + '(this)"';
		}

		document.write('<script src="' + src + '" ' + onreadyAttr + '></script>');
		loadedScript[src] = true;

		return self;
	},
	css: function(href, media) {
		var self = this;

		href = /^(http|\/)/.test(href) ? href : self.basePath + href;

		if (loadedCSS[href]) {
			return self;
		}

		var link = document.createElement('link');
		media = media || 'all';
		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = href;
		link.media = media;
		head.appendChild(link);
		loadedCSS[href] = true;

		return self;
	},
	ready: function(fn) {
		var self = this;

		if (isIE) {
			self.onready = fn;
		} else {
			window[self.readyFuncName] = fn;
			document.write('<script>' + self.readyFuncName + '()</script>');
		}
	}
};

window.loader = loader;


})(window);
