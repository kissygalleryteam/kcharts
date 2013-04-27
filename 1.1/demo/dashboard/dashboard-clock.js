// -*- coding: utf-8; -*-
KISSY.use('gallery/kcharts/1.1/dashboard/index',function(S,DashBoard){
  var dashboard = new DashBoard({
    renderTo:'#container'
  , width : 358
  , height : 358

  , background:{
    src:'circle.jpg',
    width:358,
    height:358,
    cx:358/2,
    cy:358/2
  }
  , ticks : {
    r1:85,         //粗刻度的起始半径
    r2:90,         //细刻度的起始半径
    R:95,          //末半径
    start:0,       //初始弧度
    end:2*Math.PI, //末弧度
    n:60,          //分成的份数
    m:5,            //粗线的规则 TODO:可以是函数
    thickStyle:{ // 粗刻度样式
      "stroke":'#333'
    },
    thinStyle:{ // 细刻度样式
      "stroke":'#666'
    }
  }
  , pointer:{
    cx:0, // 指针转动轴偏离中心位置
    cy:0, // 指针转动轴偏离中心竖直想象移动0px
    theme:{
      name:'a',
      fill:'blue',
      stroke:'#999',
      r:8, // 圆头半径
      R:80 // 指针半径
    }
  }
  })
  var effect = {
    easing:'elastic'
  , ms:1000
  , callback:S.noop
  }

  dashboard.pointTo(60,effect)

  S.one('#change').on('click',function(){
    dashboard.pointTo(Math.random()*360,effect)
  })

});

