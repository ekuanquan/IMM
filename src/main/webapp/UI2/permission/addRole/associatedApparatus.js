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
	var _global = {
		top: parent.parent,
		devList: [],
		addDevList: [],
		delDevList: [],
        devId:""
	};

	function _init() {
		_initEvent();
	}
	//事件绑定函数
	function _initEvent() {
        checkRow();
		$(".tab_item").bind('click', function(event) {
			$(this).removeClass('tab_noChecked').addClass('tab_isChecked');
			$(this).siblings().removeClass('tab_isChecked').addClass('tab_noChecked');
			_switchTabItem($(this).attr('id'));
		});
		//添加按钮
		$("#contentRight_add").bind('click', function(event) {
			var row_json = '';
			parent.setAAERowJson(row_json);
			//console.log('addDevList:'+JSON.stringify(_global.addDevList));
			for (var i = 0;i<_global.addDevList.length;i++) {
				_global.devList.push(_global.addDevList[i]);
			}
			parent.open_associatedApparatusAdd();
		});
		$("#contentRight_del").bind('click', function(event) {
            //var $del = $('.row_isChecked', '#table_content');
            if($('#table_content .row_isChecked').length > 0){
                _global.top.comfireFloat("确认要删除设备" +_global.devId+"?",callbacksure,null);
			}
			else {
            	_global.top.alertWarn("请先选择你所要删除的项",null,null);
			}
		});
	}
	function callbacksure() {
        var $del = $('.row_isChecked', '#table_content');
        //alert($del.attr('id'));
        _addDelData($del.data('row_json'));
        $del.remove();
        checkRow();
    }
	
	function _clearAddDevList(){
		//console.log('devList:'+JSON.stringify(_global.devList));
		_global.addDevList = [];
		for (var i = 0;i<_global.devList.length;i++) {
				_global.addDevList.push(_global.devList[i]);
			}
		//console.log('addDevList:'+JSON.stringify(_global.addDevList));
	}


	function _getAddDevList() {
		//console.log('进入_getAddDevList');
		return _global.addDevList;
	}

	function _getDelDevList() {
		//console.log('进入_getDelDevList');
		return _global.delDevList;
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
		//console.log('index:' + index);
		addDve.splice(index, 1);
		_global.addDevList = addDve;
		//console.log(JSON.stringify(_global.addDevList));

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
		//console.log(JSON.stringify(_global.addDevList));
	}

	function _addDelData(data) {
		//console.log(JSON.stringify(data));
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
		//console.log('index:' + index);
		delData.splice(index, 1);
		_global.addDevList = delData;
		//console.log(JSON.stringify(_global.addDevList));
	}

	function _clearRow() {
		
		$('#table_content').empty();
	}

	function _addAddData() {
		_clearRow();
		var json = _global.addDevList;
		for(var i = 0; i < json.length; i++) {
			_addRow(json[i], i + 1);
		}
        checkRow();				//检测设备列表是否存在设备信息
	}

	function _addRow(row_json, isPre) {
		//console.log('---------_addRow-------' + JSON.stringify(row_json.devId));
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

			/*$div_row.bind('dblclick', function(e) {
				var $this = $(this);
				parent.open_associatedApparatusEdit();
				var rowjson = $this.data('row_json');
				//console.log(JSON.stringify(rowjson));
				parent.setAAERowJson(rowjson);
			});*/
			$div_row.bind('click', function(e) {
				var $this = $(this);
				//console.log($this.attr('id'));
				if($this.hasClass('row_isChecked')) {
					$this.removeClass('row_isChecked');
				} else {
					$this.addClass('row_isChecked');
					$this.siblings().removeClass('row_isChecked');
				}
				_global.devId = row_json.devId;
			});
		}

	}
	/***************************************************************
	判断关联设备列表是否存在设备信息2017年9月22日11:11:19
	***************************************************************/
	function checkRow() {
		if($("#table_content .row").length >0){
            if($("#contentRight_del").hasClass("noPoint")) {
                $("#contentRight_del").removeClass('noPoint');
            }
		}
		else {
			if(!$("#contentRight_del").hasClass("noPoint")){
                $("#contentRight_del").addClass('noPoint');
			}
		}
    }

})(window, jQuery, undefined);