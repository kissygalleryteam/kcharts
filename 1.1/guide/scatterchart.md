# ScatterChart
---
Demo
---
[scatter](../demo/scatterchart/demo1.html) 散点图<br/>
[bubble](../demo/scatterchart/demo2.html) 气泡图<br/>

---
代码示例
---
```
//配置kissy包路径
KISSY.config({
  packages:[
      {
        name:"gallery",
        path:"http://a.tbcdn.cn/s/kissy/"
      }
    ]
});
//载入linechart
KISSY.use('gallery/kcharts/1.1/scatterchart/index',function(S,ScatterChart){

  var scatterchart = new ScatterChart({
            renderTo:"#demo1",
            title:{
                content:"散点图"
            },
            subTitle:{
                content:"scatterchart"
            },
            xGrids:{
                isShow:false
            },
            xAxis: {
                num:20
             },
             yAxis:{
                    num:10
             },
            series: series, //如 [[100,200],[420,44] .... ] 这样的数据
            points:{
                "strick-width":"2px",
                fill:"#000"
            },
            tip:{
                template:function(data){
                    return data.y[0]+","+data.y[1];
                },
                css:{
                    border:"3px solid {COLOR}"
                },
                alignX:"right",
                alignY:"bottom",
                offset:{
                    x:-10,
                    y:-10
                },
                boundryDetect:true
            },
            legend:{
                        isShow:true
            }
        });
  
});
```

---
Config（详细配置）
---
### renderTo  

{ id|HTMLElement } 容器 <span style='color:#f60'>注:容器必须要有width和height的绝对值</span>

### autoRender

{ boolean } 是否自动渲染 如果为手动 则需要调用 render()方法

### canvasAttr

{ object } 设置图形区域位于容器的位置以及尺寸

  - `x` { number } 水平距离
  - `y` { number } 垂直距离
  - `width` { number } 宽度
  - `height` { number } 高度 

### themeCls 

{ string } 主题className 默认："ks-chart-default"

### colors 

{ array } 手动配置颜色 （可选） 如 [{"DEFAULT":"#fff","HOVER":"#ccc"},{"DEFAULT":"#fff","HOVER":"#ccc"}]
  
  - `DEFAULT` { string } 默认颜色
  - `HOVER` { string } hover颜色

### title

{object} 主标题

- `isShow` { boolean } 是否渲染显示
- `css` { object } css样式
- `content` { string } 内容 可以是html或者text文本

### subTitle

{object} 副标题 同 title

### points

{object} 点的配置

   - `attr` { object } 默认样式
      >- `stroke` { string } 笔触颜色  如:"#ccc"
      >- `r` { number } 圆点半径
      >- `fill` { string } 填充色
      >- `stroke-width` { number } 笔触宽度
   - `hoverAttr` { object } hover样式 同attr

### xAxis 

{object} x 轴配置

   - `isShow` { boolean } 是否展示
   - `css` { object } css样式
   - `min` { number } 横坐标最小值
   - `max` { number } 横坐标最大值
   - `num` { number } 横轴刻度的份数

### yAxis

{object} y 轴配置 

   - `isShow` { boolean } 是否展示
   - `css` { object } css样式
   - `min` { number } 纵坐标最小值
   - `max` { number } 纵坐标最大值
   - `num` { number } 纵轴刻度的份数


### xGrids

{object} 横向网格配置 

- `isShow` { boolean } 是否展示
   - `css` { object } css样式

### yGrids

 {object} 纵向网格配置 

 - `isShow` { boolean } 是否展示
   - `css` { object } css样式

###  xLabels

   {object} x轴刻度文本

- `isShow` { boolean } 是否渲染显示
- `css` { object } css样式
- `template` { number | function } 输出的html文本 

  建议使用function方式  返回分别是index和text 
  ```
  template:function(index,text){
      if(index % 7 == 0){ //每隔7个输出一次
        return text;
      }else{
        return "";
      }
  }

  ```

###  yLabels

 {object} y轴刻度文本 同 xLabels

### series
   
   {array} 数据

```

  //example 普通散点图
  series:[
      [190.5, 108.6], [177.8, 86.4], [190.5, 80.9], [177.8, 87.7], [184.2, 94.5]
  ]

  //example 气泡图 
   series:[
      [190.5, 108.6,2], [177.8, 86.4,1], [190.5, 80.9,3], [177.8, 87.7,4], [184.2, 94.5,2] //数组中第三个参数代表气泡的半径大小
  ]

```

### tip  

  {object} 数据提示层配置

   - `template` { string } 文本或者是模板 详见KISSY.Template
   - `css` { object } css样式  注:"{COLOR}" 默认选择线的颜色，如{"border-color":"{COLOR}"}
   - `anim` { object } 动画配置 "easing" 和 "duration" 如 {easing:"easeOut",duration:0.3} 
   - `offset` { object } tip的偏移量 "x" 和 "y" 如 {x:100,y:40}
   - `boundryDetect` { boolean } 是否进行边缘检测
   - `alignX` { string } 水平对齐方式 有"left" "center" "right"三种 默认 "left"
   - `alignY` { string } 水平对齐方式 有"top" "middle" "bottom"三种 默认 "top"

  
### legend

  {object} 图例配置
  
  - `isShow` { boolean } 是否渲染显示
  - `css` { object } css样式
  - `layout` {string} 垂直或水平展示 可选："horizontal" 水平  "vertical" 垂直
  - `align`  {string} 水平对齐方式 可选："left" 左对齐 "center" 居中 "right" 右对齐
  - `verticalAlign` {string} 垂直对齐方式 可选："top" 顶部对齐 "middle" 垂直居中 "bottom" 底部对齐


---
Method（方法）
---

### render()

渲染图表

### getPaper()

获取html画布 详见：[HtmlPaper文档](./htmlpaper.html)

### data2GrapicData(data,isY,nagitive)

根据实际数据 获取相应轴上的偏移像素
```
    /*
      TODO 将实际数值转化为图上的值
      @param data {Array|Number} 实际数值
      @param isY  {Boolean} 可选，是否是纵向的(默认值：false) 
      @param nagitive 可选，是否是反向的(默认值：false)
    */

    var   scatterchart = new ScatterChart(cfg); 
    var   y =  scatterchart.data2GrapicData(400); //将返回一个纵轴坐标值
    scatterchart.getPaper().text(0,y,"400");//往图上写html文本

```

### showPoints(pointIndex)

展示散点组

### hidePoints(pointIndex)

隐藏散点组

### clear()

清除画布上的所有内容

---
Event（事件）
---

### afterRender

渲染完毕后

### paperLeave

离开画布 (可以用来触发隐藏tip等动作)

### stockChange

点之间的切换 (可以用来触发tip的移动和数据渲染)
