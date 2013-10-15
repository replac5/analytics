(function() {
	function clicki() {
		var a = navigator.userAgent;
		this.browser = {
			version: (a.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/i) || [])[1],
			safari: /webkit/i.test(a),
			opera: /opera/i.test(a),
			msie: /msie/i.test(a) && !/opera/i.test(a),
			mozilla: /mozilla/i.test(a) && !/(compatible|webkit)/i.test(a)
		}
	}
	function siteTracker(a) {
		this.conf = a;
		var b = "https:" == document.location.protocol ? "https://": "http://";
		this.host = b + a.host + "/",
		this.site_id = a.site_id,
		this.site_name = a.site_name,
		this.track_type = a.track_type,
		this.is_logined = a.is_logined,
		this.registry = {
			boot: {
				"~/Observer": {
					action: "init"
				}
			},
			ready: {
				"~/AppEngine": {
					action: "init"
				},
				"~/LoadJsCode": {
					action: "init"
				}
			},
			load: {},
			widgets: a.widgets
		},
		this.apps = {}
	}
	function copy(a, b, c) {
		b[c] instanceof Function ? a[c] = function() {
			return b[c].apply(b, arguments)
		}: a[c] = b[c],
		a = null
	}
	Function.prototype.bind || (Function.prototype.bind = function(a) {
		var b = this,
		c = function() {
			return b.apply(a, arguments)
		};
		return c
	}),
	clicki.prototype = {
		init: function(a) {
			var b = "https:" == document.location.protocol ? "https://": "http://",
			c = b + a.host + "/",
			d = {
				base: c + "widget/app",
				alias: {
					app: c + "widget/app",
					modules: c + "widget/app/modules",
					controler: c + "widget/app/controler/",
					skin: c + "widget/app/skin/group/",
					cookie: c + "widget/open_modules/cookie",
					open_modules: c + "widget/open_modules/",
					jquery: c + "widget/lib/jquery",
					json: c + "widget/open_modules/json"
				}
			};
			this.config(d)
		},
		extend: function() {
			if (arguments.length < 2) return arguments[0];
			var a = arguments[0],
			b;
			for (var c = 1,	d = arguments.length; c < d; c++) {
				b = arguments[c];
				for (var e in b) a[e] = b[e]
			}
			return a
		},
		//元素添加事件
		bindEvent: function(a, b, c) {
			return a.attachEvent ? a.attachEvent("on" + b, c) : a.addEventListener(b, c, !1),
			a
		},
		tpFormat: function(msg, values, filter) {
			var pattern = /\{\{([\w\s\.\(\)"',-\[\]]+)?\}\}/g;
			return msg.replace(pattern,
			function(match, key) {
				var value = values[key] || eval("(values." + key + ")");
				return Object.prototype.toString.call(filter) === "[object Function]" ? filter(value, key) : value
			})
		},
		//向服务器发请求的函数，一般用于向服务器发送数据而不请求js的情况，请求方式为图片请求，参数说明：a:请求url，b:回调函数
		track: function(a, b) {
			var c = new Image,
			d = "__clicki_track_" + Math.floor(Math.random() * 2147483648).toString(36);
			window[d] = c;
			var e = "",
			f = function() {
				c.onload = c.onerror = c.onabort = null,
				window[d] = null,
				c = null,
				b && b(e, a)
			};
			c.onload = function() {
				e = "onload",
				f()
			},
			c.onerror = function() {
				e = "onerror",
				f()
			},
			c.onabort = function() {
				e = "onabort",
				f()
			},
			c.src = a
		},
		//文档dom就绪的判断
		domReady: function() {
			function f() {
				if (!d) {
					d = !0;
					if (e) {
						for (var a = 0; a < e.length; a++) e[a].call(window, []);
						e = []
					}
				}
			}
			function g(a) {
				var b = window.onload;
				typeof window.onload != "function" ? window.onload = a: window.onload = function() {
					b && b(),
					a()
				}
			}
			function h() {
				if (c) return;
				c = !0,
				document.addEventListener && !b.opera && document.addEventListener("DOMContentLoaded", f, !1),
				b.msie && window == top &&
				function() {
					if (d) return;
					try {
						document.documentElement.doScroll("left")
					} catch(a) {
						setTimeout(arguments.callee, 0);
						return
					}
					f()
				} (),
				b.opera && document.addEventListener("DOMContentLoaded", function() {
					if (d) return;
					for (var a = 0; a < document.styleSheets.length; a++) if (document.styleSheets[a].disabled) {
						setTimeout(arguments.callee, 0);
						return
					}
					f()
				},!1);
				if (b.safari) {
					var a;
					(function() {
						if (d) return;
						if (document.readyState != "loaded" && document.readyState != "complete") {
							setTimeout(arguments.callee, 0);
							return
						}
						if (a === undefined) {
							var b = document.getElementsByTagName("link");
							for (var c = 0; c < b.length; c++) b[c].getAttribute("rel") == "stylesheet" && a++;
							var e = document.getElementsByTagName("style");
							a += e.length
						}
						if (document.styleSheets.length != a) {
							setTimeout(arguments.callee, 0);
							return
						}
						f()
					})()
				}
				g(f)
			}
			var a = navigator.userAgent.toLowerCase(),
			b = Clicki.browser,
			c = !1,
			d = !1,
			e = [];
			return h(),
			function(a, b, c) {
				h(),
				d ? a.apply(b, c) : e.push(function() {
					return a.apply(b, c)
				})
			}.apply(this, arguments)
		}
	},
	siteTracker.prototype = {
		init: function() {
			this.loadUserConfig(),
			this.widgetAppsList = {},
			this.boot().ready().load()
		},
		loadUserConfig: function() {
			clearTimeout(this.__userConfigLoop);
			var a = "_CiQ" + this.site_id,
			b = window[a] || [];
			window[a] = [],
			Clicki.defaultTracker.site_id == this.site_id && window._CiQ && window._CiQ.length > 0 && (b = b.concat(window._CiQ), window._CiQ = []);
			if (b && b.length) for (var c = 0; c < b.length; c++) {
				var d = b[c];
				if (!d.length) continue;
				typeof this[d[0]] == "function" && this[d[0]].apply(this, d.slice(1)) === !1 && window[a].push(d)
			}
			var e = this,
			f = function() {
				e.loadUserConfig()
			};
			this.__userConfigLoop = setTimeout(f, 1e3)
		},
		//siteTracker对象初始化之后执行在对象registry.boot中注册的模块的动作
		boot: function() {
			var a = 0,
			b = 0,
			c = this;
			for (var d in this.registry.boot) a++;
			for (var d in this.registry.boot) {
				if (!{}.hasOwnProperty.call(this.registry.boot, d)) {
					b++;
					continue
				}
				var e = this.registry.boot[d].action;
				e = e ? e: "init",
				Clicki.use(d,
				function(d) {
					return function(e) {
						e[d] && e[d](c),
						b++,
						a === b && (c.booted = !0)
					}
				} (e))
			}
			return a === b && (this.booted = !0),
			this
		},
		//dom就绪后执行在对象的registry.ready中注册的模块的动作
		ready: function() {
			var a = 0,
			b = 0,
			c = this;
			for (var d in this.registry.ready) a++;
			return Clicki.domReady(function() {
				for (var d in this.registry.ready) {
					if (!{}.hasOwnProperty.call(this.registry.ready, d)) {
						b++;
						continue
					}
					var e = this.registry.ready[d].action;
					e = e ? e: "init",
					Clicki.use(d,
					function(d) {
						return function(e) {
							e[d] && e[d](c),
							b++,
							a === b && (c.readyed = !0)
						}
					} (e))
				}
				a === b && (c.readyed = !0)
			},
			this, []),
			a === b && (this.readyed = !0),
			this
		},
		//在window的load事件中执行在对象的registry.load中注册的模块的动作
		load: function() {
			var a = 0,
			b = 0;
			for (var c in this.registry.load) a++;
			var d, e;
			return window.addEventListener ? (d = "addEventListener", e = "load") : (d = "attachEvent", e = "onload"),
			window[d](e, function(c) {
				return function() {
					for (var d in c.registry.load) {
						if (!{}.hasOwnProperty.call(c.registry.load, d)) continue;
						var e = c.registry.load[d].action;
						e = e ? e: "init",
						Clicki.use(d,
						function(d) {
							return function(e) {
								e[d] && e[d](c),
								a === b && (c.loaded = !0)
							}
						} (e))
					}
				}
			} (this), !1),
			a === b && (this.loaded = !0),
			this
		},
		_cookieUseRootDomain: function(a) {
			return this.COOKIE_USE_ROOT_DOMAIN = a === !0 ? 1 : 0,
			!0
		},
		_trackPageView: function(a) {
			return this.loaded ? (this.Observer && this.Observer.refresh(a), !0) : !1
		},
		_trackEvent: function(data) {
			typeof data == "string" && (data = eval("(" + data + ")")),
			!data.values && !data.labels && window.console && console.warn && console.warn("_trackEvent参数错误:", arguments);
			var _CiTKey = "_CiT" + this.site_id;
			window[_CiTKey] = window[_CiTKey] || [];
			var values = [],
			labels = [];
			for (var i = 0; i < data.values.length; i++) for (var x in data.values[i]) {
				values.push(data.values[i][x]);
				break
			}
			for (var i = 0; i < data.labels.length; i++) for (var x in data.labels[i]) {
				labels.push(data.labels[i][x]);
				break
			}
			window[_CiTKey].push({
				method: "addItem",
				type_id: data.type,
				labels: labels,
				values: values
			})
		},
		_trackMetrics: function(a) {
			if (a && a.length) {
				var b = "_CiT" + this.site_id;
				window[b] = window[b] || [],
				window[b].push({
					method: "addConvertion",
					values: a
				})
			} else window.console && console.warn && console.warn("_trackMetrics参数错误:", arguments)
		}
	};
//***************************************start seajs**************************************
	var _seajsHost = {
		location: window.location
	}; 
	((function() {
		var a = this.seajs = {
			_seajs: this.seajs
		};
		a.version = "1.0.1",
		a._data = {
			config: {
				debug: "",
				preload: []
			},
			memoizedMods: {},
			pendingMods: []
		},
		a._util = {},
		a._fn = {},
		function(a) {
			var b = Object.prototype.toString,
			c = Array.prototype;
			a.isString = function(a) {
				return b.call(a) === "[object String]"
			},
			a.isFunction = function(a) {
				return b.call(a) === "[object Function]"
			},
			a.isArray = Array.isArray ||
			function(a) {
				return b.call(a) === "[object Array]"
			},
			a.indexOf = c.indexOf ?
			function(a, b) {
				return a.indexOf(b)
			}: function(a, b) {
				for (var c = 0,
				d = a.length; c < d; c++) if (a[c] === b) return c;
				return - 1
			};
			var d = a.forEach = c.forEach ?
			function(a, b) {
				a.forEach(b)
			}: function(a, b) {
				for (var c = 0,
				d = a.length; c < d; c++) b(a[c], c, a)
			};
			a.map = c.map ?
			function(a, b) {
				return a.map(b)
			}: function(a, b) {
				var c = [];
				return d(a,
				function(a, d, e) {
					c.push(b(a, d, e))
				}),
				c
			},
			a.filter = c.filter ?
			function(a, b) {
				return a.filter(b)
			}: function(a, b) {
				var c = [];
				return d(a,
				function(a, d, e) {
					b(a, d, e) && c.push(a)
				}),
				c
			},
			a.now = Date.now ||
			function() {
				return (new Date).getTime()
			}
		} (a._util),
		function(a, b) {
			function c(a) {
				var b = ["{"],
				c;
				for (c in a) if (typeof a[c] == "number" || typeof a[c] == "string") b.push(c + ": " + a[c]),
				b.push(", ");
				return b.pop(),
				b.push("}"),
				b.join("")
			}
			var d = b.config;
			a.error = function(a) {
				if (a.type === "error") throw "Error occurs! " + c(a);
				d.debug && typeof console != "undefined" && console[a.type](c(a))
			}
		} (a._util, a._data),
		function(a, b, c) {
			function d(a) {
				return a = a.match(/.*(?=\/.*$)/),
				(a ? a[0] : ".") + "/"
			}
			function e(b) {
				b = b.replace(/([^:\/])\/+/g, "$1/");
				if (b.indexOf(".") === -1) return b;
				for (var c = b.split("/"), d = [], e, f = 0, g = c.length; f < g; f++) e = c[f],
				e === ".." ? (d.length === 0 && a.error({
					message: "invalid path: " + b,
					type: "error"
				}), d.pop()) : e !== "." && d.push(e);
				return d.join("/")
			}
			function f(a) {
				return a = e(a),
				/#$/.test(a) ? a = a.slice(0, -1) : a.indexOf("?") === -1 && !/\.(?:css|js)$/.test(a) && (a += ".js"),
				a
			}
			function g(a) {
				function b(a, b) {
					var d = a[b];
					c && c.hasOwnProperty(d) && (a[b] = c[d])
				}
				var c = o.alias,
				a = a.split("/"),
				d = a.length - 1;
				return b(a, 0),
				d && b(a, d),
				a.join("/")
			}
			function h(b) {
				return a.forEach(o.map,
				function(a) {
					a && a.length === 2 && (b = b.replace(a[0], a[1]))
				}),
				b
			}
			function i(a) {
				return a.replace(/^(\w+:\/\/[^/] * )\ / ?. * $ / ,
				"$1")
			}
			function j(b, c, e) {
				return q[b] ? b: (!e && o.alias && (b = g(b)), c = c || p, n(b) && (b = "." + b.substring(1)), b.indexOf("://") === -1 && (b.indexOf("./") === 0 || b.indexOf("../") === 0 ? (b = b.replace(/^\.\//, ""), b = d(c) + b) : b.indexOf("/") === 0 ? b = i(c) + b: (o.base || a.error({
					message: "the config.base is empty",
					from: "id2Uri",
					type: "error"
				}), b = o.base + "/" + b)), b = f(b), o.map && (b = h(b)), q[b] = !0, b)
			}
			function k(b, c) {
				return a.map(b,
				function(a) {
					return j(a, c)
				})
			}
			function l(b, c) {
				if (!b || b.ready) return ! 1;
				var d = b.dependencies || [];
				if (d.length) {
					if (a.indexOf(d, c) !== -1) return ! 0;
					for (var e = 0; e < d.length; e++) if (l(r[d[e]], c)) return ! 0
				}
				return ! 1
			}
			function m(b, c) {
				a.forEach(c,
				function(c) {
					a.indexOf(b, c) === -1 && b.push(c)
				})
			}
			function n(a) {
				return a.charAt(0) === "~"
			}
			var o = b.config,
			c = c.location,
			p = c.protocol + "//" + c.host + c.pathname; p.indexOf("\\") !== -1 && (p = p.replace(/\\/g, "/"));
			var q = {},
			r = b.memoizedMods; a.dirname = d, a.id2Uri = j, a.ids2Uris = k, a.memoize = function(a, b, c) {
				var d;
				d = a ? j(a, b, !0) : b,
				c.dependencies = k(c.dependencies, d),
				r[d] = c,
				a && b !== d && (a = r[b]) && m(a.dependencies, c.dependencies)
			},
			a.setReadyState = function(b) {
				a.forEach(b,
				function(a) {
					r[a] && (r[a].ready = !0)
				})
			},
			a.getUnReadyUris = function(b) {
				return a.filter(b,
				function(a) {
					return a = r[a],
					!a || !a.ready
				})
			},
			a.removeCyclicWaitingUris = function(b, c) {
				return a.filter(c,
				function(a) {
					return ! l(r[a], b)
				})
			},
			a.isInlineMod = n, a.pageUrl = p, o.debug && (a.realpath = e, a.normalize = f, a.parseAlias = g, a.getHost = i)
		} (a._util, a._data, this),
		function(a, b) {
			function c(c, f) {
				function g() {
					g.isCalled = !0,
					f(),
					clearTimeout(h)
				}
				c.nodeName === "SCRIPT" ? d(c, g) : e(c, g);
				var h = setTimeout(function() {
					g(),
					a.error({
						message: "time is out",
						from: "getAsset",
						type: "warn"
					})
				},
				b.config.timeout)
			}
			function d(a, b) {
				a.addEventListener ? (a.addEventListener("load", b, !1), a.addEventListener("error", b, !1)) : a.attachEvent("onreadystatechange",
				function() {
					var c = a.readyState; (c === "loaded" || c === "complete") && b()
				})
			}
			function e(a, b) {
				a.attachEvent ? a.attachEvent("onload", b) : setTimeout(function() {
					f(a, b)
				},
				0)
			}
			function f(a, b) {
				if (!b.isCalled) {
					var c = !1;
					if (h) a.sheet && (c = !0);
					else if (a.sheet) try {
						a.sheet.cssRules && (c = !0)
					} catch(d) {
						d.code === 1e3 && (c = !0)
					}
					c ? setTimeout(function() {
						b()
					},
					1) : setTimeout(function() {
						f(a, b)
					},
					1)
				}
			}
			var g = document.getElementsByTagName("head")[0],
			h = navigator.userAgent.indexOf("AppleWebKit") !== -1;
			a.getAsset = function(a, d, e) {
				var f = /\.css(?:\?|$)/i.test(a),
				h = document.createElement(f ? "link": "script");
				return e && h.setAttribute("charset", e),
				c(h,
				function() {
					d && d.call(h);
					if (!f && !b.config.debug) {
						try {
							if (h.clearAttributes) h.clearAttributes();
							else for (var a in h) delete h[a]
						} catch(c) {}
						g.removeChild(h)
					}
				}),
				f ? (h.rel = "stylesheet", h.href = a, g.appendChild(h)) : (h.async = !0, h.src = a, g.insertBefore(h, g.firstChild)),
				h
			},
			a.assetOnload = c;
			var i = null;
			a.getInteractiveScript = function() {
				if (i && i.readyState === "interactive") return i;
				for (var a = g.getElementsByTagName("script"), b = 0; b < a.length; b++) {
					var c = a[b];
					if (c.readyState === "interactive") return i = c
				}
				return null
			},
			a.getScriptAbsoluteSrc = function(a) {
				return a.hasAttribute ? a.src: a.getAttribute("src", 4)
			};
			var j = "seajs-ts=" + a.now();
			a.addNoCacheTimeStamp = function(a) {
				return a + (a.indexOf("?") === -1 ? "?": "&") + j
			},
			a.removeNoCacheTimeStamp = function(a) {
				var b = a;
				return a.indexOf(j) !== -1 && (b = a.replace(j, "").slice(0, -1)),
				b
			}
		} (a._util, a._data),
		function(a, b, c, d) {
			function e(b, c) {
				function d() {
					a.setReadyState(g),
					c()
				}
				var g = a.getUnReadyUris(b);
				if (g.length === 0) return d();
				for (var h = 0,
				l = g.length,
				m = l; h < l; h++)(function(b) {
					function c() {
						var c = (i[b] || 0).dependencies || [],
						f = c.length;
						f && (c = a.removeCyclicWaitingUris(b, c), f = c.length),
						f && (m += f, e(c,
						function() {
							m -= f,
							m === 0 && d()
						})),
						--m === 0 && d()
					}
					i[b] ? c() : f(b, c)
				})(g[h])
			}
			function f(c, d) {
				function e() {
					b.pendingMods && (a.forEach(b.pendingMods,
					function(b) {
						a.memoize(b.id, c, b)
					}), b.pendingMods = []),
					h[c] && delete h[c],
					i[c] || a.error({
						message: "can not memoized",
						from: "load",
						uri: c,
						type: "warn"
					}),
					d && d()
				}
				h[c] ? a.assetOnload(h[c], e) : (b.pendingModIE = c, h[c] = a.getAsset(g(c), e, b.config.charset), b.pendingModIE = null)
			}
			function g(c) {
				return b.config.debug == 2 && (c = a.addNoCacheTimeStamp(c)),
				c
			}
			var h = {},
			i = b.memoizedMods;
			c.load = function(b, f, g) {
				a.isString(b) && (b = [b]);
				var h = a.ids2Uris(b, g);
				e(h,
				function() {
					var b = c.createRequire({
						uri: g
					}),
					e = a.map(h,
					function(a) {
						return b(a)
					});
					f && f.apply(d, e)
				})
			}
		} (a._util, a._data, a._fn, this),
		function(a) {
			a.Module = function(a, b, c) {
				this.id = a,
				this.dependencies = b || [],
				this.factory = c
			}
		} (a._fn),
		function(a, b, c) {
			c.define = function(d, f, h) {
				arguments.length === 1 ? (h = d, d = "") : a.isArray(d) && (h = f, f = d, d = "");
				if (!a.isArray(f) && a.isFunction(h)) {
					for (var i = h.toString(), j = /[^.]\brequire\s*\(\s*['"]?([^'")]*)/g, k = [], l, i = i.replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, "\n").replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g, "\n"); l = j.exec(i);) l[1] && k.push(l[1]);
					f = k
				}
				var i = new c.Module(d, f, h),
				m;
				a.isInlineMod(d) ? m = a.pageUrl: document.attachEvent && !window.opera && ((m = a.getInteractiveScript()) ? (m = a.getScriptAbsoluteSrc(m), b.config.debug == 2 && (m = a.removeNoCacheTimeStamp(m))) : m = b.pendingModIE),
				m ? a.memoize(d, m, i) : b.pendingMods.push(i)
			}
		} (a._util, a._data, a._fn),
		function(a, b, c) {
			function d(h) {
				function i(c) {
					var g = a.id2Uri(c, h.uri),
					c = b.memoizedMods[g];
					if (!c) return null;
					if (e(h, g)) return a.error({
						message: "found cyclic dependencies",
						from: "require",
						uri: g,
						type: "warn"
					}),
					c.exports;
					if (!c.exports) {
						var g = {
							uri: g,
							deps: c.dependencies,
							parent: h
						},
						i = c.factory;
						c.id = g.uri,
						c.exports = {},
						delete c.factory,
						delete c.ready;
						if (a.isFunction(i)) {
							var k = c.uri;
							i.toString().search(/\sexports\s*=\s*[^=]/) !== -1 && a.error({
								message: "found invalid setter: exports = {...}",
								from: "require",
								uri: k,
								type: "error"
							}),
							g = i(d(g), c.exports, c),
							g !== void 0 && (c.exports = g)
						} else i !== void 0 && (c.exports = i)
					}
					return c.exports
				}
				return i.async = function(a, b) {
					c.load(a, b, h.uri)
				},
				i
			}
			function e(a, b) {
				return a.uri === b ? !0 : a.parent ? e(a.parent, b) : !1
			}
			c.createRequire = d
		} (a._util, a._data, a._fn),
		function(a, b, c, d) {
			function e(b, c) {
				b !== void 0 && b !== c && a.error({
					message: "config is conflicted",
					previous: b,
					current: c,
					from: "config",
					type: "error"
				})
			}
			var f = b.config,
			b = document.getElementById("seajsnode");
			b || (b = document.getElementsByTagName("script"), b = b[b.length - 1]);
			var g = a.getScriptAbsoluteSrc(b),
			h;
			if (g) {
				var g = h = a.dirname(g),
				i = g.match(/^(.+\/)seajs\/[\d\.]+\/$/);
				i && (g = i[1]),
				f.base = g
			}
			f.main = b.getAttribute("data-main") || "",
			f.timeout = 2e4,
			h && (d.location.search.indexOf("seajs-debug") !== -1 || document.cookie.indexOf("seajs=1") !== -1) && (f.debug = !0, f.preload.push(h + "plugin-map")),
			c.config = function(b) {
				for (var c in b) {
					var d = f[c],
					g = b[c];
					if (d && c === "alias") for (var h in g) g.hasOwnProperty(h) && (e(d[h], g[h]), d[h] = g[h]);
					else ! d || c !== "map" && c !== "preload" ? f[c] = g: (a.isArray(g) || (g = [g]), a.forEach(g,
					function(a) {
						a && d.push(a)
					}))
				}
				return b = f.base,
				b.indexOf("://") === -1 && (f.base = a.id2Uri(b + "#")),
				this
			}
		} (a._util, a._data, a._fn, this),
		function(a, b, c) {
			var d = b.config;
			c.use = function(a, b) {
				var e = d.preload,
				h = e.length;
				h ? c.load(e,
				function() {
					d.preload = e.slice(h),
					c.use(a, b)
				}) : c.load(a, b)
			},
			(b = d.main) && c.use([b]),
			function(b) {
				if (b) {
					for (var d = {
						0 : "config",
						1 : "use",
						2 : "define"
					},
					e = 0; e < b.length; e += 2) c[d[b[e]]].apply(a, b[e + 1]);
					delete a._seajs
				}
			} ((a._seajs || 0).args)
		} (a, a._data, a._fn),
		function(a, b, c, d) {
			if (a._seajs) d.seajs = a._seajs;
			else {
				a.config = c.config,
				a.use = c.use;
				var e = d.define;
				d.define = c.define,
				a.noConflict = function(b) {
					return d.seajs = a._seajs,
					b && (d.define = e, a.define = c.define),
					a
				},
				b.config.debug || (delete a._util, delete a._data, delete a._fn, delete a._seajs)
			}
		} (a, a._data, a._fn, this)
	})).apply(_seajsHost);
//***************************************end seajs**************************************

	//创建seajs的全局标示符Clicki，并使Clicki继承clicki
	var Clicki = _seajsHost.seajs.noConflict(!0);
	delete _seajsHost;
	var _Clicki = new clicki;
	for (var n in _Clicki) Clicki[n] = _Clicki[n];

	//Clicki的初始化函数，首先执行了类clicki的init函数，然后使Clicki继承siteTracker，并执行siteTracker的init函数。
	//该函数使seajs、clicki、siteTracker三个类的功能都集中到了Clicki对象中。
	Clicki.New = function(a) {
		this.defaultTracker || Clicki.init(a);
		var b = new siteTracker(a);
		Clicki[a.site_id] = b;
		if (!Clicki.defaultTracker) {
			for (var c in b) copy(Clicki, b, c);
			Clicki.defaultTracker = b
		}
		b.init()
	},

	Clicki.define("~/Cookie", null, function(require, exports) {
		function b() {
			if (a) return a;
			var b = function(a) {
				var b = "__c_rootdomin_test__";
				document.cookie = b + "=1;domain=" + a + ";";
				var c = document.cookie.match(new RegExp("(^| )" + b + "=([^;]*)(;|$)"));
				if (c == null) return ! 1;
				var d = new Date;
				return d.setTime(d.getTime() - 10),
				c != null && (document.cookie = b + "=" + c[2] + ";expires=" + d.toGMTString() + ";domain=" + a + ";"),
				!0
			},
			c = document.domain,
			d = c.split(".").length,
			e = c;
			while (b(c) && d > 0) e = c,
			c = c.replace(/^[^\.]+\./, ""),
			d--;
			return a = e,
			e
		}
		var a = "",
		c = function(a) {
			var b = new Date,
			c = arguments,
			d = c.length;
			if (d > 1) {
				var e = c[2] || 0,
				f = c[3] || "/",
				g = c[4] || 0,
				h = c[5] || 0;
				return e && b.setTime(b.getTime() + e * 1e3),
				document.cookie = a + "=" + escape(c[1]) + (e ? "; expires=" + b.toGMTString() : "") + ("; path=" + f) + (g ? "; domain=" + g: "") + (h ? "; secure": ""),
				c[1]
			}
			var i = document.cookie.match("(?:^|;)\\s*" + a + "=([^;]*)");
			return i ? unescape(i[1]) : 0
		};
		exports.get = function(a) {
			return c(a)
		},
		exports.set = function(a, d, e, f, g, h) {
			return ! g && Clicki.COOKIE_USE_ROOT_DOMAIN && (g = b(), window.document.domain !== g && (g = "." + g)),
			c(a, d, e, f, g, h)
		},
		exports.set2 = function(a, d, e, f, g, h, i) {
			var j = Clicki[a] && Clicki[a].COOKIE_USE_ROOT_DOMAIN;
			return ! h && j && (h = b(), window.document.domain !== h && (h = "." + h)),
			c(d, e, f, g, h, i)
		}
	}),

	Clicki.define("~/Json", null, function(require, exports) {
		function a(a) {
			return a < 10 ? "0" + a: a
		}
		function g(a) {
			return b.test(a) ? '"' + a.replace(b,
			function(a) {
				var b = e[a];
				return typeof b == "string" ? b: (b = a.charCodeAt(), "\\u00" + Math.floor(b / 16).toString(16) + (b % 16).toString(16))
			}) + '"': '"' + a + '"'
		}
		function h(a, b) {
			var e, i, j, k, l = c,
			m, n = b[a];
			n && typeof n == "object" && typeof n.toJSON == "function" && Object.prototype.toString.apply(n) !== "[object Array]" && (n = n.toJSON(a)),
			typeof f == "function" && (n = f.call(b, a, n));
			switch (typeof n) {
			case "string":
				return g(n);
			case "number":
				return isFinite(n) ? String(n) : "null";
			case "boolean":
			case "null":
				return String(n);
			case "object":
				if (!n) return "null";
				c += d,
				m = [];
				if (typeof n.length == "number" && !n.propertyIsEnumerable("length")) {
					k = n.length;
					for (e = 0; e < k; e += 1) m[e] = h(e, n) || "null";
					return j = m.length === 0 ? "[]": c ? "[\n" + c + m.join(",\n" + c) + "\n" + l + "]": "[" + m.join(",") + "]",
					c = l,
					j
				}
				if (typeof f == "object") {
					k = f.length;
					for (e = 0; e < k; e += 1) i = f[e],
					typeof i == "string" && (j = h(i, n, f), j && m.push(g(i) + (c ? ": ": ":") + j))
				} else for (i in n) j = h(i, n, f),
				j && m.push(g(i) + (c ? ": ": ":") + j);
				return j = m.length === 0 ? "{}": c ? "{\n" + c + m.join(",\n" + c) + "\n" + l + "}": "{" + m.join(",") + "}",
				c = l,
				j
			}
		}
		var b = /["\\\x00-\x1f\x7f-\x9f]/g,
		c, d, e = {
			"\b": "\\b",
			"\t": "\\t",
			"\n": "\\n",
			"\f": "\\f",
			"\r": "\\r",
			'"': '\\"',
			"\\": "\\\\"
		},
		f;
		return {
			stringify: function(a, b, e) {
				var g;
				c = "",
				d = "";
				if (e) if (typeof e == "number") for (g = 0; g < e; g += 1) d += " ";
				else typeof e == "string" && (d = e);
				if (!b) f = function(a, b) {
					return Object.hasOwnProperty.call(this, a) ? b: undefined
				};
				else {
					if (typeof b != "function" && (typeof b != "object" || typeof b.length != "number")) throw new Error("JSON.stringify");
					f = b
				}
				return h("", {
					"": a
				})
			},
			quote: g
		}
	}),

	//is_new:是否新访客
	Clicki.define("~/Visitor", null, function(require, exports) {
		var a = require("~/Cookie"),
		b = new Date,
		c = function(b) {
			var c = 0,
			d = a.get("__c_visitor"),
			e = "";
			d || (d = b.visitor_id, c = 1);
			var f = {};
			return f.id = d,
			f.is_new = c,
			f.is_active = 0,
			f
		};
		return {
			Get: function(a) {
				return c(a)
			}
		}
	}),

	//来源
	Clicki.define("~/Referer", null, function(require, exports) {
		exports.url = document.referrer
	}),

	//页面url、域、title、服务器访问时间、js load时间
	Clicki.define("~/Page", null, function(require, exports) {
		var a = function(a) {
			var b = a.time,				//服务器返回的访问时间
			c = (new Date).getTime(),
			d = b > 0 ? c - b: 0,
			e = {
				data: {
					url: location.href.replace(/#$/, ""),
					domain: document.domain,
					title: document.title,
					server_time: b,
					loadtime: d
				},
				refresh: function(a) {
					var b = location.href.replace(/#$/, ""),
					c = document.title;
					a && (a.urlPath && (a.urlPath = a.urlPath[0] === "/" ? a.urlPath: "/" + a.urlPath, b = "http://" + document.domain + a.urlPath), a.pageTitle && (c = a.pageTitle)),
					e.data.url = b,
					e.data.domain = document.domain,
					e.data.title = c,
					e.data.server_time = -1
				}
			};
			return e
		};
		return {
			Get: function(b) {
				return a(b)
			}
		}
	}),

	Clicki.define("~/CustomTrack", null, function(require, exports) {
		var a = function(a) {
			var b = "_CiT" + a, 
				c = window[b] || [];
			return window[b] = [], 
			Clicki.defaultTracker.site_id == a && window._CiT && window._CiT.length > 0 && (c = c.concat(window._CiT), window._CiT = []),
			Clicki.IS_HEATMAP || !c || !c.length ? [] : c
		},
		b = function(a) {
			if (Clicki.defaultTracker.site_id == a && window._CiT && window._CiT.length > 0) return ! 0;
			var b = "_CiT" + a;
			return window[b] && window[b].length > 0 ? !0 : !1
		};
		return {
			getCustomTrackData: a,
			needTrack: b
		}
	}),

	//动作监测模块
	Clicki.define("~/ActionTrack", null, function(require, exports) {
		var a = function() {			//动作监测初始化
			var a = {					//监测了那些动作
				clicks: 1,				//点击数
				inputs: 2,				//输入数
				innner_clickis: 3,		//跳入次数
				outer_clickis: 4,		//跳出次数
				inactive_period: 5 		//
			},
			b = {},						//记录各种监测次数的对象
			c = /^(http:\/\/|https:\/\/|ftp:\/\/)/i,
			d = /^javascript:/i,
			e = [],
			f = (new Date).getTime(),
			g = f,
			h = 0,
			i = function(a, c) {		//记录监测次数总数的函数，a:监测动作的名称，c:动作发生的次数
				c = c || 1,
				b[a] === undefined && (b[a] = 0),
				b[a] += c
			},
			j = function(a) {
				var b = (new Date).getTime();
				b - f > 3e4 && (h += b - g, g - f < 3e4 && (h += g - f)),
				a && (f = b),
				g = b
			},
			k = function() {
				j();
				var a = h;
				return h = 0,
				a
			};
			Clicki.bindEvent(window.document, "click", function(b) {	//document元素添加click事件，监测跳转的去向
				j(!0),
				b = b || window.event;
				var f = b.srcElement ? b.srcElement: b.target,
				g = (f.tagName || f.nodeName || "").toUpperCase();
				i(a.clicks);
				if (g === "A" && f.href) 	
					if (c.test(f.href)) {	//如果href是以http或https或ftp开头，如果href中包含页面域名并至少在第8个字符开始（https://）,则是内部链接，否则是外部链接
						var h = f.href.indexOf(window.location.host);	
						h > -1 && h <= 8 ? i(a.innner_clickis) : i(a.outer_clickis)
					} else d.test(f.href) || i(a.innner_clickis);	//不是以协议名开头的，判断是否是javascript动作，如果不是，则认为是内部跳转
				var k, l;
				Clicki.browser.msie ? (l = Math.max(document.documentElement.scrollTop, document.body.scrollTop), k = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft), k = b.clientX + k, l = b.clientY + l) : (k = b.pageX, l = b.pageY);
				var m = Math.max(document.body.scrollWidth, document.body.offsetWidth, document.body.clientWidth),
				n = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.body.clientHeight);
				k > 0 && l > 0 && k <= m && l <= n && e.push([k, l, m])	//保存ie下的点击坐标，和所有情况下的页面宽度
			}),
			Clicki.bindEvent(window.document, "keyup", function(b) {	//document元素添加click事件，监测输入次数
				j(!0),
				b = b || window.event,
				i(a.inputs)
			}),
			Clicki.bindEvent(window.document, "mousemove", function(a) {
				j(!0)
			});
			var l = function(c) {	//取得监测到的动作数据
				var d = b,
				f = [],
				g = k();
				b = {};
				if (Clicki.IS_HEATMAP) return delete d, f;
				var h, i = 2;
				for (var j in d) {
					h = {
						id: j,
						f: d[j]
					};
					if (j == a.clicks) {
						if (c.track_type == 0 || (c.track_type & i) == i) h.c = e;
						e = []
					}
					f.push(h)
				}
				return delete d,
				g > 0 && f.push({
					id: a.inactive_period,
					f: Math.round(g / 1e3)
				}),
				f
			},
			m = function() {
				for (var a in b) return ! 0;
				return ! 1
			};
			return {
				getActionTrackData: l,		
				needTrack: m
			}
		};
		return {
			Get: function() {
				return a()
			}
		}
	}),
	
	//sessionTimelist维护一个每次访问页面时的客户端时间列表，格式为this.sessionId.toString(36) + "_" + (new Date).getTime().toString(36)
	//其中this.sessionId为用户首次访问页面的服务器时间，维护这个列表的目的是判断用户是否活跃，即visitor.is_active的值，
	//此属性初值为0,在checkActive函数中判断，如果用户本次访问与最近的三次中任何一次的时间差超过五天，则置is_active为0
	//timelist时间列表的值保存在名为__c_sesslist_+ site_id的cookie中
	Clicki.define("~/SessionTimeList", null, function(require, exports) {
		var a = require("~/Cookie"),
		b = 432e3, //5天
		c = function(b, c) {	//把cookie中保存的sessionTime时间列表存入当前对象的timelist队列中
			this.sesslistKey = "__c_sesslist_" + c,
			this.isActiveKey = "__c_isactive_" + c,
			this.uactiveatKey = "__c_uactiveat_" + c;
			var d = decodeURIComponent(a.get(this.sesslistKey) || "");
			d = d.split(",") || [],
			this.timeList = [];
			for (var e = 0; e < d.length; e++) {
				var f = d[e];
				f && (e != 0 && (f = f.split("_"), f = f.length === 2 ? f[1] : f), this.timeList.push(f))
			}
			this._isChanged = !1,
			this.sessionId = parseInt(b, 10),
			this.siteId = c
		};
		return c.prototype.add = function(a) {//新生成一个sessionTime加入timelist队列尾
			var b = parseInt(a.getTime() / 1e3 / 86400),
			b = this.sessionId.toString(36) + "_" + b.toString(36);
			b !== this.timeList[0] && (this.timeList.unshift(b), this._isChanged = !0)
		},
		c.prototype.addNow = function() {//以当前时间新生成一个sessionTime加入timelist队列尾
			this.add(new Date)
		},
		c.prototype.save = function(c) {//把timelist队列中的前10个保存到cookie中
			if (this._isChanged || c) {
				var d = encodeURIComponent(this.timeList.slice(0, 10).join(","));
				a.set2(this.siteId, this.sesslistKey, d, b, "/")
			}
		},
		//判断cookie中活跃值，如果为1，则根据b值返回2或3，如果不为1，则可能超过五天或cookie被清空等，此时利用timelist中最近三次的访问时间
		//判断是否超过五天，来确定is_active的值
		c.prototype.checkActive = function(b) {	//b==true: 今天没有访问；b==false：今天有访问
			var c = a.get(this.isActiveKey);
			if (c === "1") return this.updateActive(), b ? 2 : 3;
			var d = parseInt((new Date).getTime() / 1e3 / 86400);
			for (var e = 0; e < 3; e++) {
				var f = String(this.timeList[e] || "0_1").split("_");
				f = f.length == 2 ? f[1] : f[0],
				f = parseInt(f || "1", 36),
				f = isNaN(f) ? 0 : f;
				if (d - f > 5) return 0
			}
			this.updateActive();
			var g = a.get(this.uactiveatKey);
			return g || a.set2(this.siteId, this.uactiveatKey, (new Date).getTime(), 36e7, "/"),
			1
		},
		c.prototype.updateActive = function() {//更新cookie中活跃度的值1，保存时间5天
			a.set2(this.siteId, this.isActiveKey, "1", b, "/")
		},
		{
			New: function(a, b) {
				return new c(a, b)
			}
		}
	}),

	Clicki.define("~/Session", null, function(require, exports) {
		function g(g) {
			var h = "__c_session_" + g.site_id,
			i = "__c_pv_" + g.site_id,
			k = "__c_review_" + g.site_id,
			l = "__c_today_" + g.site_id,
			m = "__c_session_at_" + g.site_id,
			n = "__c_last_" + g.site_id,
			o = a.Get(g), 	//Visitor对象{id, is_new, is_active}
			p = c.Get(g),	//page对象{data: {url, domain, title, server_time, loadtime}}
			q = b.get(h),	//从cookie中获取sessionid
			r = 0,
			s = 0,
			t = b.get(i),
			u = b.get(k),
			v = b.get(l),
			w = new Date,
			x = w.getTime(),
			y = g.time,
			z = 0,
			A = b.get(n);
			if (!q) q = g.millisecond;		//本次访问的服务器时间millisecond作为session_id的值
			else {							//如果距离上次心跳的时间超过20分钟，则认为是一次新的访问
				var B = Number(b.get(m)); 
				!isNaN(B) && B > 13330104798 && x - B > 12e5 && (q = g.millisecond, b.set2(g.site_id, m, ""), t = 0)
			}
			var C = f.New(q, g.site_id);	//创建了一个sessionTimelist对象
			C.addNow(),						//用当前时间创建一个sessionTime加入timelist队列中
			C.save();						//timelist队列的值存入cookie
			var D = C.checkActive(!v);		//判断用户活跃度
			o.is_active = D;				//用户活跃度赋值给Visitor对象的is_active属性
			var E = 86400 - w.getHours() * 3600 - w.getMinutes() * 60 - w.getSeconds();		//今天的剩余时间
			return t++,						//pv次数加1
			v || z++,
			t == 1 && (v++, u++),
			o.is_new && (u = 0),
			b.set2(g.site_id, i, t),
			b.set2(g.site_id, h, q),		//第一次访问时的millisecond(服务器返回时间)作为session_id的值，并存入cookie
			b.set2(g.site_id, l, v, E, "/"),//今天的访问次数存cookie今天的剩余时间数
			b.set2(g.site_id, k, u, 36e7, "/"),
			b.set2(g.site_id, n, y, 36e7, "/"),
			b.set2(g.site_id, "__c_visitor", o.id, 36e7, "/"),
			{
				flow_key: j(),				//随机数
				site_id: g.site_id,			//网站id
				session_id: q,				//本次会话的id，本次回话开始时访问服务器的时间
				flow_id: t,					//本次会话的总访问页面数
				visitor: o,					//visitor对象，三个属性 id：用户标识，用户第一次访问网站的服务器时间, is_new：用户是否是新访客, is_active：用户处于的活跃状态。
				today: v,					//今天的访问次数
				review: u,					//10万小时内回访次数
				referer: d,					//页面来源
				page: p.data,				//page对象，五个属性 url, domain, title, server_time，loadtime
				client: e,					//client对象, agent, screen.width, screen.height, screen.size
				refresh: function(a) {
					t++,
					b.set2(g.site_id, i, t),
					this.flow_id = t,
					this.flow_key = j(),
					p.refresh(a),
					this.page = p.data,
					o.is_new = 0
				}
			}
		}
		function j() {
			var a = Math.floor(((new Date).getTime() % 1e6 + Math.random()) * 1e3),
			b = h.length,
			c = "";
			while (a > 0) c += h[a % b],
			a = Math.floor(a / b);
			return c
		}
		var a = require("~/Visitor"),
		b = require("~/Cookie"),
		c = require("~/Page"),
		d = require("~/Referer"),
		e = require("~/Client"),
		f = require("~/SessionTimeList"),
		h = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];		
		for (var i = 0; i < 26; i++) h.push(String.fromCharCode(97 + i), String.fromCharCode(65 + i));	//h是数字字母表数组
		return {
			New: function(a) {
				return g(a)
			}
		}
	}),
	
	//客户端Client模块，收集信息：浏览器信息，屏幕宽高，页面大小的指标
	Clicki.define("~/Client", null, function(require, exports) {
		var a = document,
		b = a.compatMode === "CSS1Compat" ? a.documentElement: a.body,
		c = Math.round(b.clientWidth * b.clientHeight / 1e4);
		return {
			agent: navigator.userAgent,
			screen: {
				width: screen.width,
				height: screen.height,
				size: c
			}
		}
	}),

	Clicki.define("~/Observer", null, function(require, exports) {
		var a = require("~/Json"),
		b = require("~/Cookie"),
		c = require("~/CustomTrack"),
		d = require("~/ActionTrack"),
		e = require("~/Session"),
		f = function(a) {
			this.tracker = a,
			this.conf = a.conf,
			this.lastTrackTime = (new Date).getTime(),
			this.session = e.New(this.conf),
			this.actionTrack = d.Get(),
			this.sessionAtKey = "__c_session_at_" + a.conf.site_id;
			var b = this,
			c = {
				_t: null,
				heartbeatTrack: function() {
					b.track(2)
				},
				start: function() {
					c._t = setInterval(c.heartbeatTrack, 1e3)
				},
				stop: function() {
					clearInterval(c._t)
				}
			};
			this.trackTimer = c
		};
		return f.prototype = {
			getRf: function() {
				return this.conf.rf_key || ""
			},
			checkCrossDomains: function() {
				if (!this.conf.cross_domains) return ! 1;
				var a = "," + window.location.host + ",",
				b = "," + this.conf.cross_domains + ",";
				return b.indexOf(a) < 0 ? !1 : !0
			},
			track: function(d) {
				var e = (new Date).getTime() - this.lastTrackTime;
				if (d === 2 && e < 6e4 && (!this.actionTrack.needTrack() || e < 1e4) && !c.needTrack(this.conf.site_id)) return;
				this.lastTrackTime = (new Date).getTime();
				var f = this.conf,
				g = this.session,
				h = f.session_key,
				i = g.session_id;
				g.customs = c.getCustomTrackData(f.site_id),
				g.actions = this.actionTrack.getActionTrackData(f);
				var j = ["rf=" + this.getRf(), "t=" + d, "i=" + g.site_id, "fk=" + g.flow_key],
				k = this.checkCrossDomains();
				k ? j.push("k=" + h) : (j.push("s=" + i), j.push("fi=" + g.flow_id));
				if (d === 0) {
					var l = g.visitor;
					j.push("v=" + l.id + "-" + l.is_new + "-" + l.is_active),
					k || (j.push("rv=" + g.review), j.push("td=" + g.today)),
					g.referer.url && j.push("ru=" + encodeURIComponent(g.referer.url));
					var m = g.client.screen;
					j.push("sr=" + m.height + "-" + m.width + "-" + m.size);
					var n = g.page;
					j.push("u=" + encodeURIComponent(n.url)),
					j.push("dt=" + encodeURIComponent(n.title)),
					j.push("st=" + n.server_time),
					j.push("lt=" + n.loadtime)
				}
				g.customs.length && j.push("ct=" + encodeURIComponent(a.stringify(g.customs))),
				g.actions.length && j.push("ac=" + encodeURIComponent(a.stringify(g.actions)));
				var o = this.sessionAtKey,
				p = this.tracker.host + "refer/track_proxy?" + j.join("&");
				Clicki.track(p,
				function(a) {
					a === "onload" && b.set2(f.site_id, o, (new Date).getTime())
				}),
				setTimeout(function() {},
				500)
			},
			refresh: function(a) {
				this.trackTimer.stop(),
				this.track(1),
				this.conf.rf_key = "-1",
				this.session.refresh(a),
				this.track(0),
				this.trackTimer.start()
			}
		},
		{
			init: function(a) {								//
				var b = new f(a);							//创建Observer的对象
				return a.Observer = b,
				b.track(0),									//发送收集的数据给服务器track(0)
				b.trackTimer.start(),						//启动心跳，心跳发送函数track(2)
				Clicki.bindEvent(window, "beforeunload",	//添加事件在页面退出时告知服务器track(1)
				function() {
					b.track(1)
				}),
				b
			}
		}
	}),

	Clicki.define("~/AppEngine", null, function(require, exports) {
		function b() {
			for (var b in a) c(a[b])
		}
		function c(a) {
			var b = document.getElementById("clicki_widget_" + a.id) || document.getElementById("clicki_group_" + a.group_id);
			if (b) {
				var a = a;
				a.available = 1,
				a.APP_PATH = a.APP_PATH || Clicki.host + "widget/apps/app_" + a.app_id,
				a.RES_PATH = a.APP_PATH + "/res",
				Clicki.use(a.APP_PATH + "/main",
				function(a, b) {
					return function(c) {
						c && c.init(a, b)
					}
				} (a, b.id))
			}
		}
		function d(a) {
			if (!a) return;
			var b = {
				name: a
			};
			b.APP_PATH = Clicki.host + "widget/system_widget/" + b.name,
			b.RES_PATH = b.APP_PATH + "/res",
			require.async(b.APP_PATH + "/main",
			function(a) {
				return function(b) {
					b && b.init(a)
				}
			} (b))
		}
		function e() {
			if (!Clicki.is_logined) return;
			if (window.location.hash.indexOf("#/clicki/heatmap") < 0) return;
			Clicki.IS_HEATMAP = !0,
			d("heatmap")
		}
		var a = Clicki.registry.widgets;
		return {
			init: function() {
				e(),
				b()
			},
			loadApp: c
		}
	}),

	//加载conf.jscode中js的模块
	Clicki.define("~/LoadJsCode", null, function(require, exports) {
		var a = function(a) {
			if (!a || !a.items) return null;
			var b = [],
			c = 0;
			for (var d in a.items) {
				var e = a.items[d];
				b[c] = e,
				c++
			}
			return b
		},
		b = function(a) {
			return a = a.replace(/\./ig, "\\."),
			a = a.replace(/\*/ig, ".*"),
			a = a.replace(/\//ig, "\\/"),
			a = a.replace(/\?/ig, "\\?"),
			"^" + a + "$"
		},
		c = function(a, c) {
			if (!a || !c) return ! 1;
			for (var d = 0; d < c.length; d++) {
				var e = c[d];
				e.indexOf("http") !== 0 && e.indexOf("https") !== 0 && e[0] != "*" && (e = "*" + e);
				var f = b(e);
				f = new RegExp(f, "i");
				if (f.test(a)) return ! 0
			}
			return ! 1
		},
		d = function(b) {
			var d = a(b.conf.jscode);
			if (!d) return;
			var e = "",
			f = window.location.href;
			for (var g = 0; g < d.length; g++) {
				var h = d[g],
				i = h.url,
				j = c(f, i);
				h.exclude && h.exclude.length && c(f, h.exclude) && (j = !1),
				j && (e += "\n//*** " + h.name + " ***\n" + h.code)
			}
			if (e) try {
				var k = new Function("", e);
				k()
			} catch(l) {
				window.console && console.warn("load js code error:", l)
			}
		};
		return {
			init: function(a) {
				d(a)
			}
		}
	}),
	window.CClicki || (window.CClicki = Clicki, window.Clicki || (window.Clicki = Clicki))
})()