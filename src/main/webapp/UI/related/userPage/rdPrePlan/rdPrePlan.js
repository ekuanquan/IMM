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
        setColSize();
	}
	function _addRow(row_json){
        $div_row = $("<tr></tr>");
        $dealWayId = $("<td></td>");
    	$fdata = $("<td></td>");
    	$fMemo = $("<td></td>");
        $div_row
            .append($dealWayId)
            .append($fdata)
            .append($fMemo)
            .addClass('row');
        $dealWayId.addClass('table_item_4').text(row_json.dealWayId).attr("title", row_json.dealWayId);
        $fdata.addClass('table_item_4_2').text(row_json.fdata).attr("title", row_json.fdata);
        $fMemo.addClass('table_item_4_3').text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($("#table_content"));
       /* $div_row.bind('dblclick', function (e) {
        	 parent.devicePopusManager('editDeviceZone',row_json);
        });*/
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