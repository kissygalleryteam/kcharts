(function(S){
	S.Config.debug = true;

	KISSY.use("gallery/kcharts/1.1/linechart/index",function(S,LineChart){

	var $ = S.all;

	var $J_Series = $("#J_Series");

	renderChart();

	// renderTable($J_Series,{
	// 	rows:10,
	// 	cols:10,
	// 	tpl:"<input type='text'>",
	// 	className:"tbl-series"
	// });

	// /**
	// 	TODO 生成table
	// **/
	// function renderTable(tgt,cfg){
	// 	if(!$(tgt)[0]) return "";
	// 	var html = "<table>",
	// 		rows = cfg.rows || 0,
	// 		cols = cfg.cols || 0,
	// 		tpl = cfg.tpl ||"",
	// 		className = cfg.className || "";
	// 	for(var i = 0;i < rows; i++){
	// 		html += "<tr>";
	// 		for(var j = 0;j < cols ; j++){
	// 			html += "<td>" + tpl + "</td>";
	// 		}
	// 		html += "</tr>";
	// 	}
	// 	html += "</table>";
	// 	$(tgt).html("");
	// 	return $(html).addClass(className).appendTo($(tgt));
	// }

 



	function renderChart(cfg){
		 var linechart = new LineChart(S.mix({
		      renderTo:"#J_Preview",
		      yLabels:{
		        css:{
		          "marginLeft":"-4px",
		          "font-family":"Microsoft Yahei",
		          "font-size":"10px"
		        }
		      },
		      xLabels:{
		        css:{
		          "font-family":"Microsoft Yahei",
		           "font-size":"10px"
		        }
		      },
		      title:{
		              content:"Monthly Average Temperature"
		            },
		            anim:{},
		            subTitle:{
		              content:"Source: WorldClimate.com"
		            },
		            lineType:"arc",
		       xAxis: {
		          text:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		            },
		            yAxis:{
		              num:7
		            },
		      series:[{
		                text: 'Tokyo',
		                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
		            }, {
		                text: 'New York',
		                data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
		            }
		            , {
		                text: 'Berlin',
		                data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
		            }, {
		                text: 'London',
		                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
		            }
		            ],
		      legend:{
		        isShow:true,
		        css:{
		          marginLeft:250,
		          marginTop:260
		        }
		      },
		      tip:{
		        offset:{
		                    x:10,
		                    y:10
		                },
		        template:function(){
		          return "<span style='font-size:10px'>"+arguments['0']['text'] + "</span><br/>" + arguments['0']['y'] + "\u2103";
		        }
		      }
		  },cfg));
			return linechart;
	}
});

})(KISSY);