/**
 * Created by ywhl on 2017/6/8.
 */
$(document).ready(function() {
    $("#signupForm").Validform({
        tiptype:2,
        btnSubmitId:"sure",
        callback:NVRWiresure
    });
    selectNVRinit();
});

;(function(window,$){

    var userId;
    var devId ;
    var areaId;
    var aun=0;
    window.selectNVRinit = _init;
    window.showLocation = _showLocation;
    window.showareaname = _showareaname;
    window.NVRWiresure = _NVRWiresure;

    //接收经纬度
    function _showLocation(location1){
        $("#line").val(location1.x);
        $("#column").val(location1.y);
        $("#line").blur();
        $("#column").blur();
    }
    function _init() {
        $("#cancel").click(function(){parent.parent.closePopus()});
        $("#openarea").click(function(){parent.devicePopusManager('openArea')});
        $("#choseplace").click(function () {
            setDeviceLocation()
        });

        $("#lenameCheckbox").click(function () {
            if ($(this).hasClass('isChecked')) {
                $(this).removeClass('isChecked').addClass('noChecked');
            } else {
                $(this).removeClass('noChecked').addClass('isChecked');
            }
        });
        //时间插件
        $("#installTime_input").bind('focus', function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            this.blur();
        });
        _initData();
        /*$("#sure").click(function(){
            parent.parent.comfireFloat("您真的确定要修改吗？",update,cancelCallback)
            //update()
        });*/
        $("#devModelId").click(function(){openDevicePlay();});

    //    openDevicePlay();
    }

        //发送经纬度
        function setDeviceLocation(){
            var line = $("#line").val();
            var column = $("#column").val();
            var location = {
                "x":line,
                "y":column
            };
            parent.parent.setDeviceLocation(location);
            parent.parent.devicePopusManager("addLocation");
        }
        //接收经纬度
        function _showLocation(location1){
            $("#line").val(location1.x);
            $("#column").val(location1.y);
            $("#line").blur();
            $("#column").blur();
        }
        //显示弹窗树返回的数据
        function _showareaname(areaname){
            $("#openarea").val(areaname.name);
            areaId = areaname.id;
            $("#openarea").blur();
        }
    //查询nvr信息
    function _initData(){
        var deviceData = parent.parent.parent.parent.getPopupsRowJson();
        //post_async({"devId": deviceData.devId},"../../../../QueryWirenvrInfo.do",_devzone_callback);
        var data = post_sync({"devId": deviceData.devId},"../../../../QueryWirenvrInfo.do");
        _devzone_callback(data);
    }

    function _devzone_callback(Data){
        var deviceData = Data.result;
        devId = deviceData.devId;
        areaId= deviceData.areaId;
        $("#devId").val(devId);
        $("#devName").val(deviceData.devName);
        $("#pnlActID").val(deviceData.pnlActID);
        $("#openarea").val(deviceData.areaName);
       // $("#devType").val(deviceData.devTypeName);
        var devModelId = document.getElementById("devModelId");
        devModelId.innerHTML= devModelId.innerHTML + "<option value="+deviceData.devModelId+">"+deviceData.devModelName+"</option>";
        $("#devModel").val(deviceData.devModelId);

        $("#devLoginName").val(deviceData.devLoginName);
        $("#devLoginPwd").val(deviceData.devLoginPwd);
        $("#devIp").val(deviceData.devIp);
        $("#installTime_input").val(deviceData.devInstDate);
        $("#line").val(deviceData.devLng);
        $("#column").val(deviceData.devlat);
        $("#ChannelNum").val(deviceData.ChannelNum);
        $("#pnlAddr").val(deviceData.pnlAddr);
        $("#instMan").val(deviceData.instMan);
        $("#instUnit").val(deviceData.instUnit);
        $("#videoServer").val(deviceData.videoServer);
        $("#devPort").val(deviceData.devPort);
        $("#fMemo").val(deviceData.fMemo);
        $("#manufacturer").val(deviceData.manufacturer);
        if(deviceData.userId==null||deviceData.userId==''||deviceData.userId==undefined){
            /*$("#host").remove();*/
            $("#host").addClass('noPoint');
        }
        userId = deviceData.userId;
        $("#host").click(function(){isowner()});
    }

    //修改nvr有线
    function update(){
        //if(sureadd()==false){return;}
        var json= {
            "devId":devId,
            "devName":$("#devName").val(),
            "pnlActID":$("#pnlActID").val(),
            "areaId":areaId,
            "devType":9,
            "devModelId":$("#devModelId").val(),
            "devLoginName":$("#devLoginName").val(),
            "devLoginPwd":$("#devLoginPwd").val(),
            "devIp":$("#devIp").val(),
            "devInstDate":$("#installTime_input").val(),
            "devLng":$("#line").val(),
            "devlat":$("#column").val(),
            "ChannelNum":$("#ChannelNum").val(),
            "pnlAddr":$("#pnlAddr").val(),
            "instMan":$("#instMan").val(),
            "instUnit":$("#instUnit").val(),
            "videoServer":$("#videoServer").val(),
            "devPort":$("#devPort").val(),
            "fMemo":$("#fMemo").val(),
            "manufacturer":$("#manufacturer").val()
        }
        var end =  post_sync(json, "../../../../ModifyWirenvrattr.do");
        parent.parent.alertTip(end.message,2000,null);
        //alert(end.message);
    }
    function cancelCallback() {

    }

    function openDevicePlay(){          //打开设备型号下拉列表
        var devModelId = document.getElementById("devModelId");
        if(aun==0){
            var model =  getDevModel();
            devModelId.options.length=0;
            for(var i=0; i<model.length; i++){
                //devModelId.innerHTML= devModelId.innerHTML + "<option value="+model[i].devModelId+">"+model[i].devModelName+"</option>";
                $("#devModelId").append("<option value='"+model[i].devModelId+"'>"+model[i].devModelName+"</option>");
            }
            aun=1;
        }
    }

    function getDevModel(){              //拿到数据库设备型号
        var devType = {devType:9};
        var getMode = post_sync(devType, "../../../../addDevice/getDevModel.do");
        return  getMode;
    }

    function sureadd() {
        var msg = "您真的确定要修改吗？\n\n请确认！";
        if (confirm(msg)==true){
            return true;
        }else{
            return false;
        }
    }

    function isowner(){     //相关机主点击事件
        parent.parent.devicePopusManager('openRelated',userId);
    }

    function _NVRWiresure(flag) {
        if(flag){
            parent.parent.comfireFloat("确定修改有线NVR信息？",update,cancelCallback)
        }else {
            parent.parent.alertTip("请填写完整信息",2000,null);
        }
    }

})(window,jQuery);