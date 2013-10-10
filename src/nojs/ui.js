/*
 * nojs UI
 * 2013-7-30
 * nolure@vip.qq.com
 */
!function(window, factory){
	if( typeof define=='function' && define.cmd ){
		define(factory);
	}else{
		window.ui = factory();
	}
}(this, function( require, $ ){
	
	var ui = {};
	
	/*
	 * 触发方式
	 * 1.普通：直接执行相关方法，
	 * 2.区域初始化：通过在Elements上配置相应的属性初始化对应区域内所有ui组件，默认body区域
	 */
	
	ui.init = function( area ){
		area = area || $('body');
		
		var dom = area.find('[data-ui]'),
			i, elem, method, options;
			
		for( i=0; i<dom.length; i++ ){
			elem = dom[i];
			method = elem.getAttribute('data-ui');
			if( ui[method] ){
				if( options = elem.getAttribute('data-config') ){
					options = eval('({'+options+'})') || {};
					//elem.removeAttribute('data-config');
				}
				ui[method]( elem, options );
			}
		}	
	};
	
	var isNew, cache = {};
	function instaceofFun( fun, arg ){
		if( !(fun instanceof arg.callee) ){
			return newFun( arg.callee, Array.prototype.slice.call(arg) );
		}else{
			return false;
		}
	}
	
	function newFun( parent, args ) {
	    function F( parent,args ) {
	    	parent.apply( this, args );
	    	//console.log(this.constructor)
	    }
	    //F.constructor = parent;
	    F.prototype = parent.prototype;
	    isNew = null;
		return new F( parent, args );
	}
	
	/*
	 * 所有依赖dom的ui组件都可以通过id,element,jQuery来获取dom元素
	 */
	function getDom( selector ){
		if( !selector ){return;} 
		var type = typeof selector, elem;
		if( type=='string' ){//通过id
			elem = $('#'+selector);
		}else if( type=='object' ){
			elem = selector.nodeType||selector==window ? $(selector) : selector;
		}
		elem = elem.length ? elem : null;		
		return elem;
	}
	
	//类继承
	function Extend(Child, Parent){
		var F = function(){};
		F.prototype = Parent.prototype;
		Child.prototype = new F();
		Child.prototype.constructor = Child;
		Child.baseConstructor = Parent;
    	Child.baseClass = Parent.prototype;
	}
	//扩展子类原型方法
	Extend.proto = function(Class, value){
		for( var i in value ){
			(function(fn, _fn){
				Class.prototype[i] = function(){
					fn.apply( this, [_fn].concat(Array.prototype.slice.call(arguments)) );
				};
			})(value[i], Class.prototype[i]);
		}
	}
	
	ui.data = function( id, Class ){
		if( Class ){//set
			cache[id] = Class;
		}else{
			return cache[id];
		}
	}
		
	ui.config = {};	
	
	/* 
	 * [animate动画扩展]
	 * easeIn：加速度缓动；
	 * easeOut：减速度缓动；
	 * easeInOut：先加速度至50%，再减速度完成动画
	 */	
	$.extend( $.easing, {
		//指数曲线缓动
		easeOutExpo: function (x, t, b, c, d) {
			return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
		}
	});
	$.extend({
		type : function(obj){
			return obj == null ? String( obj ) : Object.prototype.toString.call( obj ).slice( 8, -1 ).toLowerCase();
		},
		random : function(){
			//得到一个随机数
			return String(Math.ceil(Math.random() * 100000) + String(new Date().getTime()));
		},
		stopDefault : function( e ){
			//取消事件的默认动作
			if ( e.preventDefault ) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
		},
		stopBubble : function( e ){
			//阻止冒泡
			if ( e.stopPropagation ){
				e.stopPropagation();
			}else{
				e.cancelBubble = true;
			}
		},
		
		onScroll : function( obejct, onScroll ){
			//自定义鼠标滚轮事件
			var scrollFunc = function(e){ 
				e = e || window.event;	
				if(e.wheelDelta){//IE/Opera/Chrome 
					//e.returnValue=false;//阻止网页滚动条滚动
				}else if(e.detail){//Firefox 
					//e.preventDefault(); 
				}
				$.stopDefault(e);
				onScroll && onScroll(e);
			} 
			if(document.addEventListener){//firefox
				obejct.addEventListener( "DOMMouseScroll", scrollFunc, false );
			}
			obejct.onmousewheel = scrollFunc;//IE/Opera/Chrome/Safari 
		},
		
		browser : function(){
			//检测浏览器
			var u = navigator.userAgent.toLowerCase(),
			fn = {
				version:(u.match(/(?:firefox|opera|safari|chrome|msie)[\/: ]([\d.]+)/))[0],//浏览器版本号
			    safari:/version.+safari/.test(u),
			    chrome:/chrome/.test(u),
			    firefox:/firefox/.test(u),
			    ie:/msie/.test(u),
				ie6:/msie 6.0/.test(u),
				ie7:/msie 7.0/.test(u),
				ie8:/msie 8.0/.test(u),
				ie9:/msie 9.0/.test(u),
			    opera: /opera/.test(u) 
			}, state;
			return function( name ){
				//多个用逗号隔开 如'ie6 ie7'
				state = false;
				name = name.split(' ');
				$.each( name, function( i, val ){
					if( fn[ val ] ){
						state = true;
						return false;
					}
				})
				return state;
			}
		}(),
		tmpl : function(){
			/*
			 * js模版引擎
			 * http://ejohn.org/blog/javascript-micro-templating/
			 */
			var c = {};
			return function(s,d){
				var fn = !/\W/.test(s) ? c[s]=c[s]||$.tmpl(document.getElementById(s).innerHTML):
				new Function("o",
				"var p=[];"+"with(o){p.push('"+
				s
				//.replace(/\\/g,"\\\\")//解决转义符bug
				.replace(/[\r\t\n]/g," ")			
				.split("<%").join("\t")
				.replace(/((^|%>)[^\t]*)'/g,"$1\r")
				.replace(/\t=(.*?)%>/g, "',$1,'")
				.split("\t").join("');")
				.split("%>").join("p.push('")
				.split("\r").join("\\'")
				+ "');}return p.join('');");
				return d?fn(d):fn;
			};
		}(),
		
		cookie : function( name, value, options ){
			/*
			 * 读取cookie值: $.cookie("key"); 
			 * 设置/新建cookie的值:	$.cookie("key", "value");
			 * 新建一个cookie 包括有效期(天数) 路径 域名等:$.cookie("key", "value", {expires: 7, path: '/', domain: 'a.com', secure: true});
			 * 删除一个cookie:$.cookie("key", null);	
			 */		
			if (typeof value != 'undefined') {
		        options = options || {};
		        if (value === null) {
		            value = '';
		            options.expires = -1;
		        }
		        var expires = '';
		        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
		            var date;
		            if (typeof options.expires == 'number') {
		                date = new Date();
		                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
		            } else {
		                date = options.expires;
		            }
		            expires = '; expires=' + date.toUTCString();
		        }
		        var path = options.path ? '; path=' + (options.path) : '';
		        var domain = options.domain ? '; domain=' + (options.domain) : '';
		        var secure = options.secure ? '; secure' : '';
		        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
		    } else { 
		        var cookieValue = null;
		        if (document.cookie && document.cookie != '') {
		            var cookies = document.cookie.split(';');
		            for (var i = 0; i < cookies.length; i++) {
		                var cookie = $.trim(cookies[i]);
		                if (cookie.substring(0, name.length + 1) == (name + '=')) {
		                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
		                    break;
		                }
		            }
		        }
		        return cookieValue;
		    }
		},
		addCss : function(css){
			//动态创建css @css:string
			if( typeof css!='string' ){
				return;
			}
			var i, style;
			 
			if( document.createStyleSheet ) {
				window.style= css; 
				document.createStyleSheet("javascript:style"); 
			}else{
				style = document.createElement('style'); 
				style.type = 'text/css'
				style.innerHTML = css; 
				document.getElementsByTagName('HEAD')[0].appendChild(style);
			}
		}
	})
	
	/*
	 * 将对象对齐到某个参考元素nearby
	 * nearby是window对象,即固定在屏幕上
	 * relative为true可设置为类似css的背景图定位方式,只限百分比
	 */	
	ui.align = function(options){
		this.options = options = options || {};
		this.element = getDom(options.element);
		this.nearby = getDom(options.nearby);
		var screen = this.nearby && this.nearby[0]==window;
		this.position = options.position || (screen ? {top:50, left:50} : {top:100, left:0});
		this.relative = options.relative!=undefined ? options.relative : screen ? true : false;
		
		this.fixed = options.fixed==undefined && screen ? 'fixed' : options.fixed;//null fixed animate
		this.cssFixed = this.fixed=='fixed' && !$.browser('ie6') && screen;//直接使用css:fixed来定位
		
		this.offset = options.offset || [0,0];
		this.isWrap = this.nearby && (screen || this.nearby.find(this.element).length);//对象是否在参考对象内部
		this.autoAdjust = options.autoAdjust;//超出屏幕后是否自动调整位置
		
		if( this.element ){
			this.bind();
		}
	}
	ui.align.prototype = {
		bind : function(){
			var self = this,
				ns = this.element.data('align'),
				type;
				
			if( ns ){
				this.nearby.add(window).off( '.'+ns );
			}else{
				ns = 'align'+(new Date()).getTime();
				this.element.data('align', ns);
			}
			
			if( !this.cssFixed && this.fixed ){
				this.nearby.on('scroll.'+ns, function(){
					self.visible && self.set();
				});
			}
			$(window).on('resize.'+ns, function(){
				self.visible && self.set();
			})
			
			this.set();
		},
		get : function(nearby){
			nearby = nearby || this.nearby;
			var offset = nearby.offset(),
			size = {
				width : nearby.outerWidth(),
				height : nearby.outerHeight(),
				x : offset ? offset.left : 0,
				y : offset ? offset.top : 0,
				scrollLeft : this.cssFixed ? 0 : nearby.scrollLeft(),
				scrollTop : this.cssFixed ? 0 : nearby.scrollTop(),
				WIDTH : this.element.outerWidth(),
				HEIGHT : this.element.outerHeight()
			};
			return size;
		},
		set : function(options){
			//可设置nearby position offset relative等参数覆盖初始选项
			if( !this.element ){
				return;
			}
			options = options || {};
			
			var position = options.position || this.position,
				nearby = getDom(options.nearby) || this.nearby;
			
			if( !nearby ){
				return;
			}
			
			var size = this.get(nearby),
				Attr = {
					x : {}, y : {}
				}, 
				_Attr, attr, value, _value, type, direction, style = {}, wrapSize;
			
			if( this.isWrap ){
				size.x = size.y = 0;
			}	
			Attr.x.element = 'WIDTH';
			Attr.y.element = 'HEIGHT';
			Attr.x.nearby = 'width';
			Attr.y.nearby = 'height';
			Attr.x.offset = 0;
			Attr.y.offset = 1;
			Attr.x.scroll = 'scrollLeft';
			Attr.y.scroll = 'scrollTop';
			
			for( attr in position ){
				value = _value = position[attr];
				type = typeof value;
				if( type=='function' ){
					value = value(size);
					type = typeof value;
				}
				direction = attr=='top' || attr=='bottom' ? 'y' : 'x';
				_Attr = Attr[direction];
				
				value = type=='number' ? 
					(size[_Attr.nearby] - (this.relative?size[_Attr.element]:0)) * value/100 :
					parseInt(value,10);
					
				if( attr=='bottom' || attr=='right' ){
					value *= -1;
					value -= size[_Attr.element] - size[_Attr.nearby];
				}
				
				value += size[direction] + this.offset[_Attr.offset] + size[_Attr.scroll];
				
				if( this.autoAdjust ){
					//屏幕边界限制
					wrapSize = this.isWrap ? size[_Attr.nearby] : $(window)[_Attr.nearby]();
					if( value + size[_Attr.element] - size[_Attr.scroll] > wrapSize ){
						if( size[_Attr.element] < size[direction] - size[_Attr.scroll] ){
							value = size[direction] - size[_Attr.element];
						}else{
							value = size[_Attr.scroll];
						}
					}else if( value<size[_Attr.scroll] ){
						value = size[_Attr.scroll];
					}
				}
				
				style[direction=='x'?'left':'top'] = value;
			}
			
			this.element.css('position', this.cssFixed ? 'fixed' : 'absolute');
			
			if( this.fixed=='animate' ){
				this.element.stop().animate( style, 200 );
				return;
			}
			this.element.css(style);
		}
	}
	
	/*
	 * 浮动层
	 * 自动显示或由外部事件触发
	 * 可定时隐藏
	 */
	ui.overlay = function(options){
		ui.overlay.baseConstructor.call(this, options);		
		this.visible = false;//可视状态
		this.content = null;//内容区域
		this.arrow = this.options.arrow;//箭头 根据align对齐方式自动调整指向
		this.timeout = this.options.timeout;
		this.onShow = this.options.onShow;
		this.onHide = this.options.onHide;
		ui.overlay.item.push(this);
		this.init();
	}
	Extend(ui.overlay, ui.align);
	Extend.proto(ui.overlay, {
		set : function(fn, key, value){
			if( key=='content' ){
				this.content.empty().append(value);
			}else{
				fn.call(this, value);
			}
		}
	})
	ui.overlay.item = [];
	ui.overlay.hide = function(){
		var item = ui.overlay.item,
			n = item.length,
			i = 0;
		for( ; i<n; i++ ){
			item[i].hide();
		}
	}
	ui.overlay.prototype.init = function(){
		var self = this,
			_class = this.options.className;
			
		_class = typeof _class=='string' ? _class : '';//添加class 多个用空格隔开
		
		this.element = $('<div class="nj_overlay '+_class+'"><div class="nj_overlay_wrap"></div></div>').appendTo(document.body).css({
			'display' : 'block',
			'visibility' : 'hidden'
		});
		this.content = this.element.find('.nj_overlay_wrap');
		
		if( this.arrow ){
			this.arrow.element = $('<div class="nj_overlay_arrow"></div>').appendTo(this.element);
			this.arrow.offset = this.arrow.offset || [0,0];
		}
		
		this.bind();
	}	
	ui.overlay.prototype.show = function(callback){
		
		if( this.visible ){
			return;
		}
		var self = this;
		
		this.element.css('visibility','visible');
		this.set();
		
		if( this.timeout ){
			this.autoHide = setTimeout(function(){
				self.hide();
			}, this.timeout)
		}
		this.visible = true;
		callback && callback();
		this.onShow && this.onShow.call(this);
		
		return;
		if( self.arrow ){
			var top = 0, left = 0,
				direction = self.arrow.direction || pos[2];
			
			if( direction=='up' || direction=='down' ){
				//top = direction=='up' ? self.arrow.element.outerHeight()*-1 : self.element.innerHeight();
			}else if( direction=='left' || direction=='right' ){
				//left = direction=='left' ? self.arrow.element.outerWidth()*-1 : self.element.innerWidth();
			}
			
			self.arrow.element.css({
				top : top,
				left : left
			}).attr('class', 'nj_overlay_arrow nj_overlay_arrow_'+direction);
		}
	}
	ui.overlay.prototype.hide = function(callback){
		if( !this.visible ){
			return;
		}
		this.element.css('visibility','hidden');
		this.autoHide = clearTimeout(this.autoHide);
		this.visible = false;
		callback && callback();
		this.onHide && this.onHide.call(this);
	}
	ui.overlay.prototype.on = function(options){
		options = options || {};
		
		var self = this,
			mode = options.mode || 'mouseover',
			agent = $.type(options.element)=='array' && options.element.length>1,
			element = getDom(agent ? options.element[0] : options.element) || this.nearby,
			hoverClass = this.options.hoverClass || 'nj_overlay_show',
			onShow = this.onShow,
			onHide = this.onHide,
			isHover, show, hide, showTime, hideTime, hideEvent;
		
		if( !element ){
			return;
		}
		
		isHover = mode == 'mouseover';
		hideEvent = isHover ? ' mouseout' : '';	
		
		show = function(e){
			var t, tag, type, el;
			if( agent ){
				t = e.target;
				tag = t.tagName.toLowerCase();
				el = options.element[1];
				type = typeof el;
				
				if( type =='function' ){
					el = el.call(t, tag);
				}else if( type == 'string' && el == tag ){
					
				}else{
					el = null;
				}
				if( !el ){
					return;
				}
				if( self.nearby && self.nearby[0] != t && self.visible ){
					self.hide();
 				}
				element = self.nearby = $(t);
			}
			
			$.stopBubble(e);
			isHover ? !function(){
				hideTime = clearTimeout(hideTime);
				showTime = setTimeout(function(){
					self.show();
				}, 10)
			}() : !hideEvent && self.visible ? self.hide() : self.show();
			
			if( agent && el ){
				return false;
			}
		}
		hide = function(e){	
			$.stopBubble(e);
			hideEvent ? !function(){
				showTime = clearTimeout(showTime);
				hideTime = setTimeout(function(){
					self.hide();
				}, 10)
			}() : self.hide();
		}
		this.onShow = function(){
            element.addClass(hoverClass);
            onShow && onShow.call(self);
        }
		this.onHide = function(){
		    element.removeClass(hoverClass);
		    onHide && onHide.call(self);
		}
		element.on(mode, show);
		
		hideEvent && element.on(hideEvent, hide);
		!isHover && !function(){
			$(document).click(hide);
			self.element.click(function(e){
				$.stopBubble(e);
			})
		}();
		
		isHover && this.element.hover(function(){
			hideTime = clearTimeout(hideTime);
		}, hide);
	}
	
	ui.layer = function(){
		/*
		 * 遮罩层
		 */
		var w = $(window),
			layer = $("#nj_layer"),
			arr = { show : show, hide : hide };
		function init(){
			layer = $('<div id="nj_layer"></div>').appendTo(document.body);
	        
			if( $.browser('ie6') ){
				S = function(){
					layer.css({
						width : w.width(),
						height : w.height()
					})
				}
				S();
				w.on( 'scroll resize', S );
				new ui.align({
					element : layer
				});
			}
			
			$.onScroll( layer[0] );
			arr.element = layer;
		}
		function show(opacity){
			!document.getElementById('nj_layer') && init();
			if( layer.is(":visible") ){
				return;
			}
			layer.show().fadeTo( 200, typeof opacity=='number' ? opacity : 0.6 );
		}
		function hide(){
			layer.fadeTo(200,0,function(){
				layer.hide();
			});
		}
		
		return arr;
	}();
	
	ui.popup = function( options ){
		/*
		 * 弹窗
		 */
		options = options || {};
		options.className = 'nj_win '+(options.className || ''); 
		options.nearby = options.nearby || window;
		ui.popup.baseConstructor.call(this, options);
	    this.width = options.width || 400;//宽
	    this.close = null;//关闭按钮
	    this.title = null;//标题区
		this.operating = null;//操作区
		this.stillLayer = options.stillLayer || false;//隐藏后是否继续显示遮罩层
		this.layer = options.layer==false ? false : true;
		this.bindEsc = options.bindEsc == false ? false:true;
		this.onShow = options.onShow;
		this.onHide = options.onHide;
		this.create();
	}
	Extend(ui.popup, ui.overlay);
	Extend.proto(ui.popup, {		
		set : function(fn, key, value){
			/*
				设置标题、内容
		        @tit,con:会替换以前的
		        @btns:设置操作区按钮，为一个数组，数组项格式同this.getButton,如不设置或设置null则隐藏操作区
		    */
			if( key=='title' ){
				value && this.title.html(value);
			}else if( key=='button' ){
				this.button = [];
				if(value){
					this.operating.empty();//重设操作区
					for(var i=0;i<value.length;i++){
						this.addBtn.apply( this, value[i] );
					}
				}else if(this.operating.html().replace(/\s/g,"")==""){//不传入且未设置过操作区则隐藏操作区
					this.operating.css("display","none");
				}
			}else{
				fn.call(this, key, value);
			}
		},
		show : function(fn, callback){
			/*
				显示弹窗
		        @callBack:可选参数，回调函数
		    */
		    if( this.visible ){
		    	return;
		    }
			//this.set();//重新计算高度并设置居中
			this.layer && ui.layer.show();
			fn.call(this, callback);
			
			this.element.css({
				"margin-top" : "-15px"
			})
			this.element.stop().animate({
				"margin-top" : "0",
				"opacity" : "1"
			}, 400, 'easeOutExpo');		
		},
		hide : function(fn, callback){
			/*
				隐藏弹窗
		        @callBack:可选参数，回调函数
		    */
			if( !this.visible ){
		    	return;
		    }
			var T = this;
			/*
			 * onbeforehide:关闭之前确认，传入一个数组[fn,true/false]
			 * fn返回的布尔值;第二个参数true表示是否只有当fn为true时才关闭窗口,false均关闭
			 */
			if(this.onbeforehide && !this.onbeforehide[0]()){			
				if( this.onbeforehide[1] ) {return false;}
			}//关闭之前确认
			
			this.element.animate({
				"margin-top" : "-20px",
				"opacity" : "0"
			}, 150, 'easeOutExpo');
			
			setTimeout(function(){
				fn.call(T, callback);
			}, 90)
			
	        !this.stillLayer &&	ui.layer.hide();
		}
	})
	ui.popup.prototype.create = function(){
		var self = this,
			id = 'nj_popup_' + $.random();
		
		ui.popup.item[id] = this;
		this.key = id;		
		
		this.set('content', [
			'<span class="win_close"></span><div class="win_tit"></div>',
			'<div class="win_con"></div>',
			'<div class="win_opt"></div>'
		].join(''));
		this.content.addClass('win_wrap');
		this.element.css( {'width':self.width, 'opacity':'0'} );
		this.close = this.element.find(".win_close");
		this.title = this.element.find(".win_tit");
		this.content = this.element.find(".win_con");
		this.operating = this.element.find(".win_opt");
		
		new ui.ico( this.close, {type:'close'} );
		
		this.close.on('click',function(){//绑定关闭按钮事件
			self.hide();
		});
		if(this.bindEsc){
			$(window).on("keydown",function(e){//按下esc键隐藏弹窗
				self.element.is(":visible") && e.keyCode==27 && self.hide();
			})
		}
		$.onScroll( this.content[0] );		
	}
	ui.popup.prototype.addBtn = function(text,callback,color){
		/*
			增加一个操作区按钮
			@text:按钮文字
			@color:按钮样式，即class类名
			@callBack:按钮click绑定的函数,"close"则为关闭
		*/			
		if( text===undefined ){
			return;
		}
		this.operating.is(":hidden") && this.operating.show();
		
		var T = this,
			btn = $('<a href=""></a>'),
			color = color ? color : "";			
		if( typeof callback=='string' && callback!='close' ){//无回调时，第二个参数作为按钮颜色
			color = callback;
			callback = null;
		}	
		btn.attr({
			"class" : color=='no' ? '' : "nj_btn n_b_" + color
		});
		btn.html('<i>'+text+'</i>');
		this.operating.append(btn);
		this.button.push(btn);
		
		if(callback) {
			callback = callback == "close" ? function(){
				T.hide();
			} : callback;
			btn.on( "click", function(){
				callback.call(T);
				return false;
			});
		}
	}
	ui.popup.item = {};//保存所有弹框实例对象
	ui.popup.clear = function(key){
		//清空弹框对象
		if(key){
			var win = ui.popup.item[key];
			win && clear(win);
		}else{
			for(var i in ui.popup.item){
				clear( ui.popup.item[i] );
			}
			ui.popup.item = {};
			ui.msg.win = null;
		}
		function clear( win ){
			win.self.remove();
			win = null;
		}
	}
	
	ui.msg = function(){
		/*
		 * 消息提示框
		 */
		var Win = {};
		return {
			show : function( type, tip, opt ){
				opt = opt || {};
				var T = this,
					btn = opt.button,
					timeout = opt.timeout || 1600,
					C = type=='confirm',
					tit = C ? '温馨提醒：' : null,
					w = opt.width || (C ? 400 : 'auto'),
					win = Win[type];
				
				//隐藏其他
				this.hide(true);
				
				tip = tip || '';
				if(type=='loading'){
					tip = tip || '正在处理请求,请稍候……';
				}else if(C){
					btn = btn || [
						['确定',function(){
							win.hide(function(){
								try{opt.ok();}catch(e){};
							});
						},'sb'],
						['取消','close']
					];
				}
				if( !win || !$('#'+win.key).length ){
					win = new ui.popup({
						width : w,
						bindEsc : false,
						className : 'msg_tip_win'
					});
					
					win.element.find('div.nj_overlay_wrap').addClass('msg_tip_'+type);
					win.layer = C ? true : false;
					win.stillLayer = C ? false : true;
					
					win.set('title', tit);
					win.set('content', '<div class="con clearfix"><i class="tip_ico"></i><span class="tip_con"></span></div>');
					new ui.ico( win.content.find('i.tip_ico'), {type:C ? 'warn' : type} );
					Win[type] = win;
				}
				//自动隐藏							
				win.timeout = type!='confirm' && type!='loading' && !opt.reload ? timeout : 0;
				if( opt.reload ){
					setTimeout(function(){
						if( opt.reload===true ){
							location.reload();
						}else if( typeof opt.reload=='string' ){
							location.href = opt.reload;
						}
					}, 1500)
				}
				!btn && win.operating.hide().empty();//重设操作区
				
				win.set('button', btn );
				win.content.find('.tip_con').html(tip);
				win.show();
				C && win.button[0].focus();				
			},
			hide : function( now ){
				for( var i in Win ){
					now && Win[i].element.stop().css('visibility','hidden');
					Win[i].hide();
				}
			}		
		}
	}();
	ui.select = function( options ){
        if( isNew = instaceofFun(this,arguments) ){
            return isNew;
        }
        /*
         * 通用下拉列表,延迟200毫秒触发
         * @options:可选项{show:只显示几项,只接受整数，固定高度,onSelect:当选择某项的时候触发一个回调}
         * 默认选中项根据隐藏域的value值来匹配
         */     
        //options = $.extend( ui.config.select, options );        
        options = options || {};
        if( !options.nearby ){
            return;
        }
        options.className = 'nj_select_list '+(options.className || '');
        options.hoverClass = options.hoverClass || 'nj_select_show';
        
        ui.select.baseConstructor.call(this, options);
        if( !this.nearby || this.nearby[0].tagName.toLowerCase()!='select' ){
            return;
        }
        ui.data( this.nearby[0].id, this );
        this.max = this.options.max;//最多
        this.onSelect = this.options.onSelect;//切换回调
        this.defaultEvent = this.options.defaultEvent==true ? true : false;//首次是否执行回调
        this.autoWidth = this.options.autoWidth==false ? false : true;
        this.index = 0;        
        this.value = this.nearby[0].getAttribute('value') || this.nearby.val();   
        this.replace();
    };
    Extend(ui.select, ui.overlay);
    ui.select.prototype.replace = function(){
        var list = this.nearby.find('option'),
            group = this.nearby.find('optgroup'),
            HTML, _nearby;
        
        if( group.length ){//分组
            var i, m;
            for( i=0; i<group.length; i++ ){
                m = group.eq(i);
                m.before('<dt>'+m.attr('label')+'</dt>').replaceWith(m.html());
            }            
        }
        HTML = $('<dl>'+this.nearby.html().replace(/(<\/?)option(>?)/ig, '$1dd$2')+'</dl>');
        group.length && HTML.addClass('group');
            
        this.length = list.length;
        _nearby = $([
            '<span class="nj_select" tabindex="-1"><i class="nj_s_wrap"></i><div class="nj_arrow"></div>',
                '<input type="hidden" name="'+this.nearby.attr('name')+'" value="'+this.value+'" class="hide" />',
            '</span>'
        ].join(''));
        this.nearby.replaceWith(_nearby);
        this.nearby = _nearby;
        
        this.set('content', HTML);
        this.current = this.nearby.find("i");
        this.hidden = this.nearby.find("input.hide");
        this.item = this.element.find('dd');
        
        this.init1();
    }
    ui.select.prototype.init1 = function(I){
        var self = this,
            h, maxH = 'auto',
            list = this.element.find('dl');
        
        h = this.item.last().outerHeight();
        if( this.max && /^\d+$/.test(this.max) ){//显示固定个数
            if( this.max < this.length ){
                list.css({"overflow-y":"scroll"});
                maxH = h * this.max;
                list.height(maxH);
            }
        }     
        self.autoWidth && this.nearby.width(this.element.width());
        
        !I && this.bindEvent();
        //设置默认选项
        !this.select(this.value, this.defaultEvent) && this.select( 0, this.defaultEvent );//没找到默认第一项
    }
    ui.select.prototype.bindEvent = function(){
        var self = this;
            
        this.on({
            mode : this.options.mode
        })
        this.element.click(function(e){
            var t = e.target,
                v = t.getAttribute('value');
                
            if( t.tagName.toLowerCase()=='dd' ){
                self.select(self.item.index(t));
                self.nearby.focus();
                self.hide();
            }
        })
        
        this.nearby.keydown(function(e){//键盘上下选择 回车选中
            if( e.which==38 ){
                self.index--;
            }else if( e.which==40 ){
                self.index++;
            }else if(e.which==13 ){
                self.hide();
            }else{
                return;
            }
            self.select(self.index);            
        })
    }
    ui.select.prototype.select = function(value, trigger){
        var current, m, i, val;
        
        if( typeof value=='string' ){//通过value值匹配
            val = this.content.find('dd[value="'+value+'"]');
            if( val.length ){
                current = val.first();
                this.index = current.index();
            }else{
                for( i=0; i<this.length; i++ ){
                    m = this.item.eq(i);
                    if( m.text() == value ){
                        current = m;
                        this.index = i;
                        break;
                    }
                }
            }
        }else if( typeof value=='number' ){//通过索引值匹配
            value = value<0 ? this.length-1 : value;
            value = value>this.length-1 ? 0 : value;
            this.index = value;
            current = this.item.eq(value);
            value = current.attr('value') || '';
        }
        if(!current){return;}
        
        this.current.text(current.text());
        current.addClass("select").siblings().removeClass("select");
        this.hidden.val(value);
        this.value = value;
        
        //为其添加事件
        trigger!==false && this.onSelect && this.onSelect.call(this, value);
        
        return current;
    }
    
	/*
	 * switch原型超类|幻灯片、选项卡等
	 */
	ui.Switch = function(dom,opt){
		if( isNew = instaceofFun(this,arguments) ){
			return isNew;
		}
		if( !(this.box = getDom(dom)) ){
			return;
		}
		this.M = this.box.find(".nj_s_menu").first();
		this.menu = this.M.find(".nj_s_m");
		this.C = this.box.find(".nj_s_con").first();
		this.con = this.C.children(".nj_s_c");
		this.length = this.con.length;
		if(!this.length){return;}
		this.opt = opt = opt || {};
		this.mode = opt.mode=='click'?'click':'mouseover';
		this.onChange = opt.onChange;
		this.index = opt.firstIndex || 0;
		this.rule = this.rule || opt.rule;
		this.init(dom,opt);
	}
	ui.Switch.prototype = {
		init : function(dom,opt){
			this.bind();
		},
		bind : function(){
			var T = this,
				A,m,
				delay = T.mode=='mouseover'?100:0;//延迟触发
				
			this.menu.on(this.mode,function(){
				m = $(this);
				if(m.hasClass('current')){return false;}
				A = setTimeout(function(){
					T.change(m.index());
				}, delay)
				return false;
			}).mouseout(function(){
				A = clearTimeout(A);
			})
			this.change(this.index);
		},
		change : function(index){
			index = index>(this.length-1) ? 0 : index;
			index = index<0 ? (this.length-1) : index;
			if(this.rule){
				this.rule.call(this, index);
			}else{
				this.con.eq(index).show().siblings().hide();
				this.menu.eq(index).addClass("current").siblings().removeClass("current");
			}
			this.index = index;
			this.onChange && this.onChange.call(this, index);
		}
	};
	
	/*
	 * slide幻灯片 继承至ui.Switch
	 */	
	ui.slide = function(id,opt){
		ui.slide.baseConstructor.call(this, id, opt);
		if( !this.box ){
			return;
		}
		this.getIndexNum = this.opt.getIndexNum==true?true:false;
		this.getIndexNum && this.getNum();
		this.play = null;
		this.time = this.opt.time || 5000;
		this.auto = this.opt.auto==false?false:true;
		this.stopOnHover = this.opt.stopOnHover==false?false:true;
		this.start(true);
	}
	Extend(ui.slide, ui.Switch);
	ui.slide.prototype.getNum = function(){
		var list = '';
		for(var i=1;i<=this.length;i++){
			list += '<li class="nj_s_m">'+i+'</li>';
		}
		this.M.append(list);
		this.menu = this.M.find('.nj_s_m');
		this.bind();
	}
	ui.slide.prototype.rule = function(index){
		//切换规则		
		this.con.eq(index).fadeIn(300).siblings().hide();
		this.menu.eq(index).addClass("current").siblings().removeClass("current");
		this.index = index;
	}
	ui.slide.prototype.start = function(startNow){
		//自动播放
		var T = this;
		if( this.auto && this.length>1 ){
			if(this.stopOnHover){				
				this.box.off().hover(function(){
					T.play = clearInterval(T.play);
				},function(){
					s();
				}).mouseout();
			}else{
				s();
			}
		}
		startNow && T.change(T.index);
		function s(){
			clearInterval(T.play);
			T.play = setInterval(function(){
				T.change(++T.index);
			},T.time);
		}
	}
	
	ui.ico = function(dom,opt){
		/*
		 * canvas/vml绘制的图标
		 */		
		if( isNew = instaceofFun(this,arguments) ){
			return isNew;
		}
		opt = $.extend( ui.config.ico, opt );
		this.hasCanvas = !!document.createElement('canvas').getContext;
		this.type = opt.type || 'ok';
		this.ico = $('<i class="nj_ico n_i_'+this.type+'"></i>');
		dom = getDom(dom);
		dom && dom.length && dom.empty();
		this.obj = dom || $('body:first');
		this.obj.append(this.ico);
		this.canvas = null;
		this.ctx = null;
		this.ico.css('visibility','hidden');
		this.width = opt.width||this.ico.width();
		this.height = opt.height||this.ico.height();
		if(!this.width||!this.height){return;}
		this.color = opt.color||this.ico.css('color');
		this.bgcolor = opt.bgcolor||this.ico.css('background-color');
		this.ico.removeAttr('style');
		this.ico.css({'background':'none','width':this.width,'height':this.height});
		this.createSpace();
	}
	ui.ico.prototype = {		
		createSpace : function(){
			var d = document;
			if(this.hasCanvas){
				this.canvas = d.createElement('canvas');
				this.ctx = this.canvas.getContext('2d');
				this.canvas.width = this.width;
				this.canvas.height = this.height;
				this.ico.append(this.canvas);
			}else{
				if(!ui.ico['iscreatevml']){//只创建 一次vml
					var s = d.createStyleSheet(),
						shapes = ['polyline','oval','arc','stroke','shape'];
					d.namespaces.add("v", "urn:schemas-microsoft-com:vml"); //创建vml命名空间
					for(var i=0;i<shapes.length;i++){
						s.addRule("v\\:"+shapes[i],"behavior:url(#default#VML);display:inline-block;");
					}
					ui.ico['iscreatevml'] = true;
				}
				this.ico.css('position','relative');
			}
			this.draw();
		},
		drawLine : function(point,fill,border){
			var i,n = point.length;
			if(this.hasCanvas){
				this.ctx.beginPath();
				this.ctx.moveTo(point[0],point[1]);
				for(i=2;i<n;i+=2){
					this.ctx.lineTo(point[i],point[i+1]);
				}
				this.ctx.stroke();
				fill&&this.ctx.fill();
			}else{
				var path = '',v = '';
				for(i=0;i<n;i+=2){
					path += point[i]+','+point[i+1]+' ';
				}
				v += '<v:polyline strokeWeight="'+border+'" filled="'+(fill?'true':'false')+'" class="polyline" strokecolor="'+this.color+'" points="'+path+'" ';
				if(fill){
					v += 'fillcolor="'+this.color+'"';
				}
				v += '/>';
				$(this.canvas).after(v);
			}
		},
		draw : function(){
			var startAngle,endAngle,border,point,
				p = Math.PI,
				width = this.width,
				height = this.height,
				color = this.color,
				bgcolor = this.bgcolor,
				ctx = this.ctx,
				canvas = this.canvas,
				type = this.type,
				d = document,
				T = this;
			if(type=='loading'){
				border = 3;
				if(this.hasCanvas){
					startAngle = p / 180;
					endAngle = 200*p / 180;
					ctx.strokeStyle = this.color;
					ctx.lineWidth = border;
					window.setInterval(function(){
						ctx.clearRect(0,0,width,height);
						startAngle += 0.2;
						endAngle += 0.2;
						ctx.beginPath();
						ctx.arc(width/2,height/2,width/2-border+1,startAngle,endAngle,false);
						ctx.stroke();
					},20);
				}else{
					startAngle = 0;
					border--;
					this.canvas = d.createElement('<v:arc class="oval" filled="false" style="left:1px;top:1px;width:'+(width-border*2+1)+'px;height:'+(height-border*2+1)+'px" startangle="0" endangle="200"></v:arc>');
					$(this.canvas).append('<v:stroke weight="'+border+'" color="'+color+'"/>');
					this.ico.append(this.canvas);
					window.setInterval(function(){
						startAngle += 6;
						startAngle = startAngle>360?startAngle-360:startAngle;
						T.canvas.rotation = startAngle;
					},15);
				}
			}else if(type=='ok'||type=='warn'||type=='error'||type=='close'){
				if(this.hasCanvas){
					ctx.beginPath();
					ctx.fillStyle = bgcolor;
					ctx.arc(width/2,height/2,width/2,p,3*p,false);
					ctx.fill();
					ctx.fillStyle = color;
					ctx.strokeStyle = color;
				}else{
					this.canvas = d.createElement('<v:oval class="oval" fillcolor="'+bgcolor+'" style="width:'+(width-1)+'px;height:'+(height-1)+'px;"></v:oval>');
					$(this.canvas).append('<v:stroke color="'+bgcolor+'"/>');
					this.ico.append(this.canvas);
				}
				
				if(type=='ok'){
					point = [0.26*width,0.43*height , 0.45*width,0.59*height , 0.71*width,0.33*height , 0.71*width,0.47*height , 0.45*width,0.73*height , 0.26*width,0.57*height];
					this.drawLine(point,true);
				}else if(type=='warn'){
					if(this.hasCanvas){
						ctx.beginPath();
						ctx.arc(width*0.5,height*0.73,width*0.07,p,3*p,false);
						ctx.stroke();
						ctx.fill();
					}else{
						this.ico.append('<v:oval class="oval" fillcolor="#fff" style="width:'+height*0.16+'px;height:'+height*0.14+'px;left:'+(height*($.browser('ie6 ie7')?0.43:0.4))+'px;top:'+(height*0.68)+'px"><v:stroke color="#fff"/></v:oval>');
					}
					point = [0.45*width,0.22*height , 0.55*width,0.22*height , 0.55*width,0.54*height , 0.45*width,0.54*height];
					this.drawLine(point,true);
				}else if(type=='error'||type=='close'){
					if(!this.hasCanvas){
						width = width*0.95;
						height = height*0.95;
					}
					point = [0.33*width,0.30*height , 0.5*width,0.46*height , 0.68*width,0.30*height , 0.72*width,0.34*height , 0.55*width,0.52*height , 0.71*width,0.68*height , 0.68*width,0.73*height , 0.5*width,0.56*height , 0.34*width,0.72*height , 0.29*width,0.69*height , 0.46*width,0.51*height , 0.29*width,0.34*height];
					this.drawLine(point,true);
					function bind(){
						if(T.hasCanvas){
							T.ico.hover(function(){
								ctx.clearRect(0,0,width,height);
								ctx.beginPath();
								ctx.fillStyle = color;
								ctx.strokeStyle = bgcolor;	
								ctx.arc(width/2,height/2,width/2,p,3*p,false);
								ctx.fill();
								ctx.stroke();
								ctx.fillStyle = bgcolor;
								T.drawLine(point,true);
							},function(){
								ctx.clearRect(0,0,width,height);
								ctx.beginPath();
								ctx.fillStyle = bgcolor;
								ctx.strokeStyle = bgcolor;
								ctx.arc(width/2,height/2,width/2,p,3*p,false);
								ctx.fill();
								ctx.stroke();
								ctx.fillStyle = color;
								ctx.strokeStyle = color;
								T.drawLine(point,true);
							})
						}else{
							T.ico.hover(function(){
								var a = $(this).find('.oval')[0],b = $(this).find('.polyline')[0];
								a.fillcolor = a.strokecolor = color;
								b.fillcolor = b.strokecolor = bgcolor;
							},function(){
								var a = $(this).find('.oval')[0],b = $(this).find('.polyline')[0];
								a.fillcolor = a.strokecolor = bgcolor;
								b.fillcolor = b.strokecolor = color;
							})
						}
					}
					type=='close'&&bind();
				}
			}else{
				//自定义绘图方法
				this['Draw'+type]&&this['Draw'+type]();
			}
		}
	}
	ui.ico.batch = function(obj,opt){
		/*
		 * 批量生成图标
		 */
		var i,m,len,j,ico = {},T=this;
		for(i in obj){
			m = obj[i];
			len = m.length;	
			if(len>1){
				for(j=0;j<len;j++){
					new T(i,m.eq(j),opt);
				}
			}else if(len==1){
				new T(i,m,opt);
			}else{
				continue;
			}
			ico[i] = m;	
		}
		return ico;
	}
	ui.ico.add = function(type,draw){
		/*
		 * 添加自定义绘图方法
		 */
		if(!ui.ico.prototype['Draw'+type]){
			ui.ico.prototype['Draw'+type] = draw;
		}
	}
	
	//placeholder for ie
	function placeHolder(input,index){
		var w = input.innerWidth()*0.98,
			h = input.outerHeight(),
			id = input.attr('id'),
			v = input.attr('placeholder'),
			lab;
			
		index = index || 0;	
		id = id || 'ph_lab'+index;		
		lab = $('<label for="'+id+'" style="width:'+w+'px;height:'+h+'px" class="ph_lab ph_lab'+index+'">'+v+'</label>');
		
		if( /.*\s{2}$/.test(v) && $.browser('ie6 ie7') ){//for ie6/7
			var F = input.css('float');
			input.wrap($('<span class="ph_wrap" style="position:relative;float:'+F+'"></span>'));
			lab.css('left','0');
		}
		if( input[0].tagName.toLowerCase()=='input' ){
			lab.css( 'line-height', h+'px' );
		}
		input.attr( 'id', id ).before(lab);		
		input.bind( 'blur propertychange', function(){
			setTimeout(function(){
				input.val()=='' ? lab.show() : lab.hide();
			},15)
		})
		setTimeout(function(){
			input.val()!='' && lab.hide();
		},150);
	};
	
	if( $.browser('ie6 ie7 ie8 ie9') ){
		$(function(){
			var ph = $('[placeholder]'), i;
			for( i=0; i<ph.length; i++ ){
				placeHolder( ph.eq(i), i );
			}
		});
	}
	
	return ui;
});