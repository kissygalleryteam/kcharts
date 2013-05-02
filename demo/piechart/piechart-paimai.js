// -*- coding: utf-8; -*-
KISSY.use('gallery/kcharts/1.0/piechart/index',function(S,PieChart){
  function helperRand(a,b){
    return Math.floor(Math.random()*(b-a+1)+a);
  }
  var $ = S.all

  var data = {
    items:[
      {
        container:'#J_pie1',
        data:[{data:1000},{data:1}],
        tip:{label:'申请认证',data:101}
      },
      {
        container:'#J_pie2',
        data:[{data:78},{data:101}],
        tip:{label:'通过',data:78}
      },
      {
        container:'#J_pie3',
        colors:[
          {DEFAULT:"#88B2C7"},
          {DEFAULT:"#D9D9D9"}
        ],
        data:[{data:15},{data:101}],
        tip:{label:'等待中',data:15}
      },
      {
        container:'#J_pie4',
        colors:[
          {DEFAULT:"#BEBEBE"},
          {DEFAULT:"#D9D9D9"}
        ],
        data:[{data:8},{data:101}],
        tip:{label:'失败',data:8}
      }
    ]
  }
  function initCharts(config){
    var piechart = new PieChart({
      renderTo:config.container,
      themeCls:'ks-chart-default',
      cx:65,
      cy:65,
      R:65,
      r:53,
      label:false,
      colors:config.colors||[
        {DEFAULT:"#44BAF5"},
        {DEFAULT:"#D9D9D9"}
      ],
      data:config.data,
      anim:{type:'sector',easing:'bounceOut',duration:1000}
    });

    var container=$(config.container);
    container.append('<span class="inner"><em>'+config.tip.data+'</em><br/>'+config.tip.label+'</span>');
    var _temp=$('.inner',container);
    _temp.css('margin-left',-_temp.width()/2);

    piechart.on('afterRender',function(){
      window.console && console.log('event::afterRender')
    })

  }

  // console.log(data.items[0])
  initCharts(data.items[0])
  initCharts(data.items[1])
  initCharts(data.items[2])
});

