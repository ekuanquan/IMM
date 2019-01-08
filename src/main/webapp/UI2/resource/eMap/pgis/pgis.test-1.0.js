/**
 * Created by Administrator on 2016/6/26.
 */
var pGis;
function initialize() {
    require.config({
        baseUrl: "../../eMap/",
        paths: {
            "pGis": ["pgis/pgis.core-1.0"],
            "css": ["base/css"]
        }
    })
    require(["pGis", "css"], function (PGis) {
        var setting = {
            containerId:"map",
            zoomLevel:{
                max:16,
                min:3,
                defaultLevel:15
            },
            overview:{
                show:true,
                width:200,
                height:200,
                maxLevel:10,
                minLevel:8
            },
            center:{x:110.286,y:25.27661},
            mapControl:{
                show:true
            },
            imagePath:"../",
            cluster:{
                gridSize:10,
                maxZoom:15,
                imageExtension:"png",
                clusterClick:markerClick
            },
            toolbox:{
                show:true,
                type:['pan','measure','circle','polygon','rect','clear']
            },
            callback:{
                pan:pan,
                measure:measure,
                circle:circle,
                polygon:polygon,
                rect:rect,
                clear:clear
            }
        };
        pGis = new PGis(setting);
        var markers = [
            {name:"芦笛派出所",id:"1",x:110.2835,y:25.30129},//芦笛派出所
            {name:"叠彩公安分局",id:"2",x:110.28923,y:25.29501},//叠彩公安分局
            {name:"北门派出所",id:"3",x:110.29616,y:25.3058},//北门派出所
            {name:"七星公安分局",id:"4",x:110.33092,y:25.2731}//七星公安分局
        ];
        pGis.loadResources(markers);
    })
}
initialize();
function pan(param){
    callback_data(param);
}
function measure(param){
    callback_data(param);
}
function circle(param){
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
function addResource(){
    var markers = [
        {name:"桂林市公安局",id:"5",x:110.28955,y:25.27974},
        {name:"桂林市旅游局",id:"6",x:110.28579,y:25.27921},
        {name:"桂林市工商局",id:"7",x:110.2855,y:25.28138},
        {name:"桂林市房产局",id:"8",x:110.28653,y:25.28046},
        {name:"桂林市档案局",id:"9",x:110.28496,y:25.28021},
        {name:"桂林市司法局",id:"10",x:110.28951,y:25.28144},
        {name:"桂林市体育局",id:"11",x:110.29257,y:25.27803},
        {name:"桂林市农业局",id:"12",x:110.28757,y:25.28798},
        {name:"白龙派出所",id:"13",x:110.29787,y:25.28569},
        {name:"桂林市文化局",id:"14",x:110.29424,y:25.27575},
        {name:"榕城派出所",id:"15",x:110.2943,y:25.27744},
        {name:"桂林市政府",id:"16",x:110.28598,y:25.27657},
        {name:"桂林市规划局",id:"17",x:110.28598,y:25.27657},
        {name:"阳桥派出所",id:"18",x:110.28425,y:25.27567},
        {name:"桂林市国土局",id:"19",x:110.28313,y:25.27513},
        {name:"丽君派出所",id:"20",x:110.27443,y:25.28125}
    ];
    pGis.addResources(markers);
}
function removeResource(){
    var ids = ["1","2","3","4"];
    pGis.removeResources(ids);
}
//研发用户 自定义接口，测试页面调用
//显示鹰眼
function p_addOverView() {
    var overViewObj = new OverView(); // 构造鹰眼对象
    overViewObj.width = document.getElementById('width').value;// 设置鹰眼的宽度，单位为像素px
    overViewObj.height = document.getElementById('height').value;// 设置鹰眼的高度
    overViewObj.minLevel = document.getElementById('minLevel').value;//设置鹰眼显示的最小地图级别
    overViewObj.maxLevel = document.getElementById('maxLevel').value;//设置鹰眼显示的最大地图级别

    var obj = pGis.addOverView(overViewObj);
    result_data(obj);
}
//轨迹显示
function p_showPathway() {
    var points = new Array();
    var pointValue = document.getElementById('point').value;
    var pv = pointValue.split(',');
    for (var i = 0; i < pv.length; i += 2) {
        var point = new Object();
        point.x = pv[i];
        point.y = pv[i + 1];
        points.push(point);
    }

    var markerObj = new Object();
    markerObj.color = document.getElementById('color').value;
    markerObj.linWidth = document.getElementById('linWidth').value;
    markerObj.opacity = document.getElementById('opacity').value;
    markerObj.arrow = document.getElementById('arrow').value;
    markerObj.points = points;

    var obj = pGis.showPathway(markerObj);
    result_data(obj);
}
//可以点击地图打标注
function p_activeClick() {
    //获取参数
    var mPoint_x = document.getElementById('am_pointx').value;
    var mPoint_y = document.getElementById('am_pointy').value;
    var index = document.getElementById('m_index').value;

    //拼装成对象
    var markerObject = new Object();

    var uIcon = new Object();//小图标
    uIcon.image = "http://10.151.1.83:80/PGIS_S_TileMap/images/tack.gif";
    uIcon.height = 32;
    uIcon.width = 32;
    uIcon.topOffset = 0;
    uIcon.leftOffset = 0;
    markerObject.uIcon = uIcon;

    /*  var point = new Object();//坐标
     point.lat = mPoint_x;//标注经度
     point.lng = mPoint_y;//标注纬度
     markerObject.point = point;*/

    //  Title(name, fontSize, pos, font, color, bgColor, borderColor, borderSize, bIsTransparent)
    var title = new Object();//标题样式
    title.name = index + "marker";
    title.fontSize = "12";
    title.pos = "7";
    title.font = "宋体";
    title.color = "#f00";
    title.bgColor = "#fff";
    title.borderColor = "#000";
    title.borderSize = "1";
    markerObject.title = title;
    //传送参数
    var obj = pGis.activeClickToAddMarker(markerObject);
    result_data(obj);
}

function p_addMarker() {
    //获取参数
    var mPoint_x = document.getElementById('am_pointx').value;
    var mPoint_y = document.getElementById('am_pointy').value;
    var index = document.getElementById('m_index').value;

    //拼装成对象
    var markerObject = new Object();

    var uIcon = new Object();//小图标
    uIcon.image = "http://10.151.1.83:80/PGIS_S_TileMap/images/tack.gif";
    uIcon.height = 32;
    uIcon.width = 32;
    uIcon.topOffset = 0;
    uIcon.leftOffset = 0;
    markerObject.uIcon = uIcon;

    var point = new Object();//坐标
    point.lat = mPoint_x;//标注经度
    point.lng = mPoint_y;//标注纬度
    markerObject.point = point;

//  Title(name, fontSize, pos, font, color, bgColor, borderColor, borderSize, bIsTransparent)
    var title = new Object();//标题样式
    title.name = index + "marker";
    title.fontSize = "12";
    title.pos = "7";
    title.font = "宋体";
    title.color = "#f00";
    title.bgColor = "#fff";
    title.borderColor = "#000";
    title.borderSize = "1";
    markerObject.title = title;
    //传送参数
    var obj = pGis.addMarker(markerObject);
    result_data(obj);
}
//修改标注
function p_editMarker() {
    //p_clearMarker();//清除
    //获取参数
    var mPoint_x = document.getElementById('am_pointx').value;
    var mPoint_y = document.getElementById('am_pointy').value;
    var index = document.getElementById('m_index').value;

    //拼装成对象
    var markerObject = new Object();
    markerObject.index = index;
    var uIcon = new Object();//小图标
    uIcon.image = "http://10.151.1.83:80/PGIS_S_TileMap/images/tack.gif";
    uIcon.height = 32;
    uIcon.width = 32;
    uIcon.topOffset = 0;
    uIcon.leftOffset = 0;
    markerObject.uIcon = uIcon;

    var point = new Object();//坐标
    point.lat = mPoint_x;//标注经度
    point.lng = mPoint_y;//标注纬度
    markerObject.point = point;

//  Title(name, fontSize, pos, font, color, bgColor, borderColor, borderSize, bIsTransparent)
    var title = new Object();//标题样式
    title.name = index + ":修改后marker";
    title.fontSize = "12";
    title.pos = "7";
    title.font = "宋体";
    title.color = "#f00";
    title.bgColor = "#fff";
    title.borderColor = "#000";
    title.borderSize = "1";
    markerObject.title = title;
    //传送参数
    var obj = pGis.editMarker(markerObject);
    result_data(obj);
}

//打开气泡
function p_openInfoWindowHtml() {
    var index = document.getElementById('m_index').value;
    var markerObj = new Array();
    var htmlStyle = '<div style="border:1px solid #2a20ff;background:#aeffff;width:300px;height:200px;">1234</div>'
    markerObj.htmlStyle = htmlStyle;
    markerObj.index = index;//标注序号
    //传送参数
    var obj = pGis.openInfoWindowHtml(markerObj);
    result_data(obj);
}
//打开气泡
function p_closeInfoWindowHtml() {
    var index = document.getElementById('m_index').value;
    var markerObj = new Array();
    markerObj.index = index;//标注序号
    //传送参数
    var obj = pGis.closeInfoWindowHtml(markerObj);
    result_data(obj);
}
//停止移动指定标注
function p_stopMoveMarker() {
    var index = document.getElementById('m_index').value;
    var markerObj = new Array();
    markerObj.index = index;//标注序号
    //传送参数
    var obj = pGis.stopMoveMarker(markerObj);
    result_data(obj);
}
//移动指定标注
function p_startMoveMarker() {
    var index = document.getElementById('m_index').value;
    var markerObj = new Array();
    markerObj.index = index;//标注序号
    //传送参数
    var obj = pGis.startMoveMarker(markerObj);
    result_data(obj);
}
//在地图上删除所有的叠加对象
function p_clearMarker() {
    var obj = pGis.clearMarker();
    result_data(obj);
}
//在地图上删除指定的叠加对象
function p_removeOverlay() {
    var index = document.getElementById('m_index').value;
    var overlayObj = new Array();
    overlayObj.index = index;//标注序号
    //传送参数
    var obj = pGis.removeOverlay(overlayObj);
    result_data(obj);
}
//获取级别
function p_getZoomLevel() {

    var obj = pGis.getZoomLevel();
    result_data(obj);
}
//获取中心点
function p_getCenter() {
    var obj = pGis.getCenter();
    result_data(obj);
}

function getDrawCircle(){//测试地图画圆
    pGis.setDrawMode("circle");
}
function getMapPan(){//测试地图平移
    pGis.setDrawMode("pan");
}
function getDrawLine(){//测试地图上画线
    pGis.setDrawMode("polyLine");

}
function getDrawRect(){//测试地图上画矩形
    pGis.setDrawMode("rect");
}
function getDrawPolygon(){//测试地图上画多边形
    pGis.setDrawMode("polygon");
}
function getClear(){//清除画图痕迹
    pGis.setDrawMode("clear");
}
function p_fullExtent() {
    var obj = pGis.fullExtent();
    result_data(obj);
}
//返回结果
function result_data(data) {
    document.getElementById('result').innerHTML = '返回结果：' + JSON.stringify(data);
}
function callback_data(data) {
    document.getElementById('callback').innerHTML = '回调参数：' + JSON.stringify(data);
}