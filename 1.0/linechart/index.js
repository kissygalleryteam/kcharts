KISSY.add("gallery/kcharts/1.0/linechart/index",function(S,Base,Raphael,BaseChart,ColorLib,HtmlPaper,Tip,undefined){

	var $ = S.all,
		Evt = S.Event,
		clsPrefix = "ks-chart-",
		themeCls = clsPrefix + "default",
		evtLayoutCls = clsPrefix + "evtlayout",
		evtLayoutAreasCls = evtLayoutCls+"-areas",
		evtLayoutRectsCls = evtLayoutCls + "-rects",
		COLOR_TPL = "{COLOR}",
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
					 		stroke:"#fff",
					 		"r":4,
					 		"stroke-width":1.5,
					 		"fill":COLOR_TPL
					 	},
					 	hoverAttr:{
					 		stroke:"#fff",
					 		"r":5,
					 		"fill":COLOR_TPL,
					 		"stroke-width":0
					 	}
					 },
					xLabels:{
						isShow:true,
						css:{

						}
					},
					yLabels:{
						isShow:true,
						css:{

						}
					},
					//横轴
					xAxis:{
						isShow:true,
						css:{
						}
					},
					//纵轴
					yAxis:{
						isShow:true,
						css:{
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

					 	}
					 },
					 //点的对齐线
					 pointLines:{
					 	isShow:false,
					 	css:{}
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

			self._cfg = S.mix(_defaultConfig,self._cfg,undefined,undefined,true);
			//主题
			themeCls = self._cfg.themeCls;

			self.color = color = new ColorLib();

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

		animateLine:function(points,lineIndex,callback){

			if(points && points.length){

				var self = this,
					paper = self.paper,
					_attr = S.mix({"stroke":color.getColor(lineIndex).DEFAULT},self._cfg.line.attr),
					ctnY = self._innerContainer.bl.y,
					len = points.length,
					tmpStocks = [],
					$line,
					_cfg = self._cfg,
					duration = self._cfg.anim.duration || 100,
					easing = self._cfg.anim.easing || "easeIn",
					index = 1,
					path = "",
					inteval = function(){

						if(points[index] && points[index]['x'] && points[index]['y'] && index < len){

							if(self._cfg.lineType == "arc"){
								//贝塞尔曲线 
								var cx = (points[index]['x'] + points[index-1]['x'])/2;

								path += " C" + cx+","+points[index-1]['y']+","+ cx+","+points[index]['y']+","+ points[index]['x'] + "," + points[index]['y'];

							}else{
								path += " L" + points[index]['x'] + "," + points[index]['y'];
							}

							$line && $line.animate({path:path},duration,easing,function(){

								tmpStocks[index] = self.drawStock(points[index]['x'],points[index]['y'],self._stocks[lineIndex]['attr']);
								index ++;

								inteval();
								//画完线之后 
								if(index == len){

									self._stocks[lineIndex]['stocks'] = tmpStocks;
									//直线渲染完毕后的记号
									self._finished.push(true); 

									if(callback && self._finished.length == self._cfg.series.length){
										callback();
									}

								}

							});

						}

					};

					path += "M" + points[0]['x'] + "," + points[0]['y'];

					$line = paper.path(path).attr(_attr);
					tmpStocks[0] = self.drawStock(points[0]['x'],points[0]['y'],self.processAttr(self._cfg.points.attr,color.getColor(lineIndex).DEFAULT));

					inteval();

					return $line;

			}

		},
		//获取画线的路径
		getLinePath:function(points){

			var self = this,
				path = "",
				ctnY = self._innerContainer.bl.y;

			if(!points || !points[0] || !points[0]['x'] || !points[0]['y']) return "";

			path += "M" + points[0]['x'] + "," + points[0]['y'];

			if(self._cfg.lineType == "arc"){

					for(var i = 1,len = points.length;i < len;i++)if(points[i]['x'] && points[i]['y']){
						//贝塞尔曲线 
						var cx = (points[i]['x'] + points[i-1]['x'])/2;

						path += " C" + cx+","+points[i-1]['y']+","+ cx+","+points[i]['y']+","+ points[i]['x'] + "," + points[i]['y'];

					}

				}else{

					for(var i = 1,len = points.length;i < len;i++)if(points[i]['x'] && points[i]['y']){

						path += " L" + points[i]['x'] + "," + points[i]['y'];

					}

				}

			return path;

		},

		//画线
		drawLine:function(path,attr){
			if(path){
				var self = this,
					paper = self.paper;
				return paper.path(path).attr(S.mix(self._cfg.line.attr,attr));
			}
		},
		//画线
		drawLines:function(callback){

			var self = this,
				_cfg = self._cfg;

			self._lines = {};

			self._stocks = {};
			//动画
			if(_cfg.anim){

				for(var i in self._points){

					var path = self.getLinePath(self._points[i]),
						curColor = color.getColor(i),
						pointsAttr = self.processAttr(self._cfg.points.attr,curColor.DEFAULT),
						hoverAttr = self.processAttr(self._cfg.points.hoverAttr,curColor.HOVER);

					self._lines[i] = {
						line:self.animateLine(self._points[i],i,callback),
						path:path,
						points:self._points[i],
						color:curColor,
						attr:S.mix({stroke:curColor.DEFAULT},self._cfg.line.attr)
					};

					self._stocks[i] = {
						points:self._points[i],
						color:curColor,
						attr:pointsAttr,
						hoverAttr:hoverAttr
					};

				}

			}else{

				for(var i in self._points){

					var path = self.getLinePath(self._points[i]),
						curColor = color.getColor(i),
						pointsAttr = self.processAttr(self._cfg.points.attr,curColor.DEFAULT),
						hoverAttr = self.processAttr(self._cfg.points.hoverAttr,curColor.HOVER);

					self._lines[i] = {
						line:self.drawLine(path,{stroke:curColor.DEFAULT}),
						path:path,
						points:self._points[i],
						color:curColor,
						attr:S.mix({stroke:curColor.DEFAULT},self._cfg.line.attr)
					};

					self._stocks[i] = {
						stocks:self.drawStocks(self._points[i],pointsAttr),
						points:self._points[i],
						color:curColor,
						attr:pointsAttr,
						hoverAttr:hoverAttr
					};

				}

			}

			return self._lines;

		},
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
		drawStocks:function(points,attr){

			var self = this,
				stocks = [];

				for(var i in points){

					if(points[i].x && points[i].y){

						stocks.push(self.drawStock(points[i].x,points[i].y,attr));
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
				_attr = self._cfg.points.attr;

			return paper.circle(x,y,_attr["r"],attr).attr(_attr).attr(attr);

		},
		//x轴上 平行于y轴的网格线
		drawGridsX:function(){

			var self = this,
				points = self._centerPoints;

			for(var i = 0,len = points.length;i<len;i++){

				var grid = self.drawGridX(points[i]);

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
				x,
				y = self._innerContainer.tl.y,
				points = self._points[0],
				w = points[1].x - points[0].x,
				h = self._innerContainer.height,
				paper = self.htmlPaper,
				cls = self._cfg.themeCls + "-areas",
				css = self._cfg.areas.css;

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
				cls = self._cfg.themeCls + "-xlabels";

			if(index < len){

				label = labels[index];

				label[0] = paper.text(label.x,label.y,'<span class='+cls+'>'+text+'</span>',"center").css(self._cfg.xLabels.css);

				return label[0];
			}

		},
		//纵轴标注
		drawLabelY:function(i,text){

			var self = this,
				paper = self.htmlPaper,
				cls = self._cfg.themeCls + "-ylabels";

			return paper.text(self._pointsY[i].x,self._pointsY[i].y,'<span class='+cls+'>'+text+'</span>',"right","middle").css(self._cfg.yLabels.css);

		},
		drawPointLines:function(){

			var self = this,
				paper = self.htmlPaper,
				cls = self._cfg.themeCls + "-pointlines",
				ctn = self._innerContainer;
				//点的标准线
			self._pointlines = [];

			for(var i in self._pointsX){

				self._pointlines.push(paper.lineY(self._pointsX[i].x,ctn.tl.y,ctn.height).addClass(cls).css({"display":"none"}));

			}

			return self._pointlines;

		},
		//渲染tip
		renderTip:function(){

			var self = this,
				_cfg = self._cfg,
				ctn = self._innerContainer,
				boundryCfg = _cfg.tip.boundryDetect ? {x:ctn.tl.x,y:ctn.tl.y,width:ctn.width,height:ctn.height} : {},
				tipCfg = S.mix(_cfg.tip,{rootNode:self._$ctnNode,clsName:_cfg.themeCls,boundry:boundryCfg});
			
			self.tip = new Tip(tipCfg);

			return self.tip;

		},
		//渲染事件层
		renderEvtLayout:function(){

			// S.log("evtlayout rendered!")

			var self = this,
				x,
				ctn = self._innerContainer,
				y = ctn.tl.y,
				points = self._points[0],
				w = points[1].x - points[0].x,
				h = ctn.height,
				multiple = self._multiple,
				areas = self._evtEls._areas = [],
				rects = self._evtEls._rects = [],
				paper = self._evtEls.paper = new HtmlPaper(self._$ctnNode,{
						clsName:evtLayoutCls,
						prependTo:false,	//appendTo
						width:ctn.width,
						height:h,
						left:ctn.tl.x,
						top:ctn.tl.y
				});

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
				self.paper = Raphael(self._$ctnNode[0],_cfg.width,_cfg.height,{"position":"absolute"});
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

				_cfg.pointLines.isShow && self.drawPointLines();
				//画横轴
				_cfg.xAxis.isShow && self.drawAxisX();

				_cfg.yAxis.isShow && self.drawAxisY();
				//画横轴刻度
				_cfg.xLabels.isShow && self.drawLabelsX();

				_cfg.yLabels.isShow && self.drawLabelsY();

				if(_cfg.anim){
					//画折线
					self.drawLines(function(){
						//事件层
						self.renderEvtLayout();
						
						self.bindEvt();

						S.log("finish");

						self.afterRender();
					});
				
				}else{
					//画折线
					self.drawLines();
					//事件层
					self.renderEvtLayout();

					self.afterRender();
					
					self.bindEvt();
				}

				S.log(self);
		},
		bindEvt:function(){
			var self = this,
					_cfg = self._cfg,
					evtEls = self._evtEls,
					areasHoverCls = self._cfg.themeCls + "-areas-hover",
					//当前选中的直线 返回索引或undefined
					currentLineIndex = (function(){
						for(var i in self._stocks){
							if(self._stocks[i]['stocks']){
								return i;
							}
						}
					})(),
					//当前直线的点对象
					currentPoints = self._points[currentLineIndex],
					//当前直线的点
					currentStocks = self._stocks[currentLineIndex];

					Evt.detach($("."+evtLayoutRectsCls,$("."+evtLayoutCls,self._$ctnNode)),"mouseenter");
					//绑定点的mouseenter事件
					currentLineIndex && Evt.on($("."+evtLayoutRectsCls,$("."+evtLayoutCls,self._$ctnNode)),"mouseenter",function(e){

						var $rect = $(e.currentTarget),
							rectIndex = $rect.attr("index"),
							lineIndex = $rect.attr("line_index");

						if(currentLineIndex != lineIndex){
							currentLineIndex = lineIndex;
							//触发change事件
							self.lineChangeTo(currentLineIndex);
						}

						//出发区域mouseenter事件
						Evt.fire($("."+evtLayoutAreasCls,$("."+evtLayoutCls,self._$ctnNode))[rectIndex],"mouseenter");
						
					});

					Evt.detach($("."+evtLayoutAreasCls,$("."+evtLayoutCls,self._$ctnNode)),"mouseenter");
					//绑定区域mouseenter事件
					currentLineIndex && Evt.on($("."+evtLayoutAreasCls,$("."+evtLayoutCls,self._$ctnNode)),"mouseenter",function(e){

						var index = S.indexOf(this,$("."+evtLayoutAreasCls,$("."+evtLayoutCls,self._$ctnNode)));
						// 当前直线的点集
						currentStocks = self._stocks[currentLineIndex];
						// S.log(currentStocks)
						for(var i in self._stocks){

							for(var j in self._stocks[i]['stocks'])if(self._stocks[i]['stocks'][j]){

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

						 				 self._stocks[i]['stocks'] && self._stocks[i]['stocks'][index].attr(self._stocks[i]['hoverAttr']);

						 			}

						 		}else{

						 			currentStocks['stocks'][index].attr(currentStocks['hoverAttr']);

						 		}

						 		self._areas[index].addClass(self._cfg.themeCls + "-areas-hover").siblings().removeClass(self._cfg.themeCls + "-areas-hover");

						 		if(self._points[currentLineIndex][index].dataInfo){
						 				self.stockChange(currentLineIndex,index);
						 				//操作tip
						 				self._cfg.tip.isShow && self.tipHandler(currentLineIndex,index);

						 		}

				 		}

					});

					Evt.detach(evtEls.paper.$paper,"mouseleave");
					// 绑定画布mouseleave事件
					currentLineIndex && Evt.on(evtEls.paper.$paper,"mouseleave",function(e){

						self._lines[currentLineIndex]['line'].attr(self._lines[currentLineIndex]['attr']);

						self.tip && self.tip.hide();

				 		for(var i in self._pointlines){

				 			self._pointlines[i].hide();

				 		}

				 		for(var i in self._areas){

				 			self._areas[i].removeClass(self._cfg.themeCls + "-areas-hover");
				 		
				 		}

				 		for(var i in self._stocks){

							for(var j in self._stocks[i]['stocks'])if(self._stocks[i]['stocks'][j]){

								self._stocks[i]['stocks'][j].attr(self._stocks[i]['attr']);

							}

						}

						self.paperLeave();
				 		
					});
				
		},
		//线条切换
		lineChangeTo:function(currentLineIndex){

			var self = this,
				_cfg = self._cfg;

			for(var i in self._lines)if(i != currentLineIndex){
				self._lines[i]['line'].attr(self._lines[i].attr);
			}
			
			self._lines[currentLineIndex]['line'].remove();

			for (var i in self._stocks[currentLineIndex]['stocks']){
					self._stocks[currentLineIndex]['stocks'][i].remove();
			}

			self._lines[currentLineIndex]['line'] = self.drawLine(self.getLinePath(self._points[currentLineIndex]),{stroke:self.color.getColor(currentLineIndex).DEFAULT,"stroke-width":"4px"});

			self._stocks[currentLineIndex]['stocks'] = self.drawStocks(self._points[currentLineIndex],{"fill":self.color.getColor(currentLineIndex).DEFAULT});

			for(var i in self._stocks){

				for(var j in self._stocks[i]['stocks']){
					self._stocks[i]['stocks'][j].attr(_cfg.points.attr);
				}

			}

		},
		/**	
			TODO 隐藏单条直线
		**/
		hideLine:function(lineIndex){

			var self = this;

			BaseChart.prototype.removeData.call(self,lineIndex);

			self.animateGridsAndLabels();

			self._lines[lineIndex]['line'].remove();

			for(var i in self._stocks){

				if(lineIndex == i){

					for(var j in self._stocks[lineIndex]['stocks']){
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
					
					self._lines[i]['line'].stop().animate({path:newPath},500);

					self._lines[i]['path'] = newPath;
					//点动画
					for(var j in self._stocks[i]['stocks']){
						
						self._stocks[i]['stocks'][j].stop().animate({cx:self._stocks[i]['points'][j]['x'],cy:self._stocks[i]['points'][j]['y']},500);
					}

				}

			}
			self.clearEvtLayout();

			self.renderEvtLayout();

			self.bindEvt();
			//事件层删减和动画
			S.log(self)

		},
		/**	
			TODO 显示单条直线
		**/
		showLine:function(lineIndex){

			var self = this;

			BaseChart.prototype.recoveryData.call(self,lineIndex);

			self.animateGridsAndLabels();

			var linePath = self.getLinePath(self._points[lineIndex]);

			self._lines[lineIndex]['line'] = self.drawLine(linePath,self._lines[lineIndex]['attr']);

			for(var i in self._stocks){

				self._stocks[i]['points'] = self._points[i];
				
			}
			//线动画
			for(var i in self._lines)if(i != lineIndex){

				var newPath = self.getLinePath(self._points[i]),
					oldPath = self._lines[i]['path'];

				if(oldPath != newPath){
					
					self._lines[i]['line'].stop().animate({path:newPath},500);
					self._lines[i]['path'] = newPath;

					for(var j in self._stocks[i]['stocks']){
						self._stocks[i]['stocks'][j].stop().animate({cx:self._stocks[i]['points'][j]['x'],cy:self._stocks[i]['points'][j]['y']},500);
					}

				}

			}

			for(var i in self._stocks){

				if(lineIndex == i){

					self._stocks[lineIndex]['stocks'] = self.drawStocks(self._stocks[lineIndex]['points'],self._stocks[lineIndex]['attr']);

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
				coordNum = self.coordNum,
				isInCoord = function(num){
					for(var i in coordNum){
						S.log(coordNum[i] + " " + num)
							if(coordNum[i] == num){
								return true;
							}
						}
					return false;
				},
				findPointYByNum = function(num){

					for(var i in self._pointsY){

						if(self._pointsY[i]['number'] == num){
							return self._pointsY[i];
						}

					}

				};

			// for(var i = 0;i<maxLen;i++){

			// 	if(self._gridsY[i] && !isInCoord(self._gridsY[i]['num'])){

			// 		self._gridsY[i][0].remove();

			// 		delete self._gridsY[i];

			// 		self._labelY[i][0].remove();

			// 		delete self._labelY[i];

			// 	}else if(self._gridsY[i] && isInCoord(self._gridsY[i]['num'])){

			// 		self._gridsY[i] && self._gridsY[i][0].stop().animate({marginTop:findPointYByNum(self._gridsY[i]['num'])['y']},0.5);
				
			// 		self._labelY[i] && self._labelY[i][0].stop().animate({marginTop:findPointYByNum(self._gridsY[i]['num'])['y']},0.5);
					
			// 	}else{



			// 	}

			// }

			for(var i in self._labelY){
					self._labelY[i][0].remove();
					self._gridsY[i][0].remove();
			}

			self.drawGridsY();

			self.drawLabelsY();

		},

		tipHandler:function(currentLineIndex,index){

			var self = this,
				color = self._lines[currentLineIndex]['color']['DEFAULT'],	//获取当前直线的填充色
				tip = self.tip,
				_cfg = self._cfg,
				$tip = tip.getInstance();
				//如果tip需要展示多组数据 则存放数组
				if(self._cfg.comparable){

					var tipAllDatas = {datas:{}},
						tmpArray = [];

					for(var i in self._points)if(self._stocks[i]['stocks']){

						tipAllDatas.datas[i] = S.mix(self._points[i][index].dataInfo,{text:self._cfg.series[i]['text']||"",color:self._stocks[i]['color']['DEFAULT']});
							 					
					}
					for(var i in tipAllDatas.datas){
						tmpArray.push(tipAllDatas.datas[i]);
					}
					//根据纵轴数值大小进行排序
					tipAllDatas.datas = BaseChart.prototype.arraySort(tmpArray,true,"y");

					tip.renderTemplate(self._cfg.tip.template,tipAllDatas);

				}else{

					tip.renderTemplate(self._cfg.tip.template,self._points[currentLineIndex][index].dataInfo);

				}

				if(tip.isVisable()){

					 tip.animateTo(self._points[currentLineIndex][index].x,self._points[currentLineIndex][index].y);

				}else{

					tip.moveTo(self._points[currentLineIndex][index].x,self._points[currentLineIndex][index].y);

				}

				$tip.css(self.processAttr(_cfg.tip.css,color));

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

			return this.paper.clear();

		}
		

	});

	return LineChart;

},{requires:['base','gallery/kcharts/1.0/raphael/index','gallery/kcharts/1.0/basechart/index','gallery/kcharts/1.0/tools/color/index','gallery/kcharts/1.0/tools/htmlpaper/index','gallery/kcharts/1.0/tip/index','./assets/kcharts-ui-core.css']});