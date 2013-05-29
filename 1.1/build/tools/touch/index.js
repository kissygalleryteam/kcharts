/*
  touch 事件的
  note:change touch event to mouse event
*/
KISSY.add('gallery/kcharts/1.1/tools/touch/index',function(S){
  if(S.UA.ie) return;
  var touchHandled,touchmove=false;

  function simulateMouseEvent(event,type){
      if (event.touches.length > 1) {
        return;
      }
      var touches = event.changedTouches,
          first = touches[0],
          simulatedEvent = document.createEvent('MouseEvent');

      //event.initMouseEvent(type, canBubble, cancelable, view, 
      //               detail, screenX, screenY, clientX, clientY, 
      //               ctrlKey, altKey, shiftKey, metaKey, 
      //               button, relatedTarget);
      simulatedEvent.initMouseEvent(type, true, true, window, 1,
                                first.screenX, first.screenY, 
                                first.clientX, first.clientY, false, 
                                false, false, false, 0/*left*/, null);

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
