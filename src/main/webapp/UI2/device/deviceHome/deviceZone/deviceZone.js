$(document).ready(function() {
	init();
});
;(function(window,$,undefined){

	var spayId,devZoneId;
	window.reflaceDeviceZone = _reflaceDeviceZone;
	window.init = _init;
	function _init(){
		_initEvent();
		_initData();

		$("#title_del").click(function(){
			if(devZoneId!=undefined&&devZoneId!=''){
            	parent.parent.comfireFloat("确认要删除此防区"+devZoneId +"?",deletSpay,cancelCallback);
			}else{
				parent.parent.alertTip('请先选择防区',2000,null);
			}
			/*deletSpay()*/
		});
	}
	
	function _initData(){
		 var deviceData = parent.parent.parent.parent.getPopupsRowJson();
		 post_async({"DevId": deviceData.devId},"../../../../QueryAlarmhostZoneList.do",_devzone_callback);
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
    	$snModeId = $("<div></div>");
		$instDate = $("<div></div>");
		$fMemo = $("<div></div>");

        $div_row
            .append($devZoneId)
            .append($snType)
            .append($atPos)
            .append($wantDo)
            .append($almType)
            .append($snNum)
			.append($snModeId)
			.append($instDate)
			.append($fMemo)
            .addClass('row')
			.attr('id', row_json.devZoneId);
        $devZoneId.addClass('table_item_4').text(row_json.devZoneId).attr("title", row_json.devZoneId);
		$snType.addClass('table_item_4').text(row_json.snType).attr("title", row_json.snType);
		$atPos.addClass('table_item_4').text(row_json.atPos).attr("title", row_json.atPos);
		$wantDo.addClass('table_item_4').text(row_json.wantDo).attr("title", row_json.wantDo);
		$almType.addClass('table_item_4').text(row_json.almType).attr("title", row_json.almType);
		$snNum.addClass('table_item_4').text(row_json.snNum).attr("title", row_json.snNum);
		$snModeId.addClass('table_item_4').text(row_json.snModelName).attr("title", row_json.snModelName);
		$instDate.addClass('table_item_4').text(row_json.instDate).attr("title", row_json.instDate);
		$fMemo.addClass('table_item_2').text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($("#table_content"));
        $div_row.bind('dblclick', function (e) {
        	 parent.devicePopusManager('editDeviceZone',row_json);
        });
		$div_row.bind('click', function (e) {
			$("#table_content div.selected").removeClass("selected");
			$("#"+row_json.devZoneId).addClass("selected");
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
		/*alert(end.result.message)*/
        parent.parent.alertTip(end.result.message,2000,null);
		_reflaceDeviceZone();
	}

	function _reflaceDeviceZone(){		//ˢ��ҳ��
		location.reload();
	}
    function cancelCallback() {

    }
})(window,jQuery,undefined);