function closeselectarea() {
	/*alert("1314")*/
	/*parent._closePopus();*/
    if(parent._closeCusPopus) {
        parent._closeCusPopus();
    }
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
	window.showManager = _showManager;
	var _global = {
		top:parent.parent.parent.parent,
        deviceIframe:{
            checkedTab:"alarmMainframe_tab"
        },
        treeNode:"",
		flag:[],
        flag2:0
	};


	function _init(){
		_initEvent();
	}
	//事件绑定函数
	function _initEvent(){
		_global.flag = [0,0,0,0,0,0,0,0];
		$("#close,#cancel").click(function() {
			//parent.closePopus();
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
			if(parent.associatedDeviceIframe&& parent.associatedDeviceIframe.addAddData &&
				(typeof(parent.associatedDeviceIframe.addAddData) == 'function')){
                parent.associatedDeviceIframe.addAddData();
            }
            //_global.top.alertSuccess("保存成功", 2000);
			closeselectarea();
            //parent.closePopus();
		});
		
	}

	function _switchTabItem(tabStr){
        var platformId = parent.parent.getMain().platform_id;
		switch (tabStr) {
			case 'NVR_tab':
               _setDeviceIframeTab('NVR_tab');
				$("#NVRIframe").css('width', '100%');
				$("#NVRIframe").siblings().css('width', '0px');
                if(_global.flag[2] == 0){
                    NVRIframe.NVRno(_global.treeNode.id,"",platformId);
                    _global.flag[2] = 1;
                }
				break;
			case 'AKey_tab':
				_setDeviceIframeTab('AKey_tab');
				$("#AKeyIframe").css('width', '100%');
				$("#AKeyIframe").siblings().css('width', '0px');
				if(_global.flag[7] == 0){
					AKeyIframe.AKeyno(_global.treeNode.id,"",platformId);
					_global.flag[7] = 1;
				}
				break;
			case 'NVRWired_tab':
                _setDeviceIframeTab('NVRWired_tab');
				$("#NVRWiredIframe").css('width', '100%');
				$("#NVRWiredIframe").siblings().css('width', '0px');
				if(_global.flag[1] == 0){
                    NVRWiredIframe.NVRWire(_global.treeNode.id,"",platformId);
                    _global.flag[1] = 1;
				}
				break;
			case 'alarmMainframe_tab':
                _setDeviceIframeTab('alarmMainframe_tab');
				$("#alarmMainframeIframe").css('width', '100%');
				$("#alarmMainframeIframe").siblings().css('width', '0px');
                if(alarmMainframeIframe.showAlarmMainframe&&typeof (alarmMainframeIframe.showAlarmMainframe) !="undefine"){
                    alarmMainframeIframe.showAlarmMainframe(treeNode.id,queryId,platformId);
                    _global.flag2 = 1;
                }
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
		var platformId = parent.parent.getMain().platform_id;
        _global.flag = [0,0,0,0,0,0,0,0];
		_global.treeNode = treeNode;
		var iframeTab = _getDeviceIframeTab();
		switch (iframeTab){
			case 'NVR_tab':
				NVRIframe.NVRno(treeNode.id,queryId,platformId);
				break;
			case 'AKey_tab':
				AKeyIframe.AKeyno(treeNode.id,queryId,platformId);
				break;
			case 'NVRWired_tab':
				NVRWiredIframe.NVRWire(treeNode.id,queryId,platformId);
				break;
			case 'alarmMainframe_tab':
				if(alarmMainframeIframe.showAlarmMainframe&&typeof (alarmMainframeIframe.showAlarmMainframe) !="undefine"){
                    alarmMainframeIframe.showAlarmMainframe(treeNode.id,queryId,platformId);
                    _global.flag2 = 1;
                }

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
    function _showManager() {
	    if(_global.flag2 == 0){
            _showDeviceInfoManager(_global.treeNode,"");
        }
    }
})(window,jQuery,undefined);