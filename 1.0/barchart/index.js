KISSY.add('gallery/kcharts/1.0/barchart/index',function(S,BaseChart,Color,HtmlPaper,Tip,undefined){

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

			var _defaultConfig = {
					themeCls:themeCls,
					autoRender:true,
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
							color:"#eee"
						}
					},
					//纵轴
					yAxis:{
						isShow:true,
						css:{},
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

					 	}
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

			self._cfg = S.mix(_defaultConfig,self._cfg,undefined,undefined,true);
			//主题
			themeCls = self._cfg.themeCls;

			self.color = color = new Color();

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
		drawBar:function(x,y,w,h,css,callback){

				var self = this,
					paper = self.paper,
					cls = canvasCls + "-bars",
					ctn = self._innerContainer,
					_cfg = self._cfg,
					rect,
					x = Math.round(x),
					y = Math.round(y),
					w = Math.round(w),
					h = Math.round(h);

			//允许动画
			if(_cfg.anim){

				var duration = _cfg.anim.duration ? (S.isNumber(_cfg.anim.duration) ? _cfg.anim.duration : 0.5) : 0.5,
					easing = _cfg.anim.easing ? _cfg.anim.easing : "easeOut";

				rect = paper.rect(x,ctn.bl.y,w,0).attr({"posx":x,"posy":y}).addClass(cls).css(S.mix(self._cfg.bars.css,css)).animate({"height":h,"marginTop":y - ctn.y},duration,easing,function(){
					callback && callback();
				});

			}else{

				rect = paper.rect(x,y,w,h).attr({"posx":x,"posy":y}).addClass(cls).css(S.mix(self._cfg.bars.css,css));

			}

			return  rect;

		},
		/*计算柱形位置信息
				bar的数量和间隔数量是 n 和 n-1的关系
					len * barwidth + (len - 1) * barwidth / barRatio  = offsetWidth  

					=> barWidth = offsetWidth/(len + (len - 1) / barRatio)

		*/
		getBarsPos:function(){

			var self = this,
				len = BaseChart.prototype.obj2Array(self._barPoints).length,
				barsRatio = 0.6, //一组柱的占空比
				barRatio = 0.5,  //单根柱子的占空比
				areaWidth =  (self._pointsX[1].x - self._pointsX[0].x),
				offsetWidth = areaWidth * barsRatio,
				barWidth = offsetWidth/(len + (len - 1) / ((1 - barRatio) / barRatio)),
				spaceWidth = barWidth * (1 - barRatio) / barRatio,
				barAndSpaceWidth = barWidth + spaceWidth,
				ctnY = self._innerContainer.bl.y,
				offset = (areaWidth * (1-barsRatio)-areaWidth)/2;

			self._barsPos = {};

			for(var i in self._points){

				var tmpArray = [];

				for(var j in self._points[i]){

					var barPosInfo = {},
						h = Math.abs(ctnY - self._points[i][j].y);

					barPosInfo.x = offset + self._points[i][j].x;

					barPosInfo.y =  self._points[i][j].y;

					barPosInfo.width = barWidth;

					barPosInfo.height = h;

					tmpArray.push(barPosInfo);

				}

				offset += barAndSpaceWidth;

				self._barsPos[i] = tmpArray;

			}

		},
		/*
			画所有柱 
		*/
		drawBars:function(callback){

			var self = this;

			for(var i in self._barsPos){

				var bars = [],posInfos = [];

				for(var j in self._barsPos[i]){

					var barPos = self._barsPos[i][j];

					posInfos[j] = barPos;

					bars[j] = self.drawBar(barPos.x,barPos.y,barPos.width,barPos.height,{"background":color.getColor(i).DEFAULT},function(){
									self._finished.push(true);
									if(callback && self._finished.length == self._cfg.series.length){
											callback();
									}
								})
								.attr({"barGroup":i,"barIndex":j,"defaultColor":color.getColor(i).DEFAULT,"hoverColor":color.getColor(i).HOVER});

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
						self.drawLabelX(i,text[i]);
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
				x,
				ctn = self._innerContainer,
				y = ctn.tl.y,
				points = self._points[0],
				w = self._points[0] && self._points[0][1] ? points[1].x - points[0].x : self._areas[0].width(),
				h = ctn.height,
				multiple = self._multiple,
				evtAreas = self._evtEls._areas = [],
				evtBars = self._evtEls._bars = [],

				paper = self._evtEls.paper = new HtmlPaper(self._$ctnNode,{
						clsName:evtLayoutCls,
						prependTo:false,	//appendTo
						width:ctn.width,
						height:h,
						left:ctn.tl.x,
						top:ctn.tl.y
				});

			for(var i = 0,len = points && points.length ;i<len;i++){

				evtAreas[i] = paper.rect(points[i].x - w/2,ctn.tl.y,w,h).addClass(evtLayoutAreasCls);

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

			if(self._evtEls._areas){

				for(var i in self._evtEls._areas){

					self._evtEls._areas[i].remove();

				}
			}
			
			if(self._evtEls._bars){

				 for(var i in self._evtEls._bars){

						for(var j in self._evtEls._bars[i]){
							self._evtEls._bars[i][j].remove();
						}

				}
			}

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
				//画背景块状区域
				_cfg.areas.isShow && self.drawAreas();
				//画x轴上的平行线
				_cfg.xGrids.isShow && self.drawGridsX();

				_cfg.yGrids.isShow && self.drawGridsY();
				//画横轴
				_cfg.xAxis.isShow && self.drawAxisX();

				_cfg.yAxis.isShow && self.drawAxisY();
				//画横轴刻度
				_cfg.xLabels.isShow && self.drawLabelsX();

				_cfg.yLabels.isShow && self.drawLabelsY();
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
				$tip = tip.getInstance();
				dataInfo = self._points[barGroup][barIndex]["dataInfo"] || {},
				$bar = self._bars[barGroup]['bars'][barIndex],
				defaultColor = $bar.attr("defaultColor");
				$bar.css({"background":$bar.attr("hoverColor")});
				tip.renderTemplate(self._cfg.tip.template,dataInfo);

				$tip.css(self.processAttr(_cfg.tip.css,defaultColor));

				if(tip.isVisable()){
				 	tip.animateTo($bar.attr("posx"),$bar.attr("posy"));
				 }else{
					tip.moveTo($bar.attr("posx"),$bar.attr("posy"));
				 }
		},
		//处理网格和标注
		animateGridsAndLabels:function(){

			var self = this;

			for(var i in self._labelY){
				self._labelY[i][0].remove();
				self._gridsY[i][0].remove();
			}

			self.drawGridsY();

			self.drawLabelsY();

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

				S.log(self._barsPos)
			//柱子动画
				for(var i in self._bars)if(i != barIndex){

					for(var j in self._bars[i]['bars']){

						if(self._barsPos[i]){

							var barPos = self._barsPos[i][j];

							barPos && self._bars[i]['bars'][j].animate({"height":barPos.height,"width":barPos.width,"marginTop":barPos.y - ctn.y,marginLeft:barPos.x - ctn.x},0.4,self._cfg.anim.easing,function(){
							});

							self._bars[i]['bars'][j].attr({"posx":barPos.x,"posy":barPos.y});
						}

					}

				}

				var posInfos = [],bars = [];

				for(var j in self._barsPos[barIndex]){

					var barPos = self._barsPos[barIndex][j];

					posInfos[j] = barPos;

					bars[j] = self.drawBar(barPos.x,barPos.y,barPos.width,barPos.height,{"background":color.getColor(barIndex).DEFAULT}).attr({"barGroup":barIndex,"barIndex":j,"defaultColor":color.getColor(barIndex).DEFAULT,"hoverColor":color.getColor(barIndex).HOVER});

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

						barPos && self._bars[i]['bars'][j].animate({"height":barPos.height,"width":barPos.width,"marginTop":barPos.y - ctn.y,marginLeft:barPos.x - ctn.x},0.4,self._cfg.anim.easing,function(){
							
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

},{requires:['../basechart/index','../tools/color/index','../tools/htmlpaper/index','../tip/index','./assets/kcharts-ui-core.css']});