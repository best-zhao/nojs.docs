/*
 * email邮箱自动补全
 * nolure@vip.qq.com
 * 2013-8-30
 */
define(function(require,$){
	var autocomplete = require('nojs/module/autocomplete'),
		Email = [
			'qq.com',
			'163.com',
			'126.com',
			'vip.qq.com',
			'gmail.com',
			'sina.cn',
			'hotmail.com',
			'sohu.com',
			'189.cn',
			'yahoo.com',
			'yahoo.com.cn'
		];
	
	function email( text, options ){
		var data;
		options = options || {};
		data = options.data || Email;
		
		new autocomplete( text, {
			rule : rule,
			rewriteOnMove : false
		});
		
		function rule(value){
			var i=0, n = data.length, html = '', m;
				
			if( !value ){return html;}
			value = value.split('@');
			
			for( ; i<n; i++ ){
		        m = data[i];
		        if( value[1] ){
		        	if( m.indexOf(value[1])==0 ){
		        		html += '<dd>'+value[0]+'@'+m+'</dd>';
		        	}
		        }else{
		        	html += '<dd>'+value[0]+'@'+m+'</dd>';
		        }
		    }
		    return html;
		}
	}	
	
	
	return email;
});
