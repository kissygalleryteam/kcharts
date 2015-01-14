define(function(require, exports, module) {
  var PieUtil = require("./util"),
    Sector = require("./sector"),
    Animate = require("kg/kcharts/5.0.1/animate/index"),
    Labels = require("./label"),
    Raphael = require("kg/kcharts/5.0.1/raphael/index"),
    Color = require("kg/kcharts/5.0.1/tools/color/index"),
    Base = require("base"),
    E = require("event-dom"),
    Node = require("node");
    D = require("dom"),
    Util = require("util");
  var $ = Node.all;
  var COLOR_TPL = "{COLOR}";

  function render() {
    this.destroy();
    var paper = Raphael(this.get("container"), this.get("width"), this.get("height"));
    this.set("paper", paper);

    this.initPath();
    this.fire("beforeRender");
    var framedata = this.get('framedata')
    this.animate(framedata)
  }

  // 调整cfg
  function setupcfg(cfg) {
    var w = this.get("width"),
      h = this.get("height"),
      min = Math.min(w, h),
      d, rpadding = cfg.rpadding //留给label
    if (!cfg.rs) {
      if (!rpadding) {
        rpadding = 40;
        this.set("rpadding", rpadding);
      }
      if (min > rpadding) {
        d = min - rpadding;
      } else {
        d = min;
      }
      cfg.rs = [d / 2];
    }
    //自动找圆心
    if (!Util.isNumber(cfg.cx)) {
      cfg.cx = w / 2;
    }
    if (!Util.isNumber(cfg.cy)) {
      cfg.cy = h / 2;
    }

    //设置重绘频率
    if (!Util.isNumber(cfg.repaintRate)) {
      cfg.repaintRate = 200;
    }

    //如果要画面包圈
    if (cfg.donut) {
      if (cfg.rs.length != 2) {
        cfg.donutSize || (cfg.donutSize = 30);
        if (cfg.donutSize > cfg.rs[0]) {
          //设为半径的一半
          cfg.donutSize = cfg.rs[0] / 2;
        }
        cfg.rs[1] = cfg.rs[0] - cfg.donutSize;
      }
    }
  }

  /**
   * @param cfg {Object}
   * cfg.rpadding 留来画label的距离
   * cfg.repaintRate {Number} 重绘频率
   * cfg.donut {Bool} 是否为面包圈图
   * cfg.donutSize {Number} 若为面包圈图，设置面包圈的尺寸
   * cfg.initdeg {Number} 画扇形的起始位置，默认为90度
   * cfg.gradient {Bool} 是否开启渐变，可以手动配置framedata.gradientcolor
   * */
  var init = function() {
    var container = $(this.get('renderTo'))[0],
      width = D.width(container),
      height = D.height(container),
      paper = Raphael(container),
      isStatic = D.css(container, 'position') == "static" ? true : false

    var data = this.get("series") || this.get("data");
    this.set("series", data);
    this.set("data", data);

    this.set({
      "paper": paper,
      width: width,
      height: height,
      container: container
    })

    var cfg = this.userConfig;
    // 若没有cx|cy|r，则算一个默认的出来
    this._setupcfg(cfg);

    if (!Util.isArray(cfg.rs)) {
      cfg.rs = [cfg.rs];
    }

    isStatic && D.css(container, "position", "relative");

    this.set(cfg);

    // adjust animation cfg
    this.adjustCfg();
    // adjustData
    this.adjustData();
    // 有标题则显示标题
    this.drawTitle();
    if (cfg.autoRender != false) {
      var that = this;
      // 延迟渲染
      setTimeout(function() {
        that.render();
      }, 0);
    }

    // 渲染tip
    var tipconfig = this.get("tip");
    if (tipconfig && tipconfig != false) {
      this.renderTip();
    }
  }

  var methods = {
    initializer: init,
    bindEvent: function() {
      this.on("afterCxChange", function() {
        this.render();
      });
      this.on("afterCyChange", function() {
        this.render();
      });
      this.on("afterRsChange", function() {
        this.render();
      });
      this.on("afterDataChange", function() {
        this.render();
      });
      E.on(this.get("container"), "mouseleave", function() {
        this.fire("mouseleave");
      }, this)
      this.on("afterRender", this.onafterrender, this);
    },
    _setupcfg: setupcfg,
    onafterrender: function() {
      //只执行一次
      if (this.legendrendered) return;
      this.legendrendered = true;
      var that = this,
        paper,
        container,
        bbox
      var config = this.get("legend")
      if (config && config.isShow === false)
        return;

      if (config) {
        paper = this.get("paper")
        container = this.get("container")

        bbox = this.getbbox();

        function buildparts() {
          var $sectors = that.get("$sectors"),
            ret
          ret = S.map($sectors, function($sector) {
            var el = $sector.get("$path"),
              fill = el.attr("fill"),
              framedata = $sector.get("framedata"),
              text = framedata.label
            return {
              color: fill,
              text: text,
              $path: el
            }
          });
          return ret;
        }

        S.use("kg/kcharts/5.0.1/legend/index", function(S, Legend) {
          var parts = buildparts();
          var dft = {
            //legend需要的原始信息
            paper: paper,
            container: container,
            bbox: bbox, //图表主体的信息
            iconAttrHook: function(index) { //每次绘制icon的时调用，返回icon的属性信息
              return {
                fill: parts[index].color
              }
            },
            spanAttrHook: function(index) { //每次绘制“文本描述”的时候调用，返回span的样式
              var color = Raphael.getRGB(parts[index].color);
              return {
                color: color.hex
              }
            },
            config: parts
          }
          config.globalConfig = S.merge({
            shape: "square",
            interval: 20, //legend之间的间隔
            iconright: 5 //icon后面的空白
          }, config.globalConfig);
          var legend = new Legend(S.merge(dft, config));
          that.set("legend", legend);
          that.fire("afterLegendRender");
        });
      }
    },
    //调整动画的配置
    adjustCfg: function() {
      var anim = this.get('anim'),
        that = this,
        _end = Util.isFunction(anim.endframe) && anim.endframe,
        lablecfg = that.get("label")
        //若无动画配置则duration设置为0
      anim || (anim = {
        duration: 0
      });
      anim.endframe = function() {
        if (lablecfg != false) {
          that.drawLabel(lablecfg);
        }
        _end && _end.call(that);
        that.fire('afterRender');
      }
    },
    /**
     * 过滤函数
     * */
    adjustData: function() {
      var fn = this.get('filterfn')
      if (fn && Util.isFunction(fn)) {
        var data = this.get('data'),
          ret, combine = this.get("combineSmallData"),
          otherText = this.get("smallDataLabel") || "其它"

        ret = PieUtil.filterdata(data, fn, combine, otherText)
        this.set("data", ret);
      }
    },
    initPath: function() {
      var ret = PieUtil.initPath(this)
      this.set("$sectors", ret.$sectors);
      this.set("groups", ret.groups)
      this.set("set", ret.set);
      this.set("framedata", ret.framedata);
    },
    render: function() {
      this.initPath();
      this.fire("beforeRender");
      var framedata = this.get('framedata')
      this.animate(framedata)

      // 第一次绘制完成后，后面属性更改会重绘：避免一次一次批量属性修改造成多次重绘
      var bufferedDraw = Util.buffer(render, this.get("repaintRate"), this);
      this.render = bufferedDraw;
      this.bindEvent();
    },
    /**
     * 调整饼图：隐藏部分扇形
     * */
    adjust: function() {
      var that = this,
        groups = this.get("groups").slice(0),
        framedata = this.get("framedata")
      framedata = S.filter(framedata, function(frame) {
        return !frame.hide;
      })
      PieUtil.adjustFrameData(groups, this);
      var $labels = this.get("$labels")
      Util.each($labels, function(i) {
        i && i.destroy();
      });
      this.animate(framedata);
    },
    /**
     * 自动调整r,cx,cy
     * */
    autoResize: function() {
      var con = this.get("container"),
        w = D.width(con),
        h = D.height(con),
        min = Math.min(w, h),
        d, rpadding = this.get("rpadding"),
        cx = this.get("cx"),
        cy = this.get("cy"),
        cx1, cy1

      cx1 = w / 2, cy1 = h / 2;

      //考虑title带来的影响
      var titlebbox = this.get("titlebbox")
      if (titlebbox) {
        cy1 += titlebbox.height;
      }

      var attrs = {
        "width": w,
        "height": h
      };
      this.set(attrs);

      if (!PieUtil.closeto(cx1, cx)) {
        this.set("cx", cx1);
      }
      if (!PieUtil.closeto(cy1, cy)) {
        this.set("cy", cy1);
      }

      if (min > rpadding) {
        d = min - rpadding;
      } else {
        d = min;
      }

      if (titlebbox) {
        d -= titlebbox.height;
      }

      //如果要画面包圈
      var drawDonut = this.get("donut"),
        donutSize = this.get("donutSize"),
        r0, r1

      if (drawDonut) {
        r0 = d / 2
        if (donutSize > r0) {
          r1 = r0 / 2;
        } else {
          r1 = r0 - donutSize;
        }
        this.set("rs", [r0, r1]);
      } else {
        var rs = this.get("rs")
        if (rs.length == 1) {
          this.set("rs", [d / 2]);
        }
      }
    },
    animate: function(framedata) {
      var that = this,
        anim = this.get("anim")

      if (this.isRunning()) {
        this.stop();
      }
      that.fire("beginRender");
      this.animateInstance = Animate.AnimateObject(framedata, anim);
    },
    drawTitle: function() {
      var titleconfig = this.get("title"),
        title, offset, align
      if (titleconfig) {
        title = titleconfig.content
        offset = titleconfig.offset || [0, 10]
        align = titleconfig.align || "center"

        var size = Labels.getSizeOf(title),
          container = this.get("container"),
          w = D.width(container),
          h = D.height(container),
          left, top
        if (align == "left") {
          left = 0;
        } else if (align == "right") {
          left = w - size.width;
        } else { //center
          left = (w - size.width) / 2 + offset[0]
        }
        top = offset[1];
        var $title = S.Node("<div>" + title + "</div>");
        $title.css({
          "top": top + "px",
          "left": left + "px",
          "position": "absolute"
        });
        this.set("title", $title);
        this.set("titlebbox", {
          left: left,
          top: top,
          width: size.width,
          height: size.height
        });
        $title.appendTo(container);
      }
    },
    /**
     * 绘制外层label
     * */
    drawLabel: function() {
      var leftSectors = [] // 最外层的
        ,
        rightSectors = [],
        $sectors = this.get('$sectors'),
        $leftLables, $rightLables

      Util.each($sectors, function($sector) {
        var ma = $sector.get('middleangle'),
          groupLength = $sector.get("groupLength"),
          groupIndex = $sector.get("groupIndex"),
          isright = PieUtil.isRightAngel(ma),
          framedata = $sector.get("framedata")
          //如果隐藏了，那么也不展示对应的label
        if (!framedata.hide) {
          if (Util.indexOf(groupLength - 1, groupIndex) > -1) {
            if (isright) {
              rightSectors.push($sector);
            } else {
              $sector.set("isleft", true);
              leftSectors.push($sector);
            }
          } else {
            if (isright) {
              $sector.set("isright", true);
            } else {
              $sector.set("isleft", true);
            }
          }
        }
      });
      $leftLables = new Labels({
        pie: this,
        $sectors: leftSectors,
        isleft: true
      });
      $rightLables = new Labels({
        pie: this,
        $sectors: rightSectors,
        isleft: false
      });

      $leftLables.on('click', this.onLabelClick, this);
      $rightLables.on('click', this.onLabelClick, this);

      this.set("$labels", [].concat($leftLables, $rightLables));
    },
    /**
     * 绘制内部label，需配置
     * */
    drawSetLabel: function() {},
    getbbox: function() {
      var bbox;
      var rs = this.get("rs"),
        rl = rs[rs.length - 1],
        rpadding = this.get("rpadding") || 0,
        padding = this.get("padding") || 0,
        cx = this.get("cx"),
        cy = this.get("cy");

      var width = (rl + rpadding + padding) * 2,
        left = cx - width / 2,
        top = cy - width / 2;

      bbox = {
        width: width,
        height: width,
        left: left,
        top: top
      };
      return bbox;
    },
    /**
     * afterRender事件后渲染
     * */
    renderTip: function(tipconfig) {
      // 渲染过后就不再重复渲染
      if (this.tip)
        return

      tipconfig || (tipconfig = this.get("tip"));
      if (!tipconfig)
        return;

      // {
      //   x: ctn.tl.x,
      //   y: ctn.tl.y,
      //   width: ctn.width,
      //   height: ctn.height
      // }

      var self = this;
      var container = self.get("container");

      S.use("kg/kcharts/5.0.1/tip/index", function(S, Tip) {
        var bbox = self.getbbox();
        // 修正bbox字段
        bbox.x = bbox.left;
        bbox.y = bbox.top;

        var themeCls = tipconfig.themeCls || "ks-chart-default";

        var boundryCfg = tipconfig.boundryDetect ? bbox : {},
          tipCfg = S.mix(tipconfig, {
            rootNode: container,
            clsName: themeCls,
            boundry: boundryCfg
          }, undefined, undefined, true);

        var tip = new Tip(tipCfg);
        self.tip = tip;
        self.on("mouseover", function(e) {
          // 移动tip
          var sector = e.sector;
          var x = sector.get("middlex"),
            y = sector.get("middley"),
            data = sector.get("framedata"), // 即配置的数据
            label = data.label,
            groupIndex = sector.get("groupIndex"),
            donutIndex = sector.get("donutIndex"),
            percent = data.percent

          var color = sector.get("color");

          var size = Labels.getSizeOf(label); // label的尺寸

          percent = (percent * 100).toFixed(2) + "%";
          if (Util.isFunction(tipconfig.template)) {
            tip.setContent(tipconfig.template.apply(tip, [donutIndex, groupIndex, label, percent]));
          } else {
            tip.renderTemplate(tipconfig.template, {
              "donutIndex": donutIndex,
              index: groupIndex,
              label: label,
              "percent": percent
            });
          }
          tip.fire('move', {
            x: x,
            y: y,
            style: self.processAttr(tipconfig.css, color)
          });
        }, self);

      });
    },
    processAttr: function(attrs, color) {
      var newAttrs = S.clone(attrs);
      for (var i in newAttrs) {
        if (newAttrs[i] && typeof newAttrs[i] == "string") {
          newAttrs[i] = newAttrs[i].replace(COLOR_TPL, color);
        }
      }
      return newAttrs;
    },
    onLabelClick: function(e) {
      this.fire('labelclick', {
        el: e.el,
        label: e.label,
        sector: e.sector
      })
    },
    isRunning: function() {
      return this.animateInstance && this.animateInstance.isRunning();
    },
    stop: function() {
      if (this.animateInstance) {
        this.animateInstance.stop();
        delete this.animateInstance;
      }
    },
    getConfig: function(name) {
      return name && this.get(name);
    },
    // 添加和line/bar统一更新数据/配置的机制
    setConfig: function(o) {
      if (o) {
        // 兼容以前的写法
        if (o.series) {
          // this.set("series",o.data);
          this.set("data", o.series);
          delete o.series;
        }
        this.set(o);
      }
    },
    destroy: function() {
      var $sectors = this.get("$sectors"),
        $labels = this.get("$labels"),
        litter = [].concat($sectors, $labels)
      Util.each(litter, function(i) {
        i && i.destroy();
      });
      this.set("$sectors", null);
      this.set("$labels", null);
      this.get("paper").remove();
    }
  }

  var Pie = Base.extend(methods);
  Pie.getSizeOf = Labels.getSizeOf
  return Pie;
});