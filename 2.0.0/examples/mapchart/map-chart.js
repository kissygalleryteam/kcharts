(function (S) {
  S.use('gallery/kcharts/1.1/mapchart/index', function (S, MapChart) {
    var map = new MapChart('#demo1', {
      title: {
        content: "中国地图",
        css: {
          "font-size": "24px",
          "font-weight": "bold"
        }
      },
      autoRender: false,
      tip: {
        template: "Lv.{{rate}}",
        css: {border: "1px solid #666"}
      },
      cssGroup: {
        style1: {
          attr: {
            "fill": "#8cc63e",
            "stroke": "#ffffff",
            'stroke-width': 3
          },
          hoverAttr: {
            "fill": "#066839"
          }
        },
        style2: {
          attr: {
            "fill": "#00adef"
          },
          hoverAttr: {
            "fill": "#1176ba"
          }
        },
        style3: {
          attr: {
            "fill": "#bf1e2d",
            "stroke": "#ffffff",
            'stroke-width': 3
          },
          hoverAttr: {
            "fill": "#ec1d23"
          }
        },
        defaultCls: "style1"
      },
      series: {
        "xizang": {
          groupKey: 'style2',
          rate: 4
        },
        "guizhou": {
          rate: 4
        },
        "fujian": {
          groupKey: 'style3',
          rate: 6
        },
        "chongqing": {
          rate: 4
        },
        "sichuan": {
          groupKey: 'style3',
          rate: 6
        },
        "shanghai": {
          groupKey: 'style2',
          rate: 4
        },
        "jiangsu": {
          rate: 4
        },
        "zhejiang": {
          rate: 4
        },
        "shanxi": {
          rate: 3
        },
        "neimongol": {
          groupKey: 'style2',
          rate: 6
        },
        "tianjin": {
          groupKey: 'style3',
          rate: 6
        },
        "hebei": {
          rate: 3
        },
        "beijing": {
          groupKey: 'style2'
        },
        "anhui": {
          rate: 3
        },
        "yunnan": {
          rate: 4
        },
        "jiangxi": {
          rate: 3
        },
        "shandong": {
          groupKey: 'style2'
        },
        "henan": {
          rate: 2
        },
        "hunan": {
          rate: 3
        },
        "guangxi": {
          groupKey: 'style3,rate:6'
        },
        "guangdong": {
          rate: 2
        },
        "hainan": {
          groupKey: 'style3',
          rate: 6
        },
        "xinjiang": {
          groupKey: 'style2',
          rate: 6
        },
        "ningxia": {
          rate: 3
        },
        "qinghai": {
          rate: 6
        },
        "gansu": {
          rate: 3
        },
        "shaanxi": {
          rate: 3
        },
        "heilongjiang": {
          rate: 3
        },
        "jilin": {
          rate: 3
        },
        "liaoning": {
          rate: 3
        },
        "hubei": {
          rate: 3
        }
      }
    });
    map.on('over', function (d) {
      S.log(d[0]);
    });
    map.render();
  });

})(KISSY);