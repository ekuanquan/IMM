/**
 * Created by ywhl on 2017/6/6.
 */
/*
 * function close(){ parent.closePopus(); }
 * 
 * $(document).ready(function(){ $(".close").click(function(){close()}); });
 */

$(document).ready(function() {
	$("#signupForm").Validform({
		tiptype:2,
		btnSubmitId:"save",
		callback:sure
	});
	alterdeviceinit();
});

;
(function(window, $) {
	window.alterdeviceinit = _init;
	window.showArea = _showArea;
	window.setGbId=_setGbId;
    window.sure = _sure;

	var _global = {
		main:null,
		platformId:"",
	}
	function _init() {
		readyForVal();
		$(".close,#cancel").click(function() {
			close()
		});

		$(".line .radio").click(function() {
			$('.checked').removeClass('checked');
			$(this).addClass('checked');
		});
		$("#parentsname").click(function() {
			parent.devicePopusManager('selectArea')
		});
		/*$("#gbId").click(function() {
			openGBPopus("../../resource/gbId/gbId.html",{width:360,height:208});
		});*/

		/*$("#save").click(
				function() {
					if ($("#areaId").val() == $("#parentId").val()) {
						console.log("area and parent are the same");
						return;
					}
					var param_json = {
						areaId : $("#areaId").val(),
						areaName : $("#areaName").val(),
						parentAreaId : $("#parentId").val(),
						gbId: $("#gbId").val(),
						//parents : $("#parentsname").val(),
						fMemo : $("#fMemo").val(),
						areaType : $("#areaType").attr("areaType"),
						platformId:_global.platformId,
					};
					post_async(param_json, '/../IntegratedMM/updateArea.do',
							_callBack);

				});*/

		_global.main=parent.getMain();
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
			
		} else if(data.code == 2){
			parent.alertTip(data.message,2000,null);
		}else{
			console.log(data);
            parent.alertTip("修改失败！",2000,null);
		}
	}
	function _clicksave() {
        if ($("#areaId").val() == $("#parentId").val()) {
            console.log("area and parent are the same");
            return;
        }
        var param_json = {
            areaId : $("#areaId").val(),
            areaName : $("#areaName").val(),
            parentAreaId : $("#parentId").val(),
            gbId: $("#gbId").val(),
            //parents : $("#parentsname").val(),
            fMemo : $("#fMemo").val(),
            areaType : $("#areaType").attr("areaType"),
            platformId:_global.platformId,
            oldAreaName:$("#areaName").data("oldAreaName"),
        };
        post_async(param_json, '/../IntegratedMM/updateArea.do',
            _callBack);
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
            $("#areaName").data("oldAreaName",data.area.areaName);
			if (data.area.areaType == 1) {
				$("#areaType").val("目录");
				$("#areaType").attr("areaType", 1);
			} else {
				$("#areaType").val("区域");
				$("#areaType").attr("areaType", 0)
			}
			$("#parentsname").val(data.area.parentAreaName);
			$("#parentId").val(data.area.parentAreaId);
			$("#gbId").val(data.area.gbId);
			$("#fMemo").text(data.area.fMemo);
			_global.platformId=data.area.platformId;
			$("#platform_name").val(data.area.platformName);
			if(_global.platformId!=_global.main.platform_id){
				$("#save").hide();
				$("#cancel").hide();
				$("#areaName").addClass("shower").attr("readonly","readonly");
				$("#parentsname").addClass("shower").attr("readonly","readonly");
			}
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
		$("#parentsname").val(areaNode.name);
		$("#parentId").val(areaNode.id);
        $("#parentsname").blur();
	}

	function _setGbId(gbId) {
		$("#gbId").val(gbId)
	}
    function _sure(flag) {
        if(flag){
            _clicksave();
        }else {
            parent.alertTip("请填写完整信息",2000,null);
        }
    }
})(window, jQuery);