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
		this.area = options.area || _window;
		this.attr = options.attr || 'data-lazyload';
		this.init();
	}
	lazyload.prototype = {
		init : function(){
			var _this = this, A;
			
			this.area.on("scroll.lazyload resize.lazyload", function(){
				clearTimeout(A);
				A = setTimeout(function(){
					_this.load();
				}, 15)
			});
			this.load();
		},
		load : function(f,isCtrl){
			var area = this.area[0]===window ? _document : this.area;
			f = f || area.find('img['+this.attr+']').css('opacity',0.2);
			
			//如全部加载完则解除绑定滚动事件
			if( !f.length && $.isReady ){
				this.area.off("scroll.lazyload resize.lazyload");
				return;
			}
			var _this = this,
				m, top, h, src,
				P = this.position(),
				t1, t2, t3,
				Top = this.area[0]===window ? 0 : this.area.offset().top;
				
			function show(i){
				m = f.eq(i);
				if(!m.length){return;}
				src = m.attr(_this.attr);
				
				if( src ){
					m.off('load.lazyload').on('load.lazyload',function(){
						$(this).removeAttr(_this.attr).fadeTo(200,1);
						_this.options.onload && _this.options.onload.call(this);
						$(this).off('load.lazyload');
					})
					if( !isCtrl ){
						if( Top>0 ){
							P.top = 0;
						}
						top = m.offset().top - Top;
						t1 = top>P.top && top<P.height+P.top;//图片上半部分出现在可视区域
						t2 = (m.outerHeight()+top)<P.height && (m.outerHeight()+top)>=0;//图片下半部分出现在可视区域
						t3 = top<=0 && (m.outerHeight()+top)>P.height; 
						
						if( t1 || t2 || t3  ){
							m.attr("src", src);
						}
					}else{
						m.attr("src",src);
					}
				}
				i++;
				//重新获取未加载图片
				file = area.find('img['+_this.attr+']');
				setTimeout(function(){
					show(i);
				}, 10)
			}
			show(0);
		},
		position : function(){
			var area = this.area;
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
