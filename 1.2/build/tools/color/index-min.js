/*! kcharts - v1.2 - 2013-08-27 3:46:39 PM
* Copyright (c) 2013 数据可视化小组; Licensed  */
KISSY.add("gallery/kcharts/1.2/tools/color/index",function(t){function l(t){this.init(t)}return l.prototype={init:function(t){var l=t&&t.themeCls||"ks-chart-default";this._colors=this.colorCfg[l]||this.colorCfg["ks-chart-default"],this.len=this._colors.length||0},colorCfg:{"ks-chart-default":[{DEFAULT:"#00adef",HOVER:"#1176ba"},{DEFAULT:"#8cc63e",HOVER:"#066839"},{DEFAULT:"#f7941d",HOVER:"#ef3e38"},{DEFAULT:"#ee217e",HOVER:"#cd7db2"},{DEFAULT:"#603814",HOVER:"#8a5e3b"},{DEFAULT:"#662e91",HOVER:"#492062"},{DEFAULT:"#bf1e2d",HOVER:"#ec1d23"}],"ks-chart-analytiks":[{DEFAULT:"#48BAF4",HOVER:"#48BAF4"},{DEFAULT:"#ff7b6c",HOVER:"#ff7b6c"},{DEFAULT:"#999",HOVER:"#999"},{DEFAULT:"#c17e7e",HOVER:"#c17e7e"}],"ks-chart-rainbow":[{DEFAULT:"#4573a7",HOVER:"#5E8BC0"},{DEFAULT:"#aa4644",HOVER:"#C35F5C"},{DEFAULT:"#89a54e",HOVER:"#A2BE67"},{DEFAULT:"#806a9b",HOVER:"#9982B4"},{DEFAULT:"#3e96ae",HOVER:"#56AFC7"},{DEFAULT:"#d9853f",HOVER:"#F49D56"},{DEFAULT:"#808080",HOVER:"#A2A2A2"},{DEFAULT:"#188AD7",HOVER:"#299BE8"},{DEFAULT:"#90902C",HOVER:"#B7B738"},{DEFAULT:"#AFE65D",HOVER:"#C5ED89"}]},removeAllColors:function(){return this._colors=[],this._colors},setColor:function(l){l&&l.DEFAULT&&l.HOVER?this._colors.push(l):t.log('请设置正确的颜色参数，如：{DEFAULT:"#4573a7",HOVER:"#5E8BC0"}')},getColor:function(t){return this._colors[t%this.len]},getColors:function(){var t,l=0,e=this,r=[];arguments[1]?(l=arguments[0],t=arguments[1]):t=arguments[0];for(var i=l;t-l>i;i++)r.push(e.getColor(i));return r}},l.prototype.constructor=l,l});