/**
 * Created by 007 on 2017/12/15.
 */
$(document).ready(function() {
    $("#signupForm").Validform({
        tiptype : 2,
        btnSubmitId : "confirmButton",
        callback : sure
    });
    $("#signupForm").Validform({
        tiptype : 2,
        btnSubmitId : "checkDisary",
        callback : checkCBF
    });
    init();
});
;
(function(window, $) {

    window.init = _init;
    window.sure = _sure;
    window.checkCBF = _checkCBF;

    var _global = {
        popusName : "",
        aunSnmodel1 : 0,
        aunSnmodel : 0,
        aunSnmodel2 : 0,
        aunSnmodel3 : 0,
    };
    function _init() {
        _global.popusName = parent.getPopusName();
        var editjson = parent.getDataJson();
        _initLayout();
        _initEvent();
    }
    function _initLayout() {
        _global.popusName = parent.getPopusName();
        var editjson = parent.getDataJson();
        if (_global.popusName == 'addSubSystem') {
            $("#title_left").text("添加子系统");
        } else if (_global.popusName == 'editSubSystem') {
            $("#title_left").text("修改子系统");

            $("#subSysId_input").val(editjson.subSysId).attr("disable","disabled ");
            $("#subSysId_input").css({
                "pointer-events" : "none",
                "opacity" : "0.5",
                "background-color" : "#b5b5b5"
            });
            $("#subRange_input").val(editjson.subRange);
            $("#fMemo_input").val(editjson.fMemo);
            $("#disarm_input").val(editjson.bf);
            $("#confirmButton").text("确定");
            $("#checkDisary").remove();
            $("#disarm_input").css({
                "pointer-events": "none",
                "background-color": "#d9d9d9",
                "width":"224px",
                "background-image": "url('')"
                /*opacity: 0.5;,
                background-color: rgb(181, 181, 181);*/
            });

        } else {

        }
    }

    function bcfName(bcfId){        //布撤防、旁路字典表
        switch (bcfId){
            case 'BF':
                return '布防'
                break;
            case 'CF':
                return '撤防'
                break;
            case 'PL':
                return '旁路'
                break;
        }
    }

    function _initEvent() {
        $("#title_close,#cancelButton").bind("click", function() {
            parent._closePopus();
        });
        $("#checkDisary").bind("click", function() {
            _checkDisary();
        });
    }

    function sure() {
        var deviceData = parent.parent.getPopupsRowJson();
        var subSysId = $("#subSysId_input").val();//子系统ID
        var subRange = $("#subRange_input").val();//子系统范围
        var bcf = $("#disarm_input").val();//是否撤布防，增加一个旁路状态0、1、2
        var fMemo = $("#fMemo_input").val();//备注
        if( subSysId == "" || subSysId == null){
            //$("#showTip").html("子系统编号不能为空！")
            return;
        }
        if(subSysId.length==1){
            subSysId = "0" + subSysId ;
        }
        var json = {
            "devId" : deviceData.devId, // 需要拿到报警主机设备编号
            "subSysId" : subSysId,
            //"bcf" : bcf=="BF"?true:false,
            "bcf" : bcf,
            "subRange" : subRange,
            "fMemo" :fMemo
        };
        if (_global.popusName == "addSubSystem") {
            var end = post_sync(json,
                "../../../../../immSubSysOf/saveSubSys.do");
            /* alert(end.result.message); */
           // parent.parent.alertTip(end.result.message, 2000, null);
            _refsh();
            parent.parent.alertTip(end.result.message,null);
        } else if (_global.popusName == "editSubSystem") {
            var end = post_sync(json,
                "../../../../../immSubSysOf/updateSubSys.do");
            /* alert(end.result.message); */
            _refsh();
            parent.parent.alertTip(end.result.message,null);
        }

    }
    function _refsh(){

        parent.reflaceSubSystemList();

    }
    function _sure(flag) {
        if(!flag){
          return;
        }
        var subSysId=$("#subSysId_input").val();
        var flagT;
        if(subSysId.replace(/(^s*)|(s*$)/g, "").length ==0){
            flagT=false;
        }else{
            flagT=true;
        }
        if (flagT) {
            sure();
        } else {
            parent.parent.alertTip("请填写完整信息", 2000, null);
        }
    }

    function _checkDisary() {
        var deviceData = parent.parent.getPopupsRowJson();
        var devId = deviceData.devId;
        var subSysId = $("#subSysId_input").val();
        if( subSysId == "" || subSysId == null){
            //$("#showTip").html("子系统编号不能为空！")
            return;
        }
        var json = {
            "devId" : devId,
            "subSysId" : subSysId
        };
        var end = post_sync(json,"../../../../../immSubSysOf/querySbuSysBCF.do");

        if(end.code=="201"){
            parent.parent.alertTip(end.message, null, null);
            return;
        }

        $("#disarm_input").val(end.result);
    }

    function _checkCBF(){
        $("#signupForm").Validform({
            tiptype : 2,
            btnSubmitId : "checkDisary"
        });
    }

})(window, jQuery);
