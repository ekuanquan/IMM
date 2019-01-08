/**
 * Created by ywhl on 2017/6/5.
 */
var zTreeObj;
var areaType="1";//获取区域类型：权限、处置

function areaTreeBeforeExpand(treeId, treeNode) {
    zTreeObj.setting.async.url = "/IntegratedMM/getRulaArea.do";
}

var setting = {
    /*async: {
        enable: true,
        url:"/IntegratedMM/getAreaList.do",
        autoParam:["id"],
        otherParam:{"otherParam":getZTreeUserID(),
            handleOnly: getAreaType(),
        },
        dataFilter: filter
    },*/
    view: {
        showIcon: false
    },
    callback: {
        beforeExpand : areaTreeBeforeExpand,
        onAsyncSuccess: onAsyncSuccess,
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
function getAreaType() {

    var areaType="1";//获取区域类型：权限、处置
    if(parent.parent.bottomDivMap&&parent.parent.bottomDivMap.getAreas&&(typeof (parent.parent.bottomDivMap.getAreas)=='function')) {
        areaType=parent.parent.bottomDivMap.getAreas();
    }
    else if(parent.parent.mainDivIframe399&&parent.parent.mainDivIframe399.getAreas&&(typeof (parent.parent.mainDivIframe399.getAreas)=='function'))
    {
        areaType=parent.parent.mainDivIframe399.getAreas();
    }
    if(areaType=="1"){//如果是权限，不处理
        return false;
    }
    else{
        return true;
    }
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
    else if(parent.parent.mainDivIframe399&&parent.parent.mainDivIframe399.getAreas&&(typeof (parent.parent.mainDivIframe399.getAreas)=='function'))
    {
        areaType=parent.parent.mainDivIframe399.getAreas().areaType;
        roleId = parent.parent.mainDivIframe399.getAreas().roleId;
        if(areaType=="2") {//处置区域才赋值
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
    var zNodes=post_sync(params,"/../IntegratedMM/getAreaList.do");
    _global.zNodes=zNodes;
    zTreeObj = $.fn.zTree.init($("#treeDemo"), setting,zNodes);
    onAsyncSuccess();
    $("#close,#cancel").click(function(){
        parent.parent._closePopus2();
    });

    $("#sure").click(function(){
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        var nodesList=zTree.getCheckedNodes(true);
        var halfnodesId=[];

        var nodesName="";
        var nodesId=[];
        for(var i=0;i<nodesList.length;i++){
            var halfCheck = nodesList[i].getCheckStatus();
            if(halfCheck.half == true){
                halfnodesId.push(nodesList[i].id);
            }else{
                nodesId.push(nodesList[i].id);
                nodesName+=nodesList[i].name+',';
            }
        }
        if(parent.parent.bottomDivMap&&parent.parent.bottomDivMap.setAreas&&(typeof (parent.parent.bottomDivMap.setAreas)=='function')) {
            parent.parent.bottomDivMap.setAreas(nodesId, nodesName, halfnodesId);
        }
        else if(parent.parent.mainDivIframe399&&parent.parent.mainDivIframe399.setAreas&&(typeof (parent.parent.mainDivIframe399.setAreas)=='function'))
        {
            parent.parent.mainDivIframe399.setAreas(nodesId, nodesName, halfnodesId);
        }
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
    else if(parent.parent.mainDivIframe399&&parent.parent.mainDivIframe399.getAreas&&(typeof (parent.parent.mainDivIframe399.getAreas)=='function'))
    {
        areaType=parent.parent.mainDivIframe399.getAreas().areaType;
        //platformId=parent.parent.mainDivIframe399.getAreas().platformId;
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
    else if(parent.parent.mainDivIframe399&&parent.parent.mainDivIframe399.getAreasId&&(typeof (parent.parent.mainDivIframe399.getAreasId)=='function'))
    {//勾选已经选择的
        areasId=parent.parent.mainDivIframe399.getAreasId();
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        for(var i=0;i<areasId.length;i++){
            var node = treeObj.getNodeByParam("id", areasId[i]);
            if(node!=null) {
                treeObj.checkNode(node, true, true, null);
            }
        }
    }
    if(areaType=="1"){//如果是权限，不处理
        return;
    }
    else {
        var roleId="";//获取区域类型：权限、处置
        if(parent.parent.bottomDivMap&&parent.parent.bottomDivMap.getAreas&&(typeof (parent.parent.bottomDivMap.getAreas)=='function')) {
                roleId=parent.parent.bottomDivMap.getAreas().roleId;
        }
        else if(parent.parent.mainDivIframe399&&parent.parent.mainDivIframe399.getAreas&&(typeof (parent.parent.mainDivIframe399.getAreas)=='function'))
        {
                roleId = parent.parent.mainDivIframe399.getAreas().roleId;
        }
        //查询已经被别的角色选择的节点
        var data=post_sync({roleId:roleId},"/IntegratedMM/roleArea/getAlreadyChooseHandleAreas.do");
        _global.checkNodes=data;
        var checkNodes=_global.checkNodes.areaIds;
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        for(var i=0;i<checkNodes.length;i++){
            var node = treeObj.getNodeByParam("id", checkNodes[i]);
            if(node!=null) {
                treeObj.setChkDisabled(node, true);
            }
        }
        /*var main=parent.getMain();
        for(var zi=0;zi<_global.zNodes.length;zi++){
            var znode = treeObj.getNodeByParam("id", _global.zNodes[zi].id);
            if(znode != null && znode.platformId != platformId) {
                treeObj.setChkDisabled(znode, true);
            }
            if(main.platform_id != platformId){
                treeObj.setChkDisabled(znode, true);
            }
        }*/
        /*for(var i=0;i<areasId.length;i++){
            var node = treeObj.getNodeByParam("id", areasId[i]);
            if(node!=null) {
                treeObj.setChkDisabled(node, false);
            }
        }*/
    }
}
