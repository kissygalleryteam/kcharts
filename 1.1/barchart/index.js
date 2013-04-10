/**
 * @fileOverview KChart 1.1  barchart
 * @author huxiaoqi567@gmail.com
 */
KISSY.add('gallery/kcharts/1.1/barchart/index',function(S,Template,BaseChart,Color,HtmlPaper,Legend,Theme,undefined,Tip){

	var $ = S.all,
		Evt = S.Event,
		win = window,
		clsPrefix = "ks-chart-",
		themeCls = clsPrefix + "default",
		canvasCls = themeCls + "-canvas",
		evtLayoutCls = clsPrefix + "evtlayout",
		evtLayoutAreasCls = evtLayoutCls+"-areas",
		evtLayoutBarsCls = evtLayoutCls + "-bars",
		COLOR_TPL = "{COLOR}",
		color;

	var BarChart = function(cfg){
		this.init(cfg);
	};

	S.extend(BarChart,BaseChart,{
		init:function(cfg){

			var self = this;

			BaseChart.prototype.init.call(self,cfg);

			self.chartType = "barchart";

			if(!self._$ctnNode[0]) return;

			var _defaultConfig = {
					themeCls:themeCls,
					autoRender:true,
					colors:[],
					stackable:false,
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
							"position":"absolute" 	//修复ie7被遮住的Bug
						}
					},
					//横轴
					xAxis:{
						isShow:true,
						css:{
							color:"#eee",
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
					 bars:{
					 	isShow:true,
					 	css:{
					 		background:COLOR_TPL,
					 		"border":"1px solid #fff"
					 	},
					 	barsRatio:0.6,
						barRatio:0.5
					 },
					 // zoomType:"x"
					 legend:{
					 	isShow:false
					 },
					 tip:{
					 	isShow:true,
						template:"",
						css:{
							
						},
						anim:{
							easing:"easeOut",
							duration:0.3
						},
						offset:{
							x:0,
							y:0
						},
						boundryDetect:true,
						alignX:"right",	//left center right
						alignY:"bottom"
					 }
				};
			//柱形对象数组
			self._bars = {};

			//统计渲染完成的数组
			self._finished = [];

			//主题
			themeCls = self._cfg.themeCls || _defaultConfig.themeCls;

			self._cfg = S.mix(S.mix(_defaultConfig,Theme[themeCls],undefined,undefined,true),self._cfg,undefined,undefined,true);
			
			self.color = color = new Color({themeCls:themeCls});

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
				paper = self.paper,
				cls = themeCls + "-title",
				_cfg = self._cfg,
				ctn = self._innerContainer,
				//高度占 60%
				h = ctn.y * 0.6;

			if(!self._title && _cfg.title.isShow && _cfg.title.content != ""){

				self._title = paper.rect(0,0,self._$ctnNode.width(),h).addClass(cls).css(S.mix({"line-height":h+"px"},_cfg.title.css));

			}

			if(self._title && _cfg.title.content != ""){

				self._title.html(_cfg.title.content);

			} 
		},
		//副标题
		drawSubTitle:function(){
			var self = this,
				paper = self.paper,
				cls = themeCls + "-subtitle",
				_cfg = self._cfg,
				ctn = self._innerContainer,
				//高度占 40%
				h = ctn.y * 0.4;

			if(!self._subTitle && _cfg.subTitle.isShow && _cfg.subTitle.content != ""){
				self._subTitle = paper.rect(0,ctn.y * 0.6,self._$ctnNode.width(),h).addClass(cls).css(S.mix({"line-height":h+"px"},_cfg.subTitle.css));
			}

			if(self._subTitle && _cfg.subTitle.content != ""){
				self._subTitle.html(_cfg.subTitle.content);
			} 
		},
		//画柱
		drawBar:function(x,y,w,h,color,callback){
				var self = this,
					_cfg = self._cfg,
					paper = self.paper,
					cls = canvasCls + "-bars",
					ctn = self._innerContainer,
					_css = self.processAttr(_cfg.bars.css,color),
					isY = _cfg.zoomType == "x" ? false : true,
					x = (x - 0).toFixed(2),
					y = (y - 0).toFixed(2),
					w = (w - 0).toFixed(2),
					h = (h - 0).toFixed(2),
					rect;
			//允许动画
			if(_cfg.anim){
				var duration = _cfg.anim.duration ? (S.isNumber(_cfg.anim.duration) ? _cfg.anim.duration : 0.5) : 0.5,
					easing = _cfg.anim.easing ? _cfg.anim.easing : "easeOut";
				if(isY){
					rect = paper.rect(x,y,0,h).attr({"posx":x,"posy":y}).addClass(cls).css(_css).animate({"width":w,"marginLeft":x - ctn.x},duration,easing,function(){
						callback && callback();
					});
				}else{
					rect = paper.rect(x,ctn.bl.y,w,0).attr({"posx":x,"posy":y}).addClass(cls).css(_css).animate({"height":h,"marginTop":y - ctn.y},duration,easing,function(){
						callback && callback();
					});
				}
			}else{
				rect = paper.rect(x,y,w,h).attr({"posx":x,"posy":y}).addClass(cls).css(_css);
				callback && callback();
			}
			return  rect;
		},
		/*	
			TODO 计算柱形位置信息
			bar的数量和间隔数量是 n 和 n-1的关系
			len * barwidth + (len - 1) * barwidth / barRatio  = offsetWidth => barWidth = offsetWidth/(len + (len - 1) / barRatio)
		*/
		getBarsPos:function(){
			var self = this,
				zoomType = self._cfg.zoomType,
				stackable = self._cfg.stackable,
				ctn = self._innerContainer,
				isY = zoomType == "y",
				len = stackable ? 1 : BaseChart.prototype.obj2Array(self._barPoints).length, //若是堆叠图 则为1
				barsRatio = self._cfg.bars.barsRatio, //一组柱的占空比
				barRatio = self._cfg.bars.barRatio,  //单根柱子的占空比
				areaWidth =  isY ? (self._pointsY.length > 1 ? (self._pointsY[1].y - self._pointsY[0].y) : ctn.height): (self._pointsX.length > 1?(self._pointsX[1].x - self._pointsX[0].x):ctn.width)  , //area总宽度
				offsetWidth = areaWidth * barsRatio, //柱子部分的宽度
				rate = barRatio >= 1 ? 0 : (1 - barRatio)/barRatio,
				barWidth = offsetWidth/(len + (len - 1) * rate), //柱子宽度
				spaceWidth = barWidth * (1 - barRatio) / barRatio, //柱子间隔宽度
				barAndSpaceWidth = stackable ? 0 : barWidth + spaceWidth,
				ctnY = self._innerContainer.bl.y,
				ctnX = self._innerContainer.bl.x,
				offset = (areaWidth * (1-barsRatio)-areaWidth)/2,
				stackArray = []; //用来标记当前堆叠的坐标
				
			self._barsPos = {};

			for(var i in self._points){
				var tmpArray = [];
				//水平柱形图
				if(isY){
					for(var j in self._points[i]){
						var barPosInfo = {},
							w = Math.abs(self._points[i][j].x - ctnX);

						barPosInfo.y = offset + self._points[i][j].y;
						//是否是堆叠图
						if(stackable){
							barPosInfo.x =  ctnX + (stackArray[j] || 0);
							stackArray[j] = stackArray[j] ? stackArray[j] + w : w;
						}else{
							barPosInfo.x =  ctnX;
						}
						barPosInfo.width = w;
						barPosInfo.height = barWidth;
						tmpArray.push(barPosInfo);
					}
				}else{
					for(var j in self._points[i]){
						var barPosInfo = {},
							h = Math.abs(ctnY - self._points[i][j].y);

						barPosInfo.x = offset + self._points[i][j].x;
						//是否是堆叠图
						if(stackable){
							barPosInfo.y =  self._points[i][j].y - (stackArray[j] || 0);
							stackArray[j] = stackArray[j] ? stackArray[j] + h : h;
						}else{
							barPosInfo.y =  self._points[i][j].y;
						}
						barPosInfo.width = barWidth;
						barPosInfo.height = h;
						tmpArray.push(barPosInfo);
					}
				}
				offset += barAndSpaceWidth;
				self._barsPos[i] = tmpArray;
			}
		},
		/*
			画所有柱 
		*/
		drawBars:function(callback){
			var self = this,
				_cfg = self._cfg;

			for(var i in self._barsPos){
				var bars = [],
					posInfos = [];
					
				for(var j in self._barsPos[i]){
					var barPos = self._barsPos[i][j];
					posInfos[j] = barPos;
					bars[j] = self.drawBar(barPos.x,barPos.y,barPos.width,barPos.height,color.getColor(i).DEFAULT,function(){
									self._finished.push(true);
									if(callback && self._finished.length == self._cfg.series.length){
										callback();
									}
								}).attr({
									"barGroup":i,
									"barIndex":j,
									"defaultColor":color.getColor(i).DEFAULT,
									"hoverColor":color.getColor(i).HOVER
								});

				}

				var barObj = {
					bars:bars,
					posInfos:posInfos,
					color:color.getColor(i)
				};
				self._bars[i] = barObj;
			}
			return self._bars;
		},
		//x轴上 平行于y轴的网格线
		drawGridsX:function(){
			var self = this,
				points = self._points[0],
				gridPointsX;

			self._gridsX = [];

			if(self._cfg.zoomType == "x"){
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
					self._gridsX.push(self.drawGridX(gridPointsX[i]));
				}	
			}else{
				for(var i in self._pointsX){
					self._gridsX.push(self.drawGridX(self._pointsX[i]));
				}
			}
			return self._gridsX;
		},
		drawGridX:function(point,css){
			var self = this,
				y = self._innerContainer.tl.y,
				h = self._innerContainer.height,
				css = css || self._cfg.xAxis.css,
				paper = self.htmlPaper,
				cls = self._cfg.themeCls + "-gridsx";

			return paper.lineY(point.x,y,h).addClass(cls).css(self._cfg.xGrids.css);
		},
		//y轴上 平行于x轴的网格线
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
				isY = self._cfg.zoomType == "x" ? false : true;

			self._gridsY = [];

			for(var i = 0,len = self._pointsY.length;i<len;i++){
				self._gridsY[i] = {
					0:self.drawGridY({x:x,y:self._pointsY[i].y}),
					num:isY ? self.coordNumX[i] : self.coordNum[i]
				};
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
				_cfg = self._cfg,
				isY = _cfg.zoomType == "y" ? true : false;

			if(isY){
				for(var i in self._pointsX){
					self._labelX[i] = {0:self.drawLabelX(i,self._pointsX[i]['number'])};
				}
			}else{
				//画x轴刻度线
				for(var i in self._cfg.xAxis.text){
					self._labelX[i] = {0:self.drawLabelX(i,self._cfg.xAxis.text[i])};
				}
			}
		},
		drawLabelsY:function(){
			var self = this,
				_cfg = self._cfg,
				isY = _cfg.zoomType == "x" ? false : true;

			if(isY){
				//画x轴刻度线
				for(var i in self._cfg.yAxis.text){
					self._labelY[i] = {
							0:self.drawLabelY(i,self._cfg.yAxis.text[i])
						}
				}
			}else{
				//画y轴刻度线
				for(var i in self._pointsY){
						self._labelY[i] = {
							0:self.drawLabelY(i,self._pointsY[i].number),
							'num':self._pointsY[i].number
						}
				}
			}
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
			var self = this,
				ctn = self._innerContainer,
				y = ctn.tl.y,
				points = self._points[0],
				h = ctn.height,
				multiple = self._multiple,
				evtBars = self._evtEls._bars = [],
				paper,
				x;

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

			for(var i in self._barsPos){
				var bars = [];
				for(var j in self._barsPos[i]){
					var barPos = self._barsPos[i][j];
					bars[j] = paper.rect(barPos.x,barPos.y,barPos.width,barPos.height).addClass(evtLayoutBarsCls).attr({"barGroup":i,"barIndex":j});
				}
				self._evtEls._bars.push(bars);
			}
			return paper;
		},
		clearEvtLayout:function(){
			var self = this;
			
			if(self._evtEls._bars){
				 for(var i in self._evtEls._bars){
						for(var j in self._evtEls._bars[i]){
							self._evtEls._bars[i][j].remove();
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
					chart:self,
					evtBind:true,
					css:legendCfg.css || {}
				});
			return self.legend;
		},
		render:function(clear){

			var self = this,

				_cfg = self._cfg,

				ctn = self._innerContainer,

				themeCls = _cfg.themeCls;

				clear && self._$ctnNode.html("");
				//渲染html画布 只放图形
				self.paper = new HtmlPaper(self._$ctnNode,{
					clsName:canvasCls,
					width:ctn.width,
					height:ctn.height,
					left:ctn.tl.x,
					top:ctn.tl.y
				});
				//clone
				self._barPoints = self._points;

				self.getBarsPos();
				//渲染html画布
				self.htmlPaper = new HtmlPaper(self._$ctnNode,{
					clsName:themeCls
				});

				self.drawTitle();

				self.drawSubTitle();
				//事件层
				self.renderEvtLayout();
				//渲染tip
				_cfg.tip.isShow && self.renderTip();
				//画x轴上的平行线
				_cfg.xGrids.isShow && self.drawGridsX();

				_cfg.yGrids.isShow && self.drawGridsY();
				//画横轴
				_cfg.xAxis.isShow && self.drawAxisX();

				_cfg.yAxis.isShow && self.drawAxisY();
				//画横轴刻度
				_cfg.xLabels.isShow && self.drawLabelsX();

				_cfg.yLabels.isShow && self.drawLabelsY();

				_cfg.legend.isShow && self.renderLegend();
				//画柱
				self.drawBars(function(){
					S.log("finished");
					self.afterRender();
				});
				
				self.bindEvt();
				
				S.log(self);

		},

		bindEvt:function(){
				var self = this,
					_cfg = self._cfg;

				Evt.detach($("."+evtLayoutBarsCls,self._$ctnNode),"mouseenter");

				Evt.on($("."+evtLayoutBarsCls,self._$ctnNode),"mouseenter",function(e){
					var $evtBar = $(e.currentTarget),
						barIndex = $evtBar.attr("barIndex"),
						barGroup = $evtBar.attr("barGroup");
					_cfg.tip.isShow && self.tipHandler(barGroup,barIndex);

					self.barChange(barGroup,barIndex);

				});

				Evt.detach($("."+evtLayoutBarsCls,self._$ctnNode),"mouseleave");

				Evt.on($("."+evtLayoutBarsCls,self._$ctnNode),"mouseleave",function(e){

					var $evtBar = $(e.currentTarget),
						barIndex = $evtBar.attr("barIndex"),
						barGroup = $evtBar.attr("barGroup"),
						$bar = self._bars[barGroup]['bars'][barIndex];
						$bar.css({"background":$bar.attr("defaultColor")});
				});

				Evt.detach(self._evtEls.paper.$paper,"mouseleave");

				Evt.on(self._evtEls.paper.$paper,"mouseleave",function(e){
					self.tip && self.tip.hide();
					self.paperLeave();
				})

		},
		paperLeave:function(){
			var self = this;
				self.fire("paperLeave",self);
		},
		barChange:function(barGroup,barIndex){
			var self = this,
				currentBars = self._bars[barGroup],
				e = S.mix({
					target:currentBars['bars'][barIndex],
					currentTarget:currentBars['bars'][barIndex],
					barGroup:Math.round(barGroup),
					barIndex:Math.round(barIndex)
				},self._points[barGroup][barIndex]);

			self.fire("barChange",e);
		},
		tipHandler:function(barGroup,barIndex){
			var self = this,
				_cfg = self._cfg,
				tip = self.tip,
				isY = _cfg.zoomType == "y" ? true : false,
				$tip = tip.getInstance(),
				$bar = self._bars[barGroup]['bars'][barIndex],
				defaultColor = $bar.attr("defaultColor"),
				tpl = self._cfg.tip.template,
				posx = isY ? $bar.attr("posx") - (-$bar.width()) - (-self._innerContainer.x) : $bar.attr("posx"),
				posy = $bar.attr("posy"),
				tipData= S.merge(self._points[barGroup][barIndex].dataInfo,_cfg.series[barGroup]);
				//删除data 避免不必要的数据
				delete tipData.data;self._points[barGroup][barIndex]["dataInfo"],

				$bar.css({"background":$bar.attr("hoverColor")});

				if(!tpl) return;

				tip.fire("setcontent",{data:tipData})

				tip.fire("move",{x:posx,y:posy,style:self.processAttr(_cfg.tip.css,defaultColor)});
		},
		//处理网格和标注
		animateGridsAndLabels:function(){
			var self = this,
				zoomType = self._cfg.zoomType;
			if(zoomType == "y"){
				for(var i in self._labelX){
					self._labelX[i] && self._labelX[i][0] && $(self._labelX[i][0]).remove();
					self._gridsX[i] && self._gridsX[i][0] && $(self._gridsX[i][0]).remove();
				}
				self.drawGridsX();
				self.drawLabelsX();
			}else if(zoomType == "x"){
				for(var i in self._labelY){
					self._labelY[i] && self._labelY[i][0] && self._labelY[i][0].remove();
					self._gridsY[i] && self._gridsY[i][0] && self._gridsY[i][0].remove();
				}	
				self.drawGridsY();
				self.drawLabelsY();
			}
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
		showBar:function(barIndex){

			var self = this,
				ctn = self._innerContainer;

				BaseChart.prototype.recoveryData.call(self,barIndex);

				self._barPoints[barIndex] = self._points[barIndex];

				self.animateGridsAndLabels();

				self.getBarsPos();
			//柱子动画
				for(var i in self._bars)if(i != barIndex){

					for(var j in self._bars[i]['bars']){

						if(self._barsPos[i]){

							var barPos = self._barsPos[i][j];

							barPos && self._bars[i]['bars'][j].stop().animate({"height":barPos.height,"width":barPos.width,"marginTop":barPos.y - ctn.y,marginLeft:barPos.x - ctn.x},0.4,"easeOut",function(){
							});

							self._bars[i]['bars'][j].attr({"posx":barPos.x,"posy":barPos.y});
						}

					}

				}

				var posInfos = [],bars = [];

				for(var j in self._barsPos[barIndex]){

					var barPos = self._barsPos[barIndex][j];

					posInfos[j] = barPos;
					bars[j] = self.drawBar(barPos.x,barPos.y,barPos.width,barPos.height,color.getColor(barIndex).DEFAULT).attr({"barGroup":barIndex,"barIndex":j,"defaultColor":color.getColor(barIndex).DEFAULT,"hoverColor":color.getColor(barIndex).HOVER});

				}

				self._bars[barIndex] = {
					bars:bars,
					posInfos:posInfos,
					color:color.getColor(i)
				};

				self.clearEvtLayout();

				self.renderEvtLayout();

				self.bindEvt();

				S.log(self);
		},
		hideBar:function(barIndex){
			var self = this,
				ctn = self._innerContainer;

				BaseChart.prototype.removeData.call(self,barIndex);

				delete self._barPoints[barIndex];

				self.animateGridsAndLabels();

				self.getBarsPos();

				for(var i in self._bars[barIndex]['bars']){
						self._bars[barIndex]['bars'][i].remove();
				}
				
				//柱子动画
				for(var i in self._bars)if(i != barIndex){

					for(var j in self._bars[i]['bars']){

						var barPos = self._barsPos[i] ? self._barsPos[i][j] : "";

						barPos && self._bars[i]['bars'][j].stop().animate({"height":barPos.height,"width":barPos.width,"marginTop":barPos.y - ctn.y,marginLeft:barPos.x - ctn.x},0.4,"easeOut",function(){
							
						});

						self._bars[i]['bars'][j].attr({"posx":barPos.x,"posy":barPos.y});

					}

				}

				self.clearEvtLayout();

				self.renderEvtLayout();

				self.bindEvt();

				S.log(self);
		},
		afterRender:function(){

			var self = this;
			self.fire("afterRender",self);

		},
		getPaper:function(){
			return this.paper;
		},
		//清空画布上的内容
		clear:function(){

			return this.paper.clear();

		}

	});

	return BarChart;

},{requires:[
	'gallery/template/1.0/index',
	'../basechart/index',
	'../tools/color/index',
	'../tools/htmlpaper/index',
	'../legend/index',
	'./theme',
	'../tools/touch/index',
	'../tip/index'
]});