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
	 * nearby默认是window对象,即固定在屏幕上
	 * relative为true可设置为类似css的背景图定位方式,只限百分比
	 */	
	ui.align = function(options){
		this.options = options = options || {};
		this.element = getDom(options.element);
		this.nearby = getDom(options.nearby || window);
		this.position = options.position || (this.nearby[0]==window ? {top:50, left:50} : {top:100, left:0});
		this.relative = options.relative!=undefined ? options.relative : this.nearby[0]==window ? true : false;
		this.fixed = options.fixed==undefined && this.nearby[0]==window ? 'fixed' : options.fixed;//null fixed animate
		this.cssFixed = this.fixed=='fixed' && !$.browser('ie6') && this.nearby[0]==window;//直接使用css:fixed来定位
		this.offset = options.offset || [0,0];
		this.isWrap = this.nearby[0]==window || this.nearby.find(this.element).length;//对象是否在参考对象内部
		this.autoAdjust = options.autoAdjust;//超出屏幕后是否自动调整位置
		
		if( this.element ){
			this.bind();
		}
	}
	ui.align.prototype = {
		bind : function(){
			var self = this,
				ns = this.element.data('align'),
				element = this.nearby[0]==window ? this.nearby : this.nearby.add(window),
				type;
				
			if( ns ){
				element.off( '.'+ns );
			}else{
				ns = 'align'+(new Date()).getTime();
				this.element.data('align', ns);
			}
			type = 'resize.'+ns;
			if( !this.cssFixed && this.fixed ){
				type += ' scroll.'+ns;	
				if( this.nearby[0]!=window ){
					element = this.nearby;//无需绑定window scroll事件
				}
			}
			element.on( type, function(){
				self.set();
			});
			
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
			//console.log(this.element)
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
	 * 可延时显示，定时隐藏
	 */
	ui.overlay = function(options){
		ui.overlay.baseConstructor.call(this, options);		
		this.visible = false;//可视状态
		this.content = null;//内容区域
		this.arrow = this.options.arrow;//箭头 根据align对齐方式自动调整指向
		this.timeout = this.options.timeout;
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
	ui.overlay.prototype.init = function(){
		var self = this,
			_class = this.options.className;
			
		_class = typeof _class=='string' ? _class : '';//自定义class 多个用空格隔开
		
		this.element = $('<div class="nj_overlay '+_class+'"><div class="nj_overlay_wrap"></div></div>').appendTo(document.body).css({
			'display' : 'block',
			'visibility' : 'hidden'
		});
		this.content = this.element.find('.nj_overlay_wrap');
		
		if( this.arrow ){
			this.arrow.element = $('<div class="nj_overlay_arrow"></div>').appendTo(this.element);
			this.arrow.offset = this.arrow.offset || [0,0];
		}
		
		if( this.options.auto ){
			setTimeout(function(){
				self.show();
			}, this.options.auto);
		}
	}	
	ui.overlay.prototype.show = function(){
		if( this.visible ){
			return;
		}
		var self = this;
		
		this.element.css('visibility','visible');
		
		if( this.timeout ){
			this.autoHide = setTimeout(function(){
				self.hide();
			}, this.timeout)
		}
		this.visible = true;
		
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
	ui.overlay.prototype.hide = function(){
		if( !this.visible ){
			return;
		}
		this.element.css('visibility','hidden');
		this.autoHide = clearTimeout(this.autoHide);
		this.visible = false;
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
		options.className = (options.className || '')+' nj_win'; 
		ui.popup.baseConstructor.call(this, options);	
	    this.width = this.options.width || 400;//宽
	    this.close = null;//关闭按钮
	    this.title = null;//标题区
		this.operating = null;//操作区
		this.stillLayer = this.options.stillLayer || false;//隐藏后是否继续显示遮罩层
		this.layer = this.options.layer==false ? false : true;
		this.bindEsc = this.options.bindEsc == false ? false:true;
		this.onShow = this.options.onShow;
		this.onHide = this.options.onHide;
		this.create();
	}
	Extend(ui.popup, ui.overlay);
	Extend.proto(ui.popup, {
		bind : function(fn){
			var T = this;
			this.close.on('click',function(){T.hide();});//绑定关闭按钮事件
			if(this.bindEsc){
				$(window).on("keydown",function(e){//按下esc键隐藏弹窗
					T.element.is(":visible") && e.keyCode==27 && T.hide();
				})
			}
			$.onScroll( this.content[0] );	
			fn.call(this);
		},
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
			this.set();//重新计算高度并设置居中
			this.layer && ui.layer.show();
			fn.call(this);
			
			this.element.css({
				"margin-top":"-20px"
			})
			this.element.stop().animate({
				"margin-top":"0",
				"opacity":"1"
			}, 420, 'easeOutExpo');
			
			setTimeout(function(){
				callback && callback();
			}, 100);
			this.onShow && this.onShow();
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
			}, 150, 'easeOutExpo', function(){
				fn.call(T);
			});
			setTimeout(function(){
				callback && callback();
			}, 100);
	        !this.stillLayer &&	ui.layer.hide();
			this.onHide && this.onHide();
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
		this.bind();
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
	
	ui.select = function( dom, opt ){
		if( isNew = instaceofFun(this,arguments) ){
			return isNew;
		}
		/*
		 * 通用下拉列表,延迟200毫秒触发
		 * @opt:可选项{show:只显示几项,只接受整数，固定高度,onSelect:当选择某项的时候触发一个回调}
		 * 默认选中项根据隐藏域的value值来匹配
		 */		
		opt = $.extend( ui.config.select, opt );
		this.box = getDom(dom);
		if(!this.box){return;}
		ui.data( this.box[0].id, this );
		this.show = opt.show;
		this.maxH = "auto";//展开时的最大高度
		this.onSelect = opt.onSelect;//切换回调
		this.defaultEvent = opt.defaultEvent==true?true:false;//首次是否执行回调
		this.size = opt.size=='small'?'small':'big';
		this.autoWidth = opt.autoWidth==false?false:true;
		this.value = null;
		this.now = null;
		this.setCon();
	};
	ui.select.prototype = {
		setCon : function(){
			var HTML = this.box.html().replace(/OPTION|option/g,'li'),
				list = this.box.find('option'),
				html = '',m,
				link,
				style = this.box.attr('style'),
				v = this.box.attr("val")||this.box.val()||0,
				id = this.box[0].id||'',
				i,j;
			this.len = list.length;
			html = '<span class="nj_select"><span class="wrap"><i></i><div class="nj_arrow"></div><ul></ul>';
			html += '<input type="hidden" name="'+this.box.attr('name')+'" value="'+v+'" class="hide" />';
			html += '</span></span>';
			this.box.after(html);
			this.box.hide();
			this.box = this.box.next();
			this.box.prev().remove();
			this.box.attr({'style':style,'id':id});
			
			this.menu = this.box.find("ul");
			this.menu.html(HTML);
			this.m_on = this.box.find("i");
			this.hide = this.box.find("input.hide");
			
			this.size=='small' && this.box.addClass('nj_select_s');
			this.init();
		},
		init : function(I){
			this.m = this.menu.find('li');
			this.length = this.m.length;
			
			var _m,at,
				d = this.hide.val(),
				pd = parseInt(this.m_on.css("padding-left"))+parseInt(this.m_on.css("padding-right")),
				w1, w2 = 0, w3;
			this.m_on.removeAttr("style");
			this.menu.removeAttr("style").css({"display":"block"});
			
			for(var i=0;i<this.length;i++){
				_m = this.m.eq(i);
				w1 = _m.width();
				w2 = w1>w2 ? w1 : w2;
				if(_m.attr('href')){
					_m.wrapInner('<a href="'+_m.attr('href')+'" target="'+_m.attr('target')+'"></a>');
					_m.addClass("link");
				}
			}
			
			this.h = this.m.last().outerHeight();
			if(this.show && /^\d+$/.test(this.show)){//显示固定个数
				if(this.show<this.length){
					this.menu.css({"overflow-y":"scroll"});
					this.maxH = this.h * this.show - 1;
				}else{
					this.menu.css({"overflow-y":"hidden"});
					this.maxH = this.h * this.length - 1;
				}
				w3 = this.menu.width();
				if(w3 > (w2 + pd)){w2 = w3 - pd;}
			}
			
			
			if(this.autoWidth){
				this.menu.css('width',w2+pd);
				this.m_on.width(w2);
				//console.log(w2);
			}else{
				
				this.m_on.width(this.box.width()-pd-2);
				this.menu.width(this.box.width()-2);
			}
			
			this.menu.css({
				"height":this.maxH,
				"display":"none"
			})
			this.m.removeClass('last').last().addClass('last');
			if(!I){
				this.bindEvent();
			}
			//设置默认选项
			if(d.replace(/\s/g,"")!=""){
				this.select( d, this.defaultEvent );
			}else{
				this.select( this.m.eq(0).attr("value"), this.defaultEvent );
			}
		},
		bindEvent : function(){
			var T = this,A,top,style;
			
			this.box.hover(function(){
				window.clearTimeout(A);
				if( T.menu.is(':visible') ){
					return;
				}
				A = window.setTimeout(function(){
					style = T.menu.attr('style').replace('top','top1').replace('bottom','top1');
					T.menu.attr({'style':style}).css({"display":"none"});
					T.box.addClass('nj_select_hover');
					top = T.m_on.outerHeight()-1;
					if( (T.box.offset().top-$(window).scrollTop()+T.box.height()+T.menu.height()) > $(window).height() ){
						T.menu.css({'bottom':top});
					}else{
						T.menu.css( {'top':top} );
					}
					T.menu.show();
				},90)
			},function(){
				clearTimeout(A);
				A = setTimeout(function(){
					T.menu.hide()//.slideUp(150,'easeOutExpo');
					T.box.removeClass('nj_select_hover');
				},200)
			});
			
			this.menu.click(function(e){
				var m = e.target,
					text = $(m).text(),
					v = m.getAttribute('value');
				if(m.tagName.toLowerCase()=='li'){
					T.select(v);
				}
			})			
		},
		select : function(v,I){
			var M,text,m;
			for(var i=0;i<this.length;i++){
				m = this.m.eq(i);
				if(m[0].getAttribute('value')==v){
					M = m;
					text = m.text();
					break;
				}
			}
			if(!M){return;}
			this.m_on.text(text);
			M.addClass("select").siblings().removeClass("select");
			this.hide.val(v);
			this.value = v;
			this.now = M;
			this.menu.css({"display":"none"});
			
			if(I===false){return;}
			//为其添加事件
			this.onSelect&&this.onSelect.call(this,v,M);
		}
	}
	ui.select.batch = function(box,opt){
		/*
		 * 批量生成select组件(全部select只能统一设置,特殊情况时不能用此方法)
		 * @box:传入父元素对象即可
		 */
		if(!box||!box.length){return;}
		var s = box.find("select"),
			m,
			id,
			arr = [],
			n = s.length,
			d;
		if(!n){return;}	
		for(var i=0;i<n;i++){
			m = s.eq(i);
			id = m.attr("id");
			if(!id||id.replace(/\s/g,"")==""){
				id = "s_"+$.random();
				m.attr("id",id);
			}
			d = new this(id,opt);
			arr.push(d);
		}
		return arr;
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
					T.play = window.clearInterval(T.play);
				},function(){
					s();
				}).mouseout();
			}else{
				s();
			}
		}
		startNow && T.change(T.index);
		function s(){
			window.clearInterval(T.play);
			T.play = window.setInterval(function(){
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
		this.width = opt.width||this.ico.width();
		this.height = opt.height||this.ico.height();
		this.ico.css('visibility','hidden');
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
	
	ui.menu = function(obj,opt){
		/*
		 * 下拉菜单，动态创建html
		 */
		if( isNew = instaceofFun(this,arguments) ){
			return isNew;
		}
		//if(!obj||!obj.length){return;}
		this.opt = opt = $.extend( ui.config.menu, opt );
		this.obj = obj = getDom(obj);
		this.menu = null;
		this.content = opt.content || '';//菜单内容
		this.align = opt.align || 'left';//对齐方式
		this.mode = opt.mode || 'mouseover';
		this.offset = opt.offset || [0,0];
		this.autoWidth = opt.autoWidth === false ? false : true;
		//this.pos = this.offset[2] && this.offset[2].length ? this.offset[2] : this.obj;
		this.now = obj ? this.obj.eq(0) : null;
		this.agent = opt.agent === true ? true : false;//是否为事件代理模式
		this.disable = false;//是否禁用菜单
		this.init();
	}
	ui.menu.prototype = {
		init : function(){
			this.mode = this.mode == 'focus' ? 'focus click' : this.mode;
			
			this.menu = $('<div class="nj_menu"><div class="wrap clearfix"></div></div>');
			$('body').append(this.menu);
			this.setCon();
			this.bind();
			if( this.opt.className ){
				this.menu.addClass(this.opt.className);
			}
		},
		bind : function(){
			var T = this,
				s = this.mode=='mouseover',
				delay = s||this.mode=='focus'?60:0,
				top,left,
				A,B;
			
			if( !this.agent ){
				this.obj.on(this.mode,function(e){
					$.stopBubble(e);
					return show( $(this) );
				});
				if(s){
					this.obj.on('mouseout',function(){
						A = window.clearTimeout(A);
						hide();
					})
					this.menu.hover(function(){
						B = window.clearTimeout(B);
					},hide)
				}else if(this.mode=='focus'){
					this.obj.on('blur',function(){
						A = window.clearTimeout(A);
						hide();
					})				
				}
			}
			if(!s){
				this.menu.on('click',function(e){
					B = window.clearTimeout(B);
					$.stopBubble(e);
				})
				$(document).on('click',function(){
					T.menu.is(':visible') && hide();
				});
			}
			function show( pos ){
				if(T.disable){return false;}
				pos = pos || T.obj;
				
				if( T.mode=='click' && T.menu.is(':visible') ){
					if(T.now.is(pos)){
						hide();
						return false;
					}
					hide(true);
				}else{
					B = window.clearTimeout(B);
				}
				T.now = pos;
				
				A = window.setTimeout(function(){
					pos.addClass('nj_menu_hover');//.find('.nj_arrow').addClass('n_a_top');
					T.setPos();
					T.opt.onShow && T.opt.onShow.call(T,pos);
				},delay);
				if(!s){return false;}
			}
			
			function hide(S){
				function h(){
					T.now.removeClass('nj_menu_hover');//.find('.nj_arrow').removeClass('n_a_top');
					if( S!=true ){
						T.menu.hide();
					}
					T.opt.onHide && T.opt.onHide.call(T,T.now);
				}
				if( S==true ){
					h();
				}else{
					B = window.setTimeout(function(){
						h();
					},delay)
				}
			}
			this.show = show;
			this.hide = hide;
			
			$(window).on('scroll resize',function(){
				T.menu.is(':visible') && T.setPos();
			});
			this.menu.find('.close').on('click',function(e){
				T.hide();
				$.stopBubble(e);
			});
			(function(){
				//为列表项添加自定义事件
				var bind = T.opt.onSelect,
					i,m;
				if(!bind){return;}
				for(i in bind){
					m = T.menu.find('['+i+']');
					if(m.length){
						(function(i){
							m.bind('click',function(e){
								bind[i].call(T,$(this),e);
								return false;
							})
						})(i);
					}
				}
			})();
		},
		setPos : function(){
			var T = this,
				ph = this.now.outerHeight(),
				pt = this.now.offset().top,
				pl = this.now.offset().left,
				left = pl+this.offset[0],
				top = pt+ph+this.offset[1];

			if(this.align=='right'){
				left -= this.menu.outerWidth()-this.now.outerWidth();
			}
			this.menu.removeAttr('style').css({
				'left' : left,
				'top' : top,
				'z-index' : '999',
				'display':'block'
			})
			if(!this.autoWidth){
				this.menu.width(this.now.outerWidth());
			}
			(function(){
				var h = T.menu.outerHeight(),
					win = $(window),
					stop = win.scrollTop(),
					H = $(window).height();
				if(top+h-stop>H){
					top = pt-h;
					if(top<0){
						T.menu.css({'top':0,'overflow':'auto','height':pt-2-T.offset[1]});
						top = 0;
					}else{
						T.menu.css({'top':top-T.offset[1]});
					}
				}
			})();
		},
		setCon : function(con){
			con = con || this.content;
			this.menu.children('.wrap').empty().append(con);
		}
	};
	
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