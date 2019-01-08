$(document).ready(function () {
    init();
});

;
(function ($, window) {
    window.init = _init;

    var _config = {
        ajaxUrl: {
            getAlarmMainframeUrl:'/IntegratedMM/QueryAlarmhostList.do',
            getcopyDeviceUrl:'/IntegratedMM/copyDevice.do',
        }
    };
    var _global = {
        plugins: {
            page: null
        },
        queryTond: {
            areaId: '',
            key:'',
            queryId:'',
            isowner:'have'
        },
        pageInfoPojo: {
            currentPage: '1',
            pageSize: '10',
            sort: 'devId|ASC',
            totalNum: '',
            totalPage: ''
        },
        addDeviceList: [],
    };

    function _init() {
        _global.platformId = parent.getMain().platform_id;
        _initEvent();
    }

    function _initEvent() {
        _global.plugins.page = new YW.PAGEUI({
            ID: 'pageBox',
            clickPage: _queryData_page,
            cssPath:'jquery-page-1.0.2/jquery-page-1.0.2.css'
        });
        _showAlarmMainframe("")
        //模糊搜索
        $("#contentRight_search_img").click(
            function(){
                var id = $("#contentRight_search_input").val()
                _showAlarmMainframe(id);
                return;
            });
        //模糊搜索绑定回车
        $("#contentRight_search_input").keydown(function(event){
            if(event.keyCode == 13){ //绑定回车
                var id = $(this).val();
                _showAlarmMainframe(id);
            }
            return;
        });
        $("#close").click(function(){
            close();
        });
        $("#cancel").click(function(){
            close();
        });
        $("#sure").click(function(){
                _sure();
        });
    }

    function _sure() {
        var radioVal=$('input:radio[name="device"]:checked').attr("id");
        var deviceData = parent.getPopupsRowJson();
        if(radioVal=="newDeviceRadio"){
            parent.setCopyDevId(deviceData.devId);
            parent.devicePopusManager('addAlarm');
            parent.closeMapPopus();
        }else {
            //parent.okAndCancelAndMsg("将会覆盖设备原有基本信息，包括所属区域，不可撤销!",function () {
                if(_global.addDeviceList.length>0) {
                    _getParams(deviceData.devId);
                }
                else{
                    parent.alertTip("请选择设备",2000,null);
                }
            //},null);
        }
    }
    function _getParams(devId) {
        var params = {};
        params.devId=devId;
        params.addDeviceList = _global.addDeviceList;
        post_async(params, _config.ajaxUrl.getcopyDeviceUrl, _callback_submit);
    }
    function _callback_submit(data) {
        var result = data.result;
        if (data.code == '200') {
            parent.alertTip("保存成功",2000,null);
            parent.closeMapPopus();
        } else {
            parent.alertTip("保存失败",2000,null);
        }
    }
    function _showAlarmMainframe(nameOrdevId){
        var deviceData = parent.getPopupsRowJson();
        _global.queryTond.areaId = _global.platformId;
        _global.queryTond.queryId = nameOrdevId;
        _global.queryTond.platformId = _global.platformId;
        _global.queryTond.outDevId = deviceData.devId;
        _getAlarmMainframes();
    }

    function _getAlarmMainframesParams() {
        var params = {};
        params.queryTond = {};
        params.pageInfoPojo = {};
        params.queryTond = _global.queryTond;
        params.pageInfoPojo.currentPage = _global.pageInfoPojo.currentPage;
        params.pageInfoPojo.sort = _global.pageInfoPojo.sort;
        params.pageInfoPojo.pageSize = _global.pageInfoPojo.pageSize;
        return params;
    }
    function _getAlarmMainframes(){
        var params = _getAlarmMainframesParams();
        post_async(params, _config.ajaxUrl.getAlarmMainframeUrl, _callback_getAlarmMainframes);
    }

    function _callback_getAlarmMainframes(data) {
        $("#device_List").text("");
        var result = data.result;
        if (result.code == 1000) {
            var pageInfoPojo = data.pageInfoPojo;
            var totalNum = pageInfoPojo.totalNum;
            var totalPage = pageInfoPojo.totalPage;
            var currentPage = pageInfoPojo.currentPage;
            _global.pageInfoPojo.currentPage = currentPage;
            _global.pageInfoPojo.totalNum = totalNum;
            _global.pageInfoPojo.totalPage = totalPage;
            if(totalNum == 0) totalNum = -1;
            _global.plugins.page.setPage(totalPage, currentPage, totalNum);
            //_clearRow();
            var json = data.json;
            var deviceData = parent.getPopupsRowJson();
            for (var i = 0; i < json.length; i++) {
                if(json[i].devId==deviceData.devId){
                    continue;
                }
                _addTableRow(json[i],i+1);
            }

        } else {
            _clearRow();
        }
    }

    function _queryData_page(page) {
        _global.pageInfoPojo.currentPage = page;
        _getAlarmMainframes();
    }
    function _clearRow() {
        $(".left_row").each(function () {
            var $this = $(this);
            $this.remove();
        });
    }

    function _addTableRow(row_json) {
        var $device_List_row = $('<div></div>');
        var $deviceNum = $('<div></div>');
        var $deviceName = $('<div></div>');
        var areaName = $('<div></div>');
        $device_List_row.addClass('device_List_row').addClass('left_row').data('data', row_json).attr('id', "left_" + row_json.devId);
        $deviceNum.addClass('devId').text(row_json.devId).appendTo($device_List_row);
        $deviceName.addClass('devName').text(row_json.devName).attr('title', row_json.devName).appendTo($device_List_row);
        areaName.addClass('areaName').text(row_json.areaName).appendTo($device_List_row);
        $device_List_row.appendTo($('#device_List'));
        $device_List_row.bind('click', function (e) {
            var $this = $(this);
            $this.addClass('disable_row');
            addDevice_AddList($this.data('data'));
        });
        var addDeviceList=_global.addDeviceList;
        for (var j = 0; j < addDeviceList.length; j++) {
            if (row_json.devId == addDeviceList[j]) {
                $device_List_row.addClass('disable_row');
            }
        }
    }
    function addDevice_AddList(json) { //右边添加row
        add_addDeviceList(json);
        var $device_List_row = $('<div></div>');
        var $deviceNum = $('<div></div>');
        var $deviceName = $('<div></div>');
        var $areaName = $('<div></div>');
        var $delet_row = $('<div></div>');
        $device_List_row.addClass('device_List_row').data('data', json).attr('id', "right_" + json.devId);
        $deviceNum.addClass('devId').text(json.devId).appendTo($device_List_row);
        $deviceName.addClass('devName').text(json.devName).attr('title', json.devName).appendTo($device_List_row);
        $areaName.addClass('areaName2').text(json.areaName).appendTo($device_List_row);
        $delet_row.addClass('delet_row').appendTo($device_List_row);
        $device_List_row.appendTo($('#adddevice_List'));
        $delet_row.bind('click', function (e) {
            var devId = $(this).parent().data('data').devId;
            $(this).parent().remove();
            $('#left_' + devId, '#device_List').removeClass('disable_row');
            del_addDeviceList(devId);
        });
    }

    function add_addDeviceList(json) { //数组添加userId
        var addDeviceList = _global.addDeviceList;
        if (addDeviceList.length > 0) {
            for (var i = 0; i < addDeviceList.length; i++) {
                var oJsonDeviceId = addDeviceList[i];
                if (json.devId == oJsonDeviceId) {
                    break;
                }
                if (i == addDeviceList.length - 1) {
                    addDeviceList.push(json.devId);
                }
            }
        } else {
            addDeviceList.push(json.devId);
        }
        _global.addDeviceList = addDeviceList;
        console.log(JSON.stringify(addDeviceList));
    }

    function del_addDeviceList(devId) {
        console.log('del_addUserList----' + devId);
        var addDeviceList = _global.addDeviceList;
        var index = null;
        for (var i = 0; i < addDeviceList.length; i++) {
            if (devId == addDeviceList[i].devId) {
                index = i;
                break;
            } else {
                index = -1;
            }
        }
        console.log('index:' + index);
        addDeviceList.splice(index, 1);
        _global.addDeviceList = addDeviceList;
        console.log(JSON.stringify(addDeviceList));
    }
    //关闭弹窗
    function close(){
        parent.closeMapPopus();
    }
})(jQuery, window);