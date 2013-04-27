/**
 * 占比图组件
 * @author  飞长 <veryued@gmail.com>
 * @date    2012-12-26
 */
KISSY.add('gallery/kcharts/1.1/ratiochart/index', function(S, UA, Node, XTemplate){
	var $ = Node.all;
	function Ratio(Cfg){
		var self = this;
		self.init(Cfg);
	}

	S.augment(Ratio, {

		version: "1.0",

		CONFIG : {},

		TEMPLATE: {
			START: '<div style="{{containerStyles}}">',
			END: '</div>',
			PERSON: '',
			ITEM: '<div style="overflow:hidden;position: relative; {{itemStyles}}">'
					+'<div style="float:left;text-align:center; {{titleStyles}}">'
					+'{{titleHTML}}'
					+'</div>'
					+'<div style="float:left;position: relative;">'
						+'<div style="{{backStyles}} position: absolute; top:0;left:0;"></div>'
						+'<div style="{{frontStyles}} position: absolute; top:0;left:0;"></div>'
					+'</div>'
					+'<div style="position: absolute; top:0;left:0; {{introStyles}}">'
					+'{{introHTML}}'
					+'</div>'
				  +'</div>',
			ITEM2: ''

		},

		init: function(Cfg){
			var self = this;
			this.CONFIG = Cfg;
			self.countCenter();
			var col = self.drawCol(self.CONFIG.colsData);
			self.paint(Cfg.container, col);
		},

		/**
		 * 对数据进行加工
		 * @return {[type]} [description]
		 */
		countCenter: function(){
			var self = this,
				cols = [],
				containerStyles = '';
				cfg = self.CONFIG,

				cs = cfg.styles.containerStyles, //容器样式
				is = cfg.styles.itemStyles,  //每个横行item 样式
				ts = cfg.styles.titleStyles, //标题样式
				bs = cfg.styles.backStyles, //背景条样式
				fs = cfg.styles.frontStyles, //前景条样式
				ins = cfg.styles.introStyles; //介绍信息样式

			S.each(cfg.cols, function(c){
				var wrap = '',
					item = '',
					title = '',
					back = '',
					front = '',
					intro = '',

					person = ''; //第二种小人类型用

				//通用样式设置
				for(var key in cs){
					wrap += self.utils.parseCssName(key, cs[key]);
				}
				for(var key in is){
					item += self.utils.parseCssName(key, is[key]);
				}
				title += 'line-height: '+ts.height+'px;';
				for(var key in ts){
					title += self.utils.parseCssName(key, ts[key]);
				}
				for(var key in bs){
					back += self.utils.parseCssName(key, bs[key]);
				}
				front += 'width:'+bs.width*c.graph.per/100+'px;';
				for(var key in fs){
					front += self.utils.parseCssName(key, fs[key]);
				}
				intro += 'top: '+(bs.height+10)+'px; left: '+ts.width+'px;';
				for(var key in ins){
					intro += self.utils.parseCssName(key, ins[key]);
				}
				//个性样式设置
				for(var key in c.title.styles){
					title += self.utils.parseCssName(key, c.title.styles[key]);
				}
				for(var key in c.graph.styles){
					front += self.utils.parseCssName(key, c.graph.styles[key]);
				}
				for(var key in c.intro.styles){
					intro += self.utils.parseCssName(key, c.intro.styles[key]);
				}

				cols.push({
					containerStyles: wrap,
					itemStyles : item,
					titleStyles: title,
					backStyles : back,
					frontStyles : front,
					introStyles: intro,
					titleHTML : c.title.text,
					introHTML : c.intro.text,
					person: c.graph.per * 20/100
				});
			});
			for(var key in cs){
				containerStyles += self.utils.parseCssName(key, cs[key]);
			}
			self.TEMPLATE.PERSON = '<div style="height: '+fs.height+'px; width: 12px;float:left; margin-right:15px; background:url(http://img04.taobaocdn.com/tps/i4/T1vUQ1XkJbXXcJuKk.-12-32.gif) 0 '+(fs.height-32)/2+'px no-repeat;"></div>';
			self.CONFIG.colsData = cols;
			self.CONFIG.containerStyles = containerStyles;
		},

		drawCol: function(arr){
			var self = this,
				type = self.CONFIG.type,
				item = (type == 1) ? self.TEMPLATE.ITEM : self.TEMPLATE.ITEM2,
				render = '';

			S.each(arr, function(obj){
				if(type == 2){
					var l = obj.person, p = self.TEMPLATE.PERSON, str = '';
					while(l>0){
						str += p;
						l--;
					}
					self.TEMPLATE.ITEM2 =
						'<div style="overflow:hidden;position: relative; {{itemStyles}}">'
						+'<div style="float:left;text-align:center; {{titleStyles}}">'
						+'{{titleHTML}}'
						+'</div>'
						+'<div style="float:left;position: relative;overflow:hidden;">'
							+ str
						+'</div>'
						+'<div style="position: absolute; top:0;left:0; {{introStyles}}">'
						+'{{introHTML}}'
						+'</div>'
					  +'</div>';

					render += new XTemplate(self.TEMPLATE.ITEM2).render(obj);
				}else{
					render += new XTemplate(self.TEMPLATE.ITEM).render(obj);
				}
				

			});

			return render;
		},

		utils: {
			parseCssName: function(key, value){
				var re = /[A-Z]/,k,
					px = 'px';
				if(key.match(/[A-Z]/)){
					k = key.replace(re, "-"+(key.match(/[A-Z]/).toString()).toLowerCase());
					return ''+k+': '+value+(isNaN(value) ? '' : 'px')+';';
				}else{
					return ''+key+': '+value+ (isNaN(value) ? '' : 'px') + ';';

				}
			}
		},
		
		paint: function(container, str){
			var self = this,
				TEMPLATE = self.TEMPLATE,
				str = str || '',
				result = '';
				result = new XTemplate(TEMPLATE.START).render(self.CONFIG);
				result += str;
				result += TEMPLATE.END;
			$(container).html(result);
		}
	});

	return Ratio;

}, {
	requires: ['ua', 'node', 'xtemplate']
});
