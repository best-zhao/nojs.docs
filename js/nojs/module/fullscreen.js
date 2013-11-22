/*
 * 浏览器全屏模式api
 */
define("nojs/module/fullscreen", [], function(require, $) {
    var fullScreenApi = {
        supportsFullScreen: false,
        isFullScreen: function() {
            return false;
        },
        requestFullScreen: function() {},
        cancelFullScreen: function() {},
        fullScreenEventName: "",
        prefix: ""
    }, browserPrefixes = "webkit moz o ms khtml".split(" ");
    if (typeof document.cancelFullScreen != "undefined") {
        fullScreenApi.supportsFullScreen = true;
    } else {
        for (var i = 0, il = browserPrefixes.length; i < il; i++) {
            fullScreenApi.prefix = browserPrefixes[i];
            if (typeof document[fullScreenApi.prefix + "CancelFullScreen"] != "undefined") {
                fullScreenApi.supportsFullScreen = true;
                break;
            }
        }
    }
    if (fullScreenApi.supportsFullScreen) {
        fullScreenApi.fullScreenEventName = fullScreenApi.prefix + "fullscreenchange";
        fullScreenApi.isFullScreen = function() {
            switch (this.prefix) {
              case "":
                return document.fullScreen;

              case "webkit":
                return document.webkitIsFullScreen;

              default:
                return document[this.prefix + "FullScreen"];
            }
        };
        fullScreenApi.requestFullScreen = function(el) {
            return this.prefix === "" ? el.requestFullScreen() : el[this.prefix + "RequestFullScreen"]();
        };
        fullScreenApi.cancelFullScreen = function(el) {
            return this.prefix === "" ? document.cancelFullScreen() : document[this.prefix + "CancelFullScreen"]();
        };
    }
    return fullScreenApi;
    //绑定事件示例
    if (fullScreenApi.supportsFullScreen) {
        Button.addEventListener("click", function() {
            fullScreenApi.requestFullScreen(Element);
        }, true);
    }
    //添加全屏切换事件示例
    Element.addEventListener(fullScreenApi.fullScreenEventName, function() {
        if (fullScreenApi.isFullScreen()) {
            fsStatus.innerHTML = "Whoa, you went fullscreen";
        } else {
            fsStatus.innerHTML = "Back to normal";
        }
    }, true);
});
