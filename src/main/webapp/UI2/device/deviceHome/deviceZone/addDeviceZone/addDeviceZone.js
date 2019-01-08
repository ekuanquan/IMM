$(document).ready(function() {
    $("#signupForm").Validform({
        tiptype:2,
        btnSubmitId:"confirmButton",
        callback:sure
    });
	init();
});
;(function(window,$){

    var aunSnmodel = 0;
    var aunSnmodel1 = 0;
    var aunSnmodel2 = 0;
    var aunSnmodel3 = 0;
    window.init = _init;
    window.sure = _sure;

    var _global={
        popusName:""
    };
    function _init() {
        _global.popusName = parent.getPopusName();
        var editjson = parent.getDataJson();
        getQuerySntypeList(editjson);
        getQuerySnmodelList(editjson);
        $("#reactivityType_input").click(function(){getQueryWanttoList();});
        $("#policeType_input").click(function(){getQueryAlmtypeList();});
        _initLayout();
        _initEvent();
        /*$("#confirmButton").click(function(){sure()});*/
        //$("#probeModel_input").click(function(){getQuerySnmodelList();});
        //$("#probeType_input").click(function(){getQuerySntypeList();});
       /* _initData();*/
    }
    function _initLayout() {
       _global.popusName = parent.getPopusName();
       var editjson = parent.getDataJson();
       if(_global.popusName == 'addDeviceZone'){
            $("#title_left").text("添加设备防区");
            var newtime = getNowFormatDate();
            newtime = newtime.split(" ")[0];
            $("#installTime_input").val(newtime);
       }else if(_global.popusName == 'editDeviceZone'){
           $("#title_left").text("修改设备防区");
           $("#zoneNum_input").val(editjson.devZoneId);
           $("#zoneLocation_input").val(editjson.atPos);
           $("#installTime_input").val(editjson.instDate);

           /*$("#probeModel_input").val(editjson.snModeId);*/


       //    $("#probeType_input").val(editjson.snType);

           $("#probeCount_input").val(editjson.snNum);

        //   $("#reactivityType_input").val(editjson.wantDo);
           $("#reactivityType_input").val(editjson.wantDo);

         //  $("#policeType_input").val(editjson.almType);
           $("#policeType_input").val(editjson.almType);

           $("#notes_input").val(editjson.fMemo);
           
           $("#zoneNum_input").css({
               "pointer-events": "none",
               "opacity": "0.5",
               "background-color":"#b5b5b5"
           });
           $("#confirmButton").text("确定");
       }else{

       }
    }
    function _initEvent() {
        $("#title_close,#cancelButton").bind("click",function () {
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
        var devzoneId = $("#zoneNum_input").val();
        if(devzoneId.length==1){
            devzoneId="000"+devzoneId;
        }else if(devzoneId.length==2){
            devzoneId="00"+devzoneId;
        }else if(devzoneId.length==3){
            devzoneId="0"+devzoneId;
        }
        var json = {
            "devId":deviceData.devId,          //需要拿到报警主机设备编号
            "devZoneId":devzoneId,
            "atPos":$("#zoneLocation_input").val(),
            "instDate":$("#installTime_input").val(),
            "snModeId":$("#probeModel_input").val(),
            "snType":$("#probeType_input").val(),
            "snNum":$("#probeCount_input").val(),
            "wantDo":$("#reactivityType_input").val(),
            "almType":$("#policeType_input").val(),
            "fMemo":$("#notes_input").val()
        };
        if(_global.popusName == "addDeviceZone"){
            var end =  post_sync(json, "../../../../../addDevice/addAlarmhostArea.do");
            /*alert(end.result.message);*/
            parent.parent.alertTip(end.result.message,2000,null);
        }
        else if(_global.popusName == "editDeviceZone"){
            var end =  post_sync(json, "../../../../../addDevice/updateAlarmhostArea.do");
            /*alert(end.result.message);*/
            parent.parent.alertTip(end.result.message,2000,null);
        }

    }

    function getQuerySnmodelList(editjson){                 //查询探头型号
        var probeModel = document.getElementById("probeModel_input");
        if(aunSnmodel==0){
            var SnmodelList =  post_sync(null, "../../../../../QuerySnmodelList.do");
            var SnmoRusult = SnmodelList.result;
            probeModel.options.length=0;
            for(var i=0; i<SnmoRusult.length; i++){
                probeModel.innerHTML= probeModel.innerHTML + "<option value="+SnmoRusult[i].snModelId+">"+SnmoRusult[i].snModelName+"</option>";
            }
            if(_global.popusName == 'editDeviceZone') {
                $("#probeModel_input").val(editjson.snModeId);
            }
            $('#probeModel_input').searchableSelect();
            $(".searchable-select-input").css({width:"192px"});
            aunSnmodel=1;
        }
    }

    function getQueryWanttoList(){                 //查询反应类型
        var reactivityType = document.getElementById("reactivityType_input");
        if(aunSnmodel1==0){
            var WanttoList =  post_sync(null, "../../../../../QueryWanttoList.do");
            var WanttoRusult = WanttoList.result;
            reactivityType.options.length=0;
            for(var i=0; i<WanttoRusult.length; i++){
                reactivityType.innerHTML= reactivityType.innerHTML + "<option value="+WanttoRusult[i].wantDoName+">"+WanttoRusult[i].wantDoName+"</option>";
            }
            aunSnmodel1=1;
        }
    }

    function getQueryAlmtypeList(){                 //查询警情类型
        var policeType = document.getElementById("policeType_input");
        if(aunSnmodel2==0){
            var AlmtypeList =  post_sync(null, "../../../../../QueryAlmtypeList.do");
            var AlmtypeRusult = AlmtypeList.result;
            policeType.options.length=0;
            for(var i=0; i<AlmtypeRusult.length; i++){
                policeType.innerHTML= policeType.innerHTML + "<option value="+AlmtypeRusult[i].almTypeName+">"+AlmtypeRusult[i].almTypeName+"</option>";
            }
            aunSnmodel2=1;
        }
    }

    function getQuerySntypeList(editjson){                 //查询探头类型
        var probeType = document.getElementById("probeType_input");
        if(aunSnmodel3==0){
            var SntypeList =  post_sync(null, "../../../../../QuerySntypeList.do");
            var SntypeRusult = SntypeList.result;
            probeType.options.length=0;
            for(var i=0; i<SntypeRusult.length; i++){
                probeType.innerHTML= probeType.innerHTML + "<option value="+SntypeRusult[i].snTypeName+">"+SntypeRusult[i].snTypeName+"</option>";
            }
            aunSnmodel3=1;
        }
        if(_global.popusName == 'editDeviceZone') {
            $("#probeType_input").val(editjson.snType);
        }
        $('#probeType_input').searchableSelect();
        $(".searchable-select-input").css({width:"192px"});
    }

    function _sure(flag) {
        if(flag){
            sure();
        }else {
            parent.parent.alertTip("请填写完整信息",2000,null);
        }
    }

    })(window,jQuery);















