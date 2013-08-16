define(function( require, $ ){
	
	//每月第一天星期几
	function getDay(){
		return new Date(2013,7,1).getDay();
	}
	
	//每月最后一天几号
	//下个月的0号，就是返回本月份最后一天的date 
	function getDate(){
		return new Date(2013,8,0).getDate();
	}
	
	
	
});
