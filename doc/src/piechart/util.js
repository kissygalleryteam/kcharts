/**
 * sector数据处理
 * */
 define(function(require, exports, module) {
// Sector,Color,Raphael
  var Util = require("util"),
  Sector = require("kg/kcharts/5.0.1/piechart/sector"),
  Color = require("kg/kcharts/5.0.1/tools/color/index"),
  Raphael = require("kg/kcharts/5.0.1/raphael/index");

  var isArray = Util.isArray
  function flat(a){
    var ret = []
      , ts = Object.prototype.toString
      , basictype = ts.call(a)
    function rec(a){
      for(var i=0,l=a.length;i<l;i++){
        if(ts.call(a[i])  == basictype){
          rec(a[i]);
        }else{
          ret.push(a[i]);
        }
      }
    }
    rec(a);
    return ret;
  }
  // 扁平的filter
  function flatFilter(groups,fn){
    var ret = []
    function rec(groups,depth){
      for(var i=0,l=groups.length;i<l;i++){
        if(Util.isArray(groups[i])){
          rec(groups[i],depth++);
        }else{
          if(fn(groups[i])){
            ret[depth] || (ret[depth] = []);
            ret[depth].push(groups[i]);
          }
        }
      }
    }
    rec(groups,0);
    return ret;
  }
  /**
   * filter 原始数据并返回其它
   * @param fn 过滤函数
   * @param combine 是否合并小数据
   * @param otherText "其它"的文案
   * */
  function filterdata(data,fn,combine,otherText){
    var ret = []
      , other = 0
      , _data
      , sum = sumObject2(data)
    function rec(data,container){
      for(var i=0,l=data.length;i<l;i++){
        if(Util.isArray(data[i].data)){
          var index = container.push(S.mix({},data[i],true,["label"]));
          container[index].data = [];
          rec(data[i].data,container[index].data);
        }else{
          var d = data[i].data , percent = d/sum
          if(fn(d,percent)){
            // ret[depth] || (ret[depth] = []);
            // ret[depth].push(data[i]);
            container.push(data[i]);
          }else{
            other+=data[i].data;
          }
        }
      }
    }
    rec(data,ret);
    // 如果合并产生一个数据组，“其它”
    if(combine === true){
      ret.push({label:otherText,data:other});
    }
    return ret;
  }
  /**
   * 计算对象深度，可以是Array数组和Object对象
   * */
  function depth(o){
    var basictype = Object.prototype.toString.call(o)
    function len(o){
      var ll = []
        , flag = 0
      for(var x in o){
        if(Object.prototype.toString.call(o[x]) == basictype){
          ll.push(1 + len(o[x]));
          flag = 1;
        }
      }
      if(flag){
        return Math.max.apply(null,ll)
      }else{
        return 1;
      }
    }
    return len(o);
  }
  function objectdepth(o){
    function len(o){
      var ll = []
        , max
      for(var i=0,l=o.length;i<l;i++){
        if(typeof o[i].data == 'object'){
          ll.push(1+len(o[i].data));
        }
      }
      if(ll.length){
        max = Math.max.apply(null,ll)
      }else{
        max =  0;
      }
      return max;
    }
    var ret = len(o);
    return ret+1;
  }
  function sum(arr){
    arr = flat(arr);
    var s = 0
    for(var i=0,l=arr.length;i<l;i++){
      s = s+arr[i]
    }
    return s;
  }
  /**
   * 计算一组对象中某个字段的值的和，比如：
   * @param [{value:1},{value:2}]
   * @return 3
   * 缓存计算结果，避免重复计算
   * */
  function sumObject(o,fn){
    var s = 0
    for(var i=0,l=o.length;i<l;i++){
      var ret = fn(o[i])
      if(ret){
        s = s+ret;
      }
    }
    return s
  }
  // 对sumObject的一个简单的包装
  function sumObject1(oo){
    return sumObject(oo,function(o){
             if(o.value && Util.isNumber(o.value)){
               return o.value
             }else{
               return 0;
             }
           })
  }
  // 计算树状data的和
  function sumObject2(o){
    var s = 0
    for(var i=0,l=o.length;i<l;i++){
      if(Util.isArray(o[i].data)){
        s = s+sumObject2(o[i].data)
      }else{
        s = s+o[i].data
      }
    }
    return s;
  }
  function traverse(o){
    /**
     * groups:
     * 用于统计各个圆饼用于计算百分比
     * 二维数组
     * 饼图由里面向外面辐射的数据
     *
     * set:
     * 分组用于动画一起动
     * */
    var groups = []
      , set = []
      , ret = {}
      , datadepth

    function rec(o,depth,group){
      for(var i=0,l=o.length;i<l;i++){
        var g
        if(!group){
          g = i+1;
        }else{
          g = group;
        }

        if(isArray(o[i].data)){
          var s = sumObject2(o[i].data)
          o[i].value = s

          groups[depth] || (groups[depth] = []);
          groups[depth].push(o[i]);

          set[g-1] || (set[g-1] = []);
          set[g-1].push(o[i]);

          rec(o[i].data,depth+1,g);
        }else{
          o[i].value = o[i].data;
          groups[depth] || (groups[depth] = []);
          groups[depth].push(o[i]);

          if(depth < datadepth - 1){
            var ii=depth+1
            o[i].crossdepth = depth
            while(ii<datadepth){
              groups[ii] || (groups[ii] = []);
              groups[ii].push(o[i]);
              ii++;
            }
          }

          set[g-1] || (set[g-1] = []);
          set[g-1].push(o[i]);
        }
      }
    }
    datadepth = objectdepth(o)
    rec(o,0);
    ret.groups = groups
    ret.set = set;
    return ret;
  }
  /**
   * 每帧的操作
   * */
  function onframe(attrname,value,props,index,len,opts){
    var start = this.el.get("start")
      , end
      , prev = this.prev
      , donutindex = this.el.get("donutIndex")
    if(donutindex){
      start = prev.el.get('end');
    }

    end = start - value
    this.el.set("start",start);
    this.el.set("end",end);
  }
  /**
   * 计算group中各个分部的百分比
   * 将这个百分比换算成360度的占比
   * 根据占比度数画出path
   * @param data {Object}
   * [{"value":1},{"value":2}]
   * 处理后成为
   * [{"value":1,"percent":.33},{"value":2,"percent":.66}]
   * @return sector array
   * note : 利用了函数的副作用，group本身被改变了
   * */
  function buildPropsArray(groups,pie){
    var rs = pie.get('rs')  // 多层饼图的梯度半径，必须由小到大
      , $sectors = []
      , interval = pie.get('interval')  || 2
      , paper = pie.get('paper')
      , cx = pie.get('cx')
      , cy = pie.get('cy')
      , pathcfg = pie.get('pathcfg')
      , donut = !!pie.get("donut")
      , initdeg = pie.get("initdeg")
    if(initdeg == undefined){
      initdeg = 90;
    }

    for(var i=0,l=groups.length;i<l;i++){
      var group = paper.set();

      var s = sumObject1(groups[i])
        , degsum = 0
      for(var j=0,ll=groups[i].length;j<ll;j++){
        var d = groups[i]
          , f = d[j] // frame data
          , r
          , cross = typeof f.crossdepth == 'number'
          , $path  // 扇形路径

        // 如果是跨group的扇形，并且没有到最外层，跳过
        if(cross && i<l-1){
          continue;
        }
        // 外层不是画扇形，而是画面包圈
        if(i){
          // 如果i>0，且为跨group的
          if(cross){
            if(f.crossdepth == 0){
              r = [rs[i]]
            }else{
              r = [rs[f.crossdepth-1]+interval,rs[i]]
            }
          }else{
            r = [rs[i-1]+interval,rs[i]]
          }
        }else{
          // 如果i==0,且为跨group的
          r = rs[i];
        }

        // 面包圈只对一维数据有效
        if(donut && l==1){
          r = [rs[0],rs[1]]
        }

        f.el = new Sector({paper:paper,cx:cx,cy:cy,r:r,start:initdeg,end:initdeg-1,pathcfg:pathcfg,framedata:f});

        $path = f.el.get("$path")

        //
        group.push($path);

        f.el.set('group',group);
        f.el.set('groupLength',l);
        f.el.set("framedata",f);

        // 设置groupindex属性
        var groupindex = []
        if(cross){
          var jj = f.crossdepth
          while(jj<l){
            groupindex.push(jj);
            jj++;
          }
        }else{
          groupindex.push(i);
        }
        //end

        f.el.set('groupIndex',groupindex);
        f.el.set('donutIndex',j);
        f.el.set('label',f.label || '');
        $sectors.push(f.el);
        // f.el.addTarget(pie);
        (function(el){
          f.el.on('mouseout',function(e){
            pie.fire('mouseout',{
              sector:el
            });
          });
          f.el.on('mouseover',function(e){
            pie.fire('mouseover',{
              sector:el
            });
          });

          f.el.on('click',function(e){
            pie.fire('click',{
              sector:el
            });
          });
        })(f.el);

        f.frame = onframe;
        f.from || (f.from = {});
        f.to || (f.to = {});
        f.percent = f.value/s
        f.from.deg = 0;

        if(j == ll-1){
          f.to.deg = 360 - degsum;
        }else{
          f.to.deg = f.percent*360
        }
        degsum = degsum + f.percent*360
        // 记录前后
        if(j>0){
          f.prev = d[j-1]
        }else{
          f.prev = d[ll-1]
        }
        if(j<ll-1){
          f.next = d[j+1]
        }else{
          f.next = d[0]
        }
      }
    }
    return $sectors;
  }
  // 产生set
  function buildPropsArray2(set,pie){
    var paper = pie.get('paper')
    for(var i=0,l=set.length;i<l;i++){
      var rset = paper.set()
      for(var j=0,ll=set[i].length;j<ll;j++){
        var setij = set[i][j]
          , setij$el = setij.el
          , $path = setij$el.get('$path')
        rset.push($path);
        setij$el.set('set',rset);
      }
    }
    return;
  }
  function getMinPercent(val){
    var ret
    if(!val || val<0 || val>1){
      ret = .1;
    }
    return ret;
  }
  function getSetColor(set){
    return set && set.length && set[0].color
  }
  function degrade(color,len,min){
    min || (min = 0);
    if(color){
      this.color = color;
      var rgbcolor = Raphael.getRGB(color)
        , hsb,h,s,b
        , step
      hsb = Raphael.rgb2hsb(rgbcolor)
      h = hsb.h
      s = hsb.s
      b = hsb.b
      step = (s-min)/len
      this.step = step
      this.h = h;
      this.s = s;
      this.b = b;
    }
  }
  degrade.prototype.getColor = function(){
    var ret
    if(this.color){
      ret = "hsb("+[this.h,this.s-=this.step,this.b].join(",")+")";
    }
    return ret;
  }
  // 自动计算颜色hsb
  function buildPropsArray3(set,pie,len){
    var paper = pie.get('paper')
      , color = pie.get('color')
      , theme = pie.get('theme')
      , themeColor = new Color({"themeCls":theme || 'ks-chart-default'})

    var initial = color && color.initial
      , initialColor = initial && Raphael.getRGB(initial)
      , min = color && getMinPercent(color.min)
      , icolor = new degrade(initialColor,len,min)
      , degsum = 0
      , prevColor = initialColor
      , gradienton = pie.get("gradient")

    for(var i=0,l=set.length;i<l;i++){
      var iniColor = set[i][0].color
        , llen = set[i].length
        , setcolor = new degrade(iniColor,llen)
      for(var j=0,ll=set[i].length;j<ll;j++){
        var setij = set[i][j]   //
          , setij$el = setij.el // 对应的sector
          , framedata = setij$el.get("framedata")
          , $path = setij$el.get('$path')
          , ss
          , c;
        if(setij.color){
          c = setij.color
        }else{
          var scolor
          scolor = setcolor.getColor()
          if(scolor){
            c = scolor
          }else{
            var sscolor = icolor.getColor()
            if(sscolor){
              c = sscolor
            }else{
              // theme color
              c = themeColor.getColor(i+j)['DEFAULT'];
            }
          }
        }

        // 用于tip
        setij$el.set("fill",c);

        $path.attr("fill",c);
        //渐变色
        var gradientColor = framedata.gradientcolor || prevColor;
        gradienton && $path.attr("gradient",(degsum+framedata.to.deg/2)+"-"+gradientColor+"-"+c);
        degsum += framedata.to.deg
        prevColor = c;
      }
    }
    return;
  }
  // 重新计算百分比
  function buildPropsArray4(groups,pie){
    groups = flatFilter(groups,function(g){
               var $path = g.el.get("$path");
               if(g.hide){
                 $path.hide();
                 return false;
               }else{
                 $path.show();
                 return true;
               }
             });
    for(var i=0,l=groups.length;i<l;i++){
      var group = groups[i]
        , s = sumObject(group,function(o){
                if(o.value && !o.hide && Util.isNumber(o.value)){
                  return o.value
                }else{
                  return 0;
                }
              })
        , degsum = 0

      for(var j=0,ll=group.length;j<ll;j++){
        var frame = group[j]
          , $path = frame.el.get("$path")
        frame.percent = frame.value/s;
        if(j == ll-1){
          frame.to.deg = 360 - degsum;
        }else{
          frame.to.deg = frame.percent*360
        }
        degsum = degsum + frame.percent*360
        // 记录前后
        if(j>0){
          frame.prev = group[j-1]
        }else{
          frame.prev = group[ll-1]
        }
        if(j<ll-1){
          frame.next = group[j+1]
        }else{
          frame.next = group[0]
        }
      }
    }
  }
  // utility
  function isRightAngel(deg){
    deg = deg%360;
    while(deg<0){
      deg+=360
    }
    if((0<=deg && deg<=90)|| (deg>270 && deg<=360)){
      return true;
    }
    return false;
  }
  function initpath(pie){
    var raw = traverse(pie.get('data'))
      , $sectors =  buildPropsArray(raw.groups,pie)
      , color = pie.get("color")
      , hsb = pie.get("hsb")

    var flatdata = flat(raw.groups);
    buildPropsArray2(raw.set,pie);
    buildPropsArray3(raw.set,pie,flatdata.length);
    return {
      $sectors:$sectors,
      groups:raw.groups,
      set:raw.set,
      framedata:flatdata
    }
  }
  //判断a，b的误差是否小于c
  function closeto(a,b,c){
    c || (c = 5);
    return Math.abs(a-b) < c;
  }

  var util = {
      initPath:initpath,
      fillColor:buildPropsArray3,
      adjustFrameData:buildPropsArray4,
      isRightAngel:isRightAngel,
      filterdata:filterdata,
      closeto:closeto
  }

  return util;
});
