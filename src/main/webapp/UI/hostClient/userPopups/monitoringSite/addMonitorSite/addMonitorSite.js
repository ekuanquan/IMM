$(document).ready(function () {
    init();
});
;(function (window, $) {
    window.init = _init;

    var _config = {
        ajaxUrl: {
            addUserMonitorInfoUrl: '../../../../../addUserMonitorInfo.do',
            getDevIdUrl: '../../../../..//DropDown/getNVRDevIdDropByOwnerId.do',
            getDevZoneUrl: '../../../../../DropDown/getMonitorByDevId.do',
            getMonitorInfoByDevIdUrl: '../../../../../getMonitorInfoByDevId.do',
            updateUserMonitorInfoUrl:"/IntegratedMM/updateUserMonitorInfo.do"
        }
    };

    var _global = {
        popusName:''
    };

    function _init() {
        _initLayout();
        _initEvent();
    }

    function _initLayout() {
        getDevIdDropdown();
        var popusName = 'addMonitorSite';
        var editjson = "";
        if (parent.getPopupsName && typeof (parent.getPopupsName) == 'function') {
            popusName = parent.getPopupsName();
        }
        if (parent.getPopupsRowJson && typeof (parent.getPopupsRowJson) == 'function') {
            editjson = parent.getPopupsRowJson();
        }

        if (popusName == 'addMonitorSite') {
            $("#title_left").text("添加监控点");
        }
        if (popusName == 'editMonitorSite') {
            $("#title_left").text("修改监控点");

            $("#userMonitorId_input").val(editjson.ownerMonitorId).attr("title",editjson.ownerMonitorId);
            $("#devMonitorId_input").val(editjson.devMonitorId).attr("title",editjson.devMonitorId);
            $("#devId_input").val(editjson.devId).attr("title",editjson.devId);
            $("#cameraName_input").val(editjson.cameraName).attr("title",editjson.cameraName);
            $("#cameraAddr_input").val(editjson.cameraAddr).attr("title",editjson.cameraAddr);
            $("#channelNum_input").val(editjson.channelNum).attr("title",editjson.channelNum);
            $("#policeType_input").val(editjson.policeType).attr("title",editjson.policeType);
            $("#instTime_input").val(editjson.instTime).attr("title",editjson.instTime);
            $("#wantDo_input").val(editjson.wantDoName).attr("title",editjson.wantDoName);
            $("#cameraType_input").val(editjson.cameraTypeName).attr("title",editjson.cameraTypeName);
            $("#cameraModel_input").val(editjson.cameraModelName).attr("title",editjson.cameraModelName);
            $("#fMemo_input").val(editjson.fMemo).attr("title",editjson.fMemo);

            $("#contId_input").css({
                "pointer-events": "none",
                "opacity": "0.5",
                "background-color": "gray"
            });
            $("#confirmButton").text("确定");
        }
        else {

        }
    }

    function _initEvent() {
        $("#form").Validform({
            tiptype:2,
            btnSubmitId:"confirmButton",
            callback:_sure
        });
        $("#title_close").bind("click", function () {
            parent._closePopus();
        });
        $("#cancelButton").bind("click", function () {
            parent._closePopus();
        });
       /* $("#confirmButton").bind('click', function () {
            _submitDevice();
        });*/
        /* $('#instTime_input').click(function () {
         WdatePicker({
         dateFmt: 'yyyy-MM-dd HH:mm:ss',
         isShowClear: false
         });
         //this.blur();
         });*/
        $("#devId_input").bind('change', function () {
            var selectId = $("#devId_input").val();
            getDevZoneId(selectId,'change');
        });
        $("#devMonitorId_input").bind('change', function () {
            _getMonitorInfo();
        });
    }

    function _submitDevice() {
        _getRoleZoneParams();
        if (_global.popusName == 'addMonitorSite') {
            //getRoleZoneInfo();
            var params = _getRoleZoneParams();
            post_async(params, _config.ajaxUrl.addUserMonitorInfoUrl, _callback_addContact);
        }
        if (_global.popusName == 'editMonitorSite') {
            parent.parent.comfireFloat("确定修改用户监控点信息？",getRoleZoneInfo,null);
        }

    }
    function getRoleZoneInfo() {
        var params = _getRoleZoneParams();
        post_async(params, _config.ajaxUrl.updateUserMonitorInfoUrl, _callback_submitContact);
    }

    function _callback_submitContact(data) {
        var result = data.result;
        if (result.code == '200') {
            parent.refreshUserMonitor();
           // alert("提交成功");
            parent.parent.alertSuccess("用户监控点信息修改成功",null,null);
            parent._closePopus();
        } else{
            //alert("提交失败");
            parent.parent.alertSuccess("用户监控点信息修改失败",null,null);
        }

    }
    //添加监控点
    function _callback_addContact(data) {
        var result = data.result;
        if (result.code == '200') {
            parent.refreshUserMonitor();
            // alert("提交成功");
            parent.parent.alertSuccess("用户监控点信息添加成功",null,null);
            parent._closePopus();
        } else {
            //alert("提交失败");
            parent.parent.alertSuccess("用户监控点信息添加失败",null,null);
        }

    }

    function _getRoleZoneParams() {
        var params = {};
        if (parent.getPopupsName && typeof (parent.getPopupsName) == 'function') {
            _global.popusName = parent.getPopupsName();
        }
        var rowJson = parent.parent.getPopupsRowJson();
        params.ownerId = rowJson.userId;
        params.ownerMonitorId = $("#userMonitorId_input").val();
        params.devId = $("#devId_input").val();
        params.devMonitorId = $("#devMonitorId_input").find("option:selected").text();//$("#devMonitorId_input").val();
        return params;
    }

    function getDevIdDropdown() {
        var rowJson = parent.parent.getPopupsRowJson();
        var ownerId = rowJson.userId;
        post_async(
            {
                "ownerId": ownerId
            },
            _config.ajaxUrl.getDevIdUrl,
            devIdDrop_callback);
    }

    function devIdDrop_callback(data) {
        for (var i = 0; i < data.dropDownPojo.length; i++) {
            var $option = $("<option></option>");
            $option.attr('value', data.dropDownPojo[i].devId);
            $option.text(data.dropDownPojo[i].devId);
            $option.appendTo($("#devId_input"));
        }
        var editjson={};
        if (parent.getPopupsRowJson && typeof (parent.getPopupsRowJson) == 'function') {
            editjson = parent.getPopupsRowJson();
        }
        $("#devId_input option[value='"+ editjson.devId +"']").attr("selected",true);
        var selectId = $("#devId_input option:selected").val();
        getDevZoneId(selectId);
    }

    function getDevZoneId(devId,strChange) {
        post_async(
            {
                "devId": devId
            },
            _config.ajaxUrl.getDevZoneUrl,
            devZone_callback,strChange);
    }

    function devZone_callback(data,strChange) {
        $("#devMonitorId_input").text('');
        for (var i = 0; i < data.dropDownPojo.length; i++) {
            var $option = $("<option></option>");
            $option.attr('value',data.dropDownPojo[i].devId);
            $option.text(data.dropDownPojo[i].devMonitorId);
            $option.appendTo($("#devMonitorId_input"));
        }
        var popusName = 'addMonitorSite';
        var editjson = "";
        if (parent.getPopupsName && typeof (parent.getPopupsName) == 'function') {
            popusName = parent.getPopupsName();
        }
        if (parent.getPopupsRowJson && typeof (parent.getPopupsRowJson) == 'function') {
            editjson = parent.getPopupsRowJson();
        }
        if (popusName == 'editMonitorSite') {
            $("#title_left").text("修改用户监控点");
            if(strChange != 'change'){
                $("#userMonitorId_input").val(editjson.ownerMonitorId);
                //$("#devId_input option[value='"+ editjson.devId +"']").attr("selected",true);
                $("#devMonitorId_input option").each(function () {
                    if(editjson.devMonitorId == $(this).text()){
                        $(this).attr("selected",true);
                    };
                });
            }

           /* $("#devMonitorId_input option[value='"+ editjson.devZoneId +"']").attr("selected",true);*/
            /*$("#devMonitorId_input").text(editjson.devMonitorId).attr("selected",true)*/
            $("#userMonitorId_input").css({
                "pointer-events": "none",
                "opacity": "0.5",
                "background-color": "gray"
            });
            $("#confirmButton").text("确定");
        }
        _getMonitorInfo();
    }

    function changeDevZone() {

    }

    function _getMonitorInfoParams() {
        var params = {
            devId: $("#devMonitorId_input").val()//$("#devMonitorId_input").find("option:selected").text()
        };
        return params;
    }

    function _getMonitorInfo() {
        var params = _getMonitorInfoParams();
        post_async(params, _config.ajaxUrl.getMonitorInfoByDevIdUrl, _callback_getMonitorInfo);
    }

    function _callback_getMonitorInfo(data) {
        var result = data.result;
        if (result.code == '0') {
            _showMonitorInfo(data.monitorInfo);
        }
    }

    function _showMonitorInfo(json) {
        _clearMonitorInfo();

        $("#cameraName_input").text(json.cameraName).attr("title",json.cameraName);
        $("#cameraAddr_input").text(json.atPos).attr("title",json.atPos);
        $("#channelNum_input").text(json.devChannelId).attr("title",json.devChannelId);
        //$("#policeType_input").text(json.almTypeName).attr("title",json.almTypeName);
        if(json.almTypeName == "" || json.almTypeName == null){json.almTypeName = json.almType};
        $("#policeType_input").text(json.almTypeName).attr("title",json.almTypeName);
        $("#instTime_input").text(json.instDate).attr("title",json.instDate);
        //$("#wantDo_input").text(json.wantDoName).attr("title",json.wantDoName);
        if(json.wantDoName == "" || json.wantDoName == null){json.wantDoName = json.wantDo};
        $("#wantDo_input").text(json.wantDoName).attr("title",json.wantDoName);
        if(json.cameraTypeName == "" || json.cameraTypeName == null){json.cameraTypeName = json.cameraType};
        $("#cameraType_input").text(json.cameraTypeName).attr("title",json.cameraTypeName);
        $("#cameraModel_input").text(json.cameraModelName).attr("title",json.cameraModelName);
        $("#fMemo_input").val(json.fMemo).attr("title",json.fMemo);

    }

    function _clearMonitorInfo() {

        $("#cameraName_input").text('');
        $("#cameraAddr_input").text('');
        $("#channelNum_input").text('');
        $("#policeType_input").text('');
        $("#instTime_input").text('');
        $("#wantDo_input").text('');

        $("#cameraType_input").text('');
        $("#cameraModel_input").text('');
        $("#fMemo_input").val('');
    }
    function _sure(flag) {
        if(flag){
            _submitDevice();
        }else{
            parent.parent.alertTip("请填写完整正确的信息！",2000,null);

        }
    }
})(window, jQuery);