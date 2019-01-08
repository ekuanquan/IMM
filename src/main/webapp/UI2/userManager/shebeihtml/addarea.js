/**
 * Created by ywhl on 2017/6/6.
 */


$(document).ready(function(){
    adddeviceinit();
});

;(function(window,$){
    window.adddeviceinit = _init;
    window.showArea = _showArea;

    function _init(){
         $(".close,#cancel").click(function(){close()});

         $(".line .radio").click(function(){
         $('.checked').removeClass('checked');
         $(this).addClass('checked');
         });

        $("#areaname").click(function(){parent.devicePopusManager('selectArea')});

    }
    //关闭窗口
    function close(){
        parent.closePopus();
    }
    //显示树返回的数据
    function _showArea(areaname){
        $("#areaname").val(areaname);
    }


})(window,jQuery);
