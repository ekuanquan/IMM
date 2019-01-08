$(document).ready(function() {
	init();
});;
(function(window, $, undefined) {
	window.init = _init;
	window.addAddData = _addAddData;
	//window.getDevList = _getDevList;
	window.getAddDevList = _getAddDevList;
	window.getDelDevList = _getDelDevList;
	window.setAddDevList = _setAddDevList;
	window.setDelDevList = _setDelDevList;
	window.clearAddDevList = _clearAddDevList;
	var _config = {
		ajaxUrl: {
			getRoleDev: '../../../role/ctrlRoleDev.do'
		}
	}

	var _global = {
		top: parent.parent,
		devList: [],
		addDevList: [],
		delDevList: []
	};

	function _init() {
		_initEvent();
		_showRoleDev();
	}
	//事件绑定函数
	function _initEvent() {
		$("#contentRight_add").bind('click', function(event) {
			var row_json = '';
			parent.setAAERowJson(row_json);
			console.log('addDevList:'+JSON.stringify(_global.addDevList));
			for (var i = 0;i<_global.addDevList.length;i++) {
				_global.devList.push(_global.addDevList[i]);
			}
			parent.open_associatedApparatusAdd();
		});
		$("#contentRight_del").bind('click', function(event) {
			var $del = $('.row_isChecked', '#table_content');
			//alert($del.attr('id'));
			_addDelData($del.data('row_json'));
			$del.remove();
		});

	}

	function _clearAddDevList() {
		console.log('devList:' + JSON.stringify(_global.devList));
		_global.addDevList = [];
		for(var i = 0; i < _global.devList.length; i++) {
			_global.addDevList.push(_global.devList[i]);
		}
		console.log('addDevList:' + JSON.stringify(_global.addDevList));
	}

	function _getAddDevList() {
		console.log('进入_getAddDevList');
		return _global.addDevList;
	}

	function _getDelDevList() {
		console.log('进入_getDelDevList');
		return _global.delDevList;
	}

	/*function _getDevList() {
		console.log('进入_getDevList');
		return _global.devList;
	}*/

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
		console.log(JSON.stringify(_global.addDevList));
	}

	/*function _addDevList(data) {
		var devId = data.devId == null ? '' : data.devId;
		var devName = data.devName == null ? '' : data.devName;
		var devTypeName = data.devTypeName == null ? '' : data.devTypeName;
		var devModelName = data.devModelName == null ? '' : data.devModelName;
		var areaName = data.areaName == null ? '' : data.areaName;
		var devState = data.devState == null ? '' : data.devState;
		var devData = _global.devList;
		var params = {};
		params.devId = devId;
		params.devName = devName;
		params.devTypeName = devTypeName;
		params.devModelName = devModelName;
		params.areaName = areaName;
		params.devState = devState;
		devData.push(params);
		_global.devList = devData;
	}*/

	function _addDelData(data) {
		console.log(JSON.stringify(data));
		var delData = _global.addDevList;
		var index = null;
		for(var i = 0; i < delData.length; i++) {
			if(data.devId == delData[i].devId) {
				index = i;
				break;
			} else {
				index = -1;
			}
		}
		console.log('index:' + index);
		delData.splice(index, 1);
		_global.addDevList = delData;
		console.log(JSON.stringify(_global.addDevList));
	}

	function _addAddData() {
		_clearRow();
		var json = _global.addDevList;
		for(var i = 0; i < json.length; i++) {
			_addRow(json[i], i + 1);
		}
	}

	function _showRoleDev() {
		/*var roleId = _global.top.getPopupsRowJson().roleId;
		var params = {};
		params.roleId = roleId;
		console.log('roleId' + roleId);*/
		var roleId =parent.parent.getRelatedEditRole().roleId;
		var params = {};
		params.roleId = roleId;
		post_async(params, _config.ajaxUrl.getRoleDev, callbackRoleDev);
	}

	function callbackRoleDev(data) {
		console.log('callbackRoleDev-------' + JSON.stringify(data.json));

		var result = data.result;

		if(result.code == '200') {
			_clearRow();
			var json = data.json;
			for(var i = 0; i < json.length; i++) {
				_addRow(json[i]);
				_setAddDevList(json[i]);
			}

		} else {
			_clearRow();
		}
	}

	function _clearRow() {
		/*var i = 1;

		$(".row").each(function() {

			var $this = $(this);
			setTimeout(function() {

				$this.remove();
			}, i * 1);
			i++;
		});*/
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
		console.log('index:' + index);
		addDve.splice(index, 1);
		_global.addDevList = addDve;
		console.log(JSON.stringify(_global.addDevList));

	}

	function _addRow(row_json, isPre) {
		console.log('---------editRole-------' + JSON.stringify(row_json));
		var id = row_json.devId;
		if($('#' + id, "#table_content").length == 0) {
			$div_row = $("<div></div>");
			$div_devId = $("<div></div>");
			$div_devName = $("<div></div>");
			$div_devType = $("<div></div>");
			$div_devModelId = $("<div></div>");
			$div_areaId = $("<div></div>");
			$div_devstuats = $("<div></div>");
			$div_row
				.append($div_devId)
				.append($div_devName)
				.append($div_devType)
				.append($div_devModelId)
				.append($div_areaId)
				.append($div_devstuats)
				.addClass('row')
				.attr('id', row_json.devId);
			$div_devId.addClass('table_item_4').text(row_json.devId == null ? '' : row_json.devId).attr("title", row_json.devId == null ? '' : row_json.devId);
			$div_devName.addClass('table_item_4').text(row_json.devName == null ? '' : row_json.devName).attr("title", row_json.devName == null ? '' : row_json.devName);
			$div_devType.addClass('table_item_4').text(row_json.devTypeName == null ? '' : row_json.devTypeName).attr("title", row_json.devTypeName == null ? '' : row_json.devTypeName);
			$div_devModelId.addClass('table_item_4').text(row_json.devModelName == null ? '' : row_json.devModelName).attr("title", row_json.devModelName == null ? '' : row_json.devModelName);
			$div_areaId.addClass('table_item_4').text(row_json.areaName == null ? '' : row_json.areaName).attr("title", row_json.areaName == null ? '' : row_json.areaName);
            var devState = "";
            if(row_json.devState == '1') {
                devState = "在线";
            } else if(row_json.devState == '2') {
                devState = "离线";
            }
			$div_devstuats.addClass('table_item_5').text(devState == null ? '' : devState).attr("title", devState == null ? '' : devState);
			$div_row.appendTo($("#table_content")).data('row_json', row_json);
			//_addDevList(row_json);

			$div_row.bind('dblclick', function(e) {
				/*var $this = $(this);
				parent.open_associatedApparatusEdit();
				var rowjson = $this.data('row_json');
				//console.log(JSON.stringify(rowjson));
				parent.setAAERowJson(rowjson);*/
				var open = parent.parent.$(".title_ischecked").attr('id');
				if(open == "title_content_device"){
					return;
				}
				parent.open_device(row_json);
			});
			$div_row.bind('click', function(e) {
				var $this = $(this);
				console.log($this.attr('id'));
				if($this.hasClass('row_isChecked')) {
					$this.removeClass('row_isChecked');
				} else {
					$this.addClass('row_isChecked');
					$this.siblings().removeClass('row_isChecked');
				}
			});
		}
	}


})(window, jQuery, undefined);