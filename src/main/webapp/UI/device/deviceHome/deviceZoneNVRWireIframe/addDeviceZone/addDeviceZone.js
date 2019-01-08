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
    window.setGbId=_setGbId;
    var _config ={
        ajaxUrl:{
            queryCameraTypeListUrl:"/IntegratedMM/queryCameraTypeList.do",
            queryCameraTypeByIdUrl:"/IntegratedMM/queryCameraTypeById.do"
        }
    };
    function _init() {
        $("#title_close").click(function(){close()});
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

        var jsonPrem = parent.textPrem();
        var popusName= jsonPrem.editZone;
        var editjson= jsonPrem.dataJson;

       if(popusName == 'addDeviceZone'){
            /*$("#title_left").text("添加摄像机");*/
           $("#title_left").text("添加监控点");
           nvrId = editjson;                   //得到某一个摄像机的编号
           var nowTime = getNowFormatDate();
           $('#installTime_input').val(nowTime);//设置安装日期
       }else if(popusName == 'editDeviceZone'){
           /*$("#title_left").text("修改摄像机");*/
           $("#title_left").text("修改监控点");
           zoneId = editjson.devId;
           $("#zoneNum_input").val(editjson.cameraName);
           $("#zoneLocation_input").val(editjson.devChannelId);
           $("#devMonitorId_input").val(editjson.devMonitorId);
           $("#probeModel_input").val(editjson.atPos);
           $("#installTime_input").val(editjson.instDate);
           //$("#reactivityType_input").val(editjson.)
           var probeType = document.getElementById("probeType_input");      //警情类型
           var almTypeName = editjson.almTypeName;
           if(almTypeName==undefined){almTypeName=""}
           probeType.innerHTML= probeType.innerHTML + "<option value="+editjson.almType+">"+almTypeName+"</option>";
           $("#probeType_input").val(editjson.almType);

           var probeCount = document.getElementById("probeCount_input");       //反应类型
           var wantDoName = editjson.wantDoName;
           if(wantDoName==undefined){wantDoName=""}
           probeCount.innerHTML= probeCount.innerHTML + "<option value="+editjson.wantDo+">"+wantDoName+"</option>";
           $("#probeCount_input").val(editjson.wantDo);
           //获取摄像机类型的名称
           //var cameraTypeName = getcameraType(editjson.cameraType);
           var cameraTypeName = editjson.cameraTypeName;
           if(cameraTypeName==undefined||cameraTypeName == ""){cameraTypeName=""}
           $("#reactivityType_input").append("<option value="+editjson.cameraType+">"+cameraTypeName+"</option>");

           var cameraMode = document.getElementById("cameraModeId");       //摄像机型号
           var cameraModelName = editjson.cameraModelName;
           if(cameraModelName==undefined){cameraModelName=""}
           cameraMode.innerHTML= cameraMode.innerHTML + "<option value="+editjson.cameraModeId+">"+cameraModelName+"</option>";
           $("#cameraModeId").val(editjson.cameraModeId);
           $("#gbId").val(editjson.gbId);

           $("#notes_input").val(editjson.fMemo);
           
           $("#devMonitorId_input").css({
               "pointer-events": "none",
               "opacity": "0.5",
               "background-color":"#b5b5b5"
           });
           $("#confirmButton").text("确定");
       }else{

       }
    }
    function _initEvent() {
        $("#cancelButton,#title_close").bind("click",function () {
            parent.closePopus();
        });
        $("#installTime_input").bind('focus',function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            this.blur();
        });
        /*$("#gbId").click(function() {
            openGBPopus("../../../../resource/gbId/gbId.html",{width:360,height:208});
        });*/
    }

 /*   function _initData(){
        var deviceData = parent.parent.getPopupsRowJson();

    }*/

    function sure(){
        var deviceData = parent.parent.getPopupsRowJson();
        var devMonitorId_input = $("#devMonitorId_input").val();
        if(devMonitorId_input.length==1){
            devMonitorId_input="000"+devMonitorId_input;
        }else if(devMonitorId_input.length==2){
            devMonitorId_input="00"+devMonitorId_input;
        }else if(devMonitorId_input.length==3){
            devMonitorId_input="0"+devMonitorId_input;
        }
        var cameraType=$("#reactivityType_input").val();
        if(cameraType == null || cameraType ==""||cameraType =="undefined"){
            cameraType = -1;
        }
        var cameraModeId=$("#cameraModeId").val();
        if(cameraModeId == null || cameraModeId ==""||cameraModeId =="undefined"){
            cameraModeId = -1;
        }
        var wantDo=$("#probeCount_input").val();
        if(wantDo == null || wantDo ==""||wantDo =="undefined"){
            wantDo = -1;
        }
        var almType=$("#probeType_input").val();
        if(almType == null || almType ==""||almType =="undefined"){
            almType = -1;
        }
        var json = {
            "nvrId":nvrId,
            "devId":zoneId,
            "cameraName":$("#zoneNum_input").val(),
            "devChannelId":$("#zoneLocation_input").val(),
            "devMonitorId":devMonitorId_input,
            "atPos":$("#probeModel_input").val(),
            "instDate":$("#installTime_input").val(),
            "almType":almType,
            "wantDo":wantDo,
            //"cameraType":11,
            "cameraType":cameraType,
            "cameraModeId":cameraModeId,
            "fMemo":$("#notes_input").val(),
            "gbId": $("#gbId").val(),
        }
        var end = null;
        var deviceData = parent.parent.getPopupsRowJson();
        if($("#title_left").text()=="添加监控点"){
            json.devId=deviceData.devId;
            end = post_sync(json, "../../../../../addHaveCamera.do");
        }else{
            json.nvrId=deviceData.devId;
            end = post_sync(json, "../../../../../ModifyCamera.do");
        }
        /*alert(end.message)*/
        parent.parent.alertTip(end.message,2000,null);
        if(end.code = "1000"){
            parent.showiframeDevice.reflaceDeviceZoneNVRWireIframe();
        }
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
    //获取摄像机类型2017年10月12日17:10:19
    function getCameratype() {
        post_async(null,_config.ajaxUrl.queryCameraTypeListUrl,callback_Cameratype);
    }
    //摄像机类型的回调函数2017年10月12日17:10:25
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
    function getNowFormatDate() {
        var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        return y + '-' + m + '-' + d;
    }
    function _setGbId(gbId) {
        $("#gbId").val(gbId)
    }
})(window,jQuery);