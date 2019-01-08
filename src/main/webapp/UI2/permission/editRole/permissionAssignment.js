$(document).ready(function() {
	init();
});;
(function(window, $, undefined) {
	window.init = _init;
	window.getProcessingList = _getProcessingList;
	window.setXLWJforwarding = _setTransmitSetRole;
	var _global = {
		top: parent.parent,
		XLWJisForwarding: '', //用来判断该角色是否存在雪亮万家转发权限
		addProcessingList: [],
		delProcessingList: []
	};
	var _config = {
		ajaxUrl: {
			getlRolePermission: '/IntegratedMM/role/getlRolePermission.do',
			transmitList: '/IntegratedMM/role/transmitList.do',
			transmitSetRole: '/IntegratedMM/role/transmitSetRole.do',
			transmitGetRole: '/IntegratedMM/role/transmitGetRole.do',
			transmitDeleteRole: '/IntegratedMM/role/transmitDeleteRole.do'
		}
	}

	function _init() {
		_initData();
		_initEvent();
		_showRolePermission();
	}

	function _initData() {
		XLWJinitData();
	}

	function XLWJinitData() {
		transmitList();
		transmitGetRole();
	}

	function transmitGetRole() {
		var roleId = _global.top.getPopupsRowJson().roleId;
		var params = {};
		params.roleId = roleId;
		//console.log('roleId' + roleId);
		post_async(params, _config.ajaxUrl.transmitGetRole, callbacktransmitGetRole);
	}

	function callbacktransmitGetRole(data) {
		//console.log(JSON.stringify(data));
		if(data.code == 200) {
			if((data.result.typeId != null && data.result.typeId != '' && data.result.typeName != null && data.result.typeName != '')||data.result.typeId == 0 && data.result.typeName == '总中心') {
				var $input = $('#XLWJforwarding');
				$input.data('key', data.result.typeId);
				$input.val(data.result.typeName);
				_global.XLWJisForwarding = data.result.typeId;
				$('#forwarding').removeClass('noChecked').addClass('isChecked');
				//console.log(JSON.stringify('该角色有转发功能：' + data.result.typeName));
			}
		} else if(data.code == 002) {
			//console.log(JSON.stringify('该角色没有转发功能'));
			_global.XLWJisForwarding = '';
		}
	}

	function transmitList() {
		var parma = {};
		post_async(parma, _config.ajaxUrl.transmitList, callbackXLWJforwardingBox);
	}

	function callbackXLWJforwardingBox(data) {
		//console.log(JSON.stringify(data));
		if(data.code == 200) {
			var $Box = $('#XLWJforwardingBox');
			for(var i = 0; i < data.result.length; i++) {
				$span = $('<span></sapn>');
				$span.attr('name', data.result[i].typeId);
				$span.text(data.result[i].typeName);
				$span.bind('click', function(e) {
					var $this = $(this);
					var $input = $('#XLWJforwarding');
					$input.data('key', $this.attr('name'));
					$input.val($this.text());
					$('#XLWJforwardingBox').addClass('hide').removeClass('show');
				});
				$span.appendTo($Box);
			}
		} else {
			//alert(data.code);
		}
	}

	function _setTransmitSetRole(roleId) {
		//console.log(roleId);
		var isC = $('#forwarding').hasClass('isChecked');
		//console.log(_global.XLWJisForwarding);
		if(_global.XLWJisForwarding == '') { //表示该角色之前没有设置转发权限
			if(isC) { //true添加权限,flase无操作
				var typeId = $('#XLWJforwarding').data('key');
				if(typeId != undefined && typeId != null && typeId != '') {
					//console.log('添加转发权限');
					var parma = {};
					parma.roleId = roleId;
					parma.typeId = typeId;
					//console.log(parma);
					post_async(parma, _config.ajaxUrl.transmitSetRole, callbackTransmitSetRole);
				}
			}
		} else { //表示该角色之前有设置转发权限
			if(isC) { //修改权限
				//console.log('修改转发权限');
				var typeId = $('#XLWJforwarding').data('key');
				if(typeId != undefined && typeId != null && typeId != '') {
					var parma = {};
					parma.roleId = roleId;
					parma.typeId = typeId;
					//console.log(parma);
					post_async(parma, _config.ajaxUrl.transmitSetRole, callbackTransmitSetRole);
				}
			} else { //删除权限
				//console.log('删除转发权限');
				var parma = {};
				parma.roleId = roleId;
				post_async(parma, _config.ajaxUrl.transmitDeleteRole, callbackTransmitDeleteRole);
			}
		}

	}

	function callbackTransmitSetRole(data) {
		//console.log(JSON.stringify(data));
	}

	function callbackTransmitDeleteRole(data) {
		//console.log(JSON.stringify(data));
	}

	//事件绑定函数
	function _initEvent() {
		$('.top', '#contentRight_title').children('label').bind('click', function(e) {
			var isChecked = $(this).parent().hasClass('isChecked');
			if(isChecked) {
				$(this).parent().removeClass('isChecked').addClass('noChecked');
				setDelProcessingList($(this).parent().attr('id'));
				$('.bottom_row > .bottom_row_right','#'+$(this).parent().attr('id')+'_div').removeClass('isChecked').addClass('noChecked');
			} else {
				$(this).parent().removeClass('noChecked').addClass('isChecked');
				setAddProcessingList($(this).parent().attr('id'));
			}
		});

		$('.top', '#contentRight_title').bind('click', function() {
			var $this = $(this);
			var href = $(this).attr('href');
			$(href).show().siblings().hide();
			//console.log($this.attr('id'));
			if($this.hasClass('row_isChecked')) {
				//$this.removeClass('row_isChecked');
			} else {
				$this.addClass('row_isChecked');
				$this.siblings().removeClass('row_isChecked');
			}
		});
		$('#contentRight_title .top:first-child').click();

		$('#XLWJforwarding').bind('click', function(e) {
			var $this = $(this);
			manageDDBox($this, $('#XLWJforwardingBox'));

		});

		$('#forwarding').children('span').bind('click', function(e) {
			var isChecked = $(this).parent().hasClass('isChecked');
			if(isChecked) {
				$(this).parent().removeClass('isChecked').addClass('noChecked');
			} else {
				if($('#snowBrightWJ').hasClass('noChecked')) {
					$('#snowBrightWJ').removeClass('noChecked').addClass('isChecked');
					setAddProcessingList($('#snowBrightWJ').attr('id'));
				}
				$(this).parent().removeClass('noChecked').addClass('isChecked');
			}
		});
	}

	function manageDDBox(ObjDiv, ObjDD) {
		var $ObjDiv = $(ObjDiv);
		var $ObjDD = $(ObjDD);
		var isShow = $ObjDD.hasClass('show');
		if(isShow == true) {
			$ObjDD.addClass('hide').removeClass('show');
		} else {
			$('.ddBox').addClass('hide').removeClass('show');
			var left = $ObjDiv.offset().left + 'px';
			var top = $ObjDiv.offset().top + 24 + 1 + 'px';
			$ObjDD.addClass('show').removeClass('hide');
			$ObjDD.css('top', top);
			$ObjDD.css('left', left);
		}
	}

	function _showRolePermission() {
		var roleId = _global.top.getPopupsRowJson().roleId;
		var params = {};
		params.roleId = roleId;
		//console.log('roleId' + roleId);
		post_async(params, _config.ajaxUrl.getlRolePermission, callbacklRolePermission);
	}

	function callbacklRolePermission(data) {
		//console.log('callbacklRolePermission-------' + JSON.stringify(data.json));
		var result = data.result;

		if(result.code == '200') {
			var json = data.json;
			for(var i = 0; i < json.length; i++) {
				$('#' + json[i].applicationId + ' label').click();
			}
		} else {
			//console.log(result.code);
		}
		$('#contentRight_title .top:first-child').click();
	}

	function setDelProcessingList(id) {
		var addProcessing = _global.addProcessingList;
		var index = null;
		for(var j = 0; j < addProcessing.length; j++) {
			var oJsonProcessing = addProcessing[j];
			if(id == oJsonProcessing) {
				index = j;
				break;
			} else {
				index = -1;
			}
		}
		//console.log('index:' + index);
		addProcessing.splice(index, 1);
		_global.addProcessingList = addProcessing;
		//console.log(JSON.stringify(_global.addProcessingList));
	}

	function setAddProcessingList(id) {
		var addProcessing = _global.addProcessingList;
		if(addProcessing.length > 0) {

			for(var i = 0; i < addProcessing.length; i++) {
				var oJsonProcessing = addProcessing[i];
				if(id == oJsonProcessing) {
					break;
				}
				if(i == addProcessing.length - 1) {
					addProcessing.push(id);
				}
			}

		} else {
			addProcessing.push(id);
		}
		_global.addProcessingList = addProcessing;
		//console.log(JSON.stringify(_global.addProcessingList));
	}

	function _getProcessingList() {
		//console.log(JSON.stringify(_global.addProcessingList));
		return _global.addProcessingList;
	}

})(window, jQuery, undefined);
