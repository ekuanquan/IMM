/**
 * Created by ywhl on 2017/6/8.
 */
$(document).ready(function() {
	addRoleinit();
});

;
(function(window, $) {
	window.addRoleinit = _init;
	window.setAreas=_setAreas;
	window.getAreas=_getAreas;
	window.getAreasId=_getAreasId;
	window.getAreasHalfId=_getAreasHalfId;
	window.setSysCode=_setSysCode;
	window.getSysCode=_getSysCode;
	window.isView=true;

	var _global = {
		top: parent.parent,
		ajaxUrl: {
			transmitList: '/IntegratedMM/role/transmitList.do',
			transmitSetRole: '/IntegratedMM/role/transmitSetRole.do',
			transmitGetRole: '/IntegratedMM/role/transmitGetRole.do',
			transmitDeleteRole: '/IntegratedMM/role/transmitDeleteRole.do',
			update: '/IntegratedMM/roleArea/update.do',
			getRole:'/IntegratedMM/roleArea/getRoleInfoByRoleId.do'
		},
		popupsData: {
			rowJson: ""
		},
		handle_areaIds:[],
		handle_areaIdshalf:[],
		purview_areaIds:[],
		purview_areaIdshalf:[],
		setAreas:'1',
		nodesList:[],
		nodesListChu:[],
		addProcessingList: [],
		selectSysCode:[],
		main:null,
		platformId:"",
		XLWJisForwarding: '', //用来判断该角色是否存在雪亮万家转发权限
	};

	function _init() {
		_showRole();
		_initEvent();
		XLWJinitData();
		$("#close,#cancel").bind('click', function() {
			parent.closeMapPopus();
		});
		$('#roleArea').bind('click', function() {
			_global.setAreas="1";
			parent.rolePopusManage('viewAreaByRole',null);
		});
		$('#handle_areaIds').bind('click', function() {
			_global.setAreas="2";
			parent.rolePopusManage('viewAreaByRole',null);
		});
		$('#selectSysCode').bind('click', function() {
			parent.rolePopusManage('selectSysCode',null);
		});

		$("#handle_areas_only").bind('click', function() {
			var handle_areaIds=$('#handle_areaIds').val();
			if(handle_areaIds.length==0){
				_global.top.alertSuccess("处置区域为空时不能选择！", 2000);
				$("#all").attr("checked","checked");
			}
		});
		_global.main=parent.getMain();
	}

	//事件绑定函数
	function _initEvent() {
		$('#XLWJforwarding').bind('click', function(e) {
			e.stopPropagation();
			var $this = $(this);
			manageDDBox($this, $('#XLWJforwardingBox'));
			$('body').one('click',function(){
				if($('.ddBox').hasClass('show')){
					$('.ddBox').addClass('hide').removeClass('show');
				}
			});
		});

		/*$('.top', '#contentRight_title').children('label').bind('click', function(e) {
			var isChecked = $(this).parent().hasClass('isChecked');
			if(isChecked) {
				$(this).parent().removeClass('isChecked').addClass('noChecked');
			}
			else{
				$(this).parent().removeClass('noChecked').addClass('isChecked');
			}
		});*/

		$('.top', '#contentRight_title').bind('click', function() {
			//table点击事件
			var $this = $(this);
			var href = $(this).attr('href');
			$(href).show().siblings().hide();
			if($this.hasClass('row_isChecked')) {
			} else {
				$this.addClass('row_isChecked');
				$this.siblings().removeClass('row_isChecked');
			}
		});
		/*$("div[name=moduleids]").bind('click', function(e) {
			var $this = $(this);
			var check = $this.hasClass('isCheckedm');
			if(check) {
				$this.removeClass('isCheckedm').addClass('noCheckedm');
                for(var i = 7;i<12;i++){
                    var RId = "#"+i;
                    if($(RId).hasClass('noCheckedm')){
                        $("#RDAall").removeClass('isCheckedm').addClass('noCheckedm');
                    }
                }
                for(var i = 1;i<7;i++){
                    var RId = "#"+i;
                    if($(RId).hasClass('noCheckedm')){
                        $("#Immall").removeClass('isCheckedm').addClass('noCheckedm');
                    }
                }
				if($("#12").hasClass('noCheckedm')){
					$("#Immall").removeClass('isCheckedm').addClass('noCheckedm');
				}
			} else {
				$this.removeClass('noCheckedm').addClass('isCheckedm');
				var tmp = 0;
                for(var i = 7;i<12;i++){
                    var RId = "#"+i;
                    if($(RId).hasClass('isCheckedm')){
                        tmp++;
                    }
                }
                if(tmp == 5){
                    $("#RDAall").removeClass('noCheckedm').addClass('isCheckedm');
				}
                var flag = 0;
                for(var i = 1;i<7;i++){
                    var RId = "#"+i;
                    if($(RId).hasClass('isCheckedm')){
                        flag++;
                    }
                }
				if($("#12").hasClass('isCheckedm')){
					flag++;
				}
				if(flag == 7){
					$("#Immall").removeClass('noCheckedm').addClass('isCheckedm');
				}
			}
		});*/
		//联网报警下功能模块全选按钮
		/*$("#RDAall").bind("click",function () {
            var $this = $(this);
            var check = $this.hasClass('isCheckedm');
            if(check) {
                for(var i = 7;i<12;i++){
                	var RId = "#"+i;
                	$(RId).removeClass('noCheckedm').addClass('isCheckedm');
				}
            } else {
                for(var i = 7;i<12;i++){
                    var RId = "#"+i;
                    $(RId).removeClass('isCheckedm').addClass('noCheckedm');
                }
            }
        });*/
        //管理平台下功能模块全选按钮
        /*$("#Immall").bind("click",function () {
            var $this = $(this);
            var check = $this.hasClass('isCheckedm');
			if(check) {
				for(var i = 1;i<7;i++){
					var RId = "#"+i;
					$(RId).removeClass('noCheckedm').addClass('isCheckedm');
				}
				$("#12").removeClass('noCheckedm').addClass('isCheckedm');
			} else {
				for(var i = 1;i<7;i++){
					var RId = "#"+i;
					$(RId).removeClass('isCheckedm').addClass('noCheckedm');
				}
				$("#12").removeClass('isCheckedm').addClass('noCheckedm');
			}
        })*/
	}
	function _showRole() {
		var row_json = _global.top.getPopupsRowJson();
		_compareroleId(row_json);
		post_async(row_json, _global.ajaxUrl.getRole, callShowRole);
	}
	function callShowRole(data) {
		$('#roleId').val(data.roleId);
		$('#roleName').val(data.roleName);
		$('#roleType').val(data.roleType);
		$('#roleType').data('key',$('#roleType').val());
		$('#fMemo').val(data.fMemo);
		$('#roleArea').val(data.purview_areaNames);
		_global.purview_areaIds=data.purview_areaIds;
		_global.purview_areaIdshalf=data.purview_areaIds_half;
		$('#handle_areaIds').val(data.handle_areaNames);
		_global.handle_areaIds=data.handle_areaIds;
		_global.handle_areaIdshalf=data.handle_areaIds_half;
		_global.selectSysCode=data.default_accept_syscodes;
		$("#platform_name").val(data.platformName);
		_global.platformId=data.platformId;
		$('#'+data.msg_push).attr("checked","checked");
		for(var i=0;i<data.applicationIds.length;i++){
			$('#'+data.applicationIds[i]).removeClass('noChecked').addClass('isChecked');
		}
		for(var i=0;i<data.moduleIds.length;i++){
			$('#'+data.moduleIds[i]).removeClass('noCheckedm').addClass('isCheckedm');
		}
	}
	//比较系统操作员与当前角色是否相同
	function _compareroleId(data) {
		sysroleId = _global.top.getSysroleId();//获取系统操作员角色

		if(data.roleId == sysroleId){
			//alert("是当前角色");
			$(":input").css({
                "pointer-events": "none",
                "opacity": "0.5"
            });
			/*$("#selectSysCode").css({
                "pointer-events": "none",
                "opacity": "0.5"
            });*/
            $(".top>label").css({
                "pointer-events": "none",
                "opacity": "0.5"
            });
            $(".isCheckedm").css({
                "pointer-events": "none",
                "opacity": "0.5"
            });
            $(".noCheckedm").css({
                "pointer-events": "none",
                "opacity": "0.5"
            });
            $("#sure").css({
                "pointer-events": "none",
                "opacity": "0.5"
            });
		}
    }
	function _getParams() {
		var params = {};
		params.roleId = pad2($('#roleId').val());
		params.roleName = $('#roleName').val();
		params.roleType =  $('#roleType').val();
		params.fMemo = $('#fMemo').val();
		params.applicationIds = getPurview();
		params.purview_areaNames = $('#roleArea').val();
		params.purview_areaIds = _global.purview_areaIds;
		params.handle_areaNames = $('#handle_areaIds').val();
		params.handle_areaIds = _global.handle_areaIds;
		params.purview_areaIds_half = _global.purview_areaIdshalf;
		params.handle_areaIds_half = _global.handle_areaIdshalf;
		params.moduleIds = getModuleids();
		params.msg_push = getMsg();
		params.syscodes =_global.selectSysCode;
		params.platformId=_global.platformId;
		_addRole(params);
	}
	function _addRole(params) {
		////console.log('_addRole-----' + JSON.stringify(params));
		post_async(params, _global.ajaxUrl.update, callbackRefreshList);

		_setTransmitSetRole(params.roleId);
	}

	function _sendRole() {
		var role = {};
		role.roleId = pad2($('#roleId').val());
		role.roleName = $('#roleName').val();
		role.roleType = $('#roleType').val();
		role.roleArea=_global.nodesList;
		role.fMemo = $('#fMemo').val();
		if(_global.top.mainDivIframe) {
			if(_global.top.mainDivIframe.alterUserIframe.setRole && (typeof(_global.top.mainDivIframe.alterUserIframe.setRole) == 'function')) {
				_global.top.mainDivIframe.alterUserIframe.setRole(role);
			}
		}
	}
	function _sure(flag){
		if(flag){
			handleAddToPurview();
		}else{
			_global.top.alertWarn("请填写完整信息",2000,null);
		}
	}
	function callbackRefreshList(data) {
		if(data.code == "200") {
			var roleType = $('#roleType').data('key');
			//添加完后改变树的选中状态
			if(parent.permissionIframe&&parent.permissionIframe.clickNode&&(typeof (parent.permissionIframe.clickNode)=='function')){
				parent.permissionIframe.clickNode(roleType);
			}
			_sendRole();
			_global.top.alertSuccess("角色信息保存成功", 2000);
			if(_global.top.permissionIframe.roleManagementIframe&&_global.top.permissionIframe.roleManagementIframe.setRoleType && (typeof(_global.top.permissionIframe.roleManagementIframe.setRoleType) == 'function')) {
				_global.top.permissionIframe.roleManagementIframe.setRoleType(roleType);
			}
			if(_global.top.permissionIframe.roleManagementIframe && _global.top.permissionIframe.roleManagementIframe.getRole && (typeof(_global.top.permissionIframe.roleManagementIframe.getRole) == 'function')) {
				_global.top.permissionIframe.roleManagementIframe.getRole();
			}
			parent.closeMapPopus();
		} else {
			_global.top.alertTip(data.result.message, 2000,null);
			parent.closeMapPopus();
		}
	}
	//用户编号长度最小为9位不足前面补零
	function pad2(num) {
		if ((num + "").length >= 9) return num;
		return pad2("0" + num);
	}
	function _setAreas(nodesId,nodesName,halfnodesId) {
		if(_global.setAreas=="1") {
			if(nodesName.length>0) {
				$('#roleArea').val(nodesName.substr(0, nodesName.length - 1));
			}else{
				$('#roleArea').val("");
			}
			_global.purview_areaIds = nodesId;
			_global.purview_areaIdshalf = halfnodesId;
		}
		else{
			if(nodesName.length>0) {
				$('#handle_areaIds').val(nodesName.substr(0, nodesName.length - 1));
			}else{
				$('#handle_areaIds').val("");
				$("#all").attr("checked","checked");
			}
			_global.handle_areaIds = nodesId;
			_global.handle_areaIdshalf = halfnodesId;
		}
	}
	function _getAreas() {
		return {
			areaType:_global.setAreas,
			roleId : $('#roleId').val(),
            platformId:_global.platformId
		};
	}
	function getPurview() {
		var applicationIds=[];
		if($("#RDAcenter").hasClass('isChecked')){
			applicationIds.push("RDAcenter");
		}
		if($("#IntegratedMM").hasClass('isChecked')){
			applicationIds.push("IntegratedMM");
		}
		if($("#PublicSafetyManagement").hasClass('isChecked')){
			applicationIds.push("PublicSafetyManagement");
		}
		if($("#compositeOperation").hasClass('isChecked')){
			applicationIds.push("compositeOperation");
		}
		if($("#commandPlatform_shared").hasClass('isChecked')){
			applicationIds.push("commandPlatform_shared");
		}
		if($("#faceBayonet").hasClass('isChecked')){
			applicationIds.push("faceBayonet");
		}
		if($("#scityvehiclegate").hasClass('isChecked')){
			applicationIds.push("scityvehiclegate");
		}
		if($("#snowBrightWJ").hasClass('isChecked')){
			applicationIds.push("snowBrightWJ");
		}
		if($("#Sys_GPSMonitor").hasClass('isChecked')){
			applicationIds.push("Sys_GPSMonitor");
		}
		return applicationIds;
	}
	function getModuleids() {
		var moduleids=[];
		$("div[name=moduleids]").each(function(){
			var $this = $(this);
			var check = $this.hasClass('isCheckedm');
			if(check) {
				moduleids.push($this.attr("id"));
			}
		});
		return moduleids;
	}
	function getMsg(){
		return $('input:radio[name="msg"]:checked').attr("id");
	}
	function _getAreasId() {
		if(_global.setAreas=="1") {
			return _global.purview_areaIds ;
		}
		else{
			return _global.handle_areaIds;
		}
	}
	function _getAreasHalfId() {
		if(_global.setAreas=="1") {
			return _global.purview_areaIdshalf ;
		}
		else{
			return _global.handle_areaIdshalf;
		}
	}
	function _setSysCode(selectSysCode) {
		_global.selectSysCode = selectSysCode;
	}
	function _getSysCode() {
		return _global.selectSysCode;
	}

	function handleAddToPurview() {
		var purview_areaIds=_global.purview_areaIds;
		var handle_areaIds=_global.handle_areaIds;
		var flag=false;
		for(var j=0;j<handle_areaIds.length;j++){
			if(!contains(purview_areaIds,handle_areaIds[j])){
				flag=true;
				break;
			}
		}
		if(flag==true){
			_global.top.okAndCancelAndMsg("处置区域中存在权限区域以外的区域，是否要添加进权限区域？如果不添加，则将这部分区域从处置区域中移除。",OkFun,cancelFun);
		}
		else{
			_getParams();
		}
	}
	function OkFun() {
		var purview_areaIds=_global.purview_areaIds;
		var handle_areaIds=_global.handle_areaIds;
		for(var j=0;j<handle_areaIds.length;j++){
			if(!contains(purview_areaIds,handle_areaIds[j])){
				_global.purview_areaIds.push(handle_areaIds[j]);
			}
		}
		_getParams();
	}
	function cancelFun() {
		var purview_areaIds=_global.purview_areaIds;
		var handle_areaIds=_global.handle_areaIds;
		_global.handle_areaIds=[];
		for(var j=0;j<handle_areaIds.length;j++){
			if(contains(purview_areaIds,handle_areaIds[j])){
				_global.handle_areaIds.push(handle_areaIds[j]);
			}
		}
		_getParams();
	}
	function contains(arr, obj) {
		var i = arr.length;
		while (i--) {
			if (arr[i] === obj) {
				return true;
			}
		}
		return false;
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
		post_async(params, _global.ajaxUrl.transmitGetRole, callbacktransmitGetRole);
	}

	function callbacktransmitGetRole(data) {
		//console.log(JSON.stringify(data));
		if(data.code == 200) {
			if((data.result.typeId != null && data.result.typeId != '' && data.result.typeName != null && data.result.typeName != '')||data.result.typeId == 0 && data.result.typeName == '总中心') {
				var $input = $('#XLWJforwarding');
				$input.data('key', data.result.typeId);
				$input.val(data.result.typeName);
				_global.XLWJisForwarding = data.result.typeId;
				$('#forwarding').removeClass('noCheckedm').addClass('isCheckedm');
				//console.log(JSON.stringify('该角色有转发功能：' + data.result.typeName));
			}
		} else if(data.code == 002) {
			//console.log(JSON.stringify('该角色没有转发功能'));
			_global.XLWJisForwarding = '';
		}
	}

	function transmitList() {
		var parma = {};
		post_async(parma, _global.ajaxUrl.transmitList, callbackXLWJforwardingBox);
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
		var isC = $('#forwarding').hasClass('isCheckedm');
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
					post_async(parma, _global.ajaxUrl.transmitSetRole, callbackTransmitSetRole);
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
					post_async(parma, _global.ajaxUrl.transmitSetRole, callbackTransmitSetRole);
				}
			} else { //删除权限
				//console.log('删除转发权限');
				var parma = {};
				parma.roleId = roleId;
				post_async(parma, _global.ajaxUrl.transmitDeleteRole, callbackTransmitDeleteRole);
			}
		}

	}

	function callbackTransmitSetRole(data) {
		//console.log(JSON.stringify(data));
	}

	function callbackTransmitDeleteRole(data) {
		//console.log(JSON.stringify(data));
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

})(window, jQuery);