define({
	
	'nojs' : {
		data : [
			{id:'noJS',text:'noJS模块管理',data:[
				{id:'noJS_info',text:'使用介绍',link:'noJS/index'},
				{id:'noJS_config',text:'参数配置',link:'noJS/config'},
				{id:'noJS_module',text:'模块',link:'noJS/module'},
				{id:'noJS_api',text:'接口',link:'noJS/api'}
			]},
			{id:'nj_ui',text:'ui组件',open:1,data:[
				{id:'ui_info',text:'说明',link:'ui/index'},
				{id:'tools',text:'jQuery扩展工具',link:'ui/tools'},
				
				{id:'ui_core',text:'核心ui组件',open:0,data:[
					{id:'ui_setPos',text:'ui.setPos',link:'ui/setpos'},
					{id:'ui_layer',text:'ui.layer',link:'ui/layer'},
					{id:'ui_win',text:'ui.win',link:'ui/win'},
					{id:'ui_msg',text:'ui.msg',link:'ui/msg'},
					{id:'ui_select',text:'ui.select',link:'ui/select'},
					{id:'ui_switch',text:'ui.Switch',link:'ui/switch'},
					{id:'ui_slide',text:'ui.slide',link:'ui/slide'},
					{id:'ui_menu',text:'ui.menu',link:'ui/menu'}
				]},
				{id:'ui_other',text:'扩展ui组件',open:0,data:[
					{id:'ui_scroll',text:'ui.scroll',link:'ui/scroll'},
					{id:'ui_code',text:'ui.code',link:'ui/code'}
				]}
			]},
			{id:'other',text:'其他常用模块',data:[
				{id:'drag',text:'drag',link:'module/drag'},
				{id:'form',text:'form表单验证',link:'module/form'},
				{id:'upload',text:'upload文件上传',link:'module/upload'},
					{id:'ui_tree',text:'tree',link:'module/tree'},
				{id:'color',text:'color取色器',link:'module/color'}
			]},
	
			{id:'test_page',text:'小测试',open:0,data:[
				{id:'impact',text:'html5碰撞小游戏',link:'test/impact'},
				{id:'imghot',text:'在线绘制图片热点',link:'test/imghot'}
			]}
		]
	}
});
