/*
 * tree 树型菜单
 * 2013-8-3
 * nolure@vip.qq.com
 */
define(function(require,$){
	
	function tree( box, options ){
		var date1 = (+new Date)
		this.box = typeof box=='string' ? $('#'+box) : box;
		this.options = options = options || {};
		this._data = options.data;
		//@data: string即为ajax获取数据
		this.ajaxMode = typeof this._data=='string';
		this.data = this.ajaxMode ? null : tree.format( this._data );
		
		if( !this.box.length || !this.ajaxMode && !this.data ){
			return;
		}	
		this.max = options.max || tree.max;
		
		//ajax模式获取数据后，所有节点都应先初始化为包含子节点的节点
		if( this.ajaxMode ){
			var T = this;			
			tree.ajax({
				url : this._data,
				tree : this,
				success : function(){
					T.init( null, true, true );
				}
			})
		}else{
			this.init( null, true, true );
		}
	}
	tree.key = {};
	tree.max = 100;//一次一级最多能处理的节点数
	tree.rootID = -1;//根节点id
	/*
	 * 通过ajax获取数据
	 */
	tree.ajax = function( options ){
		options = options || {};
		$.getJSON( options.url, options.data, function(json){
			if( json.status==1 ){
				var Tree = options.tree;
				if( Tree && json.data ){
					Tree.data = tree.format(json.data, Tree.data);
				}
				options.success && options.success(json.data);
			}
		})
	}
	/*
	 * 格式化数据，可接受2种形式的数据，均为json Array对象
	 * 1. 树状结构，子节点children(json Array).
	 * 2. 所有节点并列存放，必须指定父节点id(parent),根节点为-1
	 * @Data: 在原数据上添加
	 */
	tree.format = function( data, _Data ){
		var dataType = $.type( data ),
			level = _Data && _Data.level ? _Data.level : [],
			time = 0,
			child,
			key,
			_data = _Data && _Data.all ? _Data.all : {};
		
		tree.key = key = $.extend({
			'id' : 'id',
			'name' : 'name',
			'parent' : 'parent',
			'children' : 'children',
			'open' : 'open',
			'link' : 'link'
		}, tree.key);		
		
		child = key['children'];	
		if( dataType!='array' || !data.length || $.type(data[0])!='object' ){
			return {
				all : _data,
				level : level
			};
		}
		//_data = _data || {};
		//console.log(_data)
		dataType = data[0][ key['parent'] ]==undefined ? 1 : 2;
		
		function each( Data, _level, _parent ){
			var n = Data.length,
				i, j, m, id, pid, _n = 0;
			
			time++;	
			for( i=0; i<n; i++ ){
				m = Data[i];
				id = m[ key['id'] ];
				_n++;
				if( id==undefined || _data[id] ){//没有id或者重复数据
					if( _Data ){//追加数据
						//Data.splice(i,1);
						//i--;
						//n--;
					}
					continue;
				}
				_data[id] = m;
				pid = m[ key['parent'] ];//该节点的父节点id
				
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
					}else{
						_data[id][ key['parent'] ] = tree.rootID;
					}
					
					if( m[child] && m[child].length ){
						
						each( m[child], _level+1, id );
					}
				}else if( pid==tree.rootID ){//一级根节点
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
				
				//level[_level] = level[_level] || {};
				//level[_level][id] = _data[id];
				level[_level] = level[_level] || [];
				level[_level].push(_data[id]);
			}
			dataType==2 && _n<n && time<3 && each(Data);
		}
		each(data,0);
		return {
			all : _data,
			level : level
		};
	}
	/*
	 * 通过子节点找到其所有父节点路径，返回父节点id数组
	 * @node:子节点id
	 * @data:格式化后的数据
	 * @until:可选，funtion，查询终止条件
	 */
	tree.parents = function( node, data, until ){
		var _parent = tree.key['parent'],
			_id = tree.key['id'],
			_par, parents = [];
		
		data = data || {};
		node = data[node];
		if(!node){
			return parents;
		}
		_par = node[_parent];//父节点id		
		
		for( ; _par = data[_par]; _par = _par[_parent] ){
			if( until && until(_par) ){
				break;
			}			
			parents.push( _par[_id] );
		}
		return parents;
	}
	
	tree.prototype = {
		init : function( node, set, setDefault ){
			//@node:节点id，初始化该节点下所有一级子节点，为空表示初始化根节点
			var T = this,
			
				_link = tree.key['link'],
				_id = tree.key['id'],
				_open = tree.key['open'],
				_name = tree.key['name'],
				_parent = tree.key['parent'],
				_child = tree.key['children'],
				
				isChild = node!=undefined && node!=tree.rootID,
				all = this.data.all,
				level = isChild ? all[node].level+1 : 0,
				data = isChild ? all[node][_child] : this.data.level[level],
				isCheck = this.options.isCheck,
				item = '', i, j, now, m, link, line, id, open, check, more;
			
			if( !data.length ){
				return;
			}
			data['break'] = data['break'] || 0;
			
			line = '';
			if( level ){
				for( j=0; j<level; j++ ){
					line += '<i class="line"></i>';
				}
			}
			
			for( i=data['break']; i<data.length; i++ ){
				if( i>=T.max+data['break'] ){
					data['break'] += T.max;
					item += '<li class="no_child more"><a href="" id="more_'+(isChild?node:tree.rootID)+'_'+level+'" class="item" pid="'+(isChild?node:tree.rootID)+'" data-action="more">'+line+'<i class="ico last_ico"></i><i class="folder"></i>more</a></li>';
					break;
				}
				m = data[i];				
				m = isChild ? all[m] : m;
				id = m[_id];
				
				m.init = 1;//标记节点本身已初始化
				item += '<li level="'+level+'">';
				link = m[_link] ? m[_link] : '';
				
				open = typeof m[_open]!=='undefined' ? 'open="'+m[_open]+'"' : '';
				check = isCheck ? '<input type="checkbox" value="'+id+'" />' : '';
				
				item += '<a class="item" href="'+link+'" reallink="'+link+'" id="'+id+'" '+open+'>'+line+'<i class="ico"></i>'+check+'<i class="folder"></i><span class="text">'+m[_name]+'</span></a>';
				
				if(  m[ _child ].length ){
					//暂不加载子节点，除默认打开节点外
					if( m[_open]==1 || T.options.openAll ){
						m.init = 2;//标记其子节点已初始化
						item += '<ul data-init="true">';
						item += this.init(id,false);
					}else{
						item += '<ul>';
					}
					item += '</ul>';
				}else if( this.ajaxMode ){
					item += '<ul></ul>';
				}
				item += '</li>';
			}
			
			if( set ){
				var area = this.box,
					_node;
				if( isChild ){
					area = $(item);
					_node = this.box.find('#'+node);
					_node.next('ul').data('init',true).append(area);
					this.addClass(_node.parent());
				}else{
					if( !this.rootWrap ){
						this.rootWrap = $('<ul></ul>');
						area.html(this.rootWrap);
						this.bind();
					}
					this.rootWrap.append(item);
					this.addClass(area,true);
				}
				
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
				!this.selected && setDefault && this.select(this.options.defaultNode);
			}
			return item;
		},
		bind : function(){
			var T = this,
				tag, par, sec, link, t;
			this.box.off('click.tree').on( 'click.tree', function(e){
				t = e.target;
				tag = $( t );
				par = tag.parent();
				if( tag.attr('data-action')=='more' || par.attr('data-action')=='more' ){
					
					tag = par.attr('data-action')=='more' ? par : tag;
					T.init( tag.attr('pid'), true );
					tag.parent().remove();					
				}else if( tag.hasClass('ico') && !tag.parent().hasClass('no_child') ){//折叠
					
					tag = tag.parent('.item');
					sec = tag.next('ul');
					if( tag.hasClass('open') ){
						sec && sec.is(":visible") && sec.hide();
						tag.removeClass('open');
					}else{
						if( !sec.data('init') ){
							var node = tag[0].id;
								///child = T.data.all[node][tree.key['children']][0];
							//初始化该节点
							if( T.ajaxMode ){
								tree.ajax({
									url : T._data,
									data : {id:node},
									tree : T,
									success : function(data){
										if( data && data.length ){
											T.init(node,true);
										}else{
											tag.addClass('no_child').next('ul').remove();
											if( tag.find('.last_ico1').length ){
												tag.find('.last_ico1').addClass('last_ico').removeClass('last_ico1');
											}
										}
										sec.data('init',true);
									}
								})
							}else{
								T.init(node,true);
								sec.data('init',true);
							}
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
		addClass : function(area,root){
			area = area || this.box;
			var list = area.find('a.item'),
				i, j, q, l,
				n = list.length,
				m, o,
				li,
				level;
			for( i=0; i<n; i++ ){
				m = list.eq(i);
				root && i==0 && m.find('.ico').addClass('first_ico');
				li = m.closest('li');
				if(!m.next('ul').length){//无子节点
					!this.ajaxMode && m.addClass('no_child');
					if(!li.next().length){
						m.find('.ico').addClass('last_ico');
					}
				}else{					
					!li.next().length && m.find('.ico').addClass('last_ico1');//有子节点并为最后一条
					level = li.attr('level');
					for( j=0; j<li.find('li').length; j++ ){
						
						o = li.find('li').eq(j).find('.line');
						!li.next().length && o.eq(level).addClass('last_line');
						
						q = m.find('.last_line');
						for( l=0; l<q.length; l++ ){
							o.eq(q.eq(l).index()).addClass('last_line');
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
			if( !ID ){return;}
			by = by || 'id';
			var T = this,
				node = this.box.find('a['+by+'="'+ID+'"]').eq(0),
				all = this.data.all,
				_parent = tree.key['parent'],
				parents = [],
				i, _node;
					
			if(!all[ID]){return;}
			
			if( !node || !node.length ){
				
				//从当前节点依次往上寻找父节点，直到找到已经初始化的节点为止
				parents = tree.parents( ID, this.data.all, function(parent){
					return parent.init==2;
				})
				if( parents.length ){
					//然后从最外层的父节点开始初始化
					for( i=parents.length-1; i>=0; i-- ){
						_node = all[parents[i]];
						while(!_node.init){
							$('#more_'+_node[_parent]+'_'+_node.level).click();
						}
						$('#'+parents[i]).find('i.ico').click();
					}
					parents = $('#'+parents[0]).next();
				}else{
					parents = $('#'+all[ID][_parent]).next();
				}
				//所有父节点展开后再获取该节点
				node = parents.find('a['+by+'="'+ID+'"]').eq(0);
				if( !node.length ){//超出了max
					while(!all[ID].init){
						parents.find('li[level='+all[ID].level+'].more a').click();
					}
					node = parents.find('a['+by+'="'+ID+'"]').eq(0);
				}
			}
			
			this.box.find('a.current').removeClass('current');
			
			T.selected = ID;//当前选中节点
			if( node.parents('ul').first().is(':visible') ){
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
		
		var Data = typeof options.data=='string' ? {} : tree.format(options.data),
			selected = [].concat(options.select),
			single = options.level==0,
			ajaxMode = typeof options.data=='string',
			data = ajaxMode ? [] : Data.level,
			emptyID = options.empty!=undefined ? options.empty : '',
			empty,
			
			level = 0, item, 
			_id = tree.key['id'],
			_name = tree.key['name'],
			_child = tree.key['children'];
		
		if( !box || !box.length || !data ){
			return;
		}
		
		function get(level){
			var i, item = '', _data;
			_data = data[level];
			item = '<select name="">';	
			item += single ? '<option value="'+tree.rootID+'">根目录</option>' : empty;
			
			for( i in _data ){
				if( emptyID==_data[i][_id] ){
					continue;
				}
				item += getItem( _data[i], level );
			}
			item += '</select>';
			return item;
		}
		function getChild(child){
			var j, item = '';
			level++;
			if( child.length ){
				for( j in child ){
					item += getItem(Data.all[ child[j] ], level );
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
			return '<option value="'+(m[_id]!=undefined?m[_id]:'')+'">'+(single?getLine(level):'')+m[_name]+'</option>'+( single ? getChild(m[_child]) : '' );
		}
		empty = '<option value="'+emptyID+'">请选择</option>';
		
		if( ajaxMode ){
			ajax();
		}else{
			init();
		}
		
		function init(){
			item = get(level);
			item = $(item);
			if( selected[0]!=undefined ){
				item[0].value = selected[0];
				selected[0] = null;
			}
			box.html(item);
		}
		function ajax(_data, callback){
			tree.ajax({
				url : options.data,
				data : _data,
				success : function(_data_){
					if( !_data_ || !_data_.length ){
						return;
					}
					//获取子节点时，返回数据必须指定父id
					if( _data && _data.id ){
						var i, _par = tree.key['parent'];
						for( i=0; i<_data_.length; i++ ){
							_data_[i][_par] = _data.id;
						}
					}
					
					Data = tree.format(_data_, Data);
					data = Data.level;
					if( callback ){
						callback();
					}else{
						init();
						!single && bind( item );
					}
				}
			});
		}
		
		if( !single ){
			function add(m,id){
				var _data = Data.all[id],
					child = _data[_child];
					
				if( !child.length ){
					return;
				}	
				m = $(m);
				_data.init = true;
				
				level = _data.level;
				child = $('<select name="">'+empty+getChild(child)+'</select>');
				
				if( selected[level+1]!=undefined ){
					child[0].value = selected[level+1];
					selected[level+1] = null;
				}
				m.after(child);
				bind(child);
			}
			function change(item){
				var id = item.value;
				//box[0].id=='tree_test3' && console.log(id);
				$(item).nextAll('select').remove();
				if( id==emptyID || !Data.all[id] ){
					return;
				}
				if( ajaxMode && !Data.all[id].init ){
					ajax({id:id}, function(){
						add(item,id);
					});
				}else{
					add(item,id);
				}
				
			}
			function bind(item){
				item.change(function(){
					change(this);
				})
				if( item.val() ){
					change(item[0]);
				}
			}
			item && bind( item );
		}
		return item;
	}
	
	return tree;
});
