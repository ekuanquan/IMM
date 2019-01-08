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
        addiconList: function(optionsList) {
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
            };
            var settingsList = $.extend(defaultsList, optionsList || {}),
                $this;
            function initialize(number,x,y,index) {
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
            }

            if(settingsList.dataList.length>0) {
                for(var i=0;i<settingsList.dataList.length;i++){
                    if((settingsList.dataList[i].x==null||settingsList.dataList[i].x==0||settingsList.dataList[i].x=="")&&
                        (settingsList.dataList[i].y==null||settingsList.dataList[i].y==0||settingsList.dataList[i].y!="")) {

                    }else{
                        var wrapper = $("#" + settingsList.wrapperId);

                        //console.log("_global.zonePojo",JSON.stringify(settingsList.dataList))
                        var x = wrapper.width() * settingsList.dataList[i].x + wrapper.offset().left;
                        var y = wrapper.height() * settingsList.dataList[i].y + wrapper.offset().top;


                        console.log("ix:"+settingsList.dataList[i].x+" top:"+wrapper.offset().left+" width:"+wrapper.width());
                        console.log("iy:"+settingsList.dataList[i].y+" top:"+wrapper.offset().top+" height:"+wrapper.height());
                         console.log(" i:"+i+" x:"+x+" y:"+y);
                        initialize(settingsList.dataList[i].ownerZoneName, x, y, i);
                        addJson(settingsList.iconId + i, settingsList.dataList[i].x, settingsList.dataList[i].y, settingsList.dataList[i].ownerZoneName, settingsList.wrapperId);

                        new DragDown(settingsList.iconId + i, settingsList.wrapperId, bindClick, function (data) {
                            if (settingsList.DragDownCallBack && typeof settingsList.DragDownCallBack == 'function') {
                                settingsList.DragDownCallBack(data);
                            }
                        });
                    }
                }

                index=settingsList.dataList.length;
                var jsonArr=$("#"+settingsList.wrapperId).data("draggableJson");
                if(jsonArr.length==settingsList.jsonSelect.length){
                    $("#"+settingsList.addbtnId).attr("disabled","true");
                }
            }

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
                        "ownerZoneName":number
                    }
                    jsonArr.push(jsonStr);
                    $("#"+divid).data("draggableJson",jsonArr);
                }
            }
        },
    });
})(jQuery)