//var deviceData = parent.parent.parent.parent.getPopupsRowJson();
$(document).ready(function() {
	init();
});
;(function(window,$,undefined){
	window.init = _init;
	window.rdPlam = _rdPlam;
	var _config ={
		ajaxUrl:{
            delUrl:"/IntegratedMM/dealway/del.do"
		}
	};
	var _global = {
		top:parent.parent,
		dow:{
            div_row:'',
			row:''
		}
	};
	function _init(){
		_initData();
		_initEvent()
	}
	
	function _initData(){

        _rdPlam();
	}
	function _initEvent() {
		//点击添加
		$("#title_add").click(function () {
			parent.PopusManage("addrdPlan");
        })
		//点击删除
        $("#title_del").click(function () {
        	if(_global.dow.row == 1){
                parent.parent.comfireFloat("确认要删除处警预案" + _global.dow.div_row.dealWayId,del,null);
			}
			else {
        		parent.parent.alertTip("请先选择所需要删除的处警预案",null,null);
			}
        })
    }
    //查询处警预案列表
	function _rdPlam(){
        _global.dow.row = 0;//重置
        var rowJson = parent.parent.getPopupsRowJson();
        var userId = rowJson.userId;
        post_async({"userId": userId},"/IntegratedMM/QueryDealwayListByUid.do",_rdPlan_callback);
    }
    //删除处警预案
	function del() {
		var params = {};
		var dalrdpreplan ={};
		dalrdpreplan.userId = _global.dow.div_row.userId;
        dalrdpreplan.dealWayId = _global.dow.div_row.dealWayId;
        params = dalrdpreplan;
        post_async(params,_config.ajaxUrl.delUrl,callbackdel);
    }
	//删除处警预案的回调
	function callbackdel(data) {
        var result = data.result;
        if(result.code == "1000"){
            parent.parent.alertTip("删除成功！",2000,null);
            _rdPlam();	//刷新列表
        }else if(result.code == "1005"){
            parent.parent.alertTip("记录不存在，删除失败",null,null);
        }
		/*parent.parent.alertTip(data.result.message,2000,null);
        _rdPlam();//刷新列表*/
    }

	function _rdPlan_callback(data){
        dalList();//重置列表
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
            .addClass('row row_noChecked')
    		.attr('id', row_json.userId);
        $dealWayId.addClass('table_item_4').text(row_json.dealWayId).attr("title", row_json.dealWayId);
        $fdata.addClass('table_item_4').text(row_json.fdata).attr("title", row_json.fdata);
        $fMemo.addClass('table_item_4').text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($("#table_content"));
        $div_row.bind('dblclick', function (e) {
        	 parent.PopusManage('alterrdPrePlan',row_json);
        }).bind('click', function () {
            _global.dow.row = 1;
            _global.dow.div_row=row_json;
            row_checked($(this),row_json);
        });
	}
    //选择列表信息
    function row_checked($row,jsonData) {
        if ($row.hasClass('row_noChecked')) {
            $row.removeClass('row_noChecked').addClass('row_checked').data('jsonData',jsonData);
            $row.siblings().removeClass('row_checked').addClass('row_noChecked');
        } else {
            $row.removeClass('row_checked').addClass('row_noChecked');
            _global.dow.row = 0;
        }
    }
    //重置列表
	function dalList() {
		$("#table_content").text("");
    }
})(window,jQuery,undefined);