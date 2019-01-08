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
        $("#ownerUser").bind("click",function () {
            parent.userPopusManager('addOwnerUser');
        });
        $("#generalUser").bind("click",function () {
            parent.userPopusManager('addGeneralUser');
        });
        $("#operator").bind("click",function () {
            parent.userPopusManager('addOperator');
        });

        $("#title_close").bind("click",function () {

            parent.closePopus();


        });
    }

	function _switchDeviceIframeTab(deviceIframeTab) {
        switch (deviceIframeTab) {
            case 'customer_tab':
                $("#ownerUser_img").css("background-image","url(./img/color/ownerUser.png)");
                break;
            case 'operator_tab':
                $("#operator_img").css("background-image","url(./img/color/operator.png)");
                break;
            default:

                break;
        }
    }


})(window,jQuery,undefined);