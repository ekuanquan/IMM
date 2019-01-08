$(document).ready(function() {
	init();
});;
(function(window, $, undefined) {
	window.init = _init;
	var _global = {
		ajaxUrl: {
			getEventSettingList: '/IntegratedMM/eventSetting/getEventSettingList.do'
		},
	}

	function _init() {
		_initEvent();
		_initData();
	}

	function _initData() {
		_showEventSettingList("");
	}

	function _initEvent() {}

	function _showEventSettingList(ZoneCHFlag) {
		var rowJson = parent.parent.getRelatedUserId();
		var userId = rowJson;
		var param = {};
		param.userId = userId;
		param.ZoneCHFlag = ZoneCHFlag;
		post_async(param, _global.ajaxUrl.getEventSettingList, showEventSettingListCallBack);
	}


	function showEventSettingListCallBack(data) {
		console.log(JSON.stringify(data));
		if(data.result.code == 200) {
			var json = data.json;
			for(var i = 0; i < json.length; i++) {
				showEventSetting(json[i]);
			}
		}
        setColSize();
	}

	function showEventSetting(row_json) {
		var $table_row = $('<tr></tr>');
		var $UserEvtId = $('<td></td>');
		var $div = $('<span></span>');
		var $ZoneCHFlag = $('<td></td>');
		var $ZoneCHValue1 = $('<td></td>');
		var $ZoneCHValue2 = $('<td></td>');
		var $isVideo = $('<td></td>');
		var $fMemo = $('<td></td>');

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
})(window, jQuery, undefined);