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


    var _config = {
        ajaxUrl: {
            findUserPlanEventByUserIdUrl:"/IntegratedMM/userplanEvent/findUserPlanEventByUserId.do",
            updateUserPlanEventUrl:'/IntegratedMM/userplanEvent/updateUserPlanEvent.do',
        }
    };
    _global = {
        rowdata:''
    };

    /*********************************************
     初始化
     *********************************************/
    function _init() {
        _initData();
        _initEven();
        gettaskplanInfo();
    }
    function _initData() {

    }
    function _initEven() {
        /*********************************************************************
         关闭窗口点击事件
         *********************************************************************/
        $("#close,#remove").click(function () {
            parent.parent.closePopus();
        });
        /*********************************************************************
         保存按钮点击事件
         *********************************************************************/
        $("#sure").click(function () {
            getreviseInfo();
        });
        /*********************************************************************
         开始与结束时间的时间插件
         *********************************************************************/
        $("#start_input").bind('focus',function () {
            WdatePicker({
                maxDate: '#F{$dp.$D(\'end_input\')}',
                dateFmt: 'yyyy-MM-dd HH:mm:ss',
                isShowClear: false
            });
            this.blur();
        });
        $("#end_input").bind('focus',function () {
            WdatePicker({
                minDate: '#F{$dp.$D(\'start_input\')}',
                dateFmt: 'yyyy-MM-dd HH:mm:ss',
                isShowClear: false
            });
            this.blur();
        });
        /*********************************************************************
         切换勾选点击事件
         *********************************************************************/
        $("#choose_no").click(function () {
            if($("#choose_no").hasClass('choose_no')){
                $(this).removeClass('choose_no').addClass('choose_is');
            }
            else {
                $(this).removeClass('choose_is').addClass('choose_no');
            }
        });
        $("#Supertested").click(function () {
            $("#choose_img").toggleClass("choose_is");
        })

    }
    /*********************************************************************
     获取任务计划修改数据
     *********************************************************************/
    function getreviseInfo() {
        //replace("T"," ")
        //parent.parent.comfireFloat("是否确定保存修改？",callbacksuc,null);
        callbacksuc();
    }
    /*********************************************************************
     确定保存
     *********************************************************************/
    function callbacksuc() {
        var taskplandata = parent.gettaskplan();
        var userPlanEvent ={};
        var params={};
        var starttime = $("#start_input").val();
        var endtime = $("#end_input").val();
        var lasttime =$("#old_input").val();
        userPlanEvent.starDateTime =starttime;
        userPlanEvent.overDateTime = endtime;
        userPlanEvent.lastNoRptCheckDateTime = lasttime;
        userPlanEvent.noRptChecksymbol = noRpt();
        userPlanEvent.noRptCheckHour = $("#noRptCheckHour").val();
        userPlanEvent.userId = taskplandata.userId;
        params.userPlanEvent =userPlanEvent;
        post_async(params, _config.ajaxUrl.updateUserPlanEventUrl,_callback_addInfo);
    }
    /*********************************************************************
     判断无报告检查启用是否选中
     *********************************************************************/
    function noRpt() {
        if($("#choose_no").hasClass("choose_no")){
            return 0;
        }
        else{
            return 1;
        }
    }
    /*********************************************************************
     修改数据
     *********************************************************************/
    function _callback_addInfo(data) {
            if(data.result.code == "200"){
                //alert("保存成功！");
                parent.parent.alertTip("任务计划保存成功！",0,null);
                parent.parent.closePopus();
            }
            else {
                //alert("保存失败！");
                parent.parent.alertTip("任务计划保存失败！",0,null);
            }
    }
    /*********************************************************************
     根据useId获取任务计划数据
     *********************************************************************/
    function gettaskplanInfo() {
        var taskplandata = parent.gettaskplan();
        var params = taskplandata.userId;
        params = {userId:params};
       /* var params =  {userId: "01100F029"};*/
        post_async(params, _config.ajaxUrl.findUserPlanEventByUserIdUrl,callback_taskplandata);
    }
    /*********************************************************************
     任务计划的回调函数
     *********************************************************************/
    function callback_taskplandata(data) {
        var userPlanEvent;
        if(data.userPlanEvent){
            if(data.result.code == "200"){
                $("#start_input").val(data.userPlanEvent.starDateTime);
                $("#end_input").val(data.userPlanEvent.overDateTime);
                $("#noRptCheckHour").val(data.userPlanEvent.noRptCheckHour);
                $("#old_input").val(data.userPlanEvent.lastNoRptCheckDateTime);
                if(data.userPlanEvent.noRptChecksymbol == "0"){
                    $("#choose_no").removeClass("choose_is").addClass("choose_no");
                }else {
                    $("#choose_no").removeClass("choose_no").addClass("choose_is");
                }
            }
        }

        if($("#start_input").val() == "" && $("#end_input").val() == ""){
            time = time();
            $("#start_input").val(time + " " + "00:00:00");
            $("#end_input").val("2020-01-01 00:00:00");
        }
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
    /*********************************************************************
     判断数组是否含有该元素
     *********************************************************************/
    function contains(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i] == obj) {
                return true;
            }
        }
        return false;
    }

}(window, jQuery));
