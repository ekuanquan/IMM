/**
 * Created by ywhl on 2017/6/6.
 */
//默认areaType为目录
var areaType = 1;

$(document).ready(function() {
    $(".registerform").Validform({
        tiptype:2,
        btnSubmitId:"save",
        callback:sure
    });
    init();
});

;
(function(window, $) {
    window.init = _init;
    window.sure=_sure;
    window.setGbId=_setGbId;

    var _global={
        rowJson:{}
    }
    function _init() {
        parent.parent._setTitle2("添加配置分中心");
        _showplatform();
        $("#cancel").click(function() {
            close()
        });

        /*$("#gbId").click(function() {
            openGBPopus("../../../resource/gbId/gbId.html",{width:360,height:208});
        });*/
    }
    function _sure(flag){
        if(flag){
            if(_global.rowJson==null){
                var param_json = {
                    platform_id : $("#ID").val(),
                    platform_name: $("#name").val(),
                    platform_host: $("#host").val(),
                    gbId: $("#gbId").val(),
                    memo: $("#memo").val(),
                };
                post_async(param_json, '/IntegratedMM/assemble_cfg/add.do', _callBack);
            }else {
                var param_json = {
                    id : _global.rowJson.id,
                    platform_id : $("#ID").val(),
                    platform_name: $("#name").val(),
                    platform_host: $("#host").val(),
                    gbId: $("#gbId").val(),
                    memo: $("#memo").val(),
                };
                post_async(param_json, '/IntegratedMM/assemble_cfg/update.do', _callBack);
            }
        }else{
            //alert("验证不通过");
            parent.parent.alertWarn("请填写完整信息",2000,null);
        }
    }
    function _callBack(data) {
        if (data.code == "200") {
            if(parent.systemSetting.dataUpSetIframe&&parent.systemSetting.dataUpSetIframe.getList&&(typeof (parent.systemSetting.dataUpSetIframe.getList)=='function')) {
                parent.systemSetting.dataUpSetIframe.getList();
            }
            parent.alertTip(data.message,2000,null);
            close();

        } else {
            parent.alertTip(data.message,2000,null);
        }
    }
    // �رմ���
    function close() {
        parent._closePopus2();
    }
    function _showplatform() {
        if(parent.systemSetting.dataUpSetIframe&&parent.systemSetting.dataUpSetIframe.getRowJson&&(typeof (parent.systemSetting.dataUpSetIframe.getRowJson)=='function')) {
            _global.rowJson=parent.systemSetting.dataUpSetIframe.getRowJson();
            if(_global.rowJson!=null) {
                parent.parent._setTitle2("修改配置分中心");
                $("#ID").val(_global.rowJson.platform_id);
                $("#ID").attr("readOnly","readOnly").addClass("shower")
                $("#name").val(_global.rowJson.platform_name);
                $("#host").val(_global.rowJson.platform_host);
                $("#gbId").val(_global.rowJson.gbId);
                $("#memo").val(_global.rowJson.memo);
            }
        }
    }
    function _setGbId(gbId) {
        $("#gbId").val(gbId)
    }
})(window, jQuery);
