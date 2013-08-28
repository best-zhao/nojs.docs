/*
 * nojs UI
 * 2013-7-30
 * nolure@vip.qq.com
 */
define(function( require, $ ){
	var UI = {};
	
	/*
	 * 触发方式
	 * 1.普通：直接执行相关方法，
	 * 2.区域初始化：通过在Elements上配置相应的属性初始化对应区域内所有ui组件，默认body区域
	 */
	
	
	UI.init = function( area ){
		area = area || $('body');
		
		var dom = area.find('[data-ui]'),
			i, elem, method, options;
			
		for( i=0; i<dom.length; i++ ){
			elem = dom[i];
			method = elem.getAttribute('data-ui');
			if( UI[method] ){
				if( options = elem.getAttribute('data-config') ){
					options = eval('({'+options+'})') || {};
					//elem.removeAttribute('data-config');
				}
				UI[method]( elem, options );
			}
		}	
	};
	
	var isNew, cache = {};
	function instaceofFun( fun, arg ){
		if( !(fun instanceof arg.callee) ){
			return Extend( arg.callee, Array.prototype.slice.call(arg) );
		}else{
			return false;
		}
	}
	
	//结合new和apply的方式
	function Extend( parent, args ) {
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
		var type = typeof selector, elem;
		if( type=='string' ){//通过id
			elem = $('#'+selector);
		}else if( type=='object' ){
			elem = selector.nodeType ? $(selector) : selector;
		}
		elem = elem.length ? elem : null;		
		return elem;
	}
	
	UI.data = function( id, Class ){
		if( Class ){//set
			cache[id] = Class;
		}else{
			return cache[id];
		}
	}
		
	UI.config = {};	
	
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
	
	//***********ui组件***********//
	UI.setPos = function( obj, pos, isFloat ){
		/*
		 * 设置浮动元素显示位置
		 * @obj:设置对象
		 * @pos:{top:top,left:left},默认{50,50}屏幕居中,top和left值范围0-100
		 * @isFloat:是否浮动 0不浮动，1动画 2固定
		 */
		if(!obj||!obj.length){return;}
		pos = pos || {};
		var W = obj.outerWidth(),
			H = obj.outerHeight(),
			win = $(window),
			T,L,
			top = pos.top==undefined ? 50 : pos.top,
			left = pos.left==undefined ? 50 : pos.left,
			isTop = typeof top=='number',
			isLeft = typeof left=='number',
			F = isFloat==0 ? 0 : isFloat || 2,
			win_w, win_h, sTop, sLeft, css = {},
			noIE6 = F==2 && !$.browser('ie6'),
			ns = obj.data('setpos');
		
		obj.css('position' , noIE6 ? "fixed" : "absolute");
		
		function getPos(){
			win_w = win.width();
			win_h = win.height();
			sTop = noIE6 ? 0 : win.scrollTop();
			sLeft = noIE6 ? 0 : win.scrollLeft();
			T = (isTop ? (win_h - H)*top/100 : parseInt(top,10)) + sTop;
			L = (isLeft ? (win_w - W)*left/100 : parseInt(left,10)) + sLeft;
			css[isTop||T>0 ? 'top':'bottom'] = Math.abs(T);
			css[isLeft||L>0 ? 'left':'right'] = Math.abs(L);
		}
		getPos();
		
		obj.css(css);
		function moveTo( resize ){
			if( obj.is(':hidden') ){
				return;
			}
			getPos();
			if(F==1){
				obj.stop().animate( css, 180 );
			}else if(F==2){
				obj.css(css);
			}
		}
		if( F ){
			if( ns ){
				win.off( '.'+ns );
			}else{
				ns = 'setpos'+(new Date()).getTime();
				obj.data('setpos',ns);
			}
			win.on( 'scroll.'+ns+' resize.'+ns, moveTo );
		}
	}
	
	UI.layer = function(){
		/*
		 * 遮罩层
		 */
		var w = $(window),
			layer = $("#nj_layer"),
			arr = { show : show, hide : hide, isShow : false };
		function init(){
			layer = $("body").append('<div id="nj_layer"></div>').find("#nj_layer");
	        layer.css({
				"opacity":"0"
			})
			S = function(){
				layer.css({
					width : w.width(),
					height : w.height()
				})
			}
			S();
			
			w.on( 'scroll resize', S );
			
			UI.setPos( layer, {top:0,left:0}, 2 );
			
			$.onScroll( layer[0] );
		}
		function show(){
			!layer.length && init();
			if( layer.is(":visible") ){
				return;
			}
			arr.self = layer;
			arr.isShow = true;
			layer.show().fadeTo( 200, 0.5 );
		}
		function hide(){
			arr.isShow = false;
			layer.fadeOut();
		}
		
		
		
		return arr;
	}();
	
	UI.win = function( opt ){
		/*
		 * 弹窗
		 */
		opt = $.extend( UI.config.win, opt );
	    this.w = opt.width || 400;//宽
	    this.self = null;//弹窗对象本身
	    this.close = null;//关闭按钮
	    this.tit = null;//标题区
	    this.con = null;//放置内容的容器对象    
		this.opt = null;//操作区		
		this.stillLayer = opt.stillLayer || false;//隐藏后是否继续显示遮罩层
		this.layer = opt.layer==false ? false : true;
		this.pos = opt.pos || { left:50 , top:50 };
		this.Float = opt.Float||opt.Float===0?opt.Float:2;
		this.bindEsc = opt.bindEsc==false?false:true;
		this.onShow = opt.onShow;
		this.onHide = opt.onHide;
		this.scroll = 0;
		this.init();
	}
	UI.win.prototype = {
		init : function(){	
			var me = this,
				id = 'nj_win_' + $.random(),
				win = [
					'<div id="'+id+'" class="nj_win"><div class="win_wrap">',
						'<span class="win_close"></span><div class="win_tit"></div>',
						'<div class="win_con"></div>',
						'<div class="win_opt"></div>',
					'</div></div>'
				];
			
			UI.win.item[id] = this;
			this.key = id;
			$("body").append(win.join(''));//插入到body中
			this.self = $("#"+id).css( {'width':me.w, 'opacity':'0'} );
			this.close = this.self.find(".win_close");
			this.tit = this.self.find(".win_tit");
			this.con = this.self.find(".win_con");
			this.opt = this.self.find(".win_opt");
			new UI.ico( this.close, {type:'close'} );
			this.bind();
		},
		bind : function(){
			var T = this;
			this.close.on('click',function(){T.hide();});//绑定关闭按钮事件
			if(this.bindEsc){
				$(window).on("keydown",function(e){//按下esc键隐藏弹窗
					T.self.is(":visible") && e.keyCode==27 && T.hide();
				})
			}
			$.onScroll( this.con[0] );			
		},		
	    setCon : function(tit,con,btns){
	    	/*
				设置标题、内容
		        @tit,con:会替换以前的
		        @btns:设置操作区按钮，为一个数组，数组项格式同this.getButton,如不设置或设置null则隐藏操作区
		    */
		   	tit && this.tit.html(tit);
		   	con && this.con.html(con);
		   	this.button = [];
			if(btns){
				this.opt.empty();//重设操作区
				for(var i=0;i<btns.length;i++){
					this.addBtn.apply( this, btns[i] );
				}
			}else if(this.opt.html().replace(/\s/g,"")==""){//不传入且未设置过操作区则隐藏操作区
				this.opt.css("display","none");
			}
	    },
		addBtn : function(text,callback,color){
			/*
				增加一个操作区按钮
				@text:按钮文字
				@color:按钮样式，即class类名
				@callBack:按钮click绑定的函数,"close"则为关闭
			*/			
			if( text===undefined ){
				return;
			}
			this.opt.is(":hidden") && this.opt.show();
			
			var T = this,
				btn = $('<a href=""></a>'),
				color = color?color:"";			
			if( typeof callback=='string' && callback!='close' ){//无回调时，第二个参数作为按钮颜色
				color = callback;
				callback = null;
			}	
			btn.attr({
				"class" : color=='no' ? '' : "nj_btn n_b_" + color
			});
			btn.html('<i>'+text+'</i>');
			this.opt.append(btn);
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
		},
	    show : function(callBack){ 
	    	/*
				显示弹窗
		        @callBack:可选参数，回调函数
		    */
			if( this.self.is(":visible") ){return;}
			UI.setPos( this.self, this.pos, this.Float );	//重新计算高度并设置居中 
			
			this.layer && UI.layer.show();
			
			this.self.css({
				"display":"block",
				"margin-top":"-20px"
			})
			this.self.stop().animate({
				"margin-top":"0",
				"opacity":"1"
			}, 420, 'easeOutExpo');
			setTimeout(function(){
				callBack && callBack();
			}, 100);
			this.onShow && this.onShow();
	    },
		/*
			隐藏弹窗
	        @callBack:可选参数，回调函数
	    */
	    hide : function(callBack){
			if( this.self.is(":hidden") ){return;}
			var T = this;
			/*
			 * onbeforehide:关闭之前确认，传入一个数组[fn,true/false]
			 * fn返回的布尔值;第二个参数true表示是否只有当fn为true时才关闭窗口,false均关闭
			 */
			if(this.onbeforehide && !this.onbeforehide[0]()){			
				if( this.onbeforehide[1] ) {return false;}
			}//关闭之前确认
			this.self.animate({
				"margin-top":"-20px",
				"opacity":"0"
			}, 120, 'easeOutExpo', function(){
				T.self.hide();
			});
			setTimeout(function(){
				callBack && callBack();
			}, 100);
	        !this.stillLayer &&	UI.layer.hide();
			this.onHide && this.onHide();
	    }
	}
	UI.win.item = {};//保存所有弹框实例对象
	UI.win.clear = function(key){
		//清空弹框对象
		if(key){
			var win = UI.win.item[key];
			win&&clear(win);
		}else{
			for(var i in UI.win.item){
				clear( UI.win.item[i] );
			}
			UI.win.item = {};
			UI.msg.win = null;
		}
		function clear( win ){
			win.self.remove();
			win = null;
		}
	}
	
	UI.msg = function(){
		/*
		 * 消息提示框
		 */
		var Win = {};
		return {
			show : function( type, tip, opt ){
				opt = opt || {};
				var T = this,
					btn = opt.btn,
					time = opt.time || 1600,
					C = type=='confirm',
					tit = C ? '温馨提醒：' : null,
					w = opt.width || (C ? 400 : 'auto'),
					autoHide = opt.autoHide==false ? false : true,
					win = Win[type];
				
				//隐藏其他
				this.hide( type, true );
				this.hide();
				
				tip = tip || '';
				if(type=='loading'){
					tip = tip||'正在处理请求,请稍候……';
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
				if( !win ){
					win = new UI.win({
						width : w,
						bindEsc : false
					});
					
					win.self.addClass('msg_tip_win');
					win.self.find('div.win_wrap').attr({'class':'win_wrap msg_tip_'+type});
					win.self.width(w);
					win.layer = C ? true : false;
					win.stillLayer = C ? false : true;
					
					win.setCon( tit, '<div class="con clearfix"><i class="tip_ico"></i><span class="tip_con"></span></div>');
					new UI.ico( win.con.find('i.tip_ico'),{type:C ? 'warn' : type} );
					Win[type] = win;
				}				
				
				if(!btn){
					win.opt.hide().empty();//重设操作区
				}
				win.setCon( null, null, btn );
				win.con.find('.tip_con').html(tip);
				win.show();
				if(C){
					win.button[0].focus();
				}
				
				//自动隐藏
				this.timeout = clearTimeout(T.timeout);
				if( autoHide && type!='confirm' && type!='loading' ){
					this.timeout = setTimeout(function(){
						win.hide();
					}, time)
				}
				if( opt.reload ){
					T.timeout = clearTimeout(T.timeout);
					setTimeout(function(){
						if( opt.reload===true ){
							window.location.reload();
						}else if( typeof opt.reload=='string' ){
							window.location.href = opt.reload;
						}
					}, 1500)
				}
			},
			hide : function( type, now ){
				if( type && Win[type] ){
					(now ? Win[type].self : Win[type]).hide();
				}else{
					for( var i in Win ){
						Win[i].hide();
						now && Win[i].self.hide();
					}
				}
			}		
		}
	}();
	
	UI.select = function( dom, opt ){
		if( isNew = instaceofFun(this,arguments) ){
			return isNew;
		}
		/*
		 * 通用下拉列表,延迟200毫秒触发
		 * @opt:可选项{show:只显示几项,只接受整数，固定高度,onSelect:当选择某项的时候触发一个回调}
		 * 默认选中项根据隐藏域的value值来匹配
		 */		
		opt = $.extend( UI.config.select, opt );
		this.box = getDom(dom);
		if(!this.box){return;}
		UI.data( this.box[0].id, this );
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
	UI.select.prototype = {
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
				window.clearTimeout(A);
				A = window.setTimeout(function(){
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
	UI.select.batch = function(box,opt){
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
	
	UI.Switch = function(dom,opt){
		/*
		 * switch原型超类|幻灯片、选项卡等
		 * @id:容器id
		 * 子类不能通过该构造函数传递参数，所以使用init方法来传递
		 */
		if( isNew = instaceofFun(this,arguments) ){
			return isNew;
		}
		this.box = getDom(dom);
		this.init(id,opt);
	}
	UI.Switch.prototype = {
		init : function(dom,opt){
			this.box = getDom(dom);
			if(!this.box.length){return;}
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
				this.rule.call(this,index);
			}else{
				this.con.eq(index).show().siblings().hide();
				this.menu.eq(index).addClass("current").siblings().removeClass("current");
			}
			this.index = index;
			if(this.onChange){this.onChange.call(this,index);}
		}
	};
	
	UI.slide = function(id,opt){
		/*
		 * switch扩展: slide幻灯片
		 */	
		this.init(id,opt);
		if(!this.box.length){return;}
		this.getIndexNum = this.opt.getIndexNum==true?true:false;
		this.getIndexNum && this.getNum();
		this.play = null;
		this.time = this.opt.time || 5000;
		this.auto = this.opt.auto==false?false:true;
		this.stopOnHover = this.opt.stopOnHover==false?false:true;
		this.start(true);
	}
	UI.slide.prototype = new UI.Switch();
	UI.slide.prototype.constructor = UI.slide;
	UI.slide.prototype.getNum = function(){
		var list = '';
		for(var i=1;i<=this.length;i++){
			list += '<li class="nj_s_m">'+i+'</li>';
		}
		this.M.append(list);
		this.menu = this.M.find('.nj_s_m');
		this.bind();
	}
	UI.slide.prototype.rule = function(index){
		//切换规则		
		this.con.eq(index).fadeIn(300).siblings().hide();
		this.menu.eq(index).addClass("current").siblings().removeClass("current");
		this.index = index;
	}
	UI.slide.prototype.start = function(startNow){
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
	
	UI.ico = function(dom,opt){
		/*
		 * canvas/vml绘制的图标
		 */		
		if( isNew = instaceofFun(this,arguments) ){
			return isNew;
		}
		opt = $.extend( UI.config.ico, opt );
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
	UI.ico.prototype = {		
		createSpace : function(){
			var d = document;
			if(this.hasCanvas){
				this.canvas = d.createElement('canvas');
				this.ctx = this.canvas.getContext('2d');
				this.canvas.width = this.width;
				this.canvas.height = this.height;
				this.ico.append(this.canvas);
			}else{
				if(!UI.ico['iscreatevml']){//只创建 一次vml
					var s = d.createStyleSheet(),
						shapes = ['polyline','oval','arc','stroke','shape'];
					d.namespaces.add("v", "urn:schemas-microsoft-com:vml"); //创建vml命名空间
					for(var i=0;i<shapes.length;i++){
						s.addRule("v\\:"+shapes[i],"behavior:url(#default#VML);display:inline-block;");
					}
					UI.ico['iscreatevml'] = true;
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
	UI.ico.batch = function(obj,opt){
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
	UI.ico.add = function(type,draw){
		/*
		 * 添加自定义绘图方法
		 */
		if(!UI.ico.prototype['Draw'+type]){
			UI.ico.prototype['Draw'+type] = draw;
		}
	}
	
	UI.menu = function(obj,opt){
		/*
		 * 下拉菜单，动态创建html
		 */
		if( isNew = instaceofFun(this,arguments) ){
			return isNew;
		}
		//if(!obj||!obj.length){return;}
		this.opt = opt = $.extend( UI.config.menu, opt );
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
	UI.menu.prototype = {
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
		input.bind( 'blur propertychange input', function(){
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
			var ph = $('[placeholder]'),
				i,
				len = ph.length;
			if(len){
				for(i=0;i<len;i++){
					placeHolder( ph.eq(i), i );
				}
			}
		});
	}
	
	return UI;
});