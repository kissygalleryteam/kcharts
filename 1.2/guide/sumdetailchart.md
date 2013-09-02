# SumDetail
---
代码示例
---
```
//配置kissy包路径
KISSY.config({
  packages:[
      {
        name:"gallery",
        path:"http://a.tbcdn.cn/s/kissy/"
      }
    ]
});
//载入sumdetailchart
KISSY.use('gallery/kcharts/1.2/sumdetailchart/index', function(S, SumDetail){
    new SumDetail({
        container: '#J_cicrle1', //容器
        r: 200, //中心圆的圆点到子圆的圆点的距离
        meanDeg: 60, //平均旋转度数
        startDeg: 30, //起始度数
        lineStyle: { //线条的样式
            borderColor: '#3c89b5',
            borderWidth: 3
        },
        father: { //中心圆配置项
            cx: 300, //圆点横坐标
            cy: 300, //圆点纵坐标
            r: 100, //半径
            style: {
                background: '#3c89b5'
            },
            h1: { //主标题
                text: '¥1257865',
                fontSize: 30,
                color: '#fff'
            },
            h2: { //副标题
                text: '成交总金额',
                fontSize: 18,
                color: '#fff'
            }
        },
        son: [{ //子圆配置项
            r: 60, //半径
            h1: {
                text: '10000',
                fontSize: 18,
                color: '#fff'
            },
            h2: {
                text: '成交件数',
                fontSize: 12,
                color: '#fff'
            },
            style: {
                background: '#3c89b5'
            }
        },{
            r: 60,
            h1: {
                text: '3786',
                fontSize: 18,
                color: '#fff'
            },
            h2: {
                text: '成交用户',
                fontSize: 12,
                color: '#fff'
            },
            style: {
                background: '#3c89b5'
            }
        },{
            r: 60,
            h1: {
                text: '57866',
                fontSize: 18,
                color: '#fff'
            },
            h2: {
                text: '成交订单数',
                fontSize: 12,
                color: '#fff'
            },
            style: {
                background: '#3c89b5'
            }
        }]
    });
});
```
