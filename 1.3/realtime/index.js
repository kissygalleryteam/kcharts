;KISSY.add("gallery/kcharts/1.3/realtime/index",function(S,Raphael,Base,Util,D,E){
   //==================== utils start ====================
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
    * 曲线
    * @param points{Array} 点集
    * */
   function polyline(points){
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
              p.x1,
              p.y1,
              "L",
              p.x2,
              p.y2);
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
       this.render();
     },
     /**
      * 1. 容器、画布尺寸计算
      * 2. 数据处理
      * 2.1 算出series数据的范围
      * 2.2 转换为paper上的点
      * 3. 将paper上的点串联起来：a. 直接连接 b. 平滑过度连接
      * 4. 画x y 轴上的label
      * 4.1 x label a. 包含日期的格式化输出 b. 旋转的标注样式
      * 4.2 y label
      * 5. 化刻度尺
      * 5.1 x 刻度尺
      * 5.2 y 刻度尺
      * 6. 画x轴y轴
      * */
     render:function(){
       var container = this.get("container")
         , paper = this.get('paper')

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
       // 2.1 算出series数据的范围
       var result = getRange(series);

       var daterange = result.daterange
         , valuerange = result.valuerange

       var daterangelen = daterange.range.length;
       var valuerangelen = valuerange.range.length;

       var date_min = daterange.min
         , val_min = valuerange.min
         , date_max = daterange.max
         , val_max = valuerange.max

       // 日期缩放比例
       var date_unit = daterange.unit;

       // 2.2 转换为paper上的点
       var points = [];
       for(var i=0;i<series.length;i++){
         var serie = series[i];
         var data = serie.data;
         if(data){
           for(var j=0;j<data.length;j++){
             var point = data[j];
             var x,y;

             x = (point[0] - date_min) / (date_max - date_min) * w2+ paddingx;
             y = (point[1] - val_min) / (val_max - val_min) * h2 + paddingy;
             paper.circle(x,y,2);
             points.push({x:x,y:y});
           }
         }
       }
       // 3. 将点串联起来
       var pathstring = polyline(points);
       paper.path(pathstring);

       // 4. 画x、y label
       var xstartend = []; // x轴路径
       var ystartend = [];

       // 4.1 xaxis label
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
         paper.text(x,y,text).attr({
           "text-anchor":"end",
           "transform":"t-5,5r-45"+","+x+","+y
         })
       }

       // 4.2 yaxis label
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
           paper.text(x,y,valuerange.range[l]).attr({
             "text-anchor":"end",
             "transform":"t-5,0"
           });
         }
       }

       // 5.
       // 5.1 画y刻度尺
       var x1 = paddingx, y1 = paddingy + h2 // 起始位置
         , x2 = paddingx, y2 = paddingy      // 末位置
         , n1 = valuerangelen                // 分成的份数
       var rullerPointsY = getRullerPoints([x1,y1],[x2,y2],{n:n1,scale:5});
       var $rullerY = drawRullerPoints(rullerPointsY,paper);

       // 5.2 画x刻度尺
       var x3 = paddingx, y3 = paddingy + h2      // 起始位置
         , x4 = paddingx + w2, y4 = paddingy + h2 // 末位置
         , n2 = daterangelen                      // 分成的份数
       var rullerPointsX = getRullerPoints([x3,y3],[x4,y4],{n:n2,scale:5});
       var $rullerX = drawRullerPoints(rullerPointsX,paper);

       // 6. 画x轴y轴
       paper.path(polyline(xstartend));
       paper.path(polyline(ystartend));
     },
     /**
      * update 方法和 render 不同的地方在于，update 只更新部分
      * */
     update:function(){

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
   requires:["gallery/kcharts/1.2/raphael/index","base","./util","dom","event"]
 });
