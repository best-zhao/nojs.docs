!function(){
	var debug = location.host!='nolure.github.io',
		_debug = /[?&]nojs-debug=(true|false)(?:&|$|#)/.exec(location.href);
	if( _debug ){
		debug = _debug[1]=='true' ? true : false;
	}
	noJS.config({
		base : debug ? 'src/' : 'js/',
		pack : !debug && {relative:true},
		global : location.href.indexOf('m.html')>0?['m/zepto','m/ui']:['nojs/jquery','nojs/ui'],
		page : 'main'
	});
}();
