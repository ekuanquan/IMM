//var deviceData = parent.parent.parent.parent.getPopupsRowJson();
$(document).ready(function () {
    init();
});
;(function (window, $, undefined) {
    window.init = _init;
    window.showMap = _showMap;
    window.updateDrawList = _updateDrawList;
    window.deleteZoon=deleteZoon;
    window.updataZoon=updataZoon;
    window.getMapId=_getMapId;
    window.getZoneByOwnerIdSub = _getZoneByOwnerIdSub;
    var _config = {
        uploadUrl: '../../../../file/upload.do',
        ajaxUrl: {
            getMapPicByRoleId: '/IntegratedMM/getMapPicByRoleId.do',//获取防区图
            getZoneByOwnerId: "/IntegratedMM/getZoneByOwnerId.do",
            updateZoneMapPositionUrl: '../../../../updateZoneMapPosition.do',
            deleteMapPic:"/IntegratedMM/deleteMapPic.do"
        }
    }
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
        if(mapId!=''&&mapId!="undefined"){
            $("#delZone").show();
        }
        else{
            $("#delZone").hide();
        }
        _global.mapId = mapId;
        var url = parent.getMapSubPath(mapId);
        _showMap(url,mapId,2);//默认自适应显示
    }

    function _initEvent() {
        $("#delZone").click(function () {
            parent.parent.parent.okAndCancelAndMsg("确定删除防区图吗？",deleteZoon,null);
        });
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
    function _getMapId(){
        return _global.mapId;
    }
    function deleteZoon(){
        if(_global.mapId==''){
            return;
        }
        parent.delMap(_global.mapId);
        _clearALLimg(true);
        $("#mapContainer").addClass("falsePicture");
        var draggableJson = $.fn.getDraggableJson("mapImage");
        parent.intiDrawAfter(draggableJson);
        var $elem = $("#mapImage");
        $elem.attr("style","");
        $("#delZone").hide();
    }
    function _ok(data) {
        var submitZonePojo = {
            x: data.x,
            y: data.y,
            ownerZoneName: data.ownerZoneName,
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
            ownerZoneName: data.ownerZoneName,
            devZoneId: data.devZoneId,
            mapId: ''
        }
        parent.delDraw(submitZonePojo);
    }

    function _move(data) {
        var submitZonePojo = {
            x: data.x,
            y: data.y,
            ownerZoneName: data.ownerZoneName,
            devZoneId: data.devZoneId,
            mapId: _global.mapId
        }
        parent.moveDraw(submitZonePojo);
    }
    function _showMap(mapPath,mapId) {
        if(mapPath != ''){
            _global.backgroundIcon = mapPath;
            _global.mapId = mapId;
            $("#delZone").show();
            //console.log("mapId:"+mapId);
            _onloadCallback();
        }
        else {
            $("#mapContainer").addClass("falsePicture");
        }
    }

//向父节点获取数据
    function _onloadCallback(data) {
        var data = parent.getZonePojo();
        //console.log(JSON.stringify(data));
        if (data) {
            _getZoneByUserId(data);
        } else {

        }
    }

    function _getZoneByUserId(zonePojo) {
         _global.zonePojo = zonePojo;
        if(_global.isInit){
            _clearALLimg(false);
            _addList();
             _global.isInit=false;
        }else{
             //_clearALLimg();
             _addList1();
         }
    }

    function _clearALLimg(isDelete) {
        clearImage({
            addbtnId: "addZone",//添加按钮id
            wrapperId: "mapImage",//防区图div id
            mapId: _global.mapId,
            isDelete:isDelete,
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
            setDraggableJson: setDraggableJson,
            mapId: _global.mapId,
            minZoom:0.4,
            maxZoom:3,
            zoomSize:0.05,
            backgroundIcon:_global.backgroundIcon
        });
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
            setDraggableJson: setDraggableJson,
            mapId: _global.mapId,
            minZoom:0.4,
            maxZoom:3,
            zoomSize:0.05,
            backgroundIcon:_global.backgroundIcon
        });
    }
    
    function setDraggableJson() {
        var draggableJson = $.fn.getDraggableJson("mapImage");
        parent.intiDrawAfter(draggableJson);
        //console.log("换图setDraggableJson："+JSON.stringify(draggableJson));
    }

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

    function updataZoon(mapId){
        if(_global.mapId==''){
            return;
        }
        //console.log("换图_clearALLimg："+JSON.stringify($("#mapImage").data("draggableJson")));
        _clearALLimg(false);
        $("#mapContainer").addClass("falsePicture");
        var draggableJson = $.fn.getDraggableJson("mapImage");
        parent.intiDrawAfter(draggableJson);
        _global.mapId=mapId;
    }

    function deleteZoon(){
        if(_global.mapId==''){
            return;
        }
        _clearALLimg(true);
        $("#mapContainer").addClass("falsePicture");
        var draggableJson = $.fn.getDraggableJson("mapImage");
        parent.intiDrawAfter(draggableJson);
        var $elem = $("#mapImage");
        $elem.attr("style","");
    }

    function _getZoneByOwnerIdParams() {
        var params = {};
        params.userPojo = {};
        params.userPojo.ownerId = parent.getOnwerId();
        return params;
    }
    function _getZoneByOwnerIdSub(callback) {
        var params = _getZoneByOwnerIdParams();
        post_async(params, _config.ajaxUrl.getZoneByOwnerId, callback);
    }

})(window, jQuery, undefined);