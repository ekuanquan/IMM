/**
 * Created by 123 on 2017/8/15.
 */
$(document).ready(function () {
    init();
});

;(function (window, $) {
    window.init = _init;

    var _config = {
        ajaxUrl:{
            getCodeTypeIdUrl : '/IntegratedMM/getCodeTypeId.do',
            getSystemConfigUrl :'/IntegratedMM/systemConfig/getSystemConfig.do',
            updateSystemConfigUrl :'/IntegratedMM/systemConfig/updateSystemConfig.do'
        }
    };
    var _global = {
        systemConfig:{
            forward110:""
        },
        top:parent.parent
    };
    function _init() {
        _initData();
        _initEvent();
    }
    function _initEvent() {

        $("#all").bind("click",function () {  //事件类型中“全部”点击事件
            if ($(this).hasClass('isChecked')) {
                $(this).removeClass('isChecked').addClass('noChecked');
                $(".lenameCheckbox",".content_main").removeClass('isChecked').addClass('noChecked');
            } else {
                $(this).removeClass('noChecked').addClass('isChecked');
                $(".lenameCheckbox",".content_main").removeClass('noChecked').addClass('isChecked');
            }
        });
        $(".allType").bind("click",function () {  //点击文字复选框也实现勾选
           $("#all").click();
        });

        $("#sure").bind("click",function () {  //保存内容
            var params = {};
            params.systemConfig={};
            params.systemConfig.forward110 =_getChecked();
            post_async(params,_config.ajaxUrl.updateSystemConfigUrl,updateSystemConfig_callback);
        });
        $("#cancel").bind("click",function () {
            //alert("123");
        });
    }
    function _initData() {  //从后台获取事件类型
        post_async({"codeType":""},_config.ajaxUrl.getCodeTypeIdUrl,getCodeType_callback);
    }
    function getCodeType_callback(data) {  //获取事件类型回调函数，动态生成所有事件类型
        var codeType = data.codeType;
        var $contentMain = $('#contentMain');
        for (var i = 0; i < codeType.length; i++) {
            var $choose = createChoose(codeType[i]);
            $contentMain.append($choose);
        }
        post_async({"types":"forward110"},_config.ajaxUrl.getSystemConfigUrl,getSystemConfig_callback);
    }

    function createChoose(codeData){
        var $choose = $('<div></div>');
        var $lenameCheckbox = $('<div></div>');
        var $eventType = $('<div></div>');

        $choose.addClass('choose');
        $lenameCheckbox.addClass('lenameCheckbox').addClass('noChecked');
        $eventType.addClass('eventType');
        $choose.append($lenameCheckbox);
        $choose.append($eventType);
        $eventType.text(codeData.codeType);
        $lenameCheckbox.data('codeTypeId',codeData.codeTypeId);
        $lenameCheckbox.attr("id","codeTypeId"+codeData.codeTypeId);//生成事件类型div


        $lenameCheckbox.bind("click",function () {  //事件类型复选框点击事件
            if ($(this).hasClass('isChecked')) {
                $(this).removeClass('isChecked').addClass('noChecked');
                $("#all").removeClass('isChecked').addClass('noChecked');
            } else {
                $(this).removeClass('noChecked').addClass('isChecked');
                chooseall();
            }
        });
        $eventType.bind("click",function () {   //点击文字复选框也实现勾选
            $lenameCheckbox.click();
        });
        return $choose;
    }
    
    function getSystemConfig_callback(data) {  //显示从后台获取的已勾选类型
        var codeTypeId=data.SystemConfig.forward110;
        for(var i=0;i<codeTypeId.length;i++){
            var code = codeTypeId[i];
            var $lenameCheckbox = $("#codeTypeId"+code);
            if($lenameCheckbox.length>0){
                $lenameCheckbox.removeClass('noChecked').addClass('isChecked');
            }
        }
        chooseall();
    }

    function _getChecked() {    //从界面获取被勾选的事件类型
        var params = "";
        var $choose = $(".choose");
        for(var i=0;i<$choose.length;i++){
            if($("#codeTypeId"+i).hasClass('isChecked')){
                params += i+";";
            }
        }
        if(params.length != 0){
            params = params.substring(0,params.length-1);  //去除字符串中最后一个分号
        }
        else {
            params = -1;
        }
        return params;
    }
    function updateSystemConfig_callback(data) {
        var result = data.result;
        if (result.code == '200'){
            //alert("保存成功");
            _global.top.alertTip("保存成功",2000,null);
        }
        else {
            //alert("请重试");
            _global.top.alertTip("请重试",2000,null);
        }
    }
    function chooseall() {  //判断所有类型是否都被勾选，如所有都被勾选，“全部”被勾选上
        var $lenameCheckbox = $(".lenameCheckbox");
        var $isChecked = $(".isChecked");
        if($isChecked.length == $lenameCheckbox.length){
            $("#all").removeClass('noChecked').addClass('isChecked');
        }
    }
})(window, jQuery);