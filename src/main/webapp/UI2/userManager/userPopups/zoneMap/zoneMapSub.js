//var deviceData = parent.parent.parent.parent.getPopupsRowJson();
$(document).ready(function () {
    init();
});
;(function (window, $, undefined) {
    window.init = _init;
    window.showMap = _showMap;
    window.updateDrawList = _updateDrawList;

    var _global = {
        zonePojo: [],
        submitZonePojo: [],
        rowJson: {},
        isInit:true,
        mapId:''
    };

    function _init() {
        _initData();
        _initEvent();
    }


    //向父节点获取图片和防区点位，要做
    function _initData() {
        var mapId=_getQueryVariable("mapId");
        _global.mapId = mapId;
        var url = parent.getMapSubPath(mapId);
        //var url = "http://10.0.0.222:19041/ZoneMapUpLoad/14/10000C751.BMP";
        _showMap(url,mapId,2);//默认自适应显示
    }

    function _initEvent() {
        $("#buttom_save").click(function () {
            _updateZoneMapPosition();
        });
        /*$("#testFun").click(function () {
            var draggableJson = $.fn.getDraggableJson("mapImage");
            if(console){
                console.log(JSON.stringify(draggableJson));
            }
        });*/
        $(".showbtn").click(function () {
            var type = $(this).data('type');
            var haschecked = $(this).hasClass('checked');
            if(haschecked == true){
                return;
            }
            else{
                $('.showbtn.checked').removeClass('checked');
                $(this).addClass('checked');
                //清理元素，重新开始
                $('#mapImage').html("").attr('style','');
                $('#mapContainer').attr('style','');
                var mapId = _global.mapId;
                var url = parent.getMapSubPath(mapId);
                _showMap(url,mapId,type);
            }

        });
    }

    function _showBack(imageUrl,type, onloadCallBack) {
        showBackUrl({//四个参数必须
            wrapperId: "mapImage",//防区图div id
            bianbianId: "mapBorder",//防区图边框div id
            kuangkuangId: "mapContainer",//防区图外框div id
            imageUrl: imageUrl,//图片url
            type:type
        }, onloadCallBack)
    }

    /*  var submitZonePojo=[
     {
     roleZoneName:'0000',
     x:0,
     y:0
     }
     ];*/

    function _ok(data) {
        var submitZonePojo = {
            x: data.x,
            y: data.y,
            roleZoneName: data.roleZoneName,
            devZoneId: data.devZoneId,
            id: data.id,
            mapId: _global.mapId
        }
        parent.addDraw(submitZonePojo);
    }

    function _del(data) {
        var submitZonePojo = {
            x: 0,
            y: 0,
            roleZoneName: data.roleZoneName,
            devZoneId: data.devZoneId,
            mapId: ''
        }
        parent.delDraw(submitZonePojo);
    }

    function _move(data) {
        var submitZonePojo = {
            x: data.x,
            y: data.y,
            roleZoneName: data.roleZoneName,
            devZoneId: data.devZoneId,
            mapId: _global.mapId
        }
        parent.moveDraw(submitZonePojo);
    }



    function _showMap(mapPath,mapId,type) {
        if(mapPath != ''){
            //_showBack(mapPath,type, _onloadCallback);
            _global.backgroundIcon = mapPath;
            _global.mapId = mapId;
            _onloadCallback();
        }
        else {
            $("#mapContainer").addClass("falsePicture");
        }
    }

//向父节点获取数据
    function _onloadCallback(data) {
        var data = parent.getZonePojo();
        //var data = [{"almType":"","almTypeName":"","atPos":"厅东南","devId":"10000C751","devZoneId":"0001","fMemo":"","instDate":"","mapId":"10000C751","roleZoneName":"0001","snModeId":126,"snModelName":"MX-40","snNum":1,"snType":"双鉴","snTypeName":"","wantDo":"","x":0.6897637844085693,"y":0.09848485141992569},{"almType":"","almTypeName":"","atPos":"厅北墙","devId":"10000C751","devZoneId":"0002","fMemo":"","instDate":"","mapId":"10000C751","roleZoneName":"0002","snModeId":126,"snModelName":"MX-40","snNum":1,"snType":"双鉴","snTypeName":"","wantDo":"","x":0.28185907006263733,"y":0.2572115361690521},{"almType":"","almTypeName":"","atPos":"室仓库西北","devId":"10000C751","devZoneId":"0003","fMemo":"","instDate":"","mapId":"10000C751","roleZoneName":"0003","snModeId":126,"snModelName":"MX-40","snNum":1,"snType":"双鉴","snTypeName":"","wantDo":"","x":0.6078740358352661,"y":0.8030303120613098},{"almType":"","almTypeName":"","atPos":"厨房西墙","devId":"10000C751","devZoneId":"0004","fMemo":"","instDate":"","mapId":"10000C751","roleZoneName":"0004","snModeId":126,"snModelName":"MX-40","snNum":1,"snType":"双鉴","snTypeName":"","wantDo":"","x":0.19212599098682404,"y":0.8308081030845642},{"almType":"","almTypeName":"","atPos":"网络机房西墙","devId":"10000C751","devZoneId":"0005","fMemo":"","instDate":"","mapId":"10000C751","roleZoneName":"0005","snModeId":126,"snModelName":"MX-40","snNum":1,"snType":"双鉴","snTypeName":"","wantDo":"","x":0.18582677841186523,"y":0.9267676472663879},{"almType":"","almTypeName":"","atPos":"加钞室西墙","devId":"10000C751","devZoneId":"0006","fMemo":"","instDate":"","mapId":"10000C751","roleZoneName":"0006","snModeId":126,"snModelName":"MX-40","snNum":1,"snType":"双鉴","snTypeName":"","wantDo":"","x":0.05354330688714981,"y":0.4545454680919647},{"almType":"","almTypeName":"","atPos":"南侧ATM上下","devId":"10000C751","devZoneId":"0007","fMemo":"","instDate":"","mapId":"10000C751","roleZoneName":"0007","snModeId":97,"snModelName":"SS-102","snNum":2,"snType":"振动","snTypeName":"","wantDo":"","x":0.18897637724876404,"y":0.2904040515422821},{"almType":"","almTypeName":"","atPos":"中间ATM上下","devId":"10000C751","devZoneId":"0008","fMemo":"","instDate":"","mapId":"10000C751","roleZoneName":"0008","snModeId":97,"snModelName":"SS-102","snNum":2,"snType":"振动","snTypeName":"","wantDo":"","x":0.11023622006177902,"y":0.30050504207611084},{"almType":"","almTypeName":"","atPos":"二楼梯口","devId":"10000C751","devZoneId":"0009","fMemo":"","instDate":"","mapId":"","roleZoneName":"0009","snModeId":126,"snModelName":"MX-40","snNum":1,"snType":"双鉴","snTypeName":"","wantDo":"","x":0,"y":0},{"almType":"","almTypeName":"","atPos":"二楼客户经理1南","devId":"10000C751","devZoneId":"0010","fMemo":"","instDate":"","mapId":"","roleZoneName":"0010","snModeId":126,"snModelName":"MX-40","snNum":1,"snType":"双鉴","snTypeName":"","wantDo":"","x":0,"y":0},{"almType":"","almTypeName":"","atPos":"二楼厅北墙东侧","devId":"10000C751","devZoneId":"0011","fMemo":"","instDate":"","mapId":"","roleZoneName":"0011","snModeId":126,"snModelName":"MX-40","snNum":1,"snType":"双鉴","snTypeName":"","wantDo":"","x":0,"y":0},{"almType":"","almTypeName":"","atPos":"二楼营业室南墙","devId":"10000C751","devZoneId":"0012","fMemo":"","instDate":"","mapId":"","roleZoneName":"0012","snModeId":126,"snModelName":"MX-40","snNum":1,"snType":"双鉴","snTypeName":"","wantDo":"","x":0,"y":0},{"almType":"","almTypeName":"","atPos":"第一，三柜台下","devId":"10000C751","devZoneId":"0013","fMemo":"","instDate":"","mapId":"10000C751","roleZoneName":"0013","snModeId":187,"snModelName":"EB27","snNum":2,"snType":"紧急按钮","snTypeName":"","wantDo":"","x":0.3879699110984802,"y":0.6072289347648621},{"almType":"","almTypeName":"","atPos":"二楼营业室柜台按键","devId":"10000C751","devZoneId":"0014","fMemo":"","instDate":"","mapId":"","roleZoneName":"0014","snModeId":187,"snModelName":"EB27","snNum":2,"snType":"紧急按钮","snTypeName":"","wantDo":"","x":0,"y":0},{"almType":"","almTypeName":"","atPos":"主机箱内","devId":"10000C751","devZoneId":"0015","fMemo":"","instDate":"","mapId":"10000C751","roleZoneName":"0015","snModeId":148,"snModelName":"主机防拆","snNum":1,"snType":"防拆","snTypeName":"","wantDo":"","x":0.21259842813014984,"y":0.5757575631141663},{"almType":"","almTypeName":"","atPos":"加钞室按键","devId":"10000C751","devZoneId":"0017","fMemo":"","instDate":"","mapId":"10000C751","roleZoneName":"0017","snModeId":187,"snModelName":"EB27","snNum":1,"snType":"紧急按钮","snTypeName":"","wantDo":"","x":0.17480315268039703,"y":0.4747474789619446},{"almType":"","almTypeName":"","atPos":"一楼营业室南墙","devId":"10000C751","devZoneId":"0019","fMemo":"","instDate":"","mapId":"10000C751","roleZoneName":"0019","snModeId":126,"snModelName":"MX-40","snNum":1,"snType":"双鉴","snTypeName":"","wantDo":"","x":0.5685039162635803,"y":0.6843434572219849},{"almType":"","almTypeName":"","atPos":"第二柜台下","devId":"10000C751","devZoneId":"0029","fMemo":"","instDate":"","mapId":"10000C751","roleZoneName":"0029","snModeId":187,"snModelName":"EB27","snNum":1,"snType":"紧急按钮","snTypeName":"","wantDo":"","x":0.4330826997756958,"y":0.6120482087135315}];
        if (data) {
            _getZoneByUserId(data);
        } else {

        }
    }

    function _getZoneByUserId(zonePojo) {
         _global.zonePojo = zonePojo;
        if(_global.isInit){
            _clearALLimg();
            _addList();
             _global.isInit=false;
        }else{
             _clearALLimg();
             _addList1();
         }
    }

    function _clearALLimg() {
        clearImage({
            addbtnId: "addZone",//添加按钮id
            wrapperId: "mapImage",//防区图div id
            clearCallBack: _clearArr
        });
    }
    function _clearArr(jsonArr) {
        $("#dataDiv").text("被清除的数据"+JSON.stringify(jsonArr));
    }
    function _addList() {
        userAreaImage({
            addbtnId: "addZone",//添加按钮id
            kuangkuangId: "mapContainer",//防区图外框div id
            bianbianId: "mapBorder",//防区图边框div id
            wrapperId: "mapImage",//防区图div id
            src: 'img/zone.jpg',//图标图片
            jsonSelect: _global.zonePojo,//下拉框数据json
            DragDownCallBack: _move,
            OKCallBack: _ok,
            delCallBack: _del,
            addBeforeCallBack:_addBeforeCallBack,
            mapId: _global.mapId
        });
        $.fn.addiconList({
            iconId:"draggable" + _global.mapId + '_',
            addbtnId: "addZone",//添加按钮id
            kuangkuangId: "mapContainer",//防区图外框div id
            bianbianId: "mapBorder",//防区图边框div id
            wrapperId: "mapImage",//防区图div id
            src: 'img/zone.jpg',//图标图片,
            containerId:"mapContainer",
            jsonSelect: _global.zonePojo,//下拉框数据json
            dataList: _global.zonePojo,
            DragDownCallBack: _move,
            delCallBack: _del,
            mapId: _global.mapId,
            minZoom:0.4,
            maxZoom:3,
            zoomSize:0.05,
            backgroundIcon:_global.backgroundIcon
        });
        var draggableJson = $.fn.getDraggableJson("mapImage");
        parent.intiDrawAfter(draggableJson);
    }

    function _addList1() {
        $.fn.addiconList({
            addbtnId: "addZone",//添加按钮id
            kuangkuangId: "mapContainer",//防区图外框div id
            bianbianId: "mapBorder",//防区图边框div id
            wrapperId: "mapImage",//防区图div id
            src: 'img/zone.jpg',//图标图片
            containerId:"mapContainer",
            jsonSelect: _global.zonePojo,//下拉框数据json
            dataList: _global.zonePojo,
            DragDownCallBack: _move,
            delCallBack: _del,
            mapId: _global.mapId,
            minZoom:0.4,
            maxZoom:3,
            zoomSize:0.05,
            backgroundIcon:_global.backgroundIcon
        });
        var draggableJson = $.fn.getDraggableJson("mapImage");
        parent.intiDrawAfter(draggableJson);
    }
    var submitZonePojo = [
        {
            roleZoneName: '0000',
            x: 0,
            y: 0
        }
    ];

    function _getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
    }

    function _addBeforeCallBack(){
        if(console){console.log('_addBeforeCallBack in');}
    }

    function _updateDrawList(drawPojoList){
        $.fn.setDraggableJson("mapImage",drawPojoList);
    }


})(window, jQuery, undefined);