// -*- coding: utf-8; -*-
KISSY.use('gallery/kcharts/1.1/piechart/index',function(S,PieChart){
  function helperRand(a,b){
    return Math.floor(Math.random()*(b-a+1)+a);
  }
  var data = [{data:30,label:'30%','tip':'per'},{data:30,label:'30%','tip':'per'},{data:40,label:'40%','tip':'percent'}]
    , colors = [{DEFAULT:'red'},{DEFAULT:'green'},{DEFAULT:'blue'}]

  data = [{data:30,label:'30%','tip':'per'}]

  var piechart = new PieChart({
    renderTo:'#canvas',
    cx:150,
    cy:150,
    R:100,
    // r:80,
    data:data,
    colors:colors,
    labelIndside:false, //label不标注在扇形内
    anim:{
      type:'sector',
      easing:'bounceOut',
      duration:1000
    },
    tip:{
      boundryDetect:true,
      tpl:"{{tip}} {{percent*100+'%'}}"
    }
  });
});

