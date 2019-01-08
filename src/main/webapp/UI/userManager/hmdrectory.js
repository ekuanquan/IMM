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
    onClickNode = null;
}

function add(){
    parent.devicePopusManager('addZone');
}
function update(){
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
        parent.alertTip("删除成功",2000,null);
    } else {
        console.log(data);
        parent.alertTip("删除失败",2000,null);
    }
}

/**
 * 树点击事件开始
 */
function zTreeOnClick(event, treeId, treeNode){
    onClickNode = treeNode;
    showUserInfoManager(treeNode);
}

function areaTreeBeforeExpand(treeId, treeNode) {
	zTreeObj.setting.async.url = "/../IntegratedMM/getRulaArea.do";
}

var setting = {
    /*async: {
        enable: true,
        url:"/../IntegratedMM/getAreaList.do",           //    /../IntegratedMM/getAreaZtree.do
        autoParam:["id"],
        otherParam:{"otherParam":getZTreeUserID(),
            handleOnly: false,
        },
        dataFilter: filter
    },*/
    view: {
        showIcon: false,
        addDiyDom : myDiyDom
    },
    callback: {
    	beforeExpand : areaTreeBeforeExpand,
        onClick: zTreeOnClick,
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
    if(flag == 0) {
        var nodes = zTreeObj.getNodes();
        var firstNode = nodes[0];
        if(firstNode == "undefined"||firstNode == undefined){
            firstNode="";
        }
        //var node = zTreeObj.getNodeByParam("id", "DEFAULTDIR");
        zTreeObj.selectNode(firstNode);
        setting.callback.onClick('',firstNode.id,firstNode);
        flag=1;
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
    if (!childNodes) return null;
    for (var i=0, l=childNodes.length; i<l; i++) {
    	childNodes[i].open = true;
        childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
    }
    return childNodes;
}
/**
 * 树点击事件结束
 */

function getZTreeUserID(){
    var returnData = parent.getLoginUserName();
    var userId = returnData.userId;
    return userId;
}

$(document).ready(function(){
    $("#add").click(function(){add()});
    $("#update").click(function(){update()});
    $("#flash").click(function(){treeReload()});
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
    var params={
        "userId":getZTreeUserID(),
        handleOnly: false,
    }
    var zNodes=post_sync(params,"/../IntegratedMM/getAreaList.do");
    zTreeObj = $.fn.zTree.init($("#treeDemo"), setting,zNodes);

});
