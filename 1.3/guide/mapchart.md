#MapChart
---
Demo
---
[有tip](../demo/mapchart/demo1.html) <br/>
[最简配置](../demo/mapchart/demo2.html) <br/>
[配色](../demo/mapchart/demo3.html) <br/>
[模拟hover](../demo/mapchart/demo4.html) <br/>
[省县市](../demo/mapchart/demo5.html) <br/>
---
代码示例
---
    KISSY.config({
      packages:[
    		{
    			name:"gallery",
    			path:"http://a.tbcdn.cn/s/kissy/"
    		}
    	]
    });
    KISSY.use('gallery/kcharts/1.3/mapchart/index',function (S, MapChart) {
    	new MapChart('#demo1', {
    		tip:{
    			template:"Lv.{{rate}}",
    			css:{border:"1px solid #666"}
    		},
    		cssGroup:{
    			style1:{
    				attr:{
    						"fill":"#8cc63e", "stroke":"#ffffff",
    						'stroke-width':3
                        },
    					hoverAttr:{
    						"fill":"#066839"
    					}
    			}
    		},
    		series:{
    				"xizang":{groupKey:'style2', rate:4},
    				"guizhou":{rate:4},
    				"fujian":{groupKey:'style3',rate:6}
    			}
    		});
    	});

---
Config(详细配置)
---
### container
{ HTMLElement | selector }容器（和kissy选择器一致,width和height可以是绝对或者相对值）
### autoRender
{ boolean } 是否自动渲染 如果为手动 则需要调用 render()方法
### themeCls
{ string } 主题className 默认："ks-chart-default"
### areaText
{ object }地图省市名称样式 如果不设置，默认为themeCls里面配置

    css: {
	    "font-size": "12px",
	    "color": "pink",
	    "font-weight": "normal",
	    "display": "block",
	    "cursor": "pointer"
    },
    hoverCss: {
    }

### area
{ object }地图省市区域样式 如果不[设置](http://raphaeljs.com/reference.html#Element.attr "raphaeljs样式")，默认为themeCls里面配置

	attr: {
        "fill": "#5BBFFD",
        "stroke": "#fff",
		"stroke-width": 1,
		"stroke-linejoin": "round",
         "stroke-opacity": 0.25
    },
	hoverAttr: {
		"fill": "#aaabfe",
		"cursor": "pointer"
    }


### title
{object} 主标题 默认展示

   - `isShow` { boolean } 是否渲染显示
   - `css` { object } css样式
   - `content` { string } 内容 可以是html或者text文本

### tip

  {object} 数据提示层配置 默认展示

   - `isShow` { boolean } 是否渲染tip
   - `template` { string } 文本或者是模板 详见KISSY.Template
   - `css` { object } css样式 }

### cssGroup

  {object}各省区块样式配置（有些场景需要把全国划分成几个颜色），不配置就默认为**area**的属性，我要[配置](http://raphaeljs.com/reference.html#Element.attr "raphaeljs样式")

	// 组名
	style1:{
		attr:{
			"fill":"#8cc63e", "stroke":"#ffffff",
			'stroke-width':3
		},
				//hover样式
		hoverAttr:{
			"fill":"#066839"
		}
	}，
	// 组名
  	style2:{
		attr:{
			"fill":"#8cc63e", "stroke":"#ffffff",
			'stroke-width':3
		},
		//hover样式
		hoverAttr:{
			"fill":"#066839"
		}
	}，
	//默认样式
	defaultCls：style1

###series

{array} tip中展示的数据

		series:{
				"xizang":{groupKey:'style2', rate:4},
				"guizhou":{rate:4},
				"fujian":{groupKey:'style3',rate:6}
			}

把要展示数据的省份放在series里面，这里的数据会和tip里的template配合用，当然你还可以指定某个省份的样式，在这里设置groupKey,要确保groupKey的值已经定义过了，没定义会默认为**defaultCls**

---
Method（方法）
---
### render()
渲染地图

---
Event（事件）
---

### afterRender
渲染完毕后

### over
进入地图，参数是省份名称

### move
在地图上移动，参数是省份名称

### out
离开地图，参数是省份名称

*友情提示:请在render之前绑定事件*

---
如果有问题请联系兰七

*稍候会支持全国省市县地图定位，敬请期待*
