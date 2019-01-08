var BMAP_NORMAL_MAP_HD ;
var BMAP_HYBRID_MAP_HD ;
var mtd = {};
mtd.DEFAULT_LATITUDE = 36.81574;
mtd.DEFAULT_LONGITUDE = 110.95417;
mtd.DEFAULT_ZOOM = 5;
mtd.DEFAULT_MAPTYPE = BMAP_NORMAL_MAP;
mtd.DEFAULT_MAPTYPE_INDEX = 0;
mtd.showAreaLabel=true;
mtd.map = null;
mtd.label = null;
mtd.showCopyright = false;
mtd.isTrialVersion = true;
mtd.showResolutionMapScale = true;
mtd.markers =[];
mtd.markerClusterer =null;
mtd.pois = [];
mtd.tempMarkerCount = 0;
mtd.offsetX = -57;
mtd.offsetY = -7;
mtd.scaledDrawingBar = false;
mtd.scaleControl = null;
mtd.removedCount = 0;
mtd.projection = null;
mtd.drawingManager = null;
mtd.boundary = null;
mtd.customPolygon = null;
mtd.visibleZoom = 10;
mtd.styleOptions = {
	//enableEditing: true,
	//enableClicking:true,
	strokeColor: "#009ad6",
	fillColor: "#009ad6",
	strokeWeight: 3,
	strokeOpacity: 0.95,
	fillOpacity: 0.15,
	strokeStyle: 'solid' //solid或dashed。
};
mtd.trafficTileLayer = null;
mtd.hasTrafficTileLayer = false;
mtd.normalUDT="20140522";
mtd.normalVer="024";
mtd.satelliteUDT="20140117";
mtd.satelliteVer="009";
mtd.satelliteStreetUDT="20140522";
mtd.satelliteStreetVer="024";
