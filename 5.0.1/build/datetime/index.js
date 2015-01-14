define('kg/kcharts/5.0.1/datetime/index',["util","node","base","event-dom","kg/kcharts/5.0.1/tools/template/index","kg/kcharts/5.0.1/raphael/index","kg/kcharts/5.0.1/basechart/index","kg/kcharts/5.0.1/linechart/index","kg/kcharts/5.0.1/tools/color/index","kg/kcharts/5.0.1/tools/htmlpaper/index","kg/kcharts/5.0.1/legend/index","./theme","kg/kcharts/5.0.1/tools/touch/index","kg/kcharts/5.0.1/tip/index","kg/kcharts/5.0.1/animate/index","kg/kcharts/5.0.1/tools/graphtool/index","./cfg"],function(require, exports, module) {

	var Util = require("util"),
		Node = require("node"),
		Base = require("base"),
		Evt = require('event-dom'),
		Template = require("kg/kcharts/5.0.1/tools/template/index"),
		Raphael = require("kg/kcharts/5.0.1/raphael/index"),
		BaseChart = require("kg/kcharts/5.0.1/basechart/index"),
		LineChart = require("kg/kcharts/5.0.1/linechart/index"),
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
		
		POINTS_TYPE = ["circle", "triangle", "rhomb", "square"],
		color;

	var methods = {
		init: function() {
			var self = this,
				points;
			self.chartType = "datetime";
			var defaultCfg = Util.clone(Cfg);
			self._cfg = Util.mix(defaultCfg, self.userConfig,undefined,undefined,true);
			BaseChart.prototype.init.call(self, self._cfg);
			self._cfg.autoRender && self.render();
		}
	}

	return LineChart.extend(methods);
});