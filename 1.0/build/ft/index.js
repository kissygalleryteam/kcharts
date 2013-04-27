KISSY.add('gallery/kcharts/1.0/ft/index',function(S,Anim){
  var Easing = Anim.Easing;
  function Fx(cfg){
    cfg || (cfg = {});
    this.cfg = S.merge({duration:1000,easing:'easeNone',onstep:S.noop,onend:S.noop},cfg);
    this.INTERVAL = 25;
  }
  S.extend(Fx,S.Base,{
    compute:function(){
      var me = arguments.callee
        ,that = this
        ,cfg = that.cfg
        ,fx = Easing[cfg.easing]
        ,now = +new Date
        ,relative2one //转为[0,1]的一个数字
        ,s
      that.begin || (that.begin = now);
      relative2one = ((now - that.begin)/cfg.duration);
      if(now - that.begin>cfg.duration){
		cfg.onstep(1,1);
        that.fire('step',{target:that,s:1,t:1});

        that.fire('end');
        that.onend();
        cfg.onend();
        return;
      }else{
        s = fx(relative2one);
        cfg.onstep(relative2one,s);
        that.fire('step',{target:that,s:s,t:relative2one});
      }
    },
    run:function(){
      var that = this;
      this.timer = setInterval(function(){
                     that.compute();
                   },this.INTERVAL);
    },
    stop:function(){
      this.timer && clearInterval(this.timer);
      delete this.timer;
    },
    onend:function(){
      this.stop();
      delete this.timer;
      delete this.begin;
    }
  });
  return Fx;
},{
  requires:['anim']
});
