KISSY.add("gallery/kcharts/1.1/mapchart/index", function (S, Raphael, Color, HtmlPaper, Legend, Tip, Theme, MapData) {
    var $ = S.all,
        Event = S.Event;

    var MapChart = function (container, cfg) {
        var self = this;
        self._container = $(container);
        self._cfg = cfg;
        self.init();
    }

    S.augment(MapChart, S.Event.Target, {
        init: function () {
            var self = this;
            if (!self._container) return;

            var _defaultConfig = {
                themeCls: "ks-chart-default",
                canvasAttr: {x: 0, y: 0},
                offset: {
                    x: 15, y: 15
                },
                city: {
                    css: {
                        "padding-left": "10px",
                        "font-size": '12px',
                        "background": "url(http://img01.taobaocdn.com/tps/i1/T1sMCSXExfXXa9hgfr-5-5.png) no-repeat 0 6px",
                        "height": "17px",
                        "display": "inline-block",
                        "position": "absolute"
                    },
                    isShow: false
                },
                tip: {
                    isShow: true,
                    template: "",
                    offset: {
                        x: 0,
                        y: 0
                    },
                    boundryDetect: true
                },
                title: {
                    isShow: true
                },
                autoRender: true
            }

            var themeCls = self._cfg.themeCls || _defaultConfig.themeCls;

            self._cfg = S.mix(S.mix(_defaultConfig, Theme[themeCls], undefined, undefined, true), self._cfg, undefined, undefined, true);

            self.isInPaper = false;

            self.isIE = S.UA.ie ? true : false;

            self.scaleVal = 1;

            self.autoRender && self.render();
        },
        render: function () {
            var self = this,
                _cfg = self._cfg;
            //初始化paper等
            self.initContainer();
            self.initPaper();
            self.proceedSeries();
            self.drawMap(MapData);
            _cfg.tip.isShow && self.renderTip();
            self.fire('afterRender');
        },
        rePaint: function () {
            var self = this,
                _cfg = self._cfg;
            self.paper.clear();
            self.paper = null;
            self._container.children().remove();
            self.initPaper();
            self.drawMap(MapData);
            _cfg.tip.isShow && self.renderTip();
        },
        proceedSeries: function () {
            var self = this,
                _cfg = self._cfg;

            self.series = _cfg.series;

            S.each(self.series, function (item, index) {
                var pro = MapData.mapScale[index];
                item.areaName = pro.text = decodeURIComponent(pro.text);
            });
        },
        initContainer: function () {
            var self = this;
            self._container.css({"-webkit-text-size-adjust": "none", "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)", "position": "relative"});
        },
        drawMap: function (d) {
            var self = this,
                _cfg = self._cfg;
            self.drawPath(d.mapScale);
            self.areaText = self.formatText(d);
            self.drawAreaText(self.areaText);
        },
        processAttr: function (attrs, color) {
            var COLOR_TPL = "{COLOR}";
            var newAttrs = S.clone(attrs);
            for (var i in newAttrs) {
                if (newAttrs[i] && typeof newAttrs[i] == "string") {
                    newAttrs[i] = newAttrs[i].replace(COLOR_TPL, color);
                }
            }
            return newAttrs;
        },
        getAreaCss: function (index, color, attr) {
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
        drawPath: function (paths) {
            var self = this,
                _cfg = self._cfg,
                cb = _cfg.cb,
                paper = self.paper;

            self.pathList = {};
            paper.setStart();

            var color = getDefaultColor();
            S.each(paths, function (ph, index) {
                var path = paper.path(ph.path);
                path.attr(self.getAreaCss(index, color, 'attr'));
                path['index'] = index;
                self.pathList[index] = path;
                path.customOver = over;
                path.customMove = move;
                path.customOut = out;
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

            function over(ev) {
                var index = this.index;
                self.fire('over', [index, self.series[index].areaName]);
            }

            function move(ev) {
                self.isInPaper = true;
                var index = this.index,
                    x = self.isIE ? document.documentElement.scrollLeft + ev.clientX - self._container.offset().left : ev.offsetX,
                    y = self.isIE ? document.documentElement.scrollTop + ev.clientY - self._container.offset().top : ev.offsetY;

                self.fire('move', [index, self.series[index].areaName]);
                self.areaList[index].css(_cfg.areaText.hoverCss);
                y += (self.scaleVal * 40);
                if (!this.c) {
                    this.c = {};
                    var attr = this.attr();
                    for (var i in attr) {
                        if (attr.hasOwnProperty(i) && i != 'path' && i != 'transform') {
                            this.c[i] = attr[i];
                        }
                    }
                    this.stop().animate(self.getAreaCss(index, col, 'hoverAttr'), 500);
                }
                var atr = _cfg.area.hoverAttr,
                    col = getHoverCss();
                this.attr(self.getAreaCss(index, col, 'hoverAttr'));
                if (_cfg.tip.isShow && self.series[index]) {
                    self.tip.fire("setcontent", {data: self.series[index]});
                    self.tip.fire("move", {
                        x: x,
                        y: y,
                        style: self.processAttr(_cfg.tip.css, this.attr("stroke"))
                    });
                }
            }

            function out(ev) {
                var index = this.index;
                self.isInPaper = false;
                self.fire('out', [index, self.series[index].areaName]);
                self.areaList[index].css(_cfg.areaText.css);
                // transform bug
                var attr = this.c;
                for (var i in attr) {
                    this.attr(i, attr[i]);
                }
                !self.isInPaper && self.tip && self.tip.fire("hide");
            }

            map.mouseover(over);
            map.mousemove(move);
            map.mouseout(out);
        },
        converPix: function (x, y) {
            var self = this,
                w = self._cfg.width,
                h = self._cfg.height;

            return {left: parseInt(w * x) + 'px', top: parseInt(h * y) + 'px'};
        },
        drawAreaText: function (o) {
            var self = this,
                _cfg = self._cfg,
                list = {};
            proTpl = '<div style="{defStyle}" class="{cls}">{text}</div>',
                cityTpl = '<span style="{defStyle}">{text}</span>',
                style = "position: absolute;left:{x}px;top:{y}px;width:4em;",
                proStyle = self.formatCss(_cfg.areaText.css),
                cityStyle = self.formatCss(_cfg.city.css),
                textContainer = $('<div class="ks-chart-area-text" style="position: absolute;left: 0;top: 0"></div>');

            textContainer.appendTo(self._container);
            self.areaList = {};
            S.each(o.pro, function (item, i) {
                var str = S.substitute(style, item);
                str += (";" + proStyle);
                var el = $(S.substitute(proTpl, {text: item.text, defStyle: str, cls: i + "-text"}));
                el.data('index', i).appendTo(textContainer);
                Event.on(el, "mouseenter", move);
                Event.on(el, "mouseleave", out);
                self.areaList[i] = el;
                list[item.text] = 1;
            });
            _cfg.city.isShow && S.each(o.city, function (item, i) {
                if (!list[item.text]) {
                    var str = S.substitute(style, item);
                    str += (";" + cityStyle);
                    var el = $(S.substitute(cityTpl, {text: item.text, defStyle: str}));
                    el.appendTo(textContainer);
                }
            });

            function move(ev) {
                var tar = $(this),
                    index = tar.data("index"),
                    path = self.pathList[index],
                    x = tar.css("left"),
                    y = tar.css("top");

                self.isInPaper = true;
                path.customMove(ev);
                tar.css(_cfg.areaText.hoverCss);
            }

            function out(ev) {
                var tar = $(this),
                    index = tar.data("index"),
                    path = self.pathList[index];
                self.isInPaper = false;
                tar.css(_cfg.areaText.css);
                path.customOut(ev);
            }
        },
        formatCss: function (d) {
            if (S.isObject(d)) {
                var cssText = "";
                for (var i in d) {
                    cssText += (i + ":" + d[i] + ";");
                }
                return cssText.substring(0, cssText.length - 1);
            }
        },
        toPath: function (paths) {
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
        getInnerContainer: function () {
            var self = this,
                _$ctnNode = self._container,
                canvasAttr = S.mix(self._cfg.canvasAttr),
                innerWidth = canvasAttr.width || (_$ctnNode.width() - 2 * canvasAttr.x),
                innerHeight = canvasAttr.height || (_$ctnNode.height() - 2 * canvasAttr.y),
                x = canvasAttr.x,
                y = canvasAttr.y,
                width = innerWidth,
                height = innerHeight,
                tl = {x: x, y: y},
                tr = {x: x + innerWidth, y: y},
                bl = {x: x, y: y + height},
                br = {x: x + innerWidth, y: y + height};
            //内部容器的信息
            self._innerContainer = {
                x: x,
                y: y,
                width: width,
                height: height,
                tl: tl,
                tr: tr,
                bl: bl,
                br: br
            };
            return self._innerContainer;
        },
        formatText: function (o) {
            var self = this,
                textList = {pro: {}, city: {}},
                str,
                w = self._cfg.width,
                h = self._cfg.height;

            S.each(o.mapScale, function (item, i) {
                item.x = parseInt(item.x * w);
                item.y = parseInt(item.y * h);
                textList.pro[i] = {x: item.x, y: item.y, text: decodeURIComponent(item.text)};
            });

            //省会城市
            S.each(o.city, function (item, i) {
                item.x = parseInt(item.x * w);
                item.y = parseInt(item.y * h);
                textList.city[i] = {x: item.x, y: item.y, text: decodeURIComponent(i)};
            });
            return textList;
        },
        resize: function (val) {
            var self = this,
                _cfg = self._cfg,
                SPLIT = ',';

            val = val.split(SPLIT);
            val[0] = (val[0] * _cfg.width).toFixed(4);
            val[1] = (val[1] * _cfg.height).toFixed(4);
            return val.join(SPLIT);
        },
        formatPath: function (paths) {
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
                pathList[i] = {path: ar, other: str};
            });
            return pathList;
        },
        formatNumber: function (val, j) {
            var SPLIT = ',',
                offset;
            val = val.split(SPLIT);
            val[0] = parseFloat(val[0] / MapData.svgWidth);
            val[1] = parseFloat(val[1] / MapData.svgHeight);
            return val.join(SPLIT);
        },
        initPaper: function () {
            var self = this,
                _cfg = self._cfg;

            _cfg.width = self._container.width() || MapData.svgWidth;
            _cfg.height = self._container.height() || MapData.svgHeight;
            self.initTitle();
            self.calculateSize();
            self.paper = Raphael(self._container[0], _cfg.width, _cfg.height);
            self.paper.setViewBox(0, 0, MapData.svgWidth, MapData.svgHeight);
            self.scaleVal = (_cfg.width / MapData.svgWidth).toFixed(2);
        },
        initTitle: function () {
            var self = this,
                _cfg = self._cfg,
                tpl = '<h3 class="ks-chart-title"></h3>';
            if (_cfg.title.content) {
                $(tpl).css(_cfg.title.css).text(_cfg.title.content).appendTo(self._container);
            }
        },
        calculateSize: function () {
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
        renderTip: function () {
            var self = this,
                _cfg = self._cfg,
                ctn = self.getInnerContainer(),
                boundryCfg = _cfg.tip.boundryDetect ? {x: ctn.tl.x, y: ctn.tl.y, width: ctn.width, height: ctn.height} : {},
                tipCfg = S.mix(_cfg.tip, {rootNode: self._container, clsName: _cfg.themeCls, boundry: boundryCfg}, undefined, undefined, true);
            self.tip = new Tip(tipCfg);
            return self.tip;
        }
    });

    return MapChart;
}, {requires: [
    '../raphael/index',
    '../tools/color/index',
    '../tools/htmlpaper/index',
    '../legend/index',
    '../tip/index',
    './theme',
    './mapdata']
          });