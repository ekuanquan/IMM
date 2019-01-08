/**
 * Created by Administrator on 2017/8/12.
 */

(function() {
    $.extend($.fn, {
        addicon: function(options) {
            var defaults = {
                containment: "wrapper",
                iconId:"draggable",
                src:'images/addarea.jpg',
            };
            var settings = $.extend(defaults, options || {}),
                $this;
            function initialize() {
                var wrapper = $("#"+settings.containment);
                var iconDiv = $("<div></div>");
                iconDiv.css({
                    "width": '28px',
                    "height": '33px',
                    "cursor":"pointer",
                });

                iconDiv.attr({
                    id: settings.iconId,
                });

                var iconImgDiv = $("<div></div>");
                iconImgDiv.css({
                    "width": '100%',
                    "height": '16px',
                });

                iconImgDiv.attr({
                    id: settings.iconId+"iconImgDiv",
                });
                iconDiv.append(iconImgDiv);

                var iconImg = $("<img/>");
                iconImg.css({
                    "margin":"auto",
                    "float":"left"
                });

                iconImg.attr({
                    id: settings.iconId+"img",
                    src:settings.src
                });
                iconImgDiv.append(iconImg);

                var numberDiv = $("<div></div>");
                numberDiv.css({
                    "width": '28px',
                    "height": '16px',
                    "line-height": '16px',
                    "font-size":"12px"
                });

                numberDiv.attr({
                    id: settings.iconId+"Number",
                });
                iconDiv.append(numberDiv);

                wrapper.append(iconDiv);
            }
            initialize();
        },
        redraw:function(options,isCenter,pos){
            var $elem = $("#"+options.wrapperId);
            var kuangkuang = $('#' + options.kuangkuangId);
            var zoom = options["zoom"];
            var iWidth = options["iWidth"];
            var iHeight = options["iHeight"];
            if(isCenter){
                var left = (kuangkuang.width() - iWidth*zoom) / 2;
                var top = (kuangkuang.height() - iHeight*zoom) / 2;
                console.log("the left is "+left);
                $elem.css({"left":left+"px",top:top+"px"})
            }
            else if(pos){
                var cOffset = $("#"+options["containerId"]).offset();
                var offset = $elem.offset();
                var width = $elem.width();
                var height = $elem.height();
                var x = (pos["x"] - offset["left"]) / width;
                var y = (pos["y"] - offset["top"]) / height;
                var left = pos["x"] - iWidth*zoom * x;
                var top = pos["y"] - iHeight*zoom * y;
                $elem.css({"left":left-cOffset.left+"px",top:top-cOffset.top+"px"});
            }
            $elem.width(iWidth*zoom);
            $elem.height(iHeight*zoom);

            var data = $.fn.getDraggableJson(options.wrapperId);
            var len = data.length;
            for(var i=0;i<len;i++){
                var info = data[i];
                var x = $elem.width() * info.x - 14 /*+ $elem.offset().left*/;
                var y = $elem.height() * info.y- 33  /*+ $elem.offset().top*/;
                $("#"+info["id"]).css({"left":x,"top":y});
            }
        },
        showBackground:function(setting){
            var _self = this;
            var $elem = $("#"+setting.wrapperId);
            $elem.attr("style","background:url('"+setting.backgroundIcon+"') no-repeat;background-size: 100% 100%;");

            var kuangkuang=$("#"+setting.kuangkuangId);
            var kwidth=kuangkuang.width()-28;
            var kheight=kuangkuang.height()-33;
            var img = new Image();
            img.src = setting.backgroundIcon;

            if(img.complete) {
                var x=kwidth/img.width;
                var y=kheight/img.height;
                var lv=x<y?x:y;
                setting["iWidth"] = img.width;
                setting["iHeight"] = img.height;
                _self.setting = setting;
                setting["zoom"] = lv;
                $.fn.redraw(setting,true);
            }
            else {
                img.onload = function(){
                    var x=kwidth/img.width;
                    var y=kheight/img.height;
                    var lv=x<y?x:y;
                    setting["iWidth"] = img.width;
                    setting["iHeight"] = img.height;
                    _self.setting = setting;
                    setting["zoom"] = lv;
                    $.fn.redraw(setting,true);
                };
                img.onerror = function(){

                }
            }
        },
        initialize:function(settingsList,number,x,y,index) {
            var wrapper = $("#"+settingsList.wrapperId);
            var iconDiv = $("<div></div>");
            iconDiv.css({
                "position": "absolute",
                "top":y,
                "left":x,
                "width": '28px',
                "height": '33px',
                "cursor":"pointer",
            });

            iconDiv.attr({
                id: settingsList.iconId+index,
            });

            var iconImgDiv = $("<div></div>");
            iconImgDiv.css({
                "width": '100%',
                "height": '16px',
            });

            iconImgDiv.attr({
                id: settingsList.iconId+index+"iconImgDiv",
            });
            iconDiv.append(iconImgDiv);

            var iconImg = $("<img/>");
            iconImg.css({
                "margin":"auto",
                "float":"left"
            });

            iconImg.attr({
                id: settingsList.iconId+index+"img",
                src:settingsList.src
            });
            iconImgDiv.append(iconImg);

            var numberDiv = $("<div></div>");
            numberDiv.css({
                "width": '28px',
                "height": '16px',
                "line-height": '16px',
                "font-size":"12px",
                "background-color":"#000",
                "color":"#fff"
            });

            numberDiv.attr({
                id: settingsList.iconId+index+"Number",
            });
            numberDiv.text(number);
            iconDiv.append(numberDiv);
            wrapper.append(iconDiv);

            /*var el = document.getElementById(settingsList.iconId+index);
             el.style.left = x + "px";
             el.style.top = y + "px";*/
        },
        addiconList: function(optionsList) {
            var _self = this;
            var defaultsList = {
                iconId:"draggable",
                addbtnId:"addbtn",//添加按钮id
                kuangkuangId:"kuangkuang",//防区图外框div id
                bianbianId:"bianbian",//防区图边框div id
                wrapperId:"wrapper1",//防区图div id
                src:'images/addarea.jpg',//图标图片
                jsonSelect:[],//下拉框数据json
                dataList:[],
                DragDownCallBack:null,
                delCallBack:null,
                mapId:null
            };
            var settingsList = $.extend(defaultsList, optionsList || {}),
                $this;
            $.fn.showBackground(settingsList);

            if(settingsList.dataList.length>0) {
                for(var i=0;i<settingsList.dataList.length;i++){
                    if((settingsList.dataList[i].x==null||settingsList.dataList[i].x==0||settingsList.dataList[i].x=="")&&
                        (settingsList.dataList[i].y==null||settingsList.dataList[i].y==0||settingsList.dataList[i].y=="")) {

                    }else{
                        var mapId = settingsList.dataList[i].mapId;
                        //是这个图上面的图标才被显示
                        if(settingsList.mapId == mapId){
                            var wrapper = $("#" + settingsList.wrapperId);
                            var kuangkuang = $('#' + settingsList.kuangkuangId);

                            //console.log("_global.zonePojo",JSON.stringify(settingsList.dataList))
                            var x = wrapper.width() * settingsList.dataList[i].x - 14 ;//+ wrapper.offset().left - kuangkuang.offset().left;
                            var y = wrapper.height() * settingsList.dataList[i].y - 33 ;//+ wrapper.offset().top - kuangkuang.offset().top;


                            /*console.log("ix:"+settingsList.dataList[i].x+" top:"+wrapper.offset().left+" width:"+wrapper.width());
                            console.log("iy:"+settingsList.dataList[i].y+" top:"+wrapper.offset().top+" height:"+wrapper.height());
                            console.log(" i:"+i+" x:"+x+" y:"+y);*/
                            $.fn.initialize(settingsList,settingsList.dataList[i].roleZoneName, x, y, i);
                            addJson(settingsList.iconId + i, settingsList.dataList[i].x, settingsList.dataList[i].y, settingsList.dataList[i].roleZoneName, settingsList.wrapperId);

                            new DragDown(settingsList.iconId + i, settingsList.wrapperId,settingsList.kuangkuangId, bindClick, function (data) {
                                if (settingsList.DragDownCallBack && typeof settingsList.DragDownCallBack == 'function') {
                                    settingsList.DragDownCallBack(data);
                                }
                            });
                        }
                        
                    }
                }

                index=settingsList.dataList.length;
                var jsonArr=$("#"+settingsList.wrapperId).data("draggableJson");
                if(jsonArr.length==settingsList.jsonSelect.length){
                    $("#"+settingsList.addbtnId).attr("disabled","true");
                }
            }

            $("#"+optionsList["containerId"]).removeClass("falsePicture");

            $('#'+optionsList["containerId"]).bind('mousewheel DOMMouseScroll', function(event, delta, deltaX, deltaY) {
                var delta = -event.originalEvent.wheelDelta || event.originalEvent.detail;
                var zoom = _self.setting.zoom||1;
                var setting = _self.setting;
                if(delta>0){
                    zoom -= setting["zoomSize"];
                    zoom = zoom <= setting["minZoom"] ? setting["minZoom"] : zoom;
                }else{
                    zoom += setting["zoomSize"];
                    zoom = zoom >= setting["maxZoom"] ?  setting["maxZoom"] : zoom;
                }
                var pos = {x:event.originalEvent.clientX,y:event.originalEvent.clientY};
                _self.setting.zoom = zoom;
                $.fn.redraw(setting,false,pos);
                if (window.console && console.log) {
                    console.log("current zoom is "+zoom);
                }
            });

            (function() {
                $('#'+optionsList["containerId"]).mousemove(function(e) {
                    if (!!this.move) {
                        var posix = !this.move_target ? {'x': 0, 'y': 0} : this.move_target.posix,
                            callback = this.call_down || function() {
                                    $(this.move_target).css({
                                        'top': e.pageY - posix.y,
                                        'left': e.pageX - posix.x
                                    });
                                };

                        callback.call(this, e, posix);
                    }
                }).mouseup(function(e) {
                    var width = $(this).width();
                    var left = $(this).offset().left;
                    var top = $(this).offset().top;
                    var height = $(this).height();
                    var isIn = (e.clientX >= left && e.clientX <= left + width)
                        && e.clientY >= top && e.clientY <= top + height
                    if (!!this.move&&isIn) {
                        var callback = this.call_up || function(){};
                        callback.call(this, e);
                        $.extend(this, {
                            'move': false,
                            'move_target': null,
                            'call_down': false,
                            'call_up': false
                        });
                    }
                });

                var $box = $('#'+optionsList["wrapperId"]).mousedown(function(e) {
                    var offset = $(this).offset();
                    var cOffset = $("#"+optionsList["containerId"]).offset();
                    this.posix = {'x': e.pageX - offset.left + cOffset.left, 'y': e.pageY - offset.top + cOffset.top};
                    $.extend(document.getElementById(optionsList["containerId"]), {'move': true, 'move_target': this});
                })/*.on('mousedown', '#coor', function(e) {
                    var posix = {
                        'w': $box.width(),
                        'h': $box.height(),
                        'x': e.pageX,
                        'y': e.pageY
                    };

                    $.extend(document.getElementById(optionsList["containerId"]), {'move': true, 'call_down': function(e) {
                        $box.css({
                            'width': Math.max(30, e.pageX - posix.x + posix.w),
                            'height': Math.max(30, e.pageY - posix.y + posix.h)
                        });
                    }});
                    return false;
                });*/
            })();

            function bindClick(di){
                $("#"+settingsList.addbtnId).attr("disabled","true");
                $.fn.alert({
                    cancelBtnLbl: '删除',//取消按钮文字
                    wrapperId: settingsList.wrapperId,//防区图div Id
                    kuangkuangId: settingsList.kuangkuangId,//防区图大框div Id
                    selected:$("#"+di+"Number").html(),//图标编号
                    draggableId:di,//防区图图标div Id
                    jsonSelect:settingsList.jsonSelect,//下拉框数据json
                    confirmIsTrue: false,//是否有确定按钮
                    cancelCallback: function (data) {
                        $("#"+settingsList.addbtnId).attr("disabled",false);

                        if (settingsList.delCallBack && typeof settingsList.delCallBack == 'function') {
                            settingsList.delCallBack(data);
                        }
                    },
                    closeCallback:function () {
                        //当图标数等于选项数是添加按钮不可用
                        var jsonArr=$("#"+settingsList.wrapperId).data("draggableJson");
                        if(jsonArr.length==settingsList.jsonSelect.length){
                            $("#"+settingsList.addbtnId).attr("disabled","true");
                        }else {
                            $("#"+settingsList.addbtnId).attr("disabled", false);
                        }
                    }
                })
            }
            function addJson(id,x,y,number,divid) {//创建json
                var jsonArr=$("#"+divid).data("draggableJson");
                var jsonflag=false;
                for(var i=0;i<jsonArr.length;i++){
                    if(jsonArr[i].id==id){
                        jsonArr[i].x=x;
                        jsonArr[i].y=y;
                        jsonflag=true;
                        $("#"+divid).data("draggableJson",jsonArr);
                    }
                }
                if(!jsonflag){
                    var jsonStr={
                        "id":id,
                        "x":x,
                        "y":y,
                        "roleZoneName":number
                    }
                    jsonArr.push(jsonStr);
                    $("#"+divid).data("draggableJson",jsonArr);
                }
            }
        },
        setDraggableJson: function(wrapperId,draggableJson){
            if(draggableJson!=null && draggableJson!= undefined){
                $("#"+wrapperId).data("draggableJson",draggableJson);
            }
        },
        getDraggableJson: function(wrapperId){
            var draggableJson = $("#"+wrapperId).data("draggableJson");
            return draggableJson;
        }
    });
})(jQuery)