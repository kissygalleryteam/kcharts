// -*- coding: utf-8; -*-
/**
 * 矢量画刻度
 * @author cookieu@gmail.com
 * */
KISSY.add('gallery/kcharts/1.1/dashboard/dashboard-ticks',function(S){
  function Ticks(){
    Ticks.superclass.constructor.apply(this,arguments)
    this.init()
  }

  S.extend(Ticks,S.Base,{
    init:function(){
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
      m = cfg.m || 5

      totalAngle = end - start
      // step = parseFloat((totalAngle / n).toFixed(2))
      step = totalAngle / n

      for(var i=0;i<=n;i+=1){
        if(i%m == 0){
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
      paper.path(pathstring)

      var patharray4thick = []
      for(var j=0;j<n;j+=m){
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
      thick.attr('stroke-width','2')
    }
  })
  return Ticks
})


/**
 * */