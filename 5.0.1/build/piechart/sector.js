define('kg/kcharts/5.0.1/piechart/sector',["base","util"],function(require, exports, module) {

  var Base = require('base');
  var Util = require('util');
  
  function sector(cx, cy, r, startAngle, endAngle) {
    
    if(Math.abs(startAngle-endAngle)>=360){
      endAngle += .01;
    }
    if(startAngle == endAngle){
      endAngle = endAngle-.1;
    }
    
    var rad = Math.PI / 180,
        angel= (startAngle + endAngle)/ 2,
        middlex = cx + r * Math.cos(-angel * rad),
        scx = cx + r * Math.cos(-angel * rad)*.5,
        x1 = cx + r * Math.cos(-startAngle * rad),
        x2 = cx + r * Math.cos(-endAngle * rad),
        middley = cy + r * Math.sin(-angel * rad),
        scy = cy + r * Math.sin(-angel * rad)*.5,
        y1 = cy + r * Math.sin(-startAngle * rad),
        y2 = cy + r * Math.sin(-endAngle * rad),
        ret,
        largeArcFlag = +(Math.abs(startAngle - endAngle) > 180),
        sweepFlag = 1
    ret = [
      "M", cx, cy,
      "L", x1, y1,
      
      
      "A", r, r, 0, largeArcFlag, sweepFlag, x2, y2,
      "z"
    ]
    
    ret.middleangle = angel;
    ret.middlex = middlex; 
    ret.middley = middley; 
    ret.cx = scx;          
    ret.cy = scy;          
    ret.A = [x1,y1];       
    ret.B = [x2,y2];       
    return ret;
  }
  function donut(cx, cy, r1, r2, startAngle, endAngle){
    
    if(Math.abs(startAngle-endAngle)>=360){
      endAngle += .01;
    }
    
    if(startAngle == endAngle){
      endAngle = endAngle-.1;
    }
    var rad = Math.PI / 180,
        angel= (startAngle + endAngle)/ 2,
        middlex = cx + r2 * Math.cos(-angel * rad),
        scx = cx + (r1 + .5*(r2-r1)) * Math.cos(-angel * rad),
        x = cx + r1 * Math.cos(-angel * rad),
        x1 = cx + r1 * Math.cos(-startAngle * rad),
        x2 = cx + r1 * Math.cos(-endAngle * rad),
        _x1 = cx + r2 * Math.cos(-startAngle * rad),
        _x2 = cx + r2 * Math.cos(-endAngle * rad),

        middley = cy + r2 * Math.sin(-angel * rad),
        scy = cy + (r1 + .5*(r2-r1)) * Math.sin(-angel * rad),
        y = cy + r1 * Math.sin(-angel * rad),
        y1 = cy + r1 * Math.sin(-startAngle * rad),
        y2 = cy + r1 * Math.sin(-endAngle * rad),
        _y1 = cy + r2 * Math.sin(-startAngle * rad),
        _y2 = cy + r2 * Math.sin(-endAngle * rad),

        ret = [
          "M", _x1, _y1,
          "L", x1, y1,
          "A", r1, r1, 0, +(Math.abs(endAngle - startAngle) > 180), 1, x2, y2,
          "L", _x2,_y2,
          "A",r2,r2, 0, +(Math.abs(endAngle - startAngle) > 180), 0, _x1, _y1
        ];

    ret.middleangle = angel;
    ret.middlex = middlex;
    ret.middley = middley;

    ret.cx = scx;
    ret.cy = scy;
    ret.A = [x1,y1];
    ret.B = [_x1,_y1]
    ret.C = [x2,y2]
    ret.D = [_x2,_y2]
    return ret;
  }

   var methods = {
     initializer:function(){
       this.draw();
       this.bindEvent();
       return this;
     },
    bindEvent:function(){
      this.on('afterCxChange',function(){
        this.draw();
      })
      this.on('afterCyChange',function(){
        this.draw();
      })
      this.on('afterStartChange',function(){
        this.draw();
      })
      this.on('afterEndChange',function(){
        this.draw();
      })
      this.on('afterRChange',function(){
        this.draw();
      })
      var $path = this.get('$path')
        , that = this

      $path.click(function(e){
        that.fire('click');
      })
      $path.mouseout(function(){
        that.fire('mouseout')
      });
      $path.mouseover(function(){
        that.fire('mouseover')
      });
    },
    unbindEvent:function(){
      this.detach();
      var $path = this.get('$path')
      $path.unclick();
      $path.unmouseover();
      $path.unmouseout();
    },
    _syncAttrFromPath:function(path){
      this.set({
        middleangle:path.middleangle,
        sectorcx:path.cx,
        sectorcy:path.cy,
        middlex:path.middlex,
        middley:path.middley,
        centerpoint:path.cc,
        A:path.A,B:path.B
      });
    },
    draw:function(){
      var r = this.get('r')
        , paper = this.get('paper')
        , pathcfg = this.get('pathcfg')
        , framedata = this.get('framedata')
        , sectorcfg = (framedata && framedata.sectorcfg) || {}
        , $path = paper.path();

      pathcfg = Util.merge({
        stroke:"#fff"
      },pathcfg)
      if(sectorcfg){
        pathcfg = Util.merge(pathcfg,{
          stroke:sectorcfg.stroke,
          "stroke-width":sectorcfg.strokeWidth
        })
      }
      $path.attr(pathcfg);
      this.set('$path',$path)

      if(Util.isArray(r) && r.length == 2){
        this._drawDonut();
      }else{
        this._drawSector();
      }
    },
    _drawSector:function(){
      var cx = this.get('cx') , cy = this.get('cy')
        , r = this.get('r')
        , start = this.get('start')
        , end = this.get('end')
        , $path
      var path = sector(cx,cy,r,start,end)
        , pathstring = path.join(',')
        , paper = this.get('paper')

      $path = this.get('$path')
      $path.attr("path",pathstring);
      this._syncAttrFromPath(path);
      this.draw = this._drawSector;
      return this;
    },
    _drawDonut:function(){
      var cx = this.get('cx') , cy = this.get('cy')
        , r = this.get('r')
        , start = this.get('start')
        , end = this.get('end')
        , $path

      r = r.sort(function(a,b){return a<b ? -1: a==b? 0 : 1;});

      var path = donut(cx,cy,r[0],r[1],start,end)
        , pathstring = path.join(',')
        , paper = this.get('paper')

      $path = this.get('$path')
      $path.attr("path",pathstring);
      this._syncAttrFromPath(path);
      this.draw = this._drawDonut;
      return this;
    },
    destroy:function(){
      this.unbindEvent();
      this.get('$path').remove();
    }
  };

  return Base.extend(methods);
});