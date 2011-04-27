/*!
 * loader.js
 *
 * Copyright 2011 PixelGrid, Inc.
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @version  0.1.1 (2011/04/28)
 */
(function(window, undefined) {

	var document = window.document;
	var head = document.getElementsByTagName('head')[0];
	var isIE = Boolean(document.all);
	var cache = {};
	var uid = 0;

	/* find basePaths */

	var firstCSSLink = (function(){
		var links = document.getElementsByTagName('link');
		for(var i=0, l=links.length, link; link=links[i]; i++){
			if(link.rel && (link.rel.toLowerCase() === 'stylesheet')){
				return link;
			}
		}
	})();
	var firstScript = (function(){
		var scripts = document.getElementsByTagName('script');
		return scripts[scripts.length-1];
	})();
	var basePath_css = firstCSSLink ? firstCSSLink.href.replace(/[^\/]+$/, '') : '';
	var basePath_js = firstScript.src.replace(/[^\/]+$/, '');

	/* utils */

	function isRelativePath(str){
		if(str.indexOf('/') === 0){ return false; }
		if(str.indexOf('http') === 0){ return false; }
		return true;
	}
	function normalizePath(path, type){
		if(isRelativePath(path)){
			if(type==='js'){ return basePath_js + path; }
			if(type==='css'){ return basePath_css + path; }
		}
		return path;
	}
	function publishUniqueFnName(){
		return '__loader_ready_' + uid++;
	}

	/* css loader */

	function loadCss(path, media){
		if(cache[path]){
			return;
		}
		var link = document.createElement('link');
		media = media || 'all';
		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = path;
		link.media = media;
		head.appendChild(link);
		cache[path] = true;
	}

	/**
	 * loader
	 */
	window.loader = (function(){

		var loader = {};
		var _chainLoader;

		function _createChainLoader(){
			if(_chainLoader){
				return;
			}
			var callback = function(){
				_chainLoader = null; // gc the last chainLoader for next
			};
			if(isIE){
				_chainLoader = new ChainLoaderIE(callback);
			}else{
				_chainLoader = new ChainLoader(callback);
			}
		}

		loader.script = function(src, ignoreBathPath){
			if(!ignoreBathPath){
				src = normalizePath(src, 'js');
			}
			_createChainLoader();
			_chainLoader.add(src);
			return loader;
		};
		loader.css = function(href, media, ignoreBathPath){
			if(!ignoreBathPath){
				href = normalizePath(href, 'css');
			}
			loadCss(href, media);
			return loader;
		};
		loader.ready = function(fn){
			_chainLoader.ready(fn);
			_chainLoader = null;
			return loader;
		};

		return loader;

	})();


	/**
	 * ChainLoader
	 * for non IE browsers
	 */
	var ChainLoader = function(callback){
		this._callback = callback;
	};
	ChainLoader.prototype = {
		add: function(src){
			document.write('<script src="' + src + '"></script>');
		},
		ready: function(fn){
			this._callback();
			var fnName = publishUniqueFnName();
			window[fnName] = function(){
				fn();
			};
			document.write('<script>' + fnName + '()</script>');
		}
	};


	/**
	 * ChainLoaderIE
	 * IE script loading explained here.
	 * http://msdn.microsoft.com/en-us/library/hh180173(v=vs.85).aspx
	 */
	var ChainLoaderIE = function(callback){
		this._callback = callback;
		this._loadHandlerFnName = publishUniqueFnName();
		var self = this;
		/* define proxy fn as global */
		window[this._loadHandlerFnName] = function(script){
			if(self._isScriptComplete(script)){
				self._increaseLoadCount();
				script.onreadystatechange = null; // yepnope says that this prevents IE momory leak
			}
		};
	};
	ChainLoaderIE.prototype = {
		_loaded: 0,
		_total: 0,
		_fire: function(){
			if(this._callback){
				this._callback();
			}
			if(this._readyFn){
				this._readyFn();
			}
		},
		_increaseLoadCount: function(){
			this._loaded++;
			if(this._total === this._loaded){
				this._fire();
			}
		},
		_isScriptComplete: function(script){
			return (script.readyState === 'complete');
		},
		add: function(src){
			this._total++;
			var onreadyAttr = 'onreadystatechange="' + this._loadHandlerFnName + '(this)"';
			document.write('<script src="' + src + '" ' + onreadyAttr + '></script>');
		},
		ready: function(callback){
			this._readyFn = callback;
		}
	};

})(window);
