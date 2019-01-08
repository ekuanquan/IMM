$(document).ready(function () {
    init();
});

;(function (window, $) {
    window.init = _init;
    window.setRole = _setRole;
    var _config = {
        ajaxUrl: {
            getUserInfoByUserIdUrl: '../../../../../getGeneralUserInfoByUserId.do',
            getOwnerDropDownUrl: '../../../../../DropDown/getOwnerDropDown.do',
            alterOwnerUserInfoUrl: '../../../../../alterGeneralUserInfo.do',
            getRoleByUserIdUrl: '../../../../../getRoleByUserId.do'
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
        popupsName: 'addGeneralUser',
        role: {
            roleId: "",
            roleType: '',
            roleName: '',
            fMemo: ''
        },
        businessId:"",
        userServerTypeName:"",
    }

    function _init() {
        _initData();
        _initEvent();
    }

    function _initData() {
        if (parent.getTopPopupsName && typeof (parent.getTopPopupsName) == 'function') {
            _global.popupsName = parent.getTopPopupsName();
        }
        if (_global.popupsName == 'addGeneralUser') {
            var createTime = getNowFormatDate();
            $("#createDate").val(createTime);
        }
        if (_global.popupsName == 'alterGeneralUser') {
            _getUserInfo();
            _getRoleInfo();
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
        $("#cancelButton").bind("click", function () {
            _global.top.closePopus();
        });
        $('#createDate').click(function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            this.blur();
        });
        $('#areaName').click(function () {
            parent.PopusManage('openArea');
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
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;

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
        post_async(params, _config.ajaxUrl.getUserInfoByUserIdUrl, _callback_getUserInfo);
    }

    function _callback_getUserInfo(data) {
        var result = data.result;
        if (result.code == '0') {
            _showOwnerPojo(data.generalUserPojo);
        }
    }

    function _showOwnerPojo(generalUserPojo) {
        $("#userAccount").val(generalUserPojo.userAccount);
        $("#userPwd").val(generalUserPojo.userPwd);
        $("#createDate").val(generalUserPojo.createDate);
        $("#userId").val(generalUserPojo.userId);
        $("#userName").val(generalUserPojo.userName);
        $("#userAddr").val(generalUserPojo.userAddr);
        $("#userProperty").val(getuserProperty(generalUserPojo.userProperty));
        _global.businessId=generalUserPojo.businessId;
        _getOwnerDropDown('business', _callback_getBusiness);
        $("#centerName").val(generalUserPojo.centerName);
        $("#payNO").val(generalUserPojo.payNO);
        _global.userServerTypeName=generalUserPojo.userServerType;
        _getOwnerDropDown('userServerType', _callback_getUserServerType);
        //$("#userServerType").val(generalUserPojo.userServerTypeName);
        $("#contact").val(generalUserPojo.contact);
        $("#contactPayNO").val(generalUserPojo.contactPayNO);
        $("#cHmPhone").val(generalUserPojo.cHmPhone);
        $("#cPhone").val(generalUserPojo.cPhone);
        $("#cMobile").val(generalUserPojo.cMobile);
        $("#areaName").val(generalUserPojo.areaName);
        $("#areaName").data('areaId', generalUserPojo.areaId);

        if(generalUserPojo.isPay=="0"){
            $("#isPay").val("未缴费");
        }else {
            $("#isPay").val("已缴费");
        }
        $("#isVideoCheck").val(getIsOrNo(generalUserPojo.isVideoCheck));
        _global.role.roleId=generalUserPojo.roleId;
        $("#operName").val(generalUserPojo.operName);
        $("#operTime").val(generalUserPojo.createDate);
    }

    function getuserProperty(io) {
        switch (io) {
            case '0':
                return "未注册";
                break;
            case '1':
                return "已注册";
                break;
            default:
                break;
        }
    }
    function getIsOrNo(io) {
        switch (io) {
            case '0':
                return "否";
                break;
            case '1':
                return "是";
                break;
            default:
                break;
        }
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

    function _getOwnerDropDown(dropDownName, _callback_getOwnerDropDown) {
        var params = _getOwnerDropDownParams(dropDownName);
        var data = post_sync(params,_config.ajaxUrl.getOwnerDropDownUrl);
        _callback_getOwnerDropDown(data);
        //post_async(params, _config.ajaxUrl.getOwnerDropDownUrl, _callback_getOwnerDropDown);
    }

    function _getOwnerDropDownParams(dropDownName) {
        var params = {}
        params.DropDownName = dropDownName;
        return params;
    }
    function _callback_getBusiness(data) {
        var result = data.result;
        if (result.code == '0') {
            var dropDownPojo = data.dropDownPojo;
            for (var i = 0; i < dropDownPojo.length; i++) {
                if(_global.businessId==dropDownPojo[i].key){
                    $("#businessName").val(dropDownPojo[i].value);
                }
            }
        } else {
            //alert("请求失败！");
            _global.top.alertTip("请求失败！",0,null);
        }
    }
    function _callback_getUserServerType(data) {
        var result = data.result;
        if (result.code == '0') {
            var dropDownPojo = data.dropDownPojo;
            for (var i = 0; i < dropDownPojo.length; i++) {
                if(_global.userServerTypeName==dropDownPojo[i].key){
                    $("#userServerType").val(dropDownPojo[i].value);
                }
            }
        } else {
            _global.top.alertTip("请求失败！",0,null);
        }
    }
})(window, jQuery);