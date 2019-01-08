/**
 * Created by ywhl on 2017/6/5.
 */
var zTreeObj;

function areaTreeBeforeExpand(treeId, treeNode) {
    zTreeObj.setting.async.url = "/IntegratedMM/syscode/tree.do";
}

var setting = {
    async: {
        enable: true,
        url:"/IntegratedMM/syscode/tree.do",
        autoParam:["id"],
        otherParam:{"otherParam":getZTreeUserID()},
        dataFilter: filter
    },
    view: {
        showIcon: false
    },
    callback: {
        //beforeExpand : areaTreeBeforeExpand,
        onAsyncSuccess: onAsyncSuccess,
        //beforeCheck: zTreeBeforeCheck,
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

function filter(treeId, parentNode, childNodes) {
    if (!childNodes) return null;
    for (var i=0, l=childNodes.length; i<l; i++) {
    	childNodes[i].open = true;
        childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
    }
    return childNodes;
}

function getZTreeUserID(){
    var userId = "";
    return userId;
}
function onAsyncSuccess(event, treeId, treeNode, msg) {
    DynamicUpdateNodeCheck();
}

///动态设置zTree的所有节点有checkbox
function DynamicUpdateNodeCheck(data) {
    var selectSysCode=[];
    if(parent.parent.bottomDivMap&&parent.parent.bottomDivMap.getSysCode&&(typeof (parent.parent.bottomDivMap.getSysCode)=='function'))
    {
        selectSysCode=parent.parent.bottomDivMap.getSysCode();
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        for(var i=0;i<selectSysCode.length;i++){
            var node = treeObj.getNodeByParam("id", selectSysCode[i]);
            if(node!=null) {
                treeObj.checkNode(node, true, true, null);
            }
        }
        if(parent.parent.bottomDivMap.isView){
            //如果是查查看功能
            $("#sure").hide();//
            $("#cancel").css({'float':'right','margin-right': '70px',});
             post_async({"otherParam":getZTreeUserID()},"/IntegratedMM/syscode/tree.do",function (zNodes) {
                 //设置为全部可选
                 for(var i=0;i<zNodes.length;i++){
                     var node = treeObj.getNodeByParam("id", zNodes[i].id);
                     if(node!=null) {
                         treeObj.setChkDisabled(node, true);
                     }
                 }
            });
        }
    }
    else if(parent.parent.mainDivIframe399&&parent.parent.mainDivIframe399.getSysCode&&(typeof (parent.parent.mainDivIframe399.getSysCode)=='function'))
    {
        selectSysCode=parent.parent.mainDivIframe399.getSysCode();
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        for(var i=0;i<selectSysCode.length;i++){
            var node = treeObj.getNodeByParam("id", selectSysCode[i]);
            if(node!=null) {
                treeObj.checkNode(node, true, true, null);
            }
        }
    }
}

$(document).ready(function(){
    parent.parent._setTitle2("事件订阅配置");
	zTreeObj = $.fn.zTree.init($("#treeDemo"), setting);
    $("#close,#cancel").click(function(){
        parent.parent._closePopus2();
    });

    $("#sure").click(function(){
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        var nodesList=zTree.getCheckedNodes(true);
        var nodesName="";
        var nodesId=[];
        for(var i=0;i<nodesList.length;i++){
            if(nodesList[i].id.indexOf("ID") < 0){
                nodesId.push(nodesList[i].id);
                nodesName+=nodesList[i].name+',';
            }
        }
        if(parent.parent.bottomDivMap&&parent.parent.bottomDivMap.setSysCode&&(typeof (parent.parent.bottomDivMap.setSysCode)=='function')) {
            parent.parent.bottomDivMap.setSysCode(nodesId);
        }
        else if(parent.parent.mainDivIframe399&&parent.parent.mainDivIframe399.setSysCode&&(typeof (parent.parent.mainDivIframe399.setSysCode)=='function'))
        {
            parent.parent.mainDivIframe399.setSysCode(nodesId);
        }
        parent.parent._closePopus2();
    });
});