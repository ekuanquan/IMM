/**
 * Created by ywhl on 2017/6/6.
 */
/*
function close(){
    parent.closePopus();
}

$(document).ready(function(){
    $(".close").click(function(){close()});
});*/

$(document).ready(function(){
    alterdeviceinit();
});

;(function(window,$){
    window.alterdeviceinit = _init;
    window.showArea = _showArea;

    function _init(){
        $(".close,#cancel").click(function(){close()});

        $(".line .radio").click(function(){
            $('.checked').removeClass('checked');
            $(this).addClass('checked');
        });

        $("#areaname").click(function(){parent.devicePopusManager('selectArea')});

    }
    //�رմ���
    function close(){
        parent.closePopus();
    }
    //��ʾ�����ص�����
    function _showArea(areaname){
        $("#areaname").val(areaname);
    }


})(window,jQuery);