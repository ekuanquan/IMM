//var deviceData = parent.parent.parent.parent.getPopupsRowJson();
$(document).ready(function() {
	init();
});
;(function(window,$,undefined){
	window.init = _init;
	
	var _config = {
		currUserEvtId:"",
		ajaxUrl:{
			editEventSetting:'/IntegratedMM/eventSetting/editEventSetting.do'
		}
	}
	
	function _init(){
		_initEvent();
		_initData();
	}
	
	function _initData(){
		showUserEvtData();
	}
	
	function _initEvent() {
		$('#save').bind('click',function(e){
			editEventSetting();
		});
		
		$('#cancel,#close').bind('click',function(e){
			parent.closeMapPopus();
		});
		
		$('#isVideo').bind('click',function(e){
			var $this = $(this);
			var check =  $this.hasClass('isChecked');
			if (check) {
				$this.removeClass('isChecked').addClass('noChecked');
			} else{
				$this.removeClass('noChecked').addClass('isChecked');
			}
		});
    }
	
	function editEventSetting(){
		parent.parent.comfireFloat("确定修改事件配置信息？",geteditEventInfo,null);
	}
	function geteditEventInfo() {
        var param ={};
        var isVideo = '0';
        if ($('#isVideo').hasClass('isChecked')) {
            isVideo = '1';
        }
        param.isVideo = isVideo;
        param.UserEvtId = _config.currUserEvtId;
        param.fMemo = $('#fMemo').val();
        console.log(JSON.stringify(param));
        post_async(param,_config.ajaxUrl.editEventSetting,editEventSettingCallBack)
    }
	function editEventSettingCallBack(data){
		console.log(JSON.stringify(data));
		if (data.result.code==200) {
			parent.mainDivIframe.eventSettingIframe.showEventSettingList("");
			setTimeout(function() {
				parent.closeMapPopus();
			}, 1000);
			
		}
	}
	
	function showUserEvtData(){
		var row_json = parent.getUserEvtData();
		console.log(JSON.stringify(row_json));
		_config.currUserEvtId = row_json.UserEvtId;
		var UserEvtId = row_json.UserEvtId;
		var ZoneCHFlag = row_json.ZoneCHFlag == 0 ? '用户防区' : '用户监控点';
		var ZoneCHValue1 = '';
		var ZoneCHValue2 = '';
		if(row_json.ZoneCHFlag == 0) { //防区
			ZoneCHValue1 = row_json.ZoneCHValue == null ? '' : row_json.ZoneCHValue;
		}
		if(row_json.ZoneCHFlag == 1) { //通道
			ZoneCHValue2 = row_json.ZoneCHValue == null ? '' : row_json.ZoneCHValue;
		}
		var fMemo = row_json.fMemo == null ? '' : row_json.fMemo;
		
		$('#UserEvtId').val(UserEvtId);
		$('#ZoneCHFlag').val(ZoneCHFlag);
		$('#ZoneCHValue1').val(ZoneCHValue1);
		$('#ZoneCHValue2').val(ZoneCHValue2);
		$('#fMemo').val(fMemo);
		if (row_json.isVideo==1) {
			$('#isVideo').removeClass('noChecked').addClass('isChecked');
		}
	}
	
})(window,jQuery,undefined);