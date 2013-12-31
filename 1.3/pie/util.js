;KISSY.add("gallery/kcharts/1.3/pie/util",function(S){
   //==================== basic utils ====================

   var reduce = S.reduce;
   var map = S.map;

   //==================== basic utils end ====================

   var Util = {};

   // series [{type: 'pie',name: 'Browser share',data: [['Firefox', 45.0],['IE', 26.8],{name: 'Chrome',y: 12.8,sliced: true,selected: true},['Safari', 8.5],['Opera', 6.2],['Others', 0.7]]}]
   // [
   //   {data:[8],text:"H"},
   //   {data:[5],text:"E"},
   //   {data:[12],text:"L"},
   //   {data:[12],text:"L"},
   //   {data:[16],text:"O"},
   //   {data:[24],text:"W"},
   //   {data:[16],text:"O"},
   //   {data:[19],text:"R"},
   //   {data:[12],text:"L"},
   //   {data:[4],text:"D"}
   // ]
   //
   /**
    * 处理series.data数据
    * @param data {Array}
    * @param opt {Object}
    *   - opt.initialDeg 初始角度
    * @return ret {Array}
    * */
   function processSerieData(data,opt){
     opt || (opt = {});
     var initialDeg = opt.initialDeg || 90;

     var sum  = reduce(data,function(s,i){return s+i[1]},0);

     var ret;
     var rad = Math.PI / 180;
     ret = map(data,function(i){
             var offset = i[1]/sum*rad;
             var start = initialDeg;
             var end = initialDeg+offset;
             initialDeg = end;
             return {
               text:i[0],
               start:start,
               end:end
             }
           });
     return ret;
   }

   Util.processSerieData = processSerieData;

 });