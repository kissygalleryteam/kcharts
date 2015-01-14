define(function(require,exports,module) {
	var clsPrefix = "ks-chart-",
		themeCls = clsPrefix + "default",
		COLOR_TPL = "{COLOR}";
	return {
				themeCls: themeCls,
				autoRender: true,
				colors: [],
				stackable: false,
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
				bars: {
					isShow: true,
					attr: {
						fill: COLOR_TPL,
						"stroke-width": "0"
					},
					barsRatio: 0.6,
					barRatio: 0.5
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
});