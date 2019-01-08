/**
 * Created by admin on 2016/6/24.
 */
/**
 * Created by admin on 2016/6/24.
 */
define(['require', 'base/jTop', 'css!base/skin/map.css','base/util'], function (require) {
	var jTop = require('base/jTop');
	(function (global, win) {
		global.BMap = function () {
			var _self = this;
		};
		global.BMap.prototype = {
			defaultSetting: {
				mapServer:"http://10.0.20.98:2098/",
				NAServer:"http://10.0.0.129:6080/arcgis/rest/services/gl/NAServer/Route/solve",
				mode:{
					defaultMode:'common',
					locationStyle:{
						image:'',
						width:32,
						height:32
					}
				},
				imagePath:"images/",
				center: {lng:114.5048,lat:36.5992},
				zoomLevel:{
					min: 0,
					max: 20,
					defaultLevel: 10
				},
				mapControl: {
					show: true
				},
				overview:{
					show:true,
					width:200,
					height:200,
					maxLevel:15,
					minLevel:5
				},
				containerId: "map",
				toolbox:{
					show:true,
					type:['pan','measure','circle','polygon','rect','clear']
				},
				callback:{},
				cluster:{
					gridSize:130,
					maxZoom:15,
					imageExtension:"png"
				}
			},
			resources:{},
			allMode:['common','location'],
			mode:'common',
			location:null,
			cTypes:null,
			rAlarms: {},//报警标注保存容器
			rAlarmTimer: null,
			customPolygon: null,
			measurePolygon: null,
			isNeedCluster:true,
			browser:null,
			markerCluster:null,
			surplus:{},//异步加载资源时,用来存放还未加载的资源
			init: function (setting) {
				var _self = this;
				var defaultSetting = _self.defaultSetting;
				if(setting){
					setting['mapServer'] = global.fn.setting(setting['mapServer'], defaultSetting['mapServer']);
					setting['mapControl'] = global.fn.setting(setting['mapControl'], defaultSetting['mapControl']);
					setting['mode'] = global.fn.setting(setting['mode'], defaultSetting['mode']);
					setting['imagePath'] = global.fn.setting(setting['imagePath'], defaultSetting['imagePath']);
					setting['overview'] = global.fn.setting(setting['overview'], defaultSetting['overview']);
					setting['cluster'] = global.fn.setting(setting['cluster'], defaultSetting['cluster']);
					setting['zoomLevel'] = global.fn.setting(setting['zoomLevel'], defaultSetting['zoomLevel']);
					setting['containerId'] = global.fn.setting(setting['containerId'], defaultSetting['containerId']);
					setting['center'] = setting['center']||defaultSetting['center'];//global.fn.setting(setting['center'], defaultSetting['center']);
					setting['toolbox'] = global.fn.setting(setting['toolbox'], defaultSetting['toolbox']);
					setting['callback'] = global.fn.setting(setting['callback'], defaultSetting['callback']);
					setting['NAServer'] = global.fn.setting(setting['NAServer'], defaultSetting['NAServer']);
				}
				else{
					setting = defaultSetting;
				}
				setting['cluster']['imagePath'] = setting['imagePath'];
				var doc = document.getElementById(setting["containerId"]);
				if (!doc) {
					throw "container is null";
					return;
				}
				_self._checkBrowser();
				_self._setSetting(setting);
				_self.initMap(setting, doc);
				if(typeof setting['callback']['loaded'] === "function"){
					setTimeout(function(){
						setting['callback']['loaded']();
					},300);
				}
				ToolBox.init(doc,setting['toolbox'],_self);
				_self.setMapMode(setting['mode']['defaultMode']);
				_self.setDrawIcon('pan');
			},
			/**
			 *
			 * @param setting
			 */
			initMap: function (setting) {

			},
			_checkBrowser:function(){
				var _self = this;
				var browser = win.util.browser;
				if(browser){
					_self._setBrowserInfo(browser);
					var isNeedCluster = !(browser.isIE6||browser.isIE7||browser.isIE8);
					_self.setIsNeedCluster(isNeedCluster);
				}
			},
			_setBrowserInfo:function (browser){
				this.browser = browser;
			},
			setIsNeedCluster:function(isNeedCluster){
				this.isNeedCluster = isNeedCluster;
			},
			getIsNeedCluster:function(){
				return this.isNeedCluster;
			},
			_setSetting:function(setting){
				this.setting = setting;
			},
			getResourceInfo:function(id){
				if(id&&id!=="")
					return this.resources[id];
			},
			editResourcesIcon:function(resources){
				if(resources&&resources.length>0)
					this._editResourcesIcon(resources);
			},
			_editResourcesIcon:function(resources){

			},
			setCTypes:function(types,callback){
				var _self = this;
				_self.cTypes = types;
				var list = _self.getIntraAreaResource();
				if(typeof callback === 'function'){
					var param = {
						mode:_self.mode,
						type:"type_changed",
						data:list
					}
					callback(param);
				}
			},
			addRAlarm: function (alarms) {
				var _self = this;
				var resources =  _self.resources;
				for (var i = 0, alarm; alarm = alarms[i]; i++) {
					var resource = resources[alarm['id']];
					if(i==0){
						if(resource){
							var param = {
								lng:resource['lng'],
								lat:resource['lat']
							}
							_self.setCenter(param);
						}
					}
					if(resource)
						resource['alarm'] = true;
					_self.rAlarms[alarm['id']] = alarm;
				}
				if (!_self.rAlarmTimer)
					_self._startRAlarm();
			},
			removeRAlarm: function (alarmIds) {
				var _self = this;
				var resources =  _self.resources;
				for (var i = 0, id; id = alarmIds[i]; i++) {
					delete  _self.rAlarms[id];
					var resource =  resources[id];
					if(resource){
						resource['alarm'] = false;
					}
					_self._setResourceIcon(id);
				}
				var isEmpty = true;
				for (var i in _self.rAlarms) {
					isEmpty = false;
					break;
				}
				if (isEmpty) {
					_self.clearRAlarm();
				}
			},
			_startRAlarm: function () {
				var _self = this;
				var flag = "highlight";
				var imagePath = _self.setting.imagePath;
				if (!_self.rAlarmTimer) {
					_self.rAlarmTimer = setInterval(function () {
						var rAlarms = _self.rAlarms;
						for (var i in rAlarms) {
							var icon = flag === "highlight" ?
							rAlarms[i]['highlightIcon'] || imagePath + "base/skin/images/alarm.png":
								null;
							_self._setResourceIcon(rAlarms[i]['id'],icon);
						}
						flag = flag === "highlight" ? "normal" : "highlight";
					}, 1000);
				}
			},
			clearRAlarm: function () {
				var _self = this;
				var rAlarms = _self.rAlarms;
				clearInterval(_self.rAlarmTimer);
				_self.rAlarmTimer = null;
				var resources =  _self.resources;
				for (var i in rAlarms) {
					var resource = resources[i];
					if(resource){
						resource['alarm'] = false;
					}
					_self._setResourceIcon(i);
				}
				_self.rAlarms = {};
			},
			_setResourceIcon:function(id,icon){

			},
			_loadResources:function(resources){

			},
			loadResources:function(resources){
				var _self = this;
				if(resources&&resources.length>0){
					_self._loadResources(resources);
				}
			},
			_addResources:function(resources){

			},
			addResources:function(resources){
				var _self = this;
				if(resources&&resources.length>0){
					_self._addResources(resources);
				}
			},
			_removeResources:function(values){

			},
			removeResources:function(values){
				var _self = this;
				_self._removeResources(values);
			},
			getIntraAreaResource:function(){

			},
			/**
			 * 回调函数
			 * @param type
			 * @param original
			 */
			_callback:function(type,original){
				var _self = this;
				var callback = _self.setting['callback'][type];
				if(typeof callback === 'function'){
					var param = {
						mode:_self.mode,
						type:type,
						original:original,
						data:[]
					};
					switch (type){
						case 'rect':
						case 'circle':
						case 'polyline':
						case 'polygon':
							var list = _self.getIntraAreaResource();
							param['data'] = list;
							break;
						case 'clear':
							_self.getIntraAreaResource();
							break;
						case 'measure':
							_self.getIntraAreaResource();
							break;
						default :
							break;
					}
					callback(param);
				};
			},
			buildToolBar: function () {

			},
			loadResource: function (resources) {

			},

			/************** by lzc 开始 ***************** */
			/**
			 *  获取地图当前中点经纬度
			 */
			getCenter: function () {

			},
			/**
			 * 设置地图当前中点经纬度
			 * @param point
			 */
			setCenter: function (point) {

			},
			/**
			 * 获取地图当前级别
			 */
			getZoomLevel: function () {

			},
			/**
			 * 获取地图当前最大级别
			 */
			getMaxLevel: function () {

			},

			/**
			 * 设置地图当前级别
			 * @param zoomLevel
			 */
			setZoomLevel: function (zoomLevel) {

			},
			/**
			 * 添加标注
			 * @param marker
			 */
			addMarker: function (marker) {

			},
			/**
			 * 修改标注
			 * @param marker
			 */
			editMarker: function (marker) {

			},
			/**
			 * 删除一个标注
			 * @param id
			 */
			deleteMarker: function (id) {

			},
			/**
			 * 删除所有标注
			 * @param ids
			 */
			clearMarkers: function (ids) {

			},
			/**
			 * 打开气泡标注
			 * @param
			 */
			openInfoWindow: function (point,strHTML,bIsInScreen) {

			},
			/**
			 * 关闭气泡标注
			 * @param
			 */
			closeInfoWindow: function (point,strHTML,bIsInScreen) {

			},

			/************** by lzc 结束 ***************** */
			setDrawStyle: function (style) {
				this.setDrawMode(style);
			},
			setDrawIcon:function(mode){
				ToolBox.setDrawMode(mode);
			},
			setDrawMode:function(mode){

			},
			removeLocation:function(){

			},
			setMapMode:function(mode){
				var _self = this;
				var mapMode = _self.allMode;
				_self.removeLocation();
				_self.mode = mode;
			},
			/********************** by ly start *************************/
			_showRoad: function (resource,callback) {

			},
			drawLine:function(point){

			},
			searchRoad: function (obj,callback,roadWidth) {
				var _self = this;
				var roadName = obj.roadName;
				var url = obj.url;
				var returnVal = null;
				var params="filterStr="+roadName;
				$.ajax({
					url: url,
					type: "post",
					data:params,
					async:false,
					dataType: "json",
					success: function(data) {
						if(data!=null&&data!=""&&data.length>0){
							returnVal = data;
						}
					},
					error: function(data) {
					}
				});
				if(returnVal&&returnVal.length>0){
					var _self = this;
					var resource = {
						id: obj.id,
						paths:returnVal,
						uIcon:obj.uIcon
					}
					_self._showRoad(resource,callback,roadWidth);
					var zoom = _self.getZoomLevel();
					zoom < 16 ? _self.setZoomLevel(16) : null;
				}
				else{
					if(typeof callback === "function"){
						var param = {
							mode:_self.mode,
							type:"road",
							original:null,
							data:null
						};
						callback(param);
					}
				}
			},
			clearRoad: function(id){
			},
			/********************** by ly end *************************/
			/********************** 线选 start *************************/
			getResourcesInRect:function(startPoint,endPoint,spacing){
				spacing = spacing/2||8;
				var _self = this;
				var list = [];
				var resources = _self.resources;
				var points = _self._getRectPoints(startPoint,endPoint,spacing);
				//_self.drawPolygon(points);
				for (var i in resources) {
					var resource = resources[i];
					var point = {
						lat:resource['lat'],
						lng:resource['lng']
					};
					var isContain = _self.isContain(points[0],points[1],points[2],points[3],point);
					if(isContain){
						list.push(resource);
					}
				}
				return list;
			},
			_getRectPoints:function(startPoint,endPoint,spacing){
				var angle = Math.PI/2 - Math.atan((endPoint.lat-startPoint.lat)/(endPoint.lng-startPoint.lng));
				var x = spacing * Math.cos(angle)/111000*Math.cos(startPoint.lat);
				var y = spacing * Math.sin(angle)/111000;
				var points = [];
				var point1 = {
					lat:startPoint.lat + y,
					lng:startPoint.lng - x
				};
				var point2 = {
					lat:startPoint.lat - y,
					lng:startPoint.lng + x
				};
				var x1 = spacing * Math.cos(angle)/111000*Math.cos(endPoint.lat);
				var point3 = {
					lat:endPoint.lat + y,
					lng:endPoint.lng - x1
				};
				var point4 = {
					lat:endPoint.lat - y,
					lng:endPoint.lng + x1
				};
				points.push(point1);
				points.push(point2);
				points.push(point4);
				points.push(point3);
				return points;
			},
			isContain:function(mp1,mp2,mp3,mp4,mp) {
				var _self = this;
				if (_self.Multiply(mp, mp1, mp2) * _self.Multiply(mp,mp4, mp3) <= 0
					&& _self.Multiply(mp, mp4, mp1) * _self.Multiply(mp, mp3, mp2) <= 0)
					return true;
				return false;
			},
			// 计算叉乘 |P0P1| × |P0P2|
			Multiply:function(p1, p2, p0) {
				return ((p1.lng - p0.lng) * (p2.lat - p0.lat) - (p2.lng - p0.lng) * (p1.lat - p0.lat));
			},
			/********************** 线选 end *************************/
			/********************** 路径分析 start *************************/
			getFeature:function(point){
				var feature = {
					"geometry":{
						"x":point['lng'],
						"y":point['lat'],
						"spatialReference": {
							"wkid": 4326
						}
					}
				}
				return feature;
			},
			transform84ToLatLng:function(point){
				return point;
			},
			transformLatLngTo84:function(point){
				return point;
			},
			drawPath:function(obj,callback,roadWidth){

			},
			showPath:function(obj,callback,roadWidth){
				var _self = this;
				var points = obj['points'];
				var url = _self.setting.NAServer +
					"?f=json&returnDirections=false&returnRoutes=true&returnStops=false&returnBarriers=false&returnPolygonBarriers=false" +
					"&returnPolylineBarriers=false&outputLines=esriNAOutputLineTrueShape&stops=";
				var features = [];

				for(var i=0,point;point=points[i];i++){
					var newPoint = _self.transformLatLngTo84(point);
					features.push(_self.getFeature(newPoint));
				}
				var params = {
					"type": "features",
					"features": features,
					"doNotLocateOnRestrictedElements": true
				};
				url += JSON.stringify(params);
				$.ajax({
					url: url,
					type: "GET",
					data:null,
					async:false,
					dataType: "json",
					success: function(data) {
						if(data!=null&&data!=""){
							obj['path'] = data['routes']['features'][0]['geometry']['paths'];
							_self.drawPath(obj,callback,roadWidth);
							var zoom = _self.getZoomLevel();
							zoom < 16 ? _self.setZoomLevel(16) : null;
						}
						else{
							if(typeof callback === "function"){
								var param = {
									mode:_self.mode,
									type:"road",
									original:null,
									data:null
								};
								callback(param);
							}
						}
					},
					error: function(data) {
					}
				});
			},
			showPath_async:function(obj,callback){
				var _self = this;
				var id = obj.id;
				var uIcon = obj['uIcon'];
				var points = obj['points'];
				var flag = false;
				var originalPoint = [];
				var zoom = _self.getZoomLevel();
				zoom < 16 ? _self.setZoomLevel(16) : null;
				for(var i=0,len = points.length; i < len -1;i++){
					var pointPre = points[i];
					var pointEnd = points[i+1];
					var newPointPre = _self.transformLatLngTo84(pointPre);
					var newPointEnd = _self.transformLatLngTo84(pointEnd);
					originalPoint.push(newPointPre);
					if(i == len-2){
						originalPoint.push(newPointEnd);
					}
					var data = _self.pTopFeatures(newPointPre,newPointEnd);
					if(data!=null&&data!=""){
						flag = true;
						var path = data['routes']['features'][0]['geometry']['paths'];
						var params = {};
						params.id = id;
						params.path = path;
						params.uIcon = uIcon;
						params.point = [pointPre,pointEnd];
						params.mode = null;
						if(i == 0){
							params.mode = 'create';
							_self.drawPath_async(params);
						}
						else{
							params.mode = 'append';
							_self.drawPath_async(params);
						}
					}
				}
				if(typeof callback === "function"){
					var param = {
						mode:_self.mode,
						type:"road",
						original:originalPoint,
						data:null
					};
					if(flag == true){
						param.data = [];
					}
					callback(param);
				}
			},
			pTopFeatures: function(pointPre,pointEnd){
				var _self = this;
				var url = _self.setting.NAServer +
					"?f=json&returnDirections=false&returnRoutes=true&returnStops=false&returnBarriers=false&returnPolygonBarriers=false" +
					"&returnPolylineBarriers=false&outputLines=esriNAOutputLineTrueShape&stops=";
				var features = [];
				features.push(_self.getFeature(pointPre));
				features.push(_self.getFeature(pointEnd));

				var params = {
					"type": "features",
					"features": features,
					"doNotLocateOnRestrictedElements": true
				};
				url += JSON.stringify(params);
				var returnData = null;
				$.ajax({
					url: url,
					type: "GET",
					data:null,
					async:false,
					dataType: "json",
					success: function(data) {
						returnData = data;
					},
					error: function(data) {
					}
				});
				return returnData;
			},
			drawPath_async:function(obj){
			}

			/********************** 路径分析 end *************************/
		};
		var ToolBox = {
			drawMode:{
				pan:{
					title:"停止绘图"
				},
				measure:{
					title:"绘制线条"
				},
				circle:{
					title:"绘制圆形"
				},
				polygon:{
					title:"绘制形状"
				},
				rect:{
					title:"绘制矩形"
				},
				clear:{
					title:"清除"
				}
			},
			init:function(doc,toolbox,callback){
				var _self = this;
				_self.callback = callback;
				_self.build(doc,toolbox,callback);
			},
			build:function(doc,toolbox,callback){
				if(!doc){
					return;
				}
				var _self = this;
				doc.style.position = "relative";

				var types = toolbox['type'];
				var len = types.length;
				var drawMode = _self.drawMode;
				var $toolbox = document.createElement("div");
				$toolbox.className = "toolbox";
				doc.appendChild($toolbox);
				for(var i = 0;i<len;i++){
					var modeName = types[i];
					var mode = drawMode[modeName];
					if(mode){
						var $toolBtn = document.createElement("i");
						$toolBtn.type = $toolBtn.className = modeName;
						$toolBtn.id = "tool_btn_"+modeName;
						$toolBtn.title = mode['title'];
						$toolbox.appendChild($toolBtn);
						if(modeName === "clear"){
							$toolBtn.onmousedown = function(event){
								this.className = "clear-active";
							}
							$toolBtn.onmouseup = function(event){
								this.className = "clear";
							}
							$toolBtn.onclick = function(event){
								callback ? callback.setDrawStyle("clear") : null;
							}
						}
						else{
							$toolBtn.onclick = function(event){
								if(this === _self.originalMode){
									return;
								}
								var $this = this;
								_self.setDrawMode($this.type);
								callback ? callback.setDrawStyle($this.type) : null;
							}
						}
					}
				}
			},
			setDrawMode:function(mode){
				var _self = this;
				if(_self.originalMode){
					_self.originalMode.className = _self.originalMode.type;
				}
				var doc = document.getElementById("tool_btn_"+mode)
				//var doc = document.getElementsByClassName(mode);
				if(doc){
					_self.originalMode = doc;
					doc.className = doc.type + "-active";
				}
			}
		}
	})(jTop, window);
	return jTop.BMap;
})