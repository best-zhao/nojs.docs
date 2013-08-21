/*
 * 公用组件：表情
 * 2013-8-2
 * nolure@vip.qq.com
 */
define("nojs/module/face", [], function(require, $, ui) {
    var face = function(options) {
        options = options || {};
        this.button = options.button;
        //表情选择器,JQ对象
        this.insert = options.insert;
        //表情写入对象
        if (!this.button || !this.insert) {
            return;
        }
        this.baseUrl = options.baseUrl ? options.baseUrl : "/img/face/";
        this.themeName = options.theme;
        this.theme = face.theme[options.theme];
        if (!this.theme) {
            this.theme = face.theme["default"];
            this.themeName = "default";
        }
        this.faceBox = null;
        //表情显示容器
        this.itemBox = null;
        this.item = null;
        this.init();
    };
    face.theme = {
        //表情主题配置http://cache.soso.com/img/img/e200.gif
        "default": {
            item: {
                "1": "晕",
                "2": "可爱",
                "3": "大笑",
                "4": "呲牙",
                "5": "大哭",
                "6": "拳击",
                "7": "投降",
                "8": "俯卧撑",
                "9": "疑问(不解)",
                "10": "发财",
                "11": "瞌睡",
                "12": "打酱油",
                "13": "憨笑",
                "14": "吃西瓜",
                "15": "汗",
                "16": "惊恐",
                "17": "中标",
                "18": "翻墙",
                "19": "摇头",
                "20": "念经",
                "21": "害羞",
                "22": "睡觉",
                "23": "勤奋",
                "24": "真棒",
                "25": "偷笑",
                "26": "听音乐",
                "27": "晕"
            },
            fix: ".gif"
        },
        qq: {
            item: {
                e100: "微笑",
                e101: "撇嘴",
                e102: "色",
                e103: "发呆",
                e104: "得意",
                e105: "流泪",
                e106: "害羞",
                e107: "闭嘴",
                e108: "睡",
                e109: "大哭",
                e110: "尴尬",
                e111: "发怒",
                e112: "调皮",
                e113: "龇牙",
                e114: "惊讶",
                e115: "难过",
                e116: "酷",
                e117: "冷汗",
                e118: "抓狂",
                e119: "吐",
                e120: "偷笑",
                e121: "可爱",
                e122: "白眼",
                e123: "傲慢",
                e124: "饥饿",
                e125: "困",
                e126: "惊恐",
                e127: "流汗",
                e128: "憨笑",
                e129: "大兵",
                e130: "奋斗",
                e131: "咒骂",
                e132: "疑问",
                e133: "嘘",
                e134: "晕",
                e135: "折磨",
                e136: "衰",
                e137: "骷髅",
                e138: "敲打",
                e139: "再见",
                e140: "擦汗",
                e141: "抠鼻",
                e142: "鼓掌",
                e143: "糗大了",
                e144: "坏笑",
                e145: "左哼哼",
                e146: "右哼哼",
                e147: "哈欠",
                e148: "鄙视",
                e149: "委屈",
                e150: "快哭了",
                e151: "阴险",
                e152: "亲亲",
                e153: "吓",
                e154: "可怜",
                e155: "菜刀",
                e156: "西瓜",
                e157: "啤酒",
                e158: "篮球",
                e159: "乒乓",
                e160: "咖啡",
                e161: "饭",
                e162: "猪头",
                e163: "玫瑰",
                e164: "凋谢",
                e165: "示爱",
                e166: "爱心",
                e167: "心碎",
                e168: "蛋糕",
                e169: "闪电",
                e170: "炸弹",
                e171: "刀",
                e172: "足球",
                e173: "瓢虫",
                e174: "便便",
                e175: "月亮",
                e176: "太阳",
                e177: "礼物",
                e178: "拥抱",
                e179: "强",
                e180: "弱",
                e181: "握手",
                e182: "胜利",
                e183: "抱拳",
                e184: "勾引",
                e185: "拳头",
                e186: "差劲",
                e187: "爱你",
                e188: "NO",
                e189: "OK",
                e190: "爱情",
                e191: "飞吻",
                e192: "跳跳",
                e193: "发抖",
                e194: "怄火",
                e195: "转圈",
                e196: "磕头",
                e197: "回头",
                e198: "跳绳",
                e199: "挥手",
                e200: "激动"
            },
            fix: ".gif"
        }
    };
    face.prototype = {
        init: function() {
            var T = this;
            var faceHtml = [ '<div id="nj_face" class="nj_face">', '<div class="con">', '<div class="tit"><b>默认表情</b></div>', '<ul class="list clearfix"></ul>', "</div>", '<span class="a"><em>◆</em><i>◆</i></span>', "</div>" ].join("");
            this.faceBox = new ui.menu(this.button, {
                mode: "click",
                className: "face_menu",
                onShow: function() {
                    if (!this.menu.data("init")) {
                        this.menu.data("init", true);
                        this.setCon(faceHtml);
                        T.itemBox = this.menu.find("ul.list");
                        T.loadFace();
                    }
                }
            });
        },
        //载入表情
        loadFace: function() {
            var T = this, faceItem = "", url = this.baseUrl + this.themeName + "/", n = 0;
            for (var i in this.theme.item) {
                faceItem += '<li><img src="' + url + i + this.theme.fix + '" title="' + this.theme.item[i] + '" alt="" /></li>';
            }
            this.itemBox.html(faceItem);
            this.item = this.itemBox.find("img");
            this.faceBox.menu.click(function(e) {
                var t = e.target, text;
                if (t.tagName.toLowerCase() == "img") {
                    text = "[:" + $(t).attr("title") + "]";
                    T.insertTo(text);
                    T.faceBox.hide();
                }
            });
        },
        //将所选表情写入到目标对象
        insertTo: function(text) {
            //将表情插入到光标处
            var C = new insertOnCursor(this.insert);
            C.insertAtCaret(text);
            this.insert.focus();
        },
        //提取表情,不传默认为当前表情插入对象val
        replaceFace: function(con) {
            if (!con) {
                var con = this.insert.val();
            }
            var faceArray = this.theme.item, N, pic;
            for (var i in faceArray) {
                N = faceArray[i];
                if (con.indexOf("[:" + N + "]") != -1) {
                    pic = '<img src="' + this.baseUrl + this.themeName + "/" + i + this.theme.fix + '" alt="' + N + '" title="' + N + '" />';
                    con = con.replace(eval("/\\[:" + N.replace("(", "\\(").replace(")", "\\)") + "\\]/g"), pic);
                }
            }
            return con;
        }
    };
    /*
	 * 在光标处插入内容
	 * @obj:支持光标插入的对象
	 */
    function insertOnCursor(obj) {
        if (!obj) {
            return;
        }
        this.textBox = obj;
        this.setCaret();
    }
    insertOnCursor.prototype = {
        //初始化对象以支持光标处插入内容    	
        setCaret: function() {
            if (!$.browser.msie) {
                return;
            }
            var T = this;
            T.textBox.on("click select keyup", function() {
                T.textBox[0].caretPos = document.selection.createRange().duplicate();
            });
        },
        //在当前对象光标处插入指定的内容  
        insertAtCaret: function(text) {
            var textObj = this.textBox[0];
            if (document.all && textObj.createTextRange && textObj.caretPos) {
                var caretPos = textObj.caretPos;
                caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == "" ? text + "" : text;
            } else if (textObj.setSelectionRange) {
                var rangeStart = textObj.selectionStart;
                var rangeEnd = textObj.selectionEnd;
                var tempStr1 = textObj.value.substring(0, rangeStart);
                var tempStr2 = textObj.value.substring(rangeEnd);
                textObj.value = tempStr1 + text + tempStr2;
                var len = text.length;
                textObj.setSelectionRange(rangeStart + len, rangeStart + len);
            } else {
                textObj.value += text;
            }
        },
        //清除当前选择内容
        unselectContents: function() {
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            } else if (document.selection) {
                document.selection.empty();
            }
        },
        //选中内容  
        selectContents: function() {
            this.textBox.each(function(i) {
                var node = this;
                var selection, range, doc, win;
                if ((doc = node.ownerDocument) && (win = doc.defaultView) && typeof win.getSelection != "undefined" && typeof doc.createRange != "undefined" && (selection = window.getSelection()) && typeof selection.removeAllRanges != "undefined") {
                    range = doc.createRange();
                    range.selectNode(node);
                    if (i == 0) {
                        selection.removeAllRanges();
                    }
                    selection.addRange(range);
                } else if (document.body && typeof document.body.createTextRange != "undefined" && (range = document.body.createTextRange())) {
                    range.moveToElementText(node);
                    range.select();
                }
            });
        }
    };
    return face;
});
