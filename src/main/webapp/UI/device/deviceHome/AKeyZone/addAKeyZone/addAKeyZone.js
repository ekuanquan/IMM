$(document).ready(function() {
	$("#signupForm").Validform({
		tiptype : 2,
		btnSubmitId : "confirmButton",
		callback : sure
	});
	init();
});
;
(function(window, $) {

	window.init = _init;
	window.sure = _sure;

	var _global = {
		popusName : "",
		aunSnmodel1 : 0,
		aunSnmodel : 0,
		aunSnmodel2 : 0,
		aunSnmodel3 : 0,
	};
	function _init() {
		_global.popusName = parent.getPopusName();
		var editjson = parent.getDataJson();
		_initLayout();
		_initEvent();
		setCombo(editjson);
	}
	function _initLayout() {
		_global.popusName = parent.getPopusName();
		var editjson = parent.getDataJson();
		if (_global.popusName == 'addAKeyZone') {
			$("#title_left").text("添加设备防区");
			var newtime = getNowFormatDate();
			newtime = newtime.split(" ")[0];
			$("#installTime_input").val(newtime);
		} else if (_global.popusName == 'editAKeyZone') {
			$("#title_left").text("修改设备防区");
			$("#zoneNum_input").val(editjson.devZoneId);
			$("#zoneLocation_input").val(editjson.atPos);
			$("#installTime_input").val(editjson.instDate);
			$("#probeCount_input").val(editjson.snNum);
			$("#notes_input").val(editjson.fMemo);

			$("#zoneNum_input").css({
				"pointer-events" : "none",
				"opacity" : "0.5",
				"background-color" : "#b5b5b5"
			});
			$("#confirmButton").text("确定");
		} else {

		}
	}
	function _initEvent() {
		$("#title_close,#cancelButton").bind("click", function() {
            parent._closePopus();
		});
		$("#installTime_input").bind('focus', function() {
			WdatePicker({
				dateFmt : 'yyyy-MM-dd',
				isShowClear : false
			});
			this.blur();
		});
	}

	function sure() {
		var deviceData = parent.parent.getPopupsRowJson();
		var devzoneId = $("#zoneNum_input").val();
		if (devzoneId.length == 1) {
			devzoneId = "000" + devzoneId;
		} else if (devzoneId.length == 2) {
			devzoneId = "00" + devzoneId;
		} else if (devzoneId.length == 3) {
			devzoneId = "0" + devzoneId;
		}
        var snModelId=$("#probeModel_input").val();
        if(snModelId == null || snModelId ==""||snModelId =="undefined"){
            snModelId = -1;
        }
        var snType=$("#probeType_input").val();
        if(snType == null || snType ==""||snType =="undefined"){
            snType = -1;
        }
        var wantDo=$("#reactivityType_input").val();
        if(wantDo == null || wantDo ==""||wantDo =="undefined"){
            wantDo = -1;
        }
        var almType=$("#policeType_input").val();
        if(almType == null || almType ==""||almType =="undefined"){
            almType = -1;
        }
        var snNum = $("#probeCount_input").val();
        if(snNum == null || snNum ==""||snNum =="undefined"){
            snNum = 0;
		}
		var json = {
            data:{
                "devId" : deviceData.devId, // 需要拿到报警主机设备编号
                "devZoneId" : devzoneId,
                "atPos" : $("#zoneLocation_input").val(),
                "instDate" : $("#installTime_input").val(),
                "snModelId" : snModelId,
                "snType" : snType,
                "snNum" : snNum,
                "wantDo" : wantDo,
                "almType" : almType,
                "fMemo" : $("#notes_input").val()
			}
		};
		if (_global.popusName == "addAKeyZone") {
			var end = post_sync(json,
					"/IntegratedMM/addDevZoneForOneClickDev.do");
			/* alert(end.result.message); */
			parent.parent.alertTip(end.message, 2000, null);
            if(end.code = "1000"){
                parent.showiframeDevice.reflaceDeviceZone();
            }
		} else if (_global.popusName == "editAKeyZone") {
            var editjson = {
                data:{
                    "atPos" : $("#zoneLocation_input").val(),
                    "instDate" : $("#installTime_input").val(),
                    "snModelId" : snModelId,
                    "snType" : snType,
                    "snNum" : snNum,
                    "wantDo" : wantDo,
                    "almType" : almType,
                    "fMemo" : $("#notes_input").val()
                },
                condition: {
                    "devId" : deviceData.devId, // 需要拿到报警主机设备编号
                    "devZoneId" : devzoneId
                }
            };

			var end = post_sync(editjson,
					"/IntegratedMM/updateDevZoneForOneClickDev.do");
			/* alert(end.result.message); */
			parent.parent.alertTip(end.message, 2000, null);
		}

	}

	function getQuerySnmodelList(editjson) { // 查询探头型号
			post_async(null, "/IntegratedMM/QuerySnmodelList.do",
					_callback_SnmodelList, editjson);
	}
	function _callback_SnmodelList(SnmodelList, editjson) {
		//var probeModel = document.getElementById("probeModel_input");
		var SnmoRusult = SnmodelList.result;
		//probeModel.options.length = 0;
		$("#probeModel_input").append("<option value=''></option>");
		for (var i = 0; i < SnmoRusult.length; i++) {
			if(editjson && (SnmoRusult[i].snModelId==editjson.snModelId||SnmoRusult[i].snModelName==editjson.snModelId)){
				$("#probeModel_input").append("<option value='"
					+ SnmoRusult[i].snModelId + "' selected>" + SnmoRusult[i].snModelName
					+ "</option>");
			}else {
				$("#probeModel_input").append("<option value='"
					+ SnmoRusult[i].snModelId + "'>" + SnmoRusult[i].snModelName
					+ "</option>");
			}
		}
		$('#probeModel_input').searchableSelect();
		$(".searchable-select-input").css({
			width : "192px"
		});
	}

	function getQueryWanttoList(editjson) { // 查询反应类型
			post_async(null, "/IntegratedMM/QueryWanttoList.do",
					_callback_WanttoList, editjson);
	}
	function _callback_WanttoList(WanttoList, editjson) {
		//var reactivityType = document.getElementById("reactivityType_input");
		var WanttoRusult = WanttoList.result;
		//reactivityType.options.length = 0;
		$("#reactivityType_input").append("<option value=''></option>");
		for (var i = 0; i < WanttoRusult.length; i++) {
			if(editjson && (WanttoRusult[i].wantDo==editjson.wantDo||WanttoRusult[i].wantDoName==editjson.wantDo)){
				$("#reactivityType_input").append("<option value='" + WanttoRusult[i].wantDo + "' selected>"
					+ WanttoRusult[i].wantDoName + "</option>");
			}else {
				$("#reactivityType_input").append("<option value='" + WanttoRusult[i].wantDo + "'>"
					+ WanttoRusult[i].wantDoName + "</option>");
			}
		}
		$('#reactivityType_input').searchableSelect();
		//reactivityType.options[editjson.wantDo].selected = true;
	}

	function getQueryAlmtypeList(editjson) { // 查询警情类型
		 			post_async(null, "/IntegratedMM/QueryAlmtypeList.do",
					_callback_Almtype, editjson);
	}
	function _callback_Almtype(AlmtypeList, editjson) {
		var policeType = document.getElementById("policeType_input");
		var AlmtypeRusult = AlmtypeList.result;
		policeType.options.length = 0;
		$("#policeType_input").append("<option value=''></option>");
		for (var i = 0; i < AlmtypeRusult.length; i++) {
			if(editjson && (AlmtypeRusult[i].almType==editjson.almType || AlmtypeRusult[i].almTypeName==editjson.almType)){
				$("#policeType_input").append("<option value='"
					+ AlmtypeRusult[i].almType + "' selected>"
					+ AlmtypeRusult[i].almTypeName + "</option>");
			}else {
				$("#policeType_input").append("<option value='"
					+ AlmtypeRusult[i].almType + "'>"
					+ AlmtypeRusult[i].almTypeName + "</option>");
			}
		}
		$('#policeType_input').searchableSelect();
	}

	function getQuerySntypeList(editjson) { // 查询探头类型
			post_async(null, "/IntegratedMM/QuerySntypeList.do",
					_callback_SntypeList, editjson);
	}
	function _callback_SntypeList(SntypeList, editjson) {
		var probeType = document.getElementById("probeType_input");
		var SntypeRusult = SntypeList.result;
		probeType.options.length = 0;
		$("#probeType_input").append("<option value=''></option>");
		for (var i = 0; i < SntypeRusult.length; i++) {
			if(editjson && (SntypeRusult[i].snType==editjson.snType||SntypeRusult[i].snTypeName==editjson.snType)){
				$("#probeType_input").append("<option value='" + SntypeRusult[i].snType + "' selected>" + SntypeRusult[i].snTypeName + "</option>");
			}else {
				$("#probeType_input").append("<option value='" + SntypeRusult[i].snType + "'>" + SntypeRusult[i].snTypeName + "</option>");
			}
		}

		$('#probeType_input').searchableSelect();
		$(".searchable-select-input").css({
			width : "192px"
		});
	}

	function _sure(flag) {
		if (flag) {
			sure();
		} else {
			parent.parent.alertTip("请填写完整信息", 2000, null);
		}
	}
	function setCombo(editjson) {
		if(parent.showiframeDevice){
			if(parent.getAlmtypeList&&(typeof (parent.getAlmtypeList)=='function'))
			{
				var AlmtypeList=parent.getAlmtypeList();
				if(AlmtypeList.result.length>0){
					setTimeout(function () {
						_callback_Almtype(AlmtypeList,editjson);
					}, 1);
				}
				else{
					getQueryAlmtypeList(editjson);
				}
			}
			if(parent.getWanttoList&&(typeof (parent.getWanttoList)=='function'))
			{
				var WanttoList=parent.getWanttoList();
				if(WanttoList.result.length>0){
					setTimeout(function () {
						_callback_WanttoList(WanttoList,editjson);
					}, 1);
				}
				else{
					getQueryWanttoList(editjson);
				}
			}
			if(parent.getSnmodelList&&(typeof (parent.getSnmodelList)=='function'))
			{
				var SnmodelList=parent.getSnmodelList();
				if(SnmodelList.result.length>0){
					setTimeout(function () {
						_callback_SnmodelList(SnmodelList,editjson);
					}, 1);
				}
				else{
					getQuerySnmodelList(editjson);
				}
			}
			if(parent.getSntypeList&&(typeof (parent.getSntypeList)=='function'))
			{
				var SntypeList=parent.getSntypeList();
				if(SntypeList.result.length>0){
					setTimeout(function () {
						_callback_SntypeList(SntypeList,editjson);
					}, 1);
				}
				else{
					getQuerySntypeList(editjson);
				}
			}
		}
		else{
			getQuerySnmodelList(editjson);
			getQuerySntypeList(editjson);
			$("#reactivityType_input").click(function() {
			 	getQueryWanttoList(editjson);
			 });
			$("#policeType_input").click(function() {
			 	getQueryAlmtypeList(editjson);
			 });
		}
	}
})(window, jQuery);
