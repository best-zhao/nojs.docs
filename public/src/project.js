define({
	'nojs' : {
		data : [
			{id:'nojs_info',text:'nojs简介',link:'index',parent:'-1'},
			{id:'noJS',text:'noJS模块管理',open:1,parent:'-1'},
    			{id:'noJS_info',text:'使用介绍',link:'noJS/index',parent:'noJS'},
                {id:'noJS_config',text:'参数配置',link:'noJS/config',parent:'noJS'},
                {id:'noJS_module',text:'模块',link:'noJS/module',parent:'noJS'},
                {id:'noJS_api',text:'接口',link:'noJS/api',parent:'noJS'},
                {id:'noJS_pack',text:'打包上线',link:'noJS/pack',parent:'noJS'},
            
			{id:'nj_ui',text:'ui组件',open:1,parent:'-1'},
			    {id:'ui_info',text:'说明',link:'ui/index',parent:'nj_ui'},
                {id:'ui_es6',text:'ES6扩展api',link:'ui/es6',parent:'nj_ui'},
                {id:'tools',text:'扩展工具',link:'ui/tools',parent:'nj_ui'},
                {id:'ui_core',text:'核心ui组件',open:1,parent:'nj_ui'},
                    {id:'ui_align',text:'ui.align',link:'ui/align',parent:'ui_core'},
                    {id:'ui_overlay',text:'ui.overlay',link:'ui/overlay',parent:'ui_core'},
                    {id:'ui_layer',text:'ui.layer',link:'ui/layer',parent:'ui_core'},
                    {id:'ui_popup',text:'ui.popup',link:'ui/popup',parent:'ui_core'},
                    {id:'ui_msg',text:'ui.msg',link:'ui/msg',parent:'ui_core'},
                    {id:'ui_select',text:'ui.select',link:'ui/select',parent:'ui_core'},
                    {id:'ui_switch',text:'ui.Switch',link:'ui/switch',parent:'ui_core'},
                    {id:'ui_slide',text:'ui.slide',link:'ui/slide',parent:'ui_core'},
                    {id:'ui_ico',text:'ui.ico',link:'ui/ico',parent:'ui_core'},
			
			{id:'other',text:'常用模块',open:1,parent:'-1'},
			    {id:'m_scroll',text:'scroll滚动',link:'module/scroll',parent:'other'},
                {id:'m_code',text:'code代码美化',link:'module/code',parent:'other'},
                {id:'drag',text:'drag',link:'module/drag',parent:'other'},
                {id:'form',text:'form表单验证',link:'module/form',parent:'other'},
                {id:'upload',text:'upload文件上传',link:'module/upload',parent:'other'},
                {id:'tree',text:'tree树形菜单',link:'module/tree',parent:'other'},
                {id:'color',text:'color取色器',link:'module/color',parent:'other'},
                {id:'face',text:'face表情选择',link:'module/face',parent:'other'},
                {id:'rate',text:'rate星级打分',link:'module/rate',parent:'other'},
                {id:'autocomplete',text:'autocomplete自动完成',link:'module/autocomplete',parent:'other'},
                {id:'email',text:'email邮箱自动补全',link:'module/email',parent:'other'},
                //{id:'calendar',text:'calendar日历',link:'module/calendar',parent:'other'},
                {id:'lazyload',text:'lazyload延迟加载',link:'module/lazyload',parent:'other'},
                {id:'lightbox',text:'lightbox',link:'module/lightbox',parent:'other'},
                {id:'page',text:'page',link:'module/page',parent:'other'},//capture
                {id:'resize',text:'resize',link:'module/resize',parent:'other'},
	
			{id:'test_page',text:'小测试',open:0,parent:'-1'},
			    {id:'impact',text:'html5碰撞小游戏',link:'test/impact',parent:'test_page'},
                {id:'imghot',text:'在线绘制图片热点',link:'test/imghot',parent:'test_page'}
		]
	},
	'mobile' : {
		data : [
			{id:'mb',text:'nojs.mobile',parent:'-1'},
			    {id:'mb_intro',text:'说明',link:'intro',parent:'mb'},
                {id:'mb_ui',text:'ui',parent:'mb'},
                    {id:'mb_switch',text:'Switch选项卡',link:'switch',parent:'mb_ui'},
                    {id:'mb_slide',text:'slide幻灯片',link:'slide',parent:'mb_ui'}
		]
	}
	
});
