!function(){
	var debug = location.host!='nolure.github.io' || /[?&]nojs-debug=true/.test(location.href);
	noJS.config({
		base : debug ? 'js/' : 'dest/',
		pack : !debug && true,
		global : ['nojs/jquery','nojs/ui'],
		fix : '.js?t='+(+new Date),
		page : 'main'
	});
}();
