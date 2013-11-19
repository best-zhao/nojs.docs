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
        pathMap = {},//require中模块标识和完整路径的对应
        entrance = [],//入口id
        globalExports = [],//全局依赖接口
        //配置选项
        config = {
            queue : true,//默认为串行加载，false为并行加载
            fix : '.js'
        },
        //noJS本身加载完成之后的回调函数
        onReady,
        //标示全局模块加载完成，默认true表示不设置全局模块
        globalReady = true,
        configFile = 0;
    
    //检测对象类型    
    function type( obj ){       
        return obj == null ? String( obj ) : Object.prototype.toString.call( obj ).slice( 8, -1 ).toLowerCase();
    }   
    
    /*
     * 从队列中取出一组模块载入到页面中
     */
    function load( file ){  
        
        var T = load,
            cf = T.now[2],
            num = 0,
            len = file.length,
            _len = len,
            _entrance = file.entrance,
            i, m;
            
        cf.queue = cf.queue===false ? false : config.queue;
        
        //整理数组
        for( i=len-1; i>=0; i-- ){
            m = file[i];
            if( modules[m] ){//清除已存在模块
                file.splice(i,1);
                end( null, 1, m );
                len--;//end函数中会和num比较
                continue;
            }else{
                modules[m] = { id : m };
                if( _entrance ){
                    modules[m].entrance = _entrance;
                }
            }
            //cf.queue!==true && append(m);//并行加载
        }
        len = file.length;
        if(!len){
            return;
        }
        if( _entrance ){
            if( entrance[_entrance] ){
                entrance[_entrance].branch += len-_len;//减去重复模块
            }else if( T.now[1] ){
                entrance[_entrance] = {branch:len, callback:T.now[1]};//记录该组分支数 回调 
                T.now[1] = null; 
            }
            
        }
        //打包时 指向真实的模块
        if( file.point ){
            for( i=0; i<file.point.length; i++ ){
                m = file.point[i];
                modules[m] = {id:m};
            }
        }
        
        num = 0;
        cf.queue===true && loader(0);
        
        function loader( index ){
            append( file[index] );
        }
        
        function append( src ){
            T.point = file.point ? file.point : src;
            //创建script
            var s = d.createElement("script");
            s.async = true;
            
            T.event( s, function(){
                end(this,1,src);
            }, function(){
                end(this,2,src);
            })
            
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
                head.removeChild(s);//载入完毕后清除script标记
            }
            if( _entrance && entrance[_entrance]  ){
                if( !modules[src].cmd ){//存在非标准模块
                    entrance[_entrance].branch--;
                    if( entrance[_entrance].branch<=0 ){
                        T.now[1] = entrance[_entrance].callback;
                        entrance[_entrance] = null;
                    }
                }
            }
            if( num>=len ){
                //当前队列回调
                T.callback(T.now[1]);
                if( T.fileItem.length>0 ){//继续下一个队列
                    T.begin();
                }else{//所有队列执行完毕
                    T.state = false;
                }
            }else if( cf.queue===true ){
                s && loader(num);
            }
        }
    }
    
    load.fileItem = [];     //存放文件数组队列
    load.now = null;        //当前队列
    load.point = null;      //当前指向的模块
    load.state = null;
    /*
     * 添加新文件及回调到队列组
     * @file:Array
     * @callback:文件加载完后回调
     * @opt:文件配置信息，包括路径和后缀等，不设置则使用默认配置
     * @order:添加顺序，默认是往队列后面追加 /  true表示添加到队列最前面，提前加载
     */
    load.add = function( file, callback, opt, order ){
        var T = load;
        if( type(file)=='array' && file.length ){
            opt = opt || {};
            T.fileItem[order==true?'unshift':'push']( [ file, callback, opt ] );
            !T.state && T.begin();
        }
    }
    load.begin = function(){
        if( configFile==2 && (load.fileItem[0] && !load.fileItem[0][2].state) ){//配置文件正在载入，暂停队列   state标示为配置文件本身
            return;
        }
        load.state = true;
        load.now = load.fileItem.shift();
        load( load.now[0] );
    }
    /*
     * 寻址操作
     * 1.标准路径：以设置的基址来查找模块
     * 2.相对路径： ./同级目录 ../上级目录   模块中相对当前模块(require和require.async) use中相对路径为普通路径
     * 3.普通路径：不做任何处理 直接加载该路径 以'http'或'/'开头
     */
    load.resolve = function(path, ptype){
        var _type = type(path);
        ptype = ptype || 0;//0标准路径 1相对路径 2普通路径
        
        if( _type == 'array' ){
            var rect = [], i;
            for( i=0; i<path.length; i++ ){
                rect.push( load.resolve(path[i]) );
            }
            return rect;
        }
        if( _type != 'string' || !path.length ){
            return '';
        }
        if( pathMap[path] ){
            return pathMap[path];
        }
        var base = load.point,
            fix = config.fix;
            
        if( /\?|#/.test(path) ){
            path = path.replace(/#$/, '');
            fix = '';
        }
        if( /^(http|\/|file)/.test(path) ){
            return path+fix;
        }
        if( /^\.\//.test(path) ){//同级目录
            path = path.replace(/^\.\//, '');
            path = ptype==0 ? base.split('/').slice(0,-1).join('/')+'/'+path : path;
            return path+fix;
        }
        
        if( !/^\.{2}\//.test(path) ){//标准路径
            return config.base+path+fix;
        }
        
        //相对路径 ../开头
        if( ptype==2 ){//相对当前页面
            return path+fix;
        }
        //相对require所在模块   需先获取当前模块路径
        var p1 = path.indexOf('../'),
            p2 = path.lastIndexOf('../'),
            s = base.indexOf('http') == 0 ? 3 : 1,
            level = p2/3+1;
            
        base = base.split('/');
        path = path.replace(/^\.{2}\//,'');
        len = base.length;
        
        if( len>s && len>level ){
            for( i=0; i<level+1; i++ ){
                base.pop();
            }
            base = base.join('/');
            base = base=='' ? '' : base+'/';
        }else{
            return base[0]+'/'+path+fix;
        }
        return base + path + fix;
    }
    load.event = function( script, success, error ){
        script.onload = script.onreadystatechange = function(){
            if( /^(?:loaded|complete|undefined)$/.test(this.readyState) ){
                success && success.call(this);
                call(this);
            }
        }
        script.onerror = function(){
            error && error.call(this);
            call(this);
        }
        function call(s){
            s.onreadystatechange = s.onload = s.onerror = null;
        }
    }
    load.callback = function(call){
        call && call( depsToExports(call.deps) );
    }
    
    /*
     * 引入依赖模块
     * 同步模式：实际上该模块在外部模块的定义中已经被提前加载到页面中
     * 这里只是获取数据接口
     */
    function require( id ){
        var mod;
        id = load.resolve( id );
        mod = modules[id];
        return mod && getExports(mod);
    }
    require.async = function(){//按需加载模块
        var mod = arguments[0],
            call = arguments[1],
            options = arguments[2] || {};
        options.async = true;
        noJS.use(mod ,call, options);
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
    window.define = function(){
        //console.log(load.point)
        var args = Array.prototype.slice.call(arguments),
            factory = args.slice(-1)[0],
            _type = type( factory ),
            current = type(load.point)=='array' ? load.point.shift() : load.point,//当前载入模块的uri
            _modules, _modules_, length, exports, _entrance, _entranceID, call;
        
        current = modules[current];
        current.factory = factory;
        current.cmd = 1;//标示标准模块
        
        _entranceID = current.entrance;
        if( _entranceID ){
            _entrance = entrance[_entranceID];
        }
        function check(step){
            step = step || 0;
            if( _entrance ){
                _entrance.branch += step-1;
                //console.log(_entrance.branch, step)
                if( _entrance.branch<=0 ){//该入口模块整个依赖链加载完毕
                    load.callback(_entrance.callback);
                    _entrance = null;
                }
            }
        }
        
        if( _type=='function' ){
            //解析内部所有require并提前载入
            _modules_ = parseRequire( factory.toString() );
            _modules = load.resolve(_modules_);
            length = _modules.length;
           
            if( length ){
                var i, m, relative; 
                for( i=0; i<length; i++ ){
                    pathMap[_modules_[i]] = _modules[i];
                }
                current.deps = [].concat( _modules );
                
                function add(){
                    length = _modules.length;
                    if( _entrance ){//整个依赖链都要关联该id
                        _modules.entrance = _entranceID;
                    }
                    length && load.add(_modules);
                }
                //设置打包后，当前模块所依赖模块会并入自身
                if( config.pack ){
                    if( typeof load.point == 'string' ){
                        load.point = []; 
                        //config.pack.relative只合并相对路径
                        //非相对路径 !/^\.{1,2}\// 过滤出来 加载模块
                        
                        function push(m,i){
                            if( modules[m] ){
                                _modules_.splice(i,1);
                                return;
                            }
                            modules[m] = {id : m};
                            if( _entrance ){
                                modules[m].entrance = _entranceID;
                            }
                        }
                        for( i=0; i<length; i++ ){
                            m = _modules[i];
                            relative = config.pack.relative && /^\.{1,2}\//.test(_modules_[i]);//相对路径
                            load.point.push(m);
                            if( modules[m] || relative ){
                                _modules.splice(i,1);
                                i--;
                                length--;
                                push(m,i);
                                continue;
                            }
                            if( config.pack.relative && !relative ){//非相对路径
                                load.point.pop(); 
                            }else{
                                push(m,i);
                            }
                        }
                        add();
                    }
                }else{
                    add();
                }
            }
        }else{
            current.exports = factory;
        }
        check(_modules_ && _modules_.length);
    }
    define.cmd = true;
    define.resolve = load.resolve;
    
    function done(){}
    done.use = function(){
        //初始化 使用use执行代码块 队列回调  全局模块就绪后执行
        var call;
        while( modules['start'].length ){
            load.callback( modules['start'].shift() );
        }
    }
    
    //将所依赖模块转换成对应的接口
    function depsToExports( deps, global ){
        var _mod, j, rect = [];
        if( !deps ){
            return rect;
        }
        for( j=0; j<deps.length; j++ ){
            _mod = modules[deps[j]];
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
            return mod.exports;
        }
        mod.init = true;
        var args = [require].concat( globalExports );
        mod.exports = mod.exports===undefined ? 
                ( type(mod.factory)=='function' ? mod.factory.apply( null, args ) : mod.factory ) || {} : 
                mod.exports;
                
        return mod.exports;
    }
    
    //手动配置选项
    noJS.config = function( option ){
        option = option || {};
        
        if( !option.pack && configFile==1 ){//配置文件为外部调用，载入之前禁用配置全局，避免重复
            return;
        }
        
        if( !option.pack && onReady ){
            //线上模式时，模板中引入的noJS.js是合并了conf.js的，当切换到开发模式时，noJS的路径并不容易切换，所以需要阻止noJS.config的执行(只限于修改了conf.js而没有重新构建的情况下)
            //return;
        }
        
        var i;
        for( i in option ){
            config[i] = option[i];
        }
        configFile = null;
        
        
        //设置全局依赖模块,会在其他模块之前引入，只能设置一次
        var global = config.global;
        if( !globalExports.length && global ){
            global = typeof global=='string' ? [global] : global;
            globalReady = null;
            if( type(global)=='array' ){
                global = load.resolve(global);
                init.deps = init.gdeps = [].concat( global );
                //打包后，全局依赖模块都并入第一个文件,并使用point指向真实的模块
                if( config.pack ){
                    var _global = global, m;
                    global = global.slice(0,1);
                    global.point = _global;
                }
                load.add( global, function(){
                    //保存全局依赖模块的接口
                    depsToExports( init.deps, true );
                    globalReady = true;
                    done.use();
                }, null, true);
            }           
        }
        
        //设置整站各页面的入口模块
        //二维关联数组   域名=〉页面 主域名用main表示 首页index
        var page = config.page,
            href, host, mainReg, hostReg, p, j;
        
        if( page ) {
            if( typeof page=='string' ){
                noJS.use( page );
                return noJS;    
            }
            href = location.href.split(/[#?]/)[0]; 
            host = location.host;
            mainReg = (function(){
                return /^www[\.]/.test(host) || host.indexOf('.')==host.lastIndexOf('.');
            })();//主域
            hostReg = new RegExp(host.replace(/\./g,'\\.')+'/$').test(href);//检测域名首页
            
            _host:
            for( i in page ){
                if( i=='main' && mainReg || new RegExp('^'+i+'[\.]').test(host) ){
                    p = page[i];
                    for( j in p ){
                        if( j=='index' && hostReg || href.indexOf(j)>1 ){
                            noJS.use( p[j] );
                            break _host;
                        }
                    }
                }
                
            }           
        }       
        return noJS;
    }
    
    var defer = [];
    /*
     * 载入入口模块，或者执行一段依赖全局模块的代码块
     */
    noJS.use = function( path, fun, opt ){
        if( configFile==2 && defer ){
            defer.push(Array.prototype.slice.call(arguments));
            return noJS;
        }
        
        var T = load,
            t = type(path);
        
        if( !path ){return noJS;}
        
        function call( exports ){
            exports = opt && opt.async && exports ? exports.slice(globalExports.length,exports.length) : exports;//opt.async按需加载模块 只返回当前模块接口 
            fun && fun.apply( null, exports );
        }
            
        if( t=='function' ){
            //第一个参数为funtion时，在整个依赖链就绪之后直接执行代码块
            fun = path;
            call.deps = [].concat( init.gdeps );
            modules.start.push(call);
            globalReady && done.use();
                    
        }else if( t=='array' || t=='string' ){//1/2个参数，添加模块,array
            t=='string' && ( path=[path] );//只添加一个模块 也可传入字符串
            
            if( type(fun)=='object' ){//无回调,参数2作为3使用
                opt = fun;
                fun = null;
            }
            //保存所依赖模块 
            path = load.resolve(path, opt && opt.async ? 0 : 1);
            init.deps = init.deps.concat( path );
            call.deps = init.gdeps.concat( path );
            
            var eid = entrance.length+'';//toString
            path.entrance = eid;
            entrance[eid] = null;//占位
            
            T.add(path, call, opt);
        }
        return noJS;
    }
    
    var script = d.getElementsByTagName("script"),
        Len = script.length,
        nojsScript = d.getElementById('nojs') || script[Len-1];
    
    function getSrc(node){
        return node.hasAttribute ? node.src : node.getAttribute("src", 4);
    }
        
    //通过script标签的data-main来引入主模块
    //data-config设置配置选项
    function init(){
        var i,
            T = load,
            nojsSrc = getSrc(nojsScript),
            _modules = nojsScript.getAttribute('data-main'),
            _config = nojsScript.getAttribute('data-config');
        
        config.base = nojsSrc.split('/').slice(0,-2).join('/')+'/';
        
        if( _config || _modules ){
            //配置选项
            if( _config ){
                if( /\.js$/.test(_config) ){
                    configFile = 1; //
                    //该事件会在nojs脚本加载完成之后触发
                    //打包之后config.js会并入noJS.js
                    onReady = function(){
                        if( !config.pack ){
                            configFile = 2; //配置文件正在载入
                            T.add( [load.resolve(_config+'#')], function(){
                                //配置文件加载完毕
                                if( defer ){
                                    for( var i=0; i<defer.length; i++ ){
                                        noJS.use.apply(null, defer[i]);
                                    }
                                    defer = null;
                                }
                            }, {state:true} );
                        }
                        onReady = null;
                    }
                    T.event( nojsScript, onReady);
                }else{
                    _config = eval( '({' + _config + '})' );
                    noJS.config( _config );
                }
            }
            //入口模块
            if( _modules ){
                _modules = load.resolve( _modules.split(',') );
                init.deps = [].concat( _modules );
                T.add( _modules );
            }
        }       
    }
    
    init.deps = [];
    init.gdeps = [];//保存全局依赖模块
    
    !function(){
        //保存已载入模块
        var i, src, baseUrl;
        for( i=0; i<Len; i++ ){
            src = getSrc( script[i] );
            if( src ){
                modules[ src ] = { id : src };
                //获取默认路径为noJS所在父目录
                //!baseUrl && ( config.base = baseUrl = src.split('/').slice(0,-2).join('/')+'/' );
            }
        }
    }();
    init();
    
    //noJS本身也通过异步加载的方式
    if( _noJS && _noJS.args ){
        var methods = ["define", "config", "use"],
            args = _noJS.args;      
        for ( var i = 0; i < args.length; i += 2 ) {
            noJS[methods[args[i]]].apply( noJS, args[i + 1] );
        }
    }   
    
    /*
     * bug记录
     * 1.noJS.use(a);noJS.use(b);当模块a的依赖模块中存在b时，会出现错误(已解决,len--)
     * 2.载入外部配置文件的时候，use方法先缓存起来，文件载入完毕后再执行，防止use执行于配置之前
     * 3.ie9缓存配置文件导致出错
     * 4.解决相对路径模块的接口问题，原因是在获取完整路径时使用了全局配置，导致无法正确匹配模块。解决后将模块配置连同自身一起保存在modules对象中
     * 5.优化use方法：执行代码块不必等整个依赖链都加载完毕才执行，而是全局模块就绪即可
     * 6.由5导致的bug，载入入口模块a，a依赖b,当a完成而b正在载入时，后续use执行的代码块会直接触发done.use方法，导致前面入口模块a的回调一同执行，所以报错。优化后，回调会在该条入口模块链都完成后执行，添加全局变量entrance
     * 7.修正6导致的bug，加载非标准模块的回调问题  没有减去重复模块分支数的问题   entrance占位应该在use方法中就执行
     * 8.修正打包后的bug，去除函数done，回调函数全部在define中执行（非标准模块除外）
     * 9.更改寻址操作load.getPath>load.resolve 路径转换全部改为load之前 去除use方法的单独配置功能
     */
    
})( this );