$(document).ready(function () {
    init();
});
;(function (window, $) {
    window.init = _init;
    window.PopusManage = _PopusManage;
    window.getPopupsName = _getPopupsName;
    window.getTopPopupsName = _getTopPopupsName;
    window.getArea = _getArea;
    window.getrelaArea = _getrelaArea;
    window.getPopupsRowJson = _getPopupsRowJson;
    window.setPopupsRowJson = _setPopupsRowJson;
    window.refreshContacts = _refreshContacts;
    window.refreshUserZone = _refreshUserZone;
    window.refreshUserMonitor = _refreshUserMonitor;
    window.open_device = _open_device;
    window.getdevId=_getDevId;
    window.getalterrdPrePlan = _getalterrdPrePlan;
    window.refreshrdPrePlan = _refreshrdPrePlan;        //
    window.open_chooseDev = _open_chooseDev;            //选择关联设备
    window.open_relaDevalter = _open_relaDevalter;      //添加设备弹窗
    window.open_openAreaalert = _open_openAreaalert;
    window.open_alterdevArea = _open_alterdevArea;
    window.open_realdevArea = _open_realdevArea;
    
    var _global = {
        top: parent.parent,
        popusName: '',
        topPopupsName: 'addOwnerUser',
        roleRowJson:'',
        popupsData:{
            rowJson:""
        },
        devId:"",
        rdPrePlandata:''
    };

    function _init() {
        _initEvent();
    }

    //事件绑定函数
    function _initEvent() {
    	if(_global.top.getPopusName() == 'addOwnerUser'){
    		$("#owner_tab").siblings().hide();
    	}if(_global.top.getPopusName() == 'addGeneralUser'){
    		$("#general_tab").siblings().hide();
    	}if(_global.top.getPopusName() == 'addOperator'){
    		$("#operator_tab").siblings().hide();
    	}

        if (_global.top.getPopusName() == 'addOwnerUser' || _global.top.getPopusName() == 'addGeneralUser' || _global.top.getPopusName() == 'addOperator') {
            $("#title_left").text('添加用户');
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
            $("#title_left").text('修改用户');
            $("#owner_tab").click();
        }
        if (_global.top.getPopusName() == 'alterGeneralUser') {
        	_global.topPopupsName = _global.top.getPopusName();
        	$("#alterUserIframe").attr('src','alterUser/generalUser/generalUser.html');
        	$("#general_tab").siblings().hide();
        	$("#associatedDevice_tab").show();
        	$("#contact_tab").show();
            $("#title_left").text('修改用户');
            $("#general_tab").click();
        }
        if (_global.top.getPopusName() == 'alterSysOperator' || _global.top.getPopusName() == 'alterBusinessOperator') {
            $("#alterUserIframe").attr('src','alterUser/operator/operator.html');
        	$("#operator_tab").siblings().hide();
        	$("#associatedDevice_tab").show();
        	$("#contact_tab").show();
            $("#title_left").text('修改用户');
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
        if($("#associatedDeviceIframe").attr('src')== ''){
            $("#associatedDeviceIframe").attr('src','ownerHome/owner/associatedApparatusEdit.html');
        }
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
                if($("#contactIframe").attr('src')== ''){
                    $("#contactIframe").attr('src','contact/contact.html');
                }
                break;
            case 'userZone_tab':
                $("#userZoneIframe").css('width', '100%');
                $("#userZoneIframe").siblings().css('width', '0px');
                if($("#userZoneIframe").attr('src')== ''){
                    $("#userZoneIframe").attr('src','userZone/userZone.html');
                }
                break;
            case 'monitoringSite_tab':
                $("#monitoringSiteIframe").css('width', '100%');
                $("#monitoringSiteIframe").siblings().css('width', '0px');
                if($("#monitoringSiteIframe").attr('src')== ''){
                    $("#monitoringSiteIframe").attr('src','monitoringSite/monitoringSite.html');
                }
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
                if($("#eventSettingIframe").attr('src')== ''){
                    $("#eventSettingIframe").attr('src','eventSetting/eventSetting.html');
                }
                break;
            case 'rdPrePlan_tab':
                $("#rdPrePlanIframe").css('width', '100%');
                $("#rdPrePlanIframe").siblings().css('width', '0px');
                if($("#rdPrePlanIframe").attr('src')== ''){
                    $("#rdPrePlanIframe").attr('src','rdPrePlan/rdPrePlan.html');
                }
                break;
            case 'historyRecord_tab':
                $("#historyRecordIframe").css('width', '100%');
                $("#historyRecordIframe").siblings().css('width', '0px');
                if($("#historyRecordIframe").attr('src')== ''){
                    $("#historyRecordIframe").attr('src','historyRecord/historyRecord.html');
                }
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
            case 'addMonitorSite':
                _global.popusName = 'addMonitorSite';
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
            case 'addrdPlan':
                _open_addrdPlan();
                break;
            case 'alterrdPrePlan':
                _setalterrdPrePlan(param_json);
                _open_alterrdPlan();
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
    function _open_realdevArea() {
        _openFourPopups($('body'),'./ownerHome/owner/relaDev/shebeihtml/selectarea.html' , {
            width: 360,
            height: 539
        });
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
    //添加设备
    function _open_relaDevalter() {
        _openCusPopups($('body'), "ownerHome/owner/relaDev/relaDev.html", {
            width: 300,
            height: 200
        });
    }
    //选择设备
    function _open_chooseDev() {
        _openCusPopups($('body'), "ownerHome/ownerDev/hmdrectory.html", {
            width: 1000,
            height: 600
        });
    }
    function _open_editUserZone() {
        _openPopups($('body'), './userZone/AddUpdUserZone/AddUpdUserZone.html', {
            width: 387,
            height: 570
        }, true);
    }
    function _open_addMonitorSite() {
        _openPopups($('body'), './monitoringSite/addMonitorSite/addMonitorSite.html', {
            width: 387,
           /* height: 637*/
           height:590
        }, true);
    }
    function _open_editMonitorSite() {
        _openPopups($('body'), './monitoringSite/addMonitorSite/addMonitorSite.html', {
            width: 387,
            /*height: 637*/
            height:590
        }, true);
    }
    //树状页面弹窗
    function _open_openArea() {
        _openPopups($('body'),'../../device/shebeihtml/selectarea.html' , {
            width: 360,
            height: 539
        });
    };
    //树状页面弹窗
    function _open_alterdevArea() {
        _openFourPopups($('body'),'../shebeihtml/selectarea.html' , {
            width: 360,
            height: 539
        });
    };

    function _open_selectRole() {
        _openPopups($('body'),'./rolePopups/rolePopups.html' , {
            /*width: 746,
            height: 583*/
            width: 1000,
            height: 600
        });
    }
    //添加处警预案弹窗
    function _open_addrdPlan() {
        _openPopups($('body'),'./rdPrePlan/addrdPrePlan/addrdPrePlan.html' , {
            width: 485,
            height: 565
        });
    }
    //修改处警预案弹窗
    function _open_alterrdPlan() {
        _openPopups($('body'),'./rdPrePlan/alterrdPrePlan/alterrdPrePlan.html' , {
            width: 485,
            height: 565
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

    function _setalterrdPrePlan(rowJson){
        _global.rdPrePlandata = rowJson;
    }
    function _getalterrdPrePlan() {
        return _global.rdPrePlandata;
    }
    //更新处警预案列表
    function _refreshrdPrePlan() {
        rdPrePlanIframe.rdPlam();
    }
    //树状页面弹窗
    function _open_openAreaalert() {
        _openPopups($('body'),'../shebeihtml/selectarea.html' , {
            width: 360,
            height: 539
        });
    };

    //所属区域显示_open_alterdevArea
    function _getArea(areaname){
        if(typeof (alterUserIframe)!="undefined"&&alterUserIframe.setAreaName&&(typeof (alterUserIframe.setAreaName) == 'function')){
            console.log(typeof (mainDivIframe399));
            alterUserIframe.setAreaName(areaname);
        }
        /*if (typeof (mainDivIframe399)!="undefined"&&mainDivIframe399&&mainDivIframe399.setAreaName && typeof (mainDivIframe399.setAreaName) == 'function') {
            //_global.popupsName = parent.getTopPopupsName();
            console.log(typeof (mainDivIframe399));
            mainDivIframe399.setAreaName(areaname);
        }*/
    }
    //添加关联设备的所属区域显示
    function _getrelaArea(areaname) {
        if(typeof (mainDivIframe399)!="undefined"&&mainDivIframe399.setAreaName&&(typeof (mainDivIframe399.setAreaName) == 'function')){
            mainDivIframe399.setAreaName(areaname);
        }
    }

    function _open_device(rowjson) {
        _global.devId=rowjson.devId;
        if(rowjson.devType =="1"){
            _openPopups($('body'), "../../related/deviceAdd/alterHost.html", {
               /* width: 771,
                height: 676*/
                width: 1000,
                height: 600
            });
        }
        else if(rowjson.devType =="10"){
            _openPopups($('body'), "../../related/NVRAdd/NVRHost.html", {
               /* width: 771,
                height: 676*/
                width: 1000,
                height: 600
            });
        }
        else if(rowjson.devType =="9") {
            _openPopups($('body'), "../../related/NVRWireAdd/NVRHost.html", {
               /* width: 771,
                height: 676*/
                width: 1000,
                height: 600
            });
        }
        else if(rowjson.devType=='13') {
            _openPopups($('body'), "../../related/cardeviceAdd/altercardevice.html", {
                width: 1000,
                height: 600
            });
        }
    };
    function _getDevId(){
        return _global.devId;
    }

})(window, jQuery);