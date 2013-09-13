/**
 * nolure@gmail.com
 * 2011-11-9
 * code light
 */
define(function(require,$){
	var codeLight = function(opt){
		this.opt = opt = opt || {};
		this.parent = opt.parent || 'body';
		this.box = null;
		this.code = [];		
		this.init();
	}
	codeLight.prototype = {
		init : function(){
			var m,code,box,type,
				C = this.parent.find('script[code]'),
				s = /\s{4}/,
				item,first,last,
				key;//为每段代码设置特殊关键字
			if(!C.length){return;}
			for(var i=0;i<C.length;i++){
				m = C.eq(i);
				
				type = m.attr('code');
				key = m.attr('key');
				if(key){
					key = key.split(',');
				}
				code = m.html() || m.val();
				if(code.replace(/\s/g,'')==''){
					continue;
				}
				code = this.str(code,type);
				code = setKey(key,code);
				m.css({"display":"none"}).after('<pre title="双击编辑" expand="'+(m.attr('expand')==0?0:1)+'" class="codelight_box"><ol class="rs_item" tabindex="-1">'+code+'</ol><p class="open">+code</p></pre>');
				box = m.next('pre');
				box.find('.rs_item').on('dblclick',function(){
					if(box.hasClass('code_hide')){
						return false;
					}
					$(this).attr({'contentEditable':true}).addClass('edit');
				}).on('blur',function(){
					$(this).removeAttr('contentEditable').removeClass('edit');
				})
				box.find('.note .key').removeClass('key');//去掉注释内的自定义关键字
				this.code.push(box);
				
				delLine(box);
				item = box.find(".rs_item li");
				delTab(item);
				this.setOpt(box);
				m.remove();
			}
			function delLine(box){
				//去掉首尾空行
				item = box.find(".rs_item li");
				first = item.first();
				last = item.last();
				if(first.html().replace(/\s/g,'')==''){
					first.remove();
				}
				if(last.html().replace(/\s/g,'')==''){
					last.remove();
				}
				item = box.find(".rs_item li");
				if(item.first().html().replace(/\s/g,'')==''){
					delLine(box);
				}
			}
			function delTab(item){	
				//去除多余的整体tab缩进
				first = item.first();
				if(s.test(first.html())){
					var m,i,n=item.length;
					for(i=0;i<n;i++){
						m = item.eq(i);
						m.html(m.html().replace(s,''));
					}
					if(s.test(first.html())){
						delTab(item);
					}
				}	
			}
			function setKey(key,code){
				//自定义关键字高亮
				if(!key||!key.length){return code;}
				for(var j=0;j<key.length;j++){
					code = code.replace(eval('/('+key[j]+')/g'),'<b class="key">$1</b>');
				}
				return code;
			}
		},		
		str : function(str,type){
			var r = {
				L : /</g,
				G : />/g,
				L1 : /(&lt;[\/]?)/g,
				G1 : /&gt;/g,
				E : /\n/g,
				tab : /\t/g,
				//html 属性，标签，注释
				htmlProperty : /(class|style|id|title|alt|src|align|href|rel|rev|name|target|content|http-equiv|onclick|onchange|onfocus|onmouseover|onmouseout|type|for|action|value)=/g,
				htmlTag : /(&lt;[\/]?)(html|body|title|head|meta|link|script|base|style|object|iframe|h1|h2|h3|h4|h5|h6|p|blockquote|pre|address|img|a|ol|div|ul|li|dl|dd|dt|ins|del|cite|q|fieldset|form|label|legend|input|button|select|textarea|table|caption|tbody|tfoot|thead|tr|td|th|span|strong|em|i|b|option)(\s|&gt;)/g,
				htmlNote : /(&lt;\!--([\s\S]*?)--&gt;)/gm,//html注释
				//js
				jsKey : /(var|new|function|return|this|if|else|do|while|for|true|false)([\s\({;.]+)/g,			
				jsNote : /(\/\/.*)[\r\n]/g,//单行注释
				jsNoteP : /(\/\*([\s\S]*?)\*\/)/gm,//多行注释
				S : /&/g
			}		
			str = str.replace(/<\/\sscript>/g,'<\/script>');
			str = str.replace(r.S,'&amp;');//替换&特殊字符
			//替换所有<>标签
			str = str.replace(r.L,'&lt;').replace(r.G,'&gt;');
			//添加高亮标签
			if(type=='html'){			
				str = str.replace(r.htmlProperty,'<i class="property">$1</i>=');//属性
				str = str.replace(r.htmlTag,'$1<i class="tag">$2</i>$3');//html标签
				str = str.replace(r.htmlNote,'<i class="note">$1</i>');//注释
				str = str.replace(r.L1,'<i class="lt">$1</i>').replace(r.G1,'<i class="lt">&gt;</i>');//尖括号
			}else if(type=='javascript'){
				str = str.replace(/('[^'\\]*(?:\\[\s\S][^'\\]*)*'|"[^"\\]*(?:\\[\s\S][^"\\]*)*")/g,'<i class="note">$1</i>');//引号之间的内容	
				str = str.replace(r.jsKey,'<i class="jskey">$1</i>$2');//关键字
				str = str.replace(r.jsNote,'<i class="note">$1</i></li><li>').replace(r.jsNoteP,'<i class="note">$1</i>');//注释
			}
			//处理制表符 ，每个制表符统一成4个空白符
			str = str.replace(r.tab,'    ');
			//在换行符处添加li标签,
			str = '<li>'+str.replace(r.E,"</li><li>");
			str += '</li>';
			return str;
		},
		setOpt : function(box){
			var T = this,
				opt = '<div class="set_opt">',
				hide;
			opt += '<a href="" class="hide">折叠</a>';
			opt += '</div>';
			box.append(opt);
			opt = box.find(".set_opt");
			hide = opt.find(".hide");
			
			box.mouseover(function(){
				opt.show();
			}).mouseout(function(){
				opt.hide();
			}).click(function(e){
				var t = $(e.target);
				if(t.hasClass('open')){
					hide.click();
				}
			})
			hide.click(function(){
				var m = $(this);
				if(box.hasClass("code_hide")){
					box.removeClass("code_hide").find('.open').hide();
					m.html('折叠');
				}else{
					box.addClass("code_hide").find('.open').show();
					m.html('展开');
				}
				return false;
			})
			if(this.opt.autoHide || box.attr('expand')==0 ){
				hide.click();
			}
		},
		select : function(index){
			var code = this.code[index||0].find('.rs_item'), range;
			code.dblclick().focus().select();
			
			if(window.getSelection) { 
				range = window.getSelection()//.toString(); 
				//range.extentOffset = 40;
				//range.focusOffset = 40;
			} else if(document.selection && document.selection.createRange) { 
				range = document.selection.createRange()//.text; 
			}   
			//console.log(code[0].selectionStart)
			return;
			range = document.body.createTextRange();
		    range.moveEnd('character',-1);    
		    range.moveStart('character',0);       
		    range.select();  
		}
	};
	return codeLight;
});
