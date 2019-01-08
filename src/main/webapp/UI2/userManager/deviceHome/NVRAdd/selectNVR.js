/**
 * Created by ywhl on 2017/6/8.
 */
$(document).ready(function() {
    selectNVRinit();
});

;(function(window,$){
    window.selectNVRinit = _init;
    window.showLocation = _showLocation;
    window.showareaname = _showareaname;


    //接收经纬度
    function _showLocation(location1){
        $("#line").val(location1.x);
        $("#column").val(location1.y);
    }
    function _init() {
        $("#cancel").click(function(){parent.parent.closePopus()});
        $("#openarea").click(function(){parent.devicePopusManager('openArea')});
        $("#choseplace").click(function () {
            setDeviceLocation()
        });

        $("#lenameCheckbox").click(function () {
            if ($(this).hasClass('isChecked')) {
                $(this).removeClass('isChecked').addClass('noChecked');
            } else {
                $(this).removeClass('noChecked').addClass('isChecked');
            }
        });
        //时间插件
        $("#installTime_input").bind('focus', function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            this.blur();
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