/**
 * 矢量画刻度
 * @author cookieu@gmail.com
 * */
define(function(require, exports, module) {
  var Util = require('util'),
      Base = require('base');
   var methods = {
     initializer:function(){
       var cfg = this.get('cfg')
       var n          // 圆被分成的份数
         , m          // 粗线
         , start      // 始末弧度
         , end
         , totalAngle //end - start
         , step       // 步长
         , r = cfg.r1 || 100
         , r2 = cfg.r2 || 105
         , R = cfg.R || 110
         , unit_x
         , unit_y
         , dashboard = this.get('dashboard')
         , paper = this.get('paper')
         , cx = dashboard.get('cx')
         , cy = dashboard.get('cy')
         , x1
         , y1
         , x2
         , y2
         , patharray = []
         , pathstring = ''
       start = cfg.start || 0
       end = cfg.end  || 2*Math.PI
       n = cfg.n || 60
       m = cfg.m

       start -= Math.PI
       end -= Math.PI

       totalAngle = end - start
       // step = parseFloat((totalAngle / n).toFixed(2))
       step = totalAngle / n

       for(var i=0;i<=n;i+=1){
         if(m && i%m == 0){
           continue
         }
         var theta = start+i*step
         unit_x = Math.cos(theta)
         unit_y = Math.sin(theta)
         x1 = cx + r2*unit_x
         y1 = cy + r2*unit_y

         x2 = cx + R*unit_x
         y2 = cy + R*unit_y

         patharray.push("M",x1,y1,"L",x2,y2)
       }
       pathstring = patharray.join(',')
       var thinTick = paper.path(pathstring)
         , style4thin = {

         }
       Util.mix(style4thin,cfg.thinStyle,true,['stroke-width','stroke'])
       thinTick.attr(style4thin)
       if(m){
         var patharray4thick = []
         for(var j=0;j<=n;j+=m){
           var theta = start+j*step
           unit_x = Math.cos(theta)
           unit_y = Math.sin(theta)
           x1 = cx + r*unit_x
           y1 = cy + r*unit_y
           x2 = cx + R*unit_x
           y2 = cy + R*unit_y
           patharray4thick.push("M",x1,y1,"L",x2,y2)
         }
         pathstring = patharray4thick.join(',')
         var thick = paper.path(pathstring)
           , style4thick = {
             'stroke-width':2
           }
         Util.mix(style4thick,cfg.thickStyle,true,['stroke-width','stroke'])
         thick.attr(style4thick)
       }
     }
   }
   return Base.extend(methods);
 });
