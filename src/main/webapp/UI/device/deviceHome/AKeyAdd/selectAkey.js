/**
 * Created by ywhl on 2017/6/8.
 */
$(document).ready(function() {
    $("#signupForm").Validform({
        tiptype:2,
        btnSubmitId:"sure",
        callback:NVRhave
    });
    selectNVRinit();
});

;(function(window,$){

    var ownerId;
    var devId;
    var areaId;
    var aun=0;
    window.selectNVRinit = _init;
    window.showLocation = _showLocation;
    window.showareaname = _showareaname;
    window.NVRhave = _NVRhave;
    window.setDevId=_setDevId;

    function _init() {
        $("#cancel").click(function(){parent.parent.closePopus()});
        $("#openarea").click(function(){
            //parent.devicePopusManager('openArea');
            if(ownerId == null || ownerId == '' || ownerId == undefined) {
                parent.devicePopusManager('openArea');
            }
        });
        $("#choseplace").click(function () {
            setDeviceLocation()
        });

        $("#lenameCheckbox").click(function () {
            if ($(this).hasClass('isChecked')) {
                $(this).removeClass('isChecked').addClass('noChecked');
            } else {
                $(this).removeClass('noChecked').addClass('isChecked');
            }
        });
        //时间插件
        $("#installTime_input").bind('focus', function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            this.blur();
        });
        _initData();
        $("#devModelId").click(function(){openDevicePlay()});

        $("#devId").bind("click",function() {
            parent.parent.setDevIdO($("#devId").val());
            parent.parent.setIframeNameO("1");
            //_global.top._setIframeNameO();
            parent.parent.openOtherPopus('../device/deviceHome/EditNumber/editNumber.html',{
                width: 400,
                height: 230
            });
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
        parent.parent.setDeviceLocation(location);
        parent.parent.devicePopusManager("addLocation");
    }
    //接收经纬度
    function _showLocation(location1){
        $("#line").val(location1.x);
        $("#column").val(location1.y);
        $("#line").blur();
        $("#column").blur();
    }

    //所属区域显示
    function _showareaname(areaname){
        $("#openarea").val(areaname.name);
        areaId = areaname.id;
        //$("#areanameXin").removeClass("prompt");
        $("#openarea").blur();
    }


    //查询nvr无线信息
    function _initData(){
        var deviceData = parent.parent.parent.parent.getPopupsRowJson();
        var data = post_sync({"devId": deviceData.devId},"/IntegratedMM/UpdateDdviceCtrl/queryOneClickDevByDevId.do");
        _devzone_callback(data);
    }

    function _devzone_callback(Data){
        var deviceData = Data.json[0];
        devId = deviceData.devId;
        $("#devId").val(devId);
        $("#devName").val(deviceData.devName);
        $("#pnlActID").val(deviceData.pnlActID);
        $("#openarea").val(deviceData.areaName);
        areaId = deviceData.areaId;

        var devModelId = document.getElementById("devModelId");
        devModelId.innerHTML= devModelId.innerHTML + "<option value="+deviceData.devModelId+">"+deviceData.devModelName+"</option>";
        $("#devModel").val(deviceData.devModelId);

        $("#devLoginName").val(deviceData.loginName);
        $("#devLoginPwd").val(deviceData.loginPwd);

        $("#devSn").val(deviceData.devSn);
        $("#instMan").val(deviceData.instMan);
        $("#instUnit").val(deviceData.instUnit);
        $("#installTime_input").val(deviceData.devInstDate);

        $("#pnlAddr").val(deviceData.pnlAddr);
        $("#line").val(deviceData.devLng);
        $("#column").val(deviceData.devlat);

        $("#communicateLine").val(deviceData.communicateLine);
        $("#communicateProtocol").val(deviceData.communicateProtocol);
        $("#fMemo").val(deviceData.fMemo);
        $('#platformId').val(deviceData.platformName).data('key',deviceData.platformId);

        $("#manufacturer").val(deviceData.manufacturer);
        $("#akeyServer").val(deviceData.Ip);
        $("#devPort").val(deviceData.PORT);
        if(deviceData.ownerId==null||deviceData.ownerId==''||deviceData.ownerId==undefined){
            $("#host").addClass('noPoint');
        }else {
            $("#openarea").attr("readonly",'readonly');
            $("#openarea").addClass('inputback');
        }
        ownerId = deviceData.ownerId;
        $("#host").click(function(){isowner()});
    }

    function openDevicePlay(){          //打开设备型号下拉列表
        var devModelId = document.getElementById("devModelId");
        if(aun==0){
            var model =  getDevModel();
            devModelId.options.length=0;
            for(var i=0; i<model.length; i++){
                //  devModelId.innerHTML= devModelId.innerHTML + "<option value="+model[i].devModelId+">"+model[i].devModelName+"</option>";
                $("#devModelId").append("<option value='"+model[i].devModelId+"'>"+model[i].devModelName+"</option>");
            }
            aun=1;
        }
    }
    function getDevModel(){              //拿到数据库设备型号
        var devType = {devType:15};
        var getMode = post_sync(devType, "../../../../addDevice/getDevModel.do");
        return  getMode;
    }

    //修改nvr无线
    function update(){
        var communicateLine = $("#communicateLine").val();
        if(communicateLine==""||communicateLine ==null){
            communicateLine = -1;
        }
        var communicateProtocol = $("#communicateProtocol").val();
        if(communicateProtocol==""||communicateProtocol ==null){
            communicateProtocol = -1;
        }
        var json= {
            "devId":$("#devId").val(),
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
            "manufacturer":$("#manufacturer").val(),
            "communicateLine":communicateLine,
            "communicateProtocol":communicateProtocol,
            "tunnelId":0,
            "playCode":0,
            "IP":$("#akeyServer").val(),
            "PORT":$("#devPort").val(),
        }
        var end =  post_sync(json, "/IntegratedMM/addDevice/updateOneClickDev.do");
        parent.parent.alertTip(end.message,2000,null);
        if(end.code == "200") {
            //点击一键报警显示一键报警列表并刷新
            parent.parent.clickdeviceright("AKey_tab");
            parent.parent.closePopus();
        }
    }

    function cancelCallback() {

    }
    function isowner(){     //相关机主点击事件
        parent.parent.devicePopusManager('openRelated',ownerId);
    }

    function _NVRhave(flag) {
        if(flag){
            parent.parent.comfireFloat("确定保存一键报警信息？",update,cancelCallback);
        }else {
            parent.parent.alertTip("请填写完整信息",2000,null);
        }
    }
    function _setDevId(devId){
        $("#devId").val(devId);
        parent.parent.clickdeviceright("AKey_tab");
    }

})(window,jQuery);