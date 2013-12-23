# HtmlPaper

---
Method（方法）
---

### text(x,y,str,h_align,v_align) 插入文本，返回NodeList
- `x` {number} 横坐标
- `y` {number} 纵坐标
- `str` {string} 文本或html
- `h_align` {string} 可选，水平对齐方式 可选参数有："left","right","center" 
- `v_align` {string} 可选，垂直对齐方式 可选参数有："top","middle","bottom"

```
  //example
  ...
  var paper = linechart.getPaper(); //获取html画布
  paper.text(0,100,"这个是文本","left","top").css({color:"red"});//插入文本

```

### rect(x,y,w,h) 插入矩形
- `x` {number} 横坐标
- `y` {number} 纵坐标
- `w` {number} 宽度
- `h` {number} 高度

```
  //example
  ...
  var paper = linechart.getPaper(); //获取html画布
  paper.rect(0,100,200,200).css({border:"1px solid red"});//插入矩形

```

### lineX(x,y,len) 画横线
- `x` {number} 横坐标
- `y` {number} 纵坐标
- `len` {number} 长度

```
  //example
  ...
  var paper = linechart.getPaper(); //获取html画布
  paper.lineX(0,100,200).css({border-top:"1px solid red"});

```

### lineY(x,y,len) 画竖线
- `x` {number} 横坐标
- `y` {number} 纵坐标
- `len` {number} 长度

```
  //example
  ...
  var paper = linechart.getPaper(); //获取html画布
  paper.lineY(0,100,200).css({border-left:"1px solid red"});

```

### clear() 清除画布上所有内容

```
  //example
  ...
  var paper = linechart.getPaper(); //获取html画布
  ...
  paper.clear();  //清除画布

```
