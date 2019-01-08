$(document).ready(function() {
    alterHostinit();
});
;(function(window,$){
    window.alterHostinit = _init;
    window.getPopusName =_getPopusName;
    window.getDataJson =_getDataJson;
    window.getArea = _getArea;
    window.devicePopusManager = _devicePopusManager;

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
        parent.parent._setTitle("一键报警");
        $("#basic").click(function(){basic()});
        $("#device").click(function(){device();});
        $("#close").click(function(){
            close();
        });
    }

    function basic(){
        $("#showiframeBase").css("height","595px");
        $("#showiframeDevice").css("height","0px");
        $("#basic").css("background", "#C3D7F5");
        $("#device").css("background", "#deecff");
    }

    function device(){
        $("#showiframeBase").css("height","0px");
        $("#showiframeDevice").css("height","595px");
        $("#basic").css("background", "#C3D7F5");
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
    //弹窗
    function _devicePopusManager(popusPage_str,json) {

        switch (popusPage_str) {
            case 'openArea':
                _global.popusName = 'openArea';
                _open_openArea();
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
})(window,jQuery);