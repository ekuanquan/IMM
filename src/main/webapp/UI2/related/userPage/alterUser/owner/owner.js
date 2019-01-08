$(document).ready(function () {
    init();
});

;(function (window, $) {
    window.init = _init;
    window.setAreaName = _setAreaName;
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
        _getUserInfo();
        if (parent.getTopPopupsName && typeof (parent.getTopPopupsName) == 'function') {
            _global.popupsName = parent.getTopPopupsName();
        }
        if (_global.popupsName == 'addOwnerUser') {


        } else if (_global.popupsName == 'alterOwnerUser') {
            _getUserInfo();
            _getRoleInfo();
            _alterEvent();
        }



    }

    function _initEvent() {
    	
        /*$("#title_add").bind("click", function () {
            _global.top.setUserType($("#userType").val());
            _global.top.rolePopusManage('roleManagement');
        });
        $("#cancelButton").bind("click",function() {
        	_global.top.closePopus();
        });
        $("#confirmButton").bind('click', function () {
        	if(_global.form.form()){
        		_submitOwnerInfo();
        	};
           
        });*/
       /* $('#createDate').click(function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            this.blur();
        });
        $('#define3').click(function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd HH:mm:ss',
                isShowClear: false
            });
            this.blur();
        });
        $('#define2').click(function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd HH:mm:ss',
                isShowClear: false
            });
            this.blur();
        });*/
        /*$('#areaName').click(function () {
            parent.PopusManage('openArea');
        });*/
        /*$('#instDate').click(function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            this.blur();
        });
        $('#liveDate').click(function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            this.blur();
        });*/



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
    }

    function _getUserInfoParams() {
        var params = {};
        params.userPojo = {};
        params.userPojo = _global.getUserInfoParams.userPojo;
        return params;
    }

    function _getUserInfo() {
        /*var rowJson = parent.parent.getPopupsRowJson();
        _global.getUserInfoParams.userPojo.userId = rowJson.userId;
        var params = _getUserInfoParams();*/
        var rowJson =parent.parent.getRelatedUserId();
        _global.getUserInfoParams.userPojo.userId = rowJson;
        var params = _getUserInfoParams();
        post_async(params, _config.ajaxUrl.getUserInfoByUserIdUrl, _callback_getUserInfo);

        _getRoleInfo();         //加载角色信息
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
        $("#define4").val(ownerPojo.define4);
        $("#instDate").val(ownerPojo.instDate);
        $("#liveDate").val(ownerPojo.liveDate);
        $("#pnlTelType").val(ownerPojo.pnlTelType);
        _global.role.roleId=ownerPojo.roleId;
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
        if (_global.popupsName == 'addOwnerUser') {
            params.operation = 'add';

        } else if (_global.popupsName == 'alterOwnerUser') {
            params.operation = 'alter';
        }

        var ownerPojo = {};
        ownerPojo.userAccount = $("#userAccount").val();
        ownerPojo.userPwd = $("#userPwd").val();
        ownerPojo.createDate = $("#createDate").val();
        ownerPojo.userId = pad2($("#userId").val());
        ownerPojo.userName = $("#userName").val();
        ownerPojo.userType = $("#userType").val();
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
        ownerPojo.define4 = $("#define4").val();
        ownerPojo.instDate = $("#instDate").val();
        ownerPojo.liveDate = $("#liveDate").val();
        ownerPojo.pnlTelType = $("#pnlTelType").val();
        ownerPojo.roleId = _global.role.roleId;
        params.ownerPojo = ownerPojo;
        return params;
    }

    function _submitOwnerInfo() {
        var params = _getSubmitOwnerInfoParams();
        //alert(JSON.stringify(params));
        console.log("params: "+JSON.stringify(params));
        post_async(params, _config.ajaxUrl.alterOwnerUserInfoUrl, _callback_submitOwnerInfo);
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
    //用户编号长度最小为9位不足前面补零
    function pad2(num) {
        if ((num + "").length >= 9) return num;
        return pad2("0" + num, 9);
    }
})(window, jQuery);