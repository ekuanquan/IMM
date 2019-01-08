$(document).ready(function () {
    init();
});
;(function (window, $) {
    window.init = _init;
    window.open_associatedApparatusAdd = _open_associatedApparatusAdd;
    window.closePopus=_closePopus;
    window.open_openArea = _open_openArea;
    window.open_devArea = _open_devArea;
    window.open_realdevArea = _open_realdevArea;    //关联设备添加区域弹窗
    window.getArea = _getArea;
    window.getrelaArea = _getrelaArea;
    window.open_relaDevadd = _open_relaDevadd;
    window.getTopPopupsName = _getTopPopupsName;

    var _global = {
        top: parent.parent,
        areaname:""
    };

    function _init() {
        _initEvent();
    }

    //事件绑定函数
    function _initEvent() {

        $(".tab_item").bind('click', function (event) {
            $(this).removeClass('tab_noChecked').addClass('tab_ischecked');
            $(this).siblings().removeClass('tab_ischecked').addClass('tab_noChecked');
            _switchTitleItem($(this).attr('id'));
        });
        //默认点击一次首页
        $("#owner_tab").click();
        $("#title_close").bind('click', function () {
            _global.top.closePopus();
        });
    }

    function _switchTitleItem(iframeStr) {
        switch (iframeStr) {
            case 'owner_tab':
                $("#ownerIframe").css('width', '100%');
                $("#ownerIframe").siblings().css('width', '0px');
                break;
            case 'general_tab':
                $("#associatedDeviceIframe").css('width', '100%');
                $("#associatedDeviceIframe").siblings().css('width', '0px');
                break;
            default:
                break;
        }
    }
    //添加设备
    function _open_relaDevadd() {
        _openCusPopups($('body'), "owner/relaDev/relaDev.html", {
            width: 300,
            height: 200
        });
    }
    //选择设备
    function _open_associatedApparatusAdd() {
         _openPopups($('body'), "ownerDev/hmdrectory.html", {
         width: 1000,
         height: 600
     });
     }
    //树状页面弹窗
    function _open_openArea() {
        _openPopups($('body'),'../../shebeihtml/selectarea.html' , {
            width: 360,
            height: 539
        });
    };
    //所属区域显示
    function _getArea(areaname){
        if(ownerIframe.setAreaName&&(typeof (ownerIframe.setAreaName) == 'function')){
            ownerIframe.setAreaName(areaname);
        }
    }
    //添加关联设备的所属区域显示
    function _getrelaArea(areaname) {
        if(mainDivIframe399.setAreaName&&(typeof (mainDivIframe399.setAreaName) == 'function')){
            mainDivIframe399.setAreaName(areaname);
        }
    }
    function _open_devArea() {
        _openCusPopups($('body'),'../../shebeihtml/selectarea.html' , {
            width: 360,
            height: 539
        });
    }
    function _open_realdevArea() {
        _openFourPopups($('body'),'./owner/relaDev/shebeihtml/selectarea.html' , {
            width: 360,
            height: 539
        });
    }
    function _closePopus() {
        $("#mainDiv").remove();
        $("#bottomDiv").remove();
    }
    function _getTopPopupsName() {
        return "addOwnerUser";
    }

})(window, jQuery);