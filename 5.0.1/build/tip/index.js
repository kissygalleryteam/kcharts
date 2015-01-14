define('kg/kcharts/5.0.1/tip/index',["util","node","base","kg/kcharts/5.0.1/tools/template/index"],function(require, exports, module) {

  var Util = require("util"),
    Node = require("node"),
    Base = require("base"),
    Template = require("kg/kcharts/5.0.1/tools/template/index");
    var $ = Node.all;
    var methods = {
      initializer:function(){
        this.init();
      },
      init:function () {
        var cfg = this.userConfig;
        var self = this,
            defaultCfg = {
              clsName:"ks-chart-default",
              autoRender:true,
              isVisable:false,
              boundry:{        
                x:0,
                y:0,
                width:0,
                height:0
              },
              rootNode:$("body"),
              tpl:"",
              corner:{
                isShow:false,
                tpl:"corner",
                css:{
                  position:"absolute",
                  marginLeft:0,
                  marginTop:0
                }
              },
              css:{
                background: "#000",
                opacity: 0.6,
                "-moz-border-radius":  "5px",
                "-webkit-border-radius": "5px",
                "border-radius":"5px",
                "padding":"5px",
                "color":"#fff",
                "font-family":"Microsoft Yahei",
                "z-index": 10,
                "font-size": "12px"
              },
              anim:{
                easing:"easeOut",
                duration:0.25
              },
              offset:{
                x:0,
                y:0
              },
              alignX:"left", 
              alignY:"top"    
            };

        self._events = {
          MOVE:"move",
          SETCONT:"setcontent",
          HIDE:"hide"
        }

        self._cfg = Util.mix(defaultCfg, cfg, undefined, undefined, true);

        self._cfg.rootNode = $(self._cfg.rootNode);

        var  _cfg = self._cfg;

        self._data = {};

        self._tpl = _cfg.tpl;
        self.bindEvent();

        if (_cfg.autoRender) {
          self.render();
        }
      },
      bindEvent:function () {
            var self = this,
                tpl = self._cfg.template,
                _events = self._events;

            self.on(_events.MOVE, function (ev) {
                        var x = ev.x,
                            y = ev.y,
                            style = ev.style;
                        self.isVisable() && self._cfg.anim ? self.animateTo(x, y) : self.moveTo(x, y);
                        style && self.$tip.css(style);
                    }
            );

            self.on(_events.SETCONT, function (ev) {
                if (Util.isFunction(tpl)) {
                    self.setContent(tpl(ev.data));
                } else {
                    self.renderTemplate(tpl, ev.data);
                }
            });

            self.on(_events.HIDE, function (ev) {
                self.hide();
            })
        },
        getInstance:function () {

            return this.$tip;

        },
        isVisable:function () {

            return this.$tip.css("display") == "none" ? false : true;

        },
        show:function () {

            var self = this;

            self.$tip && self.$tip.show();

            return self;

        },

        hide:function () {

            var self = this;

            self.$tip && self.$tip.stop() && self.$tip.hide();

            return self;

        },
        moveTo:function (x, y) {
            var self = this;
            self._prevtime = new Date().getTime();
            self.show();
            var $tip = self.getInstance(),
                _cfg = self._cfg,
                anim = self._cfg.anim,
                pos = self.getPos(x, y),
                marginTop = _cfg.corner.css["margin-top"] || _cfg.corner.css["marginTop"] || 0,
                marginLeft = _cfg.corner.css["margin-left"] || _cfg.corner.css["marginLeft"] || 0,
                $corner = self.$corner;

            $corner && $corner.css({
                                       "margin-left":marginLeft + x - pos.x
                                   });

            $tip.css({
                         "margin-top":pos.y,
                         "margin-left":pos.x
                     });

        },
        animateTo:function (x, y, callback) {
            var self = this,
                  _cfg = self._cfg,
                anim = _cfg.anim,
                now = new Date().getTime();
            if(self._prevtime){
                
               if(now - self._prevtime < 100){
                    
                    self.animateFast(x,y,callback);
               }
            }
            self.show();
            self._prevtime = new Date().getTime();
            var $tip = self.getInstance(),
                pos = self.getPos(x, y),
                marginTop = _cfg.corner.css["margin-top"] || _cfg.corner.css["marginTop"] || 0,
                marginLeft = _cfg.corner.css["margin-left"] || _cfg.corner.css["marginLeft"] || 0,
                $corner = self.$corner;

            $corner && $corner.css({
                                       "margin-left":marginLeft + x - pos.x
                                   });
            $tip.stop().animate({
                                    "margin-top":pos.y,
                                    "margin-left":pos.x
                                }
                , anim.duration
                , anim.easing
                , function () {
                    callback && callback();
                });
        },
        
        animateFast:function(x,y,callback){
            var self = this,
                px = self.get("x"),
                py = self.get("y"),
                cx,
                cy,
                rate = 1/5,
                offset = 0;
            self._prevtime = new Date().getTime();
            self.show();

            if(px !== undefined){
                cx = px/1 + (x - px) * rate;
                cy = py/1 + (y - py) * rate;
            }
            var $tip = self.getInstance(),
                _cfg = self._cfg,
                anim = self._cfg.anim,
                pos = self.getPos(cx, cy),
                marginTop = _cfg.corner.css["margin-top"] || _cfg.corner.css["marginTop"] || 0,
                marginLeft = _cfg.corner.css["margin-left"] || _cfg.corner.css["marginLeft"] || 0,
                $corner = self.$corner;

            $corner && $corner.css({
                                       "margin-left":marginLeft + x - pos.x
                                   });

            $tip.css({
                         "margin-top":pos.y,
                         "margin-left":pos.x
                     });

             var posend = self.getPos(x, y);

            $tip.stop().animate({
                                    "margin-top":posend.y,
                                    "margin-left":posend.x
                                }
                , anim.duration
                , anim.easing
                , function () {
                    callback && callback();
                });

        },
        renderTemplate:function (tpl, data) {
            return this.setContent(Template(tpl).render(data));
        },
        setContent:function (content) {
            return $("." + this._cfg.clsName + "-tip-content", this.$tip).html(content);
        },
        getPos:function (x, y) {

            var self = this,
                _cfg = self._cfg,
                offset = _cfg.offset,
                marginTop = y + offset.y,
                marginLeft = x + offset.x,
                alignX = _cfg.alignX,
                alignY = _cfg.alignY,
                $tip = self.getInstance(),
                width = $tip.outerWidth(),
                height = $tip.outerHeight(),
                boundry = _cfg.boundry;

            self.set("x",x || 0);

            self.set("y",y || 0);

            switch (alignX) {
                case "center":
                    marginLeft = Math.round(x) + offset.x - width / 2;
                    break;
                case "right" :
                    marginLeft = Math.round(x) + offset.x - width;
                    break;
            }
            switch (alignY) {
                case "middle":
                    marginTop = Math.round(y) + offset.y - height / 2;
                    break;

                case "bottom" :
                    marginTop = Math.round(y) + offset.y - height;
                    break;
            }

            if (boundry.width && boundry.height) {

                var bx = boundry.x || 0,
                    by = boundry.y || 0,
                    w = boundry.width,
                    h = boundry.height;
                
                if(marginTop < by){
                    marginTop = y -(-Math.abs(offset.y));
                }else if(marginTop > by + h - height){
                    marginTop = y - height - Math.abs(offset.y);
                }

                if(marginLeft < bx){
                    marginLeft = x - (-Math.abs(offset.x));
                }else if(marginLeft > bx + w - width){
                     marginLeft = x - width - Math.abs(offset.x);
                }
            }
            return {x:marginLeft, y:marginTop};
        },

        _isExist:function () {
            return this.$tip && this.$tip[0];
        },

        render:function () {
            var self = this,
                _cfg = self._cfg,
                _tpl = self._tpl,
                _data = self._data,
                display = _cfg.isVisable ? "inline-block" : "none",
                rootNodeOffset = _cfg.rootNode.offset();
            if (!_cfg.rootNode.offset()) return false;
            self.$tip = !self._isExist() && $('<span class="ks-chart-tip ' + _cfg.clsName + '-tip" style="*zoom:1;"><span class="' + _cfg.clsName + '-tip-content"></span></span>')
                .css(_cfg.css)
                .css({"display":display})
                .appendTo(_cfg.rootNode);

            self.$corner = (_cfg.corner.isShow && _cfg.corner.tpl) ? $("<div class='" + _cfg.clsName + "-corner'>" + _cfg.corner.tpl + "</div>").css(_cfg.corner.css).appendTo(self.$tip) : undefined;

            self.$tip.css({
                              "margin-top":rootNodeOffset.top + _cfg.offset.y,
                              "margin-left":rootNodeOffset.left + _cfg.offset.x,
                              "position":"absolute"
                          });

            self.renderTemplate(_tpl, _data);
            return self.$tip;
        }
    };

    return Base.extend(methods);
});