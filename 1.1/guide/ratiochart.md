# Ratio
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
//载入ratiochart
KISSY.use('gallery/kcharts/1.1/ratiochart/index', function(S, Ratio){
  new Ratio({
    container: '#J_column1',
    type: 1,
    styles: {
      containerStyles:{
        paddingTop: 100
      },
      itemStyles: {
        width: 950,
        height: 90,
        marginBottom: 20
      },
      titleStyles: {
        width: 120,
        height: 50,
        fontSize: 14
      },
      backStyles: {
        width: 700,
        height: 50,
        background: '#ccc'
      },
      frontStyles: {
        height: 50,
        background: '#3c89b5'
      },
      introStyles: {
        width: 400,
        height: 30,
        fontSize: 24,
        color: '#3c89b5'
      }
    },
    cols: [{
      title: {
        text: '男女通吃',
        html: '',
        styles: {

        }
      },
      graph: {
        per: 20,
        styles: {
          backgroundColor: '#f44'
        }
      },
      intro: {
        text: '20%',
        html: '',
        styles: {
          
        }
      }
      
    },{
      title: {
        text: '喜欢男人',
        html: '',
        styles: {

        }
      },
      graph: {
        per: 40,
        styles: {

        }
      },
      intro: {
        text: '40%',
        html: '',
        styles: {

        }
      }
      
    },{
      title: {
        text: '喜欢女人',
        html: '',
        styles: {

        }
      },
      graph: {
        per: 80,
        styles: {

        }
      },
      intro: {
        text: '80%',
        html: '',
        styles: {

        }
      }
      
    }]
  });
});
```

---
Config（详细配置）
---
### container  

{ id|HTMLElement } 容器 <span style='color:#f60'>注:容器必须要有width和height的绝对值</span>

### type

{ 1 | 2 } 1为颜色横条  2为小人形状

### containerStyles 

{ object } 容器样式 按照驼峰形势写 都可以识别

### itemStyles 

{ object } 每条横向条的样式 按照驼峰形势写 都可以识别

### titleStyles 

{ object } 每条标题样式 按照驼峰形势写 都可以识别

### backStyles

{ object } 背景色样式 按照驼峰形势写 都可以识别

### frontStyles

{ object } 前景色样式 按照驼峰形势写 都可以识别

### introStyles

{ object } 注视部分样式 按照驼峰形势写 都可以识别

### cols

{ array } 数据部分
```
   {
      title: {   //标题数据
        text: '男女通吃',  //文字
        html: '', //也可以自定义html
        styles: {
                //针对该条标题自定义样式
        }
      },
      graph: {
        per: 20,  //比例
        styles: {  //针对该条自定义样式
          backgroundColor: '#f44'   
        }
      },
      intro: {
        text: '20%',   //注视文字
        html: '',   //也可以自定义html
        styles: {
                //针对该条注视自定义样式 
        }
      }
  } 
```
