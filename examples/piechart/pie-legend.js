KISSY.use("kg/kcharts/2.0.0/piechart/index", function (S, Pie) {
	function pie1() {
		var data = [{
			label: "Chrome",
			data: 1
		}, {
			label: "FireFox",
			data: 2
		}, {
			label: "IE",
			data: 3
		}, {
			label: "Opera",
			data: 4
		}, {
			label: "Safari",
			data: 5
		}];

		var cfg = {
			data: data,
			color: {
				initial: "#f00"
			},
			renderTo: "#J_Pie1",
			cx: 350,
			cy: 150,
			rs: 80,
			interval: 5,
			anim: {
				easing: 'swing',
				duration: 800
			},
			"legend": {
				align: "rm", //t r b l
				offset: [45, 0],
				globalConfig: {
					icontype: "circle",
                    iconsize:[1,1],
					interval: 20, //legend之间的间隔
					iconright: 4, //icon后面的空白
					showicon: true //默认为true. 是否显示legend前面的小icon——可能用户有自定义的需求
				},
        alignhook:function(config,index){//每次绘制icon 和 文本的时候调用，用于动态调整配置
          // config = {
          //   icontype:icontype,
          //   iconsize:iconsize,
          //   iconright:iconright
          // }
          if(index>2){
            config.icontype = "triangle";
            config.iconsize = [2,2];
            config.iconright = 0;
          }
          return config;
        },
				spanAttrHook: function (index) { //每次绘制“文本描述”的时候调用，返回span的样式
					return {
						color: "#333"
					}
				},
				anim: {
					easing: "swing",
					duration: 800
				}
			}
		}

		var pie = new Pie(cfg),
				ms = 600

		function enter(e) {
			var sector = e.sector,
			    set = sector.get('set'),
					middleangle = sector.get('middleangle'),
			    angel = middleangle * Math.PI / 180,
					cx = this.get("cx"),
			    cy = this.get("cy"),
					unit = 10,
			    x = unit * Math.cos(angel),
					y = -unit * Math.sin(angel)
			set.stop().animate({
				transform: 's1.1 1.1 ' + cx + ' ' + cy
			}, ms, 'elastic')
		}

		function leave(e) {
			var sector = e.sector,
					set = sector.get('set')
			set.stop().animate({
				transform: ""
			}, ms, "elastic")
		}

		pie.on("mouseover", enter);
		pie.on("mouseout", leave);

		pie.on("afterRender", function () {
			// do sth
		});

		pie.on("afterLegendRender", function () {
			var legend = pie.get("legend"),
			    $sectors = pie.get("$sectors")
			legend.on("click", function (e) {
				var $icon = e.icon,
						$text = e.text,
				    index = e.index

				var $sector = $sectors[index]
          , framedata = $sector.get("framedata")
				  , hide = framedata.hide
					, evt
        framedata.hide = !hide;
        if(framedata.hide){
          $icon.attr("fill","#ccc");
        }else{
          //restore color
          var $path = $sector.get("$path");
          $icon.attr("fill",$path.attr("fill"));
        }
        pie.adjust();
			});
		});
	}
	pie1();
})