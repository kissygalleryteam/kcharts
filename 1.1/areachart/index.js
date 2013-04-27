/**
 * @fileOverview KChart 1.1  areachart
 * @author yuxia0025@gmail.com
 */
KISSY.add("gallery/kcharts/1.1/areachart/index", function (S, Base, Raphael, Template, BaseChart, ColorLib, HtmlPaper, Theme, touch, undefined) {

              var $ = S.all,
                  Evt = S.Event,
                  clsPrefix = "ks-chart-",
                  themeCls = clsPrefix + "default",
                  evtLayoutCls = clsPrefix + "evtlayout",
                  evtLayoutRectsTextCls = evtLayoutCls + "-sc-text",
                  COLOR_TPL = "{COLOR}",
                  color;

              var areachart = function (cfg) {
                  var self = this;
                  self._cfg = cfg;
                  self.init();
              };

              S.extend(areachart, BaseChart, {
                  init:function () {
                      var self = this;

                      BaseChart.prototype.init.call(self, self._cfg);

                      self.chartType = "areachart";

                      if (!self._$ctnNode[0]) return;

                      var _defaultConfig = {
                          themeCls:themeCls,
                          autoRender:true,
                          title:{
                              content:"",
                              css:{
                                  "text-align":"center",
                                  "font-size":"16px"
                              },
                              isShow:true
                          },
                          colors:[],
                          subTitle:{
                              content:"",
                              css:{
                                  "text-align":"center",
                                  "font-size":"12px"
                              },
                              isShow:true
                          },
                          rects:{
                              css:{
                                  "border":"3px solid blue"
                              }
                          },
                          xLabels:{
                              isShow:true,
                              css:{
                                  "color":"#666",
                                  "font-size":"12px",
                                  "white-space":"nowrap",
                                  "position":"absolute"     //修复ie7被遮住的Bug
                              }
                          },
                          yLabels:{
                              isShow:true,
                              css:{
                                  "color":"#666",
                                  "font-size":"12px",
                                  "position":"absolute"     //修复ie7被遮住的Bug
                              }
                          },
                          //横轴
                          xAxis:{
                              isShow:true,
                              css:{
                              }
                          },
                          //纵轴
                          yAxis:{
                              isShow:true,
                              css:{
                              },
                              num:5
                          },

                          //x轴上纵向网格
                          xGrids:{
                              isShow:true,
                              css:{
                              }
                          },
                          //y轴上横向网格
                          yGrids:{
                              isShow:true,
                              css:{
                              }
                          },
                          tip:{
                              isShow:true,
                              clsName:"",
                              template:"",
                              css:{

                              },
                              offset:{
                                  x:0,
                                  y:0
                              },
                              boundryDetect:true
                          }
                      };

                      //统计渲染完成的数组
                      self._finished = [];
                      //主题
                      themeCls = self._cfg.themeCls || _defaultConfig.themeCls;

                      self._cfg = S.mix(S.mix(_defaultConfig, Theme[themeCls], undefined, undefined, true), self._cfg, undefined, undefined, true);

                      self.color = color = new ColorLib({themeCls:themeCls});

                      if (self._cfg.colors.length > 0) {
                          color.removeAllColors();
                      }

                      for (var i in self._cfg.colors) {
                          color.setColor(self._cfg.colors[i]);
                      }

                      self._cfg.autoRender && self.render(true);
                  },
                  //画分辨率页面
                  drawLines:function () {
                      var self = this;
                      for (var i in self._points) {
                          self.lineRect(self._points[i].x, self._points[i].y, self._points[i].w, self._points[i].h);
                      }
                  },
                  getPecentValue:function () {
                      var self = this,
                          pixList = self.getPathPix(),
                          points = self._points,
                          percentList = {};
                      for (var i in pixList) {
                          var val = pixList[i],
                              total = 0;
                          S.each(points, function (item) {
                              var x = val[1], y = val[0];
                              if (item.x <= x && x <= (parseInt(item.x) + parseInt(item.w)) && item.y <= y && y <= (parseInt(item.y) + parseInt(item.h))) {
                                  total += item.data;
                              }
                          });
                          percentList[i] = total.toFixed(1);
                      }
                      return percentList;
                  },
                  //画线
                  lineRect:function (x, y, w, h) {
                      var self = this,
                          htmlpaper = self.getPaper();
                      htmlpaper.lineWidth = 1;
                      htmlpaper.strokeStyle = 'rgb(190, 26, 100)';
                      htmlpaper.strokeRect(x, y, w, h);
                  },
                  getPathPix:function () {
                      var self = this,
                          paper = self.getPaper(),
                          origin = self._cfg.origin,
                          pixList = {};

                      if (origin == 'mc') {
                          S.each(self.paths, function (o) {
                              var w1 = o[0], w2 = o[o.length - 1], col, pos;
                              w1 = w1.split(':');
                              pos = w2.split(':');//parseInt(pos[1]) * 2 - parseInt(w1[0]) + 1
                              pixList[w2] = [w1[0] - 0 + 1, w1[1] - 1];
                          });
                      } else {
                          S.each(self.paths, function (o) {
                              var p = o[o.length - 1], col, pos;
                              pos = p.split(':');
                              pixList[p] = [pos[0] - 0 + 1, pos[1] - 0 + 1];
                          });
                      }
                      return pixList;
                  },
                  renderData:function () {
                      var self = this,
                          cfg = self._cfg,
                          origin = cfg.origin,
                          htmlPaper = self.getHtmlPaper(),
                          width = self._innerContainer.width,
                          boxList = [],
                          paper = self.showPaper,
                          startY,
                          hoverCss = {
                              "background-color":"#CD2626",
                              "color":"#fff",
                              "z-index":1000
                          },
                          defaultCss = {
                              "background-color":"#fff",
                              "color":"#fff",
                              "z-index":0
                          },
                          hoverLinerCss = {
                              "background-color":"#CD2626",
                              "color":"#fff",
                              "z-index":1000,
                              "border-radius":"5px"
                          },
                          defaultLineCss = {
                              "background-color":"#fff",
                              "color":"#000",
                              "z-index":0
                          };

                      var over = function () {
                              this.c = this.c || this.attr("fill-opacity");
                              this.attr("fill-opacity", 0);
                              this.defaultCss = S.merge(defaultCss, {"background-color":this.bg});
                              $(this.textVal).css(hoverCss);
                              this.other && this.other.attr("fill-opacity", 0);
                              this.other && $(this.other.textVal).css(hoverCss);
                              var y = this.getBBox().y2 + 1, x = this.xlinePos;
                              yShow(y);
                              this.closeX = this.closeX || getCloseLine(x);
                              xShow(this.closeX);
                          },
                          out = function () {
                              this.attr("fill-opacity", this.c);
                              $(this.textVal).css(this.defaultCss);
                              this.other && this.other.attr("fill-opacity", this.c);
                              this.other && $(this.other.textVal).css(this.defaultCss);
                              var y = this.getBBox().y2 + 1, x = this.xlinePos;
                              yHide(y);
                              this.closeX = this.closeX || getCloseLine(x);
                              xHide(this.closeX);
                          },
                          text = function (x, y, text, col) {
                              return htmlPaper.text(x, y, text).addClass('br-percent-text').css({"background":col, "color":"#fff"});
                          },
                          yShow = function (y) {
                              self.yLables[y].css(hoverLinerCss);
                              self.yLines[y].show();
                          },
                          xShow = function (x) {
                              self.xLables[x].css(hoverLinerCss);
                              self.xLines[x].show();
                          },
                          yHide = function (y) {
                              self.yLables[y].css(defaultLineCss);
                              self.yLines[y].hide();
                          },
                          xHide = function (x) {
                              self.xLables[x].css(defaultLineCss);
                              self.xLines[x].hide();
                          },
                          getCloseLine = function (x) {
                              var min = {};
                              S.each(self.xLables, function (item, index) {
                                  if (S.isEmptyObject(min) || Math.abs(index - x) < min.val) {
                                      min.val = Math.abs(index - x);
                                      min.i = index;
                                  }
                              })
                              return min.i;
                          },
                          getRandowColor = function (oldColor) {
                              var col = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6),
                                  defColor = {r:255, g:255, b:255},
                                  newColor = Raphael.getRGB(col),
                                  distance = 150;

                              var absR = newColor.r - oldColor.r,
                                  absG = newColor.g - oldColor.g,
                                  absB = newColor.b - oldColor.b;

                              if (Math.sqrt(absB * absB + absR * absR + absG * absG) < distance) {
                                  return col;
                              } else {
                                  arguments.callee(oldColor);
                              }
                          };

                      paper.lineWidth = 0.4;
                      S.each(self.paths, function (o) {
                          var path = [],
                              id = o[o.length - 1],
                              pos,
                              box;
                          S.each(o, function (val, key) {
                              val = val.split(':');
                              if (key == 0) {
                                  path.push('M' + val[1] + ',' + val[0]);
                              } else if (key == o.length - 1) {
                                  path.push(val[1] + ',' + val[0] + ' Z');
                                  pos = [val[1] - 0 + 100, val[0] - 0 + 20];
                              } else {
                                  var str = key == 1 ? 'L' : '';
                                  path.push(str + val[1] + ',' + val[0]);
                              }
                          });
                          path = path.join(' ');
                          paper.setStart();
                          //随机颜色
                          var color = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
                          var p = paper.path(path).attr({'stroke':"#000", 'fill':color, 'fill-opacity':0.2});
                          box = p.getBBox();
                          var posAr = [box.x, box.y, box.x2, box.y2].join('-');
                          if (!S.inArray(posAr, boxList)) {
                              boxList.push(posAr);
                          } else {
                              p.remove();
                              return;
                          }
                          p.xlinePos = box.x2;
                          var p1 = p.clone().translate(-(2 * box.x + box.width - width ), 0).rotate(180).scale(1, -1);
                          p1.xlinePos = p1.getBBox().x;
                          p.bg = color;
                          p1.bg = color;
                          box.x == width / 2 && (p.other = p1) && (p1.other = p);
                          var ps = paper.setFinish();
                          startY = box.height > 50 ? box.y + box.height * 0.75 * Math.random() : box.y;
                          if (box.width > 10) {
                              p.textVal = text(box.x2, startY, self.percentData[id] + "%", color);
                              p1.textVal = text(width - box.x2 - 50, startY, self.percentData[id] + "%", color);
                          }
                          ps.hover(over, out);
                      });
                  },
                  drawText:function (x, y, info) {
                      var self = this,
                          htmlpaper = self.getPaper();
                      htmlpaper.globalAlpha = 1;
                      htmlpaper.font = "20px Georgia";
                      htmlpaper.fillStyle = "#00adef";
                      htmlpaper.fillText(info.data + '%', x, y);
                  },
                  //x轴上 平行于y轴的网格线
                  drawGridsX:function () {
                      var self = this,
                          points = self._centerPoints;

                      for (var i = 0, len = points.length; i < len; i++) {
                          var grid = self.drawGridX(points[i]);
                          self._gridsX.push(grid);
                      }

                      return self._gridsX;
                  },
                  drawGridX:function (point, css) {
                      var self = this,
                          y = self._innerContainer.tl.y,
                          h = self._innerContainer.height,
                          css = css || self._cfg.xGrids.css,
                          paper = self.htmlPaper,
                          cls = self._cfg.themeCls + "-gridsx";

                      return paper.lineY(point.x, y, h).addClass(cls).css(self._cfg.xGrids.css);
                  },
                  drawGridY:function (point, css) {
                      var self = this,
                          w = self._innerContainer.width,
                          css = css || self._cfg.yGrids.css,
                          paper = self.htmlPaper,
                          cls = self._cfg.themeCls + "-gridsy";

                      return paper.lineX(point.x, point.y, w).addClass(cls).css(css);
                  },
                  //x轴
                  drawAxisX:function (x) {
                      var self = this,
                          htmlpaper = self.getPaper();

                      htmlpaper.lineWidth = 1;
                      htmlpaper.strokeStyle = 'rgb(190, 26, 100)';
                      htmlpaper.beginPath();
                      htmlpaper.moveTo(0, 0);
                      htmlpaper.lineTo(x, 0);
                      htmlpaper.stroke();
                  },
                  drawSplitLine:function (x, y) {
                      var self = this,
                          htmlpaper = self.getPaper();

                      htmlpaper.lineWidth = 1;
                      htmlpaper.strokeStyle = 'rgb(190, 26, 100)';
                      htmlpaper.beginPath();
                      htmlpaper.moveTo(x, 0);
                      htmlpaper.lineTo(x, y);
                      htmlpaper.stroke();
                  },
                  //y轴
                  drawAxisY:function (y) {
                      var self = this,
                          htmlpaper = self.getPaper();

                      htmlpaper.lineWidth = 1;
                      htmlpaper.strokeStyle = 'rgb(190, 26, 100)';
                      htmlpaper.beginPath();
                      htmlpaper.moveTo(0, 0);
                      htmlpaper.lineTo(0, y);
                      htmlpaper.stroke();
                  },
                  drawLabelsX:function () {
                      var self = this;
                      //画x轴刻度线
                      self.xLines = {};
                      self.xLables = {};
                      for (var i in self._pointsX) {
                          self._labelX[i] = self.drawLabelX(i, self._pointsX[i], i);
                      }
                  },
                  drawLabelsY:function () {
                      var self = this;
                      //画x轴刻度线
                      self.yLables = {};
                      self.yLines = {};
                      for (var i in self._pointsY) {
                          self._labelY[i] = self.drawLabelY(i, self._pointsY[i]);
                      }
                  },
                  //横轴标注
                  drawLabelX:function (index, x, i) {
                      var self = this,
                          paper = self.getHtmlPaper(),
                          cls = 'br-x-label',
                          text = self._cfg.xAxis.text;

                      self.xLines[x] = paper.lineY(x, 0, self._innerContainer.height).css({borderColor:"#FF3030", borderWidth:"3px"}).hide();
                      self.xLables[x] = paper.text(x, 0, '<span>' + text[index] + '</span>', "center"
                      ).addClass(cls + '-div');
                      self.xLables[x].children().addClass(cls);
                  },
                  //纵轴标注
                  drawLabelY:function (index, y) {
                      var self = this,
                          paper = self.htmlPaper,
                          cls = 'br-y-label',
                          text = self._cfg.yAxis.text;

                      if (text[index] != 0) {
                          self.yLines[y] = paper.lineX(0, y, self._innerContainer.width).css({borderColor:"#FF3030", borderWidth:"3px"}).hide();
                          self.yLables[y] = paper.text(20, y - 10, '<span>' + text[index] + '</span>', "center"
                          );
                          self.yLables[y].children().addClass(cls);
                      }
                  },
                  /**
                   渲染
                   @param clear 是否清空容器
                   **/
                  render:function (clear) {

                      var self = this,
                          _cfg = self._cfg,
                          themeCls = _cfg.themeCls,
                          w = self._innerContainer.width,
                          h = self._innerContainer.height;
                      //清空所有节点
                      clear && self._$ctnNode.html("");
                      //获取矢量画布
                      self.showPaper = Raphael(self._$ctnNode[0], w, h);

                      //渲染html画布
                      self.htmlPaper = new HtmlPaper(self._$ctnNode, {
                          clsName:themeCls
                      });

                      var id = S.guid() + '-canvas';
                      self.paper = $('<canvas></canvas>').attr({
                                                                   id:id,
                                                                   width:w,
                                                                   height:h
                                                               }).appendTo(self._$ctnNode)[0];

                      //绘制坐标轴
                      self.drawAxisX(w);
                      self.drawAxisY(h);
                      //画横轴刻度
                      _cfg.xLabels.isShow && self.drawLabelsX();
                      _cfg.yLabels.isShow && self.drawLabelsY();
                      _cfg.origin == 'mc' && self.drawSplitLine(w / 2, h);
                      // 绘制线框
                      self.drawLines();
                      //用canvas像素点寻找路径
                      self.formatCanvas();
                      //清空，拿到数据
                      self.clearCanvas(w, h);
                      //通过像素点取值
                      self.percentData = self.getPecentValue();
                      // 设置
                      self.renderData();
                      S.log(self);
                  },
                  clearCanvas:function (w, h) {
                      var self = this;
                      self.getPaper().clearRect(0, 0, w, h);
                  },
                  formatArea:function (item, index, lineWidth) {
                      var wAr = [], isArea = true, self = this;
                      S.each(item, function (pos) {
                          !wAr.length && wAr.push(pos);
                          wAr[wAr.length - 1] + 1 == pos && wAr.push(pos);
                      })
                      if (wAr.length > 1) {
                          var min = wAr[0], max = wAr[wAr.length - 1], lines = item.length / wAr.length, i = 1;
                          while (isArea) {
                              isArea = S.inArray(min + lineWidth * i, item) && S.inArray(max + lineWidth * i, item);
                              i++;
                          }
                          i--;
                          var o = calArea(min, max, i);
                          o.w > 5 && o.h > 5 && self.areaList[index].push(o);
                      }

                      function calArea(min, max, i) {
                          var width = lineWidth,
                              x,
                              y,
                              w,
                              h;

                          x = min % width;
                          y = parseInt(min / width);
                          w = max - min;
                          h = i;
                          return {
                              x:x, y:y, w:w, h:h
                          }
                      }
                  },
                  pathSearch:function (ar, x, y) {
                      var self = this,
                          direction = {
                              'r':[0, 1],
                              'b':[1, 0],
                              'l':[0, -1],
                              't':[-1, 0]
                          },
                          curPonit,
                          isFirst = true,
                          sPoints = [],
                          curD = null,
                          go = true,
                          path = [];

                      x = parseInt(x) || 0;
                      y = parseInt(y) || 0;

                      console.log(x + ' ' + y);
                      if (x == 0 && y == 0) {
                          self.points[x + ":" + y] = '-';
                      }
                      function canGo(a, b) {
                          var next, val;
                          if (next = getDirect(curD)) {
                              val = exsit(a, b, next);
                              if (val) {
                                  return val;
                              }
                          }
                          if (curD) {
                              val = exsit(a, b, curD)
                              if (val) {
                                  return val;
                              }
                          }
                          if (b == self.paper.width - 1) {
                              val = exsit(a, b, 'b');
                              if (val) {
                                  return val;
                              }
                          } else {
                              for (var i in direction) {
                                  val = exsit(a, b, i);
                                  if (val) {
                                      if (path.length && path.join(',').indexOf(val[0] + ':' + val[1]) != -1 && path[0].indexOf(val[0] + ':' + val[1]) == -1) {
                                          continue;
                                      }
                                      return val;
                                  }
                              }
                          }
                          return false;
                      }

                      function getDirect(r) {
                          if (!r) return false;
                          var o = ['r', 'b', 'l', 't'], re = false;
                          S.each(o, function (item, i) {
                              if (item == r) {
                                  re = o[(i + 1) % (o.length)];
                              }
                          });
                          return re;
                      }

                      function exsit(a, b, i) {
                          var x1 = a + direction[i][0],
                              y1 = b + direction[i][1];
                          if (ar[x1] && ar[x1][y1]) {
                              curD = i;
                              return[x1, y1, i];
                          }
                          return false;
                      }

                      function nextStartPoint(x, y) {
                          x -= 0;
                          y -= 0;
                          if (x == 0 && y != 0) {
                              y += 1;
                          } else if (x != 0 && y == 0) {
                              x += 1;
                          } else {
                              y += 2;
                          }
                          return {x:x, y:y};
                      }

                      if (x >= self.paper.height - 1 || y >= self.paper.width - 1) {
                          return;
                      }
                      while (go && (curPonit = canGo(x, y))) {
                          x = curPonit[0];
                          y = curPonit[1];
                          d = curPonit[2];
                          curPonit = curPonit.join(':');
                          if (S.inArray(curPonit, path)) {
                              go = false;
                          } else {
                              !sPoints.length && sPoints.push(curPonit);
                              sPoints[sPoints.length - 1].indexOf(d) == -1 ? sPoints.push(curPonit) : sPoints.splice(sPoints.length - 1, 1, curPonit);
                              path.push(curPonit);
                          }
                      }
                      console.log(sPoints);
                      if (!go && sPoints) {
                          self.paths.push(sPoints);
                          for (var i in sPoints) {
                              var t = sPoints[i].split(':'), id = t[0] + ':' + t[1];
                              !self.points[id] && i == 0 && (self.points[id] = '@');
                          }
                          console.log(S.JSON.stringify(self.points));
                          for (var j in self.points) {
                              if (self.points[j] == '@') {
                                  self.points[j] = '-';
                                  j = j.split(':');
                                  j = nextStartPoint(j[0], j[1]);
                                  arguments.callee.call(self, ar, j.x, j.y);
                              }
                          }
                      }
                  },
                  formatCanvas:function () {
                      var self = this,
                          paper = self.getPaper(),
                          origin = self._cfg.origin,
                          imgData = paper.getImageData(0, 0, self.paper.width, self.paper.height),
                          w = self.paper.width,
                          pixList = {},
                          index = 0;

                      self.areaList = {};

                      for (var i = 0; i < imgData.data.length; i += 4) {
                          if (Math.abs(190 - imgData.data[i]) < 5 && Math.abs(26 - imgData.data[i + 1]) < 5 && Math.abs(100 - imgData.data[i + 2]) < 5)
                              var t = parseInt(index / w), l = index % w;
                          !pixList[t] && (pixList[t] = {});
                          pixList[t][l] = 1;
                          index++;
                      }
                      if (origin == 'mc') {
                          var newList = {}, startCol = self.paper.width / 2;
                          S.each(pixList, function (item, l) {
                              newList[l] = {};
                              S.each(item, function (val, col) {
                                  col >= startCol && (newList[l][col] = val);
                              });
                          })
                          pixList = newList;
                      }
                      self.paths = [];
                      self.points = {};
                      var col = self._cfg.origin == 'mc' ? self.paper.width / 2 : 0;
                      var detectPoints = [], newPonits = [];
                      for (var i in self._points) {
                          var min = parseInt(self._points[i].y),
                              max = parseInt(self._points[i].y) + parseInt(self._points[i].h);
                          detectPoints.push(min);
                          detectPoints.push(max);
                      }
                      for (var i in detectPoints) {
                          !S.inArray(detectPoints[i], newPonits) && newPonits.push(detectPoints[i]);
                      }
                      newPonits.sort(function (a, b) {
                          return a > b;
                      });
                      for (var i in newPonits) {
                          self.pathSearch(pixList, newPonits[i], col);
                      }
                  },
                  getHtmlPaper:function () {
                      return this.htmlPaper;
                  },
                  getPaper:function () {
                      return this.paper.getContext('2d');
                  }
              })
              ;
              return areachart;
          },
          {
              requires:[
                  'base',
                  'gallery/kcharts/1.1/raphael/index',
                  'gallery/template/1.0/index',
                  './base',
                  '../tools/color/index',
                  '../tools/htmlpaper/index',
                  './theme',
                  '../tools/touch/index'
              ]
          }
)
;