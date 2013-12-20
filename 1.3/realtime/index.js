;KISSY.add("gallery/kcharts/1.3/realtime/index",function(S,Raphael,Base,Util,D,E,ColorLib){
   //==================== utils start ====================
   var each = S.each
     , map = S.map;

   /**
    * 返回数据的时间、数值范围
    * */
   function getRange(series,opt){
     opt || (opt = {n:5});
     var dates = [];
     var vals = [];

     for(var i=0;i<series.length;i++){
       var serie = series[i];
       var data = serie.data;
       if(data){
         for(var j=0;j<data.length;j++){
           var point = data[j];
           if(typeof point[0] === 'number')
             dates.push(point[0]);
           if(typeof point[1] === 'number')
             vals.push(point[1]);
         }
       }
     }

     var date_labels = Util.getlabel(dates,opt.n);

     var date_min = date_labels.min
       , date_max = date_labels.max

     var daterange = {
         unit:date_labels.unit,
         min:date_min,
         max:date_max,
         range:date_labels.dates
     };

     var val_min = Math.min.apply(Math,vals)
       , val_max = Math.max.apply(Math,vals)

     var val_labels = Util.axis(val_min,val_max,opt.n)

     var vmin = Math.min.apply(Math,val_labels)
       , vmax = Math.max.apply(Math,val_labels);

     var valuerange = {
         min:vmin,
         max:vmax,
         range:val_labels
     };

     return {
       daterange:daterange,
       valuerange:valuerange
     }

   }

   /**
    * 移除数组总的arr元素
    * */
   function removeRaphaelElements(arr){
     while(arr.length){
       var el = arr.pop();
       el && el.remove && el.remove();
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
    * 平滑的连线
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
        x = Util.roundToFixed(point.x,100);
        y = Util.roundToFixed(point.y,100);
         if(i){
           arr.push("L",x,y);
         }else{
           arr.push("M",x,y);
         }
       }
     }else{
       for(var i=0,l=points.length;i<l;i++){
         point = points[i]
         x = Util.roundToFixed(point.x,100);
         y = Util.roundToFixed(point.y,100);
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
    * 获取a到b分成opt.n份的坐标集合
    *
    * */
   function getRullerPoints(a,b,opt){
     var rate,ret = [];
     for(var i=0,n=opt.n;i<n;i++){
       rate = i/(n-1);
       opt.ratio = rate;
       ret.push(Util.verticalLine(a,b,opt));
     }
     return ret;
   }
   /**
    * 画刻度
    * */
   function drawRullerPoints(collection,paper){
     if(arguments.length<2)
       return false;

     var s = [];
     var p;
     // 翻转后，从下往上绘制刻度
     // collection = collection.reverse();
     for(var i=1,l=collection.length;i<l;i++){
       p = collection[i];
       s.push("M",
              Util.roundToFixed(p.x1,10),
              Util.roundToFixed(p.y1,10),
              "L",
              Util.roundToFixed(p.x2,10),
              Util.roundToFixed(p.y2,10)
             );
     }
     var ss = s.join(',');
     return paper.path(ss);
   }
   //==================== utils end ====================

   var props = {
     inititialize:function(){
       var selector = this.get("renderTo");
       var container = D.get(selector);
       this.set("container",container);

       var themeCls = "ks-chart-default";

       this.colorManager = new ColorLib({
         themeCls:themeCls
       })

       this.render();
     },
     /**
      * 0. 移除之前绘制产生的dom
      * 1. 容器、画布尺寸计算
      * 2. 数据处理
      * 2.1 算出series数据的范围
      * 2.2 转换为paper上的点
      * 2.3 将paper上的点串联起来：a. 直接连接 b. 平滑过度连接
      * 3. 画x y 轴上的label
      * 3.1 x label a. 包含日期的格式化输出 b. 旋转的标注样式
      * 3.2 y label
      * 4. 化刻度尺
      * 4.1 x 刻度尺
      * 4.2 y 刻度尺
      * 5. 画x轴y轴
      * */
     render:function(){
       var container = this.get("container")
         , paper = this.get('paper')

       // 0.
       // 0.1 移除点连线
       var Rlines = this.get("Rlines");// 绘制的连线
       if(Rlines){
         removeRaphaelElements(Rlines);
       }else{
         Rlines = [];
         this.set("Rlines",Rlines);
       }

       // 0.2 移除Rxlabels
       var Rxlabels = this.get("Rxlabels");
       if(Rxlabels){
         removeRaphaelElements(Rxlabels);
       }else{
         Rxlabels = [];
         this.set("Rxlabels",Rxlabels);
       }

       // 0.3 移除Rxlabels
       var Rylabels = this.get("Rylabels");
       if(Rylabels){
         removeRaphaelElements(Rylabels);
       }else{
         Rylabels = [];
         this.set("Rylabels",Rylabels);
       }
       // 0.4 移除rullers
       if(this.get("RrullerX")){
         this.get("RrullerX").remove();
       }
       if(this.get("RrullerY")){
         this.get("RrullerY").remove();
       }
       // 0.5 移除xaxis 、yaxis
       if(this.get("Rxaxis")){
         this.get("Rxaxis").remove();
       }
       if(this.get("Ryaxis")){
         this.get("Ryaxis").remove();
       }
       // 0.6 移除曲线连接点
       var RjoinPoints = this.get("RjoinPoints");
       if(RjoinPoints){
         removeRaphaelElements(RjoinPoints);
       }else{
         RjoinPoints = [];
         this.set("RjoinPoints",RjoinPoints);
       }

       // 1.
       var w = D.width(container), h = D.height(container); // 容器总宽高
       var w2 , h2;                                         // 画布实际可用宽高
       // 水平和竖直方向上的填充
       var paddingx,paddingy;
       paddingx = S.isNumber(this.get("paddingx")) ? this.get("paddingx") : 15;
       paddingy = S.isNumber(this.get("paddingy")) ? this.get("paddingx") : 15;
       // 出去paddingleft paddingtop x2 后的画布大小
       w2 = w - paddingx*2;
       h2 = h -  paddingy*2;

       // 若还未初始化画布，创建一个
       if(!paper){
         paper = Raphael(container,w,h);
         this.set('paper',paper);
       }

       // 2. 数据处理
       var series = this.get("series");
       var yAxis = this.get("yAxis");
       // 2.1 算出series数据的范围
       var result = getRange(series,{n:yAxis.num});

       var daterange = result.daterange
         , valuerange = result.valuerange;

       var daterangelen = daterange.range.length;
       var valuerangelen = valuerange.range.length;

       var date_min = daterange.min
         , val_min = valuerange.min
         , date_max = daterange.max
         , val_max = valuerange.max

       // 日期缩放比例
       var date_unit = daterange.unit;

       // 2.2 转换为paper上的点
       var points;
       var colorIndex = 0;
       for(var i=0;i<series.length;i++){
         points = [];
         // 点颜色
         var color = this.colorManager.getColor(colorIndex);
         colorIndex++;

         var serie = series[i];
         var data = serie.data;
         if(data){
           for(var j=0;j<data.length;j++){
             var point = data[j];
             var x,y;

             x = (point[0] - date_min) / (date_max - date_min) * w2+ paddingx;
             y = (point[1] - val_min) / (val_max - val_min) * h2 + paddingy;
             var joinPoint = paper.circle(x,y,4);
             var dftColor = {"stroke":color.DEFAULT,"stroke-width":2,"fill":"#fff"};
             joinPoint.attr(dftColor);
             // TODO 事件每必要绑定这么多
             (function(joinPoint,color){
               joinPoint.hover(
                 function(e){
                   joinPoint.attr({"stroke":color.HOVER});
                 },function(e){
                     joinPoint.attr({"stroke":color.DEFAULT});
                   });
             })(joinPoint,color);
             RjoinPoints.push(joinPoint);
             points.push({x:x,y:y});
           }
         }
         // 2.3 将点串联起来
         var pathstring;
         if(this.get("lineType") === 'arc'){
           pathstring = curveLine(points);
         }else{
           pathstring = polyLine(points);
         }
         var line = paper.path(pathstring);
         // 设置线条样式 TODO
         // a. 使用默认颜色
         // b. 看是否有hook，应用hook
         line.attr({"stroke":color.DEFAULT,"stroke-width":2});
         (function(line,color){
           line.hover(
             function(e){
               line.attr({"stroke":color.HOVER,"stroke-width":3});
             },function(e){
                 line.attr({"stroke":color.DEFAULT,"stroke-width":2});
               });
         })(line,color);

         Rlines.push(line);
       }

       // 3. 画x、y label
       var xstartend = []; // x轴路径
       var ystartend = [];

       // 3.1 xaxis label
       for(var k=0;k<daterangelen;k++){
         var x,y;
         x = k / (daterangelen-1) * w2 + paddingx;
         y = h - paddingy;
         if(k === 0){
           xstartend.push({x:x,y:y});
         }else if(k === daterangelen-1){
           xstartend.push({x:x,y:y});
         }

         var text = Util.formatDate(
           new Date(daterange.range[k]),
           "yyyy-mm-dd"
         );
         var xlabel = paper.text(x,y,text).attr({
           "text-anchor":"end",
           "transform":"t-5,5r-45"+","+x+","+y
         });
         Rxlabels.push(xlabel);
       }

       // 3.2 yaxis label
       for(var l=0;l<valuerangelen;l++){
         var x,y;
         x = paddingx;
         y = h - paddingy - l/(valuerangelen -1) * h2;

         if(l === 0){
           ystartend.push({x:x,y:y});
         }else if(l === valuerangelen - 1){
           ystartend.push({x:x,y:y});
         }

         // 不重复画第一个点
         if(l){
           var ylabel = paper.text(x,y,valuerange.range[l]).attr({
             "text-anchor":"end",
             "transform":"t-5,0"
           });
           Rylabels.push(ylabel);
         }
       }

       // 4.
       // 4.1 画y刻度尺
       var x1 = paddingx, y1 = paddingy + h2 // 起始位置
         , x2 = paddingx, y2 = paddingy      // 末位置
         , n1 = valuerangelen                // 分成的份数
       var rullerPointsY = getRullerPoints([x1,y1],[x2,y2],{n:n1,scale:5});
       var $rullerY = drawRullerPoints(rullerPointsY,paper);
       this.set("RrullerY",$rullerY);

       // 4.2 画x刻度尺
       var x3 = paddingx, y3 = paddingy + h2      // 起始位置
         , x4 = paddingx + w2, y4 = paddingy + h2 // 末位置
         , n2 = daterangelen                      // 分成的份数
       var rullerPointsX = getRullerPoints([x3,y3],[x4,y4],{n:n2,scale:5});
       var $rullerX = drawRullerPoints(rullerPointsX,paper);
       this.set("RrullerX",$rullerX);

       // 5. 画x轴y轴
       var xaxis = paper.path(polyLine(xstartend));
       var yaxis = paper.path(polyLine(ystartend));
       this.set("Rxaxis",xaxis);
       this.set("Ryaxis",yaxis);

     },
     /**
      * TODO 动态增加点后，使用上次计算结果的缓存
      * */
     addData:function(newSeries){
       var series = this.get("series")
       for(var i=0,l=newSeries.length;i<l;i++){
         Util.combineSeries(newSeries[i],series);
       }
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
   requires:["gallery/kcharts/1.3/raphael/index","base","./util","dom","event","gallery/kcharts/1.3/tools/color/index"]
 });
