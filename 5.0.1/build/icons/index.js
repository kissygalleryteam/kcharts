define('kg/kcharts/5.0.1/icons/index',["util","node","base","dom","event-dom"],function(require, exports, module) {

  var Util = require("util"),
    Node = require("node"),
    Base = require("base"),
    D = require("dom"),
    E = require("event-dom");

  var merge = Util.merge
    , isArray = Util.isArray

  var BASIC_SIZE = [10,6];
  var M = "M",L="L",Z = "Z";

  var _Utils = {
    trianglePath:function(cx,cy,I){
      var m = Math.sqrt(3)/3*I;
      var n = 1/6*I;

      var A = [cx,cy-2/3*I+n],
          B = [cx-m,cy+1/3*I+n],
          C = [cx+m,cy+1/3*I+n]
      var a = [M,A[0],A[1],L,B[0],B[1],L,C[0],C[1],Z];
      return a;
    },
    lineThrouth:function(cx,cy,I,opt){
      var paper = opt.paper,
          xscale = opt.size[0];
      return paper.path([M,cx-1.1*xscale*I,cy,cx+1.1*xscale*I,cy].join(","));
    }
  }

  var _Icons = {
    rect:function(cx,cy,opt){
      var width = opt.width || BASIC_SIZE[0],
          height = opt.height || BASIC_SIZE[1],
          x = cx - width/2,
          y = cy - height/2
      var ret = opt.paper.rect(x,y,width,height).attr(merge({},opt.attrs))
      return ret;
    },
    square:function(cx,cy,opt){
      return this.rect(cx,cy,merge({
        width:BASIC_SIZE[1]
      },opt));
    },
    linesquare:function(cx,cy,opt){
      var s = this.square(cx,cy,opt)
      var I = BASIC_SIZE[1];
      var set = opt.paper.set()
      set.push(s);
      var $line = _Utils.lineThrouth(cx,cy,I,opt);
      set.push($line);
      return set;
    },
    diamond:function(cx,cy,opt){
      var d = this.square(cx,cy,opt).attr("transform","r45");
      return d;
    },
    linediamond:function(cx,cy,opt){
      var d = this.square(cx,cy,opt).attr("transform","r45");
      var I = BASIC_SIZE[1];
      var set = opt.paper.set();
      set.push(d);
      var $line = _Utils.lineThrouth(cx,cy,I,opt);
      set.push($line);
      return set;
    },
    circle:function(cx,cy,opt){
      var ret;
      ret = opt.paper.circle(cx,cy,BASIC_SIZE[1]/2);
      return ret;
    },
    linecircle:function(cx,cy,opt){
      var c = this.circle(cx,cy,opt)
      var I = BASIC_SIZE[1];
      var set = opt.paper.set()
      set.push(c)
      var $line = _Utils.lineThrouth(cx,cy,I,opt);
      set.push($line);
      return set;
    },
    triangle:function(cx,cy,opt){
      var I = BASIC_SIZE[1];
      var a = _Utils.trianglePath(cx,cy,I);
      return opt.paper.path(a.join(","));
    },
    linetriangle:function(cx,cy,opt){
      var I = BASIC_SIZE[1];
      var a = _Utils.trianglePath(cx,cy,I);
      var set = opt.paper.set();
      set.push(opt.paper.path(a.join(",")));
      var $line = _Utils.lineThrouth(cx,cy,I,opt);
      set.push($line);
      return set;
    }
  },
          Icons = {};
  for(var x in _Icons){
    (function(x){
      var shape = _Icons[x];
      Icons[x] = function(cx,cy,opt){
        var ret = shape.call(_Icons,cx,cy,opt);
        if(opt.size){
          if(!isArray(opt.size)){
            opt.size = [opt.size,opt.size];
          }
          ret.scale(opt.size[0],opt.size[1]);
        }
        var _item,
            _$line,
            attrs = opt.attrs || {}
        if(ret.clear){
          _item = ret[0]
          _$line = ret[1];
          _$line.attr({"stroke":attrs.fill || "#000","stroke-width":2*opt.size[1]});
        }else{
          _item = ret;
        }
        _item.attr(Util.merge({"stroke-width":0},opt.attrs));
        return ret;
      }
    })(x);
  };
  Icons.BASIC = BASIC_SIZE;
  return Icons;
});