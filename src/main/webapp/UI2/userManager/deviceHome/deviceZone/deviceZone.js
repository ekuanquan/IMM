$(document).ready(function() {
	init();
});
;(function(window,$,undefined){
	window.init = _init;
	function _init(){
		_initEvent();
	}
	
	function _initEvent() {
	    $("#title_add").bind("click",function () {
            parent.devicePopusManager('addDeviceZone');
        });
		$(".row").bind("dblclick",function () {
            parent.devicePopusManager('editDeviceZone');
        });
    }
	function _addRow(row_json){
		
	}
})(window,jQuery,undefined);