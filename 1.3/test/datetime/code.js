KISSY.add(function(S,Kscroll,RichDate,Julogin){
    var $ = S.all,DOM=S.DOM,Anim=S.Anim;
    //定义节点
    var J_favbox = "#J_favbox",
        favNumDom = "#J_favbox .J_tagtit li:eq(0)",
        surNumDom = "#J_favbox .J_tagtit li:eq(1)",
        favItemlistwrap = "#J_favbox .J_itemlistwrap:eq(0)",
        surItemlistwrap = "#J_favbox .J_itemlistwrap:eq(1)",
        favItemList = "#J_favbox .J_itemlist:eq(0)",
        surItemList = "#J_favbox .J_itemlist:eq(1)",
        favTagCon = "#J_favbox .J_tagconwrap:eq(0)",
        surTagCon = "#J_favbox .J_tagconwrap:eq(1)",
        favSubNav = "#J_favbox .J_subnav:eq(0) li",
        surSubNav = "#J_favbox .J_subnav:eq(1) li",
        J_icondel = "#J_favbox .J_icondel",
        J_item = ".J_item",
        J_favboxParent = "#J_favboxparent",
        J_justar = "#J_justar",
        J_justari = "#J_justar i",
        J_surmsg = "#J_surmsg";

    if(window._ju_config.domain == "http://ju.taobao.com/"){
        //detail详情页域名
        var detailDomain = "http://detail.ju.taobao.com/";
        //异步请求接口域名
        var dskipDomain = "http://dskip.ju.taobao.com/";
        //获取图片前缀
        var prePicUrl = "http://gju1.alicdn.com/bao/uploaded/";
    }else{
        //detail详情页域名
        var detailDomain = "http://detail.ju.daily.taobao.net/";
        //异步请求接口域名
        var dskipDomain = "http://dskip.ju.daily.taobao.net/";
        //获取图片前缀
        var prePicUrl =  "http://img02.taobaocdn.net/bao/uploaded/";
    }

    //聚收藏对象
    window.juFavbox = {
        /**
        *@Object
        *@name config
        *@memberOf juFavbox
        *@description juFavbox配置项
        *@example 
        *juFavbox.config.html_temp;
        */
        config:{
            //后台接口参数：获取列表
            "getData":{
                url: dskipDomain+"json/collect_list.htm",
                param:[
                    {name:"listType",enumval:["collect","favorite"]},
                    {name:"queryType",enumval:[1,2,3]}
                ]
            },
            "addData":{
                url: dskipDomain+"json/add_collect.htm",
                param:[{name:"id"}]
            },
            "delData":{
                url: dskipDomain+"json/delete_collect.htm",
                param:[{name:"id"}]
            },
            //初始化模板html
            "html_temp":"<div class='favboxwrap' id='J_favbox'><div class='favboxframe'>"+
                        "<div class='tagtit J_tagtit'><ul><li class='active'>我的聚收藏（<span>0</span>）</li><li>聚有惊喜（<span>0</span>）</li></ul></div>"+
                        "<div class='tagcon'>"+
                        "<div class='tagconwrap myjufav J_tagconwrap' data-spm='dp0'>"+
                        "<div class='subnav J_subnav'><ul><li class='active'>全部</li><li>开团中</li><li>预热</li></ul></div>"+
                        "<div class='itemlistwrap J_itemlistwrap'></div>"+
                        "</div>"+
                        "<div class='tagconwrap jusurprise J_tagconwrap' data-spm='dp1'>"+
                        "<div class='subnav J_subnav'><ul><li class='active'>全部</li><li>开团中</li><li>预热</li></ul></div>"+
                        "<div class='surmsg' id='J_surmsg'>亲，您淘宝收藏夹里的宝贝上聚划算啦！</div>"+
                        "<div class='itemlistwrap J_itemlistwrap'></div>"+
                        "</div>"+
                        "</div>"+
                        "<div class='whatjufav' data-spm='dp2'><a target='_blank' href='http://service.taobao.com/support/knowledge-5697322.htm'>关于聚收藏</a> &gt;</div>"+
                        "</div></div>"
        },
        /**
        *@function
        *@name init
        *@memberOf juFavbox
        *@description 初始化函数
        *@param {String} _page 当前页面标示，用于统计信息
        *@param {Function} _callback 当前页面标示，用于统计信息
        *@param {String} _page 当前页面标示，用于统计信息
        *@example 
        *juFavbox.init();
        */
        init:function(_page,_callback,_eventType){
            //获取初始化数据
            juFavbox.getData(0,0,function(favData){
                if(!favData || favData.type!=="SUCCESS"){
                    if(_eventType=="click"){
                        //强制弹出登陆框
                        Julogin.login(function () {
                            DOM.addClass(J_justari,"loginin");
                            $(J_justar).fire("click");
                        });
                        return;
                    }else{
                        DOM.removeClass(J_justar,"justara_on");
                        DOM.removeClass(J_justari,"loginin");
                        return;
                    }
                } 
                //将结构html植入指定父节点
                DOM.html(J_favboxParent,juFavbox.config.html_temp);
                //聚收藏总数
                $(favNumDom).one("span").text(favData.collectcount);
                //聚有惊喜
                if(favData.favoritecount){
                    //聚有惊喜总数
                    $(surNumDom).one("span").text(favData.favoritecount);
                    //绑定 subnav内容切换行数
                    $(surSubNav).on("click",function(){
                        if(DOM.hasClass(this,"active")) return;
                        var index = $((surSubNav)).index(this);
                        $(surSubNav).removeClass("active");
                        $(this).addClass("active");
                        juFavbox.getData(1,index,function(data){
                            if(!data || data.type!=="SUCCESS") return;
                            juFavbox.showData(data.result,1);
                        });
                        //统计我的聚收藏subnav点击UV、PV
                        window.goldlog && window.goldlog.send("http://gm.mmstat.com/jhs.4.3.8?name=tab&type=1&subtype="+index+"&page="+_page);
                    })
                    //绑定点击事件：我的聚收藏
                    $(favNumDom).on("click",function(){
                        if($(favNumDom).hasClass("active")) return;
                        $(favNumDom).addClass("active");
                        $(surNumDom).removeClass("active");
                        $(favTagCon).fadeIn(.3);
                        $(surTagCon).fadeOut(.3);
                        //统计我的聚收藏Tab点击UV、PV
                        window.goldlog && window.goldlog.send("http://gm.mmstat.com/jhs.4.3.8?name=tab&type=0&page="+_page);
                    })
                    //绑定点击事件：聚有惊喜
                    var surDataStatus = false;
                    $(surNumDom).on("click",function(){
                        if($(surNumDom).hasClass("active")) return;
                        $(favNumDom).removeClass("active");
                        $(surNumDom).addClass("active");
                        if(!surDataStatus){
                            surDataStatus = true;
                            juFavbox.getData(1,0,function(surData){
                                if(!surData || surData.type!=="SUCCESS") return;
                                //更新内容
                                juFavbox.showData(surData.result,1);
                            });
                        }
                        $(favTagCon).fadeOut(.3);
                        $(surTagCon).fadeIn(.3);
                        //统计聚有惊喜Tab点击UV、PV
                        window.goldlog && window.goldlog.send("http://gm.mmstat.com/jhs.4.3.8?name=tab&type=1&page="+_page);
                    })
                }else{
                    //隐藏聚有惊喜对应tagtit头
                    $(surNumDom).hide();
                    $(favNumDom).css("width","100%");
                }
                //更新内容
                juFavbox.showData(favData.result,0);
                //绑定 subnav内容切换行数
                $(favSubNav).on("click",function(){
                    if(DOM.hasClass(this,"active")) return;
                    var index = $(favSubNav).index(this);
                    $(favSubNav).removeClass("active");
                    $(this).addClass("active");
                    juFavbox.getData(0,index,function(data){
                        if(!data || data.type!=="SUCCESS") return;
                        juFavbox.showData(data.result,0);
                    });
                    //统计我的聚收藏subnav点击UV、PV
                    window.goldlog && window.goldlog.send("http://gm.mmstat.com/jhs.4.3.8?name=tab&type=0&subtype="+index+"&page="+_page);
                })
                //绑定删除数据事件
                $(favItemlistwrap).delegate('click', J_icondel, function(e){
                    var currentTarget = e.currentTarget;
                    var id = $(DOM.parent(currentTarget,J_item)).attr("data-id");
                    juFavbox.delData(id);
                })
                //执行回调函数
                _callback && _callback();
            });
        },
        /**
        *@function
        *@name reset
        *@memberOf juFavbox
        *@description 清空juFavbox
        *@example 
        *juFavbox.reset();
        */
        reset:function(){
            DOM.empty(J_favboxParent);
        },
        /**
        *@function
        *@name showData
        *@memberOf juFavbox
        *@description 显示对应数据的视图，用于点击Tagtit和subnav的视图切换
        *@param {Object} _data 需要展示的数据对象
        *@param {Number} _type 查询类型（value: 我的聚收藏:0 OR 聚有惊喜:1）
        *@example 
        *juFavbox.showData(data,0);
        */
        showData:function(_data,_type){
            //解析模板
            var htmlstr = juFavbox.parseData(_data,_type);
            //将data生成的html加入到节点中
            if(_type==0){
                $(favItemlistwrap).html(htmlstr);
                //设置 我的聚收藏 滚动条
                juFavbox.favKscroll = new Kscroll($(favItemList), {
                    prefix:"clear-",
                    hotkey: true,
                    bodydrag: false,
                    allowArrow:true
                });
            }else{
                $(surItemlistwrap).html(htmlstr);
                //设置 聚有惊喜 滚动条
                juFavbox.surKscroll = new Kscroll($(surItemList), {
                    prefix:"clear-",
                    hotkey: true,
                    bodydrag: false,
                    allowArrow:true
                });
            }
        },
        /**
        *@function
        *@name getData
        *@memberOf juFavbox
        *@description 定义获取数据函数
        *@param {String} _listType 展示列表的类型 (value: 聚收藏:collect OR 聚有惊喜:favorite） 
        *@param {Number} _queryType 查询类型（value: 全部:1 OR 开团:2 OR 预热:3）
        *@param {Function} _callback  回调函数，参数为返回的data
        *@example 
        *juFavbox.getData(0,0,function(data){...});
        */
        getData: function (_listType,_queryType,_callback){
            var args = arguments;
            //获取系统参数tbToken
            KISSY.juReady(function(juSkip){
                //定义url
                var _url = juFavbox.config.getData.url;
                var _param = {
                    _tb_token_:juSkip.tbToken, 
                    _input_charset: "utf-8"
                };
                var arrParam = juFavbox.config.getData.param;
                for (var i = 0; i < arrParam.length; i++) {
                    _param[arrParam[i].name] = arrParam[i].enumval[args[i]];
                };
                S.jsonp(_url, _param, function(data){
                    _callback && _callback(data);
                });
            })
        },
        /**
        *@function
        *@name addData
        *@memberOf juFavbox
        *@description 数据刷新对外接口,更新我的具收藏内容列表
        *@example 
        *juFavbox.addData(3);
        */
        addData:function(_id){
            if(!$(J_favbox)) return;
            juFavbox.getData(0,0,function(favData){
                if(!favData || favData.type!=="SUCCESS") return;
                for (var i = 0; i < favData.result.length; i++) {
                    if(favData.result[i]['id']==_id){
                        //闪动动画效果
                        var heart = KISSY.all("#heart");
                        heart.show();
                        var heartAnim = KISSY.Anim("#heart",{
                            height:heart.height()*1.6,
                            width:heart.width()*1.6,
                            top:parseInt(heart.css("top"))-heart.height()*0.3,
                            left:parseInt(heart.css("left"))-heart.width()*0.3,
                            opacity:0
                        },.3,"easeOut",function(){
                            heart.hide();
                            heart.css({
                                width:29,
                                height:26,
                                top:13,
                                left:11,
                                opacity:1
                            });
                        }); 
                         heartAnim.run();
                        //解析模板
                        var htmlstr = juFavbox.parseData([favData.result[i]],2);
                        //更新总数
                        var curFavNumDom = $(favNumDom).one("span").text();
                        $(favNumDom).one("span").text(parseInt(curFavNumDom)+1);
                        //增加Item
                        var newItem = DOM.create(htmlstr, {height:0,opacity:0}, document);
                        //判断是否有商品
                        if(!$(favItemlistwrap).all(J_item).length){
                            DOM.empty(favItemList);
                        }
                        DOM.prepend(newItem, favItemList);
                        var anim = Anim(newItem,{
                            height:84,
                            opacity:1
                        },.3,"easeNone",function(){
                            juFavbox.favKscroll.resize();
                        })
                        anim.run(); 
                    }
                };
            });
        },
        /**
        *@function
        *@name addData_bp
        *@memberOf juFavbox
        *@description 增加数据对外接口,更新我的具收藏内容列表  备用方案
        *@param {Number} _id 商品id
        *@example 
        *juFavbox.addData(1);
        */
        addData_bp:function(_id){
            var args = arguments;
            //获取系统参数tbToken
            KISSY.juReady(function(juSkip){
                //定义url
                var _url = juFavbox.config.addData.url;
                var _param = {
                    _tb_token_:juSkip.tbToken
                };
                var arrParam = juFavbox.config.addData.param;
                for (var i = 0; i < arrParam.length; i++) {
                    _param[arrParam[i].name] = args[i];
                };
                S.jsonp(_url, _param, function(data){
                    if(data.type=="SUCCESS"){
                        if(!$(J_favbox)) return;
                        juFavbox.getData(0,0,function(favData){
                            if(!favData || favData.type!=="SUCCESS") return;
                            for (var i = 0; i < favData.result.length; i++) {
                                if(favData.result[i]['id']==_id){
                                    //解析模板
                                    var htmlstr = juFavbox.parseData([favData.result[i]],2);
                                    //更新总数
                                    var curFavNumDom = $(favNumDom).one("span").text();
                                    $(favNumDom).one("span").text(parseInt(curFavNumDom)+1);
                                    //增加Item
                                    var newItem = DOM.create(htmlstr, {height:0,opacity:0}, document);
                                    //判断是否有商品
                                    if($(favItemlistwrap).all(J_item).length){
                                        DOM.prepend(newItem, favItemList);
                                    }else{
                                        DOM.html(newItem, favItemList);
                                    }
                                    var anim = Anim(newItem,{
                                        height:84,
                                        opacity:1
                                    },.3,"easeNone",function(){
                                        juFavbox.favKscroll.resize();
                                    })
                                    anim.run(); 
                                }
                            };
                        });
                    }
                });
            })
        },
        /**
        *@function
        *@name delData
        *@memberOf juFavbox
        *@description 聚收藏删除商品对外接口，更新我的聚收藏显示列表
        *@param {Number} _id 商品id
        *@example 
        *juFavbox.delData("2");
        */
        delData:function(_id){
            var args = arguments;
            //获取系统参数tbToken
            KISSY.juReady(function(juSkip){
                //定义url
                var _url = juFavbox.config.delData.url;
                var _param = {
                    _tb_token_:juSkip.tbToken
                };
                var arrParam = juFavbox.config.delData.param;
                for (var i = 0; i < arrParam.length; i++) {
                    _param[arrParam[i].name] = args[i];
                };
                S.jsonp(_url, _param, function(data){
                    if(data.type=="SUCCESS"){
                        //更新总数
                        var curFavNumDom = $(favNumDom).one("span").text();
                        $(favNumDom).one("span").text(parseInt(curFavNumDom)-1);
                        //删除Item
                        $(favItemlistwrap).all(J_item).each(function(el,index){
                            if(el.attr("data-id")==_id){
                                var anim = Anim(el,{
                                    height:0,
                                    opacity:0
                                },.3,"easeNone",function(){
                                    DOM.remove(el);
                                    juFavbox.favKscroll.resize();
                                    //判断是否还有商品
                                    if(!$(favItemlistwrap).all(J_item).length){
                                        $(favItemlistwrap).html("<div class='itemlist J_itemlist'><div class='nodata'>亲，你是啥都看不上呢还是啥也没看？里面好空哦...</div></div>");
                                    }
                                })
                                anim.run();
                            }
                        })
                    }
                });
            })    
        },
        /**
        *@function
        *@name parseData
        *@memberOf juFavbox
        *@description 定义数据解析函数
        *@param {Object} _data 待解析成hhtml的数据
        *@param {Number} _type 解析类型（value: 我的聚收藏:0 OR 聚有惊喜:1 OR 我的聚收藏展开单条添加:2）
        *@return {String} htmlstr 返回解析好的HTML字符串
        *@example 
        *juFavbox.parseData(data,0);
        */
        parseData:function(_data,_type){
            var htmlstr=""; 
            if(_type!==2){
                htmlstr = "<div class='itemlist J_itemlist'>";
            }
            //数据过滤处理
            if(_data && _data.length){
                for (var i = 0; i < _data.length; i++) {
                    if(_data[i].id) continue;
                    _data.splice(i,1);
                };
            }
            if(_data && _data.length){
                for (var i = 0; i < _data.length; i++) {
                    //获得当前商品的开团状态
                    var status = parseInt(_data[i].onlineStartTime)>new Date().getTime()?true:false;
                    //获得商品id
                    var id = _data[i]['id'];
                    //获取连接地址
                    var itemUrl = detailDomain + "home.htm?id="+id;
                    //获取图片地址
                    var picUrl = prePicUrl + _data[i]['picUrl']+"_100x100.jpg";
                    //获取商品标题
                    var shortName = _data[i]['shortName'];
                    //处理过后的标题
                    var realTitle = juFavbox.addtitdot(S.trim(shortName));
                    //获取价格颜色cls,根据开团时间判断是否已开团中
                    var clsPrice = status?"green":"red";
                    //是否天猫积分商品
                    var isTmallPointExchange = _data[i]['isTmallPointExchange'];
                    //天猫积分数
                    var tmallPoint = isTmallPointExchange && parseInt(_data[i]['tmallPoint']);
                    //获取团购价
                    var activityPrice = parseInt(_data[i]['activityPrice'])/100;
                    //获取原价
                    var originalPrice = parseInt(_data[i]['originalPrice'])/100;
                    //购买人数
                    var soldCount = _data[i]['soldCount']?(_data[i]['soldCount']+"人已购买"):"团购进行中";
                    //是否卖光
                    var isLock = _data[i]['isLock'];
                    if(isLock==0 && !status){
                        //让价格颜色变为灰色
                        clsPrice = "gray";
                        //显示卖光了
                        soldCount = "卖光了";
                    }
                    //开团时间
                    var onlineStartTime =  new Date(parseInt(_data[i]['onlineStartTime'])).formatAs('MM月DD日 hh:mm开团',true);
                    // 拼接html
                    htmlstr +=  "<div class='item J_item' data-id='"+id+"'>";
                        htmlstr += "<div class='itemframe'>";
                        htmlstr +=  "<div class='pic'>";
                            htmlstr +=  "<a target='_blank' href='"+itemUrl+"' title='"+shortName+"'><img src='"+picUrl+"' width='100' height='66'></a>";
                        htmlstr +=  "</div>";
                        htmlstr +=  "<div class='title'><a target='_blank' href='"+itemUrl+"' title='"+shortName+"'>"+realTitle+"</a></div>";
                        htmlstr +=  "<div class='price'>";
                        if(isTmallPointExchange) { //天猫积分商品
                            htmlstr +=  "<span class='"+clsPrice+" point'> <strong>"+tmallPoint+"</strong><em> 天猫积分</em></span>";
                        }
                        else{
                            htmlstr +=  "<span class='"+clsPrice+"'>￥<strong>"+activityPrice+"</strong></span>";
                        }

                        htmlstr +=  " ￥<span class='del'>"+originalPrice+"</span>";
                        htmlstr +=  "</div>";
                        if(status){
                            htmlstr += "<div>"+onlineStartTime+"</div>";
                        }else{
                            htmlstr += "<div>"+soldCount+"</div>";
                        }
                        htmlstr +=  "</div>";
                        //只有我的聚收藏才有删除按钮
                        if(_type==0 || _type==2){
                            htmlstr +=  "<i class='icon-del J_icondel'></i>";
                        }
                    htmlstr +=  "</div>";
                };
                if(_type==1){
                    $(J_surmsg).show();
                }    
            }else{
                if(_type==0){
                    htmlstr+="<div class='nodata'>亲，你是啥都看不上呢还是啥也没看？里面好空哦...</div>";
                }
                if(_type==1){
                    $(J_surmsg).hide();
                }
            }
            if(_type!==2){
                htmlstr += "</div>";
            }
            return htmlstr;
        },
        /**
        *@function
        *@name addtitdot
        *@memberOf juFavbox
        *@description 处理标题长度
        *@param {String} _tit 待处理的标题
        *@return {String} 返回处理好的标题
        *@example 
        *juFavbox.addtitdot("这里是标题");
        */
        addtitdot:function (_tit){
            var count = 0;
            for (var i = 0; i < _tit.length; i++) {
                count += _tit.charCodeAt(i) <= 128 ? 0.5 : 1;
                if (Math.round(count) <= 10) {
                    if(i==_tit.length-1){
                        return _tit;
                    }
                    continue;
                } else {
                    return _tit.substr(0, i) + "...";
                }
            }
        }
    };
    return juFavbox;
},{
    requires : ['gallery/kscroll/1.2/index','gallery/RichDate/1.0/index','jbc/julogin/1.0.6/','sizzle']
});