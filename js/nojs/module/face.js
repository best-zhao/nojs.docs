/*
 * 公用组件：表情
 * 2013-8-2
 * nolure@vip.qq.com
 */
define(function(require,$,ui){
	var face = function( options ){
		options = options || {};
		this.button = options.button;//表情选择器,JQ对象
		this.insert = options.insert;//表情写入对象
		if(!this.button || !this.insert ){return;}
		this.baseUrl = options.baseUrl ? options.baseUrl : "/img/face/";
		this.themeName = options.theme;
		this.theme = face.theme[options.theme];
		if( !this.theme ){
			this.theme = face.theme['default'];
			this.themeName = 'default';
		}
		this.faceBox = null;//表情显示容器
		this.itemBox = null;
		this.item = null;
		this.init();
	}	
	
	face.theme = {//表情主题配置
		"default" : {
			item : {'1':'晕','2':'可爱','3':'大笑','4':'呲牙','5':'大哭','6':'拳击','7':'投降','8':'俯卧撑','9':'疑问(不解)','10':'发财','11':'瞌睡','12':'打酱油','13':'憨笑','14':'吃西瓜','15':'汗','16':'惊恐','17':'中标','18':'翻墙','19':'摇头','20':'念经','21':'害羞','22':'睡觉','23':'勤奋','24':'真棒','25':'偷笑','26':'听音乐','27':'晕'},
			fix : ".gif"
		},
		"img" : {
			item : {'e100':'晕','e101':'可爱','e102':'大笑','e103':'呲牙',
					'e104':'大哭','e105':'拳击','e106':'投降','e107':'俯卧撑',
					'e108':'疑问(不解)','e109':'发财','e110':'瞌睡','e111':'打酱油','e112':'憨笑',
					'e113':'吃西瓜','e114':'汗','e115':'惊恐','e116':'中标','e117':'翻墙',
					'e118':'摇头','e119':'念经','e120':'害羞','e121':'睡觉','e122':'勤奋',
					'e123':'真棒','e124':'偷笑','e125':'听音乐','e126':'晕','e127':'真棒',
					'e128':'偷笑','e129':'听音乐','e130':'晕','e131':'偷笑','e132':'听音乐',
					'e133':'晕','e134':'听音乐','e135':'晕','e136':'偷笑','e137':'听音乐',
					'e138':'听音乐','e139':'晕','e140':'偷笑','e141':'听音乐','e142':'听音乐',
					'e143':'听音乐','e144':'晕','e145':'偷笑','e146':'听音乐','e147':'听音乐'
			},
			fix : ".gif"
		},
		"comcom" : {
			item : {'smile':'微笑','sad':'难过','biggrin':'大笑','cry':'大哭','huffy':'怒火','shocked':'惊讶','tongue':'调皮','shy':'害羞','titter':'偷笑','sweat':'冷汗','mad':'折磨','lol':'呲牙','hug':'抱抱','victory':'胜利','time':'时钟','kiss':'香吻','handshake':'握手','call':'电话','loveliness':'可爱','funk':'惊恐','curse':'咒骂','dizzy':'奋斗','shutup':'闭嘴','sleepy':'瞌睡'},
			fix : ".gif"
		}
	}
	
	face.prototype = {
		init : function(){
			var T = this;
			var faceHtml = [
				'<div id="nj_face" class="nj_face">',
					'<div class="con">',
						'<div class="tit"><b>默认表情</b></div>',
						'<ul class="list clearfix"></ul>',
					'</div>',
					'<span class="a"><em>◆</em><i>◆</i></span>',
				'</div>'
			].join('');
			this.faceBox = new ui.menu( this.button, {
				mode : 'click',
				className : 'face_menu',
				onShow : function(){
					if( !this.menu.data('init') ){
						this.menu.data('init',true);
						this.setCon(faceHtml);
						T.itemBox = this.menu.find("ul.list");
						
						T.loadFace();
					}
				}
			});
		},
		//载入表情
		loadFace : function(){
			var T = this,
				faceItem = '',
				url = this.baseUrl + this.themeName + '/',
				n = 0;
			for(var i in this.theme.item){
				faceItem += '<li><img src="' + url + i + this.theme.fix+'" title="'+this.theme.item[i]+'" alt="" /></li>';
			}
			this.itemBox.html(faceItem);
			this.item = this.itemBox.find("img");		
			this.faceBox.menu.click(function(e){
				var t = e.target, text;
				if( t.tagName.toLowerCase()=='img' ){
					text = '[:'+$(t).attr("title")+']';
					T.insertTo(text);
					T.faceBox.hide();
				}
			})
		},
		//将所选表情写入到目标对象
		insertTo : function(text){
			//将表情插入到光标处
			var C = new insertOnCursor(this.insert);
			C.insertAtCaret(text);
			this.insert.focus();
		},
		//提取表情,不传默认为当前表情插入对象val
		replaceFace : function(con){
			if(!con){var con = this.insert.val();}
			var faceArray = this.theme.item,
				N,pic;
			for(var i in faceArray){
				N = faceArray[i];
				if(con.indexOf("[:"+N+"]")!=-1){
					pic = '<img src="'+this.baseUrl+this.themeName+'/'+i+this.theme.fix+'" alt="'+N+'" title="'+N+'" />';
					con = con.replace(eval("/\\[:"+N.replace("(","\\(").replace(")","\\)")+"\\]/g"),pic);
				}
			}
			return con;
		}
	}
	
	/*
	 * 在光标处插入内容
	 * @obj:支持光标插入的对象
	 */
	function insertOnCursor(obj){
		if(!obj){return;}
		this.textBox = obj;
		this.setCaret();
	}
	insertOnCursor.prototype = {
		//初始化对象以支持光标处插入内容    	
		setCaret: function(){   
	    	if(!$.browser.msie){return;} 
			var T = this;	        
			T.textBox.on('click select keyup',function(){
				T.textBox[0].caretPos = document.selection.createRange().duplicate();   
			}) 
	    },
		//在当前对象光标处插入指定的内容  
		insertAtCaret: function(text){
			var textObj = this.textBox[0];
			if (document.all && textObj.createTextRange && textObj.caretPos) {
				var caretPos = textObj.caretPos;
				caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == '' ? text + '' : text;
			}else if (textObj.setSelectionRange) {
				var rangeStart = textObj.selectionStart;
				var rangeEnd = textObj.selectionEnd;
				var tempStr1 = textObj.value.substring(0, rangeStart);
				var tempStr2 = textObj.value.substring(rangeEnd);
				textObj.value = tempStr1 + text + tempStr2;
				var len = text.length;
				textObj.setSelectionRange(rangeStart + len, rangeStart + len);
			}else {
				textObj.value += text;
			}
		},
		//清除当前选择内容
		unselectContents: function(){   
	        if (window.getSelection) {
				window.getSelection().removeAllRanges();
			}else if (document.selection) {
				document.selection.empty();
			} 
	    },
		//选中内容  
		selectContents: function(){   
	        this.textBox.each(function(i){   
	            var node = this;   
	            var selection, range, doc, win;   
	            if((doc = node.ownerDocument) && (win = doc.defaultView) &&  typeof win.getSelection != 'undefined' &&  typeof doc.createRange != 'undefined' && (selection = window.getSelection()) && typeof selection.removeAllRanges != 'undefined') {   
	                range = doc.createRange();   
	                range.selectNode(node);   
	                if(i == 0){selection.removeAllRanges();}   
	                selection.addRange(range);   
	            }else if (document.body && typeof document.body.createTextRange != 'undefined' && (range = document.body.createTextRange())){   
	                range.moveToElementText(node);   
	                range.select();   
	            }   
	        });   
	    }      
	}
	
	return face;	
});
