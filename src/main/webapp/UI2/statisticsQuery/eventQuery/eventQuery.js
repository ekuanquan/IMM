/**
 * Created by ly on 2016/10/9.
 */
charset = "utf-8";
$(document).ready(function () {
    init();
});

;(function ($, window) {
    window.resizeDocment = _resizeDocment;//修改页面大小
    window.init = _init;//修改页面大小
    window.appendRow = addTableRow;
    window.appendRow = addTableRow;
    window.getAlarmInfos = _getAlarmInfos;
    window.queryData_page = _queryData_page;
    window.getPageInfo = _getPageInfo;
    window.setPageInfo = _setPageInfo;
    window.searchEventInfo = _searchEventInfo;
    var _config = {
        minWidth: 3601,
        minHeight: 765,
        ajaxUrl: {
            getEventInfosUrl: '/IntegratedMM/query/eventQuery.do'
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
            alertPojo: {
                sysuserID: '',
                eventNum:'',
                eventTime: '',
                eventType: ''
            },
            pageInfoPojo: {
                currentPage: '1',
                sort: 'receiveTime|ASC',
                pageSize: '25',
                totalNum: '',
                totalPage: ''
            }
        },
        eventTypeSearch:'1',
        eventTypeJson:null,
        eventTypePush:null,
        history_eventsDesc:''
    };
    var _globalH = {
        getAlarmInfosParams: {
            alertPojo: {
                sysuserID: '',
                eventNum:'',
                eventTime: '',
                eventType: ''
            },
            pageInfoPojo: {
                currentPage: '1',
                sort: 'receiveTime|ASC',
                pageSize: '25',
                totalNum: '',
                totalPage: ''
            }
        }
    };


//重绘布局
    function _resizeDocment() {
    }

    function _init() {
        _initData();
        _initEven();
    }

    var eventTypeJson = [
        {eventTypeId : "-1",eventTypeName : "其他"},
        {eventTypeId : "0",eventTypeName : "火警"},
        {eventTypeId : "1",eventTypeName : "劫盗"},
        {eventTypeId : "2",eventTypeName : "有声劫盗"},
        {eventTypeId : "3",eventTypeName : "无声劫盗"},
        {eventTypeId : "4",eventTypeName : "挟持"},
        {eventTypeId : "5",eventTypeName : "周边防范"},
        {eventTypeId : "6",eventTypeName : "窃盗"},
        {eventTypeId : "7",eventTypeName : "出入防区"},
        {eventTypeId : "8",eventTypeName : "一般报警"},
        {eventTypeId : "9",eventTypeName : "拆动"},
        {eventTypeId : "10",eventTypeName : "无交流"},
        {eventTypeId : "11",eventTypeName : "系统电池电压过低"},
        {eventTypeId : "12",eventTypeName : "电池测试故障"},
        {eventTypeId : "13",eventTypeName : "扩充器故障"},
        {eventTypeId : "14",eventTypeName : "警铃1"},
        {eventTypeId : "15",eventTypeName : "警铃1恢复"},
        {eventTypeId : "16",eventTypeName : "警铃2"},
        {eventTypeId : "17",eventTypeName : "警铃2恢复"},
        {eventTypeId : "18",eventTypeName : "通讯失败"},
        {eventTypeId : "19",eventTypeName : "电话线1故障"},
        {eventTypeId : "20",eventTypeName : "电话线1故障恢复"},
        {eventTypeId : "21",eventTypeName : "电话线2故障"},
        {eventTypeId : "22",eventTypeName : "电话线2故障恢复"},
        {eventTypeId : "23",eventTypeName : "感应器故障"},
        {eventTypeId : "24",eventTypeName : "无线感应故障"},
        {eventTypeId : "25",eventTypeName : "无线感应器电池过低"},
        {eventTypeId : "26",eventTypeName : "超测"},
        {eventTypeId : "27",eventTypeName : "一类警情"},
        {eventTypeId : "28",eventTypeName : "二类警情"},
        {eventTypeId : "29",eventTypeName : "一类故障"},
        {eventTypeId : "30",eventTypeName : "二类故障"}
    ];

    function _initData() {
        var nowTime = getNowFormatDate();
        //var startTime = getBeforeFormatDate();
        var startTime = getBeforeHalfYearFormatDate();
        nowTime =nowTime.split(" ")[0]+" 23:59:59";
        startTime =startTime.split(" ")[0]+" 00:00:00";
        $("#startTime").val(startTime);
        $('#startTime').click(function () {
            WdatePicker({
                maxDate: '#F{$dp.$D(\'endTime\')}',
                dateFmt: 'yyyy-MM-dd HH:mm:ss',
                isShowClear: false
            });
            this.blur();
        });
        $("#endTime").val(nowTime);
        $('#endTime').click(function () {
            WdatePicker({
                minDate: '#F{$dp.$D(\'startTime\')}',
                dateFmt: 'yyyy-MM-dd HH:mm:ss',
                isShowClear: false
            });
            this.blur();
        });

        $("#timeorder").click(function(){
            $("#timePng").toggleClass("timePngchange");
            _getAlarmInfosH();
        });

        _getEveType();
        $('#codeTypeId').bind('change',function (e) {
            changeCodeType();
        })
        _global.eventTypeJson = eventTypeJson;


    }

    function _initEven() {

        document.oncontextmenu = function () {
            return false;
        }
        _global.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: _queryData_page,
            cssPath:'../../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
        });
        _switchFiltrate();

        $("#search_text").keydown(function(event){
            if(event.keyCode == 13){ //绑定回车
                _searchEventInfo();
            }
        });
        $("#search_img,#policeCheck").bind('click',function () {
            _searchEventInfo();
        });
        $("#policeCheck").click();
    }

    function _searchEventInfo() {
        _global.getAlarmInfosParams.alertPojo.sysuserID = _global.top.getLoginUserName().sysuserID;//_global.top.getSysuserID();
        var alertPojo = {};
        alertPojo.sysuserID = _global.getAlarmInfosParams.alertPojo.sysuserID;

        var scarch = $("#fuzzy").val();
        if(scarch==("all")){
            alertPojo.all =$("#search_text").val();
            alertPojo.eventNum = '';
                alertPojo.accountNum = '';
                alertPojo.accountName = '';
            alertPojo.cMobile = '';
        }else if(scarch==("eventNum")){
            alertPojo.all ='';
            alertPojo.eventNum = $("#search_text").val();
            alertPojo.accountNum = '';
            alertPojo.accountName = '';
            alertPojo.cMobile = '';
        }else if(scarch==("accountNum")){
            alertPojo.all ='';
            alertPojo.eventNum = '';
            alertPojo.accountNum = $("#search_text").val();
            alertPojo.accountName = '';
            alertPojo.cMobile = '';
        }else if(scarch==("accountName")){
            alertPojo.all ='';
            alertPojo.eventNum = '';
            alertPojo.accountNum = '';
            alertPojo.accountName = $("#search_text").val();
            alertPojo.cMobile = '';
        }
        else if(scarch==("cphone")){
            alertPojo.all ='';
            alertPojo.eventNum = '';
            alertPojo.accountNum = '';
            alertPojo.accountName = '';
            alertPojo.cMobile = $("#search_text").val();
        }
        if($("#eventDesc option:selected").text()=="全部"){
            alertPojo.eventDesc ="";
        }else {
            alertPojo.codeId = $("#eventDesc option:selected").val();//$("#eventDesc option:selected").text();
        }
        alertPojo.codeTypeId = $("#codeTypeId").val();

        var time = $("#startTime").val()+";"+$("#endTime").val();
        alertPojo.eventTime = time.replace(" ","T")
        alertPojo.eventTime = alertPojo.eventTime.replace(" ","T")

        _getAlarmInfos(alertPojo);  //初始化请求未处理事件
    }

    function _switchFiltrate(){
        $('.filtrate').bind('click', function() {
            $(this).siblings().children('.Checked_img').removeClass('isChecked_search').addClass('noChecked_search');
            $(this).children('.Checked_img').removeClass('noChecked_search').addClass('isChecked_search');
            _swichEventType($(this).attr('id'));
    });

    }

    function _swichEventType(eventType) {
        switch (eventType){
            case 'dayEvent':
                _global.eventTypeSearch = '1';
                _global.getAlarmInfosParams.alertPojo.eventType = '31';

                break;
            case 'dayAlarmEvent':
                _global.eventTypeSearch = '2';
                _global.getAlarmInfosParams.alertPojo.eventType = '32';
                break;
            case 'monthFault':
                _global.eventTypeSearch = '3';
                _global.getAlarmInfosParams.alertPojo.eventType = '33';
                break;
            case 'monthEvent':
                _global.eventTypeSearch = '4';
                _global.getAlarmInfosParams.alertPojo.eventType = '31';
                break;
            default:
                break;

        }
        _searchEventInfo();
    }

    function addTableRow(jsonData, isPre) {
        var row_json = _messageExchange(jsonData);//转换原始数据与显示的数据
        $div_row = $("<tr></tr>");
        $div_state = $("<td></td>");
        $div_date = $("<td></td>");
        $div_time = $("<td></td>");
        $div_systemCode = $("<td></td>");
        $div_userCode = $("<td></td>");
        $div_userName = $("<td></td>");
        $div_usrAlmType = $("<td></td>");
        $div_userAddress = $("<td></td>");
        $div_eventType = $("<td></td>");
        $div_eventDescribe = $("<td></td>");
        $div_deviceZone = $("<td></td>");
        $div_userZone = $("<td></td>");
        $div_zoneLocation = $("<td></td>");
        $div_probeType = $("<td></td>");
        $div_callerID = $("<td></td>");
        $div_eventSource = $("<td></td>");
        $div_deviceId = $("<td></td>");
        $div_deviceModel = $("<td></td>");
        $div_pliceInfoType = $("<td></td>");
        $div_reactivityType = $("<td></td>");
        $div_callerException = $("<td></td>");
        $div_eventNum = $("<td></td>");
        /* $div_zoneNum = $("<td></td>");*/
        $div_zoneName = $("<td></td>");
        $div_deviceSubSystem = $("<td></td>");
        $div_probeModel = $("<td></td>");
        /*$div_policeLevel = $("<td></td>");*/
        $div_cameraName = $("<td></td>");
        $div_userMonitorId = $("<td></td>");
        $div_cameraModelId = $("<td></td>");
        $div_atPos = $("<td></td>");

        $div_row
            .append($div_state)
            .append($div_date)
            .append($div_time)
            .append($div_userCode)
            .append($div_userName)
            .append($div_deviceId)
            .append($div_userZone)
            .append($div_eventDescribe)
            .append($div_eventSource)
            .append($div_systemCode)

            .append($div_usrAlmType)
            .append($div_eventNum)
            .append($div_userAddress)
            .append($div_eventType)

            .append($div_deviceZone)

            .append($div_zoneLocation)
            .append($div_probeType)
            .append($div_probeModel)




            .append($div_deviceModel)
            .append($div_pliceInfoType)
            .append($div_reactivityType)
            .append($div_callerException)
            .append($div_callerID)
            /* .append($div_zoneNum)*/
            .append($div_zoneName)
            .append($div_deviceSubSystem)
            /*.append($div_policeLevel)*/
            .append($div_cameraName)
            .append($div_userMonitorId)
            .append($div_cameraModelId)
            .append($div_atPos)
            .addClass('table_row')
            .attr('id', jsonData.eventNum);

        $div_state.addClass("table_content_state").text(row_json.state).attr("title", row_json.state).attr("id", "state_" + row_json.eventNum);
        $div_date.addClass("table_item_2").text(row_json.date).attr("title", row_json.date);
        $div_time.addClass("table_item_2").text(row_json.time).attr("title", row_json.time);
        $div_systemCode.addClass("table_item_3").text(row_json.systemCode).attr("title", row_json.systemCode);
        $div_userCode.addClass("table_item_4").text(row_json.userCode).attr("title", row_json.userCode);
        $div_userName.addClass("table_item_userName").text(row_json.userName).attr("title", row_json.userName);
        $div_usrAlmType.addClass("table_item_userName").text(getUsrAlmType(row_json.usrAlmType)).attr("title", getUsrAlmType(row_json.usrAlmType));
        $div_userAddress.addClass("table_item_userName").text(row_json.userAddress).attr("title", row_json.userAddress);
        $div_eventType.addClass("table_item_4").text(row_json.eventType).attr("title", row_json.eventType);
        $div_eventDescribe.addClass("table_item_4").text(row_json.eventDescribe).attr("title", row_json.eventDescribe);
        $div_deviceZone.addClass("deviceZone_title").text(row_json.deviceZone).attr("title", row_json.deviceZone);
        $div_userZone.addClass("userZone_title").text(row_json.userZone).attr("title", row_json.userZone);
        $div_zoneLocation.addClass("table_item_4").text(row_json.zoneLocation).attr("title", row_json.zoneLocation);
        $div_probeType.addClass("table_item_4").text(row_json.probeType).attr("title", row_json.probeType);
        $div_callerID.addClass("table_item_4").text(row_json.callerID).attr("title", row_json.callerID);
        $div_eventSource.addClass("table_item_4").text(row_json.eventSource).attr("title", row_json.eventSource);
        //设备编号
        $div_deviceId.addClass("table_item_4").text(row_json.deviceId).attr("title", row_json.deviceId);
        $div_deviceModel.addClass("table_item_zoneNum").text(row_json.deviceModel).attr("title", row_json.deviceModel);
        $div_pliceInfoType.addClass("table_item_4").text(row_json.pliceInfoType).attr("title", row_json.pliceInfoType);
        $div_reactivityType.addClass("table_item_4").text(row_json.reactivityType).attr("title", row_json.reactivityType);
        $div_callerException.addClass("table_item_4").text(row_json.callerException).attr("title", row_json.callerException);
        $div_eventNum.addClass("table_item_long").text(row_json.eventNum).attr("title", row_json.eventNum);
        /* $div_zoneNum.addClass("table_item_zoneNum").text(row_json.zoneNum).attr("title", row_json.zoneNum);*/
        $div_zoneName.addClass("table_item_4").text(row_json.zoneName).attr("title", row_json.zoneName);
        $div_deviceSubSystem.addClass("table_item_5").text(row_json.deviceSubSystem).attr("title", row_json.deviceSubSystem);
        $div_probeModel.addClass("table_item_4").text(row_json.probeModel).attr("title", row_json.probeModel);
        /*  $div_policeLevel.addClass("table_item_4").text("").attr("title", "");*/
        $div_cameraName.addClass("table_item_5").text(row_json.cameraName).attr("title", row_json.cameraName);
        $div_userMonitorId.addClass("table_item_5").text(row_json.userMonitorId).attr("title", row_json.userMonitorId);
        $div_cameraModelId.addClass("table_item_5").text(row_json.cameraModelId).attr("title", row_json.cameraModelId);
        $div_atPos.addClass("table_item_5").text(row_json.atPos).attr("title", row_json.atPos);


        if (isPre) {
            $div_row.prependTo($("#table_content"));
        } else {
            $div_row.appendTo($("#table_content"));
        }
        $div_row.bind('dblclick', function (e) {
            parent.parent.setPopupsRowJson(row_json);
            _global.top.popusStaManager( 'eventQuery');

        });

    }

    function getUsrAlmType(usrAlmType){
        switch (usrAlmType) {
            case '0':
                return "一级";
                break;
            case '1':
                return "二级";
                break;
            case '2':
                return "三级";
                break;
            case '3':
                return "四级";
                break;
            case '4':
                return "五级";
                break;
            default:
                break;
        }
    }
    function _messageExchange(dataJson) {
        var row_json =
        {
            state: "",
            date: "",
            time: "",
            systemCode: "",
            datetime:"",
            userCode: "",
            userName: "",
            usrAlmType: "",
            userAddress: "",
            eventType: "",
            eventDescribe: "",
            deviceZone: "",
            userZone: "",
            zoneLocation: "",
            probeType: "",
            callerID: "",
            eventSource: "",
            deviceId: "",
            deviceModel: "",
            pliceInfoType: "",
            reactivityType: "",
            callerException: "",
            eventNum: "",
            zoneNum: "",
            zoneName: "",
            deviceSubSystem: "",
            probeModel: "",
            cameraName:"",
            userMonitorId:"",
            cameraModelId:"",
            atPos:"",
            accountZone:""
        };
        switch (dataJson.disposeStatus) {
            case '0':
                row_json.state = '未处理';
                break;
            case '1':
                row_json.state = '已处理';
                break;
            case '2':
                row_json.state = '预处理';
                break;
            default:
                row_json.state = '';
                break;
        }
        ;
        var eventTime = dataJson.eventTime;
        var datetime = dataJson.eventTime.replace("T"," ");
        var time = ['', ''];
        time = eventTime.split("T");
        row_json.datetime = datetime;
        row_json.date = time[0];
        row_json.time = time[1];
        row_json.systemCode = dataJson.sysCode;
        row_json.userCode = dataJson.accountNum;
        row_json.userName = dataJson.accountName;
        row_json.usrAlmType = dataJson.usrAlmType;
        row_json.userAddress = dataJson.accountAddr;
        row_json.eventType = dataJson.codeType;
        row_json.eventDescribe = dataJson.eventDesc;
        row_json.deviceZone = dataJson.devZoneId;
        row_json.userZone = dataJson.accountZone;
        row_json.accountZone = dataJson.accountZone;
        row_json.zoneLocation = dataJson.zoneAtPos;
        row_json.probeType = dataJson.snType;
        row_json.callerID = dataJson.callID;
        row_json.eventSource = dataJson.eventSrc;
        row_json.deviceId = dataJson.devId;
        row_json.deviceModel = dataJson.devModelName;
        row_json.pliceInfoType = dataJson.almType;
        row_json.reactivityType = dataJson.wantDo;
        row_json.callerException = dataJson.isCallAbnor;
        row_json.eventNum = dataJson.eventNum;
        row_json.zoneNum = dataJson.areaId;
        row_json.zoneName = dataJson.areaName;
        row_json.deviceSubSystem = dataJson.devSubSys;
        row_json.probeModel = dataJson.snModelName;
        row_json.cameraName = dataJson.cameraName;
        row_json.userMonitorId = dataJson.userMonitorId;
        row_json.cameraModelId = dataJson.cameraModelId;
        row_json.atPos = dataJson.atPos;
        return row_json;

    }

    function _getAlarmInfosParams() {

        var params = {};
        params.alertPojo = {};
        params.pageInfoPojo = {};
        params.alertPojo = _global.getAlarmInfosParams.alertPojo;
        params.pageInfoPojo.currentPage = _global.getAlarmInfosParams.pageInfoPojo.currentPage;
        params.pageInfoPojo.sort =sortVal();
        params.pageInfoPojo.pageSize = _global.getAlarmInfosParams.pageInfoPojo.pageSize;
        return params;
    }

    /*修改升降序*/
    function sortVal() {
        var sort="";
        if($("#timePng").hasClass('timePngchange')){
            sort="eventTime|DESC";
        }
        else{
            sort="eventTime|ASC";
        }
        return sort;
    }

    function _getAlarmInfos(alertPojo) {
        _global.getAlarmInfosParams.alertPojo = alertPojo;
        _global.getAlarmInfosParams.pageInfoPojo.currentPage = 1;
        _globalH.getAlarmInfosParams=_global.getAlarmInfosParams;
        $('body').loading();
        var param = _getAlarmInfosParams();
        var params = {
            "sysuserID": param.alertPojo.sysuserID,
            "all": param.alertPojo.all,
            "eventNum": param.alertPojo.eventNum,
            "accountNum": param.alertPojo.accountNum,
            "accountName":param.alertPojo.accountName,
            "codeTypeId": param.alertPojo.codeTypeId,
            "codeId": param.alertPojo.codeId,
            "eventTime": param.alertPojo.eventTime,
            "pageInfoPojo": {
                "currentPage": param.pageInfoPojo.currentPage,
                "sort": param.pageInfoPojo.sort,
                "pageSize": param.pageInfoPojo.pageSize}
        }

        post_async(params, _config.ajaxUrl.getEventInfosUrl, _callback_getAlarmInfos);
    }
    function _getAlarmInfosH() {
        _global.getAlarmInfosParams=_globalH.getAlarmInfosParams;
        $('body').loading();
        var param = _getAlarmInfosParams();
        var params = {
            "sysuserID": param.alertPojo.sysuserID,
            "all": param.alertPojo.all,
            "eventNum": param.alertPojo.eventNum,
            "accountNum": param.alertPojo.accountNum,
            "accountName":param.alertPojo.accountName,
            "codeTypeId": param.alertPojo.codeTypeId,
            "codeId": param.alertPojo.codeId,
            "eventTime": param.alertPojo.eventTime,
            "pageInfoPojo": {
                "currentPage": param.pageInfoPojo.currentPage,
                "sort": param.pageInfoPojo.sort,
                "pageSize": param.pageInfoPojo.pageSize}
        }

        post_async(params, _config.ajaxUrl.getEventInfosUrl, _callback_getAlarmInfos);
    }

    function _callback_getAlarmInfos(data) {
        var result = data.result;
        $('body').removeLoading();
        if (result.code == 0) {
            var pageInfo = data.pageInfo;
            var totalNum = pageInfo.totalNum;
            var totalPage = pageInfo.totalPage;
            var currentPage = pageInfo.currentPage;
            _global.getAlarmInfosParams.pageInfoPojo.currentPage = currentPage;
            _global.getAlarmInfosParams.pageInfoPojo.totalNum = totalNum;
            _global.getAlarmInfosParams.pageInfoPojo.totalPage = totalPage;
            //var pluginsPage = parent.pluginsPage();
            if(totalNum==0)totalNum=-1;
            _global.plugins.page.setPage(totalPage, currentPage, totalNum)
            //pluginsPage.setPage(totalPage, currentPage, totalNum);
            _clearRow();
            var alertPojo = data.alertPojo;
            for (var i = 0; i < alertPojo.length; i++) {
                addTableRow(alertPojo[i]);
            }

        } else {
            _clearRow();
        }
    }

    function _clearRow() {
      $("#table_content").text('');
    }

    function _queryData_page(page) {
        _global.getAlarmInfosParams.pageInfoPojo.currentPage = page;
        $('body').loading();
        var param = _getAlarmInfosParams();

        var params = {
            "sysuserID": param.alertPojo.sysuserID,
            "all": param.alertPojo.all,
            "eventNum": param.alertPojo.eventNum,
            "accountNum": param.alertPojo.accountNum,
            "accountName":param.alertPojo.accountName,
            "codeTypeId": param.alertPojo.codeTypeId,
            "codeId": param.alertPojo.codeId,
            "eventTime": param.alertPojo.eventTime,
            "pageInfoPojo": {
                "currentPage": param.pageInfoPojo.currentPage,
                "sort": param.pageInfoPojo.sort,
                "pageSize": param.pageInfoPojo.pageSize}
        }
        post_async(params, _config.ajaxUrl.getEventInfosUrl, _callback_getAlarmInfos);
    }

    function _getPageInfo(){
        return _global.getAlarmInfosParams.pageInfoPojo;
    }
    function _setPageInfo(pageInfoPojo){
        _global.getAlarmInfosParams.pageInfoPojo.currentPage =  pageInfoPojo.currentPage;
        _global.getAlarmInfosParams.pageInfoPojo.totalNum = pageInfoPojo.totalNum;
        _global.getAlarmInfosParams.pageInfoPojo.totalPage = pageInfoPojo.totalPage;
        _global.getAlarmInfosParams.pageInfoPojo.pageSize = pageInfoPojo.pageSize;
        _global.plugins.page.setPage(pageInfoPojo.totalPage, pageInfoPojo.currentPage, pageInfoPojo.totalNum);
    }

    /************************************************
     历史事件的事件类型下拉切换选择时，重新加载对应的事件描述
     ************************************************/
    function changeCodeType() {
        var selectId = $("#codeTypeId option:selected").val();
        $("#eventDesc").html("");
        if (selectId == "") {
            $('#eventDesc').attr("disabled", true);
        } else {
            $('#eventDesc').removeAttr("disabled");
            getEventDesc(selectId);
        }
    }
    /************************************************
     历史事件的事件描述查询
     ************************************************/
    function getEventDesc(codeTypeId) {
        post_async(
            {"codeTypeId": codeTypeId},
            "/IntegratedMM/query/getCodeMemo.do",
            getCodeMemo_callback);
    } 
    /************************************************
     历史事件的事件描述查询回调函数
     ************************************************/
    function getCodeMemo_callback(data) {
        var $option = $("<option></option>");
        $option.attr('value', "");
        $option.text("全部");
        $option.appendTo($("#eventDesc"));
        for (var i = 0; i < data.codeMemo.length; i++) {
            var $option = $("<option></option>");
            $option.attr('value', data.codeMemo[i].codeId);
            $option.text(data.codeMemo[i].codeMemo);
            $option.appendTo($("#eventDesc"));
        }
        $("#eventDesc option").each(function (i, n) {
            if ($(n).text() == _global.history_eventsDesc) {
                $(n).attr("selected", true);
            }
        })
    }
    function _getEveType(){
        post_async(null, "/IntegratedMM/eveType.do", _showEveType);
    }

    function _showEveType(data){
        for(var i =0;i<data.EveTypeList.length;i++){
            $("#codeTypeId").append("<option value='"+data.EveTypeList[i].codeTypeId+"'>"+data.EveTypeList[i].codeType+"</option>");
        }
    }


})(jQuery, window);

