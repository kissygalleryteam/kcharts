KISSY.add("gallery/kcharts/1.1/tools/graphtool/index",function(d,c){var e=Math.sqrt;var b={};var f=function(l,g,m,j,i){var k=["M"+[g,m-j].join(","),"L"+[g-j*e(3)/2,m-0+j*1/2].join(","),[g-0+j*e(3)/2,m-0+j*1/2].join(","),"Z"].join(" "),h;if(l&&l.path){h=l.path(k).attr({cx:g,cy:m});h.rotate(i,g,m);return h}};var a=function(n,g,o,i,k,l){var m=["M"+[g,o-k/2].join(","),"L"+[g-0+i/2,o].join(","),[g,o-0+k/2].join(","),[g-i/2,o].join(","),"Z"].join(" "),j;if(n&&n.path){j=n.path(m).attr({cx:g,cy:o});j.rotate(l,g,o);return j}};b=d.merge(b,{triangle:f,rhomb:a});return b},{requires:["gallery/kcharts/1.1/raphael/index"]});
