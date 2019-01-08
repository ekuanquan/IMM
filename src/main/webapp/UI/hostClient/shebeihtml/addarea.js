/**
 * Created by ywhl on 2017/6/6.
 */
//默认areaType为目录
var areaType = 1;

$(document).ready(function() {
	adddeviceinit();
});

;
(function(window, $) {
	window.adddeviceinit = _init;
	window.showArea = _showArea;

	function _init() {
		$(".close,#cancel").click(function() {
			close()
		});

		$(".line .radio").click(function() {
			$('.checked').removeClass('checked');
			$(this).addClass('checked');
			
			areaType = $(this).attr("areaType");
			
		});

		$("#areaname").click(function() {
			parent.devicePopusManager('selectArea')
		});

		$("#save").click(function() {
			var param_json = {
				areaId : $("#areaId").val(),
				areaName : $("#areaName").val(),
				parentAreaId: $("#parentId").val(),
				parents: $("#areaname").val(),
				fMemo: $("#fMemo").val(),
				areaType: areaType
			};
			post_async(param_json, '/../IntegratedMM/saveArea.do', _callBack);

		});
	}

	function _callBack(data) {
		if (data.code == 1) {
            if(parent.userIframe.treeReload){
                parent.userIframe.treeReload();
            }
            if(parent.deviceIframe.treeReload){
                parent.deviceIframe.treeReload();
            }
            parent.alertTip(data.message,2000,null);
			close();

		} else {
			console.log(data);
            parent.alertTip(data.message,2000,null);
		}
	}
	// �رմ���
	function close() {
		parent.closePopus();
	}
	// ��ʾ�����ص�����
	function _showArea(areaNode) {
		$("#areaname").val(areaNode.name);
		$("#parentId").val(areaNode.id);
	}

})(window, jQuery);
