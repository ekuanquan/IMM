/**
 * Created by ly on 2016/10/9.
 */
charset = "utf-8";
$(document).ready(function () {
    init();
});

;(function ($, window) {
    window.init = _init;
    function _init() {
        _initData();    //初始化数据
        _initEven();    //初始化事件
    }
    function _initData() {
        $("#oldDevId").val(parent.getDevIdO());
        $("#oldDevId").css({
            "pointer-events": "none",
            "opacity": "0.5"
        });
    }
    function _initEven() {
        $('#newDevId').editableSelect({
            effects: 'default',
        });
        $("#newDevId_sele").attr("maxlength","9");
        $("#newDevId_sele").bind("input propertychange",function(){
            var DevId = $("#newDevId_sele").val();
            if(DevId.length>=6){
                var param = {
                    type:"devUsed",
                    value:DevId
                };
                post_async(param,"/IntegratedMM/identifier/queryIdByLike.do",_callback_getownerId)
            }else{
                $("#newDevId_editable-select-options ul").empty();
            }

        });
        //失去焦点后将值赋给DevId input
        $("#newDevId_sele").bind("blur",function(){
            $("#newDevId").val($("#newDevId_sele").val());
        });
        /************************************************
         关闭按钮点击事件，触发解锁
         ************************************************/
        $("#close,#cancel").bind('click', function() {
            parent.closeOtherPopus();
        });
        /************************************************
         确定按钮
         ************************************************/
        $("#sure").bind('click', function() {
            if($("#newDevId").val().trim().length==0){
                parent.alertWarn("请填写新的编号！",2000,null);
                return;
            }
            var param = {
                oldDevId:$("#oldDevId").val(),
                newDevId:$("#newDevId").val()
            };
            post_async(param,"/IntegratedMM/modifyDevId.do",_callback_updataDevId)
        });
    }
    function _callback_updataDevId(data) {
        $("#newDevId_editable-select-options ul").empty();
        if(data.code&&data.code=="200"){
            parent.setDevIdBack($("#newDevId").val())
            parent.closeOtherPopus();
        }
        else{
            parent.alertWarn(data.message,2000,null);
        }
    }
    //获取可用的机主编号
    function _callback_getownerId(data) {
        $("#newDevId_editable-select-options ul").empty();
        if(data.result.code&&data.result.code=="200"){
            var length = data.values.length;
            if(length>3){length=3;}
            for(var i=0;i<length;i++){
                var $option =$("<li></li>");
                $option.attr("value",i);
                $option.text(data.values[i]);
                $option.attr("style","display: list-item;");
                $option.appendTo($("#newDevId_editable-select-options > ul"));
            }
            $("#newDevId_editable-select-options").css("display","block");
        }
        $("#newDevId_editable-select-options ul li").bind("mousedown",function () {
            $("#newDevId_sele").val(this.innerHTML);
        }).bind("mouseover",function () {
            this.siblings().removeClass("selected");
            this.addClass("selected");
        })
    }

    function isEmpty(field,type){
        var textValue = $("#"+field).val();
        if(textValue != ""){
            if( type=="2" ){
                post_async(
                    {
                        "validateName":"DevId",
                        "validateValue":textValue
                    },
                    "/IntegratedMM/validate/isCanUse.do",
                    validate_callback,field);
            }
        }
        else{

        }
    }
    function validate_callback(data,field){
        if(data.result.code == 0){
            if(field == "newDevId_sele"){
                $("#DevId_sele").next().removeClass("Validform_wrong").addClass("Validform_right");
            }
        }else if(data.result.code == 1){
            if(field == "newDevId_sele"){
                //alert("该用户编号已经存在。");
                _global.top.alertFail("该用户编号已经存在",2000,null);
                $("#DevId_sele").next().removeClass("Validform_right").addClass("Validform_wrong");
            }
        }else if(data.result.code == 2){
            if(field == "newDevId_sele"){
                _global.top.alertFail("该用户编号格式有误",2000,null);
                $("#DevId_sele").next().removeClass("Validform_right").addClass("Validform_wrong");
            }
        }
    }
})(jQuery, window);

