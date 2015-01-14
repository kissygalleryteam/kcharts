/**
 * @fileOverview KChart 1.3  scatterchart
 * @author huxiaoqi567@gmail.com
 */
define(function(require,exports,module) {
	var Util = require("util"),
		Node = require("node"),
		Base = require("base"),
		Evt = require('event-dom'),
		Template = require("kg/kcharts/5.0.1/tools/template/index"),
		Raphael = require("kg/kcharts/5.0.1/raphael/index"),
		BaseChart = require("kg/kcharts/5.0.1/basechart/index"),
		ColorLib = require("kg/kcharts/5.0.1/tools/color/index"),
		HtmlPaper = require("kg/kcharts/5.0.1/tools/htmlpaper/index"),
		Legend = require("kg/kcharts/5.0.1/legend/index"),
		Theme = require("./theme"),
		Touch = require("kg/kcharts/5.0.1/tools/touch/index"),
		Tip = require("kg/kcharts/5.0.1/tip/index"),
		Anim = require("kg/kcharts/5.0.1/animate/index"),
		graphTool = require("kg/kcharts/5.0.1/tools/graphtool/index"),
		Cfg = require("./cfg");
	var $ = Node.all,
		clsPrefix = "ks-chart-",
		themeCls = clsPrefix + "default",
		evtLayoutCls = clsPrefix + "evtlayout",
		COLOR_TPL = "{COLOR}",
		color,
		POINTS_TYPE = ["circle", "triangle", "rhomb", "square"];

	var methods = {
		initializer: function() {
			this.init();
		},
		init:function(){
			var self = this,
				points;
			self.chartType = "scatterchart";
			var defaultCfg = Util.clone(Cfg);
			self._cfg = Util.mix(defaultCfg, self.userConfig,undefined,undefined,true);
			self._cfg.zoomType = "xy";
			BaseChart.prototype.init.call(self, self._cfg);
			self._cfg.autoRender && self.render();
		},
		/**
			渲染
		**/
		render: function() {
			var self = this,
				_cfg = self._cfg,
				themeCls = _cfg.themeCls;

			if (!self._$ctnNode[0]) return;

			BaseChart.prototype.dataFormat.call(self, self._cfg);
			//清空所有节点
			self._$ctnNode.html("");
			//统计渲染完成的数组
			self._finished = [];
			//主题
			themeCls = self._cfg.themeCls || Cfg.themeCls;
			self._cfg = Util.mix(Util.clone(Util.mix(Cfg, Theme[themeCls], undefined, undefined, true)), self._cfg, undefined, undefined, true);
			self.color = color = new ColorLib({
				themeCls: themeCls
			});
			if (self._cfg.colors.length > 0) {
				color.removeAllColors();
			}
			for (var i in self._cfg.colors) {
				color.setColor(self._cfg.colors[i]);
			}
			//获取矢量画布
			self.paper = Raphael(self._$ctnNode[0], _cfg.width, _cfg.height, {
				"position": "absolute"
			});
			//渲染html画布
			self.htmlPaper = new HtmlPaper(self._$ctnNode, {
				clsName: themeCls
			});

			self._clonePoints = self._points;

			BaseChart.Common.drawTitle.call(null, this, themeCls);

			BaseChart.Common.drawSubTitle.call(null, this, themeCls);
			//渲染tip
			self.renderTip();
			//画x轴上的平行线
			BaseChart.Common.drawGridsX.call(null, this);

			BaseChart.Common.drawGridsY.call(null, this);
			//画横轴
			BaseChart.Common.drawAxisX.call(null, this);

			BaseChart.Common.drawAxisY.call(null, this);
			//画横轴刻度
			BaseChart.Common.drawLabelsX.call(null, this);

			BaseChart.Common.drawLabelsY.call(null, this);

			self.diffStocksSize();

			self.drawAllStocks();

			self.renderLegend();
			//事件层
			self.renderEvtLayout();

			self.afterRender();

			self.bindEvt();

		},
		processAttr: function(attrs, color) {
			var newAttrs = Util.clone(attrs);
			for (var i in newAttrs) {
				if (newAttrs[i] && typeof newAttrs[i] == "string") {
					newAttrs[i] = newAttrs[i].replace(COLOR_TPL, color);
				}
			}
			return newAttrs;
		},
		//不同大小的圆形计算
		diffStocksSize: function() {
			var self = this,
				r = self._cfg.points['attr']['r'],
				datas = self._datas['total'],
				allData = [],
				min,
				ratio;
			for (var i in datas) {
				allData = allData.concat(BaseChart.prototype.getArrayByKey.call(null, datas[i]['data'], 2));
			}
			if (!allData.length) {
				for (var i in self._points) {
					for (var j in self._points[i]) {
						self._points[i][j]['r'] = r;
					}
				}
				return;
			}
			//归一化之后 混入points 半径 定义最小半径 为 配置的半径 权重为1
			// min = Math.min.apply(null,allData);

			for (var i in self._points) {
				var tmp = BaseChart.prototype.getArrayByKey.call(null, datas[i]['data'], 2);
				for (var j in self._points[i])
					if (tmp.length > 0) {
						self._points[i][j]['r'] = tmp[j] * r;
					}
			}
		},
		//画圆点
		drawAllStocks: function() {
			var self = this;
			self._stocks = {};
			for (var i in self._points) {
				self.drawStocks(i)
			}
		},
		drawStocks: function(groupIndex) {
			var self = this,
				stocks = [],
				color = self.color.getColor(groupIndex).DEFAULT,
				pointsAttr = self._cfg.points.attr;

			self._stocks[groupIndex] = {
				type: pointsAttr.type == "auto" ? POINTS_TYPE[groupIndex % 4] : pointsAttr.type
			};
			for (var i in self._points[groupIndex]) {
				var point = self._points[groupIndex][i];
				stocks[i] = self.drawStock(groupIndex,i,self.processAttr(self._cfg.points.attr, color));
			}
			self._stocks[groupIndex]['stocks'] = stocks;
			self._stocks[groupIndex]['points'] = self._points[groupIndex];
			return stocks;
		},
		//画单个圆点
		drawStock: function(groupIndex, stockIndex,attrs) {
			var self = this,
				cfg = self._cfg,
				paper = self.paper,
				color = self.color,
				stroke = color.getColor(groupIndex).DEFAULT,
				type = POINTS_TYPE[groupIndex % 4],
				type = self._stocks[groupIndex]['type'],
				point = self._points[groupIndex][stockIndex],
				template = cfg.points.template,
				attrs = attrs || {},
				x = attrs.x !== undefined ? attrs.x : point.x,
				y = attrs.y !== undefined ? attrs.y : point.y,
				r = self._points[groupIndex][stockIndex]['r'] || attrs['r'],
				$stock;

			if (x !== undefined && y !== undefined) {
				if (Util.isFunction(template)) {
					return template({
						paper: paper,
						groupIndex: groupIndex,
						stockIndex: stockIndex,
						attr: attrs,
						color: stroke,
						graphTool: graphTool,
						x: x,
						y: y
					});
				}
				switch (type) {
					case "triangle":
						$stock = graphTool.triangle(paper, x, y, r * 1.4);
						break;
					case "rhomb":
						$stock = graphTool.rhomb(paper, x, y, r * 2.4, r * 2.4);
						break;
					case "square":
						$stock = graphTool.square(paper,x, y, r * 2, r * 2);
						break;
					default:
						$stock = paper.circle(x, y, r, attrs);
						break;
				}
				$stock.attr(attrs).attr({cx:x,cy:y}).attr({r:r});
				return $stock;
			}
			return;
		},
		//渲染tip
		renderTip: function() {
			if (!this._cfg.tip.isShow) return;
			var self = this,
				_cfg = self._cfg,
				ctn = self._innerContainer,
				boundryCfg = _cfg.tip.boundryDetect ? {
					x: ctn.tl.x,
					y: ctn.tl.y,
					width: ctn.width,
					height: ctn.height
				} : {},
				tipCfg = Util.mix(_cfg.tip, {
					rootNode: self._$ctnNode,
					clsName: _cfg.themeCls,
					boundry: boundryCfg
				});

			self.tip = new Tip(tipCfg);
			return self.tip;
		},
		//渲染事件层
		renderEvtLayout: function() {
			var self = this,
				_cfg = self._cfg,
				x,
				ctn = self._innerContainer,
				y = ctn.tl.y,
				h = ctn.height,
				rects = self._evtEls._rects = [],
				paper;
			if (!self._evtEls.paper) {
				paper = self._evtEls.paper = new HtmlPaper(self._$ctnNode, {
					clsName: evtLayoutCls,
					prependTo: false, //appendTo
					width: ctn.width,
					height: h,
					left: ctn.tl.x,
					top: ctn.tl.y,
					css: {
						"z-index": 20,
						background: "#fff",
						filter: "alpha(opacity =1)",
						"-moz-opacity": 0.01,
						"-khtml-opacity": 0.01,
						opacity: 0.01
					}
				});
			} else {
				paper = self._evtEls.paper;
			}

			for (var i in self._points) {
				var rects = [];
				for (var j in self._points[i]) {
					var w = (self._points[i][j]['r'] || _cfg.points.attr.r) * 2;
					rects[j] = {
						x:self._points[i][j].x - w / 2,
						y:self._points[i][j].y - w / 2,
						w:w,
						h:w,
						groupIndex:i,
						pointIndex:j
					};
				}
				self._evtEls._rects[i] = rects;
			}
		},
		/**
			清除事件代理层节点
		**/
		clearEvtLayout: function() {
			var self = this;
			self._evtEls._rects = [];
		},
		/**
			渲染legend
		**/
		renderLegend: function() {
			if (!this._cfg.legend.isShow) return;
			var self = this,
				legendCfg = self._cfg.legend,
				container = (legendCfg.container && $(legendCfg.container)[0]) ? $(legendCfg.container) : self._$ctnNode;

			var innerContainer = self._innerContainer;
			var colors = self.color._colors, //legend icon 的颜色表，循环
				len = colors.length,
				cfg = self._cfg,
				series = self._cfg.series
			var barconfig = Util.map(series, function(serie, i) {
				i = i % len;
				var item = {},
					color = colors[i]
					item.text = serie.text;
				item.DEFAULT = color.DEFAULT;
				item.HOVER = color.HOVER;
				return item;
			});
			var globalConfig = Util.merge({
				// icontype:"circle",
				// iconsize:10,
				interval: 20, //legend之间的间隔
				iconright: 5, //icon后面的空白
				showicon: true //默认为true. 是否显示legend前面的小icon——可能用户有自定义的需求
			}, cfg.legend.globalConfig);

			self.legend = new Legend({
				container: container,
				paper: self.paper,
				bbox: {
					width: innerContainer.width,
					height: innerContainer.height,
					left: innerContainer.x,
					top: innerContainer.y
				},
				align: cfg.legend.align || "bc",
				offset: cfg.legend.offset || [0, 30],
				globalConfig: globalConfig,
				config: barconfig
			});

			self.legend.on("click", function(evt) {
				var i = evt.index,
					$text = evt.text,
					$icon = evt.icon,
					el = evt.el
				if (el.hide != 1) {
					this.hidePoints(i);
					el.hide = 1;
					el.disable();
				} else {
					this.showPoints(i);
					el.hide = 0;
					el.enable();
				}
			}, this);
			return self.legend;
		},
		/**
			展示index组散点
			@param index {number} 索引
		**/
		showPoints: function(index) {
			var self = this;
			BaseChart.prototype.recoveryData.call(self, index);
			self._clonePoints[index] = self._points[index];
			BaseChart.Common.animateGridsAndLabels.call(null, self);
			for (var i in self._stocks) {
				self._stocks[i]['points'] = self._points[i];
			}
			self.animateSiblingsPoints(index);
			self.diffStocksSize();
			self.drawStocks(index)
			self.clearEvtLayout();
			self.renderEvtLayout();
			self.bindEvt();
		},
		/**
			隐藏index组散点
			@param index {number} 索引
		**/
		hidePoints: function(index) {
			var self = this;
			BaseChart.prototype.removeData.call(self, index);
			delete self._clonePoints[index];
			BaseChart.Common.animateGridsAndLabels.call(null, self);
			for (var i in self._stocks[index]['stocks']) {
				self._stocks[index]['stocks'][i].remove();
			}
			for (var i in self._stocks) {
				self._stocks[i]['points'] = self._points[i];
			}
			self.animateSiblingsPoints(index);
			self.clearEvtLayout();
			self.renderEvtLayout();
			self.bindEvt();
		},
		/**
			移动除index外的其他点集
			@param groupIndex {number} 索引
		**/
		animateSiblingsPoints: function(groupIndex) {
			var self = this,
				stocks;
			for (var i in self._stocks){
				if (groupIndex != i) {
					stocks = self._stocks[i];
					for (var j in stocks['stocks']) {
						self._points[i] && stocks['stocks'][j].animate({
								transform: "T" + (stocks['points'][j]['x'] - stocks['stocks'][j].attr("cx")) + 
							           "," + (stocks['points'][j]['y'] - stocks['stocks'][j].attr("cy"))
							}, 400);
					}
				}
			}
		},
		bindEvt: function() {
			var self = this,
				evtEls = self._evtEls,
				hoverAttr = Util.clone(self._cfg.points.hoverAttr);
			Evt.detach(evtEls.paper.$paper, "mousemove");
			Evt.on(evtEls.paper.$paper, "mousemove",function(e){
				//mousemove代理
				self.delegateMouseMove(self.getOffset(e),function(groupIndex,pointIndex){
					if (self._points[groupIndex][pointIndex].dataInfo) {
						self.stockChange(groupIndex, pointIndex);
						// 操作tip
						self._cfg.tip.isShow && self.tipHandler(groupIndex, pointIndex);
					}

				});
			});
			// 绑定画布mouseleave事件
			Evt.detach(evtEls.paper.$paper, "mouseleave");
			Evt.on(evtEls.paper.$paper, "mouseleave", function(e) {
				self.tip && self.tip.hide();
				self.paperLeave();
			});
		},
		delegateMouseMove:function(e,cb){
			var self = this,rect,ctn = self.getInnerContainer();
			for(var i in self._evtEls._rects){
				for(var j in self._evtEls._rects[i]){
					rect = self._evtEls._rects[i][j];
					if(self.isInSide(e.offsetX + ctn.x, e.offsetY + ctn.y,rect.x,rect.y,rect.w,rect.h) && (self.curGroupIndex !== i || self.curPointIndex != j)){
						self.curGroupIndex = i;
						self.curPointIndex = j;
						cb & cb(rect.groupIndex,rect.pointIndex)
					}
				}
			}

		},
		stockChange: function(groupIndex, stockIndex) {
			var self = this,
				currentStocks = self._stocks[groupIndex],
				e = {
					target: currentStocks['stocks'][stockIndex],
					currentTarget: currentStocks['stocks'][stockIndex],
					groupIndex: Math.round(groupIndex),
					stockIndex: Math.round(stockIndex)
				};
			self.fire("stockChange", e);
		},
		tipHandler: function(groupIndex, index) {
			var self = this,
				color = self.color.getColor(groupIndex)['DEFAULT'], //获取当前直线的填充色
				tip = self.tip,
				_cfg = self._cfg,
				tpl = _cfg.tip.template,
				$tip = tip.getInstance(),
				tipData,
				curPoint;

			if (!tpl) return;
			tipData = self._points[groupIndex][index].dataInfo;
			//支持方法渲染
			if (Util.isFunction(tpl)) {
				tip.setContent(tpl(tipData));
			} else {
				tip.renderTemplate(tpl, tipData);
			}

			curPoint = self._points[groupIndex][index];

			if (tip.isVisable()) {
				tip.animateTo(curPoint.x, curPoint.y);
			} else {
				tip.moveTo(curPoint.x, curPoint.y);
			}
			$tip.css(self.processAttr(_cfg.tip.css, color));
		},
		paperLeave: function() {
			var self = this;
			self.fire("paperLeave", self);
		},
		afterRender: function() {
			var self = this;
			self.fire("afterRender", self);
		},
		/*
			TODO get htmlpaper
			@return {object} HtmlPaper
		*/
		getHtmlPaper: function() {
			return this.htmlPaper;
		},
		/*
			TODO get raphael paper
			@return {object} Raphael
		*/
		getRaphaelPaper: function() {
			return this.paper;
		},
		//清空画布上的内容
		clear: function() {
			this._$ctnNode.html("");
		}
	}

	return BaseChart.extend(methods);
});