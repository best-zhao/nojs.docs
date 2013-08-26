/*
 * 通用打分组件
 */
define(function(require,$){
	var rate = function(box,opt){
		opt = opt || {};
		var B = box,
			rate,
			w,
			n = opt.level || 5,
			start = opt.start,
			title = opt.title instanceof Array && opt.title.length>=n ? opt.title : null,
			index = 0,
			html = '',
			hide = B.find('input:hidden'),
			data = {index:index};	
		
		for(var i=0;i<n;i++){
			html += '<i title="'+(title?title[i]:(i+1+'分'))+'"></i>';		
		}
		B.prepend(html);
		rate = B.children("i");
		w = rate.width();
		B.width(w*n);
		
		for(var i=0;i<n;i++){		
			rate.eq(i).css({
				'width':w*(i+1),
				'z-index':n-i
			});
		}
		
		rate.hover(function(){
			var S = B.children("i.current");
			$(this).addClass("hover").siblings().removeClass("hover");
			if($(this).index()>S.index()){
				S.addClass("hover");
			}
		},function(){
			rate.removeClass("hover");
		})
		B.click(function(e){
			var t = e.target;
			if(t.tagName.toLowerCase()=='i'){
				rate.removeClass("current hover");
				$(t).addClass("current");
				index = data.index = $(t).index() + 1;
				hide.val(index);
				opt.onSelect && opt.onSelect(index);
			}
		})
		start && rate.eq(start-1).click();//设置初始值
		
		data.reset = function(){
			hide.removeAttr('value');
			rate.removeClass('current');
			data.index = 0;
		}
		return data;
	};
	return rate;
});
