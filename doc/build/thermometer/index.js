define('kg/kcharts/5.0.1/thermometer/index',["base","node","util","kg/kcharts/5.0.1/raphael/index"],function(require, exports, module) {

  var Base = require('base'),
      Node = require('node'),
      Util = require('util'),
      Raphael = require("kg/kcharts/5.0.1/raphael/index");
  var Thermometer  = Base.extend({
    initializer:function(){
    var cfg = this.userConfig;
    var paper,renderTo = Node.all(cfg.renderTo)[0];
    if(cfg.renderTo && renderTo){
      paper = Raphael(renderTo,cfg.width,cfg.height)
    }else{
      throw Error("容器不能为空");
    }
    this.set("paper",paper);

    
    var backboard = paper.path("M 11 1 a 10 10 0 0 1 -10 10 l 0 218 a 10 10 0 0 1 10 10 l 58 0 a 10 10 0 0 1 10 -10 l 0 -218 a 10 10 0 0 1 -10 -10z");
    backboard.attr("fill", "#F4A460");

    
    var glassbody = paper.path("M 34 181 l 0 -151 a 5 5 0 1 1 12 0 l 0 151z");
    glassbody.attr("stroke-width", "0");
    glassbody.attr("fill", "0-#feaa66:50-#ddd:70-#f5a561:100");


    var fluidheight = 30
    
    var fluid = paper.rect(35, 180 - fluidheight, 10, fluidheight);
    fluid.attr("stroke-width", "0");
    fluid.attr("fill", "0-#f00:50-#fdd:75-#f00:100");

    
    var liqcon = paper.circle(40, 200, 20);
    liqcon.attr("stroke-width", "0");
    liqcon.attr("fill", "r(0.75,0.25)#ffffff-#ff0000");

    for (var i = 0; i <= 150; i += 15) {
      var ycoord = 180 - i;
      var line = paper.path("M 47 " + ycoord + " l 10 0z");
      var text = paper.text(65, ycoord, i / 1.5);
    }
  }
  })
  return Thermometer;
});