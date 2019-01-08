$(document).ready(function() {
	init();
});
;(function(window,$,undefined){

	var spayId;
	window.reflaceDeviceZone = _reflaceDeviceZone;
	window.init = _init;
	function _init(){
		_initEvent();
		_initData();

		$("#title_del").click(function(){deletSpay()});
	}
	
	function _initData(){
		 var deviceData = parent.parent.getdevId();
		 post_async({"DevId": deviceData},"../../../QueryAlarmhostZoneList.do",_devzone_callback);
	}
	
	function _initEvent() {
	    $("#title_add").bind("click",function () {
            parent.devicePopusManager('addDeviceZone');
        });
		/*$(".row").bind("dblclick",function () {
            parent.devicePopusManager('editDeviceZone');
        });*/
    }
	function _devzone_callback(data){
		var rowDatas = data.result;
		for(var i = 0 ;i< rowDatas.length;i++){
			_addRow(rowDatas[i]);
		}
	}
	function _addRow(row_json){
        $div_row = $("<div></div>");
		$devZoneId = $("<div></div>");
		$snType = $("<div></div>");
		$atPos = $("<div></div>");
    	$wantDo = $("<div></div>");
    	$almType = $("<div></div>");
    	$snNum = $("<div></div>");
    	$snModelId = $("<div></div>");
		$instDate = $("<div></div>");
		$fMemo = $("<div></div>");

        $div_row
            .append($devZoneId)
            .append($snType)
            .append($atPos)
            .append($wantDo)
            .append($almType)
            .append($snNum)
			.append($snModelId)
			.append($instDate)
			.append($fMemo)
            .addClass('row');
        $devZoneId.addClass('table_item_4').text(row_json.devZoneId).attr("title", row_json.devZoneId);
        if(row_json.snTypeName ==""||row_json.snTypeName == null){row_json.snTypeName =row_json.snType};
		$snType.addClass('table_item_4').text(row_json.snTypeName).attr("title", row_json.snTypeName);
		$atPos.addClass('table_item_4').text(row_json.atPos).attr("title", row_json.atPos);
        if(row_json.wantDoName ==""||row_json.wantDoName == null){row_json.wantDoName =row_json.wantDo};
		$wantDo.addClass('table_item_4').text(row_json.wantDoName).attr("title", row_json.wantDoName);
        if(row_json.almTypeName ==""||row_json.almTypeName == null){row_json.almTypeName =row_json.almType};
		$almType.addClass('table_item_4').text(row_json.almTypeName).attr("title", row_json.almTypeName);
		$snNum.addClass('table_item_4').text(row_json.snNum).attr("title", row_json.snNum);
        if(row_json.snModelName ==""||row_json.snModelName == null){row_json.snModelName =row_json.snModelId};
		$snModelId.addClass('table_item_4').text(row_json.snModelName).attr("title", row_json.snModelName);
		$instDate.addClass('table_item_4').text(row_json.instDate).attr("title", row_json.instDate);
		$fMemo.addClass('table_item_2').text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($("#table_content"));
       /* $div_row.bind('dblclick', function (e) {
        	 parent.devicePopusManager('editDeviceZone',row_json);
        });*/
		$div_row.bind('click', function (e) {
			spayId = row_json.devId;
			devZoneId =  row_json.devZoneId ;
		});
	}

	function deletSpay(){

		var json = {
			"spayId":spayId,
			"devZoneId":devZoneId
		}
		var end = post_sync(json, "../../../../DeleteDeviceCtrl/deleteSpay.do");
		alert(end.result.message)
		_reflaceDeviceZone();
	}

	function _reflaceDeviceZone(){		//ˢ��ҳ��
		location.reload();
	}

})(window,jQuery,undefined);