/**
 * Created by ywhl on 2017/6/5.
 */
var zTreeObj;

var curTreeNode=null;
function zTreeOnClick(event, treeId, treeNode){
    curTreeNode=treeNode;
}
function areaTreeBeforeExpand(treeId, treeNode) {
	zTreeObj.setting.async.url = "/IntegratedMM/getRulaArea.do";
}

var setting = {
    /*async: {
        enable: true,
        url:"/IntegratedMM/getAreaList.do",
        autoParam:["id"],
        otherParam:{"otherParam":getZTreeUserID(),
            handleOnly: false,
        },
        dataFilter: filter
    },*/
    view: {
        showIcon: false
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

function filter(treeId, parentNode, childNodes) {
    if (!childNodes) return null;
    for (var i=0, l=childNodes.length; i<l; i++) {
    	childNodes[i].open = true;
        childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
    }
    return childNodes;
}

function getZTreeUserID(){ 

    var returnData = null;
    if(parent.getLoginUserName && typeof (parent.getLoginUserName) == 'function' ){
        returnData =parent.getLoginUserName();
    }
    if(parent.parent.getLoginUserName && typeof (parent.parent.getLoginUserName) == 'function' ){
        returnData = parent.parent.getLoginUserName();
    }
    var userId = returnData.userId;
    return userId;
}


$(document).ready(function(){

    parent.parent._setTitle2("选择区域");
    var params={
        "userId":getZTreeUserID(),
        handleOnly: false,
    }
    var zNodes=post_sync(params,"/../IntegratedMM/getAreaList.do");
    zTreeObj = $.fn.zTree.init($("#treeDemo"), setting,zNodes);

    $("#close,#cancel").click(function(){
        parent.parent._closePopus2();
    });

    $("#sure").click(function(){
        if(curTreeNode) {
            if (parent.parent.getPopusName() == "selectArea1") {
                parent.parent.statisticsQuery.hostClientIframe.setAreaName(curTreeNode);
            }
            else if (parent.parent.getPopusName() == "selectArea2") {
                parent.parent.statisticsQuery.averageCustomerIframe.setAreaName(curTreeNode);
            }
            else if (parent.parent.getPopusName() == "selectArea3") {
                parent.parent.statisticsQuery.operatorIframe.setAreaName(curTreeNode);
            }else if(parent.parent.getPopusName() == "selectArea4"){
                parent.mainDivIframe.setAreaName(curTreeNode);
            }
        }
        parent.parent._closePopus2();
    });
});
