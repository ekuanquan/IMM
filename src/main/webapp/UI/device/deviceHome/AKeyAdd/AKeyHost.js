$(document).ready(function() {
    alterHostinit();
});
;(function(window,$){
    window.alterHostinit = _init;
    window.getPopusName =_getPopusName;
    window.getDataJson =_getDataJson;
    window.getArea = _getArea;
    window.devicePopusManager = _devicePopusManager;
    window.refreshZoneList = _refreshZoneList;
    window.setAlmtypeList = _setAlmtypeList;
    window.setWanttoList = _setWanttoList;
    window.setSnmodelList = _setSnmodelList;
    window.setSntypeList = _setSntypeList;
    window.setForwardSchemeList = _setForwardSchemeList;

    window.getAlmtypeList = _getAlmtypeList;
    window.getWanttoList = _getWanttoList;
    window.getSnmodelList = _getSnmodelList;
    window.getSntypeList = _getSntypeList;

    var _global = {
        popusName:'',
        datajson:'',
        AlmtypeList: {},
        WanttoList:{},
        SnmodelList:{},
        SntypeList:{},
    };

    function _init(){
        basic();
        $("#basic").click(function(){basic()});
        $("#device").click(function(){device();});
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
        $("#basic").css("background", "#ffffff");
        $("#device").css("background", "#deecff");
    }

    function device(){
        $("#showiframeBase").css("height","0px");
        $("#showiframeDevice").css("height","595px");
        $("#basic").css("background", "#deecff");
        $("#device").css("background", "#ffffff");
    }


    function _getPopusName() {
        return _global.popusName;
    }

    function _getDataJson() {
        return _global.datajson;
    }

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
    //弹窗
    function _devicePopusManager(popusPage_str,json) {

        switch (popusPage_str) {
            case 'openArea':
                _global.popusName = 'openArea';
                _open_openArea();
                break;
            case 'addAKeyZone':
                _global.popusName = 'addAKeyZone';
                _open_addAKey();
                break;
            case 'editAKeyZone':
                _global.popusName = 'editAKeyZone';
                _global.datajson = json;
                _open_editAKey();
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
    function _open_addAKey() {
        _openPopups($('body'),'../AKeyZone/addAKeyZone/addAKeyZone.html' , {
            width: 387,
            height: 520
        });
    };
    function _open_editAKey() {
        _openPopups($('body'), "../AKeyZone/addAKeyZone/addAKeyZone.html", {
            width: 387,
            height: 520
        });
    };
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
})(window,jQuery);