/*
 * 分页组件
 * nolure@vip.qq.com
 * 2013-10-15
 */
define(function(require, $){
    /*
     * element传入2个属性总条数data-count 当前分类data-id
     * count 总条数
     * page 每页条数
     * pages 总页数
     * current 当前页
     * length 最大显示的页码长度
     * url 链接url 'page-{page}.html'
     */
	function page(element, options){
	    this.element = typeof element=='string' ? $('#'+element) : $(element);
	    if( !this.element || !this.element.length ){
	        return;
	    }
	    this.options = options = options || {};
	    this.count = this.element.data('count') || 0;
	    if( !this.count ){
	        return;
	    }
	    this.page = parseInt(options.page) || 10;
	    this.pages = Math.ceil(this.count/this.page);
	    this.current = this.parse(options.current || 1);
	    this.length = this.parse(options.length==undefined ? 9 : options.length);
	    this.init();
	    typeof options.callback=='function' && this.bind();
	}
	page.prototype = {
	    parse : function(n){
	        return n > this.pages ? this.pages : n;
	    },
	    init : function(){
	        var html, i, url, current, disabled, first, prev, next, last,
	            item = '',   
	            half = this.length%2 ? Math.floor(this.length/2) : this.length/2 - 1,
	            start = this.current > half ? this.current - half : 1,
	            end = start + this.length - 1;
	        
	        //end = end>this.pages ? this.pages : end;
	        if( end > this.pages ){
	            start = end - this.length + 1;
	            end = this.pages;
	            if( end - start + 1 < this.length ){
	                start = end - this.length + 1;
	            }
	        }
	        
	        for( i=start; i<=end; i++ ){
	            current = i==this.current ? 'class="current"' : '';
	            url = this.options.url==undefined ? '?page='+i : this.options.url.replace(/{page}/,i);
	            item += '<a href="'+url+'" '+current+' class="item">'+i+'</a>';
	        }
	        
	        disabled = 'class="first'+ (this.current==1 ? ' disabled' : '') +'"';
	        first = '<a href="" data-page="1" '+disabled+'>首页</a>';
	        
	        disabled = 'class="prev'+ (this.current<=1 ? ' disabled' : '') +'"';
	        prev = '<a href="" data-page="'+(this.current>1?this.current-1:1)+'" '+disabled+'>上一页</a>';
	        
	        disabled = 'class="next'+ (this.current>=this.pages ? ' disabled' : '') +'"';
	        next = '<a href="" data-page="'+(this.current<this.pages?this.current+1:this.pages)+'" '+disabled+'>下一页</a>';
	        
	        disabled = 'class="last'+ (this.current==this.pages ? ' disabled' : '') +'"';
	        last = '<a href="" data-page="'+this.pages+'" '+disabled+'>尾页</a>';
	        
	        html = [
	           first, prev, item, next, last,
	           '<span class="page">' + this.current + '/' + this.pages + '页</span>',
	           '<span class="count">共' + this.count + '条记录</span>'
	        ].join('');
	        
	        this.element.html(html);
	    },
	    bind : function(){
	        var self = this,
	            page, m;
	            
	        this.element.click(function(e){
	            if( e.target.tagName.toLowerCase()=='a' ){
	                m = $(e.target)
	                page = parseInt(m.text());
	                if( m.data('page') ){
	                    page = m.data('page');
	                }
	                if( self.current != page ){
	                    self.current = page;
	                    self.init();
	                    self.options.callback.call(self);
	                }
	                return false;
	            }
	        })
	    }
	}
	return page;
});
