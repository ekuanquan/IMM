/**
 * Created by ly on 2016/10/9.
 */
charset = "utf-8";

$(document).ready(function () {
    init();
});

;(function ($, window) {
    window.init = _init;//修改页面大小
    window.appendRow = addTableRow;
    window.getAlarmInfos = _getAlarmInfos;
    window.queryData_page = _queryData_page;
    window.getPageInfo = _getPageInfo;
    window.setPageInfo = _setPageInfo;
    window.searchEventInfo = _searchEventInfo;
    var _config = {
        minWidth: 2777,
        nvrminWidth: 2518,
        nvrMinWidth: 2624,
        minHeight: 765,
        ajaxUrl: {
            getCphEquipmentDataUrl: '/IntegratedMM/query/getCphEquipmentData.do',
            getNvrOnlineUrl:'/IntegratedMM/query/RDANvrHave.do',
            getNvrInternetUrl:'/IntegratedMM/query/RDANvrNo.do',
            getDevModelUrl:'/IntegratedMM/addDevice/getDevModel.do',
            getAKeyframeUrl: '/IntegratedMM/UpdateDdviceCtrl/queryOneClickDev.do'
        }
    };
    var _global = {
        currentUser: '',//当前用户名
        heartBeatTime: 1000,//心跳间隔
        casLog: 'https://pc-20150819yb:8843/cas/logout?service=',
        uploadURL: '',
        dwonloadURL: '',
        sendInfo: {},
        userInfo: {},
        top: parent.parent,
        up: parent,
        plugins: {
            page: null
        },
        mouseoutEventA: null,
        mouseoutEventB: null,
        getAlarmInfosParams: {
            queryTond: {
                devId: '',
                installDate: ''
            },
            pageInfoPojo: {
                currentPage: '1',
                /*sort: 'receiveTime|ASC',*/
                sort: 'devId|ASC',
                pageSize: '25',
                totalNum: '',
                totalPage: ''
            }
        },
        eventTypeSearch: '1',
        eventTypeJson: null,
        dataType: 'alarm'
    };


    var _globalH = {
        getAlarmInfosParams: {
            queryTond: {
                devId: '',
                installDate: ''
            },
            pageInfoPojo: {
                currentPage: '1',
                /*sort: 'receiveTime|ASC',*/
                sort: '',
                pageSize: '25',
                totalNum: '',
                totalPage: ''
            }
        }
    };

    function _init() {
        _initEven();
    }
    /************************************************
     报警主机 有线NVR 互联网NVR切换时保存当前页数222
     ************************************************/
    function getCurrentPage(href)
    {
        var overName = $("this").data(href);
        if(href == "#table"){
            var setCurrentPage = $("this").data("setCurrentPage",devCurrentPage);
            if(overName == "#table_nvr_online"){
                var CurrentPage=_global.getAlarmInfosParams.pageInfoPojo.currentPage;
                var nvrCurrentPage = $("this").data("nvrCurrentPage",CurrentPage);
            }
            else if(overName == "#table_nvr_internet"){
                var CurrentPage=_global.getAlarmInfosParams.pageInfoPojo.currentPage;
                var intCurrentPage = $("this").data("intCurrentPage",CurrentPage);
            }
            else if(overName == "#AKey_tab_internet"){
                var CurrentPage=_global.getAlarmInfosParams.pageInfoPojo.currentPage;
                var AkeyCurrentPage = $("this").data("AkeyCurrentPage",CurrentPage);
            }
        }
        else if(href == "#table_nvr_online"){
            var setCurrentPage =  $("this").data("setCurrentPage",nvrCurrentPage);
            if(overName == "#table"){
                var CurrentPage=_global.getAlarmInfosParams.pageInfoPojo.currentPage;
                var devCurrentPage = $("this").data("devCurrentPage",CurrentPage);
            }
            else if(href == "#table_nvr_internet"){
                var CurrentPage=_global.getAlarmInfosParams.pageInfoPojo.currentPage;
                var intCurrentPage= $("this").data("intCurrentPage",CurrentPage);
            }
            else if(overName == "#AKey_tab_internet"){
                var CurrentPage=_global.getAlarmInfosParams.pageInfoPojo.currentPage;
                var AkeyCurrentPage = $("this").data("AkeyCurrentPage",CurrentPage);
            }
        }
        else if(href == "#table_nvr_internet"){
            var setCurrentPage = $("this").data("setCurrentPage",CurrentPage);
            if(overName == "#table_nvr_online"){
                var CurrentPage=_global.getAlarmInfosParams.pageInfoPojo.currentPage;
                var nvrCurrentPage=$("this").data("intCurrentPage",CurrentPage);
            }
            else if(overName == "#table"){
                var CurrentPage=_global.getAlarmInfosParams.pageInfoPojo.currentPage;
                var devCurrentPage=$("this").data("devCurrentPage",CurrentPage);
            }
            else if(overName == "#AKey_tab_internet"){
                var CurrentPage=_global.getAlarmInfosParams.pageInfoPojo.currentPage;
                var AkeyCurrentPage = $("this").data("AkeyCurrentPage",CurrentPage);
            }
        }
        else if(href == "#AKey_tab_internet"){
            var setCurrentPage = $("this").data("AkeyCurrentPage",CurrentPage);
            if(overName == "#table_nvr_online"){
                var CurrentPage=_global.getAlarmInfosParams.pageInfoPojo.currentPage;
                var nvrCurrentPage=$("this").data("intCurrentPage",CurrentPage);
            }
            else if(overName == "#table"){
                var CurrentPage=_global.getAlarmInfosParams.pageInfoPojo.currentPage;
                var devCurrentPage=$("this").data("devCurrentPage",CurrentPage);
            }
            else if(href == "#table_nvr_internet"){
                var CurrentPage=_global.getAlarmInfosParams.pageInfoPojo.currentPage;
                var intCurrentPage= $("this").data("intCurrentPage",CurrentPage);
            }
        }
        overName=href;
    }
    function _initEven() {

        document.oncontextmenu = function () {
            return false;
        }
        _global.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: _queryData_page,
            cssPath: '../../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
        });
        _switchFiltrate();
        $("#search_text").keydown(function (event) {
            if (event.keyCode == 13) { //绑定回车
                _searchEventInfo();
            }
        });
        $("#nav_tab  div").bind("click", function (e) {
        	e.preventDefault();
            var href = $(this).attr('href');
            if(href == "#table"){
            	_global.dataType = "alarm";
            	var flag = $(this).data("flag");
            	if(flag == undefined || flag == 0){
                    _searchEventInfo();
                    $(this).data("flag",1);
                }
                else{
                    getCurrentPage(href);
                    var totalPag = $(this).data('totalPag');
                    var currentPage = $(this).data('currentPage');
                    var totalNum = $(this).data('totalNum');
                    if(totalNum==0)totalNum=-1;
                    _global.plugins.page.setPage(totalPag, currentPage, totalNum);
                }
            }if(href == "#table_nvr_online"){
            	_global.dataType = "nvrOnline";
                var flag = $(this).data("flag");
                if(flag == undefined || flag == 0){
                    _searchEventInfo();
                    $(this).data("flag",1);
                }
                else{
                    getCurrentPage(href);
                    var totalPag = $(this).data('totalPag');
                    var currentPage = $(this).data('currentPage');
                    var totalNum = $(this).data('totalNum');
                    if(totalNum==0)totalNum=-1;
                    _global.plugins.page.setPage(totalPag, currentPage, totalNum);
                }
            }if(href == "#table_nvr_internet"){
            	_global.dataType = "nvrInternet";
                var flag = $(this).data("flag");
                    if(flag == undefined || flag == 0){
                        _searchEventInfo();
                        $(this).data("flag",1);
                    }
                    else{
                        getCurrentPage(href);
                        var totalPag = $(this).data('totalPag');
                        var currentPage = $(this).data('currentPage');
                        var totalNum = $(this).data('totalNum');
                        if(totalNum==0)totalNum=-1;
                        _global.plugins.page.setPage(totalPag, currentPage, totalNum);
                    }
            }
            if(href == "#AKey_tab_internet"){
                _global.dataType = "AKey_tab";
                var flag = $(this).data("flag");
                if(flag == undefined || flag == 0){
                    _searchEventInfo();
                    $(this).data("flag",1);
                }
                else{
                    getCurrentPage(href);
                    var totalPag = $(this).data('totalPag');
                    var currentPage = $(this).data('currentPage');
                    var totalNum = $(this).data('totalNum');
                    if(totalNum==0)totalNum=-1;
                    _global.plugins.page.setPage(totalPag, currentPage, totalNum);
                }
            }
            $(href).show().siblings().hide();

            $("#nav_tab  div.triangle").removeClass("triangle");
            $(this).addClass("triangle");
        });
        /************************************************
         确定按钮的点击事件222
         ************************************************/
        $("#policeCheck").bind('click',function () {
            //重新搜索时页码复位
            devCurrentPage=1;

            nvrCurrentPage=1;
            intCurrentPage=1;
            //标志位复位
            /*devpass=0;
            nvrpass=0;
            intpass=0;*/
            $('#alarmHost').data('flag',0);
            $('#wireNvr').data('flag',0);
            $('#internetNvr').data('flag',0);
            _searchEventInfo();
        });
        /************************************************
         从后台获取设备型号的下拉信息222
         ************************************************/
        $("#devType").one('click',function () {
            var params = {devType:"0"};
            post_async(params, _config.ajaxUrl.getDevModelUrl, getdevType_callback);
        });
        //默认点击一次 提前加载数据
        $("#devType").click();

        var nowTime = getNowFormatDate();
        var startTime = getBeforeFormatDate();
        /*nowTime =nowTime.split(" ")[0]+" 23:59:59";
         startTime =startTime.split(" ")[0]+" 00:00:00";*/
        nowTime =nowTime.split(" ")[0];
        startTime =startTime.split(" ")[0];
        /*$("#startTime").val(nowTime);*/
        //$("#startTime").val(startTime);
        $('#startTime').bind('focus',function () {
            WdatePicker({
                maxDate: '#F{$dp.$D(\'endTime\')}',
                dateFmt: 'yyyy-MM-dd',
                isShowClear: true
            });
            this.blur();
        });
        //$("#endTime").val(nowTime);
        $('#endTime').bind('focus',function () {
            WdatePicker({
                minDate: '#F{$dp.$D(\'startTime\')}',
                dateFmt: 'yyyy-MM-dd',
                isShowClear: true
            });
            this.blur();
        });
        /************************************************
         升降序的切换222
         ************************************************/
        $("#timeorder").click(function(){
            $("#timePng").toggleClass("timePngchange");
            _getAlarmInfosH();
        });

        $("#policeCheck").click();
    }
    /************************************************
     获取搜索条件222
     ************************************************/
    function _searchEventInfo() {
        var queryTond = {};
        var pageInfoPojo ={};
        queryTond.fuzzy = {};
        queryTond.fuzzy.fuzzyKey=$("#fuzzy").val();
        queryTond.fuzzy.fuzzyValue=$("#search_text").val();
        queryTond.devModelId=$("#devType").val();
        queryTond.devMaster=$("#devNone").val();
        queryTond.timeStart=$("#startTime").val();
        queryTond.timeEnt=$("#endTime").val();
        pageInfoPojo.sort=sortVal();
        _getAlarmInfos(queryTond,pageInfoPojo);  //初始化请求未处理事件
    }
    /************************************************
     判断升降序222
     ************************************************/
    function sortVal() {
        var sort="";
            if($("#timePng").hasClass('timePngchange')){
                sort="devId|DESC";
            }
            else{
                sort="devId|ASC";
            }

        return sort;
    }

    function _switchFiltrate() {
        $('.filtrate').bind('click', function () {
            $(this).siblings().children('.Checked_img').removeClass('isChecked_search').addClass('noChecked_search');
            $(this).children('.Checked_img').removeClass('noChecked_search').addClass('isChecked_search');
            _swichEventType($(this).attr('id'));
        });

    }

    function _swichEventType(eventType) {
        switch (eventType) {
            case 'allDevice':
                _global.eventTypeSearch = '1';
                break;
            case 'yesterdayInstall':
                _global.eventTypeSearch = '2';
                break;
            case 'weekInstall':
                _global.eventTypeSearch = '3';
                break;
            case 'monthInstall':
                _global.eventTypeSearch = '4';
                break;
            default:
                break;

        }
        _searchEventInfo();
    }

    function addTableRow(jsonData, isPre) {
        var row_json = jsonData;
        $div_row = $("<tr></tr>");
        $div_devId = $("<td></td>");
        $div_devModelName = $("<td></td>");
        $div_devTypeName = $("<td></td>");
        $div_devName = $("<td></td>");
        $div_devZone = $("<td></td>");
        $div_internetTel = $("<td></td>");
        $div_eqipRelatedNum = $("<td></td>");
        $div_returnCode = $("<td></td>");
        $div_wireless = $("<td></td>");
        $div_Lng = $("<td></td>");
        $div_Lat = $("<td></td>");
        $div_installUnit = $("<td></td>");
        $div_devAddr = $("<td></td>");
        $div_powerAddr = $("<td></td>");
        $div_TelAddr = $("<td></td>");
        $div_keyboardAddr = $("<td></td>");
        $div_installName = $("<td></td>");
        $div_installDate = $("<td></td>");
        $div_fMemo = $("<td></td>");

        $div_row
            .append($div_devId)
            .append($div_devModelName)
            .append($div_devTypeName)
            .append($div_devName)
            .append($div_devZone)
            .append($div_internetTel)
            .append($div_eqipRelatedNum)
            .append($div_returnCode)
            .append($div_wireless)
            .append($div_Lng)
            .append($div_Lat)
            .append($div_installUnit)
            .append($div_devAddr)
            .append($div_powerAddr)
            .append($div_TelAddr)
            .append($div_keyboardAddr)
            .append($div_installName)
            .append($div_installDate)
            .append($div_fMemo)

            /*5.append($div_accountNum)*/
            .addClass('table_row')
            .attr('id', jsonData.eventNum);


        $div_devId.addClass("devId_title").text(row_json.devId).attr("title", row_json.devId);
        $div_devModelName.addClass("zoneNum_title").text(row_json.devModelName).attr("title", row_json.devModelName);
        $div_devTypeName.addClass("devTypeName_title table_title_item").text(row_json.devTypeName).attr("title", row_json.devTypeName);
        $div_devName.addClass("userName_title").text(row_json.devName).attr("title", row_json.devName);
        $div_devZone.addClass("accountNum_title table_title_item").text(row_json.areaName).attr("title",row_json.areaName);
        $div_internetTel.addClass("zoneNum_title").text(row_json.pnlTel).attr("title", row_json.pnlTel);
        $div_eqipRelatedNum.addClass("accountNum_title table_title_item").text(row_json.pnlActID).attr("title", row_json.pnlActID);
        $div_returnCode.addClass("keyboardAddr_title table_title_item").text(row_json.RegexPWD==null?"":row_json.RegexPWD).attr("title", row_json.RegexPWD==null?"":row_json.RegexPWD);
        $div_wireless.addClass("zoneNum_title").text(row_json.pnlHdTel).attr("title", row_json.pnlHdTel);
        $div_Lng.addClass("Lng_title").text(row_json.devLng).attr("title", row_json.devLng);
        $div_Lat.addClass("Lat_title").text(row_json.devlat).attr("title", row_json.devlat);
        $div_installUnit.addClass("installUnit_title table_title_item").text(row_json.instUnit).attr("title", row_json.instUnit);
        $div_devAddr.addClass("zoneNum_title").text(row_json.pnlAddr).attr("title", row_json.pnlAddr);
        $div_powerAddr.addClass("zoneNum_title").text(row_json.pnlPowerAddr).attr("title", row_json.pnlPowerAddr);
        $div_TelAddr.addClass("zoneNum_title").text(row_json.telAddr).attr("title", row_json.telAddr);
        $div_keyboardAddr.addClass("zoneNum_title").text(row_json.keyboardAddr).attr("title", row_json.keyboardAddr);
        $div_installName.addClass("installName_title table_title_item").text(row_json.instMan).attr("title", row_json.instMan);
        $div_installDate.addClass("installDate_title table_title_item_time").text(row_json.devInstDate).attr("title", row_json.devInstDate);
        $div_fMemo.addClass("fMemo_title table_title_item").text(row_json.fMemo).attr("title", row_json.fMemo);

        $div_row.appendTo($("#table_content"));
        $div_row.bind('dblclick', function (e) {
            _global.top.setPopupsRowJson(row_json);
            _global.top.popusStaManager('editDevice');
        });
    }
    function addNvrTableRow(jsonData) {
    	
        var row_json = jsonData;
        $div_row = $("<tr></tr>");
        $div_devId = $("<td></td>");
        $div_devName = $("<td></td>");
        $div_pnlActID = $("<td></td>");
        $div_areaName = $("<td></td>");
        $div_devTypeName = $("<td></td>");
        $div_devModelName = $("<td></td>");
        $div_manufacturer=$("<td></td>");
        $div_devLoginName = $("<td></td>");
        $div_devLoginPwd = $("<td></td>");
        $div_devIP = $("<td></td>");
        $div_devPort = $("<td></td>");
        $div_Lng = $("<td></td>");
        $div_Lat = $("<td></td>");
        $div_serverIP = $("<td></td>");
        $div_channelNum = $("<td></td>");
        $div_instMan = $("<td></td>");
        $div_instUnit = $("<td></td>");
        $div_instTime = $("<td></td>");
        $div_devAddr = $("<td></td>");
        $div_fMemo = $("<td></td>");

        $div_row
            .append($div_devId)
            .append($div_devName)
            .append($div_pnlActID)
            .append($div_areaName)
            .append($div_devTypeName)
            .append($div_devModelName)
            .append( $div_manufacturer)
            .append($div_devLoginName)
            .append($div_devLoginPwd)
            .append($div_devIP)
            .append($div_devPort)
            .append($div_Lng)
            .append($div_Lat)
            .append($div_serverIP)
            .append($div_channelNum)
            .append($div_instMan)
            .append($div_instUnit)
            .append($div_instTime)
            .append($div_devAddr)
            .append($div_fMemo)
            .addClass('table_row')
            .attr('id', jsonData.devId);

        $div_devId.addClass("devId_title").text(row_json.devId).attr("title", row_json.devId);
        $div_devName.addClass("table_title_item").text(row_json.devName).attr("title", row_json.devName);
        $div_pnlActID.addClass("devTypeName_title").text(row_json.pnlActID).attr("title", row_json.pnlActID);
        $div_areaName.addClass("table_title_item").text(row_json.areaName).attr("title", row_json.areaName);
        $div_devTypeName.addClass("accountNum_title table_title_item").text(row_json.devTypeName).attr("title", row_json.devTypeName);
        $div_devModelName.addClass("accountNum_title table_title_item").text(row_json.devModelName).attr("title", row_json.devModelName);

       /* $div_manufacturer.addClass("accountNum_title table_title_item").text(row_json.manufacturer).attr("title",row_json.manufacturer);*/
        $div_manufacturer.addClass("accountNum_title table_title_item").text(changeManufacturer(row_json.manufacturer)).attr("title",changeManufacturer(row_json.manufacturer));

        $div_devLoginName.addClass("table_title_item").text(row_json.devLoginName).attr("title",row_json.devLoginName);
        $div_devLoginPwd.addClass("table_title_item").text(row_json.devLoginPwd).attr("title", row_json.devLoginPwd);
        $div_devIP.addClass("accountNum_title table_title_item").text(row_json.devIp).attr("title", row_json.devIp);
        $div_devPort.addClass("table_title_item").text(row_json.devPort).attr("title", row_json.devPort);
        $div_Lng.addClass("Lng_title").text(row_json.devLng).attr("title", row_json.devLng);
        $div_Lat.addClass("Lat_title").text(row_json.devlat).attr("title", row_json.devlat);
        $div_serverIP.addClass("zoneNum_title").text(row_json.videoServer).attr("title", row_json.videoServer);
        $div_channelNum.addClass("table_title_item").text(row_json.ChannelNum).attr("title", row_json.ChannelNum);
        $div_instMan.addClass("table_title_item").text(row_json.instMan).attr("title", row_json.instMan);
        $div_instUnit.addClass("table_title_item").text(row_json.instUnit).attr("title", row_json.instUnit);
        $div_instTime.addClass("table_title_item").text(row_json.devInstDate).attr("title", row_json.devInstDate);
        $div_devAddr.addClass("table_title_item").text(row_json.pnlAddr).attr("title", row_json.pnlAddr);
        $div_fMemo.addClass("zoneNum_title").text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($("#table_content_line"));

        $div_row.bind('dblclick', function (e) {
            _global.top.popusStaManager('editNVR');
            _global.top.setPopupsRowJson(row_json);

        });
    }

    function addNVRTableRow(jsonData) {

        var row_json = jsonData;
        $div_row = $("<tr></tr>");

        $div_devId = $("<td></td>");
        $div_devName = $("<td></td>");
        $div_pnlActID = $("<td></td>");
        $div_areaName = $("<td></td>");
        $div_devTypeName = $("<td></td>");
        $div_devModelName = $("<td></td>");
        $div_manufacturer = $("<td></td>");
        $div_devLoginName = $("<td></td>");
        $div_devLoginPwd = $("<td></td>");
        $div_P2PID = $("<td></td>");
        $div_instTime = $("<td></td>");
        $div_Lng = $("<td></td>");
        $div_Lat = $("<td></td>");
        $div_channelNum = $("<td></td>");
        $div_devAddr = $("<td></td>");
        $div_instMan = $("<td></td>");
        $div_instUnit = $("<td></td>");
        $div_serverIP = $("<td></td>");
        $div_fMemo = $("<td></td>");

        $div_row
            .append($div_devId)
            .append($div_devName)
            .append($div_pnlActID)
            .append($div_areaName)
            .append($div_devTypeName)
            .append($div_devModelName)
            .append($div_manufacturer)
            .append($div_devLoginName)
            .append($div_devLoginPwd)
            .append($div_P2PID)
            .append($div_instTime)
            .append($div_Lng)
            .append($div_Lat)
            .append($div_channelNum)
            .append($div_devAddr)
            .append($div_instMan)
            .append($div_instUnit)
            .append($div_serverIP)
            .append($div_fMemo)
            .addClass('table_row')
            .attr('id', jsonData.devId);

        $div_devId.addClass("devId_title").text(row_json.devId).attr("title", row_json.devId);
        $div_devName.addClass("zoneNum_title").text(row_json.devName).attr("title", row_json.devName);
        $div_pnlActID.addClass("devTypeName_title").text(row_json.pnlActID).attr("title", row_json.pnlActID);
        $div_areaName.addClass("userName_title").text(row_json.areaName).attr("title", row_json.areaName);
        $div_devTypeName.addClass("table_title_item").text(row_json.devTypeName).attr("title", row_json.devTypeName);
        $div_devModelName.addClass("table_title_item").text(row_json.devModelName).attr("title", row_json.devModelName);
        $div_manufacturer.addClass("table_title_item").text(changeManufacturer(row_json.manufacturer)).attr("title", changeManufacturer(row_json.manufacturer));
        $div_devLoginName.addClass("table_title_item").text(row_json.devLoginName).attr("title",row_json.devLoginName);
        $div_devLoginPwd.addClass("table_title_item").text(row_json.devLoginPwd).attr("title", row_json.devLoginPwd);
        $div_P2PID.addClass("table_title_item").text(row_json.devTUTKID).attr("title", row_json.devTUTKID);
        $div_instTime.addClass("table_title_item").text(row_json.devInstDate).attr("title", row_json.devInstDate);
        $div_Lng.addClass("Lng_title").text(row_json.devLng).attr("title", row_json.devLng);
        $div_Lat.addClass("Lat_title").text(row_json.devlat).attr("title", row_json.devlat);
        $div_channelNum.addClass("table_title_item").text(row_json.ChannelNum).attr("title", row_json.ChannelNum);
        $div_devAddr.addClass("zoneNum_title").text(row_json.pnlAddr).attr("title", row_json.pnlAddr);
        $div_instMan.addClass("table_title_item").text(row_json.instMan).attr("title", row_json.instMan);
        $div_instUnit.addClass("table_title_item").text(row_json.instUnit).attr("title", row_json.instUnit);
        $div_serverIP.addClass("zoneNum_title").text(row_json.videoServer).attr("title", row_json.videoServer);
        $div_fMemo.addClass("zoneNum_title").text(row_json.fMemo).attr("title", row_json.fMemo);

        $div_row.appendTo($("#table_content_internet"));

        $div_row.bind('dblclick', function (e) {
            _global.top.setPopupsRowJson(row_json);
            _global.top.popusStaManager('editNVRWire');

        });
    }
    function _addAkeyTableRow(row_json, i) {
        var $div_row = $("<tr></tr>");
        var $div_devId = $("<td></td>");
        var $div_devName = $("<td></td>");
        var $div_pnlActID = $("<td></td>");
        var $div_areaId = $("<td></td>");
        var $div_akeyServer=$("<td></td>");
        var $div_PORT=$("<td></td>");
        var $div_manufacturer=$("<td></td>");
        var $div_devType = $("<td></td>");
        var $div_devModelId = $("<td></td>");
        var $div_platformName = $("<td></td>");
        var $div_devLng = $("<td></td>");
        var $div_devlat = $("<td></td>");
        var $div_pnlAddr = $("<td></td>");
        var $div_instMan = $("<td></td>");
        var $div_instUnit = $("<td></td>");
        var $div_devInstDate = $("<td></td>");
        var $div_devSn = $("<td></td>");
        var $div_communicateLine = $("<td></td>");
        var $div_communicateProtocol = $("<td></td>");
        var $div_fMemo = $("<td></td>");
        $div_row
            .append($div_devId)
            .append($div_devName)
            .append($div_pnlActID)
            .append($div_areaId)
            .append($div_akeyServer)
            .append($div_PORT)
            .append($div_manufacturer)
            .append($div_devType)
            .append($div_devModelId)
            .append($div_platformName)
            .append($div_devLng)
            .append($div_devlat)
            .append($div_pnlAddr)
            .append($div_instMan)
            .append($div_instUnit)
            .append($div_devInstDate)
            .append($div_devSn)
            .append($div_communicateLine)
            .append($div_communicateProtocol)
            .append($div_fMemo)
            .addClass('row row_noChecked table_row')
            .attr('id', row_json.userId);
        $div_devId.addClass('table_item_4').text(row_json.devId).attr("title", row_json.devId);
        $div_devName.addClass('table_item_4').text(row_json.devName).attr("title", row_json.devName);
        $div_pnlActID.addClass('table_item_4').text(row_json.pnlActID).attr("title", row_json.pnlActID);
        $div_areaId.addClass('table_item_4').text(row_json.areaName).attr("title", row_json.areaName);
        $div_akeyServer.addClass('table_item_4').text(row_json.Ip).attr("title", row_json.Ip);
        $div_PORT.addClass('table_item_4').text(row_json.PORT).attr("title", row_json.PORT);
        $div_manufacturer.addClass('table_item_4').text(getManufacturer(row_json.manufacturer)).attr("title", getManufacturer(row_json.manufacturer));
        $div_devType.addClass('table_item_4').text(row_json.devTypeName).attr("title", row_json.devTypeName);
        $div_devModelId.addClass('table_item_4').text(row_json.devModelName).attr("title", row_json.devModelName);
        $div_platformName.addClass('table_item_5').text(row_json.platformName).attr("title", row_json.platformName);
        $div_devLng.addClass('table_item_5').text(row_json.devLng).attr("title", row_json.devLng);
        $div_devlat.addClass('table_item_4').text(row_json.devlat).attr("title", row_json.devlat);
        $div_pnlAddr.addClass('table_item_4').text(row_json.pnlAddr).attr("title", row_json.pnlAddr);
        $div_instMan.addClass('table_item_4').text(row_json.instMan).attr("title", row_json.instMan);
        $div_instUnit.addClass('table_item_4').text(row_json.instUnit).attr("title", row_json.instUnit);
        $div_devInstDate.addClass('table_item_4').text(row_json.devInstDate).attr("title", row_json.devInstDate);
        $div_devSn.addClass('table_item_4').text(row_json.devSn).attr("title", row_json.devSn);
        $div_communicateLine.addClass('table_item_5').text(row_json.communicateLineName).attr("title", row_json.communicateLineName);
        $div_communicateProtocol.addClass('table_item_4').text(row_json.communicateProtocolName).attr("title", row_json.communicateProtocolName);
        $div_fMemo.addClass('table_item_4').text(row_json.fMemo).attr("title", row_json.fMemo);
        //$("#table_content").append($div_row);
        $("#AKey_tab_table").append($div_row);
        $div_row.bind('dblclick', function (e) {
            _global.top.setPopupsRowJson(row_json);
            _global.top.popusStaManager('editAKey');
        });
    }
    function getManufacturer(manufacturer) {
        switch (manufacturer){
            case "HIK":
                return "海康";
                break;
            case "DH":
                return "大华";
                break;
            case "P2P_TUTK_CLIENT":
                return "远望";
                break;
            case "P2P_NPC":
                return "华科";
                break;
            case "OTHER":
                return "其他";
                break;
            default:
                return manufacturer;
                break;
        }
    }

    function _getAlarmInfosParams() {
        var params = {};
        params.queryTond = {};
        params.pageInfoPojo = {};
        params.queryTond = _global.getAlarmInfosParams.queryTond;
        params.pageInfoPojo.currentPage = _global.getAlarmInfosParams.pageInfoPojo.currentPage;
        params.pageInfoPojo.sort = sortVal();
        params.pageInfoPojo.pageSize = _global.getAlarmInfosParams.pageInfoPojo.pageSize;
        return params;
    }

    function _getAlarmInfos(queryTond, pageInfoPojo) {
        _global.getAlarmInfosParams.pageInfoPojo = pageInfoPojo;
        _global.getAlarmInfosParams.queryTond = queryTond;
        _global.getAlarmInfosParams.pageInfoPojo.currentPage = 1;
        _global.getAlarmInfosParams.pageInfoPojo.pageSize = 25;
        _globalH.getAlarmInfosParams=_global.getAlarmInfosParams;
        $('body').loading();
        var params = _getAlarmInfosParams();
        if(_global.dataType =="alarm"){
            post_async(params, _config.ajaxUrl.getCphEquipmentDataUrl, _callback_getAlarmInfos);
        }
        if(_global.dataType == "nvrOnline"){
            post_async(params, _config.ajaxUrl.getNvrOnlineUrl, _callback_getAlarmInfos);
        }
        if(_global.dataType == "nvrInternet"){
            post_async(params, _config.ajaxUrl.getNvrInternetUrl, _callback_getAlarmInfos);
        }
        if(_global.dataType == "AKey_tab"){
            var param = params.queryTond;
            param.isowner = $("#devNone").val();
            param.pageInfoPojo = params.pageInfoPojo;
            post_async(param, _config.ajaxUrl.getAKeyframeUrl, _callback_getAlarmInfos);
        }
    }
    function _getAlarmInfosH() {
        _global.getAlarmInfosParams=_globalH.getAlarmInfosParams;
        $('body').loading();
        var params = _getAlarmInfosParams();
        if(_global.dataType =="alarm"){
            post_async(params, _config.ajaxUrl.getCphEquipmentDataUrl, _callback_getAlarmInfos);
        }
        if(_global.dataType == "nvrOnline"){
            post_async(params, _config.ajaxUrl.getNvrOnlineUrl, _callback_getAlarmInfos);
        }
        if(_global.dataType == "nvrInternet"){
            post_async(params, _config.ajaxUrl.getNvrInternetUrl, _callback_getAlarmInfos);
        }
        if(_global.dataType == "AKey_tab"){
            var param = params.queryTond;
            param.isowner = $("#devNone").val();
            param.pageInfoPojo = params.pageInfoPojo;
            post_async(param, _config.ajaxUrl.getAKeyframeUrl, _callback_getAlarmInfos);
        }
    }

    /************************************************
     获取设备型号下拉数据222
     ************************************************/
    function getdevType_callback(data){

        var $option = $("<option></option>");
        for (var i = 0;i<data.length;i++){
            var $option = $("<option></option>");
            $option.attr('value',data[i].devModelId);
            $option.text(data[i].devModelName);
            $option.appendTo($("#devType"));
        }

        $('#devType').searchableSelect();
    }
    function _callback_getAlarmInfos(data) {
        var result = data.result;
        $('body').removeLoading();
        if (result.code == 0) {
            var pageInfo = data.pageInfoPojo;
            var totalNum = pageInfo.totalNum;
            var totalPage = pageInfo.totalPage;
            var currentPage = pageInfo.currentPage;
            _global.getAlarmInfosParams.pageInfoPojo.currentPage = currentPage;
            _global.getAlarmInfosParams.pageInfoPojo.totalNum = totalNum;
            _global.getAlarmInfosParams.pageInfoPojo.totalPage = totalPage;
            if(totalNum==0)totalNum=-1;
            _global.plugins.page.setPage(totalPage, currentPage, totalNum);
            var json = data.json;
            if(_global.dataType == "alarm"){
                $('#alarmHost').data('totalPag',totalPage);
                $('#alarmHost').data('currentPage',currentPage);
                $('#alarmHost').data('totalNum',totalNum);
                $('#alarmHost').data('flag',1);
                _clearContent("table_content");
            	for (var i = 0; i < json.length; i++) {
                    addTableRow(json[i]);
                }
            }
            if(_global.dataType == "nvrOnline"){
                $('#wireNvr').data('totalPag',totalPage);
                $('#wireNvr').data('currentPage',currentPage);
                $('#wireNvr').data('totalNum',totalNum);
                $('#wireNvr').data('flag',1);
                _clearContent("table_content_line");
            	for (var i = 0; i < json.length; i++) {
            		addNvrTableRow(json[i]);
                }
            }
            if(_global.dataType == "nvrInternet"){
                $('#internetNvr').data('totalPag',totalPage);
                $('#internetNvr').data('currentPage',currentPage);
                $('#internetNvr').data('totalNum',totalNum);
                $('#internetNvr').data('flag',1);
                _clearContent("table_content_internet");
            	for (var i = 0; i < json.length; i++) {
            		addNVRTableRow(json[i]);
                }
            }
            if(_global.dataType == "AKey_tab"){
                $('#AKey_tab').data('totalPag',totalPage);
                $('#AKey_tab').data('currentPage',currentPage);
                $('#AKey_tab').data('totalNum',totalNum);
                $('#AKey_tab').data('flag',1);
                _clearContent("AKey_tab_table");
                for (var i = 0; i < json.length; i++) {
                    _addAkeyTableRow(json[i]);
                }
            }
        } else {
            _clearRow();
        }
    }

    function _clearRow() {
        $(".table_row").each(function () {
            var $this = $(this);
                $this.remove();
        });
    }
    function _clearContent(id){
        $('#' + id).html('');
    }

    function _queryData_page(page, num, total) {
        _global.getAlarmInfosParams.pageInfoPojo.currentPage = page;
        /*setCurrentPage=page;*/
        var setCurrentPage = $(this).data("setCurrentPage",page);
        $('body').loading();
        var params = _getAlarmInfosParams();
        if(_global.dataType =="alarm"){
        	post_async(params, _config.ajaxUrl.getCphEquipmentDataUrl, _callback_getAlarmInfos);
        }
        if(_global.dataType == "nvrOnline"){
        	post_async(params, _config.ajaxUrl.getNvrOnlineUrl, _callback_getAlarmInfos);
        }
        if(_global.dataType == "nvrInternet"){
        	post_async(params, _config.ajaxUrl.getNvrInternetUrl, _callback_getAlarmInfos);
        }
        if(_global.dataType == "AKey_tab"){
            var param = params.queryTond;
            param.isowner = $("#devNone").val();
            param.pageInfoPojo = params.pageInfoPojo;
            post_async(param, _config.ajaxUrl.getAKeyframeUrl, _callback_getAlarmInfos);
        }

    }

    function _getPageInfo() {
        return _global.getAlarmInfosParams.pageInfoPojo;
    }

    function _setPageInfo(pageInfoPojo) {
        _global.getAlarmInfosParams.pageInfoPojo.currentPage = pageInfoPojo.currentPage;
        _global.getAlarmInfosParams.pageInfoPojo.totalNum = pageInfoPojo.totalNum;
        _global.getAlarmInfosParams.pageInfoPojo.totalPage = pageInfoPojo.totalPage;
        _global.getAlarmInfosParams.pageInfoPojo.pageSize = pageInfoPojo.pageSize;
        _global.plugins.page.setPage(pageInfoPojo.totalPage, pageInfoPojo.currentPage, pageInfoPojo.totalNum);
    }
    function changeManufacturer(manuKey){
        switch(manuKey){
            case "HIK":
                return "海康";
                break;
            case "DH":
                return "大华";
                break;
            case "P2P_TUTK_CLIENT":
                return "远望";
                break;
            case "P2P_NPC":
                return "华科";
                break;
            case "OTHER":
                return "其他";
                break;
            default:
                return manuKey;
                break;
        }
    }

})(jQuery, window);