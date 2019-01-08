$(document).ready(function() {
	init();
});
;(function(window,$){
    window.init = _init;
    function _init() {
        _initLayout();
        _initEvent();
    }
    function _initLayout() {
       var popusName = parent.getPopusName();
       if(popusName == 'addDeviceZone'){
            $("#title_left").text("添加设备防区");
       }else if(popusName == 'editDeviceZone'){
           $("#title_left").text("修改设备防区");
           $("#zoneNum_input").css({
               "pointer-events": "none",
               "opacity": "0.5",
               "background-color":"gray"
           });
           $("#confirmButton").text("确定");
       }else{

       }
    }
    function _initEvent() {
        $("#title_close").bind("click",function () {
            parent._closePopus();
        });
        $("#installTime_input").bind('focus',function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            //this.blur();
        });


    }
})(window,jQuery);