/*nolure@vip.qq.com|http://nolure.github.io/nojs.docs*/define("nojs/ui",[],function(require,$){function instaceofFun(a,b){return a instanceof b.callee?!1:Extend(b.callee,Array.prototype.slice.call(b))}function Extend(a,b){function c(a,b){a.apply(this,b)}return c.prototype=a.prototype,isNew=null,new c(a,b)}function getDom(a){var b,c=typeof a;return"string"==c?b=$("#"+a):"object"==c&&(b=a.nodeType?$(a):a),b=b.length?b:null}function placeHolder(a,b){var c,d=.98*a.innerWidth(),e=a.outerHeight(),f=a.attr("id"),g=a.attr("placeholder");if(b=b||0,f=f||"ph_lab"+b,c=$('<label for="'+f+'" style="width:'+d+"px;height:"+e+'px" class="ph_lab ph_lab'+b+'">'+g+"</label>"),/.*\s{2}$/.test(g)&&$.browser("ie6 ie7")){var h=a.css("float");a.wrap($('<span class="ph_wrap" style="position:relative;float:'+h+'"></span>')),c.css("left","0")}"input"==a[0].tagName.toLowerCase()&&c.css("line-height",e+"px"),a.attr("id",f).before(c),a.bind("blur propertychange input",function(){setTimeout(function(){""==a.val()?c.show():c.hide()},15)}),setTimeout(function(){""!=a.val()&&c.hide()},150)}var UI={};UI.init=function(area){area=area||$("body");var dom=area.find("[data-ui]"),i,elem,method,options;for(i=0;i<dom.length;i++)elem=dom[i],method=elem.getAttribute("data-ui"),UI[method]&&((options=elem.getAttribute("data-config"))&&(options=eval("({"+options+"})")||{}),UI[method](elem,options))};var isNew,cache={};return UI.data=function(a,b){return b?(cache[a]=b,void 0):cache[a]},UI.config={},$.extend($.easing,{easeOutExpo:function(a,b,c,d,e){return b==e?c+d:d*(-Math.pow(2,-10*b/e)+1)+c}}),$.extend({random:function(){return String(Math.ceil(1e5*Math.random())+String((new Date).getTime()))},stopDefault:function(a){a.preventDefault?a.preventDefault():a.returnValue=!1},stopBubble:function(a){a.stopPropagation?a.stopPropagation():a.cancelBubble=!0},onScroll:function(a,b){var c=function(a){a=a||window.event,a.wheelDelta||a.detail,$.stopDefault(a),b&&b(a)};document.addEventListener&&a.addEventListener("DOMMouseScroll",c,!1),a.onmousewheel=c},browser:function(){var a,b=navigator.userAgent.toLowerCase(),c={version:b.match(/(?:firefox|opera|safari|chrome|msie)[\/: ]([\d.]+)/)[0],safari:/version.+safari/.test(b),chrome:/chrome/.test(b),firefox:/firefox/.test(b),ie:/msie/.test(b),ie6:/msie 6.0/.test(b),ie7:/msie 7.0/.test(b),ie8:/msie 8.0/.test(b),ie9:/msie 9.0/.test(b),opera:/opera/.test(b)};return function(b){return a=!1,b=b.split(" "),$.each(b,function(b,d){return c[d]?(a=!0,!1):void 0}),a}}(),tmpl:function(){var a={};return function(b,c){var d=/\W/.test(b)?new Function("o","var p=[];with(o){p.push('"+b.replace(/[\r\t\n]/g," ").split("<%").join("	").replace(/((^|%>)[^\t]*)'/g,"$1\r").replace(/\t=(.*?)%>/g,"',$1,'").split("	").join("');").split("%>").join("p.push('").split("\r").join("\\'")+"');}return p.join('');"):a[b]=a[b]||$.tmpl(document.getElementById(b).innerHTML);return c?d(c):d}}(),cookie:function(a,b,c){if("undefined"==typeof b){var d=null;if(document.cookie&&""!=document.cookie)for(var e=document.cookie.split(";"),f=0;f<e.length;f++){var g=$.trim(e[f]);if(g.substring(0,a.length+1)==a+"="){d=decodeURIComponent(g.substring(a.length+1));break}}return d}c=c||{},null===b&&(b="",c.expires=-1);var h="";if(c.expires&&("number"==typeof c.expires||c.expires.toUTCString)){var i;"number"==typeof c.expires?(i=new Date,i.setTime(i.getTime()+1e3*60*60*24*c.expires)):i=c.expires,h="; expires="+i.toUTCString()}var j=c.path?"; path="+c.path:"",k=c.domain?"; domain="+c.domain:"",l=c.secure?"; secure":"";document.cookie=[a,"=",encodeURIComponent(b),h,j,k,l].join("")},addCss:function(a){if("string"==typeof a){var b;document.createStyleSheet?(window.style=a,document.createStyleSheet("javascript:style")):(b=document.createElement("style"),b.type="text/css",b.innerHTML=a,document.getElementsByTagName("HEAD")[0].appendChild(b))}}}),UI.setPos=function(a,b,c){function d(){h=n.width(),i=n.height(),j=u?0:n.scrollTop(),k=u?0:n.scrollLeft(),f=(q?(i-m)*o/100:parseInt(o,10))+j,g=(r?(h-l)*p/100:parseInt(p,10))+k,t[q||f>0?"top":"bottom"]=Math.abs(f),t[r||g>0?"left":"right"]=Math.abs(g)}function e(){a.is(":hidden")||(d(),1==s?a.stop().animate(t,180):2==s&&a.css(t))}if(a&&a.length){b=b||{};var f,g,h,i,j,k,l=a.outerWidth(),m=a.outerHeight(),n=$(window),o=void 0==b.top?50:b.top,p=void 0==b.left?50:b.left,q="number"==typeof o,r="number"==typeof p,s=0==c?0:c||2,t={},u=2==s&&!$.browser("ie6"),v=a.data("setpos");a.css("position",u?"fixed":"absolute"),d(),a.css(t),s&&(v?n.off("."+v):(v="setpos"+(new Date).getTime(),a.data("setpos",v)),n.on("scroll."+v+" resize."+v,e))}},UI.layer=function(){function a(){e=$("body").append('<div id="nj_layer"></div>').find("#nj_layer"),e.css({opacity:"0"}),S=function(){e.css({width:d.width(),height:d.height()})},S(),d.on("scroll resize",S),UI.setPos(e,{top:0,left:0},2),$.onScroll(e[0])}function b(){!e.length&&a(),e.is(":visible")||(f.self=e,f.isShow=!0,e.show().fadeTo(200,.5))}function c(){f.isShow=!1,e.fadeOut()}var d=$(window),e=$("#nj_layer"),f={show:b,hide:c,isShow:!1};return f}(),UI.win=function(a){a=$.extend(UI.config.win,a),this.w=a.width||400,this.self=null,this.close=null,this.tit=null,this.con=null,this.opt=null,this.stillLayer=a.stillLayer||!1,this.layer=0==a.layer?!1:!0,this.pos=a.pos||{left:50,top:50},this.Float=a.Float||0===a.Float?a.Float:2,this.bindEsc=0==a.bindEsc?!1:!0,this.onShow=a.onShow,this.onHide=a.onHide,this.scroll=0,this.init()},UI.win.prototype={init:function(){var a=this,b="nj_win_"+$.random(),c=['<div id="'+b+'" class="nj_win"><div class="win_wrap">','<span class="win_close"></span><div class="win_tit"></div>','<div class="win_con"></div>','<div class="win_opt"></div>',"</div></div>"];UI.win.item[b]=this,this.key=b,$("body").append(c.join("")),this.self=$("#"+b).css({width:a.w,opacity:"0"}),this.close=this.self.find(".win_close"),this.tit=this.self.find(".win_tit"),this.con=this.self.find(".win_con"),this.opt=this.self.find(".win_opt"),new UI.ico(this.close,{type:"close"}),this.bind()},bind:function(){var a=this;this.close.on("click",function(){a.hide()}),this.bindEsc&&$(window).on("keydown",function(b){a.self.is(":visible")&&27==b.keyCode&&a.hide()}),$.onScroll(this.con[0])},setCon:function(a,b,c){if(a&&this.tit.html(a),b&&this.con.html(b),this.button=[],c){this.opt.empty();for(var d=0;d<c.length;d++)this.addBtn.apply(this,c[d])}else""==this.opt.html().replace(/\s/g,"")&&this.opt.css("display","none")},addBtn:function(a,b,c){if(void 0!==a){this.opt.is(":hidden")&&this.opt.show();var d=this,e=$('<a href=""></a>'),c=c?c:"";"string"==typeof b&&"close"!=b&&(c=b,b=null),e.attr({"class":"no"==c?"":"nj_btn n_b_"+c}),e.html("<i>"+a+"</i>"),this.opt.append(e),this.button.push(e),b&&(b="close"==b?function(){d.hide()}:b,e.on("click",function(){return b.call(d),!1}))}},show:function(a){this.self.is(":visible")||(UI.setPos(this.self,this.pos,this.Float),this.layer&&UI.layer.show(),this.self.css({display:"block","margin-top":"-20px"}),this.self.stop().animate({"margin-top":"0",opacity:"1"},420,"easeOutExpo"),setTimeout(function(){a&&a()},100),this.onShow&&this.onShow())},hide:function(a){if(!this.self.is(":hidden")){var b=this;if(this.onbeforehide&&!this.onbeforehide[0]()&&this.onbeforehide[1])return!1;this.self.animate({"margin-top":"-20px",opacity:"0"},120,"easeOutExpo",function(){b.self.hide()}),setTimeout(function(){a&&a()},100),!this.stillLayer&&UI.layer.hide(),this.onHide&&this.onHide()}}},UI.win.item={},UI.win.clear=function(a){function b(a){a.self.remove(),a=null}if(a){var c=UI.win.item[a];c&&b(c)}else{for(var d in UI.win.item)b(UI.win.item[d]);UI.win.item={},UI.msg.win=null}},UI.msg=function(){var a={};return{show:function(b,c,d){d=d||{};var e=this,f=d.btn,g=d.time||1600,h="confirm"==b,i=h?"温馨提醒：":null,j=d.width||(h?400:"auto"),k=0==d.autoHide?!1:!0,l=a[b];this.hide(b,!0),this.hide(),c=c||"","loading"==b?c=c||"正在处理请求,请稍候……":h&&(f=f||[["确定",function(){l.hide(function(){try{d.ok()}catch(a){}})},"sb"],["取消","close"]]),l||(l=new UI.win({width:j,bindEsc:!1}),l.self.addClass("msg_tip_win"),l.self.find("div.win_wrap").attr({"class":"win_wrap msg_tip_"+b}),l.self.width(j),l.layer=h?!0:!1,l.stillLayer=h?!1:!0,l.setCon(i,'<div class="con clearfix"><i class="tip_ico"></i><span class="tip_con"></span></div>'),new UI.ico(l.con.find("i.tip_ico"),{type:h?"warn":b}),a[b]=l),f||l.opt.hide().empty(),l.setCon(null,null,f),l.con.find(".tip_con").html(c),l.show(),h&&l.button[0].focus(),this.timeout=clearTimeout(e.timeout),k&&"confirm"!=b&&"loading"!=b&&(this.timeout=setTimeout(function(){l.hide()},g)),d.reload&&(e.timeout=clearTimeout(e.timeout),setTimeout(function(){d.reload===!0?window.location.reload():"string"==typeof d.reload&&(window.location.href=d.reload)},1500))},hide:function(b,c){if(b&&a[b])(c?a[b].self:a[b]).hide();else for(var d in a)a[d].hide(),c&&a[d].self.hide()}}}(),UI.select=function(a,b){return(isNew=instaceofFun(this,arguments))?isNew:(b=$.extend(UI.config.select,b),this.box=getDom(a),this.box&&(UI.data(this.box[0].id,this),this.show=b.show,this.maxH="auto",this.onSelect=b.onSelect,this.defaultEvent=1==b.defaultEvent?!0:!1,this.size="small"==b.size?"small":"big",this.autoWidth=0==b.autoWidth?!1:!0,this.value=null,this.now=null,this.setCon()),void 0)},UI.select.prototype={setCon:function(){var a=this.box.html().replace(/OPTION|option/g,"li"),b=this.box.find("option"),c="",d=this.box.attr("style"),e=this.box.attr("val")||this.box.val()||0,f=this.box[0].id||"";this.len=b.length,c='<span class="nj_select"><span class="wrap"><i></i><div class="nj_arrow"></div><ul></ul>',c+='<input type="hidden" name="'+this.box.attr("name")+'" value="'+e+'" class="hide" />',c+="</span></span>",this.box.after(c),this.box.hide(),this.box=this.box.next(),this.box.prev().remove(),this.box.attr({style:d,id:f}),this.menu=this.box.find("ul"),this.menu.html(a),this.m_on=this.box.find("i"),this.hide=this.box.find("input.hide"),"small"==this.size&&this.box.addClass("nj_select_s"),this.init()},init:function(a){this.m=this.menu.find("li"),this.length=this.m.length;var b,c,d,e=this.hide.val(),f=parseInt(this.m_on.css("padding-left"))+parseInt(this.m_on.css("padding-right")),g=0;this.m_on.removeAttr("style"),this.menu.removeAttr("style").css({display:"block"});for(var h=0;h<this.length;h++)b=this.m.eq(h),c=b.width(),g=c>g?c:g,b.attr("href")&&(b.wrapInner('<a href="'+b.attr("href")+'" target="'+b.attr("target")+'"></a>'),b.addClass("link"));this.h=this.m.last().outerHeight(),this.show&&/^\d+$/.test(this.show)&&(this.show<this.length?(this.menu.css({"overflow-y":"scroll"}),this.maxH=this.h*this.show-1):(this.menu.css({"overflow-y":"hidden"}),this.maxH=this.h*this.length-1),d=this.menu.width(),d>g+f&&(g=d-f)),this.autoWidth?(this.menu.css("width",g+f),this.m_on.width(g)):(this.m_on.width(this.box.width()-f-2),this.menu.width(this.box.width()-2)),this.menu.css({height:this.maxH,display:"none"}),this.m.removeClass("last").last().addClass("last"),a||this.bindEvent(),""!=e.replace(/\s/g,"")?this.select(e,this.defaultEvent):this.select(this.m.eq(0).attr("value"),this.defaultEvent)},bindEvent:function(){var a,b,c,d=this;this.box.hover(function(){window.clearTimeout(a),d.menu.is(":visible")||(a=window.setTimeout(function(){c=d.menu.attr("style").replace("top","top1").replace("bottom","top1"),d.menu.attr({style:c}).css({display:"none"}),d.box.addClass("nj_select_hover"),b=d.m_on.outerHeight()-1,d.box.offset().top-$(window).scrollTop()+d.box.height()+d.menu.height()>$(window).height()?d.menu.css({bottom:b}):d.menu.css({top:b}),d.menu.show()},90))},function(){window.clearTimeout(a),a=window.setTimeout(function(){d.menu.hide(),d.box.removeClass("nj_select_hover")},200)}),this.menu.click(function(a){var b=a.target,c=($(b).text(),b.getAttribute("value"));"li"==b.tagName.toLowerCase()&&d.select(c)})},select:function(a,b){for(var c,d,e,f=0;f<this.length;f++)if(e=this.m.eq(f),e[0].getAttribute("value")==a){c=e,d=e.text();break}c&&(this.m_on.text(d),c.addClass("select").siblings().removeClass("select"),this.hide.val(a),this.value=a,this.now=c,this.menu.css({display:"none"}),b!==!1&&this.onSelect&&this.onSelect.call(this,a,c))}},UI.select.batch=function(a,b){if(a&&a.length){var c,d,e,f=a.find("select"),g=[],h=f.length;if(h){for(var i=0;h>i;i++)c=f.eq(i),d=c.attr("id"),d&&""!=d.replace(/\s/g,"")||(d="s_"+$.random(),c.attr("id",d)),e=new this(d,b),g.push(e);return g}}},UI.Switch=function(a,b){this.box=$("#"+a),this.init(a,b)},UI.Switch.prototype={init:function(a,b){this.box=$("#"+a),this.box.length&&(this.M=this.box.find(".nj_s_menu").first(),this.menu=this.M.find(".nj_s_m"),this.C=this.box.find(".nj_s_con").first(),this.con=this.C.children(".nj_s_c"),this.length=this.con.length,this.length&&(this.opt=b||{},this.mode="click"==this.opt.mode?"click":"mouseover",this.onChange=this.opt.onChange,this.index=this.opt.firstIndex||0,this.bind()))},bind:function(){var a,b,c=this,d="mouseover"==c.mode?100:0;this.menu.on(this.mode,function(){return b=$(this),b.hasClass("current")?!1:(a=setTimeout(function(){c.change(b.index())},d),!1)}).mouseout(function(){a=clearTimeout(a)}),this.change(this.index)},change:function(a){a=a>this.length-1?0:a,a=0>a?this.length-1:a,this.opt.rule?this.opt.rule.call(this,a):(this.con.eq(a).show().siblings().hide(),this.menu.eq(a).addClass("current").siblings().removeClass("current")),this.index=a,this.onChange&&this.onChange.call(this,a)}},UI.slide=function(a,b){this.init(a,b),this.box.length&&(this.getIndexNum=1==this.opt.getIndexNum?!0:!1,this.getIndexNum&&this.getNum(),this.play=null,this.time=this.opt.time||5e3,this.auto=0==this.opt.auto?!1:!0,this.stopOnHover=0==this.opt.stopOnHover?!1:!0,this.start(!0))},UI.slide.prototype=new UI.Switch,UI.slide.prototype.constructor=UI.slide,UI.slide.prototype.getNum=function(){for(var a="",b=1;b<=this.length;b++)a+='<li class="nj_s_m">'+b+"</li>";this.M.append(a),this.menu=this.M.find(".nj_s_m"),this.bind()},UI.slide.prototype.rule=function(a){this.con.eq(a).fadeIn(300).siblings().hide(),this.menu.eq(a).addClass("current").siblings().removeClass("current"),this.index=a},UI.slide.prototype.start=function(a){function b(){window.clearInterval(c.play),c.play=window.setInterval(function(){c.change(++c.index)},c.time)}var c=this;this.auto&&this.length>1&&(this.stopOnHover?this.box.off().hover(function(){c.play=window.clearInterval(c.play)},function(){b()}).mouseout():b()),a&&c.change(c.index)},UI.ico=function(a,b){return(isNew=instaceofFun(this,arguments))?isNew:(b=$.extend(UI.config.ico,b),this.hasCanvas=!!document.createElement("canvas").getContext,this.type=b.type||"ok",this.ico=$('<i class="nj_ico n_i_'+this.type+'"></i>'),a=getDom(a),a&&a.length&&a.empty(),this.obj=a||$("body:first"),this.obj.append(this.ico),this.canvas=null,this.ctx=null,this.width=b.width||this.ico.width(),this.height=b.height||this.ico.height(),this.ico.css("visibility","hidden"),this.width&&this.height&&(this.color=b.color||this.ico.css("color"),this.bgcolor=b.bgcolor||this.ico.css("background-color"),this.ico.removeAttr("style"),this.ico.css({background:"none",width:this.width,height:this.height}),this.createSpace()),void 0)},UI.ico.prototype={createSpace:function(){var a=document;if(this.hasCanvas)this.canvas=a.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),this.canvas.width=this.width,this.canvas.height=this.height,this.ico.append(this.canvas);else{if(!UI.ico.iscreatevml){var b=a.createStyleSheet(),c=["polyline","oval","arc","stroke","shape"];a.namespaces.add("v","urn:schemas-microsoft-com:vml");for(var d=0;d<c.length;d++)b.addRule("v\\:"+c[d],"behavior:url(#default#VML);display:inline-block;");UI.ico.iscreatevml=!0}this.ico.css("position","relative")}this.draw()},drawLine:function(a,b,c){var d,e=a.length;if(this.hasCanvas){for(this.ctx.beginPath(),this.ctx.moveTo(a[0],a[1]),d=2;e>d;d+=2)this.ctx.lineTo(a[d],a[d+1]);this.ctx.stroke(),b&&this.ctx.fill()}else{var f="",g="";for(d=0;e>d;d+=2)f+=a[d]+","+a[d+1]+" ";g+='<v:polyline strokeWeight="'+c+'" filled="'+(b?"true":"false")+'" class="polyline" strokecolor="'+this.color+'" points="'+f+'" ',b&&(g+='fillcolor="'+this.color+'"'),g+="/>",$(this.canvas).after(g)}},draw:function(){function a(){n.hasCanvas?n.ico.hover(function(){k.clearRect(0,0,g,h),k.beginPath(),k.fillStyle=i,k.strokeStyle=j,k.arc(g/2,h/2,g/2,f,3*f,!1),k.fill(),k.stroke(),k.fillStyle=j,n.drawLine(e,!0)},function(){k.clearRect(0,0,g,h),k.beginPath(),k.fillStyle=j,k.strokeStyle=j,k.arc(g/2,h/2,g/2,f,3*f,!1),k.fill(),k.stroke(),k.fillStyle=i,k.strokeStyle=i,n.drawLine(e,!0)}):n.ico.hover(function(){var a=$(this).find(".oval")[0],b=$(this).find(".polyline")[0];a.fillcolor=a.strokecolor=i,b.fillcolor=b.strokecolor=j},function(){var a=$(this).find(".oval")[0],b=$(this).find(".polyline")[0];a.fillcolor=a.strokecolor=j,b.fillcolor=b.strokecolor=i})}var b,c,d,e,f=Math.PI,g=this.width,h=this.height,i=this.color,j=this.bgcolor,k=this.ctx,l=(this.canvas,this.type),m=document,n=this;"loading"==l?(d=3,this.hasCanvas?(b=f/180,c=200*f/180,k.strokeStyle=this.color,k.lineWidth=d,window.setInterval(function(){k.clearRect(0,0,g,h),b+=.2,c+=.2,k.beginPath(),k.arc(g/2,h/2,g/2-d+1,b,c,!1),k.stroke()},20)):(b=0,d--,this.canvas=m.createElement('<v:arc class="oval" filled="false" style="left:1px;top:1px;width:'+(g-2*d+1)+"px;height:"+(h-2*d+1)+'px" startangle="0" endangle="200"></v:arc>'),$(this.canvas).append('<v:stroke weight="'+d+'" color="'+i+'"/>'),this.ico.append(this.canvas),window.setInterval(function(){b+=6,b=b>360?b-360:b,n.canvas.rotation=b},15))):"ok"==l||"warn"==l||"error"==l||"close"==l?(this.hasCanvas?(k.beginPath(),k.fillStyle=j,k.arc(g/2,h/2,g/2,f,3*f,!1),k.fill(),k.fillStyle=i,k.strokeStyle=i):(this.canvas=m.createElement('<v:oval class="oval" fillcolor="'+j+'" style="width:'+(g-1)+"px;height:"+(h-1)+'px;"></v:oval>'),$(this.canvas).append('<v:stroke color="'+j+'"/>'),this.ico.append(this.canvas)),"ok"==l?(e=[.26*g,.43*h,.45*g,.59*h,.71*g,.33*h,.71*g,.47*h,.45*g,.73*h,.26*g,.57*h],this.drawLine(e,!0)):"warn"==l?(this.hasCanvas?(k.beginPath(),k.arc(.5*g,.73*h,.07*g,f,3*f,!1),k.stroke(),k.fill()):this.ico.append('<v:oval class="oval" fillcolor="#fff" style="width:'+.16*h+"px;height:"+.14*h+"px;left:"+h*($.browser("ie6 ie7")?.43:.4)+"px;top:"+.68*h+'px"><v:stroke color="#fff"/></v:oval>'),e=[.45*g,.22*h,.55*g,.22*h,.55*g,.54*h,.45*g,.54*h],this.drawLine(e,!0)):("error"==l||"close"==l)&&(this.hasCanvas||(g=.95*g,h=.95*h),e=[.33*g,.3*h,.5*g,.46*h,.68*g,.3*h,.72*g,.34*h,.55*g,.52*h,.71*g,.68*h,.68*g,.73*h,.5*g,.56*h,.34*g,.72*h,.29*g,.69*h,.46*g,.51*h,.29*g,.34*h],this.drawLine(e,!0),"close"==l&&a())):this["Draw"+l]&&this["Draw"+l]()}},UI.ico.batch=function(a,b){var c,d,e,f,g={},h=this;for(c in a){if(d=a[c],e=d.length,e>1)for(f=0;e>f;f++)new h(c,d.eq(f),b);else{if(1!=e)continue;new h(c,d,b)}g[c]=d}return g},UI.ico.add=function(a,b){UI.ico.prototype["Draw"+a]||(UI.ico.prototype["Draw"+a]=b)},UI.menu=function(a,b){return(isNew=instaceofFun(this,arguments))?isNew:(this.opt=b=$.extend(UI.config.menu,b),this.obj=a=getDom(a),this.menu=null,this.content=b.content||"",this.align=b.align||"left",this.mode=b.mode||"mouseover",this.offset=b.offset||[0,0],this.autoWidth=b.autoWidth===!1?!1:!0,this.now=a?this.obj.eq(0):null,this.agent=b.agent===!0?!0:!1,this.disable=!1,this.init(),void 0)},UI.menu.prototype={init:function(){this.mode="focus"==this.mode?"focus click":this.mode,this.menu=$('<div class="nj_menu"><div class="wrap clearfix"></div></div>'),$("body").append(this.menu),this.setCon(),this.bind(),this.opt.className&&this.menu.addClass(this.opt.className)},bind:function(){function a(a){if(e.disable)return!1;if(a=a||e.obj,"click"==e.mode&&e.menu.is(":visible")){if(e.now.is(a))return b(),!1;b(!0)}else d=window.clearTimeout(d);return e.now=a,c=window.setTimeout(function(){a.addClass("nj_menu_hover"),e.setPos(),e.opt.onShow&&e.opt.onShow.call(e,a)},g),f?void 0:!1}function b(a){function b(){e.now.removeClass("nj_menu_hover"),1!=a&&e.menu.hide(),e.opt.onHide&&e.opt.onHide.call(e,e.now)}1==a?b():d=window.setTimeout(function(){b()},g)}var c,d,e=this,f="mouseover"==this.mode,g=f||"focus"==this.mode?60:0;this.agent||(this.obj.on(this.mode,function(b){return $.stopBubble(b),a($(this))}),f?(this.obj.on("mouseout",function(){c=window.clearTimeout(c),b()}),this.menu.hover(function(){d=window.clearTimeout(d)},b)):"focus"==this.mode&&this.obj.on("blur",function(){c=window.clearTimeout(c),b()})),f||(this.menu.on("click",function(a){d=window.clearTimeout(d),$.stopBubble(a)}),$(document).on("click",function(){e.menu.is(":visible")&&b()})),this.show=a,this.hide=b,$(window).on("scroll resize",function(){e.menu.is(":visible")&&e.setPos()}),this.menu.find(".close").on("click",function(a){e.hide(),$.stopBubble(a)}),function(){var a,b,c=e.opt.onSelect;if(c)for(a in c)b=e.menu.find("["+a+"]"),b.length&&function(a){b.bind("click",function(b){return c[a].call(e,$(this),b),!1})}(a)}()},setPos:function(){var a=this,b=this.now.outerHeight(),c=this.now.offset().top,d=this.now.offset().left,e=d+this.offset[0],f=c+b+this.offset[1];"right"==this.align&&(e-=this.menu.outerWidth()-this.now.outerWidth()),this.menu.removeAttr("style").css({left:e,top:f,"z-index":"999",display:"block"}),this.autoWidth||this.menu.width(this.now.outerWidth()),function(){var b=a.menu.outerHeight(),d=$(window),e=d.scrollTop(),g=$(window).height();f+b-e>g&&(f=c-b,0>f?(a.menu.css({top:0,overflow:"auto",height:c-2-a.offset[1]}),f=0):a.menu.css({top:f-a.offset[1]}))}()},setCon:function(a){a=a||this.content,this.menu.children(".wrap").empty().append(a)}},$.browser("ie6 ie7 ie8 ie9")&&$(function(){var a,b=$("[placeholder]"),c=b.length;if(c)for(a=0;c>a;a++)placeHolder(b.eq(a),a)}),UI});