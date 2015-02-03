define('kg/kcharts/5.0.1/barchart/cfg',[],function(require, exports, module) {

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
						"position": "absolute" 
					}
				},
				yLabels: {
					isShow: true,
					css: {
						"color": "#666",
						"font-size": "12px",
						"white-space": "nowrap",
						"position": "absolute" 
					}
				},
				
				xAxis: {
					isShow: true,
					css: {
						color: "#eee",
						zIndex: 10
					},
					min:0
				},
				
				yAxis: {
					isShow: true,
					css: {
						zIndex: 10
					},
					num: 5,
					min:0
				},
				
				xGrids: {
					isShow: true,
					css: {

					}
				},
				
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
					alignX: "right", 
					alignY: "bottom"
				}
			};
});