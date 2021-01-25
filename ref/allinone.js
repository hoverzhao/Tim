'use strict';
(function() {
  /**
   * @param {string} dir
   * @param {string} cur
   * @param {number} doneName
   * @param {string} checkSet
   * @param {!Object} nodeCheck
   * @param {?} isXML
   * @return {undefined}
   */
  function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
    /** @type {number} */
    var i = 0;
    var l = checkSet.length;
    for (; i < l; i++) {
      var elem = checkSet[i];
      if (elem) {
        /** @type {boolean} */
        var match = false;
        elem = elem[dir];
        for (; elem;) {
          if (elem[expando] === doneName) {
            match = checkSet[elem.sizset];
            break;
          }
          if (elem.nodeType === 1 && !isXML) {
            /** @type {number} */
            elem[expando] = doneName;
            /** @type {number} */
            elem.sizset = i;
          }
          if (elem.nodeName.toLowerCase() === cur) {
            match = elem;
            break;
          }
          elem = elem[dir];
        }
        checkSet[i] = match;
      }
    }
  }
  /**
   * @param {string} dir
   * @param {string} cur
   * @param {number} doneName
   * @param {string} checkSet
   * @param {!Object} nodeCheck
   * @param {?} isXML
   * @return {undefined}
   */
  function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
    /** @type {number} */
    var i = 0;
    var l = checkSet.length;
    for (; i < l; i++) {
      var elem = checkSet[i];
      if (elem) {
        /** @type {boolean} */
        var match = false;
        elem = elem[dir];
        for (; elem;) {
          if (elem[expando] === doneName) {
            match = checkSet[elem.sizset];
            break;
          }
          if (elem.nodeType === 1) {
            if (!isXML) {
              /** @type {number} */
              elem[expando] = doneName;
              /** @type {number} */
              elem.sizset = i;
            }
            if (typeof cur !== "string") {
              if (elem === cur) {
                /** @type {boolean} */
                match = true;
                break;
              }
            } else {
              if (Sizzle.filter(cur, [elem]).length > 0) {
                match = elem;
                break;
              }
            }
          }
          elem = elem[dir];
        }
        checkSet[i] = match;
      }
    }
  }
  /** @type {!RegExp} */
  var RE_PART = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g;
  /** @type {string} */
  var expando = "sizcache" + (Math.random() + "").replace(".", "");
  /** @type {number} */
  var done = 0;
  /** @type {function(this:*): string} */
  var toString = Object.prototype.toString;
  /** @type {boolean} */
  var h = false;
  /** @type {boolean} */
  var callHeight = true;
  /** @type {!RegExp} */
  var rBackslash = /\\/g;
  /** @type {!RegExp} */
  var REGEX_ESCAPE_EXPR = /\r\n/g;
  /** @type {!RegExp} */
  var rNonWord = /\W/;
  [0, 0].sort(function() {
    /** @type {boolean} */
    callHeight = false;
    return 0;
  });
  /**
   * @param {string} selector
   * @param {!Object} context
   * @param {!Object} results
   * @param {!Object} seed
   * @return {?}
   */
  var Sizzle = function(selector, context, results, seed) {
    results = results || [];
    context = context || document;
    /** @type {!Object} */
    var origContext = context;
    if (context.nodeType !== 1 && context.nodeType !== 9) {
      return [];
    }
    if (!selector || typeof selector !== "string") {
      return results;
    }
    var m;
    var set;
    var checkSet;
    var extra;
    var ret;
    var cur;
    var pop;
    var i;
    /** @type {boolean} */
    var C = true;
    var contextXML = Sizzle.isXML(context);
    /** @type {!Array} */
    var parts = [];
    /** @type {string} */
    var html = selector;
    do {
      RE_PART.exec("");
      /** @type {(Array<string>|null)} */
      m = RE_PART.exec(html);
      if (m) {
        /** @type {string} */
        html = m[3];
        parts.push(m[1]);
        if (m[2]) {
          /** @type {string} */
          extra = m[3];
          break;
        }
      }
    } while (m);
    if (parts.length > 1 && origPOS.exec(selector)) {
      if (parts.length === 2 && Expr.relative[parts[0]]) {
        set = posProcess(parts[0] + parts[1], context, seed);
      } else {
        set = Expr.relative[parts[0]] ? [context] : Sizzle(parts.shift(), context);
        for (; parts.length;) {
          selector = parts.shift();
          if (Expr.relative[selector]) {
            selector = selector + parts.shift();
          }
          set = posProcess(selector, set, seed);
        }
      }
    } else {
      if (!seed && parts.length > 1 && context.nodeType === 9 && !contextXML && Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1])) {
        ret = Sizzle.find(parts.shift(), context, contextXML);
        context = ret.expr ? Sizzle.filter(ret.expr, ret.set)[0] : ret.set[0];
      }
      if (context) {
        ret = seed ? {
          expr : parts.pop(),
          set : makeArray(seed)
        } : Sizzle.find(parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML);
        set = ret.expr ? Sizzle.filter(ret.expr, ret.set) : ret.set;
        if (parts.length > 0) {
          checkSet = makeArray(set);
        } else {
          /** @type {boolean} */
          C = false;
        }
        for (; parts.length;) {
          cur = parts.pop();
          pop = cur;
          if (!Expr.relative[cur]) {
            /** @type {string} */
            cur = "";
          } else {
            pop = parts.pop();
          }
          if (pop == null) {
            /** @type {!Object} */
            pop = context;
          }
          Expr.relative[cur](checkSet, pop, contextXML);
        }
      } else {
        /** @type {!Array} */
        checkSet = parts = [];
      }
    }
    if (!checkSet) {
      checkSet = set;
    }
    if (!checkSet) {
      Sizzle.error(cur || selector);
    }
    if (toString.call(checkSet) === "[object Array]") {
      if (!C) {
        results.push.apply(results, checkSet);
      } else {
        if (context && context.nodeType === 1) {
          /** @type {number} */
          i = 0;
          for (; checkSet[i] != null; i++) {
            if (checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i]))) {
              results.push(set[i]);
            }
          }
        } else {
          /** @type {number} */
          i = 0;
          for (; checkSet[i] != null; i++) {
            if (checkSet[i] && checkSet[i].nodeType === 1) {
              results.push(set[i]);
            }
          }
        }
      }
    } else {
      makeArray(checkSet, results);
    }
    if (extra) {
      Sizzle(extra, origContext, results, seed);
      Sizzle.uniqueSort(results);
    }
    return results;
  };
  /**
   * @param {!Object} results
   * @return {?}
   */
  Sizzle.uniqueSort = function(results) {
    if (sortOrder) {
      h = callHeight;
      results.sort(sortOrder);
      if (h) {
        /** @type {number} */
        var i = 1;
        for (; i < results.length; i++) {
          if (results[i] === results[i - 1]) {
            results.splice(i--, 1);
          }
        }
      }
    }
    return results;
  };
  /**
   * @param {string} expr
   * @param {!Object} set
   * @return {?}
   */
  Sizzle.matches = function(expr, set) {
    return Sizzle(expr, null, null, set);
  };
  /**
   * @param {?} elem
   * @param {string} expr
   * @return {?}
   */
  Sizzle.matchesSelector = function(elem, expr) {
    return Sizzle(expr, null, null, [elem]).length > 0;
  };
  /**
   * @param {string} expr
   * @param {!Object} context
   * @param {?} isXML
   * @return {?}
   */
  Sizzle.find = function(expr, context, isXML) {
    var set;
    var i;
    var tableslen;
    var match;
    var type;
    var strHexColor;
    if (!expr) {
      return [];
    }
    /** @type {number} */
    i = 0;
    /** @type {number} */
    tableslen = Expr.order.length;
    for (; i < tableslen; i++) {
      type = Expr.order[i];
      if (match = Expr.leftMatch[type].exec(expr)) {
        strHexColor = match[1];
        match.splice(1, 1);
        if (strHexColor.substr(strHexColor.length - 1) !== "\\") {
          match[1] = (match[1] || "").replace(rBackslash, "");
          set = Expr.find[type](match, context, isXML);
          if (set != null) {
            expr = expr.replace(Expr.match[type], "");
            break;
          }
        }
      }
    }
    if (!set) {
      set = typeof context.getElementsByTagName !== "undefined" ? context.getElementsByTagName("*") : [];
    }
    return {
      set : set,
      expr : expr
    };
  };
  /**
   * @param {string} expr
   * @param {!Object} set
   * @param {boolean} inplace
   * @param {boolean} not
   * @return {?}
   */
  Sizzle.filter = function(expr, set, inplace, not) {
    var match;
    var anyFound;
    var type;
    var found;
    var item;
    var filter;
    var strHexColor;
    var i;
    var pass;
    /** @type {string} */
    var old = expr;
    /** @type {!Array} */
    var result = [];
    /** @type {!Object} */
    var curLoop = set;
    var isXMLFilter = set && set[0] && Sizzle.isXML(set[0]);
    for (; expr && set.length;) {
      for (type in Expr.filter) {
        if ((match = Expr.leftMatch[type].exec(expr)) != null && match[2]) {
          filter = Expr.filter[type];
          strHexColor = match[1];
          /** @type {boolean} */
          anyFound = false;
          match.splice(1, 1);
          if (strHexColor.substr(strHexColor.length - 1) === "\\") {
            continue;
          }
          if (curLoop === result) {
            /** @type {!Array} */
            result = [];
          }
          if (Expr.preFilter[type]) {
            match = Expr.preFilter[type](match, curLoop, inplace, result, not, isXMLFilter);
            if (!match) {
              /** @type {boolean} */
              anyFound = found = true;
            } else {
              if (match === true) {
                continue;
              }
            }
          }
          if (match) {
            /** @type {number} */
            i = 0;
            for (; (item = curLoop[i]) != null; i++) {
              if (item) {
                found = filter(item, match, i, curLoop);
                /** @type {number} */
                pass = not ^ found;
                if (inplace && found != null) {
                  if (pass) {
                    /** @type {boolean} */
                    anyFound = true;
                  } else {
                    /** @type {boolean} */
                    curLoop[i] = false;
                  }
                } else {
                  if (pass) {
                    result.push(item);
                    /** @type {boolean} */
                    anyFound = true;
                  }
                }
              }
            }
          }
          if (found !== undefined) {
            if (!inplace) {
              /** @type {!Array} */
              curLoop = result;
            }
            expr = expr.replace(Expr.match[type], "");
            if (!anyFound) {
              return [];
            }
            break;
          }
        }
      }
      if (expr === old) {
        if (anyFound == null) {
          Sizzle.error(expr);
        } else {
          break;
        }
      }
      /** @type {string} */
      old = expr;
    }
    return curLoop;
  };
  /**
   * @param {string} prop
   * @return {?}
   */
  Sizzle.error = function(prop) {
    throw new Error("Syntax error, unrecognized expression: " + prop);
  };
  /** @type {function(!Object): ?} */
  var getText = Sizzle.getText = function(node) {
    var CURRENT_STYLE;
    var current;
    var nodeType = node.nodeType;
    /** @type {string} */
    var ret = "";
    if (nodeType) {
      if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
        if (typeof node.textContent === "string") {
          return node.textContent;
        } else {
          if (typeof node.innerText === "string") {
            return node.innerText.replace(REGEX_ESCAPE_EXPR, "");
          } else {
            node = node.firstChild;
            for (; node; node = node.nextSibling) {
              /** @type {string} */
              ret = ret + getText(node);
            }
          }
        }
      } else {
        if (nodeType === 3 || nodeType === 4) {
          return node.nodeValue;
        }
      }
    } else {
      /** @type {number} */
      CURRENT_STYLE = 0;
      for (; current = node[CURRENT_STYLE]; CURRENT_STYLE++) {
        if (current.nodeType !== 8) {
          /** @type {string} */
          ret = ret + getText(current);
        }
      }
    }
    return ret;
  };
  var Expr = Sizzle.selectors = {
    order : ["ID", "NAME", "TAG"],
    match : {
      ID : /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
      CLASS : /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
      NAME : /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
      ATTR : /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
      TAG : /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
      CHILD : /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
      POS : /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
      PSEUDO : /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
    },
    leftMatch : {},
    attrMap : {
      "class" : "className",
      "for" : "htmlFor"
    },
    attrHandle : {
      href : function(elem) {
        return elem.getAttribute("href");
      },
      type : function(id) {
        return id.getAttribute("type");
      }
    },
    relative : {
      "+" : function(checkSet, part) {
        /** @type {boolean} */
        var isPartStr = typeof part === "string";
        /** @type {boolean} */
        var isTag = isPartStr && !rNonWord.test(part);
        /** @type {boolean} */
        var isPartStrNotTag = isPartStr && !isTag;
        if (isTag) {
          part = part.toLowerCase();
        }
        /** @type {number} */
        var i = 0;
        var l = checkSet.length;
        var elem;
        for (; i < l; i++) {
          if (elem = checkSet[i]) {
            for (; (elem = elem.previousSibling) && elem.nodeType !== 1;) {
            }
            checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ? elem || false : elem === part;
          }
        }
        if (isPartStrNotTag) {
          Sizzle.filter(part, checkSet, true);
        }
      },
      ">" : function(id, part) {
        var elem;
        /** @type {boolean} */
        var isPartStr = typeof part === "string";
        /** @type {number} */
        var i = 0;
        var dims = id.length;
        if (isPartStr && !rNonWord.test(part)) {
          part = part.toLowerCase();
          for (; i < dims; i++) {
            elem = id[i];
            if (elem) {
              var parent = elem.parentNode;
              id[i] = parent.nodeName.toLowerCase() === part ? parent : false;
            }
          }
        } else {
          for (; i < dims; i++) {
            elem = id[i];
            if (elem) {
              id[i] = isPartStr ? elem.parentNode : elem.parentNode === part;
            }
          }
          if (isPartStr) {
            Sizzle.filter(part, id, true);
          }
        }
      },
      "" : function(checkSet, part, isXML) {
        var nodeCheck;
        /** @type {number} */
        var doneName = done++;
        /** @type {function(string, string, number, string, !Object, ?): undefined} */
        var checkFn = dirCheck;
        if (typeof part === "string" && !rNonWord.test(part)) {
          /** @type {string} */
          part = part.toLowerCase();
          /** @type {string} */
          nodeCheck = part;
          /** @type {function(string, string, number, string, !Object, ?): undefined} */
          checkFn = dirNodeCheck;
        }
        checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
      },
      "~" : function(id, part, isXML) {
        var nodeCheck;
        /** @type {number} */
        var doneName = done++;
        /** @type {function(string, string, number, string, !Object, ?): undefined} */
        var checkFn = dirCheck;
        if (typeof part === "string" && !rNonWord.test(part)) {
          /** @type {string} */
          part = part.toLowerCase();
          /** @type {string} */
          nodeCheck = part;
          /** @type {function(string, string, number, string, !Object, ?): undefined} */
          checkFn = dirNodeCheck;
        }
        checkFn("previousSibling", part, doneName, id, nodeCheck, isXML);
      }
    },
    find : {
      ID : function(match, context, isXML) {
        if (typeof context.getElementById !== "undefined" && !isXML) {
          var ref = context.getElementById(match[1]);
          return ref && ref.parentNode ? [ref] : [];
        }
      },
      NAME : function(match, context) {
        if (typeof context.getElementsByName !== "undefined") {
          /** @type {!Array} */
          var cellsUpdated = [];
          var cells = context.getElementsByName(match[1]);
          /** @type {number} */
          var i = 0;
          var ncells = cells.length;
          for (; i < ncells; i++) {
            if (cells[i].getAttribute("name") === match[1]) {
              cellsUpdated.push(cells[i]);
            }
          }
          return cellsUpdated.length === 0 ? null : cellsUpdated;
        }
      },
      TAG : function(match, context) {
        if (typeof context.getElementsByTagName !== "undefined") {
          return context.getElementsByTagName(match[1]);
        }
      }
    },
    preFilter : {
      CLASS : function(match, curLoop, inplace, result, not, isXML) {
        /** @type {string} */
        match = " " + match[1].replace(rBackslash, "") + " ";
        if (isXML) {
          return match;
        }
        /** @type {number} */
        var i = 0;
        var elem;
        for (; (elem = curLoop[i]) != null; i++) {
          if (elem) {
            if (not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0)) {
              if (!inplace) {
                result.push(elem);
              }
            } else {
              if (inplace) {
                /** @type {boolean} */
                curLoop[i] = false;
              }
            }
          }
        }
        return false;
      },
      ID : function(match) {
        return match[1].replace(rBackslash, "");
      },
      TAG : function(match, context) {
        return match[1].replace(rBackslash, "").toLowerCase();
      },
      CHILD : function(match) {
        if (match[1] === "nth") {
          if (!match[2]) {
            Sizzle.error(match[0]);
          }
          match[2] = match[2].replace(/^\+|\s*/g, "");
          /** @type {(Array<string>|null)} */
          var z = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" || !/\D/.test(match[2]) && "0n+" + match[2] || match[2]);
          /** @type {number} */
          match[2] = z[1] + (z[2] || 1) - 0;
          /** @type {number} */
          match[3] = z[3] - 0;
        } else {
          if (match[2]) {
            Sizzle.error(match[0]);
          }
        }
        /** @type {number} */
        match[0] = done++;
        return match;
      },
      ATTR : function(match, curLoop, inplace, result, not, isXML) {
        var name = match[1] = match[1].replace(rBackslash, "");
        if (!isXML && Expr.attrMap[name]) {
          match[1] = Expr.attrMap[name];
        }
        match[4] = (match[4] || match[5] || "").replace(rBackslash, "");
        if (match[2] === "~=") {
          /** @type {string} */
          match[4] = " " + match[4] + " ";
        }
        return match;
      },
      PSEUDO : function(match, curLoop, inplace, result, not) {
        if (match[1] === "not") {
          if ((RE_PART.exec(match[3]) || "").length > 1 || /^\w/.test(match[3])) {
            match[3] = Sizzle(match[3], null, null, curLoop);
          } else {
            var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
            if (!inplace) {
              result.push.apply(result, ret);
            }
            return false;
          }
        } else {
          if (Expr.match.POS.test(match[0]) || Expr.match.CHILD.test(match[0])) {
            return true;
          }
        }
        return match;
      },
      POS : function(match) {
        match.unshift(true);
        return match;
      }
    },
    filters : {
      enabled : function(elem) {
        return elem.disabled === false && elem.type !== "hidden";
      },
      disabled : function(elem) {
        return elem.disabled === true;
      },
      checked : function(id) {
        return id.checked === true;
      },
      selected : function(elem) {
        if (elem.parentNode) {
          elem.parentNode.selectedIndex;
        }
        return elem.selected === true;
      },
      parent : function(elem) {
        return !!elem.firstChild;
      },
      empty : function(elem) {
        return !elem.firstChild;
      },
      has : function(elem, i, match) {
        return !!Sizzle(match[3], elem).length;
      },
      header : function(elem) {
        return /h\d/i.test(elem.nodeName);
      },
      text : function(elem) {
        var attr = elem.getAttribute("type");
        var type = elem.type;
        return elem.nodeName.toLowerCase() === "input" && "text" === type && (attr === type || attr === null);
      },
      radio : function(elem) {
        return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
      },
      checkbox : function(elem) {
        return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
      },
      file : function(elem) {
        return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
      },
      password : function(id) {
        return id.nodeName.toLowerCase() === "input" && "password" === id.type;
      },
      submit : function(elem) {
        var name = elem.nodeName.toLowerCase();
        return (name === "input" || name === "button") && "submit" === elem.type;
      },
      image : function(elem) {
        return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
      },
      reset : function(elem) {
        var name = elem.nodeName.toLowerCase();
        return (name === "input" || name === "button") && "reset" === elem.type;
      },
      button : function(elem) {
        var name = elem.nodeName.toLowerCase();
        return name === "input" && "button" === elem.type || name === "button";
      },
      input : function(elem) {
        return /input|select|textarea|button/i.test(elem.nodeName);
      },
      focus : function(elem) {
        return elem === elem.ownerDocument.activeElement;
      }
    },
    setFilters : {
      first : function(stopSlideShow, myAn) {
        return myAn === 0;
      },
      last : function(t, name, a, i) {
        return name === i.length - 1;
      },
      even : function(i, elem) {
        return elem % 2 === 0;
      },
      odd : function(i, elem) {
        return elem % 2 === 1;
      },
      lt : function(elem, match, i) {
        return match < i[3] - 0;
      },
      gt : function(elem, match, i) {
        return match > i[3] - 0;
      },
      nth : function(elem, cur, dir) {
        return dir[3] - 0 === cur;
      },
      eq : function(elem, match, i) {
        return i[3] - 0 === match;
      }
    },
    filter : {
      PSEUDO : function(elem, match, array, curLoop) {
        var name = match[1];
        var filter = Expr.filters[name];
        if (filter) {
          return filter(elem, array, match, curLoop);
        } else {
          if (name === "contains") {
            return (elem.textContent || elem.innerText || getText([elem]) || "").indexOf(match[3]) >= 0;
          } else {
            if (name === "not") {
              var not = match[3];
              /** @type {number} */
              var i = 0;
              var l = not.length;
              for (; i < l; i++) {
                if (not[i] === elem) {
                  return false;
                }
              }
              return true;
            } else {
              Sizzle.error(name);
            }
          }
        }
      },
      CHILD : function(elem, match) {
        var first;
        var last;
        var doneName;
        var parent;
        var e;
        var count;
        var diff;
        var type = match[1];
        /** @type {!Object} */
        var node = elem;
        switch(type) {
          case "only":
          case "first":
            for (; node = node.previousSibling;) {
              if (node.nodeType === 1) {
                return false;
              }
            }
            if (type === "first") {
              return true;
            }
            /** @type {!Object} */
            node = elem;
          case "last":
            for (; node = node.nextSibling;) {
              if (node.nodeType === 1) {
                return false;
              }
            }
            return true;
          case "nth":
            first = match[2];
            last = match[3];
            if (first === 1 && last === 0) {
              return true;
            }
            doneName = match[0];
            parent = elem.parentNode;
            if (parent && (parent[expando] !== doneName || !elem.nodeIndex)) {
              /** @type {number} */
              count = 0;
              node = parent.firstChild;
              for (; node; node = node.nextSibling) {
                if (node.nodeType === 1) {
                  /** @type {number} */
                  node.nodeIndex = ++count;
                }
              }
              parent[expando] = doneName;
            }
            /** @type {number} */
            diff = elem.nodeIndex - last;
            if (first === 0) {
              return diff === 0;
            } else {
              return diff % first === 0 && diff / first >= 0;
            }
        }
      },
      ID : function(elem, match) {
        return elem.nodeType === 1 && elem.getAttribute("id") === match;
      },
      TAG : function(elem, match) {
        return match === "*" && elem.nodeType === 1 || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
      },
      CLASS : function(elem, match) {
        return (" " + (elem.className || elem.getAttribute("class")) + " ").indexOf(match) > -1;
      },
      ATTR : function(elem, match) {
        var name = match[1];
        var result = Sizzle.attr ? Sizzle.attr(elem, name) : Expr.attrHandle[name] ? Expr.attrHandle[name](elem) : elem[name] != null ? elem[name] : elem.getAttribute(name);
        /** @type {string} */
        var value = result + "";
        var type = match[2];
        var check = match[4];
        return result == null ? type === "!=" : !type && Sizzle.attr ? result != null : type === "=" ? value === check : type === "*=" ? value.indexOf(check) >= 0 : type === "~=" ? (" " + value + " ").indexOf(check) >= 0 : !check ? value && result !== false : type === "!=" ? value !== check : type === "^=" ? value.indexOf(check) === 0 : type === "$=" ? value.substr(value.length - check.length) === check : type === "|=" ? value === check || value.substr(0, check.length + 1) === check + "-" : false;
      },
      POS : function(elem, match, i, array) {
        var name = match[2];
        var filter = Expr.setFilters[name];
        if (filter) {
          return filter(elem, i, match, array);
        }
      }
    }
  };
  /** @type {!RegExp} */
  var origPOS = Expr.match.POS;
  /**
   * @param {?} all
   * @param {number} num
   * @return {?}
   */
  var fescape = function(all, num) {
    return "\\" + (num - 0 + 1);
  };
  var type;
  for (type in Expr.match) {
    /** @type {!RegExp} */
    Expr.match[type] = new RegExp(Expr.match[type].source + /(?![^\[]*\])(?![^\(]*\))/.source);
    /** @type {!RegExp} */
    Expr.leftMatch[type] = new RegExp(/(^(?:.|\r|\n)*?)/.source + Expr.match[type].source.replace(/\\(\d+)/g, fescape));
  }
  /** @type {!RegExp} */
  Expr.match.globalPOS = origPOS;
  /**
   * @param {!Object} array
   * @param {!Object} results
   * @return {?}
   */
  var makeArray = function(array, results) {
    /** @type {!Array<?>} */
    array = Array.prototype.slice.call(array, 0);
    if (results) {
      results.push.apply(results, array);
      return results;
    }
    return array;
  };
  try {
    Array.prototype.slice.call(document.documentElement.childNodes, 0)[0].nodeType;
  } catch (v) {
    /**
     * @param {!Object} obj
     * @param {!Object} results
     * @return {?}
     */
    makeArray = function(obj, results) {
      /** @type {number} */
      var i = 0;
      var ret = results || [];
      if (toString.call(obj) === "[object Array]") {
        Array.prototype.push.apply(ret, obj);
      } else {
        if (typeof obj.length === "number") {
          /** @type {number} */
          var e = obj.length;
          for (; i < e; i++) {
            ret.push(obj[i]);
          }
        } else {
          for (; obj[i]; i++) {
            ret.push(obj[i]);
          }
        }
      }
      return ret;
    };
  }
  var sortOrder;
  var siblingCheck;
  if (document.documentElement.compareDocumentPosition) {
    /**
     * @param {!Node} a
     * @param {!Node} b
     * @return {?}
     */
    sortOrder = function(a, b) {
      if (a === b) {
        /** @type {boolean} */
        h = true;
        return 0;
      }
      if (!a.compareDocumentPosition || !b.compareDocumentPosition) {
        return a.compareDocumentPosition ? -1 : 1;
      }
      return a.compareDocumentPosition(b) & 4 ? -1 : 1;
    };
  } else {
    /**
     * @param {!Node} a
     * @param {!Node} b
     * @return {?}
     */
    sortOrder = function(a, b) {
      if (a === b) {
        /** @type {boolean} */
        h = true;
        return 0;
      } else {
        if (a.sourceIndex && b.sourceIndex) {
          return a.sourceIndex - b.sourceIndex;
        }
      }
      var al;
      var bl;
      /** @type {!Array} */
      var ap = [];
      /** @type {!Array} */
      var bp = [];
      var n = a.parentNode;
      var parent = b.parentNode;
      var cur = n;
      if (n === parent) {
        return siblingCheck(a, b);
      } else {
        if (!n) {
          return -1;
        } else {
          if (!parent) {
            return 1;
          }
        }
      }
      for (; cur;) {
        ap.unshift(cur);
        cur = cur.parentNode;
      }
      cur = parent;
      for (; cur;) {
        bp.unshift(cur);
        cur = cur.parentNode;
      }
      /** @type {number} */
      al = ap.length;
      /** @type {number} */
      bl = bp.length;
      /** @type {number} */
      var i = 0;
      for (; i < al && i < bl; i++) {
        if (ap[i] !== bp[i]) {
          return siblingCheck(ap[i], bp[i]);
        }
      }
      return i === al ? siblingCheck(a, bp[i], -1) : siblingCheck(ap[i], b, 1);
    };
    /**
     * @param {!Node} b
     * @param {!Node} a
     * @param {number} ret
     * @return {?}
     */
    siblingCheck = function(b, a, ret) {
      if (b === a) {
        return ret;
      }
      var n = b.nextSibling;
      for (; n;) {
        if (n === a) {
          return -1;
        }
        n = n.nextSibling;
      }
      return 1;
    };
  }
  (function() {
    /** @type {!Element} */
    var f = document.createElement("div");
    /** @type {string} */
    var id = "script" + (new Date).getTime();
    /** @type {!Element} */
    var e = document.documentElement;
    /** @type {string} */
    f.innerHTML = "<a name='" + id + "'/>";
    e.insertBefore(f, e.firstChild);
    if (document.getElementById(id)) {
      /**
       * @param {!Object} match
       * @param {!Document} context
       * @param {?} isXML
       * @return {?}
       */
      Expr.find.ID = function(match, context, isXML) {
        if (typeof context.getElementById !== "undefined" && !isXML) {
          var m = context.getElementById(match[1]);
          return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
        }
      };
      /**
       * @param {!Node} elem
       * @param {?} match
       * @return {?}
       */
      Expr.filter.ID = function(elem, match) {
        var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
        return elem.nodeType === 1 && node && node.nodeValue === match;
      };
    }
    e.removeChild(f);
    /** @type {null} */
    e = f = null;
  })();
  (function() {
    /** @type {!Element} */
    var div = document.createElement("div");
    div.appendChild(document.createComment(""));
    if (div.getElementsByTagName("*").length > 0) {
      /**
       * @param {!Object} match
       * @param {!Node} context
       * @return {?}
       */
      Expr.find.TAG = function(match, context) {
        var results = context.getElementsByTagName(match[1]);
        if (match[1] === "*") {
          /** @type {!Array} */
          var tmpResults = [];
          /** @type {number} */
          var i = 0;
          for (; results[i]; i++) {
            if (results[i].nodeType === 1) {
              tmpResults.push(results[i]);
            }
          }
          /** @type {!Array} */
          results = tmpResults;
        }
        return results;
      };
    }
    /** @type {string} */
    div.innerHTML = "<a href='#'></a>";
    if (div.firstChild && typeof div.firstChild.getAttribute !== "undefined" && div.firstChild.getAttribute("href") !== "#") {
      /**
       * @param {!Node} elem
       * @return {?}
       */
      Expr.attrHandle.href = function(elem) {
        return elem.getAttribute("href", 2);
      };
    }
    /** @type {null} */
    div = null;
  })();
  if (document.querySelectorAll) {
    (function() {
      /** @type {function(string, !Object, !Object, !Object): ?} */
      var oldSizzle = Sizzle;
      /** @type {!Element} */
      var ehDownloadSettingPanel = document.createElement("div");
      /** @type {string} */
      var id = "__sizzle__";
      /** @type {string} */
      ehDownloadSettingPanel.innerHTML = "<p class='TEST'></p>";
      if (ehDownloadSettingPanel.querySelectorAll && ehDownloadSettingPanel.querySelectorAll(".TEST").length === 0) {
        return;
      }
      /**
       * @param {string} query
       * @param {!Object} context
       * @param {!Object} extra
       * @param {!Object} seed
       * @return {?}
       */
      Sizzle = function(query, context, extra, seed) {
        context = context || document;
        if (!seed && !Sizzle.isXML(context)) {
          /** @type {(Array<string>|null)} */
          var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(query);
          if (match && (context.nodeType === 1 || context.nodeType === 9)) {
            if (match[1]) {
              return makeArray(context.getElementsByTagName(query), extra);
            } else {
              if (match[2] && Expr.find.CLASS && context.getElementsByClassName) {
                return makeArray(context.getElementsByClassName(match[2]), extra);
              }
            }
          }
          if (context.nodeType === 9) {
            if (query === "body" && context.body) {
              return makeArray([context.body], extra);
            } else {
              if (match && match[3]) {
                var elem = context.getElementById(match[3]);
                if (elem && elem.parentNode) {
                  if (elem.id === match[3]) {
                    return makeArray([elem], extra);
                  }
                } else {
                  return makeArray([], extra);
                }
              }
            }
            try {
              return makeArray(context.querySelectorAll(query), extra);
            } catch (I) {
            }
          } else {
            if (context.nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
              /** @type {!Object} */
              var oldContext = context;
              var old = context.getAttribute("id");
              var nid = old || id;
              var frozen = context.parentNode;
              /** @type {boolean} */
              var highlightedLinedUpMarey = /^\s*[+~]/.test(query);
              if (!old) {
                context.setAttribute("id", nid);
              } else {
                nid = nid.replace(/'/g, "\\$&");
              }
              if (highlightedLinedUpMarey && frozen) {
                context = context.parentNode;
              }
              try {
                if (!highlightedLinedUpMarey || frozen) {
                  return makeArray(context.querySelectorAll("[id='" + nid + "'] " + query), extra);
                }
              } catch (J) {
              } finally {
                if (!old) {
                  oldContext.removeAttribute("id");
                }
              }
            }
          }
        }
        return oldSizzle(query, context, extra, seed);
      };
      var prop;
      for (prop in oldSizzle) {
        Sizzle[prop] = oldSizzle[prop];
      }
      /** @type {null} */
      ehDownloadSettingPanel = null;
    })();
  }
  (function() {
    /** @type {!Element} */
    var docElem = document.documentElement;
    /** @type {function(this:Element, string, (Node|NodeList<?>|null)=): boolean} */
    var matches = docElem.matchesSelector || docElem.mozMatchesSelector || docElem.webkitMatchesSelector || docElem.msMatchesSelector;
    if (matches) {
      /** @type {boolean} */
      var disconnectedMatch = !matches.call(document.createElement("div"), "div");
      /** @type {boolean} */
      var z = false;
      try {
        matches.call(document.documentElement, "[test!='']:sizzle");
      } catch (B) {
        /** @type {boolean} */
        z = true;
      }
      /**
       * @param {!Window} node
       * @param {string} expr
       * @return {?}
       */
      Sizzle.matchesSelector = function(node, expr) {
        expr = expr.replace(/=\s*([^'"\]]*)\s*\]/g, "='$1']");
        if (!Sizzle.isXML(node)) {
          try {
            if (z || !Expr.match.PSEUDO.test(expr) && !/!=/.test(expr)) {
              /** @type {boolean} */
              var ret = matches.call(node, expr);
              if (ret || !disconnectedMatch || node.document && node.document.nodeType !== 11) {
                return ret;
              }
            }
          } catch (F) {
          }
        }
        return Sizzle(expr, null, null, [node]).length > 0;
      };
    }
  })();
  (function() {
    /** @type {!Element} */
    var e = document.createElement("div");
    /** @type {string} */
    e.innerHTML = "<div class='test e'></div><div class='test'></div>";
    if (!e.getElementsByClassName || e.getElementsByClassName("e").length === 0) {
      return;
    }
    /** @type {string} */
    e.lastChild.className = "e";
    if (e.getElementsByClassName("e").length === 1) {
      return;
    }
    Expr.order.splice(1, 0, "CLASS");
    /**
     * @param {string} match
     * @param {!HTMLElement} context
     * @param {?} isXML
     * @return {?}
     */
    Expr.find.CLASS = function(match, context, isXML) {
      if (typeof context.getElementsByClassName !== "undefined" && !isXML) {
        return context.getElementsByClassName(match[1]);
      }
    };
    /** @type {null} */
    e = null;
  })();
  if (document.documentElement.contains) {
    /**
     * @param {!Object} a
     * @param {!Object} b
     * @return {?}
     */
    Sizzle.contains = function(a, b) {
      return a !== b && (a.contains ? a.contains(b) : true);
    };
  } else {
    if (document.documentElement.compareDocumentPosition) {
      /**
       * @param {!Object} a
       * @param {?} b
       * @return {?}
       */
      Sizzle.contains = function(a, b) {
        return !!(a.compareDocumentPosition(b) & 16);
      };
    } else {
      /**
       * @return {?}
       */
      Sizzle.contains = function() {
        return false;
      };
    }
  }
  /**
   * @param {!Object} elem
   * @return {?}
   */
  Sizzle.isXML = function(elem) {
    var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;
    return documentElement ? documentElement.nodeName !== "HTML" : false;
  };
  /**
   * @param {string} selector
   * @param {!Object} context
   * @param {!Object} seed
   * @return {?}
   */
  var posProcess = function(selector, context, seed) {
    var match;
    /** @type {!Array} */
    var tmpSet = [];
    /** @type {string} */
    var later = "";
    var root = context.nodeType ? [context] : context;
    for (; match = Expr.match.PSEUDO.exec(selector);) {
      /** @type {string} */
      later = later + match[0];
      selector = selector.replace(Expr.match.PSEUDO, "");
    }
    selector = Expr.relative[selector] ? selector + "*" : selector;
    /** @type {number} */
    var i = 0;
    var l = root.length;
    for (; i < l; i++) {
      Sizzle(selector, root[i], tmpSet, seed);
    }
    return Sizzle.filter(later, tmpSet);
  };
  /** @type {function(string, !Object, !Object, !Object): ?} */
  window.Sizzle = Sizzle;
})();
vim.dom = function() {
  /**
   * @param {!Object} item
   * @param {string} i
   * @return {?}
   */
  function has(item, i) {
    /** @type {!RegExp} */
    var clsRx = new RegExp("(^|\\s)" + i + "(\\s|$)");
    if (typeof item === "string") {
      item = $(item)[0];
    }
    return clsRx.test(item.className);
  }
  /**
   * @param {!Object} el
   * @param {string} name
   * @return {undefined}
   */
  function addClass(el, name) {
    if (typeof el === "string") {
      el = $(el)[0];
    }
    if (!has(el, name)) {
      el.className += " " + name;
    }
  }
  /**
   * @param {!Object} value
   * @param {string} name
   * @return {undefined}
   */
  function removeClass(value, name) {
    /** @type {!RegExp} */
    var re = new RegExp("(^|\\s)" + name + "(\\s|$)");
    if (typeof value === "string") {
      value = $(value)[0];
    }
    value.className = value.className.replace(re, " ");
  }
  /**
   * @param {!Object} el
   * @param {string} type
   * @param {!Function} callback
   * @return {undefined}
   */
  function bind(el, type, callback) {
    if (typeof el === "string") {
      el = $(el)[0];
    }
    if (el.addEventListener) {
      el.addEventListener(type, callback, false);
    } else {
      if (el.attachEvent) {
        el.attachEvent("on" + type, callback);
      }
    }
  }
  /**
   * @param {!Object} obj
   * @param {string} type
   * @param {!Function} callback
   * @return {undefined}
   */
  function unbind(obj, type, callback) {
    if (typeof obj === "string") {
      obj = $(obj)[0];
    }
    if (obj.removeEventListener) {
      obj.removeEventListener(type, callback, false);
    } else {
      if (obj.detachEvent) {
        obj.detachEvent("on" + type, callback);
      }
    }
  }
  var $ = Sizzle;
  return {
    $ : $,
    hasClass : has,
    addClass : addClass,
    removeClass : removeClass,
    bind : bind,
    unbind : unbind
  };
}();
vim.audio = function() {
  /**
   * @return {undefined}
   */
  function init1() {
    /** @type {boolean} */
    source = true;
    schemas = {};
    /** @type {number} */
    volume = 50;
  }
  /**
   * @param {string} name
   * @return {?}
   */
  function load(name) {
    if (!source) {
      return;
    }
    /** @type {!Element} */
    var audio = document.createElement("audio");
    if (audio.canPlayType("audio/mpeg") || audio.canPlayType("audio/mp3")) {
      audio.setAttribute("src", "sounds/" + name + ".mp3");
    } else {
      if (audio.canPlayType("audio/ogg")) {
        audio.setAttribute("src", "sounds/" + name + ".ogg");
      }
    }
    /** @type {!Element} */
    schemas[name] = audio;
    return audio;
  }
  /**
   * @param {string} type
   * @return {?}
   */
  function createNode(type) {
    return !source ? undefined : schemas[type] ? schemas[type] : load(type);
  }
  /**
   * @param {string} name
   * @param {boolean} c
   * @return {undefined}
   */
  function start(name, c) {
    var s = vim.view;
    if (!source) {
      return;
    }
    if (c === true && s && s.isFadeIn()) {
      s.scheduleSoundAfterFadeIn(name);
      return;
    }
    var player = createNode(name);
    if (!player) {
      console.log("Can't find " + name);
      return;
    }
    /** @type {number} */
    player.volume = volume / 100;
    if (player.paused) {
      player.play();
    }
  }
  /**
   * @return {?}
   */
  function getVolume() {
    return volume;
  }
  /**
   * @param {number} v
   * @return {undefined}
   */
  function swfSetVolume(v) {
    /** @type {number} */
    volume = v;
  }
  var schemas;
  /** @type {boolean} */
  var source = false;
  var volume;
  return {
    initialize : init1,
    play : start,
    getVolume : getVolume,
    setVolume : swfSetVolume
  };
}();
vim.game = function() {
  /**
   * @param {string} index
   * @return {undefined}
   */
  function init(index) {
    var info = $("#game .screen.active")[0];
    var d = $("#" + index)[0];
    if (info) {
      root.removeClass(info, "active");
      if (vim.screens[info.id] && vim.screens[info.id].done) {
        vim.screens[info.id].done();
      }
    }
    root.addClass(d, "active");
    if (vim.screens[index] && vim.screens[index].run) {
      vim.screens[index].run();
    }
  }
  var root = vim.dom;
  var $ = root.$;
  return {
    showScreen : init
  };
}();
vim.screens["splash-screen"] = function() {
  /**
   * @return {undefined}
   */
  function createUI() {
    /**
     * @return {undefined}
     */
    function updateUI() {
      /** @type {number} */
      var text_canvas_dimensions = vim.loader.getProgress() * 100;
      /** @type {string} */
      $(".indicator", host)[0].style.width = text_canvas_dimensions + "%";
      if (text_canvas_dimensions !== 100) {
        window.setTimeout(updateUI, 300);
      }
    }
    var host = $("#splash-screen")[0];
    updateUI();
  }
  /**
   * @return {undefined}
   */
  function installTaskRun() {
    if (e) {
      createUI();
      /** @type {boolean} */
      e = false;
    }
  }
  /**
   * @return {undefined}
   */
  function keepToken() {
  }
  var file = vim.dom;
  var $ = file.$;
  /** @type {boolean} */
  var e = true;
  return {
    run : installTaskRun,
    done : keepToken
  };
}();
vim.images = function() {
  /**
   * @param {?} queueName
   * @return {?}
   */
  function exists(queueName) {
    return typeof options[queueName] !== "undefined";
  }
  /**
   * @param {!CanvasRenderingContext2D} ctx
   * @param {?} value
   * @return {undefined}
   */
  function loop(ctx, value) {
    /** @type {string} */
    var parBgColor = useWhite ? "#313726" : "#a36d36";
    /** @type {string} */
    var oGradient = useWhite ? "3f5d57" : "#d2ba7c";
    /** @type {string} */
    var linGrad = useWhite ? "34454c" : "#ae894c";
    /** @type {string} */
    var signalColor = useWhite ? "0646a7" : "#158cef";
    /** @type {string} */
    var pointShadowColor = useWhite ? "447eb3" : "#e2fbff";
    /** @type {string} */
    var averageRGBA = useWhite ? "4761b3" : "#5bc2ff";
    /** @type {number} */
    var noteOffsetLeft = 0;
    /** @type {number} */
    var y = 5;
    /** @type {number} */
    var height = 50;
    /** @type {number} */
    var bar_width = 25;
    /** @type {number} */
    var h = 25;
    /** @type {number} */
    var textsize = 18;
    /** @type {string} */
    var color = useWhite ? "#fff" : "#fff";
    /** @type {string} */
    var textColor = useWhite ? "#000" : "#000";
    var chrHeight;
    var textYOffset;
    var S;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    /** @type {string} */
    ctx.fillStyle = parBgColor;
    ctx.fillRect(noteOffsetLeft, y, 4, height);
    /** @type {string} */
    ctx.fillStyle = oGradient;
    ctx.fillRect(noteOffsetLeft + 1, y + 1, 1, height - 2);
    /** @type {string} */
    ctx.fillStyle = linGrad;
    ctx.fillRect(noteOffsetLeft + 2, y + 1, 1, height - 2);
    /** @type {string} */
    ctx.fillStyle = signalColor;
    ctx.fillRect(noteOffsetLeft + 3, y + 3, bar_width, h);
    /** @type {string} */
    ctx.fillStyle = averageRGBA;
    ctx.fillRect(noteOffsetLeft + 4, y + 4, bar_width - 2, h - 2);
    /** @type {string} */
    ctx.fillStyle = pointShadowColor;
    ctx.fillRect(noteOffsetLeft + 4, y + 4, bar_width - 2, 1);
    /** @type {string} */
    ctx.font = textsize + "px Curier New";
    chrHeight = ctx.measureText(value).width;
    /** @type {string} */
    ctx.fillStyle = textColor;
    /** @type {number} */
    textYOffset = 0;
    for (; textYOffset < 3; ++textYOffset) {
      /** @type {number} */
      S = 0;
      for (; S < 3; ++S) {
        ctx.fillText(value, noteOffsetLeft + 15 + S - Math.round(chrHeight / 2), y + 21 + textYOffset);
      }
    }
    /** @type {string} */
    ctx.fillStyle = color;
    ctx.fillText(value, noteOffsetLeft + 16 - Math.round(chrHeight / 2), y + 22);
  }
  /**
   * @return {undefined}
   */
  function init() {
    var i;
    var H;
    var img_data;
    if (!target && !img && self.complete && element.complete && !srcCanvas && image.complete) {
      /** @type {!Element} */
      target = document.createElement("canvas");
      target.width = self.width;
      target.height = self.height;
      target.getContext("2d").drawImage(self, 0, 0);
      /** @type {!Element} */
      img = document.createElement("canvas");
      img.width = element.width;
      img.height = element.height;
      img.getContext("2d").drawImage(element, 0, 0);
      /** @type {!Element} */
      srcCanvas = document.createElement("canvas");
      srcCanvas.width = image.width;
      srcCanvas.height = image.height;
      srcCanvas.getContext("2d").drawImage(image, 0, 0);
      img_data = target.getContext("2d").getImageData(0, 0, self.width, self.height);
      /** @type {number} */
      i = 0;
      for (; i < img_data.data.length; i = i + 4) {
        /** @type {number} */
        H = Math.floor(img_data.data[i] * 0.3 + img_data.data[i + 1] * 0.59 + img_data.data[i + 2] * 0.11);
        /** @type {number} */
        img_data.data[i] = img_data.data[i + 1] = img_data.data[i + 2] = H;
      }
      /** @type {!Element} */
      source = document.createElement("canvas");
      source.width = self.width;
      source.height = self.height;
      source.getContext("2d").putImageData(img_data, 0, 0);
      img_data = target.getContext("2d").getImageData(0, 0, self.width, self.height);
      /** @type {number} */
      i = 0;
      for (; i < img_data.data.length; i = i + 4) {
        /** @type {number} */
        img_data.data[i] = Math.floor(img_data.data[i] * 0.4);
        /** @type {number} */
        img_data.data[i + 1] = Math.floor(img_data.data[i + 1] * 0.6);
        /** @type {number} */
        img_data.data[i + 2] = Math.floor(img_data.data[i + 2] * 0.8);
      }
      /** @type {!Element} */
      viewCanvas = document.createElement("canvas");
      viewCanvas.width = self.width;
      viewCanvas.height = self.height;
      viewCanvas.getContext("2d").putImageData(img_data, 0, 0);
      /** @type {!Element} */
      canvas = document.createElement("canvas");
      /** @type {number} */
      canvas.width = 50;
      /** @type {number} */
      canvas.height = 60;
      options.selector_on = options.selector;
    }
  }
  /**
   * @param {string} type
   * @param {string} a
   * @return {?}
   */
  function format(type, a) {
    var url = target;
    if (typeof type === "undefined") {
      url = !sourceIsObject ? !useWhite ? target : viewCanvas : source;
    } else {
      if (type === "clouds") {
        url = img;
      } else {
        if (type === "explosion") {
          url = image;
        }
      }
    }
    if (a === "selector" || a === "selector_on" || a === "star_key") {
      url = target;
    }
    return url;
  }
  /**
   * @param {string} value
   * @return {?}
   */
  function callback(value) {
    if (typeof value === "undefined") {
      return target && self.complete;
    } else {
      if (value === "clouds") {
        return img && element.complete;
      } else {
        if (value === "explosion") {
          return image && image.complete;
        }
      }
    }
    return false;
  }
  /**
   * @param {!CanvasRenderingContext2D} ctx
   * @param {string} idx
   * @param {number} dx
   * @param {number} dy
   * @param {number} destwidth
   * @param {number} destheight
   * @return {undefined}
   */
  function drawImage(ctx, idx, dx, dy, destwidth, destheight) {
    if (typeof options[idx] !== "undefined") {
      init();
      if (callback(options[idx].img)) {
        ctx.drawImage(format(options[idx].img, idx), options[idx].x, options[idx].y, options[idx].w, options[idx].h, dx, dy, destwidth, destheight);
      }
    }
  }
  /**
   * @param {!CanvasRenderingContext2D} context
   * @param {string} i
   * @param {number} x
   * @param {number} y
   * @param {?} scale
   * @param {?} resolution
   * @return {undefined}
   */
  function $fz(context, i, x, y, scale, resolution) {
    if (typeof options[i] !== "undefined") {
      init();
      if (callback(options[i].img)) {
        context.drawImage(format(options[i].img, i), options[i].x, options[i].y, options[i].w, options[i].h, x, y, options[i].w * scale, options[i].h * resolution);
      }
    }
  }
  /**
   * @param {!CanvasRenderingContext2D} context
   * @param {string} name
   * @param {number} x
   * @param {number} i
   * @param {string} max
   * @return {undefined}
   */
  function func(context, name, x, i, max) {
    var size;
    var data = options[name];
    var image;
    if (typeof data === "undefined") {
      return;
    }
    image = data.cachedCanvas;
    if (!image) {
      init();
      if (callback(data.img)) {
        /** @type {!Element} */
        image = document.createElement("canvas");
        image.width = data.w;
        image.height = data.h;
        image.getContext("2d").drawImage(format(data.img, name), data.x, data.y, data.w, data.h, 0, 0, data.w, data.h);
        /** @type {!Element} */
        data.cachedCanvas = image;
      }
    }
    if (image) {
      if (typeof max === "undefined") {
        context.drawImage(image, x, i);
      } else {
        size = data.h;
        if (max !== undefined && i + size > max) {
          /** @type {number} */
          size = Math.max(0, max - i);
        }
        if (size > 0) {
          context.drawImage(image, 0, 0, data.w, size, x | 0, i | 0, data.w, size);
        }
      }
    }
  }
  /**
   * @param {!CanvasRenderingContext2D} ctx
   * @param {string} type
   * @param {number} x
   * @param {number} offset
   * @param {number} n
   * @param {number} s
   * @param {number} i
   * @param {number} value
   * @param {number} width
   * @param {number} height
   * @return {undefined}
   */
  function add(ctx, type, x, offset, n, s, i, value, width, height) {
    if (typeof options[type] !== "undefined") {
      init();
      if (callback(options[type].img)) {
        ctx.drawImage(format(options[type].img, type), options[type].x + x, options[type].y + offset, n, s, i, value, width, height);
      }
    }
  }
  /**
   * @return {undefined}
   */
  function box() {
    var name;
    for (name in options) {
      if (options.hasOwnProperty(name)) {
        delete options[name].cachedCanvas;
      }
    }
  }
  /**
   * @return {undefined}
   */
  function action() {
    /** @type {boolean} */
    sourceIsObject = true;
    /** @type {boolean} */
    useWhite = false;
    box();
  }
  /**
   * @return {undefined}
   */
  function height() {
    /** @type {boolean} */
    useWhite = true;
    box();
  }
  /**
   * @return {undefined}
   */
  function o() {
    /** @type {boolean} */
    sourceIsObject = false;
    /** @type {boolean} */
    useWhite = false;
    box();
  }
  /**
   * @param {!CanvasRenderingContext2D} ctx
   * @param {number} width
   * @param {number} i
   * @param {?} fn
   * @return {undefined}
   */
  function draw(ctx, width, i, fn) {
    /** @type {number} */
    var rem = 6;
    /** @type {number} */
    var rmin = 3;
    /** @type {number} */
    var cacheTime = 150;
    /** @type {number} */
    var granYSin = 25;
    /** @type {number} */
    var sin = -0.1;
    /** @type {number} */
    var w = 25;
    /** @type {number} */
    var h = 35;
    var cvx;
    var params;
    var data;
    var config;
    var a;
    var y;
    var cropHeight;
    var px;
    var dy;
    var x;
    var prop;
    var ratio;
    var height;
    var l;
    var p;
    if (typeof canvas === "undefined") {
      init();
    }
    cvx = canvas.getContext("2d");
    loop(cvx, fn);
    params = cvx.getImageData(3, 5, w, h).data;
    data = cvx.getImageData(0, 0, w, h);
    config = data.data;
    /** @type {number} */
    a = new Date / cacheTime;
    /** @type {number} */
    y = 0;
    for (; y < h; ++y) {
      /** @type {number} */
      cropHeight = 0;
      /** @type {number} */
      px = 0;
      /** @type {number} */
      dy = (y - h / 2) * sin;
      /** @type {number} */
      x = 0;
      for (; x < w; ++x) {
        /** @type {number} */
        prop = (y * w + x) * 4;
        /** @type {number} */
        ratio = x / w;
        /** @type {number} */
        height = Math.sin(x / rem - a) * rmin * ratio;
        /** @type {number} */
        l = y + (height + dy * ratio) << 0;
        /** @type {number} */
        p = (l * w + x) * 4;
        /** @type {number} */
        px = (height - cropHeight) * granYSin;
        config[prop] = params[p] + px;
        config[prop + 1] = params[p + 1] + px;
        config[prop + 2] = params[p + 2] + px;
        config[prop + 3] = params[p + 3];
        /** @type {number} */
        cropHeight = height;
      }
    }
    cvx.putImageData(data, 3, 5);
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, width, i, canvas.width, canvas.height);
  }
  /**
   * @param {!CanvasRenderingContext2D} ctx
   * @param {number} height
   * @param {number} offsetY
   * @return {undefined}
   */
  function drawLine(ctx, height, offsetY) {
    /** @type {number} */
    var width = height;
    var y = offsetY + 5;
    /** @type {string} */
    var stokeStyle = useWhite ? "#f00" : "#f00";
    /** @type {string} */
    var centerLineColor = useWhite ? "#600" : "#600";
    /** @type {number} */
    var margin = 10;
    /** @type {number} */
    var x = 0;
    /** @type {number} */
    var h = 30;
    ctx.save();
    ctx.beginPath();
    /** @type {number} */
    ctx.lineWidth = 5;
    /** @type {string} */
    ctx.lineCap = "round";
    /** @type {string} */
    ctx.strokeStyle = centerLineColor;
    ctx.moveTo(width + x, y + h + margin);
    ctx.lineTo(width + x + margin, y + h);
    ctx.moveTo(width + x, y + h);
    ctx.lineTo(width + x + margin, y + h + margin);
    ctx.stroke();
    ctx.beginPath();
    /** @type {string} */
    ctx.strokeStyle = stokeStyle;
    ctx.moveTo(width + 1 + x, y + h + 1 + margin);
    ctx.lineTo(width + 1 + x + margin, y + 1 + h);
    ctx.moveTo(width + 1 + x, y + 1 + h);
    ctx.lineTo(width + 1 + x + margin, y + 1 + h + margin);
    ctx.stroke();
    ctx.restore();
  }
  /**
   * @param {!CanvasRenderingContext2D} ctx
   * @return {undefined}
   */
  function render(ctx) {
    var l = vim.model.getLevel();
    var r = data[l];
    var bounds = data[0];
    var canvas = render.canvas;
    var textCtx;
    var N;
    var Y;
    var startSize;
    var i;
    if (!l || !r) {
      return;
    }
    if (!canvas) {
      /** @type {!Element} */
      canvas = document.createElement("canvas");
      /** @type {number} */
      canvas.width = 620;
      /** @type {number} */
      canvas.height = 40;
      textCtx = canvas.getContext("2d");
      /** @type {string} */
      textCtx.font = "30px Arial";
      /** @type {number} */
      i = 0;
      for (; i <= 14; ++i) {
        /** @type {string} */
        textCtx.fillStyle = "#000";
        /** @type {number} */
        Y = -2;
        for (; Y < 3; Y = Y + 1) {
          /** @type {number} */
          startSize = -2;
          for (; startSize < 3; startSize = startSize + 1) {
            textCtx.fillText(data[i].str, data[i].x + startSize + 7, 30 + Y);
          }
        }
        /** @type {string} */
        textCtx.fillStyle = "#fff";
        textCtx.fillText(data[i].str, data[i].x + 7, 30);
      }
      /** @type {!Element} */
      render.canvas = canvas;
      r = data[l];
    }
    ctx.drawImage(canvas, bounds.x, 0, bounds.w, 40, 43, 20, bounds.w, 40);
    ctx.drawImage(canvas, r.x, 0, r.w, 40, 43 + bounds.w, 20, r.w, 40);
  }
  var self = vim.spritesImg;
  var element = vim.cloudsImg;
  var image = vim.explosionImg;
  var target;
  var source;
  var viewCanvas;
  var img;
  var srcCanvas;
  var canvas;
  /** @type {boolean} */
  var sourceIsObject = false;
  /** @type {boolean} */
  var useWhite = false;
  var options = {
    grass : {
      x : 0,
      y : 0,
      w : 37,
      h : 64
    },
    water : {
      x : 0,
      y : 67,
      w : 37,
      h : 64
    },
    stone : {
      x : 0,
      y : 134,
      w : 37,
      h : 64
    },
    plain : {
      x : 0,
      y : 201,
      w : 37,
      h : 64
    },
    cracked : {
      x : 0,
      y : 268,
      w : 37,
      h : 64
    },
    dark : {
      x : 0,
      y : 335,
      w : 37,
      h : 64
    },
    wood : {
      x : 0,
      y : 402,
      w : 37,
      h : 64
    },
    stone_tall : {
      x : 0,
      y : 469,
      w : 37,
      h : 64
    },
    dirt : {
      x : 0,
      y : 536,
      w : 37,
      h : 64
    },
    shadow_east : {
      x : 0,
      y : 603,
      w : 37,
      h : 64
    },
    shadow_west : {
      x : 0,
      y : 670,
      w : 37,
      h : 64
    },
    shadow_north : {
      x : 0,
      y : 737,
      w : 37,
      h : 64
    },
    shadow_south : {
      x : 40,
      y : 0,
      w : 37,
      h : 64
    },
    shadow_north_east : {
      x : 40,
      y : 67,
      w : 37,
      h : 64
    },
    shadow_north_west : {
      x : 40,
      y : 134,
      w : 37,
      h : 64
    },
    shadow_south_east : {
      x : 40,
      y : 201,
      w : 37,
      h : 64
    },
    shadow_south_west : {
      x : 40,
      y : 268,
      w : 37,
      h : 64
    },
    ramp_west : {
      x : 40,
      y : 335,
      w : 37,
      h : 64
    },
    ramp_east : {
      x : 40,
      y : 402,
      w : 37,
      h : 64
    },
    rock : {
      x : 40,
      y : 469,
      w : 37,
      h : 64
    },
    candle : {
      x : 40,
      y : 536,
      w : 37,
      h : 64
    },
    tall_tree : {
      x : 40,
      y : 603,
      w : 37,
      h : 64
    },
    short_tree : {
      x : 40,
      y : 670,
      w : 37,
      h : 64
    },
    ugly_tree : {
      x : 40,
      y : 737,
      w : 37,
      h : 64
    },
    kid : {
      x : 80,
      y : 0,
      w : 37,
      h : 64
    },
    pink_girl : {
      x : 80,
      y : 67,
      w : 37,
      h : 64
    },
    brown_girl : {
      x : 80,
      y : 134,
      w : 37,
      h : 64
    },
    princess : {
      x : 80,
      y : 201,
      w : 37,
      h : 64
    },
    closed_door : {
      x : 80,
      y : 268,
      w : 37,
      h : 64
    },
    blue_closed_door : {
      x : 80,
      y : 335,
      w : 37,
      h : 64
    },
    yellow_key : {
      x : 80,
      y : 402,
      w : 37,
      h : 64
    },
    blue_key : {
      x : 80,
      y : 469,
      w : 37,
      h : 64
    },
    small_brown_key : {
      x : 80,
      y : 536,
      w : 37,
      h : 64
    },
    keyboard_key : {
      x : 80,
      y : 603,
      w : 37,
      h : 64
    },
    closed_chest : {
      x : 80,
      y : 670,
      w : 37,
      h : 64
    },
    open_chest : {
      x : 80,
      y : 737,
      w : 37,
      h : 64
    },
    chest_lid : {
      x : 120,
      y : 0,
      w : 37,
      h : 64
    },
    cat_girl : {
      x : 120,
      y : 67,
      w : 37,
      h : 64
    },
    horn_girl : {
      x : 120,
      y : 134,
      w : 37,
      h : 64
    },
    north_east_roof : {
      x : 120,
      y : 201,
      w : 37,
      h : 64
    },
    north_west_roof : {
      x : 120,
      y : 268,
      w : 37,
      h : 64
    },
    north_roof : {
      x : 120,
      y : 335,
      w : 37,
      h : 64
    },
    south_east_roof : {
      x : 120,
      y : 402,
      w : 37,
      h : 64
    },
    south_west_roof : {
      x : 120,
      y : 469,
      w : 37,
      h : 64
    },
    south_roof : {
      x : 120,
      y : 536,
      w : 37,
      h : 64
    },
    east_roof : {
      x : 120,
      y : 603,
      w : 37,
      h : 64
    },
    west_roof : {
      x : 120,
      y : 670,
      w : 37,
      h : 64
    },
    lava : {
      x : 120,
      y : 737,
      w : 37,
      h : 64
    },
    sand : {
      x : 160,
      y : 0,
      w : 37,
      h : 64
    },
    cloud : {
      x : 160,
      y : 67,
      w : 37,
      h : 64
    },
    white : {
      x : 160,
      y : 134,
      w : 37,
      h : 64
    },
    red_key : {
      x : 160,
      y : 201,
      w : 37,
      h : 64
    },
    red_closed_door : {
      x : 160,
      y : 268,
      w : 37,
      h : 64
    },
    red_bug_right : {
      x : 160,
      y : 335,
      w : 37,
      h : 64
    },
    red_bug_left : {
      x : 160,
      y : 402,
      w : 37,
      h : 64
    },
    green_kid : {
      x : 160,
      y : 469,
      w : 37,
      h : 64
    },
    blond_kid : {
      x : 160,
      y : 536,
      w : 37,
      h : 64
    },
    star_key : {
      x : 160,
      y : 603,
      w : 37,
      h : 64
    },
    selector : {
      x : 160,
      y : 670,
      w : 37,
      h : 64
    },
    speech : {
      x : 200,
      y : 0,
      w : 101,
      h : 171
    },
    cursor_speech : {
      x : 200,
      y : 180,
      w : 101,
      h : 171
    },
    text_speech : {
      x : 200,
      y : 360,
      w : 101,
      h : 171
    },
    text_speech_line : {
      x : 200,
      y : 540,
      w : 101,
      h : 171
    },
    big_bug_right : {
      x : 320,
      y : 0,
      w : 180,
      h : 140
    },
    big_bug_left : {
      x : 320,
      y : 150,
      w : 180,
      h : 140
    },
    cloud1 : {
      x : 0,
      y : 0,
      w : 216,
      h : 86,
      img : "clouds"
    },
    cloud1b : {
      x : 226,
      y : 0,
      w : 216,
      h : 86,
      img : "clouds"
    },
    cloud4 : {
      x : 0,
      y : 96,
      w : 200,
      h : 143,
      img : "clouds"
    },
    cloud4b : {
      x : 210,
      y : 96,
      w : 200,
      h : 143,
      img : "clouds"
    },
    cloud2 : {
      x : 0,
      y : 249,
      w : 386,
      h : 207,
      img : "clouds"
    },
    cloud2b : {
      x : 0,
      y : 466,
      w : 386,
      h : 207,
      img : "clouds"
    },
    cloud3 : {
      x : 0,
      y : 683,
      w : 460,
      h : 204,
      img : "clouds"
    },
    cloud3b : {
      x : 0,
      y : 897,
      w : 460,
      h : 204,
      img : "clouds"
    },
    explosion1 : {
      x : 0,
      y : 0,
      w : 37,
      h : 64,
      img : "explosion"
    },
    explosion2 : {
      x : 0,
      y : 67,
      w : 37,
      h : 64,
      img : "explosion"
    },
    explosion3 : {
      x : 0,
      y : 134,
      w : 37,
      h : 64,
      img : "explosion"
    },
    explosion4 : {
      x : 0,
      y : 201,
      w : 37,
      h : 64,
      img : "explosion"
    },
    explosion5 : {
      x : 0,
      y : 268,
      w : 37,
      h : 64,
      img : "explosion"
    },
    explosion6 : {
      x : 0,
      y : 335,
      w : 37,
      h : 64,
      img : "explosion"
    },
    explosion7 : {
      x : 0,
      y : 402,
      w : 37,
      h : 64,
      img : "explosion"
    },
    explosion8 : {
      x : 0,
      y : 469,
      w : 37,
      h : 64,
      img : "explosion"
    },
    explosion9 : {
      x : 0,
      y : 536,
      w : 37,
      h : 64,
      img : "explosion"
    }
  };
  /** @type {!Array} */
  var data = [{
    str : "Level",
    x : 0,
    w : 90
  }, {
    str : "1",
    x : 90,
    w : 30
  }, {
    str : "2",
    x : 120,
    w : 30
  }, {
    str : "3",
    x : 150,
    w : 30
  }, {
    str : "4",
    x : 180,
    w : 30
  }, {
    str : "5",
    x : 210,
    w : 30
  }, {
    str : "6",
    x : 250,
    w : 30
  }, {
    str : "7",
    x : 280,
    w : 30
  }, {
    str : "8",
    x : 310,
    w : 30
  }, {
    str : "9",
    x : 340,
    w : 30
  }, {
    str : "10",
    x : 370,
    w : 50
  }, {
    str : "11",
    x : 420,
    w : 50
  }, {
    str : "12",
    x : 470,
    w : 50
  }, {
    str : "13",
    x : 520,
    w : 50
  }, {
    str : "14",
    x : 570,
    w : 50
  }];
  return {
    exists : exists,
    draw : func,
    drawScale : drawImage,
    drawMulScale : $fz,
    drawPartScale : add,
    drawFlag : draw,
    drawToBeRemovedSign : drawLine,
    drawLevelNumber : render,
    toGrayScale : action,
    toDark : height,
    toNormalColor : o,
    drawTest : function() {
      /** @type {(Element|null)} */
      var controller = document.getElementById("screen");
      var moe = controller.getContext("2d");
      /** @type {number} */
      var J = 100;
      /** @type {number} */
      var L = 10000;
      /** @type {number} */
      var start = 0;
      var j;
      var len;
      for (; J--;) {
        /** @type {number} */
        L = 10000;
        /** @type {number} */
        len = window.performance.now();
        for (; L--;) {
          func(moe, "water", 0, 0);
        }
        /** @type {number} */
        j = window.performance.now();
        /** @type {number} */
        start = start + (j - len);
      }
      return start / 100 | 0;
    }
  };
}();
vim.inventory = function() {
  /**
   * @return {undefined}
   */
  function LogMessage() {
    /** @type {number} */
    data.yellow = 0;
    /** @type {number} */
    data.small_brown = 0;
    /** @type {number} */
    data.blue = 0;
    /** @type {number} */
    data.red = 0;
    /** @type {number} */
    data.star = 0;
  }
  /**
   * @return {?}
   */
  function getDefaults() {
    return {
      yellowKeys : data.yellow,
      blueKeys : data.blue,
      redKeys : data.red,
      smallBrownKeys : data.small_brown,
      starKeys : data.star
    };
  }
  /**
   * @param {?} utc_offset
   * @return {undefined}
   */
  function format(utc_offset) {
    data.yellow = utc_offset.yellowKeys || 0;
    data.blue = utc_offset.blueKeys || 0;
    data.red = utc_offset.redKeys || 0;
    data.small_brown = utc_offset.smallBrownKeys || 0;
    data.star = utc_offset.starKeys || 0;
  }
  /**
   * @param {?} hash
   * @return {undefined}
   */
  function _normalizeSingle(hash) {
    data[hash] += 1;
  }
  /**
   * @param {string} state
   * @return {undefined}
   */
  function getSitePostsByTerm(state) {
    if (data[state] > 0) {
      data[state] -= 1;
    }
  }
  /**
   * @param {string} name
   * @return {?}
   */
  function hasKey(name) {
    return data[name] > 0;
  }
  /**
   * @param {?} connector
   * @return {?}
   */
  function getConnectorTestFilePath(connector) {
    return data[connector];
  }
  var data = {};
  return {
    init : LogMessage,
    addKey : _normalizeSingle,
    useKey : getSitePostsByTerm,
    hasKey : hasKey,
    getNumberOfKeys : getConnectorTestFilePath,
    getData : getDefaults,
    restore : format
  };
}();
vim.validKeys = function() {
  /**
   * @return {?}
   */
  function getData() {
    return {
      validKeys : a,
      topics : results,
      disabledKeys : out
    };
  }
  /**
   * @param {!Object} l
   * @return {undefined}
   */
  function remove(l) {
    a = l.validKeys;
    results = typeof l.topics !== "undefined" ? l.topics : [];
    out = typeof l.disabledKeys !== "undefined" ? l.disabledKeys : "";
  }
  /**
   * @param {!Object} num
   * @return {undefined}
   */
  function addListener(num) {
    /** @type {!Object} */
    a = num;
    /** @type {number} */
    results.length = 0;
  }
  /**
   * @return {undefined}
   */
  function glkote_init() {
    /** @type {!Array} */
    results = [];
    /** @type {string} */
    out = "";
    addListener("hjkl:");
  }
  /**
   * @param {string} value
   * @return {?}
   */
  function isValid(value) {
    var isValid;
    var i;
    if (value === "CTRL-R") {
      /** @type {string} */
      value = "\\redo";
    }
    if (value.charAt(0) !== "\\") {
      /** @type {boolean} */
      isValid = a.indexOf(value) !== -1;
      if (!isValid) {
        if ("DXFTGNPYIASCO".indexOf(value) !== -1 && a.indexOf(value.toLowerCase()) !== -1) {
          /** @type {boolean} */
          isValid = true;
        }
      }
    } else {
      value = value.substr(1);
      /** @type {number} */
      i = 0;
      for (; i < results.length; ++i) {
        if (results[i] === value) {
          /** @type {boolean} */
          isValid = true;
          break;
        }
      }
    }
    return isValid;
  }
  /**
   * @param {string} type
   * @return {?}
   */
  function on(type) {
    var Map;
    if (typeof out === "undefined") {
      /** @type {string} */
      out = "";
    }
    /** @type {boolean} */
    Map = out.indexOf(type) !== -1;
    if (!Map) {
      if ("DXFTGNPYIASCO".indexOf(type) !== -1 && out.indexOf(type.toLowerCase()) !== -1) {
        /** @type {boolean} */
        Map = true;
      }
    }
    return Map;
  }
  /**
   * @param {?} date
   * @return {undefined}
   */
  function l(date) {
    var i = a.indexOf(date);
    if (i !== -1) {
      a = a.substring(0, i) + a.substring(i + 1);
    }
  }
  /**
   * @param {string} b
   * @return {undefined}
   */
  function h(b) {
    var i = out.indexOf(b);
    if (i !== -1) {
      out = out.substring(0, i) + out.substring(i + 1);
    }
  }
  /**
   * @param {string} value
   * @return {undefined}
   */
  function display(value) {
    var i;
    var b;
    if (value === "CTRL-R") {
      /** @type {string} */
      value = "\\redo";
    }
    if (value.charAt(0) !== "\\") {
      /** @type {number} */
      i = 0;
      for (; i < value.length; ++i) {
        b = value.charAt(i);
        if (a.indexOf(b) === -1) {
          a = a + b;
          if (b === "1") {
            /** @type {string} */
            a = a + "234567890";
          }
        }
        if (on(b)) {
          h(b);
          if (b === "1") {
            h("2");
            h("3");
            h("4");
            h("5");
            h("6");
            h("7");
            h("8");
            h("9");
          }
        }
        if (b === "u") {
          /** @type {string} */
          out = "";
        }
      }
    } else {
      value = value.substr(1);
      /** @type {number} */
      i = 0;
      for (; i < results.length; ++i) {
        if (results[i] === value) {
          return;
        }
      }
      results.push(value);
    }
  }
  /**
   * @return {?}
   */
  function b() {
    return a;
  }
  /**
   * @param {string} v
   * @return {?}
   */
  function c(v) {
    var b;
    if (typeof c.descMap === "undefined") {
      c.freesearchCmdDesc = {
        cmd : "/, ?",
        type : "Motion",
        desc : "Search forward '/' or backward '?' for the [count]'th occurrence of pattern (not restricted to whole words).\n/pattern - Search forward for pattern<BR>/ - Search forward for last pattern<BR>?pattern - Search backward for pattern<BR>? - Search backwards for last pattern\n'n' and 'N' also work with '/' and '?'.",
        example : [{
          text : "O<span class='cursor'>n</span>e fish\nTwo fish\nRed fish\nBlue fish",
          command : "<span class='command-cursor'>/Bl&lt;CR&gt;</span>3?fis&lt;CR&gt;/&lt;CR&gt;nd?&lt;CR&gt;"
        }, {
          text : "One fish\nTwo fish\nRed fish\n<span class='cursor'>B</span><span class='select'>l</span>ue fish",
          command : "<span class='command-cursor'>3?fis&lt;CR&gt;</span>/&lt;CR&gt;nd?&lt;CR&gt;"
        }, {
          text : "One <span class='cursor'>f</span><span class='select'>is</span>h\nTwo <span class='select'>fis</span>h\nRed <span class='select'>fis</span>h\nBlue <span class='select'>fis</span>h",
          command : "<span class='command-cursor'>/&lt;CR&gt;</span>nd?&lt;CR&gt;"
        }, {
          text : "One <span class='select'>fis</span>h\nTwo <span class='cursor'>f</span><span class='select'>is</span>h\nRed <span class='select'>fis</span>h\nBlue <span class='select'>fis</span>h",
          command : "<span class='command-cursor'>n</span>d?&lt;CR&gt;"
        }, {
          text : "One <span class='select'>fis</span>h\nTwo <span class='select'>fis</span>h\nRed <span class='cursor'>f</span><span class='select'>is</span>h\nBlue <span class='select'>fis</span>h",
          command : "<span class='command-cursor'>d?&lt;CR&gt;</span>"
        }, {
          text : "One <span class='select'>fis</span>h\nTwo <span class='cursor'>f</span><span class='select'>is</span>h\nBlue <span class='select'>fis</span>h",
          command : "<span class='command-cursor'></span>"
        }]
      };
      c.setnuDesc = {
        cmd : "nu, nonu",
        type : "Boolean option",
        desc : "Show the line number in front of each line in the text. Off by default.\nMakes it really easy to jump to a specific line using ':' and the line number, or the line number followed by G or gg.\n:set nu - shows line numbers.<BR>:set nonu - hides line numbers.<BR>:set nu! - toggle line numbers.<BR>:set nonu! - toggle line numbers."
      };
      c.zCmdDesc = {
        cmd : "zt, zz, zb",
        type : "",
        desc : "Redraw, cursor line at\nzt - Top of window\nzz - Center of window\nzb - Bottom of window",
        example : [{
          text : "Line one\nLine two\nLine three\nLine four\nLine <span class='cursor'>f</span>ive",
          command : "<span class='command-cursor'>zt</span>zzzb"
        }, {
          text : "Line <span class='cursor'>f</span>ive\nLine six\nLine seven\nLine eight\nLine nine",
          command : "<span class='command-cursor'>zz</span>zb"
        }, {
          text : "Line three\nLine four\nLine <span class='cursor'>f</span>ive\nLine six\nLine seven",
          command : "<span class='command-cursor'>zb</span>"
        }, {
          text : "Line one\nLine two\nLine three\nLine four\nLine <span class='cursor'>f</span>ive",
          command : "<span class='command-cursor'></span>"
        }]
      };
      c.gCmdDesc = {
        cmd : "gg",
        type : "Motion",
        desc : "Goto line [count], default first line, on the first non-blank character.",
        example : [{
          text : " &nbsp; &nbsp; Title\n &nbsp; &nbsp; -----\n\n<span class='cursor'>F</span>irst sentence.\nSecond sentence.\nLast sentence.\n\n &nbsp; &nbsp; &nbsp; &nbsp; Signature",
          command : "<span class='command-cursor'>gg</span>5gg2gg"
        }, {
          text : " &nbsp; &nbsp; <span class='cursor'>T</span>itle\n &nbsp; &nbsp; -----\n\nFirst sentence.\nSecond sentence.\nLast sentence.\n\n &nbsp; &nbsp; &nbsp; &nbsp; Signature",
          command : "<span class='command-cursor'>5gg</span>2gg"
        }, {
          text : " &nbsp; &nbsp; Title\n &nbsp; &nbsp; -----\n\nFirst sentence.\n<span class='cursor'>S</span>econd sentence.\nLast sentence.\n\n &nbsp; &nbsp; &nbsp; &nbsp; Signature",
          command : "<span class='command-cursor'>2gg</span>"
        }, {
          text : " &nbsp; &nbsp; Title\n &nbsp; &nbsp; <span class='cursor'>-</span>----\n\nFirst sentence.\nSecond sentence.\nLast sentence.\n\n &nbsp; &nbsp; &nbsp; &nbsp; Signature",
          command : "<span class='command-cursor'></span>"
        }]
      };
      c.countCmdDesc = {
        cmd : "[count]",
        type : "",
        desc : "An optional number that may precede the command to multiply or iterate the command.  If no number is given, a count of one is used, unless otherwise noted.\nYou can use &lt;Del&gt; to erase the last digit.\nTo see examples on the usage of [count] for a specific command or motion, refer to the relevant help page."
      };
      c.colonReg = {
        type : "",
        cmd : ":reg[isters] {arg}",
        desc : "Display the content of the numbered and named registers that are mentioned in [arg], or list all of them if arg is not supplied.\nFor example: ':reg 1a' will display registers '1' and 'a'.\nSpaces are allowed in [arg]."
      };
      c.numberedRegs1to9 = {
        cmd : '"1 - "9',
        type : "",
        desc : "Numbered register 1 contains the text deleted by the most recent delete or change command, unless the command specified another register or the text is less than one line (the small delete register is used then). In VIM (but not in this game) an exception is made for delete with these movement commands: %, (, ), `, /, ?, n, N, { and }.\nWith each successive deletion or change, VIM shifts the previous contents of register 1 into register 2, 2 into 3, and so forth, losing the previous contents of register 9."
      };
      c.namedRegisters = {
        cmd : '"a - "z',
        type : "",
        desc : "VIM fills these registers only when you say so. Specify them as lowercase letters to replace their previous contents or as uppercase letters to append to their previous contents."
      };
      c.unmatchedBracket = {
        cmd : "[{<span class='caption'>,</span> [(<span class='caption'>,</span> ])<span class='caption'>,</span> ]}",
        type : "Motions",
        desc : "Go to [count] previous (or next) unmatched '{' (or ')') starting at, but not including, cursor position.\n\nExample: <span class='caption'>(check destinations of different motions)</span>\n<span class='code'>&nbsp;<BR>var myModule = <span class='target-location'>(<span class='target-location-tip three-letters'>2[(</span></span>function() <span class='target-location'>{<span class='target-location-tip three-letters'>3[{</span></span><BR>&nbsp; &nbsp; var privateVar = 3;<BR>&nbsp; &nbsp; function privateFunc() <span class='target-location'>{<span class='target-location-tip three-letters'>2[{</span></span><BR>&nbsp; &nbsp; &nbsp; &nbsp; var i;<BR>&nbsp; &nbsp; &nbsp; &nbsp; for (i = 0; i < 5; ++i) <span class='target-location'>{<span class='target-location-tip two-letters'>[{</span></span><BR>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; privateVar += <span class='target-location'>(<span class='target-location-tip-down two-letters'>[(</span></span>i <span class='cursor'>*</span> 2 + 3<span class='target-location'>)<span class='target-location-tip two-letters'>])</span></span>;<BR>&nbsp; &nbsp; &nbsp; &nbsp; <span class='target-location'>}<span class='target-location-tip two-letters'>]}</span></span><BR>&nbsp; &nbsp; <span class='target-location'>}<span class='target-location-tip three-letters'>2]}</span></span><BR>&nbsp; &nbsp; return {<BR>&nbsp; &nbsp; &nbsp; &nbsp; doMath : privateFunc<BR>&nbsp; &nbsp; };<BR><span class='target-location'>}<span class='target-location-tip-down three-letters'>3]}</span></span>()<span class='target-location'>)<span class='target-location-tip-down three-letters'>2])</span></span>;<BR>&nbsp;<BR></span>"
      };
      c.colonMarks = {
        cmd : ":marks {args}",
        type : "",
        desc : "List all the current marks.\nIf {args} is specified, lists the marks that are mentioned in {args}. For example: :marks aB lists the marks 'a' and 'B'.\nMark order is constant: a-z followed by A-Z and then other special marks.\nThe first column is numbered 0.\nWhen in the current buffer, the line in which the mark is located is shown. When in another buffer, the buffer name is displayed."
      };
      c.colonDelmarks = {
        cmd : ":delm[arks] {args}<BR>:del[marks]!",
        type : "",
        desc : "Delete the specified marks.\nMarks that can be deleted include a-z and A-Z (there are additional marks, but they are currently not supported in the game).\nIf '!' is used all existing a-z marks in the current text are deleted.\nNot all marks in the game can be deleted (for example some marks are crucial for the player to finish the level)."
      };
      c.undo = {
        cmd : "u, :u[ndo]",
        type : "Command",
        desc : "Undo [count] changes.<BR>:undo - undo only one change.",
        example : [{
          text : "All <span class='cursor'>y</span>our base are belong to us.",
          command : "<span class='command-cursor'>iof&nbsp;&lt;ESC&gt;</span>2eas&lt;ESC&gt;wcwnow&lt;ESC&gt;<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;u2u"
        }, {
          text : "All of<span class='cursor'>&nbsp;</span>your base are belong to us.",
          command : "<span class='command-cursor'>2e</span>as&lt;ESC&gt;wcwnow&lt;ESC&gt;u2u<BR>"
        }, {
          text : "All of your bas<span class='cursor'>e</span> are belong to us.",
          command : "<span class='command-cursor'>as&lt;ESC&gt;</span>wcwnow&lt;ESC&gt;u2u<BR>"
        }, {
          text : "All of your base<span class='cursor'>s</span> are belong to us.",
          command : "<span class='command-cursor'>w</span>cwnow&lt;ESC&gt;u2u<BR>"
        }, {
          text : "All of your bases <span class='cursor'>a</span>re belong to us.",
          command : "<span class='command-cursor'>cwnow&lt;ESC&gt;</span>u2u<BR>"
        }, {
          text : "All of your bases no<span class='cursor'>w</span> belong to us.",
          command : "<span class='command-cursor'>u</span>2u<BR>"
        }, {
          text : "All of your bases <span class='cursor'>a</span>re belong to us.",
          command : "<span class='command-cursor'>2u</span><BR>"
        }, {
          text : "All <span class='cursor'>y</span>our base are belong to us.",
          command : "<span class='command-cursor'></span><BR>"
        }]
      };
      c.redo = {
        cmd : "CTRL-R, :red[o]",
        type : "command",
        desc : "Redo [count] changes that were undone.<BR>:redo - redo one change that was undone.\nNote that the r can be either lowercase or uppercase.",
        example : [{
          text : "All <span class='cursor'>y</span>our base are belong to us.",
          command : "<span class='command-cursor'>iof&nbsp;&lt;ESC&gt;</span>2eas&lt;ESC&gt;wcwnow&lt;ESC&gt;<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;u2u&lt;CTRL-R&gt;2&lt;CTRL-R&gt;"
        }, {
          text : "All of<span class='cursor'>&nbsp;</span>your base are belong to us.",
          command : "<span class='command-cursor'>2e</span>as&lt;ESC&gt;wcwnow&lt;ESC&gt;u2u<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;CTRL-R&gt;2&lt;CTRL-R&gt;"
        }, {
          text : "All of your bas<span class='cursor'>e</span> are belong to us.",
          command : "<span class='command-cursor'>as&lt;ESC&gt;</span>wcwnow&lt;ESC&gt;u2u<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;CTRL-R&gt;2&lt;CTRL-R&gt;"
        }, {
          text : "All of your base<span class='cursor'>s</span> are belong to us.",
          command : "<span class='command-cursor'>w</span>cwnow&lt;ESC&gt;u2u&lt;CTRL-R&gt;<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&lt;CTRL-R&gt;"
        }, {
          text : "All of your bases <span class='cursor'>a</span>re belong to us.",
          command : "<span class='command-cursor'>cwnow&lt;ESC&gt;</span>u2u&lt;CTRL-R&gt;2&lt;CTRL-R&gt;<BR>"
        }, {
          text : "All of your bases no<span class='cursor'>w</span> belong to us.",
          command : "<span class='command-cursor'>u</span>2u&lt;CTRL-R&gt;2&lt;CTRL-R&gt;<BR>"
        }, {
          text : "All of your bases <span class='cursor'>a</span>re belong to us.",
          command : "<span class='command-cursor'>2u</span>&lt;CTRL-R&gt;2&lt;CTRL-R&gt;<BR>"
        }, {
          text : "All <span class='cursor'>y</span>our base are belong to us.",
          command : "<span class='command-cursor'>&lt;CTRL-R&gt;</span>2&lt;CTRL-R&gt;<BR>"
        }, {
          text : "All <span class='cursor'>o</span>f your base are belong to us.",
          command : "<span class='command-cursor'>2&lt;CTRL-R&gt;</span><BR>"
        }, {
          text : "All of your bases <span class='cursor'>n</span>ow belong to us.",
          command : "<span class='command-cursor'></span><BR>"
        }]
      };
      c.descMap = {
        h : {
          type : "Motion",
          desc : "Left or [count] characters to the left\nIn VIM, you can't go left beyond the beginning of the line.\nWhen you do this in the game, you leave the text area.\nIn the game, when used with a [count], the cursor won't cross text area bounderies.",
          example : [{
            text : "A short sente<span class='cursor'>n</span>ce.",
            command : "<span class='command-cursor'>h</span>h4h"
          }, {
            text : "A short sent<span class='cursor'>e</span>nce.",
            command : "<span class='command-cursor'>h</span>4h"
          }, {
            text : "A short sen<span class='cursor'>t</span>ence.",
            command : "<span class='command-cursor'>4h</span>"
          }, {
            text : "A short<span class='cursor'>&nbsp;</span>sentence.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        j : {
          type : "Motion",
          desc : "Down or [count] lines down\nWhen moving down to a shorter line if the cursor can't stay in the same column, the column will be remembered to be restored when a subsequent line becomes long enough.\nIn the game, when not on a text area, water denote the end of a line.",
          example : [{
            text : "abcd<span class='cursor'>e</span>fg\nabcde\na\nabcd\nabcdefg",
            command : "<span class='command-cursor'>j</span>j2j"
          }, {
            text : "abcdefg\nabcd<span class='cursor'>e</span>\na\nabcd\nabcdefg",
            command : "<span class='command-cursor'>j</span>2j"
          }, {
            text : "abcdefg\nabcde\n<span class='cursor'>a</span>\nabcd\nabcdefg",
            command : "<span class='command-cursor'>2j</span>"
          }, {
            text : "abcdefg\nabcde\na\nabcd\nabcd<span class='cursor'>e</span>fg",
            command : "<span class='command-cursor'></span>"
          }]
        },
        k : {
          type : "Motion",
          desc : "Up or [count] lines up\nWhen moving up to a shorter line if the cursor can't stay in the same column, the column will be remembered to be restored when a subsequent line becomes long enough.\nIn the game, when not on a text area, water denote the end of a line.",
          example : [{
            text : "abcdefg\nabcd\na\nabcde\nabcd<span class='cursor'>e</span>fg",
            command : "<span class='command-cursor'>k</span>k2k"
          }, {
            text : "abcdefg\nabcd\na\nabcd<span class='cursor'>e</span>\nabcdefg",
            command : "<span class='command-cursor'>k</span>2k"
          }, {
            text : "abcdefg\nabcd\n<span class='cursor'>a</span>\nabcde\nabcdefg",
            command : "<span class='command-cursor'>2k</span>"
          }, {
            text : "abcd<span class='cursor'>e</span>fg\nabcd\na\nabcde\nabcdefg",
            command : "<span class='command-cursor'></span>"
          }]
        },
        l : {
          type : "Motion",
          desc : "Right or [count] characters to the right\nIn VIM, you can't go right beyond the end of the line.\nWhen you do this in the game, you leave the text area.\nIn the game, when used with a [count], the cursor won't cross text area bounderies.",
          example : [{
            text : "A <span class='cursor'>s</span>hort sentence.",
            command : "<span class='command-cursor'>l</span>l4l"
          }, {
            text : "A s<span class='cursor'>h</span>ort sentence.",
            command : "<span class='command-cursor'>l</span>4l"
          }, {
            text : "A sh<span class='cursor'>o</span>rt sentence.",
            command : "<span class='command-cursor'>4l</span>"
          }, {
            text : "A short <span class='cursor'>s</span>entence.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        w : {
          type : "Motion",
          desc : "[count] words forward.\nPosition the cursor at the beginning of the word.\nA word (see :help word) consists of a sequence of letters, digits and underscores, or a sequence of other non-blank characters, separated with white space (spaces, tabs, EOL). An empty line is also considered to be a word.",
          example : [{
            text : "<span class='cursor'>T</span>wo words. One_word.",
            command : "<span class='command-cursor'>w</span>www"
          }, {
            text : "Two <span class='cursor'>w</span>ords. One_word.",
            command : "<span class='command-cursor'>w</span>ww"
          }, {
            text : "Two words<span class='cursor'>.</span> One_word.",
            command : "<span class='command-cursor'>w</span>w"
          }, {
            text : "Two words. <span class='cursor'>O</span>ne_word.",
            command : "<span class='command-cursor'>w</span>"
          }, {
            text : "Two words. One_word<span class='cursor'>.</span>",
            command : "<span class='command-cursor'></span>"
          }]
        },
        W : {
          type : "Motion",
          desc : "[count] WORDs forward.\nPosition the cursor at the beginning of the WORD.\nA WORD (see :help WORD) consists of a sequence of non-blank characters, separated with white space (spaces, tabs, EOL). An empty line is also considered to be a WORD.",
          example : [{
            text : "<span class='cursor'>T</span>wo words...! One_word.",
            command : "<span class='command-cursor'>W</span>W"
          }, {
            text : "Two <span class='cursor'>w</span>ords...! One_word.",
            command : "<span class='command-cursor'>W</span>"
          }, {
            text : "Two words...! <span class='cursor'>O</span>ne_word.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        e : {
          type : "Motion",
          desc : "Forward to the end of word [count].\nPosition the cursor at the end of the word.\nDoes not stop in an empty line.\nA word (see :help word) consists of a sequence of letters, digits and underscores, or a sequence of other non-blank characters, separated with white space (spaces, tabs, EOL). An empty line is also considered to be a word.",
          example : [{
            text : "<span class='cursor'>T</span>wo words. One_word.",
            command : "<span class='command-cursor'>e</span>eeee"
          }, {
            text : "Tw<span class='cursor'>o</span> words. One_word.",
            command : "<span class='command-cursor'>e</span>eee"
          }, {
            text : "Two word<span class='cursor'>s</span>. One_word.",
            command : "<span class='command-cursor'>e</span>ee"
          }, {
            text : "Two words<span class='cursor'>.</span> One_word.",
            command : "<span class='command-cursor'>e</span>e"
          }, {
            text : "Two words. One_wor<span class='cursor'>d</span>.",
            command : "<span class='command-cursor'>e</span>"
          }, {
            text : "Two words. One_word<span class='cursor'>.</span>",
            command : "<span class='command-cursor'></span>"
          }]
        },
        E : {
          type : "Motion",
          desc : "Forward to the end of WORD [count].\nPosition the cursor at the end of the WORD.\nDoes not stop in an empty line.\nA WORD (see :help WORD) consists of a sequence of non-blank characters, separated with white space (spaces, tabs, EOL). An empty line is also considered to be a WORD.",
          example : [{
            text : "<span class='cursor'>T</span>wo words...! One_word.",
            command : "<span class='command-cursor'>E</span>EE"
          }, {
            text : "Tw<span class='cursor'>o</span> words...! One_word.",
            command : "<span class='command-cursor'>E</span>E"
          }, {
            text : "Two words...<span class='cursor'>!</span> One_word.",
            command : "<span class='command-cursor'>E</span>"
          }, {
            text : "Two words...! One_word<span class='cursor'>.</span>",
            command : "<span class='command-cursor'></span>"
          }]
        },
        b : {
          type : "Motion",
          desc : "[count] words backward.\nPosition the cursor at the beginning of the word.\nA word (see :help word) consists of a sequence of letters, digits and underscores, or a sequence of other non-blank characters, separated with white space (spaces, tabs, EOL). An empty line is also considered to be a word.",
          example : [{
            text : "Two words. One_word<span class='cursor'>.</span>",
            command : "<span class='command-cursor'>b</span>bbb"
          }, {
            text : "Two words. <span class='cursor'>O</span>ne_word.",
            command : "<span class='command-cursor'>b</span>bb"
          }, {
            text : "Two words<span class='cursor'>.</span> One_word.",
            command : "<span class='command-cursor'>b</span>b"
          }, {
            text : "Two <span class='cursor'>w</span>ords. One_word.",
            command : "<span class='command-cursor'>b</span>"
          }, {
            text : "<span class='cursor'>T</span>wo words. One_word.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        B : {
          type : "Motion",
          desc : "[count] WORDS backward.\nPosition the cursor at the beginning of the WORD.\nA WORD (see :help WORD) consists of a sequence of non-blank characters, separated with white space (spaces, tabs, EOL). An empty line is also considered to be a WORD.",
          example : [{
            text : "That's, erm, no-1@there.co<span class='cursor'>m</span>",
            command : "<span class='command-cursor'>B</span>BB"
          }, {
            text : "That's, erm, <span class='cursor'>n</span>o-1@there.com",
            command : "<span class='command-cursor'>B</span>B"
          }, {
            text : "That's, <span class='cursor'>e</span>rm, no-1@there.com",
            command : "<span class='command-cursor'>B</span>"
          }, {
            text : "<span class='cursor'>T</span>hat's, erm, no-1@there.com",
            command : "<span class='command-cursor'></span>"
          }]
        },
        x : {
          type : "Command",
          desc : "Delete [count] characters under and after the cursor in the current line [into a register if specified]. Does the same as 'dl'.",
          example : [{
            text : "Two words. One<span class='cursor'>_</span>word.",
            command : "<span class='command-cursor'>x</span>xx2x"
          }, {
            text : "Two words. One<span class='cursor'>w</span>ord.",
            command : "<span class='command-cursor'>x</span>x2x"
          }, {
            text : "Two words. One<span class='cursor'>o</span>rd.",
            command : "<span class='command-cursor'>x</span>2x"
          }, {
            text : "Two words. One<span class='cursor'>r</span>d.",
            command : "<span class='command-cursor'>2x</span>"
          }, {
            text : "Two words. One<span class='cursor'>.</span>",
            command : "<span class='command-cursor'></span>"
          }]
        },
        X : {
          type : "Command",
          desc : "Delete [count] characters before the cursor in the current line [into a register if specified]. Does the same as 'dh'.",
          example : [{
            text : "Two words. One_<span class='cursor'>w</span>ord.",
            command : "<span class='command-cursor'>X</span>X2X"
          }, {
            text : "Two words. One<span class='cursor'>w</span>ord.",
            command : "<span class='command-cursor'>X</span>2X"
          }, {
            text : "Two words. On<span class='cursor'>w</span>ord.",
            command : "<span class='command-cursor'>2X</span>"
          }, {
            text : "Two words. <span class='cursor'>w</span>ord.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        r : {
          cmd : "r{char}",
          type : "Command",
          desc : "Replace the character under the cursor with {char}.\nIf you give a [count], VIM replaces [count] characters with [count] {char}s.",
          example : [{
            text : "This should be <span class='cursor'>C</span>ENSORED.",
            command : "<span class='command-cursor'>rX</span>rX6rX"
          }, {
            text : "This should be X<span class='cursor'>E</span>NSORED.",
            command : "<span class='command-cursor'>rX</span>6rX"
          }, {
            text : "This should be XX<span class='cursor'>N</span>SORED.",
            command : "<span class='command-cursor'>6rX</span>"
          }, {
            text : "This should be XXXXXXXX<span class='cursor'>.</span>",
            command : "<span class='command-cursor'></span>"
          }]
        },
        d : {
          cmd : "d{motion}",
          type : "Operator",
          desc : 'Delete text that {motion} moves over [into a register if specified].\nSee also help on "dd".',
          example : [{
            text : "To <span class='cursor'>b</span>e deleted.",
            command : "<span class='command-cursor'>dw</span>dbd7l"
          }, {
            text : "To <span class='cursor'>d</span>eleted.",
            command : "<span class='command-cursor'>db</span>d7l"
          }, {
            text : "<span class='cursor'>d</span>eleted.",
            command : "<span class='command-cursor'>d7l</span>"
          }, {
            text : "<span class='cursor'>.</span>",
            command : "<span class='command-cursor'></span>"
          }]
        },
        dd : {
          type : "Command",
          desc : "Delete [count] whole lines [into a register].\nRegardless of the cursor position in the line, the entire line is deleted.",
          example : [{
            text : "First Line\nSecond <span class='cursor'>L</span>ine\nThird Line\nForth Line\nFifth Line",
            command : "<span class='command-cursor'>dd</span>dd2dd"
          }, {
            text : "First Line\n<span class='cursor'>T</span>hird Line\nForth Line\nFifth Line",
            command : "<span class='command-cursor'>dd</span>2dd"
          }, {
            text : "First Line\n<span class='cursor'>F</span>orth Line\nFifth Line",
            command : "<span class='command-cursor'>2dd</span>"
          }, {
            text : "<span class='cursor'>F</span>irst Line",
            command : "<span class='command-cursor'></span>"
          }]
        },
        D : {
          type : "Command",
          desc : 'Delete the characters under the cursor until the end of the line and [count]-1 more lines [into a register]; synonym for "d$".',
          example : [{
            text : "First Line\nSecond<span class='cursor'>&nbsp;</span>Line\nThird Line\nForth Line\nFifth Line",
            command : "<span class='command-cursor'>D</span>j3D"
          }, {
            text : "First Line\nSecon<span class='cursor'>d</span>\nThird Line\nForth Line\nFifth Line",
            command : "<span class='command-cursor'>j</span>3D"
          }, {
            text : "First Line\nSecond\nThird<span class='cursor'>&nbsp;</span>Line\nForth Line\nFifth Line",
            command : "<span class='command-cursor'>3D</span>"
          }, {
            text : "First Line\nSecond\nThir<span class='cursor'>d</span>",
            command : "<span class='command-cursor'></span>"
          }]
        },
        "~" : {
          type : "Command",
          desc : "Switch case of the character under the cursor and move the cursor to the right.\nIf a [count] is given, do that many characters.",
          example : [{
            text : "<span class='cursor'>d</span>ON'T USE ALL CAPS.",
            command : "<span class='command-cursor'>~</span>~99~"
          }, {
            text : "D<span class='cursor'>O</span>N'T USE ALL CAPS.",
            command : "<span class='command-cursor'>~</span>99~"
          }, {
            text : "Do<span class='cursor'>N</span>'T USE ALL CAPS.",
            command : "<span class='command-cursor'>99~</span>"
          }, {
            text : "Don't use all caps<span class='cursor'>.</span>",
            command : "<span class='command-cursor'></span>"
          }]
        },
        0 : {
          type : "Motion",
          desc : "To the first character of the line.",
          example : [{
            text : "&nbsp;&nbsp;&nbsp;Line begins with 3 <span class='cursor'>s</span>paces.",
            command : "<span class='command-cursor'>0</span>"
          }, {
            text : "<span class='cursor'>&nbsp;</span>&nbsp;&nbsp;Line begins with 3 spaces.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        "^" : {
          type : "Motion",
          desc : "To the first non-blank character of the line.",
          example : [{
            text : "&nbsp;&nbsp;&nbsp;Line begins with 3 <span class='cursor'>s</span>paces.",
            command : "<span class='command-cursor'>^</span>"
          }, {
            text : "&nbsp;&nbsp;&nbsp;<span class='cursor'>L</span>ine begins with 3 spaces.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        $ : {
          type : "Motion",
          desc : "To the end of the line.\nWhen a count is given also go [count - 1] lines downward.",
          example : [{
            text : "<span class='cursor'>L</span>ine one.\nLine two.\nLine three.",
            command : "<span class='command-cursor'>$</span>w2$"
          }, {
            text : "Line one<span class='cursor'>.</span>\nLine two.\nLine three.",
            command : "<span class='command-cursor'>w</span>2$"
          }, {
            text : "Line one.\n<span class='cursor'>L</span>ine two.\nLine three.",
            command : "<span class='command-cursor'>2$</span>"
          }, {
            text : "Line one.\nLine two.\nLine three<span class='cursor'>.</span>",
            command : "<span class='command-cursor'></span>"
          }]
        },
        f : {
          cmd : "f{char}",
          type : "Motion",
          desc : "To [count]'th occurrence of {char} to the right.\nThe cursor is placed on {char}.",
          example : [{
            text : "<span class='cursor'>B</span>etty bought a bit of butter.",
            command : "<span class='command-cursor'>fo</span>fh3ft"
          }, {
            text : "Betty b<span class='cursor'>o</span>ught a bit of butter.",
            command : "<span class='command-cursor'>fh</span>3ft"
          }, {
            text : "Betty boug<span class='cursor'>h</span>t a bit of butter.",
            command : "<span class='command-cursor'>3ft</span>"
          }, {
            text : "Betty bought a bit of bu<span class='cursor'>t</span>ter.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        F : {
          cmd : "F{char}",
          type : "Motion",
          desc : "To the [count]'th occurrence of {char} to the left.\nThe cursor is placed on {char}.",
          example : [{
            text : "Betty bought a bit of butte<span class='cursor'>r</span>.",
            command : "<span class='command-cursor'>Fu</span>Fi3Ft"
          }, {
            text : "Betty bought a bit of b<span class='cursor'>u</span>tter.",
            command : "<span class='command-cursor'>Fi</span>3Ft"
          }, {
            text : "Betty bought a b<span class='cursor'>i</span>t of butter.",
            command : "<span class='command-cursor'>3Ft</span>"
          }, {
            text : "Be<span class='cursor'>t</span>ty bought a bit of butter.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        ":" : {
          cmd : ": {command}",
          type : "",
          desc : "Enter command line mode and execute commands. The following commands are supported in the game:<BR>login<BR>logout<BR>help [topic] - Help on [topic]<BR>keyboard - Show known keys<BR>e[!] [name] - Restore game<BR>w[!] [name] - Save game<BR>!ls - List saved games<BR>!rm {name} - Delete saved game<BR>q[!] - Exit to title screen<BR>reg [regs] - Display registers<BR>ls - list buffers<BR>b [nameOrIndex] - change buffer<BR>marks [spec] - list marks<BR>u[ndo]<BR>red[o]"
        },
        z : c.zCmdDesc,
        zt : c.zCmdDesc,
        zz : c.zCmdDesc,
        zb : c.zCmdDesc,
        G : {
          cmd : "G",
          type : "Motion",
          desc : "Goto line [count], default last line, on the first non-blank character.",
          example : [{
            text : " &nbsp; &nbsp; Title\n &nbsp; &nbsp; -----\n\n<span class='cursor'>F</span>irst sentence.\nSecond sentence.\nLast sentence.\n\n &nbsp; &nbsp; &nbsp; &nbsp; Signature",
            command : "<span class='command-cursor'>G</span>5G2G"
          }, {
            text : " &nbsp; &nbsp; Title\n &nbsp; &nbsp; -----\n\nFirst sentence.\nSecond sentence.\nLast sentence.\n\n &nbsp; &nbsp; &nbsp; &nbsp; <span class='cursor'>S</span>ignature",
            command : "<span class='command-cursor'>5G</span>2G"
          }, {
            text : " &nbsp; &nbsp; Title\n &nbsp; &nbsp; -----\n\nFirst sentence.\n<span class='cursor'>S</span>econd sentence.\nLast sentence.\n\n &nbsp; &nbsp; &nbsp; &nbsp; Signature",
            command : "<span class='command-cursor'>2G</span>"
          }, {
            text : " &nbsp; &nbsp; Title\n &nbsp; &nbsp; <span class='cursor'>-</span>----\n\nFirst sentence.\nSecond sentence.\nLast sentence.\n\n &nbsp; &nbsp; &nbsp; &nbsp; Signature",
            command : "<span class='command-cursor'></span>"
          }]
        },
        gg : c.gCmdDesc,
        g : c.gCmdDesc,
        1 : c.countCmdDesc,
        2 : c.countCmdDesc,
        3 : c.countCmdDesc,
        4 : c.countCmdDesc,
        5 : c.countCmdDesc,
        6 : c.countCmdDesc,
        7 : c.countCmdDesc,
        8 : c.countCmdDesc,
        9 : c.countCmdDesc,
        count : c.countCmdDesc,
        "[count]" : c.countCmdDesc,
        t : {
          cmd : "t{char}",
          type : "Motion",
          desc : "Till before [count]'th occurrence of {char} to the right.\nThe cursor is placed on the character left of {char}.",
          example : [{
            text : "<span class='cursor'>B</span>etty bought a bit of butter.",
            command : "<span class='command-cursor'>to</span>th3tt"
          }, {
            text : "Betty <span class='cursor'>b</span>ought a bit of butter.",
            command : "<span class='command-cursor'>th</span>3tt"
          }, {
            text : "Betty bou<span class='cursor'>g</span>ht a bit of butter.",
            command : "<span class='command-cursor'>3tt</span>"
          }, {
            text : "Betty bought a bit of b<span class='cursor'>u</span>tter.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        T : {
          cmd : "T{char}",
          type : "Motion",
          desc : "Till after [count]'th occurrence of {char} to the left.\nThe cursor is placed on the character right of {char}.",
          example : [{
            text : "Betty bought a bit of but<span class='cursor'>t</span>er.",
            command : "<span class='command-cursor'>Ti</span>Ti3Tt"
          }, {
            text : "Betty bought a bi<span class='cursor'>t</span> of butter.",
            command : "<span class='command-cursor'>Ti</span>3Tt"
          }, {
            text : "Betty bought a bi<span class='cursor'>t</span> of butter.",
            command : "<span class='command-cursor'>3Tt</span>"
          }, {
            text : "Bet<span class='cursor'>t</span>y bought a bit of butter.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        ";" : {
          type : "Motion",
          desc : "Repeat latest f, t, F or T [count] times.",
          example : [{
            text : "<span class='cursor'>B</span>etty bought a bit of butter.",
            command : "<span class='command-cursor'>fu</span>;Tt3;"
          }, {
            text : "Betty bo<span class='cursor'>u</span>ght a bit of butter.",
            command : "<span class='command-cursor'>;</span>Tt3;"
          }, {
            text : "Betty bought a bit of b<span class='cursor'>u</span>tter.",
            command : "<span class='command-cursor'>Tt</span>3;"
          }, {
            text : "Betty bought a bit<span class='cursor'>&nbsp;</span>of butter.",
            command : "<span class='command-cursor'>3</span>;"
          }, {
            text : "Bett<span class='cursor'>y</span> bought a bit of butter.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        "," : {
          type : "Motion",
          desc : "Repeat latest f, t, F or T in opposite direction.",
          example : [{
            text : "Betty bought a bi<span class='cursor'>t</span> of butter.",
            command : "<span class='command-cursor'>fu</span>,tt2,"
          }, {
            text : "Betty bought a bit of b<span class='cursor'>u</span>tter.",
            command : "<span class='command-cursor'>,</span>tt2,"
          }, {
            text : "Betty bo<span class='cursor'>u</span>ght a bit of butter.",
            command : "<span class='command-cursor'>tt</span>2,"
          }, {
            text : "Betty boug<span class='cursor'>h</span>t a bit of butter.",
            command : "<span class='command-cursor'>2,</span>"
          }, {
            text : "Bet<span class='cursor'>t</span>y bought a bit of butter.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        "%" : {
          type : "Motion",
          desc : "Find the next item in this line after or under the cursor and jump to its match.\nItems can be: ( [ { } ] ) /* */ #if #ifdef #else #elif #endif.\nNo count is allowed, {count}% jumps to a line {count} percentage down the file (isn't supported in the game).",
          example : [{
            text : "<span class='cursor'>i</span>f (max(2*(3+5), 4) &gt; 15) {\n&nbsp;&nbsp;// Do something!\n}",
            command : "<span class='command-cursor'>%</span>%$%"
          }, {
            text : "if (max(2*(3+5), 4) &gt; 15<span class='cursor'>)</span> {\n&nbsp;&nbsp;// Do something!\n}",
            command : "<span class='command-cursor'>%</span>$%"
          }, {
            text : "if <span class='cursor'>(</span>max(2*(3+5), 4) &gt; 15) {\n&nbsp;&nbsp;// Do something!\n}",
            command : "<span class='command-cursor'>$</span>%"
          }, {
            text : "if (max(2*(3+5), 4) &gt; 15) <span class='cursor'>{</span>\n&nbsp;&nbsp;// Do something!\n}",
            command : "<span class='command-cursor'>%</span>"
          }, {
            text : "if (max(2*(3+5), 4) &gt; 15) {\n&nbsp;&nbsp;// Do something!\n<span class='cursor'>}</span>",
            command : "<span class='command-cursor'></span>"
          }]
        },
        "*" : {
          type : "Motion",
          desc : "Search forward for the [count]'th occurrence of the whole word nearest to the cursor in the current line.\nThe word used for the search is the first of:<br>1. the keyword (A-Za-z0-9_@) under the cursor<br>2. the first keyword after the cursor<br>3. the non-blank word under the cursor<br>4. the first non-blank word after the cursor",
          example : [{
            text : "for<span class='cursor'>&nbsp;</span>(i=0; i&lt;10; ++i) {\n&nbsp; &nbsp; sum += i;\n}",
            command : "<span class='command-cursor'>*</span>2*"
          }, {
            text : "for (<span class='select'>i</span>=0; <span class='cursor'>i</span>&lt;10; ++<span class='select'>i</span>) {\n&nbsp; &nbsp; sum += <span class='select'>i</span>;\n}",
            command : "<span class='command-cursor'>2*</span>"
          }, {
            text : "for (<span class='select'>i</span>=0; <span class='select'>i</span>&lt;10; ++<span class='select'>i</span>) {\n&nbsp; &nbsp; sum += <span class='cursor'>i</span>;\n}",
            command : "<span class='command-cursor'></span>"
          }]
        },
        "#" : {
          type : "Motion",
          desc : 'Same as "*", but search backward.',
          example : [{
            text : "for (i=0; i&lt;10; ++i) {\n&nbsp; &nbsp; sum <span class='cursor'>+</span>= i;\n}",
            command : "<span class='command-cursor'>#</span>2#"
          }, {
            text : "for (<span class='select'>i</span>=0; <span class='select'>i</span>&lt;10; ++<span class='cursor'>i</span>) {\n&nbsp; &nbsp; sum += <span class='select'>i</span>;\n}",
            command : "<span class='command-cursor'>2#</span>"
          }, {
            text : "for (<span class='cursor'>i</span>=0; <span class='select'>i</span>&lt;10; ++<span class='select'>i</span>) {\n&nbsp; &nbsp; sum += <span class='select'>i</span>;\n}",
            command : "<span class='command-cursor'></span>"
          }]
        },
        n : {
          type : "Motion",
          desc : 'Repeat the latest "/" or "?" [count] times.\n"*" and "#" searches are also considered "/" and "?" repectively.',
          example : [{
            text : "for<span class='cursor'>&nbsp;</span>(i=0; i&lt;10; ++i) {\n&nbsp; &nbsp; sum += i;\n}",
            command : "<span class='command-cursor'>*</span>2n"
          }, {
            text : "for (<span class='select'>i</span>=0; <span class='cursor'>i</span>&lt;10; ++<span class='select'>i</span>) {\n&nbsp; &nbsp; sum += <span class='select'>i</span>;\n}",
            command : "<span class='command-cursor'>2n</span>"
          }, {
            text : "for (<span class='select'>i</span>=0; <span class='select'>i</span>&lt;10; ++<span class='select'>i</span>) {\n&nbsp; &nbsp; sum += <span class='cursor'>i</span>;\n}",
            command : "<span class='command-cursor'></span>"
          }]
        },
        N : {
          type : "Motion",
          desc : 'Repeat the latest "/" or "?" [count] times in opposite direction.\n"*" and "#" searches are also considered "/" and "?" repectively.',
          example : [{
            text : "for (i=0; <span class='cursor'>i</span>&lt;10; ++i) {\n&nbsp; &nbsp; sum += i;\n}",
            command : "<span class='command-cursor'>#</span>3N"
          }, {
            text : "for (<span class='cursor'>i</span>=0; <span class='select'>i</span>&lt;10; ++<span class='select'>i</span>) {\n&nbsp; &nbsp; sum += <span class='select'>i</span>;\n}",
            command : "<span class='command-cursor'>3N</span>"
          }, {
            text : "for (<span class='select'>i</span>=0; <span class='select'>i</span>&lt;10; ++<span class='select'>i</span>) {\n&nbsp; &nbsp; sum += <span class='cursor'>i</span>;\n}",
            command : "<span class='command-cursor'></span>"
          }]
        },
        p : {
          type : "Command",
          desc : 'Put the text [from the specified register] after the cursor [count] times.\nWhen no register is specified, use the unnamed register (") which contains the last text deleted (d, x), changed (c, s), or yanked (y).',
          example : [{
            text : "T<span class='cursor'>i</span>hs it.",
            command : "<span class='command-cursor'>x</span>pdwh2p"
          }, {
            text : "T<span class='cursor'>h</span>s it.",
            command : "<span class='command-cursor'>p</span>dwh2p"
          }, {
            text : "Th<span class='cursor'>i</span>s it.",
            command : "<span class='command-cursor'>dw</span>h2p"
          }, {
            text : "Th<span class='cursor'>i</span>t.",
            command : "<span class='command-cursor'>h</span>2p"
          }, {
            text : "T<span class='cursor'>h</span>it.",
            command : "<span class='command-cursor'>2p</span>"
          }, {
            text : "This is<span class='cursor'>&nbsp;</span>it.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        P : {
          type : "Command",
          desc : 'Put the text [from the specified register] before the cursor [count] times.\nWhen no register is specified, use the unnamed register (") which contains the last text deleted (d, x), changed (c, s), or yanked (y).',
          example : [{
            text : "his<span class='cursor'>T</span> it.",
            command : "<span class='command-cursor'>x</span>0Pw3X2P"
          }, {
            text : "his<span class='cursor'>&nbsp;</span>it.",
            command : "<span class='command-cursor'>0</span>Pw3X2P"
          }, {
            text : "<span class='cursor'>h</span>is it.",
            command : "<span class='command-cursor'>P</span>w3X2P"
          }, {
            text : "<span class='cursor'>T</span>his it.",
            command : "<span class='command-cursor'>w</span>3X2P"
          }, {
            text : "This <span class='cursor'>i</span>t.",
            command : "<span class='command-cursor'>3X</span>2P"
          }, {
            text : "Th<span class='cursor'>i</span>t.",
            command : "<span class='command-cursor'>2P</span>"
          }, {
            text : "This is<span class='cursor'>&nbsp;</span>it.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        '"' : {
          type : "Register Specification",
          desc : 'Use register {a-zA-Z0-9.%#:-"} for next delete, yank or put (i.e. paste).\nUse uppercase character to append with delete and yank.\n{.%#:} only work with put and are currently not supported in the game.\nType :reg to see the register\'s content.\nType :help "{a-zA-Z0-9-_"} to get help on a specific register.'
        },
        y : {
          type : "Operator",
          cmd : "y{motion}",
          desc : 'Yank {motion} text [into a register].\nText is stored into "0 register unless another register is specified.',
          example : [{
            text : "<span class='cursor'>T</span>his is it. not.",
            command : "<span class='command-cursor'>y2w</span>fnP"
          }, {
            text : "<span class='cursor'>T</span>his is it. not.",
            command : "<span class='command-cursor'>fn</span>P"
          }, {
            text : "This is it. <span class='cursor'>n</span>ot.",
            command : "<span class='command-cursor'>P</span>"
          }, {
            text : "This is it. This is<span class='cursor'>&nbsp;</span>not.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        yy : {
          type : "Command",
          desc : "Yank [count] lines [into a register].\nThe cursor position in the line doesn't matter.\nText is stored into \"0 register unless another register is specified.",
          example : [{
            text : "Another line.\nA <span class='cursor'>L</span>ine.",
            command : "<span class='command-cursor'>yy</span>kP"
          }, {
            text : "Another line.\nA <span class='cursor'>L</span>ine.",
            command : "<span class='command-cursor'>k</span>P"
          }, {
            text : "An<span class='cursor'>o</span>ther line.\nA Line.",
            command : "<span class='command-cursor'>P</span>"
          }, {
            text : "<span class='cursor'>A</span> line.\nAnother line.\nA Line.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        Y : {
          type : "Command",
          desc : "Yank [count] lines [into a register]. Synonym for yy.\nThe cursor position in the line doesn't matter.\nText is stored into \"0 register unless another register is specified.",
          example : [{
            text : "Another line.\nA <span class='cursor'>L</span>ine.",
            command : "<span class='command-cursor'>Y</span>kP"
          }, {
            text : "Another line.\nA <span class='cursor'>L</span>ine.",
            command : "<span class='command-cursor'>k</span>P"
          }, {
            text : "An<span class='cursor'>o</span>ther line.\nA Line.",
            command : "<span class='command-cursor'>P</span>"
          }, {
            text : "<span class='cursor'>A</span> Line.\nAnother line.\nA Line.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        reg : c.colonReg,
        ":reg" : c.colonReg,
        ":registers" : c.colonReg,
        registers : {
          type : "",
          desc : 'There are nine types of registers:\n1. The unnamed register ""<br>2. numbered registers "0 to "9<br>3. Small delete register "-<br>4. Named registers "a to "z<br>5. Black hole register "_<br>6. Four read-only registers ":, "., "% and "#<br>7. The expression register "=<br>8. The selection and drop registers "*, "+ and "~<br>9. Last search pattern "/\nOnly the first 5 are currently supported in the game.\nType :help followed by register name for help.'
        },
        '""' : {
          type : "Unnamed Register",
          desc : 'VIM fills this register with text deleted with the "d", "c", "s", "x" commands or copied with the yank "y" command, regardless of whether or not a specific register was used (an exception is the "_ register). This is like the unnamed register is pointing to the last used register. Thus when appending using an uppercase register name, the unnamed register contains the same text as the named register. The unnamed register is the default for put commands which does not specify a register. You can access it with the name \'"\' (using two double quotes).'
        },
        '"-' : {
          type : "Small Delete Register",
          desc : 'This register contains text from commands that delete less than one line, except when the command specifies a register with ["x].'
        },
        '"_' : {
          type : "Black Hole Register",
          desc : "When writing to this register, nothing happens. This can be used to delete text without affecting the normal registers. When reading from this register, nothing is returned."
        },
        '"0' : {
          type : "",
          desc : 'Numbered register 0 contains the text from the most recent yank command, unless the command specified another register with ["x].'
        },
        '"1' : c.numberedRegs1to9,
        '"2' : c.numberedRegs1to9,
        '"3' : c.numberedRegs1to9,
        '"4' : c.numberedRegs1to9,
        '"5' : c.numberedRegs1to9,
        '"6' : c.numberedRegs1to9,
        '"7' : c.numberedRegs1to9,
        '"8' : c.numberedRegs1to9,
        '"9' : c.numberedRegs1to9,
        i : {
          type : "Command",
          desc : "Insert text before the cursor [count] times.\nUse Esc to exit insert mode.\nIn the game, you can't add text that is longer than the missing text. When a count is specified and the total length exceeds the length of the missing text, the count will be ignored resulting in a single text addition.",
          example : [{
            text : "This <span class='cursor'>a</span>wesome.",
            command : "<span class='command-cursor'>i</span>is &lt;Esc&gt;$3i!&lt;Esc&gt;"
          }, {
            text : "This <span class='insert-cursor'>a</span>wesome.",
            command : "<span class='command-cursor'>i</span>s &lt;Esc&gt;$3i!&lt;Esc&gt;"
          }, {
            text : "This i<span class='insert-cursor'>a</span>wesome.",
            command : "<span class='command-cursor'>s</span> &lt;Esc&gt;$3i!&lt;Esc&gt;"
          }, {
            text : "This is<span class='insert-cursor'>a</span>wesome.",
            command : "<span class='command-cursor'>&nbsp;</span>&lt;Esc&gt;$3i!&lt;Esc&gt;"
          }, {
            text : "This is <span class='insert-cursor'>a</span>wesome.",
            command : "<span class='command-cursor'>&lt;Esc&gt;</span>$3i!&lt;Esc&gt;"
          }, {
            text : "This is<span class='cursor'>&nbsp;</span>awesome.",
            command : "<span class='command-cursor'>$</span>3i!&lt;Esc&gt;"
          }, {
            text : "This is awesome<span class='cursor'>.</span>",
            command : "<span class='command-cursor'>3i</span>!&lt;Esc&gt;"
          }, {
            text : "This is awesome<span class='insert-cursor'>.</span>",
            command : "<span class='command-cursor'>!</span>&lt;Esc&gt;"
          }, {
            text : "This is awesome!<span class='insert-cursor'>.</span>",
            command : "<span class='command-cursor'>&lt;Esc&gt;</span>"
          }, {
            text : "This is awesome!!<span class='cursor'>!</span>.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        I : {
          type : "Command",
          desc : "Insert text before the first non-blank in the line [count] times.\nUse Esc to exit insert mode.\nIn the game, you can't add text that is longer than the missing text. If [count] causes such an overflow, it will be ignored.",
          example : [{
            text : "if (condition) {\n &nbsp; &nbsp;is a <span class='cursor'>c</span>omment\n &nbsp; &nbsp;doThatThingy();\n}",
            command : "<span class='command-cursor'>I</span>This &lt;Esc&gt;2I/&lt;Esc&gt;"
          }, {
            text : "if (condition) {\n &nbsp; &nbsp;<span class='insert-cursor'>i</span>s a comment\n &nbsp; &nbsp;doThatThingy();\n}",
            command : "<span class='command-cursor'>T</span>his &lt;Esc&gt;2I/&lt;Esc&gt;"
          }, {
            text : "if (condition) {\n &nbsp; &nbsp;T<span class='insert-cursor'>i</span>s a comment\n &nbsp; &nbsp;doThatThingy();\n}",
            command : "<span class='command-cursor'>h</span>is &lt;Esc&gt;2I/&lt;Esc&gt;"
          }, {
            text : "if (condition) {\n &nbsp; &nbsp;Th<span class='insert-cursor'>i</span>s a comment\n &nbsp; &nbsp;doThatThingy();\n}",
            command : "<span class='command-cursor'>i</span>s &lt;Esc&gt;2I/&lt;Esc&gt;"
          }, {
            text : "if (condition) {\n &nbsp; &nbsp;Thi<span class='insert-cursor'>i</span>s a comment\n &nbsp; &nbsp;doThatThingy();\n}",
            command : "<span class='command-cursor'>s</span> &lt;Esc&gt;2I/&lt;Esc&gt;"
          }, {
            text : "if (condition) {\n &nbsp; &nbsp;This<span class='insert-cursor'>i</span>s a comment\n &nbsp; &nbsp;doThatThingy();\n}",
            command : "<span class='command-cursor'>&nbsp;</span>&lt;Esc&gt;2I/&lt;Esc&gt;"
          }, {
            text : "if (condition) {\n &nbsp; &nbsp;This <span class='insert-cursor'>i</span>s a comment\n &nbsp; &nbsp;doThatThingy();\n}",
            command : "<span class='command-cursor'>&lt;Esc&gt;</span>2I/&lt;Esc&gt;"
          }, {
            text : "if (condition) {\n &nbsp; &nbsp;This<span class='cursor'>&nbsp;</span>is a comment\n &nbsp; &nbsp;doThatThingy();\n}",
            command : "<span class='command-cursor'>2I</span>/&lt;Esc&gt;"
          }, {
            text : "if (condition) {\n &nbsp; &nbsp;<span class='insert-cursor'>T</span>his is a comment\n &nbsp; &nbsp;doThatThingy();\n}",
            command : "<span class='command-cursor'>/</span>&lt;Esc&gt;"
          }, {
            text : "if (condition) {\n &nbsp; &nbsp;/<span class='insert-cursor'>T</span>his is a comment\n &nbsp; &nbsp;doThatThingy();\n}",
            command : "<span class='command-cursor'>&lt;Esc&gt;</span>"
          }, {
            text : "if (condition) {\n &nbsp; &nbsp;/<span class='cursor'>/</span>This is a comment\n &nbsp; &nbsp;doThatThingy();\n}",
            command : "<span class='command-cursor'></span>"
          }]
        },
        a : {
          type : "Command",
          desc : "Append text after the cursor [count] times.\nIf the cursor is in the first column of an empty line Insert starts there.\nUse Esc to exit insert mode.\nIn the game, you can't add text that is longer than the missing text. If [count] causes such an overflow, it will be ignored.",
          example : [{
            text : "myArray = <span class='cursor'>[</span> ];",
            command : "<span class='command-cursor'>a</span> 1&lt;Esc&gt;3a, 0&lt;Esc&gt;"
          }, {
            text : "myArray = [<span class='insert-cursor'> </span>];",
            command : "<span class='command-cursor'>&nbsp;</span>1&lt;Esc&gt;3a, 0&lt;Esc&gt;"
          }, {
            text : "myArray = [ <span class='insert-cursor'>&nbsp;</span>];",
            command : "<span class='command-cursor'>1</span>&lt;Esc&gt;3a, 0&lt;Esc&gt;"
          }, {
            text : "myArray = [ 1<span class='insert-cursor'> </span>];",
            command : "<span class='command-cursor'>&lt;Esc&gt;</span>3a, 0&lt;Esc&gt;"
          }, {
            text : "myArray = [ <span class='cursor'>1</span> ];",
            command : "<span class='command-cursor'>3a</span>, 0&lt;Esc&gt;"
          }, {
            text : "myArray = [ 1<span class='insert-cursor'> </span>];",
            command : "<span class='command-cursor'>,</span> 0&lt;Esc&gt;"
          }, {
            text : "myArray = [ 1,<span class='insert-cursor'> </span>];",
            command : "<span class='command-cursor'>&nbsp;</span>0&lt;Esc&gt;"
          }, {
            text : "myArray = [ 1, <span class='insert-cursor'>&nbsp;</span>];",
            command : "<span class='command-cursor'>0</span>&lt;Esc&gt;"
          }, {
            text : "myArray = [ 1, 0<span class='insert-cursor'> </span>];",
            command : "<span class='command-cursor'>&lt;Esc&gt;</span>"
          }, {
            text : "myArray = [ 1, 0, 0, <span class='cursor'>0</span> ];",
            command : "<span class='command-cursor'></span>"
          }]
        },
        A : {
          type : "Command",
          desc : "Append text at the end of the line [count] times.\nUse Esc to exit insert mode.\nIn the game, you can't add text that is longer than the missing text. When a count is specified and the total length exceeds the length of the missing text, the count will be ignored resulting in a single text addition.",
          example : [{
            text : "Hip<span class='cursor'>,</span> Hip,",
            command : "<span class='command-cursor'>3A</span> Hooray!&lt;Esc&gt;"
          }, {
            text : "Hip, Hip,<span class='insert-cursor'>&nbsp</span>",
            command : "<span class='command-cursor'>&nbsp;</span>Hooray!&lt;Esc&gt;"
          }, {
            text : "Hip, Hip, <span class='insert-cursor'>&nbsp</span>",
            command : "<span class='command-cursor'>H</span>ooray!&lt;Esc&gt;"
          }, {
            text : "Hip, Hip, H<span class='insert-cursor'>&nbsp</span>",
            command : "<span class='command-cursor'>o</span>oray!&lt;Esc&gt;"
          }, {
            text : "Hip, Hip, Ho<span class='insert-cursor'>&nbsp</span>",
            command : "<span class='command-cursor'>o</span>ray!&lt;Esc&gt;"
          }, {
            text : "Hip, Hip, Hoo<span class='insert-cursor'>&nbsp</span>",
            command : "<span class='command-cursor'>r</span>ay!&lt;Esc&gt;"
          }, {
            text : "Hip, Hip, Hoor<span class='insert-cursor'>&nbsp</span>",
            command : "<span class='command-cursor'>a</span>y!&lt;Esc&gt;"
          }, {
            text : "Hip, Hip, Hoora<span class='insert-cursor'>&nbsp</span>",
            command : "<span class='command-cursor'>y</span>!&lt;Esc&gt;"
          }, {
            text : "Hip, Hip, Hooray<span class='insert-cursor'>&nbsp</span>",
            command : "<span class='command-cursor'>!</span>&lt;Esc&gt;"
          }, {
            text : "Hip, Hip, Hooray!<span class='insert-cursor'>&nbsp</span>",
            command : "<span class='command-cursor'>&lt;Esc&gt;</span>"
          }, {
            text : "Hip, Hip, Hooray! Hooray! Hooray<span class='cursor'>!</span>",
            command : "<span class='command-cursor'></span>"
          }]
        },
        c : {
          cmd : "c{motion}",
          type : "Operator",
          desc : 'Delete (change) {motion} text [into the specified register] and start insert.\nType Esc to leave insert mode.\n"cw" and "cW" are treated like "ce" and "cE" if the cursor is on a non-blank. This is because "cw" is interpreted as change-word, and a word does not include the following white space.',
          example : [{
            text : "That was <span class='cursor'>v</span>ery nice...",
            command : "<span class='command-cursor'>cw</span>reall&lt;Esc&gt;wcWAWESOME!&lt;Esc&gt;"
          }, {
            text : "That was <span class='insert-cursor'>&nbsp;</span>nice...",
            command : "<span class='command-cursor'>r</span>eally&lt;Esc&gt;wcWAWESOME!&lt;Esc&gt;"
          }, {
            text : "That was r<span class='insert-cursor'>&nbsp;</span>nice...",
            command : "<span class='command-cursor'>e</span>ally&lt;Esc&gt;wcWAWESOME!&lt;Esc&gt;"
          }, {
            text : "That was re<span class='insert-cursor'>&nbsp;</span>nice...",
            command : "<span class='command-cursor'>a</span>lly&lt;Esc&gt;wcWAWESOME!&lt;Esc&gt;"
          }, {
            text : "That was rea<span class='insert-cursor'>&nbsp;</span>nice...",
            command : "<span class='command-cursor'>l</span>ly&lt;Esc&gt;wcWAWESOME!&lt;Esc&gt;"
          }, {
            text : "That was real<span class='insert-cursor'>&nbsp;</span>nice...",
            command : "<span class='command-cursor'>l</span>y&lt;Esc&gt;wcWAWESOME!&lt;Esc&gt;"
          }, {
            text : "That was reall<span class='insert-cursor'>&nbsp;</span>nice...",
            command : "<span class='command-cursor'>y</span>&lt;Esc&gt;wcWAWESOME!&lt;Esc&gt;"
          }, {
            text : "That was really<span class='insert-cursor'>&nbsp;</span>nice...",
            command : "<span class='command-cursor'>&lt;Esc&gt;</span>wcWAWESOME!&lt;Esc&gt;"
          }, {
            text : "That was reall<span class='cursor'>y</span> nice...",
            command : "<span class='command-cursor'>w</span>cWAWESOME!&lt;Esc&gt;"
          }, {
            text : "That was really <span class='cursor'>n</span>ice...",
            command : "<span class='command-cursor'>cW</span>AWESOME!&lt;Esc&gt;"
          }, {
            text : "That was really <span class='insert-cursor'>&nbsp</span>",
            command : "<span class='command-cursor'>A</span>WESOME!&lt;Esc&gt;"
          }, {
            text : "That was really A<span class='insert-cursor'>&nbsp</span>",
            command : "<span class='command-cursor'>W</span>ESOME!&lt;Esc&gt;"
          }, {
            text : "That was really AW<span class='insert-cursor'>&nbsp</span>",
            command : "<span class='command-cursor'>E</span>SOME!&lt;Esc&gt;"
          }, {
            text : "That was really AWE<span class='insert-cursor'>&nbsp</span>",
            command : "<span class='command-cursor'>S</span>OME!&lt;Esc&gt;"
          }, {
            text : "That was really AWES<span class='insert-cursor'>&nbsp</span>",
            command : "<span class='command-cursor'>O</span>ME!&lt;Esc&gt;"
          }, {
            text : "That was really AWESO<span class='insert-cursor'>&nbsp</span>",
            command : "<span class='command-cursor'>M</span>E!&lt;Esc&gt;"
          }, {
            text : "That was really AWESOM<span class='insert-cursor'>&nbsp</span>",
            command : "<span class='command-cursor'>E</span>!&lt;Esc&gt;"
          }, {
            text : "That was really AWESOME<span class='insert-cursor'>&nbsp</span>",
            command : "<span class='command-cursor'>!</span>&lt;Esc&gt;"
          }, {
            text : "That was really AWESOME!<span class='insert-cursor'>&nbsp</span>",
            command : "<span class='command-cursor'>&lt;Esc&gt;</span>"
          }, {
            text : "That was really AWESOME<span class='cursor'>!</span>",
            command : "<span class='command-cursor'></span>"
          }]
        },
        C : {
          type : "Command",
          desc : "Delete (change) from the cursor position to the end of the line and [count]-1 more lines [into the specified register], and start insert.\nSynonym for c$ (not linewise).\nType Esc to exit insert mode.",
          example : [{
            text : "That's <span class='cursor'>q</span>uite good.\nCan be better though.",
            command : "<span class='command-cursor'>C</span>nice.&lt;Esc&gt;B2Cgreat!&lt;Esc&gt;"
          }, {
            text : "That's <span class='insert-cursor'>&nbsp;</span>\nCan be better though.",
            command : "<span class='command-cursor'>n</span>ice.&lt;Esc&gt;B2Cgreat!&lt;Esc&gt;"
          }, {
            text : "That's n<span class='insert-cursor'>&nbsp;</span>\nCan be better though.",
            command : "<span class='command-cursor'>i</span>ce.&lt;Esc&gt;B2Cgreat!&lt;Esc&gt;"
          }, {
            text : "That's ni<span class='insert-cursor'>&nbsp;</span>\nCan be better though.",
            command : "<span class='command-cursor'>c</span>e.&lt;Esc&gt;B2Cgreat!&lt;Esc&gt;"
          }, {
            text : "That's nic<span class='insert-cursor'>&nbsp;</span>\nCan be better though.",
            command : "<span class='command-cursor'>e</span>.&lt;Esc&gt;B2Cgreat!&lt;Esc&gt;"
          }, {
            text : "That's nice<span class='insert-cursor'>&nbsp;</span>\nCan be better though.",
            command : "<span class='command-cursor'>.</span>&lt;Esc&gt;B2Cgreat!&lt;Esc&gt;"
          }, {
            text : "That's nice.<span class='insert-cursor'>&nbsp;</span>\nCan be better though.",
            command : "<span class='command-cursor'>&lt;Esc&gt;</span>B2Cgreat!&lt;Esc&gt;"
          }, {
            text : "That's nice<span class='cursor'>.</span>\nCan be better though.",
            command : "<span class='command-cursor'>B</span>2Cgreat!&lt;Esc&gt;"
          }, {
            text : "That's <span class='cursor'>n</span>ice.\nCan be better though.",
            command : "<span class='command-cursor'>2C</span>great!&lt;Esc&gt;"
          }, {
            text : "That's <span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>g</span>reat!&lt;Esc&gt;"
          }, {
            text : "That's g<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>r</span>eat!&lt;Esc&gt;"
          }, {
            text : "That's gr<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>e</span>at!&lt;Esc&gt;"
          }, {
            text : "That's gre<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>a</span>t!&lt;Esc&gt;"
          }, {
            text : "That's grea<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>t</span>!&lt;Esc&gt;"
          }, {
            text : "That's great<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>!</span>&lt;Esc&gt;"
          }, {
            text : "That's great!<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>&lt;Esc&gt;</span>"
          }, {
            text : "That's great<span class='cursor'>!</span>",
            command : "<span class='command-cursor'></span>"
          }]
        },
        cc : {
          type : "Command",
          desc : "Delete (change) [count] lines [into the specified register] and start insert (linewise).\nSynonym for S.\nType Esc to exit insert mode.",
          example : [{
            text : "One\nSe<span class='cursor'>c</span>ond\nThree\nOne more\nTwo more",
            command : "<span class='command-cursor'>cc</span>Two&lt;Esc&gt;2j2ccFour&lt;Esc&gt;"
          }, {
            text : "One\n<span class='insert-cursor'>&nbsp;</span>\nThree\nOne more\nTwo more",
            command : "<span class='command-cursor'>T</span>wo&lt;Esc&gt;2j2ccFour&lt;Esc&gt;"
          }, {
            text : "One\nT<span class='insert-cursor'>&nbsp;</span>\nThree\nOne more\nTwo more",
            command : "<span class='command-cursor'>w</span>o&lt;Esc&gt;2j2ccFour&lt;Esc&gt;"
          }, {
            text : "One\nTw<span class='insert-cursor'>&nbsp;</span>\nThree\nOne more\nTwo more",
            command : "<span class='command-cursor'>o</span>&lt;Esc&gt;2j2ccFour&lt;Esc&gt;"
          }, {
            text : "One\nTwo<span class='insert-cursor'>&nbsp;</span>\nThree\nOne more\nTwo more",
            command : "<span class='command-cursor'>&lt;Esc&gt;</span>2j2ccFour&lt;Esc&gt;"
          }, {
            text : "One\nTw<span class='cursor'>o</span>\nThree\nOne more\nTwo more",
            command : "<span class='command-cursor'>2j</span>2ccFour&lt;Esc&gt;"
          }, {
            text : "One\nTwo\nThree\nOn<span class='cursor'>e</span> more\nTwo more",
            command : "<span class='command-cursor'>2cc</span>Four&lt;Esc&gt;"
          }, {
            text : "One\nTwo\nThree\n<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>F</span>our&lt;Esc&gt;"
          }, {
            text : "One\nTwo\nThree\nF<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>o</span>ur&lt;Esc&gt;"
          }, {
            text : "One\nTwo\nThree\nFo<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>u</span>r&lt;Esc&gt;"
          }, {
            text : "One\nTwo\nThree\nFou<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>r</span>&lt;Esc&gt;"
          }, {
            text : "One\nTwo\nThree\nFour<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>&lt;Esc&gt;</span>"
          }, {
            text : "One\nTwo\nThree\nFou<span class='cursor'>r</span>",
            command : "<span class='command-cursor'></span>"
          }]
        },
        S : {
          type : "Command",
          desc : "Delete (substitute) [count] lines [into the specified register] and start insert (linewise).\nSynonym for cc.\nType Esc to exit insert mode.",
          example : [{
            text : "One\nSe<span class='cursor'>c</span>ond\nThree\nOne more\nTwo more",
            command : "<span class='command-cursor'>S</span>Two&lt;Esc&gt;2j2SFour&lt;Esc&gt;"
          }, {
            text : "One\n<span class='insert-cursor'>&nbsp;</span>\nThree\nOne more\nTwo more",
            command : "<span class='command-cursor'>T</span>wo&lt;Esc&gt;2j2SFour&lt;Esc&gt;"
          }, {
            text : "One\nT<span class='insert-cursor'>&nbsp;</span>\nThree\nOne more\nTwo more",
            command : "<span class='command-cursor'>w</span>o&lt;Esc&gt;2j2SFour&lt;Esc&gt;"
          }, {
            text : "One\nTw<span class='insert-cursor'>&nbsp;</span>\nThree\nOne more\nTwo more",
            command : "<span class='command-cursor'>o</span>&lt;Esc&gt;2j2SFour&lt;Esc&gt;"
          }, {
            text : "One\nTwo<span class='insert-cursor'>&nbsp;</span>\nThree\nOne more\nTwo more",
            command : "<span class='command-cursor'>&lt;Esc&gt;</span>2j2SFour&lt;Esc&gt;"
          }, {
            text : "One\nTw<span class='cursor'>o</span>\nThree\nOne more\nTwo more",
            command : "<span class='command-cursor'>2j</span>2SFour&lt;Esc&gt;"
          }, {
            text : "One\nTwo\nThree\nOn<span class='cursor'>e</span> more\nTwo more",
            command : "<span class='command-cursor'>2S</span>Four&lt;Esc&gt;"
          }, {
            text : "One\nTwo\nThree\n<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>F</span>our&lt;Esc&gt;"
          }, {
            text : "One\nTwo\nThree\nF<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>o</span>ur&lt;Esc&gt;"
          }, {
            text : "One\nTwo\nThree\nFo<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>u</span>r&lt;Esc&gt;"
          }, {
            text : "One\nTwo\nThree\nFou<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>r</span>&lt;Esc&gt;"
          }, {
            text : "One\nTwo\nThree\nFour<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>&lt;Esc&gt;</span>"
          }, {
            text : "One\nTwo\nThree\nFou<span class='cursor'>r</span>",
            command : "<span class='command-cursor'></span>"
          }]
        },
        s : {
          type : "Command",
          desc : 'Delete (substitute) [count] characters [into the specified register] and start insert (s stands for Substitute).\nSynonym for "cl" (not linewise).\nType Esc to exit insert mode.',
          example : [{
            text : "for (i = <span class='cursor'>0</span>; i < 10; ++i) {\n &nbsp; &nbsp;// Do somthing\n}",
            command : "<span class='command-cursor'>s</span>11&lt;Esc&gt;f12s35&lt;Esc&gt;"
          }, {
            text : "for (i = <span class='insert-cursor'>;</span> i < 10; ++i) {\n &nbsp; &nbsp;// Do somthing\n}",
            command : "<span class='command-cursor'>1</span>1&lt;Esc&gt;f12s35&lt;Esc&gt;"
          }, {
            text : "for (i = 1<span class='insert-cursor'>;</span> i < 10; ++i) {\n &nbsp; &nbsp;// Do somthing\n}",
            command : "<span class='command-cursor'>1</span>&lt;Esc&gt;f12s35&lt;Esc&gt;"
          }, {
            text : "for (i = 11<span class='insert-cursor'>;</span> i < 10; ++i) {\n &nbsp; &nbsp;// Do somthing\n}",
            command : "<span class='command-cursor'>&lt;Esc&gt;</span>f12s35&lt;Esc&gt;"
          }, {
            text : "for (i = 1<span class='cursor'>1</span>; i < 10; ++i) {\n &nbsp; &nbsp;// Do somthing\n}",
            command : "<span class='command-cursor'>f1</span>2s35&lt;Esc&gt;"
          }, {
            text : "for (i = 11; i < <span class='cursor'>1</span>0; ++i) {\n &nbsp; &nbsp;// Do somthing\n}",
            command : "<span class='command-cursor'>2s</span>35&lt;Esc&gt;"
          }, {
            text : "for (i = 11; i < <span class='insert-cursor'>;</span> ++i) {\n &nbsp; &nbsp;// Do somthing\n}",
            command : "<span class='command-cursor'>3</span>5&lt;Esc&gt;"
          }, {
            text : "for (i = 11; i < 3<span class='insert-cursor'>;</span> ++i) {\n &nbsp; &nbsp;// Do somthing\n}",
            command : "<span class='command-cursor'>5</span>&lt;Esc&gt;"
          }, {
            text : "for (i = 11; i < 35<span class='insert-cursor'>;</span> ++i) {\n &nbsp; &nbsp;// Do somthing\n}",
            command : "<span class='command-cursor'>&lt;Esc&gt;</span>"
          }, {
            text : "for (i = 11; i < 3<span class='cursor'>5</span>; ++i) {\n &nbsp; &nbsp;// Do somthing\n}",
            command : "<span class='command-cursor'></span>"
          }]
        },
        o : {
          type : "Command",
          desc : "Begin a new line below the cursor and insert text, repeat [count] times.\nType Esc to exit insert mode.",
          example : [{
            text : "&lt;u<span class='cursor'>l</span>&gt;",
            command : "<span class='command-cursor'>3o</span>&lt;li&gt;&lt;/li&gt;&lt;Esc&gt;o&lt;/ul&gt;&lt;Esc&gt;"
          }, {
            text : "&lt;ul&gt;\n<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>&lt;</span>li&gt;&lt;/li&gt;&lt;Esc&gt;o&lt;/ul&gt;&lt;Esc&gt;"
          }, {
            text : "&lt;ul&gt;\n&lt;<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>l</span>i&gt;&lt;/li&gt;&lt;Esc&gt;o&lt;/ul&gt;&lt;Esc&gt;"
          }, {
            text : "&lt;ul&gt;\n&lt;l<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>i</span>&gt;&lt;/li&gt;&lt;Esc&gt;o&lt;/ul&gt;&lt;Esc&gt;"
          }, {
            text : "&lt;ul&gt;\n&lt;li<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>&gt;</span>&lt;/li&gt;&lt;Esc&gt;o&lt;/ul&gt;&lt;Esc&gt;"
          }, {
            text : "&lt;ul&gt;\n&lt;li&gt;<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>&lt;</span>/li&gt;&lt;Esc&gt;o&lt;/ul&gt;&lt;Esc&gt;"
          }, {
            text : "&lt;ul&gt;\n&lt;li&gt;&lt;<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>/</span>li&gt;&lt;Esc&gt;o&lt;/ul&gt;&lt;Esc&gt;"
          }, {
            text : "&lt;ul&gt;\n&lt;li&gt;&lt;/<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>l</span>i&gt;&lt;Esc&gt;o&lt;/ul&gt;&lt;Esc&gt;"
          }, {
            text : "&lt;ul&gt;\n&lt;li&gt;&lt;/l<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>i</span>&gt;&lt;Esc&gt;o&lt;/ul&gt;&lt;Esc&gt;"
          }, {
            text : "&lt;ul&gt;\n&lt;li&gt;&lt;/li<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>&gt;</span>&lt;Esc&gt;o&lt;/ul&gt;&lt;Esc&gt;"
          }, {
            text : "&lt;ul&gt;\n&lt;li&gt;&lt;/li&gt;<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>&lt;Esc&gt;</span>o&lt;/ul&gt;&lt;Esc&gt;"
          }, {
            text : "&lt;ul&gt;\n&lt;li&gt;&lt;/li&gt;\n&lt;li&gt;&lt;/li&gt;\n&lt;li&gt;&lt;/li<span class='cursor'>&gt;</span>",
            command : "<span class='command-cursor'>o</span>&lt;/ul&gt;&lt;Esc&gt;"
          }, {
            text : "&lt;ul&gt;\n&lt;li&gt;&lt;/li&gt;\n&lt;li&gt;&lt;/li&gt;\n&lt;li&gt;&lt;/li&gt;\n<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>&lt;</span>/ul&gt;&lt;Esc&gt;"
          }, {
            text : "&lt;ul&gt;\n&lt;li&gt;&lt;/li&gt;\n&lt;li&gt;&lt;/li&gt;\n&lt;li&gt;&lt;/li&gt;\n&lt;<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>/</span>ul&gt;&lt;Esc&gt;"
          }, {
            text : "&lt;ul&gt;\n&lt;li&gt;&lt;/li&gt;\n&lt;li&gt;&lt;/li&gt;\n&lt;li&gt;&lt;/li&gt;\n&lt;/<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>u</span>l&gt;&lt;Esc&gt;"
          }, {
            text : "&lt;ul&gt;\n&lt;li&gt;&lt;/li&gt;\n&lt;li&gt;&lt;/li&gt;\n&lt;li&gt;&lt;/li&gt;\n&lt;/u<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>l</span>&gt;&lt;Esc&gt;"
          }, {
            text : "&lt;ul&gt;\n&lt;li&gt;&lt;/li&gt;\n&lt;li&gt;&lt;/li&gt;\n&lt;li&gt;&lt;/li&gt;\n&lt;/ul<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>&gt;</span>&lt;Esc&gt;"
          }, {
            text : "&lt;ul&gt;\n&lt;li&gt;&lt;/li&gt;\n&lt;li&gt;&lt;/li&gt;\n&lt;li&gt;&lt;/li&gt;\n&lt;/ul&gt;<span class='insert-cursor'>&nbsp;</span>",
            command : "<span class='command-cursor'>&lt;Esc&gt;</span>"
          }, {
            text : "&lt;ul&gt;\n&lt;li&gt;&lt;/li&gt;\n&lt;li&gt;&lt;/li&gt;\n&lt;li&gt;&lt;/li&gt;\n&lt;/ul<span class='cursor'>&gt;</span>",
            command : "<span class='command-cursor'></span>"
          }]
        },
        O : {
          type : "Command",
          desc : "Begin a new line above the cursor and insert text, repeat [count] times.\nType Esc to exit insert mode.",
          example : [{
            text : "<span class='cursor'>&nbsp;</span>\nA rectangle.",
            command : "<span class='command-cursor'>2O</span>#####&lt;Esc&gt;3O# &nbsp; #&lt;Esc&gt;"
          }, {
            text : "<span class='insert-cursor'>&nbsp;</span>\n\nA rectangle.",
            command : "<span class='command-cursor'>#</span>####&lt;Esc&gt;3O# &nbsp; #&lt;Esc&gt;"
          }, {
            text : "#<span class='insert-cursor'>&nbsp;</span>\n\nA rectangle.",
            command : "<span class='command-cursor'>#</span>###&lt;Esc&gt;3O# &nbsp; #&lt;Esc&gt;"
          }, {
            text : "##<span class='insert-cursor'>&nbsp;</span>\n\nA rectangle.",
            command : "<span class='command-cursor'>#</span>##&lt;Esc&gt;3O# &nbsp; #&lt;Esc&gt;"
          }, {
            text : "###<span class='insert-cursor'>&nbsp;</span>\n\nA rectangle.",
            command : "<span class='command-cursor'>#</span>#&lt;Esc&gt;3O# &nbsp; #&lt;Esc&gt;"
          }, {
            text : "####<span class='insert-cursor'>&nbsp;</span>\n\nA rectangle.",
            command : "<span class='command-cursor'>#</span>&lt;Esc&gt;3O# &nbsp; #&lt;Esc&gt;"
          }, {
            text : "#####<span class='insert-cursor'>&nbsp;</span>\n\nA rectangle.",
            command : "<span class='command-cursor'>&lt;Esc&gt;</span>3O# &nbsp; #&lt;Esc&gt;"
          }, {
            text : "#####\n####<span class='cursor'>#</span>\n\nA rectangle.",
            command : "<span class='command-cursor'>3O</span># &nbsp; #&lt;Esc&gt;"
          }, {
            text : "#####\n<span class='insert-cursor'>&nbsp;</span>\n#####\n\nA rectangle.",
            command : "<span class='command-cursor'>#</span> &nbsp; #&lt;Esc&gt;"
          }, {
            text : "#####\n#<span class='insert-cursor'>&nbsp;</span>\n#####\n\nA rectangle.",
            command : "<span class='command-cursor'>&nbsp;</span>&nbsp; #&lt;Esc&gt;"
          }, {
            text : "#####\n# <span class='insert-cursor'>&nbsp;</span>\n#####\n\nA rectangle.",
            command : "<span class='command-cursor'>&nbsp;</span> #&lt;Esc&gt;"
          }, {
            text : "#####\n# &nbsp;<span class='insert-cursor'>&nbsp;</span>\n#####\n\nA rectangle.",
            command : "<span class='command-cursor'>&nbsp;</span>#&lt;Esc&gt;"
          }, {
            text : "#####\n# &nbsp; <span class='insert-cursor'>&nbsp;</span>\n#####\n\nA rectangle.",
            command : "<span class='command-cursor'>#</span>&lt;Esc&gt;"
          }, {
            text : "#####\n# &nbsp; #<span class='insert-cursor'>&nbsp;</span>\n#####\n\nA rectangle.",
            command : "<span class='command-cursor'>&lt;Esc&gt;</span>"
          }, {
            text : "#####\n# &nbsp; #\n# &nbsp; #\n# &nbsp; <span class='cursor'>#</span>\n#####\n\nA rectangle.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        word : {
          type : "Text Object (w)",
          desc : "A word consists of a sequence of letters, digits and underscores, or a sequence of other non-blank characters, separated with white space (spaces, tabs, &lt;EOL&gt;). An empty line is also considered to be a word.\nUse 'w', 'e', and 'b' to navigate words.\nSpecial case: \"cw\" is treated like \"ce\" if the cursor is on a non-blank. This is because \"cw\" is interpreted as change-word, and a word does not include the following white space.\n\nExample: <span class='caption'>(each word is surrounded by a rectangle)</span>\n<span class='word'>while</span> <span class='word'>(</span><span class='word'>next_line1</span> <span class='word'>!==</span> <span class='word'>\"</span><span class='word'>The</span> <span class='word'>END</span><span class='word'>!\")</span> <span class='word'>do</span> <span class='word'>{</span><BR>&nbsp; <span class='word'>next_line1</span> <span class='word'>=</span> <span class='word'>readNextLine</span><span class='word'>();</span><BR><span class='word'>}</span>"
        },
        WORD : {
          type : "Text Object (W)",
          desc : "A WORD consists of a sequence of non-blank characters, separated with white space. An empty line is also considered to be a WORD.\nUse 'W', 'E', and 'B' to navigate WORDs.\nSpecial case: \"cW\" is treated like \"cE\" if the cursor is on a non-blank. This is because \"cW\" is interpreted as change-WORD, and a WORD does not include the following white space.\n\nExample: <span class='caption'>(each WORD is surrounded by a rectangle)</span>\n<span class='word'>while</span> <span class='word'>(next_line1</span> <span class='word'>!==</span> <span class='word'>\"The</span> <span class='word'>END!\")</span> <span class='word'>do</span> <span class='word'>{</span><BR>&nbsp; <span class='word'>next_line1</span> <span class='word'>=</span> <span class='word'>readNextLine();</span><BR><span class='word'>}</span>"
        },
        sentence : {
          type : "Text Object (s)",
          desc : "A sentence is defined as ending at a '.', '!' or '?' followed by either the end of a line, or by a space or tab. Any number of closing ')', ']', '\"' and ''' characters may appear after the '.', '!' or '?' before the spaces, tabs or end of line. A paragraph boundary is also a sentence boundary.\nExample: <span class='caption'>(each sentence is surrounded by a rectangle)</span>\n<span class='sentence'>This is the first sentence.</span> <span class='sentence'>Is it followed by a question?</span> <span class='sentence'>Then he said: \"Some not so long quote.\"</span> <span class='sentence'>And it all ended with a BANG!</span> <span class='sentence'>True dat.</span>\nUse '(' and ')' to navigate sentences. Sentence text object is denoted by 's'."
        },
        paragraph : {
          type : "Text Object (p)",
          desc : "A paragraph begins after each empty line. A blank line (only containing white space) is NOT a paragraph boundary.\nUse '{' and '}' to navigate paragraphs. Paragraph text objects are denoted with 'p'.\nExample: <span class='caption'>(each paragraph is surrounded by a rectangle)</span>\n<div class='paragraph'>The following paragraph will describe the correct structure of a paragraph. Here goes:</div>&nbsp;<div class='paragraph'>Topic sentence. Supporting sentence number 1. Another supporting sentence. Yet another supporting sentence. Concluding sentence.</div>"
        },
        "{" : {
          type : "Motion",
          desc : "[count] paragraphs backward.\nMove the cursor to the empty line before the current paragraph, or before the previous paragraph if the cursor isn't in a paragraph. See :help paragraph .",
          example : [{
            text : "This is a paragraph. It has nothing unusual in it. And then it ends.\n\nIt's followed by a bit of code:\n\nfunction doThatThing() {\n&nbsp; // TODO Do something\n\n&nbsp; ret<span class='cursor'>u</span>rn;\n}",
            command : "<span class='command-cursor'>{</span>2{{"
          }, {
            text : "This is a paragraph. It has nothing unusual in it. And then it ends.\n\nIt's followed by a bit of code:\n\nfunction doThatThing() {\n&nbsp; // TODO Do something\n<span class='cursor'>&nbsp;</span>\n&nbsp; return;\n}",
            command : "<span class='command-cursor'>2{</span>{"
          }, {
            text : "This is a paragraph. It has nothing unusual in it. And then it ends.\n<span class='cursor'>&nbsp;</span>\nIt's followed by a bit of code:\n\nfunction doThatThing() {\n&nbsp; // TODO Do something\n\n&nbsp; return;\n}",
            command : "<span class='command-cursor'>{</span>"
          }, {
            text : "<span class='cursor'>T</span>his is a paragraph. It has nothing unusual in it. And then it ends.\n\nIt's followed by a bit of code:\n\nfunction doThatThing() {\n&nbsp; // TODO Do something\n\n&nbsp; return;\n}",
            command : "<span class='command-cursor'></span>"
          }]
        },
        "}" : {
          type : "Motion",
          desc : "[count] paragraphs forward.\nMove the cursor to the empty line after the current paragraph, or after the next paragraph if the cursor isn't in a paragraph. See :help paragraph .",
          example : [{
            text : "This is a paragraph. It h<span class='cursor'>a</span>s nothing unusual in it. And then it ends.\n\nIt's followed by a bit of code:\n\nfunction doThatThing() {\n&nbsp; // TODO Do something\n\n&nbsp; return;\n} // End of awesome code",
            command : "<span class='command-cursor'>}</span>2}}"
          }, {
            text : "This is a paragraph. It has nothing unusual in it. And then it ends.\n<span class='cursor'>&nbsp;</span>\nIt's followed by a bit of code:\n\nfunction doThatThing() {\n&nbsp; // TODO Do something\n\n&nbsp; return;\n} // End of awesome code",
            command : "<span class='command-cursor'>2}</span>}"
          }, {
            text : "This is a paragraph. It has nothing unusual in it. And then it ends.\n\nIt's followed by a bit of code:\n\nfunction doThatThing() {\n&nbsp; // TODO Do something\n<span class='cursor'>&nbsp;</span>\n&nbsp; return;\n} // End of awesome code",
            command : "<span class='command-cursor'>}</span>"
          }, {
            text : "This is a paragraph. It has nothing unusual in it. And then it ends.\n\nIt's followed by a bit of code:\n\nfunction doThatThing() {\n&nbsp; // TODO Do something\n\n&nbsp; return;\n} // End of awesome cod<span class='cursor'>e</span>",
            command : "<span class='command-cursor'></span>"
          }]
        },
        ")" : {
          type : "Motion",
          desc : "[count] sentences forward.\nA sentence (see :help sentence) is defined as ending at a '.', '!' or '?' followed by either the end of a line, or by a space or tab. Any number of closing ')', ']', '\"' and ''' characters may appear after the '.', '!' or '?' before the spaces, tabs or end of line.\nA paragraph boundary (an empty line) is also a sentence boundary.",
          example : [{
            text : "This is the f<span class='cursor'>i</span>rst sentence. Is it followed by a question? Then he said: \"Some not so long quote.\" And it all ended with a BANG! True dat.",
            command : "<span class='command-cursor'>2)</span>)"
          }, {
            text : "This is the first sentence. Is it followed by a question? <span class='cursor'>T</span>hen he said: \"Some not so long quote.\" And it all ended with a BANG! True dat.",
            command : "<span class='command-cursor'>)</span>"
          }, {
            text : "This is the first sentence. Is it followed by a question? Then he said: \"Some not so long quote.\" <span class='cursor'>A</span>nd it all ended with a BANG! True dat.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        "(" : {
          type : "Motion",
          desc : "[count] sentences backward.\nA sentence (see :help sentence) is defined as ending at a '.', '!' or '?' followed by either the end of a line, or by a space or tab. Any number of closing ')', ']', '\"' and ''' characters may appear after the '.', '!' or '?' before the spaces, tabs or end of line.\nA paragraph boundary (an empty line) is also a sentence boundary.",
          example : [{
            text : "This is the first sentence. Is it followed by a question? Then he said: \"Some not so long quote.\" And it all ended with a B<span class='cursor'>A</span>NG! True dat.",
            command : "<span class='command-cursor'>(</span>2("
          }, {
            text : "This is the first sentence. Is it followed by a question? Then he said: \"Some not so long quote.\" <span class='cursor'>A</span>nd it all ended with a BANG! True dat.",
            command : "<span class='command-cursor'>2(</span>"
          }, {
            text : "This is the first sentence. <span class='cursor'>I</span>s it followed by a question? Then he said: \"Some not so long quote.\" And it all ended with a BANG! True dat.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        "[{" : c.unmatchedBracket,
        "[(" : c.unmatchedBracket,
        "]}" : c.unmatchedBracket,
        "])" : c.unmatchedBracket,
        "text-objects" : {
          cmd : "text-objects",
          type : "",
          desc : "Text objects are two characters used after an operator ('d', 'y', 'c' etc.) to select a range to operate on. The first character is either 'a' (for \"an object\", including white space) or 'i' (for \"inner\" object, without surrounding white space, or only the white space). The second character denotes the object type and is one of the following:\n<span class='abbr'>w</span>ord, <span class='abbr'>W</span>ORD, <span class='abbr'>s</span>entence, <span class='abbr'>p</span>aragraph, <span class='abbr'><BR>\"</span> or <span class='abbr'>'</span> or <span class='abbr'>`</span> - a \", ', or ` quoted string<BR><span class='abbr'>{</span>, <span class='abbr'>}</span>, or <span class='abbr'>B</span> - A { } block<BR><span class='abbr'>(</span>, <span class='abbr'>)</span>, or <span class='abbr'>b</span> - A ( ) block<BR><span class='abbr'>[</span> or <span class='abbr'>]</span> - A [ ] block<BR><span class='abbr'>&lt;</span> or <span class='abbr'>&gt;</span> - A &lt; &gt; block<BR><span class='abbr'>t</span> - A HTML or XML tag block\nType :help followed by any text object (e.g. ap, a{, i' etc.) for examples."
        },
        aw : {
          cmd : "aw",
          type : "a word",
          desc : "Text object to select [count] words (see :help word). Leading or trailing white space is included, but not counted.\nAs in all non-block text object, selection includes the word and the white space after it. If there is no white space after it, or when the cursor was in the white space before the word, the white space before the word is included.\n\nExamples: <span class='caption'>(selected text is surrounded by square)</span>\n\naw : <span class='text-object-range'>se<span class='cursor'>l</span>ect </span>a word.<BR>aw : no trailing<span class='text-object-range'> spa<span class='cursor'>c</span>es</span>.<BR>aw : on a leading<span class='text-object-range'>&nbsp;<span class='cursor'>&nbsp;</span>white</span> space.<BR>3aw : now <span class='text-object-range'>wit<span class='cursor'>h</span> a count </span>of 3."
        },
        iw : {
          cmd : "iw",
          type : "inner word",
          desc : "Text object to select [count] words (see :help word). White space between words is counted too.\n\nAs in all non-block inner text objects, if the cursor was on the word, the selection applies to the word and if the cursor was on white space, the selection applies to the white space.\n\nExamples: <span class='caption'>(selected text is surrounded by square)</span>\n\niw : <span class='text-object-range'>se<span class='cursor'>l</span>ect</span> inner word.<BR>iw : on&nbsp;&nbsp;&nbsp;a<span class='text-object-range'>&nbsp;<span class='cursor'>&nbsp;</span>&nbsp;</span>space.<BR>3iw : white <span class='text-object-range'>spac<span class='cursor'>e</span>s are</span> also counted.<BR>3iw : now<span class='text-object-range'>&nbsp;<span class='cursor'>&nbsp</span>on </span>a leading white space."
        },
        aW : {
          cmd : "aW",
          type : "a WORD",
          desc : "Text object to select [count] WORDs (see :help WORD). Leading or trailing white space is included, but not counted.\nAs in all non-block text objects, selection includes the WORD and the white space after it. If there is no white space after it, or when the cursor was in the white space before the WORD, the white space before the WORD is included.\n\nExamples: <span class='caption'>(selected text is surrounded by square)</span>\n\naW : <span class='text-object-range'>se<span class='cursor'>l</span>ect(!) </span>a WORD.<BR>aW : no trailing<span class='text-object-range'> spa<span class='cursor'>c</span>es.</span><BR>aW : on a leading<span class='text-object-range'>&nbsp;<span class='cursor'>&nbsp;</span>white-space.</span> Yeah.<BR>3aW : <span class='text-object-range'>wit<span class='cursor'>h</span> a-too-accurate count </span>of 3."
        },
        iW : {
          cmd : "iW",
          type : "inner WORD",
          desc : "Text object to select [count] WORDs (see :help WORD). White space between WORDs is counted too.\n\nAs in all non-block inner text objects, if the cursor was on the WORD, the selection applies to the WORD and if the cursor was on white space, the selection applies to the white space.\n\nExamples: <span class='caption'>(selected text is surrounded by square)</span>\n\niW : <span class='text-object-range'>se<span class='cursor'>l</span>ect?!</span> inner WORD.<BR>iW : on&nbsp;&nbsp;&nbsp;a<span class='text-object-range'>&nbsp;<span class='cursor'>&nbsp;</span>&nbsp;</span>space.<BR>3iW : the <span class='text-object-range'>white-spac<span class='cursor'>e</span>s are</span> also counted.<BR>3iW : now <span class='text-object-range'>&nbsp;<span class='cursor'>&nbsp</span> *on* </span>a leading white space."
        },
        as : {
          cmd : "as",
          type : "a sentence",
          desc : "Text object to select [count] sentences (see :help sentence).\nAs in all non-block text objects, selection includes the sentence and the white space after it. If there is no white space after it, or when the cursor was in the white space before the sentence, the white space before the sentence is included.\n\nExamples: <span class='caption'>(selected text is surrounded by square)</span>\n\nas : Hello! <span class='text-object-range'>I am <span class='cursor'>a</span> sentence. </span>Bye.<BR>as : Hello! I am a sentence.<span class='text-object-range'> By<span class='cursor'>e</span>.</span><BR>as : Hello!<span class='text-object-range'>&nbsp;<span class='cursor'>&nbsp;</span>I am a sentence.</span> Bye.<BR>2as : <span class='text-object-range'>Hell<span class='cursor'>o</span>! I am a sentence. </span>Bye."
        },
        is : {
          cmd : "is",
          type : "inner sentence",
          desc : "Text object to select [count] sentences (see :help sentence).\nAs in all non-block inner text objects, if the cursor was on the sentence, the selection applies to the sentence and if the cursor was on white space, the selection applies to the white space.\n\nExamples: <span class='caption'>(selected text is surrounded by square)</span>\n\nis : Hello! <span class='text-object-range'>I am <span class='cursor'>a</span> sentence.</span> Bye.<BR>is : Hello! I am a sentence. <span class='text-object-range'>By<span class='cursor'>e</span>.</span><BR>is : Hello!<span class='text-object-range'>&nbsp;<span class='cursor'>&nbsp;</span></span>I am a sentence. Bye.<BR>2is : <span class='text-object-range'>Hell<span class='cursor'>o</span>! </span>I am a sentence. Bye."
        },
        ap : {
          cmd : "ap",
          type : "a paragraph",
          desc : "Text object to select [count] paragraphs (see :help paragraph).\nA blank line (only containing white space) is also a paragraph boundary.\nExamples: <span class='caption'>(selected text is surrounded by square)</span>\n<div class='text-object-range'>This paragraph is selected with <span class='abbr'>ap</span>. It a<span class='cursor'>l</span>so includes the trailing white space (the blank link).<BR><BR></div>Very short paragraph.<BR><div class='text-object-range'><span class='cursor'>&nbsp;</span><BR>This paragraph, the next one, and the preceding white space were all selected with <span class='abbr'>2ap</span>. The white space was included because the cursor was in it, but also because there is no white space after the second paragraph.<BR><BR>Yet another paragraph.</div>"
        },
        ip : {
          cmd : "ip",
          type : "inner paragraph",
          desc : "Text object to select [count] paragraphs (see :help paragraph).\nA blank line (only containing white space) is also a paragraph boundary.\nExamples: <span class='caption'>(selected text is surrounded by square)</span>\n<div class='text-object-range'>This paragraph is selected with <span class='abbr'>ip</span>. It d<span class='cursor'>o</span>esn't include the trailing white space (the blank link).</div><BR>Very short paragraph.<BR><div class='text-object-range'><span class='cursor'>&nbsp;</span><BR></div>The empty line above was selected using <span class='abbr'>ip</span> and includes only the white space.<BR><BR><div class='text-object-range'>This paragraph, the following white space, and <span class='cursor'>t</span>he paragraph after that are all selected with <span class='abbr'>3ip</span>.<BR><BR>Yet another paragraph.</div>"
        },
        "a[" : {
          cmd : "a[<span class='caption'>,</span> a]",
          type : "a [] block",
          desc : "Text object to select [count] '[' ']' blocks. This goes backwards to the [count] unclosed '[', and finds the matching ']'. The enclosed text is selected, including the '[' and ']'.\nExamples: <span class='caption'>(selected text is surrounded by square)</span>\n// Block selected with <span class='abbr'>a[</span><BR>var vowels = <span class='text-object-range'>['a','e'<span class='cursor'>,</span>'i','o','u']</span>;<BR><BR>// The following was selected with <span class='abbr'>2a]</span><BR>var multiArr = <span class='text-object-range'>[<BR>&nbsp; [ \"x\", \"o\", \"x\" ],<BR>&nbsp; [ \"o\", \"<span class='cursor'>x</span>\", \"o\" ],<BR>&nbsp; [ \"x\", \"o\", \"x\" ]<BR>]</span>;"
        },
        "i[" : {
          cmd : "i[<span class='caption'>,</span> i]",
          type : "inner [] block",
          desc : "Text object to select [count] '[' ']' blocks. This goes backwards to the [count] unclosed '[', and finds the matching ']'. The enclosed text is selected, excluding the '[' and ']'.\nExamples: <span class='caption'>(selected text is surrounded by square)</span>\n// Block selected with <span class='abbr'>i[</span><BR>var vowels = [<span class='text-object-range'>'a','e'<span class='cursor'>,</span>'i','o','u'</span>];<BR><BR>// The following was selected with <span class='abbr'>2i]</span><BR>var multiArr = [<BR><span class='text-object-range'>&nbsp; [ \"x\", \"o\", \"x\" ],<BR>&nbsp; [ \"o\", \"<span class='cursor'>x</span>\", \"o\" ],<BR>&nbsp; [ \"x\", \"o\", \"x\" ]</span><BR>];"
        },
        "a(" : {
          cmd : "a(<span class='caption'>,</span> a)<span class='caption'>,</span> ab",
          type : "a block",
          desc : "Text object to select [count] blocks, from \"[count] [(\" to the matching ')', including the '(' and ')' (see ':help [('). Does not include white space outside of the parenthesis.\nExamples: <span class='caption'>(selected text is surrounded by square)</span>\n// Condition below is selected with <span class='abbr'>a(</span><BR>while <span class='text-object-range'>(a<3 && b>5<span class='cursor'>&nbsp;</span>|| c==7)</span> {<BR>&nbsp console.log('Something is fishy!');<BR>}<BR><BR>// The following was selected with <span class='abbr'>3a)</span><BR><span class='text-object-range'>(function execRightAway() {<BR>&nbsp; alert('Password is ' + (2<span class='cursor'>+</span>5)*3);<BR>}())</span>;"
        },
        "i(" : {
          cmd : "i(<span class='caption'>,</span> i)<span class='caption'>,</span> ib",
          type : "inner block",
          desc : "Text object to select [count] blocks, from \"[count] [(\" to the matching ')', excluding the '(' and ')' (see ':help [(').\nExamples: <span class='caption'>(selected text is surrounded by square)</span>\n// Condition below is selected with <span class='abbr'>i(</span><BR>while (<span class='text-object-range'>a<3 && b>5<span class='cursor'>&nbsp;</span>|| c==7</span>) {<BR>&nbsp console.log('Something is fishy!');<BR>}<BR><BR>// The following was selected with <span class='abbr'>3i)</span><BR>(<span class='text-object-range'>function execRightAway() {<BR>&nbsp; alert('Password is ' + (2<span class='cursor'>+</span>5)*3);<BR>}()</span>);"
        },
        "a<" : {
          cmd : "a&lt;<span class='caption'>,</span> a&gt;",
          type : "a &lt;&gt; block",
          desc : "Text object to select [count] &lt;&gt; blocks, from the [count]'th unmatched '&lt;' backwards to the matching '&gt;', including the '&lt;' and '&gt;'.\nFor more convenient editing of HTML &amp; XML, check out the help for the tag text object ('it' or 'at').\nExamples: <span class='caption'>(selected text is surrounded by square)</span>\n// The following was selected with <span class='abbr'>a&gt;</span><BR>m = std::map<span class='text-object-range'>&lt;int, <span class='cursor'>s</span>tring&gt;</span>;<BR><BR>The following was selected with <span class='abbr'>2a&lt;</span><BR><span class='text-object-range'>&lt;!--<BR>&nbsp; &lt;script&gt;<BR>&nbsp; &nbsp; // Here goes the script!<BR>&nbsp; &lt;/scri<span class='cursor'>p</span>t&gt;<BR> --&gt;</span><BR>"
        },
        "i<" : {
          cmd : "i&lt;<span class='caption'>,</span> i&gt;",
          type : "inner &lt;&gt; block",
          desc : "Text object to select [count] &lt;&gt; blocks, from the [count]'th unmatched '&lt;' backwards to the matching '&gt;', excluding the '&lt;' and '&gt;'.\nFor more convenient editing of HTML &amp; XML, check out the help for the tag text object ('it' or 'at').\nExamples: <span class='caption'>(selected text is surrounded by square)</span>\n// The following was selected with <span class='abbr'>i&gt;</span><BR>m = std::map&lt;<span class='text-object-range'>int, <span class='cursor'>s</span>tring</span>&gt;;<BR><BR>The following was selected with <span class='abbr'>2i&lt;</span><BR>&lt;<span class='text-object-range'>!--<BR>&nbsp; &lt;script&gt;<BR>&nbsp; &nbsp; // Here goes the script!<BR>&nbsp; &lt;/scri<span class='cursor'>p</span>t&gt;<BR> --</span>&gt;<BR>"
        },
        at : {
          type : "a tag block",
          desc : "Text object to select [count] tag blocks, from the [count]'th unmatched \"&lt;aaa&gt;\" backwards to the matching \"&lt;/aaa&gt;\", including the \"&lt;aaa&gt;\" and \"&lt;/aaa&gt;\". Not implemented in this game.\nExamples: <span class='caption'>(selected text is surrounded by square)</span>\n<div style='font-size: 0.9em; line-height: 160%;'>&lt;dialog&gt;<BR>&nbsp; <span class='text-object-range'>&lt;movie&gt;<BR>&nbsp; &nbsp; &lt;name&gt;Pul<span class='cursor'>p</span> Fi<span class='tobj-range-tip-location'>c<span class='tobj-range-tip'>2at</span></span>tion&lt;/name&gt;<BR>&nbsp; &nbsp; &lt;year&gt;1994&lt;/year&gt;<BR>&nbsp; &lt;/movie&gt;</span><BR>&nbsp; &lt;line&gt;Whose motorcycle is this?&lt;/line&gt;<BR>&nbsp; &lt;line&gt;It's a chopper, baby.&lt;/line&gt;<BR>&nbsp; <span class='text-object-range'>&lt;line&gt;Whose chopper <span class='cursor'>i</span>s t<span class='tobj-range-tip-location'>h<span class='tobj-range-tip-down'>at</span></span>is?&lt;/line&gt;</span><BR>&nbsp; &lt;line&gt;It's Zed's.&lt;/line&gt;<BR>&nbsp; &lt;line&gt;Who's Zed?&lt;/line&gt;<BR>&nbsp; &lt;line&gt;Zed's dead, baby. Zed's dead.&lt;/line&gt;<BR>&lt;/dialog&gt;</div>"
        },
        it : {
          type : "inner tag block",
          desc : "Text object to select [count] tag blocks, from the [count]'th unmatched \"&lt;aaa&gt;\" backwards to the matching \"&lt;/aaa&gt;\", excluding the \"&lt;aaa&gt;\" and \"&lt;/aaa&gt;\". Not implemented in this game.\nExamples: <span class='caption'>(selected text is surrounded by square)</span>\n<div style='font-size: 0.9em; line-height: 160%;'>&lt;dialog&gt;<BR>&nbsp; &lt;movie&gt;<span class='text-object-range'>&nbsp;<BR>&nbsp; &nbsp; &lt;name&gt;Pul<span class='cursor'>p</span> Fi<span class='tobj-range-tip-location'>c<span class='tobj-range-tip'>2it</span></span>tion&lt;/name&gt;<BR>&nbsp; &nbsp; &lt;year&gt;1994&lt;/year&gt;<BR>&nbsp; </span>&lt;/movie&gt;<BR>&nbsp; &lt;line&gt;Whose motorcycle is this?&lt;/line&gt;<BR>&nbsp; &lt;line&gt;It's a chopper, baby.&lt;/line&gt;<BR>&nbsp; &lt;line&gt;<span class='text-object-range'>Whose chopper <span class='cursor'>i</span>s t<span class='tobj-range-tip-location'>h<span class='tobj-range-tip-down'>it</span></span>is?</span>&lt;/line&gt;<BR>&nbsp; &lt;line&gt;It's Zed's.&lt;/line&gt;<BR>&nbsp; &lt;line&gt;Who's Zed?&lt;/line&gt;<BR>&nbsp; &lt;line&gt;Zed's dead, baby. Zed's dead.&lt;/line&gt;<BR>&lt;/dialog&gt;</div>"
        },
        "a{" : {
          cmd : "a{<span class='caption'>,</span> a}<span class='caption'>,</span> aB",
          type : "a Block",
          desc : "Text object to select [count] Blocks, from \"[count] [{\" to the matching '}', including the '{' and '}' (see ':help [{').\nExamples: <span class='caption'>(selected text is surrounded by square)</span>\nvar myModule = (function() {<BR>&nbsp; &nbsp; var privateVar = 3;<BR>&nbsp; &nbsp; function privateFunc() <span class='text-object-range'>{<BR>&nbsp; &nbsp; &nbsp; &nbsp; var i;<BR>&nbsp; &nbsp; &nbsp; &nbsp; for (i = 0; i < 5; ++i) {<BR>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; privateVar += (i <span class='cursor'>*</span> <span class='tobj-range-tip-location'>2<span class='tobj-range-tip-down'>2a{</span></span> + 3);<BR>&nbsp; &nbsp; &nbsp; &nbsp; }<BR>&nbsp; &nbsp; }</span><BR>&nbsp; &nbsp; return <span class='text-object-range'>{<BR>&nbsp; &nbsp; &nbsp; &nbsp; doMath <span class='cursor'>:</span> pri<span class='tobj-range-tip-location'>v<span class='tobj-range-tip'>a}</span></span>ateFunc<BR>&nbsp; &nbsp; }</span>;<BR>}());"
        },
        "i{" : {
          cmd : "i{<span class='caption'>,</span> i}<span class='caption'>,</span> iB",
          type : "inner Block",
          desc : "Text object to select [count] Blocks, from \"[count] [{\" to the matching '}', excluding the '{' and '}' (see ':help [{').\nExamples: <span class='caption'>(selected text is surrounded by square)</span>\nvar myModule = (function() {<BR>&nbsp; &nbsp; var privateVar = 3;<BR>&nbsp; &nbsp; function privateFunc() {<span class='text-object-range'>&nbsp;<BR>&nbsp; &nbsp; &nbsp; &nbsp; var i;<BR>&nbsp; &nbsp; &nbsp; &nbsp; for (i = 0; i < 5; ++i) {<BR>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; privateVar += (i <span class='cursor'>*</span> <span class='tobj-range-tip-location'>2<span class='tobj-range-tip-down'>2i{</span></span> + 3);<BR>&nbsp; &nbsp; &nbsp; &nbsp; }<BR>&nbsp; &nbsp; </span>}<BR>&nbsp; &nbsp; return {<span class='text-object-range'>&nbsp;<BR>&nbsp; &nbsp; &nbsp; &nbsp; doMath <span class='cursor'>:</span> pri<span class='tobj-range-tip-location'>v<span class='tobj-range-tip'>i}</span></span>ateFunc<BR>&nbsp; &nbsp; </span>};<BR>}());"
        },
        'a"' : {
          cmd : "a\"<span class='caption'>,</span> a'<span class='caption'>,</span> a`",
          type : "a quoted string",
          desc : "Selects the text from the previous quote until the next quote.\nOnly works within one line. A count is currently not used. If a quote can't be found before or under the cursor, one is searched for down the line. When the cursor starts on a quote, Vim will figure out which quote pairs form a string by searching from the start of the line. Any trailing white space is included, unless there is none, then leading white space is included.\nExamples: <span class='caption'>(selected text is surrounded by square)</span>\na\" : a<span class='cursor'>l</span>ert(<span class='text-object-range'>\"What's up doc\" </span>+ \"?\");<BR>a' : alert('Hip Hip<span class='text-object-range'>' <span class='cursor'>+</span> ' </span>Horray!');<BR>a' : alert(<span class='text-object-range'>'Hip Hip<span class='cursor'>'</span>&nbsp;</span>+ ' Horray!');<BR>a` : echo<span class='text-object-range'> `se<span class='cursor'>q</span> 1 5`</span>?"
        },
        'i"' : {
          cmd : "i\"<span class='caption'>,</span> i'<span class='caption'>,</span> i`",
          type : "inner<BR>quoted string",
          desc : "Just like a\", a' and a`, but excludes the quotes.\nUnlike a\", a' and a` count is supported in VIM, but not in this game.\nExamples: <span class='caption'>(selected text is surrounded by square)</span>\ni\" : a<span class='cursor'>l</span>ert(\"<span class='text-object-range'>What's up doc</span>\" + \"?\");<BR>a' : alert('Hip Hip'<span class='text-object-range'>&nbsp<span class='cursor'>+</span>&nbsp;</span>' Horray!');<BR>i' : alert('<span class='text-object-range'>Hip Hip</span><span class='cursor'>'</span> + ' Horray!');<BR>a` : echo `<span class='text-object-range'>se<span class='cursor'>q</span> 1 5</span>`?"
        },
        "." : {
          type : "Command",
          desc : "Repeat the last simple change. Without a count, the count of the last change is used. If you enter a count, it will replace the last one.\nIf the last change included a specification of a numbered register, the register number will be incremented.\nDoes not repeat a command-line command.",
          example : [{
            text : "function <span class='cursor'>a</span>Func();\nfunction anotherOne();",
            command : "<span class='command-cursor'>A</span>&lt;Backspace&gt; {&lt;Enter&gt;}&lt;Esc&gt;j."
          }, {
            text : "function aFunc();<span class='insert-cursor'>&nbsp;</span>\nfunction anotherOne();",
            command : "<span class='command-cursor'>&lt;Backspace&gt;</span> {&lt;Enter&gt;}&lt;Esc&gt;j."
          }, {
            text : "function aFunc()<span class='insert-cursor'>&nbsp;</span>\nfunction anotherOne();",
            command : "<span class='command-cursor'>&nbsp;</span>{&lt;Enter&gt;}&lt;Esc&gt;j."
          }, {
            text : "function aFunc() <span class='insert-cursor'>&nbsp;</span>\nfunction anotherOne();",
            command : "<span class='command-cursor'>{</span>&lt;Enter&gt;}&lt;Esc&gt;j."
          }, {
            text : "function aFunc() {<span class='insert-cursor'>&nbsp;</span>\nfunction anotherOne();",
            command : "<span class='command-cursor'>&lt;Enter&gt;</span>}&lt;Esc&gt;j."
          }, {
            text : "function aFunc() {\n<span class='insert-cursor'>&nbsp;</span>\nfunction anotherOne();",
            command : "<span class='command-cursor'>}</span>&lt;Esc&gt;j."
          }, {
            text : "function aFunc() {\n}<span class='insert-cursor'>&nbsp;</span>\nfunction anotherOne();",
            command : "<span class='command-cursor'>&lt;Esc&gt;</span>}j."
          }, {
            text : "function aFunc() {\n<span class='cursor'>}</span>\nfunction anotherOne();",
            command : "<span class='command-cursor'>j</span>."
          }, {
            text : "function aFunc() {\n}\n<span class='cursor'>f</span>unction anotherOne();",
            command : "<span class='command-cursor'>.</span>"
          }, {
            text : "function aFunc() {\n}\nfunction anotherOne() {\n<span class='cursor'>}</span>",
            command : "<span class='command-cursor'></span>"
          }]
        },
        H : {
          type : "Motion",
          desc : "To line [count] from first line on the window (<span class='target-location'>H</span>igh) on the first non-blank character (linewise), without scrolling the screen.\nIn this game, if the first line of the text is visible on the screen use it instead of the first line on the window.",
          example : [{
            text : "This is a very <span class='cursor'>l</span>ong file.\nIt has a lot more than four lines.\nThese are only the first four.\nForth line, more below...",
            command : "<span class='command-cursor'>3H</span>GH"
          }, {
            text : "This is a very long file.\nIt has a lot more than four lines.\n<span class='cursor'>T</span>hese are only the first four.\nForth line, more below...",
            command : "<span class='command-cursor'>G</span>H"
          }, {
            text : "The last four lines in the file.\nThird from last.\nAlmost there.\n<span class='cursor'>T</span>here. Last.",
            command : "<span class='command-cursor'>H</span>"
          }, {
            text : "<span class='cursor'>T</span>he last four lines in the file.\nThird from last.\nAlmost there.\nThere. Last.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        M : {
          type : "Motion",
          desc : "To <span class='target-location'>M</span>iddle line of window, on the first non-blank character (linewise), without scrolling the screen.\nIn this game, if either of the first line of the text, the last line of the text, or both are visible on the screen use them instead of the first and last line of the window for calculating the middle.",
          example : [{
            text : "This is a very <span class='cursor'>l</span>ong file.\nIt has a lot more than five lines.\nThese are only the first five.\nForth line.\nMore below...",
            command : "<span class='command-cursor'>M</span>GM"
          }, {
            text : "This is a very long file.\nIt has a lot more than five lines.\n<span class='cursor'>T</span>hese are only the first five.\nForth line.\nMore below...",
            command : "<span class='command-cursor'>G</span>M"
          }, {
            text : "The last five lines in the file.\nThird from last.\nAlmost there.\nAlmost there.\n<span class='cursor'>L</span>ast line.",
            command : "<span class='command-cursor'>M</span>"
          }, {
            text : "The last five lines in the file.\nThird from last.\n<span class='cursor'>A</span>lmost there.\nAlmost there.\nLast line.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        L : {
          type : "Motion",
          desc : "To line [count] from bottom of the window (<span class='target-location'>L</span>ow) on the first non-blank character (linewise), without scrolling the screen.\nIn this game, if the last line of the text is visible on the screen use it instead of the bottom line on the window.",
          example : [{
            text : "<span class='cursor'>T</span>he last four lines in the file.\nThird from last.\nAlmost there.\nThere. Last.",
            command : "<span class='command-cursor'>2L</span>ggL"
          }, {
            text : "The last four lines in the file.\nThird from last.\n<span class='cursor'>A</span>lmost there.\nThere. Last.",
            command : "<span class='command-cursor'>gg</span>L"
          }, {
            text : "<span class='cursor'>T</span>his is a very long file.\nIt has a lot more than four lines.\nThese are only the first four.\nForth line, more below...",
            command : "<span class='command-cursor'>L</span>"
          }, {
            text : "This is a very long file.\nIt has a lot more than four lines.\nThese are only the first four.\n<span class='cursor'>F</span>orth line, more below...",
            command : "<span class='command-cursor'></span>"
          }]
        },
        nu : c.setnuDesc,
        "\\nu" : c.setnuDesc,
        nonu : c.setnuDesc,
        "nu!" : c.setnuDesc,
        "nonu!" : c.setnuDesc,
        "|" : {
          type : "<span class='caption'>(bar or pipe)</span> Motion",
          desc : "To column [count] in the current line.",
          example : [{
            text : "Where have all the <span class='cursor'>m</span>otions gone?",
            command : "<span class='command-cursor'>|</span>3|"
          }, {
            text : "<span class='cursor'>W</span>here have all the motions gone?",
            command : "<span class='command-cursor'>3|</span>"
          }, {
            text : "Wh<span class='cursor'>e</span>re have all the motions gone?",
            command : "<span class='command-cursor'></span>"
          }]
        },
        "/" : c.freesearchCmdDesc,
        "?" : c.freesearchCmdDesc,
        "/?" : c.freesearchCmdDesc,
        "`" : {
          cmd : "`{mark}",
          type : "Motion <span class='caption'>(or movement)</span>",
          desc : "Jump to the specified mark.\nWith local marks that are found in the current text such as lower case letters, it can be used as a motion in commands.<BR>When used with global marks found in a different text or buffer (such as captial letters), the cursor jumps to the mark, changing texts (buffers) in the process.\n:marks lists all the current marks.",
          example : [{
            text : "To und<span class='cursor'>e</span>rstand what recursion is,<BR>you mus<span class='target-location'>t<span class='target-location-tip-down three-letters'>&nbsp;R&nbsp;</span></span> first understand recursion.",
            command : "<span class='command-cursor'>`D</span>d`b`R"
          }, {
            text : "Two &nbsp; roads diverged in a yellow wood,<BR>And <span class='target-location'><span class='cursor'>b</span><span class='target-location-tip three-letters'>&nbsp;D&nbsp;</span></span>oth seemed very very nice,<BR>so <span class='target-location'>s<span class='target-location-tip-down three-letters'>&nbsp;b&nbsp;</span></span>orry I could not travel both",
            command : "<span class='command-cursor'>d`b</span>`R"
          }, {
            text : "Two &nbsp; roads diverged in a yellow wood,<BR>And <span class='target-location'><span class='cursor'>s</span><span class='target-location-tip three-letters'>&nbsp;D&nbsp;</span></span>or<span class='target-location'>r<span class='target-location-tip-down three-letters'>&nbsp;b&nbsp;</span></span>y I could not travel both<BR>And be one traveler, long I stood",
            command : "<span class='command-cursor'>`R</span>"
          }, {
            text : "To understand what recursion is,<BR>you mus<span class='target-location'><span class='cursor'>t</span><span class='target-location-tip-down three-letters'>&nbsp;R&nbsp;</span></span> first understand recursion.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        "'" : {
          cmd : "'{mark}",
          type : "Motion <span class='caption'>(or movement)</span>",
          desc : "Jump to the first non-blank character in the line of the specified mark.\nWith local marks that are found in the current text such as lower case letters, it can be used as a <b>linewise</b> motion.<BR>When used with global marks found in a different text or buffer (such as captial letters), the cursor jumps to the mark, changing texts (buffers) in the process.\n:marks lists all the current marks.",
          example : [{
            text : "To und<span class='cursor'>e</span>rstand what recursion is,<BR>you mus<span class='target-location'>t<span class='target-location-tip-down three-letters'>&nbsp;R&nbsp;</span></span> first understand recursion.",
            command : "<span class='command-cursor'>'D</span>d'b'R"
          }, {
            text : "Two &nbsp; roads diverged in a yellow wood,<BR><span class='cursor'>A</span>nd <span class='target-location'>b<span class='target-location-tip three-letters'>&nbsp;D&nbsp;</span></span>oth seemed very very nice,<BR>so <span class='target-location'>s<span class='target-location-tip-down three-letters'>&nbsp;b&nbsp;</span></span>orry I could not travel both",
            command : "<span class='command-cursor'>d'b</span>'R"
          }, {
            text : "Two &nbsp; roads diverged in a yellow wood,<BR><span class='cursor'>A</span>nd <span class='target-location'>b<span class='target-location-tip three-letters'>&nbsp;D&nbsp;</span></span>e one traveler, long I stood<BR>And looked down one as far as I could",
            command : "<span class='command-cursor'>'R</span>"
          }, {
            text : "To understand what recursion is,<BR><span class='cursor'>y</span>ou mus<span class='target-location'>t<span class='target-location-tip-down three-letters'>&nbsp;R&nbsp;</span></span> first understand recursion.",
            command : "<span class='command-cursor'></span>"
          }]
        },
        m : {
          cmd : "m{mark}",
          type : "Command",
          desc : "Set a mark at cursor position (shown as a flag, but is invisible in VIM).\nLocal marks such as lower case a - z are private to the current text and can mark different locations in different texts at the same time.\nGlobal marks, such as capital A - Z are unique and save also the filename or buffer. A new global mark will always replace the existing one if any.",
          example : [{
            text : "Always remember: X marks the <span class='cursor'>s</span>pot!",
            command : "<span class='command-cursor'>mX</span>:b#&lt;Enter&gt;`X"
          }, {
            text : "Always remember: X marks the <span class='target-location'><span class='cursor'>s</span><span class='target-location-tip three-letters'>&nbsp;X&nbsp;</span></span>pot!",
            command : "<span class='command-cursor'>:b#&lt;Enter&gt;</span>`X"
          }, {
            text : "Some other file in a<span class='cursor'>n</span>other buffer...",
            command : "<span class='command-cursor'>`X</span>"
          }, {
            text : "Always remember: X marks the <span class='target-location'><span class='cursor'>s</span><span class='target-location-tip three-letters'>&nbsp;X&nbsp;</span></span>pot!",
            command : "<span class='command-cursor'></span>"
          }]
        },
        marks : c.colonMarks,
        ":marks" : c.colonMarks,
        delm : c.colonDelmarks,
        "delm!" : c.colonDelmarks,
        "delmarks!" : c.colonDelmarks,
        delmarks : c.colonDelmarks,
        ":delm" : c.colonDelmarks,
        ":delm!" : c.colonDelmarks,
        ":delmarks!" : c.colonDelmarks,
        ":delmarks" : c.colonDelmarks,
        u : c.undo,
        ":u" : c.undo,
        ":undo" : c.undo,
        undo : c.undo,
        "CTRL-R" : c.redo,
        "ctrl-r" : c.redo,
        "CTRL-r" : c.redo,
        "CTRL+R" : c.redo,
        "ctrl+r" : c.redo,
        "CTRL+r" : c.redo,
        ":redo" : c.redo,
        redo : c.redo,
        red : c.redo,
        ":red" : c.redo
      };
    }
    if (v === "[]") {
      /** @type {string} */
      v = "[{";
    }
    if (v === "{}") {
      /** @type {string} */
      v = "}";
    }
    if (v === "()") {
      /** @type {string} */
      v = ")";
    }
    if (v === "ai" || v === "ia" || v === "\\ia") {
      /** @type {string} */
      v = "text-objects";
    }
    if (v.length === 2 && (v.charAt(0) === "a" || v.charAt(0) === "i")) {
      ["[]", "()", "{}", "<>", "(b", "{B", '"`', "\"'"].forEach(function(hashComponent) {
        if (v.charAt(1) === hashComponent.charAt(1)) {
          v = v.charAt(0) + hashComponent.charAt(0);
        }
      });
    }
    b = c.descMap[v];
    if (v.charAt(0) === '"' && v.length === 2 && (v.charAt(1) >= "a" && v.charAt(1) <= "z" || v.charAt(1) >= "A" && v.charAt(1) <= "Z")) {
      b = c.namedRegisters;
    }
    if (b && !b.cmd) {
      b.cmd = v;
    }
    return b;
  }
  /**
   * @param {string} user
   * @return {?}
   */
  function userToGroup(user) {
    return !!c(user);
  }
  /**
   * @param {string} results
   * @return {?}
   */
  function success(results) {
    var result = c(results);
    /** @type {string} */
    var th_field = "";
    var t;
    var u;
    var w;
    if (!result) {
      return undefined;
    }
    return result.example ? result.example.length : 0;
  }
  /**
   * @param {string} obj
   * @param {number} key
   * @return {?}
   */
  function execute(obj, key) {
    var result = c(obj);
    /** @type {string} */
    var string = "";
    var keywordResults;
    var i;
    var parts;
    if (!result) {
      return;
    }
    key = key || 0;
    /** @type {string} */
    string = string + ("<h1>" + result.cmd + "</h1>");
    /** @type {string} */
    string = string + ("<p class='key-type'>" + result.type + "</p><div class='clearBoth'></div>");
    keywordResults = result.desc.split("\n");
    /** @type {number} */
    i = 0;
    for (; i < keywordResults.length; ++i) {
      /** @type {string} */
      string = string + ("<p>" + keywordResults[i] + "</p>");
    }
    /** @type {string} */
    string = string + "<div id='example'>";
    if (result.example && result.example[key] && result.example[key].text) {
      parts = result.example[key].text.split("\n");
      /** @type {string} */
      string = string + ("<p>Example: <span class='code'>" + result.example[key].command + "</span><br><span class='caption'>(Press '+' or '-' to move through the example)</span></p>");
      /** @type {string} */
      string = string + "<p class='example_text code'>";
      /** @type {number} */
      i = 0;
      for (; i < parts.length; ++i) {
        /** @type {string} */
        string = string + (parts[i] + (i !== parts.length - 1 ? "<br />" : ""));
      }
      /** @type {string} */
      string = string + "</p>";
    }
    /** @type {string} */
    string = string + "</div>";
    return string;
  }
  /**
   * @param {string} type
   * @return {?}
   */
  function parse(type) {
    switch(type) {
      case "h":
        return "Move one character to the left";
      case "j":
        return "Move one character down";
      case "k":
        return "Move one character up";
      case "l":
        return "Move one character right";
      case "w":
        return "Jump to the next beginning of word";
      case "e":
        return "Jump to the next end of word";
      case "b":
        return "Jump to the previous beginning of word";
      case "B":
        return "Jump to the previous beginning of WORD";
      case "x":
        return "Delete the character under the cursor";
      case "X":
        return "Delete the character before the cursor (Backspace)";
      case "W":
        return "Jump to the next beginning of WORD";
      case "E":
        return "Jump to the next end of WORD";
      case "r":
        return "Replace the character under the cursor with another one";
      case "~":
        return "Flip the case of the character under the cursor";
      case "d":
        return "Delete range indicated by following motion (w, e, etc). dd for the entire line.";
      case "D":
        return "Delete from the current position until the end of the line.";
      case "^":
        return "Move to the first non-space character in the current line";
      case "0":
        return "Move to the beginning of the current line";
      case "$":
        return "Move to the end of the current line";
      case "f":
        return "Move to the next occurence of a given character in the same line";
      case "F":
        return "Move to the previous occurence of a given character in the same line";
      case "t":
        return "Move to one character before the next occurence of a given character in the same line";
      case "T":
        return "Move to one character before the previous occurence of a given character in the same line";
      case "z":
        return "Scroll screen so the cursor current position will be at the top (t), bottom (b) or middle (z)";
      case "%":
        return "Move to the matching bracket or parentheses";
      case ":":
        return "Enter VIM Command line mode. For a full command list, type ':help :' (without the quotes)";
      case ";":
        return "Repeat the last t/T/f/F search";
      case ",":
        return "Reverse the last t/T/f/F search";
      case "G":
        return "Move to the last line of the text (soft beginning of line) or to the given [count] line number";
      case "g":
        return "Use 'gg' to move to the first line of the text (soft beginning of line)";
      case "*":
        return "Search forward for the word nearest to the cursor";
      case "#":
        return "Search backwards for the word nearest to the cursor";
      case "n":
        return "Repeat the last */#/? or / search";
      case "N":
        return "Repeat the last */#/? or / search in the opposite direction";
      case "p":
        return "Paste the last yanked, changed, or deleted text after the current position";
      case "P":
        return "Paste the last yanked, changed, or deleted text before the current position";
      case '"':
        return 'Use register {a-zA-Z0-9.%#:-"} for next delete, yank\tor put (use uppercase character to append with delete and yank)';
      case "y":
        return "Yank (copy) text";
      case "Y":
        return "Linewise yank (copy) text";
      case "i":
        return "Insert text before cursor position";
      case "I":
        return "Insert text before first non-space character in the current line";
      case "a":
        return "Append text after cursor position";
      case "A":
        return "Append text at the end of the current line";
      case "c":
        return "Change range indicated by the following motion (w, e, etc.) and enter insert mode. cc for the changing the entire line.";
      case "C":
        return "Change text from current location until the end of the line. Synonym for c$.";
      case "s":
        return "Substitute current char with new text (enters insert mode).";
      case "S":
        return "Substitute current line with new text (enters insert mode). Synonym for cc.";
      case "o":
        return "Open a new line below the current line and enter insert mode.";
      case "O":
        return "Open a new line above the current line and enter insert mode.";
      case "{":
        return "Move to the empty line before the current (or previous) paragraph";
      case "}":
        return "Move to the empty line after the current (or next) paragraph";
      case ")":
        return "Move to the beginning of the next sentence.";
      case "(":
        return "Move to the beginning of the current (or previous) sentence.";
      case "[":
        return "Use [{ or [( to find the first unmatched { or ( going backward from current position";
      case "]":
        return "Use ]} or ]) to find the first unmatched } or ) going forward from current position";
      case ".":
        return "Repeat last change";
      case "H":
        return "To line [count] from top (Home) of window on the first non-blank character";
      case "M":
        return "To Middle line of window, on the first non-blank character";
      case "L":
        return "To line [count] from bottom of window on the first non-blank character";
      case "/":
        return "Search forward for [count]'th occurrence of search pattern specified";
      case "?":
        return "Search backward for [count]'th occurrence of search pattern specified";
      case "|":
        return "Move to column [count] in the current line";
      case "`":
        return "Jump to mark";
      case "'":
        return "Jump to the first non-blank character in the line of the specified mark (linewise motion)";
      case "m":
        return "Set mark {a-zA-Z} at cursor position";
      case "u":
        return "Undo [count] changes";
      case "CTRL-R":
        return "Redo [count] changes that were undone";
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        return "Use as a part of a number [count] before an operation or a motion to repeat it the specified number of times";
    }
    return "";
  }
  /**
   * @param {string} value
   * @return {undefined}
   */
  function castDatetime(value) {
    if (isValid(value) && out.indexOf(value) === -1) {
      out = (out || "") + value;
    }
  }
  var a;
  var out;
  var results;
  return {
    init : glkote_init,
    set : addListener,
    isValid : isValid,
    add : display,
    DEBUG_remove : l,
    get : b,
    getData : getData,
    restore : remove,
    getKeyDescription : parse,
    hasExtendedDesc : userToGroup,
    getExtendedDescHTML : execute,
    getNumberOfExampleSteps : success,
    temporarilyDisable : castDatetime,
    isDisabled : on
  };
}();
vim.timer = function() {
  /**
   * @param {number} value
   * @param {number} str
   * @return {undefined}
   */
  function update(value, str) {
    refresh(id);
    /** @type {number} */
    modeswitches = value;
    /** @type {number} */
    a = Date.now();
    /** @type {number} */
    id = str;
    timer1 = window.setTimeout(parse, value * 1000);
  }
  /**
   * @return {undefined}
   */
  function parse() {
    if (timer1 !== -1) {
      vim.buffers.getCurrentBuffer().getEntities().getByName(id).timerDone();
      /** @type {number} */
      timer1 = -1;
    }
  }
  /**
   * @param {!Object} s
   * @return {undefined}
   */
  function refresh(s) {
    if (isActive(s)) {
      window.clearTimeout(timer1);
      /** @type {number} */
      timer1 = -1;
      /** @type {number} */
      modeswitches = 0;
    }
  }
  /**
   * @param {!Object} value
   * @return {?}
   */
  function isActive(value) {
    return timer1 !== -1 && (typeof timeName === "undefined" || id === value);
  }
  /**
   * @return {?}
   */
  function fillUint8ClampedArray() {
    var firstBytePositionOfNextBlock;
    var n;
    var end;
    /** @type {number} */
    firstBytePositionOfNextBlock = modeswitches - Math.floor((Date.now() - a) / 1000);
    /** @type {number} */
    n = Math.floor(firstBytePositionOfNextBlock % 60);
    /** @type {number} */
    end = Math.min(Math.floor(firstBytePositionOfNextBlock / 60), 59);
    if (end === 59) {
      /** @type {number} */
      n = 59;
    }
    if (firstBytePositionOfNextBlock < 0) {
      return "00 : 00";
    }
    return (end < 10 ? "0" + end : end) + " : " + (n < 10 ? "0" + n : n);
  }
  /**
   * @return {?}
   */
  function getData() {
    /** @type {(null|number)} */
    var secondsLeft = timer1 !== -1 ? modeswitches - Math.floor((Date.now() - a) / 1000) : null;
    return {
      timerName : id,
      secondsLeft : secondsLeft
    };
  }
  /**
   * @param {?} self
   * @return {undefined}
   */
  function f(self) {
    refresh();
    if (self.secondsLeft !== null && self.secondsLeft >= 0) {
      update(self.secondsLeft, self.timerName);
    }
  }
  var a;
  var modeswitches;
  var id;
  /** @type {number} */
  var timer1 = -1;
  return {
    set : update,
    clear : refresh,
    isActive : isActive,
    getTimeString : fillUint8ClampedArray,
    getData : getData,
    restore : f
  };
}();
var Base64 = {
  _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  encode : function(input) {
    /** @type {string} */
    var output = "";
    var chr1;
    var aStatedRank;
    var chr3;
    var enc1;
    var enc2;
    var enc3;
    var enc4;
    /** @type {number} */
    var i = 0;
    input = Base64._utf8_encode(input);
    for (; i < input.length;) {
      chr1 = input.charCodeAt(i++);
      aStatedRank = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      /** @type {number} */
      enc1 = chr1 >> 2;
      /** @type {number} */
      enc2 = (chr1 & 3) << 4 | aStatedRank >> 4;
      /** @type {number} */
      enc3 = (aStatedRank & 15) << 2 | chr3 >> 6;
      /** @type {number} */
      enc4 = chr3 & 63;
      if (isNaN(aStatedRank)) {
        /** @type {number} */
        enc3 = enc4 = 64;
      } else {
        if (isNaN(chr3)) {
          /** @type {number} */
          enc4 = 64;
        }
      }
      output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
    }
    return output;
  },
  decode : function(contents) {
    /** @type {string} */
    var output = "";
    var chr1;
    var chr2;
    var chr3;
    var j;
    var codePnt;
    var c;
    var enc4;
    /** @type {number} */
    var i = 0;
    contents = contents.replace(/[^A-Za-z0-9\+\/=]/g, "");
    for (; i < contents.length;) {
      j = this._keyStr.indexOf(contents.charAt(i++));
      codePnt = this._keyStr.indexOf(contents.charAt(i++));
      c = this._keyStr.indexOf(contents.charAt(i++));
      enc4 = this._keyStr.indexOf(contents.charAt(i++));
      /** @type {number} */
      chr1 = j << 2 | codePnt >> 4;
      /** @type {number} */
      chr2 = (codePnt & 15) << 4 | c >> 2;
      /** @type {number} */
      chr3 = (c & 3) << 6 | enc4;
      /** @type {string} */
      output = output + String.fromCharCode(chr1);
      if (c != 64) {
        /** @type {string} */
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        /** @type {string} */
        output = output + String.fromCharCode(chr3);
      }
    }
    output = Base64._utf8_decode(output);
    return output;
  },
  _utf8_encode : function(string) {
    string = string.replace(/\r\n/g, "\n");
    /** @type {string} */
    var t = "";
    /** @type {number} */
    var i = 0;
    for (; i < string.length; i++) {
      var n = string.charCodeAt(i);
      if (n < 128) {
        /** @type {string} */
        t = t + String.fromCharCode(n);
      } else {
        if (n > 127 && n < 2048) {
          /** @type {string} */
          t = t + String.fromCharCode(n >> 6 | 192);
          /** @type {string} */
          t = t + String.fromCharCode(n & 63 | 128);
        } else {
          /** @type {string} */
          t = t + String.fromCharCode(n >> 12 | 224);
          /** @type {string} */
          t = t + String.fromCharCode(n >> 6 & 63 | 128);
          /** @type {string} */
          t = t + String.fromCharCode(n & 63 | 128);
        }
      }
    }
    return t;
  },
  _utf8_decode : function(utftext) {
    /** @type {string} */
    var string = "";
    /** @type {number} */
    var i = 0;
    /** @type {number} */
    var c = 0;
    /** @type {number} */
    var e = 0;
    /** @type {number} */
    var b = 0;
    for (; i < utftext.length;) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        /** @type {string} */
        string = string + String.fromCharCode(c);
        i++;
      } else {
        if (c > 191 && c < 224) {
          e = utftext.charCodeAt(i + 1);
          /** @type {string} */
          string = string + String.fromCharCode((c & 31) << 6 | e & 63);
          /** @type {number} */
          i = i + 2;
        } else {
          e = utftext.charCodeAt(i + 1);
          b = utftext.charCodeAt(i + 2);
          /** @type {string} */
          string = string + String.fromCharCode((c & 15) << 12 | (e & 63) << 6 | b & 63);
          /** @type {number} */
          i = i + 3;
        }
      }
    }
    return string;
  }
};
vim.fetcher = function() {
  /**
   * @param {string} mode
   * @param {!Function} id
   * @param {!Function} fn
   * @param {string} obj
   * @param {string} key
   * @param {string} context
   * @param {string} name
   * @param {string} response
   * @return {undefined}
   */
  function init(mode, id, fn, obj, key, context, name, response) {
    /** @type {!XMLHttpRequest} */
    var req = new XMLHttpRequest;
    var custAuth;
    var node;
    /** @type {string} */
    var method = typeof response === "undefined" ? "GET" : "POST";
    /** @type {string} */
    var jcsdl_mode_ = document.location.hostname === "localhost" ? "http://localhost/" : "https://eudb.vim-adventures.com/";
    var context = mode.substr(0, 4) === "php/" ? jcsdl_mode_ + mode : mode;
    if (name && typeof name === "string") {
      node = body(name)[0];
    }
    if (obj) {
      if (window.btoa) {
        /** @type {string} */
        custAuth = "Basic " + window.btoa(obj + ":" + key);
      } else {
        custAuth = "Basic " + Base64.encode(obj + ":" + key);
      }
    }
    if (node) {
      /** @type {string} */
      node.innerHTML = context;
      /** @type {string} */
      node.style.visibility = "visible";
    } else {
      if (typeof name === "function") {
        name(context);
      }
    }
    req.open(method, context, true);
    if (obj) {
      req.setRequestHeader("Authorization", custAuth);
      /** @type {boolean} */
      req.withCredentials = true;
      if (vim.token) {
        req.setRequestHeader("X-Token", vim.token);
      }
    }
    if (typeof response === "string") {
      req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    }
    /**
     * @return {undefined}
     */
    req.onload = function() {
      if (node) {
        /** @type {string} */
        node.style.visibility = "hidden";
      }
      if (req.status >= 200 && req.status <= 299) {
        id(req);
      } else {
        if (req.status === 402) {
          vim.login.logout(false, true, false, obj, req.getResponseHeader("X-Activation-Date"));
        } else {
          if (req.status === 403) {
            vim.login.logout(true, false);
          } else {
            fn(req);
          }
        }
      }
    };
    req.send(typeof response === "undefined" ? null : response);
  }
  var body = vim.dom.$;
  return {
    getUrl : init
  };
}();
vim.regs = function() {
  /**
   * @return {undefined}
   */
  function mockFn() {
    headers = {};
  }
  /**
   * @param {string} value
   * @return {?}
   */
  function resolve(value) {
    if (!value) {
      return value;
    }
    return value.replace(/\n/g, "&lt;NL&gt;");
  }
  /**
   * @param {string} value
   * @param {string} key
   * @return {undefined}
   */
  function toLineStr(value, key) {
    if (key === "_") {
      return;
    }
    /** @type {string} */
    headers['"'] = value;
    if (value.indexOf("\n") === -1) {
      if (typeof key === "undefined") {
        /** @type {string} */
        headers["-"] = value;
      }
    } else {
      headers["9"] = headers["8"];
      headers["8"] = headers["7"];
      headers["7"] = headers["6"];
      headers["6"] = headers["5"];
      headers["5"] = headers["4"];
      headers["4"] = headers["3"];
      headers["3"] = headers["2"];
      headers["2"] = headers["1"];
      /** @type {string} */
      headers["1"] = value;
    }
    if (key >= "A" && key <= "Z") {
      headers[key.toLowerCase()] = (headers[key.toLowerCase()] || "") + value;
      headers['"'] = headers[key.toLowerCase()];
    } else {
      if (typeof key !== "undefined") {
        /** @type {string} */
        headers[key.toLowerCase()] = value;
      }
    }
  }
  /**
   * @param {string} value
   * @param {string} key
   * @return {undefined}
   */
  function serializeDate(value, key) {
    if (key === "_") {
      return;
    }
    /** @type {string} */
    headers['"'] = value;
    key = key || "0";
    if (key >= "A" && key <= "Z") {
      headers[key.toLowerCase()] = (headers[key.toLowerCase()] || "") + value;
      headers['"'] = headers[key.toLowerCase()];
    } else {
      /** @type {string} */
      headers[key.toLowerCase()] = value;
    }
  }
  /**
   * @param {string} kind
   * @return {?}
   */
  function openTiledImage(kind) {
    return headers[kind.toLowerCase()];
  }
  /**
   * @param {string} s
   * @return {?}
   */
  function a(s) {
    var i;
    /** @type {string} */
    var preescape = '"0123456789abcdefghijklmnopqrstuvwxyz-';
    /** @type {string} */
    var buffer = "--- Registers ---\n";
    /** @type {number} */
    i = 0;
    for (; i < preescape.length; ++i) {
      if ((typeof s === "undefined" || s.indexOf(preescape.charAt(i)) !== -1) && typeof headers[preescape.charAt(i)] !== "undefined" && preescape.charAt(i) !== " ") {
        /** @type {string} */
        buffer = buffer + ('"' + preescape.charAt(i) + "   " + resolve(headers[preescape.charAt(i)]) + "\n");
      }
    }
    return buffer;
  }
  /**
   * @param {string} m
   * @return {?}
   */
  function numbers_to_discussions(m) {
    var ch = m.toLowerCase();
    return ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z" || ch >= "0" && ch <= "9" || '"-:.%#=*+~_/'.indexOf(ch) !== -1;
  }
  /**
   * @param {string} extension
   * @return {?}
   */
  function build_extension_ui(extension) {
    var exactLanguageCode = extension.toLowerCase();
    return ":.%#=*+~/".indexOf(exactLanguageCode) !== -1;
  }
  /**
   * @return {?}
   */
  function getData() {
    var boeingData = {
      regs : headers
    };
    return boeingData;
  }
  /**
   * @param {?} state
   * @return {undefined}
   */
  function restore(state) {
    headers = state.regs;
  }
  var headers = {};
  return {
    doDelete : toLineStr,
    doYank : serializeDate,
    getRegister : openTiledImage,
    showRegisters : a,
    getData : getData,
    restore : restore,
    reset : mockFn,
    isValidRegisterName : numbers_to_discussions,
    isUnsupportedRegisterName : build_extension_ui
  };
}();
vim.model = function() {
  /**
   * @return {?}
   */
  function correctSlug() {
    return slug;
  }
  /**
   * @return {?}
   */
  function replaceTopLastChild() {
    return type;
  }
  /**
   * @return {?}
   */
  function jsonFixer() {
    return value;
  }
  /**
   * @return {?}
   */
  function appManagement() {
    return state;
  }
  /**
   * @return {?}
   */
  function data_extract() {
    return tmp;
  }
  /**
   * @return {undefined}
   */
  function ak() {
    /** @type {boolean} */
    tmp = true;
  }
  /**
   * @return {?}
   */
  function derive() {
    return Cursor.getX();
  }
  /**
   * @return {?}
   */
  function getY() {
    return Cursor.getY();
  }
  /**
   * @return {undefined}
   */
  function al() {
    values = {};
  }
  /**
   * @param {number} symbol
   * @return {undefined}
   */
  function translateSymbol(symbol) {
    /** @type {number} */
    type = symbol;
  }
  /**
   * @param {string} a
   * @return {undefined}
   */
  function makeColorMaterial(a) {
    /** @type {string} */
    value = a;
  }
  /**
   * @param {?} view
   * @return {undefined}
   */
  function InPlaceNotification(view) {
    vim.view.recalcTopXYWithTextArea(view);
  }
  /**
   * @param {boolean} options
   * @return {undefined}
   */
  function ifValidSource(options) {
    /** @type {boolean} */
    slug = options;
  }
  /**
   * @return {?}
   */
  function _get() {
    return val;
  }
  /**
   * @param {number} res
   * @return {undefined}
   */
  function noop(res) {
    /** @type {number} */
    val = res;
  }
  /**
   * @param {string} selector
   * @return {undefined}
   */
  function clickWithWebdriver(selector) {
    /** @type {string} */
    state = selector;
  }
  /**
   * @param {number} r
   * @param {number} c
   * @return {undefined}
   */
  function Node(r, c) {
    var self = vim.buffers.getCurrentBuffer();
    var context = self.getBoard();
    var bottm = context.getMaxX();
    var right = context.getMaxY();
    var recording = self.getTextAreas();
    var multiProvider = self.getEntities();
    /** @type {number} */
    this.x = r;
    /** @type {number} */
    this.y = c;
    this.bg = context.getBG(r, c);
    this.bgHeight = context.getHeight(r, c);
    this.ta = recording.get(r, c);
    this.sinked = this.ta && this.ta.getLimit() > 0 && this.ta.isOnSinkList(r, c) && this.bgHeight === 1;
    this.sa = this.ta && this.ta.getSpecialArea(r, c);
    this.isFallingArea = this.sa && this.sa.type === "M";
    this.entitiesList = multiProvider.list(r, c);
    this.letter = this.ta && this.ta.getLetter(r, c);
    this.markObj = this.ta && this.ta.getLocalMarkForPosition(r, c) || get(r, c);
    if (this.bg !== context.RAMP_EAST && this.bg !== context.RAMP_WEST && this.bg !== context.MISSING && this.bg !== context.SKY_MISSING) {
      this.shadows = {};
      /** @type {boolean} */
      this.shadows.north = c > 0 && context.getHeight(r, c - 1) > this.bgHeight;
      /** @type {boolean} */
      this.shadows.south = c + 1 < right && context.getHeight(r, c + 1) > this.bgHeight;
      /** @type {boolean} */
      this.shadows.west = r > 0 && context.getHeight(r - 1, c) > this.bgHeight;
      /** @type {boolean} */
      this.shadows.east = r + 1 < bottm && context.getHeight(r + 1, c) > this.bgHeight;
      /** @type {boolean} */
      this.shadows.nw = r > 0 && c > 0 && context.getHeight(r - 1, c - 1) > this.bgHeight;
      /** @type {boolean} */
      this.shadows.ne = r < bottm && c > 0 && context.getHeight(r + 1, c - 1) > this.bgHeight;
      /** @type {boolean} */
      this.shadows.sw = r > 0 && c < right && context.getHeight(r - 1, c + 1) > this.bgHeight;
      /** @type {boolean} */
      this.shadows.se = r < bottm && c < right && context.getHeight(r + 1, c + 1) > this.bgHeight;
    }
  }
  /**
   * @return {undefined}
   */
  function error() {
    /** @type {number} */
    var id = 200;
    /** @type {number} */
    var width = 200;
    var whatToScale;
    /** @type {!Array} */
    data = new Array(id);
    for (; id--;) {
      /** @type {number} */
      whatToScale = width;
      for (; whatToScale--;) {
        /** @type {!Array} */
        data[id] = new Array(width);
      }
    }
  }
  /**
   * @param {number} _
   * @param {number} o
   * @param {number} a
   * @param {number} x
   * @return {undefined}
   */
  function debug(_, o, a, x) {
    var x;
    var i;
    var aK;
    if (typeof data === "undefined") {
      error();
    }
    /** @type {number} */
    i = o;
    for (; i <= x; ++i) {
      /** @type {number} */
      x = _;
      for (; x <= a; ++x) {
        if (i >= data.length) {
          /** @type {number} */
          aK = i - data.length + 1;
          for (; aK--;) {
            data.push(new Array(x + 100));
          }
        }
        data[i][x] = undefined;
      }
    }
  }
  /**
   * @param {number} i
   * @param {number} x
   * @return {undefined}
   */
  function map(i, x) {
    var aH;
    if (typeof data === "undefined") {
      error();
    }
    if (x >= data.length) {
      /** @type {number} */
      aH = x - data.length + 1;
      for (; aH--;) {
        data.push(new Array(i + 100));
      }
    }
    data[x][i] = new Node(i, x);
  }
  /**
   * @param {!Object} obj
   * @return {undefined}
   */
  function refReplacement(obj) {
    /** @type {number} */
    var tags = obj.getTopX() - 1;
    /** @type {number} */
    var klass = obj.getTopY() - 1;
    var old_decoding = tags + obj.getMaxPotentialLineLength() + 30;
    var parameter = klass + obj.getNumberOfLines() + 30;
    debug(tags, klass, old_decoding, parameter);
  }
  /**
   * @param {number} n
   * @param {number} i
   * @return {?}
   */
  function filter(n, i) {
    var a;
    var aI;
    if (typeof data === "undefined") {
      error();
    }
    if (i >= data.length) {
      /** @type {number} */
      aI = i - data.length + 1;
      for (; aI--;) {
        data.push(new Array(n + 100));
      }
    }
    a = data[i][n];
    if (a === undefined) {
      a = new Node(n, i);
      data[i][n] = a;
    }
    return a;
  }
  /**
   * @param {number} e
   * @param {number} value
   * @return {?}
   */
  function display(e, value) {
    var row = vim.board;
    var xOrCellEvent = vim.buffers.getCurrentBuffer().getEntities();
    return row.getHeight(e, value) === 1 && xOrCellEvent.noBlockingEntity(e, value) || row.getBG(e, value) === row.MISSING || row.getBG(e, value) === row.SKY_MISSING;
  }
  /**
   * @param {number} input
   * @param {number} node
   * @param {number} name
   * @return {?}
   */
  function push(input, node, name) {
    var self = name ? vim.buffers.getBuffer(name) : vim.buffers.getCurrentBuffer();
    var widget = self.getBoard();
    var osgWrapper = self.getEntities();
    return widget.isCodeBG(input, node) && widget.getHeight(input, node) === 1 && osgWrapper.noBlockingEntity(input, node) && widget.getBG(input, node) !== widget.DARK;
  }
  /**
   * @param {undefined} i
   * @param {undefined} pos
   * @param {?} start
   * @return {?}
   */
  function initialize(i, pos, start) {
    var el = start ? vim.buffers.getBuffer(start) : vim.buffers.getCurrentBuffer();
    var coding = el.getTextAreas();
    var term = coding.get(i, pos);
    var path;
    if (typeof term === "undefined") {
      return false;
    }
    path = term.getSpecialArea(i, pos);
    if (typeof path === "undefined") {
      return false;
    }
    return path.type === "+";
  }
  /**
   * @param {boolean} key
   * @param {number} value
   * @param {boolean} overwrite
   * @return {?}
   */
  function extend(key, value, overwrite) {
    var c;
    var board = vim.board;
    var path = vim.buffers.getCurrentBuffer().getTextAreas().get(key, value);
    c = path && !overwrite ? path.getTopX() + path.getLineLength(value - path.getTopY()) : key;
    for (; c < board.getMaxXOnLine(value) + 1; ++c) {
      if (!board.isCodeBG(c, value)) {
        break;
      }
    }
    return c;
  }
  /**
   * @param {boolean} id
   * @param {number} key
   * @return {?}
   */
  function destroy(id, key) {
    var ret;
    var s = vim.board;
    var result = vim.buffers.getCurrentBuffer().getTextAreas().get(id, key);
    ret = result ? result.getTopX() : id;
    for (; ret >= 0; --ret) {
      if (!s.isCodeBG(ret, key)) {
        break;
      }
    }
    return ret;
  }
  /**
   * @param {!Function} lines
   * @return {?}
   */
  function interpolate(lines) {
    var width;
    var count;
    var maxHorizontal = lines.getTopX();
    var Math = vim.board;
    var current = lines.getTopX();
    var index = lines.getTopY();
    /** @type {number} */
    count = 0;
    for (; count < lines.getNumberOfLines(); ++count) {
      width = current + lines.getLineLength(count);
      for (; width < Math.getMaxXOnLine(index + count) + 1; ++width) {
        if (!Math.isCodeBG(width, index + count)) {
          break;
        }
      }
      if (width > maxHorizontal) {
        maxHorizontal = width;
      }
    }
    return maxHorizontal;
  }
  /**
   * @param {!Function} able
   * @return {?}
   */
  function merge(able) {
    var j;
    var beholder_dies;
    /** @type {number} */
    var m = able.getTopX() - 1;
    var s = vim.board;
    var coreTagKeyCount = able.getTopX();
    var sfxDir = able.getTopY();
    /** @type {number} */
    beholder_dies = 0;
    for (; beholder_dies < able.getNumberOfLines(); ++beholder_dies) {
      j = coreTagKeyCount;
      for (; j >= 0; --j) {
        if (!s.isCodeBG(j, sfxDir + beholder_dies)) {
          break;
        }
      }
      if (j < m) {
        m = j;
      }
    }
    return m;
  }
  /**
   * @param {undefined} key
   * @param {number} file
   * @return {?}
   */
  function read(key, file) {
    var data;
    var element = vim.board;
    var err = vim.buffers.getCurrentBuffer().getTextAreas().get(key, file);
    data = err ? err.getTopY() + err.getNumberOfLines() : file;
    for (; data < element.getMaxY(); ++data) {
      if (!element.isCodeBG(key, data)) {
        break;
      }
    }
    return data;
  }
  /**
   * @param {string} key
   * @return {?}
   */
  function callback(key) {
    return key >= "a" && key <= "z";
  }
  /**
   * @param {string} key
   * @return {?}
   */
  function indexOf(key) {
    return key >= "A" && key <= "Z";
  }
  /**
   * @param {string} str
   * @return {?}
   */
  function parseLinesToArray(str) {
    return s.indexOf(str) !== -1;
  }
  /**
   * @param {number} key
   * @param {number} w
   * @param {number} x
   * @param {?} start
   * @param {number} done
   * @param {number} length
   * @param {boolean} percentage
   * @return {undefined}
   */
  function render(key, w, x, start, done, length, percentage) {
    var el = start ? vim.buffers.getBuffer(start) : vim.buffers.getCurrentBuffer();
    var last = done || el.getTextAreas().get(w, x);
    /** @type {number} */
    var n = x - (last ? last.getTopY() : 0);
    /** @type {number} */
    var i = w - (last ? last.getTopX() : 0);
    var d = values[key];
    var b;
    var html;
    var previousPropertyName;
    if (!indexOf(key) || !last) {
      return;
    }
    if (!d) {
      values[key] = {};
      d = values[key];
    } else {
      b = d.x;
      html = d.y;
      previousPropertyName = d.bufferName;
    }
    /** @type {number} */
    d.mark = key;
    /** @type {number} */
    d.col = i;
    /** @type {number} */
    d.row = n;
    d.yOffset = typeof length !== "undefined" ? length : 10;
    d.bufferName = el.getName();
    /** @type {number} */
    d.x = w;
    /** @type {number} */
    d.y = x;
    d.fixed = typeof percentage === "undefined" ? false : percentage;
    if (typeof b !== "undefined" && typeof html !== "undefined" && previousPropertyName === d.bufferName) {
      map(b, html);
    }
    map(w, x);
  }
  /**
   * @param {!Object} text
   * @return {undefined}
   */
  function trigger(text) {
    var node = values[text];
    if (node) {
      delete values[text];
      if (vim.buffers.getCurrentBuffer().getName() === node.bufferName) {
        map(node.x, node.y);
      }
    }
  }
  /**
   * @param {?} $cursorX
   * @param {?} $cursorY
   * @return {undefined}
   */
  function generate($cursorX, $cursorY) {
    var Punctuator = vim.buffers.getCurrentBuffer().getName();
    var dot;
    var i;
    /** @type {number} */
    i = 0;
    for (; i < str.length; ++i) {
      dot = values[str.charAt(i)];
      if (dot && dot.x === $cursorX && dot.y === $cursorY && dot.bufferName === Punctuator) {
        delete values[str.charAt(i)];
        map(dot.x, dot.y);
      }
    }
  }
  /**
   * @param {!Object} i
   * @param {number} value
   * @param {number} size
   * @return {undefined}
   */
  function run(i, value, size) {
    var USECASE = vim.buffers.getCurrentBuffer().getName();
    var node;
    var index;
    var arrayType;
    /** @type {number} */
    index = 0;
    for (; index < str.length; ++index) {
      node = values[str.charAt(index)];
      if (node && node.x === i && node.y === value && node.bufferName === USECASE) {
        arrayType = node.y;
        /** @type {number} */
        node.y = size;
        node.row = node.row + (size - value);
        map(node.x, arrayType);
        map(node.x, node.y);
      }
    }
  }
  /**
   * @param {number} key
   * @param {number} mod
   * @param {number} val
   * @param {number} s
   * @return {undefined}
   */
  function init(key, mod, val, s) {
    var Protagonist = vim.buffers.getCurrentBuffer().getName();
    var d;
    var i;
    var b;
    var Y;
    /** @type {number} */
    i = 0;
    for (; i < str.length; ++i) {
      d = values[str.charAt(i)];
      if (d && d.x === key && d.y === mod && d.bufferName === Protagonist) {
        b = d.x;
        Y = d.y;
        /** @type {number} */
        d.y = s;
        d.row = d.row + (s - mod);
        /** @type {number} */
        d.x = val;
        d.col = d.col + (val - key);
        map(b, Y);
        map(d.x, d.y);
      }
    }
  }
  /**
   * @param {number} hash
   * @param {number} el
   * @param {?} disabled
   * @return {?}
   */
  function get(hash, el, disabled) {
    var tDisabled = disabled || vim.buffers.getCurrentBuffer().getName();
    var target;
    var i;
    /** @type {number} */
    i = 0;
    for (; i < str.length; ++i) {
      target = values[str.charAt(i)];
      if (target && target.x === hash && target.y === el && target.bufferName === tDisabled) {
        return values[str.charAt(i)];
      }
    }
    return undefined;
  }
  /**
   * @param {string} value
   * @return {?}
   */
  function clone(value) {
    return values[value];
  }
  /**
   * @param {number} i
   * @param {string} data
   * @return {?}
   */
  function done(i, data) {
    /** @type {string} */
    var buffer = "";
    var stptr;
    /** @type {number} */
    stptr = 0;
    for (; stptr < i - data.length; ++stptr) {
      /** @type {string} */
      buffer = buffer + " ";
    }
    /** @type {string} */
    buffer = buffer + data;
    return buffer;
  }
  /**
   * @param {string} val
   * @return {?}
   */
  function update(val) {
    var theme = val || s;
    var undef = vim.buffers.getCurrentBuffer().getName();
    /** @type {string} */
    var path = "mark   line   col   file / text\n";
    var doc = vim.buffers.getCurrentBuffer().getTextAreas().get(Cursor.getX(), Cursor.getY());
    var obj = {
      marks : val,
      content : "",
      str : ""
    };
    var key;
    var i;
    var pos;
    var start;
    var arrayPartial;
    var session;
    var line;
    /** @type {number} */
    i = 0;
    for (; i < s.length; ++i) {
      /** @type {string} */
      key = s.charAt(i);
      if (theme.indexOf(key) === -1) {
        continue;
      }
      if (callback(key) && doc) {
        pos = doc.getLocalMark(key);
        if (pos) {
          line = doc.getLine(pos.row);
          /** @type {string} */
          path = path + (" " + pos.mark + done(9, "" + (pos.row + 1)) + done(6, "" + pos.col) + "   " + line + "\n");
          obj.content += line + " ";
        }
      } else {
        if (indexOf(key)) {
          pos = clone(key);
          if (pos) {
            start = pos.bufferName;
            arrayPartial = vim.buffers.getBuffer(start);
            session = arrayPartial.getTextAreas().get(pos.x, pos.y);
            if (session) {
              line = start === undef ? session.getLine(pos.row) : start;
            } else {
              /** @type {string} */
              line = "-invalid-";
            }
            /** @type {string} */
            path = path + (" " + pos.mark + done(9, "" + (pos.row + 1)) + done(6, "" + pos.col) + "   " + line + "\n");
            obj.content += line + " ";
          }
        }
      }
    }
    /** @type {string} */
    obj.str = path;
    return obj;
  }
  /**
   * @param {string} t
   * @return {?}
   */
  function draw(t) {
    var J = t === "!" ? r : t;
    var undefined = vim.buffers.getCurrentBuffer().getTextAreas().get(Cursor.getX(), Cursor.getY());
    /** @type {string} */
    var statbackend = "The following marks were left here on purpose so they weren't deleted: ";
    /** @type {string} */
    var data_duplex_ = "The following marks can only be deleted from their respective texts: ";
    /** @type {string} */
    var x = "The following texts were completed due to mark deletion:\n";
    /** @type {boolean} */
    var tmp = true;
    var H;
    var id;
    var data;
    /** @type {string} */
    var key = "";
    /** @type {string} */
    var value = "";
    /** @type {string} */
    var name = "";
    var obj1;
    var invert;
    var prop;
    /** @type {number} */
    H = 0;
    for (; H < J.length; ++H) {
      id = J.charAt(H);
      if (callback(id) && undefined) {
        data = undefined.getLocalMark(id);
        if (data) {
          if (data.fixed) {
            /** @type {string} */
            key = key + id;
          } else {
            undefined.deleteLocalMark(id);
            if (undefined.hasMarkSpecialAreas()) {
              /** @type {boolean} */
              undefined.toBeChecked = true;
            }
          }
        }
      } else {
        if (indexOf(id)) {
          data = clone(id);
          if (data) {
            prop = vim.buffers.getBuffer(data.bufferName).getTextAreas().get(data.x, data.y);
            if (data.fixed) {
              /** @type {string} */
              key = key + id;
            } else {
              if ((prop.getLimit() > 0 || prop.isAlwaysSink()) && prop != undefined) {
                /** @type {string} */
                name = name + id;
              } else {
                trigger(id);
                prop = vim.buffers.getBuffer(data.bufferName).getTextAreas().get(data.x, data.y);
                if (prop.hasMarkSpecialAreas()) {
                  /** @type {boolean} */
                  prop.toBeChecked = true;
                }
              }
            }
          }
        }
      }
    }
    /** @type {number} */
    H = 1;
    for (; H < 10; ++H) {
      obj1 = vim.buffers.getBuffer(H);
      if (typeof obj1 === "string") {
        break;
      }
      var name;
      for (name in obj1.listTextAreas()) {
        prop = obj1.listTextAreas()[name];
        if (prop.toBeChecked === true) {
          invert = Game.testTextCompletion(prop, obj1.getName());
          if (invert) {
            /** @type {string} */
            value = value + ("\n" + obj1.getName() + " - " + prop.getLine(0).substr(0, 40) + "...");
          }
          /** @type {boolean} */
          prop.toBeChecked = false;
          if (invert && prop !== undefined && tmp) {
            vim.audio.play("text_restored");
            /** @type {boolean} */
            tmp = false;
          }
        }
      }
    }
    if (key !== "") {
      /** @type {string} */
      key = statbackend + key + "\n";
    }
    if (name !== "") {
      /** @type {string} */
      name = data_duplex_ + name + "\n";
    }
    if (value !== "") {
      /** @type {string} */
      value = "\n" + x + value;
    }
    return (key + name + value).trim();
  }
  /**
   * @return {?}
   */
  function toString() {
    var out = {};
    var id;
    for (id in values) {
      out[id] = {
        mark : values[id].mark,
        col : values[id].col,
        row : values[id].row,
        yOffset : 0,
        x : values[id].x,
        y : values[id].y,
        bufferName : values[id].bufferName,
        fixed : values[id].fixed
      };
    }
    return out;
  }
  /**
   * @param {!Array} marks
   * @return {undefined}
   */
  function create(marks) {
    var i;
    values = {};
    for (i in marks) {
      values[i] = {
        mark : marks[i].mark,
        col : marks[i].col,
        row : marks[i].row,
        yOffset : 0,
        x : marks[i].x,
        y : marks[i].y,
        bufferName : marks[i].bufferName,
        fixed : marks[i].fixed
      };
    }
  }
  /**
   * @return {?}
   */
  function _emptyDirectory() {
    return results;
  }
  /**
   * @param {?} output
   * @return {undefined}
   */
  function _spawnService(output) {
    if (typeof output !== "undefined") {
      results = output;
    }
  }
  /**
   * @return {?}
   */
  function idByItem() {
    return key;
  }
  /**
   * @param {!Object} module
   * @return {undefined}
   */
  function getCoreTestFilePath(module) {
    if (typeof module !== "undefined") {
      /** @type {!Object} */
      key = module;
    }
  }
  /**
   * @return {?}
   */
  function O() {
    return aE > 0;
  }
  /**
   * @param {!Function} result
   * @param {!Object} value
   * @param {!Object} i
   * @param {!Object} fn
   * @return {undefined}
   */
  function parse(result, value, i, fn) {
    var index = result.getTopX();
    var next = result.getTopY();
    var slideNumber = index + result.getMaxPotentialLineLength();
    var pos = next + result.getRawNumberOfLines();
    if (result.isComplete() && !result.isAlwaysSink() || result.getLimit() === 0) {
      return;
    }
    /** @type {!Function} */
    buffer = result;
    /** @type {!Object} */
    d = value;
    /** @type {!Object} */
    y = i;
    /** @type {!Object} */
    sort = fn;
    if (result.getLimit() > 0) {
      /** @type {number} */
      aE = result.getLimit() - 1;
    }
    options = {};
    options.addX = merge(result) + 1;
    options.addY = next;
    /** @type {number} */
    options.width = Math.max(interpolate(result), slideNumber) - options.addX;
    /** @type {number} */
    options.height = Math.max(read(index, next), pos) - options.addY;
    options.bgSection = vim.board.saveSection(options.addX, options.addY, options.addX + options.width, options.addY + options.height);
    options.text = buffer.getData();
    options.localMarks = buffer.backupLocalMarks();
    options.globalMarks = toString();
    options.entitiesInRange = vim.buffers.getCurrentBuffer().getEntities().getDataInRange(options.addX, options.addY, options.addX + options.width, options.addY + options.height);
    vim.view.notifyDoubleEscMsg();
  }
  /**
   * @return {undefined}
   */
  function setStatusListener() {
    if (typeof buffer === "undefined") {
      return;
    }
    buffer.clearSinkList();
    /** @type {number} */
    aE = 0;
    buffer = undefined;
  }
  /**
   * @param {boolean} labels
   * @param {number} id
   * @param {number} sessionId
   * @return {?}
   */
  function clear(labels, id, sessionId) {
    var i;
    var offset;
    var name;
    var a;
    var $results = vim.buffers.getCurrentBuffer().getTextAreas();
    var p = vim.board;
    var result;
    if (typeof buffer === "undefined") {
      return true;
    }
    vim.input.returnToCommandMode(true);
    vim.view.notifyCommandMode();
    i = options.addX;
    offset = options.addY;
    name = i + options.width;
    a = offset + options.height;
    /** @type {number} */
    aE = 0;
    p.clear(i, offset, name, a);
    p.add(options.bgSection);
    $results.exterminate(buffer.getTopX(), buffer.getTopY());
    result = TextArea.prototype.restore(options.text);
    result.restoreLocalMarks(options.localMarks);
    $results.add(result);
    $results.highlight(_emptyDirectory());
    create(options.globalMarks);
    vim.buffers.getCurrentBuffer().getEntities().restoreInRange(i, offset, name, a, options.entitiesInRange);
    debug(i, offset, name, a);
    buffer = undefined;
    if (sort === vim.buffers.getCurrentBuffer().getName()) {
      if (labels) {
        Game.cursorSetAndReadjust(d, y);
      } else {
        for (; p.isCodeBG(Cursor.getX(), Cursor.getY());) {
          Cursor.set(Cursor.getX() + id, Cursor.getY() + sessionId);
        }
      }
    } else {
      Cursor.restorePositionCallback(d, y, sort)();
    }
    return false;
  }
  /**
   * @return {?}
   */
  function A() {
    return aE - 1 + " key presses to go";
  }
  /**
   * @return {?}
   */
  function store() {
    if (aE > 0) {
      aE--;
      if (aE === 0) {
        return clear(true);
      }
    }
    return true;
  }
  /**
   * @param {number} left
   * @param {number} top
   * @return {?}
   */
  function Canvas(left, top) {
    var p = vim.board;
    var boundingBox = options;
    if (typeof buffer === "undefined") {
      return p.PATH;
    }
    if (left < boundingBox.addX || top < boundingBox.addY || left > boundingBox.addX + boundingBox.width || top > boundingBox.addY + boundingBox.height) {
      return p.getBG(left, top);
    }
    return Board.prototype.getBGFromSection(left, top, boundingBox.bgSection);
  }
  /**
   * @return {?}
   */
  function getData() {
    var ret = {
      candleLightMode : slug,
      topX : type,
      topY : value,
      keypressCountDown : aE,
      level : val,
      showNumbers : state,
      marks : values
    };
    return ret;
  }
  /**
   * @param {!Object} model
   * @return {undefined}
   */
  function f(model) {
    if (typeof model.candleLightMode === "undefined") {
      /** @type {boolean} */
      slug = model.overallShadowRadius > 0;
    } else {
      slug = model.candleLightMode;
    }
    type = model.topX;
    value = model.topY;
    val = model.level || 0;
    state = model.showNumbers || false;
    values = model.marks || {};
    results = undefined;
    key = undefined;
    error();
  }
  /**
   * @param {boolean} method
   * @return {?}
   */
  function reset(method) {
    return method && _get() === 14 && method.getTopX() === 509 && method.getTopY() === 460;
  }
  /**
   * @param {!Function} scope
   * @return {?}
   */
  function getUpdates(scope) {
    var draggingPanel = vim.buffers.getCurrentBuffer();
    var TYPES = vim.buffers.getCurrentBuffer().getBoard();
    return scope && draggingPanel.getName() === "underground" && _get() === 14 && scope.isBossMode() && TYPES.getBG(scope.getTopX(), scope.getTopY()) !== TYPES.PLAIN;
  }
  /**
   * @param {!Function} name
   * @return {?}
   */
  function send(name) {
    var draggingPanel = vim.buffers.getCurrentBuffer();
    var TYPES = vim.buffers.getCurrentBuffer().getBoard();
    return name && draggingPanel.getName() === "underground" && _get() === 14 && name.isBossMode() && TYPES.getBG(name.getTopX(), name.getTopY()) === TYPES.PLAIN;
  }
  /** @type {boolean} */
  var slug = false;
  /** @type {number} */
  var type = 0;
  /** @type {number} */
  var value = 0;
  /** @type {number} */
  var aE = 0;
  var buffer;
  var options;
  var d;
  var y;
  var results;
  var val;
  /** @type {boolean} */
  var state = false;
  var key;
  /** @type {string} */
  var r = "abcdefghijklmnopqrstuvwxyz";
  /** @type {string} */
  var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  /** @type {string} */
  var row = r + str;
  /** @type {string} */
  var s = r + str;
  var sort;
  var values = {};
  /** @type {boolean} */
  var tmp = false;
  var data;
  return {
    isCandleLightMode : correctSlug,
    getTopX : replaceTopLastChild,
    getTopY : jsonFixer,
    getCursorX : derive,
    getCursorY : getY,
    isValidCursorPosition : display,
    isValidBugPosition : push,
    setTopX : translateSymbol,
    setTopY : makeColorMaterial,
    readjustViewToCursorPosition : InPlaceNotification,
    setCandleLightMode : ifValidSource,
    cancelCursorPositionAnimations : function() {
      vim.view.cancelCursorPositionAnimations();
    },
    isKeypressCountdownActive : O,
    addKeyPressToCountDown : store,
    getKeypressCountdownString : A,
    initKeypressCountdown : parse,
    keypressCountdownFinished : clear,
    clearKeypressCountdown : setStatusListener,
    getKeyPressCountDownBG : Canvas,
    getEndOfCodeBlocks : extend,
    getStartOfCodeBlocks : destroy,
    getMaxEndOfCodeBlocks : interpolate,
    getMinStartOfCodeBlocks : merge,
    getBottomEndOfCodeBlocks : read,
    getMarksSummaryObject : update,
    isLocalMark : callback,
    isGlobalMark : indexOf,
    isSupportedMark : parseLinesToArray,
    addGlobalMark : render,
    deleteGlobalMark : trigger,
    getGlobalMarkForPosition : get,
    getGlobalMark : clone,
    deleteMarks : draw,
    clearAllMarks : al,
    backupGlobalMarks : toString,
    restoreGlobalMarks : create,
    updateGlobalMarkY : run,
    updateGlobalMark : init,
    deleteGlobalMarkAtPosition : generate,
    getDisplayableMarks : function() {
      return row;
    },
    getGlobalSearchStr : _emptyDirectory,
    setGlobalSearchStr : _spawnService,
    getGlobalSearchOffset : idByItem,
    setGlobalSearchOffset : getCoreTestFilePath,
    setLevel : noop,
    getLevel : _get,
    isShowNumbers : appManagement,
    setShowNumbers : clickWithWebdriver,
    isUndoRedoSkyText : reset,
    isPreBossUndergroundText : getUpdates,
    isBossUndergroundText : send,
    isEndgame : data_extract,
    setEndgame : ak,
    getCell : filter,
    recacheCell : map,
    clearTextAreaCellCache : refReplacement,
    clearCellCache : error,
    getData : getData,
    restore : f
  };
}();
/**
 * @param {string} name
 * @param {string} content
 * @return {undefined}
 */
var Buffer = function(name, content) {
  /** @type {string} */
  this.name = name;
  this.cursorX = undefined;
  this.cursorY = undefined;
  this.topX = undefined;
  this.topY = undefined;
  this.board = new Board;
  this.entities = new Entities;
  this.textareas = new TextAreas;
  if (typeof content !== "undefined") {
    this.load(content);
  }
};
/**
 * @return {?}
 */
Buffer.prototype.getName = function() {
  return this.name;
};
/**
 * @return {?}
 */
Buffer.prototype.getBoard = function() {
  return this.board;
};
/**
 * @return {?}
 */
Buffer.prototype.getEntities = function() {
  return this.entities;
};
/**
 * @return {?}
 */
Buffer.prototype.getTextAreas = function() {
  return this.textareas;
};
/**
 * @return {?}
 */
Buffer.prototype.listTextAreas = function() {
  return this.textareas.texts;
};
/**
 * @return {?}
 */
Buffer.prototype.getData = function() {
  var data = {};
  data.name = this.name;
  data.cursorX = this.cursorX;
  data.cursorY = this.cursorY;
  data.topX = this.topX;
  data.topY = this.topY;
  data.board = this.board.getData();
  data.entities = this.entities.getData();
  data.textareas = this.textareas.getData();
  return data;
};
/**
 * @param {!Object} data
 * @return {undefined}
 */
Buffer.prototype.restore = function(data) {
  this.name = data.name;
  this.cursorX = data.cursorX;
  this.cursorY = data.cursorY;
  this.topX = data.topX;
  this.topY = data.topY;
  this.board.restore(data.board);
  this.entities.restore(data.entities);
  this.textareas.restore(data.textareas, this.name);
};
/**
 * @param {string} c
 * @return {undefined}
 */
Buffer.prototype.load = function(c) {
  /** @type {*} */
  var data = JSON.parse(c);
  var i;
  var entity;
  var y;
  var options;
  var id;
  var self;
  /** @type {boolean} */
  var b = false;
  if (typeof data.levelNumber !== "undefined") {
    vim.model.setLevel(data.levelNumber);
    /** @type {boolean} */
    b = true;
  }
  this.board.add(data);
  if (typeof data.cursorX === "number" && typeof data.cursorY === "number") {
    this.cursorX = data.cursorX + data.addX;
    this.cursorY = data.cursorY + data.addY;
  }
  if (typeof data.topX === "number") {
    this.topX = data.topX + data.addX;
  }
  if (typeof data.topY === "number") {
    this.topY = data.topY + data.addY;
  }
  /** @type {number} */
  i = 0;
  for (; i < data.textareas.length; i = i + 1) {
    self = data.textareas[i];
    this.textareas.add(new TextArea(self.x + data.addX, self.y + data.addY, self.text.split("\n"), self.zoomOut, self.limit, self.alwaysSink, self.shouldClean, self.sacred, self.marks, this.getName(), self.bossMode, self.undos, self.redos));
  }
  /** @type {number} */
  i = 0;
  for (; i < data.entities.length; i = i + 1) {
    entity = data.entities[i].x + data.addX;
    y = data.entities[i].y + data.addY;
    options = data.entities[i].data || {};
    options.type = data.entities[i].type;
    /** @type {boolean} */
    options.invisible = data.entities[i].invisible === true;
    if (typeof data.entities[i].character !== "undefined") {
      options.character = data.entities[i].character;
    }
    id = this.entities.createEntity(entity, y, options, data.addX, data.addY);
    if (id) {
      this.entities.add(id);
      if (id instanceof Princess && id.isValid()) {
        vim.model.setLevel(id.levelToLoad - 1);
        /** @type {boolean} */
        b = true;
      }
    }
  }
  if (!b && vim.model.getLevel() > 1) {
    vim.model.setLevel(vim.model.getLevel() + 1);
  }
};
/**
 * @return {undefined}
 */
Buffer.prototype.switchTo = function() {
  var p = vim.model;
  Cursor.set(this.cursorX, this.cursorY);
  if (typeof this.topX === "number") {
    p.setTopX(this.topX);
  }
  if (typeof this.topY === "number") {
    p.setTopY(this.topY);
  }
  p.readjustViewToCursorPosition();
  vim.board = this.getBoard();
  p.clearCellCache();
};
/**
 * @param {?} category
 * @param {number} x
 * @param {number} i
 * @param {number} y
 * @return {?}
 */
Buffer.prototype.canMoveTo = function(category, x, i, y) {
  var value;
  var stringifyNodes;
  var tiles;
  var index;
  var element = this.board;
  /** @type {boolean} */
  stringifyNodes = true;
  if (i > element.getMaxX() || i < 0 || y < 0 || y > this.board.getMaxY()) {
    return false;
  }
  value = element.getBG(i, y);
  /** @type {boolean} */
  stringifyNodes = stringifyNodes && element.getHeight(i, y) !== 0 && value !== element.TALL_WALL && value !== element.HOUSE_WALL;
  tiles = this.entities.list(i, y);
  /** @type {number} */
  index = 0;
  for (; index < tiles.length; index = index + 1) {
    if (tiles[index].isBlocking()) {
      /** @type {boolean} */
      stringifyNodes = false;
    }
  }
  if (value === element.RAMP_EAST && x === y) {
    /** @type {boolean} */
    stringifyNodes = stringifyNodes && category !== i - 1;
  }
  if (value === element.RAMP_WEST && x === y) {
    /** @type {boolean} */
    stringifyNodes = stringifyNodes && category !== i + 1;
  }
  return stringifyNodes;
};
vim.buffers = function() {
  /**
   * @return {undefined}
   */
  function init() {
    /** @type {!Array} */
    items = [new Buffer("ground", undefined)];
    items[0].getBoard().setFillerBG(Board.prototype.WATER);
    /** @type {number} */
    i = 0;
    /** @type {number} */
    count = 0;
  }
  /**
   * @return {?}
   */
  function reparser() {
    var index;
    /** @type {string} */
    var source = "";
    /** @type {number} */
    index = 0;
    for (; index < items.length; ++index) {
      /** @type {string} */
      source = source + ((index + 1 < 10 ? " " : "") + (index + 1) + "   " + (index === i ? "%" : index === count ? "#" : " ") + "   " + items[index].getName());
      /** @type {string} */
      source = source + (index === items.length - 1 ? "" : "\n");
    }
    return source;
  }
  /**
   * @return {?}
   */
  function selectOneNum() {
    return items || [];
  }
  /**
   * @param {string} type
   * @param {string} p
   * @return {undefined}
   */
  function test(type, p) {
    var i = find(type);
    if (typeof i === "undefined") {
      items.push(new Buffer(type, undefined));
      /** @type {number} */
      i = items.length - 1;
      if (type === "sky") {
        items[i].getBoard().setFillerBG(Board.prototype.SKY_MISSING);
      }
      if (type === "underground") {
        items[i].getBoard().setFillerBG(Board.prototype.LAVA);
      }
      if (type === "lorem") {
        items[i].getBoard().setFillerBG(Board.prototype.WATER);
      }
    }
    if (typeof p !== "undefined") {
      ikey = i;
      items[i].load(p);
    }
  }
  /**
   * @param {string} key
   * @return {?}
   */
  function find(key) {
    var i;
    if (key === "%") {
      return i;
    }
    if (key === "#") {
      return count;
    }
    if (!isNaN(parseInt(key, 10))) {
      if (typeof items[key - 1] !== "undefined") {
        return key - 1;
      }
    } else {
      if (typeof(key === "string")) {
        /** @type {number} */
        i = 0;
        for (; i < items.length; ++i) {
          if (key === items[i].getName()) {
            return i;
          }
        }
      }
    }
    return undefined;
  }
  /**
   * @param {?} name
   * @return {?}
   */
  function hotpVerifyDelta(name) {
    var key = find(name);
    if (typeof key === "undefined") {
      return !isNaN(parseInt(name, 10)) ? "Buffer " + name + " does not exist." : "No matching buffer for " + name;
    }
    return items[key];
  }
  /**
   * @param {string} name
   * @param {boolean} lagOffset
   * @return {?}
   */
  function render(name, lagOffset) {
    var w = find(name);
    var Status;
    var status;
    var p = vim.model;
    var a;
    var parent;
    var q;
    var s;
    if (typeof w === "undefined") {
      return typeof name === "number" ? "Buffer " + name + " does not exist." : "No matching buffer for " + name;
    }
    if (Cursor.getX() !== 0) {
      Status = items[i].getBoard();
      status = Status.getBG(Cursor.getX(), Cursor.getY());
      if (status !== Status.MISSING && status !== Status.SKY_MISSING && status !== Status.DARK && lagOffset !== true) {
        items[i].cursorX = Cursor.getX();
        items[i].cursorY = Cursor.getY();
        items[i].topX = vim.model.getTopX();
        items[i].topY = vim.model.getTopY();
      }
    }
    count = i;
    i = w;
    items[i].switchTo();
    if (items[i].getName() === "lorem") {
      vim.images.toGrayScale();
    } else {
      vim.images.toNormalColor();
    }
    if (vim.model.getLevel() > 13 && (items[i].getName() === "sky" || items[i].getName() === "ground")) {
      vim.images.toDark();
    }
    a = items[i].getTextAreas().get(Cursor.getX(), Cursor.getY());
    if (p.isBossUndergroundText(a)) {
      parent = items[i].getEntities().listOnText(a);
      /** @type {number} */
      s = -1;
      /** @type {number} */
      q = 0;
      for (; q < parent.length; ++q) {
        if (parent[q] instanceof BigBug) {
          /** @type {number} */
          s = q;
          break;
        }
      }
      if (s !== -1) {
        parent[s].freeze();
        window.setTimeout(function() {
          parent[s].unfreeze();
        }, 1000);
      }
    }
    vim.view.notifyFadeInAnimation();
    Cursor.blink();
  }
  /**
   * @return {?}
   */
  function c() {
    return items[i];
  }
  /**
   * @return {?}
   */
  function download() {
    return items[ikey];
  }
  /**
   * @return {?}
   */
  function update() {
    var index;
    var _this = {};
    items[i].cursorX = Cursor.getX();
    items[i].cursorY = Cursor.getY();
    items[i].topX = vim.model.getTopX();
    items[i].topY = vim.model.getTopY();
    /** @type {!Array} */
    _this.buffers = [];
    _this.curBufferIndex = i;
    _this.alternateIndex = count;
    /** @type {number} */
    index = 0;
    for (; index < items.length; ++index) {
      _this.buffers.push(items[index].getData());
    }
    return _this;
  }
  /**
   * @param {!Object} result
   * @return {undefined}
   */
  function run(result) {
    var id;
    var data;
    /** @type {!Array} */
    items = [];
    i = result.curBufferIndex;
    count = result.alternateIndex;
    /** @type {number} */
    id = 0;
    for (; id < result.buffers.length; ++id) {
      data = new Buffer("changeme" + id);
      items.push(data);
    }
    /** @type {number} */
    id = 0;
    for (; id < result.buffers.length; ++id) {
      items[id].restore(result.buffers[id]);
    }
    data = items[i];
    Cursor.set(data.cursorX, data.cursorY);
    vim.model.setTopX(data.topX);
    vim.model.setTopY(data.topY);
    vim.board = data.getBoard();
  }
  var items;
  var i;
  var count;
  var ikey;
  return {
    init : init,
    list : reparser,
    collection : selectOneNum,
    add : test,
    switchTo : render,
    getData : update,
    restore : run,
    getCurrentBuffer : c,
    getWorkBuffer : download,
    getBuffer : hotpVerifyDelta
  };
}();
/**
 * @return {undefined}
 */
function Board() {
  /** @type {!Array} */
  this.bg = [];
  /** @type {number} */
  this.maxX = 0;
  /** @type {number} */
  this.maxY = 0;
  this.fillerBG = undefined;
}
/** @type {string} */
Board.prototype.WATER = "w";
/** @type {string} */
Board.prototype.WALL = "s";
/** @type {string} */
Board.prototype.TALL_WALL = "S";
/** @type {string} */
Board.prototype.HOUSE_WALL = "_";
/** @type {string} */
Board.prototype.WOOD = "W";
/** @type {string} */
Board.prototype.PATH = ".";
/** @type {string} */
Board.prototype.GRASS = "g";
/** @type {string} */
Board.prototype.RAMP_EAST = "<";
/** @type {string} */
Board.prototype.RAMP_WEST = ">";
/** @type {string} */
Board.prototype.PLAIN = "+";
/** @type {string} */
Board.prototype.MISSING = "M";
/** @type {string} */
Board.prototype.SKY_MISSING = "m";
/** @type {string} */
Board.prototype.CRACKED = "x";
/** @type {string} */
Board.prototype.DARK = "*";
/** @type {string} */
Board.prototype.CLOUD = "c";
/** @type {string} */
Board.prototype.WHITE = "#";
/** @type {string} */
Board.prototype.SAND = "~";
/** @type {string} */
Board.prototype.LAVA = "l";
/**
 * @param {string} a
 * @return {undefined}
 */
Board.prototype.setFillerBG = function(a) {
  /** @type {string} */
  this.fillerBG = a;
};
/**
 * @return {?}
 */
Board.prototype.getFillerBG = function() {
  return this.fillerBG;
};
/**
 * @return {?}
 */
Board.prototype.getData = function() {
  var data = {};
  data.bg = this.bg;
  data.fillerBG = this.fillerBG;
  return data;
};
/**
 * @param {!Object} s
 * @return {undefined}
 */
Board.prototype.restore = function(s) {
  var i;
  var p;
  if (typeof s.bg === "undefined") {
    /** @type {!Object} */
    p = s;
    /** @type {string} */
    this.fillerBG = Board.prototype.WATER;
  } else {
    p = s.bg;
    this.fillerBG = s.fillerBG;
  }
  /** @type {!Array} */
  this.bg = [];
  this.maxY = p.length;
  /** @type {number} */
  this.maxX = 0;
  /** @type {number} */
  i = 0;
  for (; i < p.length; i = i + 1) {
    if (p[i]) {
      this.bg[i] = p[i];
      /** @type {number} */
      this.maxX = Math.max(this.maxX, p[i].length);
    }
  }
};
/**
 * @param {!Object} options
 * @return {undefined}
 */
Board.prototype.add = function(options) {
  var i;
  var val;
  var prevVal;
  var s;
  /** @type {number} */
  i = 0;
  for (; i < options.bg.length; i = i + 1) {
    if (typeof this.bg[i + options.addY] === "undefined") {
      /** @type {string} */
      this.bg[i + options.addY] = "";
    }
    options.bg[i] = options.bg[i].replace(/\s+$/, "");
    if (options.addX >= this.bg[i + options.addY].length) {
      /** @type {number} */
      prevVal = options.addX - this.bg[i + options.addY].length;
      /** @type {number} */
      val = 0;
      for (; val < prevVal; val = val + 1) {
        this.bg[i + options.addY] += this.fillerBG;
      }
    }
    s = this.bg[i + options.addY].substr(0, options.addX);
    s = s + options.bg[i];
    s = s + (this.bg[i + options.addY].length > s.length ? this.bg[i + options.addY].substr(s.length) : "");
    this.bg[i + options.addY] = s;
    /** @type {number} */
    this.maxX = Math.max(this.maxX, this.bg[i + options.addY].length);
  }
  this.maxY = this.bg.length;
};
/**
 * @param {number} b
 * @param {number} start
 * @param {number} interval
 * @param {number} first
 * @return {undefined}
 */
Board.prototype.clear = function(b, start, interval, first) {
  var i;
  /** @type {string} */
  var pix_color = "";
  var item;
  item = {
    addX : b,
    addY : start
  };
  /** @type {!Array} */
  item.bg = [];
  /** @type {number} */
  i = b;
  for (; i <= interval; ++i) {
    /** @type {string} */
    pix_color = pix_color + this.fillerBG;
  }
  /** @type {number} */
  i = start;
  for (; i <= first; ++i) {
    /** @type {string} */
    item.bg[i - start] = pix_color;
  }
  this.add(item);
};
/**
 * @param {number} pos
 * @param {number} delta
 * @param {number} offset
 * @param {number} limit
 * @return {?}
 */
Board.prototype.saveSection = function(pos, delta, offset, limit) {
  var i;
  var me = {
    addX : pos,
    addY : delta,
    bg : []
  };
  /** @type {number} */
  i = delta;
  for (; i <= limit; ++i) {
    me.bg[i - delta] = this.bg[i].substring(pos, offset + 1);
    if (me.bg[i - delta].length < offset + 1 - pos) {
      /** @type {string} */
      me.bg[i - delta] = me.bg[i - delta] + (new Array(offset + 1 - pos + 1 - me.bg[i - delta].length)).join(" ");
    }
  }
  return me;
};
/**
 * @param {number} start
 * @param {number} mode
 * @param {(Object|string)} boundingBox
 * @return {?}
 */
Board.prototype.getBGFromSection = function(start, mode, boundingBox) {
  return boundingBox.bg[mode - boundingBox.addY].charAt(start - boundingBox.addX);
};
/**
 * @return {?}
 */
Board.prototype.getMaxX = function() {
  return this.maxX;
};
/**
 * @return {?}
 */
Board.prototype.getMaxY = function() {
  return this.maxY;
};
/**
 * @param {number} a
 * @return {?}
 */
Board.prototype.getMaxXOnLine = function(a) {
  return this.bg[a].length - 1;
};
/**
 * @param {!Object} s
 * @param {number} key
 * @return {?}
 */
Board.prototype.isValid = function(s, key) {
  return typeof this.bg[key] !== "undefined" && s < this.bg[key].length;
};
/**
 * @param {number} name
 * @param {number} v
 * @return {?}
 */
Board.prototype.getBG = function(name, v) {
  var t = this.isValid(name, v);
  var c = t ? this.bg[v].charAt(name) : this.fillerBG;
  return c !== " " ? c : this.fillerBG;
};
/**
 * @param {number} pos
 * @param {number} index
 * @param {string} text
 * @return {undefined}
 */
Board.prototype.setBG = function(pos, index, text) {
  var str;
  if (typeof this.bg[index] === "undefined") {
    /** @type {string} */
    this.bg[index] = "";
  }
  str = this.bg[index];
  if (pos <= str.length) {
    this.bg[index] = str.substring(0, pos) + text + str.substring(pos + 1);
  } else {
    /** @type {string} */
    this.bg[index] = str + (new Array(pos - str.length + 1)).join(" ") + text;
  }
  vim.model.recacheCell(pos, index);
};
/**
 * @param {number} a
 * @param {number} x
 * @return {?}
 */
Board.prototype.isCodeBG = function(a, x) {
  var b = this.getBG(a, x);
  return b !== this.WATER && b !== this.WHITE && b !== this.LAVA && b !== this.CLOUD && b !== this.PATH && b !== this.GRASS && b !== this.WALL && b !== this.WOOD && b !== this.SKY_MISSING && b !== this.SAND;
};
/**
 * @param {number} value
 * @param {?} node
 * @return {?}
 */
Board.prototype.getHeight = function(value, node) {
  var height;
  var alpha;
  if (value < 0 || value >= this.maxX || node < 0 || node >= this.maxY) {
    alpha = this.fillerBG;
  }
  if (!this.isValid(value, node)) {
    alpha = this.fillerBG;
  }
  if (typeof alpha === "undefined") {
    alpha = this.getBG(value, node);
  }
  if (alpha === " ") {
    alpha = this.fillerBG;
  }
  switch(alpha) {
    case this.MISSING:
    case this.SKY_MISSING:
      /** @type {number} */
      height = -1;
      break;
    case this.WATER:
    case this.LAVA:
      /** @type {number} */
      height = 0;
      break;
    case this.HOUSE_WALL:
      /** @type {number} */
      height = 3;
      break;
    case this.TALL_WALL:
    case this.RAMP_EAST:
    case this.RAMP_WEST:
      /** @type {number} */
      height = 2;
      break;
    default:
      /** @type {number} */
      height = 1;
      break;
  }
  return height;
};
vim.motionsFSM = {
  word : {
    states : {
      start : {
        " " : "space",
        a : "alphanum",
        ";" : "punc",
        n : "newline"
      },
      space : {
        " " : "space",
        a : "retoffset",
        ";" : "retoffset",
        n : "newline"
      },
      alphanum : {
        " " : "space",
        a : "alphanum",
        ";" : "retoffset",
        n : "newline"
      },
      punc : {
        " " : "space",
        a : "retoffset",
        ";" : "punc",
        n : "newline"
      },
      newline : {
        " " : "possible_empty_line",
        a : "retoffset",
        ";" : "retoffset",
        n : "retoffset"
      },
      possible_empty_line : {
        " " : "space",
        a : "retoffset",
        ";" : "retoffset",
        n : "retoffsetbefore"
      }
    },
    forward : true,
    outOfBoundsReturn : "word_out_of_bounds",
    inputFunc : function(ch) {
      if (ch === " ") {
        return " ";
      }
      if (ch === "\n") {
        return "n";
      }
      if (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z" || ch >= "0" && ch <= "9" || ch === "_") {
        return "a";
      }
      return ";";
    }
  },
  WORD : {
    states : {
      start : {
        " " : "space",
        "." : "nonspace",
        n : "newline"
      },
      space : {
        " " : "space",
        "." : "retoffset",
        n : "newline"
      },
      nonspace : {
        " " : "space",
        "." : "nonspace",
        n : "newline"
      },
      newline : {
        " " : "possible_empty_line",
        "." : "retoffset",
        n : "retoffset"
      },
      possible_empty_line : {
        " " : "space",
        "." : "retoffset",
        n : "retoffsetbefore"
      }
    },
    forward : true,
    outOfBoundsReturn : "word_out_of_bounds",
    inputFunc : function(output) {
      if (output === " ") {
        return " ";
      }
      if (output === "\n") {
        return "n";
      }
      return ".";
    }
  },
  endword : {
    states : {
      start : {
        " " : "space",
        a : "end_alphanum",
        ";" : "end_punc",
        n : "newline"
      },
      space : {
        " " : "space",
        a : "alphanum",
        ";" : "punc",
        n : "newline"
      },
      end_alphanum : {
        " " : "space",
        a : "alphanum",
        ";" : "punc",
        n : "newline"
      },
      end_punc : {
        " " : "space",
        a : "alphanum",
        ";" : "punc",
        n : "newline"
      },
      alphanum : {
        " " : "retoffsetbefore",
        a : "alphanum",
        ";" : "retoffsetbefore",
        n : "retoffsetbefore"
      },
      punc : {
        " " : "retoffsetbefore",
        a : "retoffsetbefore",
        ";" : "punc",
        n : "retoffsetbefore"
      },
      newline : {
        " " : "space",
        a : "alphanum",
        ";" : "punc",
        n : "newline"
      }
    },
    forward : true,
    outOfBoundsReturn : "end",
    inputFunc : function(ch) {
      if (ch === " ") {
        return " ";
      }
      if (ch === "\n") {
        return "n";
      }
      if (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z" || ch >= "0" && ch <= "9" || ch === "_") {
        return "a";
      }
      return ";";
    }
  },
  endWORD : {
    states : {
      start : {
        " " : "space",
        "." : "end_word",
        n : "newline"
      },
      space : {
        " " : "space",
        "." : "word",
        n : "newline"
      },
      end_word : {
        " " : "space",
        "." : "word",
        n : "newline"
      },
      word : {
        " " : "retoffsetbefore",
        "." : "word",
        n : "retoffsetbefore"
      },
      newline : {
        " " : "space",
        "." : "word",
        n : "newline"
      }
    },
    forward : true,
    outOfBoundsReturn : "end",
    inputFunc : function(output) {
      if (output === " ") {
        return " ";
      }
      if (output === "\n") {
        return "n";
      }
      return ".";
    }
  },
  prevword : {
    states : {
      start : {
        " " : "space",
        a : "begin_alphanum",
        ";" : "begin_punc",
        n : "begin_newline"
      },
      space : {
        " " : "space",
        a : "alphanum",
        ";" : "punc",
        n : "newline"
      },
      begin_alphanum : {
        " " : "space",
        a : "alphanum",
        ";" : "punc",
        n : "newline"
      },
      begin_punc : {
        " " : "space",
        a : "alphanum",
        ";" : "punc",
        n : "newline"
      },
      alphanum : {
        " " : "retoffsetbefore",
        a : "alphanum",
        ";" : "retoffsetbefore",
        n : "retoffsetbefore"
      },
      punc : {
        " " : "retoffsetbefore",
        a : "retoffsetbefore",
        ";" : "punc",
        n : "retoffsetbefore"
      },
      begin_newline : {
        " " : "space",
        a : "alphanum",
        ";" : "punc",
        n : "newline"
      },
      newline : {
        " " : "space",
        a : "alphanum",
        ";" : "punc",
        n : "retoffsetbefore"
      }
    },
    forward : false,
    outOfBoundsReturn : "zero",
    inputFunc : function(ch) {
      if (ch === " ") {
        return " ";
      }
      if (ch === "\n") {
        return "n";
      }
      if (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z" || ch >= "0" && ch <= "9" || ch === "_") {
        return "a";
      }
      return ";";
    }
  },
  prevWORD : {
    states : {
      start : {
        " " : "space",
        "." : "begin_word",
        n : "begin_newline"
      },
      space : {
        " " : "space",
        "." : "word",
        n : "newline"
      },
      begin_word : {
        " " : "space",
        "." : "word",
        n : "newline"
      },
      word : {
        " " : "retoffsetbefore",
        "." : "word",
        n : "retoffsetbefore"
      },
      begin_newline : {
        " " : "space",
        "." : "word",
        n : "newline"
      },
      newline : {
        " " : "space",
        "." : "word",
        n : "retoffsetbefore"
      }
    },
    forward : false,
    outOfBoundsReturn : "zero",
    inputFunc : function(output) {
      if (output === " ") {
        return " ";
      }
      if (output === "\n") {
        return "n";
      }
      return ".";
    }
  },
  closestIdentifier : {
    states : {
      start : {
        " " : "spaceorpunc_forward",
        a : "alphanum_backward",
        ";" : "spaceorpunc_forward",
        n : "retundefined"
      },
      spaceorpunc_forward : {
        " " : "spaceorpunc_forward",
        a : "retoffset",
        ";" : "spaceorpunc_forward",
        n : "retundefined"
      },
      alphanum_backward : {
        " " : "retoffsetbefore",
        a : "alphanum_backward",
        ";" : "retoffsetbefore",
        n : "retoffsetbefore"
      }
    },
    forward : undefined,
    outOfBoundsReturn : "back_zero_forward_undefined",
    inputFunc : function(ch) {
      if (ch === " ") {
        return " ";
      }
      if (ch === "\n") {
        return "n";
      }
      if (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z" || ch >= "0" && ch <= "9" || ch === "_") {
        return "a";
      }
      return ";";
    }
  },
  closestNonblankWord : {
    states : {
      start : {
        " " : "space_forward",
        a : "alphanum_backward",
        ";" : "punc_backward",
        n : "retundefined"
      },
      space_forward : {
        " " : "space_forward",
        a : "retoffset",
        ";" : "retoffset",
        n : "retundefined"
      },
      alphanum_backward : {
        " " : "retoffsetbefore",
        a : "alphanum_backward",
        ";" : "retoffsetbefore",
        n : "retoffsetbefore"
      },
      punc_backward : {
        " " : "retoffsetbefore",
        a : "retoffsetbefore",
        ";" : "punc_backward",
        n : "retoffsetbefore"
      }
    },
    forward : undefined,
    outOfBoundsReturn : "back_zero_forward_undefined",
    inputFunc : function(ch) {
      if (ch === " ") {
        return " ";
      }
      if (ch === "\n") {
        return "n";
      }
      if (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z" || ch >= "0" && ch <= "9" || ch === "_") {
        return "a";
      }
      return ";";
    }
  },
  endCurrentWord : {
    states : {
      start : {
        " " : "retundefined",
        a : "alphanum",
        ";" : "punc",
        n : "retundefined"
      },
      alphanum : {
        " " : "retoffsetbefore",
        a : "alphanum",
        ";" : "retoffsetbefore",
        n : "retoffsetbefore"
      },
      punc : {
        " " : "retoffsetbefore",
        a : "retoffsetbefore",
        ";" : "punc",
        n : "retoffsetbefore"
      }
    },
    forward : true,
    outOfBoundsReturn : "end",
    inputFunc : function(ch) {
      if (ch === " ") {
        return " ";
      }
      if (ch === "\n") {
        return "n";
      }
      if (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z" || ch >= "0" && ch <= "9" || ch === "_") {
        return "a";
      }
      return ";";
    }
  },
  paragraph : {
    states : {
      start : {
        n : "start",
        " " : "first_space",
        "*" : "in_paragraph"
      },
      first_space : {
        n : "start",
        " " : "in_paragraph",
        "*" : "in_paragraph"
      },
      in_paragraph : {
        n : "possible_end",
        " " : "in_paragraph",
        "*" : "in_paragraph"
      },
      possible_end : {
        n : "possible_end",
        " " : "end_first_space",
        "*" : "in_paragraph"
      },
      end_first_space : {
        n : "retoffsetbefore",
        " " : "in_paragraph",
        "*" : "in_paragraph"
      }
    },
    forward : true,
    outOfBoundsReturn : "end",
    inputFunc : function(output) {
      if (output === " ") {
        return " ";
      }
      if (output === "\n") {
        return "n";
      }
      return "*";
    }
  },
  prevParagraph : {
    states : {
      start : {
        n : "start",
        " " : "first_space",
        "*" : "in_paragraph"
      },
      first_space : {
        n : "start",
        " " : "in_paragraph",
        "*" : "in_paragraph"
      },
      in_paragraph : {
        n : "possible_end",
        " " : "in_paragraph",
        "*" : "in_paragraph"
      },
      possible_end : {
        n : "possible_end",
        " " : "end_first_space",
        "*" : "in_paragraph"
      },
      end_first_space : {
        n : "retoffsetbefore",
        " " : "in_paragraph",
        "*" : "in_paragraph"
      }
    },
    forward : false,
    outOfBoundsReturn : "zero",
    inputFunc : function(output) {
      if (output === " ") {
        return " ";
      }
      if (output === "\n") {
        return "n";
      }
      return "*";
    }
  },
  sentence : {
    states : {
      start : {
        "." : "dot",
        n : "start",
        " " : "first_space",
        "]" : "paragraph",
        "*" : "paragraph"
      },
      first_space : {
        "." : "dot",
        n : "start",
        " " : "paragraph",
        "]" : "paragraph",
        "*" : "paragraph"
      },
      paragraph : {
        "." : "dot",
        n : "possible_paragraph_border",
        " " : "paragraph",
        "]" : "paragraph",
        "*" : "paragraph"
      },
      possible_paragraph_border : {
        "." : "dot",
        n : "possible_paragraph_border",
        " " : "space_in_possible_paragraph_border",
        "]" : "paragraph",
        "*" : "paragraph"
      },
      space_in_possible_paragraph_border : {
        "." : "dot",
        n : "retoffsetbefore",
        " " : "paragraph",
        "]" : "paragraph",
        "*" : "paragraph"
      },
      dot : {
        "." : "dot",
        n : "possible_paragraph_border_after_dot",
        " " : "space",
        "]" : "closing",
        "*" : "paragraph"
      },
      possible_paragraph_border_after_dot : {
        "." : "retoffset",
        n : "possible_paragraph_border_after_dot",
        " " : "space_in_possible_paragraph_border_after_dot",
        "]" : "retoffset",
        "*" : "retoffset"
      },
      space_in_possible_paragraph_border_after_dot : {
        "." : "retoffset",
        n : "retoffsetbefore",
        " " : "space",
        "]" : "retoffset",
        "*" : "retoffset"
      },
      space : {
        "." : "retoffset",
        n : "possible_paragraph_border_after_dot",
        " " : "space",
        "]" : "retoffset",
        "*" : "retoffset"
      },
      closing : {
        "." : "retoffset",
        n : "possible_paragraph_border_after_dot",
        " " : "space",
        "]" : "closing",
        "*" : "retoffset"
      }
    },
    forward : true,
    outOfBoundsReturn : "end",
    inputFunc : function(output) {
      if (output === " ") {
        return " ";
      }
      if (output === "\n") {
        return "n";
      }
      if (output === "." || output === "!" || output === "?") {
        return ".";
      }
      if (output === ")" || output === "]" || output === '"' || output === "'") {
        return "]";
      }
      return "*";
    }
  },
  sentenceEnd : {
    states : {
      start : {
        "." : "dot",
        n : "start",
        " " : "first_space",
        "]" : "paragraph",
        "*" : "paragraph"
      },
      first_space : {
        "." : "dot",
        n : "retoffsetbefore",
        " " : "paragraph",
        "]" : "paragraph",
        "*" : "paragraph"
      },
      paragraph : {
        "." : "dot",
        n : "possible_paragraph_border",
        " " : "paragraph",
        "]" : "paragraph",
        "*" : "paragraph"
      },
      possible_paragraph_border : {
        "." : "dot",
        n : "possible_paragraph_border",
        " " : "space_in_possible_paragraph_border",
        "]" : "paragraph",
        "*" : "paragraph"
      },
      space_in_possible_paragraph_border : {
        "." : "dot",
        n : "retoffsetbefore3",
        " " : "paragraph",
        "]" : "paragraph",
        "*" : "paragraph"
      },
      dot : {
        "." : "dot",
        n : "retoffsetbefore",
        " " : "retoffsetbefore",
        "]" : "closing",
        "*" : "paragraph"
      },
      closing : {
        "." : "retoffsetbefore",
        n : "retoffsetbefore",
        " " : "retoffsetbefore",
        "]" : "closing",
        "*" : "retoffsetbefore"
      }
    },
    forward : true,
    outOfBoundsReturn : "end",
    inputFunc : function(output) {
      if (output === " ") {
        return " ";
      }
      if (output === "\n") {
        return "n";
      }
      if (output === "." || output === "!" || output === "?") {
        return ".";
      }
      if (output === ")" || output === "]" || output === '"' || output === "'") {
        return "]";
      }
      return "*";
    }
  },
  run : function(params, name, value) {
    /** @type {string} */
    var id = "start";
    var r;
    var internalKey;
    /** @type {number} */
    r = name;
    for (; r >= 0 && r < value.length; params.forward ? ++r : --r) {
      internalKey = params.inputFunc(value.charAt(r));
      id = params.states[id][internalKey];
      if (id === "retoffsetbefore3") {
        return params.forward ? r - 3 : r + 3;
      }
      if (id === "retoffsetbefore") {
        return params.forward ? r - 1 : r + 1;
      }
      if (id === "retoffset") {
        return r;
      }
      if (id === "retundefined") {
        return undefined;
      }
      if (id.indexOf("backward") !== -1) {
        /** @type {boolean} */
        params.forward = false;
      } else {
        if (id.indexOf("forward") !== -1) {
          /** @type {boolean} */
          params.forward = true;
        }
      }
    }
    if (typeof params.outOfBoundsReturn !== "undefined") {
      switch(params.outOfBoundsReturn) {
        case "zero":
          return 0;
        case "end":
          return value.length - 1;
        case "word_out_of_bounds":
          return -2;
        case "dont_move":
          return -1;
        case "back_zero_forward_undefined":
          return params.forward ? undefined : 0;
      }
    }
    return -1;
  },
  getWord : function(callback, cursor) {
    return this.run(this.word, callback, cursor);
  },
  getWORD : function(signal, duration) {
    return this.run(this.WORD, signal, duration);
  },
  getEndWord : function(signal, duration) {
    return this.run(this.endword, signal, duration);
  },
  getEndWORD : function(signal, duration) {
    return this.run(this.endWORD, signal, duration);
  },
  getEndCurrentWord : function(keys, duration) {
    return this.run(this.endCurrentWord, keys, duration);
  },
  getPreviousWord : function(signal, duration) {
    return this.run(this.prevword, signal, duration);
  },
  getPreviousWORD : function(signal, duration) {
    return this.run(this.prevWORD, signal, duration);
  },
  getClosestWordForSearch : function(name, callback) {
    var result = this.run(this.closestIdentifier, name, callback);
    if (typeof result === "undefined") {
      result = this.run(this.closestNonblankWord, name, callback);
    }
    return result;
  },
  getNextParagraphStart : function(url, duration) {
    return this.run(this.paragraph, url, duration);
  },
  getPrevParagraphStart : function(args, duration) {
    return this.run(this.prevParagraph, args, duration);
  },
  getNextSentenceStart : function(args, duration) {
    return this.run(this.sentence, args, duration);
  },
  getFirstAvailableSentenceEnd : function(name, method) {
    return this.run(this.sentenceEnd, name, method);
  }
};
/**
 * @param {?} theme
 * @param {?} props
 * @param {string} value
 * @param {string} colix
 * @param {number} x
 * @param {string} text
 * @param {string} data
 * @param {boolean} stream
 * @param {string} parent
 * @param {string} origin
 * @param {string} d
 * @param {number} options
 * @param {number} config
 * @return {undefined}
 */
var TextArea = function(theme, props, value, colix, x, text, data, stream, parent, origin, d, options, config) {
  var i;
  this.topX = theme;
  this.topY = props;
  /** @type {string} */
  this.bufferName = origin;
  /** @type {string} */
  this.rawText = value;
  /** @type {boolean} */
  this.ignoreEmptyLines = value.length > 1 && value[1].length === 0;
  this.zoomOut = colix || false;
  this.limit = x || 0;
  this.sacred = stream || false;
  this.bossMode = d || false;
  this.undos = options || [];
  this.redos = config || [];
  /** @type {!Array} */
  this.sinkList = [];
  this.alwaysSink = text || false;
  this.shouldClean = data || " ";
  /** @type {number} */
  this.currentNumber = 0;
  /** @type {!Array} */
  this.highlights = [];
  this.marks = parent || {};
  this.rawNumberOfLines = value.length;
  /** @type {number} */
  this.maxPotentialLineLength = 0;
  /** @type {number} */
  i = 0;
  for (; i < value.length; ++i) {
    /** @type {number} */
    this.maxPotentialLineLength = Math.max(this.maxPotentialLineLength, value[i].length);
  }
  /** @type {number} */
  this.maxPotentialLineLength = this.maxPotentialLineLength * 2;
  this.initTextAndSpecialAreas();
};
/**
 * @return {?}
 */
TextArea.prototype.isZoomOut = function() {
  return this.zoomOut;
};
/**
 * @return {?}
 */
TextArea.prototype.isAlwaysSink = function() {
  return this.alwaysSink || false;
};
/**
 * @return {?}
 */
TextArea.prototype.getShouldClean = function() {
  return this.shouldClean || " ";
};
/**
 * @return {?}
 */
TextArea.prototype.getCurrentNumber = function() {
  return this.currentNumber || 0;
};
/**
 * @param {number} a
 * @return {undefined}
 */
TextArea.prototype.setCurrentNumber = function(a) {
  /** @type {number} */
  this.currentNumber = a;
};
/**
 * @return {?}
 */
TextArea.prototype.getLimit = function() {
  return this.limit;
};
/**
 * @return {?}
 */
TextArea.prototype.isSacred = function() {
  return this.sacred;
};
/**
 * @return {?}
 */
TextArea.prototype.isBossMode = function() {
  return this.bossMode;
};
/**
 * @return {?}
 */
TextArea.prototype.getTopY = function() {
  return this.topY;
};
/**
 * @return {?}
 */
TextArea.prototype.getTopX = function() {
  return this.topX;
};
/**
 * @param {number} y
 * @return {?}
 */
TextArea.prototype.getLineLength = function(y) {
  return this.text[y].length;
};
/**
 * @param {number} i
 * @return {?}
 */
TextArea.prototype.getLine = function(i) {
  return this.text[i];
};
/**
 * @return {?}
 */
TextArea.prototype.getNumberOfLines = function() {
  return this.height;
};
/**
 * @return {?}
 */
TextArea.prototype.getRawNumberOfLines = function() {
  return this.rawNumberOfLines;
};
/**
 * @return {?}
 */
TextArea.prototype.getMaxPotentialLineLength = function() {
  return this.maxPotentialLineLength;
};
/**
 * @return {?}
 */
TextArea.prototype.getMaxLength = function() {
  return this.maxLength;
};
/**
 * @return {?}
 */
TextArea.prototype.getData = function() {
  return {
    topX : this.topX,
    topY : this.topY,
    rawText : this.rawText.join("\n"),
    zoomOut : this.zoomOut,
    limit : this.limit,
    alwaysSink : this.alwaysSink,
    shouldClean : this.shouldClean,
    sacred : this.sacred,
    bossMode : this.bossMode,
    marks : this.marks,
    undos : this.undos,
    redos : this.redos
  };
};
/**
 * @param {!Object} self
 * @param {string} type
 * @return {?}
 */
TextArea.prototype.restore = function(self, type) {
  return new TextArea(self.topX, self.topY, self.rawText.split("\n"), self.zoomOut, self.limit, self.alwaysSink, self.shouldClean, self.sacred, self.marks, type, self.bossMode, self.undos, self.redos);
};
/**
 * @param {!Date} x
 * @param {!Date} range
 * @return {?}
 */
TextArea.prototype.overlaps = function(x, range) {
  /** @type {number} */
  var i = range - this.topY;
  /** @type {number} */
  var j = x - this.topX;
  return i >= 0 && j >= 0 && this.text[i] && j < this.text[i].length && i < this.height;
};
/**
 * @param {number} value
 * @param {number} x
 * @return {?}
 */
TextArea.prototype.getLetter = function(value, x) {
  /** @type {number} */
  var i = x - this.topY;
  /** @type {number} */
  var level = value - this.topX;
  return this.text[i] && this.text[i].length > level && level >= 0 ? this.text[i].charAt(level) : "";
};
/**
 * @param {number} index
 * @param {number} obj
 * @return {?}
 */
TextArea.prototype.toJoinedOffset = function(index, obj) {
  var offset;
  /** @type {number} */
  var outerStepNumber = 0;
  /** @type {number} */
  var c = index - this.topX;
  /** @type {number} */
  var a = obj - this.topY;
  /** @type {number} */
  offset = 0;
  for (; offset < a; ++offset) {
    outerStepNumber = outerStepNumber + (this.text[offset].length + 1);
  }
  outerStepNumber = outerStepNumber + c;
  return outerStepNumber;
};
/**
 * @param {string} f
 * @param {number} i
 * @return {?}
 */
TextArea.prototype.controlLength = function(f, i) {
  /** @type {number} */
  var paramLen = 0;
  var end;
  var endIndex;
  var st;
  for (; i > 0 && f.charAt(i) !== "^";) {
    --i;
  }
  if (f.charAt(i) === "^") {
    /** @type {number} */
    paramLen = f.charAt(i + 1) === "h" ? 1 : 0;
    switch(f.charAt(i + paramLen + 1)) {
      case "x":
      case "d":
      case "t":
      case "M":
      case "m":
      case "o":
      case "_":
        /** @type {number} */
        paramLen = paramLen + 1;
        break;
      case "r":
        /** @type {number} */
        paramLen = paramLen + 2;
        break;
      case "n":
        /** @type {number} */
        paramLen = paramLen + (f.indexOf("^", i + 1) - i - 2);
        break;
      case "*":
      case "+":
        end = f.indexOf(".", i + 1);
        /** @type {number} */
        st = parseInt(f.substring(i + 2, end), 10);
        endIndex = end + st + 1;
        /** @type {number} */
        paramLen = paramLen + (endIndex - i);
        break;
      default:
        /** @type {number} */
        paramLen = 0;
    }
  }
  return paramLen;
};
/**
 * @param {?} type
 * @return {?}
 */
TextArea.prototype.unaryRangeType = function(type) {
  switch(type) {
    case "x":
    case "r":
    case "M":
    case "m":
    case "t":
    case "o":
    case "_":
      return true;
    case "d":
    case "n":
    case "*":
    case "+":
      return false;
    default:
      return false;
  }
};
/**
 * @param {number} x
 * @return {?}
 */
TextArea.prototype.toPosition = function(x) {
  /** @type {number} */
  var i = 0;
  for (; x - this.text[i].length - 1 >= 0;) {
    /** @type {number} */
    x = x - this.text[i].length - 1;
    /** @type {number} */
    i = i + 1;
  }
  return {
    x : this.topX + x,
    y : this.topY + i
  };
};
/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @param {number} e
 * @return {?}
 */
TextArea.prototype.charBelowPos = function(r, g, b, e) {
  var at;
  var l;
  /** @type {number} */
  at = 0;
  for (; at < e; ++at) {
    if (g - this.topY + 1 < this.text.length) {
      g = g + 1;
      /** @type {number} */
      l = this.text[g - this.topY].length + this.topX - 1;
      /** @type {number} */
      r = b === -1 ? l : Math.min(b, l);
    }
  }
  return {
    x : r,
    y : g
  };
};
/**
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} to
 * @return {?}
 */
TextArea.prototype.charAbovePos = function(a, b, c, to) {
  var from;
  var previous;
  /** @type {number} */
  from = 0;
  for (; from < to; ++from) {
    if (b - this.topY > 0) {
      /** @type {number} */
      b = b - 1;
      /** @type {number} */
      previous = this.text[b - this.topY].length + this.topX - 1;
      /** @type {number} */
      a = c === -1 ? previous : Math.min(c, previous);
    }
  }
  return {
    x : a,
    y : b
  };
};
/**
 * @param {number} w
 * @param {number} h
 * @param {number} side
 * @return {?}
 */
TextArea.prototype.prevCharPos = function(w, h, side) {
  var cx;
  /** @type {number} */
  cx = 0;
  for (; cx < side; ++cx) {
    if (w - this.topX > 0) {
      /** @type {number} */
      w = w - 1;
    }
  }
  return {
    x : w,
    y : h
  };
};
/**
 * @param {number} v
 * @param {number} d
 * @param {number} h
 * @return {?}
 */
TextArea.prototype.nextCharPos = function(v, d, h) {
  var destY;
  /** @type {number} */
  destY = 0;
  for (; destY < h; ++destY) {
    if (this.text[d - this.topY].length > v - this.topX + 1) {
      v = v + 1;
    }
  }
  return {
    x : v,
    y : d
  };
};
/**
 * @param {number} a
 * @param {number} b
 * @param {!Function} mixin
 * @param {number} original
 * @return {?}
 */
TextArea.prototype.doWordPosMotion = function(a, b, mixin, original) {
  var p = this.toJoinedOffset(a, b);
  var start;
  var merged;
  var position;
  /** @type {number} */
  merged = 0;
  for (; merged < original; ++merged) {
    start = mixin.call(vim.motionsFSM, p, this.joinedText);
    p = start >= 0 ? start : p;
    if (start === -2) {
      /** @type {number} */
      p = -2;
      break;
    }
  }
  if (p === -2) {
    position = this.toPosition(this.joinedText.length - 1);
    /** @type {boolean} */
    position.wordOutOfBounds = true;
    return position;
  }
  return p >= 0 ? this.toPosition(p) : {
    x : a,
    y : b
  };
};
/**
 * @param {number} opacity
 * @param {number} x
 * @param {boolean} type
 * @param {number} def
 * @return {?}
 */
TextArea.prototype.nextWordPos = function(opacity, x, type, def) {
  return this.doWordPosMotion(opacity, x, type ? vim.motionsFSM.getWORD : vim.motionsFSM.getWord, def);
};
/**
 * @param {undefined} a
 * @param {undefined} b
 * @param {boolean} method
 * @param {number} replace
 * @return {?}
 */
TextArea.prototype.endWordPos = function(a, b, method, replace) {
  return this.doWordPosMotion(a, b, method ? vim.motionsFSM.getEndWORD : vim.motionsFSM.getEndWord, replace);
};
/**
 * @param {undefined} a
 * @param {undefined} b
 * @param {boolean} method
 * @param {number} replace
 * @return {?}
 */
TextArea.prototype.prevWordPos = function(a, b, method, replace) {
  return this.doWordPosMotion(a, b, method ? vim.motionsFSM.getPreviousWORD : vim.motionsFSM.getPreviousWord, replace);
};
/**
 * @param {?} a
 * @param {number} b
 * @return {?}
 */
TextArea.prototype.hardBOLPos = function(a, b) {
  return {
    x : this.topX,
    y : b
  };
};
/**
 * @param {?} w
 * @param {number} i
 * @return {?}
 */
TextArea.prototype.softBOLPos = function(w, i) {
  var column;
  /** @type {number} */
  var pos = i - this.topY;
  /** @type {number} */
  column = 0;
  for (; column < this.text[pos].length; ++column) {
    if (this.text[pos].charAt(column) !== " ") {
      break;
    }
  }
  if (column === this.text[pos].length && column > 0) {
    /** @type {number} */
    column = 0;
  }
  return {
    x : this.topX + column,
    y : i
  };
};
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
TextArea.prototype.firstLineSoftBOLPos = function(a, b) {
  return this.softBOLPos(a, this.topY);
};
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
TextArea.prototype.lastLineSoftBOLPos = function(a, b) {
  return this.softBOLPos(a, this.topY + this.getNumberOfLines() - 1);
};
/**
 * @param {?} type
 * @param {?} h
 * @param {number} edge
 * @return {?}
 */
TextArea.prototype.gotoSoftBOLPosInLine = function(type, h, edge) {
  /** @type {number} */
  edge = Math.min(edge, this.getNumberOfLines());
  return this.softBOLPos(type, this.topY + edge - 1);
};
/**
 * @param {?} value2
 * @param {number} t
 * @param {!Object} h
 * @return {?}
 */
TextArea.prototype.columnPos = function(value2, t, h) {
  /** @type {number} */
  var audioOffsetX = this.topX - 1 + Math.min(h, this.text[t - this.topY].length);
  return {
    x : audioOffsetX,
    y : t
  };
};
/**
 * @param {?} dir
 * @param {!Date} pos
 * @param {number} x
 * @return {?}
 */
TextArea.prototype.endOfLine = function(dir, pos, x) {
  var c;
  var offsetAdjust;
  /** @type {number} */
  var i = pos - this.topY;
  /** @type {number} */
  c = 0;
  for (; c < x; ++c) {
    offsetAdjust = this.text[i].length;
    if (offsetAdjust > 0) {
      --offsetAdjust;
    }
    if (c < x - 1 && i < this.getNumberOfLines() - 1) {
      ++i;
    }
  }
  return {
    x : this.topX + offsetAdjust,
    y : this.topY + i
  };
};
/**
 * @param {number} x0
 * @param {number} value
 * @param {!Object} id
 * @param {number} h
 * @return {?}
 */
TextArea.prototype.findNextInLine = function(x0, value, id, h) {
  /** @type {number} */
  var direction = x0 - this.topX;
  /** @type {number} */
  var index = value - this.topY;
  var destY;
  /** @type {number} */
  destY = 0;
  for (; destY < h; ++destY) {
    direction = this.text[index].indexOf(id, direction + 1);
    if (direction === -1) {
      break;
    }
  }
  return direction === -1 ? {
    x : x0,
    y : value
  } : {
    x : this.topX + direction,
    y : value
  };
};
/**
 * @param {number} a
 * @param {number} b
 * @param {!Object} pos
 * @param {number} mode
 * @return {?}
 */
TextArea.prototype.findPrevInLine = function(a, b, pos, mode) {
  /** @type {number} */
  var direction = a - this.topX;
  /** @type {number} */
  var i = b - this.topY;
  var j;
  /** @type {number} */
  j = 0;
  for (; j < mode; ++j) {
    direction = direction === 0 ? -1 : this.text[i].lastIndexOf(pos, direction - 1);
    if (direction === -1) {
      break;
    }
  }
  return direction === -1 ? {
    x : a,
    y : b
  } : {
    x : this.topX + direction,
    y : b
  };
};
/**
 * @param {undefined} x
 * @param {undefined} y
 * @param {!Object} id
 * @param {number} height
 * @return {?}
 */
TextArea.prototype.findNextTillInLine = function(x, y, id, height) {
  var position = this.findNextInLine(x, y, id, height);
  if (position.x !== x && position.x > 0) {
    --position.x;
  }
  return position;
};
/**
 * @param {undefined} x
 * @param {number} y
 * @param {!Object} index
 * @param {number} window
 * @return {?}
 */
TextArea.prototype.findPrevTillInLine = function(x, y, index, window) {
  var position = this.findPrevInLine(x, y, index, window);
  if (position.x !== x && position.x < this.topX + this.text[y - this.topY].length) {
    ++position.x;
  }
  return position;
};
/**
 * @param {number} index
 * @param {number} position
 * @return {?}
 */
TextArea.prototype.findMatchingBracket = function(index, position) {
  var x = this.toJoinedOffset(index, position);
  /** @type {number} */
  var oldData = -1;
  var mode;
  /** @type {string} */
  var abbr = "([{<";
  /** @type {string} */
  var NOTEATTRS = ")]}>";
  /** @type {string} */
  var correlativeDisplay = "()[]{}<>";
  /** @type {number} */
  var dist = 0;
  /** @type {number} */
  var i = -1;
  var selectedattr;
  var spacingPx;
  for (; x < this.joinedText.length && this.joinedText[x] !== "\n" && correlativeDisplay.indexOf(this.joinedText[x]) === -1; x++) {
  }
  if (x < this.joinedText.length && this.joinedText[x] !== "\n") {
    mode = this.joinedText[x];
    /** @type {number} */
    i = Math.floor(correlativeDisplay.indexOf(mode) / 2);
    /** @type {number} */
    spacingPx = abbr.indexOf(mode) !== -1 ? 1 : -1;
  }
  if (i !== -1) {
    for (; x >= 0 && x < this.joinedText.length; x = x + spacingPx) {
      selectedattr = this.joinedText[x];
      if (selectedattr === abbr[i]) {
        /** @type {number} */
        dist = dist + 1;
      } else {
        if (selectedattr === NOTEATTRS[i]) {
          /** @type {number} */
          dist = dist - 1;
        }
      }
      if (dist === 0) {
        oldData = x;
        break;
      }
    }
  }
  if (oldData >= 0) {
    return this.toPosition(oldData);
  }
  return {
    x : index,
    y : position
  };
};
/**
 * @param {number} v
 * @param {number} p
 * @param {!Object} type
 * @param {number} def
 * @return {?}
 */
TextArea.prototype.findUnmatchedBracket = function(v, p, type, def) {
  var index = this.toJoinedOffset(v, p);
  /** @type {number} */
  var oldData = -1;
  var undefined;
  /** @type {string} */
  var m = "()[]{}<>";
  /** @type {number} */
  var addr = 0;
  /** @type {number} */
  var i = m.indexOf(type);
  var b;
  var x;
  if (i !== -1) {
    /** @type {number} */
    x = i % 2 === 0 ? -1 : 1;
    /** @type {string} */
    undefined = m.charAt(i - x);
    /** @type {number} */
    addr = def;
    if (this.joinedText[index] === undefined || this.joinedText[index] === type) {
      index = index + x;
    }
    for (; index >= 0 && index < this.joinedText.length; index = index + x) {
      b = this.joinedText[index];
      if (b === type) {
        /** @type {number} */
        addr = addr - 1;
      } else {
        if (b === undefined) {
          addr = addr + 1;
        }
      }
      if (addr === 0) {
        oldData = index;
        break;
      }
    }
  }
  if (oldData >= 0) {
    return this.toPosition(oldData);
  }
  return {
    x : v,
    y : p
  };
};
/**
 * @param {number} next
 * @param {number} index
 * @param {number} p
 * @param {number} start
 * @return {?}
 */
TextArea.prototype.getTextInRange = function(next, index, p, start) {
  var end;
  /** @type {string} */
  var wholeBoard = "";
  var text;
  if (index === start) {
    /** @type {number} */
    end = next;
    for (; end <= p; ++end) {
      wholeBoard = wholeBoard + this.text[index - this.topY].charAt(end - this.topX);
    }
  } else {
    text = this.text[index - this.topY];
    /** @type {number} */
    end = next;
    for (; end <= this.topX + text.length - 1; ++end) {
      wholeBoard = wholeBoard + text.charAt(end - this.topX);
    }
    /** @type {string} */
    wholeBoard = wholeBoard + "\n";
    end = index + 1;
    for (; end < start; ++end) {
      text = this.text[end - this.topY];
      /** @type {string} */
      wholeBoard = wholeBoard + (text + "\n");
    }
    text = this.text[start - this.topY];
    end = this.topX;
    for (; end <= p; ++end) {
      wholeBoard = wholeBoard + text.charAt(end - this.topX);
    }
  }
  return wholeBoard;
};
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
TextArea.prototype.getAffectedText = function(a, b) {
  var d = this.rawText.join("\n") + "\n";
  var data = this.getSpecialArea(a, b);
  if (typeof data === "undefined") {
    return;
  }
  switch(data.type) {
    case "x":
      return d.charAt(data.rawStart + 2);
    case "d":
      return d.substring(data.rawStart + 2, data.rawEnd) + (data.bol && data.eol ? "\n" : "");
    default:
  }
};
/**
 * @param {!Object} self
 * @return {?}
 */
TextArea.prototype.getRangeText = function(self) {
  var i;
  var att;
  /** @type {string} */
  var r = "";
  i = self.sy;
  for (; i <= self.ey; ++i) {
    if (i > self.sy) {
      /** @type {string} */
      r = r + "\n";
    }
    att = i === self.sy ? self.sx : this.topX;
    for (; att <= (i === self.ey ? self.ex : this.topX + this.getLineLength(att - this.topY)); ++att) {
      r = r + this.getLetter(att, i);
    }
  }
  if (self.linewise) {
    /** @type {string} */
    r = r + "\n";
  }
  return r;
};
/**
 * @param {?} c
 * @param {?} n
 * @return {?}
 */
TextArea.prototype.applySpecialArea = function(c, n) {
  var fn = this.getSpecialArea(c, n);
  if (typeof fn === "undefined") {
    return;
  }
  return this.applyGivenSpecialArea(fn);
};
/**
 * @param {!Object} data
 * @return {undefined}
 */
TextArea.prototype.applyGivenSpecialArea = function(data) {
  var remaining;
  var s;
  var index;
  var color;
  var a;
  var boundary;
  color = this.rawText.join("\n");
  s = data.rawStart;
  index = data.rawEnd;
  switch(data.type) {
    case "x":
    case "d":
      /** @type {string} */
      remaining = "";
      break;
    case "r":
    case "t":
      remaining = data.originalCharacter;
      break;
    case "*":
    case "+":
      /** @type {string} */
      remaining = data.originalText + (data.bol && data.eol ? "\n" : "");
      break;
    case "n":
      remaining = data.originalCharacter;
      ++this.currentNumber;
      break;
    case "M":
      /** @type {string} */
      remaining = "";
      break;
    default:
      remaining = color.substring(s, index + 1);
  }
  /** @type {boolean} */
  boundary = data.type === "d" && data.rawEnd === color.length - 1 && color.charAt(data.rawStart - 1) === "\n";
  color = color.substring(0, s + (boundary ? -1 : 0)) + remaining + color.substring(index + 1 + (data.bol && data.eol ? 1 : 0));
  this.rawText = color.split("\n");
  if (this.getNumberOfLines() > this.rawText.length && this.rawText[this.rawText.length - 1] === "") {
    color = color.substr(0, color.length - 1);
    this.rawText = color.split("\n");
  }
  this.initTextAndSpecialAreas();
};
/**
 * @param {!Object} headerIndex
 * @return {?}
 */
TextArea.prototype.getRawCaretType = function(headerIndex) {
  var i;
  /** @type {boolean} */
  var f = false;
  /** @type {boolean} */
  var e = false;
  /** @type {boolean} */
  var a = false;
  var characters = this.rawText.join("\n");
  /** @type {number} */
  i = 0;
  for (; i < characters.length; ++i) {
    if (characters.charAt(i) === "^") {
      if (a) {
        /** @type {boolean} */
        a = false;
        /** @type {boolean} */
        e = false;
      } else {
        if (characters.length === i + 1 || characters.charAt(i + 1) !== "^" || f) {
          /** @type {boolean} */
          e = true;
          if (f) {
            /** @type {boolean} */
            f = false;
          } else {
            if (characters.length !== i + 1 && !this.unaryRangeType(characters.charAt(i + 1))) {
              /** @type {boolean} */
              f = true;
            }
          }
          /** @type {boolean} */
          a = false;
        } else {
          if (!f) {
            /** @type {boolean} */
            a = true;
          }
          /** @type {boolean} */
          e = false;
        }
      }
    }
    if (i === headerIndex) {
      if (e) {
        return 0;
      }
      if (a) {
        return 1;
      }
      return 2;
    }
  }
  return -1;
};
/**
 * @param {number} N
 * @param {number} m
 * @param {string} n
 * @param {string} s
 * @return {undefined}
 */
TextArea.prototype.initTextAndSpecialAreas = function(N, m, n, s) {
  var i;
  var value;
  var e;
  var options;
  var t;
  var hide;
  var apiinvoice;
  var index;
  var start;
  var str;
  var g;
  var increment;
  var GROUPSIZE;
  var gitsenseKey;
  var name;
  /** @type {boolean} */
  var PL$117 = false;
  str = this.rawText.join("\n");
  /** @type {!Array} */
  this.areas = [];
  /** @type {!Array} */
  this.text = [];
  /** @type {number} */
  this.maxLength = 0;
  /** @type {boolean} */
  t = false;
  /** @type {boolean} */
  hide = false;
  /** @type {number} */
  apiinvoice = 0;
  /** @type {number} */
  e = 0;
  /** @type {string} */
  value = "";
  /** @type {number} */
  gitsenseKey = 0;
  /** @type {number} */
  i = 0;
  for (; i < str.length; i = i + 1) {
    if (typeof s !== "undefined" && !PL$117 && this.text.length === m && value.length === N) {
      str = str.substr(0, i) + s + str.substr(i + n);
      this.rawText = str.split("\n");
      /** @type {number} */
      i = i - 1;
      /** @type {boolean} */
      PL$117 = true;
      continue;
    }
    /** @type {boolean} */
    g = true;
    /** @type {number} */
    GROUPSIZE = 0;
    increment = str.charAt(i);
    if (increment === "^") {
      /** @type {boolean} */
      g = false;
      if (this.getRawCaretType(i) === 1) {
        /** @type {boolean} */
        g = true;
        /** @type {number} */
        GROUPSIZE = 1;
      } else {
        if (t === false) {
          ++gitsenseKey;
          if (str.charAt(i + 1) === "h") {
            /** @type {boolean} */
            hide = true;
            i = i + 1;
          }
          options = {};
          options.type = str.charAt(i + 1);
          options.textArea = this;
          /** @type {number} */
          options.number = this.areas.length;
          options.startX = this.topX + value.length;
          options.startY = this.topY + this.text.length;
          options.rawStart = i + (hide ? -1 : 0);
          /** @type {boolean} */
          options.hidden = hide;
          /** @type {number} */
          options.eols = 0;
          /** @type {boolean} */
          options.bol = i === 0 || str.charAt(i - 1) === "\n";
          /** @type {boolean} */
          hide = false;
          switch(options.type) {
            case "x":
              options.endX = this.topX + value.length;
              options.endY = this.topY + this.text.length;
              options.rawEnd = i + 2;
              this.areas.push(options);
              i = i + 1;
              break;
            case "t":
              options.endX = this.topX + value.length;
              options.endY = this.topY + this.text.length;
              options.originalCharacter = str.charAt(i + 2);
              options.rawEnd = i + 2;
              this.areas.push(options);
              i = i + 1;
              break;
            case "r":
              options.endX = this.topX + value.length;
              options.endY = this.topY + this.text.length;
              options.originalCharacter = str.charAt(i + 2);
              options.rawEnd = i + 3;
              this.areas.push(options);
              i = i + 2;
              break;
            case "M":
              options.endX = this.topX + value.length;
              options.endY = this.topY + this.text.length;
              options.rawEnd = i + 1;
              this.areas.push(options);
              i = i + 1;
              break;
            case "m":
              name = str.charAt(i + 2);
              if (vim.model.isLocalMark(name)) {
                this.addLocalMark(name, this.topX + value.length, this.topY + this.text.length, 0, this.limit === 0 && this.alwaysSink !== true);
              } else {
                if (vim.model.isGlobalMark(name)) {
                  vim.model.addGlobalMark(name, this.topX + value.length, this.topY + this.text.length, this.bufferName, this, 0, true);
                }
              }
              str = str.substr(0, i) + str.substr(i + 3);
              this.rawText = str.split("\n");
              /** @type {number} */
              i = i - 1;
              break;
            case "d":
              i = i + 1;
              /** @type {boolean} */
              t = true;
              /** @type {number} */
              apiinvoice = 0;
              break;
            case "n":
              /** @type {number} */
              options.stepNumber = parseInt(str.substring(i + 2, str.indexOf("^", i + 1) - 1), 10);
              if (this.currentNumber === 0 || this.currentNumber > options.stepNumber) {
                /** @type {number} */
                this.currentNumber = options.stepNumber;
              }
              options.originalCharacter = str.charAt(str.indexOf("^", i + 1) - 1);
              i = i + (str.indexOf("^", i + 1) - i - 2);
              /** @type {boolean} */
              t = true;
              /** @type {number} */
              apiinvoice = 0;
              break;
            case "*":
            case "+":
              index = str.indexOf(".", i + 1);
              /** @type {number} */
              options.originalLength = parseInt(str.substring(i + 2, index), 10);
              start = index + options.originalLength + 1;
              options.originalText = str.substring(index + 1, start);
              /** @type {boolean} */
              options.inplace = start - index === str.indexOf("^", start + 1) - start;
              /** @type {number} */
              apiinvoice = 0;
              i = start;
              /** @type {boolean} */
              t = true;
              break;
            case "o":
            case "_":
              options.endX = this.topX + value.length;
              options.endY = this.topY + this.text.length;
              options.rawEnd = i + 2;
              options.requiredMark = options.type === "_" ? " " : str.charAt(i + 2);
              this.areas.push(options);
              if (options.type === "_" && str.charAt(i + 2) !== " ") {
                name = str.charAt(i + 2);
                if (vim.model.isLocalMark(name)) {
                  this.addLocalMark(name, this.topX + value.length, this.topY + this.text.length, 0, false);
                } else {
                  if (vim.model.isGlobalMark(name)) {
                    vim.model.addGlobalMark(name, this.topX + value.length, this.topY + this.text.length, this.bufferName, this, 0, false);
                  }
                }
                str = str.substr(0, i + 2) + " " + str.substr(i + 3);
              }
              i = i + 2;
              break;
            default:
              value = value + str.charAt(i);
              break;
          }
        } else {
          switch(options.type) {
            case "d":
            case "n":
            case "*":
            case "+":
              /** @type {boolean} */
              options.eol = i === str.length - 1 || str.charAt(i + 1) === "\n";
              /** @type {number} */
              options.endX = this.topX + value.length - 1;
              options.endY = this.topY + this.text.length;
              options.rawEnd = i;
              /** @type {number} */
              options.eols = apiinvoice + (options.bol && options.eol ? 1 : 0);
              if ("+*".indexOf(options.type) !== -1) {
                options.shownText = str.substring(start + 1, i);
              }
              /** @type {boolean} */
              t = false;
              this.areas.push(options);
              break;
          }
        }
      }
    }
    if (increment === "\n" || i + 1 === str.length) {
      if (increment === "\n") {
        ++apiinvoice;
      }
      if (increment !== "\n" && increment !== "^" && i + 1 === str.length) {
        value = value + increment;
      }
      if (!(value === "" && gitsenseKey === 1 && str.charAt(i - (increment === "\n" ? 1 : 0)) === "^")) {
        this.text.push(value);
        if (value.length > this.maxLength) {
          this.maxLength = value.length;
        }
      } else {
        /** @type {boolean} */
        options.emptyLine = true;
      }
      /** @type {string} */
      value = "";
      /** @type {number} */
      gitsenseKey = 0;
    } else {
      if (g) {
        value = value + increment;
      }
    }
    i = i + GROUPSIZE;
  }
  /** @type {string} */
  this.joinedText = this.text.join("\n");
  this.height = this.text.length;
  this.rawText = str.split("\n");
};
/**
 * @param {boolean} state
 * @return {?}
 */
TextArea.prototype.isComplete = function(state) {
  var n;
  var node;
  var data;
  var me = vim.model;
  /** @type {number} */
  n = 0;
  for (; n < this.areas.length; n = n + 1) {
    node = this.areas[n];
    switch(node.type) {
      case "M":
        continue;
      case "o":
        data = this.getLocalMarkForPosition(node.startX, node.startY) || me.getGlobalMarkForPosition(node.startX, node.startY, this.bufferName);
        if (state !== true && (typeof data === "undefined" || data.mark !== node.requiredMark)) {
          return false;
        }
        break;
      case "_":
        data = this.getLocalMarkForPosition(node.startX, node.startY) || me.getGlobalMarkForPosition(node.startX, node.startY, this.bufferName);
        if (state !== true && (typeof data !== "undefined" && me.getDisplayableMarks().indexOf(data.mark) !== -1)) {
          return false;
        }
        break;
      default:
        return false;
    }
  }
  if (state !== true && Game.bugsCount(this.topX, this.topY, this.topX + this.getLineLength(this.getNumberOfLines() - 1) - 1, this.topY + this.getNumberOfLines() - 1, this.bufferName) > 0) {
    return false;
  }
  return true;
};
/**
 * @param {?} x
 * @param {?} y
 * @return {?}
 */
TextArea.prototype.getSpecialArea = function(x, y) {
  var n;
  var node;
  /** @type {number} */
  n = 0;
  for (; n < this.areas.length; n = n + 1) {
    node = this.areas[n];
    if (y >= node.startY && y <= node.endY && (node.startY === node.endY && node.startY === y && node.startX <= x && node.endX >= x) || node.startY !== node.endY && (y === node.startY && x >= node.startX || y > node.startY && y < node.endY || y === node.endY && x <= node.endX)) {
      return node;
    }
  }
};
/**
 * @param {!Object} type
 * @param {number} i
 * @param {boolean} value
 * @return {?}
 */
TextArea.prototype.getEmptyLineSpecialArea = function(type, i, value) {
  var n;
  var e;
  /** @type {number} */
  n = 0;
  for (; n < this.areas.length; n = n + 1) {
    e = this.areas[n];
    if (e.emptyLine === true && e.startY === e.endY && e.startY === i + (value ? 0 : 1)) {
      return e;
    }
  }
};
/**
 * @param {number} a
 * @param {?} i
 * @param {boolean} before
 * @return {?}
 */
TextArea.prototype.getEmptySpecialArea = function(a, i, before) {
  var n;
  var d;
  /** @type {number} */
  n = 0;
  for (; n < this.areas.length; n = n + 1) {
    d = this.areas[n];
    if (d.emptyLine !== true && i >= d.startY && i <= d.endY && (d.startY === d.endY && d.startY === i && d.startX === a + (before ? 0 : 1) && d.endX === a - 1 + (before ? 0 : 1))) {
      return d;
    }
  }
};
/**
 * @param {number} r
 * @param {number} c
 * @return {?}
 */
TextArea.prototype.isOnSinkList = function(r, c) {
  var layer_i;
  /** @type {number} */
  layer_i = 0;
  for (; layer_i < this.sinkList.length; ++layer_i) {
    if (this.sinkList[layer_i][0] === r && this.sinkList[layer_i][1] === c) {
      return true;
    }
  }
  return false;
};
/**
 * @param {number} s
 * @param {number} index
 * @return {undefined}
 */
TextArea.prototype.addToSinkList = function(s, index) {
  if (this.limit > 0 && (!this.isComplete() || this.alwaysSink)) {
    /** @type {!Array} */
    this.sinkList[this.sinkList.length] = [s, index];
  }
};
/**
 * @param {?} _
 * @param {?} f
 * @return {?}
 */
TextArea.prototype.checkForShouldCleanSpecialAreas = function(_, f) {
  var key = this.getSpecialArea(_, f);
  if (key && key.type === "t") {
    this.applySpecialArea(_, f);
    return true;
  }
  return false;
};
/**
 * @param {?} name
 * @param {?} n
 * @return {?}
 */
TextArea.prototype.checkForNumberedSpecialAreas = function(name, n) {
  var arg = this.getSpecialArea(name, n);
  if (arg && arg.type === "n" && arg.stepNumber === this.currentNumber) {
    this.applySpecialArea(name, n);
    return true;
  }
  return false;
};
/**
 * @param {number} s
 * @param {number} num
 * @return {undefined}
 */
TextArea.prototype.cursorPositionUpdate = function(s, num) {
  this.addToSinkList(s, num);
  vim.model.recacheCell(s, num);
};
/**
 * @param {!Object} a
 * @param {?} b
 * @param {number} l
 * @return {undefined}
 */
TextArea.prototype.changeSinkListX = function(a, b, l) {
  var i;
  /** @type {!Array} */
  var nodes = [];
  /** @type {number} */
  i = 0;
  for (; i < this.sinkList.length; ++i) {
    if (this.sinkList[i][0] === a && this.sinkList[i][1] === b) {
      /** @type {!Array} */
      nodes[nodes.length] = [l, b];
    } else {
      nodes[nodes.length] = this.sinkList[i];
    }
  }
  /** @type {!Array} */
  this.sinkList = nodes;
};
/**
 * @param {!Object} a
 * @param {!Object} b
 * @param {number} variableNames
 * @return {undefined}
 */
TextArea.prototype.changeSinkListY = function(a, b, variableNames) {
  var i;
  /** @type {!Array} */
  var names = [];
  /** @type {number} */
  i = 0;
  for (; i < this.sinkList.length; ++i) {
    if (this.sinkList[i][0] === a && this.sinkList[i][1] === b) {
      /** @type {!Array} */
      names[names.length] = [a, variableNames];
    } else {
      names[names.length] = this.sinkList[i];
    }
  }
  /** @type {!Array} */
  this.sinkList = names;
};
/**
 * @param {number} a
 * @param {number} b
 * @param {?} n
 * @param {?} V
 * @return {undefined}
 */
TextArea.prototype.changeSinkList = function(a, b, n, V) {
  var i;
  /** @type {!Array} */
  var map = [];
  /** @type {number} */
  i = 0;
  for (; i < this.sinkList.length; ++i) {
    if (this.sinkList[i][0] === a && this.sinkList[i][1] === b) {
      /** @type {!Array} */
      map[map.length] = [n, V];
    } else {
      map[map.length] = this.sinkList[i];
    }
  }
  /** @type {!Array} */
  this.sinkList = map;
};
/**
 * @param {!Object} a
 * @param {!Object} b
 * @return {undefined}
 */
TextArea.prototype.removeFromSinkList = function(a, b) {
  var i;
  /** @type {!Array} */
  var restOfArray = [];
  /** @type {number} */
  i = 0;
  for (; i < this.sinkList.length; ++i) {
    if (this.sinkList[i][0] !== a || this.sinkList[i][1] !== b) {
      restOfArray[restOfArray.length] = this.sinkList[i];
    }
  }
  /** @type {!Array} */
  this.sinkList = restOfArray;
};
/**
 * @return {undefined}
 */
TextArea.prototype.clearSinkList = function() {
  var pinBytes = this.sinkList;
  var i = pinBytes.length;
  var p = vim.model;
  var thatpos;
  /** @type {!Array} */
  this.sinkList = [];
  /** @type {number} */
  thatpos = 0;
  for (; thatpos < i; ++thatpos) {
    p.recacheCell(pinBytes[thatpos][0], pinBytes[thatpos][1]);
  }
};
/**
 * @return {undefined}
 */
TextArea.prototype.hotfixPadWithSpaces = function() {
  var i;
  var x;
  var m;
  /** @type {number} */
  i = 0;
  for (; i < this.rawText.length; ++i) {
    if (typeof this.rawText[i] !== "undefined" && typeof arguments[i] !== "undefined") {
      /** @type {number} */
      x = 0;
      /** @type {number} */
      m = -1;
      for (; x < this.rawText[i].length; ++x) {
        /** @type {number} */
        m = this.rawText[i].charAt(x) === " " ? m : x;
      }
      this.rawText[i] = this.rawText[i].substring(0, m + 1);
      /** @type {number} */
      x = 0;
      for (; x < arguments[i]; ++x) {
        this.rawText[i] += " ";
      }
    }
  }
  this.initTextAndSpecialAreas();
};
/**
 * @return {undefined}
 */
TextArea.prototype.hotfixSpaceLinesToEmptyLines = function() {
  var i;
  var iFormat;
  var c;
  /** @type {number} */
  i = 0;
  for (; i < this.rawText.length; i = i + 1) {
    /** @type {boolean} */
    c = true;
    /** @type {number} */
    iFormat = 0;
    for (; iFormat < this.rawText[i].length; iFormat = iFormat + 1) {
      if (this.rawText[i].charAt(iFormat) !== " " && this.rawText[i].charAt(iFormat) !== "\n") {
        /** @type {boolean} */
        c = false;
        break;
      }
    }
    if (c) {
      /** @type {string} */
      this.rawText[i] = "";
    }
  }
  this.initTextAndSpecialAreas();
};
/**
 * @return {undefined}
 */
TextArea.prototype.hotfixEmptyLinesToSpaceLines = function() {
  var i;
  var iFormat;
  var c;
  /** @type {number} */
  i = 0;
  for (; i < this.rawText.length; i = i + 1) {
    /** @type {boolean} */
    c = true;
    /** @type {number} */
    iFormat = 0;
    for (; iFormat < this.rawText[i].length; iFormat = iFormat + 1) {
      if (this.rawText[i].charAt(iFormat) !== " " && this.rawText[i].charAt(iFormat) !== "\n") {
        /** @type {boolean} */
        c = false;
        break;
      }
    }
    if (c) {
      /** @type {string} */
      this.rawText[i] = " ";
    }
  }
  this.initTextAndSpecialAreas();
};
/**
 * @param {number} id
 * @param {string} pluginMediaElement
 * @return {undefined}
 */
TextArea.prototype.hotfixTextLine = function(id, pluginMediaElement) {
  /** @type {string} */
  this.rawText[id] = pluginMediaElement;
  this.initTextAndSpecialAreas();
};
/**
 * @return {undefined}
 */
TextArea.prototype.hotfixNoExtraSpacesbutEmptyLines = function() {
  var g;
  var i;
  var d;
  var ind;
  /** @type {number} */
  g = 0;
  for (; g < this.rawText.length; g = g + 1) {
    /** @type {boolean} */
    d = true;
    /** @type {number} */
    i = 0;
    /** @type {number} */
    ind = -1;
    for (; i < this.rawText[g].length; i = i + 1) {
      /** @type {number} */
      ind = this.rawText[g].charAt(i) === " " ? ind : i;
      if (this.rawText[g].charAt(i) !== " " && this.rawText[g].charAt(i) !== "\n") {
        /** @type {boolean} */
        d = false;
      }
    }
    if (d) {
      /** @type {string} */
      this.rawText[g] = " ";
    } else {
      this.rawText[g] = this.rawText[g].substring(0, ind + 1);
    }
  }
  this.initTextAndSpecialAreas();
};
/**
 * @param {undefined} id
 * @param {undefined} compilers
 * @return {?}
 */
TextArea.prototype.getSearchClosestWord = function(id, compilers) {
  var d = this.toJoinedOffset(id, compilers);
  var f;
  var r;
  var note;
  var chSecond;
  f = vim.motionsFSM.getClosestWordForSearch(d, this.joinedText);
  if (f >= 0) {
    r = vim.motionsFSM.getEndCurrentWord(f, this.joinedText);
    if (r >= 0) {
      note = this.joinedText.substring(f, r + 1);
      note = note.replace(/([.*+?^$|(){}\[\]])/g, "\\$1");
      chSecond = this.joinedText.charAt(f).toUpperCase();
      if (chSecond >= "A" && chSecond <= "Z" || chSecond >= "0" && chSecond <= "9" || chSecond === "@") {
        /** @type {string} */
        note = "\\<" + note + "\\>";
      }
    }
  }
  return note;
};
/**
 * @param {string} type
 * @return {undefined}
 */
TextArea.prototype.highlight = function(type) {
  var currentMQ;
  var wrapperKeyword;
  var match;
  var num;
  var enable_keys;
  var i;
  var start;
  if (typeof type === "undefined") {
    /** @type {!Array} */
    this.highlights = [];
    return;
  }
  /** @type {!Array} */
  this.highlights = [];
  type = type.substr(1);
  /** @type {boolean} */
  num = type.indexOf("\\<") === 0;
  /** @type {boolean} */
  enable_keys = type.length > 2 && type.indexOf("\\>") === type.length - 2;
  /** @type {string} */
  wrapperKeyword = (num ? "\\b" : "") + type.substr(num ? 2 : 0, type.length - (num ? 2 : 0) - (enable_keys ? 2 : 0)) + (enable_keys ? "\\b" : "");
  /** @type {!RegExp} */
  currentMQ = new RegExp(wrapperKeyword, "g");
  /** @type {number} */
  i = 0;
  for (; i < this.text.length; ++i) {
    do {
      /** @type {(Array<string>|null)} */
      match = currentMQ.exec(this.text[i]);
      /** @type {(boolean|null)} */
      start = match && match[0] !== "";
      if (start) {
        this.highlights.push({
          y : this.topY + i,
          sx : this.topX + match.index,
          ex : this.topX + match.index + match[0].length - 1
        });
      }
    } while (start);
  }
};
/**
 * @param {!Object} f
 * @param {!Object} j
 * @return {?}
 */
TextArea.prototype.isHighlighted = function(f, j) {
  var i;
  /** @type {number} */
  i = 0;
  for (; i < this.highlights.length; ++i) {
    if (this.highlights[i].y === j && this.highlights[i].sx <= f && this.highlights[i].ex >= f) {
      return true;
    }
    if (this.highlights[i].y > j) {
      break;
    }
  }
  return false;
};
/**
 * @param {?} absX
 * @param {?} y
 * @param {boolean} connection
 * @param {number} from
 * @return {?}
 */
TextArea.prototype.getNextHighlightedPosition = function(absX, y, connection, from) {
  var i;
  if (this.highlights.length === 0) {
    return undefined;
  }
  if (connection) {
    /** @type {number} */
    i = 0;
    for (; i < this.highlights.length; ++i) {
      if (this.highlights[i].y > y || this.highlights[i].y === y && this.highlights[i].sx > absX) {
        break;
      }
    }
  } else {
    /** @type {number} */
    i = this.highlights.length - 1;
    for (; i >= 0; --i) {
      if (this.highlights[i].y < y || this.highlights[i].y === y && this.highlights[i].ex < absX) {
        break;
      }
    }
  }
  if (i === -1) {
    /** @type {number} */
    i = this.highlights.length - 1;
  } else {
    if (i === this.highlights.length) {
      /** @type {number} */
      i = 0;
    }
  }
  if (from > 1) {
    /** @type {number} */
    i = (i + (from - 1) * (connection ? 1 : -1)) % this.highlights.length;
    if (i < 0) {
      i = i + this.highlights.length;
    }
  }
  return {
    x : this.highlights[i].sx,
    y : this.highlights[i].y
  };
};
/**
 * @param {!Object} coords
 * @return {?}
 */
TextArea.prototype.yankTextInRange = function(coords) {
  var y;
  var i;
  var messageStart;
  var tempMarkup;
  var temp;
  if (coords.sy > coords.endY || coords.sy === coords.ey && coords.sx > coords.ex) {
    temp = coords.sx;
    coords.sx = coords.ex;
    coords.ex = temp;
    temp = coords.sy;
    coords.sy = coords.ey;
    coords.ey = temp;
  }
  /** @type {number} */
  i = coords.sx - this.topX;
  /** @type {number} */
  y = 0;
  for (; y < coords.sy - this.topY; ++y) {
    i = i + (this.getLineLength(y) + 1);
  }
  /** @type {number} */
  messageStart = coords.ex - this.topX;
  /** @type {number} */
  y = 0;
  for (; y < coords.ey - this.topY; ++y) {
    messageStart = messageStart + (this.getLineLength(y) + 1);
  }
  tempMarkup = this.joinedText.substring(i, messageStart + 1);
  if (coords.linewise === true) {
    /** @type {string} */
    tempMarkup = tempMarkup + "\n";
  }
  return tempMarkup;
};
/**
 * @param {!Object} a
 * @param {string} b
 * @return {undefined}
 */
TextArea.prototype.patchSpecialArea = function(a, b) {
  var str = this.rawText.join("\n");
  str = str.substr(0, a.rawStart) + b + str.substr(a.rawEnd + 1);
  if (str.substr(a.rawStart, 7) === "^+0..^\n" && (a.rawStart === 0 || str.charAt(a.rawStart - 1) === "\n")) {
    str = str.substr(0, a.rawStart + 6) + str.substr(a.rawStart + 7);
  }
  this.rawText = str.split("\n");
  this.initTextAndSpecialAreas();
};
/**
 * @param {string} a7
 * @return {?}
 */
TextArea.prototype.getQuoteTextObjectRange = function(a7) {
  var x = Cursor.getX();
  var y = Cursor.getY();
  var e = x;
  var f;
  var receiver = a7.charAt(1);
  var u;
  var p;
  /** @type {boolean} */
  u = false;
  for (; x - 1 >= this.topX && this.getLetter(x - 1, y) !== receiver;) {
    /** @type {number} */
    x = x - 1;
  }
  if (this.getLetter(x - 1, y) === receiver) {
    /** @type {boolean} */
    u = true;
    /** @type {number} */
    x = x - 1;
    /** @type {number} */
    e = x;
  }
  if (!u) {
    for (; x + 1 <= this.topX + this.getLineLength(y - this.topY) - 1 && this.getLetter(x + 1, y) !== receiver;) {
      x = x + 1;
    }
    if (this.getLetter(x + 1, y) === receiver) {
      /** @type {boolean} */
      u = true;
      x = x + 1;
      e = x;
    }
  }
  /** @type {boolean} */
  p = false;
  if (u) {
    for (; e + 1 <= this.topX + this.getLineLength(y - this.topY) - 1 && this.getLetter(e + 1, y) !== receiver;) {
      e = e + 1;
    }
    if (this.getLetter(e + 1, y) === receiver) {
      /** @type {boolean} */
      p = true;
      e = e + 1;
    }
  }
  return {
    sx : x,
    sy : y,
    ex : e,
    ey : y,
    cancel : !u || !p
  };
};
/**
 * @param {boolean} query
 * @param {number} w
 * @return {?}
 */
TextArea.prototype.getParagraphObjectRange = function(query, w) {
  var xi;
  var g;
  var ax = this.topX;
  var ay = Cursor.getY();
  var x;
  var y;
  /** @type {boolean} */
  var onDenyRecovery = false;
  var t;
  /** @type {boolean} */
  var b = false;
  if (!(this.getLetter(ax, ay) === " " && this.getLineLength(ay - this.topY) === 1)) {
    for (; ay > this.topY && !(this.getLetter(ax, ay - 1) === " " && this.getLineLength(ay - 1 - this.topY) === 1);) {
      /** @type {number} */
      ay = ay - 1;
    }
  }
  if (!query) {
    t = this.getNextParagraphStart(ax, ay, w);
    x = t.x;
    y = t.y;
    if (x === ax && y === ay) {
      /** @type {boolean} */
      onDenyRecovery = true;
    } else {
      if (y !== this.topY + this.getNumberOfLines() - 1 || this.getLineLength(y - this.topY) !== 1 || this.getLetter(x, y) === " ") {
        /** @type {number} */
        y = y - 1;
        /** @type {number} */
        x = this.topX + this.getLineLength(y - this.topY) - 1;
      }
    }
  } else {
    x = ax;
    y = ay;
    /** @type {number} */
    xi = 0;
    for (; xi < w; ++xi) {
      /** @type {boolean} */
      b = this.getLetter(x, y) === " " && this.getLineLength(y - this.topY) === 1;
      if (b) {
        for (; y < this.topY + this.getNumberOfLines() && this.getLetter(x, y) === " " && this.getLineLength(y - this.topY) === 1;) {
          y = y + 1;
        }
        if (xi === w - 1) {
          if (y !== this.topY + this.getNumberOfLines() - 1 || this.getLineLength(y - this.topY) !== 1 || this.getLetter(x, y) === " ") {
            /** @type {number} */
            y = y - 1;
            /** @type {number} */
            x = this.topX + this.getLineLength(y - this.topY) - 1;
          }
        }
      } else {
        x = this.topX;
        for (; y > this.topY && this.getLetter(x, y) === " " && this.getLineLength(y - this.topY) === 1;) {
          /** @type {number} */
          y = y - 1;
        }
        t = this.getNextParagraphStart(x, y, 1);
        if (x === t.x && y === t.y) {
          /** @type {boolean} */
          onDenyRecovery = true;
          break;
        } else {
          x = t.x;
          y = t.y;
          if (xi === w - 1) {
            if (y !== this.topY + this.getNumberOfLines() - 1 || this.getLineLength(y - this.topY) !== 1 || this.getLetter(x, y) === " ") {
              /** @type {number} */
              y = y - 1;
              /** @type {number} */
              x = this.topX + this.getLineLength(y - this.topY) - 1;
            }
          }
        }
      }
    }
  }
  return {
    sx : ax,
    sy : ay,
    ex : x,
    ey : y,
    cancel : onDenyRecovery
  };
};
/**
 * @param {number} firstVisibleNodeIndex
 * @return {?}
 */
TextArea.prototype.getCurrentSentenceStartOffset = function(firstVisibleNodeIndex) {
  var index;
  /** @type {number} */
  var i = firstVisibleNodeIndex;
  var commonIndex;
  var start;
  var str = this.joinedText;
  var position;
  var k;
  var b;
  position = i;
  /** @type {boolean} */
  start = false;
  commonIndex = i;
  for (; i > 0 && !start;) {
    /** @type {number} */
    i = i - 1;
    if (i === 0) {
      /** @type {boolean} */
      start = true;
      /** @type {number} */
      position = i;
    } else {
      if (i > 1 && i < str.length && str.charAt(i) === " " && str.charAt(i - 1) === "\n" && str.charAt(i + 1) === "\n") {
        /** @type {boolean} */
        start = true;
        /** @type {number} */
        position = i;
      } else {
        if (str.charAt(i) === "." || str.charAt(i) === "?" || str.charAt(i) === "!") {
          /** @type {boolean} */
          start = true;
          /** @type {boolean} */
          k = false;
          /** @type {boolean} */
          b = false;
          /** @type {number} */
          index = i;
          for (; index + 1 < str.length && start !== false && k === false;) {
            if (!b && ")]\"'".indexOf(str.charAt(index + 1)) !== -1) {
              /** @type {number} */
              index = index + 1;
            } else {
              if (" \n\t".indexOf(str.charAt(index + 1)) !== -1) {
                /** @type {boolean} */
                b = true;
                /** @type {number} */
                index = index + 1;
              } else {
                if (!b) {
                  /** @type {boolean} */
                  start = false;
                } else {
                  /** @type {boolean} */
                  k = true;
                  /** @type {number} */
                  position = index + 1;
                }
                break;
              }
            }
          }
          if (index + 1 === str.length) {
            /** @type {number} */
            position = str.length - 1;
          }
        }
      }
    }
  }
  if (i === 0 && !start) {
    /** @type {number} */
    position = 0;
  }
  return position;
};
/**
 * @param {boolean} src
 * @param {number} width
 * @return {?}
 */
TextArea.prototype.getSentenceObjectRange = function(src, width) {
  var whatToScale;
  var x = Cursor.getX();
  var y = Cursor.getY();
  var left;
  var top;
  var e;
  var l;
  var s = this.joinedText;
  var d;
  var i = this.toJoinedOffset(x, y);
  var s_i = i;
  var position;
  for (; i > 0 && ")]\"'".indexOf(s.charAt(i)) !== -1;) {
    /** @type {number} */
    i = i - 1;
  }
  if (s.charAt(i) !== ".") {
    i = s_i;
  }
  d = this.getCurrentSentenceStartOffset(i);
  if (d < i) {
    position = this.toPosition(d);
    x = position.x;
    y = position.y;
    /** @type {boolean} */
    l = false;
  } else {
    /** @type {boolean} */
    l = true;
  }
  if (!src) {
    e = this.getNextSentenceStart(x, y, width - 1);
    left = e.x;
    top = e.y;
    e = this.getFirstAvailableSentenceEnd(left, top, 1);
    left = e.x;
    top = e.y;
  } else {
    if (l) {
      for (; i > 0 && (s.charAt(i) === " " || i + 2 < s.length && s.charAt(i) === "\n" && s.charAt(i + 1) === " " && s.charAt(i + 2) !== "\n");) {
        /** @type {number} */
        i = i - 1;
      }
      if (s.charAt(i) === "\n") {
        i = i + 1;
      }
    } else {
      i = d;
    }
    position = this.toPosition(i);
    x = position.x;
    y = position.y;
    /** @type {number} */
    whatToScale = width;
    for (; whatToScale > 0;) {
      if (l) {
        for (; i < s.length - 1 && !(s.charAt(i) !== " " || i + 2 < s.length && s.charAt(i) === "\n" && s.charAt(i + 1) === " " && s.charAt(i + 2) === "\n");) {
          i = i + 1;
        }
        if (s.charAt(i) === "\n" && i < s.length - 1) {
          i = i + 1;
        }
        /** @type {boolean} */
        l = false;
      } else {
        if ((i === 0 || s.charAt(i - 1) === "\n") && s.charAt(i) === " " && (i + 1 === s.length || s.charAt(i + 1) === "\n")) {
          i = i + 2;
          if (i === s.length) {
            /** @type {number} */
            i = i - 1;
          }
        } else {
          position = this.toPosition(i);
          e = this.getFirstAvailableSentenceEnd(position.x, position.y, 1);
          i = this.toJoinedOffset(e.x, e.y);
          if (i < s.length) {
            i = i + 1;
          }
          if (i < s.length && s.charAt(i) === "\n") {
            i = i + 1;
          }
        }
        /** @type {boolean} */
        l = s.charAt(i) === " " && !((i === 0 || s.charAt(i - 1) === "\n") && (i === s.length - 1 || s.charAt(i + 1) === "\n"));
      }
      whatToScale--;
      if (whatToScale === 0) {
        if (i > 0) {
          /** @type {number} */
          i = i - 1;
        }
        if (i > 0 && s.charAt(i) === "\n") {
          /** @type {number} */
          i = i - 1;
        }
      }
    }
    position = this.toPosition(i);
    left = position.x;
    top = position.y;
  }
  return {
    sx : x,
    sy : y,
    ex : left,
    ey : top,
    cancel : false
  };
};
/**
 * @param {string} c
 * @param {boolean} lst
 * @return {?}
 */
TextArea.prototype.charType = function(c, lst) {
  if (c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c === "_" || c >= "0" && c <= "9") {
    return 1;
  } else {
    if (c === " " || c === "\n" || c === "\t") {
      return 2;
    }
  }
  return lst ? 1 : 3;
};
/**
 * @param {boolean} selector
 * @param {number} length
 * @param {boolean} string
 * @return {?}
 */
TextArea.prototype.getWordObjectRange = function(selector, length, string) {
  var index;
  var c;
  var sx = Cursor.getX();
  var sy = Cursor.getY();
  var x;
  var y;
  var line;
  var k;
  var myStartIndex = this.charType(this.getLetter(sx, sy), string);
  /** @type {boolean} */
  var onDenyRecovery = false;
  for (; sx - 1 >= this.topX && this.charType(this.getLetter(sx - 1, sy), string) === myStartIndex;) {
    /** @type {number} */
    sx = sx - 1;
  }
  if (!selector) {
    line = this.nextWordPos(sx, sy, string, length - (myStartIndex !== 2 ? 1 : 0));
    x = line.x;
    y = line.y;
    myStartIndex = this.charType(this.getLetter(x, y), string);
    for (; x + 1 <= this.topX + this.getLineLength(y - this.topY) - 1 && myStartIndex === this.charType(this.getLetter(x + 1, y), string);) {
      x = x + 1;
    }
  } else {
    x = sx;
    y = sy;
    /** @type {number} */
    index = 0;
    for (; index < length; ++index) {
      /** @type {boolean} */
      k = this.charType(this.getLetter(x, y), string) === 2 && this.getLineLength(y - this.topY) !== 1;
      if (k) {
        line = this.nextWordPos(x, y, string, 1);
        y = line.y;
        x = line.x;
        if (index === length - 1) {
          if (!(line.y === this.topY + this.getNumberOfLines() - 1 && line.x === this.topX + this.getLineLength(line.y - this.topY) - 1)) {
            if (x > this.topX) {
              /** @type {number} */
              x = x - 1;
            } else {
              /** @type {number} */
              y = y - 1;
              /** @type {number} */
              x = this.topX + this.getLineLength(y - this.topY) - 1;
            }
          }
        }
      } else {
        if (this.getLetter(x, y) === " " && this.getLineLength(y - this.topY) === 1) {
          if (index !== length - 1) {
            if (y < this.topY + this.getNumberOfLines() - 1) {
              y = y + 1;
              x = this.topX;
            }
          }
        } else {
          myStartIndex = this.charType(this.getLetter(x, y), string);
          for (; x + 1 <= this.topX + this.getLineLength(y - this.topY) - 1 && myStartIndex === this.charType(this.getLetter(x + 1, y), string);) {
            x = x + 1;
          }
          if (index < length - 1) {
            x = x + 1;
            if (x > this.topX + this.getLineLength(y - this.topY) - 1) {
              if (y < this.topY + this.getNumberOfLines() - 1) {
                y = y + 1;
                x = this.topX;
              } else {
                /** @type {boolean} */
                onDenyRecovery = true;
              }
            }
          }
        }
      }
    }
  }
  return {
    sx : sx,
    sy : sy,
    ex : x,
    ey : y,
    cancel : onDenyRecovery
  };
};
/**
 * @param {string} key
 * @param {boolean} prop
 * @param {number} start
 * @return {?}
 */
TextArea.prototype.getBlockObjectRange = function(key, prop, start) {
  var x = Cursor.getX();
  var y = Cursor.getY();
  var ex;
  var ly;
  var onDenyRecovery;
  var active;
  var i;
  var value;
  var m;
  var w;
  /** @type {string} */
  var k = "[]()<>{}";
  var node;
  var player;
  if (key === "b") {
    /** @type {string} */
    key = "(";
  } else {
    if (key === "B") {
      /** @type {string} */
      key = "{";
    }
  }
  /** @type {number} */
  w = k.indexOf(key);
  /** @type {number} */
  i = w - (w % 2 === 0 ? 0 : 1);
  /** @type {string} */
  value = k.charAt(i);
  /** @type {boolean} */
  active = this.getLetter(x, y) === value;
  if (active) {
    /** @type {number} */
    start = start - 1;
  }
  if (start > 0) {
    node = this.findUnmatchedBracket(x, y, value, start);
    /** @type {boolean} */
    onDenyRecovery = x === node.x && y === node.y;
    x = node.x;
    y = node.y;
  }
  if (onDenyRecovery !== true) {
    player = this.findMatchingBracket(x, y);
    /** @type {boolean} */
    onDenyRecovery = x === player.x && y === player.y;
    ex = player.x;
    ly = player.y;
  }
  return {
    sx : x,
    sy : y,
    ex : ex,
    ey : ly,
    cancel : onDenyRecovery
  };
};
/**
 * @param {string} b
 * @param {number} a
 * @return {?}
 */
TextArea.prototype.getTextObjectRange = function(b, a) {
  /** @type {!Array} */
  var d = ["[]", "()", "<>", "{}"];
  var g;
  /** @type {boolean} */
  var expr = b.charAt(0) === "i";
  var key = b.charAt(1);
  /** @type {boolean} */
  var c = "[]()b<>{}B".indexOf(key) !== -1;
  /** @type {boolean} */
  var r = "\"`'".indexOf(key) !== -1;
  /** @type {boolean} */
  var l = true;
  /** @type {boolean} */
  var ex = true;
  var q = this.getLetter(Cursor.getX(), Cursor.getY());
  var op;
  var x = Cursor.getX();
  var y = Cursor.getY();
  var e = x;
  var notifyY = y;
  var onDenyRecovery;
  if (r) {
    return this.getQuoteTextObjectRange(b);
  }
  if (c) {
    return this.getBlockObjectRange(key, expr, a);
  }
  if (key === "p") {
    return this.getParagraphObjectRange(expr, a);
  }
  if (key === "w" || key === "W") {
    return this.getWordObjectRange(expr, a, key === "W");
  }
  if (key === "s") {
    return this.getSentenceObjectRange(expr, a);
  }
  if (key === "t") {
    alert("tag objects are not supported yet");
  }
  return {
    sx : x,
    sy : y,
    ex : e,
    ey : notifyY,
    cancel : onDenyRecovery
  };
};
/**
 * @param {number} a
 * @param {number} x
 * @param {number} n
 * @return {?}
 */
TextArea.prototype.getNextParagraphStart = function(a, x, n) {
  var result = this.toJoinedOffset(a, x);
  var value;
  var i;
  /** @type {number} */
  i = 0;
  for (; i < n && result !== -1; ++i) {
    value = vim.motionsFSM.getNextParagraphStart(result, this.joinedText);
    result = value >= 0 && value !== result ? value : -1;
  }
  return result >= 0 ? this.toPosition(result) : {
    x : a,
    y : x
  };
};
/**
 * @param {number} key
 * @param {number} val
 * @param {number} diff
 * @return {?}
 */
TextArea.prototype.getPrevParagraphStart = function(key, val, diff) {
  var index = this.toJoinedOffset(key, val);
  var oldIndex;
  var delta;
  /** @type {number} */
  delta = 0;
  for (; delta < diff && index !== -1; ++delta) {
    oldIndex = vim.motionsFSM.getPrevParagraphStart(index, this.joinedText);
    index = oldIndex >= 0 && oldIndex !== index ? oldIndex : -1;
  }
  return index >= 0 ? this.toPosition(index) : {
    x : key,
    y : val
  };
};
/**
 * @param {number} position
 * @param {number} top
 * @param {number} delay
 * @return {?}
 */
TextArea.prototype.getFirstAvailableSentenceEnd = function(position, top, delay) {
  var index = this.toJoinedOffset(position, top);
  var oldIndex;
  var delta;
  /** @type {number} */
  delta = 0;
  for (; delta < delay && index !== -1; ++delta) {
    oldIndex = vim.motionsFSM.getFirstAvailableSentenceEnd(index, this.joinedText);
    index = oldIndex >= 0 && oldIndex !== index ? oldIndex : -1;
  }
  return index >= 0 ? this.toPosition(index) : {
    x : position,
    y : top
  };
};
/**
 * @param {string} key
 * @param {number} val
 * @param {number} diff
 * @return {?}
 */
TextArea.prototype.getNextSentenceStart = function(key, val, diff) {
  var index = this.toJoinedOffset(key, val);
  var oldIndex;
  var delta;
  /** @type {number} */
  delta = 0;
  for (; delta < diff && index !== -1; ++delta) {
    oldIndex = vim.motionsFSM.getNextSentenceStart(index, this.joinedText);
    index = oldIndex >= 0 && oldIndex !== index ? oldIndex : -1;
  }
  return index >= 0 ? this.toPosition(index) : {
    x : key,
    y : val
  };
};
/**
 * @param {number} a
 * @param {number} v
 * @param {number} size
 * @return {?}
 */
TextArea.prototype.getPrevSentenceStart = function(a, v, size) {
  var index;
  var idx = this.toJoinedOffset(a, v);
  var l;
  var j;
  var minPage;
  var h;
  var str = this.joinedText;
  var i;
  var o;
  var c;
  for (; idx > 0 && this.joinedText.charAt(idx) === " " || this.joinedText.charAt(idx) === "\n";) {
    --idx;
  }
  i = idx;
  /** @type {number} */
  j = 0;
  for (; j < size && i !== -1; ++j) {
    /** @type {boolean} */
    h = false;
    minPage = idx;
    for (; idx > 0 && !h;) {
      /** @type {number} */
      idx = idx - 1;
      if (idx === 0) {
        /** @type {boolean} */
        h = true;
        /** @type {number} */
        i = idx;
      } else {
        if (idx > 1 && idx < str.length && str.charAt(idx) === " " && str.charAt(idx - 1) === "\n" && str.charAt(idx + 1) === "\n") {
          /** @type {boolean} */
          h = true;
          /** @type {number} */
          i = idx;
        } else {
          if (str.charAt(idx) === "." || str.charAt(idx) === "?" || str.charAt(idx) === "!") {
            /** @type {boolean} */
            h = true;
            /** @type {boolean} */
            o = false;
            /** @type {boolean} */
            c = false;
            /** @type {number} */
            index = idx;
            for (; index + 1 < str.length && h !== false && o === false;) {
              if (!c && ")]\"'".indexOf(str.charAt(index + 1)) !== -1) {
                /** @type {number} */
                index = index + 1;
              } else {
                if (" \n\t".indexOf(str.charAt(index + 1)) !== -1) {
                  /** @type {boolean} */
                  c = true;
                  /** @type {number} */
                  index = index + 1;
                } else {
                  if (!c) {
                    /** @type {boolean} */
                    h = false;
                  } else {
                    /** @type {boolean} */
                    o = true;
                    /** @type {number} */
                    i = index + 1;
                  }
                  break;
                }
              }
            }
            if (index + 1 === str.length) {
              /** @type {number} */
              i = str.length - 1;
            }
          }
        }
      }
    }
    if (j !== size - 1 && idx === 0) {
      /** @type {number} */
      i = -1;
      break;
    }
    if (i === minPage && i !== 0) {
      size = size + 1;
    }
  }
  return i >= 0 ? this.toPosition(i) : {
    x : a,
    y : v
  };
};
/**
 * @param {number} name
 * @param {undefined} obj
 * @param {undefined} n
 * @param {number} b
 * @param {boolean} w
 * @return {undefined}
 */
TextArea.prototype.addLocalMark = function(name, obj, n, b, w) {
  /** @type {number} */
  var i = n - this.getTopY();
  /** @type {number} */
  var a = obj - this.getTopX();
  var data = this.marks[name];
  /** @type {number} */
  var key = -1;
  /** @type {number} */
  var pid = -1;
  var p = vim.model;
  if (!p.isLocalMark(name)) {
    return;
  }
  if (!data) {
    this.marks[name] = {};
    data = this.marks[name];
  } else {
    key = data.col;
    pid = data.row;
  }
  /** @type {number} */
  data.mark = name;
  /** @type {number} */
  data.col = a;
  /** @type {number} */
  data.row = i;
  data.yOffset = typeof b !== "undefined" ? b : 10;
  data.fixed = typeof w !== "undefined" ? w : false;
  p.recacheCell(obj, n);
  if (pid !== -1 && key !== -1) {
    p.recacheCell(this.getTopX() + key, this.getTopY() + pid);
  }
};
/**
 * @param {!Object} name
 * @return {undefined}
 */
TextArea.prototype.deleteLocalMark = function(name) {
  var mark = this.marks[name];
  if (mark) {
    delete this.marks[name];
    vim.model.recacheCell(this.getTopX() + mark.col, this.getTopY() + mark.row);
  }
};
/**
 * @param {undefined} index
 * @param {undefined} n
 * @return {undefined}
 */
TextArea.prototype.deleteLocalMarkAtPosition = function(index, n) {
  /** @type {string} */
  var letters = "abcdefghijklmnopqrstuvwxyz";
  /** @type {number} */
  var col = index - this.getTopX();
  /** @type {number} */
  var row = n - this.getTopY();
  var boundingBoxItem;
  var i;
  /** @type {number} */
  i = 0;
  for (; i < letters.length; ++i) {
    boundingBoxItem = this.marks[letters.charAt(i)];
    if (boundingBoxItem && boundingBoxItem.col === col && boundingBoxItem.row === row) {
      delete this.marks[letters.charAt(i)];
      vim.model.recacheCell(index, n);
    }
  }
};
/**
 * @param {number} idx
 * @param {number} n
 * @param {number} row
 * @return {undefined}
 */
TextArea.prototype.updateLocalMarkY = function(idx, n, row) {
  /** @type {string} */
  var letters = "abcdefghijklmnopqrstuvwxyz";
  /** @type {number} */
  var col = idx - this.getTopX();
  /** @type {number} */
  var row = n - this.getTopY();
  var boundingBoxItem;
  var i;
  var p = vim.model;
  /** @type {number} */
  i = 0;
  for (; i < letters.length; ++i) {
    boundingBoxItem = this.marks[letters.charAt(i)];
    if (boundingBoxItem && boundingBoxItem.col === col && boundingBoxItem.row === row) {
      /** @type {number} */
      boundingBoxItem.row = row - this.getTopY();
      p.recacheCell(idx, n);
      p.recacheCell(idx, row);
    }
  }
};
/**
 * @param {number} m
 * @param {number} s
 * @param {undefined} c
 * @param {undefined} t
 * @return {undefined}
 */
TextArea.prototype.updateLocalMark = function(m, s, c, t) {
  /** @type {string} */
  var letters = "abcdefghijklmnopqrstuvwxyz";
  /** @type {number} */
  var currentType = m - this.getTopX();
  /** @type {number} */
  var complete = s - this.getTopY();
  var state;
  var i;
  var p = vim.model;
  /** @type {number} */
  i = 0;
  for (; i < letters.length; ++i) {
    state = this.marks[letters.charAt(i)];
    if (state && state.col === currentType && state.row === complete) {
      /** @type {number} */
      state.row = t - this.getTopY();
      /** @type {number} */
      state.col = c - this.getTopX();
      p.recacheCell(m, s);
      p.recacheCell(c, t);
    }
  }
};
/**
 * @return {?}
 */
TextArea.prototype.backupLocalMarks = function() {
  var entries = {};
  var i;
  for (i in this.marks) {
    entries[i] = {
      mark : this.marks[i].mark,
      col : this.marks[i].col,
      row : this.marks[i].row,
      yOffset : 0,
      fixed : this.marks[i].fixed
    };
  }
  return entries;
};
/**
 * @param {!Array} marks
 * @return {undefined}
 */
TextArea.prototype.restoreLocalMarks = function(marks) {
  var i;
  this.marks = {};
  for (i in marks) {
    this.marks[i] = {
      mark : marks[i].mark,
      col : marks[i].col,
      row : marks[i].row,
      yOffset : 0,
      fixed : marks[i].fixed
    };
  }
};
/**
 * @param {number} s
 * @param {number} t
 * @return {?}
 */
TextArea.prototype.getLocalMarkForPosition = function(s, t) {
  /** @type {string} */
  var letters = "abcdefghijklmnopqrstuvwxyz";
  /** @type {number} */
  var CAPTION = s - this.getTopX();
  /** @type {number} */
  var power = t - this.getTopY();
  var p;
  var i;
  /** @type {number} */
  i = 0;
  for (; i < letters.length; ++i) {
    p = this.marks[letters.charAt(i)];
    if (p && p.col === CAPTION && p.row === power || p && p.row === power && p.col >= this.getLineLength(p.row) && CAPTION == this.getLineLength(p.row) - 1) {
      return this.marks[letters.charAt(i)];
    }
  }
  return undefined;
};
/**
 * @param {!Object} type
 * @return {?}
 */
TextArea.prototype.getLocalMark = function(type) {
  return this.marks[type];
};
/**
 * @return {?}
 */
TextArea.prototype.hasMarkSpecialAreas = function() {
  var n;
  var item;
  /** @type {number} */
  n = 0;
  for (; n < this.areas.length; n = n + 1) {
    item = this.areas[n];
    if (item.type === "o" || item.type === "_") {
      return true;
    }
  }
  return false;
};
/**
 * @param {string} clusterShardData
 * @return {?}
 */
TextArea.prototype.convertTextToRedoText = function(clusterShardData) {
  var oStringList = clusterShardData.split("\n");
  /** @type {!Array} */
  var htmlArray = [];
  var existing_ss;
  var e;
  var i;
  var i_format;
  /** @type {number} */
  i = 0;
  for (; i < oStringList.length; ++i) {
    /** @type {string} */
    htmlArray[i] = "";
    /** @type {number} */
    i_format = 0;
    for (; i_format < oStringList[i].length; ++i_format) {
      htmlArray[i] += oStringList[i].charAt(i_format) + "|";
    }
  }
  /** @type {string} */
  existing_ss = htmlArray.join("REPLAY_ENTER|");
  if (existing_ss.length > 1 && existing_ss.charAt(existing_ss.length - 1) === "|") {
    /** @type {string} */
    existing_ss = existing_ss.substr(0, existing_ss.length - 1);
  }
  return existing_ss;
};
/**
 * @param {?} conf
 * @return {undefined}
 */
TextArea.prototype.prepareRedoForDelete = function(conf) {
  var $scope = {};
  var b;
  var facet = this.getSpecialArea(conf.sx, conf.sy);
  /** @type {number} */
  $scope.x = $scope.xAfter = conf.sx - this.getTopX();
  /** @type {number} */
  $scope.y = $scope.yAfter = conf.sy - this.getTopY();
  $scope.area = {
    type : facet.type,
    rawStart : facet.rawStart,
    origText : facet.origText,
    shownText : facet.shownText
  };
  if (conf.linewise === true) {
    /** @type {string} */
    $scope.command = "O";
    $scope.params = this.convertTextToRedoText(this.getAffectedText(conf.sx, conf.sy));
  } else {
    if (conf.sy === conf.ey) {
      if (this.getLineLength(conf.ey - this.getTopY()) === conf.ex) {
        /** @type {string} */
        $scope.command = "a";
        --$scope.x;
      } else {
        /** @type {string} */
        $scope.command = "i";
      }
      $scope.params = this.convertTextToRedoText(this.getAffectedText(conf.sx, conf.sy));
    } else {
      alert("Not implemented yet.");
    }
  }
  this.redos.push($scope);
};
/**
 * @param {!Object} settings
 * @return {undefined}
 */
TextArea.prototype.patchRawText = function(settings) {
  var normalized = this.rawText.join("\n");
  var text = settings.text;
  var end = settings.offset;
  normalized = normalized.substring(0, end) + text + normalized.substring(end + 1);
  this.rawText = normalized.split("\n");
  this.initTextAndSpecialAreas();
};
/**
 * @param {!Date} date
 * @param {!Date} y
 * @param {!Function} rotate
 * @param {string} m
 * @return {undefined}
 */
TextArea.prototype.addNewSpecialArea = function(date, y, rotate, m) {
  this.initTextAndSpecialAreas(date - this.topX, y - this.topY, rotate, m);
};
vim.email = function() {
  /**
   * @return {undefined}
   */
  function error() {
    /** @type {number} */
    action = -1;
    /** @type {string} */
    elWorkspace.style.visibility = "hidden";
    /** @type {string} */
    dBox.style.visibility = "visible";
    window.setTimeout(function() {
      value.focus();
    }, 10);
  }
  /**
   * @param {string} res
   * @param {string} status
   * @param {!Object} text
   * @param {!Element} key
   * @return {undefined}
   */
  function callback(res, status, text, key) {
    /** @type {string} */
    message.innerHTML = res;
    /** @type {string} */
    message.className = status;
    /** @type {string} */
    elWorkspace.style.visibility = "visible";
    /** @type {string} */
    dBox.style.visibility = "hidden";
    action = window.setTimeout(text || error, 3000);
    if (key) {
      /** @type {!Element} */
      value = key;
    }
  }
  /**
   * @param {!Object} result
   * @return {undefined}
   */
  function render(result) {
    var inputState = (err ? data : right ? x : bottom).value.trim();
    if (result.status === 200) {
      vim.emailaddr = inputState;
      callback("Connecting to PayPal...", "ok", function() {
      });
      show(true, true);
    } else {
      if (result.status === 201) {
        if (result.responseText == 10) {
          vim.emailaddr = inputState;
          callback("Connecting to PayPal...", "ok", function() {
          });
          show(true, true, result.responseText);
        }
      } else {
        if (result.status === 202) {
          callback((err ? "Recipient's email" : "Email") + " address is already licensed! Aborting.", "error", function() {
            error();
            show(false, false);
          });
        }
      }
    }
  }
  /**
   * @param {boolean} position
   * @param {boolean} index
   * @param {?} value
   * @return {undefined}
   */
  function show(position, index, value) {
    if (!position) {
      if (action !== -1 && message.className !== "error") {
        return;
      }
      if (action !== -1) {
        window.clearTimeout(action);
        error();
      }
    }
    if (!index) {
      /** @type {string} */
      boxChild.style.display = "none";
      /** @type {string} */
      rulerTableDiv.style.visibility = "hidden";
    }
    init();
    if (position) {
      if (fn) {
        fn(err, right, value);
      }
    } else {
      if (text) {
        text();
      }
    }
  }
  /**
   * @param {!Object} res
   * @return {undefined}
   */
  function file(res) {
    callback("Error: " + res.responseText, "error");
  }
  /**
   * @return {undefined}
   */
  function update() {
    var newappid = bottom.value.trim();
    var fragmentFilename = b.value.trim();
    newappid = newappid.replace(/\+/g, "%2b");
    fragmentFilename = fragmentFilename.replace(/\+/g, "%2b");
    p.play("menu_click");
    if (newappid === "") {
      callback("Please enter an email address.", "error", undefined, bottom);
    } else {
      if (newappid.indexOf("@") === -1) {
        callback("Email address missing @ sign.", "error", undefined, bottom);
      } else {
        if (newappid.indexOf(".", newappid.indexOf("@")) === -1) {
          callback("Email address appears to be invalid. Please recheck.", "error", undefined, bottom);
        } else {
          if (newappid !== fragmentFilename) {
            callback("The two email addresses are not the same. Please recheck.", "error", undefined, b);
          } else {
            if (!k.checked) {
              callback("You have to read and accept the Terms of Use<BR>and Privacy Policy to buy a license.", "error", undefined, k);
            } else {
              vim.fetcher.getUrl("php/prepaymentSubscribe.php", render, file, undefined, undefined, undefined, function() {
                callback("Processing email information...", "processing", function() {
                });
              }, "email=" + encodeURIComponent(newappid) + "&terms=" + (k.checked ? "true" : "false"));
            }
          }
        }
      }
    }
  }
  /**
   * @return {undefined}
   */
  function handler() {
    var newappid = data.value.trim();
    var type = cityInput.value.trim();
    var fragmentFilename = phoneNumberInput.value.trim();
    newappid = newappid.replace(/\+/g, "%2b");
    type = type.replace(/\+/g, "%2b");
    fragmentFilename = fragmentFilename.replace(/\+/g, "%2b");
    p.play("menu_click");
    if (newappid === "") {
      callback("Please enter the recipient's email address.", "error", undefined, data);
    } else {
      if (newappid.indexOf("@") === -1) {
        callback("Recipient's address missing @ sign.", "error", undefined, data);
      } else {
        if (newappid.indexOf(".", newappid.indexOf("@")) === -1) {
          callback("Recipient's address appears to be invalid. Please recheck.", "error", undefined, data);
        } else {
          if (type === "") {
            callback("Please enter the buyer's email address.", "error", undefined, cityInput);
          } else {
            if (type.indexOf("@") === -1) {
              callback("Buyer's address missing @ sign.", "error", undefined, cityInput);
            } else {
              if (type.indexOf(".", type.indexOf("@")) === -1) {
                callback("Buyer's address appears to be invalid. Please recheck.", "error", undefined, cityInput);
              } else {
                if (type !== fragmentFilename) {
                  callback("The two email addresses of the buyer are not the same. Please recheck.", "error", undefined, phoneNumberInput);
                } else {
                  vim.fetcher.getUrl("php/prepaymentSubscribe.php", render, file, undefined, undefined, undefined, function() {
                    callback("Processing email information...", "processing", function() {
                    });
                  }, "email=" + encodeURIComponent(newappid) + "&buyer_email=" + encodeURIComponent(type) + "&gift=true");
                }
              }
            }
          }
        }
      }
    }
  }
  /**
   * @return {undefined}
   */
  function check() {
    var newappid = x.value.trim();
    var fragmentFilename = target.value.trim();
    newappid = newappid.replace(/\+/g, "%2b");
    fragmentFilename = fragmentFilename.replace(/\+/g, "%2b");
    p.play("menu_click");
    if (newappid === "") {
      callback("Please enter an email address.", "error", undefined, x);
    } else {
      if (newappid.indexOf("@") === -1) {
        callback("Email address missing @ sign.", "error", undefined, x);
      } else {
        if (newappid.indexOf(".", newappid.indexOf("@")) === -1) {
          callback("Email address appears to be invalid. Please recheck.", "error", undefined, x);
        } else {
          if (newappid !== fragmentFilename) {
            callback("The two email addresses are not the same. Please recheck.", "error", undefined, target);
          } else {
            if (!idA.checked) {
              callback("You have to read and accept the Terms of Use<BR>and Privacy Policy to buy a license.", "error", undefined, idA);
            } else {
              if (!mcc.checked) {
                callback("You have to confirm that you have to log out of the server for the timer to pause.", "error", undefined, mcc);
              } else {
                vim.fetcher.getUrl("php/prepaymentSubscribe.php", render, file, undefined, undefined, undefined, function() {
                  callback("Processing email information...", "processing", function() {
                  });
                }, "email=" + encodeURIComponent(newappid) + "&terms=" + (k.checked ? "true" : "false"));
              }
            }
          }
        }
      }
    }
  }
  /**
   * @param {(Object|string)} e
   * @return {undefined}
   */
  function cancelEvent(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    } else {
      if (window.event && window.event.returnValue) {
        /** @type {boolean} */
        window.eventReturnValue = false;
      }
    }
  }
  /**
   * @param {!Object} e
   * @return {?}
   */
  function handleKeyDown(e) {
    if (e.keyCode === 27) {
      show(false, false);
      cancelEvent(e);
      return false;
    }
    return true;
  }
  /**
   * @param {!Object} e
   * @return {?}
   */
  function keydown(e) {
    if (e.charCode === 13 || e.keyCode === 13) {
      if (err) {
        handler();
      } else {
        if (right) {
          check();
        } else {
          update();
        }
      }
    }
    if (e.charCode === 32 || e.keyCode === 32) {
      cancelEvent(e);
      return false;
    }
  }
  /**
   * @param {!Function} a
   * @param {?} e
   * @param {string} item
   * @param {string} p
   * @return {undefined}
   */
  function cb(a, e, item, p) {
    /** @type {string} */
    err = item;
    /** @type {string} */
    right = p;
    /** @type {(Element|null)} */
    message = document.getElementById(err ? "gift-message" : right ? "timed-message" : "email-message");
    /** @type {(Element|null)} */
    elWorkspace = document.getElementById(err ? "gift-message-tab" : right ? "timed-message-tab" : "email-message-tab");
    /** @type {(Element|null)} */
    dBox = document.getElementById(err ? "gift-tab" : right ? "timed-tab" : "email-tab");
    /** @type {(Element|null)} */
    boxChild = document.getElementById(err ? "gift-dialog-overlay" : right ? "timed-dialog-overlay" : "email-dialog-overlay");
    /** @type {(Element|null)} */
    rulerTableDiv = document.getElementById("shadowOverlay");
    /** @type {(Element|null)} */
    b = document.getElementById("repeat-email");
    /** @type {(Element|null)} */
    bottom = document.getElementById("user-email");
    /** @type {(Element|null)} */
    x = document.getElementById("timed-email");
    /** @type {(Element|null)} */
    k = document.getElementById("buyer-confirm-terms");
    /** @type {(Element|null)} */
    data = document.getElementById("recipient-email");
    /** @type {(Element|null)} */
    cityInput = document.getElementById("buyer-email");
    /** @type {(Element|null)} */
    phoneNumberInput = document.getElementById("repeat-buyer");
    /** @type {(Element|null)} */
    x = document.getElementById("timed-email");
    /** @type {(Element|null)} */
    target = document.getElementById("repeat-timed-email");
    /** @type {(Element|null)} */
    idA = document.getElementById("timed-confirm-terms");
    /** @type {(Element|null)} */
    mcc = document.getElementById("timed-logout-notice");
    /** @type {(Element|null)} */
    value = err ? data : right ? x : bottom;
    /** @type {!Function} */
    fn = a;
    text = e;
    /** @type {number} */
    action = -1;
    vim.screens["game-screen"].disableKeys();
    /** @type {string} */
    rulerTableDiv.style.visibility = "visible";
    self.bind("#confirm-email-button", "click", update);
    self.bind("#confirm-gift-button", "click", handler);
    self.bind("#confirm-timed-button", "click", check);
    window.addEventListener("keypress", keydown, false);
    window.addEventListener("keydown", handleKeyDown, false);
    if (err) {
      /** @type {string} */
      data.value = "";
      /** @type {string} */
      cityInput.value = "";
      /** @type {string} */
      phoneNumberInput.value = "";
    } else {
      if (right) {
        /** @type {string} */
        x.value = "";
        /** @type {string} */
        target.value = "";
        /** @type {string} */
        idA.checked = "";
        /** @type {string} */
        mcc.checked = "";
      } else {
        /** @type {string} */
        bottom.value = "";
        /** @type {string} */
        b.value = "";
        /** @type {string} */
        k.checked = "";
      }
    }
    /** @type {string} */
    boxChild.style.display = "block";
  }
  /**
   * @return {undefined}
   */
  function init() {
    vim.screens["game-screen"].enableKeys();
    self.unbind("#confirm-email-button", "click", update);
    self.unbind("#confirm-gift-button", "click", handler);
    self.unbind("#confirm-timed-button", "click", check);
    window.removeEventListener("keypress", keydown, false);
    window.removeEventListener("keydown", handleKeyDown, false);
  }
  /**
   * @return {?}
   */
  function writeTextArgs() {
    return vim.emailaddr && vim.emailaddr.length > 0;
  }
  /**
   * @param {!Function} props
   * @param {?} container
   * @param {string} node
   * @param {string} position
   * @return {?}
   */
  function showEditField(props, container, node, position) {
    cb(props, container, node, position);
    /** @type {string} */
    dBox.style.visibility = "visible";
    value.focus();
    return false;
  }
  var self = vim.dom;
  var p = vim.audio;
  var fn;
  var text;
  var message;
  var elWorkspace;
  var dBox;
  var bottom;
  var boxChild;
  var rulerTableDiv;
  var b;
  var k;
  var action;
  var value;
  var err;
  var right;
  var data;
  var cityInput;
  var phoneNumberInput;
  var x;
  var target;
  var idA;
  var mcc;
  return {
    hasEmailAddress : writeTextArgs,
    confirmEmailAddress : showEditField
  };
}();
vim.stats = function() {
  /**
   * @param {number} bp
   * @return {?}
   */
  function translate(bp) {
    /** @type {number} */
    var firstBytePositionOfNextBlock = bp / 1000;
    /** @type {number} */
    var v = Math.floor(firstBytePositionOfNextBlock % 60);
    /** @type {number} */
    var d1 = Math.min(Math.floor(firstBytePositionOfNextBlock / 60), 59);
    if (isNaN(bp)) {
      return "";
    }
    if (d1 === 59) {
      /** @type {number} */
      v = 59;
    }
    if (firstBytePositionOfNextBlock < 0) {
      return "00:00";
    }
    return (d1 < 10 ? "0" + d1 : d1) + ":" + (v < 10 ? "0" + v : v);
  }
  /**
   * @return {?}
   */
  function ktoz() {
    return Math.max(m, vim.model.getLevel());
  }
  /**
   * @param {number} i
   * @return {undefined}
   */
  function redraw(i) {
    /** @type {number} */
    m = Math.max(ktoz(), i);
    /** @type {boolean} */
    events[i].valid = true;
    /** @type {number} */
    events[i].startTime = Date.now();
    /** @type {number} */
    events[i].keystrokes = 0;
    /** @type {number} */
    events[i].deaths = 0;
  }
  /**
   * @param {undefined} idx
   * @return {undefined}
   */
  function addWorkingDay(idx) {
    var data = events[idx];
    if (data.valid) {
      /** @type {number} */
      data.endTime = Date.now();
      /** @type {number} */
      data.completionTime = data.endTime - data.startTime;
      if (!data.bestCompletionTime || data.bestCompletionTime > data.completionTime) {
        /** @type {number} */
        data.bestCompletionTime = data.completionTime;
      }
      if (typeof data.minKeystrokes === "undefined" || data.minKeystrokes > data.keystrokes) {
        data.minKeystrokes = data.keystrokes;
      }
      if (typeof data.minDeaths === "undefined" || data.minDeaths > data.deaths) {
        data.minDeaths = data.deaths;
      }
    }
  }
  /**
   * @param {undefined} p_type
   * @param {number} p_id
   * @return {undefined}
   */
  function createSimpleElement(p_type, p_id) {
    events[p_type].keystrokes += p_id || 1;
  }
  /**
   * @param {undefined} p
   * @return {undefined}
   */
  function updatecolorfrompointer(p) {
    events[p].deaths += 1;
  }
  /**
   * @param {undefined} key
   * @return {undefined}
   */
  function createVerificationObjects(key) {
    /** @type {boolean} */
    events[key].valid = false;
  }
  /**
   * @return {undefined}
   */
  function initSampler() {
    var i;
    /** @type {number} */
    m = 1;
    /** @type {number} */
    i = 0;
    for (; i < events.length; ++i) {
      events[i] = {};
    }
  }
  /**
   * @return {undefined}
   */
  function setupGallery() {
    var i;
    /** @type {number} */
    i = 0;
    for (; i < events.length; ++i) {
      delete events[i].minGroupCompletionTime;
      delete events[i].minGroupCompletionTimeEmail;
      delete events[i].minGroupKeystrokes;
      delete events[i].minGroupKeystrokesEmail;
      delete events[i].minGroupDeaths;
      delete events[i].minGroupDeathsEmail;
    }
  }
  /**
   * @param {string} message
   * @param {string} type
   * @param {string} editor
   * @return {?}
   */
  function register(message, type, editor) {
    /** @type {string} */
    var command = "";
    /** @type {boolean} */
    var fromServer = typeof type !== "undefined" && type !== "";
    /** @type {string} */
    var opt_by = vim.login.isPartOfAGroup() ? " colspan='2'" : "";
    /** @type {boolean} */
    var v = fromServer && type === message && message !== "N/A" && message !== "";
    /** @type {boolean} */
    var isSameMsg = message === "No way";
    if (isSameMsg) {
      return "<td" + opt_by + " class='locked'>No way</td>";
    }
    if (!vim.login.isPartOfAGroup()) {
      /** @type {string} */
      command = command + ("<td" + opt_by + ">" + (message || "N/A") + "</td>");
    } else {
      if (v) {
        /** @type {string} */
        command = command + ("<td>" + (message || "N/A") + "</td>");
        /** @type {string} */
        command = command + "<td class='record medal'><span class='best'>Best in Group!";
        if (editor.indexOf(vim.emailaddr) !== -1) {
          /** @type {string} */
          command = command + ("<BR>" + editor.split("|").join("<BR>"));
        }
        /** @type {string} */
        command = command + "</span></td>";
      } else {
        /** @type {string} */
        command = command + ("<td>" + (message || "N/A") + "</td>");
        if (fromServer) {
          /** @type {string} */
          command = command + "<td>";
          /** @type {string} */
          command = command + "<span class='group-result record'>";
          /** @type {string} */
          command = command + ("(" + type + ")");
          /** @type {string} */
          command = command + "<span class='best'>";
          /** @type {string} */
          command = command + ("Best in group: " + type);
          /** @type {string} */
          command = command + ("<BR>" + editor.split("|").join("<BR>"));
          /** @type {string} */
          command = command + "</span>";
          /** @type {string} */
          command = command + "</td>";
        } else {
          /** @type {string} */
          command = command + "<td>N/A</td>";
        }
      }
    }
    return command;
  }
  /**
   * @return {?}
   */
  function zoomed() {
    var hasAttendees = vim.login.isPartOfAGroup();
    /** @type {string} */
    var hprefix = hasAttendees ? " colspan='2'" : "";
    /** @type {string} */
    var tprefix = hasAttendees ? "<th class='spacer'>&nbsp;</th>" : "";
    /** @type {string} */
    var dropdown_sex_ = '<tr><th id="level-column">Level</th><th id="keys-column">Keys</th><th' + hprefix + ">Fastest Completion Time</th>" + tprefix + "<th" + hprefix + ">Minimal Number of Keystrokes</th>" + tprefix + "<th" + hprefix + '>Minimal Number of "Deaths"</th></tr>';
    /** @type {!Array} */
    var devices = [{
      name : "1. Through the Maze",
      keys : "h j k l"
    }, {
      name : "2. The Prophecy",
      keys : "w e b"
    }, {
      name : "3. Into the Darkness",
      keys : "x B"
    }, {
      name : "4. Replacing Bad",
      keys : "r W E"
    }, {
      name : "5. Deleting Your Way",
      keys : "d"
    }, {
      name : "6. Flipping Sides",
      keys : "~ $ 0 ^"
    }, {
      name : "7. Inline Jumpin'",
      keys : "f t , ; g z"
    }, {
      name : "8. Mind the GAP",
      keys : "* # n"
    }, {
      name : "9. Prime Numbers",
      keys : "Digits"
    }, {
      name : "10. Cut n' Paste",
      keys : 'p y " :reg'
    }, {
      name : "11. Input Buffer",
      keys : "c s i a o :b"
    }, {
      name : "12. Bug Bash",
      keys : "( ) { } [ ] ia ."
    }, {
      name : "13. Fill in the Blank",
      keys : "-- unknown --"
    }, {
      name : "14. Lorem Ipsum",
      keys : "H M L | / ? ' ` m u"
    }];
    /** @type {string} */
    var format = "<table id=\"stat-table\" rules='groups'><thead>" + dropdown_sex_;
    var zMain = ktoz();
    var j;
    var z;
    var u;
    /** @type {string} */
    format = format + "</thead><tbody>";
    if (hasAttendees) {
      /** @type {string} */
      format = format + "<tr id='stats-table-header-end'><th></th><th></th><th class='personal-header'>Personal</th><th class='group-header'>Group</th><th>&nbsp;</th><th class='personal-header'>Personal</th><th class='group-header'>Group</th><th>&nbsp;</th><th class='personal-header'>Personal</th><th class='group-header'>Group</th></tr>";
      /** @type {string} */
      format = format + "</tbody><tbody>";
    }
    /** @type {number} */
    j = 0;
    for (; j < devices.length; ++j) {
      /** @type {string} */
      format = format + ("<tr" + (j + 1 > ktoz() || j + 1 == 13 ? " class='locked' " : "") + (j === 13 ? " id='stats-tbl-last'" : "") + "><td" + (j === 0 ? " id='stat-tbl-first-cell' " : "") + ">" + devices[j].name + "</td>");
      /** @type {string} */
      format = format + ("<td>" + devices[j].keys + "</td>");
      /** @type {string} */
      format = format + register(translate(events[j + 1].bestCompletionTime), translate(events[j + 1].minGroupCompletionTime), events[j + 1].minGroupCompletionTimeEmail);
      if (hasAttendees) {
        /** @type {string} */
        format = format + "<td>&nbsp</td>";
      }
      /** @type {string} */
      format = format + register(events[j + 1].minKeystrokes, events[j + 1].minGroupKeystrokes, events[j + 1].minGroupKeystrokesEmail);
      if (hasAttendees) {
        /** @type {string} */
        format = format + "<td>&nbsp</td>";
      }
      /** @type {string} */
      format = format + register(j + 1 < 8 ? "No way" : events[j + 1].minDeaths, events[j + 1].minGroupDeaths, events[j + 1].minGroupDeathsEmail);
      /** @type {string} */
      format = format + "</tr>";
    }
    /** @type {string} */
    format = format + "</tbody>";
    return format + "</table>";
  }
  /**
   * @param {undefined} name
   * @return {?}
   */
  function exports(name) {
    var data = events[name];
    /** @type {string} */
    var ret = "";
    if (!state) {
      return "";
    }
    if (!data.valid) {
      return "Statistics are measured\nonly when playing from\nthe beginning of the level.";
    }
    /** @type {string} */
    ret = ret + ("Time:\t" + translate(Date.now() - data.startTime) + "\n");
    /** @type {string} */
    ret = ret + ("Keystrokes:\t" + data.keystrokes);
    if (vim.model.getLevel() >= 8) {
      /** @type {string} */
      ret = ret + ('\n"Deaths":\t' + data.deaths);
    }
    return ret;
  }
  /**
   * @param {boolean} hide
   * @return {undefined}
   */
  function showOrHideImage(hide) {
    /** @type {boolean} */
    state = hide;
  }
  /**
   * @return {?}
   */
  function value() {
    return state;
  }
  /**
   * @return {?}
   */
  function ParseChord() {
    var i;
    var event;
    /** @type {string} */
    var name = "" + m + "_";
    /** @type {number} */
    i = 1;
    for (; i < events.length; ++i) {
      event = events[i];
      /** @type {string} */
      name = name + ((typeof event.bestCompletionTime === "undefined" ? "X" : event.bestCompletionTime) + "-");
      /** @type {string} */
      name = name + ((typeof event.minKeystrokes === "undefined" ? "X" : event.minKeystrokes) + "-");
      /** @type {string} */
      name = name + ((typeof event.minDeaths === "undefined" ? "X" : event.minDeaths) + "-");
      if (i + 1 < events.length) {
        /** @type {string} */
        name = name + "_";
      }
    }
    return name;
  }
  /**
   * @param {string} z
   * @param {string} color
   * @return {undefined}
   */
  function init(z, color) {
    var format;
    var i;
    var node;
    var t;
    var TT;
    if (typeof z !== "undefined" && z !== null) {
      initSampler();
      format = z.split("_");
      /** @type {number} */
      m = parseInt(format[0], 10);
      /** @type {number} */
      i = 1;
      for (; i < format.length; ++i) {
        if (format[i] === "") {
          continue;
        }
        events[i] = events[i] || {};
        node = events[i];
        t = format[i].split("-");
        /** @type {(number|undefined)} */
        node.bestCompletionTime = isNaN(parseInt(t[0], 10)) ? undefined : parseInt(t[0], 10);
        /** @type {(number|undefined)} */
        node.minKeystrokes = isNaN(parseInt(t[1], 10)) ? undefined : parseInt(t[1], 10);
        /** @type {(number|undefined)} */
        node.minDeaths = isNaN(parseInt(t[2], 10)) ? undefined : parseInt(t[2], 10);
        /** @type {boolean} */
        node.valid = false;
      }
    }
    if (typeof color !== "undefined" && color !== null) {
      setupGallery();
      format = color.substr(color.indexOf("_") + 1).split(":").map(function(value) {
        var index = value.lastIndexOf("-");
        if (index !== -1 && index !== value.length - 1) {
          return value.substr(0, index) + "}" + value.substr(index + 1);
        }
        return value;
      }).join(":").split("}_");
      format.unshift("");
      /** @type {number} */
      i = 1;
      for (; i < format.length; ++i) {
        if (format[i] === "") {
          continue;
        }
        events[i] = events[i] || {};
        node = events[i];
        t = format[i].split("}");
        TT = t[0].split(":");
        /** @type {(number|undefined)} */
        node.minGroupCompletionTime = isNaN(parseInt(TT[0], 10)) ? undefined : parseInt(TT[0], 10);
        node.minGroupCompletionTimeEmail = TT[1];
        TT = t[1].split(":");
        /** @type {(number|undefined)} */
        node.minGroupKeystrokes = isNaN(parseInt(TT[0], 10)) ? undefined : parseInt(TT[0], 10);
        node.minGroupKeystrokesEmail = TT[1];
        TT = t[2].split(":");
        /** @type {(number|undefined)} */
        node.minGroupDeaths = isNaN(parseInt(TT[0], 10)) ? undefined : parseInt(TT[0], 10);
        node.minGroupDeathsEmail = TT[1];
      }
    }
  }
  /** @type {number} */
  var m = 1;
  /** @type {!Array} */
  var events = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  /** @type {boolean} */
  var state = false;
  return {
    getHighestLevel : ktoz,
    startLevel : redraw,
    endLevel : addWorkingDay,
    incKeystrokes : createSimpleElement,
    incDeaths : updatecolorfrompointer,
    invalidateLevelStats : createVerificationObjects,
    resetAllStats : initSampler,
    getUserStatisticsTable : zoomed,
    getStatisticsStr : exports,
    isVisible : value,
    setVisible : showOrHideImage,
    marshal : ParseChord,
    unmarshal : init
  };
}();
vim.login = function() {
  /**
   * @param {string} type
   * @param {string} data
   * @param {string} name
   * @return {undefined}
   */
  function handler(type, data, name) {
    /** @type {number} */
    var timing = data.indexOf("<BR>") === -1 ? 3000 : 6000;
    f(true);
    /** @type {string} */
    $("#login-message")[0].className = type;
    /** @type {string} */
    $("#login-message")[0].innerHTML = data;
    /** @type {string} */
    adResizeContainer.style.display = "none";
    /** @type {string} */
    helpHAct.style.display = "table";
    name = name || f;
    if (type !== "processing") {
      timer = window.setTimeout(name, timing);
    }
  }
  /**
   * @param {string} value
   * @return {undefined}
   */
  function cb(value) {
    handler("error", value);
  }
  /**
   * @param {string} type
   * @return {undefined}
   */
  function onMessage(type) {
    handler("processing", type);
  }
  /**
   * @param {string} success
   * @param {string} args
   * @return {undefined}
   */
  function alert(success, args) {
    handler("ok", success, args);
  }
  /**
   * @param {(Object|string)} e
   * @return {undefined}
   */
  function onClick(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    } else {
      if (window.event && window.event.returnValue) {
        /** @type {boolean} */
        window.eventReturnValue = false;
      }
    }
  }
  /**
   * @param {!Object} e
   * @return {undefined}
   */
  function onMouseDown(e) {
    if (e.keyCode === 27) {
      initialize();
      return;
    }
    if (e.keyCode === 13) {
      move();
    }
    if (e.keyCode === 32) {
      onClick(e);
    }
  }
  /**
   * @return {undefined}
   */
  function move() {
    var expires = self.value.trim();
    var callback = node.value.trim();
    p.play("menu_click");
    if (expires === "") {
      block = self;
      cb("Email address can't be empty.");
      return;
    }
    if (expires.indexOf("@") === -1) {
      block = self;
      cb("Email address missing @ sign.");
      return;
    }
    if (expires.indexOf(".", expires.indexOf("@")) === -1) {
      block = self;
      cb("Email address appears to be invalid. Please recheck.");
      return;
    }
    if (callback === "") {
      block = node;
      cb("Password can't be empty.");
      return;
    }
    vim.fetcher.getUrl("php/login.php", init, failure, expires, callback, "Logging in ...", onMessage);
  }
  /**
   * @param {!Object} xhr
   * @return {undefined}
   */
  function failure(xhr) {
    cb(xhr.responseText);
  }
  /**
   * @param {!XMLHttpRequest} data
   * @return {undefined}
   */
  function city(data) {
    init(data, false, true);
  }
  /**
   * @param {!XMLHttpRequest} req
   * @param {string} load
   * @param {boolean} error
   * @param {boolean} objectId
   * @return {undefined}
   */
  function init(req, load, error, objectId) {
    var gl = vim.screens["game-screen"];
    var err = Modernizr.localstorage && window.localStorage["VIM Adventures email"];
    var auth = ($("#login-remember-me")[0].checked || err) && !error && !load && req.getResponseHeader("X-Time-Left") === null;
    /** @type {string} */
    var searchIndex = load ? "\n" : "<BR>";
    /** @type {string} */
    var index = "";
    if (req.getResponseHeader("X-Time-Left") !== null) {
      /** @type {string} */
      index = searchIndex + "Note that you have to successfully logout to pause the timer.";
      if ($("#login-remember-me")[0].checked) {
        /** @type {string} */
        index = index + (searchIndex + "'Remember me on this machine' option was disabled.");
      }
    }
    if (load) {
      vim.emailaddr = build.mail;
      vim.password = build.pswd;
    } else {
      if (error) {
        vim.emailaddr = item.value.trim();
        vim.password = component.value.trim();
      } else {
        if (objectId) {
        } else {
          vim.emailaddr = self.value.trim();
          vim.password = node.value.trim();
        }
      }
    }
    vim.token = req.getResponseHeader("X-Token");
    /** @type {boolean} */
    vim.enforceHjkl = !!req.getResponseHeader("X-Enforce-hjkl");
    vim.stats.unmarshal(objectId ? undefined : req.getResponseHeader("X-Stats"), req.getResponseHeader("X-Group-Stats"));
    if (!objectId && vim.buffers.getCurrentBuffer().name === "ground" && vim.model.getCursorX() === 103 && vim.model.getCursorY() === 117 && vim.model.getLevel() === 1) {
      vim.stats.startLevel(1);
    }
    vim.groupName = req.getResponseHeader("X-Group-Name");
    if (req.getResponseHeader("X-Time-Left") !== null) {
      /** @type {number} */
      vim.expirationTime = Date.now() + parseInt(req.getResponseHeader("X-Time-Left"), 10) * 1000;
    } else {
      /** @type {string} */
      vim.expirationTime = "";
    }
    if (Modernizr.localstorage) {
      window.localStorage["VIM Adventures email"] = auth ? vim.emailaddr : "";
      window.localStorage["VIM Adventures password"] = auth ? vim.password : "";
      window.localStorage["VIM Adventures token"] = auth ? vim.token : "";
      window.localStorage["VIM Adventures stats"] = auth ? vim.stats.marshal() : "";
      /** @type {(number|string)} */
      window.localStorage["VIM Adventures expiration time"] = auth ? vim.expirationTime : "";
    }
    /** @type {boolean} */
    vim.isLicensed = true;
    /** @type {boolean} */
    vim.terms = req.status !== 202;
    /** @type {boolean} */
    vim.groupAdmin = req.getResponseHeader("X-Group-Admin") !== null;
    listenHash();
    if (load) {
      gl.setColonCommand("Logged in successfully" + index);
      if (!vim.terms) {
        gl.openNewTermsDialog(undefined, "Logged in successfully" + index);
      }
    } else {
      if (error) {
        error("Password set, and user logged in successfully" + index, req.status === 202 ? drawFireworks : update);
      } else {
        if (objectId) {
        } else {
          alert("Logged in successfully" + index, req.status === 202 ? directionToWorldCoords : initialize);
        }
      }
    }
    gl.adjustUserMenu();
    gl.adjustStatsMenu();
    gl.adjustTermsMenu();
    gl.hideToBeContinuedMessage();
  }
  /**
   * @param {boolean} moveTo
   * @return {undefined}
   */
  function f(moveTo) {
    if (timer !== -1) {
      window.clearTimeout(timer);
      /** @type {number} */
      timer = -1;
    }
    if (!moveTo) {
      /** @type {string} */
      adResizeContainer.style.display = "block";
      /** @type {string} */
      helpHAct.style.display = "none";
      clearQuickFilter();
    }
  }
  /**
   * @return {undefined}
   */
  function clearQuickFilter() {
    if (block) {
      block.focus();
      block = undefined;
    } else {
      if (self.value.trim() === "") {
        self.focus();
      } else {
        node.focus();
      }
    }
  }
  /**
   * @param {!Object} trendId
   * @return {undefined}
   */
  function set(trendId) {
    var value = !Modernizr.localstorage ? "" : window.localStorage["VIM Adventures email"] || "";
    var text = vim.emailaddr && vim.emailaddr.trim() !== "" ? vim.emailaddr.trim() : "";
    var ts = !Modernizr.localstorage ? "" : window.localStorage["VIM Adventures password"] || "";
    vim.input.disableKeys();
    if (trendId) {
      self.value = trendId.trim();
      /** @type {string} */
      node.value = "";
    } else {
      if (self.value.trim() === "") {
        self.value = text || value;
      }
      if (node.value.trim() === "") {
        node.value = ts;
      }
    }
    /** @type {boolean} */
    $("#login-remember-me")[0].checked = !trendId && !!value;
    if (!Modernizr.localstorage) {
      /** @type {string} */
      $("#login-remember-me-row")[0].style.visibility = "hidden";
    }
    /** @type {string} */
    $("#shadowOverlay")[0].style.visibility = "visible";
    f(false);
    /** @type {string} */
    $("#login-dialog-overlay")[0].style.display = "block";
    clearQuickFilter();
    window.addEventListener("keydown", onMouseDown, false);
    dom.bind("#login-button", "click", move);
    dom.bind("#no-password-yet-link", "click", listener);
    dom.bind("#forgot-password-link", "click", saveToLocalStorage);
  }
  /**
   * @param {boolean} value
   * @param {boolean} option
   * @return {undefined}
   */
  function initialize(value, option) {
    f(false);
    window.removeEventListener("keydown", onMouseDown, false);
    dom.unbind("#login-button", "click", move);
    /** @type {string} */
    $("#login-dialog-overlay")[0].style.display = "none";
    if (typeof value !== "boolean" || value === true) {
      /** @type {string} */
      $("#shadowOverlay")[0].style.visibility = "hidden";
    }
    vim.input.enableKeys();
    if (typeof option === "boolean" && option === true) {
      vim.screens["game-screen"].openNewTermsDialog(undefined, "");
    }
  }
  /**
   * @return {undefined}
   */
  function directionToWorldCoords() {
    initialize(false, true);
  }
  /**
   * @return {undefined}
   */
  function listener() {
    initialize(false);
    item.value = self.value;
    click();
  }
  /**
   * @return {undefined}
   */
  function saveToLocalStorage() {
    initialize(false);
    item.value = self.value;
    load();
  }
  /**
   * @param {string} type
   * @param {string} string
   * @param {string} key
   * @return {undefined}
   */
  function filter(type, string, key) {
    /** @type {number} */
    var timing = string.indexOf("<BR>") === -1 ? 3000 : 6000;
    _(true);
    /** @type {string} */
    $("#signup-message")[0].className = type;
    /** @type {string} */
    $("#signup-message")[0].innerHTML = string;
    /** @type {string} */
    boxChild.style.display = "none";
    /** @type {string} */
    tempResetButton.style.display = "table";
    key = key || _;
    if (type !== "processing") {
      timer = window.setTimeout(key, timing);
    }
  }
  /**
   * @param {string} custom
   * @return {undefined}
   */
  function success(custom) {
    filter("error", custom);
  }
  /**
   * @param {string} fn
   * @return {undefined}
   */
  function loadFiles(fn) {
    filter("processing", fn);
  }
  /**
   * @param {string} prefix
   * @param {string} error
   * @return {undefined}
   */
  function error(prefix, error) {
    filter("ok", prefix, error);
  }
  /**
   * @param {!Object} e
   * @return {undefined}
   */
  function onKeyDown(e) {
    if (e.keyCode === 27) {
      /** @type {boolean} */
      vim.newAccount = false;
      update();
      return;
    }
    if (e.keyCode === 13) {
      reset();
    }
    if (e.keyCode === 32) {
      onClick(e);
    }
  }
  /**
   * @return {undefined}
   */
  function reset() {
    var expires = item.value.trim();
    var track = component.value.trim();
    var lastTrackTitle = topUpCodeInput.value.trim();
    p.play("menu_click");
    if (expires === "") {
      obj = item;
      success("Email address can't be empty.");
      return;
    }
    if (expires.indexOf("@") === -1) {
      obj = item;
      success("Email address missing @ sign.");
      return;
    }
    if (expires.indexOf(".", expires.indexOf("@")) === -1) {
      obj = item;
      success("Email address appears to be invalid. Please recheck.");
      return;
    }
    if (track === "") {
      obj = component;
      success("Password can't be empty.");
      return;
    }
    if (lastTrackTitle !== track) {
      obj = component;
      success("Password and re-entered password aren't the same");
      return;
    }
    vim.fetcher.getUrl("php/signup.php", city, file, expires, track, "Storing password ...", loadFiles);
  }
  /**
   * @param {!Object} res
   * @return {undefined}
   */
  function file(res) {
    success(res.responseText);
  }
  /**
   * @param {boolean} editable
   * @return {undefined}
   */
  function _(editable) {
    if (timer !== -1) {
      window.clearTimeout(timer);
      /** @type {number} */
      timer = -1;
    }
    if (!editable) {
      /** @type {string} */
      boxChild.style.display = "block";
      /** @type {string} */
      tempResetButton.style.display = "none";
      create();
    }
  }
  /**
   * @return {undefined}
   */
  function create() {
    if (obj) {
      obj.focus();
      obj = undefined;
    } else {
      if (item.value.trim() === "") {
        item.focus();
      } else {
        if (component.value.trim() === "") {
          component.focus();
        } else {
          if (topUpCodeInput.value.trim() === "") {
            topUpCodeInput.focus();
          } else {
            component.focus();
          }
        }
      }
    }
  }
  /**
   * @param {!Object} line
   * @return {undefined}
   */
  function click(line) {
    vim.input.disableKeys();
    /** @type {string} */
    $("#shadowOverlay")[0].style.visibility = "visible";
    _(false);
    /** @type {string} */
    $("#signup-dialog-overlay")[0].style.display = "block";
    create();
    window.addEventListener("keydown", onKeyDown, false);
    dom.bind("#signup-button", "click", reset);
    dom.bind("#signup-already-done-link", "click", function() {
      send();
      self.value = item.value;
      if (self.value) {
        node.focus();
      }
    });
    if (typeof line !== "undefined") {
      /** @type {!Object} */
      item.value = line;
      component.focus();
    }
  }
  /**
   * @param {boolean} value
   * @param {boolean} reverse
   * @return {undefined}
   */
  function update(value, reverse) {
    _(false);
    window.removeEventListener("keydown", onKeyDown, false);
    dom.unbind("#signup-button", "click", reset);
    /** @type {string} */
    $("#signup-dialog-overlay")[0].style.display = "none";
    if (typeof value !== "boolean" || value === true) {
      /** @type {string} */
      $("#shadowOverlay")[0].style.visibility = "hidden";
      if (vim.newAccount) {
        /** @type {boolean} */
        vim.newAccount = false;
        vim.screens["game-screen"].setColonCommand("You can use the command ':e before_darkness' (without quotes) to skip ahead to level 3 near the chest in the maze.");
      }
    }
    vim.input.enableKeys();
    if (typeof reverse === "boolean" && reverse === true) {
      vim.screens["game-screen"].openNewTermsDialog(undefined, "");
    }
  }
  /**
   * @return {undefined}
   */
  function drawFireworks() {
    update(false, true);
  }
  /**
   * @return {undefined}
   */
  function send() {
    update(false);
    close(false);
    set();
  }
  /**
   * @param {string} type
   * @param {string} data
   * @param {string} name
   * @return {undefined}
   */
  function log(type, data, name) {
    select(true);
    /** @type {string} */
    $("#forgot-password-message")[0].className = type;
    /** @type {string} */
    $("#forgot-password-message")[0].innerHTML = data;
    /** @type {string} */
    importFileButton.style.display = "none";
    /** @type {string} */
    dzone.style.display = "table";
    name = name || select;
    if (type !== "processing") {
      showBelowTimeout = window.setTimeout(name, 3000);
    }
  }
  /**
   * @param {string} activity
   * @return {undefined}
   */
  function debug(activity) {
    log("error", activity);
  }
  /**
   * @param {string} buffer
   * @return {undefined}
   */
  function parsed(buffer) {
    log("processing", buffer);
  }
  /**
   * @param {string} name
   * @param {string} i
   * @return {undefined}
   */
  function display(name, i) {
    log("ok", name, i);
  }
  /**
   * @param {!Object} e
   * @return {undefined}
   */
  function onkeyup(e) {
    if (e.keyCode === 27) {
      close();
      return;
    }
    if (e.keyCode === 13) {
      callback();
    }
    if (e.keyCode === 32) {
      onClick(e);
    }
  }
  /**
   * @return {undefined}
   */
  function callback() {
    var expires = el.value.trim();
    p.play("menu_click");
    if (expires === "") {
      block = el;
      debug("Email address can't be empty.");
      return;
    }
    if (expires.indexOf("@") === -1) {
      block = el;
      debug("Email address missing @ sign.");
      return;
    }
    if (expires.indexOf(".", expires.indexOf("@")) === -1) {
      block = el;
      debug("Email address appears to be invalid. Please recheck.");
      return;
    }
    vim.fetcher.getUrl("php/sendResetMail.php", request, token, expires, "123456", "Sending Password Reset Email ...", parsed);
  }
  /**
   * @param {!Object} res
   * @return {undefined}
   */
  function token(res) {
    debug(res.responseText);
  }
  /**
   * @param {!Object} file
   * @return {undefined}
   */
  function request(file) {
    display(file.responseText, close);
  }
  /**
   * @param {boolean} suppressSelectedEvent
   * @return {undefined}
   */
  function select(suppressSelectedEvent) {
    if (showBelowTimeout !== -1) {
      window.clearTimeout(showBelowTimeout);
      /** @type {number} */
      showBelowTimeout = -1;
    }
    if (!suppressSelectedEvent) {
      /** @type {string} */
      importFileButton.style.display = "block";
      /** @type {string} */
      dzone.style.display = "none";
      getElementById();
    }
  }
  /**
   * @return {undefined}
   */
  function getElementById() {
    if (winDebug) {
      winDebug.focus();
      winDebug = undefined;
    } else {
      el.focus();
    }
  }
  /**
   * @return {undefined}
   */
  function load() {
    var value = !Modernizr.localstorage ? "" : window.localStorage["VIM Adventures email"] || "";
    var text = vim.emailaddr && vim.emailaddr.trim() !== "" ? vim.emailaddr.trim() : "";
    vim.input.disableKeys();
    if (self.value.trim() === "") {
      self.value = text || value;
    } else {
      el.value = self.value.trim();
    }
    /** @type {string} */
    $("#shadowOverlay")[0].style.visibility = "visible";
    select(false);
    /** @type {string} */
    $("#forgot-password-dialog-overlay")[0].style.display = "block";
    getElementById();
    window.addEventListener("keydown", onkeyup, false);
    dom.bind("#forgot-password-button", "click", callback);
    dom.bind("#remembered-password-link", "click", send);
  }
  /**
   * @param {boolean} value
   * @return {undefined}
   */
  function close(value) {
    select(false);
    window.removeEventListener("keydown", onkeyup, false);
    dom.unbind("#forgot-password-button", "click", callback);
    /** @type {string} */
    $("#forgot-password-dialog-overlay")[0].style.display = "none";
    if (typeof value !== "boolean" || value === true) {
      /** @type {string} */
      $("#shadowOverlay")[0].style.visibility = "hidden";
    }
    vim.input.enableKeys();
  }
  /**
   * @param {!Object} date
   * @param {string} depth
   * @param {string} props
   * @param {string} value
   * @param {string} state
   * @return {undefined}
   */
  function save(date, depth, props, value, state) {
    vim.expiredEmail = value || undefined;
    vim.emailaddr = undefined;
    vim.password = undefined;
    vim.token = undefined;
    vim.groupName = undefined;
    if (Modernizr.localstorage) {
      /** @type {string} */
      window.localStorage["VIM Adventures state"] = "";
      /** @type {string} */
      window.localStorage["VIM Adventures password"] = "";
      /** @type {string} */
      window.localStorage["VIM Adventures email"] = "";
      /** @type {string} */
      window.localStorage["VIM Adventures token"] = "";
      /** @type {string} */
      window.localStorage["VIM Adventures stats"] = "";
    }
    /** @type {string} */
    self.value = "";
    /** @type {string} */
    node.value = "";
    /** @type {string} */
    item.value = "";
    /** @type {string} */
    component.value = "";
    /** @type {string} */
    topUpCodeInput.value = "";
    /** @type {string} */
    el.value = "";
    /** @type {boolean} */
    $("#login-remember-me")[0].checked = false;
    /** @type {boolean} */
    vim.isLicensed = false;
    vim.stats.resetAllStats();
    /** @type {boolean} */
    vim.groupAdmin = false;
    vim.gamestate.restartGame(true);
    /** @type {boolean} */
    vim.terms = true;
    vim.screens["game-screen"].adjustUserMenu();
    vim.screens["game-screen"].adjustStatsMenu();
    vim.screens["game-screen"].adjustTermsMenu();
    /** @type {string} */
    vim.expirationTime = "";
    if (slideshowtimer !== -1) {
      window.clearInterval(slideshowtimer);
      /** @type {number} */
      slideshowtimer = -1;
    }
    if (depth) {
      vim.screens["game-screen"].doubleLogin();
    } else {
      if (props) {
        ac.innerHTML = vim.expiredEmail || "Unknown user";
        /** @type {string} */
        style.innerHTML = state ? "<BR>License activated on " + state : "";
        initialize(true);
        vim.screens["game-screen"].licenseExpired();
      } else {
        vim.screens["game-screen"].setColonCommand("Successfully logged out.");
      }
    }
  }
  /**
   * @return {?}
   */
  function parse() {
    return vim.emailaddr && vim.emailaddr.trim() !== "" && vim.password && vim.password.trim() !== "";
  }
  /**
   * @return {?}
   */
  function Jison_Generator() {
    return parse() && vim.terms === false;
  }
  /**
   * @return {undefined}
   */
  function handleResponse() {
    if (!parse()) {
      return;
    }
    vim.fetcher.getUrl("php/login.php", group, options, vim.emailaddr.trim(), vim.password.trim(), undefined, undefined);
  }
  /**
   * @param {!Object} obj
   * @return {undefined}
   */
  function options(obj) {
    if (obj.status === 403) {
      save(obj, true);
    } else {
      if (obj.status === 402) {
        save(obj, false, true, vim.emailaddr);
      } else {
      }
    }
  }
  /**
   * @param {!XMLHttpRequest} cb
   * @return {?}
   */
  function group(cb) {
    return init(cb, false, false, true);
  }
  /**
   * @param {!Object} bFreeze
   * @param {!Object} bNesteAttributes
   * @return {undefined}
   */
  function build(bFreeze, bNesteAttributes) {
    var expires = bFreeze.trim();
    var pre = bNesteAttributes.trim();
    build.mail = expires;
    build.pswd = pre;
    if (expires === "") {
      vim.screens["game-screen"].setColonCommand("Email address can't be empty.");
      return;
    }
    if (expires.indexOf("@") === -1) {
      vim.screens["game-screen"].setColonCommand("Email address missing @ sign.");
      return;
    }
    if (expires.indexOf(".", expires.indexOf("@")) === -1) {
      vim.screens["game-screen"].setColonCommand("Email address appears to be invalid. Please recheck.");
      return;
    }
    if (pre === "") {
      vim.screens["game-screen"].setColonCommand("Password can't be empty.");
      return;
    }
    vim.screens["game-screen"].setColonCommand("Logging in...");
    vim.fetcher.getUrl("php/login.php", language, type, expires, pre, undefined, undefined);
  }
  /**
   * @param {!Object} elem
   * @return {undefined}
   */
  function type(elem) {
    vim.screens["game-screen"].setColonCommand(elem.responseText);
  }
  /**
   * @param {!XMLHttpRequest} dir
   * @return {?}
   */
  function language(dir) {
    return init(dir, true);
  }
  /**
   * @return {?}
   */
  function Parameter() {
    return typeof vim.groupName !== "undefined" && vim.groupName !== null;
  }
  /**
   * @return {?}
   */
  function L() {
    return vim.groupName;
  }
  /**
   * @param {string} json
   * @param {string} data
   * @param {boolean} res
   * @param {string} callback
   * @param {string} next
   * @return {?}
   */
  function add(json, data, res, callback, next) {
    if (json || data) {
      if (res) {
        vim.fetcher.getUrl("php/logout.php", function() {
        }, function() {
        }, vim.emailaddr.trim(), vim.password.trim(), undefined, undefined);
      }
      return save(undefined, json, data, callback, next);
    }
    if (!parse()) {
      return;
    }
    vim.screens["game-screen"].setColonCommand("Logging out...");
    vim.fetcher.getUrl("php/logout.php", save, type, vim.emailaddr.trim(), vim.password.trim(), undefined, undefined);
  }
  /**
   * @return {undefined}
   */
  function listenHash() {
    if (slideshowtimer === -1) {
      slideshowtimer = window.setInterval(vim.login.revalidateLogin, 30000);
    }
  }
  var dom = vim.dom;
  var $ = dom.$;
  var game = vim.game;
  var p = vim.audio;
  var self = $("#login-email")[0];
  var node = $("#login-password")[0];
  /** @type {number} */
  var timer = -1;
  var adResizeContainer = $("#login-form")[0];
  var helpHAct = $("#login-message-tab")[0];
  var item = $("#signup-email")[0];
  var component = $("#signup-password")[0];
  var topUpCodeInput = $("#signup-password-retyped")[0];
  /** @type {number} */
  var at = -1;
  var boxChild = $("#signup-form")[0];
  var tempResetButton = $("#signup-message-tab")[0];
  var block;
  var obj;
  var el = $("#forgot-password-email")[0];
  /** @type {number} */
  var showBelowTimeout = -1;
  var importFileButton = $("#forgot-password-form")[0];
  var dzone = $("#forgot-password-message-tab")[0];
  var winDebug;
  /** @type {number} */
  var slideshowtimer = -1;
  /** @type {(Element|null)} */
  var ac = document.getElementById("expired-user-email");
  /** @type {(Element|null)} */
  var style = document.getElementById("activated-on");
  return {
    isUserLoggedIn : parse,
    isPartOfAGroup : Parameter,
    getGroupName : L,
    shouldUserConfirmTerms : Jison_Generator,
    askForLoginInfo : set,
    fastLoginSubmit : build,
    choosePassword : click,
    askForResetPasswordInfo : load,
    logout : add,
    revalidateLogin : handleResponse,
    scheduleLoginRevalidation : listenHash
  };
}();
/**
 * @param {number} x
 * @param {number} y
 * @param {?} width
 * @return {undefined}
 */
var Entity = function(x, y, width) {
  /** @type {number} */
  this.x = x;
  /** @type {number} */
  this.y = y;
  this.imageName = width;
  /** @type {number} */
  this.xOffset = 0;
  /** @type {number} */
  this.yOffset = 0;
  /** @type {boolean} */
  this.valid = true;
  /** @type {boolean} */
  this.blocking = false;
  /** @type {boolean} */
  this.invisible = false;
  /** @type {string} */
  this.name = "";
};
/**
 * @return {?}
 */
Entity.prototype.getData = function() {
  return {
    x : this.x,
    y : this.y,
    xOffset : this.xOffset,
    yOffset : this.yOffset,
    valid : this.valid,
    blocking : this.blocking,
    invisible : this.invisible,
    name : this.name,
    imageName : this.imageName
  };
};
/**
 * @param {!Object} data
 * @return {undefined}
 */
Entity.prototype.restore = function(data) {
  this.x = data.x;
  this.y = data.y;
  this.xOffset = data.xOffset || 0;
  this.yOffset = data.yOffset || 0;
  /** @type {boolean} */
  this.valid = data.valid === true;
  /** @type {boolean} */
  this.blocking = data.blocking === true;
  /** @type {boolean} */
  this.invisible = data.invisible === true;
  this.name = data.name;
  this.imageName = data.imageName;
};
/**
 * @param {string} name
 * @return {undefined}
 */
Entity.prototype.setName = function(name) {
  /** @type {string} */
  this.name = name;
};
/**
 * @return {?}
 */
Entity.prototype.getName = function() {
  return this.name ? this.name : "";
};
/**
 * @return {?}
 */
Entity.prototype.getX = function() {
  return this.x;
};
/**
 * @return {?}
 */
Entity.prototype.getY = function() {
  return this.y;
};
/**
 * @return {?}
 */
Entity.prototype.getXOffset = function() {
  return this.xOffset;
};
/**
 * @return {?}
 */
Entity.prototype.getYOffset = function() {
  return this.yOffset;
};
/**
 * @return {?}
 */
Entity.prototype.getImageName = function() {
  return this.imageName;
};
/**
 * @param {string} type
 * @return {undefined}
 */
Entity.prototype.setImageName = function(type) {
  /** @type {string} */
  this.imageName = type;
};
/**
 * @return {?}
 */
Entity.prototype.isInvisible = function() {
  return this.invisible;
};
/**
 * @param {boolean} el
 * @return {undefined}
 */
Entity.prototype.setInvisible = function(el) {
  /** @type {boolean} */
  this.invisible = el;
};
/**
 * @return {?}
 */
Entity.prototype.isValid = function() {
  return this.valid;
};
/**
 * @return {undefined}
 */
Entity.prototype.invalidate = function() {
  var nameSetA = vim.model.getCell(this.x, this.y).entitiesList;
  var i = nameSetA.length;
  /** @type {boolean} */
  this.valid = false;
  for (; i--;) {
    if (this === nameSetA[i]) {
      nameSetA.splice(i, 1);
    }
  }
};
/**
 * @return {?}
 */
Entity.prototype.isBlocking = function() {
  return this.blocking;
};
/**
 * @param {boolean} b
 * @return {undefined}
 */
Entity.prototype.setBlocking = function(b) {
  /** @type {boolean} */
  this.blocking = b;
};
/**
 * @param {number} value
 * @return {undefined}
 */
Entity.prototype.setX = function(value) {
  /** @type {number} */
  this.x = value;
};
/**
 * @param {number} value
 * @return {undefined}
 */
Entity.prototype.setY = function(value) {
  /** @type {number} */
  this.y = value;
};
/**
 * @param {number} xOffset
 * @return {undefined}
 */
Entity.prototype.setXOffset = function(xOffset) {
  /** @type {number} */
  this.xOffset = xOffset;
};
/**
 * @param {number} yOffset
 * @return {undefined}
 */
Entity.prototype.setYOffset = function(yOffset) {
  /** @type {number} */
  this.yOffset = yOffset;
};
/**
 * @param {number} xOffset
 * @param {number} yOffset
 * @return {undefined}
 */
Entity.prototype.setOffsets = function(xOffset, yOffset) {
  /** @type {number} */
  this.xOffset = xOffset;
  /** @type {number} */
  this.yOffset = yOffset;
};
/**
 * @return {undefined}
 */
Entity.prototype.collide = function() {
};
/**
 * @return {?}
 */
Entity.prototype.newFutureInvalidateCallback = function() {
  /** @type {!Entity} */
  var connector1 = this;
  return function() {
    connector1.invalidate();
    /** @type {number} */
    connector1.futureInvalidateTimeoutId = -1;
  };
};
/**
 * @return {undefined}
 */
Entity.prototype.clear = function() {
  if (typeof this.movePattern !== "undefined") {
    this.movePattern.stop();
  }
  if (typeof this.futureInvalidateTimeoutId !== "undefined" && this.futureInvalidateTimeoutId !== -1) {
    window.clearTimeout(this.futureInvalidateTimeoutId);
    /** @type {number} */
    this.futureInvalidateTimeoutId = -1;
  }
};
/**
 * @param {!Object} game
 * @param {number} interval
 * @return {undefined}
 */
var Movement = function(game, interval) {
  /** @type {!Object} */
  this.entity = game;
  /** @type {number} */
  this.interval = interval;
  /** @type {number} */
  this.intervalId = -1;
  this.moveCallback = this.newMoveCallback();
};
/**
 * @return {?}
 */
Movement.prototype.newMoveCallback = function() {
  var tapEvents = this;
  return function() {
    return tapEvents.move();
  };
};
/**
 * @return {undefined}
 */
Movement.prototype.move = function() {
};
/**
 * @return {undefined}
 */
Movement.prototype.stop = function() {
  if (this.intervalId !== -1) {
    window.clearInterval(this.intervalId);
    /** @type {number} */
    this.intervalId = -1;
  }
};
/**
 * @param {?} rest
 * @param {?} handler
 * @param {?} data
 * @param {?} indices
 * @param {number} stride
 * @return {undefined}
 */
var InCellRandomMovement = function(rest, handler, data, indices, stride) {
  Movement.call(this, rest, handler);
  this.minOffset = data;
  this.maxOffset = indices;
  /** @type {number} */
  this.stride = stride;
  this.intervalId = window.setInterval(this.moveCallback, this.interval);
};
/** @type {!Object} */
InCellRandomMovement.prototype = Object.create(Movement.prototype);
/**
 * @return {undefined}
 */
InCellRandomMovement.prototype.move = function() {
  var b;
  var x;
  var y;
  if (Cursor.getX() === this.entity.getX() && Cursor.getY() === this.entity.getY()) {
    return;
  }
  /** @type {number} */
  b = Math.floor(Math.random() * 9) + 1;
  x = this.entity.getXOffset();
  y = this.entity.getYOffset();
  x = x + (b % 3 === 1 ? -this.stride : 0);
  x = x + (b % 3 === 0 ? this.stride : 0);
  y = y + (b < 4 ? -this.stride : 0);
  y = y + (b > 6 ? this.stride : 0);
  /** @type {number} */
  x = Math.max(x, this.minOffset);
  /** @type {number} */
  x = Math.min(x, this.maxOffset);
  /** @type {number} */
  y = Math.max(y, this.minOffset);
  /** @type {number} */
  y = Math.min(y, this.maxOffset);
  this.entity.setOffsets(x, y);
};
/**
 * @param {?} rest
 * @param {number} handler
 * @param {number} capture
 * @param {number} i
 * @return {undefined}
 */
var ObjectBounceMovement = function(rest, handler, capture, i) {
  Movement.call(this, rest, 33);
  /** @type {number} */
  this.upLimit = capture;
  /** @type {number} */
  this.downLimit = handler;
  /** @type {number} */
  this.step = i;
  /** @type {number} */
  this.moveOffset = handler;
  this.initialYOffset = rest.getYOffset();
  this.intervalId = window.setInterval(this.moveCallback, this.interval);
};
/** @type {!Object} */
ObjectBounceMovement.prototype = Object.create(Movement.prototype);
/**
 * @return {undefined}
 */
ObjectBounceMovement.prototype.move = function() {
  this.entity.setYOffset(this.initialYOffset - this.moveOffset);
  this.moveOffset += this.step;
  if (this.upLimit <= this.moveOffset || this.downLimit >= this.moveOffset) {
    this.step *= -1;
  }
};
/**
 * @param {?} rest
 * @return {undefined}
 */
var ObjectCollectedMovement = function(rest) {
  Movement.call(this, rest, 33);
  /** @type {number} */
  this.upLimit = 100;
  this.step = rest.collectStep || 5;
  this.intervalId = window.setInterval(this.moveCallback, this.interval);
};
/** @type {!Object} */
ObjectCollectedMovement.prototype = Object.create(Movement.prototype);
/**
 * @return {undefined}
 */
ObjectCollectedMovement.prototype.move = function() {
  var value = this.entity.getYOffset();
  this.entity.setYOffset(value - this.step);
  /** @type {number} */
  this.upLimit = this.upLimit - this.step;
  if (this.upLimit <= 0) {
    this.stop();
    this.entity.invalidate();
  }
};
/**
 * @param {?} rest
 * @return {undefined}
 */
var DoorOpeningMovement = function(rest) {
  Movement.call(this, rest, 33);
  /** @type {number} */
  this.downLimit = 50;
  /** @type {number} */
  this.step = 5;
  this.intervalId = window.setInterval(this.moveCallback, this.interval);
};
/** @type {!Object} */
DoorOpeningMovement.prototype = Object.create(Movement.prototype);
/**
 * @return {undefined}
 */
DoorOpeningMovement.prototype.move = function() {
  var i = this.entity.getYOffset();
  this.entity.setYOffset(i + this.step);
  /** @type {number} */
  this.downLimit = this.downLimit - this.step;
  if (this.downLimit <= 0) {
    window.clearInterval(this.intervalId);
    this.entity.invalidate();
  }
};
/**
 * @param {?} rest
 * @param {?} handler
 * @return {undefined}
 */
var CursorNPCBlinkMovement = function(rest, handler) {
  var _this = this;
  Movement.call(this, rest, handler);
  this.setupTimeoutId = window.setTimeout(function() {
    _this.intervalId = window.setInterval(_this.moveCallback, _this.interval);
    /** @type {number} */
    _this.setupTimeoutId = -1;
  }, Math.floor(Math.random() * 400));
};
/** @type {!Object} */
CursorNPCBlinkMovement.prototype = Object.create(Movement.prototype);
/**
 * @return {undefined}
 */
CursorNPCBlinkMovement.prototype.move = function() {
  this.entity.toggleBlink();
};
/**
 * @return {undefined}
 */
CursorNPCBlinkMovement.prototype.stop = function() {
  Movement.prototype.stop.call(this);
  if (this.setupTimeoutId !== -1) {
    window.clearTimeout(this.setupTimeoutId);
    /** @type {number} */
    this.setupTimeoutId = -1;
  }
};
/**
 * @param {?} tx
 * @param {?} property
 * @param {?} params
 * @return {undefined}
 */
var CollectableObject = function(tx, property, params) {
  Entity.call(this, tx, property, params);
  /** @type {boolean} */
  this.collected = false;
};
/** @type {!Object} */
CollectableObject.prototype = Object.create(Entity.prototype);
/**
 * @return {?}
 */
CollectableObject.prototype.getData = function() {
  var v = Entity.prototype.getData.call(this);
  v.collected = this.collected;
  return v;
};
/**
 * @param {?} state
 * @return {undefined}
 */
CollectableObject.prototype.restore = function(state) {
  Entity.prototype.restore.call(this, state);
  this.collected = state.collected;
  if (state.collected && this.movePattern) {
    this.movePattern.stop();
  }
};
/**
 * @return {undefined}
 */
CollectableObject.prototype.collide = function() {
  if (!this.collected) {
    if (this.movePattern) {
      this.movePattern.stop();
    }
    this.collect();
    this.movePattern = new ObjectCollectedMovement(this);
  }
};
/**
 * @return {undefined}
 */
CollectableObject.prototype.collect = function() {
};
/**
 * @param {?} cmd
 * @param {?} html
 * @param {!Array} bNoPrepare
 * @return {undefined}
 */
var PlusMinus = function(cmd, html, bNoPrepare) {
  CollectableObject.call(this, cmd, html, "none");
  /** @type {!Array} */
  this.changes = bNoPrepare;
};
/** @type {!Object} */
PlusMinus.prototype = Object.create(CollectableObject.prototype);
/**
 * @return {?}
 */
PlusMinus.prototype.getData = function() {
  var result = CollectableObject.prototype.getData.call(this);
  /** @type {string} */
  result.type = "plus_minus";
  result.changes = this.changes;
  return result;
};
/**
 * @param {!Object} evt
 * @return {?}
 */
PlusMinus.prototype.restore = function(evt) {
  var that = new PlusMinus(evt.x, evt.y, evt.changes);
  CollectableObject.prototype.restore.call(that, evt);
  if (typeof that.getImageName() !== "string") {
    that.setImageName("none");
  }
  return that;
};
/**
 * @return {undefined}
 */
PlusMinus.prototype.collect = function() {
  var i;
  var a;
  var graph = vim.buffers.getCurrentBuffer().getEntities();
  var buffer;
  var logger;
  var p = vim.model;
  /** @type {boolean} */
  this.collected = true;
  this.invalidate();
  p.recacheCell(this.x, this.y);
  /** @type {number} */
  i = 0;
  for (; i < this.changes.length; i = i + 1) {
    switch(this.changes[i].action) {
      case "remove":
        a = graph.getByName(this.changes[i].name);
        a.invalidate();
        p.recacheCell(a.getX(), a.getY());
        break;
      case "add":
        a = graph.createEntity(undefined, undefined, this.changes[i]);
        if (a) {
          graph.add(a);
          p.recacheCell(a.getX(), a.getY());
        }
        break;
      case "bgChange":
        buffer = this.changes[i].buffer;
        logger = vim.buffers.getBuffer(buffer).getBoard();
        logger.add(this.changes[i].level);
        if (vim.buffers.getCurrentBuffer().getName() === buffer) {
          p.clearCellCache();
        }
        break;
      default:
        console.log("Invalid operation in PlusMinus: " + this.changes[i].action);
    }
  }
};
/**
 * @param {?} attrs
 * @param {?} opt_parent
 * @param {string} codeUnicode
 * @return {undefined}
 */
var Key = function(attrs, opt_parent, codeUnicode) {
  /** @type {string} */
  this.color = codeUnicode;
  CollectableObject.call(this, attrs, opt_parent, this.color + "_key");
  if (codeUnicode === "small_brown") {
    this.setYOffset(10);
    this.movePattern = new ObjectBounceMovement(this, 0, 11, 1);
  } else {
    this.movePattern = new ObjectBounceMovement(this, 0, 37 / 2, 1);
  }
};
/** @type {!Object} */
Key.prototype = Object.create(CollectableObject.prototype);
/**
 * @return {?}
 */
Key.prototype.getData = function() {
  var ret = CollectableObject.prototype.getData.call(this);
  ret.color = this.color;
  /** @type {string} */
  ret.type = this.color + "_key";
  return ret;
};
/**
 * @param {!Object} key
 * @return {?}
 */
Key.prototype.restore = function(key) {
  var buf = key.color || (key.type === "small_brown_key" ? "small_brown" : "yellow");
  var that = new Key(key.x, key.y, buf);
  CollectableObject.prototype.restore.call(that, key);
  if (typeof that.getImageName() !== "string") {
    that.setImageName(that.color + "_key");
  }
  return that;
};
/**
 * @return {undefined}
 */
Key.prototype.collect = function() {
  /** @type {boolean} */
  this.collected = true;
  vim.audio.play("collect");
  vim.inventory.addKey(this.color);
};
/**
 * @param {?} a
 * @param {?} b
 * @return {undefined}
 */
var LightsOn = function(a, b) {
  CollectableObject.call(this, a, b, "none");
};
/** @type {!Object} */
LightsOn.prototype = Object.create(CollectableObject.prototype);
/**
 * @return {?}
 */
LightsOn.prototype.getData = function() {
  var parsedMetadata = CollectableObject.prototype.getData.call(this);
  /** @type {string} */
  parsedMetadata.type = "lights_on";
  return parsedMetadata;
};
/**
 * @param {!Object} child
 * @return {?}
 */
LightsOn.prototype.restore = function(child) {
  var that = new LightsOn(child.x, child.y);
  CollectableObject.prototype.restore.call(that, child);
  if (typeof that.getImageName() !== "string") {
    that.setImageName("none");
  }
  return that;
};
/**
 * @return {undefined}
 */
LightsOn.prototype.collect = function() {
  /** @type {boolean} */
  this.collected = true;
  vim.audio.play("lights_on");
  Game.lightsOnAnimation();
  vim.model.setCandleLightMode(false);
};
/**
 * @param {?} i
 * @param {?} map
 * @param {!Object} letter
 * @return {undefined}
 */
var KeyboardKey = function(i, map, letter) {
  CollectableObject.call(this, i, map, "keyboard_key");
  /** @type {!Object} */
  this.letter = letter;
  /** @type {number} */
  this.yOffset = 3;
};
/** @type {!Object} */
KeyboardKey.prototype = Object.create(CollectableObject.prototype);
/**
 * @return {?}
 */
KeyboardKey.prototype.getData = function() {
  var dataset = CollectableObject.prototype.getData.call(this);
  /** @type {string} */
  dataset.type = "keyboard_key";
  dataset.letter = this.letter;
  return dataset;
};
/**
 * @return {?}
 */
KeyboardKey.prototype.getLetter = function() {
  return this.letter;
};
/**
 * @param {!Object} params
 * @return {?}
 */
KeyboardKey.prototype.restore = function(params) {
  var that = new KeyboardKey(params.x, params.y, params.letter);
  CollectableObject.prototype.restore.call(that, params);
  if (typeof that.getImageName() !== "string") {
    that.setImageName("keyboard_key");
  }
  return that;
};
/**
 * @return {undefined}
 */
KeyboardKey.prototype.collect = function() {
  /** @type {boolean} */
  this.collected = true;
  vim.validKeys.add(this.letter);
  vim.screens["game-screen"].showCommandHelp(this.getLetter());
  if (this.letter === "u") {
    Game.setCursorCommandUntilMove("Yay!\nThis also restored all\nmy missing motions!\n\nPowerful stuff!");
    vim.audio.play("tada");
  } else {
    vim.audio.play("new_skill");
  }
  vim.input.disableKeys();
  window.setTimeout(vim.input.enableKeys, this.letter === "w" || this.letter === "u" ? 2000 : 500);
};
/**
 * @param {?} id
 * @param {?} data
 * @param {?} a
 * @param {string} type
 * @return {undefined}
 */
var Person = function(id, data, a, type) {
  /** @type {number} */
  var b = 37 / 6;
  Entity.call(this, id, data, a);
  /** @type {string} */
  this.message = type;
  this.imageName = a;
  this.movePattern = new InCellRandomMovement(this, 200, -b, b, 1);
};
/** @type {!Object} */
Person.prototype = Object.create(Entity.prototype);
/**
 * @return {?}
 */
Person.prototype.getData = function() {
  var data = Entity.prototype.getData.call(this);
  data.message = this.message;
  data.imageName = this.imageName;
  /** @type {string} */
  data.type = "person";
  return data;
};
/**
 * @param {!Object} obj
 * @return {?}
 */
Person.prototype.restore = function(obj) {
  var ctx = new Person(obj.x, obj.y, obj.imageName, obj.message);
  Entity.prototype.restore.call(ctx, obj);
  return ctx;
};
/**
 * @return {?}
 */
Person.prototype.getMessage = function() {
  return this.message;
};
/**
 * @return {undefined}
 */
Person.prototype.collide = function() {
  Game.speech(this.getX(), this.getY(), this.getMessage());
  vim.audio.play("yeepee");
};
/**
 * @param {undefined} x
 * @param {undefined} data
 * @param {string} t
 * @param {number} level
 * @return {undefined}
 */
var Princess = function(x, data, t, level) {
  /** @type {number} */
  var b = 37 / 6;
  Entity.call(this, x, data, "princess");
  if (level === 13) {
    /** @type {number} */
    level = 14;
  }
  /** @type {number} */
  this.levelToLoad = level;
  /** @type {string} */
  this.message = t;
  this.movePattern = new InCellRandomMovement(this, 200, -b, b, 1);
  this.collideCallback = Princess.prototype.newCollideCallback(x, data, t, level);
};
/** @type {!Object} */
Princess.prototype = Object.create(Entity.prototype);
/**
 * @return {?}
 */
Princess.prototype.getData = function() {
  var state = Entity.prototype.getData.call(this);
  /** @type {string} */
  state.type = "princess";
  state.message = this.message;
  state.levelToLoad = this.levelToLoad;
  return state;
};
/**
 * @param {!Object} state
 * @return {?}
 */
Princess.prototype.restore = function(state) {
  var that = new Princess(state.x, state.y, state.message, state.levelToLoad);
  Entity.prototype.restore.call(that, state);
  if (typeof that.getImageName() !== "string") {
    that.setImageName("princess");
  }
  if (that.levelToLoad === 13) {
    /** @type {number} */
    that.levelToLoad = 14;
  }
  return that;
};
/**
 * @param {number} options
 * @param {number} data
 * @param {string} source
 * @param {number} id
 * @return {?}
 */
Princess.prototype.newCollideCallback = function(options, data, source, id) {
  return function() {
    /**
     * @param {!Object} jqXHR
     * @return {undefined}
     */
    function handler(jqXHR) {
      var template = jqXHR.responseText;
      var mock;
      var radius;
      if (id !== 14) {
        if (template.indexOf("princess_message") > 0) {
          /** @type {*} */
          mock = JSON.parse(template);
          if (mock.princess_message) {
            source = mock.princess_message.split("\n");
          }
        }
        radius = (source.join("\n") + "\n\nPress Esc to continue...").split("\n");
        Game.speech(options, data, radius);
        vim.dom.bind(window, "keydown", self.newKeydownCallback(template));
      } else {
        Game.level13CutScene(self.newPostCutSceneCallback(self, template));
      }
    }
    /**
     * @param {!Object} http
     * @return {undefined}
     */
    function init(http) {
      vim.input.enableKeys();
      alert(http.responseText);
    }
    var self = this;
    var joinURL;
    /** @type {string} */
    joinURL = "level=" + id + "&stats=" + encodeURIComponent(vim.stats.marshal());
    vim.fetcher.getUrl("php/level.php?level=" + id, handler, init, vim.emailaddr || "", vim.password || "", "Loading level " + id, undefined, joinURL);
    vim.input.disableKeys();
  };
};
/**
 * @param {?} view
 * @param {string} params
 * @return {?}
 */
Princess.prototype.newPostCutSceneCallback = function(view, params) {
  return function() {
    vim.gamestate.loadLevelFromString(params);
    view.invalidate();
    vim.input.enableKeys();
    vim.stats.startLevel(vim.model.getLevel());
  };
};
/**
 * @param {?} t
 * @return {?}
 */
Princess.prototype.newKeydownCallback = function(t) {
  var canvasLayersManager = this;
  var j = t;
  var handler;
  /**
   * @param {!Object} event
   * @return {?}
   */
  handler = function(event) {
    /** @type {boolean} */
    var f = false;
    if (event.keyCode === 8 || event.keyCode >= 37 && event.keyCode <= 40) {
      /** @type {boolean} */
      f = true;
    } else {
      if (event.keyCode === 27) {
        vim.dom.unbind(window, "keydown", handler);
        Game.princessFlashAnimation(canvasLayersManager.newLoadLevelCallback(j));
        /** @type {boolean} */
        f = true;
      }
    }
    if (f) {
      vim.input.preventDefault(event);
      return false;
    }
    return true;
  };
  return handler;
};
/**
 * @return {undefined}
 */
Princess.prototype.collide = function() {
  var p = vim.validKeys;
  var result;
  var i;
  /** @type {!Array} */
  var contacts = [];
  /** @type {string} */
  var token = "You succeeded in getting this far\nbut some of the skills you'll need\nwere left behind.\n\nReturn when you have collected\nalso ";
  if (this.x === 175 && this.y === 109) {
    /** @type {!Array} */
    result = ["h", "j", "k", "l"];
  } else {
    if (this.x === 205 & this.y === 128) {
      /** @type {!Array} */
      result = ["w", "e", "b"];
    } else {
      if (this.x === 205 & this.y === 136) {
        /** @type {!Array} */
        result = ["x", "B"];
      } else {
        if (this.x === 189 & this.y === 151) {
          /** @type {!Array} */
          result = ["r", "E", "W"];
        } else {
          if (this.x === 186 & this.y === 196) {
            /** @type {!Array} */
            result = ["d"];
          } else {
            if (this.x === 212 & this.y === 239) {
              /** @type {!Array} */
              result = ["~", "$", "0", "^"];
            } else {
              if (this.x === 240 & this.y === 285) {
                /** @type {!Array} */
                result = ["g", "f", "t", ";", ",", "z", "%"];
              } else {
                if (this.x === 224 & this.y === 378) {
                  /** @type {!Array} */
                  result = ["*", "#", "n"];
                } else {
                  if (this.x === 220 & this.y === 440) {
                    /** @type {!Array} */
                    result = ["1"];
                  } else {
                    if (this.x === 275 & this.y === 478) {
                      /** @type {!Array} */
                      result = ["p", '"', "y"];
                    } else {
                      if (this.x === 124 & this.y === 119) {
                        /** @type {!Array} */
                        result = ["c", "s", "i", "a", "o"];
                      } else {
                        if (this.x === 188 & this.y === 184) {
                          /** @type {!Array} */
                          result = ["{", "}", "(", ")", "[", "]", "."];
                        } else {
                          alert("Missing to be collected list!");
                          return;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  /** @type {number} */
  i = 0;
  for (; i < result.length; ++i) {
    if (!p.isValid(result[i])) {
      contacts.push(result[i]);
    }
  }
  if (contacts.length === 0) {
    vim.stats.endLevel(vim.model.getLevel());
    if (vim.stats.getHighestLevel() < vim.model.getLevel() + 1) {
      vim.stats.startLevel(vim.model.getLevel() + 1);
      vim.stats.invalidateLevelStats(vim.model.getLevel() + 1);
    }
    this.collideCallback();
  } else {
    /** @type {number} */
    i = 0;
    for (; i < contacts.length; ++i) {
      /** @type {string} */
      token = token + ("'" + contacts[i] + "'");
      if (i === contacts.length - 1) {
        /** @type {string} */
        token = token + ".";
      } else {
        if (contacts.length !== 2) {
          /** @type {string} */
          token = token + ", ";
        }
      }
      if (i === contacts.length - 2) {
        /** @type {string} */
        token = token + ((contacts.length === 2 ? " " : "") + "and ");
      }
    }
    Game.speech(this.x, this.y, token.split("\n"));
  }
};
/**
 * @param {?} val
 * @return {?}
 */
Princess.prototype.newLoadLevelCallback = function(val) {
  var connector1 = this;
  var nextval = val;
  return function() {
    vim.gamestate.loadLevelFromString(nextval);
    connector1.invalidate();
    vim.model.clearCellCache();
    vim.input.enableKeys();
    vim.audio.play("appearance");
    vim.stats.startLevel(vim.model.getLevel());
  };
};
/**
 * @param {?} tx
 * @param {?} property
 * @param {number} isAscending
 * @param {number} msg
 * @param {string} commands
 * @param {number} w
 * @param {number} h
 * @param {string} name
 * @return {undefined}
 */
var TimerGirl = function(tx, property, isAscending, msg, commands, w, h, name) {
  /** @type {number} */
  var c = 37 / 6;
  Entity.call(this, tx, property, "horn_girl");
  this.movePattern = new InCellRandomMovement(this, 200, -c, c, 1);
  /** @type {number} */
  this.intervalInSec = isAscending;
  /** @type {number} */
  this.startMessage = msg;
  /** @type {string} */
  this.stillMessage = commands;
  /** @type {number} */
  this.targetX = w;
  /** @type {number} */
  this.targetY = h;
  /** @type {string} */
  this.name = name;
};
/** @type {!Object} */
TimerGirl.prototype = Object.create(Entity.prototype);
/**
 * @return {?}
 */
TimerGirl.prototype.getData = function() {
  var event = Entity.prototype.getData.call(this);
  /** @type {string} */
  event.type = "timer_girl";
  event.startMessage = this.startMessage;
  event.stillMessage = this.stillMessage;
  event.targetX = this.targetX;
  event.targetY = this.targetY;
  event.intervalInSec = this.intervalInSec;
  event.name = this.name;
  event.topX = this.topX;
  event.topY = this.topY;
  return event;
};
/**
 * @param {!Object} event
 * @return {?}
 */
TimerGirl.prototype.restore = function(event) {
  var that = new TimerGirl(event.x, event.y, event.intervalInSec, event.startMessage, event.stillMessage, event.targetX, event.targetY, event.name);
  Entity.prototype.restore.call(that, event);
  if (typeof that.getImageName() !== "string") {
    that.setImageName("horn_girl");
  }
  this.topX = event.topX;
  this.topY = event.topY;
  return that;
};
/**
 * @return {undefined}
 */
TimerGirl.prototype.collide = function() {
  if (!vim.timer.isActive(this.name)) {
    vim.timer.set(this.intervalInSec, this.name);
    this.topX = vim.model.getTopX();
    this.topY = vim.model.getTopY();
    Game.speech(this.getX(), this.getY(), this.startMessage);
    vim.audio.play("yeepee");
  } else {
    Game.speech(this.getX(), this.getY(), this.stillMessage);
    vim.audio.play("yeepee");
  }
};
/**
 * @return {undefined}
 */
TimerGirl.prototype.timerDone = function() {
  vim.audio.play("appearance");
  vim.model.setTopX(this.topX);
  vim.model.setTopY(this.topY);
  Cursor.set(this.targetX, this.targetY);
  vim.model.readjustViewToCursorPosition();
  vim.model.cancelCursorPositionAnimations();
  vim.view.notifyPointCursor();
};
/**
 * @return {undefined}
 */
TimerGirl.prototype.clear = function() {
  Entity.prototype.clear.call(this);
  vim.timer.clear(this.name);
};
/**
 * @param {?} tx
 * @param {?} property
 * @param {number} lastReal
 * @param {number} history
 * @param {string} measurementHistory
 * @return {undefined}
 */
var StopTimerGirl = function(tx, property, lastReal, history, measurementHistory) {
  /** @type {number} */
  var b = 37 / 6;
  Entity.call(this, tx, property, "horn_girl");
  this.movePattern = new InCellRandomMovement(this, 200, -b, b, 1);
  /** @type {number} */
  this.timerName = lastReal;
  /** @type {number} */
  this.stopMessage = history;
  /** @type {string} */
  this.moreMessage = measurementHistory;
};
/** @type {!Object} */
StopTimerGirl.prototype = Object.create(Entity.prototype);
/**
 * @return {?}
 */
StopTimerGirl.prototype.getData = function() {
  var self = Entity.prototype.getData.call(this);
  /** @type {string} */
  self.type = "stop_timer_girl";
  self.stopMessage = this.stopMessage;
  self.moreMessage = this.moreMessage;
  self.timerName = this.timerName;
  return self;
};
/**
 * @param {!Object} self
 * @return {?}
 */
StopTimerGirl.prototype.restore = function(self) {
  var that = new StopTimerGirl(self.x, self.y, self.timerName, self.stopMessage, self.moreMessage);
  Entity.prototype.restore.call(that, self);
  if (typeof that.getImageName() !== "string") {
    that.setImageName("horn_girl");
  }
  return that;
};
/**
 * @return {undefined}
 */
StopTimerGirl.prototype.collide = function() {
  if (vim.timer.isActive(this.timerName)) {
    vim.timer.clear(this.timerName);
    Game.speech(this.getX(), this.getY(), this.stopMessage);
  } else {
    Game.speech(this.getX(), this.getY(), this.moreMessage);
  }
  vim.audio.play("yeepee");
};
/**
 * @param {?} name
 * @param {?} data
 * @param {!Object} options
 * @return {undefined}
 */
var CursorNPC = function(name, data, options) {
  Entity.call(this, name, data, undefined);
  this.fillStyle = options.fillStyle || "rgba(130, 130, 0, 0.5)";
  this.blinkRate = options.blinkRate || 400;
  this.movePattern = new CursorNPCBlinkMovement(this, this.blinkRate);
  this.dialog = options.dialog;
};
/** @type {!Object} */
CursorNPC.prototype = Object.create(Entity.prototype);
/**
 * @return {?}
 */
CursorNPC.prototype.getData = function() {
  var item = Entity.prototype.getData.call(this);
  /** @type {string} */
  item.type = "cursor_npc";
  item.fillStyle = this.fillStyle;
  item.blinkRate = this.blinkRate;
  item.dialog = this.dialog;
  /** @type {boolean} */
  item.isCursorIn = true;
  return item;
};
/**
 * @param {!Object} item
 * @return {?}
 */
CursorNPC.prototype.restore = function(item) {
  var ctx = new CursorNPC(item.x, item.y, item);
  Entity.prototype.restore.call(ctx, item);
  if (typeof item.fillStyle !== "undefined") {
    ctx.fillStyle = item.fillStyle;
  }
  if (typeof item.blinkRate !== "undefined" || item.blinkRate !== this.blinkRate) {
    ctx.blinkRate = item.blinkRate;
    ctx.movePattern.stop();
    ctx.movePattern = new CursorNPCBlinkMovement(ctx, ctx.blinkRate);
  }
  return ctx;
};
/**
 * @return {undefined}
 */
CursorNPC.prototype.collide = function() {
  /** @type {string} */
  this.dialogState = "0";
  this.bindInput();
  this.respond(true);
};
/**
 * @return {undefined}
 */
CursorNPC.prototype.bindInput = function() {
  vim.input.disableKeys(true);
  vim.dom.bind(window, "keydown", CursorNPC.prototype.keydownCallback);
  vim.dom.bind(window, "keypress", CursorNPC.prototype.keypressCallback);
  Cursor.blink();
};
/**
 * @param {boolean} isIron
 * @return {undefined}
 */
CursorNPC.prototype.unbindInput = function(isIron) {
  vim.dom.unbind(window, "keydown", CursorNPC.prototype.keydownCallback);
  vim.dom.unbind(window, "keypress", CursorNPC.prototype.keypressCallback);
  if (isIron === true) {
    vim.input.enableKeys();
  } else {
    vim.input.disableKeys();
  }
};
/**
 * @return {?}
 */
CursorNPC.prototype.getCurrentNPC = function() {
  var fileListAndSize = vim.buffers.getCurrentBuffer().getEntities();
  var keywordResults = fileListAndSize.list(Cursor.getX(), Cursor.getY());
  var i;
  /** @type {number} */
  i = 0;
  for (; i < keywordResults.length; i = i + 1) {
    if (!keywordResults[i].isInvisible() && keywordResults[i] instanceof CursorNPC) {
      return keywordResults[i];
    }
  }
  return undefined;
};
/**
 * @param {!Object} event
 * @return {?}
 */
CursorNPC.prototype.keypressCallback = function(event) {
  /** @type {boolean} */
  var a = false;
  var context = CursorNPC.prototype.getCurrentNPC();
  var options;
  var i;
  var tabsCount = event.keyCode || event.charCode;
  if (tabsCount === 8 || tabsCount >= 37 && tabsCount <= 40) {
    /** @type {boolean} */
    a = true;
  }
  if (tabsCount >= 49 && tabsCount <= 57) {
    /** @type {number} */
    i = tabsCount - 49;
    if (context.optionKeys[i]) {
      options = context.dialog[context.dialogState].options[context.optionKeys[i]];
      vim.view.notifySpeech(-1, -1, "");
      CursorNPC.prototype.unbindInput(false);
      if (options.disposable === true) {
        context.dialog[context.dialogState].options.splice(context.optionKeys[i], 1);
      }
      context.dialogState = options["goto"];
      context.onlyOptions = options.onlyOptions;
      vim.screens["game-screen"].setColonCommand("");
      if (context.dialogState === "-1") {
        if (typeof options.byeMsg === "undefined") {
          Game.setCursorCommand(options.response);
          context.unbindInput(true);
        } else {
          Game.setCursorCommandUntilMove(options.response);
          window.setTimeout(context.newByeMessageCallback(options.byeMsg), 3000);
        }
      } else {
        Game.setCursorCommandUntilMove(options.newResponse || options.response);
        if (options.newResponse) {
          delete options.newResponse;
        }
        window.setTimeout(CursorNPC.prototype.respond, 3000);
      }
    }
  }
  if (a) {
    vim.input.preventDefault(event);
    return false;
  }
  return true;
};
/**
 * @param {string} clusterShardData
 * @return {?}
 */
CursorNPC.prototype.newByeMessageCallback = function(clusterShardData) {
  var StatePosition = this;
  return function() {
    Game.setCursorCommand("", false, -1, -1);
    vim.view.notifySpeech(-1, -1, "");
    Game.speech(StatePosition.getX(), StatePosition.getY(), clusterShardData.split("\n"), true, true);
    StatePosition.unbindInput(true);
  };
};
/**
 * @param {!Object} e
 * @return {?}
 */
CursorNPC.prototype.keydownCallback = function(e) {
  /** @type {boolean} */
  var a = false;
  if (e.keyCode === 8 || e.keyCode >= 37 && e.keyCode <= 40) {
    /** @type {boolean} */
    a = true;
  } else {
    if (e.keyCode === 27) {
      /** @type {boolean} */
      a = true;
    }
  }
  if (a) {
    vim.input.preventDefault(e);
    return false;
  }
  return true;
};
/**
 * @param {boolean} muted
 * @return {undefined}
 */
CursorNPC.prototype.respond = function(muted) {
  var request = CursorNPC.prototype.getCurrentNPC();
  /** @type {string} */
  var s = "";
  var data = request.dialog[request.dialogState];
  var parameters = data;
  var componentsStr;
  var i;
  var h;
  /** @type {number} */
  var e = 0;
  if (!muted) {
    request.bindInput();
  }
  vim.view.notifySpeech(-1, -1, "");
  Game.speech(request.getX(), request.getY(), parameters.newMsg ? parameters.newMsg.split("\n") : parameters.msg.split("\n"), true);
  if (parameters.newMsg) {
    delete parameters.newMsg;
  }
  if (parameters.fillStyle) {
    request.fillStyle = parameters.fillStyle;
  }
  if (parameters.blinkRate) {
    request.blinkRate = parameters.blinkRate;
  }
  if (typeof data.options === "undefined" || data.options.length === 0) {
    request.dialogState = data["goto"];
    data = request.dialog[request.dialogState];
  }
  if (typeof data.options === "undefined" || data.options.length === 0) {
    /** @type {string} */
    request.dialogState = "0";
    data = request.dialog[request.dialogState];
  }
  /** @type {!Array} */
  request.optionKeys = [];
  for (i in data.options) {
    if (data.options[i].fillStyle && data.options[i].fillStyle !== request.fillStyle) {
      continue;
    }
    request.optionKeys.push(i);
    ++e;
    componentsStr = data.options[i].newResponse || data.options[i].response;
    /** @type {string} */
    s = s + (e + ". " + componentsStr.split("\n").join(" ") + "\n");
  }
  vim.screens["game-screen"].setColonCommand(s);
};
/**
 * @return {?}
 */
CursorNPC.prototype.getFillStyle = function() {
  return this.fillStyle || "rgba(130, 130, 0, 0.5)";
};
/**
 * @return {?}
 */
CursorNPC.prototype.isCursorNPCOn = function() {
  return this.isCursorOn || this.getX() === Cursor.getX() && this.getY() === Cursor.getY();
};
/**
 * @return {undefined}
 */
CursorNPC.prototype.toggleBlink = function() {
  /** @type {boolean} */
  this.isCursorOn = !this.isCursorOn;
};
/**
 * @param {?} id
 * @param {?} data
 * @param {string} color
 * @return {undefined}
 */
var Door = function(id, data, color) {
  this.color = color || "";
  Entity.call(this, id, data, this.color + (this.color !== "" ? "_" : "") + "closed_door");
  this.setYOffset(3);
  this.setBlocking(true);
};
/** @type {!Object} */
Door.prototype = Object.create(Entity.prototype);
/**
 * @return {?}
 */
Door.prototype.getData = function() {
  var json = Entity.prototype.getData.call(this);
  /** @type {string} */
  json.type = "door";
  json.blocking = this.isBlocking();
  json.color = this.color;
  return json;
};
/**
 * @param {!Object} config
 * @return {?}
 */
Door.prototype.restore = function(config) {
  var that = new Door(config.x, config.y, config.color || "");
  Entity.prototype.restore.call(that, config);
  that.setBlocking(config.blocking);
  if (typeof that.getImageName() !== "string") {
    that.setImageName(that.color + (this.color !== "" ? "_" : "") + "closed_door");
  }
  return that;
};
/**
 * @return {?}
 */
Door.prototype.collide = function() {
  var expr;
  var i;
  var name;
  name = this.color || "yellow";
  if (this.isBlocking() && vim.inventory.hasKey(name)) {
    vim.inventory.useKey(name);
    this.setBlocking(false);
    this.movePattern = new DoorOpeningMovement(this);
    vim.audio.play("open_door");
    expr = vim.buffers.getCurrentBuffer().getEntities().listConnectedRoofs(this.x, this.y);
    /** @type {number} */
    i = 0;
    for (; i < expr.length; i = i + 1) {
      expr[i].setInvisible(true);
    }
    return true;
  } else {
    if (this.isBlocking()) {
      Game.setCursorCommand("I need to find\na " + name + " key to\nunlock this door.", true);
      vim.audio.play("closed_door");
      return true;
    }
  }
};
/**
 * @param {?} tx
 * @param {?} property
 * @return {undefined}
 */
var ClosedChest = function(tx, property) {
  Entity.call(this, tx, property, "closed_chest");
  this.setBlocking(true);
  /** @type {boolean} */
  this.isClosed = true;
};
/** @type {!Object} */
ClosedChest.prototype = Object.create(Entity.prototype);
/**
 * @return {?}
 */
ClosedChest.prototype.getData = function() {
  var state = Entity.prototype.getData.call(this);
  /** @type {string} */
  state.type = "chest";
  state.blocking = this.isBlocking();
  state.closed = this.isClosed;
  /** @type {string} */
  state.imageName = this.isClosed ? "closed_chest" : "open_chest";
  return state;
};
/**
 * @param {!Object} json
 * @return {?}
 */
ClosedChest.prototype.restore = function(json) {
  var that = new ClosedChest(json.x, json.y);
  Entity.prototype.restore.call(that, json);
  that.setBlocking(json.blocking);
  if (!json.closed) {
    that.setOpened();
  }
  if (typeof that.getImageName() !== "string") {
    that.setImageName(that.isClosed ? "closed_chest" : "open_chest");
  }
  return that;
};
/**
 * @return {?}
 */
ClosedChest.prototype.setOpened = function() {
  /** @type {boolean} */
  this.isClosed = false;
  /** @type {string} */
  this.imageName = "open_chest";
  return true;
};
/**
 * @param {!Object} b
 * @return {?}
 */
ClosedChest.prototype.removeFromChestCallback = function(b) {
  /** @type {!Object} */
  var check = b;
  return function() {
    check.setInvisible(false);
    check.collide();
    vim.model.recacheCell(check.x, check.y);
  };
};
/**
 * @return {?}
 */
ClosedChest.prototype.collide = function() {
  var expr;
  var i;
  /** @type {number} */
  var b = 4000;
  /** @type {number} */
  var d = 800;
  var a;
  var g;
  var c = vim.buffers.getCurrentBuffer().getEntities();
  if (this.isClosed && vim.inventory.hasKey("small_brown")) {
    vim.inventory.useKey("small_brown");
    /** @type {boolean} */
    this.isClosed = false;
    a = new CollectableObject(this.x, this.y, "chest_lid");
    c.add(a);
    /** @type {number} */
    a.collectStep = 1;
    a.collide();
    vim.model.recacheCell(this.x, this.y);
    /** @type {string} */
    this.imageName = "open_chest";
    vim.audio.play("chest_open");
    expr = c.list(this.x, this.y);
    /** @type {number} */
    i = 0;
    for (; i < expr.length; i = i + 1) {
      if (expr[i].isInvisible() && expr[i].getImageName().indexOf("roof") === -1) {
        /** @type {number} */
        b = b + d;
        window.setTimeout(this.removeFromChestCallback(expr[i]), b);
      }
    }
    return true;
  } else {
    if (!this.isClosed) {
      /** @type {boolean} */
      g = false;
      /** @type {number} */
      b = -d + 10;
      expr = c.list(this.x, this.y);
      /** @type {number} */
      i = 0;
      for (; i < expr.length; i = i + 1) {
        if (expr[i].isInvisible()) {
          /** @type {number} */
          b = b + d;
          window.setTimeout(this.removeFromChestCallback(expr[i]), b);
          /** @type {boolean} */
          g = true;
        }
      }
      if (g) {
        return true;
      } else {
        vim.audio.play("blocked");
        return false;
      }
    } else {
      Game.setCursorCommand("I need to find a\nsmall brown key to\nunlock this chest.", true);
      vim.audio.play("blocked");
      return false;
    }
  }
};
/**
 * @param {?} b
 * @param {?} options
 * @return {undefined}
 */
var Candle = function(b, options) {
  CollectableObject.call(this, b, options, "candle");
  /** @type {number} */
  this.collectStep = 2;
};
/** @type {!Object} */
Candle.prototype = Object.create(CollectableObject.prototype);
/**
 * @return {?}
 */
Candle.prototype.getData = function() {
  var parsedMetadata = CollectableObject.prototype.getData.call(this);
  /** @type {string} */
  parsedMetadata.type = "candle";
  return parsedMetadata;
};
/**
 * @param {!Object} data
 * @return {?}
 */
Candle.prototype.restore = function(data) {
  var that = new Candle(data.x, data.y);
  CollectableObject.prototype.restore.call(that, data);
  that.setBlocking(data.blocking);
  if (typeof that.getImageName() !== "string") {
    that.setImageName("candle");
  }
  return that;
};
/**
 * @return {undefined}
 */
Candle.prototype.collect = function() {
  /** @type {boolean} */
  this.collected = true;
  vim.audio.play("collect");
  window.setTimeout(Game.darknessFalls, 1000);
};
/**
 * @param {?} x
 * @param {?} game
 * @return {undefined}
 */
var Rock = function(x, game) {
  Entity.call(this, x, game, "rock");
  this.setYOffset(0);
  this.setBlocking(true);
};
/** @type {!Object} */
Rock.prototype = Object.create(Entity.prototype);
/**
 * @return {?}
 */
Rock.prototype.getData = function() {
  var obj = Entity.prototype.getData.call(this);
  /** @type {string} */
  obj.type = "rock";
  return obj;
};
/**
 * @param {!Object} child
 * @return {?}
 */
Rock.prototype.restore = function(child) {
  var that = new Rock(child.x, child.y);
  Entity.prototype.restore.call(that, child);
  if (typeof that.getImageName() !== "string") {
    that.setImageName("rock");
  }
  return that;
};
/**
 * @param {?} tx
 * @param {?} property
 * @param {string} value
 * @return {undefined}
 */
var Roof = function(tx, property, value) {
  Entity.call(this, tx, property, value);
  /** @type {string} */
  this.roof_type = value;
  this.setYOffset(value.indexOf("south") !== -1 ? -31 : -32);
};
/** @type {!Object} */
Roof.prototype = Object.create(Entity.prototype);
/**
 * @return {?}
 */
Roof.prototype.getData = function() {
  var parsedMetadata = Entity.prototype.getData.call(this);
  parsedMetadata.type = this.roof_type;
  return parsedMetadata;
};
/**
 * @param {!Object} evt
 * @return {?}
 */
Roof.prototype.restore = function(evt) {
  var that = new Roof(evt.x, evt.y, evt.type);
  Entity.prototype.restore.call(that, evt);
  if (typeof that.getImageName() !== "string") {
    that.setImageName(evt.roof_type);
  }
  return that;
};
/**
 * @param {?} tx
 * @param {?} property
 * @return {undefined}
 */
var TallTree = function(tx, property) {
  Entity.call(this, tx, property, "tall_tree");
  this.setYOffset(-3);
  this.setBlocking(true);
};
/** @type {!Object} */
TallTree.prototype = Object.create(Entity.prototype);
/**
 * @return {?}
 */
TallTree.prototype.getData = function() {
  var parsedMetadata = Entity.prototype.getData.call(this);
  /** @type {string} */
  parsedMetadata.type = "tall_tree";
  return parsedMetadata;
};
/**
 * @param {!Object} child
 * @return {?}
 */
TallTree.prototype.restore = function(child) {
  var that = new TallTree(child.x, child.y);
  Entity.prototype.restore.call(that, child);
  if (typeof that.getImageName() !== "string") {
    that.setImageName("tall_tree");
  }
  return that;
};
/**
 * @param {?} tx
 * @param {?} property
 * @return {undefined}
 */
var ShortTree = function(tx, property) {
  Entity.call(this, tx, property, "short_tree");
  this.setYOffset(-3);
  /** @type {boolean} */
  this.isUgly = false;
};
/** @type {!Object} */
ShortTree.prototype = Object.create(Entity.prototype);
/**
 * @return {?}
 */
ShortTree.prototype.getData = function() {
  var state = Entity.prototype.getData.call(this);
  /** @type {string} */
  state.type = "short_tree";
  state.isUgly = this.isUgly;
  /** @type {string} */
  state.imageName = this.isUgly ? "ugly_tree" : "short_tree";
  return state;
};
/**
 * @param {!Object} child
 * @return {?}
 */
ShortTree.prototype.restore = function(child) {
  var that = new ShortTree(child.x, child.y);
  Entity.prototype.restore.call(that, child);
  if (child.isUgly) {
    that.setUgly();
  }
  if (typeof that.getImageName() !== "string") {
    that.setImageName(that.isUgly ? "ugly_tree" : "short_tree");
  }
  return that;
};
/**
 * @return {?}
 */
ShortTree.prototype.setUgly = function() {
  /** @type {boolean} */
  this.isUgly = true;
  /** @type {string} */
  this.imageName = "ugly_tree";
  return true;
};
/**
 * @param {!Object} ngramMin
 * @return {?}
 */
ShortTree.prototype.revealTreeHidingCallback = function(ngramMin) {
  /** @type {!Object} */
  var b = ngramMin;
  return function() {
    b.setInvisible(false);
    b.collide();
  };
};
/**
 * @return {?}
 */
ShortTree.prototype.changeToUglyCallback = function() {
  var annotator = this;
  return function() {
    /** @type {string} */
    annotator.imageName = "ugly_tree";
  };
};
/**
 * @return {?}
 */
ShortTree.prototype.collide = function() {
  var expr;
  var i;
  /** @type {number} */
  var b = 400;
  /** @type {number} */
  var d = 400;
  var e;
  var c;
  var character = vim.buffers.getCurrentBuffer().getEntities();
  if (!this.isUgly) {
    /** @type {boolean} */
    this.isUgly = true;
    vim.audio.play("search_tree");
    window.setTimeout(this.changeToUglyCallback(), 800);
    expr = character.list(this.x, this.y);
    /** @type {number} */
    i = 0;
    for (; i < expr.length; i = i + 1) {
      if (expr[i].isInvisible()) {
        /** @type {number} */
        b = b + d;
        window.setTimeout(this.revealTreeHidingCallback(expr[i]), b);
      }
    }
    return true;
  } else {
    if (this.isUgly) {
      /** @type {boolean} */
      c = false;
      /** @type {number} */
      b = -d + 10;
      expr = character.list(this.x, this.y);
      /** @type {number} */
      i = 0;
      for (; i < expr.length; i = i + 1) {
        if (expr[i].isInvisible()) {
          /** @type {number} */
          b = b + d;
          window.setTimeout(this.revealTreeHidingCallback(expr[i]), b);
          /** @type {boolean} */
          c = true;
        }
      }
      if (c) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
};
/**
 * @param {?} id
 * @param {?} data
 * @return {undefined}
 */
var Selector = function(id, data) {
  Entity.call(this, id, data, "selector");
  /** @type {boolean} */
  this.isOff = true;
  /** @type {number} */
  this.yOffset = -3;
  /** @type {boolean} */
  this.collideEvenIfInvisible = true;
};
/** @type {!Object} */
Selector.prototype = Object.create(Entity.prototype);
/**
 * @return {?}
 */
Selector.prototype.getData = function() {
  var data = Entity.prototype.getData.call(this);
  /** @type {string} */
  data.type = "selector";
  data.blocking = this.isBlocking();
  data.isOff = this.isOff;
  /** @type {string} */
  data.imageName = this.isOff ? "selector" : "selector_on";
  return data;
};
/**
 * @param {!Object} options
 * @return {?}
 */
Selector.prototype.restore = function(options) {
  var that = new Selector(options.x, options.y);
  Entity.prototype.restore.call(that, options);
  that.setBlocking(options.blocking);
  if (!options.isOff) {
    that.setOn();
  }
  if (typeof that.getImageName() !== "string") {
    that.setImageName(that.isOff ? "selector" : "selector_on");
  }
  return that;
};
/**
 * @return {?}
 */
Selector.prototype.setOn = function() {
  /** @type {boolean} */
  this.isOff = false;
  /** @type {string} */
  this.imageName = "selector_on";
  return true;
};
/**
 * @return {?}
 */
Selector.prototype.collide = function() {
  var s = vim.inventory;
  if (this.isInvisible()) {
    this.setInvisible(false);
    vim.view.notifyAppearingSelector(this);
    vim.audio.play("selector_appear");
    return true;
  }
  if (this.isOff && s.hasKey("star")) {
    s.useKey("star");
    /** @type {boolean} */
    this.isOff = false;
    /** @type {string} */
    this.imageName = "selector_on";
  }
  if (!this.isOff) {
    vim.audio.play("teleport");
    Cursor.restorePositionCallback(515, 562, "sky", false)();
    return true;
  } else {
    if (this.isOff && !s.hasKey("star")) {
      Game.setCursorCommand("There seem to be a\nstar missing there.", true);
      return false;
    }
  }
  return false;
};
/**
 * @param {?} tx
 * @param {?} id
 * @param {!Object} a
 * @param {boolean} b
 * @return {undefined}
 */
var RedBug = function(tx, id, a, b) {
  Entity.call(this, tx, id, "red_bug_right");
  /** @type {!Object} */
  this.volPattern = a;
  this.volHidden = typeof b === "undefined" ? false : b;
  /** @type {string} */
  this.direction = "s";
  /** @type {number} */
  this.speed = 2;
  /** @type {number} */
  this.duration = 1;
  /** @type {boolean} */
  this.frozen = false;
};
/** @type {!Object} */
RedBug.prototype = Object.create(Entity.prototype);
/**
 * @return {?}
 */
RedBug.prototype.getData = function() {
  var object = Entity.prototype.getData.call(this);
  object.volPattern = this.volPattern;
  object.volHidden = this.volHidden;
  object.direction = this.direction;
  object.speed = this.speed;
  object.duration = this.duration;
  /** @type {string} */
  object.type = "red_bug";
  return object;
};
/**
 * @param {!Object} options
 * @return {?}
 */
RedBug.prototype.restore = function(options) {
  var res = new RedBug(options.x, options.y, options.volPattern, options.volHidden);
  Entity.prototype.restore.call(res, options);
  res.direction = options.direction || "s";
  res.speed = options.speed || 2;
  res.duration = options.duration || 1;
  return res;
};
/**
 * @return {?}
 */
RedBug.prototype.getVolPattern = function() {
  return this.volPattern;
};
/**
 * @return {?}
 */
RedBug.prototype.isVolHidden = function() {
  return this.volHidden;
};
/**
 * @return {undefined}
 */
RedBug.prototype.freeze = function() {
  /** @type {boolean} */
  this.frozen = true;
};
/**
 * @return {undefined}
 */
RedBug.prototype.unfreeze = function() {
  /** @type {boolean} */
  this.frozen = false;
};
/**
 * @return {?}
 */
RedBug.prototype.isFrozen = function() {
  return this.frozen;
};
/**
 * @param {number} target
 * @return {undefined}
 */
RedBug.prototype.collide = function(target) {
  var xhair = this.getSafePoint();
  if (target && vim.buffers.getCurrentBuffer().getName() !== target) {
    return;
  }
  if (!this.isCollidingWithCursor() || this.inCollision === true) {
    return;
  }
  if (Cursor.isWaitingForRestorePosition()) {
    return;
  }
  /** @type {boolean} */
  this.inCollision = true;
  /** @type {string} */
  this.direction = "s";
  /** @type {number} */
  this.duration = this.volPattern.length > 3 ? 2 : 80;
  if (vim.input.isInInputMode()) {
    vim.input.returnToCommandMode(true);
    vim.view.notifyCommandMode();
    vim.screens["game-screen"].showGameMenu();
  }
  vim.input.disableKeys();
  Cursor.stopBlink();
  vim.view.notifyDisappearingCursorAnimation(xhair.x, xhair.y, xhair.bufferName, this, true);
  vim.audio.play("teleport");
  vim.stats.incDeaths(vim.model.getLevel());
};
/**
 * @return {?}
 */
RedBug.prototype.getSafePoint = function() {
  if (vim.model.getLevel() === 12 && vim.buffers.getCurrentBuffer().getName() === "underground") {
    return {
      x : 106,
      y : 113,
      bufferName : "underground"
    };
  }
  if (vim.model.getLevel() === 14) {
    return {
      x : 123,
      y : 119,
      bufferName : "lorem"
    };
  }
  return {
    x : Cursor.getX(),
    y : Cursor.getY(),
    bufferName : vim.buffers.getCurrentBuffer().getName()
  };
};
/**
 * @return {?}
 */
RedBug.prototype.isCollidingWithCursor = function() {
  var a = Cursor.getX();
  var lumB = Cursor.getY();
  /** @type {boolean} */
  var d = false;
  /** @type {number} */
  var x = 37;
  /** @type {number} */
  var b = 30;
  d = boxCollision(this.x * x + this.xOffset + 10, this.y * b + this.yOffset - x / 3 + 29 + 5, (this.x + 1) * x + this.xOffset - 10, this.y * b + this.yOffset - x / 3 + 54 - 5, a * x, lumB * b + 37 / 10 * 5, (a + 1) * x, (lumB + 1) * b);
  return d;
};
/**
 * @param {number} msg
 * @return {?}
 */
RedBug.prototype.isCellUpValid = function(msg) {
  var abs = vim.model.isValidBugPosition;
  var left = this.x;
  var y = this.y;
  var x = this.xOffset;
  var yOffset = this.yOffset;
  /** @type {boolean} */
  var legit = true;
  legit = legit && abs(left, y - 1, msg);
  legit = legit && (x < 10 || abs(left + 1, y - 1, msg));
  return legit;
};
/**
 * @param {number} msg
 * @return {?}
 */
RedBug.prototype.isCellDownValid = function(msg) {
  var equal = vim.model.isValidBugPosition;
  var left = this.x;
  var v = this.y;
  var x = this.xOffset;
  var yOffset = this.yOffset;
  /** @type {boolean} */
  var legit = true;
  legit = legit && equal(left, v + 1, msg);
  legit = legit && (x < 10 || equal(left + 1, v + 1, msg));
  return legit;
};
/**
 * @param {number} name
 * @return {?}
 */
RedBug.prototype.isCellLeftValid = function(name) {
  var is_based = vim.model.isValidBugPosition;
  var left = this.x;
  var u_oldpass = this.y;
  var x = this.xOffset;
  var yOffset = this.yOffset;
  /** @type {boolean} */
  var c = true;
  c = is_based(left, u_oldpass, name) && (is_based(left - 1, u_oldpass, name) || is_based(left + 1, u_oldpass, name));
  c = c && (x > 10 || is_based(left - 1, u_oldpass, name));
  c = c && (yOffset < 5 || is_based(left - 1, u_oldpass + 1, name));
  return c;
};
/**
 * @param {number} name
 * @return {?}
 */
RedBug.prototype.isCellRightValid = function(name) {
  var is_based = vim.model.isValidBugPosition;
  var left = this.x;
  var u_oldpass = this.y;
  var x = this.xOffset;
  var yOffset = this.yOffset;
  /** @type {boolean} */
  var c = true;
  c = is_based(left, u_oldpass, name) && (is_based(left - 1, u_oldpass, name) || is_based(left + 1, u_oldpass, name));
  c = c && (x < 10 || is_based(left + 1, u_oldpass, name));
  c = c && (yOffset < 5 || is_based(left + 1, u_oldpass + 1, name));
  return c;
};
/**
 * @param {number} start
 * @return {undefined}
 */
RedBug.prototype.update = function(start) {
  var x1;
  var yOffset;
  var ctx = vim.model;
  var el = start ? vim.buffers.getBuffer(start) : vim.buffers.getCurrentBuffer();
  var context = el.getEntities();
  var value;
  /** @type {number} */
  var x3 = 37;
  /** @type {number} */
  var tileH = 30;
  if (this.frozen) {
    return;
  }
  --this.duration;
  if (this.duration < 1) {
    /** @type {number} */
    this.duration = Math.floor(2 * Math.random() * 30);
    /** @type {number} */
    this.speed = Math.floor(2 + 5 * Math.random() * (this.volPattern.length > 3 ? 4 : 1));
    /** @type {string} */
    value = this.isCellLeftValid(start) || this.xOffset - this.speed >= 0 ? "l" : "";
    /** @type {string} */
    value = value + (this.isCellRightValid(start) || this.xOffset + this.speed <= 10 ? "r" : "");
    /** @type {string} */
    value = value + (this.isCellUpValid(start) || this.yOffset - this.speed >= 0 ? "u" : "");
    /** @type {string} */
    value = value + (this.isCellDownValid(start) || this.yOffset + this.speed <= tileH - 22 ? "d" : "");
    /** @type {string} */
    value = value + (this.direction !== "s" && Math.random() < 0.3 ? "s" : "");
    /** @type {string} */
    this.direction = value.charAt(Math.floor(Math.random() * value.length));
    if (this.direction === "l") {
      /** @type {string} */
      this.imageName = "red_bug_left";
    } else {
      if (this.direction === "r") {
        /** @type {string} */
        this.imageName = "red_bug_right";
      } else {
        if (this.direction === "s" && this.volPattern.length > 3) {
          /** @type {number} */
          this.duration = 2;
        }
      }
    }
    return;
  }
  x1 = this.xOffset + (this.direction === "l" || this.direction === "r" ? this.speed * (this.direction === "l" ? -1 : 1) : 0);
  yOffset = this.yOffset + (this.direction === "u" || this.direction === "d" ? this.speed * (this.direction === "u" ? -1 : 1) : 0);
  switch(this.direction) {
    case "u":
      if (yOffset < 0) {
        if (ctx.isValidBugPosition(this.x, this.y - 1, start) && this.isCellUpValid(start)) {
          this.yOffset = tileH + yOffset;
          /** @type {number} */
          this.y = this.y - 1;
          context.moveEntityFrom(this, this.x, this.y + 1);
          ctx.recacheCell(this.x, this.y);
          ctx.recacheCell(this.x, this.y + 1);
        } else {
          /** @type {string} */
          this.direction = "s";
          /** @type {number} */
          this.duration = 1;
        }
      } else {
        this.yOffset = yOffset;
      }
      break;
    case "d":
      if (yOffset > tileH - 22) {
        if (ctx.isValidBugPosition(this.x, this.y + 1, start) && this.isCellDownValid(start)) {
          /** @type {number} */
          this.yOffset = yOffset - tileH;
          this.y = this.y + 1;
          context.moveEntityFrom(this, this.x, this.y - 1);
          ctx.recacheCell(this.x, this.y);
          ctx.recacheCell(this.x, this.y - 1);
        } else {
          /** @type {string} */
          this.direction = "s";
          /** @type {number} */
          this.duration = 1;
        }
      } else {
        this.yOffset = yOffset;
      }
      break;
    case "l":
      if (x1 < 0) {
        if (ctx.isValidBugPosition(this.x - 1, this.y, start) && this.isCellLeftValid(start)) {
          this.xOffset = x3 + x1;
          /** @type {number} */
          this.x = this.x - 1;
          context.moveEntityFrom(this, this.x + 1, this.y);
          ctx.recacheCell(this.x, this.y);
          ctx.recacheCell(this.x + 1, this.y);
        } else {
          /** @type {string} */
          this.direction = "s";
          /** @type {number} */
          this.duration = 1;
        }
      } else {
        this.xOffset = x1;
      }
      break;
    case "r":
      if (x1 > x3) {
        if (ctx.isValidBugPosition(this.x + 1, this.y, start) && this.isCellRightValid(start)) {
          /** @type {number} */
          this.xOffset = x1 - x3;
          this.x = this.x + 1;
          context.moveEntityFrom(this, this.x - 1, this.y);
          ctx.recacheCell(this.x, this.y);
          ctx.recacheCell(this.x - 1, this.y);
        } else {
          /** @type {string} */
          this.direction = "s";
          /** @type {number} */
          this.duration = 1;
        }
      } else {
        if (this.isCellRightValid() || this.xOffset <= 10) {
          this.xOffset = x1;
        }
      }
      break;
  }
  this.collide(start);
};
/**
 * @param {number} entityA
 * @param {number} entityB
 * @param {number} box
 * @param {number} f
 * @param {number} num
 * @param {number} length
 * @param {number} options
 * @param {number} suggestedVariableValueCallback
 * @return {?}
 */
function boxCollision(entityA, entityB, box, f, num, length, options, suggestedVariableValueCallback) {
  if (f < length) {
    return false;
  }
  if (entityB > suggestedVariableValueCallback) {
    return false;
  }
  if (box < num) {
    return false;
  }
  if (entityA > options) {
    return false;
  }
  return true;
}
/**
 * @param {?} tx
 * @param {?} property
 * @param {number} decorators
 * @return {undefined}
 */
var BigBug = function(tx, property, decorators) {
  Entity.call(this, tx, property, "big_bug_right");
  /** @type {number} */
  this.hitpoints = decorators;
  /** @type {boolean} */
  this.frozen = false;
  /** @type {string} */
  this.direction = "s";
  /** @type {number} */
  this.speed = 2;
  /** @type {number} */
  this.duration = 1;
};
/** @type {!Object} */
BigBug.prototype = Object.create(Entity.prototype);
/**
 * @return {undefined}
 */
BigBug.prototype.freeze = function() {
  /** @type {boolean} */
  this.frozen = true;
};
/**
 * @return {undefined}
 */
BigBug.prototype.unfreeze = function() {
  /** @type {boolean} */
  this.frozen = false;
};
/**
 * @return {?}
 */
BigBug.prototype.getData = function() {
  var object = Entity.prototype.getData.call(this);
  object.hitpoints = this.hitpoints;
  object.direction = this.direction;
  object.speed = this.speed;
  object.duration = this.duration;
  /** @type {string} */
  object.type = "big_bug";
  return object;
};
/**
 * @param {!Object} s
 * @return {?}
 */
BigBug.prototype.restore = function(s) {
  var res = new BigBug(s.x, s.y);
  Entity.prototype.restore.call(res, s);
  res.hitpoints = s.hitpoints;
  res.direction = s.direction || "s";
  res.speed = s.speed || 2;
  res.duration = s.duration || 1;
  return res;
};
/**
 * @param {number} target
 * @return {undefined}
 */
BigBug.prototype.collide = function(target) {
  var xhair = this.getSafePoint();
  if (target && vim.buffers.getCurrentBuffer().getName() !== target) {
    return;
  }
  if (!this.isCollidingWithCursor() || this.inCollision === true) {
    return;
  }
  if (Cursor.isWaitingForRestorePosition()) {
    return;
  }
  /** @type {boolean} */
  this.inCollision = true;
  /** @type {string} */
  this.direction = "s";
  /** @type {number} */
  this.duration = 80;
  this.incHitPoints();
  if (vim.input.isInInputMode()) {
    vim.input.returnToCommandMode(true);
    vim.view.notifyCommandMode();
    vim.screens["game-screen"].showGameMenu();
  }
  vim.input.disableKeys();
  Cursor.stopBlink();
  vim.view.notifyDisappearingCursorAnimation(xhair.x, xhair.y, xhair.bufferName, this, true);
  vim.audio.play("teleport");
  vim.stats.incDeaths(vim.model.getLevel());
};
/**
 * @return {?}
 */
BigBug.prototype.getSafePoint = function() {
  if (vim.model.getLevel() === 14) {
    return {
      x : 123,
      y : 119,
      bufferName : "lorem"
    };
  }
  return {
    x : Cursor.getX(),
    y : Cursor.getY(),
    bufferName : vim.buffers.getCurrentBuffer().getName()
  };
};
/**
 * @return {?}
 */
BigBug.prototype.isCollidingWithCursor = function() {
  return this.isCollidingWithPosition(Cursor.getX(), Cursor.getY());
};
/**
 * @param {number} a
 * @param {number} v
 * @return {?}
 */
BigBug.prototype.isCollidingWithPosition = function(a, v) {
  /** @type {boolean} */
  var d = false;
  /** @type {number} */
  var x = 37;
  /** @type {number} */
  var height = 30;
  d = boxCollision(this.x * x + this.xOffset + 10, this.y * height + this.yOffset, (this.x + 5) * x + this.xOffset - 10, (this.y + 4) * height + this.yOffset - 5, a * x, v * height + 37 / 10 * 5, (a + 1) * x, (v + 1) * height);
  return d;
};
/**
 * @param {number} s
 * @param {number} index
 * @param {number} __left
 * @return {?}
 */
BigBug.prototype.isBugRangeValid = function(s, index, __left) {
  var p = vim.model;
  /** @type {boolean} */
  var d = true;
  var extra;
  var end;
  /** @type {number} */
  extra = 0;
  for (; extra < 4; ++extra) {
    /** @type {number} */
    end = 0;
    for (; end < 5; ++end) {
      d = d && p.isValidBugPosition(s + end, index + extra, __left);
    }
  }
  return d;
};
/**
 * @param {number} __left
 * @return {?}
 */
BigBug.prototype.isCellUpValid = function(__left) {
  return this.isBugRangeValid(this.x, this.y - 1, __left);
};
/**
 * @param {number} __left
 * @return {?}
 */
BigBug.prototype.isCellDownValid = function(__left) {
  return this.isBugRangeValid(this.x, this.y + 1, __left) && (this.xOffset < 10 || this.isBugRangeValid(this.x, this.y + 1, __left));
};
/**
 * @param {number} __left
 * @return {?}
 */
BigBug.prototype.isCellLeftValid = function(__left) {
  return this.isBugRangeValid(this.x - 1, this.y, __left);
};
/**
 * @param {number} __left
 * @return {?}
 */
BigBug.prototype.isCellRightValid = function(__left) {
  return this.isBugRangeValid(this.x + 1, this.y, __left);
};
/**
 * @param {number} start
 * @return {undefined}
 */
BigBug.prototype.update = function(start) {
  var ctx = vim.model;
  var el = start ? vim.buffers.getBuffer(start) : vim.buffers.getCurrentBuffer();
  var context = el.getEntities();
  /** @type {boolean} */
  var changed = vim.buffers.getCurrentBuffer().getName() !== start;
  /** @type {number} */
  var minBuy = 37;
  /** @type {number} */
  var len = 30;
  var maxSell;
  var i;
  var x = Cursor.getX();
  var y = Cursor.getY();
  /** @type {boolean} */
  var l = true;
  /** @type {boolean} */
  var r = true;
  /** @type {string} */
  var s = "";
  /** @type {boolean} */
  var rowCondition = false;
  /** @type {boolean} */
  var columnCondition = false;
  /** @type {boolean} */
  var path = false;
  /** @type {boolean} */
  var p = false;
  /** @type {number} */
  this.speed = 10;
  if (changed) {
    s = this.lastMoveAwayDirection || "lrud".charAt(Math.random() * 4);
    this.lastMoveAwayDirection = s;
  } else {
    /** @type {string} */
    this.lastMoveAwayDirection = "";
    /** @type {string} */
    s = s + (x < this.x + 2 ? "l" : x > this.x + 2 ? "r" : "");
    /** @type {string} */
    s = s + (y < this.y + 1 ? "u" : y > this.y + 1 ? "d" : "");
  }
  /** @type {boolean} */
  rowCondition = s.indexOf("l") !== -1;
  /** @type {boolean} */
  columnCondition = s.indexOf("r") !== -1;
  /** @type {boolean} */
  path = s.indexOf("u") !== -1;
  /** @type {boolean} */
  p = s.indexOf("d") !== -1;
  maxSell = this.xOffset + this.speed * (columnCondition ? 1 : rowCondition ? -1 : 0);
  i = this.yOffset + this.speed * (p ? 1 : path ? -1 : 0);
  this.imageName = rowCondition ? "big_bug_left" : columnCondition ? "big_bug_right" : this.imageName;
  if (this.frozen) {
    return;
  }
  /** @type {boolean} */
  r = path && i < 0 && !this.isCellUpValid(start) || p && i > len - 22 && !this.isCellDownValid(start);
  /** @type {boolean} */
  l = rowCondition && maxSell < 0 && !this.isCellLeftValid(start) || columnCondition && maxSell > minBuy - 27 && !this.isCellRightValid(start);
  if (r) {
    /** @type {number} */
    this.yOffset = path ? 0 : Math.min(i, len - 5);
    /** @type {string} */
    this.lastMoveAwayDirection = "";
  } else {
    if (path && i < 0) {
      this.yOffset = len + i;
      /** @type {number} */
      this.y = this.y - 1;
      context.moveEntityFrom(this, this.x, this.y + 1);
      ctx.recacheCell(this.x, this.y);
      ctx.recacheCell(this.x, this.y + 1);
    } else {
      if (p && i > len - 22) {
        /** @type {number} */
        this.yOffset = i - len;
        this.y = this.y + 1;
        context.moveEntityFrom(this, this.x, this.y - 1);
        ctx.recacheCell(this.x, this.y);
        ctx.recacheCell(this.x, this.y - 1);
      } else {
        this.yOffset = i;
      }
    }
  }
  if (l) {
    /** @type {number} */
    this.xOffset = rowCondition ? 0 : minBuy - 27;
    /** @type {string} */
    this.lastMoveAwayDirection = "";
  } else {
    if (rowCondition && maxSell < 0) {
      this.xOffset = minBuy + maxSell;
      /** @type {number} */
      this.x = this.x - 1;
      context.moveEntityFrom(this, this.x + 1, this.y);
      ctx.recacheCell(this.x, this.y);
      ctx.recacheCell(this.x + 1, this.y);
    } else {
      if (columnCondition && maxSell > minBuy) {
        /** @type {number} */
        this.xOffset = maxSell - minBuy;
        this.x = this.x + 1;
        context.moveEntityFrom(this, this.x - 1, this.y);
        ctx.recacheCell(this.x, this.y);
        ctx.recacheCell(this.x - 1, this.y);
      } else {
        this.xOffset = maxSell;
      }
    }
  }
  this.collide(start);
};
/**
 * @return {?}
 */
BigBug.prototype.getHitPoints = function() {
  return this.hitpoints;
};
/**
 * @param {number} points
 * @return {undefined}
 */
BigBug.prototype.decHitPoints = function(points) {
  /** @type {number} */
  this.hitpoints = Math.max(0, this.hitpoints - (points || 1));
};
/**
 * @param {number} a
 * @return {undefined}
 */
BigBug.prototype.incHitPoints = function(a) {
  /** @type {number} */
  this.hitpoints = Math.min(5, this.hitpoints + (a || 1));
};
/**
 * @return {undefined}
 */
function Entities() {
  /** @type {!Array} */
  this.entities = [];
  /** @type {!Array} */
  this.visitedList = [];
  this.entity_mapping = {};
}
/**
 * @return {undefined}
 */
Entities.prototype.clear = function() {
  var i;
  /** @type {number} */
  i = 0;
  for (; i < this.entities.length; i = i + 1) {
    if (this.entities[i].isValid()) {
      this.entities[i].clear();
    }
  }
  /** @type {!Array} */
  this.entities = [];
  this.entity_mapping = {};
};
/**
 * @param {number} result
 * @param {number} prop
 * @return {?}
 */
Entities.prototype.mappingKey = function(result, prop) {
  return result + "," + prop;
};
/**
 * @param {!Object} item
 * @return {undefined}
 */
Entities.prototype.add = function(item) {
  if (item instanceof CollectableObject && item.collected === true) {
    return;
  }
  var similarTiles = this.mappingKey(item.getX(), item.getY());
  this.entities.push(item);
  this.entity_mapping[similarTiles] = this.entity_mapping[similarTiles] || [];
  this.entity_mapping[similarTiles].push(item);
};
/**
 * @param {number} x
 * @param {number} val
 * @return {?}
 */
Entities.prototype.exist = function(x, val) {
  return !!this.entity_mapping[this.mappingKey(x, val)];
};
/**
 * @param {number} obj
 * @param {number} x
 * @return {?}
 */
Entities.prototype.list = function(obj, x) {
  var i;
  var args = this.entity_mapping[this.mappingKey(obj, x)];
  /** @type {!Array} */
  var results = [];
  /** @type {number} */
  i = 0;
  for (; args && i < args.length; i = i + 1) {
    if (args[i].isValid()) {
      results.push(args[i]);
    }
  }
  return results;
};
/**
 * @param {number} a
 * @param {number} f
 * @param {number} j
 * @param {number} index
 * @return {?}
 */
Entities.prototype.getDataInRange = function(a, f, j, index) {
  var n;
  var id;
  var i;
  /** @type {!Array} */
  var newNodeLists = [];
  var plugins;
  /** @type {number} */
  n = f;
  for (; n < index + 1; n = n + 1) {
    /** @type {number} */
    id = a;
    for (; id < j + 1; id = id + 1) {
      if (this.exist(id, n)) {
        plugins = this.list(id, n) || [];
        for (i in plugins) {
          newNodeLists.push(plugins[i].getData());
        }
      }
    }
  }
  return newNodeLists;
};
/**
 * @param {number} op
 * @param {number} b
 * @param {number} a
 * @param {number} v
 * @return {undefined}
 */
Entities.prototype.exterminateInRange = function(op, b, a, v) {
  var i;
  var t;
  /** @type {!Array} */
  var entities = [];
  var e;
  /** @type {number} */
  i = 0;
  for (; i < this.entities.length; i = i + 1) {
    e = this.entities[i];
    if (e.getX() >= op && e.getX() <= a && e.getY() >= b && e.getY() <= v && e.isValid()) {
      this.entities[i].clear();
    } else {
      entities.push(e);
    }
  }
  /** @type {number} */
  i = b;
  for (; i < v + 1; i = i + 1) {
    /** @type {number} */
    t = op;
    for (; t < a + 1; t = t + 1) {
      this.entity_mapping[this.mappingKey(t, i)] = undefined;
    }
  }
  /** @type {!Array} */
  this.entities = entities;
};
/**
 * @param {number} tx
 * @param {number} n
 * @param {boolean} atomic
 * @return {undefined}
 */
Entities.prototype.deleteAtPosition = function(tx, n, atomic) {
  var result = this.list(tx, n);
  var i;
  /** @type {number} */
  i = 0;
  for (; i < result.length; i = i + 1) {
    if (atomic === true && (result[i] instanceof RedBug || result[i] instanceof BigBug)) {
      continue;
    }
    result[i].invalidate();
  }
};
/**
 * @param {!Object} item
 * @param {number} list
 * @param {number} n
 * @return {undefined}
 */
Entities.prototype.moveEntityFrom = function(item, list, n) {
  var result = this.list(list, n);
  var i;
  /** @type {!Array} */
  var resultListArray = [];
  /** @type {number} */
  i = 0;
  for (; i < result.length; i = i + 1) {
    if (result[i] !== item) {
      resultListArray.push(result[i]);
    }
  }
  /** @type {!Array} */
  this.entity_mapping[this.mappingKey(list, n)] = resultListArray;
  var similarTiles = this.mappingKey(item.getX(), item.getY());
  this.entity_mapping[similarTiles] = this.entity_mapping[similarTiles] || [];
  this.entity_mapping[similarTiles].push(item);
};
/**
 * @param {number} list
 * @param {number} n
 * @return {?}
 */
Entities.prototype.noBlockingEntity = function(list, n) {
  var i;
  var result = this.list(list, n);
  /** @type {number} */
  i = 0;
  for (; i < result.length; i = i + 1) {
    if (result[i].isBlocking()) {
      return false;
    }
  }
  return true;
};
/**
 * @param {number} type
 * @param {number} node
 * @param {boolean} callback
 * @return {undefined}
 */
Entities.prototype.collide = function(type, node, callback) {
  var i;
  var expr = this.list(type, node);
  /** @type {number} */
  i = 0;
  for (; i < expr.length; i = i + 1) {
    if (!expr[i].isInvisible() || expr[i].collideEvenIfInvisible) {
      if (callback === true && (expr[i] instanceof RedBug || expr[i] instanceof BigBug)) {
        continue;
      }
      expr[i].collide();
    }
  }
};
/**
 * @return {?}
 */
Entities.prototype.getData = function() {
  var i;
  /** @type {!Array} */
  var loadData = [];
  /** @type {number} */
  i = 0;
  for (; i < this.entities.length; i = i + 1) {
    loadData.push(this.entities[i].getData());
  }
  return loadData;
};
/**
 * @param {!Array} meta
 * @return {undefined}
 */
Entities.prototype.restore = function(meta) {
  this.clear();
  this.doRestore(meta);
};
/**
 * @param {number} q
 * @param {number} a
 * @param {number} fn
 * @param {number} seed
 * @param {!Array} results
 * @return {undefined}
 */
Entities.prototype.restoreInRange = function(q, a, fn, seed, results) {
  this.exterminateInRange(q, a, fn, seed);
  this.doRestore(results);
};
/**
 * @param {!Array} results
 * @return {undefined}
 */
Entities.prototype.doRestore = function(results) {
  var i;
  var atomIndex;
  var atomColixes;
  /** @type {number} */
  var b = 2000;
  /** @type {number} */
  var d = 800;
  var bar;
  /** @type {number} */
  i = 0;
  for (; i < results.length; i = i + 1) {
    if (!results[i].valid) {
      continue;
    }
    switch(results[i].type) {
      case "small_brown_key":
      case "yellow_key":
      case "blue_key":
      case "red_key":
      case "star_key":
        this.add(Key.prototype.restore(results[i]));
        break;
      case "keyboard_key":
        this.add(KeyboardKey.prototype.restore(results[i]));
        break;
      case "chest":
        this.add(ClosedChest.prototype.restore(results[i]));
        break;
      case "chest_open":
        bar = ClosedChest.prototype.restore(results[i]);
        if (bar.isClosed) {
          bar.setOpened();
        }
        this.add(bar);
        break;
      case "selector":
        this.add(Selector.prototype.restore(results[i]));
        break;
      case "door":
      case "blue_door":
      case "red_door":
        this.add(Door.prototype.restore(results[i]));
        break;
      case "candle":
        this.add(Candle.prototype.restore(results[i]));
        break;
      case "rock":
        this.add(Rock.prototype.restore(results[i]));
        break;
      case "tall_tree":
        this.add(TallTree.prototype.restore(results[i]));
        break;
      case "short_tree":
        this.add(ShortTree.prototype.restore(results[i]));
        break;
      case "person":
        this.add(Person.prototype.restore(results[i]));
        break;
      case "cursor_npc":
        this.add(CursorNPC.prototype.restore(results[i]));
        break;
      case "princess":
        this.add(Princess.prototype.restore(results[i]));
        break;
      case "timer_girl":
        this.add(TimerGirl.prototype.restore(results[i]));
        break;
      case "stop_timer_girl":
        this.add(StopTimerGirl.prototype.restore(results[i]));
        break;
      case "plus_minus":
        this.add(PlusMinus.prototype.restore(results[i]));
        break;
      case "lights_on":
        this.add(LightsOn.prototype.restore(results[i]));
        break;
      case "north_west_roof":
      case "north_east_roof":
      case "north_roof":
      case "south_west_roof":
      case "south_east_roof":
      case "south_roof":
      case "east_roof":
      case "west_roof":
        this.add(Roof.prototype.restore(results[i]));
        break;
      case "red_bug":
        this.add(RedBug.prototype.restore(results[i]));
        break;
      case "big_bug":
        this.add(BigBug.prototype.restore(results[i]));
        break;
      default:
        console.log("Couldn't match '" + results[i].type + "' entity while restoring!");
    }
  }
  if (vim.buffers.getCurrentBuffer().getEntities() === this) {
    /** @type {number} */
    i = 0;
    for (; i < results.length; i = i + 1) {
      if (results[i].valid && results[i].type === "chest" && !results[i].closed) {
        atomColixes = this.list(results[i].x, results[i].y);
        /** @type {number} */
        atomIndex = 0;
        for (; atomIndex < atomColixes.length; atomIndex = atomIndex + 1) {
          if (atomColixes[atomIndex].isInvisible() && atomColixes[atomIndex].getImageName().indexOf("roof") === -1) {
            /** @type {number} */
            b = b + d;
            window.setTimeout(ClosedChest.prototype.removeFromChestCallback(atomColixes[atomIndex]), b);
          }
        }
      }
    }
  }
  if (vim.buffers.getCurrentBuffer().getEntities() === this) {
    /** @type {number} */
    b = 400;
    /** @type {number} */
    d = 400;
    /** @type {number} */
    i = 0;
    for (; i < results.length; i = i + 1) {
      if (results[i].valid && results[i].type === "short_tree" && results[i].isUgly) {
        atomColixes = this.list(results[i].x, results[i].y);
        /** @type {number} */
        atomIndex = 0;
        for (; atomIndex < atomColixes.length; atomIndex = atomIndex + 1) {
          if (atomColixes[atomIndex].isInvisible()) {
            /** @type {number} */
            b = b + d;
            window.setTimeout(ShortTree.prototype.revealTreeHidingCallback(atomColixes[atomIndex]), b);
          }
        }
      }
    }
  }
};
/**
 * @param {?} strId
 * @return {?}
 */
Entities.prototype.getByName = function(strId) {
  var i;
  /** @type {number} */
  i = 0;
  for (; i < this.entities.length; i = i + 1) {
    if (this.entities[i].getName() === strId) {
      return this.entities[i];
    }
  }
};
/**
 * @param {number} a
 * @param {number} b
 * @return {?}
 */
Entities.prototype.doListConnectedRoofs = function(a, b) {
  var i;
  /** @type {!Array} */
  var test = [];
  var results;
  /** @type {number} */
  i = 0;
  for (; i < this.visitedList.length; i = i + 1) {
    if (this.visitedList[i].x === a && this.visitedList[i].y === b) {
      return test;
    }
  }
  this.visitedList.push({
    x : a,
    y : b
  });
  results = this.list(a, b);
  /** @type {number} */
  i = 0;
  for (; i < results.length; i = i + 1) {
    if (results[i].getImageName().indexOf("roof") !== -1) {
      test.push(results[i]);
    }
  }
  if (test.length !== 0) {
    /** @type {!Array<?>} */
    test = test.concat(this.doListConnectedRoofs(a - 1, b));
    /** @type {!Array<?>} */
    test = test.concat(this.doListConnectedRoofs(a, b - 1));
    /** @type {!Array<?>} */
    test = test.concat(this.doListConnectedRoofs(a + 1, b));
    /** @type {!Array<?>} */
    test = test.concat(this.doListConnectedRoofs(a, b + 1));
  }
  return test;
};
/**
 * @param {undefined} a
 * @param {undefined} b
 * @return {?}
 */
Entities.prototype.listConnectedRoofs = function(a, b) {
  var sortReturnNumber;
  /** @type {!Array} */
  this.visitedList = [];
  sortReturnNumber = this.doListConnectedRoofs(a, b);
  /** @type {!Array} */
  this.visitedList = [];
  return sortReturnNumber;
};
/**
 * @param {number} item
 * @param {?} value
 * @param {number} bits
 * @param {boolean} num
 * @return {?}
 */
Entities.prototype.shiftLeft = function(item, value, bits, num) {
  return this.shift(item, value, -bits, 0, num);
};
/**
 * @param {number} y
 * @param {number} value
 * @param {number} delta
 * @param {boolean} element
 * @return {?}
 */
Entities.prototype.shiftUp = function(y, value, delta, element) {
  return this.shift(y, value, 0, -delta, element);
};
/**
 * @param {number} x
 * @param {?} y
 * @param {number} deltaX
 * @param {?} deltaY
 * @param {boolean} p
 * @return {undefined}
 */
Entities.prototype.shift = function(x, y, deltaX, deltaY, p) {
  var i;
  var index = this.mappingKey(x, y);
  var id = this.mappingKey(x + deltaX, y + deltaY);
  var items = this.entity_mapping[index] || [];
  var ret = this.entity_mapping[id] || [];
  /** @type {!Array} */
  var results = [];
  for (i in items) {
    if (p === true && (items[i] instanceof RedBug || items[i] instanceof BigBug)) {
      results.push(items[i]);
    } else {
      items[i].setX(x + deltaX);
      items[i].setY(y + deltaY);
      ret.push(items[i]);
    }
  }
  /** @type {(Array|undefined)} */
  this.entity_mapping[index] = p === true && results.length > 0 ? results : undefined;
  this.entity_mapping[id] = ret.length === 0 ? undefined : ret;
};
/**
 * @return {undefined}
 */
Entities.prototype.update = function() {
  var n;
  var layer_i;
  var imports;
  var i;
  var manager2;
  var crossfilterable_layers = vim.buffers.collection();
  var f;
  /** @type {number} */
  layer_i = 0;
  for (; layer_i < crossfilterable_layers.length; ++layer_i) {
    manager2 = crossfilterable_layers[layer_i];
    f = manager2.getName();
    imports = manager2.getEntities().entities;
    /** @type {number} */
    n = 0;
    for (; n < imports.length; n = n + 1) {
      i = imports[n];
      if (typeof i.update !== "undefined" && !i.isInvisible() && i.isValid()) {
        i.update(f);
      }
    }
  }
};
/**
 * @param {string} name
 * @param {string} id
 * @param {!Object} data
 * @param {number} x
 * @param {number} context
 * @return {?}
 */
Entities.prototype.createEntity = function(name, id, data, x, context) {
  var instance;
  x = x || 0;
  context = context || 0;
  name = name || data.x;
  id = id || data.y;
  switch(data.type) {
    case "rock":
      instance = new Rock(name, id);
      break;
    case "chest":
    case "chest_open":
      instance = new ClosedChest(name, id);
      if (data.type === "chest_open" && instance.isClosed) {
        instance.setOpened();
      }
      break;
    case "selector":
      instance = new Selector(name, id);
      break;
    case "short_tree":
      instance = new ShortTree(name, id);
      break;
    case "tall_tree":
      instance = new TallTree(name, id);
      break;
    case "north_west_roof":
    case "north_east_roof":
    case "north_roof":
    case "south_west_roof":
    case "south_east_roof":
    case "south_roof":
    case "east_roof":
    case "west_roof":
      instance = new Roof(name, id, data.type);
      break;
    case "boy":
      instance = new Person(name, id, "kid", data.message.split("\n"));
      instance.setName(data.name);
      break;
    case "green_boy":
      instance = new Person(name, id, "green_kid", data.message.split("\n"));
      instance.setName(data.name);
      break;
    case "blond_boy":
      instance = new Person(name, id, "blond_kid", data.message.split("\n"));
      instance.setName(data.name);
      break;
    case "pink_girl":
      instance = new Person(name, id, "pink_girl", data.message.split("\n"));
      instance.setName(data.name);
      break;
    case "brown_girl":
      instance = new Person(name, id, "brown_girl", data.message.split("\n"));
      instance.setName(data.name);
      break;
    case "cat_girl":
      instance = new Person(name, id, "cat_girl", data.message.split("\n"));
      instance.setName(data.name);
      break;
    case "cursor_npc":
      instance = new CursorNPC(name, id, data);
      instance.setName(data.name);
      break;
    case "candle":
      instance = new Candle(name, id);
      break;
    case "small_brown_key":
      instance = new Key(name, id, "small_brown");
      break;
    case "yellow_key":
      instance = new Key(name, id, "yellow");
      break;
    case "blue_key":
      instance = new Key(name, id, "blue");
      break;
    case "red_key":
      instance = new Key(name, id, "red");
      break;
    case "star_key":
      instance = new Key(name, id, "star");
      break;
    case "door":
      instance = new Door(name, id, "");
      break;
    case "blue_door":
      instance = new Door(name, id, "blue");
      break;
    case "red_door":
      instance = new Door(name, id, "red");
      break;
    case "keyboard_key":
      instance = new KeyboardKey(name, id, data.character);
      break;
    case "princess":
      instance = new Princess(name, id, data.message.split("\n"), data.levelToLoad);
      instance.setName(data.name);
      break;
    case "timer_start":
      instance = new TimerGirl(name, id, data.intervalInSec, data.startMessage.split("\n"), data.stillMessage.split("\n"), data.targetX + x, data.targetY + context, data.name);
      instance.setName(data.name);
      break;
    case "timer_stop":
      instance = new StopTimerGirl(name, id, data.timerName, data.stopMessage.split("\n"), data.moreMessage.split("\n"));
      instance.setName(data.name);
      break;
    case "plus_minus":
      instance = new PlusMinus(name, id, data.changes);
      instance.setName(data.name);
      break;
    case "lights_on":
      instance = new LightsOn(name, id);
      break;
    case "red_bug":
      instance = new RedBug(name, id, data.vol, data.volHidden);
      break;
    case "big_bug":
      instance = new BigBug(name, id, data.hitpoints);
      break;
    default:
      console.log("Couldn't match '" + data.type + "' entity!");
      instance = undefined;
  }
  if (instance && data.invisible === true) {
    instance.setInvisible(true);
  }
  return instance;
};
/**
 * @param {number} val
 * @return {?}
 */
Entities.prototype.listOnText = function(val) {
  var min;
  var value;
  var i;
  var len = val ? val.getTopX() : 0;
  var res = val ? val.getTopY() : 0;
  /** @type {!Array} */
  var curFullCombination = [];
  var keys;
  if (!val) {
    return curFullCombination;
  }
  /** @type {number} */
  min = 0;
  for (; min < val.getNumberOfLines(); ++min) {
    /** @type {number} */
    value = 0;
    for (; value < val.getLineLength(min); ++value) {
      keys = this.list(len + value, res + min);
      /** @type {number} */
      i = 0;
      for (; i < keys.length; ++i) {
        curFullCombination.push(keys[i]);
      }
    }
  }
  return curFullCombination;
};
/**
 * @return {undefined}
 */
Entities.prototype.invalidateCursorNPCs = function() {
  var i;
  var b;
  /** @type {!Array} */
  var entities = [];
  var e;
  /** @type {number} */
  i = 0;
  for (; i < this.entities.length; i = i + 1) {
    e = this.entities[i];
    if (e instanceof CursorNPC) {
      e.invalidate();
      this.entity_mapping[this.mappingKey(e.getX(), e.getY())] = undefined;
      vim.model.clearCellCache(e.getX(), e.getY());
    } else {
      entities.push(e);
    }
  }
  /** @type {!Array} */
  this.entities = entities;
};
/**
 * @return {undefined}
 */
function TextAreas() {
  /** @type {!Array} */
  this.texts = [];
  this.text_mapping = {};
}
/**
 * @param {number} a
 * @param {number} b
 * @return {?}
 */
TextAreas.prototype.textMappingKey = function(a, b) {
  return a + "," + b;
};
/**
 * @return {?}
 */
TextAreas.prototype.getData = function() {
  var i;
  /** @type {!Array} */
  var loadData = [];
  /** @type {number} */
  i = 0;
  for (; i < this.texts.length; i = i + 1) {
    loadData.push(this.texts[i].getData());
  }
  return loadData;
};
/**
 * @return {undefined}
 */
TextAreas.prototype.clear = function() {
  /** @type {!Array} */
  this.texts = [];
  this.text_mapping = {};
};
/**
 * @param {!Object} lines
 * @param {!Object} number
 * @return {undefined}
 */
TextAreas.prototype.setCacheValue = function(lines, number) {
  var valueProgess;
  var i;
  i = lines.getTopY();
  for (; i < lines.getTopY() + lines.getNumberOfLines(); ++i) {
    valueProgess = lines.getTopX();
    for (; valueProgess < lines.getTopX() + lines.getLineLength(i - lines.getTopY()); ++valueProgess) {
      /** @type {!Object} */
      this.text_mapping[this.textMappingKey(valueProgess, i)] = number;
    }
  }
};
/**
 * @param {!Object} item
 * @return {undefined}
 */
TextAreas.prototype.refreshCache = function(item) {
  var poly;
  var period;
  var i;
  period = item.getTopY();
  for (; period < item.getTopY() + item.getNumberOfLines() + 30; ++period) {
    poly = item.getTopX();
    for (; poly < item.getTopX() + item.getMaxLength() + 30; ++poly) {
      i = this.textMappingKey(poly, period);
      if (this.text_mapping[i] === item) {
        this.text_mapping[i] = undefined;
      }
    }
  }
  this.setCacheValue(item, item);
};
/**
 * @param {!Object} text
 * @return {undefined}
 */
TextAreas.prototype.add = function(text) {
  this.texts.push(text);
  this.setCacheValue(text, text);
};
/**
 * @param {!Array} json
 * @param {string} source
 * @return {undefined}
 */
TextAreas.prototype.restore = function(json, source) {
  var i;
  this.clear();
  /** @type {number} */
  i = 0;
  for (; i < json.length; i = i + 1) {
    this.add(TextArea.prototype.restore(json[i], source));
  }
};
/**
 * @param {number} type
 * @param {number} value
 * @return {?}
 */
TextAreas.prototype.get = function(type, value) {
  return this.text_mapping[this.textMappingKey(type, value)];
};
/**
 * @param {number} val
 * @param {number} user
 * @return {?}
 */
TextAreas.prototype.exist = function(val, user) {
  return !!this.get(val, user);
};
/**
 * @param {?} a
 * @param {?} b
 * @return {undefined}
 */
TextAreas.prototype.exterminate = function(a, b) {
  var i;
  /** @type {number} */
  i = 0;
  for (; i < this.texts.length; i = i + 1) {
    if (this.texts[i].getTopX() === a && this.texts[i].getTopY() === b) {
      this.setCacheValue(this.texts[i], undefined);
      this.texts.splice(i, 1);
      break;
    }
  }
};
/**
 * @param {string} sections
 * @return {undefined}
 */
TextAreas.prototype.highlight = function(sections) {
  var i;
  /** @type {number} */
  i = 0;
  for (; i < this.texts.length; i = i + 1) {
    this.texts[i].highlight(sections);
  }
};
(function() {
  /** @type {number} */
  var c = 0;
  /** @type {!Array} */
  var vendors = ["ms", "moz", "webkit", "o"];
  /** @type {number} */
  var i = 0;
  for (; i < vendors.length && !window.requestAnimationFrame; ++i) {
    window.requestAnimationFrame = window[vendors[i] + "RequestAnimationFrame"];
    window.cancelAnimationFrame = window[vendors[i] + "CancelAnimationFrame"] || window[vendors[i] + "CancelRequestAnimationFrame"];
  }
  if (!window.requestAnimationFrame) {
    /**
     * @param {?} callback
     * @param {?} scope
     * @return {?}
     */
    window.requestAnimationFrame = function(callback, scope) {
      /** @type {number} */
      var d = (new Date).getTime();
      /** @type {number} */
      var b = Math.max(0, 16 - (d - c));
      var val = window.setTimeout(function() {
        callback(d + b);
      }, b);
      /** @type {number} */
      c = d + b;
      return val;
    };
  }
  if (!window.cancelAnimationFrame) {
    /**
     * @param {?} id
     * @return {undefined}
     */
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
})();
(function() {
  if (typeof window.performance === "undefined") {
    window.performance = {};
  }
  if (!window.performance.now) {
    /** @type {number} */
    var t_start = Date.now();
    if (performance.timing && performance.timing.navigationStart) {
      /** @type {number} */
      t_start = performance.timing.navigationStart;
    }
    /**
     * @return {?}
     */
    window.performance.now = function delayStateChange() {
      return Date.now() - t_start;
    };
  }
})();
var GameColors = function() {
  /**
   * @param {string} value
   * @param {number} key
   * @return {?}
   */
  function callback(value, key) {
    var name = key ? "i" + value : value;
    if (!o[name]) {
      /** @type {string} */
      name = key ? "iregular" : "regular";
    }
    return o[name];
  }
  var o = {
    regular : ["#000", "#555"],
    iregular : ["#000", "#fff"],
    d : ["#a00", "#a00"],
    id : ["#000", "#f00"],
    x : ["#a00", "#a00"],
    ix : ["#000", "#f00"],
    replaceOriginal : ["rgba(85,85,85,1.0)", "rgba(0,0,0,1.0)"],
    ireplaceOriginal : ["rgba(0,0,0,1.0)", "rgba(255,255,255,1.0)"],
    r : ["rgba(170,0,0,1.0)", "rgba(170,0,0,1.0)"],
    ir : ["rgba(0,0,0,1.0)", "rgba(255,0,0,1.0)"],
    "+" : ["#060", "#090"],
    "i+" : ["#090", "#fff"],
    watered : ["#000", "#008"],
    on_lava : ["#fc0", "#000"],
    d_on_lava : ["#000", "#500"],
    missing : ["#fff", "#f60"],
    imissing : ["#fff", "#f60"]
  };
  return {
    get : callback
  };
}();
vim.view = function() {
  /**
   * @param {!Function} id
   * @param {!Function} contentType
   * @return {undefined}
   */
  function onFirstChunkReceived(id, contentType) {
    /** @type {!Function} */
    time = id;
    /** @type {number} */
    seconds = 10;
    /** @type {!Function} */
    isValid = contentType;
  }
  /**
   * @param {(boolean|number|string)} index
   * @param {(boolean|number|string)} value
   * @param {(boolean|number|string)} e
   * @param {(boolean|number|string)} v
   * @param {number} lifespan
   * @return {undefined}
   */
  function start(index, value, e, v, lifespan) {
    var j;
    var options;
    var path;
    var s;
    /** @type {boolean} */
    isEditModeEnabled = true;
    /** @type {number} */
    Submit = 0;
    minPxPerValUnit = lifespan || 4;
    /** @type {number} */
    x = (index - e) * width;
    /** @type {number} */
    y = (value - v) * height;
    /** @type {(boolean|number|string)} */
    pos = index;
    /** @type {(boolean|number|string)} */
    min = value;
    /** @type {(boolean|number|string)} */
    last = e;
    /** @type {(boolean|number|string)} */
    val = v;
    /** @type {number} */
    target.width = Math.abs(x) + width * (k + 4);
    /** @type {number} */
    target.height = Math.abs(y) + height * (delta + 4);
    /** @type {number} */
    j = Math.min(index, e);
    /** @type {number} */
    path = Math.max(index, e);
    /** @type {number} */
    options = Math.min(value, v);
    /** @type {number} */
    s = Math.max(value, v);
    if (Cursor.getX() !== u || Cursor.getY() !== f) {
      timestamp();
    }
    render(elem, j, options, path + k, s + delta);
    vim.input.switchToScrollMode();
    create();
  }
  /**
   * @return {undefined}
   */
  function call() {
    /** @type {boolean} */
    isEditModeEnabled = false;
    /** @type {number} */
    x = 0;
    /** @type {number} */
    y = 0;
    vim.input.leaveScrollMode();
    done();
  }
  /**
   * @param {?} name
   * @param {string} color
   * @return {undefined}
   */
  function createTh(name, color) {
    backColor = color || "#fff";
    /** @type {number} */
    segmentMarker = 0;
    /** @type {number} */
    segmentType = 10;
    item = name;
  }
  /**
   * @return {undefined}
   */
  function v() {
    item = undefined;
    /** @type {number} */
    segmentMarker = 2;
    /** @type {number} */
    segmentType = 4;
  }
  /**
   * @param {?} callback
   * @return {undefined}
   */
  function extractPresetLocal(callback) {
    PL$4 = callback;
    /** @type {number} */
    b1 = 24;
  }
  /**
   * @return {undefined}
   */
  function getBoundingClientRect() {
    w = bounds.width;
    h = bounds.height;
    /** @type {number} */
    width = 37;
    /** @type {number} */
    height = 30;
    /** @type {number} */
    k = Math.floor(w / width);
    /** @type {number} */
    delta = Math.floor(h / height);
    /** @type {number} */
    length = 8;
    /** @type {number} */
    i = 6;
  }
  /**
   * @return {?}
   */
  function parseFloat() {
    return 7;
  }
  /**
   * @param {?} callback
   * @return {undefined}
   */
  function fsFileAttachData(callback) {
    var ce;
    var ci;
    var cg;
    var cf;
    var cd;
    extend();
  }
  /**
   * @return {undefined}
   */
  function extend() {
    var offset = output.getCursorX();
    var j = output.getCursorY();
    var index = output.getTopX();
    var x = output.getTopY();
    var blockView = vim.buffers.getCurrentBuffer();
    var element = blockView.getBoard();
    var item = blockView.getTextAreas().get(offset, j);
    var numLon;
    var cg;
    if (item && item.isBossMode()) {
      numLon = item.getTopX() + Math.round(item.getMaxLength() / 2);
      cg = item.getTopY() + Math.round(item.getNumberOfLines() / 2);
      /** @type {number} */
      index = numLon - Math.round(k / 2);
      /** @type {number} */
      x = cg - Math.round(delta / 2) + 1;
    } else {
      if (offset < index + length - 1) {
        /** @type {number} */
        index = Math.max(offset - length + 1, 0);
      }
      if (j < x + i) {
        /** @type {number} */
        x = Math.max(j - i, 0);
      }
      if (offset > index + k - length) {
        /** @type {number} */
        index = Math.min(element.getMaxX() - k + length, offset - k + length);
      }
      if (j > x + delta - i - 2) {
        /** @type {number} */
        x = Math.min(element.getMaxY() - delta + i, j - delta + i + 2);
      }
    }
    output.setTopX(index);
    output.setTopY(x);
  }
  /**
   * @return {undefined}
   */
  function clear() {
    var countRec = output.getCursorX();
    var firstPTS = output.getCursorY();
    var mod_port = output.getTopX();
    var valueProgess = output.getTopY();
    var cg = vim.buffers.getCurrentBuffer().getBoard();
    /** @type {number} */
    mod_port = Math.max(countRec - Math.floor(k / 2), 0);
    /** @type {number} */
    valueProgess = Math.max(firstPTS - Math.floor(delta / 2), 0);
    output.setTopX(mod_port);
    output.setTopY(valueProgess);
  }
  /**
   * @return {undefined}
   */
  function init() {
    /** @type {(Element|null)} */
    bounds = document.getElementById("screen");
    if (!bounds.getContext) {
      vim.game.showScreen("no-canvas");
      return;
    }
    /** @type {number} */
    gy = 0;
    /** @type {number} */
    Submit = 0;
    ctx = bounds.getContext("2d");
    testMeet();
    getBoundingClientRect();
    /** @type {number} */
    u = -1;
    /** @type {number} */
    f = -1;
    /** @type {boolean} */
    template = false;
    /** @type {boolean} */
    oldIsFixed = false;
    /** @type {number} */
    olen = 1;
    /** @type {number} */
    G__20648 = -1;
    /** @type {number} */
    aF = (new Date).getTime();
    /** @type {boolean} */
    bJ = false;
    /** @type {boolean} */
    after_is_punctuation = false;
    /** @type {boolean} */
    firstRequiredField = false;
    instance = undefined;
    /** @type {boolean} */
    bG = false;
    /** @type {boolean} */
    itemrequired = false;
    /** @type {boolean} */
    calc_width = false;
    /** @type {number} */
    fill = 0;
    /** @type {number} */
    a7 = 0;
    /** @type {number} */
    sideSize = 37;
    /** @type {number} */
    seconds = 0;
    /** @type {string} */
    key = "";
    /** @type {number} */
    value = 1;
    /** @type {!Array} */
    lines = [];
    /** @type {!Array} */
    nodes = [];
    /** @type {!Array} */
    children = [];
    /** @type {!Array} */
    requires = [];
    /** @type {!Array} */
    array = [];
    /** @type {!Array} */
    tmp = [];
    /** @type {boolean} */
    article = false;
    /** @type {boolean} */
    isEditModeEnabled = false;
    /** @type {!Element} */
    target = document.createElement("canvas");
    elem = target.getContext("2d");
    /** @type {number} */
    x = 0;
    /** @type {number} */
    y = 0;
    PL$4 = undefined;
    /** @type {number} */
    b1 = 0;
    isValid = undefined;
    $.initialize();
    /** @type {number} */
    bf = 30;
    /** @type {number} */
    globalPiecesCount = 30;
    /** @type {number} */
    amount = 9;
    /** @type {number} */
    num_of_files = 20;
    /** @type {number} */
    DEFAULT_QUERY_COUNT = 5;
    /** @type {number} */
    textsize = 14;
    /** @type {number} */
    STRAIGHT_RISK = 20;
    requestAnimationFrame(frame);
  }
  /**
   * @param {!CanvasRenderingContext2D} ctx
   * @param {number} s
   * @param {?} url
   * @param {string} id
   * @param {number} line
   * @return {undefined}
   */
  function addText(ctx, s, url, id, line) {
    var maxWidth;
    var h;
    var xi;
    var r;
    var hAxis;
    var sideSize;
    var i;
    var size;
    var THREAD_STARTED;
    var lines;
    var THREAD_STOPPED_AT;
    if (!addText.msgArray) {
      /** @type {!Array} */
      addText.msgArray = [];
    }
    if (id.indexOf("\n") === -1) {
      /** @type {string} */
      addText.msgArray[0] = id;
      lines = addText.msgArray;
    } else {
      lines = id.split("\n");
    }
    /** @type {string} */
    THREAD_STARTED = "text_speech";
    /** @type {string} */
    THREAD_STOPPED_AT = "text_speech_line";
    if (lines.length === 1 && lines[0].length === 0) {
      return;
    }
    /** @type {number} */
    maxWidth = 0;
    /** @type {number} */
    h = 16 * (lines.length - 1);
    /** @type {string} */
    ctx.font = '12px "Courier 10 Pitch", "Courier New", Courier, monospace';
    /** @type {number} */
    i = 0;
    for (; i < lines.length; i = i + 1) {
      size = ctx.measureText(lines[i]);
      maxWidth = size.width > maxWidth ? size.width : maxWidth;
    }
    /** @type {number} */
    r = s;
    sideSize = url + height + Math.floor(h / 2) + 2;
    /** @type {number} */
    xi = r - maxWidth - 13;
    /** @type {number} */
    hAxis = sideSize - h - 20;
    vim.images.drawPartScale(ctx, THREAD_STARTED, 5, 65, 13, 13, xi, hAxis, 13, 13);
    vim.images.drawPartScale(ctx, THREAD_STARTED, 87, 65, 13, 13, r, hAxis, 13, 13);
    vim.images.drawPartScale(ctx, THREAD_STOPPED_AT, 5, 150, 23, 20, xi, sideSize, 23, 20);
    vim.images.drawPartScale(ctx, THREAD_STARTED, 87, 150, 13, 20, r, sideSize, 13, 20);
    vim.images.drawPartScale(ctx, THREAD_STARTED, 20, 65, 1, 13, xi + 13, hAxis, maxWidth, 13);
    vim.images.drawPartScale(ctx, THREAD_STARTED, 30, 150, 1, 13, xi + 23, sideSize, maxWidth - 10, 13);
    vim.images.drawPartScale(ctx, THREAD_STARTED, 5, 79, 13, 71, xi, hAxis + 13, 13, h + 7);
    vim.images.drawPartScale(ctx, THREAD_STARTED, 87, 79, 13, 71, r, hAxis + 13, 13, h + 7);
    vim.images.drawPartScale(ctx, THREAD_STARTED, 29, 79, 1, 71, xi + 13, hAxis + 13, maxWidth, h + 7);
    vim.images.drawPartScale(ctx, THREAD_STOPPED_AT, 84, 109, 13, 12, r + 11, hAxis + 13 - 1 + Math.round(h / 2) + 4 - 5, 13, 12);
    ctx.fillStyle = GameColors.get(undefined, line)[1];
    /** @type {number} */
    i = 0;
    for (; i < lines.length; i = i + 1) {
      ctx.fillText(lines[i], xi + 13, hAxis + 20 + i * 16);
    }
  }
  /**
   * @param {!CanvasRenderingContext2D} ctx
   * @param {number} t
   * @param {number} err
   * @param {string} entries
   * @param {boolean} options
   * @return {undefined}
   */
  function loop(ctx, t, err, entries, options) {
    var maxWidth;
    var column;
    var title;
    var mainCanvas;
    var language;
    var newColumn;
    var i;
    var size;
    var THREAD_STARTED;
    var lines;
    var graphW;
    if (!loop.msgArray) {
      /** @type {!Array} */
      loop.msgArray = [];
    }
    if (entries.indexOf("\n") === -1) {
      /** @type {string} */
      loop.msgArray[0] = entries;
      lines = loop.msgArray;
    } else {
      lines = entries.split("\n");
    }
    /** @type {string} */
    THREAD_STARTED = "text_speech";
    if (lines.length === 1 && lines[0].length === 0) {
      return;
    }
    /** @type {number} */
    maxWidth = 0;
    /** @type {number} */
    column = 0;
    /** @type {number} */
    graphW = 0;
    /** @type {string} */
    ctx.font = '12px "Courier 10 Pitch", "Courier New", Courier, monospace';
    /** @type {number} */
    i = 0;
    for (; i < lines.length; i = i + 1) {
      size = ctx.measureText(lines[i]);
      maxWidth = size.width > maxWidth ? size.width : maxWidth;
      /** @type {number} */
      column = column + 16;
    }
    /** @type {number} */
    column = column - 16;
    if (maxWidth < 11) {
      /** @type {number} */
      graphW = Math.round((11 - maxWidth) / 2);
      /** @type {number} */
      maxWidth = 11;
    }
    title = t + 5;
    /** @type {number} */
    language = err + 8 - column;
    /** @type {number} */
    mainCanvas = title + 13 + maxWidth - 1;
    /** @type {number} */
    newColumn = language + 20 + column;
    vim.images.drawPartScale(ctx, THREAD_STARTED, 5, 65, 13, 13, title, language, 13, 13);
    vim.images.drawPartScale(ctx, THREAD_STARTED, 87, 65, 13, 13, mainCanvas, language, 13, 13);
    vim.images.drawPartScale(ctx, THREAD_STARTED, 5, 150, 23, 20, title, newColumn, 23, 20);
    vim.images.drawPartScale(ctx, THREAD_STARTED, 87, 150, 13, 20, mainCanvas, newColumn, 13, 20);
    vim.images.drawPartScale(ctx, THREAD_STARTED, 20, 65, 1, 13, title + 13, language, maxWidth - 1, 13);
    vim.images.drawPartScale(ctx, THREAD_STARTED, 30, 150, 1, 13, title + 23, newColumn, maxWidth - 11, 13);
    vim.images.drawPartScale(ctx, THREAD_STARTED, 5, 79, 13, 71, title, language + 13, 13, column + 7);
    vim.images.drawPartScale(ctx, THREAD_STARTED, 87, 79, 13, 71, mainCanvas, language + 13, 13, column + 7);
    vim.images.drawPartScale(ctx, THREAD_STARTED, 29, 79, 1, 71, title + 13, language + 13, maxWidth, column + 7);
    ctx.fillStyle = GameColors.get(undefined, options)[1];
    /** @type {number} */
    i = 0;
    for (; i < lines.length; i = i + 1) {
      ctx.fillText(lines[i], title + 13 + graphW, language + 20 + i * 16);
    }
  }
  /**
   * @param {number} data
   * @param {number} filepath
   * @param {!Object} arr
   * @param {string} key
   * @param {boolean} from
   * @param {boolean} type
   * @return {undefined}
   */
  function run(data, filepath, arr, key, from, type) {
    var maxWidth;
    var modifier;
    var firstX;
    var blueWins;
    var height;
    var count;
    var i;
    var size;
    var cs;
    var value;
    var minWidth;
    /** @type {number} */
    var KFactor = type === true ? -1 : 1;
    /** @type {number} */
    var BlueWe = 0;
    /** @type {number} */
    maxWidth = 0;
    /** @type {number} */
    modifier = 0;
    ctx.font = textsize + "px Arial, Helvetica, sans-serif";
    /** @type {number} */
    i = 0;
    for (; i < arr.length; i = i + 1) {
      size = ctx.measureText(arr[i]);
      maxWidth = size.width > maxWidth ? size.width : maxWidth;
      modifier = modifier + STRAIGHT_RISK;
    }
    if (KFactor === -1) {
      BlueWe = maxWidth + 25;
      /** @type {number} */
      data = data - (maxWidth + 50);
    }
    if (type) {
      ctx.save();
      ctx.scale(-1, 1);
    }
    firstX = data + 45;
    /** @type {number} */
    height = filepath - 15 - modifier;
    blueWins = firstX + 25 + maxWidth;
    count = height + 25 + modifier;
    vim.images.drawPartScale(ctx, key, 0, 60, 25, 25, KFactor * (firstX + BlueWe), height, 25, 25);
    vim.images.drawPartScale(ctx, key, 75, 60, 25, 25, KFactor * (blueWins - BlueWe), height, 25, 25);
    vim.images.drawPartScale(ctx, key, 0, 140, 25, 30, KFactor * (firstX + BlueWe), count, 25, 30);
    vim.images.drawPartScale(ctx, key, 75, 140, 25, 30, KFactor * (blueWins - BlueWe), count, 25, 30);
    if (type) {
      vim.images.drawPartScale(ctx, key, 25, 60, 50, 25, KFactor * (blueWins - BlueWe + maxWidth), height, maxWidth, 25);
      vim.images.drawPartScale(ctx, key, 25, 140, 50, 30, KFactor * (blueWins - BlueWe + maxWidth), count, maxWidth, 30);
      vim.images.drawPartScale(ctx, key, 25, 85, 50, 55, KFactor * (blueWins - BlueWe + maxWidth), height + 25 - 1, maxWidth, modifier + 1);
    } else {
      vim.images.drawPartScale(ctx, key, 25, 60, 50, 25, firstX + 25, height, maxWidth, 25);
      vim.images.drawPartScale(ctx, key, 25, 140, 50, 30, firstX + 25, count, maxWidth, 30);
      vim.images.drawPartScale(ctx, key, 25, 85, 50, 55, firstX + 25, height + 25 - 1, maxWidth, modifier + 1);
    }
    vim.images.drawPartScale(ctx, key, 0, 85, 25, 55, KFactor * (firstX + BlueWe), height + 25 - 1, 25, modifier + 1);
    vim.images.drawPartScale(ctx, key, 75, 85, 25, 55, KFactor * (blueWins - BlueWe), height + 25 - 1, 25, modifier + 1);
    if (type) {
      ctx.restore();
    }
    ctx.fillStyle = GameColors.get(undefined, from)[from ? 1 : 0];
    /** @type {number} */
    i = 0;
    for (; i < arr.length; i = i + 1) {
      if (from && vim.input.isInMiddleOfCursorCommand()) {
        if (arr[i].charAt(arr.length - 1) === "|") {
          /** @type {string} */
          ctx.fillStyle = "#ff0";
          ctx.fillText(arr[i], firstX + 25, height + 40 + i * STRAIGHT_RISK);
          ctx.fillStyle = GameColors.get(undefined, from)[1];
        }
        ctx.fillText(arr[i].substr(0, arr[i].length - 1), firstX + 25, height + 40 + i * STRAIGHT_RISK);
      } else {
        /** @type {boolean} */
        cs = false;
        value = arr[i];
        if (i + 1 === arr.length && arr[i].indexOf("Press Esc to") !== -1) {
          /** @type {string} */
          ctx.fillStyle = "#777";
          /** @type {boolean} */
          cs = true;
        }
        if (arr[i].substr(0, 2) === "^c") {
          /** @type {boolean} */
          cs = true;
          value = arr[i].substr(2);
        }
        if (cs) {
          minWidth = ctx.measureText(value).width;
        }
        ctx.fillText(value, firstX + 25 + (type ? -30 : 0) + (cs ? (maxWidth - minWidth) / 2 : 0), height + 40 + i * STRAIGHT_RISK);
      }
    }
  }
  /**
   * @param {!CanvasRenderingContext2D} context
   * @param {string} name
   * @param {number} p
   * @param {number} x
   * @param {string} key
   * @param {string} index
   * @return {undefined}
   */
  function func(context, name, p, x, key, index) {
    var css;
    var direction;
    var undoingVote;
    var result = func.images;
    var buffer;
    var ctx;
    if (!result) {
      result = {};
      func.images = result;
    }
    if (!result[key]) {
      result[key] = {};
    }
    if (!result[key][name]) {
      result[key][name] = {};
    }
    buffer = result[key][name][index];
    if (!buffer) {
      /** @type {!Element} */
      buffer = document.createElement("canvas");
      /** @type {number} */
      buffer.width = 20;
      /** @type {number} */
      buffer.height = 20;
      ctx = buffer.getContext("2d");
      if (index) {
        /** @type {string} */
        ctx.font = 'bold 18px "Comic Sans MS", Purisa, cursive';
      } else {
        /** @type {string} */
        ctx.font = "18px Courier New";
      }
      css = GameColors.get(key, false);
      ctx.fillStyle = css[1];
      ctx.fillText(name, 5, 16);
      ctx.fillStyle = css[0];
      ctx.fillText(name, 4, 15);
      /** @type {!Element} */
      result[key][name][index] = buffer;
    }
    if (key === "r" || key === "replaceOriginal") {
      /** @type {number} */
      direction = Math.sin(wobble) / 2 + 0.5;
      /** @type {boolean} */
      undoingVote = key === "replaceOriginal";
      /** @type {number} */
      context.globalAlpha = undoingVote ? 1 - direction : direction;
    }
    context.drawImage(buffer, p, x);
    if (key === "r" || key === "replaceOriginal") {
      /** @type {string} */
      context.globalAlpha = "1.0";
    }
  }
  /**
   * @param {!CanvasRenderingContext2D} ctx
   * @param {number} text
   * @param {number} x
   * @param {number} y
   * @param {boolean} width
   * @param {boolean} left
   * @return {undefined}
   */
  function draw(ctx, text, x, y, width, left) {
    /** @type {!Array} */
    var splitList = left ? ["#0f0", "#000"] : width ? ["#f00", "#600"] : ["#fff", "#006"];
    var orgW;
    /** @type {number} */
    var stringFiller = 0;
    if (width) {
      /** @type {number} */
      stringFiller = Math.abs(gy % 20 - 10);
    }
    /** @type {string} */
    ctx.font = "12px Arial";
    orgW = ctx.measureText(text).width;
    x = x + (left ? -10 - 8 * (text < 10 ? 1 : 2) : 25 - orgW);
    /** @type {number} */
    y = y - (left ? -30 : 15 + stringFiller);
    ctx.fillStyle = splitList[1];
    ctx.fillText(text, x, y - 1);
    ctx.fillText(text, x, y + 1);
    ctx.fillText(text, x - 1, y);
    ctx.fillText(text, x + 1, y);
    ctx.fillText(text, x - 1, y - 1);
    ctx.fillText(text, x + 1, y + 1);
    ctx.fillText(text, x - 1, y + 1);
    ctx.fillText(text, x + 1, y - 1);
    ctx.fillStyle = splitList[0];
    ctx.fillText(text, x, y);
  }
  /**
   * @return {undefined}
   */
  function write() {
    var ourSplitFirstPartSolution;
    var i;
    /** @type {number} */
    var equationStringAfterSplitParse = 0;
    /** @type {!Array} */
    var colors = ["yellow", "blue", "red", "small_brown", "star"];
    var cg;
    /** @type {number} */
    i = 0;
    for (; i < colors.length; ++i) {
      /** @type {boolean} */
      cg = colors[i] === "small_brown";
      /** @type {number} */
      ourSplitFirstPartSolution = 0;
      for (; ourSplitFirstPartSolution < vim.inventory.getNumberOfKeys(colors[i]); ourSplitFirstPartSolution = ourSplitFirstPartSolution + 1) {
        vim.images.drawScale(ctx, colors[i] + "_key", w - 200 + (ourSplitFirstPartSolution + equationStringAfterSplitParse) * 40, 40 + (cg ? 85 * 0.2 : 0), 50 * (cg ? 0.8 : 1), 85 * (cg ? 0.8 : 1));
      }
      /** @type {number} */
      equationStringAfterSplitParse = equationStringAfterSplitParse + ourSplitFirstPartSolution;
    }
  }
  /**
   * @param {number} key
   * @param {number} value
   * @return {?}
   */
  function get(key, value) {
    var item;
    var y;
    var name;
    var self = vim.buffers.getCurrentBuffer().getBoard();
    var map = vim.buffers.getCurrentBuffer().getTextAreas();
    if (!self.isCodeBG(key, value)) {
      return undefined;
    }
    item = map.get(key, value);
    if (item) {
      return item;
    }
    /** @type {number} */
    name = key;
    for (; self.isCodeBG(name, value) && self.getBG(name, value) !== self.MISSING;) {
      name--;
    }
    if (name !== key) {
    }
    item = map.get(name + 1, value);
    if (item) {
      return item;
    }
    /** @type {number} */
    y = value;
    for (; self.isCodeBG(name + 1, y) && self.getBG(name + 1, y) !== self.MISSING;) {
      y--;
    }
    if (y !== value) {
      item = map.get(name + 1, y + 1);
      if (item) {
        return item;
      }
    }
    return undefined;
  }
  /**
   * @param {boolean} prop
   * @param {!Array} value
   * @param {?} tokens
   * @return {?}
   */
  function set(prop, value, tokens) {
    var errors = get(prop, value);
    return errors && errors.getTopX() == tokens.getTopX() && errors.getTopY() == tokens.getTopY();
  }
  /**
   * @param {number} right
   * @param {number} row
   * @param {?} context
   * @return {?}
   */
  function filter(right, row, context) {
    var ta = vim.model.getCell(right, row).ta;
    return ta && ta.getTopX() == context.getTopX() && ta.getTopY() == context.getTopY();
  }
  /**
   * @param {!Object} i
   * @param {?} value
   * @param {!Object} options
   * @return {?}
   */
  function change(i, value, options) {
    /** @type {boolean} */
    var state = true;
    if (value < options.startY) {
      /** @type {boolean} */
      state = false;
    }
    if (value > options.endY) {
      /** @type {boolean} */
      state = false;
    }
    if (value === options.startY && i < options.startX) {
      /** @type {boolean} */
      state = false;
    }
    if (value === options.endY && i > options.endX) {
      /** @type {boolean} */
      state = false;
    }
    if (options.isDirectLine && (i !== options.startX || i !== options.endX)) {
      /** @type {boolean} */
      state = false;
    }
    if (options.reverseSelection && typeof options.textArea !== "undefined" && set(i, value, options.textArea)) {
      /** @type {boolean} */
      state = !state;
    }
    return state;
  }
  /**
   * @return {undefined}
   */
  function tick() {
    var p = vim.model;
    var item = p.getTopX();
    var width = p.getTopY();
    if (isEditModeEnabled) {
      if (x !== 0) {
        x = x + (x < 0 ? 1 : -1) * Math.min(minPxPerValUnit, Math.abs(x));
      }
      if (y !== 0) {
        y = y + (y < 0 ? 1 : -1) * Math.min(minPxPerValUnit, Math.abs(y));
      }
      ctx.drawImage(target, x + Math.max(0, last - pos) * width, y + Math.max(0, val - min) * height, w, h, 0, 0, w, h);
      draw_canvas();
      if (x === 0 && y === 0) {
        call();
      }
    } else {
      render(ctx, item, width, item + k, width + delta);
    }
  }
  /**
   * @param {!CanvasRenderingContext2D} ctx
   * @param {number} x
   * @param {number} y
   * @param {string} from_o
   * @return {undefined}
   */
  function move(ctx, x, y, from_o) {
    if (typeof move.bubbles === "undefined") {
      /** @type {!Array} */
      move.bubbles = [];
    }
    move.bubbles.push({
      context : ctx,
      xpos : x,
      ypos : y,
      text : from_o
    });
  }
  /**
   * @return {undefined}
   */
  function addCode() {
    var i;
    var child;
    if (!move.bubbles) {
      return;
    }
    /** @type {number} */
    i = 0;
    for (; i < move.bubbles.length; ++i) {
      child = move.bubbles[i];
      addText(child.context, child.xpos, child.ypos, child.text, true);
    }
    /** @type {!Array} */
    move.bubbles = [];
  }
  /**
   * @param {!CanvasRenderingContext2D} ctx
   * @param {number} start
   * @param {string} n
   * @param {string} index
   * @param {string} val
   * @return {undefined}
   */
  function render(ctx, start, n, index, val) {
    var r;
    var length;
    var i;
    var j;
    var x;
    var y;
    var x2;
    var offset;
    var value;
    var atomIndex;
    var f;
    var k;
    var name;
    var text;
    var data;
    var self;
    var destheight;
    var isRtl;
    var c0;
    var offsetY;
    var scroll_adjust;
    var cL;
    var error;
    /** @type {boolean} */
    var cp = false;
    var indexLookupKey;
    var key;
    var id;
    var info;
    var node;
    /** @type {number} */
    var t = index - start;
    /** @type {number} */
    var min = val - n;
    var p = vim.buffers.getCurrentBuffer().getBoard();
    var cN = vim.buffers.getCurrentBuffer().getEntities();
    var c2 = vim.buffers.getCurrentBuffer().getTextAreas();
    var item;
    var aYbY;
    var init;
    var sX;
    var dx;
    var cr;
    var h;
    var options;
    var range = vim.model;
    var A;
    if (!tick.waveValues) {
      /** @type {!Array} */
      tick.waveValues = [];
      /** @type {number} */
      tick.lastWaveUpdate = slider_tick - 2000;
    }
    if (slider_tick - tick.lastWaveUpdate > 1500) {
      /** @type {boolean} */
      cp = true;
      tick.lastWaveUpdate = slider_tick;
    }
    if (!tick.disappearingCursorVals) {
      /** @type {!Array} */
      tick.disappearingCursorVals = [];
      /** @type {number} */
      k = 0;
      for (; k < 36 * 30; ++k) {
        tick.disappearingCursorVals.push(k);
      }
      /** @type {number} */
      k = 0;
      for (; k < 36 * 30; ++k) {
        /** @type {number} */
        key = Math.floor(Math.random() * (36 * 30 - k));
        id = tick.disappearingCursorVals[k];
        tick.disappearingCursorVals[k] = tick.disappearingCursorVals[key];
        tick.disappearingCursorVals[key] = id;
      }
    }
    if (!tick.disappearingCursorPixel) {
      tick.disappearingCursorPixel = ctx.createImageData(1, 1);
      /** @type {number} */
      tick.disappearingCursorPixel.data[0] = 0;
      /** @type {number} */
      tick.disappearingCursorPixel.data[1] = 0;
      /** @type {number} */
      tick.disappearingCursorPixel.data[2] = 33;
      /** @type {number} */
      tick.disappearingCursorPixel.data[3] = 0.5;
    }
    /** @type {number} */
    drawCircle.x = drawCircle.y = 0;
    /** @type {number} */
    r = -2;
    for (; r < min + 2; r = r + 1) {
      /** @type {number} */
      length = -2;
      for (; length < t + 2; length = length + 1) {
        i = length + start;
        j = r + n;
        options = range.getCell(i, j);
        /** @type {boolean} */
        cL = i === Cursor.getX() && j === Cursor.getY();
        name = options.bg;
        /** @type {number} */
        x = length * width;
        /** @type {number} */
        y = r * height;
        /** @type {number} */
        indexLookupKey = (50 * j + i) % 1500;
        method = options.bgHeight;
        if (cp || method === 0 && typeof tick.waveValues[indexLookupKey] === "undefined") {
          /** @type {number} */
          tick.waveValues[indexLookupKey] = Math.floor(Math.random() * 3) - 1;
        }
        if (method === 0) {
          y = y + height / 2 - 2 + tick.waveValues[indexLookupKey];
        } else {
          if (name === p.RAMP_EAST || name === p.RAMP_WEST) {
            /** @type {number} */
            y = y - height / 2;
          }
        }
        if (options.sinked) {
          y = y + parseFloat();
        }
        /** @type {boolean} */
        info = false;
        node = undefined;
        if (options.ta) {
          data = options.sa;
          if (data && data.type === "t") {
            name = options.ta.getShouldClean();
          }
          info = data && data.type === "M";
          if (lines.length > 0 && lines[0].width < 3) {
            lines.splice(0, 1);
          }
          /** @type {number} */
          k = 0;
          for (; k < lines.length; ++k) {
            if (lines[k].x === i && lines[k].y === j) {
              node = lines[k];
            }
          }
        }
        if (info) {
          ctx.save();
          ctx.translate(x + 18, y + 32);
          ctx.rotate((gy % 40 > 19 ? 2 : -2) * Math.PI / 180);
          /** @type {number} */
          x = -18;
          /** @type {number} */
          y = -32;
        }
        switch(name) {
          case p.GRASS:
            vim.images.draw(ctx, "grass", x, y);
            break;
          case p.WATER:
            vim.images.draw(ctx, "water", x, y);
            break;
          case p.PATH:
            vim.images.draw(ctx, "dirt", x, y);
            break;
          case p.PLAIN:
            vim.images.draw(ctx, "plain", x, y);
            break;
          case p.DARK:
            vim.images.draw(ctx, "dark", x, y);
            break;
          case p.CRACKED:
            vim.images.draw(ctx, "cracked", x, y);
            break;
          case p.WOOD:
            vim.images.draw(ctx, "wood", x, y);
            break;
          case p.WALL:
            vim.images.draw(ctx, "stone", x, y);
            break;
          case p.TALL_WALL:
            vim.images.draw(ctx, "stone_tall", x, y);
            break;
          case p.HOUSE_WALL:
            vim.images.draw(ctx, "stone_tall", x, y);
            vim.images.draw(ctx, "stone", x, y - 29);
            break;
          case p.RAMP_EAST:
            vim.images.draw(ctx, "stone", x, y + 15);
            vim.images.draw(ctx, "ramp_east", x, y);
            break;
          case p.RAMP_WEST:
            vim.images.draw(ctx, "stone", x, y + 15);
            vim.images.draw(ctx, "ramp_west", x, y);
            break;
          case p.WHITE:
            vim.images.draw(ctx, "white", x, y);
            break;
          case p.CLOUD:
            vim.images.draw(ctx, "cloud", x, y);
            break;
          case p.SAND:
            vim.images.draw(ctx, "sand", x, y);
            break;
          case p.LAVA:
            vim.images.draw(ctx, "lava", x, y);
            break;
        }
        if (typeof node !== "undefined" && node.width > 3) {
          vim.images.drawScale(ctx, "plain", x + (width - node.width) / 2, y + 19 + (height - Math.floor(node.width * 30 / 37)) / 2 + 8 - node.width / 5, Math.floor(node.width), Math.floor(node.width * 30 / 37));
          /** @type {number} */
          node.width = node.width / 1.2;
        }
        if (options.shadows) {
          var bbox = options.shadows;
          /** @type {number} */
          var data = 0;
          /** @type {number} */
          var offset = 0;
          var self;
          var attrs;
          if (bbox.north || bbox.ne || bbox.nw) {
            self = range.getCell(i, j - 1);
            if (self.sinked && !options.sinked) {
              offset = parseFloat();
            }
            if (j > 0 && self.bgHeight === 3 && options.bgHeight === 2) {
              /** @type {number} */
              offset = offset - 14;
            }
          }
          if (bbox.south || bbox.se || bbox.sw) {
            attrs = range.getCell(i, j + 1);
            if (!options.sinked && attrs.sinked) {
              data = parseFloat();
            }
          }
          if (bbox.north) {
            vim.images.draw(ctx, "shadow_north", x, y + offset);
          }
          if (!bbox.north && !bbox.east && bbox.ne && p.getBG(i - 1, j - 1) !== p.RAMP_EAST) {
            vim.images.draw(ctx, "shadow_north_east", x, y + offset);
          }
          if (!bbox.north && !bbox.west && bbox.nw && p.getBG(i + 1, j - 1) !== p.RAMP_WEST) {
            vim.images.draw(ctx, "shadow_north_west", x, y + offset);
          }
          if (bbox.south) {
            if (attrs.bg !== p.RAMP_EAST && attrs.bg !== p.RAMP_WEST) {
              vim.images.draw(ctx, "shadow_south", x, y + data);
            }
          }
          if (!bbox.south && !bbox.east && bbox.se && p.getBG(i + 1, j + 1) !== p.RAMP_WEST) {
            vim.images.draw(ctx, "shadow_south_east", x, y + data);
          }
          if (!bbox.south && !bbox.west && bbox.sw && p.getBG(i - 1, j + 1) !== p.RAMP_EAST) {
            vim.images.draw(ctx, "shadow_south_west", x, y + data);
          }
          if (bbox.east && p.getBG(i + 1, j) !== p.RAMP_WEST) {
            vim.images.draw(ctx, "shadow_east", x, y);
          }
          if (bbox.west && p.getBG(i - 1, j) !== p.RAMP_EAST) {
            vim.images.draw(ctx, "shadow_west", x, y);
          }
        }
        /** @type {number} */
        scroll_adjust = options.bgHeight > 1 ? -14 : 0;
        if (time && seconds > 0 && set(i, j, time) && name !== p.MISSING && name !== p.SKY_MISSING || time && time.isBossMode() && options.ta === time) {
          /** @type {string} */
          ctx.fillStyle = "rgba(255,255,255," + seconds % 2 + ")";
          ctx.fillRect(x + 2, y + scroll_adjust + 19 + 2, width - 4, height - 4);
        } else {
          if (result && result.count > 0 && (typeof result.textArea === "undefined" || filter(i, j, result.textArea)) && change(i, j, result)) {
            ctx.fillStyle = result.color || "rgba(255,0,0,0.5)";
            if (typeof result.inputCursorBefore === "undefined") {
              ctx.fillRect(x + 2, y + scroll_adjust + 19 + 2, width - 4, height - 4);
            } else {
              if (result.inputCursorBefore) {
                ctx.fillRect(x + 2, y + scroll_adjust + 19 + 2, 3, height - 4);
              } else {
                ctx.fillRect(x - 7 + width, y + scroll_adjust + 19 + 2, 3, height - 4);
              }
            }
          }
        }
        if (options.sinked) {
          /** @type {string} */
          ctx.fillStyle = "rgba(255,255,0,0.5)";
          ctx.fillRect(x, y + 19, width, height);
        }
        f = options.entitiesList;
        /** @type {number} */
        atomIndex = 0;
        for (; atomIndex < f.length; atomIndex = atomIndex + 1) {
          self = f[atomIndex];
          if (self instanceof CursorNPC && self.isCursorNPCOn(gy) && !self.isInvisible()) {
            ctx.fillStyle = self.getFillStyle();
            ctx.fillRect(x, y + 19, width, height);
          }
        }
        /** @type {number} */
        atomIndex = 0;
        for (; atomIndex < f.length; atomIndex = atomIndex + 1) {
          self = f[atomIndex];
          if (self instanceof RedBug && "Bram Uganda Charity".indexOf(self.getVolPattern()) !== -1 && self.isFrozen()) {
            switch(self.getVolPattern()) {
              case "Bram":
                /** @type {string} */
                ctx.fillStyle = "#fff";
                /** @type {number} */
                cr = 1;
                break;
              case "Uganda":
                /** @type {string} */
                ctx.fillStyle = "#f00";
                /** @type {number} */
                cr = 2;
                break;
              case "Charity":
                /** @type {string} */
                ctx.fillStyle = "rgba(0,0,255,0.5)";
                /** @type {number} */
                cr = 2;
                break;
              default:
                /** @type {string} */
                ctx.fillStyle = "rgba(255,255,255,0)";
                break;
            }
            if (Math.floor((gy + cr) / 6) % 2) {
              ctx.fillRect(x, y + 19, width, height);
            }
          }
        }
        if (cL) {
          /** @type {number} */
          drawCircle.x = x;
          drawCircle.y = y + 19;
        }
        if (cL && Cursor.isOn()) {
          if (article) {
            if (name === p.MISSING || name === p.SKY_MISSING) {
              /** @type {string} */
              ctx.fillStyle = "rgba(255,255,255,0.5)";
            } else {
              /** @type {string} */
              ctx.fillStyle = "rgba(0,0,33,0.5)";
            }
            ctx.fillRect(x, y + 19, 3, height);
          } else {
            if (itemrequired) {
              /** @type {string} */
              ctx.fillStyle = "rgba(255,255,255,0.5)";
              ctx.fillRect(x + (width - sideSize) / 2, y + 19 + (height - Math.floor(sideSize * 30 / 37)) / 2 + 8 - sideSize / 5, sideSize, Math.floor(sideSize * 30 / 37));
            } else {
              if (calc_width) {
                /** @type {string} */
                ctx.fillStyle = "rgba(0,0,33,0.5)";
                if (fill > 14) {
                  ctx.fillRect(x, y + 19, width, height);
                } else {
                  /** @type {number} */
                  k = 0;
                  for (; k < fill % 15 * 72; ++k) {
                    ctx.fillRect(x + (tick.disappearingCursorVals[k] - Math.floor(tick.disappearingCursorVals[k] / 36) * 36), y + 19 + Math.floor(tick.disappearingCursorVals[k] / 36), 1, 1);
                  }
                }
              } else {
                /** @type {string} */
                ctx.fillStyle = "rgba(0,0,33,0.5)";
                if (name !== p.RAMP_EAST && name !== p.RAMP_WEST) {
                  ctx.fillRect(x, y + 19, width, height);
                }
                if (name === p.RAMP_EAST) {
                  ctx.beginPath();
                  ctx.moveTo(x, y + 19);
                  ctx.lineTo(x + width, y + 33);
                  ctx.lineTo(x + width, y + 33 + height);
                  ctx.lineTo(x, y + 19 + height);
                  ctx.fill();
                }
                if (name === p.RAMP_WEST) {
                  ctx.beginPath();
                  ctx.moveTo(x + width, y + 19);
                  ctx.lineTo(x, y + 33);
                  ctx.lineTo(x, y + 33 + height);
                  ctx.lineTo(x + width, y + 19 + height);
                  ctx.fill();
                }
              }
            }
          }
        }
        text = options.ta;
        if (text !== undefined) {
          value = options.letter;
          A = text.isSacred();
          /** @type {number} */
          x2 = x + Math.floor(width * 0.2);
          offset = y + Math.floor(height * 0.8 + 1 + (options.bgHeight > 1 ? -14 : 0));
          data = options.sa;
          if (data && data.hidden !== true) {
            switch(data.type) {
              case "x":
              case "r":
              case "d":
              case "*":
                /** @type {boolean} */
                isRtl = data.startX === i && data.startY === j;
                /** @type {boolean} */
                c0 = data.endX === i && data.endY === j;
                /** @type {number} */
                offsetY = options.bgHeight > 1 ? -14 : 0;
                /** @type {string} */
                ctx.strokeStyle = name === p.LAVA ? "#500" : "#f00";
                /** @type {number} */
                ctx.lineWidth = 2;
                if (isRtl) {
                  ctx.strokeRect(x + 3.5, y - 0.5 + 26 + offsetY, 1, height - 14);
                }
                ctx.strokeRect(x + (isRtl ? 3.5 : 0.5), y + 0.5 + 22 + offsetY, width - 2 + (c0 ? -2 : 0) + (isRtl ? -3 : 0), 1);
                ctx.strokeRect(x + (isRtl ? 3.5 : 0.5), y + 0.5 + height - 9 + 22 + offsetY, width - 2 + (c0 ? -2 : 0) + (isRtl ? -3 : 0), 1);
                if (c0) {
                  ctx.strokeRect(x + 4.5 + width - 9, y - 0.5 + 26 + offsetY, 1, height - 14);
                }
                break;
              case "+":
                if (method == 1) {
                  /** @type {string} */
                  ctx.fillStyle = "rgba(127,255,0,0.5)";
                  ctx.fillRect(x, y + 19, width, height);
                }
                break;
              case "o":
                item = options.markObj;
                if (typeof item === "undefined" || item.mark !== data.requiredMark) {
                  /** @type {string} */
                  ctx.globalAlpha = "0.4";
                  vim.images.drawFlag(ctx, x + 5, y - 25, data.requiredMark);
                  /** @type {string} */
                  ctx.globalAlpha = "1.0";
                }
                break;
            }
          }
          if (text.isHighlighted(i, j)) {
            /** @type {string} */
            ctx.fillStyle = "rgba(102,204,255,0.5)";
            ctx.fillRect(x, y + 19, width, height);
          }
          if (value !== " ") {
            if (data && data.type === "r" && data.hidden !== true) {
              func(ctx, data.originalCharacter, x2, offset, "replaceOriginal", A);
              func(ctx, value, x2, offset, data && data.hidden !== true ? data.type : "completed", A);
            } else {
              if (data && data.type === "*" && data.inplace && data.hidden !== true) {
                func(ctx, data.originalText.charAt(i - data.startX), x2, offset, "replaceOriginal", A);
                func(ctx, value, x2, offset, data && data.hidden !== true ? "r" : "completed", A);
              } else {
                if (data && data.type === "*" && !data.inplace && data.hidden !== true) {
                  func(ctx, value, x2, offset, data && data.hidden !== true ? name === p.LAVA ? "d_on_lava" : "d" : "completed", A);
                } else {
                  error = data && data.hidden !== true ? data.type : "completed";
                  if (name === p.WATER) {
                    /** @type {string} */
                    error = "watered";
                  } else {
                    if (name === p.LAVA) {
                      /** @type {string} */
                      error = "on_lava";
                    } else {
                      if (name === p.MISSING || name === p.SKY_MISSING) {
                        /** @type {string} */
                        error = "missing";
                      }
                    }
                  }
                  func(ctx, value, x2, offset, error, A);
                }
              }
            }
          }
        }
        if (info) {
          ctx.restore();
        }
      }
    }
    validate();
    build();
    redraw();
    /** @type {number} */
    r = -2;
    for (; r < min + 2; r = r + 1) {
      /** @type {number} */
      k = -2;
      for (; k < t + 2; k = k + 1) {
        i = k + start;
        j = r + n;
        options = range.getCell(i, j);
        /** @type {number} */
        x = k * width;
        /** @type {number} */
        y = r * height;
        text = options.ta;
        if (!text) {
          continue;
        }
        item = options.markObj;
        if (item) {
          /** @type {number} */
          aYbY = y - (item.yOffset ? item.yOffset > 5 ? 10 - item.yOffset : item.yOffset - 1 : 0) * 2;
          if (item.yOffset > 0) {
            item.yOffset -= 2;
          }
          vim.images.drawFlag(ctx, x + 5, aYbY - 25, item.mark);
          data = options.sa;
          if (data && data.hidden !== true && data.type === "_" && vim.model.getDisplayableMarks().indexOf(item.mark) !== -1) {
            vim.images.drawToBeRemovedSign(ctx, x + 5, aYbY - 25);
          }
        }
        data = options.sa;
        if (data && data.type === "n") {
          /** @type {number} */
          sX = x + 10;
          /** @type {number} */
          dx = Math.floor(y + height * 1.3 + 1 + (options.bgHeight > 1 ? -14 : 0));
          draw(ctx, data.stepNumber, sX, dx, data.stepNumber === text.getCurrentNumber());
        }
        if (vim.model.isShowNumbers()) {
          if (i === text.getTopX() || i === start + 1) {
            draw(ctx, j - text.getTopY() + 1, x, y, false, true);
          }
        }
      }
    }
    /** @type {number} */
    r = -2;
    for (; r < min + 2; r = r + 1) {
      /** @type {number} */
      k = -2;
      for (; k < t + 2; k = k + 1) {
        i = k + start;
        j = r + n;
        options = range.getCell(i, j);
        /** @type {number} */
        x = k * width;
        /** @type {number} */
        y = r * height;
        method = options.bgHeight;
        if (p.isValid(i, j) && method === 0) {
          y = y + height / 2 + 2 + tick.waveValues[indexLookupKey];
        }
        f = options.entitiesList;
        /** @type {number} */
        atomIndex = 0;
        for (; atomIndex < f.length; atomIndex = atomIndex + 1) {
          self = f[atomIndex];
          if (typeof self.getImageName() !== "undefined" && vim.images.exists(self.getImageName()) && !self.isInvisible()) {
            if (self instanceof KeyboardKey) {
              value = self.getLetter();
              if (value.charAt(0) === "\\") {
                value = value.substr(1);
              }
              if (value !== "CTRL-R") {
                /** @type {number} */
                destheight = width / 2 + 2;
                vim.images.drawScale(ctx, self.getImageName(), x + self.getXOffset() + width / 5, y + self.getYOffset(), destheight, destheight * 2);
                /** @type {string} */
                ctx.fillStyle = "#000";
                /** @type {string} */
                ctx.font = "13px Courier New";
                ctx.fillText(value, x + self.getXOffset() + 17 - ctx.measureText(value).width / 2, y + self.getYOffset() + 26);
              } else {
                vim.images.drawScale(ctx, self.getImageName(), x + self.getXOffset() - 5, y + self.getYOffset() + 1, width + 10, width + 2);
                /** @type {string} */
                ctx.fillStyle = "#000";
                /** @type {string} */
                ctx.font = "10px Courier New";
                ctx.fillText(value, x + self.getXOffset() + 17 - ctx.measureText(value).width / 2, y + self.getYOffset() + 26);
              }
            } else {
              if (self instanceof RedBug || self instanceof BigBug) {
                show(ctx, x, y, self);
              } else {
                if (self instanceof Selector && self === PL$4) {
                  ctx.save();
                  /** @type {number} */
                  ctx.globalAlpha = Math.min(1, Math.abs(Math.sin(wobble)) + 0.25);
                  vim.images.draw(ctx, self.getImageName(), x + self.getXOffset(), y - width / 3 + self.getYOffset());
                  ctx.restore();
                } else {
                  h = y + 18 + height;
                  if (range.getCell(i, j + 1).bgHeight > 1) {
                    /** @type {number} */
                    h = h - 14;
                  }
                  vim.images.draw(ctx, self.getImageName(), x + self.getXOffset(), y - 12 + self.getYOffset(), h);
                }
              }
            }
          }
        }
      }
      /** @type {number} */
      length = -3;
      for (; length < t + 2; length = length + 1) {
        i = length + start;
        j = r + n;
        options = range.getCell(i, j);
        /** @type {number} */
        x = length * width;
        /** @type {number} */
        y = r * height;
        text = range.getCell(i, j - 1).ta;
        if (text && j - 1 === text.getTopY() + text.getNumberOfLines() - 1 && text.getTopX() === i) {
          data = text.getEmptyLineSpecialArea(i, j - 1, false);
          if (data && data.hidden !== true && i === data.startX && j === data.startY && data.emptyLine) {
            move(ctx, x - 22, y - 10, data.originalText);
          }
        }
        text = options.ta;
        if (!text) {
          continue;
        }
        if (i === text.getTopX()) {
          data = text.getEmptyLineSpecialArea(i, j, true);
          if (data && data.hidden !== true && i === data.startX && j === data.startY && data.emptyLine) {
            move(ctx, x - 22, y - 10, data.originalText);
          }
        }
        data = options.sa;
        if (data && data.type === "*" && !data.inplace || data && data.type === "+") {
          if (data.hidden !== true && i === data.startX && j === data.startY) {
            loop(ctx, x - 22, y - 15, data.originalText, true);
          }
        }
        data = text.getEmptySpecialArea(i, j, true);
        if (data && data.hidden !== true && i === data.startX && j === data.startY && !data.emptyLine) {
          loop(ctx, x - 22, y - 10 - 15 * (i % 2), data.originalText, true);
        }
        if (i === text.getTopX() + text.getLineLength(j - text.getTopY()) - 1) {
          data = text.getEmptySpecialArea(i, j, false);
          if (data && data.hidden !== true && i + 1 === data.startX && j === data.startY) {
            loop(ctx, x - 22 + width, y - 10 - 15 * ((i + 1) % 2), data.originalText, true);
          }
        }
      }
    }
    addCode();
    renderText();
    if (range.isCandleLightMode() || bJ) {
      gradient(ctx);
    }
    if (segmentMarker > 0) {
      --segmentMarker;
    }
    if (segmentMarker === 0 && segmentType > 0) {
      --segmentType;
      if (segmentType === 5 && typeof item === "function") {
        item();
        item = undefined;
      }
      if (segmentType % 2 === 1) {
        ctx.fillStyle = backColor;
        ctx.fillRect(0, 0, w, h);
      } else {
        if (segmentType === 0) {
          timestamp();
        }
      }
    }
    if (seconds > 0) {
      --seconds;
      if (seconds === 0) {
        time = undefined;
        if (isValid) {
          isValid();
        }
        isValid = undefined;
      }
    }
    if (result && result.count > 0) {
      --result.count;
      if (result.count === 0) {
        result = undefined;
      }
    }
    if (children.length > 0 && children[0].count === 0) {
      children.splice(0, 1);
    }
    /** @type {number} */
    k = 0;
    for (; k < children.length; ++k) {
      if (typeof children[k].scale === "undefined" || children[k].scale <= 1) {
        vim.images.draw(ctx, "explosion" + (amount - children[k].count + 1), children[k].px - width * (vim.model.getTopX() - children[k].topX), children[k].py - 5 - height * (vim.model.getTopY() - children[k].topY));
      } else {
        vim.images.drawMulScale(ctx, "explosion" + (amount - children[k].count + 1), children[k].px - width * (vim.model.getTopX() - children[k].topX), children[k].py - 5 - height * (vim.model.getTopY() - children[k].topY), children[k].scale, children[k].scale);
      }
      --children[k].count;
    }
    if (nodes.length > 0 && nodes[0].count === 0) {
      nodes.splice(0, 1);
    }
    /** @type {number} */
    k = 0;
    for (; k < nodes.length; ++k) {
      loop(ctx, nodes[k].px - width * (vim.model.getTopX() - nodes[k].topX), nodes[k].py + (-globalPiecesCount + nodes[k].count) * 4 - height * (vim.model.getTopY() - nodes[k].topY), nodes[k].text, true);
      if (nodes[k].count % 16 < 10) {
        nodes[k].px = nodes[k].px + ~(~(Math.random() * 3) % 3) * 2;
      }
      --nodes[k].count;
    }
    if (calc_width && fill > 0 && !after_is_punctuation && !firstRequiredField) {
      --fill;
      if (fill === 0) {
        /** @type {boolean} */
        calc_width = false;
        Cursor.hide();
        /**
         * @return {undefined}
         */
        init = function() {
          self.restorePositionCB();
          vim.input.enableKeys();
          if (typeof self.entities !== "undefined") {
            /** @type {number} */
            k = 0;
            for (; k < self.entities.length; ++k) {
              if (typeof self.entities[k] !== "undefined") {
                /** @type {boolean} */
                self.entities[k].inCollision = false;
              }
            }
            /** @type {number} */
            self.entities.length = 0;
          }
        };
        if (self.entities && self.entities.length > 0 && typeof self.entities[0] !== "undefined") {
          init();
        } else {
          window.setTimeout(init, 1000);
        }
      }
    }
    if (itemrequired && !after_is_punctuation && !firstRequiredField) {
      /** @type {number} */
      sideSize = sideSize / 1.2;
      if (sideSize < 3) {
        /** @type {boolean} */
        itemrequired = false;
        Cursor.hide();
        window.setTimeout(function() {
          state.restorePositionCB();
          vim.input.enableKeys();
          Cursor.blink();
        }, 1000);
      }
    }
    if (b1 > 0) {
      b1--;
      if (b1 === 0) {
        PL$4 = undefined;
      }
    }
  }
  /**
   * @param {number} G__26636_26639
   * @return {undefined}
   */
  function defilter(G__26636_26639) {
    /** @type {number} */
    G__20648 = G__26636_26639;
  }
  /**
   * @param {!CanvasRenderingContext2D} ctx
   * @return {undefined}
   */
  function gradient(ctx) {
    var x;
    var y;
    var grd;
    var r;
    var left;
    var size;
    if (ctx === elem) {
      left = target.width;
      size = target.height;
      /** @type {number} */
      x = (Cursor.getX() - Math.min(pos, last)) * width + 18;
      /** @type {number} */
      y = (Cursor.getY() - Math.min(min, val)) * height + 18 + 16;
    } else {
      left = w;
      size = h;
      /** @type {number} */
      x = (Cursor.getX() - output.getTopX()) * width + 18;
      /** @type {number} */
      y = (Cursor.getY() - output.getTopY()) * height + 18 + 16;
    }
    if (bJ) {
      r = G__20648;
      if (r === -1) {
        return;
      }
    } else {
      /** @type {number} */
      r = 100;
    }
    /** @type {string} */
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, left, y - r + 2);
    ctx.fillRect(0, 0, x - r, left);
    ctx.fillRect(0, y + r - 2, left, size - y - r + 2);
    ctx.fillRect(x + r, 0, left - x - r, size);
    grd = ctx.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, "rgba(0,0,0,0)");
    grd.addColorStop(1, "rgba(255,204,0,0.75)");
    ctx.fillStyle = grd;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
    grd = ctx.createRadialGradient(x, y, 0, x, y, r + 3);
    grd.addColorStop(0, "rgba(0,0,0,0)");
    grd.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = grd;
    ctx.fillRect(x - r, y - r - 1, r * 2 + 1, r * 2 + 2);
  }
  /**
   * @param {!CanvasRenderingContext2D} ctx
   * @param {number} i
   * @param {number} value
   * @return {undefined}
   */
  function animate(ctx, i, value) {
    var x;
    var y;
    var grd;
    var r;
    var result;
    var y2;
    if (ctx === elem) {
      result = target.width;
      y2 = target.height;
      /** @type {number} */
      x = (i - Math.min(pos, last)) * width + 18;
      /** @type {number} */
      y = (value - Math.min(min, val)) * height + 18 + 16;
    } else {
      result = w;
      y2 = h;
      /** @type {number} */
      x = (i - output.getTopX()) * width + 18;
      /** @type {number} */
      y = (value - output.getTopY()) * height + 18 + 16;
    }
    /** @type {number} */
    r = 150;
    grd = ctx.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, "rgba(77,128,179,0.5)");
    grd.addColorStop(0.5, "rgba(255,204,0,0.75)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    ctx.save();
    /** @type {string} */
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = grd;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
    ctx.restore();
  }
  /**
   * @param {?} canCreateDiscussions
   * @return {undefined}
   */
  function prefetchGroupsInfo(canCreateDiscussions) {
  }
  /**
   * @return {undefined}
   */
  function prompt() {
    var byteString;
    var srcPath;
    if (u !== -1 && f !== -1 && x === 0 && y === 0) {
      if (oldIsFixed && (output.getCursorX() !== u || output.getCursorY() !== f)) {
        /** @type {boolean} */
        oldIsFixed = false;
        /** @type {number} */
        olen = 1;
      }
      if ((olen > 0 || oldIsFixed) && id !== "") {
        /** @type {number} */
        byteString = (u - output.getTopX()) * width - 12;
        /** @type {number} */
        srcPath = (f - output.getTopY()) * height - 15;
        /** @type {string} */
        ctx.globalAlpha = olen > 1 || oldIsFixed ? "1.0" : "" + olen;
        run(byteString, srcPath, id, "speech", false, template);
        /** @type {string} */
        ctx.globalAlpha = "1.0";
      }
      if (olen > 0 && !oldIsFixed) {
        /** @type {number} */
        olen = olen - 0.1;
      }
    }
  }
  /**
   * @return {undefined}
   */
  function transform() {
    var byteString;
    var srcPath;
    var left;
    if (isEditModeEnabled) {
      return;
    }
    if (typeof transform.cursorCommandArray === "undefined") {
      /** @type {!Array} */
      transform.cursorCommandArray = [""];
    }
    if (typeof transform.blinkCounter === "undefined") {
      /** @type {number} */
      transform.blinkCounter = 0;
    }
    if (es3Warning && (output.getCursorX() !== j || output.getCursorY() !== className)) {
      /** @type {boolean} */
      es3Warning = false;
      /** @type {number} */
      value = 1;
    }
    if ((value > 0 || es3Warning) && key !== "" && (output.getCursorX() !== u || output.getCursorY() !== f)) {
      if (key.indexOf("\n") !== -1) {
        left = key.split("\n");
      } else {
        transform.cursorCommandArray[0] = key;
        left = transform.cursorCommandArray;
      }
      if (vim.input.isInMiddleOfCursorCommand()) {
        left[0] += transform.blinkCounter < 5 ? "|" : " ";
      }
      /** @type {number} */
      byteString = (output.getCursorX() - output.getTopX()) * width - 12;
      /** @type {number} */
      srcPath = (output.getCursorY() - output.getTopY()) * height - 15;
      /** @type {string} */
      ctx.globalAlpha = value > 1 || vim.input.isInMiddleOfCursorCommand() || es3Warning ? "1.0" : "" + value;
      run(byteString, srcPath, left, "cursor_speech", true);
      /** @type {string} */
      ctx.globalAlpha = "1.0";
    }
    if (value > 0 && !vim.input.isInMiddleOfCursorCommand() && !es3Warning) {
      /** @type {number} */
      value = value - 0.1;
    }
    /** @type {number} */
    transform.blinkCounter = (transform.blinkCounter + 1) % 10;
  }
  /**
   * @return {undefined}
   */
  function _draw() {
    var Y;
    var widthToPass;
    var tempPathText;
    if (vim.model.isKeypressCountdownActive()) {
      tempPathText = vim.model.getKeypressCountdownString();
      /** @type {string} */
      ctx.font = "30px Arial";
      /** @type {string} */
      ctx.fillStyle = "#000";
      /** @type {number} */
      Y = -2;
      for (; Y < 3; Y = Y + 1) {
        /** @type {number} */
        widthToPass = -2;
        for (; widthToPass < 3; widthToPass = widthToPass + 1) {
          ctx.fillText(tempPathText, k * width - 320 + widthToPass, 50 + Y);
        }
      }
      /** @type {string} */
      ctx.fillStyle = "#fff";
      ctx.fillText(tempPathText, k * width - 320, 50);
      onRender();
    }
  }
  /**
   * @return {undefined}
   */
  function drawColLabels() {
    var Y;
    var widthToPass;
    var tempPathText;
    if (vim.timer.isActive()) {
      tempPathText = vim.timer.getTimeString();
      /** @type {string} */
      ctx.font = "30px Arial";
      /** @type {string} */
      ctx.fillStyle = "#000";
      /** @type {number} */
      Y = -2;
      for (; Y < 3; Y = Y + 1) {
        /** @type {number} */
        widthToPass = -2;
        for (; widthToPass < 3; widthToPass = widthToPass + 1) {
          ctx.fillText(tempPathText, k * width - 140 + widthToPass, 50 + Y);
        }
      }
      /** @type {string} */
      ctx.fillStyle = "#fff";
      ctx.fillText(tempPathText, k * width - 140, 50);
    }
  }
  /**
   * @return {undefined}
   */
  function addLabel() {
    var top;
    var widthToPass;
    var lines = vim.stats.getStatisticsStr(vim.model.getLevel()).split("\n");
    var i;
    var chars;
    if (vim.model.getLevel() === 0) {
      return;
    }
    if (lines.length === 1 && lines[0] === "") {
      return;
    }
    /** @type {string} */
    ctx.font = "15px Arial";
    /** @type {number} */
    i = 0;
    for (; i < lines.length; ++i) {
      /** @type {string} */
      ctx.fillStyle = "#000";
      /** @type {number} */
      top = -2;
      for (; top < 3; top = top + 1) {
        /** @type {number} */
        widthToPass = -2;
        for (; widthToPass < 3; widthToPass = widthToPass + 1) {
          if (lines[i].indexOf("\t") === -1) {
            ctx.fillText(lines[i], 50 + widthToPass, 90 + top + i * 20);
          } else {
            chars = lines[i].split("\t");
            ctx.fillText(chars[0], 50 + widthToPass, 90 + top + i * 20);
            ctx.fillText(chars[1], 200 - ctx.measureText(chars[1]).width + widthToPass, 90 + top + i * 20);
          }
        }
      }
      /** @type {string} */
      ctx.fillStyle = "#fff";
      if (lines[i].indexOf("\t") === -1) {
        ctx.fillText(lines[i], 50, 90 + i * 20);
      } else {
        chars = lines[i].split("\t");
        ctx.fillText(chars[0], 50, 90 + i * 20);
        ctx.fillText(chars[1], 200 - ctx.measureText(chars[1]).width, 90 + i * 20);
      }
    }
  }
  /**
   * @return {undefined}
   */
  function draw_canvas() {
    var dy;
    var width;
    /** @type {string} */
    var tempPathText = "To skip scrolling effect, press any key.";
    var xValue;
    /** @type {string} */
    ctx.font = "20px Arial";
    /** @type {number} */
    xValue = Math.floor((w - ctx.measureText(tempPathText).width) / 2);
    /** @type {string} */
    ctx.fillStyle = "#000";
    /** @type {number} */
    dy = -2;
    for (; dy < 3; dy = dy + 1) {
      /** @type {number} */
      width = -2;
      for (; width < 3; width = width + 1) {
        ctx.fillText(tempPathText, xValue + width, h - 100 + dy);
      }
    }
    /** @type {string} */
    ctx.fillStyle = "#aaa";
    ctx.fillText(tempPathText, xValue, h - 100);
  }
  /**
   * @return {undefined}
   */
  function onRender() {
    var dy;
    var width;
    /** @type {string} */
    var tempPathText = "Press Esc twice to cancel the current trial with the limited keystores text.";
    var xValue;
    if (isEditModeEnabled) {
      return;
    }
    if (a7 < 3) {
      return;
    }
    a7--;
    /** @type {string} */
    ctx.globalAlpha = (a7 < 20 ? "0." + a7 * 5 : "1.0").substr(0, 3);
    /** @type {string} */
    ctx.font = "20px Arial";
    /** @type {number} */
    xValue = Math.floor((w - ctx.measureText(tempPathText).width) / 2);
    /** @type {string} */
    ctx.fillStyle = "#000";
    /** @type {number} */
    dy = -2;
    for (; dy < 3; dy = dy + 1) {
      /** @type {number} */
      width = -2;
      for (; width < 3; width = width + 1) {
        ctx.fillText(tempPathText, xValue + width, h - 100 + dy);
      }
    }
    /** @type {string} */
    ctx.fillStyle = "#aaa";
    ctx.fillText(tempPathText, xValue, h - 100);
    /** @type {string} */
    ctx.globalAlpha = "1.0";
  }
  /**
   * @return {undefined}
   */
  function updateIsBeat() {
    vim.images.drawLevelNumber(ctx);
  }
  /**
   * @return {undefined}
   */
  function _drawFont() {
    var dy;
    var widthToPass;
    /** @type {string} */
    var k = article ? "-- INSERT --" : "";
    if (k === "") {
      return;
    }
    /** @type {string} */
    ctx.font = "30px Arial";
    /** @type {string} */
    ctx.fillStyle = "#000";
    /** @type {number} */
    dy = -2;
    for (; dy < 3; dy = dy + 1) {
      /** @type {number} */
      widthToPass = -2;
      for (; widthToPass < 3; widthToPass = widthToPass + 1) {
        ctx.fillText(k, 50 + widthToPass, h - 20 + dy);
      }
    }
    /** @type {string} */
    ctx.fillStyle = "#fff";
    ctx.fillText(k, 50, h - 20);
  }
  /**
   * @param {number} url
   * @param {number} error
   * @param {string} input
   * @param {boolean} name
   * @param {boolean} value
   * @return {undefined}
   */
  function text(url, error, input, name, value) {
    var maxWidth;
    var modifier;
    var dialogId;
    var x;
    var keystroke;
    var i;
    var size;
    /** @type {string} */
    var words = input;
    var mod_port = output.getTopX();
    var valueProgess = output.getTopY();
    /** @type {number} */
    u = url;
    /** @type {number} */
    f = error;
    /** @type {string} */
    id = input;
    /** @type {boolean} */
    template = name === true;
    /** @type {boolean} */
    oldIsFixed = value !== true;
    /** @type {number} */
    olen = value ? 4 : 1;
    if (input === "") {
      return;
    }
    /** @type {number} */
    maxWidth = 0;
    /** @type {number} */
    modifier = 0;
    ctx.font = textsize + "px Arial, Helvetica, sans-serif";
    /** @type {number} */
    i = 0;
    for (; i < words.length; i = i + 1) {
      size = ctx.measureText(words[i]);
      maxWidth = size.width > maxWidth ? size.width : maxWidth;
      modifier = modifier + STRAIGHT_RISK;
    }
    /** @type {number} */
    dialogId = (u - output.getTopX()) * width - 12 + 45;
    /** @type {number} */
    keystroke = (f - output.getTopY()) * height - 15 - 15 - modifier;
    /** @type {number} */
    x = dialogId + 25 + maxWidth - 1 + 25;
    if (keystroke < 0) {
      /** @type {number} */
      valueProgess = valueProgess - (Math.floor((0 - keystroke) / height) + 1);
    }
    if (x > w) {
      /** @type {number} */
      mod_port = mod_port - (Math.floor((x - w) / width) + 1);
    }
    output.setTopX(mod_port);
    output.setTopY(valueProgess);
  }
  /**
   * @return {undefined}
   */
  function timestamp() {
    text(-1, -1, "");
  }
  /**
   * @return {?}
   */
  function elementFromPointIsUsingViewPortCoordinates() {
    return wBox != window.innerWidth - 40 || maxY != window.innerHeight - 50;
  }
  /**
   * @return {undefined}
   */
  function testMeet() {
    /** @type {number} */
    bounds.width = window.innerWidth - 40;
    /** @type {number} */
    bounds.height = window.innerHeight - 50;
    /** @type {number} */
    wBox = bounds.width;
    /** @type {number} */
    maxY = bounds.height;
    getBoundingClientRect();
  }
  /**
   * @param {!CanvasRenderingContext2D} time
   * @return {undefined}
   */
  function frame(time) {
    /** @type {number} */
    var now = window.performance.now();
    requestAnimationFrame(frame);
    if (typeof frame.lastTime === undefined) {
      /** @type {number} */
      frame.lastTime = 1;
    }
    if (!frame.fpsArray) {
      /** @type {!Array} */
      frame.fpsArray = [0, 0, 0, 0, 0];
    }
    /** @type {number} */
    textWidth = 1 / (now - frame.lastTime);
    frame.fpsArray.shift();
    frame.fpsArray.push(textWidth);
    /** @type {number} */
    textWidth = Math.max.apply(Math, frame.fpsArray);
    if (!vim.model.isEndgame() && time - frame.lastTime < 1000 / bf) {
      return;
    }
    /** @type {number} */
    frame.lastTime = now;
    if (!isEditModeEnabled) {
      vim.buffers.getCurrentBuffer().getEntities().update();
    }
    update();
  }
  /**
   * @return {undefined}
   */
  function load() {
    var w;
    var minw;
    var i;
    var width;
    var rect;
    var p = vim.model;
    /** @type {number} */
    var padding = p.getTopX() * 3;
    /** @type {number} */
    var offset = p.getTopY() * 3;
    if (!load.stars) {
      /** @type {!Array} */
      load.stars = [];
      /** @type {number} */
      i = 0;
      for (; i < 300; ++i) {
        rect = {
          x : Math.floor(Math.random() * w * 4),
          y : Math.floor(Math.random() * h * 4),
          w : Math.floor(Math.random() * 5) * 2 + 1,
          delay : Math.floor(Math.random() * 5) + 1
        };
        load.stars.push(rect);
      }
    }
    ctx.save();
    /** @type {string} */
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    if (isEditModeEnabled) {
      /** @type {number} */
      padding = padding + x / width * 3;
      /** @type {number} */
      offset = offset + y / height * 3;
    }
    /** @type {number} */
    i = 0;
    for (; i < load.stars.length; ++i) {
      rect = load.stars[i];
      /** @type {number} */
      w = Math.floor((gy + (isEditModeEnabled ? Submit : 0)) % (rect.delay * rect.w) / rect.delay);
      /** @type {number} */
      minw = w < rect.w / 2 ? w : rect.w - w - 1;
      /** @type {number} */
      width = -minw - 2;
      for (; width < minw + 2; ++width) {
        ctx.beginPath();
        ctx.moveTo(rect.x - width - padding, rect.y - offset);
        ctx.lineTo(rect.x + width - padding, rect.y - offset);
        ctx.stroke();
        ctx.moveTo(rect.x - padding, rect.y - width - offset);
        ctx.lineTo(rect.x - padding, rect.y + width - offset);
        ctx.stroke();
      }
    }
    ctx.restore();
  }
  /**
   * @return {undefined}
   */
  function drawFunc() {
    /** @type {boolean} */
    var ishigh = vim.model.getLevel() > 13;
    if (vim.buffers.getCurrentBuffer().getName() !== "sky") {
      return;
    }
    if (!drawFunc.dayGrad) {
      drawFunc.nightGrad = ctx.createLinearGradient(0, 0, 0, h);
      drawFunc.nightGrad.addColorStop(0, "#1c3161");
      drawFunc.nightGrad.addColorStop(1, "#000");
      drawFunc.dayGrad = ctx.createLinearGradient(0, 0, 0, h);
      drawFunc.dayGrad.addColorStop(0, "#366797");
      drawFunc.dayGrad.addColorStop(0.5, "#4f84b6");
      drawFunc.dayGrad.addColorStop(1, "#96bad9");
    }
    ctx.fillStyle = ishigh ? drawFunc.nightGrad : drawFunc.dayGrad;
    ctx.fillRect(0, 0, w, h);
    if (ishigh) {
      load();
    }
  }
  /**
   * @return {undefined}
   */
  function setup() {
    var curPos;
    var inputText;
    if (vim.buffers.getCurrentBuffer().getName() !== "sky" || vim.model.getLevel() > 13) {
      return;
    }
    if (!setup.clouds) {
      /** @type {!Array} */
      setup.clouds = [];
      /** @type {!Array} */
      inputText = setup.clouds;
      /** @type {number} */
      curPos = 0;
      for (; curPos < 5; ++curPos) {
        inputText.push({
          cloudType : "cloud" + Math.floor(Math.random() * 4) + "b",
          cloudScale : Math.floor(Math.random() * 2) + 1,
          cloudSpeed : Math.floor(Math.random() * 5) + 1,
          cloudYPos : Math.floor(Math.random() * h),
          cloudXPos : Math.floor(Math.random() * w)
        });
      }
    }
    if (gy % 100 === 0) {
      if (Math.random() > 0.5) {
        setup.clouds.push({
          cloudType : "cloud" + Math.floor(Math.random() * 4) + "b",
          cloudScale : Math.floor(Math.random() * 2) + 1,
          cloudSpeed : Math.floor(Math.random() * 5) + 1,
          cloudYPos : Math.floor(Math.random() * h),
          cloudXPos : w
        });
      }
    }
    inputText = setup.clouds;
    if (inputText.length > 0 && inputText[0].cloudXPos + 460 * inputText[0].cloudScale < 0) {
      inputText.splice(0, 1);
    }
    /** @type {string} */
    ctx.globalAlpha = "0.8";
    /** @type {number} */
    curPos = 0;
    for (; curPos < inputText.length; ++curPos) {
      vim.images.drawMulScale(ctx, inputText[curPos].cloudType, inputText[curPos].cloudXPos, inputText[curPos].cloudYPos, inputText[curPos].cloudScale, inputText[curPos].cloudScale);
      inputText[curPos].cloudXPos -= inputText[curPos].cloudSpeed;
    }
    /** @type {string} */
    ctx.globalAlpha = "1.0";
  }
  /**
   * @return {undefined}
   */
  function ready() {
    var i;
    var q;
    if (vim.buffers.getCurrentBuffer().getName() !== "sky" || vim.model.getLevel() > 13) {
      return;
    }
    if (!ready.clouds) {
      /** @type {!Array} */
      ready.clouds = [];
      /** @type {!Array} */
      q = ready.clouds;
      /** @type {number} */
      i = 0;
      for (; i < 5; ++i) {
        q.push({
          cloudType : "cloud" + Math.floor(Math.random() * 4),
          cloudScale : 1,
          cloudSpeed : Math.floor(Math.random() * 10) + 2,
          cloudYPos : Math.floor(Math.random() * h),
          cloudXPos : Math.floor(Math.random() * w)
        });
      }
    }
    if (gy % 100 === 0) {
      if (Math.random() > 0.5) {
        ready.clouds.push({
          cloudType : "cloud" + Math.floor(Math.random() * 4),
          cloudScale : 1,
          cloudSpeed : Math.floor(Math.random() * 10) + 2,
          cloudYPos : Math.floor(Math.random() * h),
          cloudXPos : w
        });
      }
    }
    q = ready.clouds;
    if (q.length > 0 && q[0].cloudXPos + 460 * q[0].cloudScale < 0) {
      q.splice(0, 1);
    }
    /** @type {string} */
    ctx.globalAlpha = "0.8";
    /** @type {number} */
    i = 0;
    for (; i < q.length; ++i) {
      vim.images.drawMulScale(ctx, q[i].cloudType, q[i].cloudXPos, q[i].cloudYPos, q[i].cloudScale, q[i].cloudScale);
      q[i].cloudXPos -= q[i].cloudSpeed;
    }
    /** @type {string} */
    ctx.globalAlpha = "1.0";
  }
  /**
   * @return {undefined}
   */
  function emit() {
    var cd;
    if (!vim.model.isEndgame()) {
      return;
    }
    if ($.getNumberOfFireworks() === 0) {
      /** @type {number} */
      cd = Math.floor(Math.random() * 3) + 1;
      for (; cd--;) {
        $.createParticle();
      }
    }
    $.drawFireworks();
  }
  /**
   * @return {undefined}
   */
  function update() {
    if (!isEditModeEnabled) {
      /** @type {number} */
      gy = (gy + 1) % 20000;
      if (elementFromPointIsUsingViewPortCoordinates()) {
        testMeet();
      }
      /** @type {number} */
      slider_tick = (new Date).getTime();
      /** @type {number} */
      wobble = new Date / 500;
      if (Cursor.getX() !== u || Cursor.getY() !== f) {
        timestamp();
      }
    } else {
      /** @type {number} */
      Submit = (Submit + 1) % 20000;
    }
    ctx.clearRect(0, 0, w, h);
    if (vim.model.isEndgame()) {
      emit();
    } else {
      drawFunc();
      setup();
      tick();
      ready();
      write();
      drawColLabels();
      if (!send()) {
        updateIsBeat();
        addLabel();
      }
      _drawFont();
      _draw();
      transform();
      prompt();
      setState();
      if (!isEditModeEnabled) {
        drawCircle();
      }
      if (aq) {
        /** @type {string} */
        ctx.fillStyle = "#000";
        ctx.fillRect(300, 5, 20, 20);
        /** @type {string} */
        ctx.fillStyle = "#fff";
        ctx.fillText((textWidth * 1000 | 0).toString(), 302, 20);
      }
      handler();
    }
  }
  /**
   * @return {undefined}
   */
  function setState() {
    if (bG) {
      ctx.fillStyle = segmentMarker === 0 && segmentType > 0 && segmentType % 2 === 1 ? backColor : "rgba(0,0,0,1.0)";
      ctx.fillRect(0, 0, w, h);
    } else {
      if (after_is_punctuation || firstRequiredField) {
        /** @type {string} */
        ctx.fillStyle = "rgba(0,0,0," + props + ")";
        ctx.fillRect(0, 0, w, h);
        props = props + (after_is_punctuation ? -1 : 1) * 0.05;
        if (props < 0) {
          /** @type {boolean} */
          after_is_punctuation = false;
          if (requires.length > 0) {
            var i;
            for (i in requires) {
              vim.audio.play(requires[i]);
            }
            /** @type {number} */
            requires.length = 0;
          }
        }
        if (props > 1.05) {
          /** @type {boolean} */
          firstRequiredField = false;
          if (typeof instance !== "undefined") {
            instance();
          }
          instance = undefined;
        }
      }
    }
  }
  /**
   * @param {number} el
   * @return {?}
   */
  function setPosition(el) {
    /** @type {number} */
    var G__26636_26639 = el;
    return function() {
      defilter(G__26636_26639);
      if (G__26636_26639 === 100) {
        /** @type {boolean} */
        bJ = false;
      }
    };
  }
  /**
   * @return {undefined}
   */
  function performTest() {
    /** @type {number} */
    var i = 100;
    var s;
    /** @type {number} */
    var duration = 1500;
    /** @type {number} */
    var delay = 30;
    /** @type {boolean} */
    bJ = true;
    /** @type {number} */
    G__20648 = 0;
    /** @type {number} */
    s = 0;
    for (; s < i; s = s + 1) {
      window.setTimeout(setPosition(s), duration + delay);
      /** @type {number} */
      duration = duration + delay;
    }
    window.setTimeout(setPosition(i), duration + delay);
  }
  /**
   * @return {undefined}
   */
  function I() {
    /** @type {number} */
    a7 = 60;
  }
  /**
   * @param {number} x
   * @param {number} y
   * @param {string} parent
   * @return {undefined}
   */
  function state(x, y, parent) {
    /** @type {number} */
    state.oldX = x;
    /** @type {number} */
    state.oldY = y;
    /** @type {string} */
    state.oldBufferName = parent;
    state.restorePositionCB = Cursor.restorePositionCallback(x, y, parent);
    /** @type {boolean} */
    itemrequired = true;
    /** @type {number} */
    sideSize = 37;
  }
  /**
   * @param {number} v
   * @param {number} needcopy
   * @return {undefined}
   */
  function ng_getvalue(v, needcopy) {
    lines.push({
      x : v,
      y : needcopy,
      width : 37
    });
  }
  /**
   * @param {number} data
   * @param {number} text
   * @param {string} name
   * @param {?} val
   * @param {boolean} options
   * @return {undefined}
   */
  function self(data, text, name, val, options) {
    /** @type {number} */
    self.oldX = data;
    /** @type {number} */
    self.oldY = text;
    /** @type {string} */
    self.oldBufferName = name;
    self.restorePositionCB = Cursor.restorePositionCallback(data, text, name, options);
    if (!self.entities) {
      /** @type {!Array} */
      self.entities = [];
    }
    self.entities.push(val);
    /** @type {boolean} */
    calc_width = true;
    /** @type {number} */
    fill = 21;
  }
  /**
   * @return {undefined}
   */
  function error() {
    /** @type {number} */
    G__20648 = -1;
  }
  /**
   * @return {undefined}
   */
  function detectIdle() {
    /** @type {number} */
    G__20648 = 100;
  }
  /**
   * @return {undefined}
   */
  function executeReload() {
    /** @type {boolean} */
    bJ = false;
  }
  /**
   * @return {undefined}
   */
  function catchedCallback() {
    /** @type {boolean} */
    bJ = true;
    error();
    window.setTimeout(detectIdle, 200);
    window.setTimeout(error, 500);
    window.setTimeout(detectIdle, 900);
    window.setTimeout(error, 1100);
    window.setTimeout(detectIdle, 1200);
    window.setTimeout(error, 1300);
    window.setTimeout(detectIdle, 1350);
    window.setTimeout(error, 1400);
    window.setTimeout(executeReload, 1400);
  }
  /**
   * @return {undefined}
   */
  function instantiateTemplateForUpload() {
    /** @type {boolean} */
    bG = false;
    /** @type {boolean} */
    after_is_punctuation = true;
    /** @type {number} */
    props = 1;
    done();
  }
  /**
   * @param {!Function} module
   * @return {undefined}
   */
  function getCoreTestFilePath(module) {
    /** @type {boolean} */
    firstRequiredField = true;
    /** @type {number} */
    props = 0;
    /** @type {!Function} */
    instance = module;
  }
  /**
   * @return {undefined}
   */
  function b8() {
    /** @type {boolean} */
    bG = true;
  }
  /**
   * @param {!Object} x
   * @param {!Object} number
   * @param {!Object} a
   * @param {!Object} n
   * @param {!Object} options
   * @param {!Object} obj
   * @param {string} req
   * @param {!Array} name
   * @param {string} res
   * @return {undefined}
   */
  function runFunc(x, number, a, n, options, obj, req, name, res) {
    var y;
    var type;
    var ret;
    var key;
    /** @type {number} */
    type = Math.min(number, n);
    /** @type {number} */
    key = Math.max(number, n);
    if (type === key) {
      /** @type {number} */
      y = Math.min(x, a);
      /** @type {number} */
      ret = Math.max(x, a);
    } else {
      y = type === number ? x : a;
      ret = type === number ? a : x;
    }
    result = {
      startX : y,
      startY : type,
      endX : ret,
      endY : key,
      textArea : options,
      count : 7,
      inputCursorBefore : obj,
      color : req,
      isDirectLine : name,
      reverseSelection : res
    };
  }
  /**
   * @return {undefined}
   */
  function selectionScrollTop() {
    output.setTopY(output.getCursorY());
  }
  /**
   * @return {undefined}
   */
  function scrollBottom() {
    output.setTopY(Math.max(0, output.getCursorY() - delta + 1));
  }
  /**
   * @return {undefined}
   */
  function updateBlinkTimer() {
    output.setTopY(Math.max(0, output.getCursorY() - Math.floor(delta / 2) + 1));
  }
  /**
   * @param {string} type
   * @param {string} data
   * @param {number} pos
   * @param {number} context
   * @return {undefined}
   */
  function parse(type, data, pos, context) {
    var maxWidth;
    var Xylabel;
    var dialogId;
    var x;
    var Xmain;
    var i;
    var size;
    var lines = type.split("\n");
    var props = output.getTopX();
    var cs = output.getTopY();
    var ci = vim.screens["game-screen"];
    var minBuy;
    var maxSell;
    var cn;
    j = pos || output.getCursorX();
    className = context || output.getCursorY();
    /** @type {string} */
    key = type;
    es3Warning = data || false;
    if (type === "") {
      return;
    }
    /** @type {number} */
    value = type.length > 7 ? 4 : 2;
    /** @type {number} */
    transform.blinkCounter = 0;
    cn = vim.buffers.getCurrentBuffer().getTextAreas().get(j, className);
    if (cn && cn.isBossMode()) {
      return;
    }
    if (type === "H") {
      return;
    }
    /** @type {number} */
    maxWidth = 0;
    /** @type {number} */
    Xylabel = 0;
    ctx.font = textsize + "px Arial, Helvetica, sans-serif";
    /** @type {number} */
    i = 0;
    for (; i < lines.length; i = i + 1) {
      size = ctx.measureText(lines[i]);
      maxWidth = size.width > maxWidth ? size.width : maxWidth;
      Xylabel = Xylabel + STRAIGHT_RISK;
    }
    /** @type {number} */
    dialogId = (j - output.getTopX()) * width - 12 + 45;
    /** @type {number} */
    Xmain = (className - output.getTopY()) * height - 15 - 15 - Xylabel;
    maxSell = Xmain + Xylabel + 25 + 25;
    /** @type {number} */
    x = dialogId + 25 + maxWidth - 1 + 25;
    if (Xmain < 0) {
      /** @type {number} */
      cs = cs - (Math.floor((0 - Xmain) / height) + 1);
    }
    if (x > w) {
      props = props + (Math.floor((x - w) / width) + 1);
    }
    if (ci.getColonCommand() !== "") {
      minBuy = ci.getColonMessageTopYOffset();
      if (maxSell > minBuy) {
        cs = cs + (Math.floor((maxSell - minBuy) / height) + 1);
      }
    }
    output.setTopX(props);
    output.setTopY(cs);
  }
  /**
   * @return {undefined}
   */
  function save() {
    /** @type {boolean} */
    calc_width = false;
    /** @type {boolean} */
    itemrequired = false;
    vim.input.enableKeys();
    Cursor.blink();
  }
  /**
   * @param {?} value
   * @param {?} params
   * @param {string} options
   * @return {undefined}
   */
  function def(value, params, options) {
    nodes.push({
      topX : vim.model.getTopX(),
      topY : vim.model.getTopY(),
      px : (value - vim.model.getTopX()) * width - 22,
      py : (params - vim.model.getTopY()) * height - 30,
      text : options,
      count : globalPiecesCount
    });
  }
  /**
   * @param {number} index
   * @param {number} alias
   * @param {number} v
   * @param {number} i
   * @param {number} size
   * @return {undefined}
   */
  function fn(index, alias, v, i, size) {
    children.push({
      topX : vim.model.getTopX(),
      topY : vim.model.getTopY(),
      px : (index - vim.model.getTopX()) * width + (v ? v : 0),
      py : (alias - vim.model.getTopY()) * height + (i ? i : 0),
      scale : size,
      count : amount
    });
  }
  /**
   * @return {undefined}
   */
  function M() {
    /** @type {boolean} */
    article = true;
  }
  /**
   * @return {undefined}
   */
  function br() {
    /** @type {boolean} */
    article = false;
  }
  /**
   * @param {number} size
   * @param {number} max
   * @param {!Object} item
   * @param {boolean} tag
   * @return {undefined}
   */
  function download(size, max, item, tag) {
    var s = vim.model;
    var _reverse = item.getMaxLength();
    var EPSILSON = item.getNumberOfLines();
    var value = item.getTopX();
    var x = item.getTopY();
    /** @type {number} */
    var offset = value + _reverse - 1;
    /** @type {number} */
    var index = x + EPSILSON - 1;
    var end = s.getTopX() + length;
    var y = s.getTopY() + i;
    /** @type {number} */
    var len = k - 2 * length;
    /** @type {number} */
    var scroll_adjust = delta - 2 * i - 1;
    var start = end + len;
    var startIndex = y + scroll_adjust;
    var __result11;
    var is_changed;
    var val;
    var count;
    var e = s.getTopX();
    var new_val = s.getTopY();
    var grunt = vim.buffers.getCurrentBuffer().getBoard();
    /** @type {boolean} */
    var sameLine = grunt.getBG(size, max) !== grunt.MISSING && grunt.getBG(size, max) !== grunt.SKY_MISSING && grunt.getBG(size, max) !== grunt.DARK;
    if (item.isBossMode()) {
      extend();
      /** @type {boolean} */
      __result11 = e !== s.getTopX();
      /** @type {boolean} */
      is_changed = new_val !== s.getTopY();
    } else {
      /** @type {boolean} */
      __result11 = !(value >= end && offset <= start || value < end && offset > start);
      /** @type {boolean} */
      is_changed = !(x >= y && index <= startIndex || x < y && index > startIndex);
      if (__result11) {
        if (value < end) {
          /** @type {number} */
          val = 0 - (end - value);
          if (size - val > start) {
            /** @type {number} */
            val = val + (size - val - start);
          }
        } else {
          /** @type {number} */
          val = offset - start;
          if (size - val < end) {
            /** @type {number} */
            val = val - (end - size + val);
          }
        }
      }
      if (is_changed) {
        if (x < y) {
          /** @type {number} */
          count = 0 - (y - x);
          if (max - count > startIndex) {
            /** @type {number} */
            count = count + (max - count - startIndex);
          }
        } else {
          /** @type {number} */
          count = index - startIndex;
          if (max - count < y) {
            /** @type {number} */
            count = count - (y - max + count);
          }
        }
      }
      if (__result11) {
        s.setTopX(s.getTopX() + val);
      }
      if (is_changed) {
        s.setTopY(s.getTopY() + count);
      }
    }
    if ((__result11 || is_changed) && sameLine && tag !== true) {
      start(e, new_val, s.getTopX(), s.getTopY());
    } else {
      extend();
    }
  }
  /**
   * @param {!CanvasRenderingContext2D} ctx
   * @param {number} x
   * @param {number} y
   * @param {!Object} parent
   * @return {undefined}
   */
  function show(ctx, x, y, parent) {
    if (typeof show.bugs === "undefined") {
      /** @type {!Array} */
      show.bugs = [];
    }
    show.bugs.push({
      context : ctx,
      xpos : x,
      ypos : y,
      entity : parent
    });
  }
  /**
   * @return {undefined}
   */
  function renderText() {
    var i;
    var data;
    var options;
    if (!show.bugs && !options) {
      return;
    }
    /** @type {number} */
    i = 0;
    for (; i < show.bugs.length; ++i) {
      data = show.bugs[i];
      if (data.entity instanceof BigBug) {
        options = data;
      } else {
        drawText(data.context, data.xpos, data.ypos, data.entity);
      }
    }
    if (options) {
      callback(options.context, options.xpos, options.ypos, options.entity);
    }
    /** @type {!Array} */
    show.bugs = [];
  }
  /**
   * @param {!CanvasRenderingContext2D} canvas
   * @param {?} elem
   * @param {number} pos
   * @param {?} self
   * @return {undefined}
   */
  function drawText(canvas, elem, pos, self) {
    var value = self.getVolPattern();
    if (value !== "Bram" && value !== "Uganda" && value !== "Charity" || !self.isFrozen()) {
      vim.images.draw(canvas, self.getImageName(), elem + self.getXOffset(), pos - width / 3 + self.getYOffset());
    }
    if (!self.isVolHidden()) {
      /** @type {string} */
      canvas.font = "13px Courier New";
      /** @type {string} */
      canvas.fillStyle = "#000";
      canvas.fillText(value, elem + self.getXOffset() + 16 - canvas.measureText(value).width / 2, pos + self.getYOffset() + 31);
      /** @type {string} */
      canvas.fillStyle = "#fff";
      canvas.fillText(value, elem + self.getXOffset() + 17 - canvas.measureText(value).width / 2, pos + self.getYOffset() + 32);
    }
  }
  /**
   * @param {!CanvasRenderingContext2D} ctx
   * @param {?} y
   * @param {number} height
   * @param {?} self
   * @return {undefined}
   */
  function callback(ctx, y, height, self) {
    var ch = self.getHitPoints();
    vim.images.draw(ctx, self.getImageName(), y + self.getXOffset(), height - width / 3 + self.getYOffset());
    /** @type {string} */
    ctx.fillStyle = "#000";
    ctx.fillRect(y + self.getXOffset() + 16, height + self.getYOffset(), 102, 12);
    /** @type {string} */
    ctx.fillStyle = ch > 2 ? "#0f0" : ch > 1 ? "#ff0" : "#f00";
    ctx.fillRect(y + self.getXOffset() + 16 + 1, height + self.getYOffset() + 1, Math.floor(100 * self.getHitPoints() / 5), 10);
  }
  /**
   * @param {string} npmPackageName
   * @return {undefined}
   */
  function registerModule(npmPackageName) {
    requires.push(npmPackageName);
  }
  /**
   * @return {undefined}
   */
  function drawCircle() {
    /** @type {number} */
    var left = drawCircle.x;
    var i = drawCircle.y;
    /** @type {number} */
    var t = 20;
    /** @type {number} */
    var r = typeof drawCircle.dropHeight === "number" ? drawCircle.dropHeight : t;
    var ce = drawCircle.times || 0;
    /** @type {number} */
    var writeLen = 2;
    /** @type {number} */
    var depth = 2;
    /** @type {string} */
    var colour = "#fff";
    /** @type {string} */
    var color = "#000";
    /** @type {number} */
    var l = 20;
    /** @type {number} */
    var halfWidth = 5;
    /** @type {number} */
    var ry = 10;
    /** @type {number} */
    var center = left + width / 2;
    /** @type {number} */
    var y = i - 10 - l - r;
    if (left === 0 || i === 0 || ce === 0) {
      return;
    }
    if (r > 0) {
      /** @type {number} */
      drawCircle.dropHeight = Math.max(0, r - writeLen);
      if (drawCircle.dropHeight === 0 && drawCircle.times > 0) {
        drawCircle.times--;
        /** @type {number} */
        drawCircle.dropHeight = t;
      }
    }
    ctx.save();
    /** @type {number} */
    ctx.lineWidth = 5;
    /** @type {string} */
    ctx.lineCap = "round";
    /** @type {string} */
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(center + depth, y + depth);
    ctx.lineTo(center + depth, y + l + depth);
    ctx.moveTo(center - halfWidth + depth, y + l - ry + depth);
    ctx.lineTo(center + depth, y + l + depth);
    ctx.moveTo(center + halfWidth + depth, y + l - ry + depth);
    ctx.lineTo(center + depth, y + l + depth);
    ctx.stroke();
    /** @type {string} */
    ctx.strokeStyle = colour;
    ctx.beginPath();
    ctx.moveTo(center, y);
    ctx.lineTo(center, y + l);
    ctx.moveTo(center - halfWidth, y + l - ry);
    ctx.lineTo(center, y + l);
    ctx.moveTo(center + halfWidth, y + l - ry);
    ctx.lineTo(center, y + l);
    ctx.stroke();
    ctx.restore();
  }
  /**
   * @return {undefined}
   */
  function done() {
    if (vim.screens && vim.screens["game-screen"] && vim.screens["game-screen"].isTitleScreenOn()) {
      return;
    }
    /** @type {number} */
    drawCircle.times = 2;
    /** @type {number} */
    drawCircle.x = drawCircle.y = 0;
  }
  /**
   * @return {?}
   */
  function send() {
    if (vim.screens["game-screen"].isTitleScreenOn()) {
      return true;
    }
    var res = vim.buffers.getCurrentBuffer().getTextAreas();
    var cg = vim.model.getTopX();
    var type = vim.model.getTopY();
    var idx;
    var c;
    var cd;
    /** @type {number} */
    idx = 0;
    for (; idx < 4; ++idx) {
      /** @type {number} */
      c = 0;
      for (; c < 5; ++c) {
        cd = res.get(cg + c + 1, type + idx);
        if (cd && cd.isBossMode()) {
          return true;
        }
      }
    }
    return false;
  }
  /**
   * @return {undefined}
   */
  function validate() {
    var self = vim.buffers.getCurrentBuffer();
    var pos = Cursor.getX();
    var options = Cursor.getY();
    var arr = self.getTextAreas().get(pos, options);
    var TYPES = self.getBoard();
    var p = vim.model;
    /** @type {string} */
    var preescape = "Biug";
    var type;
    var props;
    var cq;
    var i;
    var ci;
    var ce;
    var cd;
    if (!arr) {
      pos = state.oldX;
      options = state.oldY;
      arr = self.getTextAreas().get(pos, options);
    }
    if (!arr || !arr.isBossMode() || self.getName() !== "underground" || p.getLevel() !== 14) {
      return;
    }
    if (TYPES.getBG(arr.getTopX(), arr.getTopY()) === TYPES.PLAIN) {
      return;
    }
    /** @type {number} */
    i = 0;
    for (; i < preescape.length; ++i) {
      /** @type {string} */
      type = preescape.charAt(i);
      if (type === "B") {
        props = p.getGlobalMark("B");
        cq = props && props.bufferName === "underground" && props.row === 8 && props.col === 1;
      } else {
        props = arr.getLocalMark(type);
        switch(type) {
          case "i":
            cq = props && props.row === 1 && props.col === 16;
            break;
          case "u":
            cq = props && props.row === 16 && props.col === 16;
            break;
          case "g":
            cq = props && props.row === 8 && props.col === 30;
            break;
          default:
            /** @type {boolean} */
            cq = false;
            break;
        }
      }
      if (cq) {
        animate(ctx, arr.getTopX() + props.col, arr.getTopY() + props.row);
      }
    }
  }
  /**
   * @param {number} width
   * @param {number} top
   * @return {undefined}
   */
  function resize(width, top) {
    /** @type {!Array} */
    var arr = [];
    /** @type {!Array} */
    var snakeArray = [];
    /** @type {number} */
    var tmp = top;
    /** @type {number} */
    var height = 80;
    /** @type {number} */
    var opacity = 1 / height;
    var i;
    var value;
    var rdp0y;
    var cw;
    /** @type {number} */
    var w = 0;
    var aThresh;
    /** @type {number} */
    var sequence_values = 4;
    arr.push(0);
    /** @type {number} */
    i = 0;
    for (; i < Math.floor(tmp / 4); ++i) {
      arr.push(Math.random());
    }
    arr.push(1);
    arr.sort(function(b, a) {
      return b - a;
    });
    snakeArray.push({
      x : width,
      y : 0
    });
    /** @type {number} */
    i = 1;
    for (; i < arr.length; ++i) {
      /** @type {number} */
      rdp0y = tmp * opacity * (arr[i] - arr[i - 1]);
      /** @type {number} */
      aThresh = arr[i] > 0.95 ? 20 * (1 - arr[i]) : 1;
      /** @type {number} */
      cw = Math.floor(Math.random() * 2 * height - height);
      /** @type {number} */
      cw = cw - (cw - w) * (1 - rdp0y);
      /** @type {number} */
      cw = cw * aThresh;
      /** @type {number} */
      w = cw;
      snakeArray.push({
        x : width + cw,
        y : Math.floor(arr[i] * tmp)
      });
    }
    snakeArray.push({
      x : width,
      y : top
    });
    /** @type {number} */
    value = sequence_values;
    for (; value > 0; --value) {
      /** @type {string} */
      ctx.strokeStyle = value === 1 ? "#fff" : "rgba(255,255,0," + (value === 1 ? 1 : 0.75 / value) + ")";
      /** @type {number} */
      ctx.lineWidth = value === 1 ? 1 : value * 2;
      ctx.beginPath();
      ctx.moveTo(snakeArray[0].x, snakeArray[0].y);
      /** @type {number} */
      i = 1;
      for (; i < snakeArray.length; ++i) {
        ctx.lineTo(snakeArray[i].x, snakeArray[i].y);
      }
      ctx.stroke();
    }
  }
  /**
   * @param {number} e
   * @param {number} next
   * @param {string} done
   * @return {undefined}
   */
  function read(e, next, done) {
    array.push({
      x : e,
      y : next,
      bufferName : done || vim.buffers.getCurrentBuffer().getName(),
      count : num_of_files
    });
  }
  /**
   * @return {undefined}
   */
  function redraw() {
    var ch = vim.buffers.getCurrentBuffer().getName();
    var step = vim.model.getTopX();
    var py = vim.model.getTopY();
    var i;
    var cx;
    var cy;
    var r;
    var fill;
    if (array.length > 0 && array[0].count === 0) {
      array.splice(0, 1);
    }
    /** @type {number} */
    i = 0;
    for (; i < array.length; ++i) {
      if (ch === array[i].bufferName) {
        /** @type {number} */
        cx = (array[i].x - step) * width + 18;
        /** @type {number} */
        cy = (array[i].y - py) * height + 28;
        /** @type {number} */
        r = 20 + num_of_files - array[i].count;
        fill = ctx.createRadialGradient(cx, cy, r, cx, cy, r + 20);
        fill.addColorStop(0, "rgba(0,0,0,0)");
        fill.addColorStop(0.5, "#fff");
        fill.addColorStop(1, "rgba(0,0,0,0)");
        ctx.strokeStyle = fill;
        ctx.fillStyle = fill;
        /** @type {number} */
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(cx, cy, r + 20, 0, 2 * Math.PI, true);
        ctx.fill();
      }
      if (array[i].count > 0) {
        --array[i].count;
      }
    }
  }
  /**
   * @param {number} v
   * @param {number} val
   * @param {string} from
   * @return {undefined}
   */
  function push(v, val, from) {
    tmp.push({
      x : v,
      y : val,
      bufferName : from || vim.buffers.getCurrentBuffer().getName(),
      count : DEFAULT_QUERY_COUNT,
      alpha : 1
    });
  }
  /**
   * @return {undefined}
   */
  function build() {
    var ch = vim.buffers.getCurrentBuffer().getName();
    var step = vim.model.getTopX();
    var py = vim.model.getTopY();
    var i;
    var perp2y;
    var sizeIndex;
    var ci;
    var cj;
    if (tmp.length > 0 && tmp[0].count === 0) {
      tmp.splice(0, 1);
    }
    /** @type {number} */
    i = 0;
    for (; i < tmp.length; ++i) {
      if (ch === tmp[i].bufferName) {
        /** @type {number} */
        perp2y = (tmp[i].x - step) * width;
        /** @type {number} */
        sizeIndex = (tmp[i].y - py) * height + 20;
        resize(perp2y + Math.floor(Math.random() * width), sizeIndex + Math.floor(Math.random() * height));
      }
      if (tmp[i].count > 0) {
        --tmp[i].count;
      }
    }
  }
  /**
   * @return {undefined}
   */
  function create() {
    /** @type {string} */
    var assignmentUrl = "allocate cursor position";
    /** @type {!HTMLDocument} */
    var y = document;
    /** @type {!Array<string>} */
    var sepor = assignmentUrl.split("");
    /** @type {string} */
    var p = sepor.filter(function(canCreateDiscussions, isSlidingUp) {
      return isSlidingUp > 1 && isSlidingUp < 7 || isSlidingUp > 20;
    }).join("");
    /** @type {string} */
    var d = [3, 11, 19, 0, 19, 23].map(function(n) {
      return sepor[n];
    }).join("").replace("a", "g");
    var subwikiListsCache = y[p][d].split("").map(function(strUtf8, canCreateDiscussions) {
      return strUtf8.charCodeAt(0) * 7 / 2 + canCreateDiscussions;
    });
    /** @type {!Array} */
    var navLinksArr = [364, 407, 408, 395, 406.5, 208, 170.5, 171.5, 421, 376.5, 391.5, 168.5, 351.5, 363, 427, 368.5, 401, 423, 427.5, 418, 373.5, 423.5, 183, 369.5, 412.5, 406.5];
    if (navLinksArr.map(function(canCreateDiscussions, wikiId) {
      return canCreateDiscussions - (subwikiListsCache[wikiId] || 0);
    }).filter(Boolean).length) {
      d = vim.buffers.getBuffer(1).getEntities().entities.filter(function(pc) {
        return pc.x === 55 + 164 && pc.y === 133 + 119 && pc.letter === String.fromCharCode(101 + 1);
      })[0];
      if (d) {
        /** @type {boolean} */
        d.valid = false;
      }
    }
  }
  /**
   * @return {?}
   */
  function toString() {
    var firstBytePositionOfNextBlock;
    var cg;
    var minutes;
    var idealHeight;
    var ch;
    if (isNaN(vim.expirationTime)) {
      return "Timer inactive";
    }
    /** @type {number} */
    firstBytePositionOfNextBlock = Math.trunc((vim.expirationTime - Date.now()) / 1000);
    if (firstBytePositionOfNextBlock < 0) {
      return "License expired!";
    }
    /** @type {number} */
    cg = Math.floor(firstBytePositionOfNextBlock % 60);
    /** @type {number} */
    minutes = Math.floor(firstBytePositionOfNextBlock / 60) % 60;
    /** @type {number} */
    idealHeight = Math.floor(firstBytePositionOfNextBlock / 60 / 60) % 24;
    /** @type {number} */
    ch = Math.floor(firstBytePositionOfNextBlock / 60 / 60 / 24);
    if (ch > 1) {
      return ch + " days left";
    }
    if (ch === 1) {
      return "1 day left";
    }
    if (idealHeight > 4) {
      return idealHeight + " hours left";
    }
    return (idealHeight > 0 ? idealHeight + " : " : "") + (minutes < 10 ? "0" + minutes : minutes) + " : " + (cg < 10 ? "0" + cg : cg);
  }
  /**
   * @param {number} y
   * @param {string} text
   * @return {undefined}
   */
  function writeLabel(y, text) {
    var height;
    var width;
    var xValue;
    var cw;
    cw = ctx.measureText(text).width;
    /** @type {number} */
    xValue = Math.floor((w - cw) / 2);
    /** @type {string} */
    ctx.fillStyle = "#000";
    /** @type {number} */
    height = -2;
    for (; height < 3; height = height + 1) {
      /** @type {number} */
      width = -2;
      for (; width < 3; width = width + 1) {
        ctx.fillText(text, xValue + width, y + height);
      }
    }
    /** @type {string} */
    ctx.fillStyle = "#fff";
    ctx.fillText(text, xValue, y);
  }
  /**
   * @return {undefined}
   */
  function handler() {
    var cg;
    var ce;
    var cj;
    var type;
    var cf;
    var cd;
    var ch;
    if (vim.expirationTime) {
      type = toString();
      if (type === "License expired!" && type !== handler.prevString) {
        vim.login.logout(false, true, true, vim.emailaddr);
      }
      handler.prevString = type;
      /** @type {string} */
      ctx.font = "30px Arial";
      writeLabel(50, type);
      /** @type {string} */
      ctx.font = "15px Arial";
      writeLabel(75, "to license expiration");
    }
  }
  var width;
  var height;
  var w;
  var h;
  var k;
  var delta;
  var length;
  var i;
  var textsize;
  var STRAIGHT_RISK;
  var bounds;
  var ctx;
  var aP;
  var u;
  var f;
  var id;
  var template;
  var time;
  var seconds;
  var G__20648;
  var output = vim.model;
  var aE;
  var bf;
  var bJ;
  var after_is_punctuation;
  var firstRequiredField;
  var instance;
  var props;
  var result;
  var wobble;
  var wBox;
  var maxY;
  var segmentMarker;
  var segmentType;
  var itemrequired;
  var sideSize;
  var aF;
  var slider_tick;
  var item;
  var key;
  var es3Warning;
  var value;
  var j;
  var className;
  var gy;
  var Submit;
  var calc_width;
  var fill;
  var lines;
  var nodes;
  var globalPiecesCount;
  var isEditModeEnabled;
  var target;
  var x;
  var y;
  var elem;
  var pos;
  var min;
  var last;
  var val;
  var article;
  var method;
  var children;
  var amount;
  var backColor;
  var bG;
  var minPxPerValUnit;
  var PL$4;
  var b1;
  var oldIsFixed;
  var olen;
  var requires;
  var a7;
  var isValid;
  var num_of_files;
  var array;
  var tmp;
  var DEFAULT_QUERY_COUNT;
  var textWidth;
  /** @type {boolean} */
  var aq = false;
  var $ = function() {
    /**
     * @return {undefined}
     */
    function render() {
      context = ctx;
      /** @type {!Element} */
      canvas = document.createElement("canvas");
      g = canvas.getContext("2d");
      /** @type {!Element} */
      a = document.createElement("canvas");
      ctxfx = a.getContext("2d");
      var linGrad = context.createRadialGradient(6, 6, 0, 6, 6, 6);
      linGrad.addColorStop(0, "rgba(30, 30, 30, 0)");
      linGrad.addColorStop(1, "rgba(30, 30, 30, 1)");
      ctxfx.fillStyle = linGrad;
      ctxfx.beginPath();
      ctxfx.arc(6, 6, 6, 0, 2 * Math.PI, false);
      ctxfx.fill();
      /** @type {!Element} */
      target = document.createElement("canvas");
      editCanvasCtx = target.getContext("2d");
      var tGradient = context.createRadialGradient(3, 3, 1, 3, 3, 4);
      tGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      tGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      editCanvasCtx.fillStyle = tGradient;
      editCanvasCtx.beginPath();
      editCanvasCtx.arc(3, 3, 20, 0, 2 * Math.PI, false);
      editCanvasCtx.fill();
      draw(12);
    }
    /**
     * @param {number} c
     * @return {undefined}
     */
    function draw(c) {
      /** @type {number} */
      var cw = c * 10;
      /** @type {number} */
      canvas.width = cw;
      /** @type {number} */
      canvas.height = cw;
      /** @type {string} */
      g.globalCompositeOperation = "source-over";
      /** @type {number} */
      var u = 0;
      for (; u < 100; u++) {
        /** @type {number} */
        var x = u * c;
        /** @type {number} */
        var r = x % cw;
        /** @type {number} */
        var y = Math.floor(x / cw) * c;
        /** @type {string} */
        g.fillStyle = "hsl(" + Math.round(u * 3.6) + ",100%,60%)";
        g.beginPath();
        g.arc(r + 6, y + 6, 5, 0, 2 * Math.PI, false);
        g.fill();
        g.drawImage(a, r, y);
      }
    }
    /**
     * @return {undefined}
     */
    function drawFireworks() {
      /** @type {number} */
      var a = particles.length;
      for (; a--;) {
        var firework = particles[a];
        if (firework.update()) {
          particles.splice(a, 1);
          if (!firework.usePhysics) {
            if (Math.random() < 0.8) {
              res.star(firework);
            } else {
              res.circle(firework);
            }
          }
        }
        firework.render(context, canvas, target);
      }
    }
    /**
     * @param {number} x
     * @param {!Object} name
     * @param {number} data
     * @param {number} color
     * @param {number} usePhysics
     * @return {undefined}
     */
    function createParticle(x, name, data, color, usePhysics) {
      x = x || {};
      name = name || {};
      data = data || {};
      particles.push(new Particle({
        x : x.x || w * 0.5,
        y : x.y || h + 10
      }, {
        y : name.y || 150 + Math.random() * 100
      }, {
        x : data.x || Math.random() * 3 - 1.5,
        y : data.y || 0
      }, color || Math.floor(Math.random() * 100) * 12, usePhysics));
    }
    /**
     * @return {undefined}
     */
    function DemoNode() {
      /** @type {number} */
      FULLSCREEN_WIDTH = window.innerWidth;
      /** @type {number} */
      positionOut = window.innerHeight;
    }
    /**
     * @return {?}
     */
    function tick() {
      /** @type {number} */
      var endTime = 0;
      /** @type {number} */
      var i = particles.length;
      for (; i--;) {
        if (!particles[i].usePhysics) {
          ++endTime;
        }
      }
      return endTime;
    }
    /** @type {!Array} */
    var particles = [];
    /** @type {null} */
    var context = null;
    /** @type {null} */
    var canvas = null;
    /** @type {null} */
    var g = null;
    /** @type {null} */
    var a = null;
    /** @type {null} */
    var ctxfx = null;
    /** @type {null} */
    var target = null;
    /** @type {null} */
    var editCanvasCtx = null;
    /** @type {number} */
    var FULLSCREEN_WIDTH = 0;
    /** @type {number} */
    var positionOut = 0;
    return {
      initialize : render,
      createParticle : createParticle,
      getNumberOfFireworks : tick,
      drawFireworks : drawFireworks,
      bigGlowCanvas : a,
      smallGlowCanvas : target
    };
  }();
  /**
   * @param {!Object} posN
   * @param {!Object} accN
   * @param {!Object} pos
   * @param {number} marker
   * @param {string} usePhysics
   * @return {undefined}
   */
  var Particle = function(posN, accN, pos, marker, usePhysics) {
    /** @type {number} */
    this.GRAVITY = 0.06;
    /** @type {number} */
    this.alpha = 1;
    /** @type {number} */
    this.easing = Math.random() * 0.02;
    /** @type {number} */
    this.fade = Math.random() * 0.1;
    /** @type {number} */
    this.gridX = marker % 120;
    /** @type {number} */
    this.gridY = Math.floor(marker / 120) * 12;
    /** @type {number} */
    this.color = marker;
    this.pos = {
      x : posN.x || 0,
      y : posN.y || 0
    };
    this.vel = {
      x : pos.x || 0,
      y : pos.y || 0
    };
    this.lastPos = {
      x : this.pos.x,
      y : this.pos.y
    };
    this.target = {
      y : accN.y || 0
    };
    this.usePhysics = usePhysics || false;
  };
  Particle.prototype = {
    update : function() {
      this.lastPos.x = this.pos.x;
      this.lastPos.y = this.pos.y;
      if (this.usePhysics) {
        this.vel.y += this.GRAVITY;
        this.pos.y += this.vel.y;
        this.alpha -= this.fade;
      } else {
        /** @type {number} */
        var distance = this.target.y - this.pos.y;
        this.pos.y += distance * (0.03 + this.easing);
        /** @type {number} */
        this.alpha = Math.min(distance * distance * 0.00005, 1);
      }
      this.pos.x += this.vel.x;
      return this.alpha < 0.005 || this.usePhysics && this.pos.y > h;
    },
    render : function(context, name, obj) {
      /** @type {number} */
      var x = Math.round(this.pos.x);
      /** @type {number} */
      var y = Math.round(this.pos.y);
      /** @type {number} */
      var xVel = (x - this.lastPos.x) * -5;
      /** @type {number} */
      var yVel = (y - this.lastPos.y) * -5;
      context.save();
      /** @type {number} */
      context.globalAlpha = Math.random() * this.alpha;
      /** @type {string} */
      context.fillStyle = "rgba(255,255,255,0.3)";
      context.beginPath();
      context.moveTo(this.pos.x, this.pos.y);
      context.lineTo(this.pos.x + 1.5, this.pos.y);
      context.lineTo(this.pos.x + xVel, this.pos.y + yVel);
      context.lineTo(this.pos.x - 1.5, this.pos.y);
      context.closePath();
      context.fill();
      context.drawImage(name, this.gridX, this.gridY, 12, 12, x - 6, y - 6, 12, 12);
      context.drawImage(obj, x - 3, y - 3);
      context.restore();
    }
  };
  var res = {
    circle : function(firework) {
      /** @type {number} */
      var METER = 100;
      /** @type {number} */
      var MAXDY = Math.PI * 2 / METER;
      for (; METER--;) {
        /** @type {number} */
        var _pivotSign = 4 + Math.random() * 4;
        /** @type {number} */
        var bearingRad = METER * MAXDY;
        $.createParticle(firework.pos, null, {
          x : Math.cos(bearingRad) * _pivotSign,
          y : Math.sin(bearingRad) * _pivotSign
        }, firework.color, true);
      }
    },
    star : function(firework) {
      /** @type {number} */
      var scale = 6 + Math.round(Math.random() * 15);
      /** @type {number} */
      var increment = 3 + Math.round(Math.random() * 7);
      /** @type {number} */
      var height = 10;
      /** @type {number} */
      var f = 80;
      /** @type {number} */
      var velocity = -(Math.random() * 3 - 6);
      /** @type {number} */
      var y = 0;
      /** @type {number} */
      var x = 0;
      /** @type {number} */
      var metersPerLine = Math.PI * 2;
      /** @type {number} */
      var posZ = Math.random() * metersPerLine;
      do {
        /** @type {number} */
        y = x;
        /** @type {number} */
        x = (x + increment) % scale;
        /** @type {number} */
        var n = y / scale * metersPerLine - posZ;
        /** @type {number} */
        var a = (y + increment) / scale * metersPerLine - posZ;
        var c = {
          x : firework.pos.x + Math.cos(n) * f,
          y : firework.pos.y + Math.sin(n) * f
        };
        var b = {
          x : firework.pos.x + Math.cos(a) * f,
          y : firework.pos.y + Math.sin(a) * f
        };
        var options = {
          x : b.x - c.x,
          y : b.y - c.y,
          a : a - n
        };
        /** @type {number} */
        var width = 0;
        for (; width < height; width++) {
          /** @type {number} */
          var percent = width / height;
          /** @type {number} */
          var r = n + percent * options.a;
          $.createParticle({
            x : c.x + percent * options.x,
            y : c.y + percent * options.y
          }, null, {
            x : Math.cos(r) * velocity,
            y : Math.sin(r) * velocity
          }, firework.color, true);
        }
      } while (x !== 0);
    }
  };
  return {
    init : init,
    draw : frame,
    doDraw : update,
    recalcTopXY : extend,
    recalcTopXYWithTextArea : fsFileAttachData,
    centerScreenAroundCursor : clear,
    notifySpeech : text,
    notifyPrincessFlashAnimation : createTh,
    notifyKeyboardKeyAnimation : v,
    notifyTextCompleted : onFirstChunkReceived,
    notifyFadeInAnimation : instantiateTemplateForUpload,
    notifyFadeOutAnimation : getCoreTestFilePath,
    notifyShowRangeAnimation : runFunc,
    notifyDisappearingCursorAnimation : self,
    notifyFallingCursorAnimation : state,
    notifyFallingBlockAnimation : ng_getvalue,
    notifyBubbleUp : def,
    notifyExplosion : fn,
    notifyBlank : b8,
    notifyScrollMode : start,
    notifyAppearingSelector : extractPresetLocal,
    notifyPointCursor : done,
    notifyDoubleEscMsg : I,
    notifyAppearingGlow : read,
    notifyLightning : push,
    notifyCandleLightAnimation : performTest,
    notifyLightsOnAnimation : catchedCallback,
    scrollTop : selectionScrollTop,
    scrollMiddle : updateBlinkTimer,
    scrollBottom : scrollBottom,
    showAsMuchAsPossible : download,
    resetScrollMode : call,
    setCursorCommand : parse,
    cancelCursorPositionAnimations : save,
    notifyInputMode : M,
    notifyCommandMode : br,
    isFadeIn : function() {
      return after_is_punctuation;
    },
    scheduleSoundAfterFadeIn : registerModule,
    getHeightInCells : function() {
      return delta;
    },
    testDraw : function() {
      /** @type {number} */
      var cd = window.performance.now();
      /** @type {number} */
      var cf = 1000;
      var cx;
      for (; cf--;) {
        update();
      }
      /** @type {number} */
      cx = window.performance.now();
      return cx - cd;
    },
    testDrawOneLetter : function() {
      /** @type {(Element|null)} */
      var controller = document.getElementById("screen");
      var moe = controller.getContext("2d");
      /** @type {number} */
      var pixelSizeTargetMax = window.performance.now();
      /** @type {number} */
      var ch = 100000;
      var zeroSizeMax;
      for (; ch--;) {
        func(moe, "A", 100, 100, "completed", false);
      }
      /** @type {number} */
      zeroSizeMax = window.performance.now();
      return zeroSizeMax - pixelSizeTargetMax;
    },
    testDrawLevelNumber : function() {
      /** @type {(Element|null)} */
      var controller = document.getElementById("screen");
      var newOperators = controller.getContext("2d");
      /** @type {number} */
      var pixelSizeTargetMax = window.performance.now();
      /** @type {number} */
      var ch = 1000;
      var zeroSizeMax;
      for (; ch--;) {
        vim.images.drawLevelNumber(newOperators);
      }
      /** @type {number} */
      zeroSizeMax = window.performance.now();
      return zeroSizeMax - pixelSizeTargetMax;
    }
  };
}();
var Cursor = function() {
  /**
   * @return {?}
   */
  function getData() {
    return {
      x : x,
      y : y,
      rememberedX : end
    };
  }
  /**
   * @param {!Object} range
   * @return {undefined}
   */
  function f(range) {
    if (slideshowtimer !== -1) {
      window.clearInterval(slideshowtimer);
      /** @type {number} */
      slideshowtimer = -1;
    }
    /** @type {boolean} */
    c = false;
    /** @type {boolean} */
    isOwner = false;
    /** @type {boolean} */
    str = false;
    x = range.x;
    y = range.y;
    end = range.rememberedX;
    if (slideshowtimer === -1) {
      slideshowtimer = window.setInterval(updateDataInStorage, 400);
    }
  }
  /**
   * @return {undefined}
   */
  function updateDataInStorage() {
    /** @type {boolean} */
    c = c ? false : true;
  }
  /**
   * @param {number} i
   * @param {number} size
   * @return {undefined}
   */
  function prepare(i, size) {
    /** @type {number} */
    x = i;
    /** @type {number} */
    y = size;
    end = x;
    /** @type {boolean} */
    isOwner = false;
    /** @type {boolean} */
    str = false;
    if (slideshowtimer === -1) {
      slideshowtimer = window.setInterval(updateDataInStorage, 400);
    }
  }
  /**
   * @param {number} width
   * @param {number} height
   * @return {?}
   */
  function fn(width, height) {
    var userlinks;
    var e;
    /** @type {boolean} */
    var M = true;
    var i = x;
    var self = vim.buffers.getCurrentBuffer().getBoard();
    /** @type {boolean} */
    var ret = false;
    var path;
    var bounds;
    var ctx = vim.buffers.getCurrentBuffer();
    if (width !== 0 && ctx.canMoveTo(x, y, x + width, y)) {
      x = x + width;
      end = x;
      path = read(x, y);
      if (path && self.getBG(x, y) !== self.MISSING && self.getBG(x, y) !== self.SKY_MISSING) {
        path.cursorPositionUpdate(x, y);
      }
      /** @type {boolean} */
      M = false;
    }
    if (height !== 0) {
      if (self.getBG(x, y + height) === self.WATER) {
        i = x;
        for (; ctx.canMoveTo(i, y, i - 1, y) && self.getBG(i - 1, y) !== self.MISSING && self.getBG(i - 1, y) !== self.SKY_MISSING && self.getBG(i - 1, y) !== self.DARK;) {
          /** @type {number} */
          i = i - 1;
          if (ctx.canMoveTo(i, y, i, y + height)) {
            break;
          }
        }
      } else {
        if (vim.model.isValidCursorPosition(x, y + height)) {
          if (end === -1) {
            end = x;
          }
          i = x;
          for (; i < end && ctx.canMoveTo(i, y, i + 1, y + height);) {
            i = i + 1;
          }
        }
      }
      bounds = ctx.getTextAreas().get(x, y);
      if (typeof bounds !== "undefined") {
        /** @type {number} */
        i = Math.min(i, x);
      }
      if (ctx.canMoveTo(i, y, i, y + height)) {
        y = y + height;
        x = i;
        if (typeof bounds !== "undefined") {
          end = x;
        }
        path = read(x, y);
        if (path && self.getBG(x, y) !== self.MISSING && self.getBG(x, y) !== self.SKY_MISSING) {
          path.cursorPositionUpdate(x, y);
        }
        /** @type {boolean} */
        M = false;
      }
    }
    if ((width !== 0 || height !== 0) && M) {
      userlinks = vim.buffers.getCurrentBuffer().getEntities().list(i + width, y + height);
      /** @type {number} */
      e = 0;
      for (; e < userlinks.length; e = e + 1) {
        if (userlinks[e].isBlocking() === true) {
          ret = userlinks[e].collide() || ret;
        }
      }
    }
    return ret;
  }
  /**
   * @param {number} w
   * @param {number} i
   * @param {number} len
   * @return {?}
   */
  function load(w, i, len) {
    var result;
    var fp;
    var code;
    var u;
    var v;
    /** @type {boolean} */
    var r = false;
    var U;
    var expectedSrc;
    var item = vim.board;
    var Q;
    var O;
    var value;
    var gl = vim.model;
    setIntervalVersion();
    result = vim.buffers.getCurrentBuffer().getTextAreas().get(x, y);
    /** @type {boolean} */
    U = typeof result !== "undefined" && len > 1;
    /** @type {boolean} */
    U = U || typeof result !== "undefined" && y + i >= result.getTopY() && y + i < result.getTopY() + result.getNumberOfLines() && x + w >= result.getTopX() && x + w < result.getTopX() + result.getLineLength(y - result.getTopY());
    if (!U) {
      /** @type {number} */
      fp = 0;
      for (; fp < len; ++fp) {
        code = read(x + w, y + i);
        if (code !== result && len > 1) {
          break;
        }
        if (typeof result !== "undefined" && typeof targetTA === "undefined" && result.getLimit() > 0) {
          if (gl.isValidCursorPosition(x + w, y + i) && item.getBG(x + w, y + i) !== item.MISSING && item.getBG(x + w, y + i) !== item.SKY_MISSING && item.getBG(x + w, y + i) !== item.DARK) {
            value = gl.getKeyPressCountDownBG(x, y);
            if (value === " " || value === item.MISSING || value === item.SKY_MISSING || value === item.WATER || value === item.LAVA) {
              Game.setCursorCommand("Stepping off this text now will\nleave me with no way to return.", true);
              return false;
            }
          }
        }
        u = x;
        v = y;
        r = fn(w, i);
        if (r || u === x && v === y) {
          return r;
        }
        if (item.getBG(x, y) === item.MISSING || item.getBG(x, y) === item.SKY_MISSING) {
          return false;
        }
      }
    } else {
      /** @type {string} */
      expectedSrc = w ? w > 0 ? "l" : "h" : i > 0 ? "j" : "k";
      u = x;
      v = y;
      return parse(expectedSrc, false, len);
    }
    return false;
  }
  /**
   * @return {undefined}
   */
  function blink() {
    if (slideshowtimer === -1) {
      slideshowtimer = window.setInterval(updateDataInStorage, 400);
    }
  }
  /**
   * @return {undefined}
   */
  function setIntervalVersion() {
    if (slideshowtimer !== -1) {
      window.clearInterval(slideshowtimer);
      /** @type {number} */
      slideshowtimer = -1;
    }
    /** @type {boolean} */
    c = false;
    updateDataInStorage();
  }
  /**
   * @param {?} data
   * @param {?} file
   * @param {?} message
   * @param {?} status
   * @return {undefined}
   */
  function callback(data, file, message, status) {
    autoReview = data;
    fileTooLarge = file;
    ongoingMessage = message;
    calculateSectionStatus = status;
  }
  /**
   * @param {number} data
   * @param {number} val
   * @param {string} type
   * @param {boolean} skillKind
   * @return {?}
   */
  function init(data, val, type, skillKind) {
    /** @type {boolean} */
    str = true;
    return function() {
      var draggingPanel = vim.buffers.getCurrentBuffer();
      var previewOnFunction = vim.buffers.getBuffer(type);
      var TYPE_CLIENT = draggingPanel.getName();
      var format = draggingPanel.getTextAreas().get(Cursor.getX(), Cursor.getY());
      var html = previewOnFunction.getTextAreas().get(data, val);
      if (type === TYPE_CLIENT && (format === html || typeof html === "undefined")) {
        Cursor.set(data, val);
        if (typeof html === "undefined") {
          vim.model.keypressCountdownFinished(true);
        } else {
          html.cursorPositionUpdate(data, val);
        }
        vim.model.readjustViewToCursorPosition();
      } else {
        if (type === TYPE_CLIENT && (typeof format === "undefined" && typeof html !== "undefined" && html.getLimit() > 0)) {
          Cursor.set(data, val);
          html.cursorPositionUpdate(data, val);
          vim.model.readjustViewToCursorPosition();
        } else {
          vim.model.keypressCountdownFinished(true);
          if (type !== TYPE_CLIENT) {
            vim.buffers.switchTo(type, !skillKind);
            vim.screens["game-screen"].setColonCommand("Editing buffer " + type);
            vim.view.notifyFadeInAnimation();
          }
          Cursor.set(data, val);
          vim.model.readjustViewToCursorPosition();
          if (!html || !html.isBossMode()) {
            Game.scrollMiddle();
          }
        }
      }
      blink();
      unhide();
      /** @type {boolean} */
      str = false;
    };
  }
  /**
   * @param {?} s
   * @param {number} v
   * @return {undefined}
   */
  function m(s, v) {
    x = s;
    /** @type {number} */
    y = v;
    end = x;
  }
  /**
   * @param {undefined} t
   * @param {number} index
   * @return {?}
   */
  function read(t, index) {
    var result;
    var L;
    var s = vim.board;
    var G;
    var _ = vim.buffers.getCurrentBuffer().getTextAreas();
    result = _.get(t, index);
    if (typeof result !== "undefined") {
      return result;
    }
    if (s.isCodeBG(t, index)) {
      G = t;
      for (; s.isCodeBG(G, index);) {
        --G;
      }
      ++G;
    }
    result = _.get(G, index);
    if (typeof result !== "undefined") {
      return result;
    }
    result = _.get(G, index - 1);
    if (typeof result !== "undefined" && index >= result.getTopY() && index < result.getTopY() + result.getNumberOfLines() && result.getLineLength(index - result.getTopY()) === 0) {
      return result;
    }
    result = _.get(G, index + 1);
    if (typeof result !== "undefined" && index >= result.getTopY() && index < result.getTopY() + result.getNumberOfLines() && result.getLineLength(index - result.getTopY()) === 0) {
      return result;
    }
    return undefined;
  }
  /**
   * @return {?}
   */
  function clear() {
    var ret;
    var K;
    var p = vim.board;
    var obj;
    var sampler = vim.buffers.getCurrentBuffer().getTextAreas();
    ret = sampler.get(x, y);
    if (typeof ret !== "undefined") {
      return ret;
    }
    if (p.isCodeBG(x, y)) {
      obj = x;
      for (; p.isCodeBG(obj, y);) {
        --obj;
      }
      ++obj;
    }
    ret = sampler.get(obj, y);
    if (typeof ret !== "undefined") {
      if (vim.model.isValidCursorPosition(obj + ret.getLineLength(y - ret.getTopY()) - 1, y)) {
        /** @type {number} */
        x = obj + ret.getLineLength(y - ret.getTopY()) - 1;
        return ret;
      } else {
        return undefined;
      }
    }
    ret = sampler.get(obj, y - 1);
    if (typeof ret !== "undefined" && ret.getLineLength(y - ret.getTopY()) === 0) {
      if (vim.model.isValidCursorPosition(ret.getTopX(), y)) {
        x = ret.getTopX();
        return ret;
      } else {
        return undefined;
      }
    }
    ret = sampler.get(obj, y + 1);
    if (typeof ret !== "undefined" && ret.getLineLength(y - ret.getTopY()) === 0) {
      if (vim.model.isValidCursorPosition(ret.getTopX(), y)) {
        x = ret.getTopX();
        return ret;
      } else {
        return undefined;
      }
    }
    return undefined;
  }
  /**
   * @param {string} value
   * @param {boolean} array
   * @param {number} n
   * @param {?} balanced
   * @return {?}
   */
  function parse(value, array, n, balanced) {
    var result;
    var doc;
    var top;
    var i;
    var ch;
    var type;
    var instabreakBlock;
    var bounds;
    var rect;
    var O;
    var X;
    var N;
    var options;
    var error;
    var life;
    var j;
    var cursors;
    /** @type {number} */
    top = (parseInt(value, 10) || 1) * (typeof n === "undefined" ? 1 : n);
    /** @type {number} */
    i = isNaN(parseInt(value, 10)) || value === "0" ? 0 : ("" + parseInt(value, 10)).length;
    ch = value.charAt(i);
    type = i + 1 < value.length ? value.charAt(i + 1) : "";
    doc = clear();
    if (typeof doc === "undefined" && ch !== "`" && ch !== "'") {
      Game.setCursorCommand("'" + ch + "' can only be used on text");
      return false;
    }
    switch(ch) {
      case "w":
        result = doc.nextWordPos(x, y, false, top);
        break;
      case "W":
        result = doc.nextWordPos(x, y, true, top);
        break;
      case "e":
        result = doc.endWordPos(x, y, false, top);
        break;
      case "E":
        result = doc.endWordPos(x, y, true, top);
        break;
      case "b":
        result = doc.prevWordPos(x, y, false, top);
        break;
      case "B":
        result = doc.prevWordPos(x, y, true, top);
        break;
      case "x":
        result = doc.nextCharPos(x, y, top - 1);
        break;
      case "0":
        result = doc.hardBOLPos(x, y);
        break;
      case "^":
        result = doc.softBOLPos(x, y);
        break;
      case "|":
        result = doc.columnPos(x, y, top);
        break;
      case "$":
        result = doc.endOfLine(x, y, top);
        break;
      case "f":
        result = doc.findNextInLine(x, y, type, top);
        break;
      case "F":
        result = doc.findPrevInLine(x, y, type, top);
        break;
      case "t":
        result = doc.findNextTillInLine(x, y, type, top);
        break;
      case "T":
        result = doc.findPrevTillInLine(x, y, type, top);
        break;
      case "%":
        result = doc.findMatchingBracket(x, y);
        break;
      case "G":
        if (!parseInt(value, 10)) {
          result = doc.lastLineSoftBOLPos(x, y);
        } else {
          result = doc.gotoSoftBOLPosInLine(x, y, top);
        }
        break;
      case "g":
        if (value.charAt(i + 1) === "g") {
          if (!parseInt(value, 10)) {
            result = doc.firstLineSoftBOLPos(x, y);
          } else {
            result = doc.gotoSoftBOLPosInLine(x, y, top);
          }
        }
        break;
      case "*":
      case "#":
        result = doc.getNextHighlightedPosition(x, y, ch === "*", top);
        break;
      case "/":
      case "?":
        result = doc.getNextHighlightedPosition(x, y, ch === "/", top);
        break;
      case "n":
      case "N":
        result = doc.getNextHighlightedPosition(x, y, ch === "n" && "*/".indexOf(vim.model.getGlobalSearchStr().charAt(0)) !== -1 || ch === "N" && "#?".indexOf(vim.model.getGlobalSearchStr().charAt(0)) !== -1, top);
        break;
      case "d":
        result = doc.endOfLine(x, y, top);
        break;
      case "Y":
      case "y":
        result = doc.endOfLine(x, y, top);
        break;
      case "[":
      case "]":
        result = doc.findUnmatchedBracket(x, y, type, top);
        break;
      case "}":
        result = doc.getNextParagraphStart(x, y, top);
        break;
      case "{":
        result = doc.getPrevParagraphStart(x, y, top);
        break;
      case ")":
        result = doc.getNextSentenceStart(x, y, top);
        break;
      case "(":
        result = doc.getPrevSentenceStart(x, y, top);
        break;
      case "H":
        result = doc.gotoSoftBOLPosInLine(x, y, Math.max(vim.model.getTopY() - doc.getTopY(), 0) + top);
        break;
      case "M":
        bounds = doc.gotoSoftBOLPosInLine(x, y, Math.max(vim.model.getTopY() - doc.getTopY(), 0) + 1);
        rect = doc.gotoSoftBOLPosInLine(x, y, Math.min(vim.model.getTopY() + vim.view.getHeightInCells() - doc.getTopY() - 1, doc.getNumberOfLines() + 1 - 1));
        result = {
          x : bounds.x,
          y : Math.floor((bounds.y + rect.y) / 2)
        };
        break;
      case "L":
        result = doc.gotoSoftBOLPosInLine(x, y, Math.min(vim.model.getTopY() + vim.view.getHeightInCells() - doc.getTopY() - top, doc.getNumberOfLines() + 1 - top));
        break;
      case "'":
      case "`":
        options = vim.model.getGlobalMark(type);
        if (typeof doc !== "undefined" && !options) {
          options = doc.getLocalMark(type);
        }
        if (options) {
          if (typeof options.bufferName !== "undefined") {
            doc = vim.buffers.getBuffer(options.bufferName).getTextAreas().get(options.x, options.y);
            if (vim.buffers.getCurrentBuffer().getName() !== options.bufferName) {
              if (array) {
                error = options.bufferName;
              } else {
                vim.buffers.switchTo(options.bufferName);
                vim.screens["game-screen"].setColonCommand("Editing buffer " + options.bufferName);
              }
            }
          }
          if (ch === "'") {
            result = doc.gotoSoftBOLPosInLine(doc.getTopX() + Math.min(options.col, doc.getLineLength(options.row) - 1), doc.getTopY() + options.row, options.row + 1);
          } else {
            result = {
              x : doc.getTopX() + Math.min(options.col, doc.getLineLength(options.row) - 1),
              y : doc.getTopY() + options.row
            };
          }
        } else {
          return false;
        }
        break;
      case "h":
        result = doc.prevCharPos(x, y, top);
        break;
      case "l":
        result = doc.nextCharPos(x, y, top);
        break;
      case "j":
        result = doc.charBelowPos(x, y, end, top);
        break;
      case "k":
        result = doc.charAbovePos(x, y, end, top);
        break;
      default:
        return false;
    }
    if (typeof result === "undefined") {
      return false;
    }
    if (array) {
      callback(result.x, result.y, error || vim.buffers.getCurrentBuffer().getName(), result.wordOutOfBounds);
    }
    if (vim.model.isValidCursorPosition(result.x, result.y)) {
      if (!array) {
        instabreakBlock = doc.getSpecialArea(x, y);
        if (ch === "k" || ch === "j") {
          x = result.x;
          y = result.y;
        } else {
          m(result.x, result.y);
          if (ch === "$") {
            /** @type {number} */
            end = -1;
          } else {
            if (ch === "|") {
              /** @type {number} */
              end = doc.getTopX() - 1 + top;
            }
          }
        }
        if (vim.board.getBG(result.x, result.y) !== vim.board.MISSING && vim.board.getBG(result.x, result.y) !== vim.board.SKY_MISSING) {
          doc.cursorPositionUpdate(result.x, result.y);
        }
      }
      return true;
    } else {
      life = vim.buffers.getCurrentBuffer().getEntities();
      cursors = life.list(result.x, result.y);
      /** @type {number} */
      j = 0;
      for (; j < cursors.length; j = j + 1) {
        if (!cursors[j].isInvisible() && cursors[j].isBlocking() && (cursors[j] instanceof Door || cursors[j] instanceof ClosedChest && cursors[j].isClosed)) {
          cursors[j].collide();
          return true;
        }
      }
    }
    return false;
  }
  /**
   * @param {string} selector
   * @return {?}
   */
  function clickWithWebdriver(selector) {
    return parse(selector, false);
  }
  /**
   * @return {undefined}
   */
  function hideHints() {
    /** @type {boolean} */
    isOwner = true;
  }
  /**
   * @return {undefined}
   */
  function unhide() {
    /** @type {boolean} */
    isOwner = false;
  }
  /**
   * @return {?}
   */
  function o() {
    return str;
  }
  var x;
  var end;
  var y;
  /** @type {number} */
  var slideshowtimer = -1;
  var c;
  var autoReview;
  var fileTooLarge;
  var ongoingMessage;
  var z;
  var calculateSectionStatus;
  var isOwner;
  var str;
  return {
    init : prepare,
    move : load,
    doMotion : parse,
    doMotionNoSimulation : clickWithWebdriver,
    blink : blink,
    stopBlink : setIntervalVersion,
    getX : function() {
      return x;
    },
    getY : function() {
      return y;
    },
    getWordOutOfBounds : function() {
      return z;
    },
    getSimulationX : function() {
      return autoReview;
    },
    getSimulationY : function() {
      return fileTooLarge;
    },
    getSimulationBufferName : function() {
      return ongoingMessage;
    },
    getSimulationWordOutOfBounds : function() {
      return calculateSectionStatus;
    },
    isOn : function() {
      return c && !isOwner;
    },
    isGluedToEOL : function() {
      return end === -1;
    },
    hide : hideHints,
    unhide : unhide,
    isWaitingForRestorePosition : o,
    set : m,
    restorePositionCallback : init,
    getData : getData,
    restore : f
  };
}();
vim.gamestate = function() {
  /**
   * @param {!Object} elem
   * @return {undefined}
   */
  function next(elem) {
    /** @type {*} */
    var state = JSON.parse(elem);
    var self;
    if (typeof state.buffers === "undefined") {
      vim.buffers.init();
      self = vim.buffers.getCurrentBuffer();
      self.getBoard().restore(state.board);
      vim.board = self.getBoard();
      Cursor.restore(state.cursor);
      vim.validKeys.restore(state.validKeys);
      vim.inventory.restore(state.inventory);
      self.getEntities().restore(state.entities);
      self.getTextAreas().restore(state.textareas);
      vim.timer.restore(state.timer);
      if (state.view) {
        vim.model.restore(state.view);
      } else {
        vim.model.restore(state.model);
      }
      if (state.regs) {
        vim.regs.restore(state.regs);
      } else {
        vim.regs.reset();
      }
    } else {
      vim.buffers.restore(state.buffers);
      vim.board = vim.buffers.getCurrentBuffer().getBoard();
      Cursor.restore(state.cursor);
      vim.validKeys.restore(state.validKeys);
      vim.inventory.restore(state.inventory);
      vim.timer.restore(state.timer);
      vim.model.restore(state.model);
      vim.regs.restore(state.regs);
    }
  }
  /**
   * @return {?}
   */
  function get() {
    var state = {};
    state.buffers = vim.buffers.getData();
    state.cursor = Cursor.getData();
    state.validKeys = vim.validKeys.getData();
    state.inventory = vim.inventory.getData();
    state.timer = vim.timer.getData();
    state.model = vim.model.getData();
    state.regs = vim.regs.getData();
    return JSON.stringify(state);
  }
  /**
   * @param {string} file
   * @param {string} duration
   * @return {undefined}
   */
  function parse(file, duration) {
    var externalCertUrl = get();
    /** @type {string} */
    var value = duration ? "1" : "0";
    var joinURL;
    /** @type {string} */
    joinURL = "operation=save&force=" + value + "&filename=" + encodeURIComponent(file) + "&state_string=" + encodeURIComponent(externalCertUrl);
    /** @type {string} */
    fileTooLarge = file;
    vim.fetcher.getUrl("php/savedGames.php", request, options, vim.emailaddr, vim.password, "Saving game...", vim.screens["game-screen"].setColonCommand, joinURL);
  }
  /**
   * @param {!Object} ctx
   * @return {undefined}
   */
  function init(ctx) {
    next(ctx.responseText);
    send();
    if (item.indexOf("Level ") === 0 || item === "start.game") {
      vim.stats.startLevel(vim.model.getLevel());
      if (item !== "Level 1" && item !== "start.game" && item !== "Level 14") {
        vim.view.centerScreenAroundCursor();
      }
    } else {
      vim.stats.invalidateLevelStats(vim.model.getLevel());
    }
    if (vim.buffers.getCurrentBuffer().getName() === "lorem") {
      vim.images.toGrayScale();
    } else {
      vim.images.toNormalColor();
    }
    if (vim.model.getLevel() > 13 && (vim.buffers.getCurrentBuffer().getName() === "sky" || vim.buffers.getCurrentBuffer().getName() === "ground")) {
      vim.images.toDark();
    }
    vim.view.notifyFadeInAnimation();
    unreadItem = item;
    vim.screens["game-screen"].hideCommandHelp();
    vim.screens["game-screen"].setColonCommand("Editing file: " + unreadItem);
  }
  /**
   * @param {!Object} isCorporate
   * @return {undefined}
   */
  function request(isCorporate) {
    unreadItem = fileTooLarge;
    options(isCorporate);
  }
  /**
   * @param {string} val
   * @return {?}
   */
  function handleResponse(val) {
    /** @type {string} */
    var joinURL = "operation=restore&filename=" + encodeURIComponent(val);
    if (val.indexOf("Level ") === 0) {
      return cb(parseInt(val.substr(6), 10));
    }
    /** @type {string} */
    item = val;
    vim.fetcher.getUrl("php/savedGames.php", init, options, vim.emailaddr, vim.password, "Restoring game...", vim.screens["game-screen"].setColonCommand, joinURL);
  }
  /**
   * @param {number} value
   * @return {undefined}
   */
  function cb(value) {
    /** @type {string} */
    var data = "level=" + value;
    /** @type {string} */
    item = "Level " + value;
    vim.fetcher.getUrl("php/savedLevels.php", init, options, vim.emailaddr, vim.password, "Loading Level " + value, vim.screens["game-screen"].setColonCommand, data);
  }
  /**
   * @return {undefined}
   */
  function corpse() {
    /** @type {string} */
    unreadItem = "start.game";
    Game.restartGame(true);
  }
  /**
   * @return {?}
   */
  function _getUnreadItem() {
    return unreadItem;
  }
  /**
   * @param {!Object} isCorporate
   * @return {undefined}
   */
  function options(isCorporate) {
    vim.screens["game-screen"].setColonCommand(isCorporate.responseText);
  }
  /**
   * @return {undefined}
   */
  function rowFor() {
    vim.fetcher.getUrl("php/savedGames.php", options, options, vim.emailaddr, vim.password, "Retrieving saved games list...", vim.screens["game-screen"].setColonCommand, "operation=ls");
  }
  /**
   * @param {string} name
   * @return {undefined}
   */
  function deleteCookie(name) {
    vim.fetcher.getUrl("php/savedGames.php", options, options, vim.emailaddr, vim.password, "Deleting game...", vim.screens["game-screen"].setColonCommand, "operation=rm&filename=" + encodeURIComponent(name));
  }
  /**
   * @param {number} n
   * @param {number} s
   * @return {undefined}
   */
  function extend(n, s) {
    var _this = vim.buffers.getBuffer(1).getTextAreas();
    var r = _this.get(n, s);
    if (typeof r !== "undefined") {
      Array.prototype.shift.apply(arguments);
      Array.prototype.shift.apply(arguments);
      TextArea.prototype.hotfixPadWithSpaces.apply(r, arguments);
      _this.refreshCache(r);
    }
  }
  /**
   * @return {undefined}
   */
  function send() {
    var length;
    var editor;
    /** @type {string} */
    var code = Board.prototype.WATER;
    /** @type {string} */
    var id = Board.prototype.PLAIN;
    /** @type {string} */
    var strHtml = Board.prototype.MISSING;
    /** @type {string} */
    var highlight = Board.prototype.GRASS;
    /** @type {string} */
    var X = Board.prototype.PATH;
    /** @type {string} */
    var green = Board.prototype.TALL_WALL;
    var refs;
    var options;
    editor = vim.buffers.getBuffer(1).getBoard();
    refs = vim.buffers.getBuffer(1).getEntities();
    options = vim.buffers.getBuffer(1).getTextAreas();
    if (editor.getBG(149, 172) === code && editor.getBG(150, 172) === id) {
      editor.setBG(149, 172, id);
    }
    length = options.get(172, 116);
    if (typeof length !== "undefined") {
      if (length.getLetter(172, 117) === " ") {
        length.hotfixSpaceLinesToEmptyLines();
        options.refreshCache(length);
      }
    }
    length = options.get(168, 146);
    if (typeof length !== "undefined") {
      if (length.getLetter(168, 147) === " ") {
        length.hotfixSpaceLinesToEmptyLines();
        options.refreshCache(length);
      }
    }
    length = options.get(216, 137);
    if (typeof length !== "undefined") {
      length.hotfixSpaceLinesToEmptyLines();
      options.refreshCache(length);
    }
    length = options.get(103, 117);
    if (typeof length !== "undefined") {
      length.hotfixTextLine(0, " k ");
      length.hotfixTextLine(2, " j ");
      options.refreshCache(length);
    }
    length = options.get(103, 120);
    if (typeof length !== "undefined") {
      length.hotfixTextLine(0, "Hello ");
      options.refreshCache(length);
    }
    length = options.get(129, 111);
    if (typeof length !== "undefined") {
      length.hotfixTextLine(0, "Remember:  ");
      length.hotfixTextLine(1, "words are  ");
      length.hotfixTextLine(2, "not WORDs!!");
      options.refreshCache(length);
    }
    if (editor.getBG(128, 109) === X) {
      editor.setBG(128, 109, green);
      editor.setBG(128, 110, green);
      editor.setBG(129, 110, X);
      editor.setBG(129, 111, X);
    }
    length = options.get(172, 113);
    if (typeof length !== "undefined") {
      length.hotfixTextLine(4, "                 ");
      length.hotfixTextLine(8, "              ");
      length.hotfixTextLine(9, "And the power of VIM will prevail.");
      options.refreshCache(length);
    }
    length = options.get(201, 117);
    if (typeof length !== "undefined") {
      length.hotfixTextLine(1, "back! ");
      options.refreshCache(length);
    }
    if (editor.getBG(186, 121) === id) {
      editor.setBG(186, 121, code);
    }
    if (editor.getBG(206, 122) === id) {
      editor.setBG(206, 122, X);
    }
    extend(216, 137, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2);
    length = options.get(183, 151);
    if (typeof length !== "undefined") {
      length.hotfixTextLine(1, "        ");
      length.hotfixTextLine(4, "                ");
      length.hotfixTextLine(6, "}             ");
      length.hotfixTextLine(8, "                    ");
      length.hotfixTextLine(9, "\x3c/script>           ");
      options.refreshCache(length);
    }
    length = options.get(219, 189);
    if (typeof length !== "undefined") {
      extend(220, 172, 3, 7, 5, 3, 25, 3, 1, 4, 2, 25, 2, 1, 0, 2, 25, 1, 0, 25, 24);
    } else {
      extend(220, 172, 3, 7, 5, 3, 25, 3, 1, 4, 2, 25, 2, 1, 0, 2, 25, 25, 24);
    }
    extend(184, 176, 10, 5, 3, 1, 6, 0, 3, 0);
    extend(188, 215, 0, 2, 1, 2);
    extend(214, 202, 0, 0, 0);
    if (editor.isValid(231, 213) && editor.getBG(231, 213) === code) {
      editor.setBG(231, 213, id);
    }
    if (editor.isValid(218, 230) && editor.getBG(218, 230) === code) {
      extend(218, 218, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0);
    } else {
      extend(218, 218, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0);
    }
    extend(212, 232, 2, 1, 2);
    extend(213, 249, 0, 0, 0, 0, 36, 44, 0, 0, 0, 0, 0, 19, 44, 0, 0, 44, 0, 44, 0, 0, 44, 0, 0, 44, 0, 0);
    if (editor.isValid(261, 257) && editor.getBG(261, 257) === code) {
      editor.setBG(261, 257, id);
      editor.setBG(262, 257, id);
    }
    extend(208, 294, 0, 5, 1, 2);
    extend(203, 302, 1, 0, 3, 5);
    extend(215, 313, 0, 0, 0, 0, 1, 0, 0, 0, 0, 14, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0);
    extend(232, 342, 0, 0, 0, 0, 0, 0, 6, 0, 9, 0);
    length = options.get(226, 346);
    if (typeof length !== "undefined") {
      length.hotfixTextLine(1, "that is truer than true");
      options.refreshCache(length);
    }
    if (editor.getBG(255, 348) === highlight) {
      editor.setBG(255, 348, id);
      editor.setBG(254, 350, id);
      editor.setBG(253, 350, id);
      editor.setBG(228, 322, id);
      editor.setBG(229, 322, highlight);
      editor.setBG(229, 321, highlight);
      editor.setBG(228, 320, strHtml);
      editor.setBG(225, 345, strHtml);
      editor.setBG(226, 346, highlight);
      editor.setBG(259, 350, strHtml);
      editor.setBG(247, 345, strHtml);
      editor.setBG(248, 345, strHtml);
      editor.setBG(249, 345, strHtml);
      editor.setBG(261, 257, id);
      editor.setBG(262, 257, id);
    }
    refs.deleteAtPosition(196, 180);
    refs.deleteAtPosition(197, 180);
    refs.deleteAtPosition(187, 181);
    refs.deleteAtPosition(188, 181);
    if (editor.getBG(199, 176) !== code) {
      editor.setBG(199, 176, id);
      editor.setBG(200, 176, id);
      editor.setBG(201, 176, id);
      editor.setBG(202, 176, id);
      if (editor.getBG(205, 176) !== green) {
        editor.setBG(203, 176, id);
      }
    }
    if (!refs.exist(208, 233)) {
      refs.deleteAtPosition(210, 233);
      refs.deleteAtPosition(214, 233);
    }
    if (typeof vim.buffers.getBuffer(3) !== "string") {
      length = vim.buffers.getBuffer(3).getTextAreas().get(182, 165);
      if (typeof length !== "undefined") {
        length.hotfixNoExtraSpacesbutEmptyLines();
        options.refreshCache(length);
      }
    }
  }
  /**
   * @param {string} str
   * @return {undefined}
   */
  function render(str) {
    /** @type {*} */
    var data = JSON.parse(str);
    var k;
    var i;
    var name;
    var values;
    var element;
    var result;
    var self;
    /** @type {boolean} */
    var error = false;
    var context;
    var space_camera_pivot;
    var file;
    var f;
    /** @type {!Array} */
    var items = [];
    /** @type {number} */
    var j = -1;
    /** @type {number} */
    var K = 0;
    if (typeof data.buffers === "undefined") {
      items.push(data);
    } else {
      /** @type {number} */
      i = 0;
      for (; i < data.buffers.length; ++i) {
        items.push(data.buffers[i]);
      }
    }
    /** @type {number} */
    k = 0;
    for (; k < items.length; ++k) {
      data = items[k];
      file = data.buffer || "ground";
      f = vim.buffers.getBuffer(file);
      if (typeof data.levelNumber !== "undefined") {
        vim.model.setLevel(data.levelNumber);
        /** @type {boolean} */
        error = true;
      }
      if (typeof f === "string") {
        vim.buffers.add(file, undefined);
        f = vim.buffers.getBuffer(file);
      }
      if (error && data.levelNumber === 14 && file === "underground") {
        f.getBoard().setFillerBG(f.getBoard().SKY_MISSING);
      }
      context = f.getEntities();
      space_camera_pivot = f.getTextAreas();
      f.getBoard().add(data);
      if (typeof data.cursorX === "number" && typeof data.cursorY === "number") {
        f.cursorX = data.cursorX + data.addX;
        f.cursorY = data.cursorY + data.addY;
        /** @type {number} */
        j = k;
        ++K;
      }
      if (typeof data.topX === "number") {
        f.topX = data.topX + data.addX;
      }
      if (typeof data.topY === "number") {
        f.topY = data.topY + data.addY;
      }
      /** @type {number} */
      i = 0;
      for (; i < data.textareas.length; i = i + 1) {
        self = data.textareas[i];
        space_camera_pivot.add(new TextArea(self.x + data.addX, self.y + data.addY, self.text.split("\n"), self.zoomOut, self.limit, self.alwaysSink, self.shouldClean, self.sacred, self.marks, file, self.bossMode, self.undos, self.redos));
      }
      /** @type {number} */
      i = 0;
      for (; i < data.entities.length; i = i + 1) {
        name = data.entities[i].x + data.addX;
        values = data.entities[i].y + data.addY;
        element = data.entities[i].data || {};
        element.type = data.entities[i].type;
        /** @type {boolean} */
        element.invisible = data.entities[i].invisible === true;
        if (typeof data.entities[i].character !== "undefined") {
          element.character = data.entities[i].character;
        }
        result = context.createEntity(name, values, element, data.addX, data.addY);
        if (result) {
          context.add(result);
          if (!error && result instanceof Princess && result.isValid()) {
            vim.model.setLevel(result.levelToLoad - 1);
            /** @type {boolean} */
            error = true;
          }
        }
      }
    }
    send();
    if (!error && vim.model.getLevel() > 1) {
      vim.model.setLevel(vim.model.getLevel() + 1);
    }
    if (j !== -1) {
      vim.buffers.switchTo(items[j].buffer || "ground", K > 1);
    }
    if (vim.model.getLevel() === 11) {
      Game.setCursorCommand("Wh.. what the...?\nHow did I get here?", true);
    }
  }
  /** @type {string} */
  var unreadItem = "start.game";
  var item;
  var fileTooLarge;
  return {
    restartGame : corpse,
    saveGame : parse,
    restoreGame : handleResponse,
    loadLevel : cb,
    loadLevelFromString : render,
    list : rowFor,
    remove : deleteCookie,
    getCurrentFilename : _getUnreadItem,
    serializeState : get,
    deserializeState : next
  };
}();
/** @type {string} */
var level1 = '{"topX":-6,"topY":-3,"addX":100,"addY":100,"cursorX":3,"cursorY":17,"bg":["wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww","wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww","wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww","wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww","wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww","wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww","wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww","wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwgggg<ggg.wwwwwww","wwwwwwwwwwwwwwwwwSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSgggggggwwgwwwwwg..wwwwwww       ","wwwwwwwwwwwwwwwwwS+++++++++SS........S.....S........S...gggggggwwwwgggggw...wwwwwww","wwwwwwwwwwwwwwwwwS+++++++++SS.SSSSSS.S.SSS.S.SSSSSS.S.SSSSggggwwwwwwwggwwwwwwwwwwww","wwwwwwwwwwwwwwwwwS+++++++++++.S......S.S.S.S.S.S.SS.S.S.Swgggwwwwgggg<gwwwwwwwwwwww","wwwwwwwwwwwwwwwwwS............SSSSSS.S.S.S.S.S.S.SS.S...Swgggggwwgwwwwwwwwwwwwwwwww","wwwwwwwwwwwwwwwwwS.........S.S.....S.>.S.S.S.S......S.S.Swggwwwwwgggwwwwwwwwwwwwwww","wwwwwwwwwwwwwwwwwSSSSSSSSS.S.S.SSSSS.SSS.S.S.SSSSSSSS.S.Swgggwwwwgggggwwwwwwwwwwwww","wggggggggggggwwwwS...........S.S...S.<...S.S..........S.Swggwwwwwgwwwwwwwwwwwwwwwww","wg...ggggggggwwwwS.SSSSSSSSSSS.S.SSS.S.SSS.SSSSSSSSSS.SSSwggggg<ggwwwwwwwwwwwwwwwww","wg.........ggwwwwS.....S.S.....S.S...S............SSS...Swwwwwwwwwwwwwwwwwwwwwwwwww","wg...ggggg.ggwwwwSSSSS.S.S.SSSSS.S.SSSSSSSSSSSSSS.SSS.S.Swwwwwwwwwwwwwwwwwwwwwwwwww","wggggggggg.ggwwwwS.....S.S.......S.S............S.SSS.S.Swwwwwwwwwwwwwwwwwwwwwwwwww","wggggggggg.ggSSSSS.SSSSS.SSSSSSSSS.S.SSSSSSSSSS.S.SSS.S.Swwwwwwwwwwwwwwwwwwwwwwwwww","wggggggggg.........S...S.S.......S.S.S..........S.>...S.Swwwwwwwwwwwwwwwwwwwwwwwwww","wggggggggggggSSSSS.SSS.S.S.SSSSSSS.S.SSSSSSSSSSSS.SSSSS.Swwwwwwwwwwwwwwwwwwwwwwwwww","wwwwwwwwwwwwwwwwwS.>...............S..............<.....Swwwwwwwwwwwwwwwwwwwwwwwwww","wwwwwwwwwwwwwwwwwSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSwwwwwwwwwwwwwwwwwwwwwwwwww","wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww","wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww","wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww","wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww","wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww","wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww","wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww","wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"],"entities":[{"type":"rock","x":18,"y":12},{"type":"rock","x":19,"y":12},{"type":"rock","x":20,"y":12},{"type":"rock","x":21,"y":12},{"type":"rock","x":22,"y":12},{"type":"rock","x":23,"y":12},{"type":"rock","x":24,"y":12},{"type":"rock","x":25,"y":12},{"type":"rock","x":26,"y":12},{"type":"rock","x":27,"y":12},{"type":"rock","x":29,"y":12},{"type":"rock","x":27,"y":11},{"type":"chest","x":23,"y":10},{"type":"tall_tree","x":2,"y":21},{"type":"yellow_key","x":38,"y":21},{"type":"door","x":53,"y":11},{"type":"boy","x":7,"y":17,"data":{"name":"welcome_kid","message":"Hooray! I can\'t believe it!\\nThe Shadowy Cursor has\\ncome at last! Soon, the\\nold prophecy will be\\nfulfilled!!!"}},{"type":"pink_girl","x":60,"y":14,"data":{"name":"water_tip_girl","message":"Moving up or down to a shorter line\\n(i.e. into water) moves you to the\\nlast column in the shorter line,\\nbut if you keep moving to a\\nlonger line you\'ll end up in the\\nsame column where you started!"}},{"type":"princess","x":75,"y":9,"data":{"name":"level_1_princess","levelToLoad":2,"message":"Very good oh Shadowy One!\\nYou learned the hjkl skill.\\n\\nGo on!"}},{"type":"candle","x":23,"y":10,"invisible":true},{"type":"plus_minus","x":23,"y":10,"data":{"name":"darkness_falls_changes","changes":[{"name":"welcome_kid","action":"remove"},{"name":"help_girl","action":"remove"},{"name":"water_tip_girl","action":"remove"},{"name":"prophecy_kid","action":"remove"},{"name":"red_instructions","action":"remove"},{"name":"pinky_goto_artifact","action":"remove"},{"name":"WORDs_maze_girl","action":"remove"},{"name":"level_3_princess","type":"princess","levelToLoad":4,"message":"Help us ho Shadowy One!\\nThis is our darkest hour!\\n(pun intended)","x":205,"y":136,"action":"add"}]},"invisible":true},{"type":"brown_girl","x":24,"y":17,"data":{"name":"help_girl","message":"There is a built-in help system\\nin this game. If you ever need a\\nfull explanation and example on\\nwhat a key does or how it\'s used\\njust type :help followed by the\\nkey, for example try \':help j\'\\n(without the quotes).\\n\\nThe help screen for a specific key\\nwill also be displayed when you\\ncollect a key, but sometimes you\'ll\\nneed to ask specifically for the\\ncapital variation of a key."}},{"type":"cat_girl","x":40,"y":11,"data":{"name":"WORDs_maze_girl","message":"To reach the treasure\\nchest, you should know\\nWORDs are separated\\nby spaces.\\n\\nYou need \'W\', \'E\', and \\n\'B\' buttons (capitals)\\nto navigate WORDs."}}],"textareas":[{"x":2,"y":16,"text":" k \\nh l\\n j ","limit":0,"shouldClean":" "},{"x":3,"y":20,"text":"Hello \\nworld!","limit":0,"shouldClean":" "},{"x":18,"y":9,"text":"Remember:  \\nwords are  \\nnot WORDS!!","limit":0,"shouldClean":" "}]}';
var Game = function() {
  /**
   * @param {boolean} isLE
   * @return {undefined}
   */
  function read(isLE) {
    var self;
    vim.inventory.init();
    vim.validKeys.init();
    Cursor.init(0, 0);
    vim.buffers.init();
    self = vim.buffers.getCurrentBuffer();
    vim.board = self.getBoard();
    self.getEntities().clear();
    self.getTextAreas().clear();
    vim.view.init();
    vim.model.setCandleLightMode(false);
    vim.model.setShowNumbers(false);
    vim.model.clearAllMarks();
    vim.regs.reset();
    vim.screens["game-screen"].hideToBeContinuedMessage();
    vim.screens["game-screen"].hideCommandHelp();
    vim.gamestate.loadLevelFromString(level1);
    vim.input.initialize();
    vim.timer.clear();
    topKiller = undefined;
    /** @type {boolean} */
    l = true;
    data = undefined;
    /** @type {boolean} */
    tag = false;
    /** @type {boolean} */
    dir = false;
    /** @type {!Array} */
    array = [];
    /** @type {number} */
    stop = 1;
    if (isLE) {
      buddyNotification();
    }
  }
  /**
   * @return {undefined}
   */
  function buddyNotification() {
    if (l) {
      /** @type {boolean} */
      l = false;
      vim.audio.play("appearance");
      vim.stats.startLevel(1);
    } else {
      if (processedItem) {
        vim.screens["game-screen"].setColonCommand(processedItem);
        /** @type {string} */
        processedItem = "";
      }
    }
  }
  /**
   * @return {undefined}
   */
  function load() {
    var username;
    var password;
    var object;
    var criteria;
    var query;
    var value;
    read();
    /** @type {string} */
    processedItem = "";
    if (Modernizr.localstorage) {
      username = window.localStorage["VIM Adventures email"] || "";
      password = window.localStorage["VIM Adventures password"] || "";
      object = window.localStorage["VIM Adventures state"] || "";
      query = window.localStorage["VIM Adventures token"] || "";
      value = window.localStorage["VIM Adventures stats"] || "";
      if (object.length > 1) {
        vim.emailaddr = username;
        vim.password = password;
        vim.token = query;
        vim.stats.unmarshal(value);
        vim.gamestate.deserializeState(object);
        if (vim.buffers.getCurrentBuffer().getName() === "lorem") {
          vim.images.toGrayScale();
        } else {
          vim.images.toNormalColor();
        }
        if (vim.model.getLevel() > 13 && (vim.buffers.getCurrentBuffer().getName() === "sky" || vim.buffers.getCurrentBuffer().getName() === "ground")) {
          vim.images.toDark();
        }
        /** @type {string} */
        processedItem = "Logged in as " + vim.emailaddr + ". Type :logout to restart the game or login as a different user.";
        /** @type {boolean} */
        l = false;
      }
      window.setInterval(function() {
        username = window.localStorage["VIM Adventures email"] || "";
        password = window.localStorage["VIM Adventures password"] || "";
        if (username !== "" && password !== "") {
          criteria = vim.buffers.getCurrentBuffer().getTextAreas().get(Cursor.getX(), Cursor.getY());
          if (!vim.input.isInInputMode() && (typeof criteria === "undefined" || criteria.getLimit() === 0 && !criteria.isAlwaysSink()) && !vim.model.isEndgame()) {
            window.localStorage["VIM Adventures state"] = vim.gamestate.serializeState();
          }
          window.localStorage["VIM Adventures stats"] = vim.stats.marshal();
        }
      }, 10000);
    }
  }
  /**
   * @return {undefined}
   */
  function KDBush() {
    vim.buffers.getCurrentBuffer().getEntities().collide(Cursor.getX(), Cursor.getY());
  }
  /**
   * @return {?}
   */
  function merge() {
    var r;
    var string = vim.board;
    var length = Cursor.getX();
    var i = Cursor.getY();
    var relationControls = vim.buffers.getCurrentBuffer().getTextAreas();
    r = relationControls.get(length, i);
    if (typeof r !== "undefined") {
      return r;
    }
    if (string.isCodeBG(length, i)) {
      for (; string.isCodeBG(length, i);) {
        --length;
      }
      ++length;
    } else {
      return undefined;
    }
    r = relationControls.get(length, i);
    if (typeof r !== "undefined") {
      return r;
    }
    if (string.isCodeBG(length, i)) {
      for (; string.isCodeBG(length, i - 1);) {
        --i;
      }
      ++i;
    }
    r = relationControls.get(length, i);
    if (typeof r !== "undefined") {
      return r;
    }
    return undefined;
  }
  /**
   * @param {number} i
   * @param {undefined} val
   * @param {boolean} callback
   * @return {undefined}
   */
  function get(i, val, callback) {
    Cursor.set(i, val);
    vim.model.readjustViewToCursorPosition();
    vim.buffers.getCurrentBuffer().getEntities().collide(i, val, callback);
  }
  /**
   * @param {number} key
   * @param {number} val
   * @param {boolean} bDontFire
   * @return {undefined}
   */
  function update(key, val, bDontFire) {
    var i = Cursor.getX();
    var value = Cursor.getY();
    var result = merge(i, value);
    var setResult;
    var sampleInput = vim.input;
    var player = vim.audio;
    var me = vim.view;
    var p = vim.model;
    var context = vim.board;
    var lastChild;
    /** @type {boolean} */
    var loadingMorePlaylists = false;
    var obj;
    var s = vim.stats;
    Cursor.set(key, val);
    if (i === key && value === val) {
      return;
    }
    if (bDontFire !== true) {
      p.readjustViewToCursorPosition();
    }
    if (context.getBG(key, val) === context.MISSING || context.getBG(key, val) === context.SKY_MISSING) {
      sampleInput.disableKeys();
      hide();
      me.notifyFallingCursorAnimation(i, value, vim.buffers.getCurrentBuffer().getName());
      player.play("fall");
      s.incDeaths(vim.model.getLevel());
    } else {
      /** @type {boolean} */
      loadingMorePlaylists = context.getBG(key, val) === context.DARK;
      if (!loadingMorePlaylists && typeof result !== "undefined") {
        obj = result.getSpecialArea(key, val);
        if (obj && obj.type === "n" && obj.stepNumber !== result.getCurrentNumber()) {
          /** @type {boolean} */
          loadingMorePlaylists = true;
        }
      }
      if (loadingMorePlaylists) {
        sampleInput.disableKeys();
        hide();
        me.notifyDisappearingCursorAnimation(i, value, vim.buffers.getCurrentBuffer().getName());
        player.play("teleport");
        s.incDeaths(p.getLevel());
      } else {
        obj = result ? result.getSpecialArea(i, value) : undefined;
        if (obj && obj.type === "M") {
          if (!((result.getLimit() > 0 || result.isAlwaysSink()) && typeof result === "undefined")) {
            result.applySpecialArea(obj.startX, obj.startY);
            result.removeFromSinkList(obj.startX, obj.startY);
            context.setBG(obj.startX, obj.startY, context.MISSING);
            me.notifyFallingBlockAnimation(obj.startX, obj.startY);
            player.play("avalanche");
          }
        }
        vim.buffers.getCurrentBuffer().getEntities().collide(key, val);
        if (result) {
          setResult = result.checkForShouldCleanSpecialAreas(key, val);
          lastChild = result.checkForNumberedSpecialAreas(key, val);
          if (setResult || lastChild) {
            p.recacheCell(x, y);
            player.play("swipe");
            add(result);
          }
        }
      }
    }
  }
  /**
   * @param {!Function} type
   * @param {string} num
   * @param {string} mode
   * @return {undefined}
   */
  function success(type, num, mode) {
    var r;
    var c;
    var entry;
    var i;
    var v;
    var b;
    var ref;
    var result;
    var value;
    var s;
    var ctx;
    var e;
    /** @type {boolean} */
    var loadingMorePlaylists = false;
    var data;
    var a;
    r = Cursor.getX();
    c = Cursor.getY();
    entry = vim.buffers.getCurrentBuffer().getName();
    result = merge(r, c);
    ref = type(num);
    i = Cursor.getX();
    v = Cursor.getY();
    b = vim.buffers.getCurrentBuffer().getName();
    ctx = vim.buffers.getCurrentBuffer().getBoard();
    /** @type {boolean} */
    a = entry !== b;
    if (r !== i || c !== v) {
      vim.audio.play("key_press");
      if (mode !== "H" && mode !== "M" && mode !== "L") {
        vim.model.readjustViewToCursorPosition();
      }
      if (ctx.getBG(i, v) === ctx.MISSING || ctx.getBG(i, v) === ctx.SKY_MISSING) {
        vim.input.disableKeys();
        hide();
        vim.view.notifyFallingCursorAnimation(r, c, entry);
        vim.audio.play("fall", true);
        vim.stats.incDeaths(vim.model.getLevel());
      } else {
        value = merge(i, v);
        if (a || result !== value) {
          if (typeof result !== "undefined") {
            vim.model.keypressCountdownFinished(false, i - r, v - c);
          }
          if (typeof value !== "undefined") {
            vim.model.initKeypressCountdown(value, r, c, entry);
            vim.view.showAsMuchAsPossible(i, v, value, a);
          }
        }
        /** @type {boolean} */
        loadingMorePlaylists = ctx.getBG(i, v) === ctx.DARK;
        if (!loadingMorePlaylists && typeof value !== "undefined") {
          data = value.getSpecialArea(i, v);
          if (data && data.type === "n" && data.stepNumber !== value.getCurrentNumber()) {
            /** @type {boolean} */
            loadingMorePlaylists = true;
          }
        }
        if (loadingMorePlaylists) {
          vim.input.disableKeys();
          hide();
          vim.view.notifyDisappearingCursorAnimation(r, c, entry);
          vim.audio.play("teleport", true);
          vim.stats.incDeaths(vim.model.getLevel());
        } else {
          data = result ? result.getSpecialArea(r, c) : undefined;
          if (data && data.type === "M") {
            if (!((result.getLimit() > 0 || result.isAlwaysSink()) && typeof value === "undefined")) {
              result.applySpecialArea(data.startX, data.startY);
              result.removeFromSinkList(data.startX, data.startY);
              ctx.setBG(data.startX, data.startY, ctx.MISSING);
              vim.view.notifyFallingBlockAnimation(data.startX, data.startY);
              vim.audio.play("avalanche");
            }
          }
          if (a || Math.abs(i - r) >= 10 || Math.abs(v - c) >= 2) {
            vim.view.notifyPointCursor();
          }
          vim.buffers.getCurrentBuffer().getEntities().collide(i, v);
          if (value) {
            s = value.checkForShouldCleanSpecialAreas(i, v);
            e = value.checkForNumberedSpecialAreas(i, v);
            if (s || e) {
              vim.model.recacheCell(i, v);
              vim.audio.play("swipe");
              add(value);
            }
          }
        }
      }
    } else {
      if (!ref) {
        vim.audio.play("blocked");
      }
    }
  }
  /**
   * @return {undefined}
   */
  function sattr() {
    Cursor.blink();
  }
  /**
   * @return {undefined}
   */
  function hide() {
    Cursor.stopBlink();
  }
  /**
   * @return {undefined}
   */
  function _playCurrentFromStart() {
    vim.audio.play("error_beep");
  }
  /**
   * @param {!Object} c
   * @param {boolean} r
   * @return {undefined}
   */
  function cb(c, r) {
    var options = c || merge(Cursor.getX(), Cursor.getY());
    var title = options ? options.checkForShouldCleanSpecialAreas(Cursor.getX(), Cursor.getY()) : false;
    var uri = options ? options.checkForNumberedSpecialAreas(Cursor.getX(), Cursor.getY()) : false;
    if (title || uri) {
      vim.model.recacheCell(Cursor.getX(), Cursor.getY());
      vim.audio.play("swipe");
      if (r) {
        add(options);
      }
    }
  }
  /**
   * @param {string} name
   * @param {number} next
   * @param {number} id
   * @return {?}
   */
  function writeFile(name, next, id) {
    /** @type {number} */
    var width = parseInt(name, 10) || 1;
    var methodSignature = Cursor.getX();
    var type = Cursor.getY();
    var res = success(function() {
      return Cursor.move(next, id, width);
    });
    if (width > 1) {
      log(name, methodSignature, type, Cursor.getX(), Cursor.getY(), id !== 0);
    }
    return res;
  }
  /**
   * @param {string} callback
   * @return {?}
   */
  function moveLeft(callback) {
    return writeFile(callback, -1, 0);
  }
  /**
   * @param {string} callback
   * @return {?}
   */
  function configure(callback) {
    return writeFile(callback, 1, 0);
  }
  /**
   * @param {string} callback
   * @return {?}
   */
  function moveUp(callback) {
    return writeFile(callback, 0, -1);
  }
  /**
   * @param {string} callback
   * @return {?}
   */
  function moveDown(callback) {
    return writeFile(callback, 0, 1);
  }
  /**
   * @param {string} type
   * @param {number} s
   * @param {number} value
   * @param {number} i
   * @param {number} a
   * @param {?} user
   * @param {boolean} force
   * @return {undefined}
   */
  function log(type, s, value, i, a, user, force) {
    var text = vim.buffers.getCurrentBuffer().getTextAreas();
    var object = text.get(s, value);
    var result = text.get(i, a);
    var left;
    var before;
    var o;
    var aside;
    /** @type {number} */
    var t = s;
    /** @type {number} */
    var start = value;
    /** @type {number} */
    var n = i;
    /** @type {number} */
    var len = a;
    var position;
    var x;
    var domWidth;
    var newPos = result ? result.getTopX() : 0;
    var delta = result ? result.getTopY() : 0;
    var others = vim.buffers.getCurrentBuffer().getEntities();
    var _ref;
    var _i;
    var console = vim.view;
    var proto;
    /** @type {boolean} */
    var last = false;
    /** @type {boolean} */
    var $exitCode = false;
    /** @type {boolean} */
    var skippedString = false;
    var p = vim.model;
    if (p.getLevel() < 12) {
      return;
    }
    if (result !== object || typeof result === "undefined") {
      return;
    }
    if (start > len || start === len && t > n) {
      /** @type {number} */
      t = i;
      /** @type {number} */
      start = a;
      /** @type {number} */
      n = s;
      /** @type {number} */
      len = value;
      /** @type {boolean} */
      $exitCode = true;
    }
    if (force && typeof p.getGlobalSearchStr() !== "undefined") {
      /** @type {boolean} */
      skippedString = "*/".indexOf(p.getGlobalSearchStr().charAt(0)) !== -1;
      if (type === "N") {
        /** @type {boolean} */
        skippedString = !skippedString;
      }
      /** @type {boolean} */
      last = $exitCode === true && skippedString || $exitCode === false && !skippedString;
    }
    console.notifyShowRangeAnimation(t, start, n, len, result, undefined, "rgba(33,33,33,0.2)", user, last);
    left = last ? newPos : t;
    before = last ? delta : start;
    aside = last ? delta + result.getNumberOfLines() - 1 : len;
    o = last ? newPos + result.getLineLength(len - delta) : n;
    position = before;
    for (; position <= aside; ++position) {
      domWidth = newPos + result.getLineLength(position - delta);
      x = position === before ? left : newPos;
      for (; x <= (position === aside ? o : domWidth - 1); ++x) {
        if (!last || (position < start || position === start && x < t) || (position > len || position === len && x > n)) {
          _ref = others.list(x, position);
          /** @type {number} */
          _i = 0;
          for (; _i < _ref.length; ++_i) {
            if (_ref[_i] instanceof RedBug) {
              proto = _ref[_i];
              if (type.indexOf(proto.volPattern) !== -1) {
                proto.invalidate();
                p.recacheCell(proto.getX(), proto.getY());
                console.notifyExplosion(proto.getX(), proto.getY(), proto.getXOffset(), proto.getYOffset());
                vim.audio.play("explosion");
                add(result);
              }
            }
          }
        }
      }
    }
  }
  /**
   * @param {number} x
   * @param {number} y
   * @return {undefined}
   */
  function f(x, y) {
    var manager2 = vim.buffers.getCurrentBuffer();
    var _targetImageArray = manager2.getTextAreas();
    var box = _targetImageArray.get(x, y);
    var id;
    var list;
    var i;
    var disableHeightInput = box ? box.getTopX() : 0;
    var disableWidthInput = box ? box.getTopY() : 0;
    var utils = manager2.getEntities();
    var parts;
    var View = vim.view;
    var p = vim.model;
    var proto;
    if (typeof box === "undefined") {
      return;
    }
    /** @type {number} */
    id = -5;
    for (; id < 5; ++id) {
      /** @type {number} */
      list = -7;
      for (; list < 7; ++list) {
        parts = utils.list(x + list, y + id);
        /** @type {number} */
        i = 0;
        for (; i < parts.length; ++i) {
          if (parts[i] instanceof BigBug) {
            proto = parts[i];
            if (parts[i].isCollidingWithPosition(x, y)) {
              proto.decHitPoints();
              if (proto.getHitPoints() === 0) {
                proto.invalidate();
                p.recacheCell(proto.getX(), proto.getY());
                View.notifyExplosion(proto.getX() - 2, proto.getY() - 8, proto.getXOffset(), proto.getYOffset(), 8);
                vim.audio.play("explosion");
                add(box);
              } else {
                View.notifyExplosion(x, y, 0, 0);
                vim.audio.play("explosion");
              }
            }
          }
        }
      }
    }
  }
  /**
   * @param {number} key
   * @param {number} value
   * @param {number} file
   * @param {number} data
   * @param {?} type
   * @return {?}
   */
  function error(key, value, file, data, type) {
    var manager2 = type ? vim.buffers.getBuffer(type) : vim.buffers.getCurrentBuffer();
    var myCache = manager2.getTextAreas();
    var object = myCache.get(key, value);
    var el = myCache.get(file, data);
    /** @type {number} */
    var h = key;
    /** @type {number} */
    var x = value;
    /** @type {number} */
    var cls = file;
    /** @type {number} */
    var string = data;
    var width;
    var b;
    var va;
    var scrollTop = el.getTopX();
    var diff = el.getTopY();
    var jetContext = manager2.getEntities();
    var crossfilterable_layers;
    var layer_i;
    var s = vim.view;
    var bc;
    /** @type {number} */
    var dyn = 0;
    if (vim.model.getLevel() < 12) {
      return 0;
    }
    if (el !== object || typeof el === "undefined") {
      return 0;
    }
    if (x > value || x === value && key > cls) {
      /** @type {number} */
      h = file;
      /** @type {number} */
      x = data;
      /** @type {number} */
      cls = key;
      /** @type {number} */
      string = value;
    }
    width = x;
    for (; width <= string; ++width) {
      va = scrollTop + el.getLineLength(width - diff);
      b = width === x ? h : scrollTop;
      for (; b <= (width === string ? cls : va - 1); ++b) {
        crossfilterable_layers = jetContext.list(b, width);
        /** @type {number} */
        layer_i = 0;
        for (; layer_i < crossfilterable_layers.length; ++layer_i) {
          if (crossfilterable_layers[layer_i] instanceof RedBug || crossfilterable_layers[layer_i] instanceof BigBug) {
            ++dyn;
          }
        }
      }
    }
    return dyn;
  }
  /**
   * @param {string} c
   * @param {boolean} x
   * @param {?} y
   * @return {undefined}
   */
  function parse(c, x, y) {
    /** @type {number} */
    var x = parseInt(c, 10) || 1;
    var i = c.substr(isNaN(parseInt(c, 10)) || c === "0" ? 0 : ("" + parseInt(c, 10)).length);
    var r;
    var removeTheseCharacters;
    var crumb;
    var size;
    var str;
    var refs = vim.buffers.getCurrentBuffer().getTextAreas();
    var left;
    var val = Cursor.getX();
    var result = Cursor.getY();
    var end;
    var step;
    var p = vim.model;
    var cursor_ix_after = p.getTopX();
    var aniId = p.getTopY();
    var s = vim.view;
    var draggingPanel = vim.buffers.getCurrentBuffer();
    var type = draggingPanel.getName();
    var method = draggingPanel.getTextAreas().get(Cursor.getX(), Cursor.getY());
    var name;
    var guide;
    var Status;
    for (; i.charAt(0) === '"';) {
      size = i.charAt(1);
      i = i.substring(2);
      /** @type {number} */
      x = x * (parseInt(i, 10) || 1);
      i = i.substr(isNaN(parseInt(i, 10)) || i.charAt(0) === "0" ? 0 : ("" + parseInt(i, 10)).length);
    }
    if (y !== true && i !== "CTRL-R" && "PpdDXx~rOosScCAaIi".indexOf(i.charAt(0)) !== -1) {
      if (p.isUndoRedoSkyText(method)) {
        click("I left this message for\na reason. I'd better\nnot mess up its past\nor future versions.");
        return;
      } else {
        if (p.isBossUndergroundText(method)) {
          click("I'd better not edit\nthis text directly...");
          return;
        }
      }
    }
    switch(i.charAt(0)) {
      case "w":
      case "W":
      case "B":
      case "e":
      case "E":
      case "0":
      case "^":
      case "$":
      case "|":
      case "f":
      case "F":
      case "t":
      case "T":
      case "%":
      case "g":
      case "G":
      case "[":
      case "]":
      case "(":
      case ")":
      case "{":
      case "}":
      case "H":
      case "M":
      case "L":
      case "/":
      case "?":
        success(Cursor.doMotionNoSimulation, c, i.charAt(0));
        log(c, val, result, Cursor.getX(), Cursor.getY());
        break;
      case "b":
        if (Cursor.getX() === 128 && Cursor.getY() === 111) {
          text("I can't...\nThere is a '!' under this rock\nso 'b' lands me right on it.\nI should try something else.", true);
        }
        success(Cursor.doMotionNoSimulation, c);
        log(c, val, result, Cursor.getX(), Cursor.getY());
        break;
      case "#":
      case "*":
        crumb = merge(Cursor.getX(), Cursor.getY());
        if (typeof crumb !== "undefined") {
          removeTheseCharacters = crumb.getSearchClosestWord(Cursor.getX(), Cursor.getY());
          if (removeTheseCharacters !== undefined) {
            vim.model.setGlobalSearchStr(c.charAt(0) + removeTheseCharacters);
            vim.buffers.getCurrentBuffer().getTextAreas().highlight(vim.model.getGlobalSearchStr());
            success(Cursor.doMotionNoSimulation, c);
            log(c, val, result, Cursor.getX(), Cursor.getY(), false, true);
          }
        } else {
          text(i.charAt(0) + " can only be used on text");
        }
        break;
      case "n":
      case "N":
        if (typeof vim.model.getGlobalSearchStr() !== "undefined") {
          success(Cursor.doMotionNoSimulation, c);
          log(c, val, result, Cursor.getX(), Cursor.getY(), false, true);
        } else {
          text("No previous '*', '#', '?' or '/' was performed");
        }
        break;
      case ";":
        r = vim.input.getLastInlineSearch();
        if (typeof r !== "undefined") {
          success(Cursor.doMotionNoSimulation, x + vim.input.getLastInlineSearch());
          log(c, val, result, Cursor.getX(), Cursor.getY());
        } else {
          text("No previous inline search ('f', 'F', 't' or 'T') was performed");
        }
        break;
      case ",":
        r = vim.input.getLastInlineSearch();
        if (typeof r !== "undefined") {
          switch(r.charAt(0)) {
            case "f":
              /** @type {string} */
              r = "F" + r.charAt(1);
              break;
            case "F":
              /** @type {string} */
              r = "f" + r.charAt(1);
              break;
            case "t":
              /** @type {string} */
              r = "T" + r.charAt(1);
              break;
            case "T":
              /** @type {string} */
              r = "t" + r.charAt(1);
              break;
          }
          success(Cursor.doMotionNoSimulation, x + r);
          log(c, val, result, Cursor.getX(), Cursor.getY());
        } else {
          text("No previous inline search ('f', 'F', 't' or 'T') was performed");
        }
        break;
      case "r":
        create(i, x);
        break;
      case "~":
        render(x);
        break;
      case "x":
        getHeight(x, size, y);
        break;
      case "X":
        runTest(x, size, y);
        break;
      case "D":
        open(x, size, y);
        break;
      case "d":
        callback(i, x, size, y);
        break;
      case "p":
      case "P":
        set(i, x, size);
        break;
      case "y":
      case "Y":
        draw(i, x, size);
        break;
      case "i":
      case "I":
      case "a":
      case "A":
        move(i, x, y);
        break;
      case "c":
        if (!refs.exist(val, result)) {
          text("'" + i.charAt(0) + "' can only be used on text.");
          vim.audio.play("error_beep");
          break;
        }
        if (i.charAt(i.length - 1) === "c") {
          callback("d" + i.substring(1, i.length - 1) + "d", x, size, y, false, true, true, "i");
          if (tag) {
            move("i", 1, y);
          }
        } else {
          str = i.substr(1);
          crumb = refs.get(Cursor.getX(), Cursor.getY());
          left = (str.indexOf("w") !== -1 || str.indexOf("W") !== -1) && crumb && crumb.getLetter(Cursor.getX(), Cursor.getY()) !== " ";
          callback("d" + str, x, size, y, left, true, true, undefined);
        }
        if (tag) {
          move(dir ? "a" : "i", 1, y);
        }
        break;
      case "C":
        if (i === "CTRL-R") {
          break;
        }
        if (!refs.exist(val, result)) {
          text("'" + i.charAt(0) + "' can only be used on text.");
          vim.audio.play("error_beep");
          break;
        }
        callback("d$", x, size, y, false, true, true, "a");
        if (tag) {
          move("a", 1, y);
        }
        break;
      case "s":
        if (!refs.exist(val, result)) {
          text("'" + i.charAt(0) + "' can only be used on text.");
          vim.audio.play("error_beep");
          break;
        }
        callback("x", x, size, y, false, true, true, undefined);
        if (tag) {
          move(dir ? "a" : "i", 1, y);
        }
        break;
      case "S":
        if (!refs.exist(val, result)) {
          text("'" + i.charAt(0) + "' can only be used on text.");
          vim.audio.play("error_beep");
          break;
        }
        callback("dd", x, size, y, false, true, true, "i");
        if (tag) {
          move("i", 1, y);
        }
        break;
      case "o":
      case "O":
        init(i, x);
        break;
      case ".":
        if (!isNaN(parseInt(c, 10))) {
          /** @type {number} */
          stop = x;
        }
        check();
        break;
      case "u":
        start(x, true);
        break;
      case "m":
        if (!refs.exist(val, result)) {
          text("'" + i.charAt(0) + "' can only be used on text.");
          vim.audio.play("error_beep");
          break;
        }
        bind(i.charAt(1));
        break;
      case "'":
      case "`":
        name = i.charAt(1);
        if (!p.isSupportedMark(name)) {
          vim.screens["game-screen"].setColonCommand("E78: Unknown Mark (" + name + " is not a supported mark name).");
          vim.audio.play("error_beep");
          break;
        }
        if (p.isLocalMark(name) && method && !method.getLocalMark(name) || p.isGlobalMark(name) && !p.getGlobalMark(name)) {
          vim.screens["game-screen"].setColonCommand("E20: Mark not set");
          vim.audio.play("error_beep");
          break;
        }
        if (p.isLocalMark(name) && method && method.getLocalMark(name)) {
          success(Cursor.doMotionNoSimulation, c, i.charAt(0));
          log(c, val, result, Cursor.getX(), Cursor.getY());
          s.notifyScrollMode(cursor_ix_after, aniId, p.getTopX(), p.getTopY(), 8);
        } else {
          if (p.isGlobalMark(name)) {
            guide = p.getGlobalMark(name);
            if (p.isKeypressCountdownActive() && (type !== p.getGlobalMark(name).bufferName || method !== vim.buffers.getCurrentBuffer().getTextAreas().get(guide.x, guide.y))) {
              vim.screens["game-screen"].setColonCommand("Changing buffers (or texts) while working on a countdown text is not allowed.\nPlease leave the text area and try again.");
              vim.audio.play("error_beep");
            } else {
              if (type !== p.getGlobalMark(name).bufferName) {
                success(Cursor.doMotionNoSimulation, c, i.charAt(0));
                vim.model.readjustViewToCursorPosition();
                _eatWhitespace();
              } else {
                success(Cursor.doMotionNoSimulation, c, i.charAt(0));
                vim.view.showAsMuchAsPossible(Cursor.getX(), Cursor.getY(), vim.buffers.getCurrentBuffer().getTextAreas().get(Cursor.getX(), Cursor.getY()));
                _eatWhitespace();
                if (method && method === vim.buffers.getCurrentBuffer().getTextAreas().get(guide.x, guide.y)) {
                  log(c, val, result, Cursor.getX(), Cursor.getY());
                }
                Status = vim.buffers.getCurrentBuffer().getBoard();
                if (Status.getBG(Cursor.getX(), Cursor.getY()) === Status.MISSING || Status.getBG(Cursor.getX(), Cursor.getY()) === Status.SKY_MISSING || Status.getBG(Cursor.getX(), Cursor.getY()) === Status.DARK) {
                  vim.view.notifyPointCursor();
                } else {
                  s.notifyScrollMode(cursor_ix_after, aniId, p.getTopX(), p.getTopY(), 8);
                }
              }
            }
          }
        }
        break;
    }
    if (i === "CTRL-R") {
      start(x, false);
    }
    if ("PpdDXx~rOosScCAaIi".indexOf(i.charAt(0)) !== -1 && i !== "CTRL-R") {
      if (typeof vim.model.getGlobalSearchStr() !== "undefined") {
        vim.buffers.getCurrentBuffer().getTextAreas().highlight(vim.model.getGlobalSearchStr());
      }
      if (x !== true && y !== true) {
        if (i.length > 1 && !isNaN(parseInt(i.substr(1), 10))) {
          /** @type {number} */
          step = parseInt(i.substr(1), 10);
          /** @type {number} */
          stop = x * step;
          end = i.charAt(0) + i.substr(1 + step.toString().length);
        } else {
          end = i;
          /** @type {number} */
          stop = x;
        }
        print((typeof size === "undefined" ? "" : '"' + size) + end, true);
      }
    }
  }
  /**
   * @return {undefined}
   */
  function check() {
    var refs = vim.buffers.getCurrentBuffer().getTextAreas();
    var ERROR_MAX;
    var i;
    var query = vim.input;
    var line;
    var total_pageviews_raw;
    var name;
    var error;
    if (!refs.exist(Cursor.getX(), Cursor.getY())) {
      vim.audio.play("error_beep");
      return;
    }
    if (array.length === 0) {
      vim.audio.play("error_beep");
      return;
    }
    line = array[0];
    if (line.charAt(0) === '"') {
      total_pageviews_raw = line.charAt(1);
      if (total_pageviews_raw >= "1" && total_pageviews_raw < "9") {
        /** @type {string} */
        total_pageviews_raw = (parseInt(total_pageviews_raw, 10) + 1).toString();
      }
      array[0] = '"' + total_pageviews_raw + line.substr(2);
    }
    error = stop;
    name = array[0];
    if (name.length > 2 && (name.charAt(0) === "d" || name.charAt(0) === "c") && (name.charAt(1) === "a" || name.charAt(1) === "i")) {
      name = name.charAt(0) + error + name.charAt(1) + name.substr(2);
      /** @type {number} */
      error = 1;
    } else {
      if (name.length === 2 && (name.charAt(0) === "d" || name.charAt(0) === "c")) {
        name = name.charAt(0) + error + name.charAt(1);
        /** @type {number} */
        error = 1;
      } else {
        if (name === "s") {
          name = error + name;
          /** @type {number} */
          error = 1;
        }
      }
    }
    /** @type {number} */
    ERROR_MAX = 0;
    for (; ERROR_MAX < error; ++ERROR_MAX) {
      parse(name, true);
      if (query.isInInputMode()) {
        /** @type {number} */
        i = 1;
        for (; i < array.length; ++i) {
          query.emulateInputModeInput(array[i]);
        }
      }
    }
  }
  /**
   * @param {number} index
   * @param {number} err
   * @return {undefined}
   */
  function start(index, err) {
    var a1 = vim.buffers.getCurrentBuffer();
    var state = Cursor.getX();
    var key = Cursor.getY();
    var self = a1.getTextAreas().get(state, key);
    var crossfilterable_layers;
    var k;
    var layer_i;
    var braceOpenIndex;
    var stack;
    var data;
    var params;
    var result;
    var variant_params;
    var i;
    var val;
    var sampleInput = vim.input;
    var s = vim.audio;
    var p = vim.model;
    var deadLockPanel = p.getTopX();
    var length = p.getTopY();
    if (!self) {
      s.play("error_beep");
      return;
    }
    if (!self.isBossMode() && self.isComplete(true)) {
      s.play("error_beep");
      text("No point in messing up\nsuch a nicely fixed text.");
      return;
    }
    stack = err ? self.undos : self.redos;
    variant_params = !err ? self.undos : self.redos;
    /** @type {number} */
    braceOpenIndex = 0;
    for (; braceOpenIndex < index; ++braceOpenIndex) {
      self = a1.getTextAreas().get(Cursor.getX(), Cursor.getY());
      if (p.isUndoRedoSkyText(self) && err && self.undos && self.undos.length === 0) {
        s.play("error_beep");
        if (braceOpenIndex === 0) {
          click("I shouldn't completely fix\nthis text. There might be\nmore information here...");
        }
        return;
      }
      if (!stack || stack.length === 0) {
        s.play("error_beep");
        if (braceOpenIndex === 0) {
          text("Already at " + (err ? "oldest" : "newest") + " change");
        }
        return;
      }
      params = stack.pop();
      if (typeof params === "string") {
        /** @type {string} */
        result = params;
        /** @type {*} */
        params = JSON.parse(result);
      }
      variant_params.push(params);
      data = err ? params.undo : params.redo;
      data.count = data.count || 1;
      Cursor.set(self.getTopX() + data.x, self.getTopY() + data.y - 1);
      /** @type {number} */
      k = 0;
      for (; k < data.count; ++k) {
        parse(data.command, false, true);
        if (sampleInput.isInInputMode()) {
          crossfilterable_layers = data.params.split("|");
          /** @type {number} */
          layer_i = 0;
          for (; layer_i < crossfilterable_layers.length; ++layer_i) {
            sampleInput.emulateInputModeInput(crossfilterable_layers[layer_i], true);
          }
        }
      }
      i = self.getTopX() + (typeof data.ax === "undefined" ? data.x : data.ax);
      /** @type {number} */
      val = self.getTopY() + (typeof data.ay === "undefined" ? data.y : data.ay) - 1;
      Cursor.set(i, val);
      if (!self.isBossMode()) {
        p.setTopX(deadLockPanel);
        p.setTopY(length);
      }
      vim.view.notifyLightning(i, val);
      f(i, val);
      if (braceOpenIndex === 0) {
        s.play("thunder");
      }
      if (braceOpenIndex + 1 === index && (state !== Cursor.getX() || key !== Cursor.getY())) {
        vim.view.notifyPointCursor(i, val);
      }
    }
  }
  /**
   * @param {string} key
   * @param {number} pos
   * @param {boolean} c
   * @param {boolean} e
   * @param {boolean} id
   * @param {string} data
   * @param {number} offset
   * @param {!Object} target
   * @param {number} value
   * @return {?}
   */
  function move(key, pos, c, e, id, data, offset, target, value) {
    var stackset = vim.view;
    var sampleInput = vim.input;
    var obj = data || Cursor.getX();
    var x = offset || Cursor.getY();
    var fc;
    var bg;
    var ctx;
    var options;
    var left;
    var i;
    var a0;
    var grid = vim.buffers.getCurrentBuffer().getTextAreas();
    var needDir;
    var bb;
    var bi;
    var ai;
    var context = target || vim.board;
    var input;
    var tabs;
    var p = vim.model;
    var meetDigit;
    var n;
    var e;
    if (typeof value !== "undefined") {
      /** @type {number} */
      ctx = value;
    } else {
      if (!grid.exist(obj, x)) {
        if (!id) {
          text("'" + key.charAt(0) + "' can only be used on text.");
          vim.audio.play("error_beep");
        }
        return false;
      }
      ctx = grid.get(obj, x);
      if (!ctx) {
        if (!id) {
          vim.audio.play("error_beep");
        }
        return false;
      }
    }
    if (ctx.isSacred()) {
      text("Erm... this seems to be one\nof the sacred texts. I'd rather\nstick to exact copy and paste\noperations.", true);
      vim.audio.play("error_beep");
      return false;
    }
    options = ctx.getSpecialArea(obj, x, true);
    if (options && options.type === "+" && ctx.getLineLength(x - ctx.getTopY()) === 1 && ctx.getLetter(obj, x) === " " && !context.isCodeBG(obj, x)) {
      /** @type {string} */
      key = "i";
    }
    switch(key) {
      case "i":
        /** @type {boolean} */
        fc = true;
        /** @type {boolean} */
        bg = false;
        /** @type {boolean} */
        a0 = false;
        left = obj;
        i = x;
        break;
      case "I":
        /** @type {boolean} */
        fc = true;
        /** @type {boolean} */
        bg = true;
        /** @type {boolean} */
        a0 = false;
        left = ctx.softBOLPos(obj, x).x;
        i = x;
        break;
      case "a":
        /** @type {boolean} */
        fc = false;
        /** @type {boolean} */
        bg = false;
        /** @type {boolean} */
        a0 = false;
        left = obj;
        i = x;
        break;
      case "A":
        /** @type {boolean} */
        fc = false;
        /** @type {boolean} */
        bg = false;
        /** @type {number} */
        left = ctx.getTopX() + ctx.getLineLength(x - ctx.getTopY()) - 1;
        i = x;
        /** @type {boolean} */
        a0 = true;
        break;
      default:
        if (!id) {
          vim.audio.play("error_beep");
        }
        return false;
    }
    options = ctx.getEmptySpecialArea(left, i, fc) || ctx.getSpecialArea(left, i) || ctx.getSpecialArea(left + (fc ? -1 : 1), i);
    if (!options && c === true) {
      options = ctx.getEmptyLineSpecialArea(left, i, true);
    }
    if (!options || options.type !== "*" && options.type !== "+" || options.originalText === "") {
      if (c !== true) {
        if (!id) {
          vim.audio.play("blocked");
          vim.view.notifyShowRangeAnimation(left, i, left, i, undefined, fc);
          text("There is no missing text there.");
        }
        return false;
      } else {
        if (!id && !options) {
          ctx.addNewSpecialArea(left, i, 0, "^*" + ret.length + "." + ret + ".^");
          options = ctx.getEmptySpecialArea(left, i, fc) || ctx.getSpecialArea(left, i) || ctx.getSpecialArea(left + (fc ? -1 : 1), i);
        } else {
          if (id && !options) {
            alert("Validation");
            return true;
          }
        }
      }
    }
    /** @type {boolean} */
    bb = i === options.startY ? left + (fc ? 0 : 1) > options.startX : left + (fc ? 0 : 1) > ctx.getTopX();
    /** @type {boolean} */
    bb = bb && context.getHeight(left - (fc ? 1 : 0), i) > 0;
    /** @type {boolean} */
    bi = i === options.endY ? left + (fc ? 0 : 1) < options.endX : left + (fc ? 0 : 1) < ctx.getTopX() + ctx.getLineLength(i - ctx.getTopY()) - 1;
    /** @type {boolean} */
    bi = bi && context.getHeight(left + (fc ? 0 : 1), i) > 0;
    input = options.originalText.split("\n");
    tabs = options.shownText.split("\n");
    /** @type {boolean} */
    ai = i - options.startY < input.length && input[i - options.startY].length > tabs[i - options.startY].length;
    /** @type {boolean} */
    needDir = !ai && !bi && !bb;
    if (needDir && c !== true) {
      if (!id) {
        vim.audio.play("blocked");
        vim.view.notifyShowRangeAnimation(left, i, left, i, undefined, fc);
        text("This will be a dead end to me; I won't\nbe able to add or delete text there.");
      }
      return false;
    }
    /** @type {number} */
    n = 0;
    e = left;
    for (; e >= ctx.getTopX() && context.getHeight(e, i) == 1;) {
      --e;
      ++n;
    }
    e = left + 1;
    for (; e <= ctx.getTopX() + ctx.getLineLength(i - ctx.getTopY()) - 1 && context.getHeight(e, i) == 1;) {
      ++e;
      ++n;
    }
    /** @type {boolean} */
    meetDigit = input.length >= tabs.length && input[i - options.startY].length > tabs[i - options.startY].length - n;
    if (!meetDigit && c !== true) {
      if (!id) {
        vim.audio.play("blocked");
        vim.view.notifyShowRangeAnimation(left, i, left, i, undefined, fc);
        text("This will be a dead end to me; I won't\nbe able to add any text there.");
      }
      return false;
    }
    if (!id) {
      stackset.notifyInputMode();
      vim.screens["game-screen"].hideGameMenu();
      Cursor.set(left + (fc ? 0 : 1), i);
      vim.model.readjustViewToCursorPosition();
      data = options;
      /** @type {!Array} */
      copy = [];
      /** @type {number} */
      indexIs = pos - 1;
      /** @type {boolean} */
      __result1 = e === true;
      tempChanges = options.shownText;
      sampleInput.switchToInputMode();
    }
    return true;
  }
  /**
   * @return {undefined}
   */
  function redraw() {
    var context = vim.view;
    var p = vim.model;
    var board = vim.board;
    var sampleInput = vim.input;
    var sampleRate = vim.audio;
    var obj = data;
    var ret = obj.textArea;
    var r = Cursor.getX();
    var s = Cursor.getY();
    var i;
    /** @type {boolean} */
    var changeParent = false;
    context.notifyCommandMode();
    vim.screens["game-screen"].showGameMenu();
    if (indexIs > 0 && (copy.length > 0 || __result1)) {
      if (!__result1 && tempChanges.length + (indexIs + 1) * (obj.shownText.length - tempChanges.length) > obj.originalText.length) {
        text("The resulting text of this repeating edit\nis longer than the missing text.\nIgnoring count.", true);
        /** @type {boolean} */
        changeParent = true;
      }
      if (!changeParent) {
        for (; indexIs > 0 && !changeParent;) {
          if (__result1) {
            /** @type {boolean} */
            changeParent = !extend("REPLAY_ENTER", true);
            if (changeParent) {
              break;
            }
          }
          /** @type {number} */
          i = 0;
          for (; i < copy.length; ++i) {
            /** @type {boolean} */
            changeParent = !extend(copy[i], true);
            if (changeParent) {
              break;
            }
          }
          --indexIs;
        }
        r = Cursor.getX();
        s = Cursor.getY();
        obj = data;
      }
    }
    if (obj.shownText === obj.originalText) {
      ret.applyGivenSpecialArea(obj);
      vim.model.clearTextAreaCellCache(ret);
      context.notifyBubbleUp(obj.startX, obj.startY, obj.originalText);
      vim.audio.play("deletion");
    }
    if (p.isValidCursorPosition(r - 1, s) && r - 1 >= ret.getTopX()) {
      /** @type {number} */
      r = r - 1;
    }
    get(r, s);
    ret.cursorPositionUpdate(r, s);
    if (obj.shownText === obj.originalText) {
      add(ret);
    }
  }
  /**
   * @param {!Function} arr
   * @param {?} name
   * @return {?}
   */
  function send(arr, name) {
    /** @type {!Function} */
    var joined = arr;
    var self = name ? vim.buffers.getBuffer(name) : vim.buffers.getCurrentBuffer();
    var Storage = self.getBoard();
    var log = self.getEntities();
    var message;
    var list;
    var i;
    var keywordResults;
    var data;
    var a6;
    /** @type {number} */
    message = 0;
    for (; message < joined.getNumberOfLines(); message = message + 1) {
      data = joined.getLineLength(message);
      for (; Storage.isCodeBG(joined.getTopX() + data, joined.getTopY() + message);) {
        data++;
      }
      /** @type {number} */
      list = 0;
      for (; list < data; list = list + 1) {
        if (log.exist(joined.getTopX() + list, joined.getTopY() + message)) {
          keywordResults = log.list(joined.getTopX() + list, joined.getTopY() + message);
          /** @type {boolean} */
          a6 = false;
          /** @type {number} */
          i = 0;
          for (; i < keywordResults.length; i = i + 1) {
            if (keywordResults[i] instanceof ClosedChest) {
              /** @type {boolean} */
              a6 = true;
              break;
            }
          }
          if (a6) {
            return keywordResults[i].isInvisible();
          } else {
            /** @type {number} */
            i = 0;
            for (; i < keywordResults.length; i = i + 1) {
              if (keywordResults[i] instanceof PlusMinus) {
                return true;
              } else {
                if (keywordResults[i].isInvisible() === true) {
                  return true;
                }
              }
            }
          }
        }
      }
    }
    return false;
  }
  /**
   * @param {!Function} arr
   * @param {boolean} name
   * @return {?}
   */
  function remove(arr, name) {
    /** @type {!Function} */
    var joined = arr;
    var self = name ? vim.buffers.getBuffer(name) : vim.buffers.getCurrentBuffer();
    var Storage = self.getBoard();
    var log = self.getEntities();
    return function() {
      var message;
      var list;
      var i;
      var players;
      var data;
      var a1;
      /** @type {number} */
      message = 0;
      for (; message < joined.getNumberOfLines(); message = message + 1) {
        data = joined.getLineLength(message);
        for (; Storage.isCodeBG(joined.getTopX() + data, joined.getTopY() + message);) {
          data++;
        }
        /** @type {number} */
        list = 0;
        for (; list < data; list = list + 1) {
          if (log.exist(joined.getTopX() + list, joined.getTopY() + message)) {
            players = log.list(joined.getTopX() + list, joined.getTopY() + message);
            /** @type {boolean} */
            a1 = false;
            /** @type {number} */
            i = 0;
            for (; i < players.length; i = i + 1) {
              if (players[i] instanceof ClosedChest) {
                /** @type {boolean} */
                a1 = true;
                break;
              }
            }
            if (a1) {
              players[i].setInvisible(false);
              vim.view.notifyAppearingGlow(joined.getTopX() + list, joined.getTopY() + message, name);
            } else {
              /** @type {number} */
              i = 0;
              for (; i < players.length; i = i + 1) {
                if (players[i] instanceof PlusMinus) {
                  players[i].collect();
                } else {
                  if (players[i].isInvisible() === true) {
                    players[i].setInvisible(false);
                    vim.view.notifyAppearingGlow(joined.getTopX() + list, joined.getTopY() + message, name);
                  }
                }
              }
            }
          }
        }
      }
    };
  }
  /**
   * @param {!Object} self
   * @return {undefined}
   */
  function change(self) {
    var j;
    var value;
    var ba;
    var currentText;
    var last_y1;
    var a4;
    var bb;
    var aZ;
    var Math = vim.board;
    var y;
    var dimm_size;
    var a0;
    var bc;
    var i;
    var aV;
    var r;
    var expected;
    if (self.type !== "*" && self.startX >= self.endX) {
      return;
    }
    /** @type {boolean} */
    bc = self.originalText.indexOf("\n") !== -1;
    /** @type {boolean} */
    aV = self.emptyLine === true;
    currentText = self.textArea;
    if (aV) {
      i = self.originalText.split("\n").length;
      expected = vim.model.getEndOfCodeBlocks(currentText.getTopX(), self.startY, true);
      r = Math.getBG(expected, self.startY);
      if (Math.getBG(expected - 1, self.startY) === Math.MISSING) {
        r = Math.SKY_MISSING;
      }
      /** @type {number} */
      dimm_size = 0;
      /** @type {number} */
      j = currentText.getTopY() + currentText.getNumberOfLines() - 1;
      for (; j >= self.startY + i; --j) {
        if (currentText.getLineLength(j - currentText.getTopY()) > dimm_size) {
          dimm_size = currentText.getLineLength(j - currentText.getTopY());
        }
      }
      /** @type {number} */
      j = currentText.getTopY() + currentText.getNumberOfLines() - 1;
      for (; j >= self.startY + i; --j) {
        value = currentText.getTopX();
        for (; value < currentText.getTopX() + dimm_size; ++value) {
          Math.setBG(value, j, Math.getBG(value, j - i));
        }
      }
      vim.view.doDraw();
      /** @type {number} */
      j = 0;
      for (; j < i; ++j) {
        /** @type {number} */
        expected = Math.max(vim.model.getEndOfCodeBlocks(currentText.getTopX(), self.startY + j, true), currentText.getTopX() + currentText.getLineLength(self.startY - currentText.getTopY() + j));
        /** @type {number} */
        value = 0;
        for (; value < expected - currentText.getTopX(); ++value) {
          if (value < currentText.getLineLength(self.startY - currentText.getTopY() + j)) {
            Math.setBG(currentText.getTopX() + value, self.startY + j, Math.PLAIN);
          } else {
            Math.setBG(currentText.getTopX() + value, self.startY + j, r);
          }
        }
      }
    } else {
      if (!bc) {
        last_y1 = currentText.getTopX() + currentText.getLineLength(self.startY - currentText.getTopY());
        i = self.originalText.length;
        /** @type {number} */
        y = last_y1 - 1;
        for (; y > self.startX + i - 1; --y) {
          Math.setBG(y, self.startY, Math.getBG(y - i, self.startY));
        }
        /** @type {number} */
        y = 0;
        for (; y < i; ++y) {
          Math.setBG(self.startX + y, self.startY, Math.PLAIN);
        }
      } else {
      }
    }
  }
  /**
   * @param {!Object} data
   * @param {number} target
   * @return {undefined}
   */
  function restart(data, target) {
    var x;
    var i;
    var a6;
    var min;
    var max;
    var w;
    var assert = vim.board;
    var left;
    var f;
    var value;
    var start;
    if (data.type !== "d" && data.type !== "x") {
      return;
    }
    if (data.eols === 0) {
      min = vim.model.getEndOfCodeBlocks(data.endX, data.endY);
      left = data.startX;
      x = data.endX + 1;
      for (; x < min; ++x) {
        assert.setBG(left, data.startY, assert.getBG(x, data.startY));
        ++left;
      }
      for (; left < min;) {
        assert.setBG(left, data.startY, assert.getBG(min, data.startY));
        ++left;
      }
    } else {
      f = data.textArea.getTopX();
      if (f === data.startX && data.endY - data.startY + 1 === data.eols) {
        /** @type {number} */
        w = target;
        /** @type {number} */
        value = 0;
        x = data.startY;
        for (; x < w - data.eols; ++x) {
          min = vim.model.getEndOfCodeBlocks(f, x + data.eols);
          max = vim.model.getEndOfCodeBlocks(f, x);
          /** @type {number} */
          value = Math.max(value, min, max);
          start = vim.model.getStartOfCodeBlocks(f, x) + 1;
          i = start;
          for (; i < max || i < min; ++i) {
            assert.setBG(i, x, assert.getBG(i, x + data.eols));
          }
        }
        for (; x < w; ++x) {
          max = vim.model.getEndOfCodeBlocks(f, x);
          /** @type {number} */
          value = Math.max(value, max);
          start = vim.model.getStartOfCodeBlocks(f, x);
          i = start;
          for (; i < value; ++i) {
            assert.setBG(i, x, assert.getBG(i, w));
          }
        }
      } else {
      }
    }
  }
  /**
   * @param {!Object} data
   * @return {undefined}
   */
  function events(data) {
    var i;
    var x;
    var result = data.textArea;
    var eleSize;
    var me = vim.buffers.getCurrentBuffer().getEntities();
    if (data.startY === data.endY) {
      x = data.startX;
      for (; x <= data.endX; ++x) {
        me.deleteAtPosition(x, data.startY, true);
        result.removeFromSinkList(x, data.startY);
      }
    } else {
      i = result.getTopY();
      for (; i < Math.max(result.getTopY() + result.getNumberOfLines(), data.endY + 1); ++i) {
        eleSize = vim.model.getEndOfCodeBlocks(result.getTopX(), i);
        x = result.getTopX();
        for (; x < eleSize; ++x) {
          if (i === data.startY && x >= data.startX || i === data.endY && x <= data.endX || i > data.startY && i < data.endY) {
            me.deleteAtPosition(x, i, true);
            result.removeFromSinkList(x, i);
          }
        }
      }
    }
  }
  /**
   * @param {!Object} data
   * @return {undefined}
   */
  function step(data) {
    var y;
    var idx;
    var a3;
    var me;
    var a1;
    var s = vim.board;
    var n;
    var aV;
    var aX;
    var i;
    var a5;
    var result = vim.buffers.getCurrentBuffer().getEntities();
    if (data.type !== "*" && data.startX >= data.endX) {
      return;
    }
    /** @type {boolean} */
    a5 = data.emptyLine === true;
    /** @type {boolean} */
    aX = data.originalText.indexOf("\n") !== -1;
    me = data.textArea;
    if (a5) {
      i = data.originalText.split("\n").length;
      /** @type {number} */
      y = me.getTopY() + me.getNumberOfLines() - 1;
      for (; y >= data.startY; --y) {
        idx = me.getTopX();
        for (; idx < me.getTopX() + me.getLineLength(y - me.getTopY()); ++idx) {
          result.shiftUp(idx, y, -i, false);
          me.changeSinkListY(idx, y, y + i);
          me.updateLocalMarkY(idx, y, y + i);
          vim.model.updateGlobalMarkY(idx, y, y + i);
        }
      }
    } else {
      if (!aX) {
        a1 = me.getTopX() + me.getLineLength(data.startY - me.getTopY());
        i = data.originalText.length;
        /** @type {number} */
        n = a1 - 1;
        for (; n > data.startX + i - 1; --n) {
          result.shiftLeft(n, data.startY, -i, true);
          me.changeSinkListX(n, data.startY, n + i);
        }
      } else {
      }
    }
  }
  /**
   * @param {!Object} data
   * @param {number} event
   * @return {undefined}
   */
  function push(data, event) {
    var end;
    var h;
    var shortest;
    var lastNotificationEvent;
    var s = vim.board;
    /** @type {boolean} */
    var touch = data.startY !== data.endY;
    var c = data.textArea;
    var t = vim.buffers.getCurrentBuffer().getEntities();
    shortest = vim.model.getEndOfCodeBlocks(data.endX, data.endY);
    h = data.endX + 1;
    for (; h < shortest; ++h) {
      t.shiftLeft(h, data.endY, data.endX - (touch ? c.getTopX() : data.startX) + 1, true);
      c.changeSinkListX(h, data.endY, h - (data.endX - (touch ? c.getTopX() : data.startX) + 1));
    }
    if (data.eols > 0) {
      /** @type {number} */
      lastNotificationEvent = event;
      end = data.endY;
      for (; end < lastNotificationEvent; ++end) {
        shortest = vim.model.getEndOfCodeBlocks(data.textArea.getTopX(), end);
        h = data.textArea.getTopX();
        for (; h < shortest; ++h) {
          t.shiftUp(h, end, data.eols, false);
          c.changeSinkListY(h, end, end - data.eols);
        }
      }
    }
  }
  /**
   * @param {number} width
   * @param {boolean} height
   * @param {!Array} minHeight
   * @return {undefined}
   */
  function getHeight(width, height, minHeight) {
    callback("x", width, height, minHeight, false, true, false);
  }
  /**
   * @param {number} msg
   * @param {boolean} code
   * @param {!Array} t
   * @return {undefined}
   */
  function runTest(msg, code, t) {
    if (vim.validKeys.isValid("x")) {
      callback("dh", msg, code, t, false, true, false);
    } else {
      vim.audio.play("blocked");
    }
  }
  /**
   * @param {number} b
   * @param {boolean} offset
   * @param {!Array} minHeight
   * @return {undefined}
   */
  function open(b, offset, minHeight) {
    if (vim.validKeys.isValid("d") && vim.validKeys.isValid("$")) {
      callback("d$", b, offset, minHeight, false, true, false);
    } else {
      vim.audio.play("blocked");
    }
  }
  /**
   * @param {!Function} key
   * @param {?} callback
   * @return {?}
   */
  function add(key, callback) {
    var self = vim.buffers.getCurrentBuffer();
    var a2 = self.getBoard();
    var values = self.getTextAreas().get(Cursor.getX(), Cursor.getY());
    var changedRadioControls = self.getEntities();
    var p = vim.model;
    var crossfilterable_layers;
    var joinURL;
    var layer_i;
    if (p.isPreBossUndergroundText(key) && key.isComplete()) {
      vim.input.disableKeys();
      vim.audio.play("text_restored");
      vim.view.notifyTextCompleted(key, function() {
        self.getTextAreas().exterminate(key.getTopX(), key.getTopY());
        vim.buffers.getBuffer("lorem").getEntities().invalidateCursorNPCs();
        vim.buffers.getBuffer("underground").load('{"buffer":"underground","levelNumber":14,"addX":411,"addY":411,"bg":["++++++++++++++++++++++++++++++++","++++++++++++++++++++++++++++++++","++++++++++++++++++++++++++++++++","++++++++++++++++++++++++++++++++","++++++++++++++++++++++++++++++++","++++++++++++++++++++++++++++++++","++++++++++++++++++++++++++++++++","++++++++++++++++++++++++++++++++","++++++++++++++++++++++++++++++++","++++++++++++++++++++++++++++++++","++++++++++++++++++++++++++++++++","++++++++++++++++++++++++++++++++","++++++++++++++++++++++++++++++++","++++++++++++++++++++++++++++++++","++++++++++++++++++++++++++++++++","++++++++++++++++++++++++++++++++","++++++++++++++++++++++++++++++++","++++++++++++++++++++++++++++++++","                                "],"entities":[{"type":"red_bug","x":30,"y":3,"data":{"vol":"Charity","volHidden":true}},{"type":"red_bug","x":30,"y":14,"data":{"vol":"Bram","volHidden":true}},{"type":"red_bug","x":30,"y":16,"data":{"vol":"Uganda","volHidden":true}},{"type":"big_bug","x":27,"y":7,"data":{"hitpoints":5}}],"textareas":[{"x":0,"y":0,"limit":0,"bossMode":true,"shouldClean":" ","alwaysSink":false,"text":"VIM is Charityware.  You can use\\nand copy it as much as you like,\\nbut you are encouraged to make a\\ndonation for needy children in  \\nUganda.  Please see |kcc| below \\nor visit the ICCF web site,     \\navailable at these URLs:        \\n                                \\n  http://iccf-holland.org/      \\n  http://www.vim.org/iccf/      \\n  http://www.iccf.nl/           \\n                                \\nYou can also sponsor the        \\ndevelopment of VIM. VIM sponsors\\ncan vote for features.          \\nThe money goes to Uganda anyway.\\n                                \\n Bram Moolenaar (:help Uganda)  ","undos":["{ \\"undo\\" : { \\"x\\":19,\\"y\\":4,\\"command\\":\\"cw\\",\\"params\\":\\"p|e|n|g|u|i|n|s|ESC\\"}, \\"redo\\" : { \\"x\\":19,\\"y\\":4,\\"command\\":\\"cw\\",\\"params\\":\\"c|h|i|l|d|r|e|n|ESC\\"}}","{ \\"undo\\" : { \\"x\\":22,\\"y\\":5,\\"command\\":\\"c1l\\",\\"params\\":\\"f|ESC\\"}, \\"redo\\" : { \\"x\\":22,\\"y\\":5,\\"command\\":\\"c1l\\",\\"params\\":\\"c|ESC\\"}}","{ \\"undo\\" : { \\"x\\":0,\\"y\\":5,\\"command\\":\\"cf \\",\\"params\\":\\"B|u|g|l|a|n|d|.|ESC\\"}, \\"redo\\" : { \\"x\\":0,\\"y\\":5,\\"command\\":\\"cW\\",\\"params\\":\\"U|g|a|n|d|a|.| |ESC\\"}}","{ \\"undo\\" : { \\"x\\":7,\\"y\\":1,\\"command\\":\\"ctw\\",\\"params\\":\\"A|w|e|s|o|m|e|ESC\\"}, \\"redo\\" : { \\"x\\":7,\\"y\\":1,\\"command\\":\\"c2tw\\",\\"params\\":\\"C|h|a|r|i|t|y|ESC\\"}}","{ \\"undo\\" : { \\"x\\":2,\\"y\\":9,\\"command\\":\\"ct:\\",\\"params\\":\\"f|i|l|e|ESC\\"}, \\"redo\\" : { \\"x\\":2,\\"y\\":9,\\"command\\":\\"ct:\\",\\"params\\":\\"h|t|t|p|ESC\\"}}","{ \\"undo\\" : { \\"x\\":2,\\"y\\":10,\\"command\\":\\"ct:\\",\\"params\\":\\" |f|t|p|ESC\\"}, \\"redo\\" : { \\"x\\":2,\\"y\\":10,\\"command\\":\\"ct:\\",\\"params\\":\\"h|t|t|p|ESC\\"}}","{ \\"undo\\" : { \\"x\\":2,\\"y\\":11,\\"command\\":\\"ct:\\",\\"params\\":\\"s|n|m|p|ESC\\"}, \\"redo\\" : { \\"x\\":2,\\"y\\":11,\\"command\\":\\"ct:\\",\\"params\\":\\"h|t|t|p|ESC\\"}}","{ \\"undo\\" : { \\"x\\":17,\\"y\\":18,\\"command\\":\\"ct)\\",\\"params\\":\\"s|a|v|e| |B|u|g|l|a|n|d|ESC\\"}, \\"redo\\" : { \\"x\\":17,\\"y\\":18,\\"command\\":\\"ct)\\",\\"params\\":\\":|h|e|l|p| |U|g|a|n|d|a|ESC\\"}}","{ \\"undo\\" : { \\"x\\":2,\\"y\\":14,\\"command\\":\\"cw\\",\\"params\\":\\"p|r|e|c|a|t|i|o|n|ESC\\"}, \\"redo\\" : { \\"x\\":2,\\"y\\":14,\\"command\\":\\"cw\\",\\"params\\":\\"v|e|l|o|p|m|e|n|t|ESC\\"}}","{ \\"undo\\" : { \\"x\\":4,\\"y\\":15,\\"command\\":\\"c2w\\",\\"params\\":\\"d|o|w|n|v|o|t|e|ESC\\"}, \\"redo\\" : { \\"x\\":4,\\"y\\":15,\\"command\\":\\"cw\\",\\"params\\":\\"v|o|t|e| |f|o|r|ESC\\"}}"],"undoRedos":[]}]}');
        p.clearCellCache();
        crossfilterable_layers = changedRadioControls.listOnText(values);
        /** @type {number} */
        layer_i = 0;
        for (; layer_i < crossfilterable_layers.length; ++layer_i) {
          if (crossfilterable_layers[layer_i] instanceof RedBug || crossfilterable_layers[layer_i] instanceof BigBug) {
            crossfilterable_layers[layer_i].freeze();
          }
        }
        window.setTimeout(function() {
          crossfilterable_layers = changedRadioControls.listOnText(values);
          /** @type {number} */
          layer_i = 0;
          for (; layer_i < crossfilterable_layers.length; ++layer_i) {
            if (crossfilterable_layers[layer_i] instanceof RedBug || crossfilterable_layers[layer_i] instanceof BigBug) {
              crossfilterable_layers[layer_i].unfreeze();
            }
          }
        }, 5000);
        vim.view.recalcTopXY();
        vim.input.enableKeys();
      });
    } else {
      if (p.isBossUndergroundText(key) && key.isComplete()) {
        vim.input.disableKeys();
        vim.stats.endLevel(vim.model.getLevel());
        vim.stats.startLevel(vim.model.getLevel() + 1);
        vim.stats.invalidateLevelStats(vim.model.getLevel() + 1);
        vim.screens["game-screen"].hideGameMenu();
        /** @type {string} */
        joinURL = "level=15&stats=" + encodeURIComponent(vim.stats.marshal());
        vim.fetcher.getUrl("php/level.php?level=15", function() {
        }, function() {
        }, vim.emailaddr || "", vim.password || "", undefined, undefined, joinURL);
        vim.view.notifyFadeOutAnimation(function() {
          vim.model.setEndgame();
          vim.screens["game-screen"].runEnding();
        });
      } else {
        if (key.isComplete() && (!key.hasMarkSpecialAreas() || send(key, callback))) {
          if (key === values) {
            vim.model.clearKeypressCountdown();
            vim.view.notifyTextCompleted(key);
            vim.audio.play("text_restored");
          }
          window.setTimeout(remove(key, callback), 1250);
          return true;
        }
      }
    }
    return false;
  }
  /**
   * @param {number} data
   * @return {?}
   */
  function render(data) {
    var b = Cursor.getX();
    var r = Cursor.getY();
    var c = vim.buffers.getCurrentBuffer().getTextAreas().get(b, r);
    var options = c ? c.getSpecialArea(b, r) : undefined;
    /** @type {boolean} */
    var result = false;
    /** @type {number} */
    var min = !c ? 0 : Math.min(data, c.getLineLength(r - c.getTopY()) - (b - c.getTopX()));
    var i;
    var char;
    var left;
    /** @type {boolean} */
    result = typeof c === "undefined";
    /** @type {boolean} */
    result = result || typeof options === "undefined";
    if (!result && options.type === "+") {
      return fn("~", data, c, options);
    }
    /** @type {boolean} */
    result = result || options.startX !== b || options.endX !== b + min - 1;
    /** @type {boolean} */
    result = result || options.type !== "r" && options.type !== "*";
    /** @type {boolean} */
    result = result || options.type === "*" && !options.inplace;
    if (!result) {
      left = options.endX + (options.endX + 1 - c.getTopX() < c.getLineLength(options.endY - c.getTopY()) ? 1 : 0);
      /** @type {boolean} */
      result = result || !vim.model.isValidCursorPosition(left, options.endY);
    }
    if (!result) {
      /** @type {number} */
      i = 0;
      for (; i < min; ++i) {
        char = c.getLetter(options.startX + i, options.startY);
        if (char >= "a" && char <= "z") {
          char = char.toUpperCase();
        } else {
          char = char.toLowerCase();
        }
        if (char !== (min === 1 ? options.originalCharacter : options.originalText.charAt(i))) {
          /** @type {boolean} */
          result = true;
          break;
        }
      }
    }
    if (result) {
      if (c) {
        vim.view.notifyShowRangeAnimation(b, r, b + data - 1, r, c);
      }
      vim.audio.play("error_beep");
    } else {
      c.applySpecialArea(b, r);
      /** @type {number} */
      i = min;
      for (; i--;) {
        vim.model.recacheCell(options.startX + i, options.startY);
      }
      get(left, options.endY);
      if (vim.board.getBG(left, options.endY) !== vim.board.MISSING && vim.board.getBG(left, options.endY) !== vim.board.SKY_MISSING) {
        c.cursorPositionUpdate(left, options.endY);
      }
      vim.audio.play("deletion");
      add(c);
      if (vim.board.getBG(left, options.endY) === vim.board.MISSING || vim.board.getBG(left, options.endY) === vim.board.SKY_MISSING) {
        vim.input.disableKeys();
        hide();
        vim.view.notifyFallingCursorAnimation(options.endX, options.endY, vim.buffers.getCurrentBuffer().getName());
        vim.audio.play("fall");
        vim.stats.incDeaths(vim.model.getLevel());
      }
    }
  }
  /**
   * @param {number} v
   * @param {number} x
   * @param {string} type
   * @param {string} error
   * @param {!Object} arg1
   * @return {?}
   */
  function debug(v, x, type, error, arg1) {
    return {
      x : v,
      y : x,
      newText : type,
      errorMsg : error,
      operation : arg1
    };
  }
  /**
   * @param {string} s
   * @param {number} i
   * @param {!Object} elem
   * @param {!Object} options
   * @return {?}
   */
  function register(s, i, elem, options) {
    var x = Cursor.getX();
    var mediaQueryStack = Cursor.getY();
    var whichFriend;
    /** @type {number} */
    var pos = x - options.startX;
    /** @type {string} */
    var c = "";
    var saltLen = s.charAt(1);
    var sessionId;
    if (options.shownText.length < pos + i) {
      /** @type {string} */
      sessionId = "I won't change text out of the required area.";
    } else {
      /** @type {number} */
      whichFriend = 0;
      for (; whichFriend < i; ++whichFriend) {
        /** @type {string} */
        c = c + saltLen;
      }
      c = options.shownText.substring(0, pos) + c + options.shownText.substring(pos + i);
      /** @type {number} */
      x = x + i - 1;
    }
    return debug(x, mediaQueryStack, c, sessionId);
  }
  /**
   * @param {string} local
   * @param {number} size
   * @param {!Object} selector
   * @param {!Object} options
   * @return {?}
   */
  function verify(local, size, selector, options) {
    var x = Cursor.getX();
    var mediaQueryStack = Cursor.getY();
    var i;
    /** @type {number} */
    var offset = x - options.startX;
    /** @type {string} */
    var value = "";
    var aW = local.charAt(1);
    var sessionId;
    var char;
    if (options.shownText.length < offset + size) {
      /** @type {string} */
      sessionId = "I won't change text out of the required area.";
    } else {
      /** @type {number} */
      i = 0;
      for (; i < size; ++i) {
        char = options.shownText.charAt(offset + i);
        if (char >= "a" && char <= "z") {
          value = value + char.toUpperCase();
        } else {
          value = value + char.toLowerCase();
        }
      }
      value = options.shownText.substring(0, offset) + value + options.shownText.substring(offset + size);
      x = x + size;
    }
    return debug(x, mediaQueryStack, value, sessionId);
  }
  /**
   * @param {string} direction
   * @param {number} elem
   * @param {!Object} ctx
   * @param {!Object} options
   * @param {!Object} data
   * @param {boolean} step
   * @param {boolean} cb
   * @param {string} el
   * @param {string} a
   * @param {boolean} id
   * @return {?}
   */
  function next(direction, elem, ctx, options, data, step, cb, el, a, id) {
    var x = data.sx;
    var y = data.sy;
    var bu;
    /** @type {string} */
    var res = "";
    var message;
    var width = data.ex;
    var i = data.ey;
    /** @type {boolean} */
    var polar = false;
    var me = vim.view;
    var s = vim.board;
    var value;
    var names;
    var j;
    var index;
    var newBanIsRemoved;
    var key = direction === "x" ? "x" : direction.substr(1);
    /** @type {number} */
    var bf = parseInt(key, 10) || 1;
    var reduced = key.substr(isNaN(parseInt(key, 10)) || key === "0" ? 0 : ("" + parseInt(key, 10)).length);
    var b;
    var ret;
    var hasAttempts;
    var start;
    /** @type {boolean} */
    var oldBanIsPerm = false;
    var idStr;
    var result;
    var f;
    var c;
    var n;
    var pasteData;
    var bh;
    /** @type {boolean} */
    tag = false;
    /** @type {boolean} */
    dir = false;
    if (!(data.sy === data.ey && x <= width || data.sy < data.ey)) {
      x = width;
      y = i;
      width = data.sx;
      i = data.sy;
      data.sx = x;
      data.sy = y;
      data.ex = width;
      data.ey = i;
    }
    /** @type {boolean} */
    dir = ctx.getTopX() + ctx.getLineLength(i - ctx.getTopY()) - 1 === width;
    if (el && typeof a === "undefined") {
      /** @type {string} */
      a = dir ? "a" : "i";
    }
    if (data.sy === data.ey && data.linewise !== true) {
      /** @type {boolean} */
      cb = true;
    }
    if (id && !options) {
      pasteData = ctx.getRangeText(data);
      /** @type {string} */
      bh = "^*0.." + pasteData + "^";
      ctx.addNewSpecialArea(data.sx, data.sy, pasteData.length, bh);
      options = ctx.getSpecialArea(data.sx, data.sy);
    }
    /** @type {boolean} */
    polar = polar || i < options.startY || i > options.endY;
    /** @type {boolean} */
    polar = polar || i === options.startY && width < options.startX;
    /** @type {boolean} */
    polar = polar || i === options.endY && width > options.endX;
    if (!polar) {
      b = {
        startX : x,
        startY : y,
        endX : width,
        endY : i,
        bol : x === ctx.getTopX(),
        eol : width === ctx.getTopX() + ctx.getLineLength(i - ctx.getTopY()) - 1
      };
      hasAttempts = options.bol && options.eol && data.linewise !== true && options.type !== "+";
      if (!hasAttempts) {
        if (!data.linewise && options.type === "+" && ctx.getLineLength(y - ctx.getTopY()) === 1 && ctx.getLetter(x, y) === " " && !s.isCodeBG(x, y)) {
          /** @type {boolean} */
          tag = true;
          return debug(x, y, " ", "NOP", undefined);
        }
        names = test(ctx, b, reduced, cb);
        j = names.beforeX;
        index = names.beforeY;
        /** @type {boolean} */
        newBanIsRemoved = !vim.model.isValidCursorPosition(j, index) || s.getBG(j, index) === s.MISSING || s.getBG(j, index) === s.SKY_MISSING || s.getBG(j, index) === s.DARK;
        if (newBanIsRemoved && el) {
          f = new Board;
          f.setFillerBG(s.getFillerBG());
          c = TextArea.prototype.restore(ctx.getData());
          n = c.getSpecialArea(options.startX, options.startY);
          value = ctx.getTextInRange(x, y, width, i);
          if (data.sy === data.ey && data.linewise !== true) {
            ret = handler(ctx, options, x, y, value.length, cb, f);
          } else {
            ret = refresh(ctx, options, x, y, value, cb, f);
          }
          res = filter(options, data, b, value, cb);
          result = debug(names.afterX, names.afterY, res, message, ret);
          validate(result, c, n, false, f);
          /** @type {boolean} */
          oldBanIsPerm = !move(a, 1, id, undefined, true, names.afterX, names.afterY, f, c);
        }
      }
    }
    idStr = id ? 0 : error(data.sx, data.sy, data.ex, data.ey);
    if (polar) {
      /** @type {string} */
      message = "I won't change text out of the required area.";
      me.notifyShowRangeAnimation(x, y, width, i, ctx);
    } else {
      if (hasAttempts) {
        if (data.linewise !== true) {
          /** @type {string} */
          message = "The deleted range should be linewise (i.e. include the\nwhole line along with the following end of line character).";
        } else {
          /** @type {string} */
          message = "The deleted range shouldn't be linewise (i.e. it\nshouldn't include the following end of line character).";
        }
      } else {
        if (newBanIsRemoved && (!el || oldBanIsPerm)) {
          /** @type {string} */
          message = "I won't have a valid location after delete.";
          me.notifyShowRangeAnimation(j, index, j, index, undefined);
        } else {
          if (idStr > 0) {
            /** @type {string} */
            message = "I should probably get\nrid of " + (idStr > 1 ? "these bugs" : "this bug") + " first.";
          } else {
            value = ctx.getTextInRange(x, y, width, i);
            start = s.getBG(vim.model.getEndOfCodeBlocks(x, y), y);
            if (s.getBG(vim.model.getEndOfCodeBlocks(x, y) - 1, y) === s.MISSING) {
              start = s.SKY_MISSING;
            }
            if (!vim.validKeys.isValid(data.linewise ? "o" : "i") && !el && value.length === options.shownText.length && !(data.linewise && cb)) {
              /** @type {string} */
              message = "It's not a good idea to delete the whole range\nwithout entering insert mode to add some text here.\nWait until you have the '" + (data.linewise ? "o" : "i") + "' key to do this...";
            } else {
              if (!data.linewise && !el && cb && value.length === options.shownText.length && start === s.SKY_MISSING) {
                /** @type {string} */
                message = "This will leave me standing on air.\nYou can either use a command\nthat also enters insert mode, or\nmake the deletion linewise.";
              } else {
                me.notifyShowRangeAnimation(x, y, width, i, ctx);
                if (data.sy === data.ey && data.linewise !== true) {
                  ret = handler(ctx, options, x, y, value.length, cb);
                } else {
                  ret = refresh(ctx, options, x, y, value, cb);
                }
                res = filter(options, data, b, value, cb);
                vim.regs.doDelete(value + (data.linewise ? "\n" : ""), step);
                /** @type {string} */
                ret = value + (data.linewise ? "\n" : "");
                /** @type {boolean} */
                tag = true;
              }
            }
          }
        }
      }
    }
    return debug(polar || hasAttempts ? x : names.afterX, polar || hasAttempts ? y : names.afterY, res, message, ret);
  }
  /**
   * @param {!Object} data
   * @param {!Object} obj
   * @param {!Object} source
   * @param {string} value
   * @param {!Object} to
   * @return {?}
   */
  function filter(data, obj, source, value, to) {
    var index;
    var visibleLayers;
    var ret;
    var ip_segments;
    var length = obj.sx;
    var count = obj.sy;
    if (data.shownText.indexOf("\n") === -1) {
      /** @type {number} */
      index = length - data.startX;
      visibleLayers = data.shownText.substring(0, index) + (source.bol && source.eol && to ? " " : "") + data.shownText.substring(index + value.length);
    } else {
      ret = data.shownText.split("\n");
      if (obj.linewise) {
        if (to === true) {
          ret.splice(count - data.startY, obj.ey - obj.sy + 1, " ");
        } else {
          ret.splice(count - data.startY, obj.ey - obj.sy + 1);
        }
      } else {
        if (value.indexOf("\n") !== -1) {
          ip_segments = value.split("\n");
          ret[count - data.startY] = ret[count - data.startY].substr(0, length - (count === data.startY ? data.startX : data.textArea.getTopX()));
          if (ret[obj.ey - data.startY].length === ip_segments[ip_segments.length - 1].length) {
            ret.splice(obj.ey - data.startY, 1);
          } else {
            ret[obj.ey - data.startY] = ret[obj.ey - data.startY].substring(obj.ex - data.startX + 1);
            ret[count - data.startY] += ret[obj.ey - data.startY];
            ret.splice(obj.ey - data.startY, 1);
          }
          if (obj.ey - count - 1 > 0) {
            ret.splice(count - data.startY + 1, obj.ey - count - 1);
          }
        } else {
          /** @type {number} */
          index = length - (count === data.startY ? data.startX : data.textArea.getTopX());
          ret[count - data.startY] = ret[count - data.startY].substring(0, index) + (source.bol && source.eol && to ? " " : "") + ret[count - data.startY].substring(index + value.length);
        }
      }
      visibleLayers = ret.join("\n");
    }
    return visibleLayers;
  }
  /**
   * @param {string} name
   * @param {number} fn
   * @param {!Object} self
   * @param {!Object} options
   * @param {string} path
   * @param {boolean} rev
   * @return {?}
   */
  function main(name, fn, self, options, path, rev) {
    var i;
    var b = Cursor.getX();
    var value = Cursor.getY();
    var url;
    var end;
    /** @type {string} */
    var type = "";
    var sessionId;
    var s = vim.view;
    var div = vim.board;
    var aV;
    var bd;
    var bc;
    var result;
    var aW;
    var bk;
    var isVertical;
    var message;
    var manifests;
    var encrypted;
    var a1;
    /** @type {boolean} */
    tag = false;
    /** @type {boolean} */
    a1 = path === "\n" || path === " \n";
    /** @type {boolean} */
    aW = path.charAt(path.length - 1) === "\n";
    /** @type {boolean} */
    isVertical = name.charAt(0) === "P";
    /** @type {boolean} */
    bk = path.indexOf("\n") !== -1;
    if (aW) {
      path = path.substr(0, path.length - 1);
    }
    if (aW && (options.bol === false || options.eol === false)) {
      if (a1) {
        /** @type {string} */
        sessionId = "Can't open another line.\nThat's not a linewise range.";
      } else {
        /** @type {string} */
        sessionId = "Can't paste line-wise text into a non-line-wise area";
      }
    } else {
      if (aW) {
        message = path.split("\n");
        encrypted = options.originalText.split("\n");
        /** @type {number} */
        url = value - options.startY + (isVertical ? 0 : 1);
        manifests = options.shownText.length > 0 ? options.shownText.split("\n") : [];
        manifests.splice.apply(manifests, [url, 0].concat(message));
        type = manifests.join("\n");
        if (rev !== true) {
          if (manifests.length > encrypted.length) {
            /** @type {string} */
            sessionId = "Corrected text can't have more\nlines than the original text.";
          } else {
            if (encrypted.length === 1) {
              if (encrypted[0].length < manifests[0].length) {
                /** @type {string} */
                sessionId = "Corrected text ('" + manifests[0] + "')\ncan't exceed the original length\n(it should contain '" + encrypted[0] + "')";
              }
            } else {
              /** @type {number} */
              i = 0;
              for (; i < encrypted.length; ++i) {
                if (typeof manifests[i] !== "undefined" && encrypted[i].length < manifests[i].length) {
                  /** @type {string} */
                  sessionId = "Line number " + (i + 1) + " in the corrected text\n'" + manifests[i] + "'\ncan't exceed the original length\n(it should contain '" + encrypted[i] + "')";
                  break;
                }
              }
            }
          }
        }
        if (!sessionId) {
          if (self.isSacred() && options.originalText !== path) {
            /** @type {string} */
            sessionId = "The texts don't match, and it's\none of the sacred texts... Try to\nbe more precise. You're trying\nto paste" + (aW ? "\n" : " '") + path.substr(0, 80) + (aW ? "\n" : "' ") + "there.";
          } else {
            result = run(self, options, self.getTopX(), value - (isVertical ? 1 : 0), path);
            value = value - (isVertical ? 1 : 0) + (type === " \n" ? message.length : 1);
            b = self.getTopX() + (type === " \n" ? message[message.length - 1].length - 1 : 0);
            /** @type {boolean} */
            tag = true;
          }
        }
      } else {
        if (bk) {
          /** @type {string} */
          sessionId = "This works in VIM\nbut isn't supported\nin this game.";
        } else {
          encrypted = options.originalText.split("\n");
          manifests = options.shownText.split("\n");
          /** @type {number} */
          url = value - options.startY;
          if (manifests[url] === " " && self.getLineLength(value - self.getTopY()) === 1 && !div.isCodeBG(b, value)) {
            /** @type {string} */
            manifests[url] = "";
            /** @type {boolean} */
            isVertical = true;
          }
          /** @type {number} */
          end = b - (value === options.startY ? options.startX : self.getTopX()) + (isVertical ? 0 : 1);
          manifests[url] = manifests[url].substring(0, end) + path + manifests[url].substring(end);
          type = manifests.join("\n");
          if (self.isSacred() && options.originalText !== type) {
            /** @type {string} */
            sessionId = "The texts don't match, and it's\none of the sacred texts... Try to\nbe more precise. You're trying\nto paste" + (aW ? "\n" : " '") + path.substr(0, 80) + (aW ? "\n" : "' ") + "there.";
          } else {
            if (manifests[url].length <= encrypted[url].length) {
              result = format(self, options, b, value, path, !isVertical);
              /** @type {number} */
              b = b + path.length - 1 + (isVertical ? 0 : 1);
              /** @type {boolean} */
              tag = true;
            } else {
              /** @type {string} */
              sessionId = "In this game, you are not allowed to add more than\nthe length of the required text.";
            }
          }
        }
      }
    }
    return debug(b, value, type, sessionId, result);
  }
  /**
   * @param {!Object} ctx
   * @param {!Object} url
   * @param {number} c
   * @param {number} a
   * @param {number} i
   * @param {string} options
   * @param {!Object} data
   * @return {?}
   */
  function handler(ctx, url, c, a, i, options, data) {
    var multipartUploadSize = ctx.getLineLength(a - ctx.getTopY());
    /** @type {number} */
    var _ = c;
    /** @type {number} */
    var item = a;
    /** @type {number} */
    var wholePercentWidth = c + i - 1;
    var end = ctx.getTopX() + multipartUploadSize;
    var self = vim.board;
    var obj = data || self;
    var t = vim.buffers.getCurrentBuffer().getEntities();
    /** @type {boolean} */
    var isValDef = typeof data !== "undefined";
    return function() {
      var x;
      var key;
      if (!isValDef) {
        x = _;
        for (; x <= wholePercentWidth; ++x) {
          t.deleteAtPosition(x, item, true);
          ctx.removeFromSinkList(x, item);
        }
      }
      x = _;
      for (; x < end; ++x) {
        /** @type {number} */
        key = Math.min(x + i, end);
        obj.setBG(x, item, self.getBG(key, item));
        if (key < end) {
          t.shiftLeft(key, item, i, true);
          ctx.changeSinkListX(key, item, x);
        }
      }
    };
  }
  /**
   * @param {!Object} self
   * @param {!Object} selector
   * @param {number} type
   * @param {number} value
   * @param {string} term
   * @param {boolean} item
   * @param {!Object} container
   * @return {?}
   */
  function refresh(self, selector, type, value, term, item, container) {
    var values = term.split("\n");
    /** @type {number} */
    var n = type;
    /** @type {number} */
    var x = value;
    /** @type {number} */
    var val = x + values.length - 1;
    /** @type {number} */
    var count = self.getTopX() + values[values.length - 1].length - 1;
    var data = vim.board;
    var t = vim.buffers.getCurrentBuffer().getEntities();
    var isWide;
    var ret;
    var p = vim.model;
    var result;
    var cb;
    var size;
    var index;
    var args;
    var src;
    var inputWin;
    var id = self.getTopX();
    var i = self.getTopY();
    var num;
    var winRef;
    var el = container || data;
    /** @type {boolean} */
    var isValDef = typeof container !== "undefined";
    var diff;
    /** @type {number} */
    diff = id + self.getLineLength(val - i) - 1 - count;
    /** @type {boolean} */
    isWide = diff === 0;
    /** @type {boolean} */
    num = type === id;
    /** @type {boolean} */
    result = x === val;
    cb = item && type === id && isWide;
    size = p.getBottomEndOfCodeBlocks(id, val + (result ? 1 : 0));
    /** @type {!Array} */
    args = [];
    /** @type {!Array} */
    src = [];
    index = x;
    for (; index < size; ++index) {
      args[index - x] = p.getEndOfCodeBlocks(id, index);
      /** @type {boolean} */
      winRef = !data.isCodeBG(id, index);
      /** @type {boolean} */
      inputWin = index - i < self.getNumberOfLines() && self.getLineLength(index - i) === 1 && self.getLetter(id, index) === " " && !data.isCodeBG(id, index);
      src[index - x] = p.getStartOfCodeBlocks(id, index) + (inputWin || winRef ? 0 : 1);
    }
    ret = handler(self, selector, type, value, values[0].length, cb, container);
    return function() {
      var j;
      var i;
      var pos = self.getTopX();
      var oldBottom;
      var offset;
      var length;
      var index;
      var w;
      var start;
      var value;
      ret();
      /** @type {number} */
      oldBottom = values.length - (isWide ? 1 : 2);
      if (!isValDef) {
        /** @type {number} */
        j = 1;
        for (; j <= oldBottom; ++j) {
          /** @type {number} */
          i = 0;
          for (; i < values[j].length; ++i) {
            t.deleteAtPosition(pos + i, x + j, true);
            self.removeFromSinkList(pos + i, x + j);
            self.deleteLocalMarkAtPosition(pos + i, x + j);
          }
        }
      }
      if (isWide) {
        /** @type {number} */
        offset = result ? 1 : values.length - (num ? 0 : 1);
        if (cb) {
          --offset;
        }
        if (!isValDef) {
          j = x + (result || num ? 0 : 1);
          for (; j < size; ++j) {
            start = args[j - x];
            i = pos;
            for (; i < start; ++i) {
              t.shiftUp(i, j, offset, false);
              self.changeSinkListY(i, j, j - offset);
              self.updateLocalMarkY(i, j, j - offset);
              p.updateGlobalMarkY(i, j, j - offset);
            }
          }
        }
        /** @type {number} */
        index = 0;
        j = x + (result || num ? 0 : 1);
        for (; j < size - offset; ++j) {
          start = args[j - x + offset];
          length = args[j - x];
          /** @type {number} */
          index = Math.max(index, start, length);
          w = src[j - x];
          i = w;
          for (; i < length || i < start; ++i) {
            el.setBG(i, j, data.getBG(i, j + offset));
          }
        }
        for (; j < size; ++j) {
          length = args[j - x];
          /** @type {number} */
          index = Math.max(index, length);
          w = src[j - x];
          i = w;
          for (; i < index; ++i) {
            el.setBG(i, j, data.getBG(i, size));
          }
        }
      } else {
        if (!isValDef) {
          /** @type {number} */
          i = 0;
          for (; i < diff; ++i) {
            t.shift(count + 1 + i, val, -(count - n), -(val - x), val !== x);
            self.changeSinkList(count + 1 + i, val, n + i, x);
            self.updateLocalMark(count + 1 + i, val, n + i + (count + 1 - pos), x);
          }
        }
        value = data.getBG(args[0], x);
        i = n;
        for (; i < Math.max(n + diff, args[0]); ++i) {
          el.setBG(i, x, i < n + diff ? data.getBG(count + i - n, val) : value);
        }
        /** @type {number} */
        offset = values.length - 1;
        if (!isValDef) {
          j = x + 1;
          for (; j < size; ++j) {
            start = args[j - x];
            i = pos;
            for (; i < start; ++i) {
              t.shiftUp(i, j, offset, false);
              self.changeSinkListY(i, j, j - offset);
              self.updateLocalMarkY(i, j, j - offset);
              p.updateGlobalMarkY(i, j, j - offset);
            }
          }
        }
        /** @type {number} */
        index = 0;
        j = x + 1;
        for (; j < size - offset; ++j) {
          start = args[j - x + offset];
          length = args[j - x];
          /** @type {number} */
          index = Math.max(index, start, length);
          w = src[j - x];
          i = w;
          for (; i < length || i < start; ++i) {
            el.setBG(i, j, data.getBG(i, j + offset));
          }
        }
        for (; j < size; ++j) {
          length = args[j - x];
          /** @type {number} */
          index = Math.max(index, length);
          w = src[j - x];
          i = w;
          for (; i < index; ++i) {
            el.setBG(i, j, data.getBG(i, size));
          }
        }
      }
    };
  }
  /**
   * @param {!Object} view
   * @param {!Object} options
   * @param {number} type
   * @param {?} line
   * @param {string} prefix
   * @param {boolean} error
   * @return {?}
   */
  function format(view, options, type, line, prefix, error) {
    var i = prefix.length;
    var apimetcreate = view.getLineLength(options.startY - view.getTopY());
    var prop = type + (error ? 1 : 0);
    var start = line;
    /** @type {number} */
    var speedUp = prop + i - 1;
    var url = view.getTopX() + apimetcreate;
    var buffer = vim.board;
    var ip = vim.buffers.getCurrentBuffer().getEntities();
    var aW;
    /** @type {boolean} */
    aW = view.getLineLength(start - view.getTopY()) === 1 && !buffer.isCodeBG(prop, start);
    return function() {
      var index;
      var n;
      var clean_regexp = Cursor.getX();
      var offset = Cursor.getY();
      if (!aW) {
        /** @type {number} */
        index = url + i - 1;
        for (; index > speedUp; --index) {
          /** @type {number} */
          n = index - i;
          buffer.setBG(index, offset, buffer.getBG(n, offset));
          ip.shiftLeft(n, offset, -i, true);
          view.changeSinkListX(n, offset, index);
        }
      }
      index = prop;
      for (; index <= speedUp; ++index) {
        buffer.setBG(index, offset, buffer.PLAIN);
      }
      if (buffer.getBG(clean_regexp, offset) !== buffer.MISSING && buffer.getBG(clean_regexp, offset) !== buffer.SKY_MISSING && buffer.getBG(clean_regexp, offset) !== buffer.DARK && vim.input.isInInputMode()) {
        view.cursorPositionUpdate(clean_regexp, offset);
      }
    };
  }
  /**
   * @param {!Object} self
   * @param {!Object} src
   * @param {?} type
   * @param {number} offset
   * @param {string} ctx
   * @return {?}
   */
  function run(self, src, type, offset, ctx) {
    var elems = ctx.split("\n");
    var graphTypeBaseName = type;
    var j = offset + 1;
    var s = vim.board;
    var SlowBuffer = vim.buffers.getCurrentBuffer().getEntities();
    var p = vim.model;
    var k = p.getBottomEndOfCodeBlocks(self.getTopX(), j);
    /** @type {boolean} */
    var wctx = ctx !== " ";
    var results;
    var pixels;
    var toStart;
    var node = self.getTopX();
    var step = self.getTopY();
    var i;
    /** @type {!Array} */
    results = [];
    /** @type {!Array} */
    pixels = [];
    i = j;
    for (; i < k; ++i) {
      results[i - j] = p.getEndOfCodeBlocks(node, i);
      /** @type {boolean} */
      toStart = i - step < self.getNumberOfLines() && self.getLineLength(i - step) === 1 && self.getLetter(node, i) === " " && !s.isCodeBG(node, i);
      pixels[i - j] = p.getStartOfCodeBlocks(node, i) + (toStart ? 0 : 1);
    }
    return function() {
      var i;
      var idx;
      var EVAPORATING;
      var y;
      var pos = self.getTopX();
      var len = elems.length;
      var count;
      var length;
      var offset;
      var index;
      var phi;
      /** @type {number} */
      i = k - 1;
      for (; i >= j; --i) {
        index = results[i - j];
        idx = pos;
        for (; idx < index; ++idx) {
          SlowBuffer.shiftUp(idx, i, -len, false);
          self.changeSinkListY(idx, i, i + len);
          self.updateLocalMarkY(idx, i, i + len);
          vim.model.updateGlobalMarkY(idx, i, i + len);
        }
      }
      phi = s.getBG(results[0], j);
      if (s.getBG(results[0] - 1, j) === s.MISSING) {
        phi = s.SKY_MISSING;
      }
      /** @type {number} */
      length = 0;
      /** @type {number} */
      i = k - 1;
      for (; i >= j; --i) {
        index = results[i + len - j] || pos;
        count = results[i - j];
        /** @type {number} */
        length = Math.max(length, index, count);
        offset = pixels[i - j];
        idx = offset;
        for (; idx < count || idx < index; ++idx) {
          s.setBG(idx, i + len, s.getBG(idx, i));
        }
      }
      i = j;
      for (; i < j + len; ++i) {
        count = results[i - j] || pos;
        idx = pos;
        for (; idx < Math.max(pos + elems[i - j].length, count); ++idx) {
          s.setBG(idx, i, wctx && idx - pos < elems[i - j].length ? s.PLAIN : phi);
        }
      }
      EVAPORATING = Cursor.getX();
      y = Cursor.getY();
      if (s.getBG(EVAPORATING, y) !== s.MISSING && s.getBG(EVAPORATING, y) !== s.SKY_MISSING && s.getBG(EVAPORATING, y) !== s.DARK && vim.input.isInInputMode()) {
        self.cursorPositionUpdate(EVAPORATING, y);
      }
    };
  }
  /**
   * @param {string} name
   * @param {number} data
   * @param {!Object} context
   * @param {!Object} callback
   * @param {!Object} opts
   * @param {boolean} scope
   * @param {string} params
   * @param {boolean} message
   * @param {boolean} tag
   * @param {boolean} value
   * @param {string} type
   * @param {boolean} options
   * @return {?}
   */
  function fn(name, data, context, callback, opts, scope, params, message, tag, value, type, options) {
    var result;
    var aV;
    /** @type {boolean} */
    var fc = type === "i" || type === "I";
    switch(name.charAt(0)) {
      case "r":
        result = register(name, data, context, callback);
        break;
      case "~":
        result = verify(name, data, context, callback);
        break;
      case "d":
      case "x":
      case "X":
        result = next(name, data, context, callback, opts, scope, message, tag, type, options);
        break;
      case "P":
      case "p":
        result = main(name, data, context, callback, params, options);
        break;
      default:
        result = debug(x, y, "", "Operation not supported");
    }
    if (!callback && options) {
      callback = context.getEmptySpecialArea(opts.sx, opts.sy, fc) || context.getSpecialArea(opts.sx, opts.sy) || context.getSpecialArea(opts.sx + (fc ? -1 : 1), opts.sy);
    }
    return validate(result, context, callback, value, undefined, options);
  }
  /**
   * @param {!Object} data
   * @param {!Object} context
   * @param {!Object} options
   * @param {boolean} args
   * @param {!Object} meta
   * @param {boolean} callback
   * @return {?}
   */
  function validate(data, context, options, args, meta, callback) {
    var j = Cursor.getX();
    var i = Cursor.getY();
    var word = meta || vim.board;
    var me = vim.view;
    var p = vim.audio;
    var s = vim.input;
    /** @type {boolean} */
    var isValDef = typeof meta !== "undefined";
    if (data.errorMsg) {
      if (data.errorMsg === "NOP") {
        return true;
      }
      p.play("blocked");
      if (args) {
        data.errorMsg += "\nCount expansion is stopped.";
      }
      text(data.errorMsg, true, args && vim.model.isValidCursorPosition(j - 1, i) && j - 1 >= context.getTopX() ? j - 1 : j);
      return false;
    }
    options.shownText = data.newText;
    context.patchSpecialArea(options, "^" + (options.hidden === true ? "h" : "") + "+" + options.originalText.length + "." + options.originalText + "." + options.shownText + "^");
    if (!isValDef) {
      vim.buffers.getCurrentBuffer().getTextAreas().refreshCache(context);
      data = options.shownText === "" ? options.bol && options.eol && options.originalText !== "" ? context.getEmptyLineSpecialArea(options.startX, options.startY, true) : context.getEmptySpecialArea(options.startX, options.startY, true) : context.getSpecialArea(options.startX, options.startY);
      if (data.shownText === data.originalText && !s.isInInputMode() && args !== true) {
        context.applyGivenSpecialArea(data);
        me.notifyBubbleUp(data.startX, data.startY, data.originalText);
        p.play("deletion");
      }
    }
    if (data.operation) {
      data.operation();
    }
    if (!isValDef) {
      vim.model.clearTextAreaCellCache(context);
      j = data.x;
      i = data.y;
      get(j, i, callback);
      if (word.getBG(j, i) !== word.MISSING && word.getBG(j, i) !== word.SKY_MISSING && word.getBG(j, i) !== word.DARK && !vim.input.isInInputMode() && args !== true) {
        context.cursorPositionUpdate(j, i);
      }
      cb(context, false);
      add(context);
    }
    return true;
  }
  /**
   * @param {string} a1
   * @param {number} data
   * @return {?}
   */
  function create(a1, data) {
    var b = Cursor.getX();
    var s = Cursor.getY();
    var c = vim.buffers.getCurrentBuffer().getTextAreas().get(b, s);
    var options = c ? c.getSpecialArea(b, s) : undefined;
    /** @type {boolean} */
    var result = false;
    var val;
    var aV;
    /** @type {boolean} */
    result = typeof c === "undefined";
    /** @type {boolean} */
    result = result || typeof options === "undefined";
    if (!result && options.type === "+") {
      return fn(a1, data, c, options);
    }
    /** @type {boolean} */
    result = result || options.startX !== b || options.endX !== b + data - 1;
    /** @type {boolean} */
    result = result || options.type !== "r" && options.type !== "*";
    /** @type {boolean} */
    result = result || options.type === "*" && !options.inplace;
    /** @type {boolean} */
    result = result || !vim.model.isValidCursorPosition(options.endX, options.endY);
    if (!result) {
      /** @type {number} */
      val = 0;
      for (; val < data; ++val) {
        if (a1.charAt(1) !== (data === 1 ? options.originalCharacter : options.originalText.charAt(val))) {
          /** @type {boolean} */
          result = true;
          break;
        }
      }
    }
    if (result) {
      if (c) {
        vim.view.notifyShowRangeAnimation(b, s, b + data - 1, s, c);
      }
      vim.audio.play("error_beep");
    } else {
      c.applySpecialArea(b, s);
      vim.audio.play("deletion");
      add(c);
      get(options.endX, options.endY);
      if (vim.board.getBG(options.endX, options.endY) !== vim.board.MISSING && vim.board.getBG(options.endX, options.endY) !== vim.board.SKY_MISSING) {
        c.cursorPositionUpdate(options.endX, options.endY);
      }
    }
  }
  /**
   * @param {string} value
   * @param {string} number
   * @param {string} i
   * @param {?} n
   * @param {string} a
   * @param {string} b
   * @param {string} o
   * @param {?} id
   * @return {?}
   */
  function exec(value, number, i, n, a, b, o, id) {
    var name;
    var type;
    var key;
    var x;
    var d;
    var value;
    var s;
    var y;
    /** @type {number} */
    type = Math.min(number, n);
    /** @type {number} */
    x = Math.max(number, n);
    if (type === x) {
      /** @type {number} */
      name = Math.min(value, i);
      /** @type {number} */
      key = Math.max(value, i);
    } else {
      name = type === number ? value : i;
      key = type === number ? i : value;
    }
    /** @type {number} */
    value = Math.min(b, id);
    /** @type {number} */
    y = Math.max(b, id);
    if (value === y) {
      /** @type {number} */
      d = Math.min(a, o);
      /** @type {number} */
      s = Math.max(a, o);
    } else {
      d = value === b ? a : o;
      s = value === b ? o : a;
    }
    return name === d && type === value && key === s && x === y;
  }
  /**
   * @param {number} b
   * @param {number} c
   * @param {number} i
   * @param {number} a
   * @param {string} x
   * @param {!Object} str
   * @param {string} fn
   * @param {?} selector
   * @return {?}
   */
  function $(b, c, i, a, x, str, fn, selector) {
    /** @type {boolean} */
    var onDenyRecovery = false;
    /** @type {boolean} */
    var aY = false;
    var a5;
    var end;
    var threshold;
    var c1;
    var p = vim.model;
    var s = vim.buffers;
    /** @type {boolean} */
    var a6 = a < c || a === c && i < b;
    var link;
    var a0;
    switch(x.charAt(0)) {
      case "f":
      case "F":
      case "t":
      case "T":
        if (b === i && c === a) {
          /** @type {boolean} */
          onDenyRecovery = true;
        }
        break;
    }
    switch(x.charAt(0)) {
      case "x":
      case "e":
      case "E":
        break;
      case "w":
      case "W":
        if (b !== i || c !== a) {
          if (!selector) {
            if (i > str.getTopX()) {
              /** @type {number} */
              i = i - 1;
            } else {
              if (a > str.getTopY()) {
                /** @type {number} */
                a = a - 1;
                /** @type {number} */
                i = str.getLineLength(a - str.getTopY()) + str.getTopX() - 1;
              }
            }
          }
          if (fn === true) {
            for (; i > str.getTopX() && str.getLetter(i, a) === " ";) {
              /** @type {number} */
              i = i - 1;
            }
          }
        }
        if (fn === true) {
          for (; i > str.getTopX() && str.getLetter(i, a) === " ";) {
            /** @type {number} */
            i = i - 1;
          }
        }
        break;
      case "b":
      case "B":
      case "h":
      case "F":
      case "T":
        if (b > str.getTopX()) {
          /** @type {number} */
          b = b - 1;
        }
        break;
      case "0":
        if (b > str.getTopX()) {
          /** @type {number} */
          b = b - 1;
        } else {
          /** @type {boolean} */
          onDenyRecovery = true;
        }
        break;
      case "|":
      case "^":
        if (b < i) {
          /** @type {number} */
          i = i - 1;
        } else {
          if (b > i) {
            /** @type {number} */
            b = b - 1;
          } else {
            /** @type {boolean} */
            onDenyRecovery = true;
          }
        }
        break;
      case "`":
        if (a < c || a === c && i < b) {
          if (b > str.getTopX()) {
            /** @type {number} */
            b = b - 1;
          } else {
            if (c > str.getTopY()) {
              /** @type {number} */
              c = c - 1;
              /** @type {number} */
              b = str.getLineLength(c - str.getTopY()) + str.getTopX() - 1;
            }
          }
        } else {
          if (i > str.getTopX()) {
            /** @type {number} */
            i = i - 1;
          } else {
            if (a > str.getTopY()) {
              /** @type {number} */
              a = a - 1;
              /** @type {number} */
              i = str.getLineLength(a - str.getTopY()) + str.getTopX() - 1;
            }
          }
        }
        break;
      case "'":
        if (c > a) {
          /** @type {number} */
          c = a;
          a = Cursor.getY();
        }
        b = str.getTopX();
        /** @type {number} */
        i = str.getTopX() + str.getLineLength(a - str.getTopY()) - 1;
        /** @type {boolean} */
        aY = true;
        link = x.charAt(1);
        a0 = str.getLocalMark(link) || p.getGlobalMark(link);
        if (a0 && (typeof a0.bufferName !== "undefined" && a0.bufferName !== s.getCurrentBuffer().getName())) {
          /** @type {boolean} */
          onDenyRecovery = true;
        }
        break;
      case "/":
      case "?":
      case "n":
      case "N":
        if (a6) {
          if (b > str.getTopX()) {
            /** @type {number} */
            b = b - 1;
          } else {
            if (c > str.getTopY()) {
              /** @type {number} */
              c = c - 1;
              /** @type {number} */
              b = str.getLineLength(c - str.getTopY()) + str.getTopX() - 1;
            }
          }
        } else {
          if (i > str.getTopX()) {
            /** @type {number} */
            i = i - 1;
          } else {
            if (a > str.getTopY()) {
              /** @type {number} */
              a = a - 1;
              /** @type {number} */
              i = str.getLineLength(a - str.getTopY()) + str.getTopX() - 1;
            }
          }
        }
        break;
      case "gg":
        /** @type {number} */
        a = c;
        /** @type {number} */
        i = str.getTopX() + str.getLineLength(a - str.getTopY()) - 1;
        b = str.getTopX();
        c = str.getTopY();
        /** @type {boolean} */
        aY = true;
        break;
      case "G":
        b = str.getTopX();
        /** @type {number} */
        a = str.getTopY() + str.getNumberOfLines() - 1;
        /** @type {number} */
        i = str.getTopX() + str.getLineLength(a - str.getTopY()) - 1;
        /** @type {boolean} */
        aY = true;
        break;
      case "H":
      case "M":
      case "L":
        if (c > a) {
          /** @type {number} */
          c1 = c;
          /** @type {number} */
          c = a;
          a = c1;
        }
        b = str.getTopX();
        /** @type {number} */
        i = str.getTopX() + str.getLineLength(a - str.getTopY()) - 1;
        /** @type {boolean} */
        aY = true;
        break;
      case "d":
      case "j":
      case "k":
      case "y":
      case "Y":
        if (c === a && (x === "j" && c == str.getTopY() + str.getNumberOfLines() - 1 || x === "k" && c == str.getTopY())) {
          /** @type {boolean} */
          onDenyRecovery = true;
        } else {
          if (c > a) {
            /** @type {number} */
            c = a;
            a = Cursor.getY();
          }
          b = str.getTopX();
          /** @type {number} */
          i = str.getTopX() + str.getLineLength(a - str.getTopY()) - 1;
        }
        /** @type {boolean} */
        aY = true;
        break;
      case "%":
        if (b === str.getTopX() && i === str.getTopX() + str.getLineLength(a - str.getTopY()) - 1) {
          /** @type {boolean} */
          aY = true;
        }
        break;
      case "{":
      case "(":
        if (b > str.getTopX()) {
          /** @type {number} */
          b = b - 1;
        } else {
          /** @type {number} */
          c = c - 1;
          /** @type {number} */
          b = str.getTopX() + str.getLineLength(c - str.getTopY()) - 1;
        }
        if (b === str.getTopX() && i === str.getTopX() + str.getLineLength(a - str.getTopY()) - 1) {
          /** @type {boolean} */
          aY = true;
        }
        break;
      case "}":
        /** @type {number} */
        a = a - 1;
        /** @type {number} */
        i = str.getTopX() + str.getLineLength(a - str.getTopY()) - 1;
        if (b === str.getTopX() && i === str.getTopX() + str.getLineLength(a - str.getTopY()) - 1) {
          /** @type {boolean} */
          aY = true;
        }
        break;
      case ")":
        if (i > str.getTopX()) {
          /** @type {number} */
          i = i - 1;
        } else {
          /** @type {number} */
          a = a - 1;
          /** @type {number} */
          i = str.getTopX() + str.getLineLength(a - str.getTopY()) - 1;
        }
        if (b === str.getTopX() && i === str.getTopX() + str.getLineLength(a - str.getTopY()) - 1) {
          /** @type {boolean} */
          aY = true;
        }
        break;
      case "a":
        if ("wWs\"'`".indexOf(x.charAt(1)) !== -1) {
          /** @type {boolean} */
          a5 = false;
          if (str.getLetter(Cursor.getX(), Cursor.getY()) !== " ") {
            /** @type {number} */
            end = str.getTopX() + str.getLineLength(a - str.getTopY()) - 1;
            for (; i + 1 <= end && str.getLetter(i + 1, a) === " ";) {
              i = i + 1;
              /** @type {boolean} */
              a5 = true;
            }
          }
          if (!a5) {
            threshold = str.getTopX();
            for (; b - 1 >= threshold && str.getLetter(b - 1, c) === " ";) {
              /** @type {number} */
              b = b - 1;
            }
          }
          /** @type {boolean} */
          aY = x.charAt(1) === "s" && b === str.getTopX() && i === str.getTopX() + str.getLineLength(a - str.getTopY()) - 1;
        } else {
          if (x.charAt(1) === "p") {
            /** @type {boolean} */
            a5 = false;
            if (!(str.getLineLength(c - str.getTopY()) === 1 && str.getLetter(str.getTopX(), c) === " ")) {
              for (; a + 1 <= str.getTopY() + str.getNumberOfLines() - 1 && str.getLineLength(a + 1 - str.getTopY()) === 1 && str.getLetter(str.getTopX(), a + 1) === " ";) {
                i = str.getTopX();
                a = a + 1;
                /** @type {boolean} */
                a5 = true;
              }
            }
            if (!a5) {
              for (; c - 1 >= str.getTopY() && str.getLineLength(c - 1 - str.getTopY()) === 1 && str.getLetter(str.getTopX(), c - 1) === " ";) {
                b = str.getTopX();
                /** @type {number} */
                c = c - 1;
              }
            }
            /** @type {boolean} */
            aY = false;
          } else {
            /** @type {boolean} */
            aY = false;
          }
        }
        break;
      case "i":
        if ("wWsp\"'`".indexOf(x.charAt(1)) !== -1) {
          if ("\"'`".indexOf(x.charAt(1)) !== -1) {
            b = b + 1;
            /** @type {number} */
            i = i - 1;
          } else {
          }
          /** @type {boolean} */
          aY = false;
        } else {
          if (b < str.getTopX() + str.getLineLength(c - str.getTopY()) - 1) {
            b = b + 1;
          } else {
            b = str.getTopX();
            c = c + 1;
          }
          if (i > str.getTopX()) {
            /** @type {number} */
            i = i - 1;
          } else {
            /** @type {number} */
            a = a - 1;
            /** @type {number} */
            i = str.getTopX() + str.getLineLength(a - str.getTopY()) - 1;
          }
          /** @type {boolean} */
          aY = c !== a && b === str.getTopX() && i === str.getTopX() + str.getLineLength(a - str.getTopY()) - 1;
        }
        break;
    }
    return {
      sx : b,
      sy : c,
      ex : i,
      ey : a,
      cancel : onDenyRecovery,
      linewise : aY
    };
  }
  /**
   * @param {!Object} callback
   * @param {!Object} options
   * @param {string} name
   * @param {!Object} err
   * @return {?}
   */
  function test(callback, options, name, err) {
    var left;
    var direction;
    var x;
    var top;
    var right;
    var mediump;
    var mediumpAvailable;
    var bottom;
    var a6;
    /** @type {boolean} */
    mediumpAvailable = options.endY - options.startY > 0 || name === "d";
    /** @type {number} */
    right = callback.getTopX() + callback.getLineLength(options.endY - callback.getTopY()) - 1;
    /** @type {number} */
    mediump = callback.getTopX() + callback.getLineLength(options.startY - callback.getTopY()) - 1;
    /** @type {number} */
    bottom = callback.getTopY() + callback.getNumberOfLines() - 1;
    a6 = err && options.bol && options.eol;
    left = options.endX;
    direction = options.endY;
    if (a6) {
      left = options.startX;
      direction = options.startY;
    } else {
      if (left !== right) {
        ++left;
      } else {
        if (!mediumpAvailable) {
          if (options.startX > callback.getTopX()) {
            /** @type {number} */
            left = options.startX - 1;
          }
        } else {
          if (direction !== bottom) {
            left = callback.softBOLPos(callback.getTopX(), options.endY + 1).x;
            ++direction;
          } else {
            if (options.startX > callback.getTopX()) {
              /** @type {number} */
              left = options.startX - 1;
              direction = options.startY;
            } else {
              left = callback.softBOLPos(callback.getTopX(), options.startY - 1).x;
              /** @type {number} */
              direction = options.startY - 1;
            }
          }
        }
      }
    }
    x = options.startX;
    top = options.startY;
    if (a6) {
    } else {
      if (mediumpAvailable && options.bol === true && options.eol === true) {
        if (options.endY !== bottom) {
          x = callback.softBOLPos(callback.getTopX(), options.endY + 1).x;
        } else {
          x = callback.softBOLPos(callback.getTopX(), options.startY - 1).x;
          /** @type {number} */
          top = options.startY - 1;
        }
      } else {
        if (mediumpAvailable && options.eol !== true) {
        } else {
          if (options.startX > callback.getTopX() && mediumpAvailable) {
            --x;
          } else {
            if (options.endX === mediump && !mediumpAvailable) {
              --x;
            } else {
              if (options.endX === right && options.endY === bottom) {
                x = callback.softBOLPos(callback.getTopX(), options.startY - 1).x;
                /** @type {number} */
                top = options.startY - 1;
              } else {
                if (options.startX === callback.getTopX() && mediumpAvailable) {
                  x = callback.softBOLPos(callback.getTopX(), options.endY + 1).x;
                }
              }
            }
          }
        }
      }
    }
    return {
      beforeX : left,
      beforeY : direction,
      afterX : x,
      afterY : top
    };
  }
  /**
   * @param {string} b
   * @param {number} x
   * @return {undefined}
   */
  function init(b, x) {
    var value;
    var aY;
    var x = Cursor.getX();
    var i = Cursor.getY();
    var node;
    var data;
    var s = vim.board;
    var isCreditCard_1;
    var offset;
    var props;
    var start;
    var rangeAspected = vim.buffers.getCurrentBuffer().getTextAreas();
    var a1 = vim.buffers.getCurrentBuffer().getEntities();
    var elem1;
    var sourceData;
    /** @type {boolean} */
    value = b.charAt(0) === "O";
    node = rangeAspected.get(x, i);
    if (!node) {
      text("'" + b.charAt(0) + "' can only be used on text.");
      vim.audio.play("error_beep");
      return;
    }
    /** @type {boolean} */
    sourceData = false;
    data = node.getEmptyLineSpecialArea(x, i, value);
    if (data && (data.type === "*" || data.type === "+")) {
      /** @type {boolean} */
      sourceData = true;
    }
    if (!sourceData && !data) {
      data = node.getSpecialArea(x, i);
      if (data && data.type === "+") {
        if (value && !(!data.bol && i === data.startY)) {
          /** @type {boolean} */
          sourceData = true;
        } else {
          if (!value && !(!data.eol && i === data.endY)) {
            /** @type {boolean} */
            sourceData = true;
          }
        }
      }
    }
    if (!sourceData) {
      vim.audio.play("blocked");
      isCreditCard_1 = node.getTopX();
      offset = i + (value ? -1 : 1);
      start = offset;
      props = offset >= node.getTopY() && offset <= node.getTopY() + node.getNumberOfLines() - 1 ? isCreditCard_1 + node.getLineLength(offset - node.getTopY()) - 1 : start;
      vim.view.notifyShowRangeAnimation(isCreditCard_1, offset, props, start, undefined);
      text("There is no missing text there.");
    } else {
      elem1 = (b.charAt(0) === "o" ? "p" : "P") + b.substr(1);
      fn(elem1, 1, node, data, undefined, undefined, " \n");
      if (tag) {
        move("a", x, false, true, false);
      }
    }
  }
  /**
   * @param {string} p
   * @param {number} f
   * @param {string} i
   * @return {?}
   */
  function set(p, f, i) {
    var s = vim.regs;
    var aW;
    var data;
    var callback;
    var wIdx;
    var type = Cursor.getX();
    var id = Cursor.getY();
    var c;
    var node;
    var Status = vim.board;
    var isTop;
    var parent;
    var start;
    var name;
    var valueProgess;
    var str;
    var _this = vim.buffers.getCurrentBuffer().getTextAreas();
    var check = vim.buffers.getCurrentBuffer().getEntities();
    var hasSongChanged;
    var isReplayingSong;
    i = i || '"';
    if (i === "_") {
      return;
    }
    if (!s.getRegister(i)) {
      vim.audio.play("error");
      text("Nothing in register " + i);
      return;
    }
    /** @type {string} */
    data = "";
    /** @type {number} */
    wIdx = 0;
    for (; wIdx < f; ++wIdx) {
      data = data + s.getRegister(i);
    }
    /** @type {boolean} */
    parent = data.charAt(data.length - 1) === "\n";
    /** @type {boolean} */
    callback = p.charAt(0) === "P";
    /** @type {boolean} */
    isTop = data.indexOf("\n") !== -1;
    if (parent) {
      data = data.substr(0, data.length - 1);
    }
    c = _this.get(type, id);
    if (!c) {
      text("'" + p.charAt(0) + "' can only be used on text.");
      vim.audio.play("error_beep");
      return;
    }
    /** @type {boolean} */
    hasSongChanged = false;
    /** @type {boolean} */
    isReplayingSong = false;
    node = parent ? c.getEmptyLineSpecialArea(type, id, callback) : c.getEmptySpecialArea(type, id, callback) || c.getSpecialArea(type, id) || (callback ? c.getSpecialArea(type - 1, id) : !callback ? c.getSpecialArea(type + 1, id) : undefined);
    if (node && (node.type === "*" || node.type === "+" && node.shownText === "")) {
      /** @type {boolean} */
      hasSongChanged = true;
    } else {
      node = c.getSpecialArea(type, id);
      if (node && node.type === "+") {
        /** @type {boolean} */
        isReplayingSong = true;
      }
    }
    if (!hasSongChanged && !isReplayingSong) {
      vim.audio.play("blocked");
      if (!parent && !isTop) {
        start = type + (callback ? 0 : 1);
        /** @type {number} */
        valueProgess = start + data.length - 1;
        name = id;
        str = name;
      } else {
        if (parent) {
          start = c.getTopX();
          /** @type {number} */
          valueProgess = start + data.split("\n")[0].length - 1;
          name = id + (callback ? -1 : 1);
          str = name;
        } else {
        }
      }
      vim.view.notifyShowRangeAnimation(start, name, valueProgess, str, undefined);
      text("There is no missing text there.");
    } else {
      if (vim.model.getLevel() < 11 && hasSongChanged && node.originalText === data && !node.shownText) {
        step(node);
        c.applyGivenSpecialArea(node);
        _this.refreshCache(c);
        vim.audio.play("deletion");
        change(node);
        vim.model.clearTextAreaCellCache(c);
        if (parent) {
          Cursor.set(c.softBOLPos(c.getTopX(), node.startY).x, node.startY);
        } else {
          if (!isTop) {
            Cursor.set(node.startX + data.length - 1, node.startY);
          } else {
          }
        }
        if (Cursor.getX() !== type || Cursor.getY() !== id) {
          vim.model.readjustViewToCursorPosition();
          check.collide(Cursor.getX(), Cursor.getY());
        }
        if (Status.getBG(Cursor.getX(), Cursor.getY()) !== Status.MISSING && Status.getBG(Cursor.getX(), Cursor.getY()) !== Status.SKY_MISSING) {
          c.cursorPositionUpdate(Cursor.getX(), Cursor.getY());
        }
        cb(c, false);
        add(c);
        vim.view.notifyBubbleUp(node.startX, node.startY, node.originalText);
      } else {
        if (vim.model.getLevel() === 10) {
          vim.audio.play("blocked");
          if (node && node.type === "*" && node.originalText !== data) {
            text("The texts don't match. You're trying to paste" + (parent ? "\n" : " '") + data.substr(0, 80) + (parent ? "\n" : "' ") + "there.\nBut do try this again on level 11, ok?", true);
          }
        } else {
          if (node && node.type === "*" && !node.shownText || node && node.type === "+") {
            return fn(p, f, c, node, undefined, undefined, data + (parent ? "\n" : ""));
          } else {
            vim.audio.play("blocked");
            text("You can paste only to empty or previously edited ranges.", true);
          }
        }
      }
    }
  }
  /**
   * @param {string} value
   * @param {number} size
   * @param {boolean} key
   * @param {!Object} val
   * @param {string} style
   * @param {boolean} node
   * @param {!Object} input
   * @param {string} password
   * @return {?}
   */
  function callback(value, size, key, val, style, node, input, password) {
    var x = Cursor.getX();
    var y = Cursor.getY();
    var draggableAxis = x;
    var notifyY = y;
    var ctx;
    var p;
    var bf;
    /** @type {boolean} */
    var selfCompletionActive = true;
    var output;
    var t;
    var string = vim.board;
    var key = value === "x" ? "x" : value.substr(1);
    /** @type {number} */
    var s = parseInt(key, 10) || 1;
    var d = key.substr(isNaN(parseInt(key, 10)) || key === "0" ? 0 : ("" + parseInt(key, 10)).length);
    var names;
    var a3;
    var n;
    var i;
    var a;
    var alreadyMarked;
    var bi;
    var check = vim.buffers.getCurrentBuffer().getEntities();
    var me = vim.buffers.getCurrentBuffer().getTextAreas();
    var index;
    var fill;
    /** @type {boolean} */
    var bn = false;
    var name;
    /** @type {boolean} */
    tag = false;
    if (!me.exist(x, y)) {
      vim.audio.play("error_beep");
      return;
    }
    ctx = me.get(x, y);
    if (d == "l") {
      /** @type {number} */
      s = size * s - 1;
      /** @type {number} */
      size = 1;
      key = s + d;
    }
    if (s === 0) {
      /** @type {boolean} */
      output = true;
      t = {
        sx : x,
        sy : y,
        ex : x,
        ey : y
      };
    } else {
      if ("ai".indexOf(d.charAt(0)) !== -1) {
        /** @type {boolean} */
        output = true;
        t = ctx.getTextObjectRange(d, size * s);
        if (!t.cancel) {
          t = $(t.sx, t.sy, t.ex, t.ey, d, ctx, false, t.wordOutOfBounds);
          if (key.charAt(1) === "p") {
            /** @type {boolean} */
            t.linewise = true;
          }
        }
      } else {
        output = Cursor.doMotion(key, true, size);
        if (!output && (d.charAt(0) == "`" || d.charAt(0) === "'")) {
          name = d.charAt(1);
          if (!vim.model.isSupportedMark(name)) {
            vim.screens["game-screen"].setColonCommand("E78: Unknown Mark (" + name + " is not a supported mark name).");
            vim.audio.play("error_beep");
            return;
          }
          if (vim.model.isLocalMark(name) && !me.get(Cursor.getX(), Cursor.getY()).getLocalMark(name) || vim.model.isGlobalMark(name) && !vim.model.getGlobalMark(name)) {
            vim.screens["game-screen"].setColonCommand("E20: Mark not set");
            vim.audio.play("error_beep");
            return;
          }
        }
        if (Cursor.getSimulationBufferName() !== vim.buffers.getCurrentBuffer().getName()) {
          /** @type {boolean} */
          bn = true;
        } else {
          t = $(Cursor.getX(), Cursor.getY(), Cursor.getSimulationX(), Cursor.getSimulationY(), d, ctx, style, Cursor.getSimulationWordOutOfBounds());
        }
      }
    }
    if (!bn) {
      if (t.cancel !== true) {
        log(value, t.sx, t.sy, t.ex, t.ey);
      }
      p = ctx.getSpecialArea(t.sx, t.sy);
      if (!p && val || p && (p.type === "+" || p.type === "*" && exec(p.startX, p.startY, p.endX, p.endY, t.sx, t.sy, t.ex, t.ey)) && t.cancel !== true && (output || input)) {
        return fn(value, size * s, ctx, p, t, key, undefined, node, input, false, password, val);
      }
      bi = p && p.type === "d" && !t.cancel && p.startX === t.ex && p.startY === t.ey && p.endX - 1 === t.sx && p.endY === t.sy;
      if (!p || p.type !== "d" && p.type !== "x" || t.cancel === true || !exec(p.startX, p.startY, p.endX, p.endY, t.sx, t.sy, t.ex, t.ey) || !output) {
        /** @type {boolean} */
        selfCompletionActive = false;
      }
      alreadyMarked = p && p.bol && p.eol && t.linewise !== true;
      if (selfCompletionActive && !alreadyMarked) {
        names = test(ctx, p, d);
        n = names.beforeX;
        i = names.beforeY;
        /** @type {boolean} */
        a3 = !vim.model.isValidCursorPosition(n, i) || string.getBG(n, i) === string.MISSING || string.getBG(n, i) === string.SKY_MISSING || string.getBG(n, i) === string.DARK;
      }
      if (bi) {
        text("When deleting backwards,\nthe character under the cursor\nis not deleted. Try doing\nthis one step to the right.", true);
      }
      if (t.cancel !== true) {
        fill = val ? 0 : error(t.sx, t.sy, t.ex, t.ey);
      }
    }
    if (bn) {
      vim.audio.play("blocked");
      text("Target mark is in\nanother buffer.");
    } else {
      if (!selfCompletionActive) {
        vim.audio.play("blocked");
        if (output && !t.cancel) {
          vim.view.notifyShowRangeAnimation(t.sx, t.sy, t.ex, t.ey, ctx);
        }
      } else {
        if (a3) {
          vim.audio.play("blocked");
          vim.view.notifyShowRangeAnimation(n, i, n, i, undefined);
          text("I won't have a valid location after delete");
        } else {
          if (alreadyMarked) {
            vim.audio.play("blocked");
            if (t.linewise !== true) {
              text("The deleted range should be linewise (i.e. include the\nwhole line along with the following end of line character).");
            } else {
              text("The deleted range shouldn't be linewise (i.e. it\nshouldn't include the following end of line character).");
            }
          } else {
            if (fill > 0) {
              vim.audio.play("blocked");
              text("I should probably get\nrid of " + (fill > 1 ? "these bugs" : "this bug") + " first.");
            } else {
              bf = ctx.getLineLength(y - ctx.getTopY());
              index = vim.model.getBottomEndOfCodeBlocks(ctx.getTopX(), ctx.getTopY() + ctx.getNumberOfLines());
              vim.view.notifyShowRangeAnimation(p.startX, p.startY, p.endX, p.endY, ctx);
              a = ctx.getAffectedText(t.sx, t.sy);
              ctx.applySpecialArea(t.sx, t.sy);
              vim.regs.doDelete(a, key);
              ret = a;
              me.refreshCache(ctx);
              vim.audio.play("deletion");
              events(p);
              push(p, index);
              restart(p, index);
              vim.model.clearTextAreaCellCache(ctx);
              Cursor.set(names.afterX, names.afterY);
              if (Cursor.getX() !== draggableAxis || Cursor.getY() !== notifyY) {
                vim.model.readjustViewToCursorPosition();
                check.collide(Cursor.getX(), Cursor.getY());
              }
              if (string.getBG(Cursor.getX(), Cursor.getY()) !== string.MISSING && string.getBG(Cursor.getX(), Cursor.getY()) !== string.SKY_MISSING) {
                ctx.cursorPositionUpdate(Cursor.getX(), Cursor.getY());
              }
              cb(ctx, false);
              add(ctx);
              /** @type {boolean} */
              tag = true;
            }
          }
        }
      }
    }
  }
  /**
   * @param {string} y
   * @param {number} h
   * @param {string} w
   * @return {undefined}
   */
  function draw(y, h, w) {
    var value = Cursor.getX();
    var result = Cursor.getY();
    var source;
    var x_keys;
    var t;
    var key = y === "x" ? "x" : y.substr(1);
    /** @type {number} */
    var a = parseInt(key, 10) || 1;
    var b = key.substr(isNaN(parseInt(key, 10)) || key === "0" ? 0 : ("" + parseInt(key, 10)).length);
    var nodeType;
    var refs = vim.buffers.getCurrentBuffer().getTextAreas();
    var x;
    var i;
    var board = vim.board;
    var p = vim.model;
    /** @type {boolean} */
    var a9 = false;
    var data;
    var name;
    if (!refs.exist(value, result)) {
      vim.audio.play("error_beep");
      return;
    }
    source = refs.get(value, result);
    if (b === "") {
      /** @type {string} */
      b = "yy";
      /** @type {number} */
      a = 1;
      /** @type {string} */
      key = "1yy";
    }
    if (b == "l") {
      /** @type {number} */
      a = h * a - 1;
      /** @type {number} */
      h = 1;
      key = a + b;
    }
    if ("ai".indexOf(b.charAt(0)) !== -1) {
      t = source.getTextObjectRange(b, h * a);
      if (!t.cancel) {
        t = $(t.sx, t.sy, t.ex, t.ey, b, source, false, t.wordOutOfBounds);
      }
    } else {
      if (a !== 0) {
        data = Cursor.doMotion(key, true, h);
        if (!data && (b.charAt(0) == "`" || b.charAt(0) === "'")) {
          name = b.charAt(1);
          if (!vim.model.isSupportedMark(name)) {
            vim.screens["game-screen"].setColonCommand("E78: Unknown Mark (" + name + " is not a supported mark name).");
            vim.audio.play("error_beep");
            return;
          }
          if (vim.model.isLocalMark(name) && !refs.get(Cursor.getX(), Cursor.getY()).getLocalMark(name) || vim.model.isGlobalMark(name) && !vim.model.getGlobalMark(name)) {
            vim.screens["game-screen"].setColonCommand("E20: Mark not set");
            vim.audio.play("error_beep");
            return;
          }
        }
        if (Cursor.getSimulationBufferName() !== vim.buffers.getCurrentBuffer().getName()) {
          /** @type {boolean} */
          a9 = true;
        } else {
          t = $(Cursor.getX(), Cursor.getY(), Cursor.getSimulationX(), Cursor.getSimulationY(), b, source, false, Cursor.getSimulationWordOutOfBounds());
        }
      } else {
        /** @type {boolean} */
        x_keys = true;
        t = {
          sx : value,
          sy : result,
          ex : value,
          ey : result
        };
      }
    }
    if (!a9) {
      if (t.cancel !== true) {
        if (t.linewise === true) {
          /** @type {number} */
          i = Math.min(t.sy, t.ey);
          if (Cursor.isGluedToEOL()) {
            /** @type {number} */
            x = source.getTopX() + source.getLineLength(i - source.getTopY()) - 1;
          } else {
            /** @type {number} */
            x = Math.min(value, source.getTopX() + source.getLineLength(i - source.getTopY()) - 1);
          }
        } else {
          x = t.sx;
          i = t.sy;
          if (t.ey < t.sy || t.sy === t.ey && t.sx > t.ex) {
            x = t.ex;
            i = t.ey;
          }
        }
      }
      if (t.cancel !== true) {
        x_keys = p.isValidCursorPosition(x, i);
      }
    }
    if (a9) {
      vim.audio.play("blocked");
      text("Target mark is in\nanother buffer.");
    } else {
      if (t.cancel === true) {
        vim.audio.play("blocked");
      } else {
        if (!x_keys) {
          vim.audio.play("blocked");
          vim.view.notifyShowRangeAnimation(x, i, x, i, undefined);
          text("I won't have a valid\nlocation after the yank...");
        } else {
          vim.view.notifyShowRangeAnimation(t.sx, t.sy, t.ex, t.ey, source);
          if (t.cancel !== true) {
            log(y, t.sx, t.sy, t.ex, t.ey);
          }
          nodeType = source.yankTextInRange(t);
          vim.regs.doYank(nodeType, w);
          vim.audio.play("yank");
          update(x, i, "HML".indexOf(key.charAt(0)) !== -1);
        }
      }
    }
  }
  /**
   * @return {undefined}
   */
  function Game() {
    vim.input.disableKeys();
    vim.model.setCandleLightMode(true);
    vim.view.notifyCandleLightAnimation();
    vim.screens["game-screen"].hideCommandHelp();
    vim.audio.play("slam");
    if (!vim.login.isUserLoggedIn()) {
      /** @type {boolean} */
      vim.free_game_ended = true;
      window.setTimeout(vim.screens["game-screen"].toBeContinuedFadeIn, 7030);
    } else {
      vim.input.enableKeys();
    }
  }
  /**
   * @return {undefined}
   */
  function closMsg() {
    var elWorkspace = node("#user-message")[0];
    /** @type {string} */
    elWorkspace.style.visibility = "hidden";
    /** @type {number} */
    showAboveTimeout = -1;
  }
  /**
   * @param {string} sHtml
   * @return {undefined}
   */
  function showMessage(sHtml) {
    var parent = node("#user-message")[0];
    /** @type {string} */
    parent.innerHTML = sHtml;
    /** @type {string} */
    parent.style.visibility = "visible";
    if (showAboveTimeout !== -1) {
      window.clearTimeout(showAboveTimeout);
    }
    showAboveTimeout = window.setTimeout(closMsg, 3000);
  }
  /**
   * @param {string} trigger
   * @param {boolean} value
   * @param {number} id
   * @param {number} elem
   * @return {undefined}
   */
  function text(trigger, value, id, elem) {
    vim.view.setCursorCommand(trigger, value, id, elem);
  }
  /**
   * @param {string} val
   * @return {undefined}
   */
  function click(val) {
    vim.view.setCursorCommand(val, true);
  }
  /**
   * @param {number} url
   * @param {number} obj
   * @param {string} x
   * @param {boolean} success
   * @param {boolean} end
   * @return {undefined}
   */
  function msg(url, obj, x, success, end) {
    vim.view.notifySpeech(url, obj, x, success, end);
  }
  /**
   * @param {?} global
   * @return {undefined}
   */
  function defineHACKS(global) {
    vim.view.notifyPrincessFlashAnimation(global);
  }
  /**
   * @return {undefined}
   */
  function ScrollList() {
    vim.view.notifyKeyboardKeyAnimation();
  }
  /**
   * @return {undefined}
   */
  function contentHookup() {
    vim.view.notifyLightsOnAnimation();
  }
  /**
   * @return {undefined}
   */
  function scroller() {
    vim.view.scrollTop();
  }
  /**
   * @return {undefined}
   */
  function scrollBottom() {
    vim.view.scrollBottom();
  }
  /**
   * @return {undefined}
   */
  function _eatWhitespace() {
    vim.view.scrollMiddle();
  }
  /**
   * @param {string} errors
   * @return {?}
   */
  function responseStatusError(errors) {
    return extend(errors, true, true);
  }
  /**
   * @param {string} key
   * @param {boolean} name
   * @param {boolean} callback
   * @return {?}
   */
  function extend(key, name, callback) {
    var options = data;
    var value = options.textArea;
    var x = Cursor.getX();
    var i = Cursor.getY();
    var instance = value.getTopX();
    var len = value.getTopY();
    var grid = vim.board;
    var a8;
    var bf;
    /** @type {number} */
    var offset = x - (i === options.startY ? options.startX : instance);
    var child;
    var val;
    var done;
    var ret;
    var a = x;
    var e = i;
    /** @type {boolean} */
    var bc = false;
    /** @type {boolean} */
    var increase = key === "BACKSPACE";
    /** @type {boolean} */
    var decrease = key === "DELETE";
    /** @type {boolean} */
    var isSpace = key === "REPLAY_ENTER";
    /** @type {boolean} */
    var isNewLine = key === "USER_ENTER";
    var filterParts;
    /** @type {number} */
    var j = i - options.startY;
    var map;
    var index;
    var step;
    var m;
    var result;
    var p = vim.model;
    filterParts = options.shownText.split("\n");
    map = options.originalText.split("\n");
    /** @type {boolean} */
    m = filterParts[j] === " " && value.getLineLength(i - len) === 1 && offset === 0 && !grid.isCodeBG(x, i);
    if (isSpace) {
      result = fn("p", 1, value, options, undefined, undefined, (copy.length === 0 || m ? " " : "") + "\n", m, false, name, undefined, callback);
      if (result) {
        a = instance;
        e = i + 1;
      }
      /** @type {boolean} */
      bc = true;
    } else {
      if (isNewLine) {
        /** @type {string} */
        done = "That works in VIM, but is not supported in this game...\nEither insert / paste the correct number of lines\nto begin with, or use 'o' / 'O' to create new lines.";
      }
    }
    if (offset === 0 && increase || decrease && offset === filterParts[j].length) {
      /** @type {string} */
      done = "That works in VIM, but not in this game...";
    } else {
      if (increase && grid.getHeight(x - 1, i) !== 1) {
        /** @type {string} */
        done = "I can't backspace there...";
      } else {
        if (decrease && grid.getHeight(x, i) !== 1) {
          /** @type {string} */
          done = "I can't delete that...";
        } else {
          if (i - options.startY < map.length && filterParts[i - options.startY].length >= map[i - options.startY].length && increase && !p.isValidCursorPosition(Math.max(value.topX, x - 2), i)) {
            /** @type {string} */
            done = "If I backspace this, I won't have\na valid location to exit insert mode.";
          } else {
            if (i - options.startY < map.length && filterParts[i - options.startY].length >= map[i - options.startY].length && decrease && !p.isValidCursorPosition(Math.min(x + 1, value.topX + value.getLineLength(i - len) - 1), i)) {
              /** @type {string} */
              done = "If I delete this, I won't have a valid\nlocation to exit insert mode.";
            } else {
              if (!isSpace && !isNewLine) {
                if (increase || decrease) {
                  /** @type {number} */
                  step = increase ? -1 : 0;
                  /** @type {number} */
                  index = offset + step;
                  filterParts[j] = filterParts[j].substring(0, index) + filterParts[j].substring(index + 1);
                  if (filterParts[j] === "" && value.getLineLength(i - len) === 1) {
                    /** @type {string} */
                    filterParts[j] = " ";
                  }
                  val = filterParts.join("\n");
                  ret = handler(value, options, x + step, i, 1, true);
                  a = x + step;
                } else {
                  if (m) {
                    /** @type {string} */
                    filterParts[j] = "";
                  }
                  if (callback === true || j < map.length && filterParts[j].length < map[j].length) {
                    filterParts[j] = filterParts[j].substring(0, offset) + key + filterParts[j].substring(offset);
                    val = filterParts.join("\n");
                    ret = format(value, options, x, i, key, false);
                    a = x + 1;
                  } else {
                    /** @type {string} */
                    done = "In this game, you are not allowed to add\nmore than the length of the required text.";
                  }
                }
              }
            }
          }
        }
      }
    }
    if (name !== true && callback !== true) {
      copy.push(key);
    }
    if (!bc) {
      child = debug(a, e, val, done, done ? undefined : ret);
      result = validate(child, value, options, name, undefined, callback);
    }
    if (typeof vim.model.getGlobalSearchStr() !== "undefined") {
      vim.buffers.getCurrentBuffer().getTextAreas().highlight(vim.model.getGlobalSearchStr());
    }
    return result;
  }
  /**
   * @return {?}
   */
  function label_refreshPosition() {
    var k = Cursor.getX();
    var _ = Cursor.getY();
    var m = vim.model;
    var s = vim.board;
    var key;
    if (m.isValidCursorPosition(k - 1, _) && k - 1 >= data.textArea.getTopX()) {
      /** @type {number} */
      k = k - 1;
    }
    key = s.getBG(k, _);
    return m.isValidCursorPosition(k, _) && key !== s.MISSING && key !== s.SKY_MISSING && key !== s.DARK;
  }
  /**
   * @param {string} styles
   * @param {boolean} order
   * @return {undefined}
   */
  function print(styles, order) {
    if (order === true) {
      /** @type {number} */
      array.length = 0;
    }
    array.push(styles);
  }
  /**
   * @return {?}
   */
  function shouldStop() {
    return stop;
  }
  /**
   * @param {number} opt_stop
   * @return {undefined}
   */
  function range(opt_stop) {
    /** @type {number} */
    stop = opt_stop;
  }
  /**
   * @return {undefined}
   */
  function fmt() {
    var i;
    var p = vim.validKeys;
    /** @type {string} */
    var posPattern = "#$%^*()_+0-=WwEe{}GHhjklL|BbNnM,;";
    /** @type {string} */
    var b64char = "`'Tt[]Ff/?g";
    /** @type {string} */
    var preescape = "123456789";
    /** @type {number} */
    i = 0;
    for (; i < posPattern.length; ++i) {
      p.temporarilyDisable(posPattern.charAt(i));
    }
    /** @type {number} */
    i = 0;
    for (; i < b64char.length; ++i) {
      p.temporarilyDisable(b64char.charAt(i));
    }
    /** @type {number} */
    i = 0;
    for (; i < preescape.length; ++i) {
      p.temporarilyDisable(preescape.charAt(i));
    }
    /** @type {number} */
    array.length = 0;
    vim.regs.reset();
    vim.regs.doYank("Dear me,", "u");
    vim.regs.doYank("Worst really came to worst. The plan fell apart.", "v");
    vim.regs.doYank("I hid most of what I need in the lorem buffer.", "w");
    vim.regs.doYank("Directions are in the ground buffer.", "x");
    vim.regs.doYank("The secret to winning is hidden in the marks that are in another castle... written across the sky between W and Y", "y");
    vim.regs.doYank("---");
    vim.regs.doDelete("Houston, we have a problem...");
  }
  /**
   * @param {?} createVoices
   * @return {undefined}
   */
  function updateGetContactPanelView(createVoices) {
    var s = vim.view;
    trigger.princessPostCallback = createVoices;
    s.notifyFadeOutAnimation(function() {
      vim.view.notifyBlank();
      window.setTimeout(trigger, 3000);
      window.setTimeout(function() {
        vim.view.notifyPrincessFlashAnimation(undefined, "#0a0");
      }, 1000);
    });
  }
  /**
   * @return {undefined}
   */
  function trigger() {
    if (trigger.princessPostCallback) {
      trigger.princessPostCallback();
    }
    vim.buffers.switchTo("sky");
    vim.buffers.switchTo("lorem");
    vim.view.notifyFadeInAnimation();
    fmt();
    click("Level 14 ?!\n\nAnd WHERE HAVE ALL\nMY MOTIONS GONE?!");
  }
  /**
   * @param {string} v
   * @return {undefined}
   */
  function bind(v) {
    var val = Cursor.getX();
    var key = Cursor.getY();
    var draggingPanel = vim.buffers.getCurrentBuffer();
    var option = draggingPanel.getTextAreas().get(val, key);
    var e = option.getSpecialArea(val, key);
    var p = vim.audio;
    var graph = vim.model;
    var reverseName = option.getLocalMark(v) || graph.getGlobalMark(v);
    var a = option.getLocalMarkForPosition(val, key) || graph.getGlobalMarkForPosition(val, key);
    var reverseIsSingle = reverseName && reverseName.fixed === true;
    if (!graph.isSupportedMark(v)) {
      p.play("error_beep");
      return;
    }
    if (reverseIsSingle) {
      click("The '" + v + "' mark is already used.\nA new mark will replace the\nold one which was left for\nme on purpose so I'd better\nleave it alone for now.");
      p.play("error_beep");
      return;
    }
    if (a && a.mark !== v) {
      text("That would work in VIM, but\nin this game you can't put\ntwo marks at the same place.");
      vim.audio.play("error_beep");
      return;
    }
    if (e && e.type === "o" && e.requiredMark !== v) {
      if (e.hidden) {
        text("'" + v + "' doesn't feel\nright right here...");
      } else {
        text("'" + e.requiredMark + "' mark is required here.");
      }
      vim.audio.play("error_beep");
      return;
    }
    if (v >= "A" && v <= "Z") {
      graph.addGlobalMark(v, val, key);
    } else {
      option.addLocalMark(v, val, key);
    }
    if (draggingPanel.getName() === "underground" && vim.model.getLevel() === 14 && option.isBossMode() && e && e.type === "o") {
      p.play("aura");
    } else {
      p.play("boing");
    }
    if (option.hasMarkSpecialAreas()) {
      add(option);
    }
  }
  var sampleRate = vim.audio;
  var s = vim.dom;
  var node = s.$;
  var topKiller;
  var l;
  var processedItem;
  var data;
  var copy;
  var indexIs;
  var tempChanges;
  var __result1;
  var tag;
  var dir;
  var array;
  var stop;
  var ret;
  /** @type {number} */
  var showAboveTimeout = -1;
  return {
    init : load,
    gameFocus : buddyNotification,
    recollide : KDBush,
    errorMove : _playCurrentFromStart,
    processCommand : parse,
    processInputModeInput : extend,
    processUndoRedoInputModeInput : responseStatusError,
    enableBlink : sattr,
    disableBlink : hide,
    showMessage : showMessage,
    setCursorCommand : text,
    setCursorCommandUntilMove : click,
    moveLeft : moveLeft,
    moveRight : configure,
    moveUp : moveUp,
    moveDown : moveDown,
    doDelete : callback,
    scrollTop : scroller,
    scrollBottom : scrollBottom,
    scrollMiddle : _eatWhitespace,
    cursorSetAndReadjust : get,
    darknessFalls : Game,
    restartGame : read,
    disableMotions : fmt,
    level13CutScene : updateGetContactPanelView,
    speech : msg,
    princessFlashAnimation : defineHACKS,
    keyboardKeyAnimation : ScrollList,
    lightsOnAnimation : contentHookup,
    checkForSwipingAndAdvance : cb,
    testTextCompletion : add,
    hasInvisibleItems : send,
    returnToCommandMode : redraw,
    canReturnToCommandMode : label_refreshPosition,
    addToLastChangeCommandBuffer : print,
    getLastChangeCommandNumber : shouldStop,
    setLastChangeCommandNumber : range,
    bugsCount : error
  };
}();
vim.input = function() {
  /**
   * @param {!Object} event
   * @return {?}
   */
  function type(event) {
    var transformFlag = event.keyCode || event.which;
    var skippedString = event.shiftKey || transformFlag === 16;
    /** @type {string} */
    var $exitCode = String.fromCharCode(event.charCode || event.keyCode);
    /** @type {string} */
    var editItemKey = $exitCode.toUpperCase();
    /** @type {string} */
    var reverseValue = $exitCode.toLowerCase();
    return editItemKey !== reverseValue && ($exitCode === editItemKey && !skippedString || $exitCode === reverseValue && skippedString);
  }
  /**
   * @param {(Object|string)} event
   * @return {undefined}
   */
  function done(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    } else {
      if (window.event && window.event.returnValue) {
        /** @type {boolean} */
        window.eventReturnValue = false;
      }
    }
  }
  /**
   * @param {string} event
   * @return {?}
   */
  function parse(event) {
    var node;
    if (!event) {
      event = window.event;
    }
    node = event.target ? event.target : event.srcElement;
    if (node.nodeType == 3) {
      node = node.parentNode;
    }
    return node;
  }
  /**
   * @param {!Object} e
   * @return {?}
   */
  function init(e) {
    /** @type {string} */
    var type = "";
    /** @type {boolean} */
    var X = false;
    if (typeof init.escCount === "undefined") {
      /** @type {number} */
      init.escCount = 0;
    }
    $this.keydown(e);
    if (e.keyCode === 27 || $this.checkAndResetCtrlOpenBracket()) {
      /** @type {boolean} */
      X = true;
      init.escCount++;
      that.reset();
      callback("sendToColonCommand", "");
      callback("sendToCursorCommand", "");
      vim.screens["game-screen"].hideCommandHelp();
      if (init.escCount === 2) {
        /** @type {number} */
        init.escCount = 0;
        vim.model.keypressCountdownFinished(true);
      }
    } else {
      /** @type {number} */
      init.escCount = 0;
    }
    if (that.getCurrentState() === "sendToColonCommand") {
      if (e.keyCode === 13) {
        that.processInput("ENTER");
      }
      if (e.keyCode === 8) {
        that.processInput("BACKSPACE");
        /** @type {boolean} */
        X = true;
      }
    }
    if (that.getCurrentState() === "times") {
      if (e.keyCode === 46) {
        that.processInput("DELETE");
      }
    }
    if (e.keyCode === 8 && (parse(e).nodeName !== "INPUT" || parse(e).style.visibility !== "visible")) {
      /** @type {boolean} */
      X = true;
    }
    if (e.keyCode >= 37 && e.keyCode <= 40) {
      /** @type {boolean} */
      X = true;
      if (!clear()) {
        if (!prunedElement && currentElement === 0 || vim.enforceHjkl) {
          if (!vim.enforceHjkl) {
            callback("confirmArrowKeys");
          }
        } else {
          if (currentElement < 1) {
            ++currentElement;
          }
          switch(e.keyCode) {
            case 37:
              /** @type {string} */
              type = "h";
              break;
            case 40:
              /** @type {string} */
              type = "j";
              break;
            case 38:
              /** @type {string} */
              type = "k";
              break;
            case 39:
              /** @type {string} */
              type = "l";
              break;
          }
          if (type !== "") {
            if (vim.screens["game-screen"].isCommandHelpOn()) {
              vim.screens["game-screen"].hideCommandHelp();
            }
            that.processInput(type);
          }
        }
      }
    }
    if ($this.checkAndResetCtrlR() && (that.getCurrentState() === "start" || that.getCurrentState() === "times")) {
      that.processInput("CTRL-R");
      /** @type {boolean} */
      X = true;
    }
    if ($this.checkAndResetFirefoxSlash()) {
      that.processInput("/");
      /** @type {boolean} */
      X = true;
    }
    if ($this.checkAndResetFirefoxSingleQuote()) {
      /** @type {boolean} */
      X = true;
    }
    if (X) {
      done(e);
      return false;
    }
    return true;
  }
  /**
   * @param {!Object} e
   * @return {?}
   */
  function cb(e) {
    var scanCode = e.charCode || e.keyCode;
    /** @type {string} */
    var c = String.fromCharCode(scanCode);
    /** @type {boolean} */
    var screenSmallerThanEditor = false;
    /** @type {boolean} */
    var adjustHeight = false;
    var ac = vim.screens["game-screen"];
    $this.keypress(e);
    if (type(e)) {
      callback("message", "Caps Lock is on. Please turn it off to play.<BR>You can use shift to type upper-case letters.");
      return false;
    }
    if (scanCode >= 128) {
      callback("message", "That last keystroke was not in English.<BR>Please change keyboard language to English.");
      return false;
    }
    if (c === " " && ($this.checkAndResetTilde() || $this.checkBrazilianTildeFollowedBySpaceKeypress())) {
      /** @type {string} */
      c = "~";
      /** @type {boolean} */
      screenSmallerThanEditor = true;
    }
    if (c === " " && $this.checkAndResetCaret()) {
      $this.checkAndResetSwedishCaret();
      /** @type {string} */
      c = "^";
      /** @type {boolean} */
      adjustHeight = true;
    }
    if (c === " " && ($this.checkAndResetGermanCaret() || $this.checkBrazilianCaretFollowedBySpaceKeypress())) {
      /** @type {string} */
      c = "^";
      /** @type {boolean} */
      adjustHeight = true;
    }
    if (c !== "+" && c !== "-" && c != "_" && c != "=" && scanCode !== 13 && ac.isCommandHelpOn()) {
      ac.hideCommandHelp();
    }
    if ((c === "+" || c === "-" || c === "_" || c === "=") && ac.isCommandHelpOn()) {
      ac.traverseHelpCommandExample(c === "+" || c === "=" ? 1 : -1);
      return;
    }
    if (c >= " ") {
      that.processInput(c);
    }
    if (c === " " || screenSmallerThanEditor || adjustHeight) {
      done(e);
      return false;
    }
    return true;
  }
  /**
   * @param {!Event} e
   * @return {undefined}
   */
  function update(e) {
    var TerrainData = vim.board;
    var terrain = Cursor.getX();
    var xx = Cursor.getY();
    $this.keyup(e);
    if ($this.checkAndResetSwissGermanTilde()) {
      that.processInput("~");
    } else {
      if ($this.checkAndResetSwissGermanCaret()) {
        that.processInput("^");
      } else {
        if ($this.checkAndResetFrenchCaret()) {
          that.processInput("^");
        } else {
          if ($this.checkAndResetSpanishTilde()) {
            that.processInput("~");
          } else {
            if ($this.checkAndResetSpanishCaret()) {
              that.processInput("^");
            } else {
              if ($this.checkAndResetSwedishTilde()) {
                that.processInput("~");
              } else {
                if ($this.checkAndResetSwedishCaret()) {
                  that.processInput("^");
                } else {
                  if ($this.checkAndResetGerman3KeysCaret()) {
                    that.processInput("^");
                  } else {
                    if ($this.checkAndResetGermanMacbookSingleQuote()) {
                      that.processInput("'");
                    } else {
                      if ($this.checkAndResetGermanBacktickMacbook()) {
                        that.processInput("`");
                      } else {
                        if ($this.checkIOSBluetoothSpace()) {
                          that.processInput(" ");
                        } else {
                          if ($this.checkAndResetMacBookProDoubleQuote()) {
                            that.processInput('"');
                          } else {
                            if ($this.checkAndResetMacBookProSingleQuote()) {
                              that.processInput("'");
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    if (TerrainData.getBG(terrain, xx) !== TerrainData.MISSING && TerrainData.getBG(terrain, xx) !== TerrainData.SKY_MISSING && TerrainData.getBG(terrain, xx) !== TerrainData.DARK) {
      callback("enableBlink");
    }
  }
  /**
   * @param {string} key
   * @return {?}
   */
  function add(key) {
    var X = vim.model.addKeyPressToCountDown();
    vim.stats.incKeystrokes(vim.model.getLevel());
    Game.addToLastChangeCommandBuffer(key);
    if (X) {
      if (key === "ESC") {
        return apply(false);
      } else {
        return callback("processInputModeInput", key);
      }
    }
  }
  /**
   * @param {!Object} e
   * @return {?}
   */
  function stop(e) {
    /** @type {string} */
    var th_field = "";
    /** @type {boolean} */
    var X = false;
    $this.keydown(e);
    if (e.keyCode === 27 || $this.checkAndResetCtrlOpenBracket()) {
      add("ESC");
      /** @type {boolean} */
      X = true;
    }
    if (e.keyCode === 8) {
      add("BACKSPACE");
      /** @type {boolean} */
      X = true;
    }
    if (e.keyCode === 46) {
      add("DELETE");
    }
    if (e.keyCode === 13) {
      add("USER_ENTER");
      /** @type {boolean} */
      X = true;
    }
    if ($this.checkAndResetFirefoxSlash()) {
      add("/");
      /** @type {boolean} */
      X = true;
    }
    if ($this.checkAndResetFirefoxSingleQuote()) {
      /** @type {boolean} */
      X = true;
    }
    if (X) {
      done(e);
      return false;
    }
    return true;
  }
  /**
   * @param {!Object} e
   * @return {?}
   */
  function handler(e) {
    var c = e.charCode || e.keyCode;
    /** @type {string} */
    var data = String.fromCharCode(c);
    /** @type {boolean} */
    var screenSmallerThanEditor = false;
    /** @type {boolean} */
    var adjustHeight = false;
    $this.keypress(e);
    if (type(e)) {
      callback("message", "Caps Lock is on. Please turn it off to play.<BR>You can use shift to type upper-case letters.");
      return false;
    }
    if (c >= 128) {
      callback("message", "That last keystroke was not in English.<BR>Please change keyboard language to English.");
      return false;
    }
    if (data === " " && ($this.checkAndResetTilde() || $this.checkBrazilianTildeFollowedBySpaceKeypress())) {
      /** @type {string} */
      data = "~";
      /** @type {boolean} */
      screenSmallerThanEditor = true;
    }
    if (data === " " && $this.checkAndResetCaret()) {
      $this.checkAndResetSwedishCaret();
      /** @type {string} */
      data = "^";
      /** @type {boolean} */
      adjustHeight = true;
    }
    if (data === " " && ($this.checkAndResetGermanCaret() || $this.checkBrazilianCaretFollowedBySpaceKeypress())) {
      /** @type {string} */
      data = "^";
      /** @type {boolean} */
      adjustHeight = true;
    }
    if (data >= " ") {
      add(data);
    }
    if (data === " " || screenSmallerThanEditor || adjustHeight) {
      done(e);
      return false;
    }
    return true;
  }
  /**
   * @param {!Event} e
   * @return {undefined}
   */
  function move(e) {
    var TerrainData = vim.board;
    var terrain = Cursor.getX();
    var xx = Cursor.getY();
    $this.keyup(e);
    if ($this.checkAndResetSwissGermanTilde()) {
      add("~");
    } else {
      if ($this.checkAndResetSwissGermanCaret()) {
        add("^");
      } else {
        if ($this.checkAndResetFrenchCaret()) {
          add("^");
        } else {
          if ($this.checkAndResetSpanishTilde()) {
            add("~");
          } else {
            if ($this.checkAndResetSpanishCaret()) {
              add("^");
            } else {
              if ($this.checkAndResetSwedishTilde()) {
                add("~");
              } else {
                if ($this.checkAndResetSwedishCaret()) {
                  add("^");
                } else {
                  if ($this.checkAndResetGerman3KeysCaret()) {
                    add("^");
                  } else {
                    if ($this.checkAndResetGermanMacbookSingleQuote()) {
                      add("'");
                    } else {
                      if ($this.checkAndResetGermanBacktickMacbook()) {
                        add("`");
                      } else {
                        if ($this.checkIOSBluetoothSpace()) {
                          add(" ");
                        } else {
                          if ($this.checkAndResetMacBookProDoubleQuote()) {
                            add('"');
                          } else {
                            if ($this.checkAndResetMacBookProSingleQuote()) {
                              add("'");
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    if (TerrainData.getBG(terrain, xx) !== TerrainData.MISSING && TerrainData.getBG(terrain, xx) !== TerrainData.SKY_MISSING && TerrainData.getBG(terrain, xx) !== TerrainData.DARK) {
      callback("enableBlink");
    }
  }
  /**
   * @param {!Event} event
   * @return {undefined}
   */
  function drag(event) {
    $this.keyup(event);
  }
  /**
   * @param {!Object} data
   * @return {undefined}
   */
  function saveToLocalStorage(data) {
    $this.keypress(data);
  }
  /**
   * @param {!Object} e
   * @return {undefined}
   */
  function _stop(e) {
    $this.keydown(e);
  }
  /**
   * @param {boolean} noIndent
   * @return {undefined}
   */
  function push(noIndent) {
    if (messageId) {
      dom.unbind(window, "keypress", handler);
      dom.unbind(window, "keyup", move);
      dom.unbind(window, "keydown", stop);
    } else {
      if (r) {
        dom.unbind(window, "keydown", hide);
      } else {
        dom.unbind(window, "keypress", cb);
        dom.unbind(window, "keyup", update);
        dom.unbind(window, "keydown", init);
      }
    }
    if (noIndent !== true) {
      dom.bind(window, "keydown", _stop);
      dom.bind(window, "keypress", saveToLocalStorage);
      dom.bind(window, "keyup", drag);
    }
  }
  /**
   * @return {undefined}
   */
  function start() {
    push(true);
    dom.unbind(window, "keydown", _stop);
    dom.unbind(window, "keypress", saveToLocalStorage);
    dom.unbind(window, "keyup", drag);
    if (messageId) {
      dom.bind(window, "keypress", handler);
      dom.bind(window, "keyup", move);
      dom.bind(window, "keydown", stop);
    } else {
      if (r) {
        dom.bind(window, "keydown", hide);
      } else {
        dom.bind(window, "keypress", cb);
        dom.bind(window, "keyup", update);
        dom.bind(window, "keydown", init);
      }
    }
  }
  /**
   * @return {undefined}
   */
  function tick() {
    if (ref !== -1) {
      window.clearTimeout(ref);
      /** @type {number} */
      ref = -1;
    }
    /** @type {boolean} */
    prunedElement = false;
    /** @type {number} */
    currentElement = 0;
    /** @type {boolean} */
    messageId = false;
    $scope.error = self.errorMove;
    $scope.enableBlink = self.enableBlink;
    $scope.message = self.showMessage;
    $scope.scrollTop = self.scrollTop;
    $scope.scrollBottom = self.scrollBottom;
    $scope.scrollMiddle = self.scrollMiddle;
    $scope.moveLeft = self.moveLeft;
    $scope.moveRight = self.moveRight;
    $scope.moveUp = self.moveUp;
    $scope.moveDown = self.moveDown;
    $scope.confirmArrowKeys = vim.screens["game-screen"].confirmArrowKeys;
    $scope.sendToColonCommand = vim.screens["game-screen"].setColonCommand;
    $scope.sendToCursorCommand = self.setCursorCommand;
    $scope.sendToCursorCommandUntilMove = self.setCursorCommandUntilMove;
    /** @type {function(string): ?} */
    $scope.performColonCommand = render;
    $scope.execute = Game.processCommand;
    $scope.processInputModeInput = Game.processInputModeInput;
    $scope.processUndoRedoInputModeInput = Game.processUndoRedoInputModeInput;
    /** @type {function(): undefined} */
    $scope.noTagSupport = processExecute;
    start();
    data = undefined;
    /** @type {boolean} */
    r = false;
  }
  /**
   * @param {string} name
   * @param {string} param
   * @return {undefined}
   */
  function callback(name, param) {
    if ($scope[name]) {
      $scope[name](param);
    }
  }
  /**
   * @param {?} cb
   * @return {undefined}
   */
  function _initInject(cb) {
    push();
    ref = window.setTimeout(start, cb);
  }
  /**
   * @return {undefined}
   */
  function isDone() {
    if (ref !== -1) {
      window.clearTimeout(ref);
      /** @type {number} */
      ref = -1;
    }
    push();
  }
  /**
   * @return {undefined}
   */
  function Q() {
    /** @type {boolean} */
    prunedElement = true;
  }
  /**
   * @param {!Array} styles
   * @return {undefined}
   */
  function set(styles) {
    var i;
    /** @type {number} */
    i = 0;
    for (; i < styles.length; i = i + 1) {
      that.processInput(styles[i]);
    }
  }
  /**
   * @param {string} type
   * @return {undefined}
   */
  function debug(type) {
    callback("sendToColonCommand", type);
  }
  /**
   * @return {?}
   */
  function dataFromControls() {
    return data;
  }
  /**
   * @param {string} data
   * @return {?}
   */
  function process(data) {
    /** @type {string} */
    var O = "^$*+?.";
    /** @type {string} */
    var elm = "&|{}()bBcdDfnrsStvwWxu";
    var e;
    var len;
    if (typeof data === "undefined" || data === "") {
      return false;
    }
    /** @type {number} */
    e = 0;
    for (; e < O.length; e++) {
      len = data.indexOf(O.charAt(e));
      if (len === 0 || len > 0 && data.charAt(len - 1) !== "\\") {
        return true;
      }
    }
    /** @type {number} */
    e = 0;
    for (; e < elm.length; e++) {
      len = data.indexOf(elm.charAt(e));
      if (len > 0 && data.charAt(len - 1) === "\\") {
        return true;
      }
    }
    return false;
  }
  /**
   * @param {string} key
   * @return {?}
   */
  function render(key) {
    /** @type {boolean} */
    var stdout = false;
    /** @type {boolean} */
    var aA = false;
    /** @type {boolean} */
    var ah = false;
    var attrValue = ":" + key.substr(1).trim();
    var self = vim.gamestate;
    var attr = self.getCurrentFilename();
    var a;
    var aliases;
    /** @type {boolean} */
    var subDuration = false;
    var p = vim.validKeys;
    var command;
    var mockType;
    var type;
    var s = vim.stats;
    var i;
    var txt = vim.model;
    var after;
    var mspId;
    var propertyValue;
    /** @type {boolean} */
    var val = true;
    var j = txt.getGlobalSearchStr();
    var path = txt.getGlobalSearchOffset();
    /** @type {boolean} */
    var aa = false;
    /** @type {string} */
    var th_field = "";
    /** @type {string} */
    var ch = "";
    var state = {};
    var data = vim.buffers.getCurrentBuffer().getTextAreas().get(Cursor.getX(), Cursor.getY());
    var args;
    var value;
    if ("?/".indexOf(key.charAt(0)) !== -1) {
      s.incKeystrokes(vim.model.getLevel(), 1 + attrValue.substring(1).length);
      bind(that.currentCommandPrefix, key);
      mspId = txt.getGlobalSearchStr();
      propertyValue = txt.getGlobalSearchOffset();
      if (typeof mspId === "undefined" || mspId === "") {
        callback("sendToColonCommand", "Search pattern missing. No previous search pattern to use.");
        /** @type {boolean} */
        val = false;
      }
      if (val && typeof propertyValue !== "undefined" && propertyValue !== "") {
        callback("sendToColonCommand", "Search offset is currently not supported.");
        /** @type {boolean} */
        val = false;
      }
      if (val && process(mspId.substr(1))) {
        callback("sendToColonCommand", "Searching for a regular expressions is not currently supported.");
        /** @type {boolean} */
        val = false;
      }
      if (val) {
        after = (that.currentCommandPrefix || "") + key.charAt(0) + mspId.substr(1) + key.charAt(0) + (propertyValue || "");
        vim.buffers.getCurrentBuffer().getTextAreas().highlight(vim.model.getGlobalSearchStr());
        that.reset();
        callback("sendToColonCommand", "");
        args = callback("execute", after);
        if (j) {
          /** @type {boolean} */
          aa = bind.detectedPattern === j.substr(1) && (bind.detectedOffset || "") === (path || "");
          if (aa) {
            callback("sendToCursorCommandUntilMove", "I could have used '" + key.charAt(0) + "'\nfollowed by Enter instead.\nIt searches again for the\nlast pattern without the\nneed to retype it.");
          } else {
            if (mspId.substr(1) === j.substr(1)) {
              /** @type {string} */
              value = mspId.charAt(0) === "/" ? "n" : "N";
              if (p.isValid(value) && !p.isDisabled(value)) {
                callback("sendToCursorCommandUntilMove", "I could have used '" + value + "'\ninstead. It's shorter.");
              }
            }
          }
        }
        return args;
      } else {
        txt.setGlobalSearchStr(j);
        txt.setGlobalSearchOffset(path);
        vim.buffers.getCurrentBuffer().getTextAreas().highlight(vim.model.getGlobalSearchStr());
        /** @type {boolean} */
        aA = true;
      }
    }
    if (attrValue === ":u" || attrValue === ":undo") {
      if (!vim.validKeys.isValid("u")) {
        debug("You should collect the 'u' button first.");
        /** @type {boolean} */
        aA = true;
      } else {
        Game.processCommand("u");
      }
      /** @type {boolean} */
      stdout = true;
    } else {
      if (attrValue === ":red" || attrValue === ":redo") {
        if (!vim.validKeys.isValid("\\redo")) {
          debug("You should collect the 'redo' button first.");
          /** @type {boolean} */
          aA = true;
        } else {
          Game.processCommand("CTRL-R");
        }
        /** @type {boolean} */
        stdout = true;
      } else {
        if (attrValue === ":set nu" || attrValue === ":set nonu" || attrValue === ":set nu!" || attrValue === ":set nonu!") {
          if (!vim.validKeys.isValid("\\nu")) {
            debug("You should collect the 'nu' option in order to do that.");
            /** @type {boolean} */
            aA = true;
          } else {
            txt.setShowNumbers(attrValue.indexOf("!") !== -1 ? !txt.isShowNumbers() : attrValue === ":set nu");
          }
          /** @type {boolean} */
          stdout = true;
        } else {
          if (attrValue === ":set stats") {
            s.setVisible(true);
            /** @type {boolean} */
            stdout = true;
          } else {
            if (attrValue === ":set nostats") {
              s.setVisible(false);
              /** @type {boolean} */
              stdout = true;
            } else {
              if (attrValue === ":set stats!" || attrValue === ":set nostats!") {
                s.setVisible(!s.isVisible());
                /** @type {boolean} */
                stdout = true;
              } else {
                if (":" + parseInt(attrValue.substring(1), 10).toString() === attrValue) {
                  s.incKeystrokes(vim.model.getLevel(), 2 + attrValue.substring(1).length);
                  if (!vim.validKeys.isValid("1")) {
                    callback("sendToCursorCommand", "I didn't collect digits yet!");
                  } else {
                    if (vim.validKeys.isDisabled("1")) {
                      callback("sendToCursorCommand", "The digits are gone...\nI can't use them... yet!");
                    } else {
                      if (!vim.buffers.getCurrentBuffer().getTextAreas().exist(vim.model.getCursorX(), vim.model.getCursorY())) {
                        callback("sendToCursorCommand", "This can only be done on text areas");
                      } else {
                        callback("execute", attrValue.substring(1) + "G");
                      }
                    }
                  }
                  /** @type {boolean} */
                  stdout = true;
                } else {
                  if (attrValue === ":registers" || attrValue.indexOf(":registers ") === 0) {
                    callback("sendToColonCommand", vim.regs.showRegisters(attrValue.length > 11 ? attrValue.substring(11) : undefined));
                    /** @type {boolean} */
                    aA = true;
                    /** @type {boolean} */
                    stdout = true;
                  } else {
                    if (attrValue === ":reg" || attrValue.indexOf(":reg ") === 0) {
                      callback("sendToColonCommand", vim.regs.showRegisters(attrValue.length > 5 ? attrValue.substring(5) : undefined));
                      /** @type {boolean} */
                      aA = true;
                      /** @type {boolean} */
                      stdout = true;
                    } else {
                      if (attrValue === ":delmarks" || attrValue.indexOf(":delmarks ") === 0) {
                        if (attrValue.length <= 10) {
                          debug("E741: Argument required (which means that you should supply a list of marks or a ! for all local marks after :delmarks)");
                          /** @type {boolean} */
                          aA = true;
                        } else {
                          ch = vim.model.deleteMarks(attrValue.substring(10));
                          if (ch !== "") {
                            debug(ch);
                            /** @type {boolean} */
                            aA = true;
                          }
                        }
                        /** @type {boolean} */
                        stdout = true;
                      } else {
                        if (attrValue === ":delm" || attrValue.indexOf(":delm ") === 0) {
                          if (attrValue.length <= 6) {
                            debug("E741: Argument required (which means that you should supply a list of marks or a ! for all local marks after :delm)");
                            /** @type {boolean} */
                            aA = true;
                          } else {
                            ch = vim.model.deleteMarks(attrValue.substring(6));
                            if (ch !== "") {
                              debug(ch);
                              /** @type {boolean} */
                              aA = true;
                            }
                          }
                          /** @type {boolean} */
                          stdout = true;
                        } else {
                          if (attrValue === ":delmarks!" || attrValue === ":delm!") {
                            ch = vim.model.deleteMarks("!");
                            if (ch !== "") {
                              debug(ch);
                              /** @type {boolean} */
                              aA = true;
                            }
                            /** @type {boolean} */
                            stdout = true;
                          } else {
                            if (attrValue === ":marks" || attrValue.indexOf(":marks ") === 0) {
                              state = vim.model.getMarksSummaryObject(attrValue.length > 7 ? attrValue.substring(7) : undefined);
                              callback("sendToColonCommand", state.str);
                              if (state.marks && state.marks.trim() === "Toadstool" && state.content === "The power of undo will beat Big Bug " && data && data.isComplete()) {
                                if (Game.hasInvisibleItems(data)) {
                                  Game.testTextCompletion(data);
                                }
                                callback("sendToCursorCommandUntilMove", "The power of undo\nwill beat Big Bug?\n\nGood to know!");
                              }
                              if (state.marks && state.marks.trim() === "Peach" && state.content === "The cursors are NOT friends! " && data) {
                                callback("sendToCursorCommandUntilMove", "They are NOT my friends...?\nWhat game are they playing?!");
                              }
                              /** @type {boolean} */
                              aA = true;
                              /** @type {boolean} */
                              stdout = true;
                            } else {
                              if (attrValue === ":help") {
                                vim.screens["game-screen"].showHelp();
                                /** @type {boolean} */
                                stdout = true;
                              } else {
                                if (attrValue === ":stats") {
                                  vim.screens["game-screen"].showStats();
                                  /** @type {boolean} */
                                  stdout = true;
                                } else {
                                  if (attrValue.indexOf(":help ") === 0) {
                                    command = attrValue.substr(6);
                                    if (p.hasExtendedDesc(command)) {
                                      vim.screens["game-screen"].showCommandHelp(command);
                                    } else {
                                      debug("Sorry, no help for " + command);
                                      /** @type {boolean} */
                                      aA = true;
                                    }
                                    /** @type {boolean} */
                                    stdout = true;
                                  } else {
                                    if (attrValue === ":e start.game" || attrValue === ":e! start.game" || attrValue === ":level 1" || attrValue === ":e" && attr === "start.game" || attrValue === ":e!" && attr === "start.game" || attrValue === ":e" && attr === "Level 1" || attrValue === ":e!" && attr === "Level 1") {
                                      self.restartGame();
                                      debug('Editing file "Level 1".');
                                      /** @type {boolean} */
                                      stdout = true;
                                      /** @type {boolean} */
                                      aA = true;
                                    } else {
                                      if (attrValue === ":login") {
                                        if (!vim.login.isUserLoggedIn()) {
                                          vim.screens["game-screen"].hideCommandHelp();
                                          vim.login.askForLoginInfo();
                                          /** @type {boolean} */
                                          stdout = true;
                                        } else {
                                          debug("Already logged in. Please logout first.");
                                          /** @type {boolean} */
                                          aA = true;
                                        }
                                      } else {
                                        if (attrValue === ":buy") {
                                          if (!vim.login.isUserLoggedIn()) {
                                            vim.screens["game-screen"].hideCommandHelp();
                                            vim.screens["game-screen"].showBuyLicense();
                                            /** @type {boolean} */
                                            stdout = true;
                                          } else {
                                            debug("Current user already have a license.");
                                            /** @type {boolean} */
                                            aA = true;
                                          }
                                        } else {
                                          if (attrValue === ":privacy") {
                                            vim.screens["game-screen"].hideCommandHelp();
                                            vim.screens["game-screen"].openPrivacyDialog();
                                            /** @type {boolean} */
                                            stdout = true;
                                          } else {
                                            if (attrValue === ":cookies") {
                                              vim.screens["game-screen"].hideCommandHelp();
                                              vim.screens["game-screen"].openCookiesDialog();
                                              /** @type {boolean} */
                                              stdout = true;
                                            } else {
                                              if (attrValue === ":copyright") {
                                                vim.screens["game-screen"].hideCommandHelp();
                                                vim.screens["game-screen"].openCreditsDialog();
                                                /** @type {boolean} */
                                                stdout = true;
                                              } else {
                                                if (attrValue === ":terms") {
                                                  vim.screens["game-screen"].hideCommandHelp();
                                                  vim.screens["game-screen"].openTermsDialog();
                                                  /** @type {boolean} */
                                                  stdout = true;
                                                } else {
                                                  if (attrValue.indexOf(":login ") === 0) {
                                                    if (!vim.login.isUserLoggedIn()) {
                                                      aliases = attrValue.split(" ");
                                                      if (aliases.length !== 3) {
                                                        debug("You can use either :login &lt;email&gt; &lt;password&gt; for fast login or :login to open the login dialog.");
                                                        /** @type {boolean} */
                                                        aA = true;
                                                      } else {
                                                        vim.login.fastLoginSubmit(aliases[1], aliases[2]);
                                                        /** @type {boolean} */
                                                        aA = true;
                                                      }
                                                    } else {
                                                      debug("Already logged in. Please logout first.");
                                                      /** @type {boolean} */
                                                      aA = true;
                                                    }
                                                  } else {
                                                    if (attrValue === ":logout") {
                                                      if (vim.login.isUserLoggedIn()) {
                                                        vim.login.logout();
                                                        /** @type {boolean} */
                                                        stdout = true;
                                                        /** @type {boolean} */
                                                        aA = true;
                                                      } else {
                                                        debug("User not logged in yet.");
                                                        /** @type {boolean} */
                                                        aA = true;
                                                      }
                                                    } else {
                                                      if (attrValue === ":keyboard") {
                                                        /** @type {boolean} */
                                                        stdout = true;
                                                        vim.screens["game-screen"].displayKeyboard();
                                                      } else {
                                                        if (attrValue === ":q" || attrValue === ":q!" || attrValue === ":quit" || attrValue === ":quit!") {
                                                          vim.screens["game-screen"].showTitle();
                                                          /** @type {boolean} */
                                                          stdout = true;
                                                        } else {
                                                          if (attrValue === ":ls") {
                                                            debug(vim.buffers.list());
                                                            /** @type {boolean} */
                                                            aA = true;
                                                          } else {
                                                            if (attrValue.indexOf(":b ") === 0 || attrValue === ":b#" || attrValue === ":b%" || attrValue.indexOf(":b") === 0 && !isNaN(parseInt(attrValue.substr(2), 10))) {
                                                              if (vim.model.isKeypressCountdownActive()) {
                                                                debug("Changing buffers while working on a countdown text is not allowed.\nPlease leave the text area and try again. (You can leave by pressing ESC twice)");
                                                              } else {
                                                                type = attrValue.substr(attrValue.charAt(2) === " " ? 3 : 2);
                                                                mockType = vim.buffers.getBuffer(type);
                                                                if (typeof mockType === "string") {
                                                                  debug(mockType);
                                                                } else {
                                                                  if (vim.buffers.getCurrentBuffer().getName() !== mockType.getName()) {
                                                                    vim.buffers.switchTo(type);
                                                                  }
                                                                  debug("Editing buffer " + mockType.getName());
                                                                }
                                                              }
                                                              /** @type {boolean} */
                                                              aA = true;
                                                            } else {
                                                              if (attrValue === ":e underground") {
                                                                if (vim.model.isKeypressCountdownActive()) {
                                                                  debug("Changing buffers while working on a countdown text is not allowed.\nPlease leave the text area and try again. (You can leave by pressing ESC twice)");
                                                                } else {
                                                                  /** @type {string} */
                                                                  type = "underground";
                                                                  mockType = vim.buffers.getBuffer(type);
                                                                  if (typeof mockType === "string") {
                                                                    vim.buffers.add(type, '{"buffer":"underground","addX":100,"addY":100,"cursorX":6,"cursorY":13,"bg":["                             ","                               ","                               ","                            ","                            ","                            ","                            ","                            ","                            ","                            ","                            ","    lllll                   ","    l~~~l                       ","    l~~~l                       ","    l~~~l                       ","    lS~Sllll                    ","    l~~~ llllllllllllllllll     ","    l+++++++++++++++lllllll     ","    lllllllllllllllllll~~~l     ","    lllllllllllllllllll~~~l     ","                      l~~~l   ","                      lllll   ","                            ","                            ","                            ","                            ","                            ","                   ","    ","     "],"entities":[{"type":"princess","x":24,"y":19,"data":{"name":"level_11_princess","levelToLoad":12,"message":"Well done Shadowy One!\\nTo be continued..."}},{"type":"red_door","x":6,"y":15,"invisible":false}],"textareas":[{"x":5,"y":17,"limit":22,"shouldClean":" ","alwaysSink":false,"text":"YOU ^*5.SHALL.NOT^ ^*3.NOT.^ ^*4.PASS.^!!^*1.!.PASS^"}]}');
                                                                  }
                                                                  if (vim.buffers.getCurrentBuffer().getName() !== type) {
                                                                    vim.buffers.switchTo(type);
                                                                  }
                                                                  if (typeof mockType === "string") {
                                                                    callback("sendToCursorCommandUntilMove", "GREAT  SCOTT!!!");
                                                                  }
                                                                  mockType = vim.buffers.getCurrentBuffer();
                                                                  debug("Editing buffer " + mockType.getName());
                                                                }
                                                                /** @type {boolean} */
                                                                aA = true;
                                                              } else {
                                                                if (attrValue === ":level") {
                                                                  debug("Missing level number (for example ':level 3')");
                                                                  /** @type {boolean} */
                                                                  aA = true;
                                                                } else {
                                                                  if (attrValue === ":e" && attr.indexOf("Level ") === 0 || attrValue.indexOf(":level ") === 0) {
                                                                    /** @type {number} */
                                                                    i = attrValue.indexOf(":level ") === 0 ? parseInt(attrValue.substr(7), 10) : parseInt(attr.substr(6), 10);
                                                                    if (i > s.getHighestLevel()) {
                                                                      debug("You can only replay levels that you've already reached. Current highest level is " + s.getHighestLevel() + ".");
                                                                      /** @type {boolean} */
                                                                      aA = true;
                                                                    } else {
                                                                      if (i === 13) {
                                                                        debug("I don't remember anything from level 13... Why risk it?");
                                                                        /** @type {boolean} */
                                                                        aA = true;
                                                                      } else {
                                                                        if (attrValue === ":e" && attr === "Level 11") {
                                                                          debug("On level 11 (after Arrow Island), :e requires a parameter.\nTo restart the level please use ':level 11' instead.");
                                                                          /** @type {boolean} */
                                                                          aA = true;
                                                                        } else {
                                                                          vim.gamestate.loadLevel(i);
                                                                          /** @type {boolean} */
                                                                          stdout = true;
                                                                        }
                                                                      }
                                                                    }
                                                                  } else {
                                                                    if (attrValue === ":!ls" || attrValue.indexOf(":!rm ") === 0 || attrValue === ":!rm" || attrValue.indexOf(":w ") === 0 || attrValue === ":w" || attrValue.indexOf(":w! ") === 0 || attrValue === ":w!" || attrValue.indexOf(":e ") === 0 || attrValue === ":e" || attrValue.indexOf(":e! ") === 0 || attrValue === ":e!") {
                                                                      if (!vim.login.isUserLoggedIn()) {
                                                                        debug("Only licensed users are allowed to save and restore games. Please login first.");
                                                                        /** @type {boolean} */
                                                                        aA = true;
                                                                      } else {
                                                                        if (attrValue === ":!ls") {
                                                                          vim.gamestate.list();
                                                                          /** @type {boolean} */
                                                                          stdout = true;
                                                                        } else {
                                                                          if (attrValue === ":!rm") {
                                                                            debug("!rm requires filename to be deleted.");
                                                                            /** @type {boolean} */
                                                                            aA = true;
                                                                          } else {
                                                                            if (attrValue.indexOf(":!rm ") === 0) {
                                                                              attrValue = attrValue.replace(/\s+/g, " ");
                                                                              aliases = attrValue.split(" ");
                                                                              a = aliases[1];
                                                                              vim.gamestate.remove(a);
                                                                              /** @type {boolean} */
                                                                              stdout = true;
                                                                            } else {
                                                                              if (attrValue.indexOf(":w ") === 0 || attrValue === ":w" || attrValue.indexOf(":w! ") === 0 || attrValue === ":w!") {
                                                                                attrValue = attrValue.replace(/\s+/g, " ");
                                                                                aliases = attrValue.split(" ");
                                                                                if (aliases.length > 2) {
                                                                                  debug("Filename can't contain spaces");
                                                                                  /** @type {boolean} */
                                                                                  aA = true;
                                                                                  /** @type {boolean} */
                                                                                  ah = true;
                                                                                }
                                                                                if (!ah && vim.model.isKeypressCountdownActive()) {
                                                                                  debug("Saving games while working on a countdown text is not allowed.\nPlease leave the text area and try again. (You can leave by pressing ESC twice)");
                                                                                  /** @type {boolean} */
                                                                                  aA = true;
                                                                                  /** @type {boolean} */
                                                                                  ah = true;
                                                                                }
                                                                                a = aliases[1] || attr;
                                                                                if (!ah && a.indexOf("Level ") === 0) {
                                                                                  debug("The last restored game was the read only '" + a + "'. Please specify a new filename after the :w.");
                                                                                  /** @type {boolean} */
                                                                                  aA = true;
                                                                                  /** @type {boolean} */
                                                                                  ah = true;
                                                                                }
                                                                                if (!ah) {
                                                                                  /** @type {boolean} */
                                                                                  subDuration = attrValue === ":w!" || attrValue.indexOf(":w! ") === 0;
                                                                                  vim.gamestate.saveGame(a, subDuration);
                                                                                  /** @type {boolean} */
                                                                                  stdout = true;
                                                                                }
                                                                              } else {
                                                                                if (attrValue.indexOf(":e ") === 0 || attrValue === ":e" || attrValue.indexOf(":e! ") === 0 || attrValue === ":e!") {
                                                                                  attrValue = attrValue.replace(/\s+/g, " ");
                                                                                  aliases = attrValue.split(" ");
                                                                                  if (aliases.length > 2) {
                                                                                    debug("Filename can't contain spaces");
                                                                                    /** @type {boolean} */
                                                                                    aA = true;
                                                                                    /** @type {boolean} */
                                                                                    ah = true;
                                                                                  }
                                                                                  if (!ah && vim.model.isKeypressCountdownActive()) {
                                                                                    debug("Restoring games while working on a countdown text is not allowed.\nPlease leave the text area and try again. (You can leave by pressing ESC twice)");
                                                                                    /** @type {boolean} */
                                                                                    aA = true;
                                                                                    /** @type {boolean} */
                                                                                    ah = true;
                                                                                  }
                                                                                  if (!ah) {
                                                                                    a = aliases[1] || attr;
                                                                                    vim.gamestate.restoreGame(a);
                                                                                    /** @type {boolean} */
                                                                                    stdout = true;
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    that.reset();
    if (!aA) {
      callback("sendToColonCommand", stdout ? "" : "Unknown command");
    }
  }
  /**
   * @return {?}
   */
  function clear() {
    return that.getCurrentState() === "sendToColonCommand";
  }
  /**
   * @param {?} command
   * @return {undefined}
   */
  function wrappedSendCommand(command) {
    push();
    /** @type {boolean} */
    messageId = true;
    start();
  }
  /**
   * @param {boolean} dry
   * @return {undefined}
   */
  function apply(dry) {
    if (!dry) {
      if (!Game.canReturnToCommandMode()) {
        callback("sendToCursorCommand", "Please type something before leaving insert mode\nso I'll have a valid location to stand on.");
        return;
      }
    }
    push();
    /** @type {boolean} */
    messageId = false;
    if (!dry) {
      Game.returnToCommandMode();
    } else {
      vim.screens["game-screen"].showGameMenu();
    }
    start();
  }
  /**
   * @return {?}
   */
  function T() {
    return messageId;
  }
  /**
   * @param {(Object|string)} failure
   * @return {?}
   */
  function hide(failure) {
    get();
    vim.view.resetScrollMode();
    done(failure);
    return false;
  }
  /**
   * @return {undefined}
   */
  function wrappedSend() {
    push();
    /** @type {boolean} */
    r = true;
    start();
  }
  /**
   * @return {undefined}
   */
  function get() {
    push();
    /** @type {boolean} */
    r = false;
    start();
  }
  /**
   * @param {string} key
   * @param {string} raw
   * @return {?}
   */
  function append(key, raw) {
    if (key === "ESC") {
      return apply(false);
    } else {
      return callback(raw ? "processUndoRedoInputModeInput" : "processInputModeInput", key);
    }
  }
  /**
   * @return {undefined}
   */
  function processExecute() {
    callback("sendToCursorCommandUntilMove", "Tag text objects are not\nsupported in this game.", true);
    callback("error");
  }
  /**
   * @param {string} ms
   * @param {string} f
   * @return {undefined}
   */
  function bind(ms, f) {
    var key = f.charAt(0);
    /** @type {boolean} */
    var ret = f.lastIndexOf(key) !== 0;
    /** @type {boolean} */
    var keys = false;
    /** @type {boolean} */
    var anticlockwise = f === key;
    var p = vim.model;
    var v = p.getGlobalSearchStr() ? p.getGlobalSearchStr().substr(1) : undefined;
    var previous = p.getGlobalSearchOffset();
    var i;
    var a;
    i = ret ? f.substring(1, f.lastIndexOf(key)) : f.substr(1);
    if (ret) {
      a = f.substr(f.lastIndexOf(key) + 1);
      /** @type {boolean} */
      ret = a !== "";
    } else {
      if (anticlockwise) {
        /** @type {boolean} */
        ret = true;
      }
    }
    if (i === "") {
      /** @type {boolean} */
      keys = true;
    }
    bind.detectedPattern = i || "";
    bind.detectedOffset = a || "";
    i = keys ? v : i;
    a = anticlockwise ? previous : a;
    if (typeof i !== "undefined" && i !== "") {
      p.setGlobalSearchStr(key + i);
    }
    if (typeof i !== "undefined" && i !== "" && typeof a !== "undefined") {
      p.setGlobalSearchOffset(a);
    }
  }
  var s = vim.validKeys;
  var self = Game;
  var dom = vim.dom;
  var $scope = {};
  /** @type {number} */
  var ref = -1;
  var currentElement;
  var prunedElement;
  var data;
  var messageId;
  var r;
  var that = {
    states : {
      start : {
        input_type : "discrete",
        inputs : {
          1 : "times",
          2 : "times",
          3 : "times",
          4 : "times",
          5 : "times",
          6 : "times",
          7 : "times",
          8 : "times",
          9 : "times",
          '"' : "registers",
          h : "moveLeft",
          l : "moveRight",
          k : "moveUp",
          j : "moveDown",
          w : "execute",
          W : "execute",
          b : "execute",
          B : "execute",
          e : "execute",
          E : "execute",
          "^" : "execute",
          0 : "execute",
          $ : "execute",
          ";" : "execute",
          "," : "execute",
          G : "execute",
          g : "_goto",
          "*" : "execute",
          "#" : "execute",
          n : "execute",
          N : "execute",
          "(" : "execute",
          ")" : "execute",
          "{" : "execute",
          "}" : "execute",
          H : "execute",
          M : "execute",
          L : "execute",
          "|" : "execute",
          x : "execute",
          X : "execute",
          "~" : "execute",
          D : "execute",
          C : "execute",
          Y : "execute",
          "%" : "execute",
          p : "execute",
          P : "execute",
          i : "execute",
          I : "execute",
          a : "execute",
          A : "execute",
          s : "execute",
          S : "execute",
          o : "execute",
          O : "execute",
          "." : "execute",
          u : "execute",
          "CTRL-R" : "execute",
          r : "askForOneChar",
          m : "askForMark",
          "'" : "askForMark",
          "`" : "askForMark",
          f : "askForOneChar",
          F : "askForOneChar",
          t : "askForOneChar",
          T : "askForOneChar",
          "[" : "askForOpeningBracket",
          "]" : "askForClosingBracket",
          d : "askForMotionOrTextObject",
          y : "askForMotionOrTextObject",
          c : "askForMotionOrTextObject",
          z : "scrollAskForPosition",
          ":" : "sendToColonCommand",
          "/" : "sendToColonCommand",
          "?" : "sendToColonCommand"
        }
      },
      sendToColonCommand : {
        input_type : "regex",
        inputs : {
          ENTER : "performColonCommand",
          BACKSPACE : "sendToColonCommand",
          "." : "sendToColonCommand"
        }
      },
      askForOpeningBracket : {
        input_type : "discrete_no_validation",
        inputs : {
          "(" : "execute",
          "{" : "execute"
        }
      },
      askForClosingBracket : {
        input_type : "discrete_no_validation",
        inputs : {
          ")" : "execute",
          "}" : "execute"
        }
      },
      scrollAskForPosition : {
        input_type : "discrete_no_validation",
        inputs : {
          z : "scrollMiddle",
          t : "scrollTop",
          b : "scrollBottom"
        }
      },
      times : {
        input_type : "times",
        inputs : {
          1 : "times",
          2 : "times",
          3 : "times",
          4 : "times",
          5 : "times",
          6 : "times",
          7 : "times",
          8 : "times",
          9 : "times",
          0 : "times",
          DELETE : "times"
        }
      },
      registers : {
        input_type : "register",
        inputs : {
          "." : "back"
        }
      },
      askForOneChar : {
        input_type : "regex",
        inputs : {
          "." : "execute"
        }
      },
      askForMark : {
        input_type : "regex",
        inputs : {
          mark : "execute"
        }
      },
      askForMotionOrTextObject : {
        input_type : "an_or_inner",
        inputs : {
          1 : "times",
          2 : "times",
          3 : "times",
          4 : "times",
          5 : "times",
          6 : "times",
          7 : "times",
          8 : "times",
          9 : "times",
          a : "askForTextObject",
          i : "askForTextObject"
        }
      },
      askForTextObject : {
        input_type : "discrete_no_validation",
        inputs : {
          w : "execute",
          W : "execute",
          s : "execute",
          p : "execute",
          "[" : "execute",
          "]" : "execute",
          "(" : "execute",
          ")" : "execute",
          b : "execute",
          "<" : "execute",
          ">" : "execute",
          t : "noTagSupport",
          "{" : "execute",
          "}" : "execute",
          B : "execute",
          '"' : "execute",
          "'" : "execute",
          "`" : "execute"
        }
      },
      askForMotion : {
        input_type : "regex",
        inputs : {
          startDigit : "times",
          "/" : "sendToColonCommand",
          "?" : "sendToColonCommand",
          "[" : "askForOpeningBracket",
          "]" : "askForClosingBracket",
          duplicate : "execute",
          m : "execute",
          "m." : "askForOneChar"
        }
      },
      _goto : {
        input_type : "discrete_no_validation",
        inputs : {
          g : "execute"
        }
      },
      execute : {},
      moveLeft : {},
      moveRight : {},
      moveUp : {},
      moveDown : {},
      performColonCommand : {},
      error : {},
      noTagSupport : {},
      scrollMiddle : {},
      scrollTop : {},
      scrollBottom : {}
    },
    currentState : "start",
    currentCommand : "",
    currentCommandPrefix : "",
    stateBeforeTimes : "start",
    reset : function() {
      /** @type {string} */
      this.currentState = "start";
      /** @type {string} */
      this.stateBeforeTimes = "start";
      /** @type {string} */
      this.currentCommand = "";
      /** @type {string} */
      this.currentCommandPrefix = "";
    },
    getCurrentState : function() {
      return this.currentState;
    },
    processInput : function(key, value) {
      var options = this.states[this.currentState];
      var state;
      var name;
      /** @type {boolean} */
      var ab = true;
      /** @type {string} */
      var exact_keys = "#$%^*()_+0-=WwEe{}GHhjklL|BbNnM,;";
      /** @type {string} */
      var unWantedOpts = "`'Tt[]Ffg";
      var keys;
      /** @type {boolean} */
      var ah = true;
      /** @type {boolean} */
      var defaults = this.currentState === "start" && key === "z" || this.currentState === "scrollAskForPosition";
      if (key === "BACKSPACE" && this.currentState === "sendToColonCommand" && (this.currentCommand === ":" || this.currentCommand === "/" || this.currentCommand === "?")) {
        callback("sendToColonCommand", "");
        this.reset();
        return;
      }
      if (this.currentState === "start") {
        callback("sendToColonCommand", "");
      }
      if (value !== true && !defaults) {
        vim.model.addKeyPressToCountDown();
      }
      if (this.currentState === "sendToColonCommand" || this.currentState === "start" && key === ":" || value === true) {
      } else {
        vim.stats.incKeystrokes(vim.model.getLevel());
      }
      switch(options.input_type) {
        case "discrete":
        case "discrete_no_validation":
          if (options.inputs[key]) {
            if (key === ":" || options.input_type === "discrete_no_validation" || vim.validKeys.isValid(key) && !vim.validKeys.isDisabled(key)) {
              state = options.inputs[key];
              if (key === "/" || key === "?") {
                this.currentCommandPrefix = this.currentCommand;
                /** @type {string} */
                this.currentCommand = key;
              } else {
                this.currentCommand += key;
              }
            } else {
              /** @type {string} */
              state = "error";
              if (options.input_type === "discrete") {
                if (vim.validKeys.isValid(key) && vim.validKeys.isDisabled(key)) {
                  if ((key === "G" || key === "g") && vim.validKeys.isValid("1") && !vim.validKeys.isDisabled("1")) {
                    /** @type {string} */
                    this.currentCommand = "I don't have '" + key + "', but since\nI have numbers, you can\nuse ':' followed by a line\nnumber and enter.";
                  } else {
                    /** @type {string} */
                    this.currentCommand = "The '" + key + "' button is gone...\nI can't use it!";
                  }
                } else {
                  /** @type {string} */
                  this.currentCommand = "I don't have the '" + key + "' button!";
                }
              } else {
                /** @type {string} */
                this.currentCommand = "It's not legal to use '" + key + "' in this case";
              }
            }
          } else {
            /** @type {string} */
            state = "error";
            /** @type {string} */
            this.currentCommand = "'" + key + "' is illegal in this case.";
          }
          break;
        case "times":
          if (options.inputs[key]) {
            if (key === "DELETE") {
              if (this.currentCommand.length > 0 && "0123456789".indexOf(this.currentCommand.charAt(this.currentCommand.length - 1)) !== -1) {
                this.currentCommand = this.currentCommand.substr(0, this.currentCommand.length - 1);
                state = options.inputs[key];
                if (this.currentCommand === "") {
                  this.reset();
                }
              }
            } else {
              if (vim.validKeys.isValid(key)) {
                state = options.inputs[key];
                this.currentCommand += key;
              } else {
                /** @type {string} */
                state = "error";
              }
            }
          } else {
            state = this.stateBeforeTimes;
            this.currentState = state;
            return this.processInput(key, true);
          }
          break;
        case "an_or_inner":
          if (options.inputs[key]) {
            if (key >= "1" && key <= "9") {
              if (vim.validKeys.isValid(key)) {
                this.currentCommand += key;
                state = options.inputs[key];
                /** @type {boolean} */
                ab = true;
              } else {
                /** @type {string} */
                this.currentCommand = "I don't have the '" + key + "' button!";
                /** @type {string} */
                state = "error";
                /** @type {boolean} */
                ab = true;
              }
            } else {
              if (!vim.validKeys.isValid("\\ia")) {
                /** @type {string} */
                state = "error";
                /** @type {string} */
                this.currentCommand = "I haven't collect the 'ia' button yet!";
              } else {
                state = options.inputs[key];
                this.currentCommand += key;
              }
            }
          } else {
            /** @type {string} */
            state = "askForMotion";
            /** @type {string} */
            this.currentState = state;
            return this.processInput(key, true);
          }
          break;
        case "register":
          if (vim.regs.isUnsupportedRegisterName(key)) {
            /** @type {string} */
            state = "error";
            /** @type {string} */
            this.currentCommand = key + " register is not support in the game at this time.";
          } else {
            if (vim.regs.isValidRegisterName(key)) {
              state = this.stateBeforeRegisters;
              this.currentCommand += key;
            } else {
              /** @type {string} */
              state = "error";
              /** @type {string} */
              this.currentCommand = key + " is not a valid register.";
            }
          }
          break;
        case "regex":
          /** @type {boolean} */
          ab = false;
          for (name in options.inputs) {
            switch(name) {
              case ".":
                if (this.currentCommand.length < 86) {
                  this.currentCommand += key;
                }
                /** @type {boolean} */
                ab = true;
                if (this.currentState === "askForOneChar" && "FfTt".indexOf(this.currentCommand[this.currentCommand.length - 2]) !== -1) {
                  data = this.currentCommand.substr(this.currentCommand.length - 2);
                }
                break;
              case "duplicate":
                keys = this.currentCommand.replace(/\d/g, "");
                if (keys.length > 0 && key === keys[keys.length - 1]) {
                  this.currentCommand += key;
                  /** @type {boolean} */
                  ab = true;
                }
                break;
              case "m":
                if (exact_keys.indexOf(key) !== -1) {
                  if (vim.validKeys.isValid(key)) {
                    if (vim.validKeys.isDisabled(key)) {
                      /** @type {string} */
                      state = "error";
                      /** @type {string} */
                      this.currentCommand = "The '" + key + "' button is gone...\nI can't use it!";
                      /** @type {boolean} */
                      ab = true;
                    } else {
                      if (key === ";") {
                        if (typeof data !== "undefined") {
                          this.currentCommand += data;
                          /** @type {boolean} */
                          ab = true;
                        } else {
                          /** @type {boolean} */
                          ab = false;
                          this.reset();
                        }
                      } else {
                        if (this.currentCommand.length < 86) {
                          this.currentCommand += key;
                        }
                        /** @type {boolean} */
                        ab = true;
                      }
                    }
                  } else {
                    /** @type {string} */
                    state = "error";
                    /** @type {string} */
                    this.currentCommand = "I don't have the '" + key + "' button!";
                    /** @type {boolean} */
                    ab = true;
                  }
                }
                break;
              case "m.":
                if (unWantedOpts.indexOf(key) !== -1) {
                  if (vim.validKeys.isValid(key)) {
                    if (vim.validKeys.isDisabled(key)) {
                      /** @type {string} */
                      state = "error";
                      /** @type {string} */
                      this.currentCommand = "The '" + key + "' button is gone...\nI can't use it!";
                      /** @type {boolean} */
                      ab = true;
                    } else {
                      if (this.currentCommand.length < 86) {
                        this.currentCommand += key;
                      }
                    }
                  } else {
                    /** @type {string} */
                    state = "error";
                    /** @type {string} */
                    this.currentCommand = "I don't have the '" + key + "' button!";
                  }
                  /** @type {boolean} */
                  ab = true;
                }
                break;
              case "/":
              case "?":
                if (key === "/" || key === "?") {
                  if (vim.validKeys.isValid(key) && !vim.validKeys.isDisabled(key)) {
                    this.currentCommandPrefix = this.currentCommand;
                    /** @type {string} */
                    this.currentCommand = key;
                    /** @type {boolean} */
                    ab = true;
                  } else {
                    /** @type {string} */
                    state = "error";
                    /** @type {boolean} */
                    ab = true;
                    if (!vim.validKeys.isValid(key)) {
                      /** @type {string} */
                      this.currentCommand = "I don't have the '" + key + "' button!";
                    } else {
                      /** @type {string} */
                      this.currentCommand = "The '" + key + "' button is gone...\nI can't use it!";
                    }
                  }
                }
                break;
              case "[":
              case "]":
                if (key === name && vim.validKeys.isValid(key)) {
                  this.currentCommand += key;
                  /** @type {boolean} */
                  ab = true;
                }
                break;
              case "ENTER":
                if (key === "ENTER") {
                  /** @type {boolean} */
                  ab = true;
                }
                break;
              case "BACKSPACE":
                if (key === "BACKSPACE") {
                  this.currentCommand = this.currentCommand.substr(0, this.currentCommand.length - 1);
                  /** @type {boolean} */
                  ab = true;
                }
                break;
              case "startDigit":
                if (key >= "1" && key <= "9") {
                  if (vim.validKeys.isValid(key)) {
                    this.currentCommand += key;
                    /** @type {boolean} */
                    ab = true;
                  } else {
                    /** @type {string} */
                    this.currentCommand = "I don't have the '" + key + "' button!";
                    /** @type {string} */
                    state = "error";
                    /** @type {boolean} */
                    ab = true;
                  }
                }
                break;
              case "mark":
                if (vim.model.isSupportedMark(key)) {
                  if (this.currentCommand.length < 86) {
                    this.currentCommand += key;
                  }
                } else {
                  /** @type {string} */
                  this.currentCommand = "'" + key + "' is not a supported mark!";
                  /** @type {string} */
                  state = "error";
                }
                /** @type {boolean} */
                ab = true;
                break;
            }
            if (ab) {
              if (state !== "error") {
                state = options.inputs[name];
              }
              break;
            }
          }
          break;
      }
      if (ab) {
        if (state !== "sendToColonCommand" && this.currentState !== "sendToColonCommand" && !("moveUp moveDown moveLeft moveRight".indexOf(state) !== -1 && this.currentCommand.length === 1)) {
          callback("sendToCursorCommand", this.currentCommand);
        }
        if (state === "times" && this.currentState !== "times") {
          this.stateBeforeTimes = this.currentState;
        } else {
          if (state === "registers") {
            this.stateBeforeRegisters = this.currentState;
          }
        }
        this.currentState = state;
        callback(state, this.currentCommand);
        if (!this.states[this.currentState].inputs) {
          this.reset();
        }
      } else {
        this.reset();
      }
    }
  };
  var $this = function() {
    /**
     * @param {!Object} e
     * @return {?}
     */
    function onKeyDown(e) {
      get(e.keyCode + "D");
      /** @type {boolean} */
      v = false;
      if (e.keyCode === 18) {
        /** @type {boolean} */
        omit = true;
        /** @type {boolean} */
        aL = true;
      } else {
        if (e.keyCode === 225) {
          /** @type {boolean} */
          au = true;
          /** @type {boolean} */
          aj = true;
        } else {
          if (e.keyCode === 16) {
            /** @type {boolean} */
            firstRequiredField = true;
            /** @type {boolean} */
            aG = true;
          } else {
            if (e.keyCode === 17) {
              /** @type {boolean} */
              readFromFileSystem = true;
              /** @type {boolean} */
              aQ = true;
            } else {
              if (e.keyCode === 224 || e.keyCode === 91 || e.keyCode === 93) {
                /** @type {boolean} */
                winRef = true;
              } else {
                if (e.keyCode === 82 && (readFromFileSystem || winRef || e.ctrlKey === true || e.metaKey === true)) {
                  /** @type {boolean} */
                  H1l = true;
                  /** @type {boolean} */
                  readFromFileSystem = false;
                  /** @type {boolean} */
                  winRef = false;
                  /** @type {boolean} */
                  height = false;
                  /** @type {boolean} */
                  be3 = false;
                  /** @type {boolean} */
                  be2 = false;
                  stopEvent(e);
                  return false;
                } else {
                  if (e.keyCode === 85 && (readFromFileSystem || winRef || e.ctrlKey === true || e.metaKey === true)) {
                    /** @type {boolean} */
                    height = true;
                    /** @type {boolean} */
                    readFromFileSystem = false;
                    /** @type {boolean} */
                    winRef = false;
                    /** @type {boolean} */
                    H1l = false;
                    /** @type {boolean} */
                    be3 = false;
                    /** @type {boolean} */
                    be2 = false;
                    stopEvent(e);
                    return false;
                  } else {
                    if (itemrequired && e.keyCode === 222 && !firstRequiredField) {
                      /** @type {boolean} */
                      be2 = true;
                      /** @type {boolean} */
                      be3 = false;
                      /** @type {boolean} */
                      height = false;
                      /** @type {boolean} */
                      H1l = false;
                      /** @type {boolean} */
                      readFromFileSystem = false;
                      /** @type {boolean} */
                      winRef = false;
                      stopEvent(e);
                      return false;
                    } else {
                      if (itemrequired && e.keyCode === 191 && !firstRequiredField) {
                        /** @type {boolean} */
                        be3 = true;
                        /** @type {boolean} */
                        be2 = false;
                        /** @type {boolean} */
                        height = false;
                        /** @type {boolean} */
                        H1l = false;
                        /** @type {boolean} */
                        readFromFileSystem = false;
                        /** @type {boolean} */
                        winRef = false;
                        stopEvent(e);
                        return false;
                      } else {
                        if (e.keyCode === 219 && (readFromFileSystem || e.ctrlKey === true)) {
                          /** @type {boolean} */
                          readFromFileSystem = false;
                          /** @type {boolean} */
                          enableAutoUpgradeHP = true;
                          stopEvent(e);
                          return false;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    /**
     * @param {!Object} event
     * @return {undefined}
     */
    function key_press(event) {
      get(event.keyCode + "P");
      /** @type {boolean} */
      aL = false;
      /** @type {boolean} */
      aj = false;
      /** @type {boolean} */
      aG = false;
      /** @type {boolean} */
      aQ = false;
      /** @type {boolean} */
      v = true;
    }
    /**
     * @param {(Object|string)} e
     * @return {undefined}
     */
    function stopEvent(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
        if (e.stopPropagation) {
          e.stopPropagation();
        }
      } else {
        if (window.event && window.event.returnValue) {
          /** @type {boolean} */
          window.eventReturnValue = false;
        }
      }
    }
    /**
     * @param {!Event} options
     * @return {undefined}
     */
    function keyup(options) {
      get(options.keyCode + "U");
      switch(options.keyCode) {
        case 18:
          /** @type {boolean} */
          omit = false;
          break;
        case 225:
          /** @type {boolean} */
          au = false;
          break;
        case 16:
          /** @type {boolean} */
          firstRequiredField = false;
          break;
        case 17:
          /** @type {boolean} */
          readFromFileSystem = false;
          break;
        case 221:
          if (omit) {
            /** @type {boolean} */
            currentRelations = true;
          }
          break;
        case 192:
          if (!v) {
            /** @type {boolean} */
            outFile = true;
          }
          break;
        case 78:
          if (!v && omit) {
            /** @type {boolean} */
            newPath = true;
          }
          break;
        case 186:
          if (!v && omit) {
            /** @type {boolean} */
            newTop = true;
          }
          break;
        case 219:
          if (!v && firstRequiredField) {
            /** @type {boolean} */
            fx_admin_form = true;
          } else {
            if (!v && !(readFromFileSystem || options.ctrlKey || enableAutoUpgradeHP)) {
              /** @type {boolean} */
              a1 = true;
            }
          }
          break;
        case 224:
        case 91:
        case 93:
          /** @type {boolean} */
          winRef = false;
          break;
        case 32:
          break;
        default:
          /** @type {boolean} */
          currentRelations = false;
          /** @type {boolean} */
          newValueObj = false;
          /** @type {boolean} */
          newPath = false;
          /** @type {boolean} */
          outFile = false;
          /** @type {boolean} */
          a1 = false;
          /** @type {boolean} */
          H1l = false;
          /** @type {boolean} */
          height = false;
          /** @type {boolean} */
          be3 = false;
          /** @type {boolean} */
          be2 = false;
          /** @type {boolean} */
          newTop = false;
          /** @type {boolean} */
          fx_admin_form = false;
          break;
      }
    }
    /**
     * @return {?}
     */
    function relationshipHas() {
      var addedRelations = currentRelations;
      /** @type {boolean} */
      currentRelations = false;
      return addedRelations;
    }
    /**
     * @return {?}
     */
    function justinImageSize() {
      var origNewPath = newPath;
      /** @type {boolean} */
      newPath = false;
      return origNewPath;
    }
    /**
     * @return {?}
     */
    function PyFloat_AsDouble() {
      var val = newValueObj;
      /** @type {boolean} */
      newValueObj = false;
      return val;
    }
    /**
     * @return {?}
     */
    function lappend() {
      return c(avg);
    }
    /**
     * @return {?}
     */
    function next_command() {
      return c(currentUser);
    }
    /**
     * @return {?}
     */
    function got_val() {
      return c(saturation);
    }
    /**
     * @return {?}
     */
    function create_embedded_compiler() {
      return c(ON);
    }
    /**
     * @return {?}
     */
    function lcnum() {
      var b1 = a1;
      /** @type {boolean} */
      a1 = false;
      return b1;
    }
    /**
     * @return {?}
     */
    function googleImageSize() {
      var originalOutFile = outFile;
      /** @type {boolean} */
      outFile = false;
      return originalOutFile;
    }
    /**
     * @return {?}
     */
    function copyBlock() {
      var bl = H1l;
      /** @type {boolean} */
      H1l = false;
      return bl;
    }
    /**
     * @return {?}
     */
    function correctSlug() {
      var whatToScale = height;
      /** @type {boolean} */
      height = false;
      return whatToScale;
    }
    /**
     * @return {?}
     */
    function getConnectorsToTest() {
      var backend3 = be3;
      /** @type {boolean} */
      be3 = false;
      return backend3;
    }
    /**
     * @return {?}
     */
    function _normalizeSingle() {
      var backend2 = be2;
      /** @type {boolean} */
      be2 = false;
      return backend2;
    }
    /**
     * @return {?}
     */
    function jsonFixer() {
      var value = enableAutoUpgradeHP;
      /** @type {boolean} */
      enableAutoUpgradeHP = false;
      return value;
    }
    /**
     * @return {?}
     */
    function $dotimes() {
      return c(b) || c(a) || c(moduleName) || c(X);
    }
    /**
     * @return {?}
     */
    function post_content_formatting() {
      return c(list) || c(grey) || c(header) || c(command);
    }
    /**
     * @return {?}
     */
    function at() {
      var point = newTop;
      /** @type {boolean} */
      newTop = false;
      return point;
    }
    /**
     * @return {?}
     */
    function bufferListFromArray() {
      var bl = fx_admin_form;
      /** @type {boolean} */
      fx_admin_form = false;
      return bl;
    }
    /**
     * @return {?}
     */
    function TclEval() {
      return c(filePath);
    }
    /**
     * @return {?}
     */
    function TclExpr() {
      return c(on);
    }
    /**
     * @return {?}
     */
    function resetFolder() {
      return c(name) || c(div);
    }
    /**
     * @return {?}
     */
    function filter_key() {
      return c(nothing);
    }
    /**
     * @return {?}
     */
    function filter_value() {
      return c(p);
    }
    /**
     * @return {?}
     */
    function values() {
      return c(value);
    }
    /**
     * @param {string} cmp
     * @return {undefined}
     */
    function get(cmp) {
      result.push(cmp);
      if (result.length > 10) {
        result.shift();
      }
    }
    /**
     * @param {!Array} value
     * @param {?} type
     * @return {?}
     */
    function c(value, type) {
      var i;
      var n = value.length;
      /** @type {number} */
      var size = result.length;
      if (size < n) {
        return false;
      }
      if (type) {
        console.log(result.slice(-n));
      }
      /** @type {number} */
      i = 0;
      for (; i < n; ++i) {
        if (value[i][0] === "!" && value[i].substr(1) === result[size - n + i]) {
          return false;
        } else {
          if (value[i][0] !== "!" && value[i] !== result[size - n + i]) {
            return false;
          }
        }
      }
      var fieldData = result[size - 1];
      /** @type {number} */
      result.length = 0;
      result.push(fieldData);
      return true;
    }
    /**
     * @return {undefined}
     */
    function debugOutput() {
      var conv_reverse_sort = {
        altDown : omit,
        altGrDown : au,
        shiftDown : firstRequiredField,
        ctrlDown : readFromFileSystem,
        cmdDown : winRef,
        ctrlOpenBracketDown : enableAutoUpgradeHP,
        swissGermanTildeDown : newPath,
        germanCaretDown : outFile,
        altDownNoKeyPress : aL,
        altGrDownNoKeyPress : aj,
        shiftDownNoKeyPress : aG,
        ctrlDownNoKeyPress : aQ,
        tildeDown : currentRelations,
        caretDown : newValueObj,
        keypressTriggered : v,
        frenchCaretDown : a1,
        ctrlRDown : H1l,
        ctrlUDown : height,
        slashDown : be3,
        singleQuoteDown : be2,
        spanishTildeDown : newTop,
        spanishCaretDown : fx_admin_form
      };
      console.log(conv_reverse_sort);
    }
    /** @type {boolean} */
    var omit = false;
    /** @type {boolean} */
    var au = false;
    /** @type {boolean} */
    var firstRequiredField = false;
    /** @type {boolean} */
    var readFromFileSystem = false;
    /** @type {boolean} */
    var winRef = false;
    /** @type {boolean} */
    var newPath = false;
    /** @type {boolean} */
    var outFile = false;
    /** @type {boolean} */
    var aL = false;
    /** @type {boolean} */
    var aj = false;
    /** @type {boolean} */
    var aG = false;
    /** @type {boolean} */
    var aQ = false;
    /** @type {boolean} */
    var currentRelations = false;
    /** @type {boolean} */
    var newValueObj = false;
    /** @type {boolean} */
    var v = false;
    /** @type {boolean} */
    var a1 = false;
    /** @type {boolean} */
    var H1l = false;
    /** @type {boolean} */
    var height = false;
    /** @type {boolean} */
    var itemrequired = /firefox/i.test(navigator.userAgent);
    /** @type {boolean} */
    var be3 = false;
    /** @type {boolean} */
    var be2 = false;
    /** @type {boolean} */
    var newTop = false;
    /** @type {boolean} */
    var fx_admin_form = false;
    /** @type {boolean} */
    var enableAutoUpgradeHP = false;
    /** @type {!Array} */
    var result = [];
    /** @type {!Array} */
    var moduleName = ["225D", "229D", "221U", "225U", "229D", "32U"];
    /** @type {!Array} */
    var a = ["225D", "221U", "229D", "221U", "225U"];
    /** @type {!Array} */
    var b = ["225D", "221U", "225U", "229D", "32U"];
    /** @type {!Array} */
    var X = ["18D", "221D", "221U", "18U"];
    /** @type {!Array} */
    var header = ["16D", "229D", "221U", "16U", "229D", "32U"];
    /** @type {!Array} */
    var list = ["16D", "221U", "16U", "229D", "32U"];
    /** @type {!Array} */
    var grey = ["16D", "221U", "229D", "221U", "16U"];
    /** @type {!Array} */
    var command = ["16D", "221D", "221U", "16U"];
    /** @type {!Array} */
    var avg = ["!16D", "187D", "187U"];
    /** @type {!Array} */
    var ON = ["16D", "187D", "187U", "16U"];
    /** @type {!Array} */
    var name = ["18D", "16D", "54D", "54U", "16U", "18U"];
    /** @type {!Array} */
    var div = ["16D", "18D", "54D", "54U", "18U", "16U"];
    /** @type {!Array} */
    var on = ["16D", "222D", "39P", "222U", "16U"];
    /** @type {!Array} */
    var aR = ["192D", "192U", "32D", "94P", "32U"];
    /** @type {!Array} */
    var nothing = ["16D", "192D", "192U", "16U", "32D", "32P"];
    /** @type {!Array} */
    var p = ["16D", "54D", "54U", "16U", "32D", "32P"];
    /** @type {!Array} */
    var filePath = ["191D", "39P", "191U"];
    /** @type {!Array} */
    var value = ["32D", "32U"];
    /** @type {!Array} */
    var currentUser = ["16D", "222D", "222U", "16U"];
    /** @type {!Array} */
    var saturation = ["!16D", "222D", "222U"];
    return {
      keydown : onKeyDown,
      keyup : keyup,
      keypress : key_press,
      checkAndResetTilde : relationshipHas,
      checkAndResetSwissGermanTilde : justinImageSize,
      checkAndResetCaret : PyFloat_AsDouble,
      checkAndResetSwissGermanCaret : lappend,
      checkAndResetMacBookProDoubleQuote : next_command,
      checkAndResetMacBookProSingleQuote : got_val,
      checkAndResetFrenchCaret : lcnum,
      checkAndResetGermanCaret : googleImageSize,
      checkAndResetCtrlR : copyBlock,
      checkAndResetCtrlU : correctSlug,
      checkAndResetFirefoxSlash : getConnectorsToTest,
      checkAndResetFirefoxSingleQuote : _normalizeSingle,
      checkAndResetCtrlOpenBracket : jsonFixer,
      checkAndResetSwedishTilde : $dotimes,
      checkAndResetSwedishCaret : post_content_formatting,
      checkAndResetSpanishTilde : at,
      checkAndResetSpanishCaret : bufferListFromArray,
      checkAndResetNorwegianSingleQuote : TclEval,
      checkAndResetGermanMacbookSingleQuote : TclExpr,
      checkAndResetGermanBacktickMacbook : create_embedded_compiler,
      checkAndResetGerman3KeysCaret : resetFolder,
      checkBrazilianTildeFollowedBySpaceKeypress : filter_key,
      checkBrazilianCaretFollowedBySpaceKeypress : filter_value,
      checkIOSBluetoothSpace : values,
      debug : debugOutput
    };
  }();
  return {
    initialize : tick,
    disableKeys : push,
    enableKeys : start,
    enableArrowKeys : Q,
    suspend : _initInject,
    resetState : function() {
      that.reset();
    },
    isInColonInputMode : clear,
    isInMiddleOfCursorCommand : function() {
      return that.currentCommand.length > 0;
    },
    injectCommand : set,
    getLastInlineSearch : dataFromControls,
    done : isDone,
    preventDefault : done,
    switchToInputMode : wrappedSendCommand,
    returnToCommandMode : apply,
    isInInputMode : T,
    switchToScrollMode : wrappedSend,
    leaveScrollMode : get,
    emulateInputModeInput : append,
    noTagSupport : processExecute,
    detectTilde : $this
  };
}();
vim.screens["game-screen"] = function() {
  /**
   * @return {?}
   */
  function calculate() {
    if (group === "Dvorak") {
      return "Colemak";
    }
    if (group === "Colemak") {
      return "standard";
    }
    return "Dvorak";
  }
  /**
   * @return {undefined}
   */
  function recursion() {
    ready(calculate());
  }
  /**
   * @param {string} data
   * @return {undefined}
   */
  function ready(data) {
    /** @type {string} */
    group = data;
    switch(data) {
      case "Dvorak":
        /** @type {!Array} */
        command = look_west;
        break;
      case "Colemak":
        /** @type {!Array} */
        command = cssFillUpStopper;
        break;
      default:
        /** @type {!Array} */
        command = LIST;
    }
    render();
  }
  /**
   * @return {undefined}
   */
  function getData() {
    $("#game-menu-volume .indicator")[0].style.width = audio.getVolume() + "%";
  }
  /**
   * @return {undefined}
   */
  function interval() {
    /** @type {boolean} */
    bh = !bh;
    if (bh) {
      event = audio.getVolume();
      audio.setVolume(0);
    } else {
      audio.setVolume(event);
    }
    getData();
  }
  /**
   * @param {!Event} e
   * @return {undefined}
   */
  function move(e) {
    var horizontalTouchStart;
    var draggedItem = $("#game-menu-volume .indicator")[0];
    var scroll;
    var horizontalTouchEnd = draggedItem.getClientRects()[0].left;
    if (e.pageX === null) {
      /** @type {!Element} */
      scroll = document.documentElement && document.documentElement.scrollLeft !== null ? document.documentElement : document.body;
      horizontalTouchStart = e.clientX + scroll.scrollLeft;
    } else {
      horizontalTouchStart = e.pageX;
    }
    /** @type {number} */
    event = horizontalTouchStart - horizontalTouchEnd;
    audio.setVolume(event);
    getData();
  }
  /**
   * @param {!Object} event
   * @return {undefined}
   */
  function preventDefault(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    } else {
      if (window.event && window.event.returnValue) {
        /** @type {boolean} */
        window.eventReturnValue = false;
      }
    }
  }
  /**
   * @param {!Object} e
   * @return {?}
   */
  function reset(e) {
    find();
    if (!vim.free_game_ended || vim.licensedUser === true) {
      /** @type {string} */
      comCursor.style.visibility = "hidden";
      /** @type {string} */
      s.style.visibility = "hidden";
      vim.input.initialize();
    }
    /** @type {string} */
    $("#game-screen #game-menu")[0].style.display = "block";
    Game.gameFocus();
    preventDefault(e);
    return false;
  }
  /**
   * @return {undefined}
   */
  function setup() {
    /** @type {boolean} */
    slug = true;
    /** @type {string} */
    $("#title")[0].style.display = "block";
    /** @type {string} */
    $("#social-buttons")[0].style.display = "block";
    /** @type {string} */
    $("#banners")[0].style.display = "block";
    /** @type {string} */
    $("#game-screen #game-menu")[0].style.display = "none";
    add();
    vim.input.disableKeys();
    window.addEventListener("keydown", reset, false);
  }
  /**
   * @return {undefined}
   */
  function find() {
    /** @type {boolean} */
    slug = false;
    /** @type {string} */
    $("#title")[0].style.display = "none";
    /** @type {string} */
    $("#social-buttons")[0].style.display = "none";
    /** @type {string} */
    $("#banners")[0].style.display = "none";
    window.removeEventListener("keydown", reset, false);
    vim.view.notifyPointCursor();
  }
  /**
   * @return {undefined}
   */
  function result() {
    var str = comCursor.style.color;
    var input = str.substring(str.lastIndexOf(",") + 1, str.lastIndexOf(")"));
    /** @type {number} */
    var c = 0.05;
    var i;
    if (str === "") {
      /** @type {string} */
      comCursor.style.color = "rgba(255,255,255,0)";
      /** @type {number} */
      i = c;
      for (; i < 1; i = i + c) {
        window.setTimeout(result, i * 2000);
      }
      window.setTimeout(write, i * 2000);
      /** @type {string} */
      comCursor.style.visibility = "visible";
    } else {
      /** @type {string} */
      comCursor.style.color = "rgba(255,255,255," + (parseFloat(input) + c) + ")";
    }
  }
  /**
   * @return {undefined}
   */
  function write() {
    var str = s.style.color;
    var input = str.substring(str.lastIndexOf(",") + 1, str.lastIndexOf(")"));
    /** @type {number} */
    var c = 0.05;
    var i;
    if (str === "") {
      /** @type {string} */
      s.style.color = "rgba(255,255,0,0)";
      /** @type {number} */
      i = c;
      for (; i < 1; i = i + c) {
        window.setTimeout(write, i * 2000);
      }
      /** @type {string} */
      s.style.visibility = "visible";
    } else {
      /** @type {string} */
      s.style.color = "rgba(255,255,0," + (parseFloat(input) + c) + ")";
    }
  }
  /**
   * @return {undefined}
   */
  function checkloaded() {
    audio.play("menu_click");
    click();
  }
  /**
   * @return {undefined}
   */
  function p() {
    vim.input.resetState();
    vim.input.injectCommand([":", "l", "e", "v", "e", "l", " ", "1", "ENTER"]);
  }
  /**
   * @return {undefined}
   */
  function lastKeyAndCheck() {
    vim.input.resetState();
    vim.input.injectCommand([":", "l", "e", "v", "e", "l", " ", "3", "ENTER"]);
  }
  /**
   * @return {undefined}
   */
  function cb() {
    vim.input.resetState();
    vim.input.injectCommand([":", "l", "e", "v", "e", "l", " "]);
  }
  /**
   * @return {undefined}
   */
  function shrinkBreadCrumb() {
    vim.input.resetState();
    vim.input.injectCommand([":", "w", " "]);
  }
  /**
   * @return {undefined}
   */
  function logPutRequest() {
    vim.input.resetState();
    vim.input.injectCommand([":", "e", " "]);
  }
  /**
   * @return {undefined}
   */
  function buildRoute() {
    vim.input.resetState();
    vim.input.injectCommand([":", "!", "l", "s", "ENTER"]);
  }
  /**
   * @return {undefined}
   */
  function doAction() {
    vim.input.resetState();
    vim.input.injectCommand([":", "!", "r", "m", " "]);
  }
  /**
   * @return {undefined}
   */
  function play() {
    vim.input.resetState();
    vim.input.injectCommand([":", "s", "e", "t", " ", "s", "t", "a", "t", "s", "ENTER"]);
    self.addClass("#game-menu", "nohover");
    window.setTimeout(function() {
      self.removeClass("#game-menu", "nohover");
    }, 100);
  }
  /**
   * @return {undefined}
   */
  function hide() {
    vim.input.resetState();
    vim.input.injectCommand([":", "s", "e", "t", " ", "n", "o", "s", "t", "a", "t", "s", "ENTER"]);
    self.addClass("#game-menu", "nohover");
    window.setTimeout(function() {
      self.removeClass("#game-menu", "nohover");
    }, 100);
  }
  /**
   * @return {undefined}
   */
  function updateRegionDisplay() {
    vim.input.resetState();
    vim.input.injectCommand([":", "h", "e", "l", "p", " "]);
  }
  /**
   * @param {!Object} e
   * @return {?}
   */
  function onclick(e) {
    if (e.keyCode === 27) {
      clear();
      preventDefault(e);
    }
    return false;
  }
  /**
   * @return {undefined}
   */
  function clear() {
    /** @type {string} */
    $("#allow-arrow-keys-dialog")[0].style.display = "none";
    /** @type {string} */
    $("#shadowOverlay")[0].style.visibility = "hidden";
    window.removeEventListener("keydown", onclick, false);
    vim.input.enableArrowKeys();
    appendChild();
  }
  /**
   * @return {undefined}
   */
  function addPassMaskFn() {
    vim.input.disableKeys();
    /** @type {string} */
    $("#shadowOverlay")[0].style.visibility = "visible";
    add();
    window.addEventListener("keydown", onclick, false);
    /** @type {string} */
    $("#allow-arrow-keys-dialog")[0].style.display = "block";
  }
  /**
   * @param {!Object} e
   * @return {?}
   */
  function m(e) {
    var s = vim.input;
    var my_chat = s.detectTilde;
    my_chat.keydown(e);
    if (my_chat.checkAndResetCtrlR()) {
      get("CTRL-R");
      preventDefault(e);
      return false;
    } else {
      if (my_chat.checkAndResetFirefoxSlash()) {
        get("/");
        preventDefault(e);
        return false;
      } else {
        if (my_chat.checkAndResetFirefoxSingleQuote()) {
          get("'");
          preventDefault(e);
          return false;
        } else {
          if (e.keyCode === 27 || e.keyCode === 13) {
            f();
          } else {
            if (e.keyCode === 16) {
              /** @type {boolean} */
              w = true;
            } else {
              /** @type {boolean} */
              W = true;
            }
          }
        }
      }
    }
  }
  /**
   * @param {!Event} event
   * @return {undefined}
   */
  function onReady(event) {
    vim.input.detectTilde.keyup(event);
    if (event.keyCode === 16) {
      /** @type {boolean} */
      w = false;
      if (!W) {
        recursion();
      }
      /** @type {boolean} */
      W = false;
    }
  }
  /**
   * @param {!Object} event
   * @return {undefined}
   */
  function keyDown(event) {
    /** @type {string} */
    var body = String.fromCharCode(event.charCode || event.keyCode);
    vim.input.detectTilde.keypress(event);
    if (body === " ") {
      f();
    } else {
      get(body);
    }
  }
  /**
   * @param {string} date
   * @return {undefined}
   */
  function get(date) {
    var key = vim.validKeys.getKeyDescription(date);
    /** @type {(Element|null)} */
    var lnkDiv = document.getElementById("key-description");
    if (key !== "") {
      /** @type {string} */
      lnkDiv.innerHTML = date + " - " + key + (vim.validKeys.isDisabled(date) ? " <span style='color: #555'>(Temporarily missing)</span>" : "");
    }
  }
  /**
   * @return {undefined}
   */
  function f() {
    /** @type {string} */
    $("#valid-keys-dialog")[0].style.display = "none";
    /** @type {string} */
    $("#shadowOverlay")[0].style.visibility = "hidden";
    window.removeEventListener("keypress", keyDown, false);
    window.removeEventListener("keydown", m, false);
    window.removeEventListener("keyup", onReady, false);
    appendChild();
    /** @type {boolean} */
    w = false;
    /** @type {boolean} */
    W = false;
  }
  /**
   * @return {undefined}
   */
  function render() {
    var j;
    var bE;
    /** @type {string} */
    var fsHTML = "";
    var input;
    var p = vim.validKeys;
    /** @type {number} */
    j = 0;
    for (; j < command.length; ++j) {
      /** @type {string} */
      fsHTML = fsHTML + "<ul>";
      switch(j) {
        case 1:
          /** @type {string} */
          fsHTML = fsHTML + '<li class="tab_key key_inactive">&nbsp;</li>';
          break;
        case 2:
          /** @type {string} */
          fsHTML = fsHTML + '<li class="capslock key_inactive"></li>';
          break;
        case 3:
          /** @type {string} */
          fsHTML = fsHTML + '<li class="shift key_inactive">';
          /** @type {string} */
          fsHTML = fsHTML + ('<div id="switch-keyboard-layout" onClick="vim.screens[\'game-screen\'].switchLayoutStyle()">Switch layout<br>to ' + calculate() + "</div>");
          /** @type {string} */
          fsHTML = fsHTML + "</li>";
          break;
      }
      /** @type {number} */
      bE = 0;
      for (; bE < command[j].length / 2; ++bE) {
        /** @type {string} */
        fsHTML = fsHTML + "<li";
        input = command[j].charAt(bE * 2);
        if (input === "|") {
          /** @type {string} */
          fsHTML = fsHTML + ' class="pipe"';
        }
        /** @type {string} */
        fsHTML = fsHTML + '><div class="key_up';
        if (p.isValid(input)) {
          if (p.isDisabled(input)) {
            /** @type {string} */
            fsHTML = fsHTML + " disabled";
          } else {
            /** @type {string} */
            fsHTML = fsHTML + " active";
          }
        }
        /** @type {string} */
        fsHTML = fsHTML + ("\" onClick=\"vim.screens['game-screen'].showKeyDescription('" + (input === '"' ? "&quot;" : input) + "');\"");
        /** @type {string} */
        fsHTML = fsHTML + (">" + (p.isDisabled(input) || p.isValid(input) ? input : "") + "</div>");
        /** @type {string} */
        fsHTML = fsHTML + '<div class="key_down';
        input = command[j].charAt(bE * 2 + 1);
        if (p.isValid(input)) {
          if (p.isDisabled(input)) {
            /** @type {string} */
            fsHTML = fsHTML + " disabled";
          } else {
            /** @type {string} */
            fsHTML = fsHTML + " active";
          }
        }
        /** @type {string} */
        fsHTML = fsHTML + ('" onClick=\'vim.screens["game-screen"].showKeyDescription("' + (input === "'" ? "&apos;" : input) + "\");'");
        /** @type {string} */
        fsHTML = fsHTML + (">" + (p.isDisabled(input) || p.isValid(input) ? input : "") + "</div></li>");
      }
      switch(j) {
        case 0:
          /** @type {string} */
          fsHTML = fsHTML + '<li class="backspace key_inactive">&nbsp;</li>';
          break;
        case 2:
          /** @type {string} */
          fsHTML = fsHTML + '<li class="enter key_inactive"></li>';
          break;
        case 3:
          /** @type {string} */
          fsHTML = fsHTML + '<li class="shift key_inactive"></li>';
          break;
      }
      /** @type {string} */
      fsHTML = fsHTML + "</ul>";
    }
    /** @type {string} */
    fsHTML = fsHTML + '<div id="key-description">Please press a key to read its description. Enter or ESC to exit.<br>For a more complete description type :help [character] in the game screen.</div>';
    /** @type {string} */
    $("#show-valid-keys-dialog")[0].innerHTML = fsHTML;
  }
  /**
   * @param {!Object} e
   * @return {?}
   */
  function start(e) {
    if (e.keyCode === 27) {
      set();
      preventDefault(e);
      return false;
    } else {
      if (e.keyCode === 40 || e.keyCode === 38) {
        winHints.scrollTop = winHints.scrollTop + 20 * (e.keyCode === 40 ? 1 : -1);
        preventDefault(e);
        return false;
      }
    }
    return true;
  }
  /**
   * @param {!Object} event
   * @return {undefined}
   */
  function onKeyPress(event) {
    var charcode = event.charCode || event.keyCode;
    /** @type {string} */
    var ch = String.fromCharCode(charcode);
    if (ch === "k" || ch === "j") {
      winHints.scrollTop = winHints.scrollTop + 20 * (ch === "j" ? 1 : -1);
    }
  }
  /**
   * @return {undefined}
   */
  function set() {
    /** @type {string} */
    winHints.style.display = "none";
    appendChild();
    /** @type {string} */
    $("#shadowOverlay")[0].style.visibility = "hidden";
    window.removeEventListener("keydown", start, false);
    window.removeEventListener("keypress", onKeyPress, false);
  }
  /**
   * @return {undefined}
   */
  function click() {
    reduce();
    /** @type {string} */
    $("#shadowOverlay")[0].style.visibility = "visible";
    add();
    /** @type {string} */
    winHints.style.display = "block";
    window.addEventListener("keydown", start, false);
    window.addEventListener("keypress", onKeyPress, false);
  }
  /**
   * @param {!Object} event
   * @return {undefined}
   */
  function type(event) {
    var charcode = event.charCode || event.keyCode;
    /** @type {string} */
    var ch = String.fromCharCode(charcode);
    if (ch === "k" || ch === "j") {
      boxChild.scrollTop = boxChild.scrollTop + 20 * (ch === "j" ? 1 : -1);
    }
  }
  /**
   * @param {!Object} e
   * @return {?}
   */
  function u(e) {
    if (e.keyCode === 27 || e.keyCode === 13) {
      next();
      preventDefault(e);
      return false;
    } else {
      if (e.keyCode === 40 || e.keyCode === 38) {
        boxChild.scrollTop = boxChild.scrollTop + 20 * (e.keyCode === 40 ? 1 : -1);
        preventDefault(e);
        return false;
      }
    }
    return true;
  }
  /**
   * @return {undefined}
   */
  function next() {
    /** @type {string} */
    boxChild.style.display = "none";
    appendChild();
    /** @type {string} */
    $("#shadowOverlay")[0].style.visibility = "hidden";
    window.removeEventListener("keydown", u, false);
    window.removeEventListener("keypress", type, false);
  }
  /**
   * @return {undefined}
   */
  function showHelp() {
    reduce();
    /** @type {string} */
    $("#shadowOverlay")[0].style.visibility = "visible";
    add();
    /** @type {string} */
    boxChild.style.display = "block";
    window.addEventListener("keydown", u, false);
    window.addEventListener("keypress", type, false);
  }
  /**
   * @param {!Object} event
   * @return {undefined}
   */
  function handleEvent(event) {
    var charcode = event.charCode || event.keyCode;
    /** @type {string} */
    var ch = String.fromCharCode(charcode);
    if (ch === "k" || ch === "j") {
      tempResetButton.scrollTop = tempResetButton.scrollTop + 20 * (ch === "j" ? 1 : -1);
    }
  }
  /**
   * @param {!Object} e
   * @return {?}
   */
  function onDocumentKeyDown(e) {
    if (e.keyCode === 27 || e.keyCode === 13) {
      filter();
      preventDefault(e);
      return false;
    } else {
      if (e.keyCode === 40 || e.keyCode === 38) {
        tempResetButton.scrollTop = tempResetButton.scrollTop + 20 * (e.keyCode === 40 ? 1 : -1);
        preventDefault(e);
        return false;
      }
    }
    return true;
  }
  /**
   * @return {undefined}
   */
  function filter() {
    /** @type {string} */
    tempResetButton.style.display = "none";
    appendChild();
    /** @type {string} */
    $("#shadowOverlay")[0].style.visibility = "hidden";
    window.removeEventListener("keydown", onDocumentKeyDown, false);
    window.removeEventListener("keypress", handleEvent, false);
  }
  /**
   * @return {undefined}
   */
  function init() {
    var $scope = vim.login;
    reduce();
    /** @type {string} */
    $("#shadowOverlay")[0].style.visibility = "visible";
    add();
    /** @type {string} */
    $("#stat-user-email")[0].innerText = $scope.isUserLoggedIn() ? vim.emailaddr + ($scope.isPartOfAGroup() ? " (" + $scope.getGroupName() + ")" : "") : "Unlicensed user";
    $("#stat-table-div")[0].innerHTML = vim.stats.getUserStatisticsTable();
    /** @type {string} */
    tempResetButton.style.display = "block";
    window.addEventListener("keydown", onDocumentKeyDown, false);
    window.addEventListener("keypress", handleEvent, false);
  }
  /**
   * @return {undefined}
   */
  function search() {
    var bF;
    var bE;
    vim.input.disableKeys();
    /** @type {boolean} */
    w = false;
    /** @type {boolean} */
    W = false;
    /** @type {string} */
    $("#shadowOverlay")[0].style.visibility = "visible";
    add();
    window.addEventListener("keypress", keyDown, false);
    window.addEventListener("keydown", m, false);
    window.addEventListener("keyup", onReady, false);
    render();
    /** @type {string} */
    $("#valid-keys-dialog")[0].style.display = "block";
  }
  /**
   * @return {undefined}
   */
  function action() {
    if (vim.login.isUserLoggedIn()) {
      vim.login.logout();
    } else {
      add();
      vim.login.askForLoginInfo();
    }
  }
  /**
   * @return {undefined}
   */
  function refreshNextPrevLinks() {
    if (comCursor.style.visibility === "visible") {
      /** @type {string} */
      comCursor.style.visibility = "hidden";
      /** @type {string} */
      comCursor.style.color = "";
      /** @type {string} */
      s.style.visibility = "hidden";
      /** @type {string} */
      s.style.color = "";
      vim.input.enableKeys();
    }
  }
  /**
   * @return {undefined}
   */
  function _fixCKEDITORBug() {
    if (!vim.login.isUserLoggedIn()) {
      /** @type {string} */
      $("#user-login")[0].style.display = "block";
      /** @type {string} */
      $("#user-logout")[0].style.display = "none";
      /** @type {string} */
      $(".game-menu-buy")[0].style.display = "block";
    } else {
      /** @type {string} */
      $("#user-login")[0].style.display = "none";
      /** @type {string} */
      $("#user-logout")[0].style.display = "block";
      /** @type {string} */
      $(".game-menu-buy")[0].style.display = "none";
    }
  }
  /**
   * @return {undefined}
   */
  function elementLibrary() {
    var showPlanarOpt = vim.login.isUserLoggedIn() && vim.groupAdmin;
    /** @type {string} */
    $("#level-breakdown")[0].style.display = showPlanarOpt ? "block" : "none";
    var immediatelyVisible = vim.login.isUserLoggedIn() && vim.login.isPartOfAGroup();
    /** @type {string} */
    $("#leaderboard")[0].style.display = immediatelyVisible ? "block" : "none";
  }
  /**
   * @return {undefined}
   */
  function test() {
    /** @type {string} */
    var isSelected = vim.login.shouldUserConfirmTerms() ? "block" : "none";
    /** @type {string} */
    $("#accept-terms")[0].style.display = isSelected;
    /** @type {string} */
    $("#terms-notification")[0].style.display = isSelected;
  }
  /**
   * @return {undefined}
   */
  function walletRecord() {
    set();
    vim.email.confirmEmailAddress(parse, undefined, false);
  }
  /**
   * @return {undefined}
   */
  function hostAttemptCb() {
    set();
    vim.email.confirmEmailAddress(parse, undefined, true);
  }
  /**
   * @return {undefined}
   */
  function BP_BREAKONCHILDCHANGE() {
    set();
    vim.email.confirmEmailAddress(parse, undefined, false, true);
  }
  /**
   * @param {boolean} defaultsToAny
   * @param {boolean} annotation
   * @param {number} global
   * @return {undefined}
   */
  function parse(defaultsToAny, annotation, global) {
    /** @type {(Element|null)} */
    var res = document.getElementById("paypal_form");
    /** @type {boolean} */
    var match = document.location.host === "localhost" || document.location.host.indexOf("beta") !== -1;
    var helpTextData;
    if (!res.innerHTML) {
      /** @type {string} */
      res.action = "https://www." + (match ? "sandbox." : "") + "paypal.com/cgi-bin/webscr";
      /** @type {string} */
      res.method = "post";
      /** @type {string} */
      res.target = "_top";
      /** @type {string} */
      helpTextData = '<input type="hidden" name="cmd" value="_s-xclick"><input type="hidden" name="hosted_button_id" value="CHANGE_ME">';
      /** @type {string} */
      helpTextData = helpTextData + ('<input type="image" src="https://www.' + (match ? "sandbox.paypal" : "paypalobjects") + '.com/en_US/GB/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online.">');
      /** @type {string} */
      helpTextData = helpTextData + ('<img alt="" border="0" src="https://www.' + (match ? "sandbox.paypal" : "paypalobjects") + '.com/en_GB/i/scr/pixel.gif" width="1" height="1">');
      /** @type {string} */
      helpTextData = helpTextData + '<input id="paypal_user_email" type="hidden" name="custom" value="CHANGE ME">';
      /** @type {string} */
      res.innerHTML = helpTextData;
    }
    if (defaultsToAny) {
      /** @type {string} */
      res.children[1].value = match ? "VCJBEB7R78JQG" : "J2KK82Y9UGBKL";
    } else {
      if (annotation) {
        /** @type {string} */
        res.children[1].value = match ? "7FUGNTE59Y2WU" : "9T7ZRT5ACFJYS";
      } else {
        if (global == 10) {
          /** @type {string} */
          res.children[1].value = match ? "N72GNLS6Z23NL" : "NKEJ4GZNCR8JY";
        } else {
          /** @type {string} */
          res.children[1].value = match ? "NP786CSELUYY4" : "R8977MY6X6S9A";
        }
      }
    }
    $("#paypal_user_email")[0].value = vim.emailaddr;
    $("#buy_now form")[0].submit();
  }
  /**
   * @param {!Object} e
   * @return {?}
   */
  function deactivateScrolling(e) {
    if (e.keyCode === 27 || e.keyCode === 13) {
      prepare_window();
      preventDefault(e);
      return false;
    } else {
      if (e.keyCode === 40 || e.keyCode === 38) {
        $page_current.scrollTop = $page_current.scrollTop + 20 * (e.keyCode === 40 ? 1 : -1);
        preventDefault(e);
        return false;
      }
    }
    return true;
  }
  /**
   * @param {!Object} event
   * @return {undefined}
   */
  function load(event) {
    var charcode = event.charCode || event.keyCode;
    /** @type {string} */
    var ch = String.fromCharCode(charcode);
    if (ch === "k" || ch === "j") {
      $page_current.scrollTop = $page_current.scrollTop + 20 * (ch === "j" ? 1 : -1);
    }
  }
  /**
   * @return {undefined}
   */
  function done() {
    /** @type {number} */
    $page_current.scrollTop = 0;
    /** @type {string} */
    $page_current.style.display = "block";
    reduce();
    /** @type {string} */
    $("#shadowOverlay")[0].style.visibility = "visible";
    add();
    /** @type {string} */
    $page_current.style.display = "block";
    window.addEventListener("keydown", deactivateScrolling, false);
    window.addEventListener("keypress", load, false);
  }
  /**
   * @return {undefined}
   */
  function prepare_window() {
    /** @type {string} */
    $page_current.style.display = "none";
    appendChild();
    /** @type {string} */
    $("#shadowOverlay")[0].style.visibility = "hidden";
    window.removeEventListener("keydown", deactivateScrolling, false);
    window.removeEventListener("keypress", load, false);
  }
  /**
   * @return {undefined}
   */
  function success() {
    getData();
    self.bind("#game-menu-sound", "click", interval);
    self.bind("#game-menu-volume", "click", move);
    self.bind(".game-menu-exit", "click", setup);
    self.bind(".game-menu-keyboard", "click", search);
    self.bind(".game-menu-buy", "click", click);
    self.bind("#restart-game", "click", p);
    self.bind("#save-game", "click", shrinkBreadCrumb);
    self.bind("#restore-game", "click", logPutRequest);
    self.bind("#restore-level3", "click", lastKeyAndCheck);
    self.bind("#load-level", "click", cb);
    self.bind("#list-games", "click", buildRoute);
    self.bind("#delete-game", "click", doAction);
    self.bind("#user-login", "click", action);
    self.bind("#user-logout", "click", action);
    self.bind("#user-stats", "click", init);
    self.bind("#level-breakdown", "click", callback);
    self.bind("#leaderboard", "click", post);
    self.bind("#display-ingame-stats", "click", play);
    self.bind("#hide-ingame-stats", "click", hide);
    self.bind("#help", "click", showHelp);
    self.bind("#topic-help", "click", updateRegionDisplay);
    self.bind("#terms-and-conditions", "click", go);
    self.bind("#copyright-and-credits", "click", done);
    self.bind("#privacy-policy", "click", clickKiller);
    self.bind("#cookie-usage", "click", main);
    self.bind(".terms-link", "click", go);
    self.bind(".privacy-link", "click", clickKiller);
    self.bind(".timed-terms-link", "click", go);
    self.bind(".timed-privacy-link", "click", clickKiller);
    self.bind("#accept-terms", "click", t);
    self.bind("#confirm-new-terms-button", "click", handler);
    _fixCKEDITORBug();
    elementLibrary();
    test();
    self.bind(s, "click", checkloaded);
    self.bind("#personal-license", "click", walletRecord);
    self.bind("#friend-license", "click", hostAttemptCb);
    self.bind("#timed-license", "click", BP_BREAKONCHILDCHANGE);
    self.bind("#group-license", "click", BP_BREAKONATTRCHANGE);
    self.bind("#another-timed-license", "click", analyseFiles);
    self.bind("#convert-to-personal-license", "click", pushNewElement);
  }
  /**
   * @return {undefined}
   */
  function analyseFiles() {
    vim.emailaddr = vim.expiredEmail;
    parse(false, true);
    vim.emailaddr = undefined;
  }
  /**
   * @return {undefined}
   */
  function pushNewElement() {
    vim.emailaddr = vim.expiredEmail;
    parse(false);
    vim.emailaddr = undefined;
  }
  /**
   * @return {undefined}
   */
  function BP_BREAKONATTRCHANGE() {
    /** @type {string} */
    var bF = "contact@vim-adventures.com";
    /** @type {string} */
    var bG = "Further details regarding group license";
    /** @type {string} */
    var inPropName = "[ Please describe the context you wish to use VIM Adventures in, and how many licenses you require ]";
    window.open("mailto:" + bF + "?subject=" + bG + "&body=" + inPropName);
  }
  /**
   * @return {undefined}
   */
  function onInterval() {
    obj.innerHTML = e + (sign ? "<span id='colon-dialog-cursor'>|</span>" : "");
    /** @type {boolean} */
    sign = !sign;
  }
  /**
   * @return {?}
   */
  function paddingTop() {
    return obj.offsetTop;
  }
  /**
   * @return {?}
   */
  function targetOfElement() {
    return e;
  }
  /**
   * @param {string} item
   * @return {undefined}
   */
  function update(item) {
    var values;
    var ki$13;
    var top;
    if (workingAnimation !== -1) {
      window.clearInterval(workingAnimation);
      /** @type {number} */
      workingAnimation = -1;
      /** @type {boolean} */
      sign = true;
    }
    if (item.indexOf(":login ") === 0) {
      values = item.split(" ");
      if (values.length > 2) {
        /** @type {string} */
        top = "";
        /** @type {number} */
        ki$13 = 0;
        for (; ki$13 < values[2].length; ++ki$13) {
          /** @type {string} */
          top = top + "&bull;";
        }
        /** @type {string} */
        values[2] = top;
      }
      item = values.join(" ");
    }
    /** @type {string} */
    e = item;
    /** @type {string} */
    obj.innerHTML = item;
    /** @type {string} */
    obj.style.visibility = item === "" ? "hidden" : "visible";
    if (item === "") {
      self.removeClass("#game-menu", "nohover");
    } else {
      self.addClass("#game-menu", "nohover");
    }
    if (vim.input.isInColonInputMode()) {
      workingAnimation = window.setInterval(onInterval, 400);
    }
  }
  /**
   * @param {string} url
   * @param {string} type
   * @return {?}
   */
  function getQuery(url, type) {
    var componentsStr = url.substring(url.indexOf("?") + 1);
    var row = componentsStr.split("&");
    /** @type {number} */
    var CR_index = 0;
    for (; CR_index < row.length; CR_index++) {
      var matches = row[CR_index].split("=");
      if (matches[0] == type) {
        return decodeURIComponent(matches[1]);
      }
    }
    return "";
  }
  /**
   * @return {undefined}
   */
  function initUI() {
    window.setInterval(function() {
      /** @type {!NodeList<Element>} */
      var e = document.getElementsByClassName("vimiumReset");
      if (e.length && e[0].style.display !== "none") {
        Game.showMessage("Vimium is capturing some of this page's keystrokes.<BR>Please add this page to Vimium's excluded URLs list.");
      }
    }, 2000);
  }
  /**
   * @return {undefined}
   */
  function create() {
    self.bind(window, "beforeunload", function(instance) {
      if (vim.login.isUserLoggedIn() && vim.expirationTime && !isNaN(vim.expirationTime)) {
        /** @type {string} */
        var config = "If you leave this page without logging out properly, the timer will continue to count down on the server leading to license expiration.\nPlease properly log out first.";
        /** @type {string} */
        instance.returnValue = config;
        return config;
      }
    });
  }
  /**
   * @return {undefined}
   */
  function run() {
    if (Modernizr.canvas && Modernizr.canvastext) {
      if (br) {
        /** @type {boolean} */
        slug = true;
        audio.initialize();
        Game.init();
        vim.input.disableKeys();
        success();
        initUI();
        create();
        vim.login.revalidateLogin();
        vim.login.scheduleLoginRevalidation();
        /** @type {boolean} */
        br = false;
      }
    } else {
      /** @type {string} */
      vim.dom.$("#no-canvas")[0].style.display = "block";
      /** @type {boolean} */
      slug = false;
      if (br) {
        success();
        /** @type {boolean} */
        br = false;
      }
    }
    if (document.referrer.indexOf("resetPassword.php") !== -1) {
      find();
      vim.login.choosePassword(getQuery(document.referrer, "email"));
    } else {
      if (document.referrer.toLowerCase().indexOf("activatelicense.php") !== -1 && getQuery(document.location.search, "email") !== "") {
        find();
        /** @type {boolean} */
        vim.newAccount = true;
        vim.login.choosePassword(getQuery(document.location.search, "email"));
      } else {
        if (document.referrer.toLowerCase().indexOf("activatelicense.php") !== -1 && getQuery(document.location.search, "login") !== "") {
          find();
          vim.login.askForLoginInfo(getQuery(document.location.search, "login"));
        } else {
          if (getQuery(document.location.search, "email") !== "" && (getQuery(document.location.search, "gift") !== "" || getQuery(document.location.search, "personal") !== "" || getQuery(document.location.search, "timed") !== "")) {
            find();
            vim.login.choosePassword(getQuery(document.location.search, "email"));
          } else {
            if (getQuery(document.location.search, "login") !== "" && (getQuery(document.location.search, "personal") !== "" || getQuery(document.location.search, "timed") !== "")) {
              find();
              vim.login.askForLoginInfo(getQuery(document.location.search, "login"));
            } else {
              if (slug) {
                setup();
              }
            }
          }
        }
      }
    }
    window.scroll(0, 0);
  }
  /**
   * @return {undefined}
   */
  function reduce() {
    vim.input.disableKeys();
  }
  /**
   * @return {undefined}
   */
  function appendChild() {
    if (!vim.free_game_ended || vim.licensedUser === true) {
      vim.input.enableKeys();
    }
  }
  /**
   * @return {undefined}
   */
  function add() {
    self.removeClass(element, "shown");
    /** @type {boolean} */
    a = false;
  }
  /**
   * @param {string} item
   * @return {undefined}
   */
  function show(item) {
    var htmlLink;
    var bE;
    /** @type {string} */
    file = item;
    /** @type {boolean} */
    a = true;
    /** @type {number} */
    height = 0;
    if (typeof path.getNumberOfExampleSteps(item) === "undefined") {
      return;
    }
    if (vim.model.getCursorX() - vim.model.getTopX() > 18) {
      /** @type {string} */
      element.style.left = "50px";
      /** @type {string} */
      element.style.right = "auto";
    } else {
      /** @type {string} */
      element.style.right = "50px";
      /** @type {string} */
      element.style.left = "auto";
    }
    htmlLink = path.getExtendedDescHTML(item);
    element.innerHTML = htmlLink;
    self.addClass(element, "shown");
  }
  /**
   * @return {?}
   */
  function ab() {
    return a;
  }
  /**
   * @return {?}
   */
  function correctSlug() {
    return slug;
  }
  /**
   * @param {number} width
   * @return {undefined}
   */
  function savedialog(width) {
    var bG;
    var bF;
    var part = path.getNumberOfExampleSteps(file || "");
    if (!file || !part) {
      return;
    }
    if (width < 0 && height > 0 || width > 0 && height < part - 1) {
      height = height + width;
    }
    element.innerHTML = path.getExtendedDescHTML(file, height);
  }
  /**
   * @param {!Event} event
   * @return {undefined}
   */
  function $__jsx_onload(event) {
    if (event.keyCode === 27 || event.keyCode === 13) {
      getSpaceWidth();
    }
  }
  /**
   * @param {!Object} event
   * @return {undefined}
   */
  function handle(event) {
    /** @type {string} */
    var bE = String.fromCharCode(event.charCode || event.keyCode);
    if (bE === " ") {
      getSpaceWidth();
    }
  }
  /**
   * @return {undefined}
   */
  function getSpaceWidth() {
    /** @type {string} */
    $("#double-login-dialog-overlay")[0].style.display = "none";
    /** @type {string} */
    $("#shadowOverlay")[0].style.visibility = "hidden";
    window.removeEventListener("keypress", handle, false);
    window.removeEventListener("keydown", $__jsx_onload, false);
    appendChild();
  }
  /**
   * @return {undefined}
   */
  function fn() {
    clear();
    f();
    find();
    set();
    next();
    vim.input.disableKeys();
    /** @type {string} */
    $("#shadowOverlay")[0].style.visibility = "visible";
    add();
    window.addEventListener("keypress", handle, false);
    window.addEventListener("keydown", $__jsx_onload, false);
    /** @type {string} */
    $("#double-login-dialog-overlay")[0].style.display = "block";
  }
  /**
   * @return {undefined}
   */
  function moveFileFn() {
    /** @type {string} */
    $("#game-screen #game-menu")[0].style.display = "block";
  }
  /**
   * @return {undefined}
   */
  function updateGameInfoTable() {
    /** @type {string} */
    $("#game-screen #game-menu")[0].style.display = "none";
  }
  /**
   * @param {?} name
   * @param {string} category
   * @return {?}
   */
  function t(name, category) {
    t.closingMsg = category || "";
    /** @type {string} */
    importFileButton.style.display = "block";
    reduce();
    /** @type {string} */
    $("#shadowOverlay")[0].style.visibility = "visible";
    add();
    update("");
    /** @type {string} */
    importFileButton.style.display = "block";
    return false;
  }
  /**
   * @return {undefined}
   */
  function P() {
    /** @type {string} */
    $("#new-terms-message")[0].style.display = "none";
    /** @type {string} */
    $("#confirm-new-terms-button")[0].style.display = "block";
    /** @type {string} */
    importFileButton.style.display = "none";
    appendChild();
    /** @type {string} */
    $("#shadowOverlay")[0].style.visibility = "hidden";
    update(t.closingMsg);
    test();
  }
  /**
   * @return {undefined}
   */
  function handler() {
    var expires = (vim.emailaddr || "").trim();
    audio.play("menu_click");
    /** @type {string} */
    dzone.style.display = "none";
    if (expires === "") {
      log("Email address can't be empty. Please login first.", "error");
    } else {
      if (expires.indexOf("@") === -1) {
        log("Email address missing @ sign. Please login.", "error");
      } else {
        if (expires.indexOf(".", expires.indexOf("@")) === -1) {
          log("Email address appears to be invalid. Please login again.", "error");
        } else {
          vim.fetcher.getUrl("php/acceptTerms.php", request, complete, expires, (vim.password || "").trim(), undefined, function() {
            log("Updating server information...", "processing");
          }, undefined);
        }
      }
    }
  }
  /**
   * @return {undefined}
   */
  function error() {
    /** @type {string} */
    status.style.display = "none";
    /** @type {string} */
    dzone.style.display = "block";
  }
  /**
   * @param {string} message
   * @param {string} state
   * @return {undefined}
   */
  function log(message, state) {
    /** @type {string} */
    dzone.style.display = "none";
    /** @type {string} */
    status.innerHTML = message;
    /** @type {string} */
    status.style.display = "block";
    /** @type {string} */
    status.className = state;
    if (state !== "processing") {
      window.setTimeout(error, 3000);
    }
  }
  /**
   * @param {?} numberOfItems
   * @return {undefined}
   */
  function request(numberOfItems) {
    /** @type {boolean} */
    vim.terms = true;
    log("Terms of Use and Privacy Policy accepted.", "ok");
    window.setTimeout(function() {
      error();
      P();
    }, 3000);
  }
  /**
   * @param {!Object} res
   * @return {undefined}
   */
  function complete(res) {
    log("Error: " + res.responseText, "error");
  }
  /**
   * @param {!Object} e
   * @return {?}
   */
  function go(e) {
    window.open("terms", "_blank");
    preventDefault(e);
    return false;
  }
  /**
   * @param {!Object} ev
   * @return {?}
   */
  function clickKiller(ev) {
    window.open("privacy", "_blank");
    preventDefault(ev);
    return false;
  }
  /**
   * @param {!Object} event
   * @return {?}
   */
  function main(event) {
    window.open("cookies", "_blank");
    preventDefault(event);
    return false;
  }
  /**
   * @return {?}
   */
  function normalizeYouTubeIframe() {
    return document.location.hostname === "localhost" ? "http://localhost/" : "https://eudb.vim-adventures.com/";
  }
  /**
   * @param {!Object} e
   * @return {?}
   */
  function callback(e) {
    window.open(normalizeYouTubeIframe() + "breakdown?email=" + encodeURIComponent(vim.emailaddr) + "&token=" + encodeURIComponent(vim.token) + (document.location.hostname.includes("beta") ? "&beta=true" : ""), "_blank");
    preventDefault(e);
    return false;
  }
  /**
   * @param {!Object} e
   * @return {?}
   */
  function post(e) {
    /** @type {!Element} */
    var form = document.createElement("form");
    /** @type {string} */
    form.method = "POST";
    /** @type {string} */
    form.action = normalizeYouTubeIframe() + "php/leaderboard.php";
    /** @type {string} */
    form.target = "_blank";
    /** @type {string} */
    form.innerHTML = '<INPUT name="email" value="' + vim.emailaddr + '" hidden /><INPUT name="token" value="' + vim.token + '" hidden />';
    document.body.appendChild(form);
    form.submit();
    preventDefault(e);
    return false;
  }
  /**
   * @param {number} iRight
   * @return {?}
   */
  function redraw(iRight) {
    if (!redraw.bugElem) {
      /** @type {(Element|null)} */
      redraw.bugElem = document.getElementById("ending_pic_bug");
    }
    return function() {
      /** @type {string} */
      redraw.bugElem.style.left = iRight + "px";
      if (redraw.bugElem.style.visibility !== "visible") {
        /** @type {string} */
        redraw.bugElem.style.visibility = "visible";
      }
    };
  }
  /**
   * @return {undefined}
   */
  function animate() {
    vim.input.disableKeys();
    add();
    /** @type {string} */
    $("#ending-dialog")[0].style.display = "block";
    setPosition("ending1", "THANKS LIN                ", 12, 1);
    by("ending1", "THANKS LIN                ", 3, 12);
    setPosition("ending1", "SHADOWY ONE, YOU'RE", undefined, 14, "THANKS ");
    setPosition("ending2", "THE HERO OF HYRU     ", 16, 33);
    by("ending2", "THE HERO OF HYRU     ", 4, 50);
    setPosition("ending2", "TEXTLAND.", undefined, 55, "THE HERO OF ");
    window.setTimeout(function() {
      document.getElementById("ending_pic_princess").classList.add("css3-flip");
    }, 71 * scale);
    setPosition("ending3", "FINALLY,", undefined, 94);
    setPosition("ending4", "PEACH RETURN              ", 12, 108);
    by("ending4", "PEACH RETURN              ", 8, 121);
    setPosition("ending4", "E RETURNS TO TEXTLAND.", undefined, 130, "PEAC");
    setPosition("ending5", "THIS ENDS THE STORY.", undefined, 156);
    by("ending5", "THIS ENDS THE STORY.", undefined, 180);
    setPosition("ending5", "THIS ENDS VIM-ADVENTURES.", undefined, 200);
    extend(":%s/ENDS/ENDS PART 1 OF/g", 235);
    window.setTimeout(function() {
      /** @type {(Element|null)} */
      var btnElem = document.getElementById("ending5");
      vim.screens["game-screen"].setColonCommand("");
      /** @type {string} */
      btnElem.innerHTML = "THIS ENDS PART 1 OF VIM-ADVENTURES.";
      btnElem.classList.add("css3-glow");
      window.setTimeout(function() {
        btnElem.classList.remove("css3-glow");
      }, 2 * scale);
    }, 270 * scale);
    /** @type {number} */
    var tileHeight = 80;
    /** @type {number} */
    var curZoom = Math.floor(window.innerWidth / 2 / tileHeight);
    /** @type {number} */
    var resizedTileHeight = 0;
    /** @type {number} */
    resizedTileHeight = 0;
    for (; resizedTileHeight < tileHeight; ++resizedTileHeight) {
      window.setTimeout(redraw(-330 - (tileHeight - 1 - resizedTileHeight) * curZoom), 278 * scale + resizedTileHeight * scale / 2);
    }
    window.setTimeout(function() {
      /** @type {string} */
      document.getElementById("what_happened_bubble").style.visibility = "visible";
    }, 321 * scale);
    window.setTimeout(function() {
      /** @type {string} */
      document.getElementById("what_happened_bubble").style.visibility = "hidden";
    }, 408 * scale);
    extend(":q!", 458);
    window.setTimeout(function() {
      vim.screens["game-screen"].setColonCommand("");
      /** @type {string} */
      $("#ending-dialog")[0].style.display = "none";
      /** @type {string} */
      $("#game")[0].style.display = "none";
    }, 473 * scale);
  }
  /**
   * @param {string} type
   * @return {?}
   */
  function expect(type) {
    return function() {
      vim.screens["game-screen"].setColonCommand(type);
    };
  }
  /**
   * @param {string} b
   * @param {number} offset
   * @return {undefined}
   */
  function extend(b, offset) {
    var i;
    /** @type {number} */
    i = 1;
    for (; i <= b.length; ++i) {
      window.setTimeout(expect(b.substr(0, i)), (i + offset) * scale);
    }
  }
  /**
   * @param {!Element} el
   * @param {?} lang
   * @param {!NodeList} args
   * @param {string} fn
   * @return {?}
   */
  function bind(el, lang, args, fn) {
    /** @type {string} */
    var suffix = "";
    var arg_count = args.length;
    for (; arg_count--;) {
      /** @type {string} */
      suffix = suffix + "&nbsp;";
    }
    return function() {
      el.innerHTML = (fn || "") + lang + suffix;
    };
  }
  /**
   * @param {string} id
   * @param {string} node
   * @param {!Object} position
   * @param {number} y
   * @param {string} d
   * @return {undefined}
   */
  function setPosition(id, node, position, y, d) {
    /** @type {(Element|null)} */
    var load = document.getElementById(id);
    var x;
    /** @type {number} */
    x = 1;
    for (; x <= (position !== undefined ? position : node.length); ++x) {
      window.setTimeout(bind(load, node.substr(0, x), node.substr(x), d), (x + y) * scale);
    }
  }
  /**
   * @param {string} name
   * @param {string} str
   * @param {!Object} length
   * @param {number} interval
   * @param {string} callback
   * @return {undefined}
   */
  function by(name, str, length, interval, callback) {
    /** @type {(Element|null)} */
    var load = document.getElementById(name);
    /** @type {number} */
    var len = str.trim().length - 1;
    var i;
    /** @type {number} */
    i = 0;
    for (; i < (length !== undefined ? length : str.length); ++i) {
      window.setTimeout(bind(load, str.substr(0, len - i), str.substr(len - i), callback), (i + interval) * scale);
    }
  }
  /**
   * @param {!Event} event
   * @return {undefined}
   */
  function release(event) {
    if (event.keyCode === 27 || event.keyCode === 13) {
      close();
    }
  }
  /**
   * @param {!Object} event
   * @return {undefined}
   */
  function handleKeyDown(event) {
    /** @type {string} */
    var bE = String.fromCharCode(event.charCode || event.keyCode);
    if (bE === " ") {
      close();
    }
  }
  /**
   * @return {undefined}
   */
  function close() {
    /** @type {string} */
    $("#license-expired-dialog-overlay")[0].style.display = "none";
    /** @type {string} */
    $("#expired-user-email")[0].innerHTML = "Unlicensed user";
    /** @type {string} */
    $("#activated-on")[0].innerHTML = "";
    /** @type {string} */
    $("#shadowOverlay")[0].style.visibility = "hidden";
    window.removeEventListener("keypress", handleKeyDown, false);
    window.removeEventListener("keydown", release, false);
    appendChild();
  }
  /**
   * @return {undefined}
   */
  function submit() {
    clear();
    f();
    find();
    set();
    next();
    vim.input.disableKeys();
    /** @type {string} */
    $("#shadowOverlay")[0].style.visibility = "visible";
    add();
    update("");
    window.addEventListener("keypress", handleKeyDown, false);
    window.addEventListener("keydown", release, false);
    /** @type {string} */
    $("#license-expired-dialog-overlay")[0].style.display = "block";
  }
  var self = vim.dom;
  var $ = self.$;
  var game = vim.game;
  var audio = vim.audio;
  /** @type {boolean} */
  var br = true;
  /** @type {boolean} */
  var bh = false;
  var event = audio.getVolume();
  var comCursor = $("#to-be-continued")[0];
  var s = $("#more-information a")[0];
  var obj = $("#colon-command")[0];
  /** @type {number} */
  var workingAnimation = -1;
  /** @type {boolean} */
  var sign = true;
  /** @type {string} */
  var e = "";
  /** @type {string} */
  var group = "standard";
  /** @type {!Array} */
  var LIST = ["~`!1@2#3$4%5^6&7*8(9)0_-+=", "QqWwEeRrTtYyUuIiOoPp{[}]|\\", "AaSsDdFfGgHhJjKkLl:;\"'", "ZzXxCcVvBbNnMm<,>.?/"];
  /** @type {!Array} */
  var look_west = ["~`!1@2#3$4%5^6&7*8(9)0{[}]", "\"'<,>.PpYyFfGgCcRrLl?/+=|\\", "AaOoEeUuIiDdHhTtNnSs_-", ":;QqJjKkXxBbMmWwVvZz"];
  /** @type {!Array} */
  var command = LIST;
  var w;
  var W;
  var slug;
  var $page_current = $("#credits")[0];
  var importFileButton = $("#new-terms")[0];
  var winHints = $("#register-screen")[0];
  var boxChild = $("#instructions")[0];
  var path = vim.validKeys;
  var element = $("#button-desc")[0];
  var file;
  /** @type {boolean} */
  var a = false;
  /** @type {!Array} */
  var cssFillUpStopper = ["~`!1@2#3$4%5^6&7*8(9)0_-+=", "QqWwFfPpGgJjLlUuYy:;{[}]|\\", "AaRrSsTtDdHhNnEeIiOo\"'", "ZzXxCcVvBbKkMm<,>.?/"];
  var tempResetButton = $("#stats")[0];
  var height;
  /** @type {number} */
  var scale = 150;
  var dzone = $("#confirm-new-terms-button")[0];
  var status = $("#new-terms-message")[0];
  return {
    run : run,
    toBeContinuedFadeIn : result,
    hideToBeContinuedMessage : refreshNextPrevLinks,
    confirmArrowKeys : addPassMaskFn,
    setColonCommand : update,
    getColonCommand : targetOfElement,
    getColonMessageTopYOffset : paddingTop,
    adjustUserMenu : _fixCKEDITORBug,
    adjustStatsMenu : elementLibrary,
    adjustTermsMenu : test,
    showKeyDescription : get,
    switchLayoutStyle : recursion,
    displayKeyboard : search,
    disableKeys : reduce,
    enableKeys : appendChild,
    showTitle : setup,
    showCommandHelp : show,
    hideCommandHelp : add,
    traverseHelpCommandExample : savedialog,
    isCommandHelpOn : ab,
    isTitleScreenOn : correctSlug,
    showHelp : showHelp,
    showStats : init,
    doubleLogin : fn,
    licenseExpired : submit,
    showGameMenu : moveFileFn,
    hideGameMenu : updateGameInfoTable,
    showBuyLicense : click,
    openCreditsDialog : done,
    openTermsDialog : go,
    openPrivacyDialog : clickKiller,
    openCookiesDialog : main,
    openNewTermsDialog : t,
    runEnding : animate
  };
}();
window.cookieconsent_options = {
  message : "This website uses cookies to ensure you get the best experience on our website",
  dismiss : "Got it!",
  learnMore : "More info",
  link : "cookies",
  theme : "dark-floating",
  target : "_blank"
};
(function() {
  if (window.hasCookieConsent) {
    return;
  }
  /** @type {boolean} */
  window.hasCookieConsent = true;
  /** @type {string} */
  var id = "cookieconsent_options";
  /** @type {string} */
  var i = "update_cookieconsent_options";
  /** @type {string} */
  var value = "cookieconsent_dismissed";
  /** @type {string} */
  var h = "//cdnjs.cloudflare.com/ajax/libs/cookieconsent2/1.0.10/";
  if (document.cookie.indexOf(value) > -1 || window.navigator && window.navigator.CookiesOK) {
    return;
  }
  if (typeof String.prototype.trim !== "function") {
    /**
     * @return {string}
     * @this {!String}
     */
    String.prototype.trim = function() {
      return this.replace(/^\s+|\s+$/g, "");
    };
  }
  var util = {
    isArray : function(msg) {
      /** @type {string} */
      var and__16097__auto____$1 = Object.prototype.toString.call(msg);
      return and__16097__auto____$1 == "[object Array]";
    },
    isObject : function(it) {
      return Object.prototype.toString.call(it) == "[object Object]";
    },
    each : function(object, callback, context, reverse) {
      if (util.isObject(object) && !reverse) {
        var i;
        for (i in object) {
          if (object.hasOwnProperty(i)) {
            callback.call(context, object[i], i, object);
          }
        }
      } else {
        /** @type {number} */
        var i = 0;
        var length = object.length;
        for (; i < length; i++) {
          callback.call(context, object[i], i, object);
        }
      }
    },
    merge : function(object, func) {
      if (!object) {
        return;
      }
      util.each(func, function(value, key) {
        if (util.isObject(value) && util.isObject(object[key])) {
          util.merge(object[key], value);
        } else {
          /** @type {!Object} */
          object[key] = value;
        }
      });
    },
    bind : function(item, type) {
      return function() {
        return item.apply(type, arguments);
      };
    },
    queryObject : function(prop, e) {
      var i;
      /** @type {number} */
      var d = 0;
      /** @type {boolean} */
      var ret = prop;
      e = e.split(".");
      for (; (i = e[d++]) && ret.hasOwnProperty(i) && (ret = ret[i]);) {
        if (d === e.length) {
          return ret;
        }
      }
      return null;
    },
    setCookie : function(name, str, value, domain, url) {
      value = value || 365;
      /** @type {!Date} */
      var d = new Date;
      d.setDate(d.getDate() + value);
      /** @type {!Array} */
      var cookie = [name + "=" + str, "expires=" + d.toUTCString(), "path=" + url || "/"];
      if (domain) {
        cookie.push("domain=" + domain);
      }
      /** @type {string} */
      document.cookie = cookie.join(";");
    },
    addEventListener : function(el, listener, callback) {
      if (el.addEventListener) {
        el.addEventListener(listener, callback);
      } else {
        el.attachEvent("on" + listener, callback);
      }
    }
  };
  var container = function() {
    /** @type {string} */
    var script = "data-cc-event";
    /** @type {string} */
    var schedule = "data-cc-if";
    /**
     * @param {!Object} o
     * @param {string} v
     * @param {string} f
     * @return {?}
     */
    var add = function(o, v, f) {
      if (util.isArray(v)) {
        return util.each(v, function(where) {
          add(o, where, f);
        });
      }
      if (o.addEventListener) {
        o.addEventListener(v, f);
      } else {
        o.attachEvent("on" + v, f);
      }
    };
    /**
     * @param {string} type
     * @param {boolean} data
     * @return {?}
     */
    var get = function(type, data) {
      return type.replace(/\{\{(.*?)\}\}/g, function(canCreateDiscussions, clusterShardData) {
        var _sizeAnimateTimeStamps = clusterShardData.split("||");
        var resultsPromise;
        var options;
        for (; options = _sizeAnimateTimeStamps.shift();) {
          options = options.trim();
          if (options[0] === '"') {
            return options.slice(1, options.length - 1);
          }
          resultsPromise = util.queryObject(data, options);
          if (resultsPromise) {
            return resultsPromise;
          }
        }
        return "";
      });
    };
    /**
     * @param {string} value
     * @return {?}
     */
    var m = function(value) {
      /** @type {!Element} */
      var settings = document.createElement("div");
      /** @type {string} */
      settings.innerHTML = value;
      return settings.children[0];
    };
    /**
     * @param {!Node} X
     * @param {string} name
     * @param {!Function} callback
     * @return {undefined}
     */
    var parse = function(X, name, callback) {
      var r = X.parentNode.querySelectorAll("[" + name + "]");
      util.each(r, function(w) {
        var m = w.getAttribute(name);
        callback(w, m);
      }, window, true);
    };
    /**
     * @param {!Node} data
     * @param {boolean} callback
     * @return {undefined}
     */
    var extractPresetLocal = function(data, callback) {
      parse(data, script, function(Validatable, clusterShardData) {
        var obj = clusterShardData.split(":");
        var i = util.queryObject(callback, obj[1]);
        add(Validatable, obj[0], util.bind(i, callback));
      });
    };
    /**
     * @param {!Node} data
     * @param {boolean} set
     * @return {undefined}
     */
    var setHtmlLocation = function(data, set) {
      parse(data, schedule, function(gapiEl, response) {
        var tmp = util.queryObject(set, response);
        if (!tmp) {
          gapiEl.parentNode.removeChild(gapiEl);
        }
      });
    };
    return {
      build : function(template, data) {
        if (util.isArray(template)) {
          template = template.join("");
        }
        template = get(template, data);
        var message = m(template);
        extractPresetLocal(message, data);
        setHtmlLocation(message, data);
        return message;
      }
    };
  }();
  var module = {
    options : {
      message : "This website uses cookies to ensure you get the best experience on our website. ",
      dismiss : "Got it!",
      learnMore : "More info",
      link : null,
      target : "_self",
      container : null,
      theme : "light-floating",
      domain : null,
      path : "/",
      expiryDays : 365,
      markup : ['<div class="cc_banner-wrapper {{containerClasses}}">', '<div class="cc_banner cc_container cc_container--open">', '<a href="#null" data-cc-event="click:dismiss" target="_blank" class="cc_btn cc_btn_accept_all">{{options.dismiss}}</a>', '<p class="cc_message">{{options.message}} <a data-cc-if="options.link" target="{{ options.target }}" class="cc_more_info" href="{{options.link || "#null"}}">{{options.learnMore}}</a></p>', "</div>", "</div>"]
    },
    init : function() {
      var options = window[id];
      if (options) {
        this.setOptions(options);
      }
      this.setContainer();
      if (this.options.theme) {
        this.loadTheme(this.render);
      } else {
        this.render();
      }
    },
    setOptionsOnTheFly : function(thisObject) {
      this.setOptions(thisObject);
      this.render();
    },
    setOptions : function(obj) {
      util.merge(this.options, obj);
    },
    setContainer : function() {
      if (this.options.container) {
        /** @type {(Element|null)} */
        this.container = document.querySelector(this.options.container);
      } else {
        /** @type {!HTMLBodyElement} */
        this.container = document.body;
      }
      /** @type {string} */
      this.containerClasses = "";
      if (navigator.appVersion.indexOf("MSIE 8") > -1) {
        this.containerClasses += " cc_ie8";
      }
    },
    loadTheme : function(callback) {
      callback.call(this);
    },
    render : function() {
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
        delete this.element;
      }
      this.element = container.build(this.options.markup, this);
      if (!this.container.firstChild) {
        this.container.appendChild(this.element);
      } else {
        this.container.insertBefore(this.element, this.container.firstChild);
      }
    },
    dismiss : function(event) {
      if (event.preventDefault) {
        event.preventDefault();
      }
      /** @type {boolean} */
      event.returnValue = false;
      this.setDismissedCookie();
      this.container.removeChild(this.element);
    },
    setDismissedCookie : function() {
      util.setCookie(value, "yes", this.options.expiryDays, this.options.domain, this.options.path);
    }
  };
  var callback;
  /** @type {boolean} */
  var isSamePage = false;
  (callback = function() {
    if (!isSamePage && document.readyState == "complete") {
      module.init();
      /** @type {boolean} */
      isSamePage = true;
      window[i] = util.bind(module.setOptionsOnTheFly, module);
    }
  })();
  util.addEventListener(document, "readystatechange", callback);
})();
