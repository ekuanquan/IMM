$(document).ready(function() {
	init();
});

;
(function(window, $) {
	window.init = _init;
	window.setAreaName = _setAreaName;
	window.setRole = _setRole;
	var _config = {
		ajaxUrl : {
			getUserInfoByUserIdUrl : '../../../../../getGeneralUserInfoByUserId.do',
			alterOwnerUserInfoUrl : '../../../../../alterGeneralUserInfo.do',
			getOwnerDropDownUrl : '../../../../../DropDown/getOwnerDropDown.do',
			getRoleByUserIdUrl : '../../../../../getRoleByUserId.do'
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
		popupsName : 'addGeneralUser',
		role : {
			roleId : "",
			roleType : '',
			roleName : '',
			fMemo : ''
		}
	}

	function _init() {
		_initData();
		_initEvent();
		validate();
	}

	function _initData() {
		_getOwnerDropDown('center', _callback_getCenter);
		_getOwnerDropDown('business', _callback_getBusiness);
		_getOwnerDropDown('userServerType', _callback_getUserServerType);
		if (parent.getTopPopupsName
				&& typeof (parent.getTopPopupsName) == 'function') {
			_global.popupsName = parent.getTopPopupsName();
		}
		if (_global.popupsName == 'addGeneralUser') {
			var createTime = getNowFormatDate();
			$("#createDate").val(createTime);
		}
		if (_global.popupsName == 'alterGeneralUser') {
			_getUserInfo();
			_getRoleInfo();
			_alterEvent();
		}

	}

	function _initEvent() {
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
		$("#confirmButton").bind('click', function() {
			if (_global.form.form()) {
				_submitOwnerInfo();
			}
			;
		});
		$('#createDate').click(function() {
			WdatePicker({
				dateFmt : 'yyyy-MM-dd',
				isShowClear : false
			});
			// this.blur();
		});
		$('#areaName').click(function() {
			parent.PopusManage('openArea');
		});
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
		$("#userServerType").css({
			"pointer-events" : "none",
			"opacity" : "0.5"
		});
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
			_showOwnerPojo(data.generalUserPojo);
		}
	}

	function _showOwnerPojo(generalUserPojo) {
		// ownerPojo = _exchangeText(ownerPojo);
		$("#userAccount").val(generalUserPojo.userAccount);
		$("#userPwd").val(generalUserPojo.userPwd);
		$("#createDate").val(generalUserPojo.createDate);
		$("#userId").val(generalUserPojo.userId);
		$("#userName").val(generalUserPojo.userName);
		// $("#userType").val(generalUserPojo.userType);
		$("#userAddr").val(generalUserPojo.userAddr);
		$("#userProperty option[value='" + generalUserPojo.userProperty + "']")
				.attr("selected", true);
		$("#businessName").val(generalUserPojo.businessId);
		// $("#businessName option[value='" + generalUserPojo.businessId +
		// "']").attr("selected", true);
		$("#centerName option[value='" + generalUserPojo.centerId + "']").attr(
				"selected", true);
		$("#payNO").val(generalUserPojo.payNO);
		$(
				"#userServerType option[value='"
						+ generalUserPojo.userServerType + "']").attr(
				"selected", true);
		$("#contact").val(generalUserPojo.contact);
		$("#contactPayNO").val(generalUserPojo.contactPayNO);
		$("#cHmPhone").val(generalUserPojo.cHmPhone);
		$("#cPhone").val(generalUserPojo.cPhone);
		$("#cMobile").val(generalUserPojo.cMobile);
		$("#areaName").val(generalUserPojo.areaName);
		$("#areaName").data('areaId', generalUserPojo.areaId);
		$("#isPay option[value='" + generalUserPojo.isPay + "']").attr(
				"selected", true);
		$("#isVideoCheck option[value='" + generalUserPojo.isVideoCheck + "']")
				.attr("selected", true);
		_global.role.roleId = generalUserPojo.roleId;
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
		if (row_json.roleType == '0') {
			row_json.roleType = '客户';
		} else if (row_json.roleType == '1') {
			row_json.roleType = '系统管理员';
		} else if (row_json.roleType == '2') {
			row_json.roleType = '中心管理员';
		} else if (row_json.roleType == '3') {
			row_json.roleType = '客户';
		}
		$div_row = $("<div></div>");
		$roleId = $("<div></div>");
		$roleType = $("<div></div>");
		$roleName = $("<div></div>");
		$fMemo = $("<div></div>");

		$div_row.append($roleId).append($roleType).append($roleName).append(
				$fMemo).addClass('row');
		$roleId.addClass('table_item_4').text(row_json.roleId).attr("title",
				row_json.roleId);
		$roleType.addClass('table_item_4').text(row_json.roleType).attr(
				"title", row_json.roleType);
		$roleName.addClass('table_item_4').text(row_json.roleName).attr(
				"title", row_json.roleName);
		$fMemo.addClass('table_item_4').text(row_json.fMemo).attr("title",
				row_json.fMemo);
		$div_row.appendTo($("#table_content"));
		$div_row.bind('dblclick', function(e) {

		});
	}

	function _getSubmitOwnerInfoParams() {
		var params = {};
		params.operation = '';
		params.ownerPojo = {};
		if (_global.popupsName == 'addGeneralUser') {
			params.operation = 'add';

		}
		if (_global.popupsName == 'alterGeneralUser') {
			params.operation = 'alter';
		}

		var ownerPojo = {};
		ownerPojo.userAccount = $("#userAccount").val();
		ownerPojo.createDate = $("#createDate").val();
		ownerPojo.userPwd = $("#userPwd").val();
		ownerPojo.userId = pad2($("#userId").val());
		ownerPojo.userType = $("#userType option:selected").val();
		ownerPojo.userProperty = $("#userProperty option:selected").val();
		ownerPojo.centerId = $("#centerName option:selected").val();
		ownerPojo.userServerType = $("#userServerType option:selected").val();
		ownerPojo.userName = $("#userName").val();
		ownerPojo.userAddr = $("#userAddr").val();
		ownerPojo.businessId = $("#businessName option:selected").val();
		ownerPojo.businessName = $("#businessName option:selected").text();
		ownerPojo.payNO = $("#payNO").val();
		ownerPojo.contact = $("#contact").val();
		ownerPojo.cHmPhone = $("#cHmPhone").val();
		ownerPojo.cMobile = $("#cMobile").val();
		ownerPojo.contactPayNO = $("#contactPayNO").val();
		ownerPojo.cPhone = $("#cPhone").val();
		ownerPojo.areaId = $("#areaName").data('areaId');
		ownerPojo.isVideoCheck = $("#engageTest").val();
		ownerPojo.nomTest = $("#nomTest").val();
		ownerPojo.isVideoCheck = $("#isVideoCheck option:selected").val();
		ownerPojo.isPay = $("#isPay option:selected").val();
		ownerPojo.roleId = _global.role.roleId;
		params.ownerPojo = ownerPojo;
		return params;
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

	function _callback_getCenter(data) {
		var result = data.result;
		if (result.code == '0') {
			var dropDownPojo = data.dropDownPojo;
			for (var i = 0; i < dropDownPojo.length; i++) {
				var $option = $("<option></option>");
				$option.attr('value', dropDownPojo[i].key);
				$option.text(dropDownPojo[i].value);
				$option.appendTo($("#centerName"));
			}
		} else {
			alert("请求失败！");
		}
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
			alert("请求失败！");
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
			alert("请求失败！");
		}
	}

	function _submitOwnerInfo() {
		var params = _getSubmitOwnerInfoParams();
		post_async(params, _config.ajaxUrl.alterOwnerUserInfoUrl,
				_callback_submitOwnerInfo);
	}

	function _callback_submitOwnerInfo(data) {
		var result = data.result;
		if (result.code == '0') {
			alert("提交成功");
		} else {
			alert("提交失败");
		}
	}

	function _setAreaName(area) {
		$("#areaName").val(area.name);
		var areaId = area.id;
		$("#areaName").data('areaId', areaId);
	}

	function validate() {
		validate1();
	}

	function validate1() {
		var $form = $("#form");
		_global.form = $form.validate({

			rules : {
				userAccount : {
					required : true,
				},
				userPwd : {
					required : true,
				},
				userId : {
					required : true,
				},
				userName : {
					required : true,
				},
				areaName : {
					required : true,
				}
			},

		});
	}

	function _setRole(role) {
		_global.role = role;
		_clearRow();
		_addRow(role);
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
	// 用户编号长度最小为9位不足前面补零
	function pad2(num) {
		if ((num + "").length >= 9)
			return num;
		return pad2("0" + num, 9);
	}
})(window, jQuery);