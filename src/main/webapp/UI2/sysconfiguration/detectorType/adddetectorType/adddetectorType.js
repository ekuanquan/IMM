/**
 * Created by 123 on 2017/8/17.
 */
charset = "utf-8";
$(document).ready(function () {
    init();
});
;(function(window, $) {
    window.init =_init;

    var _config = {
        ajaxUrl: {
            type: "POST",
            async: false,
            adddevTypeUrl:"/IntegratedMM/snmodel/add.do",
            QuerySntypeListUrl:"/IntegratedMM/QuerySntypeList.do",//探头类型下拉
            QueryAlmtypeListUrl:"/IntegratedMM/QueryAlmtypeList.do",//警情类型下拉
            QueryWanttoListUrl:"/IntegratedMM/QueryWanttoList.do"//反应类型下拉

        }
    };
    _global = {
        plugins: {
            page: null
        },
        rowdata:'',
        devModelPojo: {
            snModelId:"", // 探测器型号编号
            snModelName:"", // 探测器型号名称
            snMemo:"", // 探测器用途
            snKind:"",// 字段解释未知
            buyPrice:"", //探测器价格
            servicePrice:"",// 服务费用
            wantDo:"", // 反应类型
            almType:"" // 警情类型
        }

    };

    /*********************************************
     初始化
     *********************************************/
    function _init() {
        _initData();
        _initEven();
    }
    function _initData() {
        _getTypeinfos();
    }
    function _initEven() {
         //关闭窗口点击事件
        $("#close,#remove").click(function () {
            parent.parent.closePopus();
        });
         //保存点击事件
        $("#sure").click(function () {
            getAmendsyscodeInfo();
        });
    }
    /************************************************
     获取下拉数据222
     ************************************************/
    function _getTypeinfos() {
        post_async(null,_config.ajaxUrl.QuerySntypeListUrl,_callback_QuerySntypeList);//探头类型下拉
        post_async(null,_config.ajaxUrl.QueryAlmtypeListUrl,_callback_QueryAlmtypeList);//警情类型下拉
        post_async(null,_config.ajaxUrl.QueryWanttoListUrl,_callback_QueryWanttoList);//反应类型下拉
    }
    /************************************************
     获取探头类型下拉数据
     ************************************************/
    function _callback_QuerySntypeList(data) {
        var $option = $("<option></option>");
        $option.attr('value',-1);
        $option.text("");
        $option.appendTo($("#snKind"));
        for (var i = 0;i<data.result.length;i++){
            var $option = $("<option></option>");
            $option.attr('value',data.result[i].snType);
            $option.text(data.result[i].snTypeName);
            $option.appendTo($("#snKind"));
        }
    }
    /************************************************
     获取反应类型下拉数据
     ************************************************/
    function _callback_QueryWanttoList(data) {
        var $option = $("<option></option>");
        $option.attr('value',-1);
        $option.text("");
        $option.appendTo($("#wantDo"));
        for (var i = 0;i<data.result.length;i++){
            var $option = $("<option></option>");
            $option.attr('value',data.result[i].wantDo);
            $option.text(data.result[i].wantDoName);
            $option.appendTo($("#wantDo"));
        }
    }
    /************************************************
     获取警情类型下拉数据
     ************************************************/
    function _callback_QueryAlmtypeList(data) {
        var $option = $("<option></option>");
        $option.attr('value',-1);
        $option.text("");
        $option.appendTo($("#almType"));
        for (var i = 0;i<data.result.length;i++){
            var $option = $("<option></option>");
            $option.attr('value',data.result[i].almType);
            $option.text(data.result[i].almTypeName);
            $option.appendTo($("#almType"));
        }
    }
    /************************************************
     获取页面数据222
     ************************************************/
    function getAmendsyscodeInfo() {
        var params = {};
        params = _global.devModelPojo;
        params.snModelId=$("#snModelId").val();
        params.snModelName=$("#snModelName").val();
        params.snKind=$("#snKind").val();
        params.buyPrice=$("#buyPrice").val();
        params.servicePrice=$("#servicePrice").val();
        params.wantDo=$("#wantDo").val();
        params.almType=$("#almType").val();
        params.snMemo=$("#snMemo").val();
        post_async(params,_config.ajaxUrl.adddevTypeUrl,callbackupdate);

    }
    /******************************************
     保存数据的回调函数
     *******************************************/
    function callbackupdate(data) {
        if(data.code == '200'){
            parent.parent.alertTip("添加成功",2000,_snmodellist);
        }
        else {
            parent.parent.alertTip("添加失败",2000,null);
        }
    }
    /******************************************
     刷新系统码列表
     *******************************************/
    function _snmodellist() {
        parent.parent.add_snmodellist();
        parent.parent.closePopus();
    }

}(window, jQuery))
