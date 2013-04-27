KISSY.add('gallery/kcharts/1.0/tip/index',function(S,Template){

	var $ = S.all,
		idPrefix = "J_tip_";

	var Tip = function(cfg){

		var self = this,

			defaultCfg = {
				clsName:"ks-chart-default",
				autoRender:true,
				isVisable:false,
				boundry:{		//tip的移动区域
					x:0,
					y:0,
					width:0,
					height:0
				},
				rootNode:$("body"),
				tpl:"",
				anim:{
					easing:"easeOut",
					duration:0.3
				},
				offset:{
					x:0,
					y:0
				},
				alignX:"left",	//left center right
				alignY:"top"	//top middle bottom
			};

		self._cfg = S.mix(defaultCfg,cfg);

		self.init();

	};

	S.augment(Tip,{

		init:function(){

			var self = this,
				_cfg = self._cfg;

			self._data = {};

			self._tpl = _cfg.tpl;

			self.$tip; 

			self._guId = Math.round(Math.random() * 100000000);

			if(_cfg.autoRender){

				self.render();

			}

		},

		getInstance:function(){

			return this.$tip;

		},

		isVisable:function(){

			return this.$tip.css("display") == "none" ? false : true;

		},

		show:function(){

			var self = this;

			self.$tip && self.$tip.show();

			return self;

		},

		hide:function(){

			var self = this;

			self.$tip && self.$tip.stop() && self.$tip.hide();

			return self;

		},
		moveTo:function(x,y){

			var self = this;

			self.show();

			var	$tip = self.getInstance(),
				anim = self._cfg.anim,
				pos = self.getPos(x,y);

			$tip.css({
					"margin-top":pos.y,
					"margin-left":pos.x
			});

		},
		animateTo:function(x,y,callback){

			var self = this;

			self.show();

			var	$tip = self.getInstance(),
				anim = self._cfg.anim,
				pos = self.getPos(x,y);

				$tip.stop().animate({
					"margin-top":pos.y,
					"margin-left":pos.x
				}
				,anim.duration
				,anim.easing
				,function(){
					callback && callback();
				});

		},

		renderTemplate:function(tpl,data){

			var self = this,
				tipId = idPrefix+self._guId;

			$("#"+tipId).html(Template(tpl).render(data));

		},
		getPos:function(x,y){

			var	self = this,
				_cfg = self._cfg,
				offset = _cfg.offset,
				marginTop = y + offset.y,
				marginLeft = x + offset.x,
				alignX = _cfg.alignX,
				alignY = _cfg.alignY,
				$tip = self.getInstance(),
				width = $tip.outerWidth(),
				height = $tip.outerHeight(),
				boundry = _cfg.boundry;

			switch(alignX){
				case "center":
					marginLeft = Math.round(x) + offset.x - width/2;
					break;
				case "right" :
					marginLeft =  Math.round(x) + offset.x - width;
					break;
			}
			switch(alignY){
				case "middle":
					marginTop = Math.round(y) + offset.y - height/2;
					break;
					
				case "bottom" :
					marginTop =  Math.round(y) + offset.y - height;
					break;
			}

			if(boundry.width && boundry.height){

				var x = boundry.x || 0,
					y = boundry.y || 0,
					w = boundry.width,
					h = boundry.height;

				marginTop = marginTop < y ? y : marginTop;

				marginTop = marginTop > y + h ? y + h : marginTop; 

				marginLeft = marginLeft < x ? x : marginLeft;

				marginLeft = marginLeft > x + w ? x + w : marginLeft;


			}
			
			return {x:marginLeft,y:marginTop};

		},

		_isExist:function(){

			return $("#"+idPrefix + this._guId)[0];

		},

		render:function(){

			var self = this,
				_cfg = self._cfg,
				_tpl = self._tpl,
				_data = self._data,
				display = _cfg.isVisable ? "inline-block" : "none",
				tipId = idPrefix+self._guId,
				rootNodeOffset = _cfg.rootNode.offset();

			!self._isExist() && $('<span class="'+_cfg.clsName+'-tip" id='+tipId+' style="*zoom:1;"></span>')
			.css({"display":display})
			.appendTo(_cfg.rootNode);

			$("#"+tipId)
			.css({
				"margin-top":rootNodeOffset.top + _cfg.offset.y,
				"margin-left":rootNodeOffset.left + _cfg.offset.x,
				"position":"absolute"
			})
			.html(Template(_tpl).render(_data));

			self.$tip = $("#"+tipId);

			return self.$tip;

		}


	});



	return Tip;

},{requires:['gallery/template/1.0/index','./assets/tip.css']})
