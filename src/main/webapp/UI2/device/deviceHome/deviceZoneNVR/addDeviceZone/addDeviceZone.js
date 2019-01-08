$(document).ready(function() {
    $("#signupForm").Validform({
        tiptype:2,
        btnSubmitId:"confirmButton",
        callback:sure
    });
	init();
});
;(function(window,$){
    var zoneId;
    var nvrId;
    var aunSnmodel1=0;
    var aunSnmodel2=0;
    var aunSnmodel3=0;
    window.init = _init;
    window.sure = _sure;
    var _config ={
        ajaxUrl:{
            queryCameraTypeListUrl:"/IntegratedMM/queryCameraTypeList.do",
            queryCameraTypeByIdUrl:"/IntegratedMM/queryCameraTypeById.do"
        }
    };
    function _init() {
        $("#title_close,#cancelButton").click(function(){close()});
        _initLayout();
        _initEvent();
        /*$("#confirmButton").click(function(){sure()});*/
        $("#probeCount_input").click(function(){getQueryWanttoList();});
        $("#probeType_input").click(function(){getQueryAlmtypeList();});
        $("#cameraModeId").click(function(){getCameraList();});
        $("#reactivityType_input").one("click",function () {getCameratype()});
       /* _initData();*/
    }

    function _initLayout() {
        //getCameratype();
       var popusName = parent.getPopusName();
       var editjson = parent.getParemJson();
       if(popusName == 'addDeviceZoneNVR'){
            /*$("#title_left").text("添加摄像机");*/
           $("#title_left").text("添加监控点");
           nvrId = editjson;                   //得到某一个摄像机的编号
       }else if(popusName == 'editDeviceZone'){
           /*$("#title_left").text("修改摄像机");*/
           $("#title_left").text("修改监控点");
           zoneId = editjson.devId;
           $("#zoneNum_input").val(editjson.cameraName);
           $("#zoneLocation_input").val(editjson.devChannelId);
           $("#devMonitorId_input").val(editjson.devMonitorId);
           $("#probeModel_input").val(editjson.atPos);
           $("#installTime_input").val(editjson.instDate);

           var probeType = document.getElementById("probeType_input");      //警情类型
           var almType = editjson.almType;
           if(almType==undefined){almType=""}
           probeType.innerHTML= probeType.innerHTML + "<option value="+editjson.almType+">"+almType+"</option>";
           $("#probeType_input").val(editjson.almType);

           var probeCount = document.getElementById("probeCount_input");       //反应类型
           var wantDo = editjson.wantDo;
           if(wantDo==undefined){wantDo=""}
           probeCount.innerHTML= probeCount.innerHTML + "<option value="+editjson.wantDo+">"+wantDo+"</option>";
           $("#probeCount_input").val(editjson.wantDo);

           //$("#reactivityType_input").val(editjson.cameraType);
           //获取摄像机类型的名称
           var cameraTypeName = getcameraType(editjson.cameraType);
           $("#reactivityType_input").append("<option value="+editjson.cameraType+">"+cameraTypeName+"</option>");

           var cameraMode = document.getElementById("cameraModeId");       //摄像机型号
           var cameraModelName = editjson.cameraModelName;
           if(cameraModelName==undefined){cameraModelName=""}
           cameraMode.innerHTML= cameraMode.innerHTML + "<option value="+editjson.cameraModeId+">"+cameraModelName+"</option>";
           $("#cameraModeId").val(editjson.cameraModeId);

           $("#notes_input").val(editjson.fMemo);
           
           $("#zoneLocation_input,#devMonitorId_input").css({
               "pointer-events": "none",
               "opacity": "0.5",
               "background-color":"#b5b5b5"
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
           /* "cameraType":$("#reactivityType_input").val(),*/
            //"cameraType":12,
            "cameraType":$("#reactivityType_input").val(),
            "cameraModeId":$("#cameraModeId").val(),
            "fMemo":$("#notes_input").val()
        }
       var end =  post_sync(json, "../../../../../ModifyCamera.do");
        /*alert(end.message)*/
        parent.parent.alertTip(end.message,2000,null);
    }
    function close(){
        parent.closePopus();
    }
    //获取摄像机类型的值2017年10月13日09:35:06
    function getcameraType(cameraType) {
        //post_async({"cameraType":cameraType},_config.ajaxUrl.queryCameraTypeByIdUrl,callbackcameraTypeName)
        var cameraTypedata = post_sync({"cameraType":cameraType},_config.ajaxUrl.queryCameraTypeByIdUrl);
        var cameraTypeName = "";
        var result = cameraTypedata.result;
        if(cameraTypedata.code == "1000"){
            cameraTypeName = result.cameraTypeName;
        }
        else {
            cameraTypeName = "";
        }
        return cameraTypeName;
    }
    function getQueryWanttoList(){                 //查询反应类型
        var probeCount = document.getElementById("probeCount_input");
        if(aunSnmodel1==0){
            var WanttoList =  post_sync(null, "../../../../../QueryWanttoList.do");
            var WanttoRusult = WanttoList.result;
            probeCount.options.length=0;
            for(var i=0; i<WanttoRusult.length; i++){
                probeCount.innerHTML= probeCount.innerHTML + "<option value="+WanttoRusult[i].wantDo+">"+WanttoRusult[i].wantDoName+"</option>";
            }
            aunSnmodel1=1;
        }
    }

    function getQueryAlmtypeList(){                 //查询警情类型
        var probeType = document.getElementById("probeType_input");
        if(aunSnmodel2==0){
            var AlmtypeList =  post_sync(null, "../../../../../QueryAlmtypeList.do");
            var AlmtypeRusult = AlmtypeList.result;
            probeType.options.length=0;
            for(var i=0; i<AlmtypeRusult.length; i++){
                probeType.innerHTML= probeType.innerHTML + "<option value="+AlmtypeRusult[i].almType+">"+AlmtypeRusult[i].almTypeName+"</option>";
            }
            aunSnmodel2=1;
        }
    }

    function getCameraList(){                 //摄像机型号
        var cameraModeId = document.getElementById("cameraModeId");
        if(aunSnmodel3==0){
            var AlmtypeList =  post_sync(null, "../../../../../QueryCameraLists.do");
            var AlmtypeRusult = AlmtypeList.result;
            cameraModeId.options.length=0;
            for(var i=0; i<AlmtypeRusult.length; i++){
                cameraModeId.innerHTML= cameraModeId.innerHTML + "<option value="+AlmtypeRusult[i].cameraModelId+">"+AlmtypeRusult[i].cameraModelName+"</option>";
            }
            aunSnmodel3=1;
        }
    }
    //获取摄像机类型2017年10月12日11:56:08
    function getCameratype() {
        post_async(null,_config.ajaxUrl.queryCameraTypeListUrl,callback_Cameratype);
    }
    //摄像机类型的回调函数2017年10月12日11:56:14
    function callback_Cameratype(data) {
        $("#reactivityType_input").empty();//先对下拉项清空
        var result = data.result;
        if(data.code == "1000"){
            for(var i=0;i<result.length;i++){
                var $option = $("<option></option>");
                $option.attr("value",result[i].cameraType);
                $option.text(result[i].cameraTypeName);
                $option.appendTo($("#reactivityType_input"));
            }
        }
    }
    function _sure(flag) {
        if(flag){
            sure();
        }else {
            parent.parent.alertTip("请填写完整信息",2000,null);
        }
    }
})(window,jQuery);


















