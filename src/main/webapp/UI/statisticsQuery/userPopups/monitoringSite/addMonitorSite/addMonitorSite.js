$(document).ready(function () {
    init();
});
;(function (window, $) {
    window.init = _init;

    var _config = {
        ajaxUrl: {
            addUserMonitorInfoUrl: '../../../../../addUserMonitorInfo.do',
            getDevIdUrl: '../../../../..//DropDown/getNVRDevIdDropByRoleId.do',
            getDevZoneUrl: '../../../../../DropDown/getMonitorByDevId.do',
            getMonitorInfoByDevIdUrl: '../../../../../getMonitorInfoByDevId.do'
        }
    };

    var _global = {};

    function _init() {
        _initLayout();
        _initEvent();
    }

    function _initLayout() {
        getDevIdDropdown();
        var popusName = 'addrdPrePlan';
        var editjson = "";
        if (parent.getPopupsName && typeof (parent.getPopupsName) == 'function') {
            popusName = parent.getPopupsName();
        }
        if (parent.getPopupsRowJson && typeof (parent.getPopupsRowJson) == 'function') {
            editjson = parent.getPopupsRowJson();
        }

        if (popusName == 'addrdPrePlan') {
            $("#title_left").text("添加监控点");
        }
        if (popusName == 'editMonitorSite') {
            $("#title_left").text("修改监控点");

            $("#userMonitorId_input").val(editjson.userMonitorId);
            $("#devMonitorId_input").val(editjson.devMonitorId);
            $("#devId_input").val(editjson.devId);
            $("#cameraName_input").val(editjson.cameraName);
            $("#cameraAddr_input").val(editjson.cameraAddr);
            $("#channelNum_input").val(editjson.channelNum);
            $("#policeType_input").val(editjson.policeType);
            $("#instTime_input").val(editjson.instTime);
            $("#wantDo_input").val(editjson.wantDo);
            $("#cameraType_input").val(editjson.cameraType);
            $("#cameraModel_input").val(editjson.cameraModel);
            $("#fMemo_input").val(editjson.fMemo);

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
        $("#title_close").bind("click", function () {
            parent._closePopus();
        });
        $("#cancelButton").bind("click", function () {
            parent._closePopus();
        });
        $("#confirmButton").bind('click', function () {
            _submitDevice();
        });
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
        var params = _getRoleZoneParams();
        post_async(params, _config.ajaxUrl.addUserMonitorInfoUrl, _callback_submitContact);
    }

    function _callback_submitContact(data) {
        var result = data.result;
        if (result.code == '0') {
            parent.refreshUserMonitor();
            alert("提交成功");
            parent._closePopus();
        } else if (result.code == '2') {
            alert("此用户监控点已存在");
        } else {
            alert("提交失败");
        }

    }

    function _getRoleZoneParams() {
        var params = {};
        var popusName = 'addrdPrePlan';
        params.operation = '';
        params.userMonitorPojo = {};
        if (parent.getPopupsName && typeof (parent.getPopupsName) == 'function') {
            popusName = parent.getPopupsName();
        }
        if (popusName == 'addrdPrePlan') {
            params.operation = 'add';
        }
        if (popusName == 'editMonitorSite') {
            params.operation = 'alter';
        }
        var rowJson = parent.parent.getPopupsRowJson();
        params.userMonitorPojo.roleId = rowJson.roleId;
        params.userMonitorPojo.userMonitorId = $("#userMonitorId_input").val();
        params.userMonitorPojo.devId = $("#devId_input").val();
        params.userMonitorPojo.devMonitorId = $("#devMonitorId_input").find("option:selected").text();//$("#devMonitorId_input").val();
      /*  params.userMonitorPojo.x = 0;
        params.userMonitorPojo.y = 0;*/
        return params;
    }

    function getDevIdDropdown() {
        var rowJson = parent.parent.getPopupsRowJson();
        var roleId = rowJson.roleId;
        post_async(
            {
                "roleId": roleId
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
        var popusName = 'addrdPrePlan';
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
                $("#userMonitorId_input").val(editjson.userMonitorId);
                $("#devId_input option[value='"+ editjson.devId +"']").attr("selected",true);
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

        $("#cameraName_input").text(json.cameraName);
        $("#cameraAddr_input").text(json.atPos);
        $("#channelNum_input").text(json.devChannelId);
        $("#policeType_input").text(json.almTypeName);
        $("#instTime_input").text(json.instDate);
        $("#wantDo_input").text(json.wantDoName);

        $("#cameraType_input").text(json.cameraTypeName);
        $("#cameraModel_input").text(json.cameraModelName);
        $("#fMemo_input").val(json.fMemo);

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
})(window, jQuery);