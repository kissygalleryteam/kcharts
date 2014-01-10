/**
 * @fileOverview KChart 1.3  datetime
 * @author huxiaoqi567@gmail.com
 */
;
KISSY.add("gallery/kcharts/1.3/datetime/index", function(S, D, Evt, Node, Base, Template, LineChart, Raphael, BaseChart, ColorLib, HtmlPaper, Legend, Theme, Touch, Tip, Anim, graphTool, Cfg) {
	var $ = S.all,
		clsPrefix = "ks-chart-",
		themeCls = clsPrefix + "default",
		evtLayoutCls = clsPrefix + "evtlayout",
		evtLayoutAreasCls = evtLayoutCls + "-areas",
		evtLayoutRectsCls = evtLayoutCls + "-rects",
		COLOR_TPL = "{COLOR}",
		//点的类型集合
		POINTS_TYPE = ["circle", "triangle", "rhomb", "square"],
		color;

	var methods = {
		init: function() {
			var self = this,
				points;
			// KISSY > \1.4 逻辑
			self._cfg || (self._cfg = S.mix(Cfg, self.userConfig));
			self._cfg.autoRender && self.render();
		}
	}

	var DateTime;
	if (Base.extend) {
		DateTime = LineChart.extend(methods);
	} else {
		DateTime = function(cfg) {};
		S.extend(DateTime, LineChart, methods);
	}
	return DateTime;
}, {
	requires: [
		'dom',
		'event',
		'node',
		'base',
		'gallery/template/1.0/index',
		'gallery/kcharts/1.3/linechart/index',
		'gallery/kcharts/1.3/raphael/index',
		'gallery/kcharts/1.3/basechart/index',
		'gallery/kcharts/1.3/tools/color/index',
		'gallery/kcharts/1.3/tools/htmlpaper/index',
		'gallery/kcharts/1.3/legend/index',
		'./theme',
		'gallery/kcharts/1.3/tools/touch/index',
		'gallery/kcharts/1.3/tip/index',
		'gallery/kcharts/1.3/animate/index',
		'gallery/kcharts/1.3/tools/graphtool/index',
		'./cfg'
	]
});