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
      S.mix(style4thin,cfg.thinStyle,true,['stroke-width','stroke'])
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
        S.mix(style4thick,cfg.thickStyle,true,['stroke-width','stroke'])
        thick.attr(style4thick)
      }
    }
  })
  return Ticks
})


/**
 * */// -*- coding: utf-8; -*-
/**
 * 仪表盘
 * @author cookieu@gmail.com
 */
KISSY.add('gallery/kcharts/1.1/dashboard/index',function(S,Raphael,Pointer,PicturePointer,Ticks){
  var D = S.DOM
    , E = S.Event
    , R = Raphael

  function DashBoard(){
    DashBoard.superclass.constructor.apply(this,arguments)
    var con = this.get('renderTo')
    if(S.isString(con)){
      con = S.get(con)
    }
    var w = this.get('width')
      , h = this.get('height')
    this.paper = R(con,w,h)
    this.init()
  }

  DashBoard.ATTRS = {
    width:{
      value:400
    },
    height:{
      value:400
    },
    cx:{
      value:0
    },
    cy:{
      value:0
    }
  }

  S.extend(DashBoard,S.Base,{
    init:function(){
      var cx = this.get('cx') || this.get('width')/2
        , cy = this.get('cy') || this.get('width')/2
        , that = this
      this.set('cx',cx)
      this.set('cy',cy)

      this.bindEvent()

      var tick
        , pointer
        , bg

      tick = this.get('ticks')
      pointer = this.get('pointer')
      bg = this.get('background')

      if(S.isObject(bg)){
        this.drawBg(bg)
      }else if(S.isFunction(bg)){
        bg.call(this)
      }

      if(S.isObject(pointer)){
        this.drawPointer(pointer)
      }else if(S.isFunction(pointer)){
        pointer.call(this)
      }

      if(S.isObject(tick)){
        this.drawTicks(tick)
      }else if(S.isFunction(tick)){
        this.ticks = tick.call(this)
      }
    },
    bindEvent:function(){
      var that = this
    },
    drawBg:function(cfg){
      if(cfg.src){
        this.drawPictureBg(cfg)
      }else{
        this.drawVectorBg(cfg)
      }
    },
    drawPointer:function(cfg){
      var that = this
      if(cfg.src){
        that.drawPicturePointer(cfg)
      }else{
        that.drawVectorPointer(cfg)
      }
    },
    drawVectorBg:function(){
    },
    drawPictureBg:function(cfg){
      var src = cfg.src
        , paper = this.paper
        , that = this
        , cx = this.get('cx')
        , cy = this.get('cy')
        , cx0 = cfg.cx
        , cy0 = cfg.cy
        , x = cx-cx0
        , y = cy-cy0
        , background
      background = paper.image(src,x,y,cfg.width,cfg.height)
      this.set('background',background)
      this.background = background
    },
    drawPicturePointer:function(cfg){
      var cx // 表盘中心x
        , cy // 表盘中心y
        , x0 // 指针的中心点x
        , y0 // 指针的中心点y

      cx = this.get('cx')
      cy = this.get('cy')
      x0 = cfg.cx
      y0 = cfg.cy

      var src = cfg.src
        , paper = this.paper
        , x = cx - x0
        , y = cy - y0
        , RImage
        , that = this
      RImage = paper.image(src,x,y,cfg.width,cfg.height)
      var picpointer = new PicturePointer({pointer:RImage,dashboard:that,paper:paper,cx:x0,cy:y0})
      that.set('pointer',picpointer)
      this.pointer = picpointer
    },
    drawVectorPointer:function(position){
      var cfg = this.get('vectorPointer')
        , that = this
        , paper = this.paper

      var vectorpointer = new Pointer({
        dashboard:that
      , paper:paper
      })
      this.pointer = vectorpointer
    },
    drawTicks:function(cfg){
      this.ticks = new Ticks({dashboard:this,paper:this.paper,cfg:cfg})
    },
    pointTo:function(angle,effect){
      this.pointer && this.pointer.pointTo(angle,effect)
    }
  })
  return DashBoard
},{
  requires:['../raphael/index','./pointer','./pointer-pic','./dashboard-ticks']
})

/**
 * 速度仪表盘
 * http://dev:8080/dropbox/gits/highcharts/examples/gauge-dual/index.htm
 * 音量电平
 * http://dev:8080/dropbox/gits/highcharts/examples/gauge-vu-meter/index.htm
 * */// -*- coding: utf-8; -*-
/**
 * 指针
 * @author cookieu@gmail.com
 * */
KISSY.add('gallery/kcharts/1.1/dashboard/pointer-pic',function(S,Pointer){
  function PicturePointer(){
    PicturePointer.superclass.constructor.apply(this,arguments)
    var pointer = this.get('pointer')
      , paper = this.get('paper')
      , dashboard = this.get('dashboard')
      , cx0 = this.get('cy')
      , cy0 = this.get('cx')
      , cx = dashboard.get('cx')
      , cy = dashboard.get('cy')

    this.pointer = pointer
    this.cx = cx0
    this.cy = cy0
    this.paperCx = cx
    this.paperCy = cy
  }

  S.extend(PicturePointer,Pointer,{
    pointTo:function(angle,effect){
      var t = ['r',angle,this.paperCx,this.paperCy].join(',')
      if(effect){
        this.pointer.animate({transform:t},effect.ms,effect.easing,effect.callback)
      }else{
        this.pointer.transform(t)
      }
      return this
    }
  })
  return PicturePointer
},{
  requires:['./pointer']
})


// -*- coding: utf-8; -*-
/**
 * 指针
 * @author cookieu@gmail.com
 * */
KISSY.add('gallery/kcharts/1.1/dashboard/pointer',function(S){
  function Pointer(){
    Pointer.superclass.constructor.apply(this,arguments)
  }

  var M = "M" , L = "L" , A = "A"
  S.extend(Pointer,S.Base,{
    pointTo:function(angle,effect){
      var paper = this.get('paper')
        , that = this
        , dashboard = this.get('dashboard')
        , pointer
        , paperCx = dashboard.get('cx')
        , paperCy = dashboard.get('cy')
        , cfg = dashboard.get('pointer') || {}
        , cx = cfg.cx || 0 // 指针头中心x y
        , cy = cfg.cy || 0
        , x = paperCx+cx      // 指针头实际开始位置x y
        , y = paperCy+cy
        , w = dashboard.get('width')
        , h = dashboard.get('height')

      // 指针主题
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
  })

  // 圆头指针
  /**
   * @param paper
   * @param x 指针的中心点x
   * @param y
   * @param r 圆头指针的“圆头”半径
   * @param R 指针半径
   * @param cfg
   */
  function pointer1(paper,x,y,r,R,cfg){
    var x1
      , y1
      , x2
      , y2
      , x3
      , y3
      , theta = Math.asin(r/R)

    cfg = S.mix({
      fill:'#000',
      stroke:'#000'
    },cfg,true,['stroke','stroke-width','fill'])

    x1 = x
    y1 = y - R
    var l = r*Math.cos(theta)
    x2 = x + l //Math.sqrt(Math.pow(R,2) - Math.pow(r,2))
    y2 = y - r*r/R
    x3 = x - l
    y3 = y - r*r/R

    var pa = ["M",x1,y1,'L',x2,y2,'A',r,r,0,1,1,x3,y3,'Z']
    var p = paper.path(pa.join(','))

    p.attr(cfg)

    return p;
  }
  // eg:
  // var pointer = pointer1(paper,100,100,5,80)
  // pointer.attr({'fill':'blue',"stroke":"blue"})

  // 菱形指针
  function pointer2(paper,x,y,r,R1,R2){
    var x1,y1,x2,y2,x3,y3,x4,y4
    x1 = x , y1 = y - R1
    x2 = x+r , y2 = y
    x3 = x , y3 = y +  R2
    x4 = x-r , y4 = y
    var pa = ['M',x1,y1,"L",x2,y2,"L",x3,y3,'L',x4,y4,"Z"]
    return paper.path(pa.join(','))
  }
  // eg:
  // var pointer = pointer2(paper,100,100,5,80,10)
  // pointer.attr({'fill':'blue',"stroke":"blue"})

  // 矩形指针，中间带一个圆饼
  function pointer3(paper,x,y,r/* 圆饼半径 */,w/* 矩形宽度 */,R1/* 矩形上半截高度 */,R2/* 下半截高度 */){
    var x1 , y1 , x2 , y2 , x3 , y3 , x4 , y4
      , x5 , y5 , x6 , y6 , x7 , y7 , x8 , y8

    x1 = x - w/2 , y1 = y - R1 , x2 = x + w/2 , y2 = y - R1
    x3 = x + w/2 , y3 = y - r , x4 = x + w/2 , y4 = y + r
    x5 = x + w/2 , y5 = y + R2 , x6 = x - w/2 , y6 = y + R2
    x7 = x - w/2 , y7 = y + r , x8 = x - w/2 , y8 = y - r

    // var pa = ["M",x1,y1,"L",x2,y2,"L",x3,y3,"A",r,r,0,0,1,x4,y4,'L',x5,y5,'L',x6,y6,'L',x7,y7,'A',r,r,0,1,1,x8,y8,'Z']
    var pa = ["M",x1,y1,"L",x2,y2,"L",x5,y5,'L',x6,y6,'z']
      , ps = pa.join(',')
    ps += getCirclePath(x,y,5)
    return paper.path(ps)
  }
  // eg:
  // var pointer = pointer3(paper,100,100,5,3,70,15)
  // pointer.attr({'fill':'blue',"stroke":"blue"})

  // see http://www.irunmywebsite.com/raphael/additionalhelp.php?q=circlepath
  function getCirclePath(x , y, r){
	  var s = "M";
	  s = s + "" + (x) + "," + (y-r) + "A"+r+","+r+",0,1,1,"+(x-0.1)+","+(y-r)+"z";
	  return s;
  }

  return Pointer
})
