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
       , date_max = date_labels.max;

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
    * 移除数组中的arr元素
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
     x = (x0- xmin) / (xmax - xmin) * w+ px;
     y = (y0- ymin) / (ymax - ymin) * h+ py;
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
           // 坐标信息
           points.push({x:x,y:y});
         }
       }
     }
     return ret;
   }

   /**
    * 绘制一系列的点
    * @param points
    * @param opt
    * @return result {Object}
    *  {line,points,color} {路径,连接点,serie颜色}
    * */
   function drawSerie(points,opt){

   }
   /**
    * 销毁一条线及其连接点，解绑事件等
    * */
   function destroySerie(serie,op){
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
      * 2.4 保存series数据信息，用于绘制legend
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
       var Rlines = this.get("$lines");// 绘制的连线
       if(Rlines){
         removeRaphaelElements(Rlines);
       }else{
         Rlines = [];
         this.set("$lines",Rlines);
       }

       // 0.2 移除Rxlabels
       var Rxlabels = this.get("$xlabels");
       if(Rxlabels){
         removeRaphaelElements(Rxlabels);
       }else{
         Rxlabels = [];
         this.set("$xlabels",Rxlabels);
       }

       // 0.3 移除Rxlabels
       var Rylabels = this.get("$ylabels");
       if(Rylabels){
         removeRaphaelElements(Rylabels);
       }else{
         Rylabels = [];
         this.set("$ylabels",Rylabels);
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
       var RjointPoints = this.get("$jointPoints");
       if(RjointPoints){
         removeRaphaelElements(RjointPoints);
       }else{
         RjointPoints = [];
         this.set("$jointPoints",RjointPoints);
       }

       // 1.
       var w = D.width(container), h = D.height(container); // 容器总宽高
       var w2 , h2;                                         // 画布实际可用宽高
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

       // 若还未初始化画布，创建一个
       if(!paper){
         paper = Raphael(container,w,h);
         this.set('paper',paper);
       }

       // 2. 数据处理
       var series = this.get("series");
       var yAxis = this.get("yAxis") || {};
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

       //==================== TODO begin ====================
       // 通用化：将数据转换为paper上的点坐标（x,y），既可以处理24h、72h这样特殊的时间段，也可以处理真实的时间序列，比如股票图
       // [ [{x,y},{x,y}] , [...] , ...]
       var seriesPoints = data2points(series,{
         xmin:date_min,
         xmax:date_max,
         ymin:val_min,
         ymax:val_max,
         px:paddingx,
         py:paddingy,
         width:w2,
         height:h2
       });

       var that = this;
       var $series = S.map(seriesPoints,function(serie,index){
                       var color = that.colorManager.getColor(index);
                       var pointConfig = that.get("point"); // 绘制点的配置项，可以是fn
                       var lineType = that.get("lineType"); // 连线选项

                       //return {line,points,color} {路径,连接点,serie颜色}
                       return drawSerie(serie,{
                         paper:paper,
                         color:color,
                         lineType:lineType,
                         pointConfig:pointConfig
                       });
                     });
       //==================== TODO end ====================

       // 用于legend的显示隐藏
       for(var i=0;i<series.length;i++){
         var jointPoints = paper.set();                      // 连接点集合
         points = [];                                        // 用于连线的坐标点集合
         var color = this.colorManager.getColor(colorIndex); // 点颜色
         colorIndex++;

         var serie = series[i];
         var data = serie.data;

         if(data){
           for(var j=0;j<data.length;j++){
             var point = data[j];
             var x,y;

             var xy = data2point(point,{
               xmin:date_min,
               xmax:date_max,
               ymin:val_min,
               ymax:val_max,
               px:paddingx,
               py:paddingy,
               width:w2,
               height:h2
             });
             x = xy[0];
             y = xy[1];

             // 大数据的时候，可以不显示连接点
             var pointConfig = this.get("point");
             if(!pointConfig || pointConfig.isShow !== false){
               var jointPoint = paper.circle(x,y,4); // 连接点
               var dftColor = {"stroke":color.DEFAULT,"stroke-width":2,"fill":"#fff"};
               jointPoint.attr(dftColor);
               // TODO 事件每必要绑定这么多
               (function(jointPoint,color){
                 jointPoint.hover(
                   function(e){
                     jointPoint.attr({"stroke":color.HOVER});
                   },function(e){
                       jointPoint.attr({"stroke":color.DEFAULT});
                     });
               })(jointPoint,color);
               // 所有的连接点
               RjointPoints.push(jointPoint);
               // 单条线的连接点
               jointPoints.push(jointPoint);
             }

             // 坐标信息
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
         // 2.4 保存series数据信息，用于绘制legend
         serie.color = color;
         serie.$path = line;

         line.jointPoints = jointPoints;
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
           "yyyy-MM-dd"
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

       // 6. 若配置了legend,绘制legend
       this.renderLegend();
     },
     /**
      * update和render的区别就是
      * update不移除画布上的数据
      * */
     update:function(){

     },
     /**
      * TODO 动态增加点后，使用上次计算结果的缓存
      * */
     addData:function(newSeries){
       var series = this.get("series")
       for(var i=0,l=newSeries.length;i<l;i++){
         Util.combineSeries(newSeries[i],series);
       }
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
       ret = S.map(this.get("series"),function(i){
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
           if(oldLegendString === newLegendString)
             return;
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
         });
       }
     },
     /**
      * 隐藏线以及其连接点
      * */
     hideLine:function(i){
       if(S.isNumber(i)){
         var lines = this.get("$lines");
         var line = lines[i];
         line && line.hide();
         // $jointPoints is paper.set
         var $jointPoints = line.jointPoints;
         $jointPoints && $jointPoints.hide();
       }
     },
     /**
      * 显示线以及其连接点
      * */
     showLine:function(i){
       if(S.isNumber(i)){
         var lines = this.get("$lines");
         var line = lines[i];
         line && line.show();
         // $jointPoints is paper.set
         var $jointPoints = line.jointPoints;
         $jointPoints && $jointPoints.show();
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
