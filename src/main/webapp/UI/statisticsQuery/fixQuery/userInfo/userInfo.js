/**
 * Created by ywhl on 2017/6/7.
 */

var rowData = parent.parent.getPopupsRowJson();
var accountNum = rowData.accountNum;
$(document).ready(function() {
    selectinit();
});
;(function(window,$){
    window.selectinit = _init;
    var _global = {
        top: parent
    };
    function _init(){
        _initEvent();
        _initData();
        userInfo_callback(rowData);
        get_formId(rowData.maintainNum);
        post_async(
            {"userId": accountNum},
            "/IntegratedMM/query/getUserData.do",
            basicInformation_callback);

    }

    function _initEvent() {
        $(".tab_item").bind('click', function (event) {
            $(this).removeClass('tab_noChecked').addClass('tab_ischecked');
            $(this).siblings().removeClass('tab_ischecked').addClass('tab_noChecked');
            var data = $(this).data('show');
            $(data).show().siblings().hide();
        });

        $("#owner_tab").siblings().show();
        $("#owner_tab").click();
    }

    function _initData() {
        $("#associatedDevice_tab").one('click', function (event) {
                post_async(
                    {"userId":accountNum},
                    "/IntegratedMM/query/getRelevantContact.do",
                    createContactRow);
        });
    }

    function basicInformation_callback(data) {
        var result = data.result;
        if(result.code == "200"){
            showBasicInformation(data.userInformation);
        }
        $("#tab_specific").click();

    }


    function createContactRow(data){
        var relevantContact = data.relevantContact;
        for(var i = 0; i < relevantContact.length; i++){
            var $div_row = $('<tr></tr>');
            var $div_peoId = $('<td></td>');
            var $div_peoName = $('<td></td>');
            var $div_telephone1 = $('<td></td>');
            var $div_telephone2 = $('<td></td>');
            var $div_familyPhone = $('<td></td>');
            var $div_mobilePhone = $('<td></td>');
            var $contPwd = $('<td></td>');
            var $div_remarks = $('<td></td>');
            $div_row.append($div_peoId)
                .append($div_peoName)
                .append($div_telephone1)
                .append($div_telephone2)
                .append($div_familyPhone)
                .append($div_mobilePhone)
                .append($contPwd)
                .append($div_remarks)
                .addClass('Row');
            $div_peoId.addClass('peoId').text(relevantContact[i].contId).attr('title', relevantContact[i].contId);
            $div_peoName.addClass('peoName').text(relevantContact[i].cName).attr('title', relevantContact[i].cName);
            $div_telephone1.addClass('telephone1').text(relevantContact[i].cphone1).attr('title', relevantContact[i].cphone1);
            $div_telephone2.addClass('telephone2').text(relevantContact[i].cphone2).attr('title', relevantContact[i].cphone2);
            $div_familyPhone.addClass('familyPhone').text(relevantContact[i].hmPhone).attr('title', relevantContact[i].hmPhone);
            $div_mobilePhone.addClass('mobilePhone').text(relevantContact[i].hdPhone).attr('title', relevantContact[i].hdPhone);
            $contPwd.addClass('remarks').text(relevantContact[i].contPwd).attr('title', relevantContact[i].contPwd);
            $div_remarks.addClass('remarks').text(relevantContact[i].fMemo).attr('title', relevantContact[i].fMemo);
            $div_row.appendTo('#table_content');
        }
        setColSize();
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
        $("#road").val(userInformation.road);
        /*$("#faultDesc").val(userInformation.faultDesc);           //任务描述
        _Checked(userInformation.isUrgent);     //加急处理*/
    }
    //解析是否加急
    function _Checked(isUrgent) {
        if(isUrgent == "1"){
            $("#Checked").removeClass("noChecked").addClass("isChecked");
        }else {
            $("#Checked").removeClass("isChecked").addClass("noChecked");
        }
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
                return usrAlmType;
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

    function userInfo_callback(data){
        $("#applyMaintainer").val(rowData.applyMaintainer);//用户报修人
        $("#warrantyTime").val(rowData.warrantyTime);//报修时间
        $("#acceptAlarmer").val(rowData.acceptAlarmer);//接警员
        $("#warrantyTel").val(rowData.warrantyTel);//报修电话
        $("#maintainFormNum").val(rowData.maintainFormNum);//维修单号
        $("#maintainTime").val(rowData.maintainTime);//维修时间
        $("#maintainUnit").val(rowData.maintainUnit);//维修单位
        $("#maintainer").val(rowData.maintainer);//维修员
        //$("#faultAppear").val(rowData.faultAppear);//故障现象
        $("#faultCause").val(rowData.faultCause);//故障原因
        $("#feedback").val(rowData.feedback);
        $("#disposalFaultResult").val(rowData.disposalFaultResult);//处理结果
        $("#memo").val(rowData.memo);//备注
        $("#faultDesc").val(rowData.faultDesc);           //任务描述
        _Checked(rowData.isUrgent);     //加急处理
    }

    function get_formId(data) {
        _global.top._setTitle("维修单：" + data);
    }
    function _getAlarmReason() {
        //报警原因查询
        post_async(
            null,
            "/IntegratedMM/QueryAlarmCaseList.do",
            _callback_getAlarmReason);
    }
    function _callback_getAlarmReason(data) {
        if(data.code == 1000){
            openDevicePlay(data);
        }else{
            _getAlarmReason();  //请求失败 再请求
        }
    }
    function openDevicePlay(data){          //打开报警原因下拉列表
        var reason = document.getElementById("reason");
        var model =  data;
        for(var i=0; i<model.result.length; i++){
            $("#reason").append("<option value='"+model.result[i].alarmcode+"'>"+model.result[i].alarmcontent+"</option>");
        }
    }
    function setColSize(){
        var col1 = document.getElementById("listBox1").getElementsByTagName('td');//获取表头所有列
        var col2 = document.getElementById("listBox2").getElementsByTagName('td');//获取数据表所有列
        $("#listBox1").colResizable({
            minWidth: 20, //最小宽度
            liveDrag:true, //是否实时拖动
            gripInnerHtml:"<div id='dragDiv1'></div>", //拖动div
            draggingClass:"dragging", //拖动div样式
            onResize: null, //拖动时调用函数
            followCol:col2,//数据表的列集合
            mainCol:col1,//表头表的列结婚firstColDrag:false
            firstColDrag:true,
        });
        $("#listBox2").colResizableNot({
            minWidth: 20, //最小宽度
            liveDrag:true, //是否实时拖动
            gripInnerHtml:"<div id='dragDiv'></div>", //拖动div
            draggingClass:"dragging", //拖动div样式
            onResize: null //拖动时调用函数
        });
        document.getElementById("listBox2").style.width=document.getElementById("listBox1").style.width;
        var columnsize = col1.length;

        if((col2!=null&&col2.length>0)&&col1!=null){
            //给数据表重新获取宽度
            for (var i = 0; i < columnsize - 1; i++) {    //遍历Table的所有列
                col2[i].style.width = col1[i].style.width;//实际应用用这里
            }
        }
        //固定和滚动
        document.getElementById("listBox2").style.width=document.getElementById("listBox1").style.width;
        var right_div2 = document.getElementById("right_div2");
        right_div2.onscroll = function(){
            var right_div2_left = this.scrollLeft;
            document.getElementById("right_div1").scrollLeft = right_div2_left;
        }
    }
})(window,jQuery);