/*
 * 文件上传
 * nolure@vip.qq.com
 * 2013-6-4
 */
define("nojs/module/upload", [], function(require, $) {
    var agent = navigator.userAgent.toLowerCase(), browser = {
        "0": window.FileReader,
        //chrome/firefox 使用html5本地预览
        "1": window.ActiveXObject,
        //ie
        "3": /msie [67]/.test(agent),
        //ie67		
        "4": window.FormData && window.XMLHttpRequest
    };
    browser["2"] = !browser["0"] && !browser["1"];
    //不支持本地预览
    function upload(button, options) {
        if (!button || !button.length) {
            return;
        }
        var opt = $.extend({
            uploader: null,
            //文件上传地址
            getProgressUrl: null,
            //用于获取文件上传进度的ajax地址
            name: button[0].name || "file",
            //input文件的name值
            onSelect: null,
            //选择文件时
            onSuccess: null,
            //上传成功
            onError: null,
            //上传失败
            limit: 10,
            //文件个数限制
            fileSize: 2,
            //文件大小限制，单位MB
            fileType: ".jpg,.png,.gif",
            //文件类型后缀
            showPreview: true,
            //是否显示缩略图
            auto: true,
            //选择文件后是否自动上传	
            dragUp: null,
            //拖拽上传，拖拽区域对象
            showProgress: true,
            //是否显示进度条
            //上传进度条对象,该对象为公用对象，即每次上传文件时都在该对象内显示进度
            //若需要单独显示每个文件的进度可在onSelect中动态添加dom，内部包含一个class="up_progress"的div即可
            upProgress: null,
            fileDomain: "",
            //上传文件的域名地址
            dataField: null
        }, upload.config);
        this.options = opt = $.extend(opt, options);
        opt.fileSize = (opt.fileSize || 2) * 1024 * 1024;
        //默认2M
        opt.multi = opt.limit > 1;
        //多选模式
        opt.dataField = $.extend(opt.dataField, {
            file: "file"
        });
        this.button = button;
        this.parent = this.button.parent();
        this.buttonHTML = button[0].outerHTML;
        this.fileItem = {};
        //保存已上传文件
        this.queue = [];
        //等待上传队列
        this.state = null;
        //是否正在上传
        this.count = 0;
        //已上传文件数
        this.tip = typeof opt.tip == "function" ? opt.tip : function(c) {
            alert(c);
        };
        if (opt.dragUp && opt.dragUp.length) {
            //拖拽上传
            upload.dragUp(this);
        }
        this.init();
    }
    upload.config = {};
    //全局配置, options可覆盖
    upload.formatSize = function(size) {
        //格式化文件大小
        if (!size) {
            return null;
        }
        size = size / 1024;
        size = size > 1024 ? (size / 1024).toFixed(2) + "M" : size.toFixed(2) + "K";
        return size;
    };
    upload.dragUp = function(up) {
        var drag = up.options.dragUp;
        if (!window.FileReader) {
            drag.append("您的浏览器不支持拖拽上传");
            return;
        }
        drag = drag[0];
        drag.addEventListener("dragenter", handleDragEnter, false);
        drag.addEventListener("dragover", handleDragOver, false);
        drag.addEventListener("drop", handleFileSelect, false);
        drag.addEventListener("dragleave", handleDragLeave, false);
        // 处理插入拖出效果
        function handleDragEnter(e) {
            e.stopPropagation();
            e.preventDefault();
            this.setAttribute("style", "border-style:dashed;border-color:red");
        }
        function handleDragLeave(e) {
            this.setAttribute("style", "");
        }
        // 处理文件拖入事件，防止浏览器默认事件带来的重定向
        function handleDragOver(e) {
            e.stopPropagation();
            e.preventDefault();
        }
        // 处理拖放文件列表
        function handleFileSelect(e) {
            e.stopPropagation();
            e.preventDefault();
            var files = e.dataTransfer.files, data = {
                drag: true
            };
            up.push(files, data);
        }
    };
    upload.prototype = {
        init: function(reset) {
            var T = this, data, opt = this.options;
            this.button && reset != false && this.button.remove();
            this.button = $(this.buttonHTML).appendTo(this.parent);
            if (opt.multi && !/version.+safari/.test(agent)) {
                //safari在多选模式下使用formData上传图片失败
                this.button[0].multiple = true;
            }
            this.button.change(function() {
                var val = this.value, _file = this.files, type, id;
                if (!val) {
                    return;
                }
                //_file = _file.length && Array.prototype.slice.call(_file,0);
                //_file.shift();
                //console.log(_file)
                if (T.count >= opt.limit) {
                    T.tip("超出数量", "warn");
                    this.value = "";
                    return;
                }
                if (T.fileItem[val] && !_file) {
                    T.tip("文件已存在", "warn");
                    this.value = "";
                    return;
                }
                if (opt.fileType) {
                    type = val.substring(val.lastIndexOf("."), val.length).toLowerCase();
                    if (opt.fileType.indexOf(type) < 0) {
                        T.tip("文件格式错误", "warn");
                        this.value = "";
                        return;
                    }
                }
                data = {};
                data.name = val.substring(val.lastIndexOf("\\") + 1, val.length);
                T.push(_file, data);
            });
        },
        push: function(_file, data) {
            var T = this, n, i, m, size, opt = this.options, val = this.button[0].value;
            data = data || {};
            if (_file) {
                n = _file.length;
                for (i = 0; i < n; i++) {
                    if (T.count >= opt.limit) {
                        break;
                    }
                    m = _file[i];
                    size = m.size;
                    if (size > opt.fileSize) {
                        //文件太大
                        continue;
                    }
                    data.size = upload.formatSize(size);
                    data.name = m.name;
                    //data.type = _file[i].type;
                    push(val.substring(0, val.lastIndexOf("\\") + 1) + m.name);
                }
            } else {
                push(val);
            }
            opt.auto && T.startUpload();
            if (browser["4"]) {
                this.button.val("");
            }
            function push(val) {
                if (T.fileItem[val]) {
                    //文件已存在
                    return;
                }
                var id = "file" + +new Date();
                T.fileItem[val] = data.id = id;
                T.fileItem[id] = {
                    file: val,
                    button: T.button
                };
                if (_file) {
                    T.fileItem[id].files = m;
                }
                T.queue.push(id);
                T.count++;
                T.Events("onSelect", data);
                T.setProgress(0, id, data.size && {
                    loaded: 0,
                    total: ""
                });
                if (!browser["4"] && !opt.auto) {
                    //使用表单上传、非自动上传的情况下，
                    T.button.css({
                        position: "absolute",
                        top: "-999em"
                    }).removeAttr("id");
                    T.init(false);
                }
                !browser["2"] && T.preview(id);
            }
        },
        /*
		 * 所有对外提供的事件集合
		 */
        Events: function(event, data) {
            var T = this, id = data.id, e = T.options[event];
            if (typeof e != "function") {
                return;
            }
            e = e.call(this, data);
            if (event == "onSelect") {
                T.fileItem[id].wrap = e;
                //给添加的容器绑定移除事件  class='cancel'
                T.fileItem[id].wrap.find(".cancel").click(function(e) {
                    T.cancelUpload(this.id);
                    return false;
                });
            }
        },
        /*
		 * 开始上传
		 */
        startUpload: function() {
            if (this.state || !this.queue.length) {
                return;
            }
            if (typeof this.options.uploader != "string") {
                this.tip("上传地址错误", "warn");
                return;
            }
            var T = this, id = this.queue.shift();
            if (!this.fileItem[id]) {
                //该文件已被移除
                return;
            }
            this.id = id;
            //指向当前正在上传的文件
            this.uploading(id);
        },
        /*
		 * 上传处理，使用2种形式
		 * 1. 使用html5的FormData api做异步上传
		 * 2. 动态添加form对象submit到ifrmae实现无刷新
		 */
        uploading: function(id) {
            var T = this, opt = this.options, _file = this.fileItem[id];
            this.state = true;
            _file.state = true;
            //上传状态
            if (browser["4"]) {
                var xhr = this.xhr = new XMLHttpRequest();
                function uploadFile() {
                    xhr.upload.addEventListener("progress", uploadProgress, false);
                    xhr.addEventListener("load", uploadComplete, false);
                    xhr.addEventListener("error", uploadFailed, false);
                    xhr.addEventListener("abort", uploadCanceled, false);
                    xhr.open("POST", opt.uploader, true);
                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    var fd = new FormData();
                    fd.append(T.button[0].name, _file.files);
                    fd.append("uploadID", id);
                    xhr.send(fd);
                }
                function uploadProgress(evt) {
                    var percentComplete, p = "";
                    if (evt.lengthComputable) {
                        percentComplete = Math.round(evt.loaded * 100 / evt.total);
                        p = percentComplete.toString();
                        T.setProgress(p, null, {
                            loaded: evt.loaded,
                            total: evt.total
                        });
                    }
                }
                function uploadComplete(evt) {
                    //T.setProgress( 100, null );
                    T.state = false;
                    var data = eval("(" + evt.target.response + ")");
                    browser["2"] && T.preview(data);
                    T.xhr = null;
                    _file.state = null;
                    T.Events("onSuccess", data);
                    T.startUpload();
                }
                function uploadFailed(evt) {
                    var data = eval("(" + evt.target.response + ")");
                    T.Events("onError", data);
                }
                function uploadCanceled(evt) {}
                uploadFile();
            } else {
                var name = "uploadiframe" + +new Date(), callback = "upload" + +new Date(), action = opt.uploader + (opt.uploader.indexOf("?") < 0 ? "?" : "&") + "jsoncallback=" + callback;
                this.form = $('<form target="' + name + '" action="' + action + '" method="post" enctype="multipart/form-data" style="position:absolute;left:-999em"><input type="hidden" name="uploadID" value="' + id + '" /></form>').appendTo(document.body);
                this.iframe = $('<iframe name="' + name + '" style="display:none"></iframe>').appendTo(document.body);
                _file.button.appendTo(this.form);
                window[callback] = function(data) {
                    if (T.id == data.uploadID) {
                        T.form.remove();
                        T.iframe.remove();
                        T.state = false;
                        _file.state = null;
                        if (data.status == 1) {
                            browser["2"] && T.preview(data);
                            T.Events("onSuccess", data);
                        } else {
                            T.Events("onError", data);
                        }
                        T.startUpload();
                    }
                    window[callback] = null;
                };
                T.form.submit();
                T.getProgress();
            }
        },
        /*
		 * 更新进度条
		 */
        setProgress: function(p, id, size) {
            if (!this.options.showProgress) {
                return;
            }
            var file = this.fileItem[id || this.id], queue = this.options.upProgress || (file && file.wrap ? file.wrap.find(".up_progress") : null);
            p += "%";
            //size = size ? '('+upload.formatSize(size.loaded)+'/'+upload.formatSize(size.total)+')' : '';
            queue && queue.html('<div class="progress"><div class="p" style="width:' + p + '"></div><div class="n">' + p + "</div></div>");
        },
        /*
		 * 设置本地预览
		 * browser['0']：通过html5 api 实现本地预览
		 * browser['1']：使用ie滤镜
		 * browser['2']：其他浏览器在上传完成返回图片
		 */
        preview: function(id) {
            if (!this.options.showPreview) {
                return;
            }
            var T = this, _file = T.fileItem[typeof id == "string" ? id : this.id], file = this.button[0], wrap = _file.wrap;
            if (!wrap || !wrap.length) {
                return;
            }
            if (browser["0"]) {
                if (_file && _file.files) {
                    var reader = new FileReader();
                    reader.onload = function(evt) {
                        call(evt.target.result);
                    };
                    reader.readAsDataURL(_file.files);
                }
            } else if (browser["1"]) {
                if (!this.options.auto) {
                    file = _file.button;
                }
                file.select();
                file.blur();
                _file = document.selection.createRange().text;
                wrap.find("img").replaceWith("<div class=\"view\" style=\"filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='image',src='" + _file + "')\"></div>");
                //for ie 使用滤镜预览的情况下，等比缩放至合适的尺寸
                setTimeout(function() {
                    var img = wrap.find("div.view"), p = img.parent(), W = p.width(), H = p.height(), K = W / H, w = img.width(), h = img.height(), k = w / h;
                    if (k > K) {
                        w = W;
                        h = w / k;
                    } else {
                        h = H;
                        w = k * h;
                    }
                    img.css({
                        width: w,
                        height: h,
                        filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src='" + _file + "')\"></div>"
                    });
                    if (browser["3"]) {
                        //ie67
                        p.css("position", "relative");
                        img.css({
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            "margin-left": -w / 2,
                            "margin-top": -h / 2
                        });
                    }
                }, 100);
            } else {
                call(this.options.fileDomain + id[this.options.dataField.file]);
            }
            function call(src) {
                wrap.find("img").attr("src", src);
            }
        },
        //获取上传进度
        getProgress: function() {
            var url = this.options.getProgressUrl;
            if (!url) {
                return;
            }
            $.ajax({
                url: url,
                data: {
                    ajax: 1,
                    uploadID: this.id
                },
                type: "get",
                dataType: "text",
                cache: false,
                success: function(data) {}
            });
        },
        //取消上传
        cancelUpload: function(id) {
            if (!id || !this.fileItem[id]) {
                return;
            }
            var T = this, file = this.fileItem[id];
            for (var i = 0; i < this.queue.length; i++) {
                if (this.queue[i] == id) {
                    this.queue.splice(i, 1);
                    break;
                }
            }
            delete this.fileItem[file.file];
            delete file;
            this.count--;
            file.wrap && file.wrap.remove();
            file.state && this.xhr && this.xhr.abort();
            //终止正在上传的文件
            this.state && this.startUpload();
        }
    };
    return upload;
});
