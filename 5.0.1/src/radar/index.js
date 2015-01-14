define(function(require,exports,module){

  var Util = require("util"),
      Base = require("base"),
      D = require("dom"),
      Node = require("node"),
      E = require("event-dom"),
      Raphael = require("kg/kcharts/5.0.1/raphael/index"),
      Legend = require("kg/kcharts/5.0.1/legend/index");

  var pi = Math.PI
    , unit = pi/180

  var each = Util.each,
      map = Util.map,
      filter = Util.filter,
      merge = Util.merge

  // Gets a position on a radar line.
  function lined_on( origin, base, bias){
    return origin + (base - origin) * bias;
  };
  // Gets SVG path string for a group of scores.
  function path_string( center, points, scores){
    var vertex = [];
    for( var i = 0; i < points.length; i++){
      var x = lined_on( center.x, points[i].x, scores[i]);
      var y = lined_on( center.y, points[i].y, scores[i]);
      vertex.push( "" + x + " " + y);
    }
    return "M " + vertex.join("L ") + "z";
  };
  function polygon(points){
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
    s.push("Z");
    return s.join(',');
  }

  var global_draw_defaults = {
    text: { fill: '#222', 'max-chars': 10, 'key': true }
  }
  var default_draw_options = {
    points: {'fill':'#333','stroke-width':'0', 'size': 4.5},
    text: {'fill':"#222",'text-anchor':'start'},
    lines: {'stroke-width':'1' }
  };

  function hideORshow(array_of_el,hide_or_show){
    var method;
    if(hide_or_show){
      method = "show";
    }else{
      method = "hide";
    }
    each(array_of_el,function(el){
      el[method]();
    });
  }

   //==================== tools end ====================

  var anim = {
    easing:"linear",
    duration:800
  };

   var methods = {
	 initializer:function(cfg){
       cfg = this.userConfig;
       var container = Node.all(cfg.renderTo)[0];
       cfg.anim = merge(anim,cfg.anim);

       this.set("container",container);
       this.set(cfg);

       this._animationInstance = 0;


       this.dochk(cfg);
       var paper;
       if(container){
         paper = Raphael(container,cfg.width,cfg.height)
       }else{
         throw Error("容器不能为空");
       }
       this.set("paper",paper);
       this.set("config",cfg);
       this.render(cfg)
     },
     dochk:function(cfg){
      //设置多边形的边
      var size = cfg.labels.length;
      var w = D.width(this.get("container"));
      var h = D.height(this.get("container"));
      this.set("sides",size)
      //如果没有甚至cx,cy，自动设置
      if(cfg.cx == undefined){
        cfg.cx = w/2;
      }
      if(cfg.cy == undefined){
        cfg.cy = h/2;
      }
      //没有设置max，自动寻找
      var groups = this.get("scoreGroups");
      if(groups[0] && groups[0].scores){
        var nums = [] ;
        each(groups,function(item){
          nums = nums.concat(item.scores);
        });
        var max = Math.max.apply(Math,nums);
        cfg.max = max;
      }
      //没有r，自动设定一个
      if(cfg.r == undefined){
        var min = Math.min.apply(Math,[w,h]);
        cfg.r = min/2 - 30;//预留给label的
        if(cfg.r < 0){
          cfg.r = min/2;
        }
      }
    },
    drawPolygon:function(points){
      var paper = this.get("paper")
      var pathstring = polygon(points);
      return paper.path(pathstring);
    },
    //多边形框架
    drawFrame:function(points){
      var path = this.drawPolygon(points).attr({"stroke":"#777"});
      this.set("framepath",path);
    },
    getOption:function(){
      var cfg = this.get("config")
        , global_draw_defaults = {
        text: { fill: '#222', 'max-chars': 10, 'key': true }
        }
        , default_draw_options = cfg.options

      var global_draw_options = merge(global_draw_defaults, cfg.options);
      return global_draw_options
    },
    getGroupOption:function(option){
      var default_draw_options = {
        points: {'fill':'#333','stroke-width':'0', 'size': 4.5},
        text: {'fill':"#222",'text-anchor':'start'},
        lines: {'stroke-width':'1' }
      };
      return merge(default_draw_options,option);
    },
    //绘制多边形对比曲线
    drawGroup:function(scores,points,opts){
      var config = this.get("config")
        , x,y
        , cx = config.cx
        , cy = config.cy
        , paper = this.get("paper")

      var lines = this.get("lines") || []
        , line
        , circle
        , circleset = []
        , circles = this.get("pts") || []

      var pa = []
      for( var i = 0; i < points.length; i++){
        x = lined_on( cx, points[i].x, scores[i]);
        y = lined_on( cy, points[i].y, scores[i]);
        pa.push({x:x,y:y});
      }

      line = this.drawPolygon(pa);
      opts && opts.lines && line.attr(opts.lines);
      for (var j=0; j<scores.length; j++) {
        x = lined_on( cx, points[j].x, scores[j]);
        y = lined_on( cy, points[j].y, scores[j]);

        circle = paper.circle(x,y,opts['points']['size']).attr(opts['points']);
        circleset.push(circle);
      };
      circles.push(circleset);
      lines.push(line);
      if(!this.get("lines")){
        this.set("lines",lines);
        this.set("pts",circles);
      }
    },
    //获取多边形的顶点
    getPoints:function(){
      var sides = this.get("sides")
        , config = this.get("config")
        , start = -90
        , radius = config.r
        , x , y
        , cx = config.cx
        , cy = config.cy

      var points = []
        , u = 360.0 / sides
      for (var i=0; i<sides; i++) {
        var rad = (start / 360.0) * (2 * Math.PI);
        x = cx + radius * Math.cos(rad);
        y = cy + radius * Math.sin(rad);
        points.push({x:x,y:y});
        start += u;
      }
      return points;
    },
    //获取radar的主体
    getBBox:function(){
      var r = this.get("r"),
          w = r*2,
          h = r*2,
          cx = this.get("cx"),
          cy = this.get("cy");

      return {
        width:w,
        height:h,
        left:cx - w/2,
        top:cy - h/2
      }
    },
    // legend
    drawLegend:function(lineprops){
      var con = this.get("container")
        , bbox = this.getBBox()
        , legend = this.get("legend") || {}

      var globalConfig = merge({
        interval:20,//legend之间的间隔
        iconright:5,//icon后面的空白
        showicon:true //默认为true. 是否显示legend前面的小icon——可能用户有自定义的需求
      },legend.globalConfig)

      delete legend.globalConfig;

      var $legend = new Legend(merge({
        container:con,
        paper:this.get("paper"),
        bbox:bbox,
        align:legend.align || "bc",
        offset:legend.offset || [0,20],
        globalConfig:globalConfig,
        config:lineprops
      },legend));

      $legend.on("click",function(e){
        if(this.isRunning()){
          return;
        }
        var i = e.index
          , $text = e.text
          , $icon = e.icon
          , el = e.el
		if (el.hide != 1) {
		  this.hideLine(i);
		  el.hide = 1;
		  el.disable();
		} else {
		  this.showLine(i);
		  el.hide = 0;
		  el.enable();
		}
      },this);

      this.set("legend",$legend);
      // old legend
      // return;
      // var paper = this.get("paper")
      //   , config = this.get("config")
      //   , cx = config.cx
      //   , cy = config.cy
      //   , r = config.r
      //   , y0 = cy + r

      // var x1 = cx - 50
      //   , y1 = y0 + 30 + 20*i;
      // var x2 = cx
      //   , y2 = y1;

      // var line = paper.path("M " + x1 + " " + y1 + " L " + x2 + " " + y2).attr(opts['lines']);
      // var point = paper.circle(x1,y1,opts['points']['size']).attr(opts['points']);
      // var text = paper.text( x2+10, y2, title).attr(opts['text']);
    },
    hideLine:function(i){
      var lines = this.get("lines")
        , pts = this.get("pts");
      lines[i] && hideORshow([lines[i]]);
      pts[i] && hideORshow(pts[i]);
    },
    showLine:function(i){
      var lines = this.get("lines")
        , pts = this.get("pts");
      lines[i] && hideORshow([lines[i]],true);
      pts[i] && hideORshow(pts[i],true);
    },
    drawLabels:function(edge_points,opts){
      var points = edge_points

      var paper = this.get("paper")
        , config = this.get("config")
        , cx = config.cx
        , cy = config.cy
        , r = config.r
        , y0 = cy + r
        , labels = config.labels
      var x,y

      for (var i = 0; i < points.length; i++) {
        x = lined_on( cx, points[i].x, 1.1);
        y = lined_on( cy, points[i].y, 1.1);
        var anchor = "middle";
        if (x>cx) anchor = "start";
        if (x<cx) anchor = "end";

        var label = labels[i];
        if (label.length > opts['text']['max-chars']) label = label.replace(" ", "\n");
        var text = paper.text( x, y, label).attr(merge(opts['text'],{'text-anchor': anchor }));
      }
    },
    //中心发散的刻度尺
    drawMeasureAndRuler:function(points){
      var paper = this.get("paper")
        , config = this.get("config")
        , cx = config.cx
        , cy = config.cy
        , x,y
        , x1,y1
        , x2,y2
      // Draws measures of the chart
      var measures=[], rulers=[];
      for (var i = 0; i < points.length; i++) {
        x = points[i].x, y = points[i].y;
        measures.push( paper.path("M " + cx + " " + cy + " L " + x + " " + y).attr("stroke", "#777") );
        var r_len = 0.025;
        for (var j = 1; j < 5; j++) {
          x1 = lined_on( cx, points[i].x, j * 0.20 - r_len);
          y1 = lined_on( cy, points[i].y, j * 0.20 - r_len);
          x2 = lined_on( cx, points[i].x, j * 0.20 + r_len);
          y2 = lined_on( cy, points[i].y, j * 0.20 + r_len);
          var cl = paper.path("M " + x1 + " " + y1 + " L " + x2 + " " + y2).attr({"stroke":"#777"});
          cl.rotate(90);
          rulers.push(cl);
        }
      }
    },
    getScoreFromGroup:function(group){
      var scores = []
        , config = this.get("config")
        , max_score = config.max
        , labels = config.labels
      if(group.scores) {
        for (var j=0; j<group.scores.length; j++)
          scores.push(group.scores[j] / max_score);
      }
      //  移除对下面这种配置方式的支持
      /*
	  scoreGroups:[
        { title: "Real Madrid C.F.",
          offense: 8,
          defense: 9,
          technique: 7,
          strategy: 9,
          physicality: 7,
          mentality: 6,
          draw_options: {
            lines: {'stroke-width':'2', 'stroke':'#39b549','stroke-dasharray':'- '},
            points: {'fill':'#39b549','stroke-width':'0',size:5}
          }
        }]
       */
      else {
        for(var j=0; j<labels.length; j++) {
          var value = group[labels[j]] || group[labels[j].toLowerCase().replace(" ","_")];
          scores.push( value / max_score);
        }
      }
      return scores;
    },
    isRunning:function(){
      return this._animationInstance > 0;
    },
    render:function(cfg){
      cfg || (cfg = this.get("config"));
      var paper = this.get("paper")
        , cx = this.get("cx")
        , cy= this.get("cy")
        , radius = this.get("r")
        , labels = this.get("labels")
        , max_score = this.get("max")
        , score_groups = this.get("scoreGroups")
        , user_draw_options = this.get("options")
        , anim = this.get("anim")
        , that = this

      var global_draw_options = merge(global_draw_defaults, user_draw_options);
      var points = this.getPoints();

      this.drawMeasureAndRuler(points);
      this.drawFrame(points);

      //绘制过了
      if(this.get("lines")){
        var pathstring = "";
        var pss = [];
        var x,y;
        var newPtss = [];
        for (var i=0; i<score_groups.length; i++){
          var scores = this.getScoreFromGroup(score_groups[i]);
          var newPts = [];
          for(var j=0;j<scores.length;j++){
            x = lined_on( cx, points[j].x, scores[j]);
            y = lined_on( cy, points[j].y, scores[j]);
            newPts.push({x:x,y:y});
          }
          newPtss.push(newPts);
          var ps = polygon(newPts);
          pss.push(ps);
        }
        var $lines = this.get("lines");
        var pts = this.get("pts");
        each(pss,function(ps,key){
          var pt = pts[key];
          var newPt = newPtss[key];
          each(pt,function(p){
            p.hide();
          });
          that._animationInstance+=1;
          $lines[key].animate({path:pss[key]},anim.duration,anim.easing,function(){
            each(pt,function(p,i){
              p.attr({cx:newPt[i].x,cy:newPt[i].y});
              p.show();
            });
            that._animationInstance-=1;
          });
        });
      }else{
        var legendprops = [];
        // group and legend
        for (var i=0; i<score_groups.length; i++){
          var scores = this.getScoreFromGroup(score_groups[i]);
          var title = score_groups[i].title;

          var draw_options = merge(default_draw_options, score_groups[i]['draw_options'] );
          var opts = this.getGroupOption(score_groups[i]['draw_options'])

          this.drawGroup(scores,points,opts);
          legendprops.push({text:title,DEFAULT:opts['lines']["stroke"]});
        }

        this.drawLabels(points,global_draw_options);
        this.drawLegend(legendprops);
      }
    }
  }

  return Base.extend(methods);
});
/**
 * refs:
 * https://github.com/jsoma/raphael-radar.git
 * TODO:
 * 配置不要放在config对象中
 * */