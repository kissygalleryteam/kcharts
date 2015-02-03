define('kg/kcharts/5.0.1/tools/graphtool/index',["util","kg/kcharts/5.0.1/raphael/index"],function(require, exports, module) {

	var Util = require("util"),
		Raphael = require("kg/kcharts/5.0.1/raphael/index");
	var sqrt = Math.sqrt;
	var graphTool = {};
	
	var triangle = function(paper,x,y,r,deg){
		var	path = [
				"M" + [x,y-r].join(","),
				"L" + [x - r * sqrt(3)/2,y - 0 + r * 1/2].join(","),
				[x - 0 + r * sqrt(3)/2,y - 0 + r * 1/2].join(","),
				"Z"
			].join(" "),
			el;

		if(paper && paper.path){
			el = paper.path(path);
			
			el.rotate(deg,x,y);
			return el;
		}
	};
	
	var rhomb = function(paper,x,y,w,h,deg){
		var path = [
				"M" + [x,y-h/2].join(","),
				"L" + [x - 0 + w/2,y].join(","),
				[x,y - 0 + h/2].join(","),
				[x - w/2,y].join(","),
				"Z"
			].join(","),
			el;
		if(paper && paper.path){
			el = paper.path(path);
			
			el.rotate(deg,x,y);
			return el;
		}
	};

	var square = function(paper,x,y,w,h){
		var path = [
			["M",x-w/2,",",y-h/2].join(""),
			[" L",x/1+w/2,",",y-h/2," v",h," h",-w,'z'].join("")
		],el;
		if(paper && paper.path){
			el = paper.path(path);
			return el;
		}
	}

	graphTool = Util.merge(graphTool,{
		triangle:triangle,
		rhomb:rhomb,
		square:square
	});

	return graphTool;
});