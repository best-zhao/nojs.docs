/*
 * 打分组件
 * nolure@vip.qq.com
 * 2013-11-7
 */
define("nojs/module/score", [], function(require, $) {
    function score(id, options) {
        this.options = options = options || {};
        this.element = typeof id == "string" ? $("#" + id) : id;
        this.level = options.level || 5;
        //评分等级 默认5
        this.index = options.index || 0;
        this.title = options.title instanceof Array && options.title.length >= this.level ? options.title : null;
        this.field = this.element.find("input:hidden");
        this.item = null;
        this.init();
    }
    score.prototype = {
        init: function() {
            var self = this, i, html = "", width;
            for (i = 0; i < this.level; i++) {
                html += '<i title="' + (this.title ? this.title[i] : i + 1 + "分") + '"></i>';
            }
            this.element.prepend(html);
            this.item = this.element.children("i");
            width = this.item.width();
            this.element.width(this.level * width);
            this.item.each(function(i) {
                $(this).css({
                    width: width * (i + 1),
                    "z-index": self.level - i
                });
            });
            this.bind();
        },
        bind: function() {
            var self = this;
            this.item.hover(function() {
                var t = $(this), now = self.element.find("i.current"), index = t.index();
                t.addClass("hover").siblings().removeClass("hover");
                if (index > now.index()) {
                    now.addClass("hover");
                }
                self.options.onMove && self.options.onMove.call(self, true, index + 1);
            }, function() {
                self.item.removeClass("hover");
                self.options.onMove && self.options.onMove.call(self, false, $(this).index + 1);
            });
            this.element.click(function(e) {
                var t = e.target;
                if (t.tagName.toLowerCase() == "i") {
                    self.item.removeClass("current hover");
                    $(t).addClass("current");
                    self.index = $(t).index() + 1;
                    self.field.val(self.index);
                    self.options.onSelect && self.options.onSelect.call(this, self.index);
                }
            });
            this.index && this.item.eq(this.index - 1).click();
        },
        reset: function() {
            this.field.val("");
            this.item.removeClass("current");
            this.index = 0;
            this.options.onMove && this.options.onMove.call(this);
        }
    };
    return score;
    var rate = function(box, opt) {
        opt = opt || {};
        var B = typeof box == "string" ? $("#" + box) : box, rate, w, n = opt.level || 5, start = opt.start, title = opt.title instanceof Array && opt.title.length >= n ? opt.title : null, index = 0, html = "", hide = B.find("input:hidden"), data = {
            index: index
        };
        for (var i = 0; i < n; i++) {
            html += '<i title="' + (title ? title[i] : i + 1 + "分") + '"></i>';
        }
        B.prepend(html);
        rate = B.children("i");
        w = rate.width();
        B.width(w * n);
        for (var i = 0; i < n; i++) {
            rate.eq(i).css({
                width: w * (i + 1),
                "z-index": n - i
            });
        }
        rate.hover(function() {
            var S = B.children("i.current");
            $(this).addClass("hover").siblings().removeClass("hover");
            if ($(this).index() > S.index()) {
                S.addClass("hover");
            }
            opt.onMouseover && opt.onMouseover.call(this, B);
        }, function() {
            rate.removeClass("hover");
            opt.onMouseout && opt.onMouseout.call(this, B);
        });
        B.click(function(e) {
            var t = e.target;
            if (t.tagName.toLowerCase() == "i") {
                rate.removeClass("current hover");
                $(t).addClass("current");
                index = data.index = $(t).index() + 1;
                hide.val(index);
                opt.onSelect && opt.onSelect(index);
            }
        });
        start && rate.eq(start - 1).click();
        //设置初始值
        data.reset = function() {
            hide.value("");
            rate.removeClass("current");
            data.index = 0;
        };
        return data;
    };
    return rate;
});
