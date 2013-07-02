// -*- coding: utf-8; -*-
KISSY.add("gallery/kcharts/1.2/piechart/index",function(S,Util,Sector,Animate,Labels,Raphael,Color){
  var D = S.DOM
    , E = S.Event

  function render(){
    this.destroy();
    var framedata = this.get('framedata')
    this.animate(framedata)
  }

  function Pie(cfg){
    var container = S.get(cfg.renderTo)
      , width = D.width(container)
      , height = D.height(container)
      , paper = Raphael(container)
      , isStatic = D.css(container,'position') == "static" ? true : false
      , rs = cfg.rs

    cfg.rs = S.isArray(rs) ? rs : [rs]
    isStatic && D.css(container,"position","relative");

    this.set({"paper":paper,width:width,height:height,container:container})

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
        this.drawChart();
      });
      this.on("afterCyChange",function(){
        this.drawChart();
      });
      this.on("afterRsChange",function(){
        this.drawChart();
      });
      this.on("afterDataChange",function(){
        this.drawChart();
      });
      E.on(this.get("container"),"mouseleave",function(){
        this.fire("mouseleave");
      },this)
    },
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
      var bufferedDraw = S.buffer(render,100,this)
      this.render = bufferedDraw;
      this.bindEvent();
    },
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
      if($sectors){
        S.each($sectors,function($sector){
          $sector.destroy();
        });
        this.set("$sectors",null)
      }
    }
  })

  Pie.getSizeOf =  Labels.getSizeOf

  return Pie;
},{
  requires:["gallery/kcharts/1.2/piechart/util","gallery/kcharts/1.2/piechart/sector","gallery/kcharts/1.2/piechart/animation","gallery/kcharts/1.2/piechart/label","gallery/kcharts/1.1/raphael/index","gallery/kcharts/1.1/tools/color/index"]
});
