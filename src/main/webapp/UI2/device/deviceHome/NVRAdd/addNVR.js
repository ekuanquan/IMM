/**
 * Created by ywhl on 2017/6/8.
 */
$(document).ready(function() {
    $("#signupForm").Validform({
        tiptype:2,
        btnSubmitId:"sure",
        callback:NVRhave
    });
    addNVRinit();
});

;(function(window,$){

    var areaId;
    var aun = 0;
    window.addNVRinit = _init;
    window.showLocation = _showLocation;
    window.getArea = _getArea;
    window.NVRhave = _NVRhave;

    //接收经纬度
    function _showLocation(location) {
        $("#line").val(location.x);
         $("#column").val(location.y);
        $("#line").blur();
        $("#column").blur();
    }
    function _init(){
        $("#close,#cancel").click(function(){parent.closePopus();});
        $("#areaname").click(function(){_devicePopusManager('openArea')});
        $("#choseplace").click(function(){setDeviceLocation()});

        $("#lenameCheckbox").click(function() {
            if ($(this).hasClass('isChecked')) {
                $(this).removeClass('isChecked').addClass('noChecked');
            }else{
                $(this).removeClass('noChecked').addClass('isChecked');
            }
        });
        //时间插件
        var newtime = getNowFormatDate();
        newtime = newtime.split(" ")[0];
        $("#installTime_input").val(newtime);
        $("#installTime_input").bind('focus',function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            this.blur();
        });

        /*$("#sure").click(function(){sureAddDevice()});*/
        $("#devModelId").click(function(){openDevicePlay();});
    }
        //发送经纬度
        function setDeviceLocation(){
            var line = $("#line").val();
            var column = $("#column").val();
            var location = {
                "x":line,
                "y":column
            };
            parent.setDeviceLocation(location);
            parent.devicePopusManager("addLocation");
        }

        //弹窗开始
        function _devicePopusManager(popusPage_str) {

            switch (popusPage_str) {
                case 'openArea':
                    _open_openArea();
                    break;
                default:
                    break;
            }
        }

        //树状页面弹窗
        function _open_openArea() {
            _openPopups($('body'),'../../shebeihtml/selectarea.html' , {
                width: 360,
                height: 539
            });
        };
        //弹窗结束
    //所属区域显示
    function _getArea(areaname){
        $("#areaname").val(areaname.name);
        areaId = areaname.id;
        $("#areaname").blur();
    }

    function sureAddDevice(){       //添加NVR有线设备

        var object = {
            "devId":pad2($("#devId").val()),
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
            "fMemo":$("#fMemo").val(),
            "manufacturer":$("#manufacturer").val()
        };
        //var end =   post_sync(object, "../../../../addDevice/addNVRno.do");
        //parent.alertTip(end.result.message,2000,null);
        //alert(end.result.message);
        post_async(object, "../../../../addDevice/addNVRno.do",backNVRadddata)
    }
    function backNVRadddata(data) {
        parent.alertTip(data.result.message,2000,null);
        //点击互联网NVR显示互联网NVR列表并刷新
        parent.clickdeviceright("NVR_tab");
    }
    function openDevicePlay(){          //打开设备型号下拉列表
        var devModelId = document.getElementById("devModelId");
        var model ;
        if(aun==0){
            model =  getDevModel();
            for(var i=0; i<model.length; i++){
               // devModelId.innerHTML= devModelId.innerHTML + "<option value="+model[i].devModelId+">"+model[i].devModelName+"</option>";
                $("#devModelId").append("<option value='"+model[i].devModelId+"'>"+model[i].devModelName+"</option>");
            }
            $("#ChannelNum").val(model[0].ChannelNum);
            aun=1;
        }
        /*$('#devModelId').change(function(){
            //$("#ChannelNum").val($('#devModelId').val());

            for(var n=0; n<model.length; n++){
                if($('#devModelId').val()==model[n].devModelId){
                    $("#ChannelNum").val(model[n].ChannelNum);
                }
            }
        });*/
    }

    function getDevModel(){              //拿到数据库设备型号
        var devType = {devType:10};
        var getMode = post_sync(devType, "../../../../addDevice/getDevModel.do");
        return  getMode;
    }

    function _NVRhave(flag) {
        if(flag){
            sureAddDevice();
        }else {
            parent.alertTip("请填写完整信息",2000,null);
        }
    }
    //设备编号长度最小为9位不足前面补零
    function pad2(num) {
        if ((num + "").length >= 9) return num;
        return pad2("0" + num);
    }

})(window,jQuery);