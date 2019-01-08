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
        setColSize();
	}
	function _addHistoryRecordRow(rowData) {
        var operationContent = rowData.operationContent.replace(/null/g,"");
		var $tr_row = $("<tr></tr>");
		var $td_strdate = $("<td style='width:245px;'></td>");
		var $td_operationContent = $("<td style='width:245px;'></td>");
		var $td_userName = $("<td style='width:243px;'></td>");
		var $td_userId = $("<td style='width:240px;'></td>");

		$td_strdate.text(rowData.strdate.replace('T',' ')).attr('title',rowData.strdate.replace('T',' '));
		$td_operationContent.text(operationContent).attr('title',operationContent);
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
    function setColSize(){
        var col1 = document.getElementById("listBox1").getElementsByTagName('td');//获取表头所有列
        var col2 = document.getElementById("listBox2").getElementsByTagName('td');//获取数据表所有列
        $("#listBox1").colResizable({
            minWidth: 20, //最小宽度
            liveDrag:true, //是否实时拖动
            gripInnerHtml:"<div id='dragDiv1'></div>", //拖动div
            draggingClass:"dragging", //拖动div样式
            onResize: null, //拖动时调用函数
            followCol:col2,//数据表的列集合
            mainCol:col1,//表头表的列结婚firstColDrag:false
            firstColDrag:true,
        });
        $("#listBox2").colResizableNot({
            minWidth: 20, //最小宽度
            liveDrag:true, //是否实时拖动
            gripInnerHtml:"<div id='dragDiv'></div>", //拖动div
            draggingClass:"dragging", //拖动div样式
            onResize: null //拖动时调用函数
        });
        document.getElementById("listBox2").style.width=document.getElementById("listBox1").style.width;
        var columnsize = col1.length;

        if((col2!=null&&col2.length>0)&&col1!=null){
            //给数据表重新获取宽度
            for (var i = 0; i < columnsize - 1; i++) {    //遍历Table的所有列
                col2[i].style.width = col1[i].style.width;//实际应用用这里
            }
        }
        //固定和滚动
        document.getElementById("listBox2").style.width=document.getElementById("listBox1").style.width;
        var right_div2 = document.getElementById("right_div2");
        right_div2.onscroll = function(){
            var right_div2_left = this.scrollLeft;
            document.getElementById("right_div1").scrollLeft = right_div2_left;
        }
    }
})(window,jQuery,undefined);