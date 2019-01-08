/**
 * Created by 123 on 2017/12/7.
 */
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
    window.callbackother = _callbackother;
    window.gettaskplanInfo = _gettaskplanInfo;


    var _config = {
        ajaxUrl: {
        }
    };
    var _global = {
        rowdata:'',
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
        var data = null;
        _gettaskplanInfo(data);
    }
    function _initEven() {

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
    //解除事件绑定
    function _release_Even() {
        $("input").unbind();
    }
    /*********************************************************************
     确定保存
     *********************************************************************/
    function _callbackother() {
        var userPlanEvent ={};
        var lasttime =$("#old_input").val();
        userPlanEvent.lastNoRptCheckDateTime = lasttime;
        userPlanEvent.noRptChecksymbol = noRpt();
        userPlanEvent.noRptCheckHour = $("#noRptCheckHour").val();
        return userPlanEvent;
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
     获取任务计划数据
     *********************************************************************/
    function _gettaskplanInfo(data) {
        if(data==null|| data == "undefine" ||data == ""){
            data = parent.setplandata();
        }else {
            data = data
        }
        if(data.userPlanEvent){
            $("#start_input").val(data.userPlanEvent.starDateTime);
            $("#end_input").val(data.userPlanEvent.overDateTime);
            $("#noRptCheckHour").val(data.userPlanEvent.noRptCheckHour);
            $("#old_input").val(data.userPlanEvent.lastNoRptCheckDateTime);
            if(data.userPlanEvent.noRptChecksymbol == "0"){
                $("#choose_no").removeClass("choose_is").addClass("choose_no");
            }else {
                $("#choose_no").removeClass("choose_no").addClass("choose_is");
            }
            _global.isplatform = data.isplatform;
        }
        //如果不是同一平台时，解除事件绑定
        if(!_global.isplatform){
            $("input").unbind().attr("readonly","ture").css("color","#898989");
            $("textarea").css("color","#898989").attr("readonly","ture");
            $("#choose_no").css({
                "pointer-events": "none",//解除事件绑定
                "opacity": "0.5"
            });
        }
    }

}(window, jQuery));
