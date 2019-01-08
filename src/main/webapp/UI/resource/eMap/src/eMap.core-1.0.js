/**
 * Created by Administrator on 16-7-4.
 */
define(['require', 'base/jTop'], function (require) {
	var jTop = require('base/jTop');
	(function (global, win) {
		global.EMap = function (setting) {
			var _self = this;
			_self.mapType = setting['mapType'] ? setting['mapType'] : _self.mapType;
			var path = "";
			switch (_self.mapType){
				case 'pgis':
					path = "pgis/pgis.core-1.0";
					break;
				case 'gmap':
					path = "google/gMap.core-1.0";
					break;
				default :
					path = null;
					break;
			}
			if(!path){
				throw '暂不支持'+_self.mapType+'类型地图';
			}
			win.require.config({
				paths: {
					"map": path
				}
			})
			win.require(["map"], function (Map) {
				_self.map = new Map(setting);
			})
		};
		global.EMap.prototype = {
			mapType:"pgis",
			map:null,
			/**
			 * 加载资源
			 * @param resources 资源列表
			 * @param key 标识
			 */
			loadResources:function(resources,key){
				var _self = this;
				_self.map.loadResources(resources,key);
			},
			/**
			 * 添加资源
			 * @param resources 资源列表
			 * @param key 标识
			 */
			addResources:function(resources,key){
				var _self = this;
				_self.map.addResources(resources,key);
			},
			/**
			 * 删除资源
			 * @param values 标识数组
			 */
			removeResources:function(values){
				var _self = this;
				_self.map.removeResources(values);
			},
			editResourcesIcon:function(resources){
				var _self = this;
					_self.map.editResourcesIcon(resources);
			},
			/**
			 *  获取地图当前中点经纬度
			 */
			getCenter: function () {
				return this.map.getCenter();
			},
			/**
			 * 设置地图中心点
			 * @param point 中心点
			 */
			setCenter: function (point) {
				if(point)
					this.map.setCenter(point);
			},
			/**
			 * 获取地图的级别
			 */
			getZoomLevel:function(){
				return this.map.getZoomLevel();
			},
			/**
			 * 设置地图级别
			 * @param zoomLevel 级别
			 */
			setZoomLevel:function(zoomLevel){
				if(zoomLevel)
					this.map.setZoomLevel(zoomLevel);
			},
			/**
			 * 获取地图的最大级别
			 */
			getMaxLevel:function(){
				return this.map.getMaxLevel();
			},
			/**
			 * 获取指定经纬度周围资源
			 * @param point 经纬度
			 * @param radius 半径
			 * @returns {*}
			 */
			getRoundResources:function(point,radius){
				var _self = this;
				point = point ? point : _self.map.getCenter();
				radius = radius ? radius : 5000;
				return _self.map.getRoundResources(point,radius);
			},
			setMapMode:function(mode){
				this.map.setMapMode(mode);
			},
			openInfoWindow: function (point,strHTML,bIsInScreen) {
				if(point&&strHTML)
					this.map.openInfoWindow(point,strHTML,bIsInScreen);
			},
			closeInfoWindow: function () {
				this.map.closeInfoWindow();
			},
			setCenterByResource:function(id){
				if(id)
					this.map.setCenterByResource(id);
			},
			addMarker:function(marker){
				if(marker)
					this.map.addMarker(marker);
			},
			getResourceInfo:function(id){
				if(id&&id!=="")
					return this.map.getResourceInfo(id);
				return null;
			},
			editMarker:function(marker){
				if(marker)
					this.map.editMarker(marker);
			},
			removeMarker:function(id){
				if(id)
					this.map.deleteMarker(id);
			},
			addRAlarm:function(alarms){
				if(alarms)
					this.map.addRAlarm(alarms);
			},
			removeRAlarm:function(alarms){
				if(alarms)
					this.map.removeRAlarm(alarms);
			},
			clearRAlarm:function(){
				this.map.clearRAlarm();
			},
			setCTypes:function(cTypes,callback){
				if(cTypes)
					this.map.setCTypes(cTypes,callback);
			},
			showPathWay:function(obj){
				if(obj)
					this.map.showPathWay(obj);
			},
			clearPathWay:function(id){
				if(id)
					this.map.clearPathWay(id);
			},
			/********************** by ly start *************************/
			searchRoad:function(obj,callback,roadWidth){
				if(obj)
					this.map.searchRoad(obj,callback,roadWidth);
			},
			clearRoad:function(id){
				if(id)
					this.map.clearRoad(id);
			},
			/********************** by ly end *************************/
			showPath:function(obj,callback,roadWidth){
				if(obj)
					this.map.showPath(obj,callback,roadWidth);
			},
			showPath_async:function(obj,callback){
				if(obj)
					this.map.showPath_async(obj,callback);
			}
		}
	})(jTop, window);
	return jTop.EMap;
})