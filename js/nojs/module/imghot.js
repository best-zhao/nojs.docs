/*2013/11/14-http://nolure.github.io/nojs.docs*/define("nojs/module/imghot",["nojs/module/drag","nojs/module/codelight"],function(require,a){var b=require("nojs/module/drag"),c=require("nojs/module/codelight");return imgHot=function(b,c){c=c||{},this.box=a("#"+b),this.box.length&&(this.btn=c.btn,this.wrap=this.box.find(".wrap"),this.imgWrap=this.box.find(".img_wrap"),this.codeWrap=this.box.find(".code_wrap"),this.arr=null,this.img=null,this.select=null,this.rate=1,this.state=this.box.find(".state"),this.setMode=this.state.find(".mode"),this.prevBox=this.wrap.find(".preview"),this.isBInd=!1,this.init())},imgHot.prototype={init:function(){var a=this;this.img=this.imgWrap.children("img"),this.img.length&&(this.arr=['<script type="text/templete" code="html" key="Map">','<img src="" alt="" usemap="#Map" />','<map name="Map" id="Map">',"</map></script>"],this.codeWrap.html(this.arr.join("\n")),this.img.bind("click blur",function(){a.choose()}).bind("keydown",function(b){var c=a.imgWrap.find(".current"),d=!0;if(c.length){switch(b.keyCode){case 37:parseInt(c.css("left"))>0?c.animate({left:"-=1"},0):d=!1;break;case 38:parseInt(c.css("top"))>0?c.animate({top:"-=1"},0):d=!1;break;case 39:parseInt(c.css("left"))+c.width()<a.imgWrap.width()?c.animate({left:"+=1"},0):d=!1;break;case 40:parseInt(c.css("top"))+c.height()<a.imgWrap.height()?c.animate({top:"+=1"},0):d=!1;break;case 46:a.del(c),d=!1;break;default:d=!1}d&&(b.preventDefault(),a.showCode(c,!0))}}).bind("keyup",function(){}),this.draw(),!this.isBInd&&this.bind())},bind:function(){var c=this;this.isBInd=!0,this.drag=new b(this.imgWrap,null,{delegat:!0,limit:this.imgWrap}),this.drag.UpEvent=function(){c.showCode(this.drag,!0)},this.imgWrap.on("click",function(b){var d=b.target,e=a(d);b.stopPropagation(),"div"==d.tagName.toLowerCase()&&e.hasClass("hotarea")&&c.choose(e),c.img.focus()}),this.codeWrap.on("click",function(b){if(!a(this).find(".edit").length){var d,e=b.target,f=a(e);b.stopPropagation(),("li"==e.tagName.toLowerCase()||f.closest("li").length)&&(f.closest("li").length&&(f=f.closest("li")),d=f.index(),d>1&&f.next("li").length&&c.choose(c.imgWrap.find(".hotarea").eq(d-2)))}}),this.setMode.click(function(){return c.box.hasClass("hot_prev_mode")?(a(this).html("<i>预览</i>"),c.box.removeClass("hot_prev_mode")):(a(this).html("<i>编辑</i>"),c.box.addClass("hot_prev_mode"),c.preview()),!1})},preview:function(){this.prevBox.empty();var a,b=this.img.clone().removeAttr("style"),c="img_hot_map",d=this.arr.length-1,e='<map name="'+c+'" id="'+c+'">';for(b.attr({usemap:c}),a=3;d>a;a++)e+=this.arr[a];e+="</map>",this.prevBox.append(b).append(e)},setImg:function(){var a,b=this.wrap.width(),c=this.wrap.height(),d=b/c,e=this.img.width(),f=this.img.height(),g=e/f;g>d&&e>b?(a=b/e,e=b,this.img.width(b),f=this.img.height()):d>=g&&f>=c&&(a=c/f,f=c,this.img.height(c),e=this.img.width()),this.rate=a,this.state.find(".rate").html("图片缩放比例："+(100*a).toFixed(2)+"%"),this.imgWrap.css({"margin-left":-e/2,"margin-top":-f/2})},choose:function(a){if(a){var b=a.index();a.addClass("current").find(".point").show().end().siblings().removeClass("current").find(".point").hide(),this.codeWrap.find("li").eq(b+1).addClass("current").siblings().removeClass("current"),this.img.focus()}else this.imgWrap.children("").removeClass("current").find(".point").hide(),this.codeWrap.find("li").removeClass("current")},del:function(a){var b=a.index();this.codeWrap.find("li").eq(b+1).remove(),this.arr.splice(b+2,1),a.remove()},draw:function(){if(this.img.length){var b,c,d,e,f,g=this,h=a(document);this.select=a("body").append('<div class="imghot_select"></div>').find(".imghot_select"),this.img.bind("mousedown.imghot",function(i){i.preventDefault(),a(i.target).hasClass("hotarea")||(b={x:i.clientX,y:i.clientY},d={left:a(window).scrollLeft(),top:a(window).scrollTop()},g.select.css({left:b.x,top:b.y}),g.select.hide(),h.bind("mousemove.imghot",function(a){a.preventDefault(),c={x:a.clientX+d.left,y:a.clientY+d.top},e=c.x-b.x,f=c.y-b.y,0>e&&g.select.css({left:c.x}),0>f&&g.select.css({top:c.y}),g.select.css({width:Math.abs(e),height:Math.abs(f)}),g.select.show()}).bind("mouseup.imghot",function(){if(h.unbind("mousemove.imghot mouseup.imghot"),g.select.is(":visible")){var b=g.select.outerWidth(),c=g.select.outerHeight(),d=g.select.offset().left-g.imgWrap.offset().left,e=g.select.offset().top-g.imgWrap.offset().top,f=a(document.createElement("div")).attr({"class":"hotarea",isdrag:"true"}),i=g.img.width(),j=g.img.height();f.append('<div class="point p_tl"></div><div class="point p_tr"></div><div class="point p_bl"></div><div class="point p_br"></div>'),0>d&&(b+=d,d=0),0>e&&(c+=e,e=0),b=b+d>i?i-d:b,c=c+e>j?j-e:c,f.css({left:d,top:e,width:b,height:c}),g.imgWrap.append(f),g.showCode(f),g.select.hide()}}))})}},showCode:function(a,b){var d,e,f,g,h,i,j,k,l=this.arr.pop();if(d=a.width(),e=a.height(),f=parseInt(a.css("left")),g=parseInt(a.css("top")),h=Math.round(f/this.rate)+","+Math.round(g/this.rate)+","+Math.round((d+f)/this.rate)+","+Math.round((e+g)/this.rate),b){for(i=this.arr[a.index()+2].split(" "),k=0;k<i.length;k++)if(j=i[k].split("="),j[1]&&"coords"==j[0]){j[1]='"'+h+'"',i[k]=j.join("=");break}i=i.join(" "),this.arr[a.index()+2]=i}else this.arr.push('	<area shape="rect" coords="'+h+'" href="" alt="" />');this.arr.push(l),this.codeWrap.html(this.arr.join("\n")),new c({parent:this.codeWrap}),this.choose(a)}},imgHot}),define("nojs/module/drag",[],function(require,a){a.addCss(".addIndex{z-index:99999}");var b=function(a,b,c){this.drag=a,this.opt=c=c||{},this.move=b?b:a,this.delegat=c.delegat===!0?!0:!1,this.setDrag=c.setDrag,this.moveing=!1,this.onDragDown=null,this.onDragStart=null,this.MoveEvent=null,this.UpEvent=null,this.dragLastPos=[],this.dragNowPos=[],this.mouseLastPos={},this.disable=!1,this.limit=c.limit,this.wrap=c.wrap,this.overflow=c.overflow,this.A=null,this.delay=this.opt.delay||9,this.delegat||(b?this.move.css("cursor","move"):this.drag.css("cursor","move"));var d=this;this.move.bind("mousedown.drag",function(a){d.DragDown(a)})};return b.prototype={DragDown:function(b){if(this.disable)return!1;b=b||window.event;var c,d,e,f,g,h,i,j,k=this,l=a(b.target);if(this.delegat&&(this.drag=l.attr("isdrag")||l.attr("isdragmove")?l.attr("isdragmove")?l.closest("[isdrag]"):l:null),this.drag&&this.drag.length){if(this.onDragDown&&0==this.onDragDown.call(this))return!1;for(this.moveing=!0,this.dragNowPos=[],this.dragLastPos=[],this.maxSize={L:[],T:[],B:[],R:[],W:null,H:null},this.group=this.group||this.drag,this.drag.addClass("addIndex"),e=0,f=this.drag.length;f>e;e++)d=this.drag.eq(e),c="static"===d.css("position"),g=c?d.offset().left:parseInt(d.css("left"),10)||0,h=c?d.offset().top:parseInt(d.css("top"),10)||0,this.wrap&&this.wrap.length&&(g-=this.wrap.offset().left-this.wrap.scrollLeft(),h-=this.wrap.offset().top-this.wrap.scrollTop()),i=d.outerWidth(),j=d.outerHeight(),this.dragLastPos.push({x:g,y:h}),c&&d.css({position:"absolute"}),d.css({left:g,top:h}),(!this.group||d.is(this.group))&&(this.maxSize.L.push(g),this.maxSize.T.push(h),this.maxSize.R.push(g+i),this.maxSize.B.push(h+j));return b.preventDefault(),this.maxSize.L=Math.min.apply(null,this.maxSize.L),this.maxSize.T=Math.min.apply(null,this.maxSize.T),this.maxSize.W=Math.max.apply(null,this.maxSize.R)-this.maxSize.L,this.maxSize.H=Math.max.apply(null,this.maxSize.B)-this.maxSize.T,this.limit&&(this.maxSize.l=this.limit.offset().left+parseInt(this.limit.css("border-left-width")),this.maxSize.t=this.limit.offset().top+parseInt(this.limit.css("border-top-width")),"static"!==this.limit.css("position")&&this.limit.find(d).length&&(this.maxSize.l=this.maxSize.t=0),this.maxSize.w=this.limit.innerWidth()-this.maxSize.W+this.maxSize.l,this.maxSize.h=this.limit.innerHeight()-this.maxSize.H+this.maxSize.t,this.overflow&&(this.maxSize.l-=this.overflow,this.maxSize.t-=this.overflow,this.maxSize.w+=this.overflow,this.maxSize.h+=this.overflow)),this.mouseLastPos={x:b.clientX,y:b.clientY},this.onDragStart&&0==this.onDragStart.call(this)?!1:(a(document).bind("mousemove.drag",function(a){k.DragMove(a)}).bind("mouseup.drag",function(a){k.DragUp(a)}),void 0)}},DragMove:function(a){if(this.moveing&&!this.disable&&this.drag){a=a||window.event,a.preventDefault();var b,c,d,e,f,g={x:a.clientX-this.mouseLastPos.x,y:a.clientY-this.mouseLastPos.y},h=g.x,i=g.y,j=this.drag.length,k=this;for(this.limit&&(e=this.maxSize.L+h,f=this.maxSize.T+i,g.x=e<this.maxSize.l?this.maxSize.l-this.maxSize.L:h,g.x=e>this.maxSize.w?this.maxSize.w-this.maxSize.L:g.x,g.y=f<this.maxSize.t?this.maxSize.t-this.maxSize.T:i,g.y=f>this.maxSize.h?this.maxSize.h-this.maxSize.T:g.y),this.setOffset&&(g=this.setOffset.call(this,g)),h=g.x,i=g.y,b=0;j>b;b++)c=this.drag.eq(b),d=this.dragLastPos[b],this.dragNowPos[b]={x:d.x+h,y:d.y+i},c.css({left:this.dragNowPos[b].x,top:this.dragNowPos[b].y});this.MoveEvent&&(clearTimeout(k.A),k.A=setTimeout(function(){k.MoveEvent.call(k,{x:h,y:i,w:k.maxSize.W,h:k.maxSize.H})},k.delay))}},DragUp:function(b){if(!this.disable){var c=this;this.moveing=!1,a(document).off("mousemove.drag mouseup.drag"),this.drag.removeClass("addIndex"),c.A=clearTimeout(c.A),this.UpEvent&&this.UpEvent.call(this),this.maxSize=this.dragLastPos=this.dragNowPos=null,b.preventDefault()}}},b}),define("nojs/module/codelight",[],function(require,$){var codeLight=function(a){this.opt=a=a||{},this.parent=a.parent||"body",this.box=null,this.code=[],this.init()};return codeLight.prototype={init:function(){function delLine(a){item=a.find(".rs_item li"),first=item.first(),last=item.last(),""==first.html().replace(/\s/g,"")&&first.remove(),""==last.html().replace(/\s/g,"")&&last.remove(),item=a.find(".rs_item li"),""==item.first().html().replace(/\s/g,"")&&delLine(a)}function delTab(a){if(first=a.first(),s.test(first.html())){var b,c,d=a.length;for(c=0;d>c;c++)b=a.eq(c),b.html(b.html().replace(s,""));s.test(first.html())&&delTab(a)}}function setKey(key,code){if(!key||!key.length)return code;for(var j=0;j<key.length;j++)code=code.replace(eval("/("+key[j]+")/g"),'<b class="key">$1</b>');return code}var m,code,box,type,C=this.parent.find("script[code]"),s=/\s{4}/,item,first,last,key;if(C.length)for(var i=0;i<C.length;i++)m=C.eq(i),type=m.attr("code"),key=m.attr("key"),key&&(key=key.split(",")),code=m.html()||m.val(),""!=code.replace(/\s/g,"")&&(code=this.str(code,type),code=setKey(key,code),m.css({display:"none"}).after('<pre title="双击编辑" expand="'+(0==m.attr("expand")?0:1)+'" class="codelight_box"><ol class="rs_item" tabindex="-1">'+code+'</ol><p class="open">+code</p></pre>'),box=m.next("pre"),box.find(".rs_item").on("dblclick",function(){return box.hasClass("code_hide")?!1:($(this).attr({contentEditable:!0}).addClass("edit"),void 0)}).on("blur",function(){$(this).removeAttr("contentEditable").removeClass("edit")}),box.find(".note .key").removeClass("key"),this.code.push(box),delLine(box),item=box.find(".rs_item li"),delTab(item),this.setOpt(box),m.remove())},str:function(a,b){var c={L:/</g,G:/>/g,L1:/(&lt;[\/]?)/g,G1:/&gt;/g,E:/\n/g,tab:/\t/g,htmlProperty:/(class|style|id|title|alt|src|align|href|rel|rev|name|target|content|http-equiv|onclick|onchange|onfocus|onmouseover|onmouseout|type|for|action|value)=/g,htmlTag:/(&lt;[\/]?)(html|body|title|head|meta|link|script|base|style|object|iframe|h1|h2|h3|h4|h5|h6|p|blockquote|pre|address|img|a|ol|div|ul|li|dl|dd|dt|ins|del|cite|q|fieldset|form|label|legend|input|button|select|textarea|table|caption|tbody|tfoot|thead|tr|td|th|span|strong|em|i|b|option)(\s|&gt;)/g,htmlNote:/(&lt;\!--([\s\S]*?)--&gt;)/gm,jsKey:/(var|new|function|return|this|if|else|do|while|for|true|false)([\s\({;.]+)/g,jsNote:/(\/\/.*)[\r\n]/g,jsNoteP:/(\/\*([\s\S]*?)\*\/)/gm,S:/&/g};return a=a.replace(/<\/\sscript>/g,"</script>"),a=a.replace(c.S,"&amp;"),a=a.replace(c.L,"&lt;").replace(c.G,"&gt;"),"html"==b?(a=a.replace(c.htmlProperty,'<i class="property">$1</i>='),a=a.replace(c.htmlTag,'$1<i class="tag">$2</i>$3'),a=a.replace(c.htmlNote,'<i class="note">$1</i>'),a=a.replace(c.L1,'<i class="lt">$1</i>').replace(c.G1,'<i class="lt">&gt;</i>')):"javascript"==b&&(a=a.replace(/('[^'\\]*(?:\\[\s\S][^'\\]*)*'|"[^"\\]*(?:\\[\s\S][^"\\]*)*")/g,'<i class="note">$1</i>'),a=a.replace(c.jsKey,'<i class="jskey">$1</i>$2'),a=a.replace(c.jsNote,'<i class="note">$1</i></li><li>').replace(c.jsNoteP,'<i class="note">$1</i>')),a=a.replace(c.tab,"    "),a="<li>"+a.replace(c.E,"</li><li>"),a+="</li>"},setOpt:function(a){var b,c='<div class="set_opt">';c+='<a href="" class="hide">折叠</a>',c+="</div>",a.append(c),c=a.find(".set_opt"),b=c.find(".hide"),a.mouseover(function(){c.show()}).mouseout(function(){c.hide()}).click(function(a){var c=$(a.target);c.hasClass("open")&&b.click()}),b.click(function(){var b=$(this);return a.hasClass("code_hide")?(a.removeClass("code_hide").find(".open").hide(),b.html("折叠")):(a.addClass("code_hide").find(".open").show(),b.html("展开")),!1}),(this.opt.autoHide||0==a.attr("expand"))&&b.click()},select:function(a){var b,c=this.code[a||0].find(".rs_item");c.dblclick().focus().select(),window.getSelection?b=window.getSelection():document.selection&&document.selection.createRange&&(b=document.selection.createRange())}},codeLight});