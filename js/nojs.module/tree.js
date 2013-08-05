/*
 * tree 树型菜单
 * 2013-8-3
 * nolure@vip.qq.com
 */
define(function(require,$){
	
	function tree( box, options ){
		var date1 = (+new Date);
		this.box = $('#'+box);
		this.options = options || {};
		this.data = tree.format( options.data, options.key );
		if( !this.box.length || !this.data ){
			return;
		}
		//console.log(this.data.level)
		var date2 = (+new Date);
		//console.log(date2-date1);
		if(this.box[0].id=='tree_test1'){
			//return;
		}
		this.init( null, true );
		
		date2 = (+new Date);
		//console.log(date2-date1);
		
	}
	/***
	
	data.all = {
		'0' : {id:'0',name:'',children:['1','2']},
		
			'1' : {id:'1',name:'',parent:'0',children:['11']},
				'11' : {id:'11',name:'',parent:'1'},	
				
			'2' : {id:'2',name:'',parent:'0'}
	}
	data.level[0] = {
		'0' : {id:'0',name:'',children:['1','2']}
	}
	data.level[1] = {
		'1' : {id:'1',name:'',parent:'0',children:['11']},
		'2' : {id:'2',name:'',parent:'0'}
	}
	data.level[2] = {
		'11' : {id:'11',name:'',parent:'1'}
	}
	***/
	tree.key = {};
	/*
	 * 格式化数据，可接受2种形式的数据，均为json Array对象
	 * 1. 树状结构，子节点children(json Array).
	 * 2. 所有节点并列存放，必须指定父节点id(parent),根节点为-1
	 */
	tree.format = function( data, key ){
		var dataType = $.type( data ),
			level = [],
			_data = {};
			
		tree.key = $.extend({
			'id' : 'id',
			'name' : 'name',
			'parent' : 'parent',
			'children' : 'children',
			'open' : 'open',
			'link' : 'link'
		}, tree.key);
		tree.key = key = $.extend(tree.key,key);	
		
		if( dataType!='array' || !data.length || $.type(data[0])!='object' ){
			return;
		}
		dataType = data[0][ key['parent'] ]==undefined ? 1 : 2;
		
		function each( Data, _level, _parent ){
			var n = Data.length,
				i, j, m, id, pid, child, _n = 0;
				
			for( i=0; i<n; i++ ){
				m = Data[i];
				id = m[ key['id'] ];
				_n++;
				if( _data[id] ){
					continue;
				}
				_data[id] = m;
				pid = m[ key['parent'] ];//该节点的父节点id
				child = key['children'];
				
				if( pid==undefined ){//树状形式的数据
					_data[id] = {
						level : _level
					}
					for( j in m ){
						_data[id][j] = j==child ? [] : m[j];
					}
					_data[id][child] = _data[id][child] || [];
					
					if( _level>0 ){
						_data[id][ key['parent'] ] = _parent;//指定其父节点
						_data[_parent][child].push(id);
					}
					if( m[child] && m[child].length ){
						each( m[child], _level+1, id );
					}
				}else if( pid==-1 ){//一级根节点
					m.level = _level = 0;
					m[ child ] = [];
				}else{//子节点
					m[ child ] = [];
					if( _data[pid] ){//其所属父节点
						_data[pid][ child ] = _data[pid][ child ] || [];
						_data[pid][ child ].push(id);
						m.level = _level = _data[pid].level+1;
					}else{
						delete _data[id];
						_n--;
						continue;
					}
				}
				
				level[_level] = level[_level] || {};
				level[_level][id] = _data[id];
			}
			dataType==2 && _n<n && each(Data);
		}
		each(data,0);
		return {
			all : _data,
			level : level
		};
	}
	
	tree.prototype = {
		init : function( node, set ){
			//@node:节点id，初始化该节点下所有一级子节点，为空表示初始化根节点
			
			var T = this,
			
				_link = tree.key['link'],
				_id = tree.key['id'],
				_open = tree.key['open'],
				_name = tree.key['name'],
				_parent = tree.key['parent'],
				_child = tree.key['children'],
				
				isChild = node!=undefined,
				all = this.data.all,
				level = isChild ? all[node].level+1 : 0,
				data = isChild ? all[node][_child] : this.data.level[level],
				isCheck = this.options.isCheck,
				item, i, j, now, m, link, line, id, open, check;
				
			//this.box[0].id=='tree_test1' && console.log(node)
			item = '<ul>';	
			for( i in data ){
				m = data[i];
				m = isChild ? all[m] : m;
				id = m[_id];
				
				item += '<li level="'+level+'">';
				m.init = true;
				
				line = '';
				if( level ){
					for( j=0; j<level; j++ ){
						line += '<i class="line"></i>';
					}
				}
				link = m[_link] ? m[_link] : '';
				
				open = typeof m[_open]!=='undefined' ? 'open="'+m[_open]+'"' : '';
				check = isCheck ? '<input type="checkbox" value="'+id+'" />' : '';
				
				item += '<a class="item" href="'+link+'" reallink="'+link+'" id="'+id+'" '+open+'>'+line+'<i class="ico"></i>'+check+'<i class="folder"></i><span class="text">'+m[_name]+'</span></a>';
				
				if(  m[ _child ].length ){
					//item += this.init(id,false);
					//暂不加载子节点，除默认打开节点外
					item += (m[_open]==1||T.options.openAll) ? this.init(id,false) : '<ul></ul>';
				}
				item += '</li>';
			}
			
			item += '</ul>';
			
			if( set ){
				var area = this.box;
				if( isChild ){
					area = $(item)
					$('#'+node).next('ul').replaceWith(area);
				}else{
					this.box.html(item);
					this.bind();
				}
				
				this.addClass(area);
				this.replaceLink(area);
				
				(function(area){
					var node = area.find('a.item').not('.no_child');//包含子节点
					
					//展开全部
					if( T.options.openAll ){
						area.find('ul ul').show();
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
				})(area);
				!isChild && this.select(this.options.defaultNode);
				
			}
			
			return item;
		},
		bind : function(){
			var T = this,
				tag, sec, link, t;
			this.box.on( 'click.tree', function(e){
				t = e.target;
				tag = $( t );
				
				if( tag.hasClass('ico') && !tag.parent().hasClass('no_child') ){//折叠
					
					tag = tag.parent('.item');
					sec = tag.next('ul');
					if( tag.hasClass('open') ){
						sec && sec.is(":visible") && sec.hide();
						tag.removeClass('open');
					}else{
						if( !sec.data('init') ){
							T.init(tag[0].id,true);
							sec = tag.next('ul');
							sec.data('init',true);
						}
						sec && sec.is(":hidden") && sec.show();
						tag.addClass('open');
					}
				
				}else if(tag.hasClass('folder')||tag.hasClass('item')||tag.hasClass('text')||tag.hasClass('line')||tag.hasClass('ico')){//选中
					
					if( !tag.hasClass('item') ){
						tag = tag.parent()
					}
					T.box.find('a.current').removeClass('current');
					tag.addClass('current');
					T.options.onSelect && T.options.onSelect.call( T, T.data.all[tag[0].id] );//执行事件
					
				}else if( t.tagName.toLowerCase()=='input' ){
					
					var children = tag.closest('a.item').next('ul').find('input'),
						parent = tag.parents('ul'),
						i, m, checked;
					if( t.checked ){
						children.attr('checked','checked');
						for( var i=0; i<parent.length; i++ ){
							m = parent.eq(i);
							if( !m.find('input').not(':checked').length ){
								m.prev('a.item').find('input').attr('checked','checked');
							}
						}
					}else{
						children.attr('checked',false);
						parent.prev('a.item').find('input').attr('checked',false);
					}
					checked = T.box.find(':checked');
					
					T.checked = checked.length ? (function(){
						var rect = [];
						checked.each(function(){
							rect.push( this.value );
						})
						return rect;
					})() : null;
					T.options.onCheck && T.options.onCheck.call( T, t.id );
					
					return true;
				}
				
				return false;
			})
		},
		addClass : function(area){
			area = area || this.box;
			var list = area.find('a.item'),
				i,j,
				n = list.length,
				m,
				li,
				level;
			for( i=0; i<n; i++ ){
				m = list.eq(i);
				i==0 && m.find('.ico').addClass('first_ico');
				li = m.closest('li');
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
							li.find('li').eq(j).find('.line').eq(level).addClass('last_line');
						}
					}
				}				
			}
		},
		/*
		 * 设置当前节点
		 * @ID:属性值
		 * @by:属性 通过该属性来查找节点，默认通过id
		 */
		select : function( ID, by ){
			by = by || 'id';
			var T = this,
				node = typeof ID!=='undefined' ? 
					this.box.find('a['+by+'="'+ID+'"]').eq(0) : this.box.find('a.current:first');
					
			if(!node.length){return;}
			
			this.box.find('a.current').removeClass('current');
			if(node.parents('ul').first().is(':visible')){
				return set();
			}
			
			var	ul = node.parents('ul').not(":visible"),
				len = ul.length,
				m;
			function set(){
				node.addClass('current');
				T.options.onSelect && T.options.onSelect.call( T, T.data.all[ID] );//执行事件
				return false;
			}
			function s(i){
				if(i<0){
					return;
				}
				m = ul.eq(i);
				m.show().siblings('a.item').addClass('open');
				s(--i);
			}
			s(len-1);//从最外层父ul开始展开
			set();
		},
		replaceLink : function(area){
			//ie67下会自动补全url为绝对路径
			//使用 getAttribute( 'href', 2 ) 可解决
			if( $.browser('ie6 ie7') ){
				area = area || this.box;
				var a = area.find('a'), link;
				a.each(function(){
					this.href = this.getAttribute( 'reallink', 2 );
					this.removeAttribute('reallink');
				})		
			}
		}
	}
	
	//通过一个select来展现树形结构或者是级联菜单
	tree.select = function( box, options ){
		options = options || {};
		var Data = tree.format(options.data),
			data = Data.level;
		if( !box || !box.length || !data || !data.length ){
			return;
		}
		
		var	level = 0, item,
			_id = tree.key['id'],
			_name = tree.key['name'],
			_child = tree.key['children'],
			single = options.level==0;
			
		
		function get(level){
			var i, j, item = '', _data;
			_data = data[level];
			item = '<select name="" id="">';	
			item += single ? '<option value="-1">根目录</option>' : '';
			
			for( i in _data ){
				item += getItem( _data[i], level );
			}
			item += '</select>';
			return item;
		}
		function getChild(child){
			var j, item = '';
			level++;
			if( child.length ){
				for( j=0; j<child.length; j++ ){
					item += getItem( data[level][ child[j] ], level );
				}
			}
			level--;
			return item;
		}
		function getLine(level){
			var line = '--';
			for( i=0; i<level; i++ ){
				line += '--';
			}
			return line;
		}
		function getItem(m,level){
			return '<option value="'+m[_id]+'">'+(single?getLine(level):'')+m[_name]+'</option>'+( single ? getChild(m[_child]) : '' );
		}
		item = get(level);
		item = $(item);
		box.html(item);
		
		if( !single ){
			function change(item){
				var m = $(item), 
					id = m[0].value, 
					_data = Data.all[id],
					child = _data[_child];
				
				m.nextAll('select').remove();	
				if( child.length ){
					level = _data.level;						
					child = $('<select name="" id="">'+getChild(child)+'</select>');
					m.after(child);
					bind(child);
				}
			}
			function bind(item){
				item.change(function(){
					change(this);
				})
				if( item.val() ){
					change(item);
				}
			}
			bind( item );
			
		}
		
		return item;
	}
	
	return tree;
});
