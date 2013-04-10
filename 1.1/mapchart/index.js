KISSY.add("gallery/kcharts/1.1/mapchart/index", function (S, Raphael, Color, HtmlPaper, Legend, Tip, Theme, MapData) {
        var $ = S.all,
            Event = S.Event;

        var MapChart = function (container, cfg) {
            var self = this;
            self._container = $(container);
            self._cfg = cfg;
            self.init();
        }

        S.augment(MapChart, {
            init:function () {
                var self = this;
                if (!self._container) return;

                var _defaultConfig = {
                    themeCls:"ks-chart-default",
                    canvasAttr:{x:0, y:0},
                    offset:{
                        x:15, y:15
                    },
                    tip:{
                        isShow:true,
                        template:"",
                        offset:{
                            x:0,
                            y:0
                        },
                        boundryDetect:true
                    },
                    title:{
                        isShow:true
                    }
                }

                var themeCls = self._cfg.themeCls || _defaultConfig.themeCls;

                self._cfg = S.mix(S.mix(_defaultConfig, Theme[themeCls], undefined, undefined, true), self._cfg, undefined, undefined, true);

                self.isInPaper = false;

                self.isIE = S.UA.ie ? true : false;

                self.scaleVal = 1;

                self.render();
            },
            render:function () {
                var self = this,
                    _cfg = self._cfg;

                //初始化paper等
                self.initContainer();
                self.initPaper();
                self.proceedSeries();
                self.drawMap(MapData.mapDataSource);
                _cfg.tip.isShow && self.renderTip();

            },
            rePaint:function () {
                var self = this,
                    _cfg = self._cfg;
                self.paper.clear();
                self.paper = null;
                self._container.children().remove();
                self.initPaper();
                self.drawMap(MapData.mapDataSource);
                _cfg.tip.isShow && self.renderTip();
            },
            proceedSeries:function () {
                var self = this,
                    _cfg = self._cfg;

                self.series = _cfg.series;
                S.each(MapData.mapDataSource, function (item, index) {
                    self.series[index].areaName = item.text = unescape(item.text);
                });
            },
            initContainer:function () {
                var self = this;
                self._container.css({"-webkit-text-size-adjust":"none", "-webkit-tap-highlight-color":"rgba(0, 0, 0, 0)", "position":"relative"});
            },
            drawMap:function (d) {
                var self = this,
                    _cfg = self._cfg;

                self.paths = self.formatPath(d);
                self.areaText = self.formatText(d);
                self.drawPath(self.toPath(self.paths));
                self.drawAreaText(self.areaText);

            },
            processAttr:function (attrs, color) {
                var COLOR_TPL = "{COLOR}";
                var newAttrs = S.clone(attrs);
                for (var i in newAttrs) {
                    if (newAttrs[i] && typeof newAttrs[i] == "string") {
                        newAttrs[i] = newAttrs[i].replace(COLOR_TPL, color);
                    }
                }
                return newAttrs;
            },
            getAreaCss:function (index, color, attr) {
                var self = this,
                    _cfg = self._cfg,
                    cfg = S.clone(color);

                if (self.series[index] && ( self.series[index].groupKey || self.series[index].css)) {
                    var id = self.series[index].groupKey;
                    if (id && _cfg.cssGroup && _cfg.cssGroup[id]) {
                        cfg = S.mix(cfg, _cfg.cssGroup[id][attr], undefined, undefined, true);
                    }
                    if (self.series[index].css) {
                        cfg = S.mix(cfg, self.series[index].css[attr], undefined, undefined, true);
                    }
                }
                return cfg;

            },
            drawPath:function (paths) {
                var self = this,
                    _cfg = self._cfg,
                    paper = self.paper;
                self.pathList = {};
                paper.setStart();

                var color = getDefaultColor();
                S.each(paths, function (ph, index) {
                    var path = paper.path(ph);
                    path.attr(self.getAreaCss(index, color, 'attr'));
                    path['index'] = index;
                    self.pathList[index] = path;
                });
                var map = paper.setFinish();

                function getDefaultColor() {
                    var cfg = _cfg.area.attr;
                    if (_cfg.cssGroup && _cfg.cssGroup.defaultCls) {
                        var type = _cfg.cssGroup.defaultCls;
                        _cfg.cssGroup[type] && (cfg = S.mix(cfg, _cfg.cssGroup[type].attr, undefined, undefined, true));
                    }
                    return cfg;
                }

                function getHoverCss() {
                    var cfg = _cfg.area.hoverAttr;
                    if (_cfg.cssGroup && _cfg.cssGroup.defaultCls) {
                        var type = _cfg.cssGroup.defaultCls;
                        _cfg.cssGroup[type] && (cfg = S.mix(cfg, _cfg.cssGroup[type].hoverAttr, undefined, undefined, true));
                    }
                    return cfg;
                }

                function move(ev) {
                    self.isInPaper = true;
                    var index = this.index,
                        x = self.isIE ? ev.clientX - self._container.offset().left : ev.offsetX,
                        y = self.isIE ? ev.clientY - self._container.offset().top : ev.offsetY;

                    self.areaList[index].css(_cfg.areaText.hoverCss);
                    y += (self.scaleVal * 40);
                    this.c = this.c || this.attr();
                    var atr = _cfg.area.hoverAttr,
                        col = getHoverCss();

                    this.stop().animate(self.getAreaCss(index, col, 'hoverAttr'), 500);
                    if (_cfg.tip.isShow && self.series[index]) {
                        self.tip.fire("setcontent", {data:self.series[index]});
                        self.tip.fire("move", {
                            x:x,
                            y:y,
                            style:self.processAttr(_cfg.tip.css, this.attr("stroke"))
                        });
                    }
                }

                function out(ev) {
                    self.isInPaper = false;
                    self.areaList[this.index].css(_cfg.areaText.css);
                    this.stop().animate(this.c, 500);
                    !self.isInPaper && self.tip && self.tip.fire("hide");
                }

                map.mousemove(move);
                map.mouseout(out);
            },
            drawAreaText:function (o) {
                var self = this,
                    _cfg = self._cfg,
                    tpl = '<span style="{defStyle}" class="{cls}">{text}</span>',
                    style = "position: absolute;left:{x}px;top:{y}px",
                    defStyle = self.formatCss(_cfg.areaText.css),
                    textContainer = $('<div class="area-text" style="position: relative;"></div>');

                textContainer.appendTo(self._container);
                self.areaList = {};
                S.each(o, function (item, i) {
                    var str = S.substitute(style, item);
                    str += (";" + defStyle);
                    var el = $(S.substitute(tpl, {text:item.text, defStyle:str, cls:i + "-text"}));
                    el.data('index', i).appendTo(textContainer);

                    Event.on(el, "mouseenter", move);
                    Event.on(el, "mouseleave", out);
                    self.areaList[i] = el;
                });

                function move(ev) {
                    var tar = $(this),
                        index = tar.data("index"),
                        path = self.pathList[index],
                        x = tar.css("left"),
                        y = tar.css("top");

                    self.isInPaper = true;
                    x = parseInt(x.substring(0, x.indexOf('px')));
                    y = parseInt(y.substring(0, y.indexOf('px'))) + self.scaleVal * 40;
                    tar.css(_cfg.areaText.hoverCss);
                    path.c = path.c || path.attr();
                    path.stop().animate(_cfg.area.hoverAttr, 500);
                    if (_cfg.tip.isShow && self.series[index]) {
                        self.tip.fire("setcontent", {data:self.series[index]});
                        self.tip.fire("move", {
                            x:x,
                            y:y,
                            style:self.processAttr(_cfg.tip.css, path.attr("stroke"))
                        });
                    }
                }

                function out() {
                    var tar = $(this),
                        index = tar.data("index"),
                        path = self.pathList[index];
                    self.isInPaper = false;
                    tar.css(_cfg.areaText.css);
                    path.stop().animate(this.c, 500);
                    !self.isInPaper && self.tip && self.tip.fire("hide");
                }
            },
            formatCss:function (d) {
                if (S.isObject(d)) {
                    var cssText = "";
                    for (var i in d) {
                        cssText += (i + ":" + d[i] + ";");
                    }
                    return cssText.substring(0, cssText.length - 1);
                }
            },
            toPath:function (paths) {
                var self = this, list = {};
                S.each(paths, function (ph, i) {
                    var l = ph.path.length , html = '', str;
                    S.each(ph.path, function (item, j) {
                        str = ph.other[j] + self.resize(item);
                        html += str;
                    });
                    html += ph.other[l];
                    list[i] = html;
                })

                return list;
            },
            getInnerContainer:function () {
                var self = this,
                    _$ctnNode = self._container,
                    canvasAttr = S.mix(self._cfg.canvasAttr),
                    innerWidth = canvasAttr.width || (_$ctnNode.width() - 2 * canvasAttr.x),
                    innerHeight = canvasAttr.height || (_$ctnNode.height() - 2 * canvasAttr.y),
                    x = canvasAttr.x,
                    y = canvasAttr.y,
                    width = innerWidth,
                    height = innerHeight,
                    tl = {x:x, y:y},
                    tr = {x:x + innerWidth, y:y},
                    bl = {x:x, y:y + height},
                    br = {x:x + innerWidth, y:y + height};
                //内部容器的信息
                self._innerContainer = {
                    x:x,
                    y:y,
                    width:width,
                    height:height,
                    tl:tl,
                    tr:tr,
                    bl:bl,
                    br:br
                };

                return self._innerContainer;

            },
            formatText:function (o) {
                var self = this, textList = {}, str;
                S.each(o, function (item, i) {
                    str = self.resize(self.formatNumber(item.x + ',' + item.y));
                    str = str.split(',');
                    textList[i] = {x:str[0], y:str[1], text:item.text};
                });

                return textList;
            },
            resize:function (val) {
                var self = this,
                    _cfg = self._cfg;

                val = val.split(',');
                val[0] = (val[0] * _cfg.width).toFixed(4);
                val[1] = (val[1] * _cfg.height).toFixed(4);
                return val.join(',');
            },
            formatPath:function (paths) {
                var self = this,
                    _cfg = self._cfg,
                    SPLIT = ',',
                    pathList = {};

                S.each(paths, function (ph, i) {
                    var str = ph.path,
                        reg = /(\d)+\.?(\d)*(\s)*,(\s)*(\d)+\.?(\d)*/g,
                        ar = [];
                    str = str.replace(/\s+/g, ' ');
                    if (ar = str.match(reg)) {
                        str = str.replace(reg, 'X');
                        str = str.split('X');
                        S.each(ar, function (item, index) {
                            ar[index] = self.formatNumber(item);
                        });
                    }
                    pathList[i] = {path:ar, other:str};
                });
                return pathList;
            },
            formatNumber:function (val, j) {
                val = val.split(',');
                val[0] = parseFloat(val[0] / MapData.svgWidth);
                val[1] = parseFloat(val[1] / MapData.svgHeight);
                return val.join(',');
            },
            initPaper:function () {
                var self = this,
                    _cfg = self._cfg;
                _cfg.width = self._container.width() || MapData.svgWidth;
                _cfg.height = self._container.height() || MapData.svgHeight;
                if (_cfg.offset) {
                    _cfg.width -= _cfg.offset.x * 2;
                    _cfg.height -= _cfg.offset.y * 2;
                }
                self.initTitle();
                self.calculateSize();
                self.paper = Raphael(self._container[0], _cfg.width, _cfg.height);
                if (self.paper.canvas) {
                    $(self.paper.canvas).css({
                        left:_cfg.offset.x,
                        top:_cfg.offset.y
                    });
                }
                ;
                self.scaleVal = (_cfg.width / MapData.svgWidth).toFixed(2);
            },
            initTitle:function () {
                var self = this,
                    _cfg = self._cfg,
                    tpl = '<h3 class="ks-chart-title"></h3>';
                if (_cfg.title.content) {
                    $(tpl).css(_cfg.title.css).text(_cfg.title.content).appendTo(self._container);
                    _cfg.height -= self._container.one(".ks-chart-title").height();
                }
            },
            calculateSize:function () {
                var self = this,
                    _cfg = self._cfg,
                    w, h;
                w = Math.ceil(MapData.svgWidth * _cfg.height / MapData.svgHeight);
                h = Math.ceil(MapData.svgHeight * _cfg.width / MapData.svgWidth);

                if (h > _cfg.height) {
                    h = _cfg.height;
                }
                if (w > _cfg.width) {
                    w = _cfg.width;
                }
                _cfg.width = w;
                _cfg.height = h;
            },
            renderTip:function () {
                var self = this,
                    _cfg = self._cfg,
                    ctn = self.getInnerContainer(),
                    boundryCfg = _cfg.tip.boundryDetect ? {x:ctn.tl.x, y:ctn.tl.y, width:ctn.width, height:ctn.height} : {},
                    tipCfg = S.mix(_cfg.tip, {rootNode:self._container, clsName:_cfg.themeCls, boundry:boundryCfg}, undefined, undefined, true);
                self.tip = new Tip(tipCfg);

                return self.tip;
            }
        })
        ;

        return MapChart;
    },
    {requires:['../raphael/index', '../tools/color/index', '../tools/htmlpaper/index', '../legend/index', '../tip/index', './theme', './mapdata']}
)
;