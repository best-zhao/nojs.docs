/*
 * capture
 * nolure@vip.qq.com
 * 2013-11-14
 */
define("nojs/module/imgcapture", [], function(require, $, ui) {
    function imgcapture(options) {
        this.options = options || {};
        this.url = options.url;
        if (!this.url || typeof this.url != "string") {
            return;
        }
        this.wrap = null;
        this.init();
    }
    imgcapture.prototype = {
        init: function() {
            var self = this;
            //this.wrap = $('<iframe src="'+this.url+'" frameborder="0" style="position:absolute;width:0;height:0"></iframe>').appendTo(document.body);
            this.wrap = $("<div></div>").appendTo(document.body);
            this.wrap.load(this.url, function() {
                var win = this.contentWindow;
            });
        }
    };
    return imgcapture;
});
