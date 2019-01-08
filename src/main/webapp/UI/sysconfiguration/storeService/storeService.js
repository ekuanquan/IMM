/**
 * Created by 123 on 2017/8/15.
 */
$(document).ready(function () {
    $("#signupForm").Validform({
        tiptype:2,
        btnSubmitId:"sure",
        callback:sure
    });
    init();
});

;(function (window, $) {
    window.init = _init;
    window.sure = _sure;
    var _config={
        ajaxUrl:{
            getSystemConfigUrl :'/IntegratedMM/systemConfig/getSystemConfig.do',
            updateSystemConfigUrl :'/IntegratedMM/systemConfig/updateSystemConfig.do'
        }
    };
    var _global={
        systemConfig :{
            fileType :"",
            recordShootIP :"",
            recordShootPort :""
        }
    };
    function _init() {
        _initData();
        _initEvent();
    }
    function _initData() {   //从后台获取数据
        post_async({"types":"fileType;recordShootIP;recordShootPort"},_config.ajaxUrl.getSystemConfigUrl,getSystemConfig_callback);
    }
    function _initEvent() {
        /*$("#sure").bind("click",function () {   //保存内容
            var params = {};
            params.systemConfig = {};
            params.systemConfig.fileType = $("#fileType").val();
            params.systemConfig.recordShootIP = $("#recordShootIP").val();
            params.systemConfig.recordShootPort = $("#recordShootPort").val();
            post_async(params,_config.ajaxUrl.updateSystemConfigUrl,updateSystemConfig_callback);
        });*/
        $("#cancel").bind("click",function () {
        })
    }
    function _sure(flag) {
        if(flag){
            var params = {};
            params.systemConfig = {};
            params.systemConfig.fileType = $("#fileType").val();
            params.systemConfig.recordShootIP = $("#recordShootIP").val();
            params.systemConfig.recordShootPort = $("#recordShootPort").val();
            post_async(params,_config.ajaxUrl.updateSystemConfigUrl,updateSystemConfig_callback);
        }else {
            parent.parent.alertTip("请填写完整信息",2000,null);
        }
    }
    function getSystemConfig_callback(data){  //获取数据回调函数
        var fileType = data.SystemConfig.fileType;
        var recordShootIP =data.SystemConfig.recordShootIP;
        var recordShootPort =data.SystemConfig.recordShootPort;
        $("#fileType").append("<option value='"+fileType+"'>"+fileType+"</option>");
        $("#recordShootIP").val(recordShootIP);
        $("#recordShootPort").val(recordShootPort);
    }
    function updateSystemConfig_callback(data) {
        var result = data.result;
        if (result.code == '200'){
            parent.parent.alertTip("保存成功",2000,null);
        }
        else {
            parent.parent.alertTip("请重试",2000,null);
        }
    }
})(window, jQuery);

