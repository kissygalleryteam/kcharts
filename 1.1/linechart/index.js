/**
 * @fileOverview KChart 1.1  linechart
 * @author huxiaoqi567@gmail.com
 */
KISSY.add("gallery/kcharts/1.1/linechart/index",function(S,Base,Template,Raphael,BaseChart,ColorLib,HtmlPaper,Legend,Theme,undefined,Tip,Ft,graphTool){

	var $ = S.all,
		Evt = S.Event,
		clsPrefix = "ks-chart-",
		themeCls = clsPrefix + "default",
		evtLayoutCls = clsPrefix + "evtlayout",
		evtLayoutAreasCls = evtLayoutCls+"-areas",
		evtLayoutRectsCls = evtLayoutCls + "-rects",
		COLOR_TPL = "{COLOR}",
		//点的类型集合
		POINTS_TYPE = ["circle","triangle","rhomb","square"],
		color;

	var LineChart = function(cfg){
		var self = this;
			self._cfg = cfg;
			self.init();
	};

	S.extend(LineChart,BaseChart,{
		init:function(){
			var self = this;

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
					 areas:{
					 	isShow:true,
					 	css:{

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
					 pointLines:{
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

			self._cfg.autoRender && self.render(true);
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
				line = paper.path(path).attr(S.mix(self._cfg.line.attr,{"stroke":color})),
				//默认显示的直线条数
				show_num = self.getVisableLineNum();
				self._stocks[lineIndex]['stocks'] = self.drawStocks(lineIndex,self.processAttr(self._cfg.points.attr,color));
				//finish state
				self._finished.push(true);
				if(self._finished.length == show_num && callback){
						callback();
				}
				return line; 
			}
		},
		//曲线动画
		animateLine:function(lineIndex,callback){
			var self = this,
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
				tmpStocks = [],
				sub_path,
				idx = 0,
				from = 0,
				to,
				show_num,
				box,
				ft,
				_attr = S.mix({"stroke":color.getColor(lineIndex).DEFAULT},_cfg.line.attr),
				$line = paper.path(sub_path).attr(_attr);

			    tmpStocks[0] = self.drawStock(points[0]['x'],points[0]['y'],self.processAttr(_cfg.points.attr,_attr.stroke),type);
			    //默认显示的直线条数
				show_num = self.getVisableLineNum();
				//动画
				ft = new Ft({
					duration:duration,
					easing:easing,
					onstep:function(){
							//arguments[1] 代表经过缓动函数处理后的0到1之间的数值
							to = arguments[1] * total_len;
							//获取子路径
							sub_path = Raphael.getSubpath(path,from,to);
							//获取路径所占的矩形区域
							box = Raphael.pathBBox(sub_path);
							//当前渲染点的索引
							idx = Math.floor((box.width)/aver_len);

							if(!tmpStocks[idx] && points[idx]){
								tmpStocks[idx] = self.drawStock(points[idx]['x'],points[idx]['y'],self.processAttr(_cfg.points.attr,_attr.stroke),type);
							}

							$line && $line.attr({path:sub_path});
					},
					onend:function(){
						//做最后点的补偿
						if(real_num > 1 && !tmpStocks[real_num - 1] && points[real_num - 1]){
							tmpStocks[real_num - 1] = self.drawStock(points[real_num - 1]['x'],points[real_num - 1]['y'],self.processAttr(_cfg.points.attr,_attr.stroke),type);
						}
						self._stocks[lineIndex]['stocks'] = tmpStocks;
						//finish state
						self._finished.push(true);

						if(self._finished.length == show_num && callback){
								callback();
						}
					}
				});

				ft.INTERVAL = duration / total_num / 8 || 25;
				ft.run();

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
			while(!points || !points[start] || !points[start]['x'] || !points[start]['y']){
				if(start < len){
					start ++;
				}else{
					break;
				} 
			}

			if(start >= len){
				throw new Error("数据格式有误，请检查defineKey的值");
			} 

			path += "M" + points[start]['x'] + "," + points[start]['y'];
			//当只有2个点的时候 则用直线绘制
			if(self._cfg.lineType == "arc" && len > 2){
				path += " R";
				for(var i = start+1,len = points.length;i < len;i++)if(points[i]['x'] && points[i]['y']){
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
						line;

					//保存点的信息
					self._stocks[i] = {
						points:self._points[i],
						color:curColor,
						attr:pointsAttr,
						hoverAttr:hoverAttr,
						type:pointsAttr.type == "auto" ? POINTS_TYPE[i%len] : pointsAttr.type
					};

					if(_cfg.anim){
						line = _cfg.series[i]['isShow'] == false ? undefined : self.animateLine(i,callback);
					}else{
						line = _cfg.series[i]['isShow'] == false ? undefined : self.drawLine(i,callback);
					}

					self._lines[i] = {
						line:line,
						path:path,
						points:self._points[i],
						color:curColor,
						attr:S.mix({stroke:curColor.DEFAULT},self._cfg.line.attr)
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
		//画圆点
		drawStocks:function(lineIndex,attr){
			var self = this,
				stocks = [],
				points = self._points[lineIndex],
				type = self._stocks[lineIndex]['type'];

				for(var i in points){
					if(points[i].x && points[i].y){
						stocks.push(self.drawStock(points[i].x,points[i].y,attr,type));
					}
					else{
						stocks.push("");
					}
				}
			return stocks;
		},
		//画单个圆点
		drawStock:function(x,y,attr,type){
			var self = this,
				paper = self.paper,
				_attr = self._cfg.points.attr,
				$stock;

			if(x && y){
				switch(type){
					case "triangle":
						$stock = graphTool.triangle(paper,x,y,6);
						break;
					case "rhomb":
						$stock = graphTool.rhomb(paper,x,y,10,10);
						break;
					case "square":
						//菱形旋转45度
						$stock = graphTool.rhomb(paper,x,y,10,10,45);
						break;
					default:
						$stock = paper.circle(x,y,_attr["r"],attr);
						break;
				}
				return $stock.attr(_attr).attr(attr);
			}
		},
		//x轴上 平行于y轴的网格线
		drawGridsX:function(){
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
		//轴间的矩形区域
		drawAreas:function(){
			var self = this,
				ctn = self._innerContainer,
				y = ctn.tl.y,
				points = self._points[0],
				w = Math.round((points && points[0] && points[1] && points[1].x - points[0].x) || ctn.width),
				h = Math.round(self._innerContainer.height),
				paper = self.htmlPaper,
				cls = self._cfg.themeCls + "-areas",
				css = self._cfg.areas.css,
				x;

			self.set("area-width",w);

			for(var i = 0,len = points.length;i<len;i++){

				var area = paper.rect(points[i].x - w/2,y,w,h).addClass(cls).css(css);

				self._areas.push(area);

			}
		},
		//x轴
		drawAxisX:function(){
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
			var self = this,
				text = self._cfg.xAxis.text;
			//画x轴刻度线
				for(var i in text){
						self._labelX[i] = self.drawLabelX(i,text[i]);
				}
		},
		drawLabelsY:function(){
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
					label[0] = paper.text(label.x,label.y,'<span class='+cls+'>'+content+'</span>',"center").children().css(self._cfg.xLabels.css);
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
		drawPointLines:function(){
			var self = this,
				paper = self.htmlPaper,
				cls = self._cfg.themeCls + "-pointlines",
				ctn = self._innerContainer;

			self._pointlines = [];
			for(var i in self._pointsX){
				self._pointlines.push(paper.lineY(self._pointsX[i].x,ctn.tl.y,ctn.height).addClass(cls).css(self._cfg.pointLines.css).css({"display":"none"}));
			}
			return self._pointlines;
		},
		//渲染tip
		renderTip:function(){
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
				areas[i] = paper.rect(points[i].x - w/2,ctn.tl.y,w,h).addClass(evtLayoutAreasCls);
			}
			//多线 
			if(multiple){
				for(var i in self._stocks){
					var stocks = self._stocks[i],
						rects = [],
						points = stocks['points'];
					if(stocks['stocks']){
						for(var j in points){
							rects[j] = paper.rect(points[j].x - w/2,points[j].y - 5,w,10).attr({"line_index":i,"index":j}).addClass(evtLayoutRectsCls);
						}
						self._evtEls._rects[i] = rects;
					}
				}
			}
		},
		//清除事件层
		clearEvtLayout:function(){
			var self = this;
			if(self._evtEls._areas){
				for(var i in self._evtEls._areas){
					self._evtEls._areas[i].remove();
				}
			}
			if(self._evtEls._rects){
				 for(var i in self._evtEls._rects){
						for(var j in self._evtEls._rects[i]){
							self._evtEls._rects[i][j].remove();
						}
				}
			}
		},
		renderLegend:function(){
			var self = this,
				legendCfg = self._cfg.legend,
				container = (legendCfg.container && $(legendCfg.container)[0]) ? $(legendCfg.container) : self._$ctnNode;
				self.legend = new Legend({
					container:container,
					evtBind:true,
					chart:self,
					iconType:"circle",
					css:legendCfg.css || {}
				});
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
				_cfg.tip.isShow && self.renderTip();
				//画背景块状区域
				_cfg.areas.isShow && self.drawAreas();
				//画x轴上的平行线
				_cfg.xGrids.isShow && self.drawGridsX();

				_cfg.yGrids.isShow && self.drawGridsY();

				self._cfg.comparable && self.drawPointLines();
				//画横轴
				_cfg.xAxis.isShow && self.drawAxisX();

				_cfg.yAxis.isShow && self.drawAxisY();
				//画横轴刻度
				_cfg.xLabels.isShow && self.drawLabelsX();

				_cfg.yLabels.isShow && self.drawLabelsY();

				//画折线
				self.drawLines(function(){
					//事件层
					self.renderEvtLayout();
						
					self.bindEvt();

					_cfg.legend.isShow && self.renderLegend();

					S.log("finish");

					self.afterRender();
				});
				S.log(self);
		},
		bindEvt:function(){
			var self = this,
					_cfg = self._cfg,
					evtEls = self._evtEls,
					areasHoverCls = self._cfg.themeCls + "-areas-hover",
					//当前选中的直线 返回索引或undefined
					curIndex = (function(){
						for(var i in self._stocks){
							if(self._stocks[i]['stocks']){
								return i;
							}
						}
					})(),
					//当前直线的点对象
					currentPoints = self._points[curIndex],
					//当前直线的点
					currentStocks = self._stocks[curIndex];

					Evt.detach($("."+evtLayoutRectsCls,$("."+evtLayoutCls,self._$ctnNode)),"mouseenter");
					//绑定点的mouseenter事件
					curIndex && Evt.on($("."+evtLayoutRectsCls,$("."+evtLayoutCls,self._$ctnNode)),"mouseenter",function(e){
						var $rect = $(e.currentTarget),
							rectIndex = $rect.attr("index"),
							lineIndex = $rect.attr("line_index");

						if(curIndex != lineIndex){
							curIndex = lineIndex;
							//触发change事件
							self.lineChangeTo(curIndex);
						}
						//出发区域mouseenter事件
						Evt.fire($("."+evtLayoutAreasCls,$("."+evtLayoutCls,self._$ctnNode))[rectIndex],"mouseenter");
						
					});

					Evt.detach($("."+evtLayoutAreasCls,$("."+evtLayoutCls,self._$ctnNode)),"mouseenter");
					//绑定区域mouseenter事件
					curIndex && Evt.on($("."+evtLayoutAreasCls,$("."+evtLayoutCls,self._$ctnNode)),"mouseenter",function(e){
						var index = S.indexOf(this,$("."+evtLayoutAreasCls,$("."+evtLayoutCls,self._$ctnNode)));
						// 当前直线的点集
						currentStocks = self._stocks[curIndex];
						for(var i in self._stocks){
							for(var j in self._stocks[i]['stocks'])if(self._stocks[i]['stocks'][j] && self._stocks[i]['stocks'][j].attr){
								 self._stocks[i]['stocks'][j].attr(self._stocks[i].attr);
							}
				 		}
				 		//如果这个点有数据的话
				 		if(currentPoints && currentPoints[index] && currentPoints[index]['y']){
				 				if(self._pointlines){
						 			for(var i in self._pointlines){
						 				self._pointlines[i].hide();
						 			}
						 			self._pointlines[index].show();
						 		}
						 		if(self._cfg.comparable){
						 			for(var i in self._stocks){
						 				 self._stocks[i]['stocks'] 
						 				 && self._stocks[i]['stocks'][index]
						 				 && self._stocks[i]['stocks'][index].attr
						 				 && self._stocks[i]['stocks'][index].attr(self._stocks[i]['hoverAttr']);
						 			}
						 		}else{
						 			currentStocks['stocks'][index]
						 			&& currentStocks['stocks'][index].attr
						 			&& currentStocks['stocks'][index].attr(currentStocks['hoverAttr']);
						 		}
						 		self._areas[index].addClass(areasHoverCls).siblings().removeClass(areasHoverCls);

						 		if(self._points[curIndex][index].dataInfo){
						 				self.stockChange(curIndex,index);
						 				//操作tip
						 				self._cfg.tip.isShow && self.tipHandler(curIndex,index);
						 		}
				 		}

				 		self.areaChange(index);

					});

					Evt.detach(evtEls.paper.$paper,"mouseleave");
					// 绑定画布mouseleave事件
					curIndex && Evt.on(evtEls.paper.$paper,"mouseleave",function(e){
						self._lines[curIndex]['line'].attr(self._lines[curIndex]['attr']);
						self.tip && self.tip.hide();
				 		for(var i in self._pointlines){
				 			self._pointlines[i].hide();
				 		}
				 		for(var i in self._areas){
				 			self._areas[i].removeClass(self._cfg.themeCls + "-areas-hover");
				 		}
				 		for(var i in self._stocks){
							for(var j in self._stocks[i]['stocks']){
								self._stocks[i]['stocks'][j] 
								&& self._stocks[i]['stocks'][j].attr
								&& self._stocks[i]['stocks'][j].attr(self._stocks[i]['attr']);
							}
						}
						self.paperLeave();
					});
		},
		/**
			TODO 线条切换
		**/
		lineChangeTo:function(curIndex){
			var self = this,
				_cfg = self._cfg;
			//若正在动画 则return
			if(self._isAnimating) return;

			for(var i in self._stocks){
				self._stocks[i]['points'] = self._points[i];
			}
			for(var i in self._lines)if(i != curIndex){
				self._lines[i]['line'] 
				&& self._lines[i]['line'].attr(self._lines[i].attr);
			}
			self._lines[curIndex]['line'].remove();
			for (var i in self._stocks[curIndex]['stocks']){
					self._stocks[curIndex]['stocks'][i].remove
				    && self._stocks[curIndex]['stocks'][i].remove();
			}
			self._lines[curIndex]['line'] = self.drawLine(curIndex).attr(_cfg.line.hoverAttr);
			
			for(var i in self._stocks){
				for(var j in self._stocks[i]['stocks']){
					if(self._stocks[i]['stocks'][j]){
						var stock = self._stocks[i]['stocks'][j];
						stock.attr && stock.attr(self._stocks[i]['attr']);
					}
					
				}
			}
		},
		/**	
			TODO 隐藏单条直线
		**/
		hideLine:function(lineIndex){
			var self = this,
				duration = 500,
				stock;
			//删除某条线的数据
			BaseChart.prototype.removeData.call(self,lineIndex);
			self.animateGridsAndLabels();
			self._lines[lineIndex]['line'].remove();
			for(var i in self._stocks){
				if(lineIndex == i){
					for(var j in self._stocks[lineIndex]['stocks']){
						self._stocks[lineIndex]['stocks'][j] &&
						self._stocks[lineIndex]['stocks'][j].remove();
					}
					delete self._stocks[lineIndex]['stocks'];
				}
				self._stocks[i]['points'] = self._points[i];
			}
			//线动画
			for(var i in self._lines)if(i != lineIndex){
				var newPath = self.getLinePath(self._points[i]),
					oldPath = self._lines[i]['path'];
				//防止不必要的动画	
				if(oldPath != newPath && newPath != ""){
					//动画状态
					self._isAnimating = true;
					self._lines[i]['line'] && self._lines[i]['line'].stop() && self._lines[i]['line'].animate({path:newPath},duration,function(){
						self._isAnimating = false;
					});
					self._lines[i]['path'] = newPath;
					//点动画
					for(var j in self._stocks[i]['stocks']){
					if(self._stocks[i]['stocks'][j]){
							stock = self._stocks[i]['stocks'][j];
							stock.stop().animate({
								transform:"T"+(self._stocks[i]['points'][j]['x']-self._stocks[i]['stocks'][j].attr("cx"))+","+(self._stocks[i]['points'][j]['y']-self._stocks[i]['stocks'][j].attr("cy"))
								// transform:"T 0,0"
							},duration)
						}
					}
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

			self._cfg.series[lineIndex]['isShow'] = true;
			//还原某条线数据
			BaseChart.prototype.recoveryData.call(self,lineIndex);

			self.animateGridsAndLabels();

			self._lines[lineIndex]['line'] = self.drawLine(lineIndex);

			for(var i in self._stocks){
				self._stocks[i]['points'] = self._points[i];
			}
			//线动画
			for(var i in self._lines){
				var newPath = self.getLinePath(self._points[i]),
					oldPath = self._lines[i]['path'];

				if(oldPath != newPath && self._lines[i]['line']){
					//动画状态
					self._isAnimating = true;
					self._lines[i]['line'] && self._lines[i]['line'].stop().animate({path:newPath},duration,function(){
						self._isAnimating = false;
					});
					self._lines[i]['path'] = newPath;
					for(var j in self._stocks[i]['stocks']){
						if(self._stocks[i]['stocks'][j]){
							stock = self._stocks[i]['stocks'][j];
							stock.stop();
							stock.animate({
								transform:"T"+(self._stocks[i]['points'][j]['x']-self._stocks[i]['stocks'][j].attr("cx"))+","+(self._stocks[i]['points'][j]['y']-self._stocks[i]['stocks'][j].attr("cy"))
							},duration)
						}
					}
				}
			}
			self.clearEvtLayout();
			self.renderEvtLayout();
			self.bindEvt();
		},
		//处理网格和标注
		animateGridsAndLabels:function(){
			var self = this,
				maxLen = Math.max(self._pointsY.length,self._gridsY.length),
				coordNum = self.coordNum;

			for(var i in self._labelY){
					self._labelY[i] && self._labelY[i][0] && self._labelY[i][0].remove();
					self._gridsY[i] && self._gridsY[i][0] && self._gridsY[i][0].remove();
			}
			self.drawGridsY();
			self.drawLabelsY();
		},
		tipHandler:function(curIndex,index){
			var self = this,
				color = self._lines[curIndex]['color']['DEFAULT'],	//获取当前直线的填充色
				tip = self.tip,
				_cfg = self._cfg,
				series = _cfg.series,
				tpl = _cfg.tip.template,
				$tip = tip.getInstance(),
				curPoint = self._points[curIndex][index],
				tipData;

				if(!tpl) return;
				//如果tip需要展示多组数据 则存放数组
				if(self._cfg.comparable){
					var tipAllDatas = {datas:{}},
						tmpArray = [];

					for(var i in self._points)if(self._stocks[i]['stocks']){
						self._points[i][index].dataInfo.color = self._stocks[i]['color']['DEFAULT']
						var tmp = S.merge(self._points[i][index].dataInfo,series[i]);
						//删除data 避免不必要的数据
						delete tmp.data;
						tipAllDatas.datas[i] = tmp;
					}
					for(var i in tipAllDatas.datas){
						tmpArray.push(tipAllDatas.datas[i]);
					}
					//根据纵轴数值大小进行排序
					tipAllDatas.datas = BaseChart.prototype.arraySort(tmpArray,true,"y");
					tipData = tipAllDatas;
				}else{
					var tipData = S.merge(self._points[curIndex][index].dataInfo,series[curIndex]);
					//删除data 避免不必要的数据
						delete tipData.data;
				}
				tip.fire("setcontent",{data:tipData});
				tip.fire("move",{x:curPoint.x,y:curPoint.y,style:self.processAttr(_cfg.tip.css,color)});
		},
		areaChange:function(){
			var self = this;
				self.fire("areaChange",self);
		},
		paperLeave:function(){
			var self = this;
				self.fire("paperLeave",self);
		},
		stockChange:function(lineIndex,stockIndex){
			var self = this,
				currentStocks = self._stocks[lineIndex],
				e = S.mix({
					target:currentStocks['stocks'][stockIndex],
					currentTarget:currentStocks['stocks'][stockIndex],
					lineIndex:Math.round(lineIndex),
					stockIndex:Math.round(stockIndex)
				},currentStocks['points'][stockIndex]);
			self.fire("stockChange",e);
		},
		afterRender:function(){
			var self = this;
			self.fire("afterRender",self);
		},
		getPaper:function(){
			return this.htmlPaper;
		},
		//清空画布上的内容
		clear:function(){
			this._$ctnNode.html("");
		}
	});
	return LineChart;
},{requires:[
	'base',
	'gallery/template/1.0/index',
	'gallery/kcharts/1.1/raphael/index',
	'gallery/kcharts/1.1/basechart/index',
	'gallery/kcharts/1.1/tools/color/index',
	'gallery/kcharts/1.1/tools/htmlpaper/index',
	'gallery/kcharts/1.1/legend/index',
	'gallery/kcharts/1.1/linechart/theme',
	'gallery/kcharts/1.1/tools/touch/index',
	'gallery/kcharts/1.1/tip/index',
	'gallery/kcharts/1.1/ft/index',
	'gallery/kcharts/1.1/tools/graphtool/index'
]});