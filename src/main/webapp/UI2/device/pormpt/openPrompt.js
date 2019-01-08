/**
 * Created by ywhl on 2017/7/12.
 */
$(document).ready(function() {
    openPrompt();
});
;(function(window,$,undefined){
    window.openPrompt = _init;

    function _init(){

        var showTes = showTest();

        $("#titleclose,#cancel").click(function(){
            parent.closeMapPopus();
        });

        $("#sure").click(function(){
            if(showTes=='deleList'){
                parent.deviceIframe.deleteList();           //删除列表信息
                parent.closeMapPopus();
            }else if(showTes=='qudatesure'){
                parent.mainDivIframe.showiframeBase.update();           //修改报警主机信息信息
                debugger
                parent.closePopus();//关闭修改报警主机页面
                parent.closeMapPopus();
            }
        });
    }

    function showTest(){
        var showtest = parent.getChapNode();
        $("#centertext").text(showtest.text);
        return showtest.deleList;
    }

})(window,jQuery,undefined);