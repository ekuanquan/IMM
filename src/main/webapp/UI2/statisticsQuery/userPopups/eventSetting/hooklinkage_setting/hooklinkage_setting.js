$(document).ready(function() {
	init();
});;
(function(window, $, undefined) {
	window.init = _init;
	window.showDevMonitorIdByParam = _showDevMonitorIdByParam;
	_config = {
		ajaxUrl: {
			getUserMonitorIdByCameraId: '/IntegratedMM/eventSetting/getUserMonitorIdByCameraId.do',
			hookSvaeLinkageSetting:'/IntegratedMM/eventSetting/hookSvaeLinkageSetting.do'
		},
	row_json:""
	}

	function _init() {
		console.log('进入勾选后的联动设置！')
		_initEvent();
		_initData();
	}

	function _initData() {
	}

	function _initEvent() {
		$('#cancel,#close').bind('click', function(e) {
			parent.parent.closeMapPopus();
		});
		
		$('#save').bind('click',function(e){
			_save();
		});

		$('#title_add').bind('click', function(e) {
			var length = $('.row_row', '.row_main').length;
			if(length < 1) {
				parent.parent.eventSettingManage('check_addLinkage','')
			}
		});
		
		$('#title_edit').bind('click',function(e){
			var row_json =  $('.row_main > .row_checked').data('key');
			var length = $('.row_checked', '.row_main').length;
			if(length >= 1) {
				parent.parent.eventSettingManage('check_editLinkage',row_json);
			}
		});
		
		$('#title_del').bind('click',function(e){
			$('.row_main > .row_checked').remove();
			_config.row_json = '';
		});

	}
	
	function _save(){
		var UserEvtIdList = parent.parent.getUserEvtIdList();
		console.log('_save: UserEvtData----'+JSON.stringify(UserEvtIdList));
		var param = {};
		param.UserEvtIdList = UserEvtIdList;
		param.cameraId = _config.row_json.cameraId;
		console.log('_save: '+JSON.stringify(param));
		post_async(param,_config.ajaxUrl.hookSvaeLinkageSetting,_saveCallBack)
	}
	
	function _saveCallBack(data){
		if (data.result.code==200) {
			parent.parent.mainDivIframe.eventSettingIframe.showEventSettingList("");
			setTimeout(function() {
				parent.parent.closeMapPopus();
			}, 1000);
		}
	}

	
	function _showDevMonitorIdByParam(cameraId) {
		var rowJson = parent.parent.getPopupsRowJson();
		var userId = rowJson.userId;
		var cameraId =cameraId;
		if(cameraId != undefined && cameraId != null && cameraId != '') {
			var param = {};
			param.devId = cameraId;
			param.userId = userId;
			post_async(param, _config.ajaxUrl.getUserMonitorIdByCameraId, showDevMonitorIdCallBack);
		}
	}

	function showDevMonitorIdCallBack(data) {
		console.log(JSON.stringify(data));
		if(data.result.code == 200) {
			clearRow_mian();
			var json = data.json;
			for(var i = 0; i < json.length; i++) {
				showData(json[i]);
			}

		}
	}
	
	function clearRow_mian(){
		$('.row_main').empty();
	}

	function showData(row_json) {
		_config.row_json = row_json;
		console.log("_config.row_json: "+JSON.stringify(_config.row_json));
		var $row_row = $('<div></div>');
		var $devMonitorId = $('<div></div>');
		var $isCamera = $('<div></div>');

		$devMonitorId.addClass('devMonitorId').text(row_json.userMonitorId).appendTo($row_row);
		$isCamera.addClass('isCamera').text('是').appendTo($row_row);
		$row_row.addClass('row_row').data('key',row_json).appendTo($('.row_main'));
		
		$row_row.bind('click',function(e){
			var $this = $(this);
			var check = $this.hasClass('row_checked');
			if(check) {
				$this.removeClass('row_checked');
			} else {
				$this.addClass('row_checked').siblings().removeClass('row_checked');
			}
		});
	}

})(window, jQuery, undefined);