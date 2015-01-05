# Radar
---
Demo
---
[KCharts首页](http://www.kcharts.net) 

# properties

## renderTo
  渲染到的dom元素，比如#J_Radar

## width
  雷达图宽度宽度，未设置的话，自适应

## height
  雷达图宽度高度，未设置的话，自适应

## cx 
  中心点横坐标

## cy
  中心点纵坐标

## r
  雷达图半径

## max 
  最大值

## labels
  雷达图标注

## scoreGroups
  数据分组，格式为
  
  ```
  [{title: "Real Madrid C.F.", scores: [ 8, 9, 7, 9, 7, 6]},{title: "FC Barcelona", scores: [ 10, 7, 10, 7, 6, 8]}]
  ```
  
  每个数据项可以进一步配置
  
  ```
  {
    title: "Real Madrid C.F.",
      scores: [ 8, 9, 7, 9, 7, 6],
      draw_options: {
        lines: {'stroke-width':'4','stroke':'#0070bb','stroke-opacity':0.7,'fill':'#f7d2a8','fill-opacity':0.6},
        points: {'fill':'#f05a23','stroke-width':'1.5','stroke':'#333', 'size': 6}
      }
  }
  ```
## legend
  标注配置，比如:

  ```
  legend:{
    globalConfig:{
      iconsize:[2,2],
      icontype:"circle"
    }
  }
  ```

## options
  绘制选项


# method

## render
  绘制雷达图



