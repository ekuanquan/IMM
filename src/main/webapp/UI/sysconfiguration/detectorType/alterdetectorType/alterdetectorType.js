/**
 * Created by 123 on 2017/8/17.
 */
charset = "utf-8";

var rowdata = parent.parent.parent.getsnModelTypeJson();
$(document).ready(function () {
    $("#form").Validform({
        tiptype:2,
        btnSubmitId:"sure",
        callback:sure
    });
    init();
});
;(function(window, $) {
    window.init =_init;
    window.sure = _sure;

    var _config = {
        ajaxUrl: {
            type: "POST",
            async: false,
            updateUrl:"/IntegratedMM/snmodel/update.do",//修改探头型号
            QuerySntypeListUrl:"/IntegratedMM/QuerySntypeList.do",//探头类型下拉
            QueryAlmtypeListUrl:"/IntegratedMM/QueryAlmtypeList.do",//警情类型下拉
            QueryWanttoListUrl:"/IntegratedMM/QueryWanttoList.do",//反应类型下拉
            findByKeyUrl:"/IntegratedMM/snmodel/findByKey.do"      //根据snmodel获取探头型号信息

        }
    };
    _global = {
        plugins: {
            page: null
        },
        rowdata:'',
        snModelIdPojo: {
            "oldSnModelId":"", // 旧探测器型号编号
            "newSnModelId":"", // 新探测器型号编号
            "snModelName":"", // 探测器型号名称
            "snMemo":"", // 探测器用途
            "snKind":"", // 字段解释未知
            "buyPrice":"", //探测器价格
            "servicePrice":"",// 服务费用
            "wantDo":"", // 反应类型
            "almType":"" // 警情类型
        },
        data:""

    };

    /*********************************************
     初始化
     *********************************************/
    function _init() {
        _initData();
        _initEven();

    }
    function _initData() {
        //获取界面数据
        getsysCodeInfo();
        //获取下拉数据
        _getTypeinfos();

    }
    function _initEven() {
         //关闭窗口点击事件
        $("#close,#remove").click(function () {
            parent.parent.closePopus();
        });

    }
    /*********************************************************************
     根据snModelId获取界面数据
     *********************************************************************/
    function getsysCodeInfo() {
        var params = rowdata.snModelId;
        var para = {"snModelId":params};
        post_async(para,_config.ajaxUrl.findByKeyUrl,_callback_CodeBysnModelId);
    }
    /*********************************************************************
     根据snModelId获取界面数据的回调
     *********************************************************************/
    function _callback_CodeBysnModelId(data) {
        var result=data.result;
        _global.data=data;
        if(result.code == "200"){
            $("#snModelId").val(data.devModel[0].snModelId);
            $("#snModelName").val(data.devModel[0].snModelName);
            $("#buyPrice").val(data.devModel[0].buyPrice);
            $("#servicePrice").val(data.devModel[0].servicePrice);
            $("#snMemo").val(data.devModel[0].snMemo);
            $("#wantDo").append("<option value='"+data.devModel[0].wantDo+"'>"+data.devModel[0].wantDoName+"</option>");
            $("#almType").append("<option value='"+data.devModel[0].almType+"'>"+data.devModel[0].almTypeName+"</option>");
            $("#snKind").append("<option value='"+data.devModel[0].snKind+"'>"+data.devModel[0].snTypeName+"</option>");
        }

    }
    /************************************************
     获取下拉数据222
     ************************************************/
    function _getTypeinfos() {
        $("#wantDo").one("click",function () {
            post_async(null,_config.ajaxUrl.QueryWanttoListUrl,_callback_QueryWanttoList);//反应类型下拉
        });
        $("#almType").one("click",function () {
            post_async(null,_config.ajaxUrl.QueryAlmtypeListUrl,_callback_QueryAlmtypeList);//警情类型下拉
        });
        $("#snKind").one("click",function () {
            post_async(null,_config.ajaxUrl.QuerySntypeListUrl,_callback_QuerySntypeList);//探头类型下拉
        });


    }
    /************************************************
     获取探头类型下拉数据
     ************************************************/
    function _callback_QuerySntypeList(data) {
        for (var i = 0;i<data.result.length;i++){
            if(data.result[i].snType ==_global.data.devModel[0].snKind){continue;}
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
        for (var i = 0;i<data.result.length;i++){
            if(data.result[i].wantDo ==_global.data.devModel[0].wantDo){continue;}
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
        for (var i = 0;i<data.result.length;i++){
            if(data.result[i].almType ==_global.data.devModel[0].almType){continue;}
            var $option = $("<option></option>");
            $option.attr('value',data.result[i].almType);
            $option.text(data.result[i].almTypeName);
            $option.appendTo($("#almType"));
        }
    }
    /************************************************
     获取页面数据222
     ************************************************/
    function _getsnModelInfo() {
        var params = {};
        params = _global.snModelIdPojo;
        params.oldSnModelId=parseInt(rowdata.snModelId);
        params.newSnModelId=parseInt($("#snModelId").val());
        params.snModelName=$("#snModelName").val();
        params.snKind=$("#snKind").val();
        params.buyPrice=$("#buyPrice").val();
        params.servicePrice=$("#servicePrice").val();
        params.wantDo=$("#wantDo").val();
        params.almType=$("#almType").val();
        params.snMemo=$("#snMemo").val();
        if(params.buyPrice ==""){
            params.buyPrice = 0;
        }
        if(params.servicePrice ==""){
            params.servicePrice = 0;
        }
        post_async(params,_config.ajaxUrl.updateUrl,callbackupdate);

    }
    /******************************************
     保存数据的回调函数
     *******************************************/
    function callbackupdate(data) {
        if(data.code == '200'){
            //alert("保存成功");
            parent.parent.alertTip("保存成功",2000,_snmodellist);
        }
        else {
            parent.parent.alertTip("保存失败",2000,null);
        }
    }
    /******************************************
     刷新列表
     *******************************************/
    function _snmodellist() {
        parent.parent.add_snmodellist();
        parent.parent.closePopus();
    }
    /******************************************
     点击保存验证
     *******************************************/
    function _sure(flag){
        if(flag){
            _getsnModelInfo();
        }else{
            //alert("验证不通过");
            _global.top.alertWarn("请填写完整信息",2000,null);
        }
    }

}(window, jQuery))
