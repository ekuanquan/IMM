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
            updateUrl:'/IntegratedMM/dealway/update.do'
        }
    };
    var _global = {
        userId:'',       //用户Id
        oldDealWayId:''  //旧的序号
    };

    function _init() {
        _initData();
        _initEvent();
    }
    function _initData() {
        //获取用户Id
        var rowJson = parent.parent.getPopupsRowJson();
        _global.userId = rowJson.userId;
        //显示界面获取内容
        getalterInfo();
    }

    function _initEvent() {
        //关闭窗口
        $("#title_close,#cancelButton").bind("click", function () {
            parent._closePopus();
        });
    }
    //将页面信息显示在修改页面
    function getalterInfo() {
        //获取页面信息
        var datajson = parent.getalterrdPrePlan();

        $("#dealWayId").val(datajson.dealWayId);    // 序号
        $("#fdata").val(datajson.fdata);            // 内容
        $("#fMemo").val(datajson.fMemo);             // 备注
        _global.oldDealWayId = $("#dealWayId").val();
    }
    function _sure(flag) {
        if(flag){
            parent.parent.comfireFloat("确定修改处警预案信息？",_submitDevice,null);

        }else{
            parent.parent.alertTip("请填写完整正确的信息！",2000,null);
        }
    }
    function _submitDevice() {
        if($("#dealWayId").val() == ""){
            parent.parent.alertTip("序号不能为空！",null,null);
        }else {
            var params = {
                "ownerId":_global.userId, // 被更新的用户id
                "oldDealWayId":_global.oldDealWayId,//旧的序号
                "newDealWayId":$("#dealWayId").val(), // 被更新的序号
                "fdata":$("#fdata").val(), // 被更新的内容
                "fMemo":$("#fMemo").val()// 被更新的备注
            };
            post_async(params,_config.ajaxUrl.updateUrl,callbackupdate)
        }

    }
    function callbackupdate(data) {
        var result = data.result;
        if(result.code == "1000"){
            parent.parent.alertTip("信息修改成功！",2000,null);
            parent.refreshrdPrePlan();//刷新列表
            parent._closePopus();//关闭弹窗
        }else if(result.code == "1001"){
            parent.parent.alertTip("参数不符合规则",null,null);
        }else if(result.code == "1007"){
            parent.parent.alertTip("序号重复",null,null);
        }
        /*parent.parent.alertTip(data.result.message,2000,null);
        parent.refreshrdPrePlan();//刷新列表
        parent._closePopus();//关闭弹窗*/
    }
})(window, jQuery);