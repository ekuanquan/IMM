$(document).ready(function() {
	init();
});;
(function(window, $, undefined) {
	window.init = _init;
    window.selectaction = _selectaction;
	var _global = {
		top: parent.parent,
	};

	function _init() {
		_initEvent();

	}
	//事件绑定函数
	function _initEvent() {
		//关闭窗口
		$('#close,#down').bind('click',function(e){
			_global.top.closePopus();
		});
		//默认
        $("#table tr td").addClass("trblue");
	}
//监听select值的变化
	function _selectaction() {
        $("#table tr td").removeClass("trblue");
        if($("#template option:selected").val() == 0){
            $("#table tr td").addClass("trblue");
        }
        else if($("#template option:selected").val() == 1){
            $("#table tr:lt(6) td").addClass("trblue");
        }else if($("#template option:selected").val() == 2){
            $("#table tr:eq(6) td").addClass("trblue");
            $("#table tr:eq(7) td").addClass("trblue");
        }
    }
    /*$("#template").bind('change',function () {
    	$("#table tr td").removeClass("trblue");
		if($("#template option:selected").val() == 0){
			$("#table tr td").addClass("trblue");
		}
		else if($("#template option:selected").val() == 1){
            $("#table tr:lt(6) td").addClass("trblue");
        }else if($("#template option:selected").val() == 1){
            $("#table tr:gt(6) td").addClass("trblue");
        }
    })*/

})(window, jQuery, undefined);