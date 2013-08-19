/*
 * 图像热区绘制工具
 */
define("nojs/module/imghot", [ "nojs/module/drag", "nojs/module/codelight" ], function(require, $, ui) {
    var drag = require("nojs/module/drag"), codeLight = require("nojs/module/codelight"), imgHot = function(id, opt) {
        opt = opt || {};
        this.box = $("#" + id);
        if (!this.box.length) {
            return;
        }
        this.btn = opt.btn;
        this.wrap = this.box.find(".wrap");
        this.imgWrap = this.box.find(".img_wrap");
        this.codeWrap = this.box.find(".code_wrap");
        this.arr = null;
        this.img = null;
        this.select = null;
        this.rate = 1;
        //图片缩放比率
        this.state = this.box.find(".state");
        this.setMode = this.state.find(".mode");
        //切换模式按钮
        this.prevBox = this.wrap.find(".preview");
        this.isBInd = false;
        this.init();
    };
    imgHot.prototype = {
        init: function(isFirst) {
            var T = this;
            this.img = this.imgWrap.children("img");
            if (!this.img.length) {
                return;
            }
            //this.setImg();
            this.arr = [ '<script type="text/templete" code="html" key="Map">', '<img src="" alt="" usemap="#Map" />', '<map name="Map" id="Map">', "</map></script>" ];
            this.codeWrap.html(this.arr.join("\n"));
            this.img.bind("click blur", function() {
                T.choose();
            }).bind("keydown", function(e) {
                //绑定键盘事件
                var hot = T.imgWrap.find(".current"), s = true;
                if (!hot.length) {
                    return;
                }
                switch (e.keyCode) {
                  case 37:
                    //left
                    parseInt(hot.css("left")) > 0 ? hot.animate({
                        left: "-=1"
                    }, 0) : s = false;
                    break;

                  case 38:
                    //up
                    parseInt(hot.css("top")) > 0 ? hot.animate({
                        top: "-=1"
                    }, 0) : s = false;
                    break;

                  case 39:
                    //right
                    parseInt(hot.css("left")) + hot.width() < T.imgWrap.width() ? hot.animate({
                        left: "+=1"
                    }, 0) : s = false;
                    break;

                  case 40:
                    //down
                    parseInt(hot.css("top")) + hot.height() < T.imgWrap.height() ? hot.animate({
                        top: "+=1"
                    }, 0) : s = false;
                    break;

                  case 46:
                    //del
                    T.del(hot);
                    s = false;
                    break;

                  default:
                    s = false;
                    break;
                }
                if (s) {
                    $.stopDefault(e);
                    T.showCode(hot, true);
                }
            }).bind("keyup", function(e) {});
            this.draw();
            !this.isBInd && this.bind();
        },
        bind: function() {
            var T = this;
            this.isBInd = true;
            //设置热区可拖动
            this.drag = new drag(this.imgWrap, null, {
                delegat: true,
                limit: this.imgWrap
            });
            //拖拽结束回调
            this.drag.UpEvent = function() {
                T.showCode(this.drag, true);
            };
            //选中选区
            this.imgWrap.bind("click", function(e) {
                var t = e.target, m = $(t), index, area;
                $.stopBubble(e);
                if (t.tagName.toLowerCase() == "div" && m.hasClass("hotarea")) {
                    T.choose(m);
                }
                T.img.focus();
            });
            this.codeWrap.bind("click", function(e) {
                if ($(this).find(".edit").length) {
                    return;
                }
                //编辑状态 不关联选中
                var t = e.target, m = $(t), index, area;
                $.stopBubble(e);
                if (t.tagName.toLowerCase() == "li" || m.closest("li").length) {
                    m.closest("li").length && (m = m.closest("li"));
                    index = m.index();
                    if (index > 1 && m.next("li").length) {
                        T.choose(T.imgWrap.find(".hotarea").eq(index - 2));
                    }
                }
            });
            //切换模式
            this.setMode.click(function() {
                if (T.box.hasClass("hot_prev_mode")) {
                    $(this).html("<i>预览</i>");
                    T.box.removeClass("hot_prev_mode");
                } else {
                    $(this).html("<i>编辑</i>");
                    T.box.addClass("hot_prev_mode");
                    T.preview();
                }
                return false;
            });
        },
        preview: function() {
            //预览模式 
            this.prevBox.empty();
            var img = this.img.clone().removeAttr("style"), id = "img_hot_map", i, n = this.arr.length - 1, list = '<map name="' + id + '" id="' + id + '">';
            img.attr({
                usemap: id
            });
            for (i = 3; i < n; i++) {
                list += this.arr[i];
            }
            list += "</map>";
            this.prevBox.append(img).append(list);
        },
        setImg: function() {
            //缩放图片,限制最大宽高
            var w = this.wrap.width(), h = this.wrap.height(), k = w / h, W = this.img.width(), H = this.img.height(), K = W / H, b;
            if (K > k && W > w) {
                b = w / W;
                W = w;
                this.img.width(w);
                H = this.img.height();
            } else if (K <= k && H >= h) {
                b = h / H;
                H = h;
                this.img.height(h);
                W = this.img.width();
            }
            this.rate = b;
            this.state.find(".rate").html("图片缩放比例：" + (b * 100).toFixed(2) + "%");
            this.imgWrap.css({
                "margin-left": -W / 2,
                "margin-top": -H / 2
            });
        },
        choose: function(area) {
            //选中该选区
            if (area) {
                var index = area.index();
                area.addClass("current").find(".point").show().end().siblings().removeClass("current").find(".point").hide();
                this.codeWrap.find("li").eq(index + 1).addClass("current").siblings().removeClass("current");
                this.img.focus();
            } else {
                //取消选中
                this.imgWrap.children("").removeClass("current").find(".point").hide();
                this.codeWrap.find("li").removeClass("current");
            }
        },
        del: function(area) {
            //删除选区
            var index = area.index();
            this.codeWrap.find("li").eq(index + 1).remove();
            this.arr.splice(index + 2, 1);
            area.remove();
        },
        draw: function() {
            if (!this.img.length) {
                return;
            }
            var T = this, d = $(document), mouseLast, mouseNow, winPos, w, h;
            this.select = $("body").append('<div class="imghot_select"></div>').find(".imghot_select");
            this.img.bind("mousedown.imghot", function(e) {
                $.stopDefault(e);
                if ($(e.target).hasClass("hotarea")) {
                    return;
                }
                mouseLast = {
                    x: e.clientX,
                    y: e.clientY
                };
                winPos = {
                    left: $(window).scrollLeft(),
                    top: $(window).scrollTop()
                };
                T.select.css({
                    left: mouseLast.x,
                    top: mouseLast.y
                });
                T.select.hide();
                d.bind("mousemove.imghot", function(e) {
                    $.stopDefault(e);
                    mouseNow = {
                        x: e.clientX + winPos.left,
                        y: e.clientY + winPos.top
                    };
                    w = mouseNow.x - mouseLast.x;
                    h = mouseNow.y - mouseLast.y;
                    if (w < 0) {
                        T.select.css({
                            left: mouseNow.x
                        });
                    }
                    if (h < 0) {
                        T.select.css({
                            top: mouseNow.y
                        });
                    }
                    T.select.css({
                        width: Math.abs(w),
                        height: Math.abs(h)
                    });
                    T.select.show();
                }).bind("mouseup.imghot", function(e) {
                    d.unbind("mousemove.imghot mouseup.imghot");
                    if (T.select.is(":visible")) {
                        var w = T.select.outerWidth(), h = T.select.outerHeight(), l = T.select.offset().left - T.imgWrap.offset().left, t = T.select.offset().top - T.imgWrap.offset().top, hot = $(document.createElement("div")).attr({
                            "class": "hotarea",
                            isdrag: "true"
                        }), W = T.img.width(), H = T.img.height();
                        hot.append('<div class="point p_tl"></div><div class="point p_tr"></div><div class="point p_bl"></div><div class="point p_br"></div>');
                        if (l < 0) {
                            w += l;
                            l = 0;
                        }
                        if (t < 0) {
                            h += t;
                            t = 0;
                        }
                        w = w + l > W ? W - l : w;
                        h = h + t > H ? H - t : h;
                        hot.css({
                            left: l,
                            top: t,
                            width: w,
                            height: h
                        });
                        T.imgWrap.append(hot);
                        T.showCode(hot);
                        //生成代码
                        T.select.hide();
                    }
                });
            });
        },
        showCode: function(m, isEdit) {
            //生成代码
            var w, h, l, t, last = this.arr.pop(), point, area, old, a, i;
            w = m.width();
            h = m.height();
            l = parseInt(m.css("left"));
            t = parseInt(m.css("top"));
            point = Math.round(l / this.rate) + "," + Math.round(t / this.rate) + "," + Math.round((w + l) / this.rate) + "," + Math.round((h + t) / this.rate);
            if (isEdit) {
                //更改坐标
                old = this.arr[m.index() + 2].split(" ");
                //console.log(this.codeWrap.find('li').eq(m.index()+1).html());
                for (i = 0; i < old.length; i++) {
                    a = old[i].split("=");
                    if (a[1] && a[0] == "coords") {
                        a[1] = '"' + point + '"';
                        old[i] = a.join("=");
                        break;
                    }
                }
                old = old.join(" ");
                this.arr[m.index() + 2] = old;
            } else {
                this.arr.push('	<area shape="rect" coords="' + point + '" href="" alt="" />');
            }
            this.arr.push(last);
            this.codeWrap.html(this.arr.join("\n"));
            new codeLight({
                parent: this.codeWrap
            });
            this.choose(m);
        }
    };
    return imgHot;
});

/*
 * 对象拖拽
 */
define([], function(require, $) {
    $.addCss(".addIndex{z-index:99999}");
    var drag = function(drag, move, opt) {
        /*
		 * 元素拖拽
		 * drag:拖拽对象，jquery对象
		 * move:拖动可控制区域，不传则整个拖拽对象都可拖动
		 */
        this.drag = drag;
        //拖拽对象
        this.opt = opt = opt || {};
        this.move = move ? move : drag;
        //拖拽控制区
        this.delegat = opt.delegat === true ? true : false;
        //设置一个区域使用事件委托使其内部元素可拖动
        this.setDrag = opt.setDrag;
        //设置一个或一组对象为一个拖拽整体，使用于多个对象合并
        this.moveing = false;
        //拖动状态
        this.onDragDown = null;
        //鼠标按下触发事件
        this.onDragStart = null;
        //开始拖拽事件
        this.MoveEvent = null;
        //鼠标移动触发事件
        this.UpEvent = null;
        //鼠标松开触发事件
        this.dragLastPos = [];
        //对象初始位置
        this.dragNowPos = [];
        //对象当前位置
        this.mouseLastPos = {};
        //鼠标初始位置
        this.disable = false;
        //是否禁用
        this.limit = opt.limit;
        //范围限制区域 对象
        this.wrap = opt.wrap;
        //当drag父元素中存在position属性为非static时，设置为其wrap对象,让drag相对于wrap定位
        this.overflow = opt.overflow;
        this.A = null;
        this.delay = this.opt.delay || 6;
        if (!this.delegat) {
            if (move) {
                this.move.css("cursor", "move");
            } else {
                this.drag.css("cursor", "move");
            }
        }
        var T = this;
        //绑定鼠标按下事件
        this.move.bind("mousedown.drag", function(e) {
            T.DragDown(e);
        });
    };
    drag.prototype = {
        //鼠标按下
        DragDown: function(e) {
            if (this.disable) {
                return false;
            }
            e = e || window.event;
            var T = this, tag = $(e.target), s, m, has, i, len, x, y, w, h;
            if (this.delegat) {
                if (tag.attr("isdrag") || tag.attr("isdragmove")) {
                    this.drag = tag.attr("isdragmove") ? tag.closest("[isdrag]") : tag;
                } else {
                    this.drag = null;
                }
            }
            if (!this.drag || !this.drag.length) {
                return;
            }
            if (this.onDragDown && this.onDragDown.call(this) == false) {
                return false;
            }
            this.moveing = true;
            //拖动状态
            this.dragNowPos = [];
            //清空上次位置
            this.dragLastPos = [];
            this.maxSize = {
                L: [],
                //最左left
                T: [],
                //最上top,
                B: [],
                //最下边界,
                R: [],
                //最右边界
                W: null,
                //总宽度
                H: null
            };
            //当有多个对象一起移动并且有边界限制时 设置this.group可只限制部分对象不超出边界
            this.group = this.group || this.drag;
            this.drag.addClass("addIndex");
            for (i = 0, len = this.drag.length; i < len; i++) {
                m = this.drag.eq(i);
                s = m.css("position") === "static";
                x = s ? m.offset().left : parseInt(m.css("left"), 10) || 0;
                y = s ? m.offset().top : parseInt(m.css("top"), 10) || 0;
                if (this.wrap && this.wrap.length) {
                    x -= this.wrap.offset().left - this.wrap.scrollLeft();
                    y -= this.wrap.offset().top - this.wrap.scrollTop();
                }
                w = m.outerWidth();
                h = m.outerHeight();
                this.dragLastPos.push({
                    //拖拽对象位置初始化
                    x: x,
                    y: y
                });
                //m.data('dragLastPos',this.dragLastPos);
                s && m.css({
                    position: "absolute"
                });
                m.css({
                    left: x,
                    top: y
                });
                if (this.group && !m.is(this.group)) {
                    continue;
                }
                this.maxSize.L.push(x);
                this.maxSize.T.push(y);
                this.maxSize.R.push(x + w);
                this.maxSize.B.push(y + h);
            }
            $.stopDefault(e);
            //取出边界值   |单个对象时为其自身边界|
            //多个对象时为最大边界   可取多个对象一部分作为最大边界 this.group
            this.maxSize.L = Math.min.apply(null, this.maxSize.L);
            this.maxSize.T = Math.min.apply(null, this.maxSize.T);
            this.maxSize.W = Math.max.apply(null, this.maxSize.R) - this.maxSize.L;
            this.maxSize.H = Math.max.apply(null, this.maxSize.B) - this.maxSize.T;
            if (this.limit) {
                //有边界限制时
                this.maxSize.l = this.limit.offset().left + parseInt(this.limit.css("border-left-width"));
                this.maxSize.t = this.limit.offset().top + parseInt(this.limit.css("border-top-width"));
                if (this.limit.css("position") !== "static" && this.limit.find(m).length) {
                    this.maxSize.l = this.maxSize.t = 0;
                }
                //最大可移动宽高
                this.maxSize.w = this.limit.innerWidth() - this.maxSize.W + this.maxSize.l;
                this.maxSize.h = this.limit.innerHeight() - this.maxSize.H + this.maxSize.t;
                if (this.overflow) {
                    //边界溢出
                    this.maxSize.l -= this.overflow;
                    this.maxSize.t -= this.overflow;
                    this.maxSize.w += this.overflow;
                    this.maxSize.h += this.overflow;
                }
            }
            this.mouseLastPos = {
                //鼠标最后位置初始化
                x: e.clientX,
                y: e.clientY
            };
            if (this.onDragStart && this.onDragStart.call(this) == false) {
                return false;
            }
            $(document).bind("mousemove.drag", function(e) {
                T.DragMove(e);
            }).bind("mouseup.drag", function(e) {
                T.DragUp(e);
            });
        },
        //鼠标移动
        DragMove: function(e) {
            if (this.moveing && !this.disable && this.drag) {
                e = e || window.event;
                $.stopDefault(e);
                var i, m, pos, x, y, c = {
                    //鼠标偏移量
                    x: e.clientX - this.mouseLastPos.x,
                    y: e.clientY - this.mouseLastPos.y
                }, cx = c.x, cy = c.y, len = this.drag.length, T = this;
                //边界限制
                if (this.limit) {
                    x = this.maxSize.L + cx;
                    y = this.maxSize.T + cy;
                    c.x = x < this.maxSize.l ? this.maxSize.l - this.maxSize.L : cx;
                    c.x = x > this.maxSize.w ? this.maxSize.w - this.maxSize.L : c.x;
                    c.y = y < this.maxSize.t ? this.maxSize.t - this.maxSize.T : cy;
                    c.y = y > this.maxSize.h ? this.maxSize.h - this.maxSize.T : c.y;
                }
                if (this.setOffset) {
                    c = this.setOffset.call(this, c);
                }
                cx = c.x;
                cy = c.y;
                for (i = 0; i < len; i++) {
                    m = this.drag.eq(i);
                    pos = this.dragLastPos[i];
                    //拖拽对象座标更新(变量)
                    this.dragNowPos[i] = {
                        x: pos.x + cx,
                        y: pos.y + cy
                    };
                    m.css({
                        //拖拽对象座标更新(位置)
                        left: this.dragNowPos[i].x,
                        top: this.dragNowPos[i].y
                    });
                }
                if (this.MoveEvent) {
                    //函数节流处理
                    clearTimeout(T.A);
                    T.A = setTimeout(function() {
                        T.MoveEvent.call(T, {
                            x: cx,
                            y: cy,
                            w: T.maxSize.W,
                            h: T.maxSize.H
                        });
                    }, T.delay);
                }
            }
        },
        //鼠标松开
        DragUp: function(e) {
            if (!this.disable) {
                var T = this;
                this.moveing = false;
                //拖动状态	
                $(document).off("mousemove.drag mouseup.drag");
                //注销鼠标事件
                this.drag.removeClass("addIndex");
                T.A = clearTimeout(T.A);
                this.UpEvent && this.UpEvent.call(this);
                this.maxSize = this.dragLastPos = this.dragNowPos = null;
                $.stopDefault(e);
            }
        }
    };
    return drag;
});

/**
 * nolure@gmail.com
 * 2011-11-9
 * code light
 */
define([], function(require, $) {
    var codeLight = function(opt) {
        this.opt = opt = opt || {};
        this.parent = opt.parent || "body";
        this.Box = null;
        this.code = null;
        this.init();
    };
    codeLight.prototype = {
        init: function() {
            var m, code, box, type, C = this.parent.find("script[code]"), s = /\s{4}/, item, first, last, key;
            //为每段代码设置特殊关键字
            if (!C.length) {
                return;
            }
            for (var i = 0; i < C.length; i++) {
                m = C.eq(i);
                type = m.attr("code");
                key = m.attr("key");
                if (key) {
                    key = key.split(",");
                }
                code = m.html() || m.val();
                if (code.replace(/\s/g, "") == "") {
                    continue;
                }
                code = this.str(code, type);
                code = setKey(key, code);
                m.css({
                    display: "none"
                }).after('<pre title="双击编辑" class="codelight_box"><ol class="rs_item" tabindex="-1">' + code + '</ol><p class="open">+code</p></pre>');
                box = m.next(".codelight_box");
                box.find(".rs_item").on("dblclick", function() {
                    if (box.hasClass("code_hide")) {
                        return false;
                    }
                    $(this).attr({
                        contentEditable: true
                    }).addClass("edit");
                }).on("blur", function() {
                    $(this).removeAttr("contentEditable").removeClass("edit");
                });
                box.find(".note .key").removeClass("key");
                //去掉注释内的自定义关键字				
                delLine(box);
                item = box.find(".rs_item li");
                delTab(item);
                this.setOpt(box);
                m.remove();
            }
            function delLine(box) {
                //去掉首尾空行
                item = box.find(".rs_item li");
                first = item.first();
                last = item.last();
                if (first.html().replace(/\s/g, "") == "") {
                    first.remove();
                }
                if (last.html().replace(/\s/g, "") == "") {
                    last.remove();
                }
                item = box.find(".rs_item li");
                if (item.first().html().replace(/\s/g, "") == "") {
                    delLine(box);
                }
            }
            function delTab(item) {
                //去除多余的整体tab缩进
                first = item.first();
                if (s.test(first.html())) {
                    var m, i, n = item.length;
                    for (i = 0; i < n; i++) {
                        m = item.eq(i);
                        m.html(m.html().replace(s, ""));
                    }
                    if (s.test(first.html())) {
                        delTab(item);
                    }
                }
            }
            function setKey(key, code) {
                //自定义关键字高亮
                if (!key || !key.length) {
                    return code;
                }
                for (var j = 0; j < key.length; j++) {
                    code = code.replace(eval("/(" + key[j] + ")/g"), '<b class="key">$1</b>');
                }
                return code;
            }
        },
        str: function(str, type) {
            var r = {
                L: /</g,
                G: />/g,
                L1: /(&lt;[\/]?)/g,
                G1: /&gt;/g,
                E: /\n/g,
                tab: /\t/g,
                //html 属性，标签，注释
                htmlProperty: /(class|style|id|title|alt|src|align|href|rel|rev|name|target|content|http-equiv|onclick|onchange|onfocus|onmouseover|onmouseout|type|for|action|value)=/g,
                htmlTag: /(&lt;[\/]?)(html|body|title|head|meta|link|script|base|style|object|iframe|h1|h2|h3|h4|h5|h6|p|blockquote|pre|address|img|a|ol|div|ul|li|dl|dd|dt|ins|del|cite|q|fieldset|form|label|legend|input|button|select|textarea|table|caption|tbody|tfoot|thead|tr|td|th|span|strong|em|i|b|option)(\s|&gt;)/g,
                htmlNote: /(&lt;\!--([\s\S]*?)--&gt;)/gm,
                //html注释
                //js
                jsKey: /(var|new|function|return|this|if|else|do|while|for|true|false)([\s\({;.]+)/g,
                jsNote: /(\/\/.*)[\r\n]/g,
                //单行注释
                jsNoteP: /(\/\*([\s\S]*?)\*\/)/gm,
                //多行注释
                S: /&/g
            };
            str = str.replace(r.S, "&amp;");
            //替换&特殊字符
            //替换所有<>标签
            str = str.replace(r.L, "&lt;").replace(r.G, "&gt;");
            //添加高亮标签
            if (type == "html") {
                str = str.replace(r.htmlProperty, '<i class="property">$1</i>=');
                //属性
                str = str.replace(r.htmlTag, '$1<i class="tag">$2</i>$3');
                //html标签
                str = str.replace(r.htmlNote, '<i class="note">$1</i>');
                //注释
                str = str.replace(r.L1, '<i class="lt">$1</i>').replace(r.G1, '<i class="lt">&gt;</i>');
            } else if (type == "javascript") {
                str = str.replace(/('[^'\\]*(?:\\[\s\S][^'\\]*)*'|"[^"\\]*(?:\\[\s\S][^"\\]*)*")/g, '<i class="note">$1</i>');
                //引号之间的内容	
                str = str.replace(r.jsKey, '<i class="jskey">$1</i>$2');
                //关键字
                str = str.replace(r.jsNote, '<i class="note">$1</i></li><li>').replace(r.jsNoteP, '<i class="note">$1</i>');
            }
            //处理制表符 ，每个制表符统一成4个空白符
            str = str.replace(r.tab, "    ");
            //在换行符处添加li标签,
            str = "<li>" + str.replace(r.E, "</li><li>");
            str += "</li>";
            return str;
        },
        setOpt: function(box) {
            var T = this, opt = '<div class="set_opt">', hide;
            opt += '<a href="" class="hide">折叠</a>';
            opt += "</div>";
            box.append(opt);
            opt = box.find(".set_opt");
            hide = opt.find(".hide");
            box.mouseover(function() {
                opt.show();
            }).mouseout(function() {
                opt.hide();
            }).click(function(e) {
                var t = $(e.target);
                if (t.hasClass("open")) {
                    hide.click();
                }
            });
            hide.click(function() {
                var m = $(this);
                if (box.hasClass("code_hide")) {
                    box.removeClass("code_hide").find(".open").hide();
                    m.html("折叠");
                } else {
                    box.addClass("code_hide").find(".open").show();
                    m.html("展开");
                }
                return false;
            });
            if (this.opt.autoHide && box.find(".rs_item").height() > 400) {
                hide.click();
            }
        }
    };
    return codeLight;
});
