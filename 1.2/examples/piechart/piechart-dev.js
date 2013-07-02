// -*- coding: utf-8; -*-
KISSY.use('gallery/kcharts/1.2/raphael/index,gallery/kcharts/1.2/piechart/index',function(S,Raphael,PieChart){

  PieChart || (PieChart = S.KCharts.PieChart);

  function helperRand(a,b){
    return Math.floor(Math.random()*(b-a+1)+a);
  }

  var data
    , colors = []
    , groupcolor

  // 数据分为3组
  data = [[{data:4,label:'A'},{data:3,label:'R'},{data:2,label:'R'},{data:1,label:'R'}],
          [{data:2,label:'K'},{data:4,label:'K'},{data:2,label:'K'}],
          [{data:4,label:'K'},{data:4,label:'K'},{data:4,label:'K'}]
         ]

  // http://jsbin.com/irekob/1/
  var shadecolors = ['#bb0000','#ee0000','#ff0808','#ff2222','#ff3c3c','#ff5555','#ff6e6e','#ff8888','#ffa2a2','#ffbbbb','#ffd5d5','#ffeeee'];

  var lastcolor = shadecolors[shadecolors.length-1];

  // 分组的颜色必须和上面的组数一致
  groupcolor = []
  var colorindex = 0;
  for(var i=0,l=data.length;i<l;i++){
    if(S.isArray(data[i])){
      groupcolor.push({DEFAULT:shadecolors[colorindex] || lastcolor});
      colorindex++;
      for(var j=0,ll=data[i].length;j<ll;j++){
        colors.push({DEFAULT:shadecolors[colorindex] || lastcolor});
        colorindex++;
      }
    }else{
      data[i].DEFAULT = shadecolors[colorindex];
      colorindex++;
    }
  }

  var piechart = new PieChart({
    renderTo:'#canvas',
    cx:150,
    cy:150,
    R:100,
    r:80,
    data:data,
    colors:colors,
    groupcolor:groupcolor, // 分组颜色
    grouplabel:['第一组','第二组','第三组'],
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

