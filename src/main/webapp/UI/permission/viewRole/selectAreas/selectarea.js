/**
 * Created by ywhl on 2017/6/5.
 */
var zTreeObj;
var areaType="1";//获取区域类型：权限、处置

function areaTreeBeforeExpand(treeId, treeNode) {
    zTreeObj.setting.async.url = "/IntegratedMM/getRulaArea.do";
}

var setting = {
    view: {
        showIcon: false
    },
    callback: {
        beforeExpand : areaTreeBeforeExpand,
        beforeCheck: zTreeBeforeCheck,
    },
    check: {
        enable: true
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
function  zTreeBeforeCheck(treeId, treeNode) {
    if(areaType=="1"){
        return true;
    }
    else{
        var flag=true;
        if(treeNode.isParent){
            parentsunh(treeNode)
        }
        return flag;
    }
}
function parentsunh(treeNode) {
    var nodes = treeNode.children;
    for(var i=0;i<nodes.length;i++){
        if(nodes[i].chkDisabled == true){
            if(nodes[i].checked==false){
                treeNode.halfCheck=true;
            }
            else{
                treeNode.halfCheck=false;
            }
        }
        else{
            if(nodes[i].isParent>0){
                console.log("nodes[i].isParent")
                parentsunh(nodes[i])
            }
        }
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

function getZTreeUserID(){
    var returnData = null;
    if(parent.getUserId && typeof (parent.getUserId) == 'function' ){
        returnData =parent.getUserId();
    }
    if(parent.parent.getUserId && typeof (parent.parent.getUserId) == 'function' ){
        returnData = parent.parent.getUserId();
    }
    var userId = returnData.userId;
    return userId;
}
function onAsyncSuccess(event, treeId, treeNode, msg) {
    DynamicUpdateNodeCheck();
}


$(document).ready(function(){
    parent.parent._setTitle2("选择区域");
    var roleId="";//获取区域类型：权限、处置
    var handleOnly=false;
    var platformId="";
    if(parent.parent.bottomDivMap&&parent.parent.bottomDivMap.getAreas&&(typeof (parent.parent.bottomDivMap.getAreas)=='function')) {
        areaType=parent.parent.bottomDivMap.getAreas().areaType;
        roleId=parent.parent.bottomDivMap.getAreas().roleId;
        if(areaType=="2"){//处置区域才赋值
            handleOnly=true;
            platformId=parent.parent.getMain().platform_id;
        }
    }
    var params={
        "userId":getZTreeUserID(),
        handleOnly: handleOnly,
        roleId:roleId,
        platformId: platformId,
    }
    post_async(params,"/../IntegratedMM/getAreaList.do",function (zNodes) {
        _global.zNodes=zNodes;
        zTreeObj = $.fn.zTree.init($("#treeDemo"), setting,zNodes);
        onAsyncSuccess();
    });
    $("#close,#cancel").click(function(){
        parent.parent._closePopus2();
    });
});
var _global = {
    checkNodes:[],
    delcheckNodes:[],
    zNodes:[],
};


///动态设置zTree的所有节点有checkbox
function DynamicUpdateNodeCheck() {
    //var platformId="";
    if(parent.parent.bottomDivMap&&parent.parent.bottomDivMap.getAreas&&(typeof (parent.parent.bottomDivMap.getAreas)=='function')) {
        areaType=parent.parent.bottomDivMap.getAreas().areaType;
        //platformId=parent.parent.bottomDivMap.getAreas().platformId;
    }
    var areasId=[];
    if(parent.parent.bottomDivMap&&parent.parent.bottomDivMap.getAreasId&&(typeof (parent.parent.bottomDivMap.getAreasId)=='function'))
    {//勾选已经选择的
        areasId=parent.parent.bottomDivMap.getAreasId();
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        for(var i=0;i<areasId.length;i++){
            var node = treeObj.getNodeByParam("id", areasId[i]);
            if(node!=null) {
                treeObj.checkNode(node, true, true, null);
            }
        }
    }
    var checkNodes=_global.zNodes;
    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
    for(var i=0;i<checkNodes.length;i++){
        var node = treeObj.getNodeByParam("id", checkNodes[i].id);
        if(node!=null) {
            treeObj.setChkDisabled(node, true);
        }
    }
}
