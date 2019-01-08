/**
 * Created by admin on 2016/6/23.
 */
var gMap;
var rType = {
    face: {
        label: "人脸卡口",
        icon: "../images/face.png"
    },
    device: {
        label: "监控设备",
        icon: "../images/device.png"
    },
    police: {
        label: "警力资源",
        icon: "../images/police.png"
    }
};
function initialize() {
    require.config({
        baseUrl: "../../eMap/",
        paths: {
            "gMap": ["google/gMap.core-1.0"],
            "css": ["base/css"]
        }
    })
    require(["gMap", 'css'], function (GMap) {
        var setting = {
            containerId: "map",
            mapServer: "http://10.0.20.98:2098/",
            zoomLevel: {
                max: 20,
                min: 1,
                defaultLevel: 15
            },
            overview: {
                show: true,
                width: 200,
                height: 200,
                maxLevel: 10,
                minLevel: 8
            },
            center: {lng: 110.286, lat: 25.27661},
            rType: rType,
            mapControl: {
                show: true
            },
            imagePath: "../",
            cluster: {
                gridSize: 10,
                clusterClick: markerClick
            },
            toolbox: {
                show: true,
                type: ['pan', 'measure', 'circle', 'polygon', 'rect', 'clear']
            },
            callback: {
                measure: measure,
                circle: circle,
                polygon: polygon,
                rect: rect,
                clear: clear,
                map_click: mapClick
            }
        };
        gMap = new GMap(setting);
        var markers = [
            {name: "芦笛派出所", id: "1", lng: 110.2835, lat: 25.30129, type: 'face'},//芦笛派出所
            {name: "叠彩公安分局", id: "2", lng: 110.28923, lat: 25.29501, type: 'device'},//叠彩公安分局
            {name: "北门派出所", id: "3", lng: 110.29616, lat: 25.3058, type: 'police'},//北门派出所
            {name: "七星公安分局", id: "4", lng: 110.33092, lat: 25.2731, type: 'face'}//七星公安分局
        ];
        setTimeout(function () {
            gMap.loadResources(markers);
        }, 1000);
    })
}
initialize();
function createTypes() {
    var $father = document.getElementById();
    for (var i in rType) {

    }
}
function pan(param) {
    callback_data(param);
}
function measure(param) {
    callback_data(param);
}
function circle(param) {
    callback_data(param);
}
function polygon(param) {
    callback_data(param);
}
function rect(param) {
    callback_data(param);
}
function clear(param) {
    callback_data(param);
}
function markerClick(param) {
    callback_data(param);
}
function addResource() {
    var markers = [
        {name: "桂林市公安局", id: "5", lng: 110.28955, lat: 25.27974, type: 'face'},
        {name: "桂林市旅游局", id: "6", lng: 110.28579, lat: 25.27921, type: 'police'},
        {name: "桂林市工商局", id: "7", lng: 110.2855, lat: 25.28138, type: 'face'},
        {name: "桂林市房产局", id: "8", lng: 110.28653, lat: 25.28046, type: 'device'},
        {name: "桂林市档案局", id: "9", lng: 110.28496, lat: 25.28021, type: 'police'},
        {name: "桂林市司法局", id: "10", lng: 110.28951, lat: 25.28144, type: 'face'},
        {name: "桂林市体育局", id: "11", lng: 110.29257, lat: 25.27803, type: 'police'},
        {name: "桂林市农业局", id: "12", lng: 110.28757, lat: 25.28798, type: 'face'},
        {name: "白龙派出所", id: "13", lng: 110.29787, lat: 25.28569, type: 'device'},
        {name: "桂林市文化局", id: "14", lng: 110.29424, lat: 25.27575, type: 'device'},
        {name: "榕城派出所", id: "15", lng: 110.2943, lat: 25.27744, type: 'face'},
        {name: "桂林市政府", id: "16", lng: 110.28598, lat: 25.27657, type: 'police'},
        {name: "桂林市规划局", id: "17", lng: 110.28598, lat: 25.27657, type: 'device'},
        {name: "阳桥派出所", id: "18", lng: 110.28425, lat: 25.27567, type: 'police'},
        {name: "桂林市国土局", id: "19", lng: 110.28313, lat: 25.27513, type: 'device'},
        {name: "丽君派出所", id: "20", lng: 110.27443, lat: 25.28125, type: 'device'}
    ];
    gMap.addResources(markers);
}
function removeResource() {
    var ids = ["1", "2", "3", "4"];
    gMap.removeResources(ids);
}

//获取级别
function getZoomLevel() {
    var obj = gMap.getZoomLevel();
    result_data(obj);
}
function setCommonMode() {
    gMap.setMapMode('common');
}
function setLocationMode() {
    gMap.setMapMode('location');
}
function mapClick(param) {
    var x = param['original']['lng'];
    var y = param['original']['lat'];
    document.getElementById('pointx').value = x;
    document.getElementById('pointy').value = y;
    callback_data(param);
}
function setCenterByResource() {
    var id = document.getElementById('Id').value;
    gMap.setCenterByResource(id);
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
    gMap.addRAlarm(alarms);
}
function removeAlarm() {
    var alarms = ["3", "1", "2", '4'];
    gMap.removeRAlarm(alarms);
}
function clearAlarm() {
    gMap.clearRAlarm();
}
function showResourceType() {
    var face = document.getElementById("face").value;
    var police = document.getElementById("police").value;
    var device = document.getElementById("device").value;
    var types = [];
    if (face == 0)
        types.push("face");
    if (police == 0)
        types.push("police");
    if (device == 0)
        types.push("device");
    gMap.setCTypes(types);
}
function getRoundResources() {
    var center = {};
    center['lng'] = document.getElementById('pointx').value;
    center['lat'] = document.getElementById('pointy').value;
    var distance = document.getElementById('distance').value;
    var data = gMap.getRoundResources(center, distance);
    result_data(data);
}
/********************** by lzc start *************************/
//添加标注
function addMarker() {
    var uIcon = {//小图标
        //'bgColor': "#ffffff",
        //'borderColor': "#000000",
        // 'borderSize': 1,
        //'height': 32,
        //'width': 32,
        //'fontSize': '',
        // 'pos': '7',
        //'topOffset': 0,
        //'leftOffset': 0,
        'image': '',
        'lineWidth': document.getElementById('lineWidth').value,
        'opacity': document.getElementById('opacity').value,
        'name': '一个标注',
        'color': document.getElementById('color').value,
        'cssStyle': 'location-label'
    };
    var point = {//坐标
        'lat': document.getElementById('pointy').value,//标注经度
        'lng': document.getElementById('pointx').value//标注纬度
    };
    //拼装成对象
    var marker = {
        'id': document.getElementById('Id').value,
        'point': point,
        'uIcon': uIcon
    };
    var obj = gMap.addMarker(marker);
    result_data(obj);
    callback_data(marker);
}
//修改标注
function editMarker() {
    var uIcon = {//小图标
        //'bgColor': "#ffffff",
        //'borderColor': "#000000",
        // 'borderSize': 1,
        //'height': 32,
        //'width': 32,
        //'fontSize': '',
        // 'pos': '7',
        //'topOffset': 0,
        //'leftOffset': 0,
        'image': '',
        'lineWidth': document.getElementById('lineWidth').value,
        'opacity': document.getElementById('opacity').value,
        'name': '一个标注',
        'color': document.getElementById('color').value,
        'cssStyle': 'location-label'
    };
    var point = {//坐标
        'lat': document.getElementById('pointy').value,//标注经度
        'lng': document.getElementById('pointx').value//标注纬度
    };
    //拼装成对象
    var marker = {
        'id': document.getElementById('Id').value,
        'point': point,
        'uIcon': uIcon
    };
    var obj = gMap.editMarker(marker);
    result_data(obj);
    callback_data(marker);
}
//在地图上删除指定的叠加对象
function removeMarker() {
    var id = document.getElementById('Id').value;
    var obj = gMap.deleteMarker(id);
    callback_data(id);
}
//打开气泡
function openInfoWindow() {
    var point = {
        lng: document.getElementById('pointx').value,
        lat: document.getElementById('pointy').value
    };
    var strHtml = '<div id="dddWin" style="border:1px solid #f00;width: 200px;height: 200px;"><div>地图标题：</div><div>具体内容具体内容具体内容具体内容</div><div><button>确定</button></div></div>';
    gMap.openInfoWindow(point,strHtml);
}
function closeInfoWindow() {
    gMap.closeInfoWindow();
}
//获取中心点
function getCenter() {
    var obj = gMap.getCenter();
    result_data(obj)
}
//设置中心点
function setCenter() {
    var point = {
        'lat': document.getElementById('pointy').value,
        'lng': document.getElementById('pointx').value
    };
    gMap.setCenter(point);
    callback_data(point);
}
//设置级别
function setZoomLevel() {
    var zoomLevel = document.getElementById('zoomLevel').value;
    gMap.setZoomLevel(zoomLevel);
}
//轨迹
function showPathWay() {
    var points = new Array();
    var pointValue = document.getElementById('point').value;
    var pv = pointValue.split(',');
    for (var i = 0; i < pv.length; i += 2) {
        var point = new Object();
        point.lng = pv[i];
        point.lat = pv[i + 1];
        points.push(point);
    }
    var uIcon = {//小图标
        //'bgColor': "#ffffff",
        //'borderColor': "#000000",
        // 'borderSize': 1,
        //'height': 32,
        //'width': 32,
        //'fontSize': '',
        // 'pos': '7',
        //'topOffset': 0,
        //'leftOffset': 0,
        'image': '',
        'lineWidth': document.getElementById('lineWidth').value,
        'opacity': document.getElementById('opacity').value,
        'name': '',//'一个标注',
        'color': document.getElementById('color').value,
        'cssStyle': ''//'location-label'
    };

    //拼装成对象
    var marker = {
        'id': document.getElementById('Id').value,
        'points': points,
        'uIcon': uIcon
    };
    var obj = gMap.showPathWay(marker);
    result_data(obj);
    callback_data(marker);
}
//清除轨迹
function clearPathWay() {
    var id = document.getElementById('Id').value;
    gMap.clearPathWay(id);
    callback_data(id);
}
/********************** by lzc end *************************/

//返回结果
function result_data(data) {
    document.getElementById('result').innerHTML = '返回结果：' + JSON.stringify(data);
}
function callback_data(data) {
    document.getElementById('callback').innerHTML = '回调参数：' + JSON.stringify(data);
}