define(function(require,exports,module) {

  var Util = require("util"),
    Node = require("node"),
    Base = require("base"),
    D = require("dom"),
    E = require("event-dom"),
    Icons = require("kg/kcharts/5.0.1/icons/index"),
    Animation = require("kg/kcharts/5.0.1/animate/index"),
    Raphael = require("kg/kcharts/5.0.1/raphael/index");

  var $ = Node.all;


  var merge = Util.merge;

  var unit = Icons.BASIC[1];

  var win = window
    , Raphael = win.Raphael

  //获取content的尺寸
  var $detector
    , $body = Node.one(document.body)
  function sizeof(html){
    $detector || ($detector = Node.all("<div/>").css({"visibility":"hidden","position":"fixed","left":'-9999em',"top":0}).appendTo($body));
    D.append(html,$detector);
    var ret = {
      width:D.outerWidth($detector),
      height:D.outerHeight($detector)
    }
    $detector.html("");
    return ret;
  }

  var dft = {
    offset:[0,0],
    globalConfig:{
      interval:5
    }
  }
  //动画帧处理器:由下往上
  function onframeB2T(attrname,value,props,index,len){
    var els = this.el
      , $icon = els.icon
      , $text = els.des
    if(attrname === "cy"){
      $icon.transform("t0,"+value);
    }else if(attrname === "top"){
      $text.css("top",value+"px");
    }
  }
  //动画帧处理器:由右往左
  function onframeR2L(attrname,value,props,index,len){
    var els = this.el
      , $icon = els.icon
      , $text = els.des
    //console.log(attrname,value,props,index,len);
    if(attrname === "cx"){
      $icon.transform("t"+value+",0");
    }else if(attrname === "left"){
      $text.css(attrname,value+"px");
    }
  }

  function disable(legend,item){
    var o = legend.get("disablestyle"),
        style = {
          icon:{
            "stroke":"#ccc",
            "fill":"#ccc"
          },
          text:{
            "color":"#ccc"
          }
        };
    if(Util.isFunction(o)){
      style = Util.mix(style,o(this,this.index));
    }else{
      style = Util.mix(style,o)
    }
    var $icon = this.icon,
        $text = this.des
    $icon.attr(style.icon);
    $text.css(style.text);
  }

  function enable(legend,item){
    var o = legend.get("enablestyle"),
        style = {
          icon:{
            "stroke":item.DEFAULT,
            "fill":item.DEFAULT
          },
          text:{
            "color":item.DEFAULT
          }
        };
    if(Util.isFunction(o)){
      style = Util.mix(style,o(this,this.index));
    }else{
      style = Util.mix(style,o)
    }
    var $icon = this.icon,
        $text = this.des
    $icon.attr(style.icon);
    $text.css(style.text);
  }

  var Legend;

   var methods = {
     initializer:function(){
       this._setupPaper();
       this._setupCon();
       var bbox = this.get("bbox")
         , paper = this.get("paper")
         , align = this.get("align")
         , icon = this.get("iconfn")

       //this.set("paper")
       //自定义的icon绘制函数
       if(icon && Util.isFunction(icon)){
         this.icon = icon;
       }
       this.align(align);
     },
     _setupPaper:function(){
       var p = this.get("paper")
       if(!p){
         var con = this.get("container")
         p = Raphael(con[0],D.width(con),D.height(con))
         this.set("paper",p);
       }
       if(Raphael.type == "VML"){

       }else{
         p.canvas.style.zIndex = 10;
       }
     },
     bindEvent:function(){
       var els = this.get("els")
         , that = this;
       Util.each(els,function(el){
         var $icon = el.icon
           , $text = el.des
           , evtdata = {
             icon:$icon,
             text:$text,
             index:el.index,
             el:el
           };
         Util.each(["click","mouseover","mouseout"],function(e,i){
           $icon[e](function(){
             that.fire(e,evtdata)
           })

           $text.on(e,function(){
             that.fire(e,evtdata)
           });
         });
       });
     },
     unbindEvent:function(){
       var els = this.get("els")
         , that = this;
       Util.each(els,function(el){
         var $icon = el.icon
           , $text = el.des
         Util.each(["click","mouseover","mouseout"],function(e,i){
           $icon['un'+e]();
           $text.detach(e);
         });
       });
     },
     remmoveLegendIconAndText:function(){
       var els = this.get("els")
         , that = this;
       Util.each(els,function(el){
         var $icon = el.icon
           , $text = el.des
         $icon.remove();
         $text.remove();
       });
     },
     onframeend :function(){
       this.bindEvent();
     },
     //设置容器的样式：不能为static定位
     _setupCon:function(){
       var con = this.get("container")
         , pos = D.css(con,"position")
       if(pos == "static"){
         D.css(con,"position","relative");
       }
     },
     item:function(n){
       var els = this.get("els")
       return els[n];
     },
     //返回一个icon
     icon:function(cx,cy,size,type){
       var paper = this.get("paper")
         , ret
         , _size = size;
       switch(type){
		 case "triangle":
		 ret = Icons.triangle(cx,cy,{
           paper:paper,
           size:_size
         });
		 break;
		 case "linetriangle":
		 ret = Icons.linetriangle(cx,cy,{
           paper:paper,
           size:_size
         });
		 break;
         case "rhomb":
		 case "diamon":
		 ret = Icons.diamond(cx,cy,{
           paper:paper,
           size:_size
         });
		 break;
         case "linerhomb":
         case "linediamond":
		 ret = Icons.linediamond(cx,cy,{
           paper:paper,
           size:_size
         });
         break;
		 case "square":
		 ret = Icons.square(cx,cy,{
           paper:paper,
           size:_size
         });
		 break;
		 case "linesquare":
		 ret = Icons.linesquare(cx,cy,{
           paper:paper,
           size:_size
         });
		 break;
		 case "linecircle":
		 ret = Icons.linecircle(cx,cy,{
           paper:paper,
           size:_size
         });
		 break;
		 default:
		 ret = Icons.circle(cx,cy,{
           paper:paper,
           size:_size
         });
		 break;
	   }
       return ret;
     },
     //vertical or horizonal
     align:function(align_mode){
       var algrithms = {
         "tl":"alignTopLeft",
         "tc":"alignTopCenter",
         "tr":"alignTopRight",
         "rt":"alignRightTop",
         "rm":"alignRightMiddle",
         "rb":"alignRightBottom",
         "bl":"alignBottomLeft",
         "bc":"alignBottomCenter",
         "br":"alignBottomRight",
         "lt":"alignLeftTop",
         "lm":"alignLeftMiddle",
         "lb":"alignLeftBottom"
       };
       var align_algrithm = algrithms[align_mode] || "alignRight";
       this[align_algrithm]();
     },
     //mode = left right center ; bottom表示在底部
     alignTop:function(mode,bottom){
       var $container = this.get("container")
         , bbox = this.get("bbox")
         , offset = this.get("offset")
         , paper = this.get("paper")
         , config = this.get("config")
         , globalConfig = this.get("globalConfig")
         , that = this
         , $iconsize = globalConfig.iconsize || [1,1]
         , iconsize = $iconsize*unit || 6
         , icontype = globalConfig.icontype

       //文案宽度
       var text_total_width = 0
         , cache = []
       Util.each(config,function(item,key){
         var text = item.text || "data"+key;
         var $text = Node.all('<span class="kcharts-legend-item">'+text+'</span>');
         var text_size = sizeof($text);
         text_total_width+=text_size.width;
         cache.push({el:$text,width:text_size.width,height:text_size.height,zIndex:10,cursor:"pointer"});
       });
       //总宽度
       var total_width = text_total_width
         , cache_icon = []

       var $icon = that.icon(-9999,9999,$iconsize,icontype)
         , ibbox = $icon.getBBox()
         , iconright = globalConfig.iconright || 0
         , interval = globalConfig.interval||0

       $icon.remove();
       total_width+=(ibbox.width + iconright)*config.length + interval*(config.length-1);

       var x0 = bbox.left + offset[0]
         , y0 = bbox.top + offset[1] - 2*iconsize

       var x = x0 + (bbox.width - total_width)/2 + iconsize
         , y = y0;

       if(bottom){
         y = y + 4*iconsize + bbox.height;
       }
       if(mode == "l"){
         x = 0+offset[0]+iconsize;
       }else if(mode == "r"){
         var width = D.width($container)
         x = width - total_width;
       }

       var els = [];
       var alignhook = this.get("alignhook");
       var attrhook = this.get("iconAttrHook");
       var spanhook = this.get("spanAttrHook")

       //动画属性
       var framedata = [];
       var anim = this.get("anim")
       var DIFF = anim ? D.width($container) : 0;

       var alignconfig = {
         icontype:icontype,
         iconsize:iconsize,
         iconright:iconright
       };

       Util.each(config,function(item,key){
         if(alignhook){
           alignconfig = alignhook.call(that,alignconfig,key);
         }
         var cx = x
           , cy = y
         cx += DIFF;

         var $icon = that.icon(cx,cy,$iconsize,item.icontype || alignconfig.icontype)
           , ibbox = $icon.getBBox()
         var attr = {};
         Util.mix(attr,item,true,["DEFAULT","HOVER"]);
         var oo = {fill:attr.DEFAULT}
         if(attrhook){
           oo = S.merge({fill:attr.DEFAULT},attrhook.call(that,key));
         }
         oo.stroke = oo.fill;
         $icon.attr(oo);

         var text = item.text || "data"+key;
         var $text = D.create('<span class="kcharts-legend-item"></span>');
         D.html($text,text);
         var text_size = sizeof($text)
           , left , top
         $text = $('<span class="kcharts-legend-item">'+text+'</span>');

         left = x+alignconfig.iconsize+alignconfig.iconright
         top = y - (ibbox.height/2 + (text_size.height - ibbox.height)/2 );
         left+=DIFF;
         var css = {"left":left+'px',"top":top+"px","position":"absolute",zIndex:10,cursor:"pointer"}

         if(attr.DEFAULT){
           css.color = attr.DEFAULT;
         }
         if(spanhook){
           css = S.merge(css,spanhook.call(that,key));
         }
         $text.css(css);
         $text.appendTo($container);
         x+=text_size.width + 2*alignconfig.iconsize + interval + alignconfig.iconright;

         //动画属性构建
         var el = {icon:$icon,des:$text,index:key,
                   disable:function(){
                     disable.call(el,that,item);
                   },
                   enable:function(){
                     enable.call(el,that,item);
                   }};
         els.push(el);
         if(!anim)return;
         framedata.push({
           el:el,
           frame:onframeR2L,
           from:{
             cx:0,
             left:left
           },
           to:{
             cx:-DIFF,
             left:left-DIFF
           }
         });
       });
       this.set("els",els);
       if(anim){
         anim.endframe = function(){that.onframeend();}
         Animation.AnimateObject(framedata,anim);
       }else{
         that.onframeend();
       }
     },
     alignTopLeft:function(){
       this.alignTop("l");
     },
     alignTopCenter:function(){
       this.alignTop("c");
     },
     alignTopRight:function(){
       this.alignTop("r");
     },
     alignRight:function(mode){
       this.alignLeft(mode,true);
     },
     alignRightTop:function(){
       this.alignRight("t");
     },
     alignRightMiddle:function(){
       this.alignRight("m");
     },
     alignRightBottom:function(){
       this.alignRight("b");
     },
     alignBottomLeft:function(){
       this.alignTop("l",true);
     },
     alignBottomCenter:function(){
       this.alignTop("c",true);
     },
     alignBottomRight:function(){
       this.alignTop("r",true);
     },
     alignLeft:function(mode,reverse){
       var $container = this.get("container")
         , bbox = this.get("bbox")
         , offset = this.get("offset")
         , paper = this.get("paper")
         , config = this.get("config")
         , globalConfig = this.get("globalConfig")
         , that = this
         , $iconsize = globalConfig.iconsize || [1,1]
         , iconsize = $iconsize*unit || 6
         , icontype = globalConfig.icontype

       var total_height = 0
       var item = config[0]

       var $icon = that.icon(-9999,-9999,$iconsize,icontype)
         , ibbox = $icon.getBBox()
         , len = config.length
         , iconright = globalConfig.iconright || 0
         , interval = globalConfig.interval

       $icon.remove();

       var text = item.text || "data";
       var $text = $('<span class="kcharts-legend-item">'+text+'</span>');
       var text_size = sizeof($text)
       var max_height = Math.max(text_size.height,ibbox.height)
       total_height += max_height*len + interval*(len-1)

       var text_max_width = 0
         , cache = []
       var x0
         , y0
         , x , y
       Util.each(config,function(item,key){
         var $text = $('<span class="kcharts-legend-item">'+item.text+'</span>');
         var text_size = sizeof($text)
         var text = item.text || "data"+key;

         if(text_max_width < text_size.width){
           text_max_width = text_size.width;
         }
         cache.push({el:$text,width:text_size.width,height:text_size.height});
       });

       text_max_width += iconright;

       if(!reverse){
         x0 = bbox.left + offset[0]
         y0 = bbox.top + offset[1]
         x = x0 , y = y0;
       }else{
         x0 = bbox.left + bbox.width + offset[0];
         y0 = bbox.top + offset[1];
         x = x0 + iconsize, y = y0;
       }

       if(mode == "m"){
         y = bbox.top + (bbox.height - total_height)/2
       }else if(mode == "b"){
         y = bbox.top + bbox.height - total_height;
       }
       var els = [];
       var alignhook = this.get("alignhook");
       var attrhook = this.get("iconAttrHook");
       var spanhook = this.get("spanAttrHook");

       //动画属性
       var framedata = [];
       var anim = this.get("anim");
       var DIFF = anim ? D.height($container) : 0;

       var alignconfig = {
         icontype:icontype,
         iconright:iconright
       };

       Util.each(config,function(item,key){
         if(alignhook){
           alignconfig = alignhook.call(that,alignconfig,key);
         }
         var cx , cy
         if(!reverse){
           cx = x - text_max_width - iconsize + offset[0]
           cy = y + offset[1];
         }else{
           cx = x+offset[0];
           cy = y+offset[1];
         }
         cy+=DIFF;
         var $icon = that.icon(cx,cy,$iconsize ,item.icontype || alignconfig.icontype)
           , ibbox = $icon.getBBox()
           , cache_item = cache[key];
         var attr = {};
         Util.mix(attr,item,true,["DEFAULT","HOVER"]);
         var oo = {fill:attr.DEFAULT}
         if(attrhook){
           oo = S.merge(oo,attrhook.call(that,key));
         }
         oo.stroke = oo.fill;
         $icon.attr(oo);

         var $text = $('<span class="kcharts-legend-item">'+item.text+'</span>')//cache_item['el']
           , left
           , top;
         if(!reverse){
           left = x + offset[0] - text_max_width + alignconfig.iconright
           top = y - (ibbox.height/2 + (cache_item.height - ibbox.height)/2 ) + offset[1];
         }else{
           left = x+iconsize+ibbox.width+offset[0];
           top = y - (ibbox.height/2 + (text_size.height - ibbox.height)/2 ) + offset[1];
         }
         top+=DIFF;
         var css = {"left":left+'px',"top":top+"px","position":"absolute",zIndex:10,cursor:"pointer"}

         if(attr.DEFAULT){
           css.color = attr.DEFAULT;
         }
         if(spanhook){
           css = S.merge(css,spanhook.call(that,key));
         }
         $text.css(css);

         $text.appendTo($container);
         var max_height = Math.max(cache_item.height,ibbox.height)
         y+=max_height+interval;
         //动画属性构建
         var el = {icon:$icon,des:$text,index:key,
                   disable:function(){
                   disable.call(el,that,item);
                 },
                   enable:function(){
                    enable.call(el,that,item);
                  }};
         els.push(el);
         if(!anim)return;
         framedata.push({
           el:el,
           frame:onframeB2T,
           from:{
             cy:0,
             top:top
           },
           to:{
             cy:-DIFF,
             top:top-DIFF
           }
         });
       });
       this.set("els",els);
       if(anim){
         anim.endframe = function(){that.onframeend();}
         Animation.AnimateObject(framedata,anim);
       }else{
         that.onframeend();
       }
     },
     alignLeftTop:function(){
       this.alignLeft("t");
     },
     alignLeftMiddle:function(){
       this.alignLeft("m");
     },
     alignLeftBottom:function(){
       this.alignLeft("b");
     },
     /**
      * 销毁legend实例
      **/
     destroy:function(){
       this.unbindEvent();
       this.remmoveLegendIconAndText();
     }
   };


  return Base.extend(methods);
});
