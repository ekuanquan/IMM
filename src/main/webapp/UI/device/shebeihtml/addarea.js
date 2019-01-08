/**
 * Created by ywhl on 2017/6/6.
 */
//默认areaType为目录
var areaType = 1;

$(document).ready(function() {
    $("#signupForm").Validform({
        tiptype:2,
        btnSubmitId:"save",
        callback:sure
    });
	adddeviceinit();
});

;
(function(window, $) {
	window.adddeviceinit = _init;
	window.showArea = _showArea;
	window.setGbId=_setGbId;
	window.sure = _sure;

	var _global = {
		main:null,
	}
	function _init() {
		$(".close,#cancel").click(function() {
			close()
		});
		var  areaIdVal = creatAreaIdVal();
		$('#areaId').val(areaIdVal);

		$(".line .radio").click(function() {
			$('.checked').removeClass('checked');
			$(this).addClass('checked');
			
			areaType = $(this).attr("areaType");
			
		});

		$("#parentsname").click(function() {
			parent.devicePopusManager('selectArea');
		});
		/*$("#gbId").click(function() {
			openGBPopus("../../resource/gbId/gbId.html",{width:360,height:208});
		});*/

		/*$("#save").click(function() {
			var param_json = {
				areaId : $("#areaId").val(),
				areaName : $("#areaName").val(),
				parentAreaId: $("#parentId").val(),
				gbId: $("#gbId").val(),
				//parents: $("#parentsname").val(),
				fMemo: $("#fMemo").val(),
				areaType: areaType,
				platformId:_global.main.platform_id,
			};
			post_async(param_json, '/../IntegratedMM/saveArea.do', _callBack);

		});*/
		_global.main=parent.getMain();
		$("#platform_name").val(_global.main.platform_name);
	}
	function _clicksave() {
        var param_json = {
            areaId : $("#areaId").val(),
            areaName : $("#areaName").val(),
            parentAreaId: $("#parentId").val(),
            gbId: $("#gbId").val(),
            //parents: $("#parentsname").val(),
            fMemo: $("#fMemo").val(),
            areaType: areaType,
            platformId:_global.main.platform_id,
        };
        post_async(param_json, '/../IntegratedMM/saveArea.do', _callBack);
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
		$("#parentsname").val(areaNode.name);
		$("#parentId").val(areaNode.id);
        $("#parentsname").blur();
	}


	function creatAreaIdVal(){
		var  time = nowDatetime();
		var  str =parseInt((Math.random()*9+1)*1000);
		//console.log(time);
		//console.log(str);
		var rstr = time+''+str;
		//console.log(rstr);
		return rstr;
	}

	function nowDatetime() {

		var date = new Date();
		var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
		var day = (date.getDate()) > 9 ? (date.getDate()) : "0" + (date.getDate());
		var hours = (date.getHours()) > 9 ? (date.getHours()) : "0" + (date.getHours());
		var minutes = (date.getMinutes()) > 9 ? (date.getMinutes()) : "0" + (date.getMinutes());
		var seconds = (date.getSeconds()) > 9 ? (date.getSeconds()) : "0" + (date.getSeconds());

		var dateString =
			date.getFullYear() +''+
			month +''+
			day +''+
			hours +''+
			minutes +''+
			seconds;

		return dateString;
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
