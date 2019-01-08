/**
 * Created by Administrator on 2017/8/19.
 */
charset = "utf-8";
$(document).ready(function () {
    init();
});

;(function ($, window) {
    window.init = _init;//修改页面大小
    window.appendRow = addRow;
    window.removeRow = _removeRow;
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
            getCphUserDataUrl: '/IntegratedMM/query/getCphUserDataOperator.do',
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
        var nowTime = getNowFormatDate();
        var startTime = getBeforeFormatDate();
        nowTime =nowTime.split(" ")[0];
        startTime =startTime.split(" ")[0];
        //$("#startTime").val(startTime);
        $('#startTime').bind('focus',function () {
            WdatePicker({
                maxDate: '#F{$dp.$D(\'endTime\')}',
                dateFmt: 'yyyy-MM-dd',
                isShowClear: true
            });
            this.blur();
        });
        //重置所属区域
        $("#areaReset").click(function(){
            $("#areaname").data('areaId', "all");
            $("#areaname").val("");
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

        $("#timeorder").click(function(){
            /*$(this).siblings().removeClass("timePng");*/
            $("#timePng").toggleClass("timePngchange");
            _searchuserInfo();
            //_getAlarmInfosH();
        });

        _global.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: _queryData_page,
            cssPath:'../../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
        });
        _switchFiltrate();

        $("#policeCheck").keydown(function(event){
            if(event.keyCode == 13){ //绑定回车
                _searchEventInfo();
            }
        });
        $("#search_img").bind('click',function () {
            _searchEventInfo();
        });
        $("#policeCheck").bind('click',function () {
            _searchuserInfo();
        });
        $("#areaname").click(function(){
            parent.parent.popusStaManager('selectArea3');
        });
        //默认点击查询
        $("#policeCheck").click();
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
    function addRow(jsonData, isPre) {
        addTableRow(jsonData, isPre)
        setColSize();
    }

    function addTableRow(jsonData, isPre) {
        var row_json = jsonData;
        
        $div_row = $("<tr></tr>");
        $div_userId = $("<td></td>");
        $div_userName = $("<td></td>");
        $div_userType = $("<td></td>");
        $div_areaName = $("<td></td>");
        $div_overDateTime = $("<td></td>");
        $div_acctIP = $("<td></td>");
        $div_sex = $("<td></td>");
        $div_telephone = $("<td></td>");
        $div_email = $("<td></td>");
        //$div_education = $("<td></td>");
        $div_office = $("<td></td>");
        $div_userPWDhint = $("<td></td>");
        $platformName_title = $("<td></td>");
        $div_acctDY = $("<td></td>");
        $div_fMemo = $("<td></td>");

        $div_row
            .append($div_userId)
            .append($div_userName)
            .append($div_userType)
            .append($div_areaName)
            .append($div_overDateTime)
            .append($div_acctIP)
            .append($div_sex)
            .append($div_telephone)
            .append($div_email)
            //.append($div_education)
            .append($div_office)
            .append($div_userPWDhint)
            .append($platformName_title)
            .append($div_acctDY)
            .append($div_fMemo)
            .addClass('table_row')
            .attr('id', row_json.userId);
        $div_userId.addClass('table_title_item').text(row_json.userId).attr("title", row_json.userId);
        $div_userName.addClass('table_title_item').text(row_json.userName).attr("title", row_json.userName);
        if(row_json.acctType=="2"){
            $div_userType.addClass('table_title_item').text("系统操作员").attr("title", "系统操作员");
            //$div_userType.addClass('table_title_item').text(row_json.userType).attr("title", row_json.userType);
        }else if(row_json.acctType=="3"){
            $div_userType.addClass('table_title_item').text("业务操作员").attr("title", "业务操作员");
        }
        $div_areaName.addClass('table_title_item').text(row_json.areaName).attr("title", row_json.areaName);
        $div_overDateTime.addClass('table_title_item').text(row_json.overDateTime).attr("title", row_json.overDateTime);
        $div_acctIP.addClass('table_title_item').text(row_json.acctIP).attr("title", row_json.acctIP);
        var sex="";
        if(row_json.sex==0)
        {
            sex="男"
        }else if(row_json.sex==1){
            sex="女"
        }
        $div_sex.addClass('table_title_item').text(sex).attr("title", sex);
        $div_telephone.addClass('table_title_item').text(row_json.telephone).attr("title", row_json.telephone);
        $div_email.addClass('table_title_item').text(row_json.email).attr("title", row_json.email);
        //$div_education.addClass('table_title_item').text(row_json.education).attr("title", row_json.education);
        $div_office.addClass('table_title_item').text(row_json.office).attr("title", row_json.office);
        $div_userPWDhint.addClass('table_title_item').text(row_json.userPWDhint).attr("title", row_json.userPWDhint);
        $platformName_title.addClass('table_title_item').text(row_json.platformName).attr("title", row_json.platformName);
        var acctDY="";
        if(row_json.acctDY==0)
        {
            acctDY="不启用"
        }else if(row_json.acctDY==1){
            acctDY="启用并回发消息"
        }else if(row_json.acctDY==2){
            acctDY="启用不回发消息"
        }
        $div_acctDY.addClass('table_title_item').text(acctDY).attr("title", acctDY);
        $div_fMemo.addClass('table_title_item').text(row_json.fMemo).attr("title", row_json.fMemo);

        $("#table_content").append($div_row);

        $div_row.bind('dblclick', function (e) {
            parent.parent.popusStaManager('alterSysOperator');
            parent.parent.setPopupsRowJson(row_json);

        });
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
        queryTond.fuzzy.fuzzyKey=$("#search").val();
        queryTond.fuzzy.fuzzyValue=$("#search_text").val();
        queryTond.areaId=$("#areaname").data('areaId');//$("#areaname").val() ;
        queryTond.acctType=$("#acctType").val();
        queryTond.businessId="all";
        queryTond.userServerType="all";
        queryTond.timeStart=$("#startTime").val();
        queryTond.timeEnt=$("#endTime").val();
        pageInfoPojo.pageSize= "25";
        pageInfoPojo.sort= _gettimeReceptacle();
        console.log(queryTond);
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

