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

    // console.log(diff);

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
      "weeek":3600*24*7000,
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

    // 6.
    labelnums = labelnums.map(function(i){
                  return new Date(i*UNIT);
                });
    return labelnums;
  }

  Util.getlabel = getlabel;

  // var timeseq = [+new Date("2013-12-03 12:00") , +new Date("2013-12-03 12:05") , +new Date("2013-12-03 12:08") , +new Date("2013-12-03 12:10") , +new Date("2013-12-03 12:30") , +new Date("2013-12-03 12:35")
  //               ];
  // var ret = getlabel(timeseq,6);
  // console.log(
  //   ret
  // )

  // ==================== end getlabel ====================
