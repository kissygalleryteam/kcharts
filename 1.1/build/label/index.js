KISSY.add('gallery/kcharts/1.1/label/index',function(S){
  var D = S.DOM

  function getTextSize(text,css){
    var textSpan
      ,w
      ,h
    if(!this.textSpan){
      this.textSpan = D.create('<span/>')
      D.append(this.textSpan,document.body);
      S.isObject(css) && D.css(this.textSpan,css);
      D.css(this.textSpan,{position:'absolute','visibility':'hidden'});
    }
    textSpan = this.textSpan;
    D.text(textSpan,text);

    w = D.width(textSpan);
    h = D.height(textSpan);
    return {
      width:w,
      height:h
    };
  }

  function Label(text,css){
  };

  S.augment(Label,{
    getTextSize:getTextSize,
    clear:function(){
      if(this.textSpan){
        D.remove(this.textSpan);
        delete this.textSpan;
      }
    }
  });
  return Label;
});
