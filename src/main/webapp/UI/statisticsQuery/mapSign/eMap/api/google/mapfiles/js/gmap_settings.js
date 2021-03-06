var mtd = {};
mtd.map = null;
mtd.customPolygon = null;
mtd.areaLabel = null;
mtd.clearButton = null;
mtd.rulerPolyline = null;
mtd.marker = null;
mtd.navigationMarker = null;
mtd.navigationCircle = null;
mtd.previousPoint = null;
mtd.totalDistance = 0;
mtd.showTrack = false;
mtd.newPosition = "";
mtd.polylines = [];
mtd.infowindow = null;
mtd.drawingManager = null;
mtd.fileSystemObject = null;
mtd.markers = [];
mtd.overlayExists = false;
mtd.mapTypeIds = [];
mtd.copyrights = {};
mtd.mercatorPuzzle = null;
mtd.copyrightNode = null;
mtd.currentZoom = 4;
mtd.showCoordGrid = false;
mtd.coordGridExists = false;
mtd.isMSIE = true;
mtd.offlineMode = false;
mtd.showCopyright = false;
mtd.showResolutionMapScale = true;
mtd.pois = [];
mtd.tempMarkerCount = 0;
mtd.markerManager =null;
mtd.MAPABC_ROAD = 0;
mtd.MAPABC_SATELLITE = 1;
mtd.MAPABC_HYBRID = 2;
mtd.GOOGLE_ROAD = 3;
mtd.GOOGLE_SATELLITE = 4;
mtd.GOOGLE_SATELLITE_EN = 5;
mtd.GOOGLE_HYBRID = 6;
mtd.GOOGLE_TERRAIN = 7;
mtd.GOOGLE_ROAD_NOLABEL = 8;
mtd.GOOGLE_HYBRID_NOLABEL = 9;
mtd.GOOGLE_TERRAIN_NOLABEL = 10;
mtd.SOSO_ROAD = 11;
mtd.SOSO_SATELLITE = 12;
mtd.SOSO_HYBRID = 13;
mtd.SOSO_TERRAIN = 14
mtd.YAHOO_ROAD = 15;
mtd.YAHOO_SATELLITE = 16;
mtd.NOKIA_ROAD = 17;
mtd.NOKIA_SATELLITE = 18;
mtd.NOKIA_HYBRID = 19;
mtd.NOKIA_TERRAIN = 20;
mtd.BING_ROAD_CN = 21;
mtd.BING_ROAD = 22;
mtd.BING_SATELLITE = 23;
mtd.BING_HYBRID = 24;
mtd.SUPERMAP_ROAD = 25;
mtd.SMARTEARTH_ROAD = 26;
mtd.ARCGIS_Community = 27;
mtd.ARCGIS_StreetColor = 28;
mtd.ARCGIS_StreetWarm = 29;
mtd.ARCGIS_StreetCold = 30;
mtd.ARCGIS_StreetGray = 31;
mtd.ARCGIS_CommunityENG = 32;
mtd.ARCGIS_SATELLITE = 33;
mtd.TDT_ROAD = 34;
mtd.TDT_SATELLITE = 35;
mtd.TDT_HYBRID = 36;
mtd.TDT_TERRAIN = 37;
mtd.TOPOMAPPER_TERRAIN = 38;
mtd.PhysicalRelief = 39;
mtd.HISTORIC_NLSMAP = 40;
mtd.OSM_ROAD = 41;
mtd.EARTH_NIGHT = 42;
mtd.NAVINFO_ROAD=43;
mtd.NAVINFO_HYBRID=44;
mtd.GOOGLE_M_VER = "264";
mtd.GOOGLE_H_VER = "264";
mtd.GOOGLE_S_VER = "150";
mtd.languageCode = "zh-cn";
mtd.mapsever = "mt{0}.google.cn";
mtd.DEFAULT_MAPTYPE_INDEX = 3;//6;
mtd.DEFAULT_LATITUDE = 43.9169;
mtd.DEFAULT_LONGITUDE = 81.33387;
mtd.DEFAULT_ZOOM = 16;
mtd.GOOGLE_HD_VER = "";
mtd.STYLE_PARAMS_URL = "";
mtd.isTrialVersion = false;
mtd.showAreaLabel = true;
mtd.trafficTileLayerExists = false;
mtd.TRIAL_WATERMARK = '软件未注册-QQ:64445322';
mtd.TILE_PATH = "http://10.0.10.23/offlinemap/";//"E:\\mapdownload\\";
mtd.TILE_SIZE = 512;
mtd.visibleZoom = 10;
mtd.isDraggingShape = false;
mtd.polyOptions = {
    strokeColor: "#009ad6",
    fillColor: "#009ad6",
    //geodesic: true,
    draggable: false,
    fillOpacity: 0.15,
    strokeWeight: 3,
    strokeOpacity: 0.85,
    clickable: true,
    editable: true,
    enableClicking: true
    //zIndex: 3
};