

charset = "utf-8";
$(document).ready(function () {
    init();
});

;(function ( window,$) {
    window.init = _init;
    window.goback =_goback;
    window.queryData_page = _queryData_page;//翻页
    window.RefreshdevType = _RefreshdevType;//刷新页面
    var _config = {
        ajaxUrl: {
            listUrl: '/IntegratedMM/devmodel/list.do',
            deleteUrl:"/IntegratedMM/ devmodel /delete.do"
        }
    };
    var _global = {
        top:parent.parent,
        plugins: {
            page: null
        },
        getequipmentTypeInfosParams: {
            fuzzy:{
                key:"devModelId",
                value:""
            },
            pagepojo: {
                pageSize:25,
                currentPage:1,
                orderBy:"devModelId|ASC"
            }
        },
        jsonData:'',
        flag:0,          //用于判断是否有数据被选中
        devModelId:"",
        devModeldata:""     //用于存储选择的数据信息
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
        //获取列表显示数据
        _goback();
    }
    //请求
    function _goback() {
        var pararms = _global.getequipmentTypeInfosParams;
        post_async(pararms, _config.ajaxUrl.listUrl, _callback_getequipmentTypeInfos);
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
            var params = _global.getequipmentTypeInfosParams;
            _global.getequipmentTypeInfosParams.pagepojo.currentPage="1";
            params.fuzzy.value = $("#contentRight_search_input").val();
            post_async(params, _config.ajaxUrl.listUrl, _callback_getequipmentTypeInfos);
        });
        //模糊搜索绑定回车
        $("#contentRight_search_input").keydown(function(event){
            if(event.keyCode == 13){ //绑定回车
                var params = _global.getequipmentTypeInfosParams;
                _global.getequipmentTypeInfosParams.pagepojo.currentPage="1";
                params.fuzzy.value = $(this).val();
                post_async(params, _config.ajaxUrl.listUrl, _callback_getequipmentTypeInfos);
            }
        });
        //添加
        $("#add").bind("click",function () {
            _global.top.systemCode('adddevModelType');
        });
        //修改
        $("#update").bind("click",function () {
            if(_global.flag == 0){
                _global.top.alertTip("请先选择要修改的设备！",2000,null);
            }else {
                _global.top.systemCode('alterdevModelType');
                //传递数据
                _global.top.setdevModelTypeJson(_global.devModeldata);
            }

        });
        //删除
        $("#close").bind("click",function () {
            if(_global.flag == 0){
                _global.top.alertTip("请先选择要删除的设备！",2000,null);
            }
            else{
                _global.top.alertFail("是否确认删除设备" +_global.devModeldata.devModelId+"?",null,deletedata);
            }
        });

    }
    /***************************************************
     删除设备
     ****************************************************/
    function deletedata() {
        post_async({"devModelId":_global.devModeldata.devModelId},_config.ajaxUrl.deleteUrl,callbackdel)
    }
    function callbackdel(data) {
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
        var params = _global.getequipmentTypeInfosParams;
        params.fuzzy.value = $("#contentRight_search_input").val();
        post_async(params, _config.ajaxUrl.listUrl, _callback_getequipmentTypeInfos);
    }
    /***************************************************
     获取列表的回调函数
     ****************************************************/
        function _callback_getequipmentTypeInfos(data) {
            var result = data.result;
             var pageInfoPojo = data.pageInfoPojo;
             var totalNum = pageInfoPojo.totalNum;
             var totalPage = pageInfoPojo.totalPage;
             var currentPage = pageInfoPojo.currentPage;
             if(totalNum == 0){totalNum=-1};//当数据的数量为零时，显示查询无结果
             _global.getequipmentTypeInfosParams.pagepojo.currentPage = currentPage;
             //_global.getequipmentTypeInfosParams.pagepojo.totalNum = totalNum;
             //_global.getequipmentTypeInfosParams.pagepojo.totalPage = totalPage;
             //var pluginsPage = parent.pluginsPage();
             _global.plugins.page.setPage(totalPage, currentPage, totalNum);
            if (result.code == "200") {
                _clearRow();
                var devModel = data.devModel;
                for (var i = 0; i < devModel.length; i++) {
                    addTableRow(devModel[i]);
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

            $div_devModelId=$("<td></td>");
            $div_devModelName=$("<td></td>");
            $div_devType=$("<td></td>");
            $div_zoneNum=$("<td></td>");
            $div_ZoneNumEx=$("<td></td>");
            $div_CodeWayId_42=$("<td></td>");
            $div_CodeWayId_FSK=$("<td></td>");
            $div_prog_type=$("<td></td>");

            $div_row
                .append($div_devModelId)
                .append($div_devModelName)
                .append($div_devType)
                .append($div_zoneNum)
                .append($div_ZoneNumEx)
                .append($div_CodeWayId_42)
                .append($div_CodeWayId_FSK)
                .append($div_prog_type)
                //.addClass('table_row')
                .attr('id', jsonData.devModelId);
            $div_devModelId.addClass("eventNum_title").text(jsonData.devModelId).attr("title", jsonData.devModelId);
            $div_devModelName.addClass("eventNum_title").text(jsonData.devModelName).attr("title", jsonData.devModelName);
            $div_devType.addClass("eventNum_title").text(jsonData.devTypeName).attr("title", jsonData.devTypeName);
            $div_zoneNum.addClass("eventNum_title6").text(jsonData.zoneNum).attr("title", jsonData.zoneNum);
            $div_ZoneNumEx.addClass("eventNum_title").text(jsonData.ZoneNumEx).attr("title", jsonData.ZoneNumEx);
            var CodeWayId_42 = "";
            CodeWayId_42 = jsonData.CodeWayId_42;
            if(jsonData.CodeWayId_42 == -1){
                CodeWayId_42 = "默认"
            }
            $div_CodeWayId_42.addClass("eventNum_title").text(CodeWayId_42).attr("title", CodeWayId_42);
            var CodeWayId_FSK = "";
            CodeWayId_FSK = jsonData.CodeWayId_42;
            if(jsonData.CodeWayId_42 == -1){
                CodeWayId_FSK = "默认"
            }
            $div_CodeWayId_FSK.addClass("eventNum_title").text(CodeWayId_FSK).attr("title", CodeWayId_FSK);
            var prog_type = "";
            prog_type = jsonData.CodeWayId_42;
            if(jsonData.CodeWayId_42 == -1){
                prog_type = "默认"
            }
            $div_prog_type.addClass("eventNum_title").text(prog_type).attr("title", prog_type);
            $div_row.addClass("tbody_tr").appendTo("#table_content");
            //双击弹窗
            $div_row.bind('dblclick', function(e) {
                var $this = $(this);
                _global.top.systemCode('alterdevModelType');
                //传递数据
                _global.top.setdevModelTypeJson(jsonData);
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
                    _global.devModeldata = jsonData;
                }

            });

        }
    /***********************************
     翻页函数
     *********************************/
    function _queryData_page(page) {
        _global.getequipmentTypeInfosParams.pagepojo.currentPage = page;
        var pararms = _global.getequipmentTypeInfosParams;
        post_async(pararms, _config.ajaxUrl.listUrl, _callback_getequipmentTypeInfos);
    }
    /***********************************
    清空列表
    *********************************/
    function _clearRow() {
        $("#table_content").text('');
    }
    /***********************************
     刷新
     *********************************/
    function _RefreshdevType() {
        var pararms = _global.getequipmentTypeInfosParams;
        pararms.fuzzy.value ="";
        $("#contentRight_search_input").text("");
        post_async(pararms, _config.ajaxUrl.listUrl, _callback_getequipmentTypeInfos);
    }

}(window,jQuery));

