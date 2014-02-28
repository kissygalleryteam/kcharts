---
快速上手——以linechart为例
---
[linechart demo](http://jsbin.com/IbEcOkoX)

```

KISSY.use("gallery/kcharts/1.2/linechart/index",function(S,LineChart){
  var linechart = new LineChart({
      renderTo:"#demo1",
      title:{
         content:"1周消费记录"
      },
      anim:{},
      subTitle:{
         content:"week fee record"
      },
      xAxis: {
          text:['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
      },
      yAxis:{
        min:0
      },
      series:[
      {
          data:[100,4000,200,400,144,234,700]
      }],
      tip:{
        template:"总支出：<span>{{y}}</span> 元<br/>"
      }
  });
});

```

##KCharts首页
- [KCharts 官网](http://kcharts.net)
- [KCharts 内网](http://kcharts.taobao.net)

##Demo

- [demo中心（内网）](http://kcharts.taobao.net/demo.php)

##组件文档

###core

- [linechart 折线图](linechart.html)
- [datetime 线图(大数据量)](datetime.html)
- [barchart 柱状图](barchart.html)
- [piechart 饼图](piechart.html)
- [scatterchart 散点图](scatterchart.html)
- [mapchart 地图](mapchart.html)
- [dashboard 油表](dashboard.html)
- [ratiochart](ratiochart.html)
- [sumdetailchart](sumdetailchart.html)
- [radar 雷达图](radar.html)

###gallery

- [funnel 漏斗图](funnel.html)
- [trianglechart 三角形图](trianglechart.html)
- [pyramid 金字塔](pyramid.html)

###widget

- [htmlpaper html画布](htmlpaper.html)
- [legend 图例](legend.html)
- [tip 移动标注](tip.html)
