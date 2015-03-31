KISSY.use("kg/kcharts/6.0.0/datetime/index,base,node,event,dd,dd/plugin/constrain", function(S, DateTime, Base, Node, Event, DD, Constrain) {

	var $ = S.all;
	var RangeChart = Base.extend({
		initializer: function() {
			this._cfg = this.userConfig;
			this.render();
		},
		render: function() {
			var self = this,
				cfg = self._cfg,
				renderTo = cfg.renderTo;
			var defaultCfg = {
				canvasAttr: {
					x: 40,
					y: 5,
					width: 670,
					height: 30
				},
				autoRender: false,
				comparable: true,
				areas: {
					isShow: true
				},
				legend: {
					isShow: false
				},
				xLabels: {
					isShow: false
				},
				yLabels: {
					isShow: false
				},
				line: {
					attr: {
						"stroke-width": 1
					},
					hoverAttr: {
						"stroke-width": 1
					}
				},
				xGrids: {
					isShow: false
				},
				yGrids: {
					isShow: false
				},
				series: self.get("series")

			};
			var mixedCfg = S.mix(defaultCfg, cfg, undefined, undefined, true)
			mixedCfg.renderTo = "#J_Range";
			var range = new DateTime(mixedCfg);
			range.render();
			self.range = range;
			self.renderRange();
		},
		renderRange: function() {
			var self = this,
				cfg = self._cfg,
				range = cfg.range || [0, 1];
			var btnTpl = '<svg xmls="http://www.w3.org/2000/svg" version="1.1">'+
				'<g style="cursor:e-resize;" zIndex="4" transform="translate(5,10)">'+
				'	<rect rx="3" ry="3" fill="#FFF" x="-4.5" y="0.5" width="8" height="15" stroke="#666" stroke-width="1"></rect>'+
				'	<path fill="#FFF" d="M -1.5 4 L -1.5 12 M 0.5 4 L 0.5 12" stroke="#666" stroke-width="1"></path>'+
				'</g>'+
				'</svg>';
			var rangeTpl = '<div class="kc-range-inner">' +
				'<div class="kc-range-block kc-range-block-left"></div>' +
				'<div class="kc-range-block kc-range-block-right"></div>' +
				'<div class="kc-range-btn">'+btnTpl+'</div>' +
				'<div class="kc-range-btn">'+btnTpl+'</div>' +
				'</div>';
			var $range = $(rangeTpl).css({
				height: 40
			}).prependTo($("#J_Range"));
			self.$range = $range;
			self.$btns = $(".kc-range-btn", $range);
			self.$blocks = $(".kc-range-block", $range);
			var $btnLeft = $(self.$btns[0]);
			var $btnRight = $(self.$btns[1]);
			var $blocks = self.$blocks;
			var btnWidth = $(self.$btns[0]).width();
			$(self.$btns[0]).css({
				left: $range.width() * range[0] + "px"
			})
			$(self.$btns[1]).css({
				left: $range.width() * range[1] + "px"
			})
			$(self.$blocks[0]).width($range.width() * range[0] + $btnLeft.width()/2).css({
				left: 0
			});
			$(self.$blocks[1]).width($range.width() * (1-range[1]) - $btnLeft.width()/2).css({
				right: 0
			});
			
			var start = parsePx($btnLeft.css("left")) / $("#J_Range").width();
			var end = (parsePx($btnRight.css("left")) + btnWidth / 1) / $("#J_Range").width();
			self.range = [start, end];
			self.onDragEnd();
			var constrain = new Constrain({
				constrain: "#J_Range"
			});
			var drag = new DD.Draggable({
				node: self.$btns[0],
				move: 1,
				plugins: [
					constrain
				]
			});
			drag.on("drag", self.onDrag, self)
			drag.on("dragend", self.onDragEnd, self)
			var drag2 = new DD.Draggable({
				node: self.$btns[1],
				move: 1,
				plugins: [
					constrain
				]
			});
			drag2.on("drag", self.onDrag, self)
			drag2.on("dragend", self.onDragEnd, self)
		},
		onDrag: function(e) {
			var self = this;
			var $btnLeft = $(self.$btns[0]);
			var $btnRight = $(self.$btns[1]);
			var $blocks = self.$blocks;
			var btnWidth = $(self.$btns[0]).width();
			if(parsePx($btnLeft.css("left")) > parsePx($btnRight.css("left"))){
				var tmp = $(self.$btns[0]);
				self.$btns[0] = $(self.$btns[1]);
				self.$btns[1] = tmp;
			}
			var $blockLeft = $($blocks[0]);
			var $blockRight = $($blocks[1]);
			// console.log(parsePx($btnLeft.css("left")))
			$blockLeft.width(parsePx($btnLeft.css("left"))+ btnWidth/2);
			$blockRight.width($("#J_Range").width() - parsePx($btnRight.css("left")) - btnWidth/2);
			var start = parsePx($btnLeft.css("left")) / $("#J_Range").width();
			var end = (parsePx($btnRight.css("left")) + btnWidth / 1) / $("#J_Range").width();
			self.range = [start, end];
		},
		onDragEnd: function() {
			var self = this;
			var cfg = self._cfg;
			var range = self.range;
			var data = cfg.series[0]['data'];
			var len = data.length;

			var start = Math.round(len * range[0]);
			var end = Math.round(len * range[1]);
			var series = [];
			for (var i in cfg.series) {
				series.push({
					text: cfg.series[i]['text'] || "",
					data: cfg.series[i]['data'].slice(start, end)
				})
			}
			var xAxis = cfg.xAxis.text.slice(start, end);
			self.fire("afterRange", {
				range: self.range,
				series: series,
				xAxis: xAxis
			})
		}
	});

	function parsePx(str) {
		return str.replace("px", "") / 1;
	}
	var xAxis = [];
	var series = (function() {
		var tmp = [];
		for (var i = 0, len = data.length; i < len; i++) {
			tmp.push(data[i][1]);
			xAxis.push(data[i][0])
		}
		return tmp;
	})();
	var range = new RangeChart({
		renderTo: "#demo1",
		series: [{
			data: series
		}],
		xAxis: {
			text: xAxis
		},
		range: [0.2, 0.6]
	});

	range.on("afterRange", function(e) {
		var range = e.range;
		RenderDateTime(e.series, e.xAxis)
	});

	range.onDragEnd()

	function RenderDateTime(series, xAxis) {
		$("#J_Chart").html("");
		var range = new DateTime({
			renderTo: "#J_Chart",
			comparable: true,
			canvasAttr: {
				x: 40,
				y: 5,
				width: 670,
				height: 230
			},
			areas: {
				isShow: true
			},
			legend: {
				isShow: false
			},
			xLabels: {
				isShow:false
			},
			tip: {
				template: function(e) {
					var html = "";
					for (var i in e.datas) {
						html+="<h1 style='color:"+e.datas[i]['color']+"'>"+formatDate(e.datas[i]['x'])+"</h1>"
						html += "<span >"+e.datas[i]['y']+"</span>";
					}
					return html + " ";
				}
			},
			line: {
				attr: {
					"stroke-width": 1
				},
				hoverAttr: {
					"stroke-width": 1
				}
			},
			yAxis:{
				isShow:false
			},
			yLabels:{
				css:{
					marginLeft:-10
				}
			},
			xAxis: {
				text: xAxis
			},
			xGrids: {
				isShow: false
			},
			yGrids: {
				isShow: true
			},
			series: series
		});
		var htmlPaper = range.getHtmlPaper();
		var len = range._pointsX.length;
		var num = 5;
		var step = Math.round(len/5);
		for(var i =0;i<len;i++){
			if(i%step == Math.round(step/2)){
				htmlPaper.text(range._pointsX[i]['x'],range._pointsX[i]['y'],formatDate(range._pointsX[i]["number"]) )
			}
		}
	}

	function formatDate(timestamp){
		var date = new Date(timestamp);
		return [date.getMonth()+1,"/",date.getDate(),"/",(date.getFullYear()+"").substr(2,2)].join("")
	}


});