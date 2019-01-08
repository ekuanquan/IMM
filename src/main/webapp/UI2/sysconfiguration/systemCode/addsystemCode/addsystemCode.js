/**
 * Created by 123 on 2017/8/17.
 */
charset = "utf-8";

var rowdata = parent.parent.parent.getsystemCodeJson();
$(document).ready(function () {
    init();
});
;(function(window, $) {
    window.init =_init;

    var _config = {
        ajaxUrl: {
            type: "POST",
            async: false,
            findSysCodeByCodeIdUrl: '/IntegratedMM/sysCode/findSysCodeByCodeId.do',
            queryEventclassUrl: '/IntegratedMM/UpdateDdviceCtrl/queryEventclass.do',
            getCodeTypeIdUrl:'/IntegratedMM/getCodeTypeId.do',
            updateSysCodeByCodeIdUrl:'/IntegratedMM/sysCode/updateSysCodeByCodeId.do'
        }
    };
    _global = {
        plugins: {
            page: null
        },
        rowdata:'',
        sysCodePojo: {
            codeId: "100",//系统码编号，必填
            codeMemo: "防区个人救护警报",//系统码事件描述
            codeTypeId: 1,// 事件类型编号
            e_tail: "",//报警描述
            evtWay: 1,// 事件归类
            r_tail: "恢复",//恢复描述
            userZone: "防区"//用户/防区
        }

    };

    /*********************************************
     初始化
     *********************************************/
    function _init() {
        _initData();
        _initEven();
        getsysCodeInfo();
    }
    function _initData() {
       // _global.rowdata = parent.parent.getsystemCodeJson;
        /*********************************************************************
         后台获取下拉框信息
         *********************************************************************/
        post_async(null,_config.ajaxUrl.queryEventclassUrl,_callback_evtWayName);
        post_async(null,_config.ajaxUrl.getCodeTypeIdUrl,_callback_CodeTypeId);

    }
    function _initEven() {
        /*********************************************************************
         关闭窗口点击事件
         *********************************************************************/
        $("#close,#remove").click(function () {
            parent.parent.closePopus();
        });
       /* $("#evtWayName").click(function () {
            post_async(null,_global.ajaxUrl.queryEventclassUrl,_callback_evtWayName);

        })*/
        /*********************************************************************
         保存点击事件
         *********************************************************************/
        $("#sure").click(function () {
            getAmendsyscodeInfo();
        });
        /*********************************************************************
         用户/防区选择点击事件
         *********************************************************************/
        $("#userZone li").click(function () {
            $(this).siblings("li").removeClass('ul_imgfull').addClass('ul_imgnull');
            $(this).removeClass('ul_imgnull').addClass("ul_imgfull");
        });

    }
    /************************************************
     获取事件归类下拉数据222
     ************************************************/
    function _callback_evtWayName(data) {
        var $option = $("<option></option>");

        for (var i = 0;i<data.json.length;i++){
            var $option = $("<option></option>");
            if(data.json[i].evtWatName != "未定" && data.json[i].impotWat != '-1'){
                $option.attr('value',data.json[i].evtWat);
                $option.text(data.json[i].evtWatName);
                $option.appendTo($("#evtWayName"));
            }

        }
    }
    /************************************************
     获取事件归类下拉数据222
     ************************************************/
    function _callback_CodeTypeId(data) {
        var $option = $("<option></option>");

        for (var i = 0;i<data.codeType.length;i++){
            var $option = $("<option></option>");
            $option.attr('value',data.codeType[i].codeTypeId);
            $option.text(data.codeType[i].codeType);
            $option.appendTo($("#codeType"));
        }
    }
    function getsysCodeInfo(data) {
       // data = _global.rowdata;
        var params = rowdata.codeId;
        var para = {"codeId":params};
        post_async(para,_config.ajaxUrl.findSysCodeByCodeIdUrl,_callback_CodeByCodeId);
    }
    function _callback_CodeByCodeId(data) {
        var result=data.result;
        if(result.code == "200"){
            $("#codeId").val(data.sysCodePojo.codeId);
            $("#evtWayName").val(data.sysCodePojo.evtWay);
            $("#codeType").val(data.sysCodePojo.codeTypeId);
            $("#codeMemo").val(data.sysCodePojo.codeMemo);
            $("#e_tail").val(data.sysCodePojo.e_tail);
            $("#r_tail").val(data.sysCodePojo.r_tail);
            if(data.sysCodePojo.userZone == "用户"){
                $("#userZone li:nth-child(1)").removeClass("ul_imgnull").addClass("ul_imgfull");
            }
            else if(data.sysCodePojo.userZone == "防区"){
                $("#userZone li:nth-child(2)").removeClass("ul_imgnull").addClass("ul_imgfull");
            }
            else if(data.sysCodePojo.userZone == "通道"){
                $("#userZone li:nth-child(3)").removeClass("ul_imgnull").addClass("ul_imgfull");
            }
            else {
                $("#userZone li:nth-child(4)").removeClass("ul_imgnull").addClass("ul_imgfull");
            }
        }

    }
    /************************************************
     获取页面数据222
     ************************************************/
    function getAmendsyscodeInfo() {
        var params = {};
        var sysCodePojo = {};
        params.sysCodePojo = _global.sysCodePojo;
        params.sysCodePojo.codeId=$("#codeId").val();
        params.sysCodePojo.codeMemo=$("#codeMemo").val();
        params.sysCodePojo.codeTypeId=$("#codeType").val();
        params.sysCodePojo.e_tail=$("#e_tail").val();
        params.sysCodePojo.evtWay=$("#evtWayName").val();
        params.sysCodePojo.r_tail=$("#r_tail").val();
        //params.userZone=$("#userZone").val();
        var tmp='';
        var num='';
        for(var i=1;i<=4;i++){
            if($("#userZone li:nth-child("+i+")").hasClass("ul_imgfull")){
                num = i;
                break;
            }
        }
        switch (num){
            case 1:
                tmp = "用户";
                break;
            case 2:
                tmp = "防区";
                break;
            case 3:
                tmp = "通道";
                break;
            case 4:
                tmp = "无";
                break;
            default :
                break;
        }
        params.sysCodePojo.userZone = tmp;
        post_async(params,_config.ajaxUrl.updateSysCodeByCodeIdUrl,callbackupdate);

    }
    /******************************************
     保存数据的回调函数
     *******************************************/
    function callbackupdate(data) {
        var result = data.result;
        if(result.code == '200'){
            //alert("保存成功");
            parent.parent.alertTip("保存成功",2000,syscodelist);
        }
        else {
            parent.parent.alertTip("保存失败",2000,null);
        }
    }
    /******************************************
     刷新系统码列表
     *******************************************/
    function syscodelist() {
        parent.parent.addsyscode();
        parent.parent.closePopus();
    }

}(window, jQuery))
