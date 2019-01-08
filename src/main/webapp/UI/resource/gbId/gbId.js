/**
 * Created by ywhl on 2017/6/6.
 */


$(document).ready(function(){
    init();
});

;(function(window,$){
    window.init = _init;

    function _init(){
        $("#parentId").focus();
        $(".close,#cancel").click(function(){close()});

        $(".buttsure").click(function(){
            var baseCode = $("#baseCode").val();
            var type = $("#type").val();
            var parentId = $("#parentId").val();
            var count = $("#count").val();

            var params = {
                baseCode: baseCode,
                industryCode: "00",
                netType: "1",
                type: type,
                parentId: parentId,
                count: 1
            };

            post_async(params,"/IntegratedMM/generateDeviceId.do",_submitCallback);
        });
    }
    function _submitCallback(data) {
        if(data.code=="200"){
            if(data.result.length>0){
                //return data.result[i];
                parent.setGbId(data.result[0]);
                close();
            }
            else{
                if(typeof parent.parent.alertFail=='function') {
                    parent.parent.alertFail("参数填写错误，未生成国标Id！", 2000, null);
                }
                else if(typeof parent.parent.parent.alertFail=='function') {
                    parent.parent.parent.alertFail("参数填写错误，未生成国标Id！", 2000, null);
                }
                else if(typeof parent.parent.parent.parent.alertFail=='function') {
                    parent.parent.parent.parent.alertFail("参数填写错误，未生成国标Id！", 2000, null);
                }
            }
        }
        else{
            if(typeof parent.parent.alertFail=='function') {
                parent.parent.alertFail(data.msg, 2000, null);
            }
            else if(typeof parent.parent.parent.alertTip=='function') {
                parent.parent.parent.alertFail(data.msg, 2000, null);
            }
            else if(typeof parent.parent.parent.parent.alertTip=='function') {
                parent.parent.parent.parent.alertFail(data.msg, 2000, null);
            }
        }
    }
    function close(){
        parent.closeGBPopus();
    }
})(window,jQuery);
