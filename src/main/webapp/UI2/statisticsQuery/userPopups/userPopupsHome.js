$(document).ready(function () {
    init();
});
;(function (window, $) {
    window.init = _init;
    window.PopusManage = _PopusManage;
    window.getPopupsName = _getPopupsName;
    window.getTopPopupsName = _getTopPopupsName;
    window.getArea = _getArea;
    window.getPopupsRowJson = _getPopupsRowJson;
    window.setPopupsRowJson = _setPopupsRowJson;
    window.refreshContacts = _refreshContacts;
    window.refreshUserZone = _refreshUserZone;
    window.refreshUserMonitor = _refreshUserMonitor;
    window.open_device = _open_device;
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
    	if(_global.top.getPopusName() == 'addOwnerUser'){
    		$("#owner_tab").siblings().hide();
            _global.top._setTitle("机主客户");
    	}if(_global.top.getPopusName() == 'addGeneralUser'){
    		$("#general_tab").siblings().hide();
    	}if(_global.top.getPopusName() == 'addOperator'){
    		$("#operator_tab").siblings().hide();
    	}
        
        if(_global.top.getPopusName && typeof (_global.top.getPopusName) == 'function' && _global.topPopupsName == 'addOwnerUser'){
            _global.topPopupsName = _global.top.getPopusName();
            $("#alterUserIframe").attr('src','alterUser/owner/owner.html');
        }
        if(_global.top.getPopusName && typeof (_global.top.getPopusName) == 'function' && _global.topPopupsName == 'addGeneralUser'){
        	_global.topPopupsName = _global.top.getPopusName();
            $("#alterUserIframe").attr('src','alterUser/generalUser/generalUser.html');
        }
        if(_global.top.getPopusName && typeof (_global.top.getPopusName) == 'function' && _global.topPopupsName == 'addOperator'){
        	_global.topPopupsName = _global.top.getPopusName();
            $("#alterUserIframe").attr('src','alterUser/operator/operator.html');
        }
        $(".tab_item").bind('click', function (event) {
            $(this).removeClass('tab_noChecked').addClass('tab_ischecked');
            $(this).siblings().removeClass('tab_ischecked').addClass('tab_noChecked');
            _switchTitleItem($(this).attr('id'));
        });
        if (_global.top.getPopusName() == 'alterOwnerUser') {
        	_global.topPopupsName = _global.top.getPopusName();
            $("#owner_tab").siblings().show();
            $("#general_tab").hide();
            $("#operator_tab").hide();
            _global.top._setTitle("机主客户");
            $("#owner_tab").click();
        }
        if (_global.top.getPopusName() == 'alterGeneralUser') {
        	_global.topPopupsName = _global.top.getPopusName();
        	$("#alterUserIframe").attr('src','alterUser/generalUser/generalUser.html');
        	$("#general_tab").siblings().hide();
        	$("#associatedDevice_tab").show();
        	$("#contact_tab").show();
            _global.top._setTitle("一般客户");
            $("#general_tab").click();
        }
        if (_global.top.getPopusName() == 'alterSysOperator' || _global.top.getPopusName() == 'alterBusinessOperator') {
            $("#alterUserIframe").attr('src','alterUser/operator/operator.html');
        	$("#operator_tab").siblings().hide();
        	$("#associatedDevice_tab").show();
        	$("#contact_tab").show();
            _global.top._setTitle("操作员");
            $("#operator_tab").click();
        }
        //默认点击一次首页
        if(_global.top.getPopusName() == 'addOwnerUser'){
        	$("#owner_tab").click();
    	}if(_global.top.getPopusName() == 'addGeneralUser'){
    		$("#general_tab").click();
    	}if(_global.top.getPopusName() == 'addOperator'){
    		$("#operator_tab").click();
    	}
        $("#title_close").bind('click', function () {
            _global.top.closePopus();
        });
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


    function _PopusManage(popusPage_str, param_json) {
        switch (popusPage_str) {
            case 'addContact':
                _global.popusName = 'addContact';
                _open_addContact();
                break;
            case 'editContact':
            	_global.popusName = 'editContact';
            	_setPopupsRowJson(param_json);
                _open_editContact();
                break;
            case 'addUserZone':
                _global.popusName = 'addUserZone';
                _open_addUserZone();
                break;
            case 'editUserZone':
            	_global.popusName = 'editUserZone';
            	_setPopupsRowJson(param_json);
                _open_editUserZone();
                break;
            case 'addrdPrePlan':
                _global.popusName = 'addrdPrePlan';
                _open_addMonitorSite();
                break; 
            case 'editMonitorSite':
            	_global.popusName = 'editMonitorSite';
            	_setPopupsRowJson(param_json);
                _open_editMonitorSite();
                break;
            case 'editRole':
                _global.popusName = 'editRole';
                _open_editRole();
                break;
            case 'openArea':
                _open_openArea();
                break;
            case 'selectRole':
                _open_selectRole();
                break;
            default:
                break;
        }
    }

    function _open_addContact() {
        _openPopups($('body'), './contact/AddUpdContact/AddUpdContact.html', {
            width: 387,
            height: 520
        }, true);
    }
    
    function _open_editContact() {
        _openPopups($('body'), './contact/AddUpdContact/AddUpdContact.html', {
            width: 387,
            height: 520
        }, true);
    }
    function _open_addUserZone() {
        _openPopups($('body'), './userZone/AddUpdUserZone/AddUpdUserZone.html', {
            width: 387,
            height: 570
        }, true);
    }
    function _open_editUserZone() {
        _openPopups($('body'), './userZone/AddUpdUserZone/AddUpdUserZone.html', {
            width: 387,
            height: 570
        }, true);
    }
    function _open_addMonitorSite() {
        _openPopups($('body'), './monitoringSite/addrdPrePlan/addrdPrePlan.html', {
            width: 387,
            height: 637
        }, true);
    }
    function _open_editMonitorSite() {
        _openPopups($('body'), './monitoringSite/addrdPrePlan/addrdPrePlan.html', {
            width: 387,
            height: 637
        }, true);
    }
    //树状页面弹窗
    function _open_openArea() {
        _openPopups($('body'),'../../device/shebeihtml/selectarea.html' , {
            width: 360,
            height: 539
        });
    };

    function _open_selectRole() {
        _openPopups($('body'),'./rolePopups/rolePopups.html' , {
            width: 746,
            height: 583
        });
    }
    
    function _refreshContacts(){
    	window.frames["contactIframe"].refreshData.refresh();
    }
    function _refreshUserZone(){
    	window.frames["userZoneIframe"].refreshData.refresh();
    }
    function _refreshUserMonitor() {
        monitoringSiteIframe.refleshData();
    }
    function _getPopupsName() {
        return _global.popusName;
    }

    function _getTopPopupsName() {
        return _global.topPopupsName;
    }
    function _getPopupsRowJson() {
    	console.log('传出去的'+JSON.stringify(_global.popupsData.rowJson));
        return _global.popupsData.rowJson;
    }
    function _setPopupsRowJson(rowJson){
    	console.log('传进来的'+JSON.stringify(rowJson));
        _global.popupsData.rowJson = rowJson;
    }
    //所属区域显示
    function _getArea(areaname){
        if(alterUserIframe.setAreaName&&(typeof (alterUserIframe.setAreaName) == 'function')){
            alterUserIframe.setAreaName(areaname);
        }
    }

    function _open_device(rowjson) {
        _global.devId=rowjson.devId;
        if(rowjson.devType =="1"){
            _openPopups($('body'), "../../related/deviceAdd/alterHost.html", {
                width: 771,
                height: 676
            });
        }
        else if(rowjson.devType =="10"){
            _openPopups($('body'), "../../related/NVRAdd/NVRHost.html", {
                width: 771,
                height: 676
            });
        }
        else if(rowjson.devType =="9") {
            _openPopups($('body'), "../../related/NVRWireAdd/NVRHost.html", {
                width: 771,
                height: 676
            });
        }
    };
    function _getDevId(){
        return _global.devId;
    }

})(window, jQuery);