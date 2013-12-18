# PieChart

## Demo
- [自适应容器尺寸](../demo/piechart/pie-auto-resize.html) 
- [自适应容器尺寸面包圈](../demo/piechart/pie-auto-resize-donut.html) 
- [浏览器市场占有率](../demo/piechart/pie-bs.html) 
- [简单饼图](../demo/piechart/pie-simple.html)
- [饼图中间自定义文本或图片](../demo/piechart/pie-center-text.html)
- [无边框的饼图](../demo/piechart/pie-without-border.html)

### rs
半径，对于面包圈图的半径为数组

### data
格式为嵌套的数组数据，比如
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

### interval
多级面包圈图之间的间隔，只对面包圈图有效。当data数据嵌套情况会自动生成面包圈图。示例：demo/piechart/pie-nest.html

### padding
label和饼图之前的填充

### labelfn
label生成函数

```
      labelfn:function(txt,sector,pie){
        var framedata = sector.get("framedata")
          , percent = (framedata.percent*100).toFixed(2)+"%"
        return txt+":<span class='kcharts-donut-percent'>"+percent+"</span>";
      }
```

### cx
饼图中心点x

### cy
饼图中心点y

### renderTo
渲染到的容器

### label
是否显示label。默认显示

### autoLabelPathColor label曲线路径是否自动为为扇形的颜色

`true` or `false`

---
piechart 实例属性
---
### `cx`

### `cy` 

### `paper`
Raphael画布

### `width`
宽度

### `height`
高度

### `container`
饼图所在的容器 KISSY Node 

### `data`
piechart对应的数据

### `$sectors`
所有的扇形 为一个 Raphael `set`

### `groups`
扇形嵌套分组 为一个 Raphael `set`

### `set` 
扇形同级分组 为一个 Raphael `set`


---
扇形属性
---
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

---
label 属性
---
### 获取
```javascript

 pie.on("labelclick",function(e){
   var sector = e.label
 });
```
### `el`
label对应的HTML元素 为一个 KISSY Node
### `x` 

### `y`

### `size`
label的大小，为一个 object，包含width和height属性

### `sector`
对应的sector

### `container`
容器

---
事件 Event 
---

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

### exmamples

 - 普通饼图、面包圈、嵌套的饼图 examples/all.html
 - 浏览器分布图 examples/pie-browser.html
 
