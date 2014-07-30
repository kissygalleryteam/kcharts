/**
 * @fileoverview
 * @author
 * @module kcharts
 **/
KISSY.add(function (S, Node,Base) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     *
     * @class Kcharts
     * @constructor
     * @extends Base
     */
    function Kcharts(comConfig) {
        var self = this;
        //调用父类构造函数
        Kcharts.superclass.constructor.call(self, comConfig);
    }
    S.extend(Kcharts, Base, /** @lends Kcharts.prototype*/{

    }, {ATTRS : /** @lends Kcharts*/{

    }});
    return Kcharts;
}, {requires:['node', 'base']});



