$(document).ready(function() {
	resizeDocment(); //重绘函数
	$(window).resize(function() {
		resizeDocment(); //重绘函数
	});
	init();
});

;
(function(window, $) {
	window.init = _init;
	window.resizeDocment = _resizeDocment;
	window.getRole = _getRole;
	window.DelRole = _DelRole;
	window.queryRole = _queryRole;
	window.setRoleType = _setRoleType;
	window.setQueryRoleValue = _setQueryRoleValue;
	window.search_queryRole = _search_queryRole;
	var _config = {
		ajaxUrl: {
			getRole: '../../../role/ctrlRole.do',
			queryRole: '../../../role/queryRole.do',
			delRole: '/IntegratedMM/roleArea/delete.do',
			transmitDeleteRole: '/IntegratedMM/role/transmitDeleteRole.do'
		}
	};

	var _global = {
		top: parent.parent,
		plugins: {
			page: null
		},
		getRoleframeParams: {
			roleType: '',
			value: '',
			pageInfoPojo: {
				currentPage: '1',
				sort: 'userId|DESC',
				pageSize: '25',
				totalNum: '',
				totalPage: ''
			}
		},
		platformId:"",
	};

	var platformId= parent.parent.getMain();
	function _resizeDocment() {

	}

	function _init() {
		_initEvent();
	}

	function _initEvent() {

		_global.plugins.page = new YW.PAGEUI({
			ID: 'pageBox',
			clickPage: _queryData_page,
			cssPath: '../../tool/jquery-page-1.0.1/jquery-page-1.0.1.css'
		});

		//_getRole();
	}

	function _setRoleType(roleType) {
		_global.getRoleframeParams.roleType = roleType;
	}

	function _setQueryRoleValue(value) {
		_global.getRoleframeParams.value = value;
	}

	function _addRow(row_json, isPre) {
		var roleType = '';
		if(row_json.roleType == '0') {
			roleType = '客户';
		} else if(row_json.roleType == '1') {
			roleType = '系统管理员';
		}else if(row_json.roleType == '2') {
			roleType = '中心管理员';
		}else if(row_json.roleType == '3') {
			roleType = '客户';
		};

		$div_row = $("<div></div>");
		$div_roleId = $("<div></div>");
		$div_roleName = $("<div></div>");
		$div_roleType = $("<div></div>");
		$div_fMemo = $("<div></div>");

		$div_row
			.append($div_roleId)
			.append($div_roleType)
			.append($div_roleName)
			.append($div_fMemo)
			.addClass('row')
			.attr('id', row_json.roleId);
		$div_roleId.addClass('table_item_4').text(row_json.roleId).attr("title", row_json.roleId);
		$div_roleType.addClass('table_item_4').text(roleType).attr("title", roleType);
		$div_roleName.addClass('table_item_4').text(row_json.roleName).attr("title", row_json.roleName);
		$div_fMemo.addClass('table_item_5').text(row_json.fMemo).attr("title", row_json.fMemo);
		$div_row.appendTo($("#table_content")).data('row_json', row_json);

		$div_row.bind('dblclick', function(e) {
			var $this = $(this);
			var rowjson = $this.data('row_json');
			var mainPojo = _global.top.getMain();
			if(mainPojo.platform_id != rowjson.platformId){
                _global.top.rolePopusManage('viewRole');
			}else {
                _global.top.rolePopusManage('editRole');
			}
			_global.top.setPopupsRowJson(rowjson);


		});
		$div_row.bind('click', function(e) {
			_global.platformId=row_json.platformId;
			var $this = $(this);
			if($this.hasClass('row_isChecked')) {
				$this.removeClass('row_isChecked');
			} else {
				$this.addClass('row_isChecked');
				$this.siblings().removeClass('row_isChecked');
			}
		});

	}

	function _queryRoleframeParams() {
		var params = {};
		params.pageInfoPojo = {};
		params.roleType = _global.getRoleframeParams.roleType == '' ? '0' : _global.getRoleframeParams.roleType;
		params.value = _global.getRoleframeParams.value;
		params.pageInfoPojo.currentPage = _global.getRoleframeParams.pageInfoPojo.currentPage;
		params.pageInfoPojo.sort = _global.getRoleframeParams.pageInfoPojo.sort;
		params.pageInfoPojo.pageSize = _global.getRoleframeParams.pageInfoPojo.pageSize;
		return params;
	}

	function _queryRole() {
		$('body').loading();
		var params = _queryRoleframeParams();
		//console.log(JSON.stringify(params));
		post_async(params, _config.ajaxUrl.queryRole, callbackRole);
	}
	//模糊搜索
    function _search_queryRole() {
        $('body').loading();
        _setQueryRoleValue($('#contentRight_search_input',parent.document).val());
        var params = _getRoleframeParams();
        //console.log(JSON.stringify(params));
        post_async(params, _config.ajaxUrl.queryRole, callbackRole);
    }

	function _getRole() {
		$('body').loading();
		_setQueryRoleValue($('#contentRight_search_input',parent.document).val());
		var params = _queryRoleframeParams();
		//console.log(JSON.stringify(params));
		post_async(params, _config.ajaxUrl.queryRole, callbackRole);
	}

	function _getRoleframeParams() {
        var params = {};
        params.pageInfoPojo = {};
        params.roleType = _global.getRoleframeParams.roleType == '' ? '0' : _global.getRoleframeParams.roleType;
        params.value = _global.getRoleframeParams.value;
        params.pageInfoPojo.currentPage = "1";
        params.pageInfoPojo.sort = _global.getRoleframeParams.pageInfoPojo.sort;
        params.pageInfoPojo.pageSize = _global.getRoleframeParams.pageInfoPojo.pageSize;
        return params;
	}

	function callbackRole(data) {
		//console.log(JSON.stringify(data));
		var result = data.result;
		$('body').removeLoading();
		if(result.code == 200) {
			var pageInfoPojo = data.pageInfoPojo;
			var totalNum = pageInfoPojo.totalNum;
			var totalPage = pageInfoPojo.totalPage;
			var currentPage = pageInfoPojo.currentPage;
			_global.getRoleframeParams.pageInfoPojo.currentPage = currentPage;
			_global.getRoleframeParams.pageInfoPojo.totalNum = totalNum;
			_global.getRoleframeParams.pageInfoPojo.totalPage = totalPage;
			if(totalNum == 0) totalNum = -1;
			_global.plugins.page.setPage(totalPage, currentPage, totalNum);
			_clearRow();
			var json = data.json;
			for(var i = 0; i < json.length; i++) {
				_addRow(json[i]);
			}

		} else {
			_clearRow();
		}
	}

	function _clearRow() {
		var i = 1;

		$(".row").each(function() {

			var $this = $(this);
			setTimeout(function() {

				$this.remove();
			}, i * 1);
			i++;
		});
	}

	function _DelRole() {
		var $del = $('.row_isChecked', '#table_content');
        var logininfo = _global.top.getLoginUserName();
		if($del.length > 0) {
			if(_global.platformId!=platformId.platform_id) {
				_global.top.alertTip("不能删除非本平台数据！",2000,null);
				return;
			}
			 var rowData=$del.data('row_json');
			if(rowData.userNum && rowData.userNum>0){
                _global.top.alertTip("该角色已绑定用户，不能删除！",2000,null);
                return;
            }
            if($del.attr('id') == logininfo.roleinfo.roleId) {
                _global.top.alertTip("不能删除当前操作用户角色！",0,null);
                return;
            }
			_global.top.comfireFloat("确认要删除角色" + $del.attr('id') +"?",confirmCallback,cancelCallback);
			function confirmCallback() {
				var param = {};
				param.roleId = $del.attr('id');
				post_async(param, _config.ajaxUrl.delRole, callbackDelRole);
				post_async(param, _config.ajaxUrl.transmitDeleteRole);
			}

			function cancelCallback() {
			}
		}
		else {
            _global.top.alertTip("请先选择你所要删除的角色！",0,null);
		}
	}

	function callbackDelRole(data) {
		//console.log(JSON.stringify(data));
		if(data.code == "200") {
			_getRole();
			_global.top.alertSuccess("删除成功", 2000);
		} else {
			_global.top.alertSuccess("删除失败", 2000);
    }
	}

	function _queryData_page(page) {
		_global.getRoleframeParams.pageInfoPojo.currentPage = page;
		var params = _queryRoleframeParams();
		$('body').loading();
		post_async(params, _config.ajaxUrl.queryRole, callbackRole);
	}

})(window, jQuery);