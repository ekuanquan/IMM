/**
 * Created by ywhl on 2017/6/8.
 */
$(document).ready(function() {
	$(".registerform").Validform({
		tiptype:2,
		btnSubmitId:"sure",
		callback:sure
	});
	addRoleinit();

});

;
(function(window, $) {
	window.addRoleinit = _init;
	window.sure = _sure;
	window.setAreas=_setAreas;
	window.getAreas=_getAreas;
	window.getAreasId=_getAreasId;
	window.getAreasHalfId=_getAreasHalfId;
	window.setSysCode=_setSysCode;
	window.getSysCode=_getSysCode;

	var _global = {
		top: parent.parent,
		ajaxUrl: {
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
	};

	function _init() {
		_showRole();
		_initEvent();
		$("#close,#cancel").bind('click', function() {
			_global.top._closeCusPopus();
		});
		$('#roleArea').bind('click', function() {
			_global.setAreas="1";
			parent.rolePopusManage('selectAreaByRole',null);
		});
		$('#handle_areaIds').bind('click', function() {
			_global.setAreas="2";
			parent.rolePopusManage('selectAreaByRole',null);
		});
		$('#selectSysCode').bind('click', function() {
			parent.rolePopusManage('selectSysCode',null);
		});
		_global.main=parent.getMain();
	}

	//事件绑定函数
	function _initEvent() {
		$('.top', '#contentRight_title').children('label').bind('click', function(e) {
			var isChecked = $(this).parent().hasClass('isChecked');
			if(isChecked) {
				$(this).parent().removeClass('isChecked').addClass('noChecked');
			}
			else{
				$(this).parent().removeClass('noChecked').addClass('isChecked');
			}
		});

		$('.top', '#contentRight_title').bind('click', function() {
			var $this = $(this);
			var href = $(this).attr('href');
			$(href).show().siblings().hide();
			if($this.hasClass('row_isChecked')) {
			} else {
				$this.addClass('row_isChecked');
				$this.siblings().removeClass('row_isChecked');
			}
		});

        $("div[name=moduleids]").bind('click', function(e) {
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
        });
        //联网报警下功能模块全选按钮
        $("#RDAall").bind("click",function () {
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
        });
        //管理平台下功能模块全选按钮
        $("#Immall").bind("click",function () {
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
        })
	}
	function _showRole() {
		var row_json = _global.top.getRelatedEditRole();
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
		$('#'+data.msg_push).attr("checked","checked");
		$("#platform_name").val(data.platformName);
		_global.platformId=data.platformId;
		for(var i=0;i<data.applicationIds.length;i++){
			$('#'+data.applicationIds[i]).removeClass('noChecked').addClass('isChecked');
		}
		for(var i=0;i<data.moduleIds.length;i++){
			$('#'+data.moduleIds[i]).removeClass('noCheckedm').addClass('isCheckedm');
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
		if(data.result.code == 200) {
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
			_global.top._closeCusPopus();
		} else {
			_global.top.alertTip(data.result.message, 2000,null);
			_global.top._closeCusPopus();
		}
	}
	//用户编号长度最小为9位不足前面补零
	function pad2(num) {
		if ((num + "").length >= 9) return num;
		return pad2("0" + num);
	}
	function _setAreas(nodesId,nodesName,halfnodesId) {
		if(nodesName.length>0){
			if(_global.setAreas=="1") {
				$('#roleArea').val(nodesName.substr(0, nodesName.length - 1));
				_global.purview_areaIds = nodesId;
				_global.purview_areaIdshalf = halfnodesId;
			}
			else{
				$('#handle_areaIds').val(nodesName.substr(0, nodesName.length - 1));
				_global.handle_areaIds = nodesId;
				_global.handle_areaIdshalf = halfnodesId;
			}
		}
	}

	function _getAreas() {
		return {areaType:_global.setAreas,roleId : $('#roleId').val()};
	}
	function getPurview() {
		var applicationIds=[];
		if($("#RDAcenter").hasClass('isChecked')){
			applicationIds.push("RDAcenter");
		}
		if($("#IntegratedMM").hasClass('isChecked')){
			applicationIds.push("IntegratedMM");
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
})(window, jQuery);