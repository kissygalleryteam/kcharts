/**
 * @fileOverview KChart 1.3  linechart
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
		evtLayoutAreasCls = evtLayoutCls + "-areas",
		evtLayoutRectsCls = evtLayoutCls + "-rects",
		COLOR_TPL = "{COLOR}",
		//点的类型集合
		POINTS_TYPE = ["circle", "triangle", "rhomb", "square"];
	var methods = {
		initializer: function() {
			this.init();
		},
		init: function() {
			var self = this,
				points;
			self.chartType = "linechart";
			var defaultCfg = Util.clone(Cfg);
			// KISSY > 1.4 逻辑
			self._cfg = Util.mix(defaultCfg, self.userConfig,undefined,undefined,true);
			BaseChart.prototype.init.call(self, self._cfg);
			self._cfg.autoRender && self.render();
		},
		/**
			渲染
		**/
		render: function() {
			var self = this,
				w,
				_cfg = self._cfg,
				themeCls = _cfg.themeCls,
				color;

			if (!self._$ctnNode[0]) return;

			BaseChart.prototype.dataFormat.call(self, self._cfg);

			self._lines = {};
			//事件代理层清空
			self._evtEls = {};
			//统计渲染完成的数组
			self._finished = [];
			//hover 点
			self._hoverstocks = {};
			//主题
			themeCls = self._cfg.themeCls || Cfg.themeCls;

			self._cfg = Util.mix(Util.clone(Util.mix(Cfg, Theme[themeCls], undefined, undefined, true)), self._cfg, undefined, undefined, true);

			color = self.color = new ColorLib({
				themeCls: themeCls
			});

			if (self._cfg.colors.length > 0) {
				color.removeAllColors();
			}

			for (var i in self._cfg.colors) {
				color.setColor(self._cfg.colors[i]);
			}
			//克隆详细配置 line points
			self.__cfg = self.cloneSeriesConfig(['line', 'points']);

			points = self._points[0];

			w = Math.round((points && points[0] && points[1] && points[1].x - points[0].x) || self.getInnerContainer().width)

			w && self.set("area-width", w);
			//渲染前事件
			self.beforeRender();
			//清空所有节点
			self._$ctnNode.html("");
			//获取矢量画布
			self.paper = Raphael(self._$ctnNode[0], _cfg.width||self._$ctnNode.width(), _cfg.height||self._$ctnNode.height());
			//渲染html画布
			self.htmlPaper = new HtmlPaper(self._$ctnNode, {
				clsName: themeCls
			});

			BaseChart.Common.drawTitle.call(null, this, themeCls);

			BaseChart.Common.drawSubTitle.call(null, this, themeCls);
			//渲染tip
			self.renderTip();
			//画x轴上的平行线
			BaseChart.Common.drawGridsX.call(null, this);

			BaseChart.Common.drawGridsY.call(null, this);

			self.drawPointLine();
			//画横轴
			BaseChart.Common.drawAxisX.call(null, this);

			BaseChart.Common.drawAxisY.call(null, this);
			//画横轴刻度
			BaseChart.Common.drawLabelsX.call(null, this);

			BaseChart.Common.drawLabelsY.call(null, this);
			//画折线
			self.drawLines(function() {
				self.__drawHoverStocks();
				//事件层
				self.renderEvtLayout();

				self.bindEvt();

				self.renderLegend();

				self.afterRender();
			});

		},
		//获取属性
		cloneSeriesConfig: function(wl) {
			var self = this,
				cfgs = {},
				cfg;
			var cloneCfg = Util.clone(self._cfg);
			if (!wl) return;
			for (var i in wl) {
				for (var j in self._cfg.series) {
					cfg = self._cfg.series[j][wl[i]] ? Util.mix(cloneCfg[wl[i]], self._cfg.series[j][wl[i]], undefined, undefined, true) : self._cfg[wl[i]];
					if (cfg) {
						if (!cfgs[wl[i]]) {
							cfgs[wl[i]] = [];
						}
						cfgs[wl[i]][j] = cfg;
					}
				}
			}
			return cfgs;
		},
		//画线
		drawLine: function(lineIndex) {
			var self = this,
				points = self._points[lineIndex];

			if (points && points.length) {
				self.drawArea(lineIndex);
				var path = BaseChart.Common.getLinePath.call(null, self, points),
					paper = self.paper,
					color = self.color.getColor(lineIndex).DEFAULT,
					//获取线配置
					lineAttr = self.__cfg['line'][lineIndex]['attr'],
					line = paper.path(path).attr(lineAttr).attr({
						"stroke": color
					});

				self._stocks[lineIndex]['stocks'] = self.drawStocks(lineIndex, self.processAttr(self._cfg.points.attr, color));
				//finish state
				self._finished.push(true);

				return line;
			}
		},
		drawArea: function(lineIndex) {
			//不显示
			if (!this._cfg.areas.isShow) return;
			var self = this,
				points = self._points[lineIndex];
			if (points && points.length) {
				var path = self.getAreaPath(points),
					paper = self.paper,
					color = self.color.getColor(lineIndex).DEFAULT,
					//获取线配置
					attr = self._cfg['areas']['attr'];
				self._areas[lineIndex] = {
					0: paper.path(path).attr(self.processAttr(attr, color)),
					attr: attr,
					path: path
				};
			}
		},
		//获取块区域的路径
		getAreaPath: function(points) {
			var self = this;
			var linepath = BaseChart.Common.getLinePath.call(null, self, points);
			var ctn = self.getInnerContainer();
			var box = Raphael.pathBBox(linepath);
			var path = [linepath, " L", box.x2, ",", ctn.br.y, " ", box.x, ",", ctn.bl.y, " z"].join("");
			return path;
		},
		//获取第一个不为空数据的索引
		getFirstUnEmptyPointIndex: function(lineIndex) {
			var self = this,
				points = self._points[lineIndex];
			for (var i in points) {
				if (!self.isEmptyPoint(points[i])) return i;
			}
			return;
		},
		//曲线动画
		animateLine: function(lineIndex, cb) {
			var self = this;
			var	sub_path,
				idx = 0,
				from = 0,
				tmpStocks = [],
				to, box,
				first_index;
			var	_cfg = self._cfg,
				color = self.color,
				paper = self.paper,
				points = self._points[lineIndex];
			var path = BaseChart.Common.getLinePath.call(null, self, points),
				totalLen = Raphael.getTotalLength(path),
				duration = _cfg.anim ? _cfg.anim.duration || 500 : 500,
				easing = "easeNone",
				areaWidth = self.get("area-width"),
				lineAttr = self.__cfg['line'][lineIndex]['attr'];
			var $line = paper.path(sub_path).attr(lineAttr).attr({
				"stroke": color.getColor(lineIndex).DEFAULT
			});
			for (var i in self._points[lineIndex]) {
				tmpStocks[i] = "";
			}
			first_index = self.getFirstUnEmptyPointIndex(lineIndex);
			tmpStocks[first_index] = self.drawStock(lineIndex, first_index);
			//动画
			var anim = new Anim({}, {}, {
				duration: duration,
				easing: easing,
				frame: function() {
					//arguments[1] 代表经过缓动函数处理后的0到1之间的数值
					to = arguments[1] * totalLen;
					//获取子路径
					sub_path = Raphael.getSubpath(path, from, to);
					//获取路径所占的矩形区域
					box = Raphael.pathBBox(sub_path);
					//当前渲染点的索引
					idx = Math.floor((box.width * 1.01) / areaWidth) - (-first_index);
					if (!tmpStocks[idx] && points[idx]) {
						tmpStocks[idx] = self.drawStock(lineIndex, idx);
					}
					for (var i in points)
						if (i < idx && !tmpStocks[i]) {
							tmpStocks[i] = self.drawStock(lineIndex, i);
						}
					$line && $line.attr({
						path: sub_path
					});
				},
				endframe: function() {
					self._stocks[lineIndex]['stocks'] = tmpStocks;
					self._finished.push(true);
					if (self._finished.length == _cfg.series.length && cb) {
						cb();
					}
					self.__drawHoverStocks(lineIndex);
				}
			});
			return $line;
		},
		//绘制hover上去的 点（stock） 替身
		__drawHoverStocks:function(){
			var self = this;
			for(var i in self._stocks){
				self.removeHoverStock(i);
				self._hoverstocks[i] = self.drawStock(i,self.getFirstUnEmptyPointIndex(i),{x:0,y:0}).attr(self._stocks[i]['hoverAttr']).hide();
			}
		},
		removeHoverStock:function(lineIndex){
			var self = this;
			self._hoverstocks[lineIndex] && self._hoverstocks[lineIndex].remove && self._hoverstocks[lineIndex].remove();
			delete self._hoverstocks[lineIndex];
		},
		//画线
		drawLines: function(cb) {
			var self = this,
				_cfg = self._cfg,
				len = POINTS_TYPE.length;

			self._lines = {};
			self._stocks = {};

			for (var i in self._points) {
				var path = BaseChart.Common.getLinePath.call(null, self, self._points[i]),
					curColor = self.color.getColor(i),
					pointsAttr = self.processAttr(self._cfg.points.attr, curColor.DEFAULT),
					hoverAttr = self.processAttr(self._cfg.points.hoverAttr, curColor.HOVER),
					line;

				//保存点的信息
				self._stocks[i] = {
					points: self._points[i],
					color: curColor,
					attr: pointsAttr,
					hoverAttr: hoverAttr,
					type: pointsAttr.type == "auto" ? POINTS_TYPE[i % len] : pointsAttr.type
				};

				line = _cfg.anim ? self.animateLine(i, cb) : self.drawLine(i);

				self._lines[i] = {
					line: line,
					path: path,
					points: self._points[i],
					color: curColor,
					attr: Util.mix({
						stroke: curColor.DEFAULT
					}, self._cfg.line.attr),
					isShow: true
				};

				if (self._finished.length == _cfg.series.length) {
					cb && cb();
				}

			}
			return self._lines;
		},
		//处理颜色模版
		processAttr: function(attrs, color) {
			var newAttrs = Util.clone(attrs);
			for (var i in newAttrs) {
				if (newAttrs[i] && typeof newAttrs[i] == "string") {
					newAttrs[i] = newAttrs[i].replace(COLOR_TPL, color);
				}
			}
			return newAttrs;
		},
		//画圆点
		drawStocks: function(lineIndex, attr) {
			// if (!this._cfg.points.isShow) return;
			var self = this,
				stocks = [];
			for (var i in self._points[lineIndex]) {
				stocks.push(self.drawStock(lineIndex, i));
			}
			return stocks;
		},
		//画单个圆点
		drawStock: function(lineIndex, stockIndex,attrs) {
			if (!this._cfg.points.isShow && attrs === undefined) return;
			var self = this,
				cfg = self._cfg,
				paper = self.paper,
				color = self.color,
				stroke = color.getColor(lineIndex).DEFAULT,
				attr = self.processAttr(cfg.points.attr, stroke),
				type = self._stocks[lineIndex]['type'],
				point = self._points[lineIndex][stockIndex],
				template = cfg.points.template,
				attrs = attrs || {},
				x = attrs.x !== undefined ? attrs.x : point.x,
				y = attrs.y !== undefined ? attrs.y : point.y,
				r = attr['r'],
				$stock;

			if (x !== undefined && y !== undefined) {
				if (Util.isFunction(template)) {
					return template({
						paper: paper,
						lineIndex: lineIndex,
						stockIndex: stockIndex,
						attr: attr,
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
						$stock = graphTool.rhomb(paper, x, y, r * 2.4, r * 2.4, 45);
						break;
					default:
						$stock = paper.circle(x, y, r, attr);
						break;
				}
				$stock.attr(attr).attr({cx:x,cy:y});
				return $stock;
			}
			return;
		},
		//参照线
		drawPointLine: function() {
			if (!this._cfg.comparable) return;
			var self = this,
				paper = self.htmlPaper,
				cls = self._cfg.themeCls + "-pointline",
				ctn = self._innerContainer;
			self._pointline = paper.lineY(0, ctn.tl.y, ctn.height).addClass(cls).css(self._cfg.pointLine.css).css({
				"display": "none"
			});
			return self._pointline;
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
				}, undefined, undefined, true);
			self.tip = new Tip(tipCfg);
			return self.tip;
		},
		//渲染事件层
		renderEvtLayout: function() {
			var self = this,
				x,
				ctn = self._innerContainer,
				y = ctn.tl.y,
				points = self._points[0],
				w = (points && points[0] && points[1] && points[1].x - points[0].x) || ctn.width,
				h = ctn.height,
				areas = self._evtEls._areas = [],
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

			for (var i = 0, len = points.length; i < len; i++) {
				areas[i] = {
					x: points[i].x - w / 2,
					y: ctn.tl.y,
					width: w,
					height: h
				};
			}
			for (var i in self._stocks) {
				var stocks = self._stocks[i],
					tmp = [],
					points = stocks['points'];
				// if (stocks['stocks']) {
				for (var j in points) {
					tmp[j] = {
						x: points[j].x - w / 2,
						y: points[j].y - 5,
						width: w,
						height: 10
					};
				}
				rects[i] = tmp;
				// }
			}
		},
		//清除事件层
		clearEvtLayout: function() {
			var self = this;
			if (self._evtEls._areas && self._evtEls._areas.length) {
				self._evtEls._areas = [];
			}
			if (self._evtEls._rects && self._evtEls._rects.length) {
				self._evtEls._rects = [];
			}
		},
		renderLegend: function() {
			if (!this._cfg.legend.isShow) return;
			var self = this,
				legendCfg = self._cfg.legend,
				container = (legendCfg.container && $(legendCfg.container)[0]) ? $(legendCfg.container) : self._$ctnNode;

			var stocks = self._stocks;

			var innerContainer = self._innerContainer;
			var colors = self.color._colors, //legend icon 的颜色表，循环
				len = colors.length,
				cfg = self._cfg,
				series = self._cfg.series
			var __legendCfg = Util.map(series, function(serie, i) {
				i = i % len;
				var item = {},
					color = colors[i]
					item.text = serie.text;
				item.DEFAULT = color.DEFAULT;
				item.HOVER = color.HOVER;
				var type = stocks[i].type;
				item.icontype = "line" + type;
				item.iconsize = [1, 1];
				return item;
			});

			var globalConfig = Util.merge({
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
		bindEvt: function() {
			var self = this,
				_cfg = self._cfg,
				evtEls = self._evtEls,
				//当前选中的直线 返回索引或undefined
				curStockIndex = self.curStockIndex = (function() {
					for (var i in self._stocks) {
						if (self._stocks[i]['stocks']) {
							return i;
						}
					}
				})();
			self.curLineIndex = self.getFirstVisibleLineIndex();
			Evt.detach(evtEls.paper.$paper, "mouseleave");
			// 绑定画布mouseleave事件
			Evt.on(evtEls.paper.$paper, "mouseleave", function(e) {
				self._lines[0]['line'].attr(self._lines[0]['attr']);
				self.tip && self.tip.hide();
				self._pointline && self._pointline.hide();
				for(var i in self._hoverstocks){
					self._hoverstocks[i].hide();
				}
				self.curStockIndex = undefined;
				self.paperLeave();
			});
			Evt.detach(evtEls.paper.$paper, "mousemove");
			// 绑定mousemove事件
			Evt.on(evtEls.paper.$paper, "mousemove", function(e) {
				//fix firefox offset bug
				e = self.getOffset(e);
				//mousemove代理
				self.delegateMouseMove(e);
			});

			Evt.detach(evtEls.paper.$paper, "click");
			// 绑定mousemove事件
			Evt.on(evtEls.paper.$paper, "click", function(e) {
				//fix firefox offset bug
				e = self.getOffset(e);
				//mousemove代理
				self.delegateClick(e);
			});
		},
		//mouseclick代理
		delegateClick: function(e) {
			var self = this,
				ctn = self.getInnerContainer();

			for (var i in self._evtEls._rects) {
				for (var j in self._evtEls._rects[i]) {
					var rect = self._evtEls._rects[i][j];
					if (self.isInSide(e.offsetX + ctn.x, e.offsetY + ctn.y, rect['x'], rect['y'], rect['width'], rect['height'])) {
						self.stockClick(i, j);
						return;
					}
				}
			}
		},
		//mousemove代理
		delegateMouseMove: function(e) {
			var self = this,
				ctn = self.getInnerContainer(),
				curStockIndex = self.curStockIndex;
			for (var i in self._evtEls._areas) {
				var area = self._evtEls._areas[i];
				if (self.isInSide(e.offsetX + ctn.x, e.offsetY + ctn.y, area['x'], area['y'], area['width'], area['height'])) {
					if (curStockIndex === undefined || curStockIndex != i) {
						self.curStockIndex = i;
						self.tipHandler(self.curLineIndex, self.curStockIndex);
						return;
					}
				}
			}
			for (var i in self._evtEls._rects) {
				for (var j in self._evtEls._rects[i]) {
					var rect = self._evtEls._rects[i][j];
					if (self.isInSide(e.offsetX + ctn.x, e.offsetY + ctn.y, rect['x'], rect['y'], rect['width'], rect['height'])) {
						if (self.curLineIndex === i) return;
						self.lineChangeTo(i);
						self.tipHandler(self.curLineIndex, self.curStockIndex);
						return;
					}
				}
			}
		},
		/**
			TODO 线条切换
		**/
		lineChangeTo: function(lineIndex) {
			var self = this,
				_cfg = self._cfg,
				hoverLineAttr = self.__cfg['line'][lineIndex]['hoverAttr'];
			if (self._isAnimating || !self._lines[lineIndex]['isShow']) return;
			for (var i in self._stocks) {
				self._stocks[i]['points'] = self._points[i];
			}
			for (var i in self._lines)
				if (i != lineIndex) {
					self._lines[i]['line'] && self._lines[i]['line'].attr(self.__cfg['line'][i]['attr']);
				}
			self.removeLine(lineIndex);
			self._lines[lineIndex]['line'] = self.drawLine(lineIndex).attr(hoverLineAttr);
			self.__drawHoverStocks();
			self.curLineIndex = lineIndex;
		},
		tipHandler: function(lineIndex, stockIndex) {
			var self = this;
			if (lineIndex === undefined || stockIndex === undefined) return;
			var tip = self.tip,
				_cfg = self._cfg,
				series = _cfg.series,
				tpl = _cfg.tip.template,
				currentPoints = self._points[lineIndex],
				currentStocks = self._stocks[lineIndex],
				curPoint = currentPoints[stockIndex],
				color = self._lines[lineIndex]['color']['DEFAULT'], //获取当前直线的填充色
				tipData;
			if (!tpl || !_cfg.tip.isShow || self.curStockIndex === undefined) return;
			// 如果tip需要展示多组数据 则存放数组
			if (self._cfg.comparable) {
				var tipAllDatas = {datas: {}};
				var tmpArray = [];
				for (var i in self._points)
					if (self._stocks[i]['stocks']) {
						if (self._points[i][stockIndex].dataInfo) {
							self._points[i][stockIndex].dataInfo.color = self._stocks[i]['color']['DEFAULT']
							var tmp = Util.merge(self._points[i][stockIndex].dataInfo, series[i]);
							delete tmp.data;
							tipAllDatas.datas[i] = tmp;
						}
					}
				for (var i in tipAllDatas.datas) {
					tmpArray.push(tipAllDatas.datas[i]);
				}
				tipAllDatas.datas = BaseChart.prototype.arraySort(tmpArray, true, "y");
				tipData = tipAllDatas;
			} else {
				tipData = Util.merge(self._points[lineIndex][stockIndex].dataInfo, series[lineIndex]);
				delete tipData['data'];
			}
			self.stockChange(lineIndex,stockIndex);
			if (!self.isEmptyPoint(currentPoints[stockIndex])) {
				tipData['lineindex'] = lineIndex;
				tipData['pointindex'] = stockIndex;
				tip.fire("setcontent", {data: tipData});
				tip.fire("move", {
					x: curPoint.x,
					y: curPoint.y,
					style: self.processAttr(_cfg.tip.css, color)
				});
			}
		},
		stockChange: function(lineIndex, stockIndex) {
			var self = this,
				currentPoints = self._points[lineIndex],
				currentStocks = self._stocks[lineIndex],
				tgt = currentStocks['stocks'] && currentStocks['stocks'][stockIndex];

			if (currentPoints && !self.isEmptyPoint(currentPoints[stockIndex]) && self._lines[lineIndex]['isShow']) {
					self._pointline && self._pointline.css({"left": self._pointsX[stockIndex]['x']}).show();
				if (self._cfg.comparable) {
					for (var i in self._hoverstocks) {
						var point = self._points[i][stockIndex];
						self._lines[i]['isShow'] && self._hoverstocks[i].transform(["T",point.x ,",",point.y ].join("")).show();
					}
				} else {
					var point = currentPoints[stockIndex];
					self._lines[lineIndex]['isShow'] && self._hoverstocks[lineIndex].transform(["T",point.x ,",",point.y ].join("")).show();
				}
			} else {
				var index = self.getFirstNotEmptyPointsLineIndex(stockIndex);
				if (index) {
					self.lineChangeTo(index);
				}
			}
			if (self._points[lineIndex][stockIndex].dataInfo && self._lines[lineIndex]['isShow']) {
				var e = Util.mix({
					target: tgt,
					currentTarget: tgt,
					lineIndex: Math.round(lineIndex),
					stockIndex: Math.round(stockIndex)
				}, currentStocks['points'][stockIndex]);
				self.fire("stockChange", e);
			}
		},
		/**
			TODO 获取当前index的point不为空的lineIndex
			@return lineIndex
		**/
		getFirstNotEmptyPointsLineIndex: function(pointIndex) {
			var self = this;
			for (var i in self._points) {
				if (!self.isEmptyPoint(self._points[i][pointIndex]) && self._lines[i]['isShow']) {
					return i + "";
				}
			}
			return "";
		},
		/**
			TODO 判断可见直线的index
		**/
		getFirstVisibleLineIndex: function() {
			var self = this;
			for (var i in self._lines) {
				if (self._lines[i]['isShow']) {
					return i;
				}
			}
		},
		/**
			TODO 判断是否为空数据点
		**/
		isEmptyPoint: function(point) {
			if (point && point['dataInfo']) {
				return false;
			} else {
				return true;
			}
		},
		removeArea: function(lineIndex) {
			if (this._areas && this._areas[lineIndex]) {
				this._areas[lineIndex].remove && this._areas[lineIndex].remove();
				delete this._areas[lineIndex];
			}
		},
		removeStock: function(lineIndex) {
			var self = this;
			for (var j in self._stocks[lineIndex]['stocks']) {
				self._stocks[lineIndex]['stocks'][j] && self._stocks[lineIndex]['stocks'][j].remove();
			}
			delete self._stocks[lineIndex]['stocks'];
		},
		//line area transform anim
		transformLine: function(lineIndex) {
			var self = this;
			var duration = 500;
			var newPath = BaseChart.Common.getLinePath.call(null, self, self._points[lineIndex]);
			var oldPath = self._lines[lineIndex]['path'];
			//防止不必要的动画
			if (oldPath != newPath && newPath != "") {
				// 动画状态
				self._isAnimating = true;
				//区域动画
				self.__transformArea(lineIndex,duration);
				//点动画
				self.__transformStock(lineIndex,duration);
				//线动画
				self.__transformLine(lineIndex,{path: newPath},duration,function(){
					self._isAnimating = false;
				});
			}
		},
		__transformArea:function(lineIndex,duration,cb){
			var self = this;
			var area = self._areas[lineIndex];
			var path = self.getAreaPath(self._points[lineIndex]);
			if(area){
				area[0] && area[0].stop() && area[0].animate({path:path}, duration, cb);
				area['path'] = path;
			}
		},
		__transformLine:function(lineIndex,attrs,duration,cb){
			var self = this;
			var line = self._lines[lineIndex];
			line['line'] && line['line'].stop() && line['line'].animate(attrs, duration, cb);
			line['path'] = attrs['path'];
		},
		__transformStock:function(lineIndex,duration){
			var self = this;
			var stocks = self._stocks[lineIndex];
			var stock;
			for (var j in stocks['stocks']) {
					if (stocks['stocks'][j]) {
						stock = stocks['stocks'][j];
						//transform进行动画需要计算动画开始和结束的偏移量
						stock.stop().animate({
							transform: "T" + (stocks['points'][j]['x'] - stocks['stocks'][j].attr("cx")) + 
							           "," + (stocks['points'][j]['y'] - stocks['stocks'][j].attr("cy"))
						}, duration)
					}
				}
		},
		/*
			TODO 移除直线及直线上的点和对应的区域
		*/
		removeLine: function(lineIndex) {
			var self = this;
			self._lines[lineIndex]['line'].remove();
			self._areas[lineIndex] && self._areas[lineIndex][0] && self._areas[lineIndex][0].remove && self._areas[lineIndex][0].remove();
			for (var i in self._stocks) {
				if (lineIndex == i) {
					self.removeStock(lineIndex);
					self.removeArea(lineIndex);
					self.removeHoverStock(lineIndex);
				}
				self._stocks[i]['points'] = self._points[i];
			}
		},
		/**
			TODO 隐藏单条直线
		**/
		hideLine: function(lineIndex) {
			var self = this,
				stock;
			if (!self._lines[lineIndex]['isShow']) return;
			self._lines[lineIndex]['isShow'] = false;
			if (lineIndex == self.curLineIndex) {
				self.curLineIndex = self.getFirstVisibleLineIndex();
			}
			//删除某条线的数据
			BaseChart.prototype.removeData.call(self, lineIndex);
			BaseChart.Common.animateGridsAndLabels.call(null, self);
			self.removeLine(lineIndex);
			for (var i in self._lines) {
				if (i != lineIndex) {
					self.transformLine(i);
				}
			}
			self.clearEvtLayout();
			self.renderEvtLayout();
			self.bindEvt();
		},
		/**
			TODO 显示单条直线
		**/
		showLine: function(lineIndex) {
			var self = this,
				duration = 500,
				stock;
			if (self._lines[lineIndex]['isShow']) return;
			self._lines[lineIndex]['isShow'] = true;
			self._cfg.series[lineIndex]['isShow'] = true;
			BaseChart.prototype.recoveryData.call(self, lineIndex);
			BaseChart.Common.animateGridsAndLabels.call(null, self);
			self._lines[lineIndex]['line'] = self.drawLine(lineIndex);
			self.__drawHoverStocks();
			for (var i in self._stocks) {
				self._stocks[i]['points'] = self._points[i];
			}
			for (var i in self._lines) {
				self.transformLine(i);
			}
			self.clearEvtLayout();
			self.renderEvtLayout();
			self.bindEvt();
		},
		paperLeave: function() {
			var self = this;
			self.fire("paperLeave", self);
		},
		stockClick: function(lineIndex, stockIndex) {
			var self = this,
				currentStocks = self._stocks[lineIndex],
				tgt = currentStocks['stocks'] && currentStocks['stocks'][stockIndex];
			var e = Util.mix({
				target: tgt,
				currentTarget: tgt,
				lineIndex: Math.round(lineIndex),
				stockIndex: Math.round(stockIndex)
			}, currentStocks['points'][stockIndex]);
			self.fire("stockClick", e);
		},
		beforeRender: function() {
			var self = this;
			self.fire("beforeRender", self);
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
		/*
			TODO clear all nodes
		*/
		clear: function() {
			this._$ctnNode.html("");
		}
	};

	return BaseChart.extend(methods);
});