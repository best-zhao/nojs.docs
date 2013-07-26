/*
 * 无间断滚动
 */
define(function( require, $ ){
		
	var scroll = function(id,opt){
		opt = opt || {};
		this.box = $('#'+id);
		if(!this.box.length){return;}
		this.wrap = this.box.find('.nj_s_wrap');
		this.con = this.wrap.find('.nj_s_con');
		this.item = this.con.children();
		this.len = this.item.length;
		this.direction = opt.direction || 'x';//滚动方向，默认水平
		this.step = typeof opt.step!=='undefined' ? parseInt(opt.step) : 1;//滚动步长，0为连续滚动
		this.time = opt.time || 4000; //滚动速度，连续推荐设置40ms ;间断滚动时，该值为滚动的间隔时间
		this.size = {
			box : this.direction=='x'?this.wrap.width():this.wrap.height(),//容器尺寸
			total : this.direction=='x'?null:this.con.height(),//内容总尺寸
			item : this.direction=='x'?this.item.outerWidth(true):this.item.outerHeight(true)//单项尺寸
		}
		
		this.view = Math.floor(this.size.box/this.size.item);	//可见区域的个数	
		this.repeat = opt.repeat || false;//是否重复循环
		this.auto = opt.auto==true?true:false;
		this.onScroll = opt.onScroll;
		this.init();
	}
	scroll.prototype = {
		init : function(){
			var T = this,
				newLen;
			
			if(this.len > this.view) {
				/*
				 * 循环滚动时： 总数为偶数 拷贝 ，可视区域个数； 为奇数， 拷贝总数
				 * 
				 */
				this.repeat && this.item.slice( 0, (this.len%2!=0&&this.view>1)?this.len:this.view ).clone().appendTo(this.con);
				if(this.direction == "x") {
					newLen = this.repeat ? (this.len+((this.len%2!=0&&this.view>1)?this.len:this.view)) : this.len;
					this.size.total = newLen * this.size.item;	
					this.con.css({"width":this.size.total});
				}else{
					this.size.total = this.con.height();
				}
				this.start();
			}else{
				return;
			}
			this.box.hover(function(){
				T.stop();
			},function(){
				T.start();
			})
		},
		start : function(){
			var T = this;
			if (this.auto && this.len>this.view) {
				clearInterval(T.A);
				this.A = setInterval(function(){
					T.scroll();
				},T.time);
			}
		},
		stop : function(){
			this.A = clearInterval(this.A);
		},
		scroll : function(a){
			if(this.box.is(":animated")) {return;}
			var T = this,
				m,timer,a = a || "+";//每次滚动距离，连续-每次增加1px，间隔-每次增加n个元素的宽高
			if (this.step == 0) {
				m = 1;
				timer = 0;
			} else {
				m = this.step * this.size.item;
				timer = this.step*400;
			}
			if(a=="-") {m = -m;}
			
			if(this.direction == "x" ) {
				this.scrollLeft = this.wrap.scrollLeft() + m;				
				
				this.wrap.animate({scrollLeft:"+="+m},timer,'easeOutExpo',function(){
					if(T.wrap.scrollLeft() >= T.size.item*(T.len-(T.repeat?0:T.view))) {
						T.repeat && T.wrap.scrollLeft(0);
						T.repeat && T.step==0 && T.scroll();
					}
					
				});
			}else{
				this.scrollTop = this.wrap.scrollTop() + m;
				
				this.wrap.animate({scrollTop:"+="+m},timer,'easeOutExpo',function(){
					if( T.wrap.scrollTop() >= 
						T.size.item * ( T.len - (T.repeat ? 0 : T.view) ) 
					){
						T.repeat && T.wrap.scrollTop( T.wrap.scrollTop()-T.len*T.size.item );
						T.repeat && T.step==0 && T.scroll();
					}
				});
			}
			T.onScroll && T.onScroll();
		}
	}
	
	return scroll;
});
