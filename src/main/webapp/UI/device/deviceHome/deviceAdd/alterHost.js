$(document).ready(function() {
    alterHostinit();
});
;(function(window,$){
    window.refreshZoneList=_refreshZoneList;
    window.reflaceSubSystemList=_reflaceSubSystemList;
    window.reflaceForwardSchemeList=_reflaceForwardSchemeList;
    window.alterHostinit = _init;
    window.getPopusName =_getPopusName;
    window.getDataJson =_getDataJson;
    window.devicePopusManager = _devicePopusManager;
    window.getArea = _getArea;
    window.getAlmtypeList = _getAlmtypeList;
    window.getWanttoList = _getWanttoList;
    window.getSnmodelList = _getSnmodelList;
    window.getSntypeList = _getSntypeList;
    window.getForwardSchemeList = _getForwardSchemeList;


    var _global = {
        popusName:'',
        datajson:'',
        AlmtypeList: {},
        WanttoList:{},
        SnmodelList:{},
        SntypeList:{},
        ForwardSchemeList:{},
    };

    function _init(){
        basic();
        $("#basic").click(function(){basic()});
        $("#device").click(function(){device();});
        $("#subsystem").click(function(){subsystem();});
        $("#forwardScheme").click(function(){forwardScheme();});
        $("#close").click(function(){
            close();
        });
        setTimeout(function () {
            _getCombo();
        }, 1);
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
            case 'addSubSystem':
                _global.popusName = 'addSubSystem';
                _open_addSubSysteme();
                break;
            case 'editSubSystem':
                _global.popusName = 'editSubSystem';
                _global.datajson = json;
                _open_editSubSystem();
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
    function _open_addSubSysteme() {
        _openPopups($('body'), "../subSysteme/addSubSysteme/addSubSysteme.html", {
            width: 387,
            height: 330
        });
    };
    function _open_editSubSystem() {
        _openPopups($('body'), "../subSysteme/addSubSysteme/addSubSysteme.html", {
            width: 387,
            height: 330
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
    function _reflaceSubSystemList(){  //刷新子系统页面
        showiframeSubsystem.reflaceSubSystem();
    }
    function _reflaceForwardSchemeList(){  //刷新子系统页面
        showiframeForwardScheme.reflaceForwardScheme();
    }
    function _getCombo(){
        post_async(null, "/IntegratedMM/QueryAlmtypeList.do",_setAlmtypeList);
        post_async(null, "/IntegratedMM/QueryWanttoList.do",_setWanttoList);
        post_async(null, "/IntegratedMM/QuerySnmodelList.do",_setSnmodelList);
        post_async(null, "/IntegratedMM/QuerySntypeList.do",_setSntypeList);

       // post_async(null, "/IntegratedMM/Workstation/getWorkstationList.do",_setForwardSchemeList);

    }
    function _setAlmtypeList(AlmtypeList) {
        _global.AlmtypeList=AlmtypeList;
    }
    function _setWanttoList(WanttoList) {
        _global.WanttoList=WanttoList;
    }
    function _setSnmodelList(SnmodelList) {
        _global.SnmodelList=SnmodelList;
    }
    function _setSntypeList(SntypeList) {
        _global.SntypeList=SntypeList;
    }
    function _setForwardSchemeList(ForwardSchemeList) {
        _global.ForwardSchemeList=ForwardSchemeList;
    }
    function _getAlmtypeList() {
        return _global.AlmtypeList;
    }
    function _getWanttoList() {
        return _global.WanttoList;
    }
    function _getSnmodelList() {
        return _global.SnmodelList;
    }
    function _getSntypeList() {
        return _global.SntypeList;
    }

    function _getForwardSchemeList(ForwardSchemeList) {
        return _global.ForwardSchemeList;
    }

})(window,jQuery);