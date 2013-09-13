define(function(require,$,ui){
	var tree = require('nojs/module/tree'),
		codeLight = require('nojs/module/codelight'),
		project = require('project'),
		G = {};
	
	var page = $('#ui_page'),
		main = $('#main_content'),
		head = $('#ui_head'),
		option = head.find('.options'),
		demo = {
			container : $('#demo_content').css('opacity','0'),
			isOpen : null
		},
		win = $(window),
		D = window.Page=='mobile' ? 'mb_intro' : 'nojs_info',
		page = $('#ui_page'),
		frame = $('#iframe_content'),
		side = $('#side_menu'),
		wrap = page.children('div.ui_wrap'),
		showMenu = $('#show_menu'),
		first = 0, Menu;
	
	function setUrl(id){
		var url = location.href.split('#'), hash = url[1];
		if( id==undefined ){
			return hash;
		}
		if(hash==id){
			return;
		}
		first = 1;
		location.href = url[0] + '#' + id;
	}	
	if( typeof onhashchange!='undefined' ){
		window.onhashchange = function(){
			var hash = location.hash, i, m;
			hash = hash.substring(1, hash.length);
			if( hash ){
				for( i=0;i<G.project.length;i++ ){
					m = G.project[i];
					if( m.data.all[hash] ){
						first = 0;
						m.select(hash);
						break;
					}
				}
			}
		}
	}
	$(window).bind('popstate', function(e){ 
		//12
	})
	
	var treeOptions = {
		defaultNode : setUrl() || D,//设置默认节点
		onSelect : function(data){		
			var link = data.link,
				id = data.id;	
				
			demo.hide();	
			setUrl(id);
			if( first>0 ){
				return;
			}
			
			if(!link){
				option.hide();
				return;
			}
			window.demoAction = null;
			
			frame.html('<i class="load"></i>');
			new ui.ico( frame.find('i.load'), {
				type : 'loading',
				width : 32,
				height : 32
			})
			page.nextAll().remove();
			
			var _id = this.box[0].id,
				name = _id.substring(_id.indexOf('_')+1,_id.length),
				url = 'project/' + name + '/' +link+'.html';
				
			id!='project' && this.box.siblings('.nj_tree').find('a.current').removeClass('current');
			
			frame.load( url, function(){
				option[window.demoAction?'show':'hide']();
				demo.container.html( demo.getHtml() );
				
				if( window.demoAction ){
					demo.tab = new ui.Switch(demo.container, {
						mode : 'click',
						onChange : function(index){
							var wrap = this.con.eq(index);
							demo.index = index;
							
							if( !wrap.data('init') ){
								wrap.data('init', true);
								demoAction.item[index].callback && demoAction.item[index].callback();
							} 
						}
					});
					window.demoAction.callback && window.demoAction.callback();
				}
				
				//代码高亮
				new codeLight({parent:frame});
				//扩展应用
				frame.find('#about_link,.about_link').on('click',function(e){
					var t = e.target, i ,m;
					if( t.tagName.toLowerCase()=='a' ){
						for( i=0;i<G.project.length;i++ ){
							m = G.project[i];
							if( m.data.all[t.id] ){
								m.select(t.id);
								break;
							}
						}
						return false;
					}
				})
				frame.click(function(e){
					var t = e.target,
						act;
					if( t.tagName.toLowerCase()=='a' ){
						act = $(t).attr('data-action');
						if( act=='demo' ){
							demo.show($(t).attr('data-index')-1);
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
	
	demo.getHtml = function(){
		if( !demoAction || !demoAction.item ){
			return '';
		}
		var _demo = '',
			n = demoAction.item.length,
			i;
		_demo = [
			'<div class="demo_wrap">',
				'<div class="demo_head">',
					'<a href="" data-action="back" class="nj_btn">返回</a>',
					'<a href="" data-action="source" class="nj_btn n_b_sb">获取示例源码</a>',
				'</div>',
				demoAction.html || ''
		].join('');
		if( n ){
			_demo += '<ul class="nj_s_menu clearfix">';
			for( i=0; i<n; i++ ){
				_demo += '<li class="nj_s_m">demo'+(i+1)+'</li>';
			}
			_demo += '</ul>';
			_demo += '<div class="nj_s_con">';
			
			for( i=0; i<n; i++ ){
				_demo += '<div class="nj_s_c">'+(demoAction.item[i].content||'')+'</div>';
			}
			_demo += '</div>';
		}
		
		_demo += '</div>';
		return _demo;
	}
	demo.show = function(index){
		var btn = option.find('a[data-action=demo]');
		!demo.isOpen && btn.click();
		index!=undefined && demo.tab.change(index);
	}
	demo.hide = function(){
		var btn = option.find('a[data-action=demo]');
		demo.isOpen && btn.click();
	}
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
					}, 400, 'easeOutExpo')
					frame.animate({
						'opacity' : !demo.isOpen ? 1 : 0,
						'margin-left' : !demo.isOpen ? '0' : '-200px'
					}, 800, 'easeOutExpo')
					break;
			}
			return false;
		}
	})
	demo.container.click(function(e){
		var t = e.target,
			m, act;
		if( t.tagName.toLowerCase()=='a' ){
			m = $(t);
			act = m.attr('data-action');
			if( act=='back' ){
				demo.hide();
				return false;
			}else if( act=='source' ){
				demo.source.show(m);
				return false;
			}
		}	
	})
	demo.source = function(){
		var win, button;
		function init(){
			win = new ui.win({
				width : '80%'
			});
			win.self.css('max-width','900px')
			button.data('win', win);
		}
		function str(fun){
			return typeof fun=='function' ? fun.toString().replace(/^function\s*\(\)\s*{/,'').replace(/\s*}$/,'\n').replace(/(\n)\s{4}/g,'$1') : '';
		}
		return {
			show : function(obj){
				win = obj.data('win');
				button = obj;
				!win && init();
				var item = demoAction.item[demo.index],
				html = [
					'<div style="height:500px;overflow:auto"><script type="text/templete" code="html">',
						'<!DOCTYPE html>',
						'<html>',
						'<head>',
						'<meta charset="utf-8" />',
						'<title>'+Menu.selected+'示例'+(demo.index+1)+'- nojs</title>',
						'<base href="http://nolure.github.io/nojs.docs/" />',
						'<link rel="stylesheet" href="css/ui.css" />',
						'<link rel="stylesheet" href="css/base.css" />',
						'<link rel="stylesheet" href="css/main.css" />',
						'<script src="src/nojs/noJS.js" data-config="global:[\'nojs/jquery\',\'nojs/ui\']" id="nojs"></ script>',
						'</head>',
						'<body>',
							demoAction.html ? demoAction.html.replace(/^\n*/,'') : '',
							item.content ? item.content.replace(/^\n*/,'') : '',
							'<script>'+str(item.callback||demoAction.callback)+'</ script>',
						'</body>',
						'</html>',
					'</script></div>',
				], code;
				win.setCon(Menu.selected+' - 示例'+(demo.index+1)+'源码',html.join('\n'));
				code = new codeLight({parent:win.con});
				win.show();
				//code.select();
			}
		}
	}();
	
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
			Menu = t;
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
			page.css('padding-left','14em');
			setMenu.display='show';
		}else{
			side.css('left','-15em');
			page.css('padding-left','0');
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
	fLink.append('<a href="http://nolure.com">blog: http://nolure.com</a>');
	
	return G;
});
