/**
 * Created by 123 on 2017/8/17.
 */
charset = "utf-8";

var rowdata = parent.parent.parent.getsystemCodeJson();
$(document).ready(function () {
    $("#form").Validform({
        tiptype:2,
        btnSubmitId:"sure",
        callback:sure
    });
    init();
});
;(function(window, $) {
    window.init =_init;
    window.sure = _sure;

    var _config = {
        ajaxUrl: {
            type: "POST",
            async: false,
            findSysCodeByCodeIdUrl: '/IntegratedMM/sysCode/findSysCodeByCodeId.do',
            queryEventclassUrl: '/IntegratedMM/UpdateDdviceCtrl/queryEventclass.do',
            getCodeTypeIdUrl:'/IntegratedMM/getCodeTypeId.do',
            updateSysCodeByCodeIdUrl:'/IntegratedMM/sysCode/updateSysCodeByCodeId.do',
            addUrl:"/IntegratedMM/syscode/add.do"
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
            userZone: "防区",//用户/防区
            er_Color:"颜色",
            er_Wave:"声音",
            dealWay:"",
            codeLevel:0//时间级别
        },
        popusName:"",    //修改和添加的判断字符
        data:""         //存储该系统码的数据

    };

    /*********************************************
     初始化
     *********************************************/
    function _init() {
        _initData();
        _initEven();
    }
    function _initData() {
        //获取判断修改和添加的字符串
        _global.popusName = parent.parent.getPopusName();
        if(_global.popusName == "updatesysCode"){
            $(".title_top").text("修改系统码");
            //点击加载事件归类下拉数据
            $("#evtWayName").one("click",function () {
                post_async(null,_config.ajaxUrl.queryEventclassUrl,_callback_evtWayName);
            });
            //点击加载事件类型下拉数据
            ($("#codeType")).one("click",function () {
                post_async(null,_config.ajaxUrl.getCodeTypeIdUrl,_callback_CodeTypeId);
            });
            _getsysCodeInfo();
        }
        if(_global.popusName == "addsysCode"){
            $(".title_top").text("添加系统码");
            $("#codeId").removeAttr("disabled");
            post_async(null,_config.ajaxUrl.queryEventclassUrl,_callback_evtWayName);
            post_async(null,_config.ajaxUrl.getCodeTypeIdUrl,_callback_CodeTypeId);
        }


    }
    function _initEven() {
         //关闭窗口点击事件
        $("#close,#remove").click(function () {
            parent.parent.closePopus();
        });
        /*********************************************************************
         用户/防区选择点击事件
         *********************************************************************/
        $("#userZone li").click(function () {
            $(this).siblings("li").removeClass('ul_imgfull').addClass('ul_imgnull');
            $(this).removeClass('ul_imgnull').addClass("ul_imgfull");
        });
        /*********************************************************************
         复选框的点击事件
         *********************************************************************/
        $("#Check1,#Check2").bind("click",function () {
            $(this).toggleClass("isChecked");
        })
    }
    /************************************************
     获取事件归类下拉数据222
     ************************************************/
    function _callback_evtWayName(data) {
        for (var i = 0;i<data.json.length;i++){
            if(data.json[i].evtWatName != "未定" && data.json[i].impotWat != '-1'){
                if(_global.popusName == "updatesysCode") {
                    if (_global.data.sysCodePojo.evtWay == data.json[i].evtWat) {
                        continue;
                    }
                }
                var $option = $("<option></option>");
                $option.attr('value',data.json[i].evtWat);
                $option.text(data.json[i].evtWatName);
                $option.appendTo($("#evtWayName"));
            }
        }
    }
    /************************************************
     获取事件类型下拉数据222
     ************************************************/
    function _callback_CodeTypeId(data) {
        for (var i = 0;i<data.codeType.length;i++){
            if(_global.popusName == "updatesysCode"){
                if(_global.data.sysCodePojo.codeTypeId == data.codeType[i].codeTypeId){continue;}
            }
            var $option = $("<option></option>");
            $option.attr('value',data.codeType[i].codeTypeId);
            $option.text(data.codeType[i].codeType);
            $option.appendTo($("#codeType"));
        }
    }
    function _getsysCodeInfo() {
        var params = rowdata.codeId;
        var para = {"codeId":params};
        post_async(para,_config.ajaxUrl.findSysCodeByCodeIdUrl,_callback_CodeByCodeId);
    }
    function _callback_CodeByCodeId(data) {
        var result=data.result;
        _global.data=data;
        if(result.code == "200"){
            $("#codeId").val(data.sysCodePojo.codeId);
            //$("#evtWayName").val(data.sysCodePojo.evtWay);
            var evtWayName = data.sysCodePojo.evtWayName;
            if(evtWayName == undefined||evtWayName == null||evtWayName=="undefined"){evtWayName=""}
            $("#evtWayName").append("<option value="+data.sysCodePojo.evtWay+">"+evtWayName+"</option>");
            //$("#codeType").val(data.sysCodePojo.codeTypeId);
            var codeType = data.sysCodePojo.codeType;
            if(codeType == undefined||codeType == null||codeType=="undefined"){codeType=""}
            $("#codeType").append("<option value="+data.sysCodePojo.codeTypeId+">"+codeType+"</option>");
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
        if(_global.popusName =="updatesysCode"){
            post_async(params,_config.ajaxUrl.updateSysCodeByCodeIdUrl,_callbackupdate);
        }
        if(_global.popusName =="addsysCode"){
            var param = params.sysCodePojo;
            post_async(param,_config.ajaxUrl.addUrl,_callbackadd);
        }

    }

    /******************************************
     修改数据的回调函数
     *******************************************/
    function _callbackupdate(data) {
        var result = data.result;
        if(result.code == '200'){
            //alert("保存成功");
            parent.parent.alertTip("修改成功",2000,_syscodelist);
        }
        else {
            parent.parent.alertTip("修改失败",2000,null);
        }
    }
    /******************************************
     添加数据保存的回调函数
     *******************************************/
    function _callbackadd(data) {
        if(data.code == '200'){
            //alert("保存成功");
            parent.parent.alertTip("保存成功",2000,_syscodelist);
        }
        else {
            parent.parent.alertTip("保存失败",2000,null);
        }
    }
    /******************************************
     刷新系统码列表
     *******************************************/
    function _syscodelist() {
        parent.parent.addsyscode();
        parent.parent.closePopus();
    }
    /******************************************
     点击保存验证
     *******************************************/
    function _sure(flag){
        if(flag){
            getAmendsyscodeInfo();
        }else{
            //alert("验证不通过");
            _global.top.alertWarn("请填写完整信息",2000,null);
        }
    }

}(window, jQuery));
