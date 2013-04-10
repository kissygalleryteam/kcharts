// -*- coding: utf-8-unix; -*-
KISSY.add('gallery/kcharts/1.0/piechart/index',function(S,Paper,Ft,Label,Tip,Color){
  var D = S.DOM
	  , ColorMap;

  function helperRand(a,b){
    return Math.floor(Math.random()*(b-a+1)+a);
  }
  function pad(s){
    return s.length===1?'0'+s:s;
  }
  function randColor(){
    var r,g,b;
    r = pad((helperRand(0,255)).toString(16));
    g = pad((helperRand(0,255)).toString(16));
    b = pad((helperRand(0,255)).toString(16));
    return '#'+r+g+b;
  }
  function fixNumber(n,m){
    m = typeof m == undefined ? m : 2;
    return n.toFixed(m);
  }
  function normalizeNum(n,forward){
    return parseFloat(n.toFixed(4));
  }

  //see http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color
  function shadeColor(color, porcent) {
    var R = parseInt(color.substring(1,3),16)
    var G = parseInt(color.substring(3,5),16)
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + porcent) / 100);
    G = parseInt(G * (100 + porcent) / 100);
    B = parseInt(B * (100 + porcent) / 100);

    R = (R<255)?R:255;
    G = (G<255)?G:255;
    B = (B<255)?B:255;

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
  }
  var dftCfg = {
      labelPadding:20
  };
  /*
   * cfg = {cx:cx,cy:cy,r:r,values,opts}
   * */
  function PieChart(cfg){
     ColorMap = new Color({themeCls:cfg.themeCls})._colors;
    this.colorseed = 0;
    this.container = S.get(cfg.renderTo);
    this.paper = Paper(S.get(this.container));
    this.labelLayer = this.paper;
    this.textlabel = new Label();
    this.cfg = S.mix(dftCfg,cfg);
    this.sectors = null;
    this.percentData = null;
    this.drawSector();
    this.renderTip();
  }
  var methods = {
    bindEvent:function(){
      var sectors = this.sectors
        , that = this
        , cfg = this.cfg
        , data = cfg.data
        , cx = cfg.cx
        , cy = cfg.cy
        , events = cfg.events || {}
        , inpiechart = false
        , tiptimer = null

      if(events.enterleave){

      }else if(events.click){

      }
      for(var i=0;i<sectors.length;i++){
        (function(i){
          sectors[i].mouseover(function(e){
            inpiechart = true
            tiptimer && clearTimeout(tiptimer)
            that.fire('mouseenter',{target:sectors[i],data:data[i],index:i});
          })
          .mouseout(function(e){
            inpiechart = false
            that.fire('mouseleave',{target:sectors[i],data:data[i],index:i});
            tiptimer = setTimeout(function(){
                         if(!inpiechart){
                           that.tip && that.tip.hide()
                         }
                       },500)
          })
          .click(function(e){
            that.fire('click',{target:sectors[i],data:data[i],index:i});
          });
        })(i);
      }
    },
    onend:function(){
      var cfg = this.cfg
        , that = this
      if(cfg.labelIndside){
        this.drawInsideLabel();
      }else{
        if(cfg.label != false){
          this.drawLabel();
        }
      }
      this.bindEvent();
      setTimeout(function(){
        that.fire('afterRender')
      },0)
    },
    sectorFull:function (cx, cy, r, startAngle, endAngle, fill) {
      var rad = Math.PI / 180,
          angel= (startAngle + endAngle)/ 2,
          x = cx + r * Math.cos(-angel * rad),
          x1 = cx + r * Math.cos(-startAngle * rad),
          x2 = cx + r * Math.cos(-endAngle * rad),
          y = cy + r * Math.sin(-angel * rad),
          y1 = cy + r * Math.sin(-startAngle * rad),
          y2 = cy + r * Math.sin(-endAngle * rad),
          res = [
            "M", fixNumber(cx), cy,
            "L", fixNumber(x1), fixNumber(y1),
            "A", r, r, 0, +(Math.abs(endAngle - startAngle) > 180), 1, fixNumber(x2), fixNumber(y2),
            "z"
          ];

      /*
      this.paper.circle(x1,y1,3);
      var x3 = cx + r*Math.cos(-angel*rad)
        ,y3 = cy + r*Math.sin(-angel*rad)
      this.paper.circle(x3,y3,2).attr('fill','blue');
      */
      var from
        , to;
      if(startAngle>endAngle){
        from = startAngle;
        to = endAngle;
      }else{
        from = endAngle;
        to = startAngle;
      }
      res.middle = {from:from,to:to,angel:angel,x:x,y:y};//天使
      return res;
    },
    sector:function (cx, cy, r,_r/* 内部空心 */, startAngle, endAngle, fill) {
      var rad = Math.PI / 180,
          angel= (startAngle + endAngle)/ 2,
          x = cx + r * Math.cos(-angel * rad),
          x1 = cx + r * Math.cos(-startAngle * rad),
          x2 = cx + r * Math.cos(-endAngle * rad),
          _x1 = cx + _r * Math.cos(-startAngle * rad),
          _x2 = cx + _r * Math.cos(-endAngle * rad),

          y = cy + r * Math.sin(-angel * rad),
          y1 = cy + r * Math.sin(-startAngle * rad),
          y2 = cy + r * Math.sin(-endAngle * rad),
          _y1 = cy + _r * Math.sin(-startAngle * rad),
          _y2 = cy + _r * Math.sin(-endAngle * rad),

          res = [
            "M", fixNumber(_x1), fixNumber(_y1),
            "L", fixNumber(x1), fixNumber(y1),
            "A", r, r, 0, +(Math.abs(endAngle - startAngle) > 180), 1, fixNumber(x2), fixNumber(y2),
            "L", fixNumber(_x2),fixNumber(_y2),
            "A",_r,_r, 0, +(Math.abs(endAngle - startAngle) > 180), 0, fixNumber(_x1), fixNumber(_y1)
          ];
      var from
        , to;
      if(startAngle>endAngle){
        from = startAngle;
        to = endAngle;
      }else{
        from = endAngle;
        to = startAngle;
      }
      res.middle = {from:from,to:to,angel:angel,x:x,y:y};//
      return res;
    },
    drawSector:function(){
      var paper = this.paper
        , that = this
        , cfg = this.cfg
        , data = cfg.data
        , sum = 0
        , percentData = []//转化后的百分比
        , fromAngel//开始的角度
        , toAngel
        , rad
        , cx = cfg.cx
        , cy = cfg.cy
        , r = cfg.R
        , path
        , pathString
        , colors = cfg.colors

      this.percentData = percentData;

      for(var i=0;i<data.length;i++){
        var iii = S.isNumber(data[i].data) ? data[i].data : parseFloat(data[i].data)
        sum+=iii
      }
      for(var i=0;i<data.length;i++){
        percentData.push(data[i].data/sum);
      }
      var sectors = that.sectors = []
        , len = percentData.length
        , emptyRadius = cfg.r

      //扇形展开动画
      function _draw1(e){
        var s = e.s,t = e.t;
        var _r = cfg.animater ? s*r:r
          , _from
          , _to

        for(var j=0;j<len;j++){
          if(j){
            _from = _to;
            _to = _from - s*percentData[j]*360;
          }else{
            fromAngel = 90 + percentData[0]/2 * 360;
            toAngel = 90 - percentData[0]/2 * 360;
            _from = fromAngel+s*(90-fromAngel);
            _to = _from+s*(toAngel-fromAngel);
          }

          if(emptyRadius){
            path = that.sector(cx,cy,_r,emptyRadius,_from,_to);
          }else{
            path = that.sectorFull(cx,cy,_r,_from,_to);
          }
          pathString = path.join(' ');

          if(sectors[j]){
            sectors[j].attr('path',pathString);
          }else{
            var sector = paper.path(pathString)
              , color
            sectors[j] = sector
            color = that.getcolor(j,colors)
            sectors[j].attr({'fill':color,stroke:'#fff'});
            sectors[j].percent = percentData[j]
          }
          if(s === 1){
            //扇形的平分线与圆的交点
            sectors[j].middle = path.middle;
          }
        }
      }
      //半径展开动画
      function _draw2(e,s,t){
        s = e.s,t = e.t;
        var _r = s*r
          , _from
          , _to
        for(var j=0;j<len;j++){
          if(j){
            _from = _to;
            _to = _from - percentData[j]*360;
          }else{
            fromAngel = 90 + percentData[0]/2 * 360;
            toAngel = 90 - percentData[0]/2 * 360;
            _from = fromAngel+(90-fromAngel);
            _to = _from+(toAngel-fromAngel);
          }
          path = that.sectorFull(cx,cy,_r,_from,_to);
          pathString = path.join(' ');
          if(sectors[j]){
            sectors[j].attr('path',pathString);
          }else{
            var sector = paper.path(pathString)
              , color
            sectors[j] = sector
            color = this.getcolor(j)
            sectors[j].attr({'fill':color,stroke:'#fff'});
            sectors[j].percent = percentData[j]
          }
          if(s === 1){
            //扇形的平分线与圆的交点
            sectors[j].middle = path.middle;
          }
        }
      }
      var types = {
          'sector':_draw1,
          'r':_draw2
      };
      var _draw
        , anim_cfg = S.mix({type:'sector'},cfg.anim)
        //ie大于8，开启动画；非ie，开启动画
        , bool_anim = (S.UA.ie && S.UA.ie>8 && cfg.anim) || (!S.UA.ie && cfg.anim)

      _draw = types[anim_cfg.type] || _draw1;
      if(bool_anim){
        var ft = new Ft(anim_cfg);
        ft.on('step',_draw,this);
        ft.on('end',this.onend,this);
        ft.run();

      }else{
        _draw({s:1,t:1});
        this.onend();
      }
    },
    scaleSector:function(sector,scalex,scaley,cx,cy){
      sector.scale(scalex,scaley,cx,cy);
    },
    transformSector:function(sector,unit){
      if(this.currentTransformedSector == sector)
        return;

      var x,y,angel
      unit || (unit = 10);
      if(this.currentTransformedSector){
        angel = this.currentTransformedSector.middle.angel*Math.PI/180;
        x = unit*Math.cos(angel);
        y = -unit*Math.sin(angel);
        this.currentTransformedSector.translate(-x,-y);
        //this.currentTransformedSector.animate({transform:'t'+(-x)+','+(-y)},200);
      }

      angel = sector.middle.angel*Math.PI/180;
      x = unit*Math.cos(angel);
      y = -unit*Math.sin(angel);
      //sector.translate(x,y);
      sector.animate({transform:'t'+x+','+y},400)
      this.currentTransformedSector = sector;
    },
    getLabelXY:function(x,y,content,left){
      var util = this.textlabel
        , size
        , x1
        , y1
      size = util.getTextSize(content)
      if(left){
        x1 = x- size.width;
        y1 = y - size.height/2;
      }else{
        x1 = x+5;
        y1 = y - size.height/2;
      }
      return {
        "x":normalizeNum(x1),
        "y":normalizeNum(y1)
      }
    },
    //label算法二：最靠近扇形的角平分线
    drawLabel:function(){
      var paper = this.labelLayer
        , cfg = this.cfg
        , cx = cfg.cx
        , cy = cfg.cy
        , sectors = this.sectors
        , sector
        , middle
        , len = sectors.length
        , data = cfg.data
        , olabels = []//生成的label
        , label
        , RAD = Math.PI/180
        , cos = Math.cos
        , sin = Math.sin
        , asin = Math.asin
        , abs = Math.abs
        , round = Math.round
        , rad
        , x, y
        , x1, y1
        , x2, y2
        , r = cfg.R
        , R = cfg.R+cfg.labelPadding
        , Rm = cfg.R+2*cfg.labelPadding/3
        , labelO
        , labelRight = []
        , labelLeft = []
        , labelRightLen
        , labelLeftLen

      for(var i=0;i<len;i++){
        sector = sectors[i];
        middle = sector.middle;
        labelO = {};
        if(-90<=middle.angel && middle.angel<=90){
          labelRight.push(labelO);
        }else{
          labelLeft.push(labelO);
        }
        rad = (middle.angel%360)*RAD;
        x = normalizeNum(cx+r*cos(-rad));
        y = normalizeNum(cy+r*sin(-rad));
        x1 = normalizeNum(cx+Rm*cos(-rad));
        y1 = normalizeNum(cy+Rm*sin(-rad));
        x2 = normalizeNum(cx+R*cos(-rad));
        y2 = normalizeNum(cy+R*sin(-rad));
        labelO.i = i;
        labelO.x = x;
        labelO.y = y;
        labelO.x1 = x1;
        labelO.y1 = y1;
        labelO.x2 = x2;
        labelO.y2 = y2;
        sector.label = labelO;
      }
      labelLeftLen = labelLeft.length
      var ileft=0
        , ileftInterval = Math.round(2*cfg.R/labelLeftLen)
        , x3
        , y3
        , prevLabelO
        , p
        , prevy3
        , rate//不超过1

      var offset = D.offset(this.container);
      while(labelLeftLen>ileft){
        labelO = labelLeft[ileft];
        y3 = labelO.y2;
        rate = (y3-cy)/R;
        rate = rate>1?1:
          rate<-1? -1 : rate
        rad = Math.PI+asin(rate);
        x3 = normalizeNum(cx+R*cos(rad));

        if(ileft>0){
          prevLabelO = labelLeft[ileft-1];
          prevy3 = prevLabelO.y3;
          if(prevy3-14<y3){
            y3 = prevy3-14;
          }
        }
        x3-=5;

        labelO.x3 = x3;
        labelO.y3 = y3;
        p = ["M",labelO.x,labelO.y,"Q",labelO.x2,labelO.y2,' ',x3,y3];

        //标注
        label = data[labelO.i].label;
        labelO.text = label;
        var posxy = this.getLabelXY(x3,y3,label,true);
        var textspan = D.create('<span class="ks-charts-label"/>');
        D.html(textspan,label);
        /*
        D.css(textspan,{position:'absolute',left:(offset.left+posxy.x)+'px',top:(offset.top+posxy.y)+'px'});
        D.append(textspan,document.body);
         */

        D.css(this.container,'position','relative');
        D.css(textspan,{position:'absolute',left:(posxy.x)+'px',top:(posxy.y)+'px'});
        D.append(textspan,this.container);

        var pathElement = paper.path(p.join(','));
        pathElement.toBack();
        if(cfg.labelline && cfg.labelline.attr){
          pathElement.attr(cfg.labelline.attr);
        }
        ileft++;
      }
      labelRightLen = labelRight.length
      var iright=0
        , irightInterval = Math.round(2*cfg.R/labelRightLen)

      var labelRightCopy = labelRight.slice(0);
      while(labelRightLen>iright){
        var flag;
        labelO = labelRightCopy[iright];
        y3 = labelO.y2;
        if(labelRightLen>0){
          prevLabelO = labelRightCopy[labelRightLen-1];
          if(prevLabelO.y3+14>y3){
            y3 = prevLabelO.y3+14;
          }
        }
        rate = (y3-cy)/R;
        rate = rate>1?1:
          rate<-1? -1 : rate

        rad = asin(rate);
        x3 = normalizeNum(cx+R*cos(rad));

        x3 += 5;
        labelO.x3 = x3;
        labelO.y3 = y3;
        p = ["M",labelO.x,labelO.y,"Q",labelO.x2,labelO.y2," ",x3,y3,"L"];
        label = data[labelO.i].label;
        labelO.text = label;
        var posxy = this.getLabelXY(x3,y3,label);
        var textspan = D.create('<span class="ks-charts-label"/>');
        D.html(textspan,label)
        /*
        D.css(textspan,{position:'absolute',left:(offset.left+posxy.x)+'px',top:(offset.top+posxy.y)+'px'});
        D.append(textspan,document.body);
         */
        D.css(this.container,'position','relative');
        D.css(textspan,{position:'absolute',left:(posxy.x)+'px',top:(posxy.y)+'px'});
        D.append(textspan,this.container);

        var pathElement = paper.path(p.join(','));
        pathElement.toBack();
        if(cfg.labelline && cfg.labelline.attr){
          pathElement.attr(cfg.labelline.attr);
        }
        iright++;
      }
    },
    //label算法三：label标注在扇形区域内
    drawInsideLabel:function(){
      var cfg = this.cfg
        , data = cfg.data
        , sectors = this.sectors
        , cx = cfg.cx, cy = cfg.cy
        , r = cfg.R

      for(var i=0, l=sectors.length;i<l;i++){
        var label = data[i].label
          , sector = sectors[i]
          , middle = sector.middle
          , angel = middle.angel
          , rad = Math.PI / 180
          , x = cx + .5 * r * Math.cos(-angel * rad)
          , y = cy + .5 * r * Math.sin(-angel * rad)
          , size = this.textlabel.getTextSize(label)
          , textspan = D.create('<span class="ks-charts-label"/>')
        D.text(textspan,label)

        x-=.5*size.width
        y-=.5*size.height
        D.css(this.container,'position','relative');
        D.css(textspan,{position:'absolute',left:(x)+'px',top:(y)+'px'});
        D.append(textspan,this.container);
      }
    },
    renderTip:function(){
      var cfg = this.cfg
        , tipcfg = cfg.tip
        , ctn = this.container
        , boundryCfg
        , color
        , offset
        , outerWidth
        , outerHeight
        , tip_el
      if(tipcfg && tipcfg.tpl){
        offset = D.offset(ctn)
        outerWidth = D.outerWidth(ctn)
        outerHeight = D.outerHeight(ctn)
        boundryCfg = tipcfg.boundryDetect ? {x:offset.left,y:offset.top,width:outerWidth,height:outerHeight} : {}
        S.mix(tipcfg,{rootNode:S.Node(ctn),boundry:boundryCfg});
        this.tip = new Tip(tipcfg);
        tip_el = this.tip.getInstance()

        this.on('mouseenter',function(e){
          var sector = e.target
            , middle = sector.middle
            , x = middle.x
            , y = middle.y
            , fillcolor = Paper.getRGB(sector.attr('fill'))
            , tipdata = {}
          S.mix(tipdata,e.data);
          tipdata.percent = sector.percent;

          fillcolor = shadeColor(fillcolor.hex,-20)
          this.tip.renderTemplate(tipcfg.tpl,tipdata);
          D.css(tip_el,{'borderColor':fillcolor});
          //tip的位置在扇形的中线处
          this.tip.animateTo(x,y);
        },this);
      }
    },
    getcolor:function(i,colors){
      var cfg = this.cfg
        , map = colors || ColorMap
        , c_map_len = map.length
        , color

      i = i%c_map_len

      if(colors && colors[i]){
        color = map[i].DEFAULT
      }else{
        color = ColorMap[i].DEFAULT
      }
      return color;
    }
  }
  S.extend(PieChart,S.Base,methods);

  return PieChart;
},{
  requires:['gallery/kcharts/1.0/raphael/index','gallery/kcharts/1.0/ft/index','gallery/kcharts/1.0/label/index','gallery/kcharts/1.0/tip/index','../tools/color/index']
});

/*
 * note:
 * improve [2013-04-02 周二 11:51]
 * 允许使用字符串数据
 * [
    {"data":"43.09", "label":"chrome"},
    {"data":18.05, "label":"ie8.0"},
    {"data":13.22, "label":"ie9.0"},
    {"data":5.14, "label":"ie7.0"},
    {"data":3.45, "label":"taobrowser"},
    {"data":17.05, "label":"others"}
   ]
 * bug fix [2013-03-29 周五 13:28]
		- label:false 可以不要label
		- afterRender event Bug
		- getColor bug
 * cookieu@gmail.com 04/02/2013 - 10:48 颜色可配置
   cookieu@gmail.com 07/02/2013 - 16:34 piechart imrovment
   1 线条颜色等属性
   2 完善doc
   3 TODO label线条长短控制
   4 transform动画
   5 线条和扇形的层次问题
   6 tip跑到body中去了
 * */