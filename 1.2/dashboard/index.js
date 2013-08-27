// -*- coding: utf-8; -*-
/**
 * 仪表盘
 * @author cookieu@gmail.com
 */
KISSY.add('gallery/kcharts/1.2/dashboard/index',function(S,Raphael,Pointer,PicturePointer,Ticks){
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
 * */