$(document).ready(function() {
	init();
});
;(function(window,$,undefined){

	var cammId ;
	//var deleZoneId;
	window.reflaceDeviceZoneNVRWireIframe=_reflaceDeviceZoneNVRWireIframe;
	window.init = _init;
	var _config ={
		ajaxUrl:{
            queryCameraTypeByIdUrl:"/IntegratedMM/queryCameraTypeById.do"
        }
	};
	var _global = {
        devMonitorId:[],
        devId:[]
    };
            function _init(){
                _initEvent();
                _initData();
                $("#title_del").click(function(){
                	/*if(deleZoneId!=undefined&&deleZoneId!=''){
                        parent.parent.comfireFloat("确认要删除此监控点" +_global.devMonitorId +"?",deleteZone,cancelCallback);
					}
					else {
                        parent.parent.alertTip('请先选择所要删除的监控点',2000,null);
					}*/
                    _global.devId = [];
                    _global.devMonitorId =[];
                    var all_row = $('.isChecked', '#table_content');
                    if(all_row.length>0){//打钩的批量删除的
                        for(var i = 0; i < all_row.length; i++) {
                            var $this = all_row[i];
                            var UserEvtId = $this.id;
                            var devMonitorId =$("#"+UserEvtId).data("devMonitorId");
                            _global.devId.push(UserEvtId);
                            _global.devMonitorId.push(devMonitorId);
                        }
                        console.log(JSON.stringify(_global.devId));
                        parent.parent.comfireFloat("确认删除选中监控点吗？",deleteZone,cancelCallback);
                    }else if($("#table_content").children().hasClass("selected")){//单选的删除的
                        $(".selected").each(function(a,b){
                            var UserEvtId = $(".selected").attr("id");
                            var devId =$("#"+UserEvtId).data("devId");
                            _global.devMonitorId.push(UserEvtId);
                            _global.devId.push(devId);
                        });
                        console.log(JSON.stringify(_global.devId));
                        parent.parent.comfireFloat("确认要删除此监控点" +_global.devMonitorId[0] +"?",deleteZone,null);
                    }else {
                        parent.parent.alertWarn("请先选择您所要删除的监控点！",null,null);
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
        //选择设备
        $('#allCheck').bind('click', function(e) {
            var $this = $(this);
            var check = $this.hasClass('isChecked');
            if(check) {
                $this.removeClass('isChecked').addClass('noChecked');
                $('.isChecked').removeClass('isChecked').removeClass('noChecked').addClass('noChecked');
            } else {
                $this.removeClass('noChecked').addClass('isChecked');
                $('.noChecked').removeClass('isChecked').removeClass('noChecked').addClass('isChecked');
            }
            _Checked();
        });
    }
	function _devzone_callback(data){
		var rowDatas = data.result;
        if(rowDatas != ""&&rowDatas !=null) {
            cammId = rowDatas[0].devId;			//��¼һ��nvr����������
            for (var i = 0; i < rowDatas.length; i++) {
                _addRow(rowDatas[i]);
            }
        }
        setColSize();
	}
	function _addRow(row_json){
		//获取摄像机类型的名称
        //var cameraTypeName = getcameraType(row_json.cameraType);
        $div_row = $("<tr></tr>");
        $div_Checked = $("<td></td>");
        $div_noChecked = $("<div></div>");
		$cameraName = $("<td></td>");
        $devChannelId = $("<td></td>");
		$devMonitorId = $("<td></td>");
    	$atPos = $("<td></td>");
    	$instDate = $("<td></td>");
    	$almType = $("<td></td>");
    	$wantDo = $("<td></td>");
    	$cameraType = $("<td></td>");
    	$cameraModeId = $("<td></td>");
        $gbId = $("<td></td>");
    	$fMemo = $("<td></td>");
        $div_Checked.append($div_noChecked);
        $div_row
            .append($div_Checked)
            .append($cameraName)
            .append($devChannelId)
			.append($devMonitorId)
            .append($atPos)
            .append($instDate)
            .append($almType)
            .append($wantDo)
            .append($cameraType)
            .append($cameraModeId)
            .append($gbId)
			.append($fMemo)
            .addClass('row')
			.attr('id', row_json.devMonitorId).data('devId', row_json.devId);
        $div_noChecked.addClass("noChecked").attr('id', row_json.devId).data('devMonitorId', row_json.devMonitorId);
		$cameraName.addClass('table_item_5').text(row_json.cameraName).attr("title", row_json.cameraName);
		$devChannelId.addClass('table_item_3').text(row_json.devChannelId).attr("title", row_json.devChannelId);
		$devMonitorId.addClass('table_item_5').text(row_json.devMonitorId).attr("title", row_json.devMonitorId);
		$atPos.addClass('table_item_5').text(row_json.atPos).attr("title", row_json.atPos);
		$instDate.addClass('table_item_4').text(row_json.instDate).attr("title", row_json.instDate);
		//if(row_json.cameraType==2){row_json.cameraType="摄像机（有线NVR）"}else{row_json.cameraType=''};
		if(row_json.almTypeName == ""||row_json.almTypeName==null){row_json.almTypeName = row_json.almType};
		$almType.addClass('table_item_4').text(row_json.almTypeName).attr("title", row_json.almTypeName);
        if(row_json.wantDoName == ""||row_json.wantDoName==null){row_json.wantDoName = row_json.wantDo};
		$wantDo.addClass('table_item_4').text(row_json.wantDoName).attr("title", row_json.wantDoName);
        if(row_json.cameraTypeName == ""||row_json.cameraTypeName==null){row_json.cameraTypeName = cameraType};
		$cameraType.addClass('table_item_5').text(row_json.cameraTypeName).attr("title", row_json.cameraTypeName);
        if(row_json.cameraModelName == ""||row_json.cameraModelName==null){row_json.cameraModelName = row_json.cameraModeId};
		$cameraModeId.addClass('table_item_5').text(row_json.cameraModelName).attr("title", row_json.cameraModelName);
        $gbId.addClass('table_item_5').text(row_json.gbId).attr("title", row_json.gbId);
		$fMemo.addClass('table_item_2').text(row_json.fMemo).attr("title", row_json.fMemo);
        $div_row.appendTo($("#table_content"));

        $div_row.bind('dblclick', function (e) {
        	 parent.devicePopusManager('editDeviceZone',row_json);
        });

		$div_row.bind('click', function (e) {
			$("#table_content tr").removeClass("selected");
			$("#"+row_json.devMonitorId).addClass("selected");
			//deleZoneId = row_json.devId;
            //_global.devMonitorId = row_json.devMonitorId;
		});
        $div_noChecked.bind('click', function(e) {
            var $this = $(this);
            var check = $this.hasClass('isChecked');
            if(check) {
                if($('#allCheck').hasClass('isChecked')) {
                    $('#allCheck').removeClass('isChecked').addClass('noChecked');
                }
                $this.removeClass('isChecked').addClass('noChecked');
            } else {
                $this.removeClass('noChecked').addClass('isChecked');
                var all_row = $('.row', '#table_content');
                var all_isChecked = $('.isChecked', '#table_content');
                if(all_row.length == all_isChecked.length){
                    $('#allCheck').removeClass('noChecked').addClass('isChecked');
                }
            }
            _Checked();
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
			"devIds":_global.devId
		};
		post_async(json, "../../../../DeleteDeviceCtrl/deleteZoneBatch.do",_callback_deleteUserZone);
	}
    function _callback_deleteUserZone(data) {

        if(data.result.code == "200") {
            //alert("删除成功。");
            parent.parent.alertTip(data.result.message,2000,null);
            $('#allCheck').removeClass('isChecked').addClass('noChecked');
            $("#title_del_text").text("删除");
            _reflaceDeviceZoneNVRWireIframe();
        }else {
            parent.parent.alertTip(data.result.message,null,null);
        }
    }

	function _reflaceDeviceZoneNVRWireIframe(){		//ˢ��ҳ��
		location.reload();
	}
    function cancelCallback() {

    }
    //判断是否有打钩
    function _Checked(){
        var all_row = $('.isChecked', '#table_content');
        if(all_row.length>0){
            $("#title_del_text").text("批量删除");
        }else {
            $("#title_del_text").text("删除");
        }
    }
    function setColSize(){
        var col1 = document.getElementById("listBox1").getElementsByTagName('td');//获取表头所有列
        var col2 = document.getElementById("listBox2").getElementsByTagName('td');//获取数据表所有列
        $("#listBox1").colResizable({
            minWidth: 20, //最小宽度
            liveDrag:true, //是否实时拖动
            gripInnerHtml:"<div id='dragDiv1'></div>", //拖动div
            draggingClass:"dragging", //拖动div样式
            onResize: null, //拖动时调用函数
            followCol:col2,//数据表的列集合
            mainCol:col1,//表头表的列结婚firstColDrag:false
            firstColDrag:false,
        });
        $("#listBox2").colResizableNot({
            minWidth: 20, //最小宽度
            liveDrag:true, //是否实时拖动
            gripInnerHtml:"<div id='dragDiv'></div>", //拖动div
            draggingClass:"dragging", //拖动div样式
            onResize: null //拖动时调用函数
        });
        document.getElementById("listBox2").style.width=document.getElementById("listBox1").style.width;
        var columnsize = col1.length;

        if((col2!=null&&col2.length>0)&&col1!=null){
            //给数据表重新获取宽度
            for (var i = 0; i < columnsize - 1; i++) {    //遍历Table的所有列
                col2[i].style.width = col1[i].style.width;//实际应用用这里
            }
        }
        //固定和滚动
        document.getElementById("listBox2").style.width=document.getElementById("listBox1").style.width;
        var right_div2 = document.getElementById("right_div2");
        right_div2.onscroll = function(){
            var right_div2_left = this.scrollLeft;
            document.getElementById("right_div1").scrollLeft = right_div2_left;
        }
    }
})(window,jQuery,undefined);