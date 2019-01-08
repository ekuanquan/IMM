/**
 * Created by Administrator on 2017/8/12.
 */


var datalist=[
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
    }];

//下拉框选项数组
var jsonSelect1=[
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
    }];
$(function() {
    userAreaImage({
        addbtnId:"addbtn",//添加按钮id
        kuangkuangId:"kuangkuang",//防区图外框div id
        bianbianId:"bianbian",//防区图边框div id
        wrapperId:"wrapper1",//防区图div id
        src:'images/addarea.jpg',//图标图片
        jsonSelect:jsonSelect1,//下拉框数据json
        DragDownCallBack:_move,
        OKCallBack:_ok,
        delCallBack:_del
    });
    var imageUrl = 'src/300004118.jpg';
    imageUrl = 'http://111.61.74.148:8082/A100/ZoneMapUpLoad/7/100001067.BMP';

    showBack(imageUrl);
});

function showBack(imageUrl){
    showBackUrl({//四个参数必须
        wrapperId:"wrapper1",//防区图div id
        bianbianId:"bianbian",//防区图边框div id
        kuangkuangId:"kuangkuang",//防区图外框div id
        imageUrl:imageUrl//图片url
    })
}
function save11() {
    getAllImage({
        wrapperId: "wrapper1",//防区图div id
        getAllCallBack: getAll
    });
    
}
function getAll(jsonArr){
    $("#dataDiv").text(JSON.stringify(jsonArr));
}
function clear11() {
    clearImage({
        addbtnId: "addbtn",//添加按钮id
        wrapperId: "wrapper1",//防区图div id
        clearCallBack: clearArr
    });
    
}
function clearArr(jsonArr) {
    $("#dataDiv").text("被清除的数据"+JSON.stringify(jsonArr));
}
function file_click(){
    new uploadPreview({
        UpBtn: "up_img_WU_FILE_0",
        ImgShow: "wrapper1",
        bianbian: "bianbian",
        kuangkuang: "kuangkuang"
    });
}
function  addList() {
    $.fn.addiconList({
        addbtnId:"addbtn",//添加按钮id
        kuangkuangId:"kuangkuang",//防区图外框div id
        bianbianId:"bianbian",//防区图边框div id
        wrapperId:"wrapper1",//防区图div id
        src:'images/addarea.jpg',//图标图片
        jsonSelect:jsonSelect1,//下拉框数据json
        dataList:datalist,
        DragDownCallBack:_move,
        delCallBack:_del
    });
}

function _ok(data) {
    alert(data.roleZoneName+data.x+data.y);
}
function _del(data) {
    alert(data.roleZoneName+data.x+data.y);
}

function _move(data) {
    alert(data.roleZoneName+data.x+data.y);
}

