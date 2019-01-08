/**
 * Created by 123 on 2017/11/19.
 */
$(document).ready(function () {
    $(".registerform").Validform({
        tiptype:2,
        btnSubmitId:"confirmButton",
        callback:sure
    });
    init();
});
;(function (window, $) {
    window.init = _init;
    window.sure = _sure;
    window.setAreaName = _setAreaName;
    window.isEmpty = isEmpty;

    var _config ={
        ajaxUrl:{
            getDevModelUrl:'/IntegratedMM/addDevice/getDevModel.do',
            ownerAddAlarmhostUrl:"/IntegratedMM/addDevice/ownerAddAlarmhost.do"
        }
    };
    var _global = {
        top:parent.parent,
        devPojo:{
            "devId": "1000F031A",           //设备编号
            "areaId": "201407121707409090", //区域编号
            "devType": "1",                 //设备类型
            "devModelId": "220",            //设备型号
            "devInstDate": "2017-11-20",    //设备安装时间
            "devLng": "114.47", //设备经度
            "devlat": "36.6", //设备纬度
            "manufacturer": "海康"          // 厂商
        },
        data:"",
        popupsName:"",
        bool:true
    };

    function _init() {
        _initData();
        _initEvent();
    }
    function _initData() {
        //获取设备型号下拉列表
        _getdevModellist();
        if (parent.getTopPopupsName && typeof (parent.getTopPopupsName) == 'function') {
            _global.popupsName = parent.getTopPopupsName();
        }
    }
    //事件绑定函数
    function _initEvent() {
        //select可输入
        $('#devId').editableSelect({
            effects: 'default',
        });
        $("#devId_sele").attr("maxlength","9").attr("datatype","16number").attr("nullmsg","设备编号不能为空").attr("errormsg","请输入设备编号").attr("onblur","isEmpty('devId_sele');");
        $("#devId_sele").bind("input propertychange",function(){
            var devId = $("#devId_sele").val();
            if(devId.length>=6){
                var param = {
                    type:"devUsed",
                    value:devId
                };
                post_async(param,"/IntegratedMM/identifier/queryIdByLike.do",_callback_getownerId)
            }else{
                $("#devId_editable-select-options ul").empty();
            }

        });
        $("#title_close,#cancelButton").click(function () {
            //parent.closePopus();
            _closeselectarea();
        });
        $('#areaName').click(function () {
            //parent.open_devArea();
            if (_global.popupsName == 'addOwnerUser') {
                //parent.open_devArea();
                parent.open_realdevArea();
            } else if (_global.popupsName == 'alterOwnerUser') {
                parent.open_realdevArea();
            }
        });
        //失去焦点后将值赋给devId input
        $("#devId_sele").bind("blur",function(){
            $("#devId").val($("#devId_sele").val());
            //console.log($("#devId").val());
        })
    }
    function _getdevModellist() {
        var params = {devType:"1"};
        post_async(params, _config.ajaxUrl.getDevModelUrl, getdevType_callback);
    }
    /************************************************
     获取设备型号下拉数据
     ************************************************/
    function getdevType_callback(data){
        var $option = $("<option></option>");
        $option.attr('value',-1);
        $option.text("");
        $option.appendTo($("#devModelId"));
        var $option = $("<option></option>");
        for (var i = 0;i<data.length;i++){
            var $option = $("<option></option>");
            $option.attr('value',data[i].devModelId);
            $option.text(data[i].devModelName);
            $option.appendTo($("#devModelId"));
        }

        //$('#devType').searchableSelect();
    }
    /************************************************
     获取所属区域
     ************************************************/
    function _setAreaName(area) {
        $("#areaName").val(area.name);
        var areaId = area.id;
        $("#areaName").data('areaId', areaId);
        console.log(area.name+":"+area.id);
        $("#areaName").blur();
    }
    //点击保存
    function _sure(flag){
        isEmpty('devId_sele');
        if(_global.bool){
            if(flag){
                _submitOwnerInfo();
            }else{
                _global.top.alertWarn("请填写完整信息",2000,null);
            }
        }
    }
    //保存添加
    function _submitOwnerInfo() {
        var params = _getdevdata();
        post_async(params,_config.ajaxUrl.ownerAddAlarmhostUrl,callback_keepdev)
    }
    //获取界面信息
    function _getdevdata() {
        var params = _global.devPojo;
        params.devId = $("#devId").val();
        params.devModelId = $("#devModelId").val();
        params.areaId = $("#areaName").data('areaId');
        var nowTime = getNowFormatDate();
        nowTime = nowTime.split(" ")[0];
        params.devInstDate = nowTime;
        params.platformId=parent.parent.getMain().platform_id;
        return params;
    }
    //保存设备信息的回调
    function callback_keepdev(data) {
        _global.data = data;
        if(data.result.code == "200"){
            _global.top.alertTip("添加成功",2000,_RefreshdevList);
            //parent.closePopus();
        }
        else {
            _global.top.alertTip(data.message,2000,null);
        }
    }

    function _closeselectarea() {
        /*alert("1314")*/
        /*parent._closePopus();*/
        if(parent._closeCusPopus) {
            parent._closeCusPopus();
        }
        if(parent._closePopus) {
            parent._closePopus();
        }
        if(parent.closeMapPopus) {
            parent.closeMapPopus();
        }

    }
    function _RefreshdevList() {
        parent.associatedDeviceIframe.addraleRow(_global.data.json[0]);
        _closeselectarea()
    }
    function isEmpty(field){
        var textValue = $("#"+field).val();
        if(textValue != ""){
            post_async(
                {
                    "validateName":"devId",
                    "validateValue":textValue
                },
                "/IntegratedMM/validate/isCanUse.do",
                validate_callback);
        }
        else{

        }
    }
    function validate_callback(data){
        if(data.result.code == "0"){
            _global.bool=true;
            $("#devId_sele").next().removeClass("Validform_wrong").addClass("Validform_right");
        }else if(data.result.code == "1"){
            _global.bool=true;
            _global.top.alertFail("该设备编号已经存在",2000,null);
            $("#devId_sele").next().removeClass("Validform_right").addClass("Validform_wrong");
        }else if(data.result.code == "2"){
            _global.bool=false;
            _global.top.alertFail("该设备编号格式有误",2000,null);
            $("#devId_sele").next().removeClass("Validform_right").addClass("Validform_wrong");
        }
    }
    //获取可用的编号
    function _callback_getownerId(data) {
        $("#devId_editable-select-options ul").empty();
        if(data.result.code&&data.result.code=="200"){
            var length = data.values.length;
            if(length>5){length=5;}
            for(var i=0;i<length;i++){
                var $option =$("<li></li>");
                $option.attr("value",i);
                $option.text(data.values[i]);
                $option.attr("style","display: list-item;");
                $option.appendTo($("#devId_editable-select-options > ul"));
            }
            $("#devId_editable-select-options").css("display","block");
        }
        $("#devId_editable-select-options ul li").bind("mousedown",function () {
            $("#devId_sele").val(this.innerHTML);
        }).bind("mouseover",function () {
            this.siblings().removeClass("selected");
            this.addClass("selected");
        })
    }


})(window, jQuery);