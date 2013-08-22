!function(){
	var debug = location.host!='nolure.github.io' || location.url.split('?')[1].indexOf('debug=true')>0;
	
	noJS.config({
		base : debug ? 'js/' : 'dest/',
		pack : !debug && true,
		global : ['nojs/jquery','nojs/ui'],
		page : 'main'	
	});
}();
