# PieChart

## Demo
- [自适应容器尺寸](../demo/piechart/pie-auto-resize.html) 
- [自适应容器尺寸面包圈](../demo/piechart/pie-auto-resize-donut.html) 
- [浏览器市场占有率](../demo/piechart/pie-bs.html) 
- [简单饼图](../demo/piechart/pie-simple.html)
- [饼图中间自定义文本或图片](../demo/piechart/pie-center-text.html)
- [无边框的饼图](../demo/piechart/pie-without-border.html)

## 配置

### rs 饼图半径
如果是面包圈或者嵌套的饼图时，存在多个r，配置项为一个数组，且由内到外半径z值要逐渐增大，如下的示例配置

配置示例:

```
rs:[60,80]
```
注：当为简单饼图是，rs为可选配置，组件会为您自动生成一个半径值

### series

饼图成分数据，格式为嵌套的数组数据，比如

```
       [{
          color:"#78a5da",
          label:"Trident",
          data:3
        },{
          color:"#d26e6b",
          label:"Getko",
          data:3
        },{
          color:"#ffa2a2",
          label:"Chrome",
          data:4
        }]
```

每一条数据可以包含一下配置

```javascript
{ 
  color:"#78a5da",
  sectorcfg:{
    "stroke":"yellow", // 扇形边框颜色
	"stroke-width":2   // 扇形边框宽度
  },
  label:"Trident",
  data:3
}
```

### anim
动画配置

 - `easing` {string} 扇形展开动画效果。同kissy的动画配置
 - `duration` {number} 动画时长，单位秒

## title （可选）
 - title.content 标题内容
 - title.offset [offsetx,offsety] x,y方向上的偏移量，
 - title.align title排列方向，可选值为 "left"、"right"、"center"，默认"center"

 示例 ：
```
title: {
  content: '<div class="kcharts-title">浏览器市场占比</div>',
  offset: [0, 0],
  align: "center"
}
```

### interval
多级面包圈的间隔，只对面包圈图有效。

当series数据嵌套情况会自动生成面包圈图。示例：demo/piechart/pie-nest.html

### padding

label连线的间隔

### labelfn

饼图label文案生成函数

```
      labelfn:function(txt,sector,pie){
        var framedata = sector.get("framedata")
          , percent = (framedata.percent*100).toFixed(2)+"%"
        return txt+":<span class='kcharts-donut-percent'>"+percent+"</span>";
      }
```

### cx 可选
饼图中心点x

### cy 可选
饼图中心点y

### renderTo
渲染到的容器

### label 可选
是否显示label。默认显示

### tip 可选

tip配置，同其它图表，示例：

```
{
  isShow:true,
  template:"donutIndex:{{donutIndex}},groupIndex-{{index}},label-{{label}},所占比例-{{percent}}",
  css:{
    "font-size":'14px'
  }
}
```

template可以为函数，参数为 `donutIndex,groupIndex,label,percent`

### autoLabelPathColor 可选，默认为true

label曲线路径是否自动为为扇形的颜色

值为 `true` 或 `false`

### filterfn {Function}

[使用filterfn的对比的demo](http://jsbin.com/AQecEVew)

饼图数据过滤函数 <em class="high-light">new!</em>

当比例小于 0.1 时，默认将这些小数据合并为一个"其它"的数据想，"其它"这个文案也是可以配置的

当 `combineSmallData` 为 `false` 时，表示将小数据丢弃

```
filterfn:function(data,percent){
  return percent>0.1;
},
combineSmallData:true, // 是否合并小数据，默认为true，即合并小数据为“其它”
smallDataLabel:"other", // 小数据合并为 "其它" 文案，默认为"其它"，这里配置为 "other"，combineSmallData:true此配置才生效
```
### combineSmallData {Bool}
[使用combineSmallData 的 demo](http://jsbin.com/AQecEVew)

是否合并小数据

### smallDataLabel
小数据合并为 "其它" 的文案，默认为 "其它"
[使用combineSmallLabel 的 demo](http://jsbin.com/AQecEVew)

### extraLabelHeight <em class="high-light">new!</em>
[扩展label高度的demo](http://jsbin.com/OlApukA)

扩展label展示区域的高度 。因为，当label文案较多的时候，默认的label展示区域是圆饼的上下距离，可能放不下太多label，当放不下时，会不展示较小数据的label。这个配置能扩展圆饼的上下距离，以放置下更多的label。

## piechart 方法

### setConfig(config)

用于更新pie的配置，`config`是一个Object字段为配置项字段

### render()

重绘饼图  配合setConfig可以实现更改饼图数据展现的目的

### getConfig(field)
获取field配置

## piechart 实例属性

实例化后 `pie = new Pie(config)`，通过 `pie.get(propName)` 来获取

### `cx`

### `cy` 

### `paper`

Raphael画布实例

### `width`
饼图容器宽度

### `height`
饼图容器高度

### `innerWidth`
饼图内部绘制区域宽度

### `innerHeight`
饼图内部绘制区域高度

### `container`
饼图所在的容器 ，是一个 KISSY `Node` 实例

### `series`
piechart占比数据

### `$sectors`
所有的扇形 为一个 Raphael 集合 `set`

你可以这样使用：

```
var sectors = pie.get("set");
sectors.attr({"fill":"#f60"}); // sectors是一个类似数组的封装对象，可以调用Raphael element 的方法
```

### `groups`
扇形嵌套分组 为一个 Raphael `set`

### `set` 
扇形同级分组 为一个 Raphael `set`

### `legend`
 - `isShow` 是否显示legend
 - `offset` 偏移量
 
简单配置如下

```
"legend": {
  align: "bc",
  offset: [0, 25],
  spanAttrHook: function (index) {
                  return {
                    color: "#333"
                  }
                }
}
```
更多配置参看[legend文档](./legend.html)


## 扇形属性

### 获取

当通过监听扇形的事件，能获取到扇形对象
```javascript
pie.on("mouseenter",function(e){
   var sector = e.sector;
})
```

或者通过上面的piechart属性来获取所有的扇形

sector具有下列属性

### `set`
这个扇形对应的垂直分组

### `group`
这个扇形对应的水平分组

### `middleangle`
扇形的角平分线对应的角度

### `sectorcx`
扇形的中心点横坐标

### `sectorcy`
扇形的中心点纵坐标

### `start`
扇形开始角度

### `end`
扇形结束角度

### `framedata`
扇形对应的数据

### `middlex`
扇形中线与边界交点坐标

### `middley`
扇形中线与边界交点坐标

### `$path`
扇形对应的路径 为一个 Raphael path对象


## `label` 属性

### 获取 `label` 属性
```javascript

 pie.on("labelclick",function(e){
   var sector = e.label
 });
```
### `el`
label对应的HTML元素 为一个 KISSY `Node`

### `x` 

### `y`

### `size`
label的大小，为一个 object，包含width和height属性

### `sector`
对应的sector

### `container`
容器


## 事件 Event 


### `mouseover`

```
pie.on('mouseover',function(e){
  // var sector = e.sector
  // sector.get("$path")
  // sector.get("middleangle") 
  // sector.get("middlex") 
  // sector.get("middley") 
  // sector.get("isleft")
  // sector.get("framedata")
  // sector.get("donutIndex")
  // sector.get("groupIndex")

  // 若渲染了label，可以通过sector.$label来获取对应的dom元素
});

```

### `mouseout`

### `click`

### `afterRender`

### `labelClick`

点击label时触发

```
    pie.on("labelclick",function(e){
      var sector = e.sector
      sector.fire("click");
    });
```
