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
    window.appendRow = addRow;
    window.getAlarmInfos = _getAlarmInfos;
    window.queryData_page = _queryData_page;
    window.getPageInfo = _getPageInfo;
    window.setPageInfo = _setPageInfo;
    window.searchEventInfo = _searchEventInfo;
    // window.sendInfo = _sendInfo;
    var _config = {
        ajaxUrl: {
            getInspectionFormsUrl: '/IntegratedMM/query/getInspectionForms.do'
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
            queryPojo: {
                queryOperation: 'all',
                queryContent:'',
                createTime:''
            },
            pageInfoPojo: {
                currentPage: '1',
                sort: 'createTime|ASC',
                pageSize: '25',
                totalNum: '',
                totalPage: ''
            }
        },
        eventTypeSearch:'1',
        maintainTypeJson:null,
        eventTypePush:null
    };

    var _globalH = {
        getAlarmInfosParams: {
            queryPojo: {
                queryOperation: 'all',
                queryContent:'',
                createTime:''

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
    function _initData() {
        var nowTime = getNowFormatDate();
        //var startTime = getBeforeFormatDate();
        var startTime = getBeforeHalfYearFormatDate();
        nowTime =nowTime.split(" ")[0]+" 23:59:59";
        startTime =startTime.split(" ")[0]+" 00:00:00";
        $("#startTime").val(startTime);
        $('#startTime').bind('focus',function () {
            WdatePicker({
                maxDate: '#F{$dp.$D(\'endTime\')}',
                dateFmt: 'yyyy-MM-dd HH:mm:ss',
                isShowClear: false
            });
            this.blur();
        });
        $("#endTime").val(nowTime);
        $('#endTime').bind('focus',function () {
            WdatePicker({
                minDate: '#F{$dp.$D(\'startTime\')}',
                dateFmt: 'yyyy-MM-dd HH:mm:ss',
                isShowClear: false
            });
            this.blur();
        });

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

        $("#search_text").keydown(function(event){
            if(event.keyCode == 13){ //绑定回车
                _searchEventInfo();
            }
        });

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
        var queryPojo = {};

        queryPojo.sysuserID = 'E123';

        queryPojo.queryOperation = $("#fuzzy").val();
        queryPojo.queryContent = $("#search_text").val();
        
        var time = $("#startTime").val()+";"+$("#endTime").val();
        queryPojo.createTime =time;
        _getAlarmInfos(queryPojo);  //初始化请求未处理事件
    }
    function addRow(jsonData, isPre) {
        addTableRow(jsonData, isPre);
        setColSize();
    }
    function addTableRow(jsonData, isPre) {
        var row_json = _messageExchange(jsonData);//转换原始数据与显示的数据

        $div_row = $("<tr></tr>");
        $div_inspectionFormId = $("<td></td>");
        $div_inspectionResult = $("<td></td>");
        $div_usrAlmType = $("<td></td>");
        $div_payNO = $("<td></td>");
        $div_userId = $("<td></td>");
        $div_contact = $("<td></td>");
        $div_cMobile = $("<td></td>");
        $div_userName = $("<td></td>");
        $div_userAddr = $("<td></td>");
        $div_acceptAlarmer = $("<td></td>");
        $div_createTime = $("<td></td>");
        $div_inspectionType = $("<td></td>");
        $div_inspectionUnit = $("<td></td>");
        $div_inspectioner = $("<td></td>");
        $div_inspectionDate = $("<td></td>");
        $div_pnlTel = $("<td></td>");
        $div_notes = $("<td></td>");
        $div_row
            .append($div_inspectionFormId)
            .append($div_inspectionResult)
            .append($div_usrAlmType)
            .append($div_payNO)
            .append($div_userId )
            .append($div_contact)
            .append($div_cMobile)
            .append($div_userName)
            .append($div_userAddr)
            .append($div_acceptAlarmer)
            .append($div_createTime)
            .append($div_inspectionType)
            .append($div_inspectionUnit)
            .append($div_inspectioner)
            .append($div_inspectionDate)
            .append($div_pnlTel)
            .append($div_notes)
            .addClass('table_row')
            .attr('id', row_json.inspectionFormId);
        $div_inspectionFormId.addClass("table_item_long").text(row_json.inspectionFormId).attr("title", row_json.inspectionFormId);
        $div_inspectionResult.addClass("table_item_3").text(row_json.inspectionResult ).attr("title", row_json.inspectionResult );
        $div_usrAlmType.addClass("table_item_4").text(getUsrAlmType(row_json.usrAlmType)).attr("title", getUsrAlmType(row_json.usrAlmType));
        $div_payNO.addClass("table_item_userName").text(row_json.payNO).attr("title", row_json.payNO);
        $div_userId.addClass("table_item_long").text(row_json.userId).attr("title", row_json.userId);
        $div_contact.addClass("table_item_time").text(row_json.contact ).attr("title", row_json.contact);
        $div_cMobile.addClass("table_item_zoneNum").text(row_json.cMobile).attr("title", row_json.cMobile);
        $div_userName.addClass("table_item_4").text(row_json.userName ).attr("title", row_json.userName);
        $div_userAddr.addClass("table_item_zoneNum").text(row_json.userAddr ).attr("title", row_json.userAddr );
        $div_acceptAlarmer.addClass("table_item_userName").text(row_json.acceptAlarmer ).attr("title", row_json.acceptAlarmer );
        $div_createTime.addClass("table_item_4").text(row_json.createTime ).attr("title",row_json.createTime );
        $div_inspectionType.addClass("table_item_4").text(row_json.inspectionType ).attr("title", row_json.inspectionType );
        $div_inspectionUnit.addClass("table_item_4").text(row_json.inspectionUnit ).attr("title", row_json.inspectionUnit );
        $div_inspectioner.addClass("table_item_3").text(row_json.inspectioner ).attr("title", row_json.inspectioner );
        $div_inspectionDate.addClass("table_item_3").text(row_json.inspectionDate ).attr("title", row_json.inspectionDate );
        $div_pnlTel.addClass("table_item_5").text(row_json.pnlTel ).attr("title", row_json.pnlTel );
        $div_notes.addClass("table_item_5").text(row_json.notes ).attr("title", row_json.notes );
        $div_row.appendTo($("#table_content"));
        //}
        $div_row.bind('dblclick', function () {
            parent.parent.setPopupsRowJson(row_json);
            _global.top.popusStaManager('patrollist');

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
            inspectionFormId: "",
            userId: "",
            userName: "",
            contact: "",
            cMobile: "",
            usrAlmType: "",
            payNO: "",
            userAddr: "",
            acceptAlarmer: "",
            createTime: "",
            inspectionType: "",
            inspectioner: "",
            inspectionDate: "",
            inspectionResult: "",
            notes: "",
            updateTime: "",
            defined1: "",
            creater: "",
            formStatus: "",
            isOutForm:'',
            pnlTel:''

        };
        row_json.inspectionFormId = dataJson.inspectionFormId;
        row_json.userId = dataJson.userId;
        row_json.userName = dataJson.userName;
        row_json.contact = dataJson.contact;
        row_json.cMobile = dataJson.cMobile;
        row_json.usrAlmType = dataJson.usrAlmType;
        row_json.payNO = dataJson.payNO;
        row_json.userAddr = dataJson.userAddr;
        row_json.acceptAlarmer = dataJson.acceptAlarmer;
        row_json.createTime = dataJson.createTime.substring(0,19);
        row_json.inspectionType = dataJson.inspectionType;
        row_json.inspectionUnit = dataJson.inspectionUnit;
        row_json.inspectioner = dataJson.inspectioner;
        row_json.inspectionDate = dataJson.inspectionDate.substring(0,19) ;
        row_json.inspectionResult = dataJson.inspectionResult;
        row_json.notes = dataJson.notes;
        row_json.updateTime = dataJson.updateTime;
        row_json.defined1 = dataJson.defined1;
        row_json.creater = dataJson.creater;
        row_json.formStatus = dataJson.formStatus;
        row_json.isOutForm = dataJson.isOutForm;
        row_json.pnlTel = dataJson.pnlTel;
        return row_json;

    }

    function _getAlarmInfosParams() {
        var params = {};
        params.queryPojo = {};
        params.pageInfoPojo = {};
        params.queryPojo = _global.getAlarmInfosParams.queryPojo;
        params.pageInfoPojo.currentPage = _global.getAlarmInfosParams.pageInfoPojo.currentPage;
        params.pageInfoPojo.orderBy = sortVal();
        params.pageInfoPojo.pageSize = _global.getAlarmInfosParams.pageInfoPojo.pageSize;
        return params;
    }
    /************************************************
     判断升降序222
     ************************************************/
    function sortVal() {
        var orderBy="";
        if($("#timePng").hasClass('timePngchange')){
            orderBy="createTime|DESC";
        }
        else{
            orderBy="createTime|ASC";
        }

        return orderBy;
    }

    function _getAlarmInfos(queryPojo) {
        _global.getAlarmInfosParams.queryPojo = queryPojo;
        _global.getAlarmInfosParams.pageInfoPojo.currentPage = 1;
        _globalH.getAlarmInfosParams=_global.getAlarmInfosParams;
        $('body').loading();
        var param = _getAlarmInfosParams();

        var params = {
            queryPojo:{
                queryOperation: param.queryPojo.queryOperation,
                queryContent: param.queryPojo.queryContent,
                createTime: param.queryPojo.createTime,
            },
            pageInfoPojo: {
                currentPage: param.pageInfoPojo.currentPage,
                orderBy: param.pageInfoPojo.orderBy,
                pageSize: param.pageInfoPojo.pageSize},
            "roleId": _global.top.getSysroleId(),
        };                                //转圈
        post_async(params, _config.ajaxUrl.getInspectionFormsUrl, _callback_getInspectionInfos);
    }
    function _getAlarmInfosH() {
        _global.getAlarmInfosParams=_globalH.getAlarmInfosParams;
        $('body').loading();
        var param = _getAlarmInfosParams();

        var params = {
            queryPojo:{
                queryOperation: param.queryPojo.queryOperation,
                queryContent: param.queryPojo.queryContent,
                createTime: param.queryPojo.createTime,
            },
            pageInfoPojo: {
                currentPage: param.pageInfoPojo.currentPage,
                orderBy: param.pageInfoPojo.orderBy,
                pageSize: param.pageInfoPojo.pageSize},
            "roleId": _global.top.getSysroleId(),
        };                                //转圈
        post_async(params, _config.ajaxUrl.getInspectionFormsUrl, _callback_getInspectionInfos);
    }

    function _callback_getInspectionInfos(data) {
        //$("body").removeLoading();                                //取消转圈
        var result = data.result;
        $('body').removeLoading();
        if (result.code == '0') {
            var pageInfoPojo = data.pageInfoPojo;
            var totalNum = pageInfoPojo.totalNum;
            var totalPage = pageInfoPojo.totalPage;
            var currentPage = pageInfoPojo.currentPage;
            _global.getAlarmInfosParams.pageInfoPojo.currentPage = currentPage;
            _global.getAlarmInfosParams.pageInfoPojo.totalNum = totalNum;
            _global.getAlarmInfosParams.pageInfoPojo.totalPage = totalPage;
            if(totalNum==0)totalNum=-1;
            _global.plugins.page.setPage(totalPage, currentPage, totalNum);
            _clearRow();
            var inspectionFormPojo = data.inspectionFormPojo;
            for (var i = 0; i < inspectionFormPojo.length; i++) {
                addTableRow(inspectionFormPojo[i]);
            }
        } else {
            _clearRow();
        }
        /*$("#table").colResizableY({
            liveDrag:true,
            gripInnerHtml:"<div></div>",
            draggingClass:"dragging",
            onResize:null,
            minWidth:25
        });*/
        setColSize();
    }

    function _clearRow() {
        $("#table_content").text("");
    }

    function _queryData_page(page) {
        _global.getAlarmInfosParams.pageInfoPojo.currentPage = page;
        $('body').loading();
        var param = _getAlarmInfosParams();
        var params = {
            queryPojo:{
                queryOperation: param.queryPojo.queryOperation,
                queryContent: param.queryPojo.queryContent,
                createTime: param.queryPojo.createTime,
            },
            pageInfoPojo: {
                currentPage: param.pageInfoPojo.currentPage,
                orderBy: param.pageInfoPojo.orderBy,
                pageSize: param.pageInfoPojo.pageSize},
            "roleId": _global.top.getSysroleId(),
        };
        post_async(params, _config.ajaxUrl.getInspectionFormsUrl, _callback_getInspectionInfos);
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

