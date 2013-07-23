;// -*- coding: utf-8; -*-
KISSY.add('gallery/kcharts/1.2/piechart/animation',function(S,Anim){
  var Easing = Anim.Easing
    , requestAnimFrame = window.requestAnimationFrame       ||
                         window.webkitRequestAnimationFrame ||
                         window.mozRequestAnimationFrame    ||
                         window.oRequestAnimationFrame      ||
                         window.msRequestAnimationFrame     ||
                         function (callback) {
                           return setTimeout(callback, 16);
                         }
    , cancelAnimationFrame = window.cancelAnimationFrame       ||
                             window.webkitCancelAnimationFrame ||
                             window.mozCancelAnimationFrame    ||
                             window.oCancelAnimationFrame      ||
                             window.msCancelAnimationFrame     ||
                             clearTimeout
    , dft
  dft = {
    duration:1000,
    easing:'easeNone'
  }
  function Animate(fromProps,toProps,opts){
    opts || (opts = {});
    opts = S.merge(dft,opts);

    var begin = +new Date
      , end = begin + opts.duration
      , now = begin
      , diff = opts.duration
      , fx = Easing[opts.easing]
      , frame = opts.frame || S.noop
      , props = {}
      , ended = false // 动画是否已经结束
      , run
      , _duration = opts.duration
      , timer

    // 用于resume的数据
    // |---a----|_b__|--c--|
    var a = 0
      , b = 0
      , stopTime
      , resumeable = false;

    // do some clean
    for(var x in fromProps){
      if(!toProps[x] && toProps[x] != 0){
        delete fromProps[x]
      }else{
        props[x] = null;
      }
    }

    run = function(){
      var s,t;
      t = a/diff
      s = fx(t)
      if(S.isArray(fromProps)){
        for(var i=0,len=fromProps.length;i<len;i++){
          props[i] = fromProps[i] + (toProps[i] - fromProps[i])*s;
        }
      }else{
        for(var x in fromProps){
          props[x] = fromProps[x] + (toProps[x] - fromProps[x])*s;
        }
      }
      if(a<_duration){
        frame.call(api,props,t);
        timer = requestAnimFrame(run);
      }else{
        frame.call(api,toProps,1);
        ended = true;
        if(opts.endframe){
          opts.endframe.call(api,toProps,1);
        }
      }
      now = +new Date;
      a = now - begin - b;
    }
    function saveFrame(){
      if(!ended){
        stopTime = +new Date;
        resumeable = true;
      }
    }
    function restoreFrame(){
      var _now = +new Date;
      b = b + _now  - stopTime;
      resumeable = false;
    }
    var api =  {
      stop:function(){
        cancelAnimationFrame(timer);
      },
      resume:function(){
        if(resumeable){
          restoreFrame();
          run();
        }
      },
      pause:function(){
        if(!resumeable){
          saveFrame();
          cancelAnimationFrame(timer);
        }
      },
      isRunning:function(){
        return !ended;
      }
    }
    run();
    return api;
  }
  Animate.AnimateObject = function (props,cfg){
    var AnimMap = []
      , AnimMapIndex = 0

    var from = {}
      , to = {}
      , len = props.length
    S.each(props,function(p,index){
      var f = p.from
        , t = p.to
        , key
      for(var x in f){
        key = AnimMapIndex++
        AnimMap[key] = [p,x,index]
        from[key] = f[x]
        to[key] = t[x]
      }
    });
    var anim = Animate(from,to,{
      easing:cfg.easing,
      duration:cfg.duration,
      frame:function(props,t){
        for(var x in props){
          var map = AnimMap
            , p = map[x][0]
            , attrname = map[x][1]
            , index = map[x][2]
            , from = p.from
          from[attrname] = props[x];
          p.frame && p.frame(attrname,props[x],props,index,len);
        }
      },
      endframe:function(props,t){
        for(var x in props){
          var map = AnimMap
            , p = map[x][0]
            , attrname = map[x][1]
            , index = map[x][2]
          p.endframe && p.endframe(attrname,props[x],index,props);
        }
        cfg.endframe && cfg.endframe();
      }
    })
    return anim;
  }
  return Animate;
},{
  requires:['anim']
});// -*- coding: utf-8; -*-
KISSY.add("gallery/kcharts/1.2/piechart/label",function(S){
  var D = S.DOM

  // helpers
  function distance(a,b){
    var x1,x2,y1,y2;
    x1 = a[0],y1=a[1],x2=b[0],y2=b[1];
    return Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
  }

  function closest(list,i,least_n){
    function rec(l,min,min_el,min_el_left){
      if(least_n >= l.length){
        return {min:min_el,left:min_el_left};
      }else if(min > distance(i,l[0])){
        var left = l.slice(1);
        return rec(left,distance(i,l[0]),l[0],left);
      }else{
        return rec(l.slice(1),min,min_el,min_el_left);
      }
    }
    return rec(list,Infinity,list[0],[])
  }
  function find(l1,l2){
    function iter(l,s,acm){
      if(l.length == 0){
        return acm;
      }else{
        var ret = closest(s,l[0],l.length-1);
        acm.push(ret.min);
        return iter(l.slice(1),ret.left,acm);
      }
    }
    return iter(l1,l2,[]);
  }
  // end

  var $detector
  function blockSizeOf(html){
    $detector || ($detector = S.Node("<div/>").css({"visibility":"hidden","position":"fixed","left":'-9999em',"top":0}).appendTo(document.body));
    $detector.html(html);
    return {
      width:D.width($detector),
      height:D.height($detector)
    }
  }

  function Label(cfg){
    this.set(cfg)
    this.init();
  }
  S.extend(Label,S.Base,{
    init:function(){
      var $label = this.get('label')
        , x = this.get('x')
        , y = this.get('y')
        , size = this.get('size')
        , pie = this.get('pie')
        , sector = this.get("sector")
        , container = pie.get('container')

      $label.css({"position":"absolute","left":x+'px',"top":y+'px',width:size.width+'px',"height":size.height+'px'}).appendTo(container);
      this.set('el',$label)
    },
    destroy:function(){
      this.get("el").remove();
      this.get("$path").remove();
    }
  })
  /**
   * 分布策略：
   * 自然分布
   * 若空间不足，拓展空间
   * */

  function Labels(pie,$sectors,bool_left){
    var paper = pie.get('paper')
      , container = pie.get('container')
      , count = $sectors.length
      , paperHeight //画布高度
      , pieHeight //饼图高度
      , unitHeight //单条label的高度
      , minLalebelHeight //排布label需要的最小高度
      , fromY // 画label的上边界
      , toY // 下边界
      , xys = []
      , xysr = []
      , xysr2 = []
      , cx = pie.get('cx')
      , cy = pie.get('cy')
      , rs = pie.get('rs')
      , paddingDonutSize1 = pie.get("padding") || 20 // label 和 pie 之间的距离
      , paddingDonutSize2 = paddingDonutSize1+10
      , R
      , R1
      , R2
      , cos = Math.cos
      , sin = Math.sin
      , asin = Math.asin
      , pi = Math.PI
      , rad = Math.PI/180
      , $firstSector

    this.labels = []
    $firstSector = $sectors[0]

    if(!$firstSector)return;

    unitHeight = blockSizeOf($firstSector.get("label")).height
    R = Math.max.apply(Math,rs)
    R1 = R + paddingDonutSize1
    R2 = R + paddingDonutSize2

    fromY = cy - R2;
    toY = cy + R2;
    for(fromY+=unitHeight;fromY<toY-unitHeight;fromY+=unitHeight){
      // x=a+rcosθ y=b+rsinθ
      // (y-b)/r = sinθ
      var y = fromY;
      var t = Math.asin((y-cy)/R2);
      var x = cx+R2*Math.cos(t);
      x = bool_left ? (2*cx - x):x;
      xys.push([x,y]);

      // paper.circle(x,y,4);
      // paper.circle(2*cx - x,y,4);
    }
    // 若不足以放下所有的label，剔除比例较小的

    if($sectors.length>xys.length){
      $sectors = $sectors.sort(function(a,b){
                   var d1 = Math.abs(a.get("start") - a.get("end"))
                     , d2 = Math.abs(b.get("start") - b.get("end"))
                   return d1>d2 ? -1 : (d1<d2) ? 1 : 0;
                 });
      $sectors = $sectors.slice(0,xys.length);
    }

    $sectors = $sectors.sort(function(a,b){
                 var ay = a.get("middley")
                   , by = b.get("middley")
                 // return [a.a, a.b] > [b.a, b.b] ? 1:-1;
                 // return  [ay,ay] < [by,by];
                 return ay<by ? 1 : ay>by ? -1 : 0;
               });

    var unitdeg = Math.PI/180;
    S.each($sectors,function($sector){
      var x = y = $sector.get("middlex")
        , y = $sector.get("middley")
        , theta = $sector.get("middleangle")*rad
      // paper.circle(x12,y12,3);

      var x12,y12;
      x12 = cx+R1*Math.cos(-theta);
      y12 = cy+R1*Math.sin(-theta);
      xysr2.push([x12,y12]);

      xysr.push([x,y]);
      // paper.circle(x,y,2);
    });

    xysr = xysr.reverse();
    xysr2 = xysr2.reverse();

    $sectors = $sectors.reverse();

    var bestxys = find(xysr,xys);

    for(var i=0,l=bestxys.length;i<l;i++){
      var pxy = xysr[i];
      var pxy2 = bestxys[i];
      var x1,x2,y1,y2;
      x1 = pxy[0];
      y1 = pxy[1];
      x2 = pxy2[0];
      y2 = pxy2[1];

      var x12,y12;
      x12 = xysr2[i][0],y12 = xysr2[i][1];

      var x23,y23 = y2;
      x23 = bool_left ? x2 - 10 : x2 + 10;
      var path = paper.path(["M",x1,y1,"Q",x12,y12,x23,y23].join(","));

      var $sector = $sectors[i]
        , sizefn = pie.get("sizefn")
        , label = $sector.get('label')
        , size = blockSizeOf(label)
        , x3 ,y3
        , that = this
        , pathcolor = $sector.get("$path").attr("fill")
        , autoLabelPathColor = pie.get('autoLabelPathColor')

      path && path.toBack && path.toBack();
      (autoLabelPathColor != "undefined") && path.attr("stroke",pathcolor)

      if(sizefn && S.isFunction(sizefn)){
        size = sizefn(size,$sector,pie);
      }

      if(bool_left){
        x3 = x23 - size.width
        y3 = y23 - size.height/2
      }else{
        x3 = x23;
        y3 = y23 - size.height/2;
      }

      var $label = S.Node("<div class='kcharts-label'>"+label+"</div>")

      var labelInstance  = new Label({label:$label,sector:$sector,$path:path,x:x3,y:y3,size:size,pie:pie});
      var $el = labelInstance.get('el');

      var fn = function($el,$sector,labelInstance){
        $el.on('click',function(e){
          that.fire('click',{
            el:e.currentTarget,
            label:labelInstance,
            sector:$sector
          })
        });
      }
      fn($el,$sector,labelInstance);

      that.labels.push(labelInstance);
    }
  }
  S.extend(Labels,S.Base,{
    destroy:function(){
      S.each(this.labels,function(label){
        label.destroy();
      });
    }
  })
  Labels.getSizeOf = blockSizeOf
  return Labels;
});// -*- coding: utf-8-unix; -*-
KISSY.add("gallery/kcharts/1.2/piechart/legend",function(S){
  function Legend(paper,lengend_arr,cfg){
    this.bindEvent();
  }

  S.extend(Legend,S.Base,{
    init:function(){
      
    },
    bindEvent:function(){},
    alignBottom:function(){},
    alignTop:function(){},
    alignLeft:function(){},
    alignRight:function(){}
  });

});

;// -*- coding: utf-8; -*-
KISSY.add("gallery/kcharts/1.2/piechart/sector",function(S){
  // 顺时针的sector
  function sector(cx, cy, r, startAngle, endAngle) {
    // 避免画不成一个○
    if(Math.abs(startAngle-endAngle)>=360){
      endAngle += .01;
    }
    if(startAngle == endAngle){
      endAngle = endAngle-.1;
    }
    // startAngle 肯定是 大于 endAngle
    var rad = Math.PI / 180,
        angel= (startAngle + endAngle)/ 2,
        middlex = cx + r * Math.cos(-angel * rad),
        scx = cx + r * Math.cos(-angel * rad)*.5,
        x1 = cx + r * Math.cos(-startAngle * rad),
        x2 = cx + r * Math.cos(-endAngle * rad),
        middley = cy + r * Math.sin(-angel * rad),
        scy = cy + r * Math.sin(-angel * rad)*.5,
        y1 = cy + r * Math.sin(-startAngle * rad),
        y2 = cy + r * Math.sin(-endAngle * rad),
        ret,
        largeArcFlag = +(Math.abs(startAngle - endAngle) > 180),
        sweepFlag = 1
    ret = [
      "M", cx, cy,
      "L", x1, y1,
      // "A", r, r, 0, +(Math.abs(endAngle - startAngle) > 180), 1, x2, y2,
      // (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+
      "A", r, r, 0, largeArcFlag, sweepFlag, x2, y2,
      "z"
    ]
    // ret.middle = {from:from,to:to,angel:angel,x:x,y:y};
    ret.middleangle = angel;
    ret.middlex = middlex; //扇形平分线x
    ret.middley = middley; //扇形平分线y
    ret.cx = scx;          //中点x
    ret.cy = scy;          //中点y
    ret.A = [x1,y1];       //顺时针的第一个点
    ret.B = [x2,y2];       //顺时针的第二个点
    return ret;
  }
  function donut(cx, cy, r1, r2, startAngle, endAngle){
    // 避免画不成一个○
    if(Math.abs(startAngle-endAngle)>=360){
      endAngle += .01;
    }
    // 避免sector画不出来
    if(startAngle == endAngle){
      endAngle = endAngle-.1;
    }
    var rad = Math.PI / 180,
        angel= (startAngle + endAngle)/ 2,
        middlex = cx + r2 * Math.cos(-angel * rad),
        scx = cx + .5*(r1+r2) * Math.cos(-angel * rad)*.5,
        x = cx + r1 * Math.cos(-angel * rad),
        x1 = cx + r1 * Math.cos(-startAngle * rad),
        x2 = cx + r1 * Math.cos(-endAngle * rad),
        _x1 = cx + r2 * Math.cos(-startAngle * rad),
        _x2 = cx + r2 * Math.cos(-endAngle * rad),

        middley = cy + r2 * Math.sin(-angel * rad),
        scy = cy + .5*(r1+r2) * Math.sin(-angel * rad)*.5,
        y = cy + r1 * Math.sin(-angel * rad),
        y1 = cy + r1 * Math.sin(-startAngle * rad),
        y2 = cy + r1 * Math.sin(-endAngle * rad),
        _y1 = cy + r2 * Math.sin(-startAngle * rad),
        _y2 = cy + r2 * Math.sin(-endAngle * rad),

        ret = [
          "M", _x1, _y1,
          "L", x1, y1,
          "A", r1, r1, 0, +(Math.abs(endAngle - startAngle) > 180), 1, x2, y2,
          "L", _x2,_y2,
          "A",r2,r2, 0, +(Math.abs(endAngle - startAngle) > 180), 0, _x1, _y1
        ];

    ret.middleangle = angel;
    ret.middlex = middlex;
    ret.middley = middley;

    ret.cx = scx;
    ret.cy = scy;
    ret.A = [x1,y1];
    ret.B = [_x1,_y1]
    ret.C = [x2,y2]
    ret.D = [_x2,_y2]
    return ret;
  }

  function Sector(paper,cx,cy,r,start,end,pathcfg,framedata){
    if(!(this instanceof Sector)){
      return new Sector(paper,cx,cy,r,start,end,pathcfg);
    }
    this.set({cx:cx,cy:cy,r:r,start:start,end:end,pathcfg:pathcfg,paper:paper,framedata:framedata})
    this.draw();
    this.bindEvent();
    return this;
  }

  S.extend(Sector,S.Base,{
    bindEvent:function(){
      this.on('afterCxChange',function(){
        this.draw();
      })
      this.on('afterCyChange',function(){
        this.draw();
      })
      this.on('afterStartChange',function(){
        this.draw();
      })
      this.on('afterEndChange',function(){
        this.draw();
      })
      this.on('afterRChange',function(){
        this.draw();
      })
      var $path = this.get('$path')
        , that = this

      $path.click(function(e){
        that.fire('click');
      })
      $path.mouseout(function(){
        that.fire('mouseout')
      });
      $path.mouseover(function(){
        that.fire('mouseover')
      });
    },
    unbindEvent:function(){
      this.detach();
      var $path = this.get('$path')
      $path.unclick();
      $path.unmouseover();
      $path.unmouseout();
    },
    _syncAttrFromPath:function(path){
      this.set({
        middleangle:path.middleangle,
        sectorcx:path.cx,
        sectorcy:path.cy,
        middlex:path.middlex,
        middley:path.middley,
        centerpoint:path.cc,
        A:path.A,B:path.B
      });
    },
    draw:function(){
      var r = this.get('r')
        , paper = this.get('paper')
        , pathcfg = this.get('pathcfg')
        , framedata = this.get('framedata')
        , sectorcfg = (framedata && framedata.sectorcfg) || {}
        , $path = paper.path();

      pathcfg = S.merge({
        stroke:"#fff"
      },pathcfg)
      if(sectorcfg){
        pathcfg = S.merge(pathcfg,{
          stroke:sectorcfg.stroke,
          "stroke-width":sectorcfg.strokeWidth
        })
      }
      $path.attr(pathcfg);
      this.set('$path',$path)

      if(S.isArray(r) && r.length == 2){
        this._drawDonut();
      }else{
        this._drawSector();
      }
    },
    _drawSector:function(){
      var cx = this.get('cx') , cy = this.get('cy')
        , r = this.get('r')
        , start = this.get('start')
        , end = this.get('end')
        , $path
      var path = sector(cx,cy,r,start,end)
        , pathstring = path.join(',')
        , paper = this.get('paper')

      $path = this.get('$path')
      $path.attr("path",pathstring);
      this._syncAttrFromPath(path);
      this.draw = this._drawSector;
      return this;
    },
    _drawDonut:function(){
      var cx = this.get('cx') , cy = this.get('cy')
        , r = this.get('r')
        , start = this.get('start')
        , end = this.get('end')
        , $path
      var path = donut(cx,cy,r[0],r[1],start,end)
        , pathstring = path.join(',')
        , paper = this.get('paper')

      $path = this.get('$path')
      $path.attr("path",pathstring);
      this._syncAttrFromPath(path);
      this.draw = this._drawDonut;
      return this;
    },
    destroy:function(){
      this.unbindEvent();
      this.get('$path').remove();
    }
  })
  return Sector;
});;// -*- coding: utf-8; -*-
/**
 * sector数据处理
 * */
KISSY.add("gallery/kcharts/1.2/piechart/util",function(S,Sector,Color,Raphael){
  var isArray = S.isArray
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
        if(S.isArray(groups[i])){
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
   * */
  function filterdata(data,fn){
    var ret = []
      , other = 0
      , _data
      , sum = sumObject2(data)
    function rec(data,container){
      for(var i=0,l=data.length;i<l;i++){
        if(S.isArray(data[i].data)){
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
    ret.push({label:"其它",data:other});
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
             if(o.value && S.isNumber(o.value)){
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
      if(S.isArray(o[i].data)){
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
  function onframe(attrname,value,props,index,len){
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

    // if(index == len-1){
    //   next = this.next
    //   var eend = next.el.get("end")
    //     , sstart = next.el.get("start")
    //     , diff = end - sstart
    //   debugger;
    //   // if(diff>0){
    //   // console.log(end%360);
    //   // console.log((eend+diff)%360);
    //     next.el.set("end",eend+diff)
    //     next.el.set("start",end);
    //   // }
    // }
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

        f.el = new Sector(paper,cx,cy,r,initdeg,initdeg-1,pathcfg,f);

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
      , themeColor = new Color()

    var initial = color && color.initial
      , initialColor = initial && Raphael.getRGB(initial)
      , min = color && getMinPercent(color.min)
      , icolor = new degrade(initialColor,len,min)
      , degsum = 0
      , prevColor = initialColor
      , gradienton = pie.get("gradient")

    for(var i=0,l=set.length;i<l;i++){
      var rset = paper.set()
        , iniColor = set[i][0].color
        , llen = set[i].length
        , setcolor = new degrade(iniColor,llen)
      for(var j=0,ll=set[i].length;j<ll;j++){
        var setij = set[i][j]
          , setij$el = setij.el
          , framedata = setij$el.get("framedata")
          , $path = setij$el.get('$path')
          , ss
          , c
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
                if(o.value && !o.hide && S.isNumber(o.value)){
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
},{
  requires:["gallery/kcharts/1.2/piechart/sector","gallery/kcharts/1.1/tools/color/index","gallery/kcharts/1.1/raphael/index"]
});
;// -*- coding: utf-8; -*-
KISSY.add("gallery/kcharts/1.2/piechart/index",function(S,Util,Sector,Animate,Labels,Raphael,Color){
  var D = S.DOM
    , E = S.Event

  function render(){
    this.destroy();
    var paper = Raphael(this.get("container"),this.get("width"),this.get("height"));
    this.set("paper",paper);

    this.initPath();
    this.fire("beforeRender");
    var framedata = this.get('framedata')
    this.animate(framedata)
  }

  // 调整cfg
  function setupcfg(cfg){
    var w = this.get("width")
      , h = this.get("height")
      , min = Math.min(w,h)
      , d
      , rpadding = cfg.rpadding //留给label
    if(!cfg.rs){
      if(!rpadding){
        rpadding = 40;
        this.set("rpadding",rpadding);
      }
      if(min>rpadding){
        d = min - rpadding;
      }else{
        d = min;
      }
      cfg.rs = [d/2];
    }
    //自动找圆心
    if(!S.isNumber(cfg.cx)){
      cfg.cx = w/2;
    }
    if(!S.isNumber(cfg.cy)){
      cfg.cy = h/2;
    }

    //设置重绘频率
    if(!S.isNumber(cfg.repaintRate)){
      cfg.repaintRate = 200;
    }

    //如果要画面包圈
    if(cfg.donut){
      cfg.donutSize || (cfg.donutSize = 30);
      if(cfg.donutSize>cfg.rs[0]){
        //设为半径的一半
        cfg.donutSize = cfg.rs[0]/2;
      }
      cfg.rs[1] = cfg.rs[0] - cfg.donutSize;
    }
  }

  /**
   * @param cfg {Object}
   * cfg.rpadding 留来画label的距离
   * cfg.repaintRate {Number} 重绘频率
   * cfg.donut {Bool} 是否为面包圈图
   * cfg.donutSize {Number} 若为面包圈图，设置面包圈的尺寸
   * cfg.initdeg {Number} 画扇形的起始位置，默认为90度
   * cfg.gradient {Bool} 是否开启渐变，可以手动配置framedata.gradientcolor
   * */

  function Pie(cfg){
    var container = S.get(cfg.renderTo)
      , width = D.width(container)
      , height = D.height(container)
      , paper = Raphael(container)
      , isStatic = D.css(container,'position') == "static" ? true : false

    this.set({"paper":paper,width:width,height:height,container:container})

    //若没有cx|cy|r，则算一个默认的出来
    this._setupcfg(cfg);

    if(!S.isArray(cfg.rs)){
      cfg.rs = [cfg.rs];
    }

    isStatic && D.css(container,"position","relative");

    this.set(cfg);

    // adjust animation cfg
    this.adjustCfg();
    // adjustData
    this.adjustData();
    if(cfg.autoRender != false){
      var that = this;
      //延迟渲染
      setTimeout(function(){
        that.render();
      },0);
    }
  }
  S.extend(Pie,S.Base,{
    bindEvent:function(){
      this.on("afterCxChange",function(){
        this.render();
      });
      this.on("afterCyChange",function(){
        this.render();
      });
      this.on("afterRsChange",function(){
        this.render();
      });
      this.on("afterDataChange",function(){
        this.render();
      });
      E.on(this.get("container"),"mouseleave",function(){
        this.fire("mouseleave");
      },this)
    },
    _setupcfg:setupcfg,
    //调整动画的配置
    adjustCfg:function(){
      var anim = this.get('anim')
        , that = this
        , _end = S.isFunction(anim.endframe) && anim.endframe
        , lablecfg = that.get("label")
        anim.endframe = function(){
          if(lablecfg != false){
            that.drawLabel(lablecfg);
          }
          _end && _end.call(that);
          that.fire('afterRender');
        }
    },
    /**
     * 过滤函数
     * */
    adjustData:function(){
      var fn = this.get('filterfn')
      if(fn && S.isFunction(fn)){
        var data = this.get('data')
          , ret
        ret = Util.filterdata(data,fn)
        // console.log(JSON.stringify(ret));
        this.set("data",ret);
      }
    },
    initPath:function(){
      var ret = Util.initPath(this)
      this.set("$sectors",ret.$sectors);
      this.set("groups",ret.groups)
      this.set("set",ret.set);
      this.set("framedata",ret.framedata);
    },
    render:function(){
      this.initPath();
      this.fire("beforeRender");
      var framedata = this.get('framedata')
      this.animate(framedata)
      // 第一次绘制完成后，后面属性更改会重绘：避免一次一次批量属性修改造成多次重绘
      var bufferedDraw = S.buffer(render,this.get("repaintRate"),this)
      this.render = bufferedDraw;
      this.bindEvent();
    },
    /**
     * 调整饼图：隐藏部分扇形
     * */
    adjust:function(){
      var that = this
        , groups = this.get("groups").slice(0)
        , framedata = this.get("framedata")
      framedata = S.filter(framedata,function(frame){
                   return !frame.hide;
                 })
      Util.adjustFrameData(groups,this);
      this.animate(framedata);
    },
    /**
     * 自动调整r,cx,cy
     * */
    autoResize:function(){
      var con = this.get("container")
        , w = D.width(con)
        , h = D.height(con)
        , min = Math.min(w,h)
        , d
        , rpadding = this.get("rpadding")
        , cx = this.get("cx")
        , cy = this.get("cy")
        , cx1 = w/2 ,cy1 = h/2

      var attrs = {"width":w,"height":h};
      this.set(attrs);

      if(!Util.closeto(cx1,cx)){
        this.set("cx",cx1);
      }
      if(!Util.closeto(cy1,cy)){
        this.set("cy",cy1);
      }

      if(min>rpadding){
        d = min - rpadding;
      }else{
        d = min;
      }

      //如果要画面包圈
      var drawDonut = this.get("donut")
        , donutSize = this.get("donutSize")
        , r0 ,r1

      if(drawDonut){
        r0 = d/2
        if(donutSize>r0){
          r1 = r0/2;
        }else{
          r1 = r0 - donutSize;
        }
        this.set("rs",[r0,r1]);
      }else{
        var rs = this.get("rs")
        if(rs.length == 1){
          this.set("rs",[d/2]);
        }
      }
    },
    animate:function(framedata){
      var that = this
        , anim = this.get("anim")

      if(this.isRunning()){
        this.stop();
      }
      that.fire("beginRender");
      this.animateInstance = Animate.AnimateObject(framedata,anim);
    },
    /**
     * 绘制外层label
     * */
    drawLabel:function(){
      var leftSectors = [] // 最外层的
        , rightSectors = []
        , $sectors = this.get('$sectors')
        , $leftLables
        , $rightLables

      S.each($sectors,function($sector){
        var ma = $sector.get('middleangle')
          , groupLength = $sector.get("groupLength")
          , groupIndex = $sector.get("groupIndex")
          , isright = Util.isRightAngel(ma)

        if(S.indexOf(groupLength-1,groupIndex) > -1){
          if(isright){
            rightSectors.push($sector);
          }else{
            $sector.set("isleft",true);
            leftSectors.push($sector);
          }
        }else{
          if(isright){
            $sector.set("isright",true);
          }else{
            $sector.set("isleft",true);
          }
        }
      });
      $leftLables = new Labels(this,leftSectors,true)
      $rightLables = new Labels(this,rightSectors,false)

      $leftLables.on('click',this.onLabelClick,this);
      $rightLables.on('click',this.onLabelClick,this);

      this.set("$labels",[].concat($leftLables,$rightLables));
    },
    /**
     * 绘制内部label，需配置
     * */
    drawSetLabel:function(){

    },
    onLabelClick:function(e){
      this.fire('labelclick',{
        el:e.el,
        label:e.label,
        sector:e.sector
      })
    },
    isRunning:function(){
      return this.animateInstance && this.animateInstance.isRunning();
    },
    stop:function(){
      if(this.animateInstance){
        this.animateInstance.stop();
        delete this.animateInstance;
      }
    },
    destroy:function(){
      var $sectors = this.get("$sectors")
        , $labels = this.get("$labels")
        , litter = [].concat($sectors,$labels)
      S.each(litter,function(i){
        i && i.destroy();
      });
      this.set("$sectors",null);
      this.set("$labels",null);
      this.get("paper").remove();
    }
  })

  Pie.getSizeOf =  Labels.getSizeOf

  return Pie;
},{
  requires:["gallery/kcharts/1.2/piechart/util","gallery/kcharts/1.2/piechart/sector","gallery/kcharts/1.2/piechart/animation","gallery/kcharts/1.2/piechart/label","gallery/kcharts/1.1/raphael/index","gallery/kcharts/1.1/tools/color/index"]
});
