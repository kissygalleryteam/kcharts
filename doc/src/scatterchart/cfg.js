define(function(require,exports,module) {
	var clsPrefix = "ks-chart-",
		themeCls = clsPrefix + "default",
		COLOR_TPL = "{COLOR}";
	return {
				themeCls: themeCls,
				autoRender: true,
				title: {
					content: "",
					css: {
						"text-align": "center",
						"font-size": "16px"
					},
					isShow: true
				},
				colors: [],
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
					attr: {
						"stroke": "#fff",
						"r": 4,
						"stroke-width": 0,
						"fill": COLOR_TPL,
						"opacity": 0.6
					},
					hoverAttr: {
						"stroke": "#fff",
						"r": 5,
						"fill": COLOR_TPL,
						"stroke-width": 0,
						"opacity": 1
					}
				},
				legend: {
					isShow: false
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
					isShow: true,
					css: {}
				},
				//y轴上横向网格
				yGrids: {
					isShow: true,
					css: {}
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
});