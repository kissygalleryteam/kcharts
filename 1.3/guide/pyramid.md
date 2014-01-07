# Funnel
---
Demo
---
[pyramid](../demo/pyramid/demo1.html) 金字塔<br/>


---
代码示例
---
```

//载入Funnel
KISSY.use('gallery/kcharts/1.3/pyramid/index',function(S,Triangle){
        //数据格式
        var data=[
            {
                p:[0.75,'AAA','xxxx比'],
                d:[
                    [0.20,'T1'],
                    [0.18,'T2'],
                    [0.29,'T4']
                ]
            },
            {
                p:[0.25,'BBB','xxxx比'],
                d:[
                    [0.07,'T3'],
                    [0.20,'T2'],
                    [0.21,'T1'],
                    [0.15,'B2'],
                    [0.16,'B3'],
                    [0.13,'B5'] 
                ]
            }
        ];
        //容器id
        //三角形宽度
        //数据
        //高亮显示，true：上面高亮，false:下面高亮
        var triangle=new Triangle(id,width,data,isRed,color1,color2);
});
```

---
Config（详细配置）
---
###  

{ id }      容器

{ width }   三角形宽度

{data}      数据源

{isRed}     高亮显示部分，true：上面高亮，false:下面高亮

{color1}    上半个的颜色，有默认值

{color2}    下半个的颜色，有默认值





