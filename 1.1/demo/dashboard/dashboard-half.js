// -*- coding: utf-8; -*-
KISSY.use('gallery/kcharts/1.1/dashboard/index',function(S,DashBoard){
  function helperRand(a,b){
    return Math.floor(Math.random()*(b-a+1)+a);
  }

  var dashboard = new DashBoard({
    renderTo:'#container'
  , width : 358
  , height : 358

  , ticks : {
    r1:85,       //粗刻度的起始半径
    r2:90,       //细刻度的起始半径
    R:95,        //末半径
    start:0,     //初始弧度
    end:Math.PI, //末弧度
    n:30,        //分成的份数
    m:5,         //粗线的规则 TODO:可以是函数
    thickStyle:{ // 粗刻度样式
      "stroke":'red'
    },
    thinStyle:{  // 细刻度样式
      "stroke":'#666'
    }
  }
  , pointer:{
    theme:{
      name:'a',
      fill:'red',
      stroke:'#999',
      r:8,       // 圆头半径
      R:80       // 指针半径
    }
  }
  })
  var effect = {
    easing:'elastic'
  , ms:1000
  , callback:S.noop
  }

  dashboard.pointTo(45,effect)

  S.one('#change').on('click',function(){
    var deg = helperRand(0,180)
    dashboard.pointTo(deg,effect)
  })
});
