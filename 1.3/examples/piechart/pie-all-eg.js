KISSY.use("gallery/kcharts/1.3/piechart/index,promise,gallery/kcharts/1.1/tip/index",function(S,Pie,Promise,Tip){
  var unit = function(x) {
	var defer = new Promise.Defer()
	  , promise = defer.promise
	defer.resolve(x);
	return promise
  };
  var bind = function(input, f) {
	var defer = new Promise.Defer()
	  , output = defer.promise
	input.then(function(x) {
	  f(x).then(function(y) {
		defer.resolve(y);
	  });
	});
	return output;
  };
  var pipe = function(x, functions) {
	for (var i = 0, n = functions.length; i < n; i++) {
	  x = bind(x, functions[i]);
	}
	return x;
  };
  var pi = Math.PI

  function pie1(){
	var defer = Promise.Defer()
	  , promise = defer.promise
	  , data = [ {label:"A", data:1 },{ label:"B", data:2 },{ label:"C", data:3 },{ label:"D",data:4 },{ label:"E", data:5 }]

	var cfg = {
	  data:data,
	  color:{
		initial:"#f00"
	  },
      label:false,
      renderTo:"#J_Pie1",
      cx:150,cy:150,
      rs:60,
      interval:5,
      anim:{
        easing:'swing',
        duration:800
      }
    }

     var pie = new Pie(cfg)
       , ms = 600

     function enter(e){
       var sector = e.sector
         , set = sector.get('set')
         , middleangle = sector.get('middleangle')
         , angel = middleangle*Math.PI/180
         , cx = this.get("cx")
         , cy = this.get("cy")
         , unit = 10
         , x = unit*Math.cos(angel)
         , y = -unit*Math.sin(angel)

       set.stop().animate({transform:'s1.1 1.1 '+cx+' '+ cy},ms,'elastic')
     }
     function leave(e){
       var sector = e.sector
         , set = sector.get('set')
       set.stop().animate({transform:""},ms,"elastic")
     }

     pie.on("mouseover",enter);
     pie.on("mouseout",leave);

     pie.on("afterRender",function(){
       defer.resolve();
     });

     return promise;
   }

  function pie2(){
	var defer = Promise.Defer()
	  , promise = defer.promise
	  , data = [ {label:"A", data:1 },{ label:"B", data:2 },{ label:"C", data:3 },{ label:"D",data:4 },{ label:"E", data:5 }]

	var cfg = {
	  data:data,
	  color:{
		initial:"#00f"
	  },
      label:false,
	  renderTo:"#J_Pie2",
	  cx:150,cy:150,
      donut:true,
	  rs:[50,80],
	  interval:5,
	  anim:{
		easing:'swing',
		duration:800
	  }
	}
	var pie = new Pie(cfg)
	pie.on("afterRender",function(){
	  defer.resolve();
	});



	var currentset
	function handleTransform(e){
	  var sector = e.sector
		, set = sector.get('set')
		, middleangle = sector.get('middleangle')
		, angel = middleangle*Math.PI/180
		, unit = 10
		, x = unit*Math.cos(angel)
		, y = -unit*Math.sin(angel)

	  if(currentset == set)
		return;

	  if(currentset){
		currentset.attr({transform:""})
	  }
	  currentset = set;
	  set.animate({transform:'t'+x+' '+ y},200)
	}
	pie.on('click',handleTransform);
	pie.on("mouseleave",function(){
	  currentset && currentset.animate({"transform":""},300);
	  currentset = null;
	});

	return promise;
  }

  function pie3(){
	var defer = Promise.Defer()
	  , promise = defer.promise
	  , data = [ {label:"A", data:[{data:1}] },{ label:"B", data:[{data:2}] },{ label:"C", data:[{data:3}] },{ label:"D",data:[{data:4}]},{ label:"E", data:[{data:4}] }]
	var cfg = {
	  data:data,
	  color:{
		initial:"#0f0"
	  },
	  renderTo:"#J_Pie3",
      label:false,
	  cx:150,cy:150,
	  rs:[50,80],
	  interval:5,
	  anim:{
		easing:'swing',
		duration:800
	  }
	}
	var pie = new Pie(cfg)
	pie.on("afterRender",function(){
	  defer.resolve();
	});
	return promise;
  }

  function pie4(){
	var defer = Promise.Defer()
	  , promise = defer.promise
	  , data = [ {label:"A", data:[{data:[{data:1}]}] },{ label:"B", data:[{data:[{data:2}]}] },{ label:"C", data:[{data:[{data:3}]}] },{ label:"D",data:[{data:[{data:4}]}]},{ label:"E", data:[{data:[{data:1}]}] }]
	var cfg = {
	  data:data,
	  color:{
		initial:"#0f0"
	  },
      label:false,
	  renderTo:"#J_Pie4",
	  cx:150,cy:150,
	  rs:[50,80,100],
	  interval:5,
	  anim:{
		easing:'swing',
		duration:800
	  }
	}
	var pie = new Pie(cfg)
	pie.on("afterRender",function(){
	  defer.resolve();
	});
	return promise;
  }
  pipe(unit(),[pie1,pie2,pie3,pie4]);
})