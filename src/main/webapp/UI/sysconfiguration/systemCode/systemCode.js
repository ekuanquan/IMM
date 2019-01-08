

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
            //GetsystemCodeInfoUrl: '/IntegratedMM/sysCode/getSysCodeByCondition.do',
            listUrl:"/IntegratedMM/syscode/list.do",
            deleteUrl:"/IntegratedMM/syscode/delete.do"
        }
    };
    var _global = {
        plugins: {
            page: null
        },
        getsystemCodeInfosParams: /*{
            queryStr:'',
            pageInfoPojo: {
                pageSize:10,
                currentPage:1,
                totalNum: '',
                totalPage: ''

            }
        },*/
            {"fuzzy":{
                "key":"codeId", // 模糊查询字段列表，逗号分开
                "value":" "
            },
                "pagepojo": {
                    "currentPage":1,
                    "orderBy":" codeId|ASC",
                    "pageSize":25
                }},
        jsonData:''
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
        post_async(pararms, _config.ajaxUrl.listUrl, _callback_getsystemCodeInfos);
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
        //模糊搜索
        $("#contentRight_search_img").click(function () {
            var pararms = _global.getsystemCodeInfosParams;
            pararms.fuzzy.value = $("#contentRight_search_input").val();
            pararms.pagepojo.currentPage = 1;//每次查询返回首页
            post_async(pararms, _config.ajaxUrl.listUrl, _callback_getsystemCodeInfos);
        });
        //搜索绑定回车
        $("#contentRight_search_input").keydown(function (e) {
            if(e.keyCode == 13){
                var pararms = _global.getsystemCodeInfosParams;
                pararms.fuzzy.value = $(this).val();
                pararms.pagepojo.currentPage = 1;//每次查询返回首页
                post_async(pararms, _config.ajaxUrl.listUrl, _callback_getsystemCodeInfos);
            }
        });
        //修改
        $("#update").click(function () {
            var $isChecked = $(".row_isChecked");
            if($isChecked.length>0){
                parent.parent.systemCode('updatesysCode');
                //传递数据
                parent.parent.setsystemCodeJson(_global.jsonData);
            }
            else {
                parent.parent.alertTip("请先选择你所要修改的系统码",2000,null);
            }
        });
        //添加
        $("#add").click(function () {
            parent.parent.systemCode('addsysCode');
        });
        //删除
        $("#close").click(function () {
            var $isChecked = $(".row_isChecked");
            if($isChecked.length>0){
                parent.parent.comfireFloat("是否确认删除系统码"+_global.jsonData.codeId+"?",_closecodeId,null);
            }
            else {
                parent.parent.alertTip("请先选择你所要删除的系统码",2000,null);
            }
        });


    };
    /******************************************
    删除系统码
    *******************************************/
    function _closecodeId() {
        var params = {
            codeId:_global.jsonData.codeId
        };
        post_async(params,_config.ajaxUrl.deleteUrl,_callbackclose);
    }
    /******************************************
     删除系统码的回调
     *******************************************/
    function _callbackclose(data) {
        //var result = data.result;
        if(data.code == "200"){
            parent.parent.alertTip("删除成功",2000,_RefreshsystemCode);
        }
        else {
            parent.parent.alertTip("删除失败",2000,null);
        }
    }
        function _callback_getsystemCodeInfos(data) {
            var result = data.result;
            var pageInfoPojo = data.pageInfoPojo;
             var totalNum = pageInfoPojo.totalNum;
             var totalPage = pageInfoPojo.totalPage;
             var currentPage = pageInfoPojo.currentPage;
             if(totalNum == 0){totalNum =-1};
             _global.getsystemCodeInfosParams.pagepojo.currentPage = currentPage;
             //global.getsystemCodeInfosParams.pageInfoPojo.totalNum = totalNum;
             //_global.getsystemCodeInfosParams.pageInfoPojo.totalPage = totalPage;
             //var pluginsPage = parent.pluginsPage();
             _global.plugins.page.setPage(totalPage, currentPage, totalNum);
            if (result.code == "200") {
                _clearRow();
                var sysCodeList = data.syscode;
                for (var i = 0; i < sysCodeList.length; i++) {
                    addTableRow(sysCodeList[i]);
                }
            }
            else{
                _clearRow();
            }
            $("#table").colResizableY({
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
            $div_evtWatName=$("<td></td>");
            $div_codeType=$("<td></td>");
            $div_codeMemo=$("<td></td>");
            $div_userZone=$("<td></td>");
            $div_e_tail=$("<td></td>");
            $div_r_tail=$("<td></td>");
            $div_row
                .append($div_codeId)
                .append($div_evtWatName)
                .append($div_codeType)
                .append($div_codeMemo)
                .append($div_userZone)
                .append($div_e_tail)
                .append($div_r_tail)
                //.addClass('table_row')
               .attr('id', jsonData.codeId);
            var evtWatName=jsonData.evtWatName;
            var codeType=jsonData.codeType;
            var codeMemo=jsonData.codeMemo;
            var userZone=jsonData.userZone;
            var e_tail=jsonData.e_tail;
            var r_tail=jsonData.r_tail;
            if(evtWatName == null){evtWatName=""}
            if(codeType == null){codeType=""}
            if(codeMemo == null){codeMemo=""}
            if(userZone == null){userZone=""}
            if(e_tail == null){e_tail=""}
            if(r_tail == null){r_tail=""}
            $div_codeId.addClass("eventNum_title").text(jsonData.codeId).attr("title", jsonData.codeId);
            $div_evtWatName.addClass("eventNum_title").text(evtWatName).attr("title", evtWatName);
            $div_codeType.addClass("eventNum_title").text(codeType).attr("title", codeType);
            $div_codeMemo.addClass("eventNum_title6").text(codeMemo).attr("title", codeMemo);
            $div_userZone.addClass("eventNum_title").text(userZone).attr("title", userZone);
            $div_e_tail.addClass("eventNum_title").text(e_tail).attr("title", e_tail);
            $div_r_tail.addClass("eventNum_title").text(r_tail).attr("title", r_tail);
            $div_row.addClass("tbody_tr").appendTo("#table_content");
            //双击弹窗
            $div_row.bind('dblclick', function(e) {
                var $this = $(this);
                /*alert("222");*/
                parent.parent.systemCode('updatesysCode');
                //传递数据
                parent.parent.setsystemCodeJson(jsonData);
            });
            //单击改变样式
            $div_row.bind('click', function(e) {
                var $this = $(this);
                //console.log($this.attr('id'));
                if($this.hasClass('row_isChecked')) {
                    $this.removeClass('row_isChecked');
                } else {
                    $this.addClass('row_isChecked');
                    $this.siblings().removeClass('row_isChecked');
                    _global.jsonData = jsonData;
                }
            });

        }
    function _queryData_page(page) {
        _global.getsystemCodeInfosParams.pagepojo.currentPage = page;
        var pararms = _global.getsystemCodeInfosParams;
        post_async(pararms, _config.ajaxUrl.listUrl, _callback_getsystemCodeInfos);
    }
    function _RefreshsystemCode() {
        //_global.getsystemCodeInfosParams.pageInfoPojo.currentPage = page;
        var pararms = _global.getsystemCodeInfosParams;
        pararms.pagepojo.currentPage = 1;//每次查询返回首页
        pararms.fuzzy.value = $("#contentRight_search_input").val();
        post_async(pararms, _config.ajaxUrl.listUrl, _callback_getsystemCodeInfos);
    }
    function _clearRow() {
        $("#table_content").text('');
    }

}(window,jQuery));

