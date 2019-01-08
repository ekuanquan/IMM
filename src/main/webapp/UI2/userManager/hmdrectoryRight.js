$(document).ready(function() {
	init();
});
;(function(window,$,undefined){
	window.init = _init;
	window.showUserInfoManager = _showUserInfoManager;
	var _global = {
		top:parent,
        treeNode:"",
        flag:[]
	};


	function _init(){
		_initEvent();
        /*chackOneClick();*/
	}
	//事件绑定函数
	function _initEvent(){
	    _global.flag = [0,0];
		$(".tab_item").bind('click', function(event) {	
			$(this).removeClass('tab_noChecked').addClass('tab_isChecked');
			$(this).siblings().removeClass('tab_isChecked').addClass('tab_noChecked');
			_switchTabItem($(this).attr('id'));
		});
		//默认点击一次客户
		$("#customer_tab").click();
		$("#contentRight_add").bind('click', function(event) {
            _global.top.userPopusManager('selectUser');
		});
		$("#contentRight_del").bind('click', function(event) {
            _delUserInfo();
		});
        //计划任务点击事件
        $("#contentRight_taskPlan").bind('click', function(event) {
            var iframeTab =  _global.top.getUserIframeTab();
            var result = '';
            switch (iframeTab) {
                case 'customer_tab':
                    //customerIframe.delUserInfo();
                    result = customerIframe.determinecls();
                    _taskPlan(result);
                    customerIframe.getCustomerinframes();
                    break;
                case 'operator_tab':
                    result = operatorIframe.determinecls();
                    _taskPlan(result);
                    operatorIframe.getOperator();
                    break;
                default :
                    break;
            }
        });
        function _taskPlan(result) {
            if(result.row == ""){
                //alert("请选择你需要修改的任务计划！");
                _global.top.alertTip("请选择用户！",0,null);
            }
            else{
                _global.top.userPopusManager('taskplan',result.div_row);
                result.row = "";
            }
        }
		//搜索按钮  根据userId userName 模糊搜索
        $("#contentRight_search_img").bind('click', function(event) {

            var userId_name = $("#contentRight_search_input").val();
            _showUserInfoSearch(userId_name);
        });
        $("#contentRight_search_input").keydown(function(event){
            if(event.keyCode == 13){ //绑定回车
                var userId_name = $(this).val();
                _showUserInfoSearch(userId_name);
            }
        });

	}

	function _switchTabItem(tabStr){
		switch (tabStr) {
			case 'customer_tab':
                _global.top.setUserIframeTab('customer_tab');
				$("#customerIframe").css('width', '100%');
				$("#customerIframe").siblings().css('width', '0px');
				/*if(_global.flag[0] == 0){
                    customerIframe.showCustomerinframe(_global.treeNode.id);
                    _global.flag[0] = 1;
                }*/
				break;
			case 'operator_tab':
                _global.top.setUserIframeTab('operator_tab');
				$("#operatorIframe").css('width', '100%');
				$("#operatorIframe").siblings().css('width', '0px');
                if(_global.flag[1] == 0){
                    operatorIframe.showOperatorIframe(_global.treeNode.id);
                    _global.flag[1] = 1;
                }
                //operatorIframe.showOperatorIframe();
				break;
			default:
				break;
		}
	}
	function _showUserInfoManager(treeNode){
        $("#contentRight_search_input").val('');
        _global.treeNode = treeNode;
		var iframeTab =   _global.top.getUserIframeTab();
		switch (iframeTab){
			case 'customer_tab':
                customerIframe.showCustomerinframe(treeNode.id);
				break;
			case 'operator_tab':
                operatorIframe.showOperatorIframe(treeNode.id);
				break;
			default :
				break;
		}
	}
	//用户id、用户名称 模糊搜索
	function _showUserInfoSearch(userId_name) {

        var iframeTab =   _global.top.getUserIframeTab();
        switch (iframeTab){
            case 'customer_tab':
                customerIframe.showCustomerinframeSearch(userId_name);
                break;
            case 'operator_tab':
                operatorIframe.showOperatorIframeSearch(userId_name);
                break;
            default :
                break;
        }
    }

    function _delUserInfo() {
        var iframeTab =   _global.top.getUserIframeTab();
        var result = "";
        switch (iframeTab){
            case 'customer_tab':
                result = customerIframe.determinecls();
                _delinfo(result);
                customerIframe.delUserInfo();
                //customerIframe.getCustomerinframes();
                break;
            case 'operator_tab':
                result = operatorIframe.determinecls();
                _delinfo(result);
                operatorIframe.delUserInfo();
                //operatorIframe.getOperator();
                break;
            default :
                break;
        }
    }
    function _delinfo(result) {
        if(result.row == ""){
            //alert("请选择你需要修改的任务计划！");
            _global.top.alertTip("请先选择你所要删除的用户！",0,null);
        }
        else{
            //_global.top.userPopusManager('taskplan',result.div_row);
            result.row = "";
        }
    }
})(window,jQuery,undefined);
/*
$(window).load(function(){
    var node = zTreeObj.getNodeByParam("id", "DEFAULTDIR");
    zTreeObj.selectNode(node);
    setting.callback.onClick = zTreeOnClick('','DEFAULTDIR',node);
});*/
