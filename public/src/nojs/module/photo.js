/*
 * 图片播放器
 * nolure@vip.qq.com
 * 2013-9-10
 */
define(function( require, $, ui ){
    var fullscreen = require('nojs/module/fullscreen');
	function imgPreLoad(){
		var list = [], intervalId = null,
		// 用来执行队列
		tick = function () {
			var i = 0;
			for (; i < list.length; i++) {
				list[i].end ? list.splice(i--, 1) : list[i]();
			};
			!list.length && stop();
		},
	
		// 停止所有定时器队列
		stop = function () {
			clearInterval(intervalId);
			intervalId = null;
		};
		return function(url,ready,load,error){
			var onready, width, height, newWidth, newHeight,
				img = new Image();	
			img.src = url;	
			// 如果图片被缓存，则直接返回缓存数据
			if (img.complete) {
				ready.call(img);
				load && load.call(img);
				return;
			};
	
			width = img.width;
			height = img.height;
	
			// 加载错误后的事件
			img.onerror = function () {
				error && error.call(img);
				onready.end = true;
				img = img.onload = img.onerror = null;
			};
	
			// 图片尺寸就绪
			onready = function () {
				newWidth = img.width;
				newHeight = img.height;
				if (newWidth !== width || newHeight !== height ||
					// 如果图片已经在其他地方加载可使用面积检测
					newWidth * newHeight > 1024
				) {
					ready.call(img);
					onready.end = true;
				};
			};
			onready();
	
			// 完全加载完毕的事件
			img.onload = function () {
				// onload在定时器时间差范围内可能比onready快
				// 这里进行检查并保证onready优先执行
				!onready.end && onready();	
				load && load.call(img);	
				// IE gif动画会循环执行onload，置空onload即可
				img = img.onload = img.onerror = null;
			};
			// 加入队列中定期执行
			if (!onready.end) {
				list.push(onready);
				// 无论何时只允许出现一个定时器，减少浏览器性能损耗
				if (intervalId === null) {
					intervalId = setInterval(tick, 40);
				}
			};
		}		
	};
	
	function player(id, options){
		this.box = typeof id=='string' ? $('#'+id) : id;
		//if(!this.box.length){return;}
		this.options = options = options||{};
		//this.tag = options.tag || 'img';
		this.item = this.box.find('.pic_list .list').children();
		this.length = this.item.length;
		this.wrap = options.wrap || this.box;
		this.full = null;//全屏对象
		this.index = options.index || 0;
		this.type = options.type;
		this.init();
	}
	player.prototype = {
		init : function(){
			var T = this;
			this.content = this.wrap.children('.content');
			this.info = this.wrap.children('.info');
			this.img = this.wrap.find('.img');	
			this.close = this.wrap.find('.close');
			this.loading = this.wrap.find('.loading');
			this.ready = imgPreLoad();
			this.image = $('<img src="" />');
			this.bind();
		},
		bind : function(){
			var T = this,i, width = 0;
			
			for( var i=0; i<this.length; i++ ){
			    width += this.item.eq(i).outerWidth(true);
			}
			this.info.find('.pic_list .list').width(width);
            this.number = this.wrap.find('.num');
            this.number.find('i').text( this.length );
            
			this.page = this.wrap.find('i.p').css({'opacity':'0.4'});
			this.createPageIco(this.page);
			
			this.page.click(function(e){
				e.preventDefault();
				T.load( $(this).hasClass('prev') ? --T.index : ++T.index );
			}).hover(function(){
				$(this).is(':visible') && $(this).stop().fadeTo(200,1);
			},function(){
				$(this).is(':visible') && $(this).stop().fadeTo(200,0.2);
			})
			this.wrap.click(function(e){
                var t = e.target,
                    tag = t.tagName.toLowerCase(),
                    open, act, m,
                    height, p;
                if( tag=='a' ){
                    m = $(t);
                    act = m.attr('data-action');
                    if( act=='full' ){//全屏
                        if( !T.full ){
                            var options = $.extend({}, T.options);
                            options.onChange = function(index){
                                T.load(index);
                            }
                            T.full = new lightbox(T.box, options);
                        }
                        T.full.show(T.index);
                    }else if( act=='full_screen' ){
                        height = $(window).height();
                        if( !p ){
                            p = T.content.height()/height;
                        }
                        T.fullScreen = T.fullScreen ? null : true;
                        T.content.animate({
                            'height' : T.fullScreen ? height : height*p
                        }, 200, function(){
                            if( T.fullScreen ){
                                T.content.height('100%');
                            }else{
                                T.content.removeAttr('style');
                            }
                            T.load(T.index, true);
                        });
                        T.close.hide();
                        m.text(T.fullScreen?'退出全屏':'全屏')
                        
                    }else if( act=='close' ){
                        T.hide();
                    }
                    return false;
                }
            })
			this.item.each(function(i){
                var m = $(this);
                (function(i){
                    m.click(function(){
                        T.load(i);
                        return false;
                    })
                })(i);
            });
			this.type!='lightbox' && this.load(this.index);
		},
		createPageIco : function(page){
			function draw(D){
				var w = this.width,
					h = this.height,
					ctx = this.ctx,
					point;
				
				if(this.hasCanvas){
					ctx.lineWidth = 7;
					ctx.strokeStyle = '#000';
				}else{
					this.canvas = $('<i></i>');
					this.ico.append(this.canvas);
					this.color = '#BABABA';
				}
				point = D=='prev'?[0.8*w,0,0.1*w,0.5*h,0.8*w,h]:[0.2*w,0,0.9*w,0.5*h,0.2*w,h];
				this.drawLine(point,false,3);
				if(this.hasCanvas){
					ctx.lineWidth = 5;
					ctx.strokeStyle = 'rgba(255,255,255,0.7)';
				}else{
					this.color = '#000000';
				}
				this.drawLine(point,false,4);
			}
			ui.ico.prototype['Drawprev'] = function(){
			    draw.call(this,'prev');
			}
			ui.ico.prototype['Drawnext'] = function(){
                draw.call(this,'next');
            }
			var options = {type:'prev',width:50,height:110,color:'#000000',bgcolor:'#cccccc'};
			
			new ui.ico(page.eq(0),options);
			options.type='next';
			new ui.ico(page.eq(1),options);
			
			options.width = 18;
            options.height = 36;
            new ui.ico(page.eq(3),options);
            options.type='prev';
            new ui.ico(page.eq(2),options);
			
			new ui.ico(this.loading, {type:'loading',color:'#006CFF',width:48,height:48});
			new ui.ico(this.close, {type:'close',bgcolor:'#999',color:'#000',width:32,height:32});
			//new ui.ico(this.info.find('a[data-action=close]'), {type:'close'});
		},
		srcRule : function(src,obj){
			if(this.options.srcRule){
				return this.options.srcRule(src,obj);
			}else{
				return src;
			}
		},
		//@resize:改变窗口大小时
		load : function(index, resize){
			index = index>this.length-1 ? 0 : index;
			index = index<0 ? this.length-1 : index;
			
			if( resize ){
				this.setCenter(this.image[0]);
				return;
			}
			
			var T = this,
				obj = $(this.item[index]),
				src, small;
			
			if(!obj.length){
				return;
			}	
			
			if( obj[0].tagName.toLowerCase()!='img' ){
				obj = obj.find('img');
				if(!obj.length){
					return;
				}
			}
			
			if( !this.img.find('img').length ){
				this.img.show();
				this.img.append(this.image);
			}
			
			src = obj.attr('src');
			
			var small = this.info.find('.wrap img');             
            this.info.find('.wrap').stop().animate({
                'scrollLeft' : small.outerWidth()*(index-2)
            }, 200);
            this.number.find('em').text( index+1 );
            this.wrap.find('.title').html( obj.attr('data-title')||'' );
            this.wrap.find('.desc').html( obj.attr('data-desc')||'' );
			src = this.srcRule(src,obj);
			
			this.image.attr('src',src).hide();
			this.loading.show();
			
			this.ready(src, function(){
				T.image.data('size', {width:this.width, height:this.height});
				T.setCenter(this);
			},function(){
				T.loading.hide();
				setTimeout(function(){
					T.image.show();
				}, 100)
			},function(){//失败
				T.close.show();
				T.loading.hide();
			})
			this.index = index;
			this.page.show();
			index==0 && this.page.eq(0).hide();
			index==this.item.length-1 && this.page.eq(1).hide();
			this.options.onChange && this.options.onChange(index);
			
			this.info.find('.pic_list img').eq(index).addClass('current').siblings().removeClass('current');
		},
		setCenter : function(img){
			var T = this,
				Size = this.image.data('size'),
				w = Size ? Size.width : img.width,
				h = Size ? Size.height : img.height,
				p = (parseInt(this.img.css('padding-left'),10)||0)*2,
				size = this.limit({width:w+p, height:h+p}),
				delay = 200;
				
			w = size.width;
			h = size.height;
			
			this.img.animate({
				'margin-left' : -w/2,
				'margin-top' : -h/2,
				'width' : w-p,
				'height' : h-p
			},delay,function(){
				T.close.show();
			});
			
			w -= p;
			h -= p;
			
			this.image.animate({
				'margin-left' : -w/2,
				'margin-top' : -h/2,
				'width' : w,
				'height' :  h
			}, delay)
			this.close.css({
				'left' : this.content.width()/2+w/2+p/2,
				'top' : this.content.height()/2-h/2-p/2,
				'display' : 'none',
				'margin' : '-16px 0 0 -16px'
			})
			//!resize && this.close.hide();
		},
		limit : function(size){
			var width = size.width,
				height = size.height,
				W = this.content.width(),
				H = this.content.height(),
				k = width/height,
				K = W/H;
			if( k>K && width>W ){
				width = W;
				height = width/k;
			}else if( k<=K && height>H ){
				height = H;
				width = height*k;
			}
			return {
				width : width,
				height : height
			};
		}
	};
	
	function lightbox(id, options){
	    options = options || {};
	    options.type = 'lightbox';
	    options.wrap = $('<div class="lightbox_wrap"><div class="content"><div class="img"></div><i class="loading"></i><i class="p prev"></i><i class="p next"></i><i class="close"></i></div><div class="info"></div></div>').appendTo($('body'));
	    this.layer = ui.layer;
	    this.align = new ui.align({
            nearby : window,
            element : options.wrap
        })
        this.fullScreen = options.fullScreen;
	    lightbox.baseConstructor.call(this, id, options);    
        //this.showInfo = this.options.showInfo==false ? false : true;
    }
    ui.extend(lightbox, player);
    ui.extend.proto(lightbox, {
        bind : function(fn){
            var T = this, A;
            
            var pic = this.info.append(
                ['<div class="pic_list">',
                    '<i class="p prev" data-action="scroll"></i>',
                    '<i class="p next" data-action="scroll"></i>',
                    '<div class="wrap"><div class="list"></div></div>',
                '</div>',
                '<div class="txt">',
                    '<div class="num"><em></em> / <i></i></div>',
                    '<div class="title"></div>',
                    '<div class="desc"></div>',
                '</div>',
                //'<div class="option"><a href="" data-action="full_screen">全屏</a><a href="" data-action="close">关闭</a></div>'
                ].join('')).find('.pic_list .list');
            
            $.each( this.item, function(i,m){
                var img = m.tagName.toLowerCase()=='img' ? $(m) : $(m).find('img');
                if( img.length ){
                    img = img.clone().attr({'style':''});
                    pic.append(img);
                }
            })
            this.item = pic.find('img');
            
            this.close.click(function(){
                T.hide();
            })
            
            $(window).resize(function(){
                clearTimeout(A);
                T.close.hide();
                A = setTimeout(function(){
                    T.load(T.index, true);
                },300)
            })
            //添加全屏切换事件示例
            this.wrap[0].addEventListener(fullscreen.fullScreenEventName, function() {
                !fullscreen.isFullScreen() && T.hide();//退出全屏
            }, true);
            
            
            fn.call(this);
        }
    })
    lightbox.prototype.show = function(index){
        fullscreen.requestFullScreen(this.wrap[0]);
        
        $('html').addClass('lightbox');
        this.align.set();
        
        this.wrap.fadeIn(300);
        this.layer.show(0.95);
        
        typeof this.options.onShow == 'function' && this.options.onShow.call(this);
        
        this.load(index);
        if( this.fullScreen ){
            this.fullScreen = null;
            this.info.find('a[data-action=full_screen]').click();
        }
    }
    lightbox.prototype.hide = function(){
        fullscreen.cancelFullScreen(this.wrap[0]);
        $('html').removeClass('lightbox');
        this.wrap.hide();
        this.layer.hide();
        typeof this.options.onHide == 'function' && this.options.onHide.call(this);
    }
	return {
	    player : player,
	    lightbox : lightbox
	};
});
