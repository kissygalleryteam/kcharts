// 放大m倍后，进行四舍五入
// 0.006 ==> 0.01
function roundToFixed(num,m){
  return Math.round(num*m)/m;
}
// var ret;
// ret = roundToFixed(0.006,100);
// console.log(ret);
// // => 0.01

function lineon( origin, base, bias){
  if(bias > 1){
    bias = 1;
  }else if(bias < 0){
    bias = 0;
  }
  var ret = origin + (base - origin) * bias;
  return Math.round(ret*100)/100;
};

// ==================== test lineon ====================
// var ret;
// ret = lineon(1,11,.3);
// console.log(ret);
// // => 4
// ==================== test lineonend ====================

var deg2rad = Math.PI/180;
var rad2deg = 180/Math.PI;

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
    var ret = rad2deg*Math.atan(AB[1]/AB[0]);
    if(AB[0] < 0){ // x 轴负方向上
      ret = ret - 180;
    }
    return ret;
  }
}
// ==================== test linedeg ====================
// var ret;

// ret = linedeg([0,0],[0,10]);
// console.log(ret);
// // => 90

// ret = linedeg([0,0],[1,10]);
// console.log(ret);
// // => 84.28940686250037

// ret = linedeg([0,0],[10,0]);
// console.log(ret);
// // => 0

// ret = linedeg([0,0],[10,-1]);
// console.log(ret);
// // => -5.710593137499643

// ret = linedeg([0,0],[0,-10]);
// console.log(ret);
// // => -90

// ret = linedeg([0,0],[-5,0]);
// console.log(ret);
// // => -180

// ret = linedeg([0,0],[-10,10]);
// console.log(ret);
// // => -225

// ==================== test linedeg end ====================


// 根据 a,b，C求出垂直的D E两点
//           D
//           |
// ----a-----C------b--------------------------
//           |
//           E
function verticalLine(a,b,opt){
  opt || (opt = {});
  var scale = opt.scale || 3;  // 刻度尺寸
  var ratio = opt.ratio || .5; // c点在ab之间所占的比例，默认在中间

  var unit = 1000000;

  // 1. 求出a,b与水平的夹角
  var deg = linedeg(a,b);

  // console.log(roundToFixed(deg,unit));

  // 2. 根据夹角求出单位向量
  var ix = Math.cos(deg*deg2rad);
  var iy = Math.sin(deg*deg2rad);

  // console.log([
  //   roundToFixed(ix,unit),
  //   roundToFixed(iy,unit)
  // ]);

  // 3. 求出ab之间比例为ratio的坐标
  var x0 = lineon( a[0], b[0], ratio);
  var y0 = lineon( a[1], b[1], ratio);

  // console.log([
  //   roundToFixed(x0,unit),
  //   roundToFixed(y0,unit)
  // ]);

  // 4. 求出[x0,y0]上下点的坐标，即d、e
  var x1,x2  // 左边的点？
    , y1,y2; // 右边的点？
  x1 = x0+iy*scale; y1=y0-ix*scale;
  x2 = x0-iy*scale; y2=y0+ix*scale;
  return {
    x1:roundToFixed(x1,unit),
    y1:roundToFixed(y1,unit),
    x2:roundToFixed(x2,unit),
    y2:roundToFixed(y2,unit)
  };
}
// ==================== test verticalLine ====================
// var ret;
// ret = verticalLine([0,0],[0,10],{scale:2,ratio:.5});
// console.log(ret);
// => { x1: 2, y1: 5, x2: -2, y2: 5 }
// ==================== test verticalLine end ====================