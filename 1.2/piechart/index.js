// -*- coding: utf-8; -*-
KISSY.add("gallery/kcharts/1.2/piechart/index",function(S,Util,Sector,Animate,Labels,Raphael,Color){
  var D = S.DOM
    , E = S.Event

  function render(){
    this.destroy();
    var paper = Raphael(this.get("container"),this.get("width"),this.get("height"));
    this.set("paper",paper);

    this.initPath();
    var framedata = this.get('framedata')
    this.animate(framedata)
  }

  // 调整cfg
  function setupcfg(cfg){
    var w = this.get("width")
      , h = this.get("height")
      , min = Math.min(w,h)
      , d
      , rpadding = cfg.rpadding //留给label
    if(!cfg.rs){
      if(!rpadding){
        rpadding = 40;
        this.set("rpadding",rpadding);
      }
      if(min>rpadding){
        d = min - rpadding;
      }else{
        d = min;
      }
      cfg.rs = [d/2];
    }
    //自动找圆心
    if(!S.isNumber(cfg.cx)){
      cfg.cx = w/2;
    }
    if(!S.isNumber(cfg.cy)){
      cfg.cy = h/2;
    }

    //设置重绘频率
    if(!S.isNumber(cfg.repaintRate)){
      cfg.repaintRate = 200;
    }

    //如果要画面包圈
    if(cfg.donut){
      cfg.donutSize || (cfg.donutSize = 30);
      if(cfg.donutSize>cfg.rs[0]){
        //设为半径的一半
        cfg.donutSize = cfg.rs[0]/2;
      }
      cfg.rs[1] = cfg.rs[0] - cfg.donutSize;
    }
  }

  /**
   * @param cfg {Object}
   * cfg.rpadding 留来画label的距离
   * cfg.repaintRate {Number} 重绘频率
   * cfg.donut {Bool} 是否为面包圈图
   * cfg.donutSize {Number} 若为面包圈图，设置面包圈的尺寸
   * */

  function Pie(cfg){
    var container = S.get(cfg.renderTo)
      , width = D.width(container)
      , height = D.height(container)
      , paper = Raphael(container)
      , isStatic = D.css(container,'position') == "static" ? true : false

    this.set({"paper":paper,width:width,height:height,container:container})

    //若没有cx|cy|r，则算一个默认的出来
    this._setupcfg(cfg);

    if(!S.isArray(cfg.rs)){
      cfg.rs = [cfg.rs];
    }

    isStatic && D.css(container,"position","relative");

    this.set(cfg);

    // adjust animation cfg
    this.adjustCfg();
    // adjustData
    this.adjustData();
    if(cfg.autoRender != false){
      this.render();
    }
  }
  S.extend(Pie,S.Base,{
    bindEvent:function(){
      this.on("afterCxChange",function(){
        this.render();
      });
      this.on("afterCyChange",function(){
        this.render();
      });
      this.on("afterRsChange",function(){
        this.render();
      });
      this.on("afterDataChange",function(){
        this.render();
      });
      E.on(this.get("container"),"mouseleave",function(){
        this.fire("mouseleave");
      },this)
    },
    _setupcfg:setupcfg,
    //调整动画的配置
    adjustCfg:function(){
      var anim = this.get('anim')
        , that = this
        , _end = S.isFunction(anim.endframe) && anim.endframe
        , lablecfg = that.get("label")
        anim.endframe = function(){
          if(lablecfg != false){
            that.drawLabel(lablecfg);
          }
          _end && _end.call(that);
          that.fire('afterRender');
        }
    },
    /**
     * 过滤函数
     * */
    adjustData:function(){
      var fn = this.get('filterfn')
      if(fn && S.isFunction(fn)){
        var data = this.get('data')
          , ret
        ret = Util.filterdata(data,fn)
        // console.log(JSON.stringify(ret));
        this.set("data",ret);
      }
    },
    initPath:function(){
      var ret = Util.initPath(this)
      this.set("$sectors",ret.$sectors);
      this.set("groups",ret.groups)
      this.set("set",ret.set);
      this.set("framedata",ret.framedata);
    },
    render:function(){
      this.initPath();
      var framedata = this.get('framedata')
      this.animate(framedata)
      // 第一次绘制完成后，后面属性更改会重绘：避免一次一次批量属性修改造成多次重绘
      var bufferedDraw = S.buffer(render,this.get("repaintRate"),this)
      this.render = bufferedDraw;
      this.bindEvent();
    },
    /**
     * 调整饼图：隐藏部分扇形
     * */
    adjust:function(){
      var that = this
        , groups = this.get("groups").slice(0)
        , framedata = this.get("framedata")
      framedata = S.filter(framedata,function(frame){
                   return !frame.hide;
                 })
      Util.adjustFrameData(groups,this);
      this.animate(framedata);
    },
    /**
     * 自动调整r,cx,cy
     * */
    autoResize:function(){
      var con = this.get("container")
        , w = D.width(con)
        , h = D.height(con)
        , min = Math.min(w,h)
        , d
        , rpadding = this.get("rpadding")
        , cx = this.get("cx")
        , cy = this.get("cy")
        , cx1 = w/2 ,cy1 = h/2

      var attrs = {"width":w,"height":h};
      this.set(attrs);

      if(!Util.closeto(cx1,cx)){
        this.set("cx",cx1);
      }
      if(!Util.closeto(cy1,cy)){
        this.set("cy",cy1);
      }

      if(min>rpadding){
        d = min - rpadding;
      }else{
        d = min;
      }

      //如果要画面包圈
      var drawDonut = this.get("donut")
        , donutSize = this.get("donutSize")
        , r0 ,r1

      if(drawDonut){
        r0 = d/2
        if(donutSize>r0){
          r1 = r0/2;
        }else{
          r1 = r0 - donutSize;
        }
        this.set("rs",[r0,r1]);
      }else{
        var rs = this.get("rs")
        if(rs.length == 1){
          this.set("rs",[d/2]);
        }
      }
    },
    animate:function(framedata){
      var that = this
        , anim = this.get("anim")

      if(this.isRunning()){
        this.stop();
      }
      that.fire("beginRender");
      this.animateInstance = Animate.AnimateObject(framedata,anim);
    },
    /**
     * 绘制外层label
     * */
    drawLabel:function(){
      var leftSectors = [] // 最外层的
        , rightSectors = []
        , $sectors = this.get('$sectors')
        , $leftLables
        , $rightLables

      S.each($sectors,function($sector){
        var ma = $sector.get('middleangle')
          , groupLength = $sector.get("groupLength")
          , groupIndex = $sector.get("groupIndex")
          , isright = Util.isRightAngel(ma)

        if(S.indexOf(groupLength-1,groupIndex) > -1){
          if(isright){
            rightSectors.push($sector);
          }else{
            $sector.set("isleft",true);
            leftSectors.push($sector);
          }
        }else{
          if(isright){
            $sector.set("isright",true);
          }else{
            $sector.set("isleft",true);
          }
        }
      });
      $leftLables = new Labels(this,leftSectors,true)
      $rightLables = new Labels(this,rightSectors,false)

      $leftLables.on('click',this.onLabelClick,this);
      $rightLables.on('click',this.onLabelClick,this);

      this.set("$labels",[].concat($leftLables,$rightLables));
    },
    /**
     * 绘制内部label，需配置
     * */
    drawSetLabel:function(){

    },
    onLabelClick:function(e){
      this.fire('labelclick',{
        el:e.el,
        label:e.label,
        sector:e.sector
      })
    },
    isRunning:function(){
      return this.animateInstance && this.animateInstance.isRunning();
    },
    stop:function(){
      if(this.animateInstance){
        this.animateInstance.stop();
        delete this.animateInstance;
      }
    },
    destroy:function(){
      var $sectors = this.get("$sectors")
        , $labels = this.get("$labels")
        , litter = [].concat($sectors,$labels)
      S.each(litter,function(i){
        i && i.destroy();
      });
      this.set("$sectors",null);
      this.set("$labels",null);
      this.get("paper").remove();
    }
  })

  Pie.getSizeOf =  Labels.getSizeOf

  return Pie;
},{
  requires:["gallery/kcharts/1.2/piechart/util","gallery/kcharts/1.2/piechart/sector","gallery/kcharts/1.2/piechart/animation","gallery/kcharts/1.2/piechart/label","gallery/kcharts/1.1/raphael/index","gallery/kcharts/1.1/tools/color/index"]
});
