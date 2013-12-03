;KISSY.add("gallery/kcharts/1.3/realtime/index",function(S,Raphael){
   function RealTime(cfg){
     this.set(cfg);
     this.render();
   }

   S.extend(RealTime,S.Base,{
     render:function(){
       var series = this.get("series");

       for(var i=0;i<series.length;i++){
         var serie = series[i];
         var data = serie.data;
         if(data){
           for(var j=0;j<data.length;j++){
             var point = data[j];
             
           }
         }
       }
     }
   });

   return RealTime;
},{
  requires:["gallery/kcharts/1.1/raphael/index"]
});
