/*nolure@vip.qq.com|http://nolure.github.io/nojs.docs*/define("main",["nojs/module/tree","nojs/module/codelight","project"],function(require,a,b){function c(a,b){var d,e,f=location.hash.replace(/^#/,"").split("&"),g={};for(a=a||"id",d=0;d<f.length;d++)f[d]&&(e=f[d].split("="),g[e[0]]=e[1]);if(b==g[a])return g[a];if(null===b)delete g[a];else{if(void 0===b)return g[a];g[a]=b,c.key=a}f=[];for(d in g)f.push(d+"="+g[d]);v=1,location.hash=f.join("&")}function d(){var a=p.height()-x;t.height(a)}function e(b,c){var d,e,f=c.data;if(f){e="menu_"+b,d=a('<div id="'+e+'" class="nj_tree"></div>'),s.append(d);var i=new h(e,{openAll:"nojs"==b?!1:!0,data:f,max:5,onSelect:w.onSelect,defaultNode:w.defaultNode});"nojs"==b&&(g=i),k.project.push(i)}}function f(a){a&&u.is(":hidden")||(a||(a="show"==f.display?"hide":"show"),"show"==a?(s.css("left","0"),f.display="show"):(s.css("left","-15em").removeAttr("style"),f.display="hide"))}var g,h=require("nojs/module/tree"),i=require("nojs/module/codelight"),j=require("project"),k={},l=a("#ui_page"),m=(a("#main_content"),a("#ui_head")),n=m.find(".options"),o={container:a("#demo_content").css("opacity","0"),isOpen:null},p=a(window),q="mobile"==window.Page?"mb_intro":"nojs_info",r=a("#iframe_content"),s=a("#side_menu"),t=l.children("div.ui_wrap"),u=a("#show_menu"),v=0;c.key="id",o.openFirst=void 0!=c("demo"),"undefined"!=typeof onhashchange&&(window.onhashchange=function(){var a,b,d=c(),e=c.key;if(d&&"id"==e)for(a=0;a<k.project.length;a++)if(b=k.project[a],b.data.all[d]){v=0,b.select(d);break}"demo"==e&&o.tab&&o.isOpen&&c("demo")!=o.index&&o.tab.change(c("demo"))}),a(window).bind("popstate",function(){});var w={defaultNode:c()||q,onSelect:function(d){var e=d.link,g=d.id;if(o.hide(),c("id",g),!(v>0)){if(!e)return n.hide(),void 0;window.demoAction=o.init=o.tab=null,r.html('<i class="load"></i>'),new b.ico(r.find("i.load"),{type:"loading",width:32,height:32}),l.siblings().remove();var h=this.box[0].id,j=h.substring(h.indexOf("_")+1,h.length),m="project/"+j+"/"+e+".html";"project"!=g&&this.box.siblings(".nj_tree").find("a.current").removeClass("current"),r.load(m,function(){n[window.demoAction?"show":"hide"](),window.demoAction&&(o.container.html(o.getHtml()),void 0!=c("demo")&&o.show(c("demo"))),new i({parent:r}),r.click(function(b){var c,d,e,f=b.target;if("a"==f.tagName.toLowerCase()){if(c=a(f).attr("data-action"),"demo"==c)return o.show(a(f).attr("data-index")-1),!1;if(c=a(f).attr("data-id")){for(e=0;e<k.project.length;e++)if(d=k.project[e],d.data.all[c]){d.select(c);break}return!1}}}),b.init(r)}),u.is(":visible")&&f("hide")}}},x=m.outerHeight();d(),p.on("scroll resize",d),o.getHtml=function(){if(!demoAction||!demoAction.item)return"";var a,b="",c=demoAction.item.length;if(b=['<div class="demo_wrap">','<div class="demo_head">','<a href="" data-action="back" class="nj_btn">返回</a>','<a href="" data-action="source" class="nj_btn n_b_sb">获取示例源码</a>',"</div>",demoAction.html||""].join(""),c){for(b+='<ul class="nj_s_menu clearfix">',a=0;c>a;a++)b+='<li class="nj_s_m">demo'+(a+1)+"</li>";for(b+="</ul>",b+='<div class="nj_s_con">',a=0;c>a;a++)b+='<div class="nj_s_c">'+(demoAction.item[a].content||"")+"</div>";b+="</div>"}return b+="</div>"},o.show=function(a){a=parseInt(a||0);var b=n.find("a[data-action=demo]");o.index=a,!o.isOpen&&b.click(),o.tab.change(a)},o.hide=function(){var a=n.find("a[data-action=demo]");o.isOpen&&a.click()},n.click(function(d){var e,f,g=d.target;if("a"==g.tagName.toLowerCase()){if(e=a(g),f=e.attr("data-action"),r.is(":animated"))return!1;switch(f){case"demo":o.isOpen=o.isOpen?!1:!0,o.container.animate({opacity:o.isOpen?1:0,left:o.isOpen?0:"100%"},o.openFirst?0:500,"easeOutExpo",function(){o.isOpen&&(window.demoAction&&demoAction.onShow&&demoAction.onShow(),demoAction.onChange&&demoAction.onChange(o.index))}),r.animate({opacity:o.isOpen?0:1,"margin-left":o.isOpen?"-200px":"0"},o.openFirst?0:500,"easeOutExpo"),o.isOpen&&!o.init&&(o.init=!0,o.tab=new b.Switch(o.container,{firstIndex:o.index,mode:"click",onChange:function(a){var b,d=this.con.eq(a);o.index=a,b=demoAction.item[a].callback,b&&(b.onShow&&b.onShow(),b.onChange&&b.onChange(a)),d.data("init")||(d.data("init",!0),b&&(b(b),b.index=a)),demoAction.onChange&&demoAction.onChange(a),c("demo",o.index)},onHide:function(a){var b=demoAction.item[a].callback;b&&b.onHide&&b.onHide(a)}}),window.demoAction.callback&&window.demoAction.callback()),!o.isOpen&&window.demoAction&&demoAction.onHide&&demoAction.onHide(),c("demo",o.isOpen?o.index:null),o.openFirst&&delete o.openFirst}return!1}}),o.container.click(function(b){var c,d,e=b.target;if("a"==e.tagName.toLowerCase()){if(c=a(e),d=c.attr("data-action"),"back"==d)return o.hide(),!1;if("source"==d)return o.source.show(c),!1}}),o.source=function(){function a(){d=new b.popup({width:"85%"}),d.element.css("max-width","900px"),e.data("win",d)}function c(a){if(a="function"==typeof a?a.toString().replace(/^function\s*\([^\(\)]*\)\s*{/,"").replace(/\s*}$/,"\n").replace(/\t/g,"    ").replace(/[\s\r\n]*(\/\/)(\*\*)(hide)[\s\S]*\1\3\2[\s\r\n]*/g,"\n"):"",a.length>4){var b=a.length-a.replace(/(^\s*)/,"").length;b=4*Math.floor(b/4),a=a.replace(new RegExp("(\\n\\s{"+b+"})","g"),"\n")}return a}var d,e;return{show:function(b){d=b.data("win"),e=b,!d&&a();var f,h=demoAction.item[o.index],j=['<div style="height:500px;overflow:auto"><script type="text/templete" code="html">',"<!DOCTYPE html>","<html>","<head>",'<meta charset="utf-8" />',"<title>"+g.selected+"示例"+(o.index+1)+"- nojs</title>",'<base href="http://nolure.github.io/nojs.docs/" />','<link rel="stylesheet" href="css/ui.css" />','<link rel="stylesheet" href="css/base.css" />','<link rel="stylesheet" href="css/main.css" />','<script src="src/nojs/noJS.js" data-config="global:[\'nojs/jquery\',\'nojs/ui\']" id="nojs"></ script>',"</head>","<body>",demoAction.html?demoAction.html.replace(/^\n*/,""):"",h.content?h.content.replace(/^\n*/,""):"","<script>"+c(h.callback||demoAction.callback)+"</ script>","</body>","</html>","</script></div>"];d.set("title",g.selected+" - 示例"+(o.index+1)+"源码"),d.set("content",j.join("\n")),f=new i({parent:d.content}),d.show()}}}(),k.project=[],s.empty(),h.key={name:"text",children:"data"};for(var y in j)"mobile"==window.Page&&"mobile"!=y||"mobile"!=window.Page&&"mobile"==y||e(y,j[y]);u.click(function(){return f(),!1}),f.display="hide";var z=a('<div class="f_link"></div>').appendTo(s);return"mobile"==window.Page?(z.append('<a href="index.html">nojs</a>'),l.swipeRight(function(){f("show")}).swipeLeft(function(){f("hide")})):z.append('<a href="m.html">nojs mobile</a>'),z.append('<a href="http://nolure.com">blog: http://nolure.com</a>'),k}),define([],function(require,a){function b(c,d){if(+new Date,this.box="string"==typeof c?a("#"+c):c,this.options=d=d||{},this._data=d.data,this.ajaxMode="string"==typeof this._data,this.data=this.ajaxMode?null:b.format(this._data),this.box.length&&(this.ajaxMode||this.data.level.length))if(this.max=d.max||b.max,this.ajaxMode){var e=this;b.ajax({url:this._data,tree:this,success:function(){e.init(null,!0,!0)}})}else this.init(null,!0,!0)}return b.key={},b.max=100,b.rootID=-1,b.ajax=function(c){c=c||{};var d=c.data;a.getJSON(c.url,d,function(a){if(1==a.status){var e=c.tree,f=a.data;if(f&&d&&d.id){var g,h=b.key.parent;for(g=0;g<f.length;g++)f[g][h]=d.id}e&&f&&(e.data=b.format(f,e.data)),c.success&&c.success(f)}})},b.format=function(c,d){function e(a,c,d){var l,m,n,o,p,q=a.length,r=0;for(j++,l=0;q>l;l++)if(n=a[l],o=n[g.id],r++,void 0!=o&&!k[o]){if(k[o]=n,p=n[g.parent],void 0==p){k[o]={level:c};for(m in n)k[o][m]=m==f?[]:n[m];k[o][f]=k[o][f]||[],c>0?(k[o][g.parent]=d,k[d][f].push(o)):k[o][g.parent]=b.rootID,n[f]&&n[f].length&&e(n[f],c+1,o)}else if(p==b.rootID)n.level=c=0,n[f]=[];else{if(n[f]=[],!k[p]){delete k[o],r--;continue}k[p][f]=k[p][f]||[],k[p][f].push(o),n.level=c=k[p].level+1}i[c]=i[c]||[],i[c].push(k[o])}2==h&&q>r&&3>j&&e(a)}var f,g,h=a.type(c),i=d&&d.level?d.level:[],j=0,k=d&&d.all?d.all:{};return"array"==h&&c.length&&"object"==a.type(c[0])?(b.key=g=a.extend({id:"id",name:"name",parent:"parent",children:"children",open:"open",link:"link"},b.key),f=g.children,h=void 0==c[0][g.parent]?1:2,e(c,0),{all:k,level:i}):{all:k,level:i}},b.parents=function(a,c,d){var e,f=b.key.parent,g=b.key.id,h=[];if(c=c||{},a=c[a],!a)return h;for(e=a[f];(e=c[e])&&(!d||!d(e));e=e[f])h.push(e[g]);return h},b.prototype={init:function(c,d,e){var f,g,h,i,j,k,l,m,n=this,o=b.key.link,p=b.key.id,q=b.key.open,r=b.key.name,s=(b.key.parent,b.key.children),t=void 0!=c&&c!=b.rootID,u=this.data.all,v=t?u[c].level+1:0,w=t?u[c][s]:this.data.level[v],x=this.options.isCheck,y="";if(w.length){if(w["break"]=w["break"]||0,j="",v)for(g=0;v>g;g++)j+='<i class="line"></i>';for(f=w["break"];f<w.length;f++){if(f>=n.max+w["break"]){w["break"]+=n.max,y+='<li class="no_child more"><a href="" id="more_'+(t?c:b.rootID)+"_"+v+'" class="item" pid="'+(t?c:b.rootID)+'" data-action="more">'+j+'<i class="ico last_ico"></i><i class="folder"></i>more</a></li>';break}h=w[f],h=t?u[h]:h,k=h[p],h.init=1,y+='<li level="'+v+'">',i=h[o]?h[o]:"",l="undefined"!=typeof h[q]?'open="'+h[q]+'"':"",m=x?'<input type="checkbox" value="'+k+'" />':"",y+='<a class="item" href="'+i+'" reallink="'+i+'" id="'+k+'" '+l+">"+j+'<i class="ico"></i>'+m+'<i class="folder"></i><span class="text">'+h[r]+"</span></a>",h[s].length?(1==h[q]||n.options.openAll?(h.init=2,y+='<ul data-init="true">',y+=this.init(k,!1)):y+="<ul>",y+="</ul>"):this.ajaxMode&&(y+="<ul></ul>"),y+="</li>"}if(d){var z,A=this.box;t?(A=a(y),z=this.box.find("#"+c),z.next("ul").data("init",!0).append(A),this.addClass(z.parent())):(this.rootWrap||(this.rootWrap=a("<ul></ul>"),A.html(this.rootWrap),this.bind()),this.rootWrap.append(y),this.addClass(A,!0)),this.replaceLink(A),function(a){var b=a.find("a.item").not(".no_child");n.options.openAll&&(a.find("ul ul").show(),b.addClass("open")),b.filter(function(){return"0"==this.getAttribute("open")}).removeClass("open").next("ul").hide(),b.filter(function(){return"1"==this.getAttribute("open")}).addClass("open").next("ul").show()}(A),!this.selected&&e&&this.select(this.options.defaultNode)}return y}},bind:function(){var c,d,e,f,g=this;this.box.off("click.tree").on("click.tree",function(h){if(f=h.target,c=a(f),d=c.parent(),"more"==c.attr("data-action")||"more"==d.attr("data-action"))c="more"==d.attr("data-action")?d:c,g.init(c.attr("pid"),!0),c.parent().remove();else if(c.hasClass("ico")&&!c.parent().hasClass("no_child"))if(c=c.parent(".item"),e=c.next("ul"),c.hasClass("open"))e&&e.is(":visible")&&e.hide(),c.removeClass("open");else{if(!e.data("init")){var i=c[0].id;g.ajaxMode?b.ajax({url:g._data,data:{id:i},tree:g,success:function(a){a&&a.length?g.init(i,!0):(c.addClass("no_child").next("ul").remove(),c.find(".last_ico1").length&&c.find(".last_ico1").addClass("last_ico").removeClass("last_ico1")),e.data("init",!0)}}):(g.init(i,!0),e.data("init",!0))}e&&e.is(":hidden")&&e.show(),c.addClass("open")}else if(c.hasClass("folder")||c.hasClass("item")||c.hasClass("text")||c.hasClass("line")||c.hasClass("ico")){if(c.hasClass("item")||(c=c.parent()),g.selected==c[0].id)return!1;g.box.find("a.current").removeClass("current"),c.addClass("current"),g.options.onSelect&&g.options.onSelect.call(g,g.data.all[c[0].id]),g.selected=c[0].id}else if("input"==f.tagName.toLowerCase()){var j,k,l,m=c.closest("a.item").next("ul").find("input"),n=c.parents("ul");if(f.checked){m.attr("checked","checked");for(var j=0;j<n.length;j++)k=n.eq(j),k.find("input").not(":checked").length||k.prev("a.item").find("input").attr("checked","checked")}else m.attr("checked",!1),n.prev("a.item").find("input").attr("checked",!1);return l=g.box.find(":checked"),g.checked=l.length?function(){var a=[];return l.each(function(){a.push(this.value)}),a}():null,g.options.onCheck&&g.options.onCheck.call(g,f.id),!0}return!1})},addClass:function(a,b){a=a||this.box;var c,d,e,f,g,h,i,j,k=a.find("a.item"),l=k.length;for(b&&k.eq(0).find(".ico").addClass("first_ico"),c=0;l>c;c++)if(g=k.eq(c),i=g.closest("li"),g.next("ul").length)for(!i.next().length&&g.find(".ico").addClass("last_ico1"),j=i.attr("level"),d=0;d<i.find("li").length;d++)for(h=i.find("li").eq(d).find(".line"),!i.next().length&&h.eq(j).addClass("last_line"),e=g.find(".last_line"),f=0;f<e.length;f++)h.eq(e.eq(f).index()).addClass("last_line");else!this.ajaxMode&&g.addClass("no_child"),i.next().length||g.find(".ico").addClass("last_ico")},select:function(c,d){function e(){return j.addClass("current"),i.options.onSelect&&i.options.onSelect.call(i,i.data.all[c]),i.selected=c,!1}function f(a){0>a||(n=o.eq(a),n.show().siblings("a.item").addClass("open"),f(--a))}if(c){d=d||"id";var g,h,i=this,j=this.box.find("a["+d+'="'+c+'"]').eq(0),k=this.data.all,l=b.key.parent,m=[];if(k[c]){if(!j||!j.length){if(m=b.parents(c,this.data.all,function(a){return 2==a.init}),m.length){for(g=m.length-1;g>=0;g--){for(h=k[m[g]];!h.init;)a("#more_"+h[l]+"_"+h.level).click();a("#"+m[g]).find("i.ico").click()}m=a("#"+m[0]).next()}else m=a("#"+k[c][l]).next();if(j=m.find("a["+d+'="'+c+'"]').eq(0),!j.length){for(;!k[c].init;)a("#more_"+k[c][l]+"_"+k[c].level).click();j=m.find("a["+d+'="'+c+'"]').eq(0)}}if(this.box.find("a.current").removeClass("current"),j.parents("ul").first().is(":visible"))return e();var n,o=j.parents("ul").not(":visible"),p=o.length;f(p-1),e()}}},replaceLink:function(b){if(a.browser("ie6 ie7")){b=b||this.box;var c=b.find("a");c.each(function(){this.href=this.getAttribute("reallink",2),this.removeAttribute("reallink")})}}},b.select=function(c,d){function e(a){var c,d,e="";d=u[a],e='<select name="">',e+=s?'<option value="'+b.rootID+'">根目录</option>':o;for(c in d)v!=d[c][x]&&(e+=h(d[c],a));return e+="</select>"}function f(a){var b,c="";if(w++,a.length)for(b in a)c+=h(q.all[a[b]],w);return w--,c}function g(a){var b="--";for(i=0;a>i;i++)b+="--";return b}function h(a,b){return'<option value="'+(void 0!=a[x]?a[x]:"")+'">'+(s?g(b):"")+a[y]+"</option>"+(s?f(a[z]):"")}function j(){p=e(w),p=a(p),void 0!=r[0]&&(p[0].value=r[0],r[0]=null),c.html(p)}function k(a,c){b.ajax({url:d.data,data:a,success:function(a){a&&a.length&&(q=b.format(a,q),u=q.level,c?c():(j(),!s&&n(p)))}})}function l(b,c){var d=q.all[c],e=d[z];e.length&&(b=a(b),d.init=!0,w=d.level,e=a('<select name="">'+o+f(e)+"</select>"),void 0!=r[w+1]&&(e[0].value=r[w+1],r[w+1]=null),b.after(e),n(e))}function m(b){var c=b.value;a(b).nextAll("select").remove(),c!=v&&q.all[c]&&(t&&!q.all[c].init?k({id:c},function(){l(b,c)}):l(b,c))}function n(a){a.change(function(){m(this)}),a.val()&&m(a[0])}d=d||{};var o,p,q="string"==typeof d.data?{}:b.format(d.data),r=[].concat(d.select),s=0==d.level,t="string"==typeof d.data,u=t?[]:q.level,v=void 0!=d.empty?d.empty:"",w=0,x=b.key.id,y=b.key.name,z=b.key.children;if(c&&c.length&&u)return o='<option value="'+v+'">请选择</option>',t?k():j(),s||p&&n(p),p},b}),define([],function(require,$){var codeLight=function(a){this.opt=a=a||{},this.parent=a.parent||"body",this.box=null,this.code=[],this.init()};return codeLight.prototype={init:function(){function delLine(a){item=a.find(".rs_item li"),first=item.first(),last=item.last(),""==first.html().replace(/\s/g,"")&&first.remove(),""==last.html().replace(/\s/g,"")&&last.remove(),item=a.find(".rs_item li"),""==item.first().html().replace(/\s/g,"")&&delLine(a)}function delTab(a){if(first=a.first(),s.test(first.html())){var b,c,d=a.length;for(c=0;d>c;c++)b=a.eq(c),b.html(b.html().replace(s,""));s.test(first.html())&&delTab(a)}}function setKey(key,code){if(!key||!key.length)return code;for(var j=0;j<key.length;j++)code=code.replace(eval("/("+key[j]+")/g"),'<b class="key">$1</b>');return code}var m,code,box,type,C=this.parent.find("script[code]"),s=/\s{4}/,item,first,last,key;if(C.length)for(var i=0;i<C.length;i++)m=C.eq(i),type=m.attr("code"),key=m.attr("key"),key&&(key=key.split(",")),code=m.html()||m.val(),""!=code.replace(/\s/g,"")&&(code=this.str(code,type),code=setKey(key,code),m.css({display:"none"}).after('<pre title="双击编辑" expand="'+(0==m.attr("expand")?0:1)+'" class="codelight_box"><ol class="rs_item" tabindex="-1">'+code+'</ol><p class="open">+code</p></pre>'),box=m.next("pre"),box.find(".rs_item").on("dblclick",function(){return box.hasClass("code_hide")?!1:($(this).attr({contentEditable:!0}).addClass("edit"),void 0)}).on("blur",function(){$(this).removeAttr("contentEditable").removeClass("edit")}),box.find(".note .key").removeClass("key"),this.code.push(box),delLine(box),item=box.find(".rs_item li"),delTab(item),this.setOpt(box),m.remove())},str:function(a,b){var c={L:/</g,G:/>/g,L1:/(&lt;[\/]?)/g,G1:/&gt;/g,E:/\n/g,tab:/\t/g,htmlProperty:/(class|style|id|title|alt|src|align|href|rel|rev|name|target|content|http-equiv|onclick|onchange|onfocus|onmouseover|onmouseout|type|for|action|value)=/g,htmlTag:/(&lt;[\/]?)(html|body|title|head|meta|link|script|base|style|object|iframe|h1|h2|h3|h4|h5|h6|p|blockquote|pre|address|img|a|ol|div|ul|li|dl|dd|dt|ins|del|cite|q|fieldset|form|label|legend|input|button|select|textarea|table|caption|tbody|tfoot|thead|tr|td|th|span|strong|em|i|b|option)(\s|&gt;)/g,htmlNote:/(&lt;\!--([\s\S]*?)--&gt;)/gm,jsKey:/(var|new|function|return|this|if|else|do|while|for|true|false)([\s\({;.]+)/g,jsNote:/(\/\/.*)[\r\n]/g,jsNoteP:/(\/\*([\s\S]*?)\*\/)/gm,S:/&/g};return a=a.replace(/<\/\sscript>/g,"</script>"),a=a.replace(c.S,"&amp;"),a=a.replace(c.L,"&lt;").replace(c.G,"&gt;"),"html"==b?(a=a.replace(c.htmlProperty,'<i class="property">$1</i>='),a=a.replace(c.htmlTag,'$1<i class="tag">$2</i>$3'),a=a.replace(c.htmlNote,'<i class="note">$1</i>'),a=a.replace(c.L1,'<i class="lt">$1</i>').replace(c.G1,'<i class="lt">&gt;</i>')):"javascript"==b&&(a=a.replace(/('[^'\\]*(?:\\[\s\S][^'\\]*)*'|"[^"\\]*(?:\\[\s\S][^"\\]*)*")/g,'<i class="note">$1</i>'),a=a.replace(c.jsKey,'<i class="jskey">$1</i>$2'),a=a.replace(c.jsNote,'<i class="note">$1</i></li><li>').replace(c.jsNoteP,'<i class="note">$1</i>')),a=a.replace(c.tab,"    "),a="<li>"+a.replace(c.E,"</li><li>"),a+="</li>"},setOpt:function(a){var b,c='<div class="set_opt">';c+='<a href="" class="hide">折叠</a>',c+="</div>",a.append(c),c=a.find(".set_opt"),b=c.find(".hide"),a.mouseover(function(){c.show()}).mouseout(function(){c.hide()}).click(function(a){var c=$(a.target);c.hasClass("open")&&b.click()}),b.click(function(){var b=$(this);return a.hasClass("code_hide")?(a.removeClass("code_hide").find(".open").hide(),b.html("折叠")):(a.addClass("code_hide").find(".open").show(),b.html("展开")),!1}),(this.opt.autoHide||0==a.attr("expand"))&&b.click()},select:function(a){var b,c=this.code[a||0].find(".rs_item");c.dblclick().focus().select(),window.getSelection?b=window.getSelection():document.selection&&document.selection.createRange&&(b=document.selection.createRange())}},codeLight}),define([],{nojs:{data:[{id:"nojs_info",text:"nojs简介",link:"index"},{id:"noJS",text:"noJS模块管理",open:1,data:[{id:"noJS_info",text:"使用介绍",link:"noJS/index"},{id:"noJS_config",text:"参数配置",link:"noJS/config"},{id:"noJS_module",text:"模块",link:"noJS/module"},{id:"noJS_api",text:"接口",link:"noJS/api"},{id:"noJS_pack",text:"打包上线",link:"noJS/pack"}]},{id:"nj_ui",text:"ui组件",open:1,data:[{id:"ui_info",text:"说明",link:"ui/index"},{id:"tools",text:"jQuery扩展工具",link:"ui/tools"},{id:"ui_core",text:"核心ui组件",open:1,data:[{id:"ui_align",text:"ui.align",link:"ui/align"},{id:"ui_overlay",text:"ui.overlay",link:"ui/overlay"},{id:"ui_layer",text:"ui.layer",link:"ui/layer"},{id:"ui_popup",text:"ui.popup",link:"ui/popup"},{id:"ui_msg",text:"ui.msg",link:"ui/msg"},{id:"ui_select",text:"ui.select",link:"ui/select"},{id:"ui_switch",text:"ui.Switch",link:"ui/switch"},{id:"ui_slide",text:"ui.slide",link:"ui/slide"},{id:"ui_ico",text:"ui.ico",link:"ui/ico"}]}]},{id:"other",text:"常用模块",open:1,data:[{id:"m_scroll",text:"scroll滚动",link:"module/scroll"},{id:"m_code",text:"code代码美化",link:"module/code"},{id:"drag",text:"drag",link:"module/drag"},{id:"form",text:"form表单验证",link:"module/form"},{id:"upload",text:"upload文件上传",link:"module/upload"},{id:"tree",text:"tree树形菜单",link:"module/tree"},{id:"color",text:"color取色器",link:"module/color"},{id:"face",text:"face表情选择",link:"module/face"},{id:"rate",text:"rate星级打分",link:"module/rate"},{id:"autocomplete",text:"autocomplete自动完成",link:"module/autocomplete"},{id:"email",text:"email邮箱自动补全",link:"module/email"},{id:"lazyload",text:"lazyload延迟加载",link:"module/lazyload"},{id:"lightbox",text:"lightbox",link:"module/lightbox"},{id:"page",text:"page",link:"module/page"},{id:"resize",text:"resize",link:"module/resize"}]},{id:"test_page",text:"小测试",open:0,data:[{id:"impact",text:"html5碰撞小游戏",link:"test/impact"},{id:"imghot",text:"在线绘制图片热点",link:"test/imghot"}]}]},mobile:{data:[{id:"mb",text:"nojs.mobile",data:[{id:"mb_intro",text:"说明",link:"intro"},{id:"mb_ui",text:"ui",data:[{id:"mb_switch",text:"Switch选项卡",link:"switch"},{id:"mb_slide",text:"slide幻灯片",link:"slide"}]}]}]}});