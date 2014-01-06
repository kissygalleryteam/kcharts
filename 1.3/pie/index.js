// -*- coding: utf-8; -*-
/**
 * 简单饼图，嵌套的饼图请使用piechart
 * */
;KISSY.add("gallery/kcharts/1.3/pie/index",function(S,Util,Sector,Animate,Raphael,Color,Base,E,D){
   var map = S.map;
   var reduce = S.reduce;
   var each = S.each;

   //==================== utils ====================
   /**
    * 初始路径
    * @param data {Array}
    * @param opt {Object}
    * @return
    * */
   function buildInitialSectors(data,opt){
     var obj = {};
     S.mix(obj,opt,true,["paper","cx","cy","initdeg","r","pathcfg"]);
     var ret = [];
     for(var i=0,l=data.length;i<l;i++){
       ret.push(new Sector({
         paper:obj.paper,cx:obj.cx,cy:obj.cy,r:obj.r,start:obj.initdeg,end:obj.initdeg-1,pathcfg:obj.pathcfg,framedata:data[i]
       }));
     }
     return ret;
   }

   /**
    * 构建动画属性
    * @param sectors {Array} Sector数组
    * @param sectorData {Array} sector的最终属性，跟sectors要对应
    * @return result {Array} 动画属性
    *   eg. [{from:{deg:0},to:{deg:40},frame:fn},...]
    * */
   function buildAnimationProps(sectors,sectorData,opt){
     if(sectors.length !== sectorData.length)
       return false;

     var result;
     var prev;
     var sum = 90;
     result = map(sectorData,function(sectorData,index){
                sectorData.el = sectors[index];
                if(prev)
                  framedata.prev = prev;
                prev = sectors[index];
                return {
                  prev:prev,
                  from:{
                    deg:sectorData.start
                  },
                  to:{
                    deg:sectorData.end
                  }
                }
              });

     return result;
   }

   //********** handlers **********
   // 扇形/donut每帧处理函数
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
   //********** handlers end **********

   //==================== utils end ====================

   var COLOR_TPL = "{COLOR}";
   var methods = {
     initializer:function(){
       this.render();
     },
     bindEvent:function(){},
     /**
      * 1. 抽取series数据，转换为扇形/donut数据
      *    确定配置项
      * 2. 初始化扇形路径
      * 3. 准备动画数据
      * 4. 开始动画
      * */
     render:function(){
       var series = this.get("series");

       var paper = this.get("paper");
       var cx = this.get("cx");
       var cy = this.get("cy");
       var initdeg = this.get("initDeg") || 90;
       var r = this.get("r");
       var pathcfg = this.get("pathcfg"); // 扇形路径属性配置

       // 画donut还是扇形，默认扇形
       var donut = this.get("donut");
       if(donut){

       }else{
         var data = series.data;
         if(!data)
           data = data[0].data
         // 1. 处理数据
         var sectorData = Util.processSerieData(data);

         // 初始化所有扇形，准备动画
         var sectors = buildInitialSectors(data,{
           paper:paper,
           cx:cx,cy:cy,initdeg:initdeg,pathcfg:pathcfg
         });

         // 构建动画属性
         var animationProperties = buildAnimationProps(sectors,sectorData)

         Animate.AnimateObject(animationProperties);
         // 开始动画
       }
     }
   }

   var Pie;
   if(Base.extend){ // 1.4
     Pie = Base.extend(methods);
   }else{           // 1.3
     Pie = function(cfg){
       this.set(cfg);
       this.userConfig = cfg;
       this.initializer();
     }
     S.extend(Pie,Base,methods);
   }
   return Pie;
},{
  requires:[
    "./util",
    "../piechart/sector",
    "gallery/kcharts/1.3/animate/index",
    "gallery/kcharts/1.3/raphael/index",
    "gallery/kcharts/1.3/tools/color/index",
    "base",
    "event",
    "dom"
  ]
});
