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
		params.userId = rowData.userId;
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
        setColSize();
	}

	function _addRdPlanRow(rowData) {
		var $tr_row = $("<tr></tr>");
		var $td_num = $("<td style='width:120px;' ></td>");
		var $td_content = $("<td style='width:588px;text-align: left;'></td>");
		var $td_memo = $("<td style='width:250px;text-align: left;'></td>");
		
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