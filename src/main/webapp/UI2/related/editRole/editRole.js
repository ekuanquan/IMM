/**
 * Created by ywhl on 2017/6/8.
 */

$(document).ready(function() {
	editRoleinit();
});
;
(function(window, $) {
	window.editRoleinit = _init;
	//window.open_associatedApparatusEdit = _open_associatedApparatusEdit;
	window.open_associatedApparatusAdd = _open_associatedApparatusAdd;
	window.open_device=_open_device;
	window.getdevId=_getDevId;
	window.setAAERowJson = _setAAERowJson;
	window.getAAERowJson = _getAAERowJson;
	var _global = {
		top: parent.parent,
		ajaxUrl: {
			editRole: '/IntegratedMM/role/editRole.do'
		},
		popupsData: {
			rowJson: ""
		},
		devId:""
	};

	function _init() {
		_initEvent();
		$("#close,#cancel").click(function() {
		//	parent.closePopus();
			parent.parent._closeCusPopus();
		//	parent.parent.closePopus();
		});
		$('#sure').bind('click', function() {
			_getParams();
		})
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
		_showRole();
	}

	function _showRole() {
		/*var row_json = _global.top.getPopupsRowJson();
		var roleType = '';
		if(row_json.roleType == '0') {
			roleType = '客户';
		} else if(row_json.roleType == '1') {
			roleType = '操作员';
		};*/

		var row_json = parent.parent.getRelatedEditRole();

		$('#roleId').val(row_json.roleId);
		$('#roleName').val(row_json.roleName);
		$('#roleType').val(row_json.roleType);
		$('#fMemo').val(row_json.fMemo);
	}

	function _switchTabItem(tabStr) {
		switch(tabStr) {
			case 'permissionAssignment_tab':
				//$('iframe').css('height','88%')
				//_global.top.setDeviceIframeTab('permissionAssignment_tab');
				$("#permissionAssignmentIframe").css('width', '100%');
				//$("#permissionAssignmentIframe").css('background-color', 'darkred');
				$("#associatedApparatusIframe").css('width', '0px');
				$(".endbutt").css('width', '100%');
				break;
			case 'associatedApparatus_tab':
				//$('iframe').css('height','100%')
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
		console.log('传出去的' + JSON.stringify(_global.popupsData.rowJson));
		return _global.popupsData.rowJson;
	}

	function _setAAERowJson(rowJson) {
		console.log('传进来的' + JSON.stringify(rowJson));
		_global.popupsData.rowJson = rowJson;
	}

	/*function _open_associatedApparatusEdit() {
		_openPopups($('body'), "editDev.html", {
			width: 387,
			height: 346
		});
	};*/

	function _open_associatedApparatusAdd() {
		_openPopups($('body'), "editDev/hmdrectory.html", {
			width: 1280,
			height: 720
		});
	};

	function _open_device(rowjson) {
		_global.devId=rowjson.devId;
        if(rowjson.devType =="1"){
            _openPopups($('body'), "../deviceAdd/alterHost.html", {
                /*width: 771,
                height: 676*/
                width: 1000,
                height: 600
            });
        }
        else if(rowjson.devType =="10"){
            _openPopups($('body'), "../NVRAdd/NVRHost.html", {
               /* width: 771,
                height: 676*/
                width: 1000,
                height: 600
            });
        }
        else if(rowjson.devType =="9") {
            _openPopups($('body'), "../NVRWireAdd/NVRHost.html", {
               /* width: 771,
                height: 676*/
                width: 1000,
                height: 600
            });
        }
        else if(rowjson.devType==13) {
            _openPopups($('body'), "../cardeviceAdd/altercardevice.html", {
                width: 1000,
                height: 600
            });
        }
	};

	function _getDevId(){
		return _global.devId;
	}

	function _getParams() {
		//设备编号列表
		var devLists = associatedApparatusIframe.window.getAddDevList();
		console.log(JSON.stringify(devLists));
		var roleTypeName = $('#roleType').val();
		var rolet = '';
		if(roleTypeName == '客户') {
			rolet = '0';
		} else if(roleTypeName == '操作员') {
			rolet = '1';
		}
		var params = {};
		params.roleId = pad2($('#roleId').val());
		params.roleName = $('#roleName').val();
		params.roleType = rolet;
		params.fMemo = $('#fMemo').val();
		params.devList = devLists;
		_editRole(params);
	}

	function _editRole(params) {
		console.log('_editRole-----点击保存后的参数：' + JSON.stringify(params));
		post_async(params, _global.ajaxUrl.editRole, callbackEditRole);

	}

	function callbackEditRole(data) {
		console.log('callbackEditRole----------'+JSON.stringify(data));
		if (data.result.code == 0) {
			parent.closePopus();
		}
		
	}
    //角色编号长度最小为9位不足前面补零
    function pad2(num) {
        if ((num + "").length >= 9) return num;
        return pad2("0" + num, 9);
    }

})(window, jQuery);