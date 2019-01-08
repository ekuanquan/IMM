$(document).ready(function() {
	init();
});;
(function(window, $, undefined) {
	window.init = _init;

	var _config = {
		ajaxUrl: {
			getZoneByUserId: '/IntegratedMM/getZoneByOwnerId.do',
			GetCameraListByUid: '/IntegratedMM/GetCameraListByUid.do',
			getEventSettingList: '/IntegratedMM/eventSetting/getEventSettingList.do',
			addEventSetting: '/IntegratedMM/eventSetting/addEventSetting.do'
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
	}

	function _initEvent() {
		
		$('#zoonVal_search').bind('click',function(e){
			
		});
		
		$('#passagewayVal_search').bind('click',function(e){
			
		});

		$('#zoonVal_flash').bind('click', function(e) {
			$('#zoonVal_input').val("");
			var rowJson = parent.getPopupsRowJson();
			var ownerId = rowJson.ownerId;
			showZoon(ownerId);
		});

		$('#passagewayVal_flash').bind('click', function(e) {
			$('#passagewayVal_input').val("");
			var rowJson = parent.getPopupsRowJson();
			var ownerId = rowJson.userId;
			showPassageway(ownerId); //通道
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
					var  param = {};
					param.roleZoneName = zoonId;
					param.UserEvtId = TimeToStrSix();
					_config.addZoonIdList.push(param);
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
					var userMonitorId = $this.id;
					var  param = {};
					param.userMonitorId = userMonitorId;
					param.UserEvtId = TimeToStrSix();
					_config.addUserMonitorIdList.push(param);
				}
				console.log(JSON.stringify(_config.addUserMonitorIdList));
			}
		});

	}

	function _addEventSetting() {
		var rowJson = parent.getPopupsRowJson();
		var ownerId = rowJson.userId;
		var isVideo = '0';
		if($('#isVideo').hasClass('isChecked')) {
			isVideo = '1';
		}
		var param = {};
		param.ownerId = ownerId;
		param.isVideo = isVideo;
		param.addZoonIdList = _config.addZoonIdList;
		param.addUserMonitorIdList = _config.addUserMonitorIdList;
		console.log(JSON.stringify(param));
		if(_config.addZoonIdList == "" && _config.addUserMonitorIdList == ""){
            parent.parent.alertWarn("请选择防区/通道",2000,null);
		}
		else {
            post_async(param, _config.ajaxUrl.addEventSetting, _addEventSettingCallBcak);
		}

	}

	function _addEventSettingCallBcak(data) {
		console.log(JSON.stringify(data));
		if(data.result.code == 200) {
			parent.mainDivIframe.eventSettingIframe.showEventSettingList("");
            parent.parent.alertSuccess("事件配置成功。",2000,null);
			parent.closeMapPopus();
		}
	}

	function showData() {
		var rowJson = parent.getPopupsRowJson();
		var ownerId = rowJson.userId;
		$('#ownerId').val(ownerId);
		showZoon(ownerId); //防区
		showPassageway(ownerId); //通道
	}

	function showZoon(ownerId) {
		var param = {};
		param.userPojo = {};
		param.userPojo.ownerId = ownerId;
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
		var ownerZoneName = row_json.ownerZoneName;
		if(OLits.length > 0) {
			for(var i = 0; i < OLits.length; i++) {
				if(OLits[i] == ownerZoneName) {
					break;
				}
				if(i == OLits.length - 1) {
					var $row_row = $('<div></div>');
					var $row_Checked = $('<div></div>');
					var $span = $('<span></span>');

					$row_Checked.addClass('row_noChecked').attr('id', ownerZoneName).appendTo($row_row);
					$span.text(ownerZoneName).appendTo($row_row);
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
                            var row_check = $('#zoonVal_centen .row_row');
                            var isChecked = $('#zoonVal_centen .row_isChecked');
                            console.log("row_check:"+row_check.length+" isChecked:"+isChecked.length);
							if(row_check.length == isChecked.length){
                                $('#allzoon').removeClass('row_noChecked').addClass('row_isChecked');
							}
							add_addZoonIdList($this.attr('id'));
						}
					});

				}
			}

		} else {
			var $row_row = $('<div></div>');
			var $row_Checked = $('<div></div>');
			var $span = $('<span></span>');

			$row_Checked.addClass('row_noChecked').attr('id', ownerZoneName).appendTo($row_row);
			$span.text(ownerZoneName).appendTo($row_row);
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
                    var row_check = $('#zoonVal_centen .row_row');
                    var isChecked = $('#zoonVal_centen .row_isChecked');
                    console.log("row_check:"+row_check.length+" isChecked:"+isChecked.length);
                    if(row_check.length == isChecked.length){
                        $('#allzoon').removeClass('row_noChecked').addClass('row_isChecked');
                    }
					add_addZoonIdList($this.attr('id'));
				}
			});

		}
	}

	//在防区数组里添加
	function add_addZoonIdList(roleZoneName) {
		var addData = _config.addZoonIdList;
		if(addData > 0) {
			for(var i = 0; i < addData.length; i++) {
				var oJsonroleZoneName = addData[i].roleZoneName;
				if(roleZoneName == oJsonroleZoneName) {
					break;
				}
				if(i == addData.length - 1) {
					var param = {};
					param.roleZoneName = roleZoneName;
					param.UserEvtId = TimeToStrSix();
					addData.push(param);
				}
			}
		} else {
			var param = {};
			param.roleZoneName = roleZoneName;
			param.UserEvtId = TimeToStrSix();
			addData.push(param);
		}
		_config.addZoonIdList = addData;
		console.log(JSON.stringify(_config.addZoonIdList));

	}
	//在防区数据里删除
	function del_addZoonIdList(roleZoneName) {
		var addData = _config.addZoonIdList;
		var index = null;
		for(var j = 0; j < addData.length; j++) {
			var oJsonroleZoneName = addData[j].roleZoneName;
			if(roleZoneName == oJsonroleZoneName) {
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
		var ownerMonitorId = row_json.ownerMonitorId;
		if(OLits.length > 0) {
			for(var i = 0; i < OLits.length; i++) {
				if(OLits[i] == ownerMonitorId) {
					break;
				}
				if(i == OLits.length - 1) {
					var $row_row = $('<div></div>');
					var $row_Checked = $('<div></div>');
					var $span = $('<span></span>');

					$row_Checked.addClass('row_noChecked').attr('id', ownerMonitorId).appendTo($row_row);
					$span.text(ownerMonitorId).appendTo($row_row);
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
                            var row_row = $('#passagewayVal_centen .row_row');
                            var isCheck = $('#passagewayVal_centen .row_isChecked');
                            console.log("row_row:"+row_row.length+" isCheck:"+isCheck.length);
                            if(row_row.length == isCheck.length){
                                $('#allpassageway').removeClass('row_noChecked').addClass('row_isChecked');
                            }
							add_addUserMonitorIdList($this.attr('id'));
						}
					});
				}
			}
		} else {

			var $row_row = $('<div></div>');
			var $row_Checked = $('<div></div>');
			var $span = $('<span></span>');

			$row_Checked.addClass('row_noChecked').attr('id', ownerMonitorId).appendTo($row_row);
			$span.text(ownerMonitorId).appendTo($row_row);
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
                    var row_row = $('#passagewayVal_centen .row_row');
                    var isCheck = $('#passagewayVal_centen .row_isChecked');
                    console.log("row_row:"+row_row.length+" isCheck:"+isCheck.length);
                    if(row_row.length == isCheck.length){
                        $('#allpassageway').removeClass('row_noChecked').addClass('row_isChecked');
                    }
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
				var oJsonUserMonitorId = addData[i].userMonitorId;
				if(userMonitorId == oJsonUserMonitorId) {
					break;
				}
				if(i == addData.length - 1) {
					var  param = {};
					param.userMonitorId = userMonitorId;
					param.UserEvtId = TimeToStrSix();
					addData.push(param);
				}
			}
		} else {
			var  param = {};
			param.userMonitorId = userMonitorId;
			param.UserEvtId = TimeToStrSix();
			addData.push(param);
		}
		_config.addUserMonitorIdList = addData;
		console.log(JSON.stringify(_config.addUserMonitorIdList));

	}
	//在通道数据里删除
	function del_addUserMonitorIdList(userMonitorId) {
		var addData = _config.addUserMonitorIdList;
		var index = null;
		for(var j = 0; j < addData.length; j++) {
			var oJsonUserMonitorId = addData[j].userMonitorId;
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

	function TimeToStrSix(){
		var  time = nowDatetime();
		var  str =parseInt((Math.random()*9+1)*1000000);
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

	function clearZoonList() {
		$('#zoonVal_centen > .row_row').remove();
	}

	function clearPassagewayList() {
		$('#passagewayVal_centen > .row_row').remove();
	}

	function showPassageway(ownerId) {
		var param = {};
		param.ownerId = ownerId;
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
		var ownerId = rowJson.userId;
		var param = {};
		param.ZoneCHFlag='';
		param.userId = ownerId;
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
			showData();
		}
	}

})(window, jQuery, undefined);