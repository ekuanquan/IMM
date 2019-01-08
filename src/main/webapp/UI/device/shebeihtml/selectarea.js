/**
 * Created by ywhl on 2017/6/5.
 */
var zTreeObj;
var length=0;

var _global = {
    zNodes:[],
};
function closeselectarea(){
    /*alert("1314")*/
    /*parent._closePopus();*/
    if(parent._closeFourPopus){
        parent._closeFourPopus();
    }
    if(parent.closeMapPopus){
        parent.closeMapPopus();
    }
    if(parent._closePopus){
        parent._closePopus();
    }

}
var curTreeNode=null;
function zTreeOnClick(event, treeId, treeNode){
    if(treeNode.half){
    }
    else{
        curTreeNode=treeNode;
    }
    /*debugger;*/
}
function areaTreeBeforeExpand(treeId, treeNode) {
	zTreeObj.setting.async.url = "/../IntegratedMM/getRulaArea.do";
}

var setting = {
    view: {
        showIcon: false
    },
    callback: {
        beforeClick: zTreeBeforeClick,
    	beforeExpand : areaTreeBeforeExpand,
        //onAsyncSuccess: onAsyncSuccess,
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
function zTreeBeforeClick(treeId, treeNode, clickFlag) {
    if(treeNode.half == true){
        return false;
    }else{
        return true;
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

function getZTreeUserID(){          //�õ���¼�û����

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
function onAsyncSuccess(event, treeId, treeNode, msg) {
    DynamicUpdateNodeCheck();
}
///动态设置zTree的所有节点有checkbox
function DynamicUpdateNodeCheck() {
    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
    for(var i=0;i<length;i++){
        var node = treeObj.getNodeByParam("id", _global.zNodes[i].id);
        if(node!=null) {
            if(node.half){
                //treeObj.checkNode(node,false,false);
                treeObj.setChkDisabled(node, true);
            }
        }
    }
}

$(document).ready(function(){

    var params={
        "userId":getZTreeUserID(),
        handleOnly: true,
        platformId: parent.parent.getMain().platform_id,
        //needDataNode:false,
    }
    /*var zNodes=post_sync(params,"/../IntegratedMM/getAreaList.do");
    length=zNodes.length;
    zTreeObj = $.fn.zTree.init($("#treeDemo"), setting,zNodes);*/
    post_async(params,"/../IntegratedMM/getAreaList.do",function (zNodes) {
        _global.zNodes=zNodes;
        zTreeObj = $.fn.zTree.init($("#treeDemo"), setting,zNodes);
        length=zNodes.length;
        //onAsyncSuccess();
    });
    $("#close,#cancel").click(function(){closeselectarea();});

    $("#sure").click(function(){
        if(curTreeNode)
       /* parent.getArea(curTreeNode.name);*/

            parent.getArea(curTreeNode);
            closeselectarea()
    });
});
