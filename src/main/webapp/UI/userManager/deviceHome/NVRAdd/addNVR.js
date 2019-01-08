/**
 * Created by ywhl on 2017/6/8.
 */
$(document).ready(function() {
    addNVRinit();
});

;(function(window,$){
    window.addNVRinit = _init;
    window.showLocation = _showLocation;
    window.getArea = _getArea;

    //接收经纬度
    function _showLocation(location) {
        $("#line").val(location.x);
         $("#column").val(location.y);
    }
    function _init(){
        $("#close,#cancel").click(function(){parent.closePopus();});
        $("#areaname").click(function(){_devicePopusManager('openArea')});
        $("#choseplace").click(function(){setDeviceLocation()});

        $("#lenameCheckbox").click(function() {
            if ($(this).hasClass('isChecked')) {
                $(this).removeClass('isChecked').addClass('noChecked');
            }else{
                $(this).removeClass('noChecked').addClass('isChecked');
            }
        });
        //时间插件
        $("#installTime_input").bind('focus',function () {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                isShowClear: false
            });
            //this.blur();
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
            parent.setDeviceLocation(location);
            parent.devicePopusManager("addLocation");
        }

        //弹窗开始
        function _devicePopusManager(popusPage_str) {

            switch (popusPage_str) {
                case 'openArea':
                    _open_openArea();
                    break;
                default:
                    break;
            }
        }

        //树状页面弹窗
        function _open_openArea() {
            _openPopups($('body'),'../../shebeihtml/selectarea.html' , {
                width: 360,
                height: 539
            });
        };
        //弹窗结束
    //所属区域显示
    function _getArea(areaname){
        $("#areaname").val(areaname);
    }

})(window,jQuery);