$(document).ready(function () {
    $(".registerform").Validform({
        tiptype:2,
        btnSubmitId:"confirmButton",
        callback:sure
    });
    init();
});

;(function (window, $) {
    window.init = _init;
    window.setAreaName = _setAreaName;
    window.setRole = _setRole;
    window.sure = _sure;
    window.isEmpty = isEmpty;
    window.setAreaName =_setAreaName;

    var _config = {
        ajaxUrl: {
            getUserInfoByUserIdUrl: '/IntegratedMM/getUserInfoByUserId.do',
            alterOwnerUserInfoUrl: '/IntegratedMM/alterOwnerUserInfo.do',
            getRoleByUserIdUrl: '/IntegratedMM/getRoleByUserId.do',
            getOwnerDropDownUrl:'/IntegratedMM/DropDown/getOwnerDropDown.do'
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
        if (parent.getTopPopupsName && typeof (parent.getTopPopupsName) == 'function') {
            _global.popupsName = parent.getTopPopupsName();
        }
        if (_global.popupsName == 'addOwnerUser') {
            _addEvent();
            //默认录入时间为当前时间
            var nowTime = getNowFormatDate();
            nowTime =nowTime.split(" ")[0];
            $('#inputtime').val(nowTime);
            //默认录入人为当前操作员
            var returnData = _global.top.getLoginUserName();
            $('#operName').val(returnData.sysuserID);
            //默认安装日期为当前时间
            $('#instDate').val(nowTime);
            //默认创建时间为当前时间
            $('#createDate').val(nowTime);
            _global.createDate = nowTime;

        } else if (_global.popupsName == 'alterOwnerUser') {
            _getUserInfo();
            //_getRoleInfo();
            _alterEvent();
        }

    }
    function _initEvent() {
    	
        $("#title_add").bind("click", function () {
            _global.top.setUserType($("#userType").val());
            _global.top.setUserId($("#userAccount").val());
            _global.top.rolePopusManage('roleManagement');
        });
        $("#cancelButton").bind("click",function() {
        	_global.top.closePopus();
        });
        $('#createDate').click(function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            //this.blur();
        });
        $('#define3').click(function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd HH:mm:ss',
                isShowClear: false
            });
            //this.blur();
        });
        $('#define2').click(function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd HH:mm:ss',
                isShowClear: false
            });
            //this.blur();
        });
        $('#areaName').click(function () {

            if (_global.popupsName == 'addOwnerUser') {
                parent.open_openArea();
            } else if (_global.popupsName == 'alterOwnerUser') {
               parent.open_openAreaalert();
            }
        });
        $('#instDate').click(function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            //this.blur();
        });
        $('#liveDate').click(function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            //this.blur();
        });
        $('#inputtime').click(function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            //this.blur();
        });
        $('#userAccount').blur(function () {
            $("#userId").val($('#userAccount').val());
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
        /*$("#centerName").bind('focus',function () {
            _getOwnerDropDown('center',_callback_getCenter);
        });*/

    }

    function _sure(flag){
        if(flag){
            _submitOwnerInfo();
        }else{
            //alert("验证不通过");
            _global.top.alertWarn("请填写完整信息",2000,null);
        }
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
        $("#userServerType").css({
            "pointer-events": "none",
            "opacity": "0.5"
        });
        $("#createDate").css({
            "pointer-events": "none",
            "opacity": "0.5"
        });
    }
    function _addEvent() {
        $("#operName").css({
            "pointer-events": "none",
            "opacity": "0.5"
        });
        $("#createDate").css({
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
        $("#areaName").val(ownerPojo.areaName);
        $("#areaName").data('areaId',ownerPojo.areaId);
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
        //_global.role.roleId=ownerPojo.roleId;
    }

    function _exchangeText(ownerPojo) {
/*

        if (ownerPojo.userType == '0') {
            ownerPojo.userType = '一般客户';
        } else if (ownerPojo.userType == '1') {
            ownerPojo.userType = '机主客户';
        } else if (ownerPojo.userType == '2') {
            ownerPojo.userType = '操作员';
        }
*/


        if (ownerPojo.nomRpt == '0') {
            ownerPojo.nomRpt = '否';
        } else if (ownerPojo.nomRpt == '1') {
            ownerPojo.nomRpt = '是';
        }
        if (ownerPojo.engageTest == '0') {
            ownerPojo.engageTest = '否';
        } else if (ownerPojo.engageTest == '1') {
            ownerPojo.engageTest = '是';
        }
        if (ownerPojo.nomTest == '0') {
            ownerPojo.nomTest = '否';
        } else if (ownerPojo.nomTest == '1') {
            ownerPojo.nomTest = '是';
        }
        if (ownerPojo.isVideoCheck == '0') {
            ownerPojo.isVideoCheck = '否';
        } else if (ownerPojo.isVideoCheck == '1') {
            ownerPojo.isVideoCheck = '是';
        }
        if (ownerPojo.isInsurance == '0') {
            ownerPojo.isInsurance = '未投保';
        } else if (ownerPojo.isInsurance == '1') {
            ownerPojo.isInsurance = '已投保';
        }
        if (ownerPojo.hasBak == '0') {
            ownerPojo.hasBak = '否';
        } else if (ownerPojo.hasBak == '1') {
            ownerPojo.hasBak = '是';
        }
        if (ownerPojo.isPay == '0') {
            ownerPojo.isPay = '未缴费';
        } else if (ownerPojo.isPay == '1') {
            ownerPojo.isPay = '未缴费';
        }
        return ownerPojo;
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

    function _submitOwnerInfo() {
        if (_global.popupsName == 'addOwnerUser') {
            callbackdelsuc();
        } else if (_global.popupsName == 'alterOwnerUser') {
            _global.top.comfireFloat("确定修改此用户信息？",callbackdelsuc,null);
        }
    }
    function callbackdelsuc() {
        var params = _getSubmitOwnerInfoParams();
        //alert(JSON.stringify(params));
        console.log("params: "+JSON.stringify(params));
        post_async(params, _config.ajaxUrl.alterOwnerUserInfoUrl, _callback_submitOwnerInfo);
    }

    function _callback_submitOwnerInfo(data) {
        var result = data.result;

        if (result.code == '0') {
            //alert("提交成功");
            _global.top.alertTip("保存成功",0,null);
            _global.top.RefreshhostClientIframe();
            _global.top.closePopus();

        } else {
            //alert("提交失败");
            if (result.code == '1') {
                //alert("提交成功");
                _global.top.alertTip("保存失败",0,null);
            }
            else if (result.code == '2') {
                //alert("提交成功");
                _global.top.alertTip("该用户已存在",0,null);
            }
            //_global.top.alertTip("保存失败",0,null);
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
            //alert("请求失败！");
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
            //alert("请求失败！");
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
    	//validate1();
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
    /*function _appendSelect() {
        for (var i = 0;i<dropDownPojo.length;i++){
            var $option = $("<option></option>");
            $option.attr('value',dropDownPojo[i].key);
            $option.text(dropDownPojo[i].value);
            $option.appendTo($("#centerName"));
        }

    }*/
    /*function _setAreaName(area) {
        $("#areaName").val(area.name);
        var areaId = area.id;
        $("#areaName").data('areaId', areaId);
    }*/
    
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
                //$("#"+field).focus();
            }
            if(field == "userId"){
                //alert("该用户编号已经存在。");
                _global.top.alertFail("该用户编号已经存在",2000,null);
                //$("#"+field).focus();
            }
        }
    }
    //用户编号长度最小为9位不足前面补零
    function pad2(num) {
        if ((num + "").length >= 9) return num;
        return pad2("0" + num, 9);
    }
})(window, jQuery);