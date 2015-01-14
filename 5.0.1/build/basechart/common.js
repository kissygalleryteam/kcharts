define('kg/kcharts/5.0.1/basechart/common',["util","kg/kcharts/5.0.1/tools/template/index"],function(require, exports, module) {

	var Util = require("util"),
		Template = require("kg/kcharts/5.0.1/tools/template/index");

	function drawTitle(chart, themeCls) {
		if (!chart._cfg.title.isShow) return;
		var paper = chart.htmlPaper,
			cls = themeCls + "-title",
			_cfg = chart._cfg,
			ctn = chart.getInnerContainer(),
			
			h = ctn.y * 0.6;
		chart._title = paper.rect(ctn.x, 0, ctn.width, h).addClass(cls).css(Util.mix({
			"line-height": h + "px"
		}, _cfg.title.css)).html(_cfg.title.content);
	}

	function drawSubTitle(chart, themeCls) {
		if (!chart._cfg.subTitle.isShow) return;
		var paper = chart.htmlPaper,
			cls = themeCls + "-subtitle",
			_cfg = chart._cfg,
			ctn = chart.getInnerContainer(),
			
			h = ctn.y * 0.4;
		chart._subTitle = paper.rect(ctn.x, ctn.y * 0.6, ctn.width, h).addClass(cls).css(Util.mix({
			"line-height": h + "px"
		}, _cfg.subTitle.css)).html(_cfg.subTitle.content);
	}

	function drawAxisX(chart) {
		if (!chart._cfg.xAxis.isShow) return;
		var ctn = chart.getInnerContainer(),
			bl = ctn.bl,
			w = ctn.width,
			paper = chart.htmlPaper,
			cls = chart._cfg.themeCls + "-axisx";

		chart._axisX = paper.lineX(bl.x, bl.y, w).addClass(cls).css(chart._cfg.xAxis.css || {});

		return chart._axisX;
	}

	function drawAxisY(chart) {
		if (!chart._cfg.yAxis.isShow) return;
		var ctn = chart.getInnerContainer(),
			tl = ctn.tl,
			h = ctn.height,
			paper = chart.htmlPaper,
			cls = chart._cfg.themeCls + "-axisy";

		chart._axisY = paper.lineY(tl.x, tl.y, h).addClass(cls).css(chart._cfg.yAxis.css || {});
		return chart._axisY;
	}

	function drawGridsY(chart) {
		if (!chart._cfg.yGrids.isShow) return;
		var ctn = chart.getInnerContainer(),
			x = ctn.x,
			points = chart._pointsY;
		var tpl = chart._cfg.yGrids.template;
		for (var i = 0, len = points.length; i < len; i++) {
			chart._gridsY[i] = {
				0: drawGridY(chart, {
					x: x,
					y: points[i].y,
					index: i
				}),
				x: x,
				y: points[i].y,
				num: points[i]['number']
			};
		}
	}

	function drawGridsX(chart) {
		if (!chart._cfg.xGrids.isShow) return;
		var points = chart._points[0],
			ctn = chart.getInnerContainer(),
			gridPointsX;
		chart._gridsX = [];
		if (chart._cfg.zoomType == "x") {
			gridPointsX = function() {
				var len = points.length,
					tmp = [];
				if (len > 1) {
					var d = (points[1]['x'] - points[0]['x']) / 2;
					tmp.push({
						x: points[0]['x'] - d
					})
					for (var i in points) {
						tmp.push({
							x: points[i]['x'] - (-d)
						});
					}
				}
				return tmp;
			}();
			for (var i = 0, len = gridPointsX.length; i < len; i++) {
				chart._gridsX[i] = {
					0: drawGridX(chart, {
						index: i,
						x: gridPointsX[i].x
					}),
					x: gridPointsX[i]['x'],
					y: ctn.bl.y,
					index: i,
					num: chart.coordNum[i]
				};
			}
		} else {
			for (var i in chart._pointsX) {
				chart._gridsX[i] = {
					index: i,
					0: drawGridX(chart, {
						index: i,
						x: chart._pointsX[i].x
					}),
					x: chart._pointsX[i]['x'],
					y: ctn.bl.y,
					num: chart.coordNumX[i]
				};
			}
		}

		return chart._gridsX;
	}

	function drawGridX(chart, point, css) {
		if (!chart._cfg.xGrids.isShow) return;
		var ctn = chart.getInnerContainer(),
			css = css || chart._cfg.xGrids.css,
			paper = chart.htmlPaper,
			cls = chart._cfg.themeCls + "-gridsx";
		var tpl = chart._cfg.xGrids.template;
		var params = {
			index: point.index,
			paper: paper,
			x: point.x,
			y: ctn.tl.y,
			height: ctn.height,
			css: css,
			className: cls,
			chart: chart
		};
		if (!tpl) {
			return paper.lineY(point.x, ctn.tl.y, ctn.height).addClass(cls).css(css);
		}
		if (Util.isFunction(tpl)) {
			return tpl(params);
		} else {
			return Template(tpl).render({
				data: params
			});
		}
	}

	function drawGridY(chart, point, css) {
		if (!chart._cfg.yGrids.isShow) return;
		var ctn = chart.getInnerContainer(),
			css = css || chart._cfg.yGrids.css,
			paper = chart.htmlPaper,
			cls = chart._cfg.themeCls + "-gridsy";
		var tpl = chart._cfg.yGrids.template;
		var params = {
			index: point.index,
			paper: paper,
			x: ctn.x,
			y: point.y,
			width: ctn.width,
			css: css,
			className: cls,
			chart: chart
		};
		if (!tpl) {
			return paper.lineX(ctn.x, point.y, ctn.width).addClass(cls).css(css);
		}
		if (Util.isFunction(tpl)) {
			return tpl(params);
		} else {
			return Template(tpl).render({
				data: params
			});
		}
	}

	function drawLabelsY(chart) {
		if (!chart._cfg.yLabels.isShow) return;
		var ctn = chart.getInnerContainer();
		for (var i in chart._pointsY) {
			chart._labelY[i] = {
				0: drawLabelY(chart, i, chart._pointsY[i].number),
				'num': chart._pointsY[i].number,
				x: ctn.x,
				y: chart._pointsY[i]['y']
			}
		}
		return chart._labelY;
	}

	function drawLabelsX(chart) {
		if (!chart._cfg.xLabels.isShow) return;
		
		for (var i in chart._pointsX) {
			chart._labelX[i] = {
				0: drawLabelX(chart, i, chart._pointsX[i].number),
				'num': chart._pointsX[i].number,
				x: chart._pointsX[i]['x'],
				y: chart._pointsX[i]['y']
			};
		}
	}
	
	function drawLabelX(chart, index, text) {
		if (!chart._cfg.xLabels.isShow) return;
		var paper = chart.htmlPaper,
			len = chart._pointsX.length || 0,
			lbl,
			cls = chart._cfg.themeCls + "-xlabels",
			tpl = "{{data}}",
			content = "";
		if (index < len) {
			tpl = chart._cfg.xLabels.template || tpl;
			if (Util.isFunction(tpl)) {
				content = tpl(index, text);
			} else {
				content = Template(tpl).render({
					data: text
				});
			}
			if (content) {
				lbl = paper.text(chart._pointsX[index].x, chart._pointsX[index].y, '<span class=' + cls + '>' + content + '</span>', "center");
				lbl.children().css(chart._cfg.xLabels.css)
			}
			return lbl;
		}
	}
	
	function drawLabelY(chart, index, text) {
		if (!chart._cfg.yLabels.isShow || !text) return;
		var paper = chart.htmlPaper,
			cls = chart._cfg.themeCls + "-ylabels",
			tpl = "{{data}}",
			content = "",
			lbl;
		tpl = chart._cfg.yLabels.template || tpl;
		if (Util.isFunction(tpl)) {
			content = tpl(index, text);
		} else {
			content = Template(tpl).render({
				data: text
			});
		}
		if (content) {
			lbl = paper.text(chart._pointsY[index].x, chart._pointsY[index].y, '<span class=' + cls + '>' + content + '</span>', "right", "middle");
			lbl.children().css(chart._cfg.yLabels.css);
		}
		return lbl;
	}
	
	function animateGridsAndLabels(chart) {
		var cfg = chart._cfg,
			zoomType = cfg.zoomType,
			pointsY = chart._pointsY,
			pointsX = chart._pointsX,
			ctn = chart.getInnerContainer(),
			duration = 0.5,
			easing = "easeout",
			
			animatedCoordsY = [],
			animatedCoordsX = [],
			destroyedNodesY = [],
			destroyedNodesX = [],
			
			coordsY = [],
			coordsX = [];
		
		var getPointByNum = function(num, points, animatedCoords) {
			for (var i in points) {
				if (num === points[i]['number']) {
					animatedCoords.push(num);
					return points[i];
				}
			}
		}
		
		var judgeDirect2Move = function(point) {
			if (!point) return;
			var spacing = Math.min.apply(null, [cfg.canvasAttr.x, cfg.canvasAttr.y]) / 2;
			
			var middle = ctn.y + ctn.height / 2;
			
			var center = ctn.x + ctn.width / 2;
			
			switch (zoomType) {
				case "x":
					return {
						y: point.y > middle ? ctn.bl.y + spacing : ctn.y - spacing,
						x: point.x
					};
					break;
				case "y":
					return {
						x: point.x > center ? ctn.br.x + spacing : ctn.x - spacing,
						y: point.y
					};
					break;
				case "xy":
					return {
						y: point.y > middle ? ctn.bl.y + spacing : ctn.y - spacing,
						x: point.x > center ? ctn.br.x + spacing : ctn.x - spacing
					};
					break;
			}
		}

		switch (zoomType) {
			case "x":
				anim("Y", coordsY, pointsY, destroyedNodesY, animatedCoordsY);
				break;
			case "y":
				anim("X", coordsX, pointsX, destroyedNodesX, animatedCoordsX);
				break;
			case "xy":
				anim("X", coordsX, pointsX, destroyedNodesX, animatedCoordsX);
				anim("Y", coordsY, pointsY, destroyedNodesY, animatedCoordsY);
				break;

		}

		function anim(zoomName, coords, points, destroyedNodes, animatedCoords) {
			var _grids = "_grids" + zoomName;
			var _label = "_label" + zoomName;
			var len = Math.max.apply(null, [chart[_label]['length'], chart[_grids]['length']]);
			var callback = function() {
				chart[_grids] = [];
				chart[_label] = [];
				for (var i in coords) {
					chart[_grids][i] = {
						0: coords[i]['grid'],
						y: points[i]['y'],
						x: points[i]['x'],
						num: coords[i]['num']
					};
					chart[_label][i] = {
						0: coords[i]['lbl'],
						y: points[i]['y'],
						x: points[i]['x'],
						num: coords[i]['num']
					};
				}
				for (var i in destroyedNodes) {
					destroyedNodes[i].remove();
				}
			}
			
			for (var i = 0; i < len; i++) {
				(function(i) {
					var num = chart[_label][i] ? chart[_label][i]['num'] : chart[_grids][i]['num'];
					var point = getPointByNum(num, points, animatedCoords);
					if (point && point.x !== undefined && point.y !== undefined) {
						var animAttrs = zoomName == "Y" ? {
							top: point.y + "px"
						} : {
							left: point.x + "px"
						};
						coords.push({
							num: num,
							lbl: chart[_label][i] && chart[_label][i][0] && chart[_label][i][0].stop().animate(animAttrs, duration, easing),
							grid: chart[_grids][i] && chart[_grids][i][0] && chart[_grids][i][0].stop().animate(animAttrs, duration, easing)
						});
					} else {
						
						var animAttrs = zoomName == "Y" ? {
							top: chart[_label][i] && judgeDirect2Move(chart[_label][i])['y'] + "px",
							opacity: 0
						} : {
							left: chart[_label][i] && judgeDirect2Move(chart[_label][i])['x'] + "px",
							opacity: 0
						};
						chart[_label][i] && chart[_label][i][0] && destroyedNodes.push(chart[_label][i][0].stop().animate(animAttrs, duration, easing));
						chart[_grids][i] && chart[_grids][i][0] && destroyedNodes.push(chart[_grids][i][0].stop().animate(animAttrs, duration, easing));
					}
				})(i)
			}

			
			for (var i in points) {
				if (!isInArray(points[i]['number'], animatedCoords)) {
					var margin = zoomName == "Y" ? judgeDirect2Move(points[i])['y'] + "px" : judgeDirect2Move(points[i])['x'] + "px";
					var beginAttrs = zoomName == "Y" ? {
						top: margin,
						opacity: 0
					} : {
						left: margin,
						opacity: 0
					};
					var endAttrs = zoomName == "Y" ? {
						top: points[i]['y'],
						opacity: 1
					} : {
						left: points[i]['x'],
						opacity: 1
					};

					if (zoomName == "Y") {
						var $lbl = drawLabelY(chart, i, points[i]['number']);
						var $grid = drawGridY(chart, judgeDirect2Move(points[i])['y']);
						coords.push({
							num: points[i]['number'],
							lbl: $lbl && $lbl.css(beginAttrs).stop().animate(endAttrs, duration, easing),
							grid: $grid && $grid.css(beginAttrs).stop().animate(endAttrs, duration, easing)
						});
					} else {
						var $lbl = drawLabelX(chart, i, points[i]['number']);
						var $grid = drawGridX(chart, judgeDirect2Move(points[i])['x']);
						coords.push({
							num: points[i]['number'],
							lbl: $lbl && $lbl.css(beginAttrs).stop().animate(endAttrs, duration, easing),
							grid: $grid && $grid.css(beginAttrs).stop().animate(endAttrs, duration, easing)
						});
					}

				}
			}
			
			Array.prototype.sort.call(coords, function(a, b) {
				return a.num - b.num
			});
			callback();
		}
	}
	
	function getRealPointsNum(points) {
		var j = 0;
		for (var i in points) {
			if (points[i]['x'] && points[i]['y']) {
				j++;
			}
		}
		return j;
	}

	
	function getLinePath(chart, points) {
		var path = "",
			ctnY = chart._innerContainer.bl.y,
			len = getRealPointsNum(points),
			start = 0;
		
		if (!points) return "";

		start = (function() {
			for (var i in points) {
				if (!chart.isEmptyPoint(points[i])) {
					return Math.round(i);
				}
			}
		})();

		path += "M" + points[start]['x'] + "," + points[start]['y'];
		
		if (chart._cfg.lineType == "arc" && len > 2) {
			path += " R";
			for (var i = start + 1, len = points.length; i < len; i++)
				if (points[i]['x'] && points[i]['y']) {
					
					path += points[i]['x'] + "," + points[i]['y'] + " ";
				}
		} else {
			for (var i = start + 1, len = points.length; i < len; i++)
				if (points[i]['x'] && points[i]['y']) {
					path += " L" + points[i]['x'] + "," + points[i]['y'];
				}
		}
		return path;
	}

	function isInArray(el, ary) {
		for (var i in ary) {
			if (ary[i] === el) {
				return true;
			}
		}
		return false;
	}

	return {
		drawTitle: drawTitle,
		drawSubTitle: drawSubTitle,
		drawAxisX: drawAxisX,
		drawAxisY: drawAxisY,
		drawGridsX: drawGridsX,
		drawGridX: drawGridX,
		drawGridY: drawGridY,
		drawGridsY: drawGridsY,
		drawLabelsX: drawLabelsX,
		drawLabelsY: drawLabelsY,
		drawLabelX: drawLabelX,
		drawLabelY: drawLabelY,
		getRealPointsNum:getRealPointsNum,
		animateGridsAndLabels: animateGridsAndLabels,
		getLinePath: getLinePath,
		isInArray: isInArray
	};
});