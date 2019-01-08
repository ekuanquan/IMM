//var deviceData = parent.parent.parent.parent.getPopupsRowJson();
$(document).ready(function () {
    init();
});
;(function (window, $, undefined) {
    window.init = _init;
    window.getMapSubPath = _getMapSubPath;
    window.getZonePojo = _getZonePojo;
    window.intiDrawAfter = _intiDrawAfter;
    window.addDraw = _addDraw;
    window.delDraw = _delDraw;
    window.moveDraw = _moveDraw;
    window.clearEvents=_clearEvents;
    window.setEvents=_setEvents;
    window.getOnwerId=_getOnwerId;

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
        top:parent.parent,
        uploader: null,
        uploadParams: {
            mapId: ''
        },
        zonePojo: [],//所有防区
        drawPojoList: [],//所有绘制的防区
        rowJson: {},
        isInit:true,
        MappicPojoList: [],
        picMapping :{},
        handle: null,  //选择的当前防区图
        maxindex:1,
        nowIndex:0,
        arr:[],
    };

    function _init() {
        _initData();
        _initEvent();
       //_createMaps();
    }

    function _initData() {
        var rowJson = parent.parent.getPopupsRowJson();
        _global.rowdata = rowJson;
        _getMapPath();
    }

    function _initEvent() {
        _initUploader();
        $("#upload_input_button").click(function () {
            $("#Upload").click();
        });
        $("#uploadButton").click(function () {
            _global.uploader.start();
        });

        $("#contentRight_del").click(function () {
            var mapId = $('.select').data('mapId');
            if(mapId&&mapId.length>0){
                parent.parent.okAndCancelAndMsg("确定删除防区图吗？",_delMap,null);
            }
            else{
                var selectOption= $('.selectOption');
                if(selectOption.length>1){
                    var index = $('.select').data('index');
                    $('#selectOption' + index).remove();
                    $("#subIframe_" + index).remove();
                    $("#" +$('.selectOption')[0].id).addClass("select");
                    $("#" +$('.selectOption')[0].id).click();
                }
                else{
                    parent.parent.alertWarn("防区图为空，无法执行删除！",2000,null);
                }
            }
            //_delMap($('.select').data('mapId'));
        });
        $("#contentRight_add").click(function(){
            $('.select').removeClass("select");
            //添加选项和iframe
            $('#selectMapPic').append('<div id="selectOption'+_global.maxindex+'" class="selectOption select">防区图'+
                _global.maxindex+'</div>');
            $('#selectOption' + _global.maxindex).data('index',_global.maxindex);
            $('#selectOption' + _global.maxindex).data('mapId',"");
            $("#selectOption" + _global.maxindex).click(function () {
                $(".selectOption").removeClass("select");
                $(this).addClass("select")
                var index = $(this).data('index');
                var mapId = $(this).data('mapId');
                console.log("mapId:" + mapId);
                _createMaps(index, mapId);
            });
            if(_global.nowIndex==0){
                $(".title_upload_container").after('<iframe id="subIframe_'+_global.maxindex+'" name="subIframe_'+_global.maxindex+
                    '" class="subIframe" src=""></iframe>');
            }
            else {
                var length=$(".subIframe" ).length;
                $("#" + $(".subIframe" )[length-1].id).after('<iframe id="subIframe_' + _global.maxindex + '" name="subIframe_' + _global.maxindex +
                    '" class="subIframe" src=""></iframe>');
            }
            _global.nowIndex=_global.maxindex-1;
            _global.maxindex=_global.maxindex+1;

            var index = $('.select').data('index');
            var mapId = $('.select').data('mapId');
            _createMaps(index, mapId);
        });
    }
    //上传图片
    function _initUploader() {
        _global.uploader = new plupload.Uploader({
            browse_button: 'Upload',			   	//触发文件选择对话框的按钮，为那个元素id
            url: _config.uploadUrl,	//服务器端的上传页面地址
            flash_swf_url: 'js/Moxie.swf',			//swf文件，当需要使用swf方式进行上传时需要配置该参数
            multi_selection: false,            //是否可以在文件浏览对话框中选择多个文件，true为可以，false为不可以
            filters: {
                mime_types: [ //只允许上传图片
                    {title: "Image files", extensions: "jpg,gif,png"}
                ],
                max_file_size: '5120kb', //最大只能上传5120kb的文件
                prevent_duplicates: false //允许选取重复文件
            }

        });
        _global.uploader.init();
        _global.uploader.bind('FilesAdded', function (uploader, files) {                    //添加文件触发
            for (var i = 0, len = files.length; i < len; i++) {
                var file_name = files[i].name;
                $("#upload_input_text").text(file_name);
            }
        });

        _global.uploader.bind('BeforeUpload', function (uploader, file) {                 //上传前

            var index = $('.select').data('index');
            var mapName = $('.select').text();
            var date = getNowFormatDate();
            var param = {};
            var jsonStr = {};
            //jsonStr.roleId=_global.rowdata.roleId;
            jsonStr.mapId=_global.rowdata.userId+"_"+index+"_"+date;
            jsonStr.ownerId=_global.rowdata.userId;
            jsonStr.mapName=mapName;
            param.jsonStr = JSON.stringify(jsonStr);

            uploader.setOption("multipart_params",param);
        });

        _global.uploader.bind('FileUploaded', function (uploader, file, responseObject) {   //上传返回值
            var data = JSON.parse(responseObject.response);
            //  alert(responseObject.response);
            var result = data.result;
            if (result.code == '0') {
                var mapPath = data.uploadFile;
                var mapId = data.mapId;
                var zonePojo = data.zonePojo;
                _global.picMapping[mapId] = {};
                _global.picMapping[mapId].mapPath = mapPath;
                var oldMapId=_global.handle.getMapId();
                $('.select').data('mapId',data.mapId);
                if(oldMapId.length>0) {
                    _global.handle && _global.handle.updataZoon && _global.handle.updataZoon(mapId);
                    updatZonePojo(oldMapId, mapId, zonePojo);
                }
                _global.handle && _global.handle.showMap && _global.handle.showMap(mapPath,mapId);

            } else {
                _global.top.alertTip("图片上传失败",2000,null);
            }
        });
    }

    function updatZonePojo(oldMapId,newMapId,zonePojo) {
        if(oldMapId==""){
            return;
        }
        for(var i=0;i<_global.zonePojo.length;i++){
           for(var j=0;j<zonePojo.length;j++){
               if(_global.zonePojo[i].ownerZoneName==zonePojo[j].ownerZoneName){
                   _global.zonePojo[i].mapId=newMapId;
                   _global.zonePojo[i].x=zonePojo[j].x;
                   _global.zonePojo[i].y=zonePojo[j].y;
                   _global.zonePojo[i].devZoneId=zonePojo[j].devZoneId;
                   break;
               }
           }
            if(_global.zonePojo[i].mapId==oldMapId){
                _global.zonePojo[i].mapId="";
                _global.zonePojo[i].x=0;
                _global.zonePojo[i].y=0;
            }
        }
        //console.log(JSON.stringify(_global.zonePojo));
    }

    //获取当前时间、用于生成防区图Id
    function getNowFormatDate() {
        var date = new Date();
        var month = date.getMonth() + 1;
        month = month < 10 ? ('0' + month) : month;

        var strDate = date.getDate();
        strDate = strDate < 10 ? ('0' + strDate) : strDate;

        var hour = date.getHours();
        hour = hour < 10 ? ('0' + hour) : hour;

        var minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;

        var second = date.getSeconds();
        second = second < 10 ? ('0' + second) : second;

        var currentdate = date.getFullYear() + month + strDate +hour + minute + second;
        return currentdate;

    }
    //生成查询防区图参数
    function _getMapPathParams() {
        var params = {};
        params.userPojo = {};
        params.userPojo.ownerId = _global.rowdata.userId;
        return params;
    }

    function _getMapPath() {
        var params = _getMapPathParams();
        post_async(params, _config.ajaxUrl.getMapPicByRoleId, _callback_getMapPath,_getZoneByOwnerId);//获取完图片之后，显示点位
    }

    function _callback_getMapPath(data,funCallBack) {
        var result = data.result;
        if (result.code == '0') {
            //存放图片
            _global.MappicPojoList = data.MappicPojo;
            if(_global.MappicPojoList.length>0){
                //获取图片序号最大值，加1是下一张图的序号
                for(var i=0;i<_global.MappicPojoList.length;i++){
                    var ind=_global.MappicPojoList[i].mapName;
                    _global.arr.push(ind);
                    var num=parseInt(ind.substr(3,ind.length-3));
                    $('#selectMapPic').append('<div id="selectOption' + num +  '" class="selectOption">防区图' + num + '</div>');

                    $('#selectOption' + num).data('index',num);
                    $('#selectOption' + num).data('mapId',_global.MappicPojoList[i].mapId);
                    $("#selectOption" + num).click(function () {
                        $(".selectOption").removeClass("select");
                        $(this).addClass("select")
                        var index = $(this).data('index');
                        var mapId = $(this).data('mapId');
                        console.log("mapId:" + mapId);
                        _createMaps(index, mapId);
                    });
                    if(_global.nowIndex==0){
                        $(".title_upload_container").after('<iframe id="subIframe_' + num + '" name="subIframe_' + num +
                            '" class="subIframe show" src=""></iframe>');
                        //$('#selectMapPic').val(num);
                        $("#selectOption" + num).addClass("select");
                    }
                    else {
                        $("#subIframe_" + _global.nowIndex).after('<iframe id="subIframe_' + num + '" name="subIframe_' + num +
                            '" class="subIframe" src=""></iframe>');
                    }
                    _global.nowIndex=num;
                    if(num>=_global.maxindex){
                        _global.maxindex=num+1;
                    }
                    var mapId = $('.select').data('mapId');
                    _createMaps(1, mapId);
                }
            }
            else{
                //如果是新增，就默认添加一个防区图
                $('#selectMapPic').append('<div id="selectOption1" class="selectOption select">防区图1</div>');
                $(".title_upload_container").after('<iframe id="subIframe_1" name="subIframe_1" class="subIframe show" src=""></iframe>');
                $('#selectOption1').data('index',"1");
                $('#selectOption1').data('mapId',"");
                $("#selectOption1").click(function () {
                    $(".selectOption").removeClass("select");
                    $(this).addClass("select")
                    var index = $(this).data('index');
                    var mapId = $(this).data('mapId');
                    _createMaps(index, mapId);
                });
                _global.nowIndex=1;
                _global.maxindex=2;
                _createMaps(1, "");
            }
            if(funCallBack){
                funCallBack();
            }
        }
    }

    function _getZoneByOwnerIdParams() {
        var params = {};
        params.userPojo = {};
        params.userPojo.ownerId = _global.rowdata.userId;
        return params;
    }

    function _getZoneByOwnerId() {
        var params = _getZoneByOwnerIdParams();
        post_async(params, _config.ajaxUrl.getZoneByOwnerId, _callback_getZoneByOwnerId,_initSelect);
    }

    function _callback_getZoneByOwnerId(data,funCallBack) {
        var result = data.result;
        if (result.code == '0') {
            _global.zonePojo = data.zonePojo;//所有防区
            _initDrawPojoList();//整理格式
            if(funCallBack){
                funCallBack();
            }
        }
    }

    function _submitZonePojoManager(submitZonePojo) {
        var params = {};
        params.submitZonePojo = [];
        params.submitZonePojo.push(submitZonePojo);
        post_async(params, _config.ajaxUrl.updateZoneMapPositionUrl, _callback_updateZoneMapPosition);
    }

    function _callback_updateZoneMapPosition(data) {
        var result = data.result;
        if (result.code != '0') {
            //修改成功
            _global.submitZonePojo = [];
            parent.parent.alertSuccess(result.message,2000,null);
        }
    }

    function _initSelect(){
        var MappicPojoList = _global.MappicPojoList;
        var arr = _global.arr;
        for(var i = 0, len = MappicPojoList.length; i<len; i++){
            var mappicPojo= MappicPojoList[i];
            var mapName = mappicPojo.mapName;
            var mapId = mappicPojo.mapId;
            for(var j=0,jlen = arr.length; j<jlen;j++){
                if(arr[j] == mapName){
                    _global.picMapping[mapId] = mappicPojo;
                    break;
                }
            }
        }
        var index = $('.select').data('index');
        var mapId = $('.select').data('mapId');
        //console.log("index:"+index+"   mapId:"+mapId);
        _createMaps(index,mapId);
    }

    function _createMaps(index,mapId){
        var $subIframe = $('#subIframe_'+index);
        var src = $subIframe.attr("src");
        if(src == ""){
            //这个传值只是为了初始化，后面修改图片的话，不会更新url中的数据
            $subIframe.attr('src','zoneMapSub.html?mapId='+mapId);
        }
        $('.subIframe').removeClass('show');
        $subIframe.addClass('show');
        _global.handle = window.frames['subIframe_'+index];
    }

    function _getMapSubPath(mapId){
        var mappicPojo = _global.picMapping[mapId];
        if(mappicPojo == null || mappicPojo == undefined){
            return "";
        }
        else{
            return mappicPojo.mapPath;
        }
    }

    function _getZonePojo(){
        return _global.zonePojo;
    }
    function _initDrawPojoList(){
        var allZone = _global.zonePojo;
        if(allZone == null || allZone.length == 0){
            return;
        }
        for(var i = 0, len = allZone.length; i<len; i++){
            var zone = allZone[i];
            var x = zone.x, y = zone.y, mapId = zone.mapId,
                devZoneId = zone.devZoneId,ownerZoneName = zone.ownerZoneName;
            if(mapId == null || mapId == '' || x == null || x == 0 || x == '' || y == null || y == 0 || y == ''){
                continue;
            }
            var drawPojo = {};
            drawPojo.x = x;
            drawPojo.y = y;
            drawPojo.mapId = mapId;
            drawPojo.devZoneId = devZoneId;
            drawPojo.ownerZoneName = ownerZoneName;
            drawPojo.id = '';
            _global.drawPojoList.push(drawPojo);//所有绘制的防区
        }
    }

    //子页元素，初始化绘制完之后，调用函数
    function _intiDrawAfter(drawList){
        if(drawList == null || drawList.length == 0){
            //通知多个子页进行更新
            _notice();
            return;
        }
        for(var i =0, len = drawList.length; i<len; i++){
            var drawPojo = drawList[i];
            var ownerZoneName = drawPojo.ownerZoneName;
            var mapId= drawPojo.mapId;
            var id = drawPojo.id;
            if(_global.drawPojoList.length>0) {
                var isHave=false;
                for (var j = 0, jLen = _global.drawPojoList.length; j < jLen; j++) {
                    var ownerZoneName2 = _global.drawPojoList[j].ownerZoneName;
                    if (ownerZoneName2 == ownerZoneName) {
                        _global.drawPojoList[j].id = id;
                        _global.drawPojoList[j].mapId = mapId;
                        isHave=true;
                        break;
                    }
                }
                if(!isHave){
                    drawList[i].mapId = _global.handle.getMapId();
                    drawList[i].ownerId = _global.rowdata.userId;
                    _global.drawPojoList.push(drawList[i]);
                }
            }
        }
        //通知多个子页进行更新
        _notice();
    }
    function _notice(){
        $.each($('.subIframe'),function(){
            var $this = $(this);
            var name = $this.attr('name');
            var src = $this.attr('src');
            if(src != ''){
                var drawPojoList = [];
                $.extend(drawPojoList,_global.drawPojoList);
                window.frames[name].updateDrawList(drawPojoList);
            }
        });
    }

    function _addDraw(submitZonePojo){
        submitZonePojo.ownerId = _global.rowdata.userId;
        _global.drawPojoList.push(submitZonePojo);
        for (var i = 0; i < _global.zonePojo.length; i++) {
            if (_global.zonePojo[i].ownerZoneName == submitZonePojo.ownerZoneName) {
                submitZonePojo.devZoneId = _global.zonePojo[i].devZoneId;
                 break;
            }
        }
        _submitZonePojoManager(submitZonePojo);
        //通知多个子页进行更新
        _notice();
    }
    function _delDraw(submitZonePojo){
        for (var i = 0; i < _global.drawPojoList.length; i++) {
            if (_global.drawPojoList[i].ownerZoneName == submitZonePojo.ownerZoneName) {
                submitZonePojo.devZoneId = _global.drawPojoList[i].devZoneId;
                submitZonePojo.ownerId = _global.rowdata.userId;
                _global.drawPojoList.splice(i, 1);
                 break;
            }
        }
        _submitZonePojoManager(submitZonePojo);
        //通知多个子页进行更新
        _notice();
    }
    function _moveDraw(submitZonePojo){
        for (var i = 0; i < _global.drawPojoList.length; i++) {
            if (_global.drawPojoList[i].ownerZoneName == submitZonePojo.ownerZoneName) {
                submitZonePojo.devZoneId = _global.drawPojoList[i].devZoneId;
                submitZonePojo.ownerId = _global.rowdata.userId;
                 break;
            }
        }
        _submitZonePojoManager(submitZonePojo);
        //通知多个子页进行更新
        _notice();
    }

    function _delMap(){
        var mapId=$('.select').data('mapId');
        var index = $('.select').data('index');
        post_async({mapId:mapId},_config.ajaxUrl.deleteMapPic,function(data){
            if(data.code=='200'){
                $('.select').data('mapId',"");
                _global.handle.deleteZoon();
                for (var i = 0; i < _global.drawPojoList.length; i++) {
                    if (_global.drawPojoList[i].mapId == mapId) {
                        _global.drawPojoList.splice(i, 1);
                        i = i - 1;
                    }
                }
                var selectOption= $('.selectOption');
                if(selectOption.length>1){
                    $('#selectOption' + index).remove();
                    $("#subIframe_" + index).remove();
                    $("#" +$('.selectOption')[0].id).addClass("select");
                    $("#" +$('.selectOption')[0].id).click();
                }
                //通知多个子页进行更新
                _notice();
                parent.parent.alertSuccess("防区图信息删除成功",2000,null);
            }
        });
    }
    function _clearEvents() {
        $("#leftDiv").css({
            "pointer-events": "none",
            "opacity": "0.5"
        });
    }
    function _setEvents() {
        $("#leftDiv").css({
            "pointer-events": "auto",
            "opacity": "1"
        });
    }
    function _getOnwerId() {
        return _global.rowdata.userId;
    }
})(window, jQuery, undefined);