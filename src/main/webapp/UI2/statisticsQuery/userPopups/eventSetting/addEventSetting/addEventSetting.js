$(document).ready(function() {
	init();
});;
(function(window, $, undefined) {
	window.init = _init;

	var _config = {
		ajaxUrl: {
			getZoneByUserId: '/IntegratedMM/getZoneByUserId.do',
			GetCameraListByUid: '/IntegratedMM/GetCameraListByUid.do',
			getEventSettingList: '/IntegratedMM/eventSetting/getEventSettingList.do',
			addEventSetting: '/IntegratedMM/eventSetting/addEventSetting.do',
			
		},
		currZoonIdList: [],
		currUserMonitorIdList: [],
		addZoonIdList: [],
		addUserMonitorIdList: []
	}

	function _init() {
		_initEvent();
		_initData();
	}

	function _initData() {
		_getEventSettingList(); //事件配置
		showData();
	}

	function _initEvent() {
		
		$('#zoonVal_search').bind('click',function(e){
			
		});
		
		$('#passagewayVal_search').bind('click',function(e){
			
		});

		$('#zoonVal_flash').bind('click', function(e) {
			$('#zoonVal_input').val("");
			var rowJson = parent.getPopupsRowJson();
			var userId = rowJson.userId;
			showZoon(userId);
		});

		$('#passagewayVal_flash').bind('click', function(e) {
			$('#passagewayVal_input').val("");
			var rowJson = parent.getPopupsRowJson();
			var userId = rowJson.userId;
			showPassageway(userId); //通道
		});

		$('#save').bind('click', function(e) {
			_addEventSetting();
		});

		$('#cancel,#close').bind('click', function(e) {
			parent.closeMapPopus();
		});

		//给防区全选按钮绑定事件
		$('#allzoon').bind('click', function(e) {
			var $this = $(this);
			var check = $this.hasClass('row_isChecked');
			if(check) {
				$this.removeClass('row_isChecked').addClass('row_noChecked');
				$('.row_row > div', '#zoonVal_centen').removeClass('row_isChecked').removeClass('row_noChecked').addClass('row_noChecked');
				_config.addZoonIdList = [];
				console.log(JSON.stringify(_config.addZoonIdList));
			} else {
				$this.removeClass('row_noChecked').addClass('row_isChecked');
				$('.row_row > div', '#zoonVal_centen').removeClass('row_isChecked').removeClass('row_noChecked').addClass('row_isChecked');
				_config.addZoonIdList = [];
				var all_row = $('.row_row > div', '#zoonVal_centen');
				for(var i = 0; i < all_row.length; i++) {
					var $this = all_row[i];
					var zoonId = $this.id;
					_config.addZoonIdList.push(zoonId);
				}
				console.log(JSON.stringify(_config.addZoonIdList));
			}
		});

		//给tap绑定事件
		$('#zoon,#passageway').bind('click', function(e) {
			var $this = $(this);
			var check = $this.hasClass('tab_isChecked');
			if(check) {

			} else {
				$this.addClass('tab_isChecked').siblings().removeClass('tab_isChecked');
				$('#' + $this.attr('id') + 'Val').removeClass('displayNone').siblings().removeClass('displayNone').addClass('displayNone');
			}
		});
		//默认点击防区tap
		$('#zoon').click();

		//给启用联动按钮绑定事件
		$('#isVideo').bind('click', function(e) {
			var $this = $(this);
			var check = $this.hasClass('isChecked');
			if(check) {
				$this.removeClass('isChecked').addClass('noChecked');
			} else {
				$this.removeClass('noChecked').addClass('isChecked');
			}
		});

		//给通道全选按钮绑定事件
		$('#allpassageway').bind('click', function(e) {
			var $this = $(this);
			var check = $this.hasClass('row_isChecked');
			if(check) {
				$this.removeClass('row_isChecked').addClass('row_noChecked');
				$('.row_row > div', '#passagewayVal_centen').removeClass('row_isChecked').removeClass('row_noChecked').addClass('row_noChecked');
				_config.addUserMonitorIdList = [];
				console.log(JSON.stringify(_config.addUserMonitorIdList));
			} else {
				$this.removeClass('row_noChecked').addClass('row_isChecked');
				$('.row_row > div', '#passagewayVal_centen').removeClass('row_isChecked').removeClass('row_noChecked').addClass('row_isChecked');
				_config.addUserMonitorIdList = [];
				var all_row = $('.row_row > div', '#passagewayVal_centen');
				for(var i = 0; i < all_row.length; i++) {
					var $this = all_row[i];
					var zoonId = $this.id;
					_config.addUserMonitorIdList.push(zoonId);
				}
				console.log(JSON.stringify(_config.addUserMonitorIdList));
			}
		});

	}

	function _addEventSetting() {
		var rowJson = parent.getPopupsRowJson();
		var userId = rowJson.userId;
		var isVideo = '0';
		if($('#isVideo').hasClass('isChecked')) {
			isVideo = '1';
		}
		var param = {};
		param.userId = userId;
		param.isVideo = isVideo;
		param.addZoonIdList = _config.addZoonIdList;
		param.addUserMonitorIdList = _config.addUserMonitorIdList;
		console.log(JSON.stringify(param));
		post_async(param, _config.ajaxUrl.addEventSetting, _addEventSettingCallBcak);
	}

	function _addEventSettingCallBcak(data) {
		console.log(JSON.stringify(data));
		if(data.result.code == 200) {
			parent.mainDivIframe.eventSettingIframe.showEventSettingList("");
			setTimeout(function() {
				parent.closeMapPopus();
			}, 1000);
		}
	}

	function showData() {
		
		var rowJson = parent.getPopupsRowJson();
		var userId = rowJson.userId;
		$('#userId').val(userId);
		showZoon(userId); //防区
		showPassageway(userId); //通道
	}

	function showZoon(userId) {
		var param = {};
		param.userPojo = {};
		param.userPojo.userId = userId;
		post_async(param, _config.ajaxUrl.getZoneByUserId, showZoonCallBack);
	}

	function showZoonCallBack(data) {
		console.log(JSON.stringify(data));
		if(data.result.code == 0) {
			clearZoonList();
			var json = data.zonePojo;
			for(var i = 0; i < json.length; i++) {
				showZoonData(json[i]);
			}
		}
	}

	//显示一条在防区列表里
	function showZoonData(row_json) {
		var OLits = _config.currZoonIdList;
		var devZoneId = row_json.devZoneId;
		if(OLits.length > 0) {
			for(var i = 0; i < OLits.length; i++) {
				if(OLits[i] == devZoneId) {
					break;
				}
				if(i == OLits.length - 1) {
					var $row_row = $('<div></div>');
					var $row_Checked = $('<div></div>');
					var $span = $('<span></span>');

					$row_Checked.addClass('row_noChecked').attr('id', devZoneId).appendTo($row_row);
					$span.text(devZoneId).appendTo($row_row);
					$row_row.addClass('row_row').appendTo($('#zoonVal_centen'));

					$row_Checked.bind('click', function(e) {
						var $this = $(this);
						var check = $this.hasClass('row_isChecked');
						if(check) {
							if($('#allzoon').hasClass('row_isChecked')) {
								$('#allzoon').removeClass('row_isChecked').addClass('row_noChecked');
							}
							$this.removeClass('row_isChecked').addClass('row_noChecked');
							del_addZoonIdList($this.attr('id'));
						} else {
							$this.removeClass('row_noChecked').addClass('row_isChecked');
							add_addZoonIdList($this.attr('id'));
						}
					});

				}
			}

		} else {
			var $row_row = $('<div></div>');
			var $row_Checked = $('<div></div>');
			var $span = $('<span></span>');

			$row_Checked.addClass('row_noChecked').attr('id', devZoneId).appendTo($row_row);
			$span.text(devZoneId).appendTo($row_row);
			$row_row.addClass('row_row').appendTo($('#zoonVal_centen'));

			$row_Checked.bind('click', function(e) {
				var $this = $(this);
				var check = $this.hasClass('row_isChecked');
				if(check) {
					if($('#allzoon').hasClass('row_isChecked')) {
						$('#allzoon').removeClass('row_isChecked').addClass('row_noChecked');
					}
					$this.removeClass('row_isChecked').addClass('row_noChecked');
					del_addZoonIdList($this.attr('id'));
				} else {
					$this.removeClass('row_noChecked').addClass('row_isChecked');
					add_addZoonIdList($this.attr('id'));
				}
			});

		}
	}

	//在防区数组里添加
	function add_addZoonIdList(devZoneId) {
		var addData = _config.addZoonIdList;
		if(addData > 0) {
			for(var i = 0; i < addData.length; i++) {
				var oJsonDevZoneId = addData[i];
				if(devZoneId == oJsonDevZoneId) {
					break;
				}
				if(i == addData.length - 1) {
					addData.push(devZoneId);
				}
			}
		} else {
			addData.push(devZoneId);
		}
		_config.addZoonIdList = addData;
		console.log(JSON.stringify(_config.addZoonIdList));

	}
	//在防区数据里删除
	function del_addZoonIdList(devZoneId) {
		var addData = _config.addZoonIdList;
		var index = null;
		for(var j = 0; j < addData.length; j++) {
			var oJsonDevZoneId = addData[j];
			if(devZoneId == oJsonDevZoneId) {
				index = j;
				break;
			} else {
				index = -1;
			}
		}
		console.log('index:' + index);
		addData.splice(index, 1);
		_config.addZoonIdList = addData;
		console.log(JSON.stringify(_config.addZoonIdList));

	}

	//显示一条在通道列表里
	function showPassagewayData(row_json) {
		var OLits = _config.currUserMonitorIdList;
		var userMonitorId = row_json.userMonitorId;
		if(OLits.length > 0) {
			for(var i = 0; i < OLits.length; i++) {
				if(OLits[i] == userMonitorId) {
					break;
				}
				if(i == OLits.length - 1) {
					var $row_row = $('<div></div>');
					var $row_Checked = $('<div></div>');
					var $span = $('<span></span>');

					$row_Checked.addClass('row_noChecked').attr('id', userMonitorId).appendTo($row_row);
					$span.text(userMonitorId).appendTo($row_row);
					$row_row.addClass('row_row').appendTo($('#passagewayVal_centen'));

					$row_Checked.bind('click', function(e) {
						var $this = $(this);
						var check = $this.hasClass('row_isChecked');
						if(check) {
							if($('#allpassageway').hasClass('row_isChecked')) {
								$('#allpassageway').removeClass('row_isChecked').addClass('row_noChecked');
							}
							$this.removeClass('row_isChecked').addClass('row_noChecked');
							del_addUserMonitorIdList($this.attr('id'));
						} else {
							$this.removeClass('row_noChecked').addClass('row_isChecked');
							add_addUserMonitorIdList($this.attr('id'));
						}
					});
				}
			}
		} else {

			var $row_row = $('<div></div>');
			var $row_Checked = $('<div></div>');
			var $span = $('<span></span>');

			$row_Checked.addClass('row_noChecked').attr('id', userMonitorId).appendTo($row_row);
			$span.text(userMonitorId).appendTo($row_row);
			$row_row.addClass('row_row').appendTo($('#passagewayVal_centen'));

			$row_Checked.bind('click', function(e) {
				var $this = $(this);
				var check = $this.hasClass('row_isChecked');
				if(check) {
					if($('#allpassageway').hasClass('row_isChecked')) {
						$('#allpassageway').removeClass('row_isChecked').addClass('row_noChecked');
					}
					$this.removeClass('row_isChecked').addClass('row_noChecked');
					del_addUserMonitorIdList($this.attr('id'));
				} else {
					$this.removeClass('row_noChecked').addClass('row_isChecked');
					add_addUserMonitorIdList($this.attr('id'));
				}
			});

		}
	}

	//在通道数组里添加
	function add_addUserMonitorIdList(userMonitorId) {
		var addData = _config.addUserMonitorIdList;
		if(addData > 0) {
			for(var i = 0; i < addData.length; i++) {
				var oJsonUserMonitorId = addData[i];
				if(userMonitorId == oJsonUserMonitorId) {
					break;
				}
				if(i == addData.length - 1) {
					addData.push(userMonitorId);
				}
			}
		} else {
			addData.push(userMonitorId);
		}
		_config.addUserMonitorIdList = addData;
		console.log(JSON.stringify(_config.addUserMonitorIdList));

	}
	//在通道数据里删除
	function del_addUserMonitorIdList(userMonitorId) {
		var addData = _config.addUserMonitorIdList;
		var index = null;
		for(var j = 0; j < addData.length; j++) {
			var oJsonUserMonitorId = addData[j];
			if(userMonitorId == oJsonUserMonitorId) {
				index = j;
				break;
			} else {
				index = -1;
			}
		}
		console.log('index:' + index);
		addData.splice(index, 1);
		_config.addUserMonitorIdList = addData;
		console.log(JSON.stringify(_config.addUserMonitorIdList));

	}

	function clearZoonList() {
		$('#zoonVal_centen > .row_row').remove();
	}

	function clearPassagewayList() {
		$('#passagewayVal_centen > .row_row').remove();
	}

	function showPassageway(userId) {
		var param = {};
		param = {};
		param.userId = userId;
		post_async(param, _config.ajaxUrl.GetCameraListByUid, showPassagewayCallBack);
	}

	function showPassagewayCallBack(data) {
		console.log(JSON.stringify(data));
		if(data.code == 1000) {
			clearPassagewayList()
			var json = data.result;
			for(var i = 0; i < json.length; i++) {
				showPassagewayData(json[i]);
			}
		}
	}

	function _getEventSettingList() {
		var rowJson = parent.getPopupsRowJson();
		var userId = rowJson.userId;
		var param = {};
		param.userId = userId;
		post_async(param, _config.ajaxUrl.getEventSettingList, getEventSettingListCallBack);
	}

	function getEventSettingListCallBack(data) {
		console.log(JSON.stringify(data));
		if(data.result.code == 200) {
			var Ojson = data.json;
			//筛选出防区、通道编号
			for(var i = 0; i < Ojson.length; i++) {
				if(Ojson[i].ZoneCHFlag == 0) {
					_config.currZoonIdList.push(Ojson[i].ZoneCHValue);
				} else if(Ojson[i].ZoneCHFlag == 1) {
					_config.currUserMonitorIdList.push(Ojson[i].ZoneCHValue);
				}
			}

		}
	}

})(window, jQuery, undefined);