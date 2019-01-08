/**
 * Created by ywhl on 2017/6/5.
 */
/**
 * 弹窗
 */
var zTreeObj;

function add(){
    parent.devicePopusManager('addZone');
}
function update(){
    parent.devicePopusManager('editZone');
}

/**
 * 树点击事件开始
 */
function zTreeOnClick(event, treeId, treeNode){
    showUserInfoManager(treeNode);
    //customerIframe.showCustomerinframe(treeNode.id);
}

function areaTreeBeforeExpand(treeId, treeNode) {
	zTreeObj.setting.async.url = "/../IntegratedMM/getRulaArea.do";
}

var setting = {
   /* async: {
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
        onClick: zTreeOnClick
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

    var params={
        "userId":getZTreeUserID(),
        handleOnly: false,
    }
    var zNodes=post_sync(params,"/../IntegratedMM/getAreaList.do");
    zTreeObj = $.fn.zTree.init($("#treeDemo"), setting,zNodes);
});

