/*! kcharts - v1.2 - 2013-11-22 7:32:54 PM
* Copyright (c) 2013 数据可视化小组; Licensed  */
KISSY.add("gallery/kcharts/1.2/legend/index",function(t,e,i,n,r){function a(i){d||(d=t.Node("<div/>").css({visibility:"hidden",position:"fixed",left:"-9999em",top:0}).appendTo(u)),e.append(i,d);var n={width:e.outerWidth(d),height:e.outerHeight(d)};return d.html(""),n}function s(t,e){var i=this.el,n=i.icon,r=i.des;"cy"===t?n.transform("t0,"+e):"top"===t&&r.css("top",e+"px")}function o(t,e){var i=this.el,n=i.icon,r=i.des;"cx"===t?n.transform("t"+e+",0"):"left"===t&&r.css(t,e+"px")}function c(e){var i=e.get("disablestyle"),n={icon:{stroke:"#ccc",fill:"#ccc"},text:{color:"#ccc"}};n=t.isFunction(i)?t.mix(n,i(this,this.index)):t.mix(n,i);var r=this.icon,a=this.des;r.attr(n.icon),a.css(n.text)}function l(e,i){var n=e.get("enablestyle"),r={icon:{stroke:i.DEFAULT,fill:i.DEFAULT},text:{color:i.DEFAULT}};r=t.isFunction(n)?t.mix(r,n(this,this.index)):t.mix(r,n);var a=this.icon,s=this.des;a.attr(r.icon),s.css(r.text)}function h(e){e=t.merge(_,e),this.set(e),this.init()}t.merge;var d,f=n.BASIC[1],p=window,g=p.Raphael,u=t.one(document.body),_={offset:[0,0],globalConfig:{interval:5}};return t.extend(h,t.Base,{init:function(){this._setupPaper(),this._setupCon();var e=(this.get("bbox"),this.get("paper"),this.get("align")),i=this.get("iconfn");i&&t.isFunction(i)&&(this.icon=i),this.align(e)},_setupPaper:function(){var t=this.get("paper");if(!t){var i=this.get("container");t=g(i[0],e.width(i),e.height(i)),this.set("paper",t)}"VML"==g.type||(t.canvas.style.zIndex=10)},bindEvent:function(){var e=this.get("els"),i=this;t.each(e,function(e){var n=e.icon,r=e.des,a={icon:n,text:r,index:e.index,el:e};t.each(["click","mouseover","mouseout"],function(t){n[t](function(){i.fire(t,a)}),r.on(t,function(){i.fire(t,a)})})})},onframeend:function(){this.bindEvent()},_setupCon:function(){var t=this.get("container"),i=e.css(t,"position");"static"==i&&e.css(t,"position","relative")},item:function(t){var e=this.get("els");return e[t]},icon:function(t,e,i,r){var a,s=this.get("paper"),o=i;switch(r){case"triangle":a=n.triangle(t,e,{paper:s,size:o});break;case"linetriangle":a=n.linetriangle(t,e,{paper:s,size:o});break;case"rhomb":case"diamon":a=n.diamond(t,e,{paper:s,size:o});break;case"linerhomb":case"linediamond":a=n.linediamond(t,e,{paper:s,size:o});break;case"square":a=n.square(t,e,{paper:s,size:o});break;case"linesquare":a=n.linesquare(t,e,{paper:s,size:o});break;case"linecircle":a=n.linecircle(t,e,{paper:s,size:o});break;default:a=n.circle(t,e,{paper:s,size:o})}return a},align:function(t){var e={tl:"alignTopLeft",tc:"alignTopCenter",tr:"alignTopRight",rt:"alignRightTop",rm:"alignRightMiddle",rb:"alignRightBottom",bl:"alignBottomLeft",bc:"alignBottomCenter",br:"alignBottomRight",lt:"alignLeftTop",lm:"alignLeftMiddle",lb:"alignLeftBottom"},i=e[t]||"alignRight";this[i]()},alignTop:function(i,n){var s=this.get("container"),h=this.get("bbox"),d=this.get("offset"),p=(this.get("paper"),this.get("config")),g=this.get("globalConfig"),u=this,_=g.iconsize||[1,1],x=_*f||6,v=g.icontype,m=0,y=[];t.each(p,function(e,i){var n=e.text||"data"+i,r=t.Node('<span class="kcharts-legend-item">'+n+"</span>"),s=a(r);m+=s.width,y.push({el:r,width:s.width,height:s.height,zIndex:10,cursor:"pointer"})});var b=m,w=u.icon(-9999,9999,_,v),L=w.getBBox(),k=g.iconright||0,A=g.interval||0;w.remove(),b+=(L.width+k)*p.length+A*(p.length-1);var C=h.left+d[0],S=h.top+d[1]-2*x,T=C+(h.width-b)/2+x,E=S;if(n&&(E=E+4*x+h.height),"l"==i)T=0+d[0]+x;else if("r"==i){var Y=e.width(s);T=Y-b}var P=[],X=this.get("alignhook"),z=this.get("iconAttrHook"),N=this.get("spanAttrHook"),I=[],G=this.get("anim"),R=G?e.width(s):0,F={icontype:v,iconsize:x,iconright:k};t.each(p,function(i,n){X&&(F=X.call(u,F,n));var r=T,h=E;r+=R;var d=u.icon(r,h,_,i.icontype||F.icontype),f=d.getBBox(),p={};t.mix(p,i,!0,["DEFAULT","HOVER"]);var g={fill:p.DEFAULT};z&&(g=t.merge({fill:p.DEFAULT},z.call(u,n))),g.stroke=g.fill,d.attr(g);var x=i.text||"data"+n,v=e.create('<span class="kcharts-legend-item"></span>');e.html(v,x);var m,y,b=a(v);v=t.Node('<span class="kcharts-legend-item">'+x+"</span>"),m=T+F.iconsize+F.iconright,y=E-(f.height/2+(b.height-f.height)/2),m+=R;var w={left:m+"px",top:y+"px",position:"absolute",zIndex:10,cursor:"pointer"};p.DEFAULT&&(w.color=p.DEFAULT),N&&(w=t.merge(w,N.call(u,n))),v.css(w),v.appendTo(s),T+=b.width+2*F.iconsize+A+F.iconright;var L={icon:d,des:v,index:n,disable:function(){c.call(L,u,i)},enable:function(){l.call(L,u,i)}};P.push(L),G&&I.push({el:L,frame:o,from:{cx:0,left:m},to:{cx:-R,left:m-R}})}),this.set("els",P),G?(G.endframe=function(){u.onframeend()},r.AnimateObject(I,G)):u.onframeend()},alignTopLeft:function(){this.alignTop("l")},alignTopCenter:function(){this.alignTop("c")},alignTopRight:function(){this.alignTop("r")},alignRight:function(t){this.alignLeft(t,!0)},alignRightTop:function(){this.alignRight("t")},alignRightMiddle:function(){this.alignRight("m")},alignRightBottom:function(){this.alignRight("b")},alignBottomLeft:function(){this.alignTop("l",!0)},alignBottomCenter:function(){this.alignTop("c",!0)},alignBottomRight:function(){this.alignTop("r",!0)},alignLeft:function(i,n){var o=this.get("container"),h=this.get("bbox"),d=this.get("offset"),p=(this.get("paper"),this.get("config")),g=this.get("globalConfig"),u=this,_=g.iconsize||[1,1],x=_*f||6,v=g.icontype,m=0,y=p[0],b=u.icon(-9999,-9999,_,v),w=b.getBBox(),L=p.length,k=g.iconright||0,A=g.interval;b.remove();var C=y.text||"data",S=t.Node('<span class="kcharts-legend-item">'+C+"</span>"),T=a(S),E=Math.max(T.height,w.height);m+=E*L+A*(L-1);var Y,P,X,z,N=0,I=[];t.each(p,function(e,i){var n=t.Node('<span class="kcharts-legend-item">'+e.text+"</span>"),r=a(n);e.text||"data"+i,r.width>N&&(N=r.width),I.push({el:n,width:r.width,height:r.height})}),N+=k,n?(Y=h.left+h.width+d[0],P=h.top+d[1],X=Y+x,z=P):(Y=h.left+d[0],P=h.top+d[1],X=Y,z=P),"m"==i?z=h.top+(h.height-m)/2:"b"==i&&(z=h.top+h.height-m);var G=[],R=this.get("alignhook"),F=this.get("iconAttrHook"),D=this.get("spanAttrHook"),M=[],B=this.get("anim"),$=B?e.height(o):0,O={icontype:v,iconright:k};t.each(p,function(e,i){R&&(O=R.call(u,O,i));var r,a;n?(r=X+d[0],a=z+d[1]):(r=X-N-x+d[0],a=z+d[1]),a+=$;var h=u.icon(r,a,_,e.icontype||O.icontype),f=h.getBBox(),p=I[i],g={};t.mix(g,e,!0,["DEFAULT","HOVER"]);var v={fill:g.DEFAULT};F&&(v=t.merge(v,F.call(u,i))),v.stroke=v.fill,h.attr(v);var m,y,b=t.Node('<span class="kcharts-legend-item">'+e.text+"</span>");n?(m=X+x+f.width+d[0],y=z-(f.height/2+(T.height-f.height)/2)+d[1]):(m=X+d[0]-N+O.iconright,y=z-(f.height/2+(p.height-f.height)/2)+d[1]),y+=$;var w={left:m+"px",top:y+"px",position:"absolute",zIndex:10,cursor:"pointer"};g.DEFAULT&&(w.color=g.DEFAULT),D&&(w=t.merge(w,D.call(u,i))),b.css(w),b.appendTo(o);var L=Math.max(p.height,f.height);z+=L+A;var k={icon:h,des:b,index:i,disable:function(){c.call(k,u,e)},enable:function(){l.call(k,u,e)}};G.push(k),B&&M.push({el:k,frame:s,from:{cy:0,top:y},to:{cy:-$,top:y-$}})}),this.set("els",G),B?(B.endframe=function(){u.onframeend()},r.AnimateObject(M,B)):u.onframeend()},alignLeftTop:function(){this.alignLeft("t")},alignLeftMiddle:function(){this.alignLeft("m")},alignLeftBottom:function(){this.alignLeft("b")}}),h},{requires:["dom","event","gallery/kcharts/1.2/icons/index","gallery/kcharts/1.2/animate/index","gallery/kcharts/1.2/raphael/index"]});