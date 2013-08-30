/*
 * autocomplete自动完成组件
 * nolure@vip.qq.com
 * 2013-8-29
 */
define(function(require,$){
	function moveEnd(obj){ 
		obj.focus(); 
		var len = obj.value.length; 
		if (document.selection) { 
			var sel = obj.createTextRange(); 
			sel.moveStart('character',len); 
			sel.collapse(); 
			sel.select(); 
		}else if(typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') { 
			obj.selectionStart = obj.selectionEnd = len; 
		} 
	}
	var autoComplete = function(text,opt){
		if(!text||!text.length){return;}
		this.text = text;
		opt = opt || {};
		//this.btn = this.box.find("."+(opt.btnClass||"nj_btn"||"btns"));
		this.autoComplete = $('<dl class="auto_complete"><dt></dt></dl>').appendTo('body');
		opt.className && this.autoComplete.addClass(opt.className);
		this.onKeyup = opt.onKeyup;
		this.onChoose = opt.onChoose;
		this.onSelect = opt.onSelect;
		this.max = opt.max || 20;//最多显示条数
		this.rule = opt.rule;
		this.noResult = opt.noResult;
		this.state = false;//是否有匹配结果
		this.searchOnSelect = opt.searchOnSelect==false?false:true;//选中立即搜索
		this.rewriteOnMove = opt.rewriteOnMove==false?false:true;//键盘上下选择的时候是否重写文本框的值
		this.async = opt.async;
		this.rule && this.bind();
	}
	autoComplete.prototype = {
		bind : function(){
			var T = this, A, key;
			this.text.keydown(function(e){//选择
				key = e.keyCode;
				switch(key){
	                case 13://enter
						T.move('enter');
						return false;//阻止触发表单事件
	                case 38://up
	                    T.move("up");
	                    return false;
	                case 40://down
	                    T.move("down");
	                    break;
	            }
			}).keyup(function(e){//输入
				key = e.keyCode;
				switch(key){
	                case 13:
	                    break;
	                case 38:
	                    break;
	                case 40:
	                    break;
					default:
						clearTimeout(A);
						A = setTimeout(function(){
							T.complete();
							T.onKeyup && T.onKeyup(T.state);
						},99);
	            }
			}).click(function(e){
				if ( e.stopPropagation ){
					e.stopPropagation();
				}else{
					e.cancelBubble = true;
				}
			})
			$(document).click(function(){
				T.showBox("hide");
			})
			this.autoComplete.click(function(e){
				var t = e.target,
					tag = t.tagName.toLowerCase(),
					m = $(t);
				if(tag=='dd'||tag=='span'||tag=='i'){
					tag!='dd'&&(m=m.parent());
					m.addClass('current').siblings().removeClass('current');
					T.move('enter');
				}
				if ( e.stopPropagation ){
					e.stopPropagation();
				}else{
					e.cancelBubble = true;
				}
			})			
		},
		/*
		 * 显示框体
		 * @obj：框体对象
		 * @display:'show'/'hide'
		 */
		showBox : function(display,obj){	
			display = display=='show'?'show':'hide';
			obj = obj || this.autoComplete;
			
			if( display=="show" && obj.is(":hidden") ){
				obj.css({
					"left" : this.text.offset().left,
					"top" : this.text.offset().top + this.text.outerHeight(),
					"display" : 'block',
					"width" : this.text.innerWidth()
				});
			}else if( display=="hide" && obj.is(":visible") ){
				obj.hide();
			}
		},		
		//自动完成
		complete : function(v,id){
			var T = this,
				val = typeof v=='undefined' ? this.text.val() : v,
				t = this.autoComplete.find("dt"),
				html;
			
			if( this.async==false ){//ajax异步模式
				this.rule.call(this,val, function(html){
					call(html);
				})
			}else{
				call( this.rule.call(this,val) );
			}
			
			function call(html){
				if( html && html!='' ){
					T.showBox("show");
					t.siblings().remove().end().after(html);
					//该处传入id，当显示全部结果时，输入框当前结果
					//this.move('down',id);
					T.state = true;
				}else{//无匹配项
					t.siblings().remove();
					T.showBox('hide');
					T.text.data("id",null);
					T.text.data("text",null);
					T.state = false;
				}
			}	
		},
		//键盘移动及选择
		move : function(d,id){
			//if(this.autoComplete.is(':hidden')){return;}
			var list = this.autoComplete.find("dd"),
				c = list.filter(".current"),
				prev,next,now;
			if(d=="up"){
				if(!c.length){
					list.last().addClass("current");
				}else{
					prev = c.prev("dd");
					if(!prev.length){
						prev = list.last();
					}
					prev.addClass("current").siblings("dd").removeClass("current");
				}
			}else if(d=="down"){
				if(!c.length){
					list.first().addClass("current");
				}else{
					next = c.next("dd");
					if(!next.length){
						next = list.first();
					}
					next.addClass("current").siblings("dd").removeClass("current");
				}
			}else if(d=="enter"){
				this.showBox("hide");
			}
			if(id){
				$('#'+id).addClass("current").siblings("dd").removeClass("current");
			}
			
			now = list.filter(".current");
			
			if(now.length){
				//this.text.data("id",now.attr("id"));
				this.text.data("text",now.text());
			}else{
				//this.text.data("id",null);
				this.text.data("text",null);
			}
			
			(d=='enter' || this.rewriteOnMove) && this.text.val(now.text());
			
			if( d=='enter' ){
				this.onChoose && this.onChoose();
				this.searchOnSelect && this.search();
			}			
		},
		search : function(){
			if( this.text.val() != this.text.data('text') ){
				this.complete();//防止使用鼠标粘贴时，不能触发keyup事件
				this.showBox("hide");
			}
			var text = this.text.data('text'),
				//item = $('#'+id),
				v = this.text.val();
			if(!text){
				//if(v.replace(/\s/g,"")==""){return false;}
				//this.noResult && this.noResult(encodeURIComponent(v));
			}else{
				this.onSelect && this.onSelect( text, this.autoComplete.find('.current') );
			}
		}
	}
	
	return autoComplete;
});
