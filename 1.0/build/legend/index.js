KISSY.add('gallery/kcharts/1.0/legend/index',function(S,HtmlPaper,Template,undefined){

	var $ = S.all,
		Evt = S.Event;

	function Legend(cfg){

		var self = this;

		self._cfg = S.mix({themeCls:"ks-charts-legend"},cfg,undefined,undefined,true);

		self.init();

	}

	S.augment(Legend,{

		init:function(){

			var self = this,
				_cfg = self._cfg,
				chart = _cfg.chart,
				len = 0;

			if(_cfg.container){

				self.$ctn = $(_cfg.container);

				if(!self.$ctn[0]) return;

			}

			self._infos = {};

			for(var i in chart._datas['total']){
				len +=1;
			}

			S.mix(self._infos,{
				colors:chart.color._colors.slice(0,len),
				series:chart._cfg.series
			});

			self.render();

			self.bindEvt();

		},

		render:function(){

			var self = this,
				_cfg = self._cfg,
				chart = _cfg.chart;

			self._html = "<div class="+_cfg.themeCls+"><ul>";

			if(chart._lines){

					self.createHtmlIcon();

			}else{

				self.createHtmlIcon();

			}

			self._html += "</ul></div>";

			self.$ctn.html(self._html);

		},

		createCanvasIcon:function(){


		},

		createHtmlIcon:function(){

			var self = this,
				_cfg = self._cfg,
				chart = _cfg.chart,
				_infos = self._infos;

			for(var i in chart._datas['total']){

				var defaultColor = _infos['colors'][i]['DEFAULT'],
					hoverColor = _infos['colors'][i]['HOVER'];

				self._html += Template("<li class='clearfix'><div class='legend-icon' style='background-color:"+defaultColor+"''></div><div class='legend-text'>{{text}}</div></li>").render(_infos['series'][i]);

			}

		},

		getHtml:function(){
			return this._html || "";
		},

		destroy:function(){},

		bindEvt:function(){

			// var self = this,
			// 	chart = self._cfg.chart;

			// Evt.on($("li",self.$ctn),"click",function(e){

			// 	var index = S.indexOf(e.currentTarget,$("li",self.$ctn));



			// });

			// Evt.on($("li",self.$ctn),"mouseenter",function(e){


			// });



		}



	});

	return Legend;


},{requires:['gallery/kcharts/1.0/tools/htmlpaper/index','gallery/template/1.0/index','./assets/legend.css']});
