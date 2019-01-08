$(document).ready(function () {
    init();
});
;(function (window, $) {
    window.init = _init;

    var _global = {
        //picaddress:["./img/pic5.jpg","./img/pic5.jpg","./img/pic6.jpg","./img/pic.jpg","./img/pic4.jpg","./img/pic5.jpg","./img/pic5.jpg","./img/pic6.jpg","./img/pic.jpg","./img/pic4.jpg","./img/pic5.jpg","./img/pic5.jpg","./img/pic6.jpg","./img/pic.jpg","./img/pic4.jpg","./img/pic5.jpg","./img/pic5.jpg","./img/pic6.jpg","./img/pic.jpg","./img/pic4.jpg","./img/pic5.jpg","./img/pic5.jpg","./img/pic6.jpg","./img/pic.jpg","./img/pic4.jpg","./img/pic5.jpg","./img/pic5.jpg","./img/pic6.jpg","./img/pic.jpg","./img/pic4.jpg"],
        picaddress:[],
        picName:[]

    };

    function _init() {
        _initData();
        _initEvent();
    }
    //数据
    function _initData() {
        parent.parent._setTitle2("图片查看");
        var monad = parent.parent.getDisposalAlarmNum();
        getPictureListByDisposalAlarmNum (monad);
    }
    //事件
    function _initEvent() {
        //上一张
        $("#Forward").bind("click",function () {
            for(var i=0;i<_global.picaddress.length;i++){
                if($("ul").find("li").eq(i).hasClass("tab_ischecked")){
                    if(i == 0){
                        i=_global.picaddress.length;
                    }
                    $("#areaImage").imageView(_global.picaddress[i-1], suc, fail).attr("title",$("ul").find("li").eq(i-1).text());
                    $("ul").find("li").eq(i-1).removeClass('tab_noChecked').addClass('tab_ischecked').siblings().removeClass('tab_ischecked').addClass('tab_noChecked');
                    break;
                }
            }


        });
        //下一张
        $("#Backoff").bind("click",function () {
            for(var i=0;i<_global.picaddress.length;i++){
                if($("ul").find("li").eq(i).hasClass("tab_ischecked")){
                    if(i == _global.picaddress.length-1){
                        i=-1;
                    }
                    $("#areaImage").imageView(_global.picaddress[i+1], suc, fail).attr("title",$("ul").find("li").eq(i+1).text());
                    $("ul").find("li").eq(i+1).removeClass('tab_noChecked').addClass('tab_ischecked').siblings().removeClass('tab_ischecked').addClass('tab_noChecked');
                    break;
                }
            }
        })
        //鼠标进入显示文字
        $("#areaImage").mouseenter(function(){
            $("#Forward").addClass("Forward");
            $("#Backoff").addClass("Backoff");
        });
        $("#areaImage").mouseleave(function(){
            $("#Forward").removeClass("Forward");
            $("#Backoff").removeClass("Backoff");
        });

    }

    function suc() {
        $("#areaImage").removeClass('NoPicture')
    }
    function fail() {
        $("#areaImage").addClass('NoPicture')
    }

    function getPictureListByDisposalAlarmNum (monad){
        var params = {"disposalAlarmNum":monad};
        var url = "/IntegratedMM/query/getPictureListByDisposalAlarmNum.do";
        post_async(params, url,callback_getPictureList);

        function callback_getPictureList(data) {
            if(data.code==1000){
                var result = data.result;
                for(var i=0;i<result.length;i++){
                    _global.picaddress[i]=result[i].picUrl;
                    _global.picName[i]=result[i].picName;
                }
                showList();
            }

        }

    }

    function showList(){
        for(var i=0;i<_global.picName.length;i++){
            $("ul").append( "<li title="+_global.picName[i]+">" + "<span>" + (i+1) +"</span>" + _global.picName[i] +"</li>");
            $("ul li").addClass("picname");
            $("ul li span").addClass("titnum");
        }
        $(".picname").bind("click",function (e) {
            $(this).removeClass('tab_noChecked').addClass('tab_ischecked');
            $(this).siblings().removeClass('tab_ischecked').addClass('tab_noChecked');
            for(var i=0;i<_global.picaddress.length;i++){
                if($("ul").find("li").eq(i).hasClass("tab_ischecked")){
                    $("#areaImage").imageView(_global.picaddress[i], suc, fail).attr("title",_global.picName[i]);
                    break;
                }
            }

        });
        _initData2();
        $("ul").find("li").eq(0).click();
    }
    function _initData2() {
        //名称总条数
        var length;
        if(_global.picaddress.length==0||_global.picaddress.length == null){
            length = 0;
        }
        else {
            length = _global.picaddress.length;
        }
        $("#pictrue").text("图片名称(总数："+length+"张)");
    }

})(window, jQuery);












