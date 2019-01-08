$(document).ready(function() {
    alterHostinit();
});
;(function(window,$){
    window.alterHostinit = _init;
    window.getPopusName =_getPopusName;
    window.devicePopusManager = _devicePopusManager;
    window.getArea = _getArea;
    window.closePopus = _closePopus;
    window.getParemJson = getParemJson;
    window.setGbId=_setGbId;

    var _global = {
        popusName:'',
        paremJson:''
    };

    function getParemJson(){
        return _global.paremJson;
    }

    function _init(){
        basic();
        $("#basic").click(function(){basic()});
        $("#device").click(function(){device()});
        $("#close").click(function(){close()});
    }

    function basic(){
        $("#showiframeBase").css("height","595px");
        $("#showiframeDevice").css("height","0px");
        $("#basic").css("background", "#ffffff");
        $("#device").css("background", "#deecff");
    }

    function device(){
        $("#showiframeBase").css("height","0px");
        $("#showiframeDevice").css("height","595px");
        $("#basic").css("background", "#deecff");
        $("#device").css("background", "#ffffff");
    }

    //弹窗
    function _devicePopusManager(popusPage_str ,param_json) {

        switch (popusPage_str) {
            case 'openArea':
                _global.popusName = 'openArea';
                _open_openArea();
                break;
            case 'addDeviceZone':
                _global.popusName = 'addDeviceZone';
                _open_addDevice();
                break;
            case 'editDeviceZone':
                _global.popusName = 'editDeviceZone';
                _open_editDevice();
                _global.paremJson = param_json;
                break;
            case 'addDeviceZoneNVR':
                _global.popusName = 'addDeviceZoneNVR';
                _open_editDevice();
                _global.paremJson = param_json;
                break;
            default:
                break;
        }
    }

    function _getPopusName() {
        return _global.popusName;
    }

    //树状页面弹窗
    function _open_openArea() {
        _openPopups($('body'),'../../shebeihtml/selectarea.html' , {
            width: 360,
            height: 539
        });
    };

    function _open_addDevice() {
        _openPopups($('body'),'../deviceZone/addDeviceZone/addDeviceZone.html' , {
            width: 387,
            height: 550
        });
    };
    function _open_editDevice() {
        _openPopups($('body'), "../deviceZoneNVR/addDeviceZone/addDeviceZone.html", {
            width: 387,
            height: 550
        });
    };
//弹窗结束

    //关闭弹窗
    function close(){
        parent.closePopus();
    }
    
  /*  //接收弹窗树信息
    function _getArea(areaname){
        /!*alert("aaaaaaa"+areaname);*!/
        showiframeBase.showareaname(areaname);
    }*/

    //接收弹窗树信息
    function _getArea(areaname){
        showiframeBase.showareaname(areaname);
    }

    function _closePopus() {
        $("#mainDiv").remove();
        $("#bottomDiv").remove();
        showiframeDevice.reflaceDeviceZoneNVR();
    }
    function _setGbId(gbId) {
        showiframeBase.setGbId(gbId);
    }

})(window,jQuery);