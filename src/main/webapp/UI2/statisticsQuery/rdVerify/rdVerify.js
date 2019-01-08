/**
 * Created by ly on 2016/10/9.
 */
charset = "utf-8";
$(document).ready(function () {
    //重绘一次布局，然后再设置页面的resize事件
    resizeDocment();        //重绘函数
    $(window).resize(function () {
        resizeDocment();    //重绘函数
    });
    init();
});

;(function ($, window) {
    window.resizeDocment = _resizeDocment;//修改页面大小
    window.init = _init;//修改页面大小
    window.appendRow = addTableRow;
    window.removeRow = _removeRow;
    window.switchPoliceType = _switchPoliceType;
    window.appendRow = addTableRow;
    window.getAlarmInfos = _getAlarmInfos;
    window.queryData_page = _queryData_page;
    window.getPageInfo = _getPageInfo;
    window.setPageInfo = _setPageInfo;
    window.searchEventInfo = _searchEventInfo;
    var _config = {
        minWidth: 4933,
        minHeight: 765,
        module: {
            suspectSRC: '../suspect/suspect_Index.html',
            caseSRC: '../case/case_Index.html',
            clueSRC: '../clue/clue_Index.html'
        },
        win: {
            addCase: '../addNewCase/newCase.html',
            saveTo: '../saveTo/SaveTo.html',
            lookFile: '../videoPlayer/videoPlayer.html',
            upload: '../upload/upload.html'
        },
        ajaxUrl: {
            verifyQuery: '/IntegratedMM/query/verifyQuery.do'
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
            pretreatmentPojo: {
                disposalAlarmNum: '',
                createTime: ''
            },
            pageInfoPojo: {
                currentPage: '1',
                sort: 'createTime|ASC',
                pageSize: '25',
                totalNum: '',
                totalPage: ''
            }
        },
        eventTypeSearch: '',
        eventTypeJson: null,
        eventTypePush: null,
        dataResult:null,
        result:null,
    };
    var _globalH = {
        getAlarmInfosParams: {
            pretreatmentPojo: {
                disposalAlarmNum: '',
                createTime: ''
            },
            pageInfoPojo: {
                currentPage: '1',
                sort: 'createTime|ASC',
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
        {eventTypeId: "-1",eventTypeName : "其他"},
        {eventTypeId: "0", eventTypeName: "火警"},
        {eventTypeId: "1", eventTypeName: "劫盗"},
        {eventTypeId: "2", eventTypeName: "有声劫盗"},
        {eventTypeId: "3", eventTypeName: "无声劫盗"},
        {eventTypeId: "4", eventTypeName: "挟持"},
        {eventTypeId: "5", eventTypeName: "周边防区"},
        {eventTypeId: "6", eventTypeName: "窃盗"},
        {eventTypeId: "7", eventTypeName: "出入防区"},
        {eventTypeId: "8", eventTypeName: "一般报警"},
        {eventTypeId: "9", eventTypeName: "拆动"},
        {eventTypeId: "10", eventTypeName: "无交流"},
        {eventTypeId: "11", eventTypeName: "系统电池电压过低"},
        {eventTypeId: "12", eventTypeName: "电池测试故障"},
        {eventTypeId: "13", eventTypeName: "扩充器故障"},
        {eventTypeId: "14", eventTypeName: "警铃1"},
        {eventTypeId: "15", eventTypeName: "警铃1恢复"},
        {eventTypeId: "16", eventTypeName: "警铃2"},
        {eventTypeId: "17", eventTypeName: "警铃2恢复"},
        {eventTypeId: "18", eventTypeName: "通讯失败"},
        {eventTypeId: "19", eventTypeName: "电话线1故障"},
        {eventTypeId: "20", eventTypeName: "电话线1故障恢复"},
        {eventTypeId: "21", eventTypeName: "电话线2故障"},
        {eventTypeId: "22", eventTypeName: "电话线2故障恢复"},
        {eventTypeId: "23", eventTypeName: "感应器故障"},
        {eventTypeId: "24", eventTypeName: "无线感应故障"},
        {eventTypeId: "25", eventTypeName: "无线感应器电池过低"},
        {eventTypeId: "26", eventTypeName: "超测"},
        {eventTypeId: "27", eventTypeName: "一类警情"},
        {eventTypeId: "28", eventTypeName: "二类警情"},
        {eventTypeId: "29", eventTypeName: "一类故障"},
        {eventTypeId: "30", eventTypeName: "二类故障"}
    ];

    function _initData() {
        _getAlarmReason();
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


        _global.eventTypeJson = eventTypeJson;
        getCodeType();
    }

    function _initEven() {

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
        /*$(".Checked_img").bind('click',function () {
            _searchEventInfo();
        });*/

        $("#timeorder").click(function(){
            $("#timePng").toggleClass("timePngchange");
            _getAlarmInfosH();
        });

        $("#policeCheck").click(function(){
            _searchEventInfo();
        });
        //默认点击查询
        $("#policeCheck").click();
    }

    function _searchEventInfo() {
        var pretreatmentPojo = {};

        pretreatmentPojo.sysuserID = 'E123';

        var time = $("#startTime").val()+";"+$("#endTime").val();
        pretreatmentPojo.acceptAlarmTime = time.replace(" ","T")
        pretreatmentPojo.acceptAlarmTime = pretreatmentPojo.acceptAlarmTime.replace(" ","T")


        var scarch = $("#fuzzy").val();
        if(scarch==("all")){
            pretreatmentPojo.all = $("#search_text").val();
            pretreatmentPojo.verifyNum = '';
            pretreatmentPojo.accountNum = '';
            pretreatmentPojo.accountName = '';
            pretreatmentPojo.cMobile = '';
        }else if(scarch==("verifyNum")){
            pretreatmentPojo.all = '';
            pretreatmentPojo.verifyNum = $("#search_text").val();
            pretreatmentPojo.accountNum = '';
            pretreatmentPojo.accountName = '';
            pretreatmentPojo.cMobile = '';
        }else if(scarch==("accountNum")){
            pretreatmentPojo.all = '';
            pretreatmentPojo.verifyNum = '';
            pretreatmentPojo.accountNum = $("#search_text").val();
            pretreatmentPojo.accountName = '';
            pretreatmentPojo.cMobile = '';
        }else if(scarch==("accountName")){
            pretreatmentPojo.all = '';
            pretreatmentPojo.verifyNum = '';
            pretreatmentPojo.accountNum = '';
            pretreatmentPojo.accountName = $("#search_text").val();
            pretreatmentPojo.cMobile = '';
        }else if(scarch==("cMobile")){
            pretreatmentPojo.all = '';
            pretreatmentPojo.verifyNum = '';
            pretreatmentPojo.accountNum = '';
            pretreatmentPojo.accountName = '';
            pretreatmentPojo.cMobile = $("#search_text").val();
        }
        pretreatmentPojo.createTime = '';

        var createTime = '';
        var nowTime = getNowFormatDate();
        nowTime =nowTime.split(" ")[0]+" 23:59:59";
        switch (_global.eventTypeSearch) {
            //当日单据
            case  '1':
                createTime = getTodayTime();
                break;
            //昨日单据
            case  '2':
                createTime = getYestodayTime();
                break;
            //当月单据
            case  '3':
                createTime = getMonthTime();
                break;
            //全部单据
            case  '':
                createTime = "1970-01-01 00:00:00"+";"+nowTime;
                break;
            default:
                return;
                break;

        }
        createTime = createTime.replace(" ","T");
        createTime = createTime.replace(" ","T");
        pretreatmentPojo.createTime = createTime;
        _getAlarmInfos(pretreatmentPojo);  //初始化请求未处理事件
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
            case 'dayForm':
                _global.eventTypeSearch = '1';
                break;
            case 'yesterdayForm':
                _global.eventTypeSearch = '2';
                break;
            case 'monthForm':
                _global.eventTypeSearch = '3';
                break;
            case 'allForm':
                _global.eventTypeSearch = '';
                break;
            default:
                break;

        }
        _searchEventInfo();
    }



    function _removeRow(eventNum) {

        if ($("#" + eventNum).length > 0) {
            $("#" + eventNum).remove();
            _pageRemove();
        }
        ;
        var sysuserID = _global.top.getSysuserID();
        parent.statisticalt(sysuserID, '0', "", alarmData_callbackfunc);
    }

    function addTableRow(jsonData, isPre) {
        var row_json = _messageExchange(jsonData);//转换原始数据与显示的数据
        $div_row = $("<tr></tr>");


        $div_disposalAlarmNum = $("<td></td>");
        $div_actualSituation = $("<td></td>");
        $div_disposalAlarmResult = $("<td></td>");
        $div_eventNum = $("<td></td>");
        $div_usrAlmType = $("<td></td>");
        $div_cPayNO = $("<td></td>");
        $div_accountNum = $("<td></td>");
        $div_contact= $("<td></td>");
        $div_cMobile = $("<td></td>");
        $div_accountName = $("<td></td>");
        $div_accountAddr = $("<td></td>");
        $div_codeType = $("<td></td>");
        $div_eventDesc = $("<td></td>");
        $div_eventTime = $("<td></td>");
        $div_alarmAddr = $("<td></td>");
        $div_acceptAlarmTime = $("<td></td>");
        $div_acceptAlarmer = $("<td></td>");
        $div_memo = $("<td></td>");

        $div_row
            .append($div_disposalAlarmNum)
            .append($div_actualSituation)
            .append($div_disposalAlarmResult)
            .append($div_eventNum)
            .append($div_usrAlmType)
            .append($div_cPayNO)
            .append($div_accountNum)
            .append($div_contact)
            .append($div_cMobile)
            .append($div_accountName)
            .append($div_accountAddr)
            .append($div_codeType)
            .append($div_eventDesc)
            .append($div_eventTime)
            .append($div_alarmAddr)
            .append($div_acceptAlarmTime)
            .append($div_acceptAlarmer)
            .append($div_memo)

            .addClass('table_row')
            .attr('id', row_json.disposeID);

        $div_disposalAlarmNum.addClass("eventNum_title").text(row_json.disposalAlarmNum).attr("title", row_json.disposalAlarmNum);
        var result;
        for(var i=0;i<_global.dataResult.result.length;i++){
            if(_global.dataResult.result[i].alarmcode==row_json.actualSituation){
                result=_global.dataResult.result[i].alarmcontent;
            }
        }
        $div_actualSituation.addClass("actualSituation_title").text(result).attr("title", result);
        $div_disposalAlarmResult.addClass("disposalAlarmResult_title").text(row_json.disposalAlarmResult).attr("title", row_json.disposalAlarmResult);
        $div_eventNum.addClass("eventNum_title").text(row_json.eventNum).attr("title", row_json.eventNum);
        $div_usrAlmType.addClass("usrAlmType_title").text(getUsrAlmType(row_json.usrAlmType)).attr("title", getUsrAlmType(row_json.usrAlmType));
        $div_cPayNO.addClass("cPayNO_title").text(row_json.cPayNO).attr("title", row_json.cPayNO);
        $div_accountNum.addClass("accountNum_title").text(row_json.accountNum).attr("title", row_json.accountNum);
        $div_contact.addClass("contact_title").text(row_json.contact).attr("title", row_json.contact);
        $div_cMobile.addClass("cMobile_title").text(row_json.cMobile).attr("title", row_json.cMobile);
        $div_accountName.addClass("accountName_title").text(row_json.accountName).attr("title", row_json.accountName);
        $div_accountAddr.addClass("accountAddr_title").text(row_json.accountAddr).attr("title", row_json.accountAddr);
        $div_codeType.addClass("eventType_title").text(row_json.eventType).attr("title", row_json.eventType);
        $div_eventDesc.addClass("eventDesc_title").text(row_json.eventDesc).attr("title", row_json.eventDesc);
        $div_eventTime.addClass("eventTime_title").text(row_json.eventTime).attr("title", row_json.eventTime);
        $div_alarmAddr.addClass("isPayName_title").text(row_json.alarmAddr).attr("title", row_json.alarmAddr);
        $div_acceptAlarmTime.addClass("acceptAlarmTime_title").text(row_json.acceptAlarmTime).attr("title", row_json.acceptAlarmTime);
        $div_acceptAlarmer.addClass("acceptAlarmer_title").text(row_json.acceptAlarmer).attr("title", row_json.acceptAlarmer);
        $div_memo.addClass("memo_title table_title_item").text(row_json.memo).attr("title", row_json.memo);


        if (isPre) {
            $div_row.prependTo($("#table_content"));
        } else {
            $div_row.appendTo($("#table_content"));
        }
        $div_row.bind('dblclick', function (e) {
            parent.parent.setPopupsRowJson(row_json);
            _global.top.popusStaManager( 'rdVerify');

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
    function _getAlarmReason() {
        //报警原因查询
        post_async(
            null,
            "/IntegratedMM/QueryAlarmCaseList.do",
            _callback_getAlarmReason);
    }
    function _callback_getAlarmReason(data) {
        if(data.code == 1000){
            _global.dataResult=data;
        }else{
            _getAlarmReason();  //请求失败 再请求
        }
    }
    function _buildAlertPojo(eventType) {
        var alertPojo = {};
        alertPojo.sysuserID = _global.getAlarmInfosParams.alertPojo.sysuserID;
        alertPojo.disposeStatus = '0';
        alertPojo.eventLevel = '';
        alertPojo.eventType = eventType;
        return alertPojo;
    }

    function alarmData_callbackfunc(data) {
        var result = data.result;
        if (result.code == 0) {
            var statistics = parent.getStatistics();
            statistics[0] = data.statistics;
            parent.setStatistics(statistics);
            parent.updateStatistics();
        } else {

        }
    }

    function _switchPoliceType(policeType) {
        var sysuserID = _global.top.getSysuserID();
        parent.statisticalt(sysuserID, '0', "", alarmData_callbackfunc)
        switch (policeType) {
            //火警
            case 'fire':
                _global.eventTypePush = '0';
                var alertPojo = _buildAlertPojo("0")
                _getAlarmInfos(alertPojo);

                break;
            //劫盗
            case 'holding':
                _global.eventTypePush = '1';
                var alertPojo = _buildAlertPojo("1")
                _getAlarmInfos(alertPojo);

                break;
            //有声劫盗
            case 'haveholdup':
                _global.eventTypePush = '2';
                var alertPojo = _buildAlertPojo("2")
                _getAlarmInfos(alertPojo);

                break;
            //无声劫盗
            case 'noholdup':
                _global.eventTypePush = '3';
                var alertPojo = _buildAlertPojo("3")
                _getAlarmInfos(alertPojo);

                break;
            //挟持
            case 'holdup':
                _global.eventTypePush = '4';
                var alertPojo = _buildAlertPojo("4")
                _getAlarmInfos(alertPojo);

                break;
            //周边防范
            case 'prevent':
                _global.eventTypePush = '5';
                var alertPojo = _buildAlertPojo("5")
                _getAlarmInfos(alertPojo);
                break;

            //窃盗
            case 'theft':
                _global.eventTypePush = '6';
                var alertPojo = _buildAlertPojo("6")
                _getAlarmInfos(alertPojo);
                break;
            //出入防区
            case 'inoutplay':
                _global.eventTypePush = '7';
                var alertPojo = _buildAlertPojo("7")
                _getAlarmInfos(alertPojo);
                break;
            //一般报警
            case 'callpolice':
                _global.eventTypePush = '8';
                var alertPojo = _buildAlertPojo("8")
                _getAlarmInfos(alertPojo);
                break;
            //拆动
            case 'split':
                _global.eventTypePush = '9';
                var alertPojo = _buildAlertPojo("9")
                _getAlarmInfos(alertPojo);
                break;
            //无交流
            case 'nocommunication':
                _global.eventTypePush = '10';
                var alertPojo = _buildAlertPojo("10")
                _getAlarmInfos(alertPojo);
                break;
            //系统电池电压过低
            case 'voltagelow':
                _global.eventTypePush = '11';
                var alertPojo = _buildAlertPojo("11")
                _getAlarmInfos(alertPojo);
                break;
            //电池测试故障
            case 'voltagefault':
                _global.eventTypePush = '12';
                var alertPojo = _buildAlertPojo("12")
                _getAlarmInfos(alertPojo);
                break;
            //扩充器故障
            case 'Extenderfault':
                _global.eventTypePush = '13';
                var alertPojo = _buildAlertPojo("13")
                _getAlarmInfos(alertPojo);
                break;
            //警铃1
            case 'alarmone':
                _global.eventTypePush = '14';
                var alertPojo = _buildAlertPojo("14")
                _getAlarmInfos(alertPojo);
                break;
            //警铃1恢复
            case 'alarmonerestore':
                _global.eventTypePush = '15';
                var alertPojo = _buildAlertPojo("15")
                _getAlarmInfos(alertPojo);
                break;
            //警铃2
            case 'alarmtow':
                _global.eventTypePush = '16';
                var alertPojo = _buildAlertPojo("16")
                _getAlarmInfos(alertPojo);
                break;
            //警铃2恢复
            case 'alarmtowrestore':
                _global.eventTypePush = '17';
                var alertPojo = _buildAlertPojo("17")
                _getAlarmInfos(alertPojo);
                break;
            //通讯失败
            case 'communicationfailure':
                _global.eventTypePush = '18';
                var alertPojo = _buildAlertPojo("18")
                _getAlarmInfos(alertPojo);
                break;
            //电话线1故障
            case 'Telephonelineonefault':
                _global.eventTypePush = '19';
                var alertPojo = _buildAlertPojo("19")
                _getAlarmInfos(alertPojo);
                break;
            //电话线1故障恢复
            case 'Telephonelineonefaultrestore':
                _global.eventTypePush = '20';
                var alertPojo = _buildAlertPojo("20")
                _getAlarmInfos(alertPojo);
                break;
            //电话线2故障
            case 'Telephonelinetowfaultre':
                _global.eventTypePush = '21';
                var alertPojo = _buildAlertPojo("21")
                _getAlarmInfos(alertPojo);
                break;
            //电话线2故障恢复
            case 'Telephonelinetowfaultrestore':
                _global.eventTypePush = '22';
                var alertPojo = _buildAlertPojo("22")
                _getAlarmInfos(alertPojo);
                break;
            //感应器故障
            case 'Sensorfault':
                _global.eventTypePush = '23';
                var alertPojo = _buildAlertPojo("23")
                _getAlarmInfos(alertPojo);
                break;
            //无线感应器故障
            case 'Radioinducedfailure':
                _global.eventTypePush = '24';
                var alertPojo = _buildAlertPojo("24")
                _getAlarmInfos(alertPojo);
                break;
            //无线感应器电池过低
            case 'sensorbatterieslow':
                _global.eventTypePush = '25';
                var alertPojo = _buildAlertPojo("25")
                _getAlarmInfos(alertPojo);
                break;


            case 'onealert':
                _global.eventTypePush = '27';
                var alertPojo = _buildAlertPojo("27")
                _getAlarmInfos(alertPojo);

                break;
            case 'twoalert':
                _global.eventTypePush = '28';
                var alertPojo = _buildAlertPojo("28")
                _getAlarmInfos(alertPojo);

                break;
            case 'onefault':
                _global.eventTypePush = '29';
                var alertPojo = _buildAlertPojo("29")
                _getAlarmInfos(alertPojo);

                break;
            case 'twofault':
                _global.eventTypePush = '30';
                var alertPojo = _buildAlertPojo("30")
                _getAlarmInfos(alertPojo);

                break;
            case 'superm':
                _global.eventTypePush = '26';
                var alertPojo = _buildAlertPojo("26")
                _getAlarmInfos(alertPojo);

                break;
            case 'all':
                _global.eventTypePush = '31';
                var alertPojo = _buildAlertPojo("")
                _getAlarmInfos(alertPojo);
                break;
            default:
                break;
        }
    }

    function _messageExchange(dataJson) {
        var row_json =
            {
                disposalAlarmNum: "",
                eventNum: "",
                usrAlmType: "",
                cPayNO: "",
                accountNum: "",
                contact: "",
                cMobile: "",
                accountName: "",
                accountAddr: "",
                eventType: "",
                eventDesc: "",
                eventTime: "",
                alarmAddr: "",
                acceptAlarmTime: "",
                acceptAlarmer: "",
                actualSituation: "",
                disposalAlarmResult: "",
                memo: "",
            };
        row_json.disposalAlarmNum = dataJson.verifyNum;
        row_json.eventNum = dataJson.eventNum;
        row_json.usrAlmType = dataJson.usrAlmType;
        row_json.cPayNO = dataJson.PayNO;
        row_json.accountNum = dataJson.accountNum;
        row_json.contact = dataJson.contact;
        row_json.cMobile = dataJson.cMobile;
        row_json.accountName = dataJson.accountName;
        row_json.accountAddr = dataJson.accountAddr;

        var codeTypeName = showCodeType(dataJson.codeType);
        row_json.eventType = codeTypeName;
        row_json.eventDesc = dataJson.eventDesc;
        row_json.eventTime = dataJson.eventTime.replace('T',' ');
        row_json.alarmAddr = dataJson.alarmAddr;
        row_json.acceptAlarmTime = dataJson.acceptAlarmTime.replace('T',' ');
        row_json.acceptAlarmer = dataJson.acceptAlarmer;
        row_json.actualSituation = dataJson.actualSituation;
        row_json.disposalAlarmResult = dataJson.disposalAlarmResult;
        row_json.memo = dataJson.memo;
        return row_json;

    }

    function _getAlarmInfosParams() {

        var params = {};
        params.pretreatmentPojo = {};
        params.pageInfoPojo = {};
        params.pretreatmentPojo = _global.getAlarmInfosParams.pretreatmentPojo;
        params.pageInfoPojo.currentPage = _global.getAlarmInfosParams.pageInfoPojo.currentPage;
        /*params.pageInfoPojo.sort = _global.getAlarmInfosParams.pageInfoPojo.sort;*/
        params.pageInfoPojo.sort = sortVal();
        params.pageInfoPojo.pageSize = _global.getAlarmInfosParams.pageInfoPojo.pageSize;
        return params;
    }
    /*修改升降序*/
    function sortVal() {
        var sort="";
        if($("#timePng").hasClass('timePngchange')){
            sort="createTime|DESC";
        }
        else{
            sort="createTime|ASC";
        }
        return sort;
    }

    function _getAlarmInfos(pretreatmentPojo) {
        _global.getAlarmInfosParams.pretreatmentPojo = pretreatmentPojo;
        _global.getAlarmInfosParams.pageInfoPojo.currentPage = 1;
        _globalH.getAlarmInfosParams=_global.getAlarmInfosParams;
        $('body').loading();
        var param = _getAlarmInfosParams();

        var params = {
            "sysuserID": param.pretreatmentPojo.sysuserID,
            "all": param.pretreatmentPojo.all,
            "accountNum": param.pretreatmentPojo.accountNum,
            "accountName": param.pretreatmentPojo.accountName,
            "cMobile":param.pretreatmentPojo.cMobile,
            "acceptAlarmTime": param.pretreatmentPojo.acceptAlarmTime,
            "verifyNum": param.pretreatmentPojo.verifyNum,
            "createTime": param.pretreatmentPojo.createTime,
            "pageInfoPojo": {
                "currentPage": param.pageInfoPojo.currentPage,
                "sort": param.pageInfoPojo.sort,
                "pageSize": param.pageInfoPojo.pageSize}
        }

        post_async(params, _config.ajaxUrl.verifyQuery, _callback_getAlarmInfos);
    }

    function _getAlarmInfosH() {
        _global.getAlarmInfosParams=_globalH.getAlarmInfosParams;
        $('body').loading();
        var param = _getAlarmInfosParams();

        var params = {
            "sysuserID": param.pretreatmentPojo.sysuserID,
            "all": param.pretreatmentPojo.all,
            "accountNum": param.pretreatmentPojo.accountNum,
            "accountName": param.pretreatmentPojo.accountName,
            "cMobile":param.pretreatmentPojo.cMobile,
            "acceptAlarmTime": param.pretreatmentPojo.acceptAlarmTime,
            "verifyNum": param.pretreatmentPojo.verifyNum,
            "createTime": param.pretreatmentPojo.createTime,
            "pageInfoPojo": {
                "currentPage": param.pageInfoPojo.currentPage,
                "sort": param.pageInfoPojo.sort,
                "pageSize": param.pageInfoPojo.pageSize}
        }

        post_async(params, _config.ajaxUrl.verifyQuery, _callback_getAlarmInfos);
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
            _global.plugins.page.setPage(totalPage, currentPage, totalNum);
            //pluginsPage.setPage(totalPage, currentPage, totalNum);
            _clearRow();
            var pretreatmentPojo = data.pretreatmentPojo;
            for (var i = 0; i < pretreatmentPojo.length; i++) {
                addTableRow(pretreatmentPojo[i]);
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
            "sysuserID": param.pretreatmentPojo.sysuserID,
            "all": param.pretreatmentPojo.all,
            "accountNum": param.pretreatmentPojo.accountNum,
            "accountName": param.pretreatmentPojo.accountName,
            "cMobile":param.pretreatmentPojo.cMobile,
            "acceptAlarmTime": param.pretreatmentPojo.acceptAlarmTime,
            "verifyNum": param.pretreatmentPojo.verifyNum,
            "createTime": param.pretreatmentPojo.createTime,
            "pageInfoPojo": {
                "currentPage": param.pageInfoPojo.currentPage,
                "sort": param.pageInfoPojo.sort,
                "pageSize": param.pageInfoPojo.pageSize}
        }
        post_async(params, _config.ajaxUrl.verifyQuery, _callback_getAlarmInfos);
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

    function _pageRemove() {
        var pageInfoPojo = {};
        pageInfoPojo = _getPageInfo();
        var currentPage = pageInfoPojo.currentPage;
        var totalNum = pageInfoPojo.totalNum;
        var totalPage = pageInfoPojo.totalPage;
        var pageSize = pageInfoPojo.pageSize;
        totalNum--;

        totalPage = ((totalNum - 1) / pageSize) + 1;
        pageInfoPojo.currentPage = currentPage;
        pageInfoPojo.totalNum = totalNum;
        pageInfoPojo.totalPage = totalPage;
        pageInfoPojo.pageSize = pageSize;
        _setPageInfo(pageInfoPojo);

    }

    function getCodeType(){
        _getCodeTypeList();
    }

    function _getCodeTypeList() {
        //警情类型
        post_async(
            null,
            "/IntegratedMM/query/getCodeTypeList.do",
            _callback_getCodeTypeList);
    }
    function _callback_getCodeTypeList(data) {
        if(data.result.code == 200){
            _global.result = data.LatLong;
        }else{

        }

    }
    function showCodeType(data){
        for(var i=0;i<_global.result.length;i++){
            if(_global.result[i].codeTypeId==data){
                return _global.result[i].codeType;
            }
        }
    }
    
})(jQuery, window);

