/*
 * nojs.form 
 * 表单验证
 */
define(function( require, $, ui ){
	var form = function(btn,rules,opt){
		if(!btn.length||!rules){return;}
		this.opt = opt = opt || {};
		this.btn = btn;
		this.rules = rules;
		this.form = opt.form || btn.closest("form");//无form标签是，将opt.formSubmit设为false,opt.form指定相应的父容器对象
		if(!this.form.length){return;}
		this.item = [];//存储所需验证对象
		this.showIco = opt.showIco==false?false:true;//是否显示提示图标
		this.formSubmit = true;//是否为表单提交
		if( opt.form && opt.form.length || this.btn.attr('type')!='submit' ){
			this.formSubmit = false;
		}
		this.onSubmit = opt.onSubmit;//表单提交时事件
		this.onBeforeSubmit = opt.onBeforeSubmit;//表单验证前事件
		this.checkMode = opt.checkMode || 'submit';//验证模式 'blur/keyup'
		this.init();
	}
	
	form.prototype = {
		init : function( rules ){
			var m, i, j, name, rule, replace, type, _rule,
				T = this;
				
			//rules 传入新的规则重新初始化表单				
			this.rules = $.extend( true, {}, rules || this.rules );//copy副本
				
			this.item = [];
			for( i in this.rules ){
				rule = this.rules[i];
				name = $.trim(i);
				if( name.indexOf(' ')>0 ){//添加多个相同的规则
					name = name.split(' ');
					for (j=0; j<name.length; j++ ){
						add( name[j] );
					}
				}else{
					add( name );
				}
				if(rule.replace){
					delete rule.replace;
				}
			}
			function add(name){
				m = T.form.find("[name='"+name+"']");
				
				if(!m.length){return;}
				
				replace = rule.replace;
				if( replace ){//如果该对象为隐藏域或其他不可见的元素，可设置一个用于标记的替换元素
					replace = typeof replace === 'function' ? replace.call(m) : replace;
					m.data( 'replace', replace );
				}
				type = T.type(m);
				if( (type=='checkbox'||type=='radio') && rule['isNull']===undefined ){
					return;
				}
				T.item.push(m);
				
				if( type=='input' || type=='textarea' ){
					(function(m){
						//validate
						m.off('keyup.validate').on('keyup.validate',function(){
							m.data('state',false);
						})
						if( !T.formSubmit && T.type(m)=='input' ){//绑定回车提交事件
							m.off('keyup.validate').on('keyup.validate',function(e){
								e.keyCode==13 && T.btn.click();
							})		
						}
						if(m.attr('type')==='password'){//确认密码
							var c = rule['confirmPas'],//{name:确认密码name,empty:'为空时提示语',error:'错误提示语'}
								M,
								rName = 'rePas'+$.random();//使用随机名称，防止form.reg方法重名
							
							if( c && c['name'] ){
								M = T.form.find("[name='"+c['name']+"']");//确认密码对象
								m.off('keyup.validate').on('keyup.validate',function(){//再次修改新密码时
									m.data('state',false);
									M.data('state',false);
								})
								M.off('keyup.validate').on('keyup.validate',function(){
									M.data('state',false);
								})
								
								form.reg[rName] = function(v,opt,e){
									//确认密码验证函数
									if( m.val()==v ){
										return true;
									}else{
										return false;
									}
								}
								
								_rule = {isNull : typeof c['isNull']!='undefined' ? c['isNull'] : '请填写确认密码'};
								_rule[rName] = typeof c['error']!='undefined' ? c['error'] : '两次密码输入不一致'
								
								M.data('rule',_rule);
								M.data('state',false);
								T.item.push(M);
							}
						}
					})(m);
				}else if( type=='checkbox' || type=='radio' ){
					_rule = {};					
					_rule['isLength'] = rule['isLength'] || [];
					_rule['isLength'][0] = _rule['isLength'][0] || rule['isNull'];
					_rule['isLength'][1] = _rule['isLength'][1] || {};
					
					if( type=='radio' ){
						_rule['isLength'][1].min = 1;
					}else{
						_rule['isLength'][1].min = _rule['isLength'][1].min || 1;
					}
					rule = _rule;
				}
				m.data('rule',rule);//将验证规则存储在该对象中
				m.data('state',false);//将验证结果存储在该对象中
			}
			!rules && this.bind();
		},
		bind : function(){
			var M,A,type,T= this,state = true;
			//提交时验证
			this.form.submit(function(){
				if(!state){return false;}
				state = false;
				window.setTimeout(function(){
					state = true;
				},500)
				return T.submit(T.onSubmit);
			})
			
			if(!this.formSubmit){
				this.btn.click(function(){
					if(T.form[0].tagName.toLowerCase()=='form'){
						T.form.submit();
					}else{
						T.submit(T.onSubmit);
					}
					return false;//非表单提交时阻止表单默认行为
				})
			}			
			//输入或失去焦点时验证
			if( this.checkMode && (this.checkMode=='keyup'||this.checkMode=='blur') ){
				for(var i=0;i<T.item.length;i++){
					M = T.item[i];
					type = this.type(M);
					if( type=='input' || type=='textarea' ){
						if(this.checkMode=='keyup'){
							this.checkMode = 'keyup blur';
						}
						M.bind( this.checkMode, function(){
							m = $(this);
							clearTimeout(A);
							A = setTimeout(function(){
								T.check(m);
							},90);
						})
					}else if( type=='checkbox' || type=='select' ){
						M.on( "change", function(){
							T.check( $(this) );
						})
					}
				}
			}
		},
		type : function(e){
			/*
			 * 检测表单对象类型
			 */
			var tag = e[0].tagName.toLowerCase(),
				type = tag;
			if(tag=='input'){
				if(e.attr("type")=="checkbox"){
					type = "checkbox";
				}else if(e.attr("type")=="radio"){
					type = "radio";
				}else if(e.attr("type")=="hidden"){
					type = "hidden";
				}
			}
			return type;
		},
		check : function(m,isSubmit,_rule){
			/*
			 * 验证对象m
			 */
			if(!m.length){return true;}
			var T = this,
				n = _rule || m.data('rule'),
				t = false,
				v,
				M,
				tip = '',
				opt,
				s,group,
				type = this.type(m),
				state = form.state,
				reg = form.reg;
			if(!n){return true;}
			if( type=='checkbox' || type=='radio' ){
				v = m.filter(":checked").length;				
				
				M = n['isLength'];	
				tip = M[0];			
				opt = M[1];
				
				if( reg['isLength'](v,opt,m) ){
					t = true;
					this.showIco && state( m.last(), 'ok' );
				}else{
					t = false;
					this.showIco && state( m.last() , 'error', tip );
					m.last().focus();
				}
				m.data("state",t);
				return t;
			}
			v = m.val();
			if(typeof n.isNull=='undefined'){//选填项
				if((type=='input'||type=='textarea')&&v==''){
					m.data("state",true);
					//this.showIco && state(m);
					return true;
				}
			}
			if( (type=='input'||type=='textarea') && m.data("state")==true && v!='' ){
				//已符合规则，不用验证
				return true;
			}
			
					
			for(var j in n){
				M = n[j];
				
				if(reg[j]){//有效的规则
					if($.type(M)=='array'){
						if(M[0]){tip = M[0]};
						if(M[1]){opt = M[1]};
					}else{
						tip = M;
					}
					tip = typeof tip==='function' ? tip.call(m) : tip; 
					if(j=='remote'){//ajax验证
						//s = false;
						m.data("tip",tip);
						if(isSubmit){
							opt.callback = function(){
								T.submit(T.onSubmit);
							}
						}
					}
					
					if( type=='select' && v==0 ){
						s = false;
					}else{
						s = reg[j].call( T, v, opt, m );
					}
					
					if(s==true){//满足规则   /*传入3个参数：val,特殊匹配规则,匹配的元素
						t = true;
						this.showIco && state(m,'ok');
					}else if(s==false){//不满足规则
						this.showIco && state(m,'error',tip);
						isSubmit && m.focus();
						t = false;
					}else if(s=='pending'){//请求ing
						this.showIco && state(m,'pending','loading...');
						t = false;
					}
				}else{//无效的规则
					t = true;
				}
				if(t==false){break;}
			}
			m.data("state",t);
			return t;
		},
		submit : function(callback){
			
			/*
			 * 表单提交
			 */
			var m,state;
			if( this.onBeforeSubmit && !this.onBeforeSubmit() ){
				return false;
			}
			for(var i=0,n = this.item.length;i<n;i++){
				m = this.item[i];
				if(this.check(m,true)){
					continue;
				}else{
					return false;
				}
			}
			if(callback){
				return callback.call(this);
			}
		},
		reset : function(){
			//重置表单
			var form = this.form[0];
			if( form.tagName.toLowerCase()=='form' ){
				form.reset();
			}
			this.form.find('span.nj_f_tip').remove();
		}
	}
	
	//****公共方法及属性*****//
	form.state = function(m,s,tip){
		/*
		 * 对元素m标记其验证状态
		 * @m:对象
		 * @s:类别  'ok'/'error'/'pending'
		 * @tip:提示语
		 */
		tip = tip || '';
		var wrap = $('<span class="nj_f_tip"><span class="tip_ico"></span><span class="tip_con">'+tip+'</span></span>'),
			ico,
			t = wrap.find('span.tip_ico'),
			offset;
		s = s=='pending'?'loading':s;
		
		if( m.data('replace') ){
			m = m.data('replace');
		}
		offset = m.offset();
		m.siblings('.nj_f_tip').remove();
		m.after(wrap);
		//m[0].tagName.toLowerCase()=='input' && wrap.css('line-height',m.innerHeight()+'px');
		new ui.ico(t,{type:s});		
		wrap.addClass('nj_f_'+s);
	}
	form.reg = {
		/*
		 * 常用规则
		 */
		isNull : function(val){
			if(val.replace(/\s/g,"")!=""){return true;}else{return false;}
		},
		isEmail : function(val){
			var p=/^\w+(?:[-+.']\w+)*@\w+(?:[-.]\w+)*\.\w+(?:[-.]\w+)*$/;
	    	if(p.test(val)){return true;}else{return false;}
		},
		isQQ : function(val){//qq
			var p=/^\s*[.0-9]{5,10}\s*$/;
	    	if(p.test(val)){return true;}else{return false;}
		},
		isUrl:function(val){//验证输入是否是合法url地址
	        var p=/^(?:http(?:s)?:\/\/)?([\w-]+\.)+[\w-]+(?:\/[\w- .\/\?%&=]*)?$/;
	        if(p.test(val)){return true;}else{return false;}
	    },
		isMobile:function(val){//验证是否是合法的手机号码
		 	var p = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])[0-9]{8}$/;
			if(p.test(val)){return true;}else{return false;}
		},
		isTel:function(val){//验证是否是合法的座机号码
		 	var p = /^\d{2,5}?[-]?\d{5,8}([-]\d{0,1})?$/;
			if(p.test(val)){return true;}else{return false;}
		},
		isTel400:function(val){//验证是否是合法的400电话
		 	var p = /^(400)[-]?\d{3}[-]?\d{4}$/;
			if(p.test(val)){return true;}else{return false;}
		},
		isIdcard:function(val){//验证身份证号是否合法18位或17位带字母
			var p = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(?:\d|[a-zA-Z])$/;
			if(p.test(val)){return true;}else{return false;}
		},
		specialCode : function(val){//是否包含特殊字符
			if(!/^[\u4e00-\u9fa5\w]*$/.test(val)){
				return false;
			}else{
				return true;
			}
		},
		/*
		 * 判断字符长度是否合法 或者 判断类似checkbox的个数(val为数字)
		 * @options:必选参数，{min:最小长度,max:最大长度,其中的大于或小于都包含等于}
		 */
		isLength:function(val,options){
			if (!options) {return;}
			//计算字符个数，一个汉字计算为2个字符
			var strLength = function(a) {
				var L = 0;
				for(var i=0; i<a.length; i++) {
					if(/[\u4e00-\u9fa5]/.test(a.charAt(i))) {L+=2;}
					else {L+=1;}
				}
				return L;
			};
			var options=options,
				len = typeof val==='string' ? strLength(val) : typeof val==='number' ? val : 0,
				test = true;
			if(options.min){
				if(len<options.min){
					test = false;
				}
			}
			if(options.max){
				if(len>options.max){
					test = false;
				}
			}	
			return test;	
		},
		/*
	       	 验证输入是否是数字
	        @options:可选参数，{min:最小值,max:最大值,decimals:可以带几位小数,type:int整数}
	    */
		isNum:function(val,opt){
	        var opt = opt || {},
	        	p,
				test = !isNaN(val);
			if(opt.decimals){
				p = eval("/^-?\\d+(?:\\.\\d{1,"+opt.decimals+"})?$/");
				test = p.test(val);
			}	
	        if((opt.min||opt.min==0) && val<opt.min){
	            test = false;
	        }
	        if((opt.max||opt.max==0) && val>opt.max){
	            test = false;
	        }		
			if(opt.type=='int' && val.indexOf(".")!=-1){
				test = false;
			}
			if(val.lastIndexOf('.')==val.length-1){
				test = false;
			}
	    	return test;
	    },
		//ajax验证
		remote : function(val,param,element){
			var T = this,
				data;
			param = param || {};
			data = param.data = param.data || {};
			
			if( typeof param.data=='function' ){				
				data = param.data.call(this) || {};
			}
			
			if(param['name']){
				data[ param['name'] ] = val;
			}else{
				data[ element.attr("name") ] = val;
			}
			$.ajax({
				url : param.url,
				type : param.type || "get",
				data : data,
				dataType : param.dataType || "json",
				success : function(json){
					if(!json){return;}
					element.data( "remote", json );
					
					var tip = element.data("tip");
					
					if( json.state==1 || json.status==1 ||
					   param.check && param.check(json)//自定义返回数据是否符合
					){//ok
						element.data("state",true);
						form.state(element,'ok');
						param.callback && param.callback();//用于submit 返回成功后继续submit操作
						param.callback = null;
					}else{//error						
						element.data("state",false);
						if( element.data('replace') ){
							element = element.data('replace');
						}
						form.state( element, 'error', json.msg || tip );
					}
				}
			})
			return 'pending';
		}
	}
	
	return form;
});
