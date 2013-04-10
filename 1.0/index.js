(function(S){

    var $ = S.all,
        Evt = S.Event;

    S.config({
      combine:true,
      packages:[
        {
          name:"gallery",
          tag:"20130329",
          path:"http://a.tbcdn.cn/s/kissy/",
          charset:"utf-8"
        }
      ]
    });
    
    var themeCls = "ks-chart-default";

    var xGrids = {css:{borderLeft:"1px solid #f7f7f7"}};

    var xAxis = {
                  text:['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
                };

    var series = [
        {
            data:[{y:400,week:'星期一'},{y:1000,week:'星期二'},{y:400,week:'星期三'},{y:800,week:'星期四'},{y:2000,week:'星期五'},{y:100,week:'星期六'},{y:600,week:'星期日'}],
            text:"Tom"
        },
        {
            data:[{y:800,week:'星期一'},{y:1500,week:'星期二'},{y:4200,week:'星期三'},{y:4000,week:'星期四'},{y:2900,week:'星期五'},{y:2000,week:'星期六'},{y:2000,week:'星期日'}],
            text:"Andy"
        },
        {
            data:[{y:1200,week:'星期一'},{y:300,week:'星期二'},{y:2200,week:'星期三'},{y:400,week:'星期四'},{y:900,week:'星期五'},{y:300,week:'星期六'},{y:500,week:'星期日'}],
            text:"John"
        }
      ];

    var yGrids = {css:{"border-top":"1px dashed #eee"}};

    var tip = {
        template:"总支出<br/><span>{{y}}</span> 元"
    };

 S.use(
  'gallery/kcharts/1.0/linechart/index'+
  ',gallery/kcharts/1.0/barchart/index'
  ,function(S,LineChart,BarChart){
  var __initCharts = S.buffer(
    initCharts
  ,200,this);

  __initCharts(themeCls);

  $("a",$(".J_nav")).on("click",function(e){
      e.preventDefault();
      $(".ks-chart-wrapper").html("");
      __initCharts(e.target.innerHTML);
  });



  function initCharts(themeCls){

    new LineChart({
      renderTo:"#J_line1",
     canvasAttr:{
        height:120,
        width:480,
        x:50,
        y:50
      },
       legend:{
        isShow:true
      },
      anim:{},
       yGrids:yGrids,
      xGrids:xGrids,
      themeCls:themeCls,
      title:{
              content:"简单线图",
              css:{
              }
            },
            subTitle:{
              content:"simple linechart",
              css:{

              }
            },
      xGrids:{
        // isShow:false
      },
      xAxis: xAxis,
             yAxis:{
                    min:0
             },
      pointLines:{
          isShow:true
      },
      series:[series[0]],
      defineKey:{
        x:"week",
        y:"y"
      },
      tip:{
        template:"{{y}}元",
        css:{
          background:"#f7f7f7"
        },
        alignX:"right",
        alignY:"bottom",
        offset:{
          x:-10,
          y:-10
        },
        boundryDetect:true
      }
    });
  
    new LineChart({
      renderTo:"#J_line2",
     canvasAttr:{
        height:120,
        width:480,
        x:50,
        y:50
      },
       legend:{
        isShow:true
      },
      anim:{},
       yGrids:yGrids,
      xGrids:xGrids,
      themeCls:themeCls,
      title:{
              content:"多线图",
              css:{
              }
            },
            subTitle:{
              content:"multiple linechart",
              css:{

              }
            },
      comparable:true,
      xGrids:{
        // isShow:false
      },
      xAxis: xAxis,
             yAxis:{
                    min:0
             },
      pointLines:{
          isShow:true
      },
      series:series,
      defineKey:{
        x:"week",
        y:"y"
      },
      tip:{
        template:"{{#each datas as data index}}{{#if index == 0}}<h3 class='tip-title'>{{data.week}}</h3>{{/if}}<span style='color:{{data.color}}'>{{data.text}} <span class='num'>{{data.y}}</span> <span class='unit'>元</span></span><br/>{{/each}}",
        css:{
          background:"#f7f7f7"
        },
        alignX:"right",
        alignY:"bottom",
        offset:{
          x:-10,
          y:-10
        },
        boundryDetect:true
      }
    });

    new BarChart({
      renderTo:"#J_bar1",
      anim:{},
       themeCls:themeCls,
      canvasAttr:{
        height:120,
        width:480,
        x:50,
        y:50
      },
      title:{
              content:"简单柱形图",
              css:{
              }
            },
            subTitle:{
              content:"simple barchart",
              css:{

              }
            },
       xAxis: xAxis,
            yAxis:{
              min:0
            },
            bars:{
              css:{
              }
            },
       series:[series[0]],
      defineKey:{
        x:"week",
        y:"y"
      },
       xGrids:xGrids,
      yGrids:yGrids,
       legend:{
        isShow:true
      },
       tip:{
        template:"总支出<br/><span>{{y}}</span> 元",
        alignX:"right",
        css:tip.css,
        offset:{
          y:-10
        }
      }
    });

    new BarChart({
      renderTo:"#J_bar2",
      anim:{},
       themeCls:themeCls,
      canvasAttr:{
        height:120,
        width:480,
        x:50,
        y:50
      },
      title:{
              content:"多柱形图",
              css:{
              }
            },
            subTitle:{
              content:"multiple barchart",
              css:{

              }
            },
       xAxis: xAxis,
            yAxis:{
              min:0
            },
            bars:{
              css:{
              }
            },
       series:series,
      defineKey:{
        x:"week",
        y:"y"
      },
       xGrids:xGrids,
      yGrids:yGrids,
       legend:{
        isShow:true
      },
       tip:{
        template:"总支出<br/><span>{{y}}</span> 元",
        alignX:"right",
        css:tip.css,
        offset:{
          y:-10
        }
      }
    });

  }

  });

})(KISSY);