/*2013/11/14-http://nolure.github.io/nojs.docs*/!function(a,b){"function"==typeof define&&define.cmd?define("nojs/ui",[],b):a.ui=b(null,jQuery)}(this,function(require,$){function instaceofFun(a,b){return a instanceof b.callee?!1:newFun(b.callee,Array.prototype.slice.call(b))}function newFun(a,b){function c(a,b){a.apply(this,b)}return c.prototype=a.prototype,isNew=null,new c(a,b)}function getDom(a){if(a){var b,c=typeof a;return"string"==c?b=$("#"+a):"object"==c&&(b=a.nodeType||a==window?$(a):a),b=b.length?b:null}}function Extend(a,b){var c=function(){};c.prototype=b.prototype,a.prototype=new c,a.prototype.constructor=a,a.baseConstructor=b,a.baseClass=b.prototype}function placeHolder(a,b){var c,d=.98*a.innerWidth(),e=a.outerHeight(),f=a.attr("id"),g=a.attr("placeholder");b=b||0,f=f||"ph_lab"+b,c=$('<label for="'+f+'" style="width:'+d+"px;height:"+e+'px" class="ph_lab ph_lab'+b+'">'+g+"</label>"),/.*\s{2}$/.test(g)&&$.browser("ie6 ie7")&&(a.wrap($('<span class="ph_wrap" style="position:relative;float:'+a.css("float")+'"></span>')),c.css("left","0")),"input"==a[0].tagName.toLowerCase()&&c.css("line-height",e+"px"),a.attr("id",f).before(c),a.on("blur propertychange",function(){setTimeout(function(){""==a.val()?c.show():c.hide()},15)}),setTimeout(function(){""!=a.val()&&c.hide()},150)}var ui={};ui.init=function(area){area=area||$("body");var dom=area.find("[data-ui]"),i,elem,method,options;for(i=0;i<dom.length;i++)elem=dom[i],method=elem.getAttribute("data-ui"),ui[method]&&((options=elem.getAttribute("data-config"))&&(options=eval("({"+options+"})")||{}),ui[method](elem,options))};var isNew,cache={};return Extend.proto=function(a,b){for(var c in b)!function(b,d){a.prototype[c]=function(){b.apply(this,[d].concat(Array.prototype.slice.call(arguments)))}}(b[c],a.prototype[c])},ui.extend=Extend,ui.data=function(a,b){return b?(cache[a]=b,void 0):cache[a]},ui.config={},$.extend($.easing,{easeOutExpo:function(a,b,c,d,e){return b==e?c+d:d*(-Math.pow(2,-10*b/e)+1)+c}}),$.extend({type:function(a){return null==a?String(a):Object.prototype.toString.call(a).slice(8,-1).toLowerCase()},random:function(){return String(Math.ceil(1e5*Math.random())+String((new Date).getTime()))},onScroll:function(a,b){var c=function(a){a=a||window.event,a.wheelDelta||a.detail,a.preventDefault(),b&&b(a)};document.addEventListener&&a.addEventListener("DOMMouseScroll",c,!1),a.onmousewheel=c},browser:function(){var a,b=navigator.userAgent.toLowerCase(),c={version:b.match(/(?:firefox|opera|safari|chrome|msie)[\/: ]([\d.]+)/)[0],safari:/version.+safari/.test(b),chrome:/chrome/.test(b),firefox:/firefox/.test(b),ie:/msie/.test(b),ie6:/msie 6.0/.test(b),ie7:/msie 7.0/.test(b),ie8:/msie 8.0/.test(b),ie9:/msie 9.0/.test(b),opera:/opera/.test(b)};return function(b){return a=!1,b=b.split(" "),$.each(b,function(b,d){return c[d]?(a=!0,!1):void 0}),a}}(),tmpl:function(){var a={};return function(b,c){var d=/\W/.test(b)?new Function("o","var p=[];with(o){p.push('"+b.replace(/[\r\t\n]/g," ").split("<%").join("	").replace(/((^|%>)[^\t]*)'/g,"$1\r").replace(/\t=(.*?)%>/g,"',$1,'").split("	").join("');").split("%>").join("p.push('").split("\r").join("\\'")+"');}return p.join('');"):a[b]=a[b]||$.tmpl(document.getElementById(b).innerHTML);return c?d(c):d}}(),cookie:function(a,b,c){if("undefined"==typeof b){var d="";if(document.cookie&&""!=document.cookie)for(var e=document.cookie.split(";"),f=0;f<e.length;f++){var g=$.trim(e[f]);if(g.substring(0,a.length+1)==a+"="){d=decodeURIComponent(g.substring(a.length+1));break}}return d}c=c||{},null===b&&(b="",c.expires=-1);var h="";if(c.expires&&("number"==typeof c.expires||c.expires.toUTCString)){var i;"number"==typeof c.expires?(i=new Date,i.setTime(i.getTime()+1e3*60*60*24*c.expires)):i=c.expires,h="; expires="+i.toUTCString()}var j=c.path?"; path="+c.path:"",k=c.domain?"; domain="+c.domain:"",l=c.secure?"; secure":"";document.cookie=[a,"=",encodeURIComponent(b),h,j,k,l].join("")},addCss:function(a){if("string"==typeof a){var b;document.createStyleSheet?(window.style=a,document.createStyleSheet("javascript:style")):(b=document.createElement("style"),b.type="text/css",b.innerHTML=a,document.getElementsByTagName("HEAD")[0].appendChild(b))}}}),ui.align=function(a){this.options=a=a||{},this.element=getDom(a.element),this.nearby=getDom(a.nearby);var b=this.nearby&&this.nearby[0]==window;this.position=a.position||(b?{top:50,left:50}:{top:100,left:0}),this.relative=void 0!=a.relative?a.relative:b?!0:!1,this.fixed=void 0==a.fixed&&b?"fixed":a.fixed,this.cssFixed="fixed"==this.fixed&&!$.browser("ie6")&&b,this.offset=a.offset||[0,0],this.isWrap=this.nearby&&(b||this.nearby.find(this.element).length),this.autoAdjust=a.autoAdjust,this.element&&this.bind()},ui.align.prototype={bind:function(){var a=this,b=this.element.data("align");b?this.nearby.add(window).off("."+b):(b="align"+(new Date).getTime(),this.element.data("align",b)),!this.cssFixed&&this.fixed&&this.nearby.on("scroll."+b,function(){a.set()}),$(window).on("resize."+b,function(){a.set()}),this.set()},get:function(a){a=a||this.nearby;var b=a.offset(),c={width:a.outerWidth(),height:a.outerHeight(),x:b?b.left:0,y:b?b.top:0,scrollLeft:this.cssFixed?0:a.scrollLeft(),scrollTop:this.cssFixed?0:a.scrollTop(),WIDTH:this.element.outerWidth(),HEIGHT:this.element.outerHeight()};return c},set:function(a){if(this.element){a=a||{};var b=a.position||this.position,c=getDom(a.nearby)||this.nearby;if(c){var d,e,f,g,h,i,j,k=this.get(c),l={x:{},y:{}},m={};this.isWrap&&(k.x=k.y=0),l.x.element="WIDTH",l.y.element="HEIGHT",l.x.nearby="width",l.y.nearby="height",l.x.offset=0,l.y.offset=1,l.x.scroll="scrollLeft",l.y.scroll="scrollTop";for(e in b)f=g=b[e],h=typeof f,"function"==h&&(f=f(k),h=typeof f),i="top"==e||"bottom"==e?"y":"x",d=l[i],f="number"==h?(k[d.nearby]-(this.relative?k[d.element]:0))*f/100:parseInt(f,10),("bottom"==e||"right"==e)&&(f*=-1,f-=k[d.element]-k[d.nearby]),f+=k[i]+this.offset[d.offset]+k[d.scroll],this.autoAdjust&&(j=this.isWrap?k[d.nearby]:$(window)[d.nearby](),f+k[d.element]-k[d.scroll]>j?f=k[d.element]<k[i]-k[d.scroll]?k[i]-k[d.element]:k[d.scroll]:f<k[d.scroll]&&(f=k[d.scroll])),m["x"==i?"left":"top"]=f;return this.element.css("position",this.cssFixed?"fixed":"absolute"),"animate"==this.fixed?(this.element.stop().animate(m,200),void 0):(this.element.css(m),void 0)}}}},ui.overlay=function(a){ui.overlay.baseConstructor.call(this,a),this.visible=!1,this.content=null,this.arrow=this.options.arrow,this.timeout=this.options.timeout,this.onShow=this.options.onShow,this.onHide=this.options.onHide,ui.overlay.item.push(this),this.init()},Extend(ui.overlay,ui.align),Extend.proto(ui.overlay,{set:function(a,b,c){"content"==b?this.content.empty().append(c):a.call(this,c)}}),ui.overlay.item=[],ui.overlay.hide=function(){for(var a=ui.overlay.item,b=a.length,c=0;b>c;c++)a[c].hide()},ui.overlay.prototype.init=function(){var a=this.options.className;a="string"==typeof a?a:"",this.element=$('<div class="nj_overlay '+a+'"><div class="nj_overlay_wrap"></div></div>').appendTo(document.body).css({display:"block",visibility:"hidden"}),this.content=this.element.find(".nj_overlay_wrap"),this.arrow&&(this.arrow.element=$('<div class="nj_overlay_arrow"></div>').appendTo(this.element),this.arrow.offset=this.arrow.offset||[0,0]),this.bind()},ui.overlay.prototype.show=function(a){if(!this.visible){var b=this;return this.element.css("visibility","visible"),this.set(),this.timeout&&(this.autoHide=setTimeout(function(){b.hide()},this.timeout)),this.visible=!0,a&&a.call(this),this.onShow&&this.onShow.call(this),void 0}},ui.overlay.prototype.hide=function(a){this.visible&&(this.element.css("visibility","hidden"),this.autoHide=clearTimeout(this.autoHide),this.visible=!1,a&&a.call(this),this.onHide&&this.onHide.call(this))},ui.overlay.prototype.on=function(a){a=a||{};var b,c,d,e,f,g,h=this,i=a.mode||"mouseover",j="array"==$.type(a.element)&&a.element.length>1,k=getDom(j?a.element[0]:a.element)||this.nearby,l=this.options.hoverClass||"nj_overlay_show",m=this.onShow,n=this.onHide;k&&(b="mouseover"==i,g=b?" mouseout":"",c=function(c){var d,l,m,n;if(j){if(d=c.target,l=d.tagName.toLowerCase(),n=a.element[1],m=typeof n,"function"==m?n=n.call(d,l):"string"==m&&n==l||(n=null),!n)return;h.nearby&&h.nearby[0]!=d&&h.visible&&h.hide(),k=h.nearby=$(d)}return c.stopPropagation(),b?!function(){f=clearTimeout(f),e=setTimeout(function(){h.show()},10)}():!g&&h.visible?h.hide():h.show(),"click"==i?!1:void 0},d=function(a){a.stopPropagation(),g?!function(){e=clearTimeout(e),f=setTimeout(function(){h.hide()},10)}():h.hide()},this.onShow=function(){k.addClass(l),m&&m.call(h)},this.onHide=function(){k.removeClass(l),n&&n.call(h)},k.on(i,c),g&&k.on(g,d),!b&&!function(){$(document).click(d),h.element.click(function(a){a.stopPropagation()})}(),b&&this.element.hover(function(){f=clearTimeout(f)},d))},ui.layer=function(){function a(){e=$('<div id="nj_layer"></div>').appendTo(document.body),$.browser("ie6")&&(S=function(){e.css({width:d.width(),height:d.height()})},S(),d.on("scroll resize",S),new ui.align({element:e})),$.onScroll(e[0]),f.element=e}function b(b){!document.getElementById("nj_layer")&&a(),e.show().stop().fadeTo(200,"number"==typeof b?b:.8)}function c(){e.fadeTo(200,0,function(){e.hide()})}var d=$(window),e=$("#nj_layer"),f={show:b,hide:c};return f}(),ui.popup=function(a){a=a||{},a.className="nj_win "+(a.className||""),a.nearby=a.nearby||window,ui.popup.baseConstructor.call(this,a),this.width=a.width||400,this.close=null,this.title=null,this.operating=null,this.stillLayer=a.stillLayer||!1,this.layer=0==a.layer?!1:!0,this.bindEsc=0==a.bindEsc?!1:!0,this.onShow=a.onShow,this.onHide=a.onHide,this.create()},Extend(ui.popup,ui.overlay),Extend.proto(ui.popup,{set:function(a,b,c){if("title"==b)c&&this.title.html(c).show();else if("button"==b){if(this.button=[],c){this.operating.empty().show();for(var d=0;d<c.length;d++)this.addBtn.apply(this,c[d])}}else a.call(this,b,c)},show:function(a,b){this.visible||(this.layer&&ui.layer.show(),a.call(this,b),this.element.css({"margin-top":-20}),this.element.stop().animate({"margin-top":"0",opacity:"1"},400,"easeOutExpo"),this.bindEsc&&!ui.popup.focus[this.key]&&(ui.popup.focus[this.key]=this))},hide:function(a,b){if(this.visible){var c=this,d=this.layer&&!this.stillLayer;(!this.onbeforehide||this.onbeforehide())&&(a.call(c,b),this.element.css("visibility","visible"),this.element.animate({"margin-top":-20,opacity:"0"},400,"easeOutExpo",function(){c.element.css("visibility","hidden")}),this.layer&&$.each(ui.popup.item,function(){return this.key!=c.key&&this.visible&&this.layer?(d=!1,!1):void 0}),d&&ui.layer.hide(),delete ui.popup.focus[this.key])}}}),ui.popup.prototype.create=function(){var a=this,b="nj_popup_"+$.random();ui.popup.item[b]=this,this.key=b,this.set("content",['<span class="win_close"></span><div class="win_tit"></div>','<div class="win_con clearfix"></div>','<div class="win_opt"></div>'].join("")),this.content.addClass("win_wrap"),this.element.css({width:a.width,opacity:"0"}),this.element[0].id=b,this.close=this.element.find(".win_close"),this.title=this.element.find(".win_tit").hide(),this.content=this.element.find(".win_con"),this.operating=this.element.find(".win_opt").hide(),new ui.ico(this.close,{type:"close"}),this.close.on("click",function(){a.hide()}),this.bindEsc&&!ui.popup.bind.init&&ui.popup.bind(),$.onScroll(this.content[0])},ui.popup.prototype.addBtn=function(a,b,c){if(void 0!==a){this.operating.is(":hidden")&&this.operating.show();var d=this,e=$('<a href=""></a>'),c=c?c:"";"string"==typeof b&&"close"!=b&&(c=b,b=null),e.attr({"class":"no"==c?"no":"nj_btn n_b_"+c}),e.html("<i>"+a+"</i>"),this.operating.append(e),this.button.push(e),b&&(b="close"==b?function(){d.hide()}:b,e.on("click",function(){return b.call(d),!1}))}},ui.popup.item={},ui.popup.clear=function(a){function b(a){a.self.remove(),a=null}if(a){var c=ui.popup.item[a];c&&b(c)}else{for(var d in ui.popup.item)b(ui.popup.item[d]);ui.popup.item={},ui.msg.win=null}},ui.popup.focus={},ui.popup.bind=function(){ui.popup.bind.init||(ui.popup.bind.init=!0,$(window).on("keydown",function(a){if(27==a.keyCode){var b,c;for(b in ui.popup.focus)c=ui.popup.focus[b];c.bindEsc&&c.visible&&c.hide()}}))},ui.msg=function(){var a={};return{show:function(b,c,d){d=d||{};var e=d.button,f=void 0!=d.timeout?d.timeout:1600,g="confirm"==b,h=g?"温馨提醒：":null,i=d.width||(g?400:"auto"),j=a[b];this.hide(!0),c=c||"","loading"==b?c=c||"正在处理请求,请稍候……":g&&(e=e||[["确定",function(){j.hide(function(){"function"==typeof d.ok&&d.ok.call(this)})},"sb"],["取消","close"]]),j&&$("#"+j.key).length||(j=new ui.popup({width:i,bindEsc:g?!0:!1,className:"msg_tip_win"}),j.element.find("div.nj_overlay_wrap").addClass("msg_tip_"+b),j.set("title",h),j.set("content",'<div class="con clearfix"><i class="tip_ico"></i><span class="tip_con"></span></div>'),new ui.ico(j.content.find("i.tip_ico"),{type:g?"warn":b}),a[b]=j,g&&(j.onShow=function(){ui.layer.element.addClass("higher_layer")},j.onHide=function(){ui.layer.element.removeClass("higher_layer")})),j.layer=g?!0:d.layer,j.timeout=g||"loading"==b||d.reload?0:f,d.reload&&setTimeout(function(){d.reload===!0?location.reload():"string"==typeof d.reload&&(location.href=d.reload)},1500),!e&&j.operating.hide().empty(),j.set("button",e),j.content.find(".tip_con").html(c),j.show(),g&&j.button[0].focus()},hide:function(b){for(var c in a)b&&a[c].element.stop().css("visibility","hidden"),a[c].hide()}}}(),ui.select=function(a,b){return(isNew=instaceofFun(this,arguments))?isNew:(b=b||{},(b.nearby=getDom(a))&&(b.className="nj_select_list "+(b.className||""),b.hoverClass=b.hoverClass||"nj_select_show",ui.select.baseConstructor.call(this,b),this.nearby&&"select"==this.nearby[0].tagName.toLowerCase()&&(this._select=this.nearby,ui.data(this.nearby[0].id,this),this.max=this.options.max,this.onSelect=this.options.onSelect,this.defaultEvent=1==this.options.defaultEvent?!0:!1,this.autoWidth=0==this.options.autoWidth?!1:!0,this.index=0,this.value=this.nearby[0].getAttribute("value")||this.nearby.val(),this.replace())),void 0)},Extend(ui.select,ui.overlay),ui.select.prototype.replace=function(a){var b,c,d=this.nearby.find("option"),e=this.nearby.find("optgroup");if(e.length){var f,g;for(f=0;f<e.length;f++)g=e.eq(f),g.before("<dt>"+g.attr("label")+"</dt>").replaceWith(g.html())}b=$("<dl>"+this.nearby.html().replace(/(<\/?)option(>?)/gi,"$1dd$2")+"</dl>"),e.length&&b.addClass("group"),this.length=d.length,c=$(['<span class="nj_select" tabindex="-1"><i class="nj_s_wrap"></i><div class="nj_arrow"></div>','<input type="hidden" name="'+this.nearby.attr("name")+'" value="'+this.value+'" class="hide" />',"</span>"].join("")),this.nearby.replaceWith(c),this.nearby=c,this.set("content",b),this.current=this.nearby.find("i"),this.hidden=this.nearby.find("input.hide"),this.item=this.element.find("dd");var h="auto";this.max&&/^\d+$/.test(this.max)&&this.max>1&&this.max<this.length&&(g=this.item.last(),h=g.outerHeight()*this.max,e.length&&(h+=this.item.eq(this.max-1).prevAll("dt").length*g.siblings("dt").outerHeight()),b.height(h)),this.autoWidth&&this.nearby.width(this.element.width()),!a&&this.bindEvent(),!this.select(this.value,this.defaultEvent)&&this.select(0,this.defaultEvent)},ui.select.prototype.bindEvent=function(){var a=this;this.on({mode:this.options.mode}),this.element.click(function(b){var c=b.target;c.getAttribute("value"),"dd"==c.tagName.toLowerCase()&&(a.select(a.item.index(c)),a.nearby.focus(),a.hide())}),this.nearby.keydown(function(b){if(38==b.which)a.index--;else if(40==b.which)a.index++;else{if(13!=b.which)return;a.hide()}a.select(a.index)})},ui.select.prototype.select=function(a,b){var c,d,e,f;if("string"==typeof a){if(f=this.content.find('dd[value="'+a+'"]'),f.length)c=f.first(),this.index=this.item.index(c);else for(e=0;e<this.length;e++)if(d=this.item.eq(e),d.text()==a){c=d,this.index=e;break}}else"number"==typeof a&&(a=0>a?this.length-1:a,a=a>this.length-1?0:a,this.index=a,c=this.item.eq(a),a=c.attr("value")||"");if(c)return this.current.text(c.text()),c.addClass("select").siblings().removeClass("select"),this.hidden.val(a),this.value=a,b!==!1&&this.onSelect&&this.onSelect.call(this,a),c},ui.Switch=function(a,b){return(isNew=instaceofFun(this,arguments))?isNew:((this.element=getDom(a))&&(this.M=this.element.find(".nj_s_menu").first(),this.menu=this.M.find(".nj_s_m"),this.C=this.element.find(".nj_s_con").first(),this.con=this.C.children(".nj_s_c"),this.length=this.con.length,this.length&&(this.options=b=b||{},this.mode="click"==b.mode?"click":"mouseover",this.onChange=b.onChange,this.onHide=b.onHide,this.index=this.getIndex(b.firstIndex),this.rule=b.rule||this.rule,this.bind())),void 0)},ui.Switch.prototype={bind:function(){var a,b,c=this,d="mouseover"==this.mode?100:0;this.menu&&(this.menu.on(this.mode+".nj_switch",function(){return b=$(this),b.hasClass("current")?!1:(c.onTrigger&&c.onTrigger(),a=setTimeout(function(){c.change(b.index())},d),!1)}).mouseout(function(){a=clearTimeout(a)}),this.change(this.index))},getIndex:function(a){return a=parseInt(a)||0,a=a>this.length-1?0:a,a=0>a?this.length-1:a},change:function(a){a=this.getIndex(a),this.rule?this.rule.call(this,a):(this.con.eq(a).show().siblings().hide(),this.menu.eq(a).addClass("current").siblings().removeClass("current")),this.onHide&&this.index!=a&&this.onHide.call(this,this.index),this.index=a,this.onChange&&this.onChange.call(this,a)}},ui.slide=function(a,b){if(ui.slide.baseConstructor.call(this,a,b),this.element){this.play=null,this.time=this.options.time||5e3,this.auto=0==this.options.auto?!1:!0,this.stopOnHover=0==this.options.stopOnHover?!1:!0;var c=this;this.stopOnHover&&this.element.hover(function(){c.play=clearInterval(c.play)},function(){c.start()}),this.getNum(),this.start(!0)}},Extend(ui.slide,ui.Switch),ui.slide.prototype.getNum=function(){if(!this.M.children().length){for(var a="",b=1;b<=this.length;b++)a+='<li class="nj_s_m">'+b+"</li>";this.M.append(a),this.menu=this.M.find(".nj_s_m"),this.bind()}},ui.slide.prototype.onTrigger=function(){!this.stopOnHover&&this.start()},ui.slide.prototype.rule=function(a){this.con.eq(a).fadeIn(300).siblings().hide(),this.menu.eq(a).addClass("current").siblings().removeClass("current"),this.index=a},ui.slide.prototype.start=function(a){var b=this;!this.auto||this.length<2||(a&&this.change(this.index),clearInterval(b.play),b.play=setInterval(function(){b.change(++b.index)},b.time))},ui.ico=function(a,b){return(isNew=instaceofFun(this,arguments))?isNew:(b=b||{},this.hasCanvas=!!document.createElement("canvas").getContext,this.type=b.type||"ok",this.ico=$('<i class="nj_ico n_i_'+this.type+'"></i>'),(a=getDom(a))&&(a.html(this.ico),this.canvas=null,this.ctx=null,this.width=b.width||this.ico.width()||16,this.height=b.height||this.ico.height()||16,this.color=b.color||this.ico.css("color"),this.bgcolor=b.bgcolor||this.ico.css("background-color"),this.ico.css({background:"none",width:this.width,height:this.height}),this.createSpace()),void 0)},ui.ico.prototype={createSpace:function(){var a=document;if(this.hasCanvas)this.canvas=a.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),this.canvas.width=this.width,this.canvas.height=this.height,this.ico.append(this.canvas);else{if(!ui.ico.iscreatevml){var b=a.createStyleSheet(),c=["polyline","oval","arc","stroke","shape"];a.namespaces.add("v","urn:schemas-microsoft-com:vml");for(var d=0;d<c.length;d++)b.addRule("v\\:"+c[d],"behavior:url(#default#VML);display:inline-block;");ui.ico.iscreatevml=!0}this.ico.css("position","relative")}this.draw()},drawLine:function(a,b,c){var d,e=a.length;if(this.hasCanvas){for(this.ctx.beginPath(),this.ctx.moveTo(a[0],a[1]),d=2;e>d;d+=2)this.ctx.lineTo(a[d],a[d+1]);this.ctx.stroke(),b&&this.ctx.fill()}else{var f="",g="";for(d=0;e>d;d+=2)f+=a[d]+","+a[d+1]+" ";g+='<v:polyline strokeWeight="'+c+'" filled="'+(b?"true":"false")+'" class="polyline" strokecolor="'+this.color+'" points="'+f+'" ',b&&(g+='fillcolor="'+this.color+'"'),g+="/>",$(this.canvas).after(g)}},draw:function(){function a(){n.hasCanvas?n.ico.hover(function(){k.clearRect(0,0,g,h),k.beginPath(),k.fillStyle=i,k.strokeStyle=j,k.arc(g/2,h/2,g/2,f,3*f,!1),k.fill(),k.stroke(),k.fillStyle=j,n.drawLine(e,!0)},function(){k.clearRect(0,0,g,h),k.beginPath(),k.fillStyle=j,k.strokeStyle=j,k.arc(g/2,h/2,g/2,f,3*f,!1),k.fill(),k.stroke(),k.fillStyle=i,k.strokeStyle=i,n.drawLine(e,!0)}):n.ico.hover(function(){var a=$(this).find(".oval")[0],b=$(this).find(".polyline")[0];a.fillcolor=a.strokecolor=i,b.fillcolor=b.strokecolor=j},function(){var a=$(this).find(".oval")[0],b=$(this).find(".polyline")[0];a.fillcolor=a.strokecolor=j,b.fillcolor=b.strokecolor=i})}var b,c,d,e,f=Math.PI,g=this.width,h=this.height,i=this.color,j=this.bgcolor,k=this.ctx,l=(this.canvas,this.type),m=document,n=this;"loading"==l?(d=3,this.hasCanvas?(b=f/180,c=200*f/180,k.strokeStyle=this.color,k.lineWidth=d,window.setInterval(function(){k.clearRect(0,0,g,h),b+=.2,c+=.2,k.beginPath(),k.arc(g/2,h/2,g/2-d+1,b,c,!1),k.stroke()},20)):(b=0,d--,this.canvas=m.createElement('<v:arc class="oval" filled="false" style="left:1px;top:1px;width:'+(g-2*d+1)+"px;height:"+(h-2*d+1)+'px" startangle="0" endangle="200"></v:arc>'),$(this.canvas).append('<v:stroke weight="'+d+'" color="'+i+'"/>'),this.ico.append(this.canvas),window.setInterval(function(){b+=6,b=b>360?b-360:b,n.canvas.rotation=b},15))):"ok"==l||"warn"==l||"error"==l||"close"==l?(this.hasCanvas?(k.beginPath(),k.fillStyle=j,k.arc(g/2,h/2,g/2,f,3*f,!1),k.fill(),k.fillStyle=i,k.strokeStyle=i):(this.canvas=m.createElement('<v:oval class="oval" fillcolor="'+j+'" style="width:'+(g-1)+"px;height:"+(h-1)+'px;"></v:oval>'),$(this.canvas).append('<v:stroke color="'+j+'"/>'),this.ico.append(this.canvas)),"ok"==l?(e=[.26*g,.43*h,.45*g,.59*h,.71*g,.33*h,.71*g,.47*h,.45*g,.73*h,.26*g,.57*h],this.drawLine(e,!0)):"warn"==l?(this.hasCanvas?(k.beginPath(),k.arc(.5*g,.73*h,.07*g,f,3*f,!1),k.stroke(),k.fill()):this.ico.append('<v:oval class="oval" fillcolor="#fff" style="width:'+.16*h+"px;height:"+.14*h+"px;left:"+h*($.browser("ie6 ie7")?.43:.4)+"px;top:"+.68*h+'px"><v:stroke color="#fff"/></v:oval>'),e=[.45*g,.22*h,.55*g,.22*h,.55*g,.54*h,.45*g,.54*h],this.drawLine(e,!0)):("error"==l||"close"==l)&&(this.hasCanvas||(g=.95*g,h=.95*h),e=[.33*g,.3*h,.5*g,.46*h,.68*g,.3*h,.72*g,.34*h,.55*g,.52*h,.71*g,.68*h,.68*g,.73*h,.5*g,.56*h,.34*g,.72*h,.29*g,.69*h,.46*g,.51*h,.29*g,.34*h],this.drawLine(e,!0),"close"==l&&a())):this["Draw"+l]&&this["Draw"+l]()}},$.browser("ie6 ie7 ie8 ie9")&&$(function(){var a,b=$("[placeholder]");for(a=0;a<b.length;a++)placeHolder(b.eq(a),a)}),ui});