/*
 * 对象拖拽
 */
define(function( require, $ ){
	$.addCss('.addIndex{z-index:99999}');
	
	var drag = function(drag,move,opt){
		/*
		 * 元素拖拽
		 * drag:拖拽对象，jquery对象
		 * move:拖动可控制区域，不传则整个拖拽对象都可拖动
		 */
		this.drag = drag;//拖拽对象
		this.opt = opt = opt || {};
		this.move = move ? move : drag;//拖拽控制区
		
		this.delegat = opt.delegat===true ? true : false;//设置一个区域使用事件委托使其内部元素可拖动
		this.setDrag = opt.setDrag;//设置一个或一组对象为一个拖拽整体，使用于多个对象合并
		
		this.moveing = false;//拖动状态
		
		this.onDragDown = null;//鼠标按下触发事件
		this.onDragStart = null;//开始拖拽事件
		this.MoveEvent = null;//鼠标移动触发事件
		this.UpEvent = null;//鼠标松开触发事件
		
		this.dragLastPos = [];//对象初始位置
		this.dragNowPos = [];//对象当前位置
		this.mouseLastPos = {};//鼠标初始位置
		this.disable = false;//是否禁用
		this.limit = opt.limit;//范围限制区域 对象
		this.wrap = opt.wrap;//当drag父元素中存在position属性为非static时，设置为其wrap对象,让drag相对于wrap定位
		this.overflow = opt.overflow;
		this.A = null;
		
		this.delay = this.opt.delay || 6;
		if(!this.delegat){
			if(move){
				this.move.css("cursor","move");
			}else{
				this.drag.css("cursor","move");
			}
		}
		var T = this;
		
		//绑定鼠标按下事件
		this.move.bind("mousedown.drag",function(e){T.DragDown(e)});
	}
	drag.prototype = {
		//鼠标按下
		DragDown : function(e){
			if( this.disable ){
				return false;
			}
			
			e = e || window.event;
			var T = this,
				tag = $(e.target),
				s,m,has,i,len,
				x,y,w,h;
			if(this.delegat){
				if( tag.attr('isdrag') || tag.attr('isdragmove') ){
					this.drag = tag.attr('isdragmove') ? tag.closest('[isdrag]') : tag;
				}else{
					this.drag = null;
				}
			}
			
			if(!this.drag||!this.drag.length){return;}
			
			if( this.onDragDown && this.onDragDown.call(this)==false ){
				return false;
			}
			
			this.moveing = true;//拖动状态
			this.dragNowPos = [];//清空上次位置
			this.dragLastPos = [];
			this.maxSize = {
				L : [],//最左left
				T : [],//最上top,
				B : [],//最下边界,
				R : [],//最右边界
				W : null,//总宽度
				H : null //总高度
			};
			
			//当有多个对象一起移动并且有边界限制时 设置this.group可只限制部分对象不超出边界
			this.group = this.group || this.drag;
			this.drag.addClass('addIndex');
			
			for( i=0, len = this.drag.length; i<len; i++ ){
				m = this.drag.eq(i);
				s = m.css("position")==='static';
				x = s ? m.offset().left : (parseInt(m.css("left"),10)||0);
				y = s ? m.offset().top : (parseInt(m.css("top"),10)||0);
				
				if( this.wrap && this.wrap.length ){
					x -= this.wrap.offset().left - this.wrap.scrollLeft();
					y -= this.wrap.offset().top - this.wrap.scrollTop();
				}
				
				w = m.outerWidth();
				h = m.outerHeight();
				this.dragLastPos.push({//拖拽对象位置初始化
					x : x,
					y : y
				})
				
				//m.data('dragLastPos',this.dragLastPos);
				s && m.css({"position":"absolute"});
				m.css({"left":x,"top":y});
				
				if( this.group && !m.is(this.group) ){
					continue;
				}
				this.maxSize.L.push(x);
				this.maxSize.T.push(y);
				this.maxSize.R.push(x+w);
				this.maxSize.B.push(y+h);
			}
			
			$.stopDefault(e);
			
			//取出边界值   |单个对象时为其自身边界|
			//多个对象时为最大边界   可取多个对象一部分作为最大边界 this.group
			this.maxSize.L = Math.min.apply(null,this.maxSize.L);
			this.maxSize.T = Math.min.apply(null,this.maxSize.T);
			this.maxSize.W = Math.max.apply(null,this.maxSize.R)-this.maxSize.L;
			this.maxSize.H = Math.max.apply(null,this.maxSize.B)-this.maxSize.T;
			
			if(this.limit){//有边界限制时
				this.maxSize.l = this.limit.offset().left+parseInt(this.limit.css('border-left-width'));
				this.maxSize.t = this.limit.offset().top+parseInt(this.limit.css('border-top-width'));
				if( this.limit.css("position")!=='static' && this.limit.find(m).length ){
					this.maxSize.l = this.maxSize.t = 0;
				}
				//最大可移动宽高
				this.maxSize.w = this.limit.innerWidth()-this.maxSize.W+this.maxSize.l;
				this.maxSize.h = this.limit.innerHeight()-this.maxSize.H+this.maxSize.t;
				
				if(this.overflow){//边界溢出
					this.maxSize.l -= this.overflow;
					this.maxSize.t -= this.overflow;
					this.maxSize.w += this.overflow;
					this.maxSize.h += this.overflow;
				}
			}
			
			this.mouseLastPos = {//鼠标最后位置初始化
				x : e.clientX,
				y : e.clientY
			}
			
			if( this.onDragStart && this.onDragStart.call(this)==false ){
				return false;
			}
			$(document).bind("mousemove.drag",function(e){T.DragMove(e)}).bind("mouseup.drag",function(e){T.DragUp(e)});
		},
		//鼠标移动
		DragMove : function(e){
			if( this.moveing && !this.disable && this.drag ){
				e = e || window.event;
				$.stopDefault(e);				
				
				var i,m,pos,x,y,
					c = {//鼠标偏移量
						x : e.clientX - this.mouseLastPos.x,
						y : e.clientY - this.mouseLastPos.y
					},
					cx = c.x,
					cy = c.y,
					len = this.drag.length,
					T = this;
				
				//边界限制
				if(this.limit){
					x = this.maxSize.L + cx;
					y = this.maxSize.T + cy;
					c.x = x<this.maxSize.l ? this.maxSize.l - this.maxSize.L : cx;
					c.x = x>this.maxSize.w ? this.maxSize.w - this.maxSize.L :c.x;
					c.y = y<this.maxSize.t ? this.maxSize.t - this.maxSize.T : cy;
					c.y = y>this.maxSize.h ? this.maxSize.h - this.maxSize.T : c.y;
				}
				
				if(this.setOffset){
					c = this.setOffset.call(this,c);
				}
				cx = c.x;
				cy = c.y;
				
				for(i=0;i<len;i++){
					m = this.drag.eq(i);
					pos = this.dragLastPos[i];
					//拖拽对象座标更新(变量)
					this.dragNowPos[i] = {
						x : pos.x+cx,
						y : pos.y+cy
					};
					m.css({//拖拽对象座标更新(位置)
						"left": this.dragNowPos[i].x,
						"top": this.dragNowPos[i].y
					});
				}
				
				if(this.MoveEvent){
					//函数节流处理
					clearTimeout(T.A);
					T.A = setTimeout(function(){
						T.MoveEvent.call(T,{
							x : cx,
							y : cy,
							w : T.maxSize.W,
							h : T.maxSize.H
						});
					}, T.delay);
				}
			}
		},
		//鼠标松开
		DragUp : function(e){
			if( !this.disable ){
				var T = this;
				this.moveing = false;	//拖动状态	
				$(document).off("mousemove.drag mouseup.drag");//注销鼠标事件
				this.drag.removeClass('addIndex');
				T.A = clearTimeout(T.A);
				this.UpEvent && this.UpEvent.call(this);
				this.maxSize = this.dragLastPos = this.dragNowPos = null;
				$.stopDefault(e);
			}
		}
	}
	return drag;
});
