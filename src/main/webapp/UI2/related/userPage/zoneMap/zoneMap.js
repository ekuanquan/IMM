//var deviceData = parent.parent.parent.parent.getPopupsRowJson();
$(document).ready(function () {
    init();
});
;(function (window, $, undefined) {
    window.init = _init;
    window.getMapPic =_getMapPic;

    var _config = {
        ajaxUrl: {
            getMapPicUrl: '/IntegratedMM/query/getMapPicByUserId.do',
            getUserZoneUrl: '/IntegratedMM/query/getUserZoneByUserId.do',
            getUserZoneIsAlarmUrl: "/IntegratedMM/query/alarmStatus.do",

            getMapPathUrl: '/IntegratedMM/getMapPicByUserIdImm.do',
            getZoneByUserIdUrl: "/IntegratedMM/getZoneByUserId.do",
            updateZoneMapPositionUrl: '/IntegratedMM/updateZoneMapPosition.do'
        }
    }

    var _global = {
        top: parent,
        userZonePojo: null,
        mouseoutEventA: null,
        jsonData:'',
        isUserZoneShow:false,
        mapPath:'',
        userId:""
    };



    function _init() {
        _initData();
    }


    function _initData() {
        _global.userId =parent.parent.getRelatedUserId();
        //_getMapPic();
    }

    function _getMapPic(){
       /* if(_global.isUserZoneShow==false){
            _global.isUserZoneShow = true;*/
            var params = _getMapPicParams();
            post_async(params, _config.ajaxUrl.getMapPicUrl, _callback_getMapPic);
       // }
    }

    function _getMapPicParams() {
        var params = {};
        params.userPojo = {};
        params.userPojo.userId = _global.userId;
        return params;
    }
    function _getUserZoneParams() {
        var params = {};
        params.userPojo = {};
        params.userPojo.userId = _global.userId;
        return params;
    }
    function _callback_getMapPic(data) {
        var result = data.result;
        if (result.code == '0') {
            var pojo = data.MappicPojo;
            if (pojo == null) {
                _showNoPicture();
                return;
            }
            _global.mapPath = pojo.mapPath;
            //var tet= "sss.jpg";
            $("#areaImage").imageView(_global.mapPath, getUserZone, _geifalseback);
            function getUserZone() {
                _getUserZone(true);
            }
        }
        else {
            _showNoPicture();
        }
    }
    function _showNoPicture(){
        $("#areaImage").addClass('NoPicture');
    }
    function _geifalseback() {
        var $div=$("<div></div>").addClass("box");
        var $div1=$("<div></div>").addClass('falsePicture');
        var $div2=$("<div></div>").addClass('div2');
        var $div3=$("<div></div>").addClass('div3');
        var $div4=$("<div></div>").addClass('div4');
        var $div5=$("<div></div>").addClass('div5');
        var $span = $("<span></span>");
        $div2.text('页面加载失败');
        $div4.text('1、网络故障，');
        $span.text('请重新加载图片').addClass("onclick").click(function () {
            $span.css('color','red');
            $("#areaImage").imageView(_global.mapPath, _removefalseback, _geifalseback);
        });
        $div5.text('2、图片丢失，请联系系统操作员到管理平台重新上传');
        $div3.append($div4);
        $div3.append($span);
        $div.append($div1);
        $div.append($div2);
        $div.append($div3);
        $div.append($div5);
        $div.appendTo("#areaImage");
        _getUserZone(false);
        function _removefalseback() {
            $div.remove();
            _getUserZone(true);
        }

    }

    function _getUserZone(isShow) {
        var params = _getUserZoneParams();
        post_async(params, _config.ajaxUrl.getUserZoneUrl, _callback_getUserZone,isShow);
    }
    function _callback_getUserZone(data,isShow) {
        var result = data.result;
        if (result.code == '0') {
            _global.userZonePojo = data.userZonePojo;
            _showZone(isShow);
        }
    }
    function _showZone(isShow) {
        _getUserZoneIsAlarm(isShow);
    }
    function _getUserZoneIsAlarm(isShow) {
        var params = _getUserZoneIsAlarmParams();
        post_async(params, _config.ajaxUrl.getUserZoneIsAlarmUrl, _callback_getUserZoneIsAlarm,isShow);
    }
    function _getUserZoneIsAlarmParams() {
        var params = {};
        params.userZonePojo = _global.userZonePojo;
        return params;
    }
    function _callback_getUserZoneIsAlarm(data,isShow) {
        var result = data.result;
        if (result.code == 0) {
            _global.userZonePojo = data.userZonePojo;
            for (var i = 0; i < _global.userZonePojo.length; i++) {
                if(isShow){
                    if (_global.userZonePojo[i].isAlert == 1) {
                        _createAlarmIcon(_global.userZonePojo[i].x, _global.userZonePojo[i].y, _global.userZonePojo[i].roleZoneName, $("#areaImage"), _global.userZonePojo[i]);
                    } else {
                        _createIcon(_global.userZonePojo[i].x, _global.userZonePojo[i].y, _global.userZonePojo[i].roleZoneName, $("#areaImage"), _global.userZonePojo[i]);
                    }
                }
            }
        }
    }
    function _createAlarmIcon(posX, posY, index, $img_center, jsonData) {
        var $imgCenter = $img_center;//$('#img_center');
        var $icon = $('<div></div>');
        var $tip = $('<span></span>');
        $imgCenter.append($icon);
        $icon.append($tip);
        $icon.addClass('alarmPic');
        $tip.text(index);
        $tip.addClass('picTip');
        var imageOriginal = $imgCenter.data('imageOriginal');
        var imageTarget = $imgCenter.data('imageTarget');
        var element = {
            width: $imgCenter.width(),
            height: $imgCenter.height()
        };
        var pointTar = _getPoint(imageOriginal, element, imageTarget, posX, posY);
        $icon.css({
            top: pointTar.top + 'px',
            left: pointTar.left + 'px'
        });
        $icon.mouseover(function (e) {
            // alert("sss");
            var positionX = e.pageX;
            var positionY = e.pageY;
            _rightKeyPopus($('body'), positionX, positionY, jsonData);
            clearTimeout(_global.mouseoutEventA);
        }).mouseout(function () {
            _global.mouseoutEventA = setTimeout(function () {
                $("#rightKey_contains").remove();
            }, 500);
        });
    }

    function _createIcon(posX, posY, index, $img_center, jsonData) {
        var $imgCenter = $img_center;//$('#img_center');
        var $icon = $('<div></div>');
        var $tip = $('<span></span>');
        $imgCenter.append($icon);
        $icon.append($tip);
        $icon.addClass('noAlarmPic');
        $tip.text(index);
        $tip.addClass('picTip');
        var imageOriginal = $imgCenter.data('imageOriginal');
        var imageTarget = $imgCenter.data('imageTarget');
        var element = {
            width: $imgCenter.width(),
            height: $imgCenter.height()
        };
        var pointTar = _getPoint(imageOriginal, element, imageTarget, posX, posY);
        $icon.css({
            top: pointTar.top + 'px',
            left: pointTar.left + 'px'
        });
        $icon.mouseover(function (e) {
            //alert("sss");
            var positionX = e.pageX;
            var positionY = e.pageY;
            _rightKeyPopus($('body'), positionX, positionY, jsonData);
            clearTimeout(_global.mouseoutEventA);
        }).mouseout(function () {
            _global.mouseoutEventA = setTimeout(function () {
                $("#rightKey_contains").remove();
            }, 500);
        });
    }

    function _getPoint(original, element, target, posX, posY) {
        var pointOrg = {
            top: 0,
            left: 0
        };
        var pointTar = {
            top: 0,
            left: 0
        };
        var bLeft = (element.width - target.width) / 2;// 1
        var bTop = (element.height - target.height) / 2;//62.5655
        pointOrg.left = original.width * posX;//265.01718528
        pointOrg.top = original.height * posY;//128.322576824
        pointTar.left = (pointOrg.left * target.width) / original.width + bLeft;//165.807562096
        pointTar.top = (pointOrg.top * target.height) / original.height + bTop;//142.366175043068
        return pointTar;
    }

    function _rightKeyPopus($body, x, y, jsonData) {
        var row_json = {};
        row_json = jsonData;
        if ($("#rightKey_contains").length > 0) {
            $("#rightKey_contains").remove();
        } else {

        }
        $div_contains = $("<div></div>");
        $div_roleZoneName = $("<div></div>");
        $div_atPos = $("<div></div>");
        $div_snType = $("<div></div>");
        $div_roleZoneName.addClass('mouseOver_item').text("用户防区编号：" + row_json.roleZoneName);
        $div_atPos.addClass('mouseOver_item').text("防区位置：" + row_json.atPos);
        $div_snType.addClass('mouseOver_item').text("探头类型：" + row_json.snType);

        $div_contains.addClass("rightKey_contains").attr('id', 'rightKey_contains')
            .append($div_roleZoneName)
            .append($div_atPos)
            .append($div_snType)
            .mouseout(function () {

                _global.mouseoutEventA = setTimeout(function () {
                    $div_contains.remove();
                }, 500);
            }).mouseover(function () {
            clearTimeout(_global.mouseoutEventA);
        });
        $body.append($div_contains);
        var bodyHeight = $("body").height();
        var bodyWidth = $("body").width();
        if ((bodyWidth - x) < 283 + 5) {
            x = x - 288;
            $div_contains.addClass('rightTrangel');
        } else {
            x += 5;
            $div_contains.addClass('leftTrangel');
        }
        if ((bodyHeight - y) < 156) {
            y = y - 155;
        } else {
            y--;
        }
        $div_contains.css({
            "top": y + 'px',
            "left": x + 'px'
        });
    }
})(window, jQuery, undefined);