$(document).ready(function () {
    init();
});

;(function (window, $) {
    window.init = _init;
    window.setAreaName = _setAreaName;
    window.setRole = _setRole;
    window.isEmpty = isEmpty;
    window.setAreaName =_setAreaName;

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
        createDate:""      //创建时间
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
        _getUserInfo();

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
        if(rowJson.userId&&rowJson.userId !=null&&rowJson.userId !=""){
            _global.getUserInfoParams.userPojo.userId = rowJson.userId;
        }else {
            _global.getUserInfoParams.userPojo.userId = rowJson.ownerId;
        }
        //_global.getUserInfoParams.userPojo.userId = rowJson.userId;
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
       // ownerPojo = _exchangeText(ownerPojo);
        $("#userAccount").val(ownerPojo.userAccount);
        $("#userPwd").val(ownerPojo.userPwd);
        $("#createDate").val(ownerPojo.createDate);
        $("#userId").val(ownerPojo.userId);
        $("#userName").val(ownerPojo.userName);
        $("#userType").val(ownerPojo.userType);
        $("#userAddr").val(ownerPojo.userAddr);
        $("#pnlTel").val(ownerPojo.pnlTel);
        $("#userProperty").val(ownerPojo.userProperty);
        //$("#businessId").val(ownerPojo.businessId);
        $("#businessName").val(ownerPojo.businessId);
        //$("#centerId").val(ownerPojo.centerId);
        $("#centerName").val(ownerPojo.centerId);
        $("#userServerType").val(ownerPojo.userServerType);

        $("#payNO").val(ownerPojo.payNO);
        $("#contact").val(ownerPojo.contact);
        $("#contactPayNO").val(ownerPojo.contactPayNO);
        $("#cHmPhone").val(ownerPojo.cHmPhone);
        $("#cPhone").val(ownerPojo.cPhone);
        $("#cMobile").val(ownerPojo.cMobile);
        $("#nomRpt").val(ownerPojo.nomRpt);
        $("#engageTest").val(ownerPojo.engageTest);
        $("#nomTest").val(ownerPojo.nomTest);
        $("#isVideoCheck").val(ownerPojo.isVideoCheck);
        //$("#areaId").val(ownerPojo.areaId);
        $("#areaName").val(ownerPojo.areaName).data('areaId',ownerPojo.areaId);
        $("#isInsurance").val(ownerPojo.isInsurance);
        $("#hasBak").val(ownerPojo.hasBak);
        $("#isPay").val(ownerPojo.isPay);
        $("#usrAlmType").val(ownerPojo.usrAlmType);
        $("#uMem").val(ownerPojo.uMem);
        $("#operName").val(ownerPojo.operName);
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
        $('#platformId').val(ownerPojo.platformName);
        var serveEndTime = ownerPojo.serveEndTime;
        if(serveEndTime == -1)serveEndTime = "";
        $("#serveEndTime").val(serveEndTime);

        var switchUser = ownerPojo.switchUser?"true":"false";
        $("#switchUser").val(switchUser);
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
            parent.parent.devicePopusManager('openRelatededitRole',row_json);
        });
    }


    function _getSubmitOwnerInfoParams() {
        var params = {};
        params.operation = '';
        params.ownerPojo = {};
        var ownerPojo = {};
        if (_global.popupsName == 'addOwnerUser') {
            params.operation = 'add';
            ownerPojo.userId = pad2($("#userId").val());
        } else if (_global.popupsName == 'alterOwnerUser') {
            params.operation = 'alter';
            ownerPojo.userId = $("#userId").val();
        }

        //获取关联设备数据
        ownerPojo.devIds = parent.associatedDeviceIframe.setdevInfo();
        ownerPojo.userAccount = $("#userAccount").val();
        ownerPojo.userPwd = $("#userPwd").val();
        ownerPojo.createDate = $("#createDate").val();

        ownerPojo.userName = $("#userName").val();
        ownerPojo.userType = "1";
        ownerPojo.userAddr = $("#userAddr").val();
        ownerPojo.userProperty = $("#userProperty").val();
        ownerPojo.businessId = $("#businessName").val();
       // ownerPojo.businessName = $("#businessName").text();
        ownerPojo.centerId = $("#centerName").val();
        //ownerPojo.centerName = $("#centerName").val();
        ownerPojo.userServerType = $("#userServerType").val();
        ownerPojo.payNO = $("#payNO").val();
        ownerPojo.contact = $("#contact").val();
        ownerPojo.contactPayNO = $("#contactPayNO").val();
        ownerPojo.cHmPhone = $("#cHmPhone").val();
        ownerPojo.cPhone = $("#cPhone").val();
        ownerPojo.cMobile = $("#cMobile").val();
        ownerPojo.nomRpt = $("#nomRpt").val();
        ownerPojo.engageTest = $("#engageTest").val();
        ownerPojo.nomTest = $("#nomTest").val();
        ownerPojo.isVideoCheck = $("#isVideoCheck").val();
        ownerPojo.areaId = $("#areaName").data('areaId');
       // ownerPojo.areaName = $("#areaName").val();
        ownerPojo.isInsurance = $("#isInsurance").val();
        ownerPojo.hasBak = $("#hasBak").val();
        ownerPojo.isPay = $("#isPay").val();
        ownerPojo.usrAlmType = $("#usrAlmType").val();
        ownerPojo.uMem = $("#uMem").val();
        ownerPojo.operName = $("#operName").val();
        ownerPojo.define2 = $("#define2").val();
        ownerPojo.badMem = $("#badMem").val();
        ownerPojo.road = $("#road").val();
        ownerPojo.define3 = $("#define3").val();
        ownerPojo.define1 = $("#define1").val();
        ownerPojo.define6 = $("#define6").val();
        ownerPojo.fMemo = $("#fMemo").val();
        ownerPojo.pnlHdTel = $("#pnlHdTel").val();
        ownerPojo.define4 = $("#define4").val();
        ownerPojo.instDate = $("#instDate").val();
        ownerPojo.liveDate = $("#liveDate").val();
        ownerPojo.pnlTelType = $("#pnlTelType").val();
        ownerPojo.pnlTel = $("#pnlTel").val();  //联网电话
        //ownerPojo.roleId = _global.role.roleId;
        params.ownerPojo = ownerPojo;
        return params;
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
            _global.top.alertTip("请求失败",0,null);
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
            _global.top.alertTip("请求失败",0,null);
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
            //alert("请求失败！");
            _global.top.alertTip("请求失败",0,null);
        }
    }
    function _setAreaName(area) {
        $("#areaName").val(area.name);
        var areaId = area.id;
        $("#areaName").data('areaId', areaId);
        console.log(area.name+":"+area.id);
        $("#areaName").blur();
    }
    function validate(){
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
    function isEmpty(field,type){
        var textValue = $("#"+field).val();
        if(textValue != ""){
            if( type== "1" ){
                    post_async(
                        {
                            "validateName":"userAccount",
                            "validateValue":textValue
                        },
                        "../../../../../validate/isCanUse.do",
                        validate_callback,field);
            }
            if( type=="2" ){
                    post_async(
                        {
                            "validateName":"userId",
                            "validateValue":textValue
                        },
                        "../../../../../validate/isCanUse.do",
                        validate_callback,field);
                }
        }
        else{

        }
    }
    function validate_callback(data,field){
        if(data.result.code == 0){

        }else{
            if(field == "userAccount"){
                //alert("该用户账号已经存在。");
                _global.top.alertSuccess("该用户账号已经存在",2000,null);
            }
            if(field == "userId"){
                //alert("该用户编号已经存在。");
                _global.top.alertFail("该用户编号已经存在",2000,null);
            }
        }
    }
    //用户编号长度最小为9位不足前面补零
    function pad2(num) {
        if ((num + "").length >= 9) return num;
        return pad2("0" + num, 9);
    }
})(window, jQuery);