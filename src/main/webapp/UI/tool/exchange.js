

//区域
function areaChange(str,json){
	for (var i = 0; i < json.length; i++) {
		if (str == json[i].areaId) {
			return json[i].areaName;
		}else{

		}
	}
	return "";
}

//探头类型
function areaChange(str,json){
	for (var i = 0; i < json.length; i++) {
		if (str == json[i].snModelId) {
			return json[i].snTypeName;
		}else{

		}
	}
	return "";
}

//设备类型
function devChange(str,json){
	for (var i = 0; i < json.length; i++) {
		if (str == json[i].DevTypeId) {
			return json[i].DevTypeName;
		}else{

		}
	}
	return "";
}

//设备型号
function devModelChange(str,json){
	for (var i = 0; i < json.length; i++) {
		if (str == json[i].DevModelId) {
			return json[i].DevModelName;
		}else{

		}
	}
	return "";
}

//报警分析，处警、核警后的结果
function alarmAnalyzeChange(str,json){
	for (var i = 0; i < json.length; i++) {
		if (str == json[i].alarmAnalyzeId) {
			return json[i].alarmAnalyzeName;
		}else{

		}
	}
	return "";
}

//出警方式，处警单的时候使用
function dispatchTypeChange(str,json){
	for (var i = 0; i < json.length; i++) {
		if (str == json[i].dispatchTypeId) {
			return json[i].dispatchTypeName;
		}else{

		}
	}
	return "";
}

//事件类型
function eventTypeChange(str,json){
	for (var i = 0; i < json.length; i++) {
		if (str == json[i].eventTypeId) {
			return json[i].eventTypeName;
		}else{

		}
	}
	return "";
}

//维修类型
function maintainTypeChange(str,json){
	for (var i = 0; i < json.length; i++) {
		if (str == json[i].maintainTypeId) {
			return json[i].maintainTypeName;
		}else{

		}
	}
	return "";
}
/*function exchange2(str,json){
	for (var i = 0; i < json.length; i++) {

		for(var key in json[i])

		if (str == json[i].DevTypeId) {
			return json[i].DevTypeName;
		}else{

		}
	}
}*/