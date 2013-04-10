// -*- coding: utf-8; -*-
KISSY.use('gallery/kcharts/1.1/piechart/index',function(S,PieChart){
  function helperRand(a,b){
    return Math.floor(Math.random()*(b-a+1)+a);
  }
  var data = [{data:30,label:'You'},{data:30,label:'Me'},{data:40,label:'Her'}]

  var piechart = new PieChart({
    renderTo:'#canvas',
    cx:150,
    cy:150,
    R:100,
    data:data,
    anim:{
      type:'sector',
      easing:'bounceOut',
      duration:1000
    }
  });

  piechart.on('click',function(e){
    var sector = e.target
      ,unit = 10
    piechart.transformSector(sector,unit);
  });
});

