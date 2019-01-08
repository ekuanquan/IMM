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
	zTreeObj = $.fn.zTree.init($("#treeDemo"), setting);
	flag = 0;
}

function add() {
	parent.devicePopusManager('addZone');
}
function update() {
	parent.devicePopusManager('editZone',onClickNode);
}

function deleteArea() {
	if (onClickNode == null)
		return;
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
	showDeviceInfoManager(treeNode , '');
}

function areaTreeBeforeExpand(treeId, treeNode) {
	zTreeObj.setting.async.url = "/../IntegratedMM/getRulaArea.do";
}

var setting = {
	async : {
		enable : true,
		url : "/../IntegratedMM/getAreaList.do", // getAreaZtree ,getArea				getAreaZtree
		autoParam : [ "id" ],
		otherParam : {
			/*"otherParam" : getZTreeUserID()*/
		},
		dataFilter : filter
	},
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
		var node = zTreeObj.getNodeByParam("id", "DEFAULTDIR");
		zTreeObj.selectNode(node);
		setting.callback.onClick('','DEFAULTDIR',node);
		$("#alarmMainframe_tab").click();
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
	}
    else if(choseNode=="cardevice_tab"){
        cardeviceIframe.deleteCardeviceList();
    }
    var id = $("#contentRight_search_input").val()
	showDeviceInfoManager(onClickNode,id);
}

function addlist(){
	showDeviceInfoManager(onClickNode);
}

var showDeviceQueryjson;

/*function del() {
	var msg = "您真的确定要删除吗？\n\n请确认！";
	if (confirm(msg)==true){
		return true;
	}else{
		return false;
	}
}*/

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
        parent.comfireFloat("是否确认删除？",deleteArea,null)
	});

	$("#flash").click(function() {
		treeReload()
	});
	/*zTreeObj = $.fn.zTree.init($("#treeDemo"), setting);*/

	$("#contentRight_del").click(
		function(){
            //parent.comfireFloat("确认要删除设备",deleteList,cancelCallback)
            deleteList();
			//del();
		}
	);

	/*$("#alarmMainframe_tab").click(function(){choseNode = "alarmMainframe_tab";});
	$("#NVR_tab").click(function(){choseNode = "NVR_tab";});
	$("#NVRWired_tab").click(function(){choseNode = "NVRWired_tab";});
    $("#cardevice_tab").click(function(){choseNode = "cardevice_tab";});*/
    $("#alarmMainframe_tab").one("click",function(){
    	//choseNode = "alarmMainframe_tab";
    	parent.setDeviceIframeTab("alarmMainframe_tab");
        showDeviceInfoManager(onClickNode,'');
    });
    $("#NVR_tab").one("click",function(){
    	//choseNode = "NVR_tab";
        parent.setDeviceIframeTab("NVR_tab");
        showDeviceInfoManager(onClickNode,'');
    });
    $("#NVRWired_tab").one("click",function(){
    	//choseNode = "NVRWired_tab";
        parent.setDeviceIframeTab("NVRWired_tab");
        showDeviceInfoManager(onClickNode,'');
    });
    $("#cardevice_tab").one("click",function(){
    	//choseNode = "cardevice_tab";
        parent.setDeviceIframeTab("cardevice_tab");
        showDeviceInfoManager(onClickNode,'');
    });

	zTreeObj = $.fn.zTree.init($("#treeDemo"), setting);
	//模糊搜索
	$("#contentRight_search_img").click(
		function(){
			var id = $("#contentRight_search_input").val()
			showDeviceInfoManager(onClickNode,id);
		});
	//模糊搜索绑定回车
    $("#contentRight_search_input").keydown(function(event){
        if(event.keyCode == 13){ //绑定回车
            var id = $(this).val();
            showDeviceInfoManager(onClickNode,id);
        }
    });
});
function cancelCallback() {

}
function getonClickNode() {
	return onClickNode;
}
/*
$(window).load(function(){
    var node = zTreeObj.getNodeByParam("id", "DEFAULTDIR");
    zTreeObj.selectNode(node);
    setting.callback.onClick = zTreeOnClick('','DEFAULTDIR',node);
});*/
