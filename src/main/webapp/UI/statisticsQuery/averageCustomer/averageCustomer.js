/**
 * Created by Administrator on 2017/8/19.
 */
/**
 * Created by ly on 2016/10/9.
 */
charset = "utf-8";
$(document).ready(function() {
	init();
});

;(function ($, window) {
    window.init = _init;//修改页面大小
    window.appendRow = addRow;
    window.removeRow = _removeRow;
    //window.appendRow = addTableRow;
    window.getAlarmInfos = _getAlarmInfos;
    window.queryData_page = _queryData_page;
    window.getPageInfo = _getPageInfo;
    window.setPageInfo = _setPageInfo;
    window.searchEventInfo = _searchEventInfo;
    window.setAreaName=_setAreaName;
    var areaId ="all";
    var _config = {
        minWidth: 3045,
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
            getCphUserDataUrl: '/IntegratedMM/query/getCphUserData.do',
            getOwnerDropDownUrl:'../../../DropDown/getOwnerDropDown.do'
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
                fuzzy:{
                    fuzzyKey:"",
                    fuzzyValue:"",
                },
                areaId:"",
                businessId:"",
                userServerType:"",
                nomRpt:"",
                timeStart:"",
                timeEnt:"",
            },
            pageInfoPojo: {
                currentPage: '1',
                sort: 'receiveTime|ASC',
                pageSize: '25',
                totalNum: '',
                totalPage: ''
            }
        },
        eventTypeSearch:'5',
        eventTypeJson:null,
        eventTypePush:null
    };
    var _globalH = {
        getAlarmInfosParams: {
            queryTond: {
                fuzzy:{
                    fuzzyKey:"",
                    fuzzyValue:"",
                },
                areaId:"",
                businessId:"",
                userServerType:"",
                nomRpt:"",
                timeStart:"",
                timeEnt:"",},
            pageInfoPojo: {
                currentPage: '1',
                sort: 'receiveTime|ASC',
                pageSize: '25',
                totalNum: '',
                totalPage: ''
            }
        }
    };

    function _init() {
        _initEven();
    }

    function _initEven() {
        $("#areaname").data('areaId', "all");
        $('#startTime').bind('focus',function () {
            WdatePicker({
                maxDate: '#F{$dp.$D(\'endTime\')}',
                dateFmt: 'yyyy-MM-dd',
                isShowClear: true
            });
            this.blur();
        });
        $('#endTime').bind('focus',function () {
            WdatePicker({
                minDate: '#F{$dp.$D(\'startTime\')}',
                dateFmt: 'yyyy-MM-dd',
                isShowClear: true
            });
            this.blur();
        });

        $(".timeorder").click(function(){
            $("#timePng").toggleClass("timePngchange");
            _searchuserInfo();
        });
        //重置所属区域
        $("#areaReset").click(function(){
            $("#areaname").data('areaId', "all");
            $("#areaname").val("");
        });

        $("#accountType").one('click',function () {
            var params={"DropDownName":"userServerType"};
            post_async(params, _config.ajaxUrl.getOwnerDropDownUrl, _getaccountType_callback);
        });
        _global.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: _queryData_page,
            cssPath:'../../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
        });
        _switchFiltrate();

        $("#search_text").keydown(function(event){
            if(event.keyCode == 13){ //绑定回车
                //_searchEventInfo();
                _getAlarmInfosH();
            }
        });
        $("#search_img").bind('click',function () {
            _searchEventInfo();
        });
        $("#policeCheck").bind('click',function () {
            _searchuserInfo();
        });
        $("#areaname").click(function(){
            parent.parent.popusStaManager('selectArea2');
        });
        $("#policeCheck").click();
        $("#accountBusiness").one('click',function () {
            var params={"DropDownName":"business"};
            post_async(params, _config.ajaxUrl.getOwnerDropDownUrl, _getaccountBusiness_callback);
        });
    }
    function _searchEventInfo() {
        _searchuserInfo();
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
            case 'dayInstall':
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
            case 'all':
                _global.eventTypeSearch = '5';
                break;
            default:
                break;

        }
        _searchEventInfo();
    }



    function _removeRow(eventNum) {
        if($("#" + eventNum).length>0){
            $("#" + eventNum).remove();
            _pageRemove();
        };
    }
    function addRow(jsonData, isPre){
        addTableRow(jsonData, isPre);
        setColSize();
    }
    function _getaccountType_callback(data){
        var $option = $("<option></option>");
        for (var i = 0;i<data.dropDownPojo.length;i++){
            var $option = $("<option></option>");
            $option.attr('value',data.dropDownPojo[i].key);
            $option.text(data.dropDownPojo[i].value);
            $option.appendTo($("#accountType"));
        }
    }
    function _getaccountBusiness_callback(data){
        var $option = $("<option></option>");
        for (var i = 0;i<data.dropDownPojo.length;i++){
            var $option = $("<option></option>");
            $option.attr('value',data.dropDownPojo[i].key);
            $option.text(data.dropDownPojo[i].value);
            $option.appendTo($("#accountBusiness"));
        }
    }

    function addTableRow(jsonData, isPre) {
        var row_json = jsonData;
        $div_row = $("<tr></tr>");
        $div_accountNum = $("<td></td>");
        $div_accountName = $("<td></td>");
        $div_accountAddr = $("<td></td>");
        $div_contact = $("<td></td>");
        $div_payNO = $("<td></td>");
        $div_cPhone = $("<td></td>");
        $div_cMobile = $("<td></td>");
        $div_serverTypeName = $("<td></td>");
        $div_areaName = $("<td></td>");
        $div_accountTypeName = $("<td></td>");
        $platformName_title = $("<td></td>");
        $div_operName = $("<td></td>");
        $div_createDate = $("<td></td>");//新添加的字段，录入时间
        $div_accountBusinessName = $("<td></td>");

        $div_userProperty = $("<td></td>");
        $div_cHmPhone = $("<td></td>");
        $div_isPay = $("<td></td>");
        $div_isVideoCheck = $("<td></td>");

        $div_row
            .append($div_accountNum)
            .append($div_accountName)
            .append($div_accountAddr)
            .append($div_contact)
            .append($div_payNO)
            .append($div_cPhone)
            .append($div_cMobile)
            .append($div_serverTypeName)
            .append($div_areaName)
            .append($div_accountTypeName)
            .append($platformName_title)
            .append($div_operName)
            .append($div_createDate)//新添加的字段，录入时间
            .append($div_accountBusinessName)

            .append($div_userProperty)
            .append($div_cHmPhone)
            .append($div_isPay)
            .append($div_isVideoCheck)
            .addClass('table_row')
            .attr('id', jsonData.eventNum);


        $div_accountNum.addClass("table_item_4").text(row_json.userId).attr("title", row_json.userId);
        $div_accountName.addClass("table_item_userName").text(row_json.userName).attr("title", row_json.userName);
        $div_accountAddr.addClass("table_item_userName").text(row_json.userAddr).attr("title", row_json.userAddr);
        $div_contact.addClass("table_item_5").text(row_json.contact).attr("title", row_json.contact);
        $div_payNO.addClass("table_item_4").text(row_json.payNo).attr("title", row_json.payNo);
        $div_cPhone.addClass("table_item_5").text(row_json.cPhone).attr("title", row_json.cPhone);
        $div_cMobile.addClass("table_item_5").text(row_json.cMobile).attr("title", row_json.cMobile);
        $div_serverTypeName.addClass("table_item_4").text(row_json.userServerTypeName).attr("title",row_json.userServerTypeName);
        $div_areaName.addClass("table_item_4").text(row_json.areaName).attr("title", row_json.areaName);
        $div_accountTypeName.addClass("table_item_4").text("一般客户").attr("title", "一般客户");//用户类型，没有文字userTypeTranse(row_json.userType)
        $platformName_title.addClass("table_item_5").text(row_json.platformName).attr("title", row_json.platformName);
        $div_operName.addClass("table_item_3").text(row_json.operName).attr("title", row_json.operName);
        $div_createDate.addClass("table_item_3").text(row_json.instDate).attr("title", row_json.instDate);//新添加的字段，录入时间
        $div_accountBusinessName.addClass("table_item_4").text(row_json.businessName).attr("title", row_json.businessName);

        $div_userProperty.addClass("table_item_4").text(getuserProperty(row_json.userProperty)).attr("title",getuserProperty(row_json.userProperty));//用户类型，没有文字
        $div_cHmPhone.addClass("table_item_5").text(row_json.cHmPhone).attr("title", row_json.cHmPhone);

        if(row_json.isPay=="0"){
            $div_isPay.addClass("table_item_4").text("未缴费").attr("title", "未缴费");
        }else {
            $div_isPay.addClass("table_item_4").text("已缴费").attr("title", "已缴费");
        }
        $div_isVideoCheck.addClass("table_item_4").text(getIsOrNo(row_json.isVideoCheck)).attr("title", getIsOrNo(row_json.isVideoCheck));
        if (isPre) {
            $div_row.prependTo($("#table_content"));
        } else {
            $div_row.appendTo($("#table_content"));
        }
        $div_row.bind('dblclick', function (e) {
            parent.parent.setPopupsRowJson(row_json);
            parent.parent.popusStaManager('alterGeneralUser');
        }).bind('click', function () {
            row_checked($(this),jsonData);
        });
    }
    function getuserProperty(io) {
        switch (io) {
            case '0':
                return "未注册";
                break;
            case '1':
                return "已注册";
                break;
            case 0:
                return "未注册";
                break;
            case 1:
                return "已注册";
                break;
            default:
                break;
        }
    }
    function getIsOrNo(io) {
        switch (io) {
            case 0:
                return "否";
                break;
            case 1:
                return "是";
                break;
            default:
                break;
        }
    }
    function row_checked($row,jsonData) {
        if ($row.hasClass('row_noChecked')) {
            $row.removeClass('row_noChecked').addClass('row_checked').data('jsonData',jsonData);
            $row.siblings().removeClass('row_checked').addClass('row_noChecked');
        } else {
        }
    }

    function _getAlarmInfosParams() {
        var params = {};
        params.queryTond = {};
        params.pageInfoPojo = {};
        params.queryTond = _global.getAlarmInfosParams.queryTond;
        params.pageInfoPojo.currentPage = _global.getAlarmInfosParams.pageInfoPojo.currentPage;
        params.pageInfoPojo.sort = _global.getAlarmInfosParams.pageInfoPojo.sort;
        params.pageInfoPojo.pageSize = _global.getAlarmInfosParams.pageInfoPojo.pageSize;
        return params;
    }

    function _getAlarmInfos(queryTond,pageInfoPojo) {
        _global.getAlarmInfosParams.queryTond = queryTond;
        _global.getAlarmInfosParams.pageInfoPojo = pageInfoPojo;
        _global.getAlarmInfosParams.pageInfoPojo.currentPage = 1;
        _globalH.getAlarmInfosParams=_global.getAlarmInfosParams;
        $('body').loading();
        var params = _getAlarmInfosParams();
        post_async(params, _config.ajaxUrl.getCphUserDataUrl, _callback_getAlarmInfos);
    }
    function _getAlarmInfosH() {
        _global.getAlarmInfosParams=_globalH.getAlarmInfosParams;
        $('body').loading();
        var params = _getAlarmInfosParams();
        post_async(params, _config.ajaxUrl.getCphUserDataUrl, _callback_getAlarmInfos);
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
            if(totalNum == 0)totalNum = -1;
            _global.plugins.page.setPage(totalPage, currentPage, totalNum);
            _clearRow();
            var json = data.json;
            for (var i = 0; i < json.length; i++) {
                addTableRow(json[i]);
            }

        } else {
            _clearRow();
        }
        setColSize();
    }

    function _clearRow() {
        $(".table_row").each(function () {
            var $this = $(this);
                $this.remove();
        });
    }

    function _queryData_page(page) {
        _global.getAlarmInfosParams.pageInfoPojo.currentPage = page;
        $('body').loading();
        var params = _getAlarmInfosParams();
        post_async(params, _config.ajaxUrl.getCphUserDataUrl, _callback_getAlarmInfos);
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
    function _searchuserInfo() {

        var  queryTond = {};
        var  pageInfoPojo ={};
        queryTond.fuzzy = {};
        queryTond.fuzzy.fuzzyKey=$("#fuzzy").val();
        queryTond.fuzzy.fuzzyValue=$("#search_text").val();
        queryTond.areaId=$("#areaname").data('areaId');//$("#areaname").val() ;
        queryTond.businessId=$("#accountBusiness").val();
        queryTond.userServerType=$("#accountType").val();
        queryTond.nomRpt="all";
        queryTond.timeStart=$("#startTime").val();
        queryTond.timeEnt=$("#endTime").val();
        pageInfoPojo.pageSize= "25";
        pageInfoPojo.sort= _gettimeReceptacle();
        _getAlarmInfos(queryTond,pageInfoPojo);
    }

    function _pageRemove(){
        var pageInfoPojo = {};
        pageInfoPojo = _getPageInfo();
        var currentPage = pageInfoPojo.currentPage;
        var totalNum = pageInfoPojo.totalNum;
        var totalPage = pageInfoPojo.totalPage;
        var pageSize = pageInfoPojo.pageSize;
        totalNum--;

        totalPage = ((totalNum-1)/pageSize)+1;
        pageInfoPojo.currentPage = currentPage;
        pageInfoPojo.totalNum = totalNum;
        pageInfoPojo.totalPage = totalPage;
        pageInfoPojo.pageSize = pageSize;
        _setPageInfo(pageInfoPojo);

    }
    function _gettimeReceptacle() {
        var pass="";
        if($("#timePng").hasClass("timePngchange")){
            pass="userId|DESC";
        }
        else {
            pass="userId|ASC";
        }
        return pass;
    }
    function _setAreaName(area) {
        if(area.name=='主目录'){
            $("#areaname").val("");
            $("#areaname").data('areaId', "all");
        }
        else {
            $("#areaname").val(area.name);
            var areaId = area.id;
            $("#areaname").data('areaId', areaId);
        }
    }
    function setColSize(){
        var col1 = document.getElementById("listBox1").getElementsByTagName('td');//获取表头所有列
        var col2 = document.getElementById("listBox2").getElementsByTagName('td');//获取数据表所有列
        $("#listBox1").colResizable({
            minWidth: 20, //最小宽度
            liveDrag:true, //是否实时拖动
            gripInnerHtml:"<div id='dragDiv1'></div>", //拖动div
            draggingClass:"dragging", //拖动div样式
            onResize: null, //拖动时调用函数
            followCol:col2,//数据表的列集合
            mainCol:col1,//表头表的列结婚firstColDrag:false
            firstColDrag:true,
        });
        $("#listBox2").colResizableNot({
            minWidth: 20, //最小宽度
            liveDrag:true, //是否实时拖动
            gripInnerHtml:"<div id='dragDiv'></div>", //拖动div
            draggingClass:"dragging", //拖动div样式
            onResize: null //拖动时调用函数
        });
        document.getElementById("listBox2").style.width=document.getElementById("listBox1").style.width;
        var columnsize = col1.length;

        if((col2!=null&&col2.length>0)&&col1!=null){
            //给数据表重新获取宽度
            for (var i = 0; i < columnsize - 1; i++) {    //遍历Table的所有列
                col2[i].style.width = col1[i].style.width;//实际应用用这里
            }
        }
        //固定和滚动
        document.getElementById("listBox2").style.width=document.getElementById("listBox1").style.width;
        var right_div2 = document.getElementById("right_div2");
        right_div2.onscroll = function(){
            var right_div2_left = this.scrollLeft;
            document.getElementById("right_div1").scrollLeft = right_div2_left;
        }
    }
})(jQuery, window);
