/**
 * @fileOverview KChart 1.1  legend
 * @author huxiaoqi567@gmail.com
 */
;KISSY.add('gallery/kcharts/1.1/legend/index',function(S,Raphael,Template,graphTool,undefined){
	var $ = S.all,
		Evt = S.Event;
	function Legend(cfg){
		var self = this;
			self._cfg = S.mix({
				themeCls:"ks-charts-legend",
				switchable:true,//是否可以切换
				css:{},
				x:0,		//offsetX 水平偏移量
				y:0,		//offsetY 垂直偏移量
				layout:"horizontal",	//水平或垂直排列	horizontal 水平  vertical 垂直
       			align:"center",	//水平对齐方式 right center left
       			verticalAlign:'bottom',	//垂直对齐方式 top middle bottom
				evtBind:false  //为了向前兼容
			},cfg);
			self.init();
	}
	S.augment(Legend,{
		init:function(){
			var self = this,
				_cfg = self._cfg;
			if(_cfg.container){
				self.$ctn = $(_cfg.container);
				if(!self.$ctn[0]) return;
			}
			self.render();
		},
		render:function(){
			var self = this,
				_cfg = self._cfg,
				chart = _cfg.chart,
				ictn = chart._innerContainer;
			//渲染容器
			self.renderIconContainer();
			//渲染图标
			self.renderIcon();
			//设置展示方式
			self.setStyle();
			//事件绑定
			_cfg.evtBind && chart.on("afterRender",function(){
				self.bindEvt();
			});
			S.log(self)
		},
		//设置样式
		setStyle:function(){
			var self = this,
				_cfg = self._cfg,
				x = _cfg.x,
				y = _cfg.y,
				chart = _cfg.chart,
				align = _cfg.align,
				layout = _cfg.layout,
				themeCls = _cfg.themeCls,
				verticalAlign = _cfg.verticalAlign,
				ictn = chart._innerContainer,
				width = self.$legend.outerWidth() || self.$legend.width(),
				height = self.$legend.outerHeight() || self.$legend.height(),
				ctnWidth = self.filterPx(self.$ctn.width()),
				ctnHeight = self.filterPx(self.$ctn.height()),
				len = self._len,
				marginLeft,
				marginTop,
				box = {};
			//水平对齐方式
			switch(align){
				case "left":
					marginLeft = 0;
					break;
				case "center":
					marginLeft = ctnWidth/2 - width/2;
					break;
				default :
					marginLeft = ctnWidth - width;
					break;
			}
			//垂直对齐方式
			switch(verticalAlign){
				case "bottom":
					marginTop = ctnHeight - height;
					break;
				case "middle":
					marginTop = ctnHeight/2 - height/2;
					break;
				default :
					marginTop = 0;
					break;
			}
			switch(layout){
				//水平的 
				case "horizontal":
					// self.$legend.addClass(themeCls + "-horizontal");
					break;
				//垂直的
				default :
					// self.$legend.addClass(themeCls + "-vertical");
					break;
			}
			marginTop += self.filterPx(y);
			marginLeft += self.filterPx(x);
			self.$legend.css({
				marginLeft:marginLeft,
				marginTop:marginTop
			}).css(_cfg.css);
		},
		filterPx:function(str){
			if(!str) return "";
			return (str+"").replace("px","") - 0;
		},
		renderIcon:function(){
			var self = this,
				_cfg = self._cfg,
				chart = _cfg.chart,
				chartType = chart.chartType,
				color,
				paper,
				iconType,
				cx = 8,
				cy = 5;
			if(chartType == "linechart"){
				$(".legend-icon",self.$legend).each(function(obj,index){
				var	stocks = chart._stocks[index];
					//获取颜色对象
					color = stocks['color'];
					//获取画布
					paper = Raphael(this[0]);
					//icon类型
					iconType = stocks['type'];
					//画底线
					paper.path("M0,5L16,5").attr({
							"stroke":color['DEFAULT'],
							"stroke-width":2
					});
					switch(iconType){
						case "triangle":
							$stock = graphTool.triangle(paper,cx,cy+1,5);
							break;
						case "rhomb":
							$stock = graphTool.rhomb(paper,cx,cy,8,8);
							break;
						case "square":
							//菱形旋转45度
							$stock = graphTool.rhomb(paper,cx,cy,8,8,45);
							break;
						default:
							$stock = paper.circle(cx,cy,3);
							break;
					}
					$stock.attr({
							fill:color['DEFAULT'],
							"stroke":color['DEFAULT']
					});
				});
			}else{
				$(".legend-icon",self.$legend).each(function(obj,index){
					//获取颜色对象
					color = chart.color.getColor(index)
					//获取画布
					paper = Raphael(this[0]);
					//画底线
					paper.rect(0,0,10,8,2).attr({
							"fill":color['DEFAULT'],
							"stroke-width":"0px"
					});
				});
			}
		},
		renderIconContainer:function(){
			var self = this,
				_cfg = self._cfg,
				chart = _cfg.chart;

			self._len = 0;

			self._html = "<div class='"+_cfg.themeCls+" "+_cfg.themeCls+"-"+_cfg.layout+"'><ul>";
			for(var i in chart._datas['total']){
				self._len ++;
				var	cls = chart._cfg['series'][i]['isShow'] == false ? "clearfix disable" : "clearfix";
				self._html += Template(
					"<li class="+cls+">"
						+"<div class='legend-icon'></div><div class='legend-text'>{{text}}</div>"
					+"</li>"
				)
				.render(chart._cfg['series'][i]);
			}
			self._html += "</ul></div>";
			self.$legend = $(self._html).appendTo(self.$ctn);
			return self._html;
		},
		show:function(){
			return this.$legend.show();
		},
		destroy:function(){
			var self = this;
			//unbind evt
			Evt.detach($("li",_cfg.container),"click");
			//clear node
			self.$ctn.html("");
		},
		bindEvt:function(){
		  var self = this,
		  	  _cfg = self._cfg,
				chart = _cfg.chart,
				chartType = chart.chartType,
				$ctn = self.$ctn;
				if(!_cfg.switchable) return;
		  Evt.detach($("li",$ctn),"click");
		  Evt.on($("li",$ctn),"click",function(e){
	          var $li = $(e.currentTarget).toggleClass("disable"),
	          	  index = S.indexOf(e.currentTarget,$("li",$ctn));
	          if(!$li.hasClass("disable")){
	            "linechart" === chartType && chart.showLine(index);
	            "barchart" === chartType && chart.showBar(index);
	            "scatterchart" === chartType && chart.showPoints(index);
	          }else{
	            "linechart" === chartType && chart.hideLine(index);
	            "barchart" === chartType && chart.hideBar(index);
	            "scatterchart" === chartType && chart.hidePoints(index);
	          }
	      });
	      Evt.detach($("li",$ctn),"mouseenter");
	      Evt.on($("li",$ctn),"mouseenter",function(e){
	          var $li = $(e.currentTarget),
	          	  index = S.indexOf(e.currentTarget,$("li",$ctn));
	          if(!$li.hasClass("disable")){
	            "linechart" === chartType && chart.lineChangeTo(index);
	          }
	      });
		}
	});
	return Legend;
},{requires:[
	'gallery/kcharts/1.1/raphael/index'
	,'gallery/template/1.0/index'
	,'gallery/kcharts/1.1/tools/graphtool/index'
	,'./assets/legend.css'
]});
