$(document).ready(function() {
	init();
});;
(function(window, $, undefined) {
	window.init = _init;
	window.addAddData = _addAddData;
	window.getAddDevList = _getAddDevList;
	window.getDelDevList = _getDelDevList;
	window.setAddDevList = _setAddDevList;
	window.setDelDevList = _setDelDevList;
	window.clearAddDevList = _clearAddDevList;
	window.setdevInfo = _setdevInfo;
	window.setdevId =_setdevId;
	window.addRow = _addRow;
	var _config = {
		ajaxUrl: {
			getRoleDev: '/IntegratedMM/role/ctrlRoleDev.do',
            getOwnerCorrelateDevCtrlUrl:"/IntegratedMM/addDevice/getOwnerCorrelateDevCtrl.do"
		}
	};

	var _global = {
		top: parent.parent,
		devList: [],
		addDevList: [],
		delDevList: [],
        devId:'',
        hookUserEvtId:[],
		devIds:[],
        PopusName:"",
	};

	function _init() {
		_initEvent();
	}
	//事件绑定函数
	function _initEvent() {
		//判断是布防还是撤防窗口
		_global.PopusName = parent.setPopusName();
            _showRoleDev();
         //关闭窗口点击事件
        $("#title_close,#cancelButton").click(function () {
            parent.closeCusPopus();
        });
        //点击保存
        $("#confirmButton").click(function () {
        	if(_global.PopusName == "dispose"){
                parent.getdisposedevId(_global.devId);
			}else if(_global.PopusName == "disarm"){
                parent.getdisarmdevId(_global.devId);
			}
            parent.closeCusPopus();
        });


	}

	function _clearAddDevList() {
		_global.addDevList = [];
		for(var i = 0; i < _global.devList.length; i++) {
			_global.addDevList.push(_global.devList[i]);
		}
	}

	function _getAddDevList() {
		//console.log('进入_getAddDevList');
		return _global.addDevList;
	}

	function _getDelDevList() {
		return _global.delDevList;
	}



	function _setAddDevList(data) {
		var devId = data.devId == null ? '' : data.devId;
		var devName = data.devName == null ? '' : data.devName;
		var devTypeName = data.devTypeName == null ? '' : data.devTypeName;
		var devModelName = data.devModelName == null ? '' : data.devModelName;
		var areaName = data.areaName == null ? '' : data.areaName;
		var devState = data.devState == null ? '' : data.devState;
		var devData = _global.addDevList;
		var params = {};
		params.devId = devId;
		params.devName = devName;
		params.devTypeName = devTypeName;
		params.devModelName = devModelName;
		params.areaName = areaName;
		params.devState = devState;
		if(devData.length > 0) {

			for(var i = 0; i < devData.length; i++) {
				var oJsonDevId = devData[i].devId;
				if(devId == oJsonDevId) {
					break;
				}
				if(i == devData.length - 1) {
					devData.push(params);
				}
			}

		} else {
			devData.push(params);
		}
		_global.addDevList = devData;
	}


	function _addDelData(data) {
		//console.log(JSON.stringify(data));
		var delData = _global.hookUserEvtId;
		var index = null;
		for(var i = 0; i < delData.length; i++) {
			if(data.devId == delData[i].devId) {
				index = i;
				break;
			} else {
				index = -1;
			}
		}
		//console.log('index:' + index);
		delData.splice(index, 1);
		_global.hookUserEvtId = delData;
		//console.log(JSON.stringify(_global.addDevList));
	}

	function _addAddData() {
		_clearRow();
		var json = _global.addDevList;
		for(var i = 0; i < json.length; i++) {
			_addRow(json[i], i + 1);
		}
	}

	function _showRoleDev() {
		var ownerId = parent.setuserId();
		var params = {};
		params.ownerId = ownerId;
        post_async(params, _config.ajaxUrl.getOwnerCorrelateDevCtrlUrl, _callbackRoleDev);
	}

	function _callbackRoleDev(data) {
		var result = data.result;
		if(result.code == '200') {
			_clearRow();
			var json = data.json;
			for(var i = 0; i < json.length; i++) {
				if(json[i].devType == "1"){
                    _addRow(json[i]);
                    _setAddDevList(json[i]);
				}else {
					continue;
				}

			}
		} else {
			_clearRow();
		}
	}

	function _clearRow() {
		$('#table_content').empty();
	}

	function _setDelDevList(data) {
		var addDve = _global.addDevList;
		var index = null;
		for(var j = 0; j < addDve.length; j++) {
			var oJsonDevId = addDve[j].devId;
			if(data.devId == oJsonDevId) {
				index = j;
				break;
			} else {
				index = -1;
			}
		}
		addDve.splice(index, 1);
		_global.addDevList = addDve;
	}

	function _addRow(row_json, isPre) {
		var id = row_json.devId;
		if($('#' + id, "#table_content").length == 0) {
			$div_row = $("<div></div>");
			$div_devId = $("<div></div>");
            $div_noChecked = $("<div></div>");
            $span = $("<span></span>");
			$div_devName = $("<div></div>");
			$div_devType = $("<div></div>");
			$div_devModelId = $("<div></div>");
			$div_areaId = $("<div></div>");
			$div_devstuats = $("<div></div>");
            $div_devId.append($div_noChecked).append($span);
			$div_row
				.append($div_noChecked)
				.append($div_devId)
				.append($div_devName)
				.append($div_devType)
				.append($div_devModelId)
				.append($div_areaId)
				.append($div_devstuats)
				.addClass('row')
				.attr('id', row_json.devId);
            $div_noChecked.addClass("noChecked").attr('id', row_json.devId);;
            $div_devId.addClass('UserEvtId');
            $span.addClass('table_item_3').text(row_json.devId == null ? '' : row_json.devId).attr("title", row_json.devId == null ? '' : row_json.devId);
			$div_devName.addClass('table_item_4').text(row_json.devName == null ? '' : row_json.devName).attr("title", row_json.devName == null ? '' : row_json.devName);
			$div_devType.addClass('table_item_4').text(row_json.devTypeName == null ? '' : row_json.devTypeName).attr("title", row_json.devTypeName == null ? '' : row_json.devTypeName);
			$div_devModelId.addClass('table_item_4').text(row_json.devModelName == null ? '' : row_json.devModelName).attr("title", row_json.devModelName == null ? '' : row_json.devModelName);
			$div_areaId.addClass('table_item_4').text(row_json.areaName == null ? '' : row_json.areaName).attr("title", row_json.areaName == null ? '' : row_json.areaName);
			var devState = "";
			switch(devState) {
	    		case 0:
	    			devState = "离线";
	    			break;
	    		case 1:
	    			devState = "在线";
	    			break;
	    		case 2:
	    			devState = "未知";
	    			break;
	    		default:
	    			break;
	    	}
			$div_devstuats.addClass('table_item_5').text(devState == null ? '' : devState).attr("title", devState == null ? '' : devState);
			$div_row.appendTo($("#table_content")).data('row_json', row_json);

            $div_noChecked.bind('click', function(e) {
                var $this = $(this);
                //var ischeck = $this.hasClass('isChecked');
                if($(".isChecked").length>0) {
                    $(".isChecked").removeClass('isChecked').addClass('noChecked');
                }
				$this.removeClass('noChecked').addClass('isChecked');
                _global.devId = row_json.devId;
            });
		}
	}
	//传递选中的设备Id
	function _setdevId() {
		return _global.devId;
    }
	//传递关联设备数组数据
	function _setdevInfo() {
        _global.devIds = [];
        var all_row = $('.row', '#table_content');
        for(var i = 0; i < all_row.length; i++) {
            var $this = all_row[i];
            var UserEvtId = $this.id;
            _global.devIds.push(UserEvtId);
        }
        return _global.devIds;
    }

})(window, jQuery, undefined);