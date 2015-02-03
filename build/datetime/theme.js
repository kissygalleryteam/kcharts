define('kg/kcharts/5.0.1/datetime/theme',[],function(require, exports, module) {

	var COLOR_TPL = "{COLOR}";

	var themeCfg = {
		
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