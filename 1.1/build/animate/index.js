KISSY.add('gallery/kcharts/1.1/animate/index',function(S,Anim){
  var Easing = Anim.Easing
    , requestAnimFrame = window.requestAnimationFrame       ||
                         window.webkitRequestAnimationFrame ||
                         window.mozRequestAnimationFrame    ||
                         window.oRequestAnimationFrame      ||
                         window.msRequestAnimationFrame     ||
                         function (callback) {
                           return setTimeout(callback, 16);
                         }
    , cancelAnimationFrame = window.cancelAnimationFrame       ||
                             window.webkitCancelAnimationFrame ||
                             window.mozCancelAnimationFrame    ||
                             window.oCancelAnimationFrame      ||
                             window.msCancelAnimationFrame     ||
                             clearTimeout
    , dft
  dft = {
    duration:1000,
    easing:'easeNone'
  }
  function Animate(fromProps,toProps,opts){
    opts || (opts = {});
    opts = S.merge(dft,opts);

    var begin = +new Date
      , end = begin + opts.duration
      , now = begin
      , diff = opts.duration
      , fx = Easing[opts.easing]
      , step = opts.step || S.noop
      , props = {}
      , ended = false // 动画是否已经结束
      , run
      , _duration = opts.duration
      , timer

    // 用于resume的数据
    // |---a----|_b__|--c--|
    var a = 0
      , b = 0
      , stopTime
      , resumeable = false;

    // do some clean
    for(var x in fromProps){
      if(!toProps[x] && toProps[x] != 0){
        delete fromProps[x]
      }else{
        props[x] = null;
      }
    }

    run = function(){
      var s,t;
      t = a/diff
      s = fx(t)
      if(S.isArray(fromProps)){
        for(var i=0,len=fromProps.length;i<len;i++){
          props[i] = fromProps[i] + (toProps[i] - fromProps[i])*s;
        }
      }else{
        for(var x in fromProps){
          props[x] = fromProps[x] + (toProps[x] - fromProps[x])*s;
        }
      }
      if(a<_duration){
        step.call(api,props,t);
        timer = requestAnimFrame(run);
      }else{
        step.call(api,props,t);
        ended = true;
        if(opts.end){
          opts.end.call(api);
        }
      }
      now = +new Date;
      a = now - begin - b;
    }
    function saveFrame(){
      if(!ended){
        stopTime = +new Date;
        resumeable = true;
      }
    }
    function restoreFrame(){
      var _now = +new Date;
      b = b + _now  - stopTime;
      resumeable = false;
    }
    var api =  {
      stop:function(){
        cancelAnimationFrame(timer);
      },
      resume:function(){
        if(resumeable){
          restoreFrame();
          run();
        }
      },
      pause:function(){
        if(!resumeable){
          saveFrame();
          cancelAnimationFrame(timer);
        }
      },
      isRunning:function(){
        return !ended;
      }
    }
    run();
    return api;
  }
  return Animate;
},{
  requires:['anim']
})
