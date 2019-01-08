/**
 * Created by admin on 2016/6/20.
 */
define(['require',
    'base/jTop',
    'base/LatLng',
    'base/bMap',
    'api/google/mapfiles/js/stringbuilder.min',
    'api/google/mapfiles/js/markerclusterer',
    'css!api/google/mapfiles/css/defaultstyle.css'
], function (require) {
    var jTop = require('base/jTop');
    var LatLng = require('base/LatLng');
    var latLng = new LatLng();
    (function (global, win) {
        win.google = win.google || {};
        google.maps = google.maps || {};
        var loadScriptTime = (new Date).getTime();
        google.maps.Load = function (apiLoad) {
            delete google.maps.Load;
            var url = require.getBaseUrl();
            var path = url + "api/google/mapfiles/";
            var apiPath = url + "api/google/mapfiles/api-3/14/11";
            apiLoad([0.009999999776482582, [[["http://mt0.google.cn/vt?lyrs=m@160000000\u0026hl=zh-CN\u0026gl=CN\u0026", "http://mt1.google.cn/vt?lyrs=m@160000000\u0026hl=zh-CN\u0026gl=CN\u0026"], null, null, null, null, "m@240000000"], [["http://mt0.google.cn/vt?lyrs=s@140\u0026hl=zh-CN\u0026gl=CN\u0026", "http://mt1.google.cn/vt?lyrs=s@140\u0026hl=zh-CN\u0026gl=CN\u0026"], null, null, null, 1, "140"], [["http://mt0.google.cn/vt?imgtp=png32\u0026lyrs=h@160000000\u0026hl=zh-CN\u0026gl=CN\u0026", "http://mt1.google.cn/vt?imgtp=png32\u0026lyrs=h@160000000\u0026hl=zh-CN\u0026gl=CN\u0026"], null, null, null, null, "h@240000000"], [["http://mt0.google.cn/vt?lyrs=t@127,r@160000000\u0026hl=zh-CN\u0026gl=CN\u0026", "http://mt1.google.cn/vt?lyrs=t@127,r@160000000\u0026hl=zh-CN\u0026gl=CN\u0026"], null, null, null, null, "t@131,r@240000000"], null, null, [["http://cbk0.googleapis.com/cbk?", "http://cbk1.googleapis.com/cbk?"]], [["http://khm0.googleapis.com/kh?v=82\u0026hl=zh-CN\u0026gl=CN\u0026", "http://khm1.googleapis.com/kh?v=82\u0026hl=zh-CN\u0026gl=CN\u0026"], null, null, null, null, "82"], [["http://mt0.googleapis.com/mapslt?hl=zh-CN\u0026gl=CN\u0026", "http://mt1.googleapis.com/mapslt?hl=zh-CN\u0026gl=CN\u0026"]], [["http://mt0.googleapis.com/mapslt/ft?hl=zh-CN\u0026gl=CN\u0026", "http://mt1.googleapis.com/mapslt/ft?hl=zh-CN\u0026gl=CN\u0026"]], [["http://mt0.googleapis.com/vt?hl=zh-CN\u0026gl=CN\u0026", "http://mt1.googleapis.com/vt?hl=zh-CN\u0026gl=CN\u0026"]], [["http://mt0.googleapis.com/mapslt/loom?hl=zh-CN\u0026gl=CN\u0026", "http://mt1.googleapis.com/mapslt/loom?hl=zh-CN\u0026gl=CN\u0026"]], [["https://mts0.googleapis.com/mapslt?hl=zh-CN\u0026gl=CN\u0026", "https://mts1.googleapis.com/mapslt?hl=zh-CN\u0026gl=CN\u0026"]], [["https://mts0.googleapis.com/mapslt/ft?hl=zh-CN\u0026gl=CN\u0026", "https://mts1.googleapis.com/mapslt/ft?hl=zh-CN\u0026gl=CN\u0026"]]], ["zh-CN", "CN", null, 0, null, null, path, "http://csi.gstatic.com", "https://maps.googleapis.com", "http://maps.googleapis.com"], [apiPath, "3.14.11"], [510544390], 1, null, null, null, null, 0, "", null, null, 0, "http://khm.googleapis.com/mz?v=140\u0026", null, "https://earthbuilder.googleapis.com", "https://earthbuilder.googleapis.com", null, "http://mt.googleapis.com/vt/icon", [["http://mt0.googleapis.com/vt", "http://mt1.googleapis.com/vt"], ["https://mts0.googleapis.com/vt", "https://mts1.googleapis.com/vt"], [null, [[0, "m", 240000000]], [null, "zh-CN", "CN", null, 18, null, null, null, null, null, null, [[47], [37, [["smartmaps"]]]]], 0], [null, [[0, "m", 240000000]], [null, "zh-CN", "CN", null, 18, null, null, null, null, null, null, [[47], [37, [["smartmaps"]]]]], 3], [null, [[0, "h", 240000000]], [null, "zh-CN", "CN", null, 18, null, null, null, null, null, null, [[50], [37, [["smartmaps"]]]]], 0], [null, [[0, "h", 240000000]], [null, "zh-CN", "CN", null, 18, null, null, null, null, null, null, [[50], [37, [["smartmaps"]]]]], 3], [null, [[4, "t", 131], [0, "r", 131000000]], [null, "zh-CN", "CN", null, 18, null, null, null, null, null, null, [[5], [37, [["smartmaps"]]]]], 0], [null, [[4, "t", 131], [0, "r", 131000000]], [null, "zh-CN", "CN", null, 18, null, null, null, null, null, null, [[5], [37, [["smartmaps"]]]]], 3], [null, null, [null, "zh-CN", "CN", null, 18], 0], [null, null, [null, "zh-CN", "CN", null, 18], 3], [null, null, [null, "zh-CN", "CN", null, 18], 6], [null, null, [null, "zh-CN", "CN", null, 18], 0]], 2, 500], loadScriptTime);
            //apiLoad([0.009999999776482582,[[["http://mt0.google.cn/vt?lyrs=m@160000000\u0026hl=zh-CN\u0026gl=CN\u0026","http://mt1.google.cn/vt?lyrs=m@160000000\u0026hl=zh-CN\u0026gl=CN\u0026"],null,null,null,null,"m@224000000"],[["http://mt0.google.cn/vt?lyrs=s@132\u0026hl=zh-CN\u0026gl=CN\u0026","http://mt1.google.cn/vt?lyrs=s@132\u0026hl=zh-CN\u0026gl=CN\u0026"],null,null,null,1,"132"],[["http://mt0.google.cn/vt?imgtp=png32\u0026lyrs=h@160000000\u0026hl=zh-CN\u0026gl=CN\u0026","http://mt1.google.cn/vt?imgtp=png32\u0026lyrs=h@160000000\u0026hl=zh-CN\u0026gl=CN\u0026"],null,null,"imgtp=png32\u0026",null,"h@224000000"],[["http://mt0.google.cn/vt?lyrs=t@127,r@160000000\u0026hl=zh-CN\u0026gl=CN\u0026","http://mt1.google.cn/vt?lyrs=t@127,r@160000000\u0026hl=zh-CN\u0026gl=CN\u0026"],null,null,null,null,"t@131,r@224000000"],null,null,[["http://cbk0.googleapis.com/cbk?","http://cbk1.googleapis.com/cbk?"]],[["http://khm0.googleapis.com/kh?v=78\u0026hl=zh-CN\u0026gl=CN\u0026","http://khm1.googleapis.com/kh?v=78\u0026hl=zh-CN\u0026gl=CN\u0026"],null,null,null,null,"78"],[["http://mt0.googleapis.com/mapslt?hl=zh-CN\u0026gl=CN\u0026","http://mt1.googleapis.com/mapslt?hl=zh-CN\u0026gl=CN\u0026"]],[["http://mt0.googleapis.com/mapslt/ft?hl=zh-CN\u0026gl=CN\u0026","http://mt1.googleapis.com/mapslt/ft?hl=zh-CN\u0026gl=CN\u0026"]],[["http://mt0.googleapis.com/vt?hl=zh-CN\u0026gl=CN\u0026","http://mt1.googleapis.com/vt?hl=zh-CN\u0026gl=CN\u0026"]],[["http://mt0.googleapis.com/mapslt/loom?hl=zh-CN\u0026gl=CN\u0026","http://mt1.googleapis.com/mapslt/loom?hl=zh-CN\u0026gl=CN\u0026"]],[["https://mts0.googleapis.com/mapslt?hl=zh-CN\u0026gl=CN\u0026","https://mts1.googleapis.com/mapslt?hl=zh-CN\u0026gl=CN\u0026"]],[["https://mts0.googleapis.com/mapslt/ft?hl=zh-CN\u0026gl=CN\u0026","https://mts1.googleapis.com/mapslt/ft?hl=zh-CN\u0026gl=CN\u0026"]]],["zh-CN","CN",null,0,null,null,path,"http://csi.gstatic.com","https://maps.googleapis.com","http://maps.googleapis.com"],[apiPath,"3.13.7"],[2482999353],1.0,null,null,null,null,0,"",null,null,0,"http://khm.googleapis.com/mz?v=132\u0026",null,"https://earthbuilder.googleapis.com","https://earthbuilder.googleapis.com",null,"http://mt.googleapis.com/vt/icon"], loadScriptTime);
        };
        global.GMap = function (setting) {
            var _self = this;
            global.fn.extend(global.GMap, global.BMap);
            win.require.config({
                paths: {
                    "google": 'api/google/mapfiles/api-3/14/11/main',
                    "drawing": 'api/google/mapfiles/api-3/14/11/drawing',
                    'marker': 'api/google/mapfiles/js/markerwithlabel_packed',
                    'label': 'api/google/mapfiles/js/_label'
                },
                shim: {
                    drawing: ['google'],//drawing依赖于main
                    label: ['google'],
                    marker:['google']
                }
            })
            win.require(["google", "drawing", 'marker', 'label'], function () {
                _self.init(setting);
            })
        };
        global.GMap.prototype = {
            googleMap: null,
            markers: {},//正常添加的标注保存容器
            DEFAULT_MAPTYPE_INDEX: 0,
            mapTypeIds: [],//google map类型
            rMarkers: [],//资源标注保存容器
            rMarker: {},//为了快速根据id查找标注，将标注存在此对象中(省去数组遍历)
            drawingManager: null,
            pathWayCluster:null,
            infoWin: null,
            infoWindowOptions: null,//气泡保存容器
            pathWayIds: {},//轨迹的标注和路线保存容器
            pathRoadIds: {},//查询的路线保存容器
            MAP_TYPES: [{
                id: "GOOGLE_ROAD",
                name: "街道",//谷歌地图
                tileUrl: "http://mt{0}.google.cn/vt/lyrs=m@224000000&hl=zh-cn&gl=cn&src=app&x={1}&y={2}&z={3}&s=Galileo",
                locationUrl: "googlemaps\\roadmap\\{0}\\{1}\\{2}.png",
                copyright: "?Google  GS(2011)6020 AutoNavi"
            },
                {
                    id: "GOOGLE_HYBRID",
                    name: "卫星",
                    tileUrl: "http://mt{0}.google.cn/vt/lyrs=s@132&hl=zh-cn&gl=cn&src=app&x={1}&y={2}&z={3}&s=Galileo",
                    overlayTileUrl: "http://mt{0}.google.cn/vt/imgtp=png32&lyrs=h@224000000&hl=zh-cn&gl=cn&src=app&x={1}&y={2}&z={3}&s=Galileo",
                    locationUrl: "googlemaps\\satellite\\{0}\\{1}\\{2}.jpg",
                    locationOverlayUrl: "googlemaps\\overlay\\{0}\\{1}\\{2}.png",
                    copyright: "Imagery ?2013 TerraMetrics, Data ?2013 GS(2011)6020 AutoNavi"
                },
                {
                    id: "TIANDITU_ROAD",
                    name: "天地图",//天地图
                    tileUrl: "http://t{0}.tianditu.cn/DataServer?T=vec_w&X={1}&Y={2}&L={3}",
                    overlayTileUrl: "http://tile{0}.chinaonmap.com/DataServer?T=cva_w&X={1}&Y={2}&L={3}",
                    locationUrl: "tianditu\\roadmap\\{0}\\{1}\\{2}.png",
                    locationOverlayUrl: "tianditu\\overlay_r\\{0}\\{1}\\{2}.png",
                    copyright: "国家测绘地理信息局 - GS(2012)6013"
                }],
            initMap: function (setting, doc) {
                var className = doc.className;
                doc.className = className ? className + " map-api-class" : "map-api-class";
                var _self = this;
                var options = _self.getMapOptions(setting);
                _self.googleMap = new google.maps.Map(doc, options);
                _self.addCustomMaps();
                if (typeof setting['callback']['map_click'] === 'function') {
                    google.maps.event.addListener(this.googleMap, 'click', function (e) {
                        var param = {
                            lng: e.latLng.lng(),
                            lat: e.latLng.lat()
                        }
                        if (_self.mode === 'location') {
                            _self.addLocation(param);
                        }
                        _self._callback('map_click', param);
                    })
                }
                if(_self.getIsNeedCluster()){
                    var b = {
                        gridSize: setting['cluster']['gridSize'],
                        imagePath: setting['imagePath'] + "base/skin/images/cluster/m",
                        maxZoom:setting['zoomLevel']['max'],
                        ClustererMaxZoom: 15,
                        ClickClusterer: setting['cluster']['clusterClick']
                    };
                    _self.markerCluster = new MarkerClusterer(_self.googleMap, [], b);
                }
                _self.initDrawingManager();
                _self.googleMapExtend();
            },
            googleMapExtend: function () {
                if (!google.maps.Polygon.prototype.getBounds) {
                    google.maps.Polygon.prototype.getBounds = function (latLng) {
                        var bounds = new google.maps.LatLngBounds(),
                            paths = this.getPaths(),
                            path,
                            p, i;
                        for (p = 0; p < paths.getLength(); p++) {
                            path = paths.getAt(p);
                            for (i = 0; i < path.getLength(); i++) {
                                bounds.extend(path.getAt(i));
                            }
                        }
                        return bounds;
                    };
                };
                if (!google.maps.Polyline.prototype.getBounds) {
                    google.maps.Polyline.prototype.getBounds = function (latLng) {
                        var bounds = new google.maps.LatLngBounds();
                        this.getPath().forEach(function (e) {
                            bounds.extend(e);
                        });
                        return bounds;
                    }
                };
            },
            addCustomMaps: function () {
                var a, _self = this;
                for (a = 0; a < _self.MAP_TYPES.length; a++) {
                    _self.MAP_TYPES[a]['locationUrl'] = _self.setting['mapServer'] + _self.MAP_TYPES[a]['locationUrl'];
                    _self.MAP_TYPES[a]['locationOverlayUrl'] = _self.setting['mapServer'] + _self.MAP_TYPES[a]['locationOverlayUrl'];
                    _self.mapTypeIds[a] = _self.MAP_TYPES[a].id;
                    _self.addCustomMap(a);
                }
                if (_self.DEFAULT_MAPTYPE_INDEX >= _self.MAP_TYPES.length) {
                    _self.DEFAULT_MAPTYPE_INDEX = _self.DEFAULT_MAPTYPE_INDEX - 7;
                }
                _self.googleMap.setMapTypeId(_self.MAP_TYPES[_self.DEFAULT_MAPTYPE_INDEX].id);
            },
            addCustomMap: function (index) {
                var _self = this;
                var minZoom = _self['setting']['zoomLevel']['min']||3,
                    maxZoom = _self['setting']['zoomLevel']['max']||18,
                    sb = new StringBuilder(),
                    tileUrl = _self.MAP_TYPES[index].tileUrl,
                    getTileUrl = function (tile, zoom) {
                        var url = sb.format(_self.MAP_TYPES[index].locationUrl, zoom, tile.x, tile.y);
                        url.replace(/\\/g,'/');
                        return url;
                    };
                var imageMapType = new google.maps.ImageMapType({
                    isPng: true,
                    opacity: 1.0,
                    minZoom: minZoom,
                    maxZoom: maxZoom,
                    name: _self.MAP_TYPES[index].name,
                    tileSize: new google.maps.Size(256, 256),
                    getTileUrl: getTileUrl
                });
                _self.googleMap.mapTypes.set(_self.MAP_TYPES[index].id, imageMapType);
            },
            initDrawingManager: function () {
                var polyOptions = {
                    strokeColor: "#f20c00",
                    fillColor: "#f20c00",
                    geodesic: false,
                    fillOpacity: 0.06,
                    strokeWeight: 3,
                    strokeOpacity: 0.45,
                    clickable: true,
                    editable: true,
                    draggable: false,
                    enableClicking: true,
                    zIndex: 2
                };
                var _self = this;
                _self.drawingManager = new google.maps.drawing.DrawingManager({
                    drawingMode: null,
                    drawingControl: false,
                    drawingControlOptions: {
                        position: google.maps.ControlPosition.TOP_RIGHT,
                        drawingModes: [
                            google.maps.drawing.OverlayType.POLYLINE, google.maps.drawing.OverlayType.CIRCLE, google.maps.drawing.OverlayType.POLYGON, google.maps.drawing.OverlayType.RECTANGLE
                        ]
                    },
                    polylineOptions: polyOptions,
                    rectangleOptions: polyOptions,
                    circleOptions: polyOptions,
                    polygonOptions: polyOptions
                });
                _self.drawingManager.setMap(_self.googleMap);
                google.maps.event.addListener(_self.googleMap, 'rightclick', function (mouseEvent) {
                    var mode = _self.drawingManager.getDrawingMode();
                    _self.setDrawMode('pan');
                    if (mode == null) {
                        _self.clearCustomPolygon();
                        _self._callback("clear");
                    }
                });
                google.maps.event.addDomListener(_self.drawingManager, "polygoncomplete", function (polygon) {
                    google.maps.event.addListener(polygon.getPath(), "set_at", function (index) {
                        _self._polygonComplete(polygon);
                    });
                    google.maps.event.addListener(polygon.getPath(), "insert_at", function (index) {
                        _self._polygonComplete(polygon);
                    });
                    _self._polygonComplete(polygon);
                });
                google.maps.event.addDomListener(_self.drawingManager, "circlecomplete", function (circle) {
                    google.maps.event.addListener(circle, "radius_changed", function (param) {
                        _self._circleComplete(circle);
                    });
                    google.maps.event.addListener(circle, "center_changed", function (param) {
                        _self._circleComplete(circle);
                    });
                    _self._circleComplete(circle);
                });
                google.maps.event.addDomListener(_self.drawingManager, "rectanglecomplete", function (rectangle) {
                    google.maps.event.addListener(rectangle, "bounds_changed", function (param) {
                        _self._rectangleComplete(rectangle);
                    });
                    _self._rectangleComplete(rectangle);
                });
                google.maps.event.addDomListener(_self.drawingManager, "polylinecomplete", function (polyline) {
                    google.maps.event.addListener(polyline.getPath(), "set_at", function (index) {
                        _self._showMeasureLength(polyline);
                    });
                    google.maps.event.addListener(polyline.getPath(), "insert_at", function (index) {
                        _self._showMeasureLength(polyline);
                    });
                    _self.clearCustomPolygon(true);
                    _self.measurePolygon = polyline;
                    //_self._showMeasureLength(polyline);

                    /*var bounds = polyline.getBounds();
                    _self.getResources();*/
                });
            },

            _polygonComplete: function (polygon) {
                var _self = this;
                var pgPoints = [];
                var points = polygon['latLngs']['j'][0]['j'];
                for (var i = 0; i < points.length; i++) {
                    var pgPoint = {
                        lng: points[i]['A'],
                        lat: points[i]['k']
                    }
                    pgPoints.push(pgPoint);
                }
                _self.addCustomPolygon(polygon, pgPoints, 'polygon');
            },
            _circleComplete: function (circle) {
                var _self = this;
                var cPoint = {
                    lng: circle['center']['A'],
                    lat: circle['center']['k'],
                    r: circle['radius']
                };
                _self.addCustomPolygon(circle, cPoint, 'circle');
            },
            _rectangleComplete: function (rectangle) {
                var _self = this;
                var points = {
                    lng1: rectangle['bounds']['qa']['j'],
                    lat1: rectangle['bounds']['Aa']['j'],
                    lng2: rectangle['bounds']['qa']['k'],
                    lat2: rectangle['bounds']['Aa']['k']
                }
                _self.addCustomPolygon(rectangle, points, 'rect');
            },
            _showMeasureLength: function (polyline) {
                var _self = this;
                var lengthInMeters = Math.round(google.maps.geometry.spherical.computeLength(polyline.getPath()))
                var lenghtUnit = "";
                if (lengthInMeters > 1000) {
                    lengthInMeters = (lengthInMeters / 1000).toFixed(3);
                    if (lengthInMeters > 1000)
                        lengthInMeters = Math.floor(lengthInMeters);
                    lenghtUnit = "公里";
                }
                var paths = polyline.getPath().getArray(),
                    position = paths[paths.length - 1];
                var data = [];
                for(var i in paths){
                    var point = {
                        lat:paths[i]['k'],
                        lng:paths[i]['A']
                    }
                    data.push(point);
                }
                //_self.addCustomPolygon(polyline, lengthInMeters + lenghtUnit, 'measure');
                _self.addCustomPolygon(polyline, data, 'measure');
                _self._showAreaLabel("总长度" + lengthInMeters + lenghtUnit, position);
            },
            _showAreaLabel: function (areaValue, position) {
                var _self = this;
                if (!_self.areaMarker) {
                    _self.areaMarker = new google.maps.Marker({
                        position: position
                    });
                } else {
                    _self.areaMarker.setPosition(position);
                }
                if (!_self.areaLabel) {
                    _self.areaLabel = new Label({
                        map: _self.googleMap
                    });
                }
                _self.areaLabel.bindTo("position", _self.areaMarker, "position");
                _self.areaLabel.set("text", areaValue);
            },
            showIntraAreaResources: function (list) {
                var _self = this;
                var list = list && list.length ? list : [];
                if(_self.getIsNeedCluster()&&_self.markerCluster){
                    _self.markerCluster.clearMarkers();
                    _self.markerCluster.addMarkers(list, false);
                }
            },
            addCustomPolygon: function (polygon, data, mode) {
                var _self = this;
                if (mode != 'measure'){
                    if(!_self.customPolygon)
                        _self.customPolygon = {};
                    _self.customPolygon[polygon['__gm_id']] = polygon;
                }
                _self.setDrawMode("pan");
                _self._callback(mode, data);
            },
            clearCustomPolygon: function (flag) {
                var _self = this;
                for (var i in _self.customPolygon) {
                    _self.customPolygon[i].setMap(null);
                    delete _self.customPolygon[i];
                }
                _self.customPolygon = null;
                if (_self.measurePolygon) {
                    _self.measurePolygon.setMap(null);
                }
                if (!flag) {
                    if (_self.areaMarker) {
                        _self.areaMarker.setPosition(new google.maps.LatLng(0, 0));
                        _self.areaLabel.set("text", "");
                    }
                }
            },
            setDrawMode: function (mode) {
                var _self = this;
                switch (mode) {
                    case 'pan'://地图平移
                        _self.setDrawIcon('pan');
                        _self.drawingManager.setDrawingMode(null);
                        break;
                    case 'measure'://测量距离
                        _self.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
                        break;
                    case 'rect'://在地图上画矩形
                        _self.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
                        break;
                    case 'circle'://在地图上画圆
                        _self.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
                        break;
                    case 'polyline':
                        _self.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
                        break;
                    case 'polygon':
                        _self.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
                        break;
                    case 'clear'://清除全部画图痕迹
                        _self.clearCustomPolygon();
                        _self._callback(mode);
                        break;
                }
            },
            getMapOptions: function (setting) {
                var _self = this;
                var options = {
                    center: new google.maps.LatLng(setting['center']['lat'], setting['center']['lng']),
                    zoom: setting['zoomLevel']['defaultLevel'] || 15,
                    mapTypeControlOptions: {
                        mapTypeIds: _self.mapTypeIds,
                        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
                    },
                    mapTypeControl: setting['mapTypeControl'] || true,
                    scaleControl: setting['mapControl']['show'] || true,
                    streetViewControl: false,
                    overviewMapControl: setting['overview']['show'],
                    overviewMapControlOptions: {
                        opened: false
                    },
                    panControlOptions: {
                        position: google.maps.ControlPosition.TOP_LEFT
                    },
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.TOP_LEFT
                    }
                };
                return options;
            },
            createRMarker: function (resource) {
                var _self = this;
                var location = new google.maps.LatLng(resource['lat'], resource['lng']);
                var icon = "";
                var setting = _self.setting;
                var isNeedCluster = _self.getIsNeedCluster();
                var marker = new google.maps.Marker({
                    id: resource['id'],
                    position: location,
                    draggable: false,
                    map: isNeedCluster ? null : _self.googleMap,
                    title: resource['name'],
                    icon: resource['icon'] || (setting['rType'] && resource['type'] && setting['rType'][resource['type']]['icon']) || _self.setting['imagePath'] + "base/skin/images/cluster/m0.png"
                });
				marker['resource'] = resource;
                if(isNeedCluster){
                    marker.setVisible(false);
                    marker.isAdded = false;
                }
                else{
					var setting = _self['setting'];
					google.maps.event.addListener(marker,'click',function(e){
						var param = {
							type:'cluster_click',
							original:{
								lng:e['latLng']['A'],
								lat:e['latLng']['k']
							},
							data:marker['resource']
						}
						var callback = setting['cluster']['clusterClick'];
						typeof callback === 'function' ? callback(param) : null;
					});

				}

                marker.defaultIcon = marker.getIcon();
                return marker;
            },
            _loadResources: function (resources) {
                var _self = this;
                var markerCluster = _self.markerCluster;
                var isNeedCluster = _self.getIsNeedCluster();
                if(!isNeedCluster){
                    var rMarkers = _self.rMarkers;
                    if(rMarkers&&rMarkers.length){
                        for(var i = 0,rMarker;rMarker=rMarkers[i];i++){
                            rMarker.setMap(null);
                        }
                    }
                }
                var surplus = [];
                rMarkers = _self.rMarkers = [];
                var rMarker = _self.rMarker = {};
                var _resources = _self.resources = {};
                var date = new Date();
                if(isNeedCluster)
                    markerCluster.clearMarkers();
                var bounds = _self.googleMap.getBounds();
                for (var i = 0, resource; resource = resources[i]; i++) {
                    var point = new google.maps.LatLng(resource['lat'], resource['lng']);
                    _resources[resource['id']] = resource;
                    if(!isNeedCluster||bounds.contains(point)){
                        var marker = _self.createRMarker(resource);
                        rMarker[resource['id']] = marker;
                        rMarkers.push(marker);
                    }else{
                        surplus.push(resource);
                    }
                }
                if(isNeedCluster){
                    markerCluster.setMarkers(rMarkers);
                    markerCluster.setRMarkers(_resources);
                    markerCluster.redraw();
                    setTimeout(function(){
                        for(var i = 0,resource;resource=surplus[i];i++){
                            var marker = _self.createRMarker(resource);
                            rMarker[resource['id']] = marker;
                            rMarkers.push(marker);
                        }
                        markerCluster.setMarkers(rMarkers);
                    },500);
                }
                _self.rMarkers = rMarkers;
                _self.rMarker = rMarker;
            },
            _addResources: function (resources) {
                var _self = this;
                var rMarkers = [];
                var _resource = {};
                for (var i = 0, resource; resource = resources[i]; i++) {
                    if (!_self.resources.hasOwnProperty(resource['id'])) {
                        _self.resources[resource['id']] = resource;
                        var marker = _self.createRMarker(resource);
                        if (!_self.rMarkers) {
                            _self.rMarkers = [];
                        }
                        rMarkers.push(marker);
                        _self.rMarker[resource['id']] = marker;
                        _self.rMarkers.push(marker);
                    }
                }
                if(_self.getIsNeedCluster()&&_self.markerCluster){
                    _self.markerCluster.setRMarkers(_self.resources);
                }
                _self.getIntraAreaResource();
            },
            _editResourcesIcon:function(resources){
                var _self = this;
                var _resources = _self.resources;
                var markers = _self.rMarkers;
                var setting = _self.setting;
                for (var i = 0, resource; resource = resources[i]; i++) {
                    if (_resources.hasOwnProperty(resource['id'])) {
                        var _resource = _resources[resource['id']];
                        _resource['icon'] = resource['icon'];
                        _resource['type'] = resource['type'];
                        var icon = _resource['icon'] || (setting['rType'] && _resource['type'] && setting['rType'][_resource['type']]['icon']) || _self.setting['imagePath'] + "base/skin/images/cluster/m0.png"
                        var marker = _self.rMarker[resource['id']];
                        var index = markers.indexOf(marker);
                        markers.splice(index,1);
                        marker.defaultIcon = icon;
                        marker.setIcon(icon);
                        markers.push(marker);
                    }
                }
            },
            _removeResources: function (ids) {
                var _self = this;
                if (ids && ids.length > 0 && _self.rMarkers && _self.rMarkers.length > 0) {
                    for (var i = 0, id; id = ids[i]; i++) {
                        for (var j = 0, rMarker; rMarker = _self.rMarkers[j]; j++) {
                            if (rMarker['id'] === id) {
                                if(_self.getIsNeedCluster()&&_self.markerCluster){
                                    _self.markerCluster.removeMarker(rMarker);
                                }
                                _self.rMarkers.splice(j, 1);
                                delete _self.resources[id];
                                delete _self.rMarker[id];
                            }
                        }
                    }
                    if(_self.getIsNeedCluster()&&_self.markerCluster){
                        _self.markerCluster.setRMarkers(_self.resources);
                    }
                }
            },
            addLocation: function (location) {
                var _self = this;
                _self.removeLocation();
                var point = new google.maps.LatLng(location['lat'], location['lng']);
                _self.googleMap.panTo(point);
                var marker = new google.maps.Marker({
                    icon: _self.setting.mode.locationStyle.image || _self.setting.imagePath + 'base/skin/images/sign.png',
                    position: point,
                    map: _self.googleMap,
                    title: "",
                    draggable: true
                });
                if (marker) {
                    google.maps.event.addListener(marker, 'dragend', function (e) {
                        var param = {
                            lng: e.latLng.lng(),
                            lat: e.latLng.lat()
                        }
                        if (_self.mode === 'location') {
                            _self._callback('map_click', param);
                        }
                    });
                }
                _self.location = marker;
            },
            removeLocation: function () {
                var _self = this;
                if (_self.location) {
                    _self.location.setMap(null);
                }
            },
            _setResourceIcon:function(id,icon){
                var _self = this;
                var marker = _self.rMarker[id];
                marker.setIcon(icon||marker.defaultIcon);
            },
            getRoundResources: function (point, radius) {
                var _self = this;
                var center = new google.maps.LatLng(point['lat'], point['lng']);
                var circleOptions = {
                    center: center,
                    clickable: false,
                    fillColor: "#ff0000",
                    fillOpacity: 0,
                    map: _self.googleMap,
                    radius: parseInt(radius),
                    strokeOpacity: 0
                }
                var circle = new google.maps.Circle(circleOptions);
                var bounds = circle.getBounds();
                var resource = _self.getResources(bounds);
                return resource['list'];
            },
            getResources: function (bounds) {
                var _self = this;
                var list = [];
                var resources = _self.resources;
                var _resource = {};
                var markers = [];
                var isNeedCluster = !_self.getIsNeedCluster();
                if(bounds){
                    for (var i in resources) {
                        var resource = resources[i];
                        var point = new google.maps.LatLng(resource['lat'], resource['lng']);
                        if(bounds.contains(point)){
                            list.push(resource);
                            _resource[i] = resource;
                            markers.push(_self.rMarker[i]);
                        }
                    }
                }
                else{
                    var resource,point,type,contain,cTypes,isType,polygon,marker;
                    cTypes = _self.cTypes;
                    var rMarker = _self.rMarker;
                    for (var i in resources) {
                        resource = resources[i];
                        point = new google.maps.LatLng(resource['lat'], resource['lng']);
                        type = resource['type'];
                        contain = _self.customPolygon ? false : true;
                        isType = !type || !cTypes || cTypes.length && cTypes.indexOf(type) != -1;
                        for (var j in _self.customPolygon) {
                            polygon = _self.customPolygon[j];
                            bounds = polygon.getBounds();
                            if(bounds.contains(point)){
                                contain = true;
                                break;
                            }
                        }
                        marker = rMarker[i];
                        if (contain && isType) {
                            if(isNeedCluster){
                                if(!marker.getMap())
                                    marker.setMap(_self.googleMap);
                            }
                            list.push(resource);
                            _resource[i] = resource;
                            markers.push(_self.rMarker[i]);
                        }
                        else{
                            if(isNeedCluster){
                                if(marker.getMap())
                                    marker.setMap(null);
                            }
                        }
                    }
                }
                var result = {};
                result['list'] = list;
                result['resource'] = _resource;
                result['markers'] = markers;
                return result;
            },
            getIntraAreaResource: function () {
                var _self = this;
                var bounds = null;
                var resources = _self.getResources();
                _self.showIntraAreaResources(resources['markers']);
                return resources['list'];
            },
            setCenterByResource: function (id) {
                var _self = this;
                var rMarker = _self.rMarker;
                _self.googleMap.panTo(rMarker[id]['position']);
            },
            /********************** by lzc start *************************/
            getCenter: function () {
                var params = this.googleMap.getCenter();
                var center = new Object();
                center.lng = params['A'];
                center.lat = params['k'];
                return center;
            },
            setCenter: function (point) {
                var _self = this;
                var lat = point.lat;
                var lng = point.lng;
                _self.panTo(lat, lng);
            },
            panTo: function (lat, lng) {
                var points = new google.maps.LatLng(lat, lng);
                this.googleMap.panTo(points);
            },
            getZoomLevel: function () {
                return this.googleMap.getZoom();
            },
            setZoomLevel: function (zoomLevel) {
                this.googleMap.setZoom(parseInt(zoomLevel));
            },
            createMarker: function (point, icon) {//生成标注
                var _self = this;
                if (point && icon) {
                    var _marker = new MarkerWithLabel({
                        title: icon.title || '',
                        icon: icon.image || _self.setting['imagePath'] + "base/skin/images/location.png",//图标
                        position: point,
                        map: _self.googleMap,
                        labelContent: icon.name || "",
                        labelAnchor: new google.maps.Point(-10, 10),
                        labelClass: icon.cssStyle
                    });
                    return _marker;
                }
            },
            addMarker: function (obj) {
                var _self = this;
                var id = obj.id;
                var name = obj.name;
                var point = obj.point;
                var uIcon = obj.uIcon;
                if (id && _self.markers.hasOwnProperty(id)) {
                    //_self.deleteMarker(id);
                    return;
                }
                else if (id && !(_self.markers.hasOwnProperty(id))) {
                    var lat = point.lat;
                    var lng = point.lng;
                    _self.panTo(lat, lng);
                    var _point = new google.maps.LatLng(lat, lng);
                    var icon = {
                        image: uIcon.image,
                        name: name,
                        cssStyle: uIcon.cssStyle
                    };
                    var _marker = _self.createMarker(_point, icon);
                    if (_marker)
                        _self.markers[id] = _marker;
                }
            },
            editMarker: function (obj) {
                var _self = this;
                var id = obj.id;
                var point = obj.point;
                var uIcon = obj.uIcon;
                var name = obj.name;
                if (id && _self.markers.hasOwnProperty(id)) {
                    _self.deleteMarker(id);
                    var lat = point.lat;
                    var lng = point.lng;
                    _self.panTo(lat, lng);
                    var _point = new google.maps.LatLng(lat, lng);
                    var icon = {
                        image: uIcon.image,
                        name: name,
                        cssStyle: uIcon.cssStyle
                    };
                    var _marker = _self.createMarker(_point, icon);
                    if (_marker)
                        _self.markers[id] = _marker;
                }
            },
            deleteMarker: function (id) {
                var _self = this;
                if (id && _self.markers.hasOwnProperty(id)) {
                    var marker = _self.markers[id];
                    if (marker) {
                        marker.setMap(null);
                        delete _self.markers[id];
                    }
                }
            },
            createPMarker: function (point, icon) {//生成轨迹标注
                var _self = this;
                if (point && icon) {
                    var _marker = new MarkerWithLabel({
                        title: icon.title || '',
                        icon: icon.image || _self.setting['imagePath'] + "base/skin/images/location.png",//图标
                        position: point,
                        /*map: _self.googleMap,*/
                        labelContent: icon.name || "",
                        labelAnchor: new google.maps.Point(-10, 10),
                        labelClass: icon.cssStyle
                    });
                    return _marker;
                }
            },
            showPathWay: function (obj) {
                var _self = this;
                var id = obj.id;
                var points = obj.points;
                var uIcon = obj.uIcon;
                if (id && _self.pathWayIds.hasOwnProperty(id)) {
                    _self.clearPathWay(id);
                }
                if(!_self.pathWayCluster){
                    _self.pathWayCluster = {};
                }
                var b = _self.setting['cluster'];
                b['gridSize'] = 3;
                b['imagePath'] = _self.setting['imagePath'] + "base/skin/images/cluster/m";
                b['maxZoom']=_self.setting['zoomLevel']['max'];
                var pathWays = new Object();
                var trackPoints = new Array();//轨迹点坐标集合
                var pMarkerArray = new Array();//轨迹标注
                var pathWayArray = new Array();//轨迹折线段
                _self.panTo(points[0].lat, points[0].lng);
                for (var i in points) {
                    var point = new google.maps.LatLng(points[i].lat, points[i].lng);
                    var _pMarker = _self.createPMarker(point, uIcon);//生成轨迹点
                    pMarkerArray.push(_pMarker);
                    trackPoints.push(point);
                }
                _self.pathWayCluster[id] = new MarkerClusterer(_self.googleMap, pMarkerArray, b);
                for (var i = 0; i < trackPoints.length - 1; i++) {
                    var path = [trackPoints[i], trackPoints[i + 1]];//轨迹点坐标
                    var _pathWay = new google.maps.Polyline({//连成线
                        icons: [{
                            icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW},
                            offset: '100%'
                        }],
                        path: path,
                        strokeColor: uIcon.lineColor || '#F00',
                        strokeOpacity: uIcon.opacity || 1.0,
                        strokeWeight: uIcon.lineWidth || 3,
                        map: _self.googleMap
                    });
                    pathWayArray.push(_pathWay);
                }
                _self.pathWayIds[id] = pathWayArray;
            },
            clearPathWay: function (id) {
                var _self = this;
                if (id && _self.pathWayIds.hasOwnProperty(id)) {
                    _self.pathWayCluster[id].clearMarkers();
                    delete _self.pathWayCluster[id];
                    for (var i in _self.pathWayIds[id]) {
                        _self.pathWayIds[id][i].setMap(null);
                    }
                    delete _self.pathWayIds[id];
                }
            },
            openInfoWindow: function (point,strHTML) {
                var _self = this;
                if (_self.infoWindowOptions) {
                    _self.closeInfoWindow();
                }
                if (point && !(_self.infoWindowOptions)) {
                    var lat = point.lat;
                    var lng = point.lng;
                    _self.panTo(lat, lng);
                    var point = new google.maps.LatLng(point.lat, point.lng);
                    var contentStr = strHTML || '<div style="float: left;width: 200px;height: 200px;border: 1px solid #f00;"></div>'
                        + 'test打开气泡信息窗口' + '<br />' + '打开气泡信息窗口';

                    _self.infoWindowOptions = new google.maps.InfoWindow({
                        content: contentStr,
                        position: point
                    });
                    _self.infoWindowOptions.open(_self.googleMap);
                }
            },
            closeInfoWindow: function () {
                var _self = this;
                if (_self.infoWindowOptions) {
                    _self.infoWindowOptions.close();
                    _self.infoWindowOptions = null;
                }
            },
            /********************** by lzc end *************************/
            /********************** by ly start *************************/
            _showRoad: function (obj,callback,roadWidth) {
                var _self = this;
                var id = obj.id;
                var paths = obj.paths;
                var uIcon = obj.uIcon;
                var RoadArray = new Array();//道路折线段
                var point_1,point_2;
                if (id && _self.pathRoadIds.hasOwnProperty(id)) {
                    _self.clearRoad(id);
                }
                var resources = [];
                //画线。
                for(var i=0;i<paths.length;i++){
					point_1 = new google.maps.LatLng(paths[i][0][1], paths[i][0][0]);
					for(var j = 1; j<paths[i].length; j++){
						point_2 = new google.maps.LatLng(paths[i][j][1], paths[i][j][0]);
						var points = [point_1,point_2];
						var pathWay =_self.drawLine(points,uIcon);
                        if(typeof callback === "function"){
                            var startPoint = {
                                lng:point_1['A'],
                                lat:point_1['k']
                            }
                            var endPoint = {
                                lng:point_2['A'],
                                lat:point_2['k']
                            }
                            var list = _self.getResourcesInRect(startPoint,endPoint,roadWidth);
                            for(var k= 0,resource;resource = list[k];k++){
                                if(resources.indexOf(resource)==-1)
                                    resources.push(resource);
                            }
                        }
						RoadArray.push(pathWay);
						point_1 = point_2;
                        //break;
					}
                    //break;
                }
                _self.pathRoadIds[id] = RoadArray;
                if(typeof callback === "function"){
                    var param = {
                        mode:_self.mode,
                        type:"road",
                        original:null,
                        data:resources
                    };
                    callback(param);
                }
				//alert(resources.length);
				var point = {
					lat:paths[0][0][1],
					lng:paths[0][0][0]
				}
				_self.setCenter(point);

            },
            drawPolygon:function(points){
                var path = [];
                for(var i = 0,point;point=points[i];i++ ){
                    path.push(new google.maps.LatLng(point['lat'],point['lng']));
                }
                new google.maps.Polygon({
                    paths:path,
                    map:this.googleMap
                });
            },
            drawLine:function(points,uIcon){
                var _self = this;
                var path = [points[0], points[1]];//线段坐标
                var _pathWay = new google.maps.Polyline({//连成线
                    /*icons: [{
                        icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW},
                        offset: '100%'
                    }],*/
                    path: path,
                    strokeColor: uIcon.lineColor || '#F00',
                    strokeOpacity: uIcon.opacity || 1.0,
                    strokeWeight: uIcon.lineWidth || 3,
                    map: _self.googleMap
                });
                return _pathWay;
            },
            clearRoad:function(id){
                var _self = this;
                if (id && _self.pathRoadIds.hasOwnProperty(id)) {
                    for (var i in _self.pathRoadIds[id]) {
                        _self.pathRoadIds[id][i].setMap(null);
                    }
                    delete _self.pathRoadIds[id];
                }
            },
            /********************** by ly end *************************/
            transform84ToLatLng:function(point){
                return latLng.wgs_gcj_encrypts(point['lat'],point['lng']);
            },
            transformLatLngTo84:function(point){
                return latLng.gcj_To_Gps84(point['lat'],point['lng']);
            },
            drawPath: function (obj,callback,roadWidth) {
                var _self = this;
                var id = obj.id;
                var pointArray = obj.path;
                var stops = obj.points;
                var uIcon = obj.uIcon;
                var type = 'arrow';
                if(uIcon != null && uIcon.type){
                    type = uIcon.type;
                    if(type!='arrow'&& type != 'line'){
                        type = 'arrow';
                    }
                }
                if (id && _self.pathWayIds.hasOwnProperty(id)) {
                    _self.clearPath(id);
                }
                if(!_self.pathWayCluster){
                    _self.pathWayCluster = {};
                }
                var b = _self.setting['cluster'];
                b['gridSize'] = 3;
                b['imagePath'] = _self.setting['imagePath'] + "base/skin/images/cluster/m";
                b['maxZoom']=_self.setting['zoomLevel']['max'];
                var pathWays = new Object();
                var trackPoints = new Array();//轨迹点坐标集合
                var pMarkerArray = new Array();//轨迹标注
                var pathWayArray = new Array();//轨迹折线段
                var p = {
                    lng:pointArray[0][0][0],
                    lat:pointArray[0][0][1],
                }
                var firstPoint = _self.transform84ToLatLng(p);
                _self.panTo(firstPoint.lat, firstPoint.lng);
                var tmpPoints = [];
                for(var i in pointArray){
                    var points = pointArray[i];
                    for (var i in points) {
                        var p = {
                            lng:points[i][0],
                            lat:points[i][1],
                        }
                        var point = _self.transform84ToLatLng(p);
                        tmpPoints.push(point);
                        var latLng = new google.maps.LatLng(point.lat, point.lng);
                        trackPoints.push(latLng);
                    }
                }

                for(var i in stops){
                    var stop = stops[i];
                    var _pMarker = _self.createPMarker(stop, uIcon);//生成轨迹点
                    pMarkerArray.push(_pMarker);
                }
                _self.pathWayCluster[id] = new MarkerClusterer(_self.googleMap, pMarkerArray, b);
                var resources = [];
                var optionSet = {//连成线
                    path: null,
                    strokeColor: uIcon.lineColor || '#F00',
                    strokeOpacity: uIcon.opacity || 1.0,
                    strokeWeight: uIcon.lineWidth || 3,
                    map: _self.googleMap
                };

                for (var i = 0; i < trackPoints.length - 1; i++) {
                    var path = [trackPoints[i], trackPoints[i + 1]];//轨迹点坐标
                    var options = optionSet;
                    options.path = path;
                    if(i == trackPoints.length-2){
                        if(type == 'arrow'){
                            options.icons = [{
                                icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW},
                                offset: '100%'
                            }];
                        }
                    }
                    var _pathWay = new google.maps.Polyline(options);
                    pathWayArray.push(_pathWay);
                    if(typeof callback === "function"){
                        var startPoint = tmpPoints[i];
                        var endPoint = tmpPoints[i + 1];
                        var list = _self.getResourcesInRect(startPoint,endPoint,roadWidth);
                        for(var k= 0,resource;resource = list[k];k++){
                            if(resources.indexOf(resource)==-1)
                                resources.push(resource);
                        }
                    }
                }
                if(typeof callback === "function"){
                    var param = {
                        mode:_self.mode,
                        type:"road",
                        original:tmpPoints,
                        data:resources
                    };
                    callback(param);
                }
                _self.pathWayIds[id] = pathWayArray;
            },
            clearPath: function (id) {
                var _self = this;
                if (id && _self.pathWayIds.hasOwnProperty(id)) {
                    _self.pathWayCluster[id].clearMarkers();
                    delete _self.pathWayCluster[id];
                    for (var i in _self.pathWayIds[id]) {
                        _self.pathWayIds[id][i].setMap(null);
                    }
                    delete _self.pathWayIds[id];
                }
            },
            drawPath_async:function(obj){
                var _self = this;
                var id = obj.id;
                var paths = obj.path;
                var uIcon = obj.uIcon;
                var flagPoint = obj.point;
                var mode = obj.mode;
                var pointPre = null;
                var pointEnd = _self.createPMarker(flagPoint[1], uIcon);
                var centerPoint = flagPoint[0];
                var trackPoints = new Array();//轨迹点坐标集合
                var pathWayArray = new Array();//轨迹折线段
                //根据模式，判断准备工作
                if(mode == 'append'){
                    //如果根据id没有知道指定的元素，就修改mode为创建
                    if (id && !_self.pathWayIds.hasOwnProperty(id)) {
                        mode = 'create';
                    }
                    else{
                        pathWayArray = _self.pathWayIds[id];
                    }
                }
                if(mode == 'create'){
                    if (id && _self.pathWayIds.hasOwnProperty(id)) {
                        _self.clearPath(id);
                    }
                    if(!_self.pathWayCluster){
                        _self.pathWayCluster = {};
                    }
                    var clusterSetting = _self.setting['cluster'];
                    clusterSetting['gridSize'] = 3;
                    clusterSetting['imagePath'] = _self.setting['imagePath'] + "base/skin/images/cluster/m";
                    clusterSetting['maxZoom']=_self.setting['zoomLevel']['max'];
                    pointPre = _self.createPMarker(flagPoint[0], uIcon);
                    _self.pathWayCluster[id] = new MarkerClusterer(_self.googleMap, [pointPre], clusterSetting);
                }
                //设置居中
                _self.panTo(centerPoint.lat, centerPoint.lng);
                //追加一个标注点
                _self.pathWayCluster[id].addMarker(pointEnd, false);
                //整理轨迹的途经点格式
                for(var i in paths){
                    var points = paths[i];
                    for (var i in points) {
                        var p = {
                            lng:points[i][0],
                            lat:points[i][1],
                        }
                        var point = _self.transform84ToLatLng(p);
                        var latLng = new google.maps.LatLng(point.lat, point.lng);
                        trackPoints.push(latLng);
                    }
                }

                var optionSet = {//连成线
                    path: null,
                    strokeColor: uIcon.lineColor || '#F00',
                    strokeOpacity: uIcon.opacity || 1.0,
                    strokeWeight: uIcon.lineWidth || 3,
                    map: _self.googleMap
                };

                for (var i = 0; i < trackPoints.length - 1; i++) {
                    var path = [trackPoints[i], trackPoints[i + 1]];//轨迹点坐标
                    var options = optionSet;
                    options.path = path;
                    if(i == trackPoints.length-2){
                        options.icons = [{
                            icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW},
                            offset: '100%'
                        }];
                    }
                    var _pathWay = new google.maps.Polyline(options);
                    pathWayArray.push(_pathWay);
                }
                _self.pathWayIds[id] = pathWayArray;
            }
        }
    })(jTop, window);
    return jTop.GMap;
})