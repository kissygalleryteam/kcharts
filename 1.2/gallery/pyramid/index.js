KISSY.add("gallery/kcharts/1.2/gallery/pyramid/index",function(S,R){
	var $=S.all;

	function Triangle(id,w,data,isBig,BigColor,SanColor){
		this._init(id,w,data,isBig,BigColor,SanColor);
	}
	S.augment(Triangle,{
		//容器id ，三角形宽度 ，数据 ，初始大买客是否高亮，大买客颜色(可不填)，散卖客颜色(可不填)
		_init:function(id,w,data,isBig,BigColor,SanColor){
			var self=this;
			$("#"+id).html("");

			data[0].d.sort(function(a,b){return a[0]-b[0]});
			data[1].d.sort(function(a,b){return a[0]-b[0]});

			//转换数据的百分比
			var d0=0;
			var datapre1=[]
			for(var i=0;i<data[0].d.length;i++){
				d0+=data[0].d[i][0];
			}
			for(var i=0;i<data[0].d.length;i++){
				datapre1[i]=data[0].d[i][0]/d0;
			}

			
			var d1=0;
			var datapre2=[];
			for(var i=0;i<data[1].d.length;i++){
				d1+=data[1].d[i][0];
			}
			for(var i=0;i<data[1].d.length;i++){
				datapre2[i]=data[1].d[i][0]/d1;
			}
			
			//定义参数
			var w=w;
			var wBh=0.88;
			var h=Math.round(w*wBh);

			var p1=data[0].p[0];

			var p2=data[1].p[0];

			var paper = new Raphael(id,w,h);

			//设置颜色
			var bigColor='';
			var sanColor='';
			var bigFont='';
			var sanFont='';
			if(!BigColor)BigColor='#ee5949';
			if(!SanColor)SanColor='#74aed2';
			if(isBig){
				bigColor=BigColor;
				sanColor='rgb(209,209,209)';
				bigFont='#000';
				sanFont='#fff';
			}
			else{
				bigColor='rgb(209,209,209)';
				sanColor=SanColor;
				bigFont='rgb(154,154,154)';
				sanFont='#fff';
			}

			//外面的三角形
			var shape=paper.path('M '+w/2+' 0 l '+w/2+' '+h+' l -'+w+' 0');
			shape.attr({
				fill:'#ccc',
				stroke:'none'
			});

			
			//散买客
			shape=paper.path('M '+w/2+' 0 l 0 '+h+' l -'+w/2+' 0').attr({
				fill:sanColor,
				stroke:sanColor
			});

			paper.text(w*90/330,h*260/290,data[1].p[1]).attr({
				fill:sanFont,'font-size':'22px'
			});
			paper.text(w*90/330,h*280/290,data[1].p[2]+' : '+Math.round(p2*100)+'%').attr({
				fill:sanFont,'font-size':'16px'
			});
			
			//大买客
			shape=paper.path('M '+w/2+' 0 l 0 '+p1*h+' l -'+p1*w/2+' 0').attr({
				fill:bigColor,
				stroke:bigColor
			});

			paper.text(w*120/330,p1*h-50,data[0].p[1]).attr({
				fill:bigFont,'font-size':'22px'
			});
			paper.text(w*120/330,p1*h-30,data[0].p[2]+':').attr({
				fill:bigFont,'font-size':'16px'
			});
			paper.text(w*120/330,p1*h-10,Math.round(p1*100)+'%').attr({
				fill:bigFont,'font-size':'16px'
			});

			//右边的三角形
			var length1=data[0].d.length;
			var length2=data[1].d.length;

			drawRight(1,sanColor,sanColor,h*280/290+3,data[1].d[length2-1][1],data[1].d[length2-1][0],w,h,sanFont,true);
			var data1=0;
			for(var i=length2-2;i>=0;i--){
				data1+=datapre2[i+1]*p2;
				drawRight(1-data1,sanColor,'#fff',(1-data1)*h-6,data[1].d[i][1],data[1].d[i][0],w,h,sanFont,true);
			}

			drawRight(1,bigColor,'#fff',p1*h-8,data[0].d[length1-1][1],data[0].d[length1-1][0],p1*w,p1*h,bigFont);
			var data2=0;
			for(var i=length1-2;i>0;i--){
				data2+=datapre1[i+1];
				drawRight(1-data2,bigColor,'#fff',(1-data2)*h*p1-8,data[0].d[i][1],data[0].d[i][0],p1*w,p1*h,bigFont);
			}
			var p0=data[0].d[0][0];
			drawRight(datapre1[0] ,bigColor,'#fff',p0*p1*h-8,data[0].d[0][1],data[0].d[0][0],p1*w,p1*h,bigFont);
			var shape=paper.path('M '+w/2+' 0 l 0 '+h+'');
			shape.attr({
				stroke:'#fff'
			});

			//画右边的三角形
			function drawRight(p,color,bottomColor,th,word,pre,width,h,fontColdor,isSan){
				var self=this;
				shape=paper.path('M '+w/2+' 0 l 0 '+h*p+' l '+width*p/2+' 0 ').attr({
					fill:color,
					stroke:bottomColor
				});
				var tw=w*200/330-4;
				if(!fontColdor)fontColdor='#fff';
				if(Math.round(pre*100)<10){
					if(isBig){
						tw=-10000;
					}
					else{
						fontColdor=SanColor;
						tw=tw+width*p/2*9/10;
					}
					
				}
				var fontSize='14px';
				if(isSan)fontSize='12px';
				paper.text(tw,th,word+':'+Math.round(pre*100)+'%').attr({
					fill:fontColdor,'font-size':fontSize
				});
			}
		}
		
	});

	return Triangle;	

},{requires:['gallery/kcharts/1.2/raphael/index']});