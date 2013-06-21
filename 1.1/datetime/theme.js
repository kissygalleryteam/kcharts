KISSY.add("gallery/kcharts/1.1/datetime/theme",function(S){

	var COLOR_TPL = "{COLOR}";

	var themeCfg = {
		//默认主题
		"ks-chart-default":{
			 lineType:"arc",
			anim:false,
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
		    line:{
              attr:{
                "stroke-width":1
              },
                hoverAttr:{
                    "stroke-width":1
                }
            },
			points:{
				attr:{
					stroke:"#fff",
					"r":4,
					"stroke-width":1.5,
					"fill":COLOR_TPL
				}
			},
			 xGrids:{
                isShow:false
            },
			yGrids:{
				css:{
					color:"#eee"
				}
			},
			yAxis:{
				isShow:false,
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
					"font-size": "12px",
					 marginLeft:-10
				}
			},
			pointLine:{
				css:{
					color:"#ccc"
				}
			},
			tip:{
				css:{
					"border":"1px solid {COLOR}"
				},
				alignX:"right",
		        css:{"border-color":"{COLOR}"},
		        offset:{
		          y:-10,
		          x:-10
		        }
			}
		}
	}

	return themeCfg;

});