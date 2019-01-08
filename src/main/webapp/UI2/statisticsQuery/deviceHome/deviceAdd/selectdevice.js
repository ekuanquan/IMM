/**
 * Created by ywhl on 2017/6/7.
 */
$(document).ready(function() {
    selectinit();
   // dataInit();
});

;(function(window,$){

    var userId;
    var areaId ;
    var devId ;
    var aun = 0;
    window.selectinit = _init;
    window.dataInit = _initData;
    window.showLocation = _showLocation;
    window.showareaname = _showareaname;
    window.update=_update;

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

        $("#devModelId").val(deviceData.devModelName);

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
    //    getDevModel();

        if(deviceData.userId==null||deviceData.userId==''||deviceData.userId==undefined){
            $("#host").remove();
        }
        userId = deviceData.userId;
        $("#host").click(function(){isowner()});
    }
    
    function _init(){
        $("#choseplace").click(function () {
            parent.parent.popusStaManager('openMap');
        });
        _initData();
    }
    //接收经纬度
    function _showLocation(location1){
        $("#line").val(location1.x);
        $("#column").val(location1.y);
    }
    //显示弹窗树返回的数据
    function _showareaname(areaname){
        $("#areaId").val(areaname.name);
        areaId = areaname.id;
    }



    //修改报警主机信息
    function _update(){
     //   if(sureadd()==false){return;}
        var json= {
            "devId":devId,
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
            "manufacturer":$("#manufacturer").val()
        }
      var end =  post_sync(json, "../../../../ModifyAlarmhostattr.do");
      //  alert(end.message);
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
    function _callback_getDevModel(data){
        openDevicePlay(data);
    }

    function sureadd() {
        var msg = "您真的确定要修改吗？\n\n请确认！";
        if (confirm(msg)==true){
            return true;
        }else{
            return false;
        }
    }

    function qudatesure(){
        papm = {
            text:'你确定要修改设备吗?',
            deleList:"qudatesure"
        }
        parent.parent.devicePopusManager('openPrompt',papm);
    }

    function isowner(){     //相关机主点击事件
        parent.parent.devicePopusManager('openRelated',userId);
    }

})(window,jQuery);