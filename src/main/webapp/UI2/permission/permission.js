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
	//roleManagementIframe.setQueryRoleValue('');
	roleManagementIframe.search_queryRole();
}

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


;
(function(window, $) {
	window.clickNode = _clickNode;

	function _clickNode(id){
		var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
		var node = treeObj.getNodeByParam("id", id);
		treeObj.selectNode(node);
	}
})(window, jQuery);

$(document).ready(function() {

	$("#add").click(function() {
		add();
	});
	$("#update").click(function() {
		update();
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
	newNode = treeObj.addNodes(null, newNode);


});

$(window).load(function(){
	var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
	var node = treeObj.getNodeByParam("id", "0");
	treeObj.selectNode(node);

	setting.callback.onClick = zTreeOnClick('','0',node);
});
