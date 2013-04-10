/**
 * @fileOverview KChart 1.1  scatterchart
 * @author huxiaoqi567@gmail.com
 */
KISSY.add("gallery/kcharts/1.1/scatterchart/index",function(S,Base,Template,BaseChart,Raphael,ColorLib,HtmlPaper,Legend,Theme,touch,Tip,undefined){

	var $ = S.all,
		Evt = S.Event,
		clsPrefix = "ks-chart-",
		themeCls = clsPrefix + "default",
		evtLayoutCls = clsPrefix + "evtlayout",
		evtLayoutAreasCls = evtLayoutCls+"-areas",
		evtLayoutRectsCls = evtLayoutCls + "-rects",
		COLOR_TPL = "{COLOR}",
		color;

	var ScatterChart = function(cfg){
		var self = this;
			self._cfg = cfg;
			self._cfg.zoomType="xy";
			self.init();
	};

	S.extend(ScatterChart,BaseChart,{
		init:function(){
			var self = this;

			BaseChart.prototype.init.call(self,self._cfg);

			self.chartType = "scatterchart";

			if(!self._$ctnNode[0]) return;

			var _defaultConfig = {
					themeCls:themeCls,
					autoRender:true,
					title:{
		            	content:"",
		            	css:{
		            		"text-align":"center",
		            		"font-size":"16px"
		            	},
		            	isShow:true
		            },
		            colors:[],
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
					 		"stroke":"#fff",
					 		"r":4,
					 		"stroke-width":1.5,
					 		"fill":COLOR_TPL,
					 		"opacity":0.6
					 	},
					 	hoverAttr:{
					 		"stroke":"#fff",
					 		"r":5,
					 		"fill":COLOR_TPL,
					 		"stroke-width":0,
					 		"opacity":0.6
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
							"position":"absolute" 	//修复ie7被遮住的Bug
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
		processAttr:function(attrs,color){
			var newAttrs = S.clone(attrs);

			for(var i in newAttrs){
				if(newAttrs[i] && typeof newAttrs[i] == "string"){
						newAttrs[i] = newAttrs[i].replace(COLOR_TPL,color);
				}
			}

			return newAttrs;
		},
		//不同大小的圆形计算
		diffStocksSize:function(){
			var self = this,
				r = self._cfg.points['attr']['r'],
				datas = self._datas['cur'],
				allData = [],
				min,
				ratio;
			for(var i in datas){
				allData = allData.concat(BaseChart.prototype.getArrayByKey.call(null,datas[i]['data'],2));
			}
			S.log(allData);
			if(!allData.length) return;
			//归一化之后 混入points 半径 定义最小半径 为 配置的半径 权重为1
			min = Math.min.apply(null,allData);

			for(var i in self._points){
				var tmp = BaseChart.prototype.getArrayByKey.call(null,datas[i]['data'],2);
				for(var j in self._points[i])if(tmp.length > 0){
					self._points[i][j]['r'] = tmp[j] * r;
				}
			}
		},
		//画圆点
		drawStocks:function(){
			var self = this;

			self._stocks = {};
			
				for(var i in self._points){
					var stocks = [];
					for(var j in self._points[i]){
						var defaultColor = self.color.getColor(i).DEFAULT;
						stocks[j] = self.drawStock(self._points[i][j].x,self._points[i][j].y,self._points[i][j].r,S.mix(self._cfg.points.attr,{stroke:defaultColor,fill:defaultColor,r:self._points[i][j].r}));
					}
					self._stocks[i] = {stocks:stocks}
				}
		},
		//画单个圆点
		drawStock:function(x,y,r,attr){
			var self = this,
				paper = self.paper,
				_attr = self._cfg.points.attr;
			return paper.circle(x,y,r,attr).attr(_attr).attr(attr);
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
			var self = this;
			//画x轴刻度线
				for(var i in self._pointsX){
						self._labelX[i] = self.drawLabelX(i,self._pointsX[i]['number']);
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
				cls = self._cfg.themeCls + "-ylabels";
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
				_cfg = self._cfg,
				x,
				ctn = self._innerContainer,
				y = ctn.tl.y,
				h = ctn.height,
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

				for(var i in self._points){
					var rects = [];
					for(var j in self._points[i]){
						var w = (self._points[i][j]['r'] || _cfg.points.attr.r) * 2;
						rects[j] = paper.rect(self._points[i][j].x - w/2,self._points[i][j].y - w/2,w,w).attr({"line_index":i,"index":j}).addClass(evtLayoutRectsCls);
					}
					self._evtEls._rects[i] = rects;
				}

		},
		clearEvtLayout:function(){
			var self = this;
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
				//画x轴上的平行线
				_cfg.xGrids.isShow && self.drawGridsX();

				_cfg.yGrids.isShow && self.drawGridsY();
				//画横轴
				_cfg.xAxis.isShow && self.drawAxisX();

				_cfg.yAxis.isShow && self.drawAxisY();
				//画横轴刻度
				_cfg.xLabels.isShow && self.drawLabelsX();

				_cfg.yLabels.isShow && self.drawLabelsY();

				self.diffStocksSize();

				self.drawStocks();
				//事件层
				self.renderEvtLayout();

				self.afterRender();
					
				self.bindEvt();

				S.log(self);
		},
		bindEvt:function(){
			var self = this,
				evtEls = self._evtEls;

			Evt.detach($("."+evtLayoutRectsCls,$("."+evtLayoutCls,self._$ctnNode)),"mouseenter");
			Evt.on($("."+evtLayoutRectsCls,$("."+evtLayoutCls,self._$ctnNode)),"mouseenter",function(e){
				var $rect = $(e.currentTarget),
					rectIndex = $rect.attr("index"),
					lineIndex = $rect.attr("line_index");
					if(self._points[lineIndex][rectIndex].dataInfo){

						 self.stockChange(lineIndex,rectIndex);
						 // 操作tip
						 self._cfg.tip.isShow && self.tipHandler(lineIndex,rectIndex);
					   }						
				});
			
			// 绑定画布mouseleave事件
			Evt.detach(evtEls.paper.$paper,"mouseleave");
			Evt.on(evtEls.paper.$paper,"mouseleave",function(e){
				self.tip && self.tip.hide();
				self.paperLeave();
			});
		},
		stockChange:function(lineIndex,stockIndex){
			var self = this,
				currentStocks = self._stocks[lineIndex],
				e = {
					target:currentStocks['stocks'][stockIndex],
					currentTarget:currentStocks['stocks'][stockIndex],
					lineIndex:Math.round(lineIndex),
					stockIndex:Math.round(stockIndex)
				};

			self.fire("stockChange",e);
		},
		tipHandler:function(currentLineIndex,index){
			var self = this,
				color = self.color.getColor(currentLineIndex)['DEFAULT'],	//获取当前直线的填充色
				tip = self.tip,
				_cfg = self._cfg,
				tpl = _cfg.tip.template,
				$tip = tip.getInstance(),
				tipData,
				curPoint;

				if(!tpl) return;
				tipData = self._points[currentLineIndex][index].dataInfo;
				//支持方法渲染
				if(S.isFunction(tpl)){
						tip.setContent(tpl(tipData));
				}else{
						tip.renderTemplate(tpl,tipData);
				}

				curPoint = self._points[currentLineIndex][index];

				if(tip.isVisable()){
					tip.animateTo(curPoint.x,curPoint.y);
				}else{
					tip.moveTo(curPoint.x,curPoint.y);
				}
				$tip.css(self.processAttr(_cfg.tip.css,color));
		},
		paperLeave:function(){
			var self = this;
				self.fire("paperLeave",self);
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
			this.paper.clear();
		}
	});
	return ScatterChart;
},{requires:[
	'base',
    'gallery/template/1.0/index',
	'../basechart/index',
	'../raphael/index',
	'../tools/color/index',
	'../tools/htmlpaper/index',
	'../legend/index',
	'./theme',
	'../tools/touch/index',
	'../tip/index'
]});