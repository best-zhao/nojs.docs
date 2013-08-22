!function(){
	var debug = location.host!='nolure.github.io',
		_debug = /[?&]nojs-debug=(true|false)(?:&|$|#)/.exec(location.href);
	if( _debug ){
		debug = _debug[1]=='true' ? true : false;
	}
	noJS.config({
		base : debug ? 'js/' : 'dest/',
		pack : !debug && true,
		global : ['nojs/jquery','nojs/ui'],
		fix : '.js?t='+(+new Date),
		page : 'main'
	});
}();
