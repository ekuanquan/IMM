/**
 * Created by ywhl on 2017/6/5.
 */
/**
 * 弹窗
 */
function add() {
	parent.devicePopusManager('addZone');
}

function update() {
	parent.devicePopusManager('editZone');
}

/**
 * 树点击事件开始
 */
function zTreeOnClick(event, treeId, treeNode) {
	//customerIframe.showCustomerinframe(treeNode.id);
	roleManagementIframe.setRoleType(treeNode.id);
	/*roleManagementIframe.getRole();*/
}
var _config={

};
var _global={
    Iframesrc:""
};
var setting = {
	/*async: {
	    enable: true,
	    url:"/../IntegratedMM/getAreaDefault.do",
	    autoParam:["id"],
	    otherParam:{"otherParam":"zTreeAsyncTest"},
	    dataFilter: filter
	},*/

	view: {
		showIcon: false
	},
	callback: {
		onClick: zTreeOnClick
	}
};


function filter(treeId, parentNode, childNodes) {
	if(!childNodes) return null;
	for(var i = 0, l = childNodes.length; i < l; i++) {
		childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
	}
	return childNodes;
}
/**
 * 树点击事件结束
 */

$(document).ready(function() {
	$("#add").click(function() {
		add()
	});
	$("#update").click(function() {
		update()
	});

	$.fn.zTree.init($("#treeDemo"), setting);
	var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
	var newNode = [{
		id: '0',
		/*parentId: 'DEFAULTDIR',*/
		name: '客户',
		isParent: false
	}, {
		id: '1',
		/*parentId: 'DEFAULTDIR',*/
		name: '操作员',
		isParent: false
	}];
	/*newNode = treeObj.addNodes(null, newNode);*/
});
/***************************************
 点击之后背景颜色改变222
 ******************************************/
$("#system_Configure li").click(function () {
        var i=$("#system_Configure li").index($(this));
        var $ActiveTabs = $('.checked');
        if($ActiveTabs.length>0){
            $("#system_Configure li").removeClass('checked');
        }
        $("#system_Configure li").eq(i).addClass('checked');
});

/***************************************
 点击事件222
 ******************************************/
$("#system_Configure li").click(function () {
	var cliId = "#" + this.type + "Iframe"
    iframeManager(cliId);
});

/***************************************
 默认点击222
 ******************************************/
$("#systemCode").click();
/***************************************
 页面显示选择222
 ******************************************/
function iframeManager(iframeName) {
    $("#contentRight iframe").addClass("framecls").removeClass("framecls2");
    $(iframeName).removeClass("framecls").addClass("framecls2");
    switch (iframeName) {
        case '#systemCodeIframe':
            _global.Iframesrc = "./systemCode/systemCode.html";
            break;
        case '#infoLibraryIframe':
            _global.Iframesrc = "#";
            break;
        case '#codingSchemeIframe':
            _global.Iframesrc = "#";
            break;
        case '#equipmentTypeIframe':
            _global.Iframesrc = "./EquipmentType/EquipmentType.html";
            break;
        case '#probeTypeIframe':
            _global.Iframesrc = "./detectorType/detectorType.html";
            break;
        case '#regionalManagementIframe':
            _global.Iframesrc = "";
            break;
        case '#departmentManagementIframe':
            _global.Iframesrc = "#";
            break;
        case '#eventForwardingIframe':
            _global.Iframesrc = "./eventForward/eventForward.html";
            break;
        case '#eventLinkageIframe':
            _global.Iframesrc = "./eventLinkage/eventLinkage.html";
            break;
        case '#storageServiceIframe':
            _global.Iframesrc = "./storeService/storeService.html";
            break;
        default:
            // statements_def
            break;
    }
    if($(iframeName).attr('src') == ""){
        $(iframeName).attr('src', _global.Iframesrc);
    }
}

