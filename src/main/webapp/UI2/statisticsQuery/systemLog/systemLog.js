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
    window.searchEventInfo = _searchEventInfo;
    window.queryData_page = _queryData_page;
    window.getPageInfo = _getPageInfo;
    var _config = {
        minWidth: 800,
        minHeight: 765,
        ajaxUrl: {
            GetDailyUrl: '/IntegratedMM/query/QueryLogList.do'
        }
    };
    var _global = {
        top: parent.parent,
        up: parent,
        plugins: {
            page: null
        },
        getDailyParams: {
            strdate:"",
            pageInfoPojo: {
                currentPage: '1',
                pageSize: '25',
                sort: 'strdate|ASC',
                totalNum: '',
                totalPage: ''

            }
        }
    };
    var _globalH = {
        getDailyParams: {
            strdate:"",
            pageInfoPojo: {
                currentPage: '1',
                pageSize: '25',
                sort: 'strdate|ASC',
                totalNum: '',
                totalPage: ''

            }
        }
    };
    function _init() {
        _initData();
        _initEven();
    }

    function _initData() {
        var nowTime = getNowFormatDate();
        var startTime = getBeforeFormatDate();
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

        //默认加载数据
        _searchEventInfo();
    }

    function _initEven() {
        _global.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: _queryData_page,
            cssPath: '../../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
        });
        $(".timeorder").click(function(){
            $("#timePng").toggleClass("timePngchange");
            _getAlarmInfosH()();
        });

        $("#policeCheck").click(function(){
            _searchEventInfo();
        });
    }

    function addTableRow(jsonData, isPre) {
        var row_json = jsonData;//转换原始数据与显示的数据
        $div_row = $("<tr></tr>");
        $div_dailyId = $("<td></td>");
        $div_strdate = $("<td></td>");
        $div_operationContent = $("<td></td>");
        $div_userName = $("<td></td>");

        $div_row
            .append($div_dailyId)
            .append($div_strdate)
            .append($div_operationContent)
            .append($div_userName)
            .addClass('table_row')
            .attr('id', row_json.id);

        $div_dailyId.addClass("eventNum_title").text(row_json.id).attr("title", row_json.id);
        $div_strdate.addClass("eventNum_title").text(row_json.strdate.replace("T"," ")).attr("title", row_json.strdate);
        $div_operationContent.addClass("usrAlmType_title").text(row_json.operationContent).attr("title", row_json.operationContent);
        $div_userName.addClass("accountNum_title").text(row_json. userName).attr("title", row_json.userName);

        if (isPre) {
            $div_row.prependTo($("#table_content"));
        } else {
            $div_row.appendTo($("#table_content"));
        }
    }

    function _getDailyParams() {
        var time = $("#startTime").val()+";"+$("#endTime").val();
        _global.getDailyParams.strdate = time.replace(" ","T");
        _global.getDailyParams.strdate = _global.getDailyParams.strdate.replace(" ","T");
        var params = {};
        params.pageInfoPojo = {};
        params.strdate = _global.getDailyParams.strdate;
        params.pageInfoPojo.currentPage = _global.getDailyParams.pageInfoPojo.currentPage;
        params.pageInfoPojo.sort = sortVal();
        params.pageInfoPojo.pageSize = _global.getDailyParams.pageInfoPojo.pageSize;
        return params;
    }
    /*修改升降序*/
    function sortVal() {
        var sort="";
        if($("#timePng").hasClass('timePngchange')){
            sort="strdate|DESC";
        }
        else{
            sort="strdate|ASC";
        }
        return sort;
    }

    function _searchEventInfo() {
        _global.getDailyParams.pageInfoPojo.currentPage = 1;
        $('body').loading();
        var param = _getDailyParams();
        var params = {
            "strdate":param.strdate ,
            "pageInfoPojo": {
                "currentPage": param.pageInfoPojo.currentPage,
                "sort": param.pageInfoPojo.sort,
                "pageSize": param.pageInfoPojo.pageSize}
        };
        _globalH.getAlarmInfosParams=_global.getAlarmInfosParams;
        post_async(params, _config.ajaxUrl.GetDailyUrl, _callback_getDailyInfos);
    }
    function _getAlarmInfosH() {
        _global.getDailyParams=_globalH.getDailyParams;
        $('body').loading();
        var param = _getDailyParams();
        var params = {
            "strdate":param.strdate ,
            "pageInfoPojo": {
                "currentPage": param.pageInfoPojo.currentPage,
                "sort": param.pageInfoPojo.sort,
                "pageSize": param.pageInfoPojo.pageSize}
        };
        post_async(params, _config.ajaxUrl.GetDailyUrl, _callback_getDailyInfos);
    }

    function _callback_getDailyInfos(data) {
       /* $("body").removeLoading();
        $("#content").scrollLeft(0).scrollTop(0);*/
        var result = data.result;
        $('body').removeLoading();
        if (result.code == 0) {
            var pageInfoPojo = data.pageInfoPojo;
            var totalNum = pageInfoPojo.totalNum;
            var totalPage = pageInfoPojo.totalPage;
            var currentPage = pageInfoPojo.currentPage;
            _global.getDailyParams.pageInfoPojo.currentPage = currentPage;
            _global.getDailyParams.pageInfoPojo.totalNum = totalNum;
            _global.getDailyParams.pageInfoPojo.totalPage = totalPage;
            if(totalNum==0)totalNum=-1;
            _global.plugins.page.setPage(totalPage, currentPage, totalNum);
            _clearRow();
            var List = data.List;
            for (var i = 0; i < List.length; i++) {
                addTableRow(List[i]);
            }

        } else {
            _clearRow();
        }
    }

    function _clearRow() {
        $("#table_content").text('');
    }

    function _queryData_page(page) {
        _global.getDailyParams.pageInfoPojo.currentPage = page;
        $('body').loading();
        var params = _getDailyParams();
        post_async(params, _config.ajaxUrl.GetDailyUrl, _callback_getDailyInfos);
    }

    function _getPageInfo() {
        return _global.getDailyParams.pageInfoPojo;
    }


})(jQuery, window);

