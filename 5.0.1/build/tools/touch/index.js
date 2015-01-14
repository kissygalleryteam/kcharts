define('kg/kcharts/5.0.1/tools/touch/index',["ua"],function(require, exports, module) {

  var UA = require("ua");
  if(UA.ie) return;
  var touchHandled,touchmove=false;

  function simulateMouseEvent(event,type){
      if (event.touches.length > 1) {
        return;
      }
      var touches = event.changedTouches,
          first = touches[0],
          simulatedEvent = document.createEvent('MouseEvent');

      
      
      
      
      simulatedEvent.initMouseEvent(type, true, true, window, 1,
                                first.screenX, first.screenY,
                                first.clientX, first.clientY, false,
                                false, false, false, 0, null);

      event.target.dispatchEvent(simulatedEvent);

  }

  function _touchstart(event){
    var self = this,ifcancel = cancelOption(event);

    if(touchHandled||ifcancel){
      return;
    }
    touchHandled = true;

    simulateMouseEvent(event, 'mouseover');

    simulateMouseEvent(event, 'mousemove');

    simulateMouseEvent(event, 'mousedown');
  }

  function _touchmove(event){
    if (!touchHandled) {
        return;
      }
    simulateMouseEvent(event, 'mousemove');
    touchmove = true;
  }

  function _touchend(event){
     if (!touchHandled) {
        return;
      }
      simulateMouseEvent(event, 'mouseup');
      if(touchmove){
        simulateMouseEvent(event, 'mouseout');
      }

    touchmove = false;
      touchHandled = false;

  }

  function cancelOption(event){
     return (event.target.tagName).toUpperCase()=="INPUT"? true: false;
  }

   document.addEventListener("touchstart", _touchstart, true);
   document.addEventListener("touchmove", _touchmove, true);
   document.addEventListener("touchend", _touchend, true);
});