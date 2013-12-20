define("m/zepto", [], function() {
    (function(a) {
        String.prototype.trim === a && (String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, "");
        }), Array.prototype.reduce === a && (Array.prototype.reduce = function(b) {
            if (this === void 0 || this === null) throw new TypeError();
            var c = Object(this), d = c.length >>> 0, e = 0, f;
            if (typeof b != "function") throw new TypeError();
            if (d == 0 && arguments.length == 1) throw new TypeError();
            if (arguments.length >= 2) f = arguments[1]; else do {
                if (e in c) {
                    f = c[e++];
                    break;
                }
                if (++e >= d) throw new TypeError();
            } while (!0);
            while (e < d) e in c && (f = b.call(a, f, c[e], e, c)), e++;
            return f;
        });
    })();
    var Zepto = function() {
        function E(a) {
            return a == null ? String(a) : y[z.call(a)] || "object";
        }
        function F(a) {
            return E(a) == "function";
        }
        function G(a) {
            return a != null && a == a.window;
        }
        function H(a) {
            return a != null && a.nodeType == a.DOCUMENT_NODE;
        }
        function I(a) {
            return E(a) == "object";
        }
        function J(a) {
            return I(a) && !G(a) && a.__proto__ == Object.prototype;
        }
        function K(a) {
            return a instanceof Array;
        }
        function L(a) {
            return typeof a.length == "number";
        }
        function M(a) {
            return g.call(a, function(a) {
                return a != null;
            });
        }
        function N(a) {
            return a.length > 0 ? c.fn.concat.apply([], a) : a;
        }
        function O(a) {
            return a.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase();
        }
        function P(a) {
            return a in j ? j[a] : j[a] = new RegExp("(^|\\s)" + a + "(\\s|$)");
        }
        function Q(a, b) {
            return typeof b == "number" && !l[O(a)] ? b + "px" : b;
        }
        function R(a) {
            var b, c;
            return i[a] || (b = h.createElement(a), h.body.appendChild(b), c = k(b, "").getPropertyValue("display"), 
            b.parentNode.removeChild(b), c == "none" && (c = "block"), i[a] = c), i[a];
        }
        function S(a) {
            return "children" in a ? f.call(a.children) : c.map(a.childNodes, function(a) {
                if (a.nodeType == 1) return a;
            });
        }
        function T(c, d, e) {
            for (b in d) e && (J(d[b]) || K(d[b])) ? (J(d[b]) && !J(c[b]) && (c[b] = {}), K(d[b]) && !K(c[b]) && (c[b] = []), 
            T(c[b], d[b], e)) : d[b] !== a && (c[b] = d[b]);
        }
        function U(b, d) {
            return d === a ? c(b) : c(b).filter(d);
        }
        function V(a, b, c, d) {
            return F(b) ? b.call(a, c, d) : b;
        }
        function W(a, b, c) {
            c == null ? a.removeAttribute(b) : a.setAttribute(b, c);
        }
        function X(b, c) {
            var d = b.className, e = d && d.baseVal !== a;
            if (c === a) return e ? d.baseVal : d;
            e ? d.baseVal = c : b.className = c;
        }
        function Y(a) {
            var b;
            try {
                return a ? a == "true" || (a == "false" ? !1 : a == "null" ? null : isNaN(b = Number(a)) ? /^[\[\{]/.test(a) ? c.parseJSON(a) : a : b) : a;
            } catch (d) {
                return a;
            }
        }
        function Z(a, b) {
            b(a);
            for (var c in a.childNodes) Z(a.childNodes[c], b);
        }
        var a, b, c, d, e = [], f = e.slice, g = e.filter, h = window.document, i = {}, j = {}, k = h.defaultView.getComputedStyle, l = {
            "column-count": 1,
            columns: 1,
            "font-weight": 1,
            "line-height": 1,
            opacity: 1,
            "z-index": 1,
            zoom: 1
        }, m = /^\s*<(\w+|!)[^>]*>/, n = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, o = /^(?:body|html)$/i, p = [ "val", "css", "html", "text", "data", "width", "height", "offset" ], q = [ "after", "prepend", "before", "append" ], r = h.createElement("table"), s = h.createElement("tr"), t = {
            tr: h.createElement("tbody"),
            tbody: r,
            thead: r,
            tfoot: r,
            td: s,
            th: s,
            "*": h.createElement("div")
        }, u = /complete|loaded|interactive/, v = /^\.([\w-]+)$/, w = /^#([\w-]*)$/, x = /^[\w-]+$/, y = {}, z = y.toString, A = {}, B, C, D = h.createElement("div");
        return A.matches = function(a, b) {
            if (!a || a.nodeType !== 1) return !1;
            var c = a.webkitMatchesSelector || a.mozMatchesSelector || a.oMatchesSelector || a.matchesSelector;
            if (c) return c.call(a, b);
            var d, e = a.parentNode, f = !e;
            return f && (e = D).appendChild(a), d = ~A.qsa(e, b).indexOf(a), f && D.removeChild(a), 
            d;
        }, B = function(a) {
            return a.replace(/-+(.)?/g, function(a, b) {
                return b ? b.toUpperCase() : "";
            });
        }, C = function(a) {
            return g.call(a, function(b, c) {
                return a.indexOf(b) == c;
            });
        }, A.fragment = function(b, d, e) {
            b.replace && (b = b.replace(n, "<$1></$2>")), d === a && (d = m.test(b) && RegExp.$1), 
            d in t || (d = "*");
            var g, h, i = t[d];
            return i.innerHTML = "" + b, h = c.each(f.call(i.childNodes), function() {
                i.removeChild(this);
            }), J(e) && (g = c(h), c.each(e, function(a, b) {
                p.indexOf(a) > -1 ? g[a](b) : g.attr(a, b);
            })), h;
        }, A.Z = function(a, b) {
            return a = a || [], a.__proto__ = c.fn, a.selector = b || "", a;
        }, A.isZ = function(a) {
            return a instanceof A.Z;
        }, A.init = function(b, d) {
            if (!b) return A.Z();
            if (F(b)) return c(h).ready(b);
            if (A.isZ(b)) return b;
            var e;
            if (K(b)) e = M(b); else if (I(b)) e = [ J(b) ? c.extend({}, b) : b ], b = null; else if (m.test(b)) e = A.fragment(b.trim(), RegExp.$1, d), 
            b = null; else {
                if (d !== a) return c(d).find(b);
                e = A.qsa(h, b);
            }
            return A.Z(e, b);
        }, c = function(a, b) {
            return A.init(a, b);
        }, c.extend = function(a) {
            var b, c = f.call(arguments, 1);
            return typeof a == "boolean" && (b = a, a = c.shift()), c.forEach(function(c) {
                T(a, c, b);
            }), a;
        }, A.qsa = function(a, b) {
            var c;
            return H(a) && w.test(b) ? (c = a.getElementById(RegExp.$1)) ? [ c ] : [] : a.nodeType !== 1 && a.nodeType !== 9 ? [] : f.call(v.test(b) ? a.getElementsByClassName(RegExp.$1) : x.test(b) ? a.getElementsByTagName(b) : a.querySelectorAll(b));
        }, c.contains = function(a, b) {
            return a !== b && a.contains(b);
        }, c.type = E, c.isFunction = F, c.isWindow = G, c.isArray = K, c.isPlainObject = J, 
        c.isEmptyObject = function(a) {
            var b;
            for (b in a) return !1;
            return !0;
        }, c.inArray = function(a, b, c) {
            return e.indexOf.call(b, a, c);
        }, c.camelCase = B, c.trim = function(a) {
            return a.trim();
        }, c.uuid = 0, c.support = {}, c.expr = {}, c.map = function(a, b) {
            var c, d = [], e, f;
            if (L(a)) for (e = 0; e < a.length; e++) c = b(a[e], e), c != null && d.push(c); else for (f in a) c = b(a[f], f), 
            c != null && d.push(c);
            return N(d);
        }, c.each = function(a, b) {
            var c, d;
            if (L(a)) {
                for (c = 0; c < a.length; c++) if (b.call(a[c], c, a[c]) === !1) return a;
            } else for (d in a) if (b.call(a[d], d, a[d]) === !1) return a;
            return a;
        }, c.grep = function(a, b) {
            return g.call(a, b);
        }, window.JSON && (c.parseJSON = JSON.parse), c.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(a, b) {
            y["[object " + b + "]"] = b.toLowerCase();
        }), c.fn = {
            forEach: e.forEach,
            reduce: e.reduce,
            push: e.push,
            sort: e.sort,
            indexOf: e.indexOf,
            concat: e.concat,
            map: function(a) {
                return c(c.map(this, function(b, c) {
                    return a.call(b, c, b);
                }));
            },
            slice: function() {
                return c(f.apply(this, arguments));
            },
            ready: function(a) {
                return u.test(h.readyState) ? a(c) : h.addEventListener("DOMContentLoaded", function() {
                    a(c);
                }, !1), this;
            },
            get: function(b) {
                return b === a ? f.call(this) : this[b >= 0 ? b : b + this.length];
            },
            toArray: function() {
                return this.get();
            },
            size: function() {
                return this.length;
            },
            remove: function() {
                return this.each(function() {
                    this.parentNode != null && this.parentNode.removeChild(this);
                });
            },
            each: function(a) {
                return e.every.call(this, function(b, c) {
                    return a.call(b, c, b) !== !1;
                }), this;
            },
            filter: function(a) {
                return F(a) ? this.not(this.not(a)) : c(g.call(this, function(b) {
                    return A.matches(b, a);
                }));
            },
            add: function(a, b) {
                return c(C(this.concat(c(a, b))));
            },
            is: function(a) {
                return this.length > 0 && A.matches(this[0], a);
            },
            not: function(b) {
                var d = [];
                if (F(b) && b.call !== a) this.each(function(a) {
                    b.call(this, a) || d.push(this);
                }); else {
                    var e = typeof b == "string" ? this.filter(b) : L(b) && F(b.item) ? f.call(b) : c(b);
                    this.forEach(function(a) {
                        e.indexOf(a) < 0 && d.push(a);
                    });
                }
                return c(d);
            },
            has: function(a) {
                return this.filter(function() {
                    return I(a) ? c.contains(this, a) : c(this).find(a).size();
                });
            },
            eq: function(a) {
                return a === -1 ? this.slice(a) : this.slice(a, +a + 1);
            },
            first: function() {
                var a = this[0];
                return a && !I(a) ? a : c(a);
            },
            last: function() {
                var a = this[this.length - 1];
                return a && !I(a) ? a : c(a);
            },
            find: function(a) {
                var b, d = this;
                return typeof a == "object" ? b = c(a).filter(function() {
                    var a = this;
                    return e.some.call(d, function(b) {
                        return c.contains(b, a);
                    });
                }) : this.length == 1 ? b = c(A.qsa(this[0], a)) : b = this.map(function() {
                    return A.qsa(this, a);
                }), b;
            },
            closest: function(a, b) {
                var d = this[0], e = !1;
                typeof a == "object" && (e = c(a));
                while (d && !(e ? e.indexOf(d) >= 0 : A.matches(d, a))) d = d !== b && !H(d) && d.parentNode;
                return c(d);
            },
            parents: function(a) {
                var b = [], d = this;
                while (d.length > 0) d = c.map(d, function(a) {
                    if ((a = a.parentNode) && !H(a) && b.indexOf(a) < 0) return b.push(a), a;
                });
                return U(b, a);
            },
            parent: function(a) {
                return U(C(this.pluck("parentNode")), a);
            },
            children: function(a) {
                return U(this.map(function() {
                    return S(this);
                }), a);
            },
            contents: function() {
                return this.map(function() {
                    return f.call(this.childNodes);
                });
            },
            siblings: function(a) {
                return U(this.map(function(a, b) {
                    return g.call(S(b.parentNode), function(a) {
                        return a !== b;
                    });
                }), a);
            },
            empty: function() {
                return this.each(function() {
                    this.innerHTML = "";
                });
            },
            pluck: function(a) {
                return c.map(this, function(b) {
                    return b[a];
                });
            },
            show: function() {
                return this.each(function() {
                    this.style.display == "none" && (this.style.display = null), k(this, "").getPropertyValue("display") == "none" && (this.style.display = R(this.nodeName));
                });
            },
            replaceWith: function(a) {
                return this.before(a).remove();
            },
            wrap: function(a) {
                var b = F(a);
                if (this[0] && !b) var d = c(a).get(0), e = d.parentNode || this.length > 1;
                return this.each(function(f) {
                    c(this).wrapAll(b ? a.call(this, f) : e ? d.cloneNode(!0) : d);
                });
            },
            wrapAll: function(a) {
                if (this[0]) {
                    c(this[0]).before(a = c(a));
                    var b;
                    while ((b = a.children()).length) a = b.first();
                    c(a).append(this);
                }
                return this;
            },
            wrapInner: function(a) {
                var b = F(a);
                return this.each(function(d) {
                    var e = c(this), f = e.contents(), g = b ? a.call(this, d) : a;
                    f.length ? f.wrapAll(g) : e.append(g);
                });
            },
            unwrap: function() {
                return this.parent().each(function() {
                    c(this).replaceWith(c(this).children());
                }), this;
            },
            clone: function() {
                return this.map(function() {
                    return this.cloneNode(!0);
                });
            },
            hide: function() {
                return this.css("display", "none");
            },
            toggle: function(b) {
                return this.each(function() {
                    var d = c(this);
                    (b === a ? d.css("display") == "none" : b) ? d.show() : d.hide();
                });
            },
            prev: function(a) {
                return c(this.pluck("previousElementSibling")).filter(a || "*");
            },
            next: function(a) {
                return c(this.pluck("nextElementSibling")).filter(a || "*");
            },
            html: function(b) {
                return b === a ? this.length > 0 ? this[0].innerHTML : null : this.each(function(a) {
                    var d = this.innerHTML;
                    c(this).empty().append(V(this, b, a, d));
                });
            },
            text: function(b) {
                return b === a ? this.length > 0 ? this[0].textContent : null : this.each(function() {
                    this.textContent = b;
                });
            },
            attr: function(c, d) {
                var e;
                return typeof c == "string" && d === a ? this.length == 0 || this[0].nodeType !== 1 ? a : c == "value" && this[0].nodeName == "INPUT" ? this.val() : !(e = this[0].getAttribute(c)) && c in this[0] ? this[0][c] : e : this.each(function(a) {
                    if (this.nodeType !== 1) return;
                    if (I(c)) for (b in c) W(this, b, c[b]); else W(this, c, V(this, d, a, this.getAttribute(c)));
                });
            },
            removeAttr: function(a) {
                return this.each(function() {
                    this.nodeType === 1 && W(this, a);
                });
            },
            prop: function(b, c) {
                return c === a ? this[0] && this[0][b] : this.each(function(a) {
                    this[b] = V(this, c, a, this[b]);
                });
            },
            data: function(b, c) {
                var d = this.attr("data-" + O(b), c);
                return d !== null ? Y(d) : a;
            },
            val: function(b) {
                return b === a ? this[0] && (this[0].multiple ? c(this[0]).find("option").filter(function(a) {
                    return this.selected;
                }).pluck("value") : this[0].value) : this.each(function(a) {
                    this.value = V(this, b, a, this.value);
                });
            },
            offset: function(a) {
                if (a) return this.each(function(b) {
                    var d = c(this), e = V(this, a, b, d.offset()), f = d.offsetParent().offset(), g = {
                        top: e.top - f.top,
                        left: e.left - f.left
                    };
                    d.css("position") == "static" && (g.position = "relative"), d.css(g);
                });
                if (this.length == 0) return null;
                var b = this[0].getBoundingClientRect();
                return {
                    left: b.left + window.pageXOffset,
                    top: b.top + window.pageYOffset,
                    width: Math.round(b.width),
                    height: Math.round(b.height)
                };
            },
            css: function(a, c) {
                if (arguments.length < 2 && typeof a == "string") return this[0] && (this[0].style[B(a)] || k(this[0], "").getPropertyValue(a));
                var d = "";
                if (E(a) == "string") !c && c !== 0 ? this.each(function() {
                    this.style.removeProperty(O(a));
                }) : d = O(a) + ":" + Q(a, c); else for (b in a) !a[b] && a[b] !== 0 ? this.each(function() {
                    this.style.removeProperty(O(b));
                }) : d += O(b) + ":" + Q(b, a[b]) + ";";
                return this.each(function() {
                    this.style.cssText += ";" + d;
                });
            },
            index: function(a) {
                return a ? this.indexOf(c(a)[0]) : this.parent().children().indexOf(this[0]);
            },
            hasClass: function(a) {
                return e.some.call(this, function(a) {
                    return this.test(X(a));
                }, P(a));
            },
            addClass: function(a) {
                return this.each(function(b) {
                    d = [];
                    var e = X(this), f = V(this, a, b, e);
                    f.split(/\s+/g).forEach(function(a) {
                        c(this).hasClass(a) || d.push(a);
                    }, this), d.length && X(this, e + (e ? " " : "") + d.join(" "));
                });
            },
            removeClass: function(b) {
                return this.each(function(c) {
                    if (b === a) return X(this, "");
                    d = X(this), V(this, b, c, d).split(/\s+/g).forEach(function(a) {
                        d = d.replace(P(a), " ");
                    }), X(this, d.trim());
                });
            },
            toggleClass: function(b, d) {
                return this.each(function(e) {
                    var f = c(this), g = V(this, b, e, X(this));
                    g.split(/\s+/g).forEach(function(b) {
                        (d === a ? !f.hasClass(b) : d) ? f.addClass(b) : f.removeClass(b);
                    });
                });
            },
            scrollTop: function() {
                if (!this.length) return;
                return "scrollTop" in this[0] ? this[0].scrollTop : this[0].scrollY;
            },
            position: function() {
                if (!this.length) return;
                var a = this[0], b = this.offsetParent(), d = this.offset(), e = o.test(b[0].nodeName) ? {
                    top: 0,
                    left: 0
                } : b.offset();
                return d.top -= parseFloat(c(a).css("margin-top")) || 0, d.left -= parseFloat(c(a).css("margin-left")) || 0, 
                e.top += parseFloat(c(b[0]).css("border-top-width")) || 0, e.left += parseFloat(c(b[0]).css("border-left-width")) || 0, 
                {
                    top: d.top - e.top,
                    left: d.left - e.left
                };
            },
            offsetParent: function() {
                return this.map(function() {
                    var a = this.offsetParent || h.body;
                    while (a && !o.test(a.nodeName) && c(a).css("position") == "static") a = a.offsetParent;
                    return a;
                });
            }
        }, c.fn.detach = c.fn.remove, [ "width", "height" ].forEach(function(b) {
            c.fn[b] = function(d) {
                var e, f = this[0], g = b.replace(/./, function(a) {
                    return a[0].toUpperCase();
                });
                return d === a ? G(f) ? f["inner" + g] : H(f) ? f.documentElement["offset" + g] : (e = this.offset()) && e[b] : this.each(function(a) {
                    f = c(this), f.css(b, V(this, d, a, f[b]()));
                });
            };
        }), q.forEach(function(a, b) {
            var d = b % 2;
            c.fn[a] = function() {
                var a, e = c.map(arguments, function(b) {
                    return a = E(b), a == "object" || a == "array" || b == null ? b : A.fragment(b);
                }), f, g = this.length > 1;
                return e.length < 1 ? this : this.each(function(a, h) {
                    f = d ? h : h.parentNode, h = b == 0 ? h.nextSibling : b == 1 ? h.firstChild : b == 2 ? h : null, 
                    e.forEach(function(a) {
                        if (g) a = a.cloneNode(!0); else if (!f) return c(a).remove();
                        Z(f.insertBefore(a, h), function(a) {
                            a.nodeName != null && a.nodeName.toUpperCase() === "SCRIPT" && (!a.type || a.type === "text/javascript") && !a.src && window.eval.call(window, a.innerHTML);
                        });
                    });
                });
            }, c.fn[d ? a + "To" : "insert" + (b ? "Before" : "After")] = function(b) {
                return c(b)[a](this), this;
            };
        }), A.Z.prototype = c.fn, A.uniq = C, A.deserializeValue = Y, c.zepto = A, c;
    }();
    window.Zepto = Zepto, "$" in window || (window.$ = Zepto), function(a) {
        function b(a) {
            var b = this.os = {}, c = this.browser = {}, d = a.match(/WebKit\/([\d.]+)/), e = a.match(/(Android)\s+([\d.]+)/), f = a.match(/(iPad).*OS\s([\d_]+)/), g = !f && a.match(/(iPhone\sOS)\s([\d_]+)/), h = a.match(/(webOS|hpwOS)[\s\/]([\d.]+)/), i = h && a.match(/TouchPad/), j = a.match(/Kindle\/([\d.]+)/), k = a.match(/Silk\/([\d._]+)/), l = a.match(/(BlackBerry).*Version\/([\d.]+)/), m = a.match(/(BB10).*Version\/([\d.]+)/), n = a.match(/(RIM\sTablet\sOS)\s([\d.]+)/), o = a.match(/PlayBook/), p = a.match(/Chrome\/([\d.]+)/) || a.match(/CriOS\/([\d.]+)/), q = a.match(/Firefox\/([\d.]+)/);
            if (c.webkit = !!d) c.version = d[1];
            e && (b.android = !0, b.version = e[2]), g && (b.ios = b.iphone = !0, b.version = g[2].replace(/_/g, ".")), 
            f && (b.ios = b.ipad = !0, b.version = f[2].replace(/_/g, ".")), h && (b.webos = !0, 
            b.version = h[2]), i && (b.touchpad = !0), l && (b.blackberry = !0, b.version = l[2]), 
            m && (b.bb10 = !0, b.version = m[2]), n && (b.rimtabletos = !0, b.version = n[2]), 
            o && (c.playbook = !0), j && (b.kindle = !0, b.version = j[1]), k && (c.silk = !0, 
            c.version = k[1]), !k && b.android && a.match(/Kindle Fire/) && (c.silk = !0), p && (c.chrome = !0, 
            c.version = p[1]), q && (c.firefox = !0, c.version = q[1]), b.tablet = !!(f || o || e && !a.match(/Mobile/) || q && a.match(/Tablet/)), 
            b.phone = !b.tablet && !!(e || g || h || l || m || p && a.match(/Android/) || p && a.match(/CriOS\/([\d.]+)/) || q && a.match(/Mobile/));
        }
        b.call(a, navigator.userAgent), a.__detect = b;
    }(Zepto), function(a) {
        function g(a) {
            return a._zid || (a._zid = d++);
        }
        function h(a, b, d, e) {
            b = i(b);
            if (b.ns) var f = j(b.ns);
            return (c[g(a)] || []).filter(function(a) {
                return a && (!b.e || a.e == b.e) && (!b.ns || f.test(a.ns)) && (!d || g(a.fn) === g(d)) && (!e || a.sel == e);
            });
        }
        function i(a) {
            var b = ("" + a).split(".");
            return {
                e: b[0],
                ns: b.slice(1).sort().join(" ")
            };
        }
        function j(a) {
            return new RegExp("(?:^| )" + a.replace(" ", " .* ?") + "(?: |$)");
        }
        function k(b, c, d) {
            a.type(b) != "string" ? a.each(b, d) : b.split(/\s/).forEach(function(a) {
                d(a, c);
            });
        }
        function l(a, b) {
            return a.del && (a.e == "focus" || a.e == "blur") || !!b;
        }
        function m(a) {
            return f[a] || a;
        }
        function n(b, d, e, h, j, n) {
            var o = g(b), p = c[o] || (c[o] = []);
            k(d, e, function(c, d) {
                var e = i(c);
                e.fn = d, e.sel = h, e.e in f && (d = function(b) {
                    var c = b.relatedTarget;
                    if (!c || c !== this && !a.contains(this, c)) return e.fn.apply(this, arguments);
                }), e.del = j && j(d, c);
                var g = e.del || d;
                e.proxy = function(a) {
                    var c = g.apply(b, [ a ].concat(a.data));
                    return c === !1 && (a.preventDefault(), a.stopPropagation()), c;
                }, e.i = p.length, p.push(e), b.addEventListener(m(e.e), e.proxy, l(e, n));
            });
        }
        function o(a, b, d, e, f) {
            var i = g(a);
            k(b || "", d, function(b, d) {
                h(a, b, d, e).forEach(function(b) {
                    delete c[i][b.i], a.removeEventListener(m(b.e), b.proxy, l(b, f));
                });
            });
        }
        function t(b) {
            var c, d = {
                originalEvent: b
            };
            for (c in b) !r.test(c) && b[c] !== undefined && (d[c] = b[c]);
            return a.each(s, function(a, c) {
                d[a] = function() {
                    return this[c] = p, b[a].apply(b, arguments);
                }, d[c] = q;
            }), d;
        }
        function u(a) {
            if (!("defaultPrevented" in a)) {
                a.defaultPrevented = !1;
                var b = a.preventDefault;
                a.preventDefault = function() {
                    this.defaultPrevented = !0, b.call(this);
                };
            }
        }
        var b = a.zepto.qsa, c = {}, d = 1, e = {}, f = {
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        };
        e.click = e.mousedown = e.mouseup = e.mousemove = "MouseEvents", a.event = {
            add: n,
            remove: o
        }, a.proxy = function(b, c) {
            if (a.isFunction(b)) {
                var d = function() {
                    return b.apply(c, arguments);
                };
                return d._zid = g(b), d;
            }
            if (typeof c == "string") return a.proxy(b[c], b);
            throw new TypeError("expected function");
        }, a.fn.bind = function(a, b) {
            return this.each(function() {
                n(this, a, b);
            });
        }, a.fn.unbind = function(a, b) {
            return this.each(function() {
                o(this, a, b);
            });
        }, a.fn.one = function(a, b) {
            return this.each(function(c, d) {
                n(this, a, b, null, function(a, b) {
                    return function() {
                        var c = a.apply(d, arguments);
                        return o(d, b, a), c;
                    };
                });
            });
        };
        var p = function() {
            return !0;
        }, q = function() {
            return !1;
        }, r = /^([A-Z]|layer[XY]$)/, s = {
            preventDefault: "isDefaultPrevented",
            stopImmediatePropagation: "isImmediatePropagationStopped",
            stopPropagation: "isPropagationStopped"
        };
        a.fn.delegate = function(b, c, d) {
            return this.each(function(e, f) {
                n(f, c, d, b, function(c) {
                    return function(d) {
                        var e, g = a(d.target).closest(b, f).get(0);
                        if (g) return e = a.extend(t(d), {
                            currentTarget: g,
                            liveFired: f
                        }), c.apply(g, [ e ].concat([].slice.call(arguments, 1)));
                    };
                });
            });
        }, a.fn.undelegate = function(a, b, c) {
            return this.each(function() {
                o(this, b, c, a);
            });
        }, a.fn.live = function(b, c) {
            return a(document.body).delegate(this.selector, b, c), this;
        }, a.fn.die = function(b, c) {
            return a(document.body).undelegate(this.selector, b, c), this;
        }, a.fn.on = function(b, c, d) {
            return !c || a.isFunction(c) ? this.bind(b, c || d) : this.delegate(c, b, d);
        }, a.fn.off = function(b, c, d) {
            return !c || a.isFunction(c) ? this.unbind(b, c || d) : this.undelegate(c, b, d);
        }, a.fn.trigger = function(b, c) {
            if (typeof b == "string" || a.isPlainObject(b)) b = a.Event(b);
            return u(b), b.data = c, this.each(function() {
                "dispatchEvent" in this && this.dispatchEvent(b);
            });
        }, a.fn.triggerHandler = function(b, c) {
            var d, e;
            return this.each(function(f, g) {
                d = t(typeof b == "string" ? a.Event(b) : b), d.data = c, d.target = g, a.each(h(g, b.type || b), function(a, b) {
                    e = b.proxy(d);
                    if (d.isImmediatePropagationStopped()) return !1;
                });
            }), e;
        }, "focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(b) {
            a.fn[b] = function(a) {
                return a ? this.bind(b, a) : this.trigger(b);
            };
        }), [ "focus", "blur" ].forEach(function(b) {
            a.fn[b] = function(a) {
                return a ? this.bind(b, a) : this.each(function() {
                    try {
                        this[b]();
                    } catch (a) {}
                }), this;
            };
        }), a.Event = function(a, b) {
            typeof a != "string" && (b = a, a = b.type);
            var c = document.createEvent(e[a] || "Events"), d = !0;
            if (b) for (var f in b) f == "bubbles" ? d = !!b[f] : c[f] = b[f];
            return c.initEvent(a, d, !0, null, null, null, null, null, null, null, null, null, null, null, null), 
            c.isDefaultPrevented = function() {
                return this.defaultPrevented;
            }, c;
        };
    }(Zepto), function($) {
        function triggerAndReturn(a, b, c) {
            var d = $.Event(b);
            return $(a).trigger(d, c), !d.defaultPrevented;
        }
        function triggerGlobal(a, b, c, d) {
            if (a.global) return triggerAndReturn(b || document, c, d);
        }
        function ajaxStart(a) {
            a.global && $.active++ === 0 && triggerGlobal(a, null, "ajaxStart");
        }
        function ajaxStop(a) {
            a.global && !--$.active && triggerGlobal(a, null, "ajaxStop");
        }
        function ajaxBeforeSend(a, b) {
            var c = b.context;
            if (b.beforeSend.call(c, a, b) === !1 || triggerGlobal(b, c, "ajaxBeforeSend", [ a, b ]) === !1) return !1;
            triggerGlobal(b, c, "ajaxSend", [ a, b ]);
        }
        function ajaxSuccess(a, b, c) {
            var d = c.context, e = "success";
            c.success.call(d, a, e, b), triggerGlobal(c, d, "ajaxSuccess", [ b, c, a ]), ajaxComplete(e, b, c);
        }
        function ajaxError(a, b, c, d) {
            var e = d.context;
            d.error.call(e, c, b, a), triggerGlobal(d, e, "ajaxError", [ c, d, a ]), ajaxComplete(b, c, d);
        }
        function ajaxComplete(a, b, c) {
            var d = c.context;
            c.complete.call(d, b, a), triggerGlobal(c, d, "ajaxComplete", [ b, c ]), ajaxStop(c);
        }
        function empty() {}
        function mimeToDataType(a) {
            return a && (a = a.split(";", 2)[0]), a && (a == htmlType ? "html" : a == jsonType ? "json" : scriptTypeRE.test(a) ? "script" : xmlTypeRE.test(a) && "xml") || "text";
        }
        function appendQuery(a, b) {
            return (a + "&" + b).replace(/[&?]{1,2}/, "?");
        }
        function serializeData(a) {
            a.processData && a.data && $.type(a.data) != "string" && (a.data = $.param(a.data, a.traditional)), 
            a.data && (!a.type || a.type.toUpperCase() == "GET") && (a.url = appendQuery(a.url, a.data));
        }
        function parseArguments(a, b, c, d) {
            var e = !$.isFunction(b);
            return {
                url: a,
                data: e ? b : undefined,
                success: e ? $.isFunction(c) ? c : undefined : b,
                dataType: e ? d || c : c
            };
        }
        function serialize(a, b, c, d) {
            var e, f = $.isArray(b);
            $.each(b, function(b, g) {
                e = $.type(g), d && (b = c ? d : d + "[" + (f ? "" : b) + "]"), !d && f ? a.add(g.name, g.value) : e == "array" || !c && e == "object" ? serialize(a, g, c, b) : a.add(b, g);
            });
        }
        var jsonpID = 0, document = window.document, key, name, rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, scriptTypeRE = /^(?:text|application)\/javascript/i, xmlTypeRE = /^(?:text|application)\/xml/i, jsonType = "application/json", htmlType = "text/html", blankRE = /^\s*$/;
        $.active = 0, $.ajaxJSONP = function(a) {
            if ("type" in a) {
                var b = "jsonp" + ++jsonpID, c = document.createElement("script"), d = function() {
                    clearTimeout(g), $(c).remove(), delete window[b];
                }, e = function(c) {
                    d();
                    if (!c || c == "timeout") window[b] = empty;
                    ajaxError(null, c || "abort", f, a);
                }, f = {
                    abort: e
                }, g;
                return ajaxBeforeSend(f, a) === !1 ? (e("abort"), !1) : (window[b] = function(b) {
                    d(), ajaxSuccess(b, f, a);
                }, c.onerror = function() {
                    e("error");
                }, c.src = a.url.replace(/=\?/, "=" + b), $("head").append(c), a.timeout > 0 && (g = setTimeout(function() {
                    e("timeout");
                }, a.timeout)), f);
            }
            return $.ajax(a);
        }, $.ajaxSettings = {
            type: "GET",
            beforeSend: empty,
            success: empty,
            error: empty,
            complete: empty,
            context: null,
            global: !0,
            xhr: function() {
                return new window.XMLHttpRequest();
            },
            accepts: {
                script: "text/javascript, application/javascript",
                json: jsonType,
                xml: "application/xml, text/xml",
                html: htmlType,
                text: "text/plain"
            },
            crossDomain: !1,
            timeout: 0,
            processData: !0,
            cache: !0
        }, $.ajax = function(options) {
            var settings = $.extend({}, options || {});
            for (key in $.ajaxSettings) settings[key] === undefined && (settings[key] = $.ajaxSettings[key]);
            ajaxStart(settings), settings.crossDomain || (settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 != window.location.host), 
            settings.url || (settings.url = window.location.toString()), serializeData(settings), 
            settings.cache === !1 && (settings.url = appendQuery(settings.url, "_=" + Date.now()));
            var dataType = settings.dataType, hasPlaceholder = /=\?/.test(settings.url);
            if (dataType == "jsonp" || hasPlaceholder) return hasPlaceholder || (settings.url = appendQuery(settings.url, "callback=?")), 
            $.ajaxJSONP(settings);
            var mime = settings.accepts[dataType], baseHeaders = {}, protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol, xhr = settings.xhr(), abortTimeout;
            settings.crossDomain || (baseHeaders["X-Requested-With"] = "XMLHttpRequest"), mime && (baseHeaders.Accept = mime, 
            mime.indexOf(",") > -1 && (mime = mime.split(",", 2)[0]), xhr.overrideMimeType && xhr.overrideMimeType(mime));
            if (settings.contentType || settings.contentType !== !1 && settings.data && settings.type.toUpperCase() != "GET") baseHeaders["Content-Type"] = settings.contentType || "application/x-www-form-urlencoded";
            settings.headers = $.extend(baseHeaders, settings.headers || {}), xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    xhr.onreadystatechange = empty, clearTimeout(abortTimeout);
                    var result, error = !1;
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304 || xhr.status == 0 && protocol == "file:") {
                        dataType = dataType || mimeToDataType(xhr.getResponseHeader("content-type")), result = xhr.responseText;
                        try {
                            dataType == "script" ? (1, eval)(result) : dataType == "xml" ? result = xhr.responseXML : dataType == "json" && (result = blankRE.test(result) ? null : $.parseJSON(result));
                        } catch (e) {
                            error = e;
                        }
                        error ? ajaxError(error, "parsererror", xhr, settings) : ajaxSuccess(result, xhr, settings);
                    } else ajaxError(null, xhr.status ? "error" : "abort", xhr, settings);
                }
            };
            var async = "async" in settings ? settings.async : !0;
            xhr.open(settings.type, settings.url, async);
            for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name]);
            return ajaxBeforeSend(xhr, settings) === !1 ? (xhr.abort(), !1) : (settings.timeout > 0 && (abortTimeout = setTimeout(function() {
                xhr.onreadystatechange = empty, xhr.abort(), ajaxError(null, "timeout", xhr, settings);
            }, settings.timeout)), xhr.send(settings.data ? settings.data : null), xhr);
        }, $.get = function(a, b, c, d) {
            return $.ajax(parseArguments.apply(null, arguments));
        }, $.post = function(a, b, c, d) {
            var e = parseArguments.apply(null, arguments);
            return e.type = "POST", $.ajax(e);
        }, $.getJSON = function(a, b, c) {
            var d = parseArguments.apply(null, arguments);
            return d.dataType = "json", $.ajax(d);
        }, $.fn.load = function(a, b, c) {
            if (!this.length) return this;
            var d = this, e = a.split(/\s/), f, g = parseArguments(a, b, c), h = g.success;
            return e.length > 1 && (g.url = e[0], f = e[1]), g.success = function(a) {
                d.html(f ? $("<div>").html(a.replace(rscript, "")).find(f) : a), h && h.apply(d, arguments);
            }, $.ajax(g), this;
        };
        var escape = encodeURIComponent;
        $.param = function(a, b) {
            var c = [];
            return c.add = function(a, b) {
                this.push(escape(a) + "=" + escape(b));
            }, serialize(c, a, b), c.join("&").replace(/%20/g, "+");
        };
    }(Zepto), function(a) {
        a.fn.serializeArray = function() {
            var b = [], c;
            return a(Array.prototype.slice.call(this.get(0).elements)).each(function() {
                c = a(this);
                var d = c.attr("type");
                this.nodeName.toLowerCase() != "fieldset" && !this.disabled && d != "submit" && d != "reset" && d != "button" && (d != "radio" && d != "checkbox" || this.checked) && b.push({
                    name: c.attr("name"),
                    value: c.val()
                });
            }), b;
        }, a.fn.serialize = function() {
            var a = [];
            return this.serializeArray().forEach(function(b) {
                a.push(encodeURIComponent(b.name) + "=" + encodeURIComponent(b.value));
            }), a.join("&");
        }, a.fn.submit = function(b) {
            if (b) this.bind("submit", b); else if (this.length) {
                var c = a.Event("submit");
                this.eq(0).trigger(c), c.defaultPrevented || this.get(0).submit();
            }
            return this;
        };
    }(Zepto), function(a, b) {
        function s(a) {
            return t(a.replace(/([a-z])([A-Z])/, "$1-$2"));
        }
        function t(a) {
            return a.toLowerCase();
        }
        function u(a) {
            return d ? d + a : t(a);
        }
        var c = "", d, e, f, g = {
            Webkit: "webkit",
            Moz: "",
            O: "o",
            ms: "MS"
        }, h = window.document, i = h.createElement("div"), j = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i, k, l, m, n, o, p, q, r = {};
        a.each(g, function(a, e) {
            if (i.style[a + "TransitionProperty"] !== b) return c = "-" + t(a) + "-", d = e, 
            !1;
        }), k = c + "transform", r[l = c + "transition-property"] = r[m = c + "transition-duration"] = r[n = c + "transition-timing-function"] = r[o = c + "animation-name"] = r[p = c + "animation-duration"] = r[q = c + "animation-timing-function"] = "", 
        a.fx = {
            off: d === b && i.style.transitionProperty === b,
            speeds: {
                _default: 400,
                fast: 200,
                slow: 600
            },
            cssPrefix: c,
            transitionEnd: u("TransitionEnd"),
            animationEnd: u("AnimationEnd")
        }, a.fn.animate = function(b, c, d, e) {
            return a.isPlainObject(c) && (d = c.easing, e = c.complete, c = c.duration), c && (c = (typeof c == "number" ? c : a.fx.speeds[c] || a.fx.speeds._default) / 1e3), 
            this.anim(b, c, d, e);
        }, a.fn.anim = function(c, d, e, f) {
            var g, h = {}, i, t = "", u = this, v, w = a.fx.transitionEnd;
            d === b && (d = .4), a.fx.off && (d = 0);
            if (typeof c == "string") h[o] = c, h[p] = d + "s", h[q] = e || "linear", w = a.fx.animationEnd; else {
                i = [];
                for (g in c) j.test(g) ? t += g + "(" + c[g] + ") " : (h[g] = c[g], i.push(s(g)));
                t && (h[k] = t, i.push(k)), d > 0 && typeof c == "object" && (h[l] = i.join(", "), 
                h[m] = d + "s", h[n] = e || "linear");
            }
            return v = function(b) {
                if (typeof b != "undefined") {
                    if (b.target !== b.currentTarget) return;
                    a(b.target).unbind(w, v);
                }
                a(this).css(r), f && f.call(this);
            }, d > 0 && this.bind(w, v), this.size() && this.get(0).clientLeft, this.css(h), 
            d <= 0 && setTimeout(function() {
                u.each(function() {
                    v.call(this);
                });
            }, 0), this;
        }, i = null;
    }(Zepto), function(a, b) {
        function h(c, d, e, f, g) {
            typeof d == "function" && !g && (g = d, d = b);
            var h = {
                opacity: e
            };
            return f && (h.scale = f, c.css(a.fx.cssPrefix + "transform-origin", "0 0")), c.animate(h, d, null, g);
        }
        function i(b, c, d, e) {
            return h(b, c, 0, d, function() {
                f.call(a(this)), e && e.call(this);
            });
        }
        var c = window.document, d = c.documentElement, e = a.fn.show, f = a.fn.hide, g = a.fn.toggle;
        a.fn.show = function(a, c) {
            return e.call(this), a === b ? a = 0 : this.css("opacity", 0), h(this, a, 1, "1,1", c);
        }, a.fn.hide = function(a, c) {
            return a === b ? f.call(this) : i(this, a, "0,0", c);
        }, a.fn.toggle = function(c, d) {
            return c === b || typeof c == "boolean" ? g.call(this, c) : this.each(function() {
                var b = a(this);
                b[b.css("display") == "none" ? "show" : "hide"](c, d);
            });
        }, a.fn.fadeTo = function(a, b, c) {
            return h(this, a, b, null, c);
        }, a.fn.fadeIn = function(a, b) {
            var c = this.css("opacity");
            return c > 0 ? this.css("opacity", 0) : c = 1, e.call(this).fadeTo(a, c, b);
        }, a.fn.fadeOut = function(a, b) {
            return i(this, a, null, b);
        }, a.fn.fadeToggle = function(b, c) {
            return this.each(function() {
                var d = a(this);
                d[d.css("opacity") == 0 || d.css("display") == "none" ? "fadeIn" : "fadeOut"](b, c);
            });
        };
    }(Zepto), function(a) {
        function f(f, h) {
            var i = f[e], j = i && b[i];
            if (h === undefined) return j || g(f);
            if (j) {
                if (h in j) return j[h];
                var k = d(h);
                if (k in j) return j[k];
            }
            return c.call(a(f), h);
        }
        function g(c, f, g) {
            var i = c[e] || (c[e] = ++a.uuid), j = b[i] || (b[i] = h(c));
            return f !== undefined && (j[d(f)] = g), j;
        }
        function h(b) {
            var c = {};
            return a.each(b.attributes, function(b, e) {
                e.name.indexOf("data-") == 0 && (c[d(e.name.replace("data-", ""))] = a.zepto.deserializeValue(e.value));
            }), c;
        }
        var b = {}, c = a.fn.data, d = a.camelCase, e = a.expando = "Zepto" + +new Date();
        a.fn.data = function(b, c) {
            return c === undefined ? a.isPlainObject(b) ? this.each(function(c, d) {
                a.each(b, function(a, b) {
                    g(d, a, b);
                });
            }) : this.length == 0 ? undefined : f(this[0], b) : this.each(function() {
                g(this, b, c);
            });
        }, a.fn.removeData = function(c) {
            return typeof c == "string" && (c = c.split(/\s+/)), this.each(function() {
                var f = this[e], g = f && b[f];
                g && a.each(c, function() {
                    delete g[d(this)];
                });
            });
        };
    }(Zepto), function(a) {
        var b = [], c;
        a.fn.remove = function() {
            return this.each(function() {
                this.parentNode && (this.tagName === "IMG" && (b.push(this), this.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=", 
                c && clearTimeout(c), c = setTimeout(function() {
                    b = [];
                }, 6e4)), this.parentNode.removeChild(this));
            });
        };
    }(Zepto), function(a) {
        function e(b) {
            return b = a(b), (!!b.width() || !!b.height()) && b.css("display") !== "none";
        }
        function j(a, b) {
            a = a.replace(/=#\]/g, '="#"]');
            var c, d, e = g.exec(a);
            if (e && e[2] in f) {
                c = f[e[2]], d = e[3], a = e[1];
                if (d) {
                    var h = Number(d);
                    isNaN(h) ? d = d.replace(/^["']|["']$/g, "") : d = h;
                }
            }
            return b(a, c, d);
        }
        var b = a.zepto, c = b.qsa, d = b.matches, f = a.expr[":"] = {
            visible: function() {
                if (e(this)) return this;
            },
            hidden: function() {
                if (!e(this)) return this;
            },
            selected: function() {
                if (this.selected) return this;
            },
            checked: function() {
                if (this.checked) return this;
            },
            parent: function() {
                return this.parentNode;
            },
            first: function(a) {
                if (a === 0) return this;
            },
            last: function(a, b) {
                if (a === b.length - 1) return this;
            },
            eq: function(a, b, c) {
                if (a === c) return this;
            },
            contains: function(b, c, d) {
                if (a(this).text().indexOf(d) > -1) return this;
            },
            has: function(a, c, d) {
                if (b.qsa(this, d).length) return this;
            }
        }, g = new RegExp("(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*"), h = /^\s*>/, i = "Zepto" + +new Date();
        b.qsa = function(d, e) {
            return j(e, function(f, g, j) {
                try {
                    var k;
                    !f && g ? f = "*" : h.test(f) && (k = a(d).addClass(i), f = "." + i + " " + f);
                    var l = c(d, f);
                } catch (m) {
                    throw console.error("error performing selector: %o", e), m;
                } finally {
                    k && k.removeClass(i);
                }
                return g ? b.uniq(a.map(l, function(a, b) {
                    return g.call(a, b, l, j);
                })) : l;
            });
        }, b.matches = function(a, b) {
            return j(b, function(b, c, e) {
                return (!b || d(a, b)) && (!c || c.call(a, null, e) === a);
            });
        };
    }(Zepto), function(a) {
        function h(a) {
            return "tagName" in a ? a : a.parentNode;
        }
        function i(a, b, c, d) {
            var e = Math.abs(a - b), f = Math.abs(c - d);
            return e >= f ? a - b > 0 ? "Left" : "Right" : c - d > 0 ? "Up" : "Down";
        }
        function j() {
            g = null, b.last && (b.el.trigger("longTap"), b = {});
        }
        function k() {
            g && clearTimeout(g), g = null;
        }
        function l() {
            c && clearTimeout(c), d && clearTimeout(d), e && clearTimeout(e), g && clearTimeout(g), 
            c = d = e = g = null, b = {};
        }
        var b = {}, c, d, e, f = 750, g;
        a(document).ready(function() {
            var m, n;
            a(document.body).bind("touchstart", function(d) {
                m = Date.now(), n = m - (b.last || m), b.el = a(h(d.touches[0].target)), c && clearTimeout(c), 
                b.x1 = d.touches[0].pageX, b.y1 = d.touches[0].pageY, n > 0 && n <= 250 && (b.isDoubleTap = !0), 
                b.last = m, g = setTimeout(j, f);
            }).bind("touchmove", function(a) {
                k(), b.x2 = a.touches[0].pageX, b.y2 = a.touches[0].pageY, Math.abs(b.x1 - b.x2) > 10 && a.preventDefault();
            }).bind("touchend", function(f) {
                k(), b.x2 && Math.abs(b.x1 - b.x2) > 30 || b.y2 && Math.abs(b.y1 - b.y2) > 30 ? e = setTimeout(function() {
                    b.el.trigger("swipe"), b.el.trigger("swipe" + i(b.x1, b.x2, b.y1, b.y2)), b = {};
                }, 0) : "last" in b && (d = setTimeout(function() {
                    var d = a.Event("tap");
                    d.cancelTouch = l, b.el.trigger(d), b.isDoubleTap ? (b.el.trigger("doubleTap"), 
                    b = {}) : c = setTimeout(function() {
                        c = null, b.el.trigger("singleTap"), b = {};
                    }, 250);
                }, 0));
            }).bind("touchcancel", l), a(window).bind("scroll", l);
        }), [ "swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap", "singleTap", "longTap" ].forEach(function(b) {
            a.fn[b] = function(a) {
                return this.bind(b, a);
            };
        });
    }(Zepto);
    return Zepto;
});
/*
 * nojs mobile UI
 * 2013-8-04
 * nolure@vip.qq.com
 */
define("m/ui", [], function(require, $) {
    var UI = {};
    /*
	 * 触发方式
	 * 1.普通：直接执行相关方法，
	 * 2.区域初始化：通过在Elements上配置相应的属性初始化对应区域内所有ui组件，默认body区域
	 */
    UI.init = function(area) {
        area = area || $("body");
        var dom = area.find("[data-ui]"), i, elem, method, options;
        for (i = 0; i < dom.length; i++) {
            elem = dom[i];
            method = elem.getAttribute("data-ui");
            if (UI[method]) {
                if (options = elem.getAttribute("data-config")) {
                    options = eval("({" + options + "})") || {};
                }
                UI[method](elem, options);
            }
        }
    };
    var isNew, cache = {};
    function instaceofFun(fun, arg) {
        if (!(fun instanceof arg.callee)) {
            return Extend(arg.callee, Array.prototype.slice.call(arg));
        } else {
            return false;
        }
    }
    //结合new和apply的方式
    function Extend(parent, args) {
        function F(parent, args) {
            parent.apply(this, args);
        }
        //F.constructor = parent;
        F.prototype = parent.prototype;
        isNew = null;
        return new F(parent, args);
    }
    /*
	 * 所有依赖dom的ui组件都可以通过id,element,jQuery来获取dom元素
	 */
    function getDom(selector) {
        var type = typeof selector, elem;
        if (type == "string") {
            //通过id
            elem = $("#" + selector);
        } else if (type == "object") {
            elem = selector.nodeType ? $(selector) : selector;
        }
        elem = elem.length ? elem : null;
        return elem;
    }
    UI.data = function(id, Class) {
        if (Class) {
            //set
            cache[id] = Class;
        } else {
            return cache[id];
        }
    };
    UI.config = {};
    $.fn.outerHeight = function() {
        return $(this).height();
    };
    $.extend($, {
        random: function() {
            //得到一个随机数
            return String(Math.ceil(Math.random() * 1e5) + String(new Date().getTime()));
        },
        stopDefault: function(e) {
            //取消事件的默认动作
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        },
        stopBubble: function(e) {
            //阻止冒泡
            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
        },
        onScroll: function(obejct, onScroll) {
            //自定义鼠标滚轮事件
            var scrollFunc = function(e) {
                e = e || window.event;
                if (e.wheelDelta) {} else if (e.detail) {}
                $.stopDefault(e);
                onScroll && onScroll(e);
            };
            if (document.addEventListener) {
                //firefox
                obejct.addEventListener("DOMMouseScroll", scrollFunc, false);
            }
            obejct.onmousewheel = scrollFunc;
        },
        browser: function() {
            //检测浏览器
            var u = navigator.userAgent.toLowerCase(), fn = {
                version: u.match(/(?:firefox|opera|safari|chrome|msie)[\/: ]([\d.]+)/)[0],
                //浏览器版本号
                safari: /version.+safari/.test(u),
                chrome: /chrome/.test(u),
                firefox: /firefox/.test(u),
                ie: /msie/.test(u),
                ie6: /msie 6.0/.test(u),
                ie7: /msie 7.0/.test(u),
                ie8: /msie 8.0/.test(u),
                ie9: /msie 9.0/.test(u),
                opera: /opera/.test(u)
            }, state;
            return function(name) {
                //多个用逗号隔开 如'ie6 ie7'
                state = false;
                name = name.split(" ");
                $.each(name, function(i, val) {
                    if (fn[val]) {
                        state = true;
                        return false;
                    }
                });
                return state;
            };
        }(),
        tmpl: function() {
            /*
			 * js模版引擎
			 * http://ejohn.org/blog/javascript-micro-templating/
			 */
            var c = {};
            return function(s, d) {
                var fn = !/\W/.test(s) ? c[s] = c[s] || $.tmpl(document.getElementById(s).innerHTML) : new Function("o", "var p=[];" + "with(o){p.push('" + s.replace(/[\r\t\n]/g, " ").split("<%").join("	").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("	").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");
                return d ? fn(d) : fn;
            };
        }(),
        cookie: function(name, value, options) {
            /*
			 * 读取cookie值: $.cookie("key"); 
			 * 设置/新建cookie的值:	$.cookie("key", "value");
			 * 新建一个cookie 包括有效期(天数) 路径 域名等:$.cookie("key", "value", {expires: 7, path: '/', domain: 'a.com', secure: true});
			 * 删除一个cookie:$.cookie("key", null);	
			 */
            if (typeof value != "undefined") {
                options = options || {};
                if (value === null) {
                    value = "";
                    options.expires = -1;
                }
                var expires = "";
                if (options.expires && (typeof options.expires == "number" || options.expires.toUTCString)) {
                    var date;
                    if (typeof options.expires == "number") {
                        date = new Date();
                        date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1e3);
                    } else {
                        date = options.expires;
                    }
                    expires = "; expires=" + date.toUTCString();
                }
                var path = options.path ? "; path=" + options.path : "";
                var domain = options.domain ? "; domain=" + options.domain : "";
                var secure = options.secure ? "; secure" : "";
                document.cookie = [ name, "=", encodeURIComponent(value), expires, path, domain, secure ].join("");
            } else {
                var cookieValue = null;
                if (document.cookie && document.cookie != "") {
                    var cookies = document.cookie.split(";");
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = $.trim(cookies[i]);
                        if (cookie.substring(0, name.length + 1) == name + "=") {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
        },
        addCss: function(css) {
            //动态创建css @css:string
            if (typeof css != "string") {
                return;
            }
            var i, style;
            if (document.createStyleSheet) {
                window.style = css;
                document.createStyleSheet("javascript:style");
            } else {
                style = document.createElement("style");
                style.type = "text/css";
                style.innerHTML = css;
                document.getElementsByTagName("HEAD")[0].appendChild(style);
            }
        }
    });
    //***********ui组件***********//
    UI.setPos = function(obj, pos, isFloat) {
        /*
		 * 设置浮动元素显示位置
		 * @obj:设置对象
		 * @pos:{top:top,left:left},默认{50,50}屏幕居中,top和left值范围0-100
		 * @isFloat:是否浮动 0不浮动，1动画 2固定
		 */
        if (!obj || !obj.length) {
            return;
        }
        pos = pos || {};
        var W = obj.outerWidth(), H = obj.outerHeight(), win = $(window), T, L, top = pos.top == undefined ? 50 : pos.top, left = pos.left == undefined ? 50 : pos.left, isTop = typeof top == "number", isLeft = typeof left == "number", F = isFloat == 0 ? 0 : isFloat || 2, win_w, win_h, sTop, sLeft, css = {}, noIE6 = F == 2 && !$.browser("ie6"), ns = obj.data("setpos");
        obj.css("position", noIE6 ? "fixed" : "absolute");
        function getPos() {
            win_w = win.width();
            win_h = win.height();
            sTop = noIE6 ? 0 : win.scrollTop();
            sLeft = noIE6 ? 0 : win.scrollLeft();
            T = (isTop ? (win_h - H) * top / 100 : parseInt(top, 10)) + sTop;
            L = (isLeft ? (win_w - W) * left / 100 : parseInt(left, 10)) + sLeft;
            css[isTop || T > 0 ? "top" : "bottom"] = Math.abs(T);
            css[isLeft || L > 0 ? "left" : "right"] = Math.abs(L);
        }
        getPos();
        obj.css(css);
        function moveTo(resize) {
            if (obj.is(":hidden")) {
                return;
            }
            getPos();
            if (F == 1) {
                obj.stop().animate(css, 180);
            } else if (F == 2) {
                obj.css(css);
            }
        }
        if (F) {
            if (ns) {
                win.off("." + ns);
            } else {
                ns = "setpos" + new Date().getTime();
                obj.data("setpos", ns);
            }
            win.on("scroll." + ns + " resize." + ns, moveTo);
        }
    };
    UI.layer = function() {
        /*
		 * 遮罩层
		 */
        var w = $(window), layer = $("#nj_layer"), arr = {
            show: show,
            hide: hide,
            isShow: false
        };
        function init() {
            layer = $("body").append('<div id="nj_layer"></div>').find("#nj_layer");
            layer.css({
                opacity: "0"
            });
            S = function() {
                layer.css({
                    width: w.width(),
                    height: w.height()
                });
            };
            S();
            w.on("scroll resize", S);
            UI.setPos(layer, {
                top: 0,
                left: 0
            }, 2);
            $.onScroll(layer[0]);
        }
        function show() {
            !layer.length && init();
            if (layer.is(":visible")) {
                return;
            }
            arr.self = layer;
            arr.isShow = true;
            layer.show().fadeTo(200, .5);
        }
        function hide() {
            arr.isShow = false;
            layer.fadeOut();
        }
        return arr;
    }();
    UI.win = function(opt) {
        /*
		 * 弹窗
		 */
        opt = $.extend(UI.config.win, opt);
        this.w = opt.width || 400;
        //宽
        this.self = null;
        //弹窗对象本身
        this.close = null;
        //关闭按钮
        this.tit = null;
        //标题区
        this.con = null;
        //放置内容的容器对象    
        this.opt = null;
        //操作区		
        this.stillLayer = opt.stillLayer || false;
        //隐藏后是否继续显示遮罩层
        this.layer = opt.layer == false ? false : true;
        this.pos = opt.pos || {
            left: 50,
            top: 50
        };
        this.Float = opt.Float || opt.Float === 0 ? opt.Float : 2;
        this.bindEsc = opt.bindEsc == false ? false : true;
        this.onShow = opt.onShow;
        this.onHide = opt.onHide;
        this.scroll = 0;
        this.init();
    };
    UI.win.prototype = {
        init: function() {
            var me = this, id = "nj_win_" + $.random(), win = [ '<div id="' + id + '" class="nj_win"><div class="win_wrap">', '<span class="win_close"></span><div class="win_tit"></div>', '<div class="win_con"></div>', '<div class="win_opt"></div>', "</div></div>" ];
            UI.win.item[id] = this;
            this.key = id;
            $("body").append(win.join(""));
            //插入到body中
            this.self = $("#" + id).css({
                width: me.w,
                opacity: "0"
            });
            this.close = this.self.find(".win_close");
            this.tit = this.self.find(".win_tit");
            this.con = this.self.find(".win_con");
            this.opt = this.self.find(".win_opt");
            new UI.ico(this.close, {
                type: "close"
            });
            this.bind();
        },
        bind: function() {
            var T = this;
            this.close.on("click", function() {
                T.hide();
            });
            //绑定关闭按钮事件
            if (this.bindEsc) {
                $(window).on("keydown", function(e) {
                    //按下esc键隐藏弹窗
                    T.self.is(":visible") && e.keyCode == 27 && T.hide();
                });
            }
            $.onScroll(this.con[0]);
        },
        setCon: function(tit, con, btns) {
            /*
				设置标题、内容
		        @tit,con:会替换以前的
		        @btns:设置操作区按钮，为一个数组，数组项格式同this.getButton,如不设置或设置null则隐藏操作区
		    */
            tit && this.tit.html(tit);
            con && this.con.html(con);
            this.button = [];
            if (btns) {
                this.opt.empty();
                //重设操作区
                for (var i = 0; i < btns.length; i++) {
                    this.addBtn.apply(this, btns[i]);
                }
            } else if (this.opt.html().replace(/\s/g, "") == "") {
                //不传入且未设置过操作区则隐藏操作区
                this.opt.css("display", "none");
            }
        },
        addBtn: function(text, callback, color) {
            /*
				增加一个操作区按钮
				@text:按钮文字
				@color:按钮样式，即class类名
				@callBack:按钮click绑定的函数,"close"则为关闭
			*/
            if (text === undefined) {
                return;
            }
            this.opt.is(":hidden") && this.opt.show();
            var T = this, btn = $('<a href=""></a>'), color = color ? color : "";
            if (typeof callback == "string" && callback != "close") {
                //无回调时，第二个参数作为按钮颜色
                color = callback;
                callback = null;
            }
            btn.attr({
                "class": color == "no" ? "" : "nj_btn n_b_" + color
            });
            btn.html("<i>" + text + "</i>");
            this.opt.append(btn);
            this.button.push(btn);
            if (callback) {
                callback = callback == "close" ? function() {
                    T.hide();
                } : callback;
                btn.on("click", function() {
                    callback.call(T);
                    return false;
                });
            }
        },
        show: function(callBack) {
            /*
				显示弹窗
		        @callBack:可选参数，回调函数
		    */
            if (this.self.is(":visible")) {
                return;
            }
            UI.setPos(this.self, this.pos, this.Float);
            //重新计算高度并设置居中 
            this.layer && UI.layer.show();
            this.self.css({
                display: "block",
                "margin-top": "-20px"
            });
            this.self.stop().animate({
                "margin-top": "0",
                opacity: "1"
            }, 420);
            setTimeout(function() {
                callBack && callBack();
            }, 100);
            this.onShow && this.onShow();
        },
        /*
			隐藏弹窗
	        @callBack:可选参数，回调函数
	    */
        hide: function(callBack) {
            if (this.self.is(":hidden")) {
                return;
            }
            var T = this;
            /*
			 * onbeforehide:关闭之前确认，传入一个数组[fn,true/false]
			 * fn返回的布尔值;第二个参数true表示是否只有当fn为true时才关闭窗口,false均关闭
			 */
            if (this.onbeforehide && !this.onbeforehide[0]()) {
                if (this.onbeforehide[1]) {
                    return false;
                }
            }
            //关闭之前确认
            this.self.animate({
                "margin-top": "-20px",
                opacity: "0"
            }, 120, "easeOutExpo", function() {
                T.self.hide();
            });
            setTimeout(function() {
                callBack && callBack();
            }, 100);
            !this.stillLayer && UI.layer.hide();
            this.onHide && this.onHide();
        }
    };
    UI.win.item = {};
    //保存所有弹框实例对象
    UI.win.clear = function(key) {
        //清空弹框对象
        if (key) {
            var win = UI.win.item[key];
            win && clear(win);
        } else {
            for (var i in UI.win.item) {
                clear(UI.win.item[i]);
            }
            UI.win.item = {};
            UI.msg.win = null;
        }
        function clear(win) {
            win.self.remove();
            win = null;
        }
    };
    UI.msg = function() {
        /*
		 * 消息提示框
		 */
        var Win = {};
        return {
            show: function(type, tip, opt) {
                opt = opt || {};
                var T = this, btn = opt.btn, time = opt.time || 1600, C = type == "confirm", tit = C ? "温馨提醒：" : null, w = opt.width || (C ? 400 : "auto"), autoHide = opt.autoHide == false ? false : true, win = Win[type];
                //隐藏其他
                this.hide(type, true);
                this.hide();
                tip = tip || "";
                if (type == "loading") {
                    tip = tip || "正在处理请求,请稍候……";
                } else if (C) {
                    btn = btn || [ [ "确定", function() {
                        win.hide(function() {
                            try {
                                opt.ok();
                            } catch (e) {}
                        });
                    }, "sb" ], [ "取消", "close" ] ];
                }
                if (!win) {
                    win = new UI.win({
                        width: w,
                        bindEsc: false
                    });
                    win.self.addClass("msg_tip_win");
                    win.self.find("div.win_wrap").attr({
                        "class": "win_wrap msg_tip_" + type
                    });
                    win.self.width(w);
                    win.layer = C ? true : false;
                    win.stillLayer = C ? false : true;
                    win.setCon(tit, '<div class="con clearfix"><i class="tip_ico"></i><span class="tip_con"></span></div>');
                    new UI.ico(win.con.find("i.tip_ico"), {
                        type: C ? "warn" : type
                    });
                    Win[type] = win;
                }
                if (!btn) {
                    win.opt.hide().empty();
                }
                win.setCon(null, null, btn);
                win.con.find(".tip_con").html(tip);
                win.show();
                if (C) {
                    win.button[0].focus();
                }
                //自动隐藏
                this.timeout = clearTimeout(T.timeout);
                if (autoHide && type != "confirm" && type != "loading") {
                    this.timeout = setTimeout(function() {
                        win.hide();
                    }, time);
                }
                if (opt.reload) {
                    T.timeout = clearTimeout(T.timeout);
                    setTimeout(function() {
                        if (opt.reload === true) {
                            window.location.reload();
                        } else if (typeof opt.reload == "string") {
                            window.location.href = opt.reload;
                        }
                    }, 1500);
                }
            },
            hide: function(type, now) {
                if (type && Win[type]) {
                    (now ? Win[type].self : Win[type]).hide();
                } else {
                    for (var i in Win) {
                        Win[i].hide();
                        now && Win[i].self.hide();
                    }
                }
            }
        };
    }();
    UI.Switch = function(id, opt) {
        /*
		 * switch原型超类|幻灯片、选项卡等
		 * @id:容器id
		 * 子类不能通过该构造函数传递参数，所以使用init方法来传递
		 */
        this.box = $("#" + id);
        this.init(id, opt);
    };
    UI.Switch.prototype = {
        init: function(id, opt) {
            this.box = $("#" + id);
            if (!this.box.length) {
                return;
            }
            this.M = this.box.find(".nj_s_menu").first();
            this.menu = this.M.find(".nj_s_m");
            this.C = this.box.find(".nj_s_con").first();
            this.con = this.C.children(".nj_s_c");
            this.length = this.con.length;
            if (!this.length) {
                return;
            }
            this.opt = opt || {};
            this.onChange = this.opt.onChange;
            this.index = this.opt.firstIndex || 0;
            this.bind();
        },
        bind: function() {
            var T = this, A, m;
            this.menu.on("tap", function() {
                m = $(this);
                if (m.hasClass("current")) {
                    return false;
                }
                T.change(m.index());
                return false;
            }).mouseout(function() {
                A = clearTimeout(A);
            });
            this.change(this.index);
        },
        change: function(index) {
            index = index > this.length - 1 ? 0 : index;
            index = index < 0 ? this.length - 1 : index;
            if (this.opt.rule) {
                this.opt.rule.call(this, index);
            } else {
                this.con.eq(index).show().siblings().hide();
                this.menu.eq(index).addClass("current").siblings().removeClass("current");
            }
            this.index = index;
            if (this.onChange) {
                this.onChange.call(this, index);
            }
        }
    };
    UI.slide = function(id, opt) {
        /*
		 * switch扩展: slide幻灯片
		 */
        this.init(id, opt);
        if (!this.box.length) {
            return;
        }
        this.getIndexNum = this.opt.getIndexNum == true ? true : false;
        this.getIndexNum && this.getNum();
        this.play = null;
        this.time = this.opt.time || 5e3;
        this.auto = this.opt.auto == false ? false : true;
        this.start(true);
    };
    UI.slide.prototype = new UI.Switch();
    UI.slide.prototype.constructor = UI.slide;
    UI.slide.prototype.getNum = function() {
        var list = "";
        for (var i = 1; i <= this.length; i++) {
            list += '<li class="nj_s_m">' + i + "</li>";
        }
        this.M.append(list);
        this.menu = this.M.find(".nj_s_m");
        this.bind();
    };
    UI.slide.prototype.rule = function(index) {
        //切换规则		
        this.con.eq(index).fadeIn(300).siblings().hide();
        this.menu.eq(index).addClass("current").siblings().removeClass("current");
        this.index = index;
    };
    UI.slide.prototype.start = function(startNow) {
        //自动播放
        var T = this;
        this.auto && this.length > 1 && s();
        startNow && T.change(T.index);
        function s() {
            window.clearInterval(T.play);
            T.play = window.setInterval(function() {
                T.change(++T.index);
            }, T.time);
        }
    };
    UI.ico = function(dom, opt) {
        /*
		 * canvas/vml绘制的图标
		 */
        if (isNew = instaceofFun(this, arguments)) {
            return isNew;
        }
        opt = $.extend(UI.config.ico || {}, opt);
        this.hasCanvas = !!document.createElement("canvas").getContext;
        this.type = opt.type || "ok";
        this.ico = $('<i class="nj_ico n_i_' + this.type + '"></i>');
        dom = getDom(dom);
        dom && dom.length && dom.empty();
        this.obj = dom || $("body:first");
        this.obj.append(this.ico);
        this.canvas = null;
        this.ctx = null;
        this.width = opt.width || this.ico.width();
        this.height = opt.height || this.ico.height();
        this.ico.css("visibility", "hidden");
        if (!this.width || !this.height) {
            return;
        }
        this.color = opt.color || this.ico.css("color");
        this.bgcolor = opt.bgcolor || this.ico.css("background-color");
        this.ico.removeAttr("style");
        this.ico.css({
            background: "none",
            width: this.width,
            height: this.height
        });
        this.createSpace();
    };
    UI.ico.prototype = {
        createSpace: function() {
            var d = document;
            if (this.hasCanvas) {
                this.canvas = d.createElement("canvas");
                this.ctx = this.canvas.getContext("2d");
                this.canvas.width = this.width;
                this.canvas.height = this.height;
                this.ico.append(this.canvas);
            } else {
                if (!UI.ico["iscreatevml"]) {
                    //只创建 一次vml
                    var s = d.createStyleSheet(), shapes = [ "polyline", "oval", "arc", "stroke", "shape" ];
                    d.namespaces.add("v", "urn:schemas-microsoft-com:vml");
                    //创建vml命名空间
                    for (var i = 0; i < shapes.length; i++) {
                        s.addRule("v\\:" + shapes[i], "behavior:url(#default#VML);display:inline-block;");
                    }
                    UI.ico["iscreatevml"] = true;
                }
                this.ico.css("position", "relative");
            }
            this.draw();
        },
        drawLine: function(point, fill, border) {
            var i, n = point.length;
            if (this.hasCanvas) {
                this.ctx.beginPath();
                this.ctx.moveTo(point[0], point[1]);
                for (i = 2; i < n; i += 2) {
                    this.ctx.lineTo(point[i], point[i + 1]);
                }
                this.ctx.stroke();
                fill && this.ctx.fill();
            } else {
                var path = "", v = "";
                for (i = 0; i < n; i += 2) {
                    path += point[i] + "," + point[i + 1] + " ";
                }
                v += '<v:polyline strokeWeight="' + border + '" filled="' + (fill ? "true" : "false") + '" class="polyline" strokecolor="' + this.color + '" points="' + path + '" ';
                if (fill) {
                    v += 'fillcolor="' + this.color + '"';
                }
                v += "/>";
                $(this.canvas).after(v);
            }
        },
        draw: function() {
            var startAngle, endAngle, border, point, p = Math.PI, width = this.width, height = this.height, color = this.color, bgcolor = this.bgcolor, ctx = this.ctx, canvas = this.canvas, type = this.type, d = document, T = this;
            if (type == "loading") {
                border = 3;
                if (this.hasCanvas) {
                    startAngle = p / 180;
                    endAngle = 200 * p / 180;
                    ctx.strokeStyle = this.color;
                    ctx.lineWidth = border;
                    window.setInterval(function() {
                        ctx.clearRect(0, 0, width, height);
                        startAngle += .1;
                        endAngle += .1;
                        ctx.beginPath();
                        ctx.arc(width / 2, height / 2, width / 2 - border + 1, startAngle, endAngle, false);
                        ctx.stroke();
                    }, 15);
                } else {
                    startAngle = 0;
                    border--;
                    this.canvas = d.createElement('<v:arc class="oval" filled="false" style="left:1px;top:1px;width:' + (width - border * 2 + 1) + "px;height:" + (height - border * 2 + 1) + 'px" startangle="0" endangle="200"></v:arc>');
                    $(this.canvas).append('<v:stroke weight="' + border + '" color="' + color + '"/>');
                    this.ico.append(this.canvas);
                    window.setInterval(function() {
                        startAngle += 6;
                        startAngle = startAngle > 360 ? startAngle - 360 : startAngle;
                        T.canvas.rotation = startAngle;
                    }, 15);
                }
            } else if (type == "ok" || type == "warn" || type == "error" || type == "close") {
                if (this.hasCanvas) {
                    ctx.beginPath();
                    ctx.fillStyle = bgcolor;
                    ctx.arc(width / 2, height / 2, width / 2, p, 3 * p, false);
                    ctx.fill();
                    ctx.fillStyle = color;
                    ctx.strokeStyle = color;
                } else {
                    this.canvas = d.createElement('<v:oval class="oval" fillcolor="' + bgcolor + '" style="width:' + (width - 1) + "px;height:" + (height - 1) + 'px;"></v:oval>');
                    $(this.canvas).append('<v:stroke color="' + bgcolor + '"/>');
                    this.ico.append(this.canvas);
                }
                if (type == "ok") {
                    point = [ .26 * width, .43 * height, .45 * width, .59 * height, .71 * width, .33 * height, .71 * width, .47 * height, .45 * width, .73 * height, .26 * width, .57 * height ];
                    this.drawLine(point, true);
                } else if (type == "warn") {
                    if (this.hasCanvas) {
                        ctx.beginPath();
                        ctx.arc(width * .5, height * .73, width * .07, p, 3 * p, false);
                        ctx.stroke();
                        ctx.fill();
                    } else {
                        this.ico.append('<v:oval class="oval" fillcolor="#fff" style="width:' + height * .16 + "px;height:" + height * .14 + "px;left:" + height * ($.browser("ie6 ie7") ? .43 : .4) + "px;top:" + height * .68 + 'px"><v:stroke color="#fff"/></v:oval>');
                    }
                    point = [ .45 * width, .22 * height, .55 * width, .22 * height, .55 * width, .54 * height, .45 * width, .54 * height ];
                    this.drawLine(point, true);
                } else if (type == "error" || type == "close") {
                    if (!this.hasCanvas) {
                        width = width * .95;
                        height = height * .95;
                    }
                    point = [ .33 * width, .3 * height, .5 * width, .46 * height, .68 * width, .3 * height, .72 * width, .34 * height, .55 * width, .52 * height, .71 * width, .68 * height, .68 * width, .73 * height, .5 * width, .56 * height, .34 * width, .72 * height, .29 * width, .69 * height, .46 * width, .51 * height, .29 * width, .34 * height ];
                    this.drawLine(point, true);
                    function bind() {
                        if (T.hasCanvas) {
                            T.ico.hover(function() {
                                ctx.clearRect(0, 0, width, height);
                                ctx.beginPath();
                                ctx.fillStyle = color;
                                ctx.strokeStyle = bgcolor;
                                ctx.arc(width / 2, height / 2, width / 2, p, 3 * p, false);
                                ctx.fill();
                                ctx.stroke();
                                ctx.fillStyle = bgcolor;
                                T.drawLine(point, true);
                            }, function() {
                                ctx.clearRect(0, 0, width, height);
                                ctx.beginPath();
                                ctx.fillStyle = bgcolor;
                                ctx.strokeStyle = bgcolor;
                                ctx.arc(width / 2, height / 2, width / 2, p, 3 * p, false);
                                ctx.fill();
                                ctx.stroke();
                                ctx.fillStyle = color;
                                ctx.strokeStyle = color;
                                T.drawLine(point, true);
                            });
                        } else {
                            T.ico.hover(function() {
                                var a = $(this).find(".oval")[0], b = $(this).find(".polyline")[0];
                                a.fillcolor = a.strokecolor = color;
                                b.fillcolor = b.strokecolor = bgcolor;
                            }, function() {
                                var a = $(this).find(".oval")[0], b = $(this).find(".polyline")[0];
                                a.fillcolor = a.strokecolor = bgcolor;
                                b.fillcolor = b.strokecolor = color;
                            });
                        }
                    }
                    type == "close" && bind();
                }
            } else {
                //自定义绘图方法
                this["Draw" + type] && this["Draw" + type]();
            }
        }
    };
    UI.ico.batch = function(obj, opt) {
        /*
		 * 批量生成图标
		 */
        var i, m, len, j, ico = {}, T = this;
        for (i in obj) {
            m = obj[i];
            len = m.length;
            if (len > 1) {
                for (j = 0; j < len; j++) {
                    new T(i, m.eq(j), opt);
                }
            } else if (len == 1) {
                new T(i, m, opt);
            } else {
                continue;
            }
            ico[i] = m;
        }
        return ico;
    };
    UI.ico.add = function(type, draw) {
        /*
		 * 添加自定义绘图方法
		 */
        if (!UI.ico.prototype["Draw" + type]) {
            UI.ico.prototype["Draw" + type] = draw;
        }
    };
    UI.menu = function(obj, opt) {
        /*
		 * 下拉菜单，动态创建html
		 */
        if (isNew = instaceofFun(this, arguments)) {
            return isNew;
        }
        //if(!obj||!obj.length){return;}
        this.opt = opt = $.extend(UI.config.menu, opt);
        this.obj = obj = getDom(obj);
        this.menu = null;
        this.content = opt.content || "";
        //菜单内容
        this.align = opt.align || "left";
        //对齐方式
        this.mode = opt.mode || "tap";
        this.offset = opt.offset || [ 0, 0 ];
        this.autoWidth = opt.autoWidth === false ? false : true;
        //this.pos = this.offset[2] && this.offset[2].length ? this.offset[2] : this.obj;
        this.now = obj ? this.obj.eq(0) : null;
        this.agent = opt.agent === true ? true : false;
        //是否为事件代理模式
        this.disable = false;
        //是否禁用菜单
        this.init();
    };
    UI.menu.prototype = {
        init: function() {
            this.mode = this.mode == "focus" ? "focus click" : this.mode;
            this.menu = $('<div class="nj_menu"><div class="wrap clearfix"></div></div>');
            $("body").append(this.menu);
            this.setCon();
            this.bind();
            if (this.opt.className) {
                this.menu.addClass(this.opt.className);
            }
        },
        bind: function() {
            var T = this, top, left, A, B;
            if (!this.agent) {
                this.obj.on(this.mode, function(e) {
                    $.stopBubble(e);
                    return show($(this));
                });
                if (this.mode == "focus") {
                    this.obj.on("blur", function() {
                        A = window.clearTimeout(A);
                        hide();
                    });
                }
            }
            if (this.mode == "tap") {
                this.menu.on("tap", function(e) {
                    B = window.clearTimeout(B);
                    $.stopBubble(e);
                });
                $(document).on("tap", function() {
                    T.menu.is(":visible") && hide();
                });
            }
            function show(pos) {
                if (T.disable) {
                    return false;
                }
                pos = pos || T.obj;
                if (T.mode == "click" && T.menu.is(":visible")) {
                    if (T.now.is(pos)) {
                        hide();
                        return false;
                    }
                    hide(true);
                } else {
                    B = window.clearTimeout(B);
                }
                T.now = pos;
                pos.addClass("nj_menu_hover");
                //.find('.nj_arrow').addClass('n_a_top');
                T.setPos();
                T.opt.onShow && T.opt.onShow.call(T, pos);
                return false;
            }
            function hide() {
                T.now.removeClass("nj_menu_hover");
                //.find('.nj_arrow').removeClass('n_a_top');
                if (S != true) {
                    T.menu.hide();
                }
                T.opt.onHide && T.opt.onHide.call(T, T.now);
            }
            this.show = show;
            this.hide = hide;
            $(window).on("scroll resize", function() {
                T.menu.is(":visible") && T.setPos();
            });
            this.menu.find(".close").on("click", function(e) {
                T.hide();
                $.stopBubble(e);
            });
            (function() {
                //为列表项添加自定义事件
                var bind = T.opt.onSelect, i, m;
                if (!bind) {
                    return;
                }
                for (i in bind) {
                    m = T.menu.find("[" + i + "]");
                    if (m.length) {
                        (function(i) {
                            m.bind("click", function(e) {
                                bind[i].call(T, $(this), e);
                                return false;
                            });
                        })(i);
                    }
                }
            })();
        },
        setPos: function() {
            var T = this, ph = this.now.outerHeight(), pt = this.now.offset().top, pl = this.now.offset().left, left = pl + this.offset[0], top = pt + ph + this.offset[1];
            if (this.align == "right") {
                left -= this.menu.outerWidth() - this.now.outerWidth();
            }
            this.menu.removeAttr("style").css({
                left: left,
                top: top,
                "z-index": "999",
                display: "block"
            });
            if (!this.autoWidth) {
                this.menu.width(this.now.outerWidth());
            }
            (function() {
                var h = T.menu.outerHeight(), win = $(window), stop = win.scrollTop(), H = $(window).height();
                if (top + h - stop > H) {
                    top = pt - h;
                    if (top < 0) {
                        T.menu.css({
                            top: 0,
                            overflow: "auto",
                            height: pt - 2 - T.offset[1]
                        });
                        top = 0;
                    } else {
                        T.menu.css({
                            top: top - T.offset[1]
                        });
                    }
                }
            })();
        },
        setCon: function(con) {
            con = con || this.content;
            this.menu.children(".wrap").empty().append(con);
        }
    };
    return UI;
});
