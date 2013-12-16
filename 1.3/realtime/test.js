// 通过a,b两点直线的夹角
function linedeg(a,b){
  var AB = [
      b[0] - a[0],
      b[1] - a[1]
  ];

  if(AB[0] === 0){
    if(AB[1] > 0){
      return 90;
    }else if(AB[1] < 0 ){
      return -90;
    }else{
      return 0;
    }
  }else{
    return Math.atan(AB[1]/AB[0]);
  }
}

// 根据 a,b，c求出垂直的d e 两点
//           d
//           |
// ----a-----c------b----
//           |
//           e
function verticalLine(a,b,c){

}