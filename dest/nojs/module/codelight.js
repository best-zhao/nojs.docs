/*nolure@vip.qq.com|http://nolure.github.io/nojs.docs*/define("nojs/module/codelight",[],function(require,$){var codeLight=function(a){this.opt=a=a||{},this.parent=a.parent||"body",this.Box=null,this.code=null,this.init()};return codeLight.prototype={init:function(){function delLine(a){item=a.find(".rs_item li"),first=item.first(),last=item.last(),""==first.html().replace(/\s/g,"")&&first.remove(),""==last.html().replace(/\s/g,"")&&last.remove(),item=a.find(".rs_item li"),""==item.first().html().replace(/\s/g,"")&&delLine(a)}function delTab(a){if(first=a.first(),s.test(first.html())){var b,c,d=a.length;for(c=0;d>c;c++)b=a.eq(c),b.html(b.html().replace(s,""));s.test(first.html())&&delTab(a)}}function setKey(key,code){if(!key||!key.length)return code;for(var j=0;j<key.length;j++)code=code.replace(eval("/("+key[j]+")/g"),'<b class="key">$1</b>');return code}var m,code,box,type,C=this.parent.find("script[code]"),s=/\s{4}/,item,first,last,key;if(C.length)for(var i=0;i<C.length;i++)m=C.eq(i),type=m.attr("code"),key=m.attr("key"),key&&(key=key.split(",")),code=m.html()||m.val(),""!=code.replace(/\s/g,"")&&(code=this.str(code,type),code=setKey(key,code),m.css({display:"none"}).after('<pre title="双击编辑" class="codelight_box"><ol class="rs_item" tabindex="-1">'+code+'</ol><p class="open">+code</p></pre>'),box=m.next(".codelight_box"),box.find(".rs_item").on("dblclick",function(){return box.hasClass("code_hide")?!1:($(this).attr({contentEditable:!0}).addClass("edit"),void 0)}).on("blur",function(){$(this).removeAttr("contentEditable").removeClass("edit")}),box.find(".note .key").removeClass("key"),delLine(box),item=box.find(".rs_item li"),delTab(item),this.setOpt(box),m.remove())},str:function(a,b){var c={L:/</g,G:/>/g,L1:/(&lt;[\/]?)/g,G1:/&gt;/g,E:/\n/g,tab:/\t/g,htmlProperty:/(class|style|id|title|alt|src|align|href|rel|rev|name|target|content|http-equiv|onclick|onchange|onfocus|onmouseover|onmouseout|type|for|action|value)=/g,htmlTag:/(&lt;[\/]?)(html|body|title|head|meta|link|script|base|style|object|iframe|h1|h2|h3|h4|h5|h6|p|blockquote|pre|address|img|a|ol|div|ul|li|dl|dd|dt|ins|del|cite|q|fieldset|form|label|legend|input|button|select|textarea|table|caption|tbody|tfoot|thead|tr|td|th|span|strong|em|i|b|option)(\s|&gt;)/g,htmlNote:/(&lt;\!--([\s\S]*?)--&gt;)/gm,jsKey:/(var|new|function|return|this|if|else|do|while|for|true|false)([\s\({;.]+)/g,jsNote:/(\/\/.*)[\r\n]/g,jsNoteP:/(\/\*([\s\S]*?)\*\/)/gm,S:/&/g};return a=a.replace(c.S,"&amp;"),a=a.replace(c.L,"&lt;").replace(c.G,"&gt;"),"html"==b?(a=a.replace(c.htmlProperty,'<i class="property">$1</i>='),a=a.replace(c.htmlTag,'$1<i class="tag">$2</i>$3'),a=a.replace(c.htmlNote,'<i class="note">$1</i>'),a=a.replace(c.L1,'<i class="lt">$1</i>').replace(c.G1,'<i class="lt">&gt;</i>')):"javascript"==b&&(a=a.replace(/('[^'\\]*(?:\\[\s\S][^'\\]*)*'|"[^"\\]*(?:\\[\s\S][^"\\]*)*")/g,'<i class="note">$1</i>'),a=a.replace(c.jsKey,'<i class="jskey">$1</i>$2'),a=a.replace(c.jsNote,'<i class="note">$1</i></li><li>').replace(c.jsNoteP,'<i class="note">$1</i>')),a=a.replace(c.tab,"    "),a="<li>"+a.replace(c.E,"</li><li>"),a+="</li>"},setOpt:function(a){var b,c='<div class="set_opt">';c+='<a href="" class="hide">折叠</a>',c+="</div>",a.append(c),c=a.find(".set_opt"),b=c.find(".hide"),a.mouseover(function(){c.show()}).mouseout(function(){c.hide()}).click(function(a){var c=$(a.target);c.hasClass("open")&&b.click()}),b.click(function(){var b=$(this);return a.hasClass("code_hide")?(a.removeClass("code_hide").find(".open").hide(),b.html("折叠")):(a.addClass("code_hide").find(".open").show(),b.html("展开")),!1}),this.opt.autoHide&&a.find(".rs_item").height()>400&&b.click()}},codeLight});