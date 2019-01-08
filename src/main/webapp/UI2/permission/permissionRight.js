$(document).ready(function() {
	init();
});
;(function(window,$,undefined){
	window.init = _init;

	var _global = {
		top:parent
	};


	function _init(){
		_initEvent();
	}
	//事件绑定函数
	function _initEvent(){
		$(".tab_item").bind('click', function(event) {	
			$(this).removeClass('tab_noChecked').addClass('tab_isChecked');
			$(this).siblings().removeClass('tab_isChecked').addClass('tab_noChecked');
			_switchTabItem($(this).attr('id'));
		});
		//默认点击一次首页
		$("#roleManagement_tab").click();
		$("#contentRight_add").bind('click', function(event) {
			_global.top.setUserType('0');
            _global.top.rolePopusManage('roleManagement');
		});
		$("#contentRight_del").bind('click', function(event) {
			roleManagementIframe.window.DelRole();
		});
		
		$("#contentRight_search_img").bind('click',function(event){
			var value = $('#contentRight_search_input').val();
			roleManagementIframe.window.setQueryRoleValue(value);
			//roleManagementIframe.window.queryRole();
            roleManagementIframe.window.search_queryRole();//模糊查询未重置到第一页而改2017年10月23日17:03:12
		});
        //模糊搜索绑定回车
        $("#contentRight_search_input").keydown(function(event){
            if(event.keyCode == 13){ //绑定回车
                var value = $(this).val();
                roleManagementIframe.window.setQueryRoleValue(value);
                //roleManagementIframe.window.queryRole();
                roleManagementIframe.window.search_queryRole();//模糊查询未重置到第一页而改2017年10月23日17:03:12
            }
        });
	}

	function _switchTabItem(tabStr){
		switch (tabStr) {
			case 'roleManagement_tab':
               // _global.top.setDeviceIframeTab('roleManagement_tab');
				$("#roleManagementIframe").css('width', '100%');
				$("#roleManagementIframe").siblings().css('width', '0px');
				break;
			default:
				// statements_def
				break;
		}
	}

})(window,jQuery,undefined);