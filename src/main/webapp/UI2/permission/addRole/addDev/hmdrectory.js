/**
 * Created by ywhl on 2017/6/5.
 */
/**
 * 弹窗
 */
var zTreeObj;
var onClickNode;

function treeReload(){
	zTreeObj.destroy();
	zTreeObj = $.fn.zTree.init($("#treeDemo"), setting);
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
	//post_async(param_json, '/../IntegratedMM/deleteArea.do', _callBack);
}

function _callBack(data) {
	if (data.code == 1) {
		treeReload();
		onClickNode = null;
	} else {
		console.log(data);
	}
}

/**
 * 树点击事件开始
 */
function zTreeOnClick(event, treeId, treeNode) {
	//alarmMainframeIframe.showAlarmMainframe(treeNode.id);
	onClickNode = treeNode;
	$("#onClickNode").val(treeNode);
	// alert(treeNode.id);
	showDeviceInfoManager(treeNode,'');
}

function areaTreeBeforeExpand(treeId, treeNode) {
	zTreeObj.setting.async.url = "/IntegratedMM/getRulaArea.do";
}

var setting = {
	async : {
		enable : true,
		url : "/IntegratedMM/getAreaList.do", // getAreaZtree ,getArea
													// ,getAreaDefault
		autoParam : [ "id" ],
		otherParam : {
			"otherParam" : getZTreeUserID()
		}, // 000987654 ,030002350
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
    var node = zTreeObj.getNodeByParam("id", "DEFAULTDIR");
    zTreeObj.selectNode(node);
    setting.callback.onClick = zTreeOnClick('','DEFAULTDIR',node);
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
	var returnData = null;
    if(parent.getLoginUserName && typeof (parent.getLoginUserName) == 'function' ){
        returnData =parent.getLoginUserName();
    }
    if(parent.parent.parent.getLoginUserName && typeof (parent.parent.parent.getLoginUserName) == 'function' ){
        returnData = parent.parent.parent.getLoginUserName();
    }
    var userId = returnData.userId;
	return userId;
}

$(document).ready(function() {
	$("#add").click(function() {
		add()
	});
	$("#update").click(function() {
		update()
	});
	
	$("#close").click(function() {
		deleteArea()
	});

	$("#flash").click(function() {
		treeReload()
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

/*$(window).load(function(){
	var node = zTreeObj.getNodeByParam("id", "DEFAULTDIR");
	zTreeObj.selectNode(node);
	setting.callback.onClick = zTreeOnClick('','DEFAULTDIR',node);
});*/
