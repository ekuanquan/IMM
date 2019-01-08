/**
 * Created by ywhl on 2017/6/8.
 */
$(document).ready(function() {
    selectNVRinit();
});

;(function(window,$){

    var userId;
    var devId ;
    var areaId;
    var aun=0;
    window.selectNVRinit = _init;
    window.showLocation = _showLocation;
    window.showareaname = _showareaname;

    //接收经纬度
    function _showLocation(location1){
        $("#line").val(location1.x);
        $("#column").val(location1.y);
    }
    function _init() {
        $("#choseplace").click(function () {
            setDeviceLocation()
        });
        _initData();

    //    openDevicePlay();
    }

        //发送经纬度
        function setDeviceLocation(){
            parent.parent.popusStaManager('openMap');
        }
        //接收经纬度
        function _showLocation(location1){
            $("#line").val(location1.x);
            $("#column").val(location1.y);
        }
        //显示弹窗树返回的数据
        function _showareaname(areaname){
            $("#openarea").val(areaname.name);
            areaId = areaname.id;
        }
    //查询nvr信息
    function _initData(){
        var deviceData = parent.parent.parent.parent.getPopupsRowJson();
        //post_async({"devId": deviceData.devId},"../../../../QueryWirenvrInfo.do",_devzone_callback);
        var data = post_sync({"devId": deviceData.devId},"../../../../QueryNetnvrInfo.do");
        _devzone_callback(data);
    }

    function _devzone_callback(Data){
        var deviceData = Data.result;
        devId = deviceData.devId;
        areaId= deviceData.areaId;
        $("#devId").val(devId);
        $("#devName").val(deviceData.devName);
        $("#pnlActID").val(deviceData.pnlActID);
        $("#openarea").val(deviceData.areaName);
        $("#devModelId").val(deviceData.devModelName);

        $("#devLoginName").val(deviceData.devLoginName);
        $("#devLoginPwd").val(deviceData.devLoginPwd);
        $("#devIp").val(deviceData.devTUTKID);
        $("#installTime_input").val(deviceData.devInstDate);
        $("#line").val(deviceData.devLng);
        $("#column").val(deviceData.devlat);
        $("#ChannelNum").val(deviceData.ChannelNum);
        $("#pnlAddr").val(deviceData.pnlAddr);
        $("#instMan").val(deviceData.instMan);
        $("#instUnit").val(deviceData.instUnit);
        $("#videoServer").val(deviceData.videoServer);
        //$("#devPort").val(deviceData.devPort);
        $("#fMemo").val(deviceData.fMemo);
        $("#manufacturer").val(changeManufacturer(deviceData.manufacturer));
        if(deviceData.userId==null||deviceData.userId==''||deviceData.userId==undefined){
            $("#host").remove();
        }
        userId = deviceData.userId;
        $("#host").click(function(){isowner()});
    }

    //修改nvr有线
    function update(){
        if(sureadd()==false){return;}
        var json= {
            "devId":devId,
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
            "devPort":$("#devPort").val(),
            "fMemo":$("#fMemo").val(),
            "manufacturer":$("#manufacturer").val()
        }
        var end =  post_sync(json, "../../../../ModifyWirenvrattr.do");
        alert(end.message);
    }

    function openDevicePlay(){          //打开设备型号下拉列表
        var devModelId = document.getElementById("devModelId");
        if(aun==0){
            var model =  getDevModel();
            devModelId.options.length=0;
            for(var i=0; i<model.length; i++){
                //devModelId.innerHTML= devModelId.innerHTML + "<option value="+model[i].devModelId+">"+model[i].devModelName+"</option>";
                $("#devModelId").append("<option value='"+model[i].devModelId+"'>"+model[i].devModelName+"</option>");
            }
            aun=1;
        }
    }

    function getDevModel(){              //拿到数据库设备型号
        var devType = {devType:9};
        var getMode = post_sync(devType, "../../../../addDevice/getDevModel.do");
        return  getMode;
    }

    function sureadd() {
        var msg = "您真的确定要修改吗？\n\n请确认！";
        if (confirm(msg)==true){
            return true;
        }else{
            return false;
        }
    }

    function isowner(){     //相关机主点击事件
        parent.parent.devicePopusManager('openRelated',userId);
    }
    function changeManufacturer(manuKey){
        switch(manuKey){
            case "HIK":
                return "海康";
                break;
            case "DH":
                return "大华";
                break;
            default:
                null
        }
    }

})(window,jQuery);