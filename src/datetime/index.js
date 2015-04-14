/**
 * @fileOverview KChart 1.3  datetime
 * @author huxiaoqi567@gmail.com
 */
;
KISSY.add(function(S, D, Evt, Node, Base, Template, LineChart, Raphael, BaseChart, ColorLib, HtmlPaper, Legend, Theme, Touch, Tip, Anim, graphTool, Cfg) {
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
			self.chartType = "datetime";
			var defaultCfg = S.clone(Cfg);
			// KISSY > 1.4 逻辑
			self._cfg = S.mix(defaultCfg, self.userConfig,undefined,undefined,true);
			BaseChart.prototype.init.call(self, self._cfg);
			self._cfg.autoRender && self.render();
		}
	}

	var DateTime;
	if (Base.extend) {
		DateTime = LineChart.extend(methods);
	} else {
		DateTime = function(cfg) {
			var self = this;
			self.userConfig = cfg;
			self.init();
		};
		S.extend(DateTime, LineChart, methods);
	}
	return DateTime;
}, {
	requires: [
		'dom',
		'event',
		'node',
		'base',
		'kg/kcharts/6.0.1/template/index',
		'kg/kcharts/6.0.1/linechart/index',
		'kg/kcharts/6.0.1/raphael/index',
		'kg/kcharts/6.0.1/basechart/index',
		'kg/kcharts/6.0.1/tools/color/index',
		'kg/kcharts/6.0.1/tools/htmlpaper/index',
		'kg/kcharts/6.0.1/legend/index',
		'./theme',
		'kg/kcharts/6.0.1/tools/touch/index',
		'kg/kcharts/6.0.1/tip/index',
		'kg/kcharts/6.0.1/animate/index',
		'kg/kcharts/6.0.1/tools/graphtool/index',
		'./cfg'
	]
});