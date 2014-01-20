# Demo
- [主题一](../demo/dashboard/dashboard.html)
- [主题二](../demo/dashboard/dashboard-theme-red.html)

# properties

## renderTo
绘制到的dom容器

## width

## height

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
