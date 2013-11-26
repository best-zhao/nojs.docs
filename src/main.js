define(function(require,$,ui){
	var tree = require('nojs/module/tree'),
		codeLight = require('nojs/module/codelight'),
		project = require('project'),
		demo = require('./demo'),
		setUrl = require('./url'),
		G = {};
		
	//require('style.css');	
	
	var page = $('#ui_page'),
		main = $('#main_content'),
		head = $('#ui_head'),
		option = head.find('.options'),		
		win = $(window),
		D = window.Page=='mobile' ? 'mb_intro' : 'nojs_info',
		frame = $('#iframe_content'),
		side = $('#side_menu'),
		wrap = page.children('div.ui_wrap'),
		showMenu = $('#show_menu'),
		first = 0, Menu;
	
	if( typeof onhashchange!='undefined' ){
		window.onhashchange = function(){
		    var id = setUrl(), i, m,
			    key = setUrl.key;
			    
			if( id && key=='id' ){
				for( i=0; i<G.project.length; i++ ){
					m = G.project[i];
					if( m.data.all[id] ){
						first = 0;
						m.select(id);
						break;
					}
				}
			}
			key=='demo' && demo.tab && demo.isOpen && setUrl('demo')!=demo.index && demo.tab.change(setUrl('demo'));
		}
	}	
	setUrl.call = function(){
	    first = 1;
	}
	
	var treeOptions = {
		defaultNode : setUrl() || D,//设置默认节点
		onSelect : function(data){
			var link = data.link,
				id = data.id;
			
			demo.hide();
			setUrl('id', id);
			
			if( first>0 ){
				return;
			}
			if(!link){
				option.hide();
				return;
			}
			window.demoAction = demo.init = demo.tab = null;
			
			frame.html('<i class="load"></i>');
			new ui.ico( frame.find('i.load'), {
				type : 'loading',
				width : 32,
				height : 32
			})
			page.siblings().remove();
			
			var _id = this.box[0].id,
				name = _id.substring(_id.indexOf('_')+1,_id.length),
				url = 'project/' + name + '/' +link+'.html';
				
			id!='project' && this.box.siblings('.nj_tree').find('a.current').removeClass('current');
			
			frame.load( url, function(){
				option[window.demoAction?'show':'hide']();
				if( window.demoAction ){
					demo.container.html( demo.getHtml() );
					demo.openFirst && demo.show(setUrl('demo'));
				}				
				//代码高亮
				new codeLight({parent:frame});
				
				frame.click(function(e){
					var t = e.target,
						act, m, i;
					if( t.tagName.toLowerCase()=='a' ){
						act = $(t).attr('data-action');
						if( act=='demo' ){
							demo.show($(t).attr('data-index')-1);
							return false;
						}
						if( act = $(t).attr('data-id') ){//扩展应用
							for( i=0;i<G.project.length;i++ ){
								m = G.project[i];
								if( m.data.all[act] ){
									m.select(act);
									break;
								}
							}
							return false;
						}
					}
				})
				ui.init(frame);
			});
			showMenu.is(':visible') && setMenu('hide');
		}
	}
	
	var headHeight = head.outerHeight();
	function setLayout(){
		var h = win.height() - headHeight;
		wrap.height(h);
	}
	setLayout();
	win.on('scroll resize',setLayout);
	
	option.click(function(e){
		var t = e.target,
			m, act, isopen;
		if( t.tagName.toLowerCase()=='a' ){
			m = $(t);
			act = m.attr('data-action');
			if( frame.is(':animated') ){
				return false;
			}
			switch (act){
				case 'demo':
					demo.isOpen = demo.isOpen ? false : true;
					demo.container.animate({
						'opacity' : !demo.isOpen ? 0 : 1,
						'left' : !demo.isOpen ? '100%' : 0
					}, demo.openFirst ? 0 : 500, 'easeOutExpo', function(){
						if( demo.isOpen ){
							window.demoAction && demoAction.onShow && demoAction.onShow();
							demoAction.onChange && demoAction.onChange(demo.index);
						}
					})
					frame.animate({
						'opacity' : !demo.isOpen ? 1 : 0,
						'margin-left' : !demo.isOpen ? '0' : '-200px'
					}, demo.openFirst ? 0 : 500, 'easeOutExpo')
					
					if( demo.isOpen && !demo.init ){
						demo.init = true;
						
						demo.tab = new ui.Switch(demo.container, {
						    firstIndex : demo.index,
							mode : 'click',
							onChange : function(index){
								var wrap = this.con.eq(index), call;
								demo.index = index;
								//console.log(index)
								call = demoAction.item[index].callback;
								if( call ){
                                    call.onShow && call.onShow();
                                    call.onChange && call.onChange(index);
                                }
								if( !wrap.data('init') ){
									wrap.data('init', true);									
									if( call ){
									    call(call);
									    call.index = index;
									}
								} 
								demoAction.onChange && demoAction.onChange(index);
								setUrl('demo', demo.index);
							},
							onHide : function(index){
							    //console.log(index)
							    var call = demoAction.item[index].callback;
							    call && call.onHide && call.onHide(index);
							}
						});
						window.demoAction.callback && window.demoAction.callback();
					}
					!demo.isOpen && window.demoAction && demoAction.onHide && demoAction.onHide();
					setUrl('demo', demo.isOpen?demo.index:null);
					if( demo.openFirst ){
                        delete demo.openFirst;
                    }
					break;
			}
			return false;
		}
	})
	
	G.project = [];	
	
	side.empty();
	tree.key = {
		'name' : 'text',
		'children' : 'data'
	}
	for( var i in project ){
		if( window.Page=='mobile' && i!='mobile' || window.Page!='mobile' && i=='mobile' ){
			continue;
		}
		createProject( i, project[i] );
	}	
	function createProject( name, p ){
		var data = p.data, _tree, id;
			
		if( !data ){return;}
		id = 'menu_'+name;
		_tree = $('<div id="'+id+'" class="nj_tree"></div>');
		side.append(_tree);		
		var t = new tree( id, {
			openAll : name=='nojs' ? false : true,
			data : data,
			max : 5,
			onSelect : treeOptions.onSelect,
			defaultNode : treeOptions.defaultNode
		});
		if( name=='nojs' ){
			window.Menu = t;
		}
		G.project.push( t );
	}
	
	showMenu.click(function(){
		setMenu();
		return false;
	})
	function setMenu(display){
		if( display && showMenu.is(':hidden') ){
			return;
		}
		if( !display ){
			display = setMenu.display=='show' ? 'hide' : 'show';
		}
		if( display=='show' ){
			side.css('left','0');
			setMenu.display='show';
		}else{
			side.css('left','-15em').removeAttr('style');
			setMenu.display='hide';
		}
	}
	setMenu.display='hide';
	
	
	var fLink = $('<div class="f_link"></div>').appendTo(side);
	if( window.Page=='mobile' ){
		fLink.append('<a href="index.html">nojs</a>');
		page.swipeRight(function(){
			setMenu('show');
		}).swipeLeft(function(){
			setMenu('hide');
		})
	}else{
		fLink.append('<a href="m.html">nojs mobile</a>');
	}
	//fLink.append('<a href="http://nolure.com">blog: http://nolure.com</a>');
	return G;
});
/*
 * bug记录：
 * [drag] - 需要找到元素父元素中的相对定位层，否则会移位
 */