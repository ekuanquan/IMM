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
	window.setSysCode=_setSysCode;
	window.getSysCode=_getSysCode;
	window.isEmpty = isEmpty;

    var _global = {
        top: parent.parent,
        ajaxUrl: {
            transmitList:'/IntegratedMM/role/transmitList.do',
            addRole: '/IntegratedMM/roleArea/add.do',
            transmitSetRole:'/IntegratedMM/role/transmitSetRole.do'
        },
        popupsData: {
            rowJson: ""
        },
        setAreas:'1',
        handle_areaIds:[],
        handle_areaIdshalf:[],
        purview_areaIds:[],
        purview_areaIdshalf:[],
        nodesList:[],
        nodesListChu:[],
        addProcessingList: [],
        selectSysCode:[],
        main:null,
        bool:true
    };

	function _init() {
        _initEvent();
		$("#close,#cancel").bind('click', function() {
			parent.closeMapPopus();
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
		$("#handle_areas_only").bind('click', function() {
			var handle_areaIds=$('#handle_areaIds').val();
			if(handle_areaIds.length==0){
				_global.top.alertSuccess("处置区域为空时不能选择！", 2000);
				$("#all").attr("checked","checked");
			}
		});
		_global.main=parent.getMain();
		$("#platform_name").val(_global.main.platform_name);
		//请求雪亮万家的转发权限数据
		XLWJinitData();
	}

	//事件绑定函数
	function _initEvent() {
        $('#roleId').editableSelect({
            effects: 'default',
        });
        $("#roleId_sele").attr("maxlength","9").attr("datatype","16number").attr("nullmsg","角色编号不能为空").attr("errormsg","请输入角色编号（16进制数组成）！").attr("onblur","isEmpty('roleId_sele');");
        $("#roleId_sele").bind("input propertychange",function(){
            var roleId = $("#roleId_sele").val();
            if(roleId.length>5){
                var param = {
                    type:"roleUsed",
                    value:roleId
                };
                post_async(param,"/IntegratedMM/identifier/queryIdByLike.do",_callback_getroleId)
            }else{
                $("#roleId_editable-select-options ul").empty();
            }

        });
        //失去焦点后将值赋给roleId input
        $("#roleId_sele").bind("blur",function(){
            $("#roleId").val($("#roleId_sele").val());
            console.log("roleId:"+$("#roleId").val());
        });
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

	function _getParams() {

		var params = {};
		params.roleId = pad2($('#roleId').val());
		params.roleName = $('#roleName').val();
		params.roleType =  $('#roleType').val();
		$('#roleType').data('key',$('#roleType').val());
		params.fMemo = $('#fMemo').val();
		params.applicationIds = getPurview();
		params.purview_areaIds = _global.purview_areaIds;
		params.handle_areaIds = _global.handle_areaIds;
		params.purview_areaIds_half = _global.purview_areaIdshalf;
		params.handle_areaIds_half = _global.handle_areaIdshalf;
		params.moduleIds = getModuleids();
		params.msg_push = getMsg();
		params.syscodes =_global.selectSysCode;
		params.platformId=_global.main.platform_id;
		_addRole(params);
	}
	function _addRole(params) {
		////console.log('_addRole-----' + JSON.stringify(params));
		post_async(params, _global.ajaxUrl.addRole, callbackRefreshList);

		var isC = $('#forwarding').hasClass('isCheckedm');
		if (isC) {
			var typeId = $('#XLWJforwarding').data('key');
			if(typeId!=undefined&&typeId!=null&&typeId!=''){
				var parma = {};
				parma.roleId = params.roleId;
				parma.typeId = typeId;
				//console.log(parma);
				post_async(parma,_global.ajaxUrl.transmitSetRole);
			}
		}

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
        isEmpty('roleId_sele');
        if(_global.bool) {
            if (flag) {
                handleAddToPurview();
                //_getParams();
            } else {
                _global.top.alertWarn("请填写完整信息", 2000, null);
            }
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
            _global.top.alertTip(data.message, 2000,null);
			//parent.closeMapPopus();
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
			roleId : "",
			platformId:_global.main.platform_id
		};
	}

	function _getAreasId() {
		if(_global.setAreas=="1") {
			return _global.purview_areaIds ;
		}
		else{
			return _global.handle_areaIds;
		}
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
	function XLWJinitData(){
		var parma = {};
		post_async(parma,_global.ajaxUrl.transmitList,callbackXLWJforwardingBox);
	}

	function callbackXLWJforwardingBox(data){
		//console.log(JSON.stringify(data));
		if(data.code==200){
			var $Box =  $('#XLWJforwardingBox');
			for (var i = 0;i<data.result.length;i++) {
				$span = $('<span></sapn>');
				$span.attr('name',data.result[i].typeId);
				$span.text(data.result[i].typeName);
				$span.bind('click',function(e) {
					var $this = $(this);
					var $input = $('#XLWJforwarding');
					$input.data('key', $this.attr('name'));
					$input.val($this.text());
					$('#XLWJforwardingBox').addClass('hide').removeClass('show');
				});
				$span.appendTo($Box);
			}
		}
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

    //获取可用的机主编号
    function _callback_getroleId(data) {
        $("#roleId_editable-select-options ul").empty();
        if(data.result.code&&data.result.code=="200"){
            var length = data.values.length;
            if(length>10){length=10;}
            for(var i=0;i<length;i++){
                var $option =$("<li></li>");
                $option.attr("value",i);
                $option.text(data.values[i]);
                $option.attr("style","display: list-item;");
                $option.appendTo($("#roleId_editable-select-options > ul"));
            }
            $("#roleId_editable-select-options").css("display","block");
        }
        $("#roleId_editable-select-options ul li").bind("mousedown",function () {
            $("#roleId_sele").val(this.innerHTML);
        }).bind("mouseover",function () {
            this.siblings().removeClass("selected");
            this.addClass("selected");
            //this.css("background","blue");
        })
    }
    function isEmpty(field){
        var textValue = $("#"+field).val();
        if(textValue != ""){
            post_async(
                {
                    "validateName":"roleId",
                    "validateValue":textValue
                },
                "/IntegratedMM/validate/isCanUse.do",
                validate_callback);
        }
        else{

        }
    }
    function validate_callback(data){
        if(data.result.code == "0"){
            _global.bool=true;
            $("#roleId_sele").next().removeClass("Validform_sigh").removeClass("Validform_wrong").addClass("Validform_right");
        }else if(data.result.code == "1"){
            _global.bool = false;
            _global.top.alertFail("该角色编号已经存在",2000,null);
            $("#roleId_sele").next().removeClass("Validform_sigh").removeClass("Validform_right").addClass("Validform_wrong");
        }else if(data.result.code == "2"){
            _global.bool = false;
            _global.top.alertFail("该设备编号格式有误",2000,null);
            $("#roleId_sele").next().removeClass("Validform_sigh").removeClass("Validform_right").addClass("Validform_wrong");
        }
    }


})(window, jQuery);
