# Overview
两种油表:
1. 适量绘制刻度
2. 纯图片实现：表盘是一张图片，指针也是一张图片，推荐这种使用方式，需要视觉提供哦那个合适的图片尺寸。参见下面的 [demo1](http://charts.kissyui.com/demos/1.2/demo/dashboard/dashboard-theme-red.html) 、[demo2](http://charts.kissyui.com/demos/1.2/demo/dashboard/dashboard.html)

# Demo
- [demo1](http://charts.kissyui.com/demos/1.2/demo/dashboard/dashboard-theme-red.html)
- [demo2](http://charts.kissyui.com/demos/1.2/demo/dashboard/dashboard.html)

# 配置项

## renderTo
绘制到的dom容器

## width
仪表盘宽度

## height
仪表盘高度

## ticks
刻度配置，仅对矢量的码表适用。示例配置：

```
ticks : {
  r1:85,       //粗刻度的起始半径
  r2:90,       //细刻度的起始半径
  R:95,        //末半径
  start:0,     //初始弧度
  end:Math.PI, //末弧度
  n:30,        //分成的份数
  m:5,         //粗线的规则 TODO:可以是函数
  thickStyle:{ // 粗刻度样式
    "stroke":'red'
  },
  thinStyle:{  // 细刻度样式
    "stroke":'#666'
  }
}
```

## pointer
指针配置，进对矢量的码表适用，示例：

```
pointer:{
  theme:{
	name:'a',
	fill:'red',
	stroke:'#999',
	r:8,       // 圆头半径
	R:80       // 指针半径
  }
}
```

# method

## pointTo
指针指向某个度数
