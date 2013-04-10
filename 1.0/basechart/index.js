/*
TODO 坐标运算  画布大小计算
	
*/
KISSY.add('gallery/kcharts/1.0/basechart/index',function(S,Base){

	var $ = S.all;

	var BaseChart = function(){

	};

	S.extend(BaseChart,Base,{

		init:function(cfg){

			var self = this,
				_cfg;
				
			if(cfg && cfg.renderTo){

				_cfg = self._cfg = S.mix({
					zIndex:0,
					yAxis:{

              		},
					canvasAttr:{x:60,y:60},
					defineDataKey:{

					}
				},cfg);

				self._$ctnNode = $(cfg.renderTo);

				self.getInnerContainer();

				S.mix(self,{
					_datas:{
						cur:{},
						total:{}
					},
					_points:{},
					_centerPoints:[],
					_pointsX:[],
					_pointsY:[],
					_gridsX:[],
					_gridsY:[],
					_stocks:[],
					_areas:[],
					_axisX:null,
					_axisY:null,
					_labelX:[],
					_labelY:[],
					_evtEls:[],
					_multiple :false
				});


				if(!_cfg.series || _cfg.series.length <= 0 || !_cfg.series[0].data) return;

				_cfg.series.length > 1 ? self._multiple = true : undefined;

				for(var i in _cfg.series){

					self._datas['total'][i] = {index:i,data:_cfg.series[i].data};

					self._datas['cur'][i] = {index:i,data:_cfg.series[i].data};

				}

				self.dataFormat();

			}

		},
		//减少当前的数据
		removeData:function(index){

			var self = this;

			delete self._datas['cur'][index];

			self.dataFormat();

		},
		//恢复数据
		recoveryData:function(index){

			var self = this;

			self._datas['cur'][index] = self._datas['total'][index];

			self.dataFormat();

		},
		getInnerContainer:function(){

			var self = this,
				_$ctnNode = self._$ctnNode,
				canvasAttr = S.mix(self._cfg.canvasAttr),
				innerWidth = canvasAttr.width || (_$ctnNode.width() - 2 * canvasAttr.x),
				innerHeight = canvasAttr.height || (_$ctnNode.height() - 2 * canvasAttr.y),
				x = canvasAttr.x,
				y = canvasAttr.y,
				width = innerWidth,
				height = innerHeight,
				tl = {x:x,y:y},
				tr = {x:x+innerWidth,y:y},
				bl = {x:x,y:y+height},
				br = {x:x+innerWidth,y:y+height};
				//内部容器的信息
				self._innerContainer = {
					x:x,
					y:y,
					width:width,
					height:height,
					tl:tl,
					tr:tr,
					bl:bl,
					br:br
				};

				return self._innerContainer;

		},
		//计算坐标刻度
		dataFormat:function(){

			var self = this,
				_cfg = self._cfg;

			var _allDatas = [];

				for(var i in self._datas['cur']){

					var numbers = self.getArrayByKey(self._datas['cur'][i]['data'],_cfg.defineKey.y);

						_allDatas.push(numbers.join(","));

				}

				_allDatas = _allDatas.join(",").split(",");
			
			var	ictn = self._innerContainer,
				x = ictn.x,
				y = ictn.y,
				width = ictn.width,
				height = ictn.height,
				num = _cfg.yAxis.num || 5,
				_max = Math.max.apply(null,_allDatas),
				_min = Math.min.apply(null,_allDatas),
				offset = (_max - _min) * 0.1,
				max = _cfg.yAxis.max || _cfg.yAxis.max == 0 ? _cfg.yAxis.max : _max + offset,
				min = _cfg.yAxis.min || _cfg.yAxis.min == 0 ? _cfg.yAxis.min : _min - offset,
				//获取刻度 从定义刻度中获取 
				coordNum = self.coordNum = self.getScales(max,min,num),
				//刻度值转换成图上的点
				coordPos = self.data2GrapicData(coordNum);

			self._pointsY = [];

			self._centerPoints = [];

			self.data2GrapicData(coordPos);

			for(var i in coordPos){

				self._pointsY[i] = {number:coordNum[i] + "",y:coordPos[i],x:x};

			}

			for(var i in self._datas['cur']){

				self._points[i] = self.getDataPoints(self._datas['cur'][i]['data']);

			}

			if(self._points[0] && self._points[0].length > 1){

				var	_offset = _offset ? _offset : self._points[0][1].x - self._points[0][0].x;

				for(var i in self._points[0]){

					self._centerPoints[i] = {x:self._points[0][i].x - _offset/2,y:0};

				}

				self._centerPoints.push({x:self._points[0][_cfg.xAxis.text.length - 1].x - (-_offset/2),y:0});

			}

		},
		//将数据转化为图上坐标
		data2GrapicData:function(data){

			if(!data) return;

			var self = this,
				ictn = self._innerContainer,
				y = ictn.y,
				height = ictn.height,
				//坐标刻度的最大值
				max = Math.max.apply(null,self.coordNum),
				min = Math.min.apply(null,self.coordNum),
				tmp = [];
				//如果是数组
				if(data.length){

					for(var i in data){

						tmp.push(height * (1 - (data[i] - min)/(max - min)) + y);

					}

					return tmp;

				}else{

					return height * (1 - (data - min)/(max - min)) + y;

				}

		},
		/*
			TODO 获取一条线上的等分点坐标
			@param sx {Integer|Float}起点横坐标
			@param sy {Integer|Float}起点纵坐标
			@param ex {Integer|Float}终点横坐标
			@param ey {Integer|Float}终点纵坐标
			@param num {Integer}等分数
			@param e {Boolean}是否包含两端坐标
			@return {Array}
		*/
		getSplitPoints:function(sx,sy,ex,ey,num,e){

			var ox = (ex - sx) / num,
				oy = (ey - sy) / num,
				array = [];

			e && array.push({x:sx,y:sy});

			for(var i = 0; i < num - 1 ; i ++){

				array.push({x:sx + (i+1) * ox,y:sy + (i+1) * oy});

			}

			e && array.push({x:sx,y:sy});

			return array;

		},
		/**
			TODO 坐标刻度计算
			@return {Array}
		*/
		getScales:function(cormax,cormin,cornum){

			// S.log("max="+cormax+",min="+cormin+",num="+cornum);

			var corstep,
				tmpstep,
				tmpnum,
				tmp,	//幂
				step,
				extranum,
				min,
				max,
				middle,
				log = Math.log,
				pow = Math.pow,
				ary = [];

			if(cormax <= cormin) return;
			//获取间隔宽度
			corstep = (cormax - cormin) / cornum;

			tmp = Math.floor(log(corstep)/log(10))+ 1;

			tmpstep = corstep / pow(10,tmp);

			if(tmpstep > 0 && tmpstep <= 0.1){

				tmpstep = 0.1;

			}else if(tmpstep > 0.1 && tmpstep <= 0.2){

				tmpstep = 0.2;

			}else if(tmpstep > 0.2 && tmpstep <= 0.25){

				tmpstep = 0.25;

			}else if(tmpstep > 0.25 && tmpstep <= 0.5){

				tmpstep = 0.5;

			}else{

				tmpstep = 1;

			}

			step = tmpstep * pow(10,tmp);

			middle = (cormax + cormin) /2 - ((cormax + cormin) /2) % step;

			min = max = middle;

			while(min > cormin){

				min -= step;
					
			} 
			while(max < cormax){

				max += step;
					
			} 

			for(var i = min; i <= max; i+=step){

				ary.push(i);

			}
			
			return ary;

		},
		/**
			冒泡排序 支持对象数组 
			@param array 数组|对象数组
			@param sortDown 是否降序
			@param defineKey 排序的参考键值
		**/
		arraySort:function(array,sortDown,defineKey){
			return array.sort(function(a, b){ 
				if(!sortDown){
					if(typeof a == "object" && typeof b == "object" ){
						return a[defineKey] - b[defineKey];
					}
					return a-b;
				}else{
					if(typeof a == "object" && typeof b == "object" ){
						return b[defineKey] - a[defineKey];
					}
					return b-a;
				} 
			}); 
　　	},
		/*
			TODO 获取键值为key的数据 拼成数组
			@example [{key:"1"},{key:"2"}] => ["1","2"]
			@return array
		*/
		getArrayByKey:function(array,key){

			var tmp = [];

			for(var i  in array){

				array[i][key] ? tmp.push(array[i][key]) : undefined;

			}

			return tmp;

		},

		obj2Array:function(obj,defineKey){
			var a = [];
			for(var i in obj){
				a.push(defineKey ? obj[defineKey] : obj[i]);
			}
			return a;
		},

		getObjKeys:function(obj){
			var a=[];
			for(b in obj){
				a.push(b);
			}
			return a;
		},

		getDataPoints:function(data){

			var self = this,
				_cfg = self._cfg,
				ictn = self._innerContainer,
				areaWith = ictn.width/len+1,
				x = ictn.x,
				y = ictn.y,
				sx = x - areaWith/2,
				ex = x + areaWith/2,
				ey = y + height,
				ex = x + width,
				width = ictn.width,
				height = ictn.height,
				//坐标刻度的最大值
				max = Math.max.apply(null,self.coordNum),
				min = Math.min.apply(null,self.coordNum),
				defineKey = _cfg.defineKey,
				defineKeyX = defineKey.x || "",
				defineKeyY = defineKey.y || "",
				len = _cfg.xAxis.text.length || 0,
				points = [],
				j = 0;

			//根据x轴的配置信息进行坐标渲染
			self._pointsX = self.getSplitPoints(x,y + height,x + width,y + height,len+1);

		// S.log(self.getSplitPoints(x,y + height,x + width,y + height,len,true));

			// S.log(self._pointsX)
			for(var i in self._pointsX){

				if(_cfg.xAxis.text[i] == data[j][defineKeyX]){
					points[i] = {
						x:self._pointsX[i].x,	//横坐标
						y:height * (1 - (data[j][defineKeyY] - min)/(max - min)) + y,	//纵坐标
						dataInfo:data[j],	//数据信息
						index:Math.round(i)		//索引
					};
					j++;
				}
				else{
					points[i] = {
						x:self._pointsX[i].x,	//横坐标
						index:Math.round(i)		//索引
					};
				}
			}

			return points;

		}

	});

	return BaseChart;

},{requires:['base']});

