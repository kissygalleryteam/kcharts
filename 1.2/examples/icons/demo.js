KISSY.use("gallery/kcharts/1.2/raphael/index,dom,event,gallery/kcharts/1.2/icons/index",function(S,Raphael,D,E,Icons){
  var $con = S.one("#J_Con")
    , paper = Raphael($con[0],500,500)

  var x0 = 30;
  var y0 = 30;
  S.each([
    "rect",
    "circle",
    "square",
    "triangle",
    "diamond",
    "linecircle",
    "linesquare",
    "linetriangle",
    "linediamond"
  ],function(type){
      Icons[type](x0,y0,{
        paper:paper,
        size:[1,1],
        attrs:{
          fill:"#0a0"
        }
      });
      x0+=50;
    });

  //bigger
  x0 = 30;y0=80;
  S.each([
    "rect",
    "circle",
    "square",
    "triangle",
    "diamond",
    "linecircle",
    "linesquare",
    "linetriangle",
    "linediamond"
  ],function(type){
      var set = Icons[type](x0,y0,{
        paper:paper,
        size:[1.5,1.5],
        attrs:{
          fill:"#0a0"
        }
      });
      var $path
      if(set.clear){
        $path = set[0];
      }else{
        $path = set;//第二元素才是实际的线
      }
      $path.attr({"stroke":"#fff","stroke-width":2});
      $path
      .mouseover(function(){
        $path.attr({"stroke":"#0a0"});
      })
      .mouseout(function(){
        $path.attr({"stroke":"#fff"});
      });
      x0+=50;
    });
});
