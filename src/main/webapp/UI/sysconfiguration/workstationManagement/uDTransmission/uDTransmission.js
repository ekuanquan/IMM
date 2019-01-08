/**
 * Created by Administrator on 2017/8/19.
 */
/**
 * Created by ly on 2016/10/9.
 */
charset = "utf-8";
$(document).ready(function () {
    init();
});

;
(function ($, window) {
    window.init = _init;//修改页面大小
    window.appendRow = addTableRow;
    window.removeRow = _removeRow;
    window.appendRow = addTableRow;
    window.getAlarmInfos = _getAlarmInfos;
    window.queryData_page = _queryData_page;
    window.getPageInfo = _getPageInfo;
    window.setPageInfo = _setPageInfo;
    window.searchEventInfo = _searchEventInfo;
    window.setAreaName = _setAreaName;
    var areaId = "all";
    var _config = {
        ajaxUrl: {
            getCphUserDataUrl: '/IntegratedMM/query/getCphUserDataRDA.do',
            getOwnerDropDownUrl: '/IntegratedMM/DropDown/getOwnerDropDown.do',
            getAreaUrl: "/IntegratedMM/getRulaArea.do",
            userDataTrans:'/IntegratedMM//Workstation/userDataTrans.do'

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
                fuzzy: {
                    fuzzyKey: "",
                    fuzzyValue: "",
                },
                areaId: "",
                businessId: "",
                userServerType: "",
                nomRpt: "",
                timeStart: "",
                timeEnt: "",
            },
            pageInfoPojo: {
                currentPage: '1',
                sort: 'receiveTime|ASC',
                pageSize: '25',
                totalNum: '',
                totalPage: ''
            }
        },
        eventTypeSearch: '5',
        eventTypeJson: null,
        eventTypePush: null,
        userIdArry: [],
        checkNum:1,
        maxCheckNum:1
    };


    var _globalH = {
        getAlarmInfosParams: {
            queryTond: {
                fuzzy: {
                    fuzzyKey: "",
                    fuzzyValue: "",
                },
                areaId: "",
                businessId: "",
                userServerType: "",
                nomRpt: "",
                timeStart: "",
                timeEnt: "",
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

    function _init() {
        _initEven();
    }

    function _initEven() {

        $('#sure').bind('click', function (e) {
            if (_global.userIdArry.length > 0) {
                _sure();
            } else {
                $('#close').click();
            }
        });

        $('#allCheck').bind('click', function (e) {
            var $this = $(this);
            var check = $this.hasClass('isChecked');
            if (check) {
                $this.removeClass('isChecked').addClass('noChecked');
                $('.table_row > td:first-child > div').removeClass('isChecked').removeClass('noChecked').addClass('noChecked');
                var all_row = $('tr', '#table_content');
                for(var i = 0; i < all_row.length; i++) {
                    var $this = all_row[i];
                    var UserEvtId = $this.id;
                    del_hookUserEvtId(UserEvtId);
                }
                 console.log(JSON.stringify(_global.userIdArry));
            } else {
                $this.removeClass('noChecked').addClass('isChecked');
                $('.table_row > td:first-child > div').removeClass('isChecked').removeClass('noChecked').addClass('isChecked');
                 var all_row = $('tr', '#table_content');
                 for(var i = 0; i < all_row.length; i++) {
                 var $this = all_row[i];
                 var UserEvtId = $this.id;
                 add_hookUserEvtId(UserEvtId);
                 }
                 console.log(JSON.stringify(_global.userIdArry));
            }
        });

        $("#close,#remove").click(function () {
            parent.parent.closePopus();
        });

        $("#areaname").data('areaId', "all");

        _global.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: _queryData_page,
            cssPath: '../../../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
        });
        // _switchFiltrate();

        $("#search_text").keydown(function (event) {
            if (event.keyCode == 13) { //绑定回车
                _searchEventInfo();
            }
        });
        $("#policeCheck").bind('click', function () {
            _searchuserInfo();
        });
        $("#accountBusiness").one('click', function () {
            var params = {"DropDownName": "business"};
            post_async(params, _config.ajaxUrl.getOwnerDropDownUrl, _getaccountBusiness_callback);
        });

        $("#areaname").click(function () {
            parent.parent.popusStaManager('selectArea4');
        });
        $("#accountBusiness").click();
        $("#policeCheck").click();
    }

    function _searchEventInfo() {
        _searchuserInfo();
    }


    function _sure() {
        var param = {};
        var jsonData = parent.systemSetting.workstationManagement.getJsonData();
        console.log(JSON.stringify(jsonData));
        param.stationNum = jsonData.stationNum;
        param.userIdArry = _global.userIdArry;
        console.log(JSON.stringify(param));
        $('body').loading();
        post_async(param,_config.ajaxUrl.userDataTrans,callBackSure);
    }

    function callBackSure(data){
        $('body').removeLoading();
        console.log(JSON.stringify(data));
        if(data.code=='200'){
            parent.parent.alertSuccess("用户资料转发成功！", 2000);
            parent.parent.closePopus();
        }else{
            parent.parent.alertWarn("用户资料转发失败！", 2000);
            parent.parent.closePopus();
        }
    }

    //在勾选数组里添加
    function add_hookUserEvtId(UserId) {
        var addData = _global.userIdArry;
        if (addData > 0) {
            for (var i = 0; i < addData.length; i++) {
                var oJsonUserId = addData[i];
                if (UserId == oJsonUserId) {
                    break;
                }
                if (i == addData.length - 1) {
                    addData.push(UserId);
                }
            }
        } else {
            addData.push(UserId);
        }
        _global.userIdArry = addData;
        console.log(JSON.stringify(_global.userIdArry));

    }

    //在勾选数组里删除
    function del_hookUserEvtId(UserId) {
        var addData = _global.userIdArry;
        var index = null;
        for (var j = 0; j < addData.length; j++) {
            var oJsonUserId = addData[j];
            if (UserId == oJsonUserId) {
                index = j;
                break;
            } else {
                index = -1;
            }
        }
        console.log('index:' + index);
        addData.splice(index, 1);
        _global.userIdArry = addData;
        console.log(JSON.stringify(_global.userIdArry));

    }

    function _removeRow(eventNum) {
        if ($("#" + eventNum).length > 0) {
            $("#" + eventNum).remove();
            _pageRemove();
        }
        ;
    }

    function addTableRow(jsonData, isPre) {
        var row_json = jsonData;
        $div_row = $("<tr></tr>");
        $noChecked = $("<div></div>");
        $div_accountNum = $("<td></td>");
        $span = $('<span></span>')
        $div_accountName = $("<td></td>");
        $div_accountAddr = $("<td></td>");
        $div_rdClass = $("<td></td>");//新添加的字段，用户级别
        $div_contact = $("<td></td>");
        $div_payNO = $("<td></td>");
        $div_cPhone = $("<td></td>");
        $div_cMobile = $("<td></td>");
        $div_serverTypeName = $("<td></td>");
        $div_areaName = $("<td></td>");
        $div_accountTypeName = $("<td></td>");
        $platformName_title = $("<td></td>");
        $div_pnlTel = $("<td></td>");
        $div_operName = $("<td></td>");
        $div_createDate = $("<td></td>");
        $div_accountBusinessName = $("<td></td>");
        $div_business_subName = $("<td></td>");
        $div_pnlHdTel = $("<td></td>");
        $div_instDate = $("<td></td>");
        $div_fMemo = $("<td></td>");

        $div_row
            .append($div_accountNum)
            .append($div_accountName)
            .append($div_accountAddr)
            .append($div_rdClass)//新添加的字段，用户级别
            .append($div_contact)
            .append($div_payNO)
            .append($div_cPhone)
            .append($div_cMobile)
            .append($div_serverTypeName)
            .append($div_areaName)
            .append($div_accountTypeName)
            .append($platformName_title)
            .append($div_pnlTel)
            .append($div_operName)
            //我的注释：这是多出的一列
            //.append($div_createDate)//新添加的字段，录入时间---我修改之前就存在的注释
            .append($div_accountBusinessName)
            .append($div_business_subName)//新添加的字段，子行业
            .append($div_pnlHdTel)
            .append($div_instDate)
            .append($div_fMemo)

            .addClass('table_row')
            .attr('id', jsonData.userId);

        $noChecked.addClass('noChecked').data('key', row_json);
        $span.text(row_json.userId)
        $div_accountNum.append($noChecked).append($span).addClass("table_item_4").attr("title", row_json.userId);
        $div_accountName.addClass("table_item_userName").text(row_json.userName).attr("title", row_json.userName);
        $div_accountAddr.addClass("table_item_userName").text(row_json.userAddr).attr("title", row_json.userAddr);
        $div_rdClass.addClass("table_item_4").text(getUsrAlmType(row_json.usrAlmType)).attr("title", getUsrAlmType(row_json.usrAlmType));//新添加的字段，用户级别
        $div_contact.addClass("table_item_5").text(row_json.contact).attr("title", row_json.contact);
        $div_payNO.addClass("table_item_4").text(row_json.payNO).attr("title", row_json.payNO);
        $div_cPhone.addClass("table_item_5").text(row_json.cPhone).attr("title", row_json.cPhone);
        $div_cMobile.addClass("table_item_5").text(row_json.cMobile).attr("title", row_json.cMobile);
        $div_serverTypeName.addClass("table_item_4").text(row_json.userServerTypeName).attr("title", row_json.userServerTypeName);
        $div_areaName.addClass("table_item_4").text(row_json.areaName).attr("title", row_json.areaName);
        $div_accountTypeName.addClass("table_item_4").text(userTypeTranse(row_json.userType)).attr("title", userTypeTranse(row_json.userType));//用户类型，没有文字
        $platformName_title.addClass("table_item_5").text(row_json.platformName).attr("title", row_json.platformName);
        $div_pnlTel.addClass("table_item_4").text(row_json.pnlTel).attr("title", row_json.pnlTel);
        $div_operName.addClass("table_item_3").text(row_json.operName).attr("title", row_json.operName);
        //$div_createDate.addClass("table_item_3").text(row_json.createDate).attr("title", row_json.createDate);//新添加的字段，录入时间
        $div_accountBusinessName.addClass("table_item_4").text(row_json.businessName).attr("title", row_json.businessName);
        $div_business_subName.addClass("table_item_4").text(row_json.define1).attr("title", row_json.define1);//新添加的字段，子行业
        $div_pnlHdTel.addClass("table_item_4").text(row_json.pnlHdTel).attr("title", row_json.pnlHdTel);
        $div_instDate.addClass("table_item_4").text(row_json.instDate=="null"?"":row_json.instDate).attr("title", row_json.instDate=="null"?"":row_json.instDate);
        $div_fMemo.addClass("table_item_zoneNum").text(row_json.fMemo).attr("title", row_json.fMemo);

        if (isPre) {
            $div_row.prependTo($("#table_content"));
        } else {
            $div_row.appendTo($("#table_content"));
        }

        /*if(_global.checkNum==_global.maxCheckNum){
                $('#allCheck').removeClass('noChecked').addClass('isChecked');
        }*/

        for(var i = 0;i<_global.userIdArry.length;i++){
            var userId = _global.userIdArry[i];
            if(userId == jsonData.userId){
                $noChecked.removeClass('noChecked').addClass('isChecked');
                isAllCheck();
            }
        }

        $noChecked.bind('click', function (e) {
            var $this = $(this);
            var check = $this.hasClass('isChecked');
            if (check) {
                if ($('#allCheck').hasClass('isChecked')) {
                    $('#allCheck').removeClass('isChecked').addClass('noChecked');
                }
                $this.removeClass('isChecked').addClass('noChecked');
                del_hookUserEvtId($this.parent().parent().attr('id'));
            } else {
                $this.removeClass('noChecked').addClass('isChecked');
                add_hookUserEvtId($this.parent().parent().attr('id'));
                var all_row = $("#table_content .table_row").length;
                var ischeck = $("#table_content .isChecked").length;
                console.log("all_row:"+all_row+" ischeck:"+ischeck);
                if(all_row == ischeck){
                    $('#allCheck').removeClass('noChecked').addClass('isChecked');
                }
            }
        });

    }

    function isAllCheck(){
        var i = _global.checkNum;
        i++;
        _global.checkNum = i;
    }

    function getUsrAlmType(usrAlmType) {
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

    function userTypeTranse(userTypeId) {
        switch (userTypeId) {
            case 0:
                return "一般客户";
                break;
            case 1:
                return "机主";
                break;
            case 2:
                return "系统操作员";
                break;
            case 3:
                return "业务操作员";
                break;
            default:
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
        _global.getAlarmInfosParams.queryTond = queryTond;
        _global.getAlarmInfosParams.pageInfoPojo = pageInfoPojo;
        _global.getAlarmInfosParams.pageInfoPojo.currentPage = 1;
        _globalH.getAlarmInfosParams = _global.getAlarmInfosParams;
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
            //var pluginsPage = parent.pluginsPage();
            if (totalNum == 0)totalNum = -1;
            _global.plugins.page.setPage(totalPage, currentPage, totalNum);
            //pluginsPage.setPage(totalPage, currentPage, totalNum);
            _clearRow();
            if ($('#allCheck').hasClass('isChecked')) {
                $('#allCheck').removeClass('isChecked').addClass('noChecked');
            }
            var json = data.json;
            _global.checkNum = 1;
            _global.maxCheckNum = json.length;
            for (var i = 0; i < json.length; i++) {
                addTableRow(json[i]);
            }
            var all_row = $("#table_content .table_row").length;
            var ischeck = $("#table_content .isChecked").length;
            console.log("all_row:"+all_row+" ischeck:"+ischeck);
            if(all_row == ischeck && ischeck>0){
                $('#allCheck').removeClass('noChecked').addClass('isChecked');
            }

        } else {
            _clearRow();
        }
        $("#userInfoTab").colResizableY({
            liveDrag: true,
            gripInnerHtml: "<div></div>",
            draggingClass: "dragging",
            onResize: null,
            minWidth: 25
        });
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

    function _searchuserInfo() {
        var queryTond = {};
        var pageInfoPojo = {};
        queryTond.fuzzy = {};
        queryTond.fuzzy.fuzzyKey = $("#fuzzy").val();
        queryTond.fuzzy.fuzzyValue = $("#search_text").val();
        queryTond.areaId = $("#areaname").data('areaId');//$("#areaname").val() ;
        queryTond.businessId = $("#accountBusiness").val();
        queryTond.userServerType = "all";
        queryTond.nomRpt = "all";
        queryTond.timeStart = "";
        queryTond.timeEnt = "";
        pageInfoPojo.pageSize = "25";
        pageInfoPojo.sort = sortVal();
        _getAlarmInfos(queryTond, pageInfoPojo);
    }

    function sortVal() {
        var sort = "";
        if ($("#timePng").hasClass('timePngchange')) {
            sort = "userId|desc";//createDate
        }
        else {
            sort = "userId|ASC";
        }

        return sort;
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

    function _getaccountBusiness_callback(data) {
        var $option = $("<option></option>");
        for (var i = 0; i < data.dropDownPojo.length; i++) {
            var $option = $("<option></option>");
            $option.attr('value', data.dropDownPojo[i].key);
            $option.text(data.dropDownPojo[i].value);
            $option.appendTo($("#accountBusiness"));
        }
    }

    function _setAreaName(area) {
        if (area.name == '主目录') {
            $("#areaname").val("");
            $("#areaname").data('areaId', "all");
        }
        else {
            $("#areaname").val(area.name);
            var areaId = area.id;
            $("#areaname").data('areaId', areaId);
        }
    }
})(jQuery, window);

