!function(){
	var debug = location.host!='nolure.github.io',
		url = location.href.split('?')[1];
	if( url && url.indexOf('debug=true')>0 ){
		debug = true;
	}	
	console.log(1)
	noJS.config({
		base : debug ? 'js/' : 'dest/',
		pack : !debug && true,
		global : ['nojs/jquery','nojs/ui'],
		fix : '.js?t='+(+new Date),
		page : 'main'
	});
}();
