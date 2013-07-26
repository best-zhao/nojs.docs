/**
 * noJS 模块化管理js
 * 2013-3-6
 * nolure@vip.qq.com  
 */

(function( window, undefined ){
	var _noJS = window.noJS;
	if( _noJS && _noJS.version ){
		return;
	}
	
	var d = window.document,
		head = d.getElementsByTagName("head")[0],
		
		noJS = window.noJS = {
			version : '1.0'
		},
		//保存已载入的模块
		modules = {
			'start' : []//use入口回调
		},
		globalExports,//全局依赖接口
		//配置选项
		config = {
			queue : true,//默认为串行加载，false为并行加载
			fix : '.js'
		};
	
	//检测对象类型	
	function type( obj ){		
		return obj == null ? String( obj ) : Object.prototype.toString.call( obj ).slice( 8, -1 ).toLowerCase();
	}	
	
	/*
	 * 从队列中取出一组模块载入到页面中
	 */
	function load( file ){	
		var T = load,
			cf = T.now[2] || {},
			num = 0,
			len = file.length,
			src, s, m, i, j, q, isPack, _file;
			
		cf.base = typeof cf.base != 'undefined' ? cf.base : config.base;
		cf.fix = typeof cf.fix != 'undefined' ? cf.fix : config.fix;
		cf.queue = cf.queue===false ? false : config.queue;
		
		//整理数组
		for( i=len-1; i>=0; i-- ){
			m = T.getPath( cf.base, file[i] ) + cf.fix;
			
			if( modules[m] ){//清除已存在模块
				file.splice(i,1);
				end( null, 1, m );
				len--;
				continue;
			}else{
				modules[m] = { id : m };
			}
			//cf.queue!==true && append(m);//并行加载
		}
		len = file.length;
		if(!len){
			return;
		}
		
		isPack = config.pack && len>1;
		
		if( isPack ){
			_file = file;
			file = load.pack( file, cf );
			for( i=0; i<len; i++ ){
				_file[i] = T.getPath( cf.base, _file[i] ) + cf.fix;
			}
			len = 1;
		}
		
		num = 0;
		if( cf.queue===true ){
			loader(0);
		}
		
		function loader( index ){
			append( isPack ? file[index] : (T.getPath( cf.base, file[index] ) + cf.fix) );
		}
		
		function append( src ){
			T.point = isPack ? _file : src;
			//创建script
	        s = d.createElement("script");
	        s.async = true;
	        s.onload = s.onreadystatechange = function(){
        		if( /^(?:loaded|complete|undefined)$/.test(this.readyState) ){
        			end(this,1,src);
        		}
        	}
	        s.onerror = function(){
				end(this,2,src);
	        }
	        
	        s.src = src;
	        head.appendChild(s);//插入文件到head中
		}
		/*
		 * 单个文件载入完毕
		 * @state:1成功，2失败
		 */
		function end( s, state, src ){			
			num++;
			//文件加载完毕
			if(s){
				s.onreadystatechange = s.onload = s.onerror = null;
				head.removeChild(s);//载入完毕后清除script标记
			}
			if( num>=len ){
				T.now[1] && T.now[1]();//当前队列回调
				if( T.fileItem.length ){//继续下一个队列
					T.begin();
				}else{//所有队列执行完毕
					T.state = false;
					//console.log(modules['js/nojs/nojs.codelight.js'].exports);
				}
			}else if( cf.queue===true ){
				s && loader(num);
			}
			( s||state ) && check( modules[src] );
		}
	}
	/*
	 * 打包规则转换
	 * 将多个模块array转换成一个打包后的[url],file为string时反之
	 * pack = {
	 * 	  base : 'http://image.fantibody.com/min/?b=p&f=',
	 * 	  path : 'js/',
	 *    fix : '.js'
	 * }
	 */
	load.pack = function( file, cf ){
		var rect = [],
			pack = config.pack,
			i;
		if( type(file)=='array' ){
			for( i=0; i<file.length; i++ ){
				rect.push( load.getPath(pack.path, file[i]) + pack.fix );
			}
			rect = [ pack.base + rect.join(',') ];
		}else{
			
			
		}
		return rect;
	}
	
	load.fileItem = [];		//存放文件数组队列
	load.now = null;		//当前队列
	load.point = null;		//当前指向的模块
	load.state = false;
	/*
	 * 添加新文件及回调到队列组
	 * @file:Array
	 * @callback:文件加载完后回调
	 * @opt:文件配置信息，包括路径和后缀等，不设置则使用默认配置
	 * @order:添加顺序，默认是往队列后面追加 true表示添加到队列最前面，提前加载
	 */
	load.add = function( file, callback, opt, order ){
		var T = load;
		if( type(file)=='array' && file.length ){
			T.fileItem[order=='true'?'unshift':'push']( [ file, callback, opt ] );
			!T.state && T.begin();
		}
	}
	load.begin = function(){
		load.state = true;
		load.now = load.fileItem.shift();
		load( load.now[0] );
	}
	/*
	 * 寻址操作./上级目录
	 * 当base为空时，相对于当前页面，使用../表示上级
	 */
	load.getPath = function( base, path ){
		if(typeof path!='string'){return '';}
		var p1 = path.indexOf('./'),
			p2 = path.lastIndexOf('./'),
			n, len, s, i;
			
		if(p1!=0){//同级
			return base + path;
		}else if(p1==p2){//上一级
			n = 1;
		}else{
			n = p2/2+1;
		}
		s = base.indexOf('http') == 0 ? 3 : 1;
		base = base.split('/');
		path = path.replace(/\.\//g,'');
		len = base.length;
		
		if( len>s && len>n ){
			for( i=0; i<n+1; i++ ){
				base.pop();
			}
			base = base.join('/');
			base = base=='' ? '' : base+'/';
		}
		return base + path;
	}
	
	/*
	 * 引入依赖模块
	 * 同步模式：实际上该模块在外部模块的定义中已经被提前加载到页面中
	 * 这里只是获取数据接口
	 */
	function require( id ){
		var mod;
		id = load.getPath( config.base, id ) + config.fix;
		mod = modules[id];
		return mod && getExports(mod);
	}
	require.async = function(){//按需加载模块
		noJS.use.apply( null, Array.prototype.slice.apply(arguments) );
	}
	
	function parseRequire( code ){
		var ret = [],
			REQUIRE_RE = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g,
			SLASH_RE = /\\\\/g;
		code.replace( SLASH_RE, "" ).replace( REQUIRE_RE, function( m, m1, m2 ) {
			m2 && ret.push(m2);
		})
		return ret;
	}
	
	/*
	 * 模块定义
	 * @factory:工厂函数 提供一个参数require来引入模块 并返回数据接口
	 * 模块id使用其绝对路径
	 */
	window.define = function( factory ){
		var _type = type( factory ),
			current = type(load.point)=='array' ? load.point.shift() : load.point,//当前载入模块的uri
			_modules, exports;
			
		current = modules[current];
		current['factory'] = factory;
			
		if( _type=='function' ){
			//解析内部所有require并提前载入
			_modules = parseRequire( factory.toString() );
			if( _modules.length ){
				current['deps'] = [].concat( _modules );
				load.add( _modules, over, null, true );
			}else {
				over();
			}
			
		}else if( _type=='object' ){
			current['exports'] = factory;
		}
		
		function over(){
			check( current );
		}
	}
	
	function check( mod ){
		//mod.state = mod.state || 0;
		//mod.state++;
		
		//当最后一个依赖模块加载完毕时
		if( !load.state ){			
			var i, j, _mod, rect = [], call;
			for( i in modules ){
				_mod = modules[i];
				if( i=='start' || _mod.init ){
					continue;
				}
				
				_mod['factory'] && rect.push( _mod );
			}
			//从依赖关系的最末端开始初始化工厂函数并提取数据接口
			for( i=rect.length-1; i>=0; i-- ){
				_mod = rect[i];
				getExports(_mod);
			}
			
			//初始化noJS.use队列的回调
			while( modules['start'].length ){
				call = modules['start'].shift();
				call( depsToExports(call['deps']) );
			}
		}
	}
	
	//将所依赖模块转换成对应的接口
	function depsToExports( deps, global ){
		var _mod, j, rect = [];
		
		for( j=0; j<deps.length; j++ ){
			_mod = load.getPath( config.base, deps[j] ) + config.fix;
			_mod = modules[_mod];
			if(!_mod){
				continue;
			}	
			getExports(_mod);
			global ? globalExports.push(_mod['exports']) : rect.push(_mod['exports']);
		}
		return rect;
	}
	
	//获取单模块的数据接口
	function getExports( mod ){
		if(mod.init){
			return mod['exports'];
		}
		
		mod.init = true;
		var args = [require].concat( globalExports );		
		mod['exports'] = mod['exports']===undefined ? 
				( type(mod['factory'])=='function' ? mod['factory'].apply( null, args ) : mod['factory'] ) || {} : 
				mod['exports'];
				
		return mod['exports'];
	}
	
	//手动配置选项
	noJS.config = function( option ){
		var i;
		option = option || {};
		for( i in option ){
			config[i] = option[i];
		}
		//打包
		var pack = config.pack;
		if( pack ){
			if( type( pack ) != 'object' || typeof pack.base != 'string' ){
				pack = null;
			}else{
				pack.path = pack.path || '';
				pack.fix = pack.fix || config.fix;
			}
		}
		
		//设置全局依赖模块,会在其他模块之前引入
		var global = config.global;
		if( global ){
			global = typeof global=='string' ? [global] : global;
			if( type(global)=='array' ){
				
				globalExports = [];
				defaultLoad['deps'] = defaultLoad['gdeps'] = [].concat( global );
				
				load.add( global, function(){
					//保存全局依赖模块的接口
					depsToExports( defaultLoad['deps'], true );
				});
			}			
		}
		
		//设置整站各页面的入口模块
		//二维关联数组   域名=〉页面 主域名用main表示 首页index
		var page = config.page,
			href, host, hostReg, p, j;
		
		if( page ) {
			href = location.href;
			host = location.host;
			mainReg = new RegExp('^www.');//检测主域
			
			_host:
			for( i in page ){
				if( i=='main' && mainReg.test(host) || new RegExp('^'+i+'.').test(host) ){
					p = page[i];
					for( j in p ){
						if( j=='index' && new RegExp(host+'/$').test(href) || href.indexOf(j)>1 ){
							noJS.use( p[j] );
							break _host;
						}
					}
				}
				
			}			
		}		
		return noJS;
	}
	
	/*
	 * 载入入口模块，或者执行一段依赖入口模块(data-main)的代码块
	 */
	noJS.use = function( path, fun, opt ){
		var T = load,
			t = type(path);
		
		if( !path ){return noJS;}
		
		function call( exports ){			
			fun && fun.apply( null, exports );
		}
			
		if( t=='function' ){
			//第一个参数为funtion时，在整个依赖链就绪之后直接执行代码块
			fun = path;
			call['deps'] = [].concat( defaultLoad['gdeps'] );
			modules['start'].push(call);
			
			if( !load.state ){
				check();
			}			
		}else if( t=='array' || t=='string' ){//1/2个参数，添加模块,array
			t=='string' && ( path=[path] );//只添加一个模块 也可传入字符串
			
			if( type(fun)=='object' ){//无回调,参数2作为3使用
				opt = fun;
				fun = null;
			}
			//保存所依赖模块 
			defaultLoad['deps'] = defaultLoad['deps'].concat( path );
			call['deps'] = defaultLoad['gdeps'].concat( path );
			
			T.add( path, function(){
				modules['start'].push(call);
			}, opt );
		}
		return noJS;
	}
	
	var script = d.getElementsByTagName("script"),
		Len = script.length;
	//通过script标签的data-main来引入主模块
	//data-config设置配置选项
	function defaultLoad(){
		var i,s,
			T = load,
			_config, _modules;
		
		for(i=0;i<Len;i++){
			s = script[i];
			_modules = s.getAttribute('data-main');
			_config = s.getAttribute('data-config');
			if( _config || _modules ){
				//配置选项
				if( _config ){
					_config = _config ? eval( '({' + _config + '})' ) : {};
					noJS.config( _config );
				}
				//入口模块
				if( _modules ){
					_modules = _modules.split('|');
					defaultLoad['deps'] = defaultLoad['deps'].concat( _modules );
					T.add( _modules, null );
				}				
				break;
			}
		}		
	}
	
	defaultLoad['deps'] = [];
	
	!function(){
		//保存已载入模块
		var i, src, baseUrl;
		for(var i=0;i<Len;i++){
			src = script[i].src;
			if( src ){
				modules[ src ] = { id : src };
				//获取默认路径为noJS所在目录
				!baseUrl && (config.base = baseUrl = src.substring(0,src.lastIndexOf('/')+1));
			}
		}
	}();
	defaultLoad();
	
	
	//noJS本身也通过异步加载的方式
	if( _noJS && _noJS.args ){
		var methods = ["define", "config", "use"],
			args = _noJS.args;
		//console.log(args);	
		for ( var i = 0; i < args.length; i += 2 ) {
			noJS[methods[args[i]]].apply( noJS, args[i + 1] );
		}
	}
	
	
	/*
	 * bug记录
	 * 1.noJS.use(a);noJS.use(b);当模块a的依赖模块中存在b时，会出现错误(已解决,len--)
	 */
	
})( this );
