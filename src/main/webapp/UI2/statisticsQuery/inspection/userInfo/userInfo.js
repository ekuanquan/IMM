/**
 * Created by ywhl on 2017/6/7.
 */

var rowData = parent.parent.getPopupsRowJson();
var userId = rowData.userId;
$(document).ready(function() {
    selectinit();
});
;(function(window,$){
    window.selectinit = _init;
    var _global = {
        top: parent
    };
    function _init(){
        _initData();
	_initEvent()
        $("#tab_specific").click();
        userInfo_callback(rowData);
        get_formId(rowData.inspectionFormId);    }

function _initEvent() {
        $(".tab_item").bind('click', function (event) {
            $(this).removeClass('tab_noChecked').addClass('tab_ischecked');
            $(this).siblings().removeClass('tab_ischecked').addClass('tab_noChecked');
            var data = $(this).data('show');
            $(data).show().siblings().hide();
        });

        $("#owner_tab").siblings().show();
        $("#owner_tab").click();

        $("#picCheck").click(function () {
            _global.top.popusStaManager("picCheck");
        });
    }
    function _initData() {
        post_async(
            {"userId": userId},
            "/IntegratedMM/query/getUserData.do",
            basicInformation_callback);
	post_async(
            {"userId":userId},
            "/IntegratedMM/query/getRelevantContact.do",
            createContactRow);
    }

    function createContactRow(data){
        var relevantContact = data.relevantContact;
        for(var i = 0; i < relevantContact.length; i++){
            var $div_row = $('<div></div>');
            var $div_peoId = $('<div></div>');
            var $div_peoName = $('<div></div>');
            var $div_telephone1 = $('<div></div>');
            var $div_telephone2 = $('<div></div>');
            var $div_familyPhone = $('<div></div>');
            var $div_mobilePhone = $('<div></div>');
            var $div_remarks = $('<div></div>');
            $div_row.append($div_peoId)
                .append($div_peoName)
                .append($div_telephone1)
                .append($div_telephone2)
                .append($div_familyPhone)
                .append($div_mobilePhone)
                .append($div_remarks)
                .addClass('Row');
            $div_peoId.addClass('peoId').text(relevantContact[i].contId).attr('title', relevantContact[i].contId);
            $div_peoName.addClass('peoName').text(relevantContact[i].cName).attr('title', relevantContact[i].cName);
            $div_telephone1.addClass('telephone1').text(relevantContact[i].cphone1).attr('title', relevantContact[i].cphone1);
            $div_telephone2.addClass('telephone2').text(relevantContact[i].cphone2).attr('title', relevantContact[i].cphone2);
            $div_familyPhone.addClass('familyPhone').text(relevantContact[i].hmPhone).attr('title', relevantContact[i].hmPhone);
            $div_mobilePhone.addClass('mobilePhone').text(relevantContact[i].hdPhone).attr('title', relevantContact[i].hdPhone);
            $div_remarks.addClass('remarks').text(relevantContact[i].fMemo).attr('title', relevantContact[i].fMemo);
            $div_row.appendTo('#contact_content');
        }
    }
    function basicInformation_callback(data) {
        var result = data.result;
        if(result.code == "200"){
            showBasicInformation(data.userInformation);
        }
        $("#tab_specific").click();
    }

    function showBasicInformation(userInformation) {
		var isPay = userInformation.isPay;
		var isVideoCheck = userInformation.isVideoCheck;
		var engageTest = userInformation.engageTest;
		var nomRpt = userInformation.nomRpt;
		if(isPay !=null){
			isPay = ((isPay == 0)?"否":"是");
		}
		else{
			isPay = "";
		}
		if(isVideoCheck !=null){
			isVideoCheck = ((isVideoCheck == 0)?"否":"是");
		}
		else{
			isVideoCheck = "";
		}
		if(engageTest !=null){
			engageTest = ((engageTest == 0)?"否":"是");
		}
		else{
			engageTest = "";
		}
		if(nomRpt !=null){
			nomRpt = ((nomRpt == 0)?"否":"是");
		}
		else{
			nomRpt = "";
		}
		
        $("#userId").val(userInformation.userId);//用户编号
        $("#contact").val(userInformation.contact);//单位负责人
        $("#cMobile").val(userInformation.cMobile);//负责人手机

        $("#userName").val(userInformation.userName);//用户名称
        $("#rdClass").val(getUsrAlmType(userInformation.usrAlmType));//用户级别
        $("#PayNO").val(userInformation.payNO);//口令

        $("#userAddr").val(userInformation.userAddr);//用户地址
        $("#userType").val(userTypeTranse(userInformation.userType));//用户类型
        $("#businessName").val(userInformation.businessName);//用户行业

        $("#areaName").val(userInformation.areaName);//所属区域
        $("#serverType").val(userInformation.userServerTypeName);//服务类型
        //$("#business_subName").val(userInformation.business_subName);//子行业
        $("#business_subName").val(userInformation.define1);//子行业

        $("#centerName").val(userInformation.centerName);//所属分中心
        $("#isPay").val(isPay);//缴费状态*
        $("#createDate").val(userInformation.createDate);//录入时间

        $("#cPhone").val(userInformation.cPhone);//负责人电话
        $("#isVideoCheck").val(isVideoCheck);//短信转发*
        $("#operName").val(userInformation.operName);//录入人

        $("#pnlTel").val(userInformation.pnlTel);//联网电话
        $("#instDate").val(userInformation.instDate);//安装日期
        $("#engageTest").val(engageTest);//定期测试用户*

        $("#pnlHdTel").val(userInformation.pnlHdTel);//无线卡号
        $("#nomRpt").val(nomRpt);//定期撤布防用户*
        $("#fMemo").val(userInformation.fMemo);//备注
        $("#road").val(userInformation.road);//备注
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

    function userTypeTranse(userTypeId){
        switch (userTypeId) {
            case 0:
                return "一般客户";
                break;
            case 1:
                return "机主";
                break;
            case 2:
                return "系统操作员";
                break;
            case 3:
                return "业务操作员";
                break;
            default:
                break;
        }
    }

    function userInfo_callback(){
        $("#createTime").val(rowData.createTime.substring(0,19));
        $("#acceptAlarmer").val(rowData.acceptAlarmer);
        $("#inspectionType").val(rowData.inspectionType);
        $("#inspectionUnit").val(rowData.inspectionUnit);
        $("#inspectioner").val(rowData.inspectioner);
        $("#inspectionDate").val(rowData.inspectionDate.substring(0,19));
        $("#inspectionResult").val(rowData.inspectionResult);
        $("#remarks").val(rowData.notes);
    }
    function get_formId(data) {
        _global.top._setTitle("巡检单：" + data);
    }

})(window,jQuery);