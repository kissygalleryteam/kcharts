;KISSY.add(function(S,Raphael,Base,Promise,Anim,Util,D,E,ColorLib){
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
         S.use("kg/kcharts/2.0.0/legend/index",function(S,Legend){
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

       S.use("kg/kcharts/2.0.0/tip/index,kg/kcharts/2.0.0/tip/assets/tip.css",function(S,Tip){
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
   requires:["kg/kcharts/2.0.0/raphael/index","base","promise","kg/kcharts/2.0.0/animate/index","kg/kcharts/2.0.0/realtime/util","dom","event","kg/kcharts/2.0.0/tools/color/index"]
 });