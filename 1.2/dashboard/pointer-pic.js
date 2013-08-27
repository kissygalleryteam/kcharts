// -*- coding: utf-8; -*-
/**
 * 指针
 * @author cookieu@gmail.com
 * */
KISSY.add('gallery/kcharts/1.2/dashboard/pointer-pic',function(S,Pointer){
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
