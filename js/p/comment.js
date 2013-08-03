/*
 * mdb公用组件：评论框+表情
 * 2013-8-2
 * nolure@vip.qq.com
 */
define(function(require,$,ui){
	var face = function(face,insertTo,opt){
		if(!face){return;}
		opt = opt || {};
		this.face = face;//表情选择器,JQ对象
		this.insertTo = insertTo;//表情写入对象
		//this.inEvent = null;//写入表情后的回调
		this.baseUrl = opt.baseUrl?opt.baseUrl:"/img/face/";
		this.faceType = opt.faceType?opt.faceType:"default";//默认表情包
		this.faceConfig = {//表情配置
			"default" : {
				item : {'1':'晕','2':'可爱','3':'大笑','4':'呲牙','5':'大哭','6':'拳击','7':'投降','8':'俯卧撑','9':'疑问(不解)','10':'发财','11':'瞌睡','12':'打酱油','13':'憨笑','14':'吃西瓜','15':'汗','16':'惊恐','17':'中标','18':'翻墙','19':'摇头','20':'念经','21':'害羞','22':'睡觉','23':'勤奋','24':'真棒','25':'偷笑','26':'听音乐','27':'晕'},
				subName : ".gif"
			},
			"comcom" : {
				item : {'smile':'微笑','sad':'难过','biggrin':'大笑','cry':'大哭','huffy':'怒火','shocked':'惊讶','tongue':'调皮','shy':'害羞','titter':'偷笑','sweat':'冷汗','mad':'折磨','lol':'呲牙','hug':'抱抱','victory':'胜利','time':'时钟','kiss':'香吻','handshake':'握手','call':'电话','loveliness':'可爱','funk':'惊恐','curse':'咒骂','dizzy':'奋斗','shutup':'闭嘴','sleepy':'瞌睡'},
				subName : ".gif"
			}
		}
		//如果没有找到此表情包，就用默认代替
		if(!this.faceConfig[this.faceType]){
			this.faceType = "default";
		}
		this.faceTheme = this.faceConfig[this.faceType];
		this.faceBox = $("#mdb_face");//表情显示容器
		this.faceBg = null;
		this.itemBox = null;
		this.item = null;
		this.close = null;
		this.load = null;
		this.init();
	}	
	face.prototype = {
		init : function(){
			var T = this;
			if(!this.faceBox.length){
				var faceHtml = '<div id="mdb_face" class="mdb_face">';
				faceHtml += 		'<div class="con">';
				faceHtml += 			'<div class="tit"><a href="" class="close fr">×</a><b>默认表情</b></div>';
				faceHtml += 			'<div class="load"><em class="loading"></em>表情加载中……</div>';
				faceHtml += 			'<ul class="item"></ul>';
				faceHtml += 		'</div>';
				faceHtml += 	'<div class="mask"></div>';
				faceHtml += 	'<span class="a"><em>◆</em><i>◆</i></span>';
				faceHtml += '</div>';
				this.faceBox = $("body").append(faceHtml).find("#mdb_face");
			}
			this.faceBg = this.faceBox.find(".mask");
			this.load = this.faceBox.find(".load");
			this.itemBox = this.faceBox.find(".item");
			this.close = this.faceBox.find(".close");
			this.bindEvent();
		},
		bindEvent : function(){
			var T = this;
			this.face.click(function(){
				if(T.faceBox.is(":visible")){
					T.hide();
					return false;
				}
				var m = $(this),
					top = m.offset().top + 25,
					left = m.offset().left - 5;
				T.loadFace();
				T.faceBox.css({
					"top":top,
					"left":left,
					"display":"block"
				})	
				if(d2d_upload.Box.is(":visible")){
					d2d_upload.btn.click();
				}
				
				T.item.hover(function(){
					$(this).addClass("current");
				},function(){
					$(this).removeClass("current");
				}).click(function(){
					var text = '[:'+$(this).attr("title")+']';
					T.insert(text);
				})
				return false;
			})
			$(document).click(function(){
				T.hide();
			})		
			this.faceBox.click(function(e){
				stopBubble(e);
			})
			this.close.click(function(){
				T.hide();
				return false;
			})
		},
		//载入表情
		loadFace : function(){
			var T = this,
				faceItem = '',
				url = this.baseUrl + this.faceType + '/',
				n = 0;
			for(var i in this.faceTheme.item){
				faceItem += '<li><img src="' + url + i + this.faceTheme.subName+'" title="'+this.faceTheme.item[i]+'" alt="" /></li>';
			}
			this.itemBox.html(faceItem);
			this.item = this.itemBox.find("img");
			
			T.item.last().load(function(){
				T.load.hide();
				T.itemBox.show();
				T.faceBg.css("height",T.faceBox.height());
			})	
		},
		//将所选表情写入到目标对象
		insert : function(text){
			//将表情插入到光标处
			var C = new insertOnCursor(this.insertTo);
			C.insertAtCaret(text);
			this.insertTo.focus();
			this.hide();
		},
		//提取表情,不传默认为当前表情插入对象val
		replaceFace : function(con){
			if(!con){var con = this.insertTo.val();}
			var faceArray = this.faceTheme.item,
				N,pic;
			for(var i in faceArray){
				N = faceArray[i];
				if(con.indexOf("[:"+N+"]")!=-1){
					pic = '<img src="'+this.baseUrl+this.faceType+'/'+i+this.faceTheme.subName+'" alt="'+N+'" title="'+N+'" />';
					con = con.replace(eval("/\\[:"+N.replace("(","\\(").replace(")","\\)")+"\\]/g"),pic);
				}
			}
			return con;
		},
		hide : function(){
			this.faceBox.css("display","none");
			this.itemBox.empty();
		}
	}
	/*
	 * 全站公用评论框体
	 * @id:容器ID
	 */
	var comment = function(id,user,config){
		this.box = $("#"+id);
		this.text = this.box.find(".c_form .text");
		this.btn = this.box.find(".c_form .btns");
		this.face = this.box.find(".opt .face");
		this.faceFun = null;//表情
		this.comList = null;//评论列表区
		this.replayBtn = null;//回复 
		this.replayEdit = null;//编辑回复
		this.N = this.box.find(".sub_box .t .orange");//评论条数
		this.E = {};//回调
		this.user = user || {};//用户信息
		
		this.config = config || {};
		this.config.floor = this.config.floor ? true : false;//是否显示楼层 
		
		
		this.isInit = {
			face : false
		}
		this.init();
	}
	comment.prototype = {
		init : function(){
			//用户信息
			if(!this.user.username){this.user.username = '网友';}		
			
			if(!this.isInit.face){//初始化表情包
				this.faceFun = new face(this.face,this.text,{faceType:"comcom"});
				this.isInit.face = true;
			}		
			
			
			this.comList = this.box.find(".com_list");
			this.replayBtn = this.comList.find("dt .replay");
			this.replayEdit = this.comList.find(".replay_box .edit");
			this.bindEvent();
		},
		bindEvent : function(){
			var T = this;
			//发表评论
			this.btn.unbind("click").click(function(){
				if(!d2d_check.isNull(T.text.val())){
					T.publish();
				}else{
					T.text.val('').focus();//清除空白字符串
				}
				return false;
			})
			//回复评论
			this.replayBtn.unbind("click").click(function(){
				T.Replaying($(this));
				return false;
			})
			//编辑回复
			this.replayEdit.unbind("click").click(function(){
				var m = $(this),box = m.parents(".replay_box");
				T.ReplayEdit(box);
				return false;
			})
			
			//回车发表
			this.text.keydown(function(e){
				e = e || window.event;
				if(e.keyCode==13){
					T.btn.click();
					return false;	
				}
			})
			
		},
		//显示回复发布框,m:回复按钮
		Replaying : function(m){
			var T = this,
				dl = m.parents("dl"),
				con = dl.find(".com_con"),
				name = m.siblings(".name"),
				subBox = dl.find(".replaying"),
				subText = subBox.find("textarea"),
				subBtn,t;
			if(m.data("init")){//已初始化
				if(subBox.is(":hidden")){
					
					
					if(m.data("replay")){
						pWinMsg.show("您已回复此人,不能重复回复！","i",2000);
						return false;
					}
					
					
				}else{
					subBox.slideUp(100);
					return false;
				}			
			}else{//初始化回复框
				var html = '<div class="replaying mb10">';
				html += '<p class="gray7 t">回复：<i></i></p>';
				html += '<textarea name="" id=""></textarea>';
				html += '<p><a href="" class="p_btn"><i></i>确定</a> <a href="" class="p_btn s_g"><i></i>取消</a></p>';
				html += '</div>';
				con.after(html);
				subBox = dl.find(".replaying");
				subText = subBox.find("textarea");
				subBtn = subBox.find(".p_btn");
				t = subBox.find(".t i");
				t.text(name.text());
				subBtn.click(function(){
					if($(this).hasClass("s_g")){//取消
						subBox.slideUp(100);
						subText.val('');
					}else{//提交
						if(subText.val()==''){
							subText.focus();
						}else{
							m.data("replay",true);//标记已回复 
							T.ReplayBox(subBox);
						}
					}
					return false;
				})
				m.data("init",true);//标记已初始化
			}
			subBox.slideDown(100);
			subText.focus();	
		},
		//提交回复,box当前回复框对象
		ReplayBox : function(box){
			var T = this,
				con = box.find("textarea").val(),
				viewBox = $(document.createElement("div")).attr({"class":"replay_box","style":"display:none"}),
				html = '<div class="t"><span class="fr"><a href="" class="edit">编辑</a></span><a href="">'+this.user.username+'</a></div>';
			con = this.replaceTag(con);//替换HTML标签	
			html += '<div class="con">'+con+'</div>';
			viewBox.html(html);
			box.slideUp(100,function(){
				box.after(viewBox);
				viewBox.slideDown(300,function(){
					T.init();
					if(T.E.replay){
						var cid = box.parents("dl:first").attr("cid");					
						T.E.replay(con,cid);
					}
				});
			});
		},
		//初始化回复编辑框,m:当条回复框对象
		ReplayEdit : function(m){
			var T = this,
				editBox,//编辑框
				text,
				reCon = m.find(".con");//回复内容
			if(m.data("edit")){//已初始化
				editBox = m.next(".replay_edit");
				text = editBox.find("textarea");
			}else{
				editBox = $(document.createElement("div")).attr({"class":"replay_box replay_edit","style":"display:none"});
				var	html = '<div class="t"><span class="fr"><a href="" class="cancel">×</a></span><a href="">'+this.user.username+'</a></div>';
				html += '<div class="con"><textarea></textarea></div>';
				html += '<p><a href="" class="p_btn"><i></i>确定</a> <a href="" class="p_btn s_g"><i></i>取消</a></p>';
				editBox.html(html);
				m.after(editBox);
				
				var cancel = editBox.find(".t .cancel"),
					Con = editBox.find(".con"),
					btn = editBox.find(".p_btn");
				text = editBox.find("textarea");	
				Con.click(function(){
					$(this).find("textarea").focus();
				})	
				function Cancel(i){//关闭编辑框 
					editBox.css("display","none");
					m.css("display","block");
					if(i){//提交编辑回复
						var con = text.val();
						con = T.replaceTag(con);//替换HTML标签
						reCon.html(con);
						if(T.E.replay){
							var rid = m.attr("rid");
							T.E.replay(con,null,rid);
						}
					}
					return false;
				}
				cancel.click(function(){
					return Cancel();
				})
				btn.click(function(){
					if($(this).hasClass("s_g")){
						Cancel();
					}else{
						if(text.val()!=""){
							Cancel(true);
						}else{
							text.focus();
						}
					}
					return false;
				})
				m.data("edit",true);//标记已初始化编辑框
			}
			
			m.css("display","none");
			editBox.fadeIn(500);
			text.focus().val(reCon.text());
			
		},	
		//发表评论
		publish : function(){
			var T = this,
				list = this.comList.children("dl"),
				con = this.text.val(),//评论内容
				newBox = $(document.createElement("dl")).attr("style","display:none"),
				html = '',
				len = list.length?list.first().find("dt .n").text():0,//当前评论条数
				n = list.length?++len:1,
				total = this.N.text();
			
			con = this.replaceTag(con);//替换HTML标签
			con = this.faceFun.replaceFace(con);//替换表情		
			var strLen = this.getStrLen(con);//将图片HTML计算为一个字符，并计算总字符数
			
			//取出上传的图片信息
			var upImg = this.text.data("img");
			if(upImg){
				con = '<img src="'+upImg+'" alt="" class="pic zoomin">'+con;
				d2d_upload.hide();
				strLen++;//图片当作一个字
				
			}
			
			if(strLen<3||strLen>100){
				ui.msg.show("输入内容不能少于3个字，或者多余100个字！表情或图片算一个字。","i",1500);
				return;
			}
			
			total++;	
			this.N.text(total);
			
			html += '<dt>';	
			if(this.user.uid){html += '<a href="" class="fr replay">回复</a>';}
			html += '<i class="n">'+n+'</i><a class="name" href="">'+this.user.username+'</a><span class="gray6 ml5">('+this.getFloor(total)+')</span></dt>';
			html += '<dd><div class="com_con">' + con + '<span class="pub_time gray7 ml10">(刚刚)</span></div>';
			html += '</dd>';
			newBox.html(html);
			if(!list.length){this.comList.find(".no").remove();}
			this.comList.prepend(newBox);
			newBox.slideDown(200);
			
			T.init();
			T.text.val('');//发表后清空文本框
			
			if(this.E.publish){
				this.E.publish(con);
			}
			
		},
		getFloor : function(n){
			var floor;
			if(n==1){
				floor = '洋房';
			}else if(n==2){
				floor = '砖瓦房';
			}else if(n==3){
				floor = '茅草房';
			}else{
				floor = n+'#';
			}
			return floor;
		},
		//获取字符长度，图片和表情只算一个字
		getStrLen : function(str){
			str = str.replace(/<img[^>]*>/gi ,"v");//替换表情为一个字符
			var len = str.length;
			if(this.text.data("img")){//是否有上传图片
				len++;
			}
			return len;
		},
		//替换HTML标签,替换'<'即可
		replaceTag : function(str){
			str = str.replace(/</g,"&lt;");
			return str;
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
});
