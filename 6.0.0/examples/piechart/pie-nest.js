KISSY.use("kg/kcharts/6.0.0/piechart/index,kg/kcharts/6.0.0/tip/index",function(S,Pie,Tip){
	function pie1(){
		var tip
		function getTip(){
			if(!tip){
				tip = new Tip({rootNode:S.one('#J_Pie1')});
			}
			return tip;
		}

		var data = [
			{
				label:"需处理",
				data:[
					{
						label:"超区",
						data:1
					},{
						label:"无法联系买家",
						data:1
					},{
						label:"面单信息丢失",
						data:1
					}]
			},{
				label:"需安抚",
				data:[{
					label:"自提件",
					data:1
				},{
					label:"快递操作延时",
					data:1
				}]
			},{
				label:"需知晓",
				data:[
					{
						label:"快递操作延时",
						data:1
					},{
						label:"节假日",
						data:1
					},{
						label:"不可抗力",
						data:1
					}]
			}]

		var cfg = {
			data:data,
			color:{
				initial:"#f00"
			},
			renderTo:"#J_Pie1",
			cx:350,cy:150,
			rs:[60,80],
			interval:5,
			anim:{
				easing:'swing',
				duration:800
			}
		}

		var pie = new Pie(cfg)
			, ms = 200

		var prevset
			, prevsector
		function onclick(e){
			if(this.isRunning()){
				return;
			}
			var sector = e.sector
				, $path = sector.get("$path")
				, groupindex = sector.get('groupIndex')
				, donutindex = sector.get('donutIndex')
				, donut = S.indexOf(0,groupindex) == -1
				, set = sector.get('set')

				, middleangle = sector.get('middleangle')
				, angel = middleangle*Math.PI/180
				, unit = 10
				, x = unit*Math.cos(angel)
				, y = -unit*Math.sin(angel)

			if(donut){
				if(prevset){
					if(prevset == set){
						prevset.animate({transform:""},ms,function(){
							if(prevsector && prevsector == $path){
								$path.animate({transform:""},ms);
								prevsector = null;
							}else{
								$path.animate({transform:'t'+x+' '+ y},ms);
								prevsector = $path;
							}
						});
					}else{
						prevset.animate({transform:""},ms);
						prevset = null;
						if(prevsector && prevsector == $path){
							$path.animate({transform:""},ms);
							prevsector = null;
						}else{
							$path.animate({transform:'t'+x+' '+ y},ms);
							prevsector = $path;
						}
					}
				}else{
					if(prevsector){
						if(prevsector == $path){
							$path.animate({transform:''},ms);
							prevsector = null;
						}else{
							prevsector.animate({transform:''},ms);
							$path.animate({transform:'t'+x+' '+ y},ms);
							prevsector = $path;
						}
					}else{
						$path.animate({transform:'t'+x+' '+ y},ms);
						prevsector = $path;
					}
				}
			}else{
				if(prevsector){
					if(prevsector == $path){
						prevsector.animate({transform:""},ms);
						prevsector = null;
					}else{
						prevsector.animate({transform:""},ms);
						prevsector = $path
					}
				}
				if(prevset){
					if(prevset == set){
						prevset.animate({transform:""},ms);
						prevset = null;
					}else{
						prevset.animate({transform:""},ms);
						set.animate({transform:'t'+x+' '+ y},ms);
						prevset = set;
					}
				}else{
					set.animate({transform:'t'+x+' '+ y},ms);
					prevset = set;
				}
			}
		}
		pie.on("click",onclick);

		pie.on("labelclick",function(e){
			var sector = e.sector
			sector.fire("click");
		});

		pie.on("mouseover",function(e){
			var sector = e.sector
				, middlex = sector.get("middlex")
				, middley = sector.get("middley")
				, isleft = sector.get("isleft")
				, data = sector.get("framedata")
				, label = data.label
				, size = Pie.getSizeOf(label)
				, tip = getTip()
				, $tip = tip.getInstance()
				, groupindex = sector.get('groupIndex')
				, donutindex = sector.get('donutIndex')
				, donut = S.indexOf(0,groupindex) == -1
				, x
				, y

			if(!donut){
				tip.renderTemplate("{{label}}",{label:label});
				if(isleft){
					x = middlex - size.width - 10
				}else{
					x = middlex;
				}
				y=middley;
				tip.fire('move',{x:x,y:y});
			}
		});

		pie.on("mouseleave",function(){
			tip && tip.hide();
			prevset && prevset.animate({"transform":""},ms);
			prevsector && prevsector.animate({"transform":""},ms);
			prevset = null;
			prevsector = null;
		});

		pie.on("afterRender",function(e){
			// do sth
      // 画自定义的label
      customLabel(e);
		});

    function customLabel(e){
      var $sectors = pie.get("$sectors")
        , paper = pie.get("paper")

      S.each($sectors,function($sector){
        var i = $sector.get("groupIndex")
        if(i == 0){
          var x = $sector.get("sectorcx")
            , y = $sector.get("sectorcy")
          paper.text(x,y,Math.random().toFixed(2));
        }
      });
    }

	}
	pie1();
})