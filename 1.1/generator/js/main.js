/*
	TODO	构造overlay 
			图表类型选择
			调用不同图表的生成器模块
*/
;KISSY.add(function(S,Base,Overlay){
	var $ = S.all,IO = S.io;
	function Main(){
		this.init();
	}
	S.extend(Main,Base,{
		init:function(){
			var self = this;
			self.bindEvt();

		},
		initOverlay:function(){
			var self = this;
			self.overlay = self.overlay || new Overlay.Dialog({
				elStyle:{
	                border:"2px solid gray",
	                lineHeight:0,
	                background:"#fff"
	            },
	            width:800, //配置高和宽
	            height:600
			});
			self.overlay.center();
			self.overlay.show();
		},
		bindEvt:function(){
			var self = this;
			$(".kc-gen-to-add").on("click",function(e){
				e.preventDefault();
				//选择哪种图表
				self.initOverlay();
			});
		}
	})
	return Main;
},{requires:['base','overlay']});