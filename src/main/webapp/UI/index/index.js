$(document).ready(function() {
	resizeDocment();        //重绘函数
    $(window).resize(function () {
        resizeDocment();    //重绘函数
    });
    init();
});
;(function(window,$){
	window.init = _init;
	window.resizeDocment = _resizeDocment;
	window.devicePopusManager = _devicePopusManager;
	window.userPopusManager = _userPopusManager;
	window.rolePopusManage = _rolePopusManage;
	window.eventSettingManage = _eventSettingManage;
	window.videoManager = _videoManager;
    window.closePopus = _closePopus;
    window.closeMapPopus = _closeMapPopus;
    window.getPopusName = _getPopusName;
    window.getChapNode = _getChapNode;
    window.getRelatedUserId=_getRelatedUserId;
    window.getRelatedEditRole=_getRelatedEditRole;
    window.setDeviceIframeTab = _setDeviceIframeTab;
    window.getDeviceIframeTab = _getDeviceIframeTab;
    window.sendDeviceLocation = _sendDeviceLocation;
    window.setDeviceLocation = _setDeviceLocation;
    window.getDeviceLocation = _getDeviceLocation;
    window.getArea =_sendArea;
    window.getPopupsRowJson = _getPopupsRowJson;
    window.setPopupsRowJson = _setPopupsRowJson;
    window.getLoginUserName = _getLoginUserName;        //获取系统登录信息
    window.getUserType = _getUserType;
    window.setUserType = _setUserType;
    window.setUserIframeTab = _setUserIframeTab;
    window.getUserIframeTab = _getUserIframeTab;
    window.systemCode = _systemCode;
    window.setsystemCodeJson =_setsystemCodeJson;
    window.getsystemCodeJson =_getsystemCodeJson;
    window.getUserEvtData = _getUserEvtData;
    window.getUserEvtIdList = _getUserEvtIdList;
    window.setUserEvtIdList = _setUserEvtIdList;
    window.getUserMonitorData = _getUserMonitorData;
    window.popusStaManager = _popusStaManager;
    window.gettaskplan = _gettaskplan;
    window.setdevModelTypeJson = _setdevModelTypeJson;
    window.setWorkstationManagementJson = _setWorkstationManagementJson;
   // window.userPopusStaManager = _userPopusStaManager;
    window.getdevModelTypeJson =_getdevModelTypeJson;

    window.okAndCancel = _okAndCancel;
    window.okAndCancelAndMsg=_okAndCancelAndMsg;
    window.delAndCancel = _delAndCancel;
    window.alertSuccess = _alertSuccess;
    window.alertFail = _alertFail;
    window.alertWarn = _alertWarn;
    window.comfireFloat = _comfireFloat;
    window.alertTip = _alertTip;
    window.setResizeSta=_setResizeSta;
    window.setResizeSta2=_setResizeSta2;
    window.RefreshcustomerIframe = _RefreshcustomerIframe;
    window.RefreshoperatorIframe = _RefreshoperatorIframe;

    window.addsyscode = _addsyscode;             //添加系统码刷新页面
    window.adddevModellist = _adddevModellist;  //添加设备型号刷新页面
    window.clickdeviceright = _clickdeviceright;//点击设备管理右侧的调度列表2017年10月16日14:46:12
    window.setsnModelTypeJson = _setsnModelTypeJson;//用于探头型号传递数据
    window.add_snmodellist = _add_snmodellist;  //添加、修改探头型号刷新页面
    window.getsnModelTypeJson = _getsnModelTypeJson;//修改探头型号

    window.setDisposalAlarmNum = _setDisposalAlarmNum;      //用于处警单图片查看
    window.getDisposalAlarmNum = _getDisposalAlarmNum;      //用于处警单图片查看
    window.getUserId = _getUserId;
    window.setUserId = _setUserId;
    window.RefreshhostClientIframe = _RefreshhostClientIframe;  //用于刷新机主列表
    window.getSysroleId = _getSysroleId;        //当前操作员的角色
    window.getMain=_getMain;
    window.RefreworkstationManagementIframe = _RefreworkstationManagementIframe;  //用于刷新工作站列表
    window.getLatLong=_getLatLong;
    window.getAlarmReason = _getAlarmReasonLocation;//获取报警原因
    window.setCopyDevId=_setCopyDevId;
    window.getCopyDevId=_getCopyDevId;

	var _config = {
        minWidth: 1280,
        minHeight: 765,
    }
    var _global = {
	    popusName:'',
        popusResize:null,
        popusMapResize:null,
        popusResizeSta:null,
        popusResizeSta2:null,
        deviceIframe:{
	        checkedTab:""
        },
        deviceLocation:{
            x:'',
            y:''
        },
        userIframe:{
            checkedTab:''
        },
        popupsData:{
            rowJson:""
        },
        systemCodeData:{
	      rowJson:""
        },
        userType:"",         //用户类型，
        charNode:"",
        userId:"",
        userIdAdd:"",
        taskplan:"",
        relatedEditRole:"",
        winUrl:{
            deviceIframe:"../device/hmdrectory.html",
            hostClientIframe:"../hostClient/hostClient.html",
            indexIframe:"indexIframe.html",
            userIframe:"../userManager/hmdrectory.html",
            permissionIframe:"../permission/permission.html",
            systemSetting:"../sysconfiguration/sysconfiguration.html",
            videoManager:"../videoManager/videoManager.html",
            statisticsQuery:"../statisticsQuery/statisticsQuery.html",
            getMain:'/IntegratedMM/assemble_cfg/main.do',
        },
        UserEvtData:"",     //单条事件配置数据
        UserEvtIdList:"",
        UserMonitorData:'',   //选中修改的用户监控点数据
        LoginUserName:'' ,//登录用户名 2017年10月10日11:09:33
        devModelTypeData:{
            rowJson:"",    //用于修改设备型号数据
        },
        workstationManagementData:{
            rowJson:"",
        },
        snModelTypeData:{
            rowJson:"",    //用于修改探头型号数据
        },
        roleinfo:[],
        main:null,
        copyDevId:"",
    };

	function _init(){
		_initLayout();
		_initEvent();
        var returnData = _getLoginUserName();
        _global.LoginUserName =returnData.sysuserID;//登录名获取2017年10月10日11:09:24
        var moduleids=returnData.roleinfo.moduleIds;
        setModules(moduleids);
        _setMain();
        _getAlarmReason();
        ywHeartbeat.setHeartBeatTimer();    //心跳
	}
	//布局函数
	function _initLayout(){
        $("#title_content_user").hide();
        $("#title_content_hostClient").hide();
        $("#title_content_device").hide();
        $("#title_content_permission").hide();
        $("#title_content_videoManager").hide();
        $("#title_content_systemSetting").hide();
        $("#title_content_statisticsQuery").hide();

    }

    function setModules(moduleids) {
        if (typeof(moduleids) == 'undefined') {
            return;
        }
        for(var i=0;i<moduleids.length;i++){
            if(moduleids[i]=='1'){
                $("#title_content_user").show();
            }
            else if(moduleids[i]=='2'){
                $("#title_content_hostClient").show();
            }
            else if(moduleids[i]=='3'){
                $("#title_content_device").show();
            }
            else if(moduleids[i]=='4'){
                $("#title_content_permission").show();
            }
            else if(moduleids[i]=='5'){
                $("#title_content_systemSetting").show();
            }
            else if(moduleids[i]=='6'){
                $("#title_content_statisticsQuery").show();
            }
            else if(moduleids[i]=='12'){
                $("#title_content_videoManager").show();
            }
        }
        if(contains(moduleids,'1')){
            $("#title_content_user").click();
            return;
        }
        else if(contains(moduleids,'2')){
            $("#title_content_hostClient").click();
            return;
        }
        else if(contains(moduleids,'3')){
            $("#title_content_device").click();
            return;
        }
        else if(contains(moduleids,'4')){
            $("#title_content_permission").click();
            return;
        }
        else if(contains(moduleids,'5')){
            $("#title_content_systemSetting").click();
            return;
        }
        else if(contains(moduleids,'6')){
            $("#title_content_statisticsQuery").click();
            return;
        }
        else if(contains(moduleids,'12')){
            $("#title_content_videoManager").click();
            return;
        }
    }
    function contains(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    }
	//事件绑定函数
	function _initEvent(){
		$(".title_content_right_item").bind('click', function(event) {
			$(this).removeClass('title_noChecked').addClass('title_ischecked');
			$(this).siblings().removeClass('title_ischecked').addClass('title_noChecked');
			_switchTitleItem($(this).attr('id'));
		});
		//默认点击一次用户管理
		//$("#title_content_user").click();

        $("#exit").bind('click', function (event) {
            var param_json = {};
            post_async(param_json, '../../openLoad/exitSystem.do', _callBack_SystemExit);
        });

	}
	function _switchTitleItem(iframeStr){
		switch (iframeStr) {
			case 'title_content_index':
				$("#indexIframe").css('width', '100%');
				$("#indexIframe").siblings().css('width', '0px');
                if($("#indexIframe").attr('src') == ""){
                    $("#indexIframe").attr('src',_global.winUrl.indexIframe);
                }
				break;
			case 'title_content_device':
				$("#deviceIframe").css('width', '100%');
				$("#deviceIframe").siblings().css('width', '0px');
                if($("#deviceIframe").attr('src') == ""){
                    $("#deviceIframe").attr('src',_global.winUrl.deviceIframe);
                }
				break;
			case 'title_content_user':
				$("#userIframe").css('width', '100%');
				$("#userIframe").siblings().css('width', '0px');
                if($("#userIframe").attr('src') == ""){
                    $("#userIframe").attr('src',_global.winUrl.userIframe);
                }
                break;
            case 'title_content_hostClient':
                $("#hostClientIframe").css('width', '100%');
                $("#hostClientIframe").siblings().css('width', '0px');
                if($("#hostClientIframe").attr('src') == ""){
                    $("#hostClientIframe").attr('src',_global.winUrl.hostClientIframe);
                }
                break;
			case 'title_content_permission':
				$("#permissionIframe").css('width', '100%');
				$("#permissionIframe").siblings().css('width', '0px');
                if($("#permissionIframe").attr('src') == ""){
                    $("#permissionIframe").attr('src',_global.winUrl.permissionIframe);
                }
				break;
            case 'title_content_systemSetting':
                $("#systemSetting").css('width', '100%');
                $("#systemSetting").siblings().css('width', '0px');
                if($("#systemSetting").attr('src') == ""){
                    $("#systemSetting").attr('src',_global.winUrl.systemSetting);
                }
                break;
            case 'title_content_videoManager':
                $("#videoManager").css('width', '100%');
                $("#videoManager").siblings().css('width', '0px');
                if($("#videoManager").attr('src') == ""){
                    $("#videoManager").attr('src',_global.winUrl.videoManager);
                }
                break;
            case 'title_content_statisticsQuery':
                $("#statisticsQuery").css('width', '100%');
                $("#statisticsQuery").siblings().css('width', '0px');
                if($("#statisticsQuery").attr('src') == ""){
                    $("#statisticsQuery").attr('src',_global.winUrl.statisticsQuery);
                }
                break;
			default:
				// statements_def
				break;
		}
	}
	//重绘布局
	function _resizeDocment(){
		var $body = $('body');
        $body.css('overflow-y', 'hidden');
        $body.css('overflow-x', 'hidden');
        var DocHeight = $(window).height();
        var DocWidth = $(window).width();
        DocHeight = parseInt(DocHeight);
        DocWidth = parseInt(DocWidth);

        $body.height(DocHeight);
        $body.width(DocWidth);

        if (DocWidth<_config.minWidth) {
        	$body.width(_config.minWidth);
        	$body.css('overflow-x', 'scroll');
            $("#title_content").width(_config.minWidth);
        }else{
        	$body.css({
        		'overflow-x': 'hidden',

        	});
            $("#title_content").css('width', '100%');
        }
        if ( _global.popusResize){
            _global.popusResize();
        }else{

        }

        if ( _global.popusResizeSta){
            _global.popusResizeSta();
        }
        if ( _global.popusMapResize){
            _global.popusMapResize();
        }else{

        }
        /*if(flagpupo){
            _changeUpSize();
        }*/
        //_changeUpSize2();
	}

	//第一层
	function _openPopups(body, url, iframSize,isOpacity) {

        if ($("#mainDiv").length > 0) {
            $("#mainDiv").remove();
        }
        if ($("#bottomDiv").length > 0) {
            $("#bottomDiv").remove();
        }
        var iframSizeWidth = iframSize.width;
        var iframeSizeHeight = iframSize.height;
        console.log("iframSizeWidth: " + iframSizeWidth);
        console.log("iframeSizeHeight: " + iframeSizeHeight);
        var mainDiv = $("<div></div>");
        var bottomDiv = $("<div></div>");
        var iframe = $("<iframe></iframe>");
        iframe.attr({
            name:'mainDivIframe',
            src: url,
            scrolling: "no",
            width: iframSizeWidth,
            height: iframeSizeHeight,
            border: 0,
            frameborder: "no"
        });
        var windowHeight = window.height;
        var windowWidth = window.width;
        var bodyHeight = body.height();
        var bodyWidth = body.width();
        bodyHeight = body.height();
        bodyWidth = body.width();
        var iframeHeight = iframe.height();
        var iframeWidth = iframe.width();
        console.log("bodyWidth: " + bodyWidth);
        var iframeHeightCenter = (bodyHeight - iframeSizeHeight) / 2;
        var iframeWidthCenter = (bodyWidth - iframSizeWidth) / 2;
        iframeHeightCenter = parseInt(iframeHeightCenter);
        iframeWidthCenter = parseInt(iframeWidthCenter);
        console.log("iframeWidthCenter: " + iframeWidthCenter);
        bodyHeight = parseInt(bodyHeight);
        bodyWidth = parseInt(bodyWidth);
        bottomDiv.attr({
            id: "bottomDiv"
        });
        bottomDiv.css({
            "opacity": 0.5,
            "float": "left",
            "top": "0px",
            "left": "0px",
            "width": bodyWidth + "px",
            "height": bodyHeight + "px",
            "display": "inline-block",
            "position": "absolute",
            "z-index": "99",
            "background-color": "black",

        });
        mainDiv.css({
            "top": iframeHeightCenter + 'px',
            "left": iframeWidthCenter + 'px',
            "width": iframSizeWidth + 'px',
            "height": iframeSizeHeight + 'px',
            "display": "inline-block",
            "position": "absolute",
            "z-index": "100",
            "background-color": "#FFF"
        });
        if (isOpacity){
            mainDiv.css('background-color','rgba(0,0,0,0.5)');
        }
        mainDiv.attr({
            id: "mainDiv"

        });
        var _popusResize = function  () {
            console.log('resize body');
            bodyHeight = body.height();
            bodyWidth = body.width();
            bodyHeight = parseInt(bodyHeight);
            bodyWidth = parseInt(bodyWidth);
            bottomDiv.css({
                "width": bodyWidth + "px",
                "height": bodyHeight + "px"
            });
            iframeHeightCenter = (bodyHeight - iframeSizeHeight) / 2;
            iframeWidthCenter = (bodyWidth - iframSizeWidth) / 2;
            mainDiv.css({
                "top": iframeHeightCenter + 'px',
                "left": iframeWidthCenter + 'px'
            });
        }
        _global.popusResize = _popusResize;
        mainDiv.append(iframe);
        body.append(bottomDiv);
        body.append(mainDiv);
    }

    function _closePopus() {
        $("#mainDiv").remove();
        $("#bottomDiv").remove();
    }


	//第二层
    function _openMapPopups(body, url, iframSize) {

        if ($("#mainDivMap").length > 0) {
            $("#mainDivMap").remove();
        }
        if ($("#bottomDivMap").length > 0) {
            $("#bottomDivMap").remove();
        }

        var iframSizeWidth = iframSize.width;
        var iframeSizeHeight = iframSize.height;
        console.log("iframSizeWidth: " + iframSizeWidth);
        console.log("iframeSizeHeight: " + iframeSizeHeight);
        var mainDiv = $("<div></div>");
        var bottomDiv = $("<div></div>");
        var iframe = $("<iframe></iframe>");
        iframe.attr({
        	name:'bottomDivMap',
            src: url,
            scrolling: "no",
            width: iframSizeWidth,
            height: iframeSizeHeight,
            border: 0,
            frameborder: "no"
        });
        var windowHeight = window.height;
        var windowWidth = window.width;
        var bodyHeight = body.height();
        var bodyWidth = body.width();
        bodyHeight = body.height();
        bodyWidth = body.width();
        var iframeHeight = iframe.height();
        var iframeWidth = iframe.width();
        console.log("bodyWidth: " + bodyWidth);
        var iframeHeightCenter = (bodyHeight - iframeSizeHeight) / 2;
        var iframeWidthCenter = (bodyWidth - iframSizeWidth) / 2;
        iframeHeightCenter = parseInt(iframeHeightCenter);
        iframeWidthCenter = parseInt(iframeWidthCenter);
        console.log("iframeWidthCenter: " + iframeWidthCenter);
        bodyHeight = parseInt(bodyHeight);
        bodyWidth = parseInt(bodyWidth);
        bottomDiv.attr({
            id: "bottomDivMap"
        });
        bottomDiv.css({
            "opacity": 0.5,
            "float": "left",
            "top": "0px",
            "left": "0px",
            "width": bodyWidth + "px",
            "height": bodyHeight + "px",
            "display": "inline-block",
            "position": "absolute",
            "z-index": "199",
            "background-color": "black",

        });
        mainDiv.css({
            "top": iframeHeightCenter + 'px',
            "left": iframeWidthCenter + 'px',
            "width": iframSizeWidth + 'px',
            "height": iframeSizeHeight + 'px',
            "display": "inline-block",
            "position": "absolute",
            "z-index": "200",

            "background-color": "#FFF"



        });
        mainDiv.attr({
            id: "mainDivMap"
        });
        var _popusMapResize = function  () {
            console.log('resize body');
            bodyHeight = body.height();
            bodyWidth = body.width();
            bodyHeight = parseInt(bodyHeight);
            bodyWidth = parseInt(bodyWidth);
            bottomDiv.css({
                "width": bodyWidth + "px",
                "height": bodyHeight + "px"
            });
            iframeHeightCenter = (bodyHeight - iframeSizeHeight) / 2;
            iframeWidthCenter = (bodyWidth - iframSizeWidth) / 2;
            mainDiv.css({
                "top": iframeHeightCenter + 'px',
                "left": iframeWidthCenter + 'px'
            });
        }
        _global.popusMapResize = _popusMapResize;
        /* body.resize(function () {
         console.log('resize body');
         bodyHeight = body.height();
         bodyWidth = body.width();
         bodyHeight = parseInt(bodyHeight);
         bodyWidth = parseInt(bodyWidth);
         bottomDiv.css({
         "width": bodyWidth + "px",
         "height": bodyHeight + "px"
         });
         iframeHeightCenter = (bodyHeight - iframeSizeHeight) / 2;
         iframeWidthCenter = (bodyWidth - iframSizeWidth) / 2;
         mainDiv.css({
         "top": iframeHeightCenter + 'px',
         "left": iframeWidthCenter + 'px'
         });
         });*/


        mainDiv.append(iframe);
        body.append(bottomDiv);
        body.append(mainDiv);
        /*bottomDiv.bind('click',function () {
            _closeMapPopus();
        });*/
    }

    function _closeMapPopus() {
        $("#mainDivMap").remove();
        $("#bottomDivMap").remove();
    }

    //弹窗管理函数  根据函数参数 字符串选择弹出相应的弹窗
    function _devicePopusManager(popusPage_str,param_json) {
        switch (popusPage_str) {
            case 'selectDevice':
                _global.popusName = 'selectDevice';
                _open_selectDevice();
                break;
            case 'addNVR':
                _global.popusName = 'addNVR';
                _open_addNVR();
                break;
            case 'addNVRWire':
                _global.popusName = 'addNVRWire';
                _open_addNVRWire();
                break;
            case 'addAlarm':
                _global.popusName = 'addAlarm';
                _open_addAlarm();
                break;
            case 'addFace':
                _global.popusName = 'addFace';
                _open_addFace();
                break;
            case 'addCar':
                _global.popusName = 'addCar';
                _open_addCar();
                break;
            case 'addWIFI':
                _global.popusName = 'addWIFI';
                _open_addWIFI();
                break;
            case 'addZone':
                _global.popusName = 'addZone';
                _open_addZone();
                break;
            case 'editZone':
                _global.popusName = 'editZone';
                _open_editZone(param_json);
                break;
            case 'addLocation':
                _open_addLocation();
                break;
            case 'editDevice':
                _global.popusName = 'editDevice';
                _open_editDevice();
                break;
            case 'editNVR':
                _global.popusName = 'editNVR';
                _open_editNVR();
                break;
            case 'editNVRWire':
                _global.popusName = 'editNVRWire';
                _open_editNVRWire();
                break;
            case 'selectArea':
                _open_selectArea();
                break;
            case 'openPrompt':
                _global.popusName = 'openPrompt';
                _global.charNode = param_json;
                _open_openPrompt();
                break;
            case 'openRelated':
                _global.userId=param_json;
                _open_openRelated();
                break;
            case 'openRelatededitRole':
                _global.relatedEditRole=param_json;
                _open_openRelatededitRole();
                break;
            case 'addCardevice':
                _global.popusName = 'addCardevice';
                _open_addCardevice();
                break;
            case 'editCardevice':
                _global.popusName = 'editCardevice';
                _open_editCardevice();
                break;
            case 'openLocation':
                _openLocation();
                break;
            case 'addAKey':
                _open_addAKey();
                break;
            case 'editAKey':
                _open_editAKey();
                break;
            case 'copyDevice':
                _open_copyDevice();
                break;
            default:
                break;
        }

    }

    function _userPopusManager(popusPage_str,param_json) {
        switch (popusPage_str) {
            case 'selectUser':
                _global.popusName = 'selectUser';
                _open_selectUser();
                break;
            case 'addOwnerUser':    //添加机主客户
                _global.popusName = 'addOwnerUser';
                _open_addOwnerUser();
                break;
            case 'addGeneralUser':  //添加一般客户
                _global.popusName = 'addGeneralUser';
                _open_addGeneralUser();
                break;
            case 'addOperator':    //添加操作员
                _global.popusName = 'addOperator';
                _open_addOperator();
                break;
            case 'alterOwnerUser': //修改机主客户
                _global.popusName = 'alterOwnerUser';
                _open_alterOwnerUser();
                break;
            case 'alterGeneralUser': //修改一般客户
                _global.popusName = 'alterGeneralUser';
                _open_alterGeneralUser();
                break;
            case 'alterSysOperator': //修改系统操作员
                _global.popusName = 'alterSysOperator';
                _open_alterSysOperator();
                break;
            case 'alterBusinessOperator': //修改业务操作员
                _global.popusName = 'alterBusinessOperator';
                _open_alterBusinessOperator();
                break;
            case 'taskplan'://任务计划
                _global.popusName = 'taskplan';
                _global.taskplan = param_json;
                _open_taskplan();
                break;
            default:
                break;
        }
    }
    
    function _rolePopusManage(popusPage_str,param_json){
    	switch (popusPage_str) {
            case 'roleManagement':
                _global.popusName = 'roleManagement';
                _open_addRole();
                break;
            case 'editRole':
                _global.popusName = 'editRole';
                _open_editRole();
                break;
            case 'viewRole':
                _global.popusName = 'viewRole';
                _open_viewRole();
                break;
            case 'viewAreaByRole':
                _open_viewAreaByRole();
                break;
            case 'selectAreaByRole':
                _open_selectAreaByRole();
                break;
            case 'selectSysCode':
                _open_selectSysCode();
                break;
            default:
                break;
        }
    }
    function _systemCode(popusPage_str,param_json){
        switch (popusPage_str) {
            case 'updatesysCode':
                _global.popusName = 'updatesysCode';
                _open_systemCode();
                break;
            case 'addsysCode':
                _global.popusName = 'addsysCode';
                _open_systemCode();
                break;
            case 'adddevModelType':
                _global.popusName = 'adddevModelType';
                _open_adddevModelType();
                break;
            case 'alterdevModelType':
                _global.popusName = 'alterdevModelType';
                _open_alterdevModelType();
                break;
            case 'adddetectorType':
                _global.popusName = 'adddetectorType';
                _open_adddetectorType();
                break;
            case 'alterdetectorType':
                _global.popusName = 'alterdetectorType';
                _open_alterdetectorType();
                break;

            case 'uDTransModelType':
                _global.popusName = 'uDTransModelType';
                _open_uDTransModelType();
                break;
            case 'addWorkstationManagement':
                _global.popusName = 'addWorkstationManagement';
                _open_addWorkstationManagement();
                break;
            case 'alterWorkstationManagement':
                _global.popusName = 'alterWorkstationManagement';
                _open_alterWorkstationManagement();
                break;
            default:
        }
    }
    
    function _eventSettingManage(popusPage_str,param_json){
    	switch (popusPage_str) {
            case 'editEventSetting':
                _global.popusName = 'editEventSetting';
                _global.UserEvtData = param_json;
                _open_editEventSetting();
                break;
            case 'addEventSetting':
                _global.popusName = 'addEventSetting';
                _open_addEventSetting();
                break;
            case 'checklinkage_setting':
                _global.popusName = 'checklinkage_setting';
                _global.UserEvtData = param_json;
                _open_checklinkage_setting();
                break;
            case 'hooklinkage_setting':
                _global.popusName = 'hooklinkage_setting';
                _global.UserEvtIdList = param_json;
                _open_hooklinkage_setting();
                break;
			case 'check_addLinkage':
                _global.popusName = 'check_addLinkage';
                _open_check_addLinkage();
                break;
            case 'check_editLinkage':
                _global.popusName = 'check_editLinkage';
                _global.UserMonitorData = param_json;
                _open_check_editLinkage();
                break;
            case 'checkSMS_forwarding':
                _global.popusName = 'checkSMS_forwarding';
                _global.UserEvtData = param_json;
                _open_checkSMS_forwarding();
                break;
             case 'hookSMS_forwarding':
                _global.popusName = 'hookSMS_forwarding';
                _global.UserEvtIdList = param_json;
                _open_hookSMS_forwarding();
                break;
            default:
                break;
        }
    }
    
    function _videoManager(popusPage_str,param_json){
    	switch (popusPage_str){
    		case 'allocationPlan':
    			_global.popusName = 'allocationPlan';
                _open_allocationPlan();
    			break;
    		default:
    			break;
    	}
    }
    

    function _getPopusName() {
        return _global.popusName;
    }

    function _setMain() {
        post_async(null, _global.winUrl.getMain, _callback_setMain);
    }
    function _callback_setMain(data) {
        var result=data.result;
        for(var i=0;result.length>i;i++){
            if(result[i].platform_type=='本平台'){
                _global.main=result[i];
            }
        }
    }
    function _getMain() {
        return  _global.main;
    }
    function _getChapNode() {
        return _global.charNode;
    }

    function _getRelatedUserId() {
        return _global.userId;
    }

    function _getRelatedEditRole() {
        return _global.relatedEditRole;
    }

    function _open_selectDevice() {

        _openPopups($('body'),'../device/addPopus/addPopus.html' , {
            /*width: 968,
            height: 393*/
            width: 600,
            height: 300
        },true);

    };
    function _open_addNVR() {
        _openPopups($('body'), "../device/deviceHome/NVRAdd/addNVR.html", {
            /*width: 771,
            height: 676*/
            width: 1000,
            height: 600
        });
    };
    function _open_addNVRWire() {
        _openPopups($('body'), "../device/deviceHome/NVRWireAdd/addNVR.html", {
            /*width: 771,
            height: 676*/
            width: 1000,
            height: 600
        });
    };
    function _open_addAlarm() {
        _openPopups($('body'), "../device/deviceHome/deviceAdd/adddevice.html", {
            /*width: 771,
            height: 676*/
            width: 1000,
            height: 600
        });
    };
    function _open_addFace() {
        _openPopups($('body'), "", {
            width: 771,
            height: 922
        });
    };
    function _open_addCar() {
        _openPopups($('body'), "", {
            width: 771,
            height: 724
        });
    };
    function _open_addWIFI() {
        _openPopups($('body'), "", {
            width: 771,
            height: 568
        });
    };
    function _open_addZone() {
        _openPopups($('body'), "../device/shebeihtml/addarea.html", {
            width: 360,
            height: 430
        });
    };
    function _open_editZone(param_json) {
    	var url="../device/shebeihtml/alterarea.html?id="+param_json.id;
        _openPopups($('body'), url, {
            width: 360,
            height: 430
        });
    };
    function _open_addLocation() {
        _openPopupsSta2($('body'), "../resource/lbsamap/amap.html", {
        //_openMapPopups($('body'), "../device/mapSign/mapSign.html", {
           /* width: 1136,
            height: 744*/
            width: 1000,
            height: 600
        });
    };
    function _openLocation() {
        _openPopupsSta2($('body'), "../resource/lbsamap/amap.html", {
        //_openMapPopups($('body'), "../related/mapSign/mapSign.html", {
            width: 1000,
            height: 600
        });
    };
    function _open_selectArea() {
        _openMapPopups($('body'), "../device/shebeihtml/selectarea.html", {
            width: 360,
            height: 539
        });
    };

    function _open_openPrompt(){                                //提示用户是否确定该操作
        _openMapPopups($('body'), "../device/pormpt/openPrompt.html", {
            width: 360,
            height: 222
        });
    };

    function _open_openRelated(){                                //设备信息查看相关机主信息
        _openMapPopups($('body'), "../related/userPage/userPopupsHome.html", {
           /* width: 789,
            height: 922*/
            width: 1000,
            height: 600
        });
    };

    function _open_openRelatededitRole(){                                //相关机主查看角色信息
        _openCusPopups($('body'), "../related/editRole/editRole.html", {
            /*width: 1280,
            height: 720*/
            width: 1000,
            height: 600
        });
    };

    function _open_editDevice() {
        _openPopups($('body'), "../device/deviceHome/deviceAdd/alterHost.html", {
            /*width: 771,
            height: 676*/
            width: 1000,
            height: 600
        });
    }
    function _open_editNVR() {
        _openPopups($('body'), "../device/deviceHome/NVRAdd/NVRHost.html", {
            /*width: 771,
            height: 676*/
            width: 1000,
            height: 600
        });
    }
    function _open_editNVRWire() {
        _openPopups($('body'), "../device/deviceHome/NVRWireAdd/NVRHost.html", {
            /*width: 771,
            height: 676*/
            width: 1000,
            height: 600
        });
    }
    function _open_addAKey() {
        _openPopups($('body'), "../device/deviceHome/AKeyAdd/addAkey.html", {
            width: 1000,
            height: 600
        });
    }
    function _open_editAKey() {
        _openPopups($('body'), "../device/deviceHome/AKeyAdd/AKeyHost.html", {
            width: 1000,
            height: 600
        });
    }
    function _open_copyDevice() {
        _openMapPopups($('body'), "../device/deviceHome/copyDevice/copyDevice.html", {
            width: 1000,
            height: 600
        });
    }

    //用户模块的弹窗
    function _open_selectUser() {
        _openPopups($('body'),'../userManager/addPopus/addPopus.html' , {
            width: 841,
            height: 393
        },true);

    };

    function _open_addOwnerUser() {
        /*_openPopups($('body'), "../hostClient/userPopups/userPopupsHome.html", {*/
        _openPopups($('body'), "../hostClient/userPopups/ownerHome/ownerHome.html", {
           /* width: 789,
            height: 922*/
            width: 1000,
            height: 600
        });
    };
    function _open_addGeneralUser() {
        _openPopups($('body'), "../userManager/userPopups/userPopupsHome.html", {
            width: 1000,
            height: 600
        });
    };
    function _open_addOperator() {
        _openPopups($('body'), "../userManager/userPopups/userPopupsHome.html", {
            width: 1000,
            height: 600
        });
    };
	
    function _open_alterOwnerUser() {
        _openPopups($('body'), "../hostClient/userPopups/userPopupsHome.html", {
            width: 1000,
            height: 600
        });
    }
    function _open_alterGeneralUser() {
        _openPopups($('body'), "../userManager/userPopups/userPopupsHome.html", {
            /*width: 789,
            height: 922*/
            width: 1000,
            height: 600
        });
    }
    function _open_alterSysOperator() {
        _openPopups($('body'), "../userManager/userPopups/userPopupsHome.html", {
           /* width: 789,
            height: 922*/
            width: 1000,
            height: 600
        });
    }
    function _open_alterBusinessOperator() {
        _openPopups($('body'), "../userManager/userPopups/userPopupsHome.html", {
            /*width: 789,
            height: 922*/
            width: 1000,
            height: 600
        });
    }
    //打开机主管理的任务计划
    function _open_taskplan() {
        _openPopups($('body'), "../userManager/taskplan/taskplan.html", {
            width: 770,
            height: 600
        });
    }
	//权限模块弹窗
	function _open_addRole(){
        _openMapPopups($('body'), "../permission/addRole/addRole.html", {
             width: 1000,
             height: 600
        });	
	};
	
	function _open_editRole(){
        _openMapPopups($('body'), "../permission/editRole/editRole.html", {
            /*width: 1280,
            height: 720*/
             width: 1000,
             height: 600
        });	
	};
    function _open_viewRole(){
        _openMapPopups($('body'), "../permission/viewRole/editRole.html", {
            /*width: 1280,
            height: 720*/
            width: 1000,
            height: 600
        });
    };
    //系统配置系统码弹窗
    function _open_systemCode(){
        _openPopups($('body'), "../sysconfiguration/systemCode/addsystemCode/addsystemCode.html", {
            width: 645,
            height: 530
        });
    }
    //系统配置系统码弹窗
    function _open_systemCode(){
        _openPopups($('body'), "../sysconfiguration/systemCode/addsystemCode/addsystemCode.html", {
            width: 1000,
            /*height: 600*/
            height:400
        });
    }
    //系统配置设备型号弹窗
    function _open_adddevModelType(){
        _openPopups($('body'), "../sysconfiguration/EquipmentType/addEquipmentType/addEquipmentType.html", {
            width: 362,
            /*height: 394*/
            height: 302
        });
    }
    //系统配置设备型号弹窗
    function _open_alterdevModelType(){
        _openPopups($('body'), "../sysconfiguration/EquipmentType/alterEquipmentType/alterEquipmentType.html", {
            width: 362,
            /*height: 394*/
            height: 302
        });
    }
    //系统配置探头型号添加弹窗
    function _open_adddetectorType() {
        _openPopups($('body'), "../sysconfiguration/detectorType/adddetectorType/adddetectorType.html", {
            width: 362,
            height: 394
        });
    }
    //系统配置探头型号修改弹窗
    function _open_alterdetectorType() {
        _openPopups($('body'), "../sysconfiguration/detectorType/alterdetectorType/alterdetectorType.html", {
            width: 362,
            height: 394
        });
    }
	//事件配置弹窗
	function _open_editEventSetting(){
		 _openMapPopups($('body'), "../hostClient/userPopups/eventSetting/editEventSetting/editEventSetting.html", {
            width: 364,
            height: 365
        });	
	}
        /*function _open_associatedApparatusAdd() {
            _openPopups($('body'), "../../../permission/editRole/editDev/hmdrectory.html", {
                width: 1280,
                height: 720
            });
        }*/
	function _open_addEventSetting(){
		_openMapPopups($('body'), "../hostClient/userPopups/eventSetting/addEventSetting/addEventSetting.html", {
            width: 705,
            height: 580
        });
	}
	function _open_checklinkage_setting(){
		_openMapPopups($('body'), "../hostClient/userPopups/eventSetting/checklinkage_setting/checklinkage_setting.html", {
            width: 771,
            height: 532
        });
	}
	function _open_hooklinkage_setting(){
		_openMapPopups($('body'), "../hostClient/userPopups/eventSetting/hooklinkage_setting/hooklinkage_setting.html", {
            width: 771,
            height: 532
        });
	}
	function _open_check_addLinkage(){
		_openCusPopups($('body'), "../hostClient/userPopups/eventSetting/checklinkage_setting/addLinkage/addLinkage.html", {
            width: 349,
			height: 177
        });
	}
	function _open_check_editLinkage(){
		_openCusPopups($('body'), "../hostClient/userPopups/eventSetting/checklinkage_setting/editLinkage/editLinkage.html", {
            width: 349,
			height: 177
        });
	}
	function _open_checkSMS_forwarding(){
		_openMapPopups($('body'), "../hostClient/userPopups/eventSetting/checkSMS_forwarding/checkSMS_forwarding.html", {
            width: 771,
            height: 532
        });
	}
	function _open_hookSMS_forwarding(){
		_openMapPopups($('body'), "../hostClient/userPopups/eventSetting/hookSMS_forwarding/hookSMS_forwarding.html", {
            width: 771,
            height: 532
        });
	}
    function _open_addCardevice() {
        _openPopups($('body'), "../device/deviceHome/cardeviceAdd/addcardevice.html", {
            /*width: 771,
            height: 690*/
            width: 1000,
            height: 600
        });
    }
    function _open_editCardevice() {
        _openPopups($('body'), "../device/deviceHome/cardeviceAdd/altercardevice.html", {
            /*width: 771,
            height: 690*/
            width: 1000,
            height: 600
        });
    }
    
    function _open_allocationPlan(){
    	 _openPopups($('body'), "../videoManager/allocationPlan/configurationplan/configurationplan.html", {
            width: 733,
            height: 453
        });
    }
    function _open_uDTransModelType(){
        _openPopups($('body'), "../sysconfiguration/workstationManagement/uDTransmission/uDTransmission.html", {
            width: 1000,
            height: 600
        });
    }
    function _open_addWorkstationManagement(){
        _openPopups($('body'), "../sysconfiguration/workstationManagement/addWorkstationManagement/addWorkstationManagement.html", {
            width: 610,
            height: 450
        });
    }
    function _open_alterWorkstationManagement(){
        _openPopups($('body'), "../sysconfiguration/workstationManagement/alterWorkstationManagement/alterWorkstationManagement.html", {
            width: 610,
            height: 450
        });
    }

	
	function _getUserEvtData(){
		return _global.UserEvtData;
	}
	function _getUserEvtIdList(){
		return _global.UserEvtIdList;
	}
	function _setUserEvtIdList(row_json){
		_global.UserEvtIdList = row_json;
	}
	function _getUserMonitorData(){
		return _global.UserMonitorData;
	}

    function _getDeviceIframeTab() {
        return _global.deviceIframe.checkedTab;
    }
    function _setDeviceIframeTab(checkedTab) {
         _global.deviceIframe.checkedTab = checkedTab;
    }

    function _sendDeviceLocation(location){

        if(mainDivIframe.showLocation && typeof (mainDivIframe.showLocation) == 'function' ){
            mainDivIframe.showLocation(location);
        }else{

        }
        if(mainDivIframe.showiframeBase && typeof (mainDivIframe.showiframeBase.showLocation) == 'function' ){
            mainDivIframe.showiframeBase.showLocation(location);
        }else{

        }
    }

    function _setDeviceLocation(location){
        _global.deviceLocation.x = '';
        _global.deviceLocation.y = '';
        _global.deviceLocation = location;
    }

    function _getDeviceLocation(){
        return _global.deviceLocation;
    }

    function _sendArea(areaNode){
        if(mainDivIframe.showArea && typeof (mainDivIframe.showArea) == 'function' ){
            mainDivIframe.showArea(areaNode);
        }else{

        }
    }
    function _getPopupsRowJson() {
    	//console.log('传出去的'+JSON.stringify(_global.popupsData.rowJson));
        return _global.popupsData.rowJson;
    }
    function _setPopupsRowJson(rowJson){
    	//console.log('传进来的'+JSON.stringify(rowJson));
        _global.popupsData.rowJson = rowJson;
    }

    function _getsystemCodeJson() {
        var data_row =_global.systemCodeData.rowJson ;
        return data_row;
    }
    function _setsystemCodeJson(rowJson) {
        _global.systemCodeData.rowJson = rowJson;
    }
    //从系统配置的设备型号列表获取数据
    function _setdevModelTypeJson(rowjson) {
        _global.devModelTypeData.rowJson = rowjson;
    }
    function _setWorkstationManagementJson(rowjson) {
        _global.workstationManagementData.rowJson = rowjson;
    }
    function _getdevModelTypeJson() {
        return _global.devModelTypeData.rowJson;
    }
    //从系统配置的探头型号列表获取数据
    function _setsnModelTypeJson(rowjson) {
        _global.snModelTypeData.rowJson = rowjson;
    }
    function _getsnModelTypeJson() {
        return _global.snModelTypeData.rowJson;
    }

    function _getLoginUserName(){                   //拿到登录用户名
        var url= "../../openLoad/getLoginUserNameAndTime.do";
        var returnData = post_sync(null, url);

        $("#userId").text(returnData.sysuserID);
        _global.roleinfo=returnData.roleinfo;
        _setUserId(returnData.userId);
        return returnData;
    }

    //处理退出系统
    function _callBack_SystemExit(data) {
        var _uRL = window.top.location.href;
        _uRL = _uRL.split("?")[0];
        var _location = configure("location");
        if (data.result.code == "200") {
            window.top.location = _location +ywHeartbeat.heartbeatConfig.serverInfo+"/cas/logout?service=" + _uRL;
        }
        if (data.response) {
            window.top.location = _uRL;
        }
    }
    
    function _getUserType() {
        return _global.userType;
    }
    function _setUserType(userType) {
         _global.userType = userType;
    }
    function _getUserId() {
        return _global.userIdAdd;
    }
    function _setUserId(userId) {
        _global.userIdAdd = userId;
    }
    function _getSysroleId() {
        return _global.roleinfo.roleId
    }
    function _setUserIframeTab(tabStr) {
        _global.userIframe.checkedTab = tabStr;
    }

    function _getUserIframeTab() {
        return _global.userIframe.checkedTab;
    }
    /**************************************
     获取计划任务信息
     ***************************************/
    function _gettaskplan() {
        return _global.taskplan;
    }
    function _popusStaManager(popusPage_str) {
        switch (popusPage_str) {
            case 'alterOwnerUser': //修改机主客户
                _global.popusName = 'alterOwnerUser';
                _open_alterStaOwnerUser();
                break;
            case 'alterGeneralUser': //修改一般客户
                _global.popusName = 'alterGeneralUser';
                _open_alterStaGeneralUser();
                break;
            case 'alterSysOperator': //修改系统操作员
                _global.popusName = 'alterSysOperator';
                _open_alterStaSysOperator();
                break;
            case 'alterBusinessOperator': //修改业务操作员
                _global.popusName = 'alterBusinessOperator';
                _open_alterBusinessOperator();
                break;
            case 'eventQuery'://事件查询
                _global.popusName = 'eventQuery';
                _open_eventQuery();
                break;
            case 'editDevice':
                _global.popusName = 'editDevice';
                _open_editDeviceSta();
                break;
            case 'editNVR':
                _global.popusName = 'editNVR';
                _open_editNVRWireSta();
                break;
            case 'editAKey':
                _global.popusName = 'editAKey';
                _open_editAKeySta();
                break;
            case 'editNVRWire':
                _global.popusName = 'editNVRWire';
                _open_editNVRSta();
                break;

            case 'rdQuery'://处警查询  综合查询
                _global.popusName = 'rdQuery';
                _open_rdQuery();
                break;
            case 'rdVerify'://核警查询  综合查询
                _global.popusName = 'rdVerify';
                _open_rdVerify();
                break;
            case 'fixQuery'://维修查询  综合查询
                _global.popusName = 'fixQuery';
                _open_fixQuery();
                break;
            case 'patrollist'://巡检单查询  综合查询
                _global.popusName = 'patrollist';
                _open_patrollist();
                break;
            case 'linkageVideo':
                _global.popusName = 'linkageVideo';
                _open_linkageVideo();
                break;
            case 'openMap':
                _global.popusName = 'openMap';
                _open_map();
                break;
            case 'selectArea1':
                _global.popusName = 'selectArea1';
                _open_selectAreaSta();
                break;
            case 'selectArea2':
                _global.popusName = 'selectArea2';
                _open_selectAreaSta();
                break;
            case 'selectArea3':
                _global.popusName = 'selectArea3';
                _open_selectAreaSta();
                break;
            case 'selectArea4':
                _global.popusName = 'selectArea4';
                _open_selectAreaSta();
                break;
            case "picCheck":
                _global.popusName = 'picCheck';
                _open_picCheck();
                break;
            case "dataUpSet":
                _global.popusName = 'dataUpSet';
                _open_dataUpSet();
                break;
            default:
                break;
        }
    }

    function _open_alterStaOwnerUser() {
        _openPopupsSta($('body'), "../statisticsQuery/userPopups/userPopupsHome.html", {
            width: 1000,
            height: 600
        });
    }
    function _open_alterStaGeneralUser() {
        _openPopupsSta($('body'), "../statisticsQuery/userPopups/userPopupsHome.html", {
            width: 1000,
            height: 600
        });
    }
    function _open_alterStaSysOperator(){
        _openPopupsSta($('body'), "../statisticsQuery/userPopups/userPopupsHome.html", {
            width: 1000,
            height: 600
        });
    }
    function _open_editDeviceSta() {
        _openPopupsSta($('body'), "../statisticsQuery/deviceHome/deviceAdd/alterHost.html", {
            width: 1000,
            height: 600
        });
    }
    function _open_editNVRSta() {
        _openPopupsSta($('body'), "../statisticsQuery/deviceHome/NVRWireAdd/NVRHost.html", {
            width: 1000,
            height: 600
        });
    }
    function _open_editNVRWireSta() {
        _openPopupsSta($('body'),"../statisticsQuery/deviceHome/NVRAdd/NVRHost.html" , {
            width: 1000,
            height: 600
        });
    }
    function _open_editAKeySta() {
        _openPopupsSta($('body'),"../statisticsQuery/deviceHome/AKeyAdd/AKeyHost.html" , {
            width: 1000,
            height: 600
        });
    }

    //处警查询  综合查询
    function _open_rdQuery() {
        _openPopupsSta($('body'), "../statisticsQuery/rdQuery/userInfo/userInfo.html", {
            width: 1000,
            height: 600
        });
    }
    //核警查询  综合查询
    function _open_rdVerify() {
        _openPopupsSta($('body'), "../statisticsQuery/rdVerify/userInfo/userInfo.html", {
            width: 1000,
            height: 600
        });
    }
    //维修查询  综合查询
    function _open_fixQuery() {
        _openPopupsSta($('body'), "../statisticsQuery/fixQuery/userInfo/userInfo.html", {
            width: 1000,
            height: 600
        });
    }
    //巡检单查询  综合查询
    function _open_patrollist() {
        _openPopupsSta($('body'), "../statisticsQuery/inspection/userInfo/userInfo.html", {
            width: 1000,
            height: 600
        });
    }
    //事件查询  综合查询
    function _open_eventQuery() {
        _openPopupsSta($('body'), "../statisticsQuery/eventQuery/userPopups/userPopupsHome.html", {
            width: 1000,
            height: 600
        });
    }
    //联动视频
    function _open_linkageVideo() {
        _openPopupsSta2($('body'), "../statisticsQuery/linkageVideo/linkageVideo.html", {
            width: 1310,
            height: 440
        });
    };
    function _open_map() {      //打开电子地图
        _openPopupsSta2($('body'), "../resource/lbsamap/lbsamap.html", {
        //_openPopupsSta2($('body'), "../statisticsQuery/mapSign/mapSign.html", {
            width: 1000,
            height: 600
        });
    }
    function _open_selectAreaSta() {      //区域选择
        _openPopupsSta2($('body'), "../statisticsQuery/shebeihtml/selectarea.html", {
            width: 360,
            height: 545
        });
    }
    function _open_picCheck() {      //图片查看
        _openPopupsSta2($('body'), "../statisticsQuery/rdQuery/userInfo/pictureCheck/picture.html", {
            width: 1000,
            height: 600
        });
    }
    function _open_dataUpSet() {      //编辑分中心
        _openPopupsSta2($('body'), "../sysconfiguration/dataUpSet/editUpSet/editUpSet.html", {
            width: 385,
            height: 360,
        });
    }

    function _open_selectAreaByRole() {
        _openPopupsSta2($('body'), "../permission/selectAreas/selectarea.html", {
            width: 360,
            height: 539
        });
    };
    function _open_viewAreaByRole() {
        _openPopupsSta2($('body'), "../permission/viewRole/selectAreas/selectarea.html", {
            width: 360,
            height: 539
        });
    };
    function _open_selectSysCode() {
        _openPopupsSta2($('body'), "../permission/selectSysCode/selectSysCode.html", {
            width: 360,
            height: 539
        });
    }
    function _setResizeSta(ResizeSta) {
        _global.popusResizeSta = ResizeSta;
    }
    function _setResizeSta2(ResizeSta) {
        _global.popusResizeSta2 = ResizeSta;
    }
    function _okAndCancel(confirmCallback,cancelCallback) {
        $.fn.alertOKorCancel({
            "title": '确认信息',//标题设置
            'src': 'img/title.png', //图标路径
            'tip': '确定要保存单据么？', //提示语
            'cancelBtnLbl': '取消',//取消按钮名称
            'confirmBtnLbl': '确定',//确定按钮名称
            cancelCallback:cancelCallback,
            confirmCallback: confirmCallback
        });

    }
    function _okAndCancelAndMsg(msg,confirmCallback,cancelCallback) {
        $.fn.alertOKorCancel({
            "title": '确认信息',//标题设置
            'src': 'img/title.png', //图标路径
            'tip': msg, //提示语
            'cancelBtnLbl': '取消',//取消按钮名称
            'confirmBtnLbl': '确定',//确定按钮名称
            cancelCallback:cancelCallback,
            confirmCallback: confirmCallback
        });

    }
        
        function _delAndCancel(confirmCallback,cancelCallback) {
        $.fn.alertOKorCancel({
            "title": '确认信息',//标题设置
            'src': 'img/title.png', //图标路径
            'tip': '确定要删么？', //提示语
            'cancelBtnLbl': '取消',//取消按钮名称
            'confirmBtnLbl': '确定',//确定按钮名称
            cancelCallback:cancelCallback,
            confirmCallback: confirmCallback
        });

    }
    
    function _alertSuccess(tipStr,sec,callbackFun) {
        $.fn.alertSure({
            "sec": sec,
            "title": '提示信息',
            'src': 'img/success.png',
            'tip': tipStr,
            confirmCallback: callbackFun
        });
    }
    
    function _alertFail(tipStr,sec,callbackFun) {
        $.fn.alertSure({
            "sec": sec,
            "title": '提示信息',
            'src': 'img/fail.png',
            'tip': tipStr, 
            confirmCallback: callbackFun
        });
    }
    
    function _alertWarn(tipStr,sec,callbackFun) {
        $.fn.alertSure({
            "sec": sec,
            "title": '警告信息',
            'src': 'img/warn.png',
            'tip': tipStr,
            confirmCallback: callbackFun
        });
    }
    
    function _comfireFloat(tipStr,confirmCallback,cancelCallback) {
        $.fn.alertOKorCancel({
            "title": '确认信息',//标题设置
            'src': 'img/title.png', //图标路径
            'tip': tipStr, //提示语
            'cancelBtnLbl': '取消',//取消按钮名称
            'confirmBtnLbl': '确定',//确定按钮名称
            cancelCallback:cancelCallback,
            confirmCallback: confirmCallback
        });
    }
    
    function _alertTip(tipStr,sec,callbackFun) {
        $.fn.alertSure({
            "sec": sec,
            "title": '提示信息',
            'src': 'img/warn.png',
            'tip': tipStr,
            confirmCallback: callbackFun
        });
    }
    /************************************
     刷新用户列表
     *************************************/
    function _RefreshhostClientIframe() {
        hostClientIframe.getCustomerinframes();
    }
    /************************************
    刷新用户列表
    *************************************/
    function _RefreshcustomerIframe() {
        userIframe.customerIframe.getCustomerinframes();
    }
    function _RefreshoperatorIframe() {
        userIframe.operatorIframe.getOperator();
    }
    function _addsyscode() {
        systemSetting.systemCodeIframe.goback();
    }
    function _adddevModellist() {
        systemSetting.equipmentTypeIframe.RefreshdevType();
    }
    function _add_snmodellist() {
        systemSetting.probeTypeIframe.Refreshsnmodel();
    }
    /************************************
     点击设备管理右侧调度列表
     *************************************/
    function _clickdeviceright(Node) {
        deviceIframe.clicktitle(Node)
    }

    //用于处警单图片查看
    function _getDisposalAlarmNum(){
        return _global.disposalAlarmNum;
    }
    //用于处警单图片查看
    function _setDisposalAlarmNum(disposalAlarmNum) {
        _global.disposalAlarmNum = disposalAlarmNum;
    }
    function _RefreworkstationManagementIframe() {
        systemSetting.workstationManagement.RefreshdevType();
    }
    function _getLatLong(){      //根据设备编号获取经纬度
        var resultPara = getPopupsRowJson();
        var devId="";
        if(resultPara.devId){
            devId=resultPara.devId;
        }else {
            devId=resultPara.deviceId;
        }
        var para = {
            "devId":devId
        }
        var result = post_sync(para,"/IntegratedMM/query/getLatLng.do");
        return result;
    }
    function _getAlarmReason() {
        //报警原因查询
        post_async(
            null,
            "../../QueryAlarmCaseList.do",
            _callback_getAlarmReason);
    }
    function _callback_getAlarmReason(data) {
        if(data.code == 1000){
            _global.alarmReason = data.result;
        }else{
            _getAlarmReason();  //请求失败 再请求
        }

    }
    function _getAlarmReasonLocation() {
        return _global.alarmReason;
    }
    function _setCopyDevId(devId) {
        _global.copyDevId=devId;
    }

    function _getCopyDevId() {
        return _global.copyDevId;
    }
})(window,jQuery);