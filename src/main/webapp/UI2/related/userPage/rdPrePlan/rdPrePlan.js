//var deviceData = parent.parent.parent.parent.getPopupsRowJson();
$(document).ready(function() {
	init();
});
;(function(window,$,undefined){
	window.init = _init;

	var _global = {
		top:parent.parent,
		userId:''
	};
	function _init(){
		_initData();
	}
	
	function _initData(){

       	 _global.userId =parent.parent.getRelatedUserId();
		 post_async({"userId": _global.userId},"/IntegratedMM/QueryDealwayListByUid.do",_rdPlan_callback);
	}

	function _rdPlan_callback(data){
		var rowDatas = data.List;
		for(var i = 0 ;i< rowDatas.length;i++){
			_addRow(rowDatas[i]);
		}
	}
	function _addRow(row_json){
        $div_row = $("<div></div>");
        $dealWayId = $("<div></div>");
    	$fdata = $("<div></div>");
    	$fMemo = $("<div></div>");
        $div_row
            .append($dealWayId)
            .append($fdata)
            .append($fMemo)
            .addClass('row');
        $dealWayId.addClass('table_item_4').text(row_json.dealWayId).attr("title", row_json.dealWayId);
        $fdata.addClass('table_item_4').text(row_json.fdata).attr("title", row_json.fdata);
        $fMemo.addClass('table_item_4').text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($("#table_content"));
       /* $div_row.bind('dblclick', function (e) {
        	 parent.devicePopusManager('editDeviceZone',row_json);
        });*/
	}
})(window,jQuery,undefined);