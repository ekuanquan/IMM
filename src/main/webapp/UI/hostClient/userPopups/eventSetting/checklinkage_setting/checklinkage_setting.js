$(document).ready(function () {
    init();
});
;
(function (window, $, undefined) {
    window.init = _init;
    var _config = {
        ajaxUrl: {
            getGetCameraListUrl: '/IntegratedMM/GetCameraListByUid.do',
            checkSvaeLinkageSetting: '/IntegratedMM/eventSetting/checkSvaeLinkageSetting.do'
        },
        row_json: ""
    };

    var _global = {
        userPojo: {
            userId: ""
        }
    };

    var UserEvtData = parent.parent.getUserEvtData();
    var cameraIdList = [];


    function _init() {
        console.log('进入选中后的联动设置！');
        if(null!=UserEvtData.cameraIdList&&''!=UserEvtData.cameraIdList){
            cameraIdList = UserEvtData.cameraIdList.split(';');
        }

        _initEvent();
        _initData();
    }

    function _initData() {

        getGetCameraList();
    }

    function _initEvent() {
        $('#cancel,#close').bind('click', function (e) {
            parent.parent.closeMapPopus();
        });

        $('#save').bind('click', function (e) {
            _save();
        });
    }

    function getGetCameraListParams() {
        var params = {
            ownerId: _global.userPojo.userId
        };

        return params;
    }

    function clearTable() {
        $(".row_main").text('');
    }

    function getGetCameraList() {
        var rowJson = parent.parent.getPopupsRowJson();
        var userId = rowJson.userId;
        _global.userPojo.userId = userId;
        var params = getGetCameraListParams();
        post_async(params, _config.ajaxUrl.getGetCameraListUrl, callback_getGetCameraList);
    }

    function callback_getGetCameraList(data) {
        clearTable();
        if (data.code == 1000) {
            var jsonPojos = data.result;
            for (var i = 0; i < jsonPojos.length; i++) {
                addRow(jsonPojos[i]);
            }
        }
    }

    function addRow(row_json) {
        $div_row = $("<div></div>");
        $div_choose = $("<div></div>");
        $div_Checked = $("<div></div>");
        $userMonitorId = $("<div></div>");
        $devMonitorId = $("<div></div>");
        $devId = $("<div></div>");
        $cameraName = $("<div></div>");
        $cameraAddr = $("<div></div>");
        $channelNum = $("<div></div>");
        $policeType = $("<div></div>");
        $instTime = $("<div></div>");
        $wantDo = $("<div></div>");
        $cameraType = $("<div></div>");
        $cameraModel = $("<div></div>");
        $fMemo = $("<div></div>");

        $div_row
            .append($div_choose)
            .append($userMonitorId)
            .append($devMonitorId)
            .append($devId)
            .append($cameraName)
            .append($cameraAddr)
            .append($channelNum)
            .append($policeType)
            .append($instTime)
            .append($wantDo)
            .append($cameraType)
            .append($cameraModel)
            .append($fMemo)
            .addClass('row_row')
            .attr('id', row_json.ownerMonitorId);
        $div_choose.addClass('choose').append($div_Checked);
        $div_Checked.addClass('noChecked').attr('id', row_json.cameraId);
        $userMonitorId.addClass('ownerMonitorId').text(row_json.ownerMonitorId).attr("title", row_json.ownerMonitorId);
        $devMonitorId.addClass('devMonitorId').text(row_json.devMonitorId).attr("title", row_json.devMonitorId);
        $devId.addClass('devId').text(row_json.devId).attr("title", row_json.devId);
        $cameraName.addClass('cameraName').text(row_json.cameraName).attr("title", row_json.cameraName);
        $cameraAddr.addClass('cameraAddr').text(row_json.atPos).attr("title", row_json.atPos);
        $channelNum.addClass('channelNum').text(row_json.devChannelId).attr("title", row_json.devChannelId);
        if (row_json.almTypeName == "" || row_json.almTypeName == null) {
            row_json.almTypeName = row_json.almType
        }
        ;
        $policeType.addClass('policeType').text(row_json.almTypeName).attr("title", row_json.almTypeName);
        $instTime.addClass('instTime').text(row_json.instDate).attr("title", row_json.instDate);
        if (row_json.wantDoName == "" || row_json.wantDoName == null) {
            row_json.wantDoName = row_json.wantDo
        }
        ;
        $wantDo.addClass('wantDo').text(row_json.wantDoName).attr("title", row_json.wantDoName);
        if (row_json.cameraTypeName == "" || row_json.cameraTypeName == null) {
            row_json.cameraTypeName = row_json.cameraType
        }
        ;
        $cameraType.addClass('cameraType').text(row_json.cameraTypeName).attr("title", row_json.cameraTypeName);
        if (row_json.cameraModelName == "" || row_json.cameraModelName == null) {
            row_json.cameraModelName = row_json.cameraModelId
        }
        ;
        $cameraModel.addClass('cameraModel').text(row_json.cameraModelName).attr("title", row_json.cameraModelName);
        $fMemo.addClass('fMemo').text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($(".row_main"));

        $div_Checked.bind('click', function (e) {
            var $this = $(this);
            if ($('.isChecked').length < 9) {
                if ($this.hasClass('noChecked')) {
                    $this.removeClass('noChecked').addClass('isChecked');
                } else {
                    $this.removeClass('isChecked').addClass('noChecked');
                }
            } else {
                parent.alertFail("最多支持选择9路联动设备!", 2000, null);
            }
        });

        for (var i = 0; i < cameraIdList.length; i++) {
            var cameraId = row_json.cameraId
            if (cameraId == cameraIdList[i]) {
                $div_Checked.removeClass('noChecked').addClass('isChecked');
            }
        }
    }

    function _save() {
        var param = {};
        param.UserEvtId = UserEvtData.UserEvtId;
        var l = $('.isChecked').length;
        var value = $('.isChecked');
        var cameraIdList = '';
        for (var i = 0; i < l; i++) {
            var cameraId = value[i].id;
            cameraIdList = cameraIdList + cameraId + ';';
        }
        param.cameraId = cameraIdList;
        console.log('_save: ' + JSON.stringify(param));
        post_async(param, _config.ajaxUrl.checkSvaeLinkageSetting, _saveCallBack);
    }

    function _saveCallBack(data) {
        if (data.result.code == 200) {
            parent.parent.mainDivIframe.eventSettingIframe.showEventSettingList("");
            setTimeout(function () {
                parent.parent.closeMapPopus();
            }, 1000);
            parent, parent.alertSuccess("视频联动设置保存成功", 2000, null);
        }
    }

})(window, jQuery, undefined);