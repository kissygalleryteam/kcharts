define('kg/kcharts/5.0.1/piechart/label',["util","base","node","dom"],function(require, exports, module) {

  var Util = require("util"),
    Base = require("base"),
    Node = require("node"),
    D = require("dom");
  
  function distance(a, b) {
    var x1, x2, y1, y2;
    x1 = a[0], y1 = a[1], x2 = b[0], y2 = b[1];
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
  }

  function closest(list, i, least_n) {
    function rec(l, min, min_el, min_el_left) {
      if (least_n >= l.length) {
        return {
          min: min_el,
          left: min_el_left
        };
      } else if (min > distance(i, l[0])) {
        var left = l.slice(1);
        return rec(left, distance(i, l[0]), l[0], left);
      } else {
        return rec(l.slice(1), min, min_el, min_el_left);
      }
    }
    return rec(list, Infinity, list[0], [])
  }

  function find(l1, l2) {
      function iter(l, s, acm) {
        if (l.length == 0) {
          return acm;
        } else {
          var ret = closest(s, l[0], l.length - 1);
          acm.push(ret.min);
          return iter(l.slice(1), ret.left, acm);
        }
      }
      return iter(l1, l2, []);
    }
    

  var $detector

  function blockSizeOf(html) {
    $detector || ($detector = Node("<span/>").css({
      "visibility": "hidden",
      "position": "fixed",
      "left": '-9999em',
      "top": 0
    }).appendTo(document.body));
    $detector.html(html);
    return {
      width: D.width($detector),
      height: D.height($detector)
    }
  }

  var Label;
  var props = {
    initializer: function() {
      var $label = this.get('label'),
        x = this.get('x'),
        y = this.get('y'),
        size = this.get('size'),
        pie = this.get('pie'),
        sector = this.get("sector"),
        container = pie.get('container')
      $label.css({
        "position": "absolute",
        "left": x + 'px',
        "top": y + 'px',
        width: size.width + 'px',
        "height": size.height + 'px'
      }).appendTo(container);
      this.set('el', $label)
    },
    destroy: function() {
      var el = this.get("el");
      var path = this.get("$path");

      
      el.detach("click");

      el.remove();
      path.remove();
    }
  };

  if (Base.extend) { 
    Label = Base.extend(props)
  } else { 
    Label = function(cfg) {
      this.set(cfg);
      this.userConfig = cfg;
      this.initializer();
    }
    Util.extend(Label, Base, props);
  }

  
  var Labels;
  var props2 = {
    initializer: function() {
      var pie = this.get("pie");
      var $sectors = this.get("$sectors");
      var bool_left = this.get("isleft");

      var paper = pie.get('paper'),
        container = pie.get('container'),
        count = $sectors.length,
        paperHeight 
        , pieHeight 
        , unitHeight 
        , minLalebelHeight 
        , fromY 
        , toY 
        , xys = [],
        xysr = [],
        xysr2 = [],
        cx = pie.get('cx'),
        cy = pie.get('cy'),
        rs = pie.get('rs'),
        paddingDonutSize1 = pie.get("padding") || 20 
        ,
        paddingDonutSize2 = paddingDonutSize1 + 10,
        R, R1, R2, cos = Math.cos,
        sin = Math.sin,
        asin = Math.asin,
        pi = Math.PI,
        rad = Math.PI / 180,
        $firstSector

      this.labels = []
      $firstSector = $sectors[0]

      if (!$firstSector) return;

      
      
      unitHeight = blockSizeOf($firstSector.get("label")).height
        
      if (!unitHeight)
        return;
      R = Math.max.apply(Math, rs)
        
      var extraHeight = pie.get("extraLabelHeight") || 0;
      R1 = R + paddingDonutSize1;
      R2 = R + paddingDonutSize2;


      fromY = cy - R2 - extraHeight;
      toY = cy + R2 + extraHeight;
      for (fromY += unitHeight; fromY < toY - unitHeight; fromY += unitHeight) {
        
        
        var y = fromY;
        var rate = (y - cy) / R2;
        if (rate < -1) {
          rate = -1;
        } else if (rate > 1) {
          rate = 1;
        }
        var t = Math.asin(rate);
        var x = cx + R2 * Math.cos(t);
        x = bool_left ? (2 * cx - x) : x;
        xys.push([x, y]);
        
        
      }
      

      if ($sectors.length > xys.length) {
        $sectors = $sectors.sort(function(a, b) {
          var d1 = Math.abs(a.get("start") - a.get("end")),
            d2 = Math.abs(b.get("start") - b.get("end"))
          return d1 > d2 ? -1 : (d1 < d2) ? 1 : 0;
        });
        $sectors = $sectors.slice(0, xys.length);
      }

      $sectors = $sectors.sort(function(a, b) {
        var ay = a.get("middley"),
          by = b.get("middley")
          
          
        return ay < by ? 1 : ay > by ? -1 : 0;
      });

      var unitdeg = Math.PI / 180;
      Util.each($sectors, function($sector) {
        var x = $sector.get("middlex"),
          y = $sector.get("middley"),
          theta = $sector.get("middleangle") * rad
          
        var x12, y12;
        x12 = cx + R1 * Math.cos(-theta);
        y12 = cy + R1 * Math.sin(-theta);
        xysr2.push([x12, y12]);

        xysr.push([x, y]);
        
      });

      xysr = xysr.reverse();
      xysr2 = xysr2.reverse();

      $sectors = $sectors.reverse();

      var bestxys = find(xysr, xys);
      for (var i = 0, l = bestxys.length; i < l; i++) {
        var pxy = xysr[i];
        var pxy2 = bestxys[i];
        var x1, x2, y1, y2;
        x1 = pxy[0];
        y1 = pxy[1];
        x2 = pxy2[0];
        y2 = pxy2[1];

        var x12, y12;
        x12 = xysr2[i][0], y12 = xysr2[i][1];

        var x23, y23 = y2;
        x23 = bool_left ? x2 - 10 : x2 + 10;
        var path = paper.path(["M", x1, y1, "Q", x12, y12, x23, y23].join(","));

        var $sector = $sectors[i],
          sizefn = pie.get("sizefn"),
          label = $sector.get('label'),
          labelfn = pie.get('labelfn'),
          size, x3, y3, that = this,
          pathcolor = $sector.get("$path").attr("fill"),
          autoLabelPathColor = pie.get('autoLabelPathColor')

        if (labelfn && Util.isFunction(labelfn)) {
          label = labelfn(label, $sector, pie);
        }
        size = blockSizeOf(label)
        path && path.toBack && path.toBack();
        (autoLabelPathColor != "undefined") && path.attr("stroke", pathcolor)

        if (sizefn && Util.isFunction(sizefn)) {
          size = sizefn(size, $sector, pie);
        }

        if (bool_left) {
          x3 = x23 - size.width - 3; 
          y3 = y23 - size.height / 2;
        } else {
          x3 = x23 + 5; 
          y3 = y23 - size.height / 2;
        }

        var $label = Node("<span class='kcharts-label'>" + label + "</span>")

        var labelInstance = new Label({
          label: $label,
          sector: $sector,
          $path: path,
          x: x3,
          y: y3,
          size: size,
          pie: pie
        });
        var $el = labelInstance.get('el');

        var fn = function($el, $sector, labelInstance) {
          
          $sector.$label = $el;

          $el.on('click', function(e) {
            that.fire('click', {
              el: e.currentTarget,
              label: labelInstance,
              sector: $sector
            })
          });
        }
        fn($el, $sector, labelInstance);

        that.labels.push(labelInstance);
      }
    },
    destroy: function() {
      Util.each(this.labels, function(label) {
        label.destroy();
      });
    }
  };

  Labels = Base.extend(props2);
  Labels.getSizeOf = blockSizeOf
  return Labels;
});