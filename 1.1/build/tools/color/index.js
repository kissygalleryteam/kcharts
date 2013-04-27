KISSY.add('gallery/kcharts/1.1/tools/color/index',function(S){

	var Color = function(cfg){

		this.init(cfg);

	};

	//see http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color
	  function shadeColor(color, porcent) {
	    var R = parseInt(color.substring(1,3),16)
	    var G = parseInt(color.substring(3,5),16)
	    var B = parseInt(color.substring(5,7),16);

	    R = parseInt(R * (100 + porcent) / 100);
	    G = parseInt(G * (100 + porcent) / 100);
	    B = parseInt(B * (100 + porcent) / 100);

	    R = (R<255)?R:255;
	    G = (G<255)?G:255;
	    B = (B<255)?B:255;

	    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
	    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
	    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

	    return "#"+RR+GG+BB;
	  }
	
	S.augment(Color,{
		init:function(cfg){
			var themeCls = cfg && cfg.themeCls || "ks-chart-default";
				this._colors = this.colorCfg[themeCls] || this.colorCfg["ks-chart-default"];
				this.len = this._colors.length || 0;
		},
		colorCfg:{
			"ks-chart-default":[
									{DEFAULT:"#00adef",HOVER:"#1176ba"},
									{DEFAULT:"#8cc63e",HOVER:"#066839"},
									{DEFAULT:"#f7941d",HOVER:"#ef3e38"},
									{DEFAULT:"#ee217e",HOVER:"#cd7db2"},
									{DEFAULT:"#603814",HOVER:"#8a5e3b"},
									{DEFAULT:"#662e91",HOVER:"#492062"},
									{DEFAULT:"#bf1e2d",HOVER:"#ec1d23"}
								],

			"ks-chart-analytiks":[{DEFAULT:"#48BAF4",HOVER:"#48BAF4"},
							     {DEFAULT:"#ff7b6c",HOVER:"#ff7b6c"},
							     {DEFAULT:"#999",HOVER:"#999"},
							     {DEFAULT:"#c17e7e",HOVER:"#c17e7e"}],

			"ks-chart-rainbow":[
								{DEFAULT:"#4573a7",HOVER:"#5E8BC0"},
								{DEFAULT:"#aa4644",HOVER:"#C35F5C"},
								{DEFAULT:"#89a54e",HOVER:"#A2BE67"},
								{DEFAULT:"#806a9b",HOVER:"#9982B4"},
								{DEFAULT:"#3e96ae",HOVER:"#56AFC7"},
								{DEFAULT:"#d9853f",HOVER:"#F49D56"},
								{DEFAULT:"#808080",HOVER:"#A2A2A2"},
								{DEFAULT:"#188AD7",HOVER:"#299BE8"},
								{DEFAULT:"#90902C",HOVER:"#B7B738"},
								{DEFAULT:"#AFE65D",HOVER:"#C5ED89"}
								]				     


		},
		removeAllColors:function(){

			this._colors = [];

			return this._colors;

		},
		setColor:function(color){

			if(!color || !color['DEFAULT'] || !color['HOVER']){

				S.log('请设置正确的颜色参数，如：{DEFAULT:"#4573a7",HOVER:"#5E8BC0"}');

			}else{

				this._colors.push(color);

			}

		},
		getColor:function(index){
			return this._colors[index % this.len];
		},
		//获取一个区间的色组
		getColors:function(){
			var start = 0,
				self = this,
				colors = [],
				end;
			if(arguments[1]){
				start = arguments[0];
				end = arguments[1];
			}else{
				end = arguments[0];
			}
			for(var i = start;i < end - start ; i++){
				colors.push(self.getColor(i));
			}
			return colors;
		}
	});

	return Color;

});
