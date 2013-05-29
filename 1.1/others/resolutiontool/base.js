/*
 TODO 坐标运算  画布大小计算
 */
KISSY.add('gallery/kcharts/1.1/others/resolutiontool/base', function (S, Base) {

    var $ = S.all;

    var BaseChart = function () {};

    S.extend(BaseChart, Base, {
        init:function (cfg) {

            var self = this,
                _cfg, series;

            if (cfg && cfg.renderTo) {

                _cfg = self._cfg = S.mix({
                                             zIndex:0,
                                             yAxis:{

                                             },
                                             canvasAttr:{x:60, y:60},
                                             defineKey:{

                                             },
                                             origin:'mc'
                                         }, cfg);

                self._$ctnNode = $(cfg.renderTo);

                self._$ctnNode.css({
                                       "-webkit-text-size-adjust":"none", //chrome最小字体限制
                                       "-webkit-tap-highlight-color":"rgba(0,0,0,0)"            //去除touch时的闪烁背景
                                   })


                S.mix(self, {
                    _datas:{
                        cur:{},
                        total:{}
                    },
                    _points:{},
                    _centerPoints:[],
                    _pointsX:[],
                    _pointsY:[],
                    _gridsX:[],
                    _gridsY:[],
                    _areas:[],
                    _axisX:null,
                    _axisY:null,
                    _labelX:[],
                    _labelY:[],
                    _evtEls:[],
                    _gridPoints:[], //存放网格线
                    _multiple:false,
                    stackable:false
                });

                series = _cfg.series || null;

                if (!series || series.length <= 0 || !series[0].data) return;

                self.getInnerContainer();
                self.dataFormat();
            }
        },
        //获取内部容器信息
        getInnerContainer:function () {
            var self = this,
                _$ctnNode = self._$ctnNode,
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
        getXAxisData:function (ar) {
            var self = this,
                cfg = self._cfg,
                list = [];

            if (cfg.origin == 'mc') {
                list = S.clone(ar);
                ar.sort(function (a, b) {
                    return parseInt(a) < parseInt(b);
                })
                ar.push(0);
                list = ar.concat(list);
                ar = list;
            }
            return ar;
        },
        getYAxisData:function (ar) {
            var self = this,
                cfg = self._cfg;

            ar.unshift(0);
            return ar;
        },
        getXAxisPoints:function (p) {
            var self = this,
                _cfg = self._cfg,
                ictn = self._innerContainer,
                width = ictn.width,
                height = ictn.height,
                list = [],
                half = parseInt(p.length / 2),
                origin = _cfg.origin;

            if (origin == 'mc') {
                S.each(p, function (item, index) {
                    item = parseInt(item);
                    index <= half ? list.push((width - item) / 2) : list.push(width / 2 + item / 2);
                })
                p = list;
            }
            return p;
        },
        getYAxisPoints:function (p) {
            var self = this,
                _cfg = self._cfg,
                ictn = self._innerContainer,
                width = ictn.width,
                height = ictn.height,
                half = parseInt(p.length / 2),
                list = [],
                origin = _cfg.origin;

            for (var i in p) {
                p[i] = parseInt(p[i]);
            }
            return p;
        },
        dataFormat:function () {
            var self = this,
                _cfg = self._cfg,
                origin = _cfg.origin,
                ictn = self._innerContainer,
                width = ictn.width,
                height = ictn.height,
                series = _cfg.series,
                x = ictn.x,
                y = ictn.y;

            self._pointsY = [];
            self._pointsX = [];
            self._points = [];

            //x轴label
            _cfg.xAxis.text = self.getXAxisData(_cfg.xAxis.text);
            //y轴label
            _cfg.yAxis.text = self.getYAxisData(_cfg.yAxis.text);

            //x轴刻度
            self._pointsX = self.getXAxisPoints(_cfg.xAxis.text);
            //y轴刻度
            self._pointsY = self.getYAxisPoints(_cfg.yAxis.text);

            //曲线坐标
            if (origin == 'mc') {
                S.each(series, function (item) {
                    self._points.push({
                                          x:(width - item.x) / 2,
                                          y:0,
                                          w:item.x,
                                          h:item.y,
                                          data:item.data
                                      });
                });
            } else {
                S.each(series, function (item) {
                    self._points.push({
                                          x:0,
                                          y:0,
                                          w:item.x,
                                          h:item.y,
                                          data:item.data
                                      });
                });
            }
        }
    });
    return BaseChart;
}, {requires:['base']});

