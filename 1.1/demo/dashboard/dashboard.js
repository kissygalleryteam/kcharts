// -*- coding: utf-8; -*-
KISSY.use('gallery/kcharts/1.1/dashboard/index',function(S,DashBoard){
  var dashboard = new DashBoard({
    renderTo:'#container'
  , width : 358
  , height : 358
  , background:{ // 采用图片背景配置
    src:'circle.jpg',
    width:358,
    height:358,
    cx:358/2,
    cy:358/2
  }
  , pointer:{
    src:'pointer.jpg', //TODO:可以传入data-uri
    width:26,
    height:212,
    cx:13,
    cy:180
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

