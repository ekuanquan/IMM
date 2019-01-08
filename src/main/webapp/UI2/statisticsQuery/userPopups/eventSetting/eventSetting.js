$(document).ready(function() {
	init();
});;
(function(window, $, undefined) {
	window.init = _init;
	window.showEventSettingList = _showEventSettingList;
	window.clearCheck = _clearCheck;
	var _global = {
		ajaxUrl: {
			getEventSettingList: '/IntegratedMM/eventSetting/getEventSettingList.do',
			delEventSetting: '/IntegratedMM/eventSetting/delEventSetting.do'
		},
		hookUserEvtId: []
	}

	function _init() {
		_initData();
	}

	function _initData() {
		_showEventSettingList("");
	}


	function _showEventSettingList(ZoneCHFlag) {
		if(ZoneCHFlag == '') {
			$('#configurationType').val("");
		}
		var rowJson = parent.parent.getPopupsRowJson();
		var userId = rowJson.userId;
		var param = {};
		param.userId = userId;
		param.ZoneCHFlag = ZoneCHFlag;
		post_async(param, _global.ajaxUrl.getEventSettingList, showEventSettingListCallBack);
	}

	function clearEventSettingList() {
		$('#table_content').empty();
	}
//其他窗口保存后初始化勾选
	function _clearCheck() {
		$('.UserEvtId > div').removeClass('isChecked').removeClass('noChecked').addClass('noChecked');
		$('#allCheck').removeClass('isChecked').removeClass('noChecked').addClass('noChecked');
		_global.hookUserEvtId = [];
	}
	function showEventSettingListCallBack(data) {
		console.log(JSON.stringify(data));
		if(data.result.code == 200) {
			_clearCheck();
			clearEventSettingList();
			var json = data.json;
			for(var i = 0; i < json.length; i++) {
				showEventSetting(json[i]);
			}
		}

	}

	function showEventSetting(row_json) {
		var $table_row = $('<div></div>');
		var $UserEvtId = $('<div></div>');
		var $div = $('<span></span>');
		var $ZoneCHFlag = $('<div></div>');
		var $ZoneCHValue1 = $('<div></div>');
		var $ZoneCHValue2 = $('<div></div>');
		var $isVideo = $('<div></div>');
		var $fMemo = $('<div></div>');

		var ZoneCHValue1 = '';
		var ZoneCHValue2 = '';
		if(row_json.ZoneCHFlag == 0) { //防区
			ZoneCHValue1 = row_json.ZoneCHValue == null ? '' : row_json.ZoneCHValue;
		}
		if(row_json.ZoneCHFlag == 1) { //通道
			ZoneCHValue2 = row_json.ZoneCHValue == null ? '' : row_json.ZoneCHValue;
		}
		$div.appendTo($UserEvtId);
		$UserEvtId.appendTo($table_row);
		$ZoneCHFlag.appendTo($table_row);
		$ZoneCHValue1.appendTo($table_row);
		$ZoneCHValue2.appendTo($table_row);
		$isVideo.appendTo($table_row);
		$fMemo.appendTo($table_row);
		$table_row.appendTo($('#table_content'));

		$fMemo.addClass('fMemo').text(row_json.fMemo == null ? '' : row_json.fMemo);
		$isVideo.addClass('isVideo').text(row_json.isVideo == 1 ? '是' : '否');
		$ZoneCHValue2.addClass('ZoneCHValue2').text(ZoneCHValue2);
		$ZoneCHValue1.addClass('ZoneCHValue1').text(ZoneCHValue1);
		$ZoneCHFlag.addClass('ZoneCHFlag').text(row_json.ZoneCHFlag == 0 ? '用户防区' : '用户监控点');
		$UserEvtId.addClass('UserEvtId');
		$div.addClass('table_row_text').text(row_json.UserEvtId).attr('title', row_json.UserEvtId);
		$table_row.addClass('table_row').attr('id', row_json.UserEvtId).data('key', row_json);

	}

})(window, jQuery, undefined);