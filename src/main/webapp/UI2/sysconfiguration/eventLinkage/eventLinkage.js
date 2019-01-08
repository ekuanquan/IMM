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
            isRecordShoot:"",
            isScreenshots:"",
            isPreset:"",
            linkage:""
        }
    };
    var _data ={
        systemConfig:{
            isRecordShoot:"",
            isScreenshots:"",
            isPreset:"",
            linkage:"",
            recordShootLen:""
        }
    };

    function _init() {
        _initData();
        _initEvent();
    }

    function _initEvent() {
        $(".lenameCheckbox").bind("click",function () { //复选框点击事件
            if ($(this).hasClass('isChecked')) {
                $(this).removeClass('isChecked').addClass('noChecked');
            } else {
                $(this).removeClass('noChecked').addClass('isChecked');
            }
        });
        $("#all").bind("click",function () {   //事件类型“全部”点击事件
            if ($(this).hasClass('isChecked')) {
                $(this).removeClass('isChecked').addClass('noChecked');
                $(".lenameCheckbox","#choose_eventType").removeClass('isChecked').addClass('noChecked');
            } else {
                $(this).removeClass('noChecked').addClass('isChecked');
                $(".lenameCheckbox","#choose_eventType").removeClass('noChecked').addClass('isChecked');
            }
        });
        $(".item_content","#item0").bind("click",function () {    //点击文字“启动设备录像（中心服务器存储）”复选框也实现勾选
            $(".lenameCheckbox","#item0").click();
        });
        $(".item_content","#item1").bind("click",function () {    //点击文字“启动联动抓图”复选框也实现勾选
            $(".lenameCheckbox","#item1").click();
        });
        $(".item_content","#item2").bind("click",function () {    //点击文字“启动预置位跳转”复选框也实现勾选
            $(".lenameCheckbox","#item2").click();
        });
        $(".allType").bind("click",function () {  //点击文字“全部”复选框也实现勾选
            $("#all").click();
        });
        $("#isRecordShoot").bind("click",function () {    //勾选“启动设备录像（中心服务器存储）”复选框实现“存储时长”是否可以选择
            if ($("#isRecordShoot").hasClass('isChecked')) {
                $("#Time").removeClass('select').removeAttr("disabled");
            } else {
                $("#Time").addClass('select').attr("disabled","disabled");
            }
        });
        $("#sure").bind("click",function () {   //保存内容
            if($("#isRecordShoot").hasClass('isChecked')){   //“启动设备录像（中心服务器存储）”复选框被勾选时
                _isRecordShoot();
            }
            else {    //“启动设备录像（中心服务器存储）”复选框未被勾选时
                _noRecordShoot();
            }
        });
        $("#cancel").bind("click",function () {
            alert("123")
        });
    }

    function _initData() {   //从后台获取事件类型
        post_async({"codeType":""},_config.ajaxUrl.getCodeTypeIdUrl,getCodeType_callback);
    }

    function getCodeType_callback(data) {
        var codeType = data.codeType;
        var $contentMain = $('#contentMain');
        for (var i = 0; i < codeType.length; i++) { //动态生成事件类型
            var $choose = createChoose(codeType[i]);
            $contentMain.append($choose);
        }
        post_async({"types":"isRecordShoot;recordShootLen;isScreenshots;isPreset;linkage"},_config.ajaxUrl.getSystemConfigUrl,getSystemConfig_callback);
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
        $lenameCheckbox.attr("id","codeTypeId"+codeData.codeTypeId);  //生成事件类型div

        $lenameCheckbox.bind("click",function () {     //事件类型复选框点击事件
            if ($(this).hasClass('isChecked')) {
                $(this).removeClass('isChecked').addClass('noChecked');
                $("#all").removeClass('isChecked').addClass('noChecked');
            } else {
                $(this).removeClass('noChecked').addClass('isChecked');
                chooseall();
            }
        });
        $eventType.bind("click",function () {    //点击文字实现复选框勾选
            $lenameCheckbox.click();
        });
        return $choose;
    }

    function getSystemConfig_callback(data) {    //后台获取数据
        var isRecordShoot=data.SystemConfig.isRecordShoot;
        var isScreenshots=data.SystemConfig.isScreenshots;
        var isPreset=data.SystemConfig.isPreset;
        var codeTypeId=data.SystemConfig.linkage;
        var time=data.SystemConfig.recordShootLen;
        for(var i=0;i<codeTypeId.length;i++){
            var code = codeTypeId[i];
            var $lenameCheckbox = $("#codeTypeId"+code);
            if($lenameCheckbox.length>0){
                $lenameCheckbox.removeClass('noChecked').addClass('isChecked');
            }
        }
        chooseall();
        if(isRecordShoot=="0"){
            $(".lenameCheckbox","#item0").removeClass('isChecked').addClass('noChecked');
        }else {
            $(".lenameCheckbox","#item0").removeClass('noChecked').addClass('isChecked');
            $("#Time").removeClass('select').removeAttr("disabled");
        }
        if(isScreenshots=="0"){
            $(".lenameCheckbox","#item1").removeClass('isChecked').addClass('noChecked');
        }else {
            $(".lenameCheckbox","#item1").removeClass('noChecked').addClass('isChecked');
        }
        if(isPreset=="0"){
            $(".lenameCheckbox","#item2").removeClass('isChecked').addClass('noChecked');
        }else {
            $(".lenameCheckbox","#item2").removeClass('noChecked').addClass('isChecked');
        }
        $("#Time").val(time);
    }

    function _getChecked() {     //从界面获取勾选的事件类型
        var params = "";
        var $choose = $(".choose");
        for(var i=0;i<$choose.length;i++){
            if($("#codeTypeId"+i).hasClass('isChecked')){
                params += i+";";
            }
        }
        if(params.length != 0){
            params = params.substring(0,params.length-1);
        }
        return params;
    }

    function _getisRecordShoot() {   //界面获取设备录像的勾选状态
        var params = {};
        if($("#isRecordShoot").hasClass('isChecked')){
            params = 1
        }
        else { params = 0 }
        return params;
    }

    function _getisScreenshots() {     //界面获取联动抓图的勾选状态
        var params = {};
        if($("#isScreenshots").hasClass('isChecked')){
            params = 1
        }
        else { params = 0 }
        return params;
    }
    
    function _getrecordShootLen() {     //界面获取存储时长的值
        var options=$("#Time option:selected");
        var parmas = options.val();
        return parmas;
    }
    function _getisPreset() {    //界面获取预置位跳转的勾选状态
        var params = {};
        if($("#isPreset").hasClass('isChecked')){
            params = 1
        }
        else { params = 0 }
        return params;
    }

    function _isRecordShoot() {
        var params = _data;
        params.systemConfig = {};
        params.systemConfig.isRecordShoot = _getisRecordShoot();
        params.systemConfig.isScreenshots = _getisScreenshots();
        params.systemConfig.isPreset = _getisPreset();
        params.systemConfig.recordShootLen = _getrecordShootLen();
        params.systemConfig.linkage = _getChecked();
        post_async(params,_config.ajaxUrl.updateSystemConfigUrl,updateSystemConfig_callback);
    }

    function _noRecordShoot() {
        var params = _global;
        params.systemConfig = {};
        params.systemConfig.isRecordShoot = _getisRecordShoot();
        params.systemConfig.isScreenshots = _getisScreenshots();
        params.systemConfig.isPreset = _getisPreset();
        params.systemConfig.linkage = _getChecked();
        post_async(params,_config.ajaxUrl.updateSystemConfigUrl,updateSystemConfig_callback);
    }

    function updateSystemConfig_callback(data) {
        var result = data.result;
        if (result.code == '200'){
            alert("保存成功");
        }
        else {
            alert("请重试");
        }
    }
    function chooseall() {    //判断所有事件类型是否都被勾选，如所有都被勾选，“全部”被勾选上
        var $lenameCheckbox = $(".lenameCheckbox","#contentMain");
        var $isChecked = $(".isChecked","#contentMain");
        if($isChecked.length == $lenameCheckbox.length){
            $("#all").removeClass('noChecked').addClass('isChecked');
        }
    }
})(window, jQuery);