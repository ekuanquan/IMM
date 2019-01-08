/**
 * Created by 123 on 2017/12/7.
 */
charset = "utf-8";
$(document).ready(function () {
    init();
});
;(function(window, $) {
    window.init =_init;
    window.callbackdispose = _callbackdispose;
    window.getposedevId = _getposedevId;
    window.gettaskplanInfo = _gettaskplanInfo;//获取显示信息
    var _config = {
        ajaxUrl: {
        }
    };
    var _global = {
        bFsymbol:[],
        isplatform:true//是否是本平台的，先默认是，不走解除事件绑定
    };

    /*********************************************
     初始化
     *********************************************/
    function _init() {
        _initEven();
        _initData();
    }
    function _initData() {
        var data =null;
        _gettaskplanInfo(data);
    }
    function _initEven() {
        //主机编号的点击事件
        $("#bFdevId").click(function () {
            parent.setOnfocus();
            parent.PopusManage("dispose");
        });
        // 切换勾选点击事件
        $(".flagcls").click(function () {
            if($(this).hasClass('choose_no')){
                $(this).removeClass('choose_no').addClass('choose_is');
            }
            else {
                $(this).removeClass('choose_is').addClass('choose_no');
            }
        });
        //开始与结束时间的时间插件
        $("#bFStartime1").bind('focus',function () {
            WdatePicker({
                maxDate: '#F{$dp.$D(\'bFOvertime1\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#bFOvertime1").bind('focus',function () {
            WdatePicker({
                minDate: '#F{$dp.$D(\'bFStartime1\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#bFStartime2").bind('focus',function () {
            WdatePicker({
                maxDate: '#F{$dp.$D(\'bFOvertime2\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#bFOvertime2").bind('focus',function () {
            WdatePicker({
                minDate: '#F{$dp.$D(\'bFStartime2\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#bFStartime3").bind('focus',function () {
            WdatePicker({
                maxDate: '#F{$dp.$D(\'bFOvertime3\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#bFOvertime3").bind('focus',function () {
            WdatePicker({
                minDate: '#F{$dp.$D(\'bFStartime3\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#bFStartime4").bind('focus',function () {
            WdatePicker({
                maxDate: '#F{$dp.$D(\'bFOvertime4\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#bFOvertime4").bind('focus',function () {
            WdatePicker({
                minDate: '#F{$dp.$D(\'bFStartime4\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#bFStartime5").bind('focus',function () {
            WdatePicker({
                maxDate: '#F{$dp.$D(\'bFOvertime5\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#bFOvertime5").bind('focus',function () {
            WdatePicker({
                minDate: '#F{$dp.$D(\'bFStartime5\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#bFStartime6").bind('focus',function () {
            WdatePicker({
                maxDate: '#F{$dp.$D(\'bFOvertime6\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#bFOvertime6").bind('focus',function () {
            WdatePicker({
                minDate: '#F{$dp.$D(\'bFStartime6\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#bFStartime7").bind('focus',function () {
            WdatePicker({
                maxDate: '#F{$dp.$D(\'bFOvertime7\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#bFOvertime7").bind('focus',function () {
            WdatePicker({
                minDate: '#F{$dp.$D(\'bFStartime7\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
    }
    /*************************************************
        获取布防数据
     *************************************************/
    function _callbackdispose() {
        //判断是否启用
        _noRpt();
        var disposedata ={};
        disposedata.bFStartime1=$("#bFStartime1").val();
        disposedata.bFStartime2=$("#bFStartime2").val();
        disposedata.bFStartime3=$("#bFStartime3").val();
        disposedata.bFStartime4=$("#bFStartime4").val();
        disposedata.bFStartime5=$("#bFStartime5").val();
        disposedata.bFStartime6=$("#bFStartime6").val();
        disposedata.bFStartime7=$("#bFStartime7").val();
        disposedata.bFOvertime1=$("#bFOvertime1").val();
        disposedata.bFOvertime2=$("#bFOvertime2").val();
        disposedata.bFOvertime3=$("#bFOvertime3").val();
        disposedata.bFOvertime4=$("#bFOvertime4").val();
        disposedata.bFOvertime5=$("#bFOvertime5").val();
        disposedata.bFOvertime6=$("#bFOvertime6").val();
        disposedata.bFOvertime7=$("#bFOvertime7").val();
        disposedata.bFsymbol1 = _global.bFsymbol[1];
        disposedata.bFsymbol2 = _global.bFsymbol[2];
        disposedata.bFsymbol3 = _global.bFsymbol[3];
        disposedata.bFsymbol4 = _global.bFsymbol[4];
        disposedata.bFsymbol5 = _global.bFsymbol[5];
        disposedata.bFsymbol6 = _global.bFsymbol[6];
        disposedata.bFsymbol7 = _global.bFsymbol[7];
        disposedata.bFdevId = $("#bFdevId").val();
        disposedata.bFfMemo =$("#bFfMemo").val();
        return disposedata;
    }
    /*********************************************************************
     获取任务计划数据
     *********************************************************************/
    function _gettaskplanInfo(data) {
        if(data==null|| data == "undefine" ||data == ""){
            data = parent.setplandata();
        }else {
            data = data
        }
       // var data = parent.setplandata();
        if(data.bCFPlan){
            $("#bFStartime1").val(data.bCFPlan.bFStartime1);
            $("#bFStartime2").val(data.bCFPlan.bFStartime2);
            $("#bFStartime3").val(data.bCFPlan.bFStartime3);
            $("#bFStartime4").val(data.bCFPlan.bFStartime4);
            $("#bFStartime5").val(data.bCFPlan.bFStartime5);
            $("#bFStartime6").val(data.bCFPlan.bFStartime6);
            $("#bFStartime7").val(data.bCFPlan.bFStartime7);
            $("#bFOvertime1").val(data.bCFPlan.bFOvertime1);
            $("#bFOvertime2").val(data.bCFPlan.bFOvertime2);
            $("#bFOvertime3").val(data.bCFPlan.bFOvertime3);
            $("#bFOvertime4").val(data.bCFPlan.bFOvertime4);
            $("#bFOvertime5").val(data.bCFPlan.bFOvertime5);
            $("#bFOvertime6").val(data.bCFPlan.bFOvertime6);
            $("#bFOvertime7").val(data.bCFPlan.bFOvertime7);
            if(data.bCFPlan.bFsymbol1 == "0"){
                $("#bFsymbol1").removeClass("choose_is").addClass("choose_no");
            }else {
                $("#bFsymbol1").removeClass("choose_no").addClass("choose_is");
            }
            if(data.bCFPlan.bFsymbol2 == "0"){
                $("#bFsymbol2").removeClass("choose_is").addClass("choose_no");
            }else {
                $("#bFsymbol2").removeClass("choose_no").addClass("choose_is");
            }
            if(data.bCFPlan.bFsymbol3 == "0"){
                $("#bFsymbol3").removeClass("choose_is").addClass("choose_no");
            }else {
                $("#bFsymbol3").removeClass("choose_no").addClass("choose_is");
            }
            if(data.bCFPlan.bFsymbol4 == "0"){
                $("#bFsymbol4").removeClass("choose_is").addClass("choose_no");
            }else {
                $("#bFsymbol4").removeClass("choose_no").addClass("choose_is");
            }
            if(data.bCFPlan.bFsymbol5 == "0"){
                $("#bFsymbol5").removeClass("choose_is").addClass("choose_no");
            }else {
                $("#bFsymbol5").removeClass("choose_no").addClass("choose_is");
            }
            if(data.bCFPlan.bFsymbol6 == "0"){
                $("#bFsymbol6").removeClass("choose_is").addClass("choose_no");
            }else {
                $("#bFsymbol6").removeClass("choose_no").addClass("choose_is");
            }
            if(data.bCFPlan.bFsymbol7 == "0"){
                $("#bFsymbol7").removeClass("choose_is").addClass("choose_no");
            }else {
                $("#bFsymbol7").removeClass("choose_no").addClass("choose_is");
            }
            $("#bFdevId").val(data.bCFPlan.bFdevId);
            $("#bFfMemo").val(data.bCFPlan.bFfMemo);
            _global.isplatform = data.isplatform;
        }
        //如果不是同一平台时，解除事件绑定
        if(!_global.isplatform){
            $("input").unbind().attr("readonly","ture").css("color","#898989");
            $("textarea").css("color","#898989").attr("readonly","ture");
            $(".flagcls").css({
                "pointer-events": "none",//解除事件绑定
                "opacity": "0.5"
            });
        }
    }
    /*********************************************************************
     判断启用是否选中
     *********************************************************************/
    function _noRpt() {
        for(var i=1;i<8;i++){
            var bFsymbol= "bFsymbol"+i;
            if($("#"+bFsymbol).hasClass("choose_no")){
                _global.bFsymbol[i] = 0;
            }
            else{
                _global.bFsymbol[i] = 1;
            }
        }
    }
    /*********************************************************************
     获取主机编号
     *********************************************************************/
    function _getposedevId(devId) {
        $("#bFdevId").val(devId);
    }
}(window, jQuery));