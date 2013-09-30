define({
	'nojs' : {
		data : [
			{id:'nojs_info',text:'nojs简介',link:'index'},
			{id:'noJS',text:'noJS模块管理',open:1,data:[
				{id:'noJS_info',text:'使用介绍',link:'noJS/index'},
				{id:'noJS_config',text:'参数配置',link:'noJS/config'},
				{id:'noJS_module',text:'模块',link:'noJS/module'},
				{id:'noJS_api',text:'接口',link:'noJS/api'},
				{id:'noJS_pack',text:'打包上线',link:'noJS/pack'}
			]},
			{id:'nj_ui',text:'ui组件',open:1,data:[
				{id:'ui_info',text:'说明',link:'ui/index'},
				{id:'tools',text:'jQuery扩展工具',link:'ui/tools'},
				
				{id:'ui_core',text:'核心ui组件',open:0,data:[
					{id:'ui_align',text:'ui.align',link:'ui/align'},
					{id:'ui_overlay',text:'ui.overlay',link:'ui/overlay'},
					{id:'ui_layer',text:'ui.layer',link:'ui/layer'},
					{id:'ui_popup',text:'ui.popup',link:'ui/popup'},
					{id:'ui_msg',text:'ui.msg',link:'ui/msg'},
					{id:'ui_select',text:'ui.select',link:'ui/select'},
					{id:'ui_switch',text:'ui.Switch',link:'ui/switch'},
					{id:'ui_slide',text:'ui.slide',link:'ui/slide'},
					{id:'ui_menu',text:'ui.menu',link:'ui/menu'},
					{id:'ui_ico',text:'ui.ico',link:'ui/ico'}
				]}
			]},
			{id:'other',text:'常用模块',open:1,data:[
				{id:'m_scroll',text:'scroll滚动',link:'module/scroll'},
				{id:'m_code',text:'code代码美化',link:'module/code'},
				{id:'drag',text:'drag',link:'module/drag'},
				{id:'form',text:'form表单验证',link:'module/form'},
				{id:'upload',text:'upload文件上传',link:'module/upload'},
				{id:'tree',text:'tree树形菜单',link:'module/tree'},
				{id:'color',text:'color取色器',link:'module/color'},
				{id:'face',text:'face表情选择',link:'module/face'},
				{id:'rate',text:'rate星级打分',link:'module/rate'},
				{id:'autocomplete',text:'autocomplete自动完成',link:'module/autocomplete'},
				{id:'email',text:'email邮箱自动补全',link:'module/email'},
				//{id:'calendar',text:'calendar日历',link:'module/calendar'},
				{id:'lazyload',text:'lazyload延迟加载',link:'module/lazyload'},
				{id:'lightbox',text:'lightbox',link:'module/lightbox'}
			]},
	
			{id:'test_page',text:'小测试',open:0,data:[
				{id:'impact',text:'html5碰撞小游戏',link:'test/impact'},
				{id:'imghot',text:'在线绘制图片热点',link:'test/imghot'}
			]}
		]
	},
	'mobile' : {
		data : [
			{id:'mb',text:'nojs.mobile',data:[
				{id:'mb_intro',text:'说明',link:'intro'},
				{id:'mb_ui',text:'ui',data:[
					{id:'mb_switch',text:'Switch选项卡',link:'switch'},
					{id:'mb_slide',text:'slide幻灯片',link:'slide'}
				]}
			]}
		]
	}
	
});
