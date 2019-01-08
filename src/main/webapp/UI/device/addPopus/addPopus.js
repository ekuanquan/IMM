$(document).ready(function() {
	init();
});
;(function(window,jQuery,undefined){
	window.init = _init;


	var _globle={
		top:parent
	};

	function _init(){
        _initData();
        _initEvent();
	}
	function _initData(){
        var deviceIframeTab = parent.getDeviceIframeTab();
        _switchDeviceIframeTab(deviceIframeTab);

	}
	function _initEvent() {
        $("#NVR").bind("click",function () {
            parent.devicePopusManager('addNVR');
        });
        $("#NVRWire").bind("click",function () {
            parent.devicePopusManager('addNVRWire');
        });
        $("#alarmMainframe").bind("click",function () {
            parent.devicePopusManager('addAlarm');
        });
        $("#alarmMainframe").bind("click",function () {
            parent.devicePopusManager('addAlarm');
        });
        $("#AKey").bind("click",function () {
            parent.devicePopusManager('addAKey');
        });

        $("#title_close").bind("click",function () {

            parent.closePopus();


        });
    }

	function _switchDeviceIframeTab(deviceIframeTab) {
        switch (deviceIframeTab) {
            case 'NVR_tab':
                $("#NVR_img").css("background-image","url(./img/color/NVR.png)");
                break;
            case 'NVRWired_tab':
                $("#NVRWire_img").css("background-image","url(./img/color/NVRWire.png)");
                break;
            case 'alarmMainframe_tab':
                $("#alarmMainframe_img").css("background-image","url(./img/color/alarmMainframe.png)");
                break;
            case 'face_tab':
                $("#face_img").css("background-image","url(./img/color/face.png)");
                break;
            case 'car_tab':
                $("#car_img").css("background-image","url(./img/color/car.png)");
                break;
            case 'wifi_tab':
                $("#WIFI_img").css("background-image","url(./img/color/WIFI.png)");
                break;
            case 'cardevice_tab':
                $("#cardevice_img").css("background-image","url(./img/color/cardevice.png)");
                break;
            case 'AKey_tab':
                $("#AKey_img").css("background-image","url(./img/color/AKeyc.png)");
                break;
            default:
            	$("#NVR_img").css("background-image","url(./img/color/NVR.png)");
                break;
        }
    }


})(window,jQuery,undefined);