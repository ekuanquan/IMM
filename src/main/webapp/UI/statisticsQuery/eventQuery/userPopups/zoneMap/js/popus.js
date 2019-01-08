
(function() {
    $.extend($.fn, {
        //提示框组件
        alert: function(options) {
            var defaults = {
                cancelBtnLbl: '取消',
                confirmBtnLbl: '确定',
                selected:null,
                selectMainSizeWidth: 300,
                selectMainSizeHeight: 176,
                wrapperId:"wrapper",
                draggableId:"draggable",
                kuangkuangId:"kuangkuang",
                jsonSelect:[],
                confirmIsTrue:true,
                cancelCallback: null,
                confirmCallback: null,
                closeCallback:null
            };
            var settings = $.extend(defaults, options || {}),
                $this;
            function initialize() {
                if ($("#selectMainDiv").length > 0) {
                    $("#selectMainDiv").remove();
                }
                if ($("#selectBottomDiv").length > 0) {
                    $("#selectBottomDiv").remove();
                }
                var selectMainDiv = $("<div></div>");
                var selectBottomDiv = $("<div></div>");

                selectBottomDiv.css({
                    "opacity": 0,
                    "float": "left",
                    "top": "0px",
                    "left": "0px",
                    "width": "100%",
                    "height": "100%",
                    "display": "inline-block",
                    "position": "absolute",
                    "z-index": "999",
                    "background-color": "black",

                });
                selectBottomDiv.attr({
                    id: "selectBottomDiv"

                });
                var topy=getTop();
                var leftx=getLeft();
                selectMainDiv.css({
                    "top": topy+'px',
                    "left": leftx+'px',
                    "width": settings.selectMainSizeWidth + 'px',
                    "height": settings.selectMainSizeHeight + 'px',
                    "position": "absolute",
                    "display": "inline-block",
                    "z-index": "1000",
                    "background-color": "#FFF",
                    "border":"1px solid #d9d9d9",
                });

                selectMainDiv.attr({
                    id: "selectMainDiv"

                });

                //用户防区编号div star
                var firstDiv = $("<div></div>");
                firstDiv.css({
                    "width":"100%",
                    "height":"35px",
                    "line_height":"35px",
                    "margin-top":"10px",
                });

                firstDiv.attr({
                    id: "firstDiv"
                });

                selectMainDiv.append(firstDiv);


                var firstLeftDiv = $("<div></div>");
                firstLeftDiv.css({
                    "width":"100px",
                    "height":"35px",
                    "line-height":"35px",
                    "float":"left",
                    "font-size":"14px",
                    "text-align":"left",
                    "margin-left":"10px"
                });

                firstLeftDiv.attr({
                    id: "firstLeftDiv"
                });
                firstLeftDiv.html("用户防区编号");
                firstDiv.append(firstLeftDiv);

                var firstRightDiv = $("<div></div>");
                firstRightDiv.css({
                    "width":"184px",
                    "height":"35px",
                    "line-height":"35px",
                    "float":"left"
                });

                firstRightDiv.attr({
                    id: "firstRightDiv"
                });
                firstDiv.append(firstRightDiv);

                //用户防区编号select
                var ownerZoneName = $('<select id="ownerZoneName"></select>');
                ownerZoneName.css({
                    "width":"182px",
                    "height":"22px",
                    "margin-top":"8px"
                });
                firstRightDiv.append(ownerZoneName);

                var jsonSelect=settings.jsonSelect;
                if(jsonSelect.length>0) {
                    ownerZoneName.append(getOption());
                }

                //用户防区编号div end

                //防区位置div star
                var secondDiv = $("<div></div>");
                secondDiv.css({
                    "width":"100%",
                    "height":"35px",
                    "line_height":"35px",
                });

                secondDiv.attr({
                    id: "secondDiv"
                });

                selectMainDiv.append(secondDiv);


                var secondLeftDiv = $("<div></div>");
                secondLeftDiv.css({
                    "width":"100px",
                    "height":"35px",
                    "line-height":"35px",
                    "float":"left",
                    "font-size":"14px",
                    "text-align":"left",
                    "margin-left":"10px"
                });

                secondLeftDiv.attr({
                    id: "secondLeftDiv"
                });
                secondLeftDiv.html("防区位置");
                secondDiv.append(secondLeftDiv);

                var secondRightDiv = $("<div></div>");
                secondRightDiv.css({
                    "width":"184px",
                    "height":"35px",
                    "line-height":"35px",
                    "float":"left"
                });

                secondRightDiv.attr({
                    id: "secondRightDiv"
                });
                secondDiv.append(secondRightDiv);

                //防区位置input atPos
                var atPos = $('<input type="text" readonly="true" id="atPos"/>');
                atPos.css({
                    "width":"176px",
                    "margin-top":"8px",
                    "color":"#898989"
                });
                secondRightDiv.append(atPos);

                //防区位置div end

                //探头类型div star
                var thirdDiv = $("<div></div>");
                thirdDiv.css({
                    "width":"100%",
                    "height":"35px",
                    "line_height":"35px",
                });

                thirdDiv.attr({
                    id: "thirdDiv"
                });

                selectMainDiv.append(thirdDiv);


                var thirdLeftDiv = $("<div></div>");
                thirdLeftDiv.css({
                    "width":"100px",
                    "height":"35px",
                    "line-height":"35px",
                    "float":"left",
                    "font-size":"14px",
                    "text-align":"left",
                    "margin-left":"10px"
                });

                thirdLeftDiv.attr({
                    id: "thirdLeftDiv"
                });
                thirdLeftDiv.html("探头类型");
                thirdDiv.append(thirdLeftDiv);

                var thirdRightDiv = $("<div></div>");
                thirdRightDiv.css({
                    "width":"184px",
                    "height":"35px",
                    "line-height":"35px",
                    "float":"left"
                });

                thirdRightDiv.attr({
                    id: "thirdRightDiv"
                });
                thirdDiv.append(thirdRightDiv);

                //探头类型input snType
                var snType = $('<input type="text" readonly="true" id="snType"/>');
                snType.css({
                    "width":"176px",
                    "margin-top":"8px",
                    "color":"#898989"
                });
                thirdRightDiv.append(snType);

                //探头类型div end

                var selectFootDiv = $("<div></div>");
                selectFootDiv.css({
                    "width":"100%",
                    "height":"30px",
                    "margin-top":"10px",
                    "text-align":"center"
                });

                selectFootDiv.attr({
                    id: "selectFootDiv",
                    align:"center"
                });

                selectMainDiv.append(selectFootDiv);
                if(settings.confirmIsTrue) {
                    //确定按钮
                    var confirmBtn = $('<input type="button" id="confirmBtn"/>');
                    confirmBtn.css({
                        "width": "103px",
                        "height": "25px",
                        "vertical-align": "middle",
                        "color": "#fff",
                        "line-height": "21px",
                        "background-color": "#2577e5",
                        "border-radius": "4px",
                        "-webkit-border-radius": "4px",
                        "border": "1px solid #2577e5",
                        "margin-left": "10px"
                    });
                    confirmBtn.val(settings.confirmBtnLbl);
                    selectFootDiv.append(confirmBtn);
                }
                //取消按钮
                var cancelBtn = $('<input type="button" id="cancelBtn"/>');
                cancelBtn.css({
                    "width":"103px",
                    "height":"25px",
                    "margin-left":"10px",
                    "vertical-align":"middle",
                    "color":"#fff",
                    "line-height":"21px",
                    "background-color":"#c30010",
                    "border-radius":"4px",
                    "-webkit-border-radius":"4px",
                    "border":"1px solid #c30010",
                    "margin-left":"10px"
                });
                cancelBtn.val(settings.cancelBtnLbl);
                selectFootDiv.append(cancelBtn);


                $("#"+settings.kuangkuangId).append(selectBottomDiv);
                $("#"+settings.wrapperId).append(selectMainDiv);

                if(settings.selected!=null) {
                    ownerZoneName.val(settings.selected);
                    ownerZoneName.attr("disabled","false");
                }
                selected();
                $("#confirmBtn").hover(function(){
                    $("#confirmBtn").css("background-color","#1b5fde");
                },function(){
                    $("#confirmBtn").css("background-color","#2577e5");
                });
                $("#confirmBtn").bind('click', function () {
                    confirmBtnClickHandler();
                });
                $("#cancelBtn").bind('click', function () {
                    cancelBtnClickHandler();
                });
                $("#ownerZoneName").bind('change', function () {
                    selected();
                });

                if(!settings.confirmIsTrue) {
                    selectBottomDiv.bind('click', function () {
                        $("#selectMainDiv").remove();
                        $("#selectBottomDiv").remove();
                        if (settings.closeCallback && typeof settings.closeCallback == 'function') {
                            settings.closeCallback();
                        }
                    });
                }
            }
            function selected() {
                var ownerZoneNamesel=$("#ownerZoneName").val();
                if(ownerZoneNamesel==null&&settings.selected!=null)
                {
                    ownerZoneNamesel=settings.selected;
                }
                noChang(ownerZoneNamesel)
            }
            //取消按钮事件
            function cancelBtnClickHandler() {
                $("#selectMainDiv").remove();
                $("#selectBottomDiv").remove();

                var data={
                    "x":0,
                    "y":0,
                    "number":""
                };
                //删除json数据
                var jsonArr=$("#"+settings.wrapperId).data("draggableJson");
                for(var i=0;i<jsonArr.length;i++){
                    if(jsonArr[i].id==settings.draggableId){
                        data.x=jsonArr[i].x;
                        data.y=jsonArr[i].y;
                        data.ownerZoneName=jsonArr[i].ownerZoneName;
                        jsonArr.splice(i,1);
                        $("#"+settings.wrapperId).data("draggableJson",jsonArr);
                    }
                }
                $("#"+settings.draggableId).remove();
                if (settings.cancelCallback && typeof settings.cancelCallback == 'function') {
                    settings.cancelCallback(data);
                }
            }
            function confirmBtnClickHandler() {
                var ownerZoneNamesel=$("#ownerZoneName").val();
                if(ownerZoneNamesel.length>0) {
                    $("#selectMainDiv").remove();
                    $("#selectBottomDiv").remove();

                    var data={
                        "x":0,
                        "y":0,
                        "ownerZoneName":""
                    };
                    //保存时保存编号
                    var jsonArr=$("#"+settings.wrapperId).data("draggableJson");
                    for(var i=0;i<jsonArr.length;i++){
                        if(jsonArr[i].id==settings.draggableId){
                            jsonArr[i].ownerZoneName=ownerZoneNamesel;
                            data.x=jsonArr[i].x;
                            data.y=jsonArr[i].y;
                            data.ownerZoneName=jsonArr[i].ownerZoneName;
                            $("#"+settings.wrapperId).data("draggableJson",jsonArr);
                            /*var str="id:"+di+"  x:"+jsonArr[i].x+"  y:"+jsonArr[i].y;
                             alert(str);*/

                            $("#"+settings.draggableId+"Number").html(ownerZoneNamesel).css({
                                "background-color":"#000",
                                "color":"#fff"
                            });
                        }
                    }
                    if (settings.confirmCallback && typeof settings.confirmCallback == 'function') {
                        settings.confirmCallback(data);
                    }
                }
            }
            function  getLeft() {
                var kuangkuang=$("#"+settings.kuangkuangId)[0];
                var wrapper=$("#"+settings.wrapperId)[0];
                var draggable=$("#"+settings.draggableId)[0];
                var leftx=draggable.offsetLeft+28;
                var width=settings.selectMainSizeWidth;

                var surplusWidth=kuangkuang.offsetWidth-(leftx-kuangkuang.offsetLeft);

                if(surplusWidth < width){
                    leftx=leftx-width-28;
                }
                return leftx;
            }

            function  getTop() {
                var kuangkuang=$("#"+settings.kuangkuangId)[0];
                var wrapper=$("#"+settings.wrapperId)[0];
                var draggable=$("#"+settings.draggableId)[0];
                var Topy=draggable.offsetTop+33;
                var height=settings.selectMainSizeHeight;

                var surplusheight=kuangkuang.offsetHeight-(Topy-kuangkuang.offsetTop);

                if(surplusheight < height){
                    Topy=Topy-height-33;
                }
                return Topy;
            }
            function noChang(ownerZoneNamesel) {
                var jsonSelect=settings.jsonSelect;
                //设置选择值
                for(var si=0;si<jsonSelect.length;si++) {
                    if(ownerZoneNamesel==jsonSelect[si].ownerZoneName){
                        setSelectec(jsonSelect[si].atPos,jsonSelect[si].snTypeName);
                    }
                }
            }
            function getOption() {
                //生成下拉框选项
                var option="";
                var isSelected=false;

                //已添加标签json数组
                var jsonArr=$("#"+settings.wrapperId).data("draggableJson");
                var jsonSelect=settings.jsonSelect;
                //添加下拉框选项
                for(var si=0;si<jsonSelect.length;si++){
                    var isContent=false;//是否已经添加该标签
                    for(var i=0;i<jsonArr.length;i++){
                        if(jsonArr[i].ownerZoneName==jsonSelect[si].ownerZoneName){
                            isContent=true;
                            option+="<option value='"+jsonSelect[si].ownerZoneName+"' disabled='true'>"+jsonSelect[si].ownerZoneName+"</option>";
                        }
                    }
                    if(!isContent){
                        if(!isSelected){
                            isSelected=true;
                            option+="<option value='"+jsonSelect[si].ownerZoneName+"' selected>"+jsonSelect[si].ownerZoneName+"</option>";
                        }
                        else{
                            option+="<option value='"+jsonSelect[si].ownerZoneName+"'>"+jsonSelect[si].ownerZoneName+"</option>";
                        }

                    }
                }
                return option;
            }
            initialize();
        },
    });
})(jQuery)
function setSelectec(atPos, snType){
    $("#atPos").val(atPos);
    $("#snType").val(snType);
}
