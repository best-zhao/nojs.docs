/*
 * lazyload图片延迟加载
 * nolure@vip.qq.com
 * 2013-9-5
 */
define(function(require,$){
	var _window = $(window),
		_document = $(document);
	
	function lazyload(options){
		this.options = options = options || {};
		this.scroll = options.scroll || _window;//滚动区域
		this.area = options.area || (this.scroll[0]===window?_document:this.scroll);//获取图片的区域，默认同滚动区域
		this.attr = options.attr || 'data-lazyload';
		this.init();
	}
	lazyload.prototype = {
		init : function(){
			var _this = this, A;
			
			this.scroll.on("scroll.lazyload resize.lazyload", function(){
				clearTimeout(A);
				A = setTimeout(function(){
					_this.load();
				}, 15)
			});
			this.load();
		},
		load : function(f,isCtrl){
			f = f || this.area.find('img['+this.attr+']').css('opacity',0.2);
			
			//如全部加载完则解除绑定滚动事件
			if( !f.length && $.isReady ){
				this.scroll.off("scroll.lazyload resize.lazyload");
				return;
			}
			var _this = this,
				m, top, h, src,
				P = this.position(),
				t1, t2, t3,
				Top = this.scroll[0]===window ? 0 : this.scroll.offset().top;
				
			function show(i){
				m = f.eq(i);
				if(!m.length){return;}
				src = m.attr(_this.attr);
				
				if( src ){
					if( !isCtrl ){
						if( _this.scroll[0]!==window ){
							P.top = 0;
						}
						top = m.offset().top - Top;
						t1 = top>P.top && top<P.height+P.top;//图片上半部分出现在可视区域
						t2 = (m.outerHeight()+top)<P.height && (m.outerHeight()+top)>=0;//图片下半部分出现在可视区域
						t3 = top<=0 && (m.outerHeight()+top)>P.height; 
						
						if( t1 || t2 || t3  ){
							set(m, src);
						}
					}else{
						set(m, src);
					}
				}
				i++;
				//重新获取未加载图片
				file = _this.area.find('img['+_this.attr+']');
				setTimeout(function(){
					show(i);
				}, 10)
			}
			function set(m, src){
				m.off('load.lazyload error.lazyload').on('load.lazyload error.lazyload',function(){
					$(this).fadeTo(200,1);
					_this.options.onload && _this.options.onload.call(this);
					$(this).off('load.lazyload error.lazyload');
				})
				m.attr("src",src).removeAttr(_this.attr);
			}
			show(0);
		},
		position : function(){
			var area = this.scroll;
			return {
				width : area.width(),
				height : area.innerHeight(),
				top : area.scrollTop(),
				left : area.scrollLeft()
			}
		}
		
	}
	
	return lazyload;
});
