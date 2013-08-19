// -*- coding: utf-8; -*-
KISSY.add("gallery/kcharts/1.2/piechart/label",function(S){
  var D = S.DOM

  // helpers
  function distance(a,b){
    var x1,x2,y1,y2;
    x1 = a[0],y1=a[1],x2=b[0],y2=b[1];
    return Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
  }

  function closest(list,i,least_n){
    function rec(l,min,min_el,min_el_left){
      if(least_n >= l.length){
        return {min:min_el,left:min_el_left};
      }else if(min > distance(i,l[0])){
        var left = l.slice(1);
        return rec(left,distance(i,l[0]),l[0],left);
      }else{
        return rec(l.slice(1),min,min_el,min_el_left);
      }
    }
    return rec(list,Infinity,list[0],[])
  }
  function find(l1,l2){
    function iter(l,s,acm){
      if(l.length == 0){
        return acm;
      }else{
        var ret = closest(s,l[0],l.length-1);
        acm.push(ret.min);
        return iter(l.slice(1),ret.left,acm);
      }
    }
    return iter(l1,l2,[]);
  }
  // end

  var $detector
  function blockSizeOf(html){
    $detector || ($detector = S.Node("<span/>").css({"visibility":"hidden","position":"fixed","left":'-9999em',"top":0}).appendTo(document.body));
    $detector.html(html);
    return {
      width:D.width($detector),
      height:D.height($detector)
    }
  }

  function Label(cfg){
    this.set(cfg)
    this.init();
  }
  S.extend(Label,S.Base,{
    init:function(){
      var $label = this.get('label')
        , x = this.get('x')
        , y = this.get('y')
        , size = this.get('size')
        , pie = this.get('pie')
        , sector = this.get("sector")
        , container = pie.get('container')

      $label.css({"position":"absolute","left":x+'px',"top":y+'px',width:size.width+'px',"height":size.height+'px'}).appendTo(container);
      this.set('el',$label)
    },
    destroy:function(){
      this.get("el").remove();
      this.get("$path").remove();
    }
  })
  /**
   * 分布策略：
   * 自然分布
   * 若空间不足，拓展空间
   * */

  function Labels(pie,$sectors,bool_left){
    var paper = pie.get('paper')
      , container = pie.get('container')
      , count = $sectors.length
      , paperHeight //画布高度
      , pieHeight //饼图高度
      , unitHeight //单条label的高度
      , minLalebelHeight //排布label需要的最小高度
      , fromY // 画label的上边界
      , toY // 下边界
      , xys = []
      , xysr = []
      , xysr2 = []
      , cx = pie.get('cx')
      , cy = pie.get('cy')
      , rs = pie.get('rs')
      , paddingDonutSize1 = pie.get("padding") || 20 // label 和 pie 之间的距离
      , paddingDonutSize2 = paddingDonutSize1+10
      , R
      , R1
      , R2
      , cos = Math.cos
      , sin = Math.sin
      , asin = Math.asin
      , pi = Math.PI
      , rad = Math.PI/180
      , $firstSector

    this.labels = []
    $firstSector = $sectors[0]

    if(!$firstSector)return;

    unitHeight = blockSizeOf($firstSector.get("label")).height
    R = Math.max.apply(Math,rs)
    R1 = R + paddingDonutSize1
    R2 = R + paddingDonutSize2

    fromY = cy - R2;
    toY = cy + R2;
    for(fromY+=unitHeight;fromY<toY-unitHeight;fromY+=unitHeight){
      // x=a+rcosθ y=b+rsinθ
      // (y-b)/r = sinθ
      var y = fromY;
      var t = Math.asin((y-cy)/R2);
      var x = cx+R2*Math.cos(t);
      x = bool_left ? (2*cx - x):x;
      xys.push([x,y]);

      // paper.circle(x,y,4);
      // paper.circle(2*cx - x,y,4);
    }
    // 若不足以放下所有的label，剔除比例较小的

    if($sectors.length>xys.length){
      $sectors = $sectors.sort(function(a,b){
                   var d1 = Math.abs(a.get("start") - a.get("end"))
                     , d2 = Math.abs(b.get("start") - b.get("end"))
                   return d1>d2 ? -1 : (d1<d2) ? 1 : 0;
                 });
      $sectors = $sectors.slice(0,xys.length);
    }

    $sectors = $sectors.sort(function(a,b){
                 var ay = a.get("middley")
                   , by = b.get("middley")
                 // return [a.a, a.b] > [b.a, b.b] ? 1:-1;
                 // return  [ay,ay] < [by,by];
                 return ay<by ? 1 : ay>by ? -1 : 0;
               });

    var unitdeg = Math.PI/180;
    S.each($sectors,function($sector){
      var x = y = $sector.get("middlex")
        , y = $sector.get("middley")
        , theta = $sector.get("middleangle")*rad
      // paper.circle(x12,y12,3);

      var x12,y12;
      x12 = cx+R1*Math.cos(-theta);
      y12 = cy+R1*Math.sin(-theta);
      xysr2.push([x12,y12]);

      xysr.push([x,y]);
      // paper.circle(x,y,2);
    });

    xysr = xysr.reverse();
    xysr2 = xysr2.reverse();

    $sectors = $sectors.reverse();

    var bestxys = find(xysr,xys);

    for(var i=0,l=bestxys.length;i<l;i++){
      var pxy = xysr[i];
      var pxy2 = bestxys[i];
      var x1,x2,y1,y2;
      x1 = pxy[0];
      y1 = pxy[1];
      x2 = pxy2[0];
      y2 = pxy2[1];

      var x12,y12;
      x12 = xysr2[i][0],y12 = xysr2[i][1];

      var x23,y23 = y2;
      x23 = bool_left ? x2 - 10 : x2 + 10;
      var path = paper.path(["M",x1,y1,"Q",x12,y12,x23,y23].join(","));

      var $sector = $sectors[i]
        , sizefn = pie.get("sizefn")
        , label = $sector.get('label')
        , labelfn = pie.get('labelfn')
        , size
        , x3 ,y3
        , that = this
        , pathcolor = $sector.get("$path").attr("fill")
        , autoLabelPathColor = pie.get('autoLabelPathColor')

      if(labelfn && S.isFunction(labelfn)){
        label = labelfn(label,$sector,pie);
      }
      size = blockSizeOf(label)

      path && path.toBack && path.toBack();
      (autoLabelPathColor != "undefined") && path.attr("stroke",pathcolor)

      if(sizefn && S.isFunction(sizefn)){
        size = sizefn(size,$sector,pie);
      }

      if(bool_left){
        x3 = x23 - size.width
        y3 = y23 - size.height/2
      }else{
        x3 = x23;
        y3 = y23 - size.height/2;
      }

      var $label = S.Node("<span class='kcharts-label'>"+label+"</span>")

      var labelInstance  = new Label({label:$label,sector:$sector,$path:path,x:x3,y:y3,size:size,pie:pie});
      var $el = labelInstance.get('el');

      var fn = function($el,$sector,labelInstance){
        $el.on('click',function(e){
          that.fire('click',{
            el:e.currentTarget,
            label:labelInstance,
            sector:$sector
          })
        });
      }
      fn($el,$sector,labelInstance);

      that.labels.push(labelInstance);
    }
  }
  S.extend(Labels,S.Base,{
    destroy:function(){
      S.each(this.labels,function(label){
        label.destroy();
      });
    }
  })
  Labels.getSizeOf = blockSizeOf
  return Labels;
})