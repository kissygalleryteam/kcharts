KISSY.add("gallery/kcharts/1.2/gallery/funnel/index",function(S,Node,Base,Template,Raphael,Tip){
	
	var $=Node.all;
	var cfg=  {

        chart: {
            type: 'funnel',
            marginRight: 100
        },
        title: {
            text: '漏斗',
            color:"#274b6d"
         },
        plotOptions: {
            series: {
                dataLabels: {
                    format: '<h4>{{title}}</h4>{{title}}:{{pointer}}',
                   
                },
                neckWidth: '50%',
                neckHeight: '50%'
                
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: '',
            data: []
        }]
    }


	function Funnel(content,config){
		if(!config) return;
		this.content=content;
		
		this.config=S.mix(cfg,config);
		this.paper = new Raphael(this.content.replace("#",""));
		this.init();
		
		

	}
	
	S.augment(Funnel,Base,{
		setConfig:function(){
			var percent=parseInt(this.config.plotOptions.series.neckWidth)/100,
				Npercent=parseInt(this.config.plotOptions.series.neckHeight)/100,
				w=$(this.content).width()-this.config.chart.marginRight,
				t=0,
				h=$(this.content).height();
			if(Npercent==0){
				Npercent=1
			}

			
			this.set("width",w);
			this.set("height",h-t-50);
			this.set("top",t);
			this.set("bottom",(w-w*percent)/2);
			this.set("neckHeight",Npercent*(h-t-50));
			
		},
		_title:function(){
			var t=this.config.title,
				$text = $("<h2></h2>").html(t.text).css({
				display:"block",
				position:"absolute",
				fontSize:14,
				fontFamily:"Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif",
				left:t.x,
				top:-50,
				height:50,
				lineHeight:'50px',
				width:this.get("width"),
				textAlign:'center',
				color:t.color
			});
			$text.appendTo(this.content);

		},
		_requsestArry:function(z){
			var self=this,
				arry=[],
				count=0;

			S.each(z,function(e,i){
				count+=e
			})
			if(count!=0){
				S.each(z,function(e,i){
					
					arry.push(e/count*self.get("height"))
				})
			}
			else{
				arry=[0]
			}
		
			return arry;
		},
		_total:function(z){

			var count=0,arry=[],self=this;
			S.each(z,function(e,i){
				count+=e[1]
			})

			S.each(z,function(e,i){

				arry.push(e[1]/count*self.get("height"))
			})

			return arry;
		},
		_path:function(arry){
			var self=this,
				w=this.get("width"),
				t=this.get("top"),
				b=this.get("bottom"),
				h=this.get("height"),
				Nh=this.get("neckHeight")+t,
				n=t,
				q=t;
				zuC=this.config.plotOptions.background,
				num=self._nowNum(arry);
				if(arry[0]==0 && arry.length==1){
					self.destroy();
					return ;
				}
				
				S.each(arry,function(e,i){
					
					q+=e;
					
					var x1=self._countPage(n),
						x2=self._countPage(e);
					if(i<num){
						self.paper.path('M'+x1+','+n+'L'+(w-x1)+','+n+'L'+(w-x1-x2)+','+q+'L'+(x1+x2)+','+q+'Z').attr({"stroke":"#fff","fill":zuC[i],"stroke-width":1})
					}
					else if(i==num){
						if(Nh==h){
							self.paper.path('M'+b+','+n+'L'+(w-b)+','+n+'L'+(w-b)+','+q+'L'+b+','+q+'Z').attr({"stroke":"#fff","fill":zuC[i],"stroke-width":1})
						}
						else{
							self.paper.path('M'+x1+','+n+'L'+(w-x1)+','+n+'L'+(w-b)+','+Nh+'L'+(w-b)+','+q+'L'+b+','+q+'L'+b+','+Nh+'Z').attr({"stroke":"#fff","fill":zuC[i],"stroke-width":1})
						}
					}
					else{
						x1=b,
						x2=self._countPage(0);
						self.paper.path('M'+x1+','+n+'L'+(w-x1)+','+n+'L'+(w-x1-x2)+','+q+'L'+(x1+x2)+','+q+'Z').attr({"stroke":"#fff","fill":zuC[i],"stroke-width":1})
					}
					
					n+=e
				
				})
				

		
		},
		_linePath:function(arry){
			var self=this,
				w=this.get("width"),
				b=this.get("bottom"),
				t=this.get("top"),
				Nh=this.get("neckHeight"),
				h=this.get("height"),
				n=t,
				q=t,
				num=this._nowNum(arry);
				S.each(arry,function(e,i){
					if(e!=0){
						var t1=q+e/2+n-t,
							l=w-self._countPage(t1);
						if(num<i || t1>Nh || (Nh+t)==h){

							l=w-b;
						}
						self.paper.path('M'+l+','+t1+'L'+(l+50)+','+t1).attr({"stroke":"#000","fill":"#000","stroke-width":0.5})
						q+=e
					}
				})
		},
		_nameSeat:function(arry){
			var self=this,
				c=$(this.content),
				config=this.config,
				s=this.config.series[0],
				w=this.get("width"),
				b=this.get("bottom"),
				h=this.get("height"),
				t=this.get("top"),
				Nh=this.get("neckHeight"),
				n=t,
				q=t,
				num=this._nowNum(arry),
				zuC=config.plotOptions.background;
				_html="";

				S.each(arry,function(e,i){
					if(e!=0){
						var data={
							title:config.series[0].data[i][0],
							name:config.series[0].name,
							pointer:self._slice(config.series[0].data[i][1])
						}
						var t1=q+e/2+n-t,
							l=w-self._countPage(t1);
						if(num<i || t1>Nh || (Nh+t)==h){
							l=w-b;
						}
						var text='<strong style="font-weight:bold">'+s.data[i][0]+'</strong><span style="font-size:11px">('+self._slice(s.data[i][1])+')</span>';
							html=$('<div></div>').html(text).attr("data-num",i).addClass("ks-funnel-line").css({
								  fontSize:'11px',
								  left:(l+55),
								  top:(t1-8),
								  fontFamily:'Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif',
								  position:'absolute'
							})
							html.appendTo(c)
						
							}
						q+=e
					
				})
				
		},
		_slice:function(count){
			var c=count.toString(),len=c.length;

			if(len>3){
				c=c.slice(0,len-3)+","+c.slice(len-3);

			}
			
			return c
		},
		_nowNum:function(arry){
			var t=this.get("top"),
				n=t,
				q=t,
				t1=0,
				Nh=this.get("neckHeight")+t;

			S.each(arry,function(e,i){
				q+=e;
				if(Nh>n && Nh<q){
					t1=i
				}
				n+=e			
			})

			return t1;
		},
		_countPage:function(y){
			var b=this.get("bottom"),Nh=this.get("neckHeight");
			var x=y*b/Nh;
			return x
		},
		
		_template:function(arry){
			var self=this,
			temp="",
			w=this.get("width"),
			zuC=this.config.plotOptions.background,
			
			zuH=this.config.plotOptions.backgroundHover,
			s=this.config.series[0];
			S.each(arry,function(e,i){
				var _i='display:inline-block;margin-right:5px;width:10px;height:10px;background:'+zuC[i]+'';
				temp+='<span class="ks-funnel-legend" data-count='+arry[i]+' data-num='+i+' style="margin:0 5px;cursor:pointer;color:'+zuC[i]+'"><i style='+_i+'></i>'+s.data[i][0]+'</span>'
			})
			$('<div></div>').addClass("ks-funnel-foot").html(temp).css({
				width:w,
				position:'absolute',
				bottom:20,
				left:0,
				textAlign:'center'
			}).appendTo($(this.content))
		},
		destroy:function(){
			$(this.content).all("svg").empty();
			$(".ks-funnel-line") && $(".ks-funnel-line").remove();

			
		},
		
		_evt:function(){
			var self=this,
			config=this.config,
			zuC=config.plotOptions.background,
			zuH=config.plotOptions.backgroundHover,
			path=$(this.content).all("path"),
			s=this.config.series[0];

			
			 var tip = new Tip({
			      rootNode:self.content,
			      boundry:{
			      	x:0,
			      	y:0,
			      	width:self.get("width"),
			      	height:self.get("height")
			      }
			 });
			path.on("click",function(e){
				
				var index=S.indexOf(this,path),
					obj={
						toIndex:index,
						content:e
					};
				self.pathClick(obj)
			})
			   
			path.on("mousemove",function(e){
				var index=S.indexOf(this,path);
				$(this).attr("fill",zuH[index]);
				var data={
					title:config.series[0].data[index][0],
					name:config.series[0].name,
					pointer:self._slice(config.series[0].data[index][1])
				}

				
				tip.$tip.css({"border":'1px '+zuC[index]+' solid'})
				tip.renderTemplate(config.plotOptions.series.dataLabels.format,data)
				tip.animateTo(e.offsetX+10,e.offsetY+10,function(){

    			});
			})
			path.on("mouseleave",function(e){
				var index=S.indexOf(this,path);
				$(this).attr("fill",zuC[index]);
				tip.hide()
			})

		},
		_event:function(arry){
			var self=this,
			zuC=this.config.plotOptions.background,
			zuH=this.config.plotOptions.backgroundHover,
			path=$(this.content).all("path"),
			s=this.config.series[0];

		
			S.Event.delegate(this.content,'click','.ks-funnel-legend',function(e){
				var that=$(e.currentTarget),
					index=parseInt(that.attr("data-num"));
				
				if(that.attr("data-flag")!="1"){
					that.attr("data-flag","1")
					that.css({"color":"#ccc"})
					that.all("i").css({"background":"#ccc"});
					arry[index]=0;
				}
				else{
					that.attr("data-flag","0");
					that.css({"color":zuC[index]});
					that.all("i").css({"background":zuC[index]});
					arry[index]=parseFloat(that.attr("data-count"))
				}
				self.set("data",self._requsestArry(arry))
				self._render(self._requsestArry(arry))
				

			})
			



		},
		//重置config
		_rednderVal:function(){
			var self=this;
			self.setConfig()
		    self._render(self.get("data"));
		},
		_render:function(d){
			this.destroy();
			this._path(d);
			this._linePath(d)
			this._nameSeat(d);
			this._evt()
			
		},
		init:function(){
			$(this.content).css({"marginTop":50})
			this.setConfig();
			this._title();
			this.set("data",this._total(this.config.series[0].data));
			this._render(this.get("data"));
			this._template(this.get("data"));
			this._event(this.get("data"));
		},
		pathClick:function(obj){
			var self = this;
			self.fire("pathClick",obj)
		}
	})
	return 	Funnel;
}
,
    {
        attach:false,
        requires:['node','base','template','gallery/kcharts/1.2/raphael/','gallery/kcharts/1.1/tip/index']
    }
)