/*2013/11/14-http://nolure.github.io/nojs.docs*/define("nojs/module/score",[],function(require,a){function b(b,c){this.options=c=c||{},this.element="string"==typeof b?a("#"+b):b,this.level=c.level||5,this.index=c.index||0,this.title=c.title instanceof Array&&c.title.length>=this.level?c.title:null,this.field=this.element.find("input:hidden"),this.item=null,this.init()}return b.prototype={init:function(){var b,c,d=this,e="";for(b=0;b<this.level;b++)e+='<i title="'+(this.title?this.title[b]:b+1+"分")+'"></i>';this.element.prepend(e),this.item=this.element.children("i"),c=this.item.width(),this.element.width(this.level*c),this.item.each(function(b){a(this).css({width:c*(b+1),"z-index":d.level-b})}),this.bind()},bind:function(){var b=this;this.item.hover(function(){var c=a(this),d=b.element.find("i.current"),e=c.index();c.addClass("hover").siblings().removeClass("hover"),e>d.index()&&d.addClass("hover"),b.options.onMove&&b.options.onMove.call(b,!0,e+1)},function(){b.item.removeClass("hover"),b.options.onMove&&b.options.onMove.call(b,!1,a(this).index+1)}),this.element.click(function(c){var d=c.target;"i"==d.tagName.toLowerCase()&&(b.item.removeClass("current hover"),a(d).addClass("current"),b.index=a(d).index()+1,b.field.val(b.index),b.options.onSelect&&b.options.onSelect.call(this,b.index))}),this.index&&this.item.eq(this.index-1).click()},reset:function(){this.field.val(""),this.item.removeClass("current"),this.index=0,this.options.onMove&&this.options.onMove.call(this)}},b});