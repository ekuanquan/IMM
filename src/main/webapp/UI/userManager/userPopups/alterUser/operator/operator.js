$(document).ready(function() {
	$(".registerform").Validform({
		beforeCheck : check,
		tiptype : 2,
		btnSubmitId : "confirmButton",
		callback : sure
	});
	init();
});

;
(function(window, $) {
	window.init = _init;
	window.setAreaName = _setAreaName;
	window.setRole = _setRole;
	window.sure = _sure;
	window.check = _check;
	window.isEmpty = isEmpty;
	var _config = {
		ajaxUrl : {
			getUserInfoByUserIdUrl : '../../../../../getOperatorInfoByUserId.do',
			alterOperatorInfoUrl : '../../../../../alterOperatorUserInfo.do',
			getRoleByUserIdUrl : '../../../../../getRoleByUserId.do',
			getOwnerDropDownUrl : '../../../../../DropDown/getOwnerDropDown.do'
		}
	};
	var _global = {
		top : parent.parent,
		plugins : {
			page : null
		},
		getUserInfoParams : {
			userPojo : {
				userId : ""
			}
		},
		popupsName : 'addOperator',
		form : null,
		role : {
			roleId : "",
			roleType : '',
			roleName : '',
			fMemo : ''
		},
		createDate : "",
		main : null,
		platformId : "",
	}

	function _init() {
		_initData();
		_initEvent();
		/* validate(); */
	}

	function _initData() {
		// _getOwnerDropDown('center',_callback_getCenter);
		_getOwnerDropDown('business', _callback_getBusiness);
		_getOwnerDropDown('userServerType', _callback_getUserServerType);
		if (parent.getTopPopupsName
				&& typeof (parent.getTopPopupsName) == 'function') {
			_global.popupsName = parent.getTopPopupsName();
		}
		if (_global.popupsName == 'addOperator') {
			_addEvent();
			var createTime = getNowFormatDate();
			// $("#createDate").val(createTime);
			_global.createDate = createTime;
			// 默认录入时间为当前时间
			var nowTime = getNowFormatDate();
			nowTime = nowTime.split(" ")[0];
			$('#operTime').val(nowTime);
			// 默认录入人为当前操作员
			var returnData = _global.top.getLoginUserName();
			$('#operName').val(returnData.sysuserID);
			// 默认过期时间为20年后
			// var now = new Date();
			var newyear = get20yearDate();
			$('#overDateTime').val(newyear);

			_global.main = parent.parent.getMain();
			$("#platform_name").val(_global.main.platform_name);
			_global.platformId = _global.main.platform_id;
		} else if (_global.popupsName == 'alterSysOperator'
				|| _global.popupsName == 'alterBusinessOperator') {
			_getUserInfo();
			_getRoleInfo();
			_alterEvent();
			// 判断是否是当前的操作员
			_getnowOperator();
		}

	}

	function _initEvent() {
		// 是添加时，支持用户编号模糊搜索
		if (_global.popupsName == 'addOperator') {
			// select可输入
			$('#userId').editableSelect({
				effects : 'default',
			});
			// 使用插件后select变成了input
			$("#userId_sele").attr("maxlength", "9").attr("datatype",
					"16number").attr("nullmsg", "用户编号不能为空").attr("errormsg",
					"请输入用户编号").attr("onblur", "isEmpty('userId_sele','2');");
			$("#userId_sele")
					.bind(
							"input propertychange",
							function() {
								var userId = $("#userId_sele").val();
								if (userId.length >= 6) {
									var param = {
										type : "userUsed",
										value : userId
									};
									post_async(
											param,
											"/IntegratedMM/identifier/queryIdByLike.do",
											_callback_getownerId)
								} else {
									$("#userId_editable-select-options ul")
											.empty();
								}

							});
		}
		$("#title_add").bind("click", function() {
			_global.top.setUserType($("#userType").val());
			_global.top.rolePopusManage('roleManagement');
		});
		$("#title_select").bind("click", function() {

			_global.top.setUserType($("#userType").val());
			parent.PopusManage('selectRole');
		});
		$("#cancelButton").bind("click", function() {
			_global.top.closePopus();
		});
		/*
		 * $("#confirmButton").bind('click', function () {
		 * if(_global.form.form()){ _submitOwnerInfo(); } else {
		 * _global.top.alertWarn("请填写完整信息",2000,null); }
		 * 
		 * });
		 */
		// 失去焦点后将值赋给userId input
		$("#userId_sele").bind("blur", function() {
			$("#userId").val($("#userId_sele").val());
			// console.log($("#userId").val());
		});
		$('#createDate').click(function() {
			WdatePicker({
				dateFmt : 'yyyy-MM-dd',
				isShowClear : false
			});
			// this.blur();
		});
		$('#overDateTime').click(function() {
			WdatePicker({
				dateFmt : 'yyyy-MM-dd',
				isShowClear : false
			});
			// this.blur();
		});

		$('#operTime').click(function() {
			WdatePicker({
				dateFmt : 'yyyy-MM-dd',
				isShowClear : false
			});
			// this.blur();
		});
		$('#areaName').click(function() {
			parent.PopusManage('openArea');
		});
		var json = [ {
			key : "123",
			value : "普通客户"
		}, {
			key : "1234",
			value : "机主客户"
		}, {
			key : "1234",
			value : "机主客户"
		}, {
			key : "1234",
			value : "机主客户"
		}, {
			key : "1234",
			value : "机主客户"
		} ];
	}
	function _alterEvent() {
		$("#userAccount").css({
			"pointer-events" : "none",
			"opacity" : "0.5"
		});
		$("#userId").css({
			"pointer-events" : "none",
			"opacity" : "0.5"
		});
		$("#userType").css({
			"pointer-events" : "none",
			"opacity" : "0.5"
		});
		$("#createDate").css({
			"pointer-events" : "none",
			"opacity" : "0.5"
		});

	}
	function _addEvent() {
		$("#operName").css({
			"pointer-events" : "none",
			"opacity" : "0.5"
		});
		$("#createDate").css({
			"pointer-events" : "none",
			"opacity" : "0.5"
		});
	}
	// 判断是否为当前操作员
	function _getnowOperator() {
		var nowOperattor = _global.top.getLoginUserName().userId;
		console.log("nowOperattor:" + nowOperattor);
		console.log("userId:" + _global.getUserInfoParams.userPojo.userId);
		if (_global.getUserInfoParams.userPojo.userId == nowOperattor) {
			$("#title_add").css({
				"pointer-events" : "none",
				"opacity" : "0.5"
			});
			$("#title_select").css({
				"pointer-events" : "none",
				"opacity" : "0.5"
			});
		}
	}
	function _sure(flag) {
		if (flag) {
			_submitOwnerInfo();
		} else {
			// alert("验证不通过");
			_global.top.alertWarn("请填写完整信息", 2000, null);
		}
	}

	function _getUserInfoParams() {
		var params = {};
		params.userPojo = {};
		params.userPojo = _global.getUserInfoParams.userPojo;
		return params;
	}

	function _getUserInfo() {
		var rowJson = parent.parent.getPopupsRowJson();
		_global.getUserInfoParams.userPojo.userId = rowJson.userId;
		var params = _getUserInfoParams();
		post_async(params, _config.ajaxUrl.getUserInfoByUserIdUrl,
				_callback_getUserInfo);
	}

	function _callback_getUserInfo(data) {
		var result = data.result;
		if (result.code == '0') {
			_showOwnerPojo(data.operatorPojo);
		}
	}

	function _showOwnerPojo(operatorPojo) {
		$("#userAccount").val(operatorPojo.userAccount);
		$("#userPwd").val(operatorPojo.userPwd);
		$("#createDate").val(operatorPojo.createDate);
		$("#userId").val(operatorPojo.userId);
		// $("#userId").append("<option>"+operatorPojo.userId+"</option>");
		$("#userName").val(operatorPojo.userName);
		$("#userType").val(operatorPojo.userType);
		$("#areaName").val(operatorPojo.areaName);
		$("#areaName").data('areaId', operatorPojo.areaId);
		$("#overDateTime").val(operatorPojo.overDateTime);
		$("#acctIP").val(operatorPojo.acctIP);
		$("#sex option[value='" + operatorPojo.sex + "']").attr("selected",
				true);
		$("#cMobile").val(operatorPojo.telephone);
		$("#email").val(operatorPojo.email);
		$("#education option").each(function(i, n) {
			if ($(n).text() == operatorPojo.education) {
				$(n).attr("selected", true);
			}
		})
		$("#office option").each(function(i, n) {
			if ($(n).text() == operatorPojo.office) {
				$(n).attr("selected", true);
			}
		})
		$("#pwdNote").val(operatorPojo.userPWDhint);
		// $("#centerName").val(operatorPojo.centerId);
		$("#acctDY").val(operatorPojo.acctDY);
		$("#fMemo").val(operatorPojo.fMemo);

		$("#operName").val(operatorPojo.operName);
		$("#operTime").val(operatorPojo.operTime);

		$("#platform_name").val(operatorPojo.platformName);
		_global.platformId = operatorPojo.platformId;
	}

	function getNowFormatDate() {
		var date = new Date();
		var seperator1 = "-";
		var month = date.getMonth() + 1;
		var strDate = date.getDate();
		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		var currentdate = date.getFullYear() + seperator1 + month + seperator1
				+ strDate;
		return currentdate;
	}
	function get20yearDate() {
		var date = new Date();
		var seperator1 = "-";
		var month = date.getMonth() + 1;
		var strDate = date.getDate();
		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		var currentdate = (date.getFullYear() + 20) + seperator1 + month
				+ seperator1 + strDate;
		return currentdate;
	}
	function _getRoleInfo() {
		var params = _getUserInfoParams();
		post_async(params, _config.ajaxUrl.getRoleByUserIdUrl,
				_callback_getRoleInfo);
	}

	function _callback_getRoleInfo(data) {
		var result = data.result;

		if (result.code == '0') {
			var rolePojo = data.rolePojo;
			for (var i = 0; i < rolePojo.length; i++) {
				_addRow(rolePojo[i]);
			}
		}
	}

	function _addRow(row_json) {
		var roleType = "";
		if (row_json.roleType == '0') {
			roleType = '客户';
		} else if (row_json.roleType == '1') {
			roleType = '系统管理员';
		} else if (row_json.roleType == '2') {
			roleType = '中心管理员';
		} else if (row_json.roleType == '3') {
			roleType = '客户';
		}
		_global.role = row_json;
		$div_row = $("<div></div>");
		$roleId = $("<div></div>");
		$roleType = $("<div></div>");
		$roleName = $("<div></div>");
		$fMemo = $("<div></div>");

		$div_row.append($roleId).append($roleType).append($roleName).append(
				$fMemo).addClass('row');
		$roleId.addClass('table_item_4').text(row_json.roleId).attr("title",
				row_json.roleId);
		$roleType.addClass('table_item_4').text(roleType).attr("title",
				roleType);
		$roleName.addClass('table_item_4').text(row_json.roleName).attr(
				"title", row_json.roleName);
		$fMemo.addClass('table_item_4').text(row_json.fMemo).attr("title",
				row_json.fMemo);
		$div_row.appendTo($("#table_content"));
		$div_row.bind('dblclick', function(e) {
			// parent.parent.devicePopusManager('openRelatededitRole',row_json);
		});
	}

	function _getSubmitOwnerInfoParams() {
		var params = {};
		params.operation = '';
		params.operatorPojo = {};
		var operatorPojo = {};
		if (_global.popupsName == 'addOperator') {
			params.operation = 'add';
			operatorPojo.userId = pad2($("#userId").val());// 添加时前面自动补零
		} else if (_global.popupsName == 'alterSysOperator') {
			params.operation = 'alter';
			operatorPojo.userId = $("#userId").val();// 修改时保持不变
		}

		operatorPojo.userAccount = $("#userAccount").val();
		// operatorPojo.createDate = $("#createDate").val();
		operatorPojo.createDate = _global.createDate;
		operatorPojo.userPwd = $("#userPwd").val();

		operatorPojo.userType = $("#userType").val();
		operatorPojo.overDateTime = $("#overDateTime").val();// 过期时间
		operatorPojo.sex = $("#sex").val();
		operatorPojo.email = $("#email").val();
		operatorPojo.office = $("#office option:selected").text(); // 操作员职务
		// operatorPojo.centerId = $("#centerName").val();
		// operatorPojo.centerName = $("#centerName option:selected").text();
		operatorPojo.fMemo = $("#fMemo").val();
		operatorPojo.userName = $("#userName").val();
		operatorPojo.areaId = $("#areaName").data('areaId');
		operatorPojo.areaName = $("#areaName").val();
		operatorPojo.acctIP = $("#acctIP").val();
		operatorPojo.telephone = $("#cMobile").val();
		operatorPojo.education = $("#education option:selected").text(); // 操作员学历
		operatorPojo.userPWDhint = $("#pwdNote").val();
		operatorPojo.acctDY = $("#acctDY").val();

		operatorPojo.operName = $("#operName").val();
		operatorPojo.operTime = $("#operTime").val();
		operatorPojo.roleId = _global.role.roleId;
		operatorPojo.platformId = _global.platformId;
		params.operatorPojo = operatorPojo;
		return params;
	}

	function _submitOwnerInfo() {
		if (_global.popupsName == 'addOperator') {
			callbackdelsuc();
		} else if (_global.popupsName == 'alterSysOperator') {
			_global.top.comfireFloat("确定修改此操作员信息？", callbackdelsuc, null);
		}
	}
	function callbackdelsuc() {
		var params = _getSubmitOwnerInfoParams();
		post_async(params, _config.ajaxUrl.alterOperatorInfoUrl,
				_callback_submitOwnerInfo);
	}

	function _callback_submitOwnerInfo(data) {
		var result = data.result;
		if (result.code == '0') {
			// alert("提交成功");
			_global.top.alertTip("操作员信息保存成功", 2000, null);
			_global.top.RefreshoperatorIframe();
			_global.top.closePopus();
		} else {
			// alert("提交失败");
			// _global.top.alertTip("操作员信息保存失败！",2000,null);
			if (result.code == '1') {
				// alert("提交成功");
				_global.top.alertTip("操作员信息保存失败", 0, null);
			} else if (result.code == '2') {
				// alert("提交成功");
				_global.top.alertTip("该操作员已存在", 0, null);
			}
		}
	}

	function _getOwnerDropDownParams(dropDownName) {
		var params = {}
		params.DropDownName = dropDownName;
		return params;
	}
	function _getOwnerDropDown(dropDownName, _callback_getOwnerDropDown) {
		var params = _getOwnerDropDownParams(dropDownName);
		var data = post_sync(params, _config.ajaxUrl.getOwnerDropDownUrl);
		_callback_getOwnerDropDown(data);
		// post_async(params, _config.ajaxUrl.getOwnerDropDownUrl,
		// _callback_getOwnerDropDown);
	}
	function _callback_getBusiness(data) {
		var result = data.result;
		if (result.code == '0') {
			var dropDownPojo = data.dropDownPojo;
			for (var i = 0; i < dropDownPojo.length; i++) {
				var $option = $("<option></option>");
				$option.attr('value', dropDownPojo[i].key);
				$option.text(dropDownPojo[i].value);
				$option.appendTo($("#businessName"));
			}
		} else {
			// alert("请求失败！");
			_global.top.alertTip("请求失败！", 0, null);
		}
	}
	function _callback_getUserServerType(data) {
		var result = data.result;
		if (result.code == '0') {
			var dropDownPojo = data.dropDownPojo;
			for (var i = 0; i < dropDownPojo.length; i++) {
				var $option = $("<option></option>");
				$option.attr('value', dropDownPojo[i].key);
				$option.text(dropDownPojo[i].value);
				$option.appendTo($("#userServerType"));
			}
		} else {
			// alert("请求失败！");
			_global.top.alertTip("请求失败！", 0, null);
		}
	}
	function _setAreaName(area) {
		$("#areaName").val(area.name);
		var areaId = area.id;
		$("#areaName").data('areaId', areaId);
		$("#areaName").blur();
	}
	function _setRole(role) {
		_global.role = role;
		_clearRow();
		_addRow(role);
	}
	function _clearRow() {
		$(".row").each(function() {
			var $this = $(this);
			$this.remove();
		});
	}
	function isEmpty(field, type) {
		var textValue = $("#" + field).val();
		if (textValue != "") {
			if (type == "1") {
				post_async({
					"validateName" : "userAccount",
					"validateValue" : textValue
				}, "../../../../../validate/isCanUse.do", validate_callback,
						field);
			}
			if (type == "2") {
				post_async({
					"validateName" : "userId",
					"validateValue" : textValue
				}, "../../../../../validate/isCanUse.do", validate_callback,
						field);
			}
		} else {

		}
	}
	function validate_callback(data, field) {
		if (data.result.code == 0) {
			if (field == "userAccount") {
				$("#userAccount").next().removeClass("Validform_sigh")
						.removeClass("Validform_wrong").addClass(
								"Validform_right");
			}
			if (field == "userId_sele") {
				$("#userId_sele").next().removeClass("Validform_sigh")
						.removeClass("Validform_wrong").addClass(
								"Validform_right");
			}
		} else if (data.result.code == 1) {
			if (field == "userAccount") {
				// alert("该用户账号已经存在。");Validform_wrong Validform_right
				_global.top.alertSuccess("该操作员账户已经存在", 2000, null);
				$("#userAccount").next().removeClass("Validform_sigh")
						.removeClass("Validform_right").addClass(
								"Validform_wrong");
			}
			if (field == "userId_sele") {
				// alert("该用户编号已经存在。");
				_global.top.alertFail("该操作员编号已经存在", 2000, null);
				$("#userId_sele").next().removeClass("Validform_sigh")
						.removeClass("Validform_right").addClass(
								"Validform_wrong");
			}
		} else if (data.result.code == 2) {
			if (field == "userAccount") {
				_global.top.alertSuccess("该操作员账号格式有误", 2000, null);
			}
			if (field == "userId_sele") {
				_global.top.alertFail("该操作员编号格式有误", 2000, null);
				$("#userId_sele").next().removeClass("Validform_sigh")
						.removeClass("Validform_right").addClass(
								"Validform_wrong");
			}
		}
	}
	function _check() {
		var sigh = $(".Validform_sigh");
		var wrong = $(".Validform_wrong");
		if (sigh.length == 0 && wrong.length == 0) {
			return true;
		} else {
			_global.top.alertWarn("请填写完整信息", 2000, null);
			return false;
		}
	}
	// 获取可用的机主编号
	function _callback_getownerId(data) {
		$("#userId_editable-select-options ul").empty();
		if (data.result.code && data.result.code == "200") {
			var length = data.values.length;
			if (length > 10) {
				length = 10;
			}
			for (var i = 0; i < length; i++) {
				var $option = $("<li></li>");
				$option.attr("value", i);
				$option.text(data.values[i]);
				$option.attr("style", "display: list-item;");
				$option.appendTo($("#userId_editable-select-options > ul"));
			}
			$("#userId_editable-select-options").css("display", "block");
		}
		$("#userId_editable-select-options ul li").bind("mousedown",
				function() {
					$("#userId_sele").val(this.innerHTML);
				}).bind("mouseover", function() {
			this.siblings().removeClass("selected");
			this.addClass("selected");
			// this.css("background","blue");
		})
	}
	// 用户编号长度最小为9位不足前面补零
	function pad2(num) {
		if ((num + "").length >= 9)
			return num;
		return pad2("0" + num, 9);
	}
})(window, jQuery);