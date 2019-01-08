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
	window.setdevInfo = _setdevInfo;
	window.addRow = _addRow;
	var _config = {
		ajaxUrl: {
			getRoleDev: '/IntegratedMM/role/ctrlRoleDev.do',
            getOwnerCorrelateDevCtrlUrl:"/IntegratedMM/addDevice/getOwnerCorrelateDevCtrl.do"
		}
	}

	var _global = {
		top: parent.parent,
		devList: [],
		addDevList: [],
		delDevList: [],
        devId:'',
        hookUserEvtId:[],
		devIds:[],
        popupsName:"addOwnerUser"
	};

	function _init() {
		_initEvent();
		//_showRoleDev();
	}
	//事件绑定函数
	function _initEvent() {

        if (parent.getTopPopupsName && typeof (parent.getTopPopupsName) == 'function') {
            _global.popupsName = parent.getTopPopupsName();
        }
        if (_global.popupsName == 'alterOwnerUser') {
            _showRoleDev();
        }
		$("#contentRight_add").bind('click', function(event) {
            if (_global.popupsName == 'addOwnerUser') {
                parent.open_relaDevadd();
            } else if (_global.popupsName == 'alterOwnerUser') {
                parent.open_relaDevalter();
            }

		});
		//选择设备
        $("#title_select").bind("click", function () {
            if (_global.popupsName == 'addOwnerUser') {
                parent.open_associatedApparatusAdd();
            } else if (_global.popupsName == 'alterOwnerUser') {
                parent.open_chooseDev();
            }

        });
		$("#contentRight_del").bind('click', function(event) {
            var all_row = $('.row', '#table_content');
            for(var i = 0; i < all_row.length; i++) {
            	for(var j=0;j<_global.hookUserEvtId.length;j++){
            		if(all_row[i].id == _global.hookUserEvtId[j]){
                        all_row[i].remove();
					}
				}
            }
			//alert($del.attr('id'));
           //_addDelData($del.data('row_json'));
            //_addDelData(_global.hookUserEvtId);

            /*if($('#table_content .row_isChecked').length > 0){
                _global.top.comfireFloat("确认要删除设备"+_global.devId+"?",callbacksure,null);
            }
            else {
                _global.top.alertWarn("请先选择你所要删除的项",null,null);
            }*/
		});
		//选择设备
        $('#allCheck').bind('click', function(e) {
            var $this = $(this);
            var check = $this.hasClass('isChecked');
            if(check) {
                $this.removeClass('isChecked').addClass('noChecked');
                $('.isChecked').removeClass('isChecked').removeClass('noChecked').addClass('noChecked');
                _global.hookUserEvtId = [];
                console.log(JSON.stringify(_global.hookUserEvtId));
            } else {
                $this.removeClass('noChecked').addClass('isChecked');
                $('.noChecked').removeClass('isChecked').removeClass('noChecked').addClass('isChecked');
                _global.hookUserEvtId = [];
                var all_row = $('.row', '#table_content');
                for(var i = 0; i < all_row.length; i++) {
                    var $this = all_row[i];
                    var UserEvtId = $this.id;
                    _global.hookUserEvtId.push(UserEvtId);
                }
                console.log(JSON.stringify(_global.hookUserEvtId));
            }
        });

	}

    /*function callbacksure() {
        var $del = $('.isChecked', '#table_content');
        //alert($del.attr('id'));
        /!*_addDelData($del.data('row_json'));*!/
        _addDelData($del.data('row_json'));
        $del.remove();
        checkRow();
    }*/

	function _clearAddDevList() {
		//console.log('devList:' + JSON.stringify(_global.devList));
		_global.addDevList = [];
		for(var i = 0; i < _global.devList.length; i++) {
			_global.addDevList.push(_global.devList[i]);
		}
		//console.log('addDevList:' + JSON.stringify(_global.addDevList));
	}

	function _getAddDevList() {
		//console.log('进入_getAddDevList');
		return _global.addDevList;
	}

	function _getDelDevList() {
		//console.log('进入_getDelDevList');
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
		//console.log(JSON.stringify(_global.addDevList));
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
		//var roleId = _global.top.getPopupsRowJson().roleId;
		var ownerId = _global.top.getPopupsRowJson().userId;

		var params = {};
		params.ownerId = ownerId;
		//console.log('roleId' + roleId);
		//post_async(params, _config.ajaxUrl.getRoleDev, callbackRoleDev);
        post_async(params, _config.ajaxUrl.getOwnerCorrelateDevCtrlUrl, _callbackRoleDev);
	}

	function _callbackRoleDev(data) {
		//console.log('callbackRoleDev-------' + JSON.stringify(data.json));

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
		//console.log('index:' + index);
		addDve.splice(index, 1);
		_global.addDevList = addDve;
		//console.log(JSON.stringify(_global.addDevList));

	}

	function _addRow(row_json, isPre) {
		//console.log('---------editRole-------' + JSON.stringify(row_json));
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
			//_addDevList(row_json);

			/*$div_row.bind('dblclick', function(e) {
				/!*var $this = $(this);
				parent.open_associatedApparatusEdit();
				var rowjson = $this.data('row_json');
				//console.log(JSON.stringify(rowjson));
				parent.setAAERowJson(rowjson);*!/
				parent.open_device(row_json);
			});*/
			/*$div_row.bind('click', function(e) {
				var $this = $(this);
				//console.log($this.attr('id'));
				if($this.hasClass('row_isChecked')) {
					$this.removeClass('row_isChecked');
				} else {
					$this.addClass('row_isChecked');
					$this.siblings().removeClass('row_isChecked');
				}
				_global.devId = row_json.devId;
			});*/
            $div_noChecked.bind('click', function(e) {
                var $this = $(this);
                var check = $this.hasClass('isChecked');
                if(check) {
                    if($('#allCheck').hasClass('isChecked')) {
                        $('#allCheck').removeClass('isChecked').addClass('noChecked');
                    }
                    $this.removeClass('isChecked').addClass('noChecked');
                    //del_hookUserEvtId($this.parent().parent().attr('id'));
                } else {
                    $this.removeClass('noChecked').addClass('isChecked');
                    //add_hookUserEvtId($this.parent().parent().attr('id'));
                    var all_row = $('.row', '#table_content');
                    var all_isChecked = $('.isChecked', '#table_content');
                    if(all_row.length == all_isChecked.length){
                        $('#allCheck').removeClass('noChecked').addClass('isChecked');
					}
                }
                _global.hookUserEvtId = [];
                $(".isChecked").each(function(a,b){
                    _global.hookUserEvtId.push($(this).attr("id"));
                });
                console.log(JSON.stringify(_global.hookUserEvtId));
            });
		}
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
   /* //添加设备
    function _open_relaDevadd() {
        _openPopups($('body'), "owner/relaDev/relaDev.html", {
            width: 300,
            height: 200
        });
    }*/

})(window, jQuery, undefined);