### rs
�뾶���������Ȧͼ�İ뾶Ϊ����

### data
��ʽΪǶ�׵��������ݣ�����
```
       [{
          color:"#78a5da",
          label:"Trident",
          data:3
        },{
          color:"#d26e6b",
          label:"Getko",
          data:3
        },{
          color:"#ffa2a2",
          label:"Chrome",
          data:4
        }]
```

ÿһ�����ݿ��԰���һ������

```javascript
{ 
  color:"#78a5da",
  sectorcfg:{
    "stroke":"yellow", // ���α߿���ɫ
	"stroke-width":2   // ���α߿���
  },
  label:"Trident",
  data:3
}
```

### anim
��������

 - `easing` {string} ����չ������Ч����ͬkissy�Ķ�������
 - `duration` {number} ����ʱ��

### interval
�༶���Ȧͼ֮��ļ����ֻ�����Ȧͼ��Ч����data����Ƕ��������Զ��������Ȧͼ��ʾ����demo/piechart/pie-nest.html

### padding
label�ͱ�ͼ֮ǰ�����

### labelfn
label���ɺ���

```
      labelfn:function(txt,sector,pie){
        var framedata = sector.get("framedata")
          , percent = (framedata.percent*100).toFixed(2)+"%"
        return txt+":<span class='kcharts-donut-percent'>"+percent+"</span>";
      }
```

### cx
��ͼ���ĵ�x

### cy
��ͼ���ĵ�y

### renderTo
��Ⱦ��������

### label
�Ƿ���ʾlabel��Ĭ����ʾ

### autoLabelPathColor label����·���Ƿ��Զ�ΪΪ���ε���ɫ

`true` or `false`

---
piechart ʵ������
---
### `cx`

### `cy` 

### `paper`
Raphael����

### `width`
���

### `height`
�߶�

### `container`
��ͼ���ڵ����� KISSY Node 

### `data`
piechart��Ӧ������

### `$sectors`
���е����� Ϊһ�� Raphael `set`

### `groups`
����Ƕ�׷��� Ϊһ�� Raphael `set`

### `set` 
����ͬ������ Ϊһ�� Raphael `set`


---
��������
---
### ��ȡ

��ͨ���������ε��¼����ܻ�ȡ�����ζ���
```javascript
pie.on("mouseenter",function(e){
   var sector = e.sector;
})
```

����ͨ�������piechart��������ȡ���е�����

sector������������

### `set`
������ζ�Ӧ�Ĵ�ֱ����

### `group`
������ζ�Ӧ��ˮƽ����

### `middleangle`
���εĽ�ƽ���߶�Ӧ�ĽǶ�

### `sectorcx`
���ε����ĵ������

### `sectorcy`
���ε����ĵ�������

### `start`
���ο�ʼ�Ƕ�

### `end`
���ν����Ƕ�

### `framedata`
���ζ�Ӧ������

### `middlex`
����������߽罻������

### `middley`
����������߽罻������

### `$path`
���ζ�Ӧ��·�� Ϊһ�� Raphael path����

---
label ����
---
### ��ȡ
```javascript

 pie.on("labelclick",function(e){
   var sector = e.label
 });
```
### `el`
label��Ӧ��HTMLԪ�� Ϊһ�� KISSY Node
### `x` 

### `y`

### `size`
label�Ĵ�С��Ϊһ�� object������width��height����

### `sector`
��Ӧ��sector

### `container`
����

---
�¼� Event 
---

### `mouseover`

```
pie.on('mouseover',function(e){
  // var sector = e.sector
  // sector.get("$path")
  // sector.get("middleangle") 
  // sector.get("middlex") 
  // sector.get("middley") 
  // sector.get("isleft")
  // sector.get("framedata")
  // sector.get("donutIndex")
  // sector.get("groupIndex")
});

```

### `mouseout`

### `click`

### `afterRender`

### `labelClick`
���labelʱ����

```
    pie.on("labelclick",function(e){
      var sector = e.sector
      sector.fire("click");
    });
```

### exmamples

 - ��ͨ��ͼ�����Ȧ��Ƕ�׵ı�ͼ examples/all.html
 - ������ֲ�ͼ examples/pie-browser.html
 
