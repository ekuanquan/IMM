
/**
 * Created by 123 on 2017/12/7.
 */
charset = "utf-8";
$(document).ready(function () {
    init();
});
;(function(window, $) {
    window.init =_init;
    window.callbackdisarm = _callbackdisarm;
    window.getarmdevId = _getarmdevId;
    window.gettaskplanInfo = _gettaskplanInfo;
    var _config = {
        ajaxUrl: {
        }
    };
    var _global = {
        cFsymbol:[],
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
         // 切换勾选点击事件
        $(".flagcls").click(function () {
            if($(this).hasClass('choose_no')){
                $(this).removeClass('choose_no').addClass('choose_is');
            }
            else {
                $(this).removeClass('choose_is').addClass('choose_no');
            }
        });
        //主机编号的点击事件
        $("#cFdevId").click(function () {
            parent.PopusManage("disarm");
        });
         //开始与结束时间的时间插件
        $("#cFStartime1").bind('focus',function () {
            WdatePicker({
                maxDate: '#F{$dp.$D(\'cFOvertime1\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#cFOvertime1").bind('focus',function () {
            WdatePicker({
                minDate: '#F{$dp.$D(\'cFStartime1\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#cFStartime2").bind('focus',function () {
            WdatePicker({
                maxDate: '#F{$dp.$D(\'cFOvertime2\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#cFOvertime2").bind('focus',function () {
            WdatePicker({
                minDate: '#F{$dp.$D(\'cFStartime2\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#cFStartime3").bind('focus',function () {
            WdatePicker({
                maxDate: '#F{$dp.$D(\'cFOvertime3\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#cFOvertime3").bind('focus',function () {
            WdatePicker({
                minDate: '#F{$dp.$D(\'cFStartime3\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#cFStartime4").bind('focus',function () {
            WdatePicker({
                maxDate: '#F{$dp.$D(\'cFOvertime4\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#cFOvertime4").bind('focus',function () {
            WdatePicker({
                minDate: '#F{$dp.$D(\'cFStartime4\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#cFStartime5").bind('focus',function () {
            WdatePicker({
                maxDate: '#F{$dp.$D(\'cFOvertime5\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#cFOvertime5").bind('focus',function () {
            WdatePicker({
                minDate: '#F{$dp.$D(\'cFStartime5\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#cFStartime6").bind('focus',function () {
            WdatePicker({
                maxDate: '#F{$dp.$D(\'cFOvertime6\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#cFOvertime6").bind('focus',function () {
            WdatePicker({
                minDate: '#F{$dp.$D(\'cFStartime6\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#cFStartime7").bind('focus',function () {
            WdatePicker({
                maxDate: '#F{$dp.$D(\'cFOvertime7\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
        $("#cFOvertime7").bind('focus',function () {
            WdatePicker({
                minDate: '#F{$dp.$D(\'cFStartime7\')}',
                dateFmt: 'HH:mm:ss',
                isShowClear: false,
                isShowToday:false
            });
            this.blur();
        });
    }
    /*************************************************
     获取撤防数据
     *************************************************/
    function _callbackdisarm() {
        //判断是否启用
        _noRpt();
        var disposedata ={};
        disposedata.cFStartime1=$("#cFStartime1").val();
        disposedata.cFStartime2=$("#cFStartime2").val();
        disposedata.cFStartime3=$("#cFStartime3").val();
        disposedata.cFStartime4=$("#cFStartime4").val();
        disposedata.cFStartime5=$("#cFStartime5").val();
        disposedata.cFStartime6=$("#cFStartime6").val();
        disposedata.cFStartime7=$("#cFStartime7").val();
        disposedata.cFOvertime1=$("#cFOvertime1").val();
        disposedata.cFOvertime2=$("#cFOvertime2").val();
        disposedata.cFOvertime3=$("#cFOvertime3").val();
        disposedata.cFOvertime4=$("#cFOvertime4").val();
        disposedata.cFOvertime5=$("#cFOvertime5").val();
        disposedata.cFOvertime6=$("#cFOvertime6").val();
        disposedata.cFOvertime7=$("#cFOvertime7").val();
        disposedata.cFsymbol1 = _global.cFsymbol[1];
        disposedata.cFsymbol2 = _global.cFsymbol[2];
        disposedata.cFsymbol3 = _global.cFsymbol[3];
        disposedata.cFsymbol4 = _global.cFsymbol[4];
        disposedata.cFsymbol5 = _global.cFsymbol[5];
        disposedata.cFsymbol6 = _global.cFsymbol[6];
        disposedata.cFsymbol7 = _global.cFsymbol[7];
        disposedata.cFdevId = $("#cFdevId").val();
        disposedata.cFfMemo =$("#cFfMemo").val();
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
        //var data = parent.setplandata();
        if(data.bCFPlan){
            $("#cFStartime1").val(data.bCFPlan.cFStartime1);
            $("#cFStartime2").val(data.bCFPlan.cFStartime2);
            $("#cFStartime3").val(data.bCFPlan.cFStartime3);
            $("#cFStartime4").val(data.bCFPlan.cFStartime4);
            $("#cFStartime5").val(data.bCFPlan.cFStartime5);
            $("#cFStartime6").val(data.bCFPlan.cFStartime6);
            $("#cFStartime7").val(data.bCFPlan.cFStartime7);
            $("#cFOvertime1").val(data.bCFPlan.cFOvertime1);
            $("#cFOvertime2").val(data.bCFPlan.cFOvertime2);
            $("#cFOvertime3").val(data.bCFPlan.cFOvertime3);
            $("#cFOvertime4").val(data.bCFPlan.cFOvertime4);
            $("#cFOvertime5").val(data.bCFPlan.cFOvertime5);
            $("#cFOvertime6").val(data.bCFPlan.cFOvertime6);
            $("#cFOvertime7").val(data.bCFPlan.cFOvertime7);
            if(data.bCFPlan.cFsymbol1 == "0"){
                $("#cFsymbol1").removeClass("choose_is").addClass("choose_no");
            }else {
                $("#cFsymbol1").removeClass("choose_no").addClass("choose_is");
            }
            if(data.bCFPlan.cFsymbol2 == "0"){
                $("#cFsymbol2").removeClass("choose_is").addClass("choose_no");
            }else {
                $("#cFsymbol2").removeClass("choose_no").addClass("choose_is");
            }
            if(data.bCFPlan.cFsymbol3 == "0"){
                $("#cFsymbol3").removeClass("choose_is").addClass("choose_no");
            }else {
                $("#cFsymbol3").removeClass("choose_no").addClass("choose_is");
            }
            if(data.bCFPlan.cFsymbol4 == "0"){
                $("#cFsymbol4").removeClass("choose_is").addClass("choose_no");
            }else {
                $("#cFsymbol4").removeClass("choose_no").addClass("choose_is");
            }
            if(data.bCFPlan.cFsymbol5 == "0"){
                $("#cFsymbol5").removeClass("choose_is").addClass("choose_no");
            }else {
                $("#cFsymbol5").removeClass("choose_no").addClass("choose_is");
            }
            if(data.bCFPlan.cFsymbol6 == "0"){
                $("#cFsymbol6").removeClass("choose_is").addClass("choose_no");
            }else {
                $("#cFsymbol6").removeClass("choose_no").addClass("choose_is");
            }
            if(data.bCFPlan.cFsymbol7 == "0"){
                $("#cFsymbol7").removeClass("choose_is").addClass("choose_no");
            }else {
                $("#cFsymbol7").removeClass("choose_no").addClass("choose_is");
            }
            $("#cFdevId").val(data.bCFPlan.cFdevId);
            $("#cFfMemo").val(data.bCFPlan.cFfMemo);
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
            var cFsymbol= "cFsymbol"+i;
            if($("#"+cFsymbol).hasClass("choose_no")){
                _global.cFsymbol[i] = 0;
            }
            else{
                _global.cFsymbol[i] = 1;
            }
        }
    }
    /*********************************************************************
     获取主机编号
     *********************************************************************/
    function _getarmdevId(devId) {
        $("#cFdevId").val(devId);
    }
}(window, jQuery));
