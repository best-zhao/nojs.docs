!function(){
	var debug = location.host!='nolure.github.io',
		_debug = /[?&]nojs-debug=(true|false)(?:&|$|#)/.exec(location.href),
		mobile = location.href.indexOf('m.html')>0;
	if( _debug ){
		debug = _debug[1]=='true' ? true : false;
	}
	if( mobile ){
	    window.Page = 'mobile';
	}
	noJS.config({
		base : debug ? 'src/' : 'js/',
		pack : !debug && {relative:true},
		global : mobile ? ['m/zepto','m/ui'] : ['nojs/jquery','nojs/ui'],
		page : 'main'
	});
}();
