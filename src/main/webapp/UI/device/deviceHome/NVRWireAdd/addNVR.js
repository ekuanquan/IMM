/**
 * Created by ywhl on 2017/6/8.
 */
$(document).ready(function() {
    $("#signupForm").Validform({
        tiptype:2,
        btnSubmitId:"sure",
        callback:NVRWiresure
    });
    addNVRinit();
});

;(function(window,$){

    var areaId ;
    var aun = 0;
    window.addNVRinit = _init;
    window.showLocation = _showLocation;
    window.getArea = _getArea;
    window.NVRWiresure = _NVRWiresure;
    window.isEmpty = isEmpty;
    window.setGbId=_setGbId;

    var _global={
        top:parent,
        bool:true
    };
    //接收经纬度
    function _showLocation(location) {
        $("#line").val(location.x);
         $("#column").val(location.y);
        $("#line").blur();
        $("#column").blur();
    }
    function _init(){
        //select可输入
        $('#devId').editableSelect({
            effects: 'default',
        });
        $("#devId_sele").attr("maxlength","9").attr("datatype","16number").attr("nullmsg","设备编号不能为空").attr("errormsg","请输入设备编号").attr("onblur","isEmpty('devId_sele');");
        $("#devId_sele").bind("input propertychange",function(){
            var devId = $("#devId_sele").val();
            if(devId.length>=6){
                var param = {
                    type:"devUsed",
                    value:devId
                };
                post_async(param,"/IntegratedMM/identifier/queryIdByLike.do",_callback_getownerId)
            }else{
                $("#devId_editable-select-options ul").empty();
            }

        });
        $("#close,#cancel").click(function(){parent.closePopus();});
        //点击取消按钮，去除失焦事件
        var btn = document.querySelector('#cancel');
        btn.onmousedown = function(event) {event.preventDefault()};
        var close = document.querySelector('#close');
        close.onmousedown = function(event) {event.preventDefault()};

        $("#areaname").click(function(){_devicePopusManager('openArea')});
        $("#choseplace").click(function(){setDeviceLocation()});

        $("#lenameCheckbox").click(function() {
            if ($(this).hasClass('isChecked')) {
                $(this).removeClass('isChecked').addClass('noChecked');
            }else{
                $(this).removeClass('noChecked').addClass('isChecked');
            }
        });
        //失去焦点后将值赋给devId input
        $("#devId_sele").bind("blur",function(){
            $("#devId").val($("#devId_sele").val());
            //console.log($("#devId").val());
        });
        //时间插件 默认为当前时间2017年10月24日14:50:52
        var nowTime = getNowFormatDate();
        nowTime =nowTime.split(" ")[0];
        $("#installTime_input").val(nowTime).bind('focus',function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            this.blur();
        });

      /*  $("#sure").click(function(){sureAddDevice()});*/
        $("#devModelId").click(function(){openDevicePlay();});

        var platformPojo  =parent.getMain();
        var platform_name = platformPojo.platform_name;
        var platform_id = platformPojo.platform_id;
        $('#platformId').val(platform_name).data('key',platform_id);
        $('#videoServer').val(getVideoServerIp());

       /* $("#gbId").click(function() {
            openGBPopus("../../../resource/gbId/gbId.html",{width:360,height:208});
        });*/


        $("#manufacturer").bind("change",function(){
            var manufacturer=$("#manufacturer").val();
            if(manufacturer=="HIK"){
                $("#devPort").val("8000");
            }
            else if(manufacturer=="DH"){
                $("#devPort").val("37777");
            }
            else{
                $("#devPort").val("");
            }
        });
    }
        //发送经纬度
        function setDeviceLocation(){
            var line = $("#line").val();
            var column = $("#column").val();
            var location = {
                "x":line,
                "y":column
            };
            parent.setDeviceLocation(location);
            parent.devicePopusManager("addLocation");
        }

        //弹窗开始
        function _devicePopusManager(popusPage_str) {

            switch (popusPage_str) {
                case 'openArea':
                    _open_openArea();
                    break;
                default:
                    break;
            }
        }

        //树状页面弹窗
        function _open_openArea() {
            _openPopups($('body'),'../../shebeihtml/selectarea.html' , {
                width: 360,
                height: 539
            });
        };
        //弹窗结束
/*    //所属区域显示
    function _getArea(areaname){
        $("#areaname").val(areaname);
    }*/

    //所属区域显示
    function _getArea(areaname){
        $("#areaname").val(areaname.name);
       areaId = areaname.id;
        $("#areaname").blur();
    }

    function sureAddDevice(){       //添加NVR有线设备

        var object = {
            "devId":pad2($("#devId").val()),
            "devName":$("#devName").val(),
            "pnlActID":$("#pnlActID").val(),
            "areaId":areaId,
            "devType":9,
            "devModelId":$("#devModelId").val(),
            "devLoginName":$("#devLoginName").val(),
            "devLoginPwd":$("#devLoginPwd").val(),
            "devIp":$("#devIp").val(),
            "devInstDate":$("#installTime_input").val(),
            "devLng":$("#line").val(),
            "devlat":$("#column").val(),
            "ChannelNum":$("#ChannelNum").val(),
            "pnlAddr":$("#pnlAddr").val(),
            "instMan":$("#instMan").val(),
            "instUnit":$("#instUnit").val(),
            "videoServer":$("#videoServer").val(),
           // "videoServer":"：9000/"+$("#devIp").val()+":8000:HIK:"+$("#ChannelNum").val()+"0:"+$("#devLoginName").val()+":"+$("#devLoginPwd").val()+"/av_stream",
            "devPort":$("#devPort").val(),
            "fMemo":$("#fMemo").val(),
            "manufacturer":$("#manufacturer").val(),
            "platformId":$('#platformId').data('key'),
            "gbId": $("#gbId").val(),
        };
        var end =   post_sync(object, "../../../../addDevice/addNVRhave.do");

        if(end.result.code == "200"){
            parent.clickdeviceright("NVRWired_tab");
            parent.closePopus();
            _global.top.setPopupsRowJson(object);
            _global.top.devicePopusManager('editNVRWire');
        }else {
            parent.alertTip(end.result.message,2000,null);
        }

        //刷新列表
        /*if(end.result.code == "200"){
            parent. parent. parent.
        }*/
        //alert(end.result.message);
        //点击有线NVR显示有线NVR列表并刷新

    }

    function openDevicePlay(){          //打开设备型号下拉列表
        var devModelId = document.getElementById("devModelId");
        var model ;
        if(aun==0){
            model =  getDevModel();
            for(var i=0; i<model.length; i++){
               // devModelId.innerHTML= devModelId.innerHTML + "<option value="+model[i].devModelId+">"+model[i].devModelName+"</option>";
                $("#devModelId").append("<option value='"+model[i].devModelId+"'>"+model[i].devModelName+"</option>");
            }
            /*$("#ChannelNum").val(model[0].ChannelNum);*/
            aun=1;
        }
        $('#devModelId').click(function(){
            //$("#ChannelNum").val($('#devModelId').val());

            for(var n=0; n<model.length; n++){
                if($('#devModelId').val()==model[n].devModelId){
                    $("#ChannelNum").val(model[n].ChannelNum);
                }
            }
        });
    }

    function getDevModel(){              //拿到数据库设备型号
        var devType = {devType:9};
        var getMode = post_sync(devType, "../../../../addDevice/getDevModel.do");
        return  getMode;
    }

    function _NVRWiresure(flag) {
        isEmpty('devId_sele');
        if(_global.bool){
            if(flag){
                sureAddDevice();
            }else {
                parent.alertTip("请填写完整信息",2000,null);
            }
        }
    }
    function isEmpty(field){
        var textValue = $("#"+field).val();
        if(textValue != ""){
            post_async(
                {
                    "validateName":"devId",
                    "validateValue":textValue
                },
                "/IntegratedMM/validate/isCanUse.do",
                validate_callback);
        }
        else{

        }
    }
    function validate_callback(data){
        if(data.result.code == "0"){
            _global.bool = true;
            $("#devId_sele").next().removeClass("Validform_sigh").removeClass("Validform_wrong").addClass("Validform_right");
        }else if(data.result.code == "1"){
            _global.bool = false;
            _global.top.alertFail("该设备编号已经存在",2000,null);
            $("#devId_sele").next().removeClass("Validform_sigh").removeClass("Validform_right").addClass("Validform_wrong");
        }else if(data.result.code == "2"){
            _global.bool = false;
            _global.top.alertFail("该设备编号格式有误",2000,null);
            $("#devId_sele").next().removeClass("Validform_sigh").removeClass("Validform_right").addClass("Validform_wrong");
        }
    }
    //获取可用的编号
    function _callback_getownerId(data) {
        $("#devId_editable-select-options ul").empty();
        if(data.result.code&&data.result.code=="200"){
            var length = data.values.length;
            if(length>10){length=10;}
            for(var i=0;i<length;i++){
                var $option =$("<li></li>");
                $option.attr("value",i);
                $option.text(data.values[i]);
                $option.attr("style","display: list-item;");
                $option.appendTo($("#devId_editable-select-options > ul"));
            }
            $("#devId_editable-select-options").css("display","block");
        }
        $("#devId_editable-select-options ul li").bind("mousedown",function () {
            $("#devId_sele").val(this.innerHTML);
        }).bind("mouseover",function () {
            this.siblings().removeClass("selected");
            this.addClass("selected");
        })
    }
    //设备编号长度最小为9位不足前面补零
    function pad2(num) {
        if ((num + "").length >= 9) return num;
        return pad2("0" + num, 9);
    }

    function _setGbId(gbId) {
        $("#gbId").val(gbId)
    }
})(window,jQuery);


























