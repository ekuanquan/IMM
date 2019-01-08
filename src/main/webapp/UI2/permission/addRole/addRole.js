/**
 * Created by ywhl on 2017/6/8.
 */
$(document).ready(function() {
    $(".registerform").Validform({
        tiptype:2,
        btnSubmitId:"sure",
        callback:sure
    });
	addRoleinit();

});

;
(function(window, $) {
	window.addRoleinit = _init;
	//window.open_associatedApparatus =_open_associatedApparatus;
	window.open_associatedApparatusAdd = _open_associatedApparatusAdd;
	window.setAAERowJson = _setAAERowJson;
	window.getAAERowJson = _getAAERowJson;
	window.sure = _sure;
	var _global = {
		top: parent.parent,
		ajaxUrl: {
			addRole: '/IntegratedMM/role/addRole.do'
		},
		popupsData: {
			rowJson: ""
		}
	};

	function _init() {
		_initEvent();
		$("#close,#cancel").bind('click', function() {
			parent.closeMapPopus();
		});
		/*$('#sure').bind('click', function() {
			_getParams();
		});*/
		$('#roleType').data('key', '0');
	}

	//事件绑定函数
	function _initEvent() {
		$(".tab_item").bind('click', function(event) {
			$(this).removeClass('tab_noChecked').addClass('tab_isChecked');
			$(this).siblings().removeClass('tab_isChecked').addClass('tab_noChecked');
			_switchTabItem($(this).attr('id'));
		});
		//默认点击一次首页
		$("#permissionAssignment_tab").click();

		$("#contentRight_add").bind('click', function(event) {
			_global.top.rolePopusManage('roleManagement');
		});
		/*$("#contentRight_del").bind('click', function(event) {
			
		});*/
		$('#roleType').bind('click', function() {
			var $this = $(this);
			manageDDBox($this, $('#roleBox'));

		});

		$('#roleBox > span').click(function() {
			var $this = $(this);
			var $input = $('#roleType');
			$input.data('key', $this.attr('name'));
			$input.val($this.text());
			$('#roleBox').addClass('hide').removeClass('show');
		});
	}

	function manageDDBox(ObjDiv, ObjDD) {
		var $ObjDiv = $(ObjDiv);
		var $ObjDD = $(ObjDD);
		var isShow = $ObjDD.hasClass('show');
		if(isShow == true) {
			$ObjDD.addClass('hide').removeClass('show');
		} else {
			$('.ddBox').addClass('hide').removeClass('show');
			var left = $ObjDiv.offset().left + 'px';
			var top = $ObjDiv.offset().top + 24 + 1 + 'px';
			$ObjDD.addClass('show').removeClass('hide');
			$ObjDD.css('top', top);
			$ObjDD.css('left', left);
		}
	}

	function _switchTabItem(tabStr) {
		switch(tabStr) {
			case 'permissionAssignment_tab':
				//_global.top.setDeviceIframeTab('permissionAssignment_tab');
				$("#permissionAssignmentIframe").css('width', '100%');
				//$("#permissionAssignmentIframe").css('background-color', 'darkred');
				$("#associatedApparatusIframe").css('width', '0px');
				$(".endbutt").css('width', '100%');
				break;
			case 'associatedApparatus_tab':
				//_global.top.setDeviceIframeTab('associatedApparatus_tab');
				$("#associatedApparatusIframe").css('width', '100%');
				$("#permissionAssignmentIframe").css('width', '0px');
				break;
			default:
				// statements_def
				break;
		}
	}

	function _getAAERowJson() {
		//console.log('传出去的' + JSON.stringify(_global.popupsData.rowJson));
		return _global.popupsData.rowJson;
	}

	function _setAAERowJson(rowJson) {
		//console.log('传进来的' + JSON.stringify(rowJson));
		_global.popupsData.rowJson = rowJson;
	}

	/*function _open_associatedApparatus(){
	      _openPopups($('body'), "editDev.html", {
            width: 387,
            height: 346
        });
	};*/
	function _open_associatedApparatusAdd() {
		_openPopups($('body'), "addDev/hmdrectory.html", {
			/*width: 1280,
			height: 720*/
            width: 1000,
            height: 600
		});
	};

	function _getParams() {
		//设备编号列表
		var devLists = associatedApparatusIframe.window.getAddDevList();
		var permissionList = permissionAssignmentIframe.window.getProcessingList();
		var params = {};
		params.roleId = pad2($('#roleId').val());
		params.roleName = $('#roleName').val();
		params.roleType = $('#roleType').data('key');
		params.fMemo = $('#fMemo').val();
		params.devList = devLists;
		params.permissionList = permissionList;
		_addRole(params);
	}

	function _addRole(params) {
		////console.log('_addRole-----' + JSON.stringify(params));
		post_async(params, _global.ajaxUrl.addRole, callbackRefreshList);

	}

	function _sendRole() {
		var role = {};
		role.roleId = $('#roleId').val();
		role.roleName = $('#roleName').val();
		role.roleType = $('#roleType').data('key');
		role.fMemo = $('#fMemo').val();
		if(_global.top.mainDivIframe) {
			if(_global.top.mainDivIframe.alterUserIframe.setRole && (typeof(_global.top.mainDivIframe.alterUserIframe.setRole) == 'function')) {
				_global.top.mainDivIframe.alterUserIframe.setRole(role);
			}
		}
	}
    function _sure(flag){
        if(flag){
            _getParams();
        }else{
            //alert("验证不通过");
            _global.top.alertWarn("请填写完整信息",2000,null);
        }
    }
	function callbackRefreshList(data) {
		//console.log('callbackrefreshList----------' + JSON.stringify(data));
		if(data.result.code == 200) {
			var roleType = $('#roleType').data('key');
			//添加完后改变树的选中状态
			if(parent.permissionIframe&&parent.permissionIframe.clickNode&&(typeof (parent.permissionIframe.clickNode)=='function')){
				parent.permissionIframe.clickNode(roleType);
			}
			//添加雪亮万家转发权限
			permissionAssignmentIframe.window.setXLWJforwarding($('#roleId').val());


			_sendRole();
            _global.top.alertSuccess("角色信息保存成功", 2000);
            if(_global.top.permissionIframe.roleManagementIframe&&_global.top.permissionIframe.roleManagementIframe.setRoleType && (typeof(_global.top.permissionIframe.roleManagementIframe.setRoleType) == 'function')) {
                _global.top.permissionIframe.roleManagementIframe.setRoleType(roleType);
            }
            if(_global.top.permissionIframe.roleManagementIframe && _global.top.permissionIframe.roleManagementIframe.getRole && (typeof(_global.top.permissionIframe.roleManagementIframe.getRole) == 'function')) {
                _global.top.permissionIframe.roleManagementIframe.getRole();
            }
			parent.closeMapPopus();
		} else {
			//_global.top.alertTip(data.result.message, 2000, null);
            _global.top.alertTip(data.result.message, 2000, null);
		}
	}
    //用户编号长度最小为9位不足前面补零
    function pad2(num) {
        if ((num + "").length >= 9) return num;
        return pad2("0" + num);
    }

})(window, jQuery);