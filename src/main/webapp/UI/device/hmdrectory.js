/**
 * Created by ywhl on 2017/6/5.
 */
/**
 * 弹窗
 */
var zTreeObj;
var onClickNode;
var flag=0;

function treeReload(){
	var params={
		"userId":getZTreeUserID(),
		handleOnly: false,
	}
	var zNodes=post_sync(params,"/../IntegratedMM/getAreaList.do");
	zTreeObj = $.fn.zTree.init($("#treeDemo"), setting,zNodes);
	flag = 0;
}

function add() {
	parent.devicePopusManager('addZone');
}
function update() {
	parent.devicePopusManager('editZone',onClickNode);
}

function deleteArea() {

	var param_json = {
		id : onClickNode.id
	};
	post_async(param_json, '/../IntegratedMM/deleteArea.do', _callBack);
}

function _callBack(data) {
	if (data.code == 1) {
		treeReload();
		onClickNode = null;
        parent.alertTip("删除成功",2000,null);
	} else {
		console.log(data);
        parent.alertTip("删除失败",2000,null);
	}
	//parent.alertTip(data.message,2000,null);
}

/**
 * 树点击事件开始
 */
function zTreeOnClick(event, treeId, treeNode) {
	//alarmMainframeIframe.showAlarmMainframe(treeNode.id);
	//alert(treeNode.id);
	onClickNode = treeNode;
	$("#onClickNode").val(treeNode);
    $("#NVR_tab").data("flag",false);
    $("#AKey_tab").data("flag",false);
    $("#NVRWired_tab").data("flag",false);
    $("#cardevice_tab").data("flag",false);
    $("#alarmMainframe_tab").data("flag",false);
	showDeviceInfoManager(treeNode , '');

}

function areaTreeBeforeExpand(treeId, treeNode) {
	zTreeObj.setting.async.url = "/../IntegratedMM/getRulaArea.do";
}

var setting = {
	/*async : {
		enable : true,
		url : "/../IntegratedMM/getAreaList.do", // getAreaZtree ,getArea				getAreaZtree
		autoParam : [ "id" ],
		otherParam:{
			"userId":getZTreeUserID(),
			handleOnly: false,
		},
		dataFilter : filter
	},*/
	view : {
		showIcon : false,
		addDiyDom : myDiyDom
	},
	callback : {
		beforeExpand : areaTreeBeforeExpand,
		onClick : zTreeOnClick,
        onAsyncSuccess: zTreeOnAsyncSuccess
	},
	data : {
		simpleData : {
			enable : true,
			idKey : "id",
			pIdKey : "pId",
			rootPId : 0
		}
	}
};
function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
    //alert(msg);
	if(flag == 0){
		//$("#alarmMainframe_tab").click();
		var nodes = zTreeObj.getNodes();
		var firstNode = nodes[0];
        if(firstNode == "undefined"||firstNode == undefined){
            firstNode="";
        }
		//var node = zTreeObj.getNodeByParam("id", "DEFAULTDIR");
		zTreeObj.selectNode(firstNode);
		setting.callback.onClick('',firstNode.id,firstNode);
		flag = 1;
	}
}

function myDiyDom(treeId, treeNode) {
	var spaceWidth = 5;
	var switchObj = $("#" + treeNode.tId + "_switch"), icoObj = $("#"
			+ treeNode.tId + "_ico");
	switchObj.remove();
	icoObj.before(switchObj);
	if (treeNode.level > 0) {
		var spaceStr = "<span style='display: inline-block;width:"
				+ (spaceWidth * treeNode.level) + "px'></span>";
		switchObj.before(spaceStr);
	}
}

function filter(treeId, parentNode, childNodes) {
	if (!childNodes)
		return null;
	for (var i = 0, l = childNodes.length; i < l; i++) {
		childNodes[i].open = true;
		childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
	}
	return childNodes;
}
/**
 * 树点击事件结束
 */

/**
 * 获取用户信息加载树
 */

function getZTreeUserID() {
	var returnData = parent.getLoginUserName();
	var userId = returnData.userId;
	return userId;
}
function deleteList (){
    var choseNode=parent.getDeviceIframeTab();
	if(choseNode == "alarmMainframe_tab"){
		alarmMainframeIframe.deleteHostList();
	}else if(choseNode=="NVR_tab"){
		NVRIframe.deleteNVRList();
	}else if(choseNode=="NVRWired_tab"){
		NVRWiredIframe.deleteNVRWireList();
	}else if(choseNode=="AKey_tab"){
		AKeyIframe.deleteAKeyList();
	}
    else if(choseNode=="cardevice_tab"){
        cardeviceIframe.deleteCardeviceList();
    }
}

function deleDevCallback (){
	var id = $("#contentRight_search_input").val()
	showDeviceInfoManager(onClickNode,id);
}

function addlist(){
	showDeviceInfoManager(onClickNode);
}

function del(){

	papm = {
		text:'你确定要删除选中的设备吗?',
		deleList:"deleList"
	}

	parent.devicePopusManager('openPrompt',papm);
}

$(document).ready(function() {
	$("#add").click(function() {
		add()
	});
	$("#update").click(function() {
		update()
	});

	$("#close").click(function() {

		var platformId= parent.getMain();
		if(onClickNode!=null&&onClickNode.platformId!=platformId.platform_id) {
			parent.alertTip("不能删除非本平台数据！",0,null);
			return;
		}
        if (onClickNode == null)
            return;
        parent.comfireFloat("是否确认删除？",deleteArea,null)
	});

	$("#flash").click(function() {
		treeReload()
	});

	$("#contentRight_del").click(
		function(){
            deleteList();
		}
	);
	$("#alarmMainframe_tab").data("flag",false);
    $("#alarmMainframe_tab").bind("click",function(){
		if(!$("#alarmMainframe_tab").data("flag")) {
			parent.setDeviceIframeTab("alarmMainframe_tab");
			showDeviceInfoManager(onClickNode, '');
			$("#alarmMainframe_tab").data("flag",true);
		}
    });
	$("#NVR_tab").data("flag",false);
    $("#NVR_tab").bind("click",function(){
		if(!$("#NVR_tab").data("flag")) {
			parent.setDeviceIframeTab("NVR_tab");
			showDeviceInfoManager(onClickNode,'');
			$("#NVR_tab").data("flag",true);
		}
    });
    $("#AKey_tab").data("flag",false);
	$("#AKey_tab").bind("click",function(){
        if(!$("#AKey_tab").data("flag")) {
			parent.setDeviceIframeTab("AKey_tab");
			showDeviceInfoManager(onClickNode,'');
            $("#AKey_tab").data("flag",true);
        }
	});
    $("#NVRWired_tab").data("flag",false);
    $("#NVRWired_tab").bind("click",function(){
        if(!$("#NVRWired_tab").data("flag")) {
        	parent.setDeviceIframeTab("NVRWired_tab");
        	showDeviceInfoManager(onClickNode,'');
            $("#NVRWired_tab").data("flag",true);
        }
    });
    $("#cardevice_tab").data("flag",false);
    $("#cardevice_tab").bind("click",function(){
        if(!$("#cardevice_tab").data("flag")) {
        	parent.setDeviceIframeTab("cardevice_tab");
        	showDeviceInfoManager(onClickNode,'');
            $("#cardevice_tab").data("flag",true);
        }
    });

	var params={
		"userId":getZTreeUserID(),
		handleOnly: false,
	}
	var zNodes=post_sync(params,"/../IntegratedMM/getAreaList.do");
	zTreeObj = $.fn.zTree.init($("#treeDemo"), setting,zNodes);
	//模糊搜索
	$("#contentRight_search_img").click(
		function(){
			var id = $("#contentRight_search_input").val()
			showDeviceInfoManager(onClickNode,id);
			return;
		});
	//模糊搜索绑定回车
    $("#contentRight_search_input").keydown(function(event){
        if(event.keyCode == 13){ //绑定回车
            var id = $(this).val();
            showDeviceInfoManager(onClickNode,id);
        }
		return;
    });
});
function cancelCallback() {

}
function getonClickNode() {
	return onClickNode;
}