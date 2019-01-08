$(document).ready(function() {
    alterHostinit();
});
;(function(window,$){
    window.refreshZoneList=_refreshZoneList;
    window.alterHostinit = _init;
    window.getPopusName =_getPopusName;
    window.getDataJson =_getDataJson;
    window.devicePopusManager = _devicePopusManager;
    window.getArea = _getArea;

    var _global = {
        popusName:'',
        datajson:''
    };

    function _init(){
        basic();
        parent.parent._setTitle("报警主机");
        $("#basic").click(function(){basic()});
        $("#device").click(function(){device();});
        $("#subsystem").click(function(){subsystem();});
        $("#forwardScheme").click(function(){forwardScheme();});
        $("#close").click(function(){close()});

    }

    function basic(){
        $("#showiframeBase").css("height","595px");
        $("#showiframeDevice").css("height","0px");
        $("#showiframeSubsystem").css("height","0px");
        $("#showiframeFsorwardScheme").css("height","0px");
        $("#basic").css("background", "#ffffff");
        $("#device").css("background", "#deecff");
        $("#subsystem").css("background", "#deecff");
        $("#forwardScheme").css("background", "#deecff");
        var deviceData = parent.parent.getPopupsRowJson();
        var platformId = parent.parent.getMain();
        if(deviceData.platform_id!=platformId.platform_id) {
            $("#forwardScheme").hide();
        }
    }

    function device(){
        $("#showiframeBase").css("height","0px");
        $("#showiframeDevice").css("height","595px");
        $("#showiframeSubsystem").css("height","0px");
        $("#showiframeFsorwardScheme").css("height","0px");
        $("#basic").css("background", "#deecff");
        $("#device").css("background", "#ffffff");
        $("#subsystem").css("background", "#deecff");
        $("#forwardScheme").css("background", "#deecff");
    }
    function subsystem(){
        $("#showiframeBase").css("height","0px");
        $("#showiframeDevice").css("height","0px");
        $("#showiframeSubsystem").css("height","595px");
        $("#showiframeFsorwardScheme").css("height","0px");
        $("#basic").css("background", "#deecff");
        $("#device").css("background", "#deecff");
        $("#subsystem").css("background", "#ffffff");
        $("#forwardScheme").css("background", "#deecff");
    }
    function forwardScheme(){
        $("#showiframeBase").css("height","0px");
        $("#showiframeDevice").css("height","0px");
        $("#showiframeSubsystem").css("height","0px");
        $("#showiframeFsorwardScheme").css("height","595px");
        $("#basic").css("background", "#deecff");
        $("#device").css("background", "#deecff");
        $("#subsystem").css("background", "#deecff");
        $("#forwardScheme").css("background", "#ffffff");
        //showiframeForwardScheme.init();
    }

    //弹窗
    function _devicePopusManager(popusPage_str,json) {

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
                _global.datajson = json;
                _open_editDevice();
                break;
            default:
                break;
        }
    }

    function _getPopusName() {
        return _global.popusName;
    }
    
    function _getDataJson() {
        return _global.datajson;
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
            height: 520
        });
    };
    function _open_editDevice() {
        _openPopups($('body'), "../deviceZone/addDeviceZone/addDeviceZone.html", {
            width: 387,
            height: 520
        });
    };
//弹窗结束

    //关闭弹窗
    function close(){
        parent.closePopus();
    }

    //接收弹窗树信息
    function _getArea(areaname){
        /*alert("aaaaaaa"+areaname);*/
        showiframeBase.showareaname(areaname);
    }

    function _refreshZoneList(){  //刷新设备防区页面
        showiframeDevice.reflaceDeviceZone();
    }

})(window,jQuery);