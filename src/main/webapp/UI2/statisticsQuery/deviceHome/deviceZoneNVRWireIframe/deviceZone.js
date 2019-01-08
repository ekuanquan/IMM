$(document).ready(function() {
	init();
});
;(function(window,$,undefined){

	var cammId ;
	var deleZoneId;
	window.reflaceDeviceZoneNVRWireIframe=_reflaceDeviceZoneNVRWireIframe;
	window.init = _init;
	function _init(){
		_initEvent();
		_initData();
		$("#title_del").click(function(){deleteZone()});
	}
	
	function _initData(){
		 var deviceData = parent.parent.parent.parent.getPopupsRowJson();
		 post_async({"devId": deviceData.devId},"../../../../QueryCameraList.do",_devzone_callback);
	}
	
	function _initEvent() {
	    $("#title_add").bind("click",function () {
            parent.devicePopusManager('addDeviceZone',cammId);
        });
		/*$(".row").bind("dblclick",function () {
            parent.devicePopusManager('editDeviceZone');
        });*/
    }
	function _devzone_callback(data){
		var rowDatas = data.result;

		cammId = rowDatas[0].devId;			//��¼һ��nvr����������

		for(var i = 0 ;i< rowDatas.length;i++){
			_addRow(rowDatas[i]);
		}
	}
	function _addRow(row_json){
        $div_row = $("<div></div>");
		$cameraName = $("<div></div>");
        $devChannelId = $("<div></div>");
		$devMonitorId = $("<div></div>");
    	$atPos = $("<div></div>");
    	$instDate = $("<div></div>");
    	$almType = $("<div></div>");
    	$wantDo = $("<div></div>");
    	$cameraType = $("<div></div>");
    	$cameraModeId = $("<div></div>");
    	$fMemo = $("<div></div>");

        $div_row
            .append($cameraName)
            .append($devChannelId)
			.append($devMonitorId)
            .append($atPos)
            .append($instDate)
            .append($almType)
            .append($wantDo)
            .append($cameraType)
            .append($cameraModeId)
			.append($fMemo)
            .addClass('row');
		$cameraName.addClass('table_item_4').text(row_json.cameraName).attr("title", row_json.cameraName);
		$devChannelId.addClass('table_item_4').text(row_json.devChannelId).attr("title", row_json.devChannelId);
		$devMonitorId.addClass('table_item_4').text(row_json.devMonitorId).attr("title", row_json.devMonitorId);
		$atPos.addClass('table_item_4').text(row_json.atPos).attr("title", row_json.atPos);
		$instDate.addClass('table_item_4').text(row_json.instDate).attr("title", row_json.instDate);
		$almType.addClass('table_item_4').text(row_json.almType).attr("title", row_json.almType);
		$wantDo.addClass('table_item_4').text(row_json.wantDo).attr("title", row_json.wantDo);
		//if(row_json.cameraType==12){row_json.cameraType="摄像机（互联网NVR）"}else{row_json.cameraType=''};
		$cameraType.addClass('table_item_4').text(row_json.cameraTypeName).attr("title", row_json.cameraTypeName);
		$cameraModeId.addClass('table_item_4').text(row_json.cameraModelName).attr("title", row_json.cameraModelName);
		$fMemo.addClass('table_item_2').text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($("#table_content"));

        /*$div_row.bind('dblclick', function (e) {
        	 parent.devicePopusManager('editDeviceZone',row_json);
        });

		$div_row.bind('click', function (e) {
			deleZoneId = row_json.devId;
		});*/
	}

	function deleteZone(){
		//alert(deleZoneId);  DeleteDeviceCtrl
		var json={
			"devId":deleZoneId
		}
		var end = post_sync(json, "../../../../DeleteDeviceCtrl/deleteZone.do");
		alert(end.result.message)
		_reflaceDeviceZoneNVRWireIframe();
	}

	function _reflaceDeviceZoneNVRWireIframe(){		//ˢ��ҳ��
		location.reload();
	}

})(window,jQuery,undefined);