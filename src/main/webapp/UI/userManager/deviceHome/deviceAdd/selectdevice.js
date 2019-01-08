/**
 * Created by ywhl on 2017/6/7.
 */
$(document).ready(function() {
    selectinit();
});

;(function(window,$){
    window.selectinit = _init;
    window.showLocation = _showLocation;
    window.showareaname = _showareaname;

    function _init(){

        $("#cancel").click(function(){parent.parent.closePopus();});
        $("#choseplace").click(function(){setDeviceLocation()});
        $("#openarea").click(function(){parent.devicePopusManager('openArea')});
        $("#installTime_input").bind('focus',function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            //this.blur();
        });
        $("#lenameCheckbox").click(function() {
            if ($(this).hasClass('isChecked')) {
                $(this).removeClass('isChecked').addClass('noChecked');
            }else{
                $(this).removeClass('noChecked').addClass('isChecked');
            }
        });
    }
    //发送经纬度
    function setDeviceLocation(){
        var line = $("#line").val();
        var column = $("#column").val();
        var location = {
            "x":line,
            "y":column
        };
        parent.parent.setDeviceLocation(location);
        parent.parent.devicePopusManager("addLocation");
    }
    //接收经纬度
    function _showLocation(location1){
        $("#line").val(location1.x);
        $("#column").val(location1.y);
    }
    //显示弹窗树返回的数据
    function _showareaname(areaname){
        $("#openarea").val(areaname);
    }


})(window,jQuery);