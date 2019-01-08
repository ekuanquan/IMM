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
		},
        treeNode:"",
        flag:[]
	};


	function _init(){
		_initEvent();
	}
	//事件绑定函数
	function _initEvent(){
        _global.flag = [0,0,0,0,0,0,0];
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
		/*$("#NVR_tab").click();*/
        $("#alarmMainframe_tab").click();
		
		$("#sure").click(function(){
			parent.associatedApparatusIframe.addAddData();
            _global.top.alertSuccess("勾选的设备保存成功", 2000);
			closeselectarea();

		});
		
	}

	function _switchTabItem(tabStr){
		switch (tabStr) {
			case 'NVR_tab':
                _setDeviceIframeTab('NVR_tab');
				$("#NVRIframe").css('width', '100%');
				$("#NVRIframe").siblings().css('width', '0px');
                if(_global.flag[2] == 0){
                    NVRIframe.NVRno(_global.treeNode.id,"");
                    _global.flag[2] = 1;
                }
				break;
			case 'NVRWired_tab':
                _setDeviceIframeTab('NVRWired_tab');
				$("#NVRWiredIframe").css('width', '100%');
				$("#NVRWiredIframe").siblings().css('width', '0px');
                if(_global.flag[1] == 0){
                    NVRWiredIframe.NVRWire(_global.treeNode.id,"");
                    _global.flag[1] = 1;
                }
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
			 case 'cardevice_tab':
                _setDeviceIframeTab('cardevice_tab');
                $("#cardeviceIframe").css('width', '100%');
                $("#cardeviceIframe").siblings().css('width', '0px');
                 if(_global.flag[3] == 0){
                     cardeviceIframe.showCardevice(_global.treeNode.id,"");
                     _global.flag[3] = 1;
                 }
                break;
			default:
				// statements_def
				break;
		}
	}
	function _showDeviceInfoManager(treeNode,queryId){
		_global.treeNode = treeNode;
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
			case 'cardevice_tab':
                cardeviceIframe.showCardevice(treeNode.id,queryId);
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