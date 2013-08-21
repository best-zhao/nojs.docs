!function(){
	var debug = location.host!='nolure.github.io', 
	options = {
		base : 'dest/',
		pack : true,
		global : ['nojs/jquery','nojs/ui'],
		page : 'main'	
	};
	if( debug ){
		options.base = 'js/';
		options.pack = false;
	}
	noJS.config(options);
}();
