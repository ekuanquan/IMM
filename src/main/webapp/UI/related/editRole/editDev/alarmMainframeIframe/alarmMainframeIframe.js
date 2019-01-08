$(document).ready(function() {
	resizeDocment(); //重绘函数
	$(window).resize(function() {
		resizeDocment(); //重绘函数
	});
	init();
});

;
(function(window, $) {
	window.init = _init;
	window.resizeDocment = _resizeDocment;
	window.addTableRow = _addTableRow;
	window.showAlarmMainframe = _showAlarmMainframe;

	var _config = {
		ajaxUrl: {
			//getAlarmMainframeUrl:'../../../ctrlDevice.do'     ModifyAlarmhostattr
			getAlarmMainframeUrl: '/IntegratedMM/QueryAlarmhostList.do'
		}
	};
	var _global = {
		top: parent.parent,
		plugins: {
			page: null
		},
		getAlarmMainframeParams: {
			queryTond: {
				areaId: '',
				key: '',
				queryId:'',
				isowner:'no',
				key: ''
			},
			pageInfoPojo: {
				currentPage: '1',
				sort: 'eventTime|DESC',
				pageSize: '25',
				totalNum: '',
				totalPage: ''
			}
		}
	};

	function _resizeDocment() {

	}

	function _init() {
		_initEvent();
	}

	function _initEvent() {

		$(".row").bind('dblclick', function(event) {
			/* Act on the event */
			_global.top.devicePopusManager('editDevice');
		});

		_global.plugins.page = new YW.PAGEUI({
			ID: 'pageBox',
			clickPage: _queryData_page,
			cssPath: '../../../../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
		});
	}

	function _addTableRow(row_json, i) {
		var devState = row_json.devState;
	    switch(devState) {
	    	case 0:
	    		devState = "离线";
	    		break;
	    	case 1:
	    		devState = "在线";
	    		break;
	    	case 2:
	    		devState = "未知";
	    		break;
	    	default:
	    		devState = "";
	    		break;
	    	}

		$div_row = $("<div></div>");
		$dic_checkbox = $("<div></div>");
		$div_devId = $("<div></div>");
		$div_devName = $("<div></div>");
		$div_pnlActID = $("<div></div>");
		$div_areaName = $("<div></div>");
		$div_devTypeName = $("<div></div>");
		$div_devModelName = $("<div></div>");
		$div_devLng = $("<div></div>");
		$div_devlat = $("<div></div>");
		//  $div_devIndex = $("<div></div>");
		$div_instUnit = $("<div></div>");
		$div_instMan = $("<div></div>");
		$div_pnlAddr = $("<div></div>");
		$div_devState = $("<div></div>");
		$div_fMemo = $("<div></div>");
		$div_pnlPowerAddr = $("<div></div>");
		$div_keyboardAddr = $("<div></div>");
		$div_pnlHdTel = $("<div></div>");
		$div_telAddr = $("<div></div>");
		$div_pnlTel = $("<div></div>");
		//  $div_passCode = $("<div></div>");

		$div_row
			.append($dic_checkbox)
			.append($div_devId)
			.append($div_devName)
			.append($div_pnlActID)
			.append($div_areaName)
			.append($div_devTypeName)
			.append($div_devModelName)
			.append($div_devLng)
			.append($div_devlat)
			//.append($div_devIndex)
			.append($div_instUnit)
			.append($div_instMan)
			.append($div_pnlAddr)
			.append($div_devState)
			.append($div_fMemo)
			.append($div_pnlPowerAddr)
			.append($div_keyboardAddr)
			.append($div_pnlHdTel)
			.append($div_telAddr)
			.append($div_pnlTel)
			//.append($div_passCode)
			.addClass('row')
			.attr('id', row_json.devId);
		$dic_checkbox.addClass('noChecked').bind('click', function() {
			var isChecked = $(this).hasClass('isChecked');
			if(isChecked) {
				$(this).removeClass('isChecked').addClass('noChecked');
				parent.parent.associatedApparatusIframe.setDelDevList(row_json);
			} else {
				$(this).removeClass('noChecked').addClass('isChecked');
				parent.parent.associatedApparatusIframe.setAddDevList(row_json);
			}
		});

		var list = parent.parent.associatedApparatusIframe.getAddDevList();
		for(var i = 0; i < list.length; i++) {
			var listDevId = list[i].devId;
			if(listDevId == row_json.devId) {
				$dic_checkbox.removeClass('noChecked').addClass('isChecked');
			}
		}

		$div_devId.addClass('table_item_4').text(row_json.devId).attr("title", row_json.devId);
		$div_devName.addClass('table_item_4').text(row_json.devName).attr("title", row_json.devName);
		$div_pnlActID.addClass('table_item_6').text(row_json.pnlActID).attr("title", row_json.pnlActID);
		$div_areaName.addClass('table_item_4').text(row_json.areaName).attr("title", row_json.areaName);
		$div_devTypeName.addClass('table_item_4').text(row_json.devTypeName).attr("title", row_json.devTypeName);
		$div_devModelName.addClass('table_item_4').text(row_json.devModelName).attr("title", row_json.devModelName);
		$div_devLng.addClass('table_item_2').text(row_json.devLng).attr("title", row_json.devLng);
		$div_devlat.addClass('table_item_2').text(row_json.devlat).attr("title", row_json.devlat);
		//$div_devIndex.addClass('table_item_4').text(row_json.devIndex).attr("title", row_json.devIndex);
		$div_instUnit.addClass('table_item_4').text(row_json.instUnit).attr("title", row_json.instUnit);
		$div_instMan.addClass('table_item_3').text(row_json.instMan).attr("title", row_json.instMan);
		$div_pnlAddr.addClass('table_item_4').text(row_json.pnlAddr).attr("title", row_json.pnlAddr);
		$div_devState.addClass('table_item_4').text(devState).attr("title", devState);
		$div_fMemo.addClass('table_item_2').text(row_json.fMemo).attr("title", row_json.fMemo);
		$div_pnlPowerAddr.addClass('table_item_4').text(row_json.pnlPowerAddr).attr("title", row_json.pnlPowerAddr);
		$div_keyboardAddr.addClass('table_item_4').text(row_json.keyboardAddr).attr("title", row_json.keyboardAddr);
		$div_pnlHdTel.addClass('table_item_4').text(row_json.pnlHdTel).attr("title", row_json.pnlHdTel);
		$div_telAddr.addClass('table_item_4').text(row_json.telAddr).attr("title", row_json.telAddr);
		$div_pnlTel.addClass('table_item_4').text(row_json.pnlTel).attr("title", row_json.pnlTel);
		//$div_passCode.addClass('table_item_4').text(row_json.passCode).attr("title", row_json.passCode);
		$div_row.appendTo($("#table_content"));

		$div_row.data('key', row_json);
	}

	function _showAlarmMainframe(areaId,queryId) {
		_global.getAlarmMainframeParams.queryTond.areaId = areaId;
		_global.getAlarmMainframeParams.queryTond.queryId = queryId;
		_global.getAlarmMainframeParams.pageInfoPojo.currentPage = '1';
		_getAlarmMainframes();
	}

	function _getAlarmMainframesParams() {

		var params = {};
		params.queryTond = {};
		params.pageInfoPojo = {};
		params.queryTond = _global.getAlarmMainframeParams.queryTond;
		params.pageInfoPojo.currentPage = _global.getAlarmMainframeParams.pageInfoPojo.currentPage;
		params.pageInfoPojo.sort = _global.getAlarmMainframeParams.pageInfoPojo.sort;
		params.pageInfoPojo.pageSize = _global.getAlarmMainframeParams.pageInfoPojo.pageSize;
		return params;
	}

	function _getAlarmMainframes() {
		var params = _getAlarmMainframesParams();
		post_async(params, _config.ajaxUrl.getAlarmMainframeUrl, _callback_getAlarmMainframes);
	}

	function _callback_getAlarmMainframes(data) {
		var result = data.result;

		if(result.code == 1000) {
			var pageInfoPojo = data.pageInfoPojo;
			var totalNum = pageInfoPojo.totalNum;
			var totalPage = pageInfoPojo.totalPage;
			var currentPage = pageInfoPojo.currentPage;
			_global.getAlarmMainframeParams.pageInfoPojo.currentPage = currentPage;
			_global.getAlarmMainframeParams.pageInfoPojo.totalNum = totalNum;
			_global.getAlarmMainframeParams.pageInfoPojo.totalPage = totalPage;

			_global.plugins.page.setPage(totalPage, currentPage, totalNum);
			_clearRow();
			var json = data.json;
			for(var i = 0; i < json.length; i++) {
				_addTableRow(json[i], i + 1);
			}

		} else {
			_clearRow();
		}
	}


	function _queryData_page(page) {
		_global.getAlarmMainframeParams.pageInfoPojo.currentPage = page;
		var params = _getAlarmMainframesParams();
		post_async(params, _config.ajaxUrl.getAlarmMainframeUrl, _callback_getAlarmMainframes);
	}

	function _clearRow() {
		var i = 1;

		$(".row").each(function() {

			var $this = $(this);
			setTimeout(function() {

				$this.remove();
			}, i * 1);
			i++;
		});
	}

})(window, jQuery);