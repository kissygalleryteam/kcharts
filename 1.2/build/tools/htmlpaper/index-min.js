<<<<<<< HEAD
/*! kcharts - v1.2 - 2013-10-12 11:00:38 AM
=======
<<<<<<< HEAD
/*! kcharts - v1.2 - 2013-10-11 1:40:29 PM
=======
/*! kcharts - v1.2 - 2013-10-11 11:03:05 AM
>>>>>>> 8fdf0d9d33140c59605d302c62314e20e640cb8e
>>>>>>> 0f43453d3f6479d04b439b581e4c862651524e2a
* Copyright (c) 2013 数据可视化小组; Licensed  */
KISSY.add("gallery/kcharts/1.2/tools/htmlpaper/index",function(t){var l=t.all,e=function(t,e){var r=this;if(t)return r.$tgt=l(t),r._init(e)};return t.augment(e,{_init:function(l){var e=this;e._cfg=t.mix({clsName:"ks-charts-container",prependTo:!0,width:void 0,height:void 0,left:0,top:0,css:{}},l),e.$paper=e._createPaper()},_createPaper:function(){var t=this,e=t.$tgt,r=t._cfg,i=l("<div></div>").addClass(r.clsName).css({width:r.width||e.width(),height:r.height||e.height(),position:"absolute",marginTop:r.top||0,marginLeft:r.left||0}).css(r.css);return r.prependTo?i.prependTo(e):i.appendTo(e),i},text:function(t,e,r,i,n){var a,s,o=this,h=0,c=0,t=t-o._cfg.left,e=e-o._cfg.top,x=l("<div></div>").html(r).css({display:"block",position:"absolute"});switch(x.appendTo(o.$paper),a=x.outerWidth(),s=x.outerHeight(),i){case"right":h=-a;break;case"center":h=-a/2}switch(n){case"middle":c=-s/2;break;case"bottom":c=-s}return x.css({marginLeft:t+h,marginTop:e+c}),x},rect:function(t,e,r,i){var n=this,t=t-n._cfg.left,e=e-n._cfg.top,a=l("<div></div>").css({marginLeft:t,marginTop:e,width:r,height:i,"font-size":"1px",display:"block",position:"absolute"});return a.appendTo(n.$paper)},lineX:function(t,e,r){var i=this,t=t-i._cfg.left,e=e-i._cfg.top,n=l("<div></div>").css({marginLeft:t,marginTop:e,display:"block",position:"absolute",width:r,height:0,borderTop:"1px solid"});return n.appendTo(i.$paper)},lineY:function(t,e,r){var i=this,t=t-i._cfg.left,e=e-i._cfg.top,n=l("<div></div>").css({marginLeft:t,marginTop:e,display:"block",position:"absolute",width:0,height:r,borderLeft:"1px solid"});return n.appendTo(i.$paper)},clear:function(){var t=this;return t.$paper.html(""),t.$paper}}),e});