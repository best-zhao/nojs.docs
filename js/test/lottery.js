/*Thu Nov 14 2013 11:05:11 GMT+0800 (中国标准时间)-http://nolure.github.io/nojs.docs*/define("test/lottery",[],function(require,a,b,c){function d(b,c){this.options=c=c||{},this.parent="string"==typeof b?a("#"+b):b,this.element=c.element,this.width=this.parent.width(),this.height=this.parent.height(),this.canvas=null,this.ctx=null,this.angle=0,this.createSpace()}function e(c){this.options=c=c||{},c.background=domain.rs+"/Images/zt/lottery/bg.jpg",this.lottery=this.options.data,this.length=this.lottery.length,this.length&&(this.element=a("#"+this.options.element),this.loading=this.element.find("i.loading"),new b.ico(this.loading,{type:"loading",width:48,height:48,color:"#F0A97D"}),this.value=null,this.limittime=null,this.preload(),this.getData())}return d.hasCanvas=!!document.createElement("canvas").getContext,d.state=null,d.speed=d.hasCanvas?20:40,d.prototype={createSpace:function(){var b=document;if(this.background=new Image,this.background.src=this.options.background,d.hasCanvas){this.canvas=b.createElement("canvas"),this.canvas.className="canvas",this.ctx=this.canvas.getContext("2d"),this.canvas.width=this.width,this.canvas.height=this.height,this.parent.append(this.canvas),this.ctx.translate(this.width/2,this.height/2),this.canvas.img=[];for(var c,e,f='<div class="link">',g=-90,h=0;h<this.element.length;h++)this.canvas.img[h]=new Image,e=this.element[h],this.canvas.img[h].src=e.picurl,this.canvas.img[h].style.width=this.canvas.img[h].style.height="78px",g%=360,c=["-webkit-transform-origin:0 39px;","-moz-transform-origin:0 39px;","-ms-transform-origin:0 39px;","-o-transform-origin:0 39px;","-webkit-transform: rotate("+g+"deg);","-moz-transform: rotate("+g+"deg);","-ms-transform: rotate("+g+"deg);","-o-transform: rotate("+g+"deg);"].join(""),f+='<div style="'+c+'"><a href="'+e.linkurl+'" title="'+e.prize+'" target="_blank"></a></div>',g+=45;f+="</div>",this.link=a(f),this.parent.append(this.link),this.ctx.rotate(-90*Math.PI/180)}else{var i=b.createStyleSheet(),j=["image","group"];b.namespaces.add("v","urn:schemas-microsoft-com:vml");for(var h=0;h<j.length;h++)i.addRule("v\\:"+j[h],"behavior:url(#default#VML);display:inline-block;")}this.draw(),this.rotate(.1)},start:function(){var a=this;d.step=1,d.state=!0,this.time=setInterval(function(){return!d.step||d.step<0?(a.time=clearInterval(a.time),d.onStop&&d.onStop(),d.hasCanvas&&a.link.css({"-webkit-transform":"rotate("+a.angle+"deg)","-moz-transform":"rotate("+a.angle+"deg)","-ms-transform":"rotate("+a.angle+"deg)","-o-transform":"rotate("+a.angle+"deg)"}),a.link.show(),void 0):(d.state&&d.step<21&&(d.step+=.5),a.rotate(),void 0)},d.speed)},draw:function(){var b,c=this.element.length;if(d.hasCanvas)for(this.ctx.drawImage(this.background,-this.width/2,-this.height/2,this.width,this.height),b=0;c>b;b++)this.ctx.beginPath(),this.ctx.fillStyle="#FFB24A",this.ctx.arc(this.width/2-39-30,0,39,0,360,!1),this.ctx.fill(),this.ctx.beginPath(),this.ctx.drawImage(this.canvas.img[b],this.width/2-78-30,-39,78,78),this.ctx.rotate(45*Math.PI/180);else{var e=0,f='<v:group class="vml_group" CoordOrig="'+-this.width/2+","+-this.height/2+'" CoordSize="'+this.width+","+this.height+'"></v:group>';this.canvas=document.createElement(f),a(this.canvas).addClass("canvas"),this.canvas.img=[],this.parent.append(this.canvas);var g,h=document.createElement('<v:image src="'+this.background.src+'" class="bg"></v:image>');for(a(this.canvas).append(h),b=0;b<this.element.length;b++)g=this.element[b],this.canvas.img[b]=document.createElement(f),a(this.canvas).append(this.canvas.img[b]),a(this.canvas.img[b]).append('<v:image class="vml_img" src="'+g.picurl+'"><a href="'+g.linkurl+'" title="'+g.prize+'" target="_blank"></a></v:image>'),e%=360,this.canvas.img[b].angle=this.canvas.img[b].rotation=e,e+=45;this.link=this.parent.find(".vml_img a"),this.canvas.angle=this.canvas.rotation=0}},rotate:function(a){var b=Math.PI,c=this.width,e=this.width;a=a||d.step,d.hasCanvas?(this.ctx.clearRect(-c/2,-e/2,c,e),this.ctx.rotate(a*b/180),this.draw(),this.angle=(this.angle+a)%360):(this.angle=(this.canvas.angle+a)%360,this.canvas.rotation=this.canvas.angle=this.angle)}},e.prototype={getData:function(){var b=this,d=a("#u_state");c.user.state||(d.html('检测到您是未登录状态，点击此处 <a href="javascript:void(0);" id="login_btn">登录</a> 或 <a href="/User-registe.html" target="_blank">注册</a>。'),a("#login_btn").click(function(){return c.user.check()?void 0:(b.loginCallback(),!1)}),b.loginCallback()),a.ajax({url:"Lottery-limitcount",data:{ztid:this.options.id},dataType:"json",async:!1,success:function(a){b.value=a.limitcount}})},loginCallback:function(){var d=this;c.user.callback=function(){a("#u_state").html(""),b.msg.show("ok","登录成功，现在你可以抽奖了！"),d.getData()}},preload:function(){function a(){d>=e.length&&c.init()}var b,c=this,d=0,e=[this.options.background,domain.rs+"/Images/zt/lottery/c.png"];for(b=0;b<this.length;b++)e.push(this.lottery[b].picurl);for(b=0;b<e.length;b++)!function(b){var c=new Image;return c.src=e[b],c.complete?(d++&&a(),void 0):(c.onload=function(){d++,c=c.onload=null,a()},void 0)}(b)},init:function(){this.loading.hide(),this.element.find("div.lottery_wrap").css({visibility:"visible",opacity:"0"}).fadeTo(500,1),this.lottery=new d(this.options.element,{element:this.lottery,background:this.options.background}),this.start=a("#lottery_start"),this.state=null,this.bind()},bind:function(){var e,f=this;this.start.click(function(d){return c.user.check()?f.value?1==f.state?!1:2==f.state?!1:(f.tip=null,a.post("Lottery-dolottery",{ztid:f.options.id},function(a){var b;1==a.status&&(f.index=a.sort||f.options.data[0].sort,f.tip=a.msg,f.haveprize=a.haveprize,f.value=a.limitcount),e=setTimeout(function(){f.stop(b)},1500)},"json"),f.limittime?(b.msg.show("warn","您点的比飞机还快,休息一会吧"),!1):(f.limittime=setTimeout(function(){f.limittime=null},5e3),f.lottery.link.hide(),f.lottery.start(),f.state=1,d.preventDefault(),!1)):(b.msg.show("warn","您的贡献值不足，不能抽奖"),!1):(f.loginCallback(),!1)}),d.onStop=function(){f.state=null}},stop:function(a){var c,e,f,g=this,h=.15,i=10.5;if(g.state=2,d.state=null,!a){e=d.step/h;var j=g.getIndex();f=45*-j+360*(a?1:8),h=d.step/((f-g.lottery.angle-i)/d.step/.5)}c=setInterval(function(){d.step-=h,d.step<=0&&(c=clearInterval(c),b.msg.show(g.haveprize?"ok":"warn",g.tip,{layer:!0,timeout:0,button:[["再试一次","close","sb"]]}))},d.speed)},getIndex:function(a){var b;a=this.index||this.options.data[0].sort;for(var c=0;c<this.length;c++)if(this.options.data[c].sort==a){b=c;break}return b},getLottery:function(){return parseInt((360-this.lottery.angle)/45)}},e});