$(document).ready(function () {
    var row_json = {
        "cameraName": "555545",
        "cameraAddr": "555545",
        "channelNum": "555545",
        "policeType": "555545",
        "instTime": "555545",
        "wantDo": "555545",
        "cameraType": "555545",
        "cameraModel": "555545",
        "fMemo": "555545"
    }
    init();
    addRow(row_json);
});
;(function (window, $, undefined) {
    window.init = _init;
    window.addRow = _addRow;
    window.refleshData = _refleshData;
    var _config = {
        ajaxUrl: {
            getContactByUserIdUrl: '../../../../getContactByUserId.do',
            getGetCameraListUrl: '../../../../GetCameraListByUid.do',
            delUserMonitorInfoUrl:'../../../../delUserMonitorInfo.do'
        }
    };

    var _global = {
        top: parent.parent,
        plugins: {
            page: null
        },

        userPojo: {
            userId: "",
            roleId:''
        },

        selectedData: '',
        userMonitorPojo:{
            roleId:'',
            devId:'',
            devMonitorId:'',
            userMonitorId:''
        }
    }

    function _init() {
        _initEvent();
        _initData();
    }

    function _initData() {
        var rowJson = parent.parent.getPopupsRowJson();
        _global.userPojo.userId = rowJson.userId;
        _global.userPojo.roleId = rowJson.roleId;
        _getGetCameraList();
    }

    function _initEvent() {
        $("#title_add").bind("click", function () {
            parent.PopusManage('addMonitorSite');
        });
        /*********
         * 删除按钮单击事件
         */
        $("#title_del").bind("click",function () {

            if(_global.selectedData !=''){
                _global.userMonitorPojo.devId = _global.selectedData.devId;
                _global.userMonitorPojo.devMonitorId = _global.selectedData.devMonitorId;
                _global.userMonitorPojo.roleId = _global.userPojo.roleId;
                _global.userMonitorPojo.userMonitorId = _global.selectedData.userMonitorId;

                //alert("您确定要删除选中的数据么？");
                //_deleteUserMonitor();
                parent.parent.comfireFloat("确认要删除用户监控点"+ _global.selectedData.devId +"?",_deleteUserMonitor,null);
            }if(_global.selectedData ==''){
                parent.parent.alertWarn("请先选择您所要删除的用户监控点！！",null,null);
            }
        });
    }

    function _devzone_callback(data) {
        var rowDatas = data.EquipmentList;
        for (var i = 0; i < rowDatas.length; i++) {
            _addRow(rowDatas[i]);
        }
    }

    function _clearTable() {
        $("#table_content").text('');
    }
    
    function _addRow(row_json) {
        $div_row = $("<div></div>");
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
            .addClass('row')
            .attr('id', row_json.userMonitorId);
        $userMonitorId.addClass('table_item_7').text(row_json.userMonitorId).attr("title", row_json.userMonitorId);
        $devMonitorId.addClass('table_item_5').text(row_json.devMonitorId).attr("title", row_json.devMonitorId);
        $devId.addClass('table_item_4').text(row_json.devId).attr("title", row_json.devId);
        $cameraName.addClass('table_item_5').text(row_json.cameraName).attr("title", row_json.cameraName);
        $cameraAddr.addClass('table_item_5').text(row_json.atPos).attr("title", row_json.atPos);
        $channelNum.addClass('table_item_3').text(row_json.devChannelId).attr("title", row_json.devChannelId);
        //$policeType.addClass('table_item_4').text(row_json.almTypeName).attr("title", row_json.almTypeName);
        if(row_json.almTypeName == "" || row_json.almTypeName == null){row_json.almTypeName = row_json.almType};
        $policeType.addClass('table_item_4').text(row_json.almTypeName).attr("title", row_json.almTypeName);
        $instTime.addClass('table_item_4').text(row_json.instDate).attr("title", row_json.instDate);
        //$wantDo.addClass('table_item_4').text(row_json.wantDoName).attr("title", row_json.wantDoName);
        if(row_json.wantDoName == "" || row_json.wantDoName == null){row_json.wantDoName = row_json.wantDo};
        $wantDo.addClass('table_item_4').text(row_json.wantDoName).attr("title", row_json.wantDoName);
        if(row_json.cameraTypeName == "" || row_json.cameraTypeName == null){row_json.cameraTypeName = row_json.cameraType};
        $cameraType.addClass('table_item_5').text(row_json.cameraTypeName).attr("title", row_json.cameraTypeName);
        if(row_json.cameraModelName == "" || row_json.cameraModelName == null){row_json.cameraModelName = row_json.cameraModelId};
        $cameraModel.addClass('table_item_5').text(row_json.cameraModelName).attr("title", row_json.cameraModelName);
        $fMemo.addClass('table_item_last').text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($("#table_content"));

        $div_row.bind('click', function (e) {
            $("#table_content div.selected").removeClass("selected");
            $("#" + row_json.userMonitorId).addClass("selected");
            _global.selectedData = row_json;
        });

        $div_row.bind('dblclick', function (e) {
            parent.PopusManage('editMonitorSite', row_json);
        });
    }

    function _getGetCameraListParams() {
        var params = {
            userId: _global.userPojo.userId
        };

        return params;
    }

    function _getGetCameraList() {
        var params = _getGetCameraListParams();
        post_async(params, _config.ajaxUrl.getGetCameraListUrl, _callback_getGetCameraList);
    }

    function _callback_getGetCameraList(data) {
        _clearTable();
        if(data.code == 1000){
            var jsonPojos = data.result;
            for (var i=0;i<jsonPojos.length;i++){
                _addRow(jsonPojos[i]);
            }
        }

    }

    function _deleteUserMonitorParams() {
        var params = {};
        params.userMonitorPojo = {};
        params.userMonitorPojo = _global.userMonitorPojo;
        return params;
    }

    function _deleteUserMonitor() {
        var params = _deleteUserMonitorParams();
        post_async(params, _config.ajaxUrl.delUserMonitorInfoUrl, _callback_deleteUserMonitor);
    }
    function _callback_deleteUserMonitor(data) {
        _refleshData();
        var result = data.result;
        if(result.code == '0'){
            //alert("删除成功");
            parent.parent.alertSuccess("删除成功。",2000,null);
        }else{
            //alert(result.message);
            parent.parent.alertFail(result.message,null,null);
        }
    }

    function _refleshData() {
        _getGetCameraList();
    }
})(window, jQuery, undefined);