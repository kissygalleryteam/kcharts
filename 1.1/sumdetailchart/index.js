KISSY.add("gallery/kcharts/1.1/sumdetailchart/index",function(S, UA, Node, XTemplate,Raphael){
	var $ = Node.all;
	function SumDetail(Cfg){
		var self = this;
		self.init(Cfg);
	}

	S.augment(SumDetail, {
		version: "1.0",

		SVGTEMPLATE: {
			START: '<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">',
			END: '</svg>',
			CIRCLE: '<circle cx="{{cx}}" cy="{{cy}}" r="{{r}}" fill="{{style.background}}" style="position:absolute"/>',
			LINE: '<line x1="{{sx}}" y1="{{sy}}" x2="{{dx}}" y2="{{dy}}" style="background-color:{{style.borderColor}};position:absolute;stroke:{{style.borderColor}};stroke-width:{{style.borderWidth}}"/>',
			H1: '<text x="{{cx}}" y="{{cy}}" text-anchor="middle" fill="{{h1.color}}"><tspan font-weight="bold" font-size="{{h1.fontSize}}px">{{h1.text}}</tspan></text>',
			H2: '<text x="{{cx}}" y="{{cy+h2.fontSize*5/3}}" text-anchor="middle" fill="{{h2.color}}"><tspan font-weight="400" font-size="{{h2.fontSize}}px" font-family="Microsoft Yahei">{{h2.text}}</tspan></text>'
		},

		VMLTEMPLATE: {
			CIRCLE: '<v:roundrect style="'
					+'position:absolute;'
					+'display:block;'
					+'left:{{left}}px;'
					+'top:{{top}}px;'
					+'width:{{width}}px;'
					+'height:{{height}}px;"'
					+'fillcolor="{{style.background}}"'
					+'arcsize = ".5"'
					+'stroked="f"></v:roundrect>',
			//说明： ie8下from to 跟top left重叠
			LINE: '<v:line from="'
				  +'{{sx}}px,{{sy}}px" '
				  +'to="{{dx}}px,{{dy}}px" '
				  +'style="position:absolute;*top:{{top}}px;*left:{{left}}px;"'
				  +'stroke="true"'
				  +'strokecolor="{{style.borderColor}}"'
				  +'strokeweight="{{style.borderWidth}}px"></v:line>',
			H1: '<span style="display:block;position:absolute;width:{{2*r}}px;'
				+'top:{{h1tt}}px;left:{{h1tl}}px;font-size: {{h1.fontSize}}px;'
				+'font-weight: 700;color:{{h1.color}};text-align:center;">{{h1.text}}</span>',
			H2: '<span style="display:block;position:absolute;width:{{2*r}}px;'
				+'top:{{h2tt}}px;left:{{h2tl}}px;font-size: {{h2.fontSize}}px;'
				+'font-weight: 700;color:{{h2.color}};text-align:center;">{{h2.text}}</span>'
		},

		CONFIG : {

		},

		init: function(Cfg){
			var self = this;
			this.circles = [],
			this.lines = [],
			this.CONFIG = Cfg;
			if(UA.ie == 8){
				self.utils.fixIE8();
			}
			self.countCenter(Cfg);
			lines = self.CONFIG.lines;
			circles = self.CONFIG.circles;
			var	circle = self.drawCircle(circles);
			var line = self.drawLine(lines);
			var h1 = self.drawH1(circles);
			var h2 = self.drawH2(circles);
			self.paint(Cfg.container, line+circle+h1+h2);
		},

		utils: {
			//return y
			cos: function(r, deg){
				return r*Math.cos((deg/360)*2*Math.PI);
			},
			//return x
			sin: function(r, deg){
				return r*Math.sin((deg/360)*2*Math.PI);
			},
			fixIE8: function(){
				//ie 8中 vml 做了一些调成
				//http://louisremi.com/2009/03/30/changes-in-vml-for-ie8-or-what-feature-can-the-ie-dev-team-break-for-you-today/
				document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', '#default#VML');
			}
		},

		/**
		 * 对数据进行加工
		 * @return {[type]} [description]
		 */
		countCenter: function(){
			var self = this,
				circles = [],
				lines = [],
				cfg = self.CONFIG,
				r = cfg.r,
				meanDeg = cfg.meanDeg,
				startDeg = cfg.startDeg,
				nowDeg = cfg.startDeg;

			//lines
			for(var i = 0, l = cfg.son.length; i < l; i++){
				//根据度数计算
				cfg.son[i].cx = cfg.father.cx + self.utils.sin(r, nowDeg);
				cfg.son[i].cy = cfg.father.cy - self.utils.cos(r, nowDeg);
				nowDeg += meanDeg;
			}

			S.each(cfg.son, function(t){
				lines.push({
					sx: cfg.father.cx,
					sy: cfg.father.cy,
					dx: t.cx,
					dy: t.cy,
					top: cfg.father.cy >= t.cy ? t.cy : cfg.father.cy,
					left: cfg.father.cx >= t.cx ? t.cx : cfg.father.cx,
					style: {
						borderColor: cfg.lineStyle.borderColor,
						borderWidth: cfg.lineStyle.borderWidth
					}
				});
			});
			self.CONFIG.lines = lines;

			//text居中问题
			circles.push(cfg.father);
			circles = circles.concat(cfg.son);
			S.each(circles, function(c, i){
				c['h1tl'] = c.cx - c.r;
				c['h1tt'] = c.cy - c.h1.fontSize*4/5;
				c['h2tl'] = c.cx - c.r;
				c['h2tt'] = c.cy + c.h1.fontSize*4/5;
			});
			self.CONFIG.circles = circles;
		},

		/**
		 * draw circle []
		 * @param  {[number]} cx    圆点x轴
		 * @param  {[number]} cy    圆点y轴
		 * @param  {[number]} r     圆半径
		 * @param  {[object]} style 圆样式
		 * @return {[string]}    
		 */
		drawCircle: function(arr){
			var self = this;
				//初始化参数合法性检测
				render = '',
				svgcircle = self.SVGTEMPLATE.CIRCLE,
				vmlcircle = self.VMLTEMPLATE.CIRCLE;

			S.each(arr, function(obj){
				if(UA.ie < 9){
					var vmlobj = {
						left: obj.cx - obj.r,
						top: obj.cy - obj.r,
						width: 2*obj.r,
						height: 2*obj.r,
						style: obj.style
					};
					render += new XTemplate(vmlcircle).render(vmlobj);
				}else{
					render += new XTemplate(svgcircle).render(obj);
				}
			});

			return render;
		},

		/**
		 * draw line []
		 * @param  {[number]} sx    [start x]
		 * @param  {[number]} sy    [start y]
		 * @param  {[number]} dx    [end x]
		 * @param  {[number]} dy    [end y]
		 * @param  {[object]} style [style obj]
		 * @return {[string]}       [line string]
		 */
		drawLine: function(arr){
			var self = this,
				svgline = self.SVGTEMPLATE.LINE,
				vmlline = self.VMLTEMPLATE.LINE,
				//初始化参数合法性检测
				render = '';
			S.each(arr, function(obj){
				if(UA.ie < 9){
					render += new XTemplate(vmlline).render(obj);
				}else{
					render += new XTemplate(svgline).render(obj);
				}
			});
			
			return render;
		},

		drawH1: function(arr){
			var self = this,
				svgtext = self.SVGTEMPLATE.H1,
				vmltext = self.VMLTEMPLATE.H1,
				//初始化参数合法性检测
				render = '';
			S.each(arr, function(obj){
				if(UA.ie < 9){
					render += new XTemplate(vmltext).render(obj);
				}else{
					render += new XTemplate(svgtext).render(obj);
				}
			});
			
			return render;
		},
		drawH2: function(arr){
			var self = this,
				svgtext = self.SVGTEMPLATE.H2,
				vmltext = self.VMLTEMPLATE.H2,
				//初始化参数合法性检测
				render = '';
			S.each(arr, function(obj){
				if(UA.ie < 9){
					render += new XTemplate(vmltext).render(obj);
				}else{
					render += new XTemplate(svgtext).render(obj);
				}
			});
			
			return render;
		},

		/**
		 * paint circle graph
		 * @param  {[element]} container [description]
		 * @param  {[string]} str [description]
		 * @return {[type]}     [description]
		 */
		paint: function(container, str){
			var self = this,
				SVGTEMPLATE = self.SVGTEMPLATE,
				VMLTEMPLATE = self.VMLTEMPLATE,
				str = str || '',
				result = '';
			if(UA.ie < 9){
				result += str;
			}else{
				result = SVGTEMPLATE.START;
				result += str;
				result += SVGTEMPLATE.END;
			}
			if(UA.ie == 8){
				$(container).outerHTML = $(container).outerHTML;
			}
			$(container).html(result);

		},

		/**
		 * log
		 * @param  {[type]} msg [description]
		 * @return {[type]}     [description]
		 */
		log: function(msg){
			if(UA.ie < 7){

			}else{
				console.log(msg);
			}
		}
	});

	return SumDetail;
	
},{requires:[
	'ua',
	'node',
    'gallery/template/1.0/index',
	'../raphael/index'
]});