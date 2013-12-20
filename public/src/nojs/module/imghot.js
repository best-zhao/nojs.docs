/*
 * 图像热区绘制工具
 */
define(function(require,$,ui){
	var drag = require('nojs/module/drag'),
		codeLight = require('nojs/module/codelight');
	imgHot = function(id,opt){
		opt = opt || {};
		this.box = $('#'+id);
		if(!this.box.length){return;}
		this.btn = opt.btn;
		this.wrap = this.box.find('.wrap');
		this.imgWrap = this.box.find('.img_wrap');
		this.codeWrap = this.box.find('.code_wrap');
		this.arr = null;
		this.img = null;
		this.select = null;
		this.rate = 1;//图片缩放比率
		this.state = this.box.find('.state');
		this.setMode = this.state.find('.mode');//切换模式按钮
		this.prevBox = this.wrap.find('.preview');
		this.isBInd = false;
		this.init();
	}
	imgHot.prototype = {
		init : function(isFirst){
			var T = this;
			this.img = this.imgWrap.children('img');
			if(!this.img.length){return;}
			//this.setImg();
			this.arr = [
				'<script type="text/templete" code="html" key="Map">',
					'<img src="" alt="" usemap="#Map" />',
					'<map name="Map" id="Map">',
				'</map></script>'
			]
			this.codeWrap.html(this.arr.join('\n'));
			this.img.bind('click blur',function(){
				T.choose();//取消选中
			}).bind('keydown',function(e){				
				//绑定键盘事件
				var hot = T.imgWrap.find('.current'),
					s = true;
				if(!hot.length){return;}
				switch(e.keyCode){
	                case 37://left
						parseInt(hot.css('left'))>0 ? hot.animate({'left':'-=1'},0) : s = false;
						break;
	                case 38://up
	                	parseInt(hot.css('top'))>0 ? hot.animate({'top':'-=1'},0) : s = false;
	                	break;
	                case 39://right
	                	parseInt(hot.css('left'))+hot.width()<T.imgWrap.width() ? hot.animate({'left':'+=1'},0) : s = false;
	                	break;
	                case 40://down
	                	parseInt(hot.css('top'))+hot.height()<T.imgWrap.height() ? hot.animate({'top':'+=1'},0) : s = false;
	                	break;
	                case 46://del
	                    T.del(hot);
	                    s = false;
	                    break;
	                default :
	                	s = false;
	                	break;
	            }
	            if(s){
	            	e.preventDefault();
	            	T.showCode(hot,true);
	            }
			}).bind('keyup',function(e){
				
			})
			
			this.draw();
			!this.isBInd&&this.bind();
		},
		bind : function(){
			var T = this;
			this.isBInd = true;
			//设置热区可拖动
			this.drag = new drag(this.imgWrap,null,{
				delegat : true,
				limit : this.imgWrap
			})
			//拖拽结束回调
			this.drag.UpEvent = function(){
				T.showCode(this.drag,true);
			}
			
			//选中选区
			this.imgWrap.on('click',function(e){
				var t = e.target,
					m = $(t),
					index,area;
				
				e.stopPropagation();
				if(t.tagName.toLowerCase()=='div'&&m.hasClass('hotarea')){
					T.choose(m);
				}
				T.img.focus();
			})
			this.codeWrap.on('click',function(e){
				if($(this).find('.edit').length){return;}//编辑状态 不关联选中
				var t = e.target,
					m = $(t),
					index,area;
					
				e.stopPropagation();
				if(t.tagName.toLowerCase()=='li'||m.closest('li').length){
					m.closest('li').length && (m = m.closest('li'));
					index = m.index();
					if(index>1&&m.next('li').length){
						T.choose(T.imgWrap.find('.hotarea').eq(index-2));
					}
				}
			});
			
			//切换模式
			this.setMode.click(function(){
				if(T.box.hasClass('hot_prev_mode')){
					$(this).html('<i>预览</i>');
					T.box.removeClass('hot_prev_mode');
				}else{
					$(this).html('<i>编辑</i>');
					T.box.addClass('hot_prev_mode');
					T.preview();
				}
				return false;
			})		
			
		},
		preview : function(){
			//预览模式 
			this.prevBox.empty();
			
			var img = this.img.clone().removeAttr('style'),
				id = 'img_hot_map',i,
				n = this.arr.length-1,
				list = '<map name="'+id+'" id="'+id+'">';
			img.attr({'usemap':id});
			for(i=3;i<n;i++){
				list += this.arr[i];
			}
			list += '</map>';
			this.prevBox.append(img).append(list);
		},
		setImg : function(){
			//缩放图片,限制最大宽高
			var w = this.wrap.width(),
				h = this.wrap.height(),
				k = w/h,
				W = this.img.width(),
				H = this.img.height(),
				K = W/H,
				b;
			if(K>k&&W>w){
				b = w/W;
				W = w;
				this.img.width(w);
				H = this.img.height();
			}else if(K<=k&&H>=h){
				b = h/H;
				H = h;
				this.img.height(h);
				W = this.img.width();
			}
			this.rate = b;
			this.state.find('.rate').html('图片缩放比例：'+(b*100).toFixed(2)+'%');
			this.imgWrap.css({
				'margin-left' : -W/2,
				'margin-top' : -H/2
			})
		},
		choose : function(area){
			//选中该选区
			if(area){
				var index = area.index();
				area.addClass('current').find('.point').show().end().siblings().removeClass('current').find('.point').hide();
				this.codeWrap.find('li').eq(index+1).addClass('current').siblings().removeClass('current');
				this.img.focus();
			}else{//取消选中
				this.imgWrap.children('').removeClass('current').find('.point').hide();
				this.codeWrap.find('li').removeClass('current');
			}			
		},
		del : function(area){
			//删除选区
			var index = area.index();
			this.codeWrap.find('li').eq(index+1).remove();
			this.arr.splice(index+2,1);
			area.remove();
		},
		draw : function(){
			if(!this.img.length){return;}
			var T = this,
				d = $(document),
				mouseLast,mouseNow,winPos,w,h;
			this.select = $('body').append('<div class="imghot_select"></div>').find('.imghot_select');
			
			this.img.bind('mousedown.imghot',function(e){
				e.preventDefault();
				if($(e.target).hasClass('hotarea')){return;}
				mouseLast = {
					x : e.clientX,
					y : e.clientY
				}
				winPos = {
					left : $(window).scrollLeft(),
					top : $(window).scrollTop()
				}
				T.select.css({
					'left':mouseLast.x,
					'top':mouseLast.y
				});
				T.select.hide();
				
				d.bind('mousemove.imghot',function(e){
					e.preventDefault();
					mouseNow = {
						x : e.clientX+winPos.left,
						y : e.clientY+winPos.top
					}
					w = mouseNow.x-mouseLast.x;
					h = mouseNow.y-mouseLast.y;
					if(w<0){
						T.select.css({'left':mouseNow.x});						
					}
					if(h<0){
						T.select.css({'top':mouseNow.y});		
					}
					T.select.css({
						'width':Math.abs(w),
						'height':Math.abs(h)
					})
					T.select.show();
					
				}).bind('mouseup.imghot',function(e){
					d.unbind('mousemove.imghot mouseup.imghot');
					if(T.select.is(":visible")){
						var w = T.select.outerWidth(),
							h = T.select.outerHeight(),
							l = T.select.offset().left-T.imgWrap.offset().left,
							t = T.select.offset().top-T.imgWrap.offset().top,
							hot = $(document.createElement('div')).attr({'class':'hotarea','isdrag':'true'}),
							W = T.img.width(),
							H = T.img.height();
						hot.append('<div class="point p_tl"></div><div class="point p_tr"></div><div class="point p_bl"></div><div class="point p_br"></div>');
						if(l<0){
							w += l;
							l = 0;							
						}
						if(t<0){
							h += t;
							t = 0;							
						}
						w = (w+l)>W?(W-l):w;
						h = (h+t)>H?(H-t):h;
						hot.css({
							'left' : l,
							'top' : t,
							'width' : w,
							'height' : h
						})
						T.imgWrap.append(hot);
						T.showCode(hot);//生成代码
						T.select.hide();
					}
				})
				
			})
		},
		showCode : function(m,isEdit){
			//生成代码
			var w,h,l,t,
				last = this.arr.pop(),
				point,
				area,old,a,i;
			w = m.width();
			h = m.height();
			l = parseInt(m.css('left'));
			t = parseInt(m.css('top'));
			point = Math.round(l/this.rate)+','+Math.round(t/this.rate)+','+Math.round((w+l)/this.rate)+','+Math.round((h+t)/this.rate);
			if(isEdit){//更改坐标
				old = this.arr[m.index()+2].split(' ');
				//console.log(this.codeWrap.find('li').eq(m.index()+1).html());
				for(i=0;i<old.length;i++){
					a = old[i].split('=');
					if(a[1]&&a[0]=='coords'){
						a[1] = '"'+point+'"';
						old[i] = a.join('=');
						break;
					}
				}
				old = old.join(' ');
				this.arr[m.index()+2] = old;
			}else{
				this.arr.push('	<area shape="rect" coords="'+point+'" href="" alt="" />');
			}
			this.arr.push(last);
			this.codeWrap.html(this.arr.join('\n'));
			new codeLight({parent:this.codeWrap});
			this.choose(m);
		}
	}
	return imgHot;
});
