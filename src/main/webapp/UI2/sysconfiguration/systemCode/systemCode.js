

charset = "utf-8";
$(document).ready(function () {
    init();
});

;(function ( window,$) {
    /*window.resizeDocment = _resizeDocment;//修改页面大小*/
    window.init = _init;//修改页面大小
    window.goback =_goback;
    window.queryData_page = _queryData_page;//刷新页面
   /* window.getparamsInfos = _getparamsInfos;*/
    var _config = {
        ajaxUrl: {
            GetsystemCodeInfoUrl: '/IntegratedMM/sysCode/getSysCodeByCondition.do',
        }
    };
    var _global = {
        plugins: {
            page: null
        },
        getsystemCodeInfosParams: {
            queryStr:'',
            pageInfoPojo: {
                pageSize:10,
                currentPage:1,
                totalNum: '',
                totalPage: ''

            }
        },
    };

    /*********************************************
     初始化
     *********************************************/
    function _init() {
        _initData();
        _initEven();

    }
    /*********************************************
     数据初始化
     *********************************************/
    function _initData() {
        _goback();
    }
    //请求
    function _goback() {
        var pararms = _global.getsystemCodeInfosParams;
        post_async(pararms, _config.ajaxUrl.GetsystemCodeInfoUrl, _callback_getsystemCodeInfos);
    }
    /*********************************************
     事件初始化
     *********************************************/
    function _initEven() {
        _global.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: _queryData_page,
            cssPath:'../../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
        });

    }
        function _callback_getsystemCodeInfos(data) {
            var result = data.result;
             var pageInfoPojo = data.pageInfoPojo;
             var totalNum = pageInfoPojo.totalNum;
             var totalPage = pageInfoPojo.totalPage;
             var currentPage = pageInfoPojo.currentPage;
             _global.getsystemCodeInfosParams.pageInfoPojo.currentPage = currentPage;
             _global.getsystemCodeInfosParams.pageInfoPojo.totalNum = totalNum;
             _global.getsystemCodeInfosParams.pageInfoPojo.totalPage = totalPage;
             //var pluginsPage = parent.pluginsPage();
             _global.plugins.page.setPage(totalPage, currentPage, totalNum);
            if (result.code == "200") {
                _clearRow();
                var sysCodeList = data.sysCodeList;
                for (var i = 0; i < sysCodeList.length; i++) {
                    addTableRow(sysCodeList[i]);
                }
            }
            else{
                _clearRow();
            }
            $("#table").colResizable({
                liveDrag:true,
                gripInnerHtml:"<div></div>",
                draggingClass:"dragging",
                onResize:null,
                minWidth:25
            });
        }
        function addTableRow(jsonData) {
            $div_row = $("<tr></tr>");

            $div_codeId=$("<td></td>");
            $div_evtWayName=$("<td></td>");
            $div_codeType=$("<td></td>");
            $div_codeMemo=$("<td></td>");
            $div_userZone=$("<td></td>");
            $div_e_tail=$("<td></td>");
            $div_r_tail=$("<td></td>");

            $div_row
                .append($div_codeId)
                .append($div_evtWayName)
                .append($div_codeType)
                .append($div_codeMemo)
                .append($div_userZone)
                .append($div_e_tail)
                .append($div_r_tail);
                //.addClass('table_row')
               // .attr('id', jsonData.codeId);
            $div_codeId.addClass("eventNum_title").text(jsonData.codeId).attr("title", jsonData.codeId);
            $div_evtWayName.addClass("eventNum_title").text(jsonData.evtWayName).attr("title", jsonData.evtWayName);
            $div_codeType.addClass("eventNum_title").text(jsonData.codeType).attr("title", jsonData.codeType);
            $div_codeMemo.addClass("eventNum_title6").text(jsonData.codeMemo).attr("title", jsonData.codeMemo);
            $div_userZone.addClass("eventNum_title").text(jsonData.userZone).attr("title", jsonData.userZone);
            $div_e_tail.addClass("eventNum_title").text(jsonData.e_tail).attr("title", jsonData.e_tail);
            $div_r_tail.addClass("eventNum_title").text(jsonData.r_tail).attr("title", jsonData.r_tail);
            $div_row.addClass("tbody_tr").appendTo("#table_content");
            //双击弹窗
            $div_row.bind('dblclick', function(e) {
                var $this = $(this);
                /*alert("222");*/
                parent.parent.systemCode('sysCode');
                //传递数据
                parent.parent.setsystemCodeJson(jsonData);
            });
            //单击改变样式
            $div_row.bind('click', function(e) {
                var $this = $(this);
                console.log($this.attr('id'));
                if($this.hasClass('row_isChecked')) {
                    $this.removeClass('row_isChecked');
                } else {
                    $this.addClass('row_isChecked');
                    $this.siblings().removeClass('row_isChecked');
                }
            });

        }
    function _queryData_page(page) {
        _global.getsystemCodeInfosParams.pageInfoPojo.currentPage = page;
        var pararms = _global.getsystemCodeInfosParams;
        post_async(pararms, _config.ajaxUrl.GetsystemCodeInfoUrl, _callback_getsystemCodeInfos);
    }
    function _clearRow() {
        $("#table_content").text('');
    }

}(window,jQuery));

