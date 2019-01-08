
$(document).ready(function() {
    alterHostinit();
});
;(function(window,$){
    var editZone;
    var dataJson;

    window.closePopus = _closePopus;
    window.textPrem =_textPrem;
    /*window.getPopusName =_getPopusName*/
    window.alterHostinit = _init;
    window.devicePopusManager = _devicePopusManager;
    window.getArea = _getArea;



    var _global = {
        popusName:'',
        paremJson:''
    };

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
    function _devicePopusManager(popusPage_str , json) {

        switch (popusPage_str) {
            case 'openArea':
             //   _global.popusName='openArea';
                _open_openArea();
                break;
            case 'addDeviceZone':
                editZone = 'addDeviceZone';
                dataJson = json;
                _open_addDevice();
                break;
            case 'editDeviceZone':
                editZone = 'editDeviceZone';
                dataJson = json;
                _open_editDevice();
                break;
            default:
                break;
        }
    }

    function _getPopusName() {
        var jsonPrem = {
            "editZone":editZone,
            "dataJson":dataJson
        }
        return jsonPrem;
    }

    function _textPrem(){
        var jsonPrem = {
            "editZone":editZone,
            "dataJson":dataJson
        }
        return jsonPrem;
    }

    function _closePopus() {
        $("#mainDiv").remove();
        $("#bottomDiv").remove();
        showiframeDevice.reflaceDeviceZoneNVRWireIframe();
    }

    //树状页面弹窗
    function _open_openArea() {
        _openPopups($('body'),'../../shebeihtml/selectarea.html' , {
            width: 360,
            height: 539
        });
    };

    function _open_addDevice() {
        _openPopups($('body'),'../deviceZoneNVRWireIframe/addDeviceZone/addDeviceZone.html' , {
            width: 387,
            height: 520
        });
    };
    function _open_editDevice() {
        _openPopups($('body'), "../deviceZoneNVRWireIframe/addDeviceZone/addDeviceZone.html", {
            width: 387,
            height: 520
        });
    };
//弹窗结束

    //关闭弹窗
    function close(){
        parent._closePopus();
    }

    //接收弹窗树信息
    function _getArea(areaname){
        /*alert("aaaaaaa"+areaname);*/
        showiframeBase.showareaname(areaname);
    }


   /* //接收弹窗树信息
    function _getArea(areaname){
        showiframeBase.showareaname(areaname);
    }*/

})(window,jQuery);