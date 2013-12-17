# BarChart
---
Demo
---
[basic column](../demo/barchart/demo1.html) 纵向柱形图<br/>
[stack column](../demo/barchart/demo2.html) 纵向堆叠柱形图<br/>
[stack bar](../demo/barchart/demo3.html) 横向堆叠柱形图<br/>
[multi column](../demo/barchart/demo4.html) 纵向多柱形图<br/>
[label width units](../demo/barchart/demo5.html) 有单位和标注的柱形图<br/>
[bar with rotated labels](../demo/barchart/demo6.html) 有倾斜标注的柱形图<br/>

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
//载入barchart
KISSY.use('gallery/kcharts/1.2/barchart/index',function(S,BarChart){
  var barChart = new BarChart({
        renderTo:"#demo1",
        xAxis: {
            text:['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
        },
        series:[
          {
            data:[100,4000,120,234,234,234,234]
          }
        ],
        tip:{
          template:"总支出：<span>{{y}}</span> 元<br/>"
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

{ array } 手动配置线的颜色 （可选） 如 [{"DEFAULT":"#fff","HOVER":"#ccc"},{"DEFAULT":"#fff","HOVER":"#ccc"}]
    - `DEFAULT` { string } 默认颜色
    - `HOVER` { string } hover颜色

### stackable  
{boolean} 是否堆叠展示  <em class="high-light">new!</em>
 
### zoomType  
{string} 横向/纵向柱形图  （可选） 默认 "x" 或 "y" <em class="high-light">new!</em> 

### title

{object} 主标题


   - `isShow` { boolean } 是否渲染显示
   - `css` { object } css样式
   - `content` { string } 内容 可以是html或者text文本

### subTitle

{object} 副标题 同 title

### bars
  
柱形属性配置 

   - `isShow` { boolean } 是否渲染显示
   - `css` { object } css样式
   - `barsRatio` { float } 一组柱形的占宽 0 ~ 1之间的数  <em class="high-light">new!</em>
   - `barRatio` { float } 单根柱形的占宽 0 ~ 1之间的数   <em class="high-light">new!</em>

### xAxis 

{object} x 轴配置

   - `isShow` { boolean } 是否渲染显示
   - `css` { object } css样式

### yAxis 

{object} y轴配置

   - `isShow` { boolean } 是否渲染显示
   - `css` { object } css样式
   - `min` { number } 纵坐标最小值
   - `max` { number } 纵坐标最大值
   - `num` { number } 纵轴刻度的份数

### xGrids

{object} 横向网格配置 
  
   - `isShow` { boolean } 是否渲染显示
   - `css` { object } css样式

### yGrids

 {object} 纵向网格配置

  - `isShow` { boolean } 是否渲染显示
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
   
   {array} 数据 （有两种格式）

   ```
   series:[{
                text: 'Tokyo',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }, {
                text: 'New York',
                data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
            }
            , {
                text: 'Berlin',
                data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
            }, {
                text: 'London',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }
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

### comparable

  {boolean} 是否为多线比较，公用tip数据 默认false

### anim
  
  {object} 渲染动画配置 配置该项则具有动画效果
  
   - `duration` { number } 动画周期
   - `easing` { object } 动画效果 默认"easeIn"
   
### legend

  {object} 图例配置
  
  - `isShow` { boolean } 是否渲染显示
  - `css` { object } css样式
  - `x` { number } 水平偏移量
  - `y` { number } 垂直偏移量
  - `layout` {string} 垂直或水平展示 可选："horizontal" 水平  "vertical" 垂直
  - `align`  {string} 水平对齐方式 可选："left" 左对齐 "center" 居中 "right" 右对齐
  - `verticalAlign` {string} 垂直对齐方式 可选："top" 顶部对齐 "middle" 垂直居中 "bottom" 底部对齐

### colorhook
   {function} 颜色钩子函数，返回一个包含`DEFAULT`和`HOVER`的颜色对象，函数的参数如下：
   
```
colorhook:function(groupIndex,barIndex,originalColorObject){
  // groupIndex,   barIndex, originalColorObject
  // 柱状图组编号，柱状编号，默认颜色对象
  return {
    "DEFAULT": 'blue', // 这里可以根据groupIndex，或者barIndex重新计算一个合法的颜色值
    'HOVER': 'yellow'
  }
}
```
   [使用示例](https://github.com/kissygalleryteam/kcharts/blob/master/1.2/demo/barchart/demo7.html#L76-L85)

---
Method（方法）
---

### render()

渲染图表

### getRaphaelPaper()

获取矢量画布 详见：[Raphael文档](http://raphaeljs.com/reference.html)

### getHtmlPaper()

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

    var   barchart = new BarChart(cfg); 
    var   y =  barchart.data2GrapicData(400); //将返回一个纵轴坐标值
    barchart.getPaper().text(0,y,"400");//往图上写html文本

```


### clear()

清除画布上的所有内容


---
Event（事件）
---

### afterRender

渲染完毕后

### paperLeave

离开画布 (可以用来触发隐藏tip等动作)

### barChange

柱之间的切换 (可以用来触发tip的移动和数据渲染)

### barClick

柱的点击事件 



