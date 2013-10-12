# trianglechart

---
Demo
---
[三角形图](../demo/trianglechart/demo1.html) <br/>

---
代码示例
---
```
//载入trianglechart
KISSY.use('gallery/kcharts/1.2/trianglechart/index',function(S,Trianglechart){
  var trianglechart = new Trianglechart({
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

### title

{object} 主标题

- `isShow` { boolean } 是否渲染显示
- `css` { object } css样式
- `content` { string } 内容 可以是html或者text文本

### subTitle

{object} 副标题 同 title


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
   
   {array} 数据
   
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

    var   trianglechart = new Trianglechart(cfg); 
    var   y =  Trianglechart.data2GrapicData(400); //将返回一个纵轴坐标值
    trianglechart.getPaper().text(0,y,"400");//往图上写html文本

```


### clear()

清除画布上的所有内容

---
Event（事件）
---

### afterRender

渲染完毕后

### paperLeave

离开画布

