/*
combined files : 

gallery/kcharts/1.3/realtime/util
gallery/kcharts/1.3/realtime/index

*/
KISSY.add('gallery/kcharts/1.3/realtime/util',function(S){

  // ==================== util ====================
  var Util = {};

  var log = function(msg){
    if(this.console)
      console.log(msg)
  }

  // ==================== begin chooseUnit ====================
  /* descrption : 在画与时间相关的线图的时候，x轴的时间跨度确定，单位如何确定？ 是 day 、hour 还是 miniute ？
   * 这个函数提供一个选择方式
   * 时间跨度确定了，比如 2013-12-03 12:00 到 2013-12-03 18:00，决定单位选择的还有一个因素还有 **期望跨度分成的段数**
   *                      如果期望分为 5份 ，那么 12:00 到 18:00，相差6个小时，按"hour"来分是比较合适的
   *                      如果期望分为 400份 ，那么 12:00 到 18:00，相差6个小时=6*60分钟，按"minute"来分是比较合适的
   * 所以，这个函数有两个参数 arr —— 时间序列，用于求出时间跨度
   *                          n   —— 期望划分的刻度数
   * */

  // CONSTANT ，单位为ms
  var MINIT2SECOND = 60*1000;
  var HOUR2SECOND = 3600*1000;
  var DAY2SECOND = 3600*24*1000;
  var WEEK2SECOND = 3600*24*7*1000;
  var MONTH2SECOND = 3600*24*7*30*1000;

  // 横轴时间单位选择
  // @param arr{Array} 时间序列，最好已经排序
  // @param n{Number} 期望横轴分成的段数
  // @return string{String} 可能值为 "minute","hour","day","week","month"
  //
  //  eg: 如果传入的时间范围为 2013-12-03 到 2013-12-08 ，相差5天，期望分的段数为6，那么返回的单位为 "day"
  //      相差大约6个小时，与5比较接近 2013-12-03 12:05 到 2013-12-03 18:00 ，相差6个小时，期望的分段数为6，那么返回的单位为 "hour"
  function chooseUnit(arr,n){
    var min = Math.min.apply(Math,arr);
    var max = Math.max.apply(Math,arr);

    var diff = max - min;

    var units = [MINIT2SECOND,HOUR2SECOND,DAY2SECOND,WEEK2SECOND,MONTH2SECOND];

    var arr2 = [];
    for(var i=0;i<units.length;i++){
      var base = diff/units[i];
      // TODO 选取策略！！！
      if(base < 1)
        break;
      arr2.push(
          base-n
        );
    }
    var max2 = Math.min.apply(Math,arr2);
    var index;
    if(max2){
      index = arr2.indexOf(max2);
    }else{
      index = 0;
    }
    var UNITS = ["minute","hour","day","week","month"];
    return UNITS[index];
  }
  Util.chooseUnit = chooseUnit;

  // chooseUnit([new Date("2013-12-03"),new Date("2013-12-08")],6)
  // // => "day" 12-03 到 12-08 相差5天，期望分的段数为6，所以返回day
  // chooseUnit([new Date("2013-12-03 12:05"),new Date("2013-12-03 18:00")],5)
  // // => "hour" 相差大约6个小时，与5比较接近，返回hour
  // chooseUnit([new Date("2013-12-03 12:00"),new Date("2013-12-03 12:05")],6)
  // // => "minute" 相差5min，与6比较接近，返回minute
  // // 同上，只不过转为时间戳表示，单位为ms
  // chooseUnit([1386043200000, 1386043500000],6)
  // // => "minute" 同上
  // chooseUnit([new Date("2013-12-03"),new Date("2014-08-08")],6)
  // // => "month" 相差12个月, 比较接近6个月

  function unit2digts(key){
    var m = {
      "minute": 60000,
      "hour": 3600000,
      "day":3600*24000,
      "week":3600*24*7000,
      "month":3600*24*7*30000
    }
    return m[key];
  }

  Util.unit2digts = unit2digts;
  // ==================== end chooseUnit ====================

  // ==================== begin axis ====================
  var epsilon = 2.220446049250313e-16;
  var ONE_OVER_LOG_10 = 1 / Math.log(10);

  var simplicity = function(i, n, j, lmin, lmax, lstep) {
    var v;
    v = ((lmin % lstep) < epsilon || (lstep - (lmin % lstep)) < epsilon) && lmin <= 0 && lmax >= 0 ? 1 : 0;
    return 1 - (i / (n - 1)) - j + v;
  };

  var simplicityMax = function(i, n, j) {
    return 1 - i / (n - 1) - j + 1;
  };

  var coverage = function(dmin, dmax, lmin, lmax) {
    var range;
    range = dmax - dmin;
    return 1 - 0.5 * (Math.pow(dmax - lmax, 2) + Math.pow(dmin - lmin, 2)) / (Math.pow(0.1 * range, 2));
  };

  var coverageMax = function(dmin, dmax, span) {
    var half, range;
    range = dmax - dmin;
    if (span > range) {
      half = (span - range) / 2;
      return 1 - 0.5 * (Math.pow(half, 2) + Math.pow(half, 2)) / (Math.pow(0.1 * range, 2));
    } else {
      return 1;
    }
  };

  var density = function(k, m, dmin, dmax, lmin, lmax) {
    var r, rt;
    r = (k - 1) / (lmax - lmin);
    rt = (m - 1) / (Math.max(lmax, dmax) - Math.min(dmin, lmin));
    return 2 - Math.max(r / rt, rt / r);
  };

  var densityMax = function(k, m) {
    if (k >= m) {
      return 2 - (k - 1) / (m - 1);
    } else {
      return 1;
    }
  };

  var legibility = function(lmin, lmax, lstep) {
    return 1.0;
  };

  var getProperUnit = function(dmin, dmax, m, onlyLoose, Q, w) {
    var bestLmax, bestLmin, bestLstep, bestScore, c, cm, delta, dm, eps, g, j,
        k, l, length, lmax, lmin, max, maxStart, min, minStart, q, qi, s, score, sm,
        start, step, thisScore, z, _i, _j, _ref, _ref1;
    if (onlyLoose == null) {
      onlyLoose = false;
    }
    if (Q == null) {
      Q = [1, 5, 2, 2.5, 4, 3];
    }
    if (w == null) {
      w = {
        simplicity: 0.2,
        coverage: 0.25,
        density: 0.5,
        legibility: 0.05
      };
    }
    score = function(simplicity, coverage, density, legibility) {
      return w.simplicity * simplicity + w.coverage * coverage + w.density * density + w.legibility * legibility;
    };
    bestLmin = 0.0;
    bestLmax = 0.0;
    bestLstep = 0.0;
    bestScore = -2.0;
    eps = epsilon;
    _ref = (dmin > dmax ? [dmax, dmin] : [dmin, dmax]), min = _ref[0], max = _ref[1];
    if (dmax - dmin < eps) {
      return [min, max, m, -2];
    } else {
      length = Q.length;
      j = -1.0;
      while (j < Number.POSITIVE_INFINITY) {
        for (qi = _i = 0, _ref1 = length - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; qi = 0 <= _ref1 ? ++_i : --_i) {
          q = Q[qi];
          sm = simplicityMax(qi, length, j);
          if (score(sm, 1, 1, 1) < bestScore) {
            j = Number.POSITIVE_INFINITY;
          } else {
            k = 2.0;
            while (k < Number.POSITIVE_INFINITY) {
              dm = densityMax(k, m);
              if (score(sm, 1, dm, 1) < bestScore) {
                k = Number.POSITIVE_INFINITY;
              } else {
                delta = (max - min) / (k + 1) / j / q;
                z = Math.ceil(Math.log(delta) * ONE_OVER_LOG_10);
                while (z < Number.POSITIVE_INFINITY) {
                  step = j * q * Math.pow(10, z);
                  cm = coverageMax(min, max, step * (k - 1));
                  if (score(sm, cm, dm, 1) < bestScore) {
                    z = Number.POSITIVE_INFINITY;
                  } else {
                    minStart = Math.floor(max / step) * j - (k - 1) * j;
                    maxStart = Math.ceil(min / step) * j;
                    if (minStart > maxStart) {

                    } else {
                      for (start = _j = minStart; minStart <= maxStart ? _j <= maxStart : _j >= maxStart; start = minStart <= maxStart ? ++_j : --_j) {
                        lmin = start * (step / j);
                        lmax = lmin + step * (k - 1);
                        if (!onlyLoose || (lmin <= min && lmax >= max)) {
                          s = simplicity(qi, length, j, lmin, lmax, step);
                          c = coverage(min, max, lmin, lmax);
                          g = density(k, m, min, max, lmin, lmax);
                          l = 1.0;
                          thisScore = score(s, c, g, l);
                          if (thisScore > bestScore) {
                            bestScore = thisScore;
                            bestLmin = lmin;
                            bestLmax = lmax;
                            bestLstep = step;
                          }
                        }
                      }
                    }
                    z += 1;
                  }
                }
              }
              k += 1;
            }
          }
        }
        j += 1;
      }
      return [bestLmin, bestLmax, bestLstep, bestScore];
    }
  };

  // console.log(
  //   getProperUnit(-31.0, 27.0, 4)
  // )
  // // -> [ -30, 30, 20, 0.7545085216012684 ]

  // console.log(
  //   getProperUnit(1.1, 9.8, 10)
  // )
  // // -> [ 1, 10, 1, 0.7917426344299116 ]
  Util.getProperUnit = getProperUnit;

  var axis = function(min,max,n){
    var result = getProperUnit(min,max,n);

    var from = result[0],
        to = result[1],
        step = result[2]

    if(to < max){
      to += step;
    }

    if(from > min){
      from -= step;
    }
    var j = (to - from)/step;
    var ret = [];
    var tmp = from;
    for(var i=1;i<=j;i++){
      ret.push(tmp);
      tmp+=step;
    }
    ret.push(tmp);
    return ret;
  }
  Util.axis = axis;

  // console.log(
  //   axis(.9,9.8,10)
  // )

  // ==================== end axis ====================

  // ==================== begin getlabel ====================

  // 1. 获取适合的 **unit**，比如 day hour miniute second
  // 2. 根据unit获取对应毫秒数 **UNIT**
  // 3. 所有数据缩小 unit/UNIT，得到新的一组数据 **arr**
  // 4. 求出arr最小值、最大值 **min** 、**max**
  // 5. 根据 min max 求出以unit为单位的范围序列 **arr2**
  // 6. 将 **arr2** 的所有元素转为时间格式
  // @param arr{Array} 单位为ms的时间序列
  // @param n{Number} 期望分成的份数
  //
  var getlabel = function(arr,n){
    var rawMax = Math.max.apply(Math,arr);

    // 1.
    var unit = chooseUnit(arr,n);
    if(!unit){
      log('ERR OCCURED!');
    }

    // 2.
    var UNIT = unit2digts(unit);

    // 3.
    var arr2 = arr.map(function(a){
            return a/UNIT;
          });
    // 4.
    var min,max;
    min = Math.min.apply(Math,arr2);
    max = Math.max.apply(Math,arr2);
    // 5.
    var labelnums = axis(min,max,n)

    var mindate = Math.min.apply(Math,labelnums) * UNIT;
    var maxdate = Math.max.apply(Math,labelnums) * UNIT;

    // 保证不小于原来的
    if(maxdate < rawMax){
      maxdate+=UNIT;
    }

    // 6.
    labelnums = labelnums.map(function(i){
                  return +(new Date(i*UNIT));
                });
    return {
      dates:labelnums,
      unit:UNIT,
      min:mindate,
      max:maxdate
    };
  }

  Util.getlabel = getlabel;

  // var timeseq = [+new Date("2013-12-03 12:00") , +new Date("2013-12-03 12:05") , +new Date("2013-12-03 12:08") , +new Date("2013-12-03 12:10") , +new Date("2013-12-03 12:30") , +new Date("2013-12-03 12:35")
  //               ];
  // var ret = getlabel(timeseq,6);
  // console.log(
  //   ret
  // )

  // ==================== end getlabel ====================
  // 格式化日期，from web
  function formatDate(date,dateformat){
    var o = {
      "M+" : date.getMonth()+1,                 //month
      "d+" : date.getDate(),                    //day
      "h+" : date.getHours(),                   //hour
      "m+" : date.getMinutes(),                 //minute
      "s+" : date.getSeconds(),                 //second
      "q+" : Math.floor((date.getMonth()+3)/3), //quarter
      "S" : date.getMilliseconds()              //millisecond
    }

    if(/(y+)/.test(dateformat)) dateformat=dateformat.replace(RegExp.$1,
                                                              (date.getFullYear()+"").substr(4 - RegExp.$1.length));

    for(var k in o)if(new RegExp("("+ k +")").test(dateformat))
      dateformat = dateformat.replace(RegExp.$1,
                                      RegExp.$1.length == 1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)
                                     );
    return dateformat;
  }
  // console.log(new Date().format("yyyy-MM-dd"));
  // console.log(new Date("january 12 2008 11:12:30").format("yyyy-MM-dd h:mm:ss"));

  Util.formatDate = formatDate;

  // ==================== 刻度 start ====================

  // 放大m倍后，进行四舍五入
  // 0.006 ==> 0.01
  function roundToFixed(num,m){
    return Math.round(num*m)/m;
  }
  Util.roundToFixed = roundToFixed;
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
    var scale = typeof opt.scale !== 'number'?  3 : opt.scale;  // 刻度尺寸
    var ratio = typeof opt.ratio !== 'number'? .5 : opt.ratio; // c点在ab之间所占的比例，默认在中间

    var unit = 1000000;

    // 1. 求出a,b与水平的夹角
    var deg = linedeg(a,b);

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
      x0:roundToFixed(x0,unit), // 保留原始值
      y0:roundToFixed(y0,unit),
      x1:roundToFixed(x1,unit),
      y1:roundToFixed(y1,unit),
      x2:roundToFixed(x2,unit),
      y2:roundToFixed(y2,unit)
    };
  }
  Util.verticalLine = verticalLine;

  // ==================== test verticalLine ====================
  // var ret;
  // ret = verticalLine([0,0],[0,10],{scale:2,ratio:.5});
  // console.log(ret);
  // // => { x1: 2, y1: 5, x2: -2, y2: 5 }

  // ret = verticalLine([0,0],[10,0],{scale:2,ratio:.5});
  // console.log(ret);
  // // => { x1: 5, y1: -2, x2: 5, y2: 2 }

  // ret = verticalLine([0,0],[10,10],{scale:2,ratio:.5});
  // console.log(ret);
  // ==================== test verticalLine end ====================
  // ==================== 刻度 end ====================



  /**
   * 合并两个series data
   * */
  function combineSeries(serie,series){
    var serieName = serie.name;
    var flag = true;
    for(var i=0,l=series.length;i<l;i++){
      if(series[i].name === serieName){
        var data = series[i].data;
        series[i].data = [].concat(data,serie.data);
        flag = false;
        break;
      }
    }
    // 没有找到同名的serie，则添加一个
    if(flag){
      series.push(serie);
    }
  }
  Util.combineSeries = combineSeries;
  //==================== test combineSerie ====================
  // case 1 . 插入的数据原来就有
  // var ss = [
  //   {
  //     name : 'AAPL',
  //     data : [
  //       [1147651200000,67.79],
  //       [1147737600000,64.98],
  //       [1147824000000,65.26]
  //     ]
  //   }
  // ];
  // var s = {
  //   name : 'AAPL',
  //   data : [
  //     [3,4],
  //     [5,6]
  //   ]
  // }
  // combineSeries(s,ss);
  // console.log(ss[0]['data']);

  // case 2. 插入的数据原来没有 AAPL插入到AAQL
  // var ss = [
  //   {
  //     name : 'AAQL',
  //     data : [
  //       [1147651200000,67.79],
  //       [1147737600000,64.98],
  //       [1147824000000,65.26]
  //     ]
  //   }
  // ];
  // var s = {
  //   name : 'AAPL',
  //   data : [
  //     [3,4],
  //     [5,6]
  //   ]
  // }
  // combineSeries(s,ss);
  // console.log(ss);

  //==================== test combineSerie end ====================
  function fixSVGLineStyle($path,svg){
    var el = svg && $path && $path[0];
    el && el.setAttribute("shape-rendering", "crispEdges");
  }
  Util.fixSVGLineStyle = fixSVGLineStyle;

  /**
   * 求一组点的平均位置
   * @param pts {Array} eg. [{x:x,y:y},...]
   * @return pt {Object} eg. {x:x,y:y}
   * */
  function averagePoints(pts){
    var x,y;
    var sx,sy;
    sx = sy = 0;
    var n=0;
    for(var i=0,l=pts.length;i<l;i++){
      if(pts[i] && typeof pts[i].x === "number"){
        sx+= pts[i].x;
        sy+= pts[i].y;
        n++;
      }
    }
    x = sx/n;
    y = sy/n;
    return {x:x,y:y};
  }
  Util.averagePoints = averagePoints;

  // http://stackoverflow.com/questions/2686855/is-there-a-javascript-function-that-can-pad-a-string-to-get-to-a-determined-leng
  function pad(width, string, padding) {
    return (width <= string.length) ? string : pad(width, padding + string, padding)
  }
  Util.pad = pad;
  // ==================== end util ====================
  return Util;
});

;KISSY.add("gallery/kcharts/1.3/realtime/index",function(S,Raphael,Base,Promise,Anim,Util,D,E,ColorLib){
   //==================== STATIC start ====================
   var COLOR_TPL = "{COLOR}";
   //==================== STATIC end ====================

   //==================== utils start ====================
   var each    = S.each
     , map     = S.map
     , indexOf = S.indexOf
     , merge   = S.merge;

   /**
    * 从series提取x:values,y:dates
    * */
   function extractValuesAndDates(series){
     var dates = [];
     var vals = [];
     for(var i=0;i<series.length;i++){
       var serie = series[i];
       var data = serie.data;
       if(data){
         for(var j=0;j<data.length;j++){
           var point = data[j];
           if(typeof point[0] === 'number'){
             dates.push(point[0]);
           }else{
             dates.push(null);
           }
           if(typeof point[1] === 'number'){
             vals.push(point[1]);
           }else{
             vals.push(null);
           }
         }
       }
     }
     return {
       dates:dates,
       values:vals
     }
   }
   /**
    * 过滤series
    * 1. 过滤非数字的
    * 2. 如果有配置x和y的范围，过滤掉范围之外的
    * */
   function filterSeries(series,xconfig,yconfig,fn){
     var series2 = [];
     var xrange = xconfig.range,
         yrange = yconfig.range;

     for(var i=0,l1=series.length;i<l1;i++){
       var serie2;
       if(!series[i].hided){// 只要没有被隐藏的数据
         var serie = series[i];
         serie2 = {data:[],name:serie.name};
         for(var j=0,l2=serie.data.length;j<l2;j++){
           var data = serie.data[j];
           var x = data[0] , y = data[1];
           var result = fn(xrange,yrange,x,y);
           if(result){
             // 置空，画线时跳过
             serie2.data.push(result);
           }
         }
       }else{
         serie2 = [];
       }
       series2.push(serie2);
     }
     return series2;
   }

   /**
    * 获取vals的范围
    * */
   function getValueRange(vals,opt){
     opt || (opt = {});
     opt.n || (opt.n = 5);
     var val_min = Math.min.apply(Math,vals)
       , val_max = Math.max.apply(Math,vals)
     if(opt.range && typeof opt.range.min === 'number'){
       if(val_min>opt.range.min)
         val_min = opt.range.min;
     }
     if(opt.range && typeof opt.range.max === 'number'){
       if(val_max<opt.range.max)
         val_max = opt.range.max;
     }
     var val_labels = Util.axis(val_min,val_max,opt.n)

     var vmin = Math.min.apply(Math,val_labels)
       , vmax = Math.max.apply(Math,val_labels);

     var valuerange = {
       min:vmin,
       max:vmax,
       range:val_labels
     };
     return valuerange;
   }
   /**
    * 返回数据的时间、数值范围
    * */
   function getDateRange(dates,opt){
     opt || (opt = {n:5});

     var date_labels = Util.getlabel(dates,opt.n);

     var date_min = date_labels.min
       , date_max = date_labels.max;
     var daterange = {
         unit:date_labels.unit,
         min:date_min,
         max:date_max,
         range:date_labels.dates
     };

     return daterange
   }

   /**
    * 返回不大于xrangeEnd的最大值
    * eg.
    *  getIntRange(2,9,3)
    *  ==> {min: 2, max: 8, step: 3}
    * */
   function getIntRange(from,to,step){
     var max = from;
     var len = Math.floor((to - from)/step);
     max = from + len*step;

     var range = [];
     for(var i=from;i<=max;i+=step){
       range.push(i);
     }
     return {
       range:range,
       min:from,
       max:max,
       len:len
     }
   }

   /**
    * 移除数组中的arr元素
    * */
   function removeRaphaelElements(arr){
     while(arr.length){
       var el = arr.pop();
       if(el && el.remove){
         el.remove();
       }
     }
   }

   /**
    * 曲线
    * @param points{Array} 点集
    * */
   function polyLine(points){
     var s;
     for(var i=0,l=points.length;i<l;i++){
       var point = points[i]
         , x = point.x
         , y = point.y
       if(i){
         s.push("L",x,y);
       }else{
         s = ["M",x,y]
       }
     }
     return s.join(',');
   }
   /**
    * 平滑的连线，
    * 注意中间可能有断开的线段
    * @param points {Array}
    * @return str {String} Raphael path 路径字符串
    * */
   function curveLine(points){
     var str,
         arr = [],
         point, x , y;
     if(points.length <= 2){
       for(var i=0,l=points.length;i<l;i++){
         point = points[i]
         x = point.x;
         y = point.y;

         x = Util.roundToFixed(x,100);
         y = Util.roundToFixed(y,100);
         if(i){
           arr.push("L",x,y);
         }else{
           arr.push("M",x,y);
         }
       }
     }else{
       for(var i=0,l=points.length;i<l;i++){
         point = points[i]
         x = point.x;
         y = point.y;
         x = Util.roundToFixed(x,100);
         y = Util.roundToFixed(y,100);
         if(i){
           arr.push(x,y);
         }else{
           arr.push("M",x,y,'R');
         }
       }
     }
     str = arr.join(",");
     return str;
   }
   /**
    * 连线，提供自定义的连接函数fn
    * */
   function joinLines(points,fn){
     var point,x,y
     var all = [],
         arr = [];
     for(var i=0,l=points.length;i<l;i++){
       point = points[i]
       x = point.x;
       y = point.y;
       if(x === null){
         all.push(arr);
         arr = [];
       }else{
         arr.push(point);
       }
     }
     all.push(arr);
     var s = '';
     for(var j=0,m=all.length;j<m;j++){
       s+=fn(all[j]);
     }
     return s;
   }

   /**
    * 获取a到b分成opt.n份的坐标集合
    * @return ret {Array} eg. [{x1,y1,x2,y2},...]
    * */
   function getRullerPoints(a,b,opt){
     var rate,ret = [],result;
     for(var i=0,n=opt.n;i<n;i++){
       rate = i/(n-1);
       opt.ratio = rate;
       result = Util.verticalLine(a,b,opt)
       ret.push(result);
     }
     return ret;
   }
   /**
    * 画刻度
    * @param collection {Array}
    * */
   function drawRullerPoints(collection,paper,opt){
     opt || (opt = {});
     if(arguments.length<2)
       return false;

     var style = opt.style || {};
     var joinStyle = style.ruller || "-."; // 连线样式

     var s = [];
     var p;
     // 翻转后，从下往上绘制刻度
     // collection = collection.reverse();
     var ax,bx,ay,by;
     for(var i=1,l=collection.length;i<l;i++){
       p = collection[i];

       if(joinStyle === '-.'){
         ax = p.x0;
         ay = p.y0;
         if(opt.xaxis){
           bx = p.x2;
           by = p.y2;
         }else{
           bx = p.x1;
           by = p.y1;
         }
       }else if(joinStyle === ".-"){
         if(opt.xaxis){
           ax = p.x0;ay=p.y0;
           bx = p.x2;by=p.y2;
         }else{
           ax = p.x0;ay=p.y0;
           bx = p.x1;by=p.y1;
         }
       }else if(joinStyle === "-.-"){
         ax = p.x1;ay=p.y1;
         bx = p.x2;by=p.y2;
       }else{
         return false;
       }
       s.push("M",
              Util.roundToFixed(ax,10),
              Util.roundToFixed(ay,10),
              "L",
              Util.roundToFixed(bx,10),
              Util.roundToFixed(by,10)
             );
     }
     var ss = s.join(',');
     var path = opt.path;
     if(path){
       path.animate({path:ss},200);
     }else{
       var sstyle = getDefaultLineStyle(style.style);
       path = paper.path(ss).attr(sstyle);
     }
     return path;
   }
   /**
    * 将数据转为画布上的点
    * @param data {Array} [x0,y0]
    * @param opt {Object} 转换所需的参数
    *   - opt.px  paddingx
    *   - opt.py  padingy
    *   - opt.xmin x方向的最小值
    *   - opt.xmax x方向的最大值
    *   - opt.ymin
    *   - opt.ymax
    *   - opt.width 内部作图区域的宽度
    *   - opt.height 内部作图区域的高度
    * @reurn point {Array} [x,y]
    * */
   function data2point(data,opt){
     var xmin = opt.xmin
       , xmax = opt.xmax
       , ymin = opt.ymin
       , ymax = opt.ymax
       , px = opt.px
       , py = opt.py
       , x0 = data[0]
       , y0 = data[1]
       , w = opt.width
       , h = opt.height;
     var x,y;
     if(x0 === null || y0 === null){
       x = null;
       y = null;
     }else{
       x = (x0- xmin) / (xmax - xmin) * w+ px;
       // 注意y轴翻转
       y = h - (y0- ymin) / (ymax - ymin) * h+ py;
     }
     return [x,y];
   }
   /**
    * 批量将数据转换为paper上的点
    * @param series {Array} 数据组
    * @param opt {Object} 选项参见data2points
    * */
   function data2points(series,opt){
     var ret = [];
     for(var i=0;i<series.length;i++){
       var points = [];
       ret.push(points);
       var serie = series[i];
       var data = serie.data;
       if(data){
         for(var j=0;j<data.length;j++){
           var point = data[j];
           var x,y;
           var xy = data2point(point,opt);
           x = xy[0];
           y = xy[1];
           // 坐标信息，转换后的值、原始值
           points.push({x:x,y:y,rawx:point[0],rawy:point[1]});
         }
       }
     }
     return ret;
   }

   /**
    * 绘制一系列的点
    * @param points
    * @param opt
    *  - opt.paper
    *  - opt.color
    *  - opt.$line
    *  - opt.lineType
    *  - opt.pointConfig
    *  - opt.context
    * @return result {Object}
    *  {line,points,color} {路径,连接点,serie颜色}
    * */
   function drawSerie(points,opt){
     var defer = new Promise.Defer()
       , promise = defer.promise;

     var that = opt.context;
     var $line
       , $points
       , color

     var paper = opt.paper;
     $points = paper.set();
     color = opt.color;
     var anim;
     // 连线
     var pathString;
     if(opt.lineType === 'arc'){
       pathString = joinLines(points,curveLine);
     }else{
       pathString = joinLines(points,polyLine);
     }
     if(opt.$line){
       $line = opt.$line;
       $line.animate({"path":pathString},200);
       setTimeout(function(){
         defer.resolve({
           $line:$line,
           $points:$points,
           color:color
         });
       },0);
     }else{
       var lastVal;
       var totalLength = Raphael.getTotalLength(pathString);
       anim = Anim.AnimateObject([{
         from:{
           per:0
         },
         to:{
           per:1
         },
         frame:function(name,val,props,i,len){
           var subPathString = Raphael.getSubpath(pathString,0,val*totalLength);
           if($line){
             $line.attr({"path":subPathString});
           }else{
             $line = paper.path(subPathString);
             lineAttr();
           }
           lastVal = val;
         },
         endframe:function(name,val,props,i,len){
           if(lastVal !== 1){
             $line.attr({"path":pathString});
           }
           defer.resolve({
             $line:$line,
             $points:$points,
             color:color
           });
         }
       }],{
         easing:"easeNone",
         duration:1000
       });
     }
     // 绘制完毕后调用
     function lineAttr(){
       $line.attr({"stroke":color.DEFAULT,"stroke-width":2});
       $line.hover(
         function(e){
           $line.attr({"stroke":color.HOVER,"stroke-width":3});
         },function(e){
             $line.attr({"stroke":color.DEFAULT,"stroke-width":2});
           });
     }
     // 绘制连接点
     if(opt.pointConfig.isShow !== false){
       // 描点
       each(points,function(pt,index){
         var c = paper.circle(pt.x,pt.y,4);
         c.attr({"stroke":"#fff","fill":color.DEFAULT,"stroke-width":2});
         $points.push(c);
       });
       // 大数据，可以选择不绘制出连接点
     }else{
       // here do nothing
       // 但是绑定paper的mousemove事件，然后求出move时对应的数据点
     }
     return promise;
   }
   /**
    * 销毁一条线及其连接点，解绑事件等
    * */
   function destroySerie(serie){
     var $line = serie.$line
       , $points = serie.$points
     // $line && $line.unhover();

     // 不移除，用于做动画
     // $line && $line.remove();

     $points && $points.unhover();
     $points && $points.remove();
   }
   /**
    * 删除serie : 点，线
    * */
   function removeSeries(series){
     if(!series)
       return;
     for(var i=0,l=series.length;i<l;i++){
       destroySerie(series[i]);
     }
   }
   function removeSeries2(series){
     var $line,$points;
     for(var i=0,l=series.length;i<l;i++){
       $line = series[i].$line;
       // 线只隐藏
       $line && $line.hide();

       $points = series[i].$points;
       $points && $points.unhover();
       $points && $points.remove();
     }
   }
   // 获取缓存的连线
   function getCachedLine(that,index){
     var all = that.get("$lines");
     return all && all[index];
   }
   /**
    * 日期转换，返回最近的日、星期、月份
    * day    -> [0,1,2,...,24]
    * 2day   -> [0,1,2,...,48]
    * week   -> [1,2,3,...,7]
    * month  -> [0,1,2,...,30]
    * 2month -> [0,1,2,...,60]
    * */
   function convertDateUnit2Nums(s){
     var re = /(\d+)?(day|week|month)/;
     var arr = s.match(re);
     if(!arr)
       return false;

     var n,unit;
     if(arr.length>1){
       n = parseInt(arr[1]) || 1;
     }else{
       n = 1;
     }
     unit = arr[2];

     var ret = [];
     var m;
     if(unit === "day"){
       ret.push(0);
       m = 24*n - 1;
     }else if(unit === "week"){
       m = 7*n;
     }else if(unit === "month"){
       var d = new Date();
       // 当月天数
       m = new Date(d.getFullYear(), d.getMonth()+1,0).getDate();
       m *= n;
     }
     for(var i=1;i<=m;i++){
       ret.push(i);
     }
     return ret;
   }
   // console.log(
   //   convertDateUnit2Nums("day")
   // )
   // // => [0,1,2,...,23]
   // console.log(
   //   convertDateUnit2Nums("2day")
   // )
   // console.log(
   //   convertDateUnit2Nums("week")
   // )
   // console.log(
   //   convertDateUnit2Nums("2week")
   // )
   // // -> [1,2,3,...,14]
   // console.log(
   //   convertDateUnit2Nums("month")
   // )
   // // 当前时间为 2013.12.25，本月有31天 => [1,2,3,...,31]


   // 填充至少有2位
   function pad(n){
     if(n < 10){
       return '0'+n;
     }else{
       return n;
     }
   }

   /**
    * 格式化
    * 1 , day -> 1:00
    * 2 , week -> 星期二
    * 3 , month -> 2013-11-03
    * */
   function formatRange(k,rangeDuration){
     if(rangeDuration === "day"){
       return pad(k)+":00"
     }else if(rangeDuration === "week"){
       var map = ["一","二","三","四","五","六","日"];
       return '星期'+ map[k-1];
     }else if(rangeDuration === "month"){
       return Util.formatDate(new Date(),"yyyy-MM") + '-' + pad(k,2);
     }else{
       return false;
     }
   }
   // console.log(
   //   formatRange(1,'month')
   // )
   // console.log(
   //   formatRange(30,'month')
   // )
   // // => 2013-12-30
   // console.log(
   //   formatRange(2,'day')
   // )
   // // => 1:00
   // console.log(
   //   formatRange(2,'week')
   // )
   // // => 星期二

   /**
    * val 是否超过了 nday nweek nmonth
    * */
   function isOutOfRange(val,RangeType){
     var range = convertDateUnit2Nums(RangeType);

     var min = range[0];
     var max = range[range.length - 1];
     if(val >= min && val <= max){
       return false;
     }
     return true
   }
   // console.log(
   //   isOutOfRange(25,"day")
   // );
   // // => true
   // console.log(
   //   isOutOfRange(25,"2day")
   // );
   // // => false
   // console.log(
   //   isOutOfRange(31,"month")
   // );
   // // => false
   //

  /**
   * 获取mouse事件的，鼠标位置偏移量
   * */
   function getOffset(e){
     // see http://stackoverflow.com/questions/11334452/event-offsetx-in-firefox
	 var target = e.currentTarget // 当前触发的目标对象
	 if (e.offsetX) {
       return {
		 offsetX: e.offsetX,
		 offsetY: e.offsetY
       }
	 }else{
       var offset = D.offset(target);
       return {
		 offsetX: (e.offsetX || e.clientX - offset.left),
		 offsetY: (e.offsetY || e.clientY - offset.top)
       }
     }
   }
   // 默认连线样式
   function getDefaultLineStyle(style){
     return S.merge({"stroke":"#999","stroke-width":"1"},style);
   }

   /**
    * 绘制网格
    * @param topX
    * @param rightY
    * @param lxys y轴上的ruller坐标点
    * @param bxys x轴上的rller坐标点
    * @param opt {Object}
    *   - opt.vertical {Bool} 是否为垂直
    *   - opt.paper 画布
    * */
   function drawGrid(topY,rightX,xys,opt){
     var a,b;
     var x1,y1,x2,y2;
     var paper =  opt.paper;
     var context = opt.context;

     var pathArr = [];
     var key;
     for(var i=1,l=xys.length;i<l;i++){
       if(opt.vertical){
         x1 = xys[i].x0; y1 = xys[i].y0;
         x2 = x1;  y2 = topY;
         key = "$yGrid";
       }else{
         x1 = xys[i].x0; y1 = xys[i].y0;
         x2 = rightX;  y2 = y1;
         key = "$xGrid";
       }
       pathArr.push("M",x1,y1,"L",x2,y2);
     }
     var $grid = context.get(key);
     if($grid){
       $grid.attr({path:pathArr.join(",")});
     }else{
       $grid = paper.path(pathArr.join(","));
       context.set(key,$grid);
       $grid.attr(getDefaultLineStyle());
       Util.fixSVGLineStyle($grid,Raphael.svg);
     }
     return $grid;
   }
   /**
    * 根据field算出是在哪个点上
    * @param series {Array} 点序列 [[{x:x,y:y}],...]
    * @param fieldvalue {Number}
    * @param fieldname {String} 可以为 "x" 或 "y"
    * */
   function getPointBy(series,fieldvalue,fieldname){
     fieldname || (fieldname = "x");
     var ret = [];
     var flag = false;
     for(var i=0,l=series.length;i<l;i++){
       var ret2 = null;
       for(var j=0,k=series[i].length;j<k;j++){
         if(isNearBy(series[i][j],fieldvalue,fieldname)){
           ret2 = series[i][j]
           flag = true;
           break;
         }else{
           ret2 = null;
         }
       }
       ret.push(ret2);
     }
     if(flag){
       return ret;
     }else{
       return false;
     }
   }

   /**
    * point是否和指定的值相近
    * */
   function isNearBy(point,fieldvalue,fieldname){
     if(typeof point[fieldname] === "number"){
       return Math.abs(point[fieldname] - fieldvalue) < 3;
     }
     return false;
   }
   /**
    * 大数据展现时，创建hover点
    * */
   function getOrCreatePointer(that){
     var $pointers = that.get("$floatPointer");
     if(!$pointers){
       $pointers = [];
       that.set("$floatPointer",$pointers);
     }
     return $pointers;
   }

   /**
    * 数据hover线
    * @param opt{Object}
    *  - pt pt.x 、pt.y
    *  - padding padding.paddingx 、padding.paddingy
    *  - innerHeight
    *  - innerWidth
    * */
   function getOrCreateLine(that,opt){
     var $line = that.get("$floatLine");
     if(!$line){
       $line = that.get("paper").path("");
       that.set("$floatLine",$line);

       // 确保不会被线图和线图的连接点覆盖住hover响应线
       var $allLines = that.get("$lines");
       var $firstLine = $allLines[0];
       $line.insertBefore($firstLine);

       Util.fixSVGLineStyle($line,Raphael.svg);
     }
     // 如果有配置项
     if(opt && opt.pt){
       var type = opt.type;
       // hover线样式 1
       if(type === 'arrow'){
         var pathString = arrowLine({x:opt.pt.x,y:opt.padding.paddingy},{x:opt.pt.x,y:opt.padding.paddingy+opt.innerHeight});
         $line.attr(merge({"path":pathString,"stroke-width":0,"fill":"#bbb"},opt.attr));
         // hover线样式 2
       }else{
         var pathString = ["M",opt.pt.x,opt.padding.paddingy,"L",opt.pt.x,opt.padding.paddingy+opt.innerHeight].join(",");
         $line.attr({"path":pathString}).attr(merge(getDefaultLineStyle(),opt.attr));
       }
     }
     return $line;
   }
   /**
    * 判断点是否在主区域中
    * */
   function isInCanvas(pt,opt){
     var that = opt.context;
     var bbox = that.getBBox();

     return pt.x >= bbox.left && pt.x <= bbox.left+bbox.width &&
            pt.y >= bbox.top  && pt.y <= bbox.top+bbox.height;
   }
   /**
    * 获取线图hover的时候的指示器线条绘制，带箭头
    *   a ----b  ab之间是from
    *    \  /
    *     \/c
    *      |
    *      |d
    *     / \
    *    /   \
    *   f-----e  fe之间是to
    * */
   function arrowLine(from,to){
     var hunit=6,vunit=6;
     var a = {x:from.x - hunit,y:from.y};
     var b = {x:from.x + hunit,y:from.y};
     var c = {x:from.x     ,y:from.y+vunit};
     var d = {x:to.x       ,y:to.y-vunit};
     var e = {x:to.x   + hunit,y:to.y};
     var f = {x:to.x   - hunit,y:to.y};

     var M = "M",L = "L";
     var arr = [M,a.x,a.y,L,b.x,b.y,L,c.x,c.y,L,d.x,d.y,L,e.x,e.y,L,f.x,f.y,L,d.x,d.y,L,c.x,c.y,L,a.x,a.y,"Z"];
     return arr.join(",");
   }
   //==================== utils end ====================

   //==================== handlers start ====================
   function onmouseleave(e){
     var tip = this.get("$tip");
     if(tip)
       tip.hide();
   }

   //
   var onmousemoveTimer;
   function onmousemove(e){
     //移动时，如果还未完成渲染，那么什么也不做
     if(this._isRunning)
       return;

     var offset = getOffset(e);
     var x = offset.offsetX;
     var y = offset.offsetY;
     if(!isInCanvas({x:x,y:y},{context:this})){
       return;
     }

     // 清除移除指引点的回调
     onmousemoveTimer && clearTimeout(onmousemoveTimer);

     // 根据x算出是在哪个点上
     var seriesPoints = this.get("seriesPoints");
     var pts = getPointBy(seriesPoints,x,"x");

     var paper = this.get("paper");
     var that = this;

     var $series = this.get("$series");

     var $pointers = getOrCreatePointer(this);
     var $line;
     if(pts){
       var data = [];
       each(pts,function(pt,index){
         if(pt){
           if($pointers[index]){
             $pointers[index].attr({cx:pt.x,cy:pt.y,"fill":$series[index].color.DEFAULT,"stroke":"#fff","stroke-width":2});
           }else{
             $pointers[index] = paper.circle(pt.x,pt.y,5)
             $series[index] && $series[index].color && $pointers[index].attr({"fill":$series[index].color.DEFAULT,"stroke":"#fff","stroke-width":2});
           }
           data.push({
             index:index,
             xvalue:pt.rawx,
             yvalue:pt.rawy
           });
           $pointers[index].show();
         }else{
           $pointers[index] && $pointers[index].hide();
         }
       });

       var pt = Util.averagePoints(pts);
       if(pt){
         // 注意:这里的data是一个数组，跟只有一条线时的数据不同
         that.fire("pointover",{
           x:Util.roundToFixed(pt.x,10),
           y:Util.roundToFixed(pt.y,10),
           data:data
         });

         // 设置响应线
         var hoverLineOption = this.get("hoverLineOption") || {};
         if(hoverLineOption.isShow !== false){
           var padding = this.getPadding();
           hoverLineOption.pt = pt;
           hoverLineOption.padding = padding;
           hoverLineOption.innerHeight = that.get("innerHeight");
           hoverLineOption.innerWidth = that.get("innerWidth");
           $line = getOrCreateLine(this,hoverLineOption);
           $line.show();
         }
       }
     }
     onmousemoveTimer = setTimeout(function(){
                          each($pointers,function($pointer){
                                          $pointer && $pointer.hide();
                          });
                          $line = getOrCreateLine(that);
                          $line && $line.hide();
                        },1000);
   }
   //
   function onafterrender(ctx){
     var $xgrid = ctx.get("$xgrid")
       , $ygrid = ctx.get("$ygrid");

     $xgrid && $xgrid.toBack();
     $ygrid && $ygrid.toBack();
   }

   //==================== handlers end ====================

   var props = {
     inititialize:function(){
       var selector = this.get("renderTo");
       var container = D.get(selector);
       this.set("container",container);

       var themeCls = this.get("theme") || "ks-chart-default";

       this.colorManager = new ColorLib({
         themeCls:themeCls
       })
       // 0. 更新容器基本信息
       this.updateContainer();

       // 延时执行，以触发beforeRender事件
       var that = this;
       setTimeout(function(){
         that.render();
         // 必须要在render之后
         that.bindEvent();
       },0);
     },
     /**
      * 1. 数据处理，提取、过滤
      * 1.1 算出series数据的范围
      * 1.2 转换为paper上的点
      * 1.3 将paper上的点串联起来：a. 直接连接 b. 平滑过度连接
      * 1.4 保存series数据信息，用于绘制legend
      * 2. 移除之前绘制产生的dom
      * 3. 画x y 轴上的label
      * 3.1 x label a. 包含日期的格式化输出 b. 旋转的标注样式
      * 3.2 y label
      * 4. 化刻度尺
      * 4.1 x 刻度尺
      * 4.1.1 x网格
      * 4.2 y 刻度尺
      * 4.2.1 y网格
      * 5. 画x轴y轴
      * 5.1 xAxisLabel
      * 5.2 yAxisLabel
      * 5.3 画xAxisLabel、yAxisLabel
      * 6. legend
      * 7. tip
      * */
     render:function(){
       var that = this;

       // 防止在绘制过程还没完成，又进行绘制的情况
       if(this._isRunning){
         this._runningTimer && clearTimeout(this._runningTimer);
         this._runningTimer = setTimeout(function(){
                                that.render();
                              },300);

         return;
       }
       // 是否阻止渲染？
       if(this.fire("beforeRender") === false){
         return;
       }

       this._isRunning = true;
       // end

       // 垃圾回收，比如一些添加的文案等
       this._gc_el || (this._gc_el = []);
       while(this._gc_el.length){
         var gcel = this._gc_el.pop();
         gcel.remove();
       }

       var container = this.get("container")
         , paper = this.get('paper')

       var series = this.get("series") || [];
       if(series.length === 0){
         // 只移除线条

         // 移除线的连接点，隐藏线
         removeSeries2(this.get("$series"));
         return;
       }

       // 0.
       // var w = D.width(container), h = D.height(container); // 容器总宽高
       // var w2 , h2;                                         // 画布实际可用宽高
       // this.set("width",w);
       // this.set("height",h);

       // // 水平和竖直方向上的填充
       // var paddingx,paddingy;
       // var padding = this.getPadding();
       // paddingx = padding.paddingx;
       // paddingy = padding.paddingy;

       // // 出去paddingleft paddingtop x2 后的画布大小
       // w2 = w - paddingx*2;
       // h2 = h -  paddingy*2;

       // // 内部实际使用的宽度、高度
       // this.set("innerWidth",w2);
       // this.set("innerHeight",h2);

       var w = this.get("width");
       var h = this.get("height");
       var w2 = this.get("innerWidth");
       var h2 = this.get("innerHeight");

       var padding = this.getPadding();
       var paddingx = padding.paddingx;
       var paddingy = padding.paddingy;

       // 若还未初始化画布，创建一个
       if(!paper){
         paper = Raphael(container,w,h);
         this.set('paper',paper);
       }

       // 1. 数据处理
       var yAxis = this.get("yAxis") || {};
       var xAxis = this.get("xAxis") || {};
       var xrangeConfig = xAxis.range;
       rangeDuration = xrangeConfig && xrangeConfig.duration;

       // 1.0 过滤series
       series = filterSeries(series,xAxis,yAxis,function(xrange,yrange,x,y){
                  // 超出范围的情况1:指定范围
                  if((xrange && typeof xrange.min === 'number' && x < xrange.min) ||
                     (xrange && typeof xrange.max === 'number' && x > xrange.max) ||
                     (yrange && typeof yrange.min === 'number' && y < yrange.min) ||
                     (yrange && typeof yrange.max === 'number' && y > yrange.max)
                    ){
                    return false;
                    // 非数字的应该是断续的线
                  }else if(typeof x !== "number" || typeof y !== "number"){
                    return [null,null];
                    // 超出范围情况2：x轴超出固定的范围，比如一天
                  }else if(rangeDuration && isOutOfRange(x,rangeDuration)){
                    return false;
                  }else{
                    return [x,y]
                  }
                });

       // 1.1 算出series数据的范围
       var valuesAndDates = extractValuesAndDates(series);

       if(!valuesAndDates.values.length)
         return;

       // 2.
       this.removeElements();

       var Rxlabels = this.get("$xlabels");
       var Rylabels = this.get("$ylabels");
       var RjointPoints = this.get("$jointPoints");

       var valuerange = getValueRange(valuesAndDates.values,{
         range:yAxis.range,
         n:5
       });

       var valuerangelen = valuerange.range.length;

       var xrange;
       var yrange;
       var xrangeMin;
       var yrangeMin;
       var xrangeMax;
       var yrangeMax;
       var xrangeLen;
       var yrangeLen;

       // x轴配置
       var fixedInterval = this.get("fixedInterval");

       // y轴是否为标准时间格式
       var standardDate;
       var rangeDuration;
       // 1.1.1 固定范围的表示，比如24h，星期一，星期二
       if(xrangeConfig){
         if(rangeDuration){
           xrange = convertDateUnit2Nums(rangeDuration)
           if(rangeDuration.indexOf("day") > -1){
             xrangeMin = 0;
             xrangeMax = xrange[xrange.length - 1];
             xrangeLen = xrange.length;
           }else if(rangeDuration.indexOf("week")){
             xrangeMin = 1;
             xrangeMax = xrange[xrange.length - 1];
             xrangeLen = xrange.length;
           }else if(rangeDuration.indexOf("month")){
             xrangeMin = 1;
             xrangeMax = xrange[xrange.length -1];
             xrangeLen = xrange.length;
           }else{
             throw Error("duration is not in correct format");
           }
         }else{
           var xrangeStart = xrangeConfig.min
             , xrangeEnd = xrangeConfig.max
             , xrangeInterval = xrangeConfig.step || 1 ;

           // x轴数据是否为日期，默认为日期
           if(xrangeConfig.isDate !== false){
             standardDate = true;
           }

           if(typeof xrangeStart !== 'number')
             xrangeStart = Math.min.apply(Math,valuesAndDates.dates)
           if(typeof xrangeEnd !== 'number')
             xrangeEnd = Math.max.apply(Math,valuesAndDates.dates)

           // 返回不大于xrangeEnd的最大值
           var result = getIntRange(xrangeStart,xrangeEnd,xrangeInterval);

           xrange = result.range;
           xrangeMin = result.min;
           xrangeMax = result.max;
           xrangeLen = result.len;
         }
         // 1.1.2 标准日期格式，后面需要Util.formatDate的
       }else{
         standardDate = true;
         var rangeOption = {n:yAxis.num};
         if(!valuesAndDates.dates.length)
           return
         var daterange = getDateRange(valuesAndDates.dates,rangeOption);

         var daterangelen = daterange.range.length;

         var date_min = daterange.min
           , date_max = daterange.max

         // 日期缩放比例
         var date_unit = daterange.unit;

         xrange = daterange.range;
         xrangeMin = date_min;
         xrangeMax = date_max;
         xrangeLen = daterangelen;
       }

       yrange = valuerange.range;
       yrangeMin = valuerange.min;
       yrangeMax = valuerange.max;
       yrangeLen = valuerangelen;

       // 1.2 转换为paper上的点
       var points;
       var colorIndex = 0;

       // 通用化：将数据转换为paper上的点坐标（x,y），既可以处理24h、72h这样特殊的时间段，也可以处理真实的时间序列，比如股票图
       // [ [{x,y},{x,y}] , [...] , ...]
       var seriesPoints = data2points(series,{
         xmin:xrangeMin,
         xmax:xrangeMax,
         ymin:yrangeMin,
         ymax:yrangeMax,
         px:paddingx,
         py:paddingy,
         width:w2,
         height:h2
       });
       // 保存以便复用
       this.set("seriesPoints",seriesPoints);

       // 保持范围数据
       this.set("rangeData",{
         xmin:xrangeMin,
         xmax:xrangeMax,
         ymin:yrangeMin,
         ymax:yrangeMax
       })

       var $series = this.get("$series");
       if(!$series){
         $series = [];
         this.set("$series",$series);
       }

       S.each(seriesPoints,function(serie,index){
         var color = that.colorManager.getColor(index);
         var pointConfig = that.get("point"); // 绘制点的配置项，可以是fn
         var lineType = that.get("lineType"); // 连线选项

         //return {$line,$points,color} {路径,连接点,serie颜色}
         var $lines = that.get("$lines");
         if(!$lines){
           $lines = [];
           that.set("$lines",$lines);
         }
         var $line = getCachedLine(that,index);
         var series = that.get("series");
         var oldSerie = series[index];
         var newSerie;
         // 隐藏
         if(!oldSerie.hided){
           drawSerie(serie,{
             paper:paper,
             color:color,
             $line:$line,
             lineType:lineType,
             pointConfig:pointConfig,
             context:that
           }).then(function(newSerie){
             // 缓存连线
             $lines[index] = newSerie.$line;
             newSerie.name = oldSerie.name;
             $series[index] = newSerie;

             that.renderLegend()
             .then(function(){
               that.fire('afterRender');
               that._isRunning = false;
             })
             .fail(function(e){
               if(window.console)
                 window.console.log(e);
             });
             onafterrender(that);
           }).fail(function(e){

           });
           // 显示对应的path
           $line && $line.show();
         }else{
           newSerie = {
             color:color,
             $path:null
           };
           // 缓存连线
           $lines[index] = newSerie.$line;
           newSerie.name = oldSerie.name;
           $series[index] = newSerie;
         }
       });

       // // 用于legend的显示隐藏
       // for(var i=0;i<series.length;i++){
       //   var jointPoints = paper.set();                      // 连接点集合
       //   points = [];                                        // 用于连线的坐标点集合
       //   var color = this.colorManager.getColor(colorIndex); // 点颜色
       //   colorIndex++;

       //   var serie = series[i];
       //   var data = serie.data;

       //   if(data){
       //     for(var j=0;j<data.length;j++){
       //       var point = data[j];
       //       var x,y;

       //       var xy = data2point(point,{
       //         xmin:date_min,
       //         xmax:date_max,
       //         ymin:val_min,
       //         ymax:val_max,
       //         px:paddingx,
       //         py:paddingy,
       //         width:w2,
       //         height:h2
       //       });
       //       x = xy[0];
       //       y = xy[1];

       //       // 大数据的时候，可以不显示连接点
       //       var pointConfig = this.get("point");
       //       if(!pointConfig || pointConfig.isShow !== false){
       //         var jointPoint = paper.circle(x,y,4); // 连接点
       //         var dftColor = {"stroke":color.DEFAULT,"stroke-width":2,"fill":"#fff"};
       //         jointPoint.attr(dftColor);
       //         // TODO 事件每必要绑定这么多
       //         (function(jointPoint,color){
       //           jointPoint.hover(
       //             function(e){
       //               jointPoint.attr({"stroke":color.HOVER});
       //             },function(e){
       //                 jointPoint.attr({"stroke":color.DEFAULT});
       //               });
       //         })(jointPoint,color);
       //         // 所有的连接点
       //         RjointPoints.push(jointPoint);
       //         // 单条线的连接点
       //         jointPoints.push(jointPoint);
       //       }

       //       // 坐标信息
       //       points.push({x:x,y:y});
       //     }
       //   }

       //   // 1.3 将点串联起来
       //   var pathstring;
       //   if(this.get("lineType") === 'arc'){
       //     pathstring = curveLine(points);
       //   }else{
       //     pathstring = polyLine(points);
       //   }

       //   var line = paper.path(pathstring);

       //   // 设置线条样式 TODO
       //   // a. 使用默认颜色
       //   // b. 看是否有hook，应用hook
       //   line.attr({"stroke":color.DEFAULT,"stroke-width":2});
       //   (function(line,color){
       //     line.hover(
       //       function(e){
       //         line.attr({"stroke":color.HOVER,"stroke-width":3});
       //       },function(e){
       //           line.attr({"stroke":color.DEFAULT,"stroke-width":2});
       //         });
       //   })(line,color);

       //   Rlines.push(line);
       //   // 1.4 保存series数据信息，用于绘制legend
       //   serie.color = color;
       //   serie.$path = line;

       //   line.jointPoints = jointPoints;
       // }

       // 3. 画x、y label
       var xstartend = []; // x轴路径
       var ystartend = [];

       // 3.1 xaxis label
       for(var k=0;k<xrangeLen;k++){
         var x,y;
         x = k / (xrangeLen-1) * w2 + paddingx;
         y = h - paddingy;
         if(k === 0){
           xstartend.push({x:x,y:y});
         }else if(k === xrangeLen-1){
           xstartend.push({x:x,y:y});
         }
         var text;
         if(standardDate){
           var dateformat = this.get("dateformat") || "yyyy-MM-dd";
           text = Util.formatDate(
             new Date(xrange[k]),
             dateformat
           );
         }else if(rangeDuration){
           text = formatRange(k,rangeDuration);
         }else{
           text = xrange[k];
         }
         var xlabelConfig = this.get("xLabel");
         // 钩子，自定义文案样式
         if(xlabelConfig.hook && S.isFunction(xlabelConfig.hook)){
           text = xlabelConfig.hook.call(that,text);
         }
         var xlabel = paper.text(x,y,text);

         // 是否开启旋转
         if(xlabelConfig && xlabelConfig.rotate){
           xlabel.attr({
             "text-anchor":"end",
             "transform":"t-5,5r-45"+","+x+","+y
           });
         }else{
           xlabel.attr({
             "transform":"t0,12"
           });
         }
         Rxlabels.push(xlabel);
       }
       // 3.2 yaxis label
       for(var l=0;l<yrangeLen;l++){
         var x,y;
         x = paddingx;
         // y = paddingy + l/(yrangeLen -1) * h2;
         y = h - paddingy - l/(yrangeLen -1) * h2;

         if(l === 0){
           ystartend.push({x:x,y:y});
         }else if(l === yrangeLen - 1){
           ystartend.push({x:x,y:y});
         }

         // 不重复画第一个点
         // if(l){
         var ylabel = paper.text(x,y,valuerange.range[l]).attr({
           "text-anchor":"end",
           "transform":"t-5,0"
         });
         Rylabels.push(ylabel);
         // }
       }

       // 4.
       var topY = paddingy;         //
       var rightX = paddingx+w2;    //
       // 4.1 画y刻度尺
       var yRullerStyle = that.get("yRuller") || {};

       var x1 = paddingx, y1 = paddingy + h2 // 起始位置
         , x2 = paddingx, y2 = paddingy      // 末位置
         , n1 = yrangeLen                    // 分成的份数
       var rullerPointsY = getRullerPoints([x1,y1],[x2,y2],{n:n1,scale:yRullerStyle.size || 5});
       var hasRullerY = this.get("$rullerY");

       if(yRullerStyle.isShow !== false){
         // 画y的时候，要先翻转一下
         var $rullerY = drawRullerPoints(rullerPointsY,paper,{yaxis:true,style:yRullerStyle,path:hasRullerY});
         if(!hasRullerY){
           this.set("$rullerY",$rullerY);
           Util.fixSVGLineStyle($rullerY,Raphael.svg);
         }
       }
       // 4.1.1 网格绘制
       var $xgrid,$ygrid;
       var xGrid = this.get("xGrid") || {};
       if(xGrid.isShow !== false){
         $xgrid = drawGrid(topY,rightX,rullerPointsY,{paper:paper,context:that});
         this.set("$xgrid",$xgrid);
       }

       // 4.2 画x刻度尺
       var xRullerStyle = that.get("xRuller") || {}

       var x3 = paddingx, y3 = paddingy + h2      // 起始位置
         , x4 = paddingx + w2, y4 = paddingy + h2 // 末位置
         , n2 = xrangeLen                         // 分成的份数
       var rullerPointsX = getRullerPoints([x3,y3],[x4,y4],{n:n2,scale:xRullerStyle.size || 5});

       if(xRullerStyle.isShow !== false){
         var hasRullerX = this.get("$rullerX");
         var $rullerX = drawRullerPoints(rullerPointsX,paper,{xaxis:true,style:xRullerStyle,path:hasRullerX});
         if(!hasRullerX){
           this.set("$rullerX",$rullerX);
           Util.fixSVGLineStyle($rullerX,Raphael.svg);
         }
       }
       // 4.2.1 网格绘制
       var yGrid = this.get("yGrid") || {};
       if(yGrid.isShow !== false){
         $ygrid = drawGrid(topY,rightX,rullerPointsX,{paper:paper,vertical:true,context:that});
         this.set("$ygrid",$ygrid);
       }

       // 5. 画x轴y轴
       var xstartend2,ystartend2;

       // 5.1
       if(xAxis.isShow !== false){
         if(xAxis.arrow){
           xstartend2 = xstartend.map(function(i,index){
                      if(index){
                        return {x:i.x+15,y:i.y};
                      }else{
                        return {x:i.x,y:i.y};
                      }
                    });
         }else{
           xstartend2 = xstartend;
         }
         var xaxis = paper.path(polyLine(xstartend2)).attr(getDefaultLineStyle(S.merge({"stroke-width":1.5},xAxis.attr)));
         if(xAxis.arrow === true){
           xaxis.attr({'arrow-end':"classic-wide-long"});
         }
         this.set("$xaxis",xaxis);
         Util.fixSVGLineStyle(xaxis,Raphael.svg);
       }

       // 5.2
       if(yAxis.isShow !== false){
         if(yAxis.arrow){
           ystartend2 = ystartend.map(function(i,index){
                      if(index){
                        return {x:i.x,y:i.y - 15};
                      }else{
                        return {x:i.x,y:i.y};
                      }
                    });
         }else{
           ystartend2 = ystartend;
         }

         var yaxis = paper.path(polyLine(ystartend2)).attr(getDefaultLineStyle(S.merge({"stroke-width":1.5},yAxis.attr)));
         if(yAxis.arrow === true){
           yaxis.attr({'arrow-end':"classic-wide-long"});
         }
         this.set("$yaxis",yaxis);
         Util.fixSVGLineStyle(yaxis,Raphael.svg);
       }
       // 5.3
       var xAxisLabel = this.get("xAxisLabel") || {};
       if(xAxisLabel.isShow !== false && xstartend2){
         var xAxisLabelText = xAxisLabel.text || 'x';
         var $xAxisLabel = paper.text(xstartend2[1].x,xstartend2[1].y,xAxisLabelText).attr({"text-anchor":"start"});
         // 方便重绘时移除
         this.addGCel($xAxisLabel);
       }
       var yAxisLabel = this.get("xAxisLabel") || {};
       if(yAxisLabel.isShow !== false && ystartend2){
         var yAxisLabelText = xAxisLabel.text || 'y';
         var $yAxisLabel = paper.text(ystartend2[1].x,ystartend2[1].y,yAxisLabelText).attr({"text-anchor":"end"});
         // 方便重绘时移除
         this.addGCel($yAxisLabel);
       }

       // 6. 若配置了legend,绘制legend
       // 移到lineend动画完成后执行
       // this.renderLegend();

       // 7. 渲染tip
       var tipconfig = this.get("tip");
       if(tipconfig && tipconfig != false){
         this.renderTip();
       }
     },
     /**
      * 更新容器相关的信息
      * */
     updateContainer:function(){
       var container = this.get("container");

       var w = D.width(container) // 容器总宽高
         , h = D.height(container);
       var w2,h2;// 内部宽度高度

       this.set("width",w);
       this.set("height",h);

       // 水平和竖直方向上的填充
       var paddingx,paddingy;
       var padding = this.getPadding();
       paddingx = padding.paddingx;
       paddingy = padding.paddingy;

       // 出去paddingleft paddingtop x2 后的画布大小
       w2 = w - paddingx*2;
       h2 = h -  paddingy*2;

       // 内部实际使用的宽度、高度
       this.set("innerWidth",w2);
       this.set("innerHeight",h2);
     },
     bindEvent:function(){
       var con = this.get("container");
       E.on(con,"mouseleave",onmouseleave,this);

       // 大数据的时候，不绘制出连接点，需要通过mousemove来算出当前点
       var pointConfig = this.get("point");
       // if(pointConfig.isShow === false){
         // var that = this;
         // var bf = S.buffer(function(e){
         //            onmousemove.call(that,e);
         //          },30);
         // E.on(con,"mousemove",bf,this);
         E.on(con,"mousemove",onmousemove,this);
       // }
     },
     unbindEvent:function(){
       var con = this.get("container");
       E.detach(con,"mouseleave",onmouseleave);
     },
     clearData:function(){
       this.set("series",[]);
     },
     /**
      * 将数据转为图表上的点
      * @param arr {Array}
      * */
     data2point:function(arr){
       var innerWidth = this.get("innerWidth");
       var innerHeight = this.get("innerHeight");
       var padding = this.getPadding();
       var rangeData = this.get("rangeData");

       var x1 = arr[0];
       var y1 = arr[1];

       // 将x1，y1换算为画布上的点
       var x,y;
       if(typeof x1 === 'number'){
         x = padding.paddingx + (x1 - rangeData.xmin) / (rangeData.xmax - rangeData.xmin) * innerWidth;
       }
       // 注意y点的算法，要翻转一下! y值的画布的0点在上边，x轴的0点在左边（不用反转）
       if(typeof y1 === 'number'){
         y = padding.paddingy + (innerHeight - (y1 - rangeData.ymin) / (rangeData.ymax - rangeData.ymin) * innerHeight);
       }
       return [x,y];
     },
     text:function(x,y,s,opt){
       opt || (opt = {});
       var xy = this.data2point([x,y]);
       var paper;
       var $text;
       var x2,y2;
       if(typeof xy[0] === 'number' && typeof xy[1] === 'number'){
         paper = this.get("paper");
         x2 = xy[0];y2 = xy[1];
         var attr = opt.attr || {};
         var offset = opt.offset || {};
         var offsetx = offset.x || 0;var offsety = offset.y || 0;
         $text = paper.text(x2+offsetx,y2+offsety,s).attr(attr);
         // 如果不是手动指定了不回收
         if(opt.autoGC != false){
           this.addGCel($text);
         }
       }
       return $text;
     },
     /**
      * 添加要gc的元素
      * */
     addGCel:function(el){
       this._gc_el || (this._gc_el = []);
       if(indexOf(el,this._gc_el) === -1){
         this._gc_el.push(el);
       }
     },
     /**
      * 画线
      * @param line {String} x=10
      * @param opt  {Object}
      *   - opt.raw {Bool} 是否转换坐标
      * */
     drawLine:function(line,opt){
       opt || (opt = {});
       var arr = line.split("=");
       var axis = arr[0];
       var value = parseFloat(arr[1]);
       var val;

       var innerWidth = this.get("innerWidth");
       var innerHeight = this.get("innerHeight");
       var padding = this.getPadding();
       var paper = this.get("paper");
       var $line,
           start = {},
           end = {};
       if(opt.raw){
         if(axis === 'x'){
           start.x = value;
           start.y = padding.paddingy;
           end.x = start.x;
           end.y = innerHeight + padding.paddingy;
         }else{
           start.x = padding.paddingx;
           start.y = value + padding.paddingy;
           end.x = innerWidth + padding.paddingx;
           end.y = value + padding.paddingy;
         }
       }else{
         var rangeData = this.get("rangeData");
         // TODO 范围之外就不画出来了
         if(axis === "x"){
           if(value > rangeData.xmax || value < rangeData.xmin)
             return false;
           start.x = padding.paddingx + (value - rangeData.xmin) / (rangeData.xmax - rangeData.xmin) * innerWidth;
           start.y = padding.paddingy;
           end.x = start.x;
           end.y = start.y + innerHeight;
         }else{
           if(value > rangeData.ymax || value < rangeData.ymin)
             return false;
           start.x = padding.paddingx;
           start.y = (value - rangeData.ymin) / (rangeData.ymax - rangeData.ymin) * innerHeight;
           // 反转一下
           start.y = padding.paddingy + innerHeight - start.y;
           end.x = start.x + innerWidth;
           end.y = start.y;
         }
       }
       $line = paper.path(["M",start.x,start.y,"L",end.x,end.y].join(","));
       Util.fixSVGLineStyle($line,Raphael.svg);
       $line.attr(getDefaultLineStyle(opt.style));
       return {
         $path:$line,
         start:start,
         end:end
       };
     },
     /**
      * 图表主体区域盒子
      * */
     getBBox:function(){
       var padding = this.getPadding()
         , width = this.get("innerWidth")
         , height = this.get("innerHeight")
       return {
         width:width,
         height:height,
         left:padding.paddingx,
         top:padding.paddingy
       }
     },
     getPadding:function(){
       var paddingx = S.isNumber(this.get("paddingx")) ? this.get("paddingx") : 15;
       var paddingy = S.isNumber(this.get("paddingy")) ? this.get("paddingx") : 15;
       return {
         paddingx:paddingx,
         paddingy:paddingy
       }
     },
     // 返回legend所需要的数据
     buildLegendParts:function(){
       var ret = [];
       var legendString = '';
       ret = S.map(this.get("$series"),function(i){
               legendString+=i.name;
               return {DEFAULT:i.color.DEFAULT,HOVER:i.color.HOVER,text:i.name,$path:i.$path};
       });
       this.legendString = legendString;
       return ret;
     },
     /**
      * 渲染图标
      * */
     renderLegend:function(){
       var that = this;
       var cfg = that.get("legend");

     var defer = new Promise.Defer()
       , promise = defer.promise;

       if( cfg && cfg.isShow != false){
         var legend = this.get("$legend");
         if(legend){
           legend.destroy && legend.destroy();
         }
         S.use("gallery/kcharts/1.3/legend/index",function(S,Legend){
           var paper = that.get("paper")
             , $con = that.get("container")
             , padding = that.getPadding()
             , oldLegendString = that.legendString
             , parts = that.buildLegendParts() // buildLegendParts后，重建_legendString
             , newLegendString = that.legendString

           // legendString未发生变化，不用再重新绘制
           if(oldLegendString === newLegendString){
             defer.resolve();
             return;
           }
           var legend = this.get("legend");
           // 如果之前已经创建过了，那么先销毁
           if(legend){
             legend.destroy && legend.destroy();
           }

           var legendCfg = {
             paper:paper,
             container:$con,
             bbox:that.getBBox(),//图表主体的信息
             iconAttrHook:function(index){//每次绘制icon的时调用，返回icon的属性信息
               var f = parts[index].color;
               return {
                 fill:f
               }
             },
             spanAttrHook:function(index){//每次绘制“文本描述”的时候调用，返回span的样式
               var color = Raphael.getRGB(parts[index].DEFAULT);
               return {
                 color:color.hex
               }
             },
             config:parts
           };

           legend = new Legend(S.merge(legendCfg,cfg));
           legend.on("click", function(e) {
			 var i = e.index,
				 $text = e.text,
				 $icon = e.icon,
				 el = e.el;
			 if (el.hide != 1) {
			   this.hideLine(i);
			   el.hide = 1;
			   el.disable();
			 } else {
			   this.showLine(i);
			   el.hide = 0;
			   el.enable();
			 }
		   },that);
           that.set("legend",legend);
           // the end
           defer.resolve();
         });
       }
       return promise;
     },
     renderTip:function(tipconfig){
       if(this.get("$tip")){
         return;
       }
       tipconfig || (tipconfig = this.get("tip"));
       if(!tipconfig)
         return;
	   var that = this;
       var container = that.get("container");

       S.use("gallery/kcharts/1.3/tip/index,gallery/kcharts/1.3/tip/assets/tip.css",function(S,Tip){
         var bbox = that.getBBox();
         // 修正bbox字段
         bbox.x = bbox.left;
         bbox.y = bbox.top;

         var themeCls = tipconfig.themeCls || "ks-chart-default";

		 var boundryCfg = tipconfig.boundryDetect ? bbox : {},
		     tipCfg     = S.mix(tipconfig, {
			   rootNode: container,
			   clsName: themeCls,
			   boundry: boundryCfg
		     }, undefined, undefined, true);

	     var tip  = new Tip(tipCfg);
         that.set("$tip",tip);

         that.on("pointover",function(e){
           var x = e.x + 20
             , y = e.y
             , index = e.index
             , xval = e.xvalue
             , yval = e.yvalue
           if(S.isFunction(tipconfig.template)){
             tip.setContent(tipconfig.template.apply(tip,[e.index,e.data]));
           }else{
             tip.renderTemplate(tipconfig.template,e);
           }
           tip.fire('move',{x:x,y:y,style:that.processAttr(tipconfig.css, {DEFAULT:"yellow",HOVER:"blue"})});
         },that);
       });
     },
     processAttr:function(attrs,color){
	   var newAttrs = S.clone(attrs);
	   for (var i in newAttrs) {
		 if (newAttrs[i] && typeof newAttrs[i] == "string") {
		   newAttrs[i] = newAttrs[i].replace(COLOR_TPL, color);
		 }
	   }
	   return newAttrs;
     },
     /**
      * 隐藏线以及其连接点
      * */
     hideLine:function(i){
       if(S.isNumber(i)){
         var serie = this.get("$series")[i]
           , rawSerie = this.get("series")[i]

         if(serie){
           var $line = serie.$line;
           $line && $line.hide();
           var $pts = serie.$points;
           $pts && $pts.hide();
           // 打标
           rawSerie.hided = true;
         }else{
           // 打标
           rawSerie.hided = true;
           this.render();
         }
       }
     },
     /**
      * 显示线以及其连接点
      * */
     showLine:function(i){
       if(S.isNumber(i)){
         var serie = this.get("$series")[i]
           , rawSerie = this.get("series")[i]
         if(serie && serie.$line){
           var $line = serie.$line;
           $line && $line.show();
           var $pts = serie.$points;
           $pts && $pts.show();
           // 打标
           rawSerie.hided = false;
         }else{
           // 打标
           rawSerie.hided = false;
           this.render();
         }
       }
     },
     removeElements:function(){
       var paper = this.get("paper");
       // 0.
       // 0.1 移除点，不移除连线，用于做动画
       removeSeries(this.get("$series"));

       // 0.2 移除Rxlabels
       var Rxlabels = this.get("$xlabels");
       if(Rxlabels){
         removeRaphaelElements(Rxlabels);
       }else{
         Rxlabels = paper.set();
         this.set("$xlabels",Rxlabels);
       }

       // 0.3 移除Rxlabels
       var Rylabels = this.get("$ylabels");
       if(Rylabels){
         removeRaphaelElements(Rylabels);
       }else{
         Rylabels = paper.set();
         this.set("$ylabels",Rylabels);
       }

       // 0.4 移除rullers
       // if(this.get("$rullerX")){
       //   this.get("$rullerX").remove();
       // }
       // if(this.get("$rullerY")){
       //   this.get("$rullerY").remove();
       // }

       // 0.5 移除xaxis 、yaxis
       if(this.get("$xaxis")){
         this.get("$xaxis").remove();
       }
       if(this.get("$yaxis")){
         this.get("$yaxis").remove();
       }
       // 0.6 移除曲线连接点
       var RjointPoints = this.get("$jointPoints");
       if(RjointPoints){
         removeRaphaelElements(RjointPoints);
       }else{
         RjointPoints = [];
         this.set("$jointPoints",RjointPoints);
       }
     },
     /**
      * 增量添加数据
      * TODO 动态增加点后，使用上次计算结果的缓存
      * */
     addSeries:function(newSeries){
       var series = this.get("series")
       for(var i=0,l=newSeries.length;i<l;i++){
         Util.combineSeries(newSeries[i],series);
       }
     },
     /**
      * 全量更新数据
      * */
     updateAllSeries:function(series){
       if(series){
         this.clearData();
         this.set("series",series);
         this.render();
       }
     },
     destroy:function(){
       this.unbindEvent();
       this.removeElements();
     }
   }
   var RealTime;
   if(Base.extend){
     RealTime = Base.extend(props);
   }else{
     RealTime = function(cfg){
       this.set(cfg);
       this.inititialize();
     }
     S.extend(RealTime,Base,props);
   }
   return RealTime;
 },{
   requires:["gallery/kcharts/1.3/raphael/index","base","promise","gallery/kcharts/1.3/animate/index","./util","dom","event","gallery/kcharts/1.3/tools/color/index"]
 });

