/**
 * Created by ywhl on 2017/6/7.
 */
$(document).ready(function() {
    addinit();
});

;(function(window,$){
    window.addinit = _init;
    window.showLocation = _showLocation;
    window.getArea = _getArea;

    var _global = {
        popusName:''
    };
    function _init(){
        $("#choseplace").click(function(){setDeviceLocation()});
        $("#close,#cancel").click(function(){closbutt()});

        $("#areaname").click(function(){_devicePopusManager('openArea')});
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
        parent.setDeviceLocation(location);
        parent.devicePopusManager("addLocation");
    }

    //接收经纬度
    function _showLocation(location1){
        $("#line").val(location1.x);
        $("#column").val(location1.y);
    }

    //关闭窗口
    function closbutt(){
        parent.closePopus();
    }

    //所属区域显示
    function _getArea(areaname){
            $("#areaname").val(areaname);
    }

    //弹窗开始
    function _devicePopusManager(popusPage_str) {

        switch (popusPage_str) {
           /* case 'selectDevice':
                _global.popusName = 'selectDevice';
                _open_selectDevice();
                break;*/
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

})(window,jQuery);