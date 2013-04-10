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
    n:30,          //分成的份数
    m:5            //粗线的规则 TODO:可以是函数
  }
  , pointer:{
    cy:30
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

