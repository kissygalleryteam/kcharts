define('kg/kcharts/5.0.1/mapchart/theme',[],function(require, exports, module) {

   var COLOR_TPL = "{COLOR}";
    return{
        "ks-chart-default": {
            title: {
                css: {
                    "text-align": "center",
                    "font-size": "16px",
                    "font-weight": "bold",
                    "color": "#666",
                    "margin": "5px"
                }
            },
            area: {
                attr: {
                    "fill": "#f0efeb",
                    "stroke": "#fff"
                },
                hoverAttr: {
                    "fill": "#add3ee",
                    "stroke": "#fff"
                }
            },
            areaText: {
                css: {
                    "font-size": "12px",
                    "color": "#000",
                    "font-weight": "normal",
                    "display": "block",
                    "cursor": "pointer"
                },
                hoverCss: {
                }
            },
            tip: {
                css: {
                    "padding": "5px 15px",
                    "border": "2px solid {COLOR}",
                    "border-radius": "6px",
                    "background-color": "#fff",
                    "font-size": "14px"
                }
            }
        },
        "ks-chart-orange": {
            title: {
                css: {
                    "text-align": "center",
                    "font-size": "16px",
                    "font-weight": "bold",
                    "color": "#666",
                    "margin": "5px"
                }
            },
            area: {
                attr: {
                    "fill": "#FF8E58",
                    "stroke": "#fff",
                    "stroke-width": 1,
                    "stroke-linejoin": "round"
                },
                hoverAttr: {
                    "fill": "#B9A66B",
                    "cursor": "pointer"
                }
            },
            areaText: {
                css: {
                    "font-size": "10px",
                    "color": "#000",
                    "font-weight": "normal",
                    "display": "block",
                    "cursor": "pointer"
                },
                hoverCss: {
                }
            },
            tip: {
                css: {
                    "border": "2px solid #000",
                    "backgroundColor": "#fff",
                    "fontSize": "12px",
                    "padding": "5px"
                }
            }
        }
    }
});