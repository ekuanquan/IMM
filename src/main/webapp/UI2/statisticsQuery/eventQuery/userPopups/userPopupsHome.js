$(document).ready(function () {
    init();
});
;(function (window, $) {
    window.init = _init;
    window.getdevId=_getDevId;
    
    var _global = {
        top: parent.parent,
        popusName: '',
        topPopupsName: 'addOwnerUser',
        roleRowJson:'',
        popupsData:{
            rowJson:""
        },
        devId:""
    };

    function _init() {
        _initEvent();
    }

    //事件绑定函数
    function _initEvent() {
        _global.top._setTitle("事件管理");

        $(".tab_item").bind('click', function (event) {
            $(this).removeClass('tab_noChecked').addClass('tab_ischecked');
            $(this).siblings().removeClass('tab_ischecked').addClass('tab_noChecked');
            _switchTitleItem($(this).attr('id'));
        });
        $("#owner_tab").siblings().show();
        $("#owner_tab").click();
    }

    function _switchTitleItem(iframeStr) {
        switch (iframeStr) {
            case 'owner_tab':
                $("#alterUserIframe").css('width', '100%');
                $("#alterUserIframe").siblings().css('width', '0px');
                break;
            case 'general_tab':
                $("#alterUserIframe").css('width', '100%');
                $("#alterUserIframe").siblings().css('width', '0px');
                break;
            case 'operator_tab':
                $("#alterUserIframe").css('width', '100%');
                $("#alterUserIframe").siblings().css('width', '0px');
                break;
            case 'associatedDevice_tab':
                $("#associatedDeviceIframe").css('width', '100%');
                $("#associatedDeviceIframe").siblings().css('width', '0px');
                break;
            case 'contact_tab':
                $("#contactIframe").css('width', '100%');
                $("#contactIframe").siblings().css('width', '0px');
                break;
            case 'userZone_tab':
                $("#userZoneIframe").css('width', '100%');
                $("#userZoneIframe").siblings().css('width', '0px');
                break;
            case 'monitoringSite_tab':
                $("#monitoringSiteIframe").css('width', '100%');
                $("#monitoringSiteIframe").siblings().css('width', '0px');
                break;
            case 'zoneMap_tab':
                $("#zoneMapIframe").css('width', '100%');
                $("#zoneMapIframe").siblings().css('width', '0px');
                if($("#zoneMapIframe").attr('src')== ''){
                    $("#zoneMapIframe").attr('src','zoneMap/zoneMap.html');
                }
                break;
            case 'eventSetting_tab':
                $("#eventSettingIframe").css('width', '100%');
                $("#eventSettingIframe").siblings().css('width', '0px');
                break;
            case 'rdPrePlan_tab':
                $("#rdPrePlanIframe").css('width', '100%');
                $("#rdPrePlanIframe").siblings().css('width', '0px');
                break;
            case 'historyRecord_tab':
                $("#historyRecordIframe").css('width', '100%');
                $("#historyRecordIframe").siblings().css('width', '0px');
                break;
            default:
                // statements_def
                break;
        }
    }



    function _getDevId(){
        return _global.devId;
    }

})(window, jQuery);