/*
 * nojs.ui.tree
 * 目录树
 */
define(function(require,$){
	
	return function(id,data,opt){
		/*
		 * 无限级tree目录树
		 * @id:容器id
		 * @data:json数组Array
		 */
		if( !id || $.type(data)!=='array' || !data.length ){return;}
		opt = opt || {};
		var box = $("#"+id),
			item = '',
			c = 0,
			arr = {
				init : init,
				box : box,
				setNode : setNode,
				length : 0,
				open : open
			};
		if(!box.length){return;}
		//节点生成
		function init(Data){
			data = Data || data;
			item = '';
			function read(data,level){
				var len = data.length,
					i, j, now, m, link, line, id, open, check;						
				item += '<ul>';
				for(i=0,c=level;i<len;i++){						
					item += '<li level="'+(level+1)+'">';
					m = data[i];
					if(m&&m['text']){
						link = m['link'] ? m['link'] : '';
						
						line = '';
						if(level){
							for(j=0;j<level;j++){
								line += '<i class="line"></i>';
							}
						}
						id = typeof m['id']!=='undefined'?'id="'+m['id']+'"':'';
						open = typeof m['open']!=='undefined'?'open="'+m['open']+'"':'';
						check = opt.isCheck ? '<input type="checkbox" />' : '';
						
						item += '<a class="item" href="'+link+'" reallink="'+link+'" '+id+' '+open+'>'+line+'<i class="ico"></i>'+check+'<i class="folder"></i><span class="text">'+m['text']+'</span></a>';
						arr.length++;
						for(j in m){
							now = m[j];
							if($.type(now)=='array'&&now.length){
								c = level;
								read(now,++c);
								break;
							}
						}
					}
					item += '</li>';					
				}
				item += '</ul>';
				c = 0;
			}
			read(data,0);
			
			box.html(item).show();
			//ie67下会自动补全url为绝对路径
			//使用 getAttribute( 'href', 2 ) 可解决
			!function(){
				if( $.browser('ie6 ie7') ){
					var a = box.find('a'), link;
					a.each(function(){
						this.href = this.getAttribute( 'reallink', 2 );
						this.removeAttribute('reallink');
					})		
				}
			}();
			
			addClass();
			
			(function(){
				var node = box.find('a.item').not('.no_child');//包含子节点
				
				//展开全部
				if(opt.openAll){
					box.find('ul ul').show();
					node.addClass('open');
				}
				
				//设置默认关闭
				node.filter(function(){
					return this.getAttribute('open')=='0';
				}).removeClass('open').next('ul').hide();
				//设置默认打开
				node.filter(function(){
					return this.getAttribute('open')=='1';
				}).addClass('open').next('ul').show();
			})();
			setNode(opt.defaultNode);
		}
		init();
		/*
		 * 设置当前节点
		 * @ID:属性值
		 * @by:属性 通过该属性来查找节点，默认通过id
		 */
		function setNode(ID,by){
			
			by = by || 'id';
			var node = typeof ID!=='undefined' ? box.find('a['+by+'="'+ID+'"]').eq(0) : box.find('a.current:first');
			if(!node.length){return;}
			box.find('.current').removeClass('current');
			if(node.parents('ul').first().is(':visible')){
				return set();
			}
			//box.find('ul ul').slideUp(400);
			//box.find('.open').removeClass('open');
			var	ul = node.parents('ul').not(":visible"),
				len = ul.length,
				m;
			function set(){
				node.addClass('current');
				opt.onSelect&&opt.onSelect.call(arr,ID,node.attr('href'));//执行事件
				return false;
			}
			function s(i){
				if(i<0){
					return;
				}
				m = ul.eq(i);
				m.show().siblings('.item').addClass('open');
				s(--i);
			}
			s(len-1);//从最外层父ul开始展开
			set();
		}
		
		//节点添加特殊类
		function addClass(){
			var list = box.find('.item'),
				i,j,
				n = list.length,
				m,
				li,
				level;
			for(i=0;i<n;i++){
				m = list.eq(i);
				i==0&&m.find('.ico').addClass('first_ico');
				li = m.parents('li').eq(0);
				if(!m.next('ul').length){//无子节点
					m.addClass('no_child');
					if(!li.next().length){
						m.find('.ico').addClass('last_ico');
					}
				}else{
					if(!li.next().length){//有子节点并为最后一条
						m.find('.ico').addClass('last_ico1');
						level = li.attr('level');
						for(j=0;j<li.find('li').length;j++){
							li.find('li').eq(j).find('.line').eq(level-1).addClass('last_line');
						}
					}
				}				
			}
		}
		
		//节点绑定事件
		(function(){
			var t, tag, sec, link;
			box.off('click.tree').on( 'click.tree', function(e){
				t = e.target;
				tag = $( t );
				if( tag.hasClass('ico') && !tag.parent().hasClass('no_child') ){//折叠
					tag = tag.parent('.item');
					sec = tag.next('ul');
					if( tag.hasClass('open') ){
						sec && sec.is(":visible") && sec.hide();
						tag.removeClass('open');
					}else{
						sec && sec.is(":hidden") && sec.show();
						tag.addClass('open');
					}
				}else if(tag.hasClass('folder')||tag.hasClass('item')||tag.hasClass('text')||tag.hasClass('line')||tag.hasClass('ico')){//选中
					(!tag.hasClass('item')) && (tag = tag.parent('.item'));
					box.find('.current').removeClass('current');
					tag.addClass('current');
					opt.onSelect && opt.onSelect.call(arr,tag[0].id,tag.attr('href'));//执行事件
				}else if(t.tagName.toLowerCase()=='input'){
					
					tag.closest('li').find('input').attr('checked',t.checked?'checked':false);//全选/反选
					
					if( t.checked ){
						var p = tag.parents('ul'),
							n = p.length, i=0, m;
						for( ; i<n; i++ ){
							m = p.eq(i);
							if( !m.find('input').not(':checked').length ){
								m.prev('a.item').find('input').attr('checked','checked');
							}
						}	
					}else{
						tag.parents('ul').prev('a.item').find('input').attr('checked',false);
					}
					return true;
				}
				return false;
			})
		})();
		
		//手动开关节点
		//@id:节点id
		function open( id ){
			$('#'+id).find('i.ico').click();
		}
		
		return arr;
	};
});
