$(document).ready(function () {
    init();
});

;(function (window, $) {
    window.init = _init;
    window.setRole = _setRole;

    var _config = {
        ajaxUrl: {
            getUserInfoByUserIdUrl: '../../../../../getUserInfoByUserId.do',
            alterOwnerUserInfoUrl: '../../../../../alterOwnerUserInfo.do',
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
        popupsName: 'addOwnerUser',
        form:null,
        role:{
            roleId:"",
            roleType:'',
            roleName:'',
            fMemo:''
        },
        userServerType:"",
    }

    function _init() {
        _initData();
        _initEvent();
        validate();
    }

    function _initData() {
        _getOwnerDropDown('center',_callback_getCenter);
        _getOwnerDropDown('business',_callback_getBusiness);
        if (parent.getTopPopupsName && typeof (parent.getTopPopupsName) == 'function') {
            _global.popupsName = parent.getTopPopupsName();
        }
        if (_global.popupsName == 'addOwnerUser') {

        } else if (_global.popupsName == 'alterOwnerUser') {
            _getUserInfo();
            _getRoleInfo();
        }
    }

    function _initEvent() {

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
            _showOwnerPojo(data.ownerPojo);
        }
    }

    function _showOwnerPojo(ownerPojo) {
        $("#userAccount").val(ownerPojo.userAccount);
        $("#userPwd").val(ownerPojo.userPwd);
        $("#createDate").val(ownerPojo.createDate);
        $("#userId").val(ownerPojo.userId);
        $("#userName").val(ownerPojo.userName);
        //$("#userType").val(ownerPojo.userType);
        $("#rdClass").val(getUsrAlmType(ownerPojo.usrAlmType));
        $("#userAddr").val(ownerPojo.userAddr);
        $("#pnlTel").val(ownerPojo.pnlTel);
        $("#userProperty").val(getuserProperty(ownerPojo.userProperty));
        $("#businessName").val(ownerPojo.businessName);
        $("#centerName").val(ownerPojo.centerName);
        $("#userServerType").val(ownerPojo.userServerTypeName);
        $("#payNO").val(ownerPojo.payNO);
        $("#contact").val(ownerPojo.contact);
        $("#contactPayNO").val(ownerPojo.contactPayNO);
        $("#cHmPhone").val(ownerPojo.cHmPhone);
        $("#cPhone").val(ownerPojo.cPhone);
        $("#cMobile").val(ownerPojo.cMobile);

        $("#nomRpt").val(getIsOrNo(ownerPojo.nomRpt));

        $("#engageTest").val(getIsOrNo(ownerPojo.engageTest));

        $("#nomTest").val(getIsOrNo(ownerPojo.nomTest));

        $("#isVideoCheck").val(getIsOrNo(ownerPojo.isVideoCheck));
        $("#pnlTel").val(ownerPojo.pnlTel);
        $("#areaName").val(ownerPojo.areaName);
        $("#areaName").data('areaId',ownerPojo.areaId);
        if(ownerPojo.isInsurance=="0"){
            $("#isInsurance").val("未投保");
        }else {
            $("#isInsurance").val("已投保");
        }

        $("#hasBak").val(getIsOrNo(ownerPojo.hasBak));

        if(ownerPojo.isPay=="0"){
            $("#isPay").val("未缴费");
        }else {
            $("#isPay").val("已缴费");
        }

        $("#usrAlmType").val(ownerPojo.usrAlmType);

        $("#uMem").val(ownerPojo.uMem);

        $("#operName").val(ownerPojo.operName);
        $("#operTime").val(ownerPojo.createDate);
        
        $("#define2").val(ownerPojo.define2);

        $("#badMem").val(ownerPojo.badMem);

        $("#road").val(ownerPojo.road);
        $("#define3").val(ownerPojo.define3);
        $("#define1").val(ownerPojo.define1);
        $("#define6").val(ownerPojo.define6);
        $("#fMemo").val(ownerPojo.fMemo);
        $("#pnlHdTel").val(ownerPojo.pnlHdTel);
        $("#define4").val(ownerPojo.define4);
        $("#instDate").val(ownerPojo.instDate);
        $("#liveDate").val(ownerPojo.liveDate);
        $("#pnlTelType").val(ownerPojo.pnlTelType);
        _global.role.roleId=ownerPojo.roleId;
    }

    function getUsrAlmType(usrAlmType){
        switch (usrAlmType) {
            case '0':
                return "一级";
                break;
            case '1':
                return "二级";
                break;
            case '2':
                return "三级";
                break;
            case '3':
                return "四级";
                break;
            case '4':
                return "五级";
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
        /*$div_row.bind('dblclick', function (e) {
            parent.parent.devicePopusManager('openRelatededitRole',row_json);
        });*/
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
       // post_async(params,_config.ajaxUrl.getOwnerDropDownUrl , _callback_getOwnerDropDown);
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
                if(_global.userServerType==dropDownPojo[i].key) {
                    $("#userServerType").val(dropDownPojo[i].value);
                }
            }
        } else {
            alert("请求失败！");
        }
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
                }
            },
        
    	});
    }
    function _setRole(role){
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
})(window, jQuery);