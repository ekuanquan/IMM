$(document).ready(function() {
	init();
});
;(function(window,$,undefined){
	window.init = _init;
	_config = {
		ajaxUrl:{
			getUserMonitorIdByUserId:'/IntegratedMM/eventSetting/getUserMonitorIdByUserId.do'
		}
	}
	
	function _init(){
		_initEvent();
		_initData();
	}
	
	function _initData(){
		showData();
	}
	
	function _initEvent() {
		$('#cancel,#close').bind('click', function(e) {
			parent.parent._closeCusPopus();
		});
		
		$('#save').bind('click',function(e){
			_save();
		});
    }
	
	function _save(){
		var cameraId = $('#row_select').val();
		console.log(cameraId);
		parent.parent.bottomDivMap.showDevMonitorIdByParam(cameraId);
		parent.parent._closeCusPopus();
	}
	
	
	function showData(){
		var UserEvtData = parent.parent.getPopupsRowJson();
		var userId = UserEvtData.userId;
		var param = {};
		param.ownerId = userId;
		post_async(param,_config.ajaxUrl.getUserMonitorIdByUserId,showDataCallBack);
	}
	
	function showDataCallBack(data){
		console.log(JSON.stringify(data));
		if (data.result.code==200) {
			var json = data.json;
			for (var i=0;i<json.length;i++) {
				showOption(json[i]);
			}
		}
	}
	
	function showOption(row_json){
		var $option = $('<option></option>');
		$option.attr('value',row_json.cameraId).text(row_json.ownerMonitorId).appendTo($('#row_select'));
	}
	
	
})(window,jQuery,undefined);