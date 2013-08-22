!function(){
	var debug = location.host!='nolure.github.io' || location.href.split('?')[1].indexOf('debug=true')>0;
	noJS.config({
		base : debug ? 'js/' : 'dest/',
		pack : !debug && true,
		global : ['nojs/jquery','nojs/ui'],
		fix : '.js'+(+new Date),
		page : 'main'
	});
}();
