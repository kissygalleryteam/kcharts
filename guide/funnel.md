# Funnel
---
Demo
---

[KCharts首页](http://www.kcharts.net) 


---
Config（详细配置）
---
###  

{ id|HTMLElement } 容器 

### chart
{ type }    声明组件的类型

{ marginRight } 漏斗距离整体容器的右边距 <em style="color:#ff0">注：以右边距为基准，确定这个容器的宽度</em>

### title

{ text }    标题 (默认居中)

{ color }    标题颜色 

### plotOptions 

{ dataLabels } tip模版 (以下是对应关系自动转化)

     - `title` { series.name } 

     - `name` { series.data[0] } 

     - `pointer` { series.data[1] } 

{ neckWidth }   脖子的宽度(以百分比为单位)

{ neckStep }    脖子的间距(以PX为单位)

{ neckHeight }  脖子的高度(以百分比为单位,从上至下的高度的百分比)

{ background }  默认的漏斗的背景颜色(从上至下)

{ backgroundHover }  默认的漏斗的背景颜色鼠标hover(从上至下)

### series 
{ name }    内容的标题

{ data }    数据

    -`data[0]` 数据标题

    -`data[1]` 数据数值


---
Method（方法）
---

### _render(arry)

渲染图表 (arry 计算实际在画布高度的数组数据)

### set(attrConfigs,value)

attrConfigs 支持 neckWidth,neckStep,neckHeight 的手动修改(如果改变其他的需要手动调用_rednderVal())


### destroy()

清除画布上的所有内容(但不包括foot,如果要清除，需要手动,支持回掉)

destroy(function(){

  console.log('我已经清楚了所有的画布内容')

})

---
Event（事件）
---

### pathClick

点击画布事件

