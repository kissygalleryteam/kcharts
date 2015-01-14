define('kg/kcharts/5.0.1/basechart/index',["util","node","base","dom","./common"],function(require, exports, module) {

	var Util = require("util"),
		Node = require("node"),
		Base = require("base"),
		DOM = require("dom"),
		Common = require("./common");

	var $ = Node.all;

	var methods = {
		init: function(cfg) {
			cfg || (cfg = this.userConfig);
			var self = this,
				_cfg = self._cfg;
			if (cfg && cfg.renderTo) {
				if (!self.__isInited) {
					_cfg = self._cfg = Util.mix({
						autoRender:true,
						zIndex: 0,
						yAxis: {
							spacing: {
								top: 0,
								bottom: 0
							}
						},
						xAxis: {
							spacing: {
								left: 0,
								right: 0
							}
						},
						canvasAttr: {
							x: 60,
							y: 60
						},
						zoomType: "x"
					}, cfg,undefined,undefined,true);
					
					self._$ctnNode = $(cfg.renderTo);

					self._$ctnNode.css({
						position:"relative",
						"-webkit-text-size-adjust": "none", 
						"-webkit-tap-highlight-color": "rgba(0,0,0,0)" 
					});
					
					self.createContainer();

					Util.mix(self, {
						_datas: {
							cur: {},
							total: {}
						},
						_points: {},
						_centerPoints: [],
						_pointsX: [],
						_pointsY: [],
						_gridsX: [],
						_gridsY: [],
						_areas: [],
						_axisX: null,
						_axisY: null,
						_labelX: [],
						_labelY: [],
						_evtEls: [],
						_gridPoints: [], 
						stackable: false
					});
					
					for (var i in Array.prototype) {
						delete Array.prototype[i];
					}
				}

				
				if (self.chartType == "barchart") {
					_cfg.xAxis.min = 0;
					_cfg.yAxis.min = 0;
				}
				
				self.__setData();

				self.__isInited = 1;
			}
		},
		__setData:function(){
			var self= this,
				series = self._cfg.series;
			if (!series || series.length <= 0 || !series[0].data) return;

				for (var i in series) {
					self._datas['total'][i] = {
						index: i,
						data: series[i].data
					};
					self._datas['cur'][i] = {
						index: i,
						data: series[i].data
					};
				}
		},
		
		dataFormat: function() {
			var self = this,
				_cfg = self._cfg,
				zoomType = _cfg.zoomType,
				isY = zoomType == "x" ? false : true,
				ictn = self._innerContainer,
				left = _cfg.xAxis.spacing ? self.px2num(_cfg.xAxis.spacing.left) : 0,
				right = _cfg.xAxis.spacing ? self.px2num(_cfg.xAxis.spacing.right) : 0,
				top = _cfg.yAxis.spacing ? self.px2num(_cfg.yAxis.spacing.top) : 0,
				bottom = _cfg.yAxis.spacing ? self.px2num(_cfg.yAxis.spacing.bottom) : 0,
				width = ictn.width - left - right,
				height = ictn.height - top - bottom,
				x = ictn.x / 1 + left,
				y = ictn.y / 1 + top,
				allDatas,
				allDatasX,
				coordNum,
				coordNumX,
				coordPos,
				coordPosX,
				curCoordNum;
			self._pointsY = [];
			self._pointsX = [];
			switch (zoomType) {
				case "x":
					
					allDatas = self.getAllDatas();
					
					curCoordNum = coordNum = self.coordNum = self._getScales(allDatas, _cfg.yAxis);
					
					coordPos = self.data2GrapicData(coordNum, false, true);
					break;
				case "y":
					allDatasX = self.getAllDatas();
					curCoordNum = coordNumX = self.coordNumX = self._getScales(allDatasX, _cfg.xAxis);
					coordPosX = self.data2GrapicData(coordNumX, true, false);
					break;
				case "xy":
					allDatas = self.getAllDatas(0);
					allDatasX = self.getAllDatas(1);
					curCoordNum = coordNum = self.coordNum = self._getScales(allDatas, _cfg.xAxis);
					coordNumX = self.coordNumX = self._getScales(allDatasX, _cfg.yAxis);
					coordPos = self.data2GrapicData(coordNum, false, false);
					coordPosX = self.data2GrapicData(coordNumX, true, true);
					break;
			}

			var getDataPoints = function(data, index, coordNum) {
				var series = _cfg.series[index],
					
					max = Math.max.apply(null, coordNum),
					min = Math.min.apply(null, coordNum),
					points = [],
					j = 0,
					dataType = self.getDataType();
				switch (zoomType) {
					case "x":
						for (var i in self._pointsX) {
							if (data[i] === '' || data[i] === null) {
								points[i] = {
									x: self._pointsX[i].x, 
									index: Math.round(i) 
								};
							} else {
								points[i] = {
									x: self._pointsX[i].x, 
									y: self.data2Grapic(data[i], max, min, height, y, true), 
									dataInfo: {
										y: data[i],
										x: _cfg.xAxis['text'][i]
									}, 
									index: Math.round(i) 
								};
							}

						}
						break;
					case "y":
						for (var i in self._pointsY) {
							points[i] = {
								x: self.data2Grapic(data[i], max, min, width, x), 
								y: self._pointsY[i].y, 
								dataInfo: {
									y: data[i],
									x: _cfg.yAxis['text'][i]
								}, 
								index: Math.round(i) 
							};
						}
						break;
					case "xy":
						var xs = self.data2GrapicData(self.getArrayByKey(series.data, 0)),
							ys = self.data2GrapicData(self.getArrayByKey(series.data, 1), true, true);
						for (var i in series.data) {
							points[i] = {
								x: xs[i], 
								y: ys[i], 
								dataInfo: {
									y: data[i]
								}, 
								index: Math.round(i) 
							};
						}
						break;
				}
				return points;
			};

			switch (zoomType) {
				case "x":
					for (var i in coordPos) {
						self._pointsY[i] = {
							number: coordNum[i] + "",
							y: coordPos[i],
							x: x
						};
					}
					try {
						self._gridPoints = self.getSplitPoints(x, y + height, x + width, y + height, _cfg.xAxis.text.length, true);
						self._pointsX = self.getCenterPoints(self._gridPoints);
						for (var i in _cfg.xAxis.text) {
							self._pointsX[i]['number'] = _cfg.xAxis.text[i];
						}
					} catch (e) {
						throw new Error("未配置正确的xAxis.text数组");
					}
					break;
				case "y":
					for (var i in coordPosX) {
						self._pointsX[i] = {
							number: coordNumX[i] + "",
							y: y + height,
							x: coordPosX[i]
						};
					}
					try {
						self._pointsY = self.getSplitPoints(x, y, x, y + height, _cfg.yAxis.text.length + 1);
						for (var i in _cfg.yAxis.text) {
							self._pointsY[i]['number'] = _cfg.yAxis.text[i];
						}
					} catch (e) {
						throw new Error("未配置正确的yAxis.text数组");
					}
					break;
				case "xy":
					for (var i in coordPosX) {
						self._pointsY[i] = {
							number: coordNumX[i] + "",
							y: coordPosX[i],
							x: x
						};
					}
					for (var i in coordPos) {
						self._pointsX[i] = {
							number: coordNum[i] + "",
							y: y + height,
							x: coordPos[i]
						};
					}
					break;
			}
			for (var i in self._datas['cur']) {
				self._points[i] = getDataPoints(self._datas['cur'][i]['data'], i, curCoordNum);
			}
		},
		
		removeData: function(index) {
			var self = this;
			delete self._datas['cur'][index];
			self.dataFormat();
		},
		
		recoveryData: function(index) {
			var self = this;
			self._datas['cur'][index] = self._datas['total'][index];
			self.dataFormat();
		},
		
		createContainer: function() {
			var self = this,
				_$ctnNode = self._$ctnNode,
				canvasAttr = self._cfg.canvasAttr,
				innerWidth = canvasAttr.width || (_$ctnNode.width() - 2 * canvasAttr.x),
				innerHeight = canvasAttr.height || (_$ctnNode.height() - 2 * canvasAttr.y),
				x = canvasAttr.x,
				y = canvasAttr.y,
				width = innerWidth,
				height = innerHeight,
				tl = {
					x: x,
					y: y
				},
				tr = {
					x: x + innerWidth,
					y: y
				},
				bl = {
					x: x,
					y: y + height
				},
				br = {
					x: x + innerWidth,
					y: y + height
				};
			
			self._innerContainer = {
				x: x,
				y: y,
				width: width,
				height: height,
				tl: tl,
				tr: tr,
				bl: bl,
				br: br
			};
		},
		
		getInnerContainer: function() {
			return this._innerContainer;
		},
		getAllDatas: function() {
			var self = this,
				_cfg = self._cfg,
				allDatas = [],
				zoomType = _cfg.zoomType,
				numbers,
				arg = arguments[0],
				dataType = self.getDataType();
			if (_cfg.stackable) {
				
				for (var i in self._datas['cur']) {
					if (Util.isArray(self._datas['cur'][i]['data'])) {
						numbers = self._datas['cur'][i]['data'];
					}
					for (var j in numbers) {
						
						allDatas[j] = allDatas[j] ? (numbers[j] - 0) + (allDatas[j] - 0) : numbers[j];
					}
				}
			} else {
				for (var i in self._datas['cur']) {
					if (Util.isArray(self._datas['cur'][i]['data'])) {
						if (zoomType == "xy") {
							numbers = self.getArrayByKey(self._datas['cur'][i]['data'], arg)
						} else {
							numbers = self._datas['cur'][i]['data'];
						}
					}
					allDatas.push(numbers.join(","));
				}
			}
			return allDatas.length ? allDatas.join(",").split(",") : [];
		},
		getDataType: function() {
			var self = this;
			if (!self._datas['total'][0] || !self._datas['total'][0]['data']) return;
			for (var i in self._datas['total'][0]['data']) {
				if (Util.isPlainObject(self._datas['total'][0]['data'][i])) {
					return "object";
				} else if (Util.isNumber(self._datas['total'][0]['data'][i] - 0)) {
					return "number";
				}
			}
		},
		
		_getScales: function(allDatas, axis) {
			var self = this;
			
			if (axis.text && Util.isArray(axis.text)) {
				return axis.text;
			} else {
				var cmax = axis.max / 1,
					cmin = axis.min / 1,
					num = axis.num || 5,
					_max = Math.max.apply(null, allDatas),
					_min = Math.min.apply(null, allDatas);
				
				self.isNagitive = _max < 0 ? 1 : 0;
				
				self.isPositive = _min > 0 ? 1 : 0;
				
				self.isZero = _max === _min && _max === 0;
				
				if(self.isZero){
					_max = 5;
					_min = -5;
				}

				
				var offset = (_max - _min) * 0.1;
				
				var max = (cmax || cmax == 0) ? (cmax >= _max ? cmax : _max + offset) : _max + offset;
				var min = (cmin || cmin == 0) ? (cmin <= _min ? cmin : _min - offset) : _min - offset;
				return self.getScales(max, min, num);
			}
		},
		
		data2GrapicData: function(data, isY, nagitive) {
			if (undefined === data) return;
			var self = this,
				ictn = self._innerContainer,
				margin = isY ? ictn.x : ictn.y,
				height = ictn.height,
				width = ictn.width,
				zoomType = self._cfg.zoomType,
				dist,
				
				max = isY ? Math.max.apply(null, self.coordNumX) : Math.max.apply(null, self.coordNum),
				min = isY ? Math.min.apply(null, self.coordNumX) : Math.min.apply(null, self.coordNum),
				tmp = [];

			switch (zoomType) {
				case "xy":
					dist = isY ? height : width;
					break;
				case "x":
					dist = height;
					break;
				case "y":
					dist = width;
					break;
			}
			
			if (Util.isArray(data)) {
				for (var i in data) {
					tmp.push(self.data2Grapic(data[i], max, min, dist, margin, nagitive));
				}
				return tmp;
			} else {
				return self.data2Grapic(data, max, min, dist, margin, nagitive);
			}
		},
		
		data2Grapic: function(data, max, min, dist, offset, nagitive) {
			
			if (max - min <= 0) return;
			if (nagitive) {
				return dist * (1 - (data - min) / (max - min)) + offset;
			} else {
				return dist * (data - min) / (max - min) + offset;
			}
		},
		
		getSplitPoints: function(sx, sy, ex, ey, num, e) {

			var ox = (ex - sx) / num,
				oy = (ey - sy) / num,
				array = [];

			e && array.push({
				x: sx,
				y: sy
			});

			for (var i = 0; i < num - 1; i++) {

				array.push({
					x: sx + (i + 1) * ox,
					y: sy + (i + 1) * oy
				});

			}

			e && array.push({
				x: ex,
				y: ey
			});
			return array;

		},
		
		getCenterPoints: function(p) {
			var self = this,
				ary = [],
				len = p.length;
			if (len > 1) {
				for (var i = 0; i < len - 1; i++) {
					ary[i] = {
						x: (p[i]['x'] + p[i + 1]['x']) / 2,
						y: (p[i]['y'] + p[i + 1]['y']) / 2
					};
				}
			}
			return ary;
		},
		
		getScales: function(cormax, cormin, cornum) {

			var self = this,
				corstep,
				tmpstep,
				tmpnum,
				tmp, 
				step,
				extranum,
				min,
				max,
				middle,
				log = Math.log,
				pow = Math.pow,
				ary = [],
				fixlen = 0;


			
			if(cormax === cormin && cormin > 0){
				cormin = 0;
				cormax = cormax * 2;
			}else if(cormax === cormin && cormin < 0){
				cormax = 0;
				cormin = cormin * 2;
			}

			
			corstep = (cormax - cormin) / cornum;

			tmp = Math.floor(log(corstep) / log(10)) + 1;

			tmpstep = corstep / pow(10, tmp);

			if (tmpstep > 0 && tmpstep <= 0.1) {

				tmpstep = 0.1;

			} else if (tmpstep > 0.1 && tmpstep <= 0.2) {

				tmpstep = 0.2;

			} else if (tmpstep > 0.2 && tmpstep <= 0.25) {

				tmpstep = 0.25;

			} else if (tmpstep > 0.25 && tmpstep <= 0.5) {

				tmpstep = 0.5;

			} else {

				tmpstep = 1;

			}

			step = tmpstep * pow(10, tmp);

			middle = (cormax + cormin) / 2 - ((cormax + cormin) / 2) % step;

			min = max = middle;

			while (min > cormin) {

				min -= step;

			}
			while (max < cormax) {

				max += step;

			}
			if (self.isFloat(step)) {
				var stepstr = (step + "");
				if (stepstr.indexOf(".") > -1) {
					fixlen = stepstr.split(".")[1]['length'] > 4 ? 4 : stepstr.split(".")[1]['length'];
				}
			}
			for (var i = min; i <= max; i += step) {
				ary.push(parseFloat(i).toFixed(fixlen));
			}
			
			if (self.isNagitive) {
				for (i in ary) {
					ary[i] > 0 && ary.splice(i, 1)
				}
			} else if (self.isPositive) {
				for (i in ary) {
					ary[i] < 0 && ary.splice(i, 1)
				}
			}

			return ary;
		},
		
		arraySort: function(array, sortDown, defineKey) {
			return array.sort(function(a, b) {
				if (!sortDown) {
					if (typeof a == "object" && typeof b == "object") {
						return a[defineKey] - b[defineKey];
					}
					return a - b;
				} else {
					if (typeof a == "object" && typeof b == "object") {
						return b[defineKey] - a[defineKey];
					}
					return b - a;
				}
			});
		},
		
		getArrayByKey: function(array, key) {
			var tmp = [];
			for (var i in array) {
				if (array[i][key] || Util.isNumber(array[i][key])) {
					tmp.push(array[i][key]);
				}
			}
			return tmp;
		},
		
		isFloat: function(num) {
			return /^([+-]?)\d*\.\d+$/.test(num);
		},
		
		obj2Array: function(obj, defineKey) {
			var a = [];
			for (var i in obj) {
				a.push(defineKey ? obj[defineKey] : obj[i]);
			}
			return a;
		},
		
		getObjKeys: function(obj) {
			var a = [];
			for (b in obj) {
				a.push(b);
			}
			return a;
		},
		isInSide: function(px, py, x, y, w, h) {
			if (px > x && px < x - (-w) && py > y && py < y - (-h)) {
				return true;
			}
			return false;
		},
		
		px2num: function(arg) {
			var arg = arg || 0;
			var num = Math.round((arg + "").replace(/\s+|px/g, ''));
			return Math.round((arg + "").replace(/\s+|px/g, ''));
		},
		getOffset: function(e) {
			
			var target = e.currentTarget 
			if (e.offsetX) {
				return {
					offsetX: e.offsetX,
					offsetY: e.offsetY
				}
			} else {
				var offset = DOM.offset(target);
				return {
					offsetX: (e.offsetX || e.clientX - offset.left),
					offsetY: (e.offsetY || e.clientY - offset.top)
				}
			}
		},
		getConfig:function(){
			return this._cfg;
		},
		setConfig:function(cfg){
			this._cfg = Util.mix(this._cfg,cfg,undefined,undefined,true);
			this.__setData();
		}
	};
	var BaseChart = Base.extend(methods);
	BaseChart.Common = Common;
	return BaseChart;
});