KISSY.use("gallery/kcharts/1.2/raphael/index,gallery/kcharts/1.2/legend/index,dom,event",function(S,Raphael,Legend,D,E){
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
    target:$target,

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
    anim:{
      
    },
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

})
