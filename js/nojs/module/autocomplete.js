/*2013/11/14-http://nolure.github.io/nojs.docs*/define("nojs/module/autocomplete",[],function(require,a){var b=function(b,c){b&&b.length&&(this.text=b,c=c||{},this.autoComplete=a('<dl class="auto_complete"><dt></dt></dl>').appendTo("body"),c.className&&this.autoComplete.addClass(c.className),this.onKeyup=c.onKeyup,this.onChoose=c.onChoose,this.onSelect=c.onSelect,this.max=c.max||20,this.rule=c.rule,this.noResult=c.noResult,this.state=!1,this.searchOnSelect=0==c.searchOnSelect?!1:!0,this.rewriteOnMove=0==c.rewriteOnMove?!1:!0,this.async=c.async,this.rule&&this.bind())};return b.prototype={bind:function(){var b,c,d=this;this.text.keydown(function(a){switch(c=a.keyCode){case 13:return d.move("enter"),!1;case 38:return d.move("up"),!1;case 40:d.move("down")}}).keyup(function(a){switch(c=a.keyCode){case 13:break;case 38:break;case 40:break;default:clearTimeout(b),b=setTimeout(function(){d.complete(),d.onKeyup&&d.onKeyup(d.state)},99)}}).click(function(a){a.stopPropagation()}),a(document).click(function(){d.showBox("hide")}),this.autoComplete.click(function(b){var c=b.target,e=c.tagName.toLowerCase(),f=a(c);("dd"==e||"span"==e||"i"==e)&&("dd"!=e&&(f=f.parent()),f.addClass("current").siblings().removeClass("current"),d.move("enter")),b.stopPropagation()})},showBox:function(a,b){a="show"==a?"show":"hide",b=b||this.autoComplete,"show"==a&&b.is(":hidden")?b.css({left:this.text.offset().left,top:this.text.offset().top+this.text.outerHeight(),display:"block",width:this.text.innerWidth()}):"hide"==a&&b.is(":visible")&&b.hide()},complete:function(a){function b(a){a&&""!=a?(c.showBox("show"),e.siblings().remove().end().after(a),c.state=!0):(e.siblings().remove(),c.showBox("hide"),c.text.data("id",null),c.text.data("text",null),c.state=!1)}var c=this,d="undefined"==typeof a?this.text.val():a,e=this.autoComplete.find("dt");1==this.async?this.rule.call(this,d,function(a){b(a)}):b(this.rule.call(this,d))},move:function(b,c){var d,e,f,g=this.autoComplete.find("dd"),h=g.filter(".current");"up"==b?h.length?(d=h.prev("dd"),d.length||(d=g.last()),d.addClass("current").siblings("dd").removeClass("current")):g.last().addClass("current"):"down"==b?h.length?(e=h.next("dd"),e.length||(e=g.first()),e.addClass("current").siblings("dd").removeClass("current")):g.first().addClass("current"):"enter"==b&&this.showBox("hide"),c&&a("#"+c).addClass("current").siblings("dd").removeClass("current"),f=g.filter(".current"),f.length?this.text.data("text",f.text()):this.text.data("text",null),("enter"==b||this.rewriteOnMove)&&this.text.val(f.text()),"enter"==b&&(this.onChoose&&this.onChoose(),this.searchOnSelect&&this.search())},search:function(){this.text.val()!=this.text.data("text")&&(this.complete(),this.showBox("hide"));var a=this.text.data("text");this.text.val(),a&&this.onSelect&&this.onSelect(a,this.autoComplete.find(".current"))}},b});