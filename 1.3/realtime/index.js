;KISSY.add("gallery/kcharts/1.3/realtime/index",function(S,Raphael,Base,Util,D,E){
   // utils
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

   // end utils

   var props = {
     inititialize:function(){
       var paper = this.get("paper");

       var selector = this.get("renderTo");

       var container = D.get(selector);

       var w = D.width(container);
       var h = D.height(container);

       // 水平和竖直方向上的填充
       var paddingx,paddingy;

       paddingx = S.isNumber(this.get("paddingx")) ? this.get("paddingx") : 15;
       paddingy = S.isNumber(this.get("paddingy")) ? this.get("paddingx") : 15;

       // 出去paddingleft paddingtop x2 后的画布大小
       var w2 , h2;

       w2 = w - paddingx*2;
       h2 = h -  paddingy*2;

       paper || (paper = Raphael(container,w,h));

       var series = this.get("series");
       var result = getRange(series);

       var daterange = result.daterange
         , valuerange = result.valuerange

       var daterangelen = daterange.range.length;
       var valuerangelen = valuerange.range.length;

       var date_min = daterange.min
         , val_min = valuerange.min
         , date_max = daterange.max
         , val_max = valuerange.max

       // 日期缩放转换
       var date_unit = daterange.unit;

       // 将数值转换为paper上的点
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
       // 将点串联起来
       var pathstring = polyline(points);
       paper.path(pathstring);

       var xstartend = []; // x轴路径
       var ystartend = [];

       // 画xaxis
       for(var k=0;k<daterangelen;k++){
         var x,y;
         x = k / (daterangelen-1) * w2 + paddingx;
         y = h - paddingy;
         paper.circle(x,y,1);

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

       // 画yaxis
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
           paper.circle(x,y,1);
           paper.text(x,y,valuerange.range[l]).attr({
             "text-anchor":"end",
             "transform":"t-5,0"
           });
         }
       }

       // 画x轴y轴
       paper.path(polyline(xstartend));
       paper.path(polyline(ystartend));

     },
     _axis:function(){

     },
     render:function(){

     },
     _renderSerie:function(){

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
