

charset = "utf-8";
$(document).ready(function () {
    init();
});

;(function ( window,$) {
    window.init = _init;
    window.goback =_goback;
    window.queryData_page = _queryData_page;//翻页
    window.Refreshsnmodel = _Refreshsnmodel;//刷新页面
    var _config = {
        ajaxUrl: {
            listUrl: '/IntegratedMM/snmodel/list.do',
            deleteUrl:"/IntegratedMM/snmodel/delete.do"
        }
    };
    var _global = {
        top:parent.parent,
        plugins: {
            page: null
        },
        getsnmodelInfosParams: {
            fuzzy:{
                key: "snModelId", // 模糊查询字段列表，逗号分开
                value:""
            },
            pagepojo: {
                pageSize:25,
                currentPage:1,
                orderBy:"snModelId|ASC"
            }
        },
        jsonData:'',
        flag:0,          //用于判断是否有数据被选中
        snModeldata:""//用于存选中行的数据
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
    /*********************************************
     事件初始化
     *********************************************/
    function _initEven() {
        _global.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: _queryData_page,
            cssPath:'../../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
        });
        /*********************************************************
         模糊搜索
         **********************************************************/
        $("#contentRight_search_img").bind("click",function (e) {
            var params = _global.getsnmodelInfosParams;
            params.fuzzy.value = $("#contentRight_search_input").val();
            params.pagepojo.currentPage = 1;
            post_async(params, _config.ajaxUrl.listUrl, _callback_getsnmodelInfos);
        });
        //模糊搜索绑定回车
        $("#contentRight_search_input").keydown(function(event){
            if(event.keyCode == 13){ //绑定回车
                var params = _global.getsnmodelInfosParams;
                params.fuzzy.value = $(this).val();
                params.pagepojo.currentPage = 1;
                post_async(params, _config.ajaxUrl.listUrl, _callback_getsnmodelInfos);
            }
        });
        //添加
        $("#add").bind("click",function () {
            _global.top.systemCode('adddetectorType');
        });
        //修改
        $("#update").bind("click",function () {
            if($("#table_content tr").hasClass("row_isChecked")){
                _global.top.systemCode('alterdetectorType');
                //传递数据
                _global.top.setsnModelTypeJson(_global.snModeldata);
            }
            else {
                _global.top.alertTip("请先选择要修改的探测器数据！",2000,null);
            }
        });
        //删除
        $("#close").bind("click",function () {
            if($("#table_content tr").hasClass("row_isChecked")){
                _global.top.comfireFloat("是否确认删除探测器" +_global.snModeldata.snModelId+"?",deletedata,null);
            }
            else{
                _global.top.alertTip("请先选择要删除探测器！",2000,null);
            }
        });
    }
    //请求
    function _goback(){
        var pararms = _global.getsnmodelInfosParams;
        post_async(pararms, _config.ajaxUrl.listUrl, _callback_getsnmodelInfos);
    }
    /***************************************************
     删除设备
     ****************************************************/
    function deletedata() {
        post_async({"snModelId":_global.snModeldata.snModelId},_config.ajaxUrl.deleteUrl,_callbackdel)
    }
    function _callbackdel(data) {
        if(data.code == "200"){
            _global.top.alertTip("删除成功",2000,_devModellist);
        }
        else {
            _global.top.alertTip("删除失败",2000,null);
        }
    }
    /******************************************************
     刷新列表（不清空模糊搜索）
     *****************************************************/
    function _devModellist() {
        var params = _global.getsnmodelInfosParams;
        params.fuzzy.value = $("#contentRight_search_input").val();
        post_async(params, _config.ajaxUrl.listUrl,_callback_getsnmodelInfos);
    }
    /***************************************************
     获取列表的回调函数
     ****************************************************/
    function _callback_getsnmodelInfos(data) {
        var result = data.result;
        var pageInfoPojo = data.pageInfoPojo;
        var totalNum = pageInfoPojo.totalNum;
        var totalPage = pageInfoPojo.totalPage;
        var currentPage = pageInfoPojo.currentPage;
        if(totalNum == 0){totalNum=-1};//当数据的数量为零时，显示查询无结果
        _global.getsnmodelInfosParams.pagepojo.currentPage = currentPage;
        //_global.getsnmodelInfosParams.pagepojo.totalNum = totalNum;
        //_global.getsnmodelInfosParams.pagepojo.totalPage = totalPage;
        //var pluginsPage = parent.pluginsPage();
        _global.plugins.page.setPage(totalPage, currentPage, totalNum);
        if (result.code == "200") {
            _clearRow();
            //var devModel = data.devModel;
            for (var i = 0; i < data.devModel.length; i++) {
                addTableRow(data.devModel[i]);
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
    /***************************************************
     构建列表
     ****************************************************/
    function addTableRow(jsonData) {
        _global.jsonData = jsonData;
        $div_row = $("<tr></tr>");

        $div_snModelId=$("<td></td>");
        $div_snModelName=$("<td></td>");
        $div_snMemo=$("<td></td>");
        $div_snKind=$("<td></td>");
        $div_buyPrice=$("<td></td>");
        $div_servicePrice=$("<td></td>");
        $div_almType=$("<td></td>");
        $div_wantDo=$("<td></td>");

        $div_row
            .append($div_snModelId)
            .append($div_snModelName)
            .append($div_snMemo)
            .append($div_snKind)
            .append($div_buyPrice)
            .append($div_servicePrice)
            .append($div_almType)
            .append($div_wantDo);
        //.addClass('table_row')
        //.attr('id', jsonData.devModelId);
        $div_snModelId.addClass("eventNum_title").text(jsonData.snModelId).attr("title", jsonData.snModelId);
        $div_snModelName.addClass("eventNum_title").text(jsonData.snModelName).attr("title", jsonData.snModelName);
        $div_snMemo.addClass("eventNum_title").text(jsonData.snMemo).attr("title", jsonData.snMemo);
        $div_snKind.addClass("eventNum_title6").text(jsonData.snKind).attr("title", jsonData.snKind);
        $div_buyPrice.addClass("eventNum_title").text(jsonData.buyPrice).attr("title", jsonData.buyPrice);
        $div_servicePrice.addClass("eventNum_title").text(jsonData.servicePrice).attr("title", jsonData.servicePrice);
        $div_almType.addClass("eventNum_title").text(jsonData.almTypeName).attr("title", jsonData.almTypeName);
        $div_wantDo.addClass("eventNum_title").text(jsonData.wantDoName).attr("title", jsonData.wantDoName);
        $div_row.addClass("tbody_tr").appendTo("#table_content");
        //双击弹窗
        $div_row.bind('dblclick', function(e) {
            var $this = $(this);
            _global.top.systemCode('alterdetectorType');
            //传递数据
            _global.top.setsnModelTypeJson(jsonData);
        });
        //单击改变样式
        $div_row.bind('click', function(e) {
            var $this = $(this);
            console.log($this.attr('id'));
            if($this.hasClass('row_isChecked')) {
                $this.removeClass('row_isChecked');
                _global.flag = 0;
            } else {
                $this.addClass('row_isChecked');
                $this.siblings().removeClass('row_isChecked');
                _global.flag = 1;
                _global.snModeldata = jsonData;
            }

        });

    }
    /***********************************
     翻页函数
     *********************************/
    function _queryData_page(page) {
        _global.getsnmodelInfosParams.pagepojo.currentPage = page;
        var pararms = _global.getsnmodelInfosParams;
        post_async(pararms, _config.ajaxUrl.listUrl, _callback_getsnmodelInfos);
    }
    /***********************************
     清空列表（清空模糊搜索）
     *********************************/
    function _clearRow() {
        $("#table_content").text('');
    }
    /***********************************
     刷新
     *********************************/
    function _Refreshsnmodel() {
        var pararms = _global.getsnmodelInfosParams;
        pararms.fuzzy.value ="";
        $("#contentRight_search_input").text("");
        post_async(pararms, _config.ajaxUrl.listUrl, _callback_getsnmodelInfos);
    }

}(window,jQuery));

