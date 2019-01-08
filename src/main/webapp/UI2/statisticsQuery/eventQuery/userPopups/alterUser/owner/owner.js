/*********
 * 获取登录用户和右键点击的数据
 */
var rowData = parent.parent.getPopupsRowJson();
var accountNum = rowData.userCode;
/*********
 * 全局变量
 */
var _global = {
    top: parent.parent,
    userZonePojo: null,
    mouseoutEventA: null,
    jsonData: '',
    rowJson: '',
    getLinkageViewParams: {
        userPojo: {
            userId: '',
            zoneCHValue: '',
            zoneCHFlag: ""
        }
    },
    NVRVideoPojo: {},
    isUserZoneShow: false
};


$(function () {
    window.getNVRVideoPojo = _getNVRVideoPojo;
    var _config = {
        ajaxUrl: {
            getMapPicUrl: '/IntegratedMM/query/getMapPicByUserId.do',
            getLinkageViewUrl: '/IntegratedMM/query/getNVRVideoUrl.do'
        }
    };
    _init();

    function _init() {
        _initEvent();
        _initData();
    }
    function _initData() {
        _global.jsonData=rowData;
        _getLinkageView();

    }
    function _initEvent() {
        $("#electronicMap").bind('click', function () {
            parent.parent.popusStaManager('openMap');
        });
        $("#linkageVideo1").bind('click', function () {
            parent.parent.popusStaManager('linkageVideo');
        });

        if(rowData.deviceId&&rowData.deviceId !=""){
            $("#electronicMap").removeClass("pointerNone");
        };
    }
    /*********
     * 初始化加载用户信息
     */
    post_async(
        {"userId": accountNum},
        "/IntegratedMM/query/getUserData.do",
        basicInformation_callback);
    /************************************************
     基本信息的回调函数
     ************************************************/
    function basicInformation_callback(data) {
        _global.userDate=data;
        var isPay = data.userInformation.isPay;
        var isVideoCheck = data.userInformation.isVideoCheck;
        var engageTest = data.userInformation.engageTest;
        var nomRpt = data.userInformation.nomRpt;
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
        $("#userId").val(data.userInformation.userId);
        $("#contact").val(data.userInformation.contact);
        $("#cMobile").val(data.userInformation.cMobile);
        $("#accountName").val(data.userInformation.userName);
        $("#rdClass").val(getUsrAlmType(data.userInformation.usrAlmType));//用户级别
        $("#cPayNO").val(data.userInformation.payNO);
        $("#accountAddr").val(data.userInformation.userAddr);
        $("#userType").val(userTypeTranse(data.userInformation.userType));
        $("#businessName").val(data.userInformation.businessName);
        $("#serverType").val(data.userInformation.userServerTypeName);
        $("#areaName").val(data.userInformation.areaName);
        $("#business_subName").val(data.userInformation.define1);//子行业
        $("#centerName").val(data.userInformation.centerName); //分中心编号，没有文字
        $("#isPay").val(isPay);//缴费状态*
        $("#createDate").val(data.userInformation.createDate);//录入时间

        $("#cPhone").val(data.userInformation.cPhone);//负责人电话
        $("#isVideoCheck").val(isVideoCheck);//短信转发*
        $("#operName").val(data.userInformation.operName);//录入人

        $("#pnlTel").val(data.userInformation.pnlTel);//联网电话
        $("#instDate").val(data.userInformation.instDate);//安装日期
        $("#engageTest").val(engageTest);//定期测试用户*

        $("#pnlHdTel").val(data.userInformation.pnlHdTel);//无线卡号
        $("#nomRpt").val(nomRpt);//定期撤布防用户*
        $("#fMemo").val(data.userInformation.fMemo);//备注
        
        $("#eventType").val(rowData.eventType);//事件类型
        $("#eventTime").val(rowData.datetime);//报警时间
        $("#alarmAddr").val(rowData.atPos);//报警位置
        $("#eventDesc").val(rowData.eventDescribe);//事件描述
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
    /************************************************
     用户类型的数据转换
     ************************************************/
    function userTypeTranse(userTypeId) {
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

    function _getLinkageView() {

        _global.getLinkageViewParams.userPojo.userId = accountNum;
        if (_global.jsonData.accountZone == '' || _global.jsonData.accountZone == null) {
            _global.getLinkageViewParams.userPojo.zoneCHValue = '0000';
            _global.getLinkageViewParams.userPojo.zoneCHFlag = '1';
        } else {
            _global.getLinkageViewParams.userPojo.zoneCHValue = _global.jsonData.accountZone;
            _global.getLinkageViewParams.userPojo.zoneCHFlag = '0';

        }

        var params = _getLinkageViewParams();
        post_async(params, _config.ajaxUrl.getLinkageViewUrl, _callback_getLinkageView)
    }

    function _getLinkageViewParams() {
        var params = {};
        params.userPojo = {};
        params.userPojo = _global.getLinkageViewParams.userPojo;
        return params;
    }
    function _callback_getLinkageView(data) {
        var result = data.result;
        if (result.code == '0') {
            _global.NVRVideoPojo = data.NVRVideoPojo;
            $("#linkageVideo1").removeClass('pointerNone');
        } else {
        }
    }
    function _getNVRVideoPojo() {
        return _global.NVRVideoPojo;
    }
});