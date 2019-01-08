/**
 * Created by ywhl on 2017/6/7.
 */
$(document).ready(function() {
    $("#signupForm").Validform({
        tiptype:2,
        btnSubmitId:"sure",
        callback:sure
    });
    addinit();
});

;(function(window,$){

    var areaId ;
    var aun = 0;
    var platformPojo  =parent.getMain();
    window.addinit = _init;
    window.showLocation = _showLocation;
    window.getArea = _getArea;
    window.sure = _sure;
    window.isEmpty = isEmpty;

    var _global={
        top:parent,
        bool:true
    };
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
        $("#choseplace").click(function(){setDeviceLocation()});
        $("#close,#cancel").click(function(){parent.closePopus();});
        //点击取消按钮，去除失焦事件
        var btn = document.querySelector('#cancel');
        btn.onmousedown = function(event) {event.preventDefault()};
        var close = document.querySelector('#close');
        close.onmousedown = function(event) {event.preventDefault()};

        $("#openarea").click(function(){
            _devicePopusManager('openArea');
        });
        //失去焦点后将值赋给devId input
        $("#devId_sele").bind("blur",function(){
            $("#devId").val($("#devId_sele").val());
            console.log($("#devId").val());
        });
        var newtime = getNowFormatDate();
        newtime = newtime.split(" ")[0];
        $("#installTime_input").val(newtime);
        $("#installTime_input").bind('focus',function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            this.blur();
            $("#installTime_inputXin").removeClass("prompt");
        });
        $("#lenameCheckbox").click(function() {
            if ($(this).hasClass('isChecked')) {
                $(this).removeClass('isChecked').addClass('noChecked');
            }else{
                $(this).removeClass('noChecked').addClass('isChecked');
            }
        });
        $("#devModelId").click(function(){openDevicePlay();});
        openDevicePlay();
        var platform_name = platformPojo.platform_name;
        var platform_id = platformPojo.platform_id;
        $('#platformId').val(platform_name).data('key',platform_id);
        $('#akeyServer').val(getAkeyServerIp());
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

    //接收经纬度
    function _showLocation(location1){
        $("#line").val(location1.x);
        $("#column").val(location1.y);
        $("#lineXin").removeClass("prompt");
        $("#columnXin").removeClass("prompt");
        $("#line").blur();
        $("#column").blur();
    }

    //所属区域显示
    function _getArea(areaname){
        $("#openarea").val(areaname.name);
        areaId = areaname.id;
        $("#areanameXin").removeClass("prompt");
        $("#openarea").blur();
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

    function sureAddDevice(){       //添加报警主机设备、
        var communicateLine = $("#communicateLine").val();
        if(communicateLine==""||communicateLine ==null){
            communicateLine = -1;
        }
        var communicateProtocol = $("#communicateProtocol").val();
        if(communicateProtocol==""||communicateProtocol ==null){
            communicateProtocol = -1;
        }
        var object = {
            "devId":pad2($("#devId").val()),
            "devName":$("#devName").val(),
            "pnlActID":$("#pnlActID").val(),
            "areaId":areaId,
            "devType":15,
            "devModelId":$("#devModelId").val(),
            "devLng":$("#line").val(),
            "devlat":$("#column").val(),
            "pnlAddr":$("#pnlAddr").val(),
            "instMan":$("#instMan").val(),
            "instUnit":$("#instUnit").val(),
            "devInstDate":$("#installTime_input").val(),
            "fMemo":$("#fMemo").val(),
            "devSn":$("#devSn").val(),
            "platformId":$('#platformId').data('key'),
            "loginName":$("#devLoginName").val(),
            "loginPwd":$("#devLoginPwd").val(),
            "communicateLine":communicateLine,
            "communicateProtocol":communicateProtocol,
            "manufacturer":$("#manufacturer").val(),
            "tunnelId":0,
            "playCode":0,
            "IP":$("#akeyServer").val(),
            "PORT":$("#devPort").val(),
        };
        console.log(JSON.stringify(object));
      var end =   post_sync(object, "/IntegratedMM/addDevice/addOneClickDev.do");
      if(end.code == "200"){
          //点击一键报警显示列表
          parent.clickdeviceright("AKey_tab");
          parent.closePopus();
          _global.top.setPopupsRowJson(object);
          _global.top.devicePopusManager('editAKey');
      }else {
          parent.alertTip(end.message,2000,null);
      }
    }

    function openDevicePlay(){          //打开设备型号下拉列表
        var devModelId = document.getElementById("devModelId");
        if(aun==0){
           var model =  getDevModel();
            for(var i=0; i<model.length; i++){
                $("#devModelId").append("<option value='"+model[i].devModelId+"'>"+model[i].devModelName+"</option>");
            }
            $("#devModelIdXin").removeClass("prompt");
            aun=1;
        }
    }

    function getDevModel(){              //拿到数据库设备型号
        var devType = {devType:15};
        var getMode = post_sync(devType, "../../../../addDevice/getDevModel.do");
        return  getMode;
    }

    function _sure(flag) {
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
            _global.bool =true;
            $("#devId_sele").next().removeClass("Validform_sigh").removeClass("Validform_wrong").addClass("Validform_right");
        }else if(data.result.code == "1"){
            _global.bool =false;
            _global.top.alertFail("该设备编号已经存在",2000,null);
            $("#devId_sele").next().removeClass("Validform_sigh").removeClass("Validform_right").addClass("Validform_wrong");
        }else if(data.result.code == "2"){
            _global.bool =false;
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
            /*this.siblings().removeClass("selected");
            this.addClass("selected");*/
        })
    }
//设备编号长度最小为9位不足前面补零
    function pad2(num) {
        if ((num + "").length >= 9) return num;
        return pad2("0" + num);
    }

})(window,jQuery);