<<<<<<< HEAD
/*! kcharts - v1.2 - 2013-10-11 1:40:29 PM
=======
/*! kcharts - v1.2 - 2013-10-11 11:03:05 AM
>>>>>>> 8fdf0d9d33140c59605d302c62314e20e640cb8e
* Copyright (c) 2013 数据可视化小组; Licensed  */
KISSY.add("gallery/kcharts/1.2/thermometer/index",function(l,t){function e(e){this.set(e);var r,i=l.get(e.renderTo);if(!i)throw Error("容器不能为空");r=t(i,e.width,e.height),this.set("paper",r);var n=r.path("M 11 1 a 10 10 0 0 1 -10 10 l 0 218 a 10 10 0 0 1 10 10 l 58 0 a 10 10 0 0 1 10 -10 l 0 -218 a 10 10 0 0 1 -10 -10z");n.attr("fill","#F4A460");var s=r.path("M 34 181 l 0 -151 a 5 5 0 1 1 12 0 l 0 151z");s.attr("stroke-width","0"),s.attr("fill","0-#feaa66:50-#ddd:70-#f5a561:100");var a=30,o=r.rect(35,180-a,10,a);o.attr("stroke-width","0"),o.attr("fill","0-#f00:50-#fdd:75-#f00:100");var h=r.circle(40,200,20);h.attr("stroke-width","0"),h.attr("fill","r(0.75,0.25)#ffffff-#ff0000");for(var c=0;150>=c;c+=15){var x=180-c;r.path("M 47 "+x+" l 10 0z"),r.text(65,x,c/1.5)}}return l.extend(e,l.Base),e},{requires:["gallery/kcharts/1.1/raphael/index"]});