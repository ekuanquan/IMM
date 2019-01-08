/**
 * Created by Administrator on 16-7-4.
 */
var eMap;
var paramLocation = {
       x:'' ,
       y:''
}
var rType = {
    face:{
        label:"人脸卡口",
        icon:"./eMap/images/face.png"
    },
    device:{
        label:"监控设备",
        icon:"./eMap/images/device.png"
    },
    police:{
        label:"警力资源",
        icon:"./eMap/images/police.png"
    }
};
var date;
var points = [];
function initialize() {
    require.config({
        baseUrl: "./eMap/",
        paths: {
            "eMap": ["src/eMap.core-1.0"],
            "css": ["base/css"]
        }
    })
    require(["eMap", "css"], function (EMap) {
        var setting = {
            mapType:"gmap",
            mapServer:"http://10.0.20.98:2098/",
            NAServer:"http://10.0.0.129:6080/arcgis/rest/services/gl/NAServer/Route/solve",
            containerId:"map",
            rType:rType,
            zoomLevel:{
                max:20,
                min:3,
                defaultLevel:14
            },
            overview:{
                show:false,
                width:200,
                height:200,
                maxLevel:10,
                minLevel:8
            },
            center:{lng:110.181884765625,lat:25.252148528835257},
            mapControl:{
                show:false
            }, 
            imagePath:"./eMap/",
            cluster:{
                gridSize:30,
                clusterClick:markerClick
            },
            toolbox:{
                show:true,
                type:[]
            },
            callback:{
                measure:measure,
                polygon:polygon,
                rect:rect,
                clear:clear,
                map_click:mapClick,
                loaded:loaded
            }
        };
        date = new Date();
        eMap = new EMap(setting);
    })
}

$(function(){
    initialize();
    parent.parent._setTitle2("电子地图");
    var paramSignResult =  getLatLong();
    var paramSign = {
        x:"114.47",
        y:"60.6"
    }
    var xSign=paramSign.x;
    var ySign=paramSign.y;
    if(paramSignResult.LatLong){
         xSign = paramSignResult.LatLong.devLng;
         ySign = paramSignResult.LatLong.devlat;
    }
    if(xSign != "" && ySign!=""){
        paramLocation.x = xSign;
        paramLocation.y = ySign;
        setTimeout(function(){
            addMarker(xSign,ySign);
        },500);
    }
    setTimeout(function(){
        //setLocationMode();
    },500);

});

function getLatLong(){      //根据设备编号获取经纬度
 var resultPara = parent.parent.getPopupsRowJson();
 var para = {
     "devId":resultPara.devId
 }
 var result = post_sync(para,"/IntegratedMM/query/getLatLng.do");
 return result;
 }

function loaded(){
}
function loadResources(size){
    getResources(size||30000);
}
function measure(param){
    points = param['original'];
    callback_data(param);
}
function polygon(param){
    callback_data(param);
}
function rect(param){
    callback_data(param);
}
function clear(param){
    callback_data(param);
}
function markerClick(param){
    callback_data(param);
}
function mapClick(param){
}
function getResources(size){
    size = size || document.getElementById("count").value;
    var center = eMap.getCenter();
    var param = {"size":size,
        lat:center['lat'],
        lng:center['lng']};
    ajaxRequest(param,"/operationplatform/map/getResourceData.do",addResource,"GET");
}
function addResource(resource){
    var markers = [
        {name: "桂林市公安局", id: "5", lng: 110.28955, lat: 25.27974,type:'face'},
        {name: "桂林市旅游局", id: "6", lng: 110.28579, lat: 25.27921,type:'police'},
        {name: "桂林市工商局", id: "7", lng: 110.2855, lat: 25.28138,type:'face'},
        {name: "桂林市房产局", id: "8", lng: 110.28653, lat: 25.28046,type:'device'},
        {name: "桂林市档案局", id: "9", lng: 110.28496, lat: 25.28021,type:'police'},
        {name: "桂林市司法局", id: "10", lng: 110.28951, lat: 25.28144,type:'face'},
        {name: "桂林市体育局", id: "11", lng: 110.29257, lat: 25.27803,type:'police'},
        {name: "桂林市农业局", id: "12", lng: 110.28757, lat: 25.28798,type:'face'},
        {name: "白龙派出所", id: "13", lng: 110.29787, lat: 25.28569,type:'device'},
        {name: "桂林市文化局", id: "14", lng: 110.29424, lat: 25.27575,type:'device'},
        {name: "榕城派出所", id: "15", lng: 110.2943, lat: 25.27744,type:'face'},
        {name: "桂林市政府", id: "16", lng: 110.28598, lat: 25.27657,type:'police'},
        {name: "桂林市规划局", id: "17", lng: 110.28598, lat: 25.27657,type:'device'},
        {name: "阳桥派出所", id: "18", lng: 110.28425, lat: 25.27567,type:'police'},
        {name: "桂林市国土局", id: "19", lng: 110.28313, lat: 25.27513,type:'device'},
        {name: "丽君派出所", id: "20", lng: 110.27443, lat: 25.28125,type:'device'}
    ];
    resource = resource['resources'] || markers;
    eMap.loadResources(resource);
}
function getCenter(){
    var center = eMap.getCenter();
    result_data(center);
}
function setCenter(){
    var center = {};
    center['lng'] = document.getElementById('pointx').value;
    center['lat'] = document.getElementById('pointy').value;
    eMap.setCenter(center);
}
function getZoomLevel(){
    var center = eMap.getZoomLevel();
    result_data(center);
}
function getMaxLevel(){
    var center = eMap.getMaxLevel();
    result_data(center);
}
function openInfoWindow(){
    var point = {
        lng:document.getElementById('pointx').value,
        lat:document.getElementById('pointy').value
    }
    var strHtml = '<div style="border:1px solid #f00;width: 200px;height: 200px;"><div>地图标题：</div><div>具体内容具体内容具体内容具体内容</div><div><button>确定</button></div></div>';
    eMap.openInfoWindow(point,strHtml);
}
function addAlarm() {
    var alarms = [
        {
            id: "4"
        },
        {
            id: "1"
        },
        {
            id: "2"
        },
        {
            id: "3"
        }];
    eMap.addRAlarm(alarms);
}

function addMarker(x,y){
    var marker = {
        name:"",
        id:"1",
        point:{
            lng:x,
            lat:y
        },
        uIcon:{
            'bgColor': "#ffffff",
            'borderColor': "#000000",
            'borderSize': 1,
            'height': 25,
            'width': 25,
            'fontSize': '',
            'pos': '3',
            'topOffset': 0,
            'leftOffset': 0,
            'image': './eMap/base/skin/images/sign.png',
            'lineWidth': "",
            'opacity': "",
            'color': "",
            'cssStyle': 'location-label'
        }
    };
    eMap.addMarker(marker);
}
function editMarker(){
    var marker = {
        name:document.getElementById('markerName').value,
        id:document.getElementById('Id').value,
        point:{
            lng:document.getElementById('pointx').value,
            lat:document.getElementById('pointy').value
        },
        uIcon:{
            'bgColor': "#ffffff",
            'borderColor': "#000000",
            'borderSize': 1,
            'height': 32,
            'width': 32,
            'fontSize': '',
            'pos': '3',
            'topOffset': 0,
            'leftOffset': 16,
            'image': './eMap/base/location.png',//http://10.151.1.83:80/PGIS_S_TileMap/images/tack.gif',
            'lineWidth': document.getElementById('lineWidth').value,
            'opacity': document.getElementById('opacity').value,
            'color': document.getElementById('color').value,
            'cssStyle': 'location-label'
        }
    }
    eMap.editMarker(marker);
}
function removeMarker(){
    eMap.removeMarker("1");
}
//轨迹
function showPathWay() {
    var points = new Array();
    var pointValue = document.getElementById('point').value;
    var pv = pointValue.split(',');
    for (var i = 0; i < pv.length; i += 2) {
        var point = new Object();
        /**
         * 测路网
         */
        var p = wgs_gcj_encrypts(parseFloat(pv[i + 1]),parseFloat(pv[i]));
        point.lng = p[0];
        point.lat = p[1];
        points.push(point);
    }
    var uIcon = {//小图标
        'fontColor':'',
        'bgColor': '',
        'borderColor': '',
        'bIsTransparent':false,
        'borderSize': '',
        'height': '',
        'width': '',
        'fontSize': '',
        'pos': '',
        'topOffset': '',
        'leftOffset': '',
        'lineArrow': 1,
        'image':'./eMap/base/skin/images/location.png',
        'lineWidth': document.getElementById('lineWidth').value,
        'opacity': document.getElementById('opacity').value,
        'name': '',
        'lineColor': document.getElementById('color').value,
        'cssStyle': 'location-label'
    };

    //拼装成对象
    var marker = {
        'id': document.getElementById('Id').value,
        'points': points,
        'uIcon': uIcon
    };
    var obj = eMap.showPathWay(marker);
}
//返回结果
function result_data(data) {
    document.getElementById('result').innerHTML = '返回结果：' + JSON.stringify(data);
}
function callback_data(data) {
    document.getElementById('callback').innerHTML = '回调参数：' + JSON.stringify(data);
}

var readyNA = false;
//轨迹
function NA() {
    readyNA = false;
    var points = new Array();
    var pointValue = document.getElementById('point').value;
    var pv = pointValue.split(',');
    for (var i = 0; i < pv.length; i += 2) {
        var point = new Object();
        point.lng = parseFloat(pv[i]);
        point.lat = parseFloat(pv[i + 1]);
        points.push(point);
    }
    var uIcon = {//小图标
        'fontColor':'',
        'bgColor': '',
        'borderColor': '',
        'bIsTransparent':false,
        'borderSize': '',
        'height': '',
        'width': '',
        'fontSize': '',
        'pos': '',
        'topOffset': '',
        'leftOffset': '',
        'lineArrow': 1,
        'image':'',//'../eMap/base/location.png', //'http://10.151.1.83:80/PGIS_S_TileMap/images/tack.gif',//../eMap/base/location.png',//http://10.151.1.83:80/PGIS_S_TileMap/images/tack.gif',
        'lineWidth': document.getElementById('lineWidth').value,
        'opacity': document.getElementById('opacity').value,
        'name': '',
        'lineColor': document.getElementById('color').value,
        'cssStyle': 'location-label'
    };

    //拼装成对象
    var marker = {
        'id': document.getElementById('Id').value,
        'points': points,
        'uIcon': uIcon
    };
    var obj = eMap.showPath(marker);
}
var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
var pi = 3.14159265358979324;
var a = 6378245.0;
var ee = 0.00669342162296594323;
function wgs_gcj_encrypts(wgLat, wgLon) {
    var point=[];


    var dLat = transformLat(wgLon - 105.0, wgLat - 35.0);
    var dLon = transformLon(wgLon - 105.0, wgLat - 35.0);
    var radLat = wgLat / 180.0 * pi;
    var magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
    var lat = wgLat + dLat;
    var lon = wgLon + dLon;
    point[0]=lon;
    point[1]=lat;
    return point;
}

function transformLat(x, y) {
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    return ret;
}

function transformLon(x, y) {
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
    return ret;
}
function transform(lat, lon) {
    var point = [];
    var dLat = transformLat(lon - 105.0, lat - 35.0);
    var dLon = transformLon(lon - 105.0, lat - 35.0);
    var radLat = lat / 180.0 * pi;
    var magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
    var mgLat = lat + dLat;
    var mgLon = lon + dLon;
    point[0]=mgLon;
    point[1]=mgLat;
    return point;
}
