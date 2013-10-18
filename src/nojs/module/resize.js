/*
 * resize
 * nolure@vip.qq.com
 * 2013-10-17
 */
define(function(require,$){
    /*
     * @element：确保element是闭合的且设置了定位属性的标签
     */
	function resize(element, options){
	    this.element = typeof element == 'string' ? $('#'+element) : element;
	    if( !this.element || !this.element.length ){
	        return;
	    }
	    this.options = options = options || {};
	    this.position = this.element.css('position');
	    this.points = options.points || ['tl','t','tr','r','br','b','bl','l'];
	    if( this.position=='static' ){
	        this.element.css('position', 'relative');
	    }
	    this.resizeStart = options.resizeStart;
	    this.resize = options.resize;
	    this.resizeEnd = options.resizeEnd;
	    this.init();
	}
	resize.prototype = {
	    init : function(){
	        var self = this, points = '', html;
	        $.each(this.points, function(i, p){
	            points += '<div class="nj_resize_handler nj_resize_handler_'+p+'" data-direction="'+p+'"></div>';
	        })
	        this.element.append(points);
	        this.bind();
	    },
	    bind : function(){
	        var self = this,
	            doc = $(document),
	            last, now, direction, size;
	            
	        this.element.find('div.nj_resize_handler').mousedown(function(e){
	            direction = this.getAttribute('data-direction');
                last = {
                    x : e.clientX,
                    y : e.clientY
                }
                size = {
                    width : self.element.width(),
                    height : self.element.height(),
                    top : parseInt(self.element.css('top')) || 0,
                    left : parseInt(self.element.css('left')) || 0
                }
                self.resizeStart && self.resizeStart.call(self);
                e.preventDefault();
                e.stopPropagation();
                doc.on('mousemove.resize', move).on('mouseup.resize', up);
                return false;
	        })
	        function move(e){
	            now = {
                    x : e.clientX,
                    y : e.clientY
                }
                var x = now.x - last.x,
                    y = now.y - last.y,
                    css = {};
                
                if( !/^(t|b)$/.test(direction) ){
                    css.width = size.width + x;
                }
                if( !/^(l|r)$/.test(direction) ){
                    css.height = size.height + y;
                }
                if( /^(tl|t|tr)$/.test(direction) ){
                    css.top = size.top + y;
                    css.height = size.height - y;
                }
                if( /^(tl|l|bl)$/.test(direction) ){
                    css.left = size.left + x;
                    css.width = size.width - x;
                }
                self.element.css(css);
                self.resize && self.resize.call(self);
                e.preventDefault();
	        }
	        function up(){
                doc.off("mousemove.resize mouseup.resize");
                self.resizeEnd && self.resizeEnd.call(self);
            }
	    }
	}
	return resize;
});
