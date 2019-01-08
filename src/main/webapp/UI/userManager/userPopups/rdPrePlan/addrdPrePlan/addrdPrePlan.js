$(document).ready(function () {
    $("#form").Validform({
        tiptype:2,
        btnSubmitId:"confirmButton",
        callback:sure
    });
    init();
});
;(function (window, $) {
    window.init = _init;
    window.sure = _sure;

    var _config = {
        ajaxUrl: {
            addUrl:'/IntegratedMM/dealway/add.do'
        }
    };
    var _global = {
        userId:''       //用户Id
    };

    function _init() {
        _initData();
        _initEvent();
    }
    function _initData() {
        //获取用户Id
        var rowJson = parent.parent.getPopupsRowJson();
        _global.userId = rowJson.userId;
    }

    function _initEvent() {
        //关闭窗口
        $("#title_close,#cancelButton").bind("click", function () {
            parent._closePopus();
        });
    }
    function _sure(flag) {
        if(flag){
            _submitDevice();
        }else{
            parent.parent.alertTip("请填写完整正确的信息！",2000,null);
        }
    }
    function _submitDevice() {
        var rdprePlan = {};
        var params = {};
        var userId = _global.userId;
        var dealWayId = $("#dealWayId").val();
        var fdata = $("#fdata").val();
        var fMemo = $("#fMemo").val();
        rdprePlan.userId = userId;      // 用户id
        rdprePlan.dealWayId = dealWayId;// 序号
        rdprePlan.fdata = fdata;        // 内容
        rdprePlan.fMemo = fMemo;        // 备注
        //alert(JSON.stringify(rdprePlan));
        post_async(rdprePlan,_config.ajaxUrl.addUrl,callbackadd)
    }
    function callbackadd(data) {
        var result = data.result;
        if(result.code == "1000"){
            parent.parent.alertTip("处警预案信息保存成功！",2000,null);
            parent.refreshrdPrePlan();//刷新列表
            parent._closePopus();//关闭弹窗
        }else if(result.code == "1001"){
            parent.parent.alertTip("参数不符合规则",null,null);
        }else if(result.code == "1008"){
            parent.parent.alertTip("违反唯一性约束",null,null);
        }else if(result.code == "1009"){
            parent.parent.alertTip("请填写完整信息",null,null);
        }
        /*parent.parent.alertTip(data.result.message,2000,null);
        parent.refreshrdPrePlan();//刷新列表
        parent._closePopus();//关闭弹窗*/
    }
})(window, jQuery);