// -*- coding: utf-8; -*-
KISSY.use('gallery/kcharts/1.1/piechart/index',function(S,PieChart){
  // var data = [{data:30,label:'30%','tip':'per'},{data:30,label:'30%','tip':'per'},{data:40,label:'40%','tip':'percent'}]
  //   , colors = [{DEFAULT:'red'},{DEFAULT:'green'},{DEFAULT:'blue'}]

  /*
	var piechart = new PieChart({
		renderTo:'#canvas',
		// themeCls:"ks-chart-rainbow",
		cx:450,
		cy:180,
		R:100,
		data:data,
		anim:{
		  type:'sector',
		  easing:'bounceOut',
		  duration:1000
		},
		tip:{
		  boundryDetect:true,
		  tpl:"{{tip}} {{percent*100+'%'}}"
		},
		labelline:{
		  attr:{
			  stroke:"red"
		  }
		}
	});
  */


  var data = [{data:30,label:'30%','tip':'per'},{data:30,label:'30%','tip':'per'},{data:40,label:'40%','tip':'percent'}]

  var piechart = new PieChart({
    renderTo:'#canvas',
		cx:450,
		cy:180,
    // cx:150,
    // cy:150,
    R:100,
    data:data,
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

