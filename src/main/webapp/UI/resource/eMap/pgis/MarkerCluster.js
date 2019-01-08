/**
 * Created by Administrator on 16-6-22.
 */
define(function(require) {
	function MarkerCluster(uEzMap,markers,options){
		var _self = this;
		_self._map = uEzMap;
		_self._markers = {};
		_self.setMarkers(markers);
		_self._clusters = [];
		_self._singleClusters = {};
		_self._gridSize = options['gridSize'] || 30;
		_self._sizes = [53, 56, 66, 78, 90];
		_self._maxZoom = options['maxZoom'] || null;
		_self._preZoom = _self._map.getZoomLevel();
		_self._imagePath = options['imagePath'] || _self.MARK_CLUSTER_IMAGE_PATH;
		_self._imageExtension = options['imageExtension'] || _self.MARK_CLUSTER_IMAGE_EXTENSION;
		_self._clusterResolution = _self.getSpanWidth() / _self.getViewWidth();
		_self._callback = options['clusterClick'];
		_self._defaultIcon = options['defaultIcon'] || _self._imagePath+'0.'+_self._imageExtension;
		_self._mode = options['mode'] || 'common';
		_self._map.addMapEventListener(EzEvent.MAP_ZOOMEND,function(event){
			var zoom = _self._map.getZoomLevel();
			var maxZoom = _self._map.getMaxLevel();
			if(zoom<0||zoom>maxZoom){
				return;
			}
			if(_self._preZoom != zoom){
				_self._preZoom = zoom;
			}
			_self.reset();
		});
		_self._map.addMapEventListener(EzEvent.MAP_PANEND,function(event){
			_self.reset();
		});
		_self._rType = options['rType'] || {};
		_self._styles = [];
		_self._setupStyles();
		markers&&markers.length>0 ? _self.createGraphics() : null;
	}
	MarkerCluster.prototype = {
		MARK_CLUSTER_IMAGE_PATH:"",
		MARK_CLUSTER_IMAGE_EXTENSION:"",
		setMarkers:function(markers){
			var _self = this;
			_self._markers = {};
			if(markers){
				_self._markers = markers;
			}
		},
		getViewWidth:function(){
			return this._map['map']['viewSize']['width'];
		},
		getViewHeight:function(){
			return this._map['map']['viewSize']['height'];
		},
		getSpanWidth:function(){
			var spanLatLng = this._map.getSpanLatLng();
			return spanLatLng['width'];
		},
		getSpanHeight:function(){
			var spanLatLng = this._map.getSpanLatLng();
			return spanLatLng['height'];
		},
		clusterTest:function(p,cluster){
			var distance = Math.sqrt(
					Math.pow(cluster.x - p.lng,2),
					Math.pow(cluster.y - p.lat,2)
				)/this._clusterResolution;
			return distance <= this._gridSize/5;
		},
		clearMarkers:function(){
			var _self = this;
			_self.clear();
			_self._markers = {};
		},
		clear:function(){
			var _self = this;
			for(var i = 0,cluster;cluster=_self._clusters[i];i++){
				cluster['_title']?_self._map.removeOverlay(cluster['_title']):null;
				_self._map.removeOverlay(cluster);
			}
			_self._clusters = [];
			_self._singleClusters = {};
		},
		reset:function(){
			var _self = this;
			_self._clusterResolution = _self.getSpanWidth() / _self.getViewWidth();
			_self.clear();
			_self.createGraphics(null);
		},
		loadMarkers:function(markers){
			var _self = this;
			_self.clear();
			if(markers){
				_self.setMarkers(markers);
				_self.createGraphics(null);
			}
		},
		createGraphics:function(markers){
			var _self = this;
			if(!markers)
				markers = _self._markers;
			var bounds = _self._map.getBoundsLatLng();
			for(var i in markers){
				var marker = markers[i];
				var point = new Point(marker['lng'],marker['lat']);
				if(!bounds.containsPoint(point))
					continue;
				var clustered = false;
				var clusters = _self._clusters ? _self._clusters : [];
				var len = clusters.length;
				for(var j = 0;j < len;j++){
					var cluster = clusters[j];
					if(_self.clusterTest(marker,cluster)){
						clustered = true;
						if(cluster['id'])
							delete _self._singleClusters[cluster['id']];
						cluster['markerKey'].push(marker['id']);
						cluster = _self.addMarker(marker,cluster);
						clusters[j] = cluster;
						break;
					}
				}
				if(!clustered){
					_self.createCluster(marker);
				}
			}
		},
		showIntraAreaMarkers:function(markers){
			var _self = this;
			_self.setMarkers(markers);
			_self.reset();
		},
		addMarkers:function(markers){
			var _self = this;
			_self.createGraphics(markers);
		},
		removeMarkers:function(ids){
			var _self = this;
			if(ids&&ids.length>0){
				var _markers = _self._markers;
				var _clusters = _self._clusters;
				for(var i = 0,id;id = ids[i];i++){
					delete _markers[id];
				}
				_self.clear();
				_self.createGraphics();
			}
		},
		setIcon:function(id,url){
			var _self = this;
			var cluster = _self._singleClusters[id];
			if(cluster){
				cluster.div.src = url || cluster.defaultIcon;
			}
		},
		getClusterByMarker:function(id){
			var _self = this;
			var clusters = _self._clusters;
			for(var i= 0,cluster; cluster = clusters[i];i++){
				if(cluster['markerKey'].indexOf(id)!=-1){
					return {
						lng:cluster['point']['x'],
						lat:cluster['point']['y']
					}
				}
			}
		},
		createMarker:function(marker,style){
			var _self = this;
			var uIcon=new Icon();
			uIcon.image=style['url'];//image/devicon/community_Hotel_normal.png
			uIcon.height=style['height'];
			uIcon.width=style['width'];
			uIcon.topOffset=0;
			uIcon.leftOffset=-0;
			var point = new Point(marker.lng,marker.lat);
			var mapMarker = new Marker(point,uIcon);//标注
			mapMarker.x = mapMarker['point']['x'];
			mapMarker.y = mapMarker['point']['y'];
			mapMarker.setZIndex(99);
			mapMarker.defaultIcon = uIcon.image;
			if(_self._mode === 'common'){
				mapMarker.addListener("click", function (param) {
					var callback = _self._callback;
					var param = {
						type:'cluster_click',
						original:{
							lng:mapMarker['point']['x'],
							lat:mapMarker['point']['y']
						},
						data:mapMarker['_markers']
					}
					typeof callback === 'function' ? callback(param) : null;
				});
			}
			_self._map.addOverlay(mapMarker);
			return mapMarker;
		},
		createCluster:function(marker){
			var _self = this;
			var point = {
				lng:marker['lng'],
				lat:marker['lat']
			}
			var url = marker['type']&&_self._rType[marker['type']]&&_self._rType[marker['type']]['icon'] ?
				_self._rType[marker['type']]['icon'] :
				_self._defaultIcon;//_self._imagePath+'0.'+_self._imageExtension
			var style = {
				url:url,
				width:32,
				height:32
			}
			var cluster = _self.createMarker(point,style);
			cluster['id'] = marker['id'];
			_self._clusters.push(cluster);
			if(_self._singleClusters)
				_self._singleClusters[marker['id']] = cluster;
			cluster['_markers'] = [marker];
			cluster['markerKey'] = [marker['id']];
		},
		addMarker:function(marker,cluster){
			var _self = this;
			if(_self.indexOfMarkers(marker,cluster)!=-1){
				return false;
			}
			cluster['_markers'].push(marker);
			var count = cluster['_markers'].length;
			if(count>1){
				cluster = _self._updateIcon(cluster);
			}
			return cluster;
		},
		indexOfMarkers:function(marker,cluster){
			cluster['_markers'] = cluster['_markers'] ? cluster['_markers'] : [];
			if(cluster['_markers'].indexOf)
				return cluster['_markers'].indexOf(marker);
			else{
				for(var i = 0,m;m = cluster[i];i++){
					if(marker === m){
						return i;
					}
				}
			}
			return -1;
		},
		_setupStyles:function() {
			for (var i = 0, size; size = this._sizes[i]; i++) {
				this._styles.push({
					url: this._imagePath + (i + 1) + '.' + this._imageExtension,
					height: size,
					width: size
				});
			}
		},
		_updateIcon:function(cluster){
			var _self = this;
			var numStyles = this._styles.length;
			var sums = this._calculator(cluster['_markers'], numStyles);
			var style = _self.useStyle(sums);
			if(style['url']!==cluster['icon']['image']){
				var uIcon=new Icon();
				uIcon.image=style['url'];
				uIcon.height=style['height'];
				uIcon.width=style['width'];
				uIcon.topOffset=0;
				uIcon.leftOffset=-0;
				var point = {
					lng:cluster['x'],
					lat:cluster['y']
				}
				var _markers = cluster['_markers'];
				var markerKey = cluster['markerKey'];
				var title = cluster['_title'];
				_self._map.removeOverlay(cluster);
				cluster = _self.createMarker(point,style);
				cluster['_markers'] = _markers;
				cluster['markerKey'] = markerKey;
				cluster['_title'] = title;
			}
			return _self.setTitle(cluster,sums['text']);
		},
		useStyle:function(sum) {
			var index = Math.max(0, sum.index - 1);
			index = Math.min(this._styles.length - 1, index);
			var style = this._styles[index];
			return style;
		},
		_calculator : function(markers, numStyles) {
			var index = 0;
			var count = markers.length;
			var dv = count;
			while (dv !== 0) {
				dv = parseInt(dv / 10, 10);
				index++;
			}
			index = Math.min(index, numStyles);
			return {
				text: count,
				index: index
			};
		},
		setTitle:function(cluster,count){
			var _self = this;
			var title = null;
			if(cluster['_title']){
				title = cluster['_title'];
				title.setName(count.toString());
				title.div.style.width = 'auto';
			}else{
				title = new Title(count.toString(),16,7,"宋体","#000000",null,null,"2",1);
				var point = new Point(cluster.x,cluster.y);
				title.setPoint(point);
				_self._map.addOverlay(title);
				title.div.style.border = "none";
				title.div.style.width = 'auto';
				title.div.style.zIndex = 99;
				cluster['_title'] = title;
			}
			return cluster;
		}
	}
	return MarkerCluster;
})
