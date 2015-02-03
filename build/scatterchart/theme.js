define('kg/kcharts/5.0.1/scatterchart/theme',[],function(require, exports, module) {


	var COLOR_TPL = "{COLOR}";

	var themeCfg = {
		
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
			points:{
				attr:{
					stroke:"#fff",
					"r":4,
					"stroke-width":0,
					"fill":COLOR_TPL
				},
				hoverAttr:{
					stroke:"#fff",
					"r":5,
					"fill":COLOR_TPL,
					"stroke-width":0
				}
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
			points:{
				attr:{
					stroke:"#fff",
					"r":4,
					"stroke-width":0,
					"fill":COLOR_TPL
				},
				hoverAttr:{
					stroke:"#fff",
					"r":5,
					"fill":COLOR_TPL,
					"stroke-width":0
				}
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
			points:{
				attr:{
					stroke:"#fff",
					"r":4,
					"stroke-width":0,
					"fill":COLOR_TPL
				},
				hoverAttr:{
					stroke:"#fff",
					"r":5,
					"fill":COLOR_TPL,
					"stroke-width":0
				}
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