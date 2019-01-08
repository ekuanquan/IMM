//var deviceData = parent.parent.parent.parent.getPopupsRowJson();
$(document).ready(function() {
	init();
});
;(function(window,$,undefined){
	window.init = _init;
	var _config = {
		ajaxUrl: {
			QueryDealwayListByUidUrl:'/IntegratedMM/QueryDealwayListByUid.do'
		}
	};

	var rowData = parent.parent.getPopupsRowJson();
	function _init(){
		_initData();
	}
	
	function _initData(){
		_getRdPlan();
	}
	function _getRdPlanParams() {
		var params = {};
		params.userId = rowData.userCode;
		return params;
	}

	function _getRdPlan() {
		var params = _getRdPlanParams();
		post_async(params, _config.ajaxUrl.QueryDealwayListByUidUrl, _callback_getRdPlan);
	}

	function _callback_getRdPlan(data) {
		var result = data.result;
		if(result.code == '1000'){
			_clearRdPlanRow();
			var jsonList = data.List;
			for(var i=0;i<jsonList.length;i++){
				_addRdPlanRow(jsonList[i]);
			}
		}else{
			_clearRdPlanRow();
		}
	}

	function _addRdPlanRow(rowData) {
		var $tr_row = $("<tr></tr>");
		var $td_num = $("<td style='width:65px;' ></td>");
		var $td_content = $("<td style='width:545px;'></td>");
		var $td_memo = $("<td style='width:348px;'></td>");
		
		$td_num.text(rowData.dealWayId).attr('title',rowData.dealWayId);
		$td_content.text(rowData.fdata).attr('title',rowData.fdata);
		$td_memo.text(rowData.fMemo).attr('title',rowData.fMemo);

		$tr_row
			.append($td_num)
			.append($td_content)
			.append($td_memo);
		$tr_row.appendTo($('#rdPlanData'));

	}
	function _clearRdPlanRow() {
		$('#rdPlanData').html("");
	}
})(window,jQuery,undefined);