$(document).ready(function() {
	init();
});
;(function(window,$,undefined){

	var spayId;
	window.reflaceDeviceZone = _reflaceDeviceZone;
	window.init = _init;
	function _init(){
		_initEvent();
		_initData();

		$("#title_del").click(function(){deletSpay()});
	}
	
	function _initData(){
		 var deviceData = parent.parent.parent.parent.getPopupsRowJson();
        var params = {
            condition:{
                devId:deviceData.devId
            }
        };
		 post_async(params,"/IntegratedMM/queryDevZoneForOneClickDev.do",_devzone_callback);
	}
	
	function _initEvent() {
	    $("#title_add").bind("click",function () {
            parent.devicePopusManager('addDeviceZone');
        });
		/*$(".row").bind("dblclick",function () {
            parent.devicePopusManager('editDeviceZone');
        });*/
    }
	function _devzone_callback(data){
		var rowDatas = data.result;
		for(var i = 0 ;i< rowDatas.length;i++){
			_addRow(rowDatas[i]);
		}
        setColSize()
	}
	function _addRow(row_json){
        $div_row = $("<tr></tr>");
		$devZoneId = $("<td></td>");
		$snType = $("<td></td>");
		$atPos = $("<td></td>");
    	$wantDo = $("<td></td>");
    	$almType = $("<td></td>");
    	$snNum = $("<td></td>");
    	$snModelId = $("<td></td>");
		$instDate = $("<td></td>");
		$fMemo = $("<td></td>");

        $div_row
            .append($devZoneId)
            .append($snType)
            .append($atPos)
            .append($wantDo)
            .append($almType)
            .append($snNum)
			.append($snModelId)
			.append($instDate)
			.append($fMemo)
            .addClass('row');
        $devZoneId.addClass('table_item_4').text(row_json.devZoneId).attr("title", row_json.devZoneId);
        if(row_json.snTypeName ==""||row_json.snTypeName == null){row_json.snTypeName =row_json.snType};
		$snType.addClass('table_item_4').text(row_json.snTypeName).attr("title", row_json.snTypeName);
		$atPos.addClass('table_item_4_2').text(row_json.atPos).attr("title", row_json.atPos);
        if(row_json.wantDoName ==""||row_json.wantDoName == null){row_json.wantDoName =row_json.wantDo};
		$wantDo.addClass('table_item_4').text(row_json.wantDoName).attr("title", row_json.wantDoName);
        if(row_json.almTypeName ==""||row_json.almTypeName == null){row_json.almTypeName =row_json.almType};
		$almType.addClass('table_item_4').text(row_json.almTypeName).attr("title", row_json.almTypeName);
		$snNum.addClass('table_item_4').text(row_json.snNum).attr("title", row_json.snNum);
        if(row_json.snModelName ==""||row_json.snModelName == null){row_json.snModelName =row_json.snModelId};
		$snModelId.addClass('table_item_4').text(row_json.snModelName).attr("title", row_json.snModelName);
		$instDate.addClass('table_item_4').text(row_json.instDate).attr("title", row_json.instDate);
		$fMemo.addClass('table_item_2').text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($("#table_content"));
        /*$div_row.bind('dblclick', function (e) {
        	 parent.devicePopusManager('editDeviceZone',row_json);
        });
		$div_row.bind('click', function (e) {
			spayId = row_json.devId;
			devZoneId =  row_json.devZoneId ;
		});*/
	}

	function deletSpay(){

		var json = {
			"spayId":spayId,
			"devZoneId":devZoneId
		}
		var end = post_sync(json, "../../../../DeleteDeviceCtrl/deleteSpay.do");
		alert(end.message);
		_reflaceDeviceZone();
	}

	function _reflaceDeviceZone(){		//ˢ��ҳ��
		location.reload();
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