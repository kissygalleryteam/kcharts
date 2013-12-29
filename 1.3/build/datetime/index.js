/*
combined files : 

gallery/kcharts/1.3/datetime/theme
gallery/kcharts/1.3/datetime/index

*/
;KISSY.add("gallery/kcharts/1.3/datetime/theme",function(S){

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
/**
 * @fileOverview KChart 1.3  datetime
 * @author huxiaoqi567@gmail.com
 */
;KISSY.add("gallery/kcharts/1.3/datetime/index",function(S,D,Evt,Node,Base,Template,Raphael,BaseChart,ColorLib,HtmlPaper,Legend,Theme,undefined,Tip,Anim,graphTool){
	var $ = S.all,
		clsPrefix = "ks-chart-",
		themeCls = clsPrefix + "default",
		evtLayoutCls = clsPrefix + "evtlayout",
		evtLayoutAreasCls = evtLayoutCls+"-areas",
		evtLayoutRectsCls = evtLayoutCls + "-rects",
		COLOR_TPL = "{COLOR}",
		//点的类型集合
		POINTS_TYPE = ["circle","triangle","rhomb","square"],
		color;
    var methods = {
        initializer: function(){
            this.init();
		},
		init:function(){
            // 兼容kissy < 1.4版本的
            this._cfg || (this._cfg = this.userConfig);

			var self = this,points;

			BaseChart.prototype.init.call(self,self._cfg);

			self.chartType = "linechart";

			if(!self._$ctnNode[0]) return;

			var _defaultConfig = {
					themeCls:themeCls,
					autoRender:true,
					comparable:false,
					lineType:"straight",
					colors:[],
					title:{
		            	content:"",
		            	css:{
		            		"text-align":"center",
		            		"font-size":"16px"
		            	},
		            	isShow:true
		            },
		            subTitle:{
		            	content:"",
		            	css:{
		            		"text-align":"center",
		            		"font-size":"12px"
		            	},
		            	isShow:true
		            },
					//圆形的点 r 为半径
					points:{
					 	attr:{
					 		type:"circle",
					 		stroke:"#fff",
					 		"r":4,
					 		"stroke-width":1.5,
					 		"fill":COLOR_TPL
					 	},
					 	hoverAttr:{
					 		type:"circle",
					 		stroke:"#fff",
					 		"r":5,
					 		"fill":COLOR_TPL,
					 		"stroke-width":0
					 	}
					 },
					xLabels:{
						isShow:true,
						css:{
							"color":"#666",
							"font-size": "12px",
							"white-space":"nowrap",
							"position":"absolute" 	//修复ie7被遮住的Bug
						}
					},
					yLabels:{
						isShow:true,
						css:{
							"color":"#666",
							"font-size": "12px",
							"white-space":"nowrap",
							"position":"absolute" 	//修复ie7被遮住的Bug
						}
					},
					//横轴
					xAxis:{
						isShow:true,
						css:{
							zIndex:10
						}
					},
					//纵轴
					yAxis:{
						isShow:true,
						css:{
							zIndex:10
						},
						num:5
					},
					//x轴上纵向网格
					xGrids:{
						isShow:true,
					 	css:{
					 	}
					 },
					 //y轴上横向网格
					 yGrids:{
					 	isShow:true,
					 	css:{
					 	}
					 },
					 //折线填充块
					 areas:{
					 	isShow:true,
					 	attr:{
					 		"fill":"90-#fff-"+COLOR_TPL,
					 		"stroke-width":0,
					 		"opacity":0.5
					 	}
					 },
					 //折线
					 line:{
					 	isShow:true,
					 	attr:{
					 		"stroke-width":"3px"
					 	},
					 	hoverAttr:{
					 		"stroke-width":"4px"
					 	}
					 },
					 //点的对齐线
					 pointLine:{
					 	isShow:false,
					 	css:{}
					 },
					 legend:{
					 	isShow:false
					 },
					 tip:{
					 	isShow:true,
					 	clsName:"",
						template:"",
						css:{

						},
						offset:{
							x:0,
							y:0
						},
						boundryDetect:true
					 }

				};

			self._lines = {};
			//统计渲染完成的数组
			self._finished = [];
			//主题
			themeCls = self._cfg.themeCls || _defaultConfig.themeCls;

			self._cfg = S.mix(S.mix(_defaultConfig,Theme[themeCls],undefined,undefined,true),self._cfg,undefined,undefined,true);

			self.color = color = new ColorLib({themeCls:themeCls});

			if(self._cfg.colors.length > 0){
				color.removeAllColors();
			}

			for(var i in self._cfg.colors){
				color.setColor(self._cfg.colors[i]);
			}
			//克隆详细配置 line points
			self.__cfg = self.cloneSeriesConfig(['line','points']);

			points = self._points[0];

			w = Math.round((points && points[0] && points[1] && points[1].x - points[0].x) || self.getInnerContainer().width)

			w && self.set("area-width",w);

			self._cfg.autoRender && self.render(true);
		},
		//获取属性
		cloneSeriesConfig:function(wl){
			var self = this,
				cfgs = {},
				cfg;
				var cloneCfg = S.clone(self._cfg);
			if(!wl) return;
			for(var i in wl){
				for(var j in self._cfg.series){
					cfg = self._cfg.series[j][wl[i]] ? S.mix(cloneCfg[wl[i]],self._cfg.series[j][wl[i]],undefined,undefined,true) : self._cfg[wl[i]];
					if(cfg){
						if(!cfgs[wl[i]]){
							cfgs[wl[i]] = [];
						}
						cfgs[wl[i]][j] = cfg;
					}
				}
			}
			return cfgs;
		},
		//主标题
		drawTitle:function(){
			var self = this,
				paper = self.htmlPaper,
				cls = themeCls + "-title",
				_cfg = self._cfg,
				ctn = self._innerContainer,
				//高度占 60%
				h = ctn.y * 0.6;

			if(_cfg.title.isShow && _cfg.title.content != ""){
				self._title = paper.rect(0,0,self._$ctnNode.width(),h).addClass(cls).css(S.mix({"line-height":h+"px"},_cfg.title.css)).html(_cfg.title.content);
			}
		},
		//副标题
		drawSubTitle:function(){
			var self = this,
				paper = self.htmlPaper,
				cls = themeCls + "-subtitle",
				_cfg = self._cfg,
				ctn = self._innerContainer,
				//高度占 40%
				h = ctn.y * 0.4;

			if(_cfg.subTitle.isShow && _cfg.subTitle.content != ""){
				self._subTitle = paper.rect(0,ctn.y * 0.6,self._$ctnNode.width(),h).addClass(cls).css(S.mix({"line-height":h+"px"},_cfg.subTitle.css)).html(_cfg.subTitle.content);
			}
		},
		//获取有效的点数目
		getRealPointsNum:function(points){
			var j = 0;
			for(var i in points){
				if(points[i]['x'] && points[i]['y']){
					j ++;
				}
			}
			return j;
		},
		//获取默认可见的直线数量
		getVisableLineNum:function(){
			var self = this,
				_cfg = self._cfg,
				len = _cfg.series.length,
				tmpLen = len;

				for (var i = 0;i < len;i++){
					if(_cfg.series[i]['isShow'] == false){
						tmpLen --;
					}
				}
			return tmpLen;
		},
		//画线
		drawLine:function(lineIndex,callback){
			var self = this,
				points = self._points[lineIndex];

			if(points && points.length){
			var	path = self.getLinePath(points),
				paper = self.paper,
				color = self.color.getColor(lineIndex).DEFAULT,
				//获取线配置
				lineAttr = self.__cfg['line'][lineIndex]['attr'],
				line = paper.path(path).attr(lineAttr).attr({"stroke":color}),
				//默认显示的直线条数
				show_num = self.getVisableLineNum();
				//finish state
				self._finished.push(true);

				if(self._finished.length == show_num && callback){
						callback();
				}

				return line;
			}
		},
		//画块状区域
		drawArea:function(lineIndex,callback){
			var self = this;
			//不显示
			if(!self._cfg.areas.isShow) return;
			var	points = self._points[lineIndex];

			if(points && points.length){
			var	path = self.getAreaPath(points),
				paper = self.paper,
				color = self.color.getColor(lineIndex).DEFAULT,
				//获取线配置
				areaAttr = self._cfg['areas']['attr'],
				area = paper.path(path).attr(self.processAttr(areaAttr,color));
				return area;
			}

		},
		//获取第一个不为空数据的索引
		getFirstUnEmptyPointIndex:function(lineIndex){
			var self = this,
				points = self._points[lineIndex];
				for(var i in points){
					if(!self.isEmptyPoint(points[i])) return i;
				}
			return;
		},
		//曲线动画
		animateLine:function(lineIndex,callback){
			var self = this,sub_path,
				idx = 0,
				from = 0,to,box,
				show_num,
				first_index,
				_cfg = self._cfg,
				paper = self.paper,
				points = self._points[lineIndex],
				type = self._stocks[lineIndex]['type'],
				path = self.getLinePath(points),
				total_len = Raphael.getTotalLength(path),
				//总共的点 包含不带x,y的点
				total_num = points.length || 0,
				//获取有效点的个数
				real_num = self.getRealPointsNum(points),
				duration = _cfg.anim ? _cfg.anim.duration || 500 : 500,
				easing = "easeNone",
				// 每段直线的宽度
				aver_len = self.get("area-width"),
				_attr = S.mix({"stroke":color.getColor(lineIndex).DEFAULT},_cfg.line.attr),
				lineAttr = self.__cfg['line'][lineIndex]['attr'],
				$line = paper.path(sub_path).attr(lineAttr).attr({"stroke":color.getColor(lineIndex).DEFAULT});
				first_index = self.getFirstUnEmptyPointIndex(lineIndex);
			    //默认显示的直线条数
				show_num = self.getVisableLineNum();
				//动画
				var anim = new Anim({},{},{
					duration:duration,
					easing:easing,
					step:function(){
							//arguments[1] 代表经过缓动函数处理后的0到1之间的数值
							to = arguments[1] * total_len;
							//获取子路径
							sub_path = Raphael.getSubpath(path,from,to);
							//获取路径所占的矩形区域
							box = Raphael.pathBBox(sub_path);
							//当前渲染点的索引
							idx = Math.floor((box.width*1.01)/aver_len) - (-first_index);
							$line && $line.attr({path:sub_path});
					},
					end:function(){
						//finish state
						self._finished.push(true);

						if(self._finished.length == show_num && callback){
								callback();
						}
					}
				});

				return $line;
		},
		/**
			TODO 获取直线的路径
		**/
		getLinePath:function(points){
			var self = this,
				path = "",
				ctnY = self._innerContainer.bl.y,
				len = self.getRealPointsNum(points),
				start = 0;
			//找出起始点
			if(!points) return "";

			start = (function(){
				for(var i in points){
					if(!self.isEmptyPoint(points[i])){
						return Math.round(i);
					}
				}
			})();

			path += "M" + points[start]['x'] + "," + points[start]['y'];
			//当只有2个点的时候 则用直线绘制
			if(self._cfg.lineType == "arc" && len > 2){
				path += " R";
				for(var i = start + 1,len = points.length;i < len;i++)if(points[i]['x'] && points[i]['y']){
					//贝塞尔曲线
					path +=  points[i]['x'] + "," + points[i]['y'] + " ";
				}
			}else{
				for(var i = start+1,len = points.length;i < len;i++)if(points[i]['x'] && points[i]['y']){
					path += " L" + points[i]['x'] + "," + points[i]['y'];
				}
			}
			return path;
		},
		//获取块区域的路径
		getAreaPath:function(points){
			var self = this;
			var linepath = self.getLinePath(points);
			var ctn = self.getInnerContainer();
			var path = [linepath," L",ctn.br.x,",",ctn.br.y," ",ctn.bl.x,",",ctn.bl.y," z"].join("");
			return path;
		},
		//画线
		drawLines:function(callback){
			var self = this,
				_cfg = self._cfg,
				len = POINTS_TYPE.length;

				self._lines = {};
				self._stocks = {};

				for(var i in self._points){
					var path = self.getLinePath(self._points[i]),
						curColor = color.getColor(i),
						pointsAttr = self.processAttr(self._cfg.points.attr,curColor.DEFAULT),
						hoverAttr = self.processAttr(self._cfg.points.hoverAttr,curColor.HOVER),
						area,line;

					//保存点的信息
					self._stocks[i] = {
						points:self._points[i],
						color:curColor,
						attr:pointsAttr,
						hoverAttr:hoverAttr,
						type:pointsAttr.type == "auto" ? POINTS_TYPE[i%len] : pointsAttr.type
					};

					// line = _cfg.series[i]['isShow'] == false ? undefined : self.drawLine(i,callback);
					if(_cfg.series[i]['isShow'] !== false){
						area = self._areas[i] = self.drawArea(i);
						line = self.drawLine(i,callback);
					}

					self._lines[i] = {
						line:line,
						path:path,
						points:self._points[i],
						color:curColor,
						attr:S.mix({stroke:curColor.DEFAULT},self._cfg.line.attr),
						isShow:_cfg.series[i]['isShow'] === false ? false : true	//保存直线是否展示的信息
					};
				}
			return self._lines;
		},
		//处理颜色模版
		processAttr:function(attrs,color){
			var newAttrs = S.clone(attrs);
			for(var i in newAttrs){
				if(newAttrs[i] && typeof newAttrs[i] == "string"){
						newAttrs[i] = newAttrs[i].replace(COLOR_TPL,color);
				}
			}
			return newAttrs;
		},
		drawStocks:function(){
			var self = this,point;
			for(var i in self._stocks){
				self._stocks[i]['stock'] = self.drawStock(0,0,self._stocks[i]['attr']).hide();
			}
		},
		//画单个圆点
		drawStock:function(x,y,attr,type){
			var self = this,
				paper = self.paper,
				_attr = self._cfg.points.attr,
				$stock;

			if(x !== undefined && y !== undefined){
				switch(type){
					case "triangle":
						$stock = graphTool.triangle(paper,x,y,_attr["r"]*1.4);
						break;
					case "rhomb":
						$stock = graphTool.rhomb(paper,x,y,_attr["r"]*2.4,_attr["r"]*2.4);
						break;
					case "square":
						//菱形旋转45度
						$stock = graphTool.rhomb(paper,x,y,_attr["r"]*2.4,_attr["r"]*2.4,45);
						break;
					default:
						$stock = paper.circle(x,y,_attr["r"],attr);
						break;
				}

				$stock.attr(_attr).attr(attr);

				return $stock;
			}
			return "";
		},
		//x轴上 平行于y轴的网格线
		drawGridsX:function(){
			if(!this._cfg.xGrids.isShow) return;
			var self = this,
				points = self._points[0],
				gridPointsX = function(){
					var len = points.length,
						tmp = [];
					if(len > 1){
						var d = (points[1]['x'] - points[0]['x'])/2;
						tmp.push({x:points[0]['x'] - d})
						for(var i in points){
							tmp.push({x:points[i]['x'] - (-d)});
						}
					}
					return tmp;
				}();

			for(var i = 0,len = gridPointsX.length;i<len;i++){
				var grid = self.drawGridX(gridPointsX[i]);
				self._gridsX.push(grid);
			}
			return self._gridsX;
		},
		drawGridX:function(point,css){
			var self = this,
				y = self._innerContainer.tl.y,
				h = self._innerContainer.height,
				css = css || self._cfg.xGrids.css,
				paper = self.htmlPaper,
				cls = self._cfg.themeCls + "-gridsx";

			return paper.lineY(point.x,y,h).addClass(cls).css(self._cfg.xGrids.css);
		},
		drawGridY:function(point,css){
			var self = this,
				w = self._innerContainer.width,
				css = css || self._cfg.yGrids.css,
				paper = self.htmlPaper,
				cls = self._cfg.themeCls + "-gridsy";

			return paper.lineX(point.x,point.y,w).addClass(cls).css(css);
		},
		//y轴上 平行于x轴的网格线
		drawGridsY:function(){
			if(!this._cfg.yGrids.isShow) return;
			var self = this,
				x = self._innerContainer.tl.x,
				points = self._pointsY;

			for(var i = 0,len = points.length;i<len;i++){
				self._gridsY[i] = {
					0:self.drawGridY({x:x,y:points[i].y}),
					num:self.coordNum[i]
				};
			}
		},
		//x轴
		drawAxisX:function(){
			if(!this._cfg.xAxis.isShow) return;
			var self = this,
				_innerContainer = self._innerContainer,
				bl = _innerContainer.bl,
				w = _innerContainer.width,
				paper = self.htmlPaper,
				cls = self._cfg.themeCls + "-axisx";

			self._axisX =  paper.lineX(bl.x,bl.y,w).addClass(cls).css(self._cfg.xAxis.css || {});

			return self._axisX;
		},
		//y轴
		drawAxisY:function(){
			if(!this._cfg.yAxis.isShow) return;
			var self = this,
				_innerContainer = self._innerContainer,
				tl = _innerContainer.tl,
				h = _innerContainer.height,
				paper = self.htmlPaper,
				cls = self._cfg.themeCls + "-axisy";

				self._axisY = paper.lineY(tl.x,tl.y,h).addClass(cls).css(self._cfg.yAxis.css || {});
			return self._axisY;
		},
		drawLabelsX:function(){
			if(!this._cfg.xLabels.isShow) return;
			var self = this,
				text = self._cfg.xAxis.text;
			//画x轴刻度线
				for(var i in text){
						self._labelX[i] = self.drawLabelX(i,text[i]);
				}
		},
		drawLabelsY:function(){
			if(!this._cfg.yLabels.isShow) return;
			var self = this;
			//画y轴刻度线
			for(var i in self._pointsY){
				self._labelY[i] = {
					0:self.drawLabelY(i,self._pointsY[i].number),
					'num':self._pointsY[i].number
				}
			}
			return self._labelY;
		},
		//横轴标注
		drawLabelX:function(index,text){
			var self = this,
				paper = self.htmlPaper,
				labels = self._pointsX,
				len = labels.length || 0,
				label,
				cls = self._cfg.themeCls + "-xlabels",
				tpl = "{{data}}",
				content = "";
				if(index < len){
					tpl = self._cfg.xLabels.template || tpl;
					if(S.isFunction(tpl)){
						content = tpl(index,text);
					}else{
						content = Template(tpl).render({data:text});
					}
					label = labels[index];
					label[0] = content && paper.text(label.x,label.y,'<span class='+cls+'>'+content+'</span>',"center").children().css(self._cfg.xLabels.css);
					return label[0];
				}
		},
		//纵轴标注
		drawLabelY:function(index,text){
			var self = this,
				paper = self.htmlPaper,
				cls = self._cfg.themeCls + "-ylabels",
				tpl = "{{data}}",
				content = "";

				tpl = self._cfg.yLabels.template || tpl;
				if(S.isFunction(tpl)){
					content = tpl(index,text);
				}else{
					content = Template(tpl).render({data:text});
				}

			return content && paper.text(self._pointsY[index].x,self._pointsY[index].y,'<span class='+cls+'>'+content+'</span>',"right","middle").children().css(self._cfg.yLabels.css);
		},
		//参照线
		drawPointLine:function(){
			var self = this,
				paper = self.htmlPaper,
				cls = self._cfg.themeCls + "-pointline",
				ctn = self._innerContainer;
			 self._pointline = paper.lineY(0,ctn.tl.y,ctn.height).addClass(cls).css(self._cfg.pointLine.css).css({"display":"none"});
			return self._pointline;
		},
		//渲染tip
		renderTip:function(){
			if(!this._cfg.tip.isShow) return;
			var self = this,
				_cfg = self._cfg,
				ctn = self._innerContainer,
				boundryCfg = _cfg.tip.boundryDetect ? {x:ctn.tl.x,y:ctn.tl.y,width:ctn.width,height:ctn.height} : {},
				tipCfg = S.mix(_cfg.tip,{rootNode:self._$ctnNode,clsName:_cfg.themeCls,boundry:boundryCfg},undefined,undefined,true);
			self.tip = new Tip(tipCfg);
			return self.tip;
		},
		//渲染事件层
		renderEvtLayout:function(){
			var self = this,
				x,
				ctn = self._innerContainer,
				y = ctn.tl.y,
				points = self._points[0],
				w = (points && points[0] && points[1] && points[1].x - points[0].x) || ctn.width,
				h = ctn.height,
				multiple = self._multiple,
				areas = self._evtEls._areas = [],
				rects = self._evtEls._rects = [],
				paper;
				if(!self._evtEls.paper){
					paper = self._evtEls.paper = new HtmlPaper(self._$ctnNode,{
						clsName:evtLayoutCls,
						prependTo:false,	//appendTo
						width:ctn.width,
						height:h,
						left:ctn.tl.x,
						top:ctn.tl.y,
						css:{
							"z-index": 20,
							background: "#fff",
							filter:"alpha(opacity =1)",
							"-moz-opacity":0.01,
							"-khtml-opacity": 0.01,
							opacity: 0.01
						}
					});
				}else{
					paper = self._evtEls.paper;
				}

			for(var i = 0,len = points.length;i<len;i++){
				areas[i] = {
					x:points[i].x - w/2,
					y:ctn.tl.y,
					width:w,
					height:h
				};
			}
			//多线
			if(multiple){
				for(var i in self._points){
					var rects = [],
						points = self._points[i];
					// if(stocks['stocks']){
						for(var j in points){
							rects[j] = {
								x:points[j].x - w/2,
								y:points[j].y - 5,
								width:w,
								height:10
							};
						}
						self._evtEls._rects[i] = rects;
					// }
				}
			}
		},
		//清除事件层
		clearEvtLayout:function(){
			var self = this;
			if(self._evtEls._areas && self._evtEls._areas.length){
				self._evtEls._areas = [];
			}
			if(self._evtEls._rects && self._evtEls._rects.length){
				 self._evtEls._rects = [];
			}
		},
		renderLegend:function(){
			if(!this._cfg.legend.isShow) return;
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
		/**
			渲染
			@param clear 是否清空容器
		**/
		render:function(clear){
				var self = this,

				_cfg = self._cfg,

				themeCls = _cfg.themeCls;
				//渲染前事件
				self.beforeRender();
				//清空所有节点
				clear && self._$ctnNode.html("");
				//获取矢量画布
				self.paper = Raphael(self._$ctnNode[0],_cfg.width,_cfg.height);
				//渲染html画布
				self.htmlPaper = new HtmlPaper(self._$ctnNode,{
					clsName:themeCls
				});

				self.drawTitle();

				self.drawSubTitle();
				//渲染tip
				self.renderTip();
				//画x轴上的平行线
				self.drawGridsX();

				self.drawGridsY();

				self.drawPointLine();
				//画横轴
				self.drawAxisX();

				self.drawAxisY();
				//画横轴刻度
				self.drawLabelsX();

				self.drawLabelsY();

				self.drawLines();

				self.drawStocks();
				//事件层
				self.renderEvtLayout();

				self.bindEvt();

				self.renderLegend();

				self.afterRender();

				self.fix2Resize();

				S.log(self);
		},
		bindEvt:function(){
			var self = this,
					_cfg = self._cfg,
					evtEls = self._evtEls,
					//当前选中的直线 返回索引或undefined
					curStockIndex = self.curStockIndex = (function(){
						for(var i in self._stocks){
							if(self._stocks[i]['stocks']){
								return i;
							}
						}
					})();
					self.curLineIndex = self.getFirstVisibleLineIndex();
					Evt.detach(evtEls.paper.$paper,"mouseleave");
					// 绑定画布mouseleave事件
					Evt.on(evtEls.paper.$paper,"mouseleave",function(e){
						self._lines[0]['line'].attr(self._lines[0]['attr']);
						self.tip && self.tip.hide();
						self._pointline && self._pointline.hide();
						for(var i in self._stocks){
							self._stocks[i]['stock'] &&
							self._stocks[i]['stock'].hide();
						}
						self.curStockIndex = undefined;
						self.paperLeave();
					});
					Evt.detach(evtEls.paper.$paper,"mousemove");
					// 绑定mousemove事件
					Evt.on(evtEls.paper.$paper,"mousemove",function(e){
						//fix firefox offset bug
						e = self.getOffset(e);
						//mousemove代理
						self.delegateMouseMove(e);
					});
		},
		//mousemove代理
		delegateMouseMove:function(e){
			var self = this,
				ctn = self.getInnerContainer(),
				curStockIndex = self.curStockIndex,
				currentPoints,
				currentStocks;
			for(var i in self._evtEls._areas){
				var area = self._evtEls._areas[i];
				if(self.isInSide(e.offsetX + ctn.x,e.offsetY + ctn.y,area['x'],area['y'],area['width'],area['height'])){
					if(curStockIndex === undefined || curStockIndex != i){
						self.curStockIndex = i;
						self.stockHandler(self.curLineIndex,self.curStockIndex);
						self.tipHandler(self.curLineIndex,self.curStockIndex);
						return;
					}
				}
			}
			for(var i in self._evtEls._rects){
				for(var j in self._evtEls._rects[i]){
					var rect = self._evtEls._rects[i][j];
					if(self.isInSide(e.offsetX + ctn.x,e.offsetY + ctn.y,rect['x'],rect['y'],rect['width'],rect['height'])){
						if(self.curLineIndex === i) return;
						self.lineChangeTo(i);
						self.stockHandler(self.curLineIndex,self.curStockIndex);
						self.tipHandler(self.curLineIndex,self.curStockIndex);
						return;
					}
				}
			}
		},
		//点的移动
		stockHandler:function(curLineIndex,curStockIndex){
			var self = this,point,stock;
			for(var i in self._stocks){
				stock = self._stocks[i]['stock'];
				point = self._points[i][curStockIndex];
				if(stock){
					if(point['y'] === undefined || isNaN(point['y'])){
						stock.hide();
					}else{
						 stock.show().attr({cx:point['x'],cy:point['y']})
					}
				}
			}
			self.stockChange(curLineIndex,curStockIndex);
		},
		tipHandler:function(curLineIndex,curStockIndex){
			var self = this;
			if(curLineIndex === undefined || curStockIndex === undefined) return;
			var tip = self.tip,
				_cfg = self._cfg,
				series = _cfg.series,
				tpl = _cfg.tip.template,
				$tip = tip.getInstance(),
				curPoint = self._points[curLineIndex][curStockIndex],
				color = self._lines[curLineIndex]['color']['DEFAULT'],	//获取当前直线的填充色
				tipData;

				if(self.curStockIndex === undefined){
					return;
				}
				//当前直线的点对象
				currentPoints = self._points[curLineIndex];

				if(!tpl || !_cfg.tip.isShow) return;

				if(currentPoints &&  !self.isEmptyPoint(currentPoints[curStockIndex]) && self._lines[curLineIndex]['isShow']){
					if(self._pointline){
						self._pointline.css({
							"margin-left":self._pointsX[curStockIndex]['x']
						}).show();
					}
				}else{
					var firstNotEmptyLineIndex = self.getFirstNotEmptyPointsLineIndex(curStockIndex);
				 			if(firstNotEmptyLineIndex){
				 				self.lineChangeTo(firstNotEmptyLineIndex);
				 			}
				}
				//如果tip需要展示多组数据 则存放数组
				if(self._cfg.comparable){
					var tipAllDatas = {datas:{}},
						tmpArray = [];
					for(var i in self._points)if(self._stocks[i]['stock']){
						if(self._points[i][curStockIndex].dataInfo){
							self._points[i][curStockIndex].dataInfo.color = self._stocks[i]['color']['DEFAULT']
							var tmp = S.merge(self._points[i][curStockIndex].dataInfo,series[i]);
							//删除data 避免不必要的数据
							delete tmp.data;
							tipAllDatas.datas[i] = tmp;
						}
					}
					for(var i in tipAllDatas.datas){
						tmpArray.push(tipAllDatas.datas[i]);
					}
					//根据纵轴数值大小进行排序
					tipAllDatas.datas = BaseChart.prototype.arraySort(tmpArray,true,"y");
					tipData = tipAllDatas;
				}else{
					var tipData = S.merge(self._points[curLineIndex][curStockIndex].dataInfo,series[curLineIndex]);
					//删除data 避免不必要的数据
						delete tipData.data;
				}
				self.areaChange(curStockIndex);
				if(!self.isEmptyPoint(currentPoints[curStockIndex])){
					S.mix(tipData,{lineindex:curLineIndex,pointindex:curStockIndex});
					tip.fire("setcontent",{data:tipData});
					tip.fire("move",{x:curPoint.x,y:curPoint.y,style:self.processAttr(_cfg.tip.css,color)});
				}
		},
		/**
			TODO 获取当前index的point不为空的lineIndex
			@return lineIndex
		**/
		getFirstNotEmptyPointsLineIndex:function(pointIndex){
			var self = this;
			for(var i in self._points){
				if(!self.isEmptyPoint(self._points[i][pointIndex]) && self._lines[i]['isShow']){
					return i+"";
				}
			}
			return "";
		},
		/**
			TODO 判断可见直线的index
		**/
		getFirstVisibleLineIndex:function(){
			var self = this;
			for(var i in self._lines){
				if(self._lines[i]['isShow']){
					return i;
				}
			}
		},
		/**
			TODO 判断是否为空数据点
		**/
		isEmptyPoint:function(point){
			if(point && point['dataInfo']){
				return false;
			}else{
				return true;
			}
		},
		deleteArea:function(lineIndex){
			var self = this;
			if(self._areas[lineIndex]){
				self._areas[lineIndex]['remove'] && self._areas[lineIndex]['remove']();
			}
			return;
		},
		/**
			TODO 隐藏单条直线
		**/
		hideLine:function(lineIndex){
			var self = this,
				duration = 500,
				stock;
			if(!self._lines[lineIndex]['isShow']) return;

			self._lines[lineIndex]['isShow'] = false;

			if(lineIndex == self.curLineIndex){
				self.curLineIndex = self.getFirstVisibleLineIndex();
			}
			//删除某条线的数据
			BaseChart.prototype.removeData.call(self,lineIndex);
			self.animateGridsAndLabels();
			self._lines[lineIndex]['line'].remove();
			self.deleteArea(lineIndex);
			for(var i in self._stocks){
				if(lineIndex == i){
					self._stocks[lineIndex]['stock']
				&&  self._stocks[lineIndex]['stock'].remove();
					delete self._stocks[lineIndex]['stock'];
				}
				self._stocks[i]['points'] = self._points[i];
			}
			for(var i in self._lines)if(i != lineIndex){
				var newPath = self.getLinePath(self._points[i]),
					oldPath = self._lines[i]['path'],
					newAreaPath = self.getAreaPath(self._points[i]);
				//防止不必要的动画
				if(oldPath != newPath && newPath != ""){
					// 动画状态
					self._isAnimating = true;
					self._areas[i] && self._areas[i].stop && self._areas[i].stop() && self._areas[i].animate({path:newAreaPath},duration);
					self._lines[i]['line'] && self._lines[i]['line'].stop() && self._lines[i]['line'].animate({path:newPath},duration,function(){
						self._isAnimating = false;
					});
					self._lines[i]['path'] = newPath;
				}
			}
			self.clearEvtLayout();
			self.renderEvtLayout();
			self.bindEvt();
			S.log(self)
		},
		/**
			TODO 显示单条直线
		**/
		showLine:function(lineIndex){
			var self = this,
				duration = 500,
				stock;

			if(self._lines[lineIndex]['isShow']) return;
			//设置为可见
			self._lines[lineIndex]['isShow'] = true;

			self._cfg.series[lineIndex]['isShow'] = true;
			//还原某条线数据
			BaseChart.prototype.recoveryData.call(self,lineIndex);

			self.animateGridsAndLabels();

			self._areas[lineIndex] = self.drawArea(lineIndex);

			self._lines[lineIndex]['line'] = self.drawLine(lineIndex);

			self._stocks[lineIndex]['stock'] = self.drawStock(0,0,self._stocks[lineIndex]['attr']).hide();

			for(var i in self._stocks){
				self._stocks[i]['points'] = self._points[i];
			}
			//线动画
			for(var i in self._lines){
				var newPath = self.getLinePath(self._points[i]),
					oldPath = self._lines[i]['path'],
					newAreaPath = self.getAreaPath(self._points[i]);

				if(oldPath != newPath && self._lines[i]['line']){
					//动画状态
					self._isAnimating = true;
					self._areas[i] && self._areas[i].stop && self._areas[i].stop() && self._areas[i].animate({path:newAreaPath},duration);
					self._lines[i]['line'] && self._lines[i]['line'].stop().animate({path:newPath},duration,function(){
						self._isAnimating = false;
					});
					self._lines[i]['path'] = newPath;
				}
			}
			self.clearEvtLayout();
			self.renderEvtLayout();
			self.bindEvt();
		},
		//处理网格和标注
		animateGridsAndLabels: function() {
			var self = this,
				cfg = self._cfg,
				zoomType = cfg.zoomType;
			if (zoomType == "y") {
				for (var i in self._labelX) {
					self._labelX[i] && self._labelX[i][0] && $(self._labelX[i][0]).remove();
				}
				for(var i in self._gridsX){
					self._gridsX[i] && self._gridsX[i][0] && $(self._gridsX[i][0]).remove();
				}
				self.drawLabelsX();
				self.drawGridsX();
			} else if (zoomType == "x") {
				for (var i in self._labelY) {
					self._labelY[i] && self._labelY[i][0] && self._labelY[i][0].remove();
				}
				for(var i in self._gridsY){
					self._gridsY[i] && self._gridsY[i][0] && self._gridsY[i][0].remove();
				}
				self.drawGridsY();
				self.drawLabelsY();
			}
		},
		fix2Resize: function() {
			var self = this,
				$ctnNode = self._$ctnNode;
			self._cfg.anim = "";
			var rerender = S.buffer(function() {
				self.init();
			}, 200);
			!self.__isFix2Resize && self.on("resize", function() {
				self.__isFix2Resize = 1;
				rerender();
			})
		},
		/**
			TODO 线条切换
		**/
		lineChangeTo:function(lineIndex){
			var self = this,
				_cfg = self._cfg,
				hoverLineAttr = self.__cfg['line'][lineIndex]['hoverAttr'];
			//若正在动画 则return
			if(self._isAnimating) return;
			//过滤隐藏直线
			if(!self._lines[lineIndex]['isShow']) return;

			for(var i in self._stocks){
				self._stocks[i]['points'] = self._points[i];
			}
			for(var i in self._lines)if(i != lineIndex){
				self._lines[i]['line']
				&& self._lines[i]['line'].attr(self.__cfg['line'][i]['attr']);
			}
			//块状区域耦合
			if(_cfg.areas.isShow){
				self.deleteArea(lineIndex);
				self._areas[lineIndex] = self.drawArea(lineIndex);
			}
			self._lines[lineIndex]['line'].remove();
			self._stocks[lineIndex]['stock'].remove && self._stocks[lineIndex]['stock'].remove();
			self._lines[lineIndex]['line'] = self.drawLine(lineIndex).attr(hoverLineAttr);
			self._stocks[lineIndex]['stock'] = self.drawStock(0,0,self._stocks[lineIndex]['attr']).hide();
			//保存当前选中直线
			self.curLineIndex = lineIndex;
		},
		areaChange:function(index){
			var self = this;
				self.fire("areaChange",{index:index});
		},
		paperLeave:function(){
			var self = this;
				self.fire("paperLeave",self);
		},
		stockChange:function(lineIndex,stockIndex){
			var self = this,
				currentStocks = self._stocks[lineIndex],
				tgt = currentStocks && currentStocks['stock'];
				e = S.mix({
					target:tgt,
					currentTarget:tgt,
					lineIndex:Math.round(lineIndex),
					stockIndex:Math.round(stockIndex)
				},currentStocks && currentStocks['points'][stockIndex]);
			self.fire("stockChange",e);
		},
		beforeRender:function(){
			var self = this;
			self.fire("beforeRender",self);
		},
		afterRender:function(){
			var self = this;
			self.fire("afterRender",self);
		},
		/*
			TODO get htmlpaper
			@return {object} HtmlPaper
		*/
		getHtmlPaper:function(){
			return this.htmlPaper;
		},
		/*
			TODO get raphael paper
			@return {object} Raphael
		*/
		getRaphaelPaper:function(){
			return this.paper;
		},
		/*
			TODO clear all nodes
		*/
		clear:function(){
			this._$ctnNode.html("");
		}
	};

	var DateTime;
    if(Base.extend){
      DateTime = BaseChart.extend(methods);
	}else{
      DateTime = function(cfg) {
		var self = this;
			self._cfg = cfg;
			self.init();
      };
      S.extend(DateTime, BaseChart, methods);
	}
	return DateTime;
},{requires:[
    'dom',
    'event',
    'node',
	'base',
	'gallery/template/1.0/index',
	'gallery/kcharts/1.3/raphael/index',
	'gallery/kcharts/1.3/basechart/index',
	'gallery/kcharts/1.3/tools/color/index',
	'gallery/kcharts/1.3/tools/htmlpaper/index',
	'gallery/kcharts/1.3/legend/index',
	'./theme',
	'gallery/kcharts/1.3/tools/touch/index',
	'gallery/kcharts/1.3/tip/index',
	'gallery/kcharts/1.3/animate/index',
	'gallery/kcharts/1.3/tools/graphtool/index'
]});
