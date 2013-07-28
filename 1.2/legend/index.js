// -*- coding: utf-8-unix; -*-
KISSY.add("gallery/kcharts/1.2/legend/index",function(S,D,E,GraphTool,Animation){
  //获取content的尺寸
  var $detector
    , $body = S.one(document.body)
  function sizeof(html){
    $detector || ($detector = S.Node("<div/>").css({"visibility":"hidden","position":"fixed","left":'-9999em',"top":0}).appendTo($body));
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
    //console.log(attrname,value,props,index,len);
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

  function Legend(opts){
    opts = S.merge(dft,opts);
    this.set(opts);
    this.init();
  }

  S.extend(Legend,S.Base,{
    init:function(){
      var bbox = this.get("bbox")
        , paper = this.get("paper")
        , align = this.get("align")
        , icon = this.get("iconfn")
      //自定义的icon绘制函数
      if(icon && S.isFunction(icon)){
        this.icon = icon;
      }

      this.align(align);
    },
    bindEvent:function(){
      var els = this.get("els")
        , that = this;
      S.each(els,function(el){
        var $icon = el.icon
          , $text = el.des
          , evtdata = {
            icon:$icon,
            text:$text,
            index:el.index
          };
        S.each(["click","mouseover","mouseout"],function(e,i){
          $icon[e](function(){
            that.fire(e,evtdata)
          })
          el.des.on(e,function(){
            that.fire(e,evtdata)
          });
        });
      });
    },
    onframeend :function(){
      this.bindEvent();
    },
    item:function(n){
      var els = this.get("els")
      return els[n];
    },
    //返回一个icon
    icon:function(cx,cy,size,type){
      var paper = this.get("paper")
        , ret;
      switch(type){
				case "triangle":
        size || (size = 5);
				ret = GraphTool.triangle(paper,cx,cy+1,size);
				break;
				case "rhomb":
        size || (size = [8,8]);
				ret = GraphTool.rhomb(paper,cx,cy,size[0],size[1]);
				break;
				case "square":
        size || (size = 8);
				//菱形旋转45度
				ret = GraphTool.rhomb(paper,cx,cy,size,size,45);
				break;
				default:
        size || (size = 5);
				ret = paper.circle(cx,cy,size);
				break;
			}
      return ret;
    },
    align:function(align_mode){//vertical or horizonal
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
        , iconsize = globalConfig.iconsize || 6
        , icontype = globalConfig.icontype

      //文案宽度
      var text_total_width = 0
        , cache = []
      S.each(config,function(item,key){
        var $text = S.Node('<span class="kcharts-legend-item">'+item.text+'</span>');
        var text_size = sizeof($text);
        text_total_width+=text_size.width;
        cache.push({el:$text,width:text_size.width,height:text_size.height});
      });
      //总宽度
      var total_width = text_total_width
        , cache_icon = []

      var $icon = that.icon(-9999,9999,iconsize,icontype)
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

      S.each(config,function(item,key){
        if(alignhook){
          alignconfig = alignhook.call(that,alignconfig,key);
        }
        var cx = x
          , cy = y
        cx += DIFF;
        var $icon = that.icon(cx,cy,alignconfig.iconsize,alignconfig.icontype)
          , ibbox = $icon.getBBox()

        if(attrhook){
          $icon.attr(attrhook.call(that,key));
        }

        var $text = S.Node('<span class="kcharts-legend-item">'+item.text+'</span>');
        var text_size = sizeof($text)
          , left , top

        left = x+alignconfig.iconsize+alignconfig.iconright
        top = y - (ibbox.height/2 + (text_size.height - ibbox.height)/2 );
        left+=DIFF;
        $text.css({"left":left+'px',"top":top+"px","position":"absolute"});
        if(spanhook){
          $text.css(spanhook.call(that,key));
        }
        $text.appendTo($container);
        x+=text_size.width + 2*alignconfig.iconsize + interval + alignconfig.iconright;
        //动画属性构建
        var el = {icon:$icon,des:$text,index:key};
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
        , iconsize = globalConfig.iconsize || 6
        , icontype = globalConfig.icontype

      var total_height = 0
      var item = config[0]

      var $icon = that.icon(-9999,-9999,iconsize,icontype)
        , ibbox = $icon.getBBox()
        , len = config.length
        , iconright = globalConfig.iconright || 0
        , interval = globalConfig.interval

      $icon.remove();
      var $text = S.Node('<span class="kcharts-legend-item">'+item.text+'</span>');
      var text_size = sizeof($text)
      var max_height = Math.max(text_size.height,ibbox.height)
      total_height += max_height*len + interval*(len-1)

      var text_max_width = 0
        , cache = []
      var x0
        , y0
        , x , y
      S.each(config,function(item,key){
        var $text = S.Node('<span class="kcharts-legend-item">'+item.text+'</span>');
        var text_size = sizeof($text)
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
          iconsize:iconsize,
          iconright:iconright
      };

      S.each(config,function(item,key){
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
        var $icon = that.icon(cx,cy,alignconfig.iconsize,alignconfig.icontype)
          , ibbox = $icon.getBBox()
          , cache_item = cache[key];
        if(attrhook){
          $icon.attr(attrhook.call(that,key));
        }
        var $text = cache_item['el']
          , left
          , top
        if(!reverse){
          left = x + offset[0] - text_max_width + alignconfig.iconright
          top = y - (ibbox.height/2 + (cache_item.height - ibbox.height)/2 ) + offset[1];
        }else{
          left = x+alignconfig.iconsize+ibbox.width+offset[0];
          top = y - (ibbox.height/2 + (text_size.height - ibbox.height)/2 ) + offset[1];
        }
        top+=DIFF;
        $text.css({"left":left+'px',"top":top+"px","position":"absolute"});
        if(spanhook){
          $text.css(spanhook.call(that,key));
        }
        $text.appendTo($container);
        var max_height = Math.max(cache_item.height,ibbox.height)
        y+=max_height+interval;
        //动画属性构建
        var el = {icon:$icon,des:$text,index:key};
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
    }
  });
  return Legend;
},{
  requires:["dom","event","gallery/kcharts/1.2/tools/graphtool/index","gallery/kcharts/1.2/animation/index"]
});
