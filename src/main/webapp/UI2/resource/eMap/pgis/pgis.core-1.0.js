/**
 * Created by Administrator on 2016/6/26.
 */
define(['require', 'base/jTop', 'base/bMap','pgis/MarkerCluster'], function (require) {
	var jTop = require('base/jTop');
	var MarkerCluster = require('pgis/MarkerCluster');
    (function (global, win) {
        global.PGis = function (setting) {
            global.fn.extend(global.PGis, global.BMap);
            this.init(setting);
        };
        global.PGis.prototype = {
            uEzMap: null,
            markers: {},
            customPolygon: [],//画图对象的集合
            //infoWindowOptions: null,//气泡保存容器
            pathWay: {},//轨迹的标注和路线保存容器
            pathWayCluster:null,
            //I）********初始化
            initMap: function (setting, doc) {
                var _self = this;
                _self.uEzMap = new EzMap(doc);
                //2）********初始化地图，并显示地图
                _self.uEzMap.initialize();
                var center = new Point(parseFloat(setting['center']['lng']), parseFloat(setting['center']['lat']));
                _self.uEzMap.centerAndZoom(center, setting['zoomLevel']['defaultLevel']);
                var overView = setting['overview'];
                if(overView['show']){
                    // 构造鹰眼对象
                    var ov=new OverView();
                    ov.width=overView['width'];// 设置鹰眼的宽度，单位为像素px
                    ov.height=overView['height'];// 设置鹰眼的高度
                    ov.maxLevel=overView['maxLevel'];// 设置鹰眼显示的最大地图级别
                    ov.minLevel=overView['minLevel'];// 设置鹰眼显示的最小地图级别
                    _self.uEzMap.addOverView(ov);
                }
                setting['mapControl']['show'] ? _self.uEzMap.showMapCtrl() : null;
                if(_self.getIsNeedCluster()){
                    var b = setting['cluster'];
                    b['imagePath'] = setting['imagePath'] + "base/skin/images/cluster/m";
                    b['rType'] = setting['rType'];
                    _self.markerCluster = new MarkerCluster(_self.uEzMap,null,setting['cluster']);
                }
                if(typeof setting['callback']['map_click'] === 'function'){
                    _self.uEzMap.addMapEventListener(EzEvent.MAP_CLICK,function(param){
                        var param = {
                            lng:param['mapPoint']['x'],
                            lat:param['mapPoint']['y']
                        }
                        if(_self.mode === 'location'){
                            _self.addLocation(param);
                        }
                        _self._callback('map_click',param);
                    })
                }
                if(!_self.getIsNeedCluster()){
                    _self.uEzMap.addMapEventListener(EzEvent.MAP_ZOOMEND,function(event){
                        _self._showVisualAreaResources();
                    });
                    _self.uEzMap.addMapEventListener(EzEvent.MAP_PANEND,function(event){
                        _self._showVisualAreaResources();
                    });
                }
            },
            _showVisualAreaResources:function(){
                var _self = this;
                var surplus = _self.surplus;
                var _surplus = _self.surplus = {};
                var bounds = _self.uEzMap.getBoundsLatLng();
                var cTypes = _self.cTypes;
                var overlays = _self.customPolygon;
                var mbr;
                for(var i in surplus){
                    var resource = surplus[i];
                    var point = new Point(resource['lng'],resource['lat']);
                    var type = resource['type'];
                    var isType = !type || !cTypes || cTypes.length && cTypes.indexOf(type) != -1;
                    var contain = !(overlays&&overlays.length>0);
                    for(var j = 0,overlay;overlay=overlays[j];j++){
                        mbr = overlay.getMBR();
                        if(mbr.containsPoint(point)){
                            contain = true;
                        }
                    }
                    if(isType&&bounds.containsPoint(point)&&contain){
                        var marker = _self.createRMarker(resource);
                        _self.rMarker[resource['id']] = marker;
                    }
                    else{
                        _surplus[resource['id']] = resource;
                    }
                }
                _self.surplus = _surplus;
            },
            createRMarker:function(resource){
                var _self = this;
                var location = new Point(resource['lng'],resource['lat']);
                var setting = _self.setting;
                var _uIcon = new Icon();
                _uIcon.image = resource['icon'] || (setting['rType'] && resource['type'] && setting['rType'][resource['type']]['icon']) || _self.setting['imagePath'] + "base/skin/images/cluster/m0.png"
                _uIcon.height = 32;
                _uIcon.width = 32;
                _uIcon.topOffset = 0;
                _uIcon.leftOffset = 0;
                var marker = new Marker(location, _uIcon);
                if(!_self.getIsNeedCluster()){
                    marker['resource'] = resource;
                    var setting = _self['setting'];
                    marker.addListener("click", function (param) {
                        var callback = _self._callback;
                        var param = {
                            type:'cluster_click',
                            original:{
                                lng:marker['point']['x'],
                                lat:marker['point']['y']
                            },
                            data:marker['resource']
                        }
                        var callback = setting['cluster']['clusterClick'];
                        typeof callback === 'function' ? callback(param) : null;
                    });
                }
                marker.defaultIcon = _uIcon.image;
                _self.uEzMap.addOverlay(marker);
                var setting = _self['setting'];
                marker['resource'] = resource;
                marker.addListener("click", function (param) {
                    var param = {
                        type:'cluster_click',
                        original:{
                            lng:marker['point']['x'],
                            lat:marker['point']['y']
                        },
                        data:marker['resource']
                    }
                    var callback = setting['cluster']['clusterClick'];
                    typeof callback === 'function' ? callback(param) : null;
                });
                return marker;
            },
            _loadResources:function(resources){
                var _self = this;
                var isNeedCluster = _self.getIsNeedCluster();
                var _rMarker = _self.rMarker;
                var surplus = _self.surplus = {};
                if(!_self.getIsNeedCluster()){
                    if(_rMarker){
                        for(var i in _rMarker){
                            _self.uEzMap.removeOverlay(_rMarker[i]);
                        }
                    }
                }
                _self.resources = {};
                _rMarker = {};
                _self.clearCustomPolygon();
                var bounds = _self.uEzMap.getBoundsLatLng();
                for(var i = 0,resource;resource = resources[i];i++){
                    _self.resources[resource['id']] = resource;
                    if(!isNeedCluster){
                        var point = new Point(resource['lng'],resource['lat']);
                        if(bounds.containsPoint(point)){
                            var marker = _self.createRMarker(resource);
                            _rMarker[resource['id']] = marker;
                        }
                        else{
                            surplus[resource['id']] = resource;
                        }
                    }
                }
                _self.surplus = surplus;
                _self.rMarker = _rMarker;
                if(isNeedCluster&&_self.markerCluster){
                    _self.markerCluster.loadMarkers(_self.resources);
                }
            },
            _addResources:function(resources){
				var _self = this;
                var _resource = {};
                var isNeedCluster = _self.getIsNeedCluster();
                if(!_self.rMarker)
                    _self.rMarker = {};
                var surplus = _self.surplus;
                var bounds = _self.uEzMap.getBoundsLatLng();
                for(var i = 0,resource;resource = resources[i];i++){
                    if(!_self.resources.hasOwnProperty(resource['id'])){
                        _self.resources[resource['id']] = resource;
                        _resource[resource['id']] = resource;
                        if(!isNeedCluster){
                            var point = new Point(resource['lng'],resource['lat']);
                            if(bounds.containsPoint(point)){
                                var marker = _self.createRMarker(resource);
                                _self.rMarker[resource['id']] = marker;
                            }
                            else{
                                surplus[resource['id']] = resource;
                            }
                        }
                    }
                }
                _self.surplus = surplus;
                if(isNeedCluster&&_self.markerCluster){
                    _self.markerCluster.setMarkers(_self.resources);
                    _self.markerCluster.addMarkers(_resource);
                }
                _self.getIntraAreaResource();
			},
            _editResourcesIcon:function(resources){
                if(window.console)
                    window.console.log("未实现");
            },
            _removeResources:function(ids){
                var _self = this;
                var surplus = _self.surplus;
                var isNeedCluster = _self.getIsNeedCluster();
                if(ids&&ids.length>0&& _self.resources){
                    for(var i = 0,value;value = ids[i];i++){
                        delete _self.resources[value];
                        if(!isNeedCluster){
                            if(_self.rMarker.hasOwnProperty(value)){
                                _self.uEzMap.removeOverlay(_self.rMarker[value])
                                delete _self.rMarker[value];
                            }
                            delete surplus[value];
                        }
                    }
                    if(isNeedCluster&&_self.markerCluster){
                        _self.markerCluster.loadMarkers(_self.resources);
                    }
                    _self.getIntraAreaResource();
                }
            },
            showIntraAreaResources:function(resources){
                var _self = this;
                if(_self.getIsNeedCluster()&&_self.markerCluster){
                    this.markerCluster.showIntraAreaMarkers(resources);
                }
            },
            getRoundResources:function(point,radius){
                var _self = this;
                var center = new Point(point['lng'],point['lat']);
                radius = _self.uEzMap.getDegree(center,radius);
                var circle = point['lng'] + "," + point["lat"] + "," + radius;
                var _pCircle = new Circle(circle, "#ff00FF", 2, 0.5, "green");
                var mbr = _pCircle.getMBR();
                var resource = _self.getResources(mbr);
                return resource['list'];
            },
            getResources:function(mbr){
                var _self = this;
                var list=[];
                var resources = _self.resources;
                var _resource = {};
                var isNeedCluster = !_self.getIsNeedCluster();
                var bounds = _self.uEzMap.getBoundsLatLng();
                if(mbr){
                    for(var i in resources){
                        var resource = resources[i];
                        var point = new Point(resource['lng'],resource['lat']);
                        if(mbr.containsPoint(point)){
                            list.push(resource);
                            _resource[i] = resource;
                        }
                    }
                }
                else{
                    var overlays = _self.customPolygon;
                    var rMarker = _self.rMarker;
                    for(var i in resources){
                        var resource = resources[i];
                        var point = new Point(resource['lng'],resource['lat']);
                        var type = resource['type'];
                        var contain = !(overlays&&overlays.length>0);
                        var cTypes = _self.cTypes;
                        var isType = !type || !cTypes || cTypes.length && cTypes.indexOf(type) != -1;
                        for(var j = 0,overlay;overlay=overlays[j];j++){
                            mbr = overlay.getMBR();
                            if(mbr.containsPoint(point)){
                                contain = true;
                            }
                        }
                        var marker = rMarker[i];
                        if(isNeedCluster){
                            if(marker)
                                marker.setZIndex(-1);
                            else{
                                if(contain&&bounds.containsPoint(point)&&isType){
                                    var marker = _self.createRMarker(resource);
                                    _self.rMarker[resource['id']] = marker;
                                    delete _self.surplus[i];
                                }
                            }
                        }
                        if(contain&&isType){
                            if(isNeedCluster){
                                if(marker){
                                    marker.setZIndex(110);
                                }
                            }
                            list.push(resource);
                            _resource[i] = resource;
                        }
                    }
                }
                var result = {};
                result['list'] = list;
                result['resource'] = _resource;
                return result;
            },
			getIntraAreaResource:function(){
				var _self = this;
                var resource = _self.getResources();
                _self.showIntraAreaResources(resource['resource']);
                return resource['list'];
			},
            setCenterByResource:function(id){
                var _self = this;
                var point = null;
                if(_self.getIsNeedCluster()&&_self.markerCluster){
                    point =  _self.markerCluster.getClusterByMarker(id);
                }
                else{
                    var marker = _self.rMarker[id];
                    if(marker){
                        point = {
                            lng:marker['point']['x'],
                            lat:marker['point']['y']
                        }
                    }
                }
                if(!point){
                    var resource = _self.resources[id];
                    point = {
                        lng:resource['lng'],
                        lat:resource['lat']
                    }
                }
                if(point)
                    _self.setCenter(point);
            },
            //）********构造鹰眼对象
            addOverView: function (overView) {
                if (overView) {
                    var ov = new OverView(); // 构造鹰眼对象
                    ov.width = overView.width || 150;// 设置鹰眼的宽度，单位为像素px
                    ov.height = overView.height || 150;// 设置鹰眼的高度
                    ov.maxLevel = overView.maxLevel || 20;//设置鹰眼显示的最大地图级别
                    ov.minLevel = overView.minLevel || 0;//设置鹰眼显示的最小地图级别
                    this.uEzMap.addOverView(ov);// 添加鹰眼对象到地图对象中
                }
            },
            //）********隐藏鹰眼
            hideOverView: function (overViewObj) {
                this.uEzMap.hideOverView();
            },
            //）********鹰眼显示、不显示来回切换。当显示时切换为不显示；当不显示时切换为显示
            reverseOverView: function () {
                this.uEzMap.reverseOverView();
            },
            createIcon:function(icon){
                var uIcon = new Icon();
                uIcon.image = icon.image || this.setting.imagePath + 'base/skin/images/cluster/m0.png' || "http://10.151.1.83:80/PGIS_S_TileMap/images/tack.gif";
                uIcon.height = icon.height || 32;
                uIcon.width = icon.width || 32;
                uIcon.topOffset = icon.topOffset||icon.topOffset==0 ? icon.topOffset : -(icon.height || 32)/2;
                uIcon.leftOffset = icon.leftOffset||icon.leftOffset==0 ? icon.leftOffset : 0;
                return uIcon;
            },
            addLocation:function(location){
                var _self = this;
                _self.removeLocation();
                var icon = {
                    image:_self.setting.mode.locationStyle.image||_self.setting.imagePath + 'base/skin/images/location.png',
                    width:_self.setting.mode.locationStyle.width||32,
                    height:_self.setting.mode.locationStyle.height||32,
                    topOffset:-(_self.setting.mode.locationStyle.height||32)/2,
                    leftOffset:0
                }
                var uIcon = _self.createIcon(icon);
                var point = new Point(location['lng'],location['lat']);
                var name = _self.setting.mode.locationStyle.title;
                var title;
                if(name){
                    title = new Title(name.toString(),16,7,"宋体","#ff0000",null,null,"2",1);
                }
                var marker = new Marker(point, uIcon, title);//标注
                _self.uEzMap.addOverlay(marker);//生成标注图标
                if(marker['title']){
                    marker['title'].div.style.border = "none";
                }
                if (marker) {
                    marker.startMove(function(param){
                        var param = {
                            lng:marker['point']['x'],
                            lat:marker['point']['y']
                        }
                        if(_self.mode === 'location'){
                            _self._callback('map_click',param);
                        }
                    });
                }
                _self.location = marker;
            },
            removeLocation:function(){
                var _self = this;
                if(_self.location){
                    _self.location.stopMove();
                    _self.uEzMap.removeOverlay(_self.location);
                }
            },
            /*addRAlarm: function (alarms) {
                var _self = this;
                for (var i = 0, alarm; alarm = alarms[i]; i++) {
                    if(i==0){
                        var resource = _self.resources[alarm['id']];
                        if(resource){
                            var param = {
                                lng:resource['lng'],
                                lat:resource['lat']
                            }
                            _self.setCenter(param);
                        }
                    }
                    _self.rAlarms[alarm['id']] = alarm;
                }
                if (!_self.rAlarmTimer)
                    _self.startRAlarm();
            },*/
            /*removeRAlarm: function (alarmIds) {
                var _self = this;
                var isNeedCluster = _self.getIsNeedCluster();
                for (var i = 0, id; id = alarmIds[i]; i++) {
                    delete _self.rAlarms[id];
                    _self._setMarkerIcon(id);
                }
                var isEmpty = true;
                for (var i in _self.rAlarms) {
                    isEmpty = false;
                    break;
                }
                if (isEmpty) {
                    _self.clearRAlarm();
                }
            },*/
            /*startRAlarm: function () {
                var _self = this;
                var flag = "highlight";
                if (!_self.rAlarmTimer) {
                    _self.rAlarmTimer = setInterval(function () {
                        var rAlarms = _self.rAlarms;
                        for (var i in rAlarms) {
                            var icon = flag === "highlight" ?
                            rAlarms[i]['highlightIcon'] || _self.setting.imagePath + "base/skin/images/alarm.png":
                                null;
                            _self._setMarkerIcon(rAlarms[i]['id'],icon);
                        }
                        flag = flag === "highlight" ? "normal" : "highlight";
                    }, 1000);
                }
            },*/
           /* clearRAlarm: function () {
                var _self = this;
                var rAlarms = _self.rAlarms;
                clearInterval(_self.rAlarmTimer);
                _self.rAlarmTimer = null;
                for (var i in rAlarms) {
                    _self._setMarkerIcon(rAlarms[i]['id']);
                }
                _self.rAlarms = {};
            },*/
            _setResourceIcon:function(id,icon){
                var _self = this;
                if(_self.getIsNeedCluster()){
                    _self.markerCluster.setIcon(id,icon);
                }
                else{
                    var rMarker = _self.rMarker;
                    if(rMarker.hasOwnProperty(id)){
                        var marker = rMarker[id];
                        marker.div.src = icon || marker.defaultIcon;
                    }
                }
            },
            openInfoWindow: function (point,strHTML,bIsInScreen) {
                var _self = this;
                var point = new Point(point['lng'],point['lat']);
                _self.uEzMap.openInfoWindow(point,strHTML,bIsInScreen);
                var userAgent = navigator.userAgent;
                if(userAgent.indexOf('Firefox')>-1){
                    var $divs = document.querySelectorAll("#windowDiv >div");
                    var $winDiv = document.querySelector("#winDiv");
                    $divs[0].style.background = 'url("http://10.151.1.83/PGIS_S_TileMap/images/iw_nw.png") no-repeat';
                    $divs[1].style.background = 'url("http://10.151.1.83/PGIS_S_TileMap/images/iw_n.png")  no-repeat';
                    $divs[2].style.background = 'url("http://10.151.1.83/PGIS_S_TileMap/images/iw_ne.png")  no-repeat';
                    $divs[3].style.background = 'url("http://10.151.1.83/PGIS_S_TileMap/images/iw_w.png")  no-repeat';
                    $divs[4].style.background = 'url("http://10.151.1.83/PGIS_S_TileMap/images/iw_c.png")  no-repeat';
                    $divs[5].style.background = 'url("http://10.151.1.83/PGIS_S_TileMap/images/iw_e.png")  no-repeat';
                    $divs[6].style.background = 'url("http://10.151.1.83/PGIS_S_TileMap/images/iw_sw.png")  no-repeat';
                    $divs[7].style.background = 'url("http://10.151.1.83/PGIS_S_TileMap/images/iw_s.png")  no-repeat';
                    $divs[8].style.background = 'url("http://10.151.1.83/PGIS_S_TileMap/images/iw_tap.png")  no-repeat';
                    $divs[9].style.background = 'url("http://10.151.1.83/PGIS_S_TileMap/images/iw_s.png")  no-repeat';
                    $divs[10].style.background = 'url("http://10.151.1.83/PGIS_S_TileMap/images/iw_se.png")  no-repeat';
                }
            },
            closeInfoWindow: function () {
                this.uEzMap.closeInfoWindow();
            },
            removeMarker:function(id){
                if(id){
                    var _self = this;
                    var marker = _self.markers[id];
                    if(marker){
                        _self.uEzMap.removeOverlay(marker);
                        delete _self.markers[id];
                    }
                }
            },
            //）********在地图上删除所有的叠加对象
            clearMarker: function () {
                this.uEzMap.clearOverlays();
                this.markers.splice(0);//删除标注数组中对应元素
            },
            //）********绘制模式 取值为（"measure"：测量；"pan"：平移模式；"drawPoint"：获取坐标点；"drawCircle"：画圆；"drawRect"：画矩形；"drawPolyline"：画线；"drawPolygon"：画多边形）
            getDragMode: function () {
                var dragMode = this.uEzMap.getDragMode();
                var cpObj = new Object();
                cpObj.dragMode = dragMode;
                return cpObj;
            },
            _showMeasureLength: function (polyline) {
                var _self = this;
                var lengthInMeters = polyline.getLength();
                var lenghtUnit = "米";
                if (lengthInMeters > 1000) {
                    lengthInMeters = (lengthInMeters / 1000).toFixed(3);
                    if (lengthInMeters > 1000)
                        lengthInMeters = Math.floor(lengthInMeters);
                    lenghtUnit = "公里";
                }
                var paths = polyline.getPoints(),
                    position = paths[paths.length - 1];
                _self._callback('measure',lengthInMeters + lenghtUnit);
                _self._showAreaLabel("总长度" + lengthInMeters + lenghtUnit, position);
            },
            _showAreaLabel: function (areaValue, position) {
                var _self = this;
                if (!_self.areaTitle) {
                    _self.areaTitle = new Title(areaValue,14,null,'宋体','black','#ffffff',null);
                    _self.areaTitle.setPoint(position);
                    _self.uEzMap.addOverlay(_self.areaTitle);
                } else {
                    _self.areaTitle.setPoint(position)
                    _self.areaTitle.setName(areaValue.toString());
                }

            },
            setDrawMode: function (mode) {//在地图上画线
                var _self = this;
                switch (mode) {
                    case 'pan'://地图平移
						_self.uEzMap.changeDragMode('pan');
                        break;
                    case 'measure'://测量距离
						_self.uEzMap.changeDragMode('drawPolyline', null, null, function (param) {
                            _self.setDrawIcon('pan');
                            _self.setDrawIcon('pan');
                            var lineArr = param.split(",");
                            var overlay = {};
                            var points = [];
                            for (var i = 0; i < lineArr.length - 2; i += 2) {
                                var point = {
                                    lng1: lineArr[i],
                                    lat1: lineArr[i + 1],
                                    lng2: lineArr[i + 2],
                                    lat2: lineArr[i + 3]
                                }
                                points.push(point);
                            }
                            overlay['points'] = points;
                            _self.drawLine(overlay,mode);
                            _self._showMeasureLength(_self.measurePolygon);
                        });
                        break;
                    case 'rect'://在地图上画矩形
						_self.uEzMap.changeDragMode("drawRect", null, null, function (param) {
                            _self.setDrawIcon('pan');
			                var rectArr = param.split(",");
                            var overlay = {};
                            var pRectangle = [];
                            for (var i = 0; i < rectArr.length - 2; i += 2) {
                                var point = {
                                    lng1: rectArr[i],
                                    lat1: rectArr[i + 1],
                                    lng2: rectArr[i + 2],
                                    lat2: rectArr[i + 3]
                                }
                                pRectangle.push(point);
                            }
                            overlay['pRectangle'] = pRectangle;
                            _self.drawRect(overlay);
							_self._callback(mode,pRectangle);
                        });
                        break;
                    case 'circle'://在地图上画圆
						_self.uEzMap.changeDragMode("drawCircle", null, null, function (param) {
                            _self.setDrawIcon('pan');
                            var circleArr = param.split(",");
                            var overlay = {};
                            var cPoints = [];
                            var cPoint = {
                                lng: circleArr[0],
                                lat: circleArr[1],
                                r: circleArr[2]
                            };
                            cPoints.push(cPoint);
                            overlay['cPoints'] = cPoints;
                            _self.drawCircle(overlay);
							_self._callback(mode,cPoint);
                        });
                        break;
                    case 'polyline'://在地图上画线 如:"116.56,39.25,116.78,39.12",句法：(x,y[,x,y]+)）
						_self.uEzMap.changeDragMode("drawPolyline", null, null, function (param) {
                            _self.setDrawIcon('pan');
                            var lineArr = param.split(",");
                            var overlay = {};
                            var points = [];
                            for (var i = 0; i < lineArr.length - 2; i += 2) {
                                var point = {
                                    lng1: lineArr[i],
                                    lat1: lineArr[i + 1],
                                    lng2: lineArr[i + 2],
                                    lat2: lineArr[i + 3]
                                }
                                points.push(point);
                            }
                            overlay['points'] = points;
                            _self.drawLine(overlay);
							_self._callback(mode,points);
                        });
                        break;
                    case 'polygon'://在地图上画多边形 如"116.3236,39.85558,116.39098,40.00402,116.52281,39.96007,116.3236,39.85558;116.39684,39.94054,116.41735,39.95323,116.41832,39.93859,116.39684,39.94054"；句法：(x,y[,x,y]+) [;(x,y[,x,y]+)]*）
						_self.uEzMap.changeDragMode("drawPolygon", null, null, function (param) {
                            _self.setDrawIcon('pan');
                            var polygonArr = param.split(",");
                            var overlay = {};
                            var pgPoints = [];
                            for(var i=0;i<polygonArr.length-2;i+=2){
                                var pgPoint = {
                                    lng:polygonArr[i],
                                    lat:polygonArr[i+1]
                                }
                                pgPoints.push(pgPoint);
                            }
                            overlay['pgPoints'] = pgPoints;
                            _self.drawPolygon(overlay);
							_self._callback(mode,pgPoints);
                        });
                        break;
                    case 'clear'://清除全部画图痕迹
						_self.removeDrawGeometry();
                        _self.clearCustomPolygon();
						_self._callback(mode);
                        break;
                }

            },
            clearCustomPolygon:function(){
                var _self = this;
                if(!_self.customPolygon)
                    return;
                for(var i=0; i<_self.customPolygon.length; i++){
                    _self.uEzMap.removeOverlay(_self.customPolygon[i]);
                }
                if(_self.measurePolygon){
                    _self.uEzMap.removeOverlay(_self.measurePolygon);
                    _self.measurePolygon = null;
                    if(_self.areaTitle){
                        var point = new Point(0,0);
                        _self.areaTitle.setPoint(point);
                    }
                }
                _self.customPolygon = [];
            },
            removeDrawGeometry: function () {
                this.uEzMap.removeDrawGeometry();//107.6895,25.57671,109.51872,25.49981
            },
            //回调函数
            drawLine: function (overlay,mode) {//画线
                var _self = this;
                this.removeDrawGeometry();
                var points = overlay['points'];
                var _points = [];
                for (var i = 0; i < points.length; i++) {
                    var point = new Point(points[i]['lng1'],points[i]['lat1']);
                    _points.push(point);
                    point = new Point(points[i]['lng2'],points[i]['lat2']);
                    _points.push(point);
                    //var _points = points[i]['lng1'] + "," + points[i]['lat1'] + "," + points[i]['lng2'] + "," + points[i]['lat2'];
                }
                var uLine = new Polyline(_points, overlay['color'] || "blue", overlay['lineWidth'] || 4, overlay['opacity'] || 0.5, overlay['arrow']);//传递参数
                _self.uEzMap.addOverlay(uLine);
                if(mode==='measure'){
                    _self.clearCustomPolygon();
                    _self.measurePolygon = uLine;
                }
                else
                    _self.customPolygon.push(uLine);
            },
            //矩形
            drawRect: function (overlay) {
                this.removeDrawGeometry();
                var pRectangle = overlay['pRectangle'];
                for (var i = 0; i < pRectangle.length; i++) {
                    var rect = pRectangle[i]['lng1'] + "," + pRectangle[i]['lat1'] + "," + pRectangle[i]['lng2'] + "," + pRectangle[i]['lat2'];
                    var _pRectangle = new Rectangle(rect, "#ff00FF", 2, 0.5, "green");
                    this.uEzMap.addOverlay(_pRectangle);
                    this.customPolygon.push(_pRectangle);
                }
            },
            //圆形
            drawCircle: function (overlay) {
                this.removeDrawGeometry();
                var cPoints = overlay['cPoints'];
                for(var i =0;i<cPoints.length;i++){
                    var iCircle = cPoints[i]['lng'] + "," + cPoints[i]["lat"] + "," + cPoints[i]["r"];
                    var _pCircle = new Circle(iCircle, "#ff00FF", 2, 0.5, "green");
                    this.uEzMap.addOverlay(_pCircle);
                    this.customPolygon.push(_pCircle);
                }
            },
            //多边形
            drawPolygon: function (overlay) {
                this.removeDrawGeometry();
                var pgPoints = overlay['pgPoints'];
                var _points = "";
                for (var i = 0; i < pgPoints.length; i++) {
                    _points += ','+pgPoints[i]['lng'] + "," + pgPoints[i]['lat'];
                }
                _points = _points.substr(1,_points.length-1);
                var _pPolygon = new Polygon(_points, "#ff00FF", 2, 0.5, "green");
                this.uEzMap.addOverlay(_pPolygon);
                this.customPolygon.push(_pPolygon);
            },

            //
            getZoomLevel: function () {
                var params = this.uEzMap.getZoomLevel();
                return params;
            },
            setZoomLevel: function (zoomLevel) {
                this.uEzMap.zoomTo(parseInt(zoomLevel));
            },
            getCenter: function () {
                var params = this.uEzMap.getCenterLatLng();
                var centerPoint = {
                        lng: params.x,
                        lat: params.y
                };
                return centerPoint;
            },
            setCenter: function (point) {
                var _self = this;
                var lng = point.lng;
                var lat = point.lat;
                if (lng && lat) {
                    _self.centerAtLatLng(lng, lat);
                }
            },
            centerAtLatLng: function (lng, lat) {
                var _self = this;
                if (lng && lat) {
                    var point = new Point(lng, lat);
                    _self.uEzMap.centerAtLatLng(point);
                    if(_self.getIsNeedCluster()){
                        _self.markerCluster.reset();
                    }
                    else {
                        _self._showVisualAreaResources();
                    }
                }
            },
            createMarker: function (point, uIcon,name) {
                var _self = this;
                if (point && uIcon) {
                    var _uIcon = new Icon();
                    _uIcon.image = uIcon.image || "http://10.151.1.83:80/PGIS_S_TileMap/images/tack.gif";
                    _uIcon.height = uIcon.height || 32;
                    _uIcon.width = uIcon.width || 32;
                    _uIcon.topOffset = uIcon.topOffset || 0;
                    _uIcon.leftOffset = uIcon.leftOffset || 0;
                    var _title = new Title(
                        name || '',
                        uIcon.fontSize || 16,
                        uIcon.pos || 7,
                        uIcon.font || '宋体',
                        uIcon.fontColor || '#ff0000',
                        uIcon.bgColor || '#ffffff',
                        uIcon.borderColor || '#000000',
                        uIcon.borderSize || 3,
                        uIcon.bIsTransparent || true
                    );
                    var _marker = new Marker(point, _uIcon, _title);
                    return _marker;
                }
            },
            addMarker: function (obj) {
                var _self = this;
                if(!obj)
                    return;
                var id = obj.id;
                var point = obj.point;
                var uIcon = obj.uIcon;
                var name = obj.name;
                if (id && _self.markers.hasOwnProperty(id)) {
                    return;
                }
                else if (id && !_self.markers.hasOwnProperty(id)) {
                    var _point = new Point(point.lng, point.lat);//点
                    _self.centerAtLatLng(point.lng, point.lat);//居中

                    var _marker = _self.createMarker(_point, uIcon,name);
                    _marker['markerInfo'] = obj;
                    _marker.addListener("click", function () {
                        var callback = _self.setting['cluster']['clusterClick'];
                        var param = {
                            type: 'marker_click',
                            point: {
                                lng: _marker.point.x,
                                lat: _marker.point.y
                            },
                            data: _marker['markerInfo']
                        }
                        typeof callback === 'function' ? callback(param) : null;
                    });
                    _self.uEzMap.addOverlay(_marker);//显示
                    _self.markers[id] = _marker;
                }
            },
            editMarker: function (obj) {
                if(!obj)
                    return;
                var _self = this;
                var id = obj.id;
                var point = obj.point;
                var uIcon = obj.uIcon;
                var name = obj.name;
                if (id && _self.markers.hasOwnProperty(id)) {
                    _self.deleteMarker(id);
                    var _point = new Point(point.lng, point.lat);//点
                    _self.centerAtLatLng(point.lng, point.lat);//居中

                    var _marker = _self.createMarker(_point, uIcon,name);
                    _marker['markerInfo'] = obj;
                    _marker.addListener("click", function () {
                        var callback = _self.setting['cluster']['clusterClick'];
                        var param = {
                            type: 'marker_click',
                            curPoint: {
                                lng: obj['point']['lng'],
                                lat: obj['point']['lat']
                            },
                            data: _marker['markerInfo']
                        }
                        typeof callback === 'function' ? callback(param) : null;
                    });
                    _self.uEzMap.addOverlay(_marker);//显示
                    _self.markers[id] = _marker;
                }
            },
            deleteMarker: function (id) {
                var _self = this;
                if (id) {
                    var marker = _self.markers[id];
                    if (marker) {
                        _self.uEzMap.removeOverlay(marker);
                        delete _self.markers[id];
                    }
                }
            },
            showPathWay: function (obj) {
                var _self = this;
                var id = obj.id;
                var points = obj.points;
                var uIcon = obj.uIcon;
                if (id) {
                    if (_self.pathWay&&_self.pathWay.hasOwnProperty(id)) {
                        _self.clearPathWay(id);
                    }
                    var pathWays = new Object();
                    if(!_self.pathWayCluster){
                        _self.pathWayCluster = {};
                    }
                    var b = _self.setting['cluster'];
                    b['gridSize'] = 4;
                    b['imagePath'] = _self.setting['imagePath'] + "base/skin/images/cluster/m";
                    b['defaultIcon'] = uIcon.image||_self.setting['imagePath']+"base/skin/images/location.png";
                    b['mode'] = 'pathway';
                    _self.pathWayCluster[id] = new MarkerCluster(_self.uEzMap,null,b);
                    var _points = {};
                    for(var i= 0,point;point=points[i];i++){
                        _points[i.toString()] = point;
                    }
                    _self.pathWayCluster[id].loadMarkers(_points);
                    var pathWayArray = new Array();//轨迹折线段
                    _self.centerAtLatLng(points[0].lng, points[0].lat);//居中

                    for (var i = 0; i < points.length - 1; i++) {
                        var point_point = points[i].lng + "," + points[i].lat + ',' + points[i + 1].lng + "," + points[i + 1].lat;//轨迹点坐标
                        var _pathWay = new Polyline(//连成线
                            point_point,
                            uIcon.lineColor || "#f00",
                            uIcon.lineWidth || 3,
                            uIcon.opacity || 1,
                            uIcon.lineArrow || 1
                        );
                        _self.uEzMap.addOverlay(_pathWay);//显示
                        pathWayArray.push(_pathWay);
                    }
                    _self.pathWay[id] = pathWayArray;
                }
            },
            clearPathWay: function (id) {
                var _self = this;
                if (id && _self.pathWay.hasOwnProperty(id)) {
                    var _pathWays = _self.pathWay[id];
                    _self.pathWayCluster[id].clearMarkers();
                    delete _self.pathWayCluster[id];
                    if (_pathWays) {
                        for (var i = 0; i < _pathWays.length; i++) {
                            var _pathWay = _pathWays[i];
                            _self.uEzMap.removeOverlay(_pathWay);
                        }
                    }
                    delete _self.pathWay[id];
                }
            }
        }
    })(jTop, window);
    return jTop.PGis;
})