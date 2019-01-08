//var deviceData = parent.parent.parent.parent.getPopupsRowJson();
$(document).ready(function() {
	init();
});
;(function(window,$,undefined){
	window.init = _init;
	

    var _config={
        ajaxUrl:{
            getAssociatedDeviceByUserIdUrl:'../../../../getAssociatedDeviceByUserId.do'
        }
    };
    var _global = {
        top:parent.parent,
        plugins:{
            page:null
        },
        getAssociatedDeviceParams:{
            userPojo:{
                userId:""
            }
        }
    }

	function _init(){
		_initEvent();
		_initData();
	}
	
	function _initData(){
		_getAssociatedDevice();
	}
	
	function _initEvent() {
       $("#title_add").bind("click",function () {
        parent.devicePopusManager('addDeviceZone');
    });
		/*$(".row").bind("dblclick",function () {
            parent.devicePopusManager('editDeviceZone');
        });*/
    }

    function _getAssociatedDeviceParams(){
        var params = {};
        params.userPojo = {};
        params.userPojo = _global.getAssociatedDeviceParams.userPojo;
        return params;
    }
    function _getAssociatedDevice(){
        var rowJson = parent.parent.getPopupsRowJson();
        _global.getAssociatedDeviceParams.userPojo.userId = rowJson.userId;
        var params  = _getAssociatedDeviceParams();
        post_async(params, _config.ajaxUrl.getAssociatedDeviceByUserIdUrl, _callback_getAssociatedDevice);
    }
    function _callback_getAssociatedDevice(data){
     var result = data.result;

     if (result.code == '0') {
         var associatedDevicePojo = data.associatedDevicePojo;
         for(var i = 0 ;i< associatedDevicePojo.length;i++){
            _addRow(associatedDevicePojo[i]);
        }
    }

}
function _addRow(row_json){
    $div_row = $("<div></div>");
    $devId = $("<div></div>");
    $devName = $("<div></div>");
    	//$devType = $("<div></div>");
    	$devTypeName = $("<div></div>");
    	//$devModelId = $("<div></div>");
    	$devModelName = $("<div></div>");
    	//$areaId = $("<div></div>");
    	$areaName = $("<div></div>");
    $div_devstuats=$("<div></div>");

        $div_row
        .append($devId)
        .append($devName)
        .append($devTypeName)
        .append($devModelName)
        .append($areaName)
        .append($div_devstuats)
        .addClass('row');
        $devId.addClass('table_item_4').text(row_json.devId).attr("title", row_json.devId);
        $devName.addClass('table_item_4').text(row_json.devName).attr("title", row_json.devName);
        $devTypeName.addClass('table_item_4').text(row_json.devTypeName).attr("title", row_json.devTypeName);
        $devModelName.addClass('table_item_4').text(row_json.devModelName).attr("title", row_json.devModelName);
        $areaName.addClass('table_item_4').text(row_json.areaName).attr("title", row_json.areaName);
        var devState = devStateTranse(row_json.devState);
        $div_devstuats.addClass('table_item_4').text(devState == null ? '' : devState).attr("title", devState == null ? '' : devState);
        $div_row.appendTo($("#table_content"));
        $div_row.bind('dblclick', function (e) {
            parent.open_device(row_json);
        });
    }
    /************************************************
     设备状态的数据转换
     ************************************************/
    function devStateTranse(devState) {
    	var dev_state = "";
        switch(devState) {
            case 0:
            	dev_state = "离线";
                break;
            case 1:
            	dev_state = "在线";
                break;
            case 2:
            	dev_state = "未知";
                break;
            default:
                break;
        }
        return dev_state;
    }
})(window,jQuery,undefined);