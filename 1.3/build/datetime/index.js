/*
combined files : 

gallery/kcharts/1.3/datetime/theme
gallery/kcharts/1.3/datetime/cfg
gallery/kcharts/1.3/datetime/index

*/
;
KISSY.add("gallery/kcharts/1.3/datetime/theme", function(S) {

	var COLOR_TPL = "{COLOR}";

	var themeCfg = {
		//默认主题
		"ks-chart-default": {
			lineType: "arc",
			anim: false,
			title: {
				content: "",
				css: {
					"text-align": "center",
					"font-size": "16px",
					"font-weight": "bold",
					"color": "#666"
				},
				isShow: true
			},
			subTitle: {
				content: "",
				css: {
					"text-align": "center",
					"font-size": "12px",
					"color": "#666"
				},
				isShow: true
			},
			line: {
				attr: {
					"stroke-width": 1
				},
				hoverAttr: {
					"stroke-width": 1
				}
			},
			points: {
				isShow: false,
				attr: {
					type: "circle",
					stroke: "#fff",
					"r": 0,
					"stroke-width": 1.5,
					"fill": COLOR_TPL
				},
				hoverAttr: {
					type: "circle",
					stroke: "#fff",
					"r": 5,
					"fill": COLOR_TPL,
					"stroke-width": 0
				}
			},
			xGrids: {
				isShow: false,
				css: {
					color: "#eee"
				}
			},
			yGrids: {
				css: {
					color: "#eee"
				}
			},
			yAxis: {
				isShow: false,
				css: {
					color: "#000"
				}
			},
			xAxis: {
				css: {
					color: "#000"
				}
			},
			xLabels: {
				css: {
					"color": "#666",
					"font-size": "12px"
				}
			},
			yLabels: {
				css: {
					"color": "#666",
					"font-size": "12px",
					marginLeft: -10
				}
			},
			pointLine: {
				css: {
					color: "#aaa"
				}
			},
			tip: {
				css: {
					"border": "1px solid {COLOR}"
				},
				alignX: "right",
				css: {
					"border-color": "{COLOR}"
				},
				offset: {
					y: -10,
					x: -10
				}
			}
		}
	}

	return themeCfg;

});
;KISSY.add("gallery/kcharts/1.3/datetime/cfg",function(S){
	var clsPrefix = "ks-chart-",
		themeCls = clsPrefix + "default",
		COLOR_TPL = "{COLOR}";
	return {
				themeCls: themeCls,
				autoRender: true,
				comparable: false,
				lineType: "straight",
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
				//圆形的点 r 为半径
				points: {
					isShow:false,
					attr: {
						type: "circle",
						stroke: "#fff",
						"r": 0,
						"stroke-width": 1.5,
						"fill": COLOR_TPL
					},
					hoverAttr: {
						type: "circle",
						stroke: "#fff",
						"r": 3,
						"fill": COLOR_TPL,
						"stroke-width": 1
					}
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
						zIndex: 10
					}
				},
				//纵轴
				yAxis: {
					isShow: true,
					css: {
						zIndex: 10
					},
					num: 5
				},
				//x轴上纵向网格
				xGrids: {
					isShow: false,
					css: {}
				},
				//y轴上横向网格
				yGrids: {
					isShow: true,
					css: {}
				},
				//折线填充块
				areas: {
					isShow: true,
					attr: {
						"fill": "90-#fff-" + COLOR_TPL,
						"stroke-width": 0,
						"opacity": 0.5
					}
				},
				//折线
				line: {
					isShow: true,
					attr: {
						"stroke-width": "3px"
					},
					hoverAttr: {
						"stroke-width": "4px"
					}
				},
				//点的对齐线
				pointLine: {
					isShow: false,
					css: {}
				},
				legend: {
					isShow: false
				},
				tip: {
					isShow: true,
					clsName: "",
					template: "",
					css: {

					},
					offset: {
						x: 0,
						y: 0
					},
					boundryDetect: true
				}

			};
})
/**
 * @fileOverview KChart 1.3  datetime
 * @author huxiaoqi567@gmail.com
 */
;
KISSY.add("gallery/kcharts/1.3/datetime/index", function(S, D, Evt, Node, Base, Template, LineChart, Raphael, BaseChart, ColorLib, HtmlPaper, Legend, Theme, Touch, Tip, Anim, graphTool, Cfg) {
	var $ = S.all,
		clsPrefix = "ks-chart-",
		themeCls = clsPrefix + "default",
		evtLayoutCls = clsPrefix + "evtlayout",
		evtLayoutAreasCls = evtLayoutCls + "-areas",
		evtLayoutRectsCls = evtLayoutCls + "-rects",
		COLOR_TPL = "{COLOR}",
		//点的类型集合
		POINTS_TYPE = ["circle", "triangle", "rhomb", "square"],
		color;

	var methods = {
		init: function() {
			var self = this,
				points;
			self.chartType = "datetime";
			var defaultCfg = S.clone(Cfg);
			// KISSY > 1.4 逻辑
			self._cfg = S.mix(defaultCfg, self.userConfig,undefined,undefined,true);
			BaseChart.prototype.init.call(self, self._cfg);
			self._cfg.autoRender && self.render();
		}
	}

	var DateTime;
	if (Base.extend) {
		DateTime = LineChart.extend(methods);
	} else {
		DateTime = function(cfg) {
			var self = this;
			self.userConfig = cfg;
			self.init();
		};
		S.extend(DateTime, LineChart, methods);
	}
	return DateTime;
}, {
	requires: [
		'dom',
		'event',
		'node',
		'base',
		'gallery/template/1.0/index',
		'gallery/kcharts/1.3/linechart/index',
		'gallery/kcharts/1.3/raphael/index',
		'gallery/kcharts/1.3/basechart/index',
		'gallery/kcharts/1.3/tools/color/index',
		'gallery/kcharts/1.3/tools/htmlpaper/index',
		'gallery/kcharts/1.3/legend/index',
		'./theme',
		'gallery/kcharts/1.3/tools/touch/index',
		'gallery/kcharts/1.3/tip/index',
		'gallery/kcharts/1.3/animate/index',
		'gallery/kcharts/1.3/tools/graphtool/index',
		'./cfg'
	]
});
