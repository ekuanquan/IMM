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
    var form1=null;
    var platformPojo  =parent.getMain();
    window.addinit = _init;
    window.showLocation = _showLocation;
    window.getArea = _getArea;
    window.sure = _sure;
    window.isEmpty = isEmpty;

    var _global = {
        popusName:'',
        top:parent
    };
    function _init(){
        //select可输入
        $('#devId').editableSelect({
            effects: 'default',
        });
        $("#devId_sele").attr("maxlength","9").attr("datatype","16number").attr("nullmsg","设备编号不能为空").attr("errormsg","请输入设备编号").attr("onblur","isEmpty('devId_sele');");
        $("#devId_sele").bind("input propertychange",function(){
            var devId = $("#devId_sele").val();
            if(devId.length>5){
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
        //失去焦点后将值赋给devId input
        $("#devId_sele").bind("blur",function(){
            $("#devId").val($("#devId_sele").val());
            //console.log($("#devId").val());
        });
        $("#areaname").click(function(){_devicePopusManager('openArea')});
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

        var platform_name = platformPojo.platform_name;
        var platform_id = platformPojo.platform_id;
        $('#platformId').val(platform_name).data('key',platform_id);
        isCopy();
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
            $("#areaname").val(areaname.name);
            areaId = areaname.id;
        $("#areanameXin").removeClass("prompt");
        $("#areaname").blur();
    }

    //弹窗开始
    function _devicePopusManager(popusPage_str) {

        switch (popusPage_str) {
           /* case 'selectDevice':
                _global.popusName = 'selectDevice';
                _open_selectDevice();
                break;*/
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
        var object = {  "devId":pad2($("#devId").val()),
                        "devName":$("#devName").val(),
                        "pnlActID":$("#pnlActID").val(),
                        "areaId":areaId,
                        "devType":1,
                        "devModelId":$("#devModelId").val(),                    //拿到的是设备型号的编号不是设备型号名称
                        "instMan":$("#instMan").val(),
                        "telAddr":$("#telAddr").val(),
                        "pnlTel":$("#pnlTel").val(),
                        "devInstDate":$("#installTime_input").val(),
                        "devLng":$("#line").val(),
                        "devlat":$("#column").val(),
                        "keyboardAddr":$("#keyboardAddr").val(),
                        "pnlAddr":$("#pnlAddr").val(),
                        "pnlPowerAddr":$("#pnlPowerAddr").val(),
                        "instUnit":$("#instUnit").val(),
                        "pnlHdTel":$("#pnlHdTel").val(),
                        "RegexPWD":$("#RegexPWD").val(),
                        "fMemo":$("#fMemo").val(),
                        "manufacturer":$("#manufacturer").val(),
                        "platformId":$('#platformId').data('key')
        };
        console.log(JSON.stringify(object));
      var end =   post_sync(object, "../../../../addDevice/addAlarmhost.do");

      if(end.result.code == "200"){
          //点击报警主机显示报警主机列表
          parent.clickdeviceright("alarmMainframe_tab");
          parent.closePopus();
          _global.top.setPopupsRowJson(object);
          _global.top.devicePopusManager('editDevice');
          //parent.closePopus();
      }else {
          parent.alertTip(end.result.message,2000,null);
      }

    }

    function openDevicePlay(){          //打开设备型号下拉列表
        var devModelId = document.getElementById("devModelId");
        if(aun==0){
           var model =  getDevModel();
            for(var i=0; i<model.length; i++){
                $("#devModelId").append("<option value='"+model[i].devModelId+"'>"+model[i].devModelName+"</option>");
            }
           $('#devModelId').searchableSelect();
            $(".searchable-select-input").css({width:"192px"});
            $("#devModelIdXin").removeClass("prompt");
            aun=1;
        }
    }

    function getDevModel(){              //拿到数据库设备型号
        var devType = {devType:1};
        var getMode = post_sync(devType, "../../../../addDevice/getDevModel.do");
        return  getMode;
    }

   function check(){
       form1 = $("#signupForm").validate({
            rules: {
                deaId: {
                //    required:true,
                    maxlength:12,
                },
                devName: {
                //    required:true,
                    minlength:3,
                    maxlength:10,
                },
                pnlActID: {
                //    required:true,
                    minlength:5,
                    maxlength:20,
                },
                areaname: {
                //    required: true,
                },
                devModelId: {
                //    required: true,
                },
                installTime_input: {
                //    required: true,
                },
                line: {
                //    required:true,
                    number:true
                },
                column: {
                //    required:true,
                    number:true
                }
            },
            messages: {
                deaId: {
                    required:"请输入设备编号！",
                    maxlength:"最大长度为12！"
                },
                deaName: {
                    required:"请输入设备名称！",
                    minlength: "最小长度为3！",
                    maxlength:"最大长度为10！"
                },
                pnlActID: {
                    required:"请输入关联设备编号！",
                    minlength: "最小长度为5！",
                    maxlength:"最大长度为20！"
                },
                areaname: {
                    required: "请输入所属区域！",
                },
                devModelId: {
                    required: "请输入设备型号！",
                },
                installTime_input: {
                    required: "请输入安装时间！",
                },
                line: {
                    required:"请输入经度！",
                    number: "请输入正确的数字！",
                },
                column:{
                    required:"请输入纬度！",
                    number: "请输入正确的数字！",
                }
            }
        });
   }

    function alterErrot(){
        alert("最大长度为4！");
    }

    function checkNull(){                                                                                   //校验是否为空
        var devId = $("#devId").val();
        var devName = $("#devName").val();
        var pnlActID = $("#pnlActID").val();
        var areaname = $("#areaname").val();
        var devModelId = $("#devModelId").val();
        var installTime_input = $("#installTime_input").val();
        var line = $("#line").val();
        var column = $("#column").val();
        if(devId==''){
            $("#devIdXin").addClass("prompt");
            $("#devId").bind('input porpertychange',function(){
                if($("#devId").val()!=''){
                    $("#devIdXin").removeClass("prompt");
                }
            });
        }
        if(devName==''){
            $("#devNameXin").addClass("prompt");
            $("#devName").bind('input porpertychange',function(){
                if($("#devName").val()!=''){
                    $("#devNameXin").removeClass("prompt");
                }
            });
        }
        if(pnlActID==''){
            $("#pnlActIDXin").addClass("prompt");
            $("#pnlActID").bind('input porpertychange',function(){
                if($("#pnlActID").val()!=''){
                    $("#pnlActIDXin").removeClass("prompt");
                }
            });
        }
        if(areaname==''){
            $("#areanameXin").addClass("prompt");
            $("#areaname").bind('input porpertychange',function(){
                if($("#areaname").val()!=''){
                    $("#areanameXin").removeClass("prompt");
                }
            });
        }
        if(devModelId==''||devModelId==null){
            $("#devModelIdXin").addClass("prompt");
            $("#devModelId").bind('select porpertychange',function(){
                if($("#devModelId").val()!=''){
                    $("#devModelIdXin").removeClass("prompt");
                }
            });
        }
        if(installTime_input==''||installTime_input==null){
            $("#installTime_inputXin").addClass("prompt");
            $("#installTime_input").bind('select porpertychange',function(){
                if($("#installTime_input").val()!=''){
                    $("#installTime_inputXin").removeClass("prompt");
                }
            });
        }
        if(line==''||line==null){
            $("#lineXin").addClass("prompt");
            $("#line").bind('input porpertychange',function(){
                if($("#line").val()!=''){
                    $("#lineXin").removeClass("prompt");
                }
            });
        }
        if(column==''||column==null){
            $("#columnXin").addClass("prompt");
            $("#column").bind('input porpertychange',function(){
                if($("#column").val()!=''){
                    $("#columnXin").removeClass("prompt");
                }
            });
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
            _global.bool=true;
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

    function alte(){
        alert("adasfdsdfsafasfasf");
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
        return pad2("0" + num);
    }
    function isCopy(){
        var copyDevId=parent.getCopyDevId();
        if(copyDevId.length>0){
            post_async({"devId": copyDevId},"/IntegratedMM/QueryAlarmhostInfo.do",function (data) {
                var deviceData = data.result;
                _global.deviceData=deviceData;
                areaId = deviceData.areaId;
                $("#devName").val(deviceData.devName);
                $("#pnlActID").val(deviceData.pnlActID);
                $("#areaname").val(deviceData.areaName);
                $("#devType").val(deviceData.devTypeName);
                openDevicePlay1();
                $("#devModelId").val(deviceData.devModelId);
                $('#devModelId').searchableSelect();
                $(".searchable-select-input").css({width:"192px"});

                $("#instMan").val(deviceData.instMan);
                $("#telAddr").val(deviceData.telAddr);
                $("#pnlTel").val(deviceData.pnlTel);
                $("#installTime_input").val(deviceData.devInstDate);
                $("#line").val(deviceData.devLng);
                $("#column").val(deviceData.devlat);
                $("#keyboardAddr").val(deviceData.keyboardAddr);
                $("#pnlAddr").val(deviceData.pnlAddr);
                $("#pnlPowerAddr").val(deviceData.pnlPowerAddr);
                $("#instUnit").val(deviceData.instUnit);
                $("#pnlHdTel").val(deviceData.pnlHdTel);
                $("#RegexPWD").val(deviceData.regexPWD);
                $("#fMemo").val(deviceData.fMemo);
                $("#manufacturer").val(deviceData.manufacturer);
                $('#platformId').val(deviceData.platformName).data('key',deviceData.platformId);
                parent.setCopyDevId("");
            });
        }
        else{
            $("#devModelId").click(function(){
                openDevicePlay();
            });
            $("#devModelId").click();
        }
    }
    function openDevicePlay1(){          //打开设备型号下拉列表
        var devModelId = document.getElementById("devModelId");
        if(aun==0){
            var model =  getDevModel();
            devModelId.options.length=0;
            for(var i=0; i<model.length; i++){
                $("#devModelId").append("<option value='"+model[i].devModelId+"'>"+model[i].devModelName+"</option>");
            }
            aun=1;
        }
    }
})(window,jQuery);