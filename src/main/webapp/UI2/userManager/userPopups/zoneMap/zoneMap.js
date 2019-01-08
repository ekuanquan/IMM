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



    var _config = {
        uploadUrl: '../../../../file/upload.do',
        ajaxUrl: {
            getMapPicByRoleId: '/IntegratedMM/getMapPicByRoleId.do',//获取防区图
            getZonesByRoleId: "/IntegratedMM/getZonesByRoleId.do",
            updateZoneMapPositionUrl: '../../../../updateZoneMapPosition.do'
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
        submitZonePojo: [],
        rowJson: {},
        isInit:true,
        MappicPojoList: [],
        picMapping :{},
        handle: null  //选择的当前防区图
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
        $("#buttom_save").click(function () {
            _updateZoneMapPosition();
        });
        $("#buttom_cancel").click(function () {
            /*_clearALLimg();
            _addList1();*/
            _global.top.closePopus();
        });
        $('#selectMapPic').change(function(){
            var index = $('#selectMapPic').val();
            var mapId = $('#selectOption'+index).data('mapId');
            var $subIframe = $("#subIframe"+index);
            _createMaps(index,mapId);
        });

    }

    

    function _initUploader() {
        _global.uploader = new plupload.Uploader({
            browse_button: 'Upload',			   	//触发文件选择对话框的按钮，为那个元素id
            url: _config.uploadUrl,	//服务器端的上传页面地址
            flash_swf_url: 'js/Moxie.swf',			//swf文件，当需要使用swf方式进行上传时需要配置该参数
            multi_selection: false,            //是否可以在文件浏览对话框中选择多个文件，true为可以，false为不可以
            filters: {
                mime_types: [ //只允许上传图片
                    {title: "Image files", extensions: "jpg,gif,png,BMP"}
                ],
                max_file_size: '5120kb', //最大只能上传5120kb的文件
                prevent_duplicates: true //不允许选取重复文件
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

            var index = $('#selectMapPic').val();
            var mapName = $('#selectOption'+index).text();

            var param = {};
            var jsonStr = {};
            jsonStr.roleId=_global.rowdata.roleId;
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
                _global.picMapping[mapId] = {};
                _global.picMapping[mapId].mapPath = mapPath;

                _global.handle && _global.handle.showMap && _global.handle.showMap(mapPath,mapId);
            } else {
                alert("图片上传失败");
            }


        });
    }

    function _getMapPathParams() {
        var params = {};
        params.userPojo = {};
        //params.userPojo.roleId = '10000C751';
        params.userPojo.roleId = _global.rowdata.roleId;
        return params;
    }

    function _getMapPath() {
        var params = _getMapPathParams();
        post_async(params, _config.ajaxUrl.getMapPicByRoleId, _callback_getMapPath,_getZonesByRoleId);//获取完图片之后，显示点位
    }

    function _callback_getMapPath(data,funCallBack) {
        var result = data.result;
        if (result.code == '0') {
            //存放图片
            _global.MappicPojoList = data.MappicPojo;

            if(funCallBack){
                funCallBack();
            }
        }
    }

    function _getZonesByRoleIdParams() {
        var params = {};
        params.userPojo = {};
        //params.userPojo.roleId = '10000C751';
        params.userPojo.roleId = _global.rowdata.roleId;
        return params;
    }

    function _getZonesByRoleId() {
        var params = _getZonesByRoleIdParams();
        post_async(params, _config.ajaxUrl.getZonesByRoleId, _callback_getZonesByRoleId,_initSelect);
    }

    function _callback_getZonesByRoleId(data,funCallBack) {
        var result = data.result;
        if (result.code == '0') {
            _global.zonePojo = data.zonePojo;
            _initDrawPojoList();//整理格式
            if(funCallBack){
                funCallBack();
            }
        }
    }

    function _submitZonePojoManager(operationStr, submitZonePojo) {
        switch (operationStr) {
            case 'add':
                for (var i = 0; i < _global.submitZonePojo.length; i++) {
                    if (_global.submitZonePojo[i].roleZoneName == submitZonePojo.roleZoneName) {
                        _global.submitZonePojo[i].x = submitZonePojo.x;
                        _global.submitZonePojo[i].y = submitZonePojo.y;
                        _global.submitZonePojo[i].mapId = submitZonePojo.mapId;
                        _global.submitZonePojo[i].roleId = _global.rowdata.roleId;
                        return;
                    }
                }
                _global.submitZonePojo.push(submitZonePojo);
                break;
            case 'move':
                for (var i = 0; i < _global.submitZonePojo.length; i++) {
                    if (_global.submitZonePojo[i].roleZoneName == submitZonePojo.roleZoneName) {
                        _global.submitZonePojo[i].x = submitZonePojo.x;
                        _global.submitZonePojo[i].y = submitZonePojo.y;
                        _global.submitZonePojo[i].roleId = _global.rowdata.roleId;
                        return;
                    }
                }
                _global.submitZonePojo.push(submitZonePojo);
                break;
            case 'del':
                for (var i = 0; i < _global.submitZonePojo.length; i++) {
                    if (_global.submitZonePojo[i].roleZoneName == submitZonePojo.roleZoneName) {
                        _global.submitZonePojo[i].x = 0;
                        _global.submitZonePojo[i].y = 0;
                        _global.submitZonePojo[i].roleId = _global.rowdata.roleId;
                        return;
                    }
                }
                _global.submitZonePojo.push(submitZonePojo);
                break;
            default:
                break;
        }

    }

    function _updateZoneMapPositionParams() {
        var params = {};
        params.submitZonePojo = [];
        params.submitZonePojo = _global.submitZonePojo;
        return params;
    }

    function _updateZoneMapPosition() {
        var params = _updateZoneMapPositionParams();
        post_async(params, _config.ajaxUrl.updateZoneMapPositionUrl, _callback_updateZoneMapPosition);
    }

    function _callback_updateZoneMapPosition(data) {
        var result = data.result;
        if (result.code == '0') {
            //alert("修改成功；    修改了" + data.resultCount + "个防区位置");
           /* var param = "";
            param = "修改成功；    修改了" + data.resultCount + "个防区位置";*/
            _global.submitZonePojo = [];
            parent.parent.alertSuccess("防区图信息保存成功",2000,null);
        }

    }

    function _initSelect(){
        var MappicPojoList = _global.MappicPojoList;
        var arr = ['防区图1','防区图2','防区图3','防区图4','防区图5'];

        for(var i = 0, len = MappicPojoList.length; i<len; i++){
            var mappicPojo= MappicPojoList[i];
            var mapName = mappicPojo.mapName;
            var mapId = mappicPojo.mapId;
            for(var j=0,jlen = arr.length; j<jlen;j++){
                if(arr[j] == mapName){
                    var $option = $('#selectOption'+(j+1));
                    $option.data('mapId',mapId);
                    _global.picMapping[mapId] = mappicPojo;
                    break;
                }
            }
        }
            var index = 1;
            var mapId = $('#selectOption'+index).data('mapId');
            var $subIframe = $("#subIframe"+index);
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
        /*_global.zonePojo =  [
        {
            "almType": "",
            "almTypeName": "",
            "atPos": "屋内东北角北墙",
            "devId": "100001008",
            "devZoneId": "0001",
            "fMemo": "",
            "instDate": "",
            "roleZoneName": "0001",
            "snModeId": 100,
            "snModelName": "1484",
            "snNum": 1,
            "snType": "双鉴",
            "snTypeName": "",
            "wantDo": "",
            "x": 0.5390199422836304,
            "y": 0.1894736886024475
        }
    ];*/
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
                devZoneId = zone.devZoneId,roleZoneName = zone.roleZoneName;
            if(mapId == null || mapId == '' || x == null || x == 0 || x == '' || y == null || y == 0 || y == ''){
                continue;
            }
            var drawPojo = {};
            drawPojo.x = x;
            drawPojo.y = y;
            drawPojo.mapId = mapId;
            drawPojo.devZoneId = devZoneId;
            drawPojo.roleZoneName = roleZoneName;
            drawPojo.id = '';
            _global.drawPojoList.push(drawPojo);
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
            var roleZoneName = drawPojo.roleZoneName;
            var id = drawPojo.id;
            for(var j = 0, jLen = _global.drawPojoList.length; j<jLen; j++){
                var roleZoneName2 = _global.drawPojoList[j].roleZoneName;
                if(roleZoneName2 == roleZoneName){
                    _global.drawPojoList[j].id = id;
                    break;
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
        submitZonePojo.roleId = _global.rowdata.roleId;
        _global.drawPojoList.push(submitZonePojo);
        for (var i = 0; i < _global.zonePojo.length; i++) {
            if (_global.zonePojo[i].roleZoneName == submitZonePojo.roleZoneName) {
                _global.zonePojo[i].x = submitZonePojo.x;
                _global.zonePojo[i].y = submitZonePojo.y;
                _global.zonePojo[i].mapId = submitZonePojo.mapId;
                 break;
            }
        } 


        _submitZonePojoManager('add', submitZonePojo);
        //通知多个子页进行更新
        _notice();
    }
    function _delDraw(submitZonePojo){
        
        for (var i = 0; i < _global.drawPojoList.length; i++) {
            if (_global.drawPojoList[i].roleZoneName == submitZonePojo.roleZoneName) {
                submitZonePojo.devZoneId = _global.drawPojoList[i].devZoneId;
                submitZonePojo.roleId = _global.rowdata.roleId;
                _global.drawPojoList.splice(i, 1);
                 break;
            }
        }     
        for (var i = 0; i < _global.zonePojo.length; i++) {
            if (_global.zonePojo[i].roleZoneName == submitZonePojo.roleZoneName) {
                _global.zonePojo[i].x = 0;
                _global.zonePojo[i].y = 0;
                _global.zonePojo[i].mapId = '';
                 break;
            }
        }   
        _submitZonePojoManager('del', submitZonePojo);
        //通知多个子页进行更新
        _notice();
    }
    function _moveDraw(submitZonePojo){
        for (var i = 0; i < _global.drawPojoList.length; i++) {
            if (_global.drawPojoList[i].roleZoneName == submitZonePojo.roleZoneName) {
                _global.drawPojoList[i].x = submitZonePojo.x;
                _global.drawPojoList[i].y = submitZonePojo.y;
                _global.drawPojoList[i].mapId = submitZonePojo.mapId;
                _global.drawPojoList[i].roleId = _global.rowdata.roleId;
                submitZonePojo.devZoneId = _global.drawPojoList[i].devZoneId;
                submitZonePojo.roleId = _global.rowdata.roleId;
                 break;
            }
        }
        for (var i = 0; i < _global.zonePojo.length; i++) {
            if (_global.zonePojo[i].roleZoneName == submitZonePojo.roleZoneName) {
                _global.zonePojo[i].x = submitZonePojo.x;
                _global.zonePojo[i].y = submitZonePojo.y;
                _global.zonePojo[i].mapId = submitZonePojo.mapId;
                 break;
            }
        }  
        _submitZonePojoManager('move', submitZonePojo);
        //通知多个子页进行更新
        _notice();
    }


})(window, jQuery, undefined);