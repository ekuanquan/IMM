/**
 * Created by ywhl on 2017/6/7.
 */
$(document).ready(function() {
    $("#signupForm").Validform({
        tiptype:2,
        btnSubmitId:"sure",
        callback:sure
    });
    selectinit();
   // dataInit();
});

;(function(window,$){

    var ownerId;
    var areaId ;
    var devId ;
    var aun = 0;

    window.selectinit = _init;
    window.dataInit = _initData;
    window.showLocation = _showLocation;
    window.showareaname = _showareaname;
    window.sure = _sure;
    window.setDevId=_setDevId;
    //window.update=_update;

    var _global={
        deviceData:null,
        model:null
    }
    function _initData(){
        var deviceData = parent.parent.parent.parent.getPopupsRowJson();
        post_async({"devId": deviceData.devId},"../../../../QueryAlarmhostInfo.do",_devzone_callback);
    }

    function _devzone_callback(Data){
        var deviceData = Data.result;
        _global.deviceData=deviceData;
        devId = deviceData.devId;
        areaId = deviceData.areaId;
        $("#devId").val(devId);
        $("#devName").val(deviceData.devName);
        $("#pnlActID").val(deviceData.pnlActID);
        $("#areaId").val(deviceData.areaName);
        $("#devType").val(deviceData.devTypeName);
       // $("#devModelId").text(deviceData.devModelId);
        openDevicePlay();
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
    //    getDevModel();

        if(deviceData.ownerId==null||deviceData.ownerId==''||deviceData.ownerId==undefined){
            /*$("#host").remove();*/
            $("#host").addClass('noPoint');
        }
        else{
            $("#areaId").attr("readonly",'readonly');
            $("#areaId").addClass('inputback');
        }
        ownerId = deviceData.ownerId;
        $("#host").click(function(){
            isowner();
        });

        $("#copyDevice").click(function(){
            copyDevice();
        });
    }
    
    function _init(){
        _initData();
        $("#cancel").click(function(){parent.parent.closePopus();});
        $("#choseplace").click(function(){setDeviceLocation()});
        $("#areaId").click(function(){
            if(ownerId == null || ownerId == '' || ownerId == undefined) {
                parent.devicePopusManager('openArea');
            }
        });
        $("#installTime_input").bind('focus',function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            this.blur();
        });
        $("#lenameCheckbox").click(function() {
            if ($(this).hasClass('isChecked')) {
                $(this).removeClass('isChecked').addClass('noChecked');
            }else{
                $(this).removeClass('noChecked').addClass('isChecked');
            }
        });
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
    //显示弹窗树返回的数据
    function _showareaname(areaname){
        $("#areaId").val(areaname.name);
        areaId = areaname.id;
        $("#areaId").blur();
    }



    //修改报警主机信息
    function _update(){
     //   if(sureadd()==false){return;}
        var json= {
            "devId":$("#devId").val(),
            "devName":$("#devName").val(),
            "pnlActID":$("#pnlActID").val(),
            "areaId":areaId,
            "devType":1,
            "devModelId":$("#devModelId").val(),
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
        }
      var end =  post_sync(json, "../../../../ModifyAlarmhostattr.do");
        parent.parent.alertTip(end.message,2000,null);
        if(end.code == "1000") {
            //点击报警主机显示报警主机列表
            parent.parent.clickdeviceright("alarmMainframe_tab");
            //  alert(end.message);
            parent.parent.closePopus();
        }

    }
    function cancelCallback() {

    }

    function openDevicePlay(){          //打开设备型号下拉列表
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
    function getDevModel(){              //拿到数据库设备型号
        var devType = {devType:1};
        var getMode = post_sync(devType, "../../../../addDevice/getDevModel.do");
        return  getMode;
    }
    function isowner(){     //相关机主点击事件
        parent.parent.devicePopusManager('openRelated',ownerId);
    }

    function copyDevice(){     //相关机主点击事件
        parent.parent.devicePopusManager('copyDevice',"");
    }
    function _sure(flag) {
        if(flag){
            parent.parent.comfireFloat("确定修改报警主机信息？",_update,cancelCallback)
        }else {
            parent.parent.alertTip("请填写完整信息",2000,null);
        }
    }
    function _setDevId(devId){
        $("#devId").val(devId);
        parent.parent.clickdeviceright("alarmMainframe_tab");
    }
})(window,jQuery);