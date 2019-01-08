$(document).ready(function() {
	$(".registerform").Validform({
		beforeCheck : check,
		tiptype : 2,
		btnSubmitId : "confirmButton",
		callback : sure
	});
	init();
});
/*
 * $(document).ready(function () { init(); });
 */

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
		},
		createTime : "",
		main : null,
		platformId : "",
	}

	function _init() {
		_initData();
		_initEvent();
		// validate();
	}

	function _initData() {
		// _getOwnerDropDown('center', _callback_getCenter);
		_getOwnerDropDown('business', _callback_getBusiness);
		_getOwnerDropDown('userServerType', _callback_getUserServerType);
		if (parent.getTopPopupsName
				&& typeof (parent.getTopPopupsName) == 'function') {
			_global.popupsName = parent.getTopPopupsName();
		}
		if (_global.popupsName == 'addGeneralUser') {
			_addEvent();
			var createTime = getNowFormatDate();
			// $("#createDate").val(createTime);
			_global.createTime = createTime;
			// 默认录入人为当前操作员
			var returnData = _global.top.getLoginUserName();
			$('#operName').val(returnData.sysuserID);
			// 默认录入时间为当前时间
			var nowTime = getNowFormatDate();
			nowTime = nowTime.split(" ")[0];
			$('#inputtime').val(nowTime);
			$('#instDate').val(nowTime);

			_global.main = parent.parent.getMain();
			$("#platform_name").val(_global.main.platform_name);
			_global.platformId = _global.main.platform_id;
		}
		if (_global.popupsName == 'alterGeneralUser') {
			_getUserInfo();
			_getRoleInfo();
			_alterEvent();
		}
	}

	function _initEvent() {
		// 是添加时，支持用户编号模糊搜索
		if (_global.popupsName == 'addGeneralUser') {
			// select可输入
			$('#userId').editableSelect({
				effects : 'default',
			});
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
		 * $("#confirmButton").bind('click', function () { if
		 * (_global.form.form()) { _submitOwnerInfo(); } else {
		 * _global.top.alertWarn("请填写完整信息",2000,null); } });
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

		$('#inputtime').click(function() {
			WdatePicker({
				dateFmt : 'yyyy-MM-dd',
				isShowClear : false
			});
			// this.blur();
		});
		$('#instDate').click(function() {
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

	function _sure(flag) {
		if (flag) {
			_submitOwnerInfo();
		} else {
			// alert("验证不通过");
			_global.top.alertTip("请填写完整信息", 0, null);
		}
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

		_global.createTime = generalUserPojo.createDate;
		$("#userId").val(generalUserPojo.userId);
		// $("#userId").append("<option>"+generalUserPojo.userId+"</option>");
		$("#userName").val(generalUserPojo.userName);
		// $("#userType").val(generalUserPojo.userType);
		$("#userAddr").val(generalUserPojo.userAddr);
		$("#userProperty option[value='" + generalUserPojo.userProperty + "']")
				.attr("selected", true);
		$("#businessName").val(generalUserPojo.businessId);
		// $("#businessName option[value='" + generalUserPojo.businessId +
		// "']").attr("selected", true);
		// $("#centerName option[value='" + generalUserPojo.centerId +
		// "']").attr("selected", true);
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
		$("#operName").val(generalUserPojo.operName); // 录入人2017年10月17日11:10:44
		$("#isPay option[value='" + generalUserPojo.isPay + "']").attr(
				"selected", true);
		$("#isVideoCheck option[value='" + generalUserPojo.isVideoCheck + "']")
				.attr("selected", true);
		$("#instDate").val(generalUserPojo.instDate);
		// _global.role.roleId=generalUserPojo.roleId;

		$("#platform_name").val(generalUserPojo.platformName);
		_global.platformId = generalUserPojo.platformId;
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
		_global.role.roleId = row_json.roleId;
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

		});
	}

	function _getSubmitOwnerInfoParams() {
		var params = {};
		params.operation = '';
		params.ownerPojo = {};
		var ownerPojo = {};
		if (_global.popupsName == 'addGeneralUser') {
			params.operation = 'add';
			ownerPojo.userId = pad2($("#userId").val());// 添加时前面自动补零
		}
		if (_global.popupsName == 'alterGeneralUser') {
			params.operation = 'alter';
			ownerPojo.userId = pad2($("#userId").val());// 修改时保持不变
		}

		ownerPojo.userAccount = $("#userAccount").val();
		// ownerPojo.createDate = $("#createDate").val();
		ownerPojo.createDate = _global.createTime;
		ownerPojo.userPwd = $("#userPwd").val();

		ownerPojo.userType = $("#userType option:selected").val();
		ownerPojo.userProperty = $("#userProperty option:selected").val();
		// ownerPojo.centerId = $("#centerName option:selected").val();
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
		ownerPojo.operName = $("#operName").val(); // 录入人2017年10月17日11:16:35
		ownerPojo.isVideoCheck = $("#isVideoCheck option:selected").val();
		ownerPojo.isPay = $("#isPay option:selected").val();
		ownerPojo.instDate = $("#instDate").val();
		ownerPojo.roleId = _global.role.roleId;
		ownerPojo.platformId = _global.platformId;
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
			// alert("请求失败！");
			_global.top.alertTip("请求失败！", 0, null);
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

	function _submitOwnerInfo() {
		/* _global.top.comfireFloat("是否保存修改？",callbackdelsuc,null); */
		_getSubmitOwnerInfoParams();
		if (_global.popupsName == 'addGeneralUser') {
			callbackdelsuc();
		}
		if (_global.popupsName == 'alterGeneralUser') {
			_global.top.comfireFloat("确定修改此客户信息？", callbackdelsuc, null);
		}
	}
	function callbackdelsuc() {
		var params = _getSubmitOwnerInfoParams();
		post_async(params, _config.ajaxUrl.alterOwnerUserInfoUrl,
				_callback_submitOwnerInfo);
	}

	function _callback_submitOwnerInfo(data) {
		var result = data.result;
		if (result.code == '0') {
			// alert("提交成功");
			_global.top.alertTip("客户信息保存成功", 0, null);
			_global.top.RefreshcustomerIframe();
			_global.top.closePopus();
		} else {
			// alert("提交失败");
			// _global.top.alertTip("客户信息保存失败",0,null);
			if (result.code == '1') {
				// alert("提交成功");
				_global.top.alertTip("客户信息保存失败", 0, null);
			} else if (result.code == '2') {
				// alert("提交成功");
				_global.top.alertTip("该客户已存在", 0, null);
			}
		}
	}

	function _setAreaName(area) {
		$("#areaName").val(area.name);
		var areaId = area.id;
		$("#areaName").data('areaId', areaId);
		$("#areaName").blur();
	}

	/*
	 * function validate() { validate1(); }
	 * 
	 * function validate1() { var $form = $("#form"); _global.form =
	 * $form.validate({
	 * 
	 * rules: { userAccount: { required: true, }, userPwd: { required: true, },
	 * userId: { required: true, }, userName: { required: true, }, areaName: {
	 * required: true, } },
	 * 
	 * }); }
	 */

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
		/*
		 * if(data.result.code == 0){
		 * 
		 * }else{ if(field == "userAccount"){ //alert("该用户账号已经存在。");
		 * _global.top.alertSuccess("该用户账号已经存在",2000,null);
		 * //$("#"+field).focus(); } if(field == "userId"){
		 * //alert("该用户编号已经存在。"); _global.top.alertFail("该用户编号已经存在",2000,null);
		 * //$("#"+field).focus(); } }
		 */
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
				_global.top.alertSuccess("该用户账户已经存在", 2000, null);
				$("#userAccount").next().removeClass("Validform_sigh")
						.removeClass("Validform_right").addClass(
								"Validform_wrong");
			}
			if (field == "userId_sele") {
				// alert("该用户编号已经存在。");
				_global.top.alertFail("该用户编号已经存在", 2000, null);
				$("#userId_sele").next().removeClass("Validform_sigh")
						.removeClass("Validform_right").addClass(
								"Validform_wrong");
			}
		} else if (data.result.code == 2) {
			if (field == "userAccount") {
				_global.top.alertSuccess("该用户账号格式有误", 2000, null);
			}
			if (field == "userId_sele") {
				_global.top.alertFail("该用户编号格式有误", 2000, null);
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
	// 获取可用的编号
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
		})
	}
	// 用户编号长度最小为9位不足前面补零
	function pad2(num) {
		if ((num + "").length >= 9)
			return num;
		return pad2("0" + num, 9);
	}
})(window, jQuery);