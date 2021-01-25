'use strict';
window.Modernizr = function(EMSarray, document, undefined) {
  /**
   * @param {string} str
   * @return {undefined}
   */
  function update(str) {
    /** @type {string} */
    mStyle.cssText = str;
  }
  /**
   * @param {string} value
   * @param {string} useCookieFallback
   * @return {?}
   */
  function save(value, useCookieFallback) {
    return update(prefixes.join(value + ";") + (useCookieFallback || ""));
  }
  /**
   * @param {!Function} a
   * @param {string} b
   * @return {?}
   */
  function is(a, b) {
    return typeof a === b;
  }
  /**
   * @param {string} y
   * @param {?} left
   * @return {?}
   */
  function C(y, left) {
    return !!~("" + y).indexOf(left);
  }
  /**
   * @param {!Object} args
   * @param {!Object} obj
   * @param {!Object} type
   * @return {?}
   */
  function emitIcicleData(args, obj, type) {
    var i;
    for (i in args) {
      var value = obj[args[i]];
      if (value !== undefined) {
        return type === false ? args[i] : is(value, "function") ? value.bind(type || obj) : value;
      }
    }
    return false;
  }
  /** @type {string} */
  var version = "2.6.2";
  var Modernizr = {};
  /** @type {boolean} */
  var wait = true;
  /** @type {!Element} */
  var docElement = document.documentElement;
  /** @type {string} */
  var mod = "modernizr";
  /** @type {!Element} */
  var modElem = document.createElement(mod);
  /** @type {!CSSStyleDeclaration} */
  var mStyle = modElem.style;
  var inputElem;
  /** @type {function(this:*): string} */
  var objectToString$2 = {}.toString;
  var actual = {};
  var M = {};
  var L = {};
  /** @type {!Array} */
  var classes = [];
  /** @type {function(this:(IArrayLike<T>|string), *=, *=): !Array<T>} */
  var slice = classes.slice;
  var featureName;
  /** @type {function(this:Object, *): boolean} */
  var x = {}.hasOwnProperty;
  var hasOwnProperty;
  if (!is(x, "undefined") && !is(x.call, "undefined")) {
    /**
     * @param {string} obj
     * @param {string} property
     * @return {?}
     */
    hasOwnProperty = function(obj, property) {
      return x.call(obj, property);
    };
  } else {
    /**
     * @param {!Object} object
     * @param {string} property
     * @return {?}
     */
    hasOwnProperty = function(object, property) {
      return property in object && is(object.constructor.prototype[property], "undefined");
    };
  }
  if (!Function.prototype.bind) {
    /**
     * @param {(Object|null|undefined)} ports
     * @param {...*} p1
     * @return {!Function}
     */
    Function.prototype.bind = function(ports) {
      /** @type {!Function} */
      var $ = this;
      if (typeof $ != "function") {
        throw new TypeError;
      }
      /** @type {!Array<?>} */
      var headArgs = slice.call(arguments, 1);
      /**
       * @return {?}
       */
      var e = function() {
        if (this instanceof e) {
          /**
           * @return {undefined}
           */
          var a = function() {
          };
          a.prototype = $.prototype;
          var child = new a;
          var result = $.apply(child, headArgs.concat(slice.call(arguments)));
          return Object(result) === result ? result : child;
        }
        return $.apply(ports, headArgs.concat(slice.call(arguments)));
      };
      return e;
    };
  }
  /**
   * @return {?}
   */
  actual.canvas = function() {
    /** @type {!Element} */
    var textedCanvas = document.createElement("canvas");
    return !!textedCanvas.getContext && !!textedCanvas.getContext("2d");
  };
  /**
   * @return {?}
   */
  actual.canvastext = function() {
    return !!Modernizr.canvas && !!is(document.createElement("canvas").getContext("2d").fillText, "function");
  };
  /**
   * @return {?}
   */
  actual.audio = function() {
    /** @type {!Element} */
    var doc = document.createElement("audio");
    /** @type {boolean} */
    var bool = false;
    try {
      if (bool = !!doc.canPlayType) {
        /** @type {!Boolean} */
        bool = new Boolean(bool);
        bool.ogg = doc.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, "");
        bool.mp3 = doc.canPlayType("audio/mpeg;").replace(/^no$/, "");
        bool.wav = doc.canPlayType('audio/wav; codecs="1"').replace(/^no$/, "");
        bool.m4a = (doc.canPlayType("audio/x-m4a;") || doc.canPlayType("audio/aac;")).replace(/^no$/, "");
      }
    } catch (e) {
    }
    return bool;
  };
  /**
   * @return {?}
   */
  actual.localstorage = function() {
    try {
      return localStorage.setItem(mod, mod), localStorage.removeItem(mod), true;
    } catch (b) {
      return false;
    }
  };
  var key;
  for (key in actual) {
    if (hasOwnProperty(actual, key)) {
      /** @type {string} */
      featureName = key.toLowerCase();
      Modernizr[featureName] = actual[key]();
      classes.push((Modernizr[featureName] ? "" : "no-") + featureName);
    }
  }
  return Modernizr.addTest = function(feature, test) {
    if (typeof feature == "object") {
      var key;
      for (key in feature) {
        if (hasOwnProperty(feature, key)) {
          Modernizr.addTest(key, feature[key]);
        }
      }
    } else {
      feature = feature.toLowerCase();
      if (Modernizr[feature] !== undefined) {
        return Modernizr;
      }
      test = typeof test == "function" ? test() : test;
      if (typeof wait != "undefined" && wait) {
        docElement.className += " " + (test ? "" : "no-") + feature;
      }
      /** @type {boolean} */
      Modernizr[feature] = test;
    }
    return Modernizr;
  }, update(""), modElem = inputElem = null, function(window, document) {
    /**
     * @param {!Document} document
     * @param {string} url
     * @return {?}
     */
    function addStyleSheet(document, url) {
      var dummy = document.createElement("p");
      var fragment = document.getElementsByTagName("head")[0] || document.documentElement;
      return dummy.innerHTML = "x<style>" + url + "</style>", fragment.insertBefore(dummy.lastChild, fragment.firstChild);
    }
    /**
     * @return {?}
     */
    function getElements() {
      var elements = html5.elements;
      return typeof elements == "string" ? elements.split(" ") : elements;
    }
    /**
     * @param {!Document} ownerDocument
     * @return {?}
     */
    function getExpandoData(ownerDocument) {
      var data = expandoData[ownerDocument[expando]];
      return data || (data = {}, expanID++, ownerDocument[expando] = expanID, expandoData[expanID] = data), data;
    }
    /**
     * @param {string} nodeName
     * @param {!Document} ownerDocument
     * @param {!Object} data
     * @return {?}
     */
    function createElement(nodeName, ownerDocument, data) {
      if (!ownerDocument) {
        /** @type {!HTMLDocument} */
        ownerDocument = document;
      }
      if (instance) {
        return ownerDocument.createElement(nodeName);
      }
      if (!data) {
        data = getExpandoData(ownerDocument);
      }
      var node;
      return data.cache[nodeName] ? node = data.cache[nodeName].cloneNode() : focusRe.test(nodeName) ? node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode() : node = data.createElem(nodeName), node.canHaveChildren && !rinput.test(nodeName) ? data.frag.appendChild(node) : node;
    }
    /**
     * @param {!Document} ownerDocument
     * @param {!Object} data
     * @return {?}
     */
    function createDocumentFragment(ownerDocument, data) {
      if (!ownerDocument) {
        /** @type {!HTMLDocument} */
        ownerDocument = document;
      }
      if (instance) {
        return ownerDocument.createDocumentFragment();
      }
      data = data || getExpandoData(ownerDocument);
      var clone = data.frag.cloneNode();
      /** @type {number} */
      var i = 0;
      var elems = getElements();
      var length = elems.length;
      for (; i < length; i++) {
        clone.createElement(elems[i]);
      }
      return clone;
    }
    /**
     * @param {(Document|DocumentFragment)} ownerDocument
     * @param {!Object} data
     * @return {undefined}
     */
    function shivMethods(ownerDocument, data) {
      if (!data.cache) {
        data.cache = {};
        /** @type {function(string): ?} */
        data.createElem = ownerDocument.createElement;
        data.createFrag = ownerDocument.createDocumentFragment;
        data.frag = data.createFrag();
      }
      /**
       * @param {string} nodeName
       * @return {?}
       */
      ownerDocument.createElement = function(nodeName) {
        return html5.shivMethods ? createElement(nodeName, ownerDocument, data) : data.createElem(nodeName);
      };
      ownerDocument.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + getElements().join().replace(/\w+/g, function(a) {
        return data.createElem(a), data.frag.createElement(a), 'c("' + a + '")';
      }) + ");return n}")(html5, data.frag);
    }
    /**
     * @param {!Document} ownerDocument
     * @return {?}
     */
    function shivDocument(ownerDocument) {
      if (!ownerDocument) {
        /** @type {!HTMLDocument} */
        ownerDocument = document;
      }
      var data = getExpandoData(ownerDocument);
      return html5.shivCSS && !supportsHtml5Styles && !data.hasCSS && (data.hasCSS = !!addStyleSheet(ownerDocument, "article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")), instance || shivMethods(ownerDocument, data), ownerDocument;
    }
    var options = window.html5 || {};
    /** @type {!RegExp} */
    var rinput = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;
    /** @type {!RegExp} */
    var focusRe = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;
    var supportsHtml5Styles;
    /** @type {string} */
    var expando = "_html5shiv";
    /** @type {number} */
    var expanID = 0;
    var expandoData = {};
    var instance;
    (function() {
      try {
        /** @type {!Element} */
        var a = document.createElement("a");
        /** @type {string} */
        a.innerHTML = "<xyz></xyz>";
        /** @type {boolean} */
        supportsHtml5Styles = "hidden" in a;
        instance = a.childNodes.length == 1 || function() {
          document.createElement("a");
          /** @type {!DocumentFragment} */
          var context = document.createDocumentFragment();
          return typeof context.cloneNode == "undefined" || typeof context.createDocumentFragment == "undefined" || typeof context.createElement == "undefined";
        }();
      } catch (d) {
        /** @type {boolean} */
        supportsHtml5Styles = true;
        /** @type {boolean} */
        instance = true;
      }
    })();
    var html5 = {
      elements : options.elements || "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",
      shivCSS : options.shivCSS !== false,
      supportsUnknownElements : instance,
      shivMethods : options.shivMethods !== false,
      type : "default",
      shivDocument : shivDocument,
      createElement : createElement,
      createDocumentFragment : createDocumentFragment
    };
    window.html5 = html5;
    shivDocument(document);
  }(this, document), Modernizr._version = version, docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (wait ? " js " + classes.join(" ") : ""), Modernizr;
}(this, this.document), function(window, document, c) {
  /**
   * @param {!Function} value
   * @return {?}
   */
  function d(value) {
    return "[object Function]" == toString.call(value);
  }
  /**
   * @param {!Object} value
   * @return {?}
   */
  function e(value) {
    return "string" == typeof value;
  }
  /**
   * @return {undefined}
   */
  function noop() {
  }
  /**
   * @param {string} a
   * @return {?}
   */
  function isFileReady(a) {
    return !a || "loaded" == a || "complete" == a || "uninitialized" == a;
  }
  /**
   * @return {undefined}
   */
  function executeStack() {
    var a = p.shift();
    /** @type {number} */
    q = 1;
    if (a) {
      if (a.t) {
        sTimeout(function() {
          ("c" == a.t ? B.injectCss : B.injectJs)(a.s, 0, a.a, a.x, a.e, 1);
        }, 0);
      } else {
        a();
        executeStack();
      }
    } else {
      /** @type {number} */
      q = 0;
    }
  }
  /**
   * @param {string} a
   * @param {!Object} c
   * @param {string} type
   * @param {number} i
   * @param {!Function} n
   * @param {number} s
   * @param {number} e
   * @return {undefined}
   */
  function i(a, c, type, i, n, s, e) {
    /**
     * @param {?} fileLoadedEvent
     * @return {undefined}
     */
    function onload(fileLoadedEvent) {
      if (!done && isFileReady(el.readyState) && (stackObject.r = done = 1, !q && executeStack(), el.onload = el.onreadystatechange = null, fileLoadedEvent)) {
        if ("img" != a) {
          sTimeout(function() {
            t.removeChild(el);
          }, 50);
        }
        var n;
        for (n in data[c]) {
          if (data[c].hasOwnProperty(n)) {
            data[c][n].onload();
          }
        }
      }
    }
    e = e || B.errorTimeout;
    /** @type {!Element} */
    var el = document.createElement(a);
    /** @type {number} */
    var done = 0;
    /** @type {number} */
    var firstFlag = 0;
    var stackObject = {
      t : type,
      s : c,
      e : n,
      a : s,
      x : e
    };
    if (1 === data[c]) {
      /** @type {number} */
      firstFlag = 1;
      /** @type {!Array} */
      data[c] = [];
    }
    if ("object" == a) {
      /** @type {!Object} */
      el.data = c;
    } else {
      /** @type {!Object} */
      el.src = c;
      /** @type {string} */
      el.type = a;
    }
    /** @type {string} */
    el.width = el.height = "0";
    /** @type {function(): undefined} */
    el.onerror = el.onload = el.onreadystatechange = function() {
      onload.call(this, firstFlag);
    };
    p.splice(i, 0, stackObject);
    if ("img" != a) {
      if (firstFlag || 2 === data[c]) {
        t.insertBefore(el, s ? null : n);
        sTimeout(onload, e);
      } else {
        data[c].push(el);
      }
    }
  }
  /**
   * @param {!Array} a
   * @param {string} b
   * @param {!Function} c
   * @param {undefined} d
   * @param {undefined} f
   * @return {?}
   */
  function j(a, b, c, d, f) {
    return q = 0, b = b || "j", e(a) ? i("c" == b ? v : u, a, b, this.i++, c, d, f) : (p.splice(this.i++, 0, a), 1 == p.length && executeStack()), this;
  }
  /**
   * @return {?}
   */
  function getYepnope() {
    var a = B;
    return a.loader = {
      load : j,
      i : 0
    }, a;
  }
  /** @type {!Element} */
  var l = document.documentElement;
  /** @type {function((!Function|null|string), number=, ...*): number} */
  var sTimeout = window.setTimeout;
  /** @type {!Element} */
  var n = document.getElementsByTagName("script")[0];
  /** @type {function(this:*): string} */
  var toString = {}.toString;
  /** @type {!Array} */
  var p = [];
  /** @type {number} */
  var q = 0;
  /** @type {boolean} */
  var r = "MozAppearance" in l.style;
  /** @type {boolean} */
  var s = r && !!document.createRange().compareNode;
  /** @type {(Node|null)} */
  var t = s ? l : n.parentNode;
  l = window.opera && "[object Opera]" == toString.call(window.opera);
  /** @type {boolean} */
  l = !!document.attachEvent && !l;
  /** @type {string} */
  var u = r ? "object" : l ? "script" : "img";
  /** @type {string} */
  var v = l ? "script" : u;
  /** @type {function(*): boolean} */
  var h = Array.isArray || function(obj) {
    return "[object Array]" == toString.call(obj);
  };
  /** @type {!Array} */
  var set = [];
  var data = {};
  var obj = {
    timeout : function(a, b) {
      return b.length && (a.timeout = b[0]), a;
    }
  };
  var handler;
  var B;
  /**
   * @param {!Object} value
   * @return {undefined}
   */
  B = function(value) {
    /**
     * @param {!Object} a
     * @return {?}
     */
    function b(a) {
      a = a.split("!");
      /** @type {number} */
      var l = set.length;
      var c = a.pop();
      var az = a.length;
      c = {
        url : c,
        origUrl : c,
        prefixes : a
      };
      var j;
      var i;
      var data;
      /** @type {number} */
      i = 0;
      for (; i < az; i++) {
        data = a[i].split("=");
        if (j = obj[data.shift()]) {
          c = j(c, data);
        }
      }
      /** @type {number} */
      i = 0;
      for (; i < l; i++) {
        c = set[i](c);
      }
      return c;
    }
    /**
     * @param {!Object} a
     * @param {!Function} e
     * @param {!Object} f
     * @param {!Object} g
     * @param {boolean} h
     * @return {undefined}
     */
    function g(a, e, f, g, h) {
      var i = b(a);
      var j = i.autoCallback;
      i.url.split(".").pop().split("?").shift();
      if (!i.bypass) {
        if (e) {
          e = d(e) ? e : e[a] || e[g] || e[a.split("/").pop().split("?")[0]];
        }
        if (i.instead) {
          i.instead(a, e, f, g, h);
        } else {
          if (data[i.url]) {
            /** @type {boolean} */
            i.noexec = true;
          } else {
            /** @type {number} */
            data[i.url] = 1;
          }
          f.load(i.url, i.forceCSS || !i.forceJS && "css" == i.url.split(".").pop().split("?").shift() ? "c" : c, i.noexec, i.attrs, i.timeout);
          if (d(e) || d(j)) {
            f.load(function() {
              getYepnope();
              if (e) {
                e(i.origUrl, h, g);
              }
              if (j) {
                j(i.origUrl, h, g);
              }
              /** @type {number} */
              data[i.url] = 2;
            });
          }
        }
      }
    }
    /**
     * @param {!Object} a
     * @param {!Object} b
     * @return {undefined}
     */
    function h(a, b) {
      /**
       * @param {!Object} a
       * @param {boolean} fn
       * @return {undefined}
       */
      function c(a, fn) {
        if (a) {
          if (e(a)) {
            if (!fn) {
              /**
               * @return {undefined}
               */
              j = function() {
                /** @type {!Array<?>} */
                var options = [].slice.call(arguments);
                last.apply(this, options);
                log();
              };
            }
            g(a, j, b, 0, h);
          } else {
            if (Object(a) === a) {
              for (n in m = function() {
                /** @type {number} */
                var b = 0;
                var prop;
                for (prop in a) {
                  if (a.hasOwnProperty(prop)) {
                    b++;
                  }
                }
                return b;
              }(), a) {
                if (a.hasOwnProperty(n)) {
                  if (!fn && !--m) {
                    if (d(j)) {
                      /**
                       * @return {undefined}
                       */
                      j = function() {
                        /** @type {!Array<?>} */
                        var options = [].slice.call(arguments);
                        last.apply(this, options);
                        log();
                      };
                    } else {
                      j[n] = function(nativeQuerySelector) {
                        return function() {
                          /** @type {!Array<?>} */
                          var name = [].slice.call(arguments);
                          if (nativeQuerySelector) {
                            nativeQuerySelector.apply(this, name);
                          }
                          log();
                        };
                      }(last[n]);
                    }
                  }
                  g(a[n], j, b, n, h);
                }
              }
            }
          }
        } else {
          if (!fn) {
            log();
          }
        }
      }
      /** @type {boolean} */
      var h = !!a.test;
      var out = a.load || a.both;
      var j = a.callback || noop;
      var last = j;
      var log = a.complete || noop;
      var m;
      var n;
      c(h ? a.yep : a.nope, !!out);
      if (out) {
        c(out);
      }
    }
    var i;
    var a;
    var l = this.yepnope.loader;
    if (e(value)) {
      g(value, 0, l, 0);
    } else {
      if (h(value)) {
        /** @type {number} */
        i = 0;
        for (; i < value.length; i++) {
          a = value[i];
          if (e(a)) {
            g(a, 0, l, 0);
          } else {
            if (h(a)) {
              B(a);
            } else {
              if (Object(a) === a) {
                h(a, l);
              }
            }
          }
        }
      } else {
        if (Object(value) === value) {
          h(value, l);
        }
      }
    }
  };
  /**
   * @param {?} pref
   * @param {?} callback
   * @return {undefined}
   */
  B.addPrefix = function(pref, callback) {
    obj[pref] = callback;
  };
  /**
   * @param {?} value
   * @return {undefined}
   */
  B.addFilter = function(value) {
    set.push(value);
  };
  /** @type {number} */
  B.errorTimeout = 10000;
  if (null == document.readyState && document.addEventListener) {
    /** @type {string} */
    document.readyState = "loading";
    document.addEventListener("DOMContentLoaded", handler = function() {
      document.removeEventListener("DOMContentLoaded", handler, 0);
      /** @type {string} */
      document.readyState = "complete";
    }, 0);
  }
  window.yepnope = getYepnope();
  /** @type {function(): undefined} */
  window.yepnope.executeStack = executeStack;
  /**
   * @param {string} src
   * @param {!Function} cb
   * @param {!Array} attrs
   * @param {number} e
   * @param {?} a
   * @param {!Function} internal
   * @return {undefined}
   */
  window.yepnope.injectJs = function(src, cb, attrs, e, a, internal) {
    /** @type {!Element} */
    var script = document.createElement("script");
    var done;
    var key;
    e = e || B.errorTimeout;
    /** @type {string} */
    script.src = src;
    for (key in attrs) {
      script.setAttribute(key, attrs[key]);
    }
    cb = internal ? executeStack : cb || noop;
    /** @type {function(): undefined} */
    script.onreadystatechange = script.onload = function() {
      if (!done && isFileReady(script.readyState)) {
        /** @type {number} */
        done = 1;
        cb();
        /** @type {null} */
        script.onload = script.onreadystatechange = null;
      }
    };
    sTimeout(function() {
      if (!done) {
        /** @type {number} */
        done = 1;
        cb(1);
      }
    }, e);
    if (a) {
      script.onload();
    } else {
      n.parentNode.insertBefore(script, n);
    }
  };
  /**
   * @param {string} uri
   * @param {!Function} cb
   * @param {!Array} d
   * @param {!Object} e
   * @param {?} options
   * @param {!Function} internal
   * @return {undefined}
   */
  window.yepnope.injectCss = function(uri, cb, d, e, options, internal) {
    /** @type {!Element} */
    e = document.createElement("link");
    var j;
    cb = internal ? executeStack : cb || noop;
    /** @type {string} */
    e.href = uri;
    /** @type {string} */
    e.rel = "stylesheet";
    /** @type {string} */
    e.type = "text/css";
    for (j in d) {
      e.setAttribute(j, d[j]);
    }
    if (!options) {
      n.parentNode.insertBefore(e, n);
      sTimeout(cb, 0);
    }
  };
}(this, document), Modernizr.load = function() {
  yepnope.apply(window, [].slice.call(arguments, 0));
};
/** @type {number} */
var PRODUCTION = 1;
/** @type {number} */
PRODUCTION = PRODUCTION || 0;
vim.loader = function() {
  /**
   * @return {undefined}
   */
  function initialLoad() {
    if (PRODUCTION === 0) {
      Modernizr.load([{
        load : ["js/sizzle.js", "js/dom.js", "js/audio.js", "js/game.js", "js/screen.splash.js", "js/images.js", "js/inventory.js", "js/keys.js", "js/timer.js", "js/fetcher.js", "js/regs.js", "js/model.js", "js/buffer.js", "js/board.js", "js/textarea.js", "js/email.js", "js/stats.js", "js/login.js", "js/entities.js", "js/view.js", "js/cursor.js", "js/gamestate.js", "js/vimgame.js", "js/input.js", "js/screen.game-screen.js", "js/cookieconsent.js"],
        complete : function() {
          vim.game.showScreen("game-screen");
        }
      }]);
    } else {
      Modernizr.load([{
        load : ["js/allinone.js"],
        complete : function() {
          vim.game.showScreen("game-screen");
        }
      }]);
    }
  }
  return {
    initialLoad : initialLoad
  };
}();
if (window.addEventListener) {
  window.addEventListener("load", vim.loader.initialLoad, false);
} else {
  if (window.attachEvent) {
    window.attachEvent("onload", function() {
      /** @type {string} */
      document.getElementById("no-canvas").style.marginTop = "250px";
      /** @type {string} */
      document.getElementById("no-canvas").style.display = "block";
    });
  }
}
;