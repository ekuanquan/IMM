//var deviceData = parent.parent.parent.parent.getPopupsRowJson();
$(document).ready(function() {
	init();
});
;(function(window,$,undefined){
	window.init = _init;
	

    var _config={
        ajaxUrl:{
            getAssociatedDeviceByUserIdUrl:'/IntegratedMM/getAssociatedDeviceByUserId.do'
        }
    };
    var _global = {
        top:parent.parent,
        plugins:{
            page:null
        },
        getAssociatedDeviceParams:{
            userPojo:{
                userId:""
            }
        }
    }

	function _init(){
		_initEvent();
		_initData();
	}
	
	function _initData(){
		_getAssociatedDevice();

	}
	
	function _initEvent() {
    }

    function _getAssociatedDeviceParams(){
        var params = {};
        params.userPojo = {};
        params.userPojo = _global.getAssociatedDeviceParams.userPojo;
        return params;
    }
    function _getAssociatedDevice(){
        var rowJson = parent.parent.getPopupsRowJson();
        _global.getAssociatedDeviceParams.userPojo.userId = rowJson.userId;
        _getmrDevId();              //获取主设备和远程监控设备
        var params  = _getAssociatedDeviceParams();
        post_async(params, _config.ajaxUrl.getAssociatedDeviceByUserIdUrl, _callback_getAssociatedDevice);
    }
    function _callback_getAssociatedDevice(data){
     var result = data.result;

     if (result.code == '0') {
         var associatedDevicePojo = data.associatedDevicePojo;
         for(var i = 0 ;i< associatedDevicePojo.length;i++){
            _addRow(associatedDevicePojo[i]);
        }
    }
        setColSize();
}
//获取主设备和远程监控设备
    function _getmrDevId() {
        var params= {
            ownerId:_global.getAssociatedDeviceParams.userPojo.userId
        };
        post_async(params,"/IntegratedMM/getControlDevsByUserId.do",_callballdev);
    }
    //填写主设备和远程监控设备
    function _callballdev(data) {
        if(data.code=="200"){
            $("#remoteDevId").val(data.result.remoteDevId);
            $("#masterDevId").val(data.result.masterDevId);
        }
    }
function _addRow(row_json){
    $div_row = $("<tr></tr>");
    $devId = $("<td></td>");
    $devName = $("<td></td>");
    //$devType = $("<div></div>");
    $devTypeName = $("<td></td>");
    //$devModelId = $("<div></div>");
    $devModelName = $("<td></td>");
    //$areaId = $("<div></div>");
    $areaName = $("<td></td>");
    $div_devstuats = $("<td></td>");

        $div_row
        .append($devId)
        .append($devName)
        .append($devTypeName)
        .append($devModelName)
        .append($areaName)
        .append($div_devstuats)
        .addClass('row');
        $devId.addClass('table_item_4').text(row_json.devId).attr("title", row_json.devId);
        $devName.addClass('table_item_4').text(row_json.devName).attr("title", row_json.devName);
        $devTypeName.addClass('table_item_4').text(row_json.devTypeName).attr("title", row_json.devTypeName);
        $devModelName.addClass('table_item_4').text(row_json.devModelName).attr("title", row_json.devModelName);
        $areaName.addClass('table_item_4').text(row_json.areaName).attr("title", row_json.areaName);
    var devState = "";
	switch(row_json.devState) {
		case 0:
			devState = "离线";
			break;
		case 1:
			devState = "在线";
			break;
		case 2:
			devState = "未知";
			break;
		default:
			break;
	}
    $div_devstuats.addClass('table_item_4').text(devState == null ? '' : devState).attr("title", devState == null ? '' : devState);

    $div_row.appendTo($("#table_content"));
        /*$div_row.bind('dblclick', function (e) {
            parent.open_device(row_json);
        });*/
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
            firstColDrag:true,
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