define("main", [ "nojs/module/tree", "nojs/module/codelight", "project" ], function(require, $, ui) {
    var tree = require("nojs/module/tree"), codeLight = require("nojs/module/codelight"), project = require("project"), G = {};
    var page = $("#ui_page"), main = $("#main_content"), head = $("#ui_head"), win = $(window), D = window.Page == "mobile" ? "mb_intro" : "noJS_info", page = $("#ui_page"), frame = $("#iframe_content"), side = $("#side_menu"), wrap = page.children("div.ui_wrap"), showMenu = $("#show_menu");
    function setUrl(id) {
        var url = location.href.split("#"), hash = url[1];
        if (id == undefined) {
            return hash;
        }
        location.href = url[0] + "#" + id;
    }
    if (typeof onhashchange != "undefined") {
        window.onhashchange = function() {
            var hash = location.hash, i, m;
            hash = hash.substring(1, hash.length);
            if (hash) {
                for (i = 0; i < G.project.length; i++) {
                    m = G.project[i];
                    if (m.data.all[hash]) {
                        m.select(hash);
                        break;
                    }
                }
            }
        };
    }
    $(window).bind("popstate", function(e) {});
    var treeOptions = {
        defaultNode: setUrl() || D,
        //设置默认节点
        onSelect: function(data) {
            var link = data.link, id = data.id;
            //$.cookie('currentPage',id);
            setUrl(id);
            if (!link) {
                return;
            }
            frame.html('<i class="load"></i>');
            new ui.ico(frame.find("i.load"), {
                type: "loading",
                width: 32,
                height: 32
            });
            var _id = this.box[0].id, name = _id.substring(_id.indexOf("_") + 1, _id.length), url = "project/" + name + "/" + link + ".html";
            id != "project" && this.box.siblings(".nj_tree").find("a.current").removeClass("current");
            frame.load(url, function() {
                //代码高亮
                new codeLight({
                    parent: frame
                });
                //扩展应用
                frame.find("#about_link,.about_link").on("click", function(e) {
                    var t = e.target, i, m;
                    if (t.tagName.toLowerCase() == "a") {
                        for (i = 0; i < G.project.length; i++) {
                            m = G.project[i];
                            if (m.data.all[t.id]) {
                                m.select(t.id);
                                break;
                            }
                        }
                        return false;
                    }
                });
                ui.init(frame);
            });
            showMenu.is(":visible") && setMenu("hide");
        }
    };
    G.init = function() {
        var add = $('<a href="" class="add_project">添加其他项目文档</a>');
        add.click(function() {
            treeOptions.onSelect("project", "p/project.html");
            return false;
        });
    };
    //G.init();
    var headHeight = head.outerHeight();
    function setLayout() {
        var h = win.height() - headHeight;
        wrap.height(h);
    }
    setLayout();
    win.on("scroll resize", setLayout);
    G.project = [];
    side.empty();
    tree.key = {
        name: "text",
        children: "data"
    };
    for (var i in project) {
        if (window.Page == "mobile" && i != "mobile" || window.Page != "mobile" && i == "mobile") {
            continue;
        }
        createProject(i, project[i]);
    }
    function createProject(name, p) {
        var data = p.data, _tree, id;
        if (!data) {
            return;
        }
        id = "menu_" + name;
        _tree = $('<div id="' + id + '" class="nj_tree"></div>');
        side.append(_tree);
        var t = new tree(id, {
            openAll: name == "nojs" ? false : true,
            data: data,
            onSelect: treeOptions.onSelect,
            defaultNode: treeOptions.defaultNode
        });
        G.project.push(t);
    }
    showMenu.click(function() {
        setMenu();
        return false;
    });
    function setMenu(display) {
        if (display && showMenu.is(":hidden")) {
            return;
        }
        if (!display) {
            display = setMenu.display == "show" ? "hide" : "show";
        }
        if (display == "show") {
            side.css("left", "0");
            page.css("padding-left", "14em");
            setMenu.display = "show";
        } else {
            side.css("left", "-15em");
            page.css("padding-left", "0");
            setMenu.display = "hide";
        }
    }
    setMenu.display = "hide";
    if (window.Page == "mobile") {
        side.append('<div class="f_link"><a href="/">nojs</a></div>');
        page.swipeRight(function() {
            setMenu("show");
        }).swipeLeft(function() {
            setMenu("hide");
        });
    } else {
        side.append('<div class="f_link"><a href="/m">nojs mobile</a></div>');
    }
    return G;
});

/*
 * tree 树型菜单
 * 2013-8-3
 * nolure@vip.qq.com
 */
define([], function(require, $) {
    function tree(box, options) {
        var date1 = +new Date();
        this.box = typeof box == "string" ? $("#" + box) : box;
        this.options = options || {};
        this._data = options.data;
        //@data: string即为ajax获取数据
        this.ajaxMode = typeof this._data == "string";
        this.data = this.ajaxMode ? null : tree.format(this._data);
        if (!this.box.length || !this.ajaxMode && !this.data) {
            return;
        }
        //var date2 = (+new Date);
        //console.log(date2-date1);	
        //ajax模式获取数据后，所有节点都应先初始化为包含子节点的节点
        if (this.ajaxMode) {
            var T = this;
            tree.ajax({
                url: this._data,
                tree: this,
                success: function() {
                    T.init(null, true);
                }
            });
        } else {
            this.init(null, true);
        }
    }
    tree.key = {};
    tree.max = 100;
    //一次一级最多能处理的节点数
    tree.rootID = -1;
    //根节点id
    /*
	 * 通过ajax获取数据
	 */
    tree.ajax = function(options) {
        options = options || {};
        $.getJSON(options.url, options.data, function(json) {
            if (json.status == 1) {
                var Tree = options.tree;
                if (Tree && json.data) {
                    Tree.data = tree.format(json.data, Tree.data);
                }
                options.success && options.success(json.data);
            }
        });
    };
    /*
	 * 格式化数据，可接受2种形式的数据，均为json Array对象
	 * 1. 树状结构，子节点children(json Array).
	 * 2. 所有节点并列存放，必须指定父节点id(parent),根节点为-1
	 * @Data: 在原数据上添加
	 */
    tree.format = function(data, _Data) {
        var dataType = $.type(data), level = _Data && _Data.level ? _Data.level : [], time = 0, child, key, _data = _Data && _Data.all ? _Data.all : {};
        tree.key = key = $.extend({
            id: "id",
            name: "name",
            parent: "parent",
            children: "children",
            open: "open",
            link: "link"
        }, tree.key);
        child = key["children"];
        if (dataType != "array" || !data.length || $.type(data[0]) != "object") {
            return {
                all: _data,
                level: level
            };
        }
        //_data = _data || {};
        //console.log(_data)
        dataType = data[0][key["parent"]] == undefined ? 1 : 2;
        function each(Data, _level, _parent) {
            var n = Data.length, i, j, m, id, pid, _n = 0;
            time++;
            for (i = 0; i < n; i++) {
                m = Data[i];
                id = m[key["id"]];
                _n++;
                if (id == undefined || _data[id]) {
                    //没有id或者重复数据
                    if (_Data) {}
                    continue;
                }
                _data[id] = m;
                pid = m[key["parent"]];
                //该节点的父节点id
                if (pid == undefined) {
                    //树状形式的数据
                    _data[id] = {
                        level: _level
                    };
                    for (j in m) {
                        _data[id][j] = j == child ? [] : m[j];
                    }
                    _data[id][child] = _data[id][child] || [];
                    if (_level > 0) {
                        _data[id][key["parent"]] = _parent;
                        //指定其父节点
                        _data[_parent][child].push(id);
                    }
                    if (m[child] && m[child].length) {
                        each(m[child], _level + 1, id);
                    }
                } else if (pid == tree.rootID) {
                    //一级根节点
                    m.level = _level = 0;
                    m[child] = [];
                } else {
                    //子节点
                    m[child] = [];
                    if (_data[pid]) {
                        //其所属父节点
                        _data[pid][child] = _data[pid][child] || [];
                        _data[pid][child].push(id);
                        m.level = _level = _data[pid].level + 1;
                    } else {
                        delete _data[id];
                        _n--;
                        continue;
                    }
                }
                //level[_level] = level[_level] || {};
                //level[_level][id] = _data[id];
                level[_level] = level[_level] || [];
                level[_level].push(_data[id]);
            }
            dataType == 2 && _n < n && time < 3 && each(Data);
        }
        each(data, 0);
        return {
            all: _data,
            level: level
        };
    };
    /*
	 * 通过子节点找到其所有父节点路径，返回父节点id数组
	 * @node:子节点id
	 * @data:格式化后的数据
	 * @until:可选，funtion，查询终止条件
	 */
    tree.parents = function(node, data, until) {
        var _parent = tree.key["parent"], _id = tree.key["id"], _par, parents = [];
        data = data || {};
        node = data[node];
        if (!node) {
            return parents;
        }
        _par = node[_parent];
        //父节点id		
        for (;_par = data[_par]; _par = _par[_parent]) {
            if (until && until(_par)) {
                break;
            }
            parents.push(_par[_id]);
        }
        return parents;
    };
    tree.prototype = {
        init: function(node, set) {
            //@node:节点id，初始化该节点下所有一级子节点，为空表示初始化根节点
            var T = this, _link = tree.key["link"], _id = tree.key["id"], _open = tree.key["open"], _name = tree.key["name"], _parent = tree.key["parent"], _child = tree.key["children"], isChild = node != undefined && node != tree.rootID, all = this.data.all, level = isChild ? all[node].level + 1 : 0, data = isChild ? all[node][_child] : this.data.level[level], isCheck = this.options.isCheck, item = "", i, j, now, m, link, line, id, open, check, more;
            //this.box[0].id=='tree_test1' && console.log(node)
            if (!data.length) {
                return;
            }
            data["break"] = data["break"] || 0;
            for (i = data["break"]; i < data.length; i++) {
                if (i >= tree.max + data["break"]) {
                    data["break"] += tree.max;
                    item += '<li class="more"><a href="" pid="' + (isChild ? node : tree.rootID) + '" data-action="more" style="margin-left:' + level * 15 + 'px">more</a></li>';
                    break;
                }
                m = data[i];
                m = isChild ? all[m] : m;
                id = m[_id];
                item += '<li level="' + level + '">';
                //m.init = true;
                line = "";
                if (level) {
                    for (j = 0; j < level; j++) {
                        line += '<i class="line"></i>';
                    }
                }
                link = m[_link] ? m[_link] : "";
                open = typeof m[_open] !== "undefined" ? 'open="' + m[_open] + '"' : "";
                check = isCheck ? '<input type="checkbox" value="' + id + '" />' : "";
                item += '<a class="item" href="' + link + '" reallink="' + link + '" id="' + id + '" ' + open + ">" + line + '<i class="ico"></i>' + check + '<i class="folder"></i><span class="text">' + m[_name] + "</span></a>";
                if (m[_child].length) {
                    //暂不加载子节点，除默认打开节点外
                    if (m[_open] == 1 || T.options.openAll) {
                        item += '<ul data-init="true">';
                        item += this.init(id, false);
                        m.init = true;
                    } else {
                        item += "<ul>";
                    }
                    item += "</ul>";
                } else if (this.ajaxMode) {
                    item += "<ul></ul>";
                }
                item += "</li>";
            }
            if (set) {
                var area = this.box, _node;
                if (isChild) {
                    area = $(item);
                    _node = this.box.find("#" + node);
                    _node.next("ul").data("init", true).append(area);
                    this.addClass(_node.parent());
                } else {
                    if (!this.rootWrap) {
                        this.rootWrap = $("<ul></ul>");
                        area.html(this.rootWrap);
                        this.bind();
                    }
                    this.rootWrap.append(item);
                    this.addClass(area, true);
                }
                this.replaceLink(area);
                (function(area) {
                    var node = area.find("a.item").not(".no_child");
                    //包含子节点
                    //展开全部
                    if (T.options.openAll) {
                        area.find("ul ul").show();
                        node.addClass("open");
                    }
                    //设置默认关闭
                    node.filter(function() {
                        return this.getAttribute("open") == "0";
                    }).removeClass("open").next("ul").hide();
                    //设置默认打开
                    node.filter(function() {
                        return this.getAttribute("open") == "1";
                    }).addClass("open").next("ul").show();
                })(area);
                !isChild && this.select(this.options.defaultNode);
            }
            return item;
        },
        bind: function() {
            var T = this, tag, sec, link, t;
            this.box.off("click.tree").on("click.tree", function(e) {
                t = e.target;
                tag = $(t);
                if (tag.hasClass("ico") && !tag.parent().hasClass("no_child")) {
                    //折叠
                    tag = tag.parent(".item");
                    sec = tag.next("ul");
                    if (tag.hasClass("open")) {
                        sec && sec.is(":visible") && sec.hide();
                        tag.removeClass("open");
                    } else {
                        if (!sec.data("init")) {
                            var node = tag[0].id;
                            ///child = T.data.all[node][tree.key['children']][0];
                            //初始化该节点
                            if (T.ajaxMode) {
                                tree.ajax({
                                    url: T._data,
                                    data: {
                                        id: node
                                    },
                                    tree: T,
                                    success: function(data) {
                                        if (data && data.length) {
                                            T.init(node, true);
                                        } else {
                                            tag.addClass("no_child").next("ul").remove();
                                            if (tag.find(".last_ico1").length) {
                                                tag.find(".last_ico1").addClass("last_ico").removeClass("last_ico1");
                                            }
                                        }
                                        sec.data("init", true);
                                    }
                                });
                            } else {
                                T.init(node, true);
                                sec.data("init", true);
                            }
                        }
                        sec && sec.is(":hidden") && sec.show();
                        tag.addClass("open");
                    }
                } else if (tag.hasClass("folder") || tag.hasClass("item") || tag.hasClass("text") || tag.hasClass("line") || tag.hasClass("ico")) {
                    //选中
                    if (!tag.hasClass("item")) {
                        tag = tag.parent();
                    }
                    T.box.find("a.current").removeClass("current");
                    tag.addClass("current");
                    T.options.onSelect && T.options.onSelect.call(T, T.data.all[tag[0].id]);
                } else if (t.tagName.toLowerCase() == "input") {
                    var children = tag.closest("a.item").next("ul").find("input"), parent = tag.parents("ul"), i, m, checked;
                    if (t.checked) {
                        children.attr("checked", "checked");
                        for (var i = 0; i < parent.length; i++) {
                            m = parent.eq(i);
                            if (!m.find("input").not(":checked").length) {
                                m.prev("a.item").find("input").attr("checked", "checked");
                            }
                        }
                    } else {
                        children.attr("checked", false);
                        parent.prev("a.item").find("input").attr("checked", false);
                    }
                    checked = T.box.find(":checked");
                    T.checked = checked.length ? function() {
                        var rect = [];
                        checked.each(function() {
                            rect.push(this.value);
                        });
                        return rect;
                    }() : null;
                    T.options.onCheck && T.options.onCheck.call(T, t.id);
                    return true;
                } else if (t.tagName.toLowerCase() == "a" && tag.attr("data-action") == "more") {
                    T.init(tag.attr("pid"), true);
                    tag.parent().remove();
                }
                return false;
            });
        },
        addClass: function(area, root) {
            area = area || this.box;
            var list = area.find("a.item"), i, j, q, l, n = list.length, m, o, li, level;
            for (i = 0; i < n; i++) {
                m = list.eq(i);
                root && i == 0 && m.find(".ico").addClass("first_ico");
                li = m.closest("li");
                if (!m.next("ul").length) {
                    //无子节点
                    !this.ajaxMode && m.addClass("no_child");
                    if (!li.next().length) {
                        m.find(".ico").addClass("last_ico");
                    }
                } else {
                    !li.next().length && m.find(".ico").addClass("last_ico1");
                    //有子节点并为最后一条
                    level = li.attr("level");
                    for (j = 0; j < li.find("li").length; j++) {
                        o = li.find("li").eq(j).find(".line");
                        !li.next().length && o.eq(level).addClass("last_line");
                        q = m.find(".last_line");
                        for (l = 0; l < q.length; l++) {
                            o.eq(q.eq(l).index()).addClass("last_line");
                        }
                    }
                }
            }
        },
        /*
		 * 设置当前节点
		 * @ID:属性值
		 * @by:属性 通过该属性来查找节点，默认通过id
		 */
        select: function(ID, by) {
            if (!ID) {
                return;
            }
            by = by || "id";
            var T = this, node = this.box.find("a[" + by + '="' + ID + '"]').eq(0), _parent = tree.key["parent"], parents = [];
            if (!this.data.all[ID]) {
                return;
            }
            if (!node || !node.length) {
                //从当前节点依次往上寻找父节点，直到找到已经初始化的节点为止
                parents = tree.parents(ID, this.data.all, function(parent) {
                    return parent.init;
                });
                //然后从最外层的父节点开始初始化
                for (var i = parents.length - 1; i >= 0; i--) {
                    this.init(parents[i], true);
                }
                node = this.box.find("a[" + by + '="' + ID + '"]').eq(0);
            }
            this.box.find("a.current").removeClass("current");
            if (node.parents("ul").first().is(":visible")) {
                return set();
            }
            var ul = node.parents("ul").not(":visible"), len = ul.length, m;
            function set() {
                node.addClass("current");
                T.options.onSelect && T.options.onSelect.call(T, T.data.all[ID]);
                //执行事件
                return false;
            }
            function s(i) {
                if (i < 0) {
                    return;
                }
                m = ul.eq(i);
                m.show().siblings("a.item").addClass("open");
                s(--i);
            }
            s(len - 1);
            //从最外层父ul开始展开
            set();
        },
        replaceLink: function(area) {
            //ie67下会自动补全url为绝对路径
            //使用 getAttribute( 'href', 2 ) 可解决
            if ($.browser("ie6 ie7")) {
                area = area || this.box;
                var a = area.find("a"), link;
                a.each(function() {
                    this.href = this.getAttribute("reallink", 2);
                    this.removeAttribute("reallink");
                });
            }
        }
    };
    //通过一个select来展现树形结构或者是级联菜单
    tree.select = function(box, options) {
        options = options || {};
        var Data = typeof options.data == "string" ? {} : tree.format(options.data), selected = [].concat(options.select), single = options.level == 0, ajaxMode = typeof options.data == "string", data = ajaxMode ? [] : Data.level, emptyID = options.empty != undefined ? options.empty : "", empty, level = 0, item, _id = tree.key["id"], _name = tree.key["name"], _child = tree.key["children"];
        if (!box || !box.length || !data) {
            return;
        }
        function get(level) {
            var i, item = "", _data;
            _data = data[level];
            item = '<select name="">';
            item += single ? '<option value="' + tree.rootID + '">根目录</option>' : empty;
            for (i in _data) {
                if (emptyID == _data[i][_id]) {
                    continue;
                }
                item += getItem(_data[i], level);
            }
            item += "</select>";
            return item;
        }
        function getChild(child) {
            var j, item = "";
            level++;
            if (child.length) {
                for (j in child) {
                    item += getItem(Data.all[child[j]], level);
                }
            }
            level--;
            return item;
        }
        function getLine(level) {
            var line = "--";
            for (i = 0; i < level; i++) {
                line += "--";
            }
            return line;
        }
        function getItem(m, level) {
            return '<option value="' + (m[_id] != undefined ? m[_id] : "") + '">' + (single ? getLine(level) : "") + m[_name] + "</option>" + (single ? getChild(m[_child]) : "");
        }
        empty = '<option value="' + emptyID + '">请选择</option>';
        if (ajaxMode) {
            ajax();
        } else {
            init();
        }
        function init() {
            item = get(level);
            item = $(item);
            if (selected[0] != undefined) {
                item[0].value = selected[0];
                selected[0] = null;
            }
            box.html(item);
        }
        function ajax(_data, callback) {
            tree.ajax({
                url: options.data,
                data: _data,
                success: function(_data) {
                    if (!_data || !_data.length) {
                        return;
                    }
                    Data = tree.format(_data, Data);
                    data = Data.level;
                    if (callback) {
                        callback();
                    } else {
                        init();
                        !single && bind(item);
                    }
                }
            });
        }
        if (!single) {
            function add(m, id) {
                var _data = Data.all[id], child = _data[_child];
                if (!child.length) {
                    return;
                }
                m = $(m);
                _data.init = true;
                level = _data.level;
                child = $('<select name="">' + empty + getChild(child) + "</select>");
                if (selected[level + 1] != undefined) {
                    child[0].value = selected[level + 1];
                    selected[level + 1] = null;
                }
                m.after(child);
                bind(child);
            }
            function change(item) {
                var id = item.value;
                //box[0].id=='tree_test3' && console.log(id);
                $(item).nextAll("select").remove();
                if (!Data.all[id]) {
                    return;
                }
                if (ajaxMode && !Data.all[id].init) {
                    ajax({
                        id: id
                    }, function() {
                        add(item, id);
                    });
                } else {
                    add(item, id);
                }
            }
            function bind(item) {
                item.change(function() {
                    change(this);
                });
                if (item.val()) {
                    change(item[0]);
                }
            }
            item && bind(item);
        }
        return item;
    };
    return tree;
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

define([], {
    nojs: {
        data: [ {
            id: "noJS",
            text: "noJS模块管理",
            data: [ {
                id: "noJS_info",
                text: "使用介绍",
                link: "noJS/index"
            }, {
                id: "noJS_config",
                text: "参数配置",
                link: "noJS/config"
            }, {
                id: "noJS_module",
                text: "模块",
                link: "noJS/module"
            }, {
                id: "noJS_api",
                text: "接口",
                link: "noJS/api"
            } ]
        }, {
            id: "nj_ui",
            text: "ui组件",
            open: 1,
            data: [ {
                id: "ui_info",
                text: "说明",
                link: "ui/index"
            }, {
                id: "tools",
                text: "jQuery扩展工具",
                link: "ui/tools"
            }, {
                id: "ui_core",
                text: "核心ui组件",
                open: 0,
                data: [ {
                    id: "ui_setPos",
                    text: "ui.setPos",
                    link: "ui/setpos"
                }, {
                    id: "ui_layer",
                    text: "ui.layer",
                    link: "ui/layer"
                }, {
                    id: "ui_win",
                    text: "ui.win",
                    link: "ui/win"
                }, {
                    id: "ui_msg",
                    text: "ui.msg",
                    link: "ui/msg"
                }, {
                    id: "ui_select",
                    text: "ui.select",
                    link: "ui/select"
                }, {
                    id: "ui_switch",
                    text: "ui.Switch",
                    link: "ui/switch"
                }, {
                    id: "ui_slide",
                    text: "ui.slide",
                    link: "ui/slide"
                }, {
                    id: "ui_menu",
                    text: "ui.menu",
                    link: "ui/menu"
                }, {
                    id: "ui_ico",
                    text: "ui.ico",
                    link: "ui/ico"
                } ]
            } ]
        }, {
            id: "other",
            text: "常用模块",
            open: 1,
            data: [ {
                id: "m_scroll",
                text: "scroll滚动",
                link: "module/scroll"
            }, {
                id: "m_code",
                text: "code代码美化",
                link: "module/code"
            }, {
                id: "drag",
                text: "drag",
                link: "module/drag"
            }, {
                id: "form",
                text: "form表单验证",
                link: "module/form"
            }, {
                id: "upload",
                text: "upload文件上传",
                link: "module/upload"
            }, {
                id: "tree",
                text: "tree树形菜单",
                link: "module/tree"
            }, {
                id: "color",
                text: "color取色器",
                link: "module/color"
            }, {
                id: "face",
                text: "face表情选择",
                link: "module/face"
            }, {
                id: "calendar",
                text: "calendar日历",
                link: "module/calendar"
            } ]
        }, {
            id: "test_page",
            text: "小测试",
            open: 0,
            data: [ {
                id: "impact",
                text: "html5碰撞小游戏",
                link: "test/impact"
            }, {
                id: "imghot",
                text: "在线绘制图片热点",
                link: "test/imghot"
            } ]
        } ]
    },
    mobile: {
        data: [ {
            id: "mb",
            text: "nojs.mobile",
            data: [ {
                id: "mb_intro",
                text: "说明",
                link: "intro"
            }, {
                id: "mb_ui",
                text: "ui",
                data: [ {
                    id: "mb_switch",
                    text: "Switch选项卡",
                    link: "switch"
                }, {
                    id: "mb_slide",
                    text: "slide幻灯片",
                    link: "slide"
                } ]
            } ]
        } ]
    }
});
