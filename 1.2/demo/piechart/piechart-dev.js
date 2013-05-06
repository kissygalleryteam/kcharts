// -*- coding: utf-8; -*-
KISSY.use('gallery/kcharts/1.2/piechart/index',function(S,PieChart){

  PieChart || (PieChart = S.KCharts.PieChart);

  function helperRand(a,b){
    return Math.floor(Math.random()*(b-a+1)+a);
  }

  var data
    , colors = [{DEFAULT:'#cc0000'},{DEFAULT:'#990000'},{DEFAULT:'#660000'},{DEFAULT:'#330000'},{DEFAULT:'#110000'}]
    , groupcolor

  // 数据分为3组
  data = [[{data:1,label:'A',DEFAULT:'black'},{data:2,label:'R','tip':'per'}],
          [{data:3,label:'K'},{data:3,label:'K'}],
          [{data:3,label:'K'}]
         ]

  // 分组的颜色必须和上面的组数一致
  groupcolor = [{DEFAULT:'#dd0000'},{DEFAULT:'#aa0000'},{DEFAULT:'#770000'}]

  var piechart = new PieChart({
    renderTo:'#canvas',
    cx:150,
    cy:150,
    R:100,
    r:80,
    data:data,
    colors:colors,
    groupcolor:groupcolor, // 分组颜色
    labelIndside:false, //label不标注在扇形内
    anim:{
      type:'sector',
      easing:'swing',
      duration:800
    },
    tip:{
      boundryDetect:true,
      tpl:"{{(percent*100).toFixed(2)+'%'}}"
    }
  });
});

