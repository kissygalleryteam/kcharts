// -*- coding: utf-8; -*-
// steel from http://svenbieder.com/thermometer-gauge/
KISSY.add("gallery/kcharts/1.2/thermometer/index",function(S,Raphael){
  function Thermometer(cfg){
    this.set(cfg);
    var container = S.get(cfg.renderTo);
    var paper;
    if(container){
      paper = Raphael(container,cfg.width,cfg.height)
    }else{
      throw Error("容器不能为空");
    }
    this.set("paper",paper);

    // 背景
    var backboard = paper.path("M 11 1 a 10 10 0 0 1 -10 10 l 0 218 a 10 10 0 0 1 10 10 l 58 0 a 10 10 0 0 1 10 -10 l 0 -218 a 10 10 0 0 1 -10 -10z");
    backboard.attr("fill", "#F4A460");

    // 玻璃管（下部被红色部分挡住）
    var glassbody = paper.path("M 34 181 l 0 -151 a 5 5 0 1 1 12 0 l 0 151z");
    glassbody.attr("stroke-width", "0");
    glassbody.attr("fill", "0-#feaa66:50-#ddd:70-#f5a561:100");


    var fluidheight = 30
    // 玻璃管中的mercury
    var fluid = paper.rect(35, 180 - fluidheight, 10, fluidheight);
    fluid.attr("stroke-width", "0");
    fluid.attr("fill", "0-#f00:50-#fdd:75-#f00:100");

    // 球形
    var liqcon = paper.circle(40, 200, 20);
    liqcon.attr("stroke-width", "0");
    liqcon.attr("fill", "r(0.75,0.25)#ffffff-#ff0000");

    for (var i = 0; i <= 150; i += 15) {
      var ycoord = 180 - i;
      var line = paper.path("M 47 " + ycoord + " l 10 0z");
      var text = paper.text(65, ycoord, i / 1.5);
    }
  }
  S.extend(Thermometer,S.Base);
  return Thermometer;
},{
  requires:["gallery/kcharts/1.1/raphael/index"]
});
