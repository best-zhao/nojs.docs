/*
 * 抽奖
 * 2013-10-18
 * nolure@vip.qq.com
 */
define("test/lottery", [], function(require, $, ui, mdb) {
    /*
     * 旋转
     */
    function rotate(parent, options) {
        this.options = options = options || {};
        this.parent = typeof parent == "string" ? $("#" + parent) : parent;
        this.element = options.element;
        this.width = this.parent.width();
        this.height = this.parent.height();
        this.canvas = null;
        this.ctx = null;
        //当前角度 
        this.angle = 0;
        this.createSpace();
    }
    rotate.hasCanvas = !!document.createElement("canvas").getContext;
    rotate.state = null;
    rotate.speed = rotate.hasCanvas ? 20 : 40;
    rotate.prototype = {
        createSpace: function() {
            var d = document;
            this.background = new Image();
            this.background.src = this.options.background;
            if (rotate.hasCanvas) {
                this.canvas = d.createElement("canvas");
                this.canvas.className = "canvas";
                this.ctx = this.canvas.getContext("2d");
                this.canvas.width = this.width;
                this.canvas.height = this.height;
                this.parent.append(this.canvas);
                this.ctx.translate(this.width / 2, this.height / 2);
                this.canvas.img = [];
                var link = '<div class="link">', startAngle = -90, style, data;
                for (var i = 0; i < this.element.length; i++) {
                    this.canvas.img[i] = new Image();
                    data = this.element[i];
                    this.canvas.img[i].src = data.picurl;
                    this.canvas.img[i].style.width = this.canvas.img[i].style.height = "78px";
                    startAngle %= 360;
                    style = [ "-webkit-transform-origin:0 39px;", "-moz-transform-origin:0 39px;", "-ms-transform-origin:0 39px;", "-o-transform-origin:0 39px;", "-webkit-transform: rotate(" + startAngle + "deg);", "-moz-transform: rotate(" + startAngle + "deg);", "-ms-transform: rotate(" + startAngle + "deg);", "-o-transform: rotate(" + startAngle + "deg);" ].join("");
                    link += '<div style="' + style + '"><a href="' + data.linkurl + '" title="' + data.prize + '" target="_blank"></a></div>';
                    startAngle += 45;
                }
                link += "</div>";
                this.link = $(link);
                this.parent.append(this.link);
                this.ctx.rotate(-90 * Math.PI / 180);
            } else {
                var s = d.createStyleSheet(), shapes = [ "image", "group" ];
                d.namespaces.add("v", "urn:schemas-microsoft-com:vml");
                //创建vml命名空间
                for (var i = 0; i < shapes.length; i++) {
                    s.addRule("v\\:" + shapes[i], "behavior:url(#default#VML);display:inline-block;");
                }
            }
            this.draw();
            this.rotate(.1);
        },
        start: function() {
            var self = this;
            rotate.step = 1;
            //起始转速
            rotate.state = true;
            this.time = setInterval(function() {
                if (!rotate.step || rotate.step < 0) {
                    //stop
                    self.time = clearInterval(self.time);
                    rotate.onStop && rotate.onStop();
                    rotate.hasCanvas && self.link.css({
                        "-webkit-transform": "rotate(" + self.angle + "deg)",
                        "-moz-transform": "rotate(" + self.angle + "deg)",
                        "-ms-transform": "rotate(" + self.angle + "deg)",
                        "-o-transform": "rotate(" + self.angle + "deg)"
                    });
                    self.link.show();
                    return;
                }
                if (rotate.state && rotate.step < 21) {
                    //加速
                    rotate.step += .5;
                }
                self.rotate();
            }, rotate.speed);
        },
        draw: function() {
            var self = this, i, n = this.element.length;
            if (rotate.hasCanvas) {
                //绘制转盘背景图
                this.ctx.drawImage(this.background, -this.width / 2, -this.height / 2, this.width, this.height);
                for (i = 0; i < n; i++) {
                    this.ctx.beginPath();
                    this.ctx.fillStyle = "#FFB24A";
                    //绘制直径78的圆left:width/2-39, top:30
                    this.ctx.arc(this.width / 2 - 39 - 30, 0, 39, 0, 360, false);
                    this.ctx.fill();
                    this.ctx.beginPath();
                    this.ctx.drawImage(this.canvas.img[i], this.width / 2 - 78 - 30, -39, 78, 78);
                    this.ctx.rotate(45 * Math.PI / 180);
                }
            } else {
                var angle = 0, group = '<v:group class="vml_group" CoordOrig="' + -this.width / 2 + "," + -this.height / 2 + '" CoordSize="' + this.width + "," + this.height + '"></v:group>';
                this.canvas = document.createElement(group);
                $(this.canvas).addClass("canvas");
                this.canvas.img = [];
                this.parent.append(this.canvas);
                //绘制转盘背景图
                var bg = document.createElement('<v:image src="' + this.background.src + '" class="bg"></v:image>'), data;
                $(this.canvas).append(bg);
                for (i = 0; i < this.element.length; i++) {
                    data = this.element[i];
                    this.canvas.img[i] = document.createElement(group);
                    $(this.canvas).append(this.canvas.img[i]);
                    $(this.canvas.img[i]).append('<v:image class="vml_img" src="' + data.picurl + '"><a href="' + data.linkurl + '" title="' + data.prize + '" target="_blank"></a></v:image>');
                    angle %= 360;
                    this.canvas.img[i].angle = this.canvas.img[i].rotation = angle;
                    angle += 45;
                }
                this.link = this.parent.find(".vml_img a");
                this.canvas.angle = this.canvas.rotation = 0;
            }
        },
        rotate: function(step) {
            var self = this, p = Math.PI, width = this.width, height = this.width;
            step = step || rotate.step;
            if (rotate.hasCanvas) {
                this.ctx.clearRect(-width / 2, -height / 2, width, height);
                this.ctx.rotate(step * p / 180);
                this.draw();
                this.angle = (this.angle + step) % 360;
            } else {
                var angle = 0, _angle;
                this.angle = (this.canvas.angle + step) % 360;
                this.canvas.rotation = this.canvas.angle = this.angle;
            }
        }
    };
    /*
     * 抽奖
     */
    function lottery(options) {
        this.options = options = options || {};
        options.background = domain.rs + "/Images/zt/lottery/bg.jpg";
        this.lottery = this.options.data;
        this.length = this.lottery.length;
        if (!this.length) {
            return;
        }
        this.element = $("#" + this.options.element);
        this.loading = this.element.find("i.loading");
        new ui.ico(this.loading, {
            type: "loading",
            width: 48,
            height: 48,
            color: "#F0A97D"
        });
        this.value = null;
        this.limittime = null;
        //间隔时间限制5秒
        this.preload();
        this.getData();
    }
    lottery.prototype = {
        getData: function() {
            var self = this, userState = $("#u_state");
            if (!mdb.user.state) {
                userState.html('检测到您是未登录状态，点击此处 <a href="javascript:void(0);" id="login_btn">登录</a> 或 <a href="/User-registe.html" target="_blank">注册</a>。');
                $("#login_btn").click(function() {
                    if (!mdb.user.check()) {
                        self.loginCallback();
                        return false;
                    }
                });
                self.loginCallback();
            }
            //剩余贡献值
            $.ajax({
                url: "Lottery-limitcount",
                data: {
                    ztid: this.options.id
                },
                dataType: "json",
                async: false,
                success: function(json) {
                    self.value = json.limitcount;
                }
            });
        },
        loginCallback: function() {
            var self = this;
            mdb.user.callback = function() {
                $("#u_state").html("");
                ui.msg.show("ok", "登录成功，现在你可以抽奖了！");
                self.getData();
            };
        },
        preload: function() {
            var self = this, i, ready = 0, item = [ this.options.background, domain.rs + "/Images/zt/lottery/c.png" ];
            for (i = 0; i < this.length; i++) {
                item.push(this.lottery[i].picurl);
            }
            for (i = 0; i < item.length; i++) {
                !function(i) {
                    var img = new Image();
                    img.src = item[i];
                    if (img.complete) {
                        ready++ && check();
                        return;
                    }
                    img.onload = function() {
                        ready++;
                        img = img.onload = null;
                        check();
                    };
                }(i);
            }
            function check() {
                ready >= item.length && self.init();
            }
        },
        init: function() {
            var self = this;
            this.loading.hide();
            this.element.find("div.lottery_wrap").css({
                visibility: "visible",
                opacity: "0"
            }).fadeTo(500, 1);
            this.lottery = new rotate(this.options.element, {
                element: this.lottery,
                background: this.options.background
            });
            this.start = $("#lottery_start");
            this.state = null;
            this.bind();
        },
        bind: function() {
            var self = this, autoStop;
            this.start.click(function(e) {
                if (!mdb.user.check()) {
                    self.loginCallback();
                    return false;
                }
                if (!self.value) {
                    ui.msg.show("warn", "您的贡献值不足，不能抽奖");
                    return false;
                }
                if (self.state == 1) {
                    return false;
                } else if (self.state == 2) {
                    //正在停止
                    return false;
                }
                self.tip = null;
                $.post("Lottery-dolottery", {
                    ztid: self.options.id
                }, function(json) {
                    var now;
                    if (json.status == 1) {
                        self.index = json.sort || self.options.data[0].sort;
                        self.tip = json.msg;
                        self.haveprize = json.haveprize;
                        //是否获奖
                        self.value = json.limitcount;
                    } else {}
                    autoStop = setTimeout(function() {
                        self.stop(now);
                    }, 1500);
                }, "json");
                if (self.limittime) {
                    ui.msg.show("warn", "您点的比飞机还快,休息一会吧");
                    return false;
                }
                self.limittime = setTimeout(function() {
                    self.limittime = null;
                }, 5e3);
                self.lottery.link.hide();
                self.lottery.start();
                self.state = 1;
                //开始抽奖
                e.preventDefault();
                return false;
            });
            rotate.onStop = function() {
                self.state = null;
            };
        },
        stop: function(now) {
            var self = this, deceleration = .15, //减速度    0.1度/20毫秒
            stop, time, stopAngle, _stopAngle, autoStop, mistake = 10.5;
            //误差值10.5度  ********与减速度的值有关
            //autoStop = clearTimeout(autoStop);
            self.state = 2;
            //停止抽奖
            rotate.state = null;
            if (!now) {
                time = rotate.step / deceleration;
                //停止时间
                //初始角度+0.5*停止时间*角速度
                //221.4+0.5*(22.4/0.2)*22.4
                //stopAngle = (self.lottery.angle+0.5*time*rotate.step+mistake);//计算完全停止后指向的角度 
                var index = self.getIndex();
                //指定奖品索引
                stopAngle = -index * 45 + 360 * (now ? 1 : 8);
                //停止后的角度
                //_stopAngle = stopAngle % 45;
                deceleration = rotate.step / ((stopAngle - self.lottery.angle - mistake) / rotate.step / .5);
            }
            stop = setInterval(function() {
                //减速停止
                rotate.step -= deceleration;
                if (rotate.step <= 0) {
                    stop = clearInterval(stop);
                    ui.msg.show(self.haveprize ? "ok" : "warn", self.tip, {
                        layer: true,
                        timeout: 0,
                        button: [ [ "再试一次", "close", "sb" ] ]
                    });
                }
            }, rotate.speed);
        },
        getIndex: function(index) {
            //同步本地索引和真实奖品索引
            var _index;
            index = this.index || this.options.data[0].sort;
            for (var i = 0; i < this.length; i++) {
                if (this.options.data[i].sort == index) {
                    _index = i;
                    break;
                }
            }
            return _index;
        },
        getLottery: function() {
            return parseInt((360 - this.lottery.angle) / 45);
            //this.lottery.angle指向的为第一件奖品 正上方为奖品所在方向
            var s = parseInt(this.lottery.angle) / 45;
            return rotate.hasCanvas ? parseInt(s <= 6 ? 6 - s : s) : parseInt(s < 1 ? s : this.length - s);
        }
    };
    return lottery;
});
