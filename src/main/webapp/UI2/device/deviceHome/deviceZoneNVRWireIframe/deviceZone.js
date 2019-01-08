$(document).ready(function() {
	init();
});
;(function(window,$,undefined){

	var cammId ;
	var deleZoneId;
	window.reflaceDeviceZoneNVRWireIframe=_reflaceDeviceZoneNVRWireIframe;
	window.init = _init;
	var _config ={
		ajaxUrl:{
            queryCameraTypeByIdUrl:"/IntegratedMM/queryCameraTypeById.do"
        }
	};
	var _global = {
        devMonitorId:""
    };
            function _init(){
                _initEvent();
                _initData();
                $("#title_del").click(function(){
                	if(deleZoneId!=undefined&&deleZoneId!=''){
                        parent.parent.comfireFloat("确认要删除此监控点" +_global.devMonitorId +"?",deleteZone,cancelCallback);
					}
					else {
                        parent.parent.alertTip('请先选择所要删除的监控点',2000,null);
					}

					/*deleteZone()*/
                });
            }

	
	function _initData(){
		 var deviceData = parent.parent.parent.parent.getPopupsRowJson();
		 post_async({"devId": deviceData.devId},"../../../../QueryCameraList.do",_devzone_callback);
	}
	
	function _initEvent() {
	    $("#title_add").bind("click",function () {
            parent.devicePopusManager('addDeviceZone',cammId);
        });
		/*$(".row").bind("dblclick",function () {
            parent.devicePopusManager('editDeviceZone');
        });*/
    }
	function _devzone_callback(data){
		var rowDatas = data.result;

		cammId = rowDatas[0].devId;			//��¼һ��nvr����������

		for(var i = 0 ;i< rowDatas.length;i++){
			_addRow(rowDatas[i]);
		}
	}
	function _addRow(row_json){
		//获取摄像机类型的名称
        var cameraTypeName = getcameraType(row_json.cameraType);
        $div_row = $("<div></div>");
		$cameraName = $("<div></div>");
        $devChannelId = $("<div></div>");
		$devMonitorId = $("<div></div>");
    	$atPos = $("<div></div>");
    	$instDate = $("<div></div>");
    	$almType = $("<div></div>");
    	$wantDo = $("<div></div>");
    	$cameraType = $("<div></div>");
    	$cameraModeId = $("<div></div>");
    	$fMemo = $("<div></div>");

        $div_row
            .append($cameraName)
            .append($devChannelId)
			.append($devMonitorId)
            .append($atPos)
            .append($instDate)
            .append($almType)
            .append($wantDo)
            .append($cameraType)
            .append($cameraModeId)
			.append($fMemo)
            .addClass('row')
			.attr('id', row_json.devMonitorId);
		$cameraName.addClass('table_item_5').text(row_json.cameraName).attr("title", row_json.cameraName);
		$devChannelId.addClass('table_item_3').text(row_json.devChannelId).attr("title", row_json.devChannelId);
		$devMonitorId.addClass('table_item_5').text(row_json.devMonitorId).attr("title", row_json.devMonitorId);
		$atPos.addClass('table_item_5').text(row_json.atPos).attr("title", row_json.atPos);
		$instDate.addClass('table_item_4').text(row_json.instDate).attr("title", row_json.instDate);
		//if(row_json.cameraType==2){row_json.cameraType="摄像机（有线NVR）"}else{row_json.cameraType=''};
		$almType.addClass('table_item_4').text(row_json.almType).attr("title", row_json.almType);
		$wantDo.addClass('table_item_4').text(row_json.wantDoName).attr("title", row_json.wantDoName);
		$cameraType.addClass('table_item_5').text(cameraTypeName).attr("title", cameraTypeName);
		$cameraModeId.addClass('table_item_5').text(row_json.cameraModelName).attr("title", row_json.cameraModelName);
		$fMemo.addClass('table_item_2').text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($("#table_content"));

        $div_row.bind('dblclick', function (e) {
        	 parent.devicePopusManager('editDeviceZone',row_json);
        });

		$div_row.bind('click', function (e) {
			$("#table_content div.selected").removeClass("selected");
			$("#"+row_json.devMonitorId).addClass("selected");
			deleZoneId = row_json.devId;
            _global.devMonitorId = row_json.devMonitorId;
		});
	}
	//获取摄像机类型的值2017年10月13日09:35:06
	function getcameraType(cameraType) {
		//post_async({"cameraType":cameraType},_config.ajaxUrl.queryCameraTypeByIdUrl,callbackcameraTypeName)
		var cameraTypedata = post_sync({"cameraType":cameraType},_config.ajaxUrl.queryCameraTypeByIdUrl);
		var cameraTypeName = "";
        var result = cameraTypedata.result;
        if(cameraTypedata.code == "1000"){
            cameraTypeName = result.cameraTypeName;
        }
        else {
            cameraTypeName = "";
        }
        return cameraTypeName;
    }

	function deleteZone(){
		//alert(deleZoneId);  DeleteDeviceCtrl
		var json={
			"devId":deleZoneId
		}
		var end = post_sync(json, "../../../../DeleteDeviceCtrl/deleteZone.do");
		/*alert(end.result.message)*/
        parent.parent.alertTip(end.result.message,2000,null);
		_reflaceDeviceZoneNVRWireIframe();
	}

	function _reflaceDeviceZoneNVRWireIframe(){		//ˢ��ҳ��
		location.reload();
	}
    function cancelCallback() {

    }
})(window,jQuery,undefined);