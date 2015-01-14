define('kg/kcharts/5.0.1/dashboard/pointer',["base","util"],function(require, exports, module) {

  var Base = require('base'),
      Util = require('util');
   var methods = {
     pointTo:function(angle,effect){
       var paper = this.get('paper')
         , that = this
         , dashboard = this.get('dashboard')
         , pointer
         , paperCx = dashboard.get('cx')
         , paperCy = dashboard.get('cy')
         , cfg = dashboard.get('pointer') || {}
         , cx = cfg.cx || 0 
         , cy = cfg.cy || 0
         , x = paperCx+cx      
         , y = paperCy+cy
         , w = dashboard.get('width')
         , h = dashboard.get('height')

       
       var themes = {
         "a":function(cfg){
           var transform = ['r',angle-90,x,y].join(',')
             , pathString
             , circlepath
           if(!that.pointer){
             that.pointer = pointer1(paper,x,y,cfg.r || 5,cfg.R || 80,cfg)
           }
           if(angle){
             that.pointer.animate({transform:transform},effect.ms,effect.easing,effect.callback)
           }
         },
         "b":function(){

         }
       }
       var render = (cfg.theme && cfg.theme.name && themes[cfg.theme.name]) || themes['a']
       render && render(cfg.theme)
     }
   };

   
  var Pointer = Base.extend(methods);

   

  var M = "M" , L = "L" , A = "A"
  
  
  function pointer1(paper,x,y,r,R,cfg){
    var x1
      , y1
      , x2
      , y2
      , x3
      , y3
      , theta = Math.asin(r/R)

    cfg = Util.mix({
      fill:'#000',
      stroke:'#000'
    },cfg,true,['stroke','stroke-width','fill'])

    x1 = x
    y1 = y - R
    var l = r*Math.cos(theta)
    x2 = x + l 
    y2 = y - r*r/R
    x3 = x - l
    y3 = y - r*r/R

    var pa = ["M",x1,y1,'L',x2,y2,'A',r,r,0,1,1,x3,y3,'Z']
    var p = paper.path(pa.join(','))

    p.attr(cfg)

    return p;
  }
  
  
  

  
  function pointer2(paper,x,y,r,R1,R2){
    var x1,y1,x2,y2,x3,y3,x4,y4
    x1 = x , y1 = y - R1
    x2 = x+r , y2 = y
    x3 = x , y3 = y +  R2
    x4 = x-r , y4 = y
    var pa = ['M',x1,y1,"L",x2,y2,"L",x3,y3,'L',x4,y4,"Z"]
    return paper.path(pa.join(','))
  }
  
  
  

  
  function pointer3(paper,x,y,r,w,R1,R2){
    var x1 , y1 , x2 , y2 , x3 , y3 , x4 , y4
      , x5 , y5 , x6 , y6 , x7 , y7 , x8 , y8

    x1 = x - w/2 , y1 = y - R1 , x2 = x + w/2 , y2 = y - R1
    x3 = x + w/2 , y3 = y - r , x4 = x + w/2 , y4 = y + r
    x5 = x + w/2 , y5 = y + R2 , x6 = x - w/2 , y6 = y + R2
    x7 = x - w/2 , y7 = y + r , x8 = x - w/2 , y8 = y - r

    
    var pa = ["M",x1,y1,"L",x2,y2,"L",x5,y5,'L',x6,y6,'z']
      , ps = pa.join(',')
    ps += getCirclePath(x,y,5)
    return paper.path(ps)
  }
  
  
  

  
  function getCirclePath(x , y, r){
	  var s = "M";
	  s = s + "" + (x) + "," + (y-r) + "A"+r+","+r+",0,1,1,"+(x-0.1)+","+(y-r)+"z";
	  return s;
  }

  return Pointer
});