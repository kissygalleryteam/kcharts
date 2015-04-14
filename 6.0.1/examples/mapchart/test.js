KISSY.use("kg/kcharts/6.0.1/raphael/index",function(S,Raphael){
  var paper = Raphael("J_Paper",400,400);

  var props = [
    {r:4,cx:60,cy:90},
    {r:2,cx:130,cy:120},
    {r:3,cx:160,cy:300}
  ]

  function batch(props){
    var circles = paper.set()
    S.each(props,function(i){
      var c = paper.circle(i.cx,i.cy,i.r);
      if(i.r > 2){
        c.attr("fill","red");
      }else{
        c.attr("fill","pink");
      }
      c.attr({"opacity":0,"stroke":"yellow"});
      circles.push(c);
    });

    var toggle = false;
    function onend(){
      toggle = !toggle;
      if(toggle){
        enlarge();
      }else{
        shrink();
      }
    };
    function enlarge(){
      circles.animate({"transform":"s3","opacity":1},1000,"linear",onend);
    };
    function shrink(){
      circles.animate({"opacity":0,"transform":"s5"},500,"linear",function(){
        setTimeout(function(){
          circles.attr("transform","");
          onend();
        },500);
      });
    };
    circles.animate({"transform":"s1.1"},100,"linear",function(){
      setTimeout(function(){
        circles.attr("transform","");
        onend();
      },50);
    });
  }

  batch(props);

  setTimeout(function(){
    batch(S.map(props,function(i){
            i.cx+=30;
            i.cy-=60;
            i.r += 1;
            return i;
          }));
  },1500);

  setTimeout(function(){
    batch(S.map(props,function(i){
            i.cx+=50;
            i.cy+=60;
            i.r -= 2;
            return i;
          }));
  },1000);

  setTimeout(function(){
    batch(S.map(props,function(i){
            i.cx+=200;
            i.cy+=80;
            i.r+= 3;
            return i;
          }));
  },2000);
});
