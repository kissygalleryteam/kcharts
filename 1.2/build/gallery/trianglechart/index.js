/*
combined files : 

gallery/kcharts/1.2/gallery/trianglechart/theme
gallery/kcharts/1.2/gallery/trianglechart/index

*/
KISSY.add("gallery/kcharts/1.2/gallery/trianglechart/theme",function(S){

	var COLOR_TPL = "{COLOR}";

	var themeCfg = {
		//默认主题
		"ks-chart-default":{
			title:{
		           content:"",
		           css:{
		            		"text-align":"center",
		            		"font-size":"16px",
		            		"font-weight": "bold",
		            		"color":"#666"
		           },
		           isShow:true
		    },
		    subTitle:{
		       content:"",
		       css:{
		            "text-align":"center",
		            "font-size":"12px",
		            "color":"#666"
		        },
		        isShow:true
		    },
			xGrids:{
				css:{
					color:"#eee"
				}
			},
			yGrids:{
				css:{
					color:"#eee"
				}
			},
			yAxis:{
				css:{
					color:"#ccc"
				}
			},
			xAxis:{
				css:{
					color:"#ccc"
				}
			},
			xLabels:{
				css:{
					"color":"#666",
					"font-size": "12px"
				}
			},
			yLabels:{
				css:{
					"color":"#666",
					"font-size": "12px"
				}
			},
			tip:{
				css:{
					"border":"1px solid {COLOR}"
				}
			}
		},
		"ks-chart-analytiks":{
			title:{
		           content:"",
		           css:{
		            		"text-align":"center",
		            		"font-size":"16px",
		            		"font-weight": "bold",
		            		"color":"#666"
		           },
		           isShow:true
		    },
		    subTitle:{
		       content:"",
		       css:{
		            "text-align":"center",
		            "font-size":"12px",
		            "color":"#666"
		        },
		        isShow:true
		    },
			xGrids:{
				css:{
					color:"#eee"
				}
			},
			yGrids:{
				css:{
					color:"#eee"
				}
			},
			yAxis:{
				css:{
					color:"#ccc"
				}
			},
			xAxis:{
				css:{
					color:"#ccc"
				}
			},
			xLabels:{
				css:{
					"color":"#666",
					"font-size": "12px"
				}
			},
			yLabels:{
				css:{
					"color":"#666",
					"font-size": "12px"
				}
			},
			tip:{
				css:{
					"border":"1px solid {COLOR}"
				}
			}
		},
		"ks-chart-rainbow":{
			title:{
		           content:"",
		           css:{
		            		"text-align":"center",
		            		"font-size":"16px",
		            		"font-weight": "bold",
		            		"color":"#666"
		           },
		           isShow:true
		    },
		    subTitle:{
		       content:"",
		       css:{
		            "text-align":"center",
		            "font-size":"12px",
		            "color":"#666"
		        },
		        isShow:true
		    },
			xGrids:{
				css:{
					color:"#eee"
				}
			},
			yGrids:{
				css:{
					color:"#eee"
				}
			},
			yAxis:{
				css:{
					color:"#ccc"
				}
			},
			xAxis:{
				css:{
					color:"#ccc"
				}
			},
			xLabels:{
				css:{
					"color":"#666",
					"font-size": "12px"
				}
			},
			yLabels:{
				css:{
					"color":"#666",
					"font-size": "12px"
				}
			},
			tip:{
				css:{
					"border":"1px solid {COLOR}"
				}
			}
		}
	};

	return themeCfg;

});
KISSY.add('gallery/kcharts/1.2/gallery/trianglechart/index', function(S, Template, BaseChart,Theme,Raphael, Color, HtmlPaper, Legend, undefined, Tip) {
	var $ = S.all,
		Evt = S.Event,
		win = window,
		clsPrefix = "ks-chart-",
		themeCls = clsPrefix + "default",
		canvasCls = themeCls + "-canvas",
		evtLayoutCls = clsPrefix + "evtlayout",
		evtLayoutAreasCls = evtLayoutCls + "-areas",
		evtLayoutBarsCls = evtLayoutCls + "-bars",
		COLOR_TPL = "{COLOR}",
		color;

	var TriangleChart = function(cfg) {
		this.init(cfg);
	};

	S.extend(TriangleChart, BaseChart, {
		init: function(cfg) {
			var self = this,
				w,points;

			self.chartType = "trianglechart";
			BaseChart.prototype.init.call(self, cfg);
			if (!self._$ctnNode[0]) return;
			var _defaultConfig = {
				themeCls: themeCls,
				autoRender: true,
				colors: [],
				title: {
					content: "",
					css: {
						"text-align": "center",
						"font-size": "16px"
					},
					isShow: true
				},
				subTitle: {
					content: "",
					css: {
						"text-align": "center",
						"font-size": "12px"
					},
					isShow: true
				},
				xLabels: {
					isShow: true,
					css: {
						"color": "#666",
						"font-size": "12px",
						"white-space": "nowrap",
						"position": "absolute" //修复ie7被遮住的Bug
					}
				},
				yLabels: {
					isShow: true,
					css: {
						"color": "#666",
						"font-size": "12px",
						"white-space": "nowrap",
						"position": "absolute" //修复ie7被遮住的Bug
					}
				},
				//横轴
				xAxis: {
					isShow: true,
					css: {
						color: "#eee",
						zIndex: 10
					},
					min:0
				},
				//纵轴
				yAxis: {
					isShow: true,
					css: {
						zIndex: 10
					},
					num: 5,
					min:0
				},
				//x轴上纵向网格
				xGrids: {
					isShow: true,
					css: {

					}
				},
				//y轴上横向网格
				yGrids: {
					isShow: true,
					css: {}
				},
				areas: {
					isShow: true,
					css: {

					}
				},
				triangles: {
					isShow: true,
					css: {
						background: COLOR_TPL,
						"border": "1px solid #fff"
					}
				},
				// zoomType:"x"
				legend: {
					isShow: false
				},
				tip: {
					isShow: true,
					template: "",
					css: {

					},
					anim: {
						easing: "easeOut",
						duration: 0.3
					},
					offset: {
						x: 0,
						y: 0
					},
					boundryDetect: true,
					alignX: "right", //left center right
					alignY: "bottom"
				}
			};
			//柱形对象数组
			self._triangles = {};

			//统计渲染完成的数组
			self._finished = [];

			//主题
			themeCls = self._cfg.themeCls || _defaultConfig.themeCls;

			self._cfg = S.mix(S.mix(_defaultConfig, Theme[themeCls], undefined, undefined, true), self._cfg, undefined, undefined, true);

			self.color = color = new Color({
				themeCls: themeCls
			});
			points = self._points[0];
			w = Math.round((points && points[0] && points[1] && points[1].x - points[0].x) || self.getInnerContainer().width)

			w && self.set("area-width", w);
			if (self._cfg.colors.length > 0) {

				color.removeAllColors();

			}

			for (var i in self._cfg.colors) {

				color.setColor(self._cfg.colors[i]);

			}
			self._cfg.autoRender && self.render(true);
		},
		//主标题
		drawTitle: function() {
			var self = this,
				paper = self.htmlPaper,
				cls = themeCls + "-title",
				_cfg = self._cfg,
				ctn = self._innerContainer,
				//高度占 60%
				h = ctn.y * 0.6;

			if (!self._title && _cfg.title.isShow && _cfg.title.content != "") {

				self._title = paper.rect(0, 0, self._$ctnNode.width(), h).addClass(cls).css(S.mix({
					"line-height": h + "px"
				}, _cfg.title.css));

			}

			if (self._title && _cfg.title.content != "") {

				self._title.html(_cfg.title.content);

			}
		},
		//副标题
		drawSubTitle: function() {
			var self = this,
				paper = self.htmlPaper,
				cls = themeCls + "-subtitle",
				_cfg = self._cfg,
				ctn = self._innerContainer,
				//高度占 40%
				h = ctn.y * 0.4;
			if (!self._subTitle && _cfg.subTitle.isShow && _cfg.subTitle.content != "") {
				self._subTitle = paper.rect(0, ctn.y * 0.6, self._$ctnNode.width(), h).addClass(cls).css(S.mix({
					"line-height": h + "px"
				}, _cfg.subTitle.css));
			}
			if (self._subTitle && _cfg.subTitle.content != "") {
				self._subTitle.html(_cfg.subTitle.content);
			}
		},
		//获取三角形位置信息
		getTrianglePos:function(){
			var self = this,point,ratio = self._cfg.triangles.ratio || 1,w = self.get("area-width")*ratio,ctn = self._innerContainer;
			self._trianglePos = {};
			for(var i in self._points[0]){
				point = self._points[0][i];
				self._trianglePos[i] = [point['x'],point['y'],point['x']-w/2,ctn.bl.y,point['x']/1+w/2,ctn.bl.y]
			}
		},
		//画三角
		drawTriangles: function(groupIndex, barIndex, callback) {
			var self = this,
				_cfg = self._cfg,
				paper = self.paper,
				ctn = self._innerContainer,
				pos;

			for(var i in self._trianglePos){
				pos = self._trianglePos[i];
				paper.path([
					"M",
					pos[0]+",",
					pos[1],
					"L",
					pos[2]+",",
					pos[3]+",",
					pos[4]+",",
					pos[5]+"Z"
				].join("")).attr({fill:self.color.getColor(i)['DEFAULT']});

			}
		},

		//x轴
		drawAxisX: function() {
			var self = this,
				_innerContainer = self._innerContainer,
				bl = _innerContainer.bl,
				w = _innerContainer.width,
				paper = self.htmlPaper,
				cls = self._cfg.themeCls + "-axisx";

			self._axisX = paper.lineX(bl.x, bl.y, w).addClass(cls).css(self._cfg.xAxis.css || {});
			return self._axisX;
		},
		//y轴
		drawAxisY: function() {
			var self = this,
				ctn = self._innerContainer,
				tl = ctn.tl,
				h = ctn.height,
				paper = self.htmlPaper,
				cls = self._cfg.themeCls + "-axisy";

			self._axisY = paper.lineY(tl.x, tl.y, h).addClass(cls).css(self._cfg.yAxis.css || {});

			return self._axisY;
		},
		drawLabelsX: function() {
			var self = this,
				_cfg = self._cfg,
				isY = _cfg.zoomType == "y" ? true : false;

			if (isY) {
				for (var i in self._pointsX) {
					self._labelX[i] = {
						0: self.drawLabelX(i, self._pointsX[i]['number'])
					};
				}
			} else {
				//画x轴刻度线
				for (var i in self._cfg.xAxis.text) {
					self._labelX[i] = {
						0: self.drawLabelX(i, self._cfg.xAxis.text[i])
					};
				}
			}
		},
		drawLabelsY: function() {
			var self = this,
				_cfg = self._cfg,
				isY = _cfg.zoomType == "x" ? false : true;

			if (isY) {
				//画x轴刻度线
				for (var i in self._cfg.yAxis.text) {
					self._labelY[i] = {
						0: self.drawLabelY(i, self._cfg.yAxis.text[i])
					}
				}
			} else {
				//画y轴刻度线
				for (var i in self._pointsY) {
					self._labelY[i] = {
						0: self.drawLabelY(i, self._pointsY[i].number),
						'num': self._pointsY[i].number
					}
				}
			}
		},
		//横轴标注
		drawLabelX: function(index, text) {
			var self = this,
				paper = self.htmlPaper,
				labels = self._pointsX,
				ctn = self._innerContainer,
				len = labels.length || 0,
				label,
				cls = self._cfg.themeCls + "-xlabels",
				tpl = "{{data}}",
				content = "";
			if (index < len) {
				tpl = self._cfg.xLabels.template || tpl;
				if (S.isFunction(tpl)) {
					content = tpl(index, text);
				} else {
					content = Template(tpl).render({
						data: text
					});
				}
				label = labels[index];
				label[0] = paper.text(label.x, ctn.bl.y, '<span class=' + cls + '>' + content + '</span>', "center").children().css(self._cfg.xLabels.css);
				return label[0];
			}
		},
		//纵轴标注
		drawLabelY: function(index, text) {
			var self = this,
				paper = self.htmlPaper,
				ctn = self._innerContainer,
				cls = self._cfg.themeCls + "-ylabels",
				tpl = "{{data}}",
				content = "";

			tpl = self._cfg.yLabels.template || tpl;
			if (S.isFunction(tpl)) {
				content = tpl(index, text);
			} else {
				content = Template(tpl).render({
					data: text
				});
			}

			return content && paper.text(ctn.tl.x, self._pointsY[index].y, '<span class=' + cls + '>' + content + '</span>', "right", "middle").children().css(self._cfg.yLabels.css);
		},
		renderLegend: function() {
			var self = this,
				legendCfg = self._cfg.legend,
				container = (legendCfg.container && $(legendCfg.container)[0]) ? $(legendCfg.container) : self._$ctnNode;

			var innerContainer = self._innerContainer;
			var colors = self.color._colors, //legend icon 的颜色表，循环
				len = colors.length,
				cfg = self._cfg,
				series = self._cfg.series
			var __legendCfg = S.map(series, function(serie, i) {
				i = i % len;
				var item = {},
					color = colors[i]
					item.text = serie.text;
				item.DEFAULT = color.DEFAULT;
				item.HOVER = color.HOVER;
				return item;
			});
			var globalConfig = S.merge({
				// icontype:"circle",
				// iconsize:10,
				interval: 20, //legend之间的间隔
				iconright: 5, //icon后面的空白
				showicon: true //默认为true. 是否显示legend前面的小icon——可能用户有自定义的需求
			}, cfg.legend.globalConfig);

			self.legend = new Legend({
				container: container,
				bbox: {
					width: innerContainer.width,
					height: innerContainer.height,
					left: innerContainer.x,
					top: innerContainer.y
				},
				align: cfg.legend.align || "bc",
				offset: cfg.legend.offset || (/t/g.test(cfg.legend.align) ? [0, 0] : [0,20]),
				globalConfig: globalConfig,
				config: __legendCfg
			});

			self.legend.on("click", function(evt) {
				var i = evt.index,
					$text = evt.text,
					$icon = evt.icon,
					el = evt.el
				if (el.hide != 1) {
					this.hideBar(i);
					el.hide = 1;
					el.disable();
				} else {
					this.showBar(i);
					el.hide = 0;
					el.enable();
				}
			}, this);
			return self.legend;
		},
		render: function(clear) {

			var self = this,

				_cfg = self._cfg,

				ctn = self._innerContainer,

				themeCls = _cfg.themeCls;

			clear && self._$ctnNode.html("");
			//渲染html画布 只放图形
			self.paper = Raphael(self._$ctnNode[0], _cfg.width, _cfg.height);
			//clone
			self._clonePoints = self._points;

			self.getTrianglePos();
			//渲染html画布
			self.htmlPaper = new HtmlPaper(self._$ctnNode);

			self.drawTitle();

			self.drawSubTitle();
			//画横轴
			_cfg.xAxis.isShow && self.drawAxisX();

			_cfg.yAxis.isShow && self.drawAxisY();
			//画横轴刻度
			_cfg.xLabels.isShow && self.drawLabelsX();

			_cfg.yLabels.isShow && self.drawLabelsY();

			self.getTrianglePos();

			// _cfg.legend.isShow && self.renderLegend();
			//画柱
			self.drawTriangles(function() {
				S.log("finished");
				self.afterRender();
			});

			self.bindEvt();

			S.log(self);

		},
		renderLegend: function() {
			var self = this,
				legendCfg = self._cfg.legend,
				container = (legendCfg.container && $(legendCfg.container)[0]) ? $(legendCfg.container) : self._$ctnNode;

			var stocks = self._stocks;

			var innerContainer = self._innerContainer;
			var colors = self.color._colors, //legend icon 的颜色表，循环
				len = colors.length,
				cfg = self._cfg,
				series = self._cfg.series
			var __legendCfg = S.map(series, function(serie, i) {
				i = i % len;
				var item = {},
					color = colors[i]
					item.text = serie.text;
				item.DEFAULT = color.DEFAULT;
				item.HOVER = color.HOVER;
				var type = stocks[i].type;
				item.icontype = "line" + type;
				item.iconsize = [1, 1];
				return item;
			});

			var globalConfig = S.merge({
				interval: 20, //legend之间的间隔
				iconright: 5, //icon后面的空白
				showicon: true //默认为true. 是否显示legend前面的小icon——可能用户有自定义的需求
			}, cfg.legend.globalConfig);

			self.legend = new Legend({
				container: container,
				paper: self.paper,
				bbox: {
					width: innerContainer.width,
					height: innerContainer.height,
					left: innerContainer.x,
					top: innerContainer.y
				},
				align: cfg.legend.align || "bc",
				offset: cfg.legend.offset || [0, 30],
				globalConfig: globalConfig,
				config: __legendCfg
			});
			self.legend.on("click", function(evt) {
				var i = evt.index,
					$text = evt.text,
					$icon = evt.icon,
					el = evt.el
				if (el.hide != 1) {
					this.hideLine(i);
					el.hide = 1;
					el.disable();
				} else {
					this.showLine(i);
					el.hide = 0;
					el.enable();
				}
			}, this);

			return self.legend;
		},
		bindEvt: function() {
			var self = this,
				_cfg = self._cfg;

		},
		paperLeave: function() {
			var self = this;
			self.fire("paperLeave", self);
		},
		barChange: function(barGroup, barIndex) {
			var self = this,
				currentBars = self._bars[barGroup],
				e = S.mix({
					target: currentBars['bars'][barIndex],
					currentTarget: currentBars['bars'][barIndex],
					barGroup: Math.round(barGroup),
					barIndex: Math.round(barIndex)
				}, self._points[barGroup][barIndex]);
			self.fire("barChange", e);
		},
		//处理网格和标注
		animateGridsAndLabels: function() {
			var self = this;
			for (var i in self._labelY) {
					self._labelY[i] && self._labelY[i][0] && self._labelY[i][0].remove();
					self._gridsY[i] && self._gridsY[i][0] && self._gridsY[i][0].remove();
				}
				self.drawGridsY();
				self.drawLabelsY();
		},
		processAttr: function(attrs, color) {
			var newAttrs = S.clone(attrs);
			for (var i in newAttrs) {
				if (newAttrs[i] && typeof newAttrs[i] == "string") {
					newAttrs[i] = newAttrs[i].replace(COLOR_TPL, color);
				}
			}
			return newAttrs;
		},
		afterRender: function() {
			var self = this;
			self.fire("afterRender", self);
		},
		getRaphaelPaper: function() {
			return this.paper;
		},
		getHtmlPaper:function(){
			return this.htmlPaper;
		},
		//清空画布上的内容
		clear: function() {
			return this.paper.clear();
		}
	});
	return TriangleChart;

}, {
	requires: [
		'gallery/template/1.0/index',
		'gallery/kcharts/1.2/basechart/index',
		'./theme',
		'gallery/kcharts/1.2/raphael/index',
		'gallery/kcharts/1.2/tools/color/index',
		'gallery/kcharts/1.2/tools/htmlpaper/index',
		'gallery/kcharts/1.2/legend/index',
		'gallery/kcharts/1.2/tools/touch/index',
		'gallery/kcharts/1.2/tip/index'
	]
});
