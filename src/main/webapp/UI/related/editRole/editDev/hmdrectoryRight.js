function closeselectarea() {
	/*alert("1314")*/
	/*parent._closePopus();*/
	if(parent._closePopus) {
		parent._closePopus();
	}
	if(parent.closeMapPopus) {
		parent.closeMapPopus();
	}

}

$(document).ready(function() {
	init();
});
;(function(window,$,undefined){
	window.init = _init;
	window.showDeviceInfoManager = _showDeviceInfoManager;
	var _global = {
		top:parent.parent.parent.parent,
        deviceIframe:{
            checkedTab:""
        }
	};


	function _init(){
		_initEvent();
	}
	//事件绑定函数
	function _initEvent(){
		$("#close,#cancel").click(function() {
			parent.associatedApparatusIframe.clearAddDevList();
			closeselectarea();
		});
		$(".tab_item").bind('click', function(event) {	
			$(this).removeClass('tab_noChecked').addClass('tab_isChecked');
			$(this).siblings().removeClass('tab_isChecked').addClass('tab_noChecked');
			_switchTabItem($(this).attr('id'));
		});
		//默认点击一次首页
		$("#NVR_tab").click();
		
		$("#sure").click(function(){
			parent.associatedApparatusIframe.addAddData();
			closeselectarea();
		});
		
	}

	function _switchTabItem(tabStr){
		switch (tabStr) {
			case 'NVR_tab':
                _setDeviceIframeTab('NVR_tab');
				$("#NVRIframe").css('width', '100%');
				$("#NVRIframe").siblings().css('width', '0px');
				break;
			case 'NVRWired_tab':
                _setDeviceIframeTab('NVRWired_tab');
				$("#NVRWiredIframe").css('width', '100%');
				$("#NVRWiredIframe").siblings().css('width', '0px');
				break;
			case 'alarmMainframe_tab':
                _setDeviceIframeTab('alarmMainframe_tab');
				$("#alarmMainframeIframe").css('width', '100%');
				$("#alarmMainframeIframe").siblings().css('width', '0px');
				break;
			case 'face_tab':
                _setDeviceIframeTab('face_tab');
				$("#faceIframe").css('width', '100%');
				$("#faceIframe").siblings().css('width', '0px');
				break;
			case 'car_tab':
                _setDeviceIframeTab('car_tab');
				$("#carIframe").css('width', '100%');
				$("#carIframe").siblings().css('width', '0px');
				break;
			case 'wifi_tab':
                _setDeviceIframeTab('wifi_tab');
				$("#WIFIIframe").css('width', '100%');
				$("#WIFIIframe").siblings().css('width', '0px');
				break;
			default:
				// statements_def
				break;
		}
	}
	function _showDeviceInfoManager(treeNode,queryId){
		var iframeTab =   _getDeviceIframeTab();
		switch (iframeTab){
			case 'NVR_tab':
				NVRIframe.NVRno(treeNode.id,queryId);
				break;
			case 'NVRWired_tab':
				NVRWiredIframe.NVRWire(treeNode.id,queryId);
				break;
			case 'alarmMainframe_tab':
				alarmMainframeIframe.showAlarmMainframe(treeNode.id,queryId);
				break;
			default :
				break;
		}
	}
    function _getDeviceIframeTab() {
        return _global.deviceIframe.checkedTab;
    }
    function _setDeviceIframeTab(checkedTab) {
        _global.deviceIframe.checkedTab = checkedTab;
    }
})(window,jQuery,undefined);