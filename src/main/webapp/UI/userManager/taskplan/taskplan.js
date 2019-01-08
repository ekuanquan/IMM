/**
 * Created by 123 on 2017/8/17.
 */
charset = "utf-8";
/*var taskplandata = parent.gettaskplan.userId;*/
$(document).ready(function () {
    init();
});
;(function(window, $) {
    window.init =_init;
    window.setplandata =_setplandata;
    window.PopusManage = _PopusManage;
    window.closeCusPopus = _closeCusPopus;
    window.setuserId = _setuserId;
    window.setPopusName = _setPopusName;    //判断布撤防
    window.getdisarmdevId = _getdisarmdevId;
    window.getdisposedevId = _getdisposedevId;
    window.setOnfocus=_setOnfocus;

    var _config = {
        ajaxUrl: {
            findUserPlanEventByUserIdUrl:"/IntegratedMM/userplanEvent/findUserPlanEventByUserId.do",
            updateUserPlanEventUrl:'/IntegratedMM/userplanEvent/updateUserPlanEvent.do',
        }
    };
    var _global = {
        rowdata:'',
        json:{
            userPlanEvent: {
                "lastNoRptCheckDateTime": "2017-08-23%2000:14:35",
                "noRptCheckHour": 24,
                "noRptChecksymbol": 1,
                "overDateTime": "2050-08-22 22:19:38",
                "starDateTime": "2017-08-22 22:19:38",
                "userId":"01100F000"
            },
            bCFPlan:{
                "ownerId":"003100004",
                "starDateTime":"2017-12-06 08:00:00",
                "overDateTime":" 2017-12-06 08:00:00",
                "bFdevId":" 003100004",
                "bFfMemo":"",
                "cFdevId":" 003100004",
                "cFfMemo":"",
                "bFsymbol1": 1,
                "bFStartime1": "08:00:00",
                "bFOvertime1": "12:00:00",
                //"bFLastCheckDate1": "2017-12-06 08:00:00",
                "bFsymbol2": 1,
                "bFStartime2": "08:00:00",
                "bFOvertime2": "12:00:00",
               // "bFLastCheckDate2": "2017-12-06 08:00:00",
                "bFsymbol3": 1,
                "bFStartime3": "08:00:00",
                "bFOvertime3": "12:00:00",
                //"bFLastCheckDate3": "2017-12-06 08:00:00",
                "bFsymbol4": 1,
                "bFStartime4": "08:00:00",
                "bFOvertime4": "12:00:00",
                //"bFLastCheckDate4": "2017-12-06 08:00:00",
                "bFsymbol5": 1,
                "bFStartime5": "08:00:00",
                "bFOvertime5": "12:00:00",
                //"bFLastCheckDate5": "2017-12-06 08:00:00",
                "bFsymbol6": 1,
                "bFStartime6": "08:00:00",
                "bFOvertime6": "12:00:00",
                //"bFLastCheckDate6": "2017-12-06 08:00:00",
                "bFsymbol7": 1,
                "bFStartime7": "08:00:00",
                "bFOvertime7": "12:00:00",
                //"bFLastCheckDate7": "2017-12-06 08:00:00",
                "cFsymbol1": 1,
                "cFStartime1": "08:00:00",
                "cFOvertime1": "12:00:00",
               // "cFLastCheckDate1": "2017-12-06 08:00:00",
                "cFsymbol2": 1,
                "cFStartime2": "08:00:00",
                "cFOvertime2": "12:00:00",
                //"cFLastCheckDate2": "2017-12-06 08:00:00",
                "cFsymbol3": 1,
                "cFStartime3": "08:00:00",
                "cFOvertime3": "12:00:00",
                //"cFLastCheckDate3": "2017-12-06 08:00:00",
                "cFsymbol4": 1,
                "cFStartime4": "08:00:00",
                "cFOvertime4": "12:00:00",
                //"cFLastCheckDate4": "2017-12-06 08:00:00",
                "cFsymbol5": 1,
                "cFStartime5": "08:00:00",
                "cFOvertime5": "12:00:00",
                //"cFLastCheckDate5": "2017-12-06 08:00:00",
                "cFsymbol6": 1,
                "cFStartime6": "08:00:00",
                "cFOvertime6": "12:00:00",
                //"cFLastCheckDate6": "2017-12-06 08:00:00",
                "cFsymbol7": 1,
                "cFStartime7": "08:00:00",
                "cFOvertime7": "12:00:00",
                //"cFLastCheckDate7": "2017-12-06 08:00:00"
            }
        },
        plandata:"",
        PopusName:"",
        platformId:"",
        isplatform:true//是否本平台的用户
    };

    /*********************************************
     初始化
     *********************************************/
    function _init() {
        _initData();
        //判断是否是本平台
        var platforminfo = parent.getMain();
        _global.isplatform = (platforminfo.platform_id ==_global.platformId ? true:false);
        //_global.isplatform = false;
        _initEven();

    }
    function _initData() {
        _gettaskplanInfo();
        if($("#start_input").val() == "" && $("#end_input").val() == ""){
            time = time();
            $("#start_input").val(time + " " + "00:00:00");
            $("#end_input").val("2020-01-01 00:00:00");
        }
    }
    function _initEven() {
        /*********************************************************************
         关闭窗口点击事件
         *********************************************************************/
        $("#close,#remove").click(function () {
            parent.parent.closePopus();
        });
        if(_global.isplatform) {
            /*********************************************************************
             保存按钮点击事件
             *********************************************************************/
            $("#sure").click(function () {
                var taskplandata = parent.gettaskplan();
                var disposedata = disposeIframe.callbackdispose();
                var disarmdata = disarmIframe.callbackdisarm();
                var otherdata = otherIframe.callbackother();
                //其他
                _global.json.userPlanEvent.userId = taskplandata.userId;
                _global.json.userPlanEvent.lastNoRptCheckDateTime = otherdata.lastNoRptCheckDateTime;
                _global.json.userPlanEvent.noRptCheckHour = otherdata.noRptCheckHour;
                _global.json.userPlanEvent.noRptChecksymbol = otherdata.noRptChecksymbol;
                _global.json.userPlanEvent.starDateTime = $("#start_input").val();
                _global.json.userPlanEvent.overDateTime = $("#end_input").val();
                //撤防
                _global.json.bCFPlan.ownerId = taskplandata.userId;
                _global.json.bCFPlan.starDateTime = $("#start_input").val();
                _global.json.bCFPlan.overDateTime = $("#end_input").val();
                _global.json.bCFPlan.cFStartime1 = disarmdata.cFStartime1;
                _global.json.bCFPlan.cFStartime2 = disarmdata.cFStartime2;
                _global.json.bCFPlan.cFStartime3 = disarmdata.cFStartime3;
                _global.json.bCFPlan.cFStartime4 = disarmdata.cFStartime4;
                _global.json.bCFPlan.cFStartime5 = disarmdata.cFStartime5;
                _global.json.bCFPlan.cFStartime6 = disarmdata.cFStartime6;
                _global.json.bCFPlan.cFStartime7 = disarmdata.cFStartime7;
                _global.json.bCFPlan.cFOvertime1 = disarmdata.cFOvertime1;
                _global.json.bCFPlan.cFOvertime2 = disarmdata.cFOvertime2;
                _global.json.bCFPlan.cFOvertime3 = disarmdata.cFOvertime3;
                _global.json.bCFPlan.cFOvertime4 = disarmdata.cFOvertime4;
                _global.json.bCFPlan.cFOvertime5 = disarmdata.cFOvertime5;
                _global.json.bCFPlan.cFOvertime6 = disarmdata.cFOvertime6;
                _global.json.bCFPlan.cFOvertime7 = disarmdata.cFOvertime7;
                _global.json.bCFPlan.cFsymbol1 = disarmdata.cFsymbol1;
                _global.json.bCFPlan.cFsymbol2 = disarmdata.cFsymbol2;
                _global.json.bCFPlan.cFsymbol3 = disarmdata.cFsymbol3;
                _global.json.bCFPlan.cFsymbol4 = disarmdata.cFsymbol4;
                _global.json.bCFPlan.cFsymbol5 = disarmdata.cFsymbol5;
                _global.json.bCFPlan.cFsymbol6 = disarmdata.cFsymbol6;
                _global.json.bCFPlan.cFsymbol7 = disarmdata.cFsymbol7;
                _global.json.bCFPlan.cFdevId = disarmdata.cFdevId;
                _global.json.bCFPlan.cFfMemo = disarmdata.cFfMemo;
                //布防
                _global.json.bCFPlan.bFStartime1 = disposedata.bFStartime1;
                _global.json.bCFPlan.bFStartime2 = disposedata.bFStartime2;
                _global.json.bCFPlan.bFStartime3 = disposedata.bFStartime3;
                _global.json.bCFPlan.bFStartime4 = disposedata.bFStartime4;
                _global.json.bCFPlan.bFStartime5 = disposedata.bFStartime5;
                _global.json.bCFPlan.bFStartime6 = disposedata.bFStartime6;
                _global.json.bCFPlan.bFStartime7 = disposedata.bFStartime7;
                _global.json.bCFPlan.bFOvertime1 = disposedata.bFOvertime1;
                _global.json.bCFPlan.bFOvertime2 = disposedata.bFOvertime2;
                _global.json.bCFPlan.bFOvertime3 = disposedata.bFOvertime3;
                _global.json.bCFPlan.bFOvertime4 = disposedata.bFOvertime4;
                _global.json.bCFPlan.bFOvertime5 = disposedata.bFOvertime5;
                _global.json.bCFPlan.bFOvertime6 = disposedata.bFOvertime6;
                _global.json.bCFPlan.bFOvertime7 = disposedata.bFOvertime7;
                _global.json.bCFPlan.bFsymbol1 = disposedata.bFsymbol1;
                _global.json.bCFPlan.bFsymbol2 = disposedata.bFsymbol2;
                _global.json.bCFPlan.bFsymbol3 = disposedata.bFsymbol3;
                _global.json.bCFPlan.bFsymbol4 = disposedata.bFsymbol4;
                _global.json.bCFPlan.bFsymbol5 = disposedata.bFsymbol5;
                _global.json.bCFPlan.bFsymbol6 = disposedata.bFsymbol6;
                _global.json.bCFPlan.bFsymbol7 = disposedata.bFsymbol7;
                _global.json.bCFPlan.bFdevId = disposedata.bFdevId;
                _global.json.bCFPlan.bFfMemo = disposedata.bFfMemo;
                var params = _global.json;
                console.group(params);
                post_async(params, _config.ajaxUrl.updateUserPlanEventUrl, _callback_addInfo);
            });

            /*********************************************************************
             修改数据
             *********************************************************************/
            function _callback_addInfo(data) {
                if (data.result.code == "200") {
                    //alert("保存成功！");
                    parent.parent.alertTip("任务计划保存成功！", 0, null);
                    parent.parent.closePopus();
                }
                else {
                    //alert("保存失败！");
                    parent.parent.alertTip("任务计划保存失败！", 0, null);
                }
            }

            /*********************************************************************
             开始与结束时间的时间插件
             *********************************************************************/
            $("#start_input").bind('focus', function () {
                WdatePicker({
                    maxDate: '#F{$dp.$D(\'end_input\')}',
                    dateFmt: 'yyyy-MM-dd HH:mm:ss',
                    isShowClear: false
                });
                this.blur();
            $("#_my97DP").mouseout(function () {
                _global.mouseoutEventA = setTimeout(function () {
                    $("#_my97DP").hide();
                }, 1000);
            }).mouseover(function () {
                clearTimeout(_global.mouseoutEventA);
            });
            _global.mouseoutEventA = setTimeout(function () {
                $("#_my97DP").hide();
            }, 1000);
        });
        $("#end_input").bind('focus',function () {
            WdatePicker({
                minDate: '#F{$dp.$D(\'start_input\')}',
                dateFmt: 'yyyy-MM-dd HH:mm:ss',
                isShowClear: false
            });
            this.blur();
            $("#_my97DP").mouseout(function () {
                _global.mouseoutEventA = setTimeout(function () {
                    $("#_my97DP").hide();
                }, 1000);
            }).mouseover(function () {
                clearTimeout(_global.mouseoutEventA);
            });
            _global.mouseoutEventA = setTimeout(function () {
                $("#_my97DP").hide();
            }, 1000);
        });
            $("#end_input").bind('focus', function () {
                WdatePicker({
                    minDate: '#F{$dp.$D(\'start_input\')}',
                    dateFmt: 'yyyy-MM-dd HH:mm:ss',
                    isShowClear: false
                });
                this.blur();
            });
        }else {
            $("#sure,#remove").css("display","none");
            $("input").css("color","#898989;").attr("readonly","ture");
            $("textarea").css("color","#898989;").attr("readonly","ture");
        }
        /*********************************************************************
         切换任务点击事件
         *********************************************************************/
        $(".main_title").click(function () {
           $(this).addClass("isChoose").siblings().removeClass("isChoose");
            _switchTitleItem($(this).attr("id"));
        });
        //默认点击
        $("#dispose").click();
    }
    /*********************************************************************
        展示各个任务界面
     *********************************************************************/
    function _switchTitleItem(iframeStr) {
        var id = iframeStr+"Iframe";
        console.log(id);
        $("#"+id).css("width","100%").siblings().css("width","0");
    }
    /*********************************************************************
     根据useId获取任务计划数据
     *********************************************************************/
    function _gettaskplanInfo(){
        var taskplandata = parent.gettaskplan();
        var params = taskplandata.userId;
        _global.platformId = taskplandata.platformId;
        _global.userId = taskplandata.userId;
        params = {userId:params};
        post_async(params, _config.ajaxUrl.findUserPlanEventByUserIdUrl,_callback_taskplandata);
    }
    /*********************************************************************
     任务计划的回调函数
     *********************************************************************/
    function _callback_taskplandata(data){
        if(data.userPlanEvent){
            if(data.result.code == "200"){
                $("#start_input").val(data.userPlanEvent.starDateTime);
                $("#end_input").val(data.userPlanEvent.overDateTime);
                _global.plandata = data;
                _global.plandata.isplatform = _global.isplatform;
                _setInfo(_global.plandata);//将数据传给各个界面
            }
        }
    }
    /*********************************************************************
        将数据传到各个页面
     *********************************************************************/
    function _setInfo(data) {
        if(disposeIframe.gettaskplanInfo&& typeof disposeIframe.gettaskplanInfo =="function")
            disposeIframe.gettaskplanInfo(data);
        if(disarmIframe.gettaskplanInfo&& typeof disarmIframe.gettaskplanInfo =="function")
            disarmIframe.gettaskplanInfo(data);
        if(otherIframe.gettaskplanInfo&& typeof otherIframe.gettaskplanInfo =="function")
            otherIframe.gettaskplanInfo(data);
    }
    /*********************************************************************
     将获取到的信息传到子页面
     *********************************************************************/
    function _setplandata(){
        return _global.plandata;
    }
    /*********************************************************************
     将获取到的信息传到子页面
     *********************************************************************/
    function _setuserId(){
        return _global.userId;
    }
    /*********************************************************************
     判断布撤防
     *********************************************************************/
    function _setPopusName(){
        return _global.PopusName;
    }
    /*********************************************************************
        布防主机编号
     *********************************************************************/
    function _getdisposedevId(devId){
        disposeIframe.getposedevId(devId);
    }
    /*********************************************************************
        撤防主机编号
     *********************************************************************/
    function _getdisarmdevId(devId){
        disarmIframe.getarmdevId(devId);
    }
    /*********************************************************************
     机主编号弹窗
     *********************************************************************/
    function _PopusManage(PopusName) {
        _global.PopusName =PopusName;
        _openCusPopups($('body'), './associatedApparatusEdit/associatedApparatusEdit.html', {
            width: 770,
            height: 600
        });
    }
    //关闭弹窗
    function _closeCusPopus() {
        $("#mainDiv399").remove();
        $("#bottomDiv399").remove();
    }
    /*********************************************************************
     获取当前时间的函数
     *********************************************************************/
    function time()
    {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
       /* var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();*/
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }
    function _setOnfocus(){
        $("#start_input").blur()
        $("#end_input").blur()
    }
}(window, jQuery));
