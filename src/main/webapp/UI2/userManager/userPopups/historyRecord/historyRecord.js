//var deviceData = parent.parent.parent.parent.getPopupsRowJson();
$(document).ready(function() {
	init();
});
;(function(window,$,undefined){
	window.init = _init;
	
	function _init(){
		_initEvent();
		_initData();
	}
	
	function _initData(){
        var rowJson = parent.parent.getPopupsRowJson();
		var userId = rowJson.userId;
		var params = {
            "pageInfoPojo": {
                "currentPage": 1,
                "pageSize": 100
            },
            "userId": userId
        };
        post_async(params,"/IntegratedMM/query/QueryLogListByAuid.do",callback_history)
	}
	
	function _initEvent() {
    }
	function callback_history(data){
		var rowDatas = data.List;
		for(var i = 0 ;i< rowDatas.length;i++){
			_addRow(rowDatas[i]);
		}
	}
	function _addRow(row_json){
        $div_row = $("<div></div>");
        $strdate = $("<div></div>");
    	$operationContent = $("<div></div>");
    	$userName = $("<div></div>");
    	$userId = $("<div></div>");
        $div_row
            .append($strdate)
            .append($operationContent)
            .append($userName)
            .append($userId)
            .addClass('row');
        $strdate.addClass('table_item_4').text(row_json.strdate.replace('T',' ')).attr("title", row_json.strdate.replace('T',' '));
        $operationContent.addClass('table_item_4').text(row_json.operationContent).attr("title", row_json.operationContent);
        $userName.addClass('table_item_4').text(row_json.userName).attr("title", row_json.userName);
        $userId.addClass('table_item_4').text(row_json.userId).attr("title", row_json.userId);
        $div_row.appendTo($("#table_content"));
        /*$div_row.bind('dblclick', function (e) {
        	 parent.devicePopusManager('editDeviceZone',row_json);
        });*/
	}
})(window,jQuery,undefined);