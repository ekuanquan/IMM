$(document).ready(function() {
	init();
});
;(function(window,$){
    var zoneId;
    var nvrId;
    window.init = _init;
    function _init() {
        $("#title_close").click(function(){close()});
        _initLayout();
        _initEvent();
        $("#confirmButton").click(function(){sure()});
       /* _initData();*/
    }

    function _initLayout() {
       var popusName = parent.getPopusName();
       var editjson = parent.getParemJson();
       if(popusName == 'addDeviceZoneNVR'){
            $("#title_left").text("添加摄像机");
           nvrId = editjson;                   //得到某一个摄像机的编号
       }else if(popusName == 'editDeviceZone'){
           $("#title_left").text("修改摄像机");
           zoneId = editjson.devId;
           $("#zoneNum_input").val(editjson.cameraName);
           $("#zoneLocation_input").val(editjson.devChannelId);
           $("#devMonitorId_input").val(editjson.devMonitorId);
           $("#probeModel_input").val(editjson.atPos);
           $("#installTime_input").val(editjson.instDate);
           $("#probeType_input").val(editjson.almType);
           $("#probeCount_input").val(editjson.wantDo);
           $("#reactivityType_input").val(editjson.cameraType);
           $("#cameraModeId").val(editjson.cameraModeId);
           $("#notes_input").val(editjson.fMemo);
           
           $("#zoneLocation_input,#devMonitorId_input").css({
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
            this.blur();
        });
    }

 /*   function _initData(){
        var deviceData = parent.parent.getPopupsRowJson();

    }*/

    function sure(){
        var deviceData = parent.parent.getPopupsRowJson();

        var devMonitorId =$("#devMonitorId_input").val();
        if(devMonitorId.length==1){
            devMonitorId="000"+devMonitorId;
        }else if(devMonitorId.length==2){
            devMonitorId="00"+devMonitorId;
        }else if(devMonitorId.length==3){
            devMonitorId="0"+devMonitorId;
        }

        var json = {
            "nvrId":nvrId,
            "devId":zoneId,
            "cameraName":$("#zoneNum_input").val(),
            "devChannelId":$("#zoneLocation_input").val(),
            "devMonitorId":devMonitorId,
            "atPos":$("#probeModel_input").val(),
            "instDate":$("#installTime_input").val(),
            "almType":$("#probeType_input").val(),
            "wantDo":$("#probeCount_input").val(),
            "cameraType":$("#reactivityType_input").val(),
            "cameraModeId":$("#cameraModeId").val(),
            "fMemo":$("#notes_input").val()
        }
       var end =  post_sync(json, "../../../../../ModifyCamera.do");
        alert(end.message)
    }
    function close(){
        parent.closePopus();
    }
})(window,jQuery);


















