/**
 * Created by ywhl on 2017/6/6.
 */
/*
 * function close(){ parent.closePopus(); }
 * 
 * $(document).ready(function(){ $(".close").click(function(){close()}); });
 */

$(document).ready(function() {
	alterdeviceinit();
});

;
(function(window, $) {
	window.alterdeviceinit = _init;
	window.showArea = _showArea;

	function _init() {
		readyForVal();
		$(".close,#cancel").click(function() {
			close()
		});

		$(".line .radio").click(function() {
			$('.checked').removeClass('checked');
			$(this).addClass('checked');
		});
		$("#areaname").click(function() {
			parent.devicePopusManager('selectArea')
		});

		$("#save").click(
				function() {
					if ($("#areaId").val() == $("#parentId").val()) {
						console.log("area and parent are the same");
						return;
					}
					var param_json = {
						areaId : $("#areaId").val(),
						areaName : $("#areaName").val(),
						parentAreaId : $("#parentId").val(),
						parents : $("#areaname").val(),
						fMemo : $("#fMemo").val(),
						areaType : $("#areaType").attr("areaType")
					};
					post_async(param_json, '/../IntegratedMM/updateArea.do',
							_callBack);

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
            parent.alertTip("修改成功！",2000,null);
			close();
		} else {
			console.log(data);
            parent.alertTip("修改失败！",2000,null);
		}
	}

	function readyForVal() {
		var param_json = {
			id : getUrlParam('id')
		};
		post_async(param_json, '/../IntegratedMM/getArea.do', _ValcallBack);
	}

	function _ValcallBack(data) {
		if (data.code == 1) {
			console.log(data.area);
			$("#areaId").val(data.area.areaId);
			$("#areaName").val(data.area.areaName);
			if (data.area.areaType == 1) {
				$("#areaType").val("目录");
				$("#areaType").attr("areaType", 1);
			} else {
				$("#areaType").val("区域");
				$("#areaType").attr("areaType", 0)
			}
			$("#areaname").val(data.area.parents);
			$("#parentId").val(data.area.parentAreaId);
			$("#fMemo").text(data.area.fMemo);
		} else {
			console.log(data);
		}
	}

	function getUrlParam(name) {
		// 构造一个含有目标参数的正则表达式对象
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		// 匹配目标参数
		var r = window.location.search.substr(1).match(reg);
		// 返回参数值
		if (r != null)
			return unescape(r[2]);
		return null;
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