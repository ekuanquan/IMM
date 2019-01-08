/**
 * Created by ywhl on 2017/6/8.
 */
$(document).ready(function() {
    selectNVRinit();
});

;(function(window,$){

    var devId;
    var areaId;
    var aun=0;
    window.selectNVRinit = _init;
    window.showLocation = _showLocation;
    window.showareaname = _showareaname;


    //接收经纬度
    function _showLocation(location1){
        $("#line").val(location1.x);
        $("#column").val(location1.y);
    }
    function _init() {
        $("#cancel").click(function(){parent.parent.closePopus()});
       /* $("#openarea").click(function(){parent.devicePopusManager('openArea')});*/
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
       /* $("#installTime_input").bind('focus', function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            //this.blur();
        });*/
        _initData();
     //   openDevicePlay();
        $("#devModelId").click(function(){openDevicePlay()});
        $("#sure").click(function(){update()});

    }

        //发送经纬度
        function setDeviceLocation(){
            var line = $("#line").val();
            var column = $("#column").val();
            var location = {
                "x":line,
                "y":column
            };
            parent.parent.parent.setDeviceLocation(location);
            parent.parent.parent.devicePopusManager("openLocation");
            /*parent.parent.parent.devicePopusManager("addLocation");*/
        }
        //接收经纬度
        function _showLocation(location1){
            $("#line").val(location1.x);
            $("#column").val(location1.y);
        }
        //显示弹窗树返回的数据
        function _showareaname(areaname){
            $("#openarea").val(areaname.name);
            areaId = areaname.id;
        }

    //查询nvr无线信息
    function _initData(){
        var deviceData = parent.parent.getdevId();
        //post_async({"devId": deviceData.devId},"../../../../QueryWirenvrInfo.do",_devzone_callback);
        var data = post_sync({"devId": deviceData},"../../../QueryNetnvrInfo.do");
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
            $("#host").remove();
        }
        $("#host").click(function(){isowner()});
    }

    function openDevicePlay(){          //打开设备型号下拉列表
        var devModelId = document.getElementById("devModelId");
        if(aun==0){
            var model =  getDevModel();
            devModelId.options.length=0;
            for(var i=0; i<model.length; i++){
                devModelId.innerHTML= devModelId.innerHTML + "<option value="+model[i].devModelId+">"+model[i].devModelName+"</option>";
            }
            aun=1;
        }
    }
    function getDevModel(){              //拿到数据库设备型号
        var devType = {devType:9};
        var getMode = post_sync(devType, "../../../../addDevice/getDevModel.do");
        return  getMode;
    }

    //修改nvr无线
    function update(){
        if(sureadd()==false){return;}
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
        alert(end.message);
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
        alert("asdfasfasfasfasfas");
    }

})(window,jQuery);