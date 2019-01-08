$(document).ready(function() {
	init();
});
;
(function(window, $, undefined) {

	var cammId;
	var deleZoneId;
	window.reflaceDeviceZoneNVRWireIframe = _reflaceDeviceZoneNVRWireIframe;
	window.init = _init;
	function _init() {
		_initEvent();
		_initData();
		$("#title_del").click(function() {
			deleteZone()
		});
	}

	function _initData() {
		var deviceData = parent.parent.parent.parent.getPopupsRowJson();
		post_async({
			"devId" : deviceData.devId
		}, "../../../../QueryCameraList.do", _devzone_callback);
	}

	function _initEvent() {
		$("#title_add").bind("click", function() {
			parent.devicePopusManager('addDeviceZone', cammId);
		});
		/*
		 * $(".row").bind("dblclick",function () {
		 * parent.devicePopusManager('editDeviceZone'); });
		 */
	}
	function _devzone_callback(data) {
		var rowDatas = data.result;
		if (rowDatas != "" && rowDatas != null) {
			cammId = rowDatas[0].devId; // ��¼һ��nvr����������

			for (var i = 0; i < rowDatas.length; i++) {
				_addRow(rowDatas[i]);
			}
		}

		setColSize()
	}
	function _addRow(row_json) {
		$div_row = $("<tr></tr>");
		$cameraName = $("<td></td>");
		$devChannelId = $("<td></td>");
		$devMonitorId = $("<td></td>");
    	$atPos = $("<td></td>");
    	$instDate = $("<td></td>");
    	$almType = $("<td></td>");
    	$wantDo = $("<td></td>");
    	$cameraType = $("<td></td>");
    	$cameraModeId = $("<td></td>");
    	$gbId = $("<td></td>");
    	$fMemo = $("<td></td>");

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
            .append($gbId)
			.append($fMemo)
            .addClass('row');
		$cameraName.addClass('table_item_4').text(row_json.cameraName).attr("title", row_json.cameraName);
		$devChannelId.addClass('table_item_4').text(row_json.devChannelId).attr("title", row_json.devChannelId);
		$devMonitorId.addClass('table_item_4').text(row_json.devMonitorId).attr("title", row_json.devMonitorId);
		$atPos.addClass('table_item_4').text(row_json.atPos).attr("title", row_json.atPos);
		$instDate.addClass('table_item_4').text(row_json.instDate).attr("title", row_json.instDate);
        if(row_json.almTypeName ==""||row_json.almTypeName == null){row_json.almTypeName =row_json.almType};
		$almType.addClass('table_item_4').text(row_json.almTypeName).attr("title", row_json.almTypeName);
        if(row_json.wantDoName ==""||row_json.wantDoName == null){row_json.wantDoName =row_json.wantDo};
		$wantDo.addClass('table_item_4').text(row_json.wantDoName).attr("title", row_json.wantDoName);
		//if(row_json.cameraType==12){row_json.cameraType="摄像机（互联网NVR）"}else{row_json.cameraType=''};
        if(row_json.cameraTypeName ==""||row_json.cameraTypeName == null){row_json.cameraTypeName =row_json.cameraType};
		$cameraType.addClass('table_item_4').text(row_json.cameraTypeName).attr("title", row_json.cameraTypeName);
        if(row_json.cameraModelName ==""||row_json.cameraModelName == null){row_json.cameraModelName =row_json.cameraModelId};
		$cameraModeId.addClass('table_item_4').text(row_json.cameraModelName).attr("title", row_json.cameraModelName);
		$gbId.addClass('table_item_5').text(row_json.gbId).attr("title", row_json.gbId);
		$fMemo.addClass('table_item_2').text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($("#table_content"));

        /*$div_row.bind('dblclick', function (e) {
        	 parent.devicePopusManager('editDeviceZone',row_json);
        });

		/*
		 * $div_row.bind('dblclick', function (e) {
		 * parent.devicePopusManager('editDeviceZone',row_json); });
		 * 
		 * $div_row.bind('click', function (e) { deleZoneId = row_json.devId;
		 * });
		 */
	}

	function deleteZone() {
		// alert(deleZoneId); DeleteDeviceCtrl
		var json = {
			"devId" : deleZoneId
		}
		var end = post_sync(json, "../../../../DeleteDeviceCtrl/deleteZone.do");
		alert(end.result.message)
		_reflaceDeviceZoneNVRWireIframe();
	}

	function _reflaceDeviceZoneNVRWireIframe() { // ˢ��ҳ��
		location.reload();
	}
	function setColSize() {
		var col1 = document.getElementById("listBox1").getElementsByTagName(
				'td');// 获取表头所有列
		var col2 = document.getElementById("listBox2").getElementsByTagName(
				'td');// 获取数据表所有列
		$("#listBox1").colResizable({
			minWidth : 20, // 最小宽度
			liveDrag : true, // 是否实时拖动
			gripInnerHtml : "<div id='dragDiv1'></div>", // 拖动div
			draggingClass : "dragging", // 拖动div样式
			onResize : null, // 拖动时调用函数
			followCol : col2,// 数据表的列集合
			mainCol : col1,// 表头表的列结婚firstColDrag:false
			firstColDrag : true,
		});
		$("#listBox2").colResizableNot({
			minWidth : 20, // 最小宽度
			liveDrag : true, // 是否实时拖动
			gripInnerHtml : "<div id='dragDiv'></div>", // 拖动div
			draggingClass : "dragging", // 拖动div样式
			onResize : null
		// 拖动时调用函数
		});
		document.getElementById("listBox2").style.width = document
				.getElementById("listBox1").style.width;
		var columnsize = col1.length;

		if ((col2 != null && col2.length > 0) && col1 != null) {
			// 给数据表重新获取宽度
			for (var i = 0; i < columnsize - 1; i++) { // 遍历Table的所有列
				col2[i].style.width = col1[i].style.width;// 实际应用用这里
			}
		}
		// 固定和滚动
		document.getElementById("listBox2").style.width = document
				.getElementById("listBox1").style.width;
		var right_div2 = document.getElementById("right_div2");
		right_div2.onscroll = function() {
			var right_div2_left = this.scrollLeft;
			document.getElementById("right_div1").scrollLeft = right_div2_left;
		}
	}
})(window, jQuery, undefined);