/**
 * Created by ywhl on 2017/6/8.
 */
$(document).ready(function() {
    $("#signupForm").Validform({
        tiptype:2,
        btnSubmitId:"sure",
        callback:NVRhave
    });
    selectNVRinit();
});

;(function(window,$){

    var userId;
    var devId;
    var areaId;
    var aun=0;
    window.selectNVRinit = _init;
    window.showLocation = _showLocation;
    window.showareaname = _showareaname;
    window.NVRhave = _NVRhave;


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
     //   openDevicePlay();
        $("#devModelId").click(function(){openDevicePlay()});
        /*$("#sure").click(function(){
            parent.parent.comfireFloat("您真的确定要修改吗？",update,cancelCallback)
            //update()
        });*/

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

    //查询nvr无线信息
    function _initData(){
        var deviceData = parent.parent.parent.parent.getPopupsRowJson();
        //post_async({"devId": deviceData.devId},"../../../../QueryWirenvrInfo.do",_devzone_callback);
        var data = post_sync({"devId": deviceData.devId},"../../../../QueryNetnvrInfo.do");
        _devzone_callback(data);
    }

    function _devzone_callback(Data){
        var deviceData = Data.result;
        devId = deviceData.devId;
        $("#devId").val(devId);
        $("#devName").val(deviceData.devName);
        $("#pnlActID").val(deviceData.pnlActID);
        $("#openarea").val(deviceData.areaName);
        areaId = deviceData.areaId;
        // $("#devType").val(deviceData.devTypeName);

        var devModelId = document.getElementById("devModelId");
        devModelId.innerHTML= devModelId.innerHTML + "<option value="+deviceData.devModelId+">"+deviceData.devModelName+"</option>";
        $("#devModel").val(deviceData.devModelId);

        $("#devLoginName").val(deviceData.devLoginName);
        $("#devLoginPwd").val(deviceData.devLoginPwd);
        $("#devTUTKID").val(deviceData.devTUTKID);
        $("#installTime_input").val(deviceData.devInstDate);
        $("#line").val(deviceData.devLng);
        $("#column").val(deviceData.devlat);
        $("#ChannelNum").val(deviceData.ChannelNum);
        $("#pnlAddr").val(deviceData.pnlAddr);
        $("#instMan").val(deviceData.instMan);
        $("#instUnit").val(deviceData.instUnit);
        $("#videoServer").val(deviceData.videoServer);
        $("#fMemo").val(deviceData.fMemo);
        $("#manufacturer").val(deviceData.manufacturer);
        if(deviceData.userId==null||deviceData.userId==''||deviceData.userId==undefined){
            /*$("#host").remove();*/
            $("#host").addClass('noPoint');
        }
        userId = deviceData.userId;
        $("#host").click(function(){isowner()});
    }

    function openDevicePlay(){          //打开设备型号下拉列表
        var devModelId = document.getElementById("devModelId");
        if(aun==0){
            var model =  getDevModel();
            devModelId.options.length=0;
            for(var i=0; i<model.length; i++){
              //  devModelId.innerHTML= devModelId.innerHTML + "<option value="+model[i].devModelId+">"+model[i].devModelName+"</option>";
                $("#devModelId").append("<option value='"+model[i].devModelId+"'>"+model[i].devModelName+"</option>");
            }
            aun=1;
        }
    }
    function getDevModel(){              //拿到数据库设备型号
        var devType = {devType:10};
        var getMode = post_sync(devType, "../../../../addDevice/getDevModel.do");
        return  getMode;
    }

    //修改nvr无线
    function update(){
        //if(sureadd()==false){return;}
        var json= {
            "devId":devId,
            "devName":$("#devName").val(),
            "pnlActID":$("#pnlActID").val(),
            "areaId":areaId,
            "devType":10,
            "devModelId":$("#devModelId").val(),
            "devLoginName":$("#devLoginName").val(),
            "devLoginPwd":$("#devLoginPwd").val(),
            "devTUTKID":$("#devTUTKID").val(),
            "devInstDate":$("#installTime_input").val(),
            "devLng":$("#line").val(),
            "devlat":$("#column").val(),
            "ChannelNum":$("#ChannelNum").val(),
            "pnlAddr":$("#pnlAddr").val(),
            "instMan":$("#instMan").val(),
            "instUnit":$("#instUnit").val(),
            "videoServer":$("#videoServer").val(),
         //   "videoServer":"：9000/"+devId+":8000:HIK:"+$("#ChannelNum").val()+"0:"+$("#devLoginName").val()+":"+$("#devLoginPwd").val()+"/av_stream",
            "fMemo":$("#fMemo").val(),
            "manufacturer":$("#manufacturer").val()
        }
        var end =  post_sync(json, "../../../../ModifyNetnvrattr.do");
        parent.parent.alertTip(end.message,2000,null);
        //alert(end.message);
    }

    function sureadd() {
        var msg = "您真的确定要修改吗？\n\n请确认！";
        if (confirm(msg)==true){
            return true;
        }else{
            return false;
        }
    }
    function cancelCallback() {

    }
    function isowner(){     //相关机主点击事件
        parent.parent.devicePopusManager('openRelated',userId);
    }

    function _NVRhave(flag) {
        if(flag){
            parent.parent.comfireFloat("确定修改互联网NVR信息？",update,cancelCallback);
        }else {
            parent.parent.alertTip("请填写完整信息",2000,null);
        }
    }

})(window,jQuery);