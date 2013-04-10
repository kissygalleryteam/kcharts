/**
 * @fileOverview KChart 1.1  legend
 * @author huxiaoqi567@gmail.com
 */
;KISSY.add('gallery/kcharts/1.1/legend/index',function(S,HtmlPaper,Raphael,Template,graphTool,undefined){
	var $ = S.all,
		Evt = S.Event;

	function Legend(cfg){
		var self = this;
			self._cfg = S.mix({
				themeCls:"ks-charts-legend",
				css:{},
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

			self.$legend = $("."+_cfg.themeCls,self.$ctn);
			//渲染图标
			self.renderIcon();

			self.$legend.css({
				marginLeft:ictn.width,
				marginTop:0
			}).css(_cfg.css);

			_cfg.evtBind && chart.on("afterRender",function(){
				self.bindEvt();
			});

			S.log(self)
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

			}else if(chartType == "barchart"){

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

			self._html = "<div class="+_cfg.themeCls+"><ul>";

			for(var i in chart._datas['total']){

				var	cls = chart._cfg['series'][i]['isShow'] == false ? "clearfix disable" : "clearfix";

				self._html += Template(
					"<li class="+cls+">"
						+"<div class='legend-icon'></div><div class='legend-text'>{{text}}</div>"
					+"</li>"
				)
				.render(chart._cfg['series'][i]);
			}

			self._html += "</ul></div>";

			$(self._html).appendTo(self.$ctn);

			return self._html;
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

		  Evt.on($("li",$ctn),"click",function(e){
	          var $li = $(e.currentTarget).toggleClass("disable"),
	          	  index = S.indexOf(e.currentTarget,$("li",$ctn));
	          if(!$li.hasClass("disable")){
	            "linechart" === chartType && chart.showLine(index);
	            "barchart" === chartType && chart.showBar(index);
	          }else{
	            "linechart" === chartType && chart.hideLine(index);
	            "barchart" === chartType && chart.hideBar(index);
	          }
	      });

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
	'gallery/kcharts/1.1/tools/htmlpaper/index'
	,'gallery/kcharts/1.1/raphael/index'
	,'gallery/template/1.0/index'
	,'gallery/kcharts/1.1/tools/graphtool/index'
	,'./assets/legend.css'
]});