$(document).ready(function() {
	init();
});
;(function(window,$,undefined){
	window.init = _init;
	window.showDeviceInfoManager = _showDeviceInfoManager;
	window.clicktitle = _clicktitle;

	var _global = {
		top:parent
	};


	function _init(){
		_initEvent();
        /*$(window).load(function(){
            $("#alarmMainframe_tab").click();
        });*/
	}
	//事件绑定函数
	function _initEvent(){
		$(".tab_item").bind('click', function(event) {	
			$(this).removeClass('tab_noChecked').addClass('tab_isChecked');
			$(this).siblings().removeClass('tab_isChecked').addClass('tab_noChecked');
			_switchTabItem($(this).attr('id'));
		});
		//默认点击一次首页
		//$("#alarmMainframe_tab").click();
		$("#contentRight_add").bind('click', function(event) {
            _global.top.devicePopusManager('selectDevice');
		});
	}

	function _switchTabItem(tabStr){
		switch (tabStr) {
			case 'NVR_tab':
                _global.top.setDeviceIframeTab('NVR_tab');
				$("#NVRIframe").css('width', '100%');
				$("#NVRIframe").siblings().css('width', '0px');
				break;
			case 'NVRWired_tab':
                _global.top.setDeviceIframeTab('NVRWired_tab');
				$("#NVRWiredIframe").css('width', '100%');
				$("#NVRWiredIframe").siblings().css('width', '0px');
				break;
			case 'alarmMainframe_tab':
                _global.top.setDeviceIframeTab('alarmMainframe_tab');
				$("#alarmMainframeIframe").css('width', '100%');
				$("#alarmMainframeIframe").siblings().css('width', '0px');
				break;
			case 'face_tab':
                _global.top.setDeviceIframeTab('face_tab');
				$("#faceIframe").css('width', '100%');
				$("#faceIframe").siblings().css('width', '0px');
				break;
			case 'car_tab':
                _global.top.setDeviceIframeTab('car_tab');
				$("#carIframe").css('width', '100%');
				$("#carIframe").siblings().css('width', '0px');
				break;
			case 'wifi_tab':
                _global.top.setDeviceIframeTab('wifi_tab');
				$("#WIFIIframe").css('width', '100%');
				$("#WIFIIframe").siblings().css('width', '0px');
				break;
            case 'cardevice_tab':
                _global.top.setDeviceIframeTab('cardevice_tab');
                $("#cardeviceIframe").css('width', '100%');
                $("#cardeviceIframe").siblings().css('width', '0px');
                break;
			default:
				// statements_def
				break;
		}
	}
	function _showDeviceInfoManager(treeNode,nameOrdevId){
		var iframeTab =   _global.top.getDeviceIframeTab();
		switch (iframeTab){
			case 'NVR_tab':
				NVRIframe.NVRno(treeNode.id,nameOrdevId);
				break;
			case 'NVRWired_tab':
				NVRWiredIframe.NVRWire(treeNode.id,nameOrdevId);
				break;
			case 'alarmMainframe_tab':
				alarmMainframeIframe.showAlarmMainframe(treeNode.id,nameOrdevId);
				break;
            case 'cardevice_tab':
                cardeviceIframe.showCardevice(treeNode.id,nameOrdevId);
                break;
			default :
				break;
		}
	}
    //点击事件
    function _clicktitle(Node) {
        var Nodeid = "#" + Node;
        /*$(Nodeid).click(function(){choseNode = Node;});*/
        $(Nodeid).click();
        //var iframeTab =   _global.top.getDeviceIframeTab();
        $("#contentRight_search_input").text("");
        var onClickNode = getonClickNode();
        switch (Node){
            case 'NVR_tab':
                NVRIframe.NVR_RefreshData(onClickNode.id);
                break;
            case 'NVRWired_tab':
                NVRWiredIframe.NVRWire_RefreshData(onClickNode.id);
                break;
            case 'alarmMainframe_tab':
                alarmMainframeIframe.showAlarmMainframe_RefreshData(onClickNode.id);
                break;
            case 'cardevice_tab':
                cardeviceIframe.showCardevice_RefreshData(onClickNode.id);
                break;
            default :
                break;
        }

    };

})(window,jQuery,undefined);