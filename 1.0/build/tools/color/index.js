KISSY.add('gallery/kcharts/1.0/tools/color/index',function(S){

	var Color = function(){

		this._init();

	};

	S.augment(Color,{
		_init:function(){
			this.len = this._colors.length || 0;
		},
		_colors:[
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
		],
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
		}
	});

	return Color;

});
