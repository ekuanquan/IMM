//var deviceData = parent.parent.parent.parent.getPopupsRowJson();
$(document).ready(function () {
    init();
});
;(function (window, $, undefined) {
    window.init = _init;

    var _config = {
        uploadUrl: '../../../../file/upload.do',
        ajaxUrl: {
            getMapPathUrl: '../../../../getMapPicByUserIdImm.do',
            getZoneByUserIdUrl: "../../../../getZoneByUserId.do",
            updateZoneMapPositionUrl: '../../../../updateZoneMapPosition.do'
        }
    }

    var _global = {
        uploader: null,
        uploadParams: {
            mapId: ''
        },
        jsonSelect: [ //下拉框选项数组
            {
                "almType": "",
                "almTypeName": "",
                "atPos": "K32",
                "devId": "100001067",
                "devZoneId": "0000",
                "fMemo": "",
                "instDate": "",
                "roleZoneName": "0000",
                "snModeId": 98,
                "snModelName": "键盘",
                "snNum": 1,
                "snType": "",
                "snTypeName": "",
                "wantDo": "",
                "x": 0.43600329756736755,
                "y": 0.4983088970184326
            }],
        datalist: [
            {
                "almType": "",
                "almTypeName": "",
                "atPos": "K32",
                "devId": "100001067",
                "devZoneId": "0000",
                "fMemo": "",
                "instDate": "",
                "roleZoneName": "0000",
                "snModeId": 98,
                "snModelName": "键盘",
                "snNum": 1,
                "snType": "",
                "snTypeName": "",
                "wantDo": "",
                "x": 0.43600329756736755,
                "y": 0.4983088970184326
            }, {
                "almType": "",
                "almTypeName": "",
                "atPos": "K32",
                "devId": "100001067",
                "devZoneId": "0000",
                "fMemo": "",
                "instDate": "",
                "roleZoneName": "0001",
                "snModeId": 98,
                "snModelName": "键盘",
                "snNum": 1,
                "snType": "",
                "snTypeName": "",
                "wantDo": "",
                "x": 0.43600329756736755,
                "y": 0.5983088970184326
            }],
        mapPath: '',
        zonePojo: [],
        submitZonePojo: [],
        rowJson: {},
        isInit:true,
    };

    function _init() {
        _initData();
        _initEvent();
    }


    function _initData() {
        var rowJson = parent.parent.getPopupsRowJson();
        _global.rowdata = rowJson;
        _global.uploadParams.mapId = rowJson.userId;
        _initMapPic();
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
            _clearALLimg();
            _addList1();
        });
        //点击切换设备图
        $("#chooseMap").on("change",function () {
            var MapValue = $("#chooseMap").val();
            _Mapifame(MapValue);
        })

    }
    function _Mapifame(MapValue) {
        switch(MapValue){
            case '0':
                $("#mapBorder").show().siblings().hide();
                break;
            case '1':
                $("#mapBorder1").show().siblings().hide();
                break;
            case '2':
                $("#mapBorder2").show().siblings().hide();
                break;
            case '3':
                $("#mapBorder3").show().siblings().hide();
                break;
            case '4':
                $("#mapBorder4").show().siblings().hide();
                break;
        }
    }
    function _initMapPic() {
        /*userAreaImage({
         addbtnId: "addZone",//添加按钮id
         kuangkuangId: "mapContainer",//防区图外框div id
         bianbianId: "mapBorder",//防区图边框div id
         wrapperId: "mapImage",//防区图div id
         src: 'img/zone.jpg',//图标图片
         jsonSelect: _global.jsonSelect,//下拉框数据json
         DragDownCallBack: _move,
         OKCallBack: _ok,
         delCallBack: _del
         });*/
        var imageUrl = 'src/300004118.jpg';
        /*imageUrl = 'http://111.61.74.148:8082/A100/ZoneMapUpLoad/7/100001067.BMP';
         _showBack(imageUrl);*/

    }

    function _showBack(imageUrl, onloadCallBack) {
        showBackUrl({//四个参数必须
            wrapperId: "mapImage",//防区图div id
            bianbianId: "mapBorder",//防区图边框div id
            kuangkuangId: "mapContainer",//防区图外框div id
            imageUrl: imageUrl//图片url
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
            roleZoneName: data.roleZoneName,
            x: data.x,
            y: data.y,
            roleId: _global.rowdata.roleId
        }
        _submitZonePojoManager('add', submitZonePojo)
        //alert(data.roleZoneName + data.x + data.y);
    }

    function _del(data) {
        var submitZonePojo = {
            roleZoneName: data.roleZoneName,
            x: 0,
            y: 0,
            roleId: _global.rowdata.roleId
        }
        _submitZonePojoManager('del', submitZonePojo)
        //alert(data.roleZoneName + data.x + data.y);
    }

    function _move(data) {
        var submitZonePojo = {
            roleZoneName: data.roleZoneName,
            x: data.x,
            y: data.y,
            roleId: _global.rowdata.roleId
        }
        _submitZonePojoManager('move', submitZonePojo)
        //alert(data.roleZoneName + data.x + data.y);
    }

    function _initUploader() {
        _global.uploader = new plupload.Uploader({
            browse_button: 'Upload',			   	//触发文件选择对话框的按钮，为那个元素id
            url: _config.uploadUrl,	//服务器端的上传页面地址
            flash_swf_url: 'js/Moxie.swf',			//swf文件，当需要使用swf方式进行上传时需要配置该参数
            multi_selection: false,            //是否可以在文件浏览对话框中选择多个文件，true为可以，false为不可以
            multipart_params: {
                jsonStr: JSON.stringify(_global.uploadParams)
            },
            filters: {
                mime_types: [ //只允许上传图片
                    {title: "Image files", extensions: "jpg,png,BMP"}
                ],
                max_file_size: '1024kb', //最大只能上传1024kb的文件
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

        _global.uploader.bind('UploadProgress', function (uploader, file) {                 //上传百分比

        });

        _global.uploader.bind('FileUploaded', function (uploader, file, responseObject) {   //上传返回值

            var data = JSON.parse(responseObject.response);
            //  alert(responseObject.response);
            var result = data.result;
            if (result.code == '0') {
                _global.mapPath = data.uploadFile;
                _showBack(_global.mapPath, _onloadCallback);
            } else {
                alert("图片上传失败");
            }


        });
    }

    function _getMapPathParams() {
        var params = {};
        params.userPojo = {};
        params.userPojo.userId = _global.uploadParams.mapId;
        return params;
    }

    function _getMapPath() {
        var params = _getMapPathParams();
        post_async(params, _config.ajaxUrl.getMapPathUrl, _callback_getMapPath);
    }

    function _callback_getMapPath(data) {
        var result = data.result;
        if (result.code == '0') {
            if(data.MappicPojo && data.MappicPojo.mapPath != ''){
                _global.mapPath = data.MappicPojo.mapPath;
                _showBack(_global.mapPath, _onloadCallback);
            }
            else {
                $("#mapContainer").addClass("falsePicture");
            }
        }
    }

    function _onloadCallback(data) {
        if (data) {
            _getZoneByUserId();
        } else {

        }
    }


    function _getZoneByUserIdParams() {
        var params = {};
        params.userPojo = {};
        params.userPojo.userId = _global.uploadParams.mapId;
        return params;
    }

    function _getZoneByUserId() {
        var params = _getZoneByUserIdParams();
        post_async(params, _config.ajaxUrl.getZoneByUserIdUrl, _callback_getZoneByUserId);
    }

    function _callback_getZoneByUserId(data) {
        var result = data.result;
        if (result.code == '0') {
            _global.zonePojo = data.zonePojo;
            if(_global.isInit){
                _clearALLimg();
                _addList();
                _global.isInit=false;
            }else{
                _clearALLimg();
                _addList1();
            }


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
        //console.log("_global.zonePojo",JSON.stringify(_global.zonePojo))

        userAreaImage({
            addbtnId: "addZone",//添加按钮id
            kuangkuangId: "mapContainer",//防区图外框div id
            bianbianId: "mapBorder",//防区图边框div id
            wrapperId: "mapImage",//防区图div id
            src: 'img/zone.jpg',//图标图片
            jsonSelect: _global.zonePojo,//下拉框数据json
            DragDownCallBack: _move,
            OKCallBack: _ok,
            delCallBack: _del
        });
        $.fn.addiconList({
            addbtnId: "addZone",//添加按钮id
            kuangkuangId: "mapContainer",//防区图外框div id
            bianbianId: "mapBorder",//防区图边框div id
            wrapperId: "mapImage",//防区图div id
            src: 'img/zone.jpg',//图标图片
            jsonSelect: _global.zonePojo,//下拉框数据json
            dataList: _global.zonePojo,
            DragDownCallBack: _move,
            delCallBack: _del
        });
    }

    function _addList1() {
        $.fn.addiconList({
            addbtnId: "addZone",//添加按钮id
            kuangkuangId: "mapContainer",//防区图外框div id
            bianbianId: "mapBorder",//防区图边框div id
            wrapperId: "mapImage",//防区图div id
            src: 'img/zone.jpg',//图标图片
            jsonSelect: _global.zonePojo,//下拉框数据json
            dataList: _global.zonePojo,
            DragDownCallBack: _move,
            delCallBack: _del
        });
    }
    var submitZonePojo = [
        {
            roleZoneName: '0000',
            x: 0,
            y: 0
        }
    ];

    function _submitZonePojoManager(operationStr, submitZonePojo) {
        switch (operationStr) {
            case 'add':
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
            parent.parent.alertSuccess("防区图信息保存成功",2000,null);
        }

    }


})(window, jQuery, undefined);