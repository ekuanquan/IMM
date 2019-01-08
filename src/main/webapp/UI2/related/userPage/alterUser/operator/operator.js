$(document).ready(function () {
    init();
});

;(function (window, $) {
    window.init = _init;
    window.setAreaName = _setAreaName;
    window.setRole = _setRole;
    var _config = {
        ajaxUrl: {
            getUserInfoByUserIdUrl: '../../../../../getOperatorInfoByUserId.do',
            alterOperatorInfoUrl: '../../../../../alterOperatorUserInfo.do',
            getRoleByUserIdUrl: '../../../../../getRoleByUserId.do',
            getOwnerDropDownUrl:'../../../../../DropDown/getOwnerDropDown.do'
        }
    };
    var _global = {
        top: parent.parent,
        plugins: {
            page: null
        },
        getUserInfoParams: {
            userPojo: {
                userId: ""
            }
        },
        popupsName: 'addOperator',
        form:null,
        role:{
            roleId:"",
            roleType:'',
            roleName:'',
            fMemo:''
        }
    }

    function _init() {
        _initData();
        _initEvent();
        validate();
    }

    function _initData() {
        _getOwnerDropDown('center',_callback_getCenter);
        _getOwnerDropDown('business',_callback_getBusiness);
        _getOwnerDropDown('userServerType',_callback_getUserServerType);
        if (parent.getTopPopupsName && typeof (parent.getTopPopupsName) == 'function') {
            _global.popupsName = parent.getTopPopupsName();
        }
        if (_global.popupsName == 'addOperator') {
        	var createTime = getNowFormatDate();
            $("#createDate").val(createTime);
        } 
        else if (_global.popupsName == 'alterSysOperator' || _global.popupsName == 'alterBusinessOperator') {
            _getUserInfo();
            _getRoleInfo();
            _alterEvent();
        }


    }

    function _initEvent() {
    	
        $("#title_add").bind("click", function () {
            _global.top.setUserType($("#userType").val());
            _global.top.rolePopusManage('roleManagement');
        });
        $("#title_select").bind("click", function () {

            _global.top.setUserType($("#userType").val());
            parent.PopusManage('selectRole');
        });
        $("#cancelButton").bind("click",function() {
        	_global.top.closePopus();
        });
        $("#confirmButton").bind('click', function () {
        	if(_global.form.form()){
        		_submitOwnerInfo();
        	};
           
        });
        $('#createDate').click(function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            this.blur();
        });
        $('#overDateTime').click(function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            this.blur();
        });
        $('#areaName').click(function () {
            parent.PopusManage('openArea');
        });
        var json = [
            {
                key: "123",
                value: "普通客户"
            },
            {
                key: "1234",
                value: "机主客户"
            },
            {
                key: "1234",
                value: "机主客户"
            },
            {
                key: "1234",
                value: "机主客户"
            },
            {
                key: "1234",
                value: "机主客户"
            }];
    }
    function _alterEvent() {
        $("#userAccount").css({
            "pointer-events": "none",
            "opacity": "0.5"
        });
        $("#userId").css({
            "pointer-events": "none",
            "opacity": "0.5"
        });
        $("#userType").css({
            "pointer-events": "none",
            "opacity": "0.5"
        });
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
        post_async(params, _config.ajaxUrl.getUserInfoByUserIdUrl, _callback_getUserInfo);
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
        $("#userName").val(operatorPojo.userName);
        $("#userType").val(operatorPojo.userType);
        $("#areaName").val(operatorPojo.areaName);
        $("#areaName").data('areaId', operatorPojo.areaId);
        $("#overDateTime").val(operatorPojo.overDateTime);
        $("#acctIP").val(operatorPojo.acctIP);
        $("#sex option[value='"+ operatorPojo.sex +"']").attr("selected",true);
        $("#cMobile").val(operatorPojo.telephone);
        $("#email").val(operatorPojo.email);
        $("#education option").each(function(i,n){
            if($(n).text()== operatorPojo.education)
            {
                $(n).attr("selected",true);
            }
        })
        $("#office option").each(function(i,n){
            if($(n).text()== operatorPojo.office)
            {
                $(n).attr("selected",true);
            }
        })
        $("#pwdNote").val(operatorPojo.userPWDhint);
        $("#centerName").val(operatorPojo.centerId);
        $("#acctDY").val(operatorPojo.acctDY);
        $("#fMemo").val(operatorPojo.fMemo);
        _global.role.roleId=operatorPojo.roleId;
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
	    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;

	    return currentdate;

	}  
    function _getRoleInfo() {
        var params = _getUserInfoParams();
        post_async(params, _config.ajaxUrl.getRoleByUserIdUrl, _callback_getRoleInfo);
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
            row_json.roleType = '操作员';
        }
        $div_row = $("<div></div>");
        $roleId = $("<div></div>");
        $roleType = $("<div></div>");
        $roleName = $("<div></div>");
        $fMemo = $("<div></div>");

        $div_row
            .append($roleId)
            .append($roleType)
            .append($roleName)
            .append($fMemo)
            .addClass('row');
        $roleId.addClass('table_item_4').text(row_json.roleId).attr("title", row_json.roleId);
        $roleType.addClass('table_item_4').text(row_json.roleType).attr("title", row_json.roleType);
        $roleName.addClass('table_item_4').text(row_json.roleName).attr("title", row_json.roleName);
        $fMemo.addClass('table_item_4').text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($("#table_content"));
        $div_row.bind('dblclick', function (e) {

        });
    }


    function _getSubmitOwnerInfoParams() {
        var params = {};
        params.operation = '';
        params.operatorPojo = {};
        if (_global.popupsName == 'addOperator') {
            params.operation = 'add';
        }else if (_global.popupsName == 'alterSysOperator') {
            params.operation = 'alter';
        }
        var operatorPojo = {};
        operatorPojo.userAccount = $("#userAccount").val();
        operatorPojo.createDate = $("#createDate").val();
        operatorPojo.userPwd = $("#userPwd").val();
        operatorPojo.userId = pad2($("#userId").val());
        operatorPojo.userType = $("#userType option:selected").val();
        operatorPojo.overDateTime = $("#overDateTime").val();//过期时间
        operatorPojo.sex = $("#sex option:selected").val();
        operatorPojo.email = $("#email").val();
        operatorPojo.office = $("#office option:selected").text();    //操作员职务
        operatorPojo.centerId = $("#centerName option:selected").val();
        operatorPojo.centerName = $("#centerName option:selected").text();
        operatorPojo.fMemo = $("#fMemo").val();
        operatorPojo.userName = $("#userName").val();
        operatorPojo.areaId = $("#areaName").data('areaId');
        operatorPojo.areaName = $("#areaName").val();
        operatorPojo.acctIP = $("#acctIP").val();
        operatorPojo.telephone = $("#cMobile").val();
        operatorPojo.education = $("#education option:selected").text(); //操作员学历
        operatorPojo.userPWDhint = $("#pwdNote").val();
        operatorPojo.acctDY = $("#acctDY option:selected").val();
        operatorPojo.roleId = _global.role.roleId;
        params.operatorPojo = operatorPojo;
        return params;
    }

    function _submitOwnerInfo() {
        var params = _getSubmitOwnerInfoParams();
        post_async(params, _config.ajaxUrl.alterOperatorInfoUrl, _callback_submitOwnerInfo);
    }

    function _callback_submitOwnerInfo(data) {
        var result = data.result;
        if (result.code == '0') {
            alert("提交成功");
        } else {
            alert("提交失败");
        }
    }
    
    function _getOwnerDropDownParams(dropDownName) {
        var params = {}
        params.DropDownName=dropDownName;
        return params;
    }
    function _getOwnerDropDown(dropDownName,_callback_getOwnerDropDown) {
        var params = _getOwnerDropDownParams(dropDownName);
        var data = post_sync(params,_config.ajaxUrl.getOwnerDropDownUrl);
        _callback_getOwnerDropDown(data);
       // post_async(params, _config.ajaxUrl.getOwnerDropDownUrl, _callback_getOwnerDropDown);
    }
    function _callback_getCenter(data) {
        var result = data.result;
        if (result.code == '0') {
            var dropDownPojo = data.dropDownPojo;
            for (var i = 0;i<dropDownPojo.length;i++){
                var $option = $("<option></option>");
                $option.attr('value',dropDownPojo[i].key);
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
            for (var i = 0;i<dropDownPojo.length;i++){
                var $option = $("<option></option>");
                $option.attr('value',dropDownPojo[i].key);
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
            for (var i = 0;i<dropDownPojo.length;i++){
                var $option = $("<option></option>");
                $option.attr('value',dropDownPojo[i].key);
                $option.text(dropDownPojo[i].value);
                $option.appendTo($("#userServerType"));
            }
        } else {
            alert("请求失败！");
        }
    }
    function _setAreaName(area) {
        $("#areaName").val(area.name);
        var areaId = area.id;
        $("#areaName").data('areaId', areaId);
    }
    function validate(){
    	validate1();
    }
    function validate1(){
    	var $form = $("#form");
    	_global.form = $form.validate({

            rules: {
            	userAccount: {
                    required: true,
                },
                userPwd: {
                    required: true,
                },
                userId: {
                    required: true,
                },
                userName: {
                    required: true,
                },
                areaName: {
                	required: true,
                },
                instDate: {
                	required: true,
                },
                overDateTime: {
                	required: true,
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

        $(".row").each(function () {

            var $this = $(this);
            setTimeout(function () {

                $this.remove();
            }, i * 1);
            i++;
        });
    }
    //用户编号长度最小为9位不足前面补零
    function pad2(num) {
        if ((num + "").length >= 9) return num;
        return pad2("0" + num, 9);
    }
})(window, jQuery);