/**
 * Created by ywhl on 2017/6/8.
 */
$(document).ready(function() {
    selectNVRinit();
});

;(function(window,$){

    var userId;
    var devId;
    var areaId;
    window.selectNVRinit = _init;

    function _init() {
        $("#choseplace").click(function () {
            parent.parent.popusStaManager('openMap');
        });
        _initData();
        //相关信息
        $("#releInfo").click(function () {
            parent.parent.popusStaManager('alterOwnerUser');
            parent.parent.setPopupsRowJson(_global.deviceData);
        });

    }

    //查询nvr无线信息
    function _initData(){
        var deviceData = parent.parent.parent.parent.getPopupsRowJson();
        var data = post_sync({"devId": deviceData.devId},"../../../../QueryWirenvrInfo.do");
        _devzone_callback(data);
        if(deviceData.ownerId&&deviceData.ownerId!=null&&deviceData.ownerId!=""){
            $(".btn").removeClass("opacity");
        }
    }

    function _devzone_callback(Data){
        var deviceData = Data.result;
        devId = deviceData.devId;
        $("#devId").val(devId);
        $("#devName").val(deviceData.devName);
        $("#pnlActID").val(deviceData.pnlActID);
        $("#openarea").val(deviceData.areaName);
        areaId = deviceData.areaId;
        $("#devModelId").val(deviceData.devModelName);

        $("#devLoginName").val(deviceData.devLoginName);
        $("#devLoginPwd").val(deviceData.devLoginPwd);
        $("#devTUTKID").val(deviceData.devIp);
        $("#devPort").val(deviceData.devPort);
        $("#installTime_input").val(deviceData.devInstDate);
        $("#line").val(deviceData.devLng);
        $("#column").val(deviceData.devlat);
        $("#ChannelNum").val(deviceData.ChannelNum);
        $("#pnlAddr").val(deviceData.pnlAddr);
        $("#instMan").val(deviceData.instMan);
        $("#instUnit").val(deviceData.instUnit);
        $("#videoServer").val(deviceData.videoServer);
        $("#fMemo").val(deviceData.fMemo);
        $("#manufacturer").val(changeManufacturer(deviceData.manufacturer));
        $('#platformId').val(deviceData.platformName).data('key',deviceData.platformId);
        $("#gbId").val(deviceData.gbId);
        if(deviceData.userId==null||deviceData.userId==''||deviceData.userId==undefined){
            $("#host").remove();
        }
        userId = deviceData.userId;
        $("#host").click(function(){isowner()});
    }
    function getDevModel(){              //拿到数据库设备型号
        var devType = {devType:10};
        var getMode = post_sync(devType, "../../../../addDevice/getDevModel.do");
        return  getMode;
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
            case "P2P_TUTK_CLIENT":
                return "远望";
                break;
            case "P2P_NPC":
                return "华科";
                break;
            case "OTHER":
                return "其他";
                break;
            default:
                null
        }
    }

})(window,jQuery);