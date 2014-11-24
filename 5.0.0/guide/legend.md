### 简介
新的图表可以考虑集成Legend

### 使用示例

使用legend需要了解的概念
- `bbox` 要定位的对象的盒子对象
- `container` legend定位相对的容器，容器的css必须为非静态定
位，必须是`relative` 、`absolute` 
- `paper` Raphael画布实例

下面是一个完整的实例， `J_Box` 相当于图表主区域，`J_Con` 相
当于图表容器

```
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="http://a.tbcdn.cn/p/global/1.0/global-min.css" />
    <title>lengend</title>
    <style type="text/css" media="screen">
     .con{width:500px;height:500px;border:1px solid #666;border-radius:3px;position:relative;}
     
     .box{
       border:1px solid #999;width:200px;height:200px;margin:50px 0 0 100px;
       position:absolute;
     }

     .clear-both{
       clear:both;
     }
    </style>        
  </head>
  <body>
    <div id="J_Con" class="con">
      <div id="J_Box" class="box">
      </div>
    </div>
    <script charset="utf-8" src="http://a.tbcdn.cn/s/kissy/1.3.0/kissy-min.js"></script>
    <script type="text/javascript">

KISSY.use("kg/kcharts/2.0.0/raphael/index,kg/kcharts/2.0.0/legend/index,dom,event",function(S,Raphael,Legend,D,E){
  var $con = S.one("#J_Con")
    , $box = S.one("#J_Box")
    , paper = Raphael($con[0],500,500)

  //传给legend的信息
  var box = {
    //获取图表主体相对于容器的信息
    getBBox:function(){
      var offsetc = D.offset($box)
        , offsetp = D.offset($con)
      return {
        width:$box.width(),
        height:$box.height(),
        left:offsetc.left - offsetp.left,
        top:offsetc.top - offsetp.top
      }
    }
  };

  //要添加legend的对象，这个对象必须具有一些如上定义的方法
  var $target = box;

  var lengend_cfg = {
    //legend需要的原始信息
    paper:paper,
    container:$con,
    bbox:$target.getBBox(),//图表主体的信息
    iconAttrHook:function(index){//每次绘制icon的时调用，返回icon的属性信息
      var fills = ["#094466","#145c8c","#1e88ba","#18aeed","#55cdff","#89d9fc"]
      return {
        fill:fills[index]
      }
    },
    spanAttrHook:function(index){//每次绘制“文本描述”的时候调用，返回span的样式
      var colors = ["#094466","#145c8c","#1e88ba","#18aeed","#55cdff","#89d9fc"]
      return {
        color:colors[index]
      }
    },
    align:"tc",//t r b l
    offset:[0,0],
    globalConfig:{
      shape:"square",
      interval:20,//legend之间的间隔
      iconright:5,//icon后面的空白
      showicon:true //默认为true. 是否显示legend前面的小icon——可能用户有自定义的需求
    },//整体配置
    config:[
      {color:"#094466",text:"Firefox"},
      {color:"#145c8c",text:"IE"},
      {color:"#1e88ba",text:"Chrome"},
      {color:"#18aeed",text:"Safari"},
      {color:"#55cdff",text:"Opera"},
      {color:"#89d9fc",text:"Others",shape:"circle"}
    ]//个别配置
  }
  var legend = new Legend(lengend_cfg);
});
    </script>
  </body>
</html>
```


### 配置说明
- `align` legend排布位置 可以取下面的的值
```
        "tl":"alignTopLeft",
        "tc":"alignTopCenter",
        "tr":"alignTopRight",
        "rt":"alignRightTop",
        "rm":"alignRightMiddle",
        "rb":"alignRightBottom",
        "bl":"alignBottomLeft",
        "bc":"alignBottomCenter",
        "br":"alignBottomRight",
        "lt":"alignLeftTop",
        "lm":"alignLeftMiddle",
        "lb":"alignLeftBottom"
```
- `offset` legend的偏移量
- `config` legend条目配置
- `spanAttrHook` label文案的span自定义函数
- `iconAttrHook` icon图形自定义函数

