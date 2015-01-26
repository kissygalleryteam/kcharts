define('kg/kcharts/5.0.1/animate/index',["anim","util","./easing"],function(require, exports, module) {

  var Anim = require("anim"),
      Util = require("util"),
      Easing = require("./easing");


    var requestAnimFrame = window.requestAnimationFrame       ||
                         window.webkitRequestAnimationFrame ||
                         window.mozRequestAnimationFrame    ||
                         window.oRequestAnimationFrame      ||
                         window.msRequestAnimationFrame     ||
                         function (callback) {
                           return setTimeout(callback, 16);
                         }
    var cancelAnimationFrame = window.cancelAnimationFrame       ||
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
    opts = Util.merge(dft,opts);
    var begin = +new Date
      , end = begin + opts.duration
      , now = begin
      , diff = opts.duration
      , fx = Easing[opts.easing]
      , frame = opts.frame || S.noop
      , props = {}
      , ended = false 
      , run
      , _duration = opts.duration
      , timer

    
    
    var a = 0
      , b = 0
      , stopTime
      , resumeable = false;

    
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
      if(Util.isArray(fromProps)){
        for(var i=0,len=fromProps.length;i<len;i++){
          props[i] = fromProps[i] + (toProps[i] - fromProps[i])*s;
        }
      }else{
        for(var x in fromProps){
          props[x] = fromProps[x] + (toProps[x] - fromProps[x])*s;
        }
      }
      if(a<_duration){
        frame.call(api,props,t);
        timer = requestAnimFrame(run);
      }else{
        frame.call(api,toProps,1);
        ended = true;
        if(opts.endframe){
          opts.endframe.call(api,toProps,1);
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
  Animate.AnimateObject = function (props,cfg){
    var AnimMap = []
      , AnimMapIndex = 0

    var from = {}
      , to = {}
      , len = props.length
    Util.each(props,function(p,index){
      var f = p.from
        , t = p.to
        , key
      for(var x in f){
        key = AnimMapIndex++
        AnimMap[key] = [p,x,index]
        from[key] = f[x]
        to[key] = t[x]
      }
    });
    var anim = Animate(from,to,{
      easing:cfg.easing,
      duration:cfg.duration,
      frame:function(props,t){
        for(var x in props){
          var map = AnimMap
            , p = map[x][0]
            , attrname = map[x][1]
            , index = map[x][2]
            , from = p.from
          from[attrname] = props[x];
          p.frame && p.frame(attrname,props[x],props,index,len);
        }
      },
      endframe:function(props,t){
        for(var x in props){
          var map = AnimMap
            , p = map[x][0]
            , attrname = map[x][1]
            , index = map[x][2]
          p.endframe && p.endframe(attrname,props[x],index,props);
        }
        cfg.endframe && cfg.endframe();
      }
    })
    return anim;
  }
  return Animate;
});