define("nojs/module/color", [], function(require, $) {
    function color(obj) {
        /*
		 * 取色器
		 * @obj:jQuery触发对象集合
		 */
        var box = $("#nj_color"), drag, mask, roll, num = {}, pos = {
            h: 0,
            s: 0,
            b: 0,
            R: 255,
            G: 255,
            B: 255,
            color: "ffffff"
        }, preview;
        add(obj);
        function init() {
            var html = [ '<div id="nj_color">', '<div class="mask"><div class="b"></div><div class="c" data="s"></div></div>', '<div class="roll"><div class="c" data="r"></div></div>', '<div class="r">', '<span class="preview"><i></i>颜色</span>', "<dl>", '<dd><label>H：</label><input name="h" value="0" />度</dd>', '<dd><label>S：</label><input name="s" value="0" />%</dd>', '<dd><label>B：</label><input name="b" value="0" />%</dd>', "</dl>", "<dl>", '<dd><label>R：</label><input name="_r" value="255" /></dd>', '<dd><label>G：</label><input name="_g" value="255" /></dd>', '<dd><label>B：</label><input name="_b" value="255" /></dd>', '<dd class="color"><label>#</label> <input name="color" value="#ffffff" /></dd>', "</dl>", '<input type="button" class="ok" value="确定" /> <input type="button" class="close" value="取消" />', "</div>", "</div>" ];
            box = $("body").append(html.join("")).find("#nj_color");
            mask = box.find(".mask");
            maskDrag = mask.find(".c");
            roll = box.find(".roll");
            rollDrag = roll.find(".c");
            preview = box.find(".preview i");
            var text = box.find("dd input");
            num = {
                h: text.eq(0),
                s: text.eq(1),
                b: text.eq(2),
                R: text.eq(3),
                G: text.eq(4),
                B: text.eq(5),
                color: text.eq(6)
            };
            $(document).click(function() {
                hide();
            });
            bind();
        }
        function bind() {
            box.click(function(e) {
                $.stopBubble(e);
                var t = e.target, m = $(t);
                if (m.hasClass("close")) {
                    hide();
                }
            });
            var doc = $(document), mouse, left, top;
            function move(m, e, ismove) {
                var s = !m.hasClass("roll"), d = s ? maskDrag : rollDrag, overflow = s ? 6 : 3;
                mouse = {
                    //鼠标位置
                    x: e.clientX,
                    y: e.clientY
                };
                top = mouse.y + $(window).scrollTop() - m.offset().top;
                top = top < 0 ? 0 : top;
                top = top > 255 ? 255 : top;
                d.css({
                    top: top - overflow
                });
                if (s) {
                    pos.b = 100 - top * 100 / 255;
                    //亮度
                    left = mouse.x + $(window).scrollLeft() - m.offset().left;
                    left = left < 0 ? 0 : left;
                    left = left > 255 ? 255 : left;
                    d.css({
                        left: left - overflow
                    });
                    pos.s = left * 100 / 255;
                } else {
                    pos.h = 360 - top * 360 / 255;
                    pos.h = pos.h == 360 ? 0 : pos.h;
                }
                moveCall(s);
                $.stopDefault(e);
            }
            box.find(".mask,.roll").mousedown(function(e) {
                var m = $(this);
                move(m, e);
                doc.bind("mousemove.color", function(e) {
                    move(m, e, true);
                }).bind("mouseup.color", function() {
                    doc.unbind("mousemove.color mouseup.color");
                });
            });
            box.find(".ok").click(function() {
                obj.val("#" + pos.color);
                hide();
            });
        }
        function moveCall(s) {
            var _color, rgb;
            num.h.val(Math.round(pos.h));
            num.b.val(Math.round(pos.b));
            num.s.val(Math.round(pos.s));
            _color = color.HsbToRgb(pos.h, pos.s, pos.b);
            num.R.val(Math.round(_color.R));
            num.G.val(Math.round(_color.G));
            num.B.val(Math.round(_color.B));
            pos.color = color.RgbToHex(_color.R, _color.G, _color.B);
            //16进制的颜色值
            num.color.val(pos.color);
            preview.css("background", "#" + pos.color);
            if (!s) {
                rgb = color.HsbToRgb(pos.h, 100, 100);
                mask.css("background", "rgb(" + Math.round(rgb.R) + "," + Math.round(rgb.G) + "," + Math.round(rgb.B) + ")");
            }
        }
        function reset(_color) {
            //初始化时重置为默认颜色,必须为16进制
            if (!_color || !/^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(_color)) {
                return;
            }
            var rgb = color.HexToRgb(_color), hsb = color.RgbToHsb(rgb.R, rgb.G, rgb.B);
            pos.h = hsb.H;
            pos.s = hsb.S;
            pos.b = hsb.B;
            moveCall(false);
            maskDrag.css({
                top: 255 - hsb.B * 255 / 100 - 6,
                left: hsb.S * 255 / 100 - 6
            });
            rollDrag.css({
                top: 255 - hsb.H * 255 / 360 - 3
            });
        }
        function add(obj) {
            /*
			 * 添加一组触发对象
			 */
            var len = obj.length;
            if (!len) {
                return;
            }
            for (var i = 0; i < len; i++) {
                (function(m) {
                    m.click(function(e) {
                        $.stopBubble(e);
                        show(m);
                    });
                })(obj.eq(i));
            }
        }
        function show(m) {
            !box.length && init();
            var left = m.offset().left + "px", top = m.offset().top + m.outerHeight() + "px";
            box.css({
                display: "block",
                left: left,
                top: top
            });
            //.find('.ok').focus();
            reset(m.val());
        }
        function hide() {
            box.hide();
        }
        return {
            add: add
        };
    }
    color.HsbToRgb = function(H, S, B) {
        //hsb模式转换为rgb模式
        var rgb = {
            R: 0,
            G: 0,
            B: 0
        };
        H = H >= 360 ? 0 : H;
        S /= 100;
        B /= 100;
        if (S == 0) {
            rgb.R = B * 255;
            rgb.G = B * 255;
            rgb.B = B * 255;
        } else {
            i = Math.floor(H / 60) % 6;
            f = H / 60 - i;
            p = B * (1 - S);
            q = B * (1 - S * f);
            t = B * (1 - S * (1 - f));
            switch (i) {
              case 0:
                rgb.R = B, rgb.G = t, rgb.B = p;
                break;

              case 1:
                rgb.R = q;
                rgb.G = B;
                rgb.B = p;
                break;

              case 2:
                rgb.R = p;
                rgb.G = B;
                rgb.B = t;
                break;

              case 3:
                rgb.R = p;
                rgb.G = q;
                rgb.B = B;
                break;

              case 4:
                rgb.R = t;
                rgb.G = p;
                rgb.B = B;
                break;

              case 5:
                rgb.R = B;
                rgb.G = p;
                rgb.B = q;
                break;
            }
            rgb.R = rgb.R * 255;
            rgb.G = rgb.G * 255;
            rgb.B = rgb.B * 255;
        }
        //rgb.R = Math.round(rgb.R);
        //rgb.G = Math.round(rgb.G);
        //rgb.B = Math.round(rgb.B);
        return rgb;
    };
    color.RgbToHsb = function(R, G, B) {
        //rgb模式转换为hsb模式
        var var_Min = Math.min(Math.min(R, G), B), var_Max = Math.max(Math.max(R, G), B), hsb = {
            H: 0,
            S: 0,
            B: 0
        }, var_R, var_G, var_B;
        if (var_Min == var_Max) {
            hsb.H = 0;
        } else if (var_Max == R && G >= B) {
            hsb.H = 60 * ((G - B) / (var_Max - var_Min));
        } else if (var_Max == R && G < B) {
            hsb.H = 60 * ((G - B) / (var_Max - var_Min)) + 360;
        } else if (var_Max == G) {
            hsb.H = 60 * ((B - R) / (var_Max - var_Min)) + 120;
        } else if (var_Max == B) {
            hsb.H = 60 * ((R - G) / (var_Max - var_Min)) + 240;
        }
        if (var_Max == 0) {
            hsb.S = 0;
        } else {
            hsb.S = 1 - var_Min / var_Max;
        }
        var_R = R / 255;
        var_G = G / 255;
        var_B = B / 255;
        hsb.B = Math.max(Math.max(var_R, var_G), var_B);
        hsb.H = hsb.H >= 360 ? 0 : hsb.H;
        //hsb.H = hsb.H;
        hsb.S = hsb.S * 100;
        hsb.B = hsb.B * 100;
        return hsb;
    };
    color.RgbToHex = function(R, G, B, prefix) {
        //rgb转16进制 prefix是否带#
        var hex, strHex = "", color = [ Math.round(R), Math.round(G), Math.round(B) ];
        for (var i = 0; i < color.length; i++) {
            hex = Number(color[i]).toString(16);
            if (hex.length == 1) {
                hex = "0" + hex;
            }
            strHex += hex;
        }
        prefix && (strHex = "#" + strHex);
        return strHex;
    };
    color.HexToRgb = function(hex) {
        //16进制转rgb
        var color = String(hex).toLowerCase().replace(/#/, ""), reg = /^([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/, sColorNew = "", sColorChange = [];
        if (color && reg.test(color)) {
            if (color.length == 3) {
                for (var i = 0; i < 3; i++) {
                    sColorNew += color.slice(i, i + 1) + color.slice(i, i + 1);
                }
                color = sColorNew;
            }
            //处理六位的颜色值
            for (var i = 0; i < 5; i += 2) {
                sColorChange.push(parseInt("0x" + color.slice(i, i + 2)));
            }
            return {
                R: sColorChange[0],
                G: sColorChange[1],
                B: sColorChange[2]
            };
        } else {
            return color;
        }
    };
    return color;
});
