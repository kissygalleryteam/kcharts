/*
combined files : 

gallery/kcharts/1.2/radar/index

*/
// -*- coding: utf-8; -*-
KISSY.add("gallery/kcharts/1.2/radar/index",function(S,Raphael){
  var pi = Math.PI
    , unit = pi/180

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
    s.push("z");
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


  function Radar(cfg){
    this.set(cfg);
    this.dochk(cfg);
    var container = S.get(cfg.renderTo);
    var paper;
    if(container){
      paper = Raphael(container,cfg.width,cfg.height)
    }else{
      throw Error("容器不能为空");
    }
    this.set("paper",paper);
    this.set("config",cfg);
    this.render(cfg)
  }
  S.extend(Radar,S.Base,{
    dochk:function(cfg){
      var size = cfg.labels.length;
      this.set("sides",size)
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

      var global_draw_options = S.merge(global_draw_defaults, cfg.options);
      return global_draw_options
    },
    getGroupOption:function(option){
      var default_draw_options = {
        points: {'fill':'#333','stroke-width':'0', 'size': 4.5},
        text: {'fill':"#222",'text-anchor':'start'},
        lines: {'stroke-width':'1' }
      };
      return S.merge(default_draw_options,option);
    },
    drawGroup:function(scores,points,opts){
      var config = this.get("config")
        , x,y
        , cx = config.cx
        , cy = config.cy
        , paper = this.get("paper")

      var line,circle,circles = []

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
        circles.push(circle);
      }
    },
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
    drawSample:function(i,title,opts){
      var paper = this.get("paper")
        , config = this.get("config")
        , cx = config.cx
        , cy = config.cy
        , r = config.r
        , y0 = cy + r

      var x1 = cx - 50
        , y1 = y0 + 30 + 20*i;
      var x2 = cx
        , y2 = y1;

      var line = paper.path("M " + x1 + " " + y1 + " L " + x2 + " " + y2).attr(opts['lines']);
      var point = paper.circle(x1,y1,opts['points']['size']).attr(opts['points']);
      var text = paper.text( x2+10, y2, title).attr(opts['text'])
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
        var text = paper.text( x, y, label).attr(S.merge(opts['text'],{'text-anchor': anchor }));
      }
    },
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
        // Draws ruler
        rulers.push([]);
        var r_len = 0.025;
        for (var j = 1; j < 5; j++) {
          x1 = lined_on( cx, points[i].x, j * 0.20 - r_len);
          y1 = lined_on( cy, points[i].y, j * 0.20 - r_len);
          x2 = lined_on( cx, points[i].x, j * 0.20 + r_len);
          y2 = lined_on( cy, points[i].y, j * 0.20 + r_len);
          var cl = paper.path("M " + x1 + " " + y1 + " L " + x2 + " " + y2).attr({"stroke":"#777"});
          cl.rotate(90);
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
      } else {
        for(var j=0; j<labels.length; j++) {
          var value = group[labels[j]] || group[labels[j].toLowerCase().replace(" ","_")];
          scores.push( value / max_score);
        }
      }
      return scores;
    },
    render:function(cfg){
      cfg || (cfg = this.get("config"));
      var paper = this.get("paper")
        , cx = cfg.cx,cy=cfg.cy
        , radius = cfg.r
        , labels = cfg.labels
        , max_score = cfg.max
        , score_groups = cfg.scoreGroups
        , user_draw_options = cfg.options
      var global_draw_options = S.merge(global_draw_defaults, user_draw_options);
      var points = this.getPoints();

      this.drawMeasureAndRuler(points);
      this.drawFrame(points);

      // group and sample
      for (var i=0; i<score_groups.length; i++){
        var draw_options = S.merge(default_draw_options, score_groups[i]['draw_options'] );
        var scores = this.getScoreFromGroup(score_groups[i]);
        var title = score_groups[i].title;
        var opts = this.getGroupOption(score_groups[i]['draw_options'])

        this.drawGroup(scores,points,opts);
        this.drawSample(i,title,opts);
      }

      this.drawLabels(points,global_draw_options)
    }
  });
  return Radar;
},{
  requires:["gallery/kcharts/1.1/raphael/index"]
});
/**
 * refs:
 * https://github.com/jsoma/raphael-radar.git
 * TODO:
 * 配置不要放在config对象中
 * */
