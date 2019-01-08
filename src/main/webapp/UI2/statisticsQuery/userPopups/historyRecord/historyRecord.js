//var deviceData = parent.parent.parent.parent.getPopupsRowJson();
$(document).ready(function() {
	init();
});
;(function(window,$,undefined){
	window.init = _init;

	var _config = {
		ajaxUrl: {
			QueryLogListByAuidUrl:'/IntegratedMM/query/QueryLogListByAuid.do',

		}
	};
	var rowJson = parent.parent.getPopupsRowJson();
	function _init(){
		_initData();
	}
	
	function _initData(){
		_getHistoryRecord()
	}



	function _getHistoryRecordParams(){
		var params = {};
		params.userId = rowJson.userId;
		params.pageInfoPojo = {};
		params.pageInfoPojo.currentPage = 1;
		params.pageInfoPojo.pageSize = 100;
		return params;
	}

	function _getHistoryRecord() {
		var params = _getHistoryRecordParams();
		post_async(params, _config.ajaxUrl.QueryLogListByAuidUrl, _callback_getHistoryRecord);
	}

	function _callback_getHistoryRecord(data) {
		var result = data.result;
		if(result.code == '0'){
			_clearHistoryRecordRow();
			var jsonList = data.List;
			for(var i=0;i<jsonList.length;i++){
				_addHistoryRecordRow(jsonList[i]);
			}
		}else {
			_clearHistoryRecordRow();
		}
	}
	function _addHistoryRecordRow(rowData) {
		var $tr_row = $("<tr></tr>");
		var $td_strdate = $("<td style='width:245px;'></td>");
		var $td_operationContent = $("<td style='width:245px;'></td>");
		var $td_userName = $("<td style='width:243px;'></td>");
		var $td_userId = $("<td style='width:240px;'></td>");

		$td_strdate.text(rowData.strdate.replace('T',' ')).attr('title',rowData.strdate.replace('T',' '));
		$td_operationContent.text(rowData.operationContent).attr('title',rowData.operationContent);
		$td_userName.text(rowData.userName).attr('title',rowData.userName);
		$td_userId.text(rowData.userId).attr('title',rowData.userId);

		$tr_row
			.append($td_strdate)
			.append($td_operationContent)
			.append($td_userName)
			.append($td_userId);
		$tr_row.appendTo($('#historyRecordData'));

	}
	function _clearHistoryRecordRow(){
		$('#historyRecordData').html("");
	}
})(window,jQuery,undefined);