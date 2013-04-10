/**
 * @fileOverview KChart 1.1  tip
 * @author huxiaoqi567@gmail.com
 */
KISSY.add('gallery/kcharts/1.1/tip/index', function (S,Base,Template,undefined) {

    var $ = S.all,
        Event = S.Event;

    function Tip(cfg) {

        if(!cfg) return;

        var self = this,
                defaultCfg = {
                clsName:"ks-chart-default",
                autoRender:true,
                isVisable:false,
                boundry:{        //tip的移动区域
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
                anim:{
                    easing:"easeOut",
                    duration:0.25
                },
                offset:{
                    x:0,
                    y:0
                },
                alignX:"left", //left center right
                alignY:"top"    //top middle bottom
            };

        self._events = {
            MOVE:"move",
            SETCONT:"setcontent",
            HIDE:"hide"
        }

        self._cfg = S.mix(defaultCfg, cfg, undefined, undefined, true);

        self._cfg.rootNode = $(self._cfg.rootNode);

        self.init();
    }

    S.augment(Tip, Base, {
        init:function () {
            var self = this,
                _cfg = self._cfg;

            self._data = {};

            self._tpl = _cfg.tpl;

            self.$tip;

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

                        self.isVisable() ? self.animateTo(x, y) : self.moveTo(x, y);
                        style && self.$tip.css(style);
                    }
            );

            self.on(_events.SETCONT, function (ev) {
                if (S.isFunction(tpl)) {
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
            var self = this;

            self.show();

            var $tip = self.getInstance(),
                _cfg = self._cfg,
                anim = _cfg.anim,
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
                     
                // if(marginTop < y){
                //     marginTop = y;
                //     // S.log("out of boundry at top!");
                // }else if(marginTop > y + h - height){
                //     marginTop = y + h - height;
                //     // S.log("out of boundry at bottom!");
                // }

                // if(marginLeft < x){
                //     marginLeft = x;
                //     // S.log("out of boundry at left!");
                // }else if(marginLeft > x + w - width){
                //     marginLeft = x + w - width;
                //     // S.log("out of boundry at right!");
                // }

                //躲闪
                if(marginTop < by){
                    marginTop = y + Math.abs(offset.y);
                }else if(marginTop > by + h - height){
                    marginTop = y - height - Math.abs(offset.y); 
                }

                if(marginLeft < bx){
                    marginLeft = x + Math.abs(offset.x);
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

            if (!_cfg.rootNode.offset()) return;

            self.$tip = !self._isExist() && $('<span class="' + _cfg.clsName + '-tip" style="*zoom:1;"><span class="' + _cfg.clsName + '-tip-content"></span></span>')
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
    });

    return Tip;

}, {requires:['base','gallery/template/1.0/index', './assets/tip.css']});