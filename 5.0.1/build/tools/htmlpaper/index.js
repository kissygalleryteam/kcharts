define('kg/kcharts/5.0.1/tools/htmlpaper/index',["util","node"],function(require, exports, module) {


	var Util = require("util"),
		Node = require("node");
	var $ = Node.all,
		win = window;
	var HtmlPaper = function(tgt,cfg){
		var self = this;
		if(!tgt) return;
		self.$tgt = $(tgt);
		return self._init(cfg);
	};

	Util.augment(HtmlPaper,{
		_init:function(cfg){
			var self = this;
			self._cfg = Util.mix({
				clsName:"ks-charts-container",
				prependTo:true,
				width:undefined,
				height:undefined,
				left:0,
				top:0,
				css:{}
			},cfg);
			self.$paper = self._createPaper();
		},
		_createPaper:function(){
			var self = this,
				$tgt = self.$tgt,
				_cfg = self._cfg;
			var $paper = $("<div></div>")
				.addClass(_cfg.clsName)
				.css({
					width:_cfg.width || $tgt.width(),
					height:_cfg.height || $tgt.height(),
					position:"absolute",
					left:_cfg.left||0,
					top:_cfg.top||0
				}).css(_cfg.css);
			_cfg.prependTo ? $paper.prependTo($tgt) : $paper.appendTo($tgt);
			return $paper;
		},
		
		text:function(x,y,str,h_align,v_align){
			var self = this,
				offsetX = 0,
				offsetY = 0,
				width,
				height,
				x = x - self._cfg.left,
				y = y - self._cfg.top;

			var $text = $("<div></div>").html(str).css({
				display:"block",
				position:"absolute"
			});
			
			$text.appendTo(self.$paper);

			width = $text.outerWidth();

			height = $text.outerHeight();

			switch (h_align){

            	case "right" :

            		offsetX = - width;

            		break;

            	case "center" :

            		offsetX = - width / 2;

            		break;

            }

            switch (v_align){

            	case "middle" :

            		offsetY = - height /2;

            		break;

            	case "bottom" :

            		offsetY = - height;

            		break;

            }
			$text.css({
				left:x,
				top:y,
				marginLeft:offsetX,
				marginTop:offsetY
			})
			return $text;

		},
		rect:function(x,y,w,h){
			var self = this,
				x = x - self._cfg.left,
				y = y - self._cfg.top;
			var $rect = $("<div></div>").css({
				left:x,
				top:y,
				width:w,
				height:h,
				"font-size":"1px",
				display:"block",
				position:"absolute"
			});
			return $rect.appendTo(self.$paper);
		},

		lineX:function(x,y,len){
			var self = this,
				x = x - self._cfg.left,
				y = y - self._cfg.top;
			var $line = $("<div></div>").css({
				left:x,
				top:y,
				display:"block",
				position:"absolute",
				width:len,
				height:0,
				borderTop:"1px solid"
			});
			return $line.appendTo(self.$paper);
		},
		lineY:function(x,y,len){
			var self = this,
				x = x - self._cfg.left,
				y = y - self._cfg.top;
			var $line = $("<div></div>").css({
				left:x,
				top:y,
				display:"block",
				position:"absolute",
				width:0,
				height:len,
				borderLeft:"1px solid"
			});
			return $line.appendTo(self.$paper);
		},
		clear:function(){
			var self = this;
			self.$paper.html("");
			return self.$paper;
		}
	});
	return HtmlPaper;
});