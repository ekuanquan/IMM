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
                parent.deviceIframe.deleteList();           //ɾ���б���Ϣ
                parent.closeMapPopus();
            }else if(showTes=='qudatesure'){
                parent.mainDivIframe.showiframeBase.update();           //�޸ı���������Ϣ��Ϣ
                debugger
                parent.closePopus();//�ر��޸ı�������ҳ��
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