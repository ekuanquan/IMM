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
    //�رմ���
    function close(){
        parent.closePopus();
    }
    //��ʾ�����ص�����
    function _showArea(areaname){
        $("#areaname").val(areaname);
    }


})(window,jQuery);
